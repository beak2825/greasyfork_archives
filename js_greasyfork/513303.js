// ==UserScript==
// @name       Scribd Bypass
// @description Skip Scribd for its free counterpart.
// @author     573dave
// @version    2.0
// @license    MIT
// @match      *://*.scribd.com/*
// @match      *://ilide.info/doc-viewer-v2*
// @grant      GM_addStyle
// @grant      GM_setValue
// @namespace https://greasyfork.org/users/1241821
// @downloadURL https://update.greasyfork.org/scripts/513303/Scribd%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/513303/Scribd%20Bypass.meta.js
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(`
    .sb-m{position:fixed;top:0;left:50%;transform:translateX(-50%);display:flex;gap:5px;z-index:10001;background:rgba(255,255,255,.85);padding:5px 10px;border-radius:0 0 5px 5px;box-shadow:0 2px 5px rgba(0,0,0,.2)}
    .sb-b{font:12px/1 sans-serif;padding:5px 10px;background:#FFC017;color:#000;border:none;border-radius:5px;cursor:pointer;transition:.3s}
    .sb-b:hover{background:#E6AC15}
    .sb-e{left:0;width:100%;height:0;position:relative;padding:45px 0 77.2727%}
    .sb-i{position:absolute;inset:0;width:100%;height:100%;border:0}
  `);

  const createButton = (text, onClick) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.className = 'sb-b';
    btn.onclick = onClick;
    return btn;
  };

  const createMenu = () => {
    const menu = document.createElement('div');
    menu.className = 'sb-m';
    document.body.prepend(menu);
    return menu;
  };

  const handleScribd = () => {
    const match = location.href.match(/\/(doc|document|presentation)\/(\d+)\/(.*)/);
    if (match) {
      const [, , id, title] = match;
      GM_setValue('origUrl', location.href);
      document.body.innerHTML = `<div class="sb-e"><iframe class="sb-i" src="https://www.scribd.com/embeds/${id}/content"></iframe></div>`;
      createMenu().appendChild(
        createButton("Download", () => {
          const downloadUrl = `https://ilide.info/docgeneratev2?fileurl=${encodeURIComponent(`https://scribd.vdownloaders.com/pdownload/${id}/${title}`)}&title=${encodeURIComponent(title)}&utm_source=scrfree&utm_medium=queue&utm_campaign=dl`;
          location.href = downloadUrl;
        })
      );
    }
  };

  const handleIlide = () => {
    const match = document.body.innerHTML.match(/https:\/\/ilide\.info\/docdownloadv2[^" ]+/);
    if (match) {
      location.href = `https://ilide.info/viewer/web/viewer.html?file=${encodeURIComponent(match[0])}#page=1`;
    }
  };

  const { hostname } = location;
  if (hostname.includes("scribd.com")) {
    handleScribd();
  } else if (hostname === "ilide.info" && location.pathname.startsWith("/doc-viewer-v2")) {
    handleIlide();
  }
})();