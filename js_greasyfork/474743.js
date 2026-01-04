// ==UserScript==
// @name         24 Hour Converter for Jira
// @namespace    http://schuppentier.org/
// @version      1.0.1
// @description  Convert 12 hour time formats in Jira to a more sensible format
// @author       Dennis Stengele
// @match        https://*.atlassian.net/jira/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @require      https://bowercdn.net/c/arrive-2.4.1/minified/arrive.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474743/24%20Hour%20Converter%20for%20Jira.user.js
// @updateURL https://update.greasyfork.org/scripts/474743/24%20Hour%20Converter%20for%20Jira.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.arrive("span", function() {
        if (!(this.innerText.match(/(\d{2}\/\d{2}\/\d{2}, \d{2}:\d{2}:\d{2} [ap]m)/gm))) {
            return;
        }
        function replacer(match) {
            var timestamp = moment(match, "DD/MM/YY hh:mm:ss a");
            return timestamp.format("DD. MMM Y HH:mm:ss");
        }
        const newValue = this.innerText.replace(/(\d{2}\/\d{2}\/\d{2}, \d{2}:\d{2}:\d{2} [ap]m)/gm, replacer);
        this.innerText = newValue;
    })
})();