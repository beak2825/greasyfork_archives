// ==UserScript==
// @name         DelNewyers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide svgIcon nyCapIcon inside avatar on zelenka.guru
// @author       CoderCore
// @match        https://zelenka.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482681/DelNewyers.user.js
// @updateURL https://update.greasyfork.org/scripts/482681/DelNewyers.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var avatars = document.querySelectorAll('.avatar');


    avatars.forEach(function(avatar) {

        var icons = avatar.querySelectorAll('.svgIcon.nyCapIcon');


        icons.forEach(function(icon) {
            icon.style.display = 'none';
        });
    });
})();
