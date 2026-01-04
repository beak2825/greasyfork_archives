// ==UserScript==
// @name         AHK双击复制代码
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  AHK中文社区代码区双击复制
// @author       AHK社区昵称：北极星
// @match        https://www.autoahk.com/*
// @icon         https://www.google.com/s2/favicons?domain=autoahk.com
// @license MIT
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/445979/AHK%E5%8F%8C%E5%87%BB%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/445979/AHK%E5%8F%8C%E5%87%BB%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.ondblclick=function(event){
    let ele = event.target

    while((ele.parentNode.tagName) != "PRE"){
        ele = ele.parentNode
    }
    let preele = ele.parentNode
    let copytext = preele.innerText
    let selObj = window.getSelection()
    selObj.selectAllChildren(preele)
    navigator.clipboard.writeText(copytext)
    //alert("Code Copied!")

}
})();