// ==UserScript==
// @name         Auto Unfollow Instagram
// @namespace    https://kohardsi.my.id
// @version      3.1.0
// @description  Automatically unfollow users who do not follow you back on Instagram with UI control and progress bar.
// @author       Teja Sukmana
// @match        https://www.instagram.com/*
// @icon         https://kohardsi.my.id/wp-content/uploads/2024/12/logo-kohar.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_openInTab
// @license      MIT
// @run-at       document-idle
// @homepage     https://kohardsi.my.id
// @supportURL   https://kohardsi.my.id
// @downloadURL https://update.greasyfork.org/scripts/535301/Auto%20Unfollow%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/535301/Auto%20Unfollow%20Instagram.meta.js
// ==/UserScript==

(async () => {
  /* ========== HELPER ========== */
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const randomDelay = (base = 7000, variation = 3000) =>
    base + Math.floor(Math.random() * variation);
  const getCookie = name => {
    const v = `; ${document.cookie}`.split(`; ${name}=`);
    return v.length === 2 ? v.pop().split(';').shift() : null;
  };

  /* akun yang tidak akan di‑unfollow */
  const SKIP_USERS = ['kohardsi', 'instagram', 'meta', 'verified'];
  const SKIP_USERS_LOWER = SKIP_USERS.map(u => u.toLowerCase());

  /* ========== UI ========== */
  const ui = document.createElement('div');
  ui.innerHTML = `
  <style>
    #unfollowPanel h3{ text-align:center;font-size:20px;padding:0 0 10px;}
    #unfollowFloatingBtn{position:fixed;bottom:20px;right:20px;z-index:999999;background:#1e1e1e;color:#fff;border:none;border-radius:50%;width:50px;height:50px;font-size:24px;cursor:pointer;box-shadow:0 0 10px rgba(0,0,0,.3);}
    #unfollowPanel{position:fixed;bottom:80px;right:20px;background:#121212;color:#fff;border-radius:12px;padding:20px;max-width:300px;font-family:sans-serif;box-shadow:0 0 20px rgba(0,0,0,.4);z-index:999999;display:none;}
    #unfollowPanel input{width:100%;padding:6px;margin:5px 0 10px;background:#2c2c2c;color:#fff;border:1px solid #444;border-radius:6px;}
    #unfollowPanel button{width:100%;padding:8px;margin-top:10px;border:none;border-radius:6px;cursor:pointer;}
    #unfollowStartBtn{background:green;color:#fff;}
    #unfollowPauseBtn{background:#555;color:#fff;}
    #unfollowCloseBtn{background:crimson;color:#fff;}
    #unfollowList{margin-top:10px;max-height:100px;overflow-y:auto;font-size:12px;}
    #unfollowProgress{background:#444;border-radius:4px;height:10px;overflow:hidden;margin:10px 0;}
    #unfollowProgressBar{height:100%;background:limegreen;width:0%;transition:width .3s;}
    .rate-limit-warning{color:orange;font-size:12px;margin-top:10px;display:none;}
  </style>
  <button id="unfollowFloatingBtn">⚙️</button>
  <div id="unfollowPanel">
    <h3>Auto Unfollow</h3>
    <div class="rate-limit-warning" id="rateLimitWarning">⚠️ Jeda 15 menit karena batasan Instagram</div>
    <label>Limit Unfollow:</label><input type="number" id="unfollowLimit" value="10" min="1"/>
    <label>Jeda per akun (ms):</label><input type="number" id="unfollowDelay" value="7000" min="3000"/>
    <button id="unfollowStartBtn">Mulai</button>
    <button id="unfollowPauseBtn">Pause</button>
    <button id="unfollowCloseBtn">Tutup</button>
    <div id="unfollowProgress"><div id="unfollowProgressBar"></div></div>
    <div id="unfollowCount">Total di‑unfollow: 0</div>
    <div id="unfollowList"></div>
    <div style="margin-top:10px;font-size:10px;">© <a href="https://instagram.com/kohardsi" target="_blank" style="color:#999;">kohardsi</a></div>
  </div>`;
  document.body.appendChild(ui);

  /* ========== UI refs ========== */
  const btnToggle = document.getElementById('unfollowFloatingBtn');
  const panel = document.getElementById('unfollowPanel');
  const startBtn = document.getElementById('unfollowStartBtn');
  const pauseBtn = document.getElementById('unfollowPauseBtn');
  const closeBtn = document.getElementById('unfollowCloseBtn');
  const unfollowListDiv = document.getElementById('unfollowList');
  const unfollowCountEl = document.getElementById('unfollowCount');
  const progressBar = document.getElementById('unfollowProgressBar');
  const rateLimitWarning = document.getElementById('rateLimitWarning');

  let paused = false, totalToUnfollow = 0, unfollowedCount = 0;

  btnToggle.onclick = () => panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  closeBtn.onclick = () => panel.style.display = 'none';
  pauseBtn.onclick = () => {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Lanjutkan' : 'Jeda';
    pauseBtn.style.background = paused ? 'orange' : '#555';
  };

  const updateProgress = () => {
    progressBar.style.width = totalToUnfollow ? (unfollowedCount / totalToUnfollow * 100) + '%' : '0%';
    unfollowCountEl.textContent = `Total di‑unfollow: ${unfollowedCount}/${totalToUnfollow}`;
  };
  const updateList = (u, fail=false) => {
    const d = document.createElement('div');
    d.textContent = `${fail ? '❌ Gagal' : '✅ Berhasil'}: ${u}`;
    d.style.color = fail ? 'orangered' : 'lightgreen';
    unfollowListDiv.appendChild(d);
    unfollowListDiv.scrollTop = unfollowListDiv.scrollHeight;
  };

  /* ---- Unfollow satu akun ---- */
  const unfollowUser = async (userId, username, attempt = 1) => {
    const csrftoken = getCookie('csrftoken');
    if (!csrftoken) { updateList(username, true); return; }

    try {
      const response = await fetch(`https://www.instagram.com/web/friendships/${userId}/unfollow/`, {
        method:'POST',
        headers:{
          'X-CSRFToken':csrftoken,'Accept':'*/*',
          'Content-Type':'application/x-www-form-urlencoded',
          'X-Requested-With':'XMLHttpRequest','Referer':location.href,
          'User-Agent':navigator.userAgent
        },credentials:'include'
      });

      /* === PATCH 1: deteksi HTTP 429 === */
      if (response.status === 429) throw new Error('rate limited');

      const data = await response.json();
      if (data.status === 'ok') {
        unfollowedCount++; updateList(username); updateProgress();
      } else throw new Error(data.message||'Unknown');
    } catch (e) {
      console.error(`Unfollow ${username} error:`, e.message);
      if (e.message.includes('rate limited') || attempt >= 3) {
        rateLimitWarning.style.display = 'block'; paused = true;
        pauseBtn.textContent = 'Lanjutkan'; pauseBtn.style.background = 'orange';
        setTimeout(()=>{ paused=false;rateLimitWarning.style.display='none';
          pauseBtn.textContent='Jeda';pauseBtn.style.background='#555'; },900000);
        updateList(username,true); return;
      }
      await sleep(2000); return unfollowUser(userId, username, attempt+1);
    }
    await sleep(randomDelay(+document.getElementById('unfollowDelay').value||7000));
  };

  /* ---- cek hubungan detail ---- */
/* =======================================================
   HYBRID FRIENDSHIP CHECKER
   ======================================================= */

/* — a. GraphQL web (prioritas) — */
const queryFriendHash = '3cabfbb5a7206eb0a60c5f93d3b1d6b'; // relationship hash
async function checkFriendshipGraphQL(id) {
  try {
    const vars = { user_id: id };
    const r = await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=${queryFriendHash}&variables=${encodeURIComponent(JSON.stringify(vars))}`,
      {
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
          'Accept': '*/*',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': location.href,
          'User-Agent': navigator.userAgent
        },
        credentials: 'include'
      }
    );
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    return {
      followed_by: d.data.user.is_followed_by_viewer,
      following  : d.data.user.follows_viewer
    };
  } catch (err) {
    console.warn('GraphQL friendship error', err);
    return null;
  }
}

/* — b. Mobile‑API fallback — */
async function checkFriendshipMobile(id) {
  try {
    const r = await fetch(
      `https://www.instagram.com/api/v1/friendships/show/${id}/`,
      {
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
          'X-IG-App-ID': '936619743392459',
          'X-IG-WWW-Claim': '0',
          'Accept': '*/*',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': location.href,
          'User-Agent': navigator.userAgent
        },
        credentials: 'include'
      }
    );
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    return { followed_by: d.followed_by, following: d.following };
  } catch (err) {
    console.warn('Mobile friendship error', err);
    return null;
  }
}

