// ==UserScript==
// @name         様々な歌詞サイトコピーガード解除
// @namespace    https://twitter.com/yosshi9990
// @version      1.0
// @description  歌詞のコピーガードを解除します。
// @author       元祖のヨッシー
// @match        *://www.google.com/search?q=*
// @match        *://utaten.com/lyric/*
// @match        *://www.uta-net.com/song/*
// @match        *://j-lyric.net/artist/*
// @match        *://www.kkbox.com/*
// @match        *://www.joysound.com/*
// @match        *://mojim.com/*
// @match        *://www.utamap.com/*
// @match        *://www.azlyrics.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=utaten.com
// @grant        none
// @compatible   vivaldi
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @supportURL   https://twitter.com/messages/compose?recipient_id=1183000451714703361
// @contributionURL　https://www.youtube.com/@gansonoyoshi?sub_confirmation=1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469232/%E6%A7%98%E3%80%85%E3%81%AA%E6%AD%8C%E8%A9%9E%E3%82%B5%E3%82%A4%E3%83%88%E3%82%B3%E3%83%94%E3%83%BC%E3%82%AC%E3%83%BC%E3%83%89%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/469232/%E6%A7%98%E3%80%85%E3%81%AA%E6%AD%8C%E8%A9%9E%E3%82%B5%E3%82%A4%E3%83%88%E3%82%B3%E3%83%94%E3%83%BC%E3%82%AC%E3%83%BC%E3%83%89%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==
(function() {
    if(location.hostname=="www.google.com")document.getElementsByClassName("ruFbjf")[0].style="user-select:text!important";
    else{
        if(location.hostname=="utaten.com")document.getElementsByClassName("lyricBody ")[0].style="user-select:text!important";
        if(location.hostname=="www.kkbox.com")document.getElementsByClassName("lyrics")[0].style="user-select:text!important";
        if(location.hostname=="mojim.com")document.getElementsByClassName("fsZx1")[0].style="user-select:text!important";
        if(location.hostname=="www.utamap.com")document.getElementsByClassName("noprint")[0].style="user-select:text!important";
        document.body.style="user-select:text!important";
        document.addEventListener('contextmenu',function(a){a.stopPropagation();},true);
        document.addEventListener('selectstart',function(b){b.stopPropagation();},true);
        document.addEventListener('cut',function(c){c.stopPropagation();},true);
        document.addEventListener('copy',function(d){d.stopPropagation();},true);
}
})();