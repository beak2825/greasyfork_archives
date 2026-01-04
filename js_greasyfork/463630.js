// ==UserScript==
// @name         Bot sender
// @version      0.1
// @description  Sends a bot that always feeds you!
// @author       You
// @match        *://agario.miami/*
// @match        *://agar.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agario.miami
// @run-at       document-start
// @grant        none
// @namespace    https://greasyfork.org/users/761829
// @supportURL   https://discord.gg/NMS3YR9Q5R
// @homepage     https://github.com/NuroC
// @downloadURL https://update.greasyfork.org/scripts/463630/Bot%20sender.user.js
// @updateURL https://update.greasyfork.org/scripts/463630/Bot%20sender.meta.js
// ==/UserScript==

// cell
class Cell {
    constructor(s, i, t, h, c, l) {
        this.id = s;
        this.x = i;
        this.y = t;
        this.size = h;
        this.color = c;
        this.name = l
    }
}

let myPlayer = {
    x: null, // int
    y: null, // int
};

let playerCells = [];
let nodesOnScreen = [];
let nodes = {};

let hooked = false;
let detectedSocket;
let hookSocket = WebSocket;
let websocketQueue = [];

window.WebSocket = function (...args) {
    const newSocket = new hookSocket(...args);

    if (!hooked) {
        hooked = true;
        detectedSocket = newSocket;
        setupDetection();
    } else {
        websocketQueue.push(newSocket);
    }

    return newSocket;
};

function setupDetection() {
    let detect = new Proxy(detectedSocket, {
        set() {
            const messageReference = detectedSocket.onmessage;
            const closeReference = detectedSocket.onclose;

            detectedSocket.onmessage = function (event) {
                handleWsMessage(new DataView(event.data));
                messageReference.apply(this, arguments);
            };

            detectedSocket.onclose = function () {
                console.log("close");
                closeReference.apply(this, arguments);
            };

            detectedSocket.send = new Proxy(detectedSocket.send, {
                apply(target, thisArg, argumentsList) {
                    return Reflect.apply(target, thisArg, argumentsList);
                },
            });
        },
    });

    detect.change = 1;
    const interval = setInterval(() => {
        if (detectedSocket.readyState > 2) {
            if (websocketQueue.length > 0) {
                detectedSocket = websocketQueue.shift();
                setupDetection();
            } else {
                hooked = false;
                clearInterval(interval);
            }
            detect.change = 1;
        }
    }, 100);
}



function prepareData(a) {
    return new DataView(new ArrayBuffer(a))
}

function wsSend(ws, a) {
    ws.send(a.buffer)
}

function onWsOpen(ws) {
    let msg;

    msg = prepareData(5);
    msg.setUint8(0, 254);
    msg.setUint32(1,5 , true);
    wsSend(ws, msg)
    msg = prepareData(5);
    msg.setUint8(0, 255);
    msg.setUint32(1, 123456789, true);
    wsSend(ws, msg);
    setTimeout(() => {
        sendNickName(ws, "skid")
    }, 1000)
}

function sendNickName(ws, name) {
    var msg = prepareData(1 + 2 * name.length);
    msg.setUint8(0, 192);
    for (var i = 0; i < name.length; ++i) msg.setUint16(1 + 2 * i, name.charCodeAt(i), true);
    wsSend(ws, msg);
}
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", event => {
    mouseX = event.x;
    mouseY = event.y
})

function sendUint8(ws, a) {
    var msg = prepareData(1);
    msg.setUint8(0, a);
    wsSend(ws, msg)
}

function connectBot() {
    let ws = new WebSocket(detectedSocket.url);
    ws.binaryType = 'arraybuffer';

    ws.onopen = function() {
        onWsOpen(ws)
    }

    ws.addEventListener("message", event => {
        let msg;
        // movement
        msg = prepareData(21);
        msg.setUint8(0, 16);
        msg.setFloat64(1, myPlayer.nodeX, true);
        msg.setFloat64(9, myPlayer.nodeY, true);
        msg.setUint32(17, 0, true);
        wsSend(ws, msg);

        // splitting
        sendUint8(ws, 17)

        // respawning
        sendNickName(ws, "skid")
    })
}


function handleWsMessage(msg) {
    let offset = 0;

    if (msg.getUint8(offset) === 240) {
        offset += 5;
    }

    let index = msg.getUint8(offset++);

    switch (index) {
        case 16: // update nodes
            Object.assign(myPlayer, getNodeXY(msg, offset, nodesOnScreen, playerCells))
            break;
        case 20: // clear nodes
            playerCells = [];
            nodesOnScreen = [];
            break;
        case 32: // add node
            nodesOnScreen.push(msg.getUint32(offset, true));
            offset += 4;
            connectBot()
            break;
    }
}

function getNodeXY(view, offset, ns, ps) {
    let nodeX, nodeY;

    const queueLength = view.getUint16(offset, true);
    offset += 2;
    offset += queueLength * 8; // Skip unnecessary data

    while (true) {
        const nodeid = view.getUint32(offset, true);
        offset += 4;
        if (nodeid === 0) break;

        const posX = view.getInt16(offset, true);
        offset += 2;
        const posY = view.getInt16(offset, true);
        offset += 2;
        const size = view.getInt16(offset, true);
        offset += 2;

        // Skip color data
        offset += 3;

        const flags = view.getUint8(offset++);
        flags & 2 && (offset += 4);
        flags & 4 && (offset += 8);
        flags & 8 && (offset += 16);

        // Skip name
        while (view.getUint16(offset, true) !== 0) {
            offset += 2;
        }
        offset += 2;

        let node;
        if (nodes.hasOwnProperty(nodeid)) {
            node = nodes[nodeid];
            node.x = posX;
            node.y = posY;
            node.size = size;
        } else {
            node = new Cell(nodeid, posX, posY, size, null, null);
            nodes[nodeid] = node;
        }

        if (-1 !== ns.indexOf(nodeid) && -1 === ps.indexOf(node)) {
            nodeX = posX;
            nodeY = posY;
        }
    }

    return { nodeX, nodeY };
}














