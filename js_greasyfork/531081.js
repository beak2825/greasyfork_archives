// ==UserScript==
// @name         LibreChat Shortcuts + Token Counter
// @namespace    http://tampermonkey.net/
// @version      3.3.0
// @description  Keyboard Shortcuts for LibreChat
// @author       bwhurd
// @match        http://localhost:3080/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js
// @require      https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollToPlugin.min.js
// @require      https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/Observer.min.js
// @require      https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/Flip.min.js
// @downloadURL https://update.greasyfork.org/scripts/531081/LibreChat%20Shortcuts%20%2B%20Token%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/531081/LibreChat%20Shortcuts%20%2B%20Token%20Counter.meta.js
// ==/UserScript==

// === Shortcut Keybindings ===
// Alt+S → Toggle sidebar (clicks #toggle-left-nav)
// Alt+N → New chat (clicks button[aria-label="New chat"])
// Alt+T → Scroll to top of message container
// Alt+Z → Scroll to bottom of message container
// Alt+W → Focus Chat Input
// Alt+C → Click Copy on lowest message, then strip markdown
// Alt+X → Select and copy, cycles visible messages
// Alt+A → Scroll up one message (.message-render)
// Alt+F → Scroll down one message (.message-render)
// Alt+; → Narrow ideal reading mode (66ch wide, line-height: 1.8). Persists state after reload.
// Alt+p   →  Toggles Private Chat

// Just start typing to go to input chatbox
// Paste input when not in chat box

// Alt+r → Toggle header in narrow mode. Persists state after reload.
// alt+m toggle maximize chat area, 5 clicks baby
// control+enter send message
// control+backspace stop generating
// control+; clicks stop then regenerate (or just regenerate if stop isn't available).

// Alt+q   →   toggle collapse expand chat
// alt+w   →   Open the preset menu to see the "defaults"
// alt+# 1-9 to activate presets
// alt+g Click right sidebar toggle with alt+g for parameter settings
// alt+e edit lowest user message
// alt+d simulate control enter with

// other fixes
// label presets with alt+1 to alt+9
// Convert <br> in tables displaying as literal <br> to line breaks

// Token Counter is disabled, uncomment to enable and use Alt+U to update the token cost per million

// replaces the multi-conversation and preset icons with ones that are intuitive
// hides ads disguised as features
// resizeable right sidebar width
// Flatten Bookmarks in right sidebar so all on single page, lazy load in chunks of 100

(function () {
    /* Creates a global CSS rule that hides:
     1. Anything with role="contentinfo"
     2. Any <button> whose aria-label is exactly "Code Interpreter" */

    const style = document.createElement('style');
    style.textContent = `

#bookmark-menu-button {
  line-height: 1 !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
#bookmark-menu-button svg {
  display: block !important;
  margin: auto !important;


  vertical-align: middle !important;
  /* Uncomment below if still off by a pixel: */
  /* transform: translateY(1px) !important; */
}

    /* Increase max-height on medium+ screens from 55vh to 75vh */
    @media (min-width: 768px) {
      .md\\:max-h-\\[55vh\\] {
        max-height: 75vh !important;
      }

/* 4 ▸ Slim, subtle scrollbar (Chromium only) */
#prompt-textarea::-webkit-scrollbar{width:8px;left: 8px;}
#prompt-textarea::-webkit-scrollbar-track{background:transparent;}
#prompt-textarea::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;}
#prompt-textarea::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.3); cursor:default;}

button.cursor-pointer {
    padding-right: .5em;
    margin-right: 2px;
    margin-left: 2px;
}

/* make sidebar items expose more text with smaller icon */
/* Make the icon smaller and less bold */
[data-testid="convo-icon"] {
  width: 14px !important;
  height: 14px !important;
  min-width: 0 !important;
  min-height: 0 !important;
}
[data-testid="convo-icon"] svg {
  width: 14px !important;
  height: 14px !important;
  opacity: 0.7 !important;
  filter: grayscale(70%) brightness(1.1) !important;
}

/* Give the text more space and expose more of it */
[data-testid="convo-item"] .grow,
[data-testid="convo-item"] .flex-1 {
  min-width: 0 !important;
  width: 100% !important;
  flex-shrink: 1 !important;
  flex-basis: 0 !important;
    font-size: 0.93em !important;
}

/* Optionally, shrink the right gradient if it's covering text */
[data-testid="convo-item"] .absolute.right-0 {
  width: 10px !important;
  pointer-events: none !important;
}

.ReactVirtualized__Grid {
  box-sizing: border-box;
  padding: 0!important;
}
.hide-scrollbar {
  padding-right: 2px !important;
}


.premium-scroll-button {
  display: none;
  align-items: center !important;
  justify-content: center !important;
  width: 32px !important;     /* adjust to preferred size */
  height: 32px !important;
  border-radius: 50% !important;
  padding: 0 !important;
  min-width: 0 !important;
  min-height: 0 !important;
  border: none !important;    /* remove border if undesired */
}

.premium-scroll-button svg {
  width: 20px !important;     /* ~62% of button, adjust as needed */
  height: 20px !important;
  display: block !important;
  margin: 0 auto !important;
  vertical-align: middle !important;
  pointer-events: none !important; /* optional, allows click-through to button */
}
button[aria-label="Temporary Chat"] {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  margin: 0 !important;
}

button[aria-label="Temporary Chat"] .lucide-message-circle-dashed {
  position: static !important;
  display: block !important;
  margin: 0 auto !important;
  float: none !important;
  transform: none !important;
  /* DO NOT touch width or height */
}

}

  `;
    document.head.appendChild(style);

})();



// lower message box div.w-full > form.mx-auto {margin-bottom: -20px;}


// Allow text area to expand area to become 85vh.
// Automatically collapse if clicking outside while expanded >50vh.
// Enhanced expand/collapse behaviour for the #prompt-textarea element
// Auto-collapse #prompt-textarea when it is >50 vh and user clicks / tabs away.
// Enhanced, simplified auto-collapse for #prompt-textarea
// Allow text area to expand area to become 75vh.
(function () {
    const textarea = document.getElementById('prompt-textarea');
    const toggleButton = document.querySelector('button[aria-label="Collapse Chat"]');

    if (!textarea || !toggleButton) return;

    // Define your preferred heights
    const expandedHeight = '85vh';
    const collapsedHeight = '100px';

    // Keep track of whether the textarea is currently expanded
    let isExpanded = true;

    // Helper functions to set inline styles with !important
    function setExpandedHeight() {
        textarea.style.setProperty('height', expandedHeight, 'important');
        textarea.style.setProperty('max-height', expandedHeight, 'important');
    }

    function setCollapsedHeight() {
        textarea.style.setProperty('height', collapsedHeight, 'important');
        textarea.style.setProperty('max-height', collapsedHeight, 'important');
    }

    // Set the initial state to expanded
    setExpandedHeight();

    // Watch for any changes to the style attribute (the page might reapply its own inline styles)
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                // If the page re-sets the inline style, override it
                if (isExpanded) {
                    setExpandedHeight();
                } else {
                    setCollapsedHeight();
                }
            }
        }
    });
    observer.observe(textarea, {
        attributes: true,
        attributeFilter: ['style']
    });

    // Toggle the textarea height on button click
    toggleButton.addEventListener('click', () => {
        if (isExpanded) {
            setCollapsedHeight();
        } else {
            setExpandedHeight();
        }
        isExpanded = !isExpanded;
    });
})();

// Shrink when click away
// Simplest auto-toggle on any click outside the textarea
// Auto-toggle expand/collapse when textarea loses focus (via focusin)
// Collapse Chat button click whenever #prompt-textarea loses focus

(function () {
    document.addEventListener('focusout', e => {
        if (e.target && e.target.id === 'prompt-textarea') {
            setTimeout(() => {
                const collapseBtn = document.querySelector('button[aria-label="Collapse Chat"]');
                if (collapseBtn) collapseBtn.click();
            }, 0);
        }
    });
})();






