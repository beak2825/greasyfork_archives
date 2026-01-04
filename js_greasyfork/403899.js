// ==UserScript==
// @name         FSD ID Generator
// @namespace    https://almedawaterwell.com/
// @version      1.3
// @description  Sets id values for the "Job Description" and "Side Panel" divs in FSD.
// @author       Luke Pyburn
// @include      https://reveal.us.fleetmatics.com/fsd/*
// @include      https://reveal.fleetmatics.com/fsd/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/403899/FSD%20ID%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/403899/FSD%20ID%20Generator.meta.js
// ==/UserScript==

var $ = window.jQuery;
document.addEventListener('mouseup', function() {
    $('[class="fsd-sd-text-area__input ng-pristine ng-valid ng-touched"').each(function(i, ele) {
            var id = "description";
            $(this).attr('id', id);
        });
    $('[class="fsd-sd-text-area__input ng-untouched ng-pristine ng-valid"').each(function(i, ele) {
        var id = "description";
           $(this).attr('id', id);
        });
});

window.addEventListener('blur', function idReset() {
         $('[class="fsd-sd-text-area__input ng-pristine ng-valid ng-touched"').each(function(i, ele) {
            var id = "description";
            $(this).attr('id', id);
        });
        $('[class="fsd-sd-text-area__input ng-untouched ng-pristine ng-valid"').each(function(i, ele) {
        var id = "description";
           $(this).attr('id', id);
        });
}
);
window.addEventListener('click', function saveButtonId() {
         $('[class="btn btn-primary btn-md"').each(function(i, ele) {
            var id = "saveButton";
            $(this).attr('id', id);
        });
}
);
window.addEventListener('mouseup', function() {
    $('[class="fsd-side-panel-body__content"').each(function(i, ele) {
            var id = "side-panel";
            $(this).attr('id', id);
        });
});
window.addEventListener('blur', function setNavbarId() {
    $('[class="fsd-host-root__navbar"').each(function(i, ele) {
            var id = "navbar";
            $(this).attr('id', id);
        console.log("Navbar ID set.");
        });
});