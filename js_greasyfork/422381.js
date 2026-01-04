// ==UserScript==
// @name         百度，谷歌搜索
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  添加谷歌搜索按钮
// @author       WXX
// @match        *://www.baidu.com/
// @match        *://www.baidu.com/s?*
// @match        *://www.baidu.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/422381/%E7%99%BE%E5%BA%A6%EF%BC%8C%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/422381/%E7%99%BE%E5%BA%A6%EF%BC%8C%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var baidubtn = document.getElementById('su');
    baidubtn.style.width = '80px';
    baidubtn.value = '百度';
    var googlebtn = document.createElement('span');
    googlebtn.className = baidubtn.parentNode.className;
    var form = document.getElementsByClassName('fm')[0];
    form.appendChild(googlebtn)
    form.style.width='800px';
    document.getElementsByClassName("s_btn_wr")[0].style.width = "80px";

    googlebtn.innerHTML ="<input type='button' id='google' value='Google' class='btn bg s_btn' style='width:80px;'>"
    var g = document.getElementById('google');
    Object.defineProperty(g,'value',{         // 防止被修改
        writable: false,
        configurable: false
    })
        Object.defineProperty(baidubtn,'value',{
        writable: false,
        configurable: false
    })
    googlebtn.addEventListener('click',function(event){
        event.preventDefault();
        var input = document.getElementById("kw"); // 获取百度输入框
        var keyword = input.value.replace(/(^\s*)|(\s*$)/g, ""); // 获取搜索内容（去空格）
        if(keyword!=''){
            googleSearch(keyword);
        }
    })
    baidubtn.addEventListener('click',function(event){
        var input = document.getElementById("kw"); // 获取百度输入框
        var keyword = input.value.replace(/(^\s*)|(\s*$)/g, ""); // 获取搜索内容（去空格）
        if(keyword==''){
             event.preventDefault();   //为空时不搜索
        }
    })
    function googleSearch(keyword){
       var link = "https://www.google.com/search?q=" + encodeURIComponent(keyword); // 拼接好 Google 搜索的链接
       GM_openInTab(link);
    }

})();