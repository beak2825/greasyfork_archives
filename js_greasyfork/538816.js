// ==UserScript==
// @name         CLN PixelRadar
// @namespace    https://tampermonkey.net/
// @version      0.1
// @description  CL.NET PixelRadar
// @author       mftkwww
// @grant        none
// @connect      githubusercontent.com
// @connect      github.com
// @connect      canvasland.net
// @match        *://canvasland.net/*
// @downloadURL https://update.greasyfork.org/scripts/538816/CLN%20PixelRadar.user.js
// @updateURL https://update.greasyfork.org/scripts/538816/CLN%20PixelRadar.meta.js
// ==/UserScript==

let notificationRadius = 300;
const NOTIFICATION_TIME = 2000;

let pixelList = [];
let canvas;
let notifCircles = [];
let mapPointer;

const args = window.location.href.split(',');
let globalScale = 1;
let viewX = parseInt(args[args.length - 3]);
let viewY = parseInt(args[args.length - 2]);


let mapPoints = []
let shablonHash = '';

const PING_OP = 0xB0;
const REG_MCHUNKS_OP = 0xA3;
const PIXEL_UPDATE_OP = 0xC1;
const REG_CANVAS_OP = 0xA0;

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

function init() {
    setTimeout(shablonMain);
    setTimeout(radarMain);
}

async function shablonMain() {
    addModal();
    addButton();
    await updateInfo(false);
    setInterval(updateInfo, 60000);
}

async function updateInfo(show = true) {
    const info = await loadInfo(src_info);

    const modal_text = document.querySelector('#modal_text');
    if (info.text.length === 0) {
        modal_text.innerHTML = 'Z'
    } else if (info.text !== modal_text.innerHTML) {
        modal_text.innerHTML = info.text;
        if (show) showModal();
    }

    mapPoints = info.points;

    if (info.pic_hash !== shablonHash) {
        shablonHash = info.pic_hash;
        const file = await loadFile(src_picture);
        if (isTemplateExists(templateName)) {
            updateTemplate(file, info, templateName);
        } else {
            addTemplate(file, info, templateName);
        }
    }
}


function closeModal() {
    const modal = document.querySelector('#my_modal');
    if (modal) modal.style.display = 'none';
}

function showModal() {
    const modal = document.querySelector('#my_modal');
    if (modal) modal.style.display = 'block';
}

function addTemplate(file, coords, name) {
    templateLoader.addFile(
        file,
        name,
        "0",
        coords.x,
        coords.y
    );
}

function isTemplateExists(name) {
    return findTemplate(name) !== undefined;
}

function findTemplate(name) {
    const list = getNativeTemplates();
    return list.find(t => name === t.title);
}


function getNativeTemplates() {
    return JSON.parse(JSON.parse(localStorage['persist:tem']).list);
}

function updateTemplate(file, coords, name) {
    templateLoader.deleteTemplate(name);
    addTemplate(file, coords, name);
}

async function loadFile(src) {
    const resp = await fetch(src);
    const blob = await resp.blob();
    return new File([blob], 'result.png', {
        type: 'image/png',
    });
}

async function loadInfo(src) {
    const resp = await fetch(src);
    return await resp.json();
}

async function loadColors() {
    const resp = await fetch('/api/me');
    const data = await resp.json();
    for (const [key, canvas] of Object.entries(data['canvases'])) {
        if (canvas['ident'] === window.location.hash.substring(1, 2))
            return canvas['colors'];
    }
    return [
        [202, 227, 255],
        [255, 255, 255],
        [255, 255, 255],
        [228, 228, 228],
        [196, 196, 196],
        [136, 136, 136],
        [78, 78, 78],
        [0, 0, 0],
        [244, 179, 174],
        [255, 167, 209],
        [255, 84, 178],
        [255, 101, 101],
        [229, 0, 0],
        [154, 0, 0],
        [254, 164, 96],
        [229, 149, 0],
        [160, 106, 66],
        [96, 64, 40],
        [245, 223, 176],
        [255, 248, 137],
        [229, 217, 0],
        [148, 224, 68],
        [2, 190, 1],
        [104, 131, 56],
        [0, 101, 19],
        [202, 227, 255],
        [0, 211, 221],
        [0, 131, 199],
        [0, 0, 234],
        [25, 25, 115],
        [207, 110, 228],
        [130, 0, 128],
        [83, 39, 68],
        [125, 46, 78],
        [193, 55, 71],
        [214, 113, 55],
        [252, 154, 41],
        [68, 33, 57],
        [131, 51, 33],
        [163, 61, 24],
        [223, 96, 22],
        [31, 37, 127],
        [10, 79, 175],
        [10, 126, 230],
        [88, 237, 240],
        [37, 20, 51],
        [53, 33, 67],
        [66, 21, 100],
        [74, 27, 144],
        [110, 75, 237],
        [16, 58, 47],
        [16, 74, 31],
        [16, 142, 47],
        [16, 180, 47],
        [117, 215, 87]
    ];
}

