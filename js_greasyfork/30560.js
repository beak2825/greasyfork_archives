// ==UserScript==
// @name         Visible Password
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match http://boards.4chan.org/*
// @match https://boards.4chan.org/*
// @include https://boards.4chan.org/*
// @include http://boards.4chan.org/*
// @downloadURL https://update.greasyfork.org/scripts/30560/Visible%20Password.user.js
// @updateURL https://update.greasyfork.org/scripts/30560/Visible%20Password.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("postPassword").setAttribute("type", "");
    document.getElementById("postPassword").value = "_oZfG5xpuTkOsw0qEbWVtImzL9YrQ6dNg";
    // Your code here...
    document.getElementById("delPassword").setAttribute("type", "");
    document.getElementById("delPassword").value = "_oZfG5xpuTkOsw0qEbWVtImzL9YrQ6dNg";
})();