// scrolling and toggle sidebar shortcuts
(function () {
    'use strict';

    // === Inject custom CSS to override hidden footer button color ===
    const style = document.createElement('style');
    style.textContent = `
        .relative.hidden.items-center.justify-center {
            display:none;
        }
    `;
    document.head.appendChild(style);

    // Shared scroll state object
    const ScrollState = {
        scrollContainer: null,
        isAnimating: false,
        finalScrollPosition: 0,
        userInterrupted: false,
    };

    function resetScrollState() {
        if (ScrollState.isAnimating) {
            ScrollState.isAnimating = false;
            ScrollState.userInterrupted = true;
        }
        ScrollState.scrollContainer = getScrollableContainer();
        if (ScrollState.scrollContainer) {
            ScrollState.finalScrollPosition = ScrollState.scrollContainer.scrollTop;
        }
    }

    function getScrollableContainer() {
        const firstMessage = document.querySelector('.message-render');
        if (!firstMessage) return null;

        let container = firstMessage.parentElement;
        while (container && container !== document.body) {
            const style = getComputedStyle(container);
            if (
                container.scrollHeight > container.clientHeight &&
                style.overflowY !== 'visible' &&
                style.overflowY !== 'hidden'
            ) {
                return container;
            }
            container = container.parentElement;
        }

        return document.scrollingElement || document.documentElement;
    }

    function checkGSAP() {
        if (
            typeof window.gsap !== "undefined" &&
            typeof window.ScrollToPlugin !== "undefined" &&
            typeof window.Observer !== "undefined" &&
            typeof window.Flip !== "undefined"
        ) {
            gsap.registerPlugin(ScrollToPlugin, Observer, Flip);
            console.log("✅ GSAP and plugins registered");

        } else {
            console.warn("⏳ GSAP not ready. Retrying...");
            setTimeout(checkGSAP, 100);
        }
    }

    function loadGSAPLibraries() {
        const libs = [
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.7/gsap.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.7/ScrollToPlugin.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.7/Observer.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.7/Flip.min.js',
        ];

        libs.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            document.head.appendChild(script);
        });

        checkGSAP();
    }

    // === Universal Shortcut Handler (independent of GSAP) ===

    // Fallback scroll function if GSAP is missing
    function scrollToPosition(container, top) {
        if (!container) return;
        // If GSAP is available, use it
        if (window.gsap && window.ScrollToPlugin) {
            gsap.to(container, {
                duration: 0.6,
                scrollTo: { y: top },
                ease: "power4.out"
            });
        } else {
            container.scrollTop = top;
        }
    }

    // Scroll to top
    function scrollToTop() {
        const container = getScrollableContainer();
        if (!container) return;
        scrollToPosition(container, 0);
    }

    // Scroll to bottom
    function scrollToBottom() {
        const container = getScrollableContainer();
        if (!container) return;
        if (window.gsap && window.ScrollToPlugin) {
            gsap.to(container, {
                duration: 0.6,
                scrollTo: { y: "max" },
                ease: "power4.out"
            });
        } else {
            container.scrollTop = container.scrollHeight;
        }
    }

    // Scroll up one message
    function scrollUpOneMessage() {
        const container = getScrollableContainer();
        if (!container) return;

        const messages = [...document.querySelectorAll('.message-render')];
        const currentScrollTop = container.scrollTop;

        let target = null;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].offsetTop < currentScrollTop - 25) {
                target = messages[i];
                break;
            }
        }

        scrollToPosition(container, target?.offsetTop || 0);
    }

    // Scroll down one message
    function scrollDownOneMessage() {
        const container = getScrollableContainer();
        if (!container) return;

        const messages = [...document.querySelectorAll('.message-render')];
        const currentScrollTop = container.scrollTop;

        let target = null;
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].offsetTop > currentScrollTop + 25) {
                target = messages[i];
                break;
            }
        }

        scrollToPosition(container, target?.offsetTop || container.scrollHeight);
    }

    // Toggle sidebar (your original logic)
    function toggleSidebar() {
        const selectors = [
            '[data-testid="close-sidebar-button"]',
            '[data-testid="open-sidebar-button"]'
        ];
        for (const selector of selectors) {
            const btn = document.querySelector(selector);
            if (btn) {
                btn.click();
                console.log(`🧭 Sidebar toggled via ${selector}`);
                return;
            }
        }
        console.warn('⚠️ No sidebar toggle button found');
    }


    // alt+n for new chat Replace your existing openNewChat() with the following:
    function openNewChat() {
        const currentWidth = window.innerWidth;
        console.log('Viewport width:', currentWidth);

        if (currentWidth > 640) {
            // === 111 logic (for larger screens) ===
            console.log('Using 111 logic (larger than 640px)');
            const newChatButton = document.querySelector('button[aria-label="New chat"]');
            if (!newChatButton) {
                console.warn('❌ New chat button not found');
                return;
            }
            newChatButton.click();
            console.log('🆕 New chat opened');

            setTimeout(() => {
                const closeSidebarButton = document.querySelector('button[data-testid="close-sidebar-button"]');
                if (closeSidebarButton) {
                    // Important note: “111” is just open chat and (optionally) log a close sidebar
                    // If you actually want to close it, uncomment next line:
                    // closeSidebarButton.click();
                    console.log('⬅️ Sidebar closed');
                } else {
                    console.log('❌ Close sidebar button not found');
                }
            }, 100);

        } else {
            // === 222 logic (for 640px or smaller) ===
            console.log('Using 222 logic (640px or smaller)');
            const newChatButton = document.querySelector('button[aria-label="New chat"]');
            if (!newChatButton) {
                console.warn('❌ New chat button not found');
                return;
            }
            newChatButton.click();
            console.log('🆕 New chat opened');

            // Helper function to attempt closing sidebar
            function tryCloseSidebar() {
                const closeSidebarButton = document.querySelector('button[data-testid="close-sidebar-button"]');
                if (closeSidebarButton) {
                    closeSidebarButton.click();
                    console.log('⬅️ Sidebar closed');
                    return true;
                }
                return false;
            }

            // Try immediately in case the close button is already present
            if (tryCloseSidebar()) return;

            // Setup a MutationObserver to catch dynamic loads
            const observer = new MutationObserver(() => {
                if (tryCloseSidebar()) {
                    observer.disconnect();
                    clearTimeout(timeoutId);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // Stop observing after 2 seconds
            const timeoutId = setTimeout(() => {
                observer.disconnect();
                console.log('🛑 Finished watching for sidebar close button');
            }, 2000);
        }
    }

    // === Register the shortcut handler immediately (OUTSIDE any GSAP loading logic) ===
    document.addEventListener('keydown', function (e) {
        if (!e.altKey || e.repeat) return;

        const key = e.key.toLowerCase();
        const keysToBlock = ['s', 'n', 't', 'z', 'a', 'f'];
        if (keysToBlock.includes(key)) {
            e.preventDefault();
            e.stopPropagation();

            switch (key) {
                case 's': toggleSidebar(); break;
                case 'n': openNewChat(); break;
                case 't': scrollToTop(); break;
                case 'z': scrollToBottom(); break;
                case 'a': scrollUpOneMessage(); break;
                case 'f': scrollDownOneMessage(); break;
            }
        }
    });



    // Start loading GSAP plugins and wait for them
    loadGSAPLibraries();
})();


// alt+w to focus chat input. But also you can just start typing or just paste.

(function() {
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'j') {
            e.preventDefault();
            const chatInput = document.querySelector('#prompt-textarea');
            if (chatInput) {
                chatInput.focus();
            }
        }
    });
})();


// strip markdown when activating copy with alt+c
(function() {
    function removeMarkdown(text) {
        return text
        // Remove bold/italics
            .replace(/(\*\*|__)(.*?)\1/g, "$2")
            .replace(/(\*|_)(.*?)\1/g, "$2")
        // Remove leading '#' from headers
            .replace(/^#{1,6}\s+(.*)/gm, "$1")
        // Preserve indentation for unordered list items
            .replace(/^(\s*)[\*\-\+]\s+(.*)/gm, "$1- $2")
        // Preserve indentation for ordered list items
            .replace(/^(\s*)(\d+)\.\s+(.*)/gm, "$1$2. $3")
        // Remove triple+ line breaks
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            const allButtons = Array.from(document.querySelectorAll('button'));
            const visibleButtons = allButtons.filter(button =>
                                                     button.innerHTML.includes('M7 5a3 3 0 0 1 3-3h9a3')
                                                    ).filter(button => {
                const rect = button.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            });

            if (visibleButtons.length > 0) {
                const targetBtn = visibleButtons[visibleButtons.length - 1];
                targetBtn.click();


                setTimeout(async () => {
                    /* If we just pressed a table-copy button, leave clipboard as-is
       (it already contains HTML + TSV). */
                    if (targetBtn.dataset.isTableCopy === '1') return;

                    if (!navigator.clipboard) return;

                    try {
                        const txt = await navigator.clipboard.readText();
                        await navigator.clipboard.writeText(removeMarkdown(txt));
                        console.log('Markdown removed and copied.');
                    } catch (_) {}
                }, 100);

            }
        }
    });
})();


