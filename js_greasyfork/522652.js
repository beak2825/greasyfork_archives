// ==UserScript==
// @name         公式等内容不翻译 notranslate
// @namespace    https://gist.github.com
// @version      1.0
// @description  浏览器翻译时排除代码片段
// @author       HW
// @match        *://**/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522652/%E5%85%AC%E5%BC%8F%E7%AD%89%E5%86%85%E5%AE%B9%E4%B8%8D%E7%BF%BB%E8%AF%91%20notranslate.user.js
// @updateURL https://update.greasyfork.org/scripts/522652/%E5%85%AC%E5%BC%8F%E7%AD%89%E5%86%85%E5%AE%B9%E4%B8%8D%E7%BF%BB%E8%AF%91%20notranslate.meta.js
// ==/UserScript==

// (function() {
//     'use strict';
//     // window.addEventListener('load', function() {
//     window.addEventListener('oncontextmenu', function() {
//         noTranslate(document.getElementsByTagName('pre'));
//         noTranslate(document.getElementsByClassName('gist'));
//         noTranslate(document.getElementsByClassName('CodeMirror-code'));
//     }, false);

//     function noTranslate(items) {
//         if (items && items.length > 0) {
//             for (var i = 0; i < items.length; i++) {
//                 items[i].classList.add('notranslate');
//             }
//         }
//     }
// })();


(function() {
    'use strict';
    const queries = [
        '.ref-cit',
        '.rqv-container-wrap',
        '.cit-list',
        '.c-article-references',
        '.c-reading-companion__reference-item',
        '.rqv-reference-list',
        '.useLabel',
        '.inline-ref-target',
        '.accordion__content',
        '.reference',
        '.references',
        'ref-content',
        '.article-paragraphs',
        '.bibliography',
        '.reference-body',
        '.f-open-dropdown',
        '.article.authors.open',
        '.citation-content',
        '.author'
    ];
    window.addEventListener('contextmenu', function() {
        queries.forEach(query => {
            const nodes = document.querySelectorAll(query);
            for (const node of nodes) {
                node.classList.add('notranslate');
            }
        });
        if (window.MathJax !== "undefined") {
            function mathNotrans() {
                for (const jax of MathJax.Hub.getAllJax()) {
                    jax.SourceElement().previousSibling.classList.add('notranslate');
                };
            };
            setInterval(mathNotrans, 1000);
        };
        // alert("💠 不翻译");
    }, false);
})();