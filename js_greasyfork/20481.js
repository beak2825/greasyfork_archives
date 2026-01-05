// ==UserScript==
// @name         Reddit New Comment Highlighting
// @description  Gold Feature
// @version      1
// @license      Public Domain
// @include      http*://*.reddit.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/47450
// @downloadURL https://update.greasyfork.org/scripts/20481/Reddit%20New%20Comment%20Highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/20481/Reddit%20New%20Comment%20Highlighting.meta.js
// ==/UserScript==

var HLN = HLN || {};

HLN.highlight = function(cutoff) {
    $('.entry').each(function() {
        var date = new Date($(this).find('time').attr('datetime')).getTime();
        if (date > cutoff) {
            $(this).addClass('newcomment');
        } else {
            $(this).removeClass('newcomment');
        }
    });
};

HLN.subreddit = function() {
    var match = /\/comments\/([a-z0-9]{6,})/.exec(window.location);
    return match != null ? match[1] : null;
};

HLN.lastvisit = function() {
    var subreddit = HLN.subreddit();
    if (subreddit != null) {
        var last = window.localStorage[subreddit + '-lastvisit'];
        if (last != null) {
            return parseFloat(last);
        } else {
            return null;
        }
    } else {
        return null;
    }
};

HLN.mark = function(time) {
    var subreddit = HLN.subreddit();
    if (subreddit != null) {
        return window.localStorage[subreddit + '-lastvisit']
            = time || Date.now();
    } else {
        return null;
    }
};

HLN.run = function() {
    var last = HLN.lastvisit();
    if (last) {
        HLN.highlight(last);
    }
    HLN.mark();
};

GM_addStyle(".newcomment div.md { background-color:#cee3f8; padding-left: 5px; padding-right: 5px }");

HLN.run();