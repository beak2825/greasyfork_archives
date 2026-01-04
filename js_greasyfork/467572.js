// ==UserScript==
// @name         Civil Service Character count fix
// @include      https://cshr.tal.net/*
// @locale       en
// @version      1.5
// @description  Example to fix spacing on character count
// @author       Danny J Kendall
// @grant        none
// @namespace    https://greasyfork.org/users/169145
// @downloadURL https://update.greasyfork.org/scripts/467572/Civil%20Service%20Character%20count%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/467572/Civil%20Service%20Character%20count%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('A child node has been added or removed.');

                var emTags = document.getElementsByTagName('em');

                for (var i = 0; i < emTags.length - 1; i++) {
                    // Check if id of first <em> tag starts with 'form_'
                    if (emTags[i].id.startsWith('form_')) {
                        console.log(`First <em> tag id starts with 'form_': ${emTags[i].id}`);

                        // Add a space after the text between two <em> tags
                        var textNode = emTags[i].nextSibling;
                        if (textNode && textNode.nodeType === 3 && emTags[i+1].nodeName === 'EM') {
                            console.log(`Adding space after text between two <em> tags: '${textNode.nodeValue}'`);
                            textNode.nodeValue += ' ';
                        }
                    }
                }
            }
        }
    });

    // Configuration of the observer:
    var config = { childList: true, subtree: true };

    // Start observing the document with the configured parameters
    console.log('Starting to observe the document.');
    observer.observe(document, config);
})();
