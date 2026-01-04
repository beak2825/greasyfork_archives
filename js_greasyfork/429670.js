// ==UserScript==
// @name         Zuum
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change your Zoom username in a school Zoom without an account. Set variable "uname" to change it.
// @author       You
// @match        https://luther-vic-edu-au.zoom.us/j/*
// @icon         https://www.google.com/s2/favicons?domain=zoom.us
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429670/Zuum.user.js
// @updateURL https://update.greasyfork.org/scripts/429670/Zuum.meta.js
// ==/UserScript==
(function(){
    var uname = '';

    uname = encodeURI(uname);
    if (new URLSearchParams(window.location.search).get('uname') != uname && uname != '') {
        const joinCode = window.location.href.split('?uname=')[0];
        window.location.replace(joinCode+'?uname='+uname);
    }
})();