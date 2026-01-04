// ==UserScript==
// @name           open SteamDB
// @description    insert open SteamDB button to wishlist
// @namespace https://greasyfork.org/users/3920
// @match http://store.steampowered.com/wishlist/*
// @match https://store.steampowered.com/wishlist/*
// @version 0.0.1.20221230165142
// @downloadURL https://update.greasyfork.org/scripts/457372/open%20SteamDB.user.js
// @updateURL https://update.greasyfork.org/scripts/457372/open%20SteamDB.meta.js
// ==/UserScript==
 
(function() {
  function start() {
    for (let [key, value] of Object.entries(g_Wishlist.rgElements)) {
      for (let dom of value.toArray()) {
        if (0 < dom.getElementsByClassName('open_steamdb').length) continue;

        let el = dom.getElementsByClassName('platform_icons');
        if (0 >= el.length) continue;
        el[0].style.display = 'flex';

        let btn = document.createElement('a');
        btn.setAttribute('class', 'store_header_btn_gray');
        btn.setAttribute('href', `https://steamdb.info/app/${key}/`);
        btn.setAttribute('target', '_blank');
        btn.style.width = 'fit-content';
        btn.style.float = 'right';
        btn.style.padding = '1px 10px';
        btn.style.color = 'azure';
        //btn.style.cursor = 'pointer';
        btn.textContent = 'open SteamDB';

        let frame = document.createElement('div');
        frame.setAttribute('class', 'open_steamdb');
        frame.style.flexGrow = '1';
        frame.appendChild(btn);

        el[0].appendChild(frame);
      }
    }
  }
  start();
})();