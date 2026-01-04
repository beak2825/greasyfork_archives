// ==UserScript==
// @name         Witt script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *google*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39635/Witt%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39635/Witt%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('div.panel-body').toggle();
    $('div.panel-heading').toggle();
    $('#gender_male').click();
    $('#hand_right').click();
    $('option[value=single]').select();
});