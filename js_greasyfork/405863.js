// ==UserScript==
// @name         Shuffle Douban iSay
// @namespace    https://www.douban.com/people/MoNoMilky/
// @version      0.2.1
// @description  Your brain is strange and strong, interesting.
// @author       Bambooom
// @match        https://*.douban.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405863/Shuffle%20Douban%20iSay.user.js
// @updateURL https://update.greasyfork.org/scripts/405863/Shuffle%20Douban%20iSay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // post a status
    var btnContainer = document.querySelector('#db-isay .btn');
    if (btnContainer) {
        let submitBtn = document.querySelector('#db-isay .btn .bn-submit');
        let reorderBtn = document.createElement('span');
        btnContainer.insertBefore(reorderBtn, submitBtn);
        reorderBtn.classList.add('bn-flat');
        reorderBtn.textContent = '乱序';
        reorderBtn.style.cssText = 'padding: 4px 6px; margin-right: 4px; cursor: pointer';
        reorderBtn.onclick = btnClick('#db-isay textarea');
    }

    // reply a comment to a status
    var commentContainer = document.querySelector('.comment-editor .form-foot-item:last-child');
    if (commentContainer) {
        var commentSubmitBtn = document.querySelector('.comment-editor .comment-form-btn');
        var reorderBtn2 = document.createElement('button');
        commentContainer.insertBefore(reorderBtn2, commentSubmitBtn);
        reorderBtn2.textContent = '乱序';
        reorderBtn2.type = 'button';
        reorderBtn2.style.cssText = 'height: 30px;line-height: 28px;padding: 0;width: 66px;border-radius: 3px;'
            + 'cursor: pointer;outline: none;border: 1px solid #c0c0c0;margin-right: 10px;';
        reorderBtn2.onclick = btnClick('#comments textarea.form-area', true);
    }

    // reshare with comments
    var reshareBtns = document.querySelectorAll('.btn-reshare');
    for (let i = 0; i < reshareBtns.length; i++) {
        reshareBtns[i].addEventListener('click', function() {
            let timerId = setInterval(() => {
                if (document.querySelector('.reshare-form')) {
                    var reshareFooter = document.querySelector('.reshare-form .reshare-footer');
                    var reshareSubmit = document.querySelector('.reshare-form .reshare-footer .reshare-btn');
                    var reorderBtn3 = document.createElement('button');
                    reshareFooter.insertBefore(reorderBtn3, reshareSubmit);
                    reorderBtn3.textContent = '乱序';
                    reorderBtn3.type = 'button';
                    reorderBtn3.style.cssText = 'width: 5em; height: 30px; ling-height: 30px; text-align: center;'
                        + 'vertical-align: middle; border: none; margin-right: 10px; border-radius: 3px;cursor: pointer;';
                    reorderBtn3.onclick = btnClick('.reshare-form textarea');
                    clearInterval(timerId);
                }
            }, 100);
        });
    }

    function btnClick(selector, isReply = false) {
        return function() {
            let textArea = document.querySelector(selector);
            let sourceText = textArea.value;
            let shuffledText = sentencize(sourceText);
            textArea.value = shuffledText;
            textArea.textContent = shuffledText;
            if (isReply) {
                textArea.defaultValue = shuffledText;
                let e = new Event('input', { bubbles: true});
                e.simulated = true;
                let tracker = textArea._valueTracker;
                if (tracker) {
                    tracker.stopTracking(); // seems React's related thing, https://github.com/facebook/react/issues/11488#issuecomment-347775628
                }
                textArea.dispatchEvent(e);
            }
        };
    }

    function tokenize(txt) {
        let tokenList = [], token = '';
        for (let i = 0; i < txt.length; i++) {
            let char = txt[i];
            if (/[a-zA-Z0-9]/.test(char)) {
                token += char;
            } else {
                if (token !== '') {
                    tokenList.push(token);
                    token = '';
                }
                tokenList.push(char);
            }
        }
        if (token !== '') {
            tokenList.push(token);
        }
        return tokenList;
    }

    function choose(choices) {
        var index = Math.floor(Math.random() * choices.length);
        return choices[index];
    }

    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    function reorder(tokenList) {
        let nGrams = [2, 3], i = 0, reordered = [];
        while (i < tokenList.length) {
            let nGram = choose(nGrams);
            let j = Math.min(i + nGram, tokenList.length);
            nGram = tokenList.slice(i, j);
            reordered = reordered.concat(shuffle(nGram));
            i = j;
        }
        return reordered;
    }

    function sentencize(text) {
        let result = [];
        let part = '';
        for(let i = 0; i < text.length; i++) {
            let char = text[i];
            if (/[，,。：:;；?？\.\s]/.test(char)) {
                result = result.concat(reorder(tokenize(part)));
                result.push(char);
                part = '';
            } else {
                part += char;
            }
        }
        if (part !== '') {
            result = result.concat(reorder(tokenize(part)));
        }
        return result.join('');
    }
})();