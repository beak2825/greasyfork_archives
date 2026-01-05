// ==UserScript==
// @name         /r/anime flair clicker
// @namespace    http://seewang.me/
// @version      1.0.2
// @description  click to toggle /r/anime/ flairs
// @author       cwang22
// @match        https://www.reddit.com/r/anime/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/13499/ranime%20flair%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/13499/ranime%20flair%20clicker.meta.js
// ==/UserScript==

GM_addStyle(".click {width: auto; height: 14px;line-height: 13px;padding: 0 6px;background-image: none;background-color: #9ac;border: 1px solid #aaa;color: #3e5267;cursor: default;font-size: 11px !important;}.flair.click:hover{background-color: #9ac;}");
$(".flair").click(function(){
    $(this).toggleClass("click");
    selectElement($(this).get(0));
});

function selectElement(element) {
    if (window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.selectNodeContents(element);
        sel.addRange(range);
    } else if (document.selection) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(element);
        textRange.select();
    }
}
