// ==UserScript==
// @name         91pu enhancement
// @version      1.1
// @match        http*://*.91pu.com.tw/*
// @description  made by SC
// @license      MIT
// @namespace    https://greasyfork.org/users/1010601
// @downloadURL https://update.greasyfork.org/scripts/458046/91pu%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/458046/91pu%20enhancement.meta.js
// ==/UserScript==
setTimeout(()=>Object.assign(uinfo,{islogin:true,level:2,cfg:{st:-1}}),1000,document.body.onselectstart=closeAdvertise());