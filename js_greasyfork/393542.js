// ==UserScript==
// @name          Remove editability on click from trello card details
// @namespace     https://github.com/danbozaru
// @version       1.1.0
// @description   Removes click to edit behavior from card detail descriptions within modals.
// @author        danbozaru
// @include       https://trello.com/*
// @run-at        document-start
// @grant         GM_log
// @downloadURL https://update.greasyfork.org/scripts/393542/Remove%20editability%20on%20click%20from%20trello%20card%20details.user.js
// @updateURL https://update.greasyfork.org/scripts/393542/Remove%20editability%20on%20click%20from%20trello%20card%20details.meta.js
// ==/UserScript==

(function(win) {
    'use strict';

    var listeners = [],
        doc = win.document,
        MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
        observer;

    function ready(selector, fn) {
        // Store the selector and callback to be monitored
        listeners.push({
            selector: selector,
            fn: fn
        });
        if (!observer) {
            // Watch for changes in the document
            observer = new MutationObserver(check);
            observer.observe(doc.documentElement, {
                childList: true,
                subtree: true
            });
        }
        // Check if the element is currently in the DOM
        check();
    }

    function check() {
        // Check the DOM for elements matching a stored selector
        for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
            listener = listeners[i];
            // Query for elements matching the specified selector
            elements = doc.querySelectorAll(listener.selector);
            for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
                element = elements[j];
                // Make sure the callback isn't invoked with the
                // same element more than once
                if (!element.ready) {
                    element.ready = true;
                    // Invoke the callback with the element
                    listener.fn.call(element, element);
                }
            }
        }
    }

    // Expose `ready`
    win.ready = ready;
})(this);

window.ready('.current.markeddown', node => {
    node.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
    });
});