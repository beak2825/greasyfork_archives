// ==UserScript==
// @name         Clipping Tools++
// @description  Clipping tools for clippers
// @author       luna__mae
// @license      GNU GPLv3
// @version      3.3.8
// @homepageURL  https://github.com/luna-mae/ClippingTools
// @namespace    https://github.com/luna-mae/ClippingTools
// @icon         https://raw.githubusercontent.com/luna-mae/ClippingTools/refs/heads/main/media/logo.png
// @supportURL   https://x.com/luna__mae
// @match        https://www.fishtank.live/
// @match        https://www.fishtank.live/clips
// @match        https://www.fishtank.live/clip/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/514950/Clipping%20Tools%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/514950/Clipping%20Tools%2B%2B.meta.js
// ==/UserScript==
 
(() => {
    "use strict";
 
    const hideAdsDiv = () => {
        const adsDiv = document.querySelector('.ads_ads__Z1cPk');
        if (adsDiv) {
            adsDiv.style.display = 'none';
        }
    };
    hideAdsDiv();
    const observer = new MutationObserver(hideAdsDiv);
    observer.observe(document.body, { childList: true, subtree: true });
 
    const script = document.createElement('script');
    script.src = 'https://kit.fontawesome.com/d8b6e64f10.js';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
 
    const styles = `
        .luna-menu {
            top: 10px;
            left: 10px;
            background: rgba(25, 29, 33, 1);
            color: white;
            padding: 0px;
            font-size: 14px;
            border-radius: 4px;
            z-index: 5;
            border: 1px solid #505050;
            cursor: default;
        }
        .luna-menu.collapsed #main-menu {
            display: none;
        }
        .luna-menu.collapsed .luna-menu_title {
            border-bottom: none;
        }
        .luna-menu_title {
            font-weight: bold;
            padding: 4px 8px;
            cursor: pointer;
            margin-bottom: 0px;
            background: rgba(116, 7, 0, 1);
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border-bottom: 1px solid #505050;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .luna-menu_title:hover {
            background-color: #a70a00;
        }
        .luna-menu_item {
            margin: 5px 0;
            padding: 3px;
            cursor: pointer;
            display: flex;
            align-items: center;
        }
        .luna-menu_item:hover {
            background-color: hsla(0, 0%, 100%, .1);
            color: #f8ec94;
        }
        .luna-hide-scan_lines::after {
            content: none !important;
        }
        .luna-checkbox {
            appearance: none;
            margin-right: 5px;
            width: 20px;
            height: 20px;
            background-color: #303438;
            border: 2px solid black;
            border-radius: 3px;
            position: relative;
        }
        .luna-checkbox:checked {
            background-color: rgba(116, 7, 0, 1);
        }
        .luna-checkbox:checked::after {
            content: '';
            position: absolute;
            left: 3px;
            top: 3px;
            width: 10px;
            height: 10px;
            background-color: #f8ec94;
        }
         .luna-checkbox input:checked + .luna-checkbox::after {
            display: block;
        }
        #toggle-icon {
            transition: transform 0.5s, filter 0.9s;
            --drop-shadow: drop-shadow(2px 3px 0 #000000);
            filter: var(--drop-shadow);
        }
 
        .luna-menu_title svg {
            margin-left: -3px;
            color: #f8ec94;
            filter: var(--drop-shadow);
        }
        .menu-title-text {
            flex-grow: 1;
            margin-left: 4px;
            padding-left: 0px;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 10001;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(25, 29, 33, 1);
            border: 2px solid #505050;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        .modal.show {
            display: block;    
        }       
        .modal #close-modal {
            display: block;
            margin: 20px auto 0 auto;
        }            
        #close-modal {
            display: inline-block;
            width: 100px;
            padding: 10px 20px;
            background-color: rgba(25, 29, 33, 1);
            border: 1px solid #505050;
            border-radius: 0;
            cursor: pointer;
            transition: color 0.3s, outline 0.3s;
            box-sizing: border-box;
        }
 
        #close-modal:hover {
            outline: 2px solid #f8ec94;
            color: #f8ec94;
        }     
        .modal-title {
            font-weight: bold;
            padding: 4px 8px;
            margin-bottom: 0px;
            background: rgba(116, 7, 0, 1);
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border-bottom: 1px solid #505050;
        }                 
        .custom-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(25, 29, 33, 1);
            color: #fff;
            padding: 15px;
            border-radius: 5px;
            border: 4px solid #f8ec94;            
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .custom-toast-message {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .custom-toast-icon svg {
            fill: #fff;
        }
        .custom-toast-close {
            margin-left: auto;
        }
        .custom-close-button {
            background: none;
            border: none;
            cursor: pointer;
        }
        .custom-close-button svg {
            fill: #fff;
        }            
        #twitter-link button {
            background-color: #1DA1F2;
            width: 220px;
            font-size: 8px;
            padding: 8px 16px;            
            margin-bottom: 5px;
            background-color: rgba(25, 29, 33, 1);
            border: 1px solid #505050;            
            border-radius: 0;
            cursor: pointer;
            transition: color 0.3s, outline 0.3s;
            box-sizing: border-box;
        }
        #twitter-link button:hover {
            outline: 2px solid #f8ec94;
            color: #f8ec94;
        }                
        .button-container {
            display: flex;
            align-items: center;
            justify-content: center; 
        }     
        .change-key {
            display: inline-block;
            width: 250px;
            font-size: 10px;
            padding: 5px 10px;
            background-color: rgba(25, 29, 33, 1);
            border: 1px solid #505050;
            border-radius: 0;
            cursor: pointer;
            transition: color 0.3s, outline 0.3s;
            box-sizing: border-box;
        }
 
        .change-key:hover {
            outline: 2px solid #f8ec94;
            color: #f8ec94;
        }   
        .livepeer-video-player_livepeer-video-player__NRXYi .livepeer-video-player_fullscreen__qCmpW button {
            display: none;
        }      
    `;
 
 
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
 
 
    const menuOptions = [
        {
            label: ' Enable Full-Screen',
            description: 'This allows you to watch in full-screen mode. Each time you press the checkbox, it will enable full-screen mode.',
            action: () => {
                const videoElement = document.querySelector('video');
                const fullscreenCheckbox = document.querySelector('#luna-checkbox-0'); 
                if (videoElement) {
                    videoElement.requestFullscreen();
                }
 
                document.addEventListener('fullscreenchange', () => {
                    if (!document.fullscreenElement && fullscreenCheckbox) {
                        fullscreenCheckbox.checked = false;
                    }
                });
            }
        },
        {
            label: ' Enable PiP',
            description: 'This allows you to watch in Picture-in-Picture mode. Each time you press the checkbox, it will enable Picture-in-Picture mode. To exit PiP mode, press the checkbox again.',
            action: () => {
                const videoElement = document.querySelector('video');
                const pipCheckbox = document.querySelector('#luna-checkbox-1');
                if (videoElement && pipCheckbox) {
                    if (pipCheckbox.checked) {
                        videoElement.requestPictureInPicture();
                    } else {
                        document.exitPictureInPicture();
                    }
                }
 
                document.addEventListener('leavepictureinpicture', () => {
                    const pipCheckbox = document.querySelector('#luna-checkbox-1');
                    if (pipCheckbox) {
                        pipCheckbox.checked = false;
                    }
                });
            }
        },
        {
            label: ' Hide Scan Lines',
            description: 'This allows you to hide the scan lines. By default, the website has scan lines over all elements of the website to simulate the look of CRT.',
            action: () => {
                document.body.classList.toggle('luna-hide-scan_lines');
                saveCheckboxState('luna-checkbox-2', document.body.classList.contains('luna-hide-scan_lines'));
            }
        },
        {
            label: ' Block All SFX',
            description: 'This allows you to block all sound effects. This will block all sound effects from the website outside of the video. This includes TTS/SFX previews.',
            action: () => {
                interceptPlay();
            }
        },
        {
            label: ' Hide Clickable Zones',
            description: 'This allows you to hide clickable zones. These are the red zones that appear when you hover over the video. These zones remain clickable even when hidden.',
            action: () => {
                const style = document.querySelector('#clickable-zones-style');
                if (style) {
                    style.disabled = !style.disabled;
                } else {
                    const newStyle = document.createElement('style');
                    newStyle.id = 'clickable-zones-style';
                    newStyle.innerHTML = `
                        .clickable-zones_clickable-zones__OgYjT polygon.clickable-zones_live-stream__i75zd:hover {
                            fill: rgba(243, 14, 0, 0) !important;
                        }
                    `;
                    document.head.appendChild(newStyle);
                }
            }
        },
        {
            label: 'Sidebar Cleanup',
            description: 'This allows you to hide certain elements from the sidebar. This includes the item generator, inventory, missions, polls, and footer. Daily XP remains untouched.',
            action: () => {
                const style = document.querySelector('#block-elements-style');
                if (style) {
                    style.disabled = !style.disabled;
                } else {
                    const newStyle = document.createElement('style');
                    newStyle.id = 'block-elements-style';
                    newStyle.innerHTML = `
                        .item-generator_item-generator__TCQ9l,
                        .inventory_inventory__7bCIe,
                        .footer_footer__Mnt6p,
                        .missions_missions__haRAj,
                        .poll_poll__QyVsN {
                            display: none !important;
                        }
                    `;
                    document.head.appendChild(newStyle);
                }
            }
        },
        {
            label: 'Filter Toast Messages',
            description: 'This allows you to filter out toast messages outside of admin messages. Any "level up", "plushie", or "gifted" messages will be hidden.',
            action: () => {
                const filterCheckbox = document.querySelector('#luna-checkbox-filter-toasts');
                if (filterCheckbox) {
                    filterCheckbox.checked = !filterCheckbox.checked;
                    filterToasts();
                }
            }
        },     
        {
            label: 'Block Global Missions',
            description: 'This allows you to block the global missions from appearing. You WILL lose out on xp, but you will not have to deal with the popups.',
            action: () => {
                const checkbox = document.getElementById('luna-checkbox-7');
                const labelElement = document.querySelector('label[for="luna-checkbox-7"]');
        
                const updateLabel = (showBell) => {
                    if (showBell) {
                        labelElement.innerHTML = 'Block Global Missions <i class="fa-regular fa-bell" style="margin-left: 8px; color:#fd0f00;"></i>';
                    } else {
                        labelElement.innerHTML = 'Block Global Missions';
                    }
                };
        
                const checkModal = () => {
                    let showBell = false;
        
                    const modalBackdrops = document.querySelectorAll('.global-mission-modal_backdrop__oVezg');
                    modalBackdrops.forEach(modalBackdrop => {
                        modalBackdrop.style.setProperty('display', 'none', 'important');
                    });
        
                    const modalContainers = document.querySelectorAll('.modal_modal-container__iQODa, .modal_modal__MS70U');
                    modalContainers.forEach(modalContainer => {
                        if (modalContainer && modalContainer.textContent.includes('Global Mission')) {
                            if (checkbox.checked) {
                                modalContainer.style.setProperty('display', 'none', 'important');
                                showBell = true;
                            } else {
                                modalContainer.style.setProperty('display', 'flex', 'important');
                            }
                        } else {
                            modalContainer.style.setProperty('display', 'flex', 'important');
                        }
                    });
        
                    updateLabel(showBell);
                };
        
                checkbox.addEventListener('change', checkModal);
                setInterval(checkModal, 10);
            }
        },
        {
            label: "Clean Chat",
            description: 'This cleans up chat so it is closer to what you would see on twitch/kick. Removes pfps, clan tags, used items, and emotes.',
            action: () => {
                const style = document.createElement('style');
                style.innerHTML = `
                    .chat-message-happening_chat-message-happening__tYeDU,
                    .chat-message-emote_chat-message-emote__NWoZG,
                    .chat-message-default_timestamp__sGwZy,
                    .chat-message-default_avatar__eVmdi {
                        display: none !important;
                    }
                    .chat-message-default_clan__t_Ggo {
                        display: inline-block !important;
                        font-size: 11px !important;
                        margin-right: 5px !important;
                        overflow: hidden;
                        padding: 0 1px !important;
                        white-space: nowrap;
                        max-height: 13px;
                        width: 1.2ch;
                    }
                    .chat-message-default_chat-message-default__JtJQL,
                    .chat-message-default_user__uVNvH {
                        font-size: 11px !important;
                    }
                    .chat_chat__2rdNg .chat_messages__2IBEJ {
                        gap: 2px !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    ];
     
    const saveCheckboxState = (id, state) => {
        localStorage.setItem(id, JSON.stringify(state));
    };
 
    const loadCheckboxState = (id) => {
        return JSON.parse(localStorage.getItem(id)) || false;
    };
 
    const createMenu = () => {
        const menu = document.createElement('div');
        menu.className = 'luna-menu';
        menu.innerHTML = `
            <div class="luna-menu_title">
                <svg id="toggle-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19 8H5V10H7V12H9V14H11V16H13V14H15V12H17V10H19V8Z" fill="#f8ec94"></path>
                </svg> <span class="menu-title-text">Clipping Tools</span>
                <i id="info-button" class="fa fa-info-circle" aria-hidden="true"></i>
                </div>
            <div id="main-menu">
                ${menuOptions.map((option, index) => `
                    <div class="luna-menu_item" id="menu-item-${index}">
                        <input class="luna-checkbox" type="checkbox" id="luna-checkbox-${index}">
                        <label for="luna-checkbox-${index}"> ${option.label}</label>
                    </div>
                `).join('')}
                </div>
            </div>
        `;
        document.body.appendChild(menu);
 
        const menuTitle = menu.querySelector('.luna-menu_title');
        const toggleIcon = menu.querySelector('#toggle-icon');
        const infoButton = menu.querySelector('#info-button');
        menuTitle.addEventListener('click', () => {
            menu.classList.toggle('collapsed');
            const isCollapsed = menu.classList.contains('collapsed');
            toggleIcon.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)';
            toggleIcon.style.setProperty('--drop-shadow', isCollapsed ? 'drop-shadow(2px 3px 0 #000000)' : 'drop-shadow(-2px -3px 0 #000000)');
        });
        
        infoButton.addEventListener('click', () => {
            event.stopPropagation();
            const modal = document.querySelector('.modal');
            modal.classList.toggle('show');
        });
 
        toggleIcon.style.transform = 'rotate(180deg)';
        toggleIcon.style.setProperty('--drop-shadow', 'drop-shadow(2px 3px 0 #000000)');
 
 
        menuOptions.forEach((option, index) => {
            const checkbox = menu.querySelector(`#luna-checkbox-${index}`);
            const savedState = loadCheckboxState(`luna-checkbox-${index}`);
            checkbox.checked = savedState;
            if (savedState) {
                option.action();
            }
            checkbox.addEventListener('change', function () {
                saveCheckboxState(`luna-checkbox-${index}`, this.checked);
                option.action();
            });
        });
 
        const blockedWords = ["level", "gifted", "plushie"];
        const toastClass = "toast_body__DVBLz";
        
        function containsBlockedWords(text) {
            return blockedWords.some(word => text.toLowerCase().includes(word));
        }
        
        function filterToasts() {
            const toasts = document.querySelectorAll(`.${toastClass}`);
            const filterCheckbox = document.querySelector('#luna-checkbox-6');
        
            if (filterCheckbox && filterCheckbox.checked) {
                toasts.forEach(toast => {
                    const toastText = toast.innerText || "";
                    console.log(`Processing toast message: "${toastText.trim()}"`);
        
                    if (containsBlockedWords(toastText)) {
                        toast.style.display = "none";
                        console.log(`Blocked toast with content: "${toastText.trim()}"`);
                    } else {
                        toast.style.display = "";
                        console.log(`Displayed toast with content: "${toastText.trim()}"`);
                    }
                });
            }
        }
        
        setInterval(filterToasts, 10);
        return menu;
    };
 
    function insertMenuInSidebar() {
        const interval = setInterval(() => {
            const sidebar = document.querySelector('.home_left__UiQ0z');
            const targetDiv = sidebar ? sidebar.querySelector('.live-streams-monitoring-point_live-streams-monitoring-point__KOqPQ') : null;
 
            if (sidebar && targetDiv) {
                clearInterval(interval);
                const menu = createMenu();
                sidebar.insertBefore(menu, targetDiv);
            }
        }, 1000);
    }
 
    const blockedDirectories = [
        "https://cdn.fishtank.live/sounds/",
        "https://cdn.fishtank.live/sfx/"
    ];
 
    function interceptPlay() {
        const originalPlay = HTMLAudioElement.prototype.play;
        HTMLAudioElement.prototype.play = function() {
            if (document.querySelector('#luna-checkbox-3').checked && blockedDirectories.some(dir => this.src.includes(dir))) {
                return Promise.resolve();
            }
            return originalPlay.apply(this, arguments);
        };
    }
 
    function createResizeHandle() {
        const handle = document.createElement('div');
        handle.style.width = '100%';
        handle.style.height = '10px';
        handle.style.background = 'rgba(116, 0, 0, 0.5)';
        handle.style.cursor = 'ns-resize';
        handle.style.position = 'absolute';
        handle.style.left = '0';
        handle.style.bottom = '0';
        handle.style.zIndex = '1000';
        handle.classList.add('resize-handle');
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const panelBody = handle.parentElement;
            const list = panelBody.querySelector('.live-streams-monitoring-point_list__g0ojU');
            const startY = e.clientY;
            const startPanelHeight = panelBody.offsetHeight;
 
            const onMouseMove = (e) => {
                const newHeight = startPanelHeight + (e.clientY - startY);
                const minHeight = 100;
                const clampedHeight = Math.max(minHeight, newHeight);
                panelBody.style.height = clampedHeight + 'px';
                if (list) {
                    list.style.height = clampedHeight + 'px';
                }
            };
 
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
 
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
 
        return handle;
    }
 
    function addResizeHandle() {
        const panelBody = document.querySelector('.panel_panel__Tdjid.panel_full-height__2dCSF.panel_no-padding__woODX');
        if (panelBody) {
            const list = panelBody.querySelector('.live-streams-monitoring-point_list__g0ojU');
            if (list) {
                list.style.maxHeight = 'none';
            }
            panelBody.style.position = 'relative';
            panelBody.style.overflow = 'hidden';
            if (panelBody.offsetHeight > 0) {
                const existingHandle = panelBody.querySelector('.resize-handle');
                if (!existingHandle) {
                    const handle = createResizeHandle();
                    handle.classList.add('resize-handle');
                    panelBody.appendChild(handle);
                }
            }
        }
    }
 
    function waitForPanel() {
        const checkInterval = setInterval(() => {
            const panelBody = document.querySelector('.panel_panel__Tdjid.panel_full-height__2dCSF.panel_no-padding__woODX');
            if (panelBody) {
                addResizeHandle();
                clearInterval(checkInterval);
            }
        }, 1000);
    }
 
    window.addEventListener('load', () => {
        waitForPanel();
    });
 
    const panelObserver = new MutationObserver(() => {
        const existingHandle = document.querySelector('.panel_panel__Tdjid.panel_full-height__2dCSF.panel_no-padding__woODX .resize-handle');
        if (!existingHandle) {
            waitForPanel();
        }
    });
 
    const keyBindings = {
        screenshot: 'Alt+S',
        fullscreen: 'Alt+F',
        pip1: 'Alt+P'
    };
    
    const savedKeyBindings = localStorage.getItem('keyBindings');
    if (savedKeyBindings) {
        Object.assign(keyBindings, JSON.parse(savedKeyBindings));
    }
    
    const createModal = () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-title"><h2 style="padding-top:5px; padding-bottom:5px;">Clipping Tools++ Info</h2></div>
            <ul style="padding-left:10px;max-width:700px;">
                ${menuOptions.map(option => `
                    <li style="padding:10px;list-style-type: none;"><strong>${option.label}:</strong><p style="font-size:10px;"> ${option.description}</p></li>
                `).join('')}
                <li style="padding:10px;list-style-type: none;">
                    <strong>Screenshot:</strong>
                    <button class="change-key" id="change-screenshot-key">Click Here To Change (${keyBindings.screenshot})</button>
                </li>
                <li style="padding:10px;list-style-type: none;">
                    <strong>Fullscreen:</strong>
                    <button class="change-key" id="change-fullscreen-key">Click Here To Change (${keyBindings.fullscreen})</button>
                </li>
                <li style="padding:10px;list-style-type: none;">
                    <strong>PiP:</strong>
                    <button style="margin-left:66px;" class="change-key" id="change-pip1-key">Click Here To Change (${keyBindings.pip1})</button>
                </li>
            </ul>
            <button id="close-modal" style="margin-bottom:10px;">Close</button>
            <div class="button-container">
                <a href="https://x.com/luna__mae" target="_blank" id="twitter-link">
                    <button>designed with love by @luna__mae <i style="font-size:12px;" class="fa-brands fa-square-x-twitter"></i></button>
                </a>         
            </div>       
        `;
        document.body.appendChild(modal);
                
        const closeModalButton = modal.querySelector('#close-modal');
        closeModalButton.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    
        setTimeout(() => {
            document.querySelector('#change-screenshot-key').addEventListener('click', () => changeKey('screenshot'));
            document.querySelector('#change-fullscreen-key').addEventListener('click', () => changeKey('fullscreen'));
            document.querySelector('#change-pip1-key').addEventListener('click', () => changeKey('pip1'));
        }, 0);
    };
    
    const changeKey = (action) => {
        const buttonSelector = `#change-${action}-key`;
        const button = document.querySelector(buttonSelector);
        if (!button) {
            console.error(`Button not found for action: ${action}`);
            return;
        }
        button.textContent = 'Waiting...';
        
        const keyCombination = new Set();
        
        const keyDownListener = (event) => {
    
            if (['Control', 'Alt', 'Shift'].includes(event.key)) {
                keyCombination.add(event.key);
            } else {
                const combo = [];
                if (keyCombination.has('Control')) combo.push('Ctrl');
                if (keyCombination.has('Alt')) combo.push('Alt');
                if (keyCombination.has('Shift')) combo.push('Shift');
                combo.push(event.key.toUpperCase());
    
                keyBindings[action] = combo.join('+');
                button.textContent = `Click Here To Change (${keyBindings[action]})`;
    
                localStorage.setItem('keyBindings', JSON.stringify(keyBindings));
    
                keyCombination.clear();
                document.removeEventListener('keydown', keyDownListener);
                document.removeEventListener('keyup', keyUpListener);
            }
        };
    
        const keyUpListener = (event) => {
            if (['Control', 'Alt', 'Shift'].includes(event.key)) {
                keyCombination.delete(event.key);
            }
        };
    
        document.addEventListener('keydown', keyDownListener);
        document.addEventListener('keyup', keyUpListener);
    };
    
    createModal();
    
 
    const scriptId = '514950';
    const updateCheckInterval = 1 * 60 * 60 * 1000;
    const currentVersion = '3.3.8';
    const initialDelay = 2000;
    
    const checkForUpdates = async () => {
        try {
            const proxyUrl = 'https://corsproxy.io/?';
            const targetUrl = `https://update.greasyfork.org/scripts/${scriptId}/Clipping%20Tools%2B%2Bmeta.js`;
            const response = await fetch(proxyUrl + targetUrl);
            const meta = await response.text();
            const versionMatch = meta.match(/@version\s+(\d+\.\d+\.\d+)/);
            if (versionMatch) {
                const latestVersion = versionMatch[1];
                if (latestVersion !== currentVersion) {
                    displayUpdateToast(latestVersion);
                }
            }
        } catch (error) {
            console.error('Failed to check for updates:', error);
        }
    };
 
    function captureScreenshot() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL('image/png');
    
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'FTS3SC.png';
            link.click();
        }
    }
    
    let activeKeys = new Set();
 
    document.addEventListener('keydown', (event) => {
        const chatInput = document.querySelector('.chat-input_chat-input__GAgOF');
        const textInputs = document.querySelectorAll('.input_input__Zwrui input[type="text"]');
        const filterCheckbox = document.querySelector('#luna-checkbox-6');
    
        if ((chatInput && chatInput.contains(document.activeElement)) ||
            Array.from(textInputs).some(input => input === document.activeElement) ||
            (filterCheckbox && filterCheckbox.contains(document.activeElement))) {
            return;
        }
    
        activeKeys.add(event.key);
    
        const keyCombination = [];
        if (activeKeys.has('Control')) keyCombination.push('Ctrl');
        if (activeKeys.has('Alt')) keyCombination.push('Alt');
        if (activeKeys.has('Shift')) keyCombination.push('Shift');
    
        if (!['Control', 'Alt', 'Shift'].includes(event.key)) {
            keyCombination.push(event.key.toUpperCase());
        }
    
        const pressedKey = keyCombination.join('+');
    
        if (pressedKey === keyBindings.screenshot) {
            captureScreenshot();
        }
        if (pressedKey === keyBindings.fullscreen) {
            toggleFullscreen();
        }
        if (pressedKey === keyBindings.pip1) {
            togglePiPMode();
        }
    });
    
    document.addEventListener('keyup', (event) => {
        activeKeys.delete(event.key);
    });
    
    function togglePiPMode() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else {
                videoElement.requestPictureInPicture();
            }
        }
    }
      
    
    function toggleFullscreen() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            if (!document.fullscreenElement) {
                if (videoElement.requestFullscreen) {
                    videoElement.requestFullscreen();
                } else if (videoElement.mozRequestFullScreen) { 
                    videoElement.mozRequestFullScreen();
                } else if (videoElement.webkitRequestFullscreen) { 
                    videoElement.webkitRequestFullscreen();
                } else if (videoElement.msRequestFullscreen) { 
                    videoElement.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { 
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { 
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { 
                    document.msExitFullscreen();
                }
            }
        }
    }
    
    function togglePictureInPicture() {
        const videoElement = document.querySelector('video');
        const pipCheckbox = document.querySelector('#luna-checkbox-1');
        if (videoElement && pipCheckbox) {
            if (pipCheckbox.checked) {
                document.exitPictureInPicture();
                pipCheckbox.checked = false;
            } else {
                videoElement.requestPictureInPicture();
                pipCheckbox.checked = true;
            }
        }
    }
    
    document.addEventListener('leavepictureinpicture', () => {
        const pipCheckbox = document.querySelector('#luna-checkbox-1');
        if (pipCheckbox) {
            pipCheckbox.checked = false;
        }
    });
    const displayUpdateToast = (latestVersion) => {
        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.innerHTML = `
            <div class="custom-toast-message">
                <div class="custom-toast-icon">
                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15 6H17V8H15V6ZM13 10V8H15V10H13ZM11 12V10H13V12H11ZM9 14V12H11V14H9ZM7 16V14H9V16H7ZM5 16H7V18H5V16ZM3 14H5V16H3V14ZM3 14H1V12H3V14ZM11 16H13V18H11V16ZM15 14V16H13V14H15ZM17 12V14H15V12H17ZM19 10V12H17V10H19ZM21 8H19V10H21V8ZM21 8H23V6H21V8Z" fill="#f8ec94"></path>
                    </svg>                    
                </div>
                <p>New Clipping Tools++ version ${latestVersion} available! <a href="https://greasyfork.org/scripts/${scriptId}" target="_blank">Update now</a></p>
                <div class="custom-toast-close">
                    <button class="custom-close-button" type="button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 3H3v18h18V3H5zm14 2v14H5V5h14zm-8 4H9V7H7v2h2v2h2v2H9v2H7v2h2v-2h2v-2h2v2h2v2h2v-2h-2v-2h-2v-2h2V9h2V7h-2v2h-2v2h-2V9z" fill="currentColor"></path>
                    </svg>
                    </button>
                </div>
            </div>
        `;
    
        const mainElement = document.querySelector('main');
        const tooltipElement = document.getElementById('tooltip');
    
        if (mainElement && tooltipElement) {
            mainElement.insertAdjacentElement('afterend', toast);
        } else {
            console.error('Failed to find the main element or tooltip element.');
        }
    
        const closeButton = toast.querySelector('.custom-close-button');
        closeButton.addEventListener('click', () => {
            toast.remove();
        });
    };
    
    setTimeout(checkForUpdates, initialDelay);
    
    setInterval(checkForUpdates, updateCheckInterval);
    
    panelObserver.observe(document.body, { childList: true, subtree: true });
    createModal();
    insertMenuInSidebar();   
})();