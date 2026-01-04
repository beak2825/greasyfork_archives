// ==UserScript==
// @name         OpenRouter Chat Enhancements
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.4.0
// @description  Navigation hotkeys, message highlight, floating speaker, scroll protections, perfect collapse/expand handling, and enhanced edit scroll lock.
// @author       cdr-x
// @match        https://openrouter.ai/chat*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/532789/OpenRouter%20Chat%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/532789/OpenRouter%20Chat%20Enhancements.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Inject highlight CSS for selected message
    const highlightStyle = document.createElement('style');
    highlightStyle.textContent = `
        .openrouter-nav-highlight {
            outline: 2px solid #3b82f6 !important;
            background: rgba(59,130,246,0.08) !important;
            border-radius: 0.5rem !important;
            transition: outline 0.15s, background 0.15s;
        }
    `;
    document.head.appendChild(highlightStyle);

    /*********************** SETTINGS MODULE **********************/
    // MODULE_VERSION: SettingsModule@1.0
    // Handles persistence and configuration
    class SettingsModule {
        constructor() {
            this.modifierKey = "Alt";
            this.panelEnabled = true;
            this.EDIT_LOCK_DURATION_MS = 3000;
            this.COLLAPSE_SCROLL_LOCK_MS = 500;
            this.ANTI_HYSTERESIS_MS = 50;
        }

        init() {
            this.modifierKey = GM_getValue('or_modifierKey', "Alt");
            this.panelEnabled = GM_getValue('or_panelEnabled', true);
        }

        save() {
            GM_setValue('or_modifierKey', this.modifierKey);
            GM_setValue('or_panelEnabled', this.panelEnabled);
        }
    }
    // Export to global namespace
    window.SettingsModule = SettingsModule;

    /*********************** UI MODULE **********************/
    // MODULE_VERSION: UIModule@1.2
    // Manages visual components (navigation panel)
    class UIModule {
        constructor() {
            // Remove speakerElem, speakerImg, and speakerName properties since they're no longer used
            this.panelElem = null;
        }

        init() {
            if (this.settings && this.settings.panelEnabled) {
                this.createPanel();
            }
        }

        // Remove the commented out createSpeakerFloat method entirely since it's no longer needed
        
        createPanel() {
            this.clearPanel();
            if (!this.settings || !this.settings.panelEnabled) return;
            this.panelElem = document.createElement("div");
            this.panelElem.id = "openrouter-nav-panel";
            this.panelElem.innerHTML = `
                <button class="openrouter-nav-btn" title="Previous Message (k)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                </button>
                <button class="openrouter-nav-btn" title="Next Message (j)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </button>
                <span class="openrouter-nav-divider"></span>
                <button class="openrouter-nav-btn" title="Top (Home)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="18 15 12 9 6 15"/>
                    </svg>
                </button>
                <button class="openrouter-nav-btn" title="Bottom (End)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                    </svg>
                </button>
                <span class="openrouter-nav-divider"></span>
                <button class="openrouter-nav-btn" title="Expand/Collapse (l/h)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="7 13 12 18 17 13"/>
                        <polyline points="7 6 12 11 17 6"/>
                    </svg>
                </button>
            `;
            document.body.appendChild(this.panelElem);
        }

        clearPanel() {
            if (this.panelElem) { this.panelElem.remove(); this.panelElem = null; }
        }

        // Modify updateSpeaker to avoid duplicate speaker visualization
        updateSpeaker(msgDiv) {
            // This method is kept for backward compatibility but doesn't create UI elements anymore
            // The actual speaker visualization is now handled by NavigationModule.showSpeakerForMessage
            return; // Just return without doing anything
        }

        // Keep these methods as they're used by NavigationModule.showSpeakerForMessage
        getSpeakerName(msgDiv) {
            const hdr = this.msgHeader(msgDiv);
            if (!hdr) return "";
            const a = hdr.querySelector('span a');
            if (a) return a.textContent.replace(/\|.*/,'').replace('(edited)','').trim();
            const span = hdr.querySelector('span');
            if (span) return span.textContent.replace(/\|.*/,'').replace('(edited)','').trim();
            return "";
        }

        getSpeakerAvatar(msgDiv) {
            const hdr = this.msgHeader(msgDiv);
            if (!hdr) return "";
            const img = hdr.querySelector("picture img, img");
            if (img) return img.src;
            return "";
        }

        msgHeader(msgDiv) {
            return msgDiv.querySelector('.group.flex.flex-col.gap-2.items-start > .flex.gap-2, .group.flex.flex-col.gap-2.items-end > .flex.gap-2') ||
                   msgDiv.querySelector('.flex.gap-2.items-center, .flex.gap-2.flex-row-reverse');
        }
    }
    // Export to global namespace
    window.UIModule = UIModule;

    /*********************** NAVIGATION MODULE **********************/
    // MODULE_VERSION: NavigationModule@1.2
    // Core message tracking and scrolling logic
    class NavigationModule {
        constructor() {
            this.scrollContainer = null;
            this.allMessages = [];
            this.highlighted = null;
            this.blockHighlightUntil = 0;
            this.lastInteractedMsg = null;
            this.latestInputEdit = 0;
            this.lastEditingMsg = null;
            this.editPasteProhibit = false;
            this.collapseRestoreMsg = null;
            this.speakerTooltip = null; // Add this line
            this.initSpeakerTooltip(); // Add this line
        }

        init(ui, settings) {
            this.ui = ui;
            this.settings = settings;
            this.scrollContainer = this.findScrollContainer();
            if (!this.scrollContainer) {
                console.warn("OpenRouter Chat Enhancements: Main chat container not found. Initialization aborted. The page might still be loading.");
                return;
            }
            // Removed this.setupObservers();
            this.ui.settings = settings; // pass settings to UI for panel visibility
            this.ui.init();
            this.updateMsgList();
            this.panelAndPageListeners();
            this.setupScrollListener();
            this.setupInputListeners();
            this.setupVisibilityAndResizeListeners();
        }

        findScrollContainer() {
            return document.querySelector('main div.overflow-y-scroll') ||
                   document.querySelector('main div[style*="overflow-y: auto;"]') ||
                   document.querySelector('main div[style*="overflow-y: scroll;"]') ||
                   document.querySelector('main');
        }

        findMessageContainers() {
            if (!this.scrollContainer) return [];
            // Relaxed: include all visible message containers, regardless of child structure
            return Array.from(
                this.scrollContainer.querySelectorAll('div.duration-200.group.my-2.flex.flex-col.gap-2.md\\:my-0')
            ).filter(d => d.offsetParent !== null);
        }

        msgContentElem(msgDiv) {
            return msgDiv.querySelector('.overflow-auto') || msgDiv.querySelector('div.flex.max-w-full.flex-col.relative.overflow-auto');
        }

        msgToggleExpandBtn(msgDiv) {
            return msgDiv.querySelector(
                'div.group.flex.flex-col.gap-2.items-start > div.flex.max-w-full.flex-col.relative.overflow-auto.gap-1.items-start.w-full > div > div > button, ' +
                'div.group.flex.flex-col.gap-2.items-end > div.flex.max-w-full.flex-col.relative.overflow-auto.gap-1.items-end.w-full > div > div > button'
            );
        }

        updateMsgList() {
            let prevId = this.highlighted?.dataset?.ormsgid;
            this.allMessages = this.findMessageContainers();
            this.allMessages.forEach((m, i) => {
                if (!m.dataset.ormsgid) m.dataset.ormsgid = "msg-" + Date.now() + "-" + Math.random();
            });
            if (prevId) {
                this.highlighted = this.allMessages.find(m => m.dataset?.ormsgid === prevId);
            }
            if (!this.highlighted && this.allMessages.length > 0) {
                this.highlighted = this.allMessages[this.allMessages.length - 1];
            }
            this.allMessages.forEach(m => m.classList.toggle('openrouter-nav-highlight', m === this.highlighted));
            if (this.highlighted) {
                this.ui.updateSpeaker(this.highlighted);
            } else {
                this.ui.updateSpeaker(null);
            }
        }

        highlightMsg(msgDiv, opts = {}) {
            if (msgDiv === null) {
                if (this.highlighted) this.highlighted.classList.remove('openrouter-nav-highlight');
                this.highlighted = null;
                this.ui.updateSpeaker(null);
                this.showSpeakerForMessage(null); // Add this line to hide when no message is selected
                return;
            }
            if (!msgDiv || !document.body.contains(msgDiv)) return;
            if (this.editPasteProhibit && this.lastEditingMsg && this.lastEditingMsg !== msgDiv) return;
            if (Date.now() < this.blockHighlightUntil && !opts.force) return;
            if (this.highlighted) this.highlighted.classList.remove('openrouter-nav-highlight');
            this.highlighted = msgDiv;
            this.highlighted.classList.add('openrouter-nav-highlight');
            this.ui.updateSpeaker(this.highlighted);
            this.lastInteractedMsg = this.highlighted;
            this.showSpeakerForMessage(this.highlighted); // Add this line
            if (opts.scrollIntoView) {
                this.highlighted.scrollIntoView({ behavior: "smooth", block: opts.block || "center" });
                if (opts.scrollTop) {
                    let ct = this.msgContentElem(this.highlighted);
                    if (ct) ct.scrollTop = 0;
                }
                if (opts.scrollBottom) {
                    let ct = this.msgContentElem(this.highlighted);
                    if (ct) ct.scrollTop = ct.scrollHeight;
                }
            }
        }

        navToMsg(dir = 1) {
            if (!this.allMessages.length) return;
            let idx = this.highlighted ? this.allMessages.indexOf(this.highlighted) : -1;
            let nextIdx = idx + dir;
            if (nextIdx < 0) nextIdx = 0;
            if (nextIdx > this.allMessages.length - 1) nextIdx = this.allMessages.length - 1;
            this.blockHighlightUntil = Date.now() + 350;
            if (this.allMessages[nextIdx]) this.highlightMsg(this.allMessages[nextIdx], { scrollIntoView: true, force: true });
        }

        scrollMsgTop() {
            if (!this.highlighted) return;
            let ct = this.msgContentElem(this.highlighted);
            if (ct) ct.scrollTop = 0;
            this.highlighted.scrollIntoView({ behavior: "smooth", block: "start" });
            this.blockHighlightUntil = Date.now() + 300;
        }

        scrollMsgBottom() {
            if (!this.highlighted) return;
            let ct = this.msgContentElem(this.highlighted);
            if (ct) ct.scrollTop = ct.scrollHeight;
            this.highlighted.scrollIntoView({ behavior: "smooth", block: "end" });
            this.blockHighlightUntil = Date.now() + 300;
        }

        toggleMsgExpand() {
            if (!this.highlighted) return;
            const btn = this.msgToggleExpandBtn(this.highlighted);
            if (!btn) return;
            this.handleToggleScroll(this.highlighted);
            btn.click();
        }

        handleToggleScroll(msgDiv) {
            this.collapseRestoreMsg = msgDiv;
            const scrollContainer = this.findScrollContainer();
            const scrollTopBefore = scrollContainer.scrollTop;
            const msgTopBefore = msgDiv.offsetTop;
            const visualTop = msgTopBefore - scrollTopBefore;
            setTimeout(() => {
                let msg = this.allMessages.find(m => m.dataset.ormsgid === this.collapseRestoreMsg.dataset.ormsgid);
                if (msg) {
                    const msgTopAfter = msg.offsetTop;
                    scrollContainer.scrollTop = msgTopAfter - visualTop;
                    this.highlightMsg(msg, { force: true });
                    this.ensureScrollInBounds(msg);
                }
                this.collapseRestoreMsg = null;
                this.blockHighlightUntil = Date.now() + this.settings.COLLAPSE_SCROLL_LOCK_MS;
            }, 210);
        }

        refreshActiveMsg() {
            if (!this.highlighted) return;
            // Use the full SVG path selector from old script for refresh button
            const refreshSelectors = [
                'svg path[d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"]',
                'button[aria-label="Refresh"]',
                'button[title="Refresh"]',
                'button svg[viewBox="0 0 24 24"] path[d*="M17.65 6.35A10 10 0 1 1 6.35 17.65"]',
                'button svg[viewBox="0 0 24 24"] path[d*="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1-18 0z"]'
            ];

            let refreshButton = null;
            for (const selector of refreshSelectors) {
                const el = this.highlighted.querySelector(selector);
                if (el) {
                    refreshButton = el.closest('button') || el;
                    break;
                }
            }

            if (refreshButton) {
                refreshButton.click();
            }
        }

        updateHighlightOnScroll() {
            if (Date.now() < this.blockHighlightUntil) return;
            if (this.editPasteProhibit && this.lastEditingMsg) {
                this.ensureScrollInBounds(this.lastEditingMsg);
                return;
            }
            let best = null, maxVH = 0;
            const containerRect = this.scrollContainer.getBoundingClientRect();
            this.allMessages.forEach(m => {
                const rect = m.getBoundingClientRect();
                let top = Math.max(rect.top, containerRect.top);
                let bot = Math.min(rect.bottom, containerRect.bottom);
                let visH = Math.max(0, bot - top);
                if (visH > maxVH && visH > 48) {
                    maxVH = visH;
                    best = m;
                }
            });
            if (best && best !== this.highlighted) {
                this.highlightMsg(best);
            }
        }

        enforceScrollBoundOnEdit() {
            const act = document.activeElement;
            if (act && act.closest('.duration-200.group.my-2.flex.flex-col.gap-2.md\\:my-0') && (act.matches('input:not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]'))) {
                const activeMsg = act.closest('.duration-200.group.my-2.flex.flex-col.gap-2.md\\:my-0');
                if (activeMsg && document.body.contains(activeMsg)) {
                    this.lastEditingMsg = activeMsg;
                    this.latestInputEdit = Date.now();
                    this.editPasteProhibit = true;
                    this.highlightMsg(activeMsg, { force: true });
                    this.ensureScrollInBounds(activeMsg);
                    if (this.scrollLockTimeout) clearTimeout(this.scrollLockTimeout);
                    this.scrollLockTimeout = setTimeout(() => {
                        if (Date.now() - this.latestInputEdit >= this.settings.EDIT_LOCK_DURATION_MS) {
                            this.editPasteProhibit = false;
                            this.lastEditingMsg = null;
                            this.scrollLockTimeout = null;
                        }
                    }, this.settings.EDIT_LOCK_DURATION_MS);
                }
            }
        }

        ensureScrollInBounds(msgDiv) {
            if (!msgDiv || !this.scrollContainer) return;
            const msgRect = msgDiv.getBoundingClientRect();
            const scRect = this.scrollContainer.getBoundingClientRect();
            if (msgRect.top < scRect.top || msgRect.bottom > scRect.bottom) {
                msgDiv.scrollIntoView({ behavior: "auto", block: "center" });
            }
        }

        disableContainerScroll() {
            if (this.scrollContainer) this.scrollContainer.style.overflowY = 'hidden';
        }

        enableContainerScroll() {
            if (this.scrollContainer) this.scrollContainer.style.overflowY = 'auto';
        }

        panelAndPageListeners() {
            this.scrollContainer.addEventListener('click', e => {
                const msg = e.target.closest('.duration-200.group.my-2.flex.flex-col.gap-2.md\\:my-0');
                if (msg && this.allMessages.includes(msg)) this.highlightMsg(msg, { force: true });
            });
            this.scrollContainer.addEventListener('focusin', e => {
                const msg = e.target.closest('.duration-200.group.my-2.flex.flex-col.gap-2.md\\:my-0, [data-ormsgid]');
                if (msg && this.allMessages.includes(msg)) this.highlightMsg(msg, { force: true });
            });
            this.scrollContainer.addEventListener('mousedown', e => {
                const msg = e.target.closest('.duration-200.group.my-2.flex.flex-col.gap-2.md\\:my-0, [data-ormsgid]');
                if (msg && this.allMessages.includes(msg)) this.highlightMsg(msg, { force: true });
            });
            const observer = new MutationObserver(() => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => this.updateMsgList());
                });
            });
            observer.observe(this.scrollContainer, { childList: true, subtree: true });

            const expandCollapseSelector = 'div.group.flex.flex-col.gap-2.items-start > div.flex.max-w-full.flex-col.relative.overflow-auto.gap-1.items-start.w-full > div > div > button, ' +
                                           'div.group.flex.flex-col.gap-2.items-end > div.flex.max-w.full.flex-col.relative.overflow-auto.gap-1.items-end.w-full > div > div > button';
            this.scrollContainer.addEventListener('mousedown', e => {
                const btn = e.target.closest(expandCollapseSelector);
                if (btn) {
                    const msgDiv = btn.closest('.duration-200.group.my-2.flex.flex-col.gap-2.md\\:my-0');
                    if (msgDiv && this.allMessages.includes(msgDiv)) {
                        this.handleToggleScroll(msgDiv);
                    }
                }
            });
        }

        setupScrollListener() {
            let lastScrollUpd = 0;
            this.scrollContainer.addEventListener('scroll', () => {
                if (Date.now() - lastScrollUpd > this.settings.ANTI_HYSTERESIS_MS) {
                    this.updateHighlightOnScroll();
                    lastScrollUpd = Date.now();
                }
                if (this.editPasteProhibit && this.lastEditingMsg) {
                    this.ensureScrollInBounds(this.lastEditingMsg);
                }
            }, { passive: true });

            // Add wheel event listener to allow mouse wheel scrolling without interference
            this.scrollContainer.addEventListener('wheel', (e) => {
                // Do not blur or interfere with scrolling on wheel
                // Just allow the event to propagate normally
                // This prevents any focus blur that might block scrolling
                e.stopPropagation();
            }, { passive: true });
        }

        setupInputListeners() {
            document.addEventListener('input', () => this.enforceScrollBoundOnEdit(), true);
            document.addEventListener('paste', (e) => {
                this.enforceScrollBoundOnEdit();
                this.disableContainerScroll();
                setTimeout(() => this.enableContainerScroll(), 100);
            }, true);
            document.addEventListener('cut', () => this.enforceScrollBoundOnEdit(), true);

            document.addEventListener('focusout', () => {
                if (this.editPasteProhibit && Date.now() - this.latestInputEdit > this.settings.EDIT_LOCK_DURATION_MS / 2) {
                    this.editPasteProhibit = false;
                    this.lastEditingMsg = null;
                }
            }, true);

            setInterval(() => this.updateMsgList(), 880);
        }

        setupVisibilityAndResizeListeners() {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === "visible") setTimeout(() => this.updateMsgList(), 500);
            });

            window.addEventListener('resize', () => { setTimeout(() => this.updateHighlightOnScroll(), 80); });
        }

        initSpeakerTooltip() { // Add this new method
            this.speakerTooltip = document.createElement('div');
            this.speakerTooltip.id = 'speaker-tooltip-ch';
            Object.assign(this.speakerTooltip.style, {
                position: 'fixed',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(40, 40, 40, 0.9)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '8px',
                zIndex: '10001',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex', // Use flex for image and text
                alignItems: 'center', // Align items vertically
                gap: '8px', // Space between image and text
                opacity: '0', // Initially hidden, controlled by showSpeakerForMessage
                visibility: 'hidden', // Initially hidden
                boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out, visibility 0.2s ease-in-out'
            });
            document.body.appendChild(this.speakerTooltip);
        }

        showSpeakerForMessage(messageElement) { // Add this new method
            if (!this.speakerTooltip) this.initSpeakerTooltip();

            if (!messageElement) {
                this.speakerTooltip.style.opacity = '0';
                this.speakerTooltip.style.transform = 'translateX(-50%) translateY(-20px)';
                this.speakerTooltip.style.visibility = 'hidden';
                return;
            }

            // Use the same speaker name retrieval logic as in the UI module for consistency
            let speakerName = "Unknown Speaker";
            if (this.ui && this.ui.getSpeakerName) {
                speakerName = this.ui.getSpeakerName(messageElement) || speakerName;
            } else {
                // Fallback to previous logic if UI module is not available
                const speakerElement = messageElement.querySelector(
                    '.font-semibold, div[class*="speaker" i], span[class*="name" i], [data-testid*="speaker" i], [aria-label*="speaker" i]'
                );
                if (speakerElement) {
                    speakerName = speakerElement.textContent.trim();
                }
            }

            // Try to find speaker avatar
            let speakerAvatarSrc = null;
            const imgAvatar = messageElement.querySelector('img[alt]:not([alt=""]):not([alt*="logo"])');
            if (imgAvatar) {
                speakerAvatarSrc = imgAvatar.src;
            } else {
                const divAvatars = messageElement.querySelectorAll('div[style*="background-image"]');
                for (let divAvatar of divAvatars) {
                    const style = divAvatar.style.backgroundImage;
                    if (style && style.includes('url(')) {
                        if (divAvatar.offsetWidth > 10 && divAvatar.offsetWidth < 100 && divAvatar.offsetHeight > 10 && divAvatar.offsetHeight < 100) {
                            speakerAvatarSrc = style.substring(style.indexOf('url("') + 4, style.lastIndexOf(')')).replace(/["|']/g, "");
                            break;
                        }
                    }
                }
            }

            speakerName = speakerName.replace(/avatar/i, "").trim();
            if (!speakerName || speakerName.toLowerCase() === 'user' || speakerName.toLowerCase() === 'assistant') {
                const firstStrongBold = messageElement.querySelector('strong, b');
                if (firstStrongBold && firstStrongBold.parentElement.children.length === 1) {
                    speakerName = firstStrongBold.textContent.trim();
                }
            }

            this.speakerTooltip.innerHTML = '';

            if (speakerAvatarSrc) {
                const avatarImg = document.createElement('img');
                avatarImg.src = speakerAvatarSrc;
                Object.assign(avatarImg.style, {
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                });
                this.speakerTooltip.appendChild(avatarImg);
            }

            const nameSpan = document.createElement('span');
            nameSpan.textContent = speakerName;
            this.speakerTooltip.appendChild(nameSpan);

            this.speakerTooltip.style.visibility = 'visible';
            this.speakerTooltip.style.opacity = '1';
            this.speakerTooltip.style.transform = 'translateX(-50%) translateY(0)';
        }
    }
    // Export to global namespace
    window.NavigationModule = NavigationModule;

    /*********************** HOTKEY MODULE **********************/
    // MODULE_VERSION: HotkeyModule@1.1
    // Centralizes keyboard event handling
    class HotkeyModule {
        constructor(settings, navigation, ui) {
            this.settings = settings;
            this.navigation = navigation;
            this.ui = ui;
            this.lastFocusedMsg = null;

            this.patchedRetry = null;
            this.patchRetryFunction();
        }

        patchRetryFunction() {
            // Wait for the React context or message dispatch to be available
            const tryPatch = () => {
                try {
                    // Access the message dispatch from the navigation or ui
                    // Heuristic: navigation has a messages object with a dispatch method
                    if (this.navigation && this.navigation.ui && this.navigation.ui.messageDispatch) {
                        const dispatch = this.navigation.ui.messageDispatch;
                        if (dispatch && dispatch.retry && !dispatch.retry.__patched) {
                            const originalRetry = dispatch.retry;
                            const self = this;
                            dispatch.retry = async function(message, options) {
                                // Ignore isProcessing flag by not checking it
                                // Just call the original retry
                                return originalRetry.call(this, message, options);
                            };
                            dispatch.retry.__patched = true;
                            this.patchedRetry = dispatch.retry;
                            return true;
                        }
                    }
                    // Fallback: try to find global retry function
                    if (window && window.__RETRY_FUNCTION__ && !window.__RETRY_FUNCTION__.__patched) {
                        const originalRetry = window.__RETRY_FUNCTION__;
                        window.__RETRY_FUNCTION__ = async function(message, options) {
                            return originalRetry(message, options);
                        };
                        window.__RETRY_FUNCTION__.__patched = true;
                        this.patchedRetry = window.__RETRY_FUNCTION__;
                        return true;
                    }
                } catch (e) {
                    // Ignore errors
                }
                return false;
            };

            const intervalId = setInterval(() => {
                if (tryPatch()) {
                    clearInterval(intervalId);
                }
            }, 200);
        }

        async concurrentRetry(message) {
            if (this.patchedRetry) {
                await this.patchedRetry(message);
            } else {
                // Fallback: click refresh button
                this.navigation.refreshActiveMsg();
            }
        }

        init() {
            document.addEventListener('keydown', this.handleKey.bind(this));
        }

        isModifier(event) {
            if (this.settings.modifierKey === "None") return !event.ctrlKey && !event.altKey;
            if (this.settings.modifierKey === "Ctrl") return event.ctrlKey && !event.altKey;
            if (this.settings.modifierKey === "Alt") return event.altKey && !event.ctrlKey;
            return false;
        }

        isEditing() {
            const act = document.activeElement;
            return act && (act.matches('input, textarea, [contenteditable]'));
        }

        focusMainInput() {
            // Find all visible, enabled, non-readonly textareas/inputs
            const candidates = Array.from(document.querySelectorAll('textarea, input[type="text"], input:not([type])'))
                .filter(el => el.offsetParent !== null && !el.disabled && !el.readOnly);
            if (!candidates.length) return;
            // Pick the one closest to the bottom of the viewport (main chat input is usually at the bottom)
            let best = candidates[0];
            let maxBottom = -Infinity;
            candidates.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.bottom > maxBottom) {
                    maxBottom = rect.bottom;
                    best = el;
                }
            });
            best.focus();
            if (best.value && best.selectionStart !== undefined) best.selectionStart = best.value.length;
        }

        async handleKey(e) {
            let cancelledEdit = false; // Flag to track if Escape cancelled an edit

            // --- ESCAPE HANDLING ---
            if (e.key === "Escape") {
                const act = document.activeElement;
                const activeMsgContainer = act?.closest('.duration-200.group.my-2.flex.flex-col.gap-2.md\\:my-0');

                // If editing a message (textarea inside a message)
                if (activeMsgContainer && act.matches('textarea, [contenteditable]')) {
                    // Enhanced Cancel Button Finder with multiple strategies
                    let cancelBtn = null;
                    
                    // Strategy 1: Look for buttons with "Cancel" text or aria-label
                    const buttonsInMsg = Array.from(activeMsgContainer.querySelectorAll('button, [role="button"][type="button"], [type="button"]'));
                    cancelBtn = buttonsInMsg.find(btn => 
                        /cancel/i.test(btn.textContent || btn.innerText || btn.getAttribute('aria-label') || '')
                    );
                    
                    // Strategy 2: Look for buttons that appear during edit mode (often positioned near the textarea)
                    if (!cancelBtn) {
                        const editControls = act.closest('div')?.nextElementSibling;
                        if (editControls && editControls.querySelectorAll('button').length) {
                            const controlButtons = Array.from(editControls.querySelectorAll('button'));
                            // First button is often "Cancel" in edit controls
                            cancelBtn = controlButtons[0];
                        }
                    }
                    
                    // Strategy 3: Look for buttons with specific classes that might indicate cancel functionality
                    if (!cancelBtn) {
                        cancelBtn = activeMsgContainer.querySelector('button[class*="cancel" i], button[class*="secondary" i]');
                    }

                    if (cancelBtn) {
                        const msgToKeepSelected = activeMsgContainer;
                        
                        // Determine current scroll position relative to the message
                        const msgRect = activeMsgContainer.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        const msgCenter = msgRect.top + (msgRect.height / 2);
                        const isAboveHalfway = msgCenter < (viewportHeight / 2);
                        
                        cancelBtn.click();
                        
                        // Re-highlight the same message after cancelling edit with smart scrolling
                        setTimeout(() => {
                            if (msgToKeepSelected && document.body.contains(msgToKeepSelected)) {
                                this.navigation.highlightMsg(msgToKeepSelected, { 
                                    scrollIntoView: true, 
                                    force: true,
                                    // If above halfway point, scroll to top; otherwise scroll to bottom
                                    scrollTop: isAboveHalfway,
                                    scrollBottom: !isAboveHalfway
                                });
                            }
                            if (this.navigation.scrollContainer) {
                                this.navigation.scrollContainer.focus({ preventScroll: true });
                            }
                        }, 50); // Short delay
                        
                        cancelledEdit = true; // Set the flag
                        e.preventDefault();
                        return; // Stop further Escape processing for this event
                    }
                }
                // If main chat input is focused (robust: bottom-most visible textarea/input in a form)
                if (act && (act.matches('textarea, input[type="text"], input:not([type])'))) {
                    // Always blur the main chat input on Escape
                    act.blur();
                    // Restore highlight to last selected message
                    if (this.lastFocusedMsg && document.body.contains(this.lastFocusedMsg)) {
                        this.navigation.highlightMsg(this.lastFocusedMsg, { scrollIntoView: true, force: true });
                    }
                    e.preventDefault();
                    return;
                }
                // If a message is selected AND we didn't just cancel an edit, deselect
                if (!cancelledEdit && this.navigation.highlighted) {
                    this.lastFocusedMsg = this.navigation.highlighted;
                    this.navigation.highlightMsg(null);
                    // Optionally, focus the scroll container
                    if (this.navigation.scrollContainer) this.navigation.scrollContainer.focus();
                    e.preventDefault();
                    return;
                }
            }

            // --- CTRL+I: Focus main chat input ---
            if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "i") {
                this.focusMainInput();
                e.preventDefault();
                return;
            }

            // --- Only process below if not editing or if allowed ---
            if (
                e.target.matches('input, textarea, [contenteditable]') &&
                !["Home", "End", "PageUp", "PageDown"].includes(e.key)
            ) return;
            if (!this.isModifier(e)) return;

            let handled = false;
            switch (e.key) {
                // --- INVERTED NAVIGATION: j = up, k = down ---
                case 'j':
                    this.navigation.navToMsg(-1); // up
                    handled = true;
                    break;
                case 'k':
                    this.navigation.navToMsg(1); // down
                    handled = true;
                    break;
                // --- Expand/Collapse ---
                case 'l':
                case 'h':
                    this.navigation.toggleMsgExpand();
                    handled = true;
                    break;
                // --- Home/End: scroll within selected message (not in edit mode) ---
                case 'Home':
                    if (!this.isEditing() && this.navigation.highlighted) {
                        this.navigation.scrollMsgTop();
                        handled = true;
                    }
                    break;
                case 'End':
                    if (!this.isEditing() && this.navigation.highlighted) {
                        this.navigation.scrollMsgBottom();
                        handled = true;
                    }
                    break;
                // --- Refresh selected message ---
                case 'r':
                    if (this.navigation.highlighted) {
                        // Find the retry button in the highlighted message
                        const retryBtn = this.navigation.highlighted.querySelector('button[aria-label="Retry"], button[title="Retry"], button[aria-label*="Retry"], button[title*="Retry"]');
                        if (retryBtn) {
                            // If disabled, temporarily enable it to allow click
                            const wasDisabled = retryBtn.disabled;
                            if (wasDisabled) {
                                retryBtn.disabled = false;
                            }
                            retryBtn.click();
                            if (wasDisabled) {
                                // Restore disabled state after click
                                setTimeout(() => {
                                    retryBtn.disabled = true;
                                }, 100);
                            }
                            handled = true;
                        } else {
                            // Fallback: refresh active message
                            this.navigation.refreshActiveMsg();
                            handled = true;
                        }
                    }
                    break;
                // --- Copy button for selected message ---
                case 'c':
                    if (this.navigation.highlighted) {
                        let copyBtn = this.navigation.highlighted.querySelector('button[aria-label*="Copy"], button[title*="Copy"], button svg[aria-label*="Copy"], button svg[title*="Copy"]');
                        if (!copyBtn) {
                            // Try fallback: first button with copy icon
                            copyBtn = Array.from(this.navigation.highlighted.querySelectorAll('button')).find(btn =>
                                btn.innerHTML.match(/copy/i)
                            );
                        }
                        if (copyBtn) {
                            copyBtn.click();
                            handled = true;
                        }
                    }
                    break;
                // --- Edit button for selected message ---
                case 'e':
                    if (this.navigation.highlighted) {
                        // If already editing, just focus the existing textarea
                        if (this.navigation.highlighted.querySelector('textarea, [contenteditable]')) {
                            const existingTextarea = this.navigation.highlighted.querySelector('textarea, [contenteditable]');
                            if (existingTextarea) {
                                existingTextarea.focus();
                                // Move cursor to end
                                if (existingTextarea.setSelectionRange) {
                                    const len = existingTextarea.value.length;
                                    existingTextarea.setSelectionRange(len, len);
                                }
                            }
                            handled = true;
                            break;
                        }

                        let editBtn = null;
                        const buttons = Array.from(this.navigation.highlighted.querySelectorAll('button'));

                        // Priority 1: Button with specific SVG path (most reliable if path is stable)
                        editBtn = buttons.find(btn => btn.querySelector('svg path[d^="m16.862 4.487"]'));

                        // Priority 2: Button with text content "Edit" (from old script, good for accessibility)
                        if (!editBtn) {
                            editBtn = buttons.find(btn => (btn.textContent || btn.innerText || "").trim().toLowerCase() === 'edit');
                        }

                        // Priority 3: Button with aria-label or title containing "Edit"
                        if (!editBtn) {
                            editBtn = buttons.find(btn => {
                                const ariaLabel = btn.getAttribute('aria-label') || "";
                                const title = btn.getAttribute('title') || "";
                                return /edit/i.test(ariaLabel) || /edit/i.test(title);
                            });
                        }

                        // Priority 4: Button containing an SVG with a title or aria-label "Edit"
                        if (!editBtn) {
                            editBtn = buttons.find(btn => {
                                const svg = btn.querySelector('svg');
                                if (!svg) return false;
                                const svgTitle = svg.querySelector('title')?.textContent;
                                const svgAriaLabel = svg.getAttribute('aria-label');
                                return /edit/i.test(svgTitle || "") || /edit/i.test(svgAriaLabel || "");
                            });
                        }

                        if (editBtn) {
                            const msgContainer = this.navigation.highlighted;
                            
                            // Store a reference to the message before clicking
                            const msgId = msgContainer.dataset.ormsgid;
                            
                            // Set up a MutationObserver to detect when the textarea appears
                            let editObserver = null;
                            const setupObserver = () => {
                                if (editObserver) return; // Only set up once
                                
                                const currentMsg = document.querySelector(`[data-ormsgid="${msgId}"]`);
                                if (!currentMsg) return;
                                
                                editObserver = new MutationObserver((mutations, observer) => {
                                    for (const mutation of mutations) {
                                        if (mutation.type === 'childList' || mutation.type === 'subtree') {
                                            const editableSelectors = [
                                                'textarea', 
                                                '[contenteditable="true"]', 
                                                '[contenteditable]',
                                                'div[role="textbox"]',
                                                '.ProseMirror',
                                                '[data-slate-editor]'
                                            ];
                                            
                                            for (const selector of editableSelectors) {
                                                const editArea = currentMsg.querySelector(selector);
                                                if (editArea) {
                                                    // Focus immediately when detected
                                                    editArea.focus();
                                                    
                                                    // Move cursor to the end
                                                    if (editArea.setSelectionRange) {
                                                        const len = editArea.value.length;
                                                        editArea.setSelectionRange(len, len);
                                                    } else if (editArea.isContentEditable) {
                                                        try {
                                                            const range = document.createRange();
                                                            const sel = window.getSelection();
                                                            range.selectNodeContents(editArea);
                                                            range.collapse(false); // to the end
                                                            sel.removeAllRanges();
                                                            sel.addRange(range);
                                                        } catch (e) {
                                                            // Fallback if range manipulation fails
                                                            editArea.focus();
                                                        }
                                                    }
                                                    
                                                    // Disconnect after successful focus
                                                    observer.disconnect();
                                                    editObserver = null;
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                });
                                
                                // Observe the message container for changes
                                editObserver.observe(currentMsg, { 
                                    childList: true, 
                                    subtree: true,
                                    attributes: true,
                                    characterData: true
                                });
                                
                                // Set a timeout to disconnect the observer if it doesn't find anything
                                setTimeout(() => {
                                    if (editObserver) {
                                        editObserver.disconnect();
                                        editObserver = null;
                                    }
                                }, 3000); // 3 second timeout
                            };
                            
                            // Click the edit button
                            editBtn.click();
                            
                            // Set up the observer immediately
                            setupObserver();
                            
                            // Also use our previous approach with multiple attempts as a fallback
                            const focusEditArea = (attempt = 1) => {
                                const currentMsg = document.querySelector(`[data-ormsgid="${msgId}"]`);
                                if (!currentMsg) return;
                                
                                const editableSelectors = [
                                    'textarea', 
                                    '[contenteditable="true"]', 
                                    '[contenteditable]',
                                    'div[role="textbox"]',
                                    '.ProseMirror',
                                    '[data-slate-editor]'
                                ];
                                
                                let editArea = null;
                                for (const selector of editableSelectors) {
                                    editArea = currentMsg.querySelector(selector);
                                    if (editArea) break;
                                }
                                
                                if (editArea) {
                                    // Focus with a slight delay to ensure the element is ready
                                    setTimeout(() => {
                                        editArea.focus();
                                        
                                        // Move cursor to the end
                                        if (editArea.setSelectionRange) {
                                            const len = editArea.value.length;
                                            editArea.setSelectionRange(len, len);
                                        } else if (editArea.isContentEditable) {
                                            try {
                                                const range = document.createRange();
                                                const sel = window.getSelection();
                                                range.selectNodeContents(editArea);
                                                range.collapse(false);
                                                sel.removeAllRanges();
                                                sel.addRange(range);
                                            } catch (e) {
                                                editArea.focus();
                                            }
                                        }
                                    }, 10);
                                } else if (attempt < 5) { // Try up to 5 times
                                    // Use exponential backoff for retry timing
                                    setTimeout(() => focusEditArea(attempt + 1), Math.pow(2, attempt) * 50);
                                }
                            };
                            
                            // Try to focus immediately
                            focusEditArea(1);
                            
                            // And also after a short delay
                            setTimeout(() => focusEditArea(2), 100);
                            
                            // And after a longer delay as a last resort
                            setTimeout(() => focusEditArea(3), 300);
                            
                            handled = true;
                        }
                    }
                    break;
// ...existing code...
            }
            if (handled) e.preventDefault();
        }
    }
    // Export to global namespace
    window.HotkeyModule = HotkeyModule;

    /******************** INIT ENTRYPOINT ********************/
    async function initPowerNav() {
        // Initialize core modules
        const settings = new SettingsModule();
        const ui = new UIModule();
        const navigation = new NavigationModule();
        const hotkeys = new HotkeyModule(settings, navigation, ui);
        
        // Setup modules
        settings.init();

        // Register menu commands for settings
        GM_registerMenuCommand("Set Hotkey Modifier: (Alt/Ctrl/None)", () => {
            const val = prompt('Use which key as the hotkey modifier? (Alt, Ctrl, None)', settings.modifierKey);
            if (!val) return;
            const normalized = val.trim().toLowerCase();
            const ok = { alt: "Alt", ctrl: "Ctrl", none: "None" }[normalized];
            if (ok) {
                settings.modifierKey = ok;
                settings.save();
                alert("Modifier set to: " + ok);
            } else {
                alert("Invalid. Must be Alt, Ctrl or None.");
            }
        });

        GM_registerMenuCommand("Toggle Navigation Panel", () => {
            settings.panelEnabled = !settings.panelEnabled;
            settings.save();
            if (settings.panelEnabled) {
                ui.createPanel();
            } else {
                ui.clearPanel();
            }
            alert("Navigation panel " + (settings.panelEnabled ? "enabled" : "disabled") + ". Refresh page if needed.");
        });

        navigation.init(ui, settings);
        hotkeys.init();
    }
    // Export init to global namespace
    window.initPowerNav = initPowerNav;

    // Delay initialization slightly to allow dynamic content loading after document-end
    setTimeout(initPowerNav, 500);

})();