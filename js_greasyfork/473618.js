// ==UserScript==
// @name         Slack channel names with no workspace name
// @namespace    https://app.slack.com/
// @version      0.2
// @description  Remove workspace name from appearing to the right of every channel name in Slack
// @author       Bing Chat
// @match        https://app.slack.com/*
// @match        http://app.slack.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473618/Slack%20channel%20names%20with%20no%20workspace%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/473618/Slack%20channel%20names%20with%20no%20workspace%20name.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    var elements = document.querySelectorAll("div[class^='c-channel_team']");
    for (var i = 0; i < elements.length; i++) {
        elements[i].parentNode.removeChild(elements[i]);
    }
}, false);