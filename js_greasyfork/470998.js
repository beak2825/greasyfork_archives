// ==UserScript==
// @name         Mafia.gg Join Date + Replay System
// @namespace    taintedconv
// @version      1.1f+
// @description  A script that both shows you the join date of users and records and replays games that you join. (dont use this with my other scripts plskthx)
// @author       Tainted
// @license      You can do whatever with this script but credit me if you upload an edited version <3
// @match        https://mafia.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mafia.gg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470998/Mafiagg%20Join%20Date%20%2B%20Replay%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/470998/Mafiagg%20Join%20Date%20%2B%20Replay%20System.meta.js
// ==/UserScript==

(function() {
    "use strict";
    let item = localStorage.getItem("tainted-replays");
    let replayIds = item !== null ? JSON.parse(item) : [];
    let replays = {};
    for (const id of replayIds) {
        item = localStorage.getItem(`tainted-${id}`);
        replays[id] = item !== null ? JSON.parse(item) : undefined;
    }
    const download = document.createElement("div"); download.classList.add("game-top-flexible"); download.classList.add("tainted-last");
    const dlink = document.createElement("a"); dlink.setAttribute("download", "mgg-logs.txt"); dlink.innerText = "Download Logs"; download.append(dlink);
    let users = {};
    let players = {};
    let messages = {};
    async function replayLogs(events, index) {
        let userIds = [];
        for (const event of events.slice(index)) {
            if (event.userId && !users[event.userId] && !userIds.includes(event.userId)) userIds.push(event.userId);
            if (event.from && event.from.userId && !users[event.from.userId] && !userIds.includes(event.userId)) userIds.push(event.userId);
        }
        for (let i = 0; i < userIds.length; i += 50) {
            for (const player of await (await fetch(`https://mafia.gg/api/users/${userIds.slice(i, i + 50).toString()}`)).json()) {
                users[player.id] = player.username;
            }
        }
        let result = "";
        for (const event of events.slice(index)) {
            if (event.t === "chat") {
                if (event.from.model === "user") {
                    result += `[${new Date(1000 * event.m).toLocaleTimeString("en-us", {hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true})}] ${users[event.from.userId]} said: ${event.s}\n`;
                } else if (event.from.model === "player") {
                    messages[event.qid] = `> [${new Date(1000 * event.m).toLocaleTimeString("en-us", {hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true})}] ${players[event.from.playerId]} said: ${event.s}\n`;
                    result += `[${new Date(1000 * event.m).toLocaleTimeString("en-us", {hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true})}] ${players[event.from.playerId]} said: ${event.s}\n`;
                }
            } else if (event.t === "startGame") {
                for (const player of event.players) players[player.playerId] = player.name;
                result += `[${new Date(1000 * event.m).toLocaleTimeString("en-us", {hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true})}] The game started on ${event.time.phase} 1.\n`
            } else if (event.t === "quote") {
                if (event.from.model === "user") {
                    result += `[${new Date(1000 * event.m).toLocaleTimeString("en-us", {hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true})}] ${users[event.from.userId]} quoted:\n${messages[event.qid]}`;
                } else if (event.from.model === "player") {
                    result += `[${new Date(1000 * event.m).toLocaleTimeString("en-us", {hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true})}] ${players[event.from.playerId]} quoted:\n${messages[event.qid]}`;
                }
            } else if (event.t === "system") result += `[${new Date(1000 * event.m).toLocaleTimeString("en-us", {hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true})}] [SYSTEM] ${event.s}\n`
            else if (event.t === "decision" && event.details.text != "has not voted") {
                result += `[${new Date(1000 * event.m).toLocaleTimeString("en-us", {hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true})}] ${players[event.details.playerId]} ${event.details.text}${event.details.targetPlayerId ? " " + players[event.details.targetPlayerId] : ""}\n`;
                messages[event.qid] = `> [${new Date(1000 * event.m).toLocaleTimeString("en-us", {hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true})}] ${players[event.details.playerId]} ${event.details.text}${event.details.targetPlayerId ? " " + players[event.details.targetPlayerId] : ""}\n`;
            }
            else if (event.t === "time") result += `[${new Date(1000 * event.m).toLocaleTimeString("en-us", {hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true})}] It is now ${event.phase} ${event.ordinal}.\n`
        }
        dlink.setAttribute("href", `${dlink.getAttribute("href")}${encodeURIComponent(result)}`);
    }
    let names = {};
    let replay = false;
    let keysToOverride = new Set();
    let timeouts = {};
    const head = document.createElement("div"); const setter = document.createElement("div"); const speed = document.createElement("button");
    speed.type = "button"; setter.classList.add("game-top-flexible"); setter.append(speed);
    head.classList.add("game-top-flexible"); head.innerText = "Replay Mode";
    const icon = document.createElement("a"); icon.href = ""; icon.classList.add("common-header-nav-item"); icon.classList.add("hide-medium"); icon.classList.add("tainted-stats");
    const int1 = document.createElement("div"); int1.classList.add("common-header-nav-icon"); int1.classList.add("icon-account"); icon.append(int1);
    const int2 = document.createElement("div"); int2.classList.add("common-header-nav-label"); int2.innerText = "Games"; icon.append(int2);
    const popup = document.createElement("div"); popup.classList.add("overlay-element");
    // IM LAZY
    popup.innerHTML = `<div class="dialog" style="opacity: 1;"><div class="dialog-overlay"><div class="dialog-content" style="width: 800px;"><div class="dialog-header"><h1>All Games</h1><nav><button type="button" class="dialog-close"></button></nav></div><div class="dialog-body"><table class="game-table game-table-allow-wrap game-table-bordered"><thead><tr><th><div class="game-table-cell">Room Name & Link</div></th><th><div class="game-table-cell">Start Time</div></th><th><div class="game-table-cell">Last Game State</div></th></tr></thead><tbody></tbody></table></div></div></div></div>`;
    speed.addEventListener("click", e => {
        let prev = parseFloat(e.target.innerText);
        if (e.target.innerText === "1X SPEED") e.target.innerText = "1.5X SPEED";
        else if (e.target.innerText === "1.5X SPEED") e.target.innerText = "2X SPEED";
        else if (e.target.innerText === "2X SPEED") e.target.innerText = "3X SPEED";
        else if (e.target.innerText === "3X SPEED") e.target.innerText = "5X SPEED";
        else if (e.target.innerText === "5X SPEED") e.target.innerText = "10X SPEED";
        else if (e.target.innerText === "10X SPEED") e.target.innerText = "0.25X SPEED";
        else if (e.target.innerText === "0.25X SPEED") e.target.innerText = "0.5X SPEED";
        else if (e.target.innerText === "0.5X SPEED") e.target.innerText = "0.75X SPEED";
        else if (e.target.innerText === "0.75X SPEED") e.target.innerText = "1X SPEED";
        let now = Date.now() / 1000;
        for (const [to, [call, time, start, then]] of Object.entries(Object.assign({}, timeouts))) {
            clearTimeout(to); delete timeouts[to];
            let nto = setTimeout(call, 1000 * (time - (prev * (now - then)) - start) * (1 / parseFloat(e.target.innerText)));
            timeouts[nto] = [call, time - (prev * (now - then)), start, now];
            setTimeout(() => delete timeouts[nto], 1000 * (time - (prev * (now - then)) - start) * (1 / parseFloat(e.target.innerText)));
        }
    });
    icon.addEventListener("click", e => {
        e.preventDefault();
        let item = localStorage.getItem("tainted-replays");
        let replayIds = item !== null ? JSON.parse(item) : [];
        for (const id of replayIds) {
            if (!replays[id] && !keysToOverride.has(id)) {
                item = localStorage.getItem(`tainted-${id}`);
                replays[id] = item !== null ? JSON.parse(item) : undefined;
            }
        }
        let data = Object.entries(replays).sort((fir, sec) => {
            if (fir[1][0].events[1].m > sec[1][0].events[1].m) return -1;
            else return 1;
        }).map(entry => {
            return [entry[0], {
                join: entry[1][0].events[1].m,
                title: entry[1][0].events.findLast(event => event.t === "options").roomName,
                state: (entry[1][0].events.concat(entry[1].slice(1)).some(event => event.t === "startGame") ? (entry[1][0].events.concat(entry[1].slice(1)).some(event => event.t === "endGame") ? "Ended" : "Ongoing") : "Yet To Start")
            }];
        });
        for (const [id, info] of data) popup.querySelector("tbody").innerHTML += `
            <tr><td><div class="game-table-cell">
            <a href="https://mafia.gg/game/${id}" target="_blank" style="color: pink;">${info.title}</a>
            </div></td><td><div class="game-table-cell">${new Date(1000 * info.join).toLocaleDateString("en-us", {day: "numeric", month: "short", year: "numeric"})} ${new Date(1000 * info.join).toLocaleTimeString("en-us", {hour: "numeric", minute: "2-digit", hour12: true})}
            </div></td><td><div class="game-table-cell">${info.state}</div></td></tr>`;
        document.querySelector(".overlay").prepend(popup);
    });
    popup.querySelector(".dialog-close").addEventListener("click", e => {
        popup.querySelector("tbody").innerHTML = "";
        popup.remove();
    });
    popup.querySelector(".dialog-overlay").addEventListener("click", e => {
        if (e.target.className == "dialog-overlay") {
            popup.querySelector("tbody").innerHTML = "";
            popup.remove();
        }
    });
    document.head.innerHTML += `<style>
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
                        users[user.id] = user.username;
                        names[user.username] = [new Date(user.createdAt).toLocaleDateString("en-us", {day: "numeric", month: "short", year: "numeric"}), user.id]; // this isnt even the fucking start of the pain of webdev
                    }
                }
                if (object.url.startsWith("/api/rooms") && /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(object.url) && object.readyState === 4) {
                    if (object.status === 404 && object.url.slice(11) !== "" && replays[object.url.slice(11)]) {
                        Object.defineProperty(e.target, "status", {
                            value: 200
                        });
                        replay = true;
                    } else replay = false;
                }
                if (object.orsc) object.orsc(e);
            });
            Object.defineProperty(object, "onreadystatechange", {
                set: value => object.orsc = value
            });
            return object;
        }
    });
    WebSocket = new Proxy(WebSocket, {
        construct: (target, args) => {
            dlink.setAttribute("href", `data:text/plain;charset=utf-8,`);
            if (replay) {
                let object = {sid: -1, done: false};
                object.close = () => {
                    object.done = true;
                    object.cls(new CloseEvent("close", {code: 1000}));
                }
                object.send = msg => {
                    let data = JSON.parse(msg);
                    object.sid += 1;
                    if (data.type === "ping") object.msg(new MessageEvent("message", {data: JSON.stringify({type: "pong", timestamp: 0, sid: object.sid})}));
                    else if (data.type === "clientHandshake") {
                        replayLogs(replays[data.roomId][0].events.concat(replays[data.roomId].slice(1)), 0);
                        let first = Object.assign({}, replays[data.roomId][0]);
                        if (!first.possibleUserIds.includes(data.userId)) first.possibleUserIds.push(data.userId); //replays[data.roomId][0].users.push({userId: data.userId, isHost: false, isPlayer: false})
                        first.events = first.events.map(event => { // DECOMPRESSION
                            let comp = Object.assign({}, event, {type: event.t, timestamp: event.m, message: event.s, userId: event.u, isPlayer: event.p});
                            delete comp.t; delete comp.m; delete comp.s; delete comp.u; delete comp.p;
                            return comp;
                        });
                        let start = first.m;
                        for (const packet of [first].concat(replays[data.roomId].slice(1))) {
                            let call = () => {
                                if (!object.done) object.msg(new MessageEvent("message", {data: JSON.stringify(Object.assign({}, packet, {type: packet.t, timestamp: packet.m, message: packet.s, userId: packet.u, isPlayer: packet.p, sid: (object.sid += 1)}))}));
                                if (Object.entries(timeouts).length === 1) object.msg(new MessageEvent("message", {data: JSON.stringify({type: "system", timestamp: Date.now() / 1000, message: "The replay has ended.", sid: (object.sid += 1)})}));
                            }
                            let to = setTimeout(call, 1000 * (packet.m - start));
                            setTimeout(() => delete timeouts[to], 1000 * (packet.m - start));
                            timeouts[to] = [call, packet.m, start, Date.now() / 1000];
                        }
                    }
                };
                return new Proxy(object, {
                    set: (obj, prop, value) => {
                        if (prop === "onopen") {
                            value();
                            return Reflect.set(obj, "opn", value);
                        }
                        else if (prop === "onmessage") return Reflect.set(obj, "msg", value);
                        else if (prop === "onerror") return Reflect.set(obj, "err", value);
                        else if (prop === "onclose") return Reflect.set(obj, "cls", value);
                        return Reflect.set(...arguments);
                    }
                });
            } else {
                let object = new target(...args);
                object.addEventListener("message", msg => {
                    let data = JSON.parse(msg.data);
                    if (data.type === "pong") return;
                    data.t = data.type; data.m = Date.now() / 1000; data.s = data.message; data.u = data.userId; data.p = data.isPlayer; // COMPRESSION
                    delete data.sid; delete data.type; delete data.timestamp; delete data.message; delete data.userId; delete data.isPlayer;
                    let id = window.location.href.split("/").slice(-1)[0];
                    if (id === "") return;
                    keysToOverride.add(id);
                    if (data.t === "clientHandshake") {
                        data.events = data.events.map(event => {
                            let comp = Object.assign({}, event, {t: event.type, m: event.timestamp, s: event.message, u: event.userId, p: data.isPlayer}); // MORE COMPRESSION
                            delete comp.sid; delete comp.type; delete comp.timestamp; delete comp.message; delete comp.userId; delete comp.isPlayer;
                            return comp;
                        });
                        replays[id] = [data];
                    }
                    else replays[id].push(data);
                    if (data.t === "startGame" || data.t === "endGame") {
                        let item = localStorage.getItem("tainted-replays");
                        let modified = item !== null ? JSON.parse(item) : [];
                        for (const key of keysToOverride) {
                            localStorage.setItem(`tainted-${key}`, JSON.stringify(replays[key]));
                            modified.push(key);
                        }
                        localStorage.setItem("tainted-replays", JSON.stringify(modified));
                        keysToOverride.clear();
                    }
                    let slice = replays[id][0].events.concat(replays[id].slice(1));
                    if (object.lind) replayLogs(slice, object.lind);
                    else replayLogs(slice, 0);
                    object.lind = slice.length;
                });
                return object;
            }
        }
    });
    setInterval(() => {
        for (const user of document.querySelectorAll(".game-player-list-user-username")) {
            if (!user.getAttribute("canwebedonewiththisalready-ihateit") && names[user.innerText]) {
                user.setAttribute("canwebedonewiththisalready-ihateit", "therewego-allfuckingdone-youhappynow-huh-doyouregretyourlifechoicesorwhat");
                user.innerHTML += `<ul class="tainted-extra"><li>Joined ${names[user.innerText][0]}</li> • <li>ID ${names[user.innerText][1]}</li></ul>`;
            }
        }
        let flex1 = document.querySelector(":not(.tainted-last) + div.flex-1");
        let top = document.querySelector(".game-top");
        if (flex1) {
            if (replay) {
                flex1.insertAdjacentElement("beforebegin", head);
                if (!document.querySelector(".tainted-last")) speed.innerText = "1X SPEED";
                flex1.insertAdjacentElement("beforebegin", setter);
            }
            flex1.insertAdjacentElement("beforebegin", download);
        }
        else if (document.querySelector(".game-top > :last-child:not(.tainted-last)") && !document.querySelector(".game-top > .flex-1")) {
            if (replay) {
                top.append(head);
                speed.innerText = "1X SPEED";
                top.append(setter);
            }
            top.append(download);
        }
        let pat = document.querySelector(":not(.tainted-stats) + * > .icon-ellipsis");
        if (pat) pat.parentElement.insertAdjacentElement("beforebegin", icon);
    }, 30);
    setInterval(() => {

    }, 5000);
    window.addEventListener("beforeunload", () => {
        let item = localStorage.getItem("tainted-replays");
        let modified = item !== null ? JSON.parse(item) : [];
        for (const key of keysToOverride) {
            localStorage.setItem(`tainted-${key}`, JSON.stringify(replays[key]));
            modified.push(key);
        }
        localStorage.setItem("tainted-replays", JSON.stringify(modified));
        keysToOverride.clear();
    })
})();