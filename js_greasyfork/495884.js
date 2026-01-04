// ==UserScript==
// @license      MIT
// @name         메일플러그 개별발송 자동해제
// @namespace    shuggie
// @version      2024-05-23
// @description  메일플러그 개별발송이 체크되어 있는 것을 자동으로 해제
// @author       장민석
// @match        https://*.mailplug.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495884/%EB%A9%94%EC%9D%BC%ED%94%8C%EB%9F%AC%EA%B7%B8%20%EA%B0%9C%EB%B3%84%EB%B0%9C%EC%86%A1%20%EC%9E%90%EB%8F%99%ED%95%B4%EC%A0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/495884/%EB%A9%94%EC%9D%BC%ED%94%8C%EB%9F%AC%EA%B7%B8%20%EA%B0%9C%EB%B3%84%EB%B0%9C%EC%86%A1%20%EC%9E%90%EB%8F%99%ED%95%B4%EC%A0%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to execute custom code when #page2 is in the URL
    function executeCustomScript() {
        if (window.location.hash.includes('write')) {
            (function checkElement() {
                const element = document.getElementsByName('in_div');
                if (element.length > 0) {
                    var ind=document.getElementsByName('in_div')[0];
                    ind.value='N';
                    ind.checked=false;
                } else {
                    setTimeout(checkElement, 100); // Check again after 100ms
                }
            })();
        }
    }

    // Initial check
    executeCustomScript();

    // Check hash change
    window.addEventListener('hashchange', executeCustomScript);
})();