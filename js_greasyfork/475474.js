// ==UserScript==
// @name         电子课本pdf下载
// @namespace    https://space.bilibili.com/314017356
// @version      1.8.5
// @description  从国家中小学智慧教育平台下载pdf课本
// @author       清遥
// @license      CC BY-NC-SA
// @match        https://basic.smartedu.cn/*
// @match        https://www.zxx.edu.cn/*
// @match        https://r2-ndr.ykt.cbern.com.cn/*
// @icon         https://basic.smartedu.cn/favicon.ico
// @grant        none
// @compatible	 Chrome
// @compatible	 Edge
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/475474/%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%ACpdf%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/475474/%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%ACpdf%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

var currentUrl = window.location.href;
//获取当前url
if (currentUrl.indexOf("r2-ndr.ykt.cbern.com.cn") == -1){
//判断是否已在文件下载页
    let begin = currentUrl.indexOf("contentId=") + 10
    //检测文件头位置
    let end = currentUrl.indexOf("&catalogType=")
    //检测文件尾位置
    let key = currentUrl.indexOf("=tchMaterial") + currentUrl.indexOf("elecedu")
    //检测该页面是否为电子课本
    if (begin != 9 & end != -1 & key != -2){
    //判断是否含有文件头尾及是否为电子课本
        var newUrl1=(currentUrl.slice(begin, end));
        //提取文件名
        window.location.assign("https://r2-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/"+newUrl1+".pkg/pdf.pdf");
        //打开文件下载页
    }
}else{
//若已在文件下载页
    var http = new XMLHttpRequest();
    //定义页面请求 
    http.open('HEAD', currentUrl, false);
    //创建页面请求
    http.send();
    //发送页面请求
    if (http.status == 404){
    //检测是否404
        var newUrl2 = (currentUrl.slice(64));
        //提取文件名
        window.location.assign("https://r2-ndr.ykt.cbern.com.cn/edu_product/esp/assets/"+newUrl2);
        //打开文件下载页
    }
}