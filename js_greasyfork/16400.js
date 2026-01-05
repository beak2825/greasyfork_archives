// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// ==UserScript==
// @name         Salesforce Cases
// @namespace    indow
// @version      2.5
// @description  inline images on case record and order number hyperlink
// @author       mat
// @match        https://cs7.salesforce.com/*
// @match        https://cs24.salesforce.com/*
// @match        https://na65.salesforce.com/*
// @match        https://indow.my.salesforce.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.pack.js
// @resource     customCSS https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.css
// @resource     fancybox_sprite.png https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/fancybox_sprite.png
// @resource     fancybox_overlay.png https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/fancybox_overlay.png
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/16400/Salesforce%20Cases.user.js
// @updateURL https://update.greasyfork.org/scripts/16400/Salesforce%20Cases.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

if ($("#bodyCell > div.bPageTitle > div.ptBody > div.content > h1.pageType").text() == "Case:") {
    var newCSS = GM_getResourceText("customCSS");
    GM_addStyle(newCSS);
    var fancybox_sprite = GM_getResourceURL("fancybox_sprite.png");
    GM_addStyle("#fancybox-loading, .fancybox-close, .fancybox-prev span, .fancybox-next span {background-image: url(" + fancybox_sprite + ")}");

    var jobnumber = $('td.labelCol:contains("Job Number")').next().children();
    jobnumber.replaceWith('<a href="https://modi.indowwindows.com/orders/edit/' + jobnumber.text() + '">' + jobnumber.text() + '</a>');



    var caseid = window.location.pathname.substr(1);

    $("div.pbSubsection:first").append('<tr id="attachmentphotos" style="float:left;width:100%;margin-bottom:1em"></tr>');
    $.get("/attach/attachlist.jsp?id=" + caseid + "&rowsperpage=50", function(data) {
        $(data).find(".list>tbody>tr.dataRow>td.actionColumn>a.actionLink[title^='View']").each(function() {
            var url = $(this).attr('href');
            $("#attachmentphotos").append('<a class="attachmentimages" rel="gallery1" href="' + url + '"><img src="' + url + '"width="auto" height="150"></a>');
            $(".attachmentimages").fancybox({
                openEffect: 'elastic',
                type: 'image',
                closeEffect: 'elastic'
            });
        });
    });
}