// ==UserScript==
// @name       Moritz Sudhof
// @version 0.1
// @namespace Moritz Sudhof categorization script for Mturk
// @description Moritz Sudhof categorization script for Mturk
// @include       *
// @copyright  mturkhacker
// @downloadURL https://update.greasyfork.org/scripts/3690/Moritz%20Sudhof.user.js
// @updateURL https://update.greasyfork.org/scripts/3690/Moritz%20Sudhof.meta.js
// ==/UserScript==


 
var content = document.getElementById("wrapper");
content.tabIndex = "0";
content.focus();
 
document.onkeydown = showkeycode;
function showkeycode(evt){
    var keycode = evt.keyCode;
       switch (keycode) {
            case 65: //a
                document.getElementById("Advocate").click();
                document.getElementById("mturk_form").submit();
                break;
            case 83: //s
                document.getElementById("Detractor").click();
                document.getElementById("mturk_form").submit();
                break;
            case 68: //d
                document.getElementById("Neither").click();
                document.getElementById("mturk_form").submit();
                break;
    }
}