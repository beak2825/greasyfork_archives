// ==UserScript==
// @name        owowify website
// @description owowify website evewywhewe! >w<
// @author      owowed
// @version     0.0.3
// @namespace   fun.owowed.moe
// @license     GPL-3.0-or-later
// @match       *://*/*
// @grant       none
// @run-at      document-end
// @copyright   All rights reserved. Licensed under GPL-3.0-or-later. View license at https://spdx.org/licenses/GPL-3.0-or-later.html
// @downloadURL https://update.greasyfork.org/scripts/485857/owowify%20website.user.js
// @updateURL https://update.greasyfork.org/scripts/485857/owowify%20website.meta.js
// ==/UserScript==

/**
 * wincesed undew GNYU! GPL vewsion 3.0 -w-
 */

const blocklistTags = "style, script, svg, noscript, iframe, object, code, pre, input";

!function () {
    const updateSubtreeOwowification = () => {
        setTimeout(() => owowifySubtree(document.body), 700);
    };
    const windowHrefCheck = stateCheck(
        () => window.location.href,
        () => updateSubtreeOwowification()
    );
    const documentTitleCheck = stateCheck(
        () => owowify(document.title)
    );

    const observer = new MutationObserver((records) => {
        if (windowHrefCheck()) return;

        documentTitleCheck();

        for (const record of records) {
            for (const newNode of record.addedNodes) {
                owowifySubtree(newNode);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        /* don't use characterData, it'll kill your page */
    });

    owowifySubtree(document.body);
    document.title = owowify(document.title);

    function stateCheck(newValueGetter, callback) {
        let value = newValueGetter;

        return () => {
            const newValue = newValueGetter();
            if (value != newValue) {
                value = newValue;
                callback?.();
                return true;
            }
        };
    }
}();

/** @param {Element} element */
function owowifySubtree(element) {
    if (element.nodeType != Node.ELEMENT_NODE) return;

    const currentElementValid =
        isElementValidOwowify(element) &&
        isElementValidOwowify(element.parentElement);

    if (!currentElementValid) {
        element.noOwowify = true;
    }

    if (element instanceof HTMLInputElement) {
        if (element.readOnly && !["password", "url", "hidden"].includes(element.type)) {
            element.value = owowify(element.value);
            element.placeholder = owowify(element.placeholder);
        }
    }

    if (element.hasAttribute("title")) {
        element.setAttribute("title", owowify(element.getAttribute("title")));
    }

    for (const node of element.childNodes) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            owowifySubtree(node);
        }
        if (node.nodeType == Node.TEXT_NODE && currentElementValid) {
            owowifyTextNode(node);
        }
    }
}

/** @param {Node} node */
function owowifyTextNode(node) {
    if (node.nodeType == Node.TEXT_NODE) {
        node.nodeValue = owowify(node.nodeValue);
    }
}

/** @param {Element} element */
function isElementValidOwowify(element) {
    if (element == null) return null;
    if (element.noOwowify || element.classList?.contains?.("-owo-no-owowify")) return false;
    if (element instanceof HTMLInputElement) {
        return !element.textContent.includes(element.href);
    }
    return !(element.matches(blocklistTags) || element.isContentEditable);
}

/**
 * @param {String} inputText 
 * @returns {String}
 */
function owowify(inputText) {
    const endSentencePattern = String.raw`([\w ,.!?]+)?`; // endSentencePattern
    // const endSentencePattern1 = String.raw`([\w ,.?]+)?`; // endSentencePattern without "!" sign
    // const endSentencePattern2 = String.raw`([\w ,.]+)?`; // endSentencePattern without "!" and "?" sign
    const vowel = "[aiueo]";
    const vowelNoE = "[aiuo]"; // vowel without e
    const vowelNoIE = "[auo]"; // vowel without i and e
    const zackqyWord = "[jzckq]";

    const result = inputText
    // OwO emote
        .replace(reg`/(i(?:'|)m(?:\s+|\s+so+\s+)bored)${endSentencePattern}/gi`, subOwoEmote("-w-"))
        .replace(reg`/(love\s+(?:you|him|her|them))${endSentencePattern}/gi`, subOwoEmote("uwu"))
        .replace(reg`/(i\s+don(?:'|)t\s+care|i\s*d\s*c)${endSentencePattern}/gi`, subOwoEmote("0w0"))
    // world substitution
        .replace(reg`/l${vowel}ve?/gi`, $0 => subSameCase($0, "luv"))
    // OwO translation
    /* replace all "r" to "w", no exception! */
        .replace(/r/gi, $0 => subSameCase($0, "w"))
    /* lame -> wame, goal -> goaw, gallery -> gallewy, lol -> lol, null -> null */
        .replace(reg`/(?<!([wl]${vowel}+)|l)l(?!(${vowel}?l+)|.${vowel})/gi`, $0 => subSameCase($0, "w"))
    /* na -> nya, nu -> nyu, no -> nyo, ne -> nye */
        .replace(reg`/n(${vowelNoE}+)/gi`,
            ($0, $vowel) => subSameCase($0 + $vowel, `ny${$vowel}`))
    /* ma -> mya, mu -> myu, mo -> myo */
        .replace(reg`/m(${vowelNoIE}+)(?!w*${zackqyWord})/gi`,
            ($0, $vowel) => subSameCase($0 + $vowel, `my${$vowel}`))
    /* pa -> pwa, pu -> pwu, po -> pwo */
        .replace(reg`/p(${vowelNoIE}+)(?!w*${zackqyWord})/gi`,
            ($0, $vowel) => subSameCase($0 + $vowel, `pw${$vowel}`));

    return result;
}

function subOwoEmote(emote) {
    const matchEndSpace = /^\s+$/g;

    return ($0, $setenceBeforeEnd, $endSentence) => {
        if ($endSentence == undefined || matchEndSpace.test($endSentence)) {
            return `${$setenceBeforeEnd} ${emote}`;
        }
        else return $0;
    }
}

/** 
 * @param {string} inputText
 * @param {string} replaceText
 */
function subSameCase(inputText, replaceText) {
    let result = "";

    for (let i = 0; i < replaceText.length; i++) {
        if (inputText[i] != undefined && replaceText[i] != undefined) {
            if (inputText[i].toUpperCase() == inputText[i]) {
                result += replaceText[i].toUpperCase();
            }
            else if (inputText[i].toLowerCase() == inputText[i]) {
                result += replaceText[i].toLowerCase();
            }
            else {
                result += replaceText[i];
            }
        }
        else {
            result += replaceText[i];
        }
    }

    return result;
}

/** @param {[string[], ...any[]]} templateArgs */
function reg(...templateArgs) {
    const rawString = String.raw(...templateArgs);
    const pattern = rawString.substring(1, rawString.lastIndexOf("/"));
    const flags = rawString.substring(rawString.lastIndexOf("/")+1, rawString.length);

    return new RegExp(pattern, flags);
}

// mdn docs
/** @param {string} str */
function regexEscape(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}