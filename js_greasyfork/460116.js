// ==UserScript==
// @name         指南助手
// @version      0.5
// @description  download guideline
// @author       Hubert_Chen
// @match        https://guide.medlive.cn/*
// @icon         https://webres.medlive.cn/favicon.ico
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1028107
// @downloadURL https://update.greasyfork.org/scripts/460116/%E6%8C%87%E5%8D%97%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/460116/%E6%8C%87%E5%8D%97%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //有"付费指南"控件的页面才起效
    const download_btn = document.getElementsByClassName('detailsQRWrapper')[0];

    var scripts = document.getElementsByTagName('script');
    var jsCode = '';
    for (var i = 0; i < scripts.length; i++) {
        jsCode += scripts[i].innerHTML;
        };
    //2023-7-15更新，测试地址：https://guide.medlive.cn/guideline/27732
    if (jsCode.includes("payment")||jsCode.includes("版权原因") ){
        let download_a = document.createElement("a");
        download_btn.append(download_a);
        download_a.style = "width:90px;height:25px;text-align:middle;color:white;background:red";
        download_a.style.display = "inline-block";
        download_a.target = "_blank";
        download_a.innerText = "下载";

        //对页面中的指南名称进行标准化处理
        let title_name = document.title.replace(/\//g,"／").replace(",","，");
        title_name = title_name.replace("(","（").replace(")","）");
        title_name = title_name.replace("［","[").replace("］","]");
        title_name = title_name.replace(" ","");
        title_name = title_name.replace("_临床指南","");
        const url = "https://hubert5.oss-cn-shanghai.aliyuncs.com/pdf/"+ encodeURIComponent(title_name) +".pdf";

        download_a.href = url;
    };
})();