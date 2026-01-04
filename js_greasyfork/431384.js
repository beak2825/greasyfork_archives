// ==UserScript==
// @name         Switch to Mobile Wikipedia/Wiktionary and Back, Autoload Mobile Page
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Automatically loads Mobile Wikipedia if you visit the desktop version of Wikipedia from a different site; provides a shortcut to switch between the two and stays on the version you switched to.
// @author       https://greasyfork.org/en/users/728793-keyboard-shortcuts
// @icon         https://en.wikipedia.org/favicon.ico
// @match        https://*.wikipedia.org/*
// @match        https://*.wiktionary.org/*
// @match        https://*.wikimedia.org/*
// @match        https://*.wikiquote.org/*
// @match        https://*.wikibooks.org/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/431384/Switch%20to%20Mobile%20WikipediaWiktionary%20and%20Back%2C%20Autoload%20Mobile%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/431384/Switch%20to%20Mobile%20WikipediaWiktionary%20and%20Back%2C%20Autoload%20Mobile%20Page.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

// CONFIGURE THE SCRIPT HERE (set any of these to true or false, no other value):
const AUTOLOAD_MOBILE = true; // if set to true, loads the mobile page automatically when landing on a Wikimedia website.
const ENABLE_MOBILE_DESKTOP_SHORTCUT = true; // if set to true, lets you switch between mobile and non-mobile with ctrl-m on Windows or alt-m on Mac.
const ENABLE_EDIT_SHORTCUT = true; // if set to true, lets you edit an article with ctrl-e on Windows or alt-e on Mac.
const VIEW_HISTORY_IN_DESKTOP_MODE = true; // if set to true, view a wiki page's edit history in desktop mode. This is set to true by default since the history view on mobile is severely limited.
const LOG_DEBUG_MESSAGES = false; // if set to true, lets the script log debug information as it runs.
const REQUIRE_MODIFIER_FOR_SHORTCUTS = true;
// (END OF CONFIGURATION)

const WEBSITES = ['wikipedia', 'wiktionary', 'wikimedia', 'wikiquote', 'wikibooks'].join('|'); // in order to reuse this list underneath we have to use the RegExp constructor instead of the literal syntax.
const FULL_URL_REGEX = new RegExp('^(?<prefix>https?://[^/]*)(?<suffix>\\.(' + WEBSITES + ')\\.org/.*)');
const DOMAIN_REGEX = new RegExp('^(?<prefix>[^/]*)(?<suffix>\\.(' + WEBSITES + ')\\.org)');
const LANGUAGE_REGEX = new RegExp('^(https?://)(?<lang>[a-z]+)(\\.(' + WEBSITES + ')\\.org/.*)');
const DISABLED_ON_DOMAINS_REGEX = /^((cxserver|donate|dyna|foundation|lists|login|maps|outreach|phab|stats|toolsadmin|upload|wikitech|www)\.wikimedia.org)$/;

const EDIT_SUFFIX = 'action=edit';

function isMobile(match) {
    return match.groups.prefix.endsWith('.m');
}

function changeDomainToMobile(match) {
    return match.groups.prefix + '.m' + match.groups.suffix;
}

function changeDomainToDesktop(match) {
    return match.groups.prefix.substr(0, match.groups.prefix.length - 2) + match.groups.suffix;
}

function loadMobilePage(originalUrl, match) {
    const mobileUrl = new URL(changeDomainToMobile(match));
    location.href = mobileUrl.protocol + '//' + mobileUrl.host + mobileUrl.pathname + (originalUrl.search || '');
}

function switchToMobileOrBack(match) {
    const url = new URL(location.href);
    const altDomain = changeDomainToMobileOrBack(url);
    location.href = url.protocol + '//' + altDomain + url.pathname + (url.search || '');
}

function debugLog() {
    if (LOG_DEBUG_MESSAGES) {
        console.log.apply(null, arguments);
    }
}

function changeDomainToMobileOrBack(url) {
    const domain = url.hostname;
    const match = DOMAIN_REGEX.exec(domain);
    if (!match) {
        debugLog('Failed to convert domain:', domain);
        return domain;
    } else if (isMobile(match)) {
        return changeDomainToDesktop(match);
    } else {
        return changeDomainToMobile(match);
    }
}

function currentlyEditing() {
    const url = new URL(location.href);
    return (url.search.indexOf(EDIT_SUFFIX) !== -1 || url.hash.indexOf('#/editor/') != -1);
}

function switchToEditMode(match) {
    if (!currentlyEditing()) {
        const url = new URL(location.href);
        if (isMobile(match)) { // mobile: switch back to non-mobile page and add edit suffix
            location.href = url.protocol + '//' + changeDomainToMobileOrBack(url) + url.pathname + '?' + EDIT_SUFFIX;
        } else {
            location.href = url.protocol + '//' + url.host + url.pathname + '?' + EDIT_SUFFIX;
        }
    }
}

/**
 * Returns whether this is a history view of a page's changes, on a mobile Wiki.
 */
