// ==UserScript==
// @name         绅士漫画头部广告
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Remove ad div element from the webpage
// @match        http://www.htmanga3.top/*
// @match        *://www.htmanga3.top/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464870/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E5%A4%B4%E9%83%A8%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/464870/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E5%A4%B4%E9%83%A8%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elements = document.querySelectorAll('img[alt="贤者同盟"][src="//img4.561245.xyz/data/game/202302/1371_19_贤者同盟_640X150_CN.gif"]');
    for (var i = 0; i < elements.length; i++) {
        var imgParent = elements[i].parentNode;
        imgParent.remove();
    }
})();
