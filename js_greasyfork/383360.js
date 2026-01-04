// ==UserScript==
// @name         atcoder-problem-navigator
// @namespace    https://github.com/yoshrc
// @version      1.3
// @description  Shows a navigation bar on AtCoder and Codeforces contest pages for jumping to problems.
// @author       yoshrc
// @include      https://atcoder.jp/contests/*
// @include      https://codeforces.com/contest/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383360/atcoder-problem-navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/383360/atcoder-problem-navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEY_PREFIX = 'atcoder-problem-navigator-';

    const do_atcoder = () => {
        const contest = location.href.match(/^https:\/\/atcoder\.jp\/contests\/([^\/?]+)/)[1];
        const key = KEY_PREFIX + 'atcoder-' + contest;

        if (location.href.match(/^https:\/\/atcoder\.jp\/contests\/([^\/]+)\/tasks\/?$/)) {
            const problems = [];
            const rows = document.querySelectorAll('tbody>tr');
            for (let i = 0; i < rows.length; i++) {
                const links = rows[i].querySelectorAll('a');
                const href = links[0].getAttribute('href');
                const text = links[0].textContent + ' - ' + links[1].textContent;
                problems.push({
                    href: href,
                    text: text
                });
            }
            localStorage[key] = JSON.stringify(problems);
        }

        if (key in localStorage) {
            let problems = JSON.parse(localStorage[key]);
            const problemsBar = document.createElement('ul');
            problemsBar.className = 'nav nav-tabs';
            for (let i = 0; i < problems.length; i++) {
                const link = document.createElement('a');
                link.setAttribute('style', 'margin-left: 10px; margin-right: 10px; white-space: nowrap');
                link.setAttribute('href', problems[i].href);
                link.textContent = problems[i].text;
                const span = document.createElement('span');
                span.textContent = ' ';
                span.appendChild(link);
                problemsBar.appendChild(span);
            }
            document.getElementById('contest-nav-tabs').appendChild(problemsBar);
        }
    };

    const do_codeforces = () => {
        const contest = location.href.match(/^https:\/\/codeforces\.com\/contest\/([^\/?]+)/)[1];
        const key = KEY_PREFIX + 'codeforces-' + contest;

        if (location.href.match(/^https:\/\/codeforces\.com\/contest\/([^\/]+)\/?$/)) {
            const problems = [];
            const rows = document.querySelectorAll('.problems>tbody>tr');
            // Starts from 1 to skip the header
            for (let i = 1; i < rows.length; i++) {
                const links = rows[i].querySelectorAll('a');
                const href = links[0].getAttribute('href');
                const text = links[0].textContent.trim() + '. ' + links[1].textContent;
                problems.push({
                    href: href,
                    text: text
                });
            }
            localStorage[key] = JSON.stringify(problems);
        }

        if (key in localStorage) {
            let problems = JSON.parse(localStorage[key]);
            const problemsBar = document.createElement('ul');
            problemsBar.setAttribute('style', 'margin-left: 15px; margin-right: 280px; padding-top: 30px');
            for (let i = 0; i < problems.length; i++) {
                const link = document.createElement('a');
                link.setAttribute('style', 'margin-right: 20px; white-space: nowrap');
                link.setAttribute('href', problems[i].href);
                link.textContent = problems[i].text;
                const span = document.createElement('span');
                span.textContent = ' ';
                span.appendChild(link);
                problemsBar.appendChild(span);
            }

            const content = document.getElementById('pageContent');
            content.parentNode.insertBefore(problemsBar, content);
        }
    };

    if (location.href.match(/^https:\/\/atcoder\.jp\/contests\//)) {
        do_atcoder();
    } else if (location.href.match(/^https:\/\/codeforces\.com\/contest\//)) {
        do_codeforces();
    }
})();
