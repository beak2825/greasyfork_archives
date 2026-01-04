// ==UserScript==
// @name        YouTube: Plain Video Player
// @namespace   UserScripts
// @match       https://www.youtube.com/watch?*
// @exclude     /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @grant       none
// @version     0.2.0
// @author      CY Fung
// @license     MIT
// @description To force  Low Resource
// @run-at      document-start
// @inject-into page
// @unwrap
// @license             MIT
// @compatible          chrome
// @compatible          firefox
// @compatible          opera
// @compatible          edge
// @compatible          safari
// @allFrames           true
// @downloadURL https://update.greasyfork.org/scripts/492974/YouTube%3A%20Plain%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/492974/YouTube%3A%20Plain%20Video%20Player.meta.js
// ==/UserScript==


(() => {


    let enable = true; // for debug

    const observablePromise = (proc, timeoutPromise) => {
        let promise = null;
        return {
            obtain() {
                if (!promise) {
                    promise = new Promise(resolve => {
                        let mo = null;
                        const f = () => {
                            let t = proc();
                            if (t) {
                                mo.disconnect();
                                mo.takeRecords();
                                mo = null;
                                resolve(t);
                            }
                        }
                        mo = new MutationObserver(f);
                        mo.observe(document, { subtree: true, childList: true })
                        f();
                        timeoutPromise && timeoutPromise.then(() => {
                            resolve(null)
                        });
                    });
                }
                return promise
            }
        }
    }

    const pp = {
        create() {

        },
        setProperties() {

        }
    }
    let mm = new Proxy({}, {
        get(target, prop) {
            // throw SyntaxError();
            // return pp;
            return true
        },
        set(target, prop, val) {
            return true;
        },
        configurable: true,
        enumerable: false
    });

    const cssText = () => `

        .container, #container, #masthead {
        visibility: collapse;
        display: none !important;
        }
        .container *, #container *, #masthead *{
        margin:0 !important;
        padding:0 !important;
        border:0 !important;
        }

        :fullscreen #movie_player{
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        }
        #player.skeleton.flexy #player-wrap[id] {
        width:initial;
        }


        .ytp-next-button, .ytp-miniplayer-button /* , .ytp-size-button */  {
        display: none !important;
        }
        .ytp-pip-button{

            display: inline-block !important;

        }
        
        
    
    `;

    addCSS = 0;
    enable && Object.defineProperty(Object.prototype, '__mixinSet', {
        get() {
            if (!addCSS) {
                addCSS = 1;
                // document.body.appendChild(document.createElement('ytd-watch-flexy'))
                document.head.appendChild(document.createElement('style')).textContent = cssText();
            }
            let rr = window.onerror;
            window.onerror = function () { return true; }
            Promise.resolve().then(() => {
                window.onerror = rr
            })
            throw new Error('');

            return mm;
        },
        set(nv) {
            return true;
        },
        configurable: true,
        enumerable: false
    })



    const addProtoToArr = (parent, key, arr) => {


        let isChildProto = false;
        for (const sr of arr) {
            if (parent[key].prototype instanceof parent[sr]) {
                isChildProto = true;
                break;
            }
        }

        if (isChildProto) return;

        arr = arr.filter(sr => {
            if (parent[sr].prototype instanceof parent[key]) {
                return false;
            }
            return true;
        });

        arr.push(key);

        return arr;


    }


    const getKeys = (_yt_player) => {

        const w = 'Keys';

        let arr = [];

        for (const [k, v] of Object.entries(_yt_player)) {


            const p = typeof v === 'function' ? v.prototype : 0;

            if (p
                && typeof p.isFullscreen === 'function' && p.isFullscreen.length === 0
                && typeof p.getVisibilityState === 'function'
                // && typeof p.getAppState === 'function'
            ) {

                arr = addProtoToArr(_yt_player, k, arr) || arr;

            }

        }





        if (arr.length === 0) {

            console.warn(`Key does not exist. [${w}]`);
        } else {

            return arr;
        }

    }


    const cleanContext = async (win) => {
        const waitFn = requestAnimationFrame; // shall have been binded to window
        try {
            let mx = 16; // MAX TRIAL
            const frameId = 'vanillajs-iframe-v1';
            /** @type {HTMLIFrameElement | null} */
            let frame = document.getElementById(frameId);
            let removeIframeFn = null;
            if (!frame) {
                frame = document.createElement('iframe');
                frame.id = frameId;
                const blobURL = typeof webkitCancelAnimationFrame === 'function' ? (frame.src = URL.createObjectURL(new Blob([], { type: 'text/html' }))) : null; // avoid Brave Crash
                frame.sandbox = 'allow-same-origin'; // script cannot be run inside iframe but API can be obtained from iframe
                let n = document.createElement('noscript'); // wrap into NOSCRPIT to avoid reflow (layouting)
                n.appendChild(frame);
                while (!document.documentElement && mx-- > 0) await new Promise(waitFn); // requestAnimationFrame here could get modified by YouTube engine
                const root = document.documentElement;
                root.appendChild(n); // throw error if root is null due to exceeding MAX TRIAL
                if (blobURL) Promise.resolve().then(() => URL.revokeObjectURL(blobURL));

                removeIframeFn = (setTimeout) => {
                    const removeIframeOnDocumentReady = (e) => {
                        e && win.removeEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
                        win = null;
                        const m = n;
                        n = null;
                        setTimeout(() => m.remove(), 200);
                    }
                    if (document.readyState !== 'loading') {
                        removeIframeOnDocumentReady();
                    } else {
                        win.addEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
                    }
                }
            }
            while (!frame.contentWindow && mx-- > 0) await new Promise(waitFn);
            const fc = frame.contentWindow;
            if (!fc) throw "window is not found."; // throw error if root is null due to exceeding MAX TRIAL
            const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, requestIdleCallback, getComputedStyle } = fc;
            const res = { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, requestIdleCallback, getComputedStyle };
            for (let k in res) res[k] = res[k].bind(win); // necessary
            if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
            res.animate = fc.HTMLElement.prototype.animate;
            return res;
        } catch (e) {
            console.warn(e);
            return null;
        }
    };

    cleanContext(window).then(__CONTEXT__ => {
        if (!__CONTEXT__) return null;

        const { setTimeout } = __CONTEXT__;



        const isUrlInEmbed = location.href.includes('.youtube.com/embed/');
        const isAbortSignalSupported = typeof AbortSignal !== "undefined";

        const promiseForTamerTimeout = new Promise(resolve => {
            !isUrlInEmbed && isAbortSignalSupported && document.addEventListener('yt-action', function () {
                setTimeout(resolve, 480);
            }, { capture: true, passive: true, once: true });
            !isUrlInEmbed && isAbortSignalSupported && typeof customElements === "object" && customElements.whenDefined('ytd-app').then(() => {
                setTimeout(resolve, 1200);
            });
            setTimeout(resolve, 3000);
        });

        (async () => {
            const _yt_player = await observablePromise(() => {
                return (((window || 0)._yt_player || 0) || 0);
            }, promiseForTamerTimeout).obtain();


            const keys = getKeys(_yt_player);

            const selectionForJ0 = keys.map(k => {
                const p = _yt_player[k].prototype;
                let v = 0;
                if (!p.getAppState) v -= 900;
                if (!p.getInternalApi) v -= 400;
                if (!p.getApiInterface) v += 100;
                if (!p.getPlayerResponse) v += 100;
                return [k, v];
            });
            const selectionForQT = keys.map(k => {
                const p = _yt_player[k].prototype;
                let v = 0;
                if (!p.getAppState) v -= 900;
                if (!p.getInternalApi) v -= 400;
                if (p.getApiInterface) v += 100;
                if (p.getPlayerResponse) v += 100;
                return [k, v];
            });


            const keyJ0 = selectionForJ0.sort((a, b) => b[1] - a[1])[0][0];
            const keyQT = selectionForQT.sort((a, b) => b[1] - a[1])[0][0];

            if (keyJ0 && keyQT && keyJ0 !== keyQT) {

                let _visibility = null;

                document.addEventListener('fullscreenchange', () => {
                    if (enable) {

                        if (_visibility) _visibility.fullscreen = !!document.fullscreenElement ? 2 : 0;
                    }
                });

                document.addEventListener('enterpictureinpicture', () => {
                    if (enable) {

                        if (_visibility) _visibility.pictureInPicture = true;
                    }

                });
                document.addEventListener('leavepictureinpicture', () => {

                    if (enable) {

                        if (_visibility) _visibility.pictureInPicture = false;
                    }
                });

                // let pp = 0;
                const gkp = _yt_player[keyJ0].prototype;

                gkp.isFullscreen68 = gkp.isFullscreen;
                gkp.isFullscreen = function () {
                    _visibility = this.visibility;
                    // if (this.visibility && !pp) {
                    //     pp = 1;
                    //     console.log(3992, this.visibility)
                    // }
                    return this.isFullscreen68();
                }




            }


            const ytpSizeBtn = await observablePromise(() => {
                return document.querySelector('.ytp-size-button');
            }, promiseForTamerTimeout).obtain();


            ytpSizeBtn.addEventListener('click', (evt) => {
                const player = document.querySelector('#player')
                player.classList.toggle('theater')
                player.classList.toggle('flexy')
                window.dispatchEvent(new Event('resize'));
                // document.body.dispatchEvent(new Event('resize'));
                evt.preventDefault();
                evt.stopImmediatePropagation();
                evt.stopPropagation();
            }, true)




        })();

    });

})();
