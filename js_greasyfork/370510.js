// ==UserScript==
// @name              百度首页和搜索页面添加 Google 搜索框
// @name:en           add a google search button on the baidu's homepage and search result page
// @namespace         http://mofiter.com/
// @version           0.4
// @description       在百度首页和搜索结果页面的百度一下按钮后面添加 Google 按钮，方便直接进行 Google 搜索
// @description:en    add a google search button behind the baidu search button on the baidu's homepage and search result page,making it convenient to search in google
// @author            mofiter
// @create            2018-07-22
// @lastmodified      2018-08-08
// @match             http*://www.baidu.com/
// @match             http*://www.baidu.com/s?*
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/370510/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%92%8C%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%20Google%20%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/370510/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%92%8C%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%20Google%20%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("form").style.width = "705px";
    document.getElementsByClassName("s_btn_wr")[0].style.width = "80px";
    var baiduBtn = document.getElementById("su"); // 百度搜索按钮
    baiduBtn.style = "width:80px";
    baiduBtn.value = "百度";
    var googleBtn = document.createElement('span'); // Google 搜索按钮
    googleBtn.className = baiduBtn.parentNode.className; // 将 Google 搜索按钮和百度搜索按钮的 class 名称设置为相同
    googleBtn.style = "width:80px;margin:0px 0px 0px 2px";
    googleBtn.innerHTML = "<input type='button' id='google' value='Google' class='btn bg s_btn' style='width:80px;'>";
    googleBtn.addEventListener('click', function () {
        var input = document.getElementById("kw"); // 百度输入框
        var keyword = input.value.replace(/(^\s*)|(\s*$)/g, ""); // 搜索关键字（去空格）
        if (keyword != "") {
            return googleSearch(keyword);
        }
    })
    var form = document.getElementsByClassName("fm")[0];
    form.appendChild(googleBtn);

    function googleSearch(keyword){ // Google 搜索
        var link = "https://www.google.com/search?q=" + encodeURIComponent(keyword);
        // window.location.href = link; //当前窗口打开链接
        window.open(link); //新窗口打开链接
    }
})();