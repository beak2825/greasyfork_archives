// ==UserScript==
// @name         Ping Counter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Optimized Ping Counter for Bloxd.io
// @author       Ankit
// @match        https://bloxd.io
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515406/Ping%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/515406/Ping%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class PingCounter {
        constructor(url) {
            this.url = url;
            this.lastPing = null;

            this.display = document.createElement('div');
            this.display.id = 'pingDisplay';
            this.display.textContent = 'Ping: ...';

            Object.assign(this.display.style, {
                position: 'fixed',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '8px 12px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '16px',
                fontFamily: 'monospace',
                zIndex: 1000
            });

            document.body.appendChild(this.display);
        }

        ping() {
            const start = performance.now();
            fetch(this.url, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' })
                .then(() => {
                    const ping = Math.round(performance.now() - start);
                    if (ping !== this.lastPing) {
                        this.display.textContent = `Ping: ${ping} ms`;
                        this.lastPing = ping;
                    }
                })
                .catch(() => {
                    this.display.textContent = 'Ping: Failed';
                });
        }

        start(interval = 1500) {
            this.ping();
            this.timer = setInterval(() => this.ping(), interval);
        }
    }

    // Initialize and start pinging every 1.5 seconds
    const counter = new PingCounter('https://bloxd.io');
    counter.start(1500);
})();
