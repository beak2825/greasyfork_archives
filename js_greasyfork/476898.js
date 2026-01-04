// ==UserScript==
// @name        Effortless
// @author      Seryo
// @description
// @
// @ Controls:
// @
// @ •	V = Spike / Great spike / Spinning spike / Poison spike
// @ •	F = Trap / Boost
// @ •	N = Windmill / Faster windmill / Power mill
// @ •	H = Turret / Teleport / Blocker / Platform / Healing pad
// @ •	0 = Spawn pad
// @ •	Keycode 18 = Wood wall / Stone wall / Castle wall
// @ •	Q = Apple / Cookie / Cheese
// @
// @ Macros toggle with Keycode 186 (change it in line 151)
// @ Change macro keycodes on line 314
// @ Giant map toggles with Keycode 36 (change it in line 395)
// @ Menu toggles with ESC or Keycode 27 (change it in line 158)
// @
// @ Menu Controls:
// @
// @ Toggle biome map with a switch
// @ Toggle CPS display with a switch
// @ Toggle macros manually with a switch
// @ Toggle auto-respawn with a switch (randomly changes your skin on respawn)
// @
// @version     0.2
// @match       *://*.moomoo.io/*
// @namespace   https://greasyfork.org/users/1190411
// @icon        https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @license     MIT
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require     http://code.jquery.com/jquery-3.3.1.min.js
// @require     https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @description Press L to toggle macros: (Spike, Trap, Mill, Turret/Teleport, Heal). Use the "Esc" key to toggle the menu.
// @downloadURL https://update.greasyfork.org/scripts/476898/Effortless.user.js
// @updateURL https://update.greasyfork.org/scripts/476898/Effortless.meta.js
// ==/UserScript==

