// ==UserScript==
// @name         Highlight YouTube Commenter Mentions
// @description  Highlights usernames of previous commenters at the start of replies, so that they are clearly distinguishable from the actual response. Different arrows are added when the commenter of the preceding comment or the OP is mentioned. (Mentions of users that changed their display names cannot be recognized.)
//
// @namespace    https://github.com/h-h-h-h
// @version      2019.01.12
//
// @match        https://www.youtube.com/*
// @run-at       document-end
// @grant        none
//
// @author       Henrik Hank
// @copyright    2018, Henrik Hank (https://github.com/h-h-h-h)
// @license      Apache License, Version 2.0 (https://www.apache.org/licenses/LICENSE-2.0)
//
// @homepageURL  https://greasyfork.org/scripts/374664-highlight-youtube-commenter-mentions
// @supportURL   https://greasyfork.org/scripts/374664-highlight-youtube-commenter-mentions/feedback
// @downloadURL https://update.greasyfork.org/scripts/374664/Highlight%20YouTube%20Commenter%20Mentions.user.js
// @updateURL https://update.greasyfork.org/scripts/374664/Highlight%20YouTube%20Commenter%20Mentions.meta.js
// ==/UserScript==

//i This userscript requires a modern browser that supports ES6.

void function userscript() {
    "use strict";

    const SEL_COMMENT_SECTION = "ytd-comments#comments > ytd-item-section-renderer#sections.ytd-comments > div#contents.ytd-item-section-renderer";
    const SEL_THREAD = "#contents.ytd-item-section-renderer > ytd-comment-thread-renderer.ytd-item-section-renderer";
    const SEL_TOP_LEVEL_COMMENT = "ytd-comment-renderer#comment.ytd-comment-thread-renderer";
    const SEL_REPLY = "ytd-comment-renderer[is-reply]";
    const SEL_COMMENT_USERNAME = "a#author-text.ytd-comment-renderer:not([hidden]) > span.ytd-comment-renderer";
    const SEL_COMMENT_USERNAME_WITH_AUTHOR_BADGE = "span#author-comment-badge:not([hidden]) > ytd-author-comment-badge-renderer > a#name > yt-formatted-string";
    const SEL_COMMENT_TEXT = "yt-formatted-string#content-text.ytd-comment-renderer";

    const HIGHLIGHTING_CONTAINER_CLASS = "userscript__username-highlighting-container";

    let gCommentSectionExistsTimer = null;
    let gTopLevelObserver = null;
    let gCommentObserver = null;

    // The required surroundings of a highlighting.
    let gHighlightingPrefixes = [ "@ ", "@", "+", "" ];
    let gHighlightingTails = [
        " ", "\n", "\r", "\xa0" /*(no-break space; actually encountered)*/,
        ": ", ", ", ". ",
        "...", "…"
    ];


    void function main() {
        console.assert = console.assert  ||  function() { };  // Allegedly, some browsers don't have it.

        //
        document
            .querySelector("yt-navigation-manager")
            //TODO: ^^^ Returns `null` in Opera, though it's not `null` when run from the dev console shortly after.
            .addEventListener("yt-navigate-finish", onYouTubeNavigateFinish);

        initializePage();
    }.call();


    /**
     * This event occurs after the user navigated to a new page in a `pushState()` manner, e.g., a channel page or a watch page.
     */
    function onYouTubeNavigateFinish(event) {
        initializePage();
    }


    function initializePage() {
        if (gCommentObserver) {
            // Prevent memory leak.
            gCommentObserver.disconnect();
        }

        if (window.location.pathname !== "/watch" ||
            gCommentSectionExistsTimer ||
            gTopLevelObserver)
        {
            return;
        }

        gCommentSectionExistsTimer = setInterval(onCommentSectionExistsTimer, 200 /*ms*/);
        //i This doesn't run a long time (e.g., while playing video), because it only refers to the top-level comments container that is created early on and not just when the user scrolls down.
    }


    function onCommentSectionExistsTimer() {
        let commentSection = document.querySelector(SEL_COMMENT_SECTION);
        if (! commentSection) { return; }

        clearInterval(gCommentSectionExistsTimer);
        gCommentSectionExistsTimer = null;

        gTopLevelObserver = new MutationObserver(onCommentSectionMutation);
        gTopLevelObserver.observe(commentSection, { childList: true });

        createStyles();
    }


    function createStyles() {
        let el = document.createElement("style");
        el.innerHTML = `
            /* User mentions that were previously plain text... */
            .userscript__username-highlighting,

            /* ...and already linked user mentions (no adding of arrows provided). */
            ${SEL_REPLY} a[href^="/channel/"].yt-simple-endpoint.yt-formatted-string,
            ${SEL_REPLY} a[href^="/user/"   ].yt-simple-endpoint.yt-formatted-string {
                background-color: hsla(0, 0%, 50%, 0.22);
                /*i Using a translucent color accommodates light *and* dark themes. */

                padding: 0 0.2em 0 0.2em;
            }

            /* Arrows at the end of highlightings. */
            .userscript__username-highlighting--is-op:after {
                content: " 🡔";  /* Alternatives: ⭦ ⭶ ↖ ⬉ ⮅ */
                font-family:
                    /*Windows:*/ "Segoe UI Symbol",
                    /*macOS:*/   /*[?]*/
                    /*Ubuntu:*/  "Symbola",
                    sans-serif;
            }

            .userscript__username-highlighting--is-previous-commenter:after {
                content: " ⤹";  /* Alternatives: ⇡ ⭫ ↥ ⭱ 🡑 ⭡ ↑ */

                /* Only for above arrow with round tail. */
                display: inline-block;
                transform: scaleY(-1);

                font-family:
                    /*Windows:*/ "Cambria",
                    /*macOS:*/   /*[?]*/
                    /*Ubuntu:*/  "STIX", "Symbola",
                    serif;
            }
        `;
        document.head.appendChild(el);

        //i `GM_addStyle()`/`GM.addStyle()` is not supported anymore in Greasemonkey 4.
    }


    function onCommentSectionMutation(mutations, observer) {
        for (let i = 0;  i < mutations.length;  i++) {
            let nodes = mutations[i].addedNodes;
            for (let j = 0;  j < nodes.length;  j++) {
                let node = nodes[j];

                if (node instanceof Element &&
                    node.matches(SEL_THREAD))
                {
                    let el = node.querySelector("#loaded-replies");
                    if (el) {  // Replies present.
                        if (! gCommentObserver) {
                            gCommentObserver = new MutationObserver(onCommentMutation);
                        }
                        gCommentObserver.observe(el, { childList: true });
                    }
                }
            }
        }
    }


    function onCommentMutation(mutations, observer) {
        for (let i = 0;  i < mutations.length;  i++) {
            let nodes = mutations[i].addedNodes;
            if (nodes.length === 0) { return; }  // Possible and encountered.

            // Find topmost element of those added.
            let parent = mutations[i].target;
            let siblings = parent.children;
            let smallestReplyIndex = siblings.length - 1;
            console.assert(smallestReplyIndex >= 0);

            for (let j = 0;  j < nodes.length;  j++) {
                let node = nodes[j];

                if (node instanceof Element &&
                    node.matches(SEL_REPLY))
                {
                    let index = Array.prototype.indexOf.call(siblings, node);
                    if (index > -1  &&  index < smallestReplyIndex) {
                        smallestReplyIndex = index;
                    }
                }
            }

            //
            highlightReplies(parent, smallestReplyIndex);
        }
    }


    function highlightReplies(repliesContainer, startIndex) {
        // Find top-level comment for its username.
        let threadElement = repliesContainer;
        while (threadElement !== null  &&  ! threadElement.matches(SEL_THREAD)) {
            threadElement = threadElement.parentElement;
        }
        console.assert(threadElement !== null);

        let topLevelComment = threadElement.querySelector(`:scope > ${SEL_TOP_LEVEL_COMMENT}`);
        console.assert(topLevelComment !== null);

        // Gather usernames and highlight them at the beginning of comment texts.
        let usernames = [ getAdjustUsernameOfComment(topLevelComment, false) ];

        let elements = repliesContainer.children;
        for (let i = 0;  i < elements.length;  i++) {
            let comment = elements[i];
            if (! comment.matches(SEL_REPLY)) { continue; }

            // Highlight.
            let maySignalOp = false;
            if (i >= startIndex) {  // The above replies have been highlighted already.
                let el = comment.querySelector(SEL_COMMENT_TEXT);
                console.assert(el !== null);

                // YouTube recycles DOM elements across watch pages. Therefore, we must remove what we added earlier. Otherwise, some comment texts will be wrong. `getAdjustUsernameOfComment()` further down completes the reset.
                let firstNode = el.firstChild;
                if (firstNode &&
                    firstNode.nodeType === Node.ELEMENT_NODE &&
                    firstNode.classList.contains(HIGHLIGHTING_CONTAINER_CLASS))
                {
                    firstNode.remove();
                    firstNode = el.firstChild;
                }
                
                // Highlight.
                if (firstNode &&
                    firstNode.nodeType === Node.TEXT_NODE)
                {
                    let text = firstNode.nodeValue;
                    for (let j = 0;  j < usernames.length;  j++) {
                        let startLength = startsWith(
                            text,
                            gHighlightingPrefixes,
                            [ usernames[j] ],
                            null,  // Highlight till this point.
                            gHighlightingTails
                        );
                        if (startLength > 0) {
                            highlightFirstChars(
                                firstNode,
                                startLength,
                                /*is previous commenter:*/ usernames[j] === usernames[usernames.length - 1],
                                /*is OP:*/ j === 0
                            );
                            break;
                        }
                    }
                }

                maySignalOp = true;
            }

            // Gather and possibly signal comment as written by OP.
            usernames.push(
                getAdjustUsernameOfComment(
                    comment,
                    maySignalOp ? usernames[0] : null
                )
            );
        }
    }


    function getAdjustUsernameOfComment(commentElement, usernameToSignalAsOp /*or null*/) {
        let usernameElement =
            commentElement.querySelector(SEL_COMMENT_USERNAME) ||
            commentElement.querySelector(SEL_COMMENT_USERNAME_WITH_AUTHOR_BADGE);
        console.assert(usernameElement !== null);

        let username = usernameElement.textContent.trim();

        usernameElement.style.fontStyle = (
            username === usernameToSignalAsOp ?
                "italic"
            :
                null  // Reset in any case because of YouTube's DOM element recycling (more info elsewhere).
        );

        return username;
    }


    /**
     * `tokenArrays`: Pass `null` at the position you want to stop counting the string length. In case of a successfully matched token, the algorithm will proceed with the next array and no backtracking will occur. An empty string will invalidate the following items and must therefore be the last element.
     * Returns the length of the string that `text` starts with.
     */
    function startsWith(text, ...tokenArrays) {
        if (tokenArrays.length === 0) { return 0; }

        let arrayIndex = 0;
        let tokens = tokenArrays[arrayIndex];
        let tokenIndex = 0;
        let textIndex = 0;

        let startLength = 0;
        let hasStoppedCounting = false;

        while (true) {
            let token = tokens[tokenIndex];
            if (text.startsWith(token, textIndex)) {
                // Partial success. Carry on or finish.
                if (! hasStoppedCounting) {
                    startLength += token.length;
                }
                textIndex += token.length;

                arrayIndex++;
                if (arrayIndex >= tokenArrays.length) {
                    return startLength;
                }

                while ( (tokens = tokenArrays[arrayIndex]) === null ) {
                    hasStoppedCounting = true;
                    arrayIndex++;
                }
                tokenIndex = 0;
            } else {
                // Token not present. Not finding any one of a given array means failure.
                tokenIndex++;
                if (tokenIndex >= tokens.length) {
                    return 0;
                }
            }
        }
    }


    function highlightFirstChars(textNode, numberOfChars, mustSignalAsPreviousCommenter, mustSignalAsOp) {
        let el = document.createElement("span");
        el.classList.add(HIGHLIGHTING_CONTAINER_CLASS);

        let text = textNode.nodeValue;
        let left = text.substr(0, numberOfChars);
        let right = text.substr(numberOfChars);

        el.innerHTML = (
            `<span
                class="
                    userscript__username-highlighting
                    ${
                        mustSignalAsPreviousCommenter ?
                            "userscript__username-highlighting--is-previous-commenter"
                        : mustSignalAsOp ?
                            "userscript__username-highlighting--is-op"
                        :
                            ""
                    }
                "
            >${left}</span>${right}`
        );

        textNode.replaceWith(el);
    }
}.call();
