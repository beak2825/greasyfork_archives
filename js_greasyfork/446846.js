// ==UserScript==
// @name         AO3: [Wrangling] Making the syn POP!!
// @description  Making the syn to stand out more, if it exists
// @version      1.0.1

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/tags/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446846/AO3%3A%20%5BWrangling%5D%20Making%20the%20syn%20POP%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/446846/AO3%3A%20%5BWrangling%5D%20Making%20the%20syn%20POP%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Accounting for possibly also using the 'AO3: [Wrangling] Save Changes at Top' script
    const orderonpage = document.getElementById("edit_tag").getElementsByTagName("fieldset")[0].getElementsByClassName("submit actions").length

    const thing = document.getElementById("edit_tag").getElementsByTagName("fieldset")[orderonpage] /* the "Tag Info" fieldset */.querySelector("ul.autocomplete");
    if (thing) {
        thing.style.color = "blue"
    }
    // Your code here...
})();