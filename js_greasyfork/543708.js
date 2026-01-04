// ==UserScript==
// @name         Anti Font Fingerprinting (Limited Probes)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Stops fingerprinting scripts from testing 3000+ fonts by faking layout results after 200 probes. Includes metric spoofing and font stability per session.
// @author       Atom
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543708/Anti%20Font%20Fingerprinting%20%28Limited%20Probes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543708/Anti%20Font%20Fingerprinting%20%28Limited%20Probes%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Exclude trusted domains if needed
    const excludeSites = [
        "gmail.com", "outlook.com", "notion.so", "office.com", "figma.com"
    ];
    const currentHost = location.hostname;
    if (excludeSites.some(site => currentHost.includes(site))) return;

    const randomOffset = () => (Math.random() - 0.5) * 2;

    const MAX_FONT_PROBES = 200;
    let fontProbeCount = 0;

    // Monkey patch getBoundingClientRect to limit effectiveness of font testing
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function(...args) {
        const tag = this.tagName.toLowerCase();
        const font = this.style?.fontFamily?.toLowerCase?.() || "";
        const isHidden = this.offsetParent === null || this.offsetWidth === 0;
        const likelyProbe = tag === "span" && font && isHidden;

        const rect = originalGetBoundingClientRect.apply(this, args);
        if (likelyProbe) {
            fontProbeCount++;
            if (fontProbeCount > MAX_FONT_PROBES) {
                // Return fake, constant rect to break detection
                return {
                    ...rect,
                    width: 100,
                    height: 10,
                    top: 0, left: 0, bottom: 10, right: 100,
                    x: 0, y: 0,
                    toJSON: rect.toJSON.bind(rect)
                };
            }
        }
        // Otherwise slightly randomize
        return {
            ...rect,
            width: rect.width + randomOffset(),
            height: rect.height + randomOffset(),
            x: rect.x + randomOffset(),
            y: rect.y + randomOffset(),
            top: rect.top + randomOffset(),
            left: rect.left + randomOffset(),
            right: rect.right + randomOffset(),
            bottom: rect.bottom + randomOffset(),
            toJSON: rect.toJSON.bind(rect)
        };
    };

    // Same for offsetWidth / offsetHeight
    const patchOffset = (prop) => {
        const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop);
        Object.defineProperty(HTMLElement.prototype, prop, {
            get: function() {
                const font = this.style?.fontFamily?.toLowerCase?.() || "";
                const tag = this.tagName.toLowerCase();
                const isHidden = this.offsetParent === null || descriptor.get.call(this) === 0;
                const likelyProbe = tag === "span" && font && isHidden;

                if (likelyProbe) {
                    fontProbeCount++;
                    if (fontProbeCount > MAX_FONT_PROBES) {
                        return prop.includes("Width") ? 100 : 10;
                    }
                }
                return descriptor.get.call(this) + randomOffset();
            },
            configurable: true
        });
    };

    patchOffset("offsetWidth");
    patchOffset("offsetHeight");

    // Patch Canvas measureText
    const originalMeasureText = CanvasRenderingContext2D.prototype.measureText;
    CanvasRenderingContext2D.prototype.measureText = function(text) {
        const metrics = originalMeasureText.apply(this, arguments);
        return {
            ...metrics,
            width: metrics.width + randomOffset(),
            actualBoundingBoxLeft: metrics.actualBoundingBoxLeft + randomOffset(),
            actualBoundingBoxRight: metrics.actualBoundingBoxRight + randomOffset(),
            actualBoundingBoxAscent: metrics.actualBoundingBoxAscent + randomOffset(),
            actualBoundingBoxDescent: metrics.actualBoundingBoxDescent + randomOffset()
        };
    };

    // Optional: Hide document.fonts completely (not used by browserleaks, but useful elsewhere)
    Object.defineProperty(document, 'fonts', {
        get: () => ({
            forEach: () => {},
            ready: Promise.resolve(),
            add: () => {},
            delete: () => {},
            clear: () => {},
            size: 0
        }),
        configurable: true
    });

    console.log("[Anti-Fingerprint] Font probe limiter active. Max probes:", MAX_FONT_PROBES);
})();
