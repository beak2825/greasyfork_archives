// ==UserScript==
// @name        atcoder-tasks-dropdown-menu-colorizer
// @namespace   https://twitter.com/KakurenboUni
// @version     1.0.1
// @require     https://greasyfork.org/scripts/437862-atcoder-problems-api/code/atcoder-problems-api.js?version=1004082
// @match       https://atcoder.jp/*
// @description Applies the same coloring as the atcoder-tasks-page-colorizer in the drop-down menu of tasks added by Comfortable AtCoder.
// @author      uni-kakurenbo
// @license     MIT
// @supportURL  https://twitter.com/KakurenboUni
// @downloadURL https://update.greasyfork.org/scripts/444170/atcoder-tasks-dropdown-menu-colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/444170/atcoder-tasks-dropdown-menu-colorizer.meta.js
// ==/UserScript==

getSubmissions(userScreenName).then(colorize);

function colorize(problems_info) {
    let tabs = document.querySelector(".nav-tabs").querySelectorAll("li");
    const tasks = [].find.call(tabs, (tab) => tab?.innerText.match(/問題|Tasks/ig));
    tasks.querySelector(".dropdown-menu")?.querySelectorAll("li")?.forEach((y) => {
        const problem_id = y.querySelector('a').getAttribute('href').split('/').pop();
        const trial = problems_info.filter(x => x.problem_id == problem_id);
        if(trial.length != 0) y.classList.add(trial.map(x => x.result).includes('AC') ? 'bg-success' : 'bg-warning');
    });
}
