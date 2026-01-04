// ==UserScript==
// @name         Merge Request Insert Checklist
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Add checklist to merge request description
// @author       Ian Yu
// @match        *://*/*/*/webspi.mobileapp/-/merge_requests/*
// @match        *://*/*/*/web.Star4/-/merge_requests/*
// @icon         https://as1.ftcdn.net/v2/jpg/02/50/19/06/1000_F_250190680_FaQlxUQsR6KenIkA0NBX02pFU5PJj8Po.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485581/Merge%20Request%20Insert%20Checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/485581/Merge%20Request%20Insert%20Checklist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function insertChecklist() {
        const element = document.getElementById('merge_request_description');
        if (element && !element.value.includes('Checklists')) {
            if(location.href.includes("web.Star4")) {
              element.value += `
## Merge Request Checklists
- [ ] Star4PartialView gv compatibility(Avoid problems caused by the SBK cache)
- [ ] window.App method compatibility
- [ ] Whether there is update downloadApp(follow deploy SOP)
`;
            }
            else {
              element.value += `
## Merge Request Checklists
- [ ] API Version Compatibility
`
;
            }
        }
    }


    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                insertChecklist();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();