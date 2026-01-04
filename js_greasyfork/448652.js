// ==UserScript==
// @name         cohost descriptive page titles
// @namespace    https://github.com/adrianmgg
// @version      1.0.4
// @description  adds descriptive, dynamically updating titles to cohost pages, replacing the default "cohost!" for everything
// @author       amgg
// @match        https://cohost.org/*
// @icon         https://cohost.org/static/a4f72033a674e35d4cc9.png
// @grant        unsafeWindow
// @run-at       document-start
// @compatible   firefox
// @compatible   chrome
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448652/cohost%20descriptive%20page%20titles.user.js
// @updateURL https://update.greasyfork.org/scripts/448652/cohost%20descriptive%20page%20titles.meta.js
// ==/UserScript==

const rules = [
    [['pathname', '^/$', 'home']],
    [['pathname', '^/rc/project/following/?$', 'following']],
    [['pathname', '^/rc/project/notifications/?$', 'notifications']],
    [['pathname', '^/rc/tagged/(.*)$', '#$1']],
    [['pathname', '^/rc/search$', 'search: '], ['search', '^(.*)$', (match) => new URLSearchParams(match[1]).get('q') ]],
    [['pathname', '^/([^/]+)/?$', '@$1']],
    [['pathname', '^/[^/]+/posts/unpublished/?$', 'drafts']],
    [['pathname', '^/rc/project/followers/?$', 'followers']],
    [['pathname', '^/[^/]+/follow-requests/?$', 'follow requests']],
    [['pathname', '^/rc/user/settings/?$', 'settings']],
    [['pathname', '^/[^/]+/post/compose/?$', 'compose post']], // cohost does actually already have a different title for this one, "cohost - go ahead, make a post"
    [['pathname', '^/[^/]+/post/[^/]+/edit/?', 'edit post' ]],
    // readyState can be as early as `loading` in func, might need to let these be promises rather than executing immediately
    // TODO this gives "$display_name on cohost" for posts without titles, maybe do something else for that case?
    [['pathname', '^/[^/]+/post/[^/]+/?', () => document.head.querySelector('meta[property="og:title"]').content ]],
    [['pathname', '^/rc/content/tos/?$', 'terms of use']],
    [['pathname', '^/rc/content/privacy/?$', 'privacy notice']],
    [['pathname', '^/rc/content/community-guidelines/?$', 'community guidelines']],
    [['pathname', '^/rc/content/markdown-reference/?$', 'markdown cheatsheet']],
    // [['pathname', '^/rc/welcome/?$', '']], // just gonna leave this one with the default "cohost!"
    [['pathname', '^/rc/signup/?$', 'sign up']],
    [['pathname', '^/rc/project/edit/?$', 'edit profile']],
].map(rule => rule.map(([type, test, replacement]) => [type, new RegExp(test), replacement]) );
function location_to_title(location) {
    for(const rule of rules) {
        if(rule.every(([type, regex,]) => regex.test(location[type]))) {
            return rule.map(([type, regex, thing]) => {
                if(typeof thing === 'function') return thing(regex.exec(location[type]));
                else return location[type].replace(regex, thing);
            }).join('');
        }
    }
    return null;
}


// ======== ========

let expected_title = null;
let prev_location = null;
function title_needs_update() {
    // don't try to update the title if we haven't found the title node yet.
    if(title_node === null) return;
    // if url has changed, re-compute expected title
    if(prev_location !== unsafeWindow.location.href) {
        expected_title = location_to_title(unsafeWindow.location) ?? 'cohost!';
        prev_location = unsafeWindow.location.href;
    }
    // if current title doesn't match expected title, set it
    if(title_node.text !== expected_title) {
        title_node.text = expected_title;
    }
}


// ======== watching for title changes ========

function observer_chain_thing(child_node_name, child_observer_func) { // TODO filter function instead of child name?
    return (target) => {
        const observer = new MutationObserver((mutations, observer) => {
            for(const mutation of mutations) {
                if(mutation.type === 'childList') {
                    for(const node of mutation.addedNodes) {
                        if(node.nodeType === Node.ELEMENT_NODE && node.nodeName === child_node_name) {
                            child_observer_func(node);
                        }
                    }
                }
            }
        });
        for(const node of target.childNodes) {
            if(node.nodeType === Node.ELEMENT_NODE && node.nodeName === child_node_name) {
                child_observer_func(node);
            }
        }
        observer.observe(target, { childList: true });
    }
}

let title_node = null;
// this'll stop observing stuff if document.documentElement gets swapped out under our noses but i think it's probably safe to assume that won't happen
observer_chain_thing(
    'HEAD',
    observer_chain_thing(
        'TITLE',
        (node) => {
            title_node = node;
            const observer = new MutationObserver((mutations, observer) => {
                title_needs_update();
            });
            // `childList: true` is for when text nodes are added/removed,
            //  `characterData: true, subtree: true` is for when existing text nodes have their data changed
            observer.observe(node, { childList: true, characterData: true, subtree: true });
            // also call this once right away since this new title node probably came with a new title
            title_needs_update(node);
        },
    ),
)(document.documentElement);


// ======== watching for url changes ========

const History__replaceState = History.prototype.replaceState;
History.prototype.replaceState = function() {
    const ret = History__replaceState.apply(this, arguments);
    title_needs_update();
    return ret;
};

