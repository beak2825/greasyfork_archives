// ==UserScript==
// @name       Remove "Translate This Page" in Google Search Results
// @description Sometimes, there will be automatically translated pages on search results, which are annoying because their functionality tends to get broken in the process.
// @license MIT
// @version    1.0.0
// @author     Eichen
// @icon       https://www.google.com/favicon.ico
// @match      *.translate.goog/*
// @namespace https://greasyfork.org/users/859046
// @downloadURL https://update.greasyfork.org/scripts/535514/Remove%20%22Translate%20This%20Page%22%20in%20Google%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/535514/Remove%20%22Translate%20This%20Page%22%20in%20Google%20Search%20Results.meta.js
// ==/UserScript==

(function () {
    if(window.location.href.includes('.translate.goog/')) {
        let toRemove = window.location.href.replace('.translate.goog','');
        let toReplace = /https?:\/\/([w]{3}\.)?([a-zA-Z0-9-]+)(\.[a-zA-Z]{2,})?/.exec(toRemove)[0];
        let formattedStart = toReplace.substring(0, toRemove.indexOf('-')) + '.' + toReplace.substring(toRemove.indexOf('-') + 1)
        let formattedEnd = formattedStart.substring(0, formattedStart.lastIndexOf('-')) + '.' + formattedStart.substring(formattedStart.lastIndexOf('-') + 1)
        let replacedDomain = toRemove.replace(toReplace,formattedEnd)
        window.location.href = replacedDomain;
    }
})();