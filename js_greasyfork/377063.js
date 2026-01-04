// ==UserScript==
// @name         Inoa-Zendesk Tab Title
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatic browser title updating for Inoa's Zendesk Support agent pages
// @author       João Pedro Francese
// @license      MIT
// @match        https://inoa.zendesk.com/agent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377063/Inoa-Zendesk%20Tab%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/377063/Inoa-Zendesk%20Tab%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Based on: https://github.com/software-architects/userscripts/blob/master/ZendeskWindowTitle.user.js

    console.log("📛 ZenTitle@Tampermonkey started.");
    var $ = window.$ || window.jQuery;

    var getFirst = function(items) {
        return (items && items.length) ? items[0] : {};
    };

    var updateWindowTitle = function() {
        var pageName;
        if (document.location.href.startsWith('https://inoa.zendesk.com/agent/admin')) {
            pageName = "Admin";
        } else if (document.location.href.startsWith('https://inoa.zendesk.com/agent/dashboard')) {
            pageName = "Dashboard";
        } else if (document.location.href.startsWith('https://inoa.zendesk.com/agent/ticket')) {
            var ticketName = getFirst($.find('section.ticket div.pane.right input[data-garden-id="forms.input"][data-test-id="omni-header-subject"]:visible')).value;
            var ticketIdElem = getFirst($.find('section.ticket div.pane.is_viewing_ticket:visible'));
            var ticketId = ticketIdElem ? ticketIdElem.getAttribute('data-side-conversations-anchor-id') : "";
            pageName = ticketId ? ('#' + ticketId) : '';
            if (ticketName) {
                pageName += " " + ticketName;
            }
            if (!pageName) {
                pageName = "Ticket";
            }
        } else if (document.location.href.startsWith('https://inoa.zendesk.com/agent/filters')) {
            pageName = getFirst($.find('section.filters header div[data-test-id="views_views-header"]:visible span')).innerText || "Lista";
        }

        var newTitle = "α-Zendesk";
        if (pageName) {
            newTitle = pageName + " | " + newTitle;
        }
        if (newTitle != document.title) {
            console.log("📛 ZenTitle@Tampermonkey changed page title from [" + document.title + "] to [" + newTitle + "].");
            document.title = newTitle;
        }
    }

    window.setTimeout(updateWindowTitle, 1);
    window.setInterval(updateWindowTitle, 1000);
})();
