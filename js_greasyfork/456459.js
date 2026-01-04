// ==UserScript==
// @name         HueHanaejistla's Diep.io Multiboxing Script
// @version      3.0.6
// @description  give credit if you make a tutorial or anything
// @author       HueHanaejistla!
// @match        *://scenexe.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/en/users/303221-huehanaejistla-inc
// @downloadURL https://update.greasyfork.org/scripts/456459/HueHanaejistla%27s%20Diepio%20Multiboxing%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/456459/HueHanaejistla%27s%20Diepio%20Multiboxing%20Script.meta.js
// ==/UserScript==
/*
 Ver. 3.0.5 update: script no longer available for public download
*/ const sMB = 'f'; /* Toggle sync mouse
*/ const sKB = 'v'; /* Toggle sync keys
*/ const rUI = 'r'; /* Toggle GUI visibility
*/ const speed = 10; /* Speed of the script's loop, in milliseconds. Lower numbers = higher speed, smooth movement, but more laggy. Higher numbers = slower speed, "jerky" movement on other tabs.

 Don't edit the code below unless you know what you are doing. If you decide for some reason to make an edited version of my script
 instead of making your own, you better keep it to yourself because I don't care for people taking credit and saying I "worked" with them*/

var oy = document.createElement("div"); document.body.appendChild(oy);
function gKD(e) {
    switch (e.key) {
        case 'Shift': if (cK) cK = false; GM_setValue("GM_SYNCK", cK);break;
        case sKB: cK = Boolean(cK ^ 1); GM_setValue("GM_SYNCK", cK); break;
        case sMB: cM = Boolean(cM ^ 1); GM_setValue("GM_SYNCM", cM); break;
        case rUI: gUI = Boolean(gUI ^ 1); if (gUI) { el.style.display = "block"; break; } el.style.display = "none"; break;
    }
    const str = e.keyCode.toString();
    if (press.indexOf(str + ".1") === -1 && press.indexOf(str + ".0") === -1) { press.push(str + ".1"); }
    if (press.indexOf(str + ".0") !== -1) { press[press.indexOf(str + ".0")] = str + ".1"; }
    GM_setValue("GM_pA", press);
}
function gKU(event) {
    if (event.key === 'Shift') { if (!cK) cK = true; GM_setValue("GM_SYNCK", cK); }; var str = event.keyCode.toString();
    if (press.indexOf(str + ".1") !== -1) press[press.indexOf(str + ".1")] = str + ".0";
    GM_setValue("GM_pA", press);
}
function gMD(mo) { mouseArray[mo.button] = 1; GM_setValue("GM_clicks", mouseArray); }
function gMU(mo) { mouseArray[mo.button] = 0; GM_setValue("GM_clicks", mouseArray); }
function gM(o) {
    screenBoxCX = window.innerWidth / 2; screenBoxCY = window.innerHeight / 2;
    var mCX = o.clientX - screenBoxCX; var mCY = o.clientY - screenBoxCY;
    GM_setValue("GM_mR", [mCX / screenBoxCX, mCY / Math.abs(mCX)]);
}
document.addEventListener('keydown', gKD); document.addEventListener('keyup', gKU);
document.addEventListener('mousedown', gMD); document.addEventListener('mouseup', gMU);
document.addEventListener('mousemove', gM);
function pressKey(code, ud) { // Credit to bela for this, pretty handy
    var eventObj;
    if (ud) { eventObj = document.createEvent("Events"); eventObj.initEvent("keydown", true, true); eventObj.keyCode = code; window.dispatchEvent(eventObj); return; }
    eventObj = document.createEvent("Events"); eventObj.initEvent("keyup", true, true); eventObj.keyCode = code; window.dispatchEvent(eventObj);
}
function sendMouse(x, y, c) {
    canvas.dispatchEvent(new MouseEvent('mousemove', { 'clientX': x + screenBoxCX, 'clientY': y + screenBoxCY}));
    var i = 0; if (c) { while (i < c.length) {
        if (c[i]) { canvas.dispatchEvent(new MouseEvent('mousedown', { 'clientX': x + screenBoxCX, 'clientY': y + screenBoxCY, 'button': i })); }
        if (!c[i]) { canvas.dispatchEvent(new MouseEvent('mouseup', { 'clientX': x + screenBoxCX, 'clientY': y + screenBoxCY, 'button': i })); }
        i++;
    }}
}
const HTML = `<style>
.main {
pointer-events: none; position: fixed; top: 10px; left: 10px;
font-family: 'Comic Sans MS', cursive, sans-serif;
color: #FFFFFF; font-style: normal; font-variant: normal;
}
</style>
<div class="main" id="all">
<p id="guia">HueHanaejistla's multiboxing script<br>Sync Mouse = wait [${sMB.toUpperCase()}]<br>Sync Keys = wait [${sKB.toUpperCase()}]<br>Overlay [${rUI.toUpperCase()}]</p></div>`
oy.innerHTML = HTML;

function tabLoop() {
    screenBoxCX = window.innerWidth / 2; screenBoxCY = window.innerHeight / 2;
    var s = []; if (GM_getValue("GM_SYNCM")) { s[0] = yh; } else { s[0] = nh; } if (GM_getValue("GM_SYNCK")) { s[1] = yh; } else { s[1] = nh; } upd(s);
    master = Boolean(document.hasFocus()); var i = 0;
    while (i < GM_getValue("GM_pA").length) {
        if (!master && GM_getValue("GM_SYNCK") == true) {
            var pr = GM_getValue("GM_pA")[i].split('.'); pressKey(parseInt(pr[0]), parseInt(pr[1]));
        } i++; }
    if (!master && GM_getValue("GM_SYNCM") == true) {
        sendMouse(GM_getValue("GM_mR")[0] * screenBoxCX, GM_getValue("GM_mR")[1] * Math.abs(GM_getValue("GM_mR")[0] * screenBoxCX), GM_getValue("GM_clicks"));
    }
}
setInterval(tabLoop, speed);
var press = []; var mouseArray = []; var screenBoxCX = window.innerWidth / 2; var screenBoxCY = window.innerHeight / 2; var hyju = [sMB, sKB, rUI]; const f = ['\x3c\u0062\u0072\x3e']; const g = ['\x3c\x70\u003e', '\u0048\u0075\u0065\u0048\u0061\x6e\x61\u0065\x6a\x69\x73\x74\u006c\x61\x27\u0073', '\x6d\x75\u006c\u0074\u0069\u0062\x6f\x78\u0069\u006e\x67', '\x73\x63\x72\x69\u0070\u0074']; const yh = "yeah"; var master = false; const y = ['\x53\u0079\x6e\u0063', '\u004b\x65\u0079\u0073', '\x3d']; const el = document.getElementById('all'); const b = ['\u0053\x79\x6e\u0063', '\x4d\x6f\x75\u0073\u0065', '\x3d', '\x4f\u0076\x65\u0072\x6c\u0061\u0079']; const upd = function (s) { document.getElementById('guia').innerHTML = `${g[0]} ${g[1]} ${g[2]} ${g[3]}${f[0]}${b[0]} ${b[1]} ${b[2]} ${s[0]} [${hyju[0]}]${f[0]} ${y[0]} ${y[1]} ${y[2]} ${s[1]} [${hyju[1]}]${f[0]} ${b[3]} [${hyju[2]}]</p>`; }; var cK = false; var cM = false; var gUI = false; const nh = "nah";