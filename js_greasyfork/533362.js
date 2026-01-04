// ==UserScript==
// @name         Websim Essentials Plugin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Advanced tools for websim.ai - database, multiplayer, trending, user search, and more
// @author       Trey6383
// @match        https://websim.ai/*
// @match        https://*.websim.ai/*
// @icon         https://websim.ai/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533362/Websim%20Essentials%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/533362/Websim%20Essentials%20Plugin.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Add CSS styles
  const style = document.createElement('style');
  style.textContent = `
    #websim-essentials-root {
      position: fixed;
      z-index: 2147483647;
      pointer-events: none;
    }
    .we-ball {
      pointer-events: auto;
      position: fixed;
      top: 24px;
      left: 24px;
      z-index: 2147483647;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #101619  url('https://websim.ai/favicon.ico') no-repeat center/60%;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.16), 0 0.5px 3px 0 rgba(0,0,0,0.19);
      cursor: pointer;
      transition: box-shadow 0.24s, filter 0.15s;
      border: 2.6px solid #39FF14;
      animation: we-ball-popin 0.5s cubic-bezier(.5,1.1,.71,1.42);
    }
    .we-ball:hover {
      box-shadow: 0 4px 22px 0 rgba(60,255,80,.17), 0 1.5px 10px 0 rgba(60,255,80,.19);
      filter: brightness(1.09) saturate(120%);
    }
    @keyframes we-ball-popin {
      0% { 
        opacity: 0; 
        transform: scale(0.75) translateY(-30px); 
      }
      100% { 
        opacity: 1; 
        transform: scale(1); 
      }
    }
    .we-main-window {
      pointer-events: auto;
      position: fixed;
      top: 42px;
      left: 26px;
      min-width: 410px;
      min-height: 520px;
      max-width: min(95vw,680px);
      max-height: min(95vh,830px);
      z-index: 2147483647;
      background: #181a1b;
      color: #ebefed;
      border-radius: 16px;
      box-shadow: 0 12px 60px 0 rgba(0,0,0,0.31), 0 1.5px 12px 0 rgba(60,255,80,.13);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 2.2px solid #39FF14;
      animation: we-flyin 0.6s cubic-bezier(.45,1.2,.65,1.35);
    }
    @keyframes we-flyin {
      0% { opacity: 0; transform: translateY(-36px) scale(.98);}
      100% { opacity: 1; transform: translateY(0px) scale(1);}
    }
    .we-header {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #24282a;
      min-height: 42px;
      padding: 0 18px 0 14px;
      border-bottom: 1px solid #191f16;
    }
    .we-header img {
      width: 28px; height: 28px;
      border-radius: 6px;
      background: #fff;
    }
    .we-header .we-title {
      font-size: 1.38rem;
      font-weight: 600;
      letter-spacing: 0.014em;
      color: #39FF14;
      text-shadow: 0 0 5px #39ff1460;
    }
    .we-header .we-close-btn {
      margin-left: auto;
      background: none;
      border: none;
      color: #39FF14;
      cursor: pointer;
      font-size: 2.13rem;
      line-height: 1.1;
      font-weight: 700;
      transition: color 0.23s;
      border-radius: 7px;
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
    }
    .we-header .we-close-btn:hover {
      background: #162320b8;
      color: #eb005f;
    }
    .we-tabs {
      display: flex;
      gap: 3px;
      background: #232729;
      padding: 6px 5px 5px 13px;
      font-size: 1.08rem;
      border-bottom: 1px solid #101a10;
    }
    .we-tab-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #8fff4a;
      border-bottom: 2.5px solid transparent;
      font-size: 1.09rem;
      padding: 8px 11px 5px 11px;
      border-radius: 10px 10px 0 0;
      font-weight: 600;
      transition: background 0.19s, color 0.12s, border-color 0.17s;
    }
    .we-tab-btn.active, .we-tab-btn:focus {
      color: #fff;
      background: #181a1b;
      border-color: #39FF14;
      outline: none;
      text-shadow: 0 0 6px #39FF1475;
    }
    .we-main-content {
      flex: 1;
      overflow: auto;
      background: #181a1b;
      padding: 13px 20px 17px 20px;
      font-size: 1.075rem;
      position: relative;
    }
    @media (max-width: 620px) {
      .we-main-window {
        min-width: 95vw;
        min-height: 92vw;
        left: 0px; top: 0;
        border-radius: 0 0 12px 0;
      }
    }
    .we-section-title {
      font-weight: 600;
      margin: 12px 0 7px 0;
      color: #39FF14;
      font-size: 1.15em;
      letter-spacing: 0.01em;
      text-shadow: 0 0 8px #39FF143c;
    }
    .we-label {
      font-size: .95em;
      color: #b6fac5;
      margin-top: 5px;
    }
    .we-input, .we-textarea {
      border-radius: 8px;
      border: 1.5px solid #28474a;
      background: #151919;
      color: #fff;
      font-size: 1.01em;
      padding: 6px 9px;
      margin-bottom: 9px;
      outline: none;
      margin-top: 0.5em;
      width: 100%;
      box-sizing: border-box;
      transition: border-color 0.14s;
    }
    .we-input:focus, .we-textarea:focus {
      border-color: #39FF14;
    }
    .we-btn {
      background: linear-gradient(90deg,#39FF14 30%,#66ff56 80%);
      color: #111;
      font-weight: 600;
      padding: 9px 24px;
      border: 0;
      border-radius: 7px;
      font-size: 1.06em;
      cursor: pointer;
      margin: 7px 0;
      transition: box-shadow 0.16s, filter .13s;
      box-shadow: 0 2px 14px 0 rgba(60,255,80,0.11);
      text-shadow: 0 0 6px #52ff5730;
    }
    .we-btn:hover, .we-btn:focus {
      filter: brightness(1.09) contrast(1.04);
      box-shadow: 0 2px 16px 0 #69ff5436;
    }
    .we-virtual-keyboard {
      position: fixed;
      z-index: 2147483647;
      bottom: 0;
      left: 0;
      width: 100vw;
      background: #192217;
      box-shadow: 0 -2px 18px #000a, 0 0.5px 0 #39FF14;
      border-radius: 22px 22px 0 0;
      padding: 8px 0 5px 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4px;
      pointer-events: auto;
    }
    .we-virtual-keyboard-key {
      background: #232b2a;
      border: 1.2px solid #1f584f;
      color: #39FF14;
      border-radius: 8px;
      font-weight: 500;
      font-size: 1.14em;
      padding: 9px 18px;
      margin: 4px 2px;
      cursor: pointer;
      min-width: 36px;
      transition: background .12s, border-color .14s, color .13s;
      text-shadow: 0 0 7px #39FF1440;
    }
    .we-virtual-keyboard-key:active {
      background: #39FF14;
      color: #0a2100;
      border-color: #39FF14;
      text-shadow: none;
    }

    /* Loader */
    .we-loader {
      display: inline-block;
      width: 23px; height:23px;
      border: 3px solid #39FF1420;
      border-top: 3px solid #39FF14;
      border-radius: 50%;
      animation: we-spin 1s linear infinite;
    }
    @keyframes we-spin {
      0% { transform: rotate(0deg);}
      100% { transform: rotate(359deg);}
    }
    .we-main-content::-webkit-scrollbar {
      width: 7px; background: #161d16;
    }
    .we-main-content::-webkit-scrollbar-thumb {
      background: #39FF14; border-radius: 8px;
    }
    .we-main-content { scrollbar-width: thin; scrollbar-color: #39FF14 #161719;}
  `;
  document.head.appendChild(style);

  // Create root element
  const rootElement = document.createElement('div');
  rootElement.id = 'websim-essentials-root';
  document.body.appendChild(rootElement);

  // Main plugin code
  const TABS = [
    { id: "trending", label: "Trending" },
    { id: "projects", label: "Project Info" },
    { id: "users", label: "User Search" },
    { id: "database", label: "Database" },
    { id: "multiplayer", label: "Multiplayer" },
    { id: "ai", label: "AI Tools" },
    { id: "vk", label: "Virtual Keyboard" },
    { id: "more", label: "More" }
  ];
  let state = {
    opened: false,
    showVK: false,
    tab: "trending"
  };
  let websimRoom = null;

  function $(sel,base=document){ return base.querySelector(sel);}
  function $$(sel,base=document){ return Array.from(base.querySelectorAll(sel)); }

  // --- Base UI ---
  function mountEssentials() {
    const root = document.getElementById("websim-essentials-root");
    root.innerHTML =
      `<div id="we-ball" class="we-ball" title="Open Websim Essentials" tabindex="0"></div>
      <div id="we-main" style="display:none;"></div>
      <div id="we-vk-overlay" style="display:none;"></div>`;
    const ball = $("#we-ball", root);
    const main = $("#we-main", root);
    const vk = $("#we-vk-overlay", root);

    ball.onclick = function(){ state.opened = true; updateUI(); }
    ball.onkeydown = function(e){ if(e.key==="Enter"||e.key===" "){ ball.click(); } }

    document.addEventListener('keydown', ballAltShortcut);

    updateUI();
  }

  // -- Keyboard Alt-Alt shortcut
  let lastAlt = 0;
  function ballAltShortcut(e){
    if (e.key === "Alt") {
      const n = Date.now();
      if (n - lastAlt < 600) {
        lastAlt = 0;
        if (state.opened) {
          // close main
          closeWindow();
        } else {
          openWindow();
        }
      }
      lastAlt = n;
    }
  }

  function openWindow() {
    state.opened = true;
    updateUI();
  }

  function closeWindow() {
    state.opened = false;
    updateUI();
  }

  function updateUI() {
    const root = document.getElementById("websim-essentials-root");
    const ball = $("#we-ball", root);
    const main = $("#we-main", root);
    const vk = $("#we-vk-overlay", root);

    ball.style.display = state.opened ? 'none' : '';
    main.style.display = state.opened ? '' : 'none';

    if(state.opened){
      main.innerHTML = `
        <div class="we-main-window" tabindex="-1">
          <div class="we-header">
            <img src="https://websim.ai/favicon.ico" width="28" height="28" alt="websim essentials logo"/>
            <span class="we-title">Websim Essentials</span>
            <button class="we-close-btn" aria-label="Close" tabindex="0" id="we-close-btn">Ã—</button>
          </div>
          <nav class="we-tabs" role="tablist">
            ${TABS.map(t=>`
              <button type="button" class="we-tab-btn${state.tab===t.id?" active":""}" data-tab="${t.id}" role="tab" aria-selected="${state.tab===t.id}">${t.label}</button>
            `).join("")}
          </nav>
          <div class="we-main-content" tabindex="0" id="we-content"></div>
        </div>
      `;
      // Tab click
      $$(".we-tab-btn", main).forEach(btn => {
        btn.onclick = function(){ state.tab = btn.getAttribute("data-tab"); updateUI();}
      });
      // Close btn
      $("#we-close-btn", main).onclick = ()=>{ closeWindow(); };
      // Keyboard close on Escape inside window
      main.onkeydown = (e)=>{
        if(e.key==="Escape") closeWindow();
      };
      // Focus window if opened
      setTimeout(()=>{$(".we-main-window",main)?.focus()},10);

      renderTabContent();
    }

    // VK overlay
    vk.style.display = state.showVK ? "" : "none";
    if(state.showVK){
      vk.innerHTML = renderVirtualKeyboardMarkup();
      bindVirtualKeyboard(vk);
    }
  }

  // ---- Tab rendering ----
  function renderTabContent() {
    const content = document.getElementById("we-content");
    // Tab rendering switch
    switch(state.tab){
      case "trending": renderTrending(content); break;
      case "projects": renderProjectInfo(content); break;
      case "users":    renderUserSearch(content); break;
      case "database": renderDatabase(content); break;
      case "multiplayer": renderMultiplayer(content); break;
      case "ai": renderAITools(content); break;
      case "vk": renderVKLauncher(content); break;
      case "more": renderMore(content); break;
    }
  }

  // --- Util ---
  function loaderHTML(extraStyle="") {
    return `<span class="we-loader" style="${extraStyle}" title="Loading..."></span>`;
  }
  function escape(str){
    return (""+str).replace(/[&<>"']/g, s => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[s]));
  }
  function extLink(h, t) {
    return `<a href="${h}" target="_blank" rel="noopener" style="color:#39FF14;text-shadow:0 0 5px #39FF1430">${escape(t||h)}</a>`;
  }
  function copyBtn(value) {
    // unique id for the button
    const btnId = "copybtn"+Math.floor(Math.random()*10000000);
    setTimeout(()=>{
      const btn = document.getElementById(btnId);
      if(btn){
        btn.onclick = function(){
          if (navigator.clipboard) {
            navigator.clipboard.writeText(value).then(()=>{
              btn.textContent = "Copied!";
              setTimeout(()=>btn.textContent="Copy",700);
            });
          }
        }
      }
    }, 0);
    return `<button class="we-btn" id="${btnId}" style="font-size:.87em;padding:4px 13px;margin-left:8px">Copy</button>`;
  }

  function avatarWithName(user,noLink){
    if(!user || !user.username) return '(unknown)';
    const u = user.username, av = "https://images.websim.ai/avatar/"+u;
    const markup = `<img src="${av}" style="width:22px;height:22px;border-radius:6px;vertical-align:middle;margin-right:3px;box-shadow:0 0 5px #39FF1477"/><span style="color:#39FF14;text-shadow:0 0 4px #39FF1475">@${escape(u)}</span>`;
    if(noLink) return markup;
    return `<a href="https://websim.ai/@${u}" style="color:#39FF14;text-decoration:none;text-shadow:0 0 4px #39FF1475" target="_blank" rel="noopener">${markup}</a>`;
  }

  // Trending Tab
  function renderTrending(el){
    el.innerHTML = `<div class="we-section-title">Trending Projects</div>${loaderHTML()}`;
    fetch("/api/v1/feed/trending").then(r=>r.json()).then(data=>{
      const trending = data.feed.data || [];
      if(!trending.length){
        el.innerHTML+= `<div>No trending projects found.</div>`;
        return;
      }
      el.innerHTML = `<div class="we-section-title">Trending Projects</div>
      <div style="display:flex;flex-direction:column;gap:15px;margin-top:6px">
        ${
        trending.map(({site,project,project_revision})=>`
          <div style="background:#101619;border-radius:10px;padding:10px 11px 7px;display:flex;gap:11px;align-items:center;border:1.5px solid #052f08;box-shadow:0 1.5px 8px #073a242c">
            <img src="https://images.websim.ai/v1/site/${site.id}/120" width="55" height="38" style="border-radius:8px;background:#223221"/>
            <div style="flex:1;min-width:0">
              <div style="font-weight:600;font-size:1.09em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${extLink(`https://websim.ai/p/${project.id}`, project.title||"(untitled project)")}</div>
              <div style="font-size:.94em;color:#39FF14">by ${avatarWithName(project.created_by)}</div>
              ${(project.description||site.title)?`<div style="font-size:.93em;margin-top:2px; color:#97fa69">${escape(project.description || site.title)}</div>`:""}
            </div>
            <div style="text-align:right;font-size:.91em;color:#39FF14;min-width:61px">
              ${(site.views || project.stats.views || 0)} views<br>${(site.likes||project.stats.likes||0)} ðŸ’š
            </div>
          </div>
        `).join("")}
      </div>`;
    })
  }


  // Project Info Tab
  function renderProjectInfo(el){
    el.innerHTML = `
      <div class="we-section-title">Project Data Lookup</div>
      <form id="we-pi-form">
        <div class="we-label">Project Link or ID:</div>
        <input class="we-input" style="max-width:370px" id="we-pi-input" placeholder="Paste link or ID"/><button class="we-btn" style="margin-left:8px">Search</button>
      </form>
      <div id="we-pi-error" style="color:#ff5e5e;margin:9px 0"></div>
      <div id="we-pi-result"></div>
    `;
    $("#we-pi-form",el).onsubmit = function(evt){
      evt.preventDefault();
      const q = $("#we-pi-input",el).value.trim();
      const match = q.match(/[a-z0-9_-]{20}/i);
      if(!match){
        $("#we-pi-error",el).textContent = "Invalid project link or ID.";
        $("#we-pi-result",el).innerHTML = "";
        return;
      }
      $("#we-pi-error",el).textContent="";
      $("#we-pi-result",el).innerHTML=loaderHTML();
      fetch(`/api/v1/projects/${match[0]}`).then(r=>r.json()).then(data=>{
        $("#we-pi-result",el).innerHTML = projectDataView(data);
      }).catch(()=>{
        $("#we-pi-error",el).textContent = "Could not fetch project.";
        $("#we-pi-result",el).innerHTML = "";
      });
    };
  }

  function projectDataView({project,project_revision,site}){
    if(!site || !project) return "<div>Project not found.</div>";
    return `<div style="background:#212a26;padding:15px 14px;border-radius:10px;border:1.5px solid #167a50">
      <div style="display:flex;gap:13px">
        <img src="https://images.websim.ai/v1/site/${site.id}/180" style="border-radius:8px;background:#1b3926" height="64" width="86"/>
        <div>
          <div style="font-weight:600;font-size:1.12em">${escape(project.title || '(Untitled Project)')}</div>
          <div style="font-size:.94em;color:#9cd8cd;margin-bottom:3px">by ${avatarWithName(project.created_by)}</div>
          <div style="font-size:.99em;margin-bottom:.2em">${escape(project.description||site.title)}</div>
          ${extLink(`https://websim.ai/c/${site.id}`,"Open Site")}
          ${copyBtn(`https://websim.ai/c/${site.id}`)}
        </div>
      </div>
      <div style="font-size:.98em;color:#affadd;margin-top:8px">
        <b>Status:</b> ${escape(site.state)} | <b>Posted:</b> ${String(project.posted)}<br>
        <b>Views:</b> ${project.stats.views} | <b>Likes:</b> ${project.stats.likes} | <b>Comments:</b> ${project.stats.comments}<br>
        <b>ID:</b> ${escape(project.id)} ${copyBtn(project.id)}
      </div>
      <details style="margin-top:10px">
        <summary>Show All Data (JSON)</summary>
        <pre style="max-width:600px;max-height:370px;overflow:auto;background:#141a16;color:#fff;padding:8px;border-radius:6px">${escape(JSON.stringify({project,project_revision,site},null,2))}</pre>
      </details>
    </div>`;
  }

  // User Search
  function renderUserSearch(el){
    el.innerHTML = `
      <div class="we-section-title">User Search & Info</div>
      <form id="we-user-form">
        <div class="we-label">Username:</div>
        <input class="we-input" style="max-width:280px" id="we-user-input" placeholder="@username"/>
        <button class="we-btn" style="margin-left:7px" type="submit">Search</button>
      </form>
      <div id="we-user-error" style="color:#ff5e6a;margin:9px 0"></div>
      <div id="we-user-details"></div>
    `;
    $("#we-user-form",el).onsubmit = function(evt){
      evt.preventDefault();
      const q = $("#we-user-input",el).value.trim().replace(/^@/,"");
      if(!q){ $("#we-user-error",el).textContent="Enter a username."; return; }
      $("#we-user-error",el).textContent="";
      $("#we-user-details",el).innerHTML = loaderHTML();
      // main info
      fetch(`/api/v1/users/${q}`).then(r=>{
        if(!r.ok) throw new Error("No user found");
        return r.json();
      }).then(data=>{
        const user = data.user;
        // Get extra info - likes, following, posted
        Promise.all([
          fetch(`/api/v1/users/${q}/likes?first=10`).then(r=>r.ok?r.json():{likes:{data:[]}}),
          fetch(`/api/v1/users/${q}/following/projects?first=10`).then(r=>r.ok?r.json():{projects:{data:[]}}),
          fetch(`/api/v1/users/${q}/projects?first=10&posted=true`).then(r=>r.ok?r.json():{projects:{data:[]}})
        ]).then(([likesBody,followingBody,postedBody])=>{
          $("#we-user-details",el).innerHTML = userDetailsMarkup(user, {
            likes: likesBody.likes.data,
            following: followingBody.projects.data,
            posted: postedBody.projects.data
          });
        },()=>{
          $("#we-user-details",el).textContent = "Could not load activity.";
        });
      }).catch(e=>{
        $("#we-user-error",el).textContent = "No user found.";
        $("#we-user-details",el).innerHTML = "";
      });
    };
  }
  function userDetailsMarkup(user, history){
    const avatarUrl = user.avatar_url || `https://images.websim.ai/avatar/${user.username}`;
    return `<div style="background:#131b14;border-radius:10px;padding:14px 15px;margin:12px 0;border:1.5px solid #267a35;max-width:437px">
      <div style="display:flex;gap:13px;align-items:center">
        <img src="${avatarUrl}" alt="avatar" style="width:60px;height:60px;border-radius:13px;border:2.5px solid #39FF14;background:#101b11;box-shadow:0 0 7px #39FF1475"/>
        <div>
          <div style="font-weight:600;font-size:1.13em"><span style="color:#39FF14;text-shadow:0 0 7px #39FF14ab">@${escape(user.username)}</span></div>
          ${user.description?`<div style="font-size:.99em;color:#39FF14;margin-top:3px">${escape(user.description)}</div>`:""}
          ${extLink(`https://websim.ai/@${user.username}`,"Profile")}${copyBtn(user.username)}
        </div>
      </div>
      <div style="margin-top:10px;font-size:.96em" id="we-userstats"></div>
      <div style="margin-top:13px">
        <div style="font-weight:bold;color:#39FF14;font-size:1.10em;margin-bottom:3px;text-shadow:0 0 8px #39ff1433">Activity & History</div>
        <div><b>Recently Liked:</b> <ul style="margin:4px 0 7px 17px;font-size:.97em">${
          history.likes.length===0?'<li style="color:#aaa">No recent likes.</li>':
          history.likes.map(({project,site})=>`<li>${extLink(`https://websim.ai/p/${project.id}`,project.title||"(untitled)")} ${
            site?extLink(`https://websim.ai/c/${site.id}`,"("+site.id.slice(0,9)+")"):""
          }</li>`).join("")
        }</ul></div>
        <div><b>Following Projects:</b> <ul style="margin:3px 0 7px 17px;font-size:.97em">${
          history.following.length===0?'<li style="color:#aaa">No following projects.</li>':
          history.following.map(({project})=>`<li>${extLink(`https://websim.ai/p/${project.id}`,project.title||"(untitled)")}</li>`).join("")
        }</ul></div>
        <div><b>Posted Projects:</b> <ul style="margin:3px 0 0 17px;font-size:.97em">${
          history.posted.length===0?'<li style="color:#aaa">No posted projects.</li>':
          history.posted.map(({project})=>`<li>${extLink(`https://websim.ai/p/${project.id}`,project.title||"(untitled)")}</li>`).join("")
        }</ul></div>
      </div>
    </div>
    <script>
    (function(){
      var statsDiv = document.getElementById("we-userstats");
      statsDiv.innerHTML = "${loaderHTML()}";
      fetch("/api/v1/users/${user.username}/stats").then(r=>r.json()).then(body=>{
        statsDiv.innerHTML = "<div><b>Likes:</b> <span style='color:#66FF68'>"+body.stats.total_likes+"</span> &nbsp; | <b>Views:</b> <span style='color:#66FF68'>"+body.stats.total_views+"</span></div>";
      }).catch(()=>{
        statsDiv.innerHTML = "Stats: error";
      });
    })();
    </script>`;
  }

  // --- Database Tab ---
  function renderDatabase(el){
    el.innerHTML = `
      <div class="we-section-title">Database Editor</div>
      <div class="we-label">Collection/type:</div>
      <input class="we-input" style="width:200px" value="post" id="we-db-type"/>
      <button class="we-btn" style="margin-left:8px" id="we-db-refresh">Refresh</button>
      <div id="we-db-easyformdiv" style="margin:10px 0"></div>
      <details style="margin:5px 0"><summary style="font-size:.98em;cursor:pointer">Advanced: Add raw JSON record</summary>
        <form id="we-db-jsonform" style="margin:12px 0">
          <span class="we-label">New record <span style="color:#21fdba" id="we-db-json-type">(post)</span>:</span>
          <textarea class="we-textarea" style="width:190px;min-height:32px;font-size:.95em" id="we-db-jsontext">{}</textarea>
          <button class="we-btn" style="padding:4.5px 17px;margin-left:8px;font-size:.97em" id="we-db-jsonadd">Add</button>
        </form>
      </details>
      <div class="we-section-title" style="margin-top:11px;font-size:.97em">Records</div>
      <div id="we-db-records"></div>
      <div style="margin-top:7px;color:#9FF;font-size:.96em">Note: <b>id</b>, <b>username</b>, <b>created_at</b> are set automatically.</div>
    `;
    // easy record creation
    renderEasyRecordForm($("#we-db-easyformdiv",el),"post");
    // handle type switch/refresh
    $("#we-db-type",el).oninput = function(){
      renderEasyRecordForm($("#we-db-easyformdiv",el),this.value);
      fetchRecords(this.value);
      $("#we-db-json-type",el).textContent = "("+this.value+")";
    };
    $("#we-db-refresh",el).onclick = function(){
      fetchRecords($("#we-db-type",el).value || "post");
    };
    // JSON form
    $("#we-db-jsonform",el).onsubmit = function(evt){
      evt.preventDefault();
      let type=$("#we-db-type",el).value||"post", txt=$("#we-db-jsontext",el).value;
      let obj;
      try{ obj=JSON.parse(txt); }catch{ alert("JSON parse error!");return; }
      dbGetRoom().collection(type).create(obj).then(()=>{
        $("#we-db-jsontext",el).value="{}";
        fetchRecords(type);
      }, err=>alert("Cannot create record: "+err));
    };
    // fetch records
    function fetchRecords(type){
      $("#we-db-records",el).innerHTML = loaderHTML();
      let unsub = null;
      Promise.resolve().then(()=>{
        if(!websimRoom) websimRoom = dbGetRoom();
        return websimRoom.collection(type).getList();
      })
      .then((lst)=>{
        lst = Array.isArray(lst)?lst:[];
        updateRecords(lst);
      });
      // subscribe to live updates
      if(websimRoom) {
        if(window.weDbUnsub) window.weDbUnsub();
        window.weDbUnsub = websimRoom.collection(type).subscribe(l=>updateRecords(l));
      }
      function updateRecords(list){
        // get all custom fieldnames for suggestion
        let fieldNames = [];
        for(const rec of list){
          Object.keys(rec).forEach(k=>{
            if(!['type','id','username','created_at'].includes(k)) fieldNames.push(k);
          });
        }
        renderEasyRecordForm($("#we-db-easyformdiv",el), type, Array.from(new Set(fieldNames)));
        $("#we-db-records",el).innerHTML = `<div style="max-height:320px;overflow:auto;font-size:.99em">
        <table style="border-collapse:collapse;width:100%">
          <thead>
            <tr>
              <th style="color:#27e7ad">ID</th><th>User</th><th style="width:99px">Created</th><th>Data</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.length===0?`<tr><td colspan="5">No records found.</td></tr>`:
                list.map(rec=>`
                  <tr>
                  <td><span style="font-size:.95em">${escape(rec.id).slice(0,7)}..</span></td>
                  <td>${avatarWithName({username:rec.username},true)}</td>
                  <td>${escape(rec.created_at.split("T")[0])}</td>
                  <td><pre style="max-width:210px;max-height:69px;overflow:auto;background:#181c19;border-radius:6px;padding:2px 5px;font-size:.95em;display:inline-block">${escape(JSON.stringify(rec,null,1))}</pre></td>
                  <td>
                    <button class="we-btn" style="font-size:.93em;padding:3px 7px" data-edit="${rec.id}">Edit</button>
                    <button class="we-btn" style="font-size:.91em;background:#ff256a;color:#fff;margin-left:4px;padding:3px 7px" data-del="${rec.id}">Delete</button>
                  </td>
                  </tr>
                `).join("")
            }
          </tbody>
        </table></div>`;
        // actions
        var delBtns = $$("[data-del]",$("#we-db-records",el));
        delBtns.forEach(function(btn){
          btn.onclick = function(){
            var recId = this.getAttribute("data-del");
            if(confirm("Delete record? This can't be undone!")){
              dbGetRoom().collection(type).delete(recId).then(function(){ fetchRecords(type); });
            }
          };
        });
        var editBtns = $$("[data-edit]",$("#we-db-records",el));
        editBtns.forEach(function(btn){
          btn.onclick = function(){
            var recId = this.getAttribute("data-edit");
            var rec = list.find(function(r){return r.id===recId;});
            if(!rec) return;
            editRecordModal(rec, type, function(){ fetchRecords(type); });
          };
        });
      }
    }
    // initial fetch
    fetchRecords("post");
  }
  // -- Easy/simple field form for record creation
  function renderEasyRecordForm(parentDiv, type, fieldNames=[]) {
    // avoid rerender unless different
    if(parentDiv._formFieldType===type && (JSON.stringify(parentDiv._formFieldNames||[])===JSON.stringify(fieldNames))) return;
    parentDiv._formFieldType = type;
    parentDiv._formFieldNames = fieldNames;
    parentDiv.innerHTML = `
    <form id="we-db-easyform" style="display:flex;flex-direction:column;gap:5px;max-width:350px;border:1px solid #15f199;padding:11px 12px;border-radius:8px;background:#202a22">
      <span class="we-label" style="margin-bottom:6px;font-weight:600;color:#39FF14">New Record (${type}):</span>
      <div id="we-db-easyfields"></div>
      <button class="we-btn" style="margin-top:6px;font-weight:700;color:#111" id="we-db-easyadd">Add Record</button>
      <button type="button" class="we-btn" style="padding:1px 8px;font-size:.97em;background:#16eacc;margin-top:3px" id="we-db-easyrow">+ Field</button>
      <div id="we-db-easymsg"></div>
      <div style="font-size:.95em;color:#aaf;margin-top:2px">Tip: You can add fields like <b>message</b>, <b>parent_id</b>, etc. Only <b>id</b>, <b>username</b>, and <b>created_at</b> are set automatically.</div>
      <div style="font-size:.92em;color:#aeff81;margin-top:2px">Value types: <i>true</i>, <i>false</i>, numbers, or quoted strings. E.g.: <code>42</code>, <code>true</code>, <code>&quot;hello&quot;</code></div>
    </form>
    `;
    let fields = [{name:"",value:""}];
    function renderFields(){
      let html="";
      for(let i=0;i<fields.length;i++){
        html+=`
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
            <input class="we-input" list="field-list" style="width:117px;margin-right:6px" placeholder="field" value="${escape(fields[i].name||"")}" data-fname="${i}">
            <input class="we-input" style="width:120px" placeholder="value" value="${escape(fields[i].value||"")}" data-fval="${i}">
            <button type="button" class="we-btn" style="padding:2px 9px;background:#ff256a;color:#fff" data-frm="${i}" tabindex="-1">âˆ’</button>
          </div>
        `;
      }
      parentDiv.querySelector("#we-db-easyfields").innerHTML=html+`
        <datalist id="field-list">${fieldNames.map(fn=>`<option value="${escape(fn)}">`).join("")}</datalist>
      `;
      $$("[data-frm]",parentDiv).forEach(btn=>{ btn.onclick = ()=>{ 
        let i=+btn.getAttribute("data-frm");
        fields.splice(i,1);
        if(fields.length===0)fields=[{name:"",value:""}]; renderFields();
      }});
      $$("[data-fname]",parentDiv).forEach(input=>input.oninput=()=>{fields[+input.getAttribute("data-fname")].name=input.value});
      $$("[data-fval]",parentDiv).forEach(input=>input.oninput=()=>{fields[+input.getAttribute("data-fval")].value=input.value});
    }
    renderFields();
    parentDiv.querySelector("#we-db-easyrow").onclick = ()=>{fields.push({name:"",value:""});renderFields();};
    parentDiv.querySelector("#we-db-easyform").onsubmit = function(evt){
      evt.preventDefault();
      let msgDiv = parentDiv.querySelector("#we-db-easymsg");
      let obj = {};
      for(const {name,value} of fields){
        if(name.trim()==="") continue;
        try{ obj[name.trim()] = parseValue(value);}catch{ msgDiv.innerHTML = "Could not parse value for '"+name+"'"; return;}
      }
      if(Object.keys(obj).length===0){msgDiv.textContent="Add at least one field.";return;}
      dbGetRoom().collection(type).create(obj).then(()=>{
        fields=[{name:"",value:""}];renderFields();msgDiv.textContent="Record added!";
        setTimeout(()=>msgDiv.textContent="",2000);
      },e=>{msgDiv.textContent="Error: "+e;setTimeout(()=>msgDiv.textContent="",2000)});
    }
  }
  function parseValue(v){
    if(v==="true")return true;
    if(v==="false")return false;
    let num=Number(v);if(!isNaN(num)&&v.trim()!==''&&v.trim()!=='true'&&v.trim()!=='false')return num;
    try{ return JSON.parse(v);}catch{}
    return v;
  }
  function dbGetRoom(){ return websimRoom||(websimRoom=new WebsimSocket()); }
  // record editing modal (lite)
  function editRecordModal(rec, type, onDone){
    const modal=document.createElement("div");
    modal.style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;background:rgba(13,24,18,.65);display:flex;align-items:center;justify-content:center";
    modal.innerHTML=`<div style="background:#232b22;border-radius:9px;padding:24px 26px;max-width:90vw;max-height:85vh;box-shadow:0 1.5px 11px #0008;border:2px solid #00dba0">
      <div style="font-weight:bold;font-size:1.15em;margin-bottom:12px">Edit Record (${type})</div>
      <textarea class="we-textarea" style="width:360px;height:210px" id="receditarea">${escape(JSON.stringify(rec,null,2))}</textarea>
      <div style="margin-top:13px">
        <button class="we-btn" id="recedit-save">Save</button>
        <button class="we-btn" style="margin-left:12px;background:#ff3485;color:#fff" id="recedit-cancel">Cancel</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
    modal.querySelector("#recedit-save").onclick = function(){
      let obj;
      try{ obj=JSON.parse(modal.querySelector("#receditarea").value); }catch{ alert("Parse error!"); return; }
      dbGetRoom().collection(type).update(rec.id,obj).then(()=>{ document.body.removeChild(modal);onDone(); },
        e=>alert("Save failed: "+e));
    };
    modal.querySelector("#recedit-cancel").onclick = function(){document.body.removeChild(modal);}
  }

  // Multiplayer Tab
  function renderMultiplayer(el){
    const mpId = "mp-"+Math.floor(Math.random()*9000000);
    el.innerHTML = `
      <div class="we-section-title">Multiplayer Room State & Presence</div>
      <div style="font-size:.98em">
        <b>My Client ID:</b> <span style="color:#1df9e3" id="${mpId}-cid"></span> ${copyBtn("CLIENT_ID")}
      </div>
      <details open style="margin:9px 0"><summary style="font-weight:bold">Peers</summary>
        <pre style="max-height:110px;overflow:auto;background:#181c19;border-radius:6px;padding:2px 7px;font-size:.95em" id="${mpId}-peers"></pre>
      </details>
      <details><summary><b>Presence</b></summary>
        <pre style="max-height:100px;overflow:auto;background:#181c19;border-radius:6px;padding:2px 7px;font-size:.95em" id="${mpId}-pres"></pre>
      </details>
      <details><summary><b>Room State</b></summary>
        <pre style="max-height:90px;overflow:auto;background:#181c19;border-radius:6px;padding:2px 7px;font-size:.95em" id="${mpId}-room"></pre>
      </details>
      <div class="we-label" style="margin-top:9px">Set My Presence Key:</div>
      <form id="${mpId}-setp"><input class="we-input" style="width:100px;display:inline-block" placeholder="key">
      <input class="we-input" style="width:90px;display:inline-block;margin-left:4px" placeholder="value">
      <button class="we-btn" style="margin-left:6px;padding:4px 12px;font-size:.98em">Set</button></form>
      <div class="we-label" style="margin-top:13px">Set Room State Key:</div>
      <form id="${mpId}-sets"><input class="we-input" style="width:100px;display:inline-block" placeholder="key">
      <input class="we-input" style="width:90px;display:inline-block;margin-left:4px" placeholder="value">
      <button class="we-btn" style="margin-left:6px;padding:4px 12px;font-size:.98em">Set</button></form>
      <div class="we-section-title" style="margin:16px 0 4px 0;font-size:.98em">Latest Room Events</div>
      <div style="font-size:.93em;max-height:100px;overflow:auto;background:#171f19;padding:6px;border-radius:7px" id="${mpId}-log"></div>
    `;
    // init the room
    let mpLog = [];
    websimRoom = dbGetRoom();
    websimRoom.initialize().then(()=>{
      updateMpStat();
      websimRoom.subscribePresence(()=>updateMpStat());
      websimRoom.subscribeRoomState(()=>updateMpStat());
      websimRoom.onmessage = (event)=>{
        mpLog = [event.data,...mpLog].slice(0,20);
        $("#"+mpId+"-log",el).innerHTML = mpLog.map(e=>`<code>${escape(JSON.stringify(e))}</code>`).join("");
      };
      updateMpStat();
    });
    function updateMpStat(){
      $("#"+mpId+"-cid",el).textContent = websimRoom.clientId;
      $("#"+mpId+"-peers",el).textContent = JSON.stringify(websimRoom.peers,null,2);
      $("#"+mpId+"-pres",el).textContent = JSON.stringify(websimRoom.presence,null,2);
      $("#"+mpId+"-room",el).textContent = JSON.stringify(websimRoom.roomState,null,2);
    }
    // set presence
    $("#"+mpId+"-setp",el).onsubmit = function(evt){
      evt.preventDefault();
      let k = this.children[0].value, v = this.children[1].value;
      let myPresence = websimRoom.presence[websimRoom.clientId] || {};
      websimRoom.updatePresence({...myPresence, [k]:parseValue(v)});
    }
    // set state
    $("#"+mpId+"-sets",el).onsubmit = function(evt){
      evt.preventDefault();
      let k = this.children[0].value, v = this.children[1].value;
      let state = {...websimRoom.roomState,[k]:parseValue(v)};
      websimRoom.updateRoomState(state);
    }
    // inject client id for copy
    setTimeout(()=>{ // hacky
      const btn = $("#"+mpId+"-cid",el).parentNode.querySelector("button[class*=we-btn]");
      if(btn) btn.onclick=function(){
        navigator.clipboard.writeText(websimRoom.clientId||"");
        btn.textContent = "Copied!";
        setTimeout(()=>btn.textContent = "Copy",700);
      }
    },200);
  }

  // --- AI Tools Tab ---
  function renderAITools(el){
    el.innerHTML = `
      <div class="we-section-title">AI Analysis (site multiplayer & db code)</div>
      <div class="we-label">Current site HTML code (partial):</div>
      <textarea class="we-textarea" style="width:99%;min-height:64px;font-size:.91em;margin-bottom:7px" id="we-ai-code"></textarea>
      <button class="we-btn" id="we-ai-run" style="margin-top:2px">Run AI Analysis</button>
      <div id="we-ai-result"></div>
      <div class="we-label" style="margin-top:13px">Tip: This AI assistant can help you spot multiplayer or database-related code automatically, or answer other websim plugin code questions.</div>
    `;
    let code = "";
    // try to auto-grab html
    fetch(window.location.pathname, {headers:{"Accept":"text/html"}}).then(r=>r.text()).then(txt=>{
      code = txt.slice(0,8000);
      $("#we-ai-code",el).value = code;
    });
    $("#we-ai-run",el).onclick = function(){
      const resultDiv = $("#we-ai-result",el);
      resultDiv.innerHTML = loaderHTML();
      let codeval = $("#we-ai-code",el).value || "";
      let prompt = "Analyze this site code (may be partial): find and summarize any usage of multiplayer or database features. For multiplayer, look for use of WebsimSocket, room.presence, room.roomState, etc. For database, look for room.collection usage, .create, .update, .getList, .subscribe, etc. Give a short summary and quote any relevant code. Respond helpfully for websim plugin developers.\n\n<site code>\n" + codeval;
      websim.chat.completions.create({
        messages: [
          { role: "system", content: "You are an expert websim developer assistant." },
          { role: "user", content: prompt }
        ]
      }).then(completion=>{
        resultDiv.innerHTML = '<div class="we-section-title" style="margin-top: 0">Summary</div><div style="background:#133c31;color:#ccfff8;border-radius:8px;padding:11px"><pre style="white-space:pre-wrap;font-size:.99em;margin:0">'+escape(completion.content)+'</pre></div>';
      }).catch(()=>{resultDiv.textContent="AI error: Cannot analyze at this time."});
    };
  }

  // --- Virtual Keyboard Tab/Overlay ---
  function renderVKLauncher(el){
    el.innerHTML = `
      <div class="we-section-title">Virtual Keyboard</div>
      <div>
        <div>This brings up an on-screen keyboard for convenient typing.<br></div>
        <button class="we-btn" style="margin-top:13px;font-size:1.13em" id="we-vk-show">Show Virtual Keyboard</button>
        <div style="margin-top:15px;color:#5cf">Especially useful for mobile or touch devices!</div>
      </div>
    `;
    $("#we-vk-show",el).onclick = function(){
      state.showVK = true;
      updateUI();
    };
  }
  function renderVirtualKeyboardMarkup(){
    let layout = [
      ['q','w','e','r','t','y','u','i','o','p'],
      ['a','s','d','f','g','h','j','k','l'],
      ['â‡§','z','x','c','v','b','n','m','âŒ«'],
      ['123','@','.','/','_','-',' ']
    ];
    return `<div class="we-virtual-keyboard">
      ${
        layout.map(row=>`<div style="display:flex;">${row.map(char=>`
            <button class="we-virtual-keyboard-key" data-key="${char}">${char}</button>
        `).join("")}</div>`).join("")
      }
      <button class="we-btn" style="margin:12px 3px;font-size:1.08em;background:#f32;color:#fff" id="vk-close">âœ– Close Keyboard</button>
    </div>`;
  }
  function bindVirtualKeyboard(container){
    let caps = false;
    const layout = [['q','w','e','r','t','y','u','i','o','p'],['a','s','d','f','g','h','j','k','l'],['â‡§','z','x','c','v','b','n','m','âŒ«'],['123','@','.','/','_','-',' ']];
    function sendChar(char){
      const el = document.activeElement;
      if(!el || typeof el.value !== "string") return;
      if(char==="â‡§") caps = !caps;
      else if(char==="âŒ«") el.value = el.value.slice(0,-1);
      else if(char==="123"){}
      else {
        let start = el.selectionStart, end = el.selectionEnd, v = el.value;
        let toInsert = (caps && /[a-z]/.test(char)) ? char.toUpperCase() : char;
        el.value = v.slice(0, start) + toInsert + v.slice(end);
        el.setSelectionRange(start+toInsert.length, start+toInsert.length);
      }
      el.dispatchEvent(new Event("input",{bubbles:true}));
      el.dispatchEvent(new Event("change",{bubbles:true}));
      // update caps display
      $$("[data-key]",container).forEach(btn=>{
        let key = btn.getAttribute("data-key");
        btn.textContent = (caps && /[a-z]/.test(key)) ? key.toUpperCase() : key;
      });
    }
    $$("[data-key]",container).forEach(btn=>{
      btn.onclick = function(){ sendChar(btn.getAttribute("data-key")===" "? " ": btn.getAttribute("data-key")); }
    });
    $("#vk-close",container).onclick = function(){ state.showVK=false; updateUI();};
    // focus input/textarea on open
    setTimeout(()=>{
      let el = document.activeElement;
      if(el && (el.tagName==="INPUT" || el.tagName==="TEXTAREA")) el.scrollIntoView({behavior:"smooth",block:"center"});
      else{ let inp = document.querySelector("input,textarea"); if(inp)inp.focus(); }
    },300);
  }

  // --- More Tab ---
  function renderMore(el){
    el.innerHTML = `
      <div class="we-section-title">More Tools & Links</div>
      <ul style="line-height:1.88em">
        <li>${extLink("https://websim.ai/","Websim Home")} &nbsp; | &nbsp;${extLink("https://websim.ai/search","Search Sites")}</li>
        <li>${extLink("https://websim.ai/leaderboard","Leaderboard")}</li>
        <li>${extLink("https://docs.websim.ai/","Websim Docs & API")}</li>
        <li>${extLink("https://websim.ai/new-site","Create New Site")}</li>
        <li>${extLink("https://websim.ai/settings","Your Profile & Settings")}</li>
        <li>Project info: <span id="we-more-curproj">${loaderHTML("margin-left:7px")}</span></li>
      </ul>
      <div class="we-section-title" style="margin-top:22px">Keyboard Shortcuts</div>
      <ul><li><b>Double tap [Alt]</b> to open/close this plugin quickly.</li></ul>
    `;
    // current project info
    if(window.websim?.getCurrentProject){
      window.websim.getCurrentProject().then(project=>{
        $("#we-more-curproj",el).innerHTML = `<b>${escape(project.title||"(untitled)")}</b> â€” <span style="color:#0fa">${escape(project.id.slice(0,9))}..</span>`;
      });
    }
  }

  // --- STARTUP ---
  mountEssentials();
})();