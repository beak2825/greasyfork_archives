// ==UserScript==
// @name         Prequel command helper
// @namespace    http://www.prequeladventure.com/fanartbooru/user/amkitsune
// @version      1.1
// @description  Adds a link to the 'submit command' form to the bottom of prequel pages
// @author       AMKitsune
// @include      http://www.prequeladventure.com/
// @include      /http:\/\/www\.prequeladventure\.com\/\d.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33867/Prequel%20command%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/33867/Prequel%20command%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var linkElement = document.getElementsByClassName("entry-container fix")[0];
    if(getNewerPageIsAvailable() === false){
        //alert("running the script");
        var center = document.createElement("center");
        var newDiv = document.createElement("div");
        newDiv.style.textAlign = "center";
        newDiv.style.fontSize = "x-large";
        var linkToForm = document.createElement("a");
        var linkText = document.createTextNode("Submit a command to tell Katia what to do.");
        linkToForm.appendChild(linkText);
        linkToForm.href = "http://www.prequeladventure.com/submit-command/";
        newDiv.appendChild(linkToForm);
        center.appendChild(newDiv);
        linkElement.appendChild(center);
    }

    function getNewerPageIsAvailable(){
        if(document.getElementsByClassName("next").length >0){
            //alert("found the 'next' class");
            if(document.getElementsByClassName("next")[0].childNodes.length >0){
                return(true);
            } else {
                return(false);
            }
        } else {
            //alert("no 'next' class found");
            return(false);
        }
    }

})();