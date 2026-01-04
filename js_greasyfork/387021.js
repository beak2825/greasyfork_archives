// ==UserScript==
// @name         jp2468显示当前集数
// @namespace    gqqnbig.me
// @version      0.1
// @description  在www.jp2468.com显示当前集数
// @author       gqqnbig
// @match        http://www.jp2468.com/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387021/jp2468%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E9%9B%86%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/387021/jp2468%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E9%9B%86%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentEpisode=document.querySelector(".player_playlist .active a.active");
    if(currentEpisode)
    {
        if(currentEpisode.scrollIntoViewIfNeeded)
            currentEpisode.scrollIntoViewIfNeeded();
        else
        {
            currentEpisode.scrollIntoView();
            window.scrollTo(0,0);
        }
    }
})();