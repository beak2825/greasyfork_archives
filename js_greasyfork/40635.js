// ==UserScript==
// @name         1024下载助手
// @namespace    
// @version      0.2
// @description  简化 rmdown.com 下载链接的下载步骤，点击一次连接，直接下载
// @author       jflmao
// @match        *://*.rmdown.com/*
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/40635/1024%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/40635/1024%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


var reff = document.getElementsByName("reff")[0].value;
var ref = document.getElementsByName("ref")[0].value;
window.location="https://rmdown.com/download.php?reff="+reff+"&ref="+ref;