// alt+x select text and auto-copy
(function() {
    // Initialize single global store for last selection
    window.selectAllLowestResponseState = window.selectAllLowestResponseState || {
        lastSelectedIndex: -1
    };

    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'x') {
            e.preventDefault();
            // Delay execution to ensure DOM is fully loaded
            setTimeout(() => {
                try {
                    const onlySelectAssistant = window.onlySelectAssistantCheckbox || false;
                    const onlySelectUser = window.onlySelectUserCheckbox || false;
                    const disableCopyAfterSelect = window.disableCopyAfterSelectCheckbox || false;

                    const allConversationTurns = (() => {
                        try {
                            return Array.from(document.querySelectorAll('.user-turn, .agent-turn')) || [];
                        } catch {
                            return [];
                        }
                    })();

                    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

                    const composerRect = (() => {
                        try {
                            const composerBackground = document.getElementById('composer-background');
                            return composerBackground ? composerBackground.getBoundingClientRect() : null;
                        } catch {
                            return null;
                        }
                    })();

                    const visibleTurns = allConversationTurns.filter(el => {
                        const rect = el.getBoundingClientRect();
                        const horizontallyInView = rect.left < viewportWidth && rect.right > 0;
                        const verticallyInView = rect.top < viewportHeight && rect.bottom > 0;
                        if (!horizontallyInView || !verticallyInView) return false;

                        if (composerRect) {
                            if (rect.top >= composerRect.top) {
                                return false;
                            }
                        }

                        return true;
                    });

                    const filteredVisibleTurns = (() => {
                        if (onlySelectAssistant) {
                            return visibleTurns.filter(el =>
                                                       el.querySelector('[data-message-author-role="assistant"]')
                                                      );
                        }
                        if (onlySelectUser) {
                            return visibleTurns.filter(el =>
                                                       el.querySelector('[data-message-author-role="user"]')
                                                      );
                        }
                        return visibleTurns;
                    })();

                    if (filteredVisibleTurns.length === 0) return;

                    filteredVisibleTurns.sort((a, b) => {
                        const ra = a.getBoundingClientRect();
                        const rb = b.getBoundingClientRect();
                        return rb.top - ra.top;
                    });

                    const { lastSelectedIndex } = window.selectAllLowestResponseState;
                    const nextIndex = (lastSelectedIndex + 1) % filteredVisibleTurns.length;
                    const selectedTurn = filteredVisibleTurns[nextIndex];
                    if (!selectedTurn) return;

                    selectAndCopyMessage(selectedTurn);
                    window.selectAllLowestResponseState.lastSelectedIndex = nextIndex;

                    function selectAndCopyMessage(turnElement) {
                        try {
                            const userContainer = turnElement.querySelector('[data-message-author-role="user"]');
                            const isUser = !!userContainer;

                            if (isUser) {
                                if (onlySelectAssistant) return;
                                const userTextElement = userContainer.querySelector('.whitespace-pre-wrap');
                                if (!userTextElement) return;
                                doSelectAndCopy(userTextElement);
                            } else {
                                if (onlySelectUser) return;
                                const assistantContainer = turnElement.querySelector('[data-message-author-role="assistant"]');
                                let textElement = null;
                                if (assistantContainer) {
                                    textElement = assistantContainer.querySelector('.prose') || assistantContainer;
                                } else {
                                    textElement = turnElement.querySelector('.prose') || turnElement;
                                }
                                if (!textElement) return;
                                doSelectAndCopy(textElement);
                            }
                        } catch {
                            // Fail silently
                        }
                    }

                    function doSelectAndCopy(el) {
                        try {
                            const selection = window.getSelection();
                            if (!selection) return;
                            selection.removeAllRanges();

                            const range = document.createRange();
                            range.selectNodeContents(el);
                            selection.addRange(range);

                            if (!disableCopyAfterSelect) {
                                document.execCommand('copy');
                            }
                        } catch {
                            // Fail silently
                        }
                    }

                } catch {
                    // Fail silently
                }
            }, 50);
        }
    });
})();



// type to focus chat, paste when chat not focused
(function() {
    const controlsNavId = 'controls-nav';
    const chatInputId = 'prompt-textarea';

    // Function to handle focusing and manually pasting into the chat input
    function handlePaste(e) {
        const chatInput = document.getElementById(chatInputId);
        if (!chatInput) return;

        // Focus the input if it is not already focused
        if (document.activeElement !== chatInput) {
            chatInput.focus();
        }

        // Use a small delay to ensure focus happens before insertion
        setTimeout(() => {
            // Prevent default paste action to manually handle paste
            e.preventDefault();

            // Obtain the pasted text
            const pastedData = (e.clipboardData || window.clipboardData).getData('text') || '';

            const cursorPosition = chatInput.selectionStart;
            const textBefore = chatInput.value.substring(0, cursorPosition);
            const textAfter = chatInput.value.substring(cursorPosition);

            // Set the new value with pasted data
            chatInput.value = textBefore + pastedData + textAfter;

            // Move the cursor to the end of inserted data
            chatInput.selectionStart = chatInput.selectionEnd = cursorPosition + pastedData.length;

            // Trigger an 'input' event to ensure any form listeners react
            const inputEvent = new Event('input', { bubbles: true, cancelable: true });
            chatInput.dispatchEvent(inputEvent);
        }, 0);
    }

    document.addEventListener('paste', function(e) {
        const activeElement = document.activeElement;

        // If currently focused on a textarea/input that is NOT our chat input, do nothing
        if (
            (activeElement.tagName.toLowerCase() === 'textarea' || activeElement.tagName.toLowerCase() === 'input') &&
            activeElement.id !== chatInputId
        ) {
            return;
        }

        // If currently within #controls-nav, do nothing
        if (activeElement.closest(`#${controlsNavId}`)) {
            return;
        }

        // Otherwise, handle the paste event
        handlePaste(e);
    });
})();


(function() {
    const controlsNavId = 'controls-nav';
    const chatInputId = 'prompt-textarea';

    document.addEventListener('keydown', function(e) {
        const activeElement = document.activeElement;

        // If focused on any other textarea/input besides our chat input, do nothing
        if (
            (activeElement.tagName.toLowerCase() === 'textarea' || activeElement.tagName.toLowerCase() === 'input') &&
            activeElement.id !== chatInputId
        ) {
            return;
        }

        // If currently within #controls-nav, do nothing
        if (activeElement.closest(`#${controlsNavId}`)) {
            return;
        }

        // Check if the pressed key is alphanumeric and no modifier keys are pressed
        const isAlphanumeric = e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key);
        const isModifierKeyPressed = e.altKey || e.ctrlKey || e.metaKey; // metaKey for Cmd on Mac

        if (isAlphanumeric && !isModifierKeyPressed) {
            const chatInput = document.getElementById(chatInputId);
            if (!chatInput) return;

            // If we're not already in our chat input, focus it and add the character
            if (activeElement !== chatInput) {
                e.preventDefault();
                chatInput.focus();
                chatInput.value += e.key;
            }
        }
    });
})();




