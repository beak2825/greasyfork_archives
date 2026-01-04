// ==UserScript==
// @name            看起来像 Google.CN
// @name:en         Looks like Google.CN
// @version         0.2.0
// @description     即使在 Google.COM 上也像 Google.CN
// @description:en  Make Google homepage looks like Google.CN
// @match           https://www.google.com.hk/*
// @match           https://www.google.com/*
// @namespace       GoogleCNSimulator
// @license         CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/539406/%E7%9C%8B%E8%B5%B7%E6%9D%A5%E5%83%8F%20GoogleCN.user.js
// @updateURL https://update.greasyfork.org/scripts/539406/%E7%9C%8B%E8%B5%B7%E6%9D%A5%E5%83%8F%20GoogleCN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    const style = document.createElement('style');
    style.textContent = `
        .T8VaVe {
            color: #4285f4;
            font: 16px/16px Helvetica Neue, sans-serif;
            position: absolute;
            left: 215px;
            bottom: 0;
            white-space: nowrap;
        }
        .mobileICPLink {
            font-size: 14px;
            color: #444746;
            text-decoration: none;
            margin: 0 10px;
        }
    `;
    document.head.appendChild(style);

    if (isMobile) {
        // TODO
    } else {
        const logoClass1 = 'lnXdpd';
        const logoDiv1 = document.querySelector(`.${logoClass1}`);
        if (logoDiv1) {
            const newContent = document.createElement('span');
            newContent.className = 'T8VaVe';
            newContent.textContent = '谷歌';
            logoDiv1.insertAdjacentElement('afterend', newContent);
        }
    }

    if (isMobile) {
        const footerDiv = document.querySelector('.fbar');
        if (footerDiv) {
            const newDiv = document.createElement('div');
            const newLink = document.createElement('a');
            newLink.className = 'mobileICPLink';
            newLink.href = 'https://beian.miit.gov.cn';
            newLink.setAttribute('referrerpolicy', 'no-referrer');
            newLink.textContent = 'ICP证合字B2-20070004号';
            newDiv.appendChild(newLink);
            footerDiv.appendChild(newDiv);
        }
    } else {
        const bottomClass1 = 'pHiOh';
        const bottomDivs1 = document.querySelectorAll(`.${bottomClass1}`);
        const bottomDiv1 = bottomDivs1[3];

        if (bottomDiv1) {
            const newLink = document.createElement('a');
            newLink.className = 'pHiOh';
            newLink.href = 'https://beian.miit.gov.cn';
            newLink.setAttribute('referrerpolicy', 'no-referrer');
            newLink.textContent = 'ICP证合字B2-20070004号';
            bottomDiv1.insertAdjacentElement('afterend', newLink);
        }
    }
})();