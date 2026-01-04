// ==UserScript==
// @name         NTKO办公OA控件文档转为下载本地
// @license      AGPL License
// @namespace    https://penicillin.github.io/
// @version      0.12
// @description  打开文档时自弹出下载框
// @match        http://192.168.1.65/Office/ReadOffice.aspx*
// @match        http://192.168.1.65/OFFICE/ReadOffice.aspx*
// @match        http://192.168.1.65/Office/EditOffice.aspx*
// @downloadURL https://update.greasyfork.org/scripts/422566/NTKO%E5%8A%9E%E5%85%ACOA%E6%8E%A7%E4%BB%B6%E6%96%87%E6%A1%A3%E8%BD%AC%E4%B8%BA%E4%B8%8B%E8%BD%BD%E6%9C%AC%E5%9C%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/422566/NTKO%E5%8A%9E%E5%85%ACOA%E6%8E%A7%E4%BB%B6%E6%96%87%E6%A1%A3%E8%BD%AC%E4%B8%BA%E4%B8%8B%E8%BD%BD%E6%9C%AC%E5%9C%B0.meta.js
// ==/UserScript==
window.location=document.body.getAttribute('onload').split('"')[1]