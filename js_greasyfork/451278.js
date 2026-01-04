// ==UserScript==
// @name         提取工程科教目录
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  从工程科教图书服务系统提取图书目录
// @author       hohoyu
// @match        http://www.ckcest.zju.edu.cn/Engineering/ShowBook.action?BookNo=*
// @original-script  https://greasyfork.org/zh-CN/scripts/451278-%E6%8F%90%E5%8F%96%E7%9B%AE%E5%BD%95
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/451278/%E6%8F%90%E5%8F%96%E5%B7%A5%E7%A8%8B%E7%A7%91%E6%95%99%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/451278/%E6%8F%90%E5%8F%96%E5%B7%A5%E7%A8%8B%E7%A7%91%E6%95%99%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let btn = document.createElement("BUTTON");
    btn.className = "btn_content";
    btn.textContent = "提取目录";
    btn.style.backgroundColor = "#DC143C";
    btn.onclick = showContent;
    let parNode = document.getElementById("review_fabiao");
    let btn_bro = document.getElementById("review_submit");
    parNode.insertBefore(btn, btn_bro);

    function showContent()
    {
        //提取目录内容
        var cont = "";
        var title = document.getElementsByClassName("leftContainer");
        var pages = document.getElementsByClassName("rightContainer");
        var titleCnt = title.length;
        for (var i = 0; i < titleCnt; i++)
        {
            cont += title[i].innerText + "," + pages[i].innerText.replace("阅读", "") + "\n";
        }
        //下载提取到的内容至文本文件
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(cont));
        element.setAttribute('download', "目录.txt");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
    }
})();