function worldToScreen(x, y) {
    return [
        ((x - viewX) * globalScale) + (canvas.width / 2),
        ((y - viewY) * globalScale) + (canvas.height / 2),
    ];
}

function render() {
    try {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        if (globalScale < 0.8) {
            for (let index = 0; index < mapPoints.length; index++) {
                const point = mapPoints[index];
                if (point.site !== window.location.host || point.canvas !== window.location.hash.substring(1, 2))
                    continue;
                const [sx, sy] = worldToScreen(point.x, point.y)
                    .map((z) => z + globalScale / 2);
                const circleScale = notificationRadius / 100;
                ctx.save();
                ctx.scale(circleScale, circleScale);
                ctx.drawImage(
                    mapPointer,
                    Math.round(sx / circleScale - 150),
                    Math.round(sy / circleScale - 150),
                );
                ctx.restore();
            }
            const curTime = Date.now();
            for (let index = pixelList.length - 1; index >= 0; index--) {
                let [setTime, x, y, i, j, color] = pixelList[index];
                const timePassed = curTime - setTime;
                if (timePassed > NOTIFICATION_TIME) {
                    pixelList.splice(index, 1);
                    continue;
                }
                const [sx, sy] = worldToScreen(x, y)
                    .map((z) => z + globalScale / 2);
                const notRadius = timePassed / NOTIFICATION_TIME * notificationRadius;
                const circleScale = notRadius / 100;
                ctx.save();
                ctx.scale(circleScale, circleScale);
                ctx.drawImage(
                    notifCircles[color],
                    Math.round(sx / circleScale - 105),
                    Math.round(sy / circleScale - 105),
                );
                ctx.restore();
            }
        }
    } catch (err) {
        console.error(`Render error`, err,);
    }
    setTimeout(render, 10);
}

function addPixel(x, y, i, j, color) {
    for (let k = 0; k < pixelList.length; k++) {
        if (pixelList[k][3] === i && pixelList[k][4] === j) {
            pixelList[k][1] = x;
            pixelList[k][2] = y;
            pixelList[k][5] = color;
            return;
        }
    }
    pixelList.unshift([Date.now(), x, y, i, j, color]);
}

function getPixelFromChunkOffset(i, j, offset, canvasSize) {
    const tileSize = 256;
    const x = i * tileSize - canvasSize / 2 + offset % tileSize;
    const y = j * tileSize - canvasSize / 2 + Math.trunc(offset / tileSize);
    //const x = i * tileSize - canvasSize / 2 + 128;
    //const y = j * tileSize - canvasSize / 2 + 128;
    return [x, y];
}

function renderPixel(i, j, offset, color) {
    const canvasSize = 65536;
    const [x, y] = getPixelFromChunkOffset(i, j, offset, canvasSize);
    addPixel(x, y, i, j, color);
}

function renderPixels({i, j, pixels}) {
    const pxl = pixels[pixels.length - 1];
    const [offset, color] = pxl;
    renderPixel(i, j, offset, color);
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(n, max));
}

function updateScale(viewscale) {
    globalScale = viewscale;
    notificationRadius = clamp(viewscale * 10, 20, 400);
}

function updateView(val) {
    viewX = val[0];
    viewY = val[1];
}

function onWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function dehydratePing() {
    return new Uint8Array([PING_OP]).buffer;
}

