// ==UserScript==
// @name         538 polls plus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Improves the Trump approval rating polls page on fivethirtyeight.com
// @author       michael@maurizi.org
// @match        https://projects.fivethirtyeight.com/trump-approval-ratings/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390996/538%20polls%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/390996/538%20polls%20plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const polls = document.querySelector('.polls');
    const table = polls.querySelector('.polls > table');
    const thead = polls.querySelector('.polls > table > thead');
    const tbody = polls.querySelector('.polls > table > tbody');
    const key = polls.querySelector('.polls > .polls-key');

    polls.style.overflowY = 'auto';
    polls.style.height = '800px';
    polls.style.position = 'relative';
    polls.style.width = '85%';
    polls.style.maxWidth = '800px';
    polls.style.margin = '20px auto';

    table.style.width = '100%';

    thead.style.position = 'sticky';
    thead.style.background = 'white';
    thead.style.zIndex = '1';
    thead.style.top = '0';
    thead.style.outline = '1px solid #222';

    key.style.position = 'sticky';
    key.style.bottom = '0';
    key.style.width = '100%';
    key.style.margin = '0 auto';
    key.style.maxWidth = '800px';
    key.style.background = 'white';
    key.style.paddingTop = '10px';

    function update() {
        for (let tr of tbody.children) {
            let grade = tr.querySelector('.gradeText');
            grade = grade ? grade.textContent : '';
            if (grade === 'A+') {
                tr.style.backgroundColor = 'rgb(255, 215, 0)';
            } else if (grade.startsWith('A')) {
                tr.style.backgroundColor = 'rgb(220, 220, 220)';
            } else {
                tr.style.backgroundColor = 'white';
            }
        }
    }

    const observer = new MutationObserver(function (mutationsList) {
        update();
    })

    update();
    observer.observe(tbody, { childList: true })

    function morePolls() {
        const more = document.querySelector('.polls .more-polls');
        if (more && more.style.display != 'none') {
            more.click();
            setTimeout(morePolls, 1);
        }
    }
    morePolls();
    setTimeout(() => {
        polls.scrollTop = 0;
    }, 1);

    const pastPolls = document.createElement('table');
    polls.append(pastPolls);
    pastPolls.style.position = 'absolute';
    pastPolls.style.left = '10px';
    pastPolls.style.right = '10px';
    pastPolls.style.border = '1px solid #ccc';
    pastPolls.style.boxShadow = '1px 1px #ccc';
    pastPolls.classList.add('past-polls')

    function showPastPolls(row) {
        if (row === null) {
            return;
        }

        const pollster = row.querySelector('.pollster').textContent;
        const polls = [];
        let tr = row.nextElementSibling;
        while (polls.length < 5 && tr) {
            const trPollster = tr.querySelector('.pollster').textContent;
            if (!tr.matches('.hidden') && pollster === trPollster) {
                polls.push(tr.outerHTML);
            }
            tr = tr.nextElementSibling;
        }
        pastPolls.innerHTML = polls.join('');
    }
    polls.addEventListener('mousemove', (e) => {
        let elem = document.elementFromPoint(e.clientX, e.clientY);
        if (elem && !elem.matches('tr')) {
            elem = elem.closest('tr');
        }

        if (elem === null || elem.closest('.past-polls')) {
            pastPolls.innerHTML = '';
            return;
        }
        showPastPolls(elem);
        if (elem.offsetTop - polls.scrollTop > 630) {
            pastPolls.style.top = elem.offsetTop - pastPolls.offsetHeight + 'px';
        } else {
            pastPolls.style.top = elem.offsetTop + elem.offsetHeight + 'px';

        }
        pastPolls.style.width = elem.offsetWidth - 20 + 'px';
    });
    polls.addEventListener('mouseleave', (e) => {
        pastPolls.innerHTML = '';
    });
})();