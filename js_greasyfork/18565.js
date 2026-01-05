// ==UserScript==
// @name         JustAnswers Chat Remover
// @namespace    http://www.nathanprice.org
// @version      0.1
// @description  Get rid of fake chat popup.
// @author       Nathan Price
// @match        http://*.justanswer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18565/JustAnswers%20Chat%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/18565/JustAnswers%20Chat%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("default-fake-chat-container").remove();
    setTimeout(function(){
        $( ".fake-chat-overlay" ).remove();
    }, 2000);
})();