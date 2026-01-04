// ==UserScript==
// @name        Outlook unread email count
// @description Display the number of unread messages in the tab title
// @author      Drew Burden
// @namespace   DrewABurden
// @version     1.0
// @match       https://outlook.office365.com/*
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/519985/Outlook%20unread%20email%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/519985/Outlook%20unread%20email%20count.meta.js
// ==/UserScript==
var title;

function updateUnreadCount()
{
    var url = window.location.href;
    if (url.startsWith("https://outlook.office365.com/mail"))
    {
        var numUnread = 0;

        var unreadEls = document.evaluate("//div[@data-folder-name='inbox']//span[contains(., 'unread')]", document, null, XPathResult.ANY_TYPE, null );
        var unreadElContainer = unreadEls.iterateNext();
        if (unreadElContainer)
        {
            numUnread = unreadElContainer.firstChild.firstChild.innerText;
        }

        if (numUnread > 0)
        {
            document.title = "(" + numUnread + ") " + title;
        }
        else
        {
            document.title = title;
        }
    }
    setTimeout(updateUnreadCount, 5 * 1000);
}

function getInitialTitle()
{
    var url = window.location.href;
    if (url.startsWith("https://outlook.office365.com/mail"))
    {
        title = document.title;
        updateUnreadCount();
    }
    else
    {
        setTimeout(getInitialTitle, 5 * 1000);
    }
}

(
    function()
    {
        'use strict';
        setTimeout(getInitialTitle, 3000);
    }
)();