// ==UserScript==
// @name          AI Studio - Dark Serene Code
// @namespace     http://tampermonkey.net/
// @version       0.4
// @description   aiStudio Hyperminimal Graphite text palette for a modern, clean, and highly readable interface.
// @author        Prosthetic + LLM
// @match         https://aistudio.google.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license       AGPL-3.0
// @grant         GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/539782/AI%20Studio%20-%20Dark%20Serene%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/539782/AI%20Studio%20-%20Dark%20Serene%20Code.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================================================
    //                                          THEME CUSTOMIZATION
    // =================================================================================================================
    // Welcome to the heart of the theme! I've designed this configuration object to be as clear and
    // easy to customize as possible. My goal was to create a "Dark Serene Coder" environment that's
    // easy on the eyes for long sessions, with a modern, minimalist aesthetic.
    // Below, you'll find detailed comments for each property, explaining my choices.
    // Feel free to tweak these values to perfectly match your personal preferences!
    // =================================================================================================================
    const themeConfig = {

        // --- FONTS & SIZES ---
        // I've chosen specific fonts to enhance the "coder" feel while prioritizing readability.
        // "Space Grotesk" offers a clean, technical look for general text and headings.
        // "Syne Mono" is a unique and stylish monospaced font for all code elements.
        fonts: {
            main: '"Space Grotesk", sans-serif',     // My primary font for UI text.
            code: '"Syne Mono", monospace',          // My dedicated font for all code snippets (blocks and inline).
            headings: '"Space Grotesk", sans-serif', // Headings use the main font for consistency.
        },
        // These font sizes are relative, allowing them to scale with browser settings.
        // I've aimed for a comfortable reading size for main text and distinct but not overpowering headings.
        fontSizes: {
            main: '1em',          // The base font size for most text content.
            codeBlock: '0.95em',  // Font size for code within <pre> blocks.
            h1: '1.4em',          // Largest heading.
            h2: '1.3em',
            h3: '1.2em',
            h4: '1.1em',          // Smallest heading.
            // Inline code font size is now managed within the 'inlineCodeSpecifics' section for better grouping.
        },

        // --- COLORS ---
        // This is the "Hyperminimal Graphite & Signal" palette.
        // The core idea is a dark, desaturated base with very selective, high-contrast "signal" colors
        // for important interactive elements (links) and critical syntax (keywords).
        // This approach minimizes visual noise and halation, making it very focused.
        colors: {
            // Main UI Elements
            background: '#1e1e1e',     // The overall page background for the chat area. Dark and unobtrusive.
            text: '#A6B2C0',           // Default text color within chat bubbles. Chosen for good readability on dark backgrounds.
            userBubbleBg: '#1E2127',   // Background for my (the user's) chat messages. Slightly distinct from AI.
            aiBubbleBg: '#1C1E24',     // Background for the AI's responses. The primary content canvas.
            hr: '#2A2D35',             // Color for horizontal rules (---). A subtle separator.

            // Markdown Text Formatting
            link: '#FF8C00',           // Vibrant "signal orange" for links. Stands out clearly. (Contrast on #1C1E24: 4.6:1)
            linkHover: '#FFA533',      // A slightly lighter orange for link hover states.
            bold: '#d1d1d1',           // Near-white for bold text. Provides strong emphasis. (Contrast: ~11:1)
            italic: '#D0D0D0',         // A lighter grey for italicized text, softer than bold. (Contrast: ~8.5:1)
            heading: '#E8E8E8',        // Very light grey for H1-H4 headings. Clean and modern. (Contrast: ~10.5:1)
            listMarker: '#B0B8C5',     // Using a muted color (close to base text) for list bullets/numbers to keep them subtle.
            blockquote: '#B0B8C5',     // Blockquotes also use a muted color, differentiated by their border and padding.

            // Code Block Syntax Highlighting
            // Glacial Bright: A crisp, modern theme with clean, high-contrast cool tones.
            code: {
                text: '#EAEAEA',           // A very clean, neutral off-white for sharp text.
                background: '#14161A',     // (Fixed) The very dark, cool background.
                comment: '#707880',        // A neutral, legible grey that recedes perfectly.
                keyword: '#569CD6',        // A classic, professional, and highly readable blue.
                string: '#4EC9B0',         // A vibrant, modern teal that is distinct and pleasant.
                number: '#B5CEA8',         // A light, pastel-like green that's easy to spot.
                variable: '#9CDCFE',       // A very light, sky-blue tint for variables, making them stand out.
                builtIn: '#C586C0',        // A clear, readable magenta for built-in functions and types.
            },

            // Other UI Components
            scrollbars: {
                thumb: '#333740',          // The draggable part of the scrollbar.
                thumbHover: '#4F5666',     // Color when hovering over the scrollbar thumb.
                track: '#181A1F',          // The background of the scrollbar.
            },
            chatActions: { // Icons like Edit, Rerun, More Options on chat bubbles
                icon: '#7F848E',           // Default color for these action icons.
                iconHover: '#C8CCD4',      // Color on hover, for better feedback.
            },
            modelThoughts: { // The "Thoughts (experimental)" panel
                background: '#1E2025',     // Background of the thoughts panel.
                border: '#2A2D35',         // Border color for the thoughts panel.
                text: '#A0A8B4',           // Text color inside the thoughts panel.
                header: '#B0B8C5',         // Color for the "Thoughts (experimental)" title.
                footer: '#808894',         // Color for the "Expand/Collapse" text at the bottom.
                icon: '#787F8A',           // Color for expand/collapse icons in the thoughts panel.
            },
            runTimePill: { // The little pill showing model execution time
                background: '#25282E',
                text: '#7F848E',
                backgroundHover: '#3E4451',
                textHover: '#C8CCD4',
            },
            scrollFab: { // Floating Action Buttons for scrolling
                background: 'rgba(62, 68, 81, 0.5)', // Semi-transparent background.
                backgroundHover: '#529BFF',         // Bright blue on hover for clear feedback.
                icon: '#7F848E',
                iconHover: '#FFFFFF',               // White icon on hover for max contrast.
            },
            userAvatar: { // The little icon next to my prompts
                iconColor: '#80B6FF',      // A soft, friendly blue for my avatar.
            },
        },

        // --- INLINE CODE SPECIFICS ---
        // I've grouped all styling for inline code `<code>` tags (not in <pre> blocks) here
        // to make them distinct and easily configurable.
        inlineCodeSpecifics: {
            display: 'inline-block',      // Crucial for respecting vertical padding and alignment.
            verticalAlign: 'middle',      // Helps align the snippet nicely with the surrounding text line.
            padding: '0.1em 0.30em',      // Kept this tight for a compact, pill-like look.
            borderRadius: '6px',          // A softer rounding than before.
            borderColor: '#2a3136',       // Subtle border color from v11.8.
            backgroundColor: '#2B2E36',   // Background from v11.8.
            textColor: '#FF8C00',          // Signal orange, consistent with links in Palette D.
            fontFamily: '"Syne Mono", monospace', // Ensures it uses my chosen code font.
            fontSize: '0.9em',            // Slightly smaller than main text to fit well within lines.
            textShadow: 'none',           // Inline code should be flat and clear, no text shadow.
        },

        // --- BORDERS & RADII ---
        // These define the look of borders and rounded corners for various elements.
        borders: {
            bubble: '1px solid transparent', // Default bubble border, usually invisible.
            bubbleHover: '1px solid #3E4451',// Subtle border on hover for feedback.
            bubbleRadius: '12px',             // My preferred roundness for chat bubbles.

            codeBlock: '1px solid #2A2D35',   // Border around full code blocks.
            codeBlockRadius: '10px',          // Roundness for code blocks.

            // Inline code border properties are now within 'inlineCodeSpecifics'.
            blockquote: '4px solid #B0B8C5',   // Left border for blockquotes. Color matches subtle blockquote text.
            blockquoteRadius: '6px',          // Slight rounding for blockquotes.
        },

        // --- EFFECTS ---
        // Here I control shadows and animations to add depth and polish.
        effects: {
            shadows: {
                bubble: '0 4px 8px rgba(0,0,0,0.2)',     // Soft shadow for chat bubbles to lift them off the page.
                text: '0px 2px 4px rgba(0, 0, 0, 0.5)', // Subtle shadow on main text for a "floating" effect (anti-halation).
                scrollFab: '0 4px 12px rgba(0,0,0,0.4)', // Shadow for the scroll buttons.
                userAvatar: '0 2px 6px rgba(0,0,0,0.3)', // Shadow for my little user avatar icon.
            },
            animations: {
                codeFadeInDuration: '0.4s',           // How long code blocks take to fade in their text.
                bubbleBorderTransition: 'border-color 0.25s ease-in-out', // Smooth transition for bubble border on hover.
            },
        },

        // --- SPACING & SIZING ---
        // All padding, margins, and element sizes are defined here for consistent layout.
        spacing: {
            bubblePadding: '25px',        // Generous padding inside chat bubbles for breathability.
            bubbleMarginBottom: '14px',   // Space between chat bubbles.
            bubbleMaxWidth: '100%',       // Bubbles can now take full width of their constrained centered column.

            codeBlockPadding: '1em 1.1em',// Padding inside full code blocks.

            headingMargin: '1em 0 0.5em 0', // Margins for H1-H4 headings.
            listMargin: '1em 0',               // Margins for UL/OL lists.
            blockquoteMargin: '1em 0',         // Margins for blockquotes.
            blockquotePadding: '12px 18px',    // Padding inside blockquotes.

            hrHeight: '2px',                   // Height/thickness of horizontal rules.
            hrMargin: '2.5em 0',               // Vertical space around horizontal rules.

            scrollbarWidth: '4px',             // Thin scrollbars for a modern look.

            // Inline code padding is now within 'inlineCodeSpecifics'.
            userAvatar: { // All settings for my user avatar icon
                size: '20px',                       // The width and height of the avatar icon.
                top: '16px',                        // How far from the top of the bubble the avatar is placed.
                leftFromBubbleEdge: '18px',         // How far from the user bubble's actual left edge the avatar is.
                bubbleLeftPaddingWithAvatar: '58px',// The total left padding of the user bubble itself, to make room for the avatar.
                                                    // (Calculated as: leftFromBubbleEdge + size + desired_gap_after_avatar)
            },
            scrollFabPosition: { // Settings for the floating scroll buttons
                top: '80%',
                marginRight: '4px',
                gap: '4px',
                width: '16px',
                height: '30px',
                borderRadius: '5px',
            },
        },
    };

    // =================================================================================================================
    //                                                THEME ENGINE
    //                                      (No need to edit below this line)
    // =================================================================================================================
    const ThemeEngine = {
        styleElement: null,
        config: themeConfig,

        init() {
            this.styleElement = document.createElement('style');
            this.styleElement.id = 'ai-studio-polished-dark-theme-styles';
            document.head.appendChild(this.styleElement);
        },

        applyTheme() {
            if (!this.styleElement) this.init();
            let css = '';
            const add = (selector, properties) => {
                const selectors = Array.isArray(selector) ? selector.join(',\n') : selector;
                let rules = '';
                for (const prop in properties) {
                    const value = properties[prop];
                    if (value !== null && value !== undefined && value !== '') {
                        rules += `  ${prop}: ${value} !important;\n`;
                    }
                }
                if (rules) css += `${selectors} {\n${rules}}\n`;
            };

            const c = this.config;
            const chatSessionSelector = `div.chat-container ms-chat-session`;
            const turnContentSelector = `${chatSessionSelector} .turn-content`;
            const codeBlockWrapper = `${chatSessionSelector} ms-code-block .syntax-highlighted-code-wrapper`;
            const codeContent = `${codeBlockWrapper} pre, ${codeBlockWrapper} code`;

            // General & Bubbles
            add('div.chat-container', { 'background-color': c.colors.background });
            add(chatSessionSelector, { 'color': c.colors.text, 'font-family': c.fonts.main, 'line-height': '1.65' });
            add(`${chatSessionSelector} .chat-turn-container`, {
                'border': c.borders.bubble,
                'transition': c.effects.animations.bubbleBorderTransition,
                'border-radius': c.borders.bubbleRadius,
                'margin-bottom': c.spacing.bubbleMarginBottom,
                'box-shadow': c.effects.shadows.bubble,
                'max-width': c.spacing.bubbleMaxWidth,
                'margin-left': 'auto',
                'margin-right': 'auto',
                'box-sizing': 'border-box',
            });
            css += `${chatSessionSelector} .chat-turn-container:hover { border: ${c.borders.bubbleHover} !important; }`;

            add(`${chatSessionSelector} .chat-turn-container.model`, {
                'background-color': c.colors.aiBubbleBg,
                'padding': c.spacing.bubblePadding,
            });

            add(`${chatSessionSelector} .chat-turn-container.user`, {
                'background-color': c.colors.userBubbleBg,
                'position': 'relative',
                'padding-top': c.spacing.bubblePadding,
                'padding-right': c.spacing.bubblePadding,
                'padding-bottom': c.spacing.bubblePadding,
                'padding-left': c.spacing.userAvatar.bubbleLeftPaddingWithAvatar,
            });

            const uaColor = c.colors.userAvatar;
            const uaSpace = c.spacing.userAvatar;
            const userAvatarSVG = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>')`;
            add(`${chatSessionSelector} .chat-turn-container.user::before`, {
                'content': '""', 'position': 'absolute', 'top': uaSpace.top, 'left': uaSpace.leftFromBubbleEdge,
                'width': uaSpace.size, 'height': uaSpace.size, 'background-color': uaColor.iconColor,
                'mask-image': userAvatarSVG, 'mask-size': 'contain', 'mask-repeat': 'no-repeat', 'mask-position': 'center',
                'box-shadow': c.effects.shadows.userAvatar, 'border-radius': '50%', 'z-index': '1'
            });
            // Markdown Typography & Syntax Highlighting
            const textElements = [`${turnContentSelector} p`, `${turnContentSelector} ms-cmark-node > p`, `${turnContentSelector} ms-cmark-node > span`];
            add(textElements, { 'color': c.colors.text, 'font-size': c.fontSizes.main, 'text-shadow': c.effects.shadows.text, 'letter-spacing': '0.1px', 'word-spacing': '0.1px' });
            add(`${turnContentSelector} a span`, { 'color': c.colors.link });
            add(`${turnContentSelector} a`, { 'text-decoration': 'none' });
            css += `${turnContentSelector} a:hover span { color: ${c.colors.linkHover} !important; text-decoration: underline !important; }`;
            add(`${turnContentSelector} strong span`, { 'color': c.colors.bold, 'font-weight': '600' });
            add([`${turnContentSelector} span[style*="font-style: italic"]`, `${turnContentSelector} span[style*="font-style: italic"] span`], { 'color': c.colors.italic, 'font-style': 'italic' });

            for (let i = 1; i <= 4; i++) add(`${turnContentSelector} h${i} span`, { 'color': c.colors.heading, 'font-family': c.fonts.headings, 'font-weight': '700', 'font-size': c.fontSizes[`h${i}`], 'text-shadow': c.effects.shadows.text });
            add([`${turnContentSelector} h1`, `${turnContentSelector} h2`, `${turnContentSelector} h3`, `${turnContentSelector} h4`], { 'margin': c.spacing.headingMargin });
            add([`${turnContentSelector} ul`, `${turnContentSelector} ol`], { 'margin': c.spacing.listMargin });
            css += `${turnContentSelector} ul li::marker, ${turnContentSelector} ol li::marker { color: ${c.colors.listMarker} !important; }`;
            add(`${turnContentSelector} blockquote p`, { 'color': c.colors.blockquote, 'font-style': 'normal' });
            add(`${turnContentSelector} blockquote`, { 'background-color': 'rgba(22, 24, 28, 0.6)', 'border-left': `4px solid ${c.borders.blockquote}`, 'padding': c.spacing.blockquotePadding, 'margin': c.spacing.blockquoteMargin, 'border-radius': c.borders.blockquoteRadius });
            add(`${turnContentSelector} hr`, { 'border': 'none', 'border-top': `${c.spacing.hrHeight} solid ${c.colors.hr}`, 'margin': c.spacing.hrMargin });

            // Inline Code Styling
            const ics = c.inlineCodeSpecifics;
            add([`${turnContentSelector} code:not(pre code)`, `${turnContentSelector} span.inline-code`], {
                'display': ics.display,
                'vertical-align': ics.verticalAlign,
                'color': ics.textColor,
                'background-color': ics.backgroundColor,
                'font-family': ics.fontFamily,
                'font-size': ics.fontSize,
                'padding': ics.padding,
                'border-radius': ics.borderRadius,
                'border': `1px solid ${ics.borderColor}`,
                'text-shadow': ics.textShadow
            });

            // Code Blocks
            add(codeBlockWrapper, { 'background-color': c.colors.code.background, 'border': c.borders.codeBlock, 'border-radius': c.borders.codeBlockRadius, 'padding': c.spacing.codeBlockPadding });
            add(codeContent, { 'color': c.colors.code.text, 'font-family': c.fonts.code, 'font-size': c.fontSizes.codeBlock, 'line-height': '1.7', 'text-shadow': 'none' });
            const s = c.colors.code;
            css += `${codeBlockWrapper} .hljs-comment { color: ${s.comment} !important; } ${codeBlockWrapper} .hljs-keyword { color: ${s.keyword} !important; } ${codeBlockWrapper} .hljs-built_in { color: ${s.builtIn} !important; } ${codeBlockWrapper} .hljs-string { color: ${s.string} !important; } ${codeBlockWrapper} .hljs-number { color: ${s.number} !important; } ${codeBlockWrapper} .hljs-variable, ${codeBlockWrapper} .hljs-title.function_ { color: ${s.variable} !important; }`;
            add(codeBlockWrapper, { 'overflow-x': 'auto' });
            add(codeContent, { 'white-space': 'pre' });
            add(codeBlockWrapper, { 'position': 'relative' });
            add(`${codeBlockWrapper} footer`, { 'background': 'transparent', 'border': 'none', 'padding': '0' });
            add([`${codeBlockWrapper} footer .disclaimer`, `${codeBlockWrapper} footer .language`], { 'display': 'none' });
            add(`${codeBlockWrapper} footer .actions`, { 'position': 'absolute', 'top': '8px', 'right': '8px' });

            // Expansion Panels for Code
            add(`mat-expansion-panel.code-block-container`, { 'background-color': 'rgba(20, 22, 26, 0.5)', 'border-radius': '12px', 'box-shadow': 'none', 'border': 'none' });
            add(`mat-expansion-panel.code-block-container .mat-expansion-panel-header`, { 'background-color': 'transparent', 'color': '#9098A6', 'font-family': c.fonts.main });
            add(`mat-expansion-panel.code-block-container .mat-expansion-indicator svg path`, { 'fill': '#9098A6' });
            add(`mat-expansion-panel.code-block-container .mat-expansion-panel-body`, { 'padding': '0 16px 16px' });

            // Thoughts Panel
            const mt = c.colors.modelThoughts;
            const thoughtsPanelSelector = `${chatSessionSelector} .model-prompt-container ms-thought-chunk .mat-expansion-panel.thought-panel:not([disabled])`;
            const thoughtsFooterSelector = `${chatSessionSelector} .model-prompt-container ms-thought-chunk mat-expansion-panel[disabled]`;
            add(thoughtsPanelSelector, { 'background-color': mt.background, 'border': `1px solid ${mt.border}`, 'border-radius': '10px', 'margin-bottom': '0', 'border-bottom-left-radius': '0', 'border-bottom-right-radius': '0', 'max-width': c.spacing.bubbleMaxWidth, 'margin-left': 'auto', 'margin-right': 'auto', 'box-sizing': 'border-box' });
            add(`${thoughtsPanelSelector} .mat-expansion-panel-header`, { 'background-color': 'transparent' });
            add(`${thoughtsPanelSelector} .top-panel-title`, { 'color': mt.header });
            add(`${thoughtsPanelSelector} .mat-expansion-panel-body`, { 'color': mt.text, 'padding': '0 24px 16px 24px' });
            add(`${thoughtsPanelSelector} .mat-expansion-indicator svg`, { 'fill': mt.icon });
            add(thoughtsFooterSelector, { 'background-color': mt.background, 'border': `1px solid ${mt.border}`, 'border-top': `1px solid ${mt.border}`, 'border-radius': '10px', 'margin-top': '0', 'border-top-left-radius': '0', 'border-top-right-radius': '0', 'max-width': c.spacing.bubbleMaxWidth, 'margin-left': 'auto', 'margin-right': 'auto', 'box-sizing': 'border-box' });
            add(`${thoughtsFooterSelector} .mat-expansion-panel-header`, { 'background-color': 'transparent' });
            add(`${thoughtsFooterSelector} .thought-collapsed-text`, { 'color': mt.footer });
            add(`${thoughtsFooterSelector} .footer-icon`, { 'color': mt.icon });

            // Chat Action Icons
            const ca = c.colors.chatActions;
            const turnActionIconSelectors = [`${chatSessionSelector} .actions button .material-symbols-outlined`, `${chatSessionSelector} .actions button .mat-icon`];
            const turnActionSvgSelectors = `${chatSessionSelector} .actions button svg`;
            add(turnActionIconSelectors, { 'color': ca.icon });
            add(turnActionSvgSelectors, { 'fill': ca.icon });
            css += `${chatSessionSelector} .actions button:hover .material-symbols-outlined, ${chatSessionSelector} .actions button:hover .mat-icon { color: ${ca.iconHover} !important; } ${chatSessionSelector} .actions button:hover svg { fill: ${ca.iconHover} !important; }`;

            // Model Run Time Pill & Feedback Icons
            const rtp = c.colors.runTimePill;
            add('.turn-footer .model-run-time-pill', { 'background-color': rtp.background, 'color': rtp.text, 'padding': '2px 8px', 'border-radius': '6px', 'font-size': '0.8em', 'transition': 'background-color 0.2s ease, color 0.2s ease' });
            css += `.turn-footer .model-run-time-pill:hover { background-color: ${rtp.backgroundHover} !important; color: ${rtp.textHover} !important; }`;
            add('.turn-footer .response-feedback-button mat-icon', { 'color': ca.icon });
            css += `.turn-footer .response-feedback-button:hover mat-icon { color: ${ca.iconHover} !important; }`;

            // Scroll to Prompt FAB (Floating Action Button)
            const fab = c.colors.scrollFab;
            const fabPos = c.spacing.scrollFabPosition;
            add('ms-prompt-navigation', { 'position': 'sticky', 'top': fabPos.top, 'float': 'right', 'transform': 'translateY(-50%)', 'margin-right': fabPos.marginRight, 'z-index': '1000', 'display': 'flex', 'flex-direction': 'column', 'gap': fabPos.gap });
            add('ms-prompt-navigation button.scroll-fab', { 'background-color': fab.background, 'box-shadow': c.effects.shadows.scrollFab, 'width': fabPos.width, 'height': fabPos.height, 'min-width': 'auto', 'border-radius': fabPos.borderRadius, 'transition': 'background-color 0.2s ease, transform 0.2s ease', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center' });
            add('ms-prompt-navigation button.scroll-fab .material-symbols-outlined', { 'color': fab.icon, 'font-size': '18px' });
            css += `ms-prompt-navigation button.scroll-fab:hover { background-color: ${fab.backgroundHover} !important; transform: scale(1.05); }`;
            css += `ms-prompt-navigation button.scroll-fab:hover .material-symbols-outlined { color: ${fab.iconHover} !important; }`;

            // Scrollbars
            const sb = c.colors.scrollbars;
            const scrollContainerSelector = `${chatSessionSelector} ms-autoscroll-container`;
            css += `${scrollContainerSelector}::-webkit-scrollbar { width: ${c.spacing.scrollbarWidth} !important; height: ${c.spacing.scrollbarWidth} !important; }`;
            css += `${scrollContainerSelector}::-webkit-scrollbar-track { background: ${sb.track} !important; }`;
            css += `${scrollContainerSelector}::-webkit-scrollbar-thumb { background-color: ${sb.thumb} !important; border-radius: ${c.spacing.scrollbarWidth} !important; }`;
            css += `${scrollContainerSelector}::-webkit-scrollbar-thumb:hover { background-color: ${sb.thumbHover} !important; }`;

            // Smooth Fade-In Animation for Code Blocks
            css += `
                @keyframes fadeInText {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                ${codeBlockWrapper} code {
                    animation: fadeInText ${c.effects.animations.codeFadeInDuration} ease-in-out forwards;
                }
            `;

            this.styleElement.textContent = css;
        }
    };

    // =================================================================================================================
    //                                                MAIN EXECUTION
    // =================================================================================================================

    function main() {
        console.log("AI Studio Polished Dark Theme (v12.0): Initializing...");

        const loadRequiredFonts = () => {
            const fonts = [
                'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap',
                'https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap'
            ];
            fonts.forEach(fontUrl => {
                if (!document.querySelector(`link[href="${fontUrl}"]`)) {
                    const link = document.createElement('link');
                    link.href = fontUrl;
                    link.rel = 'stylesheet';
                    document.head.appendChild(link);
                }
            });
        };

        const waitForElement = (selector, callback) => {
            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    callback(element);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        };

        let themeApplied = false;
        waitForElement('div.chat-container', () => {
            if (!themeApplied) {
                console.log("AI Studio Polished Dark Theme: Chat container found. Applying theme.");
                loadRequiredFonts();
                themeApplied = true;
            }
            ThemeEngine.applyTheme();
        });
    }

    main();

})();