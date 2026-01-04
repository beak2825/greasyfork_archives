// ==UserScript==
// @name         谷歌翻译单栏显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  适合在小空间使用谷歌翻译!
// @author       EcoRI
// @include        *://translate.google.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37045/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E5%8D%95%E6%A0%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/37045/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E5%8D%95%E6%A0%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var inputArea = document.getElementById('gt-src-c');
    var transArea = document.getElementById('gt-res-c');
    inputArea.style.float = "none";
    transArea.style.float = "none";
    document.getElementById('gt-lang-src').style.display = "none";
    document.getElementById('gt-lang-tgt').style.display = "none";
    document.getElementById('gt-lang-left').style.width = '50px';
    document.getElementById('gt-ft-res').style.display = "none";
    document.getElementById('gt-cn').style.display = "none";
    document.getElementById('gt-appbar').style.display = "none";
    document.getElementById('gba').style.display = "none";
    document.getElementById('gb').style.display = "none";
    document.getElementById('gt-text-all').style.padding = '0px';
    document.getElementById('gt-text-c').style.padding = '0px';
})();