// ==UserScript==
// @name         Telegraph.co.uk paywall bypass
// @namespace    http://telegraph.co.uk
// @version      1.0
// @description  Telegraph.co.uk paywall bypass script
// @author       excitable-tech
// @match        https://www.telegraph.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegraph.co.uk
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541193/Telegraphcouk%20paywall%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/541193/Telegraphcouk%20paywall%20bypass.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const defineHook = (obj, name, get, set) => {
        let context = { value: undefined };
        if (Object.getOwnPropertyDescriptor(obj, name)?.configurable === false) {
            return;
        }
        Object.defineProperty(obj, name, {
            enumerable: true,
            configurable: false,
            get: () => get(context),
            set: (value) => set(context, value),
        });
    };

    defineHook(unsafeWindow, "martech", (context) => context.value, (context, value) => {
        context.value = value;
        defineHook(context.value, "classes", (context) => {
            Object.keys(context.value)
                .filter((name) => name.toLowerCase().indexOf("paywall") !== -1)
                .forEach((name) => delete context.value[name]);
            return context.value;;
        }, (context, value) => (context.value = value));
    });
})();

