// ==UserScript==
// @name         Big Scrollbars for Google Tasks
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  only work on https://tasks.google.com/tasks/, not work on https://calendar.google.com/calendar/u/0/r/tasks
// @author       Hendrix Huang
// @match        https://tasks.google.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531674/Big%20Scrollbars%20for%20Google%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/531674/Big%20Scrollbars%20for%20Google%20Tasks.meta.js
// ==/UserScript==
GM_addStyle(`
    ::-webkit-scrollbar {
        height: 50px;
    }
`);
