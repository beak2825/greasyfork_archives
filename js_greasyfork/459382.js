// ==UserScript==
// @name         Wookieepedia :: Remove Pronouns
// @namespace    https://greasyfork.org/en/scripts/459382-wookieepedia-remove-pronouns
// @version      1.0
// @description  Removes Pronouns section from character pages' info panels on Wookiepedia
// @author       newstarshipsmell
// @match        https://starwars.fandom.com/wiki/*
// @icon         https://static.wikia.nocookie.net/starwars/images/4/4a/Site-favicon.ico/revision/latest
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459382/Wookieepedia%20%3A%3A%20Remove%20Pronouns.user.js
// @updateURL https://update.greasyfork.org/scripts/459382/Wookieepedia%20%3A%3A%20Remove%20Pronouns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('div[data-source="pronouns"]').style.display = 'none';
})();