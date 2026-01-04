// ==UserScript==
// @name         Gartic.io Drawing Bot
// @namespace    gartic-haifa0000-v1
// @version      1.0
// @description  A bot to paint from images in gartic.io
// @author       Queen Haifa (githun.com: haifa0000)
// @license      GPLv3
// @match        https://gartic.io/*
// @icon         https://w0.peakpx.com/wallpaper/1022/369/HD-wallpaper-pretty-anime-girl-cute-fun.jpg
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467019/Garticio%20Drawing%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/467019/Garticio%20Drawing%20Bot.meta.js
// ==/UserScript==

// Anti change name

class YuriWSOriginal extends WebSocket {}
const YuriAPI = {
    roomCode: 1677864451914,
    ws: undefined,
    setColor: function([r,g,b]) {
        var hex = 'x';
        hex += [r, g, b].map(x => {
            const hex = x.toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }).join('').toUpperCase();
        if (this.color === hex) return;
        this.color = hex;
        this.ws.send(`42[10,${this.roomCode},[5,"${hex}"]]`)
    },
    setScale: function(scale) {
        // Primitive but gets the job done, shut the fuck up
        this.ws.send(`42[10,${this.roomCode},[6,"${scale}"]]`);
        this.scale = scale;
    },
    scale: 0,
    color: undefined,
    rect: function(sx, sy, w, h) {
        this.ws.send(`42[10,${this.roomCode},[1,2,${sx},${sy},${sx+w},${sy+h}]]`)
    },
    putPixel: function(x, y) {
        this.ws.send(`42[10,${this.roomCode},[2,${x},${y}]]`);
    },
    inputFile: function() {
        const sx = 200, sy = 200, scale = 2;
        const el = document.createElement('input');
        el.type = 'file'
        const fr = new FileReader();
        const looper = [];
        el.onchange = function() {
            const file = el.files[0];
            if (!file) return;
            fr.readAsDataURL(file);

            fr.onload = function() {
                const src = fr.result;
                const img = new Image();
                img.src = src;
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const data = ctx.getImageData(0, 0, img.width, img.height).data;
                    for (let y = 0;y < img.height;y++) {
                        for (let x = 0;x < img.width;x++) {
                            var i = 4*((y*img.width)+x);
                            var r = data[i];
                            var g = data[i+1];
                            var b = data[i+2];
                            var packet = {
                                rgb: [r,g,b],
                                x: sx + (scale * x),
                                y: sy + (scale * y)
                            }
                            looper.push(packet);
                        }
                    }
                }
            };

            fr.onerror = function() {
                console.log(fr.error);
            };
        }
        el.click();
        setInterval(function() {
            var packet = looper.shift();
            if (!packet) return;
            var {rgb,x,y} = packet;
            YuriAPI.setColor(rgb);
            YuriAPI.putPixel(x, y);
        }, 1);
        console.log(el);
    },
    ui: function() {
        const button = document.createElement('button');
        button.textContent = 'بوت رسم';
        button.addEventListener('click', this.inputFile);
        button.style.position = 'absolute';
        button.style.left = '100px';
        button.style.top = '50px';
        button.style.zIndex = '1000';
        button.style.background = 'lime';
        button.style.width = '100px';
        button.style.fontFamily = 'Verdana';
        button.style.height = '50px';
        document.body.append(button);
    }
}
window.YuriAPI = YuriAPI;
YuriAPI.ui();
window.WebSocket = class extends WebSocket {
    constructor(a,b) {
        super(a,b);
        if (YuriAPI.ws != undefined) console.warn('Refreshing YuriWS');
        console.info('Hooked WebSocket');
        YuriAPI.ws = this;
        this.constructor.toString = YuriWSOriginal.constructor.toString;
        this.addEventListener('message', a => {
            const str = a.data;
            if (!str.startsWith('42')) return;
            const json_str = str.slice(2);
            const json = JSON.parse(json_str);
            if (json[0] == 5) {
                YuriAPI.roomCode = json[2];
                console.info('Room code: '+YuriAPI.roomCode);
            }
        })
    }
    toString() {
        super.toString();
    }
}