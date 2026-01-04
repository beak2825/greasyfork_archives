// ==UserScript==
// @name         Better 古诗文网
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  更好的古诗文网体验
// @author       xhze_
// @match        https://*.gushiwen.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gushiwen.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458766/Better%20%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/458766/Better%20%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91.meta.js
// ==/UserScript==

var xhze_DisableErrorDisplay=false;

(function() {
    'use strict';
    console.log(`更好的古诗文网。v0.0.1 By xhze_`);
    xhze_DisableErrorDisplay && (()=>{window.onerror=()=>true})();
    try{showErweima=()=>{console.log(Math.random()>=0.5?"啊哈哈哈":"鸡汤来喽")};}
    catch(e){console.info("showErweima可能不存在："+e.toString()+"\n请尝试检查是否处于阅读界面。");}
})();