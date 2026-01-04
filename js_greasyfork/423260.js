// ==UserScript==
// @name         CNKI PDF Download Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给知网文献页面添加 PDF 下载按钮。如果知网原本就提供 PDF 下载，那么会创造重复的按钮。
// @author       zombie110year
// @match        https://kns.cnki.net/kcms/detail/detail.aspx?*
// @icon         https://www.google.com/s2/favicons?domain=cnki.net
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/423260/CNKI%20PDF%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/423260/CNKI%20PDF%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const operate_btn = document.evaluate("//div[@id='DownLoadParts']//ul[@class='operate-btn']", document).iterateNext();
    const cajurl = document.evaluate("//li[@class='btn-dlcaj']/a[@id='cajDown']/@href", operate_btn).iterateNext().textContent;
    const pdfurl = cajurl.replace(/dflag=(nh|caj)down(&dflag=(nh|caj)down)?/, "dflag=pdfdown");
    let li = document.createElement("li");
    li.classList.add("btn-dlpdf");
    li.innerHTML = `<a onclick="WriteKrsDownLog()" target="_blank" id="pdfDown" name="pdfDown" href="${pdfurl}"><i></i>PDF下载（🐵）</a></li>`;
    operate_btn.appendChild(li);
})();
