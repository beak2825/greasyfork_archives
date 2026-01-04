// ==UserScript==
// @name         leader arrow + player tracker
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  lololol
// @author       w-ccc (Modified by r!PsAw)
// @match        https://diep.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      NX, o2 can suck my ass
// @downloadURL https://update.greasyfork.org/scripts/538868/leader%20arrow%20%2B%20player%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/538868/leader%20arrow%20%2B%20player%20tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //config
    const opacities = {
        d_txt: 0.2,
        arc: 0.5,
        prediction_arc: 0.5,
        line: 0.3,
        tabs_minimap_points: 0.9,
        tabs_minimap_txt: 0.9,
        tabs_txt: 0.8,
        tabs_line: 0.3,
        tabs_arc: 0.5,
    };
    const color_choices = {
        d_txt: {
            fill: "black",
            stroke: "black"
        },
        arc: "blue",
        prediction_arc: "lightblue",
        line: "red",
        tabs_minimap_points: "black",
        tabs_minimap_txt: {
            fill: "white",
            stroke: "black",
        },
        tabs_txt: {
            fill: "yellow",
            stroke: "black",
        },
        tabs_line: "darkblue",
        tabs_arc: "purple",
    };
    const prediction_offset_factor = 30;

    //logic
    let baseIndex;
    let playerPosition;
    let fov;
    let minimapData = {
        x: null,
        y: null,
        width: null,
        height: null
    };

    let region = "";
    let gamemode = "";

    const ARENA_WIDTH = 22700;
    const ARENA_HEIGHT = 22700;
    const interval = 60;
    const TARGET_HEAP_VALUE = 32779;
    //const LEADER_X_INDEX = 19128; //Map center?
    const LEADER_X_INDEX = 18940;
    const LEADER_Y_INDEX = LEADER_X_INDEX + 1;
    const PLAYER_X_OFFSET = 65;
    const PLAYER_Y_OFFSET = PLAYER_X_OFFSET + 4;

    const win = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

    //EXTRA {Start}
    // Initialize used_ids from localStorage or empty array
let used_ids = localStorage.getItem("Tab list")
    ? JSON.parse(localStorage.getItem("Tab list"))
    : [];

function setTabIndex() {
    let i = 0;
    while (used_ids.includes(i)) {
        i++;
    }
    used_ids.push(i);
    localStorage.setItem("Tab list", JSON.stringify(used_ids));
    return i;
}

