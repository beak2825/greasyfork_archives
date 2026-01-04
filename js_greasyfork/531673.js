// ==UserScript==
// @name         Discord Ultimate Customizer
// @namespace    http://Tampermonkey
// @version      1.0
// @author       NotYou
// @match        https://discord.com/*
// @match        https://*.discord.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @description Discord Font and Background changer
// @downloadURL https://update.greasyfork.org/scripts/531673/Discord%20Ultimate%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/531673/Discord%20Ultimate%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // SCRIPT 1: Discord Font Changer
    // ==========================================
  (function() {
    'use strict';

    // Configuration
    let menuOpen = false;
    let currentFont = GM_getValue('discordFont', '');
    let currentSize = GM_getValue('discordFontSize', 16);
    let currentWeight = GM_getValue('discordFontWeight', 400);
    let currentColor = GM_getValue('discordFontColor', '#ffffff');

    // Font Categories
    const fontCategories = {
        "Sans-Serif": [
            "Arial", "Helvetica", "Verdana", "Tahoma", "Trebuchet MS",
            "Century Gothic", "Calibri", "Segoe UI", "Roboto", "Open Sans",
            "Lato", "Montserrat", "Raleway", "Ubuntu", "Source Sans Pro",
            "Nunito", "Oxygen", "Droid Sans", "PT Sans", "Fira Sans"
        ],
        "Serif": [
            "Times New Roman", "Georgia", "Garamond", "Baskerville", "Cambria",
            "Palatino", "Bookman", "Times", "Didot", "Crimson Text",
            "Lora", "Merriweather", "Playfair Display", "Libre Baskerville", "Arvo",
            "Slabo 27px", "PT Serif", "Cardo", "Cormorant Garamond", "Noto Serif"
        ],
        "Monospace": [
            "Courier New", "Courier", "Consolas", "Monaco", "Lucida Console",
            "Menlo", "DejaVu Sans Mono", "Roboto Mono", "Source Code Pro", "Ubuntu Mono",
            "Fira Mono", "Anonymous Pro", "PT Mono", "IBM Plex Mono", "Inconsolata",
            "Space Mono", "Oxygen Mono", "Nova Mono", "Overpass Mono", "JetBrains Mono"
        ],
        "Display": [
            "Impact", "Comic Sans MS", "Papyrus", "Copperplate", "Brush Script MT",
            "Pacifico", "Lobster", "Bangers", "Permanent Marker", "Fredoka One",
            "Archivo Black", "Bebas Neue", "Righteous", "Gloria Hallelujah", "Dancing Script",
            "Satisfy", "Courgette", "Kaushan Script", "Great Vibes", "Amatic SC"
        ],
        "Handwriting": [
            "Architects Daughter", "Patrick Hand", "Shadows Into Light", "Indie Flower", "Caveat",
            "Sacramento", "Homemade Apple", "Just Another Hand", "Marck Script", "Kalam",
            "Sriracha", "Rock Salt", "Reenie Beanie", "Crafty Girls", "Schoolbell",
            "Covered By Your Grace", "Annie Use Your Telescope", "Coming Soon", "Gochi Hand", "Neucha"
        ],
        "Dyslexic-Friendly": [
            "OpenDyslexic", "Lexie Readable", "Comic Sans MS", "Verdana", "Century Gothic",
            "Tahoma", "Trebuchet MS", "Helvetica", "Arial", "Dyslexie",
            "Read Regular", "Sylexiad", "Tiresias", "FS Me", "Sassoon Primary"
        ],
    };

    // Wait for Discord to load
    function waitForDiscord() {
        const checkInterval = setInterval(() => {
            if (document.querySelector('#app-mount')) {
                clearInterval(checkInterval);
                initialize();
            }
        }, 500);
    }

    // Initialize the script
    function initialize() {
        // Add Google Fonts
        const googleFontLink = document.createElement('link');
        googleFontLink.rel = 'stylesheet';
        googleFontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;500;600;700;800&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;500;600;700;800&family=Raleway:wght@300;400;500;600;700;800&family=Ubuntu:wght@300;400;500;700&family=Source+Sans+Pro:wght@300;400;600;700&family=Nunito:wght@300;400;500;600;700;800&family=Oxygen:wght@300;400;700&family=PT+Sans:wght@400;700&family=Fira+Sans:wght@300;400;500;600;700;800&family=Lora:wght@400;500;600;700&family=Merriweather:wght@300;400;700;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Libre+Baskerville:wght@400;700&family=Arvo:wght@400;700&family=Slabo+27px&family=PT+Serif:wght@400;700&family=Cardo:wght@400;700&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Noto+Serif:wght@400;700&family=Roboto+Mono:wght@300;400;500;600;700&family=Source+Code+Pro:wght@300;400;500;600;700;800;900&family=Ubuntu+Mono:wght@400;700&family=Fira+Mono:wght@400;500;700&family=PT+Mono&family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Inconsolata:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&family=Oxygen+Mono&family=Overpass+Mono:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700;800&family=Pacifico&family=Lobster&family=Bangers&family=Permanent+Marker&family=Fredoka+One&family=Archivo+Black&family=Bebas+Neue&family=Righteous&family=Gloria+Hallelujah&family=Dancing+Script:wght@400;500;600;700&family=Satisfy&family=Courgette&family=Kaushan+Script&family=Great+Vibes&family=Amatic+SC:wght@400;700&family=Architects+Daughter&family=Patrick+Hand&family=Shadows+Into+Light&family=Indie+Flower&family=Caveat:wght@400;500;600;700&family=Sacramento&family=Homemade+Apple&family=Just+Another+Hand&family=Marck+Script&family=Kalam:wght@300;400;700&family=Sriracha&family=Rock+Salt&family=Reenie+Beanie&family=Crafty+Girls&family=Schoolbell&family=Covered+By+Your+Grace&family=Annie+Use+Your+Telescope&family=Coming+Soon&family=Gochi+Hand&family=Neucha&family=OpenDyslexic:wght@400;700';
        document.head.appendChild(googleFontLink);

        // Add CSS for the menu
        const style = document.createElement('style');
        style.textContent = `
            #font-menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            #font-menu-container {
                background: #36393f;
                width: 800px;
                max-width: 90vw;
                max-height: 90vh;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            #font-menu-header {
                padding: 20px;
                background: #2f3136;
                border-bottom: 1px solid #202225;
            }

            #font-menu h2 {
                color: white;
                margin: 0;
                text-align: center;
            }

            #font-menu-body {
                padding: 20px;
                overflow-y: auto;
                max-height: 70vh;
            }

            #font-preview {
                width: 100%;
                padding: 15px;
                margin-bottom: 20px;
                background: #2f3136;
                border-radius: 4px;
                white-space: normal;
                word-break: break-word;
                font-size: 16px;
                line-height: 1.5;
            }

            #font-menu .font-settings {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }

            #font-menu .setting-group {
                flex: 1;
                min-width: 180px;
            }

            #font-menu .setting-group label {
                display: block;
                margin-bottom: 5px;
            }

            #font-menu .setting-group select,
            #font-menu .setting-group input {
                width: 100%;
                padding: 8px;
                background: #2f3136;
                border: 1px solid #202225;
                color: white;
                border-radius: 4px;
            }

            #font-menu .font-categories {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            #font-menu .category {
                background: #2f3136;
                border-radius: 4px;
                overflow: hidden;
            }

            #font-menu .category-header {
                background: #202225;
                padding: 10px 15px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #font-menu .category-title {
                font-weight: bold;
            }

            #font-menu .category-fonts {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 10px;
                padding: 15px;
                max-height: 300px;
                overflow-y: auto;
            }

            #font-menu .font-option {
                background: #40444b;
                padding: 10px;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.2s;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            #font-menu .font-option:hover {
                background: #5865f2;
            }

            #font-menu .font-option.active {
                background: #5865f2;
                box-shadow: 0 0 0 2px #ffffff;
            }

            #font-menu-footer {
                padding: 15px 20px;
                background: #2f3136;
                border-top: 1px solid #202225;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }

            #font-menu button {
                padding: 10px 15px;
                border: none;
                border-radius: 4px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s;
            }

            #apply-btn {
                background-color: #5865f2;
            }

            #apply-btn:hover {
                background-color: #4752c4;
            }

            #reset-btn {
                background-color: #4f545c;
            }

            #reset-btn:hover {
                background-color: #3e4147;
            }

            #close-btn {
                background-color: #ed4245;
            }

            #close-btn:hover {
                background-color: #ca383b;
            }

            .collapsed .category-fonts {
                display: none !important;
            }

            #scroll-to-top {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #5865f2;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            }
        `;
        document.head.appendChild(style);

        // Apply saved font settings if exists
        if (currentFont) {
            applyFontSettings(currentFont, currentSize, currentWeight, currentColor);
        }

        // Listen for backtick key
        document.addEventListener('keydown', (e) => {
            if (e.key === '`' && !menuOpen) {
                showMenu();
                e.preventDefault();
            }
        });
    }

    // Show the menu
    function showMenu() {
        menuOpen = true;

        // Create menu elements
        const menu = document.createElement('div');
        menu.id = 'font-menu';

        const container = document.createElement('div');
        container.id = 'font-menu-container';

        // Header
        const header = document.createElement('div');
        header.id = 'font-menu-header';

        const title = document.createElement('h2');
        title.textContent = 'Discord Font Editor';
        header.appendChild(title);

        container.appendChild(header);

        // Body
        const body = document.createElement('div');
        body.id = 'font-menu-body';

        // Preview area
        const preview = document.createElement('div');
        preview.id = 'font-preview';
        preview.textContent = 'Aa, Bb, Cc, Dd, Ee, Ff, Gg, Hh, Ii, Jj, Kk, Ll, Mm, Nn, Oo, Pp, Qq, Rr, Ss, Tt, Uu, Vv, Ww, Xx, Yy, Zz.';
        if (currentFont) {
            preview.style.fontFamily = `"${currentFont}", sans-serif`;
            preview.style.fontSize = `${currentSize}px`;
            preview.style.fontWeight = currentWeight;
            preview.style.color = currentColor;
        }
        body.appendChild(preview);

        // Font settings
        const fontSettings = document.createElement('div');
        fontSettings.className = 'font-settings';

        // Font size setting
        const sizeGroup = document.createElement('div');
        sizeGroup.className = 'setting-group';

        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Font Size';
        sizeGroup.appendChild(sizeLabel);

        const sizeInput = document.createElement('input');
        sizeInput.type = 'range';
        sizeInput.min = '10';
        sizeInput.max = '24';
        sizeInput.value = currentSize;
        sizeInput.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            preview.style.fontSize = `${size}px`;
            sizeValue.textContent = `${size}px`;
        });
        sizeGroup.appendChild(sizeInput);

        const sizeValue = document.createElement('div');
        sizeValue.textContent = `${currentSize}px`;
        sizeGroup.appendChild(sizeValue);

        fontSettings.appendChild(sizeGroup);

        // Font weight setting
        const weightGroup = document.createElement('div');
        weightGroup.className = 'setting-group';

        const weightLabel = document.createElement('label');
        weightLabel.textContent = 'Font Weight';
        weightGroup.appendChild(weightLabel);

        const weightSelect = document.createElement('select');
        const weights = [
            { value: '300', label: 'Light' },
            { value: '400', label: 'Regular' },
            { value: '500', label: 'Medium' },
            { value: '600', label: 'Semi-Bold' },
            { value: '700', label: 'Bold' },
            { value: '800', label: 'Extra Bold' }
        ];

        weights.forEach(weight => {
            const option = document.createElement('option');
            option.value = weight.value;
            option.textContent = weight.label;
            if (parseInt(weight.value) === currentWeight) {
                option.selected = true;
            }
            weightSelect.appendChild(option);
        });

        weightSelect.addEventListener('change', (e) => {
            const weight = e.target.value;
            preview.style.fontWeight = weight;
        });

        weightGroup.appendChild(weightSelect);
        fontSettings.appendChild(weightGroup);

        // Color picker setting
        const colorGroup = document.createElement('div');
        colorGroup.className = 'setting-group';

        const colorLabel = document.createElement('label');
        colorLabel.textContent = 'Text Color';
        colorGroup.appendChild(colorLabel);

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = currentColor || '#ffffff';
        colorInput.addEventListener('input', (e) => {
            const color = e.target.value;
            preview.style.color = color;
        });
        colorGroup.appendChild(colorInput);

        fontSettings.appendChild(colorGroup);

        body.appendChild(fontSettings);

        // Font categories
        const fontCategoriesEl = document.createElement('div');
        fontCategoriesEl.className = 'font-categories';

        // Create scroll to top button
        const scrollToTop = document.createElement('div');
        scrollToTop.id = 'scroll-to-top';
        scrollToTop.innerHTML = '&#9650;'; // Up arrow
        scrollToTop.addEventListener('click', () => {
            body.scrollTop = 0;
        });
        body.appendChild(scrollToTop);

        // Create categories
        for (const [category, fonts] of Object.entries(fontCategories)) {
            const categoryEl = document.createElement('div');
            categoryEl.className = 'category';

            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';

            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category + ` (${fonts.length})`;
            categoryHeader.appendChild(categoryTitle);

            const categoryToggle = document.createElement('div');
            categoryToggle.className = 'category-toggle';
            categoryToggle.textContent = '-';
            categoryHeader.appendChild(categoryToggle);

            categoryHeader.addEventListener('click', () => {
                categoryEl.classList.toggle('collapsed');
                categoryToggle.textContent = categoryEl.classList.contains('collapsed') ? '+' : '-';
            });

            categoryEl.appendChild(categoryHeader);

            const categoryFonts = document.createElement('div');
            categoryFonts.className = 'category-fonts';

            // Add font options
            fonts.forEach(font => {
                const fontOption = document.createElement('div');
                fontOption.className = 'font-option';
                fontOption.textContent = font;
                fontOption.style.fontFamily = `"${font}", sans-serif`;

                if (font === currentFont) {
                    fontOption.classList.add('active');
                }

                fontOption.addEventListener('click', () => {
                    // Remove active class from all font options
                    document.querySelectorAll('.font-option').forEach(el => {
                        el.classList.remove('active');
                    });

                    // Add active class to clicked font
                    fontOption.classList.add('active');

                    // Update preview
                    preview.style.fontFamily = `"${font}", sans-serif`;
                });

                categoryFonts.appendChild(fontOption);
            });

            categoryEl.appendChild(categoryFonts);
            fontCategoriesEl.appendChild(categoryEl);
        }

        body.appendChild(fontCategoriesEl);
        container.appendChild(body);

        // Footer
        const footer = document.createElement('div');
        footer.id = 'font-menu-footer';

        // Apply button
        const applyBtn = document.createElement('button');
        applyBtn.id = 'apply-btn';
        applyBtn.textContent = 'Apply';
        applyBtn.addEventListener('click', () => {
            const activeFont = document.querySelector('.font-option.active');
            if (activeFont) {
                const fontFamily = activeFont.textContent;
                const fontSize = parseInt(sizeInput.value);
                const fontWeight = parseInt(weightSelect.value);
                const fontColor = colorInput.value;

                // Save settings
                currentFont = fontFamily;
                currentSize = fontSize;
                currentWeight = fontWeight;
                currentColor = fontColor;

                GM_setValue('discordFont', fontFamily);
                GM_setValue('discordFontSize', fontSize);
                GM_setValue('discordFontWeight', fontWeight);
                GM_setValue('discordFontColor', fontColor);

                // Apply settings
                applyFontSettings(fontFamily, fontSize, fontWeight, fontColor);

                // Close menu
                closeMenu();
            }
        });
        footer.appendChild(applyBtn);

        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.id = 'reset-btn';
        resetBtn.textContent = 'Reset';
        resetBtn.addEventListener('click', () => {
            // Remove custom font
            removeFontSettings();

            // Clear saved settings
            GM_setValue('discordFont', '');
            GM_setValue('discordFontSize', 16);
            GM_setValue('discordFontWeight', 400);
            GM_setValue('discordFontColor', '#ffffff');

            currentFont = '';
            currentSize = 16;
            currentWeight = 400;
            currentColor = '#ffffff';

            // Reset preview
            preview.style.fontFamily = '';
            preview.style.fontSize = '16px';
            preview.style.fontWeight = '400';
            preview.style.color = '#ffffff';

            // Reset active font
            document.querySelectorAll('.font-option').forEach(el => {
                el.classList.remove('active');
            });

            // Reset inputs
            sizeInput.value = 16;
            sizeValue.textContent = '16px';
            weightSelect.value = 400;
            colorInput.value = '#ffffff';
        });
        footer.appendChild(resetBtn);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.id = 'close-btn';
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', closeMenu);
        footer.appendChild(closeBtn);

        container.appendChild(footer);
        menu.appendChild(container);
        document.body.appendChild(menu);

        // Close when clicking outside the menu
        menu.addEventListener('click', (e) => {
            if (e.target === menu) {
                closeMenu();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function escListener(e) {
            if (e.key === 'Escape') {
                closeMenu();
                document.removeEventListener('keydown', escListener);
            }
        });
    }

    // Close the menu
    function closeMenu() {
        const menu = document.getElementById('font-menu');
        if (menu) {
            menu.remove();
        }
        menuOpen = false;
    }

    // Apply font settings
    function applyFontSettings(fontFamily, fontSize, fontWeight, fontColor) {
        let customStyle = document.getElementById('discord-font-style');
        if (!customStyle) {
            customStyle = document.createElement('style');
            customStyle.id = 'discord-font-style';
            document.head.appendChild(customStyle);
        }

        // Use a more targeted approach for font weight and size
        customStyle.textContent = `
            /* Apply custom font to all text in Discord */
            * {
                font-family: "${fontFamily}", sans-serif !important;
            }

            /* Apply font size to specific text elements */
            .markup-2BOw-j,
            [class*="messageContent"],
            [class*="content-"],
            [class*="text-"],
            [class*="name-"],
            [class*="username-"],
            [class*="channelName-"],
            [class*="topic-"],
            [class*="membersGroup-"],
            [class*="itemLabel-"],
            [class*="searchBar-"],
            button,
            input,
            textarea,
            select {
                font-size: ${fontSize}px !important;
            }

            /* Apply font weight to specific elements */
            .markup-2BOw-j,
            [class*="messageContent"],
            [class*="content-"],
            [class*="text-"],
            [class*="name-"],
            [class*="username-"],
            [class*="channelName-"],
            [class*="topic-"] {
                font-weight: ${fontWeight} !important;
            }

            /* Force font weight on span elements that might be overridden */
            .markup-2BOw-j span,
            [class*="messageContent"] span,
            [class*="content-"] span,
            [class*="text-"] span {
                font-weight: ${fontWeight} !important;
            }

            /* Apply text color to message text */
            .markup-2BOw-j,
            .markup-2BOw-j *,
            [class*="messageContent"],
            [class*="messageContent"] * {
                color: ${fontColor} !important;
            }

            /* Force color on extra elements */
            .contents-2mQqc9 .markup-2BOw-j,
            .contents-2mQqc9 .markup-2BOw-j *,
            [class*="contents-"] [class*="markup-"],
            [class*="contents-"] [class*="markup-"] * {
                color: ${fontColor} !important;
            }

            /* Target newer Discord message classes */
            [class*="message-"] [class*="content-"],
            [class*="message-"] [class*="content-"] > div,
            [class*="message-"] [class*="content-"] > span,
            [class*="message-"] [class*="content-"] > p {
                color: ${fontColor} !important;
                font-weight: ${fontWeight} !important;
                font-size: ${fontSize}px !important;
            }

            /* Apply style to any new class names Discord might add for messages */
            [class*="chatContent"] [class*="message"] div[class*="content"],
            [class*="chatContent"] [class*="messageContainer"] div[class*="content"] {
                color: ${fontColor} !important;
                font-weight: ${fontWeight} !important;
                font-size: ${fontSize}px !important;
            }

            /* Support Discord's dynamic class names with wildcard selectors */
            div[class*="chat"] div[class*="message"] div[class*="content"],
            div[class*="chat"] div[class*="message"] div[class*="markupRtl"],
            div[class*="chat"] div[class*="message"] div[class*="markup"] {
                color: ${fontColor} !important;
                font-weight: ${fontWeight} !important;
                font-size: ${fontSize}px !important;
            }
        `;
    }

    // Remove font settings
    function removeFontSettings() {
        const customStyle = document.getElementById('discord-font-style');
        if (customStyle) {
            customStyle.remove();
        }
    }

    // Start the script
    waitForDiscord();
})();

    // ==========================================
    // SCRIPT 2: Discord Background Changer
    // ==========================================

