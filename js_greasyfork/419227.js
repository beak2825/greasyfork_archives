// ==UserScript==
// @name         Hide Discord sidebars
// @namespace    https://github.com/Dragosarus/Userscripts/
// @version      2.4
// @description  Give the chat more screen space
// @author       Dragosarus
// @match        http://discord.com/*
// @match        https://discord.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/419227/Hide%20Discord%20sidebars.user.js
// @updateURL https://update.greasyfork.org/scripts/419227/Hide%20Discord%20sidebars.meta.js
// ==/UserScript==

// NOTE: Does not work with Greasemonkey as it neither supports GM_registerMenuCommand nor GM_unregisterMenuCommand.
// Use Tampermonkey or Violentmonkey instead.

(function() {
    'use strict';
    var hide = {
        serverSidebar : true,
        channelSidebar: true,
        memberSidebar : true // note: there is a "Member List" button in the top-right corner
    };

    // Can't use 'aria-label' to identify the Members List button as its value depends on your language settings,
    // so (part of) the icon will have to be used instead
    var memberIconPath = "M14 8.00598C14 10.211 12.206 12.006 10 12.006C7.795 12.006 6 10.211 6 8.00598C6 5.80098 7.794 4.00598 10 4.00598C12.206 4.00598 14 5.80098 14 8.00598ZM2 19.006C2 15.473 5.29 13.006 10 13.006C14.711 13.006 18 15.473 18 19.006V20.006H2V19.006Z";

    var serverSelector = "nav[class*='guilds']";
    var channelSelector = "div[class*='sidebar']";
    var memberSelector = "div[class*='membersWrap']";
    var memberIconSelector = "div[class*='clickable']:has(svg > path[d='" + memberIconPath + "'])"
    var baseSelector = "div[class*='base']"; // needed when hiding server sidebar

    var hideMenu = "Hide sidebars";
    var showMenu = "Show sidebars";
    var memberToggleMenu = "Toggle member sidebar"; // + " [current: (in)visible]"
    var hideSidebarMenuShortcut = 's';

    var hideSidebarMenuId;
    var memberToggleMenuId;
    var baseOffset; // e.g. "72px"

    var sidebarsHidden = false;
    var memberSidebarHidden; // from the "Member List" button
    var selectors = {
        serverSidebar: serverSelector,
        channelSidebar: channelSelector,
        memberSidebar: memberSelector
    };

    init();

    function init() {
        updateHideSidebarMenu();
    }

    function onHideSidebarMenuClick() {
        // Read state of "Member List" button
        memberSidebarHidden = $(memberIconSelector).filter("div[class *= 'selected']").length == 0;

        // Toggle visibility of sidebars
        for (var sidebar in selectors) {
            // hideMemberSidebar = memberSidebarHidden || sidebarsHidden
            if (sidebar == "memberSidebar" && memberSidebarHidden) {continue;}

            if (hide[sidebar]) {
                setSidebar(selectors[sidebar], sidebarsHidden);
            }
        }

        // Extra work is needed to properly hide the server sidebar
        if (hide.serverSidebar) {
            var base = $(baseSelector);
            if (sidebarsHidden) {
                base.css("left", baseOffset);
            } else {
                baseOffset = base[0].style.left;
                base.css("left", "0px");
            }
        }
        sidebarsHidden ^= true;

        // Update menu
        updateHideSidebarMenu();
    }

    function updateHideSidebarMenu() {
        GM_unregisterMenuCommand(hideSidebarMenuId);
        var menu = sidebarsHidden ? showMenu : hideMenu;
        hideSidebarMenuId = GM_registerMenuCommand(menu, onHideSidebarMenuClick, hideSidebarMenuShortcut);
    }

    function setSidebar(selector, boolValue) {
        if (boolValue) {
            showSidebar(selector);
        } else {
            hideSidebar(selector);
        }
    }

    function hideSidebar(selector) {
        var node = $(selector)[0];
        node.style.display = "none";
    }

    function showSidebar(selector) {
        var node = $(selector)[0];
        node.style.removeProperty("display");
    }

})();
/*eslint-env jquery*/ // stop eslint from showing "'$' is not defined" warnings
