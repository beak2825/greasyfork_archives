// ==UserScript==
// @name        reddit default theme
// @description Disable reddit custom subreddits themes, fallback to the default one.
// @namespace   https://greasyfork.org/scripts/29326
// @include     http://www.reddit.com/*
// @include     https://www.reddit.com/*
// @include     http://np.reddit.com/*
// @include     https://np.reddit.com/*
// @include     http://xm.reddit.com/*
// @include     https://xm.reddit.com/*
// @version     2
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/29326/reddit%20default%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/29326/reddit%20default%20theme.meta.js
// ==/UserScript==
'use strict';

function find_and_delete_theme(node)
{
if (node.nodeType === Node.ELEMENT_NODE &&
    node.nodeName.toLowerCase() === 'link' &&
    node.getAttribute('rel') === 'stylesheet' &&
    node.getAttribute('title') === 'applied_subreddit_stylesheet') {
    node.parentNode.removeChild(node);
    return true;
    }
}

function delete_if_present()
{
    if (document.head) {
        for (var node of document.head.childNodes) {
            if (find_and_delete_theme(node))
            return true;
        }
    }
}

function delete_when_inserted()
{
    (new MutationObserver(function(records, observer) {
        for (var record of records) {
			for (var node of record.addedNodes) {
                if (find_and_delete_theme(node)) {
                    observer.disconnect();
                    return;
                }
            }
        }
    })).observe(document, {childList: true, subtree: true});
}

delete_if_present() || delete_when_inserted();