// ==UserScript==
// @name         Gitlab Copy Commit Link Instead of SHA
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This is a Tampermonkey user script that enhances the Gitlab user interface by adding a button that copies the commit link to the clipboard instead of just the commit SHA.
// @author       You
// @match        https://gitlab.com/*/commits/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463334/Gitlab%20Copy%20Commit%20Link%20Instead%20of%20SHA.user.js
// @updateURL https://update.greasyfork.org/scripts/463334/Gitlab%20Copy%20Commit%20Link%20Instead%20of%20SHA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('li.commit').forEach(function (commit) {
        let commitLink = commit.querySelector('a.item-title').getAttribute('href');
        let avatarCell = commit.querySelector('div.avatar-cell');
        // add a button to copy the commit link
        let copyBtn = commit.querySelector('button[aria-label="Copy commit SHA"]');
        // duplicate the button
        let copyBtnClone = copyBtn.cloneNode(true);
        // add the clone to the avatar cell
        avatarCell.appendChild(copyBtnClone);
        // apply     margin-right: 0.8rem; margin-top: 0.2rem;
        copyBtnClone.style.marginRight = '0.8rem';
        copyBtnClone.style.marginTop = '0.25rem';
        let commitUrl = window.location.origin + commitLink;
        copyBtnClone.setAttribute('data-clipboard-text', commitUrl);
    });
})();