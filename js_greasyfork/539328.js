// ==UserScript==
// @name         Luna Tools - DEV
// @description  Clipping tools for clippers
// @author       luna__mae
// @license      GNU GPLv3
// @version      0.3.7
// @homepageURL  https://github.com/luna-mae/ClippingTools
// @namespace    https://github.com/luna-mae/ClippingTools
// @icon         https://raw.githubusercontent.com/luna-mae/ClippingTools/refs/heads/main/media/logo.png
// @supportURL   https://x.com/luna__mae
// @match        https://www.fishtank.live/
// @match        https://www.fishtank.live/clips
// @match        https://www.fishtank.live/clip/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539328/Luna%20Tools%20-%20DEV.user.js
// @updateURL https://update.greasyfork.org/scripts/539328/Luna%20Tools%20-%20DEV.meta.js
// ==/UserScript==
 
(() => {
    "use strict";
 
    const popperScript = document.createElement('script');
    popperScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.9.2/umd/popper.min.js';
    document.head.appendChild(popperScript);
 
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.0/css/all.min.css';
    document.head.appendChild(link);
 
    const style = document.createElement('style');
    style.innerHTML = `
    .toggle-switch {
        width: 80px;
        height: 20px;
        background-color: #191d21;
        border: 2px solid #505050;
        border-radius: 1px;
        position: relative;
        cursor: pointer;
        transition: background-color 0.3s, box-shadow 0.3s;
        box-shadow: inset 0 0 5px #000, outset 0 0 5px #000;
    }
    .toggle-switch.active {
        background-color: #330000;
    }
    .toggle-handle {
        width: 20px;
        height: 30px;
        background-color: #2b2b2b;
        border-radius: 0px;
        position: absolute;
        border: 1px solid #740700;
        top: 50%;
        left: 5px;
        transform: translateY(-50%);
        transition: left 0.3s, background-color 0.3s, box-shadow 0.3s;
        box-shadow: 0 0 5px #000;
    }
    .toggle-handle-b {
        width: 15px;
        height: 27px;
        background-color: #2b2b2b;
        border-radius: 0px;
        position: absolute;
        border: 1px solid #740700;
        top: 50%;
        left: 5px;
        transform: translateY(-50%);
        transition: left 0.3s, background-color 0.3s, box-shadow 0.3s;
        box-shadow: 0 0 5px #000;
    }
    .toggle-switch.active .toggle-handle {
        left: 53px;
        background-color: #a70a00;
        box-shadow: 0 0 15px #ff4444, 0 0 30px #ff0000;
    }
    .toggle-switch.active .toggle-handle-b {
        left: 53px;
        background-color: #a70a00;
        box-shadow: 0 0 15px #ff4444, 0 0 30px #ff0000;
    }       
    .toggle-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding: 10px;
    }
 
    .toggle-row label {
        flex: 1;
        margin-right: 10px;
    }
    .closer {
        background-color: rgba(25, 29, 33, 1);
        border: 1px solid #505050;
        border-radius: 0;
        cursor: pointer;
        transition: color 0.3s, outline 0.3s;
        box-sizing: border-box;
        padding: 10px;
    }     
    .closer:hover {
        outline: 2px solid #f8ec94;
        color: #f8ec94;
    }
    .centerx {
        display: flex;
        justify-content: center;
        align-items: center;  
    }
    .tooltip {
        position: absolute;
        background-color: #333;
        color: white;
        max-width: 200px;
        min-width: 50px;
        padding: 5px 10px;
        border: 1px solid #f8ec94;
        font-size: 11px;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        pointer-events: none;
        z-index: 1220;
    }
    .tooltip-new {
        position: absolute;
        background-color: #121314;
        color: #fff;
        max-width: 200px;
        min-width: 50px;
        padding: 5px 10px;
        border: 1px solid rgba(170,170,170,.2);
        font-size: 15px;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        pointer-events: none;
        z-index: 1220;
        font-weight: 500;
        font-family: Highway Gothic,sans-serif;
        text-transform: none !important;
    }
 
    .tooltip[data-placement="right"] {
        transform: translate(10px, -50%);
        left: 10%;
        top: 10%;
    }
    .tooltip-icon {
        cursor: pointer;
        position: relative;
    }
 
    .tooltip-icon:hover .tooltip {
        opacity: 1;
    }
    .luna-menu {
        top: 10px;
        left: 10px;
        background: rgba(25, 29, 33, 1);
        color: white;
        padding: 0px;
        font-size: 14px;
        border-radius: 4px;
        z-index: 1;
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
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
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
    }
    .menu-title-text {
        flex-grow: 1;
        margin-left: 4px;
        padding-left: 0px;
    }
    #toggle-icon {
        transition: transform 0.5s, filter 0.9s;
        --drop-shadow: drop-shadow(2px 3px 0 #000000);
        filter: var(--drop-shadow);
    }
    #custom-volume-slider input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 8px;
        background: linear-gradient(to right, #740700 0%, #740700 var(--value), #555 var(--value), #555 100%);
        border-radius: 5px;
        outline: none;
    }
 
    #custom-volume-slider input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #505050;
        background: #740700;
        cursor: pointer;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    }
 
    #custom-volume-slider input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #505050;
        background: #740700;
        cursor: pointer;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    }
 
    #custom-volume-slider input[type="range"]:hover {
        background: linear-gradient(to right, #740700 0%, #740700 var(--value), #555 var(--value), #555 100%);
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
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1001;
    }
    .body.mirror, .body.blind {
        transform: none !important;
        -webkit-transform: none !important;
        filter: none !important;
    }
    .theater-mode-active {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999 !important;
        margin: 0 !important;
        padding: 0 !important;
        aspect-ratio: 16/9 !important;
        margin: auto !important;
    }

    .theater-mode-active ~ .layout_top__MHaU_,
    .theater-mode-active ~ .layout_left__O2uku,
    .theater-mode-active ~ .layout_center-bottom__yhDOH,
    .theater-mode-active ~ .layout_right__x_sAY,
    .theater-mode-active ~ .layout_bottom__qRsMw {
        display: none !important;
    }
    .ft-camera-menu {
        width: 100%;
        margin-top: 0px;
        background: rgba(25, 29, 33, 1);
        border: 1px solid #505050;
        font-size: 14px;
        border-radius: 4px;
    }

    .ft-camera-menu-title {
        font-weight: bold;
        padding: 4px 8px;
        background: rgba(116, 7, 0, 1);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }

    .ft-camera-menu-title:hover {
        background-color: #a70a00;
    }

    .ft-camera-menu-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        padding: 10px;
    }

    .ft-camera-button {
        width: 100%;
        background: transparent;
        border: none;
        padding: 0px !important;
        cursor: pointer;
        border-radius: 4px;
        overflow: hidden;
    }

    .ft-camera-button .live-stream_info__23np4 {
        display: flex;
        justify-content: space-between;
        padding: 5px;
        background: rgba(40, 44, 48, 0.7);
        font-size: 11px;
    }

    .ft-camera-button .live-stream_name__ngU04 {
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .ft-camera-button .live-stream_viewers__UeUvp {
        color: #ccc;
        flex-shrink: 0;
        margin-left: 5px;
    }

    .ft-camera-button .live-stream_inner__n9syF {
        position: relative;
        width: 100%;
        aspect-ratio: 16/9;
    }

    .ft-camera-button .live-stream_thumbnail__RN6pc {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .ft-camera-button .live-stream_thumbnail__RN6pc img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .ft-camera-menu .live-stream_viewers__UeUvp {
        font-size: 8px !important;
    }
    .ft-camera-menu.no-thumbnails .live-stream_inner__n9syF {
        display: none;
    }
    .ft-camera-menu .live-stream_info__23np4 {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 5px !important;
    }
    .ft-camera-menu .live-stream_name__ngU04 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .ft-camera-menu .live-stream_viewers__UeUvp {
        font-size: 8px !important;
        color: #aaa !important;
        align-self: center;
        margin-top: -2px;
    }
    `;
    document.head.appendChild(style);
 
    const blockedWords = ["level", "gifted", "plushie", "poll"];
    const toastClass = "toast_body__DVBLz";
 
    document.addEventListener('DOMContentLoaded', (event) => {
        interceptPlay();
    });
 
    const savedSettings = localStorage.getItem('mainSettings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {
        fullMonitoring: false,
        hideMissions: false,
        hideLoot: false,
        hideInv: false,
        hideMission: false,
        hidePoll: false,
        hideAd: false
    };
 
    applyMainSettings(settings);
 
    let activeKeys = new Set();
 
    const keyBindings = {
        screenshot: 'Alt+S',
        fullscreen: 'Alt+Z',
        pip1: 'Alt+X',
        theaterMode: 'Alt+C',
        currentToken: 'Loading...'
    };
    
    const savedKeyBindings = localStorage.getItem('keyBindings');
    if (savedKeyBindings) {
        Object.assign(keyBindings, JSON.parse(savedKeyBindings));
    }    

    if (localStorage.getItem('theaterMode') === 'true') {
        toggleTheaterMode();
    }
 
    document.addEventListener('keydown', (event) => {
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
        if (pressedKey === keyBindings.theaterMode) {
            toggleTheaterMode();
        }
    });
 
    document.addEventListener('keyup', (event) => {
        activeKeys.delete(event.key);
    });
 
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
                videoElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    }

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

    function toggleTheaterMode() {
        const centerDiv = document.querySelector('.layout_center__Vsd3b');
        if (!centerDiv) return;

        const isTheaterMode = !centerDiv.classList.contains('theater-mode-active');
        
        centerDiv.classList.toggle('theater-mode-active');
        
        document.querySelectorAll(`
            .layout_top__MHaU_,
            .layout_left__O2uku,
            .layout_center-bottom__yhDOH,
            .layout_right__x_sAY,
            .layout_bottom__qRsMw
        `).forEach(el => {
            el.style.display = isTheaterMode ? 'none' : '';
        });

        localStorage.setItem('theaterMode', isTheaterMode);
    }
 
    function openMainSettingsModal() {
        const savedSettings = localStorage.getItem('mainSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : {
            fullMonitoring: false,
            hideMissions: false,
            hideLoot: false,
            hideInv: false,
            hideMission: false,
            hidePoll: false,
            hideAd: false
        };
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
 
        const modal = document.createElement('div');
        modal.className = 'main-settings-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%'; 
        modal.style.width = '650px';
        modal.style.border = '3px solid #505050';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#191d21';
        modal.style.padding = '0px';
        modal.style.boxShadow = 'rgb(0 0 0 / 85%) 15px 15px 20px';
        modal.style.zIndex = '1010';
        modal.innerHTML = `
        <div class="modal-content">
            <h2 style="color:#fff;background-color:#740700;padding-left:8px;padding-top:8px;padding-bottom:8px;">Main Settings</h2>
            <div style="display: flex; border-bottom: 1px solid #505050;">
                <button class="settings-tab active" data-tab="general-tab" style="flex: 1; background-color: #740700; color: white; border: none; padding: 10px; cursor: pointer; font-weight: bold; border-right: 1px solid #505050;">
                    General Settings
                </button>
                <button class="settings-tab" data-tab="keybinds-tab" style="flex: 1; background-color: #191d21; color: #aaa; border: none; padding: 10px; cursor: pointer; font-weight: bold;">
                    Alt Keybinds
                </button>
            </div>
            <div id="general-tab" class="tab-content active" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; color:#fff; padding: 10px; font-size: 11px;">
                <div class="toggle-row">
                    <label>Full Monitoring Point:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Shows full monitoring point so you do not have to scroll."></i></label>
                    <div class="toggle-switch" id="toggle-monitoring-point"></div>
                </div>
                <div class="toggle-row">
                    <label>Block Global Missions:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Blocks Global Missions from taking over screen. A red notification bell will appear in the top bar if you are missing a global mission. This allows you to click it to temporarily show you the mission and accept/deny on your own time."></i></label>
                    <div class="toggle-switch" id="toggle-global-mission"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Prize Machine (NEW):<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides the prize machine from the sidebar."></i></label>
                    <div class="toggle-switch" id="toggle-loot"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Wet Market (NEW):<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides the wet market from the sidebar."></i></label>
                    <div class="toggle-switch" id="toggle-wet-market"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Scan Lines:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides the overlay of scanlines."></i></label>
                    <div class="toggle-switch" id="toggle-scan"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Inventory:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides the inventory dropdown from the sidebar."></i></label>
                    <div class="toggle-switch" id="toggle-inv"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Missions:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides the missions dropdown from the sidebar."></i></label>
                    <div class="toggle-switch" id="toggle-mission"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Polls:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides the poll dropdown from the sidebar."></i></label>
                    <div class="toggle-switch" id="toggle-poll"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Narrative Polls:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Blocks narrative polls from displaying."></i></label>
                    <div class="toggle-switch" id="toggle-npoll"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Stox (NEW):<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Blocks Stox from displaying in the sidebar."></i></label>
                    <div class="toggle-switch" id="toggle-stox"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Announcement Bar (NEW):<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Blocks the announcement bar from displaying below the cameras."></i></label>
                    <div class="toggle-switch" id="toggle-announcement"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Stox Bar (NEW):<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Blocks the Stox bar from displaying below the cameras."></i></label>
                    <div class="toggle-switch" id="toggle-stox-bar"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Ad:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides the ad in the bottom of the sidebar."></i></label>
                    <div class="toggle-switch" id="toggle-ad"></div>
                </div>
                <div class="toggle-row">
                    <label>Filter Toasts:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides any toasts containing the words level, gifted, or plushie."></i></label>
                    <div class="toggle-switch" id="toggle-toasts"></div>
                </div>
                <div class="toggle-row">
                    <label>Block SFX:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Blocks site SFX, such as toggling cameras or leveling up."></i></label>
                    <div class="toggle-switch" id="toggle-sfx"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Clickable Zones:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hide's the red overlay on clickable zones, still allowing you to click them."></i></label>
                    <div class="toggle-switch" id="toggle-zones"></div>
                </div>
                <div class="toggle-row">
                    <label>Enable Clipping Controls:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Removes buttons that overlay the stream in both normal and fullscreen and moves them into the sidebar as a dropdown. REQUIRES REFRESH TO REMOVE THE SIDEBAR PANEL"></i></label>
                    <div class="toggle-switch" id="toggle-controls"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Sidebar Footer:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hide's the footer in the sidebar. This is stuff like socials, terms, and privacy."></i></label>
                    <div class="toggle-switch" id="toggle-footer"></div>
                </div>
                <div class="toggle-row">
                    <label>No Wartoys:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Prevents the mirror effect/B&W from being applied to the site."></i></label>
                    <div class="toggle-switch" id="toggle-no-wartoys"></div>
                </div>
                <div class="toggle-row">
                    <label>Colorblind Mode:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Makes the website B&W for easier viewing"></i></label>
                    <div class="toggle-switch" id="toggle-colorblind"></div>
                </div>
                <div class="toggle-row">
                    <label>Hide Theater:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides the theater mode overlay in the video player."></i></label>
                    <div class="toggle-switch" id="toggle-theaterb"></div>
                </div>
                <div class="toggle-row">
                    <label>No 4:3 Mode (NEW):<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Forces the video player to not be 4:3."></i></label>
                    <div class="toggle-switch" id="toggle-no-4-3"></div>
                </div>
            </div>
            <div id="keybinds-tab" class="tab-content" style="display: none; color:#fff; padding: 10px; font-size: 11px;">
                <div class="toggle-row" style="grid-column: span 2; font-size:16px; margin-bottom: 15px;">
                    <Label>Screenshot Bind:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Takes a screenshot of the video player."></i></Label>
                    <button class="closer" id="change-screenshot-key" style="max-width:400px;">Click Here To Change (${keyBindings.screenshot})</button>
                </div>
                <div class="toggle-row" style="grid-column: span 2; font-size:16px; margin-bottom: 15px;">
                    <Label>Fullscreen Bind:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Toggles fullscreen mode on the video player."></i></Label>
                    <button class="closer" id="change-fullscreen-key" style="max-width:400px;">Click Here To Change (${keyBindings.fullscreen})</button>
                </div>
                <div class="toggle-row" style="grid-column: span 2; font-size:16px; margin-bottom: 15px;">
                    <Label>PiP Bind:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Toggles Picture-in-Picture mode on the video player."></i></Label>
                    <button class="closer" id="change-pip1-key" style="max-width:400px;">Click Here To Change (${keyBindings.pip1})</button>
                </div>
                <div class="toggle-row" style="grid-column: span 2; font-size:16px; margin-bottom: 15px;">
                    <Label>Theater Mode Bind:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Toggles a custom theater mode which isolates only the cam grid and video player."></i></Label>
                    <button class="closer" id="change-theatermode" style="max-width:400px;">Click Here To Change (${keyBindings.theaterMode})</button>
                </div>
                <div class="toggle-row" style="grid-column: span 2; font-size:16px; margin-top: 20px; border-top: 1px solid #444; padding-top: 15px;">
                    <Label>Session Token:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Current authentication token"></i></Label>
                    <div style="display: flex; align-items: center; gap: 8px; max-width: 100%;">
                        <span  value="${keyBindings.tokenDisplay}" id="token-display" style="font-family: monospace; word-break: break-all; max-width: 300px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical;">
                            ${keyBindings.tokenDisplay}
                        </span>

                    </div>
                </div>
            </div>
            <div class="centerx" style="padding:10px;">
                <button class="closer" id="save-settings">Save Settings</button>
            </div>
        </div>
    `;

        document.body.appendChild(backdrop);
        document.body.appendChild(modal);

        const tabs = modal.querySelectorAll('.settings-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.style.backgroundColor = '#202020';
                    t.style.color = '#aaa';
                });
                
                tab.classList.add('active');
                tab.style.backgroundColor = '#3a040070';
                tab.style.color = 'white';
                
                modal.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });

                const tabId = tab.getAttribute('data-tab');
                const activeContent = modal.querySelector(`#${tabId}`);
                if (activeContent) {
                    activeContent.style.display = 'grid';
                    if (tabId === 'keybinds-tab') {
                        activeContent.style.display = 'block';
                    }
                }
            });
        });
 
        document.querySelector('#change-screenshot-key').addEventListener('click', () => changeKey('screenshot'));
        document.querySelector('#change-fullscreen-key').addEventListener('click', () => changeKey('fullscreen'));
        document.querySelector('#change-pip1-key').addEventListener('click', () => changeKey('pip1'));
        document.querySelector('#change-theatermode').addEventListener('click', () => changeKey('theaterMode'));
 
        setInterval(() => {
            document.querySelectorAll('.tooltip-icon').forEach(icon => {
                if (!icon.hasAttribute('data-tooltip-initialized')) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.innerText = icon.getAttribute('data-title');
                    document.body.appendChild(tooltip);
 
                    icon.addEventListener('mouseenter', () => {
                        Popper.createPopper(icon, tooltip, {
                            placement: icon.getAttribute('data-placement') || 'right',
                            modifiers: [
                                {
                                    name: 'offset',
                                    options: {
                                        offset: [0, 10],
                                    },
                                },
                            ],
                        });
                        tooltip.style.opacity = '1';
                    });
        
                    icon.addEventListener('mouseleave', () => {
                        tooltip.style.opacity = '0';
                    });
        
                    icon.setAttribute('data-tooltip-initialized', 'true');
                }
            });
        }, 100);
 
        initializeToggleSwitch(document.getElementById('toggle-monitoring-point'), settings.fullMonitoring || false);
        initializeToggleSwitch(document.getElementById('toggle-global-mission'), settings.hideMissions || false);
        initializeToggleSwitch(document.getElementById('toggle-loot'), settings.hideLoot || false);
        initializeToggleSwitch(document.getElementById('toggle-wet-market'), settings.hideWetMarket || false);
        initializeToggleSwitch(document.getElementById('toggle-scan'), settings.hideScan || false);
        initializeToggleSwitch(document.getElementById('toggle-inv'), settings.hideInv || false);
        initializeToggleSwitch(document.getElementById('toggle-mission'), settings.hideMission || false);
        initializeToggleSwitch(document.getElementById('toggle-poll'), settings.hidePoll || false);
        initializeToggleSwitch(document.getElementById('toggle-npoll'), settings.hideNpoll || false);
        initializeToggleSwitch(document.getElementById('toggle-stox'), settings.hideStox || false);
        initializeToggleSwitch(document.getElementById('toggle-announcement'), settings.hideAnnouncement || false);
        initializeToggleSwitch(document.getElementById('toggle-stox-bar'), settings.hideStoxBar || false);
        initializeToggleSwitch(document.getElementById('toggle-ad'), settings.hideAd || false);
        initializeToggleSwitch(document.getElementById('toggle-toasts'), settings.blockToasts || false);
        initializeToggleSwitch(document.getElementById('toggle-sfx'), settings.hideSfx || false);
        initializeToggleSwitch(document.getElementById('toggle-zones'), settings.hideZones || false);
        initializeToggleSwitch(document.getElementById('toggle-controls'), settings.hideControls || false);
        initializeToggleSwitch(document.getElementById('toggle-footer'), settings.hideFooter || false);
        initializeToggleSwitch(document.getElementById('toggle-no-wartoys'), settings.hideWartoy || false);
        initializeToggleSwitch(document.getElementById('toggle-colorblind'), settings.colorBlind || false);
        initializeToggleSwitch(document.getElementById('toggle-theaterb'), settings.hideTheaterb || false);
        initializeToggleSwitch(document.getElementById('toggle-no-4-3'), settings.no43 || false);

        document.getElementById('save-settings').addEventListener('click', () => {
            const newSettings = {
                fullMonitoring: document.getElementById('toggle-monitoring-point').classList.contains('active'),
                hideMissions: document.getElementById('toggle-global-mission').classList.contains('active'),
                hideLoot: document.getElementById('toggle-loot').classList.contains('active'),
                hideWetMarket: document.getElementById('toggle-wet-market').classList.contains('active'),
                hideScan: document.getElementById('toggle-scan').classList.contains('active'),
                hideInv: document.getElementById('toggle-inv').classList.contains('active'),
                hideMission: document.getElementById('toggle-mission').classList.contains('active'),
                hidePoll: document.getElementById('toggle-poll').classList.contains('active'),
                hideNpoll: document.getElementById('toggle-npoll').classList.contains('active'),
                hideStox: document.getElementById('toggle-stox').classList.contains('active'),
                hideAnnouncement: document.getElementById('toggle-announcement').classList.contains('active'),
                hideStoxBar: document.getElementById('toggle-stox-bar').classList.contains('active'),
                hideAd: document.getElementById('toggle-ad').classList.contains('active'),
                blockToasts: document.getElementById('toggle-toasts').classList.contains('active'),
                hideSfx: document.getElementById('toggle-sfx').classList.contains('active'),
                hideZones: document.getElementById('toggle-zones').classList.contains('active'),
                hideControls: document.getElementById('toggle-controls').classList.contains('active'),
                hideFooter: document.getElementById('toggle-footer').classList.contains('active'),
                hideWartoy: document.getElementById('toggle-no-wartoys').classList.contains('active'),
                colorBlind: document.getElementById('toggle-colorblind').classList.contains('active'),
                hideTheaterb: document.getElementById('toggle-theaterb').classList.contains('active'),
                no43: document.getElementById('toggle-no-4-3').classList.contains('active')
            };
            localStorage.setItem('mainSettings', JSON.stringify(newSettings));
            applyMainSettings(newSettings);
            modal.remove();
            document.body.removeChild(backdrop);
        });
 
        applyMainSettings(settings);
 
        backdrop.onclick = () => {
            document.body.removeChild(modal);
            document.body.removeChild(backdrop);
        };
    }


    
    function initializeToggleSwitch(toggle, isActive) {
        toggle.className = 'toggle-switch';
        if (isActive) toggle.classList.add('active');
        toggle.innerHTML = '<div class="toggle-handle"></div>';
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
    
            const currentSettings = {
                fullMonitoring: document.getElementById('toggle-monitoring-point').classList.contains('active'),
                hideMissions: document.getElementById('toggle-global-mission').classList.contains('active'),
                hideLoot: document.getElementById('toggle-loot').classList.contains('active'),
                hideWetMarket: document.getElementById('toggle-wet-market').classList.contains('active'),
                hideScan: document.getElementById('toggle-scan').classList.contains('active'),
                hideInv: document.getElementById('toggle-inv').classList.contains('active'),
                hideMission: document.getElementById('toggle-mission').classList.contains('active'),
                hidePoll: document.getElementById('toggle-poll').classList.contains('active'),
                hideNpoll: document.getElementById('toggle-npoll').classList.contains('active'),
                hideStox: document.getElementById('toggle-stox').classList.contains('active'),
                hideStoxBar: document.getElementById('toggle-stox-bar').classList.contains('active'),
                hideAnnouncement: document.getElementById('toggle-announcement').classList.contains('active'),
                hideAd: document.getElementById('toggle-ad').classList.contains('active'),
                blockToasts: document.getElementById('toggle-toasts').classList.contains('active'),
                hideSfx: document.getElementById('toggle-sfx').classList.contains('active'),
                hideZones: document.getElementById('toggle-zones').classList.contains('active'),
                hideControls: document.getElementById('toggle-controls').classList.contains('active'),
                hideFooter: document.getElementById('toggle-footer').classList.contains('active'),
                hideWartoy: document.getElementById('toggle-no-wartoys').classList.contains('active'),
                colorBlind: document.getElementById('toggle-colorblind').classList.contains('active'),
                hideTheaterb: document.getElementById('toggle-theaterb').classList.contains('active'),
                no43: document.getElementById('toggle-no-4-3').classList.contains('active')
            };
            localStorage.setItem('mainSettings', JSON.stringify(currentSettings));
            applyMainSettings(currentSettings);
            interceptPlay();
        });
    }
 
    function applyMainSettings(settings) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        document.head.appendChild(style);
    
        let isBellActive = false;

        if (settings.hideWartoy) {
            document.body.classList.remove('mirror', 'blind');
            monitorWartoy();
        }
            
        const checkModal = () => {
            let showBell = false;
            const hideModalsStyle = `
                ${settings.fullMonitoring ? '.live-streams-monitoring-point_list__g0ojU { max-height: 130px !important; height: 584px !important; }' : '.live-streams-monitoring-point_list__g0ojU { max-height: 250px !important; height: unset !important; }'}
                ${settings.hideLoot ? '.item-nav-buttons_prize-machine__jnHNS { display: none !important; }' : '.item-nav-buttons_prize-machine__jnHNS { display: flex !important; }'}
                ${settings.hideWetMarket ? '.item-nav-buttons_market__28l6K { display: none !important; }' : '.item-nav-buttons_market__28l6K { display: flex !important; }'}
                ${settings.hideInv ? '.inventory_inventory__7bCIe { display: none !important; }' : '.inventory_inventory__7bCIe { display: unset !important; }'}
                ${settings.hideMission ? '.missions_missions__haRAj { display: none !important; }' : '.missions_missions__haRAj { display: unset !important; }'}
                ${settings.hidePoll ? '.poll_poll__QyVsN { display: none !important; }' : '.poll_poll__QyVsN { display: unset !important; }'}
                ${settings.hideNpoll ? '.narrative-poll_narrative-poll__qkl0m { display: none !important; }' : '.narrative-poll_narrative-poll__qkl0m { display: unset !important; }'}
                ${settings.hideStox ? '.stocks-panel_stocks-panel___JNmj { display: none !important; }' : '.stocks-panel_stocks-panel___JNmj { display: unset !important; }'}
                ${settings.hideAnnouncement ? '.announcement-bar_announcement-bar__gcGuh { display: none !important; }' : '.announcement-bar_announcement-bar__gcGuh { display: flex !important; }'}
                ${settings.hideStoxBar ? '.stocks-bar_stocks-bar__7kNv8 { display: none !important; }' : '.stocks-bar_stocks-bar__7kNv8 { display: flex !important; }'}
                ${settings.hideAd ? '.ads_ads__Z1cPk { display: none !important; }' : '.ads_ads__Z1cPk { display: flex !important; }'}
                ${settings.hideZones ? '.clickable-zones_live-stream__i75zd:hover, .clickable-zones_link__GKCZn:hover { fill: none !important; } .clickable-zones_link__GKCZn { cursor: unset !important; }' : '.clickable-zones_live-stream__i75zd:hover { fill: rgba(243,14,0,.1) !important; } .clickable-zones_link__GKCZn:hover { fill: rgba(122, 246, 233, .1) !important; cursor: pointer !important; }'}
                ${settings.hideControls ? '.live-stream-controls_live-stream-volume__4g08X, .live-stream-clipping_live-stream-clipping__xkFfU   { display: none !important; }' : '.live-stream-controls_live-stream-volume__4g08X, .live-stream-clipping_live-stream-clipping__xkFfU { display: block !important; }'}
                ${settings.hideFooter ? '.footer_footer__Mnt6p { display: none !important; }' : '.footer_footer__Mnt6p { display: flex !important; }'}
                ${settings.colorBlind ? 'body { filter: grayscale(100%) !important; }' : 'body { filter: none !important; }'}
                ${settings.hideMissions ? '.global-mission-modal_backdrop__oVezg { display: none !important;} ': '.global-mission-modal_backdrop__oVezg { display: flex !important;} '}
                ${settings.hideTheaterb ? '.live-stream-controls_live-stream-cinema__KrgsR { display: none !important; }' : '.live-stream-controls_live-stream-cinema__KrgsR  { display: unset !important; }'}
                ${settings.no43 ? '.hls-stream-player_hls-stream-player__BJiGl video { object-fit: contain !important; }' : '.hls-stream-player_hls-stream-player__BJiGl video { object-fit: fill !important; }'}
            `;
 
            if (settings.hideScan) {
                document.body.classList.add('luna-hide-scan_lines');
            } else {
                document.body.classList.remove('luna-hide-scan_lines');
            }
    
            const modalContainers = document.querySelectorAll('.modal_modal-container__iQODa, .modal_modal__MS70U, .global-mission-modal_backdrop__oVezg');
            modalContainers.forEach(modalContainer => {
                if (modalContainer && modalContainer.textContent.includes('Global Mission')) {
                    if (settings.hideMissions && !isBellActive) {
                        modalContainer.style.setProperty('display', 'none', 'important');
                        showBell = true;
                    } else {
                        modalContainer.style.setProperty('display', 'flex', 'important');
                    }
                }
            });
    
            const dropdownButton = document.querySelector('.dropdown-button_dropdown-button__X_K4O');
            if (dropdownButton) {
                if (showBell) {
                    let bellIcon = document.querySelector('.fa-bell');
                    if (!bellIcon) {
                        bellIcon = document.createElement('i');
                        bellIcon.className = 'fa-regular fa-bell fa-xl';
                        bellIcon.style.marginLeft = '8px';
                        bellIcon.style.color = '#fd0f00';
                        bellIcon.style.cursor = 'pointer';
                        bellIcon.onclick = () => {
                            isBellActive = true;
                            modalContainers.forEach(modalContainer => {
                                if (modalContainer && modalContainer.textContent.includes('Global Mission')) {
                                    modalContainer.style.setProperty('display', 'flex', 'important');
                                }
                            });
 
                            setTimeout(() => {
                                isBellActive = false;
                                checkModal();
                            }, 10000);
    
                            bellIcon.remove();
                        };
                        dropdownButton.parentNode.insertBefore(bellIcon, dropdownButton);
                    }
                } else {
                    const bellIcon = document.querySelector('.fa-bell');
                    if (bellIcon) {
                        bellIcon.remove();
                    }
                }
            }
    
            style.innerHTML = hideModalsStyle;
 
            if (settings.hideControls) {
                initializeLivestreamControls();
            }
 
        };
 
        const observer = new MutationObserver(checkModal);
        observer.observe(document.body, { childList: true, subtree: true });
    
        checkModal();
        interceptPlay();
        filterToasts();
    }
 
    const blockedDirectories = [
        "https://cdn.fishtank.live/sounds/",
        "https://cdn.fishtank.live/sfx/"
    ];

    function monitorWartoy() {
        const savedSettings = localStorage.getItem('mainSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : { hideWartoy: false };

        if (settings.hideWartoy) {
            document.body.classList.remove('mirror', 'blind');
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (document.body.classList.contains('mirror') || 
                            document.body.classList.contains('blind')) {
                            document.body.classList.remove('mirror', 'blind');
                        }
                    }
                });
            });

            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    monitorWartoy();

    function interceptPlay() {
        if (!HTMLAudioElement.prototype.originalPlay) {
            HTMLAudioElement.prototype.originalPlay = HTMLAudioElement.prototype.play;
        }
        HTMLAudioElement.prototype.play = function() {
            const savedSettings = localStorage.getItem('mainSettings');
            const settings = savedSettings ? JSON.parse(savedSettings) : { hideSfx: false };
            const blockSfx = settings.hideSfx;
    
            if (blockSfx && blockedDirectories.some(dir => this.src.includes(dir))) {
                return Promise.resolve();
            }
            return HTMLAudioElement.prototype.originalPlay.apply(this, arguments);
        };
    }
 
 
    
    function containsBlockedWords(text) {
        return blockedWords.some(word => text.toLowerCase().includes(word));
    }
    
    function filterToasts() {
        const savedSettings = localStorage.getItem('mainSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : { blockToasts: false };
    
        const toasts = document.querySelectorAll(`.${toastClass}`);
    
        if (settings.blockToasts) {
            toasts.forEach(toast => {
                const toastText = toast.innerText || "";
    
                if (containsBlockedWords(toastText)) {
                    toast.style.display = "none";
                } else {
                    toast.style.display = "";
                }
            });
        } else {
            toasts.forEach(toast => {
                toast.style.display = "";
            });
        }
    }
    
    setInterval(filterToasts, 10);
    
    
    function attachMainSIcon() {
        const topBarButton = document.querySelector('.top-bar_link__0xN4F.top-bar_red__1Up8r');
        if (topBarButton) {
            const settingsCog = document.createElement('i');
            settingsCog.id = 'main-settings-gear';
            settingsCog.className = 'fa-solid fa-gear fa-xl';
            settingsCog.style.color = 'white';
            settingsCog.style.cursor = 'pointer';
            settingsCog.style.marginLeft = '10px';
            topBarButton.insertAdjacentElement('afterend', settingsCog);
 
            settingsCog.addEventListener('click', () => {
                openMainSettingsModal();
            });
 
        }
    }
 
    const observer = new MutationObserver(() => {
        const topBarButton = document.querySelector('.top-bar_link__0xN4F.top-bar_red__1Up8r');
        if (topBarButton) {
            attachMainSIcon();
            observer.disconnect();
        }
    });
 
 
    observer.observe(document, {
        childList: true,
        subtree: true
    });   
 
    function initializeLivestreamControls(options = {}) {
        setTimeout(() => {
            (function () {
                "use strict";
    
                function createVolumeSliderWithRecording() {
                    const container = document.createElement("div");
                    container.id = "custom-volume-slider";
                    container.classList.add("luna-menu");
                    container.style.color = "#fff";
    
                    const header = document.createElement("div");
                    header.classList.add("luna-menu_title");
                    header.style.marginBottom = "0px";
    
                    header.innerHTML = `
                        <svg id="toggle-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M19 8H5V10H7V12H9V14H11V16H13V14H15V12H17V10H19V8Z" fill="#f8ec94"></path>
                        </svg><span class="menu-title-text">Livestream Controls</span>
                    `;
    
                    container.appendChild(header);
    
                    const content = document.createElement("div");
                    content.style.display = "none";
    
                    const sliderLabel = document.createElement("span");
                    sliderLabel.innerText = "Volume:";
                    sliderLabel.style.marginRight = "10px";
                    sliderLabel.style.marginTop = "5px";
                    sliderLabel.style.marginLeft = "5px";
    
                    const volumeSlider = document.createElement("input");
                    volumeSlider.type = "range";
                    volumeSlider.min = "0.00001";
                    volumeSlider.max = "1";
                    volumeSlider.step = "0.01";
                    volumeSlider.value = "1";
                    volumeSlider.style.background = "#740700";
                    volumeSlider.style.border = "1px solid #505050";
                    volumeSlider.style.flex = "1";
                    volumeSlider.style.marginRight = "5px";
                    volumeSlider.classList.add("custom-volume-slider");
    
                    const storedVolume = localStorage.getItem("volume") || 50;
                    volumeSlider.value = storedVolume;
    
                    volumeSlider.addEventListener("input", () => {
                        localStorage.setItem("volume", volumeSlider.value);
                    });
    
                    volumeSlider.style.setProperty("--value", `${storedVolume}%`);
    
                    volumeSlider.addEventListener("input", function () {
                        const videoElement = document.querySelector("video[data-livepeer-video]");
                        const websiteVolumeSlider = document.querySelector(".live-stream-controls_slider__S7QZS input[type='range']");
                    
                        if (videoElement) {
                            videoElement.volume = this.value;
                            videoElement.setAttribute("data-livepeer-volume", Math.round(this.value * 100));
                        }
                    
                        if (websiteVolumeSlider) {
                            websiteVolumeSlider.value = this.value;
                            websiteVolumeSlider.dispatchEvent(new Event("input", { bubbles: true }));
                        }
                    
                        this.style.background = `linear-gradient(to right, #740700 ${this.value * 100}%, #555 ${this.value * 100}%)`;
                    });
                    
                    
    
                    volumeSlider.style.background = `linear-gradient(to right, #740700 ${volumeSlider.value * 100}%, #555 ${volumeSlider.value * 100}%)`;
    
                    const volumeContainer = document.createElement("div");
                    volumeContainer.style.display = "flex";
                    volumeContainer.style.alignItems = "center";
                    volumeContainer.style.width = "100%";
    
                    volumeContainer.appendChild(sliderLabel);
                    volumeContainer.appendChild(volumeSlider);
 
                    const recordingContainer = document.createElement("div");
                    recordingContainer.style.display = "flex";
                    recordingContainer.style.justifyContent = "space-between";
                    recordingContainer.style.width = "100%";
                    recordingContainer.style.marginTop = "10px";
    
                    const startButton = document.createElement("button");
                    startButton.innerText = "Start Recording";
                    startButton.style.marginRight = "0px";
                    startButton.style.padding = "10px";
                    startButton.style.flex = "1";
                    startButton.style.fontSize = "10px";
                    startButton.style.backgroundColor = "#303438";
                    startButton.style.border = "2px solid black";
                    startButton.style.borderRight = "1px solid black";
                    startButton.style.color = "#fff";
                    startButton.style.cursor = "pointer";
    
                    let isRecording = false;
    
                    startButton.addEventListener("click", function () {
                        const event = new KeyboardEvent("keydown", {
                            key: "c",
                            code: "KeyC",
                            ctrlKey: false,
                            shiftKey: false,
                            altKey: false,
                            metaKey: false,
                            bubbles: true,
                            cancelable: true,
                        });
                        document.dispatchEvent(event);
    
                        isRecording = !isRecording;
                        startButton.innerText = isRecording ? "Stop Recording" : "Start Recording";
                        if (isRecording) {
                            startButton.style.backgroundColor = "#740700";
                            startButton.style.color = "#f8ec94";
                        } else {
                            startButton.style.backgroundColor = "#555";
                            startButton.style.color = "#fff";
                        }
                    });
    
                    const lastMinuteButton = document.createElement("button");
                    lastMinuteButton.innerText = "Record Last Minute";
                    lastMinuteButton.style.padding = "0px";
                    lastMinuteButton.style.flex = "1";
                    lastMinuteButton.style.fontSize = "10px";
                    lastMinuteButton.style.backgroundColor = "#303438";
                    lastMinuteButton.style.border = "2px solid black";
                    lastMinuteButton.style.borderLeft = "1px solid black";
                    lastMinuteButton.style.color = "#fff";
                    lastMinuteButton.style.cursor = "pointer";
    
                    lastMinuteButton.addEventListener("click", function () {
                        const event = new KeyboardEvent("keydown", {
                            key: "c",
                            code: "KeyC",
                            ctrlKey: false,
                            shiftKey: true,
                            altKey: false,
                            metaKey: false,
                            bubbles: true,
                            cancelable: true,
                        });
                        document.dispatchEvent(event);
                    });
    
                    content.appendChild(volumeContainer);
                    recordingContainer.appendChild(startButton);
                    recordingContainer.appendChild(lastMinuteButton);
                    content.appendChild(recordingContainer);
 
                    const blockQualityToggle = createToggleSwitch(
                        "block-quality-toggle",
                        "Hide Quality",
                        JSON.parse(localStorage.getItem("block-quality-toggle")) || false,
                        (isActive) => {
                            const qualityDiv = document.querySelector(".live-stream-controls_live-stream-quality__6a6cl");
                            if (qualityDiv) {
                                qualityDiv.style.display = isActive ? "none" : "block";
                            }
                        }
                    );
                    content.appendChild(blockQualityToggle);
                    
                    const observeQualityDiv = () => {
                        const observer = new MutationObserver(() => {
                            const isActive = JSON.parse(localStorage.getItem("block-quality-toggle")) || false;
                            const qualityDiv = document.querySelector(".live-stream-controls_live-stream-quality__6a6cl");
                    
                            if (qualityDiv) {
                                qualityDiv.style.display = isActive ? "none" : "block";
                            }
                        });
 
                        const targetNode = document.body;
                        observer.observe(targetNode, {
                            childList: true,
                            subtree: true,
                        });
                    };
 
                    observeQualityDiv();
                
                    const pipAndFullscreenContainer = document.createElement("div");
                    pipAndFullscreenContainer.classList.add("luna-menu_item");
                    pipAndFullscreenContainer.style.display = "flex";
                    pipAndFullscreenContainer.style.justifyContent = "space-between";
                    pipAndFullscreenContainer.style.alignItems = "center";
                    
                    const pipToggleContainer = createToggleSwitch(
                        "pip-toggle",
                        "PiP",
                        JSON.parse(localStorage.getItem("pip-toggle")) || false,
                        async (isActive) => {
                            const videoElement = document.querySelector(".live-stream-player_container__A4sNR video");
                            try {
                                if (isActive && videoElement) {
                                    await videoElement.requestPictureInPicture();
                                } else if (document.pictureInPictureElement) {
                                    await document.exitPictureInPicture();
                                }
                            } catch (error) {
                                console.error("Error toggling Picture-in-Picture:", error);
                            }
                        }
                    );
                    const pipToggle = pipToggleContainer.toggleSwitch;

                    pipToggleContainer.style.width = "115px";  
                    
                    const fullscreenToggleContainer = createToggleSwitch(
                        "fullscreen-toggle",
                        "Full",
                        JSON.parse(localStorage.getItem("fullscreen-toggle")) || false,
                        async (isActive) => {
                            const videoElement = document.querySelector(".live-stream-player_container__A4sNR video");
                            try {
                                if (isActive && videoElement) {
                                    await videoElement.requestFullscreen();
                                } else if (document.fullscreenElement) {
                                    await document.exitFullscreen();
                                }
                            } catch (error) {
                                console.error("Error toggling Fullscreen:", error);
                            }
                        }
                    );
                    const fullscreenToggle = fullscreenToggleContainer.toggleSwitch;

                    fullscreenToggleContainer.style.width = "115px";  
                    
 
                    fullscreenToggle.style.marginLeft = "5px";
 
                    document.addEventListener("leavepictureinpicture", () => {
                        pipToggle.setState(false);
                    });
 
                    document.addEventListener("fullscreenchange", () => {
                        if (!document.fullscreenElement) {
                            fullscreenToggle.setState(false);
                        }
                    });
                    
                    pipAndFullscreenContainer.appendChild(pipToggleContainer);
                    pipAndFullscreenContainer.appendChild(fullscreenToggleContainer);
                    content.appendChild(pipAndFullscreenContainer);
                    
                    
                    
    
                    container.appendChild(content);
    
                    const toggleIcon = header.querySelector("#toggle-icon");
    
                    header.addEventListener("click", function () {
                        if (content.style.display === "none") {
                            content.style.display = "block";
                        } else {
                            content.style.display = "none";
                        }
    
                        const isCollapsed = content.style.display === "none";
                        toggleIcon.style.transform = isCollapsed ? "rotate(0deg)" : "rotate(180deg)";
                        toggleIcon.style.setProperty(
                            "--drop-shadow",
                            isCollapsed ? "drop-shadow(2px 3px 0 #000000)" : "drop-shadow(-2px -3px 0 #000000)"
                        );
                    });
    
                    return container;
                }
    
                function moveControls() {
                    const sidebar = document.querySelector(".layout_left__O2uku");
                    const adsDiv = document.querySelector(".inventory_inventory__7bCIe");
    
                    if (!sidebar || !adsDiv) {
                        console.log("Sidebar or Ads div not found. Retrying...");
                        return;
                    }
    
                    let customSlider = document.getElementById("custom-volume-slider");
                    if (!customSlider) {
                        customSlider = createVolumeSliderWithRecording();
                        sidebar.insertBefore(customSlider, adsDiv);
                    }
    
                    const volumeControls = document.querySelector(".livepeer-video-player_volume-controls__q9My4");
                    if (volumeControls && !volumeControls.classList.contains("moved")) {
                        volumeControls.classList.add("moved");
                        volumeControls.style.display = "none";
                    }
    
                    const clippingControls = document.querySelector(".livepeer-video-player_clipping__GlB4S");
                    if (clippingControls && !clippingControls.classList.contains("moved")) {
                        clippingControls.classList.add("moved");
                        clippingControls.style.display = "none";
                    }
                }
    
                setInterval(moveControls, 100);
            })();
        }, 1500);
    }
    
    
    function createToggleSwitch(id, labelText, initialState, callback) {
        const container = document.createElement("div");
        container.classList.add("luna-menu_item");
        container.style.display = "flex";
        container.style.justifyContent = "flex-start";
        container.style.alignItems = "center";
    
        const label = document.createElement("label");
        label.innerText = labelText;
        label.style.margin = "0 0px 0 0";
        label.style.flex = "1";
    
        const toggleSwitch = document.createElement("div");
        toggleSwitch.className = "toggle-switch";
        if (initialState) toggleSwitch.classList.add("active");
        toggleSwitch.id = id;
    
        toggleSwitch.innerHTML = '<div class="toggle-handle-b"></div>';
    
        toggleSwitch.addEventListener("click", () => {
            toggleSwitch.classList.toggle("active");
            const isActive = toggleSwitch.classList.contains("active");
            localStorage.setItem(id, isActive);
            callback(isActive);
        });
    
        toggleSwitch.setState = function (isActive) {
            if (isActive) {
                toggleSwitch.classList.add("active");
            } else {
                toggleSwitch.classList.remove("active");
            }
            localStorage.setItem(id, isActive);
            callback(isActive);
        };
    
        container.appendChild(label);
        container.appendChild(toggleSwitch);
 
        container.toggleSwitch = toggleSwitch;
    
        return container;
    }
 

// Camera Menu #######################


    function createCameraMenu() {
        const existingMenu = document.querySelector('.ft-camera-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const navButtons = document.querySelector('.item-nav-buttons_item-nav-buttons__wQ6LE');
        if (!navButtons) {
            return false;
        }

        const parentContainer = navButtons.parentElement;
        if (!parentContainer) {
            return false;
        }

        const menu = document.createElement('div');
        menu.className = 'ft-camera-menu';
        
        const title = document.createElement('div');
        title.className = 'ft-camera-menu-title';
        title.innerHTML = `
            <span>Cameras</span>
            <i class="fas fa-video" style="color: #f8ec94;"></i>
        `;
        
        const content = document.createElement('div');
        content.className = 'ft-camera-menu-content';
        let camerasFound = 0;
        for (let i = 1; i <= 13; i++) {
            const buttonId = `camera-${i}-4`;
            const originalButton = document.getElementById(buttonId);
            
            if (originalButton) {
                camerasFound++;
                const menuButton = originalButton.cloneNode(true);
                menuButton.className = 'ft-camera-button';
                menuButton.id = `menu-${buttonId}`;
                
                const thumbnailContainer = menuButton.querySelector('.live-stream_inner__n9syF');
                if (thumbnailContainer) {
                    thumbnailContainer.remove();
                }
                
                const thumbnailImage = menuButton.querySelector('.live-stream_thumbnail__RN6pc');
                if (thumbnailImage) {
                    thumbnailImage.remove();
                }
                
                menuButton.addEventListener('click', function(e) {
                    e.preventDefault();

                    const closeButton = document.querySelector('.live-stream-player_close__c_GRv');
                    if (closeButton) {
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true
                        });

                        closeButton.dispatchEvent(clickEvent);

                        setTimeout(() => {
                            const targetCam = document.getElementById(buttonId);
                            if (targetCam) {
                                targetCam.click();
                            }
                        }, 60);
                    } else {
                        const targetCam = document.getElementById(buttonId);
                        if (targetCam) {
                            targetCam.click();
                        }
                    }
                });
                
                content.appendChild(menuButton);
            }
        }

        if (camerasFound === 0) {
            return false;
        }

        let isExpanded = true;
        title.addEventListener('click', () => {
            isExpanded = !isExpanded;
            content.style.display = isExpanded ? 'grid' : 'none';
        });

        menu.appendChild(title);
        menu.appendChild(content);

        navButtons.insertAdjacentElement('afterend', menu);
        
        const style = document.createElement('style');
        style.textContent = `
            .ft-camera-button {
                padding: 0px !important;
                min-height: auto !important;
            }
            .ft-camera-menu-content {
                gap: 5px !important;
            }
        `;
        document.head.appendChild(style);
        
        return true;
    }

    function initializeCameraMenu() {
        if (!createCameraMenu()) {
            const observer = new MutationObserver((mutations) => {
                const navButtons = document.querySelector('.item-nav-buttons_item-nav-buttons__wQ6LE');
                const hasCameras = document.getElementById('camera-1-4');
                
                if (navButtons && hasCameras) {
                    createCameraMenu();
                    observer.disconnect();
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            const retryInterval = setInterval(() => {
                if (createCameraMenu()) {
                    clearInterval(retryInterval);
                }
            }, 1000);

            setTimeout(() => {
                clearInterval(retryInterval);
                observer.disconnect();
            }, 60000);
        }
    }

    function setupCameraUpdates() {
        const updateViewerCounts = () => {
            for (let i = 1; i <= 13; i++) {
                const buttonId = `camera-${i}-4`;
                const originalButton = document.getElementById(buttonId);
                const menuButton = document.getElementById(`menu-${buttonId}`);
                
                if (originalButton && menuButton) {
                    const originalViewers = originalButton.querySelector('.live-stream_viewers__UeUvp');
                    const menuViewers = menuButton.querySelector('.live-stream_viewers__UeUvp');

                    const originalName = originalButton.querySelector('.live-stream_name__ngU04');
                    const menuName = menuButton.querySelector('.live-stream_name__ngU04');
                    
                    if (originalViewers && menuViewers) {
                        if (originalViewers.textContent !== menuViewers.textContent) {
                            menuViewers.textContent = originalViewers.textContent;
                        }
                    }
                    
                    if (originalName && menuName && originalName.textContent !== menuName.textContent) {
                        menuName.textContent = originalName.textContent;
                    }
                }
            }
        };

        const viewerInterval = setInterval(updateViewerCounts, 30);

        const checkMenu = setInterval(() => {
            if (!document.querySelector('.ft-camera-menu')) {
                clearInterval(viewerInterval);
                clearInterval(checkMenu);
            }
        }, 1000);

        const observer = new MutationObserver((mutations) => {
            if (!document.querySelector('.live-stream-player_close__c_GRv')) {
                setTimeout(() => {
                    updateViewerCounts();
                }, 40);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    initializeCameraMenu();
    setupCameraUpdates();

    function updateTokenDisplay() {
        try {
            const token = sessionStorage.getItem('fishtank-token');
            keyBindings.tokenDisplay = token || 'No token found';
            
            const display = document.getElementById('token-display');
            if (display) {
                display.textContent = keyBindings.tokenDisplay;
                display.style.color = token ? '#f8ec94' : '#aaa';
            }
        } catch (e) {
            console.error('Token update failed:', e);
        }
    }

    function initTokenSystem() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTokenSystem);
            return;
        }
        
        updateTokenDisplay();
        
        setInterval(updateTokenDisplay, 1000);

        console.log('Token system initialized');
    }

    initTokenSystem();
 
})();

// Keybind Settings #######################

(function() {
    'use strict';
 
    const cameraNames = [
        "Director Mode", "Bedroom 1", "Bedroom 2", "Bedroom 3", "Bedroom 4", "Hallway Upstairs", "Hallway Downstairs", "Living Room", "Living Room PTZ", "Kitchen", "Laundry Room", "Garage", "Confessional"
    ];
 
    function showModal() {
        let existingModal = document.getElementById('keybindModal');
        if (existingModal) {
            existingModal.remove();
        }
    
        let modal = document.createElement('div');
        modal.id = 'keybindModal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#191d21';
        modal.style.padding = '0px';
        modal.style.zIndex = '1000';
        modal.style.width = '700px';
        modal.style.border = '3px solid #505050';
        modal.style.boxShadow = 'rgb(0 0 0 / 85%) 15px 15px 20px';
        modal.style.display = 'grid';
        modal.style.gridTemplateColumns = 'repeat(2, 1fr)';
        modal.style.gap = '5px';
        modal.style.maxHeight = '80vh';
        modal.style.overflowY = 'auto';
        
        let style = document.createElement('style');
        style.innerHTML = `
            .closer {
                background-color: rgba(25, 29, 33, 1);
                border: 1px solid #505050;
                border-radius: 0;
                cursor: pointer;
                transition: color 0.3s, outline 0.3s;
                box-sizing: border-box;
            }
        
            .closer:hover {
                outline: 2px solid #f8ec94;
                color: #f8ec94;
            }
        `;
        document.head.appendChild(style);
        
        let modalContent = '<h2 style="color:#fff;grid-column: span 2;margin-bottom:10px;background-color:#740700;padding:10px;">Keybind Settings</h2>';
        cameraNames.forEach((name, index) => {
            modalContent += `<div style="display: flex; align-items: center; justify-content: space-between; grid-column: span 1; font-size: 10px;margin-left:50px;">
            <span>${name}</span>
            <div style="display: flex; margin-left: auto; margin-right: 50px;">
                <button id="camera${index + 1}" class="closer" data-camera-id="list-cam-${index + 1}" style="max-width: 100px; padding: 10px; font-size:11px; text-transform: uppercase;">${localStorage.getItem('camera' + (index + 1)) || 'Set Keybind'}</button>
                <button id="clearCamera${index + 1}" class="closer" style="max-width: 75px; padding: 10px; font-size:10px; text-transform: uppercase;">Clear</button>
            </div>
         </div>`;
        });
 
        modalContent += `
            <div style="display: flex; align-items: center; justify-content: space-between; grid-column: span 1; font-size: 10px;margin-left:50px;">
                <span>Close Button</span>
                <div style="display: flex; margin-left: auto; margin-right: 50px;">
                    <button id="setCloseKeybind" class="closer" style="max-width: 100px; padding: 10px; font-size:11px; text-transform: uppercase;">${localStorage.getItem('closeKeybind') || 'Set Keybind'}</button>
                    <button id="clearCloseKeybind" class="closer" style="max-width: 75px; padding: 10px; font-size:10px; text-transform: uppercase;">Clear</button>
                </div>
            </div>
        `;
    
        modalContent += '<button id="saveKeybinds" class="closer" style="grid-column: span 2; padding: 10px; margin: 15px 10px 10px 10px">Save</button></div>';
        modal.innerHTML = modalContent;
    
        document.body.appendChild(modal);
    
        cameraNames.forEach((name, index) => {
            document.getElementById('camera' + (index + 1)).addEventListener('click', () => waitForKeybind(index + 1));
            document.getElementById('clearCamera' + (index + 1)).addEventListener('click', () => {
                localStorage.removeItem('camera' + (index + 1));
                document.getElementById('camera' + (index + 1)).textContent = 'Set Keybind';
            });
        });
 
        document.getElementById('setCloseKeybind').addEventListener('click', () => {
            waitForCustomKeybind('closeKeybind', 'setCloseKeybind');
        });
    
        document.getElementById('clearCloseKeybind').addEventListener('click', () => {
            localStorage.removeItem('closeKeybind');
            document.getElementById('setCloseKeybind').textContent = 'Set Keybind';
        });
    
        document.getElementById('saveKeybinds').addEventListener('click', saveKeybinds);
    }
    
    function waitForKeybind(cameraIndex) {
        let button = document.getElementById('camera' + cameraIndex);
        button.textContent = 'Waiting...';
        button.disabled = true;
    
        function keyHandler(event) {
            if (event.key === 'Shift' || event.key === 'Control' || event.key === 'Alt') {
                return;
            }
    
            let keybind = '';
            if (event.ctrlKey) keybind += 'Ctrl+';
            if (event.altKey) keybind += 'Alt+';
            if (event.shiftKey) keybind += 'Shift+';
    
            if (event.code.startsWith('Numpad')) {
                keybind += event.code;
            } else {
                keybind += event.key;
            }
    
            localStorage.setItem('camera' + cameraIndex, keybind);
            button.textContent = keybind;
            button.disabled = false;
            document.removeEventListener('keydown', keyHandler);
        }
    
        document.addEventListener('keydown', keyHandler);
    }
 
    function waitForCustomKeybind(storageKey, buttonId) {
        const button = document.getElementById(buttonId);
        button.textContent = 'Waiting...';
        button.disabled = true;
    
        function keyHandler(event) {
            if (event.key === 'Shift' || event.key === 'Control' || event.key === 'Alt') {
                return;
            }
    
            let keybind = '';
            if (event.ctrlKey) keybind += 'Ctrl+';
            if (event.altKey) keybind += 'Alt+';
            if (event.shiftKey) keybind += 'Shift+';
    
            if (event.code.startsWith('Numpad')) {
                keybind += event.code;
            } else {
                keybind += event.key;
            }
    
            localStorage.setItem(storageKey, keybind);
            button.textContent = keybind;
            button.disabled = false;
            document.removeEventListener('keydown', keyHandler);
        }
    
        document.addEventListener('keydown', keyHandler);
    }
    
    
    function saveKeybinds() {
        cameraNames.forEach((name, index) => {
            let keybind = document.getElementById('camera' + (index + 1)).textContent;
            localStorage.setItem('camera' + (index + 1), keybind);
        });
        document.getElementById('keybindModal').remove();
    }
 
    function handleKeypress(event) {
        const chatInput = document.querySelector('.chat-input_chat-input__GAgOF');
        const textInputs = document.querySelectorAll('.input_input__Zwrui input[type="text"]');
        
        if (chatInput && chatInput.contains(document.activeElement)) {
            return;
        }
    
        for (let input of textInputs) {
            if (input === document.activeElement) {
                return;
            }
        }
    
        const cameraIds = [
            "camera-13-4", "camera-1-4", "camera-2-4", "camera-3-4", "camera-4-4", "camera-5-4", "camera-6-4", "camera-7-4", "camera-8-4", "camera-9-4", "camera-10-4", "camera-11-4", "camera-12-4"
        ];
    
        cameraNames.forEach((name, index) => {
            let keybind = localStorage.getItem('camera' + (index + 1));
            if (keybind) {
                let pressedKey = '';
                if (event.ctrlKey) pressedKey += 'Ctrl+';
                if (event.altKey) pressedKey += 'Alt+';
                if (event.shiftKey) pressedKey += 'Shift+';

                if (event.code.startsWith('Numpad')) {
                    pressedKey += event.code;
                } else {
                    pressedKey += event.key;
                }

                if (pressedKey === keybind) {
                    const closeButton = document.querySelector('.live-stream-player_close__c_GRv');
                    if (closeButton) {
                        closeButton.click();

                        setTimeout(() => {
                            const targetCam = document.getElementById(cameraIds[index]);
                            if (targetCam) {
                                targetCam.click();
                            }
                        }, 50);
                    } else {
                        const targetCam = document.getElementById(cameraIds[index]);
                        if (targetCam) {
                            targetCam.click();
                        }
                    }
                }
            }
        });
 
        const closeKeybind = localStorage.getItem('closeKeybind');
        if (closeKeybind) {
            let pressedKey = '';
            if (event.ctrlKey) pressedKey += 'Ctrl+';
            if (event.altKey) pressedKey += 'Alt+';
            if (event.shiftKey) pressedKey += 'Shift+';
    
            if (event.code.startsWith('Numpad')) {
                pressedKey += event.code;
            } else {
                pressedKey += event.key;
            }
    
            if (pressedKey === closeKeybind) {
                const closeButton = document.querySelector('.live-stream-player_close__c_GRv');
                if (closeButton) {
                    closeButton.click();
                }
            }
        }
    }
 
 
function attachIcon() {
    const buttonsContainer = document.querySelector('.item-nav-buttons_item-nav-buttons__wQ6LE');
    if (!buttonsContainer) {
        console.log('Buttons container not found');
        return;
    }

    if (!document.getElementById('camera-keybind-button')) {
        const cameraButton = document.createElement('button');
        cameraButton.id = 'camera-keybind-button';
        cameraButton.className = 'cam_key';
        cameraButton.style.backgroundColor = 'rgba(176, 173, 0, 0.31)';
        cameraButton.style.borderColor = 'rgba(157, 159, 0, 0.90)';
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon_icon__bDzMA';
        
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-camera-retro';
        icon.setAttribute('aria-hidden', 'true');
        icon.style.color = 'rgba(250, 250, 0, 1)';
        
        iconDiv.appendChild(icon);
        cameraButton.appendChild(iconDiv);
        cameraButton.addEventListener('click', showModal);

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-new';
        tooltip.innerText = 'Keybind Settings';
        tooltip.setAttribute('data-placement', 'top');
        document.body.appendChild(tooltip);

        cameraButton.addEventListener('mouseenter', () => {
            cameraButton.style.backgroundColor = 'rgba(176, 173, 0, 0.51)';
            cameraButton.style.borderColor = 'rgba(250, 250, 0, 1)';

            Popper.createPopper(cameraButton, tooltip, {
                placement: 'top',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 1],
                        },
                    },
                ],
            });
            tooltip.style.opacity = '1';
        });
        
        cameraButton.addEventListener('mouseleave', () => {
            cameraButton.style.backgroundColor = 'rgba(176, 173, 0, 0.31)';
            cameraButton.style.borderColor = 'rgba(157, 159, 0, 0.90)';
            tooltip.style.opacity = '0';
        });

        buttonsContainer.appendChild(cameraButton);
    }
}
 
