// ==UserScript==
// @name         Qmetry - Add new step
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://testmanagement.qmetry.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375642/Qmetry%20-%20Add%20new%20step.user.js
// @updateURL https://update.greasyfork.org/scripts/375642/Qmetry%20-%20Add%20new%20step.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).keypress(function(e) {
        console.log(e.which);
        if (e.ctrlKey && e.which == 13) {
            newStep();
        }else if (e.which == 105) {
           enterEditMode();
        }
	})
    // Your code here...
})();


function newStep(){
    var isOpen = $('.fa.fa-plus.pointer.text-primary').attr('aria-expanded') === 'true';

	if (isOpen) {
	    $('.pointer.dropdown-item').get(0).dispatchEvent(new Event('click'));
    } else {
 	    $('.fa.fa-plus.pointer.text-primary').get(0).dispatchEvent(new Event('click'));
        setTimeout(function() {
        $('.pointer.dropdown-item').get(0).dispatchEvent(new Event('click'));
        }, 0);
    }
}

function enterEditMode(){
    var editButton = $("#page-wrapper > div > detailview > div.ibox > div > div > div > div > div > div.ibox-content.no-space.child.standalone > section:nth-child(9) > form > steps > div.p-b.m-t > div.p-xs.table > div.cell.text-right > div > button:nth-child(1)").get(0);
    console.log($(editButton).attr("disabled"));
    if($(editButton).attr("disabled") ==null || $(editButton).attr("disabled") != 'disabled' ){
        editButton.dispatchEvent(new Event('click'));
    }
}