function isMobileSpecialHistoryPage(currentWiki) {
    return isMobile(currentWiki) && (location.href.indexOf('/Special:History/') !== -1);
}

/**
 * For a Special:History page, return the name of the Wiki page being examined.
 */
function extractPageNameFromSpecialHistoryPage(pathname) {
    const regex = /\/wiki\/Special:History\/(?<pagename>[^\/]+)\/?.*$/;
    const match = regex.exec(pathname);
    return match ? match.groups.pagename : null;
}

/**
 * An additional regex lets us disable the auto-switch behavior for some domains, like upload.wikimedia.org which doesn't have a .m version.
 */
function isMobileDisabledForThisDomain() {
    const url = new URL(location.href);
    const match = DISABLED_ON_DOMAINS_REGEX.exec(url.hostname);
    debugLog(`isMobileDisabledForThisDomain(${url.hostname}) -> ${!!match}`);
    return !!match;
}

(function() {
    'use strict';

    const url = new URL(location.href);
    const previousHref = document.referrer || '';
    const referrerWiki = FULL_URL_REGEX.exec(previousHref); // match object for the referrer
    const currentWiki = FULL_URL_REGEX.exec(location.href); // match object for the current address
    const disabledForDomain = isMobileDisabledForThisDomain(); // make sure we don't have an exclusion rule for this domain


    if (VIEW_HISTORY_IN_DESKTOP_MODE && isMobileSpecialHistoryPage(currentWiki)) { // extract domain and page, and redirect to full equivalent desktop page
        const nonMobileDomain = changeDomainToMobileOrBack(url);
        const pageName = extractPageNameFromSpecialHistoryPage(url.pathname);
        if (nonMobileDomain && pageName) {
            debugLog(`VIEW_HISTORY_IN_DESKTOP_MODE enabled, going to ${nonMobileDomain} for ${pageName} history`);
            const newUrl = `https://${nonMobileDomain}/w/index.php?title=${pageName}&action=history`;
            location.href = newUrl;
            return;
        }
    }

    if (AUTOLOAD_MOBILE) {
        const willSwitch = (currentWiki && !isMobile(currentWiki) && !disabledForDomain);
        if (!referrerWiki) { // referrer is *not* Wikimedia: make sure we hit the mobile website first
            if (willSwitch) { // First visit: switch to mobile by default
                loadMobilePage(url, currentWiki);
            }
        } else { // referrer is a Wikimedia site; check if it's a different language and switch to mobile if so
            const curLangMatch = LANGUAGE_REGEX.exec(location.href);
            const prevLangMatch = LANGUAGE_REGEX.exec(previousHref);
            if (curLangMatch && prevLangMatch && curLangMatch.groups.lang !== prevLangMatch.groups.lang) {
                debugLog(`Referrer is a Wikimedia site, but language went from ${ prevLangMatch.groups.lang } to ${ curLangMatch.groups.lang }. Will switch: ${ (willSwitch ? 'YES' : 'NO') }`);
                if (willSwitch) { // Language change: switch to mobile as if we came from a third-party website
                    loadMobilePage(url, currentWiki);
                }
            }
        }
    }

    /**
     * Validates that the event has either Alt or Ctrl set (but not both), but only if REQUIRE_MODIFIER_FOR_SHORTCUTS is set to true.
     * If it's false, validates that neither are set.
     */
    function hasModifierIfRequired(e) {
        if (REQUIRE_MODIFIER_FOR_SHORTCUTS) {
            return ((e.altKey || e.ctrlKey) && (e.altKey ^ e.ctrlKey)); // either, but not both.
        } else {
            return !(e.altKey || e.ctrlKey);
        }
    }

    function fieldAllowsInput(e) {
        const field = e.target;
        return (field.getAttribute("contenteditable") == "true") ||
               (field.tagName !== undefined && (field.tagName === 'TEXTAREA' || field.tagName === 'INPUT'));
    }

    function handleEvent(e) {
        if (!currentWiki) { // not on a Wikimedia website
            return;
        }
        if(currentlyEditing() || fieldAllowsInput(e)) { // not for edit modes, and not if the field is a text input
            return;
        }
        if (ENABLE_MOBILE_DESKTOP_SHORTCUT && hasModifierIfRequired(e) && e.code === 'KeyM') { // (ctrl-m or alt-m with modifiers, just "m" otherwise)
            switchToMobileOrBack(currentWiki);
        } else if (ENABLE_EDIT_SHORTCUT && hasModifierIfRequired(e) && e.code === 'KeyE') { // (ctrl-e or alt-e with modifiers, just "e" otherwise)
            debugLog('switching to edit mode');
            switchToEditMode(currentWiki);
        }
    }

    if (ENABLE_MOBILE_DESKTOP_SHORTCUT || ENABLE_EDIT_SHORTCUT) {
        addEventListener("keydown", handleEvent); // use keydown to catch shortcuts using modifier keys like ctrl or alt
    }

})();