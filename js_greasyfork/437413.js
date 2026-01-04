// ==UserScript==
// @name         百度翻译驼峰格式
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  百度翻译去除无用的模块，增加一键转为驼峰格式命名
// @author       Gylii
// @match        https://www.tampermonkey.net/scripts.php
// @match        https://fanyi.baidu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437413/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E9%A9%BC%E5%B3%B0%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/437413/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E9%A9%BC%E5%B3%B0%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict'

    document.getElementById('header').style.display="none"
    document.getElementById('transOtherRight').style.display = 'none'
    document.getElementsByClassName('inner clearfix')[0].style.display="none"
    document.getElementsByClassName('main main-inner')[0].style.margin = '120px 0'
    document.getElementsByClassName('extra-wrap')[0].style.display="none"

    var btn = document.createElement('div')
    var inputElement =document.createElement("input");

    inputElement.style.width= "100%"
    inputElement.style.height= "30px"
    inputElement.style.background= "none"
    inputElement.style.color= "#000"
    inputElement.style.lineHeight= "30px"
    inputElement.style.textAlign= "left"
    inputElement.style.fontSize= "20px"
    inputElement.style.border= "none"
    inputElement.style.margin= "10px 0"
    inputElement.style.padding= " 0 10px"




    btn.style.width= "100px"
    btn.style.height= "40px"
    btn.style.background= "#4395ff"
    btn.style.color= "#fff"
    btn.style.lineHeight= "40px"
    btn.style.textAlign= "center"
    btn.style.fontSize= "14px"
    btn.style.borderRadius= "5px"
    btn.style.cursor= "pointer"
    btn.style.margin= "0 10px "

    btn.innerHTML = "复制驼峰格式"
    function titleCase(s) {
        var i, ss = s.toLowerCase().split(/\s+/);
        for (i = 0; i < ss.length; i++) {
            ss[i] = ss[i].slice(0, 1).toUpperCase() + ss[i].slice(1);
        }
        return ss.join(' ');
    }
    btn.addEventListener('click',function conversion(){
      var str = document.getElementsByClassName("target-output")[0].innerText;
        str = titleCase(str).replace(/\s*/g,"")

        inputElement.value = str;
        inputElement.select();//选中input框的内容
        document.execCommand("Copy");// 执行浏览器复制命令
        btn.innerHTML = "复制成功！"
        btn.style.background= "#50a450"
        setTimeout(function(){ btn.innerHTML = "复制驼峰格式";btn.style.background= "#4395ff"},3000);
    });
    document
        .getElementsByClassName("trans-right")[0].appendChild(inputElement)
    document
        .getElementsByClassName("trans-right")[0].appendChild(btn)
    // Your code here...
})();
