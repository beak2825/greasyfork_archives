// ==UserScript==
// @name         Unique Avatars for MuroBBS
// @namespace    bcha
// @version      0.1.5
// @description  Implements the ability to add unique avatars the users on MuroBBS
// @author       bcha
// @require      http://code.jquery.com/jquery-latest.js
// @match        http://murobbs.muropaketti.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19095/Unique%20Avatars%20for%20MuroBBS.user.js
// @updateURL https://update.greasyfork.org/scripts/19095/Unique%20Avatars%20for%20MuroBBS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(
        function() {
            // Avatar for user "boocha" (.Av57006l)
            $(".messageUserBlock .Av57006l").parent().parent().css({"background-image": "url('https://i.imgur.com/Qcl5xsG.png')", "height": "80px", "width": "80px", "margin": "5px", "box-shadow": "1px 1px 4px #000" });
        }
    );
})();