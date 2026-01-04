// ==UserScript==
// @name         See Podfic First
// @version      0.1.1
// @description  moves the AO3 inspired by links to the top of the page
// @author       GodOfLaundryBaskets
// @include      http*://archiveofourown.org/*works*
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// @license MIT
/* globals jQuery, $, waitForKeyElements */
// @namespace https://greasyfork.org/users/1164278
// @downloadURL https://update.greasyfork.org/scripts/474367/See%20Podfic%20First.user.js
// @updateURL https://update.greasyfork.org/scripts/474367/See%20Podfic%20First.meta.js
// ==/UserScript==


function addPodficsOnSamePage() {
    const children = Array.from(document.querySelectorAll('div.children'));
    if (!children.length) {
        return false;
    }
    $("div.notes").first().append("<br />").append(children);
    $("p.jump").first().remove();
    return true;
}

function addPodficsAtEndOfWork() {
    const jumpBlock = Array.from(document.querySelectorAll('p.jump'));

    if (!jumpBlock.length || !jumpBlock[0].textContent.includes("other works inspired by this one")) {
        return false;
    }

    $(jumpBlock).css("font-weight", "bold")
    $(jumpBlock).css("background-color", "#e2e2e2");;
}

$( document ).ready(function() {
    'use strict';
    var added = addPodficsOnSamePage();

    if(!added) {
        addPodficsAtEndOfWork()
    }
});