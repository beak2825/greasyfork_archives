// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        *://www.baidu.com/
// @match        *://www.baidu.com/s?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387935/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/387935/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("form").style.width="705px";
    document.getElementsByClassName("s_btn_wr")[0].style.width = "80px";
    var baiduBtn = document.getElementById("su");//获取百度搜索按钮
    baiduBtn.style.width = "80px";//将百度搜索的按钮设置为80px
    baiduBtn.value = "百度";//将按钮的文字设置为百度
    var googleBtn = document.createElement('span');//设置google搜索按钮
    googleBtn.className = baiduBtn.parentNode.className;//两者class类相同
    googleBtn.style = "width:80px;margin:0px 0px 0px 2px";//google按钮的格式
    googleBtn.innerHTML = "<input type='button' id='google' value='Google' class='btn bg s_btn' style='width:80px;'>";
        googleBtn.addEventListener('click',function(){
        var input = document.getElementById("kw");//获得输入框
        var keyword = input.value.replace(/(^\s*)|(\s*$)/g,"");
        if (keyword != ""){
            return googleSearch(keyword);
        }
    })
        var form = document.getElementsByClassName("fm")[0];//获取百度搜索的父元素
    form.appendChild(googleBtn);//将google添加到百度
    function googleSearch(keyword){
        var link = "https://www.google.com/search?q=" + encodeURIComponent(keyword);
        window.open(link);
}
})();