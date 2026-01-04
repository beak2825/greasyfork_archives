// ==UserScript==
// @name         全屏版Github Trending
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  加强版Github Trending
// @author       twfb
// @match        https://github.com/trending*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460037/%E5%85%A8%E5%B1%8F%E7%89%88Github%20Trending.user.js
// @updateURL https://update.greasyfork.org/scripts/460037/%E5%85%A8%E5%B1%8F%E7%89%88Github%20Trending.meta.js
// ==/UserScript==

function change(){
    document.querySelector('main div.Box').style="position: fixed;bottom: 0;left: 0;z-index: 999;width: 100vw;height: 100vh;overflow: scroll;padding: 0 10vw 0 10vw"
    let rows = document.querySelectorAll('.Box-row');
    for(let i=0;i<rows.length;i++){rows[i].style.width='26vw'}
    document.querySelector('main div.Box > div:nth-child(2)').style = 'display: flex;flex-wrap: wrap;'
}


(function() {
    'use strict';
    change()
    let currentPage = location.href;
    setInterval(function()
                {
        if (currentPage != location.href && location.href.includes('https://github.com/trending'))
        {
            currentPage = location.href;
            change()
        }
    }, 500);
})();