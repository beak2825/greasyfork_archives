// ==UserScript==
// @name         IL++
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Poistaa Iltalehden sivuilta linkit mitä ei halua, sekä korvaa clickbait-otsikot artikkelin alulla.
// @author       X.com/bjornlite
// @match        https://*.iltalehti.fi/*
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542208/IL%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/542208/IL%2B%2B.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(() => {
    const getRealTitle = async (url, titleEl) => {
        titleEl.innerHTML = '';
        const res = await fetch(url);
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const article = [...doc.querySelectorAll('div.article-body > p.paragraph')].slice(0,2);
        const articleText = article.forEach(p => {titleEl.appendChild(p)});
    };

    const eikiinnosta = [
        'jaakiekko', 'jalkapallo', 'ruoka-artikkelit',
        'yleisurheilu', 'nhl', 'viihde',
        'koripallo', 'tennis', 'streetstyle',
        'kuninkaalliset', 'musiikki', 'muoti'
    ];

    const rm = () => {
        if (document.getElementsByTagName('html')[0].className === 'sp-message-open') {
            document.getElementsByTagName('html')[0].className='';
        }
        [...document.querySelectorAll('svg.plus-svg'), ...document.querySelectorAll('svg.plus-extra-svg')]
            .map(node => {
            const search = n => n?.tagName?.toLowerCase() === 'a' ? n : search(n.parentNode);
            return search(node);
        })
            .forEach(node => node.parentNode.removeChild(node));
        [...document.getElementsByTagName('a')]
            .filter(a => {
            const url = new URL(a.href);
            return !!eikiinnosta.find(tyyppi => url.pathname.startsWith(`/${tyyppi}`));
        })
            .forEach(node => node.parentNode.removeChild(node));
        [['a:has(a6)', 'h6'], ['a:has(.front-title)', 'div.front-title'], ['a.article-container', 'div.title']]
            .forEach(([q1, q2]) => {
            [...document.querySelectorAll(q1)]
                .forEach(el => {
                if (el.__processed) { return; }
                const titleEl = el.querySelector(q2);
                if (!titleEl) {
                    console.log('null title:', {el, titleEl});
                }
                el.__processed = true;
                getRealTitle(el.href, titleEl)
            });
        });
    };
    rm();
    setInterval(rm, 1000);
})();
