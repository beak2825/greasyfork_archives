// ==UserScript==
// @name         lu23小黄片去广告
// @namespace    undefined
// @version      0.0.1
// @description  自用去广告
// @author       Ann
// @match        *://lu2377.com/*
// @match        *://lu2100.com/*
// @match        *://lu2101.com/*
// @match        *://lu2102.com/*
// @match        *://lu2103.com/*
// @match        *://lu2104.com/*
// @match        *://lu2105.com/*
// @match        *://lu2106.com/*
// @match        *://lu2107.com/*
// @match        *://lu2108.com/*
// @match        *://lu2109.com/*
// @match        *://lu2110.com/*
// @match        *://lu2111.com/*
// @match        *://lu2112.com/*
// @match        *://lu2113.com/*
// @match        *://lu2116.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/33461/lu23%E5%B0%8F%E9%BB%84%E7%89%87%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/33461/lu23%E5%B0%8F%E9%BB%84%E7%89%87%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
$(document).ready(function () {
    $('div[class="ads"]').remove();
    $('div[class="ads-footer"]').remove();
    $('div[class="ads-square content hidden-xs hidden-sm"]').remove();
    if(window.location.href.indexOf("index.php")==-1)
    {
        $('div[class="ads-player"]').remove();
        document.getElementById("player-container").style.height= 800 +"px";
        document.getElementById("player-container").style.width= 1000 +"px";
        var html5 = document.getElementById("player_html5_api");
        html5.setAttribute("autoplay","autoplay");
        html5.setAttribute("controls","controls");
        
        $('div[class="vjs-big-play-button"]').remove();
        $('div[class="vjs-control-bar"]').remove();
        $('div[class="vjs-error-display"]').remove();
        //.children[0];
        
        //alert(src.getAttribute("src"));
        //window.open(src.getAttribute("src"));
    }
});
