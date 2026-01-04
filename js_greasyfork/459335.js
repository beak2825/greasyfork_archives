// ==UserScript==
// @name         YouTube - Livechat Emoji Fixes
// @namespace    https://gist.github.com/lbmaian/e2a60a4aa2c534c1575547a60711613a
// @version      0.4
// @description  Improves YouTube Livechat emoji menu performance by hiding non-membership/YouTuber-specific emoji categories; also hides annoying first-time-chat tooltip
// @author       lbmaian
// @match        https://www.youtube.com/live_chat*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459335/YouTube%20-%20Livechat%20Emoji%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/459335/YouTube%20-%20Livechat%20Emoji%20Fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const logContext = '[YouTube - Livechat Emoji Fixes]';

    const console = {
        ...window.console,
        debug(...args) {
            //window.console.debug(logContext, ...args); // uncomment to disable debugging
        },
        log(...args) {
            window.console.log(logContext, ...args);
        },
        warn(...args) {
            window.console.warn(logContext, ...args);
        },
        error(...args) {
            window.console.error(logContext, ...args);
        },
    };

    function waitForLiveChatMessageInput(callback, ...args) {
        const eltMessageInput = document.getElementById('live-chat-message-input');
        if (eltMessageInput) {
            callback(eltMessageInput, ...args);
        } else {
            new MutationObserver((records, observer) => {
                const eltMessageInput = document.getElementById('live-chat-message-input');
                if (eltMessageInput) {
                    observer.disconnect();
                    callback(eltMessageInput, ...args);
                }
            }).observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    }

    function watchEmojiPickers(eltMessageInput) {
        console.debug('#live-chat-message-input', eltMessageInput);

        // Hack to remove the 'When you send a message, people will be able to see that you subscribe to this channel.' one-time tooltip whenever it pops up
        const eltApp = eltMessageInput.closest('yt-live-chat-app');
        console.debug('yt-live-chat-app', eltApp);
        new MutationObserver((records, observer) => {
            for (const record of records) {
                for (const node of record.addedNodes) {
                    if (node.nodeType === 1 && node.tagName.toLowerCase() === 'tp-yt-iron-dropdown') {
                        console.debug('found tp-yt-iron-dropdown', node);
                        // Note: the 'When you send a message, people will be able to see that you subscribe to this channel.' hasn't been set yet,
                        // so we can't filter for that, so just filter out any tooltip (afaik, this is the only such tooltip anyway).
                        const eltTooltipRenderer = node.firstElementChild?.firstElementChild;
                        if (eltTooltipRenderer && eltTooltipRenderer.tagName.toLowerCase() === 'yt-tooltip-renderer') {
                            //observer.disconnect(); // not disconnecting in case more tooltips pop up
                            console.log('removing tooltip', eltTooltipRenderer);
                            node.remove();
                        }
                    }
                }
            }
        }).observe(eltApp, {
            childList: true,
        });

        //  yt-live-chat-app > div#contents > yt-live-chat-renderer > iron-pages#content-pages > div#chat-messages > div#contents (note: non-unique id)
        //      div#ticker
        //      div#chat
        //          iframe#chatframe
        //          ytd-message-renderer.ytd-live-chat-frame
        //      iron-pages#panel-pages
        // 	        div#input-panel                                                                 (message input)
        // 	            yt-live-chat-message-input-renderer#live-chat-message-input>div#container   (always exists?)
        //                  div#top > div#input-container > yt-live-chat-text-input-field-renderer#input
        //                      div#input                                                           (text input; note: non-unique id)
        //                      tp-yt-iron-dropdown#dropdown                                        (emoji dropdown when manually typing :...)
        // 	                iron-pages#pickers>yt-emoji-picker-renderer#emoji                       (emoji picker)
        //                      div#search-panel
        // 	                    div#category-buttons                                                (emoji picker category buttons)
        // 	                    div#categories-wrapper>div#categories                               (emoji picker categories)
        // 	                        yt-emoji-picker-category-renderer                               (emoji picker category)
        // 	                div#buttons
        // 	                    div#picker-buttons>yt-live-chat-icon-toggle-button-renderer#emoji   (emoji picker toggle)
        // 	        div#buy-flow                                                                    (superchat buying)
        // 	            yt-live-chat-message-buy-flow-renderer                                      (only exists when buying superchats or milestone chats)
        // 	                iron-pages>div#preview>div#message>div#pickers-container
        // 	                    iron-pages#pickers>yt-emoji-picker-renderer#emoji                   (emoji picker - same as above)
        // 	                    div#picker-buttons>yt-live-chat-icon-toggle-button-renderer#emoji   (emoji picker toggle - same as above)

        watchEmojiPicker(eltMessageInput, true);

        // Superchat emoji picker only exists when div#buy-flow is non-empty (its empty whenever not buying superchats or milestone chats),
        // so need to watch for when it's added.
        const eltBuyflow = document.getElementById('buy-flow');
        console.debug('#buy-flow', eltBuyflow);
        new MutationObserver((records, observer) => {
            for (const record of records) {
                for (const node of record.addedNodes) {
                    if (node.nodeType === 1 && node.tagName.toLowerCase() === 'yt-live-chat-message-buy-flow-renderer') {
                        const eltBuyflowRenderer = node;
                        console.debug('yt-live-chat-message-buy-flow-renderer', eltBuyflowRenderer);
                        watchEmojiPicker(eltBuyflowRenderer, false);
                        return;
                    }
                }
            }
        }).observe(eltBuyflow, {
            childList: true,
        });
    }

    function watchEmojiPicker(eltContainer, watchForCategoriesRemoval) {
        // "categories" id isn't necessarily unique, so not using document.getElementById.
        const eltCategories = eltContainer.querySelector('#categories');
        // If chat is hidden, emoji categories won't be found.
        if (!eltCategories) {
            console.log('#categories not found - assuming chat is hidden');
            return;
        }
        console.log('watching #categories', eltCategories, 'in container', eltContainer);

        // Keep only only members-only (class CATEGORY_TYPE_CUSTOM) and YouTube-specific (class CATEGORY_TYPE_GLOBAL) emojis.
        let emojiClassesExist = false;
        new MutationObserver((records, observer) => {
            for (const record of records) {
                for (const node of record.addedNodes) {
                    if (node.nodeType === 1) { // element
                        for (const child of node.children) {
                            if (child.id === 'emoji') {
                                if (child.classList.contains('CATEGORY_TYPE_CUSTOM') || child.classList.contains('CATEGORY_TYPE_GLOBAL')) {
                                    emojiClassesExist = true;
                                } else {
                                    console.log('removing category', node);
                                    eltCategories.removeChild(node);
                                    break;
                                }
                                // Legacy code in case the new classes don't exist: remove emoji categories that contain SVGs.
                                // This no longer works since emojis should now all be png natively, but code kept just in case.
                                if (!emojiClassesExist) {
                                    const eltEmoji = child.firstElementChild;
                                    if (eltEmoji && eltEmoji.src && eltEmoji.src.endsWith('svg')) {
                                        console.log('removing category', node);
                                        eltCategories.removeChild(node);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }).observe(eltCategories, {
            childList: true,
        });

        if (watchForCategoriesRemoval) {
            // When user joins membership, #categories is removed and refreshed, so need to rewatch emoji pickers.
            // Specifically, the #live-chat-message-input container gets replaced within its parent #input-panel.
            console.debug('watching for #categories removal up to', eltContainer.parentElement);
            watchForElementRemoval(eltCategories, () => {
                console.log('#categories', eltCategories, 'was removed - assuming it was refreshed');
                // Should already be replaced, but if it's somehow not, will wait for it.
                waitForLiveChatMessageInput(watchEmojiPicker, watchForCategoriesRemoval)
            }, eltContainer.parentElement);
        }

        // Hide the category picker since there's only going to be 1 or 2 emoji categories. Also has non-unique id.
        const eltCategoryButtons = eltContainer.querySelector('#category-buttons');
        if (eltCategoryButtons) {
            console.log('removed #category-buttons', eltCategoryButtons);
            eltCategoryButtons.remove();
        } else {
            console.log('#category-buttons not found - ignoring');
        }
    }

    // Unfortunately there's no direct way to watch for a target element being removed.
    // The most performant way I've found so far is to recursively observe child removals for all the ancestors of the target up to root
    // (as opposed to observing the whole subtree of the root for removals, which is much more expensive).
    // When the target element is removed, given callback is called with (target, the ancestor that removed the subtree containing target).
    // If the root already does not contain the target, logs an error and throws.
    function watchForElementRemoval(target, callback, root) {
        if (!root) {
            root = target.ownerDocument;
        }
        if (!root.contains(target)) {
            console.error('root', root, 'does not contain target', target);
            throw new Error('root does not contain target');
        }
        if (root.nodeType === 9) { // document
            root = root.documentElement;
        }
        const observer = new MutationObserver((records, observer) => {
            // If root is document element, probably faster to check for target.isConnected (assuming that element hasn't been re-added)
            // but following allows determining what exactly removed the element
            for (const record of records) {
                let found = false;
                for (const node of record.removedNodes) {
                    if (node.contains(target)) {
                        console.debug('element', target, 'was removed via ancestor', record.target);
                        if (!found) {
                            found = true;
                            observer.disconnect();
                            console.debug('all mutation records:', records);
                        }
                        callback(target, record.target);
                    }
                }
            }
        });
        const options = {
            childList: true,
        };
        let element = target.parentNode; // don't observe the target (or rather, its children) itself
        let end = root.parentNode; // ensure root is observed in following loop
        while (element !== end) {
            observer.observe(element, options);
            element = element.parentNode;
        }
    }

    // Workaround for any extensions where iframes that were document.write'd having its location inherit from the calling code's frame
    // (e.g. if document.write called from either a script in parent frame or extension content script matching parent frame,
    // then the iframe's location would be the same as parent frame's location).
    const url = frameElement && frameElement.contentDocument?.URL === parent.document.URL ? frameElement.src || 'about:blank' : document.URL;
    console.debug('url:', url);
    if (url.startsWith('https://www.youtube.com/live_chat')) {
        waitForLiveChatMessageInput(watchEmojiPickers);
    }
})();
