// ==UserScript==
// @name         中国大学慕课mook评价脚本
// @namespace    lwsy
// @version      1.9.12
// @description 自动评价mook上同学的互评以及自评
// @author       菁华如梦
// @match        https://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/learn/*
// @match        http://www.icourse163.org/spoc/learn/*
// @match        https://www.icourse163.org/spoc/learn/*
// @grant        unsafewindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/426216/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%E6%85%95%E8%AF%BEmook%E8%AF%84%E4%BB%B7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/426216/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6%E6%85%95%E8%AF%BEmook%E8%AF%84%E4%BB%B7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var button = document.createElement('div');
    document.body.appendChild(button);
    button.setAttribute('style','position:fixed;right:120px;bottom:120px;font-family: inherit;display: inline-block;line-height: 1;white-space: nowrap;cursor: pointer;background: #fff;border: 1px solid #dcdfe6;color: #606266;text-align: center;box-sizing: border-box;outline: none;margin: 0;font-weight: 500;padding: 12px 20px;font-size: 14px;border-radius: 4px;');
    button.innerText='自动评价';
    button.onclick = function(){
        console.log('click')
        var setPointAll=document.querySelectorAll('.detail .s');
        for(var i=0;i<setPointAll.length;i++){
            var child=setPointAll[i].children;
            console.log(child,setPointAll[i])
            child[getRandom(child.length - 3,child.length - 1)].firstElementChild.setAttribute('checked',true)
        }
        var visible=document.getElementsByClassName('answerVisible');
        for(i=0;i<visible.length;i++){
            visible[i].firstElementChild.setAttribute('checked',false)
        }
        var input=document.querySelectorAll('.j-textarea.inputtxt');
        var EVALUATES=['写的好','同学需要继续努力','写的不错','很好']
        for(i=0;i<input.length;i++){
            input[i].value=EVALUATES[getRandom(0,EVALUATES.length-1)]
        }
        var checkbox=document.querySelectorAll('.av .j-acb');
        for(i=0;i<checkbox.length;i++){
            checkbox[i].checked=false;
        }
        scroll(0,document.body.scrollHeight)
    }
    function getRandom(min,max){
        return Math.round(Math.random()*(max-min))+min
    }
    // Your code here...
})();