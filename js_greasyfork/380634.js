// ==UserScript==
// @name         Acg18NoMusic
// @namespace    https://greasyfork.org/zh-CN/scripts/380634-acg18nomusic
// @version      0.1
// @description  自动停止播放音乐！
// @author       gfbxy
// @match        https://acg18.life/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/380634/Acg18NoMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/380634/Acg18NoMusic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    checkAp();
})();

function checkAp(){
    if(ap.length<1){
        setTimeout(function(){
            checkAp();
        },200)
    }
    else{
        for(var i=0;i<ap.length;i++){
            ap[i].pause();
        }
    }
}