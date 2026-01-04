// ==UserScript==
// @name         下载ClickBank产品数据
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动下载页面 try to take over the world!
// @author       Emery Yan
// @include      https://*.clickbank.com/*
// @include      https://gitbay.accounts.clickbank.com/*
// @include      http://gitbay.accounts.clickbank.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377444/%E4%B8%8B%E8%BD%BDClickBank%E4%BA%A7%E5%93%81%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/377444/%E4%B8%8B%E8%BD%BDClickBank%E4%BA%A7%E5%93%81%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function getClickbankData(){
        var $ = window.$ ;
        var rbodys = $('.results tbody .result');
        var rstatus = $('.results .marketplaceStats');

        var markdownResult='';

        var regS = new RegExp("\n","g");
        var regSpace = new RegExp("\ {2,100}","g");

        for(var i =0;i<rbodys.length;i++ ){
            var rb = rbodys[i];
            var rs = rstatus[i]

            var title = rb.querySelector('.mobileAndStandard').innerText;
            title = title.replace(regS," ").replace(regSpace," ").trim();// 去除标题里的空格

            var link =rb.querySelector('.mobileAndStandard a').getAttribute('href')

            var desc = rb.querySelector('.details').innerText;


            var status = rs.innerText;

            var tx = "## "+title+'\n 链接: '+ link + "\n" + desc+'\n'+status
            console.log('得到',tx);
            markdownResult = markdownResult + tx +'\n\n';
        }

        return markdownResult;
    }


    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }


    function replaceDollarSymbol(markdownResult){
        // 因为 $ 在markdown是特殊符号，会导致文档结构出现错误
        var regS = new RegExp("\\$","g");
        return markdownResult.replace(regS,'￥') ;
    }



    function DownloadClickBankData(){
        var markdownResult = getClickbankData()
        var markup = replaceDollarSymbol(markdownResult) ;
        var filename= document.title +'.md';
        filename = filename.replace(/\ /g,"-"); // 替换成空格
        download( filename ,markup);
    }

    // Your code here...
    console.log('加载网页下载 Clickbank 的命令  window.DownloadClickBankData()');
    window.DownloadClickBankData = DownloadClickBankData;

})();