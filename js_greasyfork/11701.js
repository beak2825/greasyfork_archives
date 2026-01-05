// ==UserScript==
// @name         A9
// @namespace    http://kadauchi.com/
// @version      2.0.0
// @description  Category Validation / Logo Validation / Bounding Box
// @author       Kadauchi
// @icon         http://kadauchi.com/avatar3.gif
// @include      https://s3.amazonaws.com/*
// @include      https://www.mturkcontent.com/*
// @grant        GM_log
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/11701/A9.user.js
// @updateURL https://update.greasyfork.org/scripts/11701/A9.meta.js
// ==/UserScript==

var autosubmit = false;

var Category_Validation = $('u:contains(Select the first option that applies to the image on the)');
var Image_Survey = $('span:contains(Does the photo on the far left obviously contain...)');
var bounding_box = $('p:contains(partially blocked or out of the image?)');

if (bounding_box.length){
    document.body.focus();

    $(document).keydown(function(e){
        switch(e.which){
            case 49: // 1
            case 97: // Numpad1
                $('input[value="Partial_Object"]').click();
                break;
            case 13: // Enter
                $('input[value="Submit"]').click();
                break;
            default: return;
        }
    });
}

if (Image_Survey.length){
    document.body.focus();

    $('input[value="No"]').click();
}

if (Category_Validation.length){
    document.body.focus();

    $('#truth').click(function(){
        $('input[value="Valid_Object"]').click()();
    });

    $('input[value="Missing_Object"]').click();

    $(document).keydown(function(e){
        switch(e.which){
            case 49: // 1
            case 97: // Numpad1
                $('input[value="Valid_Object"]').click();
                $('input[value="Partial_Object"]').prop('checked', false);
                if (autosubmit){
                    $('input[value="Submit"]').click();
                }
                break;
            case 50: // 2
            case 98: // Numpad2
                $('input[value="Valid_Object"]').click();
                $('input[value="Partial_Object"]').click();
                if (autosubmit){
                    $('input[value="Submit"]').click();
                }
                break;
            case 51: // 3
            case 99: // Numpad3
                $('input[value="Multiple_Objects"]').click();
                $('input[value="Partial_Object"]').prop('checked', false);
                if (autosubmit){
                    $('input[value="Submit"]').click();
                }
                break;
            case 52: // 4
            case 100: // Numpad4
                $('input[value="Obscene_Finance"]').click();
                $('input[value="Partial_Object"]').prop('checked', false);
                if (autosubmit){
                    $('input[value="Submit"]').click();
                }
                break;
            case 53: // 5
            case 101: // Numpad6
                $('input[value="Missing_Object"]').click();
                $('input[value="Partial_Object"]').prop('checked', false);
                if (autosubmit) {
                    $('input[value="Submit"]').click();
                }
                break;
            case 13: // Enter
                $('input[value="Submit"]').click();
                break;
            default: return;
        }
    });
}

$('input:radio:checkbox').css({ width: '1.25em', height: '1.25em'});
