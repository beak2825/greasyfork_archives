// ==UserScript==
// @name ResetEra - Temporary Dark Mode
// @namespace TemporaryDarkMode
// @description Creates a dark mode on Resetera.com
// @require http://code.jquery.com/jquery-latest.min.js
// @require http://code.jquery.com/ui/1.11.2/jquery-ui.min.js
// @include http*://*resetera.com/*
// @version 0.1
// @downloadURL https://update.greasyfork.org/scripts/34538/ResetEra%20-%20Temporary%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/34538/ResetEra%20-%20Temporary%20Dark%20Mode.meta.js
// ==/UserScript==

$(document).ready(function() {
    let backgroundColor = '#2d2d2d';
    let textColor = '#e6e6e6';
    let userColor = '#d2a564';

    $('.forumNodeInfo, .secondaryContent,.discussionListItem, .listBlock, .messageText, .userbanner, .message, .messageUserInfo, h3.title a, .quoteContainer, .attribution, .titleBar, .titleBar h1, .muted, .navTabs').map((index, item) => {
        item.style.backgroundColor = backgroundColor;
        item.style.color = textColor;
                                                  });

    $('.username, .selected .navLink').map((index, item) => {
        item.style.color = userColor;
    });
});
