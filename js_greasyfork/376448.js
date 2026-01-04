// ==UserScript==
// @name         虎牙TV自动领取礼物
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  实现虎牙TV自动挖宝
// @author       LEI
// @match        https://www.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376448/%E8%99%8E%E7%89%99TV%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E7%A4%BC%E7%89%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/376448/%E8%99%8E%E7%89%99TV%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E7%A4%BC%E7%89%A9.meta.js
// ==/UserScript==

window.setInterval(function() {
    var btns = document.getElementsByClassName('player-box-stat3');
    for(var i=0;i<btns.length;i++){
        var btn = btns[i];
        if(btn.style.visibility=="visible"){
            btn.click();
            document.getElementById("player-box").style.display="none";
           }
    }
}, 60000);