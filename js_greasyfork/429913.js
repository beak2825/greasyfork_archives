// ==UserScript==
// @name         Read The Docs More
// @namespace    https://qria.net/
// @version      0.1
// @description  Close Pesky Side Navigation in Read The Docs
// @author       Qria
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=h5py.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429913/Read%20The%20Docs%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/429913/Read%20The%20Docs%20More.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
    'use strict';

    const wyNavSide = document.querySelector(".wy-nav-side");
    const wySideNavSearch = document.querySelector(".wy-side-nav-search");
    const wyNavContent = document.querySelector(".wy-nav-content");
    const wyNavContentWrap = document.querySelector(".wy-nav-content-wrap");

    if (wyNavSide == null || wySideNavSearch == null || wyNavContent == null || wyNavContentWrap == null) {
        // this site is not a Read the Docs site.
        return;
    }

    console.log('Loaded Userscript: Read The Docs More');

    // setup close button
    wySideNavSearch.style.position = 'relative';
    wySideNavSearch.insertAdjacentHTML('afterbegin', `<button style="
        position: absolute;
        right: 10px;
        top: 10px;
        background: none;
        border: none;
        color: white;
        font-size: 20px;
    " id="userscript-close-button">×</button>`);
    const userscriptCloseButton = document.querySelector("#userscript-close-button");

    userscriptCloseButton.addEventListener('click', event => {
        wyNavContentWrap.style.marginLeft = 0;
        wyNavSide.style.display = 'none';
        wyNavContent.style.maxWidth = 'none';
    });
}, false);
