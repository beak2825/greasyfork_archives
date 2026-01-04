// ==UserScript==
// @name         UW Marmoset Scores Display
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show project scores on the course page so you don't need to click in to view
// @author       solstice23
// @match        https://marmoset.student.cs.uwaterloo.ca/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uwaterloo.ca
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484497/UW%20Marmoset%20Scores%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/484497/UW%20Marmoset%20Scores%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const newElement = (tag, content = '', attributes = {}) => {
        const element = document.createElement(tag);
        if (content) {
            element.innerHTML = content;
        }
        for (let attr in attributes) {
            element.setAttribute(attr, attributes[attr]);
        }
        return element;
    }

    const addColumn = (table) => {
        if (table.classList.contains('modded')) return;
        table.classList.add('modded');
        const tr = Array.from(table.querySelectorAll('tr'));
        const header = tr.shift();
        console.log(header, tr);
        header.appendChild(newElement('th', 'Score'));
        header.appendChild(newElement('th', 'Refresh'));
        tr.forEach((tr) => {
            tr.appendChild(newElement('td', '/', { class: 'score' }));
            tr.appendChild(newElement('td', '<button class="refresh">🔄</button>'));
            const btn = tr.querySelector('button.refresh');
            btn.addEventListener('click', async () => {
                btn.disabled = true;
                const tr = btn.closest('tr');
                await updateTr(tr, true);
                btn.disabled = false;
            });
        });

    }

    const getScore = async (projectPK, ignoreCache = false) => {
        const cacheKey = `projectPK-${projectPK}-score-cache`;
        if (!ignoreCache) {
            if (localStorage.getItem(cacheKey)) {
                return localStorage.getItem(cacheKey);
            }
        }
        const response = await fetch(`https://marmoset.student.cs.uwaterloo.ca/view/project.jsp?projectPK=${projectPK}`);
        const html = await response.text();
        const score = getLatestScore(html);
        localStorage.setItem(cacheKey, score);
        console.log(`Latest score for project ${projectPK} cached as ${score}`);
        return score;
    }

    const getLatestScore = (html) => {
        if (html instanceof HTMLElement) {
            html = html.outerHTML;
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const table = doc.querySelector('table');
        const tr = Array.from(table.querySelectorAll('tr'));
        if (tr.length < 2) return '/';
        const line = tr[1];
        const td = Array.from(line.querySelectorAll('td')).map((td) => td.innerHTML.trim());
        return `${td[2]} (#${td[0]})`;
    }


    const projectPage = () => {
        const projectPK = new URLSearchParams(window.location.search).get('projectPK');
        const score = getLatestScore(document.body.innerHTML);
        localStorage.setItem(`projectPK-${projectPK}-score-cache`, score);
        console.log(`Latest score for project ${projectPK} cached as ${score}`);
    }

    const coursePage = () => {
        const table = document.querySelector('table');
        addColumn(table);
        const tr = Array.from(table.querySelectorAll('tr')).slice(1);
        tr.forEach((tr) => {
			updateTr(tr);
		});
    }

    const updateTr = async (tr, ignoreCache = false) => {
        const projectPK = tr.querySelector('a[href*="project.jsp"]').href.match(/projectPK=(\d+)/)[1];
        const score = await getScore(projectPK, ignoreCache);
        tr.querySelector('.score').innerHTML = score;
    }


    const css = `
		button.refresh {
			border: none;
			padding: 0;
			margin: 0;
			outline: none;
			background: transparent;
			cursor: pointer;
		}
		button.refresh:hover {
			filter: brightness(0.9);
		}
		button[disabled] {
			cursor: default;
		}
	`;
    document.head.appendChild(newElement('style', css));


    const pathname = window.location.pathname;
    if (pathname.includes('course.jsp')) {
        coursePage();
    } else if (pathname.includes('project.jsp')) {
        projectPage();
    }
})();