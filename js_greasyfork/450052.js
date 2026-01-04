// ==UserScript==
// @name         小説家になろう　ブックマークを色分け
// @namespace    http://tampermonkey.net/
// @version      20220824
// @description  しおり無しは緑帯に。しおりと最新話が違う時は青帯に。完結済みは赤帯に
// @author       _Hiiji
// @match        *://syosetu.com/favnovelmain/list/*
// @match        *://syosetu.com/favnovelmain18/list/*
// @noframes
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450052/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%E3%80%80%E3%83%96%E3%83%83%E3%82%AF%E3%83%9E%E3%83%BC%E3%82%AF%E3%82%92%E8%89%B2%E5%88%86%E3%81%91.user.js
// @updateURL https://update.greasyfork.org/scripts/450052/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%E3%80%80%E3%83%96%E3%83%83%E3%82%AF%E3%83%9E%E3%83%BC%E3%82%AF%E3%82%92%E8%89%B2%E5%88%86%E3%81%91.meta.js
// ==/UserScript==

(function() {
    const bookmark = document.getElementsByClassName("no");
    for (let i = 0; i < bookmark.length; i++)
    {
        // ●しおり無しは緑帯
        if(bookmark[i].getElementsByTagName('a')[0] && bookmark[i].getElementsByTagName('a')[1] == null)
        {bookmark[i].parentNode.setAttribute('style','background-color:#90ee90;');}
        // ●しおりと最新話が違う時は青帯
        else if(bookmark[i].getElementsByTagName('a')[0].href != bookmark[i].getElementsByTagName('a')[1].href)
        {bookmark[i].parentNode.setAttribute('style','background-color:#add8e6;');}
        // ●完結済みは赤帯
        if(~bookmark[i].innerText.indexOf("〔完結済〕"))
        {bookmark[i].setAttribute('style','border:2px solid #ff0000; background-color:#fff0f0;');}
    }
})();