// ==UserScript==
// @name         唱歌學日語-關閉頂端歌詞+功能列至頂
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  改變唱歌學日語網站的使用體驗
// @author       Ediny
// @match        https://www.jpmarumaru.com/tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpmarumaru.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481040/%E5%94%B1%E6%AD%8C%E5%AD%B8%E6%97%A5%E8%AA%9E-%E9%97%9C%E9%96%89%E9%A0%82%E7%AB%AF%E6%AD%8C%E8%A9%9E%2B%E5%8A%9F%E8%83%BD%E5%88%97%E8%87%B3%E9%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/481040/%E5%94%B1%E6%AD%8C%E5%AD%B8%E6%97%A5%E8%AA%9E-%E9%97%9C%E9%96%89%E9%A0%82%E7%AB%AF%E6%AD%8C%E8%A9%9E%2B%E5%8A%9F%E8%83%BD%E5%88%97%E8%87%B3%E9%A0%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
   var divLyrics = document.getElementById('divLyrics');
    if (divLyrics) {
        divLyrics.style.display = 'none';
    }

    var playToolbar = document.querySelector('.play-toolbar');
    if (playToolbar) {
        playToolbar.style.position = 'fixed';
        playToolbar.style.top = '0';
    }
})();