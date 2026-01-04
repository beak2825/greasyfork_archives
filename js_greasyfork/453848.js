// ==UserScript==
// @name         Good-bye ZenHub
// @version      0.1.0
// @description  When you open zenhub issue URL, jump to github issue URL if you don't have a zenhub license like me (I migrated github projects 2022/10).
// @author       bigwheel
// @match        https://app.zenhub.com/*
// @grant        none
// @namespace    bigwheel.dev
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453848/Good-bye%20ZenHub.user.js
// @updateURL https://update.greasyfork.org/scripts/453848/Good-bye%20ZenHub.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    if (document.evaluate("//h1[contains(., 'You have not been assigned a license')]", document, null, XPathResult.ANY_TYPE, null )) {
        let match = new RegExp('https://app.zenhub.com/workspaces/[^/]+/issues/(?<org>[^/]+)/(?<repo>[^/]+)/(?<issue_num>[^/]+)').exec(location.href);
        location.href = `https://github.com/${match.groups.org}/${match.groups.repo}/issues/${match.groups.issue_num}`;
    }
}, false);
