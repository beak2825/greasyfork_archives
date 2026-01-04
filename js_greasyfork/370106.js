// ==UserScript==
// @name           StackExchange Tweaks
// @namespace      SET
// @description    Minor visual tweaks to StackExchange (remove the new sidebar from Q/A pages, for classic look)
// @version        1.1.0
// @license        MIT
// @include        https://stackoverflow.com/*
// @include        https://*.stackoverflow.com/*
// @include        https://superuser.com/*
// @include        https://serverfault.com/*
// @include        https://*.stackexchange.com/*
// @include        https://askubuntu.com/*
// @include        https://mathoverflow.net/*
// @include        https://stackapps.com/*
// @run-at         document-start
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370106/StackExchange%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/370106/StackExchange%20Tweaks.meta.js
// ==/UserScript==

// ==Options==

// Swap the positions of the notifications block and the username/stats block
// in the header
//
// This pushes the user profile off towards the corner, and brings the action
// buttons closer to the center
//
var swapProfileAndButtons = true;

// Hide the 2018 sidebar when we are on question pages (reduces visual noise)
//
var hideSidebarOnQuestionPages = true;

// If you don't like things to be 3D when they don't need to be
//
var noShadows = true;

// Lighten the new stats above the question, if you find them distracting
//
var deemphasiseStats = true;

// Ensure we can see which questions we have already viewed in the past
//
var makeVisitedLinksClearer = true;

// ==/Options==

if (swapProfileAndButtons) {
    //var secondaryNav = document.querySelector('.secondary-nav')
    //secondaryNav.parentNode.insertBefore(secondaryNav, secondaryNav.parentNode.firstChild)
    var profileElementInner = document.querySelector('.my-profile');
    if (profileElementInner) {
        var profileElementContainer = profileElementInner.parentNode;
        profileElementContainer.parentNode.appendChild(profileElementContainer);
    } else {
        console.warn("Could not find .my-profile element");
    }
}

if (hideSidebarOnQuestionPages) {
    if (document.location.pathname.match(/^\/(q|questions)\//)) {
        GM_addStyle('#left-sidebar { display: none; }');
        // On some sites this leaves an unnecessary line down the left of the content, which we can remove.
        // But on some sites, the lines is an all sides, so we don't want to remove it!
        /*
        if (document.location.hostname.match(/^(stackoverflow.com|(politics|physics|earthscience).stackexchange.com)$/)) {
            GM_addStyle('#content { border-left: none; }');
        }
        */
        // General purpose solution: do on the left whatever the right is doing.
        const contentElem = document.querySelector('#content');
        if (contentElem) {
            contentElem.style.borderLeft = getComputedStyle(contentElem)['border-right'] || 'none';
        }
    }
}

if (noShadows) {
    // The "Featured on Meta" box on the right, above "Related" and "Hot Network Questions"
    GM_addStyle('.s-sidebarwidget { box-shadow: none; }');
}

if (deemphasiseStats) {
    // There isn't a clear ID or class for the stats, so I used this monstrosity
    GM_addStyle('#question-header + .grid.fw-wrap.bb { opacity: 0.5; font-size: 0.9em; }');
}

if (makeVisitedLinksClearer) {
    setTimeout(() => {
        // Because this needs to work on multiple websites, I opted for a classic dark magenta
        GM_addStyle('.question-hyperlink:visited, .answer-hyperlink:visited { color: #481691; }');
        // I thought it might be a problem that the links in the search results had params which were removed when we visited the page, but apparently that wasn't a problem.
        /*
        const links = document.querySelectorAll('a');
        for (const link of links) {
            link.href = link.href.replace(/r=SearchResults/, '').replace(/\?$/, '');
        }
        */
    }, 1000);
}
