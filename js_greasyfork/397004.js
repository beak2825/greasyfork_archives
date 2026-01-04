// ==UserScript==
// @name         GDocs Display blank form after submit [without delay]
// @version      0.1
// @description  Redirects back to a new empty form directly after submission
// @author       Melgior
// @match        https://docs.google.com/*/formResponse*
// @grant        none
// @namespace https://greasyfork.org/users/5660
// @downloadURL https://update.greasyfork.org/scripts/397004/GDocs%20Display%20blank%20form%20after%20submit%20%5Bwithout%20delay%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/397004/GDocs%20Display%20blank%20form%20after%20submit%20%5Bwithout%20delay%5D.meta.js
// ==/UserScript==

if (document.getElementsByTagName("form").length === 0) {
    setTimeout(function(){
        document.location = document.location.href.replace("formResponse", "viewform");
    }, 0);
}