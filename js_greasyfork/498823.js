// ==UserScript==
// @name         Gemini Keyboard Shortcuts (Power Tweaks)
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Power-user hotkeys for Gemini with Win11 fixes, URL param prefill, and a centralized config for selectors & shortcuts. New Chat = ⌘/Ctrl+Shift+O, Sidebar Toggle = ⌘/Ctrl+B.
// @license      MIT
// @author       Henry Getz
// @match        https://gemini.google.com/*
// @match        https://gemini.google.com/u/*
// @match        https://gemini.google.com/app*
// @supportURL   https://github.com/HenryGetz/GeminiPilot/issues
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/498823/Gemini%20Keyboard%20Shortcuts%20%28Power%20Tweaks%29.user.js
// @updateURL https://update.greasyfork.org/scripts/498823/Gemini%20Keyboard%20Shortcuts%20%28Power%20Tweaks%29.meta.js
// ==/UserScript==
/*

# What’s new (maintainability + fixes)

- **Centralized config**: All shortcut preferences and selectors live in a single `CFG` object at the top.
- **Reliable New Chat selector**: Uses `button[aria-label*='New chat']`.
- **Shortcut updates**:
  - New Chat: **⌘/Ctrl + Shift + O**
  - Sidebar Toggle: **⌘/Ctrl + B** (like VS Code)
  - Help Window: **⌘/Ctrl + Shift + ?**
- **Windows 11 key handling**: Normalizes `event.key` to lowercase so Shift no longer breaks letter detection.
- **URL param prefill**: Open Gemini with a pre-populated prompt via `?q=...` (e.g. `https://gemini.google.com/app?q=Your+Prompt`).
- **onload resiliency**: Rebinds `window.onload = onLoad` inside an IIFE to survive sites where `onload` stops firing.
- **No forced UI repositioning**: Removed custom `bard-mode-switcher` fixed positioning.

# Included Keyboard Shortcuts

## Chat Management
| Shortcut (Mac/Windows)      | Action            |
|:---------------------------:|:------------------|
| ⌘/Ctrl + **Shift + O**      | Open new chat     |
| ⌘/Ctrl + Shift + Backspace  | Delete chat       |
| ⌘/Ctrl + **B**              | Toggle sidebar    |
| ⌥/Alt + 1–9                 | Go to nth chat    |
| ⌘/Ctrl + Shift + =          | Next chat         |
| ⌘/Ctrl + Shift + –          | Previous chat     |

## Text Input and Editing
| Shortcut (Mac/Windows) | Action                           |
|:----------------------:|:----------------------------------|
| Shift + Esc            | Focus chat input                  |
| ⌘/Ctrl + Shift + E     | Edit text                         |
| ⌘/Ctrl + Shift + ;     | Copy last code block              |
| ⌘/Ctrl + Shift + '     | Copy second-to-last code block    |
| ⌘/Ctrl + Shift + C     | Copy response                     |
| ⌘/Ctrl + Shift + K     | Stop/start generation             |

## Draft Navigation
| Shortcut (Mac/Windows) | Action                |
|:----------------------:|:----------------------|
| ⌘/Ctrl + Shift + D     | Generate more drafts  |
| ⌘/Ctrl + Shift + ,     | Next draft            |
| ⌘/Ctrl + Shift + .     | Previous draft        |

## Sharing and Linking
| Shortcut (Mac/Windows) | Action                      |
|:----------------------:|:----------------------------|
| ⌘/Ctrl + Shift + L     | Copy prompt/response link   |
| ⌘/Ctrl + Shift + M     | Copy chat link              |

## Audio and File Shortcuts
| Shortcut (Mac/Windows) | Action            |
|:----------------------:|:------------------|
| ⌘/Ctrl + Shift + Y     | Play/pause audio  |
| ⌘/Ctrl + Shift + S     | Voice to text     |
| ⌘/Ctrl + O             | Open file         |

## Help
| Shortcut (Mac/Windows) | Action             |
|:----------------------:|:-------------------|
| ⌘/Ctrl + Shift + ?     | Open help window   |

*/


