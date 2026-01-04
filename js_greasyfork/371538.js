// ==UserScript==
// @name         AgarBots 2018
// @namespace    None
// @version      2018
// @description  best bots 2018 for agariohub.net!
// @author       Erkan
// @match        *.ogar.be/*
// @match        *.tr-agario.com/*
// @match        *.army.ovh/*
// @match        *.cellcraft.io/*
// @match        *.agario0.com/*
// @match        *.agariohub.net/client/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371538/AgarBots%202018.user.js
// @updateURL https://update.greasyfork.org/scripts/371538/AgarBots%202018.meta.js
// ==/UserScript==
window.botConfig = {
    botSplit: 'e', // change e to any key you want!
    botFeed: 'r', // change r to any key you want!
    botStart: '=', // change = to any key you want!
    botServer: 'localhost' // keep it as localhost unless you are using vps!
};
window.agarServer = 'none';
window.started = false;
window.pelletMode = false;
window._ws = null;
(function() {
    'use strict';
    function bufToArray(buf) {
        var ab = [];
        for (var i = 0; i < buf.byteLength; i++) {
            ab.push(buf.getUint8(i, true));
        }
        return ab;
    }
    function toArrayBuffer(buf) {
        var ab = new ArrayBuffer(buf.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    }
    connect();
    function connect() {
        window._ws = new WebSocket('ws://' + window.botConfig.botServer + ':8888?origin=' + location.origin + '&token=' + Math.floor(Math.random() * 100000));
        window._ws.binaryType = 'arraybuffer';
        window._ws.onclose = onclose;
        window._ws.onopen = onopen;
        window._ws._send = window._ws.send;
        window._ws.send = send;
        console.log('Connecting!');
    }
    function onopen() {
        console.log('Connected!');
        let buf = new DataView(new ArrayBuffer(1 + 2 * window.agarServer.length));
        let offset = 0;
        buf.setUint8(offset++, 3);
        for (let i = 0; i < window.agarServer.length; i++) {
            buf.setUint16(offset, window.agarServer.charCodeAt(i), true);
            offset += 2;
        }
        window._ws.send(buf);
    }
    function send(e) {
        if (window._ws.readyState === window._ws.OPEN) window._ws._send(e);
    }
    function onclose(e) {
        //console.log(e.reason);
        if (e.reason !== 'FULL')
            connect();
        else
            alert('AgarBots 2018 is currently full!');
    }
    WebSocket.prototype.realSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(pkt) {
        this.realSend(pkt);
        if (this.url.indexOf(window.botConfig.botServer) !== -1) return;
        if (pkt instanceof ArrayBuffer) pkt = new DataView(pkt);
        else if (pkt instanceof DataView) pkt = pkt;
        else pkt = new DataView(toArrayBuffer(pkt));
        switch (pkt.getUint8(0, true)) {
            case 16:
                window._ws.send(pkt);
                break;
            case 254:
                window.pkt254 = bufToArray(pkt);
                var buf = new DataView(new ArrayBuffer(1 + pkt.byteLength));
                buf.setUint8(0, 254);
                buf.setUint8(1, pkt.getUint8(0));
                for (var i = 0; i < pkt.byteLength; i++) {
                    buf.setUint8(i + 1, pkt.getUint8(i));
                }
                window._ws.send(buf);
                break;
            case 255:
                window.pkt255 = bufToArray(pkt);
                buf = new DataView(new ArrayBuffer(1 + pkt.byteLength));
                buf.setUint8(0, 255);
                buf.setUint8(1, pkt.getUint8(0));
                for (var i = 0; i < pkt.byteLength; i++) {
                    buf.setUint8(i + 1, pkt.getUint8(i));
                }
                window._ws.send(buf);
                break;
        }
    };
    var _WebSocket = WebSocket;
    WebSocket = function(ip) {
        if (ip.indexOf(window.botConfig.botServer) == -1) {
            window.agarServer = ip;
            let buf = new DataView(new ArrayBuffer(1 + 2 * ip.length));
            let offset = 0;
            buf.setUint8(offset++, 3);
            for (let i = 0; i < ip.length; i++) {
                buf.setUint16(offset, ip.charCodeAt(i), true);
                offset += 2;
            }
            window._ws.send(buf);
            return new _WebSocket(ip);
        } else
            return new _WebSocket(ip);
    };
    function isTyping() {
        return $("input:focus").length;
    }
    document.addEventListener('keyup', key => {
        key = key.key.toLowerCase();
        if (isTyping()) return;
        switch (key) {
            case window.botConfig.botStart.toLowerCase():
                if (window.started)
                    window._ws.send(new Uint8Array([1]));
                else
                    window._ws.send(new Uint8Array([0]));
                window.started = !window.started;
                break;
        }
    });
    document.addEventListener('keydown', key => {
        key = key.key.toLowerCase();
        if (isTyping()) return;
        switch (key) {
            case window.botConfig.botSplit.toLowerCase():
                window._ws.send(new Uint8Array([2, 0]));
                break;
            case window.botConfig.botFeed.toLowerCase():
                window._ws.send(new Uint8Array([2, 1]));
                break;
        }
    });
})();