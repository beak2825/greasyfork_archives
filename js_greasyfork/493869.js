// ==UserScript==
// @name         高考直通车PDF下载
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  高考直通车添加直接下载PDF的按钮
// @author       braveteen
// @match        https://app.gaokaozhitongche.com/newsexam/h/*
// @icon         https://app.gaokaozhitongche.com/css/sharewb/img/head-img.png
// @license      MIT
// @compatible   chrome
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493869/%E9%AB%98%E8%80%83%E7%9B%B4%E9%80%9A%E8%BD%A6PDF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/493869/%E9%AB%98%E8%80%83%E7%9B%B4%E9%80%9A%E8%BD%A6PDF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var styles = `
  background-color: DodgerBlue;
  border: none;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 18px;
`;
    var scripts = document.getElementsByTagName("script");

for (var i = 0; i < scripts.length; i++) {
    console.log("Script " + i + ":");
    console.log(scripts[i].textContent);
}


    var url = document.getElementsByTagName("script")[7].textContent.match(/auto_pdf_url\s*:\s*['"]([^'"]+)['"]/)[1];
    // console.log(url);
    url = url.replace("http","https");


    var link = document.createElement("button");
    link.innerHTML = "下载PDF";
    link.style.cssText = styles
    var vipDiv = document.getElementsByClassName("vip_icon")[0]
    vipDiv.parentNode.replaceChild(link, vipDiv);
    link.onclick = () =>{
        if(url){
            window.URL = window.URL || window.webkitURL;

            var xhr = new XMLHttpRequest(),
                a = document.createElement('a'), file;

            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                file = new Blob([xhr.response], { type : 'application/pdf' });
                a.href = window.URL.createObjectURL(file);
                a.download = document.title.concat(".pdf");
                a.click();
            };
            xhr.send();
            alert("成功开始下载");
        }else{
            alert("下载失败 如需帮助 请联系脚本作者");
        }
    }
})();