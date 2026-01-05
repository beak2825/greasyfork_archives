// ==UserScript==
// @name 百度盘直接下载
// @author      PurelyCfictional
// @description  伪造Linux直接下载
// @version      1.0.1
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @grant        none
// @namespace https://greasyfork.org/users/30392
// @downloadURL https://update.greasyfork.org/scripts/17136/%E7%99%BE%E5%BA%A6%E7%9B%98%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/17136/%E7%99%BE%E5%BA%A6%E7%9B%98%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

navigator.__defineGetter__("platform", function(){return "Linux";});