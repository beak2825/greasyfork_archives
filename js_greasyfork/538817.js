// ==UserScript==
// @name         Markdown Viewer
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  Automatically formats and displays .md files with a pleasant, readable theme and font settings. Turn your browser into the only Markdown viewer you need by giving your Tampermonkey access to local files.
// @description:en Automatically formats and displays .md files with a pleasant, readable theme and font settings. Turn your browser into the only Markdown viewer you need by giving your Tampermonkey access to local files.
// @description:de Automatisch .md-Dateien formatieren und anzeigen mit einem angenehmen, lesbaren Thema und Schriftarten. Machen Sie Ihren Browser zum einzigen Markdown-Viewer, den Sie benötigen, indem Sie Tampermonkey Zugriff auf lokale Dateien gewähren.
// @author       https://github.com/anga83
// @match        *://*/*.md
// @include      file://*/*.md
// @exclude      https://github.com/*
// @exclude      http://github.com/*
// @require      https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.umd.min.js
// @resource     css_darkdown https://raw.githubusercontent.com/yrgoldteeth/darkdowncss/master/darkdown.css
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/538817/Markdown%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/538817/Markdown%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SETTINGS IDENTIFIERS ---
    const FONT_STYLE_KEY = 'markdownViewer_fontStyle';
    const THEME_KEY = 'markdownViewer_theme';
    const STYLE_ELEMENT_ID_FONT = 'userscript-markdown-font-style';
    const STYLE_ELEMENT_ID_THEME = 'userscript-markdown-theme-style';
    const STYLE_ELEMENT_ID_BASE = 'userscript-markdown-base-style';

    // --- FONT SETTINGS ---
    const FONT_SETTINGS = {
        'serif': `Iowan Old Style, Apple Garamond, Baskerville, Georgia, Times New Roman, Droid Serif, Times, Source Serif Pro, serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol`,
        'sans-serif': `"Segoe UI", "SF Pro Text", "Helvetica Neue", "Ubuntu", "Arial", sans-serif`
    };

    function removeExistingStyleElement(id) {
        const existingStyle = document.getElementById(id);
        if (existingStyle) {
            existingStyle.remove();
        }
    }

    function addStyleElement(id, css) {
        removeExistingStyleElement(id);
        const style = document.createElement('style');
        style.id = id;
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    function applyFontStyle() {
        const chosenFont = GM_getValue(FONT_STYLE_KEY, 'serif'); // Standard 'serif'
        const fontFamily = FONT_SETTINGS[chosenFont] || FONT_SETTINGS.serif;
        addStyleElement(STYLE_ELEMENT_ID_FONT, `.markdown-body { font-family: ${fontFamily} !important; }`);
    }

    // --- THEME SETTINGS ---
    function applyThemeStyle() {
        const chosenTheme = GM_getValue(THEME_KEY, 'system'); // 'system', 'light', 'dark'
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

        let useDarkTheme = false;
        if (chosenTheme === 'dark') {
            useDarkTheme = true;
        } else if (chosenTheme === 'system' && prefersDarkScheme) {
            useDarkTheme = true;
        }

        let themeCss = '';
        if (useDarkTheme) {
            const darkdownCss = GM_getResourceText("css_darkdown");
            if (darkdownCss) {
                 themeCss += darkdownCss;
            }
            // Dark Theme
            themeCss += `
                body {
                    background-color: rgb(27, 28, 29) !important;
                    color: rgb(220, 220, 220) !important;
                }
                .markdown-body {
                    color: rgb(220, 220, 220) !important;
                }
                .markdown-body a { 
                    color: #79b8ff !important; /* Dezenter blau-türkis Farbton statt kräftiges Blau */
                    text-decoration: none !important; /* Keine Unterstreichung standardmäßig */
                }
                .markdown-body a:hover {
                    text-decoration: underline !important; /* Nur beim Hovern unterstreichen */
                }
                .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
                    border-bottom-color: #30363d !important;
                    color: rgb(220, 220, 220) !important;
                }
                .markdown-body hr { background-color: #30363d !important; }
                .markdown-body blockquote {
                    color: #a0a0a0 !important;
                    border-left-color: #30363d !important;
                }
                .markdown-body table th, .markdown-body table td { border-color: #484f58 !important; }
                .markdown-body code:not(pre code) { /* Inline code */
                    background-color: rgb(50, 50, 50) !important;
                    border: 1px solid rgb(70, 70, 70) !important;
                    color: rgb(220, 220, 220) !important;
                }
                .markdown-body pre { /* Code block */
                    background-color: rgb(40, 42, 44) !important;
                    border: 1px solid rgb(60, 62, 64) !important;
                }
                .markdown-body pre code {
                     color: rgb(220, 220, 220) !important;
                }
                .markdown-body kbd {
                    background-color: rgb(50,50,50) !important;
                    border: 1px solid rgb(70,70,70) !important;
                    color: rgb(220,220,220) !important;
                    border-bottom-color: rgb(80,80,80) !important;
                }
                .markdown-body img { filter: brightness(.8) contrast(1.2); }
                
                /* Dark Mode Button Styling */
                .custom-play-button {
                    background-color: #444d56 !important; /* Dunklerer, weniger aufdringlicher Grauton */
                    color: #e1e4e8 !important; /* Helle Schrift für dunklen Hintergrund */
                    border: 1px solid #586069 !important; /* Dezenter Rand */
                }
                .custom-play-button:hover, .custom-play-button:focus {
                    background-color: #586069 !important; /* Etwas heller beim Hover */
                    color: #e1e4e8 !important;
                    border-color: #6a737d !important;
                }
                .custom-play-button a {
                    color: #e1e4e8 !important; /* Links erben die Button-Textfarbe */
                    text-decoration: none !important;
                }
                .custom-play-button a:hover {
                    color: #e1e4e8 !important; /* Auch beim Hover Button-Farbe beibehalten */
                    text-decoration: none !important;
                }
            `;
        } else { // Light Theme
            themeCss += `
                body {
                    background-color: #ffffff !important;
                    color: #24292e !important;
                }
                .markdown-body {
                    color: #24292e !important;
                }
                .markdown-body a { 
                    color: #0366d6 !important; 
                    text-decoration: none !important; /* Keine Unterstreichung standardmäßig */
                }
                .markdown-body a:hover {
                    text-decoration: underline !important; /* Nur beim Hovern unterstreichen */
                }
                .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
                    border-bottom-color: #eaecef !important;
                    color: #24292e !important;
                }
                .markdown-body hr { background-color: #e1e4e8 !important; }
                .markdown-body blockquote {
                    color: #6a737d !important;
                    border-left-color: #dfe2e5 !important;
                }
                .markdown-body table th, .markdown-body table td { border: 1px solid #dfe2e5 !important; }
                .markdown-body code:not(pre code) { /* Inline code */
                    background-color: rgba(27,31,35,.07) !important;
                    border: 1px solid rgba(27,31,35,.1) !important;
                    color: #24292e !important;
                }
                .markdown-body pre { /* Code block */
                    background-color: #f6f8fa !important;
                    border: 1px solid #eaecef !important;
                }
                 .markdown-body pre code {
                    color: #24292e !important;
                }
                .markdown-body kbd {
                    background-color: #fafbfc !important;
                    border: 1px solid #d1d5da !important;
                    border-bottom-color: #c6cbd1 !important;
                    color: #444d56 !important;
                }
                .markdown-body img { filter: none; }
                
                /* Light Mode Button Styling */
                .custom-play-button {
                    background-color: #f6f8fa !important; /* Heller, subtiler Grauton */
                    color: #24292e !important; /* Dunkle Schrift für hellen Hintergrund */
                    border: 1px solid #d1d5da !important; /* Dezenter Rand */
                }
                .custom-play-button:hover, .custom-play-button:focus {
                    background-color: #e1e4e8 !important; /* Etwas dunkler beim Hover */
                    color: #24292e !important;
                    border-color: #c6cbd1 !important;
                }
                .custom-play-button a {
                    color: #24292e !important; /* Links erben die Button-Textfarbe */
                    text-decoration: none !important;
                }
                .custom-play-button a:hover {
                    color: #24292e !important; /* Auch beim Hover Button-Farbe beibehalten */
                    text-decoration: none !important;
                }
            `;
        }
        addStyleElement(STYLE_ELEMENT_ID_THEME, themeCss);
    }

    // --- MENU COMMANDS ---
    GM_registerMenuCommand('Font: Serif', () => {
        GM_setValue(FONT_STYLE_KEY, 'serif');
        applyFontStyle();
    });

    GM_registerMenuCommand('Font: Sans-serif', () => {
        GM_setValue(FONT_STYLE_KEY, 'sans-serif');
        applyFontStyle();
    });

    GM_registerMenuCommand('Theme: System', () => {
        GM_setValue(THEME_KEY, 'system');
        applyThemeStyle();
    });

    GM_registerMenuCommand('Theme: Light', () => {
        GM_setValue(THEME_KEY, 'light');
        applyThemeStyle();
    });

    GM_registerMenuCommand('Theme: Dark', () => {
        GM_setValue(THEME_KEY, 'dark');
        applyThemeStyle();
    });

    // --- BASE STYLES ---
    function applyBaseStyles() {
        addStyleElement(STYLE_ELEMENT_ID_BASE, `
            body {
                margin: 0;
            }
            .markdown-body {
                box-sizing: border-box;
                min-width: 200px;
                max-width: 980px;
                margin: 0 auto;
                padding: 15px 30px 30px;
            }
            .markdown-body img {
                max-width: 100%; /* Korrigiert von 150% auf 100% */
                height: auto;
                display: block;
                margin-left: auto;
                margin-right: auto;
                border-radius: 3px;
            }
            .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
                margin-top: 1.8em;
                margin-bottom: 0.7em;
                padding-bottom: 0.3em; /* Für die untere Linie */
            }
            .markdown-body h1:hover, .markdown-body h2:hover, .markdown-body h3:hover, .markdown-body h4:hover, .markdown-body h5:hover, .markdown-body h6:hover {
                text-decoration: underline; /* Direkte Unterstreichung der Überschriften beim Hovern */
            }
            .markdown-body h1 { font-size: 2.1em; }
            .markdown-body h2 { font-size: 1.7em; }
            .markdown-body h3 { font-size: 1.4em; }
            .markdown-body h4 { font-size: 1.2em; }
            .markdown-body h5 { font-size: 1.05em; }
            .markdown-body h6 { font-size: 0.9em; }

            /* Code font family (colors/backgrounds are in theme) */
            .markdown-body code, .markdown-body kbd, .markdown-body samp, .markdown-body pre {
                font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
                font-size: 0.9em; /* Etwas kleiner für bessere Lesbarkeit im Fließtext */
            }
            .markdown-body pre {
                padding: 16px;
                overflow: auto;
                border-radius: 6px;
                line-height: 1.45;
            }
            .markdown-body code:not(pre code) { /* Inline code */
                padding: .2em .4em;
                margin: 0 .2em; /* Kleiner horizontaler Abstand */
                font-size: 88%; /* Relativ zur umgebenden Schriftgröße */
                border-radius: 3px;
            }
            .markdown-body kbd {
                padding: .2em .4em;
                margin: 0 .2em;
                font-size: 88%;
                border-radius: 3px;
            }
            .markdown-body ul, .markdown-body ol {
                padding-left: 2em; /* Standardeinzug für Listen */
            }
            .markdown-body table {
                display: block; /* Für Responsivität und Overflow */
                width: max-content; /* Passt sich dem Inhalt an, aber nicht breiter als Container */
                max-width: 100%;
                overflow: auto; /* Scrollbar bei Bedarf */
                border-spacing: 0;
                border-collapse: collapse;
                margin-top: 1em;
                margin-bottom: 1em;
            }
            .markdown-body table th, .markdown-body table td {
                padding: 6px 13px;
            }
            .markdown-body blockquote {
                margin-left: 0; /* Standard-Blockquote-Styling */
                margin-right: 0;
                padding: 0 1em; /* Innenabstand */
            }
            @media (max-width: 767px) {
                .markdown-body {
                    padding: 20px 15px 15px;
                }
                .markdown-body h1 { font-size: 1.8em; }
                .markdown-body h2 { font-size: 1.5em; }
                .markdown-body h3 { font-size: 1.3em; }
            }

            /* Custom Button Base Style */
            .custom-play-button {
                display: inline-block;
                padding: 10px 18px;
                text-decoration: none !important;
                border-radius: 5px;
                border: none;
                font-family: "Segoe UI", "SF Pro Text", "Helvetica Neue", "Ubuntu", "Arial", sans-serif;
                font-size: 0.95em;
                font-weight: 500;
                text-align: center;
                cursor: pointer;
                margin: 8px 0;
                transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
            }
            .custom-play-button a {
                color: inherit !important;
                text-decoration: none !important;
            }
        `);
    }

    // --- MAIN SCRIPT EXECUTION ---
    function initializeViewer() {
        applyBaseStyles();
        applyThemeStyle();
        applyFontStyle();

        // Listener für System-Theme-Änderungen
        if (GM_getValue(THEME_KEY, 'system') === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.removeEventListener('change', applyThemeStyle); // Vorsichtshalber entfernen
            mediaQuery.addEventListener('change', applyThemeStyle);
        }

        const markdownBodyDiv = document.createElement('div');
        markdownBodyDiv.className = 'markdown-body';

        // Überprüfen, ob marked durch @require geladen wurde
        if (typeof marked === 'undefined' || typeof marked.parse !== 'function') {
            console.error("Markdown Viewer: Marked.js library not loaded correctly via @require or 'parse' function is missing.");
            console.error("Markdown Viewer: typeof marked:", typeof marked);
            if (typeof marked !== 'undefined') {
                console.error("Markdown Viewer: marked properties:", Object.keys(marked));
                console.error("Markdown Viewer: typeof marked.parse:", typeof marked.parse);
            }
            markdownBodyDiv.innerHTML = `<p style="color:red; font-family:sans-serif;">Error: Marked.js library could not be loaded. Check console for details.</p>`;
            document.body.innerHTML = ''; // Vorhandenen Inhalt löschen
            document.body.appendChild(markdownBodyDiv);
            return;
        }

        try {
            let markdownContentToParse = "";
            if (document.contentType === 'text/markdown' ||
                (location.protocol === 'file:' && document.body && document.body.children.length === 1 && document.body.firstChild.tagName === 'PRE')) {
                markdownContentToParse = document.body.firstChild.innerText;
            } else if (document.body && document.body.innerText) {
                markdownContentToParse = document.body.innerText;
            } else if (document.body && document.body.textContent) {
                 markdownContentToParse = document.body.textContent;
            }

            const renderer = new marked.Renderer();
            const originalLinkRenderer = renderer.link;

            renderer.link = (href, title, text) => {
                const buttonPattern = /^\s*<kbd>\s*<br>\s*➡️ Play it right now in your browser\s*<br>\s*<\/kbd>\s*$/i;

                if (buttonPattern.test(text)) {
                    const buttonText = "➡️ Play it right now in your browser";
                    return `<a href="${href}" ${title ? `title="${title}"` : ''} class="custom-play-button" target="_blank" rel="noopener noreferrer">${buttonText}</a>`;
                }
                return originalLinkRenderer.call(renderer, href, title, text);
            };

            marked.use({ renderer });

            const htmlContent = marked.parse(markdownContentToParse);

            document.body.innerHTML = '';
            document.body.appendChild(markdownBodyDiv);
            markdownBodyDiv.innerHTML = htmlContent;

        } catch (e) {
            console.error("Markdown Viewer: Error during Markdown parsing:", e);
            markdownBodyDiv.innerHTML = `<p style="color:red; font-family:sans-serif;">Error rendering Markdown: ${e.message}. Check console for details.</p>`;
            if (!document.body.contains(markdownBodyDiv)) {
                 document.body.innerHTML = '';
                 document.body.appendChild(markdownBodyDiv);
            }
        }
    }

    // Stelle sicher, dass das DOM bereit ist, bevor es manipuliert wird
    if (document.readyState === "complete" || document.readyState === "interactive") {
        initializeViewer();
    } else {
        document.addEventListener("DOMContentLoaded", initializeViewer);
    }

})();
