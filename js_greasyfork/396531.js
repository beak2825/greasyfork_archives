// ==UserScript==
// @name         MD Mark All Chapters Read
// @namespace    ultrabenosaurus.MangaDex
// @version      0.5
// @description  OBSOLETE!! Mark all visible chapters read. If there are too many chapters for one page you will need to do each page separately.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://mangadex.org/title/*
// @icon         https://www.google.com/s2/favicons?domain=mangadex.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396531/MD%20Mark%20All%20Chapters%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/396531/MD%20Mark%20All%20Chapters%20Read.meta.js
// ==/UserScript==


(function() {
    'use strict';

    if(document.querySelectorAll('span.chapter_mark_read_button.grey').length!=0&&document.querySelectorAll('div.btn-group button.btn.dropdown-toggle span.fa-eye').length!=0){
        //UBaddMarkAllButton();
    }
})();

function UBaddMarkAllButton(){
    var mrElem = '<button class="btn btn-secondary" id="UBmarkAll"><span class="fas fa-eye fa-fw " aria-hidden="true" title="Mark All Read"></span> <span class="d-none d-xl-inline">Mark read</span></button>';
    document.querySelectorAll('button.btn.btn-warning.float-right[data-target="#manga_report_modal"]')[0].insertAdjacentHTML("beforebegin", mrElem);

    var mrBtn = document.getElementById('UBmarkAll');
    if(mrBtn){
        mrBtn.addEventListener("click", UBmarkAll, false);
    }
}

function UBremoveMarkAllButton(){
    document.getElementById('UBmarkAll').removeEventListener("click", UBmarkAll);
    document.getElementById('UBmarkAll').remove();
}

function UBmarkAll(){
    var chaps=document.querySelectorAll('span.chapter_mark_read_button.grey');
    for (var chap in chaps) {
        if (chaps.hasOwnProperty(chap)) {
            chaps[chap].click();
        }
    }
    UBremoveMarkAllButton();
}