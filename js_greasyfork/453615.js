// ==UserScript==
// @name         复制swagger中的url
// @namespace    http://gksn.net
// @version      0.1.2
// @description  添加复制按钮，点击即可复制url到剪切板
// @author       healthguo
// @match        http://*/api/*
// @match        https://*/api/*
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @run-at       document-end
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/453615/%E5%A4%8D%E5%88%B6swagger%E4%B8%AD%E7%9A%84url.user.js
// @updateURL https://update.greasyfork.org/scripts/453615/%E5%A4%8D%E5%88%B6swagger%E4%B8%AD%E7%9A%84url.meta.js
// ==/UserScript==

$(document).ready(()=>{
    'use strict';
    setTimeout(()=>{
        $(".opblock-summary-control .opblock-summary-path").each((_index,item)=>{
            $(item).after(
                $("<button>复制</button>").addClass("btn").click(function(){
                var text=$(this.parentNode.children[1]).data("path");
                copy(text);
                $(this).text("复制成功！");
                setTimeout(() => {
                    $(this).text("复制");
                }, 1500);
            }));
        });
    }, 500);

    var copy = (text)=>{
        var div = document.createElement("div");
        div.innerHTML = '<span>' + text + '</span>';
        document.body.appendChild(div);
        var range = document.createRange();
        var selection = window.getSelection();
        selection.removeAllRanges();
        range.selectNodeContents(div);
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
        document.body.removeChild(div);
    };
});