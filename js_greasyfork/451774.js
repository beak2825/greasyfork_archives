// ==UserScript==
// @name         steamdb跳转至客服页面
// @namespace    steamdb_steam_help
// @version      0.4
// @description  在steambd.info的app和sub页面添加steam客服页面跳转
// @homepage     https://greasyfork.org/zh-CN/scripts/451774
// @author       liulies
// @match        https://steamdb.info/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamdb.info
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451774/steamdb%E8%B7%B3%E8%BD%AC%E8%87%B3%E5%AE%A2%E6%9C%8D%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/451774/steamdb%E8%B7%B3%E8%BD%AC%E8%87%B3%E5%AE%A2%E6%9C%8D%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const url = new URL(window.location.href);

    const steamicon = `<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-steam" aria-hidden="true"><path d="M8 0a8 8 0 00-8 7.47c.07.1.13.21.18.32l4.15 1.67a2.2 2.2 0 011.31-.36l1.97-2.8v-.04c0-1.65 1.37-3 3.05-3a3.03 3.03 0 013.05 3 3.03 3.03 0 01-3.12 3l-2.81 1.97c0 .3-.05.6-.17.9a2.25 2.25 0 01-4.23-.37L.4 10.56A8.01 8.01 0 108 0zm2.66 4.27c-1.12 0-2.03.9-2.03 2s.91 1.99 2.03 1.99c1.12 0 2.03-.9 2.03-2s-.9-2-2.03-2zm0 .5c.85 0 1.53.66 1.53 1.49s-.68 1.5-1.53 1.5c-.84 0-1.52-.67-1.52-1.5s.68-1.5 1.52-1.5zM5.57 9.6c-.22 0-.43.04-.62.11l1.02.42c.65.26.95.99.68 1.62-.27.63-1 .93-1.65.67l-1-.4a1.73 1.73 0 003.13-.08c.18-.42.18-.88.01-1.3A1.69 1.69 0 005.57 9.6z"></path></svg>`

    if ( url.pathname.startsWith('/app/') ) {
        const aid = document.querySelector('tr').lastElementChild;
        aid.innerHTML +=` |
        <a href=https://help.steampowered.com/zh-cn/wizard/HelpWithGame/?appid=${aid.innerHTML} target=_blank>
        ${steamicon} 客服页面 </a>
         | <a href=https://steam-tracker.com/app/${aid.innerHTML} target=_blank>tracker</a>
        `

    }else if ( url.pathname.startsWith('/sub/') ) {

        const aid = document.querySelector('#apps').querySelector('tbody').getElementsByTagName('tr');
        const topsub = document.querySelector('tr').lastElementChild;

        topsub.innerHTML +=`|
         <a href=steam://install/${aid[0].querySelector('td').innerText} target=_blank>
        install </a>
        `

        for (var i = 0 ; i < aid.length ; i++) {
            const tablist = aid[i].querySelector('td')
            tablist.innerHTML +=` |<a href=https://help.steampowered.com/zh-cn/wizard/HelpWithGame/?appid=${tablist.innerText} target=_blank>
            ${steamicon}</a>|<a href=https://steam-tracker.com/app/${tablist.innerText} target=_blank>tracker</a> |
         <a href=steam://install/${tablist.innerText} target=_blank>
        install </a>
            `
        }

    }
})();
