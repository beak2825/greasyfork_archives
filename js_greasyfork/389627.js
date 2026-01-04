// ==UserScript==
// @name        MangaDex HideFollows
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  On the followed manga page, hides chapters that are marked as read
// @author       platypusq
// @match        https://mangadex.org/follows*
// @match        https://mangadex.cc/follows*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/389627/MangaDex%20HideFollows.user.js
// @updateURL https://update.greasyfork.org/scripts/389627/MangaDex%20HideFollows.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var allRows;
    var htmlName
    var lastValue='placeholder';

    allRows=document.querySelectorAll(".chapter-container .row");

    // Add the class 'd-none' to rows that are marked as read. This class prevents them from diplaying.
    allRows.forEach(function(e,i){
        var unreadRows=e.querySelector('.chapter_mark_unread_button');
        if(unreadRows != null && allRows !=null){
            e.classList.add("d-none");
            e.classList.add("blank-marker");
        }
    });

    //Hide and unhide names to maintain the layout of the page. Bascially, make it so if multiple
    //chapters of the same manga are in a row, only the first one displays the name
    allRows.forEach(function(e,i){
        var nameArea=e.querySelector('.col-md-3');
        if(nameArea != null && i !=0){
            if(nameArea.querySelector('a') != null && nameArea.childNodes.length===3){
                htmlName=nameArea.innerHTML;
            }
            else{
                nameArea.innerHTML=htmlName;
            }
        }
    });

    allRows.forEach(function(e,i){
        var theRow=e.querySelector('.col-md-3');
        if(theRow != null && i !=0 && e.getElementsByClassName("blank-marker").length==0){
            var thisValue=theRow.innerHTML;
            if(thisValue===lastValue){
                theRow.innerHTML='';
            }
            else{lastValue=thisValue}
        }
    });
})();