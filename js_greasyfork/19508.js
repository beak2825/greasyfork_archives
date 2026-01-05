// ==UserScript==
// @name         Onionator
// @namespace    http://tampermonkey.net/onionator
// @version      0.2
// @description  change all /r/TheOnion and /r/notTheOnion links on reddit's multi sub of /r/TheOnion and /r/notTheOnion to a link that says "Click to reveal", and when clicked reverts the link back to original
// @author       Guy Michaely
// @match        https://www.reddit.com/r/theonion+nottheonion
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19508/Onionator.user.js
// @updateURL https://update.greasyfork.org/scripts/19508/Onionator.meta.js
// ==/UserScript==

(function() {
    var body = document.body;
    var insertString = function (string, indices, insert_string) {  //allowing 2 indices means that one could simply insert a string by using 2 of the same indices, or replace part of the string by using 2 different indices
        if (!(Array.isArray(indices))) {
            console.error(Error("Indices must be of type array"));
        } else if (indices.length != 1 || indices.length != 2) {
            console.error(Error("Not enough or too many elements in indices"));
        } else if (indices.length == 1) {
            return string.substring(0, indices[0]) + insert_string + string.substring(indices[0], string.length);
        } else {
            return string.substring(0, indices[0]) + insert_string + string.substring(indices[1], string.length);
        }
    }
    
    body.innerHTML = insertString(body.innerHTML, /*[body.innerHTML.indexOf(">/r/TheOnion")]*/"hi", "class='TheOnion'");
    body.innerHTML = insertString(body.innerHTML, [body.innerHTML.indexOf(">/r/TheOnion") + 1], "@");
})();