// ==UserScript==
// @name         page blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  block pages
// @author       Sᴀᴍ Onᴇᴌᴀ
// @match        https://www.youtube.com/c/flamingo
// @match        https://www.youtube.com/c/MegaToad
// @match        https://www.youtube.com/c/DharMannOfficial
// @match        https://www.youtube.com/user/eddsworld
// @match        https://www.youtube.com/c/SMLMovies
// @match        https://www.youtube.com/c/rekrap2
// @match        https://www.youtube.com/c/KreekCraft
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448008/page%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/448008/page%20blocker.meta.js
// ==/UserScript==

(() => { //IIFE arrow function
    'use strict';

    const regexToMatchTLD = /\.[^.]+$/;
    const domain = location.hostname.replace(regexToMatchTLD, '');;
    document.body.innerHTML =`
          <div style="direction: ltr; position: fixed; top: 0; z-index: 999999; display: block; width: 100%; height: 100%; background: red">
            <p style="position: relative; top: 40%; display: block; font-size: 66px; font-weight: bold; color: #fff; margin: 0 auto; text-align: center">
              SORRY, YOU WERE CAUGHT ON ${domain} WATCHING A BANNED YOUTUBER! NOW GO HIT NEIMAN'S KNEE!!!!!
            </p>
          </div>
    `;
})();