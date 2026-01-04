// ==UserScript==
// @name         아프리카TV 정렬 개선
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adjust chat styles on AfreecaTV live streams for consistent alignment
// @author       You
// @match        https://play.afreecatv.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486664/%EC%95%84%ED%94%84%EB%A6%AC%EC%B9%B4TV%20%EC%A0%95%EB%A0%AC%20%EA%B0%9C%EC%84%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/486664/%EC%95%84%ED%94%84%EB%A6%AC%EC%B9%B4TV%20%EC%A0%95%EB%A0%AC%20%EA%B0%9C%EC%84%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const adjustLayout = () => {
        const classesToHide = ['grade-badge-fan', 'thumb', 'grade-badge-vip'];

        classesToHide.forEach(className => {
            document.querySelectorAll(`.${className}`).forEach(element => {
                element.style.display = 'none';
            });
        });

        const usernames = document.querySelectorAll('.username');
        const maxUsernameWidth = 6 * 14; // 6글자 * 14px

        usernames.forEach(username => {
            username.style.minWidth = `${maxUsernameWidth}px`;
        });

        document.querySelectorAll('.message-container').forEach(container => {
            container.style.margin = '0px';
        });
    };

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                adjustLayout();
            }
        });
    });

    const config = { childList: true, subtree: true };
    const targetNode = document.body;

    observer.observe(targetNode, config);

    adjustLayout();
})();