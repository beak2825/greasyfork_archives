// ==UserScript==
// @name         ddrk广告屏蔽
// @namespace    com.pers.scripts
// @version      1.0.13
// @description  临时屏蔽
// @author       Johnbi
// @run-at document-start
// @match        https://ddrk.me/*
// @icon         https://ddrk.me/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433854/ddrk%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/433854/ddrk%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(() => {
    // Library code, licensed under MIT
    // https://github.com/jspenguin2017/Snippets/blob/master/onbeforescriptexecute.html

    "use strict";

    const Event = class {
        constructor(script, target) {
            this.script = script;
            this.target = target;
            // copy
            this.target.src = this.script.src;

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
    Window.prototype.addBeforeScriptExecuteListener = (f) => {
        if (typeof f !== "function") {
            throw new Error("Event handler must be a function.");
        }
        callbacks.push(f);
    };
    Window.prototype.removeBeforeScriptExecuteListener = (f) => {
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
})();

/*global ToolKitCollection*/
function hideElement(id) {
    try {
        document.getElementById(id).remove()
    } catch (e) { }
}

function append() {
    let s = document.createElement("script");
    s.src = "https://worker.tomcat.run/wp-playlist.js";
    s.dataset.exclue = "true";
    document.head.appendChild(s);
}

function appendCss() {
    let s = document.createElement("style");
    s.innerText = `video {outline: none;}`;
    document.documentElement.appendChild(s);
}

(function () {
    'use strict';
    window.addBeforeScriptExecuteListener((event) => {
        const src = event?.target?.src;
        if (src && src.search(/https:\/\/ddrk\.me\/.+wp-playlist.min\.js/) != -1) {
            event.preventDefault();
            event.stopPropagation();
            append();
        };
    });

    window.addEventListener('DOMContentLoaded', (event) => {
        appendCss();
        hideElement("afc_sidebar_2842");
        hideElement("sajdhfbjwhe");
        hideElement("kasjbgih");
        hideElement("iaujwnefhw");
        hideElement("fkasjgf");
        hideElement("fh972w3h4g3y9g");
    });

})();
