// ==UserScript==
// @name         DW discretion bypass
// @version      0.1
// @description  auto bypass Dreamwidth warning screen
// @match        *://*.dreamwidth.org/*
// @grant        none
// @namespace https://greasyfork.org/users/36620
// @downloadURL https://update.greasyfork.org/scripts/18483/DW%20discretion%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/18483/DW%20discretion%20bypass.meta.js
// ==/UserScript==

$(document).ready(function() {
    $("input[name='adult_check']").trigger('click');
});