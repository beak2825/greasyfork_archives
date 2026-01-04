// ==UserScript==
// @name         不用控件就下载
// @namespace    http://tampermonkey.net/
// @version      2024-5-4
// @description  帮助用户下载文件
// @author       Nansen
// @match        http://yunoa.fjsjyt.cn:8080/egov60/docunit.nsf/DocReceived*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fjsjyt.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493901/%E4%B8%8D%E7%94%A8%E6%8E%A7%E4%BB%B6%E5%B0%B1%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/493901/%E4%B8%8D%E7%94%A8%E6%8E%A7%E4%BB%B6%E5%B0%B1%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //加载DOM完整后执行操作
    window.addEventListener('load', function () {
        //获取aalink类名所有结点的集合
        var linkNodes = document.querySelectorAll('.aalink');
        var fileLink ='';//文件的实际地址
        var fileDownload='';//文件的名称
        var div = document.createElement("div");

        //遍历node
        for (let linkNode of linkNodes) {
            console.log(linkNode);
            //文件的超链接
            fileLink = linkNode.getAttribute('href');
            fileDownload = linkNode.getAttribute('download');
            //创建超链接元素
            let alink = document.createElement("a");
            alink.setAttribute('href',fileLink);
            alink.setAttribute('download',fileDownload);
            //红色
            alink.setAttribute('style','color:black');
            alink.innerHTML = fileDownload;
            var brLine = document.createElement("br");//换行
            div.appendChild(alink);
            div.appendChild(brLine);

        }
        div.setAttribute('class','north');
        document.body.append(div);


})

})();