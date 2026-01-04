// ==UserScript==
// @name         SSAT_steamdb
// @namespace    SSAT_steamdb
// @version      0.1
// @license      GPLv3
// @description  在steambd.info中调用SSAT
// @author       AuthorMoe
// @match        https://steamdb.info/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamdb.info
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469641/SSAT_steamdb.user.js
// @updateURL https://update.greasyfork.org/scripts/469641/SSAT_steamdb.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const url = new URL(window.location.href);
    const appid = document.querySelector('tr').lastElementChild;

    if ( url.pathname.startsWith('/app/') ) {
        const tooltab = document.querySelector('#main > div.scope-app > div > div > div.pagehead > div.pagehead-actions.app-links');
        console.log(tooltab.innerHTML)
        tooltab.innerHTML +=` |
        <a href="SSAT://?appid=${appid.innerHTML}" class="tooltipped tooltipped-n" id="js-app-install" aria-label="Add this game to Library">
<svg width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-steam" aria-hidden="true"><path d="M8 0a8 8 0 00-8 7.47c.07.1.13.21.18.32l4.15 1.67a2.2 2.2 0 011.31-.36l1.97-2.8v-.04c0-1.65 1.37-3 3.05-3a3.03 3.03 0 013.05 3 3.03 3.03 0 01-3.12 3l-2.81 1.97c0 .3-.05.6-.17.9a2.25 2.25 0 01-4.23-.37L.4 10.56A8.01 8.01 0 108 0zm2.66 4.27c-1.12 0-2.03.9-2.03 2s.91 1.99 2.03 1.99c1.12 0 2.03-.9 2.03-2s-.9-2-2.03-2zm0 .5c.85 0 1.53.66 1.53 1.49s-.68 1.5-1.53 1.5c-.84 0-1.52-.67-1.52-1.5s.68-1.5 1.52-1.5zM5.57 9.6c-.22 0-.43.04-.62.11l1.02.42c.65.26.95.99.68 1.62-.27.63-1 .93-1.65.67l-1-.4a1.73 1.73 0 003.13-.08c.18-.42.18-.88.01-1.3A1.69 1.69 0 005.57 9.6z"></path>
</svg>
<span>Add Library</span>
</a>
        `

    }
})();
