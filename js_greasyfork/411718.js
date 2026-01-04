// ==UserScript==
// @name         网页翻译过滤代码
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       liuyang
// @grant        none
// @include      *://*
// @downloadURL https://update.greasyfork.org/scripts/411718/%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91%E8%BF%87%E6%BB%A4%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/411718/%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91%E8%BF%87%E6%BB%A4%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pres = document.getElementsByTagName('pre');
    if (pres && pres.length > 0) {
        for(var i = 0; i < pres.length; i++) {
            pres[i].classList.add('notranslate');
        }
    }
})();