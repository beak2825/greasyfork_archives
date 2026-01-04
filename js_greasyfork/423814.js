// ==UserScript==
// @name         净化剪切板
// @namespace    
// @version      0.4.2
// @description  还原被劫持的剪切板
// @author       renmu
// @match        *://*.juejin.cn/*
// @match        *://*.zhihu.com/*
// @match        *://*.leetcode-cn.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423814/%E5%87%80%E5%8C%96%E5%89%AA%E5%88%87%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/423814/%E5%87%80%E5%8C%96%E5%89%AA%E5%88%87%E6%9D%BF.meta.js
// ==/UserScript==

function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

function addLink(e) {
    e.preventDefault();
    var copytext = getSelectionHtml();
    console.log(copytext,window.getSelection())
    var clipboardData = event.clipboardData || window.clipboardData;

    clipboardData.setData("text/html", copytext);
    clipboardData.setData("text", window.getSelection());
}


document.addEventListener("copy", addLink);


