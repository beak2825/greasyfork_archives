// ==UserScript==
// @name                     BMJ Best Practice EN to CN
// @name:zh                  BMJ Best Practice 从英文词条自动跳转到中文词条
// @name:zh-CN               BMJ Best Practice 从英文词条自动跳转到中文词条
// @version                  1.02
// @author                   sprindjack
// @namespace                sprindjack
// @description              redirect en-gb webpage to zh-cn webpage
// @description:zh           从英文词条自动跳转到中文词条
// @description:zh-CN        从英文词条自动跳转到中文词条
// @license                  AGPL-3.0-or-later
// @match                    *://bestpractice.bmj.com/topics/en-gb/*
// @grant                    none
// @run-at                   document-start
// @downloadURL https://update.greasyfork.org/scripts/452356/BMJ%20Best%20Practice%20EN%20to%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/452356/BMJ%20Best%20Practice%20EN%20to%20CN.meta.js
// ==/UserScript==

var newUrlPath = window.location.pathname.replace('en-gb','zh-cn');
var newURL = window.location.protocol + "//"
           + window.location.host
           + newUrlPath
           + window.location.search
           + window.location.hash
           ;
window.location.replace (newURL);