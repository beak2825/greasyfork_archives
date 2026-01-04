// ==UserScript==
// @name         CMU Auto Login
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      http://10.44.247.9:1000/fgtauth?*
// @include      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374311/CMU%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/374311/CMU%20Auto%20Login.meta.js
// ==/UserScript==

$( document ).ready(function() {
    $('input[name="username"]').val('jirat_su@cmu.ac.th');
    $('input[name="password"]').val('j0832604302');
    setTimeout(function () {
        $('input[type="submit"]').trigger('click');
    }, 2000);
});