(function () {
    'use strict';

    // ====== CENTRAL CONFIG (shortcuts + selectors) ======
    const CFG = {
        behavior: {
            assumeLastResponse: false,
            goToNextChatOnDelete: true,
        },
        timings: { rapidClickDelayMS: 100 },
        hotkeys: {
            newChat:      { key: 'o', shift: true,  cmdOrCtrl: true },
            sidebarToggle:{ key: 'b', shift: false, cmdOrCtrl: true },
            openFile:     { key: 'o', shift: false, cmdOrCtrl: true },
            // Help accepts '?' OR '/' with Shift OR code 'Slash'
            showHelp:     { key: '?', shift: true,  cmdOrCtrl: true, altKeys: ['/', '?'], codes: ['Slash'] },
        },
        selectors: {
            showMoreButton: '[data-test-id="show-more-button"]',
            loadMoreButton: '[data-test-id="load-more-button"]',
            conversation: '[data-test-id="conversation"]',
            selectedConversation: '.selected[data-test-id="conversation"]',
            conversationTitle: '.conversation-title',
            actionsMenuButton: '[data-test-id="actions-menu-button"]',
            deleteButton: '[data-test-id="delete-button"]',
            confirmButton: '[data-test-id="confirm-button"]',
            textInputField: '.text-input-field',
            enterPrompt: '[aria-label="Enter a prompt here"]',
            sendMessageButton: '[aria-label="Send message"]',
            micButton: '[mattooltip="Use microphone"]',
            draftPreviewButton: '.draft-preview-button',
            generateMoreDraftsButton: '[data-test-id="generate-more-drafts-button"]',
            redoButton: '[aria-label=Redo]',
            regenerateDraftsTooltip: '[mattooltip="Regenerate drafts"]',
            editTextTooltip: '[mattooltip="Edit text"]',
            shareButton: '[aria-label*="Share"]',
            shareResponseButton: '[aria-label*="Share response"]',
            shareModeFull: '[data-test-id="share-mode-radio-button-full"] label',
            createButton: '[data-test-id="create-button"]',
            copyPublicLinkButton: '[aria-label="Copy public link"]',
            closeDialogButton: '[aria-label="Close"]',
            uploadButtonPrimary: '.upload-button button',
            uploadButtonAlt: '[aria-label*="Upload files"]',
            sidebarHide: '[aria-label*="Hide side panel"]',
            sidebarShow: '[aria-label*="Show side panel"]',
            mainMenu: '[aria-label*="Main menu"]',
            menuToggleButton: '[data-test-id="menu-toggle-button"]',
            modelSwitcherButton: '[data-test-id="bard-mode-menu-button"]',
            modelMenuPanel: '.mat-mdc-menu-panel',
            modelMenuContent: '.mat-mdc-menu-content',
            modelMenuItem: 'button.mat-mdc-menu-item',
            newChatButton: "button[aria-label*='New chat']",
            modelResponseText: '.model-response-text',
            codeTTSButton: '.response-tts-container button',
            editorCancel: '[aria-label*="Cancel"]',
            hideDuringCopy:
            '.code-block-decoration.footer, .code-block-decoration.header, .table-footer',
            hideDuringCopyRestore:
            '.code-block-decoration.footer, .code-block-decoration.header',
        },
    };

    const { assumeLastResponse, goToNextChatOnDelete } = CFG.behavior;
    const { rapidClickDelayMS } = CFG.timings;

    const hasQuery = window.location.href.includes('?q=');
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let query = unescape(params.get('q') || '');

    window.onload = onLoad;

    function onLoad() {
        // ----- CSS tweaks (minimal & intentional) -----
        const s = document.createElement('style');
        document.head.append(s);
        s.textContent = `
      .conversation-container, .input-area-container, .bottom-container, user-query {
        max-width: -webkit-fill-available !important;
        max-width: fill-available !important;
      }
      #gbwa, .cdk-overlay-backdrop { display: none !important; }
      .code-block-decoration.footer, .code-block-decoration.header {
        user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;
      }
      .mat-mdc-focus-indicator::before { border: none !important; }
    `;
        // NOTE: Per feedback, do NOT force-position the model switcher.

        const nums = ['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth'];

        // Ensure "Show more" expanded & support ?q=
        let showMoreClicked = false;
        let inputBarClicked = false;
        const initialObserver = new MutationObserver(() => {
            const showMore = document.querySelector(CFG.selectors.showMoreButton);
            const inputBar = document.querySelector(CFG.selectors.textInputField);
            const textInput = document.querySelector(CFG.selectors.enterPrompt);

            if (showMore && !showMoreClicked) {
                showMoreClicked = true;
                simulateClick(showMore);
            }

            if (hasQuery && inputBar && !inputBarClicked) {
                if (textInput) {
                    inputBarClicked = true;
                    params.delete('q');
                    window.history.pushState(null, '', url.origin + url.pathname);

                    setTimeout(() => {
                        inputBar.click();
                        setTimeout(() => {
                            if (textInput.firstChild) textInput.firstChild.remove();
                            for (const line of query.split('\n')) {
                                const p = document.createElement('p');
                                p.innerText = line;
                                textInput.append(p);
                            }
                            const draftsObs = new MutationObserver(() => {
                                const showDrafts = document.querySelector(CFG.selectors.generateMoreDraftsButton);
                                if (showDrafts) {
                                    draftsObs.disconnect();
                                    setTimeout(() => {
                                        url = new URL(window.location.href);
                                        params = new URLSearchParams(url.search);
                                        window.history.pushState(null, '', url.origin + url.pathname);
                                    }, 2000);
                                }
                            });
                            draftsObs.observe(document.body, { childList: true, subtree: true });

                            setTimeout(() => {
                                const sendBtn = document.querySelector(CFG.selectors.sendMessageButton);
                                if (sendBtn) sendBtn.click();
                            }, rapidClickDelayMS);
                        }, rapidClickDelayMS);
                    }, rapidClickDelayMS);
                }
            } else if (inputBar && !inputBarClicked) {
                inputBarClicked = true;
                setTimeout(() => inputBar.click(), rapidClickDelayMS);
            }

            if (showMoreClicked && inputBarClicked) initialObserver.disconnect();
        });
        initialObserver.observe(document.body, { childList: true, subtree: true });

        // ====== Helpers ======
        let c = null;
        function getLastElement(querySelector) {
            const containers = document.querySelectorAll('.conversation-container');
            c = containers[containers.length - 1];
            if (!assumeLastResponse) {
                let mostVisibleElement = null;
                let maxVisibleArea = 0;
                containers.forEach((container) => {
                    const rect = container.getBoundingClientRect();
                    const vh = window.innerHeight;
                    const visibleArea = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
                    if (visibleArea > maxVisibleArea && visibleArea !== 0) {
                        maxVisibleArea = visibleArea;
                        mostVisibleElement = container;
                    }
                });
                c = mostVisibleElement || c;
            }
            const list = c ? c.querySelectorAll(querySelector) : [];
            return list[list.length - 1] || null;
        }

        function copyRichTextFromDiv(element) {
            if (!element) return;
            document.querySelectorAll(CFG.selectors.hideDuringCopy)
                .forEach((el) => (el.style.display = 'none'));

            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
            try { document.execCommand('copy'); } catch (_) {}
            selection.removeAllRanges();

            setTimeout(() => {
                document.querySelectorAll(CFG.selectors.hideDuringCopyRestore)
                    .forEach((el) => (el.style.display = ''));
            }, rapidClickDelayMS);
        }

        function clearNotifications() {
            for (const ele of document.querySelectorAll('.gemini-key-notification')) ele.remove();
        }

        function notify(text) {
            clearNotifications();
            const div = document.createElement('div');
            div.className = 'gemini-key-notification';
            const tDuration = 125, nDuration = 3000, tLeft = nDuration - tDuration;
            div.textContent = text;
            div.style.cssText = `
        position:fixed; bottom:26px; left:26px; font-family:sans-serif; font-size:.875rem;
        color:#fff; border-radius:4px; background:#333; z-index:2147483647; padding:14px 16px;
        box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);
        transition:opacity ${tDuration}ms ease-in-out, transform ${tDuration}ms ease-in-out;
        transform-origin:center bottom; transform:scale(.8); opacity:0; max-width:calc(100% - 52px); box-sizing:border-box;
      `;
          document.body.appendChild(div);
          setTimeout(() => { div.style.opacity = '1'; div.style.transform = 'scale(1)'; }, 10);
          setTimeout(() => {
              div.style.opacity = '0'; div.style.transform = 'scale(.8)';
              setTimeout(() => { if (div.parentNode) div.remove(); }, tDuration);
          }, tLeft);
      }

        function simulateClick(el) { if (el) el.click(); else throw new Error('Element not found for click().'); }

        // ====== Drafts ======
        let draftIndex = 0;
        let googleDraftCount = 3;
        let waitOnGeneration = false;

        function changeDraft(direction) {
            let draftButtons = document.querySelectorAll(CFG.selectors.draftPreviewButton);
            if (!waitOnGeneration) draftIndex = (draftIndex + direction + googleDraftCount) % googleDraftCount;

            if (!waitOnGeneration && draftButtons[draftIndex]) {
                simulateClick(draftButtons[draftIndex]);
            } else if (!waitOnGeneration) {
                simulateClick(getLastElement(CFG.selectors.generateMoreDraftsButton));
                notify(`Generating ${nums[draftIndex]} draft`);
                waitOnGeneration = true;

                const obs = new MutationObserver(() => {
                    draftButtons = document.querySelectorAll(CFG.selectors.draftPreviewButton);
                    if (draftButtons[draftIndex]) {
                        obs.disconnect();
                        setTimeout(() => {
                            waitOnGeneration = false;
                            simulateClick(draftButtons[draftIndex]);
                        }, rapidClickDelayMS * 2);
                    }
                });
                obs.observe(document.body, { childList: true, subtree: true });
            } else {
                notify('Waiting on generation');
            }
        }
        const nextDraft = () => changeDraft(1);
        const previousDraft = () => changeDraft(-1);

        // ====== Chats ======
        let chatIndex = 0;
        let waitOnLoadingMore = false;

        function changeChat(direction) {
            chatIndex = Array.from(document.querySelectorAll(CFG.selectors.conversation))
                .indexOf(document.querySelector(CFG.selectors.selectedConversation));
            let chatButtons = document.querySelectorAll(CFG.selectors.conversation);

            if (!waitOnLoadingMore) chatIndex = Math.max(0, chatIndex + direction);

            if (!waitOnLoadingMore && chatButtons[chatIndex]) {
                simulateClick(chatButtons[chatIndex]);
                notify(`"${chatButtons[chatIndex].querySelector(CFG.selectors.conversationTitle).innerText.trim()}"`);
            } else if (!waitOnLoadingMore) {
                simulateClick(document.querySelector(CFG.selectors.loadMoreButton));
                notify('Loading chats');
                waitOnLoadingMore = true;

                const obs = new MutationObserver(() => {
                    chatButtons = document.querySelectorAll(CFG.selectors.conversation);
                    if (chatButtons[chatIndex]) {
                        obs.disconnect();
                        setTimeout(() => {
                            waitOnLoadingMore = false;
                            simulateClick(chatButtons[chatIndex]);
                            notify(`"${chatButtons[chatIndex].querySelector(CFG.selectors.conversationTitle).innerText.trim()}"`);
                        }, rapidClickDelayMS * 2);
                    }
                });
                obs.observe(document.body, { childList: true, subtree: true });
            } else {
                notify('Chats loading');
            }
        }
        const nextChat = () => changeChat(1);
        const previousChat = () => changeChat(-1);

        // ====== Model Switching ======
        function switchModel(modelNumber) {
            const modelIndex = modelNumber - 1;
            const switcher = document.querySelector(CFG.selectors.modelSwitcherButton);
            if (!switcher) { notify('Model switcher button not found.'); return; }
            simulateClick(switcher);
            setTimeout(() => {
                const panel = document.body.querySelector(CFG.selectors.modelMenuPanel);
                const content = panel ? panel.querySelector(CFG.selectors.modelMenuContent) : null;
                const buttons = content ? content.querySelectorAll(CFG.selectors.modelMenuItem) : null;
                if (buttons && buttons.length && modelIndex >= 0 && modelIndex < buttons.length) {
                    const btn = buttons[modelIndex];
                    const name = (btn.textContent || '').trim().replace(/\s+/g, ' ') || `Model ${modelNumber}`;
                    simulateClick(btn);
                    notify(`Switched to ${name}`);
                } else {
                    notify(`Model number ${modelNumber} is invalid or not available.`);
                }
            }, 10);
        }

        // ====== Sidebar Toggle ======
        function toggleSidebar() {
            const toggle =
                  document.querySelector(CFG.selectors.sidebarHide) ||
                  document.querySelector(CFG.selectors.sidebarShow) ||
                  document.querySelector(CFG.selectors.mainMenu) ||
                  document.querySelector(CFG.selectors.menuToggleButton);

            if (toggle) simulateClick(toggle);
            else {
                const side = document.querySelector('bard-sidenav-container');
                if (side) side.toggleAttribute('collapsed');
                else notify('Sidebar toggle not found.');
            }
        }

        // ====== New Chat (final selector) ======
        function openNewChat() {
            const btn = document.querySelector(CFG.selectors.newChatButton);
            if (btn) {
                simulateClick(btn);
                setTimeout(() => {
                    const inputBar = document.querySelector(CFG.selectors.textInputField);
                    if (inputBar) inputBar.click();
                }, rapidClickDelayMS);
            } else {
                notify('New Chat button not found.');
            }
        }

        // ====== Key Handling ======
        const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

        function handleKeydown(event) {
            const key = (event.key || '').toLowerCase();
            const code = event.code;
            const isCmdOrCtrl = (isMac && event.metaKey) || (!isMac && event.ctrlKey);
            const activeEl = document.activeElement;

            // --- Robust Help shortcut: Cmd/Ctrl + Shift + ? ---
            if (
                isCmdOrCtrl &&
                event.shiftKey &&
                (
                    key === (CFG.hotkeys.showHelp.key || '?') ||
                    (CFG.hotkeys.showHelp.altKeys || []).includes(key) ||
                    (CFG.hotkeys.showHelp.codes || []).includes(code)
                )
            ) {
                event.preventDefault();
                showHelpPopup();
                return;
            }

            // --- Standalone Shortcuts ---

            // Alt+Number jump (1-9/0=10)
            let keyNumber = parseInt(event.code.replace('Digit', ''), 10);
            keyNumber = keyNumber === 0 ? 10 : keyNumber;
            if (event.altKey && keyNumber) {
                const items = document.querySelectorAll(CFG.selectors.conversation);
                if (items[keyNumber - 1]) {
                    items[keyNumber - 1].click();
                    const title = items[keyNumber - 1].querySelector(CFG.selectors.conversationTitle).innerHTML.trim();
                    notify(`"${title}"`);
                }
                event.preventDefault();
                return;
            }

            // Cancel edit (Esc while editing)
            if (key === 'escape' && !event.shiftKey && activeEl?.getAttribute('aria-label')?.includes('Edit prompt')) {
                const cancel = getLastElement(CFG.selectors.editorCancel);
                if (cancel) simulateClick(cancel);
                event.preventDefault();
                return;
            }

            // Model switch: Ctrl + [1-9/0]
            if (event.ctrlKey && keyNumber) {
                switchModel(keyNumber);
                event.preventDefault();
                return;
            }

            // --- Cmd/Ctrl Shortcuts ---

            // Open file: Cmd/Ctrl + O
            if (isCmdOrCtrl && !event.shiftKey && key === CFG.hotkeys.openFile.key) {
                event.preventDefault();
                const upBtn = document.querySelector(CFG.selectors.uploadButtonPrimary)
                || document.querySelector(CFG.selectors.uploadButtonAlt);
                if (upBtn) simulateClick(upBtn);
                return;
            }

            // Sidebar: Cmd/Ctrl + B
            if (isCmdOrCtrl && !event.shiftKey && key === CFG.hotkeys.sidebarToggle.key) {
                event.preventDefault();
                toggleSidebar();
                return;
            }

            // --- Cmd/Ctrl + Shift Shortcuts ---

            // This block now correctly requires BOTH Cmd/Ctrl and Shift to be pressed.
            if (isCmdOrCtrl && event.shiftKey) {
                switch (key) {
                        // New Chat: Cmd/Ctrl + Shift + O
                    case CFG.hotkeys.newChat.key: {
                        openNewChat();
                        event.preventDefault();
                        break;
                    }
                    case 'c': {
                        getLastElement();
                        const resp = c ? c.querySelector(CFG.selectors.modelResponseText) : null;
                        copyRichTextFromDiv(resp);
                        notify('Copied response');
                        event.preventDefault();
                        break;
                    }
                    case 'f': {
                        const mainMenu = document.querySelector(CFG.selectors.mainMenu);
                        simulateClick(mainMenu);
                        event.preventDefault();
                        break;
                    }
                    case 'backspace': {
                        event.preventDefault();
                        chatIndex = Array.from(document.querySelectorAll(CFG.selectors.conversation))
                            .indexOf(document.querySelector(CFG.selectors.selectedConversation));
                        const actions = document.querySelector('.conversation.selected')
                        ?.parentElement?.querySelector(CFG.selectors.actionsMenuButton);
                        simulateClick(actions);
                        setTimeout(() => {
                            simulateClick(document.body.querySelector(CFG.selectors.deleteButton));
                        }, rapidClickDelayMS);
                        setTimeout(() => {
                            simulateClick(document.body.querySelector(CFG.selectors.confirmButton));
                            setTimeout(() => {
                                if (goToNextChatOnDelete) {
                                    const next = document.querySelectorAll(CFG.selectors.conversation)[chatIndex];
                                    if (next) simulateClick(next);
                                }
                            }, rapidClickDelayMS);
                        }, rapidClickDelayMS * 2); // Increased delay to ensure menu is open
                        break;
                    }
                    case 'd': {
                        let el = getLastElement(CFG.selectors.redoButton) || getLastElement(CFG.selectors.regenerateDraftsTooltip);
                        simulateClick(el);
                        event.preventDefault();
                        break;
                    }
                    case 'e': {
                        simulateClick(getLastElement(CFG.selectors.editTextTooltip));
                        event.preventDefault();
                        break;
                    }
                    case ';': {
                        event.preventDefault();
                        getLastElement();
                        const blocks = c ? c.querySelectorAll('code-block') : [];
                        copyRichTextFromDiv(blocks[blocks.length - 1]);
                        notify('Copied last code block to clipboard');
                        break;
                    }
                    case "'": {
                        event.preventDefault();
                        getLastElement();
                        const blocks = c ? c.querySelectorAll('code-block') : [];
                        copyRichTextFromDiv(blocks[blocks.length - 2]);
                        notify('Copied second-last code block to clipboard');
                        break;
                    }
                    case 'm': {
                        simulateClick(getLastElement(CFG.selectors.shareButton));
                        setTimeout(() => simulateClick(document.querySelector(CFG.selectors.shareResponseButton)), rapidClickDelayMS);
                        setTimeout(() => simulateClick(document.querySelector(CFG.selectors.shareModeFull)), rapidClickDelayMS * 2);
                        setTimeout(() => simulateClick(document.querySelector(CFG.selectors.createButton)), rapidClickDelayMS * 3);

                        const obs = new MutationObserver(() => {
                            const element = document.querySelector(CFG.selectors.copyPublicLinkButton);
                            if (element) {
                                obs.disconnect();
                                simulateClick(element);
                                setTimeout(() => {
                                    simulateClick(document.querySelector(CFG.selectors.closeDialogButton));
                                    notify('Chat link copied');
                                }, rapidClickDelayMS);
                            }
                        });
                        obs.observe(document.body, { childList: true, subtree: true });
                        clearNotifications();
                        event.preventDefault();
                        break;
                    }
                    case 'l': {
                        simulateClick(getLastElement(CFG.selectors.shareButton));
                        setTimeout(() => simulateClick(document.querySelector(CFG.selectors.shareResponseButton)), rapidClickDelayMS);
                        setTimeout(() => simulateClick(document.querySelector(CFG.selectors.createButton)), rapidClickDelayMS * 2);

                        const obs = new MutationObserver(() => {
                            const element = document.querySelector(CFG.selectors.copyPublicLinkButton);
                            if (element) {
                                obs.disconnect();
                                simulateClick(element);
                                setTimeout(() => {
                                    simulateClick(document.querySelector(CFG.selectors.closeDialogButton));
                                    notify('Prompt/response link copied');
                                }, rapidClickDelayMS);
                            }
                        });
                        obs.observe(document.body, { childList: true, subtree: true });
                        event.preventDefault();
                        break;
                    }
                    case ',': { previousDraft(); break; }
                    case '.': { nextDraft(); break; }
                    case '-': { event.preventDefault(); previousChat(); break; }
                    case '=': { event.preventDefault(); nextChat(); break; }
                    case 'k': {
                        event.preventDefault();
                        simulateClick(document.querySelector(CFG.selectors.sendMessageButton));
                        break;
                    }
                    case 'y': {
                        simulateClick(getLastElement(CFG.selectors.codeTTSButton));
                        event.preventDefault();
                        break;
                    }
                    case 's': {
                        simulateClick(document.querySelector(CFG.selectors.micButton));
                        event.preventDefault();
                        break;
                    }
                }
            }
        }

        document.addEventListener('keydown', (event) => {
            try { handleKeydown(event); }
            catch (error) { notify(`Failed to execute shortcut: ${error}`); }
        }, { capture: true });

        // ====== Help Popup ======
        function showHelpPopup() {
            const existing = document.getElementById('gemini-help-popup');
            if (existing) {
                existing.remove();
                const overlay0 = document.getElementById('gemini-help-overlay');
                if (overlay0) overlay0.remove();
            }

            const overlay = document.createElement('div'); overlay.id = 'gemini-help-overlay';
            const popup = document.createElement('div'); popup.id = 'gemini-help-popup';

            const style = document.createElement('style');
            style.textContent = `
        #gemini-help-popup{background:#202124;color:#e8eaed;padding:25px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,.2);max-width:700px;max-height:80vh;overflow-y:auto;z-index:2147483647;font-family:sans-serif;line-height:1.6;position:relative}
        #gemini-help-popup h2{color:#8ab4f8;margin:0 0 15px;font-size:1.4em}
        #gemini-help-popup h3{color:#bdc1c6;margin:20px 0 10px;font-size:1.1em;border-bottom:1px solid #5f6368;padding-bottom:5px}
        #gemini-help-popup table{width:100%;border-collapse:collapse;margin-bottom:15px;font-size:.95em}
        #gemini-help-popup th,#gemini-help-popup td{border:1px solid #5f6368;padding:8px 12px;text-align:left}
        #gemini-help-popup th{background:#3c4043}
        #gemini-help-popup code{background:#3c4043;padding:2px 5px;border-radius:4px;font-family:monospace}
        #gemini-help-popup .close-button{position:absolute;top:10px;right:15px;background:none;border:none;font-size:1.8em;color:#9aa0a6;cursor:pointer;line-height:1}
        #gemini-help-popup .close-button:hover{color:#e8eaed}
        #gemini-help-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:2147483646;display:flex;justify-content:center;align-items:center}
      `;

          const close = document.createElement('button'); close.className = 'close-button'; close.title = 'Close (Esc)'; close.textContent = '×';
          const title = document.createElement('h2'); title.textContent = 'Gemini Keyboard Shortcuts Help';
          const intro = document.createElement('p'); intro.appendChild(document.createTextNode('Press '));
          const esc = document.createElement('code'); esc.textContent = 'Esc';
          intro.appendChild(esc); intro.appendChild(document.createTextNode(" or click the 'X' to close this window."));

          const section = (label, rows) => {
              const h3 = document.createElement('h3'); h3.textContent = label; popup.appendChild(h3);
              const table = document.createElement('table');
              const thead = table.createTHead(); const tr = thead.insertRow();
              const th1 = document.createElement('th'); th1.textContent = 'Shortcut (Mac/Windows)'; tr.appendChild(th1);
              const th2 = document.createElement('th'); th2.textContent = 'Action'; tr.appendChild(th2);
              const tbody = table.createTBody();
              rows.forEach(r => { const row = tbody.insertRow(); const c1 = row.insertCell(); const c2 = row.insertCell();
                                 const code = document.createElement('code'); code.textContent = r.key; c1.appendChild(code); c2.textContent = r.action; });
              popup.appendChild(table);
          };

          popup.appendChild(style); popup.appendChild(close); popup.appendChild(title); popup.appendChild(intro);

          section('Chat Management', [
              { key: '⌘/Ctrl + Shift + O', action: 'Open new chat' },        // UPDATED
              { key: '⌘/Ctrl + Shift + Backspace', action: 'Delete chat' },
              { key: '⌘/Ctrl + B', action: 'Hide/Show sidebar' },            // stays
              { key: '⌥/Alt + 1–9', action: 'Go to nth chat' },
              { key: '⌘/Ctrl + Shift + =', action: 'Next chat' },
              { key: '⌘/Ctrl + Shift + –', action: 'Previous chat' },
          ]);

          section('Text Input and Editing', [
              { key: 'Shift + Esc', action: 'Focus chat input' },
              { key: '⌘/Ctrl + Shift + E', action: 'Edit text' },
              { key: '⌘/Ctrl + Shift + ;', action: 'Copy last code block' },
              { key: "⌘/Ctrl + Shift + '", action: 'Copy second-to-last code block' },
              { key: '⌘/Ctrl + Shift + C', action: 'Copy response' },
              { key: '⌘/Ctrl + Shift + K', action: 'Stop/start generation' },
          ]);

          section('Draft Navigation', [
              { key: '⌘/Ctrl + Shift + D', action: 'Generate more drafts' },
              { key: '⌘/Ctrl + Shift + ,', action: 'Next draft' },
              { key: '⌘/Ctrl + Shift + .', action: 'Previous draft' },
          ]);

          section('Sharing and Linking', [
              { key: '⌘/Ctrl + Shift + L', action: 'Copy prompt/response link' },
              { key: '⌘/Ctrl + Shift + M', action: 'Copy chat link' },
          ]);

          section('Audio and File Shortcuts', [
              { key: '⌘/Ctrl + Shift + Y', action: 'Play/pause audio' },
              { key: '⌘/Ctrl + Shift + S', action: 'Voice to text' },
              { key: '⌘/Ctrl + O', action: 'Open file' },
          ]);

          section('Other', [
              { key: '⌘/Ctrl + Shift + ?', action: 'Show this help' },
              { key: 'Ctrl + 1–9/0', action: 'Switch Model (if available)' },
          ]);

          const h3 = document.createElement('h3'); h3.textContent = 'Disabling the Script'; popup.appendChild(h3);
          const p = document.createElement('p'); p.textContent = 'To temporarily or permanently disable these shortcuts:'; popup.appendChild(p);
          const ol = document.createElement('ol');
          [
              'Open the Tampermonkey extension menu in your browser.',
              'Go to the "Dashboard".',
              'Find the script named "Gemini Keyboard Shortcuts".',
              'Toggle the switch next to the script name to disable it.',
          ].forEach(t => { const li = document.createElement('li'); li.textContent = t; ol.appendChild(li); });
          popup.appendChild(ol);

          const closePopup = () => { overlay.remove(); document.removeEventListener('keydown', escListener); };
          const escListener = (e) => { if ((e.key || '').toLowerCase() === 'escape') closePopup(); };

          overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });
          close.addEventListener('click', closePopup);
          document.addEventListener('keydown', escListener);

          const style2 = document.createElement('style'); style2.textContent = `#gemini-help-popup{background:#202124}`;
          overlay.appendChild(style2);
          overlay.appendChild(popup);
          document.body.appendChild(overlay);
      }
        // ===== End Help Popup =====
    }
})();
