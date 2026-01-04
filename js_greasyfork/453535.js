// ==UserScript==
// @name True Classic Extras
// @description Enhancements for True Classic GameFAQs theme
// @match https://gamefaqs.gamespot.com/*
// @version 1.03
// @license MIT
// @namespace https://greasyfork.org/users/973870
// @downloadURL https://update.greasyfork.org/scripts/453535/True%20Classic%20Extras.user.js
// @updateURL https://update.greasyfork.org/scripts/453535/True%20Classic%20Extras.meta.js
// ==/UserScript==

$('tr.topics').each(function() {
$('.board_status > *', this).insertBefore($('[class^="topic"] > a', this));
})

$('.g_user .tlist th:nth-child(2)').attr('colspan', '1');

$('.msg').each(function() {
$('.msg_below .edited', this).insertBefore($('.message_num', this)).css({"text-transform": "capitalize"}).prepend(' ');
$('.msg_below .postaction', this).insertBefore($('.message_num', this)).css({"text-transform": "capitalize"}).prepend(' | ');
})

$('.pod_forumuser:first-of-type .paginate.user').append($('.gs_hbtn_span'));