(function () {
    'use strict';

var pi = Math.PI,
    date = new Date(),
    old = Date.now(),
    cos = Math.cos,
    sin = Math.sin,
    abs = Math.abs,
    pow = Math.pow,
    min = Math.min,
    max = Math.max,
    atan2 = Math.atan2,
    sqrt = Math.sqrt,
    random = Math.random,
    floor = Math.floor;

function rdm(a,b) {
    return Math.floor(Math.random() *(b - a + 1)) + a;
}

function isChatOpen() {
    return document.activeElement.id.toLowerCase() === 'chatbox';
}

function isAllianceInputActive() {
    return document.activeElement.id.toLowerCase() === 'allianceinput';
}

function shhk() {
    return !isChatOpen() && !isAllianceInputActive();
}

    document.body.insertAdjacentHTML('afterbegin', `

    <div id="infomenu" style="display:none; background:rgba(0,0,0,0.8); font-family:'Hammersmith One',sans-serif; position:absolute; width:260px; height:220px; border:2px solid black; border-radius:10px; top:20px; left:20px; z-index:1; box-shadow:5px 5px 10px rgba(0,0,0,0.4);">
        <div class="nameblock" style="font-size:28px; font-weight:bold; color:#fff; padding:10px 0;">Effortless</div>
        <hr>
        <ul style="list-style-type:none; padding:0;">
            <li><label><div class="text" style="font-size:18px; color:#fff;">Biome map</div><span class="checkmark"></span><input type="checkbox" id="NewMap"></label></li>
            <li><label><div class="text" style="font-size:18px; color:#fff;">Show CPS</div><span class="checkmark"></span><input type="checkbox" id="CPSTOGGLER"></label></li>
<li><label>
                 <div class="text" style="font-size:18px; color:#fff; margin-right: 8px;">Macros</div>
<span class="checkmark"></span>
<input type="checkbox" id="AHK">
            </label></li>            <li style="margin-bottom:-55px;"><label><div class="text" style="font-size:18px; color:#fff;">AutoRespawn</div><span class="checkmark"></span><input type="checkbox" id="autospawn"></label></li>
            <li><label><div class="text" style="font-size:18px; color:#fff;" contenteditable="true" id="Soldier_Q"></div><span class=""></span></label></li>
            <li><label><div class="text" style="font-size:18px; color:#fff;" contenteditable="true" id="Clicks"></div><span class=""></span></label></li>
            <li class="transparent-text" style="position:absolute; top:-9999px; left:-9999px; margin-bottom:-20px;">
                <div class="text" style="font-size:18px; color:#fff; margin-top:0px;">
                    <div class="Input_Text_style" style="width:60px; border:none; background:transparent;" contenteditable="true" id="MakeClan"></div>
                </div>
            </li>
        </ul>
        <hr>
        <div class="nameblock" style="font-size:28px; font-weight:bold; color:#fff; padding:10px 0; margin-top:0px;">Hotkeys</div>
        <hr>
        <div class="text" style="font-size:18px; color:#fff; white-space:pre-line;">
            <div style="margin-top:-17px; margin-bottom:-10px; font-size:18px;">V = Spike</div>
            <div style="margin-bottom:-18px; font-size:18px;">F = Trap</div>
            <div style="margin-bottom:-18px; font-size:18px;">N = Mill</div>
            <div style="margin-bottom:-18px; font-size:18px;">H = Turret / Teleport</div>
            <div style="margin-bottom:-18px; font-size:18px;">0 = Spawnpad</div>
            <div style="margin-bottom:-18px; font-size:18px;">Keycode 18 = Wall</div>
            <div style="margin-bottom:-18px; font-size:18px;">Q = Healing</div>
            <div style="margin-bottom:-18px; font-size:18px;">3 = Healing</div>
            <div style="margin-bottom:-18px; font-size:18px;">Keycode 186 = Toggle Macros</div>
        </div>
    </div>
    <style>
        button:active, button:focus { outline:none !important; }
        button::-moz-focus-inner { border:0 !important; }
        .nameblock { font-size:20px; color:#fff; text-align:center; }
        li { font-size:18px; margin-bottom:10px; }
        .text { display:block; font-size:18px; color:#fff; text-align:left; }
        label { display:flex; justify-content:space-between; align-items:center; width:100%; }
        .checkmark { margin-left:10px; }
        ::-webkit-scrollbar { width:5px; height:3px; }
        ::-webkit-scrollbar-button { background-color:#000000; }
        ::-webkit-scrollbar-track { background-color:#808080; }
        ::-webkit-scrollbar-track-piece { background-color:rgba(0,0,0,0.50); }
        ::-webkit-scrollbar-thumb { height:50px; background-color:#666; border-radius:3px; }
        ::-webkit-scrollbar-corner { background-color:#808080; }
        ::-webkit-resizer { background-color:#808080; }
        #infomenu { overflow-y:scroll; overflow-x:hidden; padding:20px; }
        input { outline:0 !important; }
    </style>
    <script>
        var isDragging=false; var initialX; var initialY; var menuElement=document.getElementById("infomenu");
        function dragStart(e) { isDragging=true; initialX=e.clientX-menuElement.getBoundingClientRect().left; initialY=e.clientY-menuElement.getBoundingClientRect().top; }
        function dragEnd() { isDragging=false; }
        function drag(e) { if(!isDragging) return; menuElement.style.left=(e.clientX-initialX)+'px'; menuElement.style.top=(e.clientY-initialY)+'px'; }
        menuElement.addEventListener('mousedown', dragStart);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mousemove', drag);
    </script>
`);

    document.body.insertAdjacentHTML('afterbegin', `
    <div id="ShowMenu">
        <div id="addtext3"> Macros: On</div>
        <div id="addtext4">AutoSpawn: On</div>
        <style>
            #ShowMenu { position:absolute !important; display:block; top:5px; left:-150px; width:auto; height:auto; text-align:center; }
            #addtext, #addtext1, #addtext2, #addtext0, #addtext3, #addtext4 { display:none; color:black; font-weight:bold; font-family:'Hammersmith One',sans-serif; }
            @-webkit-keyframes colorR { 0% { background-position:0% 50% } 50% { background-position:100% 50% } 100% { background-position:0% 50% } }
            @keyframes colorR { 0% { background-position:0% 50% } 50% { background-position:100% 50% } 100% { background-position:0% 50% } }
        </style>
        <script>
            let tm, t="Moo Moo";
            function change(icon, text) { document.querySelector('head title').innerHTML=text; document.querySelector('link[rel="shortcut icon"]').setAttribute('href',icon); }
            window.onfocus=()=> change("https://sandbox.moomoo.io/img/favicon.png?v=1", t);
        </script>
    </div>
`);

document.addEventListener('keydown', function(e) {
        if (e.keyCode === 186 && shhk()) {
            var macrosCheckbox = document.getElementById("AHK");
            macrosCheckbox.click();
        }
    });

document.addEventListener('keydown', function (event) {
        if (event.keyCode === 27 && shhk() && storeMenu.style.display !== 'block') {
            var infomenu = document.getElementById("infomenu");
            infomenu.style.display = (infomenu.style.display === 'none') ? 'block' : 'none';
        }
    });

let mouseX, mouseY, width, height;
let pr, sec, st, bt, ft, mlt, wt, spt, tr;
let AHK = false;
let autospawn = false;
let websocket;

const url = new URL(window.location.href);
window.sessionStorage.force = url.searchParams.get("fc");
const myPlayer = {
    id: null,
    x: null,
    y: null,
    dir: null,
    object: null,
    weapon: null,
    isLeader: null,
    isSkull: null
};
const MsgPack = msgpack;
document.msgpack = msgpack;

WebSocket.prototype.OldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (e) {
    if (!websocket) {
        Greasy(this);
        websocket = this;
        document.websocket = this;
    }
    this.OldSend(e);
};
function Greasy(msg){
    msg.addEventListener('message', function(cd){
        Handler(cd);
    });
}
function Handler(e) {
    let tmp = MsgPack.decode(new Uint8Array(e.data));
    let data;
    if(tmp.length >= 1) {
        data = [tmp[0], ...tmp[1]];
        if (data[1] instanceof Array){
            data = data;
        }
    } else {
        data = tmp;
    }
    let item = data[0];
    if(!data) {
        return;
    }
    if (item == "a") {
        for(let e = 0; e < data[1].length / 13; e++) {
            let Arr = data[1].slice(13*e, 13*e+13);
            if(Arr[0] == myPlayer.id) {
                myPlayer.x = Arr[1];
                myPlayer.y = Arr[2];
                myPlayer.dir = Arr[3];
                myPlayer.object = Arr[4];
                myPlayer.weapon = Arr[5];
                myPlayer.isLeader = Arr[8];
                myPlayer.isSkull = Arr[11];
            }
        }
    }
    if (item == "C" && myPlayer.id == null){
        myPlayer.id = data[1];
    }
    if (item == "io-init") {
        let cvs = document.getElementById("gameCanvas");
        width = cvs.clientWidth;
        height = cvs.clientHeight;
        $(window).resize(function() {
            width = cvs.clientWidth;
            height = cvs.clientHeight;
        });
        cvs.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }
    UpdateItems();
    if(autospawn == true){
        item == "P" &&
            setTimeout(() => {
            emit('M', {name:localStorage.getItem("moo_name"), moofoll: "1", skin: rdm(8,1)});
        },3000);
    }
}

function Sender(e) {
    websocket.send(new Uint8Array(Array.from(MsgPack.encode(e))));
}
function emit(e,a,b,c,m,r) {
    Sender([e, [a,b,c,m,r]]);
}

function use(e, a = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    emit("G", e, null);
    emit("d", 1, a);
    emit("d", 0, a);
    emit("G", myPlayer.weapon, true);
}

function useQ(e) {
    emit("G", e, null);
    emit("d", 1, null);
    emit("d", 0, null);
    emit("G", myPlayer.weapon, true);
}

const rptr = function (key, action, interval) {
    let _isKeyDown = false;
    let _lastExecution = 0;
    let _animationFrameId = null;

    const intervalCallback = (timestamp) => {
        if (!_isKeyDown) return;

        if (timestamp - _lastExecution >= interval) {
            action();
            _lastExecution = timestamp;
        }

        _animationFrameId = requestAnimationFrame(intervalCallback);
    };

    return {
        start(keycode) {
            if (keycode === key && shhk()) {
                _isKeyDown = true;

                // Ejecutar la acción inmediatamente sin demora
                if (key !== 81 && key !== 51) action();

                if (_animationFrameId === null) {
                    _animationFrameId = requestAnimationFrame(intervalCallback);
                }
            }
        },
        stop(keycode) {
            if (keycode === key && shhk()) {
                _isKeyDown = false;
                if (_animationFrameId !== null) {
                    cancelAnimationFrame(_animationFrameId);
                    _animationFrameId = null;
                }
            }
        },
    };
};

const createHotkey = (keyCode, action) => rptr(keyCode, () => {
        action();
    }, 37);

const KeyHeal_3 = createHotkey(51, () => useQ(ft, null));
const KeyHeal_Q = createHotkey(81, () => useQ(ft, null));
const Put_Boost = createHotkey(70, () => use(bt));
const Put_Spike = createHotkey(86, () => use(st));
const Put_Mills = createHotkey(78, () => use(mlt));
const Put_Turret = createHotkey(72, () => use(tr));
const Put_Wall = createHotkey(18, () => use(wt));
const Put_Spawn = createHotkey(48, () => use(spt));
const handleKeyEvent = (e, action) => {
    if (AHK) {
        KeyHeal_3[action](e.keyCode);
        KeyHeal_Q[action](e.keyCode);
        Put_Boost[action](e.keyCode);
        Put_Spike[action](e.keyCode);
        Put_Mills[action](e.keyCode);
        Put_Turret[action](e.keyCode);
        Put_Wall[action](e.keyCode);
        Put_Spawn[action](e.keyCode);
    }
};

document.addEventListener('keydown', (e) => {
    handleKeyEvent(e, 'start');
});

document.addEventListener('keyup', (e) => {
    handleKeyEvent(e, 'stop');
});

function UpdateItems() {
    for (let i=0;i<9;i++){ if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){ pr = i; }}

    for (let i=9;i<16;i++){ if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){ sec = i; }}

    for (let i=16;i<19;i++){ if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){ ft = i - 16; }}

    for (let i=19;i<22;i++){ if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){ wt = i - 16; }}

    for (let i=22;i<26;i++){ if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){ st = i - 16; }}

    for (let i=26;i<29;i++){ if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){ mlt = i - 16; }}

    for (let i=31;i<33;i++){ if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))){ bt = i - 16; }}

   for (let i=33;i<39;i++){ if (Element_Visible(document.getElementById("actionBarItem" + i.toString())) && i != 36){ tr = i - 16; }}

        spt = 20;
}

