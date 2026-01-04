// ==UserScript==
// @name         给miobt特征码前面加上磁力头
// @namespace    DBeidachazi
// @version      0.1
// @description  磁力链接加磁力头 添加按钮
// @author       DBeidachazi
// @match        http://miobt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=miobt.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444392/%E7%BB%99miobt%E7%89%B9%E5%BE%81%E7%A0%81%E5%89%8D%E9%9D%A2%E5%8A%A0%E4%B8%8A%E7%A3%81%E5%8A%9B%E5%A4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/444392/%E7%BB%99miobt%E7%89%B9%E5%BE%81%E7%A0%81%E5%89%8D%E9%9D%A2%E5%8A%A0%E4%B8%8A%E7%A3%81%E5%8A%9B%E5%A4%B4.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    let x = document.getElementById('text_hash_id');
    let xInnerHtml = x.innerHTML;
    // '，特征码：a1767f680726a3b6faab26dcf755244b9991bf8b'
    let aa = xInnerHtml.split('：');
    x.innerHTML = aa[0] + '： magnet:?xt=urn:btih:' + aa[1];
    let magneticString = aa[1];



    let btn=document.createElement("button");
    let t=document.createTextNode("点我复制磁链");
    btn.appendChild(t);
    document.body.appendChild(btn);
    btn.style.position = "fixed";
    btn.style.backgroundColor = "pink";
    btn.style.border = "2px dotted black";
    btn.style.top = "70px";
    btn.style.width = "120px";
    btn.style.height = "40px";
    btn.onmouseover = function (){
        btn.style.backgroundColor = "yellow";

    }
    btn.onmouseout = function (){
        btn.style.backgroundColor = "pink";
    }


    btn.onclick = function
        (){
        const input = document.createElement("input"); // 直接构建input
        input.value = "magnet:?xt=urn:btih:"+magneticString; // 设置内容
        document.body.appendChild(input); // 添加临时实例
        input.select(); // 选择实例内容
        document.execCommand("Copy"); // 执行复制
        document.body.removeChild(input); // 删除临时实例
        alert("复制成功")
    }

})();
