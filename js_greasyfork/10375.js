// ==UserScript==
// @name         MSDN英文跳转到中文
// @namespace    Dyw
// @version      1.0
// @description  自动将英文msdn网页跳转到相应的中文网页
// @author       Dyw
// @match        *://msdn.microsoft.com/en-us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10375/MSDN%E8%8B%B1%E6%96%87%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/10375/MSDN%E8%8B%B1%E6%96%87%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

location.href=location.href.replace("en-us","zh-cn")