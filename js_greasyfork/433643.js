// ==UserScript==
// @name         Base Zones
// @description  diep.io base zone script
// @version      1.4
// @author       none
// @match        *://diep.io/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @license      none
// @namespace https://greasyfork.org/users/790354
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/433643/Base%20Zones.user.js
// @updateURL https://update.greasyfork.org/scripts/433643/Base%20Zones.meta.js
// ==/UserScript==
'use strict';
function drawZones(x, y) {
    if (player.dead) return;
    let corner = 11.5/27*arenaDim;
    let arenaCorner = arenaDim/2;
    if (player.gamemode === 'teams') {
        ctx.fillStyle = '#00B1DE14';
        ctx.beginPath();
        ctx.fillRect(-arenaCorner-x, -arenaDim/2-y, arenaDim/4.05, arenaDim);
        ctx.fillStyle = '#F14E5414';
        ctx.beginPath();
        ctx.fillRect(arenaCorner-x, -arenaDim/2-y, -arenaDim/4.05, arenaDim);
        ctx.fillStyle = '#00B1DE24';
        ctx.beginPath();
        ctx.fillRect(-arenaCorner-x, -arenaDim/2-y, arenaDim/5.51, arenaDim);
        ctx.fillStyle = '#F14E5424';
        ctx.beginPath();
        ctx.fillRect(arenaCorner-x, -arenaDim/2-y, -arenaDim/5.51, arenaDim);
    }
    if (player.gamemode === '4teams') {
        ctx.lineWidth = 20;
        //Calibration (change corner 1 so that the circles align with base center)
        //Blue
        ctx.fillStyle = '#00000011';
        ctx.beginPath();
        ctx.ellipse(-corner-x, -corner-y, 100,100,0, 0, 2*Math.PI);
        ctx.fill();
        //Purple
        ctx.fillStyle = '#00000011';
        ctx.beginPath();
        ctx.ellipse(corner-x, -corner-y, 100,100,0, 0, 2*Math.PI);
        ctx.fill();
        //Green
        ctx.fillStyle = '#00000011';
        ctx.beginPath();
        ctx.ellipse(-corner-x, corner-y, 100,100,0, 0, 2*Math.PI);
        ctx.fill();
        //Red
        ctx.fillStyle = '#00000011';
        ctx.beginPath();
        ctx.ellipse(corner-x, corner-y, 100,100,0, 0, 2*Math.PI);
        ctx.fill();
        //Zone Rendering Outer
        //Blue
        ctx.fillStyle = '#00B1DE18';
        ctx.beginPath();
        ctx.ellipse(-corner-x, -corner-y, arenaDim/4.25,arenaDim/4.25,0, 0, 2*Math.PI);
        ctx.fill();
        //Purple
        ctx.fillStyle = '#BF7FF518';
        ctx.beginPath();
        ctx.ellipse(corner-x, -corner-y, arenaDim/4.25,arenaDim/4.25,0, 0, 2*Math.PI);
        ctx.fill();
        //Green
        ctx.fillStyle = '#00E16E18';
        ctx.beginPath();
        ctx.ellipse(-corner-x, corner-y, arenaDim/4.25,arenaDim/4.25,0, 0, 2*Math.PI);
        ctx.fill();
        //Red
        ctx.fillStyle = '#F14E5418';
        ctx.beginPath();
        ctx.ellipse(corner-x, corner-y, arenaDim/4.25,arenaDim/4.25,0, 0, 2*Math.PI);
        ctx.fill();
        //Zone Rendering Inner
        //Blue
        ctx.fillStyle = '#00B1DE26';
        ctx.beginPath();
        ctx.ellipse(-corner-x, -corner-y, arenaDim/5.75,arenaDim/5.75,0, 0, 2*Math.PI);
        ctx.fill();
        //Purple
        ctx.fillStyle = '#BF7FF526';
        ctx.beginPath();
        ctx.ellipse(corner-x, -corner-y, arenaDim/5.75,arenaDim/5.75,0, 0, 2*Math.PI);
        ctx.fill();
        //Green
        ctx.fillStyle = '#00E16E26';
        ctx.beginPath();
        ctx.ellipse(-corner-x, corner-y,arenaDim/5.75,arenaDim/5.75,0, 0, 2*Math.PI);
        ctx.fill();
        //Red
        ctx.fillStyle = '#F14E5426';
        ctx.beginPath();
        ctx.ellipse(corner-x, corner-y, arenaDim/5.75,arenaDim/5.75,0, 0, 2*Math.PI);
        ctx.fill();
    }
}
class Minimap {
    constructor() {
        this._minimapWidth;
        this._minimapHeight;
        this._x00;
        this._y00;
        this._pointX;
        this._pointY;
        this._pointX_previous;
        this._pointY_previous;
        this._viewportX;
        this._viewportY;
        this._fov;

        this._minimapHook();
        this._viewportHook();
        this._fovHook();}
    get fov() {
        return this._fov;
    }
    _minimapHook() {
        let setTransformArgs;
        const onsetTransform = (args) => {
            if (args[0] === args[3]) setTransformArgs = args;
        };
        const onstrokeRect = () => {
            if (setTransformArgs) {
                this._minimapWidth = setTransformArgs[0];
                this._minimapHeight = setTransformArgs[3];
                this._x00 = setTransformArgs[4] + setTransformArgs[0]/2;
                this._y00 = setTransformArgs[5] + setTransformArgs[3]/2;
                setTransformArgs = undefined;
            }
        };
        this._ctxHook('setTransform', onsetTransform);
        this._ctxHook('strokeRect', onstrokeRect);
    }
    _viewportHook() {
        let setTransformArgs;
        const onsetTransform = (args) => {
            if ((args[0] / args[3]).toFixed(2) !== (unsafeWindow.innerWidth / unsafeWindow.innerHeight).toFixed(2)) return;
            if (args[0] >= unsafeWindow.innerWidth && args[3] >= unsafeWindow.innerHeight) return;
            setTransformArgs = args;
        };
        const onfillRect = () => {
            if (setTransformArgs) {
                unsafeWindow.input.set_convar('ren_minimap_viewport', true);
                this._viewPortX = setTransformArgs[4] + 0*setTransformArgs[0]/2;
                this._viewPortY = setTransformArgs[5] + 0*setTransformArgs[3]/2;
                setTransformArgs = undefined;
            }
        };
        console.log(setTransformArgs);
        this._ctxHook('setTransform', onsetTransform);
        this._ctxHook('fillRect', onfillRect);
        setInterval(() => {
            unsafeWindow.input.set_convar('ren_minimap_viewport', true);
        }, 1000);
    }
    _fovHook() {
        let solid_background = false;
        setTimeout(() => {
            solid_background = unsafeWindow.input.get_convar('ren_solid_background') === 'true' ? true : false;
        }, 1000);
        const calculateFov = (fov) => {
            this._fov = fov * 10;
        };
        function onstroke() {
            if (this.fillStyle === '#cdcdcd') {
                if (solid_background) unsafeWindow.input.set_convar('ren_solid_background', true);
                calculateFov(this.globalAlpha);
            }
        }
        this._ctxHook('stroke', onstroke);

        setInterval(() => {
            if (solid_background) unsafeWindow.input.set_convar('ren_solid_background', false);
        }, 10000);
    }
    _ctxHook(method, hook) {
        const target = window.CanvasRenderingContext2D.prototype;
        target[method] = new Proxy(target[method], {
            apply(target, thisArg, args) {
                args = hook.call(thisArg, args) || args;
                return target.apply(thisArg, args);
            },
        });
    }
}
class Player {
    constructor() {
        this._minimap = new Minimap();
        this._dead = true;
    }
    get dead() {
        return !(score >=0);
    }
    get gamemode() {
        return unsafeWindow.localStorage.gamemode;
    }
}

const player = new Player();
const minimap = new Minimap();
var arenaDim;
var score = NaN;
var fov;
var isAfk = 0;
//setup canvas
const canvas = document.getElementById('canvas');
const ctx = document.getElementById('canvas').getContext('2d');
// run main Loop
unsafeWindow.requestAnimationFrame = new Proxy(unsafeWindow.requestAnimationFrame, {
    apply: function (target, thisArg, args) {
        fov = player._minimap.fov / 0.55;
        arenaDim = 11150*1.1*fov;
        //Helpers
        let scaleX = (minimap._viewPortX - minimap._x00) / minimap._minimapWidth;
        let scaleY = (minimap._viewPortY - minimap._y00) / minimap._minimapWidth;
        let posX = scaleX * arenaDim;
        let posY = scaleY * arenaDim;
        drawZones(posX, posY);
        setTimeout(() => Reflect.apply(target, thisArg, args), 0);
    },
});
CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
    apply(fillRect, ctx, [text, x, y, ...blah]) {
        if (text.startsWith("Score:")) {
            score = parseFloat(text.slice(7).replace(',', ''));
        }
        fillRect.call(ctx, text, x, y, ...blah);
    }
});