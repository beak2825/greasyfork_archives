// ==UserScript==
// @name        Kkym机翻跳转
// @version     1.0
// @description Kkym个人列表页机翻跳转.
// @author      wtyrambo
// @match       https://kakuyomu.jp/my/antenna/works/all
// @grant       none
// @namespace https://greasyfork.org/users/1450455
// @downloadURL https://update.greasyfork.org/scripts/530896/Kkym%E6%9C%BA%E7%BF%BB%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/530896/Kkym%E6%9C%BA%E7%BF%BB%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetClassName = 'widget-antennaList-continueReading';
    const targetClassName2 = 'js-antenna-works-default-mode-view';
    const targetClassName3 = 'isShown';
    const newBaseURL = 'https://books.fishhawk.top/novel/kakuyomu/';
    const newText = 'NTR';

    const continueReadingLinks = document.querySelectorAll(`a.${targetClassName}.${targetClassName2}.${targetClassName3}`);

    continueReadingLinks.forEach(link => {
        const originalHref = link.getAttribute('href');
        if (originalHref && originalHref.includes('/works/') && originalHref.includes('/resume_reading')) {
            const parts = originalHref.split('/');
            const workIdIndex = parts.indexOf('works');
            if (workIdIndex !== -1 && workIdIndex + 1 < parts.length) {
                const workId = parts[workIdIndex + 1];
                const newHref = `${newBaseURL}${workId}`;
                link.setAttribute('href', newHref);

                // Find the <span> tag within the link and change its text
                const spanElement = link.querySelector('span');
                if (spanElement) {
                    spanElement.textContent = newText;
                }
            }
        }
    });
})();
