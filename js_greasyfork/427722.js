//******************************************************** GATS:IO SCRIPT ********************************************************************/
// ==UserScript==
// @name         Gats.io - Vaakir's hack pack GUI
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Hacks, and color mod v1 by Vaakir with the colod mod v2 from nitrogem35
// @author       Vaakir youtube & nitrogem35
// @run-at       document-end
// @match        https://gats.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427722/Gatsio%20-%20Vaakir%27s%20hack%20pack%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/427722/Gatsio%20-%20Vaakir%27s%20hack%20pack%20GUI.meta.js
// ==/UserScript==

// COMMENT        : I got bored, okay? So I just made a GUI for some of the scripts, hope y'all like it, I'm satisfied :>
// GATS DEVELOPER : (translate) Ich werde wahrscheinlich diese .io-Spiele verlassen, das Ändern der Funktion [Namen] reicht aus, um dieses Skript zu patchen. Bis das passiert, trololol :joy:
// GATS DEVELOPER : Im probably leaving gonna these .io games, changing the function [names] is enough to patch this script. Untill that happens, trololol :joy:

(function() {

let overlayHTML = `
<link href="https://fonts.googleapis.com/css?family=Orbitron:900" rel="stylesheet"/>
<div id="box">
    <div class="ou" id="box2">
        <p style="color:white;">⚡ Gats.io Full Hack pack ⚡</p>
        <p id="ytlink"><a href="https://www.youtube.com/channel/UC2m-9cAoT8EEO2dqWlk4Yfw" target="_blank">Vaakir Youtube</a></p>
        <section><label>Aimbot [Right click]</label>                         <input id="aimbot"             type="checkbox" value="#0000ff"></section>
        <section><label>Zoom [mousewheel] </label><div class="checked"></div></section>
        <section><label>Mine detection     </label><div class="checked"></div></section>
        <section><label>Ghost detection    </label><div class="checked"></div></section>
        <section><label>Silencer detection </label><div class="checked"></div></section>

        <section><label>Crate</label>                                        <input id="acrate"             type="color"    value="#dfbf9f"></section>
        <section><label>Long Crate</label>                                   <input id="alongCrate"         type="color"    value="#bec8dd"></section>
        <section><label>Crate Border</label>                                 <input id="acrateborder"       type="color"    value="#808080"></section>
        <section><label>Long Crate Border</label>                            <input id="alongcrateborder"   type="color"    value="#808080"></section>
        <section><label>Player Crate Border</label>                          <input id="playercrateborder"  type="color"    value="#808080"></section>
        <section><label>Random Crate Colors</label>                          <input id="arandom"            type="checkbox" value="#0000ff"></section>
        <section><label>Random Crate Borders</label>                         <input id="arandom2"           type="checkbox" value="#0000ff"></section>
        <section><label>Seizure Mode</label>                                 <input id="seizure"            type="checkbox" value="#0000ff"></section>
        <section><label>Vaakir Mode</label>                                  <input id="vaakirmode"         type="checkbox" value="#0000ff"></section>
        <section><label>Reset To Defaults</label>                            <input id="default"            type="checkbox" value="#0000ff"></section>
        <section><label>Multiboxing </label><div class="checked notchecked"></div></section>
        <section><label>Auto upgrading </label><div class="checked notchecked"></div></section>
        <section><label>Scrolling text </label><div class="checked notchecked"></div></section>
    </div>
    <button class="ou" id="accordian">Toggle</button>
</div>
<style>
#box {
    z-index: 10;
    position: absolute;
    bottom: 10vh;
    left: 10px;}
#box2 {
    padding: 15px;
    margin-bottom: 5px}
section {
    display: flex;
    justify-content: space-between;margin:5px;}
.ou {
    background-color: rgba(85,85,85,0.5);
    letter-spacing: 3px;

    font-weight: bold;
    font-size: 15px;
    font-family: Orbitron;
    color:white;}
p { text-align: center;border-bottom:1px solid white;}
#ytlink { border:0;}
#ytlink a{ color:lime;}
#accordian {
    width: 100%;
    border:0;}
label { font-weight: bold;}
input {
    margin-top: auto;
    margin-bottom: auto;
    transform: scale(1.3);}
input:hover { cursor: pointer;}
input:focus { box-shadow: 0 0 10px #9ecaed;}
input[type=checkbox] { transform: scale(2.2);outline=none;}
input[type=radio] { border-top: auto;}
input[type=color] { width: 50px;}
.checked {
    height: 20px;
    width: 20px;
    box-shadow: -1px -2px 5px gray;
    border: 3px solid gray;
    background-color: green;
    margin-top: auto;
    margin-bottom: auto;
    box-shadow: 2 2 2px #a0a0a0;
    width:20px;
    transform: scale(1.5);}
.notchecked { background-color: red;}
</style>
`

// Usefull functions..
function get(x)            { return document.getElementById(x); }
function rColor()          { return rgbToHex(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)); }
function componentToHex(c) { var hex = c.toString(16);return hex.length == 1 ? "0" + hex : hex; }
function rgbToHex(r, g, b) { return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b); }

