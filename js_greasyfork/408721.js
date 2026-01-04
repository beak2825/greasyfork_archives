// ==UserScript==
// @name         百度首页透明
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  百度首页透明!
// @author       You
// @match      https://www.baidu.com/?tn=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408721/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E9%80%8F%E6%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/408721/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E9%80%8F%E6%98%8E.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
    let s_top_wrap = document.getElementById('s_top_wrap');
    if (s_top_wrap) {
        s_top_wrap.style.background = 'rgba(0,0,0,0)';
    }
    let s_main = document.getElementById("s_main")
    if(s_main) {
      s_main.style.background = 'rgba(255,255,255,0)'
    }
    let codeBlocks = document.getElementsByClassName('s-code-blocks');
    if (codeBlocks) {
        for (let i = 0; i < codeBlocks.length; i++) {
            codeBlocks[i].style.boxShadow = '0 0 0 0 rgba(0,0,0,0)'
        }
    }
    let s_lm_wrap=document.getElementById("s_lm_wrap");
    if (s_lm_wrap) {
        s_lm_wrap.remove();
    }
    let bottom_layer = document.getElementById("bottom_layer");
    if (bottom_layer) {
        bottom_layer.style.background = 'rgba(0,0,0,0)';
    }
    document.getElementsByTagName('html')[0].style.overflowY='hidden';
})();