/*
/*=============================================================
=                                                             =
=  Token counter IIFE                                         =
=                                                             =
=============================================================*/
/*
(function(){
    'use strict';

    // ——— Keys & defaults ———
    const COST_IN_KEY          = 'costInput';
    const COST_OUT_KEY         = 'costOutput';
    const CPT_KEY              = 'charsPerToken';
    let costIn       = parseFloat(localStorage.getItem(COST_IN_KEY))  || 2.50;
    let costOut      = parseFloat(localStorage.getItem(COST_OUT_KEY)) || 10.00;
    let charsPerTok  = parseFloat(localStorage.getItem(CPT_KEY))     || 3.8;
    const OVERHEAD   = 3; // tokens per message overhead

    // ——— Estimator ———
    function estTok(text){
        return Math.ceil((text.trim().length||0)/charsPerTok) + OVERHEAD;
    }

    // ——— UI: badge + refresh button ———
    const badge = document.createElement('span');
    badge.id = 'token-count-badge';
    Object.assign(badge.style, {
        fontSize:'8px', padding:'1px 0 0 6px', borderRadius:'8px',
        background:'transparent', color:'#a9a9a9',
        fontFamily:'monospace', userSelect:'none',
        alignSelf:'center', marginTop:'16px',
        display:'inline-flex', alignItems:'center'
    });

    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '↻';
    refreshBtn.title   = 'Refresh token count';
    Object.assign(refreshBtn.style, {
        marginLeft:'6px', cursor:'pointer', fontSize:'10px',
        border:'none', background:'transparent',
        color:'#a9a9a9', userSelect:'none',
        fontFamily:'monospace', padding:'0'
    });
    refreshBtn.addEventListener('click', ()=>{
        flash(refreshBtn);
        updateCounts();
    });
    badge.appendChild(refreshBtn);

    function flash(el){
        el.style.transition = 'transform 0.15s';
        el.style.transform  = 'scale(1.4)';
        setTimeout(()=> el.style.transform = 'scale(1)', 150);
    }

    // ——— Inject badge in the “flex row” before mic button ———
    function insertBadge(retries=20){
        const rows = [...document.querySelectorAll('div.flex')];
        const flexRow = rows.find(el =>
                                  el.classList.contains('items-between') &&
                                  el.classList.contains('pb-2')
                                 );
        if(!flexRow){
            if(retries>0) setTimeout(()=> insertBadge(retries-1), 500);
            return null;
        }
        if(!flexRow.querySelector('#token-count-badge')){
            const mic = flexRow.querySelector('button[title="Use microphone"]');
            flexRow.insertBefore(badge, mic);
        }
        return flexRow.parentElement;
    }

    // ——— Role inference ———
    function inferRole(msgEl){
        const wrapper = msgEl.closest('.group, .message');
        if(wrapper?.classList.contains('user'))      return 'user';
        if(wrapper?.classList.contains('assistant')) return 'assistant';
        const all = [...document.querySelectorAll('.message-render')];
        return all.indexOf(msgEl)%2===0 ? 'user' : 'assistant';
    }

    // ——— STORE NUMBERS FOR GSAP ANIMATIONS ———
    const lastValues = {
        inSum: 0,
        outSum: 0,
        total: 0,
        cost: 0
    };

    // ——— Formatting helper ———
    function formatBadgeText({ inSum, outSum, total, cost }) {
        return `${Math.round(inSum)} @ $${costIn}/M | ${Math.round(outSum)} @ $${costOut}/M | ∑ ${Math.round(total)} | $${cost.toFixed(4)}`;
    }

    // ——— updateCounts WITH GSAP ———
    function updateCounts() {
        const msgs = [...document.querySelectorAll('.message-render')];
        if (!msgs.length) {
            lastValues.inSum = 0;
            lastValues.outSum = 0;
            lastValues.total = 0;
            lastValues.cost = 0;
            badge.textContent = '0 | 0 | ∑ 0 | $0.0000';
            badge.appendChild(refreshBtn);
            return;
        }

        const convo = msgs.map(m => ({
            role: inferRole(m),
            t: estTok(m.innerText || '')
        }));
        let inSum = 0, outSum = 0;
        for (let i = 0; i < convo.length; i++) {
            if (convo[i].role === 'user') {
                inSum += convo.slice(0, i + 1).reduce((a, b) => a + b.t, 0);
                const ai = convo.findIndex((c, j) => j > i && c.role === 'assistant');
                if (ai > i) outSum += convo[ai].t;
            }
        }
        const total = inSum + outSum;
        const cost = (inSum / 1e6) * costIn + (outSum / 1e6) * costOut;

        gsap.to(lastValues, {
            inSum, outSum, total, cost,
            duration: 0.7,
            ease: "power1.out",
            onUpdate: () => {
                badge.textContent = formatBadgeText(lastValues);
                badge.appendChild(refreshBtn);
            }
        });
    }

    // ——— Debounce for MutationObserver ———
    let debounceTimer=null;
    function scheduleUpdate(){
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateCounts, 200);
    }

    // ——— Hook send actions for immediate update ———
    function attachSendHooks(){
        const ta = document.querySelector('textarea');
        if(ta && !ta.dataset.tcHooked){
            ta.dataset.tcHooked = 'y';
            ta.addEventListener('keydown', e=>{
                if(e.key==='Enter' && !e.shiftKey && !e.altKey && !e.metaKey){
                    scheduleUpdate();
                }
            });
        }
        const send = document.querySelector('button[type="submit"], button[title="Send"]');
        if(send && !send.dataset.tcHooked){
            send.dataset.tcHooked = 'y';
            send.addEventListener('click', ()=> scheduleUpdate());
        }
    }

    // ——— Initialization ———
    function init(){
        const container = insertBadge();
        if(!container) return;
        // observe only the messages container
        const msgRoot = container.querySelector('.message-render')?.parentElement || container;
        new MutationObserver(scheduleUpdate)
            .observe(msgRoot, { childList:true, subtree:true });
        attachSendHooks();
        // reattach hooks if textarea/send are re-rendered
        new MutationObserver(attachSendHooks)
            .observe(document.body, { childList:true, subtree:true });
        updateCounts();
    }

    // ——— Config shortcut (Alt+U) ———
    document.addEventListener('keydown', e=>{
        if(e.altKey && !e.repeat && e.key.toLowerCase()==='u'){
            e.preventDefault();
            const resp = prompt(
                'Set costs and chars/token:\ninput $/M,output $/M,chars/token',
                `${costIn},${costOut},${charsPerTok}`
            );
            if(!resp) return;
            const [ci,co,cpt] = resp.split(',').map(Number);
            if([ci,co,cpt].every(v=>isFinite(v))){
                costIn = ci; costOut = co; charsPerTok = cpt;
                localStorage.setItem(COST_IN_KEY,ci);
                localStorage.setItem(COST_OUT_KEY,co);
                localStorage.setItem(CPT_KEY,cpt);
                updateCounts();
            } else alert('Invalid numbers');
        }
    });

    // delay to let page render
    setTimeout(init, 1000);

})();
*/


// // // // // //
// Convert <br> in tables displaying as literal <br> to line breaks
// // // // // //
(function () {
    'use strict';

    const BR_ENTITY_REGEX = /&lt;br\s*\/?&gt;/gi;

    function fixBrsInMarkdown() {
        document.querySelectorAll('div.markdown').forEach(container => {
            container.querySelectorAll('td, th, p, li, div').forEach(el => {
                if (el.innerHTML.includes('&lt;br')) {
                    el.innerHTML = el.innerHTML.replace(BR_ENTITY_REGEX, '<br>');
                }
            });
        });
    }

    // Run once in case content is already loaded
    fixBrsInMarkdown();

    // Watch for content changes
    const observer = new MutationObserver(() => fixBrsInMarkdown());

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();


// Alt+q   →   toggle collapse expand chat
(function() {
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'q') {
            e.preventDefault();
            const collapseBtn = document.querySelector('button[aria-label="Collapse Chat"]');
            if (collapseBtn) {
                collapseBtn.click();
                return;
            }
            const expandBtn = document.querySelector('button[aria-label="Expand Chat"]');
            if (expandBtn) expandBtn.click();
        }
    });
})();


// alt+1 to alt+9 to select presets
(() => {
    const synthClick = el => {
        if (!el) return;
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        el.focus?.();
    };

    function isMenuOpen() {
        // This assumes the menu creates at least one .[role="listbox"] when open
        // Also checks for at least one preset option in the DOM
        return !!document.querySelector('div[role="option"][data-testid^="preset-item"]');
    }

    function handleAltDigit(ev) {
        if (!ev.altKey || !/^Digit[1-9]$/.test(ev.code)) return;
        ev.preventDefault();
        ev.stopPropagation();

        const idx = +ev.code.slice(-1) - 1;
        const btn = document.getElementById('presets-button');
        if (!btn) return console.warn('[Preset-helper] #presets-button not found');

        // Only click the button if the menu is not already open
        const alreadyOpen = isMenuOpen();

        if (!alreadyOpen) btn.click();

        // If menu was *just* opened, may need small delay for items to render
        const delay = alreadyOpen ? 0 : 500;
        setTimeout(() => {
            const items = Array.from(
                document.querySelectorAll('div[role="option"][data-testid^="preset-item"]')
            );
            if (items[idx]) synthClick(items[idx]);
            else console.warn('[Preset-helper] Preset item not available at index', idx);
        }, delay);
    }

    window.addEventListener('keydown', handleAltDigit, true);
})();



// Label the presets

