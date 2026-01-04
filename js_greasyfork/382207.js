// ==UserScript==
// @icon         http://9.url.cn/edu/lego_modules/edu-ui/0.0.1/img/nohash/logo_pc_rich.png
// @name         腾讯课堂-清除水印-"xxx正在观看"
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Monster
// @match        *://ke.qq.com/webcourse/*
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/382207/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82-%E6%B8%85%E9%99%A4%E6%B0%B4%E5%8D%B0-%22xxx%E6%AD%A3%E5%9C%A8%E8%A7%82%E7%9C%8B%22.user.js
// @updateURL https://update.greasyfork.org/scripts/382207/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82-%E6%B8%85%E9%99%A4%E6%B0%B4%E5%8D%B0-%22xxx%E6%AD%A3%E5%9C%A8%E8%A7%82%E7%9C%8B%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
var count = 0;
var sbTx = setInterval(function(){
        count++;
        var txDd = document.querySelectorAll("[class^='player-inject']")
        if(txDd.length || count > 300) {
           txDd[0].style.opacity = 0;
           txDd[0].style.position = 'absolute';
           txDd[0].style.top = '-100000px';
           clearInterval(sbTx)
         }
     },500)
})();