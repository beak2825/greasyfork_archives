// ==UserScript==
// @name         irccloud latex rendering
// @namespace    http://github.com/hnOsmium0001/
// @version      1.0
// @description  Detect delimiter-ed message and render using KaTeX
// @author       hnOsmium0001
// @license      MIT
// @match        https://*.irccloud.com/*
// @resource     katexCSS https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css
// @require      https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/423219/irccloud%20latex%20rendering.user.js
// @updateURL https://update.greasyfork.org/scripts/423219/irccloud%20latex%20rendering.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    function hasClassPrefix(element, prefix) {
        if (!element.getAttribute) return false;

        const classes = (element.getAttribute("class") || "").split();
        return classes.some(x => x.startsWith(prefix));
    }

    // Declare rendering options (see https://katex.org/docs/autorender.html#api for details)
    const options = {
        delimiters: [
            { left: "$$", right: "$$", display: true },
        ],
    };

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

    function tryRenderLatexIn(elm) {
        // If the element doesn't have this class, it's something else (such as join leave message, date banner, etc.)
        if (!elm.classList.contains("type_buffer_msg")) {
            return;
        }

        new ChildrenSelector(elm)
            .andThenClass("message")
            .andThenClass("content")
            .accept(
                e => {
                    const txt = e.textContent;
                    if (txt.startsWith("$$")) {
                        // Function provided by KaTeX
                        renderMathInElement(e);
                    }
                },
                () => {}
            );
    }

    const buffersContainer = document.getElementById("buffersContainer");
    // Observer that renders latex in newly added messages
    const messageObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const added of mutation.addedNodes) {
                tryRenderLatexIn(added);
            }
        }
    });
    // Observer that attaches listener for buffer (each channel/PM) mutations
    const bufferObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const added of mutation.addedNodes) {
                let messageList;
                new ChildrenSelector(added)
                    .andThenClass("buffermainwrapper")
                    .andThenClass("buffermain")
                    .andThenClass("viewport")
                    .andThenClass("scroll")
                    .andThenClass("log")
                    .accept(
                        e => {
                            messageList = e;
                        },
                        () => {
                            throw "[LaTeX rendering] Failed to find mesasge list.";
                        }
                    );

                messageObserver.observe(messageList, { childList: true });
                for (const child of messageList.children) {
                    tryRenderLatexIn(child);
                }
            }
        }
    });
    bufferObserver.observe(buffersContainer, { childList: true });
})();
