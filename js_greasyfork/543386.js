// ==UserScript==
// @name         Group Messages Tracker (OUTDATED)
// @namespace    https://greasyfork.org/en/users/1382956-abara-cadabra
// @version      1
// @description  Adds a tracker for new messages in ur groups with a list for the groups and their newest messages.
// @author       Captain
// @license      MIT
// @match        *://*.roblox.com/*
// @grant        GM_xmlhttpRequest
// @connect      groups.roblox.com
// @connect      thumbnails.roblox.com
// @icon         https://icons.iconarchive.com/icons/github/octicons/256/accessibility-inset-16-icon.png
// @downloadURL https://update.greasyfork.org/scripts/543386/Group%20Messages%20Tracker%20%28OUTDATED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543386/Group%20Messages%20Tracker%20%28OUTDATED%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- edit these group ids ---
  // add your group ids here, example:
  // const groupids = [17221868, 35696958];
  const groupids = [id1, id2, id3];
  // show counts on home header? true/false per group (better to keep this off lol)
  const showonhome = [false, false];

  // --- don't change anything below unless you know what you're doing ---
  // --- also, keep in mind, this has not been tested for loading over 10 messages per group or having more then 2 groups listed, I'm unaware of the API's full limitations

  const apiwall = id => `https://groups.roblox.com/v2/groups/${id}/wall/posts?sortOrder=Desc&limit=100`;
  const apigroups = ids => `https://groups.roblox.com/v1/groups?groupIds=${ids.join(",")}`;
  const two_days = 2 * 24 * 60 * 60 * 1000;
  const now = new Date();
  const cachekey = "grouppostsseen";

  function formatdate(str) {
    return new Date(str).toLocaleString();
  }

  function getthumbnails(ids, cb) {
    if (!ids.length) return cb({});
    const url = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${ids.join(",")}&size=48x48&format=png&isCircular=false`;
    GM_xmlhttpRequest({
      method: "GET",
      url,
      onload: res => {
        try {
          const data = JSON.parse(res.responseText).data;
          const map = {};
          data.forEach(i => (map[i.targetId] = i.imageUrl));
          cb(map);
        } catch {
          cb({});
        }
      },
      onerror: () => cb({})
    });
  }

  function getgroupinfo(ids) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: "GET",
        url: apigroups(ids),
        onload: res => {
          try {
            const data = JSON.parse(res.responseText).data || [];
            const map = {};
            data.forEach(g => {
              map[g.id] = { name: g.name, thumbnail: g.thumbnail?.url || null };
            });
            resolve(map);
          } catch {
            resolve({});
          }
        },
        onerror: () => resolve({})
      });
    });
  }

  function getposts(id) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: "GET",
        url: apiwall(id),
        onload: res => {
          try {
            const data = JSON.parse(res.responseText).data || [];
            resolve({ id, posts: data.filter(p => p.poster && p.poster.user) });
          } catch {
            resolve({ id, posts: [] });
          }
        },
        onerror: () => resolve({ id, posts: [] })
      });
    });
  }

  function handleposts(id, posts) {

  const seen = JSON.parse(localStorage.getItem(cachekey) || "[]");
  const newposts = posts.filter(p => {
    const age = now - new Date(p.created);
    const key = `${id}-${p.id}`;
    return age < two_days && !seen.includes(key);
  });

  const updated = [...new Set([...seen, ...newposts.map(p => `${id}-${p.id}`)])].slice(-500);
  localStorage.setItem(cachekey, JSON.stringify(updated));

  return { id, total: posts.length, newcount: newposts.length, latest: posts.slice(0, 10) };
}


  function updateheaders(data) {
    let newtotal = 0;
    let alltotal = 0;
    data.forEach((g, i) => {
      if (showonhome[i]) {
        newtotal += g.newcount;
        alltotal += g.total;
      }
    });

    if (alltotal && /^\/home\/?$/.test(window.location.pathname)) {
      const homeheader = document.querySelector("h1[style*='height']");
      if (homeheader) homeheader.textContent = `home: (${newtotal} new, ${alltotal} total)`;
    }

    const robux = document.querySelector("a.robux-menu-btn");
    if (!robux) return;

    const allnew = data.reduce((acc, g) => acc + g.newcount, 0);
    const allposts = data.reduce((acc, g) => acc + g.total, 0);

    robux.textContent = `Group Wall: (${allnew} New, ${allposts} total)`;
    robux.style.cursor = "pointer";

    const clone = robux.cloneNode(true);
    robux.parentNode.replaceChild(clone, robux);

    clone.addEventListener("click", e => {
      e.preventDefault();
      showpopup(data);
    });
  }

  async function showpopup(data) {
    const groupinfo = await getgroupinfo(groupids);

    let popup = document.getElementById("grouppopup");
    if (popup) popup.remove();

    popup = document.createElement("div");
    popup.id = "grouppopup";
    popup.style = `
      position: fixed;
      top: 80px;
      right: 20px;
      width: 420px;
      max-height: 480px;
      background: #fff;
      border: 2px solid #ccc;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      padding: 12px;
      z-index: 9999;
      font-family: Arial,sans-serif;
      font-size: 14px;
      color: #111;
      border-radius: 6px;
      display: flex;
    `;

    popup.innerHTML = `
      <div id="tabs" style="width: 60px; border-right: 1px solid #ddd; display: flex; flex-direction: column; align-items: center; gap: 8px; padding-top: 8px;"></div>
      <div id="content" style="flex-grow:1; padding-left: 12px; overflow-y: auto; max-height: 440px;">
        <strong style="font-size:16px; display:block; margin-bottom:8px;">Latest group posts</strong>
        <div id="posts">loading...</div>
      </div>
    `;

    const closebtn = document.createElement("button");
    closebtn.textContent = "×";
    closebtn.title = "close";
    closebtn.style = `
      position: absolute;
      top: 6px;
      right: 8px;
      border: none;
      background: none;
      font-size: 20px;
      cursor: pointer;
      color: #999;
    `;
    closebtn.onmouseenter = () => (closebtn.style.color = "#333");
    closebtn.onmouseleave = () => (closebtn.style.color = "#999");
    closebtn.onclick = () => popup.remove();
    popup.appendChild(closebtn);

    document.body.appendChild(popup);

    const alluserids = [...new Set(data.flatMap(g => g.latest.map(p => p.poster.user.userId)))];

    getthumbnails(alluserids, thumbs => {
      const tabs = popup.querySelector("#tabs");
      const postsdiv = popup.querySelector("#posts");

      function renderposts(group) {
        if (!group.latest.length) {
          postsdiv.innerHTML = '<p style="font-style: italic; color: #666;">no recent posts.</p>';
          return;
        }
        postsdiv.innerHTML = "";
        group.latest.forEach(p => {
          const uid = p.poster.user.userId;
          const avatar = thumbs[uid] || `https://www.roblox.com/headshot-thumbnail/image?userId=${uid}&width=48&height=48&format=png&isCircular=false`;
          const name = p.poster.user.displayName;
          const role = p.poster.role.name;
          const date = formatdate(p.created);

          const div = document.createElement("div");
          div.style = "margin-bottom:14px; border-bottom:1px solid #eee; padding-bottom:8px; display:flex; align-items:center;";

          div.innerHTML = `
            <a href="https://www.roblox.com/users/${uid}/profile" target="_blank" style="flex-shrink:0;">
              <img src="${avatar}" alt="${name} avatar" style="width:36px; height:36px; border-radius:6px;" />
            </a>
            <div style="margin-left:12px; flex-grow:1;">
              <a href="https://www.roblox.com/users/${uid}/profile" target="_blank" style="font-weight:bold; color:#111; text-decoration:none;">
                ${name}
              </a>
              <p style="margin:4px 0 2px; white-space:pre-wrap; word-break:break-word;">${p.body}</p>
              <span style="font-size:0.8em; color:#666;">${role} | ${date}</span>
            </div>
          `;
          postsdiv.appendChild(div);
        });
      }

      data.forEach((g, i) => {
        const info = groupinfo[g.id] || {};
        const name = info.name || `Group ${g.id}`;
        const icon = info.thumbnail;

        const tab = document.createElement("div");
        tab.title = name;
        tab.style = `
          width: 48px;
          height: 48px;
          border-radius: 8px;
          cursor: pointer;
          border: 2px solid transparent;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          position: relative;
          font-weight: bold;
          font-size: 24px;
          color: #444;
          user-select: none;
        `;

        const fallback = i === 0 ? name.charAt(0) : name.charAt(0) + (i + 1);

        if (icon) {
          const img = document.createElement("img");
          img.src = icon;
          img.alt = name;
          img.style = "width:32px; height:32px; border-radius:6px;";
          img.onerror = () => {
            img.remove();
            tab.textContent = fallback;
          };
          tab.appendChild(img);
        } else {
          tab.textContent = fallback;
        }

        tab.addEventListener("click", () => {
          tabs.querySelectorAll("div").forEach(t => (t.style.borderColor = "transparent"));
          tab.style.borderColor = "#06c";
          renderposts(g);
        });

        tabs.appendChild(tab);

        if (i === 0) {
          tab.style.borderColor = "#06c";
          renderposts(g);
        }
      });
    });
  }

  Promise.all(groupids.map(getposts))
    .then(results => {
      const data = results.map(r => handleposts(r.id, r.posts));
      updateheaders(data);
    });
})();