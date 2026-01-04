// ==UserScript==
// @name         Warzone Chatter
// @namespace    DanWL
// @version      1.0.4
// @description  New chat window and such
// @match        https://www.warzone.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377882/Warzone%20Chatter.user.js
// @updateURL https://update.greasyfork.org/scripts/377882/Warzone%20Chatter.meta.js
// ==/UserScript==

unsafeWindow.$('body').ajaxSuccess (
    function (event, requestData)
    {
        console.log (requestData.responseText);
    }
);