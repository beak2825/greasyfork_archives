// ==UserScript==
// @name         日本村课件
// @namespace    NJY_Script
// @version      0.1
// @description  日本村pdf课件获取
// @author       NJY
// @match        https://www.ribencun.com/static/web/viewer.html
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/387795/%E6%97%A5%E6%9C%AC%E6%9D%91%E8%AF%BE%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/387795/%E6%97%A5%E6%9C%AC%E6%9D%91%E8%AF%BE%E4%BB%B6.meta.js
// ==/UserScript==

function main() {
    buttonEvent();
}

function buttonEvent() {//数据按钮
    let getPdf = document.createElement('div');
    getPdf.id = 'getPdf';
    document.body.appendChild(getPdf);
    createButton("获取课件", "aquireCW", 200);
    document.getElementById("getPdf").addEventListener('click', function (e) {
        let ads = document.cookie.match(/pdffile=(.*).pdf/)[1].replace(/%2F/g, "/");
        let pdfFile = document.createElement('a');
        pdfFile.id = 'pdfFile';
        pdfFile.download = '';
        pdfFile.href = "../../../.." + ads + ".pdf";
        document.body.appendChild(pdfFile);
        document.getElementById('pdfFile').click();
        document.getElementById('pdfFile').parentNode.removeChild(document.getElementById('pdfFile'));
    });
}

function createButton(btnName, btnId, right) {//创建按钮
    let but = document.createElement('button');
    but.type = 'button';
    but.innerHTML = btnName;
    but.id = btnId;
    but.setAttribute("style", "top:160px; right:" + (right) + "px; position:absolute; font-weight:bold; z-css:999;");
    document.getElementById("getPdf").appendChild(but);
}

main();