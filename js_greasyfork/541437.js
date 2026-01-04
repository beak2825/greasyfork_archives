// ==UserScript==
// @name         Sinflix Modifier
// @namespace    hhttps://openuserjs.org/users/asurpbs
// @version      25.07.06
// @description  This script adds search icons and other features, letting you choose to open links in a popup or a new tab via the settings. Now with a back to top toggle and an inline search bar!
// @license      MIT
// @author       asurpbs
// @match        https://rentry.co/sin-flix
// @match        https://text.is/Sinflix
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @copyright    2025, asurpbs (https://openuserjs.org/users/asurpbs)
// @downloadURL https://update.greasyfork.org/scripts/541437/Sinflix%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/541437/Sinflix%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const config = {
        showGoogleCircle: GM_getValue('showGoogleCircle', true),
        showMdlCircle: GM_getValue('showMdlCircle', true),
        convertBuzzheavierLinks: GM_getValue('convertBuzzheavierLinks', true),
        showBackToTopButton: GM_getValue('showBackToTopButton', true),
        // NEW: Add setting for link opening style, defaulting to 'popup'
        linkOpenStyle: GM_getValue('linkOpenStyle', 'popup')
    };

    // --- Style Definitions ---
    GM_addStyle(`
        /* --- Settings Button --- */
        #kdrama-settings-button {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            z-index: 10001;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(6px);
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        .dark-mode #kdrama-settings-button {
            background: rgba(50, 50, 50, 0.4);
        }
        #kdrama-settings-button:hover {
            background: rgba(255, 255, 255, 0.35);
        }

        /* --- Modal Styles --- */
        #kdrama-settings-modal {
            display: none;
            position: fixed;
            z-index: 10002;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.4);
            justify-content: center;
            align-items: center;
            font-family: "Segoe UI", sans-serif;
        }
        .kdrama-modal-content {
            background-color: #fff;
            color: #111;
            padding: 30px;
            border-radius: 16px;
            width: 90%;
            max-width: 460px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            border: none;
            position: relative;
        }
        .dark-mode .kdrama-modal-content {
            background-color: #1e1e1e;
            color: #eee;
        }
        .kdrama-modal-content h2 {
            margin: 0 0 20px 0;
            font-size: 20px;
            font-weight: 600;
        }
        .kdrama-modal-content label {
            display: flex;
            align-items: center;
            font-size: 16px;
            padding: 10px 0;
            border-bottom: 1px solid #eaeaea;
        }
       .dark-mode .kdrama-modal-content label {
            border-bottom: 1px solid #333;
        }
       .kdrama-modal-content input[type="checkbox"] {
            width: 18px;
            height: 18px;
            margin-right: 10px;
            accent-color: #0078D4;
        }
        #kdrama-settings-close {
            position: absolute;
            right: 24px;
            top: 20px;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            color: #666;
        }
        .dark-mode #kdrama-settings-close {
            color: #aaa;
        }
        #kdrama-save-button {
            background: #0078D4;
            color: white;
            padding: 10px 20px;
            font-size: 15px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            margin-top: 20px;
            transition: background 0.3s;
        }
        #kdrama-save-button:hover {
            background: #005A9E;
        }

        /* NEW: Styles for the new radio button setting */
        .kdrama-setting-group {
            padding: 15px 0;
            border-bottom: 1px solid #eaeaea;
        }
        .dark-mode .kdrama-setting-group {
            border-bottom: 1px solid #333;
        }
        .kdrama-setting-group h4 {
            margin: 0 0 10px 0;
            font-size: 16px;
            font-weight: 600;
        }
        .kdrama-setting-group label {
            border-bottom: none; /* Remove double borders */
            padding: 5px 0;
        }
        .kdrama-setting-group input[type="radio"] {
            width: 18px;
            height: 18px;
            margin-right: 10px;
            accent-color: #0078D4;
        }

		.kdrama-circle {
			display: inline-block;
			width: 16px;
			height: 16px;
			border-radius: 50%;
			border: none;
			cursor: pointer;
			box-shadow: 0 0 6px rgba(0,0,0,0.2);
			vertical-align: middle;
			/* Make circles dimmed by default */
			opacity: 0.35;
			/* Add smooth transition for opacity */
			transition: transform 0.2s ease, opacity 0.2s ease;
			margin-right: 4px;
		}
		.kdrama-circle:hover {
			transform: scale(1.2);
			/* Make circles bright on hover */
			opacity: 1;
		}
        .google-circle {
            background: linear-gradient(90deg, #1A73E8 0%, #186F65 100%);
        }
        .mdl-circle {
            background: linear-gradient(90deg, #F0F2F5 0%, #E8EEF2 100%);
            border: 2px solid #5C88DA;
            box-shadow: 0 0 6px 2px rgba(75, 0, 130, 0.6);
        }
        .kdrama-circle-container {
            display: inline-flex;
            margin-right: 6px;
            vertical-align: middle;
        }

        /* --- Floating Buttons (Back to Top & Search) --- */
        .kdrama-float-button {
            position: fixed;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(30, 30, 30, 0.4);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10003;
            user-select: none;
            transition: background-color 0.3s ease, opacity 0.3s ease, border 0.3s ease;
            opacity: 0; /* Initially hidden, except for search button */
            pointer-events: none; /* Disable interaction when hidden */
        }
        .kdrama-float-button.show {
            opacity: 1;
            pointer-events: auto; /* Enable interaction when shown */
        }
        .kdrama-float-button:hover {
            background: rgba(50, 50, 50, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.35);
        }
        #kdrama-back-to-top {
            bottom: 30px;
            right: 20px;
        }
        #kdrama-search-button {
            bottom: 84px;
            right: 20px;
        }

        /* --- Search Modal --- */
        #kdrama-search-modal {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 10004;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 -4px 15px rgba(0,0,0,0.3);
            padding: 15px 20px;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease-in-out;
        }
        #kdrama-search-modal.show {
            opacity: 1;
            pointer-events: auto;
        }
        .kdrama-search-controls {
            position: relative;
            width: calc(100% - 60px);
            max-width: 500px;
            display: flex;
            align-items: center;
            background-color: transparent;
            border-radius: 8px;
        }
        .kdrama-search-input-wrapper {
            position: relative;
            flex-grow: 1;
            display: flex;
            align-items: center;
        }
        #kdrama-search-input {
            width: 100%;
            padding: 12px 15px 12px 40px;
            border: none;
            border-radius: 8px;
            background-color: #333;
            color: white;
            font-size: 16px;
            outline: none;
            box-sizing: border-box;
        }
        #kdrama-search-input:focus {
            outline: 1px solid #0078D4;
        }
        #kdrama-search-input::placeholder {
            color: #bbb;
        }
        .kdrama-search-icon {
            position: absolute;
            left: 12px;
            color: #bbb;
            font-size: 18px;
            pointer-events: none;
        }
        .kdrama-search-nav-buttons {
            display: flex;
            align-items: center;
            margin-left: 10px;
            gap: 5px;
        }
        .kdrama-search-nav-button {
            background: none;
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0.7;
            transition: background-color 0.2s, opacity 0.2s;
        }
        .kdrama-search-nav-button:hover:not(:disabled) {
            background-color: rgba(255, 255, 255, 0.1);
            opacity: 1;
        }
        .kdrama-search-nav-button:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
        #kdrama-search-close {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            margin-left: 15px;
            line-height: 1;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        #kdrama-search-close:hover {
            opacity: 1;
        }

        /* --- Highlight style --- */
        .kdrama-highlight {
            background-color: #FFEB3B;
            color: black;
            font-weight: bold;
            padding: 2px 0;
            border-radius: 2px;
        }
        .kdrama-highlight.current {
            background-color: #4CAF50;
            color: white;
            box-shadow: 0 0 8px rgba(76, 175, 80, 0.8);
        }
        code .kdrama-highlight {
            background-color: #383131;
            color: #e0aeb4;
        }
        code .kdrama-highlight.current {
            background-color: #6a5e5e;
            color: #e0aeb4;
        }
    `);

    // --- Enhanced Drama Detection Patterns ---
    const dramaPatterns = [
        // Pattern for lines with (reup) or (redo) prefix, broken by HTML tags.
        /^(?:\(reup\)|\(redo\))?\s*([^[]+?)\s*\[/,
        // NEW: Pattern for lines WITHOUT a prefix, broken by HTML tags.
        /^([a-zA-Z0-9][^[]*?)\s*\[/,
        /^(?:\(reup\)|\(redo\))?\s*([^[]+?)\s*\[.*?\]\s*\((?:e?\d+(?:\s+of\s+\d+)?|\d+)ep\)\s*-/i,
        /^(?:\(reup\)|\(redo\))?\s*([^[]+?(?:\s+S\d+)?)\s*\[.*?\]\s*\(\d+ep\)\s*-/i,
        /^(?:\(reup\)|\(redo\))?\s*([^[]+?)\s*\[.*?\]\s*\(e\d+\s+of\s+\d+\)\s*-/i,
        /^(?:\(reup\)|\(redo\))?\s*([^[]+?)\s*\[.*?\]\s*\(.*?ep.*?\)\s*-/i,
        /^(?:\(reup\)|\(redo\))?\s*([^[]+?)\s*\[.*?\]\s*\((?:e?\d+(?:\s+of\s+\d+)?|\d+)ep\)/i
    ];

    // --- Helper function to extract drama name ---
    function extractDramaName(text) {
        const cleanText = text.trim();
        if (cleanText.length < 10) return null;
        for (const pattern of dramaPatterns) {
            const match = cleanText.match(pattern);
            if (match && match[1]) {
                let dramaName = match[1].trim().replace(/:$/, '').trim().replace(/\s+/g, ' ');
                if (dramaName.length > 2 && dramaName.length < 200) return dramaName;
            }
        }
        return null;
    }

    // --- Helper function to open windows in the center of the screen ---
    function openInCenter(url, title) {
        const popWidth = 1000,
            popHeight = 700;
        const left = (window.screen.width / 2) - (popWidth / 2);
        const top = (window.screen.height / 2) - (popHeight / 2);
        const features = `width=${popWidth},height=${popHeight},top=${top},left=${left},resizable=yes,scrollbars=yes`;
        window.open(url, title, features);
    }

    // --- Main Processing Function ---
    function enhancePageContent() {
        const content = document.querySelector('.entry-text article');
        if (!content) {
            console.log('Sinflix Modifier: Content not found, retrying...');
            return false;
        }
        const currentVersion = 'v6.1.7_style_choice';
        if (content.dataset.enhancedv === currentVersion) {
            console.log(`Sinflix Modifier: Content already enhanced (${currentVersion}). Skipping.`);
            return true;
        }
        console.log(`Sinflix Modifier (${currentVersion}): Processing...`);
        content.dataset.enhancedv = currentVersion;

        const buzzRegex = /\b(?![a-zA-Z]{12}\b)([a-zA-Z0-9]{12})\b/g;

        if (config.showGoogleCircle || config.showMdlCircle) {
            document.querySelectorAll('.kdrama-circle-container').forEach(el => el.remove());
            const textNodes = [];
            const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
                acceptNode: n => (!n.parentNode.closest('a, .kdrama-highlight, .kdrama-search-icon, .kdrama-circle-container') && n.nodeValue.trim().length > 0) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
            });
            let node;
            while (node = walker.nextNode()) textNodes.push(node);

            textNodes.forEach(textNode => {
                let fullText = textNode.textContent.replace(/=\r?\n/g, '').replace(/=([0-9A-Fa-f]{2})/g, (m, p1) => {
                    try { return String.fromCharCode(parseInt(p1, 16)); } catch(e) { return m; }
                });
                const lines = fullText.split('\n');
                let fragment = document.createDocumentFragment();
                let lastOffset = 0;
                let processedAnyLine = false;

                lines.forEach(line => {
                    const dramaName = extractDramaName(line);
                    if (dramaName) {
                        const lineStartIndex = fullText.indexOf(line, lastOffset);
                        if (lineStartIndex > lastOffset) fragment.appendChild(document.createTextNode(fullText.substring(lastOffset, lineStartIndex)));

                        const container = document.createElement('span');
                        container.className = 'kdrama-circle-container';

                        if (config.showGoogleCircle) {
                            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(dramaName)}`;
                            const googleCircle = document.createElement('span');
                            googleCircle.className = 'kdrama-circle google-circle';
                            googleCircle.title = `Search '${dramaName}' on Google`;
                            googleCircle.onclick = (e) => {
                                e.stopPropagation();
                                //  USE SETTING: Check which style the user prefers
                                if (config.linkOpenStyle === 'popup') {
                                    openInCenter(googleUrl, 'sinflix_Google Search');
                                } else {
                                    window.open(googleUrl, '_blank');
                                }
                            };
                            container.appendChild(googleCircle);
                        }

                        if (config.showMdlCircle) {
                            const mdlUrl = `https://mydramalist.com/search?q=${encodeURIComponent(dramaName)}&adv=titles&ty=68&co=3&so=relevance`;
                            const mdlCircle = document.createElement('span');
                            mdlCircle.className = 'kdrama-circle mdl-circle';
                            mdlCircle.title = `Search '${dramaName}' on MyDramaList`;
                            mdlCircle.onclick = (e) => {
                                e.stopPropagation();
                                //  USE SETTING: Check which style the user prefers
                                if (config.linkOpenStyle === 'popup') {
                                    openInCenter(mdlUrl, 'sinflix_mdl_search');
                                } else {
                                    window.open(mdlUrl, '_blank');
                                }
                            };
                            container.appendChild(mdlCircle);
                        }
                        fragment.appendChild(container);
                        fragment.appendChild(document.createTextNode(line));
                        processedAnyLine = true;
                    } else {
                        const lineStartIndex = fullText.indexOf(line, lastOffset);
                        if (lineStartIndex > lastOffset) fragment.appendChild(document.createTextNode(fullText.substring(lastOffset, lineStartIndex)));
                        fragment.appendChild(document.createTextNode(line));
                    }
                    fragment.appendChild(document.createTextNode('\n'));
                    lastOffset = fullText.indexOf(line, lastOffset) + line.length + 1;
                });
                if (lastOffset < fullText.length) fragment.appendChild(document.createTextNode(fullText.substring(lastOffset)));
                if (processedAnyLine && textNode.parentNode) textNode.parentNode.replaceChild(fragment, textNode);
            });
        }

        if (config.convertBuzzheavierLinks) {
             const linkWalker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentNode.nodeName !== 'A' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
             const linkNodes = [];
             let n;
             while (n = linkWalker.nextNode()) {
                 buzzRegex.lastIndex = 0;
                 if (buzzRegex.test(n.textContent)) linkNodes.push(n);
             }
             linkNodes.forEach(node => {
                 if (!document.body.contains(node) || node.parentNode.nodeName === 'A') return;
                 const fragment = document.createDocumentFragment();
                 const text = node.textContent;
                 let lastIndex = 0;
                 buzzRegex.lastIndex = 0;
                 let match;
                 while ((match = buzzRegex.exec(text)) !== null) {
                     if (match.index > lastIndex) fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                     const link = document.createElement('a');
                     link.href = `https://buzzheavier.com/${match[1]}`;
                     link.textContent = link.href;
                     link.target = '_blank';
                     fragment.appendChild(link);
                     lastIndex = match.index + match[0].length;
                 }
                 if (lastIndex < text.length) fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
                 if (fragment.hasChildNodes() && node.parentNode) node.parentNode.replaceChild(fragment, node);
             });
        }

        console.log('Sinflix Modifier: Processing complete. ✨');
        return true;
    }

    // --- Settings UI ---
    function createSettingsUI() {
        const settingsButton = document.createElement('div');
        settingsButton.id = 'kdrama-settings-button';
        settingsButton.innerHTML = `<svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>`;
        document.body.appendChild(settingsButton);

        const modal = document.createElement('div');
        modal.id = 'kdrama-settings-modal';
        //  NEW: Added HTML for the new setting
        modal.innerHTML = `
            <div class="kdrama-modal-content">
                <span id="kdrama-settings-close">&times;</span>
                <h2>Sinflix Modifier Settings</h2>
                <div id="kdrama-settings-form">
                    <label>
                        <input type="checkbox" id="setting-google" ${config.showGoogleCircle ? 'checked' : ''}>
                        Show Google Search Icon
                    </label>
                    <label>
                        <input type="checkbox" id="setting-mdl" ${config.showMdlCircle ? 'checked' : ''}>
                        Show MyDramaList Search Icon
                    </label>
                    <label>
                        <input type="checkbox" id="setting-buzz" ${config.convertBuzzheavierLinks ? 'checked' : ''}>
                        Convert buzzheavier.com Links
                    </label>
                    <label>
                        <input type="checkbox" id="setting-back-to-top" ${config.showBackToTopButton ? 'checked' : ''}>
                        Show 'Back to Top' Button
                    </label>
                    <div class="kdrama-setting-group">
                        <h4>Link Opening Style (circles)</h4>
                        <label>
                            <input type="radio" name="linkStyle" value="popup">
                            Popup Window (centered)
                        </label>
                        <label>
                            <input type="radio" name="linkStyle" value="tab">
                            New Tab
                        </label>
                    </div>
                </div>
                <button id="kdrama-save-button">Save & Refresh</button>
            </div>
        `;
        document.body.appendChild(modal);

        //  NEW: Set the correct radio button based on saved config
        document.querySelector(`input[name="linkStyle"][value="${config.linkOpenStyle}"]`).checked = true;

        const saveButton = document.getElementById('kdrama-save-button');
        const closeBtn = document.getElementById('kdrama-settings-close');

        settingsButton.addEventListener('click', () => { modal.style.display = 'flex'; });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
        closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });

        saveButton.addEventListener('click', () => {
            // Save checkbox values
            GM_setValue('showGoogleCircle', document.getElementById('setting-google').checked);
            GM_setValue('showMdlCircle', document.getElementById('setting-mdl').checked);
            GM_setValue('convertBuzzheavierLinks', document.getElementById('setting-buzz').checked);
            GM_setValue('showBackToTopButton', document.getElementById('setting-back-to-top').checked);

            //  NEW: Save the selected radio button value
            const selectedStyle = document.querySelector('input[name="linkStyle"]:checked').value;
            GM_setValue('linkOpenStyle', selectedStyle);

            location.reload();
        });
    }

    // --- Floating Action Buttons (Back to Top & Search) ---
    let highlightedElements = [];
    let currentMatchIndex = -1;

    function createFloatingButtons() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'kdrama-back-to-top';
        backToTopBtn.className = 'kdrama-float-button';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.title = 'Back to top';
        backToTopBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: auto;"><polyline points="6 15 12 9 18 15"></polyline></svg>`;
        document.body.appendChild(backToTopBtn);

        const searchBtn = document.createElement('button');
        searchBtn.id = 'kdrama-search-button';
        searchBtn.className = 'kdrama-float-button show';
        searchBtn.setAttribute('aria-label', 'Search content');
        searchBtn.title = 'Search';
        searchBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
        document.body.appendChild(searchBtn);

        const searchModal = document.createElement('div');
        searchModal.id = 'kdrama-search-modal';
        searchModal.innerHTML = `
            <div class="kdrama-search-controls">
                <div class="kdrama-search-input-wrapper">
                    <span class="kdrama-search-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
                    <input type="text" id="kdrama-search-input" placeholder="Search current page...">
                </div>
                <div class="kdrama-search-nav-buttons">
                    <button id="kdrama-search-prev" class="kdrama-search-nav-button" title="Previous match" disabled><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
                    <button id="kdrama-search-next" class="kdrama-search-nav-button" title="Next match" disabled><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                </div>
            </div>
            <button id="kdrama-search-close">&times;</button>
        `;
        document.body.appendChild(searchModal);

        const searchInput = document.getElementById('kdrama-search-input');
        const searchCloseBtn = document.getElementById('kdrama-search-close');
        const searchPrevBtn = document.getElementById('kdrama-search-prev');
        const searchNextBtn = document.getElementById('kdrama-search-next');

        function updateButtonPositions() {
            if (config.showBackToTopButton) {
                searchBtn.style.bottom = '84px';
                backToTopBtn.classList.add('show');
            } else {
                searchBtn.style.bottom = '30px';
                backToTopBtn.classList.remove('show');
            }
        }
        updateButtonPositions();

        window.addEventListener('scroll', () => {
            const scrollThreshold = 200;
            if (window.scrollY > scrollThreshold) {
                if (config.showBackToTopButton) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        searchBtn.addEventListener('click', () => {
            searchModal.classList.add('show');
            searchInput.focus();
            performSearch();
        });

        searchCloseBtn.addEventListener('click', () => {
            searchModal.classList.remove('show');
            searchInput.value = '';
            clearSearchHighlight();
        });

        document.addEventListener('click', (e) => {
            if (searchModal.classList.contains('show') && !searchModal.contains(e.target) && e.target !== searchBtn && !searchBtn.contains(e.target)) {
                searchModal.classList.remove('show');
                searchInput.value = '';
                clearSearchHighlight();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal.classList.contains('show')) {
                searchModal.classList.remove('show');
                searchInput.value = '';
                clearSearchHighlight();
                e.preventDefault();
            }
            if (searchModal.classList.contains('show') && highlightedElements.length > 0) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    goToNextMatch();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    goToPreviousMatch();
                }
            }
        });

        function clearSearchHighlight() {
            highlightedElements.forEach(el => {
                if (el.parentNode && el.classList.contains('kdrama-highlight')) {
                    const parent = el.parentNode;
                    parent.replaceChild(document.createTextNode(el.textContent), el);
                    parent.normalize();
                }
            });
            highlightedElements = [];
            currentMatchIndex = -1;
            updateNavButtons();
        }

        function updateNavButtons() {
            const hasMatches = highlightedElements.length > 0;
            searchPrevBtn.disabled = !hasMatches || currentMatchIndex <= 0;
            searchNextBtn.disabled = !hasMatches || currentMatchIndex >= highlightedElements.length - 1;
        }

        function highlightCurrentMatch() {
            highlightedElements.forEach((el, index) => {
                el.classList.remove('current');
                if (index === currentMatchIndex) {
                    el.classList.add('current');
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }

        function goToNextMatch() {
            if (highlightedElements.length === 0) return;
            currentMatchIndex = (currentMatchIndex + 1) % highlightedElements.length;
            highlightCurrentMatch();
            updateNavButtons();
            searchInput.focus();
        }

        function goToPreviousMatch() {
            if (highlightedElements.length === 0) return;
            currentMatchIndex = (currentMatchIndex - 1 + highlightedElements.length) % highlightedElements.length;
            highlightCurrentMatch();
            updateNavButtons();
            searchInput.focus();
        }

        function performSearch() {
            const searchText = searchInput.value.trim();
            clearSearchHighlight();

            if (searchText.length > 0) {
                const mainContent = document.querySelector('.entry-text article');
                if (!mainContent) return;

                const walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, {
                    acceptNode: function(node) {
                        if (node.parentNode.closest('a, script, style, .kdrama-highlight, .kdrama-circle-container, .kdrama-search-icon')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }, false);

                const nodesToProcess = [];
                let node;
                while ((node = walker.nextNode())) {
                    nodesToProcess.push(node);
                }

                nodesToProcess.forEach(textNode => {
                    if (!textNode.parentNode || textNode.nodeType !== Node.TEXT_NODE) return;
                    const originalText = textNode.nodeValue;
                    if (!originalText) return;

                    const fragment = document.createDocumentFragment();
                    let lastIndex = 0;
                    const regex = new RegExp(searchText, 'gi');

                    let match;
                    let nodeModified = false;
                    while ((match = regex.exec(originalText)) !== null) {
                        nodeModified = true;
                        if (match.index > lastIndex) {
                            fragment.appendChild(document.createTextNode(originalText.substring(lastIndex, match.index)));
                        }
                        const highlightSpan = document.createElement('span');
                        highlightSpan.className = 'kdrama-highlight';
                        highlightSpan.textContent = match[0];
                        highlightedElements.push(highlightSpan);
                        fragment.appendChild(highlightSpan);
                        lastIndex = match.index + match[0].length;
                    }

                    if (lastIndex < originalText.length) {
                        fragment.appendChild(document.createTextNode(originalText.substring(lastIndex)));
                    }

                    if (nodeModified && textNode.parentNode) {
                        textNode.parentNode.replaceChild(fragment, textNode);
                    }
                });

                if (highlightedElements.length > 0) {
                    currentMatchIndex = 0;
                    highlightCurrentMatch();
                } else {
                    currentMatchIndex = -1;
                }
                updateNavButtons();
                searchInput.focus();
            }
        }

        function debounce(func, delay) {
            let timeout;
            return function(...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), delay);
            };
        }

        searchInput.addEventListener('input', debounce(performSearch, 300));
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedElements.length > 0 && currentMatchIndex !== -1) {
                    goToNextMatch();
                } else {
                    performSearch();
                }
            }
        });

        searchNextBtn.addEventListener('click', goToNextMatch);
        searchPrevBtn.addEventListener('click', goToPreviousMatch);
    }

    // --- Enhanced Initialization ---
    function initialize() {
        createSettingsUI();
        createFloatingButtons();

        const settingsModal = document.getElementById('kdrama-settings-modal');
        window.addEventListener('scroll', () => {
            if (settingsModal && settingsModal.style.display === 'flex') {
                if (document.activeElement !== document.getElementById('kdrama-search-input')) {
                    settingsModal.style.display = 'none';
                }
            }
        });

        const attempts = [0, 500, 1000, 2000, 3000];
        let successful = false;
        attempts.forEach((delay) => {
            setTimeout(() => {
                if (!successful) {
                    try {
                        const result = enhancePageContent();
                        if (result) successful = true;
                    } catch (e) {
                        console.error('Sinflix Modifier error during initial enhancement:', e);
                    }
                }
            }, delay);
        });

        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
                let shouldProcess = false;
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        if (mutation.target.closest('.entry-text article') || mutation.target.matches('.entry-text article')) {
                            shouldProcess = true;
                        }
                    }
                });

                if (shouldProcess) {
                    setTimeout(() => {
                        try {
                            enhancePageContent();
                        } catch (e) {
                            console.error('Sinflix Modifier error during MutationObserver processing:', e);
                        }
                    }, 100);
                }
            });

            const content = document.querySelector('.entry-text article');
            if (content) {
                observer.observe(content, { childList: true, subtree: true });
            } else {
                const bodyObserver = new MutationObserver((mutations, obs) => {
                    if (document.querySelector('.entry-text article')) {
                        obs.disconnect();
                        const foundContent = document.querySelector('.entry-text article');
                        observer.observe(foundContent, { childList: true, subtree: true });
                        try {
                            enhancePageContent();
                        } catch (e) {
                            console.error('Sinflix Modifier error after body observer found content:', e);
                        }
                    }
                });
                bodyObserver.observe(document.body, { childList: true, subtree: true });
            }
        }
    }

    // Initialize the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();