// ==UserScript==
// @name       Yeti
// @author		jawz
// @version    1.0
// @description Doin stuff
// @match      https://www.mturkcontent.com/dynamic/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/32729/Yeti.user.js
// @updateURL https://update.greasyfork.org/scripts/32729/Yeti.meta.js
// ==/UserScript==

$('div[class="panel panel-primary"]').hide();
$('#myImage').width(600);
$('#myImage').height(400);
//$('#visRef').hide();

 $('input[name="VISIBILITY"]').click(function() {
    GM_setClipboard('AHK_TAB');
    $('#submitButton').click();
});

$(document).keyup(function (event) {
    var key = event.keyCode;

    if (key=='13') {
        $('#submitButton').click();
        GM_setClipboard('AHK_TAB');
    } else if (key == 96) { //Numpad 0
        $('input[value=0]').click();
    } else if (key == 97) { //Numpad 1
        $('input[value=1]').click();
    } else if (key == 98) { //Numpad 2
        $('input[value=2]').click();
    } else if (key == 99) { //Numpad 3
        $('input[value=3]').click();
    } else if (key == 100) { //Numpad 4
        $('input[value=4]').click();
    } else if (key == 110) { //Decimal
        $('input[value=-1]').click();
    }

});