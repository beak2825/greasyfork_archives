// ==UserScript==
// @name         Daily Stormer Article Image Fixer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fix the article image links for bbs.thegoyimknow.to
// @author       Perception
// @match        *://bbs.dailystormer.al/*
// @match        *://bbs.punishedstormer.com/*
// @match        *://bbs.thegoyimknow.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32616/Daily%20Stormer%20Article%20Image%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/32616/Daily%20Stormer%20Article%20Image%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // var replacement = 'https://' + location.hostname.replace(/^bbs./, '');
    var replacement = '';

    function fix(node) {
        $(node).find('.topic-body .contents img').each(function(i,x) {
            var fix = $(this).attr('src').replace(/http:\/\/dstormer6em3i4km.onion/, replacement);
            $(this).attr('src', fix);
        });
    }

    var observerOptions = { childList: true, subtree: true };
    var observer;

    var mutationHandler = function(mutations) {
        mutations.forEach(function(m) {
            if (m.type != 'childList') return;
            m.addedNodes.forEach(function(n) {
                if (n.nodeType != Node.ELEMENT_NODE) return;
                observer.disconnect();
                if (!n.isContentEditable) {
                    fix(n);
                }
                observer.observe(document.body, observerOptions);
            });
        });
    };

    fix(document.body);
    observer = new MutationObserver(mutationHandler);
    observer.observe(document.body, observerOptions);

})();