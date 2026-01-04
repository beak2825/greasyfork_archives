// ==UserScript==
// @name         AO3 Tweaks
// @namespace    http://tampermonkey.net/
// @version      2024.11.10.1
// @description  Add fonts and computed stats
// @author       pianohacker@gmail.com
// @license      MPLv2
// @match        https://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/489745/AO3%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/489745/AO3%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addGFont = (...families) => {
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', 'https://fonts.googleapis.com/css?family=' + families.map((family)=>encodeURIComponent(family)).join('|'));
        document.head.prepend(link);
    };
    addGFont('Libre Baskerville', 'Libre Franklin');

    const querySelectorNumber = (parent, selector) => {
        const element = parent.querySelector(selector);
        if (!element) return NaN;

        return parseInt(element.innerText.replaceAll(',', ''));
    };

    const appendNewElement = (parent, tag, attributes, text) => {
        const el = document.createElement(tag);

        for (const [k, v] of Object.entries(attributes)) {
            el.setAttribute(k,v);
        }

        el.innerText = text;

        parent.appendChild(el);
    };

    const setupScrolling = (userStuff) => {
        const intersectionCallback = (entries) => {
            for (let e of entries) {
                e.target.classList.toggle("out-of-mind", !e.isIntersecting);
            }
        };
        const observer = new IntersectionObserver(intersectionCallback, {threshold: 1.0});
        for (let el of userStuff.children) observer.observe(el);

        const scrollDown = (e) => {
            const eligibleElementP = (el) => el.tagName != "P" || el.textContent.search(/\w/) != -1;

            const relX = e.clientX / window.innerWidth * 100;
            const relY = e.clientY / window.innerHeight * 100;

            if (relX > 25 && relX < 75) return;

            let nextEl;
            if (relY < 40) {
                nextEl = Array.from(userStuff.children).findLast((el) => eligibleElementP(el) && el.getBoundingClientRect().top < -window.innerHeight);
            } else {
                nextEl = Array.from(userStuff.children).find((el) => eligibleElementP(el) && el.getBoundingClientRect().bottom > window.innerHeight);
            }

            if (!nextEl) return;

            nextEl.scrollIntoView({behavior:"smooth"});
        };

        userStuff.addEventListener('click', scrollDown);
    };

    const changeBrToP = (p) => {
        let orig = p.outerHTML;
        if (!/<br>\s*<br>/.test(orig)) return;

        p.outerHTML = orig.split(/<br>\s*<br>/).join('</p><p>');
    };

    document.addEventListener('DOMContentLoaded', () => {

        appendNewElement(document.head, 'style', {}, `
#workskin .userstuff > * {
    transition: opacity 0.1s;
}

#workskin .userstuff .out-of-mind {
    opacity: 0.75;
}

img.logo {
    filter: grayscale(100%) brightness(6);
}

html, body {
    scroll-padding-top: .5em;
}
        `);

        for (let el of document.querySelectorAll("#chapters div.userstuff > p")) {
            changeBrToP(el);
        }

        for (let el of document.querySelectorAll("#chapters div.userstuff")) {
            setupScrolling(el);
        }

        const nf = new Intl.NumberFormat([], {
            roundingMode: 'ceil',
            minimumFractionDigits: 1,
            maximumFractionDigits: 2,
        });


        for (const stats of document.querySelectorAll('dl.stats')) {
            stats.replaceChildren(...Array.from(stats.childNodes).filter((node) => 
                                                                         !(node.nodeType == document.TEXT_NODE && node.textContent.trim() == '')
                                                                        ));

            const bookmarks = querySelectorNumber(stats, 'dd.bookmarks');
            const kudos = querySelectorNumber(stats, 'dd.kudos');
            const hits = querySelectorNumber(stats, 'dd.hits');

            const chapters = (() => {
                const el = stats.querySelector('dd.chapters');
                if (!el) return NaN;

                const [n, ] = el.innerText.split('/');

                return parseInt(n);
            })();

            const language = stats.querySelector('dd.language')?.getAttribute('lang');
            if (language == "en") {
                stats.removeChild(stats.querySelector('dt.language'));
                stats.removeChild(stats.querySelector('dd.language'));
            }

            appendNewElement(stats, 'dt', {className: 'likeability'}, 'Bookmarkability: ');
            appendNewElement(stats, 'dd', {className: 'likeability'}, `${Math.ceil(Math.log(bookmarks)/Math.log(hits)*100)}c`);

            appendNewElement(stats, 'dt', {className: 'likeability'}, 'Likeability: ');
            appendNewElement(stats, 'dd', {className: 'likeability'}, `${Math.ceil(Math.log(kudos)/Math.log(hits)*100)}c`);

        }
    });
})();