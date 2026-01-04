// ==UserScript==
// @license MIT
// @name         cf shortest codes
// @namespace    http://tampermonkey.net/
// @version      2024-04-02
// @description 添加claude编写的快捷跳转朋友排名、c++、py最短代码的按钮。
// @author       apxitye,claude
// @match        https://codeforces.com/*/problem/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/491462/cf%20shortest%20codes.user.js
// @updateURL https://update.greasyfork.org/scripts/491462/cf%20shortest%20codes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    const contestId = url.pathname.split('/').find(part => !isNaN(parseInt(part)));
    const problemId = url.pathname.split('/').pop().toUpperCase();
    //friends standings
    let Btn = document.createElement('li');
    Btn.innerHTML = `<a href="https://codeforces.com/contest/${contestId}/standings/friends/true" target="_blank">Friends Standings</a>`;
    Btn.classList.add('Btn')
    document.querySelector(".second-level-menu-list").appendChild(Btn);
    //py
    const friendBtn = document.createElement('li');
    friendBtn.innerHTML = `<a href="${url.origin}/contest/${contestId}/status/?order=BY_PROGRAM_LENGTH_ASC" target="_blank" id="shortestCodeLink">py</a>`;
    friendBtn.classList.add('friendBtn');
    document.querySelector(".second-level-menu-list").appendChild(friendBtn);

    document.getElementById('shortestCodeLink').addEventListener('click', (e) => {
        e.preventDefault();

        const newWindow = window.open(e.currentTarget.href, '_blank');
        newWindow.addEventListener('load', () => {
            const form = newWindow.document.querySelector('.status-filter');
            if (form) {
                form.querySelector('#frameProblemIndex').value = problemId;
                form.querySelector('#verdictName').value = 'OK';
                form.querySelector('#programTypeForInvoker').value = 'python.3';
                form.querySelector('#comparisonType').value = 'NOT_USED';
                form.querySelector('#participantSubstring').value = '';
                form.submit();
            }
        }, { once: true });
    });
    //c++17
    const friendBtn2 = document.createElement('li');
    friendBtn2.innerHTML = `<a href="${url.origin}/contest/${contestId}/status/?order=BY_PROGRAM_LENGTH_ASC" target="_blank" id="shortestCodeLink2">c++</a>`;
    friendBtn2.classList.add('friendBtn');
    document.querySelector(".second-level-menu-list").appendChild(friendBtn2);

    document.getElementById('shortestCodeLink2').addEventListener('click', (e) => {
        e.preventDefault();

        const newWindow = window.open(e.currentTarget.href, '_blank');
        newWindow.addEventListener('load', () => {
            const form = newWindow.document.querySelector('.status-filter');
            if (form) {
                form.querySelector('#frameProblemIndex').value = problemId;
                form.querySelector('#verdictName').value = 'OK';
                form.querySelector('#programTypeForInvoker').value = 'cpp.g++17';
                form.querySelector('#comparisonType').value = 'NOT_USED';
                form.querySelector('#participantSubstring').value = '';
                form.submit();
            }
        }, { once: true });
    });

})();