// ==UserScript==
// @name         Neko's Scripts
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  Script for OWOP
// @author       NekoNoka
// @match        https://ourworldofpixels.com/*
// @exclude      https://ourworldofpixels.com/api*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldofpixels.com
// @grant        none
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/445667/Neko%27s%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/445667/Neko%27s%20Scripts.meta.js
// ==/UserScript==

'use strict';

const IMPORTS = (function () {
    let NS = undefined;

    const log = (function () {
        const colors = {
            // background
            // background-color
            // brightness()?
            // box-shadow?
            // color
            // display
            // flex?
            // font-weight
            // grayscale()?
            // hue-rotate()?
            // hsl()?
            // hsla()?
            // height?
            // width?
            // line-height?
            // margin, padding, border?
            // max-height, max-width?
            // outline?
            // position?
            // rgb(), rgba()?
            // rotate?
            // saturate?
            // scale?
            // skew()?
            // top, right, left, bottom?
            // transform?
            // translate?

            // bright: "filter:brightness(1.2);", // apparently doesnt do anything on text
            // dim: "filter:brightness(0.7);",

            black: "color:black;",
            red: "color:red;",
            green: "color:green;",
            yellow: "color:yellow;",
            blue: "color:blue;",
            magenta: "color:magenta;",
            cyan: "color:cyan;",
            white: "color:white;",
            gray: "color:gray;",
            grey: "color:grey;",

            bgblack: "background-color:black",
            bgred: "background-color:red",
            bggreen: "background-color:green",
            bgyellow: "background-color:yellow",
            bgblue: "background-color:blue",
            bgmagenta: "background-color:magenta",
            bgcyan: "background-color:cyan",
            bgwhite: "background-color:white",
            bggray: "background-color:gray",
            bggrey: "background-color:grey"
        }
        return function (modifierList, ...message) {
            message = message.join(" ");
            if (message === "") {
                message = modifierList;
                modifierList = "";
            }
            let styling = "";
            modifierList.toLowerCase().split(" ").forEach(c => (c in colors) ? styling += colors[c] : styling += c);
            console.log(`%c${message}`, `${styling}`);
        }
    })();

    const rangeMap = (a, b) => s => {
        const [a1, a2] = a;
        const [b1, b2] = b;
        // Scaling up an order, and then down, to bypass a potential,
        // precision issue with negative numbers.
        return (((((b2 - b1) * (s - a1)) / (a2 - a1)) * 10) + (10 * b1)) / 10;
    }

    const clamp = v => Math.round(Math.max(Math.min(v, 255), 0));

    const degToRad = d => d * (Math.PI / 180);

    const radToDeg = r => r / (Math.PI / 180);

    const modulo = (i, m) => i - m * Math.floor(i / m);

    const line = (x1, y1, x2, y2, m, e, plot) => {
        if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) return console.error();
        let dx = Math.abs(x2 - x1);
        let sx = x1 < x2 ? 1 : -1;
        let dy = -Math.abs(y2 - y1);
        let sy = y1 < y2 ? 1 : -1;
        let err = dx + dy;
        let e2 = undefined;

        if (e?.type === "mousemove") {
            if (x1 === x2 && y1 === y2) return;
            e2 = 2 * err;
            if (e2 >= dy) {
                err += dy;
                x1 += sx;
            }
            if (e2 <= dx) {
                err += dx;
                y1 += sy;
            }
        }
        let i = 0;
        while (true) {
            plot(x1, y1, i);
            i++;
            if (x1 === x2 && y1 === y2) break;
            e2 = 2 * err;
            if (e2 >= dy) {
                err += dy;
                x1 += sx;
            }
            if (e2 <= dx) {
                err += dx;
                y1 += sy;
            }
        }
        return [i];
    }

    const mkHTML = (e, t) => {
        let n = document.createElement(e);
        for (let o in t) n[o] = t[o];
        return n;
    }

    const setImageData = data => {
        let c = document.createElement('canvas');
        let w = data[0].length;
        let h = data.length;
        c.width = w;
        c.height = h;
        let ctx = c.getContext('2d');
        let d = ctx.createImageData(w, h);
        for (let j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
                let r = data[j][i][0];
                let g = data[j][i][1];
                let b = data[j][i][2];
                let a = r === 255 && g === 255 && b === 255 ? 0 : 255;
                d.data[4 * (j * w + i)] = r;
                d.data[4 * (j * w + i) + 1] = g;
                d.data[4 * (j * w + i) + 2] = b;
                d.data[4 * (j * w + i) + 3] = a;
            }
        }
        ctx.putImageData(d, 0, 0);
        return c;
    }

    const getImageData = image => {
        let c = document.createElement('canvas');
        let ctx = c.getContext('2d');
        if (image instanceof HTMLCanvasElement) {
            c = image;
        } else if (image instanceof Image) {
            c.width = image.width;
            c.height = image.height;
            ctx.drawImage(image, 0, 0);
        } else return false;
        let w = c.width
        let h = c.height;
        let d = ctx.getImageData(0, 0, w, h);
        let data = [];
        for (let j = 0; j < h; j++) {
            data.push([]);
            for (let i = 0; i < w; i++) {
                let c = [];
                c.push(d.data[4 * (j * w + i)]);
                c.push(d.data[4 * (j * w + i) + 1]);
                c.push(d.data[4 * (j * w + i) + 2]);
                c.push(d.data[4 * (j * w + i) + 3]);
                data[j].push(c);
            }
        }
        return data;
    }

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.acx = x - 16 * (this.cx = Math.floor(x / 16));
            this.acy = y - 16 * (this.cy = Math.floor(y / 16));
        }
        static distance(p1, p2) {
            if (p1 instanceof Point && p2 instanceof Point) return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        }
    }

    class BPoint extends Point {
        constructor(x, y) {
            super(x, y);
            this.bottom = false;
            this.right = false;
        }
        static check(bp1, bp2, direction) {
            let p1 = NS.PM.queue[`${bp1.x},${bp1.y}`];
            let p2 = NS.PM.queue[`${bp2.x},${bp2.y}`];
            return bp1[direction] = (!!p1 && !p2) || (!p1 && !!p2);
        }
    }

    class Color {
        constructor(c) {
            this.rgb = c;
            this.int = Color.toInt(c);
            this.hex = Color.toHex(c);
        }
        static hue(d, b = 1) {
            let a = 256 / b; // 1   2   4  8  16 32 64 128 256
            // let b = mul;  // 256 128 64 32 16 8  4  2   1
            d = Math.floor(d); // im not sure this is needed
            // d = d % (b * 6); m_{F}\left(a,b\right)=a-b\operatorname{floor}\left(\frac{a}{b}\right)
            // d = (Math.abs(Math.floor(d / (b * 6)) * ((b * 6))) + (d % (b * 6))) % (b * 6);
            d = modulo(d, b * 6);
            // d = d - (b * 6) * ~~(d/(b * 6));
            let nD = Math.floor(Math.abs(d / b));
            let output = [0, 0, 0];
            if (nD < 1) {
                output = [255, 0, (d % b) * a];
            } else if (nD < 2) {
                output = [255 - ((d % b) * a), 0, 255];
            } else if (nD < 3) {
                output = [0, (d % b) * a, 255];
            } else if (nD < 4) {
                output = [0, 255, 255 - ((d % b) * a)];
            } else if (nD < 5) {
                output = [(d % b) * a, 255, 0];
            } else if (nD < 6) {
                output = [255, 255 - ((d % b) * a), 0];
            }
            return output;
            // return Color.toInt(output);
        }
        static toHex(c) {
            return "#" + c.map(v => {
                return ('0' +
                    Math.min(Math.max(parseInt(v), 0), 255)
                        .toString(16)
                ).slice(-2);
            }).join('');
        }
        static toBGRInt(c) {
            return (c[2] << 16 & 16711680) | (c[1] << 8 & 65280) | (c[0] & 255);
        }
        static toInt(c) {
            return (c[0] << 16 & 16711680) | (c[1] << 8 & 65280) | (c[2] & 255);
        }
        static fromInt(n) {
            return [(n & 16711680) >> 16, (n & 65280) >> 8, n & 255];
        }
    }

    class RGBRotate {
        constructor(degrees) {
            this.matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
            this.set_hue_rotation(degrees);
        }
        set_hue_rotation(degrees) {
            let cosA = Math.cos(degToRad(degrees));
            let sinA = Math.sin(degToRad(degrees));
            this.matrix[0][0] = cosA + (1 - cosA) / 3;
            this.matrix[0][1] = 1 / 3 * (1 - cosA) - Math.sqrt(1 / 3) * sinA;
            this.matrix[0][2] = 1 / 3 * (1 - cosA) + Math.sqrt(1 / 3) * sinA;
            this.matrix[1][0] = 1 / 3 * (1 - cosA) + Math.sqrt(1 / 3) * sinA;
            this.matrix[1][1] = cosA + 1 / 3 * (1 - cosA);
            this.matrix[1][2] = 1 / 3 * (1 - cosA) - Math.sqrt(1 / 3) * sinA;
            this.matrix[2][0] = 1 / 3 * (1 - cosA) - Math.sqrt(1 / 3) * sinA;
            this.matrix[2][1] = 1 / 3 * (1 - cosA) + Math.sqrt(1 / 3) * sinA;
            this.matrix[2][2] = cosA + 1 / 3 * (1 - cosA);
        }
        apply(r, g, b) {
            let rx = r * this.matrix[0][0] + g * this.matrix[0][1] + b * this.matrix[0][2];
            let gx = r * this.matrix[1][0] + g * this.matrix[1][1] + b * this.matrix[1][2];
            let bx = r * this.matrix[2][0] + g * this.matrix[2][1] + b * this.matrix[2][2];
            return [clamp(rx), clamp(gx), clamp(bx)];
        }
    }

    class Pixel extends Point {
        constructor(x, y, c, o = false) {
            super(x, y);
            this.c = new Color(c);
            this.o = o;
            this.placed = false;
            this.g = false;
            this.time = 0;
        }
    }

    class Chunk {
        constructor(p) {
            this.t = 0;
            this.pixels = Array(256).fill(undefined);
            this.data = Array(256).fill(-1);
            this.placed = true;
            for (let j = 0; j < 16; j++) {
                for (let i = 0; i < 16; i++) {
                    this.data[j * 16 + i] = Color.toBGRInt(OWOP.world.getPixel(p.cx * 16 + i, p.cy * 16 + j));
                }
            }
        }
        setPixel(p) {
            this.pixels[`${p.acx},${p.acy}`] = p;
            if (this.data[p.acy * 16 + p.acx] === Color.toBGRInt(p.c.rgb)) return;
            this.data[p.acy * 16 + p.acx] = Color.toBGRInt(p.c.rgb);
            this.t = new Date().getTime();
            this.placed = false;
        }
        deletePixel(p) {
            this.pixels[`${p.acx},${p.acy}`] = undefined;
        }
        setChunkColor(c) { // i dont think im gonna use this
            this.data.fill(c);
        }
    }

    class Action {
        constructor(p1, p2) {
            this.x = p1.x;
            this.y = p1.y;
            this.before_color = p1.c;
            this.after_color = p2.c;
        }
        undo() {
            return this.before_color;
        }
        redo() {
            return this.after_color;
        }
    }

    class PixelManager {
        constructor() {
            // ! MARK FOR CHANGE
            // NS.chunkize = false;
            this.undoStack = [];
            this.redoStack = [];
            this.actionStack = {};
            this.record = false;
            this.queue = {};
            this.chunkQueue = {};
            this.moveQueue = {};
            this.border = {};
            this.checkMove = true;
            this.renderBorder = false;
            this.autoMove = false;
            this.enableMod = true;
            this.whitelist = {};
            this.enabled = true;
            this.extra = {};
            this.extra.placeData = [];
            this.extra.chunkPlaceData = [];
            let p1 = new Point(0, 0);
            for (let y = -47; y < 47; y++) {
                for (let x = -47; x < 47; x++) {
                    let p2 = new Point(x, y);
                    let d = Point.distance(p1, p2);
                    this.extra.placeData.push([d, p2]);
                }
            }
            for (let y = -25; y < 26; y++) {
                for (let x = -25; x < 26; x++) {
                    let p2 = new Point(x, y);
                    let d = Point.distance(p1, p2);
                    this.extra.chunkPlaceData.push([d, p2]);
                }
            }
            this.extra.placeData.sort((a, b) => a[0] - b[0]);
            this.extra.chunkPlaceData.sort((a, b) => a[0] - b[0]);
        }
        setup() {
            OWOP.on(OWOP.events.tick, function () {
                this.enabled ? this.placePixel() : void 0
            }.bind(this));
            OWOP.on(OWOP.events.net.world.tilesUpdated, function (message) {
                for (let i = 0; i < message.length; i++) {
                    let p = message[i];
                    if (p.id === OWOP.player.id) continue;
                    let placedColor = [(p.rgb & (255 << 0)) >> 0, (p.rgb & (255 << 8)) >> 8, (p.rgb & (255 << 16)) >> 16];
                    if (this.whitelist[p.id]) this.setPixel(p.x, p.y, placedColor);
                    let pixel = this.queue[`${p.x},${p.y}`];
                    if (pixel) {
                        this.checkMove = true;
                        pixel.placed = false;
                        this.moveQueue[`${Math.floor(p.x / 16)},${Math.floor(p.y / 16)}`] = true;
                        this.chunkQueue[`${pixel.cx},${pixel.cy}`].placed = false;
                        this.chunkQueue[`${pixel.cx},${pixel.cy}`].t = new Date().getTime();
                        this.updateBorder(p.x, p.y);
                    }
                }
            }.bind(this));
            OWOP.on(OWOP.events.net.world.leave, function () {
                // OWOP.sounds.play(OWOP.sounds.launch);
                this.disable();
                console.log(arguments, "leave");
            }.bind(this));
            OWOP.on(OWOP.events.net.world.join, function () {
                this.enable();
                console.log(arguments, "join");
            }.bind(this));
        }
        moveToNext() {
            if (!this.autoMove) return;
            if (!this.checkMove) return;
            for (let e in this.moveQueue) {
                if (this.moveQueue[e]) {
                    let [x, y] = e.split(",");
                    for (let i = 0; i < 16; i++) {
                        for (let j = 0; j < 16; j++) {
                            let p = this.queue[`${x * 16 + i},${y * 16 + j}`];
                            if (p)
                                if (!p?.placed) return OWOP.emit(29, x * 16, y * 16);
                        }
                    }
                    this.moveQueue[e] = false;
                }
            }
            this.checkMove = false;
        }
        updateBorder(x, y) {
            let p = this.border[`${x},${y}`];
            if (!p) p = this.border[`${x},${y}`] = new BPoint(x, y);

            let t = this.border[`${x},${y - 1}`];
            let l = this.border[`${x - 1},${y}`];
            let b = this.border[`${x},${y + 1}`];
            let r = this.border[`${x + 1},${y}`];

            if (!t) t = new BPoint(x, y - 1);
            if (!l) l = new BPoint(x - 1, y);
            if (!b) b = new BPoint(x, y + 1);
            if (!r) r = new BPoint(x + 1, y);
            if (BPoint.check(t, p, "bottom") && (t.bottom || t.right)) this.border[`${x},${y - 1}`] = t;
            if (BPoint.check(l, p, "right") && (l.bottom || l.right)) this.border[`${x - 1},${y}`] = l;
            if (BPoint.check(p, b, "bottom") && (b.bottom || b.right)) this.border[`${x},${y + 1}`] = b;
            if (BPoint.check(p, r, "right") && (r.bottom || r.right)) this.border[`${x + 1},${y}`] = r;
        }
        undo() {
            if (!this.enabled) return;
            if (!this.undoStack.length) return;
            let actionList = this.undoStack.pop();
            for (let index in actionList) {
                let action = actionList[index];
                if (!this.queue[`${action.x},${action.y}`] && (delete actionList[index], true)) continue;
                this.setPixel(action.x, action.y, action.undo().rgb);
            }
            if (!Object.keys(actionList).length) {
                this.undo();
                return;
            }
            this.redoStack.push(actionList);
        }
        redo() {
            if (!this.enabled) return;
            if (!this.redoStack.length) return;
            let actionList = this.redoStack.pop();
            for (let index in actionList) {
                let action = actionList[index];
                if (!this.queue[`${action.x},${action.y}`] && (delete actionList[index], true)) continue;
                this.setPixel(action.x, action.y, action.redo().rgb);
            }
            if (!Object.keys(actionList).length) {
                this.redo();
                return;
            }
            this.undoStack.push(actionList);
        }
        startHistory() {
            this.record = true;
        }
        endHistory() {
            if (!this.record) return;
            this.record = false;
            if (Object.keys(this.actionStack).length) this.undoStack.push(this.actionStack);
            this.actionStack = {};
            this.redoStack = [];
        }
        enable() {
            this.enabled = true;
        }
        disable() {
            this.enabled = false;
        }
        clearQueue() {
            this.queue = {};
            this.chunkQueue = {};
            this.moveQueue = {};
            this.border = {};
        }
        unsetPixel(x, y) {
            if (this.queue[`${x},${y}`]) this.deletePixel(new Point(x, y));
            return true;
        }
        deletePixel(p) {
            delete this.queue[`${p.x},${p.y}`];
            this.chunkQueue[`${p.cx},${p.cy}`].deletePixel(p);
            let found = undefined;
            // ! MARK FOR DELETION
            // i can remove this if i develop the chunks system to manage movequeue
            for (let i = 0; i < 16; i++) {
                for (let j = 0; j < 16; j++) {
                    found = this.queue[`${p.cx * 16 + i},${p.cy * 16 + j}`];
                    if (found) break;
                }
                if (found) break;
            }
            if (!found) delete this.moveQueue[`${p.cx},${p.cy}`];
            this.updateBorder(p.x, p.y);
        }
        setPixel(x, y, c, placeOnce = false) {
            if (!this.enabled) return OWOP.world.setPixel(x, y, c);
            if (!Number.isInteger(x) || !Number.isInteger(y)) return false;
            if (!Array.isArray(c) || c.length < 3 || c.length > 4) return false;
            if (c.length === 4) c.pop();
            if (c.find(e => !Number.isInteger(e) || e < 0 || e > 255) !== undefined) return false;
            let p = new Pixel(x, y, c, placeOnce);
            if (!NS.PM.ignoreProtectedChunks && OWOP.misc._world.protectedChunks[`${p.cx},${p.cy}`]) return false;
            if (this.record) {
                let stack = this.actionStack[`${x},${y}`];
                if (!(stack instanceof Action)) {
                    let beforePixel = new Pixel(x, y, this.getPixel(x, y, 1));
                    if (beforePixel.c !== p.c) this.actionStack[`${x},${y}`] = new Action(beforePixel, p);
                } else {
                    stack.after_color = c;
                }
            }
            this.queue[`${p.x},${p.y}`] = p;
            if (!this.chunkQueue[`${p.cx},${p.cy}`]) this.chunkQueue[`${p.cx},${p.cy}`] = new Chunk(p);
            this.chunkQueue[`${p.cx},${p.cy}`].setPixel(p);
            this.moveQueue[`${p.cx},${p.cy}`] = true;
            this.updateBorder(p.x, p.y);
            this.checkMove = true;
            return true;
        }
        getPixel(x, y, a = true) {
            if (!Number.isInteger(x) || !Number.isInteger(y)) return console.error("There is no inputs in \"getPixel\" on PixelManager instance.");
            if (a && this.queue[`${x},${y}`]?.c?.rgb) return this.queue[`${x},${y}`].c.rgb;
            try {
                OWOP.world.getPixel;
            } catch (e) {
                return undefined;
            }
            return OWOP.world.getPixel(x, y);
        }
        placePixel() {
            if (OWOP.player.rank > 1 && this.enableMod) {
                let cx = Math.floor(OWOP.mouse.tileX / 16);
                let cy = Math.floor(OWOP.mouse.tileY / 16);
                for (let i = 0; i < this.extra.chunkPlaceData.length; i++) {
                    let e = this.extra.chunkPlaceData[i][1];
                    let xchunk = cx + e.x;
                    let ychunk = cy + e.y;
                    let currentChunk = this.chunkQueue[`${xchunk},${ychunk}`];
                    if (!currentChunk || currentChunk.placed || (new Date().getTime() - currentChunk.t) <= 1) continue;
                    let k = !OWOP.net.protocol.setChunk(xchunk, ychunk, currentChunk.data);
                    if (k) break;
                    for (let p of currentChunk.pixels) {
                        if (!p) continue;
                        p.placed = true;
                    }
                    currentChunk.placed = true;
                }
            } else {
                for (let i = 0; i < this.extra.placeData.length; i++) {
                    let e = this.extra.placeData[i][1];
                    let tX = OWOP.mouse.tileX;
                    let tY = OWOP.mouse.tileY;
                    let p = this.queue[`${tX + e.x},${tY + e.y}`];
                    if (!p) continue;
                    if (!NS.PM.ignoreProtectedChunks && OWOP.misc._world.protectedChunks[`${p.cx},${p.cy}`]) continue;
                    let xcc = Math.floor(tX / 16) * 16;
                    let ycc = Math.floor(tY / 16) * 16;
                    if (p.x < (xcc - 31) || p.y < (ycc - 31) || p.x > (xcc + 46) || p.y > (ycc + 46)) continue;
                    let c = this.getPixel(p.x, p.y, 0);
                    if (!c) continue;
                    if (p.c.int !== Color.toInt(c)) {
                        if (!p.placed) {
                            if (!(p.placed = OWOP.world.setPixel(p.x, p.y, p.c.rgb))) break;
                        } else {
                            if (!p.time) p.time = new Date().getTime();
                            if (new Date().getTime() - p.time > 0.25e3) {
                                if (p.g) {
                                    p.g = false;
                                    p.placed = false;
                                    p.time = 0;
                                } else {
                                    let c = Color.fromInt(Math.floor(Math.random() * 16777215));
                                    OWOP.world.setPixel(p.x, p.y, c);
                                    p.g = true;
                                    p.time = new Date().getTime();
                                }
                            }
                        }
                    } else if ((p.o && this.deletePixel(p), p.placed = true)) continue;
                }
            }
            this.moveToNext();
        }
    }

    // mouse down, mouse up, mouse move, tick, player join, player leave, pixel placed
    class EventEmitter {
        constructor(name = "Emitter") {
            this.table = {};
            this.name = name;
        }
        on(eventName, callBack) {
            let temp = this.table[eventName];
            if (temp) temp.push(callBack);
            else this.table[eventName] = [callBack];
            log("green", `added event ${eventName} to ${this.name}`);
        }
        emitQuiet(eventName, ...args) {
            this.table[eventName]?.forEach((callBack) => callBack(...args));
        }
        emit(eventName, ...args) {
            log("cyan", eventName, this.table[eventName], args);
            this.table[eventName]?.forEach((callBack) => callBack(...args));
            log("white", `emitted event ${eventName} using ${this.name}`);
        }
    }

    class Tool {
        constructor(name, rank, _callback) {
            this.name = name || Math.floor(Math.random() * 1000 + "");
            // this.cursorblob = cursor.img.shadowblob;
            // this.cursor = cursor.img.shadowed;
            // this.setposition = (-cursor.imgpos[0] * 36) + "px " + (-cursor.imgpos[1] * 36) + "px";
            // this.offset = cursor.hotspot;
            this.rank = rank;
            this.events = [];
            this.fxRenderer = null;
        }
        setFxRenderer(func) {
            this.fxRenderer = func;
        }
        setEvent(type, func) {
            let events = type.split(' ');
            for (let i = 0; i < events.length; i++) {
                this.events[events[i]] = func || null;
            }
        }
    }

    // for making the plain window without features
    class _NSWindows {
        static base() {
            undefined;
        }
    }

    class GUIWindow {
        constructor(title, options = { close: true, lock: true, minimize: false }, initfunc) {
            if (!title) throw Error("Title Required");
            this.title = title;
            this.options = options;
            this.frame = document.createElement("div");
            this.container = document.createElement("div");
            this.settings = NS.localStorage.settings[title];
            if (!this.settings) {
                this.settings = { x: window.innerWidth / 3, y: window.innerHeight / 3 };
            }
            this.x = this.settings.x;
            this.y = this.settings.y;
            this.move(this.x, this.y);
            this.container.className = "wincontainer";
            if (this.title) {
                this.titlespan = document.createElement("span");
                this.titlespan.innerHTML = title;
                this.titlespan.classList.add("windowtitle");
                this.frame.appendChild(this.titlespan);
            }
            this.frame.appendChild(this.container);
            if (this.options.centered) {
                this.options.immobile = !0;
                this.frame.className = "centered";
            }
            this.currentaction = null;
            if (initfunc) initfunc(this);
            if (this.options.centerOnce) {
                this.move(window.innerWidth / 2 - this.realw / 2 | 0, window.innerHeight / 2 - this.realh / 2 | 0);
            }
            this.listeners = [this.mdownfunc.bind(this), this.mupfunc.bind(this), this.mmovefunc.bind(this)];
            this.frame.addEventListener("mousedown", this.listeners[0]);
            window.addEventListener("mouseup", this.listeners[1]);
            window.addEventListener("mousemove", this.listeners[2]);
            this.onclose = undefined;
            this.onlock = undefined;
            this.onminimize = undefined;
            let count = 0;
            if (this.options.close) {
                if (this.settings.closed === undefined) {
                    // this.settings.closed = false;
                }
                this.closed = false;
                this.windowbutton = document.createElement("button");
                this.windowbutton.classList.add("optionButton");
                this.windowbutton.innerHTML = this.settings.closed ? "off" : "on";
                this.windowbutton.onclick = this.toggleclose.bind(this);
                this.closeButton = document.createElement("button");
                this.closeButton.classList.add("ns_button");
                this.closeButton.style["right"] = count * 23 + "px";
                this.closeButton.style["background-image"] = `url(${NS.dataImages.close})`;
                this.closeButton.onclick = this.toggleclose.bind(this);
                this.toggleclose();
                this.frame.appendChild(this.closeButton);
                count++;
            }
            if (this.options.lock) {
                if (this.settings.locked === undefined) {
                    // this.settings.locked = false;
                }
                this.locked = false;
                this.lockButton = document.createElement("button");
                this.lockButton.classList.add("ns_button");
                this.lockButton.style["right"] = count * 23 + "px";
                this.lockButton.style["background-image"] = `url(${NS.dataImages.lock})`;
                this.lockButton.onclick = this.togglelock.bind(this);
                this.frame.appendChild(this.lockButton);
                count++;
            }
            if (this.options.minimize) {
                if (this.settings.minimized === undefined) {
                    // this.settings.minimized = false;
                }
                this.minimized = false;
                this.minimizeButton = document.createElement("button");
                this.minimizeButton.classList.add("ns_button");
                this.minimizeButton.style["right"] = count * 23 + "px";
                this.minimizeButton.style["background-image"] = `url(${NS.dataImages.minimize})`;
                this.minimizeButton.onclick = this.toggleminimize.bind(this);
                this.frame.appendChild(this.minimizeButton);
                count++;
            }
            OWOP.elements.windows.appendChild(this.frame);
            NS.localStorage.settings[this.title] = this.settings;
            localStorage.NS = JSON.stringify(NS.localStorage);
        }
        show() {
            this.visible = true;
            this.frame.style.visibility = "visible";
            return this;
        }
        hide() {
            this.visible = false;
            this.frame.style.visibility = "hidden";
            return this;
        }
        close() {
            OWOP.elements.windows.removeChild(this.frame);
        }
        toggleVisibility() {
            this.visible = !this.visible;
            this.visible ? this.frame.style.visibility = "visible" : this.frame.style.visibility = "hidden";
            return this;
        }
        toggleclose() {
            if (this.options.close) {
                if (this.closed) {
                    this.closed = false;
                    this.windowbutton.classList.add("on");
                    this.windowbutton.innerHTML = "on";
                    this.show();
                    if (onclose) onclose();
                } else {
                    this.closed = true;
                    this.windowbutton.classList.remove("on");
                    this.windowbutton.innerHTML = "off";
                    this.hide();
                    if (onclose) onclose();
                }
            }
            return this;
        }
        togglelock() {
            if (this.options.lock) {
                if (this.locked) {
                    this.locked = false;
                    this.lockButton.style["background-image"] = `url(${NS.dataImages.lock})`;
                    this.options.immobile = false;
                } else {
                    this.locked = true;
                    this.lockButton.style["background-image"] = `url(${NS.dataImages.unlock})`;
                    this.options.immobile = true;
                }
            }
            return this;
        }
        toggleminimize() {
            if (this.options.minimize) {
                if (this.minimized) {
                    this.minimized = false;
                    this.minimizeButton.style["background-image"] = `url(${NS.dataImages.minimize})`;
                    document.getElementById("optionsMaximize").style = "display: none;";
                    document.getElementById("optionsMinimize").style = "display: flex;";
                } else {
                    this.minimized = true;
                    this.minimizeButton.style["background-image"] = `url(${NS.dataImages.maximize})`;
                    document.getElementById("optionsMaximize").style = "display: flex;";
                    document.getElementById("optionsMinimize").style = "display: none;";
                }
            }
            return this;
        }
        addObj(e) {
            this.container.appendChild(e);
            return this;
        }
        move(x, y) {
            if (!this.options.immobile) {
                this.frame.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                this.x = x;
                this.y = y;
            }
            return this;
        }
        mdownfunc(e) {
            let t = e.clientX - this.x;
            let n = e.clientY - this.y;
            if (e.target === this.frame) {
                this.currentaction = function (e, o) {
                    e = e <= 0 ? 0 : e > window.innerWidth ? window.innerWidth : e, o = o <= 0 ? 0 : o > window.innerHeight ? window.innerHeight : o;
                    this.move(e - t, o - n);
                }
            }
        }
        mupfunc(_e) {
            if (!this.options.immobile) {
                this.settings.x = this.x;
                this.settings.y = this.y;
                NS.localStorage.settings[this.title] = this.settings;
                localStorage.NS = JSON.stringify(NS.localStorage);
            }
            this.currentaction = null;
        }
        mmovefunc(e) {
            if (this.currentaction) this.currentaction(e.clientX, e.clientY);
        }
        get realw() {
            return this.frame.offsetWidth;
        }
        get realh() {
            return this.frame.offsetHeight;
        }
    }

    const base64 = {
        // modified from https://stackoverflow.com/questions/6213227/fastest-way-to-convert-a-number-to-radix-64-in-javascript
        fromNumber: function (number) {
            let residual = number;
            let result = '';
            let digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";
            while (residual !== 0) {
                result = digits.charAt(residual % digits.length) + result;
                residual = Math.floor(residual / digits.length);
            }
            return result;
        }
    }

    const dataImages = {
        "area protect": undefined,
        copy: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABS0lEQVRYw+2XMQ6CMBSGfwxH8CIOEg2bkx2cOYhxJs6Ggzg74ORGNGXwIt5BpxrAAn3PVzWGPzEpaMLH199CgSFD/iwB5cerSXznXORwLQJxIC4MFYoMpLKUBJKvtySo0JeRaqZRhFJrrCbxvQ8qkIZpGszXW0yjCABQat1rqhNoVxxJMJt4+QJVnTKXToXSf1uVpTUrKktx2+cAgHGiWgFNRj7WEpWlKLXGOFFPEDNml5qbqoGqKQMmBnS6nAEAi9n85diMd8Wxdn4TL53NkIEMiO24bQyg1h8RIHPHNjtNQzZgcUPNO+6z9W5CSndsJmzfvQNIMtR1ISlLIxdD5tPsj0tu+/xZbC8dopqgltrLSv2RUncV+HQ5185/rNR90yhRbJahr05Z2wrNediKAXFAuC/8rA753AaFLq+kP7FRlNp1UOwMGfKXeQBOJJ69p18KUgAAAABJRU5ErkJggg==",
        cursor: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAA00lEQVRYw+3YMQ6DMAwFUPPFhTpCRxaW3qYzQ9f2Nl1YGIGRI8ENShz7W6mEZxwe34kUIXKVoR63+x79TpSGQmlJobTxJYHe8xiGSk4oCgXNwxEoaBvYKOQ0MVHIbew/AwWVDeqaloKCdQFvlAnUNa07Cl5Re6HguSE9UPA+tlaUO8iKMoGmdXFHURKyoJCTxLQuP9OxoGrLeMbnS31H/25zRRmZFpN686ytmLMvpp8yJkYNYmNUoAiMiEil3YBMjHpkbIwKFIFJBkVhivz7cdXf1QFBsW2mhPMCDAAAAABJRU5ErkJggg==",
        eraser: undefined,
        export: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABCklEQVRYw+2YMQ6CQBBFP4QL2Ql02mDhadQWg+3iaSzcRrsVO4+k1RCNhB3RHdZkfzUJBW//Z4YBIOjPFAHAcpLfpW54uJmoF0gShgOVULHYbwEAs2kKADhfm5/Xm7ywR0YOKaNxvjZOnTmuKqtDsVRM5JJNLZBrd7iKPz3BUHEPHCILkXkdGc0dryIjKG8iU0bjuKr86jJlNOs9Jtplymi/ugwAirqEbf8SHYzzNLNCiUXGdSruGmAE9209BMr5ClvUJeZpBgA4NZe363q9e1nanC/55ESfnqEiVyB0yC4gAhi97W0wh5uJkjFgvFjyOTBiQFyYtstcPtTcT2hRh7gwzjXGf4MgcT0AtrSSgUtEfWEAAAAASUVORK5CYII=",
        fill: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABjUlEQVRYw+2YsW7DIBCGAfWFMhgpZezCkreJVw9Z7bfpwpLRiYSHPlI6XYSviLszWG2lnJQhGJNP//3HQZR6xT8LzZ14OrgHHvv8mvWvAOVg9oLTXBg/DavxcL7sAqU5MOMcVO/86lln7er7EmMTKC2FwSAYqBbKtICBgLRyPMcG2grTCspwJlEwS4wr09dAaUodjmfgnev9lq1EiaeMRJklxufHT8NTCT8N6nq/qY/je3X63jiTQI3cXpSOAVSqlJ8GFc4XdTq4B0cpQ4FgNVKYcQ4/3qlVylAVg0EwDP7xWqgsUO+8GueQbQ+QpjQtLaGMpCRznmkNpUtdHW+OufRhGFz68Jy7JZhSt4bUlWC2KiVOGRg69VPOU62hWB7qnVedtaqzdncokamXGKuhqJZipDCcKEHlTF+lEO7sUiiq4YqAqGqjoDjdnw0Ei5T8U4KC/YxqsCKFtkJxYUignMRSKOkhTewhCVTzE+NWqHRXl16JNHV1phYsHSW23M+KF0Xughhqjz8hXvFn4xvHckf64m/UhgAAAABJRU5ErkJggg==",
        line: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABEUlEQVRYw+2XvRGEIBCFkbEDKzGQxAZITK3E2OBiKzG9hAYuweAqsQYvWofjVOB4GPESHRdmP/cHV8aysrLSqrgydnW70f3z/Sp8bUmATIc+QkFx1wI5jUxO48/zRgjWCAFPWem78AhqnRUciLtSoIbHoX2dFVu0vg/IpaqXXykLrTk4EEHJadzBEFBlzGY7bYhO4662p7e3C1gNDziMd8ooEgRlwlH33VZDi9Z7JOxrIwRbZwWFcrb91dlDYEiooLzb3y+7zqpe7ufWvzUVvKmr2810hoaCdAYSCjY2oKBgQCgoKBACCg4UC5UEKAYqGdARlHmYnkHxlEDkNGSQSxqhs+EN+ZcSBYWaCLKysmL0AfZSsN1jloZVAAAAAElFTkSuQmCC",
        move: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABgklEQVRYw+2YvU7EMAzH/055CYZj6IJ0243Q8ZYs9zbcWgErfZtbTkgdGNqOtyM2Ft7imHKK0g/nw4Ui4S1K7Pzi2q4TQEB2m+K82xRnCVskAWOPD6eGfg3IwLw0RwDAvtDJUCQFYyQViiRhJKBIGiYVilICmPNQTKCrEKCYTxCqo+bcIOYACguTvwMk9SsIta2mFDiofaFRd+1lXHdtL8NCbVOKZ3zTPiTwVUzRAwBdlVFz7mFcB1BMBfYB9l3rVvTMhtFViXy1mjSQrXN2TcjabJ3j4/UNt9c3j+9fn09kwwDA9u7+R9PcJMXx4RkAcDW2YG4wOzt7MeR6iRNf2LFNXTHeOZwaUnZAmQkf5ZCNfGF6dcj2FGdMV+Wop+qu9dJ3YRZZGIn71wy1EPa87SnXM5zu0Lyaoub6GZMEdddeAphLDM62kmyuJBq3/wZNHCgkC2OaPDUXTKxO9EWRy6ahojf7VXoMKhZG5LHBhUqBEXuOMVCpMIt8sBK7Z0nd474B40/4pg5xCDEAAAAASUVORK5CYII=",
        paste: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABQ0lEQVRYw+2Yvw6CMBDGr4QXYpBA2Jx04GmMs3E2Po2DTmwEggOPhFOTUtvSa6/FGC4xacuf/vjuu1IE2CJg1Fk11Vk1Ud6T+cCI/cfYslWARJDj/QIAAM/TlQyM+cBwELHtC8VsU2JSxTSOhUwwMCoAuY19QDlS08Fdns/672HQQmGucwZSTaRLiQ4GGyn2At8JnTy0ZqAUwnghWspu7Qt1/rk6/F7KeDXalH40D9lCpTFg5KWizqpJt3J7ATV9BwAA+6L86vP2rX3Nxpc85QXEQVR9XZu8ykQlVOrICpkegAxIdWOTWkHXIZ1XVIAqJYMrZJrIRaXEVSH+k/0T/dVB6Zf/e9uryl5n4KbvZuPRTL2URmw6yRRa3UP7oiQFsVLItEOkLPVFoMfYMtO+JYQy6E9p6n85dPsh52/7EDBb2MQHK+ObZIdb/JMAAAAASUVORK5CYII=",
        pipette: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABAUlEQVRYw+3XvQ6CMBQF4FPiCzHQRDu6uPA2zg6u+jYuLI5ogoOPhFOTpnL7Y3ovDj0jIeRLzyEEoKaGTt+auW/NHLpHSUH8a7f3qFYBuZhOawDAa5pIlJLAWIgbCrXhrmYJI7KhHEyosqYUyH14p3X2ybBtKLSb2OkUB/m1+agYhmVDh+sJADAcz8mvevENWcxlHLDf7uDCLCQ1TUkMANyfD3I37KAQxlYWq6jYhnIxfWvmFJz6l5P5GcSJyQZxY7JAEphkkBQmCSSJiYKkMUHQGhgS5H8o3XBisj8d3JhFkF+VJOarMhdjN2MhEhiysrUw5Aml/GGKgHyUNKampkQ+wWnd9v+Wv9QAAAAASUVORK5CYII=",
        protect: undefined,
        write: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABTUlEQVRYw+2XPW6DQBCFHyNu4JOktF26oUnrk7hO4TY5CW2abbY0SEvhk3AGp8miMcGEmVmMLPEa/0iGx3xvZsfAqlU2ZdYLvL/tb/zz9/WSLWaobyaFqcxq5vPiAAC+rgAA7nQ2maIU3KOZFKKUZtrSLWOoj8udzh2q4utjNF+zVsjXVWcEAJoQlkcWA2xtd7UhjmsoM23pTNjIgmsIkRWb2tBYR1m6jbS4YiV4duL7JgQ1NrLOntQiC66hzorfabGRBdeYtNhyCy7tNJ59MD59QeO4fF3hsN3dVeyw3d299iVZSXINrv5NfV2hLR38b5g3x6IL9eZYiCokzhA/TP8ohp2FvhAaIgkuTStLz7ZcgmtoOv/3ME0IoiqRZomf44+BqO05Lsnew6d2xJZkDj1aNaZK8luaGkyrpl6DJE+oWVP5SvKSR8eqVVb9AMXs1T0X1uPeAAAAAElFTkSuQmCC",
        zoom: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABMUlEQVRYw+3Wuw6CMBQG4L+NL+SIjgyy+CSuujo4u/ISri4wdFQTHFx9CScS1zrVNFCgdzThJCRcGvrlHHooMMWfBfH5svV8yVX3z48LiQrqgtjAiE9M14Q6Y7yVSEyWs5I/33XryFnJVeODYVQQGSFHzkoeBCW/VAdigqIuMBnAblds0hWJ3idU2dHJjG6WqCvQd2acQb7LRPFjQV3LZRNpsggDsimX6QIwXmmm8XzX4fpQiOxQm+zI57olyFnJ02SB3TLr/ckSG0x23AMAiu0B8rXqmxIQAIMYI1AT8zoVAIB7VX3HiGfN1SQgOtsP4oJpgqJs0HQwYqLgW1gTTPBN/hiYTtBYGCVoTMxgY4yNaWVIzs4YGACY9WVG7jExMJ2gZrOLhen9qGNDppjCV3wAmp0jyCb9nC4AAAAASUVORK5CYII=",
        untitled1: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACeElEQVRYw+2XsWsaYRiHH6VRSyGBEwepi5nsIFToWKUKDoVkyl/QIQhZRMdCJqGj0kUoGRw6FqcIGY4qnI6BBBwiFCqBKzcUDxoieMlgB/NdYtN6Z7yzGfyBy3eIj8/3vu/3HayyQGKvPoyX/ZvexwblfWymLIEMrb1UKFuGQk+PMLT2UqC8Vnb0UReAyOblUqBmAumjLlIgDkClpZhQ0edvx/9ty/zhJACdoWFC+cNJ10zNBJICcbR+FYDXz/wU0il2GrKrNeW1siO2rDM0AKhvZam0FPD1XIHy2ml5YUikkE6RPz0DX8/xkWBpSHSZMFRpKaapL9++YwwOHDU1E0jrV80tE+kMDXYa8j1TTkFZFrUwJKIcqrd1BHx8+YJESXYMynIOhaN7f31WSKdMqJP97FRNLTKnbLe9SGo7MgWVKMmmKSlTxhgcLDSnLA3d3SqAz8WjyfmWqxHK1UhtR0wovVk0obR+9UFQnlkPhfrI5iU7DZn6VpZQrsZ5q4veLP7ze4mSzMl+Fq5i6KMuvwaqx3GgUK7Gz0/vqLQUCumUaenPnLdurerNIlzF8IeT9I7fexYG2ghGxlIgDr4e+dMz6ltZAFRVRcqUZ1qammfBXbR+1ZYp222vHKqo6uSTKMnmv9cvrtEvruEqNrER3DXXxZqhtQlH92zVlOVpLwaj2AopU+Zr/s0E5OZ6IsD1Ude8Q4lxIaa9obVtFbplDemjLtL6GlKmPFUXIv0fRx4czBN7F7TePZh5u8eRLtsIRsYA0vraZOGmjaVA3HEzc9fQ3ZpxC8a+oTsnvpswtl+DROu7DTPXli0DxrYhN7rpQRE1tMoqM/Ibi49haAcCegQAAAAASUVORK5CYII=",
        close: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsElEQVQ4T2P0NbT+z0ABYAQZYGikSLYRcAN0HXTBhlw+cBmvYejqMAzAZwhM8/sPnxieXHgItgjFCzAF2AxB1rx53gEGmLcxwgCbIbg0Y7gA5nlkQ2BiIGcj2wwTxxkLyIbg0ozTBSAJdFfgih2sLkD2s6AAHzxasRmCMxCRnY0vdrBGIzY/4zIEIyHhCzC8CQkkiU8zLCBkDOTBTFiUkpWZzp+7DzYElBrJMgA5twEAg7WDTc6lEvYAAAAASUVORK5CYII=",
        lock: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlUlEQVQ4T2P0NbT+z0ABYAQZYGikSLYRGAboOujiNezygcso8igGwDS///AJqyGCAnxgcWRDMAwAad487wBWA+KK/HAbgGw7yABs4YKs5smFh2DD4C4AScJsxxeo6OqoawCxcYnsUhQXIBuAHJiwwIPJk2QAKDzQ08YgNUDGQJ7YMASrg6UVlJR4/tx9kgwBhQ/FuREA5HeVTcn2o+EAAAAASUVORK5CYII=",
        unlock: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T2P0NbT+z0ABYAQZYGikSLYRJBug66CLYhlJBsA0v//wCW4IyQaANG+ed4ByA2DhRrYLMAxADxx80QLyxpMLD8FK4C7AZgAssAQF+FDMg4UDyBU4DUAOrLgiP/INANmC7jqSXEA/A2QM5EnKD6DEhBKIIN3nz90nyRAMA0jSDVUMACJmfc6GilMFAAAAAElFTkSuQmCC",
        // unlock: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAmUlEQVQ4T2P0NbT+z0ABYAQZYGikSLYRGAboOujiNezygcso8igGwDS///AJqyGCAnxgcWRDMAwAad487wBWA+KK/Ig3AFu4ILvwyYWHYMMwwuD8ufsM+AIVZAjMlSB1JMcCTgMIhT5yoGB1AboByIEJCzyYISQZAPInLsNRwgCfIvoYIGMgT1J+ACU2jGgEpQFSAFnpAN0CABDLjE20xQVBAAAAAElFTkSuQmCC",
        minimize: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWUlEQVQ4T2P0NbT+z0ABYAQZYGikSLYRowYwMFAvDHQddImOifcfPjE8ufAQrB7uAhkDeaINACncPO8AAyj6Ubxw/tx9kgzBMIAk3VDF1AtEcmxHCcShawAAyRMvTcpPIeAAAAAASUVORK5CYII=",
        maximize: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAdUlEQVQ4T2P0NbT+z0ABYAQZYGikSLYReA3QddBleP/hE8OTCw9xWkCUAZvnHWDA5crhZAAowIgFyAELDwMZA3kM/YICfOBYwAZgAYsSiOfP3UdRG1fkBzYApBgbAMXMcIoFbH6EBSzZKRFkKCxgyUrKxKQLAOW9bk2mvNgoAAAAAElFTkSuQmCC"
    }

    const cursors = {
        cursor: { icon: dataImages.cursor, hotspot: [7, 2] },
        move: { icon: dataImages.move, hotspot: [18, 18] },
        pipette: { icon: dataImages.pipette, hotspot: [3, 31] },
        zoom: { icon: dataImages.zoom, hotspot: [22, 13] },
        export: { icon: dataImages.export, hotspot: [0, 3] },
        fill: { icon: dataImages.fill, hotspot: [6, 32] },
        line: { icon: dataImages.line, hotspot: [6, 6] },
        paste: { icon: dataImages.paste, hotspot: [5, 2] },
        copy: { icon: dataImages.copy, hotspot: [5, 5] },
        write: { icon: dataImages.write, hotspot: [17, 8] }
    }

    const textData = {}

    textData.newText = {
        data: {
            gap: 1,
            space: 1,
            height: 8,
            bottom: 6
        },
        " ": {
            width: 1,
            height: 8,
            skip: 0,
            text: "00000000"
        },
        "'": {
            width: 1,
            height: 2,
            skip: 1,
            text: "11"
        },
        "\"": {
            width: 3,
            height: 2,
            skip: 1,
            text: "101101"
        },
        "?": {
            width: 3,
            height: 5,
            skip: 1,
            text: `110001010000010`
        },
        "!": {
            width: 1,
            height: 5,
            skip: 1,
            text: `11101`
        },
        ",": {
            width: 1,
            height: 2,
            skip: 5,
            text: `11`
        },
        ".": {
            width: 1,
            height: 1,
            skip: 5,
            text: `1`
        },
        "&": {
            width: 3,
            height: 5,
            skip: 1,
            text: `010101010101011`
        },
        "[": {
            width: 2,
            height: 5,
            skip: 1,
            text: `1110101011`
        },
        "]": {
            width: 2,
            height: 5,
            skip: 1,
            text: `1101010111`
        },
        "{": {
            width: 3,
            height: 5,
            skip: 1,
            text: `011010110010011`
        },
        "}": {
            width: 3,
            height: 5,
            skip: 1,
            text: `110010011010110`
        },
        "(": {
            width: 2,
            height: 5,
            skip: 1,
            text: `0110101001`
        },
        ")": {
            width: 2,
            height: 5,
            skip: 1,
            text: `1001010110`
        },
        "/": {
            width: 3,
            height: 5,
            skip: 1,
            text: `001001010100100`
        },
        "\\": {
            width: 3,
            height: 5,
            skip: 1,
            text: `100100010001001`
        },
        ":": {
            width: 1,
            height: 3,
            skip: 2,
            text: `101`
        },
        ";": {
            width: 1,
            height: 4,
            skip: 3,
            text: `1011`
        },
        "+": {
            width: 3,
            height: 3,
            skip: 2,
            text: `010111010`
        },
        "-": {
            width: 3,
            height: 1,
            skip: 3,
            text: `111`
        },
        "*": {
            width: 3,
            height: 3,
            skip: 2,
            text: `101010101`
        },
        "%": {
            width: 3,
            height: 5,
            skip: 1,
            text: `101001010100101`
        },
        "$": {
            width: 3,
            height: 7,
            skip: 0,
            text: `010111100010001111010`
        },
        ">": {
            width: 3,
            height: 5,
            skip: 1,
            text: `100010001010100`
        },
        "<": {
            width: 3,
            height: 5,
            skip: 1,
            text: `001010100010001`
        },
        "_": {
            width: 3,
            height: 1,
            skip: 5,
            text: `111`
        },
        "=": {
            width: 3,
            height: 3,
            skip: 2,
            text: `111000111`
        },
        "0": {
            width: 3,
            height: 5,
            skip: 1,
            text: "111101101101111"
        },
        "1": {
            width: 3,
            height: 5,
            skip: 1,
            text: "010110010010111"
        },
        "2": {
            width: 3,
            height: 5,
            skip: 1,
            text: "111001111100111"
        },
        "3": {
            width: 3,
            height: 5,
            skip: 1,
            text: "111001111001111"
        },
        "4": {
            width: 3,
            height: 5,
            skip: 1,
            text: "101101111001001"
        },
        "5": {
            width: 3,
            height: 5,
            skip: 1,
            text: "111100111001111"
        },
        "6": {
            width: 3,
            height: 5,
            skip: 1,
            text: "111100111101111"
        },
        "7": {
            width: 3,
            height: 5,
            skip: 1,
            text: "111001001001001"
        },
        "8": {
            width: 3,
            height: 5,
            skip: 1,
            text: "111101111101111"
        },
        "9": {
            width: 3,
            height: 5,
            skip: 1,
            text: "111101111001111"
        },
        a: {
            width: 3,
            height: 3,
            skip: 3,
            text: "011101011"
        },
        b: {
            width: 3,
            height: 5,
            skip: 1,
            text: `100100110101110`
        },
        c: {
            width: 3,
            height: 3,
            skip: 3,
            text: `011100011`
        },
        d: {
            width: 3,
            height: 5,
            skip: 1,
            text: `001001011101011`
        },
        e: {
            width: 3,
            height: 3,
            skip: 3,
            text: `010110011`
        },
        f: {
            width: 2,
            height: 5,
            skip: 1,
            text: `0110111010`
        },
        g: {
            width: 3,
            height: 5,
            skip: 3,
            text: `011101011001110`
        },
        h: {
            width: 3,
            height: 5,
            skip: 1,
            text: `100100110101101`
        },
        i: {
            width: 1,
            height: 5,
            skip: 1,
            text: `10111`
        },
        j: {
            width: 2,
            height: 7,
            skip: 1,
            text: `01000101010110`
        },
        k: {
            width: 3,
            height: 5,
            skip: 1,
            text: `100100101110101`
        },
        l: {
            width: 2,
            height: 5,
            skip: 1,
            text: `1010101001`
        },
        m: {
            width: 5,
            height: 3,
            skip: 3,
            text: `111101010110101`
        },
        n: {
            width: 3,
            height: 3,
            skip: 3,
            text: `110101101`
        },
        o: {
            width: 3,
            height: 3,
            skip: 3,
            text: `010101010`
        },
        p: {
            width: 3,
            height: 5,
            skip: 3,
            text: `110101110100100`
        },
        q: {
            width: 3,
            height: 5,
            skip: 3,
            text: `011101011001001`
        },
        r: {
            width: 2,
            height: 3,
            skip: 3,
            text: `111010`
        },
        s: {
            width: 3,
            height: 3,
            skip: 3,
            text: `011010110`
        },
        t: {
            width: 2,
            height: 5,
            skip: 1,
            text: `1010111001`
        },
        u: {
            width: 3,
            height: 3,
            skip: 3,
            text: `101101011`
        },
        v: {
            width: 3,
            height: 3,
            skip: 3,
            text: `101101010`
        },
        w: {
            width: 5,
            height: 3,
            skip: 3,
            text: `101011010101010`
        },
        x: {
            width: 3,
            height: 3,
            skip: 3,
            text: `101010101`
        },
        y: {
            width: 3,
            height: 5,
            skip: 3,
            text: `101101011001010`
        },
        z: {
            width: 3,
            height: 3,
            skip: 3,
            text: `110010011`
        },
        A: {
            width: 3,
            height: 5,
            skip: 1,
            text: "010101111101101"
        },
        B: {
            width: 3,
            height: 5,
            skip: 1,
            text: `110101110101110`
        },
        C: {
            width: 3,
            height: 5,
            skip: 1,
            text: `011100100100011`
        },
        D: {
            width: 3,
            height: 5,
            skip: 1,
            text: `110101101101110`
        },
        E: {
            width: 3,
            height: 5,
            skip: 1,
            text: `111100111100111`
        },
        F: {
            width: 3,
            height: 5,
            skip: 1,
            text: `111100111100100`
        },
        G: {
            width: 3,
            height: 5,
            skip: 1,
            text: `011100101101011`
        },
        H: {
            width: 3,
            height: 5,
            skip: 1,
            text: `101101111101101`
        },
        I: {
            width: 3,
            height: 5,
            skip: 1,
            text: `111010010010111`
        },
        J: {
            width: 3,
            height: 5,
            skip: 1,
            text: `111001001001110`
        },
        K: {
            width: 3,
            height: 5,
            skip: 1,
            text: `101101110101101`
        },
        L: {
            width: 3,
            height: 5,
            skip: 1,
            text: `100100100100111`
        },
        M: {
            width: 5,
            height: 5,
            skip: 1,
            text: `1000111011101011000110001`
        },
        N: {
            width: 4,
            height: 5,
            skip: 1,
            text: `10011101101110011001`
        },
        O: {
            width: 3,
            height: 5,
            skip: 1,
            text: `010101101101010`
        },
        P: {
            width: 3,
            height: 5,
            skip: 1,
            text: `110101110100100`
        },
        Q: {
            width: 3,
            height: 6,
            skip: 1,
            text: `010101101101010001`
        },
        R: {
            width: 3,
            height: 5,
            skip: 1,
            text: `110101110101101`
        },
        S: {
            width: 3,
            height: 5,
            skip: 1,
            text: `011100010001110`
        },
        T: {
            width: 3,
            height: 5,
            skip: 1,
            text: `111010010010010`
        },
        U: {
            width: 3,
            height: 5,
            skip: 1,
            text: `101101101101111`
        },
        V: {
            width: 3,
            height: 5,
            skip: 1,
            text: `101101101101010`
        },
        W: {
            width: 5,
            height: 5,
            skip: 1,
            text: `1000110101101011010101010`
        },
        X: {
            width: 3,
            height: 5,
            skip: 1,
            text: `101101010101101`
        },
        Y: {
            width: 3,
            height: 5,
            skip: 1,
            text: `101101010010010`
        },
        Z: {
            width: 3,
            height: 5,
            skip: 1,
            text: `111001010100111`
        }
    }

    textData.cyrillic = {
        'а': {
            width: 3,
            height: 4,
            skip: 2,
            text: `010101111101`
        },
        'б': {
            width: 3,
            height: 4,
            skip: 2,
            text: `111100111111`
        },
        'в': {
            width: 3,
            height: 4,
            skip: 2,
            text: `110111101110`
        },
        'г': {
            width: 3,
            height: 4,
            skip: 2,
            text: `111100100100`
        },
        'д': {
            width: 4,
            height: 4,
            skip: 2,
            text: `0110011011111001`
        },
        'е': {
            width: 3,
            height: 4,
            skip: 2,
            text: `111110100111`
        },
        'ё': {
            width: 3,
            height: 6,
            skip: 0,
            text: `101000111110100111`
        },
        'ж': {
            width: 5,
            height: 4,
            skip: 2,
            text: `10101011100111010101`
        },
        'з': {
            width: 3,
            height: 4,
            skip: 2,
            text: `111011001111`
        },
        'и': {
            width: 3,
            height: 4,
            skip: 2,
            text: `101101101011`
        },
        'й': {
            width: 3,
            height: 7,
            skip: -1,
            text: `100010000101101111101`
        },
        'к': {
            width: 3,
            height: 4,
            skip: 2,
            text: `101110101101`
        },
        'л': {
            width: 3,
            height: 4,
            skip: 2,
            text: `010101101101`
        },
        'м': {
            width: 5,
            height: 4,
            skip: 2,
            text: `10001110111010110001`
        },
        'н': {
            width: 3,
            height: 4,
            skip: 2,
            text: `101111101101`
        },
        'о': {
            width: 3,
            height: 4,
            skip: 2,
            text: `010101101010`
        },
        'п': {
            width: 3,
            height: 4,
            skip: 2,
            text: `111101101101`
        },
        'р': {
            width: 3,
            height: 4,
            skip: 2,
            text: `110101110100`
        },
        'с': {
            width: 3,
            height: 4,
            skip: 2,
            text: `111100100111`
        },
        'т': {
            width: 3,
            height: 4,
            skip: 2,
            text: `111010010010`
        },
        'у': {
            width: 3,
            height: 4,
            skip: 2,
            text: `101101010100`
        },
        'ф': {
            width: 5,
            height: 4,
            skip: 2,
            text: `01110101010111000100`
        },
        'х': {
            width: 3,
            height: 4,
            skip: 2,
            text: `101010010101`
        },
        'ц': {
            width: 4,
            height: 5,
            skip: 2,
            text: `10101010101011100011`
        },
        'ч': {
            width: 3,
            height: 4,
            skip: 2,
            text: `101101111001`
        },
        'ш': {
            width: 5,
            height: 4,
            skip: 2,
            text: `10101101011010111111`
        },
        'щ': {
            width: 6,
            height: 5,
            skip: 2,
            text: `101010101010101010111110000011`
        },
        'ъ': {
            width: 3,
            height: 4,
            skip: 2,
            text: `110010011011`
        },
        'ы': {
            width: 4,
            height: 4,
            skip: 2,
            text: `1001100111011101`
        },
        'ь': {
            width: 2,
            height: 4,
            skip: 2,
            text: `10101111`
        },
        'э': {
            width: 3,
            height: 4,
            skip: 2,
            text: `110011001110`
        },
        'ю': {
            width: 4,
            height: 4,
            skip: 2,
            text: `1011111110111011`
        },
        'я': {
            width: 3,
            height: 4,
            skip: 2,
            text: `011101011101`
        },
        'А': {
            width: 3,
            height: 5,
            skip: 1,
            text: `010101111101101`
        },
        'Б': {
            width: 3,
            height: 5,
            skip: 1,
            text: `111100111101110`
        },
        'В': {
            width: 3,
            height: 5,
            skip: 1,
            text: `110101110101110`
        },
        'Г': {
            width: 3,
            height: 5,
            skip: 1,
            text: `111100100100100`
        },
        'Д': {
            width: 5,
            height: 5,
            skip: 1,
            text: `0111001010010101111110001`
        },
        'Е': {
            width: 3,
            height: 5,
            skip: 1,
            text: `111100111100111`
        },
        'Ё': {
            width: 3,
            height: 7,
            skip: -1,
            text: `101000111100111100111`
        },
        'Ж': {
            width: 5,
            height: 5,
            skip: 1,
            text: `1010110101011101010110101`
        },
        'З': {
            width: 4,
            height: 5,
            skip: 1,
            text: `01101001001010010110`
        },
        'И': {
            width: 4,
            height: 5,
            skip: 1,
            text: `10011001101111011001`
        },
        'Й': {
            width: 4,
            height: 8,
            skip: -2,
            text: `01000010000010011001101111011001`
        },
        'К': {
            width: 3,
            height: 5,
            skip: 1,
            text: `101101110101101`
        },
        'Л': {
            width: 3,
            height: 5,
            skip: 1,
            text: `010101101101101`
        },
        'М': {
            width: 5,
            height: 5,
            skip: 1,
            text: `1000111011101011000110001`
        },
        'Н': {
            width: 3,
            height: 5,
            skip: 1,
            text: `101101111101101`
        },
        'О': {
            width: 3,
            height: 5,
            skip: 1,
            text: `010101101101010`
        },
        'П': {
            width: 3,
            height: 5,
            skip: 1,
            text: `111101101101101`
        },
        'Р': {
            width: 3,
            height: 5,
            skip: 1,
            text: `110101110100100`
        },
        'С': {
            width: 3,
            height: 5,
            skip: 1,
            text: `111100100100111`
        },
        'Т': {
            width: 3,
            height: 5,
            skip: 1,
            text: `111010010010010`
        },
        'У': {
            width: 3,
            height: 5,
            skip: 1,
            text: `101101010010100`
        },
        'Ф': {
            width: 5,
            height: 5,
            skip: 1,
            text: `0010001110101010111000100`
        },
        'Х': {
            width: 3,
            height: 5,
            skip: 1,
            text: `101101010101101`
        },
        'Ц': {
            width: 4,
            height: 6,
            skip: 1,
            text: `101010101010101011100011`
        },
        'Ч': {
            width: 3,
            height: 5,
            skip: 1,
            text: `101101111001001`
        },
        'Ш': {
            width: 5,
            height: 5,
            skip: 1,
            text: `1010110101101011010111111`
        },
        'Щ': {
            width: 6,
            height: 6,
            skip: 1,
            text: `101010101010101010101010111110000011`
        },
        'Ъ': {
            width: 4,
            height: 5,
            skip: 1,
            text: `11000100011101010111`
        },
        'Ы': {
            width: 5,
            height: 5,
            skip: 1,
            text: `1000110001111011010111101`
        },
        'Ь': {
            width: 3,
            height: 5,
            skip: 1,
            text: `100100111101111`
        },
        'Э': {
            width: 4,
            height: 5,
            skip: 1,
            text: `01101001001110010110`
        },
        'Ю': {
            width: 5,
            height: 5,
            skip: 1,
            text: `1011110101111011010110111`
        },
        'Я': {
            width: 3,
            height: 5,
            skip: 1,
            text: `011101011101101`
        }
    }

    const browser = !(new Function("return this"))().global;

    NS = {
        // classes
        Point,
        BPoint,
        Color,
        RGBRotate,
        Pixel,
        Chunk,
        Action,
        PixelManager,
        GUIWindow,
        // functions
        rangeMap,
        clamp,
        degToRad,
        radToDeg,
        modulo,
        line,
        mkHTML,
        setImageData,
        getImageData,
        // objects
        M0: undefined,
        M13: undefined,
        M14: undefined,
        M19: undefined,
        M20: undefined,
        M21: undefined,
        PM: undefined,
        localStorage: browser ? (localStorage.NS ? JSON.parse(localStorage.NS) : {}) : undefined,
        base64,
        dataImages,
        cursors,
        browser: browser,
        node: !browser,
        modules: [],
        NSmodules: [],
        players: {},
        windows: {},
        installed: false
    }

    const EE = new EventEmitter("EE");

    (function () {
        const originalAddEventListener = EventTarget.prototype.addEventListener;

        let wheelEventName = ('onwheel' in document) ? 'wheel' : ('onmousewheel' in document) ? 'mousewheel' : 'DOMMouseScroll';
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            if (type !== wheelEventName) {
                originalAddEventListener.call(this, type, listener, options);
            } else {
                if (options.NS) {
                    originalAddEventListener.call(this, type, listener, options);
                } else {
                }
            }
        };
    })();

    const PM = new PixelManager();
    NS.PM = PM;

    (function () {
        document.addEventListener("mousemove", e => EE.emitQuiet("mousemove", e));
    })();

    // (function () {
    //     const normalInterval = setInterval;
    //     setInterval = function(handler, timeout = 1000, ...args) {
    //         console.log(handler);
    //         normalInterval(handler, timeout, ...args);
    //     }
    // })();

    const EXPORTS = {
        NS,
        PM,
        EE,
        Point,
        BPoint,
        Color,
        Pixel,
        Chunk,
        Action,
        EventEmitter,
        PixelManager,
        Tool,
        GUIWindow,
        textData
    }

    NS.EXPORTS = EXPORTS;

    if (NS.browser && window) window.NS = NS;

    return EXPORTS;
})();

