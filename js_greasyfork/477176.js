// ==UserScript==
// @name         Rich PC Specialist post to forum
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make a PC Specialist Rich post-to-forum page, adding the possibility to make comments and format them
// @author       sck451
// @match        https://www.pcspecialist.co.uk/misc/forum.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pcspecialist.co.uk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477176/Rich%20PC%20Specialist%20post%20to%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/477176/Rich%20PC%20Specialist%20post%20to%20forum.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const parentDiv = document.querySelectorAll('div')[1];

    const style = document.createElement("style");
    style.innerHTML = `.hover { color: #a00; cursor: pointer;}button {position: fixed; font-size: 1.5em; padding: 0.5em; margin: 0.2em;height: 2.5em;right: 10px;}`;
    document.head.appendChild(style);

    addButtons();

    function getSpan(evt) {
        let span;
        if (evt.target.nodeName === "SPAN") {
            span = evt.target;
        }
        if (evt.target.parentNode.nodeName === "SPAN") {
            span = evt.target.parentNode;
        }
        return span;
    }

    function mouseoverHandler(evt) {
        const span = getSpan(evt);
        if (!span) return;

        enrichLine(span);
    }
    function mouseoutHandler(evt) {
        const span = getSpan(evt);
        if (!span) return;

        derichLine(span);
    }
    function clickHandler(evt) {
        const span = getSpan(evt);
        if (!span) return;

        editComment(span);
    }

    function wrapTextNodes(parentEl) {
        const textNodes = getTextNodes(parentEl);

        for (const textNode of textNodes) {
            const span = document.createElement("span");
            textNode.after(span);
            span.appendChild(textNode);
            span.classList.add("pcsrLine");
            if (span.nextElementSibling.classList.contains("pcsrComment")) {
                span.appendChild(span.nextElementSibling);
            }
        }

        parentEl.addEventListener("mouseover", mouseoverHandler);
        parentEl.addEventListener("mouseout", mouseoutHandler);
        parentEl.addEventListener("click", clickHandler);
    }

    function unwrapTextNodes(parentEl) {
        const spans = parentEl.querySelectorAll(".pcsrLine");
        for (const span of spans) {
            span.replaceWith(...span.childNodes);
        }

        parentEl.removeEventListener("mouseover", mouseoverHandler);
        parentEl.removeEventListener("mouseout", mouseoutHandler);
        parentEl.removeEventListener("click", clickHandler);
    }

    function editComment(line) {
        const existingComment = line.querySelector(".pcsrComment");

        const comment = window.prompt("What comment do you want to add?", existingComment?.textContent.trim() || "");
        if (comment === null) {
            return;
        }

        if (existingComment) {
            if (comment.trim() === "") {
                existingComment.remove();
                return;
            }

            existingComment.textContent = " " + comment;
            return;
        }

        const newComment = document.createElement("b");
        newComment.classList.add("pcsrComment");
        newComment.textContent = " " + comment;
        line.appendChild(newComment);
    }

    function getTextNodes(parentEl) {
        return [...parentEl.childNodes].filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
    }

    function enrichLine(line) {
        line.classList.add("hover");
    }
    function derichLine(line) {
        line.classList.remove("hover");
    }

    function addButtons() {
        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy to clipboard";
        copyButton.style.top = "0.2em";
    
        copyButton.addEventListener("click", () => {
            unwrapTextNodes(parentDiv);
            const range = document.createRange();
            range.selectNode(document.querySelectorAll("div")[1]);
            window.getSelection().addRange(range);
            document.execCommand("copy");
            document.getSelection().removeAllRanges();
        });
    
        document.body.appendChild(copyButton);

        const enrichButton = document.createElement("button");
        enrichButton.textContent = "Add comments";
        enrichButton.style.top = "3.1em";
        document.body.appendChild(enrichButton);

        enrichButton.addEventListener("click", evt => {
            wrapTextNodes(parentDiv);
        })
    }
})();