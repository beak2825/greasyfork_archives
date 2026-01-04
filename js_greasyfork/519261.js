// ==UserScript==
// @name         下一集快捷键
// @namespace    https://github.com/tonylou7/olvod_next
// @version      2024-07-23
// @description  欧乐iyf"]"下一集快捷键
// @author       TonyLou
// @match        *://*.olevod.com/player/vod/*
// @match        *://*.iyf.tv/play/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519261/%E4%B8%8B%E4%B8%80%E9%9B%86%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/519261/%E4%B8%8B%E4%B8%80%E9%9B%86%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {

    function clickElement(selector) {
        let el = document.querySelector(selector);
        if (el){
            el.click();
        }
    }

    var nextEl;
     // Check which website is currently loaded
    if (window.location.href.includes('olevod.com')) {
        nextEl = "#playerBoxTop > div > div > div > div.container > div > div.plyr__controls > div.plyr__controls__item.plyr__volume > div > div > div:nth-child(2) > div"
    } else if (window.location.href.includes('iyf.tv')) {
        nextEl = "#main-player > vg-controls.bg-overlayer > div.control-left.ng-star-inserted > div.play-next.control-item.ng-star-inserted > div"
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === ']') {
            //e.preventDefault();
            clickElement(nextEl);
        }
    }, false);


})();