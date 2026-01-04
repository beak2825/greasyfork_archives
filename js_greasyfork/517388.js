// ==UserScript==
// @name         Collapse W2G sidebar
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Adds a collapse button to complete hide and show the playlist sidebare of w2g.tv
// @author       @marcelbrode
// @match        https://w2g.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=w2g.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517388/Collapse%20W2G%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/517388/Collapse%20W2G%20sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const svgPathCollapse = 'M439 7c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8l-144 0c-13.3 0-24-10.7-24-24l0-144c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39L439 7zM72 272l144 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39L73 505c-9.4 9.4-24.6 9.4-33.9 0L7 473c-9.4-9.4-9.4-24.6 0-33.9l87-87L55 313c-6.9-6.9-8.9-17.2-5.2-26.2s12.5-14.8 22.2-14.8z';
    const svgPathExpand = 'M344 0L488 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512L24 512c-13.3 0-24-10.7-24-24L0 344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z';

    const collapseButtonHtml = `<div id="custom-collapse" custom-collapse="expanded" class="ml-2 w2g-bind-layout"><div class="inline-block relative text-left"><div><div class="px-3 w2g-button w2g-compact" id="menu-button" aria-expanded="rue" aria-haspopup="true"><span><svg aria-hidden="true" class="fa-down-left-and-up-right-to-center fa-xl svg-inline--fa" data-icon="language" data-prefix="fas" role="img" viewBox="0 0 640 512"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#CCC" d="${svgPathCollapse}"></path></svg></svg></svg></svg></span></div></div></div></div>`;
    const menuButtonParent = document.querySelector('#menu-button').closest('.ml-4.w2g-bind-layout').parentNode;
    menuButtonParent.innerHTML += collapseButtonHtml;

    const collapseButton = document.querySelector('#custom-collapse');
    const collapseButtonSvgPath = collapseButton.querySelector('path');
    const sidebar = document.querySelector('#w2g-right');

    collapseButton.addEventListener('click', (event) => {
        const target = event.target.closest('#custom-collapse');
        if (target.getAttribute('custom-collapse') === 'expanded') {
            sidebar.style.display = 'none';
            target.setAttribute('custom-collapse', 'collapsed');
            collapseButtonSvgPath.setAttribute('d', svgPathExpand); 
        } else if (target.getAttribute('custom-collapse') === 'collapsed') {
            sidebar.style.display = 'unset';
            target.setAttribute('custom-collapse', 'expanded'); 
            collapseButtonSvgPath.setAttribute('d', svgPathCollapse); 
        }
    });
})();