// Setting up the html div
let overlay             = document.createElement("div");
    overlay.innerHTML   = overlayHTML;
    document.body.appendChild(overlay);

// Getting variables from div by id's
let acrate              = get("acrate"),
    alongCrate          = get("alongCrate"),
    acrateborder        = get("acrateborder"),
    alongcrateborder    = get("alongcrateborder"),
    aplayercrateborder  = get("playercrateborder"),
    ran                 = get("arandom"),
    ran2                = get("arandom2"),
    seizure             = get("seizure"),
    defaults            = get("default"),
    acc                 = get("accordian"),
    vaakirmod           = get("vaakirmode"),
    aimbot              = get("aimbot");

let loop                = undefined;
let defaultColors       = ["#dfbf9f","#bec8dd","#808080"];
let zoom                = 1;
let initAimbot          = false;

// Color picker on change
alongCrate.onchange         = function() { window.longCrate[0][1][1][3] = this.value; }
acrate.onchange             = function() { window.crate[0][1][1][3] = this.value;     }
acrateborder.onchange       = function() { window.crate[0][0][1][3] = this.value;     }
alongcrateborder.onchange   = function() { window.longCrate[0][0][1][3] = this.value; }
aplayercrateborder.onchange = function() { window.userCrate[0][0][1][3] = this.value; }
ran.onclick = function() {
    if (this.checked) {
        let c=rColor(), c2=rColor();
        window.crate[0][1][1][3]=c; acrate.value=c;
        window.longCrate[0][1][1][3]=c2;alongCrate.value=c2;
        this.checked = false;
    }
}
ran2.onclick = function() {
    if (this.checked) {
        let c=rColor(), c2=rColor(), c3=rColor();
        window.crate[0][0][1][3]=c;acrateborder.value=c;
        window.longCrate[0][0][1][3]=c2;alongcrateborder.value=c2;
        window.userCrate[0][0][1][3]=c3;aplayercrateborder.value=c3;
        this.checked = false;
    }
}
seizure.onclick = function() {
    if(!loop) {
        loop = setInterval(function(){
            let c=rColor(), c2=rColor();
            window.crate[0][1][1][3] =c;acrate.value=c;
            window.longCrate[0][1][1][3]=c2;alongCrate.value=c2;
            let e=rColor(), e2=rColor(), e3=rColor();
            window.crate[0][0][1][3]=e;acrateborder.value=e;
            window.longCrate[0][0][1][3]=e2;alongcrateborder.value=e2;
            window.userCrate[0][0][1][3]=e3;aplayercrateborder.value=e3;
        }, 100)
    }
else { clearInterval(loop); loop=undefined; }
}
defaults.onclick = function() {
    if (this.checked) {
        window.crate[0][1][1][3]     = defaultColors[0]; acrate.value             = defaultColors[0];
        window.crate[0][0][1][3]     = defaultColors[2]; acrateborder.value       = defaultColors[2];
        window.longCrate[0][1][1][3] = defaultColors[1]; alongCrate.value         = defaultColors[1];
        window.longCrate[0][0][1][3] = defaultColors[2]; alongcrateborder.value   = defaultColors[2];
        window.userCrate[0][0][1][3] = defaultColors[2]; aplayercrateborder.value = defaultColors[2];
        this.checked = false;
    }
}
vaakirmod.onclick = function() {
    window.crate[0][0][1][3]     = "#4dd8f0"; acrate.value           = "#4dd8f0";
    window.crate[0][1][1][3]     = "#b1e9f9"; acrateborder.value     = "#b1e9f9";
    window.longCrate[0][0][1][3] = "#303030"; alongCrate.value       = "#303030";
    window.longCrate[0][1][1][3] = "#646464"; alongcrateborder.value = "#646464";
    this.checked = false;
}

// Toggle functionality
acc.onclick = function() {
    let panel = get("box2");
    if (panel.style.display == "grid") panel.style.display = "none";
    else { panel.style.display = "grid"; }
}

