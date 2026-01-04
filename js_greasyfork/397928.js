// ==UserScript==
// @name         修正刷新弹窗的高度
// @namespace    http://shenchaohuang.net/
// @version      0.1
// @description  try to take over the world!
// @author       沈超煌
// @match        https://poshmark.com/closet/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/397928/%E4%BF%AE%E6%AD%A3%E5%88%B7%E6%96%B0%E5%BC%B9%E7%AA%97%E7%9A%84%E9%AB%98%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/397928/%E4%BF%AE%E6%AD%A3%E5%88%B7%E6%96%B0%E5%BC%B9%E7%AA%97%E7%9A%84%E9%AB%98%E5%BA%A6.meta.js
// ==/UserScript==

//css
GM_addStyle ( `
    .modal{top:40%}
` );