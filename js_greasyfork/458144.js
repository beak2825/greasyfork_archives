// ==UserScript==
// @name         国家职业技能标准查询系统页面替换自带pdf阅读器下载(需要允许弹窗)
// @namespace    http://biaozhun.osta.org.cn/
// @version      0.1
// @description  需要允许弹窗
// @author       shxuai
// @match        http://biaozhun.osta.org.cn/pdfview.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @license      版权没有,违者不究
// @downloadURL https://update.greasyfork.org/scripts/458144/%E5%9B%BD%E5%AE%B6%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E6%A0%87%E5%87%86%E6%9F%A5%E8%AF%A2%E7%B3%BB%E7%BB%9F%E9%A1%B5%E9%9D%A2%E6%9B%BF%E6%8D%A2%E8%87%AA%E5%B8%A6pdf%E9%98%85%E8%AF%BB%E5%99%A8%E4%B8%8B%E8%BD%BD%28%E9%9C%80%E8%A6%81%E5%85%81%E8%AE%B8%E5%BC%B9%E7%AA%97%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458144/%E5%9B%BD%E5%AE%B6%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E6%A0%87%E5%87%86%E6%9F%A5%E8%AF%A2%E7%B3%BB%E7%BB%9F%E9%A1%B5%E9%9D%A2%E6%9B%BF%E6%8D%A2%E8%87%AA%E5%B8%A6pdf%E9%98%85%E8%AF%BB%E5%99%A8%E4%B8%8B%E8%BD%BD%28%E9%9C%80%E8%A6%81%E5%85%81%E8%AE%B8%E5%BC%B9%E7%AA%97%29.meta.js
// ==/UserScript==


window.onload = function() {
    'use strict';
    var _url = window.location.href;

    var code = _url.split('=')[1]


    let get = 'http://biaozhun.osta.org.cn/api/v1/profession/get/';
    var goal_url = get + code

    //alert(goal_url);

    console.log('下载' + name + 'PDF文件');
    let xhr = new XMLHttpRequest();
    let req = goal_url;
    xhr.open("GET", req, false);
    xhr.onload = function(event){
        let response = event.target.response;
        let pdf = JSON.parse(response);
        console.log('名称: ' + name);
        console.log('编号: ' + code);
        console.log('反馈结果: ' + pdf.msg);
        console.log('反馈编码: ' + pdf.code);
        let pdfWindow = window.open("")
        pdfWindow.document.write(
            "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
            encodeURI(pdf.data) + "'></iframe>"
        )
    };
    xhr.send();

}