// ==UserScript==
// @name         Discord Custom Background
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add custom background images to Discord with improved layer handling
// @author       You
// @match        https://discord.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    let menuOpen = false;
    let customBgUrl = GM_getValue('customBgUrl', '');
    let bgOpacity = GM_getValue('bgOpacity', 0.2); // Default opacity at 0.2 (20%)
    let displayMode = GM_getValue('displayMode', 'everywhere'); // Default to show everywhere

    // Wait for Discord to load
    function waitForDiscord() {
        const checkInterval = setInterval(() => {
            if (document.querySelector('#app-mount')) {
                clearInterval(checkInterval);
                initialize();
            }
        }, 500);
    }

    // Initialize the script
    function initialize() {
        // Add CSS for the menu
        const style = document.createElement('style');
        style.textContent = `
            #bg-menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #bg-menu-container {
                background: #36393f;
                width: 500px;
                max-width: 90vw;
                border-radius: 8px;
                padding: 20px;
            }

            #bg-menu h2 {
                color: white;
                margin: 0 0 15px 0;
                text-align: center;
            }

            #preview-container {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }

            .preview-box {
                flex: 1;
                height: 150px;
                background-size: cover;
                background-position: center;
                border-radius: 4px;
                background-color: #2f3136;
                position: relative;
                overflow: hidden;
            }

            .preview-box::after {
                content: attr(data-label);
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 5px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                text-align: center;
            }

            #bg-menu input[type="text"] {
                width: 100%;
                padding: 8px;
                margin-bottom: 10px;
                background: #2f3136;
                border: none;
                color: white;
                border-radius: 4px;
            }

            #bg-menu input[type="range"] {
                width: 100%;
                margin: 10px 0;
                background: #2f3136;
            }

            #opacity-value {
                color: white;
                text-align: center;
                margin-bottom: 15px;
            }

            #location-options {
                margin: 15px 0;
            }

            .location-option {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                color: white;
            }

            .location-option input {
                margin-right: 10px;
            }

            #bg-menu .button-row {
                display: flex;
                gap: 10px;
            }

            #bg-menu button {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 4px;
                color: white;
                font-weight: bold;
                cursor: pointer;
            }

            #apply-btn {
                background-color: #5865f2;
            }

            #default-btn {
                background-color: #4f545c;
            }

            #close-btn {
                background-color: #ed4245;
            }

            /* This is for our actual background element */
            #discord-custom-bg {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
                pointer-events: none; /* Allows clicking through the background */
                z-index: 1; /* Low z-index to stay behind content */
            }
        `;
        document.head.appendChild(style);

        // Apply saved background if exists
        if (customBgUrl) {
            applyBackground(customBgUrl, bgOpacity, displayMode);
        }

        // Listen for backslash key
        document.addEventListener('keydown', (e) => {
            if (e.key === '\\' && !menuOpen) {
                showMenu();
                e.preventDefault();
            }
        });
    }

    // Show the menu
    function showMenu() {
        menuOpen = true;

        // Create menu elements
        const menu = document.createElement('div');
        menu.id = 'bg-menu';

        const container = document.createElement('div');
        container.id = 'bg-menu-container';

        // Title
        const title = document.createElement('h2');
        title.textContent = 'Discord Background Settings';
        container.appendChild(title);

        // Preview section with before/after
        const previewContainer = document.createElement('div');
        previewContainer.id = 'preview-container';

        // Before preview (100% opacity)
        const beforePreview = document.createElement('div');
        beforePreview.className = 'preview-box';
        beforePreview.setAttribute('data-label', 'Before (100%)');
        if (customBgUrl) {
            beforePreview.style.backgroundImage = `url("${customBgUrl}")`;
        }
        previewContainer.appendChild(beforePreview);

        // After preview (with applied opacity)
        const afterPreview = document.createElement('div');
        afterPreview.className = 'preview-box';
        afterPreview.setAttribute('data-label', `After (${Math.round(bgOpacity * 100)}%)`);
        if (customBgUrl) {
            afterPreview.style.backgroundImage = `url("${customBgUrl}")`;
            afterPreview.style.opacity = bgOpacity;
        }
        previewContainer.appendChild(afterPreview);

        container.appendChild(previewContainer);

        // URL input
        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.placeholder = 'Enter image URL here';
        urlInput.value = customBgUrl;
        container.appendChild(urlInput);

        // File input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.color = 'white';
        fileInput.style.marginBottom = '15px';
        container.appendChild(fileInput);

        // Opacity slider and value display
        const opacityLabel = document.createElement('div');
        opacityLabel.textContent = 'Background Opacity:';
        opacityLabel.style.color = 'white';
        container.appendChild(opacityLabel);

        const opacitySlider = document.createElement('input');
        opacitySlider.type = 'range';
        opacitySlider.min = '0';
        opacitySlider.max = '1';
        opacitySlider.step = '0.01';
        opacitySlider.value = bgOpacity;
        container.appendChild(opacitySlider);

        const opacityValue = document.createElement('div');
        opacityValue.id = 'opacity-value';
        opacityValue.textContent = `${Math.round(bgOpacity * 100)}%`;
        container.appendChild(opacityValue);

        // Display location options
        const locationOptions = document.createElement('div');
        locationOptions.id = 'location-options';

        const locationTitle = document.createElement('div');
        locationTitle.textContent = 'Background Display Location:';
        locationTitle.style.color = 'white';
        locationTitle.style.marginBottom = '10px';
        locationOptions.appendChild(locationTitle);

        // Add the radio options - removed main-only as requested
        locationOptions.appendChild(createRadioOption('everywhere', 'Show Everywhere', displayMode === 'everywhere'));
        locationOptions.appendChild(createRadioOption('chat-only', 'Chat Only', displayMode === 'chat-only'));

        container.appendChild(locationOptions);

        // Button row
        const buttonRow = document.createElement('div');
        buttonRow.className = 'button-row';

        // Apply button
        const applyBtn = document.createElement('button');
        applyBtn.id = 'apply-btn';
        applyBtn.textContent = 'Apply';
        buttonRow.appendChild(applyBtn);

        // Default button
        const defaultBtn = document.createElement('button');
        defaultBtn.id = 'default-btn';
        defaultBtn.textContent = 'Default';
        buttonRow.appendChild(defaultBtn);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.id = 'close-btn';
        closeBtn.textContent = 'Close';
        buttonRow.appendChild(closeBtn);

        container.appendChild(buttonRow);
        menu.appendChild(container);
        document.body.appendChild(menu);

        // Event listeners
        urlInput.addEventListener('input', () => {
            const url = urlInput.value.trim();
            if (url) {
                beforePreview.style.backgroundImage = `url("${url}")`;
                afterPreview.style.backgroundImage = `url("${url}")`;
            }
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target.result;
                    beforePreview.style.backgroundImage = `url("${dataUrl}")`;
                    afterPreview.style.backgroundImage = `url("${dataUrl}")`;
                    urlInput.value = dataUrl;
                };
                reader.readAsDataURL(file);
            }
        });

        opacitySlider.addEventListener('input', () => {
            const newOpacity = parseFloat(opacitySlider.value);
            afterPreview.style.opacity = newOpacity;
            afterPreview.setAttribute('data-label', `After (${Math.round(newOpacity * 100)}%)`);
            opacityValue.textContent = `${Math.round(newOpacity * 100)}%`;
        });

        applyBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (url) {
                customBgUrl = url;
                GM_setValue('customBgUrl', url);

                // Get selected opacity
                bgOpacity = parseFloat(opacitySlider.value);
                GM_setValue('bgOpacity', bgOpacity);

                // Get selected display mode
                const selectedMode = document.querySelector('input[name="location"]:checked').value;
                displayMode = selectedMode;
                GM_setValue('displayMode', displayMode);

                applyBackground(url, bgOpacity, displayMode);
                closeMenu();
            }
        });

        defaultBtn.addEventListener('click', () => {
            customBgUrl = '';
            bgOpacity = 0.2;
            displayMode = 'everywhere';
            GM_setValue('customBgUrl', '');
            GM_setValue('bgOpacity', bgOpacity);
            GM_setValue('displayMode', displayMode);
            removeBackground();
            closeMenu();
        });

        closeBtn.addEventListener('click', closeMenu);

        // Close when clicking outside the menu
        menu.addEventListener('click', (e) => {
            if (e.target === menu) {
                closeMenu();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function escListener(e) {
            if (e.key === 'Escape') {
                closeMenu();
                document.removeEventListener('keydown', escListener);
            }
        });
    }

    // Helper function to create radio options
    function createRadioOption(value, labelText, isChecked) {
        const optionContainer = document.createElement('div');
        optionContainer.className = 'location-option';

        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'location';
        radioInput.value = value;
        radioInput.id = `location-${value}`;
        radioInput.checked = isChecked;

        const label = document.createElement('label');
        label.htmlFor = `location-${value}`;
        label.textContent = labelText;

        optionContainer.appendChild(radioInput);
        optionContainer.appendChild(label);

        return optionContainer;
    }

    // Close the menu
    function closeMenu() {
        const menu = document.getElementById('bg-menu');
        if (menu) {
            menu.remove();
        }
        menuOpen = false;
    }

    // Apply background with improved layer handling
    function applyBackground(url, opacity, mode) {
        // Remove existing background if any
        removeBackground();

        // Create background element
        const customBg = document.createElement('div');
        customBg.id = 'discord-custom-bg';
        customBg.style.backgroundImage = `url("${url}")`;
        customBg.style.opacity = opacity;

        // Set z-index based on mode
        if (mode === 'chat-only') {
            // Position above chat but below other elements
            customBg.style.zIndex = '2';
        } else {
            // Everywhere mode - behind everything but above app base
            customBg.style.zIndex = '1';
        }

        // Insert background at the right position in the DOM
        const appMount = document.getElementById('app-mount');
        if (appMount && appMount.firstChild) {
            appMount.insertBefore(customBg, appMount.firstChild);
        } else {
            document.body.insertBefore(customBg, document.body.firstChild);
        }

        // Add custom styles based on display mode
        let customStyle = document.getElementById('discord-bg-style');
        if (!customStyle) {
            customStyle = document.createElement('style');
            customStyle.id = 'discord-bg-style';
            document.head.appendChild(customStyle);
        }

        // Base styles that make Discord transparent
        let cssContent = `
            /* Make base containers transparent */
            #app-mount, .app-1q1i1E, .bg-h5JY_x, .layer-3QrUeG {
                background: transparent !important;
            }
        `;

        if (mode === 'chat-only') {
            cssContent += `
                /* Make only chat area transparent while keeping sidebars opaque */
                /* Chat container selectors - broader approach */
                main[class*="chat"],
                div[class*="chat"],
                div[class*="chatContent"],
                div[class*="messagesWrapper"],
                div[class*="scroller"][class*="content"],
                div[class*="container"][class*="chat"] {
                    background: transparent !important;
                    position: relative;
                    z-index: 1; /* Lower z-index for the container */
                }

                /* Text and Images in chat should appear above the background */
                div[class*="message"],
                div[class*="messageListItem"],
                div[class*="markup"],
                div[class*="content"] span,
                div[class*="content"] strong,
                div[class*="content"] em,
                div[class*="content"] a,
                div[class*="content"] code,
                div[class*="embed"],
                div[class*="attachment"],
                div[class*="imageWrapper"],
                div[class*="embedDescription"],
                div[class*="embedTitle"],
                img,
                video,
                article {
                    position: relative;
                    z-index: 3 !important; /* Higher z-index to appear above background */
                }

                /* Keep sidebar and other UI elements opaque */
                nav[class*="sidebar"],
                aside[class*="sidebar"],
                div[class*="sidebar"],
                div[class*="container"][class*="sidebar"],
                div[class*="panels"],
                div[class*="container"][class*="members"],
                div[class*="channelTextArea"],
                div[class*="form"],
                div[class*="toolbar"],
                section[class*="title"],
                div[class*="header"] {
                    background-color: var(--background-secondary, #2f3136) !important;
                    position: relative;
                    z-index: 4 !important; /* Higher z-index than chat elements */
                }

                /* Channel list sidebar */
                div[class*="guilds"],
                nav[class*="guilds"],
                div[class*="scroller"][class*="guild"],
                div[class*="sidebar"][class*="hasNotice"] {
                    background-color: var(--background-tertiary, #202225) !important;
                    position: relative;
                    z-index: 4 !important;
                }

                /* Text input area */
                div[class*="channelTextArea"],
                div[class*="scrollableContainer"] {
                    background-color: var(--channeltextarea-background, rgba(64, 68, 75, 0.8)) !important;
                    position: relative;
                    z-index: 4 !important;
                }
            `;
        } else {
            // 'everywhere' mode - but keep text, images, etc. above background
            cssContent += `
                /* Make all major containers transparent */
                main[class*="chat"],
                div[class*="chat"],
                div[class*="chatContent"],
                div[class*="messagesWrapper"],
                nav[class*="sidebar"],
                aside[class*="sidebar"],
                div[class*="sidebar"],
                div[class*="panels"],
                div[class*="guilds"],
                nav[class*="guilds"],
                div[class*="scroller"],
                div[class*="content"],
                div[class*="container"],
                div[class*="base"],
                section[class*="container"],
                section[class*="title"],
                div[class*="header"],
                div[class*="middle"],
                div[class*="message"],
                div[class*="messageListItem"] {
                    background: transparent !important;
                    position: relative;
                }

                /* Text and Images should appear above the background */
                div[class*="markup"],
                div[class*="content"] span,
                div[class*="content"] strong,
                div[class*="content"] em,
                div[class*="content"] a,
                div[class*="content"] code,
                div[class*="embed"],
                div[class*="attachment"],
                div[class*="imageWrapper"],
                div[class*="embedDescription"],
                div[class*="embedTitle"],
                img,
                video,
                article {
                    position: relative;
                    z-index: 3 !important; /* Higher z-index to appear above background */
                }

                /* Keep input areas and some UI elements with slight background */
                div[class*="channelTextArea"],
                div[class*="scrollableContainer"],
                div[class*="toolbar"],
                div[class*="searchBar"],
                div[class*="form"] {
                    background-color: rgba(30, 30, 30, 0.3) !important;
                    position: relative;
                    z-index: 4 !important;
                }

                /* Interactive UI elements should be on top */
                button,
                input,
                textarea,
                div[class*="clickable"],
                div[class*="control"],
                div[class*="activityPanel"],
                div[class*="typing"],
                div[role="button"],
                div[class*="selected"],
                div[class*="container"][class*="clickable"] {
                    position: relative;
                    z-index: 5 !important;
                }
            `;
        }

        customStyle.textContent = cssContent;
    }

    // Remove background
    function removeBackground() {
        const customBg = document.getElementById('discord-custom-bg');
        if (customBg) {
            customBg.remove();
        }

        const customStyle = document.getElementById('discord-bg-style');
        if (customStyle) {
            customStyle.remove();
        }
    }

    // A function to observe DOM changes and reapply style if Discord updates
    function observeDiscord() {
        const observer = new MutationObserver((mutations) => {
            if (customBgUrl) {
                // Check if our custom style is still active
                const customStyle = document.getElementById('discord-bg-style');
                if (!customStyle || !customStyle.parentNode) {
                    // Reapply our background if our style was removed
                    applyBackground(customBgUrl, bgOpacity, displayMode);
                }
            }
        });

        // Start observing the document with the configured parameters
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start the script
    waitForDiscord();
    // Also add DOM observer to handle Discord's dynamic updates
    observeDiscord();
})();
    // ==========================================
    // SHARED INITIALIZATION
    // ==========================================

    function initializeAll() {
        // Call the initialization functions from both scripts if they exist
        // For example:
        // if (typeof initBackgroundChanger === 'function') {
        //     initBackgroundChanger();
        // }
        //
        // if (typeof initColorCustomizer === 'function') {
        //     initColorCustomizer();
        // }
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAll);
    } else {
        initializeAll();
    }
})();