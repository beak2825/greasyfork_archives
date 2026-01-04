// ==UserScript==
// @name         职业标准系统PDF下载
// @namespace    http://biaozhun.osta.org.cn/
// @version      0.4
// @description  好好学习
// @author       vonsy
// @match        http://biaozhun.osta.org.cn/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @license      版权没有,违者不究
// @downloadURL https://update.greasyfork.org/scripts/448562/%E8%81%8C%E4%B8%9A%E6%A0%87%E5%87%86%E7%B3%BB%E7%BB%9FPDF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/448562/%E8%81%8C%E4%B8%9A%E6%A0%87%E5%87%86%E7%B3%BB%E7%BB%9FPDF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

window.onload = function() {
    'use strict';
    let get = 'http://biaozhun.osta.org.cn/api/v1/profession/get/';
    let all = document.querySelectorAll('.table_data');
    for (let i = 0; i < all.length; i++) {
        let href = all[i].lastElementChild.firstElementChild.href
        let url = new URL(href);
        let code = url.searchParams.get("code");
        let name = all[i].children[2].textContent;

        var link = document.createElement("a");
        link.className = "download";
        link.innerText = name + '---> PDF下载';
        link.href = 'javascript:void(0)';
        link.addEventListener('click', ()=>{
            console.log('下载' + name + 'PDF文件');
            let xhr = new XMLHttpRequest();
            let req = get + code;
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
        });
        all[i].children[2].textContent = '';
        all[i].children[2].appendChild(link);
    }
};