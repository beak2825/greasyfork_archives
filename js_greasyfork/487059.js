// ==UserScript==
// @name         Solved AC Highligter
// @version      1.4
// @author       refracta
// @description  Highlight unsolved problems
// @match        https://solved.ac/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=solved.ac
// @license      MIT
// @namespace https://greasyfork.org/users/467840
// @downloadURL https://update.greasyfork.org/scripts/487059/Solved%20AC%20Highligter.user.js
// @updateURL https://update.greasyfork.org/scripts/487059/Solved%20AC%20Highligter.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const getAllProblems = async(user) => {
        const url = `https://solved.ac/api/v3/search/problem?query=solved_by:${user}`;
        const first = await fetch(url).then(r => r.json());
        const count = Math.ceil(first.count / 50) - 1;
        let others = Array.from(new Array(count));
        others = await Promise.all(others.map((e, i) => fetch(`${url}&page=${i + 2}`).then(r => r.json())));
        return [first, ...others].map(e => e.items).flat();
    };

    const getSolvedProblemIds = async(users) => {
        return Array.from(new Set((await Promise.all(users.map(u => getAllProblems(u)))).flat().map(e => e.problemId))).sort((a, b) => a - b);
    }

    let solved;
    try {
        solved = await getSolvedProblemIds(['refracta', 'dongwook', 'csw0916', 'unta']);
        localStorage.solvedCache = JSON.stringify(solved);
    } catch (e) {
        solved = JSON.parse(localStorage.solvedCache);
    }

    const highlight =  () => {
        const problems = Array.from(document.querySelectorAll('a')).filter(e => e.href.endsWith(`problem/${e.textContent}`) && !solved.includes(parseInt(e.textContent)));
        for (const problem of problems) {
            problem.style.fontWeight = 'bold';
            // problem.style.color = 'blue';
        }
    }
    highlight();


    let previousUrl = '';
    const observer = new MutationObserver(function(mutations) {
        if (location.href !== previousUrl) {
            previousUrl = location.href;
            setTimeout(_ => highlight(), 100);
        }
    });
    const config = {subtree: true, childList: true};
    observer.observe(document, config);
})();