let tabIndex = setTabIndex();
console.log('GOT INDEX', tabIndex);
window.addEventListener("unload", () => {
    used_ids = JSON.parse(localStorage.getItem("Tab list")) || [];
    used_ids = used_ids.filter(id => id !== tabIndex);
    localStorage.setItem("Tab list", JSON.stringify(used_ids));
});
    // {End}

    win.Object.defineProperty(win.Object.prototype, "HEAPF32", {
        get: function() {
            return undefined;
        },
        set: function(newHeapF32) {
            if (!newHeapF32 || !this.HEAPU32) return;
            delete win.Object.prototype.HEAPF32;
            window.Module = this;
            window.Module.HEAPF32 = newHeapF32;
            win.Module = window.Module;
            win.aim = false;
            initialize();
        },
        configurable: true,
        enumerable: true
    });

    setInterval(() => {
        if (win.__common__ && win.__common__.active_region && win.__common__.active_gamemode) {
            region = win.__common__.active_region;
            gamemode = win.__common__.active_gamemode;
        }
    }, 1000);

    function initialize() {
        setInterval(() => {
            baseIndex = Array.prototype.findIndex.call(window.Module.HEAP32, value => value === TARGET_HEAP_VALUE);
        }, 1000);

        setInterval(() => {
            playerPosition = [
                window.Module.HEAPF32[baseIndex + PLAYER_X_OFFSET],
                window.Module.HEAPF32[baseIndex + PLAYER_Y_OFFSET],
                ''
            ];
           if(win.__common__){
               playerPosition[2] = win.__common__.killer_name ? win.__common__.killer_name : "";
               GM_setValue(`TAB INDEX ${tabIndex}`, JSON.stringify(playerPosition));
           }
        }, 1000 / interval);

        setInterval(() => {
            const leaderX = window.Module.HEAPF32[LEADER_X_INDEX];
            const leaderY = window.Module.HEAPF32[LEADER_Y_INDEX];
            if (Math.hypot(leaderX - playerPosition[0], leaderY - playerPosition[1]) > 3000) {
                GM_setValue(region + gamemode, JSON.stringify([leaderX, leaderY]));
            }
        }, 1000 / interval);
    }

    function setupCanvas() {
        let canvas = document.getElementById("canvas2");
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = "canvas2";
            canvas.style = "position:fixed;top:0;left:0;z-index:9999;pointer-events:none";
            document.body.appendChild(canvas);
        }
        resizeCanvas();
        return canvas;
    }

    function resizeCanvas() {
        const canvas = document.getElementById("canvas2");
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    function worldToScreenPosition(x, y) {
        const deltaX = x - playerPosition[0];
        const deltaY = y - playerPosition[1];
        const scaleFactor = fov / computeY(fov);
        const screenX = window.innerWidth / 2 + deltaX * scaleFactor;
        const screenY = window.innerHeight / 2 + deltaY * scaleFactor;
        return [screenX, screenY];
    }

    function computeY(x) {
        if (x === 0) {
            return 2.8;
        }
        return 0.947 / x + 1.507;
    }

    let distance = 0;
    let leaderData = [0, 0];
    let [leaderX, leaderY] = leaderData;
    function renderFrame() {
        requestAnimationFrame(renderFrame);
        const canvas = setupCanvas();
        const ctx = canvas.getContext("2d");

        leaderData = JSON.parse(GM_getValue(region + gamemode, "[]"));
        let otherTabsData = [];
        //console.log(used_ids);
        const tabs = used_ids.length;
        for(let i = 0; i < tabs; i++){
            //console.log(GM_getValue(`TAB INDEX ${i}`));
            otherTabsData.push(JSON.parse(GM_getValue(`TAB INDEX ${i}`)));
        }
        //console.log(otherTabsData);
        if (!ctx || !leaderData.length) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let [old_leaderX, old_leaderY] = [leaderX, leaderY];
        [leaderX, leaderY] = leaderData;
        let [diffX, diffY] = [(leaderX-old_leaderX)*prediction_offset_factor, (leaderY-old_leaderY)*prediction_offset_factor];
        let [predictX, predictY] = worldToScreenPosition(leaderX+diffX, leaderY+diffY);
        const [targetX, targetY] = worldToScreenPosition(leaderX, leaderY);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        //line to Leader
        ctx.globalAlpha = opacities.line;
        ctx.strokeStyle = color_choices.line;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        ctx.globalAlpha = 1;

        const circleRadius = (window.innerWidth / 256 + window.innerHeight / 144) / 2;
        ctx.globalAlpha = opacities.arc;
        ctx.fillStyle = color_choices.arc;
        ctx.beginPath();
        ctx.arc(targetX, targetY, circleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.globalAlpha = opacities.prediction_arc;
        ctx.fillStyle = color_choices.prediction_arc;
        ctx.beginPath();
        ctx.arc(predictX, predictY, circleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        let new_distance = Math.hypot(leaderX - playerPosition[0], leaderY - playerPosition[1]).toFixed(1);
        let emoji = (diffX == 0 && diffY == 0) ? "😴" : "";
        distance = new_distance;
        ctx.globalAlpha = opacities.d_txt;
        ctx.fillStyle = color_choices.d_txt.fill;
        ctx.font = "20px sans-serif";
        ctx.fillText(`Distance: ${distance} ${emoji}`, centerX + 10, centerY - 10);
        ctx.globalAlpha = 1;

        const scaledX = minimapData.x + (minimapData.width * (leaderX + (ARENA_WIDTH / 2)) / ARENA_WIDTH);
        const scaledY = minimapData.y + (minimapData.height * (leaderY + (ARENA_HEIGHT / 2)) / ARENA_HEIGHT);
        //const scaled2X = minimapData.x + (minimapData.width * (playerPosition[0] + (ARENA_WIDTH / 2)) / ARENA_WIDTH);
        //const scaled2Y = minimapData.y + (minimapData.height * (playerPosition[1] + (ARENA_HEIGHT / 2)) / ARENA_HEIGHT);
        //draw leader circle on minimap
        ctx.globalAlpha = opacities.arc;
        ctx.fillStyle = color_choices.arc;
        ctx.beginPath();
        const miniCircleRadius = (window.innerWidth / 512 + window.innerHeight / 288) / 2;
        ctx.arc(scaledX, scaledY, miniCircleRadius, 0, Math.PI * 2);
        ctx.fill();
        //draw your circle on minimap
        /*
        ctx.fillStyle = "darkgreen";
        ctx.beginPath();
        ctx.arc(scaled2X, scaled2Y, miniCircleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        */

        //Experimental Tabs
        for(let i = 0; i < tabs; i++){
            if(i === tabIndex) return;
            //console.log(i, 'works', tabIndex, 'me :)');
            let memoryX = otherTabsData[i][0];
            let memoryY = otherTabsData[i][1];
            //draw on minimap
            let _scaledX = minimapData.x + (minimapData.width * (memoryX + (ARENA_WIDTH / 2)) / ARENA_WIDTH);
            let _scaledY = minimapData.y + (minimapData.height * (memoryY + (ARENA_HEIGHT / 2)) / ARENA_HEIGHT);
            ctx.globalAlpha = opacities.tabs;
            ctx.fillStyle = "pink";
            ctx.beginPath();
            ctx.arc(_scaledX, _scaledY, miniCircleRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            ctx.globalAlpha = opacities.tabs_minimap_txt;
            ctx.font = `${minimapData.width/20}px Georgia`;
            ctx.strokeStyle = color_choices.tabs_minimap_txt.stroke;
            ctx.fillStyle = color_choices.tabs_minimap_txt.fill;
            ctx.beginPath();
            ctx.strokeText(otherTabsData[i][2], _scaledX, _scaledY);
            ctx.fillText(otherTabsData[i][2], _scaledX, _scaledY);
            ctx.globalAlpha = 1;

            //draw in-game
            const [ingameX, ingameY] = worldToScreenPosition(memoryX, memoryY);
            //line
            ctx.globalAlpha = opacities.tabs_line;
            ctx.strokeStyle = color_choices.tabs_line;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(ingameX, ingameY);
            ctx.stroke();
            ctx.globalAlpha = 1;
            //cirlce
            ctx.globalAlpha = opacities.tabs_arc;
            ctx.fillStyle = color_choices.tabs_arc;
            ctx.beginPath();
            ctx.arc(ingameX, ingameY, circleRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            ctx.globalAlpha = opacities.tabs_txt;
            ctx.font = `${circleRadius*2}px Georgia`;
            ctx.strokeStyle = color_choices.tabs_txt.stroke;
            ctx.fillStyle = color_choices.tabs_txt.fill;
            let _text = otherTabsData[i][2];
            let _sizes = ctx.measureText(_text);
            ctx.beginPath();
            ctx.strokeText(_text, ingameX-(_sizes.width/2), ingameY-circleRadius);
            ctx.fillText(_text, ingameX-(_sizes.width/2), ingameY-circleRadius);
            ctx.globalAlpha = 1;
        }
        if (win.extern && win.aim) win.extern.onTouchMove(-1, targetX, targetY);
    }

    window.addEventListener("resize", resizeCanvas);

    function patchCanvas(canvas) {
        if (!canvas || canvas.__patchedGetContext__) return;
        canvas.__patchedGetContext__ = true;
        const originalGetContext = canvas.getContext.bind(canvas);
        Object.defineProperty(canvas, "getContext", {
            value: function (...args) {
                const context = originalGetContext(...args);
                if (args[0] === "2d" && context) {
                    return new Proxy(context, {
                        get(target, prop) {
                            if (prop === "stroke") {
                                return function (...args) {
                                    if (["#cccccc", "#cdcdcd"].includes(target.fillStyle) &&
                                        target.strokeStyle === '#000000') {
                                        fov = target.globalAlpha / 0.05;
                                    }
                                    return _originalStroke.apply(target, args);
                                };
                            }
                            if (prop === "strokeRect") {
                                return function (...args) {
                                    const transform = target.getTransform();
                                    minimapData.x = transform.e;
                                    minimapData.y = transform.f;
                                    minimapData.width = transform.a;
                                    minimapData.height = transform.d;
                                    return _originalStrokeRect.apply(target, args);
                                };
                            }
                            const value = target[prop];
                            return typeof value === "function" ? value.bind(target) : value;
                        },
                        set(target, prop, newValue) {
                            target[prop] = newValue;
                            return true;
                        },
                    });
                }
                return context;
            },
            configurable: true,
            writable: true,
        });
    }

    const originalCRC = CanvasRenderingContext2D.prototype;
    const _originalStroke = originalCRC.stroke;
    const _originalStrokeRect = originalCRC.strokeRect;

    const originalCreateElement = document.createElement;
    document.createElement = function (tagName, options) {
        const element = originalCreateElement.call(document, tagName, options);
        if (String(tagName).toLowerCase() === "canvas") {
            patchCanvas(element);
        }
        return element;
    };

    win.changefov = (newFov) => {
        window.Module.HEAPF32[baseIndex + 8] = newFov;
    };

    requestAnimationFrame(renderFrame);
})();
