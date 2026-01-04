// ==UserScript==
// @name         Torn - Quick Vault
// @namespace    quick.vault
// @version      0.1
// @description  Adds a button beside the deposit button that will vault all of your on-hand cash when clicked
// @author       Baccy
// @match        https://www.torn.com/properties.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544154/Torn%20-%20Quick%20Vault.user.js
// @updateURL https://update.greasyfork.org/scripts/544154/Torn%20-%20Quick%20Vault.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
        if (document.querySelector('.duckwowow')) return;

        const id = Array.from(document.querySelectorAll('a'))
        .map(a => a.href.match(/p=properties&ID=(\d+)/))
        .find(match => match)?.[1];
        if (!id || !/^\d+$/.test(id)) return;

        const placement = document.querySelector('.deposit-box .cont');
        const rfcv = getRFC();
        if (!rfcv || !placement) return;

        const parent = document.createElement('span');
        parent.className = 'btn-wrap silver';

        const button = document.createElement('span');
        button.className = 'btn torn-btn duckwowow';
        button.textContent = 'ALL';
        button.style.cssText = 'margin-left: 5px;';
        button.addEventListener('click', () => {
            const deposit = document.querySelector('#user-money').getAttribute('data-money');
            if (!deposit || deposit === '0') return;

            fetch(`https://www.torn.com/properties.php?rfcv=${rfcv}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: `step=vaultProperty&deposit=${deposit}&ID=${id}`
            })
                .then(response => response.json())
                .then(data => {
                console.log(data);
            });
        });

        parent.appendChild(button);
        placement.appendChild(parent);
    }

    function getRFC() {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            const [name, value] = cookies[i].split("=");
            if (name === "rfc_v") {
                return value;
            }
        }
        return null;
    }


    const observer = new MutationObserver(() => {
        if (window.location.href.includes("tab=vault")) addButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (window.location.href.includes("tab=vault")) addButton();
})();