// ==UserScript==
// @name         Better Better Classroom Redirect
// @version      0.4
// @description  Auto switch to user 1 when using Google Classroom with User 0
// @author       Original:pooroll, Better:Merith-TK, Better Better:Facepunch01
// @match https://classroom.google.com/*
// @namespace https://greasyfork.org/en/users/1060098
// @license BSD 2-Clause License
// @downloadURL https://update.greasyfork.org/scripts/463996/Better%20Better%20Classroom%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/463996/Better%20Better%20Classroom%20Redirect.meta.js
// ==/UserScript==
/*
Copyright 2023 Jake Hackl

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function() {
    'use strict';

    // Your code here...
    setTimeout(function() {
        var path0 = window.location.pathname;
        var path1 = path0.substring(0, 5);
    if (path1 === "/u/0/" || path1 === "/") {
        window.location.replace("https://classroom.google.com/u/1/");
    }
    }, 100);
})();