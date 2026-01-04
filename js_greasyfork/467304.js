// ==UserScript==
// @name         Better Bing
// @namespace    bing
// @version      0.1
// @description  Change bing.com results to have the url shown after the title, also adds color to the urls for better readability and adds a favicon to the urls under the title. Based on `aligo/better-google` userscript.
// @author       aligo, adambh, tejaslodaya, drwonky, ZeroCool940711
// @license      MIT
// @supportURL   https://github.com/ZeroCool940711/Better-Bing-UserScript
// @match        https://www.bing.com/search?*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/467304/Better%20Bing.user.js
// @updateURL https://update.greasyfork.org/scripts/467304/Better%20Bing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var betterBingRow = function(el) {
        var linkEl = el.querySelector('.b_title > h2 > a') || el.querySelector('.b_algo > h2 > a') || el.querySelector('.b_imagePair.square_mp.reverse > h2 > a');
        var urlEl = el.querySelector('.tpcn');

        if (linkEl && urlEl) {
            var betterEl = document.createElement('div');
            betterEl.className = 'btrG';

            var betterLinkEl = document.createElement('a');
            betterLinkEl.href = linkEl.href;
            betterLinkEl.target = '_blank';
            betterLinkEl.className = 'btrLink';
            betterLinkEl.innerText = linkEl.innerText;

            var betterUrlEl = document.createElement('cite');
            betterUrlEl.className = 'btrUrl';
            betterUrlEl.innerHTML = urlEl.innerHTML.replace(/<br>.*$/, '');

            betterEl.appendChild(betterLinkEl);
            betterEl.appendChild(betterUrlEl);

            // Remove the original title element from btrG, if any
            var titleEl = betterEl.querySelector('.btrLink');
            if (titleEl) {
                betterEl.removeChild(titleEl);
            }

            // Insert the new div after the h2 element inside b_imagePair square_mp reverse
            var h2El = el.querySelector('.b_imagePair.square_mp.reverse > h2');
            if (h2El) {
                h2El.after(betterEl);
            } else {
                // Insert the new div after b_title if h2 element is not found
                el.querySelector('.b_title, h2').after(betterEl);
            }

            // Remove the original tpcn div
            urlEl.remove();
        }
    };

    var prevResultCount = 0;
    var bettered = false;

    var runBetterBing = function() {
        var b_results = document.getElementById('b_results');
        if (b_results) {
            var b_algo = b_results.querySelectorAll('.b_algo');
            if (b_algo.length > prevResultCount) {
                for (var i = prevResultCount; i < b_algo.length; i++) {
                    if (!b_algo[i].classList.contains('b_ans') && !b_algo[i].classList.contains('b_mop')) {
                        betterBingRow(b_algo[i]);
                    }
                }
                prevResultCount = b_algo.length;
            }
        }

        if (!bettered) {
            if (MutationObserver) {
                var searchEl = document.getElementById('b_content');
                var observer = new MutationObserver(runBetterBing);
                observer.observe(searchEl, { childList: true, subtree: true });
            }
            bettered = true;
        }
    };

    var prepareStyleSheet = function() {
        var style = document.createElement('style');
        style.setAttribute('media', 'screen');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        style.sheet.insertRule('.btrG .btrLink { display: block; font-size: 16px; color: #1a0dab; text-decoration: none; }');
        style.sheet.insertRule('.btrG .btrLink:hover { text-decoration: underline; }');
        style.sheet.insertRule('.btrG .btrUrl { display: block; font-size: 14px; color: #006621; }');
    };

    var checkElementThenRun = function(selector, func) {
        if (!document.querySelector(selector)) {
            if (MutationObserver) {
                var observer = new MutationObserver(function() {
                    var el = document.querySelector(selector);
                    if (el) {
                        observer.disconnect();
                        func();
                    }
                });
                observer.observe(document.documentElement, { childList: true, subtree: true });
            } else {
                document.addEventListener('readystatechange', function(e) {
                    if (document.readyState == 'complete') {
                        func();
                    }
                });
            }
        } else {
            func();
        }
    };

    checkElementThenRun('head', prepareStyleSheet);
    checkElementThenRun('#b_results', runBetterBing);
})();