function Element_Visible(e) {
    return e.offsetParent !== null;
}
function findVisibleItem(start, end) {
    for (let i = start; i < end; i++) {
        if (Element_Visible(document.getElementById("actionBarItem" + i.toString()))) {
            return i;
        }
    }
    return 0;
}
var Soldier_Q = false;
var Clicks = false;
var bigMap = false;
var leaderBlock = document.getElementById("leaderboard");
var scoreDisplay = document.getElementById("scoreDisplay");
var mapDisplay = document.getElementById("mapDisplay");
var chatBox = document.getElementById("chatbox");
var allianceInput = document.getElementById("allianceInput");

// Event listener para clicks en el canvas
const cvs = document.getElementById("gameCanvas");
cvs.addEventListener("mousedown", clicks, false);

function clicks(e) {
    if (Clicks && (e.button === 0 || e.button === 2)) {
        const addTextId = e.button === 0 ? 'addtext1' : 'addtext2';
        document.getElementById(addTextId).style.display = "block";
    }
}

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 36 && shhk()) {
        if (e.keyCode === 36) {
            const mapDisplay = $("#mapDisplay");

            if (!bigMap) {
                bigMap = true;
                mapDisplay.css({
                    "background-size": "425px",
                    "position": "absolute",
                    "margin-top": "150px",
                    "right": "20px",
                    "background-color": "rgba(0, 0, 0, 0.1)",
                    "height": "425px",
                    "width": "425px",
                    "border-radius": "5px",
                });

                if (scoreDisplay) {
                    scoreDisplay.style.display = "none";
                }
            } else {
                bigMap = false;
                mapDisplay.css({
                    "background-size": "130px",
                    "position": "absolute",
                    "bottom": "20px",
                    "left": "20px",
                    "margin-top": "638px",
                    "background-color": "rgba(0, 0, 0, 0.1)",
                    "height": "130px",
                    "width": "130px",
                    "box-shadow": "none",
                    "border": "none"
                });

                if (scoreDisplay) {
                    scoreDisplay.style.display = "block";
                }
            }
        }
    }
});

