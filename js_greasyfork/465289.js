// ==UserScript==
// @name            Copy Markdown Quote Alt+C
// @name:zh         Alt+C 复制Markdown格式标题和地址快速分享
// @name:en         Alt+C Copy Title and Link as Markdown Style
// @name:ar         Alt+C نسخ العنوان والرابط بتنسيق Markdown
// @name:es         Alt+C Copiar Título y Enlace en Formato Markdown
// @name:fr         Alt+C Copier le Titre et le Lien au Format Markdown
// @name:ru         Alt+C Копировать Заголовок и Ссылку в Формате Markdown
// @description     Press Alt+C to copy title and url as markdown style link `> ${SELECTION} [${TITLE}]( ${URL} )`
// @description:zh  按 Alt+C 复制 Markdown 格式的链接 `> ${SELECTION} [${TITLE}]( ${URL} )`
// @description:ar  اضغط Alt+C لنسخ العنوان والرابط بتنسيق Markdown `> ${SELECTION} [${TITLE}]( ${URL} )`
// @description:es  Presiona Alt+C para copiar título y URL como enlace en formato Markdown `> ${SELECTION} [${TITLE}]( ${URL} )`
// @description:fr  Appuyez sur Alt+C pour copier le titre et l'URL comme lien au format Markdown `> ${SELECTION} [${TITLE}]( ${URL} )`
// @description:ru  Нажмите Alt+C для копирования заголовка и URL как ссылки в формате Markdown `> ${SELECTION} [${TITLE}]( ${URL} )`
// @namespace       https://userscript.snomiao.com/
// @version         0.8.5
// @author          snomiao@gmail.com
// @supportURL      https://github.com/snomiao/copy-markdown-title-alt-c.user.js
// @homepageURL     https://github.com/snomiao/copy-markdown-title-alt-c.user.js
// @match           *://*/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/465289/Copy%20Markdown%20Quote%20Alt%2BC.user.js
// @updateURL https://update.greasyfork.org/scripts/465289/Copy%20Markdown%20Quote%20Alt%2BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize the script
    function init() {
        // Store cleanup function globally to allow re-initialization
        if (window.copyMarkdownQuoteCleanup) {
            window.copyMarkdownQuoteCleanup();
        }

        // Register the Alt+C hotkey
        window.copyMarkdownQuoteCleanup = registerHotkey('Alt+C', handleCopyMarkdown);
    }

    // Register a hotkey combination
    function registerHotkey(combination, callback) {
        const normalizedCombo = normalizeHotkeyCombination(combination);
        
        function keydownHandler(event) {
            if (isHotkeyMatch(event, normalizedCombo)) {
                event.preventDefault();
                event.stopPropagation();
                callback(event);
            }
        }

        document.addEventListener('keydown', keydownHandler, true);

        // Return cleanup function
        return function cleanup() {
            document.removeEventListener('keydown', keydownHandler, true);
        };
    }

    // Normalize hotkey combination string
    function normalizeHotkeyCombination(combo) {
        const parts = combo.toLowerCase().split('+').map(s => s.trim());
        const modifiers = {
            ctrl: false,
            alt: false,
            shift: false,
            meta: false
        };
        let key = '';

        parts.forEach(part => {
            switch(part) {
                case 'ctrl':
                case 'control':
                    modifiers.ctrl = true;
                    break;
                case 'alt':
                    modifiers.alt = true;
                    break;
                case 'shift':
                    modifiers.shift = true;
                    break;
                case 'meta':
                case 'cmd':
                case 'command':
                case 'win':
                case 'windows':
                    modifiers.meta = true;
                    break;
                default:
                    key = part;
            }
        });

        return { modifiers, key };
    }

    // Check if keyboard event matches the hotkey combination
    function isHotkeyMatch(event, combo) {
        const keyMatches = event.key.toLowerCase() === combo.key.toLowerCase();
        const modifiersMatch = 
            event.ctrlKey === combo.modifiers.ctrl &&
            event.altKey === combo.modifiers.alt &&
            event.shiftKey === combo.modifiers.shift &&
            event.metaKey === combo.modifiers.meta;

        return keyMatches && modifiersMatch;
    }

    // Handle the copy markdown action
    async function handleCopyMarkdown() {
        try {
            // Get selected text if any
            const selectedText = window.getSelection().toString().trim();
            
            // Format selected text as markdown quote
            const quotedText = selectedText ? 
                selectedText.split('\n').map(line => `> ${line}`).join('\n') : 
                '';

            // Get the best title for the page
            const title = getBestPageTitle();
            
            // Escape special markdown characters in title
            const escapedTitle = title.replace(/([[\]|])/g, '\\$1');
            
            // Get current URL
            const url = window.location.href;

            // Build the markdown content
            const markdownContent = quotedText ? 
                `- [${escapedTitle}]( ${url} )\n${quotedText}` :
                `- [${escapedTitle}]( ${url} )`;

            // Copy to clipboard
            await copyToClipboard(markdownContent);

            // Show success notification
            showNotification(`Copied:\n${markdownContent}`);

        } catch (error) {
            console.error('Failed to copy markdown:', error);
            showNotification('Failed to copy to clipboard. Please check permissions.');
        }
    }

    // Get the best title for the current page
    function getBestPageTitle() {
        const candidates = [
            document.title,
            document.querySelector('h1')?.innerText || ''
        ];

        // Clean up titles (remove line breaks)
        const cleanedCandidates = candidates.map(title => 
            title.replace(/\r?\n.*/g, '').trim()
        );

        // Return the longest title (usually more descriptive)
        return cleanedCandidates.sort((a, b) => b.length - a.length)[0] || 'Untitled';
    }

    // Copy text to clipboard
    async function copyToClipboard(text) {
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }

    // Show notification to user
    function showNotification(message) {
        // Use alert for simple notification
        // Could be enhanced with a custom toast notification in the future
        alert(message);
    }

    // Start the script
    init();
})();