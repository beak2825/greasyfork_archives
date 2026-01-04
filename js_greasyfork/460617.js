// ==UserScript==
// @name     Instant CAI Messages
// @match    https://beta.character.ai/*
// @version  1
// @grant    none
// @run-at document-start
// @description Instant message chunks for CharacterAI
// @namespace https://greasyfork.org/users/1031972
// @downloadURL https://update.greasyfork.org/scripts/460617/Instant%20CAI%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/460617/Instant%20CAI%20Messages.meta.js
// ==/UserScript==


(function (window) {
    const isChrome = document.onbeforescriptexecute === undefined;

    if (isChrome) {
        (() => {
            "use strict";

            const Event = class {
                constructor(script, target) {
                    this.script = script;
                    this.target = target;

                    this._cancel = false;
                    this._replace = null
                    this._replaceSrc = null;
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
                replaceSrc(src) {
                    this._replaceSrc = src;
                }
            };

            let callbacks = [];
            document.addBeforeScriptExecuteListener = (f) => {
                if (typeof f !== "function") {
                    throw new Error("Event handler must be a function.");
                }
                callbacks.push(f);
            };
            document.removeBeforeScriptExecuteListener = (f) => {
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

                if (typeof document.onbeforescriptexecute === "function") {
                    try {
                        document.onbeforescriptexecute(e);
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
                    script.removeAttribute('src');
                    script.textContent = "";
                    script.remove();
                } else if (typeof e._replace === "string") {
                    script.removeAttribute('src');
                    script.textContent = e._replace;
                } else if (typeof e._replaceSrc === "string") {
                    script.src = e._replaceSrc;
                    script.textContent = "";
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
    }

    function checkScript(e) {
        var scriptSrc = e.script.attributes['src'];
        if (scriptSrc === undefined)
            return;
        scriptSrc = scriptSrc.value;

        if (scriptSrc.includes("/static/js/main")) {
            console.log("main.js intercepted");
            const xhr = new XMLHttpRequest();
            xhr.open('GET', scriptSrc, false); // `false` makes the request synchronous
            xhr.send(null);
            var scriptText = xhr.responseText;
            scriptText = scriptText.replace(/\((\w)\+=\w\)>(\w)\.length&&\(\w=\w\.length\),(\w)=\w\.substring\(0,\w\)/, "($1=$2.length),($3=$2)");
            //scriptText = scriptText.replace("(_+=f)>z.length&&(_=z.length),U=z.substring(0,_)", "(_=z.length),(U=z)");
            //scriptText = scriptText.replace("new Promise((function(e){return setTimeout(e,p)}))", "e");
            //scriptText = scriptText.replace("e.next=59", "e.next=73");

            var blobUrl = URL.createObjectURL(new Blob([scriptText], { type: 'application/javascript' }));
            e.replaceSrc(blobUrl);
        }
    }

    function checkScriptFF(e) {
        var scriptSrc = e.target.attributes['src'];
        if (scriptSrc === undefined)
            return;
        scriptSrc = scriptSrc.value;

        if (scriptSrc.includes("/static/js/main")) {
            console.log("main.js intercepted");
            const xhr = new XMLHttpRequest();
            xhr.open('GET', scriptSrc, false); // `false` makes the request synchronous
            xhr.send(null);
            var scriptText = xhr.responseText;
            scriptText = scriptText.replace(/\((\w)\+=\w\)>(\w)\.length&&\(\w=\w\.length\),(\w)=\w\.substring\(0,\w\)/, "($1=$2.length),($3=$2)");
            //scriptText = scriptText.replace("(_+=f)>z.length&&(_=z.length),U=z.substring(0,_)", "(_=z.length),(U=z)");
            //scriptText = scriptText.replace("new Promise((function(e){return setTimeout(e,p)}))", "e");
            //scriptText = scriptText.replace("e.next=59", "e.next=73");

            var blobUrl = URL.createObjectURL(new Blob([scriptText], { type: 'application/javascript' }));

            // Stop original script
            e.preventDefault();
            e.stopPropagation();
            // Run new script
            var script = document.createElement('script');
            script.src = blobUrl;
            (document.head || document.documentElement).appendChild(script);
        }
    }

    document.onbeforescriptexecute = isChrome ? checkScript : checkScriptFF;
})(window);