// ==UserScript==
// @name         ilidilid
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  请默认关闭此插件
// @author       duoduoeeee
// @match        https://*.bilibili.com/*
// @match        https://*.biligame.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401122/ilidilid.user.js
// @updateURL https://update.greasyfork.org/scripts/401122/ilidilid.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var doct = document.body;
    var iframes = window.frames;
    doct.style.transform = "scaleX(-1)";
    for (var i = 0; i < iframes.length; i++) {
      iframes[i].style.transform = "scaleX(-1)";
    }
    document.title = document.title.split("").reverse().join("");
})();