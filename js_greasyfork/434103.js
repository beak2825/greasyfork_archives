// ==UserScript==
// @name         恢复自由复制 CSDN 代码
// @namespace https://greasyfork.org/users/826324
// @version      0.01
// @description  Ctrl+C & Ctrl+V
// @author       Darwin
// @match        https://blog.csdn.net/*
// @icon         chrome://favicon/http://blog.csdn.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434103/%E6%81%A2%E5%A4%8D%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6%20CSDN%20%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/434103/%E6%81%A2%E5%A4%8D%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6%20CSDN%20%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getChildren(parent){
        let t = document.createNodeIterator(parent, NodeFilter.SHOW_ELEMENT, null, false)
        let currNode = null
        while((currNode = t.nextNode()) !== null) {
            currNode.style.userSelect = "text"
        }
    }
    getChildren(document.body)
})();