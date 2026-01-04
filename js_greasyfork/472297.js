// ==UserScript==
// @name         Legacy Random Tank Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Reimplements the random tank button, because for some fucking reason it was removed
// @author       PowfuArras // Discord: @xskt
// @match        *://*.woomy.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woomy.app
// @grant        none
// @run-at       document-start
// @license      FLORRIM DEVELOPER GROUP LICENSE (https://github.com/Florrim/license/blob/main/LICENSE.md)
// @credit       https://game-icons.net/
// @downloadURL https://update.greasyfork.org/scripts/472297/Legacy%20Random%20Tank%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/472297/Legacy%20Random%20Tank%20Button.meta.js
// ==/UserScript==

(function () {
    "use strict";
    let socket = null;
    const nativeWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
        socket = this;
        nativeWebSocketSend.call(this, data);
    };
    window.addEventListener("load", function () {
        const canvas = document.getElementById("gameCanvas");
        const button = document.createElement("div");
        button.style.height = "30px";
        button.style.width = "30px";
        button.style.position = "fixed";
        button.style.top = "10px";
        button.style.left = "40px";
        button.style.border = "none";
        button.style.display = "inline-block";
        button.style.opacity = "0.75";
        button.style.backgroundImage = `url('data:image/svg+xml,%3Csvg xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" fill%3D"%23DD0000" viewBox%3D"0 0 16 16" width%3D"20" height%3D"20"%3E%3Cpath d%3D"M 8.0528 -0.0064 L 0 5.3616 V 9.0688 L 8.0528 3.7008 L 16.104 9.0688 V 5.3616 Z M 8.0528 4.4576 L 2.7888 8.0096 V 11.1568 L 8.0528 7.6048 L 13.3152 11.1568 V 8.0096 Z M 8.0528 8.3616 L 5.0192 10.408 V 12.7648 L 8.0528 10.7424 L 11.0848 12.7648 V 10.408 Z M 8.0528 11.4976 L 5.0192 13.5184 V 15.7632 L 8.0528 13.7408 L 11.0848 15.7632 V 13.5184 Z"%3E%3C%2Fpath%3E%3C%2Fsvg%3E')`;
        button.style.backgroundRepeat = "no-repeat";
        button.style.backgroundPosition = "center";
        button.style.zIndex = 102;
        document.body.appendChild(button);
        button.addEventListener("click", function () {
            canvas.focus(); 
            if (socket === null) {
                return null;
            }
            for (let i = 0; i < 6; i++) {
                socket.talk("U", "random");
            }
        });
    });
})();