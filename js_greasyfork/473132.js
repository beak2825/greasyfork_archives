// ==UserScript==
// @name         Add PMID to each paper in the Paperpile Library View
// @namespace    https://slowkow.com
// @version      0.1
// @description  It should be easy to copy a paper's PMID.
// @author       Kamil Slowikowski
// @license      MIT
// @match        https://paperpile.com/app
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paperpile.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473132/Add%20PMID%20to%20each%20paper%20in%20the%20Paperpile%20Library%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/473132/Add%20PMID%20to%20each%20paper%20in%20the%20Paperpile%20Library%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        let papers = document.getElementsByClassName("pp-grid-content")

        for (let paper of papers) {
            let type = paper.getElementsByClassName("pp-grid-type")[0]

            let link = paper.getElementsByClassName("pp-link-db")[0]

            if (link) {
                let pmid = link.href.split('/').slice(-1)[0]

                type.style.setProperty('user-select', 'text')

                if (!type.innerHTML.includes(pmid)) {
                    type.innerHTML += `\tPMID: ${pmid}`
                }
            }
        }
    }, 2000)
})();