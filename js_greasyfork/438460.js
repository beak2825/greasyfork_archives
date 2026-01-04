// ==UserScript==
// @name         快速教学评价
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  快速完成西工大教学评价，鲁迅曾经说过：“老师们认真教，我就认真填；老师们随便教，我就随便填”
// @author       kbtx
// @match        https://yjsjy.nwpu.edu.cn/pyxx/pygl/jxpj/edit/*
// @icon         https://www.google.com/s2/favicons?domain=nwpu.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438460/%E5%BF%AB%E9%80%9F%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/438460/%E5%BF%AB%E9%80%9F%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        //学习动力(7表示很大，1表示很小)
        document.getElementsByName("xxdl")[Math.floor(Math.random()*3)].checked = true
        // 一级指标	二级指标	观测点
        for(let k=1;k<=5;k++){
            for(let i=1;i<=10;i++){
                for(let j=1;j<=10;j++){
                    let s = document.getElementsByName("myd_" + k + "_" + i + "_" + j)
                    if(!s || s.length==0) continue;
                    let r = Math.random()*10
                    if(0<=r&&r<2){
                        s[0].checked = true;
                    }else if(2<=r&&r<8){
                        s[1].checked = true
                    }else if(8<=r&&r<10){
                        s[2].checked = true
                    }
                }
            }
        }
        let s_len = Math.floor(Math.random()*45) + 30
        let str = ''
        for(let i=0;i<s_len;i++){
            str += String.fromCharCode(Math.floor(Math.random()*500) + 1000)
        }
        //其他建议及意见
        document.querySelector("#pjyj").innerText=str
    }
    // Your code here...
})();