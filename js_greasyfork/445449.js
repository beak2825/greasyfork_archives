// ==UserScript==
// @name         VisNotes MPP
// @namespace    http://tampermonkey.net/
// @version      0.9.3
// @description  Visualization of notes (based on Chacha-26 script)
// @author       Hustandant#1917
// @match        *://multiplayerpiano.net/*
// @icon         https://github.com/Hustoroff/mpp/blob/main/icon.png?raw=true
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/445449/VisNotes%20MPP.user.js
// @updateURL https://update.greasyfork.org/scripts/445449/VisNotes%20MPP.meta.js
// ==/UserScript==
window.addEventListener('load', (event) => {
//++++++++++++++++++ You can change this (Hot keys) ++++++++++++++++++++

const OnOff = "113"; //F2
const FirstKey = "3"; //3
const SecondKey = "Tab"; //Tab

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var notes = 0, nps = 0, fps = 0;

async function ping() {
  let start = Date.now();
  try { await fetch(`${window.location.protocol}${MPP.client.uri.slice(4)}`) }
  catch(err) {}
  return (Date.now() - start);
};

function fpsCount() { fps += 1; requestAnimationFrame(fpsCount) };

requestAnimationFrame(fpsCount);

if(!localStorage.getItem("speed")) localStorage.setItem("speed", 60);
var noteSpeed = localStorage.getItem("speed"); //default 60 per sec

MPP.client.on("a", function(msg) {
    let message = msg.a.split(" ");
    if(message[0] == "speed" && msg.p.id == MPP.client.participantId && !isNaN(Number(message[1]))) {
        noteSpeed = (Number(message[1]) > 1000) ? 1000 : (Number(message[1]) <= 0) ? 1 : Number(message[1]);
        localStorage.setItem("speed", noteSpeed);
        document.getElementById("nspd").innerText = noteSpeed;
    }
});

MPP.client.emit("notification", {
		title: "VisNotes MPP script (by Hustandant#1917)",
        id:"Script_notification",
		duration:20000,
        target:"#piano",
        html:`<p><h3><font id="f2" color="">F2</font> - show/hide notes window</h3></br></p><p><h3><font id="3d" color="">Tab+3</font> - on/off darkly window</h3></br></p><p><h4><font color="limegreen">${noteSpeed}</font> - current speed (<span style="background-color: black"><font color="red">to chat "speed" [min - 1 max - 1000]</font></span>)</h4></br></p><p><h5><span style="background-color: black">Example: "speed 60"</span></h5></br></p> Join our discord server: <a target="_blank" href="https://discord.gg/A3SDgxS2Q2">https://discord.gg/A3SDgxS2Q2<a>`
});

const stat = document.createElement("div");
    stat.id = "stat_notes";
    stat.style.opacity = "1";
    stat.style.position = "fixed";
    stat.style["z-index"] = 150;
    stat.style.display = "block";
    stat.style.float = "right";
    stat.style.margin = "auto";
    stat.style.top = `${document.getElementById("piano").height}px`;
    stat.style["background-color"] = "rgba(137, 137, 137, 0.414)";
    stat.style["backdrop-filter"] = "blur(1px)";
    stat.style["font-size"] = "21px"
    stat.innerHTML = `Notes: <span id="notes">0</span> NPS: <span id="nps">0</span> Speed: <span id="nspd">${localStorage.getItem("speed")}</span> NQ: <span id="nquota">${MPP.noteQuota.points}</span> Ping: <span id="ping"></span> FPS: <span id="fps"></span>`;
    stat.style.marginLeft = `${String(document.getElementById("piano").offsetLeft + document.getElementById("piano").getElementsByTagName("canvas")[0].offsetLeft)}px`;


const canvas = document.createElement("canvas");
    canvas.height = parseInt(document.getElementById("piano").style["margin-top"]);
    canvas.width = Math.round(MPP.piano.renderer.width - (MPP.piano.renderer.width - MPP.piano.keys.c7.rect.x2));
    canvas.id = "track_of_notes";
    canvas.style.opacity = "1";
    canvas.style.top = "0";
    canvas.style.display = "block";
    canvas.style.float = "right";
    canvas.style.position = "fixed";
    canvas.style.margin = "auto";
    canvas.style.marginLeft = `${String(document.getElementById("piano").offsetLeft + document.getElementById("piano").getElementsByTagName("canvas")[0].offsetLeft)}px`;
    canvas.style["z-index"] = 150;

    const ctx = window.ctx = canvas.getContext("2d");
    const pixel = window.pixel = ctx.createImageData(document.getElementById("piano").querySelector("canvas").width,canvas.height);
    pixel.data.fill(0);
    let lastUpdate = 0, onlyevery = 4, counter = 0, prevTime = Date.now();
    const noteDB = {};

    Object.keys(MPP.piano.keys).forEach(key => noteDB[key] = MPP.piano.keys[key].rect.x);

    window.redraw = function() {
        if (lastUpdate <= canvas.height && counter++ % 4 == 0) {
            const currentTime = Date.now();
            const deltaTime = currentTime - prevTime;

            ctx.globalCompositeOperation = "copy";
            ctx.drawImage(ctx.canvas, 0, -Math.ceil(deltaTime * (noteSpeed / 1000)));
            ctx.globalCompositeOperation = "source-over";
            ctx.putImageData(pixel, 0, canvas.height - 1);

            prevTime = currentTime;

            if (lastUpdate++ == 0) {
                pixel.data.fill();
            }
        }
        requestAnimationFrame(redraw);
    };

    redraw();
    redraw(); // :)
    redraw(); // :)
    redraw(); // :)

    window.showNote = function(note, col, ch = 0) {
        if (note in noteDB) {
            lastUpdate = 0;
            const idx = (noteDB[note]) * 4;
            if(note.split("").includes("s")) {
                let otS = ((MPP.piano.keys[note].rect.w - Math.round(MPP.piano.renderer.blackBlipWidth))/2)*4;
                for(let i=0; i<(MPP.piano.renderer.blackBlipWidth)*4; i+=4){
                    pixel.data[idx + otS + i] = col[0];
                    pixel.data[idx + otS + i + 1] = col[1];
                    pixel.data[idx + otS + i + 2] = col[2];
                    pixel.data[idx + otS + i + 3] = 255;
                }
            } else {
                let ot = (Math.round((MPP.piano.keys[note].rect.w - Math.round(MPP.piano.renderer.whiteBlipWidth))/2))*4;
                for(let i=0; i<(MPP.piano.renderer.whiteBlipWidth)*4; i+=4){
                    pixel.data[idx + ot + i] = col[0];
                    pixel.data[idx + ot + i + 1] = col[1];
                    pixel.data[idx + ot + i + 2] = col[2];
                    pixel.data[idx + ot + i + 3] = 255;
                }
            }
        }
    }

    document.body.append(canvas);
    document.body.append(stat);

window.addEventListener('resize', resize);

function resize() {
  canvas.width = canvas.width;
  canvas.height = canvas.height;
  canvas.style.width = `${canvas.width / window.devicePixelRatio}px`;
  canvas.style.height = `${canvas.height / window.devicePixelRatio}px`;
  canvas.style.marginLeft = `${String(document.getElementById("piano").offsetLeft + document.getElementById("piano").getElementsByTagName("canvas")[0].offsetLeft)}px`;
};

window.onload = () => {
    if(!localStorage.getItem("display")) localStorage.setItem("display", document.getElementById("track_of_notes").style.display);
    if(!localStorage.getItem("theme")) localStorage.setItem("theme", document.getElementById("track_of_notes").style["background-color"]);

    document.getElementById("track_of_notes").style.display = localStorage.getItem("display");
    document.getElementById("track_of_notes").style["background-color"] = localStorage.getItem("theme");
    document.getElementById("3d").color = (localStorage.getItem("theme") == "rgb(16, 0, 0)") ? "limegreen" : "firebrick";
    document.getElementById("f2").color = (localStorage.getItem("display") == "block") ? "limegreen" : "firebrick";
    noteSpeed = (localStorage.getItem("speed")) ? localStorage.getItem("speed") : 60;
};

window.addEventListener("keydown", function(key) {
    if(key.keyCode == OnOff) {
        document.getElementById("track_of_notes").style.display = (document.getElementById("track_of_notes").style.display == "block") ? "none" : "block";
        localStorage.setItem("display", document.getElementById("track_of_notes").style.display);
        document.getElementById("f2").color = (localStorage.getItem("display") == "block") ? "limegreen" : "firebrick";
        return;
    }
});

function runOnKeys(func, ...codes) {
    let pressed = new Set();

    document.addEventListener('keydown', function(event) {
        pressed.add(event.key);

        for (let code of codes) if (!pressed.has(code)) return;
        pressed.clear();
        func();
    });

    document.addEventListener('keyup', function(event) { pressed.delete(event.key) });
};

    runOnKeys(() => {
          document.getElementById("track_of_notes").style["background-color"] = (document.getElementById("track_of_notes").style["background-color"] == "rgb(16, 0, 0)") ? "" : "rgb(16, 0, 0)";
          localStorage.setItem("theme", document.getElementById("track_of_notes").style["background-color"]);
          document.getElementById("3d").color = (localStorage.getItem("theme") == "rgb(16, 0, 0)") ? "limegreen" : "firebrick";
      },
      FirstKey,
      SecondKey
    );
function stats() { document.getElementById("notes").innerText = notes; document.getElementById("nquota").innerText = MPP.noteQuota.points };

function grad(nq, nqmax) { document.getElementById("nquota").style.color = `rgb(255, ${Math.round((nq/nqmax)*255)}, ${Math.round((nq/nqmax)*255)})` };

setInterval(async () => {
    document.getElementById("nps").innerText = nps;
    document.getElementById("nquota").innerText = MPP.noteQuota.points;
    document.getElementById("ping").innerText = await ping();
    document.getElementById("fps").innerText = fps;
    fps = nps = 0;
    grad(MPP.noteQuota.points, MPP.noteQuota.max);
}, 1000);

const colcache = Object.create(null);
MPP.piano.renderer.__proto__.vis = MPP.piano.renderer.__proto__.visualize;
MPP.piano.renderer.__proto__.visualize = function (n, c, ch) {
  notes += 1;
  nps += 1;
    stats();
    grad(MPP.noteQuota.points, MPP.noteQuota.max);
  this.vis(n,c,ch);
  let co = c in colcache ? colcache[c] : Object.freeze(colcache[c] = [c[1]+c[2], c[3]+c[4], c[5]+c[6]].map(x => parseInt(x, 16)));
  showNote(n.note, co);
};
});
