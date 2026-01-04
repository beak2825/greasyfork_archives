// ==UserScript==
// @name         Man :standing_man:
// @namespace    taintedhelp
// @version      1.0
// @description  idk man
// @author       Tainted
// @match        https://mafia.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mafia.gg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472018/Man%20%3Astanding_man%3A.user.js
// @updateURL https://update.greasyfork.org/scripts/472018/Man%20%3Astanding_man%3A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.head.innerHTML += `<style>
        .tainted-cool:before {
            background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='%23a4e0eb'%3E%3Cpath d='M12.2 207.8v96.4c0 26.5 21.7 48.2 48.2 48.2h48.2V473h48.2V159.6H60.4c-26.5 0-48.2 21.7-48.2 48.2zM499.8 255c0-33.6-22.7-61.8-53.6-70.4V39H398l-24.1 48.2-168.8 72.3v192.9l168.8 72.3L398 473h48.2V325.4c30.9-8.6 53.6-36.8 53.6-70.4z'/%3E%3C/svg%3E")
        }

        .tainted-cool:after {
            background-color: rgba(164, 224, 235, 0.25);
        }

        .tainted-extra {
            display: none;
            color: #807e84;
            font-size: 12px;
            white-space: normal;
        }

        :hover > * > .tainted-extra {
            display: block;
        }

        :hover > * > .tainted-extra > li {
            display: inline;
        }
    </style>`;
    let names = {};
    let users = {};
    let join = () => {};
    let joined = new Set();
    XMLHttpRequest = new Proxy(XMLHttpRequest, { // i fucking hate mafia.gg for making my life harder
        construct: (target, args) => {
            let object = new target(...args);
            let opencpy = XMLHttpRequest.prototype.open;
            object.open = (...args) => {
                object.url = args[1]; // hidden attr go brrr
                return opencpy.apply(object, args);
            }
            object.addEventListener("readystatechange", e => {
                if (object.url.startsWith("/api/users") && object.readyState === 4 && object.status === 200) {
                    for (const user of object.response) {
                        users[user.id] = Object.assign({}, users[user.id], {name: user.username});
                        names[user.username] = [new Date(user.createdAt).toLocaleDateString("en-us", {day: "numeric", month: "short", year: "numeric"}), user.id]; // this isnt even the fucking start of the pain of webdev
                        if (joined.has(user.id)) {
                            join(user.username);
                            joined.delete(user.id);
                        }
                    }
                }
            });
            return object;
        }
    });
    WebSocket = new Proxy(WebSocket, {
        construct: (target, args) => {
            let object = new target(...args);
            object.inc = 0;
            object.lsid = 0;
            object.addEventListener("message", msg => {
                let data = JSON.parse(msg.data);
                if (data.type === "userJoin") {
                    if (users[data.userId]) {
                        object.dispatchEvent(new MessageEvent("message", {data: JSON.stringify({type: "system", message: `${users[data.userId].name} joined the room!  `, timestamp: Date.now() / 1000, sid: data.sid})}));
                        object.inc += 1;
                    } else joined.add(data.userId);
                    users[data.userId] = Object.assign({}, users[data.userId], {isPlayer: data.isPlayer, isHost: data.isHost});
                } else if (data.type === "userUpdate") {
                    if (users[data.userId].isPlayer !== data.isPlayer) {
                        object.dispatchEvent(new MessageEvent("message", {data: JSON.stringify({type: "system", message: `${users[data.userId].name} is now ${data.isPlayer ? "playing" : "spectating"}!  `, timestamp: Date.now() / 1000, sid: data.sid})}));
                        object.inc += 1;
                    }
                } else if (data.type === "userQuit") {
                    object.dispatchEvent(new MessageEvent("message", {data: JSON.stringify({type: "system", message: `${users[data.userId].name} left the room!  `, timestamp: Date.now() / 1000, sid: data.sid})}));
                    object.inc += 1;
                }
                data.sid += object.inc;
                object.lsid = data.sid;
                Object.defineProperty(msg, "data", {
                    value: JSON.stringify(data),
                    writable: false
                });
            });
            join = name => {
                object.dispatchEvent(new MessageEvent("message", {data: JSON.stringify({type: "system", message: `${name} joined the room!  `, timestamp: Date.now() / 1000, sid: object.lsid + 1})}));
                object.inc += 1;
            }
            return object;
        }
    });
    setInterval(() => {
        for (const user of document.querySelectorAll(".game-player-list-user-username:not(.tainted-fuckyou)")) {
            if (names[user.innerText]) {
                user.classList.add("tainted-fuckyou");
                user.innerHTML += `<ul class="tainted-extra"><li>Joined ${names[user.innerText][0]}</li> • <li>ID ${names[user.innerText][1]}</li></ul>`;
            }
        }
        for (const sys of document.querySelectorAll(".game-chronicle-sys-message-text:not(.tainted-fuckyou)")) {
            if (sys.getAttribute("data-text") && sys.getAttribute("data-text").endsWith("  ")) {
                sys.previousSibling.classList.add("tainted-cool");
                sys.style.color = "#A4E0EB";
            }
            sys.classList.add("tainted-fuckyou");
        }
    }, 50);
})();