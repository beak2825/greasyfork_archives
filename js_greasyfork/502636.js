// ==UserScript==
// @name         SubsPlease Keep Track of Watched Episodes
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Keep track of which episodes have been clicked on on subsplease.org
// @author       lord_ne
// @license      MIT
// @match        https://subsplease.org/shows/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=subsplease.org
// @run-at       document-idle
// @require      https://update.greasyfork.org/scripts/502635/1422101/waitForKeyElements-CoeJoder-fork.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/502636/SubsPlease%20Keep%20Track%20of%20Watched%20Episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/502636/SubsPlease%20Keep%20Track%20of%20Watched%20Episodes.meta.js
// ==/UserScript==

/* global waitForKeyElements */

(function() {
    'use strict';
    waitForKeyElements('label.episode-title', applyToElement, false);

    addGlobalStyle(`
        label.episode-title.clicked {
            color: #aa05aa !important;
        }
        label.episode-title.clicked:hover {
            color: #ff00ff !important;
        }
    `);

    function applyToElement(el) {
        markIfClicked(el);
        el.addEventListener('click', onClick);
        el.addEventListener('mouseover', onMouseOver);
    }

    function onClick(event) {
        unsafeWindow.localStorage.setItem(event.target.textContent, 'clicked');
        event.target.classList.add('clicked');
    }

    function onMouseOver(event) {
        markIfClicked(event.target);
    }

    function markIfClicked(el) {
        if (unsafeWindow.localStorage.getItem(el.textContent)) {
            el.classList.add('clicked');
        } else {
            el.classList.remove('clicked');
        }
    }

    function addGlobalStyle(css) {
        const head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

})();