// ==UserScript==
// @name         Syntax Highlighting
// @namespace    http://www.hackforums.net/member.php?action=profile&uid=2377407
// @version      0.1
// @description  Proper Syntax Highlighting - http://www.hackforums.net/showthread.php?tid=4662014
// @author       Kondax - Sakuto
// @match        http://www.hackforums.net/*
// @match        http://hackforums.net/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/highlight.min.js
// @resource     CSS http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/styles/default.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/11139/Syntax%20Highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/11139/Syntax%20Highlighting.meta.js
// ==/UserScript==
$(".codeblock").css({
    'border': 'none',
    'padding': '0px'
});
$(".codeblock .title").hide();
GM_addStyle(GM_getResourceText("CSS"));
$('div.codeblock code').each(function(i, block) {
    console.log(block);
    hljs.highlightBlock(block);
});