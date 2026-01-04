// ==UserScript==
// @name         JPDB add review button in vocabulary
// @namespace    jpdb.io
// @version      0.2
// @description  Adds a button to force-review a word from its vocabulary page in JPDB
// @author       daruko
// @match        https://jpdb.io/vocabulary/*/*
// @match        https://jpdb.io/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472063/JPDB%20add%20review%20button%20in%20vocabulary.user.js
// @updateURL https://update.greasyfork.org/scripts/472063/JPDB%20add%20review%20button%20in%20vocabulary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll(".result.vocabulary").forEach(entry => {
        const menu = entry.querySelector(".menu");
        const v = entry.querySelector("form.link-like input[name='v']")?.value;
        const s = entry.querySelector("form.link-like input[name='s']")?.value;
        const href = `/review?c=vf,${v},${s}`;
        if (menu && s && v) {
            menu.after(createLink(href));
        }
    });

    function createLink(href) {
        const wrapper = document.createElement("div");
        const a = document.createElement("a");
        a.href = href;
        a.appendChild(document.createTextNode("Review"));
        wrapper.appendChild(a);
        return wrapper;
    }
})();
