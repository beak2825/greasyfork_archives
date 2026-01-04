// ==UserScript==
// @name         从Chrome插件市场下载crx文件
// @name:en      download crx from chrome extention store
// @namespace    https://chrome.google.com/
// @version      2025-08-08
// @description  在chrome插件市场右上角添加一个下载crx文件的按钮
// @description:en  Add a button to download crx files in the upper right corner of the chrome plugin market.
// @match        https://chrome.google.com/webstore/detail/*
// @match        https://chromewebstore.google.com/detail/*
// @license      MIT
// @author       QL
// @icon         https://fonts.gstatic.com/s/i/productlogos/chrome_store/v7/192px.svg
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/544987/download%20crx%20from%20chrome%20extention%20store.user.js
// @updateURL https://update.greasyfork.org/scripts/544987/download%20crx%20from%20chrome%20extention%20store.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let version = "139.0.7258.67";
    let appid = location.pathname.split('detail/')[1].split('/')[1];
    let appname = location.pathname.split('detail/')[1].split('/')[0];
    let downloadurl = `https://clients2.google.com/service/update2/crx?response=redirect&os=win&arch=x64&os_arch=x86_64&nacl_arch=x86-64&prod=chromecrx&prodchannel=&prodversion=${version}&lang=zh-CN&acceptformat=crx3,puff&x=id%3D${appid}%26installsource%3Dondemand%26uc`;
    let downloadInnerText = '下载CRX文件';
    let html = `
<style>
.crx-download-btn {
    position: fixed;
    top: 100px;
    right: 100px;
    z-index: 9999;
    display: inline-block;
    background: linear-gradient(90deg, #4f8cff 0%, #174ea6 100%);
    border-radius: 28px;
    box-shadow: 0 4px 16px rgba(23, 78, 166, 0.15);
    padding: 0;
    border: none;
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s;
}
.crx-download-btn:hover {
    box-shadow: 0 8px 24px rgba(23, 78, 166, 0.25);
    transform: translateY(-2px) scale(1.04);
}
.crx-download-btn a {
    display: block;
    padding: 12px 32px;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    letter-spacing: 1px;
    border-radius: 28px;
    transition: background 0.2s;
}
</style>
<div class="crx-download-btn" role="button">
    <a href="${downloadurl}" download="${appname}">${downloadInnerText}</a>
</div>
`;
    setTimeout(() => document.body.insertAdjacentHTML('beforeend', html), 5000);
})();