(() => {
    /* ——— simple style for the tiny label ——— */
    const style = document.createElement('style');
    style.textContent = `
    .alt-hint {
      font-size: 12px;          /* small text */
      opacity: .5;              /* 50 % opacity  */
      margin-left: 4px;         /* a little gap  */
      pointer-events: none;     /* never blocks clicks */
      user-select: none;
    }`;
    document.head.appendChild(style);

    const ITEM_SELECTOR = 'div[role="option"][data-testid^="preset-item"]';
    const MAX_DIGITS = 9; // Alt+1 … Alt+9

    /** add the hint to each item (if not already present) */
    const addHints = () => {
        [...document.querySelectorAll(ITEM_SELECTOR)]
            .slice(0, MAX_DIGITS)
            .forEach((el, i) => {
            if (el.querySelector('.alt-hint')) return;      // only once
            const span = document.createElement('span');
            span.className = 'alt-hint';
            span.textContent = `Alt+${i + 1}`;
            el.appendChild(span);
        });
    };

    /* run once right now (in case the menu is already open) */
    addHints();

    /* keep watching for future openings of the menu */
    const mo = new MutationObserver(addHints);
    mo.observe(document.body, { childList: true, subtree: true });
})();



// alt+w   →   Open the preset menu

(() => {
    'use strict';

    window.addEventListener('keydown', handleAltP, true);

    const openPresetMenu = () => {
        const btn = document.getElementById('presets-button');
        if (!btn) {
            console.log('[Preset-helper] couldn’t find #presets-button');
            return false;
        }
        btn.click();
        return true;
    };

    function handleAltP(e) {
        if (e.altKey && e.code === 'KeyW') {
            e.preventDefault();
            e.stopPropagation();
            openPresetMenu();
        }
    }
})();



// Click right sidebar toggle with alt+g and go to parameters
(function() {
    document.addEventListener('keydown', function(e) {
        // Only proceed if ALT+G is pressed
        if (!e.altKey || e.key.toLowerCase() !== 'g') return;

        const nav = document.querySelector('nav[aria-label="Controls"][role="navigation"]');
        const width = nav ? nav.getBoundingClientRect().width : 0;

        if (width > 100) {
            // Panel is open: click "Hide Panel" button
            const hideBtn = [...document.querySelectorAll('button')].find(
                b => b.textContent.trim().toLowerCase().includes('hide panel')
            );
            if (hideBtn) hideBtn.click();
        } else {
            // Panel is closed: click toggle-right-nav, then wait for "Parameters" button to appear
            const toggleBtn = document.getElementById('toggle-right-nav');
            if (toggleBtn) {
                toggleBtn.click();

                const maxRetryTime = 5000; // how long to wait, in ms
                let elapsed = 0;
                const interval = 100;

                const intervalId = setInterval(() => {
                    elapsed += interval;
                    // Find a button containing the text "Parameters"
                    const paramsBtn = [...document.querySelectorAll('button')]
                    .find(b => b.textContent.trim().toLowerCase().includes('parameters'));

                    if (paramsBtn) {
                        clearInterval(intervalId);
                        paramsBtn.click();
                    } else if (elapsed >= maxRetryTime) {
                        clearInterval(intervalId);
                        console.warn("Parameters button not found within time limit.");
                    }
                }, interval);
            }
        }
    });
})();



// Make the preset dialogue 100% viewport height and some ugly style updates
(function() {
    const style = document.createElement('style');
    style.textContent = `
      [data-side="bottom"][data-align="center"][data-state="open"] {
        max-height: 100% !important;
        height: 90vh !important;
        overflow: auto;
      }
.preset-name {
  font-weight: bold;
  color: #f9cc87; /* electric orange */
  font-size: 115% !important;
}
.preset-number {
  color: #bdccff; /* baby/light blue */
  margin-right: 6px;
}

    `;
    document.head.appendChild(style);

    function highlightPresetNames(container) {
        const textDivs = container.querySelectorAll('div.text-xs');
        let counter = 1;

        textDivs.forEach(div => {
            const textNode = Array.from(div.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.includes(':'));
            if (textNode) {
                const match = textNode.nodeValue.match(/^(.*?):\s*(.*)$/s);
                if (match) {
                    const beforeColon = match[1];
                    const afterColon = match[2];
                    div.innerHTML = `
                      <span class="preset-name">
                        <span class="preset-number">${counter}.</span>${beforeColon}&nbsp;
                      </span>(${afterColon.trim()})
                    `.trim();
                    counter++;
                }
            }
        });
    }

    function runHighlight() {
        const container = document.querySelector('[data-side="bottom"][data-align="center"][data-state="open"]');
        if (container) {
            highlightPresetNames(container);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runHighlight);
    } else {
        runHighlight();
    }

    const observer = new MutationObserver(() => runHighlight());
    observer.observe(document.body, { childList: true, subtree: true });
})();



