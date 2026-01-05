// ==UserScript==
// @name         chris10000 change stylesheet
// @namespace    https://orbitalzero.ovh/scripts
// @version      0.2
// @description  change stylesheet
// @author       NeutronNoir
// @match        https://gazellegames.net/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.2.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/28321/chris10000%20change%20stylesheet.user.js
// @updateURL https://update.greasyfork.org/scripts/28321/chris10000%20change%20stylesheet.meta.js
// ==/UserScript==

const SS_LINK = "static/styles/game_room/style.css";

(function() {
    'use strict';
    
    $.ajax(SS_LINK).then((style) => {
        GM_addStyle(style);
    });
})();