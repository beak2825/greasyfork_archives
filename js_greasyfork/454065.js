// ==UserScript==
// @name         QQ邮箱辅助
// @namespace    http://mail.qq.com
// @version      0.2.0
// @description  通过右下角提示打开新邮件，检测内容处理
// @author       You
// @icon         https://mail.qq.com/zh_CN/htmledition/images/favicon/qqmail_favicon_16h.png
// @match        https://mail.qq.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454065/QQ%E9%82%AE%E7%AE%B1%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/454065/QQ%E9%82%AE%E7%AE%B1%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取发票下载链接
    function getTicketDownloadLink() {
        setInterval(() => {
            console.log("检查新邮件");
            let notice = document.getElementsByClassName("notify_title");
            if (notice.length > 0) {
                console.log("打开新邮件");
                new Promise(resolve => {
                    notice[0].click();
                    setTimeout(() => {
                        resolve();
                    }, 3000);
                }).then(_ => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://127.0.0.1:7237/delete",
                        onload: function (e) {
                            console.log(e);
                            setTimeout(()=>{
                                let dt = document.getElementById('mainFrame').contentWindow.document
                                console.log("获取邮件内容");
                                let re = /http.* /g;
                                let msg = re.exec(dt.body.innerText);
                                msg = msg[0].replaceAll(' ', '');
                                msg = msg.replace('preview.html?', 'api?action=getDoc&');
                                msg += '&type=3';
                                let dl = document.createElement('a');
                                dl.href = msg;
                                dl.target="_blank";
                                dl.click();
                                dl.remove();
                            },2000);
                        },
                        onerror: function (e) {
                            let downloadURL= "https://kdocs.cn/l/cbfiaHPsIbOy";
                            console.log(downloadURL);
                            alert(`连接服务器失败，请将服务端程序放到下载文件夹，并运行。如果没有请在弹出的窗口下载`);
                            let dl = document.createElement('a');
                            dl.href = downloadURL;
                            dl.target="_blank";
                            dl.click();
                            dl.remove();
                        },
                    });
                })
            }
            //else {
            //    console.log("没有新邮件");
            //}
        }, 10000)
    }
    GM_registerMenuCommand("检测新发票邮件", function () {
        alert("发票邮件检测开始");
        getTicketDownloadLink();
    });
    GM_registerMenuCommand("手动运行一次整理", function () {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://127.0.0.1:7237/delete",
            onload: function (e) {
                console.log(e);
                alert(e.responseText)
            },
            onerror: function (e) {
                let downloadURL= "https://kdocs.cn/l/cbfiaHPsIbOy";
                console.log(downloadURL);
                alert(`连接服务器失败，请将服务端程序放到下载文件夹，并运行。如果没有请在弹出的窗口下载`);
                let dl = document.createElement('a');
                dl.href = downloadURL;
                dl.target="_blank";
                dl.click();
                dl.remove();
            },
        });
    });
})();