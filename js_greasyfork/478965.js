// ==UserScript==
// @name         Sorting Companies Page
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  sort the company page on torn
// @author       Latinobull14 [2881384]
// @match        https://www.torn.com/joblist.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/478965/Sorting%20Companies%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/478965/Sorting%20Companies%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        const container = document.querySelectorAll('.listings')[1]
        const companies = Array.from(container.children)
        companies.pop()
        companies.sort((a,b) => {
        const textA = a.firstElementChild.textContent.trim()
        const textB = b.firstElementChild.textContent.trim()
        if (textA < textB) return -1
        if (textA > textB) return 1
        return 0
        })
        container.innerHTML = ''

        for (let li of companies) {
        container.append(li)
        }

    }, 500)

})();