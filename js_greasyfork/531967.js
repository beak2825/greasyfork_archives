// ==UserScript==
// @name         新闻联播
// @namespace    http://tampermonkey.net/
// @version      2025-01-15
// @description  新闻联播js
// @author       You
// @match        https://tv.cctv.com/2025/*/*/*.shtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cctv.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531967/%E6%96%B0%E9%97%BB%E8%81%94%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/531967/%E6%96%B0%E9%97%BB%E8%81%94%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var text=document.querySelector('#page_body > div.allcontent > div.video18847 > div.playingCon > div.nrjianjie_shadow > div > ul > li:nth-child(1) > p');



    const formattedText = text.innerHTML.replace(/\n/g, '<br>'); // 将\n替换为<br>
    text.innerHTML = formattedText; // 设置innerHTML


    // 模拟点击简介
    // 获取目标元素


var opens=document.querySelector("#page_body > div.allcontent > div.video18847 > div.playingCon > div.nrjianjie_shadow");
        opens.style='display: block;';

})();