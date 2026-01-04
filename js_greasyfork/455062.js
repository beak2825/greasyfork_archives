// ==UserScript==
// @name         Bib参考文献一键复制
// @namespace    https://scholar.google.com/
// @version      0.1
// @description  谷歌学术参考文献Bib格式一键复制到剪切板
// @author       欢迎关注我的B站 https://space.bilibili.com/425848841
// @license      GPL-3.0 License
// @match        *://*.scholar.google.com/*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/455062/Bib%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/455062/Bib%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    var gs_nta = document.getElementsByClassName('gs_nta')[3];
    gs_nta.innerHTML = "复制Bib文献";
    var link = gs_nta.href;
    gs_nta.href = "#";
    // 跨域请求数据
    gs_nta.onclick=function(){
        GM_xmlhttpRequest({
        method: "GET",
        url: link,
        onload: function(response) {
            //这里写处理函数
            console.log(response.responseText);
            GM_setClipboard(response.responseText);
            gs_nta.innerHTML = "复制成功！";
        }
        });
    }

    //var gs_fl = document.getElementsByClassName('gs_fl')[1];
    //var gs_nta = gs_fl.children[3];
    //var link = gs_nta.href;
    //gs_nta.href = "#";


})();