// ==UserScript==
// @name         CHZZK QuickTag
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  치지직에서 즐겨찾는 태그/게임 버튼을 직접 만들어 한 번에 이동할 수 있게 도와줍니다.
// @match        https://chzzk.naver.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535946/CHZZK%20QuickTag.user.js
// @updateURL https://update.greasyfork.org/scripts/535946/CHZZK%20QuickTag.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const STORAGE_KEY = 'CHZZK_QuickTag';
    const ETC_TAGS = ['music', 'talk', 'art', 'asmr'];

    const loadButtons = async () => await GM.getValue(STORAGE_KEY, []);
    const saveButtons = async (buttons) => await GM.setValue(STORAGE_KEY, buttons);
    const clearButtons = async () => await GM.deleteValue(STORAGE_KEY);

    const findTabArea = () => {
        return Array.from(document.querySelectorAll('button'))
            .map(btn => btn.closest('div'))
            .find(div => {
                const texts = Array.from(div.querySelectorAll('button')).map(b => b.textContent.trim());
                return ['인기', '최신', '추천'].every(t => texts.includes(t));
            });
    };

    const createTagButton = (label, color, className, isGame, isEtc, targetText = label) => {
        const button = document.createElement('button');
        button.textContent = label;
        button.className = className;
        button.style.cssText = `margin-left: 8px; background-color: ${color}; color: white; display: flex; align-items: center; justify-content: center; padding-right: 4px;`;

        const delBtn = document.createElement('span');
        delBtn.textContent = ' ×';
        delBtn.style.cssText = `margin-left: 6px; cursor: pointer; padding: 4px; background-color: #ccc; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 14px;`;

        delBtn.onclick = async (e) => {
            e.stopPropagation();
            const saved = (await loadButtons()).filter(btn => btn.label !== label);
            await saveButtons(saved);
            button.remove();
        };

        button.onclick = () => {
            const url = isEtc
                ? `https://chzzk.naver.com/category/ETC/${encodeURIComponent(targetText)}/lives`
                : isGame
                    ? `https://chzzk.naver.com/category/GAME/${encodeURIComponent(targetText)}/lives`
                    : `https://chzzk.naver.com/lives?tags=${encodeURIComponent(targetText)}`;
            window.location.href = url;
        };

        button.appendChild(delBtn);
        return button;
    };

    const createSettingsButton = (className, container) => {
        const iconBtn = document.createElement('button');
        iconBtn.style.cssText = `background-color: #666; color: white; width: 32px; height: 32px; border-radius: 50%; border: none; cursor: pointer; margin-left: 8px; display: flex; align-items: center; justify-content: center;`;
        iconBtn.className = className;

        const icon = document.createElement('i');
        icon.className = 'fas fa-cog';
        icon.style.fontSize = '16px';
        iconBtn.appendChild(icon);

        iconBtn.onclick = (e) => toggleInputPanel(container, e);

        return iconBtn;
    };

    const toggleInputPanel = async (container, event) => {
        let panel = document.getElementById('tag-input-panel');
        if (panel) {
            panel.remove();
            return;
        }

        panel = document.createElement('div');
        panel.id = 'tag-input-panel';
        panel.style.cssText = `position: fixed; display: flex; flex-direction: column; gap: 8px; background: white; border: 1px solid #ccc; padding: 12px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); z-index: 999;`;

        const labelInput = document.createElement('input');
        labelInput.type = 'text';
        labelInput.placeholder = '버튼 이름(선택)';
        labelInput.style.cssText = `
            padding: 6px;
            border: 2px solid #444;
            border-radius: 4px;
            font-size: 14px;
            width: 200px;
            color: #000;
            font-weight: bold;
            margin-bottom: 6px;
        `;

        const inputStyle = 'padding: 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; width: 200px; color: #000;';

        const tagInput = document.createElement('input');
        tagInput.type = 'text';
        tagInput.placeholder = '태그 입력';
        tagInput.style.cssText = inputStyle;

        const gameInput = document.createElement('input');
        gameInput.type = 'text';
        gameInput.placeholder = '게임 입력';
        gameInput.style.cssText = inputStyle;

        const tagColorInput = document.createElement('input');
        tagColorInput.type = 'color';
        tagColorInput.value = '#6c63ff';
        tagColorInput.style.width = '50px';
        tagColorInput.title = '버튼 색상';

        const addBtn = document.createElement('button');
        addBtn.textContent = '버튼 추가';
        addBtn.style.cssText = `padding: 6px; border: none; border-radius: 4px; background-color: #444; color: white; cursor: pointer;`;

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '모든 버튼 삭제';
        clearBtn.style.cssText = `padding: 6px; border: none; border-radius: 4px; background-color: #c00; color: white; cursor: pointer;`;

        addBtn.onclick = async () => {
            let label = labelInput.value.trim();
            const tagText = tagInput.value.trim();
            const gameText = gameInput.value.trim();
            const color = tagColorInput.value;

            if (!tagText && !gameText) return alert('태그나 게임을 입력해주세요.');

            if (!label) {
                label = tagText || gameText;
            }

            const saved = await loadButtons();
            if (saved.some(btn => btn.label === label)) return alert('이미 존재하는 이름의 버튼입니다.');

            const baseClass = container.querySelector('button')?.className || '';

            if (tagText) {
                const isEtc = ETC_TAGS.includes(tagText.toLowerCase());
                saved.push({ label, text: tagText, color, isGame: false, isEtc });
                const tagBtn = createTagButton(label, color, baseClass, false, isEtc, tagText);
                container.insertBefore(tagBtn, container.lastElementChild);
            }

            if (gameText) {
                const isEtc = ETC_TAGS.includes(gameText.toLowerCase());
                saved.push({ label, text: gameText, color, isGame: !isEtc, isEtc });
                const gameBtn = createTagButton(label, color, baseClass, !isEtc, isEtc, gameText);
                container.insertBefore(gameBtn, container.lastElementChild);
            }

            await saveButtons(saved);
            labelInput.value = '';
            tagInput.value = '';
            gameInput.value = '';
            panel.remove();
        };

        clearBtn.onclick = async () => {
            await clearButtons();
            Array.from(container.querySelectorAll('button')).forEach(btn => {
                const text = btn.textContent.trim();
                if (!['인기', '최신', '추천'].includes(text)) {
                    btn.remove();
                }
            });
            panel.remove();
        };

        panel.append(labelInput, tagInput, gameInput, tagColorInput, addBtn, clearBtn);

        const rect = event.currentTarget.getBoundingClientRect();
        panel.style.top = `${rect.bottom + 4}px`;
        panel.style.left = `${rect.left}px`;

        document.body.appendChild(panel);
    };

    const renderButtons = async () => {
        const container = findTabArea();
        if (!container || container.dataset.enhanced) return;

        container.style.cssText = `display: flex; flex-wrap: wrap; align-items: center; row-gap: 8px; column-gap: 8px; max-width: calc(100% - 300px); overflow: visible;`;

        const baseBtn = container.querySelector('button');
        const baseClass = baseBtn?.className || '';

        const savedButtons = await loadButtons();
        savedButtons.forEach(({ label, text, color, isGame, isEtc }) => {
            const btn = createTagButton(label, color, baseClass, isGame, isEtc, text);
            container.appendChild(btn);
        });

        const settingsBtn = createSettingsButton(baseClass, container);
        container.appendChild(settingsBtn);

        container.dataset.enhanced = true;
    };

const observeUrlChange = () => {
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;

            const retryRender = (retries = 0) => {
                const container = findTabArea();
                if (container && !container.dataset.enhanced) {
                    renderButtons();
                } else if (retries < 10) {
                    setTimeout(() => retryRender(retries + 1), 200);
                }
            };
            retryRender();
        }
    }, 200);
};

    const loadFontAwesome = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
        document.head.appendChild(link);
    };

    loadFontAwesome();
    observeUrlChange();
    renderButtons();
})();
