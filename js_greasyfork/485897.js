// ==UserScript==
// @name        Sabotage Window/Tab Switch Visibility
// @description Make website completely invisible to the user switching to another window or tab. May break some websites.
// @author      owowed <island@owowed.moe>
// @version     0.0.3
// @namespace   util.owowed.moe
// @license     GPL-3.0-or-later
// @match       *://*/*
// @grant       unsafeWindow
// @run-at      document-start
// @copyright   All rights reserved. Licensed under GPL-3.0-or-later. View license at https://spdx.org/licenses/GPL-3.0-or-later.html
// @downloadURL https://update.greasyfork.org/scripts/485897/Sabotage%20WindowTab%20Switch%20Visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/485897/Sabotage%20WindowTab%20Switch%20Visibility.meta.js
// ==/UserScript==

!function () {
    /* Disable focus and blur event of document and window */

    const windowProto = globalThis.unsafeWindow ?? window;
    
    console.log("Sabotage Window/Tab Switch Visibility is executing...");
    
    disableFocusBlurEvent(Document.prototype);
    disableFocusBlurEvent(windowProto);
    
    function disableFocusBlurEvent(objPrototype) {
        const eventBlocklist = ["focus", "blur"];

        for (const event of eventBlocklist) {
            defineGetterSetter(objPrototype, `on${event}`, {
                set: () => undefined,
            });
        }

        const oldEventListener = objPrototype.addEventListener;
    
        objPrototype.addEventListener = function (event, ...args) {
            if (eventBlocklist.includes(event)) return;
            oldEventListener.call(this, event, ...args);
        }
    }

    /* Disable Page Visibility API */

    defineGetterSetter(Document.prototype, "hidden", {
        get: () => false
    });
    
    defineGetterSetter(Document.prototype, "visibilityState", {
        get: () => "visible"
    });
    
    document.addEventListener("visibilitychange", function(e) {
        e.stopImmediatePropagation();
    }, true);

    /* Partially disable blur and focus event (and other events) of element */

    const safeBoxSize = 800;
    const elementOldEventListener = Element.prototype.addEventListener;

    const eventBlocklist = [
        "blur",
        "focus",
        "mouseleave",
        "hasFocus"
    ];

    // Element.on{event} properties, like Element.onfocus, Element.onblur etc.
    for (const event of eventBlocklist) {
        if (event == "hasFocus") continue;
        let registered = false;
        defineGetterSetter(Element.prototype, `on${event}`, {
            set(callback) {
                if (!registered) {
                    this.addEventListener(event, callback)
                    registered = true;
                }
            }
        });
    }
    
    // override Element.addEventListener
    Element.prototype.addEventListener = function (event, callback, ...args) {
        if (eventBlocklist.includes(event)) {
            const elem = this;
            elementOldEventListener.call(this, event, (...eventArgs) => {
                const clientRect = elem.getBoundingClientRect();
    
                if (clientRect.width >= safeBoxSize || clientRect.height >= safeBoxSize) {
                    return;
                }
                callback(...eventArgs);
            }, ...args);
        }
        else elementOldEventListener.call(this, event, callback, ...args);
    };
    
    /* Disable CSS prefers-reduced-motion for JavaScript */
    
    const windowOldMatchMedia = windowProto.matchMedia;
    
    windowProto.matchMedia = function (matchMedia, ...args) {
        if (matchMedia.includes("prefers-reduced-motion") && matchMedia.includes("reduce")) {
            return false;
        }
        return windowOldMatchMedia.call(this, matchMedia, ...args);
    }

    console.log("Sabotage Window/Tab Switch Visibility executed");
}();

function defineGetterSetter(proto, property, { get, set } = {}) {
    Object.defineProperty(proto, property, {
        get, set,
        enumerable: true, configurable: true
    })
}