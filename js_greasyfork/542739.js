// ==UserScript==
// @name         Club Telegram Marker
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Иконки Telegram + кнопка копирования + кнопка кика + переход по ссылке с меню действий
// @author       Nickmur & huli.berin
// @match        */clubs/71/
// @match        */clubs/boost/?id=71&interval=week
// @match        */clubs/boost/?id=71&interval=month
// @grant        GM_xmlhttpRequest
// @license      MIT
// @connect      api.jsonbin.io
// @downloadURL https://update.greasyfork.org/scripts/542739/Club%20Telegram%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/542739/Club%20Telegram%20Marker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =================================================================================
    // GLOBAL TOOLTIP HANDLER
    // =================================================================================
    let tooltipElement;

    function createGlobalTooltip() {
        if (document.getElementById('nickmur-global-tooltip')) return;
        tooltipElement = document.createElement('div');
        tooltipElement.id = 'nickmur-global-tooltip';
        tooltipElement.style.cssText = `
            position: absolute;
            background-color: rgba(0, 0, 0, 0.9);
            color: #fff;
            padding: 5px 10px;
            border-radius: 4px;
            white-space: nowrap;
            font-size: 12px;
            z-index: 99999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease;
            pointer-events: none;
        `;
        document.body.appendChild(tooltipElement);
    }

    function showTooltip(target, text, position = 'right') {
        if (!tooltipElement) return;
        tooltipElement.textContent = text;
        tooltipElement.style.visibility = 'visible';
        tooltipElement.style.opacity = '1';

        const targetRect = target.getBoundingClientRect();
        const tipRect = tooltipElement.getBoundingClientRect();

        let top, left;
        if (position === 'top') {
            top = targetRect.top - tipRect.height - 7 + window.scrollY;
            left = targetRect.left + (targetRect.width / 2) - (tipRect.width / 2) + window.scrollX;
        } else { // 'right'
            top = targetRect.top + (targetRect.height / 2) - (tipRect.height / 2) + window.scrollY;
            left = targetRect.right + 8 + window.scrollX;
        }

        tooltipElement.style.top = `${top}px`;
        tooltipElement.style.left = `${left}px`;
    }

    function hideTooltip() {
        if (!tooltipElement) return;
        tooltipElement.style.opacity = '0';
        setTimeout(() => {
            if (tooltipElement.style.opacity === '0') {
                tooltipElement.style.visibility = 'hidden';
            }
        }, 200);
    }

    function applyHoverEffect(btn) {
        btn.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease';
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    }

    // =================================================================================
    // GLOBAL STATE FOR ACTION MENUS
    // =================================================================================
    function closeAllActionMenus() {
        document.querySelectorAll('.telegram-actions-menu').forEach(menu => menu.remove());
    }

    /*** === TELEGRAM STORAGE (CLOUD) === ***/
    const ICON_NO_TG = 'https://i.postimg.cc/7YC9W2B0/4.png';
    const ICON_HAS_TG = 'https://i.postimg.cc/XqKjjJL8/3.png';
    const BIN_ID = '6878c2b780107d5215bd7c01';
    const API_KEY = '$2a$10$uSnZeaLUvJoSnAFurgAldu.xeQx8ZT02SExbu6QTlJMRdMKODSCjW';
    const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
    let savedLinks = {};

    function fetchLinks(callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: API_URL + '?meta=false',
            headers: { 'X-Master-Key': API_KEY },
            onload: res => {
                try { savedLinks = JSON.parse(res.responseText) || {}; } catch { savedLinks = {}; }
                callback();
            },
            onerror: () => { console.error('Ошибка загрузки JSONBin'); callback(); }
        });
    }

    function updateLinksToCloud() {
        GM_xmlhttpRequest({
            method: 'PUT',
            url: API_URL,
            headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
            data: JSON.stringify(savedLinks)
        });
    }

    function addTelegramIcon(member) {
        if (member.dataset.tgProcessed === '1') return;
        const nameEl = member.querySelector('.club__member-name');
        if (!nameEl) return;

        const userName = nameEl.textContent.trim();

        const createIcon = () => {
            const hasTelegram = !!savedLinks[userName];
            const shadowStyle = hasTelegram ? 'box-shadow: 0 0 6px rgba(50, 255, 126, 0.9);' : 'box-shadow: none;';

            const iconContainer = document.createElement('div');
            iconContainer.className = 'tg-icon-container';
            iconContainer.style.cssText = `
                position: absolute; top: 5px; right: 5px;
                width: 25px; height: 25px;
                cursor: pointer; border-radius: 50%;
                transition: box-shadow 0.3s ease, transform 0.2s ease;
                ${shadowStyle}
            `;

            const icon = document.createElement('img');
            icon.src = hasTelegram ? ICON_HAS_TG : ICON_NO_TG;
            icon.alt = 'Telegram';
            icon.style.cssText = `width: 100%; height: 100%; border-radius: 50%; display: block;`;
            iconContainer.appendChild(icon);

            applyHoverEffect(iconContainer);

            iconContainer.addEventListener('mouseenter', () => {
                const hasLink = !!savedLinks[userName];
                showTooltip(iconContainer, hasLink ? `Действия для ${userName}` : `Указать телеграм для ${userName}`, 'right');
            });
            iconContainer.addEventListener('mouseleave', hideTooltip);

            iconContainer.addEventListener('click', (e) => {
                e.stopPropagation();
                hideTooltip();

                const existingMenu = member.querySelector('.telegram-actions-menu');
                if (existingMenu) {
                    existingMenu.remove();
                    return;
                }

                closeAllActionMenus();

                const tgHandle = savedLinks[userName];

                if (tgHandle) {
                    showTelegramActionsMenu(member, userName, iconContainer);
                } else {
                    const input = prompt(`Введите Telegram-ссылку или @username для ${userName}:`, '');
                    if (input !== null) {
                        if (input.trim()) {
                            savedLinks[userName] = input.trim();
                        } else {
                            delete savedLinks[userName];
                        }
                        updateLinksToCloud();
                        const userNowHasTelegram = !!savedLinks[userName];
                        icon.src = userNowHasTelegram ? ICON_HAS_TG : ICON_NO_TG;
                        iconContainer.style.boxShadow = userNowHasTelegram ? '0 0 10px rgba(50, 255, 126, 0.9)' : 'none';
                    }
                }
            });

            member.style.position = 'relative';
            member.appendChild(iconContainer);
            member.dataset.tgProcessed = '1';
        };

        const showTelegramActionsMenu = (member, userName, iconContainer) => {
            const menu = document.createElement('div');
            menu.className = 'telegram-actions-menu';
            menu.style.cssText = `
                position: absolute;
                top: 35px;
                right: 5px;
                background-color: #2c2c2e;
                border: 1px solid #444;
                border-radius: 6px;
                padding: 5px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 5px;
                width: 120px;
            `;

            const goToTgBtn = document.createElement('button');
            goToTgBtn.style.cssText = `
                background-color: #0088cc; color: white; border: none;
                padding: 8px; border-radius: 4px; cursor: pointer; text-align: left;
                display: flex; align-items: center; gap: 6px; font-size: 14px;
            `;
            applyHoverEffect(goToTgBtn);
            goToTgBtn.innerHTML = `
                <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: white;"><path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"></path></svg>
                <span>Перейти</span>
            `;
            goToTgBtn.onclick = () => {
                const cleanHandle = savedLinks[userName].startsWith('@') ? savedLinks[userName].substring(1) : savedLinks[userName];
                window.open(`https://t.me/${cleanHandle}`, '_blank');
                menu.remove();
            };

            const changeTgBtn = document.createElement('button');
            changeTgBtn.style.cssText = `
                background-color: #4b5563; color: white; border: none;
                padding: 8px; border-radius: 4px; cursor: pointer; text-align: left;
                display: flex; align-items: center; gap: 6px; font-size: 14px;
            `;
            applyHoverEffect(changeTgBtn);
            changeTgBtn.innerHTML = `
    <span style="font-size: 16px; vertical-align: middle; line-height: 1;">✎</span>
    <span>Изменить</span>
`;
            changeTgBtn.onclick = () => {
                const input = prompt(`Изменить Telegram для ${userName}:`, savedLinks[userName] || '');
                if (input !== null) {
                    if (input.trim()) {
                        savedLinks[userName] = input.trim();
                    } else {
                        delete savedLinks[userName];
                    }
                    updateLinksToCloud();
                    const icon = iconContainer.querySelector('img');
                    const userNowHasTelegram = !!savedLinks[userName];
                    icon.src = userNowHasTelegram ? ICON_HAS_TG : ICON_NO_TG;
                    iconContainer.style.boxShadow = userNowHasTelegram ? '0 0 10px rgba(50, 255, 126, 0.9)' : 'none';
                }
                menu.remove();
            };

            menu.appendChild(goToTgBtn);
            menu.appendChild(changeTgBtn);
            member.appendChild(menu);
        };

        createIcon();
    }

    function renderIcons() {
        const members = document.querySelectorAll('.nclub-enter__members-list .club__member');
        for (const member of members) { addTelegramIcon(member); }
    }

    /*** === КНОПКА КОПИРОВАНИЯ === ***/
    function initCopyButton() {
        if (!location.href.includes('/clubs/boost')) return;
        const tryInsert = () => {
            const container = document.querySelector('.tabs__nav');
            if (!container || document.getElementById('copy-tg-button')) return;

            const btn = document.createElement('button');
            btn.textContent = '📋';
            btn.id = 'copy-tg-button';
            btn.className = 'btn btn_primary';
            btn.style.cssText = `margin-left: 10px; font-size: 14px; padding: 4px 8px; cursor: pointer; background-color: #1b1b1b;`;

            btn.addEventListener('mouseenter', () => showTooltip(btn, 'Копировать список', 'top'));
            btn.addEventListener('mouseleave', hideTooltip);

            btn.addEventListener('click', () => {
                hideTooltip();
                const entries = document.querySelectorAll('.club-boost__top-item');
                const header = '№ | Логин | Телеграм | Внесено';
                const formattedLines = Array.from(entries).map((entry, index) => {
                    const nameEl = entry.querySelector('.club-boost__top-name');
                    const contribEl = entry.querySelector('.club-boost__top-contribution');
                    if (!nameEl || !contribEl) return null;
                    const name = nameEl.textContent.trim();
                    const tg = savedLinks[name] || 'N/A';
                    const contrib = contribEl.textContent.trim();
                    return `${index + 1} | ${name} | ${tg} | ${contrib}`;
                }).filter(line => line);
                const finalText = [header, ...formattedLines].join('\n');

                const showCopyMessage = () => {
                    btn.textContent = '✅';
                    showTooltip(btn, 'Скопировано!', 'top');
                    setTimeout(() => {
                        hideTooltip();
                        btn.textContent = '📋';
                    }, 2000);
                };

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(finalText).then(showCopyMessage).catch(() => fallbackCopy(finalText, showCopyMessage));
                } else {
                    fallbackCopy(finalText, showCopyMessage);
                }
            });
            const fallbackCopy = (text, callback) => {
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
                callback();
            };

            container.appendChild(btn);
        };
        const interval = setInterval(() => {
            tryInsert();
            if (document.getElementById('copy-tg-button')) clearInterval(interval);
        }, 300);
    }

    /*** === КНОПКИ ИСКЛЮЧЕНИЯ === ***/
    function initKickButtons() {
        if (!location.href.includes('/clubs/boost')) return;
        const fallbackCopy = (text, callback) => {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            if(callback) callback();
        };
        const performKick = (userName) => {
            return new Promise((resolve, reject) => {
                const iframe = document.createElement('iframe');
                iframe.src = 'https://animestars.org/clubs/71/members/';
                iframe.style.display = 'none';

                iframe.onload = () => {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        const memberElements = iframeDoc.querySelectorAll('.club-request__list .club-request__item');
                        let targetMemberEl = null;

                        memberElements.forEach(memberEl => {
                            const name = memberEl.querySelector('.club-request__name')?.textContent.trim();
                            if (name === userName) {
                                targetMemberEl = memberEl;
                            }
                        });
                        if (!targetMemberEl) {
                            throw new Error(`Участник ${userName} не найден на странице`);
                        }

                        const kickButton = targetMemberEl.querySelector('button.club-kick-btn');
                        if (!kickButton) {
                            throw new Error('Кнопка кика не найдена');
                        }

                        kickButton.click();
                        setTimeout(() => {
                            const confirmDialog = iframeDoc.querySelector('.dle-popup-confirm');
                            if (!confirmDialog) {
                                return reject(new Error('Окно подтверждения не появилось'));
                            }

                            const confirmButton = Array.from(confirmDialog.parentElement.querySelectorAll('.ui-dialog-buttonset button'))
                            .find(b => b.textContent === 'Подтвердить');

                            if (confirmButton) {
                                confirmButton.click();
                                document.body.removeChild(iframe);
                                resolve();
                            } else {
                                reject(new Error('Кнопка "Подтвердить" не найдена'));
                            }
                        }, 500);
                    } catch (e) {
                        document.body.removeChild(iframe);
                        reject(e);
                    }
                };
                iframe.onerror = () => reject(new Error('Не удалось загрузить iframe'));
                document.body.appendChild(iframe);
            });
        };
        const addKickButton = (memberItem) => {
            const nameEl = memberItem.querySelector('.club-boost__top-name');
            if (!nameEl) return;

            const userName = nameEl.textContent.trim();
            const btn = document.createElement('button');
            btn.className = 'kick-from-club-btn';
            btn.style.cssText = `
                display: inline-block;
                width: 25px; height: 25px;
                cursor: pointer; border: none; border-radius: 4px;
                background-color: #e53935; margin-left: 8px;
                vertical-align: middle; padding: 0; line-height: 25px;
            `;

            btn.innerHTML = `<svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: white; vertical-align: middle;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;
            applyHoverEffect(btn);
            btn.addEventListener('mouseenter', () => showTooltip(btn, `Выгнать ${userName} из клуба`, 'top'));
            btn.addEventListener('mouseleave', hideTooltip);
            btn.addEventListener('click', async () => {
                if (!confirm(`Вы уверены, что хотите выгнать ${userName} из клуба?`)) return;

                hideTooltip();
                btn.disabled = true;
                btn.style.backgroundColor = '#fdd835';
                btn.innerHTML = '...';

                try {
                    await performKick(userName);
                    const tgLink = savedLinks[userName] || '';
                    if (tgLink) {
                        fallbackCopy(tgLink, () => showTooltip(btn, `Игрок исключен! TG скопирован: ${tgLink}`, 'top'));
                    } else {
                        showTooltip(btn, 'Игрок исключен! (ТГ не найден)', 'top');
                    }
                    btn.style.backgroundColor = '#4CAF50';
                    btn.innerHTML = `<svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: white; vertical-align: middle;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>`;
                    setTimeout(hideTooltip, 2500);
                } catch (error) {
                    console.error(error);
                    showTooltip(btn, `Ошибка: ${error.message}`, 'top');
                    btn.disabled = false;
                    btn.style.backgroundColor = '#e53935';
                    btn.innerHTML = `<svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: white; vertical-align: middle;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;
                    setTimeout(hideTooltip, 2500);
                }
            });

            nameEl.parentNode.insertBefore(btn, nameEl.nextSibling);
            memberItem.dataset.kickButtonProcessed = 'true';
        };

        const processNewMembers = () => {
            const unprocessedMembers = document.querySelectorAll('.club-boost__top-item:not([data-kick-button-processed])');
            unprocessedMembers.forEach(addKickButton);
        };

        setInterval(processNewMembers, 500);
    }


    /*** === ИНИЦИАЛИЗАЦИЯ === ***/
    function initialize() {
        fetchLinks(() => {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(renderIcons);
            } else {
                setTimeout(renderIcons, 300);
            }
            initCopyButton();
            initKickButtons();
        });
    }

    // Запускаем весь процесс
    createGlobalTooltip();
    initialize();
    document.addEventListener('click', closeAllActionMenus);

})();