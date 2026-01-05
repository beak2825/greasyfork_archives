// ==UserScript==
// @name         Make zsunesco.cz great again
// @namespace    dunno
// @version      0.2
// @description  Adds links to navbar
// @author       Tomáš Falešník
// @match        http://www.zsunesco.cz/
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @license      MIT license
// @downloadURL https://update.greasyfork.org/scripts/25841/Make%20zsunescocz%20great%20again.user.js
// @updateURL https://update.greasyfork.org/scripts/25841/Make%20zsunescocz%20great%20again.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        $("#bs-example-navbar-collapse-1 > ul").append('<li class="dropdown" id="tm_added"><a data-toggle="dropdown" href="#" class="dropdown-toggle">Odkazy <span class="dropdown-arrow"></span></a><ul class="dropdown-menu"></ul></li>'); // Appends dropdown ul to navbar
        $("#tm_added > ul").html($("body > div.section.section-links > div > div > div:nth-child(1) > div > ul:nth-child(2)").html()); // Copies contents of "links"
        $("#tm_added > ul > li, #tm_added > ul > li > a").removeClass("list-item , external"); // Removes retarded styling classes
    });
})();