// ==UserScript==
// @name         pediy webclipper optimization
// @namespace    https://rabit.pw/
// @version      0.2
// @description  optimization on pediy.com for evernote web clipper
// @author       ttimasdf
// @license      Apache License 2.0
// @match        https://bbs.pediy.com/thread*
// @icon         https://icons.duckduckgo.com/ip2/pediy.com.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/444074/pediy%20webclipper%20optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/444074/pediy%20webclipper%20optimization.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

// https://github.com/jspenguin2017/Snippets/blob/master/onbeforescriptexecute.html
(() => {
    "use strict";

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
})();

(function() {
    "use strict";

    window.onbeforescriptexecute = (e) => {
        // You should check if textContent exists as this property is
        // buggy sometimes
        if (!e.script.textContent) {
            return;
        }
        // console.log(e);
        let payload = e.script.textContent;

        // Prevent execution of a script
        /* if (payload.includes("alert")) {
            e.preventDefault();
        }*/

        // Change the code that runs
        if (payload.includes("SyntaxHighlighter.all")) {
            console.log("Fixing SyntaxHighlighter configuration", e);
            // Original payload is e.script.textContent, you can
            // manipulate it however you want, just pass the final
            // payload to e.replacePayload when you are done
            e.replacePayload(payload.replace("SyntaxHighlighter.all",
                                             "SyntaxHighlighter.defaults.gutter = false; SyntaxHighlighter.all"));
            // Later event handlers can override your payload, you
            // can call e.stopPropagation to make sure the current
            // payload is applied
        }
    };

    window.onload = (e) => {
        var step = 0, jobId = 0;


        const observer = new MutationObserver((m) => {
            // Evernote
            if (m.some((e) => e.type == 'childList' &&
                       [...e.addedNodes].some((n) => n.id == 'EvernoteClipperPreloader'))) {
                console.log("Evernote started, clearing page background");

                // fix server-side rendered code block
                document.querySelectorAll("td.gutter").forEach((e) => e.remove());
                document.querySelectorAll("table.syntaxhighlighter").forEach((e) => { e.style.width = "90% !important"; });

                // document.querySelectorAll("td.gutter *").forEach((e) => e.remove());

                // fix background
                document.querySelector("main#body").style.background = 'rgb(255, 255, 255)';

                // fix blockquote background
                document.querySelectorAll("blockquote").forEach((e) => { e.style.background = "rgb(233, 236, 239)"; });
                document.querySelectorAll("blockquote *:not(a)").forEach((e) => {
                    e.style.background = "rgb(233, 236, 239)";
                    e.style.color = "rgb(115, 115, 115)";
                });

            } else if (m.some((e) => e.type == 'childList' &&
                       [...e.removedNodes].some((n) => n.id == 'evernoteClipperToolsMain'))) {
                console.log("Evernote exited, restoring page background");
                document.querySelector("main#body").removeAttribute('style');
            }
        });


        jobId = setInterval(() => {
            // 循环监视页面中的代码块。代码块在 DOM 加载完成后动态渲染，所以需要持续监控。

            var counter = 0;
            document.querySelectorAll("div.line").forEach((elem) => {
                const regex = /<\/code>((&nbsp;| ){1,100})<code/;
                if (elem.innerHTML.match(regex)) {
                    counter += 1;
                    // console.log("replacing", elem);
                    elem.innerHTML = elem.innerHTML.replace(regex, '</code><code class="plain">$1</code><code');
                }
            });
            if (step == 0 && counter > 0) {
                step = 1;
            } else if (step > 1) {
                console.log("Done fixing code blocks");
                clearInterval(jobId);
                document.querySelector('i.icon-thumbs-o-up').style.color = "green";

                // Initialize listener for Webclipper
                observer.observe(document.body, {childList: true});
            } else if (counter <= 0) {
                step += 1;
            } else {
                console.log(`Replaced ${counter} elements`);
            }
        }, 1000);
    };
})();