const observer = new MutationObserver(() => {
    const buttonsContainer = document.querySelector('.item-nav-buttons_item-nav-buttons__wQ6LE');
    if (buttonsContainer) {
        attachIcon();
        observer.disconnect();
    }
});

observer.observe(document, {
    childList: true,
    subtree: true
});
 
    document.addEventListener('keydown', handleKeypress);
})();


// CHAT SETTINGS ##########

(() => {
    "use strict";
 
    setTimeout(() => {
        const savedSettings = JSON.parse(localStorage.getItem('chatSettings')) || {};
        applyChatSettings(savedSettings);
    }, 3000);
 
    const popperScript = document.createElement('script');
    popperScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.9.2/umd/popper.min.js';
    document.head.appendChild(popperScript);
 
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.0/css/all.min.css';
    document.head.appendChild(link);
 
    const colorisLink = document.createElement('link');
    colorisLink.rel = 'stylesheet';
    colorisLink.href = 'https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.css';
    document.head.appendChild(colorisLink);
 
    const colorisScript = document.createElement('script');
    colorisScript.src = 'https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js';
    document.head.appendChild(colorisScript);
 
    colorisScript.onload = () => {
        Coloris({
            el: '.pola',
            theme: 'pill',
            themeMode: 'dark',
            format: 'hex',
            formatToggle: true,
            closeButton: true,
            alpha: true,
            swatches: [
                '#ffcbcb',
                '#872323',
                '#458d7e',
                '#cccccc',
                '#000000',
                '#f30d00',
                '#ed736b',
                '#632f2c',
                '#7bf7ea',
                '#45b194',
                '#205347'
              ]
        });
        Coloris.setInstance('.fishyc', {
            theme: 'pill',
            themeMode: 'dark',
            format: 'hex',
            formatToggle: true,
            closeButton: true,
            alpha: true,
            swatches: [
                '#00000030',
                '#ffffff30'
              ]
        });
    };
    
 
    const style = document.createElement('style');
    style.innerHTML = `
    .toggle-switch {
        width: 80px;
        height: 20px;
        background-color: #191d21;
        border: 2px solid #505050;
        border-radius: 1px;
        position: relative;
        cursor: pointer;
        transition: background-color 0.3s, box-shadow 0.3s;
        box-shadow: inset 0 0 5px #000, outset 0 0 5px #000;
    }
    .toggle-switch.active {
        background-color: #330000;
    }
    .toggle-handle {
        width: 20px;
        height: 30px;
        background-color: #2b2b2b;
        border-radius: 0px;
        position: absolute;
        border: 1px solid #740700;
        top: 50%;
        left: 5px;
        transform: translateY(-50%);
        transition: left 0.3s, background-color 0.3s, box-shadow 0.3s;
        box-shadow: 0 0 5px #000;
    }
    .toggle-switch.active .toggle-handle {
        left: 53px;
        background-color: #a70a00;
        box-shadow: 0 0 15px #ff4444, 0 0 30px #ff0000;
    }
    .toggle-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding: 10px;
    }
 
    .toggle-row label {
        flex: 1;
        margin-right: 10px;
    }
    .closer {
        background-color: rgba(25, 29, 33, 1);
        border: 1px solid #505050;
        border-radius: 0;
        cursor: pointer;
        transition: color 0.3s, outline 0.3s;
        box-sizing: border-box;
        padding: 10px;
    }
    .closer:hover {
        outline: 2px solid #f8ec94;
        color: #f8ec94;
    }
    .centerx {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .dropc {
        background-color: #191d21;
        border: 2px solid #505050;
        border-radius: 0;
        color: #f30e00;
        padding: 10px;
        font-size: 11px;
        cursor: pointer;
        transition: background-color 0.3s, box-shadow 0.3s;
        box-shadow: inset 0 0 5px #000;
    }
 
    .dropc:focus {
        outline: none;
        box-shadow: 0 0 5px #f8ec94;
    }
 
    .optc {
        background-color: #191d21;
        color: #f30e00;
        font-size: 11px;
    }
    .tooltip {
        position: absolute;
        background-color: #333;
        color: white;
        padding: 5px 10px;
        border: 1px solid #f8ec94;
        font-size: 11px;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        pointer-events: none;
        z-index: 1200;
    }
 
    .tooltip[data-placement="right"] {
        transform: translate(10px, -50%);
        left: 10%;
        top: 10%;
    }
    .tooltip-icon {
        cursor: pointer;
        position: relative;
    }
 
    .tooltip-icon:hover .tooltip {
        opacity: 1;
    }
    .modal-backdrop-chat {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }
    .clr-picker.clr-pill {
        z-index: 9999 !important;
    }
    `;
    document.head.appendChild(style);
 
    function setHomeRightZIndex(isModalOpen) {
        const homeRightElement = document.querySelector('.home_right__j_b3u');
        if (homeRightElement) {
            if (isModalOpen) {
                homeRightElement.style.zIndex = '1000';
            } else {
                homeRightElement.style.zIndex = '1';
            }
        }
    }
 
        function openChatSettingsModal() {
            if (document.querySelector('.chat-settings-modal')) {
                return;
            }
 
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop-chat';
 
            const modal = document.createElement('div');
            modal.className = 'chat-settings-modal';
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.width = '850px';
            modal.style.border = '3px solid #505050';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = '#191d21';
            modal.style.padding = '0px';
            modal.style.boxShadow = 'rgb(0 0 0 / 85%) 15px 15px 20px';
            modal.style.zIndex = '1000';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2 style="color:#fff;background-color:#740700;padding-left:8px;padding-top:8px;padding-bottom:8px;">Chat Settings</h2>
                    <div class="toggle-switches" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; color:#fff; padding: 10px; font-size: 11px;">
                        <div class="toggle-row">
                            <label>Hide Inventory Messages:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides users use of inventory items."></i></label>
                            <div class="toggle-switch" id="toggle-happening"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Hide Emote Messages:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides emotes in chat (stuff like /caaw)."></i></label>
                            <div class="toggle-switch" id="toggle-emote"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Hide Clan Messages:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides clan messages in chat (stuff like alliances)."></i></label>
                            <div class="toggle-switch" id="toggle-clanm"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Hide Timestamps:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides chat timestamps."></i></label>
                            <div class="toggle-switch" id="toggle-timestamp"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Hide System Messages:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides system messages in chat (stuff like Joined Global or item generations)."></i></label>
                            <div class="toggle-switch" id="toggle-system"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Hide TTS:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides TTS messages in chat."></i></label>
                            <div class="toggle-switch" id="toggle-tts"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Hide SFX:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides SFX messages in chat."></i></label>
                            <div class="toggle-switch" id="toggle-sfx"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Hide Stox (NEW):<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides Stox messages in chat."></i></label>
                            <div class="toggle-switch" id="toggle-Cstox"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Remove Chat Spacing:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Removes the large spaces between chat messages."></i></label>
                            <div class="toggle-switch" id="toggle-space"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Thin TTS:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Makes the TTS messages in chat a bit thinner."></i></label>
                            <div class="toggle-switch" id="toggle-thin"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Thin SFX:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Makes the SFX messages in chat a bit thinner."></i></label>
                            <div class="toggle-switch" id="toggle-thinsf"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Hide Avatars:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Hides users avatars."></i></label>
                            <div class="toggle-switch" id="toggle-avatar"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Small Clan Tag:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Displays just the first letter of the clan name."></i></label>
                            <div class="toggle-switch" id="toggle-clan-tag"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Bold Chat:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Makes chat bold."></i></label>
                            <div class="toggle-switch" id="toggle-bold"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Remove Chat Text Shadow:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Removes the show from the username and message in chat. Especially useful if you use darker custom colors in chat. REQUIRES REFRESH TO BRING SHADOW BACK IF YOU UNTOGGLE."></i></label>
                            <div class="toggle-switch" id="toggle-shadow"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Normalize Chat:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Makes the yellow/bold messages look like the rest of chat."></i></label>
                            <div class="toggle-switch" id="toggle-normal"></div>
                        </div>
                        <div class="centerx" style="grid-column: span 3; font-size:16px;">
                            <label>Chat Color Options:<i style="margin-left:5px; margin-bottom:20px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="If you change colors then want to revert the changes, you must refresh."></i></label>
                        </div>
                        <div class="toggle-row">
                            <label>Username Color:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Changes the colors of usernames in chat."></i></label>
                            <input class="pola" type="text" id="username-color-picker" style="margin-right:10px; width:50px; cursor: pointer;" data-coloris>
                            <div class="toggle-switch" id="toggle-username-color"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Background Color:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Changes the background color of chat."></i></label>
                            <input class="pola" type="text" id="background-color-picker" style="margin-right:10px; width:50px; cursor: pointer;" data-coloris>
                            <div class="toggle-switch" id="toggle-background-color"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Chat Font Color:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Changes the color of the font of chat messages."></i></label>
                            <input class="pola" type="text" id="message-color-picker" style="margin-right:10px; width:50px; cursor: pointer;" data-coloris>
                            <div class="toggle-switch" id="toggle-message-color"></div>
                        </div>
                        <div class="toggle-row">
                            <label>TTS/SFX Body Color:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Changes the color of the body of TTS/SFX messages. The actual area that contains the message itself is unchanged."></i></label>
                            <input class="pola" type="text" id="ttssfx-color-picker" style="margin-right:10px; width:50px; cursor: pointer;" data-coloris>
                            <div class="toggle-switch" id="toggle-tts-color"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Fish Message Background Color:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Changes the background color of chat messages from fish."></i></label>
                            <input class="fishyc" type="text" id="fish-color-picker" style="margin-right:10px; width:50px; cursor: pointer;" data-coloris>
                            <div class="toggle-switch" id="toggle-fish-color"></div>
                        </div>
                        <div class="toggle-row">
                            <label>Mention Background Color:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Highlights or changes the background color of chat messages mentioning you."></i></label>
                            <input class="fishyc" type="text" id="mention-color-picker" style="margin-right:10px; width:50px; cursor: pointer;" data-coloris>
                            <div class="toggle-switch" id="toggle-mention-color"></div>
                        </div>
                    </div>
                    <div class="dropdowns centerx" style="padding:10px;">
                        <label style="color:"#fff;">Chat Font Size:<i style="margin-left:5px;" class="fa-solid fa-circle-info tooltip-icon" data-placement="right" data-title="Must click save settings to see effect."></i>
                            <select class="dropc" id="font-size-dropdown">
                                ${Array.from({ length: 9 }, (_, i) => `<option class="optc" value="${i + 9}">${i + 9}</option>`).join('')}
                            </select>
                        </label>
                    </div>
                    <div class="centerx" style="padding:10px;">
                        <button class="closer" id="save-settings">Save Settings</button>
                    </div>
                </div>
            `;
 
            document.body.appendChild(backdrop);
            document.body.appendChild(modal);
 
            setHomeRightZIndex(true);
 
            setInterval(() => {
                document.querySelectorAll('.tooltip-icon').forEach(icon => {
                    if (!icon.hasAttribute('data-tooltip-initialized')) {
                        const tooltip = document.createElement('div');
                        tooltip.className = 'tooltip';
                        tooltip.innerText = icon.getAttribute('data-title');
                        document.body.appendChild(tooltip);
 
                        icon.addEventListener('mouseenter', () => {
                            Popper.createPopper(icon, tooltip, {
                                placement: icon.getAttribute('data-placement') || 'right',
                                modifiers: [
                                    {
                                        name: 'offset',
                                        options: {
                                            offset: [0, 10],
                                        },
                                    },
                                ],
                            });
                            tooltip.style.opacity = '1';
                        });
 
                        icon.addEventListener('mouseleave', () => {
                            tooltip.style.opacity = '0';
                        });
 
                        icon.setAttribute('data-tooltip-initialized', 'true');
                    }
                });
            }, 100);
 
 
 
 
            const settings = JSON.parse(localStorage.getItem('chatSettings')) || {};
 
            initializeToggleSwitch(document.getElementById('toggle-happening'), settings.hideHappening || false);
            initializeToggleSwitch(document.getElementById('toggle-emote'), settings.hideEmote || false);
            initializeToggleSwitch(document.getElementById('toggle-clanm'), settings.hideClanm || false);
            initializeToggleSwitch(document.getElementById('toggle-timestamp'), settings.hideTimestamp || false);
            initializeToggleSwitch(document.getElementById('toggle-system'), settings.hideSystem || false);
            initializeToggleSwitch(document.getElementById('toggle-tts'), settings.hideTtsm || false);
            initializeToggleSwitch(document.getElementById('toggle-sfx'), settings.hideSfxm || false);
            initializeToggleSwitch(document.getElementById('toggle-Cstox'), settings.hideCstox || false);
            initializeToggleSwitch(document.getElementById('toggle-space'), settings.hideSpace || false);
            initializeToggleSwitch(document.getElementById('toggle-thin'), settings.hideThin || false);
            initializeToggleSwitch(document.getElementById('toggle-thinsf'), settings.hideThinsf || false);
            initializeToggleSwitch(document.getElementById('toggle-avatar'), settings.hideAvatar || false);
            initializeToggleSwitch(document.getElementById('toggle-clan-tag'), settings.smallClanTag || false);
            initializeToggleSwitch(document.getElementById('toggle-bold'), settings.boldChat || false);
            initializeToggleSwitch(document.getElementById('toggle-shadow'), settings.hideShadow || false);
            initializeToggleSwitch(document.getElementById('toggle-normal'), settings.normalChat || false);
            initializeToggleSwitch(document.getElementById('toggle-username-color'), settings.usernameColor || false);
            initializeToggleSwitch(document.getElementById('toggle-background-color'), settings.cbackgroundColor || false);
            initializeToggleSwitch(document.getElementById('toggle-message-color'), settings.cmessageColor || false);
            initializeToggleSwitch(document.getElementById('toggle-tts-color'), settings.ttsmColor || false);
            initializeToggleSwitch(document.getElementById('toggle-fish-color'), settings.fishColor || false);
            initializeToggleSwitch(document.getElementById('toggle-mention-color'), settings.mentionColor || false);
 
            const fontSizeDropdown = document.getElementById('font-size-dropdown');
            fontSizeDropdown.value = settings.fontSize || '12';
 
 
 
 
            document.getElementById('save-settings').addEventListener('click', () => {
                const newSettings = {
                    hideHappening: document.getElementById('toggle-happening').classList.contains('active'),
                    hideEmote: document.getElementById('toggle-emote').classList.contains('active'),
                    hideClanm: document.getElementById('toggle-clanm').classList.contains('active'),
                    hideTimestamp: document.getElementById('toggle-timestamp').classList.contains('active'),
                    hideSystem: document.getElementById('toggle-system').classList.contains('active'),
                    hideTtsm: document.getElementById('toggle-tts').classList.contains('active'),
                    hideSfxm: document.getElementById('toggle-sfx').classList.contains('active'),
                    hideCstox: document.getElementById('toggle-Cstox').classList.contains('active'),
                    hideSpace: document.getElementById('toggle-space').classList.contains('active'),
                    hideThin: document.getElementById('toggle-thin').classList.contains('active'),
                    hideThinsf: document.getElementById('toggle-thinsf').classList.contains('active'),
                    hideAvatar: document.getElementById('toggle-avatar').classList.contains('active'),
                    usernameColor: document.getElementById('toggle-username-color').classList.contains('active'),
                    cbackgroundColor: document.getElementById('toggle-background-color').classList.contains('active'),
                    cmessageColor: document.getElementById('toggle-message-color').classList.contains('active'),
                    ttsmColor: document.getElementById('toggle-tts-color').classList.contains('active'),
                    fishColor: document.getElementById('toggle-fish-color').classList.contains('active'),
                    mentionColor: document.getElementById('toggle-mention-color').classList.contains('active'),
                    smallClanTag: document.getElementById('toggle-clan-tag').classList.contains('active'),
                    boldChat: document.getElementById('toggle-bold').classList.contains('active'),
                    hideShadow: document.getElementById('toggle-shadow').classList.contains('active'),
                    normalChat: document.getElementById('toggle-normal').classList.contains('active'),
                    fontSize: fontSizeDropdown.value,
                    chosenColor: document.getElementById('username-color-picker').value,
                    bchosenColor: document.getElementById('background-color-picker').value,
                    mchosenColor: document.getElementById('message-color-picker').value,
                    tchosenColor: document.getElementById('ttssfx-color-picker').value,
                    fchosenColor: document.getElementById('fish-color-picker').value,
                    mmchosenColor: document.getElementById('mention-color-picker').value
                };
                localStorage.setItem('chatSettings', JSON.stringify(newSettings));
                applyChatSettings(newSettings);
                modal.remove();
                document.body.removeChild(backdrop);
                setHomeRightZIndex(false);
            });
 
            applyChatSettings(settings);
 
            backdrop.onclick = () => {
                document.body.removeChild(modal);
                document.body.removeChild(backdrop);
                setHomeRightZIndex(false);
            };
        
        }
 
        function initializeToggleSwitch(toggle, isActive) {
            toggle.className = 'toggle-switch';
            if (isActive) toggle.classList.add('active');
            toggle.innerHTML = '<div class="toggle-handle"></div>';
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
 
                const currentSettings = {
                    hideHappening: document.getElementById('toggle-happening').classList.contains('active'),
                    hideEmote: document.getElementById('toggle-emote').classList.contains('active'),
                    hideClanm: document.getElementById('toggle-clanm').classList.contains('active'),
                    hideTimestamp: document.getElementById('toggle-timestamp').classList.contains('active'),
                    hideSystem: document.getElementById('toggle-system').classList.contains('active'),
                    hideTtsm: document.getElementById('toggle-tts').classList.contains('active'),
                    hideSfxm: document.getElementById('toggle-sfx').classList.contains('active'),
                    hideCstox: document.getElementById('toggle-Cstox').classList.contains('active'),
                    hideSpace: document.getElementById('toggle-space').classList.contains('active'),
                    hideThin: document.getElementById('toggle-thin').classList.contains('active'),
                    hideThinsf: document.getElementById('toggle-thinsf').classList.contains('active'),
                    hideAvatar: document.getElementById('toggle-avatar').classList.contains('active'),
                    smallClanTag: document.getElementById('toggle-clan-tag').classList.contains('active'),
                    boldChat: document.getElementById('toggle-bold').classList.contains('active'),
                    hideShadow: document.getElementById('toggle-shadow').classList.contains('active'),
                    normalChat: document.getElementById('toggle-normal').classList.contains('active'),
                    usernameColor: document.getElementById('toggle-username-color').classList.contains('active'),
                    cbackgroundColor: document.getElementById('toggle-background-color').classList.contains('active'),
                    cmessageColor: document.getElementById('toggle-background-color').classList.contains('active'),
                    fishColor: document.getElementById('toggle-fish-color').classList.contains('active'),
                    ttsmColor: document.getElementById('toggle-tts-color').classList.contains('active'),
                    mentionColor: document.getElementById('toggle-mention-color').classList.contains('active'),
                    bchosenColor: document.getElementById('background-color-picker').value,
                    mchosenColor: document.getElementById('message-color-picker').value,
                    chosenColor: document.getElementById('username-color-picker').value,
                    tchosenColor: document.getElementById('ttssfx-color-picker').value,
                    fchosenColor: document.getElementById('fish-color-picker').value,
                    mmchosenColor: document.getElementById('mention-color-picker').value
                };
                applyChatSettings(currentSettings);
            });
        }
 
 
        function applyChatSettings(settings) {
            const style = document.createElement('style');
            style.innerHTML = `
                ${settings.hideHappening ? '.chat-message-happening_chat-message-happening__tYeDU { display: none !important; }' : '.chat-message-happening_chat-message-happening__tYeDU { display: flex !important; }'}
                ${settings.hideEmote ? '.chat-message-emote_chat-message-emote__NWoZG { display: none !important; }' : '.chat-message-emote_chat-message-emote__NWoZG { display: flex !important; }'}
                ${settings.hideEmote ? '.chat-message-clan_chat-message-clan__kS1Cp { display: none !important; }' : '.chat-message-clan_chat-message-clan__kS1Cp { display: flex !important; }'}
                ${settings.hideTtsm ? '.chat-message-tts_chat-message-tts__2Jlxi { display: none !important; }' : '.chat-message-tts_chat-message-tts__2Jlxi { display: flex !important; }'}
                ${settings.hideSfxm ? '.chat-message-sfx_chat-message-sfx__OGv6q { display: none !important; }' : '.chat-message-sfx_chat-message-sfx__OGv6q { display: flex !important; }'}
                ${settings.hideCstox ? '.chat-message-stocks_chat-message-stocks__8A6yA { display: none !important; }' : '.chat-message-stocks_chat-message-stocks__8A6yA { display: flex !important; }'}
                ${settings.hideTimestamp ? '.chat-message-default_timestamp__sGwZy { display: none !important; }' : '.chat-message-default_timestamp__sGwZy { display: flex !important; }'}
                ${settings.hideSystem ? '.chat-message-system_chat-message-system__qZ_cD { display: none !important; }' : '.chat-message-system_chat-message-system__qZ_cD { display: flex !important; }'}
                ${settings.hideSpace ? '.chat_messages__2IBEJ { gap: 0px !important; }' : '.chat_messages__2IBEJ { gap: 16px !important; }'}
                ${settings.hideThin ? '.chat-message-tts_chat-message-tts__2Jlxi { gap: 0px !important; padding: 0px 1px 1px 0px !important; } .chat-message-tts_icon__DWVlb { display: none !important; } .chat-message-tts_message__sWVCc { padding: 2px !important; } ' : '.chat-message-tts_chat-message-tts__2Jlxi { gap: 8px !important; padding:8px 8px 4px !important; } .chat-message-tts_icon__DWVlb { display: block !important; } .chat-message-tts_message__sWVCc { padding: 8px !important; }'}
                ${settings.hideThinsf ? '.chat-message-sfx_chat-message-sfx__OGv6q { gap: 0px !important; padding: 0px 1px 1px 0px !important; } .chat-message-sfx_icon__XcCvX { display: none !important; } .chat-message-sfx_message__d2Rei { padding: 2px !important; } ' : '.chat-message-sfx_chat-message-sfx__OGv6q { gap: 8px !important; padding:8px 8px 4px !important; } .chat-message-sfx_icon__XcCvX { display: block !important; } .chat-message-sfx_message__d2Rei { padding: 8px !important; }'}
                ${settings.hideAvatar ? '.chat-message-default_avatar__eVmdi { display: none !important; }' : '.chat-message-default_avatar__eVmdi { display: flex !important; }'}
                ${settings.usernameColor ? `.chat-message-default_user__uVNvH { color: ${settings.chosenColor} !important; }` : `.chat-message-default_user__uVNvH { color: unset ; }`}
                ${settings.cbackgroundColor ? `.chat-messages_chat-messages__UeL0a { background-color: ${settings.bchosenColor} !important; }` : `.chat-messages_chat-messages__UeL0a { background-color: unset ; }`}  
                ${settings.cmessageColor ? `.chat-message-default_message__milmT { color: ${settings.mchosenColor} !important; }` : `.chat-message-default_message__milmT { color: unset ; }`} 
                ${settings.ttsmColor ? `.chat-message-tts_chat-message-tts__2Jlxi, .chat-message-sfx_chat-message-sfx__OGv6q { background-color: ${settings.tchosenColor} !important; }` : `.chat-message-tts_chat-message-tts__2Jlxi, .chat-message-sfx_chat-message-sfx__OGv6q { background-color: unset ; }`} 
                ${settings.fishColor ? `.chat-message-default_body__iFlH4:has(.chat-message-default_fish__9hxl_) { color: ${settings.fchosenColor} !important; }` : `.chat-message-default_message__milmT { color: unset ; }`}
                ${settings.boldChat ? `.chat-message-default_message__milmT { font-weight: 900 !important; }` : `.chat-message-default_message__milmT { font-weight: 200 !important; }`}
                ${settings.hideShadow ? ` .chat-message-default_user__uVNvH, .chat-message-default_message__milmT, .chat-message-default_epic__h5F2K, .chat-message-default_grand__Jf2Eh { text-shadow: none !important; }` : `.chat-message-default_user__uVNvH, .chat-message-default_message__milmT, .chat-message-default_epic__h5F2K, .chat-message-default_grand__Jf2Eh { text-shadow: unset; } `} 
                ${settings.normalChat ? `.chat-message-default_epic__h5F2K, .chat-message-default_grand__Jf2Eh { color: unset; font-weight: unset; }` : ``} 
                ${settings.smallClanTag ? `
                    .chat-message-default_clan__t_Ggo {
                        display: inline-block !important;
                        margin-right: 5px !important;
                        overflow: hidden !important;
                        padding: 0 1px !important;
                        white-space: nowrap !important;
                        width: 1.2ch !important;
                    }
                ` : '.chat-message-default_clan__t_Ggo { width: auto !important; }'}
                .chat-message-default_chat-message-default__JtJQL,
                .chat-message-clip_chat-input-clip__5dj9t,
                .chat-message-item_chat-message-item__CM8RR,
                .chat-message-tts_title__vqGKb,
                .chat-message-tts_info__Ud32g,
                .chat-message-tts_message__sWVCc,
                .chat_chat__2rdNg,
                .chat-message-tts_info__Ud32g,
                .chat-message-system_chat-message-system__qZ_cD,
                .chat-message-tts_title__vqGKb,
                .chat-message-tts_message__sWVCc,
                .chat-message-sfx_title__4tCur,
                .chat-message-sfx_info__JGYu4,
                chat-message-sfx_message__d2Rei,
                .chat-message-default_user__uVNvH,
                .chat-message-default_clan__t_Ggo {
                    font-size: ${settings.fontSize}px !important;
                }
            `;
            document.head.appendChild(style);
 
            if (settings.usernameColor) {
                const colorPicker = document.getElementById('username-color-picker');
                colorPicker.value = settings.chosenColor || '#000000';
            
                const userColorStyle = document.createElement('style');
                userColorStyle.innerHTML = `.chat-message-default_user__uVNvH { color: ${settings.chosenColor || '#000000'} !important; }`;
                document.head.appendChild(userColorStyle);
 
                colorPicker.style.backgroundColor = settings.chosenColor || '#000000';
                colorPicker.style.setProperty('color', settings.chosenColor || '#000000', 'important');
            
                colorPicker.addEventListener('input', (event) => {
                    const color = event.target.value;
                    userColorStyle.innerHTML = `.chat-message-default_user__uVNvH { color: ${color} !important; }`;
                    colorPicker.style.backgroundColor = color;
                    colorPicker.style.setProperty('color', color, 'important');
                });
            }
            
            if (settings.cbackgroundColor) {
                const bcolorPicker = document.getElementById('background-color-picker');
                bcolorPicker.value = settings.bchosenColor || '#000000'; 
            
                const userbColorStyle = document.createElement('style');
                userbColorStyle.innerHTML = `.chat_messages__2IBEJ { background-color: ${settings.bchosenColor || '#000000'} !important; }`;
                document.head.appendChild(userbColorStyle);
 
                bcolorPicker.style.backgroundColor = settings.bchosenColor || '#000000';
                bcolorPicker.style.setProperty('color', settings.bchosenColor || '#000000', 'important');
            
                bcolorPicker.addEventListener('input', (event) => {
                    const color = event.target.value;
                    userbColorStyle.innerHTML = `.chat_messages__2IBEJ { background-color: ${color} !important; }`;
                    bcolorPicker.style.backgroundColor = color;
                    bcolorPicker.style.setProperty('color', color, 'important'); 
                });
            }
            
            if (settings.cmessageColor) {
                const mcolorPicker = document.getElementById('message-color-picker');
                mcolorPicker.value = settings.mchosenColor || '#000000'; 
            
                const usermColorStyle = document.createElement('style');
                usermColorStyle.innerHTML = `.chat-message-default_message__milmT { color: ${settings.mchosenColor || '#000000'} !important; }`;
                document.head.appendChild(usermColorStyle);
 
                mcolorPicker.style.backgroundColor = settings.mchosenColor || '#000000';
                mcolorPicker.style.setProperty('color', settings.mchosenColor || '#000000', 'important');
            
                mcolorPicker.addEventListener('input', (event) => {
                    const color = event.target.value;
                    usermColorStyle.innerHTML = `.chat-message-default_message__milmT { color: ${color} !important; }`;
                    mcolorPicker.style.backgroundColor = color;
                    mcolorPicker.style.setProperty('color', color, 'important');
                });
            }
        
            if (settings.ttsmColor) {
                const tcolorPicker = document.getElementById('ttssfx-color-picker');
                tcolorPicker.value = settings.tchosenColor || '#000000'; 
            
                const usertColorStyle = document.createElement('style');
                usertColorStyle.innerHTML = `.chat-message-tts_chat-message-tts__2Jlxi, .chat-message-sfx_chat-message-sfx__OGv6q { background-color: ${settings.tchosenColor || '#000000'} !important; }`;
                document.head.appendChild(usertColorStyle);
 
                tcolorPicker.style.backgroundColor = settings.tchosenColor || '#000000';
                tcolorPicker.style.setProperty('color', settings.tchosenColor || '#000000', 'important');
            
                tcolorPicker.addEventListener('input', (event) => {
                    const color = event.target.value;
                    usertColorStyle.innerHTML = `.chat-message-tts_chat-message-tts__2Jlxi, .chat-message-sfx_chat-message-sfx__OGv6q { background-color: ${color} !important; }`;
                    tcolorPicker.style.backgroundColor = color;
                    tcolorPicker.style.setProperty('color', color, 'important');
                });
            }
 
            if (settings.fishColor) {
                const fColorPicker = document.getElementById('fish-color-picker');
                fColorPicker.value = settings.fchosenColor || '#000000';
            
                fColorPicker.style.backgroundColor = settings.fchosenColor || '#000000';
                fColorPicker.style.setProperty('color', settings.fchosenColor || '#000000', 'important');
            
                fColorPicker.addEventListener('input', (event) => {
                    const color = event.target.value;
                    settings.fchosenColor = color;
                    localStorage.setItem('chatSettings', JSON.stringify(settings));
                    applyFishMessageColor(color);
                    fColorPicker.style.backgroundColor = color;
                    fColorPicker.style.setProperty('color', color, 'important');
                });
            
                applyFishMessageColor(settings.fchosenColor);
            }
 
            if (settings.mentionColor) {
                const mentionPicker = document.getElementById('mention-color-picker');
                mentionPicker.value = settings.mmchosenColor  || '#000000';
        
                mentionPicker.style.backgroundColor = settings.mmchosenColor || '#000000';
                mentionPicker.style.setProperty('color', settings.mmchosenColor || '#000000', 'important');
        
                mentionPicker.addEventListener('input', event => {
                    const color = event.target.value;
                    settings.mmchosenColor = color;
                    localStorage.setItem('chatSettings', JSON.stringify(settings));
                    mentionPicker.style.backgroundColor = color;
                    mentionPicker.style.setProperty('color', color, 'important');
                    applyMentionBackgroundColor(color);
                });
            }
        
            applyMentionBackgroundColor(settings.mmchosenColor || '');
            
        }
 
        let cachedUsername = null;
 
        function getCurrentUsername() {
            if (cachedUsername) return cachedUsername;
        
            const usernameElement = document.querySelector('.top-bar-user_display-name__bzlpw');
            if (usernameElement) {
                cachedUsername = usernameElement.textContent.trim().toLowerCase();
                return cachedUsername;
            }
            return null;
        }
        
        function applyMentionBackgroundColor(color) {
            const username = getCurrentUsername();
            if (!username) {
                return;
            }
        
            const chatMessages = document.querySelectorAll('.chat-message-default_chat-message-default__JtJQL.chat-message-default_mentioned__EDIeq');
            chatMessages.forEach(message => {
                const mentionSpan = message.querySelector('.chat-message-default_mention__Ieq18');
                if (mentionSpan) {
                    const mentionText = mentionSpan.textContent.trim().toLowerCase();
                    if (mentionText === `@${username.toLowerCase()}`) {
                        message.style.setProperty('background-color', color, 'important');
                    } else {
                        message.style.removeProperty('background-color');
                    }
                }
            });
        }
 
        window.addEventListener('load', () => {
            setTimeout(() => {
                getCurrentUsername();
            }, 500);
        });
 
        function initializeMentionObserver() {
            const chatContainer = document.querySelector('.chat_messages__2IBEJ');
        
            if (chatContainer) {
                const observer = new MutationObserver(() => {
                    const settings = JSON.parse(localStorage.getItem('chatSettings')) || {};
                    if (settings.mmchosenColor) {
                        applyMentionBackgroundColor(settings.mmchosenColor);
                    }
                });
                observer.observe(chatContainer, { childList: true, subtree: true });
            } else {
                setTimeout(initializeMentionObserver, 500);
            }
        }
 
        function applyFishMessageColor(color) {
            const messageBodies = document.querySelectorAll('.chat-message-default_body__iFlH4');
            
            messageBodies.forEach(body => {
                const hasFishClass = body.querySelector('.chat-message-default_fish__9hxl_');
                if (hasFishClass) {
                    body.style.backgroundColor = color;
                } else {
                    body.style.backgroundColor = '';
                }
            });
        }
 
        function initializeChatObserver() {
            const chatMessagesContainer = document.querySelector('.chat_messages__2IBEJ');
        
            if (chatMessagesContainer) {
                const chatObserver = new MutationObserver(() => {
                    const currentSettings = JSON.parse(localStorage.getItem('chatSettings')) || {};
                    if (currentSettings.fchosenColor) {
                        applyFishMessageColor(currentSettings.fchosenColor);
                    }
                });
        
                const observerConfig = {
                    childList: true,
                    subtree: true,
                };
        
                chatObserver.observe(chatMessagesContainer, observerConfig);
 
                const reconnectObserver = () => {
                    if (!chatObserver.takeRecords().length) {
                        chatObserver.disconnect();
                        chatObserver.observe(chatMessagesContainer, observerConfig);
                    }
                };
        
                setInterval(reconnectObserver, 1000);
        
            } else {
                setTimeout(initializeChatObserver, 500);
            }
        }
        
        initializeMentionObserver();
        initializeChatObserver();
 
        function attachSettingsIcon() {
            const chatHeader = document.querySelector('.chat_header__8kNPS');
            const chatTitle = chatHeader?.querySelector('.chat_title__CrfQP');
            const chatPresence = chatHeader?.querySelector('.chat_presence__90XuO');
 
            if (chatHeader && chatTitle && chatPresence) {
                    const settingsCog = document.createElement('i');
                    settingsCog.id = 'settings-gear';
                    settingsCog.className = 'fa-solid fa-gear';
                    settingsCog.style.color = 'white';
                    settingsCog.style.cursor = 'pointer';
                    settingsCog.style.marginLeft = '10px';
                    chatHeader.insertBefore(settingsCog, chatPresence);
 
                    settingsCog.addEventListener('click', () => {
                        openChatSettingsModal();
                    });
 
            }
        }
 
 
        const observer = new MutationObserver(() => {
            const chatHeader = document.querySelector('.chat_header__8kNPS');
            if (chatHeader) {
                attachSettingsIcon();
                observer.disconnect();
            }
        });
 
        observer.observe(document, {
            childList: true,
            subtree: true
        });
})();

// AUDIO CONTROLS

(() => {
    "use strict";

    const ftAudio_defaultSettings = {
        enabled: false,
        highPassFreq: 80,
        presenceFreq: 1500,
        presenceGain: 2,
        presenceQ: 0.8,
        compressorThreshold: -12,
        compressorRatio: 8,
        compressorAttack: 1,
        compressorRelease: 250,
        compressorKnee: 4,
        limiterThreshold: -20,
        limiterRatio: 20,
        limiterAttack: 1,
        limiterRelease: 200,
        masterGain: 1.0
    };

    let ftAudio_currentSettings = {...ftAudio_defaultSettings};
    let ftAudio_currentPlayer = null;
    let ftAudio_system = null;

    function ftAudio_loadSettings() {
        const savedSettings = localStorage.getItem('ftAudioSettings');
        if (savedSettings) {
            try {
                ftAudio_currentSettings = {...ftAudio_defaultSettings, ...JSON.parse(savedSettings)};
            } catch (e) {
                console.error('Failed to parse saved audio settings', e);
            }
        }
    }

    function ftAudio_saveSettings() {
        localStorage.setItem('ftAudioSettings', JSON.stringify(ftAudio_currentSettings));
    }

    const ftAudio_styles = `
        #ft-audio-controls-btn {
            background-color: #3142d285;
            border-color: #5167fcf0;
        }
        #ft-audio-controls-btn:hover {
            background-color: #3142d2cf;
            border-color: #517dfcf0;
        }
        #ft-audio-controls-panel {
            position: fixed;
            width: 500px;
            background: rgba(25, 29, 33, 0.98);
            border-radius: 4px;
            padding: 0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            z-index: 9999;
            display: none;
            color: white;
            font-family: Arial, sans-serif;
            border: 1px solid #505050;
        }
        .ft-audio-control-group {
            margin-bottom: 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding: 10px;
        }
        .ft-audio-control-group h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #f8ec94;
            background: rgba(116, 7, 0, 1);
            padding: 4px 8px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ft-control-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            align-items: center;
            padding: 3px;
        }
        .ft-control-row:hover {
            background-color: hsla(0, 0%, 100%, .1);
            color: #f8ec94;
        }
        .ft-control-row label {
            font-size: 12px;
            flex: 1;
        }
        .ft-control-row input {
            width: 70px;
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #505050;
            background: rgba(0,0,0,0.5);
            color: white;
        }
        #ft-audio-toggle-btn {
            width: 100%;
            padding: 8px;
            margin: 0;
            background: rgba(116, 7, 0, 1);
            color: white;
            border: none;
            border-radius: 0;
            cursor: pointer;
            font-weight: bold;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
        }
        #ft-audio-toggle-btn:hover {
            background-color: #a70a00;
        }
        #ft-audio-toggle-btn.disabled {
            background: #303438;
        }
        #ft-audio-reset-btn {
            width: 100%;
            padding: 8px;
            margin: 0;
            background: transparent;
            color: #f8ec94;
            border: none;
            border-radius: 0;
            cursor: pointer;
            border-top: 1px solid #505050;
            border-bottom: 1px solid #505050;
        }
        #ft-audio-reset-btn:hover {
            background-color: hsla(0, 0%, 100%, .1);
        }
        .ft-audio-header {
            font-weight: bold;
            padding: 4px 8px;
            background: rgba(116, 7, 0, 1);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }
        .ft-audio-close-btn {
            position: absolute;
            right: 5px;
            background: transparent;
            border: none;
            color: #f8ec94;
            cursor: pointer;
            font-size: 16px;
            padding: 2px 5px;
            border-radius: 3px;
        }
        .ft-audio-close-btn:hover {
            color: white;
            background-color: rgba(255, 0, 0, 0.3);
        }
        .ft-audio-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            padding: 10px;
        }
        .ft-audio-column {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `;

    const ftAudio_controlBtn = document.createElement('button');
    ftAudio_controlBtn.className = 'ft-audio-controls-btn';
    ftAudio_controlBtn.id = 'ft-audio-controls-btn';

    const ftAudio_iconDiv = document.createElement('div');
    ftAudio_iconDiv.className = 'icon_icon__bDzMA';

    const ftAudio_icon = document.createElement('i');
    ftAudio_icon.className = 'fa-solid fa-volume-low';
    ftAudio_icon.setAttribute('aria-hidden', 'true');
    ftAudio_icon.style.color = '#7070eb';

    ftAudio_iconDiv.appendChild(ftAudio_icon);
    ftAudio_controlBtn.appendChild(ftAudio_iconDiv);

    const ftAudio_tooltip = document.createElement('div');
    ftAudio_tooltip.className = 'tooltip-new';
    ftAudio_tooltip.innerText = 'Audio Controls';
    ftAudio_tooltip.setAttribute('data-placement', 'top');
    ftAudio_controlBtn.appendChild(ftAudio_tooltip);

    ftAudio_controlBtn.addEventListener('mouseenter', () => {
        Popper.createPopper(ftAudio_controlBtn, ftAudio_tooltip, {
            placement: 'top',
            modifiers: [{
                name: 'offset',
                options: {
                    offset: [0, 1],
                },
            }],
        });
        ftAudio_tooltip.style.opacity = '1';
    });

    ftAudio_controlBtn.addEventListener('mouseleave', () => {
        ftAudio_tooltip.style.opacity = '0';
    });

    const ftAudio_controlPanel = document.createElement('div');
    ftAudio_controlPanel.id = 'ft-audio-controls-panel';
    ftAudio_controlPanel.style.display = 'none';

    ftAudio_controlPanel.innerHTML = `
    <div class="ft-audio-header">
        <span>Audio Controls</span>
        <button class="ft-audio-close-btn" title="Close">×</button>
    </div>
    <div class="ft-audio-columns">
        <div class="ft-audio-column">
            <div class="ft-audio-control-group">
                <h3>Highpass Filter</h3>
                <div class="ft-control-row">
                    <label for="ft-highPassFreq">Frequency (Hz):</label>
                    <input type="number" id="ft-highPassFreq" value="${ftAudio_defaultSettings.highPassFreq}" min="20" max="200">
                </div>
            </div>
            <div class="ft-audio-control-group">
                <h3>Presence Boost</h3>
                <div class="ft-control-row">
                    <label for="ft-presenceFreq">Frequency (Hz):</label>
                    <input type="number" id="ft-presenceFreq" value="${ftAudio_defaultSettings.presenceFreq}" min="500" max="5000">
                </div>
                <div class="ft-control-row">
                    <label for="ft-presenceGain">Gain (dB):</label>
                    <input type="number" id="ft-presenceGain" value="${ftAudio_defaultSettings.presenceGain}" min="0" max="10" step="0.1">
                </div>
                <div class="ft-control-row">
                    <label for="ft-presenceQ">Q Factor:</label>
                    <input type="number" id="ft-presenceQ" value="${ftAudio_defaultSettings.presenceQ}" min="0.1" max="5" step="0.1">
                </div>
            </div>
        </div>
        <div class="ft-audio-column">
            <div class="ft-audio-control-group">
                <h3>Compressor</h3>
                <div class="ft-control-row">
                    <label for="ft-compressorThreshold">Threshold (dB):</label>
                    <input type="number" id="ft-compressorThreshold" value="${ftAudio_defaultSettings.compressorThreshold}" min="-50" max="0">
                </div>
                <div class="ft-control-row">
                    <label for="ft-compressorRatio">Ratio:</label>
                    <input type="number" id="ft-compressorRatio" value="${ftAudio_defaultSettings.compressorRatio}" min="1" max="20">
                </div>
                <div class="ft-control-row">
                    <label for="ft-compressorAttack">Attack (ms):</label>
                    <input type="number" id="ft-compressorAttack" value="${ftAudio_defaultSettings.compressorAttack}" min="0.1" max="100" step="0.1">
                </div>
                <div class="ft-control-row">
                    <label for="ft-compressorRelease">Release (ms):</label>
                    <input type="number" id="ft-compressorRelease" value="${ftAudio_defaultSettings.compressorRelease}" min="1" max="1000">
                </div>
                <div class="ft-control-row">
                    <label for="ft-compressorKnee">Knee (dB):</label>
                    <input type="number" id="ft-compressorKnee" value="${ftAudio_defaultSettings.compressorKnee}" min="0" max="40">
                </div>
            </div>
        </div>
    </div>
    <div class="ft-audio-control-group">
        <h3>Limiter</h3>
        <div class="ft-control-row">
            <label for="ft-limiterThreshold">Threshold (dB):</label>
            <input type="number" id="ft-limiterThreshold" value="${ftAudio_defaultSettings.limiterThreshold}" min="-60" max="0">
        </div>
        <div class="ft-control-row">
            <label for="ft-limiterRatio">Ratio:</label>
            <input type="number" id="ft-limiterRatio" value="${ftAudio_defaultSettings.limiterRatio}" min="1" max="50">
        </div>
        <div class="ft-control-row">
            <label for="ft-limiterAttack">Attack (ms):</label>
            <input type="number" id="ft-limiterAttack" value="${ftAudio_defaultSettings.limiterAttack}" min="0.1" max="100" step="0.1">
        </div>
        <div class="ft-control-row">
            <label for="ft-limiterRelease">Release (ms):</label>
            <input type="number" id="ft-limiterRelease" value="${ftAudio_defaultSettings.limiterRelease}" min="1" max="1000">
        </div>
    </div>
    <div class="ft-audio-control-group">
        <h3>Master</h3>
        <div class="ft-control-row">
            <label for="ft-masterGain">Volume:</label>
            <input type="number" id="ft-masterGain" value="${ftAudio_defaultSettings.masterGain}" min="0.1" max="2" step="0.05">
        </div>
    </div>
    <button id="ft-audio-reset-btn">Reset to Defaults</button>
    <button id="ft-audio-toggle-btn">Enable Effects</button>
    `;

    function ftAudio_insertButton() {
        const navButtons = document.querySelector('.item-nav-buttons_item-nav-buttons__wQ6LE');
        const camKeyButton = document.querySelector('.cam_key');

        if (navButtons && camKeyButton && !document.getElementById('ft-audio-controls-btn')) {
            camKeyButton.parentNode.insertBefore(ftAudio_controlBtn, camKeyButton.nextSibling);
            document.body.appendChild(ftAudio_controlPanel);
            return true;
        }
        return false;
    }

    function ftAudio_setupAudio(video) {
        if (ftAudio_system) {
            ftAudio_system.cleanup();
        }

        ftAudio_currentPlayer = video;

        if (!window.AudioContext && !window.webkitAudioContext) {
            return;
        }

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();

        const source = audioContext.createMediaElementSource(video);
        const compressor = audioContext.createDynamicsCompressor();
        const limiter = audioContext.createDynamicsCompressor();
        const highPass = audioContext.createBiquadFilter();
        const presenceBoost = audioContext.createBiquadFilter();
        const gainNode = audioContext.createGain();
        const bypassGain = audioContext.createGain();
        bypassGain.gain.value = 1.0;

        const masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);

        function updateAudioNodes() {
            highPass.type = "highpass";
            highPass.frequency.value = ftAudio_currentSettings.highPassFreq;

            presenceBoost.type = "peaking";
            presenceBoost.frequency.value = ftAudio_currentSettings.presenceFreq;
            presenceBoost.gain.value = ftAudio_currentSettings.presenceGain;
            presenceBoost.Q.value = ftAudio_currentSettings.presenceQ;

            compressor.threshold.value = ftAudio_currentSettings.compressorThreshold;
            compressor.ratio.value = ftAudio_currentSettings.compressorRatio;
            compressor.attack.value = ftAudio_currentSettings.compressorAttack / 1000;
            compressor.release.value = ftAudio_currentSettings.compressorRelease / 1000;
            compressor.knee.value = ftAudio_currentSettings.compressorKnee;

            limiter.threshold.value = ftAudio_currentSettings.limiterThreshold;
            limiter.ratio.value = ftAudio_currentSettings.limiterRatio;
            limiter.attack.value = ftAudio_currentSettings.limiterAttack / 1000;
            limiter.release.value = ftAudio_currentSettings.limiterRelease / 1000;

            gainNode.gain.value = ftAudio_currentSettings.masterGain;
        }

        function setEffectsEnabled(enabled) {
            if (audioContext.state === 'closed') return;

            try {
                source.disconnect();
                gainNode.disconnect();
                bypassGain.disconnect();

                if (enabled) {
                    source.connect(highPass);
                    highPass.connect(presenceBoost);
                    presenceBoost.connect(compressor);
                    compressor.connect(limiter);
                    limiter.connect(gainNode);
                    gainNode.connect(masterGain);
                } else {
                    source.connect(bypassGain);
                    bypassGain.connect(masterGain);
                }
            } catch (e) {}
        }

        updateAudioNodes();
        setEffectsEnabled(ftAudio_currentSettings.enabled);

        video.addEventListener('play', () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        });

        ftAudio_system = {
            setEffectsEnabled: setEffectsEnabled,
            updateSettings: function(settings) {
                ftAudio_currentSettings = {...settings};
                updateAudioNodes();
                ftAudio_saveSettings();
            },
            cleanup: () => {
                try {
                    source.disconnect();
                    gainNode.disconnect();
                    bypassGain.disconnect();
                    if (audioContext.state !== 'closed') {
                        audioContext.close();
                    }
                } catch (e) {}
            }
        };
    }

    function ftAudio_checkForPlayer() {
        const player = document.getElementById('hls-stream-player');
        if (player && player !== ftAudio_currentPlayer) {
            ftAudio_setupAudio(player);
        }
        else if (!player && ftAudio_currentPlayer) {
            ftAudio_currentPlayer = null;
        }
    }

    function ftAudio_init() {
        ftAudio_loadSettings();
        
        const styleElement = document.querySelector('style') || document.createElement('style');
        styleElement.textContent += ftAudio_styles;
        document.head.appendChild(styleElement);

        if (!ftAudio_insertButton()) {
            const ftAudio_buttonObserver = new MutationObserver((mutations, observer) => {
                if (ftAudio_insertButton()) {
                    observer.disconnect();
                    ftAudio_setupEventListeners();
                }
            });
            
            ftAudio_buttonObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                if (ftAudio_insertButton()) {
                    ftAudio_buttonObserver.disconnect();
                    ftAudio_setupEventListeners();
                }
            }, 1000);
        } else {
            ftAudio_setupEventListeners();
        }

        setInterval(ftAudio_checkForPlayer, 1000);
        ftAudio_checkForPlayer();
    }

    function ftAudio_setupEventListeners() {
        ftAudio_controlBtn.addEventListener('click', () => {
            ftAudio_controlPanel.style.display = ftAudio_controlPanel.style.display === 'block' ? 'none' : 'block';
        });

        const toggleBtn = ftAudio_controlPanel.querySelector('#ft-audio-toggle-btn');
        toggleBtn.textContent = ftAudio_currentSettings.enabled ? 'Disable Effects' : 'Enable Effects';
        toggleBtn.classList.toggle('disabled', !ftAudio_currentSettings.enabled);

        toggleBtn.addEventListener('click', () => {
            ftAudio_currentSettings.enabled = !ftAudio_currentSettings.enabled;
            toggleBtn.textContent = ftAudio_currentSettings.enabled ? 'Disable Effects' : 'Enable Effects';
            toggleBtn.classList.toggle('disabled', !ftAudio_currentSettings.enabled);
            if (ftAudio_system) ftAudio_system.setEffectsEnabled(ftAudio_currentSettings.enabled);
            ftAudio_saveSettings();
        });

        const resetBtn = ftAudio_controlPanel.querySelector('#ft-audio-reset-btn');
        resetBtn.addEventListener('click', () => {
            ftAudio_currentSettings = {...ftAudio_defaultSettings};
            Object.keys(ftAudio_defaultSettings).forEach(key => {
                if (key !== 'enabled') {
                    const input = ftAudio_controlPanel.querySelector(`#ft-${key}`);
                    if (input) input.value = ftAudio_defaultSettings[key];
                }
            });
            toggleBtn.textContent = 'Enable Effects';
            toggleBtn.classList.add('disabled');
            if (ftAudio_system) ftAudio_system.updateSettings(ftAudio_currentSettings);
            ftAudio_saveSettings();
        });

        ftAudio_controlPanel.querySelectorAll('input').forEach(input => {
            const settingKey = input.id.replace('ft-', '');
            input.value = ftAudio_currentSettings[settingKey];

            input.addEventListener('input', () => {
                ftAudio_currentSettings[settingKey] = parseFloat(input.value);
                if (ftAudio_system) ftAudio_system.updateSettings(ftAudio_currentSettings);
            });
        });

        ftAudio_controlPanel.querySelector('.ft-audio-close-btn').addEventListener('click', () => {
            ftAudio_controlPanel.style.display = 'none';
        });
    }
    setTimeout(ftAudio_init, 1000);
})();