// ==UserScript==
// @name         AtCoder quickly check fastest codes
// @namespace    https://github.com/zica87/self-made-userscipts
// @version      1.0
// @description  Add buttons on My Submissions page to view the fastest C++ submissions of the problem you submitted.
// @author       zica
// @match        https://atcoder.jp/contests/*/submissions/me*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/499102/AtCoder%20quickly%20check%20fastest%20codes.user.js
// @updateURL https://update.greasyfork.org/scripts/499102/AtCoder%20quickly%20check%20fastest%20codes.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const rows = document.getElementsByTagName("tbody")[0].children;
    for (const row of rows) {
        const problem_title_cell = row.children[1];
        // https://atcoder.jp/contests/typical90/tasks/typical90_ax
        const problem_url = problem_title_cell.firstChild.href;
        const last_slash = problem_url.lastIndexOf("/");
        // typical90_ax
        const problem_code = problem_url.substring(last_slash + 1);
        const last2_slash = problem_url.lastIndexOf("/", last_slash - 1);
        // https://atcoder.jp/contests/typical90
        const prefix = problem_url.substring(0, last2_slash);
        const result_url = `${prefix}/submissions?f.LanguageName=C%2B%2B&f.Status=AC&f.Task=${problem_code}&orderBy=time_consumption`;
        const button = document.createElement("button");
        Object.assign(button, {
            textContent: "rankings",
            className: "btn label",
            onclick: () => {
                window.open(result_url, "_blank");
            },
        });
        button.style.cursor = "alias";
        // execution time cell
        row.children[7].append(button);
    }
})();
