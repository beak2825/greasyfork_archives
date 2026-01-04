// ==UserScript==
// @name         复活google.cn
// @namespace    http://tampermonkey.net/
// @version      demo0.2
// @description  很粗造的代码
// @author       timcoumu
// @match        https://www.google.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513673/%E5%A4%8D%E6%B4%BBgooglecn.user.js
// @updateURL https://update.greasyfork.org/scripts/513673/%E5%A4%8D%E6%B4%BBgooglecn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var divList = document.getElementsByTagName("div");
    divList[0].remove();
    var html = "<section class=\"div_main\">\<p class = \"p\"></p><img class=\"Search_logo\" src=\"https://www.google.cn/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png\" alt=\"Google一下，你就知道\">\<section class=\"div_search\">\<form action=\"https://g.savalone.com/search\" action=\"GET\">\<input type=\"search\" name=\"q\" class=\"input_text\" id=\"input_text\" placeholder=\"Google一下，你就知道\"></form></section></section>";
    //调整html和body的宽高
    var body = document.body;
    document.documentElement.style.height = "100%";
    body.style.setProperty("height", "100%", "important");
    body.style.setProperty("width", "100%", "important");
    body.insertAdjacentHTML("afterbegin",html);
    //设置元素样式
    var div_main = document.getElementsByClassName("div_main");
    var p = document.getElementsByClassName("p");
    var Search_logo = document.getElementsByClassName("Search_logo");
    var div_search = document.getElementsByClassName("div_search");
    var input_text = document.getElementsByClassName("input_text");
    var footer = document.getElementById("footer");
    var title = document.getElementsByTagName("title");
    title[0].insertAdjacentHTML("beforebegin","<link rel=\"shortcut icon\" href=\"https://www.gstatic.cn/devrel-devsite/prod/v0e3f58103119c4df6fb3c3977dcfd0cb669bdf6385f895761c1853a4b0b11be9/developers/images/favicon-new.png\" type=\"image/x-icon\">");
    console.log(div_main);
    footer.style.display = "none";
    div_main[0].style.width = "100%";
    div_main[0].style.textAlign = "center";
    Search_logo[0].style.height = "20%";
    p[0].style.height = "20vh";
    div_search[0].style.lineHeight = "100px";
    div_search[0].style.width = "100%";
    input_text[0].style.width = "60%";
    input_text[0].style.borderRadius = "24px";
    input_text[0].style.height = "44px";
    input_text[0].style.textAlign = "center";
    input_text[0].style.border = "1px solid #dfe1e5";
})();