// ==UserScript==
// @name         国家中小学智慧教育平台教材下载按钮
// @namespace    https://greasyfork.org/zh-CN/scripts/450700
// @version      4.0
// @description  用于下载国家中小学智慧教育平台的教材
// @author       300g-BoHeYou
// @match        https://www.zxx.edu.cn/tchMaterial/*
// @match        https://basic.smartedu.cn/tchMaterial/*
// @icon         https://www.zxx.edu.cn/favicon.ico
// @license MIT
// @grant        GM_download
// @grant        GM_log

// @downloadURL https://update.greasyfork.org/scripts/450700/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/450700/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        var download = document.getElementsByClassName("index-module_info_evO1d")[0];
        var download_div = document.createElement("div");
        download.appendChild(download_div);
        download_div.style = 'width:150px;text-align:right;';
        download_div.innerHTML = '<span class="downloadbtn" style="color:white;padding:10px 20px;border-radius:10px;background:red">下载pdf</span>';
        document.getElementsByClassName("downloadbtn")[0].onclick = function(){
            const url = new URL(performance.getEntriesByType('resource').filter(entry =>{return /viewer\.html/.test(entry.name);})[0].name);
            var searchParams = new URLSearchParams(url.search);
            var file = searchParams.getAll("file")[0];
            var header = searchParams.getAll("headers")[0];
            var name = document.title.split('·')[1]+".pdf";
            GM_download({
                url:file,
                name:name,
                saveAs: true,
                headers:header
            })
        };
    },2000);

})();

