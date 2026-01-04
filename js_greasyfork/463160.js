// ==UserScript==
// @name         FF14纯净模拟
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  不用求解器，自己编辑调试
// @author       waflare
// @match        https://yyyy.games/crafter/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yyyy.games
// @grant        GM_addStyle
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/463160/FF14%E7%BA%AF%E5%87%80%E6%A8%A1%E6%8B%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/463160/FF14%E7%BA%AF%E5%87%80%E6%A8%A1%E6%8B%9F.meta.js
// ==/UserScript==
function main() {
    'use strict';
    const currentRoute = window.location.hash.slice(1);
    console.log(currentRoute)
    if (currentRoute === '/solver') {
      location.href = 'https://yyyy.games/crafter/#/simulator'
      return
    }
    if (currentRoute !== '/simulator') {
        return
    }
    const buttons = document.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent === '求解') {
            buttons[i].remove();
        }
    }
    let css = `
    .recipe-search-control>.span6 {
      width: 100% !important;
    }
    .bonus-stats {
      margin-left: 0px !important;
    }
    .ad, .helps-bottom {
      display: none !important;
    }
    .simulator-status>.span6 {
      width: 100% !important;
    }
    [ui-view]>.ng-scope {
      display: flex;
      flex-flow: row wrap;
    }
    [ui-view]>.ng-scope>.row-fluid {
      width: calc(50% - 20px) !important;
      margin: 10px;
      box-sizing: border-content;
    }
    [ui-view]>.ng-scope>.row-fluid:last-child {
      width: 100% !important;
      box-sizing: border-content;
      margin-left: 0px !important;
    }
    `
    GM_addStyle(css)
}
window.addEventListener('hashchange', main)
window.addEventListener('load', main)
