// ==UserScript==
// @name         解除超星限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可粘贴、可复制
// @author       wangdi
// @match        https://mooc1.chaoxing.com/mooc2/work/dowork*
// @match        https://mooc1.chaoxing.com/exam/*
// @match        https://mooc1.chaoxing.com/mooc2/exam/preview*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/445911/%E8%A7%A3%E9%99%A4%E8%B6%85%E6%98%9F%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/445911/%E8%A7%A3%E9%99%A4%E8%B6%85%E6%98%9F%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let editorList=document.getElementsByTagName('textarea');//解除考试和作业不能粘贴
    for(let i=0;i<editorList.length;i++){
        let id=editorList[i].getAttribute('name');
        var editor1 = UE.getEditor(id);
        editor1.removeListener('beforepaste', editorPaste);
    }
    document.querySelector("body").setAttribute('onselectstart',"return true");//解除考试时不能复制
    document.getElementsByTagName('html')[0].style.userSelect='text'

})();