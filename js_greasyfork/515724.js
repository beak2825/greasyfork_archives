// ==UserScript==
// @name         Devast.io - chat-logger
// @namespace    https://tampermonkey.net/
// @version      0.4
// @description  TL;DR
// @author       https://greasyfork.org/ja/users/705684
// @match        *://devast.io/
// @match        *://devast.io/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=devast.io
// @license      GPL-3.0-or-later
// @grant        none
// @require      https://update.greasyfork.org/scripts/515720/1477822/util.js
// @downloadURL https://update.greasyfork.org/scripts/515724/Devastio%20-%20chat-logger.user.js
// @updateURL https://update.greasyfork.org/scripts/515724/Devastio%20-%20chat-logger.meta.js
// ==/UserScript==

(() => {
    window.WebSocket = class extends window.WebSocket {
        constructor(...args) {
            super(...args);
            listenWebSocket(this);
            chat.make();
        }
        send(data) {
            super.send(data);
            if (typeof data === 'string') {
                // JSON
                const arr = JSON.parse(data);
                if (arr[0] === 1) {
                    chat.log('you', arr[1]);
                }
            } else {
                // binary
            }
        }
    };

    let prevTimeMap = new Map();
    const coolDownTime = 256;
    const chat = new (class {
        constructor() {
            this.elm = document.createElement('div');
            Object.assign(this.elm.style, {
                position: 'fixed',
                left: '30vw',
                width: '40vw',
                height: '15vh',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                overflow: 'auto',
                padding: '0.5em',
                userSelect: 'none',
            });
            this.count = 0;
        }
        make() {
            document.body.append(this.elm);
        }
        async log(author, text) {
            const currentTime = performance.now();
            const prevTime = prevTimeMap.get(author) ?? 0;
            if (currentTime - prevTime < coolDownTime) return;
            prevTimeMap.set(author, currentTime);
            const wrapper = document.createElement('div');
            const random = await window.pseudoRandomBy(author);
            Object.assign(wrapper.style, {
                backgroundColor:
                this.count++ % 2 ? 'rgba(0, 0, 0, 0.3)' : 'rgba(63, 63, 63, 0.3)',
                color: `hsl(${360 * random | 0} 100% 50%)`,
                padding: '0 0.5em',
            });
            const authorHolder = document.createElement('span');
            const textHolder = document.createElement('span');
            this.elm.append(wrapper);
            wrapper.append(authorHolder);
            wrapper.append(textHolder);
            authorHolder.innerText = `${author}: `;
            textHolder.innerText = `${text} (${window.formatTime()})`;
            this.elm.scrollTop = this.elm.scrollHeight;
        }
    })();

    const listenWebSocket = (ws) => {
        ws.addEventListener('message', (e) => {
            if (typeof e.data === 'string') {
                // JSON
                parseJSON(e.data);
            } else if (typeof e.data === 'object') {
                // ArrayBuffer
            }
        });
    };

    const parseJSON = (data) => {
        const arr = JSON.parse(data);
        switch (arr[0]) {
            case 0: {
                // chat
                const id = arr[1];
                const author = `${players.nicknames[id]}#${id}`;
                chat.log(author, arr[2]);
                break;
            }
            case 1: // new player
                players.join(arr[1], arr[3]);
                break;
            case 2: // nicknames token
                players.nicknames = arr;
                break;
            case 3: // alert
                break;
            case 4: // new team
                break;
            case 5: // team name
                break;
        }
    };

    const players = new (class {
        constructor() {
            this.nicknames = null;
        }
        join(id, nickname) {
            this.nicknames[id] = nickname;
        }
    })();
})();