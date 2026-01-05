// ==UserScript==
// @name        Relevance Groupon on Mturk
// @version    1.0
// @description  Hides instructions, auto opens link, when radio is clicked new window closes and hit submits.
// @author     Cristo
// @include    https://s3.amazonaws.com/mturk_bulk/*
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/3048/Relevance%20Groupon%20on%20Mturk.user.js
// @updateURL https://update.greasyfork.org/scripts/3048/Relevance%20Groupon%20on%20Mturk.meta.js
// ==/UserScript==

if (window.location.toString().indexOf("ASSIGNMENT_ID_NOT_AVAILABLE") === -1){
    
    var page = document.getElementById("mturk_form");
    var instructions = page.getElementsByClassName("panel panel-primary")[0];
    var site = page.getElementsByTagName("a")[1].href;
    var inputs = page.getElementsByTagName("input");
    var sub = document.getElementById("submitButton");
    instructions.style.display = "none";
    
    var but = document.createElement("input");
    but.type = "button";
    but.value = "Instructions";
    instructions.parentNode.insertBefore(but, instructions.nextSibling);
    
    var newWidth;
    var newLeft;
    var windowTo;
    var windowEnd = window.screenX + window.outerWidth;
    var leftSpace = window.screenX;
    var rightSpace = screen.width - windowEnd;
    if (leftSpace > rightSpace) {
        newWidth = window.screenX;
        newLeft = "0";
    } else {
        newWidth = screen.width - windowEnd;
        newLeft = windowEnd;
    }
    windowTo  = 'width=' + newWidth;
    windowTo += ', height=' + screen.height;
    windowTo += ', top=' + "0"; 
    windowTo += ', left=' + newLeft;
    var newin = window.open(site, "name", windowTo);
    
    document.addEventListener( "click", cas, false );
    function cas (d) {
        if(d.target == but){
            if(instructions.style.display == "none") {
                instructions.style.display = "block";
            } else if (instructions.style.display == "block") {
                instructions.style.display = "none";
            }
                }
        if(d.target == inputs[2]){
            newin.close();
            sub.click();
        }
        if(d.target == inputs[3]){
            newin.close();
            sub.click();
        }
    }
    
}