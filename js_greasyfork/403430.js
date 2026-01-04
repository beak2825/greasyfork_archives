// ==UserScript==
// @name         Mathcord Reborn
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Typeset equations in Discord messages.
// @author       Till Hoffmann, hnOsmium0001
// @license      MIT
// @match        https://discordapp.com/*
// @match        https://discord.com/*
// @resource     katexCSS https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css
// @require      https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/403430/Mathcord%20Reborn.user.js
// @updateURL https://update.greasyfork.org/scripts/403430/Mathcord%20Reborn.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!renderMathInElement) throw "Katex did not load correctly!";

    /**
     * Evaluate whether an element has a certain class prefix.
    */
    function hasClassPrefix(element, prefix) {
        if (!element.getAttribute) return false;

        const classes = (element.getAttribute("class") || "").split();
        return classes.some(x => x.startsWith(prefix));
    }

    // Declare rendering options (see https://katex.org/docs/autorender.html#api for details)
    const options = {
        delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true },
            // Needs to come last to prevent over-eager matching of delimiters
            { left: "$", right: "$", display: false },
        ],
    };

    // Align block LaTeX to the left for better viewing experience
    GM_addStyle(`
        .katex-html {
            text-align: left !important;
        }
    `);

    // We need to download the CSS, modify any relative urls to be absolute, and inject the CSS
    const pattern = /url\((.*?)\)/gi;
    const katexCSS = GM_getResourceText("katexCSS").replace(pattern, 'url(https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/$1)');
    GM_addStyle(katexCSS);

    class ChildrenSelector {
        constructor(elm) {
            this.elm = elm;
        }

        andThenTag(tag, alternativeElm) {
            if (!this.elm) {
                this.elm = alternativeElm;
                return this;
            }

            for (const child of this.elm.childNodes) {
                if (child.tagName === tag) {
                    this.elm = child;
                    return this;
                }
            }
            this.elm = alternativeElm;
            return this;
        }

        andThenClass(prefix, alternativeElm) {
            if (!this.elm) {
                this.elm = alternativeElm;
                return this;
            }

            for (const child of this.elm.childNodes) {
                if (hasClassPrefix(child, prefix)) {
                    this.elm = child;
                    return this;
                }
            }
            // Failed to find a matching children
            this.elm = alternativeElm;
            return this;
        }

        accept(successful, failed) {
            if (this.elm) {
                successful(this.elm);
            } else {
                failed();
            }
        }
    }

    function updateFor_chat(added) {
        const chatContent = new ChildrenSelector(added)
            .andThenClass("content")
            .andThenTag("MAIN")
            .elm;
        updateFor_chatContent(chatContent);
    }

    function updateFor_chatContent(added) {
        new ChildrenSelector(added)
            .andThenClass("messagesWrapper")
            .andThenClass("scroller")
            .andThenClass("scrollerContent")
            .andThenClass("scrollerInner")
            .accept(
                scroller => {
                  console.log("here")
                    for (const candidate of scroller.children) {
                        if (hasClassPrefix(candidate, "chat-messages")) {
                            renderMathInElement(candidate, options);
                        }
                    }
                },
                () => {
                    throw "Failed to find 'scrollerInner' element on content change (reloading cached meesages)";
                }
            );
    }

    // Monitor the document for changes and render math as necessary
    const observer = new MutationObserver(function (mutations, observer) {
        for (const mutation of mutations) {
            const target = mutation.target;
            // Respond to newly loaded messages
            if (hasClassPrefix(target, "scrollerInner")) {
                // Iterate over all messages added to the scroller and typeset them
                for (const added of mutation.addedNodes) {
                    if (added.tagName === "LI" && hasClassPrefix(added, "chat-messages")) {
                        renderMathInElement(added, options);
                    }
                }
            }
            // Respond to edited messages
            else if (hasClassPrefix(target, "contents") &&
                hasClassPrefix(target.parentNode, "message")) {
                for (const added of mutation.addedNodes) {
                    // Do not typeset the interactive edit container
                    if (added.tagName === "DIV" && !added.getAttribute("class")) {
                        continue;
                    }
                    // Hack to get around Discord's slight delay between confirm edit and edit displayed
                    setTimeout(_ => renderMathInElement(added, options), 1000);
                }
            }
            // Respond to reloading cached messages
            else if (hasClassPrefix(target, "message")) {
                new ChildrenSelector(target)
                    .andThenClass("contents")
                    .andThenClass("message-content")
                    .accept(
                        messageContent => {
                            renderMathInElement(messageContent, options);
                        },
                        () => {
                            throw "Failed, TODO report bug";
                        }
                    );
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
