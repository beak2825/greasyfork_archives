
// ==UserScript==
// @name         Kanka SDK (dev)
// @namespace    https://greasyfork.org/en/users/1029479-infinitegeek
// @version      0.0.1-3
// @description  Tools for Kanking.
// @author       InfiniteGeek
// @supportURL   Infinite @ https://discord.gg/rhsyZJ4
// @license      MIT
// @match        https://app.kanka.io/w/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @keywords     kanka,sdk
// @grant        none
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

var _a, _b;
const emit_debug = (...args) => { };
//const emit_debug = console.log;
function getElementPromise(...selectorChain) {
    let intervalHandle;
    let doc;
    return new Promise((resolve, reject) => {
        const getElement = () => {
            if (!jQuery)
                return undefined;
            try {
                let lmnt = (doc !== null && doc !== void 0 ? doc : (doc = jQuery(document.documentElement)));
                const selectors = [...selectorChain];
                let selector = null;
                while (selector = selectors.shift()) {
                    lmnt = lmnt.find(selector);
                    if (!lmnt)
                        return undefined;
                }
                if (!lmnt)
                    return null;
                intervalHandle && clearInterval(intervalHandle);
                resolve(lmnt);
                return lmnt;
            }
            catch (error) {
                intervalHandle && clearInterval(intervalHandle);
                reject(error);
                return null;
            }
        };
        if (typeof MutationObserver) {
            // if we have the MutationObserver API, hook to document changes
            const observer = new MutationObserver(() => getElement() && observer.disconnect());
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
        else {
            // if not, use a sad timer
            intervalHandle = setInterval(getElement, 333);
        }
    });
}
const Api = {
    getXMLHttpRequest: (method) => {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open(method, Uri.buildUri(Entity.entityType, Entity.typedID), false);
        Api.headers.setCsrf(xhr);
        Api.headers.setXMLHttpRequest(xhr);
        return xhr;
    },
    headers: {
        setCsrf: (xhr) => xhr.setRequestHeader('x-csrf-token', Session.csrfToken),
        setXMLHttpRequest: (xhr) => xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest'),
    },
    createPostParams: () => {
        const params = new URLSearchParams();
        params.append('_token', Session.csrfToken);
        params.append('datagrid-action', 'batch');
        // this needs the plural
        params.append('entity', Entity.entityType);
        params.append('mode', 'table');
        // typedID is different from entityID
        params.append('models', Entity.typedID);
        params.append('undefined', '');
        return params;
    },
    fetch_success: async (response) => {
        var _a;
        emit_debug('Success:', response);
        window.showToast(response.statusText, 'bg-success text-success-content');
        return { ok: response.ok, document: (_a = $.parseHTML(await response.text())) !== null && _a !== void 0 ? _a : [] };
    },
    post: (url, body) => {
        return fetch(url, {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
        })
            .then(Api.fetch_success)
            .catch((error) => {
            console.error('Error:', error);
            window.showToast(error, 'bg-primary text-error-content');
            return { ok: false, document: [], error };
        });
    }
};
/**
 * Extract metadata from the classes on the <body>
 */
function parseBodyClasses(body) {
    const classes = Array.from(body.classList);
    const entity = { id: '', entityType: 'default', type: '' };
    const tags = [];
    const kankaClassRegex = /^kanka-(\w+)-(\w+)$/;
    let tempTag = null;
    function processTag(isValueNumeric, value) {
        // tags are emitted as id/name pairs
        // parent tags also end up in the list as ID-only entries
        // any name is associated with the ID prior
        if (isValueNumeric) {
            tempTag = value;
        }
        else if (tempTag !== null) {
            tags.push({ id: tempTag, entityType: value });
            tempTag = null;
        }
    }
    classes
        .map(className => className.match(kankaClassRegex))
        .filter(match => !!match)
        .forEach((match) => {
        const [, key, value] = match;
        const isValueNumeric = !isNaN(Number(value));
        switch (key) {
            // kanka-entity-{entityID} kanka-entity-{entityType}
            case 'entity':
                if (isValueNumeric) {
                    entity['id'] = value;
                }
                else {
                    entity['entityType'] = value;
                }
                break;
            // kanka-type-{typeValue}
            case 'type':
                entity.type = value;
                break;
            // kanka-tag-{id} kanka-tag-{name}
            case 'tag':
                processTag(isValueNumeric, value);
                break;
            default:
                console.warn("What's this? 💀🎃", match);
                break;
        }
    });
    return { entity, tags };
}
/**
 * Builds a comparison function for sorting by similarity to a provided term.
 * Intended for sorting typeahead results.
*/
/*
Example:
term: 'tre'
    "Treasure of the Sierra Madre" => 26 (starts with, case mismatch)
    "one tree hill" => 15 (includes, start of word, case match)
 */
function createMatchinessComparator(term, converter = item => item.toString()) {
    const locale = Intl.Collator().resolvedOptions().locale;
    const pattern = {
        startsWith: '^' + term,
        startsWord: '\\b' + term,
    };
    const regex = {
        startsWith: new RegExp(pattern.startsWith),
        startsWithI: new RegExp(pattern.startsWith, 'i'),
        startsWord: new RegExp(pattern.startsWord),
        startsWordI: new RegExp(pattern.startsWord, 'i'),
        includes: new RegExp(term),
        includesI: new RegExp(term, 'i'),
    };
    // assign a score based on how well the value matches the search term
    const computeMatchiness = (value) => {
        switch (true) {
            // exact match
            case value === term: return 30;
            // close match, just varying by accents and/or case
            case value.localeCompare(term, locale, { usage: 'search', sensitivity: 'variant' }) === 0: return 28;
            case value.localeCompare(term, locale, { usage: 'search', sensitivity: 'accent' }) === 0: return 27;
            case value.localeCompare(term, locale, { usage: 'search', sensitivity: 'case' }) === 0: return 26;
            case value.localeCompare(term, locale, { usage: 'search', sensitivity: 'base' }) === 0: return 25;
            // starts with (including case-insensitive)
            case regex.startsWith.test(value): return 20;
            case regex.startsWithI.test(value): return 18;
            // includes at the start of a word (including case-insensitive)
            case regex.startsWord.test(value): return 15;
            case regex.startsWordI.test(value): return 13;
            // includes anywhere (including case-insensitive)
            case regex.includes.test(value): return 10;
            case regex.includesI.test(value): return 9;
            // no match
            default: return 0;
        }
    };
    return (a, b) => {
        const textA = converter(a);
        const textB = converter(b);
        const scoreA = computeMatchiness(textA);
        const scoreB = computeMatchiness(textB);
        const relativeMatchiness = Math.sign(scoreB - scoreA);
        // sort by score, then alphabetically when equal
        // localeCompare impls may not be 1|0|-1 only
        return relativeMatchiness || textA.localeCompare(textB);
    };
}
const Uri = {
    rootUri: 'https://app.kanka.io',
    route: window.location.pathname,
    buildUri: (...segments) => [Uri.rootUri, 'w', Session.campaignID, ...segments].join('/'),
    getEditUri: () => document.querySelector('a[href$=edit]').getAttribute('href'),
    getEntityUri: () => document.querySelector('head link[rel=canonical]').getAttribute('href'),
};
const Session = {
    csrfToken: (_a = document.head.querySelector('meta[name="csrf-token"]')) === null || _a === void 0 ? void 0 : _a.getAttribute('content'),
    campaignID: (_b = Uri.route.match(/w\/(?<id>\d+)\//).groups.id) !== null && _b !== void 0 ? _b : '0',
};
const entityBits = Uri.getEntityUri().match(/w\/\d+\/entities\/(?<id>\d+)/);
const editBits = Uri.getEditUri().match(/\/(?<type>\w+)\/(?<id>\d+)\/edit$/);
const Entity = {
    /**
     *  this is the plural, not values from EntityType
     */
    entityType: editBits.groups.type,
    /**
     *  this is the 'larger' ID: entities/__[5328807]__ === characters/1357612
     */
    entityID: entityBits.groups.id,
    /**
     * this is the 'smaller' ID: entities/5328807 === characters/__[1357612]__
     */
    typedID: editBits.groups.id,
    meta: parseBodyClasses(document.body),
};
const EntityTypeAttributes = {
    /**
     * this encapsulates the definitions from the system
     * - some entities have a location, some don't
     * - some entities have a link in the header, some use the sidebar
     * - some entities can have multiple locations, some can't
     */
    hasLocation: ({
        default: {},
        character: { headerLink: true },
        location: { headerLink: true },
        map: { headerLink: true },
        organisation: { sidebarLink: true },
        family: { headerLink: true },
        creature: { sidebarLink: true, multiple: true },
        race: { sidebarLink: true, multiple: true },
        event: { sidebarLink: true },
        journal: { sidebarLink: true },
        item: { sidebarLink: true },
        tag: {},
        note: {},
        quest: {},
    }),
};
const Util = {
    createMatchinessComparator,
    getElementPromise,
    parseBodyClasses,
};
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
    Uri,
    Session,
    Entity,
    EntityTypeAttributes,
    Util,
    Api,
});

/******/ })()
;