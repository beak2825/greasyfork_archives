// ==UserScript==
// @name         JIRA Helper
// @namespace    http://google.com/
// @version      0.2
// @description  Ease management
// @author       duongoku
// @match        https://insight.fsoft.com.vn/jira3/secure/Dashboard.jspa*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fsoft.com.vn
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/468626/JIRA%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/468626/JIRA%20Helper.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    while (!document.querySelector(".issue-table")) {
        await new Promise(r => setTimeout(r, 250));
    }

    function run() {
        let issues = Array.from(document.querySelectorAll(".issuerow"));
        for (let i = 0; i < issues.length; i++) {
            let issue = issues[i];
            let key = issue.querySelector(".issuekey").textContent.trim();
            let keyInDB = `assignee_of_${key}`;
            let assignee = issue.querySelector(".assignee");
            if (assignee.firstChild.id == "assigneeName") {
                break;
            }
            let assigneeName = document.createElement("input");
            assigneeName.type = "text";
            if (GM_getValue(keyInDB, null) == null) {
                assigneeName.value = "Chưa có";
            } else {
                assigneeName.value = GM_getValue(keyInDB, null);
            }
            GM_setValue(keyInDB, assigneeName.value);

            assigneeName.style.width = "110px";
            assigneeName.id = "assigneeName"
            assigneeName.onchange = function () {
                GM_setValue(keyInDB, assigneeName.value);
            }

            while (assignee.firstChild) {
                assignee.removeChild(assignee.firstChild);
            }
            assignee.appendChild(assigneeName);
        }
    }

    run();
    setInterval(run, 250);
})();