// ==UserScript==
// @name     Resize map
// @description Resize map by clicking a button and typing in how big it should be
// @version 2.1.3
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @include https://*/game.php?village=*&screen=map*
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/40127/Resize%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/40127/Resize%20map.meta.js
// ==/UserScript==
var parentThingie = document.getElementById("inner-border"); // Set parent

var input = document.createElement("input");
input.setAttribute("id", "inputSetSize");
input.setAttribute("type", "text");
input.setAttribute("value", "");
input.setAttribute("style", "margin-top:10px");
parentThingie.parentNode.insertBefore(input, parentThingie);

var buttonSetMapSize = document.createElement("button"); // Create button
buttonSetMapSize.innerHTML = "Set Map Size"; // Text of button
buttonSetMapSize.setAttribute("id", "setMapSize"); // Set ID
buttonSetMapSize.setAttribute("style","float:left;margin:10px;"); // Set CSS
buttonSetMapSize.setAttribute("class","btn"); // Set class

parentThingie.insertAdjacentElement('afterbegin', input); // Add input field to the site
parentThingie.insertAdjacentElement('afterbegin', buttonSetMapSize); // Add button to the site

document.getElementById("inputSetSize").addEventListener("keyup", function(event) {
    "use strict";
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("setMapSize").click();
    }
});

document.getElementById("setMapSize").onclick = function largeMap(){ // Call this function when the button is clicked
    "use strict";
    var size = parseInt(document.getElementById("inputSetSize").value); // Prompts the user to type in map size
    TWMap.resize(size, true);
};