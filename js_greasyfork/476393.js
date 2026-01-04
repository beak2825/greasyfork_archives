// ==UserScript==
// @name         IDNS Chat Enhanced
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Enables you to send messages without being limited for 3s after sending a message.
// @author       firetree
// @match        http://chat.idnsportal.com/*
// @icon         http://chat.idnsportal.com/icons/favicon-96x96.png
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/476393/IDNS%20Chat%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/476393/IDNS%20Chat%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const input = document.querySelector('.messageinput')
    const send = document.querySelector('a.link[href="#"]')

    const callback = () => {
        input.disabled = false
        input.focus()
    }

    const observer = new MutationObserver(callback)
    observer.observe(input, { attributes: true })

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
        }
    })
})();