// Insert stop dictation button
(async function () {
    // 1. Inject Google Material Icons (if not already present)
    if (!document.querySelector('link[href*="fonts.googleapis.com/icon?family=Material+Icons"]')) {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    // 2. Dynamically import SpeechRecognition
    let SpeechRecognition;
    try {
        SpeechRecognition = (await import('https://cdn.jsdelivr.net/npm/react-speech-recognition@3.10.0/dist/index.umd.min.js')).default;
    } catch (e) {
        console.error('Failed to import SpeechRecognition:', e);
        return;
    }

    // 3. Poll DOM for the microphone button
    const interval = setInterval(() => {
        const micBtn = document.querySelector('#audio-recorder');
        if (!micBtn || document.querySelector('#stop-dictation')) return;

        // 4. Create Stop Dictation button
        const stopBtn = document.createElement('button');
        stopBtn.id = 'stop-dictation';
        stopBtn.title = 'Stop Dictation';
        stopBtn.setAttribute('aria-label', 'Stop Dictation');
        stopBtn.style.marginLeft = '6px';
        stopBtn.className = 'cursor-pointer flex size-9 items-center justify-center rounded-full p-1 transition-colors hover:bg-surface-hover';

        stopBtn.innerHTML = `<span class="material-icons" style="font-size: 24px; color: red;">stop_circle</span>`;

        // 5. Insert after mic button
        micBtn.parentNode.insertBefore(stopBtn, micBtn.nextSibling);

        // 6. Attach event
        stopBtn.addEventListener('click', async () => {
            try {
                await SpeechRecognition.stopListening();
                console.log('Speech recognition manually stopped.');
            } catch (err) {
                console.error('Failed to stop speech recognition:', err);
            }
        });

        clearInterval(interval);
    }, 500);
})();



// This script injects a CSS rule into the current page
(function() {
    const style = document.createElement('style');
    style.textContent = `
/* 2. make sure every normal text line looks reasonable */
.markdown.prose.message-content,
.markdown.prose.message-content p,
.markdown.prose.message-content li {
  line-height: 1.45 !important;   /* ≈ 23px on a 16px font */
}

/* hide the share button */
#export-menu-button {
display:none;
    }


  `;
    document.head.appendChild(style);
})();



// hide the second top bar, and move it to main bar on right when smaller than 768
(function () {
    'use strict';

    const BAR_SELECTOR = 'div.bg-token-main-surface-primary.md\\:hidden';
    const DEST_BTN_SELECTOR = '#add-multi-conversation-button';
    const STYLE_ID = 'ext-hide-mobile-bar-style';
    const BTN_CONTAINER_ID = 'moved-mobile-buttons-container';

    const HIDE_CSS = `
div.bg-token-main-surface-primary.md\\:hidden { display: none !important; }
#${BTN_CONTAINER_ID} {
  position: fixed;
  top: 6px;
  right: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 9999;
  background: none;
  pointer-events: auto;
  gap: 4px;
  /* Drive icon color from theme token */
  color: var(--text-primary) !important;
}
#${BTN_CONTAINER_ID} button {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  width: 40px;
  text-size-adjust: 100%;
  font-family: Inter, sans-serif;
  font-feature-settings: normal;
  font-variation-settings: normal;
  font-weight: 600;
  line-height: 24px;
  tab-size: 4;
  appearance: button;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  unicode-bidi: isolate;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  /* Do NOT set color or background! Let theme handle it. */
  padding: 0;
  margin: 0;
  color: inherit !important;
}

/* Recolor only existing strokes (won’t thicken lines) */
#${BTN_CONTAINER_ID} svg [stroke]:not([stroke="none"]) { stroke: currentColor !important; }

/* Preserve explicit no-fill */
#${BTN_CONTAINER_ID} svg [fill="none"] { fill: none !important; }

/* Recolor fill-based icons without adding strokes */
#${BTN_CONTAINER_ID} svg :not([stroke])[fill]:not([fill="none"]) { fill: currentColor !important; }

/* Elements with neither fill nor stroke attributes inherit fill from currentColor */
#${BTN_CONTAINER_ID} svg :not([stroke]):not([fill]) { fill: currentColor !important; }

@media (min-width: 769px) {
  #${BTN_CONTAINER_ID} { display: none !important; }
}
@media (max-width: 768px) {
  #${BTN_CONTAINER_ID} { display: flex !important; }
}
`;


    // Sidebar toggle function
    function toggleSidebar() {
        const selectors = [
            '[data-testid="close-sidebar-button"]',
            '[data-testid="open-sidebar-button"]'
        ];
        for (const selector of selectors) {
            const btn = document.querySelector(selector);
            if (btn) {
                btn.click();
                console.log(`🧭 Sidebar toggled via ${selector}`);
                return;
            }
        }
        console.warn('⚠️ No sidebar toggle button found');
    }

    // New chat function
    function openNewChat() {
        const currentWidth = window.innerWidth;
        console.log('Viewport width:', currentWidth);

        if (currentWidth > 768) {
            // Desktop logic
            console.log('Using desktop logic (larger than 768px)');
            const newChatButton = document.querySelector('button[aria-label="New chat"]');
            if (!newChatButton) {
                console.warn('❌ New chat button not found');
                return;
            }
            newChatButton.click();
            console.log('🆕 New chat opened');
            setTimeout(() => {
                const closeSidebarButton = document.querySelector('button[data-testid="close-sidebar-button"]');
                if (closeSidebarButton) {
                    // Optionally close the sidebar
                    // closeSidebarButton.click();
                    console.log('⬅️ Sidebar closed');
                } else {
                    console.log('❌ Close sidebar button not found');
                }
            }, 100);
        } else {
            // Mobile/tablet logic
            console.log('Using mobile/tablet logic (768px or smaller)');
            const newChatButton = document.querySelector('button[aria-label="New chat"]');
            if (!newChatButton) {
                console.warn('❌ New chat button not found');
                return;
            }
            newChatButton.click();
            console.log('🆕 New chat opened');

            function tryCloseSidebar() {
                const closeSidebarButton = document.querySelector('button[data-testid="close-sidebar-button"]');
                if (closeSidebarButton) {
                    closeSidebarButton.click();
                    console.log('⬅️ Sidebar closed');
                    return true;
                }
                return false;
            }

            if (tryCloseSidebar()) return;

            const observer = new MutationObserver(() => {
                if (tryCloseSidebar()) {
                    observer.disconnect();
                    clearTimeout(timeoutId);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            const timeoutId = setTimeout(() => {
                observer.disconnect();
                console.log('🛑 Finished watching for sidebar close button');
            }, 2000);
        }
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
    async function waitForElement(selector, tries = 25, delay = 200) {
        for (let i = 0; i < tries; i++) {
            const el = document.querySelector(selector);
            if (el) return el;
            await sleep(delay);
        }
        return null;
    }
    function injectHideCSS() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = HIDE_CSS;
        document.head.appendChild(style);
    }

    async function run() {
        // 1. Find mobile bar
        let oldBar = null;
        for (let i = 0; i < 25; i++) {
            const bars = Array.from(document.querySelectorAll(BAR_SELECTOR));
            oldBar = bars.find(bar => bar.querySelectorAll('button').length >= 2);
            if (oldBar) break;
            await sleep(200);
        }
        if (!oldBar) return;

        // 2. Find destination button
        const destBtn = await waitForElement(DEST_BTN_SELECTOR);
        if (!destBtn) return;

        // 3. Move the two buttons into a new container
        let btns = Array.from(oldBar.querySelectorAll('button')).slice(0, 2);
        if (btns.length < 2) return;

        // Remove old container if it exists
        let btnContainer = document.getElementById(BTN_CONTAINER_ID);
        if (btnContainer) btnContainer.remove();

        btnContainer = document.createElement('div');
        btnContainer.id = BTN_CONTAINER_ID;

        // Attach correct handlers:
        btns.forEach(btn => {
            btnContainer.appendChild(btn);
            btn.style.padding = '0';
            btn.style.margin = '0';
            btn.style.color = 'inherit';

            const newBtn = btn.cloneNode(true);
            // Assign correct handler based on aria-label
            const aria = btn.getAttribute('aria-label') || '';
            if (aria.toLowerCase().includes('sidebar')) {
                newBtn.onclick = toggleSidebar;
            } else if (aria.toLowerCase().includes('new chat')) {
                newBtn.onclick = openNewChat;
            }
            btnContainer.replaceChild(newBtn, btn);
        });

        // Inherit from token (fallback to old bar color if token missing)
        const barColor = getComputedStyle(oldBar).color;
        const tokenColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--text-primary')
        .trim();
        btnContainer.style.color = tokenColor || barColor;


        document.body.appendChild(btnContainer);

        injectHideCSS();
    }

    window.addEventListener('resize', run);

    run();
})();


// Change multi conversation split icon to an intuitive icon
(() => {
    // 1. Inject Material Symbols stylesheet if not already present
    if (!document.querySelector('link[href*="fonts.googleapis.com"][href*="Material+Symbols"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=alt_route,star';
        document.head.appendChild(link);
    }

    // 2. Replace SVG in #add-multi-conversation-button with "alt_route" icon
    function replaceAddButtonIcon() {
        const buttonDiv = document.querySelector('#add-multi-conversation-button');
        if (buttonDiv && !buttonDiv.querySelector('.material-symbols-outlined')) {
            const svg = buttonDiv.querySelector('svg');
            if (svg) {
                const iconSpan = document.createElement('span');
                iconSpan.className = 'material-symbols-outlined';
                iconSpan.textContent = 'alt_route';
                iconSpan.style.fontSize = '16px';
                iconSpan.style.width = '16px';
                iconSpan.style.height = '16px';
                iconSpan.style.display = 'inline-flex';
                iconSpan.style.alignItems = 'center';
                iconSpan.style.justifyContent = 'center';
                svg.replaceWith(iconSpan);
            }
        }
    }

    // 3. Replace all .lucide-book-copy[aria-label="Preset Icon"] SVGs with "star" icon
    function replaceBookCopyIcons() {
        const svgs = document.querySelectorAll('svg.lucide-book-copy[aria-label="Preset Icon"]');
        svgs.forEach(svg => {
            if (svg.dataset.replacedWithMaterialSymbol) return;
            const iconSpan = document.createElement('span');
            iconSpan.className = 'material-symbols-outlined';
            iconSpan.textContent = 'star';
            iconSpan.style.fontSize = '16px';
            iconSpan.style.width = '16px';
            iconSpan.style.height = '16px';
            iconSpan.style.display = 'inline-flex';
            iconSpan.style.alignItems = 'center';
            iconSpan.style.justifyContent = 'center';
            svg.dataset.replacedWithMaterialSymbol = "true";
            svg.replaceWith(iconSpan);
        });
    }

    // 4. Composite function
    function replaceIcons() {
        replaceAddButtonIcon();
        replaceBookCopyIcons();
    }

    // 5. Debounce utility
    function debounce(fn, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }
    const debouncedReplaceIcons = debounce(replaceIcons, 100);

    // 6. MutationObserver with debounce, observing entire body
    const observer = new MutationObserver(debouncedReplaceIcons);
    observer.observe(document.body, { subtree: true, childList: true });

    // 7. Initial run on DOMContentLoaded or immediately
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", replaceIcons);
    } else {
        replaceIcons();
    }
})();



// trigger stop with control+backspace and send with control+enter and control+; clicks stop then regenerate (or just regenerate if stop isn't available).
// trigger stop with control+backspace and send with control+enter and control+; clicks stop then regenerate (or just regenerate if stop isn't available).
(function () {
    // Utility: is element in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom > 0 &&
            rect.top < window.innerHeight &&
            rect.left < window.innerWidth &&
            rect.right > 0
        );
    }

    // Utility: find lowest visible Regenerate button
    function getLowestVisibleRegenerateBtn() {
        const regenBtns = Array.from(document.querySelectorAll('button[title="Regenerate"]:not([disabled])'));
        const visibleBtns = regenBtns.filter(isElementInViewport);
        if (visibleBtns.length === 0) return null;
        return visibleBtns.reduce((lowest, btn) => {
            const currTop = btn.getBoundingClientRect().top;
            const lowestTop = lowest.getBoundingClientRect().top;
            return currTop > lowestTop ? btn : lowest;
        }, visibleBtns[0]);
    }

    // Detect if event target is a text-editable control
    function isEditable(target) {
        const el = target || document.activeElement;
        if (!el) return false;
        if (el.isContentEditable) return true;

        const tag = el.tagName ? el.tagName.toLowerCase() : '';
        if (tag === 'textarea') return true;

        if (tag === 'input') {
            const type = (el.getAttribute('type') || 'text').toLowerCase();
            const nonTextTypes = new Set([
                'button','checkbox','file','radio','range','reset','submit',
                'color','date','datetime-local','month','time','week','hidden','image'
            ]);
            if (nonTextTypes.has(type)) return false;
            if (el.readOnly || el.disabled) return false;
            return true;
        }
        return false;
    }

    document.addEventListener('keydown', function (e) {
        // Ctrl+Backspace - STOP (but don't block word-delete in editable fields)
        if (e.ctrlKey && (e.key === 'Backspace' || e.code === 'Backspace')) {
            const stop = () => {
                const stopBtn = document.querySelector('button[aria-label="Stop generating"]:not([disabled])');
                if (stopBtn) stopBtn.click();
            };

            if (isEditable(e.target)) {
                // Let the default deletion happen, then stop
                // Using a timeout ensures default action runs before we possibly change focus.
                setTimeout(stop, 0);
            } else {
                e.preventDefault();
                stop();
            }
            return;
        }

        // Ctrl+Enter - SEND
        if (e.ctrlKey && (e.key === 'Enter' || e.keyCode === 13)) {
            e.preventDefault();
            const sendBtn = document.querySelector(
                'button[aria-label="Send message"]:not([disabled]), #send-button:not([disabled]), button[data-testid="send-button"]:not([disabled])'
            );
            if (sendBtn) sendBtn.click();
            return;
        }

        // Ctrl+; - STOP, then REGENERATE
        if (e.ctrlKey && (e.key === ';' || e.code === 'Semicolon')) {
            e.preventDefault();
            const stopBtn = document.querySelector('button[aria-label="Stop generating"]:not([disabled])');
            if (stopBtn) stopBtn.click();

            setTimeout(function () {
                const lowestRegenBtn = getLowestVisibleRegenerateBtn();
                if (lowestRegenBtn) lowestRegenBtn.click();
            }, 750);
            return;
        }
    });
})();


// alt+m toggle maximize chat area
(() => {
    /* ---------- utility helpers ---------- */
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    /** wait for a selector to appear (or return null after timeout) */
    const waitFor = async (selector, root = document, timeout = 5000) => {
        const el = root.querySelector(selector);
        if (el) return el;

        return new Promise((resolve) => {
            const obs = new MutationObserver(() => {
                const found = root.querySelector(selector);
                if (found) {
                    obs.disconnect();
                    resolve(found);
                }
            });
            obs.observe(root, { childList: true, subtree: true });
            setTimeout(() => {
                obs.disconnect();
                resolve(null);
            }, timeout);
        });
    };

    /* click helper (fires native click + change for React) */
    const clickEl = (el) => {
        if (!el) return;
        el.focus({ preventScroll: true });   // Radix Tabs checks focus
        el.click();                          // produces a full MouseEvent
    };


    /* robust text‑finder for dynamic IDs */
    const findByText = (selector, text) =>
    [...document.querySelectorAll(selector)].find((n) =>
                                                  n.textContent?.trim().toLowerCase().includes(text.toLowerCase())
                                                 );

    /* ---------- main routine ---------- */
    const runToggle = async () => {
        /* 1 — open user menu */
        clickEl(await waitFor('button[data-testid="nav-user"]'));
        await sleep(100);

        /* 2 — click “Settings” in the combobox */
        clickEl(findByText('div[role="option"]', 'settings'));
        await sleep(100);

        /* 3 — switch to “Chat” tab (in case another tab is open) */
        const chatTabSelector =
              'button[role="tab"][id$="-trigger-chat"], button[role="tab"][aria-controls$="content-chat"]';

        const chatTab = await waitFor(chatTabSelector);
        clickEl(chatTab);
        await sleep(100);

        /* 4 — toggle Maximize‑chat‑space switch */
        clickEl(await waitFor('button[data-testid="maximizeChatSpace"]'));
        await sleep(100);

        /* 5 — press Escape to close Settings */
        document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true })
        );
    };

    /* ---------- hot‑key binding ---------- */
    document.addEventListener(
        'keydown',
        (e) => {
            if (e.altKey && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                runToggle();
            }
        },
        true
    );
})();


