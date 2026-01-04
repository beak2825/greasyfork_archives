// ==UserScript==
// @name         Torn DIBS System - Faction War Compatible
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add DIBS buttons to faction war enemy list 
// @author       Erkut
// @match        https://www.torn.com/factions.php?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538601/Torn%20DIBS%20System%20-%20Faction%20War%20Compatible.user.js
// @updateURL https://update.greasyfork.org/scripts/538601/Torn%20DIBS%20System%20-%20Faction%20War%20Compatible.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SERVER = 'http://82.153.241.183:3000';
    const USER = document.querySelector('li.user-info .name')?.textContent.trim() || 'unknown';

    async function getDibs() {
        const res = await fetch(`${SERVER}/dibs`);
        return await res.json();
    }

    function createButton(targetName, status) {
        const btn = document.createElement('button');
        btn.className = 'dibs-btn';
        btn.style.fontSize = '10px';
        btn.style.marginRight = '5px';
        btn.style.padding = '2px 4px';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';

        if (status === 'yours') {
            btn.textContent = 'UNDIBS';
            btn.style.backgroundColor = '#ffea8a';
        } else if (typeof status === 'string') {
            btn.textContent = 'CLAIMED';
            btn.title = `by ${status}`;
            btn.disabled = true;
            btn.style.backgroundColor = '#ccc';
        } else {
            btn.textContent = 'DIBS';
            btn.style.backgroundColor = '#aaffaa';
        }

        btn.addEventListener('click', async () => {
            const res = await fetch(`${SERVER}/dibs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: USER, target: targetName })
            });

            const data = await res.json();
            console.log(data);
            location.reload(); // Basit çözüm, istersen sadece bu hedefi güncelleyebiliriz
        });

        return btn;
    }

    async function injectDibs() {
        const dibsData = await getDibs();

        const enemyList = document.querySelectorAll('.user-info-wrap.left');

        enemyList.forEach(block => {
            if (block.querySelector('.dibs-btn')) return;

            const nameTag = block.querySelector('.user.name');
            const name = nameTag?.textContent.trim();

            if (!name) return;

            const attackBtn = block.querySelector('a.attack');
            if (!attackBtn) return;

            let status = null;
            if (dibsData[name]) {
                status = dibsData[name] === USER ? 'yours' : dibsData[name];
            }

            const btn = createButton(name, status);
            attackBtn.parentNode.insertBefore(btn, attackBtn.nextSibling);
        });
    }

    // SPA uyumu için DOM'u izle
    const observer = new MutationObserver(() => {
        injectDibs();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(injectDibs, 1500);
})();
