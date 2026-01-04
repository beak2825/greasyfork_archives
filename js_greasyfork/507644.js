// ==UserScript==
// @name         MooMoo.io estimated player detector
// @namespace    http://tampermonkey.net/
// @version      v1.3
// @description  How its works so when you hook an object like when you see it and someone break it the server send you an packet for the object breaked so im hooking the object in array and when the break packet come to client im checking to hooked object spawn ids and find the object spawn id.
// @author       Bianos
// @match        *://*.moomoo.io/*
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507644/MooMooio%20estimated%20player%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/507644/MooMooio%20estimated%20player%20detector.meta.js
// ==/UserScript==
// .co, .cos for clear all breakedObjects or its auto clearing in per by 10

let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
let msgpack_lite = window.msgpack;
let myplayer = {sid: null, x: null, y: null, x2: null, y2: null, alive: false};
let hookedws = window.WebSocket;
let ws;
let objects = [];
let breakedObjects = [];
window.WebSocket = function(...a) {
    ws = new hookedws(...a);
    ws.addEventListener('message', (event) => {
        let decoded = msgpack_lite.decode(new Uint8Array(event.data));
        let hooked;
        if (decoded.length > 1 && Array.isArray(decoded[1])) {
            hooked = [decoded[0], ...decoded[1]];
        } else {
            hooked = decoded
        }
        if(hooked[0] === 'C' && myplayer.sid == null) {
            myplayer.sid = hooked[1];
        }
        if(hooked[0] === 'P') {
            myplayer.alive = false
        }
        if(hooked[0] === '6') {
            if(hooked[1] === myplayer.sid) {
                if(['.co', '.clearo', '.clearobject', '.cos', '.clearobjects'].includes(hooked[2])) {
                    breakedObjects = [];
                }
            }
        }
        if(hooked[0] === 'H') {
            objects.push({sid: hooked[1][0], x: hooked[1][1], y: hooked[1][2], dir: hooked[1][3], scale: hooked[1][4], type: hooked[1][6], owner: hooked[1][7] })
        }
        if(hooked[0] === 'Q') {
            if(breakedObjects.length >= 10) breakedObjects = []
            let obj = objects.filter(obj => obj.sid === hooked[1])[0];
            if(Math.sqrt(Math.pow(myplayer.x - obj.x, 2) + Math.pow(myplayer.y - obj.y, 2)) >= 700) breakedObjects.push(obj);
        }
        if(hooked[0] === 'a') {
            let mphook = hooked.filter(s => s[0] == myplayer.sid)[0]
            if(mphook && mphook.length) {
                myplayer.alive = true;
                myplayer.x2 = mphook[1];
                myplayer.y2 = mphook[2];
            }
            let oplayer = hooked.filter(s => s[0] != myplayer.sid);
        }
    });
    return ws;
}


var delta = 0;
var now = Date.now();
var lastup = Date.now();
function update() {
    now = Date.now();
    delta = now - lastup;
    lastup = now;
    requestAnimationFrame(update);
}
update();

class Render {
    consturctor() {
        this.camX = 0;
        this.camY = 0;
        this.xOff = 0;
        this.yOff = 0;
    }


    async tick() {
        if(myplayer.alive) {
            let dist = Math.sqrt(Math.pow(myplayer.x - this.camX, 2) + Math.pow(myplayer.y - this.camY, 2));
            let dir = Math.atan2(myplayer.y - this.camY, myplayer.x - this.camX);
            let speed = Math.min(dist * 0.01 * delta, dist);
            if (dist > 0.05) {
                this.camX += Math.cos(dir) * speed;
                this.camY += Math.sin(dir) * speed;
            } else {
                this.camX = myplayer.x;
                this.camY = myplayer.y;
            }
            breakedObjects.forEach((obj) => {
                context.beginPath();
                context.strokeStyle = '#fff'
                context.lineWidth = 2
                context.moveTo(myplayer.x - this.xOff, myplayer.y - this.yOff);
                context.lineTo(obj.x - this.xOff, obj.y - this.yOff)
                context.stroke();
                context.closePath();
            })
        }
    }
}

let render = new Render;
Object.defineProperty(Object.prototype, "y", { // i got this code from MooMoo.js the link : https://github.com/MooMooForge/MooMoo.js/blob/c5a68dc9f8bca81e7e9165e0fd69453b372a1336/src/lib/rendering/initRendering.ts#L35
    get: function () {
        return this._y;
    },
    set: function (data) {
        if(this.sid == myplayer.sid) {
            myplayer.x = this.x;
            myplayer.y = this.y;
            render.xOff = render.camX - (1920 / 2);
            render.yOff = render.camY - (1080 / 2);
        }
        this._y = data;
    }
});


let clearrect = CanvasRenderingContext2D.prototype.clearRect;
CanvasRenderingContext2D.prototype.clearRect = function(...a) {
    clearrect.apply(this, a)
    render.tick();
}
