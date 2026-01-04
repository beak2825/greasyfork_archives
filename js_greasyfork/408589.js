// ==UserScript==
// @name         crunchyroll_no_free
// @version      0.1
// @description  enable subs on crunchyroll by default
// @author       crts
// @match        https://www.crunchyroll.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/675256
// @downloadURL https://update.greasyfork.org/scripts/408589/crunchyroll_no_free.user.js
// @updateURL https://update.greasyfork.org/scripts/408589/crunchyroll_no_free.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const Event = class {
        constructor(script, target) {
            this.script = script;
            this.target = target;

            this._cancel = false;
            this._replace = null;
            this._stop = false;
        }

        preventDefault() {
            this._cancel = true;
        }
        stopPropagation() {
            this._stop = true;
        }
        replacePayload(payload) {
            this._replace = payload;
        }
    };

    let callbacks = [];
    window.addBeforeScriptExecuteListener = (f) => {
        if (typeof f !== "function") {
            throw new Error("Event handler must be a function.");
        }
        callbacks.push(f);
    };
    window.removeBeforeScriptExecuteListener = (f) => {
        let i = callbacks.length;
        while (i--) {
            if (callbacks[i] === f) {
                callbacks.splice(i, 1);
            }
        }
    };

    const dispatch = (script, target) => {
        if (script.tagName !== "SCRIPT") {
            return;
        }

        const e = new Event(script, target);

        if (typeof window.onbeforescriptexecute === "function") {
            try {
                window.onbeforescriptexecute(e);
            } catch (err) {
                console.error(err);
            }
        }

        for (const func of callbacks) {
            if (e._stop) {
                break;
            }
            try {
                func(e);
            } catch (err) {
                console.error(err);
            }
        }

        if (e._cancel) {
            script.textContent = "";
            script.remove();
        } else if (typeof e._replace === "string") {
            script.textContent = e._replace;
        }
    };
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const n of m.addedNodes) {
                dispatch(n, m.target);
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true,
    });
    window.onbeforescriptexecute = (e) => {
        if (!e.script.textContent) {
            return;
        }
        if (e.script.textContent.includes("vilos.config.player.language =")) {
            var profilelang = e.script.textContent.match(/vilos\.config\.player\.language = \"(.*)\"/m)[1];
            var newscript = e.script.textContent;
            newscript = newscript.replace(/\\\/clipFrom\\\/[0-9]+\\\/clipTo\\\/[0-9]+/g, '');
            e.replacePayload(newscript);
        }
    }
})();