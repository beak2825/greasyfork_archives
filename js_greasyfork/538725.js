// ==UserScript==
// @name         [DEBUG]WebSocket日志查看器
// @version      0.1.4
// @description  更详细的统计数据
// @author       Weierstras@www.milkywayidle.com
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @run-at       document-start
// @connect      *
// @namespace https://greasyfork.org/users/1461615
// @downloadURL https://update.greasyfork.org/scripts/538725/%5BDEBUG%5DWebSocket%E6%97%A5%E5%BF%97%E6%9F%A5%E7%9C%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538725/%5BDEBUG%5DWebSocket%E6%97%A5%E5%BF%97%E6%9F%A5%E7%9C%8B%E5%99%A8.meta.js
// ==/UserScript==


(function() {
    "use strict";
    const dbg = console.log;

    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;
        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }
            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message }); // Anti-loop
            handleMessage(message);
            return message;
        }
    }

    const whitelist = [
        'chat_message_received',
        'chat_message_updated',
        'pong',
        // 'battle_consumable_ability_updated',
        'battle_updated',
        'active_player_count_updated',
    ];
    function handleMessage(message) {
        let obj = JSON.parse(message);
        if (!obj) return message;
        if (whitelist.includes(obj.type)) return message;
        const timestamp = new Date().toISOString().split('T')[1].substring(0, 12);
        dbg(`%c[RECV]%c ${obj.type}%c ${timestamp}:`, `font-weight: bold; color: #00f;`, `font-weight: bold; color: #f00;`, `font-weight: regular; color: #000;`, obj);
        return message;
    }
    hookWS();



    const orgin_webSocket = window.WebSocket
    window.WebSocket = function () {
        const webSocket_client = new orgin_webSocket(...arguments)
        const orgin_send = webSocket_client.send
        webSocket_client.send = function (message) {
            let obj = JSON.parse(message);
            if (!obj) return;
            const timestamp = new Date().toISOString().split('T')[1].substring(0, 12);
            dbg(`%c[SEND]%c ${obj.type}%c ${timestamp}:`, `font-weight: bold; color: #0a0;`, `font-weight: bold; color: #f00;`, `font-weight: regular; color: #000;`, obj);
            orgin_send.call(this, message)
        }
        return webSocket_client
    }
    Object.defineProperty(WebSocket, Symbol.hasInstance, {
        value: function(v) {
            return v instanceof orgin_webSocket;
        }
    })

})();


/*
url: "wss://api.milkywayidle.com/ws?hash=8HhKtxuVhmXOJgZtl92R&characterId=208951&gameVersion=v1.20250519.0&versionTimestamp=1747703262469&lang=zh"
*/