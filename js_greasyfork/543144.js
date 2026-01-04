// ==UserScript==
// @name         Torn Execute Info Bar
// @namespace    http://www.torn.com/
// @version      1.2
// @description  Show Max health of opponent to trigger execute
// @author       JohnNash
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543144/Torn%20Execute%20Info%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/543144/Torn%20Execute%20Info%20Bar.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver(() => {
        if (document.getElementById('execute-info-bar')) return;

        // Procurar Execute na arma secundária
        const executeIcon = document.querySelector('#weapon_second i.bonus-attachment-execute');
        if (!executeIcon) return;

        const description = executeIcon.getAttribute('data-bonus-attachment-description') || '';
        const match = description.match(/(\d+)%/);
        if (!match) return;

        const bonusPercent = parseInt(match[1]);

        // Procurar valor da vida do oponente (o 2º ícone "Health")
        const healthIcons = document.querySelectorAll('i.iconHealth___Ojjg3');
        if (healthIcons.length < 2) return;

        const opponentHealthIcon = healthIcons[1];
        const healthSpan = opponentHealthIcon.nextElementSibling;
        if (!healthSpan || !healthSpan.textContent.includes('/')) return;

        const hpMatch = healthSpan.textContent.trim().match(/[\d,]+\s*\/\s*([\d,]+)/);
        if (!hpMatch) return;

        const maxHp = parseInt(hpMatch[1].replace(/,/g, ''));
        const executeHp = Math.floor((bonusPercent / 100) * maxHp);

        // Criar barra
        const infoBar = document.createElement('div');
        infoBar.id = 'execute-info-bar';
        infoBar.innerText = `Max HP to Execute: ${executeHp} HP (${bonusPercent}%)`;
        infoBar.style.background = '#222';
        infoBar.style.color = 'white';
        infoBar.style.padding = '8px 12px';
        infoBar.style.textAlign = 'center';
        infoBar.style.fontSize = '14px';
        infoBar.style.borderRadius = '6px';
        infoBar.style.margin = '4px 0';

        // Inserir entre o headerWrapper e headerShadow do oponente (2º par)
        const wrappers = [...document.querySelectorAll('.headerWrapper___p6yrL')];
        const shadows = [...document.querySelectorAll('.headerShadow___D3fJ8')];

        if (wrappers.length >= 2 && shadows.length >= 2) {
            const parent = wrappers[1].parentElement;
            parent.insertBefore(infoBar, shadows[1]);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();