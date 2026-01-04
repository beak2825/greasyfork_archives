// ==UserScript==
// @name         Quora Unblur Images
// @namespace    quora-unblur-images
// @version      0.6.3
// @description  Unblur quora images and other utilities
// @author       PikaTer
// @match        https://*.quora.com/*
// @exclude      https://*.quora.com/google_/*
// @icon         https://raw.githubusercontent.com/PikaTer/quora-unblur-images/main/favicon.ico
// @license      MIT
// @resource     material_icons https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/471116/Quora%20Unblur%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/471116/Quora%20Unblur%20Images.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /// ---- FUNCTIONS ---- ///

    // Remove Image Blur
    function removeBlur() {
        const images = document.querySelectorAll('.q-box[style*="filter"], .unzoomed');

        images.forEach(image => {
            if (window.getComputedStyle(image).getPropertyValue('filter') != 'blur(0px)') {
                image.style.filter = 'none';
                image.classList.add('unblured');
            }
        });

        setSessionSetting('autoUnblur', true);
    }

    // Blur Images
    function addBlur() {
        const images = document.querySelectorAll('.unblured');

        images.forEach(image => {
            image.style.filter = 'blur(30px)';
            image.classList.remove('unblured');
        });

        setSessionSetting('autoUnblur', false);
    }

    // Expand Posts
    function expandPosts() {
        // TODO: Find a better way to form the selector
        [...document.querySelectorAll('.q-click-wrapper.qu-display--block.qu-tapHighlight--none.qu-cursor--pointer:not(.qu-color--gray,[role="listitem"],.expanded)')].map(post => {
            post.dispatchEvent(clickEvent);
            post.classList.add('expanded');
        });

        // Mobile version sometimes having to click multiple times to fully expand a post
        [...document.querySelectorAll('.puppeteer_test_read_more_button')].map(button => button.dispatchEvent(clickEvent))
    }

    // Observe the DOM for New Post Loaded
    // Credit: @vsync [https://stackoverflow.com/a/14570614]
    function observeDOM(targetNode) {
        const config = { childList: true, subtree: true };

        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    getSessionSetting('autoUnblur') && removeBlur();
                    getSessionSetting('autoExpand') && expandPosts();
                }
            }
        };

        if (MutationObserver) {
            const mutationObserver = new MutationObserver(callback);

            mutationObserver.observe(targetNode, config);
        }
        else if (window.addEventListener) {
            targetNode.addEventListener('DOMNodeInserted', callback, false);
            targetNode.addEventListener('DOMNodeRemoved', callback, false);
        }

        getSessionSetting('autoUnblur') && removeBlur();
        getSessionSetting('autoExpand') && expandPosts();
    }

    // Get The Content Node To Add It Into Observer Watch
    function getMainContentNode() {
        let targetNodes = [];

        targetNodes.push(document.getElementById('mainContent')); // Default
        targetNodes.push(document.querySelector('.dom_annotate_multifeed_tribe_top_items')); // Quora Spaces
        targetNodes.push(document.querySelector('.dom_annotate_multifeed_tribe_page')); // Quora Spaces
        targetNodes.push(document.querySelector('.puppeteer_test_question_main')); // Mobile
        targetNodes.push(document.querySelector('#root > div > div.q-box > div > div:nth-child(2) > div:nth-child(4) > div')); // Mobile Profile
        targetNodes.push(document.querySelector('.dom_annotate_multifeed_home')); // Mobile Homepage

        let retries = 0;
        let timeOut = 1000;

        let filteredNodes = targetNodes.filter(value => value !== null)

        if (filteredNodes.length > 0) {
            for (const node of filteredNodes) {
                observeDOM(node)
            }
        } else {
            retries++
            if (retries > 30) timeOut = 5000 // Reduce looping frequency after certain number of retries

            setTimeout(getMainContentNode, timeOut);
        }
    }

    // Initialize GUI (buttons) at bottom left of the page, to control settings
    function initGUI() {
        const material_icons = GM_getResourceText('material_icons')
        GM_addStyle(material_icons);

        // Add GUI Container
        const guiContainer = document.createElement('div');
        guiContainer.id = 'quora-unblur-images-gui-container';
        guiContainer.classList.add('qui-gui-container');

        // Buttons Object Configuration
        const buttonsConfig = {
            settingsButton: {
                id: 'quora-unblur-images-settings-button',
                title: 'User Settings',
                innerHTML: 'settings',
                classNames: ['qui-settings-btn', 'material-symbols-rounded'],
                elementType: 'button',
                hideWhenToggle: true,
                onClick: () => { toggleSettingsPanel(); },
            },
            unblurImageButton: {
                id: 'quora-unblur-images-unblur-image-button',
                title: 'Unblur Images',
                innerHTML: 'visibility',
                classNames: ['qui-unblur-image-btn', 'material-symbols-rounded'],
                elementType: 'button',
                hideWhenToggle: true,
                onClick: () => { removeBlur(); },
            },
            blurImageButton: {
                id: 'quora-unblur-images-blur-image-button',
                title: 'Re-blur Images',
                innerHTML: 'visibility_off',
                classNames: ['qui-blur-image-btn', 'material-symbols-rounded'],
                elementType: 'button',
                hideWhenToggle: true,
                onClick: () => { addBlur(); },
            },
            expandPostsButton: {
                id: 'quora-unblur-images-expand-posts-button',
                title: 'Expand Posts',
                innerHTML: 'unfold_more',
                classNames: ['qui-expand-posts-btn', 'material-symbols-rounded'],
                elementType: 'button',
                hideWhenToggle: true,
                onClick: () => { expandPosts(); },
            },
            expandGUIContainerButton: {
                id: 'quora-unblur-images-expand-gui-container-button',
                title: getGlobalSetting('hideGUIButtons') ? 'Expand GUI Container' : 'Collapse GUI Container',
                innerHTML: getGlobalSetting('hideGUIButtons') ? 'arrow_forward_ios' : 'arrow_back_ios',
                classNames: ['qui-expand-gui-container-btn', 'material-symbols-rounded'],
                elementType: 'span',
                hideWhenToggle: false,
                onClick: () => { toggleGUIContainerButtons(); },
            }
        }

        // Create Buttons
        for (const button in buttonsConfig) {
            // Create Button
            const buttonElement = document.createElement(buttonsConfig[button].elementType);

            // Set Button Attributes
            buttonElement.id = buttonsConfig[button].id;
            buttonElement.classList.add(...buttonsConfig[button].classNames);
            buttonElement.setAttribute('title', buttonsConfig[button].title);
            buttonElement.innerHTML = buttonsConfig[button].innerHTML;
            buttonElement.addEventListener('click', buttonsConfig[button].onClick);
            if (buttonsConfig[button].hideWhenToggle && getGlobalSetting('hideGUIButtons')) { buttonElement.style.display = 'none'; }

            // Append Button To GUI Container
            guiContainer.appendChild(buttonElement);
        }

        // Create Settings Panel
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'quora-unblur-images-settings-panel';
        settingsPanel.classList.add('qui-settings-panel');
        settingsPanel.style.display = 'none';

        // Settings Panel Title & Content
        const settingsPanelContent = `
            <h3 class="qui-settings-panel-title">
                User Settings
            </h3>
            <div class="qui-settings-panel-item-container">
                <span>Auto Unblur Images</span>
                <label for="quora-unblur-images-auto-unblur-checkbox" class="switch">
                    <input type="checkbox" id="quora-unblur-images-auto-unblur-checkbox" ${getGlobalSetting('autoUnblur') ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="qui-settings-panel-item-container">
                <span>Auto Expand Posts</span>
                <label for="quora-unblur-images-auto-expand-checkbox" class="switch">
                    <input type="checkbox" id="quora-unblur-images-auto-expand-checkbox" ${getGlobalSetting('autoExpand') ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
        `
        settingsPanel.innerHTML = settingsPanelContent;

        // Append Settings Panel To GUI Container
        guiContainer.appendChild(settingsPanel);

        // Append GUI Container To Body
        document.body.appendChild(guiContainer);

        // Add Event Listener To Checkboxes
        document.getElementById('quora-unblur-images-auto-unblur-checkbox').addEventListener('change', function () {
            setGlobalSetting('autoUnblur', this.checked);
        });
        document.getElementById('quora-unblur-images-auto-expand-checkbox').addEventListener('change', function () {
            setGlobalSetting('autoExpand', this.checked);
        });
    }

    // Toggle GUI Container Buttons
    function toggleGUIContainerButtons() {
        // Buttons Array To Toggle
        const buttons = [
            'quora-unblur-images-settings-button',
            'quora-unblur-images-unblur-image-button',
            'quora-unblur-images-blur-image-button',
            'quora-unblur-images-expand-posts-button'
        ];

        // Get Expand / Collapse Button
        const expandGUIContainerButton = document.getElementById('quora-unblur-images-expand-gui-container-button');

        // Expand GUI Container Buttons
        const hideGUIButtons = !getGlobalSetting('hideGUIButtons');

        const display = hideGUIButtons ? 'none' : 'inline-block';
        const innerHTML = hideGUIButtons ? 'arrow_forward_ios' : 'arrow_back_ios';
        const title = hideGUIButtons ? 'Expand GUI Container' : 'Collapse GUI Container';

        // Toggle Buttons
        buttons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            button.style.display = display;
        });

        // Toggle Expand GUI Container Button
        expandGUIContainerButton.innerHTML = innerHTML;
        expandGUIContainerButton.setAttribute('title', title);
        setGlobalSetting('hideGUIButtons', hideGUIButtons);

        // Hide Settings Panel
        if (hideGUIButtons) toggleSettingsPanel(false);
    }

    // Toggle Settings Panel
    function toggleSettingsPanel(show = null) {
        const settingsPanel = document.getElementById('quora-unblur-images-settings-panel');
        const settingsButton = document.getElementById('quora-unblur-images-settings-button');

        const showPanel = show ?? settingsPanel.style.display == 'none' ? true : false;

        showPanel ? settingsPanel.style.display = 'block' : settingsPanel.style.display = 'none';
        showPanel ? settingsButton.classList.add('qui-settings-btn-hover') : settingsButton.classList.remove('qui-settings-btn-hover');
    }

    // Get Global Setting
    function getGlobalSetting(settingName) {
        return GM_getValue(settingName, globalDefaults[settingName]);
    }

    // Set Global Setting
    function setGlobalSetting(settingName, settingValue) {
        GM_setValue(settingName, settingValue);
        // Update Session Setting
        setSessionSetting(settingName, settingValue);
    }

    // Get Session Setting
    function getSessionSetting(settingName) {
        switch (settingName) {
            case 'autoUnblur':
                // Do not auto unblur images if the global setting is false
                return getGlobalSetting('autoUnblur') ? sessionSettings[settingName] : false;
            default:
                return sessionSettings[settingName];
        }
    }

    // Set Session Setting
    function setSessionSetting(settingName, settingValue) {
        sessionSettings[settingName] = settingValue;
    }

    /// ---- GLOBAL VARIABLES ---- ///

    // Define Mouse Click Event
    const clickEvent = new MouseEvent("click", {
        "bubbles": true,
        "cancelable": false
    });

    // Define Global Defaluts
    const globalDefaults = {
        autoUnblur: true,
        autoExpand: false,
        hideGUIButtons: false,
    }

    // Define Session Settings
    const sessionSettings = {
        autoUnblur: getGlobalSetting('autoUnblur'),
        autoExpand: getGlobalSetting('autoExpand'),
    }

    /// ---- CSS ---- ///
    GM_addStyle(`
        .material-symbols-rounded {
            font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24
        }

        .qui-gui-container {
            position: fixed;
            bottom: 5px;
            z-index: 9999;
            padding: 10px;
            font-size: 14px;
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .qui-settings-btn, 
        .qui-unblur-image-btn, 
        .qui-blur-image-btn, 
        .qui-expand-posts-btn {
            background: #262626;
            color: #ccc;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 2px #ccc;
            padding: 5px;
            margin-right: 8px;
            cursor: pointer;
        }

        .qui-settings-btn {
            color: #F52936;
        }

        .qui-settings-btn:hover,
        .qui-unblur-image-btn:hover,
        .qui-blur-image-btn:hover,
        .qui-expand-posts-btn:hover {
            background: #333;
            color: #fff;
            border: 1px solid #fff;
            box-shadow: 0 0 5px #ccc;
        }

        .qui-settings-btn:hover,
        .qui-settings-btn-hover {
            color: #FACE2B;
        }

        .qui-expand-gui-container-btn {
            padding: 5px;
            cursor: pointer;
        }

        .qui-expand-gui-container-btn:hover {
            color: #F52936;
        }

        .qui-settings-panel {
            position: absolute;
            bottom: 55px;
            min-width: 200px;
            max-width: 300px;
            min-height: 50px;
            max-height: 200px;
            background: #262626;
            color: #ccc;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 2px #ccc;
            z-index: 9999;
        }

        .qui-settings-panel-title {
            padding: 5px;
            border-bottom: 1px solid #ccc;
        }

        .qui-settings-panel-item-container {
            padding: 8px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }

        .switch input {
            display: none;
        }

        .switch {
            display: inline-block;
            width: 30px; /*=w*/
            height: 15px; /*=h*/
            margin: 5px;
            position: relative;
        }

        .slider {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 15px;
            box-shadow: 0 0 0 2px #777, 0 0 4px #777;
            cursor: pointer;
            border: 4px solid transparent;
            overflow: hidden;
            transition: 0.2s;
        }

        .slider:before {
            position: absolute;
            content: "";
            width: 100%;
            height: 100%;
            background-color: #777;
            border-radius: 30px;
            transform: translateX(-15px); /*translateX(-(w-h))*/
            transition: 0.2s;
        }

        input:checked + .slider:before {
            transform: translateX(15px); /*translateX(w-h)*/
            background-color: #FACE2B;
        }

        input:checked + .slider {
            box-shadow: 0 0 0 2px #FACE2B, 0 0 8px #FACE2B;
        }

        .switch200 .slider:before {
            width: 200%;
            transform: translateX(-15px); /*translateX(-(w-h))*/
        }

        .switch200 input:checked + .slider:before {
            background-color: red;
        }

        .switch200 input:checked + .slider {
            box-shadow: 0 0 0 2px red, 0 0 8px red;
        }
    `)

    /// ---- LISTENERS ---- ///

    // Listener To Listen To Keypresses Events (Shortcuts to utilities)
    document.addEventListener("keydown", function (zEvent) {
        // Expand Posts
        if (zEvent.ctrlKey && zEvent.altKey && zEvent.key === "e") {
            expandPosts();
        }
        // Unblur Images
        if (zEvent.ctrlKey && zEvent.altKey && zEvent.key === "b") {
            removeBlur();
        }
        // Blur Images
        if (zEvent.ctrlKey && zEvent.altKey && zEvent.key === "r") {
            addBlur();
        }
    });

    // Hide Settings Panel
    document.addEventListener('click', function (event) {
        if (!event.target.closest('#quora-unblur-images-settings-panel') && !event.target.closest('#quora-unblur-images-settings-button')) {
            toggleSettingsPanel(false);
        }
    });

    /// ---- MAIN SCRIPT ---- ///

    // Try To Get Target Node Into Observer Watch
    initGUI();
    getMainContentNode();
})();
