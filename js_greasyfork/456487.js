// ==UserScript==
// @name         山西大学半自动评教
// @namespace    http://bfn.pub/
// @version      0.1
// @description  山西大学半自动评教插件
// @author       lpyyxy
// @match        http://sdbkjw.webvpn.sxu.edu.cn/xspjgl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sxu.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456487/%E5%B1%B1%E8%A5%BF%E5%A4%A7%E5%AD%A6%E5%8D%8A%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/456487/%E5%B1%B1%E8%A5%BF%E5%A4%A7%E5%AD%A6%E5%8D%8A%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==



(function() {
    'use strict';
    function teacherClick () {
        var ms= 3000;
        var lastClick = Date.now() - ms;
        document.getElementById('panel_content').addEventListener('DOMNodeInserted',()=>{
            if(Date.now() - lastClick >= ms){
                window.setTimeout(()=>{
                    document.getElementsByName('py')[0].onfocus =()=>{
                        document.getElementsByName('py')[0].value='非常好'
                        var det= document.getElementById('btn_xspj_bc')
                        }
                    var list = document.getElementsByClassName('form-control input-sm input-pjf');
                    for(var i in list){
                        list[i].value = 100;
                    }
                },500);
                lastClick = Date.now();
            }
        });
    }
    document.getElementById("tempGrid").addEventListener('DOMNodeInserted',()=>{
        var list = document.getElementsByClassName('ui-widget-content jqgrow ui-row-ltr');
        for(var i in list){
            list[i].onclick = teacherClick;
        }
    })
})();