// Zoom hack on mousewheel scrolling
window.addEventListener("wheel", function(e) {
    let dir = Math.sign(e.deltaY);
    if (dir== 1) {j7*=1.1;j8*=1.1;a1();zoom*=1.1;}
    if (dir==-1) {j7*=0.95;j8*=0.95;a1();zoom*=0.95;}
});

// The script just commits suicide without a timeout apparantly. Bc of (0) data
setTimeout(function(){
    // Shows landmines
    landMine[0].forEach((a,i)=>{landMine[0][i][1][3]="#000000"});

    // Shows camos
    setInterval(()=>{Object.keys(RD.pool).forEach((a,i)=>{
        if(RD.pool[i].ghillie){RD.pool[i].ghillie=0;RD.pool[i].invincible=1}
    })},30);

    // Shows silencers
    setInterval(()=>{Object.keys(RC.pool).forEach((a,i)=>{
        if(RC.pool[i].silenced){RC.pool[i].silenced=0}
    })},30);
}, 3000);

// Aimbot w/tracers [I know, I know, the code could be prettified, but fuck that, lemme just publish it as it is, I have other projects calling..]
let hw   = document.getElementById("canvas");
let can1 = document.createElement("canvas");
can1.id  = "c1"; can1.width = 1224; can1.height = 768;
can1.style.zIndex = 1; can1.style.position = "absolute";
document.getElementsByTagName("body")[0].appendChild(can1);
let myctx = can1.getContext("2d");

aimbot.onclick = function() {
    if (this.checked == false) myctx.clearRect(0, 0, can1.width, can1.height);
}
// Right click to switch aimbot on/off
document.addEventListener('contextmenu', function(e) {
    if (e.which == 3) {
        if (aimbot.checked) {
            aimbot.checked=false;
            myctx.clearRect(0, 0, can1.width, can1.height);
        } else aimbot.checked = true;
    }
});

// Im fully aware I could optimize and shorten this down 2 times
setInterval(function(){
    if (aimbot.checked) {
        can1.width  = hw.width;
        can1.height = hw.height;
        let enemies = [];
        let me = RD.pool[c3];
        for(let player of Object.values(RD.pool)) {
            if(!player.activated) continue
            if(player.id == me.id) continue
            if(player.teamCode) if(player.teamCode == me.teamCode) continue
            if(player.hp == 0) continue
            enemies.push(player)
        }

        let diX;
        let diY;
        let num = 0;
        let dis = 10000;
        for (let i = 0;i<enemies.length;i++) {
            let ndis = Math.sqrt( (enemies[i].x-RD.pool[c3].x)**2 + (enemies[i].y-RD.pool[c3].y)**2 );
            if (ndis < dis) {
                dis = ndis;
                num = i;
            }
        }
        dis /= 35;

        let playerScreenPos    = c2.getRelPos(RD.pool[c3]);
        playerScreenPos.x *= j5;
        playerScreenPos.y *= j5;
        let angle = RD.pool[c3].mouseAngle*(Math.PI / 180);
        let playerGunPos = {
            x: playerScreenPos.x+Math.cos(angle-Math.PI/18)*(80*j5),
            y: playerScreenPos.y+Math.sin(angle-Math.PI/18)*(80*j6)
        };

        if (enemies.length >= 1) {
            diX = (enemies[num].x-RD.pool[c3].x)+playerScreenPos.x;
            diY = (enemies[num].y-RD.pool[c3].y)+playerScreenPos.y;
            let newY, newX, me=RD.pool[c3];

            // Not necessary but, yk, I found it pretty usefull
            if (enemies[num].dashing == 0) {
                newX = diX+enemies[num].spdX*dis;
                newY = diY+enemies[num].spdY*dis;
            } else {
                newX = diX;
                newY = diY;
            }
            if (aimbot.checked) {a57({clientX:newX,clientY:newY});}
        }

        myctx.strokeStyle = "red";
        myctx.lineWidth   = 3;
        for (let i=0;i<enemies.length;i++) {
            dis = Math.sqrt(  (enemies[i].x-RD.pool[c3].x)**2 + (enemies[i].y-RD.pool[c3].y)**2  )/35;
            diX = (enemies[i].x-RD.pool[c3].x)+playerScreenPos.x+enemies[i].spdX*dis;
            diY = (enemies[i].y-RD.pool[c3].y)+playerScreenPos.y+enemies[i].spdY*dis

            myctx.moveTo(playerGunPos.x,playerGunPos.y);
            myctx.lineTo(diX,diY);
            myctx.stroke();
        }
    }
});
})();