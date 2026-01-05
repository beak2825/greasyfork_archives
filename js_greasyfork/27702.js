// ==UserScript==
// @name         A9 Tops Script
// @version      0.1
// @description  Hotkeys for Amazon Tops HITs
// @author       Arthanos
// @include      https://s3.amazonaws.com/*
// @include      https://www.mturkcontent.com/*
// @grant        GM_log
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @namespace https://greasyfork.org/users/105763
// @downloadURL https://update.greasyfork.org/scripts/27702/A9%20Tops%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/27702/A9%20Tops%20Script.meta.js
// ==/UserScript==

var tops = $('center:contains(On a scale of 1 to 5, rate how similar the tops in the two images are.)');

if (tops.length){
    var mturk_iframe = document.querySelector("iframe")

    if (mturk_iframe){mturk_iframe.focus()}

    $(document).keydown(function(e){
        switch(e.which){
            case 49: // 1
            case 97: // Numpad1
                $('#result1').click();
                break;
            case 50: //2
            case 98:// Numpad2
                $('#result2').click();
                break;
            case 51: //3
            case 99:// Numpad3
                $('#result3').click();
                break;
            case 52: //4
            case 100: // Numpad4
                $('#result4').click();
                break;
            case 53: //5
            case 101:// Numpad2
                $('#result5').click();
                break;
            case 13: // Enter
                $('input[value="Submit"]').click();
                break;
            default: return;
        }
    });
}