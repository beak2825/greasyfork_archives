// ==UserScript==
// @name         WendaPlus: Block Old Questions
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  屏蔽超过一年的问题
// @author       xgugugu
// @match        https://wenda.codingtang.com/*
// @grant        none
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/483437/WendaPlus%3A%20Block%20Old%20Questions.user.js
// @updateURL https://update.greasyfork.org/scripts/483437/WendaPlus%3A%20Block%20Old%20Questions.meta.js
// ==/UserScript==

$('.blog').children('article').last().after(
    '<details id="pingbi"><summary>被屏蔽的问题（点击查看）</summary></details>');
$('.blog').children('article').each(function() {
    if ($(this).find('.post-footer').find('div.question-summary').text().search('年') != -1)
    {
        $('#pingbi').append($(this).clone());
        $(this).remove();
    }
});