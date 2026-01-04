// ==UserScript==
// @name         Apple Developer Documentation - UI Cleanup
// @namespace    https://www.raisen.dev/
// @version      0.1
// @description  Make the Apple Developer Documentation more user friendly with links to each subsection
// @author       Raisen
// @match        https://developer.apple.com/documentation/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407626/Apple%20Developer%20Documentation%20-%20UI%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/407626/Apple%20Developer%20Documentation%20-%20UI%20Cleanup.meta.js
// ==/UserScript==

(function() {
    'use strict';

var origPushState = history.pushState;

var numTriesChangeHeader = 0;
function changeHeader() {
    const retryOrLeave = () => {
        if(numTriesChangeHeader++ < 3) {
            return window.setTimeout(changeHeader, 1000);
        }
    }
    const currentItem = document.querySelector('.current.item');
    if(!currentItem) return retryOrLeave();

    currentItem.style.cursor = 'pointer';
    currentItem.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo(0,0);
    });
    document.querySelector('main > div.topictitle').style.width = '80%';
    document.querySelector('main > div.row').style.width = '80%';
}

var numTriesRun = 0;
function run() {
    const retryOrLeave = () => {
        if(numTriesRun++ < 3) {
            return window.setTimeout(run, 1000);
        }
        console.warn('giving up');
    }
    const h3s = document.querySelectorAll('h3.title');
    if(!h3s) { return retryOrLeave(); }

    const summary = document.querySelector('.summary-section nav:last-child ul.summary-list');
    if(!summary) { return retryOrLeave(); }

    const li = summary.querySelector('li');
    if(!li) { return retryOrLeave(); }

    h3s.forEach((h3,ix) => {
        const li2 = li.cloneNode(true);
        li2.querySelector('span').textContent = h3.textContent;
        const _a = li2.querySelector('a')
        const a = _a.cloneNode(true);
        a.setAttribute('href', '#');
        a.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            h3.classList.add('header' + ix);
            window.scrollBy(h3.getBoundingClientRect().x, h3.getBoundingClientRect().y - 100);
            origPushState.apply(history, [{}, "", "#header" + ix]);
            return true;
        });
        _a.parentNode.replaceChild(a, _a);

        summary.appendChild(li2);
    });

    document.querySelectorAll('.summary-section nav:last-child ul.summary-list a').forEach(a => a.classList.remove('link'));
}
window.addEventListener('hashchange', () => {
    if(!window.location.hash) {
        window.scrollTo(0,0);
    }
    let matches = window.location.hash.match(/#header(\d*)/);
    if(matches && matches.length === 2) {
        let ix = matches[1];
        const h3 = document.querySelector('.header' + ix);
        window.scrollBy(h3.getBoundingClientRect().x, h3.getBoundingClientRect().y - 100);
    }
});
run();
changeHeader();

history.pushState = function(...args) {
    numTriesRun = 0;
    numTriesChangeHeader = 0;
    origPushState.apply(history, args);
    setTimeout(() => {
      run();
      changeHeader();
    }, 500);
}

})();
