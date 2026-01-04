// ==UserScript==
// @name         SH Continue Reading Anywhere
// @namespace    ultrabenosaurus.ScribbleHub
// @version      0.3
// @description  When viewing any chapter on Scribble Hub, this will add a button to continue reading from your current bookmarked chapter.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.scribblehub.com/read/*/chapter/*
// @icon         https://www.google.com/s2/favicons?domain=scribblehub.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413754/SH%20Continue%20Reading%20Anywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/413754/SH%20Continue%20Reading%20Anywhere.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ficID = window.location.pathname.split("/read/")[1].split("/chapter/")[0].split("-")[0];
    var ficHome = "https://www.scribblehub.com/series/"+ficID+"/";
    if(document.querySelectorAll('div#page div.wi_fic_wrap.chapter div.wi_breadcrumb.chapter a[href^="'+ficHome+'"]').length!=0){
        UBaddContinueReadingAnywhereButton(ficID);
    }
    ficID = ficHome = null;
})();

function UBaddContinueReadingAnywhereButton(ficID) {
    var readURL = "https://www.scribblehub.com/readfirst/"+ficID+"/";
    var mobHeader = document.querySelectorAll('div#page div.ol_mb_header span[style="float:right;"]');

    if(mobHeader.length!=0){
        var btnElemMobile = '<span class="ol_h_i"><a onclick="hide_mm_bar();" href="'+readURL+'"><i class="fa fa-reply fa-rotate-180 fa-flip-horizontal" aria-hidden="true" style="color:#fff;font-size:20px;"></i></a></span>'
        mobHeader[0].insertAdjacentHTML("beforeend", btnElemMobile);
        readURL = mobHeader = btnElemMobile = null;
    }else{
        var btnElemDesktop = '<a dp="yes" class="btn_settings" title="Continue Reading from Bookmarked Chapter" href="'+readURL+'"><i dp="yes" class="fa fa-reply fa-rotate-180 fa-flip-horizontal" aria-hidden="true"></i></a>'
        document.querySelectorAll('div#page div.wi_fic_wrap.chapter div#primary main div.c_set')[0].insertAdjacentHTML("beforeend", btnElemDesktop);
        readURL = mobHeader = btnElemDesktop = null;
    }
}