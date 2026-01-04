// ==UserScript==
// @name         DCInside Comments Loading Delay Fix Script
// @namespace    https://gist.github.com/
// @version      3.0
// @description  Convert unnecessary scripts that delay page loading to asynchronous (async) execution, and prevent any dependency errors this may cause so that the comments feature is enabled immediately.
// @author       Gemini & User
// @match        https://gall.dcinside.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540896/DCInside%20Comments%20Loading%20Delay%20Fix%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/540896/DCInside%20Comments%20Loading%20Delay%20Fix%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 의존성 오류를 방지하기 위한 가짜 함수(Stub) 생성
    // 본문에서 호출하는 함수가 존재하지 않아 오류가 발생하는 것을 막기 위해,
    // 아무 기능도 하지 않는 빈 함수를 미리 선언해 둡니다.
    const DUMMY_FUNCTIONS = [
        'lately_gall_init',
        'gt_toggle_issue' // 다른 페이지에서 오류를 일으킬 수 있는 함수 추가
    ];

    let scriptToInject = '';
    DUMMY_FUNCTIONS.forEach(funcName => {
        scriptToInject += `window.${funcName} = function() { console.log('[DC-Fix] ${funcName} call intercepted.'); };\n`;
    });

    const head = document.head || document.documentElement;
    const scriptNode = document.createElement('script');
    scriptNode.textContent = scriptToInject;
    // 페이지가 코드를 읽기 시작하는 가장 빠른 시점에 가짜 함수를 주입합니다.
    head.insertBefore(scriptNode, head.firstElementChild);

    console.log('[DC-Fix v3.0] 의존성 오류 방지 완료.');


    // 2. 렌더링을 차단하는 스크립트들을 비동기로 전환
    const BLOCKING_SCRIPT_URLS = [
        'navigation.js',
        'globalSearch.js',
        'favorite.js',
        'lately_visit_gallery.js'
    ];

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.src) {
                    const isBlocking = BLOCKING_SCRIPT_URLS.some(scriptName => node.src.includes(scriptName));
                    if (isBlocking && !node.async) {
                        // async 속성을 true로 설정하여 브라우저가 기다리지 않도록 합니다.
                        node.async = true;
                        console.log(`[DC-Fix v3.0] ${node.src} 를 비동기(async)로 전환했습니다.`);
                    }
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
