// ==UserScript==
// @name         Enhanced YouTube Transcript Extractor with Lucide Icons
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Extract YouTube video transcripts with enhanced features, UI, and Lucide icons
// @author       Sarah Wilkerson
// @match        https://www.youtube.com/watch*
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/524070/Enhanced%20YouTube%20Transcript%20Extractor%20with%20Lucide%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/524070/Enhanced%20YouTube%20Transcript%20Extractor%20with%20Lucide%20Icons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global state
    let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let container, toolbar, transcriptArea;

    // Styles and constants
    const STYLES = {
        // Colors
        PRIMARY_COLOR: '#3b82f6',
        SECONDARY_COLOR: '#60a5fa',
        HOVER_COLOR: '#2563eb',
        BUTTON_BG: '#f8fafc',
        BUTTON_BG_DARK: '#1e293b',
        TEXT_COLOR: '#0f172a',
        TEXT_COLOR_DARK: '#e2e8f0',
        BORDER_COLOR: '#e2e8f0',
        BORDER_COLOR_DARK: '#334155',
        TOAST_BG: 'rgba(59, 130, 246, 0.95)',

        // Typography
        FONT_FAMILY: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        FONT_SIZE_SMALL: '13px',
        FONT_SIZE_BASE: '14px',
        FONT_SIZE_LARGE: '15px',
        LINE_HEIGHT: '1.6',
        FONT_WEIGHTS: {
            NORMAL: '400',
            MEDIUM: '500',
            SEMI_BOLD: '600'
        },

        // Transcript Styling
        TRANSCRIPT_FONT: `'SF Pro Text', -apple-system, BlinkMacSystemFont,
                     'Segoe UI', Roboto, 'Helvetica Neue',
                     system-ui, sans-serif`,
        TRANSCRIPT_STYLES: {
            fontSize: '15px',
            lineHeight: '1.6',
            letterSpacing: '0.01em',
            fontWeight: '400'
        },

        // Transcript Button
        TRANSCRIPT_BUTTON: {
            backgroundColor: '#3b82f6',
            color: '#eef2ff',
            padding: '8px 16px',
            fontSize: '20px',
            fontWeight: '700',
            borderRadius: '20px',
            border: '1px solid #3b82f6',
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.25)',
            transition: 'all 0.2s ease',
            hoverBg: '#eef2ff',
            hoverColor: '#3b82f6',
            hoverShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
            hoverTransform: 'translateY(-1px)'
        },

        // Container & Toolbar
        CONTAINER: {
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            background: '#ffffff',
            darkBackground: '#1e293b',
            border: '1px solid rgba(226, 232, 240, 0.1)'
        },

        TOOLBAR: {
            padding: '24px',  // Increased padding
            headerGradientLight: 'linear-gradient(to right, #EEF2FF, #E0E7FF)', // Light mode gradient
            headerGradientDark: 'linear-gradient(to right, #111827, #1F2937)', // Dark mode gradient
            buttonShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            buttonHoverShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            statusBadgeBg: 'rgba(59, 130, 246, 0.1)',
            statusBadgeText: '#3B82F6'
        },

        // Button styles
        BUTTON_STYLES: {
            padding: '8px 16px',
            gap: '8px',
            borderRadius: '20px',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            hoverTransform: 'translateY(-1px)',
            hoverShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },

        // Layout
        BORDER_RADIUS: '12px',
        BUTTON_RADIUS: '8px',
        BOX_SHADOW: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        BUTTON_SHADOW: '0 1px 3px rgba(0, 0, 0, 0.1)',
        HOVER_TRANSFORM: 'translateY(-1px)',
        TRANSITION: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',

        // Dimensions
        TRANSCRIPT_HEIGHT: '400px',
        TRANSCRIPT_MAX_WIDTH: '400px',
        BUTTON_PADDING: '8px 12px',
        TOOLBAR_PADDING: '16px'
    };

    // Debug Log
    function debugLog(message) {
        console.log(`[YT Transcript Debug] ${message}`);
    }

    // Flag Management Functions
    function setTranscriptFlag() {
        GM_setValue('transcriptFlag', true);
    }

    function clearTranscriptFlag() {
        GM_setValue('transcriptFlag', false);
    }

    function isTranscriptFlagSet() {
        return GM_getValue('transcriptFlag', false);
    }

    // Shared utilities (used by both YouTube and ChatGPT pages)
    function showToast(message, duration = 2000) {
        console.log('Showing toast:', message);
        const toast = document.createElement('div');
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            padding: '8px 16px',
            backgroundColor: STYLES.TOAST_BG,
            color: '#ffffff',
            borderRadius: STYLES.BUTTON_RADIUS,
            zIndex: '9999999',
            transition: 'opacity 0.3s',
            opacity: '0',
            fontFamily: STYLES.FONT_FAMILY,
            boxShadow: STYLES.BOX_SHADOW,
            fontSize: STYLES.FONT_SIZE_BASE
        });

        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.style.opacity = '1');

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);

        if (typeof GM_notification !== 'undefined') {
            GM_notification({
                text: message,
                timeout: duration
            });
        }
    }

    // Theme management
    function getCurrentTheme() {
        return {
            bg: isDarkMode ? STYLES.CONTAINER.darkBackground : STYLES.CONTAINER.background,
            text: isDarkMode ? STYLES.TEXT_COLOR_DARK : STYLES.TEXT_COLOR,
            border: isDarkMode ? STYLES.BORDER_COLOR_DARK : STYLES.BORDER_COLOR,
            buttonBg: isDarkMode ? STYLES.BUTTON_BG_DARK : STYLES.BUTTON_BG
        };
    }

    function updateTheme() {
        const theme = getCurrentTheme();

        if (!container || !toolbar || !transcriptArea) return;

        // Update container
        container.style.backgroundColor = theme.bg;
        container.style.color = theme.text;

        // Update toolbar
        toolbar.style.backgroundColor = theme.bg;
        toolbar.style.borderColor = theme.border;

        // Update transcript area
        transcriptArea.style.backgroundColor = theme.bg;
        transcriptArea.style.color = theme.text;

        // Update buttons
        Array.from(toolbar.querySelectorAll('button')).forEach(btn => {
            if (!btn.dataset.primary) {
                btn.style.backgroundColor = theme.buttonBg;
                btn.style.color = theme.text;
            }
        });
    }

    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        updateTheme();
        showToast(`${isDarkMode ? 'Dark' : 'Light'} mode enabled`);
    }

    // Create Icon using createElementNS
    function createIcon(name) {
        const iconContainer = document.createElement('div');

        // Define Lucide SVG icons as nested objects
        const ICONS = {
            Moon: {
                tag: 'svg',
                attrs: {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "18",
                    height: "18",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                },
                children: [
                    { tag: 'path', attrs: { d: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" } }
                ]
            },
            ChevronDown: {
                tag: 'svg',
                attrs: {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "18",
                    height: "18",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                },
                children: [
                    { tag: 'polyline', attrs: { points: "6 9 12 15 18 9" } }
                ]
            },
            ExternalLink: {
                tag: 'svg',
                attrs: {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "18",
                    height: "18",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                },
                children: [
                    { tag: 'path', attrs: { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" } },
                    { tag: 'polyline', attrs: { points: "15 3 21 3 21 9" } },
                    { tag: 'line', attrs: { x1: "10", y1: "14", x2: "21", y2: "3" } }
                ]
            },
            Copy: {
                tag: 'svg',
                attrs: {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "18",
                    height: "18",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                },
                children: [
                    { tag: 'rect', attrs: { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" } },
                    { tag: 'path', attrs: { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" } }
                ]
            },
            Minimize2: { // Updated icon name and SVG
                tag: 'svg',
                attrs: {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "18",
                    height: "18",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                },
children: [
    {
      tag: 'polyline',
      attrs: {
        points: "4 14 10 14 10 20"
      }
    },
    {
      tag: 'polyline',
      attrs: {
        points: "20 10 14 10 14 4"
      }
    },
    {
      tag: 'line',
      attrs: {
        x1: "14",
        y1: "10",
        x2: "21",
        y2: "3"
      }
    },
    {
      tag: 'line',
      attrs: {
        x1: "3",
        y1: "21",
        x2: "10",
        y2: "14"
      }
    }
  ]
},
            X: {
                tag: 'svg',
                attrs: {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "18",
                    height: "18",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                },
                children: [
                    { tag: 'line', attrs: { x1: "18", y1: "6", x2: "6", y2: "18" } },
                    { tag: 'line', attrs: { x1: "6", y1: "6", x2: "18", y2: "18" } }
                ]
            }
        };

        if (ICONS[name]) {
            const svgData = ICONS[name];
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, svgData.tag);

            // Set SVG attributes
            for (let [attr, value] of Object.entries(svgData.attrs)) {
                svg.setAttribute(attr, value);
            }

            // Create and append child elements
            svgData.children.forEach(child => {
                const childElement = document.createElementNS(svgNS, child.tag);
                for (let [attr, value] of Object.entries(child.attrs)) {
                    childElement.setAttribute(attr, value);
                }
                svg.appendChild(childElement);
            });

            // Append the SVG to the container
            iconContainer.appendChild(svg);

            // Style the icon container
            Object.assign(iconContainer.style, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'currentColor'
            });
        } else {
            console.error(`Icon with name "${name}" not found in ICONS.`);
        }

        return iconContainer;
    }

    // Button and UI creation
    function createButton({ text, icon, primary, onClick, title, style = {} }) {
        const btn = document.createElement('button');
        Object.assign(btn.style, {
            padding: STYLES.BUTTON_PADDING,
            border: 'none',
            borderRadius: STYLES.BUTTON_RADIUS,
            backgroundColor: primary ? STYLES.PRIMARY_COLOR : getCurrentTheme().buttonBg,
            color: primary ? '#fff' : (isDarkMode ? STYLES.TEXT_COLOR_DARK : STYLES.TEXT_COLOR),
            fontSize: STYLES.FONT_SIZE_BASE,
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: STYLES.BUTTON_SHADOW,
            ...style
        });

        // Add hover effects
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = primary ? STYLES.HOVER_COLOR : darken(getCurrentTheme().buttonBg, 0.1);
            btn.style.transform = STYLES.HOVER_TRANSFORM;
            btn.style.boxShadow = STYLES.BOX_SHADOW;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = primary ? STYLES.PRIMARY_COLOR : getCurrentTheme().buttonBg;
            btn.style.transform = 'none';
            btn.style.boxShadow = STYLES.BUTTON_SHADOW;
        });

        if (icon) {
            const iconElement = createIcon(icon);
            btn.appendChild(iconElement);
        }

        if (text) {
            const textEl = document.createElement('span');
            textEl.textContent = text;
            btn.appendChild(textEl);
        }

        if (title) {
            btn.title = title;
        }

        if (onClick) {
            btn.addEventListener('click', onClick);
        }

        return btn;
    }

    function darken(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
        const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - amount)));
        const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - amount)));
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }

    // Toolbar creation with two rows
    function createToolbar() {
        toolbar = document.createElement('div');
        Object.assign(toolbar.style, {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',  // Increased gap between rows
            padding: STYLES.TOOLBAR.padding,
            backgroundImage: isDarkMode ?
                STYLES.TOOLBAR.headerGradientDark :
                STYLES.TOOLBAR.headerGradientLight,
            borderBottom: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
            transition: 'all 0.2s ease'
        });

        // Top Row
        const topRow = document.createElement('div');
        Object.assign(topRow.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: '12px'
        });

        // Transcript Button with Ready Badge
        const transcriptContainer = document.createElement('div');
        Object.assign(transcriptContainer.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        });

        const title = document.createElement('span');
        title.textContent = 'Enhanced Transcript';
        Object.assign(title.style, {
            fontWeight: '600',
            fontSize: '20px',  // Slightly larger
            color: isDarkMode ? '#F3F4F6' : '#111827',
            letterSpacing: '-0.01em'
        });



        const readyBadge = document.createElement('span');
        readyBadge.textContent = 'Ready';
        Object.assign(readyBadge.style, {
            padding: '2px 6px',
            backgroundColor: STYLES.TOOLBAR.statusBadgeBg,
            color: STYLES.TOOLBAR.statusBadgeText,
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500'
        });

        transcriptContainer.appendChild(title);
        transcriptContainer.appendChild(readyBadge);
        topRow.appendChild(transcriptContainer);

        // Dark Mode Button
        const darkModeBtn = createButton({
            icon: 'Moon',
            title: 'Toggle Dark Mode',
            onClick: toggleDarkMode,
            style: {
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'white',
                boxShadow: STYLES.TOOLBAR.buttonShadow,
                minWidth: '36px',
                display: 'flex',
                justifyContent: 'center'
            }
        });

        // Minimize Button
        const minimizeBtn = createButton({
            icon: 'Minimize2',
            title: 'Minimize',
            onClick: toggleMinimize,
            style: {
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'white',
                boxShadow: STYLES.TOOLBAR.buttonShadow,
                minWidth: '36px',
                display: 'flex',
                justifyContent: 'center'
            }
        });

        // Close Button
        const closeBtn = createButton({
            icon: 'X',
            title: 'Close',
            onClick: () => {
                container.remove();
                container = null;
                toolbar = null;
                transcriptArea = null;
            },
            style: {
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'white',
                boxShadow: STYLES.TOOLBAR.buttonShadow,
                minWidth: '36px',
                display: 'flex',
                justifyContent: 'center'
            }
        });

        topRow.appendChild(darkModeBtn);
        topRow.appendChild(minimizeBtn);
        topRow.appendChild(closeBtn);

        // Second Row
        const secondRow = document.createElement('div');
        Object.assign(secondRow.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
            flexWrap: 'wrap'
        });

        // Export Button
        const exportBtn = createButton({
            text: 'Export',
            icon: 'ChevronDown',
            title: 'Export Transcript',
            onClick: (e) => showExportMenu(e.target),
            style: {
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'white',
                boxShadow: STYLES.TOOLBAR.buttonShadow
            }
        });

        // ChatGPT Button
        const chatGPTBtn = createButton({
            text: 'ChatGPT',
            icon: 'ExternalLink',
            title: 'Open in ChatGPT',
            onClick: () => openInChatGPT(transcriptArea.value),
            style: {
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: '#3B82F6',
                color: 'white',
                boxShadow: STYLES.TOOLBAR.buttonShadow
            }
        });

        // Copy Button
        const copyBtn = createButton({
            text: 'Copy',
            icon: 'Copy',
            title: 'Copy to Clipboard',
            onClick: copyToClipboard,
            style: {
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'white',
                boxShadow: STYLES.TOOLBAR.buttonShadow
            }
        });

        secondRow.appendChild(exportBtn);
        secondRow.appendChild(chatGPTBtn);
        secondRow.appendChild(copyBtn);

        toolbar.appendChild(topRow);
        toolbar.appendChild(secondRow);

        return toolbar;
    }

    // Export functionality
    function showExportMenu(btn) {
        const menu = document.createElement('div');
        Object.assign(menu.style, {
            position: 'absolute',
            backgroundColor: getCurrentTheme().bg,
            border: `1px solid ${getCurrentTheme().border}`,
            borderRadius: STYLES.BORDER_RADIUS,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '9999',
            overflow: 'hidden',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            background: getCurrentTheme().bg.replace(')', ', 0.95)')
        });

        const formats = [
            { label: 'Plain Text (.txt)', ext: '.txt' },
            { label: 'Markdown (.md)', ext: '.md' },
            { label: 'Word (.docx)', ext: '.docx' }
        ];

        formats.forEach(format => {
            const item = document.createElement('div');
            Object.assign(item.style, {
                padding: '8px 16px',
                cursor: 'pointer',
                color: getCurrentTheme().text,
                transition: STYLES.TRANSITION,
                whiteSpace: 'nowrap'
            });
            item.textContent = format.label;

            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = getCurrentTheme().buttonBg;
            });

            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'transparent';
            });

            item.addEventListener('click', () => {
                exportTranscript(format.ext);
                menu.remove();
            });

            menu.appendChild(item);
        });

        // Position the menu below the button
        const rect = btn.getBoundingClientRect();
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.left = `${rect.left}px`;

        document.body.appendChild(menu);

        // Close menu when clicking outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 0);
    }

    function exportTranscript(ext) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const videoId = new URLSearchParams(window.location.search).get('v') || 'video';
        const filename = `youtube-transcript-${videoId}-${timestamp}${ext}`;
        const text = transcriptArea.value;

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(`Exported as ${ext}`);
    }

    // Transcript manipulation
    function formatTranscript(text) {
        const lines = text.split('\n');
        const processedLines = [];
        let currentParagraph = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (!line) continue;

            const content = line.replace(/^\d{1,2}:\d{2}(?::\d{2})?\s*/, '').trim();

            if (content) {
                if (i > 0 && (
                    content.startsWith('-') ||
                    content.startsWith('>') ||
                    lines[i-1].trim().endsWith('.') ||
                    lines[i-1].trim().endsWith('!') ||
                    lines[i-1].trim().endsWith('?')
                )) {
                    if (currentParagraph.length > 0) {
                        processedLines.push(currentParagraph.join(' '));
                        currentParagraph = [];
                    }
                }

                currentParagraph.push(content);
            }
        }

        if (currentParagraph.length > 0) {
            processedLines.push(currentParagraph.join(' '));
        }

        console.log('Formatting transcript...');
        return processedLines.join('\n\n').trim();
    }

    // Utility functions
    function copyToClipboard() {
        transcriptArea.select();
        document.execCommand('copy');
        showToast('Copied to clipboard!');
    }

    function toggleMinimize() {
        const isVisible = transcriptArea.style.display !== 'none';
        transcriptArea.style.display = isVisible ? 'none' : 'block';
        container.style.backgroundColor = isVisible ? 'transparent' : getCurrentTheme().bg;
        showToast(isVisible ? 'Minimized' : 'Expanded');
    }

    // Replace the openInChatGPT function
    // ChatGPT Button Modified
    function openInChatGPT(text) {
        debugLog('Opening in ChatGPT...');

        if (!text) {
            debugLog('No text provided');
            showToast('No transcript to send to ChatGPT');
            return;
        }

        // Set the flag to indicate that the transcript is ready to be processed in ChatGPT
        setTranscriptFlag();

       const prompt = `Please provide a comprehensive analysis of this video transcript, focusing on extracting detailed, implementable insights:

## Core Concepts & Frameworks
[Extract and explain in detail:]
- Major concepts, theories, and frameworks presented
- Specific examples and case studies shared
- Limitations and caveats discussed
- Relationships between different concepts
- Underlying principles and assumptions

## Detailed Implementation Guide
[Document specific steps and considerations:]
- Step-by-step breakdown of each technique/method
- Decision points and parameters to consider
- Required tools, resources, and prerequisites
- Implementation examples and variations
- Common pitfalls and their solutions
- Edge cases and how to handle them

## Expert Tips & Insights
[Capture specialized knowledge:]
- Advanced techniques and optimization strategies
- Context-specific recommendations
- Non-obvious insights and counterintuitive findings
- Expert shortcuts and efficiency improvements
- Situation-specific modifications
- Problem-solving approaches

## Deep Dive Analysis
[For each major topic/segment:]
- Detailed breakdown of key points
- Specific examples and illustrations
- Technical details and specifications
- Questions addressed and solutions provided
- Areas of uncertainty or debate
- Practice considerations

## Application Scenarios
[Document practical applications:]
- Specific use cases and examples
- Real-world implementations discussed
- Industry-specific considerations
- Problem-solving frameworks demonstrated
- Adaptation guidelines for different contexts
- Success metrics and evaluation methods

## Technical Reference
[Capture specific technical information:]
- Tools and technologies mentioned
- Technical specifications and parameters
- Relevant metrics and benchmarks
- External resources and references
- Important terminology and definitions
- Integration considerations

## Key Demonstrations & Exchanges
[Document practical examples:]
- Step-by-step demonstration breakdowns
- Important Q&A exchanges
- Troubleshooting guidance
- Specific scenarios analyzed
- Solution variations discussed

Please provide exhaustive detail for each section, prioritizing depth and actionability. Focus on capturing information that would enable practical implementation without requiring reference to the original video.

Transcript:
${text}`;
        debugLog('Preparing transcript data...');

        // Store transcript data
        try {
            localStorage.setItem('yt-transcript-text', prompt);
            sessionStorage.setItem('yt-transcript-text', prompt);
            const timestamp = Date.now();
            localStorage.setItem('yt-transcript-timestamp', timestamp.toString());
            sessionStorage.setItem('yt-transcript-timestamp', timestamp.toString());
            debugLog('Successfully stored transcript data');

            // Use GM_setValue as backup
            GM_setValue('yt-transcript-text', prompt);
            GM_setValue('yt-transcript-timestamp', timestamp.toString());
            debugLog('Successfully stored in GM_setValue');

            // Copy to clipboard as additional backup
            navigator.clipboard.writeText(prompt).then(() => {
                debugLog('Backup: Copied to clipboard');
            }).catch(err => {
                debugLog(`Clipboard backup failed: ${err.message}`);
            });

            debugLog('Opening ChatGPT window...');
            window.open('https://chat.openai.com', '_blank');
            showToast('Opening ChatGPT...', 2000);

        } catch (err) {
            debugLog(`Storage error: ${err.message}`);
            showToast('Error with storage, falling back to clipboard', 3000);

            // Fallback to clipboard only
            navigator.clipboard.writeText(prompt)
                .then(() => {
                    debugLog('Fallback: Copied to clipboard');
                    showToast('Transcript copied to clipboard. Please paste in ChatGPT.', 4000);
                    window.open('https://chat.openai.com', '_blank');
                })
                .catch(clipErr => {
                    debugLog(`All methods failed. Clipboard error: ${clipErr.message}`);
                    showToast('Error preparing transcript. Please try again.', 3000);
                });
        }
    }

    function simulateClick(element) {
        if (element) {
            element.click();
            return true;
        }
        return false;
    }

    function clearExistingElements() {
        ['customTranscriptArea', 'customControlPanel', 'customExtractTranscriptBtn'].forEach(id => {
            document.getElementById(id)?.remove();
        });
        container = null;
        toolbar = null;
        transcriptArea = null;
    }

    // Core functionality
    function showTranscriptBox(transcript) {
        clearExistingElements();

        const youtubeContentArea = document.querySelector('#secondary.ytd-watch-flexy') ||
                                 document.querySelector('#secondary-inner');

        if (!youtubeContentArea) {
            showToast('Could not find YouTube content area', 3000);
            return;
        }

        // Create container
        container = document.createElement('div');
        container.id = 'customControlPanel';
        Object.assign(container.style, {
            width: '100%',
            maxWidth: STYLES.TRANSCRIPT_MAX_WIDTH,
            backgroundColor: isDarkMode ? STYLES.CONTAINER.darkBackground : STYLES.CONTAINER.background,
            borderRadius: STYLES.CONTAINER.borderRadius,
            boxShadow: STYLES.CONTAINER.boxShadow,
            fontFamily: STYLES.FONT_FAMILY,
            marginBottom: '16px',
            overflow: 'hidden',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #777777'
        });

        // Create toolbar
        toolbar = createToolbar();
        container.appendChild(toolbar);

        // Create transcript area
        transcriptArea = document.createElement('textarea');
        transcriptArea.id = 'customTranscriptArea';
        Object.assign(transcriptArea.style, {
            width: '100%',
            height: STYLES.TRANSCRIPT_HEIGHT,
            padding: '16px',
            border: 'none',
            background: getCurrentTheme().bg,
            color: getCurrentTheme().text,
            overflowY: 'auto',
            resize: 'vertical',
            boxSizing: 'border-box',
            fontFamily: STYLES.TRANSCRIPT_FONT,
            fontSize: STYLES.TRANSCRIPT_STYLES.fontSize,
            lineHeight: STYLES.TRANSCRIPT_STYLES.lineHeight,
            letterSpacing: STYLES.TRANSCRIPT_STYLES.letterSpacing,
            fontWeight: STYLES.TRANSCRIPT_STYLES.fontWeight
        });

        transcriptArea.value = formatTranscript(transcript); // Auto-format by default
        transcriptArea.readOnly = true;
        container.appendChild(transcriptArea);

        // Insert into YouTube page
        youtubeContentArea.insertBefore(container, youtubeContentArea.firstChild);
        updateTheme();

        // Add keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    function handleKeyboardShortcuts(e) {
        if (!container) return;

        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 'c':
                    if (window.getSelection().toString()) return; // Let normal copy work
                    e.preventDefault();
                    copyToClipboard();
                    break;
                case 'e':
                    e.preventDefault();
                    showExportMenu(document.querySelector('[title="Export Transcript"]'));
                    break;
                case 'f':
                    e.preventDefault();
                    transcriptArea.value = formatTranscript(transcriptArea.value);
                    showToast('Transcript formatted');
                    break;
                case 'm':
                    e.preventDefault();
                    toggleMinimize();
                    break;
            }
        } else if (e.key === 'Escape') {
            container.remove();
            container = null;
            toolbar = null;
            transcriptArea = null;
            document.removeEventListener('keydown', handleKeyboardShortcuts);
        }
    }

    function extractTranscript() {
        const showTranscriptButton = document.querySelector('button[aria-label="Show transcript"]');
        if (simulateClick(showTranscriptButton)) {
            setTimeout(() => {
                const segments = document.querySelectorAll('.segment-text.ytd-transcript-segment-renderer');
                if (segments.length === 0) {
                    showToast('No transcript found', 3000);
                    return;
                }
                const transcript = Array.from(segments)
                    .map(segment => segment.textContent.trim())
                    .join('\n');
                showTranscriptBox(transcript);
            }, 1000);
        } else {
            showToast('Could not find transcript button', 3000);
        }
    }

    // Replace the existing addExtractButton function
    function addExtractButton() {
        clearExistingElements();

        // Wait for metadata to be available
        const waitForMetadata = setInterval(() => {
            const metadata = document.querySelector('ytd-watch-metadata');
            if (metadata) {
                clearInterval(waitForMetadata);

                const extractBtn = createButton({
                    text: 'Transcript',
                    title: 'Extract Transcript (Ctrl+Shift+T)',
                    style: {
                        position: 'relative',
                        display: 'inline-block',
                        backgroundColor: STYLES.TRANSCRIPT_BUTTON.backgroundColor,
                        color: STYLES.TRANSCRIPT_BUTTON.color,
                        padding: STYLES.TRANSCRIPT_BUTTON.padding,
                        fontSize: STYLES.TRANSCRIPT_BUTTON.fontSize,
                        fontWeight: STYLES.TRANSCRIPT_BUTTON.fontWeight,
                        borderRadius: STYLES.TRANSCRIPT_BUTTON.borderRadius,
                        border: STYLES.TRANSCRIPT_BUTTON.border,
                        boxShadow: STYLES.TRANSCRIPT_BUTTON.boxShadow,
                        transition: STYLES.TRANSCRIPT_BUTTON.transition,
                        margin: '12px 16px',
                        zIndex: '2001'
                    },
                    onClick: extractTranscript
                });
                // Add hover effects
                extractBtn.addEventListener('mouseenter', () => {
                    extractBtn.style.backgroundColor = STYLES.TRANSCRIPT_BUTTON.hoverBg;
                    extractBtn.style.color = STYLES.TRANSCRIPT_BUTTON.hoverColor;
                    extractBtn.style.boxShadow = STYLES.TRANSCRIPT_BUTTON.hoverShadow;
                    extractBtn.style.transform = STYLES.TRANSCRIPT_BUTTON.hoverTransform;
                });

                extractBtn.addEventListener('mouseleave', () => {
                    extractBtn.style.color = STYLES.TRANSCRIPT_BUTTON.color,
                    extractBtn.style.backgroundColor = STYLES.TRANSCRIPT_BUTTON.backgroundColor;
                    extractBtn.style.boxShadow = STYLES.TRANSCRIPT_BUTTON.boxShadow;
                    extractBtn.style.transform = 'translateY(0)';
                });

                extractBtn.id = 'customExtractTranscriptBtn';

                // Enhanced button container
                const buttonContainer = document.createElement('div');
                Object.assign(buttonContainer.style, {
                    width: '100%',
                    backgroundColor: 'var(--yt-spec-base-background)',
                    borderBottom: '1px solid var(--yt-spec-10-percent-layer)',
                    textAlign: 'left',
                    position: 'relative',
                    zIndex: '2000',
                    padding: '4px 0'
                });

                buttonContainer.appendChild(extractBtn);
                metadata.insertAdjacentElement('beforebegin', buttonContainer);
            }
        }, 500);

        setTimeout(() => clearInterval(waitForMetadata), 10000);
    }

    // Site-specific initialization

    function getStoredTranscript() {
        debugLog('Checking all storage methods...');

        // Check all possible storage locations
        let text = localStorage.getItem('yt-transcript-text') ||
                   sessionStorage.getItem('yt-transcript-text') ||
                   (typeof GM_getValue === 'function' ? GM_getValue('yt-transcript-text') : null);

        let timestamp = localStorage.getItem('yt-transcript-timestamp') ||
                       sessionStorage.getItem('yt-transcript-timestamp') ||
                       (typeof GM_getValue === 'function' ? GM_getValue('yt-transcript-timestamp') : null);

        debugLog(`Found text in storage: ${Boolean(text)}`);
        debugLog(`Found timestamp in storage: ${Boolean(timestamp)}`);

        // Verify timestamp is recent (within last 5 minutes)
        if (text && timestamp) {
            const storedTime = parseInt(timestamp);
            const now = Date.now();
            if (now - storedTime > 5 * 60 * 1000) {
                debugLog('Stored transcript expired');
                // Clear all storage
                localStorage.removeItem('yt-transcript-text');
                sessionStorage.removeItem('yt-transcript-text');
                localStorage.removeItem('yt-transcript-timestamp');
                sessionStorage.removeItem('yt-transcript-timestamp');
                if (typeof GM_setValue === 'function') {
                    GM_setValue('yt-transcript-text', null);
                    GM_setValue('yt-transcript-timestamp', null);
                }
                return null;
            }
            debugLog('Found valid recent transcript');
            return text;
        }
        debugLog('No valid transcript found');
        return null;
    }

    function injectInstructions() {
        debugLog('Injecting instructions');

        // Remove any existing instructions
        document.getElementById('yt-transcript-instructions')?.remove();

        const instructionDiv = document.createElement('div');
        instructionDiv.id = 'yt-transcript-instructions';
        Object.assign(instructionDiv.style, {
            position: 'fixed',
            top: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '10000',
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            maxWidth: '80%',
            textAlign: 'center'
        });

        instructionDiv.textContent = 'Press Command+V (Mac) or Ctrl+V (Windows) to paste the YouTube transcript';
        document.body.appendChild(instructionDiv);

        // Force reflow and show
        instructionDiv.offsetHeight;
        instructionDiv.style.opacity = '1';

        // Remove after delay
        setTimeout(() => {
            instructionDiv.style.opacity = '0';
            setTimeout(() => instructionDiv.remove(), 300);
        }, 8000);
    }

    function handleChatGPTLoad() {
        debugLog('Checking for transcript data...');

        // Only proceed if the transcript flag is set
        if (!isTranscriptFlagSet()) {
            debugLog('Transcript flag is not set, skipping...');
            return;
        }

        const transcriptText = getStoredTranscript();
        debugLog(`Transcript found: ${Boolean(transcriptText)}`);

        if (transcriptText) {
            debugLog('Processing transcript');

            // Clear flag after processing
            clearTranscriptFlag();

            // Clear storage
            localStorage.removeItem('yt-transcript-text');
            sessionStorage.removeItem('yt-transcript-text');
            localStorage.removeItem('yt-transcript-timestamp');
            sessionStorage.removeItem('yt-transcript-timestamp');

            // Copy to clipboard with fallback
            const copyPromise = navigator.clipboard.writeText(transcriptText)
                .catch(err => {
                    debugLog(`Clipboard API failed: ${err}. Trying execCommand...`);
                    const textarea = document.createElement('textarea');
                    textarea.value = transcriptText;
                    document.body.appendChild(textarea);
                    textarea.select();
                    const success = document.execCommand('copy');
                    textarea.remove();
                    if (!success) throw new Error('execCommand copy failed');
                });

            copyPromise.then(() => {
                debugLog('Transcript copied, showing instructions');
                injectInstructions();
            }).catch(err => {
                debugLog(`All copy methods failed: ${err}`);
                // Show instructions anyway
                injectInstructions();
            });
        }
    }

    // Initialization for YouTube Page
    if (window.location.hostname === 'www.youtube.com') {
        console.log('YouTube page detected');

        function initialize() {
            console.log('Initializing YouTube features');
            addExtractButton();

            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    console.log('URL changed, reinitializing...');
                    addExtractButton();
                }
            }).observe(document.body, { subtree: true, childList: true });
        }

        // Initialize YouTube features
        if (document.readyState !== 'loading') {
            initialize();
        } else {
            document.addEventListener('DOMContentLoaded', initialize);
        }

        // Add global shortcut for extract button
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                extractTranscript();
            }
        });
    }

    // Initialization for ChatGPT Page
    if (window.location.hostname === 'chat.openai.com' || window.location.hostname === 'chatgpt.com') {
        console.log('ChatGPT page detected - Starting initialization');

        // Run immediately and set up observers
        handleChatGPTLoad();

        // Set up URL change observer as fallback
        let lastUrl = location.href;
        const urlObserver = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                console.log('URL changed, attempting fallback processing');
                handleChatGPTLoad();
            }
        });
        urlObserver.observe(document.body, { subtree: true, childList: true });

        // Clean up observers after 10 seconds
        setTimeout(() => {
            urlObserver.disconnect();
            console.log('Cleaned up observers');
        }, 10000);
    }
})();
