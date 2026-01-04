// ==UserScript==
// @name         Noodle Campus Product Links
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Shows the links to products in the Noodle Campus "Task board"
// @author       @Coder-256 (GitHub)
// @match        http*://www.noodlecampus.com/noodlecampus/a/taskmember/trTaskMember/taskNotice
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36715/Noodle%20Campus%20Product%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/36715/Noodle%20Campus%20Product%20Links.meta.js
// ==/UserScript==

// Credit (modified from original): http://ryanmorr.com/using-mutation-observers-to-watch-for-element-availability/ (retrieved 12/24/17)
(function(win) {
    'use strict';

    var listeners = [],
        //win = window,
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
                    console.log("calling fn of listener:", listener, "element:", element);
                    listener.fn.call(element, element);
                }
            }
        }
    }

    function myHandler(product) {
        if (product === undefined || product === null || !product.classList.contains("produce")) {
            return;
        }

        var url = product.querySelector(".productUrl").innerText.trim();
        var container = doc.createElement("DIV");
        container.classList.add("nothank"); // Same styling as the "No thanks" button
        var link = doc.createElement("A");
        link.href = url;
        link.target = "_blank";
        link.innerText = "Link";
        link.style.fontSize = "16px";
        container.appendChild(link);

        // Insert the link before the "Accept" button
        var acceptButton = product.querySelector(".wishbottom");
        product.insertBefore(doc.createElement("BR"), acceptButton);
        product.insertBefore(container, acceptButton);
    }

    //var products = win.document.querySelectorAll(".produce");
    //[].forEach.call(products, myHandler);
    ready(".produce", myHandler);
})(window);