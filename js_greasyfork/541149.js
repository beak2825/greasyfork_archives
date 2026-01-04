// ==UserScript==
// @name                Inject Stylus into shadowRoots
// @namespace           https://greasyfork.org/users/821661
// @version             2.2
// @description         inject styles of stylus-addon in shadowRoot
// @author              hdyzen
// @run-at              document-start
// @match               https://*/*
// @grant               none
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/541149/Inject%20Stylus%20into%20shadowRoots.user.js
// @updateURL https://update.greasyfork.org/scripts/541149/Inject%20Stylus%20into%20shadowRoots.meta.js
// ==/UserScript==

const sheet = new CSSStyleSheet();
const sheetInDoc = new CSSStyleSheet();
const originalShadowRootDescriptor = Object.getOwnPropertyDescriptor(ShadowRoot.prototype, "adoptedStyleSheets");
const originalAttachShadow = Element.prototype.attachShadow;

function syncStyles() {
    const nodes = document.querySelectorAll(
        "html > style:is(.stylus, .stylish-style, .xstyle, [data-source='User JavaScript and CSS'], .amino, [id^='stylebot']), body > style[data-style-created-by='magicss'], head > style[data-custom-css-by-denis]",
    );

    let cssText = "";

    for (const node of nodes) {
        cssText += `${node.textContent}\n`;
    }

    if (sheet.cssRules.length === 0 || sheet.cssRules[0]?.cssText !== cssText) {
        sheet.replaceSync(cssText);
    }
}

Element.prototype.attachShadow = function (init) {
    const shadowRoot = originalAttachShadow.call(this, init);

    shadowRoot.adoptedStyleSheets.push(sheet);
    shadowRoot.adoptedStyleSheets.push(sheetInDoc);

    return shadowRoot;
};

Object.defineProperty(ShadowRoot.prototype, "adoptedStyleSheets", {
    get() {
        return originalShadowRootDescriptor.get.call(this);
    },
    set(newSheets) {
        if (!newSheets.includes(sheet)) {
            newSheets.push(sheet);
        }
        if (!newSheets.includes(sheetInDoc)) {
            newSheets.push(sheetInDoc);
        }

        originalShadowRootDescriptor.set.call(this, newSheets);
    },
    configurable: true,
    enumerable: true,
});

function syncAdoptedStyles() {
    let stylusRules = "";

    for (const s of document.adoptedStyleSheets) {
        if (!s.media.mediaText.includes("stylus-")) continue;

        for (const cssRule of s.cssRules) {
            stylusRules += `${cssRule.cssText}\n`;
        }
    }

    if (sheetInDoc.cssRules.length === 0 || sheetInDoc.cssRules[0]?.cssText !== stylusRules) {
        sheetInDoc.replaceSync(stylusRules);
    }

    // prevent run in inactive tabs
    requestAnimationFrame(() => setTimeout(syncAdoptedStyles, 250));
}

requestAnimationFrame(syncAdoptedStyles);

new MutationObserver(syncStyles).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
});
