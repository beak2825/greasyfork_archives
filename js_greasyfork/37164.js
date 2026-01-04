// ==UserScript==
// @name         电影天堂广告去除及电影链接直接显示
// @namespace    http://tampermonkey.net/
// @version      2018.1.8
// @description  电影天堂一进去随便点击毕然打开一波广告，作为一个搬砖狗，感觉很烦，就弄了几段代码去了。。另外也把电影的迅雷链接以选中方式直接显示在页面，如果需要复制下载,直接CTRL+C，本着方便自己，方便他人的原则，上传一波，以兹共享!
// @author       talen
// @match        http://www.dytt8.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37164/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E5%8F%8A%E7%94%B5%E5%BD%B1%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/37164/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E5%8F%8A%E7%94%B5%E5%BD%B1%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function(){

        if(document.querySelector("body > a")){
document.querySelector("body > a").outerHTML = "";
}
    };

var input = document.createElement("input");

input.setAttribute("id","myinput");
input.style.color = "red";
input.style.width = "950px";
input.style.height = "30px";
input.style.margin = "0 auto";
input.style.position = "fixed";
input.style.top = "0";
input.style.left = "0";
input.style.bottom = "0";
input.style.right = "0";

if(document.querySelector("#Zoom span table tbody tr td a")){


    input.value= document.querySelector("#Zoom span table tbody tr td a").attributes[7].value;

    document.body.prepend(input);

   document.getElementById("myinput").select();

   }

})();