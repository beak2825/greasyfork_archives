// ==UserScript==
// @name         Defly.io/hexanaut.io Skin Changer
// @namespace    defly.io
// @version      1.5
// @description  Only skin changer feature
// @author       Jadob Lane aka Luckyday999
// @match        https://defly.io/
// @match        https://hexanaut.io/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539440/Deflyiohexanautio%20Skin%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/539440/Deflyiohexanautio%20Skin%20Changer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '20px';
    menu.style.right = '20px';
    menu.style.width = '260px';
    menu.style.background = 'rgba(0,0,0,0.85)';
    menu.style.color = '#0ff';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.fontSize = '14px';
    menu.style.padding = '12px';
    menu.style.borderRadius = '10px';
    menu.style.zIndex = 999999;
    menu.style.userSelect = 'none';
    menu.style.boxShadow = '0 0 10px #00ffff';

    const title = document.createElement('h3');
    title.textContent = 'Defly.io/Hexanut.io Skin Changer';
    title.style.marginTop = '0';
    title.style.marginBottom = '10px';
    title.style.color = '#0ff';
    menu.appendChild(title);

    function createInput(labelText, placeholder, min, max) {
        const container = document.createElement('div');
        container.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        label.style.marginBottom = '4px';

        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = placeholder;
        input.style.width = '100%';
        input.style.padding = '6px 8px';
        input.style.borderRadius = '5px';
        input.style.border = '1px solid #0ff';
        input.style.background = '#000';
        input.style.color = '#0ff';
        if (min !== undefined) input.min = min;
        if (max !== undefined) input.max = max;

        container.appendChild(label);
        container.appendChild(input);
        return { container, input };
    }

    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.width = '100%';
        btn.style.padding = '8px';
        btn.style.background = '#0ff';
        btn.style.color = '#000';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.onmouseenter = () => btn.style.background = '#00cccc';
        btn.onmouseleave = () => btn.style.background = '#0ff';
        btn.onclick = onClick;
        return btn;
    }

    function alertReload(msg) {
        alert(msg);
        location.reload();
    }

    const { container, input } = createInput('Change Character Skin', '1 - 98', 1, 98);
    menu.appendChild(container);
    menu.appendChild(createButton('Apply Skin', () => {
        const val = parseInt(input.value);
        if (isNaN(val) || val < 1 || val > 98) return alert('Invalid skin number');
        localStorage.setItem('playerSkin', val);
        alertReload('Skin selected! Reloading...');
    }));

    document.body.appendChild(menu);
})();