// Press Alt + ; to toggle wider, more readable .message-content styling on/off. State persists across reloads.
(function() {
    const styleId = 'chrome-ext-message-content-toggle-style';
    const css = `
.message-content {
  max-width: 66ch !important;
  line-height: 1.8 !important;
}
table tr:nth-child(even):not(:first-child) {
  background-color: rgba(currentColor, 0.06);
}`;
    const STORAGE_KEY = 'messageContentStyleActive';

    // Helper to add the style
    function addStyle() {
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = css;
            document.head.appendChild(style);
        }
    }
    // Helper to remove the style
    function removeStyle() {
        const style = document.getElementById(styleId);
        if (style) style.remove();
    }
    // Toggle and persist the new state
    function toggleStyle() {
        const isActive = GM_getValue(STORAGE_KEY, false);
        if (isActive) {
            removeStyle();
            GM_setValue(STORAGE_KEY, false);
        } else {
            addStyle();
            GM_setValue(STORAGE_KEY, true);
        }
    }

    // On load: restore last state
    if (GM_getValue(STORAGE_KEY, false)) {
        addStyle();
    }

    window.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === ';') {
            e.preventDefault();
            toggleStyle();
        }
    });
})();


// Feature: Toggles the "Temporary Chat" button (or matching SVG button) when the user presses Alt+P
// Feature: Toggles the "Temporary Chat" button (or matching SVG button) when the user presses Alt+P
(function() {
    document.addEventListener('keydown', function(e) {
        if (!e.altKey || e.key.toLowerCase() !== 'p') return;

        // 1. Try to find and click by aria-label
        const tempChatBtn = [...document.querySelectorAll('button')].find(
            b => b.getAttribute('aria-label') === 'Temporary Chat'
        );
        if (tempChatBtn) {
            tempChatBtn.click();
            return;
        }

        // 2. Try to find and click button with SVG containing the specific path
        const targetPathD = 'M13.5 3.1c-.5 0-1-.1-1.5-.1s-1 .1-1.5.1';
        const svgBtn = [...document.querySelectorAll('button')].find(button => {
            return [...button.querySelectorAll('svg path[d]')].some(
                path => path.getAttribute('d') === targetPathD
            );
        });
        if (svgBtn) {
            svgBtn.click();
            return;
        }

        // 3. Fail gracefully
        // Optionally add a console message for debugging:
        // console.warn('Temporary Chat button not found.');
    });
})();




// add table copy buttons
/*  Alt + D → copy the lowest visible <table> to the clipboard (HTML + TSV)
    and show a transient toast.  Drop-in, no dependencies. */
/*  Alt + D copies the lowest visible <table> to clipboard (HTML + TSV)
    and shows a toast.  Every table also gets a copy button just below it.
    Drop-in; no external dependencies. */
