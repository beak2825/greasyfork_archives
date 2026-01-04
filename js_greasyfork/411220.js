// ==UserScript==
// @name         Elimination Target Hider
// @namespace    elimination-target-hider
// @version      1.1
// @description  try to take over the world!
// @author       josephting [2272298]
// @match        https://www.torn.com/competition.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/411220/Elimination%20Target%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/411220/Elimination%20Target%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ignoreList = GM_getValue('ignore-list');
    if (typeof ignoreList === 'undefined') {
        ignoreList = [];
        GM_setValue('ignore-list', ignoreList);
    }

    const addIgnoreList = (uid) => {
        if (!ignoreList.includes(uid)) {
            ignoreList.push(uid);
            GM_setValue('ignore-list', ignoreList);
        }
    };

    const targetNode = document.querySelector('#competition-wrap');
    const config = { attributes: true, childList: true, subtree: true };

    const callback = m => {
        let cl = document.querySelector('.competition-list');
        if (cl.classList.contains('ethide')) return;
        cl.classList.add('ethide');
        for (let t of document.querySelectorAll('.competition-list > li')) {
            let uid = t.querySelector('a.user.name').href.match(/profiles.php.+=(\d+)/)[1];
            if (ignoreList.includes(uid)) {
                t.style.display = 'none';
            } else {
                let teamIcon = t.querySelector('.team > i');
                teamIcon.title = 'Hide from target list';
                teamIcon.style.cursor = 'pointer';
                teamIcon.addEventListener('click', () => {
                    addIgnoreList(uid);
                    t.style.display = 'none';
                });
                t.querySelectorAll('a.user.name > span').forEach(uSpan => {
                    uSpan.innerHTML += ` [${uid}]`;
                });
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();
