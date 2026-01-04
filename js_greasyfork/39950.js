// ==UserScript==
// @name         delete like button so you don't accidentally click on it
// @namespace    http://tampermonkey.net/
// @version      1
// @description  how to delete like button so you don't accidentally click on it
// @author       Thomas Altmann
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39950/delete%20like%20button%20so%20you%20don%27t%20accidentally%20click%20on%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/39950/delete%20like%20button%20so%20you%20don%27t%20accidentally%20click%20on%20it.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let remInt = window.setInterval(tryToDelete, 500);
    function tryToDelete(){
        let likeButton = document.querySelector("#info #menu #top-level-buttons ytd-toggle-button-renderer");
        if(likeButton){
            likeButton.remove();
            window.clearInterval(remInt);
        }
    }

})();