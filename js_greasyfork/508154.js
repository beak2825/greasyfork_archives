// ==UserScript==
// @name         TurfWars Automation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate login and post bump comment
// @match        https://turfwarsapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508154/TurfWars%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/508154/TurfWars%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href === "https://turfwarsapp.com/forum/171/topic/346041259/") {
        // If already on the page, post bump comment
        var fbody = document.querySelector('textarea[name="fbody"]'); // Adjust if necessary
        if (fbody) {
            fbody.value = 'bump';
            forumReply(new Event('click'), '346041259', null, fbody, afterReply);
        }
    } else if (window.location.href === "https://turfwarsapp.com/login/") {
        // If on the login page, set login credentials and click login
        var nameField = document.getElementById("login_name");
        var passwordField = document.getElementById("login_pass");
        if (nameField && passwordField) {
            nameField.value = "ikhwal";
            passwordField.value = "kiwelz21";
            document.getElementById("action").click();

            // Redirect to the forum page after a short delay
            setTimeout(function() {
                window.location.href = "https://turfwarsapp.com/forum/171/topic/346041259/";
            }, 1000);
        }
    }
})();