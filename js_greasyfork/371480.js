// ==UserScript==
// @name         SEU 选课页面兼容性修复
// @namespace    http://xk.urp.seu.edu.cn/
// @version      0.1
// @description  修复选课系统另行选择在 Chrome 和 Firefox 下无弹窗的问题
// @author       Raphael
// @match        http://xk.urp.seu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371480/SEU%20%E9%80%89%E8%AF%BE%E9%A1%B5%E9%9D%A2%E5%85%BC%E5%AE%B9%E6%80%A7%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/371480/SEU%20%E9%80%89%E8%AF%BE%E9%A1%B5%E9%9D%A2%E5%85%BC%E5%AE%B9%E6%80%A7%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==


$(function(){
    if(window.showModalDialog === undefined){
        //alert("初始化的时候,判断window.showModalDialog是否存在")
        window.showModalDialog = function(url,mixedVar,features){
            window.hasOpenWindow = true;
            if(mixedVar) var mixedVar = mixedVar;
            if(features) var features = features.replace(/(dialog)|(px)/ig,"").replace(/;/g,',').replace(/\:/g,"=");
            window.myNewWindow = window.open(url,"_blank",features);
        }
    }
});