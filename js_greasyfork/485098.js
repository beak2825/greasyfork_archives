// ==UserScript==
// @name         Qwant Keyboard Shortcuts
// @namespace    http://github.com/mirdevilar
// @version      1.0.0
// @description  Adds two keyboard shortcuts. Default '/' key to select search field to start typing again. And default 'Enter' key to open first search result. Has some incorrect behaviour in very weird use cases like: after a search, selecting the search field again and hitting enter without having changed the search query
// @author       alekarhis
// @match        *://*.qwant.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qwant.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485098/Qwant%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/485098/Qwant%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

(() => {

    console.log('qwant shortcuts running');
    'use strict';

    // KEY CODES REFERENCES:
    //	 Mozilla Docs: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
    //   Handy web app: https://keyjs.dev/
    const keys = {
        focusSearch: "/",
        openFirstResult: "Enter"
    }

    const queries = {
        searchInput: 'input',
        firstResult: 'section._1jQTj div._2NDle div._35zId a'
    }

    document.onkeypress = (e) => {

        if (e.key === keys.focusSearch) {
            const input = document.querySelector(queries.searchInput)

            if (document.activeElement !== input) {
                e.preventDefault()
                input.focus()
            }
        } else if (e.key === keys.openFirstResult) {
            e.preventDefault()
            const link = document.querySelector(queries.firstResult)
            const input = document.querySelector(queries.searchInput)

            console.log(document.activeElement)

            if ((document.activeElement !== input) && link) {
                console.log(link)
                location.href = link.href
            }
        }
    }
})();