function install() {
    // eslint-disable-next-line no-unused-vars
    const { NS, PM, EE, Point, Color, GUIWindow, Tool, NS: { modulo, line, mkHTML, dataImages, players }, textData } = IMPORTS;

    // event stuff
    ((true) && !function () {
        if (document.getElementById("dev-chat")) document.getElementById("dev-chat").parentNode.removeChild(document.getElementById("dev-chat")); // im so pissed at devchat for screaming at me every time i press a single letter while typing out something in the console its so annoying. thats why its the first thing i delete.

        NS.installed = true;
        NS.keysdown = [];
        NS.extra = {};
        NS.extra.log = false;

        const KeyCode = {
            // Alphabet
            a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73,
            j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82,
            s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90,

            // Numbers (Top row)
            zero: 48, one: 49, two: 50, three: 51, four: 52,
            five: 53, six: 54, seven: 55, eight: 56, nine: 57,

            // Special characters and symbols
            backtick: 192, tilde: 192, dash: 189, underscore: 189,
            equals: 187, plus: 187, leftBracket: 219, leftCurly: 219,
            rightBracket: 221, rightCurly: 221, backslash: 220, pipe: 220,
            semicolon: 186, colon: 186, quote: 222, doubleQuote: 222,
            comma: 188, lessThan: 188, period: 190, greaterThan: 190,
            slash: 191, question: 191, exclamation: 49, at: 50,
            hash: 51, dollar: 52, percent: 53, caret: 54,
            ampersand: 55, asterisk: 56, leftParen: 57, rightParen: 48,

            // Function keys
            f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117,
            f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123,

            // Control keys
            enter: 13, space: 32, escape: 27, backspace: 8, tab: 9,
            shift: 16, ctrl: 17, alt: 18, capsLock: 20, pause: 19,

            // Navigation keys
            insert: 45, home: 36, delete: 46, end: 35,
            pageUp: 33, pageDown: 34,

            // Arrow keys
            arrowUp: 38, arrowDown: 40, arrowLeft: 37, arrowRight: 39,

            // Numpad keys
            numpad0: 96, numpad1: 97, numpad2: 98, numpad3: 99,
            numpad4: 100, numpad5: 101, numpad6: 102, numpad7: 103,
            numpad8: 104, numpad9: 105,
            numpadMultiply: 106, numpadAdd: 107, numpadSubtract: 109,
            numpadDecimal: 110, numpadDivide: 111, numpadEnter: 13
        };
        function keydown(event) {
            let e = event.which || event.keyCode;
            if (
                !(e >= 112 && e <= 123) &&
                "TEXTAREA" !== document.activeElement.tagName &&
                "INPUT" !== document.activeElement.tagName &&
                e !== KeyCode.arrowUp &&
                e !== KeyCode.arrowDown &&
                e !== KeyCode.arrowLeft &&
                e !== KeyCode.arrowRight
            ) {
                event.preventDefault();
                event.stopPropagation();
            }
            if ("TEXTAREA" !== document.activeElement.tagName && "INPUT" !== document.activeElement.tagName) {
                NS.keysdown[e] = !0;
                let n = OWOP.player.tool;
                if (undefined !== OWOP?.world && n?.isEventDefined("keydown") && n?.call("keydown", [NS.keysdown, event, true])) return !1;
                switch (e) {
                    case KeyCode.p:
                        OWOP.player.tool = "pipette";
                        break;
                    case KeyCode.m:
                    case KeyCode.q:
                        OWOP.player.tool = "move";
                        break;
                    case KeyCode.o:
                        OWOP.player.tool = "cursor";
                        break;
                    case KeyCode.c:
                        // OWOP.player.tool = "eraser";
                        break;
                    case KeyCode.e:
                        OWOP.player.tool = "export";
                        break;
                    case KeyCode.f:
                        OWOP.player.tool = "fill";
                        break;
                    case KeyCode.l:
                        OWOP.player.tool = "line";
                        break;
                    case KeyCode.p:
                        OWOP.player.tool = "protect";
                        break;
                    // case KeyCode.a:
                    //     OWOP.player.tool = "area protect";
                    //     break;
                    case KeyCode.h:
                        // make options window open/close
                        // options window will include options to switch the behavior of the tools, the game, and open/close all windows
                        break;
                    case KeyCode.g:
                        OWOP.renderer.showGrid(!OWOP.renderer.gridShown);
                        break;
                    case KeyCode.z:
                        if (!event.ctrlKey) {
                            OWOP.player.tool = "zoom";
                            break;
                        }
                        NS.PM.undo(event.shiftKey);
                        event.preventDefault();
                        break;
                    case KeyCode.y:
                        if (!event.ctrlKey) break;
                        NS.PM.redo(event.shiftKey);
                        event.preventDefault();
                        break;
                    case KeyCode.f1: // f1
                        event.preventDefault();
                        break;
                    case KeyCode.numpadAdd:
                        ++OWOP.camera.zoom;
                        break;
                    case KeyCode.numpadSubtract:
                        --OWOP.camera.zoom;
                        break;
                    // case KeyCode.l:
                    //     NS.extra.log = !NS.extra.log;
                    //     break;
                    case KeyCode.escape: // Esc
                        NS.teleport.camera = {};
                        break;
                    case KeyCode.tilde:
                        let userInput = prompt("Custom color\nType three values separated by a comma: r,g,b\n(...or the hex string: #RRGGBB)\nYou can add multiple colors at a time separating them with a space.");
                        if (!userInput) {
                            break;
                        }
                        userInput = userInput.split(' ');
                        for (let j = 0; j < userInput.length; j++) {
                            let elementInput = userInput[j];
                            elementInput = elementInput.split(',');
                            let rgb = null;
                            if (elementInput.length == 3) {
                                rgb = elementInput;
                                for (let i = 0; i < elementInput.length; i++) {
                                    elementInput[i] = +elementInput[i];
                                    if (!(elementInput[i] >= 0 && elementInput[i] < 256)) {
                                        return null;
                                    }
                                }
                            } else if (elementInput[0] == '#' && elementInput.length == 7) {
                                let hexColor = parseInt(elementInput.replace('#', '0x'));
                                /* The parsed HTML color doesn't have red as the first byte, so invert it. */
                                rgb = [hexColor >> 16 & 0xFF, hexColor >> 8 & 0xFF, hexColor & 0xFF];
                            }
                            if (rgb) OWOP.player.selectedColor = rgb;
                        }
                        break;
                }
                (NS.extra.log && console.log(event));
            }
        }
        function keyup(event) {
            let e = event.which || event.keyCode;
            delete NS.keysdown[e];
            if (document.activeElement.tagName !== "INPUT") {
                let n = OWOP.player.tool;
                if (undefined !== OWOP?.world && n?.isEventDefined("keyup") && n?.call("keyup", [NS.keysdown, event])) return !1;
                switch (event.key) {
                    case "Enter":
                    case "`":
                        document.getElementById("chat-input").focus();
                        break;
                }
            }
        }
        window.addEventListener("keydown", keydown, true);
        window.addEventListener("keyup", keyup);

        NS.PM.setup();

        OWOP.tool = OWOP.tools;

        if (!NS.localStorage.cursors) {
            NS.localStorage.cursors = NS.cursors;
            localStorage.NS = JSON.stringify(NS.localStorage);
        }
        if (!NS.localStorage.settings) {
            NS.localStorage.settings = {};
            localStorage.NS = JSON.stringify(NS.localStorage);
        }
        if (!NS.localStorage.settings["Options"]) {
            NS.localStorage.settings["Options"] = { x: 117, y: 60 };
            localStorage.NS = JSON.stringify(NS.localStorage);
        }
    }());

    if (!NS.installed) return;

    // change render player
    ((false) && !function () {
        let camera = undefined;
        let rendererValues = undefined;
        let tools = undefined;
        let id = undefined;
        let drawText = undefined;
        function renderPlayer(targetPlayer, fontsize) {
            let camx = camera.x * 16;
            let camy = camera.y * 16;
            let zoom = camera.zoom;
            let ctx = rendererValues.animContext;
            let cnvs = ctx.canvas;
            let tool = targetPlayer.tool;
            if (!tool) {
                /* Render the default tool if the selected one isn't defined */
                tool = tools['cursor'];
            }
            let toolwidth = tool.cursor.width / 16 * zoom;
            let toolheight = tool.cursor.height / 16 * zoom;

            let x = targetPlayer.x;
            let y = targetPlayer.y;
            let cx = ((x - camx) - tool.offset[0]) * (zoom / 16) | 0;
            let cy = ((y - camy) - tool.offset[1]) * (zoom / 16) | 0;

            if (cx < -toolwidth || cy < -toolheight || cx > cnvs.width || cy > cnvs.height) {
                return true;
            }


            if (fontsize > 3) {
                let text = undefined;
                if (players) {
                    let nick = players.list[id].nick;
                    text = nick ? `[${id}] ${nick}` : id;
                } else text = id;

                let textw = ctx.measureText(text).width + (zoom / 2);

                ctx.globalAlpha = 1;
                ctx.fillStyle = targetPlayer.clr;
                ctx.fillRect(cx, cy + toolheight, textw, zoom);
                ctx.globalAlpha = 0.2;
                ctx.lineWidth = 3;
                ctx.strokeStyle = "#000000";
                ctx.strokeRect(cx, cy + toolheight, textw, zoom);
                ctx.globalAlpha = 1;
                drawText(ctx, text, cx + zoom / 4, cy + fontsize + toolheight + zoom / 8);
            }

            ctx.drawImage(tool.cursor, cx, cy, toolwidth, toolheight);

            return x === targetPlayer.endX && y === targetPlayer.endY;
        }
        void renderPlayer;
    }());

    // tool icons
    ((true) && !function () {
        function holeify(img) {
            let canvas = document.createElement("canvas");
            let shadowcolor = 0xFF3B314D;
            let backgroundcolor = 0xFF5C637E;
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            let idat = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let u32dat = new Uint32Array(idat.data.buffer);
            let clr = (x, y) => {
                return (x < 0 || y < 0 || x >= idat.width || y >= idat.height) ? 0 : u32dat[y * idat.width + x];
            };
            for (let i = u32dat.length; i--;) {
                if (u32dat[i] !== 0) {
                    u32dat[i] = backgroundcolor;
                }
            }
            for (let y = idat.height; y--;) {
                for (let x = idat.width; x--;) {
                    if (clr(x, y) === backgroundcolor && (!clr(x, y - 1) || !clr(x - 1, y)) && !clr(x - 1, y - 1)) {
                        u32dat[y * idat.width + x] = shadowcolor;
                    }
                }
            }
            for (let y = idat.height; y--;) {
                for (let x = idat.width; x--;) {
                    if (clr(x, y - 1) === shadowcolor && clr(x - 1, y) === shadowcolor) {
                        u32dat[y * idat.width + x] = shadowcolor;
                    }
                }
            }
            ctx.putImageData(idat, 0, 0);
            return canvas.toDataURL();
        }
        let iconStyler = document.createElement("style");
        document.getElementById("toole-container").parentElement.appendChild(iconStyler);
        for (let cursor in NS.localStorage.cursors) {
            let cursorURL = NS.localStorage.cursors[cursor].icon;

            iconStyler.innerHTML += `#tool-${cursor}:not(.selected) div { background-image: url("${cursorURL}") !important } `
            let img = new Image();
            img.onload = function () {
                iconStyler.innerHTML += `#tool-${cursor}.selected div { background-image: url("${holeify(img)}") !important } `
            }
            img.src = cursorURL;
        }
        if (false) {
            // fixing all the damn cache issues that i hate cause halloween sucks man i dont want to have to do this again for christmas
            iconStyler.innerHTML += `button { border-image: url("https://www.ourworldofpixels.com/img/button.png") 6 repeat; }`;
            iconStyler.innerHTML += `button:active { border-image: url("https://www.ourworldofpixels.com/img/button_pressed.png") 6 repeat; }`;

            iconStyler.innerHTML += `.wincontainer { border-image: url("https://www.ourworldofpixels.com/img/window_in.png") 6 repeat; }`;
            iconStyler.innerHTML += `#windows > div, .winframe, #help { border-image: url("https://www.ourworldofpixels.com/img/window_out.png") 11 repeat; border-image-outset: 4px; }`;

            iconStyler.innerHTML += `body { background-image: url("https://www.ourworldofpixels.com/img/unloaded.png"); }`;

            iconStyler.innerHTML += `#playercount-display, #xy-display, #palette-create, #palette, .framed, .context-menu { border-image: url("https://www.ourworldofpixels.com/img/small_border.png") 5 repeat; }`;

            document.getElementById("help-button").children[0].src = "https://www.ourworldofpixels.com/img/help.png";
        }
        let mouseStyler = document.createElement("style");
        document.getElementById("viewport").appendChild(mouseStyler);
        {
            let i = NS.localStorage.cursors[OWOP.player.tool.id];
            if (i) mouseStyler.innerHTML = `#viewport { cursor: url("${i.icon}") ${i.hotspot[0]} ${i.hotspot[1]}, pointer !important; }`;
            else mouseStyler.innerHTML = `#viewport { }`;
        }
        let oldFunction = Object.getOwnPropertyDescriptor(OWOP.player, "tool").set;
        Object.defineProperty(OWOP.player, 'tool', {
            set: function (x) {
                let i = NS.localStorage.cursors[x];
                if (i) mouseStyler.innerHTML = `#viewport { cursor: url("${i.icon}") ${i.hotspot[0]} ${i.hotspot[1]}, pointer !important; }`;
                else mouseStyler.innerHTML = `#viewport { }`;
                oldFunction.bind(this)(...arguments);
            }
        });
    }());

    // tools
    ((true) && !function () {
        let camera = OWOP.camera;
        let renderer = OWOP.renderer;
        // ! MARK FOR CHANGE
        // let C = OWOP.require('util/color').colorUtils;
        // let C = NS.colorUtils;
        // ! MARK FOR DELETION
        // if (!localStorage.rSC) localStorage.rSC = JSON.stringify([255, 255, 255]);
        // OWOP.player.rightSelectedColor = JSON.parse(localStorage.rSC);
        OWOP.player.rightSelectedColor = [255, 255, 255];
        const isSame = (a, b) => a && b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
        let drawText = (ctx, str, x, y, centered) => {
            ctx.strokeStyle = "#000000";
            ctx.fillStyle = "#FFFFFF";
            ctx.lineWidth = 2.5;
            ctx.globalAlpha = 0.5;
            centered && (x -= ctx.measureText(str).width >> 1);
            ctx.strokeText(str, x, y);
            ctx.globalAlpha = 1;
            ctx.fillText(str, x, y);
        };
        let setColor = (cursor, color) => {
            if (!color) return;
            if (cursor === 1) {
                OWOP.player.selectedColor = color;
            } else if (cursor === 2) {
                OWOP.player.rightSelectedColor = color;
                // ! MARK FOR DELETION
                // localStorage.rSC = JSON.stringify(OWOP.player.rightSelectedColor);
            }
        };
        let patternSieve = function (x, y, color) {
            let t = NS.pattern[modulo(x, NS.pattern.x)][modulo(y, NS.pattern.y)];
            return [t.on, NS.patternColors ? t.a : color];
        }
        const renderRings = function (fx, ctx, _time) {
            let e = 5;
            let i = fx.extra.player.x;
            let a = fx.extra.player.y;
            let camx = OWOP.camera.x * 16;
            let camy = OWOP.camera.y * 16;
            let zoom = OWOP.camera.zoom;
            let tool = fx.extra.player.tool;
            let defaultLine = ctx.lineWidth;
            let x = ((i - camx) - tool.offset[0] + tool.cursor.width / 2) * (zoom / 16) | 0;
            let y = ((a - camy) - tool.offset[1] + tool.cursor.height / 2) * (zoom / 16) | 0;
            ctx.globalAlpha = 1;
            let v = (6 - zoom) / 5;
            let strokeWidth = zoom > 6 ? zoom : 6 + (10 * v);
            let arcRadius = zoom > 6 ? zoom * e : 30 - (22 * v);

            ctx.beginPath();
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = strokeWidth;
            ctx.arc(x, y, arcRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = strokeWidth * 13 / 16;
            ctx.arc(x, y, arcRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.lineWidth = strokeWidth * 9 / 16;
            ctx.fillStyle = ctx.strokeStyle = fx.extra.player.htmlRgb;
            ctx.arc(x, y, arcRadius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();

            ctx.lineWidth = defaultLine;
            ctx.globalAlpha = 0.8;
        }
        const renderBorder = function (fx, ctx, _time) {
            let t = "#00FF00";
            let e = 1;
            ctx.globalAlpha = 1;
            ctx.strokeStyle = t || fx.extra.player.htmlRgb;
            // ctx.strokeRect(i, j, OWOP.camera.zoom * e, OWOP.camera.zoom * e);
            let oldWidth = ctx.lineWidth;
            ctx.lineWidth = 5;
            for (let k in NS.PM.border) {
                if (NS.PM.border[k].right || NS.PM.border[k].bottom) {
                    let x = NS.PM.border[k].x;
                    let y = NS.PM.border[k].y;
                    if (Point.distance(new Point(OWOP.mouse.tileX, OWOP.mouse.tileY), new Point(x, y)) > (16 * 25)) continue;
                    let i = (Math.floor(x / (e)) * e - OWOP.camera.x) * OWOP.camera.zoom;
                    let j = (Math.floor(y / (e)) * e - OWOP.camera.y) * OWOP.camera.zoom;
                    ctx.beginPath();
                    if (NS.PM.border[k].bottom) {
                        ctx.moveTo(i, j + OWOP.camera.zoom);
                        ctx.lineTo(i + OWOP.camera.zoom, j + OWOP.camera.zoom);
                        ctx.stroke();
                    }
                    if (NS.PM.border[k].right) {
                        ctx.moveTo(i + OWOP.camera.zoom, j);
                        ctx.lineTo(i + OWOP.camera.zoom, j + OWOP.camera.zoom);
                        ctx.stroke();
                    }
                } else delete NS.PM.border[k];
            }
            ctx.lineWidth = oldWidth;
        }
        const someRenderer = (fx, ctx, time, defaultFx = () => 1) => {
            if (!fx.extra.isLocalPlayer) {
                if (fx.visible && NS.PM.renderPlayerRings) {
                    renderRings(fx, ctx, time);
                    return 1;
                }
                return defaultFx(fx, ctx, time);
            }
            if (NS.PM.renderBorder) renderBorder(fx, ctx, time);
            return 0;
        }
        const selectionRenderer = function (tool) {
            return function (fx, ctx, time) {
                if (someRenderer(fx, ctx, time, () => 1)) return 1;
                let exitState = 0;
                let oldlinew = ctx.lineWidth;
                ctx.lineWidth = 1;
                if (tool.extra.end) {
                    let s = tool.extra.start;
                    let e = tool.extra.end;
                    let x = s[0];
                    let y = s[1];
                    let w = e[0];
                    let h = e[1];
                    if (s[0] > e[0]) [w, x] = [x, w];
                    if (s[1] > e[1]) [h, y] = [y, h];
                    if (tool.extra.state.chunkize) {
                        x = Math.floor(x / 16) * 16;
                        y = Math.floor(y / 16) * 16;
                        w = Math.floor(w / 16) * 16 + 16;
                        h = Math.floor(h / 16) * 16 + 16;
                    }
                    w = w - x;
                    h = h - y;
                    x = (x - camera.x) * camera.zoom + 0.5;
                    y = (y - camera.y) * camera.zoom + 0.5;

                    ctx.beginPath();
                    ctx.rect(x, y, w * camera.zoom, h * camera.zoom);
                    ctx.globalAlpha = 1;
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.stroke();
                    ctx.setLineDash([3, 4]);
                    ctx.strokeStyle = "#000000";
                    ctx.stroke();
                    ctx.globalAlpha = 0.25 + Math.sin(time / 500) / 4;
                    ctx.fillStyle = renderer.patterns.unloaded;
                    ctx.fill();
                    ctx.setLineDash([]);
                    let oldfont = ctx.font;
                    ctx.font = "16px sans-serif";
                    let txt = `${!tool.extra.clicking ? tool.extra.text : ""}(${Math.abs(w)}x${Math.abs(h)})`;
                    let txtx = window.innerWidth >> 1;
                    let txty = window.innerHeight >> 1;
                    txtx = Math.max(x, Math.min(txtx, x + w * camera.zoom));
                    txty = Math.max(y, Math.min(txty, y + h * camera.zoom));

                    drawText(ctx, txt, txtx, txty, true);
                    ctx.font = oldfont;
                    ctx.lineWidth = oldlinew;
                } else {
                    let x = fx.extra.player.x;
                    let y = fx.extra.player.y;
                    let fxx = Math.floor(x / 16);
                    let fxy = Math.floor(y / 16);
                    if (tool.extra.state.chunkize) {
                        fxx = Math.floor(fxx / 16) * 16;
                        fxy = Math.floor(fxy / 16) * 16;
                    }
                    fxx -= camera.x;
                    fxy -= camera.y;
                    fxx *= camera.zoom;
                    fxy *= camera.zoom;
                    ctx.beginPath();
                    ctx.moveTo(0, fxy + 0.5);
                    ctx.lineTo(window.innerWidth, fxy + 0.5);
                    ctx.moveTo(fxx + 0.5, 0);
                    ctx.lineTo(fxx + 0.5, window.innerHeight);

                    //ctx.lineWidth = 1;
                    ctx.globalAlpha = 1;
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.stroke();
                    ctx.setLineDash([3]);
                    ctx.strokeStyle = "#000000";
                    ctx.stroke();

                    ctx.setLineDash([]);
                    ctx.lineWidth = oldlinew;
                    exitState = 1;
                }
                return exitState;
            }
        }
        const renderSelection = function (tool) {
            return function (mouse, _event) {
                // if (false && tool.extra.state.chunkize) {
                //  x = Math.floor(x / 16) * 16;
                //  y = Math.floor(y / 16) * 16;
                //  w = Math.floor(w / 16) * 16 + 16;
                //  h = Math.floor(h / 16) * 16 + 16;
                // }
                let s = tool.extra.start;
                let e = tool.extra.end;
                const isInside = (s, e) => {
                    let x = s[0];
                    let y = s[1];
                    let w = e[0];
                    let h = e[1];
                    return mouse.tileX >= x && mouse.tileX < w && mouse.tileY >= y && mouse.tileY < h;
                }
                const isCorner = (s, e) => {
                    let x = s[0];
                    let y = s[1];
                    let w = e[0];
                    let h = e[1];
                    let cx = (Math.floor(x) - OWOP.camera.x) * OWOP.camera.zoom;
                    let cy = (Math.floor(y) - OWOP.camera.y) * OWOP.camera.zoom;
                    let cw = (Math.floor(w) - OWOP.camera.x) * OWOP.camera.zoom;
                    let ch = (Math.floor(h) - OWOP.camera.y) * OWOP.camera.zoom;
                    let sizeW = Math.min((cw - cx) / 3, 50);
                    let sizeH = Math.min((ch - cy) / 3, 50);
                    let l = (cx < OWOP.mouse.x) && (OWOP.mouse.x < cx + sizeW);
                    let t = (cy < OWOP.mouse.y) && (OWOP.mouse.y < cy + sizeH);
                    let r = (cw - sizeW < OWOP.mouse.x) && (OWOP.mouse.x < cw);
                    let b = (ch - sizeH < OWOP.mouse.y) && (OWOP.mouse.y < ch);
                    let tl = t && l;
                    let tr = t && r;
                    let bl = b && l;
                    let br = b && r;
                    return (tr && 1) || (br && 2) || (bl && 3) || (tl && 4);
                }
                if (mouse.buttons === 1 && !tool.extra.end) {
                    tool.extra.start = [mouse.tileX, mouse.tileY];
                    tool.extra.clicking = true;
                    tool.setEvent('mousemove', (mouse, _event) => {
                        if (tool.extra.start && mouse.buttons === 1) {
                            tool.extra.end = [mouse.tileX, mouse.tileY];
                            return 1;
                        }
                    });
                    const finish = () => {
                        tool.setEvent('mousemove mouseup deselect', null);
                        tool.extra.clicking = false;
                        let s = tool.extra.start;
                        let e = tool.extra.end;
                        let tmp = undefined;
                        if (e) {
                            if (s[0] === e[0] || s[1] === e[1]) {
                                tool.extra.start = undefined;
                                tool.extra.end = undefined;
                            }
                            if (s[0] > e[0]) {
                                tmp = e[0];
                                e[0] = s[0];
                                s[0] = tmp;
                            }
                            if (s[1] > e[1]) {
                                tmp = e[1];
                                e[1] = s[1];
                                s[1] = tmp;
                            }
                        }
                        renderer.render(renderer.rendertype.FX);
                    }
                    tool.setEvent('deselect', finish);
                    tool.setEvent('mouseup', (mouse, _event) => {
                        if (!(mouse.buttons & 1)) {
                            finish();
                        }
                    });
                } else if (mouse.buttons === 1 && tool.extra.end) {
                    if (isInside(s, e)) {
                        switch (isCorner(s, e)) {
                            case 1: {
                                let offx = mouse.tileX;
                                let offy = mouse.tileY;
                                tool.setEvent('mousemove', (mouse, _event) => {
                                    let dx = mouse.tileX - offx;
                                    let dy = mouse.tileY - offy;
                                    tool.extra.start = [s[0], s[1] + dy];
                                    tool.extra.end = [e[0] + dx, e[1]];
                                    {
                                        let s = tool.extra.start;
                                        let e = tool.extra.end;
                                        if (s[0] > e[0]) [s[0], e[0]] = [e[0], s[0]];
                                        if (s[1] > e[1]) [s[1], e[1]] = [e[1], s[1]];
                                    }
                                });
                                const end = () => {
                                    tool.setEvent('mouseup deselect mousemove', null);
                                }
                                tool.setEvent('deselect', end);
                                tool.setEvent('mouseup', (mouse, _event) => (!(mouse.buttons & 1) && end()));
                            } break;
                            case 2: {
                                let offx = mouse.tileX;
                                let offy = mouse.tileY;
                                tool.setEvent('mousemove', (mouse, _event) => {
                                    let dx = mouse.tileX - offx;
                                    let dy = mouse.tileY - offy;
                                    tool.extra.start = [s[0], s[1]];
                                    tool.extra.end = [e[0] + dx, e[1] + dy];
                                    {
                                        let s = tool.extra.start;
                                        let e = tool.extra.end;
                                        if (s[0] > e[0]) [s[0], e[0]] = [e[0], s[0]];
                                        if (s[1] > e[1]) [s[1], e[1]] = [e[1], s[1]];
                                    }
                                });
                                const end = () => {
                                    tool.setEvent('mouseup deselect mousemove', null);
                                }
                                tool.setEvent('deselect', end);
                                tool.setEvent('mouseup', (mouse, _event) => (!(mouse.buttons & 1) && end()));
                            } break;
                            case 3: {
                                let offx = mouse.tileX;
                                let offy = mouse.tileY;
                                tool.setEvent('mousemove', (mouse, _event) => {
                                    let dx = mouse.tileX - offx;
                                    let dy = mouse.tileY - offy;
                                    tool.extra.start = [s[0] + dx, s[1]];
                                    tool.extra.end = [e[0], e[1] + dy];
                                    {
                                        let s = tool.extra.start;
                                        let e = tool.extra.end;
                                        if (s[0] > e[0]) [s[0], e[0]] = [e[0], s[0]];
                                        if (s[1] > e[1]) [s[1], e[1]] = [e[1], s[1]];
                                    }
                                });
                                const end = () => {
                                    tool.setEvent('mouseup deselect mousemove', null);
                                }
                                tool.setEvent('deselect', end);
                                tool.setEvent('mouseup', (mouse, _event) => (!(mouse.buttons & 1) && end()));
                            } break;
                            case 4: {
                                let offx = mouse.tileX;
                                let offy = mouse.tileY;
                                tool.setEvent('mousemove', (mouse, _event) => {
                                    let dx = mouse.tileX - offx;
                                    let dy = mouse.tileY - offy;
                                    tool.extra.start = [s[0] + dx, s[1] + dy];
                                    tool.extra.end = [e[0], e[1]];
                                    {
                                        let s = tool.extra.start;
                                        let e = tool.extra.end;
                                        if (s[0] > e[0]) [s[0], e[0]] = [e[0], s[0]];
                                        if (s[1] > e[1]) [s[1], e[1]] = [e[1], s[1]];
                                    }
                                });
                                const end = () => {
                                    tool.setEvent('mouseup deselect mousemove', null);
                                }
                                tool.setEvent('deselect', end);
                                tool.setEvent('mouseup', (mouse, _event) => (!(mouse.buttons & 1) && end()));
                            } break;
                            default: {
                                let offx = mouse.tileX;
                                let offy = mouse.tileY;
                                tool.setEvent('mousemove', (mouse, _event) => {
                                    let dx = mouse.tileX - offx;
                                    let dy = mouse.tileY - offy;
                                    tool.extra.start = [s[0] + dx, s[1] + dy];
                                    tool.extra.end = [e[0] + dx, e[1] + dy];
                                });
                                const end = () => {
                                    tool.setEvent('mouseup deselect mousemove', null);
                                }
                                tool.setEvent('deselect', end);
                                tool.setEvent('mouseup', (mouse, _event) => (!(mouse.buttons & 1) && end()));
                            }
                        }
                    } else {
                        tool.extra.start = undefined;
                        tool.extra.end = undefined;
                    }
                } else if (mouse.buttons === 2 && tool.extra.end && isInside(s, e)) {
                    tool.extra.start = undefined;
                    tool.extra.end = undefined;
                    let x = s[0];
                    let y = s[1];
                    let w = e[0];
                    let h = e[1];
                    if (tool.extra.state.chunkize) {
                        x = Math.floor(x / 16) * 16;
                        y = Math.floor(y / 16) * 16;
                        w = Math.floor(w / 16) * 16 + 16;
                        h = Math.floor(h / 16) * 16 + 16;
                    }
                    w -= x;
                    h -= y;
                    switch (tool.name) {
                        case "Export": {
                            let warn = false;
                            switch (tool.extra.state.type) {
                                case "export": {
                                    ((x, y, w, h, onblob) => {
                                        // const width = 32, height = 32;
                                        // const data = new Uint8ClampedArray(width * height * 4);

                                        // let index = 0;
                                        // for (let j = y; j < y + h; j++) {
                                        //     for (let i = x; i < x + w; i++) {
                                        //         let pix = undefined;
                                        //         let tempPix = PM.queue[`${i},${j}`];
                                        //         if (!tempPix) {
                                        //             if ((pix = PM.getPixel(i, j), !pix)) {
                                        //                 warn = true;
                                        //                 pix = [255, 255, 255];
                                        //             }
                                        //         } else {
                                        //             pix = tempPix.c.rgb;
                                        //         }
                                        //         data[index++] = pix[0];
                                        //         data[index++] = pix[1];
                                        //         data[index++] = pix[2];
                                        //         data[index++] = 255;
                                        //     }
                                        // }

                                        // const imageData = new ImageData(data, width, height);

                                        // createImageBitmap(imageData, {
                                        //     imageOrientation: "none",
                                        //     premultiplyAlpha: "none",
                                        // }).then(bitmap => {
                                        //     const c = document.createElement('canvas');
                                        //     c.width = w;
                                        //     c.height = h;
                                        //     const ctx = c.getContext('bitmaprenderer');
                                        //     ctx.transferFromImageBitmap(bitmap);
                                        //     c.toBlob(onblob);
                                        // });

                                        let c = document.createElement('canvas');
                                        c.width = w;
                                        c.height = h;
                                        let ctx = c.getContext('2d');
                                        let d = ctx.createImageData(w, h);
                                        let index = 0;
                                        for (let j = y; j < y + h; j++) {
                                            for (let i = x; i < x + w; i++) {
                                                let pix = undefined;
                                                let tempPix = PM.queue[`${i},${j}`];
                                                if (!tempPix) {
                                                    if ((pix = PM.getPixel(i, j), !pix)) {
                                                        warn = true;
                                                        pix = [255, 255, 255];
                                                    }
                                                } else {
                                                    pix = tempPix.c.rgb;
                                                }
                                                d.data[index++] = pix[0];
                                                d.data[index++] = pix[1];
                                                d.data[index++] = pix[2];
                                                d.data[index++] = 255;
                                            }
                                        }
                                        ctx.putImageData(d, 0, 0);
                                        c.toBlob(onblob);
                                    })(x, y, w, h, b => {
                                        let url = URL.createObjectURL(b);
                                        let img = new Image();
                                        img.onload = () => {
                                            new GUIWindow("Resulting image", {
                                                centerOnce: true,
                                                closeable: true
                                            }, win => {
                                                let props = ['width', 'height'];
                                                if (img.width > img.height) {
                                                    props.reverse();
                                                }
                                                let r = img[props[0]] / img[props[1]];
                                                let shownSize = img[props[1]] >= 128 ? 256 : 128;
                                                img[props[0]] = r * shownSize;
                                                img[props[1]] = shownSize;
                                                //win.container.classList.add('centeredChilds');
                                                //setTooltip(img, "Right click to copy/save!");
                                                img.style = "display:block; margin-left: auto; margin-right: auto; padding-bottom:15px;";
                                                //p1.appendChild(document.createElement("br"));
                                                let closeButton = mkHTML("button", {
                                                    innerHTML: "CLOSE",
                                                    style: "width: 100%; height: 30px; margin: auto; padding-left: 10%;",
                                                    onclick: () => {
                                                        img.remove();
                                                        URL.revokeObjectURL(url);
                                                        win.close();
                                                    }
                                                });
                                                let saveButton = mkHTML("button", {
                                                    innerHTML: "SAVE",
                                                    style: "width: 100%; height: 30px; margin: auto; padding-left: 10%;"
                                                });
                                                saveButton.onclick = () => {
                                                    let a = document.createElement('a');
                                                    a.download = `${NS.base64.fromNumber(Date.now())} OWOP_${OWOP.world.name} at ${s[0]} ${s[1]}.png`;
                                                    a.href = img.src;
                                                    a.click();
                                                }
                                                // ! MARK FOR CHANGE
                                                /*
                                                let scalar = document.createElement("input");
                                                scalar.id = "scalar";
                                                scalar.type = "range";
                                                scalar.style = "width: 100%; margin: auto;";
                                                scalar.value = "1";
                                                scalar.min = "1";
                                                scalar.max = "10";
                                                //<p id="scalar-num" style="margin: auto;top: -8px; right: 12px; user-select: none; color: white;">1</p>
                                                scalar.oninput = () => {
                                                    // scalarNum.textContent = scalar.value;
                                                }
                                                */
                                                win.addObj(img).addObj(saveButton).addObj(closeButton);
                                                // p1.appendChild(scalar);
                                            });
                                        }
                                        img.src = url;
                                    });
                                } break;
                                case "color": {
                                    let test = false;
                                    let totalAdded = 0;
                                    let limit = 50;
                                    for (let i = x; i < x + w; i++) {
                                        for (let j = y; j < y + h; j++) {
                                            if (totalAdded >= limit) continue;
                                            let pix = PM.getPixel(i, j);
                                            if (!pix) continue;
                                            for (let k = 0; k < OWOP.player.palette.length; k++) {
                                                let c = OWOP.player.palette[k];
                                                if (isSame(c, pix)) {
                                                    test = true;
                                                    break;
                                                }
                                            }
                                            if (test) {
                                                test = false;
                                                continue;
                                            }
                                            OWOP.player.palette.push(pix);
                                            totalAdded++;
                                        }
                                    }
                                    OWOP.player.paletteIndex = OWOP.player.palette.length - 1;
                                    if (totalAdded >= limit) OWOP.chat.local(`total colors added limit has been reached (${limit} added)`);
                                } break;
                                case "adder": {
                                    for (let i = x; i < x + w; i++) {
                                        for (let j = y; j < y + h; j++) {
                                            let pix = PM.getPixel(i, j);
                                            if (pix && !PM.queue[`${i},${j}`]) PM.setPixel(i, j, pix);
                                        }
                                    }
                                } break;
                                case "filler": {
                                    let pix = OWOP.player.selectedColor;
                                    PM.startHistory();
                                    for (let i = x; i < x + w; i++) {
                                        for (let j = y; j < y + h; j++) {
                                            if (tool.extra.state.rainbow) {
                                                let pixelColor = undefined;
                                                if ((pixelColor = PM.getPixel(tempx + x1 - offset, tempy + y1 - offset), !pixelColor)) continue;
                                                pix = Color.hue((tempx + x1 - offset) - (tempy + y1 - offset), 8);
                                                if (Color.toInt(pixelColor) === Color.toInt(pix)) continue;
                                            }
                                            PM.setPixel(i, j, pix);
                                        }
                                    }
                                    PM.endHistory();
                                } break;
                                case "clearer": {
                                    for (let i = x; i < x + w; i++) {
                                        for (let j = y; j < y + h; j++) {
                                            if (!!PM.queue[`${i},${j}`]) PM.unsetPixel(i, j);
                                        }
                                    }
                                } break;
                            }
                            if (warn) console.warn("Well something happened, you probably tried getting an area outside of loaded chunks.");
                        } break;
                        case "Copy": {
                            let data = [];
                            for (let j = 0; j < h; j++) {
                                data.push([]);
                                for (let i = 0; i < w; i++) {
                                    let pix = PM.getPixel(x + i, y + j);
                                    if (pix) data[j].push(pix);
                                }
                            }
                            if (tool.extra.tempCallback) {
                                if (tool.extra.tempCallback(data)) {
                                    tool.extra.tempCallback = undefined;
                                    OWOP.player.tool = "move";
                                }
                            } else {
                                OWOP.tool.allTools.paste.extra.k = data;
                                OWOP.player.tool = "paste";
                            }
                        } break;
                        case "Area Protect": {
                            undefined; // intentionally left blank
                        } break;
                    }
                }
            }
        }
        const RECT_SELECT_ALIGNED = function (pixelSize, tool, htmlColor) {
            return function (fx, ctx, _time) {
                if (tool?.extra?.state?.chunkize) pixelSize = 16;
                let x = fx.extra.player.x;
                let y = fx.extra.player.y;
                let fxx = (Math.floor(x / (16 * pixelSize)) * pixelSize - camera.x) * camera.zoom;
                let fxy = (Math.floor(y / (16 * pixelSize)) * pixelSize - camera.y) * camera.zoom;
                ctx.globalAlpha = 0.8;
                ctx.strokeStyle = htmlColor || fx.extra.player.htmlRgb;
                ctx.strokeRect(fxx, fxy, camera.zoom * pixelSize, camera.zoom * pixelSize);
                return 1; /* Rendering finished (won't change on next frame) */
            }
        }
        function setTools() {
            const tools = {
                shape: new Tool("Shape", 1, function () {
                    let sideCount = ~~(Math.random() * 15) + 1; // total vertices on the shape
                    let offset = ~~(Math.random() * sideCount - 1) + 1; // default 1, how many times it should skip vertices to draw a line between
                    sideCount = 6;
                    offset = 1;

                    let start = null;
                    let end = null;
                    function line(x1, y1, x2, y2, plot) {
                        let dx = Math.abs(x2 - x1);
                        let sx = x1 < x2 ? 1 : -1;
                        let dy = -Math.abs(y2 - y1);
                        let sy = y1 < y2 ? 1 : -1;
                        let err = dx + dy
                        let e2 = undefined;

                        while (true) {
                            plot(x1, y1);
                            if (x1 === x2 && y1 === y2) break;
                            e2 = 2 * err;
                            if (e2 >= dy) {
                                err += dy;
                                x1 += sx;
                            }
                            if (e2 <= dx) {
                                err += dx;
                                y1 += sy;
                            }
                        }
                    }
                    function shape(x1, y1, x2, y2, sides, plot) {
                        let sin = Math.sin;
                        let cos = Math.cos;
                        let PI = Math.PI;
                        let l1 = sides;
                        let l2 = (2 * PI) / l1;
                        let someRotationIDFK = 0; // some math stuff for rad to deg conversion if we want it
                        let d2 = someRotationIDFK;
                        let d1 = (l2 / 2) + PI + d2;
                        let s1 = (x2 - x1) / 2;
                        let s2 = (y2 - y1) / 2;
                        let x3 = (x2 + x1) / 2;
                        let y3 = (y2 + y1) / 2;

                        for (let p = 0; p < sides; p++) {
                            let x = sin(d1 + l2 * p) * s1 + x3;
                            let y = cos(d1 + l2 * p) * s2 + y3;
                            let xn = sin(d1 + l2 * (p + offset)) * s1 + x3;
                            let yn = cos(d1 + l2 * (p + offset)) * s2 + y3;
                            line(~~x, ~~y, ~~xn, ~~yn, plot);
                        }
                    }
                    let defaultFx = OWOP.fx.player.RECT_SELECT_ALIGNED(1);
                    this.setFxRenderer((fx, ctx, time) => {
                        ctx.globalAlpha = 0.8;
                        ctx.strokeStyle = fx.extra.player.htmlRgb;
                        if (!start || !end || !fx.extra.isLocalPlayer) {
                            defaultFx(fx, ctx, time);
                        } else {
                            ctx.beginPath();
                            shape(start[0], start[1], end[0], end[1], sideCount, (x, y, _xn, _yn) => {
                                ctx.rect((x - camera.x) * camera.zoom, (y - camera.y) * camera.zoom, camera.zoom, camera.zoom);
                            });
                            ctx.stroke();
                        }
                    });
                    this.setEvent("mousedown", mouse => {
                        if (!(mouse.buttons & 0b100)) {
                            start = [mouse.tileX, mouse.tileY];
                        }
                    });
                    this.setEvent("mouseup", mouse => {
                        if (!(mouse.buttons & 0b11) && !start) {
                            shape(start[0], start[1], mouse.tileX, mouse.tileY, sideCount, (x, y) => {
                                let pixel = mouse.buttons === 1 ? OWOP.player.selectedColor : OWOP.player.rightSelectedColor;
                                OWOP.world.setPixel(x, y, pixel);
                            });
                        }
                    });
                    this.setEvent("deselect", _mouse => {
                        start = null;
                        end = null;
                        this.setEvent("tick", null);
                    });
                })
            }
            OWOP.tool.addToolObject(new OWOP.tool.class('Cursor', OWOP.cursors.cursor, null, 1, tool => {
                (function () {
                    function renderPlayer(fx, ctx, time) {
                        if (NS.PM.renderBorder) renderBorder(fx, ctx, time);
                        RECT_SELECT_ALIGNED(+tool.extra.state.scalar, tool)(fx, ctx, time);
                        return 1;
                    }
                    function renderAmicus(fx, ctx, time) {
                        if (fx.visible && NS.PM.renderPlayerRings) {
                            renderRings(fx, ctx, time);
                            RECT_SELECT_ALIGNED(1)(fx, ctx, time);
                        }
                        return 1;
                    }
                    tool.setFxRenderer((fx, ctx, time) => {
                        if (fx.extra.isLocalPlayer) return renderPlayer(fx, ctx, time);
                        else return renderAmicus(fx, ctx, time);
                    });
                })();
                tool.extra.state = {
                    scalar: "1",
                    rainbow: false,
                    chunkize: false,
                    perfect: false,
                    copyCoords: false
                };
                tool.extra.lastX;
                tool.extra.lastY;
                tool.extra.last1PX;
                tool.extra.last1PY;
                tool.extra.last2PX;
                tool.extra.last2PY;
                tool.extra.start;
                tool.extra.c = 0;
                tool.setEvent('mousedown mousemove', (mouse, event) => {
                    if (mouse.buttons !== 2 && mouse.buttons !== 1) return 3;
                    if (tool.extra.state.copyCoords) return ("👻", navigator.clipboard.writeText(OWOP.mouse.tileX + " " + OWOP.mouse.tileY), 3);
                    if (tool.extra.lastX === mouse.tileX && tool.extra.lastY === mouse.tileY) return 3;
                    if (event?.ctrlKey) return setColor(mouse.buttons, PM.getPixel(mouse.tileX, mouse.tileY));
                    let c = mouse.buttons === 1 ? OWOP.player.selectedColor : OWOP.player.rightSelectedColor;
                    if (isNaN(tool.extra.lastX) || isNaN(tool.extra.lastY)) {
                        tool.extra.lastX = mouse.tileX;
                        tool.extra.lastY = mouse.tileY;
                        tool.extra.last1PX = mouse.tileX;
                        tool.extra.last1PY = mouse.tileY;
                        tool.extra.last2PX = mouse.tileX;
                        tool.extra.last2PY = mouse.tileY;
                        tool.extra.start = true;
                    }
                    PM.startHistory();
                    line(tool.extra.lastX, tool.extra.lastY, mouse.tileX, mouse.tileY, undefined, event, (x, y) => {
                        let tempx = x;
                        let tempy = y;
                        if (tool.extra.state.perfect) {
                            let place = false;
                            // check to place
                            if (tool.extra.start) {
                                tool.extra.start = false;
                                place = true;
                            } else {
                                if (tool.extra.last1PX === x && tool.extra.last1PY === y) {
                                    tool.extra.last2PX = tool.extra.last1PX;
                                    tool.extra.last2PY = tool.extra.last1PY;
                                    tool.extra.last1PX = x;
                                    tool.extra.last1PY = y;
                                    return;
                                }
                            }
                            if (!place) {
                                for (let x1 = -1; x1 < 2; x1++) {
                                    for (let y1 = -1; y1 < 2; y1++) {
                                        if (x1 === 0 && y1 === 0) continue;
                                        if (tool.extra.last2PX === (x + x1) && tool.extra.last2PY === (y + y1)) {
                                            tool.extra.last1PX = x;
                                            tool.extra.last1PY = y;
                                            return;
                                        }
                                    }
                                }
                            }
                            tempx = tool.extra.last1PX;
                            tempy = tool.extra.last1PY;
                        }
                        let size = Number(tool.extra.state.scalar);
                        if (tool.extra.state.chunkize) size = 16;
                        let offset = Math.floor(size / 2);
                        if (tool.extra.state.chunkize) {
                            tempx = Math.floor(tempx / 16) * 16;
                            tempy = Math.floor(tempy / 16) * 16;
                            offset = 0;
                        }
                        for (let x1 = 0; x1 < size; x1++) {
                            for (let y1 = 0; y1 < size; y1++) {
                                if (tool.extra.state.rainbow) {
                                    let pixelColor = undefined;
                                    if ((pixelColor = PM.getPixel(tempx + x1 - offset, tempy + y1 - offset), !pixelColor)) continue;
                                    c = mouse.buttons === 1 ? Color.hue((tempx + x1 - offset) - (tempy + y1 - offset), 8) : Color.hue(tool.extra.c++, 8);
                                    if (Color.toInt(pixelColor) === Color.toInt(c)) continue;
                                }
                                PM.setPixel(tempx + x1 - offset, tempy + y1 - offset, c);
                                // ! MARK FOR DELETION
                                // might be something to do with the border of scaled cursor
                                //[Math.round(OWOP.mouse.worldX/16)-0.5, Math.round(OWOP.mouse.worldY/16)-0.5]
                            }
                        }
                        if (tool.extra.state.perfect) {
                            tool.extra.last2PX = tool.extra.last1PX;
                            tool.extra.last2PY = tool.extra.last1PY;
                            tool.extra.last1PX = x;
                            tool.extra.last1PY = y;
                        }
                    });
                    tool.extra.lastX = mouse.tileX;
                    tool.extra.lastY = mouse.tileY;
                    return 3;
                });
                tool.setEvent('mouseup deselect', () => {
                    PM.endHistory();
                    tool.extra.lastX = undefined;
                    tool.extra.lastY = undefined;
                    tool.extra.last1PX = undefined;
                    tool.extra.last1PY = undefined;
                    tool.extra.last2PX = undefined;
                    tool.extra.last2PY = undefined;
                });
                // change color positions
                tool.setEvent('keydown', keys => {
                    if ((keys["87"] && keys["83"]) || !keys["16"]) return;
                    if (keys["87"]) { // w
                        let i1 = OWOP.player.paletteIndex;
                        let i2 = modulo(i1 - 1, OWOP.player.palette.length);
                        if (i2 === OWOP.player.palette.length - 1) {
                            OWOP.player.palette.push(OWOP.player.palette.shift());
                        } else {
                            [OWOP.player.palette[i1], OWOP.player.palette[i2]] = [OWOP.player.palette[i2], OWOP.player.palette[i1]];
                        }
                        OWOP.player.paletteIndex = i2;
                    }
                    if (keys["83"]) { // s
                        let i1 = OWOP.player.paletteIndex;
                        let i2 = modulo(i1 + 1, OWOP.player.palette.length);
                        if (i2 === 0) {
                            OWOP.player.palette.unshift(OWOP.player.palette.pop());
                        } else {
                            [OWOP.player.palette[i1], OWOP.player.palette[i2]] = [OWOP.player.palette[i2], OWOP.player.palette[i1]];
                        }
                        OWOP.player.paletteIndex = i2;
                    }
                });
            }));
            OWOP.tool.addToolObject(new OWOP.tool.class('Pipette', OWOP.cursors.pipette, null, 0, tool => {
                (function () {
                    function renderPlayer(fx, ctx, time) {
                        if (NS.PM.renderBorder) renderBorder(fx, ctx, time);
                        return 1;
                    }
                    function renderAmicus(fx, ctx, time) {
                        if (fx.visible && NS.PM.renderPlayerRings) {
                            renderRings(fx, ctx, time);
                            RECT_SELECT_ALIGNED(1)(fx, ctx, time);
                        }
                        return 1;
                    }
                    tool.setFxRenderer((fx, ctx, time) => {
                        if (fx.extra.isLocalPlayer) return renderPlayer(fx, ctx, time);
                        else return renderAmicus(fx, ctx, time);
                    });
                })();
                tool.extra.state = {};
                tool.setEvent('mousedown mousemove', mouse => {
                    let c = PM.getPixel(mouse.tileX, mouse.tileY);
                    if (!c) return mouse.buttons;
                    switch (mouse.buttons) {
                        case 1:
                            OWOP.player.selectedColor = c;
                            break;
                        case 2:
                            OWOP.player.rightSelectedColor = c;
                            // ! MARK FOR DELETION
                            // localStorage.rSC = JSON.stringify(OWOP.player.rightSelectedColor);
                            break;
                    }
                    return mouse.buttons;
                });
            }));
            OWOP.tool.addToolObject(new OWOP.tool.class('Export', OWOP.cursors.select, null, 0, tool => {
                tool.extra.state = {
                    type: "export",
                    rainbow: false,
                    chunkize: false
                };
                tool.extra.text = "Right click ";
                tool.extra.start = undefined;
                tool.extra.end = undefined;
                tool.extra.clicking = false;
                tool.setFxRenderer(selectionRenderer(tool));
                tool.setEvent('mousedown', renderSelection(tool));
            }));
            OWOP.tool.addToolObject(new OWOP.tool.class('Fill', OWOP.cursors.fill, null, 1, tool => {
                tool.setFxRenderer((fx, ctx, time) => {
                    let defaultFx = OWOP.fx.player.RECT_SELECT_ALIGNED(1);
                    if (someRenderer(fx, ctx, time, defaultFx)) return;

                    ctx.globalAlpha = 0.8;
                    ctx.strokeStyle = Color.toHex(tool.extra.button === 1 ? OWOP.player.selectedColor : OWOP.player.rightSelectedColor);
                    let z = OWOP.camera.zoom;
                    if (!tool.extra.fillingColor) return defaultFx(fx, ctx, time);
                    ctx.beginPath();
                    for (let current in tool.extra.queue) {
                        current = tool.extra.queue[current];
                        if (tool.extra.state.rainbow) ctx.strokeStyle = Color.toHex(Color.hue(current.x - current.y, 8));
                        let x = current.x
                        let y = current.y;
                        ctx.rect((x - OWOP.camera.x) * z, (y - OWOP.camera.y) * z, z, z);
                    }
                    ctx.stroke();
                    return 0;
                });
                tool.extra.state = {
                    rainbow: false,
                    patterns: false,
                    checkered: false,
                    dither: false,
                    dither2: false,
                    dither3: false,
                    dither4: false,
                    dither5: false,
                    dither6: false
                }
                tool.extra.usedQueue = {};
                tool.extra.queue = {};
                tool.extra.fillingColor = undefined;
                tool.extra.button = 0;
                tool.extra.checkered = 0;
                const isFillColor = (x, y) => isSame(PM.getPixel(x, y), tool.extra.fillingColor) && (!tool.extra.usedQueue[`${x},${y}`]) && (tool.extra.queue[`${x},${y}`] = { x: x, y: y }, true);

                function tick() {
                    let selClr = tool.extra.button === 1 ? OWOP.player.selectedColor : OWOP.player.rightSelectedColor;
                    for (let current in tool.extra.queue) {
                        current = tool.extra.queue[current];
                        let x = current.x;
                        let y = current.y;
                        if (tool.extra.state.rainbow) selClr = Color.hue(x - y, 8);
                        let thisClr = PM.getPixel(x, y);
                        if (isSame(thisClr, tool.extra.fillingColor) && !isSame(thisClr, selClr)) {
                            if (tool.extra.state.patterns) {
                                let pS = patternSieve(x, y, selClr);
                                let pix = PM.getPixel(x, y);
                                if (pS[0]) PM.setPixel(x, y, pS[1]);
                                else if (pix && !PM.queue[`${x},${y}`]) PM.setPixel(x, y, pix);
                            } else {
                                if (tool.extra.state.checkered) {
                                    let pattern = [
                                        [1, 0],
                                        [0, 1]
                                    ];
                                    if (pattern[modulo(x, 2)][modulo(y, 2)]) PM.setPixel(x, y, selClr);
                                } else if (tool.extra.state.dither) {
                                    let pattern = [
                                        [1, 0, 1, 0],
                                        [0, 1, 0, 0],
                                        [1, 0, 1, 0],
                                        [0, 0, 0, 1]
                                    ];
                                    if (pattern[modulo(x, 4)][modulo(y, 4)]) PM.setPixel(x, y, selClr);
                                } else if (tool.extra.state.dither2) {
                                    let pattern = [
                                        [0, 0],
                                        [0, 1],
                                        [0, 0],
                                        [1, 0]
                                    ];
                                    if (pattern[modulo(x, 4)][modulo(y, 2)]) PM.setPixel(x, y, selClr);
                                } else if (tool.extra.state.dither3) {
                                    let pattern = [
                                        [1, 0, 0, 0, 1, 0, 1, 0],
                                        [0, 1, 0, 1, 0, 1, 0, 0],
                                        [1, 0, 1, 0, 0, 0, 1, 0],
                                        [0, 0, 0, 1, 0, 1, 0, 1],
                                        [1, 0, 1, 0, 1, 0, 0, 0],
                                        [0, 1, 0, 0, 0, 1, 0, 1],
                                        [0, 0, 1, 0, 1, 0, 1, 0],
                                        [0, 1, 0, 1, 0, 0, 0, 1]
                                    ];
                                    if (pattern[modulo(x, 8)][modulo(y, 8)]) PM.setPixel(x, y, selClr);
                                } else if (tool.extra.state.dither4) {
                                    let pattern = [
                                        [0, 1, 0, 0],
                                        [1, 1, 0, 0],
                                        [0, 0, 1, 1],
                                        [0, 0, 1, 0]
                                    ];
                                    if (pattern[modulo(x, 4)][modulo(y, 4)]) PM.setPixel(x, y, selClr);
                                } else if (tool.extra.state.dither5) {
                                    let pattern = [
                                        [0, 1, 0, 0, 0, 0, 1, 0],
                                        [1, 1, 0, 0, 0, 0, 1, 1],
                                        [0, 0, 1, 1, 1, 1, 0, 0],
                                        [0, 0, 1, 0, 0, 1, 0, 0],
                                        [0, 0, 1, 0, 0, 1, 0, 0],
                                        [0, 0, 1, 1, 1, 1, 0, 0],
                                        [1, 1, 0, 0, 0, 0, 1, 1],
                                        [0, 1, 0, 0, 0, 0, 1, 0]
                                    ];
                                    if (pattern[modulo(x, 8)][modulo(y, 8)]) PM.setPixel(x, y, selClr);
                                } else if (tool.extra.state.dither6) {
                                    let pattern = [
                                        [0, 1, 1, 0, 0],
                                        [1, 1, 1, 1, 0],
                                        [1, 0, 1, 0, 0],
                                        [1, 0, 1, 1, 0],
                                        [0, 0, 0, 0, 0]
                                    ];
                                    if (pattern[modulo(x, 5)][modulo(y, 5)]) PM.setPixel(x, y, selClr);
                                } else if (tool.extra.state.dither7) {
                                    let pattern = [
                                        [1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
                                        [0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
                                        [1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
                                        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                                        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
                                        [0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
                                        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
                                        [0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
                                        [1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
                                        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0]
                                    ];
                                    if (pattern[modulo(x, 10)][modulo(y, 10)]) PM.setPixel(x, y, selClr);
                                } else if (tool.extra.state.dither8) {
                                    let pattern = [
                                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                                        [0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0],
                                        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                                        [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
                                        [0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0],
                                        [0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
                                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
                                        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0],
                                        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0]
                                    ];
                                    if (pattern[modulo(x, 12)][modulo(y, 12)]) PM.setPixel(x, y, selClr);
                                } else {
                                    PM.setPixel(x, y, selClr);
                                }
                            }

                            let t = isFillColor(x, y - 1);
                            let b = isFillColor(x, y + 1);
                            let l = isFillColor(x - 1, y);
                            let r = isFillColor(x + 1, y);

                            t && l && isFillColor(x - 1, y - 1);
                            t && r && isFillColor(x + 1, y - 1);
                            b && l && isFillColor(x - 1, y + 1);
                            b && r && isFillColor(x + 1, y + 1);
                        }
                        delete tool.extra.queue[`${x},${y}`];
                        tool.extra.usedQueue[`${x},${y}`] = true;
                    }
                }
                tool.setEvent("mousedown", (mouse, event) => {
                    if (event.which !== 1 && event.which !== 3) return;
                    renderer.render(renderer.rendertype.FX);
                    tool.extra.button = event.which;
                    tool.extra.fillingColor = PM.getPixel(mouse.tileX, mouse.tileY);
                    tool.extra.queue[`${mouse.tileX},${mouse.tileY}`] = { x: mouse.tileX, y: mouse.tileY };
                    tool.extra.checkered = (mouse.tileX + mouse.tileY) - 2 * Math.floor((mouse.tileX + mouse.tileY) / 2);
                    PM.startHistory();
                    tool.setEvent("tick", tick);
                });
                tool.setEvent("mouseup deselect", mouse => {
                    PM.endHistory();
                    tool.extra.usedQueue = {};
                    tool.extra.queue = {};
                    tool.extra.fillingColor = undefined;
                    tool.extra.button = 0;
                    tool.extra.checkered = 0;
                    tool.setEvent("tick", null);
                    return mouse && 1 & mouse.buttons;
                });
            }));
            OWOP.tool.addToolObject(new OWOP.tool.class('Line', OWOP.cursors.wand, null, 1, tool => {
                tool.extra.state = {
                    rainbow: false,
                    gradient: false
                };
                tool.extra.start = undefined;
                tool.extra.end = undefined;
                tool.extra.lineLength = 0;
                tool.extra.c = 0;
                tool.setFxRenderer((fx, ctx, time) => {
                    let defaultFx = OWOP.fx.player.RECT_SELECT_ALIGNED(1);
                    if (someRenderer(fx, ctx, time, defaultFx)) return;

                    ctx.globalAlpha = 0.8;
                    ctx.strokeStyle = Color.toHex(tool.extra.button === 1 ? OWOP.player.selectedColor : OWOP.player.rightSelectedColor);
                    if (tool.extra.state.rainbow) ctx.strokeStyle = Color.toHex(Color.hue(~~(time / 100), 8));
                    if ((!tool.extra.start || !tool.extra.end) && (defaultFx(fx, ctx, time), true)) return;
                    if (tool.extra.start) tool.extra.end = [OWOP.mouse.tileX, OWOP.mouse.tileY];
                    tool.extra.lineLength = line(tool.extra.start[0], tool.extra.start[1], tool.extra.end[0], tool.extra.end[1], undefined, undefined, (x, y, i) => {
                        ctx.beginPath();
                        if (tool.extra.state.rainbow) ctx.strokeStyle = Color.toHex(Color.hue(~~(time / 100) + i, 8));
                        ctx.rect((x - camera.x) * camera.zoom, (y - camera.y) * camera.zoom, camera.zoom, camera.zoom);
                        ctx.stroke();
                    })[0];
                    if (tool.extra.state.rainbow) return 0;
                });
                tool.setEvent('mousedown mouseup', (mouse, event) => {
                    if (event.which !== 1 && event.which !== 3) return;
                    tool.extra.button = event.which;
                    if (event.type === "mousedown" && !tool.extra.start) return tool.extra.start = [mouse.tileX, mouse.tileY];
                    if (!tool.extra.start) return;
                    tool.extra.end = [mouse.tileX, mouse.tileY];
                    if (event.type === "mouseup" && tool.extra.start[0] === tool.extra.end[0] && tool.extra.start[1] === tool.extra.end[1]) return;
                    PM.startHistory();
                    let sc = PM.getPixel(tool.extra.start[0], tool.extra.start[1]);
                    line(tool.extra.start[0], tool.extra.start[1], tool.extra.end[0], tool.extra.end[1], undefined, undefined, (x, y, i) => {
                        let c = event.which === 1 ? OWOP.player.selectedColor : OWOP.player.rightSelectedColor;
                        if (tool.extra.state.gradient) {
                            let divisor = (tool.extra.lineLength - 1);
                            let r = sc[0] - ((sc[0] - c[0]) / divisor) * i;
                            let g = sc[1] - ((sc[1] - c[1]) / divisor) * i;
                            let b = sc[2] - ((sc[2] - c[2]) / divisor) * i;
                            c = [~~r, ~~g, ~~b];
                            if (i === 0) c = sc;
                        } else if (tool.extra.state.rainbow) c = event.which === 1 ? Color.hue(x - y, 8) : Color.hue(tool.extra.c++, 8);
                        PM.setPixel(x, y, c);
                    });
                    PM.endHistory();
                    tool.extra.start = undefined;
                    tool.extra.end = undefined;
                });
                tool.setEvent('mousemove', mouse => {
                    if (tool.extra.start) tool.extra.end = [mouse.tileX, mouse.tileY];
                });
                tool.setEvent('deselect', () => {
                    PM.endHistory();
                    tool.extra.start = undefined;
                    tool.extra.end = undefined;
                    tool.extra.c = 0;
                });
            }));
            OWOP.tool.addToolObject(new OWOP.tool.class('Copy', OWOP.cursors.copy, null, 1, tool => {
                tool.extra.state = {
                    chunkize: false,
                    margin: false
                };
                tool.extra.text = "Right click to copy area ";
                tool.extra.start = undefined;
                tool.extra.end = undefined;
                tool.extra.clicking = false;
                tool.extra.tempCallback = undefined;
                tool.setFxRenderer(selectionRenderer(tool));
                tool.setEvent('mousedown', renderSelection(tool));
            }));
            OWOP.tool.addToolObject(new OWOP.tool.class('Paste', OWOP.cursors.paste, null, 1, tool => {
                tool.extra.state = {
                    chunkize: false,
                    rc: () => tool.extra.renderData(0b00),
                    rcc: () => tool.extra.renderData(0b01),
                    fh: () => tool.extra.renderData(0b10),
                    fv: () => tool.extra.renderData(0b11),
                    newButton: false
                };
                tool.extra.img = undefined;
                tool.extra.data = undefined;
                tool.extra.renderData = function (type) {
                    let transpose3 = function (m) {
                        let result = new Array(m[0].length);
                        for (let i = 0; i < m[0].length; i++) {
                            result[i] = new Array(m.length - 1);
                            for (let j = m.length - 1; j > -1; j--) {
                                result[i][j] = m[j][i];
                            }
                        }
                        return result;
                    };

                    let reverseRows = function (m) {
                        return m.reverse();
                    };

                    let reverseCols = function (m) {
                        for (let i = 0; i < m.length; i++) {
                            m[i].reverse();
                        }
                        return m;
                    };

                    let rotateCc = m => transpose3(m).reverse();
                    let rotateCw = m => transpose3(m.reverse());
                    switch (type) {
                        case 0: {
                            tool.extra.data = rotateCw(tool.extra.data);
                        } break;
                        case 1: {
                            tool.extra.data = rotateCc(tool.extra.data);
                        } break;
                        case 2: {
                            reverseCols(tool.extra.data);
                        } break;
                        case 3: {
                            reverseRows(tool.extra.data);
                        } break;
                    }
                    ((arr, onblob) => {
                        let c = document.createElement('canvas');
                        let w = arr[0].length;
                        let h = arr.length;
                        c.width = w;
                        c.height = h;
                        let ctx = c.getContext('2d');
                        let d = ctx.createImageData(w, h);
                        for (let j = 0; j < h; j++) {
                            for (let i = 0; i < w; i++) {
                                let pix = arr[j][i];
                                d.data[4 * (j * w + i)] = pix[0];
                                d.data[4 * (j * w + i) + 1] = pix[1];
                                d.data[4 * (j * w + i) + 2] = pix[2];
                                d.data[4 * (j * w + i) + 3] = 255;
                            }
                        }
                        ctx.putImageData(d, 0, 0);
                        c.toBlob(onblob);
                    })(tool.extra.data, b => {
                        let url = URL.createObjectURL(b);
                        let img = new Image();
                        img.onload = () => tool.extra.img = img;
                        img.src = url;
                    });
                }
                tool.setFxRenderer((fx, ctx, time) => {
                    let defaultFx = OWOP.fx.player.RECT_SELECT_ALIGNED(1);
                    if (someRenderer(fx, ctx, time, defaultFx)) return;

                    let p9 = OWOP.camera.zoom;
                    let pp = OWOP.mouse.tileX;
                    let pD = OWOP.mouse.tileY;

                    if (tool.extra.state.chunkize) {
                        pp = Math.floor(pp / 16) * 16;
                        pD = Math.floor(pD / 16) * 16;
                    }

                    pp -= OWOP.camera.x;
                    pD -= OWOP.camera.y;

                    if (tool.extra.img) {
                        ctx.globalAlpha = 0.5 + Math.sin(time / 500) / 4;
                        ctx.strokeStyle = '#000000';
                        ctx.scale(p9, p9);
                        ctx.drawImage(tool.extra.img, pp, pD);
                        ctx.scale(1 / p9, 1 / p9);
                        ctx.globalAlpha = 0.8;
                        ctx.strokeRect(pp * p9, pD * p9, tool.extra.img.width * p9, tool.extra.img.height * p9);
                        return 0;
                    }
                });
                tool.setEvent('select', () => {
                    if (tool.extra.k) {
                        if (tool.extra.k instanceof Image) tool.extra.k = NS.getImageData(tool.extra.k);
                        tool.extra.data = tool.extra.k;
                        tool.extra.renderData();
                        delete tool.extra.k;
                        return;
                    }
                    let p6 = document.createElement('input');
                    p6.type = 'file';
                    p6.accept = 'image/*';
                    p6.addEventListener('change', () => {
                        if (!p6.files || !p6.files[0]) return;
                        let p7 = new FileReader();
                        p7.addEventListener('load', () => {
                            let p8 = new Image();
                            p8.addEventListener('load', () => {
                                tool.extra.data = NS.getImageData(p8);
                                tool.extra.renderData();
                            });
                            p8.src = p7.result;
                            // ! MARK FOR IMPLEMENTATION
                            // note: read the filereader documentation for memory leak
                            // p7.removeEventListener();
                        });
                        p7.readAsDataURL(p6.files[0]);
                    });
                    p6.click();
                });
                tool.setEvent('mousedown', (mouse, _event) => {
                    if (!(mouse.buttons & 1)) return;
                    if (!tool.extra.data) return;
                    let x = mouse.tileX;
                    let y = mouse.tileY;
                    let data = tool.extra.data;
                    let fix = (p6, p7, p8) => Math.floor(p6 * (1 - p8) + p7 * p8);

                    if (tool.extra.state.chunkize) {
                        x = Math.floor(x / 16) * 16;
                        y = Math.floor(y / 16) * 16;
                    }
                    PM.startHistory();
                    // PM.pasteImage(data, [...OWOP.player.rightSelectedColor]);
                    // break up images into 4x4 chunks of history segments which only calculate when someone gets near enough to the chunk
                    // this functionality should be basically a 3x3 area of 4x4 chunks surrounding the center 4x4 that the player sits on
                    // this can be globally centered or locally centered where it gets pasted on to do these distance calculations (it doesnt matter which one)
                    // for moderators the areas would be bigger and can be calculated faster since we are directly affecting chunks not pixels and can en-masse do calculating of bigger areas easier, the sizes can be determined later
                    for (let j = 0; j < data.length; j++) {
                        for (let i = 0; i < data[0].length; i++) {
                            let d = data[j][i];
                            let color = PM.getPixel(i + x, j + y);
                            if (tool.extra.state.newButton) {
                                if (isSame(d, OWOP.player.rightSelectedColor)) {
                                    PM.setPixel(i + x, j + y, color);
                                    continue;
                                }
                            }
                            if (!color) continue;
                            let pH = !isNaN(d[3]) ? d[3] / 255 : 1;
                            color = [fix(color[0], d[0], pH), fix(color[1], d[1], pH), fix(color[2], d[2], pH)];
                            PM.setPixel(i + x, j + y, color);
                        }
                    }
                    PM.endHistory();
                });
            }));
            OWOP.tool.addToolObject(new OWOP.tool.class('Write', OWOP.cursors.write, null, 1, tool => {
                tool.extra.state = {
                    rainbow: false
                };
                tool.extra.text = "";
                tool.extra.position = 0;
                tool.extra.start = undefined;
                tool.extra.end = undefined;
                tool.extra.newText = textData.newText;
                tool.extra.cyrillic = textData.cyrillic;
                function setText(t, pos, func) {
                    let localPos = [...pos];
                    let furthestPos = [...pos];
                    function setLetter(letter, pos, func) {
                        if (letter === "\n") return 1;
                        let letterData = tool.extra.newText[letter];
                        if (!letterData) letterData = tool.extra.cyrillic[letter];
                        if (!letterData) letterData = tool.extra.newText[letter.toLocaleLowerCase()];
                        if (!letterData) letterData = tool.extra.cyrillic[letter.toLocaleLowerCase()];
                        if (!letterData) return 0;
                        for (let x = 0; x < letterData.width; x++) {
                            for (let y = 0; y < letterData.height; y++) {
                                if (letterData.text[x + y * letterData.width] !== "0") func(pos[0] + x, pos[1] + y + letterData.skip);
                            }
                        }
                        return letterData;
                    }
                    for (let p5 = 0; p5 < t.length; p5++) {
                        let l = setLetter(t[p5], localPos, func);
                        if (l === 0) continue;
                        if (l === 1) {
                            localPos[0] = pos[0];
                            localPos[1] = localPos[1] + tool.extra.newText.data.height + 1;
                        } else {
                            localPos[0] += l.width + tool.extra.newText.data.gap;
                        }
                        if (localPos[0] > furthestPos[0]) furthestPos[0] = localPos[0];
                        if (localPos[1] > furthestPos[1]) furthestPos[1] = localPos[1];
                    }
                    return furthestPos;
                }
                tool.setFxRenderer((fx, ctx, time) => {
                    if (someRenderer(fx, ctx, time, () => 1)) return;

                    let camera = OWOP.camera;
                    let oldlinew = ctx.lineWidth;
                    ctx.lineWidth = 2;
                    let s = undefined;
                    let e = undefined;
                    if (!tool.extra.start) {
                        s = [OWOP.mouse.tileX, OWOP.mouse.tileY];
                        ctx.strokeStyle = "#00FF00";
                    } else {
                        s = tool.extra.start;
                        ctx.strokeStyle = "#FF0000";
                    }
                    let oldFillstyle = ctx.fillStyle;
                    ctx.fillStyle = OWOP.player.htmlRgb;
                    let tempEnd = setText(tool.extra.text, [...s], (x, y) => {
                        let x1 = (x - camera.x) * camera.zoom + 0.5;
                        let y1 = (y - camera.y) * camera.zoom + 0.5;
                        ctx.fillStyle = tool.extra.state.rainbow ? Color.toHex(Color.hue(x - y, 8)) : OWOP.player.htmlRgb;
                        ctx.fillRect(x1, y1, camera.zoom, camera.zoom);
                    });
                    e = [tempEnd[0] + 1, tempEnd[1] + 8]
                    if (tool.extra.end) tool.extra.end = e;
                    let x = (s[0] - camera.x) * camera.zoom + 0.5;
                    let y = (s[1] - camera.y) * camera.zoom + 0.5;
                    let w = e[0] - s[0];
                    let h = e[1] - s[1];
                    ctx.beginPath();
                    ctx.rect(x, y, w * camera.zoom, h * camera.zoom);
                    ctx.stroke();
                    ctx.lineWidth = oldlinew;
                    ctx.fillStyle = oldFillstyle;
                    return 0;
                });
                tool.setEvent('mousedown', (mouse, _event) => {
                    let s = tool.extra.start;
                    let e = tool.extra.end;
                    const isInside = () => mouse.tileX >= s[0] && mouse.tileX < e[0] && mouse.tileY >= s[1] && mouse.tileY < e[1];
                    if (mouse.buttons === 1 && !tool.extra.end) {
                        tool.extra.start = [mouse.tileX, mouse.tileY];
                        tool.extra.end = [mouse.tileX + 1, mouse.tileY + 7];
                        tool.setEvent('keydown', (keysDown, event, isNS) => {
                            if (!isNS) return;
                            if (event.key.length > 1) {
                                switch (event.key) {
                                    case "Enter": {
                                        tool.extra.text += "\n";
                                    } break;
                                    case "Backspace": {
                                        let t = tool.extra.text.split("");
                                        t.pop();
                                        tool.extra.text = t.join("");
                                    } break;
                                }
                                return;
                            }
                            tool.extra.text += event.key;
                            return 1;
                        });
                    } else if (mouse.buttons === 1 && tool.extra.end) {
                        if (isInside()) {
                            let offx = mouse.tileX;
                            let offy = mouse.tileY;
                            tool.setEvent('mousemove', (mouse, _event) => {
                                let dx = mouse.tileX - offx;
                                let dy = mouse.tileY - offy;
                                tool.extra.start = [s[0] + dx, s[1] + dy];
                                tool.extra.end = [e[0] + dx, e[1] + dy];
                            });
                            tool.setEvent('mouseup', () => tool.setEvent('mouseup mousemove', null));
                        } else {
                            tool.extra.start = undefined;
                            tool.extra.end = undefined;
                        }
                    } else if (mouse.buttons === 2 && tool.extra.end && isInside()) {
                        PM.startHistory();
                        setText(tool.extra.text, [...tool.extra.start], (x, y) => PM.setPixel(x, y, tool.extra.state.rainbow ? Color.hue(x - y, 8) : OWOP.player.selectedColor));
                        PM.endHistory();
                        return true;
                    }
                });
                tool.setEvent('deselect', () => {
                    tool.extra.position = 0;
                    tool.extra.start = undefined;
                    tool.extra.end = undefined;
                    // ! MARK FOR CHANGE
                    // tool.extra.text = "";
                    tool.setEvent('keydown mouseup mousemove', null);
                });
                tool.setEvent('keyup', () => 1);
            }));
            OWOP.tool.addToolObject(tools.shape);
            if (OWOP?.tool?.allTools?.pipette) OWOP.tool.allTools.pipette.fxRenderer = someRenderer;
            if (OWOP?.tool?.allTools?.move) OWOP.tool.allTools.move.fxRenderer = someRenderer;
            if (OWOP?.tool?.allTools?.zoom) OWOP.tool.allTools.zoom.fxRenderer = someRenderer;
            OWOP.tool.updateToolbar();
            let r = 0;
            for (let e in OWOP.tool.allTools) {
                e = OWOP.tool.allTools[e];
                if (e.rankRequired < 2) r++;
            }
            document.getElementById("toole-container").style.maxWidth = 40 * Math.ceil(r / 8) + "px";
            document.getElementById("toole-container").parentElement.style.transform = "translate(7px, 60px)";
        }
        function a() {
            if (OWOP?.tool !== undefined && OWOP?.player?.tool?.id !== undefined) setTools();
            else {
                console.error("will this ever log ever?");
                setTimeout(a, 1e2);
            }
        }
        a();
    }());

    // setting style classes
    ((true) && !function () {
        let nekoStyles = document.createElement("style");
        nekoStyles.innerHTML = `
			.ns_topbar {
				width: calc(100vw - 55px);
				display: flex;
				flex-direction: row;
				justify-content: space-between;
                position: fixed;
                top: 27px;
			}
			.ns_righttopbar {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
			}
			.ns_lefttopbar {
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
			}
			.ns_rtelements {
				position: relative !important;
				margin: 0px 10px;
			}
			.ns_container {
				margin: 0px;
				border-radius: 5px;
				background-color: #7e635c;
				box-shadow: inset 3px 2px 0px 0px #4d313b;
			}
			.ns_vertical {
				width: 5px;
			}
			.ns_horizontal {
				height: 5px;
			}
			.ns_xydisplay {
				position: relative !important;
				top: 0px !important;
				left: 0px !important;
				margin-right: 10px;
			}
			.ns_rSCcontainer {
				display: flex;
				flex-direction: row;
			}
			.ns_playercountDisplay {
				position: relative !important;
				top: 0px !important;
				right: 0px !important;
				margin-left: 10px;
			}
			.ns_dropdown {
				padding: 3px 0px;
				background: #aba389;
			}
			.ns_button {
				width: 16px;
				height: 16px;
				position: fixed;
				top: -5px;
				padding: 0px;
				border: 0px;
			}
			.tabp {
				display: flex;
				justify-content: space-between;
				margin: 1px 0px;
			}
			#chat {
				    /*
                bottom: 10px !important;
                    */
				right: 55px !important;
			}
			#chat-input {
				overflow: auto !important;
			}
		`;
        document.head.appendChild(nekoStyles);
    }());

    // chat listeners & teleport handling
    ((true) && !function () {
        NS.teleport = function () {
            let { x, y } = NS.teleport.camera;
            if (isNaN(x) || isNaN(y)) {
                NS.teleport.camera = {};
                NS.teleport.teleporting = false;
                return;
            }
            let dx = x - OWOP.camera.x;
            let dy = y - OWOP.camera.y;
            OWOP.camera.zoom = 32;

            let p = 9952;
            let d = Math.sqrt((x - OWOP.mouse.tileX) ** 2 + (y - OWOP.mouse.tileY) ** 2) * (1 / p);
            let xdirection = (x - OWOP.mouse.tileX) / d;
            let ydirection = (y - OWOP.mouse.tileY) / d;

            let p1 = new Point(x, y);
            let p2 = new Point(OWOP.mouse.tileX, OWOP.mouse.tileY);
            let distance = Point.distance(p1, p2);

            let tempx = Math.min(Math.max(x, -480000), 480000);
            let tempy = Math.min(Math.max(y, -480000), 480000);
            let p3 = new Point(tempx, tempy);

            if (Point.distance(p2, p3) > 100 && Point.distance(p1, p3) < distance) {
                OWOP.emit(29, tempx, tempy);
                setTimeout(() => NS.teleport(), 250);
                return;
            }

            if (distance < p) {
                if (distance > 100) {
                    setTimeout(() => NS.teleport(), 2000);
                } else {
                    NS.teleport.camera = {};
                    NS.teleport.teleporting = false;
                }
                OWOP.emit(29, Math.round(-window.innerWidth / OWOP.camera.zoom / 2 + dx) + OWOP.camera.x, Math.round(-window.innerHeight / OWOP.camera.zoom / 2 + dy) + OWOP.camera.y);
                return;
            }
            OWOP.emit(29, Math.round(xdirection) + OWOP.camera.x, Math.round(ydirection) + OWOP.camera.y);
            NS.teleport.teleporting = true;
            setTimeout(() => NS.teleport(), 150);
        }

        NS.teleport.camera = {};
        NS.teleport.teleporting = false;


        let originalFunction = OWOP.chat.sendModifier;
        OWOP.chat.sendModifier = function (...args) {
            let command = args[0].slice(1).split(' ');
            if (args[0].startsWith('/')) {
                switch (command[0].toLocaleLowerCase()) {
                    case "commands":
                    case "help": {
                        OWOP.chat.local(`Commands: /tp, /whitelist, /msg`);
                    } break;
                    case "tp": {
                        let x = undefined;
                        let y = undefined;
                        if (command.length === 3) {
                            [x, y] = [Number(command[1]), Number(command[2])];
                        }
                        if (command.length === 2) {
                            if (isNaN(Number(command[1]))) break;
                            let p = OWOP.misc._world.players[command[1]];
                            if (!p) {
                                OWOP.chat.local(`Player ${command[1]} doesn't exist.`);
                                break;
                            }
                            ({ tileX: x, tileY: y } = p);
                        }
                        if (isNaN(x) || isNaN(y)) {
                            NS.teleport.camera = {};
                            break;
                        }
                        if (Math.abs(x) > 0xFFFFFF) {
                            x = Math.sign(x) * 0xFFFFFF;
                        }
                        if (Math.abs(y) > 0xFFFFFF) {
                            y = Math.sign(y) * 0xFFFFFF;
                        }
                        if (Math.abs(x) < 5e5 && Math.abs(y) < 5e5) {
                            NS.teleport.camera = {};
                            OWOP.emit(29, x, y);
                            break;
                        }
                        NS.teleport.camera = { x: x, y: y };
                        OWOP.camera.zoom = 32;
                        if (!NS.teleport.teleporting) {
                            OWOP.chat.local("Press Esc to cancel teleport OR send \"/tp\" in chat.");
                            NS.teleport();
                        }
                    } break;
                    case "chat": {
                        if (command[1] === "all") {
                            NS.privateMessageID = void 0;
                            OWOP.chat.local(`Chat set to Mode: All.`);
                        } else if (isNaN(Number(command[1]))) {
                            undefined; // intentionally left blank
                        } else {
                            OWOP.chat.local(`Chat set to Mode: Private Messaging\nID: ${command[1]}`);
                        }
                        NS.privateMessageID = Number(command[1]);
                        command[0] = "tell";
                        args[0] = "/" + command.join(" ");
                    } break;
                    case "pm":
                    case "message":
                    case "msg": {
                        command[0] = "tell";
                        args[0] = "/" + command.join(" ");
                    } break;
                    case "wl":
                    case "whitelist": {
                        if (OWOP.player.rank > 1 && PM.enableMod) OWOP.chat.local(`Disable moderator on PM to allow whitelist to work.`);
                        if (!command[1]) {
                            OWOP.chat.local(`Whitelist: ${Object.keys(PM.whitelist).join(", ")}`);
                            console.log(1);
                            break;
                        }
                        switch (command[1]) {
                            case "add": {
                                if (isNaN(Number(command[2]))) {
                                    OWOP.chat.local(`Syntax: /whitelist [add/remove] [id]`);
                                    console.log(3);
                                    break;
                                }
                                if (PM.whitelist[command[2]]) {
                                    OWOP.chat.local(`Player ${command[2]} is already whitelisted.`);
                                    console.log(4);
                                    break;
                                }
                                if (!OWOP.misc._world.players[command[2]]) {
                                    OWOP.chat.local(`Player ${command[2]} doesn't exist.`);
                                    console.log(5);
                                    break;
                                }
                                PM.whitelist[command[2]] = true;
                                OWOP.chat.local(`Player ${command[2]} added to whitelist.`);
                                console.log(6);
                            } break;
                            case "remove": {
                                if (isNaN(Number(command[2]))) {
                                    OWOP.chat.local(`Syntax: /whitelist [add/remove] [id]`);
                                    console.log(7);
                                    break;
                                }
                                if (!PM.whitelist[command[2]]) {
                                    OWOP.chat.local(`Player ${command[2]} is not on the whitelist.`);
                                    console.log(8);
                                    break;
                                }
                                delete PM.whitelist[command[2]];
                                OWOP.chat.local(`Player ${command[2]} removed from whitelist.`);
                                console.log(9);
                            } break;
                            default: {
                                undefined; // intentionally left blank
                            }
                        }
                    } break;
                }
            } else if (NS.privateMessageID) {
                command[0] = "tell";
                args[0] = "/" + command.join(" ");
            }
            return originalFunction(...args);
        }
        return;

        NS.privateMessageID = void 0;
        let cm = document.getElementById("chat-messages");
        const observer = new MutationObserver(ml => {
            ml.forEach((m) => {
                m.addedNodes.forEach(e => {
                    let t = e.innerText;
                    let id = OWOP.player.id;
                    if (!t.match(new RegExp(`(^\\[${id}\\] [\\w\\d]+: )|(^${id}: )`))) {
                        if (t.replace(/(^\[(\d+)\] [\w\d]+: )|(^(\d+): )/, "").replace(/\n+/g, "").split(" ").some(s => s === `${id}`)) e.style = "background: #FF404059;";
                    }
                })
            });
        });
        observer.observe(cm, { childList: true });
        OWOP.on(owop.events.net.chat, function (text) {
            if (text.startsWith("[D]")) {
                let nickname = text.split(": ")[0] + ": ";
                text = text.slice(nickname.length);
            } else if (text.startsWith("[Server]") || text.startsWith("Server:") || text.startsWith("Nickname set to") || text.startsWith("User: ")) {
                undefined; // intentionally left blank
            } else if (text.startsWith("->")) {
                let cuttxt = text.slice(3);
                let id = parseInt(cuttxt);
                cuttxt = cuttxt.slice(id.toString().length);
                if (cuttxt.startsWith(" tells you: ")) {
                    text = cuttxt.slice(12);
                    // them saying
                } else {
                    // me saying
                }
            } else if (text.startsWith("(M)")) {
                undefined; // intentionally left blank
            } else if (isNaN(text.split(": ")[0]) && text.split(": ")[0].charAt(0) !== "[") {
                undefined; // intentionally left blank
            } else {
                let nickname = text.split(": ")[0];
                // let id = nickname.startsWith("[") ? nickname.split(" ")[0].slice(1, -1) : nickname;
                // id = parseInt(id);
                text = text.slice(nickname.length + 2);
            }
        });
    }());

    // topbar elements
    ((true) && !function () {
        // get rid of owop's displayers, since we cant really affect their native functions
        document.querySelector("#xy-display").style.display = "none";
        document.querySelector("#playercount-display").style.display = "none";

        // create our own to add our own infos
        let topBar = document.createElement("span");
        topBar.className = "ns_topbar";
        topBar.innerHTML = `
			<span class="ns_lefttopbar">
				<span id="ns_xydisplay_pointer" class="framed ns_rtelements whitetext"></span>
				<span id="ns_chunkdisplay" class="framed ns_rtelements whitetext"></span>
			</span>
			<span class="ns_righttopbar">
				<span style="width: 128px; margin-right: 10px;"></span>
				<span class="framed ns_rtelements ns_rSCcontainer whitetext">
					<span>Right Color: </span>
					<span id="ns_rSCcolor" class="ns_rSCspan" style="width:40px;height:17px;background:#FFFFFF;"></span>
				</span>
				<span id="ns_playerID" class="framed ns_rtelements whitetext">Your ID: null</span>
				<span id="ns_playercountDisplay" class="framed ns_rtelements whitetext"></span>
			</span>
		`;
        //let nsrt = topBar.querySelector(".ns_righttopbar");
        //nsrt.insertBefore(document.querySelector("#dinfo-display"), nsrt.children[1]);
        document.body.appendChild(topBar);
        // NS.M14.eventSys.emit(NS.M13.EVENTS.net.donUntil, Date.now() + 10000000, 2)
        // dinfo-display
        // let rightBar = document.createElement("span");
        // let leftBar = document.createElement("span");
        // let xyDisplay = document.querySelector("#xy-display");
        // let chunkXchunkYDisplay = document.createElement("span");
        // let fillerSpan = document.createElement("span");
        // let rSCcontainer = document.createElement("span");
        // let rSCtext = document.createElement("span");
        // let rSCspan = document.createElement("span");
        // let playerID = document.createElement("span");
        // let playercountDisplay = document.querySelector("#playercount-display");
        // rSCcontainer.appendChild(rSCtext);
        // rSCcontainer.appendChild(rSCspan);
        // leftBar.appendChild(xyDisplay);
        // leftBar.appendChild(chunkXchunkYDisplay);
        // rightBar.appendChild(fillerSpan);
        // rightBar.appendChild(rSCcontainer);
        // rightBar.appendChild(playerID);
        // rightBar.appendChild(playercountDisplay);
        // topBar.appendChild(leftBar);
        // topBar.appendChild(rightBar);
        // document.body.appendChild(topBar);

        // xyDisplay.classList.add("framed");
        // chunkXchunkYDisplay.classList.add("framed");
        // rSCcontainer.classList.add("framed");
        // playerID.classList.add("framed");
        // playercountDisplay.classList.add("framed");

        // topBar.classList.add("ns_topbar");
        // leftBar.classList.add("ns_lefttopbar");
        // rightBar.classList.add("ns_righttopbar");
        // xyDisplay.classList.add("ns_xydisplay");
        // chunkXchunkYDisplay.classList.add("ns_rtelements");
        // chunkXchunkYDisplay.classList.add("whitetext");
        // rSCcontainer.classList.add("ns_rtelements");
        // rSCcontainer.classList.add("ns_rSCcontainer");
        // rSCcontainer.classList.add("whitetext");

        // playerID.classList.add("ns_rtelements");
        // playerID.classList.add("whitetext");
        // playercountDisplay.classList.add("ns_playercountDisplay");

        // fillerSpan.style.width = "128px";
        // fillerSpan.style["margin-right"] = "10px";

        // rSCspan.style.width = "40px";
        // rSCspan.style.height = "17px";
        // rSCspan.style.background = "#FFFFFF";

        // rSCtext.textContent = "Right Color:";
        // playerID.textContent = "Your ID: null";


        OWOP.elements.topBar = topBar;
        // OWOP.elements.chunkXchunkYDisplay = chunkXchunkYDisplay;
        // ! MARK FOR CHANGE
        setInterval(() => {
            let rSCspan = document.querySelector("#ns_rSCcolor");
            rSCspan && (
                rSCspan.style.background = Color.toHex(OWOP.player.rightSelectedColor)
            );
            let playerID = document.querySelector("#ns_playerID");
            playerID && (
                playerID.textContent = `Your ID: ${OWOP.player.id}`
            );
        }, 100);
        let playercountDisplay = document.querySelector("#ns_playercountDisplay");
        playercountDisplay.textContent = `${Object.keys(OWOP.misc._world.players).length + 1} cursors online`;
        let ns_xydisplay_pointer = document.querySelector("#ns_xydisplay_pointer");
        ns_xydisplay_pointer.textContent = `X: 0, Y: 0`;
        let ns_chunkdisplay = document.querySelector("#ns_chunkdisplay");
        ns_chunkdisplay.textContent = `ChunkX: 0, ChunkY: 0`;
        OWOP.on(OWOP.events.net.world.join, function () {
            playercountDisplay.textContent = `Waiting.`;
        }.bind(this));
        OWOP.on(OWOP.events.net.world.leave, function () {
            playercountDisplay.textContent = `Offline.`;
        }.bind(this));
        OWOP.on(OWOP.events.net.playerCount, function (count) {
            playercountDisplay.textContent = `${count} cursors online`;
        }.bind(this));
    }());

    // setting wasd movement
    ((true) && !function () {
        clearInterval(OWOP.misc.tickInterval);
        NS.tickIntervalNS = setInterval(mainTick, 1000 / OWOP.options.tickSpeed);
        function mainTick() {
            OWOP.emit(OWOP.events.tick, undefined /*t*/);
            if (null !== OWOP.player.tool && null !== OWOP.misc._world) OWOP.player.tool.call("tick");
            if (OWOP.player.tool === OWOP.tool.allTools.write) return;
            let t = ++OWOP.misc.tick;
            let e = Math.max(Math.min(OWOP.options.movementSpeed, 64), 1);
            let n = 0;
            let r = 0;
            (NS.keysdown[38] || (NS.keysdown[87] && !NS.keysdown[16])) && (r -= e);
            (NS.keysdown[37] || (NS.keysdown[65] && !NS.keysdown[16])) && (n -= e);
            (NS.keysdown[40] || (NS.keysdown[83] && !NS.keysdown[16])) && (r += e);
            (NS.keysdown[39] || (NS.keysdown[68] && !NS.keysdown[16])) && (n += e);
            if (0 !== n || 0 !== r) {
                OWOP.camera.moveCameraBy(n, r);
                A("mousemove", OWOP.mouse.x, OWOP.mouse.y);
            }
        }
        function A(eventName, x, y) {
            OWOP.mouse.x = x;
            OWOP.mouse.y = y;
            let o = 0;
            if (null !== OWOP.misc._world) OWOP.mouse.validTile = OWOP.misc._world.validMousePos(OWOP.mouse.tileX, OWOP.mouse.tileY);
            if (null !== OWOP.player.tool) o = OWOP.player.tool.call(eventName, [OWOP.mouse]);
            if (updateCoordDisplay(OWOP.mouse.tileX, OWOP.mouse.tileY)) null;//NS.M21.updateClientFx();
            return o;
        }
        function updateCoordDisplay(x, y) {
            if (!(OWOP.misc.lastXYDisplay[0] !== x || OWOP.misc.lastXYDisplay[1] !== y)) return false;
            OWOP.misc.lastXYDisplay = [x, y]
            if (OWOP.options.hexCoords) {
                (x = (x < 0 ? "-" : "") + "0x" + Math.abs(x).toString(16), y = (y < 0 ? "-" : "") + "0x" + Math.abs(y).toString(16))
            }
            OWOP.elements.xyDisplay.innerHTML = "X: " + x + ", Y: " + y;
            OWOP.elements.chunkXchunkYDisplay.innerHTML = "ChunkX: " + Math.floor(x / 16) + ", ChunkY: " + Math.floor(y / 16);
            return true;
        }
        function updateMouse(e, type, x, y) {
            if (type !== 'mousemove') return;
            let xydisplay = document.querySelector("#ns_xydisplay_pointer");
            let chunkXchunkYDisplay = document.querySelector("#ns_chunkdisplay");
            xydisplay.textContent = `X: ${x}, Y: ${y}`;
            chunkXchunkYDisplay.textContent = `ChunkX: ${Math.floor(OWOP.mouse.tileX / 16)}, ChunkY: ${Math.floor(OWOP.mouse.tileY / 16)}`;
        }
        window.addEventListener("mousemove", event => {
            let mouse = event;
            let cancelledButtons = updateMouse(event, 'mousemove', OWOP.mouse.tileX, OWOP.mouse.tileY);
            let remainingButtons = mouse.buttons & ~cancelledButtons;
            if (remainingButtons & 0b100) { /* If middle click was not used for anything */
                //! i didnt check if NS.M20.moveCameraBy is correct;
                // OWOP.camera.moveCameraBy((mouse.mouseDownWorldX - mouse.worldX) / 16, (mouse.mouseDownWorldY - mouse.worldY) / 16);
            }
        });
        const mousewheel = event => {
            if (event.ctrlKey) zoom(OWOP.mouse, Math.sign(-event.deltaY));
            else OWOP.player.paletteIndex += Math.sign(event.deltaY);
        };

        document.getElementById("viewport").addEventListener("wheel", mousewheel, { passive: true, NS: true });
        document.getElementById("viewport").addEventListener("wheel", (function (e) { e.preventDefault() }), { passive: false, NS: true });

        function zoom(mouse, type) {
            let lzoom = OWOP.camera.zoom;
            let nzoom = OWOP.camera.zoom;
            let offX = 0;
            let offY = 0;
            let w = window.innerWidth;
            let h = window.innerHeight;
            if (type === 1) {
                // Zoom in
                nzoom *= 1 + OWOP.options.zoomStrength;
                offX = (mouse.x - w / 2) / nzoom;
                offY = (mouse.y - h / 2) / nzoom;
            } else if (type === -1) {
                // Zoom out
                nzoom /= 1 + OWOP.options.zoomStrength;
                offX = (mouse.x - w / 2) * (3 / lzoom - 2 / nzoom);
                offY = (mouse.y - h / 2) * (3 / lzoom - 2 / nzoom);
            } else if (type === 3) {
                // Reset zoom (right + left click)
                // nzoom = OWOP.options.defaultZoom;
            }
            nzoom = Math.round(nzoom);
            OWOP.camera.zoom = nzoom;
            if (OWOP.camera.zoom !== lzoom) {
                OWOP.camera.moveCameraBy(offX, offY);
            }
        }
    }());

    // window setup
    ((true) && !function () {
        function optionmaker(name, inputType, checked, onclick) {
            let current = mkHTML("div");
            current.className = "tabp";
            current.appendChild(mkHTML("p", { innerHTML: name }));
            let button = mkHTML("button");
            button.classList.add("optionButton");
            current.appendChild(button);
            if (inputType === "button") button.innerHTML = checked ? "on" : "off";
            else if (inputType === "select") button.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
            button.onclick = function () {
                if (inputType === "button") {
                    button.classList.toggle("on");
                    button.innerHTML = button.classList.contains("on") ? "on" : "off";
                }
                onclick();
            }
            if (checked) button.classList.toggle("on");
            return current;
        }

        // players
        ((true) && !function () {
            let windowName = "Players";
            let options = {
                close: true,
                minimize: false,
                lock: true
            }

            function windowFunc(thisWindow) {
                let divwindow = document.createElement("div");
                OWOP.showPlayerList(true);
                document.getElementById("player-list").parentElement.style.visibility = "hidden";
                divwindow.appendChild(document.getElementById("player-list"));
                thisWindow.container.classList.remove("wincontainer");
                thisWindow.addObj(divwindow);
            }

            NS.windows[windowName] = new GUIWindow(windowName, options, windowFunc).hide();
        }());

        // palette saver
        ((true) && !function () {
            let windowName = "Palette Saver";
            let options = {
                close: true,
                minimize: false,
                lock: true
            }

            function windowFunc(thisWindow) {
                let divwindow = document.createElement("div");
                divwindow.style = "width: 300px; overflow-y: scroll; overflow-x: scroll; max-height: 165px;";
                divwindow.innerHTML = `<input id="pName" type="text" style="max-width: 100px; border: 0px;" placeholder="Name"></input>
        		<button id="addPalette" >Save Current Palette</button> <table id="paletteTable" style="overflow-x: hidden; overflow-y: scroll;"></table>`;
                thisWindow.addObj(divwindow);
            }

            NS.windows[windowName] = new GUIWindow(windowName, options, windowFunc).hide();

            let pName = document.querySelector("#pName");

            pName.oninput = () => {
                if (pName.value.length > 25) pName.style.backgroundColor = "rgb(255 148 129)";
                else pName.style.backgroundColor = "rgb(255, 255, 255)";
            }

            document.getElementById("addPalette").onclick = () => {
                if (pName.value.length > 25) return alert("Your max name length is 25 characters.");
                if (pName.value.length === 0) return alert("Invalid Name");

                let paletteJson = localStorage.paletteJson ? JSON.parse(localStorage.paletteJson) : {};
                if (paletteJson[pName.value]) return (pName.value = "", alert("You already have a palette with this name."));
                paletteJson[pName.value] = OWOP.player.palette;
                localStorage.paletteJson = JSON.stringify(paletteJson);

                let divPalette = document.createElement("tr");
                let pN = pName.value;
                divPalette.id = `im-busy${pN}`;
                divPalette.innerHTML = `<td id="palette-${pN}" style="cursor: pointer; padding: 5px; border: 1px solid white; border-radius: 5px; color: white;">${pN}</td> <td id="useT1-${pN}"><button id="useB1-${pN}">Use</button></td> <td id="useT2-${pN}"><button id="useB2-${pN}">Replace</button></td> <td id="useT3-${pN}"><button id="useB3-${pN}">Delete</button></td>`;
                document.getElementById("paletteTable").appendChild(divPalette);
                document.getElementById(`useB1-${pN}`).onclick = () => {
                    let paletteJson = JSON.parse(localStorage.getItem("paletteJson"));
                    OWOP.player.palette.splice(0);
                    OWOP.player.palette.push(...paletteJson[pN]);
                    OWOP.player.paletteIndex = OWOP.player.paletteIndex;
                }
                document.getElementById(`useB2-${pN}`).onclick = () => {
                    if (!confirm(`Are you sure you want to REPLACE the palette ${pN}?`)) return;
                    let paletteJson = JSON.parse(localStorage.paletteJson);
                    paletteJson[`${pN}`] = OWOP.player.palette;
                    localStorage.paletteJson = JSON.stringify(paletteJson);
                }
                document.getElementById(`useB3-${pN}`).onclick = () => {
                    if (!confirm(`Are you sure you want to DELETE the palette ${pN}?`)) return;
                    let paletteJson = JSON.parse(localStorage.paletteJson);
                    document.getElementById(`palette-${pN}`).outerHTML = '';
                    document.getElementById(`im-busy${pN}`).outerHTML = '';
                    delete paletteJson[pN];
                    localStorage.paletteJson = JSON.stringify(paletteJson);
                }

                pName.style.backgroundColor = "rgb(255 255 255)";

                pName.value = "";
            }

            if (localStorage.paletteJson) {
                let gettedJson = JSON.parse(localStorage.paletteJson);
                let obj = Object.keys(gettedJson);
                for (let i = 0; i < obj.length; i++) {
                    let pN = obj[i];
                    let divPalette = document.createElement("tr");
                    divPalette.id = `im-busy${pN}`;
                    divPalette.innerHTML = `<td id="palette-${pN}" style="cursor: pointer; padding: 5px; border: 1px solid white; border-radius: 5px; color: white;">${pN}</td> <td id="useT1-${pN}"><button id="useB1-${pN}">Use</button></td> <td id="useT2-${pN}"><button id="useB2-${pN}">Replace</button></td> <td id="useT3-${pN}"><button id="useB3-${pN}">Delete</button></td>`;
                    document.getElementById("paletteTable").appendChild(divPalette);
                    document.getElementById(`useB1-${pN}`).onclick = () => {
                        let paletteJson = JSON.parse(localStorage.paletteJson);
                        OWOP.player.palette.splice(0);
                        OWOP.player.palette.push(...paletteJson[`${pN}`]);
                        OWOP.player.paletteIndex = OWOP.player.paletteIndex;
                    }
                    document.getElementById(`useB2-${pN}`).onclick = () => {
                        if (!confirm(`Are you sure you want to REPLACE the palette ${pN}?`)) return;
                        let paletteJson = JSON.parse(localStorage.paletteJson);
                        paletteJson[`${pN}`] = OWOP.player.palette;
                        localStorage.paletteJson = JSON.stringify(paletteJson);
                    }
                    document.getElementById(`useB3-${pN}`).onclick = () => {
                        if (!confirm(`Are you sure you want to DELETE the palette ${pN}?`)) return;
                        let paletteJson = JSON.parse(localStorage.paletteJson);
                        document.getElementById(`palette-${pN}`).outerHTML = '';
                        document.getElementById(`im-busy${pN}`).outerHTML = '';
                        delete paletteJson[pN];
                        localStorage.paletteJson = JSON.stringify(paletteJson);
                    }
                }
            }
        }());

        // keybinds
        ((false) && !function () {
            let windowName = "Keybinds";
            let options = {
                close: true,
                minimize: false,
                lock: true
            }

            let keybinds = {
                // look into inverse color for contrast to be removable
                // look into making my script modular so i can turn on and off modules
            }

            function windowFunc(thisWindow) {
                let divwindow = document.createElement("div");
                divwindow.style = "width: 300px; overflow-y: scroll; overflow-x: scroll; max-height: 165px;";
                divwindow.innerHTML = ``;
                thisWindow.addObj(divwindow);
            }

            NS.windows[windowName] = new GUIWindow(windowName, options, windowFunc).hide();

            if (localStorage.paletteJson) {
            }
        }());

        // icons
        ((true) && !function () {
            let windowName = "Icons";
            let options = {
                close: true,
                minimize: false,
                lock: true
            }

            function windowFunc(thisWindow) {
                let content = `
					<style>
						.NSspan1 {
							display: flex;
							flex-direction: column;
							max-height: 200px;
							width: 300px;
						}
						.NSspan2 {
							display: flex;
							justify-content: space-between;
							padding: 4px 0px;
						}
						.NSspan3 {
							display: flex;
							background: #0003;
							border-radius: 10px;
							padding: 5px;
						}
						.NSspan4 {
							display: flex;
							flex-direction: column;
							align-items: center;
							width: 75px;
						}
						.NSspan5 {
							display: flex;
							flex-direction: column;
							justify-content: space-evenly;
						}
						.NSspan6 {
							padding: 5px 0px;
						}
						.NSdiv1 {
							background-image: url("https://ourworldofpixels.com/img/toolset.png");
							width: 36px;
							height: 36px;
						}
						/* switch background #aba389 to #8b08bf on halloween */
						/* switch color #7e635c to #fdfbff on halloween */
						.NSdiv2 {
							background: #aba389;
							color: #7e635c;
							border-radius: 6px;
							border: initial;
							padding: 4px;
							text-shadow: 1px 1px #4d313b;
						}
					</style>
					<span class="NSspan1">
						<span class="NSspan2">
							<span class="NSspan3">
								<span class="NSspan4">
									<span class="NSspan6">
										<div class="NSdiv1" style="background-position: 0px 0px;"></div>
									</span>
									<div class="NSdiv2">Cursor</div>
								</span>
								<span class="NSspan5">
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconSelect('cursor')">Select</button>
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconPaste('cursor')">Paste</button>
								</span>
							</span>
							<span class="NSspan3">
								<span class="NSspan4">
									<span class="NSspan6">
										<div class="NSdiv1" style="background-position: -36px 0px;"></div>
									</span>
									<div class="NSdiv2">Move</div>
								</span>
								<span class="NSspan5">
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconSelect('move')">Select</button>
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconPaste('move')">Paste</button>
								</span>
							</span>
						</span>
						<span class="NSspan2">
							<span class="NSspan3">
								<span class="NSspan4">
									<span class="NSspan6">
										<div class="NSdiv1" style="background-position: 0px -36px;"></div>
									</span>
									<div class="NSdiv2">Pipette</div>
								</span>
								<span class="NSspan5">
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconSelect('pipette')">Select</button>
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconPaste('pipette')">Paste</button>
								</span>
							</span>
							<span class="NSspan3">
								<span class="NSspan4">
									<span class="NSspan6">
										<div class="NSdiv1" style="background-position: -36px -72px;"></div>
									</span>
									<div class="NSdiv2">Zoom</div>
								</span>
								<span class="NSspan5">
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconSelect('zoom')">Select</button>
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconPaste('zoom')">Paste</button>
								</span>
							</span>
						</span>
						<span class="NSspan2">
							<span class="NSspan3">
								<span class="NSspan4">
									<span class="NSspan6">
										<div class="NSdiv1" style="background-position: -72px 0px;"></div>
									</span>
									<div class="NSdiv2">Select</div>
								</span>
								<span class="NSspan5">
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconSelect('export')">Select</button>
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconPaste('export')">Paste</button>
								</span>
							</span>
							<span class="NSspan3">
								<span class="NSspan4">
									<span class="NSspan6">
										<div class="NSdiv1" style="background-position: -36px -36px;"></div>
									</span>
									<div class="NSdiv2">Bucket</div>
								</span>
								<span class="NSspan5">
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconSelect('fill')">Select</button>
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconPaste('fill')">Paste</button>
								</span>
							</span>
						</span>
						<span class="NSspan2">
							<span class="NSspan3">
								<span class="NSspan4">
									<span class="NSspan6">
										<div class="NSdiv1" style="background-position: -108px -108px;"></div>
									</span>
									<div class="NSdiv2">Wand</div>
								</span>
								<span class="NSspan5">
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconSelect('line')">Select</button>
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconPaste('line')">Paste</button>
								</span>
							</span>
							<span class="NSspan3">
								<span class="NSspan4">
									<span class="NSspan6">
										<div class="NSdiv1" style="background-position: -108px -36px;"></div>
									</span>
								<div class="NSdiv2">Paste</div>
								</span>
								<span class="NSspan5">
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconSelect('paste')">Select</button>
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconPaste('paste')">Paste</button>
								</span>
							</span>
						</span>
						<span class="NSspan2">
							<span class="NSspan3">
								<span class="NSspan4">
									<span class="NSspan6">
										<div class="NSdiv1" style="background-position: -108px 0px;"></div>
									</span>
									<div class="NSdiv2">Copy</div>
								</span>
								<span class="NSspan5">
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconSelect('copy')">Select</button>
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconPaste('copy')">Paste</button>
								</span>
							</span>
							<span class="NSspan3">
								<span class="NSspan4">
									<span class="NSspan6">
										<div class="NSdiv1" style="background-position: -36px -108px;"></div>
									</span>
									<div class="NSdiv2">Text</div>
								</span>
								<span class="NSspan5">
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconSelect('write')">Select</button>
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconPaste('write')">Paste</button>
								</span>
							</span>
						</span>
						<!--
						<span class="NSspan2">
							<span class="NSspan3">
								<span class="NSspan4">
									<span class="NSspan6">
										<div class="NSdiv1" style="background-position: -108px 0px;"></div>
									</span>
									<div class="NSdiv2">Copy</div>
								</span>
								<span class="NSspan5">
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconSelect('copy')">Select</button>
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconPaste('copy')">Paste</button>
								</span>
							</span>
							<span class="NSspan3">
								<span class="NSspan4">
									<span class="NSspan6">
										<div class="NSdiv1" style="background-position: -36px -108px;"></div>
									</span>
									<div class="NSdiv2">Text</div>
								</span>
								<span class="NSspan5">
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconSelect('write')">Select</button>
									<button class="optionButton" style="max-height: 25px;" onclick="NS.iconPaste('write')">Paste</button>
								</span>
							</span>
						</span>
						-->
					</span>
				`;
                thisWindow.container.innerHTML = content;

                NS.iconSelect = function (iconsName) {
                    OWOP.tool.allTools.copy.extra.tempCallback = function (data) {
                        if (data.length !== 36 || data[0].length !== 36) {
                            OWOP.chat.local("The size needs to be (36 by 36).");
                            return false;
                        }
                        NS.localStorage.cursors[iconsName].icon = NS.setImageData(data).toDataURL();
                        localStorage.NS = JSON.stringify(NS.localStorage);
                        return true;
                    }
                    OWOP.player.tool = "copy";
                }
                NS.iconPaste = function (iconsName) {
                    // let offset = [0, 0];
                    let icon = dataImages?.[iconsName];
                    if (icon === undefined) dataImages.cursor;
                    let img = document.createElement("img");
                    img.src = icon;
                    img.onload = function () {
                        ((onblob) => {
                            let c1 = document.createElement('canvas');
                            let ctx1 = c1.getContext('2d');
                            ctx1.drawImage(img, 0, 0);
                            let iconImageData = ctx1.getImageData(0, 0, 36, 36);
                            let c2 = document.createElement('canvas');
                            c2.width = 38;
                            c2.height = 38;
                            let ctx2 = c2.getContext('2d');
                            ctx2.fillStyle = "#000000";
                            ctx2.fillRect(0, 0, c2.width, c2.height);
                            for (let y = 0; y < 36; y++) {
                                for (let x = 0; x < 36; x++) {
                                    let pix = iconImageData.data[4 * (y * 36 + x) + 3];
                                    if (pix < 255) {
                                        iconImageData.data[4 * (y * 36 + x)] = 255;
                                        iconImageData.data[4 * (y * 36 + x) + 1] = 255;
                                        iconImageData.data[4 * (y * 36 + x) + 2] = 255;
                                        iconImageData.data[4 * (y * 36 + x) + 3] = 255;
                                    }
                                }
                            }
                            ctx2.putImageData(iconImageData, 1, 1);
                            c2.toBlob(onblob);
                        })(b => {
                            let url = URL.createObjectURL(b);
                            let image = new Image();
                            image.onload = () => {
                                OWOP.tool.allTools.paste.extra.k = image;
                                OWOP.player.tool = "move";
                                OWOP.player.tool = "paste";
                            }
                            image.src = url;
                        });
                    }
                }
            }

            NS.windows[windowName] = new GUIWindow(windowName, options, windowFunc).hide();
        }());

        // assets
        ((true) && !function () {
            let windowName = "Assets";
            let options = {
                close: true,
                minimize: false,
                lock: true
            }

            let G = r => document.getElementById(r);

            function windowFunc(thisWindow) {
                thisWindow.frame.style.width = "500px";
                let innerFrame = document.createElement("div");
                let realAssetsCont = mkHTML("div", {
                    id: "real-assets-cont"
                });
                let p = mkHTML("p");
                p.style["margin-block"] = "auto";
                p.style["display"] = "flex";
                p.style["justify-content"] = "space-evenly";

                let J = () => {
                    NS.assets = localStorage.MB_Assets;
                    if (!NS.assets) NS.assets = [];
                    else NS.assets = JSON.parse(NS.assets);
                    let y = G("real-assets-cont");
                    y.innerHTML = '';
                    for (let p0 in NS.assets) {
                        let p1 = new Image();

                        p1.onload = () => {
                            p1.style.width = '48px';
                            p1.style.height = '48px';
                            p1.style.border = 'solid 1px';

                            p1.onclick = () => {
                                for (let p4 in G('real-assets-cont').children) {
                                    if (typeof G('real-assets-cont').children[p4] !== 'object') break;
                                    G('real-assets-cont').children[p4].style.border = 'solid 1px';
                                }
                                if (NS.selectedImg) {
                                    NS.selectedImg.style.width = '48px';
                                    NS.selectedImg.style.height = '48px';
                                }
                                NS.selectedAsset = NS.assets[p0];
                                NS.selectedAssetIndex = p0;
                                NS.selectedImg = p1;
                                p1.style.width = '40px';
                                p1.style.height = '40px';
                                p1.style.border = 'solid 5px black';
                            };

                            p1.oncontextmenu = p3 => {
                                p3.preventDefault();
                                NS.assets.splice(p0, 1);
                                localStorage.MB_Assets = JSON.stringify(NS.assets);
                                J();
                            };

                            y.append(p1);
                        };

                        p1.src = NS.assets[p0];
                    }
                };

                let X = (r = '*') => new Promise(Q => {
                    let c = document.createElement('input');
                    c.type = 'file';
                    c.accept = r;

                    c.onchange = () => {
                        let N = new FileReader();

                        N.onloadend = () => {
                            Q(N.result);
                        };

                        N.readAsDataURL(c.files[0]);
                    };

                    c.onclick = () => void 0;

                    c.click();
                });

                let button1 = mkHTML("button", {
                    id: "NSoptions",
                    innerHTML: "Add"
                });

                let button2 = mkHTML("button", {
                    id: "NSoptions",
                    innerHTML: "Paste"
                });

                let button3 = mkHTML("button", {
                    id: "NSoptions",
                    innerHTML: "Delete"
                });

                let button4 = mkHTML("button", {
                    id: "NSoptions",
                    innerHTML: "Reload"
                });

                button1.onclick = async () => {
                    OWOP.sounds.play(OWOP.sounds.click);
                    let pE = localStorage.MB_Assets;
                    if (!pE) pE = [];
                    else pE = JSON.parse(pE);
                    let _imgTotal = 0;
                    let _imageData = undefined;
                    {
                        let _lsTotal = 0;
                        let _xLen = undefined;
                        let _x = undefined;
                        for (_x in localStorage) {
                            if (!localStorage.hasOwnProperty(_x)) {
                                continue;
                            }
                            _xLen = ((localStorage[_x].length + _x.length) * 2);
                            _lsTotal += _xLen;
                        }
                        //console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");
                        if ((_lsTotal / 1024) > 3000) return OWOP.chat.local(`Storage limit reached (3MB), remove images to add more.`);
                        _imgTotal = _lsTotal;
                    }
                    {
                        _imageData = await X('image/*');
                        let _lsTotal = 0;
                        let _x = undefined;
                        _x = JSON.stringify(_imageData);
                        _lsTotal = _x.length * 2;
                        //console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");
                        if ((_lsTotal / 1024) > 500) {
                            if (((_lsTotal + _imgTotal) / 1024) > 3000) return OWOP.chat.local(`Image being added is more than Storage limit (3KB)`);
                            if (!confirm(`Are you sure you want to add a image with ${(_lsTotal / 1024).toFixed(2)} KB`)) return;
                        }
                    }
                    pE.push(_imageData);
                    localStorage.MB_Assets = JSON.stringify(pE);
                    J();
                };

                button2.onclick = () => {
                    OWOP.sounds.play(OWOP.sounds.click);
                    let img = new Image();
                    img.onload = () => {
                        OWOP.tool.allTools.paste.extra.k = img;
                        OWOP.player.tool = "move";
                        OWOP.player.tool = "paste";
                    }
                    img.src = NS.selectedAsset;
                };

                button3.onclick = () => {
                    OWOP.sounds.play(OWOP.sounds.click);
                    if (!NS.selectedAssetIndex) return;
                    if (confirm("Do you want to delete the selected asset?")) NS.assets.splice(NS.selectedAssetIndex, 1);
                    else return;
                    localStorage.MB_Assets = JSON.stringify(NS.assets);
                    J();
                };

                button4.onclick = () => {
                    OWOP.sounds.play(OWOP.sounds.click);
                    J();
                };

                button2.addEventListener("click", function () {
                    OWOP.sounds.play(OWOP.sounds.click)
                });
                p.appendChild(button1);
                p.appendChild(button2);
                p.appendChild(button3);
                p.appendChild(button4);
                innerFrame.appendChild(p);
                innerFrame.appendChild(realAssetsCont);
                thisWindow.addObj(innerFrame);
            }

            NS.windows[windowName] = new GUIWindow(windowName, options, windowFunc).hide();
        }());

        // patterns
        ((true) && !function () {
            let windowName = "Patterns";
            let options = {
                close: true,
                minimize: false,
                lock: true
            }

            function windowFunc(win) {
                let content = `
					<span style="display: flex;flex-direction:column;">
						<div class="ns_container">
							<div style="border: 10px #0000 solid;">
								<span class="tabp">
									<p>Columns: </p>
									<input id="patternCol" type="text" style="max-width: 100px; border: 0px;" placeholder="columns" value="8"></input>
								</span>
								<span class="tabp">
									<p>Rows: </p>
									<input id="patternRow" type="text" style="max-width: 100px; border: 0px;" placeholder="rows" value="8"></input>
								</span>
								<span id="patternSpanPatternColors">
								</span>
								<!--
								<span class="tabp">
									<p>Type</p>
									<select class="ns_dropdown" oninput="NS.patternSetting=this.value">
										<option value="default">Default</option>
										<option value="checkered">Checkered</option>
										<option value="1">Pattern 1</option>
										<option value="2">Pattern 2</option>
										<option value="3">Pattern 3</option>
										<option value="4">Pattern 4</option>
										<option value="5">Pattern 5</option>
										<option value="6">Pattern 6</option>
										<option value="7">Pattern 7</option>
										<option value="8">Pattern 8</option>
									</select>
								</span>
								-->
							</div>
						</div>
						<div class="ns_horizontal"></div>
						<div id="nsCanvasContainer" class="nscontainer" style="display: flex;align-content: space-around;">
						</div>
					</span>
				`;
                let container = win.container;
                container.style = "margin: 0px -5px -5px -5px;";
                container.className = "optionsDiv";
                container.innerHTML = content;

                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                canvas.width = 274;
                canvas.height = 274;
                canvas.textContent = "Your browser does not support the HTML canvas tag.";
                canvas.id = "nsCanvas";
                container.querySelector("#nsCanvasContainer").appendChild(canvas);

                ctx.strokeStyle = "black";
                ctx.lineWidth = 0;

                NS.pattern = [];
                for (let i = 0; i < 16; i++) {
                    NS.pattern.push([]);
                    for (let j = 0; j < 16; j++) {
                        NS.pattern[i].push({ on: false, c: "#000000", a: [0, 0, 0] });
                    }
                }

                container.querySelector("#patternSpanPatternColors").appendChild(optionmaker("Colors", "button", NS.patternColors, () => (NS.patternColors = !NS.patternColors, setPatternSize())));

                function fill(color) {
                    ctx.fillStyle = color;
                }

                function drawRect(x, y, width, height) {
                    ctx.fillRect(x, y, width, height);
                }

                function makeCells(cols, rows) { // x by y, thats why its cols, rows
                    canvas.width = Math.min(16, Math.max(8, cols)) * 34 + 2;
                    canvas.height = Math.min(16, Math.max(8, rows)) * 34 + 2;
                    fill("#000000");
                    drawRect(0, 0, canvas.width, canvas.height);
                    for (let y = 0; y < Math.max(8, rows); y++) {
                        for (let x = 0; x < Math.max(8, cols); x++) {
                            fill("#1f1f1f");
                            if (x < cols && y < rows) (fill("#ffffff"), drawRect(x * 34 + 2, y * 34 + 2, 32, 32), NS.pattern[x][y].on ? (NS.patternColors ? fill(NS.pattern[x][y].c) : fill("#aba389")) : (fill("#7e635c")));
                            drawRect(x * 34 + 3, y * 34 + 3, 30, 30);
                        }
                    }
                }

                function getMousePos(canvas, evt) {
                    let rect = canvas.getBoundingClientRect();
                    return {
                        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
                        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
                    };
                }

                let col = container.querySelector("#patternCol");
                let row = container.querySelector("#patternRow");

                function setPatternSize() {
                    if (col.value.length === 0 || row.value.length === 0) return;
                    let c = parseInt(col.value);
                    let r = parseInt(row.value);
                    if (!c || !r) return;
                    r = Math.min(16, Math.max(1, r));
                    c = Math.min(16, Math.max(1, c));
                    col.value = c;
                    row.value = r;
                    NS.pattern.x = c;
                    NS.pattern.y = r;
                    makeCells(c, r);
                }

                col.onchange = setPatternSize;
                row.onchange = setPatternSize;

                setPatternSize();

                let mode = false;
                let modeSwitch = false;
                function handleCanvasMouseEvent(event) {
                    switch (event.type) {
                        case "mousedown": {
                            event.preventDefault();
                            let { x, y } = getMousePos(canvas, event);
                            if (x / 34 >= 16 || y / 34 >= 16) return;
                            mode = true;
                            let x1 = x % 34;
                            let y1 = y % 34;
                            if (x1 < 3 || x1 > 32 || y1 < 3 || y1 > 32) return;
                            let e = NS.pattern[Math.floor(x / 34)][Math.floor(y / 34)];
                            modeSwitch = true;
                            if (!NS.patternColors || !(e.on && e.c !== OWOP.player.htmlRgb)) modeSwitch = e.on = !e.on;
                            e.c = OWOP.player.htmlRgb;
                            e.a = OWOP.player.selectedColor;
                            setPatternSize();
                        } break;
                        case "mousemove": {
                            event.preventDefault();
                            let { x, y } = getMousePos(canvas, event);
                            if (x / 34 >= 16 || y / 34 >= 16) return;
                            if (!mode) break;
                            let x1 = x % 34;
                            let y1 = y % 34;
                            if (x1 < 3 || x1 > 32 || y1 < 3 || y1 > 32) return;
                            let e = NS.pattern[Math.floor(x / 34)][Math.floor(y / 34)];
                            e.on = modeSwitch;
                            e.c = OWOP.player.htmlRgb;
                            e.a = OWOP.player.selectedColor;
                            setPatternSize();
                        } break;
                        case "mouseup": {
                            mode = false;
                        } break;
                    }
                }

                canvas.addEventListener("mousedown", handleCanvasMouseEvent);
                canvas.addEventListener("mousemove", handleCanvasMouseEvent);
                canvas.addEventListener("mouseup", handleCanvasMouseEvent);

            }

            NS.windows[windowName] = new GUIWindow(windowName, options, windowFunc).hide();
        }());

        // custom modification to colors
        ((true) && !function () {
            undefined;
        }());

        // options
        ((true) && !function () {
            let windowName = "Options";
            let options = {
                close: false,
                minimize: true,
                lock: true
            }

            function windowFunc(thisWindow) {
                let content = `
					<span>
						<span id="optionsMinimize" style="display: flex;">
						<style>
							p {
								margin-block: auto;
								color: white;
								font-family: Arial;
							}
								.tabcontentleft, .tabcontentright {
								display: none;
								margin-block: auto;
								text-align: center;
							}
							.tabButton, .optionButton {
								border-style: none !important;
								border-image: none !important;
								border: initial;
								border-radius: 6px;
								padding: 5px 8px;
							}
							.optionButton {
								padding: 5px 12px;
							}
							.tabButton {
								margin: 0px 1px;
							}
							button.on {
								background: #9a937b;
							}
						</style>
						<!--dont be a idiot, put the #7e635c back into the styling of background-color when halloween is over
						and put it to #5e038f when halloween happens
						also dont forget to switch button.on up there to #9a937b and switch to #6e009a on halloween
						change box-shadow to #440f58 on halloween and #4d313b when not-->
						<div style="display: flex;margin: 0px;border-radius: 5px;background-color: #7e635c;box-shadow: inset 3px 2px 0px 0px #4d313b;align-content: space-around;">
							<span style="border: 10px #0000 solid;">
								<div class="tab">
									<div style="align-content: center;margin: 0px 0px 5px 0px;display: flex;justify-content: space-between;">
									<button class="tabButton olt on" onclick="NS.switchTabs(event, 'display', 'olt', this)">
										Window Display
									</button>
									<button class="tabButton olt" onclick="NS.switchTabs(event, 'options', 'olt', this)">
										Options
									</button>
									</div>
									<div id="display" class="tabcontentolt" style="display: block;"></div>
									<div id="options" class="tabcontentolt" style="display: none;"></div>
								</div>
							</span>
						</div>
						<div style="width: 5px;"></div>
							<!--dont be a idiot, put the #7e635c back into the styling of background-color when halloween is over
							and put it to #5e038f when halloween happens
							change box-shadow to #440f58 on halloween and #4d313b when not-->
							<div style="display: flex;margin: 0px;border-radius: 5px;background-color: #7e635c;box-shadow: inset 3px 2px 0px 0px #4d313b;align-content: space-around;">
								<span style="border: 10px #0000 solid;">
								<div class="tab">
									<span>
										<div style="align-content: center;margin: 0px 0px 5px 0px;display: flex;justify-content: space-between;">
											<button class="tabButton ort on" onclick="NS.switchTabs(event, 'cursor', 'ort', this)">
												Cursor
											</button>
											<button class="tabButton ort" onclick="NS.switchTabs(event, 'line', 'ort', this)">
												Line
											</button>
											<button class="tabButton ort" onclick="NS.switchTabs(event, 'fill', 'ort', this)">
												Bucket
											</button>
											<button class="tabButton ort" onclick="NS.switchTabs(event, 'export', 'ort', this)">
												Select
											</button>
										</div>
										<div style="align-content: center;margin: 0px 0px 5px 0px;display: flex;justify-content: space-between;">
											<button class="tabButton ort" onclick="NS.switchTabs(event, 'copy', 'ort', this)">
												Copy
											</button>
											<button class="tabButton ort" onclick="NS.switchTabs(event, 'paste', 'ort', this)">
												Paste
											</button>
											<button class="tabButton ort" onclick="NS.switchTabs(event, 'write', 'ort', this)">
												Write
											</button>
											<button class="tabButton ort" onclick="NS.switchTabs(event, 'all', 'ort', this)">
												All
											</button>
										</div>
									</span>
									<div id="cursor" class="tabcontentort" style="display: block;">
										<div class="tabp">
											<p>Scale</p>
											<input type="range" style="margin: 0px 15px;" value="1" min="1" max="16" oninput="OWOP.tool.allTools.cursor.extra.state.scalar = this.value;document.getElementById('cursorspan').innerHTML = this.value;"></input>
											<span style="padding: 4px 0px 5px 0px;" id="cursorspan">1</span>
										</div>
										<div class="tabp">
											<p>Chunkize</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'chunkize')">off</button>
										</div>
										<div class="tabp">
											<p>Rainbow</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'rainbow')">off</button>
										</div>
										<div class="tabp">
											<p>Pixel Perfect</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'perfect')">off</button>
										</div>
										<div class="tabp">
											<p>Copy Coords</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'copyCoords')">off</button>
										</div>
									</div>
									<div id="line" class="tabcontentort" style="display: none;">
										<div class="tabp">
											<p>Rainbow</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'rainbow')">off</button>
										</div>
										<div class="tabp">
											<p>Gradient</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'gradient')">off</button>
										</div>
									</div>
									<div id="fill" class="tabcontentort" style="display: none;">
										<div class="tabp">
											<p>Rainbow</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'rainbow')">off</button>
										</div>
										<div class="tabp">
											<p>Enable Patterns</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'patterns')">off</button>
										</div>
										<!--
										<div class="tabp">
											<p>Open Pattern Window</p>
											<button class="optionButton switch" onclick="">off</button>
										</div>
										-->
										<div class="tabp">
											<p>Checkered</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'checkered')">off</button>
										</div>
										<div class="tabp">
											<p>Pattern 1</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'dither')">off</button>
										</div>
										<div class="tabp">
											<p>Pattern 2</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'dither2')">off</button>
										</div>
										<div class="tabp">
											<p>Pattern 3</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'dither3')">off</button>
										</div>
										<div class="tabp">
											<p>Pattern 4</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'dither4')">off</button>
										</div>
										<div class="tabp">
											<p>Pattern 5</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'dither5')">off</button>
										</div>
										<div class="tabp">
											<p>Pattern 6</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'dither6')">off</button>
										</div>
										<div class="tabp">
											<p>Pattern 7</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'dither7')">off</button>
										</div>
										<div class="tabp">
											<p>Pattern 8</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'dither8')">off</button>
										</div>
									</div>
									<div id="export" class="tabcontentort" style="display: none;">
										<div class="tabp">
											<p>Type</p>
											<select class="ns_dropdown" oninput="OWOP.tool.allTools.export.extra.state.type=this.value">
												<option value="export">Export</option>
												<option value="color">Palette Color Adder</option>
												<option value="adder">Queue Adder</option>
												<option value="filler">Queue Filler</option>
												<option value="clearer">Queue Clearer</option>
											</select>
										</div>
										<div class="tabp">
											<p>Chunkize</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'chunkize')">off</button>
										</div>
										<div class="tabp">
											<p>Rainbow</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'rainbow')">off</button>
										</div>
									</div>
									<div id="copy" class="tabcontentort" style="display: none;">
										<div class="tabp">
											<p>Chunkize</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'chunkize')">off</button>
										</div>
										<!--
										<div class="tabp">
											<p>Shrink Margins</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'margin')">off</button>
										</div>
										-->
									</div>
									<div id="paste" class="tabcontentort" style="display: none;">
										<div class="tabp">
											<p>Chunkize</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'chunkize')">off</button>
										</div>
										<div class="tabp">
											<p>Rotate Clockwise</p>
											<button class="optionButton click" onclick="NS.optionbutton(this, 'rc')">&nbsp;&nbsp;&nbsp;&nbsp;</button>
										</div>
										<div class="tabp">
											<p>Rotate the other way</p>
											<button class="optionButton click" onclick="NS.optionbutton(this, 'rcc')">&nbsp;&nbsp;&nbsp;&nbsp;</button>
										</div>
										<div class="tabp">
											<p>Flip Horizontally</p>
											<button class="optionButton click" onclick="NS.optionbutton(this, 'fh')">&nbsp;&nbsp;&nbsp;&nbsp;</button>
										</div>
										<div class="tabp">
											<p>Flip Vertically</p>
											<button class="optionButton click" onclick="NS.optionbutton(this, 'fv')">&nbsp;&nbsp;&nbsp;&nbsp;</button>
										</div>
										<div class="tabp">
											<p>Right Color Clear</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'newButton')">off</button>
										</div>
									</div>
									<div id="write" class="tabcontentort" style="display: none;">
										<div class="tabp">
											<p>Rainbow</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'rainbow')">off</button>
										</div>
										<!--
										<div class="tabp">
											<p>Font Size</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'gradient')">off</button>
										</div>
										<div class="tabp">
											<p>Font Type</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'gradient')">off</button>
										</div>
										-->
									</div>
									<!--
									<div id="all" class="tabcontentort" style="display: none;">
										<div class="tabp">
											<p>Rainbow</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'rainbow')">off</button>
										</div>
										<div class="tabp">
											<p>Some color stuff</p>
											<button class="optionButton switch" onclick="NS.optionbutton(this, 'gradient')">off</button>
										</div>
									</div>
									-->
								</div>
								</span>
							</div>
						</span>
						<span id="optionsMaximize" style="display: none;">
							<div style="display: flex;margin: 0px;border-radius: 5px;background-color: #7e635c;box-shadow: inset 3px 2px 0px 0px #4d313b;align-content: space-around;">
								<span style="border: 10px #0000 solid;">
								<button class="optionButton" onclick="NS.minimizeOptions(false)">Maximize</button>
								</span>
							</div>
						</span>
					</span>
				`;
                let container = thisWindow.container;
                container.style = "margin: 0px -5px -5px -5px;";
                container.className = "optionsDiv";
                container.innerHTML = content;
                const root = [...container.childNodes].find(e => e.nodeType !== Node.TEXT_NODE);
                let display = root.querySelector("#display");
                for (let w in NS.windows) {
                    w = NS.windows[w];
                    if (w.title === "Options" || w.title === "Resulting image") continue;
                    if (w.title !== "Tools") {
                        w.frame.style.visibility = "hidden";
                        let b = w.frame.querySelectorAll(".windowCloseButton");
                        if (b.length) w.frame.removeChild(b[0]);
                    }
                    let current = mkHTML("p");
                    current.className = "tabp";
                    current.appendChild(mkHTML("p", { innerHTML: w.title }));
                    current.appendChild(w.windowbutton);
                    display.appendChild(current);
                }
                let options = root.querySelector("#options");

                options.appendChild(optionmaker("Disable PM", "button", !NS.PM.enabled, () => NS.PM.enabled = !NS.PM.enabled));
                options.appendChild(optionmaker("Disable PM mod", "button", !NS.PM.enableMod, () => NS.PM.enableMod = !NS.PM.enableMod));
                options.appendChild(optionmaker("Ignore Protection", "button", NS.PM.ignoreProtectedChunks, () => NS.PM.ignoreProtectedChunks = !NS.PM.ignoreProtectedChunks));
                options.appendChild(optionmaker("Clear PM", "select", void 0, () => NS.PM.clearQueue()));
                options.appendChild(optionmaker("Render PM", "button", NS.PM.renderBorder, () => NS.PM.renderBorder = !NS.PM.renderBorder));
                options.appendChild(optionmaker("Render Rings", "button", NS.PM.renderPlayerRings, () => NS.PM.renderPlayerRings = !NS.PM.renderPlayerRings));
                options.appendChild(optionmaker("AutoFix", "button", NS.PM.autoMove, () => NS.PM.autoMove = !NS.PM.autoMove));
                /* options.appendChild(optionmaker("Mute", "button", !OWOP.options.enableSounds, () => {
                    OWOP.options.enableSounds = !OWOP.options.enableSounds;
                    localStorage.options = JSON.stringify({ enableSounds: OWOP.options.enableSounds });
                })); */
                options.appendChild(optionmaker("Undo", "select", void 0, () => PM.undo()));
                options.appendChild(optionmaker("Redo", "select", void 0, () => PM.redo()));
                options.appendChild(optionmaker("Minimize Options", "select", void 0, () => NS.minimizeOptions(true)));

                NS.switchTabs = function (evt, cityName, s, button) {
                    let i = undefined;
                    let tabcontent = undefined;
                    let tablinks = undefined;
                    tabcontent = document.getElementsByClassName("tabcontent" + s);
                    for (i = 0; i < tabcontent.length; i++) {
                        tabcontent[i].style.display = "none";
                    }
                    tablinks = document.getElementsByClassName(s);
                    for (i = 0; i < tablinks.length; i++) {
                        tablinks[i].classList.remove("on");
                    }
                    button.classList.add("on");
                    document.getElementById(cityName).style.display = "block";
                }
                NS.optionbutton = function (button, state) {
                    let type = "unknown";
                    let s = true;
                    if (button.classList.contains("switch")) type = "switch";
                    if (button.classList.contains("click")) type = "click";
                    if (type === "unknown") return;
                    let parent1 = button.parentElement;
                    let parent2 = parent1.parentElement;
                    if (type === "switch") {
                        button.classList.toggle("on");
                        s = button.classList.contains("on");
                        button.innerHTML = s ? "on" : "off";
                    }
                    let extraState = OWOP.tool.allTools[parent2.id].extra.state;
                    if (typeof extraState[state] === "function") {
                        if (parent2.className === "tabcontentort" && parent2.id !== "all") extraState[state](s);
                    } else {
                        if (parent2.className === "tabcontentort" && parent2.id !== "all") extraState[state] = s;
                    }
                }
                NS.minimizeOptions = function (_minimize) {
                    NS.windows["Options"].toggleminimize();
                }
            }

            NS.windows[windowName] = new GUIWindow(windowName, options, windowFunc);
        }());
    }());
}

function init() {
    // Math.abs(i*j) <= 510 ? Math.abs(i*j)%255 : 0
    if (document.getElementById("load-scr")?.style?.transform && OWOP?.player?.tool) {
        console.time("Neko");
        console.log("Loading Neko's Scripts.");
        install();
        console.log("Neko's Scripts Loaded.");
        console.timeEnd("Neko");
    } else {
        setTimeout(init, 1e2);
    }
}

init();
