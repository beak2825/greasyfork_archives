// ==UserScript==
// @name         知乎latex
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  单击显示latex原代码
// @author       letshaveFun
// @match        *://*.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/473137/%E7%9F%A5%E4%B9%8Elatex.user.js
// @updateURL https://update.greasyfork.org/scripts/473137/%E7%9F%A5%E4%B9%8Elatex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getSelected() {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (document.getSelection) {
            return document.getSelection().toString();
        } else {
            var selection = document.selection && document.selection.createRange();
            if (selection.text) {
                return selection.text.toString();
            }
            return "";
        }
    }

    function createDOMContentLoadedHandler() {
        const svg = document.querySelectorAll('.MathJax_SVG');
        const preview = document.querySelectorAll('.math-holder');

        if (svg.length){
            svg.forEach(e => {
                e.addEventListener('click', () => {
                        if (!e.dataset.clicked) {
                            if (!e.parentNode.classList.contains('MathJax_SVG_Display')) {
                                e.style.display = 'none';
                                e.nextElementSibling.nextElementSibling.style.display = 'inline';
                                e.nextElementSibling.nextElementSibling.innerText = '$' + e.parentNode.parentNode.dataset.tex + '$';
                                e.dataset.clicked = true;
                                if (e.nextElementSibling.nextElementSibling.dataset.clicked) {
                                    e.nextElementSibling.nextElementSibling.removeAttribute('data-clicked');
                                }
                            } else {
                                e.style.display = 'none';
                                e.parentNode.nextElementSibling.nextElementSibling.style.display = 'inline';
                                e.parentNode.nextElementSibling.nextElementSibling.innerText = '$$</br>' + e.parentNode.parentNode.parentNode.dataset.tex + '</br>$$';
                                e.dataset.clicked = true;
                                if (e.parentNode.nextElementSibling.nextElementSibling.dataset.clicked) {
                                    e.parentNode.nextElementSibling.nextElementSibling.removeAttribute('data-clicked');
                                }
                            }
                        }
                    }
                );
            });
        }

        if (preview.length){
            preview.forEach(e => {
                e.addEventListener('click', function() {
                    if (!getSelected()) {
                        if (!e.dataset.clicked) {
                            e.style.display = 'none';
                            e.parentNode.querySelector('.MathJax_SVG').style.display = 'inline';
                            e.dataset.clicked = true;
                            if (e.parentNode.querySelector('.MathJax_SVG').dataset.clicked) {
                                e.parentNode.querySelector('.MathJax_SVG').removeAttribute('data-clicked');
                            }
                        }
                    }
                });
            });
        }
    }

    document.addEventListener('DOMContentLoaded', createDOMContentLoadedHandler);
    new MutationObserver(createDOMContentLoadedHandler).observe(document.documentElement, {childList: true, subtree: true});
})();