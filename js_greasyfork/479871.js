// ==UserScript==
// @name         Fix kbin Code Blocks
// @namespace    pamasich-kbin
// @version      2.0.1
// @description  Fix for kbin code blocks federated from Lemmy. Strips out the weird <span> tags on each line.
// @author       Pamasich
// @match        https://kbin.social/*
// @match        https://kbin.earth/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479871/Fix%20kbin%20Code%20Blocks.user.js
// @updateURL https://update.greasyfork.org/scripts/479871/Fix%20kbin%20Code%20Blocks.meta.js
// ==/UserScript==
 
/*
    This script fixes code blocks on kbin that originate from Lemmy.
    When federating code blocks, Lemmy includes additional <span> tags
    which kbin currently does not expect, so it just renders them in plaintext.
    The script removes those tags from code blocks.
*/

/** @type {String} */
const STYLEPATTERN = "((font-style:italic|font-weight:bold);)?color:#[0-9a-fA-F]{6};";

function setup () {
    getCodeBlocks().forEach((code) => fix(code));
}

/**
 * Repairs a given code block.
 * @param {HTMLElement} original The code block that needs to be fixed
 */
function fix (original) {
    if (!isErroneousCode(original)) return;
    const fixed = document.createElement("code");
    original.after(fixed);

    const start = new RegExp(`^\\n?<span style="${STYLEPATTERN}">`);
    const end = new RegExp(`\\n<\\/span>\\n?$`);
    const combined = new RegExp(`<\\/span><span style="${STYLEPATTERN}">`, "g");

    fixed.textContent = original.textContent
        .replace(start, "")
        .replaceAll(combined, "")
        .replace(end, "");

    original.style.display = "none";
}

/**
 * Checks whether a given code block needs to be fixed.
 * @param {HTMLElement} code
 * @returns {Boolean}
 */
function isErroneousCode (code) {
    const pattern = new RegExp(`^\\n?<span style="${STYLEPATTERN}">(.+\\n)+<\\/span>\\n?$`);
    return pattern.test(code.textContent);
}

/**
 * @returns {HTMLElement[]} A list of all the code blocks on the page
 */
function getCodeBlocks () {
    return Array.from(document.querySelectorAll("pre code"));
}

setup();

const observer = new MutationObserver((mutations) => {
    // the filter ensures the script only looks for new code blocks to fix if new comments were added or the user navigated to a different thread
    const codeBlocks = mutations.flatMap((mutation) => Array.from(mutation.addedNodes))
        .filter((node) => node.nodeName == "BLOCKQUOTE" || node.nodeName == "BODY")
        .flatMap((node) => Array.from(node.querySelectorAll("pre code")));
    // codeBlocks at this point might contain the same node twice, so the Set constructor is used to get unique nodes
    new Set(codeBlocks).forEach(fix);
});
// observing the entire document because of turbo mode
observer.observe(document, { childList: true, subtree: true });