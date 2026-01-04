// ==UserScript==
// @name         有道词典自动发音
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       LepeCoder
// @match        http://dict.youdao.com/w/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37861/%E6%9C%89%E9%81%93%E8%AF%8D%E5%85%B8%E8%87%AA%E5%8A%A8%E5%8F%91%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/37861/%E6%9C%89%E9%81%93%E8%AF%8D%E5%85%B8%E8%87%AA%E5%8A%A8%E5%8F%91%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    document.cookie="search-popup-show=-1; expires=Thu, 18 Dec 2033 12:00:00 GMT; path=/";
    document.getElementsByClassName('voice-js')[1].click();
    document.getElementsByClassName('dialog-guide-download')[0].style.display="none";


    // Your code here...
})();