// ==UserScript==
// @name         Dogdrip 깔끔한 차단 설정 사이드바
// @namespace    https://dogdrip.net/
// @version      3.3
// @description  슬라이딩 사이드바 + 아코디언 섹션 + 설정 공유 기능
// @match        https://www.dogdrip.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539258/Dogdrip%20%EA%B9%94%EB%81%94%ED%95%9C%20%EC%B0%A8%EB%8B%A8%20%EC%84%A4%EC%A0%95%20%EC%82%AC%EC%9D%B4%EB%93%9C%EB%B0%94.user.js
// @updateURL https://update.greasyfork.org/scripts/539258/Dogdrip%20%EA%B9%94%EB%81%94%ED%95%9C%20%EC%B0%A8%EB%8B%A8%20%EC%84%A4%EC%A0%95%20%EC%82%AC%EC%9D%B4%EB%93%9C%EB%B0%94.meta.js
// ==/UserScript==

(function(){
  'use strict';

  const STORAGE_U = 'dd_blocked_users';
  const STORAGE_K = 'dd_blocked_keywords';
  let blockedUsers    = JSON.parse(localStorage.getItem(STORAGE_U) || '[]');
  let blockedKeywords = JSON.parse(localStorage.getItem(STORAGE_K) || '[]');

  const save = () => {
    localStorage.setItem(STORAGE_U, JSON.stringify(blockedUsers));
    localStorage.setItem(STORAGE_K, JSON.stringify(blockedKeywords));
  };

  // ─── 필터 함수 ────────────────────────────────────────────────────────────────
  function filterBoardList(){
    document.querySelectorAll('li.ed.flex.flex-left.flex-middle').forEach(post=>{
      const nick = post.querySelector('a.link-reset.text-default')?.textContent.trim()||'';
      const txt  = post.textContent.toLowerCase();
      if(blockedUsers.includes(nick) || blockedKeywords.some(kw=>txt.includes(kw))){
        post.style.display='none';
      }
    });
  }
  function filterMainPage(){
    document.querySelectorAll('.widget-normal li').forEach(li=>{
      const title = li.querySelector('span.text-default.text-link')?.textContent.trim().toLowerCase()||'';
      if(blockedKeywords.some(kw=>title.includes(kw))){
        li.style.display='none';
      }
    });
  }
  function filterCommentList(){
    document.querySelectorAll('div.ed.comment-item').forEach(c=>{
      const body = c.querySelector('.xe_content');
      if (!body || body.dataset.filtered) return;
      const nick    = c.querySelector('a[class*="member_"]')?.textContent.trim()||'';
      const content = body.textContent.toLowerCase();
      if(blockedUsers.includes(nick) || blockedKeywords.some(kw=>content.includes(kw))){
        body.textContent = '차단된 댓글입니다';
        body.style.opacity = '0.6';
        body.style.fontStyle = 'italic';
        body.dataset.filtered = 'true';
      }
    });
  }
  function runAll(){
    filterBoardList();
    filterMainPage();
    filterCommentList();
  }

  // ─── 사이드바 HTML/CSS 삽입 ───────────────────────────────────────────────────
  const css = `
    #dd-sidebar {
      position: fixed; top: 0; right: -280px; width: 280px; height: 100%;
      background: #fff; box-shadow: -2px 0 8px rgba(0,0,0,0.15);
      transition: right .3s ease; z-index: 9999; font-family: sans-serif;
      display: flex; flex-direction: column;
    }
    #dd-sidebar.open { right: 0; }

    #dd-sidebar header {
      padding: 16px; font-size: 18px; font-weight: bold;
      border-bottom: 1px solid #eee;
    }
    #dd-sidebar .section {
      border-bottom: 1px solid #f0f0f0;
    }
    #dd-sidebar h5 {
      margin: 0; padding: 12px 16px; cursor: pointer;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 15px; background: #fafafa;
    }
    #dd-sidebar .section-content {
      display: none; padding: 8px 16px;
    }
    #dd-sidebar .section-content.active { display: block; }

    #dd-sidebar ul { list-style: none; padding: 0; margin: 8px 0; max-height: 100px; overflow-y: auto; }
    #dd-sidebar li { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
    #dd-sidebar input, #dd-sidebar textarea { width: 100%; box-sizing: border-box; padding: 6px; margin-bottom: 8px; font-size: 14px; border: 1px solid #ddd; border-radius:4px; }
    #dd-sidebar button { padding: 6px 12px; font-size: 14px; border: none; background: #007bff; color: #fff; border-radius:4px; cursor: pointer; }
    #dd-sidebar button.small { padding: 4px 8px; font-size: 12px; background: #dc3545; }
    #dd-toggle {
      position: fixed; top: 20px; right: 20px; width: 40px; height: 40px;
      background: #007bff; color: #fff; border: none; border-radius: 50%;
      font-size: 20px; cursor: pointer; z-index: 10000;
      display: flex; align-items: center; justify-content: center;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);

  const sidebar = document.createElement('div');
  sidebar.id = 'dd-sidebar';
  sidebar.innerHTML = `
    <header>차단 설정</header>

    <div class="section">
      <h5 data-sec="user">사용자 <span>＋</span></h5>
      <div class="section-content" id="sec-user">
        <ul id="user-list"></ul>
        <input id="user-input" placeholder="닉네임 입력">
        <button id="user-add">추가</button>
      </div>
    </div>

    <div class="section">
      <h5 data-sec="kw">키워드 <span>＋</span></h5>
      <div class="section-content" id="sec-kw">
        <ul id="kw-list"></ul>
        <input id="kw-input" placeholder="키워드 입력">
        <button id="kw-add">추가</button>
      </div>
    </div>

    <div class="section" style="margin-top:auto;">
      <h5 data-sec="share">설정 공유</h5>
      <div class="section-content active" id="sec-share">
        <button id="export-btn">내보내기</button>
        <textarea id="import-txt" placeholder="JSON 붙여넣기" style="height:60px;"></textarea>
        <button id="import-btn">적용</button>
      </div>
    </div>
  `;
  document.body.append(sidebar);

  const toggle = document.createElement('button');
  toggle.id = 'dd-toggle';
  toggle.textContent = '⚙️';
  document.body.append(toggle);

  toggle.addEventListener('click', ()=> sidebar.classList.toggle('open'));

  // ─── 리스트 렌더링 & 이벤트 ─────────────────────────────────────────────────
  function render(){
    const ulU = sidebar.querySelector('#user-list');
    const ulK = sidebar.querySelector('#kw-list');
    ulU.innerHTML = ''; ulK.innerHTML = '';
    blockedUsers.forEach((u,i)=>{
      const li = document.createElement('li');
      li.textContent = u;
      const btn = document.createElement('button');
      btn.textContent = '✕'; btn.classList.add('small');
      btn.onclick = ()=> { blockedUsers.splice(i,1); save(); render(); runAll(); };
      li.append(btn); ulU.append(li);
    });
    blockedKeywords.forEach((k,i)=>{
      const li = document.createElement('li');
      li.textContent = k;
      const btn = document.createElement('button');
      btn.textContent = '✕'; btn.classList.add('small');
      btn.onclick = ()=> { blockedKeywords.splice(i,1); save(); render(); runAll(); };
      li.append(btn); ulK.append(li);
    });
  }
  render();

  sidebar.querySelector('#user-add').onclick = ()=>{
    const v = sidebar.querySelector('#user-input').value.trim();
    if(v && !blockedUsers.includes(v)){ blockedUsers.push(v); save(); render(); runAll(); }
    sidebar.querySelector('#user-input').value='';
  };
  sidebar.querySelector('#kw-add').onclick = ()=>{
    const v = sidebar.querySelector('#kw-input').value.trim().toLowerCase();
    if(v && !blockedKeywords.includes(v)){ blockedKeywords.push(v); save(); render(); runAll(); }
    sidebar.querySelector('#kw-input').value='';
  };

  sidebar.querySelector('#export-btn').onclick = ()=>{
    const data = JSON.stringify({ users:blockedUsers, keywords:blockedKeywords });
    navigator.clipboard.writeText(data).then(_=>alert('클립보드에 복사됨'));
  };
  sidebar.querySelector('#import-btn').onclick = ()=>{
    try {
      const obj = JSON.parse(sidebar.querySelector('#import-txt').value);
      if(!Array.isArray(obj.users)||!Array.isArray(obj.keywords)) throw 0;
      blockedUsers=obj.users; blockedKeywords=obj.keywords;
      save(); render(); runAll(); alert('적용 완료');
    } catch{
      alert('잘못된 JSON');
    }
  };

  // 아코디언 토글
  sidebar.querySelectorAll('h5[data-sec]').forEach(h=>{
    h.onclick = ()=>{
      const sec = h.dataset.sec;
      const content = sidebar.querySelector('#sec-'+sec);
      const icon    = h.querySelector('span');
      content.classList.toggle('active');
      icon.textContent = content.classList.contains('active') ? '－' : '＋';
    };
  });

  // ─── 초기 실행 & 관찰 ───────────────────────────────────────────────────────
  runAll();
  new MutationObserver(runAll).observe(document.body,{childList:true,subtree:true});
})();
