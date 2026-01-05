// ==UserScript==
// @name           Selective Signature
// @version        1.0
// @description    Automatically disables your signature on all posts outside of a specific forum category
// @author         iNeo19
// @include        https://hackforums.net/showthread.*
// @include        https://hackforums.net/newreply.*
// @include        https://hackforums.net/newthread.*
// @namespace https://greasyfork.org/users/83380
// @downloadURL https://update.greasyfork.org/scripts/25207/Selective%20Signature.user.js
// @updateURL https://update.greasyfork.org/scripts/25207/Selective%20Signature.meta.js
// ==/UserScript==

var sections = ["Web Browsers", "Windows 10"];
 
var navigationPath = document.getElementsByClassName("navigation"); // Find all the elements with the class name "navigation".
var navigationSections = navigationPath[0].getElementsByTagName("a"); // Find all the '<a></a>' elements in the navigation class element.
for(var i=0;i<navigationSections.length;i++) { // Loop trough the <a> elements found in the navigation class element.
    var sectionName = navigationSections[i].innerHTML; // create a variable that contains the section name.
    if (sections.indexOf(sectionName) > -1) { // Check if the sections array contains the found section names.
        var checkBoxes = document.getElementsByTagName("input"); // Find all the input HTML elements.
        for(var i2=0;i<checkBoxes.length;i2++) { // Loop trough all the input HTML elements.
            if (checkBoxes[i2].getAttribute("name") == "postoptions[signature]") { // Find the input checkbox that contains the name "postoptions[signature]" so it won't check any other checkbox by accident.
                checkBoxes[i2].checked = false; // Uncheck the checkbox.
            }
        }
    }
}