// ==UserScript==
// @name         百度文库还原纯白背景与净化
// @author       Black Rabbit
// @namespace    Black Rabbit
// @version      0.2
// @description  去除强制花里胡哨的背景与部分多余元素，恢复默认纯白背景，并未全部去除，可用adblockplus去除的不作处理
// @match        *://wenku.baidu.com/*
// @match        *://wk.baidu.com/*
// @run-at       document-start
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444729/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E8%BF%98%E5%8E%9F%E7%BA%AF%E7%99%BD%E8%83%8C%E6%99%AF%E4%B8%8E%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444729/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E8%BF%98%E5%8E%9F%E7%BA%AF%E7%99%BD%E8%83%8C%E6%99%AF%E4%B8%8E%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

// Wipe the bg
function wipebg() {
    'use strict';
    while(!document.getElementById('app')){
    }
    var app = document.getElementById('app');
    if(app.style!=''){
        app.style = '';
    }
}

function wipevmpc() {
    'use strict';
    var vmpc = document.getElementsByClassName('vip-member-pop-content');
    var cmw = document.getElementsByClassName('comment-wrapper');
    var fwi = document.getElementById('footer-wrapper-id');
    var sw = document.getElementsByClassName('sidebar-wrapper');
    vmpc[0].remove();
    cmw[0].remove();
    fwi.remove();
    var swc = sw[0].children;
    for(var i=0;i<swc.length+5;i++){
        swc[0].remove();
    }
}

setTimeout(wipebg,200);
setInterval(wipevmpc,400);
setTimeout(clearInterval(wipevmpc),4000);