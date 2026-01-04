// ==UserScript==
// @name         RR Continue Reading From Old Chapter
// @namespace    ultrabenosaurus.RoyalRoad
// @version      0.4
// @description  When viewing a chapter you have read before on Royal Road, this will add a button to continue reading from your actual place in the story.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.royalroad.com/fiction/*/*/chapter/*
// @icon         https://www.google.com/s2/favicons?domain=royalroad.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405088/RR%20Continue%20Reading%20From%20Old%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/405088/RR%20Continue%20Reading%20From%20Old%20Chapter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.querySelectorAll('div#rewind-container form.rewind-form button.btn.btn-primary').length!=0){
        UBaddContinueReadingButton();
    }
})();

function UBaddContinueReadingButton() {
    var btnElem = '<div class="col-xs-12 col-sm-4 col-md-3 col-lg-2 col-xl-2"><a id="UByourCurrentChapter" href="javascript:void(0);" class="btn btn-sm btn-primary" style="margin-top: -5px;"><i class="fa fa-play-circle"></i>&nbsp;&nbsp;Continue Reading</a></div>';
    document.querySelectorAll('div#rewind-container div div.row div[class^="col-"]:first-child')[0].className = "col-xs-12 col-sm-8 col-md-6 col-lg-8 text-center";
    document.querySelectorAll('div#rewind-container div div.row div[class^="col-"]:first-child')[0].insertAdjacentHTML("beforebegin", btnElem);

    var yccBtn = document.getElementById('UByourCurrentChapter');
    if(yccBtn){
        yccBtn.addEventListener("click", UByourCurrentChapter, false);
    }
    yccBtn = btnElem = null;
}

function UByourCurrentChapter() {
    $.ajax({
        type: "GET",
        url: document.querySelectorAll('div.row.fic-header div.fic-buttons a.btn-primary')[0].href,
        success: function(t){
            var fictionPage = document.implementation.createHTMLDocument();
            fictionPage.body.innerHTML = t;
            var a = fictionPage.querySelector("a.btn.btn-lg.btn-primary");
            window.location.href = a.href;
            a = fictionPage = null;
        }
    });
}