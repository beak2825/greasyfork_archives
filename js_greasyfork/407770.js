// ==UserScript==
// @name         Neopets Beta - Community to Neoboards
// @author       Necramancy
// @description  Go directly to the neoboards instead of the community page
// @namespace    https://greasyfork.org/users/547396
// @match        *.neopets.com/*
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/407770/Neopets%20Beta%20-%20Community%20to%20Neoboards.user.js
// @updateURL https://update.greasyfork.org/scripts/407770/Neopets%20Beta%20-%20Community%20to%20Neoboards.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let community = document.getElementsByClassName( 'nav-community__2020' )[0];

    // Remove Beta Popup
    community.onclick = function() {
        return false;
    }

    // Go to neobooards
    community.addEventListener( 'click', function(){
       window.location = 'http://www.neopets.com/neoboards/index.phtml';
    });
})();