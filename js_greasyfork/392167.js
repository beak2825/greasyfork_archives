// ==UserScript==
// @name         Choco-One-Click
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Install software from chocolatey.org with one-click. This requires choco:// protocol support (choco install choco-protocol-support).
// @author       AJ Steers
// @include      http://*chocolatey.org/*
// @include      https://*chocolatey.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392167/Choco-One-Click.user.js
// @updateURL https://update.greasyfork.org/scripts/392167/Choco-One-Click.meta.js
// ==/UserScript==

console.log("hello, world!");
(function() {
    'use strict';

    console.log("hello, function!");
    var code_elems = document.getElementsByTagName('input');

    var cinst_regex = /choco\sinstall\s([\w\d\-\.]*)/;
    for (var i = 0; i < code_elems.length; i++) {
        console.log("hello, loop!");
        var ce = code_elems[i];
        var cmd = ce.value;

        var cinst_match = cmd.match(cinst_regex);

        if (cinst_match) {
            console.log("hello, " + cinst_match[1] + "!");
            console.log(ce);
            console.log(cmd);
            var new_install_cmd = "choco://" + cinst_match[1];
            var a = document.createElement('a');
            // Create the text node for anchor element.
            var link = document.createTextNode(new_install_cmd);
            a.appendChild(link);
            a.title = new_install_cmd;
            a.href = new_install_cmd;
            parent = ce.parentElement.parentElement.parentElement
            parent.appendChild(document.createElement('p'));
            parent.appendChild(document.createTextNode("Or click to install: "));
            parent.appendChild(a);
        }
    }
    // Your code here...
})();

insert_add_to_box();
function insert_add_to_box() {
}
console.log("goodbye, world!");