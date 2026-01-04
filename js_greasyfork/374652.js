// ==UserScript==
// @name         Pantip Display Hidden Message
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  show all hidden message on pantip topic
// @author       You
// @include      *://pantip.com/topic/*
// @include      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374652/Pantip%20Display%20Hidden%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/374652/Pantip%20Display%20Hidden%20Message.meta.js
// ==/UserScript==

$( document ).ready(function() {
$('.spoil-style').css('display', 'block');
});