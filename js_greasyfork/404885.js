// ==UserScript==
// @name         Github.io show source
// @namespace    LuisMayo
// @version      0.1
// @description  Go to source code of a github.io page. Source code on https://github.com/LuisMayo/general-userscripts/
// @author       LuisMayo
// @match        https://*.github.io/*
// @downloadURL https://update.greasyfork.org/scripts/404885/Githubio%20show%20source.user.js
// @updateURL https://update.greasyfork.org/scripts/404885/Githubio%20show%20source.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const container = document.createElement('a');
    container.style.position = 'absolute';
    container.style.right = '20px';
    container.style.top = '20px';
    container.style.zIndex = '1';
    container.style.backgroundColor = 'black';
    container.style.cursor = 'pointer';
    const goToGithubButton = document.createElement('span');
    goToGithubButton.style.border = '2px solid antiquewhite';
    goToGithubButton.style.backgroundColor = 'antiquewhite';
    goToGithubButton.style.borderRightColor = 'cornsilk';
    goToGithubButton.textContent = 'Open Source Code on github';
    goToGithubButton.addEventListener('click', (ev) => {
        const root = "https://github.com"
        const accountName = location.hostname.substring(0, location.hostname.indexOf('.'));
        const projectName = location.pathname.length > 1 ? location.pathname : location.hostname;
        window.open(root + '/' + accountName + '/' + projectName);
    });
    container.appendChild(goToGithubButton);
    const dismissLink = document.createElement('a');
    dismissLink.style.border = '2px solid antiquewhite';
    dismissLink.style.backgroundColor = 'antiquewhite';
    dismissLink.textContent = 'Dismiss';
    dismissLink.addEventListener('click', (ev) => container.remove());
    container.appendChild(dismissLink);
    document.body.appendChild(container);
})();
