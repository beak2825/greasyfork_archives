// ==UserScript==
// @name         FOK! sig
// @namespace    https://greasyfork.org/users/194782
// @version      1.2
// @description  Add signature at the end of every comment.
// @author       I.
// @match        http://forum.fok.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370075/FOK%21%20sig.user.js
// @updateURL https://update.greasyfork.org/scripts/370075/FOK%21%20sig.meta.js
// ==/UserScript==
var jq = window.jQuery;

jq(function(){
        var message = jq('#message');
        message.on('blur',function(){
            message.val(message.val() + '\r\n\r\n I.');
        });
});