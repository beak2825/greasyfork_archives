// ==UserScript==
// @name         Hide comments on 20min.ch
// @namespace    http://tampermonkey.net/
// @version      1
// @description  The comments on 20min.ch are trash, hide them.
// @author       Tripy
// @match        https://www.20min.ch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390376/Hide%20comments%20on%2020minch.user.js
// @updateURL https://update.greasyfork.org/scripts/390376/Hide%20comments%20on%2020minch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elm = document.getElementById('talkback');
    elm.style.display="none";
})();