// ==UserScript==
// @name         Gota.io Multibox | Bots/Tab
// @namespace    http://nelbots.ovh/
// @version      1.0
// @description  Gota.io Bots Based Tabs with Single Active Tab Control
// @author       NelFeast
// @match        https://gota.io/web/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gota.io
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519569/Gotaio%20Multibox%20%7C%20BotsTab.user.js
// @updateURL https://update.greasyfork.org/scripts/519569/Gotaio%20Multibox%20%7C%20BotsTab.meta.js
// ==/UserScript==

(function () {
    "use strict";

    window.config = null;
    let isCurrentTab = true;
    const hudPanel = document.querySelector('.hud-panel');
    const broadcastChannel = new BroadcastChannel("mouse-sync");

    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function (...args) {
        const ws = new OriginalWebSocket(...args);
        window.config = ws;
        ws.addEventListener("close", function() { window.config = null });
        return ws;
    };
    const originalWebSocketSend = OriginalWebSocket.prototype.send;
    OriginalWebSocket.prototype.send = function (data) {
        originalWebSocketSend.apply(this, arguments);
        if (typeof data === 'object' && data.byteLength === 9) {
            const buffer = new DataView(new Uint8Array(data).buffer);
            broadcastChannel.postMessage({ x: buffer.getInt32(1, true), y: buffer.getInt32(5, true) });
        }
    };
    broadcastChannel.onmessage = ({ data }) => {
        const { opcode, x, y } = data;
        if (!isCurrentTab) {
            const view = new DataView(new ArrayBuffer(1));
            view.setUint8(0, opcode);
            send(view);
            sendMove(x, y);
        }
    };
    function sendMove(x, y) {
        const view = new DataView(new ArrayBuffer(9));
        view.setUint8(0, 16);
        view.setInt32(1, x, true);
        view.setInt32(5, y, true);
        send(view);
    }
    function send(data) {
        if (window.config?.readyState === 1) {
            window.config.send(data.buffer);
        }
    }
    const htmlContent = `<div style="font-family:Calibri;position:absolute;left:10px;bottom:280px;pointer-events:auto;width:130px;background-color:rgba(20,20,20,.9);border:2px solid rgba(255,255,255,.2);border-radius:6px;padding:10px;box-shadow:0 4px 15px rgba(0,0,0,.5)"><p style="color:#fff;font-weight:700;font-size:16px;text-align:center;margin:0 0 5px 0">Other Tab Control</p><div style="margin-bottom:5px;display:flex;align-items:center;justify-content:space-between"><label style="color:#fff;font-size:16px;font-weight:700">Split:</label><input value="E" id="botSplit" type="text" maxlength="1" style="width:35px;height:25px;text-transform:uppercase;background-color:rgba(40,40,40,1);border:1px solid rgba(255,255,255,.2);border-radius:4px;color:#fff;text-align:center;font-size:14px;font-weight:700;outline:0;transition:background-color .3s,transform .3s" onfocus='this.style.backgroundColor="rgba(60, 60, 60, 1)"' onblur='this.style.backgroundColor="rgba(40, 40, 40, 1)"' disabled="disabled"></div><div style="margin-bottom:5px;display:flex;align-items:center;justify-content:space-between"><label style="color:#fff;font-size:16px;font-weight:700">Feed:</label><input value="R" id="botEject" type="text" maxlength="1" style="width:35px;height:25px;text-transform:uppercase;background-color:rgba(40,40,40,1);border:1px solid rgba(255,255,255,.2);border-radius:4px;color:#fff;text-align:center;font-size:14px;font-weight:700;outline:0;transition:background-color .3s,transform .3s" onfocus='this.style.backgroundColor="rgba(60, 60, 60, 1)"' onblur='this.style.backgroundColor="rgba(40, 40, 40, 1)"' disabled="disabled"></div></div>`;
    if (isCurrentTab && hudPanel) hudPanel.insertAdjacentHTML('beforeend', htmlContent);
    document.addEventListener("keydown", (e) => {
        switch (e.keyCode) {
            case 69:
                broadcastChannel.postMessage({ opcode: 17 });
                break;
            case 82:
                broadcastChannel.postMessage({ opcode: 21 });
                break;
        }
    });
    window.addEventListener("focus", () => (isCurrentTab = true));
    window.addEventListener("blur", () => (isCurrentTab = false));
})();
