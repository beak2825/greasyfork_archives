// ==UserScript==
// @name         Zendesk Sound Alert and Auto Accept
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Plays a custom sound, tracks daily chat counts, allows history export, and auto-accepts chats. Optimized & Refactored.
// @author       Swiftlyx
// @match        *://*.zendesk.com/agent/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/529649/Zendesk%20Sound%20Alert%20and%20Auto%20Accept.user.js
// @updateURL https://update.greasyfork.org/scripts/529649/Zendesk%20Sound%20Alert%20and%20Auto%20Accept.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Configuration and Storage Wrapper
     */
    class Config {
        static get sounds() { return GM_getValue('sounds', []); }
        static set sounds(val) { GM_setValue('sounds', val); }

        static get autoAccept() { return GM_getValue('autoAccept', false); }
        static set autoAccept(val) { GM_setValue('autoAccept', val); }

        static get autoAcceptDelay() { return GM_getValue('autoAcceptDelay', 0); }
        static set autoAcceptDelay(val) { GM_setValue('autoAcceptDelay', val); }

        static get stayOnTicket() { return GM_getValue('stayOnTicket', false); }
        static set stayOnTicket(val) { GM_setValue('stayOnTicket', val); }

        static get menuPosition() { return GM_getValue('menuPosition', { left: '2%', top: '50%' }); }
        static set menuPosition(val) { GM_setValue('menuPosition', val); }

        static get menuSize() { return GM_getValue('menuSize', { width: 320, height: 420 }); }
        static set menuSize(val) { GM_setValue('menuSize', val); }

        static get dailyChatStats() { return GM_getValue('dailyChatStats', {}); }
        static set dailyChatStats(val) { GM_setValue('dailyChatStats', val); }

        static get sidebarPosition() { return GM_getValue('sidebarPosition', null); }
        static set sidebarPosition(val) { GM_setValue('sidebarPosition', val); }

        static getCurrentDateString() {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        }
    }

    /**
     * Style Management
     */
    class Styles {
        static inject() {
            const css = `
                #custom-modal-overlay-zd {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(0,0,0,0.6); display: flex;
                    justify-content: center; align-items: center; z-index: 10001; font-family: Arial, sans-serif;
                }
                .modal-zd {
                    background-color: white; padding: 25px; border-radius: 8px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3); min-width: 320px; max-width: 90%;
                    box-sizing: border-box;
                }
                .zd-btn {
                    padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer;
                    font-size: 13px; transition: background-color 0.2s, opacity 0.2s; color: white;
                }
                .zd-btn:hover { opacity: 0.9; }
                .zd-btn-primary { background-color: #007bff; }
                .zd-btn-success { background-color: #28a745; }
                .zd-btn-danger { background-color: #dc3545; }
                .zd-btn-secondary { background-color: #6c757d; }
                .zd-btn-info { background-color: #17a2b8; }

                #zendesk-sound-menu-panel {
                    position: fixed; background-color: #ffffff; border-radius: 8px;
                    border: 1px solid #dee2e6; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 9998; display: none; overflow: hidden; box-sizing: border-box;
                    font-family: Arial, sans-serif; color: #333; flex-direction: column;
                }
                .menu-header-zd {
                    padding: 12px 15px; background-color: #f8f9fa; border-bottom: 1px solid #dee2e6;
                    display: flex; justify-content: space-between; align-items: center; cursor: move; flex-shrink: 0;
                }
                .top-buttons-container-zd {
                    display: flex; flex-wrap: wrap; gap: 10px; padding: 15px;
                    border-bottom: 1px solid #e9ecef; align-items: center; flex-shrink: 0;
                }
                .menu-content-outer-zd {
                    padding: 15px; overflow-y: auto; flex-grow: 1;
                }
                .sound-item-zd {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 8px; margin-bottom: 5px; background-color: #f9f9f9;
                    border-radius: 4px; border: 1px solid #e0e0e0;
                }
                .sound-action-btn {
                    padding: 4px 8px; border: 1px solid #ccc; border-radius: 3px;
                    cursor: pointer; font-size: 11px; background: transparent;
                }
                .resize-handle-corner {
                    position: absolute; right: 0; bottom: 0; width: 15px; height: 15px;
                    cursor: se-resize; z-index: 2;
                }

                /* Sidebar Icon active state fallback */
                #zd-sound-sidebar-icon.active {
                    background-color: rgba(0,0,0,0.05);
                }
                /* Slider Modal Styles */
                .zd-slider-container { margin: 20px 0; text-align: center; }
                .zd-slider { width: 100%; -webkit-appearance: none; height: 8px; border-radius: 5px; background: #d3d3d3; outline: none; opacity: 0.7; transition: .2s; }
                .zd-slider:hover { opacity: 1; }
                .zd-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #007bff; cursor: pointer; }
                .zd-slider-val { font-size: 18px; font-weight: bold; margin-bottom: 10px; display: block; color: #007bff; }
            `;
            const styleParams = document.createElement('style');
            styleParams.textContent = css;
            document.head.appendChild(styleParams);
        }
    }

    /**
     * DOM Helper
     */
    const DOM = {
        create(tag, className = '', text = '', styles = {}) {
            const el = document.createElement(tag);
            if (className) el.className = className;
            if (text) el.textContent = text;
            Object.assign(el.style, styles);
            return el;
        },
        Button(text, className, onClick) {
            const btn = DOM.create('button', className, text);
            if (onClick) btn.addEventListener('click', onClick);
            return btn;
        }
    };

    /**
     * Logic Classes
     */
    class SoundManager {
        constructor() {
            this.audioPlayer = new Audio();
        }

        playRandom() {
            const sounds = Config.sounds.filter(s => s.enabled !== false);
            if (!sounds.length) return;

            const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
            this.audioPlayer.src = randomSound.url;
            this.audioPlayer.play().catch(err => {
                console.error('Play error:', err);
                UI.modal('alert', `Error playing sound: ${err.message}`);
            });
        }
    }

    class ChatMonitor {
        constructor(soundManager) {
            this.soundManager = soundManager;
            this.lastState = false;
            this.observer = null;
        }

        start() {
            // Using MutationObserver instead of SetInterval for performance
            this.observer = new MutationObserver((mutations) => {
                this.check();
            });
            this.observer.observe(document.body, { childList: true, subtree: true });

            // Also listen for manual clicks to update stats
            document.addEventListener('click', (e) => this.handleGlobalClick(e), true);
        }

        get acceptButton() {
            return document.querySelector('button[data-test-id="toolbar-serve-chat-button"][data-state="accept-chat-normal"]:not([disabled])');
        }

        async restoreFocus(previousTab) {
            if (!Config.stayOnTicket || !previousTab) return;

            // Wait for Zendesk to potentially switch tabs (e.g., 1.5s)
            await new Promise(r => setTimeout(r, 1500));

            // Try to find the tab again (DOM element might be stale, so we re-query if possible, but tab elements usually persist)
            // If the element is still in DOM, click it.
            if (document.body.contains(previousTab)) {
                previousTab.click();
                console.log('Restored focus to tab:', previousTab);
            } else {
                console.warn('Previous tab no longer in DOM');
            }
        }

        getActiveTab() {
            return document.querySelector('[data-test-id="workspace-tab-header-item"][aria-selected="true"]');
        }

        check() {
            const btn = this.acceptButton;
            const currentState = !!btn;

            if (currentState && !this.lastState) {
                // New chat detected!
                this.soundManager.playRandom();

                if (Config.autoAccept) {
                    const currentTab = this.getActiveTab();
                    // Minimum 500ms safety buffer even if delay is 0
                    const delayMs = Config.autoAcceptDelay > 0 ? Config.autoAcceptDelay * 1000 : 500;

                    setTimeout(() => {
                        btn.click();
                        this.restoreFocus(currentTab);

                        // 1. Reset lastState so if the button persists (new chat immediately), we detect it as a 'new' appearance next check.
                        this.lastState = false;

                        // 2. Schedule a quick re-check. If the button is still there, it's a new chat.
                        setTimeout(() => this.check(), 1000);
                    }, delayMs);
                }
            }
            this.lastState = currentState;
        }

        handleGlobalClick(e) {
            // Track manual acceptance
            const btn = e.target.closest('button[data-test-id="toolbar-serve-chat-button"][data-state="accept-chat-normal"]:not([disabled])');
            if (btn) {
                const currentTab = this.getActiveTab();
                setTimeout(() => {
                    Stats.increment();
                    this.restoreFocus(currentTab);
                }, 100);
            }
        }
    }

    class Stats {
        static increment() {
            const date = Config.getCurrentDateString();
            const stats = Config.dailyChatStats;
            stats[date] = (stats[date] || 0) + 1;
            Config.dailyChatStats = stats;
            UI.updateCounter();
        }

        static getCount() {
            return Config.dailyChatStats[Config.getCurrentDateString()] || 0;
        }

        static resetToday() {
            const stats = Config.dailyChatStats;
            stats[Config.getCurrentDateString()] = 0;
            Config.dailyChatStats = stats;
            UI.updateCounter();
        }

        static export() {
            const stats = Config.dailyChatStats;
            if (!Object.keys(stats).length) return UI.modal('alert', 'No history to export.');

            const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `zendesk_chat_history_${Config.getCurrentDateString()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            UI.modal('alert', 'History exported!');
        }
    }

    class DragResize {
        static makeDraggable(el, handle) {
            let isDragging = false, startX, startY;

            handle.addEventListener('mousedown', (e) => {
                if (e.target.closest('button, input')) return;
                isDragging = true;
                startX = e.clientX - el.offsetLeft;
                startY = e.clientY - el.offsetTop;
                el.style.willChange = 'top, left';
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const x = Math.min(Math.max(0, e.clientX - startX), window.innerWidth - el.offsetWidth);
                const y = Math.min(Math.max(0, e.clientY - startY), window.innerHeight - el.offsetHeight);
                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    el.style.willChange = 'auto';
                    Config.menuPosition = { left: el.style.left, top: el.style.top };
                }
            });
        }

        static makeResizable(el) {
            const handle = DOM.create('div', 'resize-handle-corner');
            handle.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="#666"><path d="M10 10H0L10 0V10Z"/></svg>`;
            el.appendChild(handle);

            let isResizing = false;
            handle.addEventListener('mousedown', (e) => {
                isResizing = true;
                e.preventDefault();
                el.style.willChange = 'width, height';
            });

            window.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                el.style.width = `${Math.max(300, e.clientX - el.getBoundingClientRect().left)}px`;
                el.style.height = `${Math.max(400, e.clientY - el.getBoundingClientRect().top)}px`;
            });

            window.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                    el.style.willChange = 'auto';
                    Config.menuSize = { width: parseInt(el.style.width), height: parseInt(el.style.height) };
                }
            });
        }
    }

    class SidebarIcon {
        static init() {
            this.inject();
            this.setupGlobalDrag();
        }

        static inject() {
            const attempt = () => {
                const navLists = document.querySelectorAll('nav[data-test-id="support_nav"] > ul');
                if (navLists.length < 1) {
                    setTimeout(attempt, 500);
                    return;
                }

                // Append to the last list (usually where apps/settings are)
                const targetList = navLists[navLists.length - 1];
                if (document.getElementById('zd-sound-sidebar-li')) return;

                const li = document.createElement('li');
                li.id = 'zd-sound-sidebar-li';
                li.setAttribute('data-garden-id', 'chrome.nav_list_item');
                li.setAttribute('data-garden-version', '8.0.0');
                li.draggable = true;
                li.className = targetList.firstElementChild?.className || 'StyledNavListItem-sc-18cj2v7-0 bbgdDD';

                const btn = document.createElement('button');
                btn.id = 'zd-sound-sidebar-btn';
                btn.className = targetList.querySelector('button')?.className || 'StyledBaseNavItem-sc-zvo43f-0 StyledNavButton-sc-f5ux3-0 gvFgbC bkva-dj';
                btn.setAttribute('title', 'Sound Alert Settings');
                btn.setAttribute('aria-label', 'Sound Alert Settings');
                btn.tabIndex = 0;

                // Native SVG Icon
                btn.innerHTML = `
                    <span style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%;">
                         <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                         </svg>
                    </span>
                `;

                li.appendChild(btn);

                // Restore position
                const savedPos = Config.sidebarPosition;
                if (savedPos && savedPos.listIndex !== undefined && savedPos.listIndex < navLists.length) {
                    const list = navLists[savedPos.listIndex];
                    if (savedPos.itemIndex < list.children.length) {
                        list.insertBefore(li, list.children[savedPos.itemIndex]);
                    } else {
                        list.appendChild(li);
                    }
                } else {
                    targetList.appendChild(li);
                }

                // Events
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const menu = document.getElementById('zendesk-sound-menu-panel');
                    const isHidden = menu.style.display === 'none' || !menu.style.display;
                    menu.style.display = isHidden ? 'flex' : 'none';
                    if (isHidden) UI.updateCounter();
                });

                this.attachDragEvents(li);
            };
            attempt();
        }

        static attachDragEvents(li) {
            li.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                li.style.opacity = '0.5';
                li.classList.add('dragging');
                this.isDragging = true;
            });

            li.addEventListener('dragend', () => {
                li.style.opacity = '1';
                li.classList.remove('dragging');
                this.isDragging = false;
                this.savePosition();
            });
        }

        static setupGlobalDrag() {
            document.addEventListener('dragover', (e) => {
                if (!this.isDragging) return;
                e.preventDefault();
                const container = e.target.closest('nav[data-test-id="support_nav"]');
                if (!container) return;

                const list = e.target.closest('ul');
                if (!list) return;

                const afterElement = this.getDragAfterElement(list, e.clientY);
                const draggable = document.getElementById('zd-sound-sidebar-li');
                if (draggable) {
                    if (afterElement == null) {
                        list.appendChild(draggable);
                    } else {
                        list.insertBefore(draggable, afterElement);
                    }
                }
            });
        }

        static getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        static savePosition() {
            const li = document.getElementById('zd-sound-sidebar-li');
            if (!li) return;
            const list = li.closest('ul');
            const navLists = document.querySelectorAll('nav[data-test-id="support_nav"] > ul');
            if (!list) return;

            let listIndex = -1;
            for (let i = 0; i < navLists.length; i++) {
                if (navLists[i] === list) {
                    listIndex = i;
                    break;
                }
            }

            const itemIndex = [...list.children].indexOf(li);
            Config.sidebarPosition = { listIndex, itemIndex };
        }
    }

    /**
     * User Interface
     */
    class UI {
        static init() {
            SidebarIcon.init();
            this.renderMenu();
        }

        static modal(type, message, defaultValue = '', callback = null) {
            // Cleanup existing
            const old = document.getElementById('custom-modal-overlay-zd');
            if (old) old.remove();

            const overlay = DOM.create('div');
            overlay.id = 'custom-modal-overlay-zd';
            const box = DOM.create('div', 'modal-zd');

            const msg = DOM.create('div', '', message, { marginBottom: '20px', color: '#333' });
            box.appendChild(msg);

            let input;
            if (type === 'prompt') {
                input = DOM.create('input', '', '', { width: '100%', padding: '8px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' });
                input.value = defaultValue;
                box.appendChild(input);
            }

            const btns = DOM.create('div', '', '', { display: 'flex', justifyContent: 'flex-end', gap: '10px' });

            if (type !== 'alert') {
                btns.appendChild(DOM.Button('Cancel', 'zd-btn zd-btn-secondary', () => {
                    overlay.remove();
                    if (callback) callback(type === 'prompt' ? null : false);
                }));
            }

            btns.appendChild(DOM.Button('OK', 'zd-btn zd-btn-primary', () => {
                overlay.remove();
                if (callback) callback(type === 'prompt' ? input.value : true);
            }));

            box.appendChild(btns);
            overlay.appendChild(box);
            document.body.appendChild(overlay);
            if (input) input.focus();
        }

        static sliderModal(title, min, max, value, callback) {
            // Cleanup existing
            const old = document.getElementById('custom-modal-overlay-zd');
            if (old) old.remove();

            const overlay = DOM.create('div');
            overlay.id = 'custom-modal-overlay-zd';
            const box = DOM.create('div', 'modal-zd');

            // Title
            box.appendChild(DOM.create('div', '', title, { fontWeight: 'bold', marginBottom: '15px', color: '#333' }));

            // Display Value
            const valDisplay = DOM.create('span', 'zd-slider-val', `${value}s`);

            // Slider Container
            const sliderCont = DOM.create('div', 'zd-slider-container');
            const slider = DOM.create('input', 'zd-slider');
            slider.type = 'range';
            slider.min = min;
            slider.max = max;
            slider.value = value;

            slider.addEventListener('input', () => {
                valDisplay.textContent = `${slider.value}s`;
            });

            sliderCont.appendChild(valDisplay);
            sliderCont.appendChild(slider);
            box.appendChild(sliderCont);

            // Buttons
            const btns = DOM.create('div', '', '', { display: 'flex', justifyContent: 'flex-end', gap: '10px' });
            btns.appendChild(DOM.Button('Cancel', 'zd-btn zd-btn-secondary', () => overlay.remove()));
            btns.appendChild(DOM.Button('Save', 'zd-btn zd-btn-success', () => {
                overlay.remove();
                callback(parseInt(slider.value));
            }));

            box.appendChild(btns);
            overlay.appendChild(box);
            document.body.appendChild(overlay);
        }



        static renderMenu() {
            const panel = DOM.create('div');
            panel.id = 'zendesk-sound-menu-panel';
            const pos = Config.menuPosition;
            const size = Config.menuSize;

            // Set initial position/size
            Object.assign(panel.style, {
                left: pos.left, top: pos.top,
                width: `${size.width}px`, height: `${size.height}px`
            });

            // Header
            const header = DOM.create('div', 'menu-header-zd');
            header.innerHTML = `<strong>Zendesk Sound Settings</strong>`;
            const close = DOM.Button('✕', '', () => panel.style.display = 'none');
            close.style.cssText = 'background:none; border:none; font-size:16px; cursor:pointer; padding:0 5px;';
            header.appendChild(close);
            panel.appendChild(header);

            // Top Buttons
            const topBtns = DOM.create('div', 'top-buttons-container-zd');

            const btnSave = DOM.Button('Save & Close', 'zd-btn zd-btn-success', () => {
                // Save current pos/size on explicit save
                Config.menuPosition = { left: panel.style.left, top: panel.style.top };
                Config.menuSize = { width: parseInt(panel.style.width), height: parseInt(panel.style.height) };
                panel.style.display = 'none';
                UI.modal('alert', 'Settings (pos/size) saved!');
            });

            const btnTest = DOM.Button('Test Sound', 'zd-btn zd-btn-secondary', () => soundManager.playRandom());

            const btnAuto = DOM.Button('Auto Accept', `zd-btn ${Config.autoAccept ? 'zd-btn-success' : 'zd-btn-danger'}`, function () {
                const newVal = !Config.autoAccept;
                Config.autoAccept = newVal;
                this.className = `zd-btn ${newVal ? 'zd-btn-success' : 'zd-btn-danger'}`;
            });

            const btnStay = DOM.Button('Stay', `zd-btn ${Config.stayOnTicket ? 'zd-btn-success' : 'zd-btn-danger'}`, function () {
                const newVal = !Config.stayOnTicket;
                Config.stayOnTicket = newVal;
                this.className = `zd-btn ${newVal ? 'zd-btn-success' : 'zd-btn-danger'}`;
            });
            btnStay.title = "Stay on current ticket after accepting chat";

            // Delay Button
            const getDelayText = () => Config.autoAcceptDelay > 0 ? `Delay: ${Config.autoAcceptDelay}s` : 'Delay';
            const getDelayClass = () => `zd-btn ${Config.autoAcceptDelay > 0 ? 'zd-btn-success' : 'zd-btn-danger'}`;

            const btnDelay = DOM.Button(getDelayText(), getDelayClass(), function () {
                UI.sliderModal('Set Auto Accept Delay (0-20s)', 0, 20, Config.autoAcceptDelay, (val) => {
                    Config.autoAcceptDelay = val;
                    btnDelay.textContent = getDelayText();
                    btnDelay.className = getDelayClass();
                });
            });

            const btnExport = DOM.Button('Export', 'zd-btn zd-btn-info', () => Stats.export());

            topBtns.append(btnSave, btnTest, btnAuto, btnStay, btnDelay, btnExport);
            panel.appendChild(topBtns);

            // Content Area
            const content = DOM.create('div', 'menu-content-outer-zd');

            // Stats Section
            const statsDiv = DOM.create('div', '', '', { backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
            statsDiv.innerHTML = '<span>Today: <strong id="chat-counter-val">0</strong></span>';
            const btnReset = DOM.Button('Reset', 'zd-btn zd-btn-danger', () => {
                UI.modal('confirm', "Reset today's counter?", '', (yes) => { if (yes) Stats.resetToday(); });
            });
            btnReset.style.padding = '2px 8px'; btnReset.style.fontSize = '11px';
            statsDiv.appendChild(btnReset);
            content.appendChild(statsDiv);

            // Sounds Section
            const soundsLabel = DOM.create('div', '', 'Sound List', { fontWeight: 'bold', marginBottom: '8px' });
            content.appendChild(soundsLabel);

            const soundsList = DOM.create('div', 'sound-list-container-zd');
            content.appendChild(soundsList);
            this.soundsListEl = soundsList; // Store ref

            const btnAdd = DOM.Button('+ Add Sound', 'zd-btn zd-btn-primary', () => this.addSoundPrompt());
            btnAdd.style.width = '100%';
            content.appendChild(btnAdd);

            panel.appendChild(content);
            document.body.appendChild(panel);

            // Bind interactions
            DragResize.makeDraggable(panel, header);
            DragResize.makeResizable(panel);
            this.refreshSoundsList();
            this.updateCounter();
        }

        static updateCounter() {
            const el = document.getElementById('chat-counter-val');
            if (el) el.textContent = Stats.getCount();
        }

        static refreshSoundsList() {
            if (!this.soundsListEl) return;
            this.soundsListEl.innerHTML = '';

            const sounds = Config.sounds;
            if (sounds.length === 0) {
                this.soundsListEl.innerHTML = '<div style="color:#777; font-style:italic; text-align:center; padding:10px;">No sounds yet.</div>';
                return;
            }

            sounds.forEach((sound, i) => {
                const row = DOM.create('div', 'sound-item-zd');

                const nameDiv = DOM.create('div', '', sound.name, { flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' });
                if (sound.enabled === false) {
                    nameDiv.style.opacity = '0.5';
                    nameDiv.style.textDecoration = 'line-through';
                }

                const actions = DOM.create('div', '', '', { display: 'flex', gap: '5px' });

                // Toggle
                const btnTog = DOM.Button(sound.enabled !== false ? 'On' : 'Off', 'sound-action-btn', () => {
                    sound.enabled = sound.enabled === false;
                    Config.sounds = sounds;
                    this.refreshSoundsList();
                });
                btnTog.style.background = sound.enabled !== false ? '#d4edda' : '#f8d7da';

                // Edit
                const btnEdit = DOM.Button('Edit', 'sound-action-btn', () => {
                    UI.modal('prompt', 'New URL:', sound.url, (url) => {
                        if (url) { sound.url = url; Config.sounds = sounds; }
                    });
                });

                // Delete
                const btnDel = DOM.Button('✖', 'sound-action-btn', () => {
                    UI.modal('confirm', `Delete "${sound.name}"?`, '', (yes) => {
                        if (yes) {
                            sounds.splice(i, 1);
                            Config.sounds = sounds;
                            this.refreshSoundsList();
                        }
                    });
                });
                btnDel.style.borderColor = '#dc3545'; btnDel.style.color = '#dc3545';

                actions.append(btnTog, btnEdit, btnDel);
                row.append(nameDiv, actions);
                this.soundsListEl.appendChild(row);
            });
        }

        static addSoundPrompt() {
            UI.modal('prompt', 'Sound Name:', 'New Sound', (name) => {
                if (!name) return;
                UI.modal('prompt', 'Sound URL:', 'https://', (url) => {
                    if (!url) return;
                    try {
                        new URL(url);
                        const list = Config.sounds;
                        list.push({ name, url, enabled: true });
                        Config.sounds = list;
                        this.refreshSoundsList();
                    } catch (e) {
                        UI.modal('alert', 'Invalid URL');
                    }
                });
            });
        }
    }

    /**
     * Initialization
     */
    Styles.inject();
    const soundManager = new SoundManager();
    const monitor = new ChatMonitor(soundManager);

    // Defer init until load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            UI.init();
            monitor.start();
        });
    } else {
        UI.init();
        monitor.start();
    }

})();