/* — c. Wrapper yang memilih otomatis — */
let currentChecker = checkFriendshipGraphQL;     // mulai dengan GraphQL
async function safeCheckFriendship(id) {
  let rel = await currentChecker(id);
  if (rel === null && currentChecker === checkFriendshipGraphQL) {
    console.warn('⌛ GraphQL gagal – switch ke Mobile API');
    currentChecker = checkFriendshipMobile;      // ganti sekali untuk sesi ini
    rel = await currentChecker(id);
  }
  return rel;
}


  /* ---- Tombol MULAI ---- */
startBtn.onclick = async () => {
  paused = false;
  unfollowedCount = 0;
  unfollowListDiv.innerHTML = '';
  rateLimitWarning.style.display = 'none';
  updateProgress();
  unfollowCountEl.textContent = '🔄  Mengumpulkan data … harap tunggu';

  const limit = parseInt(document.getElementById("unfollowLimit").value) || 10;
    const ds_user_id = getCookie('ds_user_id');
    if(!ds_user_id){alert('❌ Login ulang! ds_user_id hilang');return;}

    const queryHash = 'c56ee0ae1f89cdbd1c89e2bc6b8f3d18';
    let hasNextPage = true, endCursor=null, toUnfollow=[];

    while(hasNextPage && toUnfollow.length<limit){
      const variables={id:ds_user_id,include_reel:true,fetch_mutual:false,first:50,after:endCursor};
      try{
        const r = await fetch(`https://www.instagram.com/graphql/query/?query_hash=${queryHash}&variables=${encodeURIComponent(JSON.stringify(variables))}`,{
          headers:{'X-CSRFToken':getCookie('csrftoken'),'Accept':'*/*','X-Requested-With':'XMLHttpRequest','Referer':location.href,'User-Agent':navigator.userAgent},
          credentials:'include'
        });
        const data=await r.json(), edges=data.data.user.edge_follow.edges;
        for(const edge of edges){
          const user=edge.node, uname=user.username.toLowerCase();
          if(SKIP_USERS_LOWER.includes(uname)||user.is_verified) continue;

          /* kasus 1: flag lengkap */
          if(user.followed_by_viewer===true && user.follows_viewer===false){
            toUnfollow.push({id:user.id,username:user.username});
          }
          /* kasus 2: flag null → cek API detail */
          else if(user.followed_by_viewer===true && user.follows_viewer==null){
            const fr = await safeCheckFriendship(user.id);
            if(fr && fr.following && !fr.followed_by){
              toUnfollow.push({id:user.id,username:user.username});
            } else if(!fr){
              updateList(user.username,true);        /* === PATCH 2 === */
            }
            await sleep(1000);
          }
          if(toUnfollow.length>=limit) break;
        }
        hasNextPage=data.data.user.edge_follow.page_info.has_next_page;
        endCursor=data.data.user.edge_follow.page_info.end_cursor;
        await sleep(2000);
      }catch(e){console.error('Get following error:',e);break;}
    }

    totalToUnfollow=Math.min(toUnfollow.length,limit); updateProgress();
    for(const u of toUnfollow.slice(0,limit)){
      while(paused) await sleep(1000);
      await unfollowUser(u.id,u.username);
    }
    alert(`✅ Selesai! Berhasil unfollow: ${unfollowedCount}/${totalToUnfollow} akun`);
  };
})();

