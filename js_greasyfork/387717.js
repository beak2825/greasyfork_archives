// ==UserScript==
// @name         Remove Redundant URL Search Parameters
// @namespace    https://github.com/livinginpurple
// @version      2019.08.03.14
// @description  Remove Redundant URL Search Parameters like fbclid
// @author       livinginpurple
// @license      WTFPL
// @exclude      https://*.google.com/*
// @exclude      https://*.facebook.com/*
// @exclude      https://www.plurk.com/*
// @include 	 *
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/387717/Remove%20Redundant%20URL%20Search%20Parameters.user.js
// @updateURL https://update.greasyfork.org/scripts/387717/Remove%20Redundant%20URL%20Search%20Parameters.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log(GM_info.script.name + " is loading.");;
    let TotalReplaceUri = location.href.split("?")[0];
    let FirstSearchParameter = location.search.split('&')[0];
    let PartialReplaceUri = TotalReplaceUri + FirstSearchParameter;
    let keywords = ["fbclid", "jobsource", "from=fb", "f=cs", "gclid", "utm_", "from=udn"];

    keywords.forEach(element => {
        if (location.href.includes(element)) {
            ModifyUrl(TotalReplaceUri);
        }
    });

    if (PartialReplaceUri.includes("fbclid") && !FirstSearchParameter.includes("fbclid")) {
        ModifyUrl(PartialReplaceUri);
    }

    function ModifyUrl(replaceUri) {
        // 修改網址，且不留下歷史紀錄
        window.history.replaceState({},
            window.title,
            replaceUri
        );
    }
    console.log(GM_info.script.name + " is running.");
})(document);