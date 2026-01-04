// ==UserScript==
// @name         光标自动聚焦
// @namespace    http://mdkml.cn/
// @version      0.3
// @description  有输入框的页面，光标自动聚焦（聚焦于第一个没有隐藏的输入框），方便直接输入
// @author       MDKML
// @include      http://*
// @include      https://*
// @include      *
// @icon         http://mdkml.cn/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437062/%E5%85%89%E6%A0%87%E8%87%AA%E5%8A%A8%E8%81%9A%E7%84%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/437062/%E5%85%89%E6%A0%87%E8%87%AA%E5%8A%A8%E8%81%9A%E7%84%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var inputArr = document.getElementsByTagName("input")
    if(inputArr){
        for(var input of inputArr ){
            if(input.type=="text"||input.type=="search"){
                input.focus();
                return
            }}
    }

})();