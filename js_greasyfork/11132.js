// ==UserScript==
// @name         Nova Undesirable
// @namespace    https://greasyfork.org/en/users/9054
// @version      0.1
// @description  autocheck "None of the above" Press enter on num pad to submit. Hides instructions
// @author       ikarma
// @include      https://www.mturkcontent.com/dynamic/*
// @require     http://code.jquery.com/jquery-2.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11132/Nova%20Undesirable.user.js
// @updateURL https://update.greasyfork.org/scripts/11132/Nova%20Undesirable.meta.js
// ==/UserScript==

document.getElementsByClassName('panel-body')[0].style.display='none';

$("input[value='None of the above']").click(); 

var $j = jQuery.noConflict(true);
window.onkeydown = function(event) {
if (event.keyCode === 13) {
    $j('input[id="submitButton"]').eq(0).click();
}
};