function dehydrateRegMChunks(chunks) {
    const buffer = new ArrayBuffer(1 + 1 + chunks.length * 2);
    const view = new Uint16Array(buffer);
    // this will result into a double first byte, but still better than
    // shifting 16bit integers around later
    view[0] = REG_MCHUNKS_OP;
    for (let cnt = 0; cnt < chunks.length; cnt += 1) {
        view[cnt + 1] = chunks[cnt];
    }
    return buffer;
}

function hydratePixelUpdate(data) {
    const i = data.getUint8(1);
    const j = data.getUint8(2);
    /*
     * offset and color of every pixel
     * 3 bytes offset
     * 1 byte color
     */
    const pixels = [];
    let off = data.byteLength;
    while (off > 3) {
        const color = data.getUint8(off -= 1);
        const offsetL = data.getUint16(off -= 2);
        const offsetH = data.getUint8(off -= 1) << 16;
        pixels.push([offsetH | offsetL, color]);
    }
    return {
        i, j, pixels,
    };
}

function onBinaryMessage(buffer) {
    if (buffer.byteLength === 0) return;
    const data = new DataView(buffer);
    const opcode = data.getUint8(0);
    if (opcode === PIXEL_UPDATE_OP || opcode === 145) {
        renderPixels(hydratePixelUpdate(data));
    }
}

function dehydrateRegCanvas(canvasId) {
    const buffer = new ArrayBuffer(1 + 1);
    const view = new DataView(buffer);
    view.setInt8(0, REG_CANVAS_OP);
    view.setInt8(1, Number(canvasId));
    return buffer;
}

function onMessage({data: message}) {
    try {
        if (typeof message !== 'string') {
            onBinaryMessage(message);
        }
    } catch (err) {
        console.error(`An error occurred while parsing websocket message ${message}`, err,);
    }
}

function socketConnect(i, url, allChunks) {
    const ws = new WebSocket(url);
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => {
        console.log(`Socket ${i} opened`);
        ws.send(dehydrateRegCanvas(0));
        const chunkids = [];
        for (let j = 17000 * i; j < 17000 * (i + 1) && j < allChunks.length; j++) {
            chunkids.push(allChunks[j]);
        }
        ws.send(dehydrateRegMChunks(chunkids));
    };
    ws.onmessage = onMessage;
    ws.onclose = () => {
        console.log(`Socket ${i} closed`);
        setTimeout(() => {
            socketConnect(i, url, allChunks)
        }, 1000);
    };
    ws.onerror = (err) => {
        console.error('Socket encountered error, closing socket', err);
    };
    setInterval(() => {
        if (ws.readyState !== WebSocket.CLOSED) {
            ws.send(dehydratePing());
        }
    }, 23000)
}

async function radarMain() {
    canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    onWindowResize();
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.body.appendChild(canvas);

    window.addEventListener('resize', onWindowResize);

    const colors = await loadColors();
    colors.forEach(color => {
        const notifCircle = document.createElement('canvas');
        notifCircle.width = 210;
        notifCircle.height = 210;
        const notifcontext = notifCircle.getContext('2d');
        notifcontext.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.7)`;
        notifcontext.beginPath();
        notifcontext.arc(105, 105, 100, 0, 2 * Math.PI);
        notifcontext.closePath();
        notifcontext.fill();
        notifcontext.lineWidth = 5;
        notifcontext.strokeStyle = '#FF0000';
        notifcontext.stroke();
        notifCircles.push(notifCircle);
    })

    mapPointer = document.createElement('canvas');
    mapPointer.width = 300;
    mapPointer.height = 300;
    const pointercontext = mapPointer.getContext('2d');
    const img = document.createElement("img");
    img.addEventListener("load", () => {
        pointercontext.drawImage(img, 0, 0);
    });
    img.src = ".................";

    pixelPlanetEvents.on('setscale', updateScale);
    pixelPlanetEvents.on('setviewcoordinates', updateView);

    setTimeout(render, 10);

    const url = `${
        window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    }//${
        window.location.host
    }/ws`;
    const allChunks = []
    for (let i = 0; i <= 255; i++) {
        for (let j = 0; j <= 255; j++) {
            allChunks.push((i << 8) | j);
        }
    }
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            socketConnect(i, url, allChunks)
        });
    }
}