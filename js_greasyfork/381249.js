// ==UserScript==
// @name         百度药丸修复
// @namespace    https://www.baidu.com/
// @version      0.1
// @description  修复百度药丸的图片变形
// @author       MHyun
// @match        *://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381249/%E7%99%BE%E5%BA%A6%E8%8D%AF%E4%B8%B8%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/381249/%E7%99%BE%E5%BA%A6%E8%8D%AF%E4%B8%B8%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var result = document.getElementById('result_logo');
    var imgs = result.getElementsByTagName('img');
    for(var i =0; i<imgs.length; i++){ imgs[i].style.height = '48px';}
    document.getElementById('s_wrap').style.display='none';
    document.getElementById('s_btn_wr').style.background='none';
    document.getElementById('s_icons').style.display='none';
    document.getElementById('lg').style.marginTop='180px';
    document.getElementById('s_menu_gurd').style.display='none';
    document.getElementById('s_btn_wr').style.border='none';
    var sp = document.getElementById('u_sp');
    var list = sp.getElementsByTagName('a');
    for(var j = 0; j<list.length; j++){
        if(!list[j].getAttribute('id'))list[j].style.display='none';
        else break;
    }
})();