// ==UserScript==
// @name         Github Load All Comments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically load all Github comments on page load
// @author       Aaron1011
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397376/Github%20Load%20All%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/397376/Github%20Load%20All%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Retrieve the form associated with the "X Hidden Items\nLoad More" button
    const form = document.querySelector('form.ajax-pagination-form');
    if (form) {
        // The first button, which has the text "X hidden items".
        const button = form.querySelector('button');
        if (button) {
            // Extract the number of hidden items from the button text
            const numberString = button.textContent.trim().split(' ')[0];
            if (numberString) {
                // Construct the new URL. This is undocumented, and may break at any time.
                // As of 12/08/2019, URLS look like this:
                // "/_render_node/MDExOlB1bGxSZXF1ZXN0MzMyNTc0Mjgz/timeline/more_items?variables%5Bafter%5D=Y3Vyc29yOnYyOpPPAAABbhuxRigCqjEwMTM5OTEwNjI%3D&variables%5Bbefore%5D=Y3Vyc29yOnYyOpPPAAABbzDoAogAqTU2ODM0NTgzNA%3D%3D&variables%5Bfirst%5D=60&variables%5BhasFocusedReviewComment%5D=false&variables%5BhasFocusedReviewThread%5D=false"
                // The key "variables[first]" in the URL query parameters appears to control
                // how many additional comments are fetched.
                // Github appears to always set this to 60, but it can be increased up to the
                // total number of hidden items.
                // By setting "variables[first]" to total number of hidden items (extracted from the button text),
                // we can fetch all hidden comments at once
                const url = new URL('https://github.com' + (form.getAttribute('action').toString() || ''));
                url.searchParams.set('variables[first]', numberString);
                form.setAttribute('action', url.toString());

                // Trigger a button click, causing the page to fetch and display
                // the hidden comments.
                // For some reason, trying to do this immediately (without setTimeout)
                // causes the browser to navigate to the actual URL (e.g. https://github.com//_render_node/...)
                // instead of triggering the proper Github event handler.
                // It seems likely that the event handler isn't yet registered when this function runs.
                // Delaying the button clock with setTimeout() appears to cause the event
                // handler to be consistently triggered, resulting in the desired behavior
                setTimeout(() => button.click(), 0);
            }
        }
    }
})();