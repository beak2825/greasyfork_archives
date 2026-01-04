// ==UserScript==
// @name         Discord GooseMod Untethered - CSP Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A script to bypass CSP and run GooseMod untethered
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545821/Discord%20GooseMod%20Untethered%20-%20CSP%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/545821/Discord%20GooseMod%20Untethered%20-%20CSP%20Bypass.meta.js
// ==/UserScript==

(async function() {
    const fn = async () => {
        window.gmUntethered = '4.0.0';
        let el = document.getElementsByClassName('fixClipping-3qAKRb')[0];
        if (el !== undefined) el.style.backgroundColor = '#050505';
        
        let el2 = document.getElementsByClassName('tip-2cgoli')[0];
        if (el2 !== undefined) el2.innerHTML += `<br><br>GooseMod Untethered v${window.gmUntethered}`;

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        this.cspBypasser = {
            frame: document.createElement('object'),
            init: async () => {
                this.cspBypasser.frame.data = location.origin;
                document.body.appendChild(this.cspBypasser.frame);

                let script = document.createElement('script');
                script.type = 'text/javascript';
                let code = `
                    window.addEventListener('message', async (e) => {
                        const {url, type, useCORSProxy} = e.data;
                        if (!url) return;
                        const proxyURL = useCORSProxy ? \`https://cors-anywhere.herokuapp.com/\${url}\` : url;
                        
                        if (type === 'img') {
                            let canvas = document.createElement('canvas');
                            let ctx = canvas.getContext('2d');
                            let img = new Image();
                            img.src = proxyURL;
                            img.crossOrigin = 'anonymous';
                            img.onload = () => {
                                canvas.width = img.width;
                                canvas.height = img.height;
                                ctx.drawImage(img, 0, 0);
                                e.source.postMessage({ verify: url, data: canvas.toDataURL("image/png") });
                            };
                            return;
                        }
                        
                        const req = await fetch(proxyURL, { cache: 'no-store' });
                        e.source.postMessage({ verify: url, data: await req[type]() });
                    });
                `;
                script.appendChild(document.createTextNode(code));
                this.cspBypasser.frame.contentDocument.head.appendChild(script);
            },
            runCode: (code) => {
                let script = document.createElement('script');
                script.type = 'text/javascript';
                script.appendChild(document.createTextNode(code));
                this.cspBypasser.frame.contentDocument.head.appendChild(script);
            },
            json: (url, useCORSProxy = true) => {
                return new Promise((res) => {
                    this.cspBypasser.frame.contentWindow.postMessage({url, type: 'json', useCORSProxy});
                    window.addEventListener('message', async (e) => {
                        if (e.data.verify !== url) return;
                        res(e.data.data);
                    });
                });
            },
            text: (url, useCORSProxy = true) => {
                return new Promise((res) => {
                    this.cspBypasser.frame.contentWindow.postMessage({url, type: 'text', useCORSProxy});
                    window.addEventListener('message', async (e) => {
                        if (e.data.verify !== url) return;
                        res(e.data.data);
                    });
                });
            },
            blob: (url, useCORSProxy = true) => {
                return new Promise((res) => {
                    this.cspBypasser.frame.contentWindow.postMessage({url, type: 'blob', useCORSProxy});
                    window.addEventListener('message', async (e) => {
                        if (e.data.verify !== url) return;
                        res(e.data.data);
                    });
                });
            },
            image: (url, useCORSProxy = true) => {
                return new Promise((res) => {
                    this.cspBypasser.frame.contentWindow.postMessage({url, type: 'img', useCORSProxy});
                    window.addEventListener('message', async (e) => {
                        if (e.data.verify !== url) return;
                        res(e.data.data);
                    });
                });
            },
        };

        await this.cspBypasser.init();
        const code = await this.cspBypasser.text('https://goosemod-api.netlify.app/inject.js', false);
        
        if (el2 !== undefined) el2.innerHTML += `<br>Ready`;

        while (true) {
            if (document.querySelector('button[aria-label="User Settings"]') !== null && window.webpackJsonp !== undefined) break;
            await sleep(50);
        }

        (async function(code) {
            eval(code);
        })(code);
    };

    let parent = undefined;
    if (typeof require !== 'undefined') {
        parent = require('electron').webFrame.top.context;
    } else {
        parent = window;
    }
    parent.eval(`(${fn.toString()})()`);
})();
