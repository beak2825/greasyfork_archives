// ==UserScript==
// @name         百度首页和搜索页面添加必应搜索框
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在百度首页和搜索页面添加必应搜索框
// @author       自古小明多风流
// @match        *://www.baidu.com/
// @match        *://www.baidu.com/s?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471645/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%92%8C%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/471645/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%92%8C%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function(){
    var baiduBtn = document.getElementById("su"); // 获取百度搜索按钮
    baiduBtn.style.width = "80px"; //将百度搜索按钮的宽度设为 80 px
    baiduBtn.value = "百度"; //将百度搜索按钮的文字设为百度
    var bingBtn = document.createElement('span'); // 创建 bing 搜索按钮
    bingBtn.className = baiduBtn.parentNode.className; // 将 bing 搜索按钮和百度搜索按钮的 class 名称设置为相同，目的是使用百度搜索按钮已有的部分样式
    bingBtn.style = "width:80px;margin:0px 0px 0px 1px";
    bingBtn.innerHTML = "<input type='button' id='bing' value='必应' class='btn bg s_btn' style='width:80px;'>";
    var form = document.getElementsByClassName("fm")[0]; // 获取百度搜索按钮的父元素
    form.appendChild(bingBtn); // 将 Bing 按钮作为一个子元素添加到百度搜索按钮的父元素里面

    bingBtn.addEventListener('click', function () {
    var input = document.getElementById("kw"); // 获取百度输入框
    var keyword = input.value.replace(/(^\s*)|(\s*$)/g, ""); // 获取搜索内容（去空格）
    if (keyword != "") { // 如果搜索内容不为空，就调用 bingSearch() 方法进行搜索，需要传入的参数是搜索内容
            bingSearch(keyword);
       }
    });
    function bingSearch(keyword){ // bing 搜索方法
        var link = "https://www.cn.bing.com/search?q=" + encodeURIComponent(keyword); // 拼接好 bing 搜索的链接
        window.open(link); //新窗口打开链接
    }
    document.getElementById("form").style.width = "760px";
    document.getElementsByClassName("s_btn_wr")[0].style.width = "80px";

    };


})();