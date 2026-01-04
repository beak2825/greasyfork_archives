// ==UserScript==
// @name         Twitter "title" fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes the title from X to Twitter
// @author       Jojo
// @match        https://twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472189/Twitter%20%22title%22%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/472189/Twitter%20%22title%22%20fixer.meta.js
// ==/UserScript==
function changeTitle(){
        if(document.title !== "Twitter")
            document.title = "Twitter";
    }
(function() {
    setInterval((e) =>{
        changeTitle();
    }, 1000);
})();