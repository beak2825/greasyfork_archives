// ==UserScript==
// @name         取消分P数量限制
// @namespace    https://aih.im
// @description  取消了b站部分用户上传和编辑视频时的分P数量限制
// @version      0.1
// @author       AiHimmel
// @match        *://member.bilibili.com/video/upload.html*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/407892/%E5%8F%96%E6%B6%88%E5%88%86P%E6%95%B0%E9%87%8F%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/407892/%E5%8F%96%E6%B6%88%E5%88%86P%E6%95%B0%E9%87%8F%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
(function () {
    'use strict';
    if (typeof (document.onbeforescriptexecute) == 'undefined') {
        (() => {
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

            const callbacks = [];
            window.addBeforeScriptExecuteListener = (f) => {
                if (typeof f !== 'function') {
                    throw new Error('Event handler must be a function.');
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
                if (script.tagName !== 'SCRIPT') {
                    return;
                }

                const e = new Event(script, target);

                if (typeof window.onbeforescriptexecute === 'function') {
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
                    script.textContent = '';
                    script.remove();
                } else if (typeof e._replace === 'string') {
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
        })();//polyfill from https://github.com/jspenguin2017/Snippets/blob/master/onbeforescriptexecute.html
        window.onbeforescriptexecute = hijack;
    } else {
        document.onbeforescriptexecute = hijack;
    }


    function hijack(e) {
        let src;
        try {
            src = e.script.src;
        } catch (_e) {
            src = e.target.src;
        }
        if (src.match(/.*app.*.js/)) {
            e.preventDefault();
            fetch(src).then((rsp) => {
                return rsp.text();
            }).then((t) => {
                t = t.replace('&&t.pLimitWhite', '&&false');
                const e = document.createElement('script');
                e.textContent = t;
                e.onerror = () => {
                    alert('检测到错误，请反馈');
                };
                document.documentElement.appendChild(e);
            });
        }
    };

})();