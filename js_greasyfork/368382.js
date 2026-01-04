// ==UserScript==
// @name         cikk szó számláló
// @version      1.5
// @description  Megszámolja hány szó van a cikkben, és kiírja hogy kb hány perc elolvasni. Jelenleg 300 szó/perc van bedrótozva.
// @author       Lajos Sánta
// @match        https://index.hu/*
// @match        https://444.hu/*
// @match        https://www.portfolio.hu/*
// @match        https://qubit.hu/*
// @match        *.blog.hu/*
// @match        https://totalcar.hu/*
// @match        https://kiszamolo.hu/*
// @match        https://alapblog.hu/*
// @match        https://g7.24.hu/*
// @namespace    https://greasyfork.org/users/187325
// @downloadURL https://update.greasyfork.org/scripts/368382/cikk%20sz%C3%B3%20sz%C3%A1ml%C3%A1l%C3%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/368382/cikk%20sz%C3%B3%20sz%C3%A1ml%C3%A1l%C3%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeByTagName(element, name) {
        for (let child of element.getElementsByTagName(name)) {
            child.parentElement.removeChild(child);
        }
    }

    window.addEventListener('load', function() {
        let wordsPerMinute = 300;
        let selectors = [
            '.cikk-torzs', // index.hu
            '#content-main', // 444.hu
            '.smscontent', // portfolio.hu
            '.post__content', // qubit.hu
            'div.bloghu-controls ~ div div.entry', // blog.hu
            'div.cikk-torzs-container .cikk-torzs', // totalcar.hu
            '#content > article.post > div.entry.clearfix', // kiszamolo.hu
            '.entry-content', // alapblog.hu
            'body.post-template-default .container .content', // g7.24.hu
        ];
        let elements = document.querySelectorAll(selectors.join(', '));
        if (elements.length > 0) {
            console.log('article word counter found an element!');
            let origArticle = elements[0];
            let article = origArticle.cloneNode(true);
            // remove all unreadable tags
            removeByTagName(article, 'script');
            removeByTagName(article, 'img');
            let wordCount = article.textContent.split(/\s+/).length;
            let mins = Math.ceil(wordCount / wordsPerMinute);
            let feedback = document.createElement('p');
            feedback.innerHTML = `⏱ <i>${mins} perc (${wordCount} szó)</i>`;
            origArticle.insertBefore(feedback, origArticle.childNodes[0]);
        }
    }, true);
})();
