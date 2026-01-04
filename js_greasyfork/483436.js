// ==UserScript==
// @name         WendaPlus: Lightweight Pages
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  让问答页面变得更简洁
// @author       xgugugu
// @match        https://wenda.codingtang.com/*
// @grant        none
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/483436/WendaPlus%3A%20Lightweight%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/483436/WendaPlus%3A%20Lightweight%20Pages.meta.js
// ==/UserScript==

if (location.pathname == '/' || location.href.search('wenda.codingtang.com/board/') != -1 ||
    location.href.search(/wenda.codingtang.com\/questions\/.+\//) != -1)
{
    $('div.post-entry').find('img').each(function() {
        if ($(this).attr('src').search('/badges/') != -1)
        {
            $(this).parent().remove();
        }
    });
    $('div.item_box').attr('style', 'height: 75px;');
    $('div.message_box.question-box').remove();
}