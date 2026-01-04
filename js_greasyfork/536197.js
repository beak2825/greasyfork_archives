// ==UserScript==
// @name         Slack AI Assistant - Minimal Dark Theme
// @version      7.6
// @description  Gemini-powered Slack assistant with modern dark theme, Roboto font, and enhanced animations
// @author       Shawon
// @icon         https://www.slack.com/favicon.ico
// @match        https://app.slack.com/client/*
// @grant        MIT
// @namespace https://greasyfork.org/users/1392874
// @downloadURL https://update.greasyfork.org/scripts/536197/Slack%20AI%20Assistant%20-%20Minimal%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/536197/Slack%20AI%20Assistant%20-%20Minimal%20Dark%20Theme.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Color Palette ===
    const colors = {
        background: 'linear-gradient(135deg, #0e1111, #1a1f1f)',
        surface: 'linear-gradient(135deg, #1c2525, #2e3a3a)',
        primary: 'linear-gradient(90deg, #7F00FF, #E100FF)',
        secondary: 'linear-gradient(135deg, #00bfa5, #1de9b6)',
        error: '#ff5252',
        text: '#f5f5f5',
        muted: '#a0a0a0',
        border: '#3a4a4a',
        glow: 'rgba(127, 0, 255, 0.3)'
    };

    // === Animation Variables ===
    const animations = {
        buttonHoverDuration: '0.2s',
        transitionEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        tooltipFadeDuration: '0.25s', // Slightly longer for smoother tooltip
        dropdownSlideDuration: '0.3s',
        modalScaleDuration: '0.4s',
        popupMoveDuration: '0.6s', // Slightly longer for smoother popup
        popupFadeDuration: '4s'   // Extended for better visibility
    };

    // === Button Configurations ===
    const buttons = [
        { id: 'goodMorning', icon: '🌞', tooltip: 'Send Good Morning', message: 'Good morning!', ariaLabel: 'Send Good Morning message' },
        { id: 'ok', icon: '👍', tooltip: 'Send Ok', message: 'Ok', ariaLabel: 'Send Ok message' },
        { id: 'quickMessage', icon: '🎯', tooltip: 'Quick Messages', dropdown: true, ariaLabel: 'Toggle quick messages' },
        { id: 'smartReply', icon: '✨', tooltip: 'Smart Reply (Gemini)', ariaLabel: 'Generate smart reply' },
        { id: 'polish', icon: '✏️', tooltip: 'Polish Message', ariaLabel: 'Open message polish modal' }
    ];

    // === Quick Messages ===
    const quickMessages = [
        { text: 'Thanks!', action: 'insert' },
        { text: 'Will do!', action: 'insert' },
        { text: 'On it!', action: 'send' },
        { text: 'Got it, thanks!', action: 'send' },
        { text: 'Looks good!', action: 'insert' },
        { text: 'I’ll follow up.', action: 'send' },
        { text: 'Can we discuss?', action: 'insert' },
        { text: 'Great work!', action: 'send' }
    ];

    // === Gemini API Client ===
    class GeminiClient {
        constructor() {
            this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
            this.model = 'gemini-1.5-flash';
        }

        async init() {
            let apiKey = localStorage.getItem('gemini_api_key');
            if (!apiKey) {
                apiKey = prompt('Enter your Gemini API key:');
                if (!apiKey) throw new Error('API key required');
                localStorage.setItem('gemini_api_key', apiKey);
            }
            this.apiKey = apiKey;
        }

        async generateContent(prompt) {
            try {
                if (!this.apiKey) await this.init();
                const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
            } catch (err) {
                throw new Error(`Gemini API failed: ${err.message}`);
            }
        }
    }

    // === Wait for Slack Interface ===
    function waitForSlackInterface(maxRetries = 30) {
        let retries = 0;
        const interval = setInterval(() => {
            const textBox = document.querySelector('.ql-editor[contenteditable="true"]') ||
                           document.querySelector('[data-qa="message_input"] .ql-editor') ||
                           document.querySelector('[data-message-input="true"] .ql-editor');
            if (textBox || retries >= maxRetries) {
                clearInterval(interval);
                if (textBox) addControlBox();
                else console.warn('Slack AI Assistant: Message input not found after max retries');
            }
            retries++;
        }, 1000);
    }

    // === Add Control Box ===
    function addControlBox() {
        const controlBox = document.createElement('div');
        controlBox.id = 'slackAssistant';
        Object.assign(controlBox.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '25rem',
            background: colors.surface,
            borderRadius: '14px',
            boxShadow: `0 6px 16px rgba(0,0,0,0.3), 0 0 8px ${colors.glow}`,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: '100000000',
            cursor: 'move',
            animation: `fadeIn ${animations.modalScaleDuration} ${animations.transitionEasing}`,
            border: `1px solid ${colors.border}`,
            transition: `transform ${animations.buttonHoverDuration} ${animations.transitionEasing}`
        });

        // Load Roboto font
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);

        buttons.forEach(btn => controlBox.appendChild(createButton(btn)));

        document.body.appendChild(controlBox);

        // Draggable functionality
        let isDragging = false, offsetX, offsetY;
        controlBox.addEventListener('mousedown', e => {
            isDragging = true;
            offsetX = e.clientX - controlBox.getBoundingClientRect().left;
            offsetY = e.clientY - controlBox.getBoundingClientRect().top;
            controlBox.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', e => {
            if (isDragging) {
                controlBox.style.left = `${e.clientX - offsetX}px`;
                controlBox.style.top = `${e.clientY - offsetY}px`;
                controlBox.style.right = controlBox.style.bottom = 'auto';
            }
        }, { passive: true });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            controlBox.style.cursor = 'move';
            document.body.style.userSelect = '';
        }, { passive: true });
    }

    // === Create Button ===
    function createButton({ id, icon, tooltip, message, dropdown, ariaLabel }) {
        const btn = document.createElement('button');
        btn.id = `btn-${id}`;
        btn.textContent = icon;
        btn.title = tooltip;
        btn.setAttribute('data-toggled', 'false');
        btn.setAttribute('aria-label', ariaLabel);
        Object.assign(btn.style, {
            fontSize: '16px',
            background: 'transparent',
            border: `1px solid ${colors.border}`,
            borderRadius: '50%',
            cursor: 'pointer',
            padding: '8px',
            transition: `transform ${animations.buttonHoverDuration} ${animations.transitionEasing}, background ${animations.buttonHoverDuration} ${animations.transitionEasing}, box-shadow ${animations.buttonHoverDuration} ${animations.transitionEasing}`,
            position: 'relative',
            color: colors.text,
            width: '36px',
            height: '36px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        });

        btn.onmouseenter = () => {
            btn.style.background = colors.border;
            btn.style.transform = 'scale(1.05)'; // Reduced scale for subtler effect
            btn.style.boxShadow = `0 0 6px ${colors.glow}`; // Softer glow
        };
        btn.onmouseleave = () => {
            btn.style.background = 'transparent';
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = 'none';
        };

        btn.onclick = () => {
            if (dropdown) return toggleQuickMessages(btn);
            if (id === 'smartReply') return generateSmartReply();
            if (id === 'polish') return showPolishModal();
            sendMessage(message);
        };

        return btn;
    }

    // === Toggle Quick Messages Dropdown ===
    function toggleQuickMessages(button) {
        const isToggled = button.getAttribute('data-toggled') === 'true';
        const existing = document.querySelector('#quickMessages');
        if (isToggled && existing) {
            existing.remove();
            button.setAttribute('data-toggled', 'false');
            return;
        }
        if (existing) existing.remove();

        const dropdown = document.createElement('div');
        dropdown.id = 'quickMessages';
        Object.assign(dropdown.style, {
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            right: '0',
            background: colors.surface,
            borderRadius: '12px',
            boxShadow: `0 6px 16px rgba(0,0,0,0.3), 0 0 8px ${colors.glow}`,
            padding: '14px',
            zIndex: '100000001',
            minWidth: '220px',
            maxWidth: '320px',
            maxHeight: '260px',
            overflowY: 'auto',
            animation: `slideDown ${animations.dropdownSlideDuration} ${animations.transitionEasing}`,
            border: `1px solid ${colors.border}`
        });

        quickMessages.forEach((msg, index) => {
            const item = document.createElement('div');
            item.textContent = msg.text;
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            Object.assign(item.style, {
                padding: '10px 12px',
                cursor: 'pointer',
                borderRadius: '10px',
                transition: `background ${animations.buttonHoverDuration} ${animations.transitionEasing}, transform ${animations.buttonHoverDuration} ${animations.transitionEasing}`,
                fontSize: '14px',
                color: colors.text,
                background: 'transparent',
                fontWeight: '500',
                whiteSpace: 'normal',
                lineHeight: '1.5',
                transform: 'translateX(-20px)',
                opacity: '0',
                animation: `slideIn ${animations.dropdownSlideDuration} ${animations.transitionEasing} ${index * 0.05}s forwards`
            });

            item.onmouseenter = () => {
                item.style.background = colors.border;
                item.style.transform = 'translateX(0) scale(1.02)';
                item.style.boxShadow = `0 0 8px ${colors.glow}`;
            };
            item.onmouseleave = () => {
                item.style.background = 'transparent';
                item.style.transform = 'translateX(0)';
                item.style.boxShadow = 'none';
            };

            item.onclick = () => {
                if (msg.action === 'insert') insertMessage(msg.text);
                else sendMessage(msg.text);
                dropdown.remove();
                button.setAttribute('data-toggled', 'false');
            };

            item.onkeydown = e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    item.click();
                    e.preventDefault();
                }
            };

            dropdown.appendChild(item);
        });

        button.parentNode.appendChild(dropdown);
        button.setAttribute('data-toggled', 'true');

        document.addEventListener('click', e => {
            if (!dropdown.contains(e.target) && e.target !== button) {
                dropdown.remove();
                button.setAttribute('data-toggled', 'false');
            }
        }, { once: true });
    }

    // === Show Polish Modal ===
    function showPolishModal() {
        const modal = document.createElement('div');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-label', 'Message Refinement Modal');
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            background: 'rgba(18, 18, 18, 0.95)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '100000001',
            animation: `fadeIn ${animations.modalScaleDuration} ${animations.transitionEasing}`
        });

        const box = document.createElement('div');
        Object.assign(box.style, {
            background: colors.surface,
            padding: '28px',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '440px',
            maxWidth: '92%',
            boxShadow: `0 8px 20px rgba(0,0,0,0.4), 0 0 10px ${colors.glow}`,
            border: `1px solid ${colors.border}`,
            position: 'relative',
            transform: 'scale(0.9)',
            animation: `scaleIn ${animations.modalScaleDuration} ${animations.transitionEasing} forwards`
        });

        const crossBtn = document.createElement('button');
        crossBtn.textContent = '×';
        crossBtn.setAttribute('aria-label', 'Close message refinement modal');
        Object.assign(crossBtn.style, {
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: colors.error,
            color: colors.text,
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '18px',
            cursor: 'pointer',
            transition: `transform ${animations.buttonHoverDuration} ${animations.transitionEasing}, background ${animations.buttonHoverDuration} ${animations.transitionEasing}`
        });
        crossBtn.onmouseenter = () => {
            crossBtn.style.background = '#b71c1c';
            crossBtn.style.transform = 'scale(1.1)';
        };
        crossBtn.onmouseleave = () => {
            crossBtn.style.background = colors.error;
            crossBtn.style.transform = 'scale(1)';
        };
        crossBtn.onclick = () => {
            modal.remove();
            const textBox = document.querySelector('.ql-editor[contenteditable="true"]') ||
                           document.querySelector('[data-qa="message_input"] .ql-editor');
            if (textBox) textBox.focus();
        };

        const title = document.createElement('div');
        title.textContent = 'Refine Message';
        Object.assign(title.style, {
            fontSize: '18px',
            fontWeight: '700',
            color: colors.text,
            paddingBottom: '12px',
            borderBottom: `1px solid ${colors.border}`
        });

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Type your message here...';
        textarea.setAttribute('aria-label', 'Message input for polishing or grammar fixing');
        Object.assign(textarea.style, {
            resize: 'none',
            minHeight: '140px',
            fontSize: '14px',
            padding: '14px',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            transition: `border ${animations.buttonHoverDuration} ${animations.transitionEasing}, box-shadow ${animations.buttonHoverDuration} ${animations.transitionEasing}`,
            outline: 'none',
            background: colors.background,
            color: colors.text,
            lineHeight: '1.6'
        });
        textarea.onfocus = () => {
            textarea.style.border = `1px solid ${colors.primary}`;
            textarea.style.boxShadow = `0 0 8px ${colors.glow}`;
        };
        textarea.onblur = () => {
            textarea.style.border = `1px solid ${colors.border}`;
            textarea.style.boxShadow = 'none';
        };
        textarea.focus();

        const buttonRow = document.createElement('div');
        Object.assign(buttonRow.style, {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            flexWrap: 'wrap'
        });

        const modalButtons = [
            {
                text: 'Fix Grammar & Insert',
                bg: colors.secondary,
                color: colors.text,
                hoverBg: colors.secondary,
                ariaLabel: 'Fix grammar and insert the message',
                action: async () => {
                    const text = textarea.value.trim();
                    if (!text) return showPopup('Message empty!');
                    showPopup('Fixing grammar...', false);
                    try {
                        const gemini = new GeminiClient();
                        const prompt = `Fix grammar and clarity of this Slack message:\n"${text}"\nKeep tone and intent unchanged. Return only the corrected message.`;
                        const result = await gemini.generateContent(prompt);
                        insertMessage(result);
                        modal.remove();
                        showPopup('Grammar fixed and inserted!', true);
                    } catch (err) {
                        showPopup(err.message);
                    }
                }
            },
            {
                text: 'Polish & Insert',
                bg: colors.primary,
                color: colors.text,
                hoverBg: colors.primary,
                ariaLabel: 'Polish and insert the message',
                action: async () => {
                    const text = textarea.value.trim();
                    if (!text) return showPopup('Message empty!');
                    showPopup('Polishing...', false);
                    try {
                        const gemini = new GeminiClient();
                        const prompt = `Polish this Slack message to be polite, friendly, and professional:\n"${text}"\nPreserve original intent. Return only the improved message.`;
                        const result = await gemini.generateContent(prompt);
                        insertMessage(result);
                        modal.remove();
                        showPopup('Inserted!', true);
                    } catch (err) {
                        showPopup(err.message);
                    }
                }
            }
        ];

        modalButtons.forEach(({ text, bg, color, hoverBg, ariaLabel, action }) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.setAttribute('aria-label', ariaLabel);
            Object.assign(btn.style, {
                padding: '12px 18px',
                borderRadius: '12px',
                background: bg,
                color,
                border: 'none',
                cursor: 'pointer',
                transition: `transform ${animations.buttonHoverDuration} ${animations.transitionEasing}, box-shadow ${animations.buttonHoverDuration} ${animations.transitionEasing}`,
                fontSize: '14px',
                fontWeight: '500',
                position: 'relative',
                overflow: 'hidden'
            });
            btn.onmouseenter = () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.boxShadow = `0 0 12px ${colors.glow}`;
                btn.style.animation = `pulse ${animations.buttonHoverDuration} ${animations.transitionEasing} infinite`;
            };
            btn.onmouseleave = () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = 'none';
                btn.style.animation = 'none';
            };
            btn.onclick = action;
            buttonRow.appendChild(btn);
        });

        box.append(crossBtn, title, textarea, buttonRow);
        modal.appendChild(box);
        document.body.appendChild(modal);

        modal.addEventListener('keydown', e => {
            if (e.key === 'Escape') crossBtn.click();
        });
    }

    // === Generate Smart Reply ===
    async function generateSmartReply() {
        const messages = Array.from(document.querySelectorAll('.c-message_kit__background')).slice(-2);
        let convo = '', lastSender = null;
        messages.forEach(msg => {
            const sender = msg.querySelector('.c-message__sender_button')?.textContent.trim() || lastSender;
            if (sender) lastSender = sender;
            const text = Array.from(msg.querySelectorAll('.p-rich_text_section')).map(el => el.textContent.trim()).join(' ');
            if (text) convo += `${lastSender}: ${text}\n\n`;
        });

        if (!convo) return showPopup('No messages found');
        showPopup('Generating reply...', false);

        try {
            const gemini = new GeminiClient();
            const prompt = `You are Shawon. Reply to the other person in this Slack conversation in a friendly, professional tone. Do not mention Shawon. No emojis.\n\n${convo}\n\nReturn a short, natural reply.`;
            const reply = await gemini.generateContent(prompt);
            insertMessage(reply);
            showPopup('Reply inserted!', true);
        } catch (err) {
            showPopup(err.message);
        }
    }

    // === Insert Message ===
    function insertMessage(message) {
        const textBox = document.querySelector('.ql-editor[contenteditable="true"]') ||
                        document.querySelector('[data-qa="message_input"] .ql-editor') ||
                        document.querySelector('[data-message-input="true"] .ql-editor');
        if (textBox) {
            textBox.focus();
            document.execCommand('insertText', false, message);
        } else {
            showPopup('Message input not found');
        }
    }

    // === Send Message ===
    function sendMessage(message) {
        const textBox = document.querySelector('.ql-editor[contenteditable="true"]') ||
                        document.querySelector('[data-qa="message_input"] .ql-editor') ||
                        document.querySelector('[data-message-input="true"] .ql-editor');
        const sendBtn = document.querySelector('[data-qa="texty_send_button"]') ||
                        document.querySelector('button[aria-label*="Send message"]');
        if (textBox && sendBtn) {
            textBox.focus();
            document.execCommand('insertText', false, message);
            setTimeout(() => sendBtn.click(), 500);
        } else {
            showPopup('Unable to send message');
        }
    }

    // === Show Popup ===
    function showPopup(message, isFollowUp = false) {
        const popup = document.createElement('div');
        const controlBox = document.querySelector('#slackAssistant');
        const controlBoxRect = controlBox?.getBoundingClientRect();
        const baseBottom = controlBoxRect ? `${window.innerHeight - controlBoxRect.top + 20}px` : '7rem'; // Position above control box
        Object.assign(popup.style, {
            position: 'fixed',
            bottom: isFollowUp ? `calc(${baseBottom} + 3.5rem)` : baseBottom, // Stack follow-up popup with spacing
            right: controlBoxRect ? `${window.innerWidth - controlBoxRect.right + 10}px` : '28rem', // Align with control box
            background: colors.primary,
            color: colors.text,
            padding: '12px 18px',
            borderRadius: '16px',
            fontSize: '14px',
            boxShadow: `0 6px 16px rgba(0,0,0,0.3), 0 0 8px ${colors.glow}`,
            fontWeight: '500',
            zIndex: '100000002', // Higher than control box
            animation: isFollowUp
                ? `fadeInOut ${animations.popupFadeDuration} ${animations.transitionEasing}`
                : `fadeInOut ${animations.popupFadeDuration} ${animations.transitionEasing}, moveUp ${animations.popupMoveDuration} ${animations.transitionEasing} forwards`,
            transform: 'translateY(10px)',
            opacity: '0',
            maxWidth: '300px',
            textAlign: 'center'
        });
        popup.textContent = message;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 4000); // Matches longer fade duration
    }

    // === Inject Styles ===
    const style = document.createElement('style');
    style.textContent = `
        /* === Animations === */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(10px); }
            15% { opacity: 1; transform: translateY(0); }
            85% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(10px); }
        }

        @keyframes moveUp {
            0% { transform: translateY(10px); }
            80% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
        }

        @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        @keyframes slideIn {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 ${colors.glow}; }
            50% { box-shadow: 0 0 12px ${colors.glow}; }
            100% { box-shadow: 0 0 0 ${colors.glow}; }
        }

        /* === Global Styles === */
        #slackAssistant, #quickMessages, [role="button"], textarea {
            font-family: 'Roboto', sans-serif;
            transition: all ${animations.buttonHoverDuration} ${animations.transitionEasing};
        }

        /* === Scrollbar for Quick Messages === */
        #quickMessages::-webkit-scrollbar {
            width: 8px;
        }
        #quickMessages::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 4px;
        }
        #quickMessages::-webkit-scrollbar-thumb {
            background: ${colors.border};
            border-radius: 4px;
        }
        #quickMessages::-webkit-scrollbar-thumb:hover {
            background: ${colors.muted};
        }

        /* === Textarea Placeholder === */
        textarea::placeholder {
            color: ${colors.muted};
            opacity: 1;
        }

        /* === Tooltip Styles === */
        [title]:hover:after {
            content: attr(title);
            position: absolute;
            bottom: calc(100% + 12px);
            left: 50%;
            transform: translateX(-50%);
            background: ${colors.surface};
            color: ${colors.text};
            padding: 4px 8px;
            width:8rem;
            border-radius: 12px !important; /* Rounded shape */
            font-size: 11px !important; /* Slightly larger for readability */
            font-weight: 500;
            whiteSpace: nowrap;
            z-index: 100000002;
            border: 1px solid ${colors.border};
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: fadeTooltip ${animations.tooltipFadeDuration} ${animations.transitionEasing} forwards;
        }

        @keyframes fadeTooltip {
            from { opacity: 0; transform: translateX(-50%) translateY(5px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(style);

    waitForSlackInterface();
})();