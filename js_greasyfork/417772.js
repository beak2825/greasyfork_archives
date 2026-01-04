// ==UserScript==
// @name         国开批量自动打分
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202107081102
// @description  国家开放大学,国开学习网批量自动打分辅助脚本,默认不打未提交课程。
// @author       流浪的蛊惑
// @match        *://*.ouchn.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417772/%E5%9B%BD%E5%BC%80%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E6%89%93%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/417772/%E5%9B%BD%E5%BC%80%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E6%89%93%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var x=document.getElementsByTagName("h2");
    if(x!=null){
        x[0].innerHTML="是否全部打分，默认不打未提交<input type='checkbox' id='qbdf'>&nbsp;请设置分数段：<input type='text' id='zddfd' value='1-99' size='6' />&nbsp;<input type='button' value='开始打分' onclick=\"var a=document.getElementById('zddfd');var df=document.getElementById('qbdf');var qbdf='批量全部打分';if(df.checked==false){qbdf='未提交'};var x=document.getElementsByTagName('tr');var fs=a.value.split('-');var fs1=parseInt(fs[0]);var fs2=parseInt(fs[1])-parseInt(fs[0]);for(i=0;i<x.length;i++){if(x[i].outerHTML.indexOf('unselectedrow')>-1){if(x[i].getElementsByTagName('td')[4].outerHTML.indexOf(qbdf)==-1){x[i].getElementsByTagName('td')[5].getElementsByTagName('input')[0].value=parseInt(Math.random()*fs2)+fs1;}}}\" />";
    }
})();