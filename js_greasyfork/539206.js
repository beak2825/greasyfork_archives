// ==UserScript==
// @name         Scroll Button | by Solid | v3
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Добавляет анимированную кнопку прокрутки вверх с настройками в меню LztScrollButton.
// @author       solid
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @icon         https://i.ibb.co/qMy4vtTK/solid-tampermonkey.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539206/Scroll%20Button%20%7C%20by%20Solid%20%7C%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/539206/Scroll%20Button%20%7C%20by%20Solid%20%7C%20v3.meta.js
// ==/UserScript==
(function() {
    'use strict';
 
    let isVisible = false;
    let lastScrollTop = 0;
    let settings = JSON.parse(localStorage.getItem('LztScrollButtonSettings')) || {
        isCustomScrollEnabled: true,
        hideDefaultScroll: true,
        position: 'bottom-right',
        customPosition: null
    };
    let tempSettings = { ...settings };
    let isDragging = false;
 
    const customButton = document.createElement('div');
    Object.assign(customButton.style, {
        position: 'fixed',
        bottom: '15px',
        right: '15px',
        width: '60px',
        height: '60px',
        backgroundColor: 'rgb(34, 142, 93)',
        borderRadius: '50%',
        textAlign: 'center',
        cursor: 'pointer',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.2s ease-in-out, background-color 0.2s ease-in-out',
        visibility: 'hidden'
    });
 
    // Медиа-запрос для скрытия кнопки при ширине экрана < 1260px
    const mediaQuery = window.matchMedia('(max-width: 1260px)');
    const handleMediaQuery = (e) => {
        customButton.style.display = e.matches ? 'none' : 'block';
    };
    mediaQuery.addEventListener('change', handleMediaQuery);
    handleMediaQuery(mediaQuery);
 
    const arrowIcon = document.createElement('i');
    arrowIcon.className = 'fas fa-arrow-up';
    arrowIcon.style.cssText = `
        font-family: 'Font Awesome 5 Pro';
        font-weight: 600;
        color: rgb(39, 39, 39);
        font-size: 30px;
        line-height: 60px;
    `;
    customButton.appendChild(arrowIcon);
 
    const updateButtonPosition = () => {
        if (isDragging) return;
 
        const navHeight = document.querySelector('#navigation')?.offsetHeight || 0;
        const headerHeight = document.querySelector('.Market_Up_Header')?.offsetHeight || 0;
        const offset = 15;
 
        if (settings.position === 'custom' && settings.customPosition) {
            customButton.style.left = `${settings.customPosition.x}px`;
            customButton.style.top = `${settings.customPosition.y}px`;
            customButton.style.right = 'auto';
            customButton.style.bottom = 'auto';
        } else {
            switch (settings.position) {
                case 'bottom-right':
                    customButton.style.right = `${offset}px`;
                    customButton.style.bottom = `${offset}px`;
                    customButton.style.left = 'auto';
                    customButton.style.top = 'auto';
                    break;
                case 'middle-right':
                    customButton.style.right = `${offset}px`;
                    customButton.style.top = `calc(50% - 30px)`;
                    customButton.style.bottom = 'auto';
                    customButton.style.left = 'auto';
                    break;
                case 'top-right':
                    customButton.style.right = `${offset}px`;
                    customButton.style.top = `${navHeight + headerHeight + offset}px`;
                    customButton.style.bottom = 'auto';
                    customButton.style.left = 'auto';
                    break;
                case 'bottom-left':
                    customButton.style.left = `${offset}px`;
                    customButton.style.bottom = `${offset}px`;
                    customButton.style.right = 'auto';
                    customButton.style.top = 'auto';
                    break;
                case 'middle-left':
                    customButton.style.left = `${offset}px`;
                    customButton.style.top = `calc(50% - 30px)`;
                    customButton.style.bottom = 'auto';
                    customButton.style.right = 'auto';
                    break;
                case 'top-left':
                    customButton.style.left = `${offset}px`;
                    customButton.style.top = `${navHeight + headerHeight + offset}px`;
                    customButton.style.bottom = 'auto';
                    customButton.style.right = 'auto';
                    break;
            }
        }
    };
 
    const saveSettings = () => {
        settings = { ...tempSettings };
        localStorage.setItem('LztScrollButtonSettings', JSON.stringify(settings));
        updateButtonPosition();
        hideDefaultButton();
        if (!settings.isCustomScrollEnabled && isVisible) {
            customButton.style.opacity = '0';
            setTimeout(() => {
                customButton.style.visibility = 'hidden';
                isVisible = false;
            }, 200);
        } else if (settings.isCustomScrollEnabled && window.pageYOffset > 0) {
            showButton();
        }
    };
 
    const hideDefaultButton = () => {
        const defaultButton = document.querySelector('.cd-top');
        if (defaultButton) defaultButton.style.display = settings.hideDefaultScroll ? 'none' : 'block';
    };
 
    customButton.addEventListener('mouseenter', () => {
        if (!isDragging) customButton.style.backgroundColor = 'rgb(30, 125, 82)';
    });
 
    customButton.addEventListener('mouseleave', () => {
        if (!isDragging) customButton.style.backgroundColor = 'rgb(34, 142, 93)';
    });
 
    const showButton = () => {
        if (settings.isCustomScrollEnabled && !isVisible) {
            customButton.style.visibility = 'visible';
            customButton.style.opacity = '1';
            isVisible = true;
        }
    };
 
    const hideButton = () => {
        if (!window.pageYOffset) {
            customButton.style.opacity = '0';
            setTimeout(() => {
                if (!window.pageYOffset) {
                    customButton.style.visibility = 'hidden';
                    isVisible = false;
                } else {
                    customButton.style.opacity = '1';
                }
            }, 200);
        }
    };
 
    customButton.addEventListener('click', (e) => {
        if (!isDragging) {
            e.preventDefault();
            const $ = window.jQuery || window.$;
            if ($) {
                $('html, body').animate({ scrollTop: 0 }, 500, () => {
                    hideButton();
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(hideButton, 500);
            }
        }
    });
 
    const handleScroll = () => {
        const currentScrollTop = window.pageYOffset;
        if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
            showButton();
        } else if (!currentScrollTop) {
            hideButton();
        }
        lastScrollTop = currentScrollTop;
    };
 
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
        updateButtonPosition();
        if (window.pageYOffset > 0) showButton();
    }, { passive: true });
 
    const init = () => {
        document.body.appendChild(customButton);
        hideDefaultButton();
        updateButtonPosition();
        if (window.pageYOffset > 0) showButton();
        lastScrollTop = window.pageYOffset;
 
        const accountMenu = document.getElementById('AccountMenu');
        if (accountMenu) {
            const profileSettingsLi = accountMenu.querySelector('a[href="account/personal-details"]').parentElement;
            const scrollButtonLi = document.createElement('li');
            scrollButtonLi.innerHTML = '<a href="#" class="scrollSettingsTrigger">Кнопка прокрутки</a>';
            profileSettingsLi.insertAdjacentElement('afterend', scrollButtonLi);
 
            const overlay = document.createElement('div');
            overlay.id = 'overlay_lzt_scroll';
            overlay.style.cssText = `
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 10001;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: none;
            `;
            document.body.appendChild(overlay);
 
            const menu = document.createElement('div');
            menu.className = 'LztScrollButtonMenu';
            menu.style.cssText = `
                text-align: center;
                position: fixed;
                top: 50%;
                left: 50%;
                z-index: 10002;
                transform: translate(-50%, -50%);
                background-color: #272727;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                display: none;
                color: #e4e4e4;
                font-family: Arial, sans-serif;
            `;
            menu.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div style="font-size: 14px;">LztScrollButton</div>
                    <div class="closeButton" style="cursor: pointer; font-size: 18px;">✖</div>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Расположение:</label>
                    <select id="scrollPosition" style="width: 100%; padding: 5px; background: #333; color: #e4e4e4; border: 1px solid #555; border-radius: 5px;">
                        <option value="bottom-right" ${tempSettings.position === 'bottom-right' ? 'selected' : ''}>Справа внизу</option>
                        <option value="middle-right" ${tempSettings.position === 'middle-right' ? 'selected' : ''}>Справа посередине</option>
                        <option value="top-right" ${tempSettings.position === 'top-right' ? 'selected' : ''}>Справа вверху</option>
                        <option value="bottom-left" ${tempSettings.position === 'bottom-left' ? 'selected' : ''}>Слева внизу</option>
                        <option value="middle-left" ${tempSettings.position === 'middle-left' ? 'selected' : ''}>Слева посередине</option>
                        <option value="top-left" ${tempSettings.position === 'top-left' ? 'selected' : ''}>Слева вверху</option>
                        <option value="custom" ${tempSettings.position === 'custom' ? 'selected' : ''}>Своё расположение</option>
                    </select>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="hideDefaultScroll" ${tempSettings.hideDefaultScroll ? 'checked' : ''} style="vertical-align: middle; margin-right: 5px;"> Скрыть стандартную кнопку
                    </label>
                    <label style="display: block;">
                        <input type="checkbox" id="enableCustomScroll" ${tempSettings.isCustomScrollEnabled ? 'checked' : ''} style="vertical-align: middle; margin-right: 5px;"> Включить кастомную кнопку
                    </label>
                </div>
                <div id="saveSettings" style="cursor: pointer; margin-top: 20px; padding: 8px; background: #228e5d; color: #fff; border-radius: 5px; text-align: center;">Сохранить</div>
            `;
            document.body.appendChild(menu);
 
            const dragControls = document.createElement('div');
            dragControls.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10003;
                display: none;
            `;
            dragControls.innerHTML = `
                <button id="saveDrag" style="padding: 8px 16px; background: #228e5d; color: #fff; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Сохранить</button>
                <button id="cancelDrag" style="padding: 8px 16px; background: #555; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Отменить</button>
            `;
            document.body.appendChild(dragControls);
 
            const openMenu = () => {
                tempSettings = { ...settings };
                overlay.style.display = 'block';
                menu.style.display = 'block';
                accountMenu.style.display = 'none';
                isDragging = false;
            };
 
            const closeMenu = () => {
                overlay.style.display = 'none';
                menu.style.display = 'none';
                dragControls.style.display = 'none';
                customButton.style.cursor = 'pointer';
                customButton.style.opacity = isVisible ? '1' : '0';
                customButton.style.zIndex = '9999';
                customButton.style.visibility = isVisible ? 'visible' : 'hidden';
                updateButtonPosition();
                isDragging = false;
                customButton.onmousedown = null; // Сбрасываем перетаскивание
            };
 
            scrollButtonLi.querySelector('.scrollSettingsTrigger').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openMenu();
            });
 
            menu.querySelector('.closeButton').addEventListener('click', closeMenu);
            overlay.addEventListener('click', (e) => {
                if (!isDragging) closeMenu();
            });
 
            document.getElementById('scrollPosition').addEventListener('change', (e) => {
                tempSettings.position = e.target.value;
                if (e.target.value === 'custom') {
                    menu.style.display = 'none';
                    customButton.style.zIndex = '10003';
                    customButton.style.opacity = '1';
                    customButton.style.visibility = 'visible';
                    customButton.style.left = '50%';
                    customButton.style.top = '50%';
                    customButton.style.transform = 'translate(-50%, -50%)';
                    customButton.style.cursor = 'grab';
                    dragControls.style.display = 'block';
                    isDragging = true;
                    makeDraggable(customButton);
                } else {
                    dragControls.style.display = 'none';
                    customButton.style.cursor = 'pointer';
                    customButton.style.transform = 'none';
                    isDragging = false;
                    customButton.onmousedown = null; // Сбрасываем перетаскивание
                    updateButtonPosition();
                }
            });
 
            document.getElementById('hideDefaultScroll').addEventListener('change', (e) => {
                tempSettings.hideDefaultScroll = e.target.checked;
            });
 
            document.getElementById('enableCustomScroll').addEventListener('change', (e) => {
                tempSettings.isCustomScrollEnabled = e.target.checked;
            });
 
            document.getElementById('saveSettings').addEventListener('click', () => {
                saveSettings();
                closeMenu();
            });
 
            function makeDraggable(element) {
                let offsetX = 0, offsetY = 0;
                element.onmousedown = dragMouseDown;
 
                function dragMouseDown(e) {
                    e.preventDefault();
                    offsetX = e.clientX - element.offsetLeft;
                    offsetY = e.clientY - element.offsetTop;
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                    element.style.cursor = 'grabbing';
                }
 
                function elementDrag(e) {
                    e.preventDefault();
                    let newLeft = e.clientX - offsetX;
                    let newTop = e.clientY - offsetY;
                    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));
                    newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight));
                    element.style.left = `${newLeft}px`;
                    element.style.top = `${newTop}px`;
                    element.style.transform = 'none';
                }
 
                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                    element.style.cursor = 'grab';
                }
            }
 
            document.getElementById('saveDrag').addEventListener('click', () => {
                tempSettings.position = 'custom';
                tempSettings.customPosition = {
                    x: parseInt(customButton.style.left),
                    y: parseInt(customButton.style.top)
                };
                saveSettings();
                customButton.onmousedown = null; // Делаем кнопку неперетаскиваемой
                closeMenu();
            });
 
            document.getElementById('cancelDrag').addEventListener('click', () => {
                tempSettings.position = settings.position;
                tempSettings.customPosition = settings.customPosition;
                customButton.onmousedown = null; // Сбрасываем перетаскивание
                closeMenu();
            });
        }
    };
 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
 
    const observer = new MutationObserver(() => {
        hideDefaultButton();
        updateButtonPosition();
        if (window.pageYOffset > 0 && !isVisible) showButton();
    });
 
    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();