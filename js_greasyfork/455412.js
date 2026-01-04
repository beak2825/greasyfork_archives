// ==UserScript==
// @name         wordSelect
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  word discover autoSelect!
// @author       @bpking
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455412/wordSelect.user.js
// @updateURL https://update.greasyfork.org/scripts/455412/wordSelect.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const upevt = new MouseEvent('mouseup', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    const downevt = new MouseEvent('mousedown', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    const selectWord = () => {
        if (document.querySelector('wdautohl-customtag')) {
            document.querySelectorAll('wdautohl-customtag').forEach(word => {
                word.onmouseover = () => {
                    const range = document.createRange();
                    //必须选中单词的前后空格，否则沙拉查词无法获取单词的上下文
                    if (word.previousSibling) {
                        range.setStart(word.previousSibling, word.previousSibling.length - 1);
                    } else {
                        range.setStart(word, 0);
                    }
                    if (word.nextSibling) {
                        range.setEnd(word.nextSibling, 1);
                    } else {
                        range.setEnd(word, word.length);
                    }

                    //console.log('range.toString()', range.toString());
                    window.getSelection().empty();
                    window.getSelection().addRange(range);
                    window.dispatchEvent(downevt);
                    window.dispatchEvent(upevt);
                    window.dispatchEvent(downevt);
                    window.dispatchEvent(upevt);
                };
            });

        }
    };

    const debounce = function (fn, timeout) {
        let timer;
        return function () {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                fn.apply();
            }, timeout);
        }
    }

    const observer = new MutationObserver(debounce(selectWord, 1000));
    const options = {
        'childList': true,
        'attributes': true,
        'characterData': true,
        'subtree': true
    }
    observer.observe(document.body, options);

})();