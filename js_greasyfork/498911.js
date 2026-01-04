// ==UserScript==
// @name         MMOSG hacks
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  hi pusheen
// @author       You
// @match        https://swaous.asuscomm.com/mmosg/new/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asuscomm.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498911/MMOSG%20hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/498911/MMOSG%20hacks.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let baseTheme = "crimson";
    screen("startscreen");
    var styles = `#famous > div:hover { background-color: white; cursor: pointer;} form { background-color: black !important; color: ${baseTheme}; } input[type="text"] { color: ${baseTheme} !important; } input:checked + .fancycheck { background-color: lime !important; } button { background-color: ${baseTheme}; } #sidepanel { background-color: black; } ::-webkit-scrollbar { width: 10px; height: 10px; } ::-webkit-scrollbar-track { background: black; } ::-webkit-scrollbar-thumb { background: ${baseTheme}; } ::-webkit-scrollbar-thumb:hover { background: rgba(220, 20, 30, 0.9); } button[type="submit"] { margin-top: 40px; }`;
    var styleSheet = document.createElement("style")
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)
    document.title = "System Override";
    document.getElementById("talk").innerHTML = `<h1 style="color: ${baseTheme};">Pusheen Destroyer</h1><div style="text-align: center; color: ${baseTheme};"><br><h2>Servers:</h2><ul id="famous"><div onclick="set('wss://swaous.asuscomm.com/mmosg/game/io', 'https://swaous.asuscomm.com/mmosg/manifest.json')">The 24/7 IO Server - swaous.asuscomm.com</div><div onclick="set('wss://swaous.asuscomm.com/mmosg/game/nexus', 'https://swaous.asuscomm.com/mmosg/manifest.json')">Nexus Defense - swaous.asuscomm.com [small; playtesting]</div><div onclick="set('wss://swaous.asuscomm.com/mmosg/game/regular', 'https://swaous.asuscomm.com/mmosg/manifest.json')">The 24/7 Regular Server - swaous.asuscomm.com</div><div onclick="set('wss://swaous.asuscomm.com/mmosg/game/big', 'https://swaous.asuscomm.com/mmosg/manifest.json')">The 24/7 BIIIG IO Server - swaous.asuscomm.com</div><div onclick="set('wss://swaous.asuscomm.com/mmosg/game/richard', 'https://swaous.asuscomm.com/mmosg/manifest.json')">richard map <img style="margin: 0;" src="https://cdn.discordapp.com/emojis/1099462812645986324.webp?size=16&amp;quality=lossless"></div><div onclick="set('wss://swaous.asuscomm.com/awesome/game', 'https://swaous.asuscomm.com/mmosg/manifest.json')">Development build; not always running (and sometimes containing non-MMOSG applications) - swaous.asuscomm.com.</div><div onclick="set('ws://localhost:3000', 'http://localhost:3000/manifest')">Local Development</div></ul></div>`
    document.getElementById("talk").style.backgroundColor = "black";
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = 'https://cdn.glitch.global/f20f7096-da5e-47ea-977a-0febbb690510/favicon.ico?v=1689397288877';
    Sidebar.prototype.draw = function(parent, interpolator) {
        var ctx = parent.ctx;
        if (this.isInventory) {
            this.drawInventory(parent);
            return;
        }
        if (parent.minimalistic) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.fillRect(0, 56, 266, 1144);
        }
        else {
            ctx.fillStyle = "black";
            ctx.fill(this.path);
            ctx.beginPath();
            ctx.roundRect(46, 66, 220, 210, 14);
            ctx.fill();
            ctx.fill(this.dumpass);
            ctx.lineWidth = 1;
            ctx.strokeStyle = baseTheme;
            ctx.stroke(this.dumpass);
        }
        ctx.font = "20px 'Chakra Petch'";
        var t = "READY";
        if (parent.status.isReady) {
            ctx.fillStyle = baseTheme;
        }
        else {
            ctx.fillStyle = "lime";
            t = "NOT READY";
        }
        ctx.fillRect(20, 700, 220, 20);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(t, 135, 718);

        ctx.font = "bold 14px 'Chakra Petch'";
        ctx.textAlign = "left";
        ctx.fillStyle = "white";
        ctx.fillText("X", 20, 632 + 14);
        ctx.fillText("Y", 148, 632 + 14);
        ctx.font = "24px 'Chakra Petch'";
        ctx.fillText(parent.gameX, 20, 650 + 24);
        ctx.fillText(parent.gameY, 148, 650 + 24);
        ctx.fillStyle = "#333";
        ctx.fillRect(18, 487, 218, 2);
        ctx.fillRect(18, 771, 218, 2);

        ctx.strokeStyle = baseTheme;
        ctx.fillStyle = baseTheme;
        ctx.lineWidth = 1;
        ctx.strokeRect(197, 1060, 26, 26);
        if (parent.controls.up) {
            ctx.fillRect(197, 1060, 26, 26);
        }
        ctx.strokeRect(168, 1089, 26, 26);
        if (parent.controls.left) {
            ctx.fillRect(168, 1089, 26, 26);
        }
        ctx.strokeRect(197, 1089, 26, 26);
        if (parent.controls.down) {
            ctx.fillRect(197, 1089, 26, 26);
        }
        ctx.strokeRect(226, 1089, 26, 26);
        if (parent.controls.right) {
            ctx.fillRect(226, 1089, 26, 26);
        }
        if (parent.castle) {
            ctx.strokeRect(226, 1060, 26, 26);
            ctx.fillRect(226, 1060, 26, 26);
            ctx.beginPath();
            ctx.save();
            ctx.translate(238, 1072);
            var ang = Math.atan2(parent.castle.y - parent.gameY, parent.castle.x - parent.gameX);
            ctx.rotate(ang);
            ctx.moveTo(6, 0);
            ctx.lineTo(-6, -3);
            ctx.lineTo(-4, 0);
            ctx.lineTo(-6, 3);
            ctx.closePath();
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.restore();
            ctx.beginPath();
            ctx.arc(209, 992, 50, 0, Math.PI * 2);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "white";
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(209, 992, 4, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            ctx.arc(209, 992, 33, 0, Math.PI * 2);
            ctx.moveTo(226, 992);
            ctx.arc(209, 992, 17, 0, Math.PI * 2);
            ctx.stroke();
            var nearestValue = Infinity;
            Object.values(parent.objects).forEach(object => {
                var dx = object.getX(interpolator) - parent.castle.getX(interpolator);
                var dy = object.getY(interpolator) - parent.castle.getY(interpolator);
                var dist = dx * dx + dy * dy;
                if (!object.isOurs && dist < nearestValue && object.type != 'B' && object.isCompassVisible()) { // keep this as isOurs because this reports for everything that isn't distinctly controlled by us
                    nearestValue = dist;
                }
                if (dist < 400 * 400 && object.isCompassVisible() && object != parent.castle) {
                    if (object.isFriendly()) { // isFriendly also factors in teams
                        ctx.fillStyle = "rgb(47, 237, 51)";
                    } else {
                        ctx.fillStyle = "rgb(231, 57, 30)";
                    }
                    var offsetX = (dx / 400) * 50;
                    var offsetY = (dy / 400) * 50;
                    ctx.beginPath();
                    ctx.arc(209 + offsetX, 992 + offsetY, 5, 0, Math.PI * 2);
                    ctx.globalAlpha = 0.5;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.beginPath();
                    ctx.arc(209 + offsetX, 992 + offsetY, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            ctx.globalAlpha = 1;
        }
        ctx.beginPath();
        ctx.moveTo(209, 1069);
        ctx.lineTo(214, 1075);
        ctx.lineTo(204, 1075);
        ctx.closePath()
        ctx.moveTo(183, 1096);
        ctx.lineTo(177, 1101);
        ctx.lineTo(183, 1106);
        ctx.closePath();
        ctx.moveTo(204, 1098);
        ctx.lineTo(214, 1098);
        ctx.lineTo(209, 1104);
        ctx.closePath();
        ctx.moveTo(235, 1096);
        ctx.lineTo(241, 1101);
        ctx.lineTo(235, 1106);
        ctx.closePath();
        ctx.fillStyle = baseTheme;
        ctx.fill();
        ctx.stroke();

        var rUC = 0;
        Object.values(parent.objects).forEach(object => {
            if (object.rStrength) {
                if (parent.gameX > object.x - object.w / 2 && parent.gameX < object.x + object.w / 2 && parent.gameY > object.y - object.h / 2 && parent.gameY < object.y + object.h / 2) {
                    rUC += object.rStrength;
                }
            }
        });
        this.drawSquaresReadout(ctx, parent.castle ? 1 - parent.castle.health : 1, 18, 945, parent.minimalistic);
        this.drawSquaresReadout(ctx, rUC, 54, 945, parent.minimalistic);
        this.drawSquaresReadout(ctx, 1 - clamp(0, nearestValue / (800 * 800), 1), 90, 945, parent.minimalistic);
        if (!parent.minimalistic) {
            for (var i = 0; i < 33; i++) {
                if (i < 9) {
                    ctx.fillStyle = "red";
                }
                else if (i < 19) {
                    ctx.fillStyle = "#F3BB38";
                }
                else if (i < 29) {
                    ctx.fillStyle = "#2FED33";
                }
                else {
                    ctx.fillStyle = "white";
                }
                ctx.fillRect(42, 945 + i * 6, 4, 2);
                ctx.fillRect(78, 945 + i * 6, 4, 2);
            }
            ctx.fillStyle = "red";
            ctx.fillRect(18, 999, 88, 2);
        }
        this.scrollHeight = 1144;

        if (!parent.minimalistic) {
            ctx.fillStyle = baseTheme;
            ctx.font = "12px 'Chakra Petch'";
            ctx.fillText("EARLY WARNING SYSTEM", 42, 852);
            var lert = clamp(0, nearestValue / (1200 * 1200), 1);
            var lengths = [
                218,
                203,
                183,
                155,
                120,
                78
            ];
            lengths.forEach(item => {
                this.drawBuuchie(ctx, "rgb(" + 255 * ((1 - lert) + (1 - (item - 78)/140) * 0.5) + ",0,0)", item - 18);
            });
            ctx.beginPath();
            ctx.strokeStyle = baseTheme;
            ctx.lineWidth = 1;
            ctx.moveTo(18, 884);
            ctx.lineTo(185, 884);
            ctx.moveTo(18, 905);
            ctx.lineTo(153, 905);
            ctx.stroke();
            ctx.fillStyle = "black";
            ctx.fillRect(17, 884, 185, 20);
            var error = "OK";
            if (nearestValue < 600 * 600) { // it's nearby
                error = "NEAR THRESHOLD";
            }
            if (nearestValue < 400 * 400) {
                error = "CLOSE PROXIMITY";
                this.tick++; // make the flash twice as fast if you're in close proximity.
            }
            this.tick++;
            if (this.tick > 60) {
                this.tick = 0;
            }
            ctx.font = "12px 'Chakra Petch'";
            ctx.fillStyle = baseTheme;
            ctx.fillText(error, 61, 899);
            if (error != "OK") {
                if (this.tick > 30) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(18, 887, 39, 16);
                    ctx.fillStyle = baseTheme;
                    ctx.font = "bold 12px 'Chakra Petch'";
                    ctx.fillText("WARN", 20, 899);
                }
            }
        }
        this.availability(ctx, "CASTLE PLACEMENT", 779, !parent.status.mouseWithinNarrowField || parent.superuser);
        this.availability(ctx, "OBJECT PLACEMENT", 803, parent.status.canPlaceObject || parent.status.placeAroundFort);

        Object.values(parent.objects).forEach(obj => {
            var scaleX = 220 / parent.gamesize;
            var scaleY = 210 / parent.gamesize
            var convertedX = 46 + obj.getX(interpolator) * scaleX;
            var convertedY = 66 + obj.getY(interpolator) * scaleY;
            var convertedW = obj.w * scaleX;
            var convertedH = obj.h * scaleY;
            if (obj.isFriendly()) {
                ctx.fillStyle = "rgb(47, 237, 51)";
            } else if(obj.type == "C") {
                ctx.fillStyle = "rgb(237, 237, 30)";
            } else if(obj.type == "w") {
                ctx.fillStyle = "rgb(20, 237, 237)";
            } else {
                ctx.fillStyle = "rgb(231, 57, 30)";
            }
            if (obj.type == "R" || obj.type == "c") {
                ctx.beginPath();
                ctx.moveTo(convertedX, convertedY - 3);
                ctx.lineTo(convertedX + 3, convertedY);
                ctx.lineTo(convertedX, convertedY + 3);
                ctx.lineTo(convertedX - 3, convertedY);
                ctx.closePath();
                ctx.fill();
            }
            else if (obj.type == "B") {
                ctx.fillStyle = "#555";
                ctx.translate(convertedX, convertedY);
                ctx.rotate(obj.a);
                ctx.fillRect(-convertedW / 2, -convertedH / 2, convertedW, convertedH);
                ctx.rotate(-obj.a);
                ctx.translate(-convertedX, -convertedY);
            }
            else {
                ctx.beginPath();
                ctx.arc(convertedX, convertedY, 3, 0, Math.PI * 2);
                ctx.globalAlpha = 0.5;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.beginPath();
                ctx.arc(convertedX, convertedY, 1, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = "white";
            ctx.fillRect(46 + parent.gameX * scaleX - 1, 66 + parent.gameY * scaleY - 1, 2, 2);
        });

        if (parent.castle) {
            ctx.font = "14px 'Chakra Petch'";
            ctx.fillStyle = baseTheme;
            ctx.fillText("UPGRADES", 18, 448 + 14);
            this.upgradeHovered = undefined;
            this.drawUpgradeBar(parent, "g", "GUN", (parent.castle.highestUpgradeTier('b') + 1)/4, parent.castle.highestUpgradeTier('b')/4, 505, parent.minimalistic);
            this.drawUpgradeBar(parent, "s", "CLOAKING", (parent.castle.highestUpgradeTier('s') + 1)/2, (parent.castle.highestUpgradeTier('s'))/2, 539, parent.minimalistic);
            this.drawUpgradeBar(parent, "f", "DRIVE", (parent.castle.highestUpgradeTier('f') + 1)/3, parent.castle.highestUpgradeTier('f')/3, 573, parent.minimalistic);
            this.drawUpgradeBar(parent, "h", "HEALTH", (parent.castle.highestUpgradeTier('h') + 1) / 4, parent.castle.highestUpgradeTier('h') / 4, 607, parent.minimalistic);
        }
    }
    Sidebar.prototype.drawUpgradeBar = function(parent, lItem, label, projected, current, rootY, minimal) {
        var ctx = parent.ctx;
        ctx.font = "12px 'Chakra Petch'";
        ctx.textAlign = "left";
        var tWid = ctx.measureText(label).width;
        ctx.fillStyle = baseTheme;
        ctx.fillRect(69 - tWid, rootY, tWid, 16);
        ctx.fillStyle = "white";
        ctx.fillText(label, 69 - tWid, rootY + 12);
        ctx.font = "bold 8px 'Chakra Petch'";
        ctx.fillStyle = "#888";
        ctx.fillText(lItem, 69 - tWid - 10, rootY + 4);
        ctx.fillStyle = "#222";
        ctx.fillRect(69, rootY, 162, 8);
        ctx.fillRect(69, rootY + 8 + 4, 162, 4);
        ctx.fillStyle = "white";
        ctx.fillRect(69, rootY + 8 + 4, 162 * current, 4);
        if (minimal) {
            ctx.fillStyle = "#555";
            ctx.fillRect(69, rootY, 162 * projected, 8);
        }
        else {
            ctx.save();
            ctx.beginPath();
            ctx.rect(69, rootY, 162 * projected, 8);
            ctx.clip();
            ctx.beginPath();
            for (var i = -2; i < 42; i ++) {
                ctx.moveTo(69 + i * 4, rootY + 8);
                ctx.lineTo(69 + i * 4 + 8, rootY);
            }
            ctx.strokeStyle = "white";
            ctx.lineWidth = 0.3;
            ctx.stroke();
            ctx.restore();
        }
        if (current < 1) {
            if (parent.mouseX > 69 && parent.mouseX < 69 + 162 && parent.mouseY + parent.sideScroll > rootY && parent.mouseY + parent.sideScroll < rootY + 16) {
                this.upgradeHovered = lItem;
            }
        }
    }
    window.addEventListener("keydown", (evt) => {
        if (evt.key == ";") {
            const spam1 = prompt("Enter spam speed (per milliseconds, e.g. 1000 is one second)", "");
            const spam2 = prompt("Enter what is spammed", "Type something...");
            setInterval(() => {game.chat(spam2, true);}, spam1);
        }
    });
    function prerenderBackground2(size) {
        var canvas = document.getElementById("background");
        var gl = diva ? canvas.getContext("webgl", { preserveDrawingBuffer: true }) : canvas.getContext("webgl");
        if (diva) {
            canvas.width = divaW;
            canvas.height = divaH;
        }
        function compileShader(shaderSource, shaderType) {
            var shader = gl.createShader(shaderType);
            gl.shaderSource(shader, shaderSource);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert("YOUR MOM IS A POOP POOP");
            }
            return shader;
        }
        function getAttribLocation(program, name) {
            var attributeLocation = gl.getAttribLocation(program, name);
            if (attributeLocation === -1) {
                throw 'Can not find attribute ' + name + '.';
            }
            return attributeLocation;
        }
        function getUniformLocation(program, name) {
            var uniformLocation = gl.getUniformLocation(program, name);
            if (uniformLocation === -1) {
                throw 'Can not find uniform ' + name + '.';
            }
            return uniformLocation;
        }
        var vertex = compileShader(`
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
    `, gl.VERTEX_SHADER);
        var fragment = compileShader(`
    precision highp float;
    uniform vec3 balls[` + NUM_METABALLS + `];
    uniform vec2 offset;
    uniform float yoopta;

    float w(float r, float x, float y) {
        return r / (abs(x) + abs(y));
    }

    void main(){
        const float BANDCOUNT = 4.0;
        float total = 0.0;
        for (int i = 0; i < ` + NUM_METABALLS + `; i ++) {
            float dx = balls[i].x + offset.x - gl_FragCoord.x;
            float dy = balls[i].y - yoopta + offset.y - yoopta - gl_FragCoord.y;
            float r = balls[i].z;
            total += (r * r) / (dx * dx + dy * dy);
        }
        gl_FragColor = vec4(floor(total * BANDCOUNT)/BANDCOUNT, 0.0, (1.0 - total) * 0.2, 1.0);
    }
    `, gl.FRAGMENT_SHADER);/*
    var error_log = gl.getShaderInfoLog(fragment);
    console.log(error_log);*/

        var program = gl.createProgram();
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        gl.useProgram(program);

        var texture = new Float32Array([ // shamelessly copypasted
            -1.0,  1.0, // top left
            -1.0, -1.0, // bottom left
            1.0,  1.0, // top right
            1.0, -1.0, // bottom right
        ]);

        var offset = new Float32Array([
            0.0, 0.0
        ]);

        var leBalls = [];
        for (var x = 0; x < NUM_METABALLS; x++) {
            leBalls.push({
                x: Math.random() * size,
                y: Math.random() * size,
                r: 50 + Math.random() * 150,
                xv: (Math.random() - 0.5),
                yv: (Math.random() - 0.5)
            });
        }
        var ballsHandle = getUniformLocation(program, 'balls');
        var offsetHandle = getUniformLocation(program, "offset");
        var yoopta = getUniformLocation(program, "yoopta");
        var toGPU = new Float32Array(3 * NUM_METABALLS);

        function updateBalls() {
            leBalls.forEach((ball, index) => {
                toGPU[index * 3] = ball.x;
                toGPU[index * 3 + 1] = ball.y;
                toGPU[index * 3 + 2] = ball.r;
            });
            gl.uniform3fv(ballsHandle, toGPU);
        }

        var tick = 0;

        function main(x, y) {
            gl.viewport(0, 0, window.innerWidth, window.innerHeight);
            var leWidth = window.innerWidth;
            var leHeight = window.innerHeight;
            if (diva) {
                leWidth = divaW;
                leHeight = divaH;
            }
            tick++;
            offset[0] = -x;
            offset[1] = y;
            gl.uniform2fv(offsetHandle, offset);
            gl.uniform1f(yoopta, size/2 - leWidth/2);
            leBalls.forEach(ball => {
                ball.x += ball.xv;
                ball.y += ball.yv;
                if (ball.x > size + leWidth/2) {
                    ball.x = size + leWidth/2;
                    ball.xv *= -1;
                }
                if (ball.x < -leWidth/2) {
                    ball.x = -leWidth/2;
                    ball.xv *= -1;
                }
                if (ball.y > size + leHeight/2) {
                    ball.y = size + leHeight/2;
                    ball.yv *= -1;
                }
                if (ball.y < -leHeight/2) {
                    ball.y = -leHeight/2;
                    ball.yv *= -1;
                }
            });
            updateBalls();

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        var textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texture, gl.STATIC_DRAW);

        var positionHandle = getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionHandle);
        gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, gl.FALSE, 2 * 4, 0);
        if (diva) {
            var divaMain = () => {
                main(0, 0);
                requestAnimationFrame(divaMain);
            };
            divaMain();
        }
        else {
            return main;
        }
    }
    Game.prototype.renderGameboard = function(interpolator, zoomLevel) {
        this.ctx.fillStyle = "#111111";
        this.ctx.save();
        if (this.bgCall) {
            this.bgCall(this.cX - window.innerWidth / 2, this.cY - window.innerHeight / 2);
            this.ctx.drawImage(document.getElementById("background"), 0, 0); //offx, offy);
        }
        this.ctx.translate(window.innerWidth / 2 - this.cX, window.innerHeight / 2 - this.cY);
        if (this.status.isRTF && this.accurateRTF && !this.status.moveShips) {
            this.ctx.translate(this.cX, this.cY);
            this.ctx.rotate(-this.castle.getA(interpolator));
            this.ctx.translate(-this.cX, -this.cY);
        }
        this.ctx.scale(zoomLevel, zoomLevel);
        this.ctx.strokeStyle = baseTheme;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(0, 0, this.gamesize, this.gamesize);
        Object.values(this.objects).forEach((item) => {
            item.draw(this, interpolator);
        });
        this.lasers.forEach(laser => {
            if (laser[5] == 'R') {
                this.ctx.strokeStyle = "red";
                this.ctx.globalAlpha = 0.5;
                this.ctx.lineWidth = 20;
                this.ctx.beginPath();
                this.ctx.moveTo(laser[0], laser[1]);
                this.ctx.lineTo(laser[2], laser[3]);
                this.ctx.stroke();
            }
            else if (laser[5] == "p") {
                this.ctx.strokeStyle = "purple";
                this.ctx.lineWidth = 20;
                this.ctx.beginPath();
                this.ctx.moveTo(laser[0], laser[1]);
                this.ctx.lineTo(laser[2], laser[3]);
                this.ctx.stroke();
                this.ctx.strokeStyle = "pink";
            }
            else {
                this.ctx.strokeStyle = "red";
            }
            this.ctx.globalAlpha = 1;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(laser[0], laser[1]);
            this.ctx.lineTo(laser[2], laser[3]);
            this.ctx.stroke();
        });
        this.explosions.forEach(explosion => {
            this.ctx.beginPath();
            this.ctx.arc(explosion[0], explosion[1], explosion[2], 0, Math.PI * 2);
            this.ctx.fillStyle = "red";
            this.ctx.fill();
        });
        if(this.keysDown["e"]) {
            this.ctx.strokeStyle = "white";
            this.ctx.strokeRect(this.gameX - 400, this.gameY - 400, 800, 800);
        }
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.gameX - 5, this.gameY - 5, 10, 10);
        this.ctx.restore();
    }
    Game.prototype.setListeners = function(connection) {
        connection.setOnMessage("New", (id, type, x, y, a, editable, banner, w, h) => {
            type = String.fromCharCode(type);
            this.objects[id] = new GameObject(this, x, y, w, h, a, type, editable, id, banner);
            if ((type == "c" || type == "R") && this.mine.indexOf(id) != -1) {
                this.castle = this.objects[id];
                if (type == "R") {
                    this.status.isRTF = true;
                    this.inventory = [
                        {
                            name: "SEED",
                            cost: 10,
                            descriptionL1: "A seed that eventually grows into a chest.",
                            descriptionL2: "",
                            place: {
                                word: "S"
                            }
                        },
                        {
                            name: "BASIC FIGHTER",
                            cost: 10,
                            descriptionL1: "Low motion speed, medium shot cooldown,",
                            descriptionL2: "medium bullet range, 2 health.",
                            place: {
                                word: "f"
                            }
                        },
                        {
                            name: "+2 WALL",
                            cost: 30,
                            descriptionL1: "Place 2 extra walls around any castle or fort",
                            descriptionL2: "every turn.",
                            place: {
                                shop: 'w',
                                cbk() {
                                    game.status.wallsTurn += 2;
                                    game.status.wallsRemaining += 2;
                                }
                            }
                        },
                        {
                            name: "AIR TO AIR MISSILE",
                            cost: 100,
                            descriptionL1: "",
                            descriptionL2: "",
                            place: {
                                shop: 'a'
                            }
                        }
                    ];
                }
            }
        });
        connection.setOnMessage("Pong", () => {
            this.ponged = true;
        });
        connection.setOnMessage("Tick", (counter, abscounter, mode) => {
            this.status.abscounter = abscounter;
            this.lasers = this.stagingLasers;
            this.explosions = this.stagingExplosions;
            this.stagingLasers = [];
            this.stagingExplosions = [];
            this.status.counter = counter;
            this.ponged = true;
            if (mode == 2) {
                this.status.wait = true;
                if (!this.status.counting) {
                    this.status.counting = true;
                    notify("Countdown started: Game will begin in " + this.status.getTimeString());
                }
            }
            else {
                this.status.wait = false;
                this.tick();
                if (!this.status.playing) {
                    this.status.playing = true;
                    notify("Game has started!")
                }
            }
            var oldStatus = this.status.moveShips;
            this.status.moveShips = mode == 1;
            if (!this.status.moveShips) {
                this.status.isReady = false;
            }
            if (this.status.moveShips && !oldStatus) {
                this.enterMoveShips();
            }
            var curTime = window.performance.now();
            if (this.status.lastTickTime == -1) {
                this.status.lastTickTime = curTime - this.status.tickTime;
            }
            var gTickTime = curTime - this.status.lastTickTime;
            const drag = 0.995;
            this.status.tickTime = this.status.tickTime * drag + gTickTime * (1 - drag);
            this.status.lastTickTime = curTime;
        });
        connection.setOnMessage("Delete", (id) => {
            if (this.castle && id == this.castle.id) {
                delete this.castle;
                this.status.isRTF = false;
                this.status.spectating = true;
                this.mine = [];
            }
            if (DEBUG) {
                this.deletePoints.push([this.objects[id].x, this.objects[id].y]);
            }
            var index = this.mine.indexOf(id);
            if (index != -1) {
                this.mine.splice(index, 1);
            }
            delete this.objects[id];
        });
        connection.setOnMessage("Add", (id) => {
            this.mine.push(id);
        });
        connection.setOnMessage("BannerAdd", (banner, name) => {
            this.banners[banner] = name;
        });
        connection.setOnMessage("Radiate", (id, amount) => {
            this.objects[id].rStrength = amount;
        });
        connection.setOnMessage("Metadata", (gamesize) => {
            this.gamesize = gamesize;
            screen("gameui");
            // if (!BARE && this.fancyBackground) { //built for speed, can't have this
            //     this.bgCall = prerenderBackground2(this.gamesize);
            // }
            this._main();
        });
        connection.setOnMessage("SetScore", (score) => {
            this.status.score = score;
        });
        connection.setOnMessage("TrajectoryUpdate", (id, absframe, x, y, xv, yv) => {
            if (this.objects[id] == undefined) { return; }
            this.objects[id].x = x;
            this.objects[id].y = y;
            this.objects[id].xv = xv;
            this.objects[id].yv = yv;
            this.objects[id].framestart = absframe;
        });
        connection.setOnMessage("UpdateObject", (id, angle, w, h) => {
            if (this.objects[id] == undefined) { return; }
            var obj = this.objects[id];
            obj.aOld = obj.a;
            obj.wOld = obj.w;
            obj.hOld = obj.h;
            obj.a = angle;
            obj.h = h;
            obj.w = w;
        });
        connection.setOnMessage("A2A", count => {
            this.a2a = count;
        });
        connection.setOnMessage("YouAreTeamLeader", () => {
            this.status.isTeamLeader = true;
        });
        connection.setOnMessage("Chat", (message, banner, priority) => {
            var chatEl = document.getElementById("chat-messages")
            var messageEl = document.createElement("p");
            messageEl.style.fontSize = 1 + priority * 0.2 + "em";
            var bannerSpan = document.createElement("span");
            bannerSpan.style.color = banner == 0 ? "magenta" : "red";
            bannerSpan.innerText = priority == 1 ? "ðŸ‘‘ " : "";
            bannerSpan.innerText += banner == 0 ? "GOD" : this.banners[banner];
            messageEl.appendChild(bannerSpan);
            messageEl.appendChild(document.createTextNode(": " + message));
            chatEl.appendChild(messageEl);
            chatEl.scrollTo({
                top: chatEl.scrollHeight
            });
        });
        connection.setOnMessage("YouAreSpectating", () => {
            this.status.spectating = true;
        });
        connection.setOnMessage("End", (banner) => {
            if (this.castle && this.castle.banner == banner) {
                screen("youWin");
            }
            else {
                document.getElementById("winnerBanner").innerText = this.banners[banner];
                screen("gameOver");
            }
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            console.log("u luuz");
        });
        connection.setOnMessage("UpgradeThing", (id, upgrade) => {
            this.objects[id].upgrade(upgrade);
        });
        connection.setOnMessage("HealthUpdate", (id, health) => {
            this.objects[id].health = health;
        });
        connection.setOnMessage("BannerAddToTeam", (banner, team) => {
            this.teams[banner] = team;
            console.log(this.banners[banner] + " is in " + this.banners[team]);
        });
        connection.setOnMessage("YouLose", () => {
            screen("youLose");
            setTimeout(() => {
                screen("gameui");
            }, 1000);
        });
        connection.setOnMessage("SeedCompletion", (seedId, value) => {
            if (this.objects[seedId]) {
                this.objects[seedId].seedCompVal = 100 - value;
            }
        });
        connection.setOnMessage("Carry", (carrier, carried) => {
            this.objects[carried].carried = true;
            this.objects[carried].carrier = carrier;
            this.objects[carried].goalPos.x = this.objects[carried].x;
            this.objects[carried].goalPos.y = this.objects[carried].y;
            this.objects[carried].goalPos.a = this.objects[carried].angle;
            this.objects[carrier].carrying.push(carried);
        });
        connection.setOnMessage("UnCarry", (carried) => {
            if (this.objects[carried]) {
                this.objects[carried].carrier.carrying.splice(this.objects[carried].carrier.carrying.indexOf(carried), 1);
                this.objects[carried].carried = false;
            }
        });
        connection.setOnMessage("YouAreGod", () => {
            this.superuser = true;
            this.status.wallsRemaining = Infinity;
            this.status.wallsTurn = Infinity;
        });
        connection.setOnMessage("CastLaser", (x1, y1, x2, y2, intensity, type) => {
            this.stagingLasers.push([x1, y1, x2, y2, intensity, String.fromCharCode(type)]);
        });
        connection.setOnMessage("Blast", (x, y, radius, intensity) => {
            this.stagingExplosions.push([x, y, radius, intensity]);
        });
    }
    Game.prototype.interactionLoop = function(interpolator) {
        var cTime = window.performance.now();
        this.status.FPS = 1000 / (cTime - this.lastFrameTime);
        this.lastFrameTime = cTime;
        if (this.superuser) {
            this.status.score = Infinity;
        }
        this.doMouse();
        Object.values(this.objects).forEach((item) => {
            var x = item.getX(interpolator);
            var y = item.getY(interpolator);
            item.bodyHovered = (this.gameX > x - 25 && this.gameX < x + 25 && this.gameY > y - 25 && this.gameY < y + 25);
            item.isHovered = item.bodyHovered || (this.gameX > item.goalPos.x - 10 && this.gameX < item.goalPos.x + 10 && this.gameY > item.goalPos.y - 10 && this.gameY < item.goalPos.y + 10);
            item.interact(this);
            var dx = this.gameX - item.x;
            var dy = this.gameY - item.y;
            dx *= dx;
            dy *= dy;
            var d2 = dy + dx;
            if (this.status.isRTF && (item.type == "R" || item.type == "a") && item != this.castle) {
                if (d2 < 100 * 100) {
                    this.seeking = item;
                    this.seekTime = window.performance.now();
                }
            }
            if (this.status.isRTF && item.type != "a" && item.type == "R" && item != this.isOurs && Math.sqrt((this.castle.x - item.x) ** 2 + (this.castle.y - item.y) ** 2)) {
                this.seeking = item;
                this.seekTime = window.performance.now();
            }
            if (this.seeking == item) {
                if (d2 > 1500 * 1500) {
                    this.seeking = undefined;
                }
            }
        });
        this.controls.up = this.keysDown["ArrowUp"] || this.keysDown["w"];
        this.controls.down = this.keysDown["ArrowDown"] || this.keysDown["s"];
        this.controls.left = this.keysDown["ArrowLeft"] || this.keysDown["a"];
        this.controls.right = this.keysDown["ArrowRight"] || this.keysDown["d"];
        this.controls.shoot = this.keysDown["f"] || this.keysDown[" "];
        if (this.mousemodeRTF && this.status.isRTF) {
            if (this.mouseIsDown) {
                var dx = this.gameX - this.castle.x;
                var dy = this.gameY - this.castle.y;
                var mAngle = Math.atan2(dy, dx);
                var dist = Math.sqrt(dy * dy + dx * dx);
                var da = ringDist(mAngle, this.castle.a - Math.PI / 2);

                if (dist < 20) { // hard brake
                    this.controls.down = true;
                } else {
                    if (dist < 100) { // precision turn
                        this.controls.down = true;
                    }
                    if (da < -Math.PI / 8) {
                        this.controls.right = true;
                    }
                    if (da > Math.PI / 8) {
                        this.controls.left = true;
                    }
                    if (dist > 200) {
                        this.controls.up = true;
                    }
                }
            }
            this.controls.shoot = this.rightMouse;
        }
        if (!this.status.isRTF || this.status.moveShips) {
            if (this.controls.up) {
                this.cY -= 40;
            } else if (this.controls.down) {
                this.cY += 40;
            }
            if (this.controls.left) {
                this.cX -= 40;
            } else if (this.controls.right) {
                this.cX += 40;
            }
        }
        this.cX = clamp(0, this.cX, this.gamesize * this.zoomLevel);
        this.cY = clamp(0, this.cY, this.gamesize * this.zoomLevel);
        this.sideScroll = clamp(0, this.sideScroll, this.sidebar.scrollHeight - window.innerHeight + 56);
        if (window.performance.now() - this.seekTime > 6000) {
            this.seeking = undefined;
        }
    }
    GameObject.prototype.draw = function(master, interpolator) {
        var lowX, lowY = master.transformPoint(this.box[0], this.box[1]);
        var highX, highY = master.transformPoint(this.box[2], this.box[3]);
        if (lowX > window.innerWidth || highX < 0 || lowY > window.innerHeight || highY < 0) {
            return;
        }
        var ctx = master.ctx;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "white";
        var w = this.getW(interpolator);
        var h = this.getH(interpolator);
        var a = this.getA(interpolator);
        var x = this.getX(interpolator);
        var y = this.getY(interpolator);
        if (this.carried && !master.status.moveShips) {
            this.goalPos.x = x;
            this.goalPos.y = y;
            this.goalPos.angle = a;
        }
        if (this.upgrades.indexOf("s2") != -1) {
            if (Math.abs(this.x - this.xOld) < 0.5 && Math.abs(this.y - this.yOld) < 0.5) {
                if (!this.isOurs && !master.status.moveShips && !master.superuser) {
                    return;
                }
            }
        }
        ctx.translate(x, y);
        ctx.rotate(a);
        if (this.type == "R") {
            ctx.drawImage(document.querySelector("img#rtf"), -40, -40);
            var dX = this.xOld - this.x;
            var dY = this.yOld - this.y;
            dX *= dX;
            dY *= dY;
            if (master.castle == this) {
                if (master.controls.up) {
                    master.drawThruster(0, 40, 20, 20, 15);
                }
            }
            else if (dX + dY > 25) {
                master.drawThruster(0, 40, 20, 20, 15);
            }
        }
        else if (this.type == "c") {
            ctx.drawImage(document.querySelector("img#castle"), -50, -50);
        }
        else if (this.type == "C") {
            ctx.drawImage(document.querySelector("img#chest"), -15, -17);
        }
        else if (this.type == "G") {
            ctx.fillStyle = "blue";
            ctx.fillRect(-15, -10, 30, 20);
            ctx.fillStyle = "red";
            ctx.fillRect(-2.5, -20, 5, 40);
            ctx.fillRect(-10, -25, 20, 5);
            ctx.fillRect(-10, 20, 20, 5);
            ctx.fillStyle = "yellow";
            ctx.fillRect(15, -2.5, 170, 5);
        }
        else if (this.type == 'g') {
            ctx.fillStyle = "gold";
            ctx.fillRect(-25, -15, 50, 30);
        }
        else if (this.type == "f") {
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(document.querySelector("img#ship"), -17, -21);
            ctx.rotate(-Math.PI / 2);
        }
        else if (this.type == "b") {
            ctx.fillStyle = "white";
            ctx.fillRect(-w / 2, -h / 2, w, h);
        }
        else if (this.type == "w") {
            ctx.drawImage(document.querySelector("img#wall"), -30, -30, 60, 60);
        }
        else if (this.type == "S") {
            var image = document.querySelector("img#seed1");
            if (this.seedCompVal >= 50) {
                image = document.querySelector("img#seed2");
            }
            ctx.drawImage(image, -8, -8);
        }
        else if (this.type == "K") {
            var isGreenArm = true;
            if (this.carrying.length == 10) {
                this.carrying.forEach(item => {
                    if (master.objects[item] && master.objects[item].type != "G") {
                        isGreenArm = false;
                    }
                });
            }
            else {
                isGreenArm = false;
            }
            if (isGreenArm) {
                ctx.fillStyle = "lime";
                ctx.fillRect(-w / 2, -h / 2, w, h);
            }
            else {
                ctx.fillStyle = "#555";
                for (var i = 0; i < 6; i++) {
                    ctx.fillRect(-w / 2 + i * 80, -h / 2, 10, h);
                }
                ctx.fillRect(-w / 2, -5, w, 10);
            }
        }
        else if (this.type == "t") {
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(document.querySelector("img#tie"), -31, -23);
            ctx.rotate(-Math.PI / 2);
        }
        else if (this.type == "h" || this.type == "H") {
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(document.querySelector("img#missile"), -13, -22);
            var dX = this.goalPos.x - this.x;
            var dY = this.goalPos.y - this.y;
            dX *= dX;
            dY *= dY;
            if (dX + dY > 25) {
                if (this.type == "H") {
                    master.drawThruster(0, 22, 20, 20, 15, "rgba(255, 0, 0, 1)", "rgba(255, 0, 0, 0)");
                }
                else {
                    master.drawThruster(0, 22, 20, 20, 15);
                }
            }
            ctx.rotate(-Math.PI / 2);
        }
        else if (this.type == "r") {

        }
        else if (this.type == "s") {
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(document.querySelector("img#sniper"), -24, -36);
            ctx.rotate(-Math.PI / 2);
        }
        else if (this.type == "B") {
            ctx.strokeStyle = baseTheme;
            ctx.strokeRect(-w / 2, -h / 2, w, h);
            ctx.globalAlpha = 1;
        } else {
            ctx.strokeRect(-w / 2, -h / 2, w, h);
        }
        ctx.rotate(-a);
        ctx.font = "10px 'Chakra Petch'";
        if (this.isOurs) {
            ctx.fillStyle = "orange";
            ctx.font = "bold 12px 'Chakra Petch'";
        }
        else{
            ctx.fillStyle = "yellow";
        }
        ctx.textAlign = "left";
        ctx.translate(-x, -y);
        if ((this.isOurs || master.superuser) && this.isEditable) {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.setLineDash([2, 4]);
            ctx.strokeStyle = "white";
            ctx.fillStyle = "#F3BB38";
            ctx.lineWidth = 1;
            ctx.lineTo(this.goalPos.x, this.goalPos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.translate(this.goalPos.x, this.goalPos.y);
            ctx.rotate(this.goalPos.a + Math.PI/2);
            if (this.parent.minimalistic) {
                ctx.strokeStyle = baseTheme;
            }
            else {
                var gradient = ctx.createLinearGradient(14, -14, 14, 14);
                gradient.addColorStop(0.0, baseTheme);
                gradient.addColorStop(0.5, "transparent");
                ctx.strokeStyle = gradient;
            }
            //ctx.moveTo(this.goalPos.x * zoomLevel, this.goalPos.y * zoomLevel);
            //ctx.lineTo((this.goalPos.x + Math.cos(this.goalPos.a) * 20) * zoomLevel, (this.goalPos.y + Math.sin(this.goalPos.a) * 20) * zoomLevel);
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, -18);
            ctx.lineTo(2, -13);
            ctx.lineTo(-2, -13);
            ctx.closePath();
            ctx.fill();
            ctx.rotate(-this.goalPos.a - Math.PI/2);
            ctx.translate(-this.goalPos.x, -this.goalPos.y);
        }
        if (this.bodyHovered) {
            const fontSize = 16;
            ctx.fillStyle = baseTheme;
            ctx.font = fontSize + "px 'Chakra Petch'";
            ctx.textAlign = "left";
            var tooltipHeight = this.isOurs ? 4 * fontSize + 5 : 3 * fontSize + 5; // use isOurs here because we can't see what our teammates are doing, the game is not _nice_ that way.
            var tooltipWidth = Math.max(ctx.measureText("NEUTRAL").width + 4, ctx.measureText(master.banners[this.banner]).width + 4);
            ctx.fillRect(x - 40 - tooltipWidth, y - tooltipHeight/2, tooltipWidth, tooltipHeight);
            ctx.beginPath();
            ctx.moveTo(x - 41, y - 5);
            ctx.lineTo(x - 35, y);
            ctx.lineTo(x - 41, y + 5);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.fillText(this.getTypeString(), x - 38 - tooltipWidth, y - tooltipHeight/2 + fontSize + 1);
            ctx.fillText(this.getFriendlinessString(), x - 38 - tooltipWidth, y - tooltipHeight / 2 + (fontSize + 1) * 2);
            ctx.fillText(master.banners[this.banner], x - 38 - tooltipWidth, y - tooltipHeight / 2 + (fontSize + 1) * 3)
            if (this.isOurs) {
                var dx = this.x - this.goalPos.initialX;
                var dy = this.y - this.goalPos.initialY;
                dx *= dx;
                dy *= dy;
                var displacement = Math.sqrt(dx + dy);
                var toPrint = Math.round((displacement / this.goalPos.pathLen) * 100) + "%";
                if (this.goalPos.pathLen == 0) {
                    toPrint = "0%";
                    if (this.goalPos.displacement == 0) {
                        toPrint = "100%";
                    }
                }
                if (this.seedCompVal != undefined) {
                    toPrint = this.seedCompVal + "%";
                }
                ctx.fillText(toPrint, x - 38 - tooltipWidth, y - tooltipHeight / 2 + (fontSize + 1) * 4);
            }
        }
        if (master.seeking == this) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = baseTheme;
            ctx.strokeRect(this.x - 50, this.y - 50, 100, 100);
        }
    }
    Game.prototype.scroll = function(dx, dy) {//fix because pusheen is stupid
        if (this.keysDown["shift"]) {
            var cache = dy;
            dy = dx;
            dx = cache;
        }
        if (this.mouseX < 266) {
            this.sideScroll += dy + dx;
        }
        else {
            this.cX += dx;
            this.cY += dy;
            this.cX = clamp(0, this.cX, this.gamesize);
            this.cY = clamp(0, this.cY, this.gamesize);
        }
    }
})();