// ==UserScript==
// @name         Google Meet — Старые иконки + Панель (сворачиваемая)
// @namespace    http://tampermonkey.net/
// @version      13.0
// @description  Кастомные иконки Google Meet: камера, микрофон, субтитры, экран, реакция, рука
// @match        https://meet.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537411/Google%20Meet%20%E2%80%94%20%D0%A1%D1%82%D0%B0%D1%80%D1%8B%D0%B5%20%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D0%B8%20%2B%20%D0%9F%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C%20%28%D1%81%D0%B2%D0%BE%D1%80%D0%B0%D1%87%D0%B8%D0%B2%D0%B0%D0%B5%D0%BC%D0%B0%D1%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537411/Google%20Meet%20%E2%80%94%20%D0%A1%D1%82%D0%B0%D1%80%D1%8B%D0%B5%20%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D0%B8%20%2B%20%D0%9F%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C%20%28%D1%81%D0%B2%D0%BE%D1%80%D0%B0%D1%87%D0%B8%D0%B2%D0%B0%D0%B5%D0%BC%D0%B0%D1%8F%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const iconMap = {
        microphone: {
            on: 'https://i.ibb.co/0ypcDvsX/micro-23off.png',
            off: 'https://i.ibb.co/JWNy9rkY/micro-23on.png',
        },
        camera: {
            on: 'https://i.ibb.co/XxYyJnBZ/webcam-o2ff.png',
            off: 'https://i.ibb.co/cXpsBL6c/webcam-2on.png',
        },
        end: 'https://i.ibb.co/gFVNHBsc/end-the-ca23ll.png',
        screen: 'https://i.ibb.co/qFkpGm9s/show-scr2een.png',
        hand: {
            on: 'https://i.ibb.co/GvPhVWNR/raise-your-ha2nd.png',
            off: 'https://i.ibb.co/bMGwygGX/raise-your-ha2ndon.png',
        },
        subtitles: 'https://i.ibb.co/LDk0PFhX/su2btitles.png',
        reaction: 'https://i.ibb.co/Hp3k5y8T/send-a-re2sponse.png',
    };

    function getIconByLabel(label = '') {
        label = label.toLowerCase();

        if (label.includes('micro') || label.includes('мікрофон')) {
            return label.includes('off') || label.includes('вимк') ? iconMap.microphone.off : iconMap.microphone.on;
        }
        if (label.includes('camera') || label.includes('камера')) {
            return iconMap.camera.off;
        }
        if (label.includes('leave') || label.includes('вийти')) return iconMap.end;
        if (label.includes('screen') || label.includes('екран') || label.includes('present')) return iconMap.screen;
        if (label.includes('hand') || label.includes('руку')) {
            return label.includes('опуст') || label.includes('вимк') ? iconMap.hand.off : iconMap.hand.on;
        }
        if (label.includes('caption') || label.includes('subtitle') || label.includes('субтитри')) return iconMap.subtitles;
        if (label.includes('emoji') || label.includes('реакц')) return iconMap.reaction;

        return null;
    }

    function getStoredIconSize() {
        const size = parseInt(localStorage.getItem('customIconSize'), 10);
        return isNaN(size) ? 28 : Math.min(Math.max(size, 16), 64);
    }

    function replaceIcon(button) {
        const label = button.getAttribute('aria-label') ||
                      button.getAttribute('data-tooltip') ||
                      button.title ||
                      button.innerText ||
                      '';

        const iconUrl = getIconByLabel(label);
        if (!iconUrl) return;

        let existingImg = button.querySelector('.overlay-old-icon');
        if (existingImg && existingImg.src === iconUrl) return;
        if (existingImg) existingImg.remove();

        Array.from(button.querySelectorAll(':scope > svg, :scope > img')).forEach(el => {
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
        });

        const img = document.createElement('img');
        img.src = iconUrl;
        img.className = 'overlay-old-icon';
        img.style.position = 'absolute';
        img.style.top = '50%';
        img.style.left = '50%';
        img.style.transform = 'translate(-50%, -50%)';
        img.style.pointerEvents = 'none';
        img.style.zIndex = '10';
        img.style.width = img.style.height = getStoredIconSize() + 'px';

        const computedStyle = window.getComputedStyle(button);
        if (computedStyle.position === 'static') {
            button.style.position = 'relative';
        }

        button.appendChild(img);
    }

    function scanAndReplaceButtons(root = document.body) {
        const buttons = [];
        function collectButtons(node) {
            if (!node || node.nodeType !== 1) return;
            if (node.tagName === 'BUTTON') buttons.push(node);
            if (node.shadowRoot) collectButtons(node.shadowRoot);
            node.childNodes.forEach(collectButtons);
        }
        collectButtons(root);
        buttons.forEach(replaceIcon);
    }

    const observer = new MutationObserver(() => {
        scanAndReplaceButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    scanAndReplaceButtons();

    // Панель настройки
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.bottom = '8px';
    wrapper.style.right = '8px';
    wrapper.style.zIndex = '9999';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = '⚙️';
    toggleButton.style.fontSize = '16px';
    toggleButton.style.padding = '4px 8px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.marginBottom = '4px';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.border = '1px solid #ccc';
    toggleButton.style.background = '#f0f0f0';

    const panel = document.createElement('div');
    panel.style.background = 'white';
    panel.style.border = '1px solid #ccc';
    panel.style.borderRadius = '5px';
    panel.style.padding = '6px';
    panel.style.fontSize = '12px';
    panel.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

    const input = document.createElement('input');
    input.type = 'number';
    input.min = 16;
    input.max = 64;
    input.value = getStoredIconSize();
    input.style.width = '60px';
    input.style.marginRight = '4px';

    const buttonApply = document.createElement('button');
    buttonApply.textContent = 'Применить';
    buttonApply.style.marginRight = '4px';

    const buttonReload = document.createElement('button');
    buttonReload.textContent = 'Обновить';

    buttonApply.onclick = () => {
        localStorage.setItem('customIconSize', input.value);
        scanAndReplaceButtons();
    };

    buttonReload.onclick = () => {
        scanAndReplaceButtons();
    };

    panel.append('Размер иконок: ', input, buttonApply, buttonReload);

    const reactButton = document.createElement('button');
    reactButton.textContent = '🎉 Реакция';
    reactButton.style.marginTop = '4px';
    reactButton.onclick = () => {
        alert('Реакция отправлена! 🎉');
    };
    panel.appendChild(document.createElement('br'));
    panel.appendChild(reactButton);

    toggleButton.onclick = () => {
        const isHidden = panel.style.display === 'none';
        panel.style.display = isHidden ? 'block' : 'none';
        localStorage.setItem('showIconPanel', isHidden ? '1' : '0');
    };

    const showPanel = localStorage.getItem('showIconPanel');
    panel.style.display = showPanel === '0' ? 'none' : 'block';

    wrapper.appendChild(toggleButton);
    wrapper.appendChild(panel);
    document.body.appendChild(wrapper);
})();
