// ==UserScript==
// @name         THM Moodle Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add search field to Moodle website
// @author       Florian Fenzl
// @match        https://moodle.thm.de/
// @include      /^https:\/\/moodle\.thm\.de\/.*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/40969/THM%20Moodle%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/40969/THM%20Moodle%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var block = $("aside[data-block='course_list'] .card-block");
    var ul = block.find("ul");
    var inp = $("<input \>", {"class": "form-control"});

    var eul = () => ul.find('li').toArray();
    var chk = (e,t) => ~e.getElementsByTagName("a")[0].innerText.toUpperCase().indexOf(t.toUpperCase());
    var eulf = () => eul().filter(e => chk(e, inp.val()));

    inp.attr("placeholder", "Filter");
    inp.keyup(() => eul().forEach(e => e.style.display = chk(e, inp.val()) ? "" : "none" ));
    inp.keydown((e) => {if(e.keyCode == 13 && eulf().length == 1) { window.location.href = eulf()[0].getElementsByTagName("a")[0].href }});
    $("<p></p>").appendTo(block.find("h3"));
    inp.appendTo(block.find("h3"));
})();