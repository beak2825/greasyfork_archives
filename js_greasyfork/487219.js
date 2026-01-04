// ==UserScript==
// @name         Instagram non-English link redirector
// @description  Remove language codes (e.g. hl=fr) from Instagram URLs
// @match        https://www.instagram.com/*
// @version      0.3
// @author       mica
// @namespace    greasyfork.org/users/12559
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487219/Instagram%20non-English%20link%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/487219/Instagram%20non-English%20link%20redirector.meta.js
// ==/UserScript==

if (location.search.includes('hl') || location.search.includes('locale')) {
    location.replace(location.origin+location.pathname);
}