(() => {
    /* ---------- clipboard + toast ---------- */

    async function copyTable(table) {
        /* clone so we can style without touching the live DOM */
        const tblClone = table.cloneNode(true);

        Object.assign(tblClone.style, {
            /* layout + typography matching the computed table */
            boxSizing:       'border-box',
            marginTop:       '4px',
            marginBottom:    '4px',
            fontFamily:      '"Inter", sans-serif',
            fontSize:        '9px',
            lineHeight:      '18px',
            textAlign:       'left',
            borderCollapse: 'collapse',
            borderSpacing:  '0',
            tableLayout:     'auto',
            width:           '100%'
        });

        /* add 6 px left–right padding to every cell */
        tblClone.querySelectorAll('th,td').forEach(c => {
            c.style.padding   = '4px 6px';
            c.style.cssText  += 'mso-padding-alt:4px 6px 4px 6px;';
        });

        const rows = Array.from(tblClone.rows);

        rows.forEach((row, i) => {
            if (i === 0) {                             // header row
                row.style.background = '#eef2f7';
                row.style.fontWeight = 'bold';
            } else if (i % 2 === 1) {                  // zebra striping
                row.style.background = '#fafafa';
            }
        });

        /* use the styled clone for the HTML payload */
        const html = tblClone.outerHTML;

        const tsv  = [...table.rows]
        .map(r => [...r.cells].map(c => c.innerText.trim()).join('\t'))
        .join('\n');

        try {
            const item = new ClipboardItem({
                'text/html':  new Blob([html], { type: 'text/html'  }),
                'text/plain': new Blob([tsv],  { type: 'text/plain' })
            });
            await navigator.clipboard.write([item]);
        } catch {                    /* Safari / permission fallback */
            const sel = getSelection();
            const rng = document.createRange();
            rng.selectNodeContents(table);
            sel.removeAllRanges();
            sel.addRange(rng);
            document.execCommand('copy');
            sel.removeAllRanges();
        }
    }

    function toast(msg, ms = 2000) {
        const t = document.createElement('div');
        t.textContent = msg;
        Object.assign(t.style, {
            position:   'fixed',
            bottom:     '10vh',
            left:       '50%',
            transform:  'translateX(-50%)',
            background: 'green',
            color:      '#fff',
            padding:    '8px 12px',
            borderRadius:'4px',
            fontSize:   '14px',
            zIndex:     2147483647,
            opacity:    '0',
            transition: 'opacity .3s'
        });
        document.body.appendChild(t);
        requestAnimationFrame(() => (t.style.opacity = '1'));
        setTimeout(() => {
            t.style.opacity = '0';
            t.addEventListener('transitionend', () => t.remove(), { once: true });
        }, ms);
    }

    /* ---------- table scan + button injection ---------- */

    const COPY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" height="19" width="19" fill="none" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
    <path fill="currentColor" fill-rule="evenodd" d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" clip-rule="evenodd"/>
        </svg>`;

    const CHECK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" height="19" width="19" fill="none" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
  <path fill="currentColor" d="M9.75 17.5l-4.5-4.5 1.5-1.5 3 3 7.25-7.25 1.5 1.5-8.75 8.75z"/>
</svg>`;

    function createButton() {
        const btn = document.createElement('button');
        btn.className = 'my-table-copy-btn';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Copy table');
        btn.innerHTML = COPY_SVG.trim();

        Object.assign(btn.style, {
            display:      'block',
            margin:       '-16px 8px 4px auto',
            padding:      '2px',
            width:        '24px',
            height:       '24px',
            background:   'inherit',
            borderRadius: '4px',
            cursor:       'pointer',
            transition:   'box-shadow 0.15s ease'
        });

        const shade  = 'inset 8px 8px 8px 9999px rgba(0,0,0,0.3)';
        const darken = () => { btn.style.boxShadow = shade; };
        const reset  = () => { btn.style.boxShadow = '';    };

        btn.addEventListener('pointerenter', darken);
        btn.addEventListener('pointerleave', reset);
        btn.addEventListener('focus',        darken);
        btn.addEventListener('blur',         reset);

        btn.dataset.isTableCopy = '1';
        return btn;
    }

    function inject(table) {
        if (table.dataset.copyInjected) return;   /* idempotent */
        table.dataset.copyInjected = '1';

        const btn = createButton();

        btn.addEventListener('click', async e => {
            e.stopPropagation();
            try {
                await copyTable(table);
                toast('Table copied');
            } catch {
                toast('Copy failed');
            } finally {
                btn.innerHTML = CHECK_SVG;
                setTimeout(() => (btn.innerHTML = COPY_SVG), 500);
            }
        });

        table.insertAdjacentElement('afterend', btn);
    }

    function scan() {
        document.querySelectorAll('table').forEach(inject);
    }

    /* ---------- hot-key: Alt + D ---------- */

    function isVisible(el) {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < innerHeight &&
            r.right  > 0 && r.left < innerWidth;
    }

    function lowestVisibleTable() {
        return [...document.querySelectorAll('table')]
            .filter(isVisible)
            .sort((a, b) =>
                  b.getBoundingClientRect().bottom - a.getBoundingClientRect().bottom)[0] || null;
    }

    addEventListener('keydown', e => {
        if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.code === 'KeyD') {
            e.preventDefault();
            e.stopPropagation();
            const tbl = lowestVisibleTable();
            if (!tbl) {
                toast('No visible table');
                return;
            }
            copyTable(tbl)
                .then(() => toast('Table copied, Formatted for MS Word'))
                .catch(() => toast('Copy failed'));
        }
    }, true);   /* capture phase beats page handlers */

    /* ---------- initial run + observers ---------- */

    if (document.readyState === 'loading') {
        addEventListener('DOMContentLoaded', scan, { once: true });
    } else {
        scan();
    }

    /* ---- observe DOM mutations only after 2 s of inactivity ---- */

    let idleTimer = null;

    const observer = new MutationObserver(() => {
        clearTimeout(idleTimer);      // reset timer while DOM is still mutating
        idleTimer = setTimeout(scan, 2000);  // run scan after 2 s idle
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();


// Stripe Table Rows
/*  Drop-in IIFE: stripes data rows with a theme-aware overlay.
    – No colours are hard-coded.
    – Works whether the page is light- or dark-themed.
    – Leaves the <thead> row untouched.                                  */
(() => {
    const style = document.createElement('style');
    style.textContent = `
    /* 1 – select every other row in <tbody> (odd  = 2nd, 4th, … because the header is row 0) */
    table tbody tr:nth-child(even) {
      position: relative;               /* establishes containing block for the overlay */
    }

    /* 2 – paint a subtle overlay that tints the inherited background */
    table tbody tr:nth-child(even)::after {
      content: "";
      position: absolute;
      inset: 0;                         /* cover the whole row */
      background: currentColor;         /* uses the row’s text colour – black on light pages, white on dark */
      opacity: .05;                     /* 5 % tint: darkens light pages, lightens dark pages */
      pointer-events: none;             /* overlay is inert – keeps page behaviour unchanged */
      mix-blend-mode: normal;           /* default blend – safe everywhere */
    }
  `;
    document.head.appendChild(style);
})();


// Alt+e to edit lowest message. Clicks lowest visible user-turn edit; if none, clicks next one above scroll position, never agent-turns.

(function() {
    function onShortcut(e) {
        if (
            (e.key === 'e' || e.key === 'E') &&
            e.altKey &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.shiftKey
        ) {
            e.preventDefault();
            setTimeout(() => {
                try {
                    // Gather all user-turn edit buttons with bounding rect
                    const userTurns = Array.from(document.querySelectorAll('.user-turn'));
                    const buttons = userTurns.map(turn => {
                        const btn = turn.querySelector('button[title="Edit"]');
                        if (!btn) return null;
                        const rect = btn.getBoundingClientRect();
                        const absRect = {
                            top: rect.top + window.scrollY,
                            bottom: rect.bottom + window.scrollY
                        };
                        return {btn, rect, absRect};
                    }).filter(Boolean);

                    if (!buttons.length) return;

                    // Find visible ones (in viewport)
                    const visible = buttons.filter(({rect}) =>
                                                   rect.width > 0 &&
                                                   rect.height > 0 &&
                                                   rect.bottom > 0 &&
                                                   rect.right > 0 &&
                                                   rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
                                                   rect.left < (window.innerWidth || document.documentElement.clientWidth)
                                                  );

                    let target;
                    if (visible.length) {
                        // Click the lowest visible
                        target = visible.reduce((a, b) =>
                                                a.rect.bottom > b.rect.bottom ? a : b
                                               ).btn;
                    } else {
                        // If none visible, find the one whose bottom is just above current scroll position
                        const scrollY = window.scrollY;
                        // Only those above current scroll position
                        const above = buttons.filter(({absRect}) => absRect.bottom <= scrollY);
                        if (above.length) {
                            // The one closest to scrollY (largest bottom)
                            target = above.reduce((a, b) =>
                                                  a.absRect.bottom > b.absRect.bottom ? a : b
                                                 ).btn;
                        }
                        // If none above, do nothing (do NOT click topmost or below)
                    }
                    if (target) {
                        target.style.boxShadow = '0 0 0 3px #888';
                        setTimeout(() => {
                            target.style.boxShadow = '';
                            target.click();
                        }, 150);
                    }
                } catch (e) {
                    // Silent fail
                }
            }, 50);
        }
    }
    window.addEventListener('keydown', onShortcut, true);
})();


// simulate control enter with alt+d

(function() {
    window.addEventListener('keydown', function(e) {
        // Only trigger on Alt+D with NO other modifiers
        if (
            (e.key === 'd' || e.key === 'D') &&
            e.altKey &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.shiftKey
        ) {
            e.preventDefault();
            // Simulate Ctrl+Enter at the current focus
            const el = document.activeElement;
            if (el) {
                // Fire keydown/keyup for Ctrl+Enter
                ['keydown','keyup'].forEach(type => {
                    const evt = new KeyboardEvent(type, {
                        bubbles: true,
                        cancelable: true,
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        ctrlKey: true
                    });
                    el.dispatchEvent(evt);
                });
            }
        }
    }, true);
})();