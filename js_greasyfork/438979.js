// ==UserScript==
// @name         WaifuLabs种子分享Seed Share
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  WaifuLabs显示当前图片的种子
// @author       annoyh
// @match        *://waifulabs.com/generate

// @icon         https://www.google.com/s2/favicons?domain=waifulabs.com
// @grant        none
// @run-at       document-end
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/438979/WaifuLabs%E7%A7%8D%E5%AD%90%E5%88%86%E4%BA%ABSeed%20Share.user.js
// @updateURL https://update.greasyfork.org/scripts/438979/WaifuLabs%E7%A7%8D%E5%AD%90%E5%88%86%E4%BA%ABSeed%20Share.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let body = document.body;
    let div = document.createElement("div");
    div.style = "width:200px;height:200px;position:absolute;left:0;top:100px";
    body.appendChild(div);
    let s = window.store;
    let ss = JSON.parse(JSON.stringify(s));

    function getCurSeed() {
        return ss[ss.length-1];
    }
    setInterval(function(){
        ss = JSON.parse(JSON.stringify(s)).girlSeeds;
            seed_box.value = getCurSeed()!=="initial"? getCurSeed(): "";
        },500);
    let pp = document.createElement("p");
    pp.textContent = "种子(seed)";
    div.appendChild(pp);
    let seed_box = document.createElement("input");
    seed_box.style = "width:200px;border:1px black solid";
    seed_box.value = "";
    let seed_btn = document.createElement("button");
    seed_btn.textContent ="复制(copy)";
    seed_btn.onclick=function(){
        //window.copy(seed_box.value);
        seed_box.select();
        document.execCommand("copy");
    }
    div.appendChild(seed_box);
    div.appendChild(seed_btn);
})();
