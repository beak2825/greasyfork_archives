// ==UserScript==
// @name         RR Continue Reading Anywhere
// @namespace    ultrabenosaurus.RoyalRoad
// @version      0.8
// @description  When viewing any chapter on Royal Road, this will add a button to continue reading from your current place in the story.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.royalroad.com/fiction/*/*/chapter/*
// @icon         https://www.google.com/s2/favicons?domain=royalroad.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405148/RR%20Continue%20Reading%20Anywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/405148/RR%20Continue%20Reading%20Anywhere.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ficHome = window.location.pathname.split("/chapter/")[0].split("/");
    ficHome.pop();
    ficHome = ficHome.join("/");
    if(document.querySelectorAll('div.row.fic-header div.row div.fic-buttons a.btn-primary[href^="'+ficHome+'"]').length!=0){
        UBaddContinueReadingAnywhereButton();
    }
    ficHome = null;
})();

function UBaddContinueReadingAnywhereButton() {
    var btnElem = '<a id="UBcontinueReadingAnywhere" href="javascript:void(0);" class="btn btn-block btn-primary margin-bottom-5"><i class="fa fa-play-circle"></i>&nbsp;&nbsp;Continue Reading</a>';
    document.querySelectorAll('div.row.fic-header div.row div.fic-buttons')[0].insertAdjacentHTML("beforeend", btnElem);

    for(var i=document.querySelectorAll('div.chapter-inner.chapter-content ~ hr ~ div.row .btn.btn-primary.col-xs-4').length;i--;i>0){
        document.querySelectorAll('div.chapter-inner.chapter-content ~ hr ~ div.row .btn.btn-primary.col-xs-4')[i].className = "btn btn-primary col-xs-3";
    }

    btnElem = '<a id="UBcontinueReadingAnywhereBTM" href="javascript:void(0);" class="btn btn-primary col-xs-3">Continue <br class="visible-xs">Reading</a>';
    document.querySelectorAll('div.chapter-inner.chapter-content ~ hr ~ div.row .btn.btn-primary.col-xs-3')[1].insertAdjacentHTML("afterend", btnElem);

    var yccBtn = document.getElementById('UBcontinueReadingAnywhere');
    if(yccBtn){
        yccBtn.addEventListener("click", UBcontinueReadingAnywhere, false);
    }
    yccBtn = document.getElementById('UBcontinueReadingAnywhereBTM');
    if(yccBtn){
        yccBtn.addEventListener("click", UBcontinueReadingAnywhere, false);
    }
    yccBtn = btnElem = null;
}

function UBcontinueReadingAnywhere() {
    $.ajax({
        type: "GET",
        url: document.querySelectorAll('div.row.fic-header div.fic-buttons a.btn-primary')[0].href,
        success: function(t){
            var fictionPage = document.implementation.createHTMLDocument();
            fictionPage.body.innerHTML = t;
            var a = fictionPage.querySelector("a.btn.btn-lg.btn-primary");
            window.location.href = a.href;
            a = fictionPage = null;
        },
        error: function (request, status, error) {
            console.error("--RR Continue Reading Anywhere--");
            console.error("Failed to determine the proper chapter URL; below are the AJAX error details.");
            console.error("Request object:");
            console.error(request);
            console.error("Status: "+(status||"null"));
            console.error("HTTP Error: "+(error||"null"));
            console.error("--RR Continue Reading Anywhere--");
        }
    });
}