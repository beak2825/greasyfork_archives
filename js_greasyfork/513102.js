// ==UserScript==
// @name         AOJv2 in ICPCJapanProblems
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ICPCJapanProblems の問題リンクを、AOJv3 のものから AOJv2 のものに変換します。
// @author       kanra824
// @match        https://icpc-japan-problems.irrrrr.cc/
// @match        https://icpc-japan-problems.irrrrr.cc/?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513102/AOJv2%20in%20ICPCJapanProblems.user.js
// @updateURL https://update.greasyfork.org/scripts/513102/AOJv2%20in%20ICPCJapanProblems.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const problem_table = document.getElementsByClassName("problem-table")[0];
    const problem_table_children = problem_table.children;
    const tbody_children = problem_table_children[1].children;
    for (const e of tbody_children) {
        // v3 -> https://onlinejudge.u-aizu.ac.jp/services/ice/?problemId={id}
        // v2 -> https://onlinejudge.u-aizu.ac.jp/challenges/search/titles/{id}
        const problem = e.children[2];
        const a = problem.firstElementChild;
        const url_v3 = a.href;
        const problem_id = new URL(url_v3).searchParams.get("problemId");
        const url_v2 = new URL("https://onlinejudge.u-aizu.ac.jp/challenges/search/titles/");
        url_v2.pathname += problem_id;
        a.href = url_v2.toString();
    }
})();