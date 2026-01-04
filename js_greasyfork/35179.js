// ==UserScript==
// @name        RT reply-in-popup
// @namespace   psrt
// @include     https://servicedesk.ps-intern.de/Ticket/Display.html?id=*
// @include     https://servicedesk.ps-intern.de/Ticket/Update.html*
// @version     1
// @grant       none
// @description Öffnet Pop UP Fenster im RT wenn Kommentieren oder Antworten ausgewählt.
// @downloadURL https://update.greasyfork.org/scripts/35179/RT%20reply-in-popup.user.js
// @updateURL https://update.greasyfork.org/scripts/35179/RT%20reply-in-popup.meta.js
// ==/UserScript==

$ = unsafeWindow.jQuery;

if(document.location.href.match(/Display.html/) != null) {
    window.setTimeout(linksBinden, 1000);

    if(document.location.href.match(/results=/) != null) {
        if(!window.opener) return;
        window.opener.location.reload();
        window.close();
    }
}

if(document.location.href.match(/Update.html/) != null) {
    updateFensterBinden();
}

function linksBinden() {
    var width = 1300;
    var height = 800;
    var links = $("#li-page-actions a[href*='Update.html'], .metadata .actions a[href*='Update.html']");

    links.on("click", function() {
        var a = $(this);
        var hr = a.attr("href");
        GM.openInTab(hr);
        return false;
    });
}

function updateFensterBinden() {
    var form = $("form[name='TicketUpdate']");
    form.submit(function(e) {
        $(this).ajaxSubmit({success: function() {
            window.opener.location.reload();
        }});
    })
}
