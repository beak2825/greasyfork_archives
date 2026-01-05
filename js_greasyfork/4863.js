// ==UserScript==
// @name       Giphy Categorization
// @version    0.4
// @description  Reverse Engineered because I have no clue what I'm doing!
// @updateurl  
// @include       *
// @copyright  
// @namespace https://greasyfork.org/users/5064
// @downloadURL https://update.greasyfork.org/scripts/4863/Giphy%20Categorization.user.js
// @updateURL https://update.greasyfork.org/scripts/4863/Giphy%20Categorization.meta.js
// ==/UserScript==


 
var content = document.getElementById("button_window");
content.tabIndex = "0";
content.focus();
 
document.onkeydown = showkeycode;
function showkeycode(evt){
    var keycode = evt.keyCode;
       switch (keycode) {
            case 97: //Numberpad 1
                document.getElementById("For Children ").click();              
                document.getElementById("mturk_form").submit();
                break;
            case 98: //Numberpad 2
                document.getElementById("For Children - Animated").click();
                document.getElementById("mturk_form").submit();
                break;
            case 99: //Numberpad 3
                document.getElementById("For Young Adults ").click();
                document.getElementById("mturk_form").submit();
                break;
            case 100: //Numberpad 4
                document.getElementById("For Adults").click();
                document.getElementById("mturk_form").submit();
                break;
            case 101: //Numberpad 5
                document.getElementById("For Adults - Porn ").click();
                document.getElementById("mturk_form").submit();
                break;

    }
}