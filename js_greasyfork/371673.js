// ==UserScript==
// @name         slackBePolite
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  polite greetings on slack; will automatically fill in polite greetings when focus on msg_input column
// @author       Stanley Zhang
// @match        *://*.slack.com/messages/*
// @requir       https://code.jquery.com/jquery-latest.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/371673/slackBePolite.user.js
// @updateURL https://update.greasyfork.org/scripts/371673/slackBePolite.meta.js
// ==/UserScript==

$(window).load(function greets() {
    'use strict';
    $(".ql-editor.ql-blank.focus-ring").text(function(i, oldText){
        return 'お疲れ様です。\n...\nよろしくお願い致します。';
    });
    setTimeout(greets, 2000);
})();