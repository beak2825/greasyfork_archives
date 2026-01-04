// ==UserScript==
// @name         AO3: [Wrangling] Lazy Click!
// @description  Clicking anywhere in the tag name's box selects that tag!
// @version      1.0.1

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/tags/*/wrangle*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446049/AO3%3A%20%5BWrangling%5D%20Lazy%20Click%21.user.js
// @updateURL https://update.greasyfork.org/scripts/446049/AO3%3A%20%5BWrangling%5D%20Lazy%20Click%21.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const tbody = document.getElementById("wrangulator").getElementsByTagName("tbody")[0]
    tbody.addEventListener("click", (e) => {
        if (!e.srcElement) return;
        let f = e.srcElement
        while (f) {
            if (f.tagName == "TH") {
                //Selects the check box
                const cbox = f.querySelector("input")
                cbox.checked = !cbox.checked
                return
            }
            //Cases where the user actually did click the tag's checkbox or text
            if (f.tagName == "INPUT" || f.tagName == "LABEL") {
                return
            }
            f = f.parentElement;
        }
    });
})();