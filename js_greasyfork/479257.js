// ==UserScript==
// @name         프로그래머스 키보드 단축키 모음
// @namespace    http://shrk.dev/
// @version      0.1.1
// @description  프로그래머스 문제 풀 때 유용한 단축키 모음. 코드 작성 도중 마우스를 사용하지 않고 코드 실행(Ctrl+Enter), 제출 및 채점(Ctrl+Shift+Enter), 문제 설명 스크롤(Ctrl+J/K) 및 패널 크기 조정(Ctrl+;/')을 할 수 있습니다. 또한 문제 채점 결과 창을 스페이스 또는 엔터로 닫을 수 있습니다.
// @author       qb20nh
// @match        https://school.programmers.co.kr/learn/courses/*/lessons/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=programmers.co.kr
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479257/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%A8%B8%EC%8A%A4%20%ED%82%A4%EB%B3%B4%EB%93%9C%20%EB%8B%A8%EC%B6%95%ED%82%A4%20%EB%AA%A8%EC%9D%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/479257/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%A8%B8%EC%8A%A4%20%ED%82%A4%EB%B3%B4%EB%93%9C%20%EB%8B%A8%EC%B6%95%ED%82%A4%20%EB%AA%A8%EC%9D%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCROLL_LINES = 5;
    const RESIZE_PERCENT = 5;

    const DEBUG = false;

    function forElement(selector, rootNode = document) {
        return new Promise((resolve, reject) => {
            const element = rootNode.querySelector(selector);

            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(mutations => {
                const element = rootNode.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(rootNode, {
                childList: true,
                subtree: true
            });
        });
    }

    function forProperty(obj, propName, timeout = 3000, interval = 100) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            // Function to check the property
            function checkProperty() {
                // If the property exists, resolve the promise with its value
                if (propName in obj) {
                    resolve(obj[propName]);
                } else {
                    // If the timeout has not elapsed, check again after the interval
                    if (Date.now() - startTime < timeout) {
                        setTimeout(checkProperty, interval);
                    } else {
                        // If the timeout has elapsed, reject the promise
                        reject(new Error(`Property ${propName} was not found within ${timeout}ms`));
                    }
                }
            }

            // Start the polling
            checkProperty();
        });
    }

    /**
    * @see https://stackoverflow.com/a/18430767/4592648
    */
    function calculateLineHeight (element) {
        let lineHeight = parseInt(getComputedStyle(element).getPropertyValue('line-height'), 10);

        if (isNaN(lineHeight)) {
            const clone = element.cloneNode();
            clone.innerHTML = '<br>';
            element.appendChild(clone);
            const singleLineHeight = clone.offsetHeight;
            clone.innerHTML = '<br><br>';
            const doubleLineHeight = clone.offsetHeight;
            element.removeChild(clone);
            lineHeight = doubleLineHeight - singleLineHeight;
        }

        return lineHeight;
    }

    function scrollByLines(elem, lines) {
        const lineHeight = calculateLineHeight(elem);
        elem.scrollTo({top: elem.scrollTop + lineHeight*lines, behavior: 'smooth'});
    }

    function runAfterLoad(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('readystatechange', fn, {once: true});
        }
    }

    runAfterLoad(async () => {
        const cm = await forProperty(await forElement('.CodeMirror'), 'CodeMirror');
        if (DEBUG) {
            window.cm = cm;
        }
        const codeMirrorTextarea = document.querySelector('.CodeMirror textarea');
        const runBtn = document.getElementById('run-code');
        const submitBtn = document.getElementById('submit-code');
        const guide = document.getElementById('tour2');
        const code = document.querySelector('.run-section');

        const guideWidthStyleRE = /calc\((?<guideWidth>\d+(?:\.\d+)?)%\s*-\s*(?<gutterWidth>\d+(?:\.\d+)?)px\)/;
        const codeWidthStyleRE = /calc\((?<codeWidth>\d+(?:\.\d+)?)%\s*-\s*(?<gutterWidth>\d+(?:\.\d+)?)px\)/;

        function resizeElements(guide, code, dir) {
            const {guideWidth, gutterWidth: gutterWidth1} = guide.style.width.match(guideWidthStyleRE).groups;
            const {codeWidth, gutterWidth: gutterWidth2} = code.style.width.match(guideWidthStyleRE).groups;
            if (gutterWidth1 !== gutterWidth2) {
                console.warn(`gutter width offset is not the same!`);
            }
            const guidePercent = parseInt(guideWidth);
            const codePercent = parseInt(codeWidth);
            if (Math.abs(guidePercent + codePercent - 100) > 0.1) {
                console.warn(`width percent sum is not 100%`);
            }
            const adjustAmountPercent = RESIZE_PERCENT * dir;
            const clamp = (num, min = 0, max = 100) => Math.max(min, Math.min(num, max));
            const newGuidePercent = clamp(guidePercent + adjustAmountPercent);
            const newCodePercent = clamp(codePercent - adjustAmountPercent);

            const newStyle = (width) => `calc(${width}% - ${gutterWidth1}px)`;
            guide.style.width = newStyle(newGuidePercent);
            code.style.width = newStyle(newCodePercent);
        }

        const ACTION = Object.freeze({
            NONE: Symbol('ACTION.NONE'),
            RUN: Symbol('ACTION.RUN'),
            SUBMIT: Symbol('ACTION.SUBMIT'),
            SCROLL: Symbol('ACTION.SCROLL'),
            RESIZE: Symbol('ACTION.RESIZE'),
            DISMISS_MODAL: Symbol('ACTION.DISMISS_MODAL'),
        });

        let lastEdit = cm.doc.history.generation;
        let lastAnchor = cm.getCursor('anchor');
        let lastHead = cm.getCursor('head');

        // Your code here...
        document.addEventListener('keydown', ({ctrlKey, shiftKey, key}) => {
            let action;
            try {
                if (ctrlKey && key === 'Enter') {
                    action ??= shiftKey ? ACTION.SUBMIT : ACTION.RUN;
                }
                if (ctrlKey && 'jk'.includes(key)) {
                    action ??= ACTION.SCROLL;
                }
                if (ctrlKey && ';\''.includes(key)) {
                    action ??= ACTION.RESIZE;
                }
                if (['Enter', ' '].includes(key)) {
                    action ??= ACTION.DISMISS_MODAL;
                }
                action ??= ACTION.NONE;
                if (action !== ACTION.NONE) {
                    if (action === ACTION.SCROLL) {
                        let scrollDir = 0;
                        if (key === 'j') {
                            scrollDir = -1;
                        }
                        if (key === 'k') {
                            scrollDir = 1;
                        }
                        if (scrollDir !== 0) {
                            scrollByLines(guide, SCROLL_LINES * scrollDir);
                        }
                        return;
                    }
                    if (action === ACTION.RESIZE) {
                        let resizeDir = 0;
                        if (key === ';') {
                            resizeDir = -1;
                        }
                        if (key === '\'') {
                            resizeDir = 1;
                        }
                        if (resizeDir != 0) {
                            resizeElements(guide, code, resizeDir);
                        }
                        return;
                    }
                    if (action === ACTION.DISMISS_MODAL) {
                        const modalBtn = document.querySelector('#modal-dialog .btn.btn-primary');
                        modalBtn?.click?.();
                        setTimeout(() => cm.focus());
                    }
                    const focusElement = document.querySelector(':focus');
                    if (focusElement === codeMirrorTextarea) {
                        if (action === ACTION.RUN) {
                            runBtn.click();
                        }
                        if (action === ACTION.SUBMIT) {
                            submitBtn.click();
                        }
                    }
                }
            } finally {
                const thisEdit = cm.doc.history.generation;
                const thisAnchor = cm.getCursor('anchor');
                const thisHead = cm.getCursor('head');
                const compare = (a, b) => JSON.stringify(a) === JSON.stringify(b);
                let didSelectionChange = false;
                if (ctrlKey && action !== ACTION.NONE) {
                    if (thisEdit !== lastEdit) {
                        cm.execCommand('undo');
                    }
                    if (!compare(thisAnchor, lastAnchor) || !compare(thisHead, lastHead)) {
                        cm.setSelection(lastAnchor, lastHead);
                        didSelectionChange = true;
                    }
                }
                lastEdit = thisEdit;
                if (!didSelectionChange) {
                    lastAnchor = thisAnchor;
                    lastHead = thisHead;
                }
            }
        }, {
            passive: true
        });
    });
})();