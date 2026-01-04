// ==UserScript==
// @name         CamGirlFinder Fix Redirect
// @namespace    https://greasyfork.org/fr/users/1468290-payamarre
// @version      1.3
// @license      MIT
// @description  Add a button on CamGirlFinder that fix the redirect on certain camsite.
// @author       NoOne
// @match        http://camgirlfinder.net/models/*
// @match        https://camgirlfinder.net/models/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535596/CamGirlFinder%20Fix%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/535596/CamGirlFinder%20Fix%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 25px; height: 25px;">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
    </svg>`;

    function addRedirectButton() {
        if (document.querySelector('button[data-role="redirect-fix"]')) return;

        const currentUrl = window.location.href;
        const modelName = currentUrl.split('/').pop();

        const modelLink = document.querySelector('a.nowrap[rel="nofollow"]');
        if (!modelLink) return;

        const button = document.createElement('button');
        button.dataset.role = "redirect-fix";
        button.innerHTML = svgIcon;
        Object.assign(button.style, {
            cursor: 'pointer',
            background: 'none',
            padding: '0',
            marginLeft: '10px',
            height: '35px',
            width: '35px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            verticalAlign: 'middle',
            color: '#f5f5f5',
            borderRadius: '8px',
            border: '1px solid #f5f5f5',
            transition: 'all 0.9s ease'
        });

        button.addEventListener('mouseover', () => {
            button.style.color = '#272727';
            button.style.background = '#f5f5f5';
        });
        button.addEventListener('mouseout', () => {
            button.style.color = '#f5f5f5';
            button.style.background = 'none';
        });

        button.addEventListener('click', () => {
            let url;
            if (currentUrl.includes('/models/cb/')) url = `https://chaturbate.com/${modelName}`;
            else if (currentUrl.includes('/models/sc/')) url = `https://stripchat.com/${modelName}`;
            else if (currentUrl.includes('/models/c4/')) url = `https://cam4.com/${modelName}`;
            else if (currentUrl.includes('/models/cs/')) url = `https://camsoda.com/${modelName}`;
            else if (currentUrl.includes('/models/f4f/')) url = `https://flirt4free.com/${modelName}`;
            else if (currentUrl.includes('/models/bc/')) url = `https://bongacams.com/${modelName}`;
            else if (currentUrl.includes('/models/ctv/')) url = `https://cherry.tv/${modelName}`;
            else if (currentUrl.includes('/models/im/')) url = `https://imlive.com/live-sex-chat/cam-girls/${modelName}`;
            else if (currentUrl.includes('/models/lj/')) url = `https://livejasmin.com/${modelName}`;
            else if (currentUrl.includes('/models/stv/')) url = `https://showup.tv/${modelName}`;
            else if (currentUrl.includes('/models/sm/')) url = `https://streamate.com/cam/${modelName}`;
            else if (currentUrl.includes('/models/sr/')) url = `https://streamray.com/${modelName}`;
            else if (currentUrl.includes('/models/xl/')) url = `https://xlovecam.com/chat/${modelName}`;
            else if (currentUrl.includes('/models/atv/')) url = `https://amateur.tv/${modelName}`;
            else return alert("No model find");

            window.open(url, '_blank');
        });

        modelLink.parentNode.insertBefore(button, modelLink.nextSibling);
    }

    const observer = new MutationObserver((mutations, obs) => {
        addRedirectButton();
        obs.disconnect();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', addRedirectButton);
})();