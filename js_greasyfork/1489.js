// ==UserScript==
// @name       CS User Manuals Yes 
// @author     Cristo
// @version    0.1
// @description  Fills All Yes mturk
// @include       *
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/1489/CS%20User%20Manuals%20Yes.user.js
// @updateURL https://update.greasyfork.org/scripts/1489/CS%20User%20Manuals%20Yes.meta.js
// ==/UserScript==

var elements = document.getElementsByTagName("input");
for (i = 0; i < elements.length; i++) {
    if (elements[i].value == "yes") {
        elements[i].checked = true;
    }
}