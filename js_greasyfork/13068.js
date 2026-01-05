// ==UserScript==
// @name         Magic
// @namespace    http://hybratech/
// @version      0.5
// @description  Remove  refund comments (plus annoying comments, currently from coasttech)
// @author       You
// @match        https://www.kickstarter.com/projects/hybratech/sound-band-finally-a-headset-without-speakers/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13068/Magic.user.js
// @updateURL https://update.greasyfork.org/scripts/13068/Magic.meta.js
// ==/UserScript==
$( document ).ajaxComplete(function() {
    $.each($('.comment p'),function(){if($(this).text().indexOf("01. Roy Blum") > 0) $(this).html('<i style="color:gray"><< LIST OF REFUNDS REMOVED BY MAGIC >></i> ')});
    $.each($('.comment h3 a'),function(){if(($(this).attr('href').indexOf("coasttech") > -1) && ($(this).parent().parent().text().length > 300)) $(this).parent().parent().html('<i style="color:gray"><< SILENCED >></i> ')});
});
