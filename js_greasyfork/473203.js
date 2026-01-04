// ==UserScript==
// @name         Make Online Sequencer Easy to Browse
// @namespace    https://www.tcdw.net/
// @version      0.1
// @description  Make Online Sequencer easy to browse by adding visible title to every song in the list.
// @author       tcdw <tcdw2011@gmail.com>
// @match        https://onlinesequencer.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlinesequencer.net
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/473203/Make%20Online%20Sequencer%20Easy%20to%20Browse.user.js
// @updateURL https://update.greasyfork.org/scripts/473203/Make%20Online%20Sequencer%20Easy%20to%20Browse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
    .sequences_grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    .preview {
        float: unset;
        width: unset;
        height: unset;
        display: flex;
    }
    .preview .image {
        width: 64px;
        height: 64px;
        position: static;
        flex: none;
    }
    .preview a {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .preview .nanako-info {
        flex: auto;
        display: flex;
        align-items: center;
        padding: 0 16px;
        font-size: 16px;
        line-height: 1.5;
        background: rgba(0, 0, 0, 0.2);
    }
    .preview .nanako-info__inner {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    `;
    document.head.appendChild(style);

    Array.prototype.forEach.call(document.querySelectorAll(".preview"), (e) => {
        // console.log(e, e.title)
        e.insertAdjacentHTML("beforeend", `<div class="nanako-info"><div class="nanako-info__inner">${e.title}</div></div>`)
    });
})();
