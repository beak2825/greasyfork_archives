// ==UserScript==
// @name         国家中小学智慧教育平台电子课本pdf下载
// @namespace    https://https://laoyu.12580.wang/
// @version      1.1.7
// @description  国家中小学智慧教育平台pdf教材下载
// @author       御清弦
// @license      MIT
// @match        https://basic.smartedu.cn/*
// @match        https://www.zxx.edu.cn/*
// @icon         https://basic.smartedu.cn/favicon.ico
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/505840/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%ACpdf%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/505840/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%ACpdf%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function addButton() {
        if (document.body.classList.contains("theme-default")) {
            const containerCssText = 'position: fixed;height: 40px;line-height: 37px;top: 40px;left: 10px;z-index: 999;background-color: rgb(253 138 199);color: white;padding: 0px 10px;font-size: 1.5em;border: 2px solid #ff0074;';
            var btn = document.createElement("button");
            btn.innerHTML = "下载PDF课本";
            btn.style.cssText = containerCssText;
            btn.onclick = function() {
                downloadPdf();
            };
            document.body.appendChild(btn);
        }
    }
function downloadPdf() {
    var currentUrl = window.location.href;
    if (currentUrl.indexOf("r2-ndr.ykt.cbern.com.cn") === -1) {
        let begin = currentUrl.indexOf("contentId=") + 10;
        let end = currentUrl.indexOf("&catalogType=");
        let key = currentUrl.indexOf("=tchMaterial") + currentUrl.indexOf("elecedu");
        if (begin !== 9 && end !== -1 && key !== -2) {
            var newUrl1 = currentUrl.slice(begin, end);
            window.location.assign("https://r2-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/" + newUrl1 + ".pkg/pdf.pdf");
        } else {
            alert("当前页面不是电子课本页面");
        }
    } else {
        var http = new XMLHttpRequest();
        http.open('HEAD', currentUrl, false);
        http.send();
        if (http.status === 404) {
            var newUrl2 = currentUrl.slice(64);
            window.location.assign("https://r2-ndr.ykt.cbern.com.cn/edu_product/esp/assets/" + newUrl2);
        } else {
            alert("页面请求成功，但状态码不是404");
        }
    }
}
window.addEventListener('load', function() {
    addButton();
});