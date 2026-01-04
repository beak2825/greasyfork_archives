// ==UserScript==
// @name         Ptt Add Push Floor
// @namespace    https://wiki.gslin.org/wiki/Ptt_Add_Push_Floor
// @version      0.20241121.0
// @description  Add floor number to Ptt's pushes
// @author       Gea-Suan Lin <darkkiller@gmail.com>
// @match        https://www.ptt.cc/bbs/*
// @match        https://www.ptt.cc/man/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/385222/Ptt%20Add%20Push%20Floor.user.js
// @updateURL https://update.greasyfork.org/scripts/385222/Ptt%20Add%20Push%20Floor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let n = 1;
    for (const el of document.getElementsByClassName('push')) {
        let floor = document.createElement('span');
        floor.setAttribute('style', 'color: gray; float: right; text-align: right; width: 2.5em;');
        floor.innerHTML = `${n}F`;
        n++;
        el.lastChild?.insertAdjacentElement('beforebegin', floor);
    }
})();
