// ==UserScript==
// @name         MWI Avatar and Name Replacer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Overlay avatar with custom image and name, hide original SVG <use>, and provide UI to change avatar.
// @author       Pythius-Demon
// @match        https://www.milkywayidle.com/game*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541765/MWI%20Avatar%20and%20Name%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/541765/MWI%20Avatar%20and%20Name%20Replacer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentImageURL = localStorage.getItem('customAvatarURL') || '';
    let customAvatarName = localStorage.getItem('customAvatarName') || '';

    function updateOverlayPosition() {
        const topRightUse = document.querySelector('svg use[href*="avatar_outfits_sprite"]:not(.combat)');
        if (topRightUse) {
            const container = topRightUse.closest('g') || topRightUse.closest('svg') || topRightUse;
            const rect = container.getBoundingClientRect();

            let overlay = document.getElementById('custom-avatar-overlay-top');
            if (!overlay) {
                overlay = document.createElement('img');
                overlay.id = 'custom-avatar-overlay-top';
                overlay.style.position = 'fixed';
                overlay.style.pointerEvents = 'none';
                overlay.style.objectFit = 'cover';
                overlay.style.zIndex = '9999';
                document.body.appendChild(overlay);
            }

            if (currentImageURL) {
                topRightUse.style.visibility = 'hidden';
                overlay.style.left = rect.left + 'px';
                overlay.style.top = rect.top + 'px';
                overlay.style.width = rect.width + 'px';
                overlay.style.height = rect.height + 'px';
                overlay.src = currentImageURL;
                overlay.style.display = 'block';
            } else {
                topRightUse.style.visibility = 'visible';
                overlay.style.display = 'none';
                overlay.src = '';
            }
        }

        const combatHeader = document.querySelector('.CombatPanel_title__WUVp8');
        const isCombatTask = combatHeader?.firstElementChild?.textContent?.trim().toLowerCase() === 'combat';

        const combatUse = document.querySelector('.CombatUnit_unitIconContainer__kVrff svg use[href*="avatar_outfits_sprite"]');
        const existingOverlay = document.getElementById('custom-avatar-overlay-combat');

        if (!isCombatTask) {
            if (existingOverlay) existingOverlay.remove();
            if (combatUse) combatUse.style.visibility = 'visible';
            return;
        }

        if (combatUse && isCombatTask) {
            const avatarBox = document.querySelector('.CombatUnit_unitIconContainer__kVrff');
            if (!avatarBox) return;

            let overlay = existingOverlay;
            if (!overlay) {
                overlay = document.createElement('img');
                overlay.id = 'custom-avatar-overlay-combat';
                overlay.style.position = 'absolute';
                overlay.style.pointerEvents = 'none';
                overlay.style.objectFit = 'cover';
                overlay.style.zIndex = '0';
                avatarBox.style.position = 'relative';
                avatarBox.insertBefore(overlay, avatarBox.firstChild);
            }

            overlay.style.left = '0';
            overlay.style.top = '0';
            overlay.style.width = avatarBox.clientWidth + 'px';
            overlay.style.height = avatarBox.clientHeight + 'px';

            if (currentImageURL) {
                combatUse.style.visibility = 'hidden';
                overlay.src = currentImageURL;
                overlay.style.display = 'block';
            } else {
                combatUse.style.visibility = 'visible';
                overlay.style.display = 'none';
                overlay.src = '';
            }
        }
    }

    function updateAvatarName() {
        const nameDiv = document.querySelector('.CharacterName_name__1amXp span');
        if (nameDiv) {
            if (customAvatarName) {
                nameDiv.textContent = customAvatarName;
            } else {
                nameDiv.textContent = nameDiv.parentElement.getAttribute('data-name') || 'Avatar';
            }
        }
    }

    function createUI() {
        const wrapper = document.createElement('div');
        wrapper.id = 'custom-avatar-ui';
        wrapper.style.position = 'absolute';
        wrapper.style.zIndex = '10000';
        wrapper.style.fontFamily = 'Arial, sans-serif';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'flex-start';
        wrapper.style.gap = '6px';
        wrapper.style.pointerEvents = 'auto';

        const panel = document.createElement('div');
        panel.style.background = '#111';
        panel.style.border = '1px solid #0f0';
        panel.style.borderRadius = '10px';
        panel.style.padding = '8px';
        panel.style.display = 'none';
        panel.style.flexDirection = 'column';
        panel.style.gap = '6px';
        panel.style.width = '240px';
        panel.style.color = '#fff';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Paste image URL';
        input.style.padding = '6px';
        input.style.borderRadius = '4px';
        input.style.border = '1px solid #ccc';
        input.style.width = '100%';
        input.value = currentImageURL;

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Enter custom avatar name';
        nameInput.style.padding = '6px';
        nameInput.style.borderRadius = '4px';
        nameInput.style.border = '1px solid #ccc';
        nameInput.style.width = '100%';
        nameInput.value = customAvatarName;

        const applyBtn = document.createElement('button');
        applyBtn.innerText = 'Apply';
        applyBtn.style.padding = '5px';
        applyBtn.style.background = '#222';
        applyBtn.style.border = '1px solid #0f0';
        applyBtn.style.color = '#0f0';
        applyBtn.style.borderRadius = '4px';
        applyBtn.style.cursor = 'pointer';

        applyBtn.onclick = () => {
            const newURL = input.value.trim();
            const newName = nameInput.value.trim();

            if (newURL) {
                localStorage.setItem('customAvatarURL', newURL);
                currentImageURL = newURL;
            } else {
                localStorage.removeItem('customAvatarURL');
                currentImageURL = '';
            }

            if (newName) {
                localStorage.setItem('customAvatarName', newName);
                customAvatarName = newName;
            } else {
                localStorage.removeItem('customAvatarName');
                customAvatarName = '';
            }

            updateOverlayPosition();
            updateAvatarName();
        };

        panel.appendChild(input);
        panel.appendChild(nameInput);
        panel.appendChild(applyBtn);
        wrapper.appendChild(panel);

        const toggleBtn = document.createElement('div');
        toggleBtn.title = 'Toggle Avatar Input';
        toggleBtn.style.width = '16px';
        toggleBtn.style.height = '16px';
        toggleBtn.style.borderRadius = '50%';
        toggleBtn.style.backgroundColor = '#0f0';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.boxShadow = '0 0 4px #0f0';
        toggleBtn.style.position = 'absolute';
        toggleBtn.style.bottom = '-8px';
        toggleBtn.style.right = '-8px';
        toggleBtn.style.zIndex = '10001';

        toggleBtn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
            toggleBtn.style.backgroundColor = panel.style.display === 'flex' ? '#b00' : '#0f0';
            toggleBtn.style.boxShadow = panel.style.display === 'flex' ? '0 0 6px #b00' : '0 0 4px #0f0';

            if (panel.style.display === 'flex') {
                panel.style.position = 'absolute';
                panel.style.top = '100%';
                panel.style.left = 'auto';
                panel.style.right = '0';
            }
        });

        wrapper.appendChild(toggleBtn);

        const interval = setInterval(() => {
            const avatar = document.querySelector('.FullAvatar_fullAvatar__3RB2h');
            if (avatar && avatar.offsetParent !== null) {
                const rect = avatar.getBoundingClientRect();
                wrapper.style.left = rect.left + window.scrollX + rect.width - wrapper.offsetWidth + 'px';
                wrapper.style.top = rect.top + window.scrollY + rect.height + 'px';
            }
        }, 500);

        document.body.appendChild(wrapper);
    }

    function injectCustomAvatarHTML() {
        const combatHeader = document.querySelector('.CombatPanel_title__WUVp8');
        const isCombatTask = combatHeader?.firstElementChild?.textContent?.trim().toLowerCase() === 'combat';

        if (!isCombatTask) return;

        if (!document.querySelector('.CombatUnit_unitIconContainer__kVrff')) {
            const div = document.createElement('div');
            div.className = 'CombatUnit_unitIconContainer__kVrff';
            div.style.position = 'fixed';
            div.style.top = '200px';
            div.style.left = '10px';
            div.style.zIndex = '9999';

            const avatarHTML = `
                <div class="FullAvatar_fullAvatar__3RB2h">
                    <div class="FullAvatar_avatar__2w8kS">
                        <svg role="img" aria-label="avatar" class="Icon_icon__2LtL_" width="100%" height="100%">
                            <use href="/static/media/avatars_sprite.4dea577e.svg#person_default"></use>
                        </svg>
                    </div>
                    <div class="FullAvatar_avatarOutfit__3GHXg">
                        <svg role="img" aria-label="avatar outfit" class="Icon_icon__2LtL_" width="100%" height="100%">
                            <use href="/static/media/avatar_outfits_sprite.b1f4dc7f.svg#tshirt_default"></use>
                        </svg>
                    </div>
                </div>`;

            div.innerHTML = avatarHTML;
            document.body.appendChild(div);
            console.log('[MWI] Combat avatar block injected.');
        }
    }

    function waitForGameAndInject() {
        const anchor = document.querySelector('.CharacterName_name__1amXp span');
        if (!anchor) {
            setTimeout(waitForGameAndInject, 500);
            return;
        }

        createUI();
        updateOverlayPosition();
        updateAvatarName();
        injectCustomAvatarHTML();
        window.addEventListener('resize', updateOverlayPosition);
        window.addEventListener('scroll', updateOverlayPosition);
        setInterval(() => {
            updateOverlayPosition();
            injectCustomAvatarHTML();
        }, 2000);
    }

    waitForGameAndInject();
})();
