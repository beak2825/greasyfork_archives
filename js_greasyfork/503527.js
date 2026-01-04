// ==UserScript==
// @name         Remove Axios "Headers" in News Articles
// @namespace    https://x.com/dadadaiyaa/
// @version      0.1.2
// @description  Remove annnoying headers like "Driving the news", "Zoom in", "Why it matters", etc. on Axios.
// @author       Daiya
// @match        https://www.axios.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=axios.com
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/503527/Remove%20Axios%20%22Headers%22%20in%20News%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/503527/Remove%20Axios%20%22Headers%22%20in%20News%20Articles.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let strongElms = document.querySelectorAll('div[data-vars-event-name="story_view"] strong');
    strongElms.forEach(element => {
        if (element.innerHTML.trim().endsWith(":")) element.remove();
    });
})();