// ==UserScript==
// @name         viutv yugioh-zexal视频窗修改
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  删除中间play图标和自动播放下一集小窗口
// @author       hxzqwe
// @match        https://viu.tv/encore/yugioh-zexal/*
// @icon         https://viu.tv/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449979/viutv%20yugioh-zexal%E8%A7%86%E9%A2%91%E7%AA%97%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/449979/viutv%20yugioh-zexal%E8%A7%86%E9%A2%91%E7%AA%97%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var intv = setInterval(function() {
    var elems1 = document.getElementsByClassName("Middle");
    var elems2 = document.getElementsByClassName("fullscreen");
    if (elems1.length < 1 || elems2.length < 1 ){
        return false;
       }
    //when element is found, clear the interval.
    clearInterval(intv);
    //删除中间play图标
    var p = elems1[0].firstChild;
    p.remove(p);
    //删除自动播放下一集小窗口
    var n = elems2[0].children[2];
    n.remove(n);
    }, 100);
})();