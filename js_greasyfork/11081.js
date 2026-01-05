// ==UserScript==
// @name         GDocs Display blank form after submit
// @version      0.2
// @description  Redirects back to empty form after displaying the confirmation message for 5 seconds
// @author       Melgior
// @match        https://docs.google.com/*/formResponse*
// @grant        none
// @namespace https://greasyfork.org/users/5660
// @downloadURL https://update.greasyfork.org/scripts/11081/GDocs%20Display%20blank%20form%20after%20submit.user.js
// @updateURL https://update.greasyfork.org/scripts/11081/GDocs%20Display%20blank%20form%20after%20submit.meta.js
// ==/UserScript==

if (document.getElementsByTagName("form").length === 0) {
    setTimeout(function(){
        document.location = document.location.href.replace("formResponse", "viewform");
    }, 5000);
}