// ==UserScript==
// @name         Torn Action Button Hider (Instant + Customizable)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Instantly hide Mug, Leave, and Hospitalize buttons on Torn attack pages with a draggable, live UI panel.
// @author       HeyItzWerty (original credit) edited by Dirt_Fairy 
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/543914/Torn%20Action%20Button%20Hider%20%28Instant%20%2B%20Customizable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543914/Torn%20Action%20Button%20Hider%20%28Instant%20%2B%20Customizable%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (document.getElementById('button-hider-wrapper')) return;

    const DEFAULT_TOP = '100px';
    const DEFAULT_LEFT = '20px';
    const WRAPPER_SIZE = 90;
    const BUTTON_SIZE = 70;

    const wrapper = document.createElement('div');
    wrapper.id = 'button-hider-wrapper';

    const toggleButton = document.createElement('div');
    toggleButton.id = 'hider-toggle-button';
    toggleButton.textContent = 'âš™ï¸';

    wrapper.appendChild(toggleButton);
    document.body.appendChild(wrapper);

    const menu = document.createElement('div');
    menu.id = 'button-hider-menu';
    menu.innerHTML = `
        <label><input type="checkbox" id="hide-mug"> Hide Mug</label><br>
        <label><input type="checkbox" id="hide-leave"> Hide Leave</label><br>
        <label><input type="checkbox" id="hide-hospitalize"> Hide Hospitalize</label><br>
        <button id="close-hider-menu">Close</button>
    `;
    document.body.appendChild(menu);

    let buttonTop = GM_getValue('buttonTop', DEFAULT_TOP);
    let buttonLeft = GM_getValue('buttonLeft', DEFAULT_LEFT);
    wrapper.style.top = buttonTop;
    wrapper.style.left = buttonLeft;

    function savePosition() {
        GM_setValue('buttonTop', wrapper.style.top);
        GM_setValue('buttonLeft', wrapper.style.left);
    }

    const settings = {
        mug: GM_getValue('hideMug', false),
        leave: GM_getValue('hideLeave', false),
        hospitalize: GM_getValue('hideHospitalize', false)
    };

    // Sync checkbox states
    document.getElementById('hide-mug').checked = settings.mug;
    document.getElementById('hide-leave').checked = settings.leave;
    document.getElementById('hide-hospitalize').checked = settings.hospitalize;

    // Apply settings instantly on toggle
    function updateSetting(settingKey, value) {
        settings[settingKey] = value;
        GM_setValue('hide' + settingKey.charAt(0).toUpperCase() + settingKey.slice(1), value);
        hideSelectedButtons();
    }

    document.getElementById('hide-mug').addEventListener('change', e => updateSetting('mug', e.target.checked));
    document.getElementById('hide-leave').addEventListener('change', e => updateSetting('leave', e.target.checked));
    document.getElementById('hide-hospitalize').addEventListener('change', e => updateSetting('hospitalize', e.target.checked));

    // Dragging
    let isDragging = false, offsetX = 0, offsetY = 0;

    function dragStart(e) {
        isDragging = true;
        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

        offsetX = clientX - wrapper.getBoundingClientRect().left;
        offsetY = clientY - wrapper.getBoundingClientRect().top;
    }

    function dragMove(e) {
        if (!isDragging) return;

        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

        let newLeft = clientX - offsetX;
        let newTop = clientY - offsetY;

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft > vw - WRAPPER_SIZE) newLeft = vw - WRAPPER_SIZE;
        if (newTop > vh - WRAPPER_SIZE) newTop = vh - WRAPPER_SIZE;

        wrapper.style.left = `${newLeft}px`;
        wrapper.style.top = `${newTop}px`;
    }

    function dragEnd() {
        if (isDragging) savePosition();
        isDragging = false;
    }

    wrapper.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    wrapper.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('touchend', dragEnd);

    toggleButton.addEventListener('click', () => {
        const isVisible = menu.style.display === 'block';
        menu.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            const rect = wrapper.getBoundingClientRect();
            menu.style.top = `${rect.bottom + 5}px`;
            menu.style.left = `${rect.left}px`;
        }
    });

    document.getElementById('close-hider-menu').addEventListener('click', () => {
        menu.style.display = 'none';
    });

    // Button Hiding Logic
    function hideSelectedButtons() {
        const allButtons = document.querySelectorAll('button');
        for (const btn of allButtons) {
            const label = btn.textContent.trim().toLowerCase();
            if ((settings.mug && label === 'mug') ||
                (settings.leave && label === 'leave') ||
                (settings.hospitalize && label === 'hospitalize')) {
                btn.style.setProperty('display', 'none', 'important');
            } else {
                btn.style.removeProperty('display');
            }
        }
    }

    const observer = new MutationObserver(hideSelectedButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    GM_addStyle(`
        #button-hider-wrapper {
            position: fixed;
            width: ${WRAPPER_SIZE}px;
            height: ${WRAPPER_SIZE}px;
            z-index: 9999;
            border-radius: 50%;
            cursor: grab;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: transparent;
        }

        #hider-toggle-button {
            width: ${BUTTON_SIZE}px;
            height: ${BUTTON_SIZE}px;
            background-color: #333;
            color: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 22px;
            font-weight: bold;
            box-shadow: 0 0 15px 5px #09f;
            user-select: none;
        }

        #button-hider-menu {
            display: none;
            position: absolute;
            background-color: #222;
            color: #fff;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
        }

        #button-hider-menu label {
            display: block;
            margin-bottom: 5px;
        }

        #button-hider-menu button {
            margin-top: 8px;
            padding: 4px 8px;
            background-color: #555;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        #button-hider-menu button:hover {
            background-color: #777;
        }
    `);

    hideSelectedButtons(); // initial run
})();