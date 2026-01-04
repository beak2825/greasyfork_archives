// ==UserScript==
// @name         Submit channel search
// @namespace    https://xandaros.dyndns.org/
// @version      0.1
// @description  Adds a submit button to the search on a channel. Because accessibility is apparently not a priority.
// @author       Xandaros
// @match        https://www.youtube.com/channel/*
// @match        https://www.youtube.com/c/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438346/Submit%20channel%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/438346/Submit%20channel%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#form #input").append("<button onClick=\"$('#form').submit()\">GO</button>");
})();