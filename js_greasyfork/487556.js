// ==UserScript==
// @name         Trello Card Counter
// @namespace    https://trello.com/
// @version      1.1
// @description  Show number of cards in a list next to the list's name.
// @author       Vishal Patel
// @match        https://trello.com/*
 // @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/487556/Trello%20Card%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/487556/Trello%20Card%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let TRELLO_URLS_REGEX = /^https:\/\/trello\.com\/b\/.*/;
    let observer = null;

    function updateCounts() {
        document.querySelectorAll('[data-testid="list"]').forEach((t_list) => {
            let list_count = t_list.querySelectorAll('li').length;
            let list_name = t_list.querySelector('[data-testid="list-name"]').nextSibling.value;
            let count_span = '<span style="display: inline-block; position: absolute; right: 0px; padding-left: 5px; padding-right: 5px; background: rgb(120 120 120 / 50%); border-radius: 5px">'+list_count+'</span>';
            t_list.querySelector('h2').innerHTML = list_name+count_span;
        });
    }

    function startObserver() {
        observer = new MutationObserver(mutations => {
            for(let mutation of mutations) {
                if (mutation.target.nodeName === 'OL' && mutation.target.attributes[1].value === 'list-cards') {
                    updateCounts();
                }
            }
        });

        document.querySelectorAll('[data-testid="list"]').forEach((t_list) => {
            observer.observe(t_list, {childList: true, subtree: true});
        });

        updateCounts();
    }

    function observeLists() {
        // We only want to observe lists if we are in a Trello board
        const regex = new RegExp(TRELLO_URLS_REGEX);

        if (regex.test(window.location.href)) {
            if (observer !== null) {
                observer.disconnect();
                observer = null;
            }
            setTimeout(() => {
                startObserver();
            }, 1000);

        } else if (observer != null) {
            observer.disconnect();
            observer = null;
        }
    }

    function observeURL() {
        const regex = new RegExp(TRELLO_URLS_REGEX);
        window.addEventListener('pushstate', function () {
            observeLists();
        });

        // Popstate is never executed in Chrome, but
        // just in case it executes in other browsers:
        window.addEventListener('popstate', function () {
            observeLists();
        });
    }

    window.onload = () => {
        observeLists(); // First init.
        observeURL(); // If the user moves between boards.
    }

})();