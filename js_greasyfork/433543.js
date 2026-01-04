// ==UserScript==
// @name         知网PDF下载
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  针对硕博论文，将Caj下载链接替换为PDF下载链接
// @author       dlutor
// @match        *.cnki.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/433543/%E7%9F%A5%E7%BD%91PDF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/433543/%E7%9F%A5%E7%BD%91PDF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = '',datas =document.getElementsByName('cajDown');
    for (var i=0;i<datas.length;i++){
        if (datas[i].innerText.indexOf("在线阅读") != -1){
            url = datas[i].href;
            url = 'https://chn.oversea.cnki.net/kns/download?dflag=pdfdown' + url.substring(62);//
        }
    }
    if (url != ''){
        for (i=0;i<datas.length;i++){
            if (datas[i].innerText.indexOf("整本下载") != -1){
                datas[i].href = url;
                datas[i].innerHTML = datas[i].innerHTML.replace('整本下载','PDF下载');
        }
    }}
})();