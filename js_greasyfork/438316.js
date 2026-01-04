// ==UserScript==
// @name         baiduyun_fullname
// @namespace    https://greasyfork.org/zh-CN/users/135090
// @version      1.2.1
// @icon         https://pan.baidu.com/ppres/static/images/favicon.ico
// @description  显示全名
// @license      AGPL
// @match        *://pan.baidu.com/s/*
// @match        *://yun.baidu.com/s/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438316/baiduyun_fullname.user.js
// @updateURL https://update.greasyfork.org/scripts/438316/baiduyun_fullname.meta.js
// ==/UserScript==

setTimeout(function(){
    document.querySelector("h2.file-name").parentElement.style.width="100%";
    document.querySelector("h2.file-name").style.width="100%";
    document.querySelector("h2.file-name").style.maxWidth="100%";
    document.querySelector(".file-name>img").style.display="none";
    document.querySelector("h2.file-name").title=window.metaData.FILENAME;
    document.querySelector("h2.file-name").textContent=window.metaData.FILENAME;
},2000);