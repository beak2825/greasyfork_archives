// ==UserScript==
// @name        Sortowanie kont Allegro Sales Center
// @namespace   http://tampermonkey.net/
// @version     2.0
// @description Sortuje listę kont na stronie Allegro Sales Center
// @match       https://salescenter.allegro.com/account/shared/switch
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/500930/Sortowanie%20kont%20Allegro%20Sales%20Center.user.js
// @updateURL https://update.greasyfork.org/scripts/500930/Sortowanie%20kont%20Allegro%20Sales%20Center.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const openedByScript = GM_getValue('openedByScript', false);
    if (openedByScript) {
        return;
    }
    function sortAccounts() {
        const gPA = () => document.cookie.match('(^|;)\\s*preferredAccounts\\s*=\\s*([^;]+)')?.pop().split(',') || [];
        const sPA = (accs) => document.cookie = `preferredAccounts=${accs.join(',')}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

        const sortButtonAction = () => {
            const accs = document.querySelectorAll('div[data-box-name="allegro.seller.accounts.sharedAccountsChanger"] > div > div');
            const pAccs = gPA();
            const sorted = Array.from(accs).sort((a, b) => {
                const textA = a.querySelector('span').innerText.toLowerCase(), textB = b.querySelector('span').innerText.toLowerCase();
                const indexA = pAccs.indexOf(textA), indexB = pAccs.indexOf(textB);
                return indexA !== -1 && indexB !== -1 ? indexA - indexB : indexA !== -1 ? -1 : indexB !== -1 ? 1 : textA < textB ? -1 : textA > textB ? 1 : 0;
            });
            const container = document.querySelector('div[data-box-name="allegro.seller.accounts.sharedAccountsChanger"] > div');
            const buttons = container.querySelectorAll('button');
            container.innerHTML = '';
            buttons.forEach(b => container.appendChild(b));
            sorted.forEach(acc => {
                container.appendChild(acc);
                const accName = acc.querySelector('span').innerText.toLowerCase();
                acc.classList[pAccs.includes(accName) ? 'add' : 'remove']('preferred-account');
            });
        }
        const addButtons = () => {
            const container = document.querySelector('div[data-box-name="allegro.seller.accounts.sharedAccountsChanger"] > div');
            if (!container) return;
            const sortBtn = document.createElement('button');
            sortBtn.textContent = 'Sortuj';
            sortBtn.style.marginTop = '10px';
            sortBtn.addEventListener('click', sortButtonAction);
            container.prepend(sortBtn);
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edytuj';
            editBtn.style.marginTop = '10px';
            editBtn.addEventListener('click', () => {
                const pAccs = gPA().join(', ');
                const newPAccs = prompt('Wprowadź nazwy partnerów po przecinku', pAccs);
                if (newPAccs !== null) {
                    sPA(newPAccs.split(',').map(acc => acc.trim()));
                    sortButtonAction();
                }
            });
            container.prepend(editBtn);
            GM_addStyle(`
                .preferred-account span { font-weight: bold; font-size: 16px; }
                button { background-color: #ff5a00; color: white; padding: 8px 16px; margin: 3px; font-size: 14px; border: none; border-radius: 4px; cursor: pointer; }
            `);
        }
        setTimeout(() => {
            const checkInterval = setInterval(() => {
                if (document.querySelector('div[data-box-name="allegro.seller.accounts.sharedAccountsChanger"] > div > div')) {
                    addButtons();
                    clearInterval(checkInterval);
                }
            }, 100);
        }, 2500);
    }
    window.onload = () => {
        sortAccounts();
    };
})();
