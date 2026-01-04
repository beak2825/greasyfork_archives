// ==UserScript==
// @name         translate All Microsoft to chinese
// @namespace    jcl
// @version      1.0
// @description  翻译微软文档
// @author       Dyw
// @match        *://*.microsoft.com/en-us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451943/translate%20All%20Microsoft%20to%20chinese.user.js
// @updateURL https://update.greasyfork.org/scripts/451943/translate%20All%20Microsoft%20to%20chinese.meta.js
// ==/UserScript==

location.href=location.href.replace("en-us","zh-cn")