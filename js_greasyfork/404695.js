// ==UserScript==
// @name         Fix New-Window Links (Remove target Attribute)
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      1.0
// @description  Remove the target attribute from the links matching the given string.
// @author       Gavin Borg
// @require      https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js?version=184529
// @match        https://greasyfork.org/en/scripts/404695-fix-new-window-links-remove-target-attribute
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/404695/Fix%20New-Window%20Links%20%28Remove%20target%20Attribute%29.user.js
// @updateURL https://update.greasyfork.org/scripts/404695/Fix%20New-Window%20Links%20%28Remove%20target%20Attribute%29.meta.js
// ==/UserScript==

var config = GM_config;
var maxNumSelectors = 5; // How many different selectors are configurable per site.

(function() {
    'use strict';

    var site = getMatchingSite();
    initConfig(site);

    var siteClean = cleanSite(site);
    for (var i = 1; i <= maxNumSelectors; i++) {
        "selector" + i
        var selector = config.get(getConfigField(i));
        if(selector) {
            fixLinksMatchingQuery(selector);
        }
    }
})();

function getMatchingSite() {
    // Get sites that user has chosen to include or match (because that's what hotkeys are keyed to, not direct URLs)
    var sites = GM_info.script.options.override.use_matches;
    sites.concat(GM_info.script.options.override.use_includes);

    // Find matching site
    var currentURL = window.location.href;
    for (var site of sites) {
        // Use a RegExp to determine which of the user's includes/matches is currently open, since we allow different hotkeys/anchors per each of those.
        var siteRegex = new RegExp(site.replace(/\*/g, "[^ ]*")); // Replace * wildcards with regex-style [^ ]* wildcards
        if (siteRegex.test(currentURL)) {
            return site; // First match always wins
        }
    }
}

function initConfig(site) {
    var siteClean = cleanSite(site);

    // Build the link selector fields
    var fields = {};
    for (var i = 1; i <= maxNumSelectors; i++) {
        fields[getConfigField(i)] = {
            label: "Selector to fix (jQuery-style) #" + i + ":",
            title: "The jQuery-style selector that defines the link element(s) that you want to fix.",
            type: "text"
        };
    }

    config.init({
        id: "FixNewWindowLinksConfig" + siteClean,
        title: "Fix New Window Links Config for: " + site,
        fields: fields,
        events: {
            'save': function() { config.close(); }
        }
    });

    // Add a menu item to the menu to launch the config
    GM_registerMenuCommand("Configure links to fix for this site", () => {
        config.open();
    })
}

function cleanSite(site) {
    return site.replace(/[\*/:\?\.]/g, ""); // Drop */:?. characters from site for use in ID
}

function getConfigField(index) {
    return "selector" + index;
}

function fixLinksMatchingQuery(queryString) {
    if (document.querySelector(queryString)) { // Make sure the links we want to fix exist, in case they show up via AJAX a little later than page load.
        document.querySelectorAll(queryString).forEach(link => link.removeAttribute("target"));
    } else {
        setTimeout(fixLinksMatchingQuery.bind(null, queryString), 0);
    }
}