var infomenu = document.getElementById("infomenu");
    var autoSpawnCheckbox = document.querySelector("#autospawn");
    var addText4Element = document.getElementById('addtext4');
    var cpsss = document.querySelector("#CPSTOGGLER");
    var AHKK = document.querySelector("#AHK");
    var cl = document.querySelector("#Clicks");
    var NewMapp = document.querySelector("#NewMap");
    var cpsM = document.getElementById("cpss");

autoSpawnCheckbox.addEventListener('change', function () {
        var isChecked = this.checked;
        addText4Element.style.display = isChecked ? "block" : "none";
        autospawn = isChecked;
    });

    cpsss.addEventListener('change', function () {
        cpsM.style.display = this.checked ? "block" : "none";
    });

    AHKK.addEventListener('change', function () {
        var addtext3 = document.getElementById('addtext3');
        AHK = this.checked;
        addtext3.style.display = AHK ? "block" : "none";
    });

    cl.addEventListener('change', function () {
        var addtext = document.getElementById('addtext');
        Clicks = this.checked;
        addtext.style.display = Clicks ? "block" : "none";
    });

    NewMapp.addEventListener('change', function () {
        mapDisplay.style.background = this.checked ? "url('https://wormax.org/chrome3kafa/moomooio-background.png')" : "rgba(0, 0, 0, 0.1)";
    });

var cps = 0;
var click = 1;

function handleMouseDown(e) {
    if ((e.which == 1 || e.button == 1) && click == 1) {
        cps++;
        setTimeout(() => {
            cps--;
        }, 950);
    }
}

$("#gameCanvas").mousedown(handleMouseDown);
document.addEventListener("mousedown", handleMouseDown, false);

cpsM = document.createElement("div");
const cpsMStyle = cpsM.style;

Object.assign(cpsMStyle, {
    display: "none",
    color: '#fff',
    fontFamily: "'Hammersmith One', sans-serif",
    fontSize: '30px',
    left: '20px',
    position: 'fixed',
});

cpsM.id = "cpss";
document.body.appendChild(cpsM);

function updateCPS() {
    cpsM.textContent = `Cps: ${cps}`;
    requestAnimationFrame(updateCPS);

    const cpstoggler = document.querySelector("#CPSTOGGLER");
    cpsMStyle.textShadow = cpstoggler.checked ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : 'none';

    const infomenu = document.getElementById("infomenu");
    cpsMStyle.top = infomenu.style.display === 'block' ? '295px' : '20px';
}

updateCPS();

})();