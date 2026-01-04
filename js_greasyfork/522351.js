// ==UserScript==
// @name         MoonJoy Lisa?
// @namespace    We Shall rise once again
// @version      1
// @description  Testing this laggy af mod how to fix
// @author       Sigma
// @match        *://*.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522351/MoonJoy%20Lisa.user.js
// @updateURL https://update.greasyfork.org/scripts/522351/MoonJoy%20Lisa.meta.js
// ==/UserScript==

/*
-- I DO NOT OWN THIS MOD
- SaVeGe
*/

let backgroundDiv = document.createElement("div");
backgroundDiv.style.position = "fixed";
backgroundDiv.style.top = "0";
backgroundDiv.style.left = "0";
backgroundDiv.style.width = "100%";
backgroundDiv.style.height = "100%";
backgroundDiv.style.background = "#212121";
backgroundDiv.style.backgroundSize = "cover";
backgroundDiv.style.backgroundRepeat = "no-repeat";
backgroundDiv.style.backgroundPosition = "center";
backgroundDiv.style.display = "flex";
backgroundDiv.style.justifyContent = "center";
backgroundDiv.style.alignItems = "center";
backgroundDiv.style.color = "white";
backgroundDiv.style.fontSize = "35px";
backgroundDiv.style.zIndex = "99999999";
backgroundDiv.style.transition = "0.5s";
backgroundDiv.innerHTML = "\n<style>\nh1 {\nfont-size: 50px;\n}\n</style>\n\n<h1 id=\"loading\">Loading...</h1>\n";
document.body.appendChild(backgroundDiv);
setTimeout(() => {
    backgroundDiv.innerHTML = "\n    <style>\n    h1 {\n        font-size: 50px;\n    }\n    </style>\n    <h1 id=\"loaded\">Game Loaded!</h1>\n    ";
    setTimeout(() => {
        backgroundDiv.style.opacity = "0";
        setTimeout(() => {
            backgroundDiv.style.display = "none";
        }, 500);
    }, 2000);
}, 2500);
const removeSnowflakes = () => {
    const ao = document.querySelectorAll(".snowflake");
    ao.forEach(ap => {
        ap.parentNode.removeChild(ap);
    });
};
const createSnowflake = function() {
    const au = document.createElement("div");
    au.className = "snowflake";
    au.style.position = "absolute";
    au.style.width = "10px";
    au.style.height = "10px";
    au.style.background = "#fff";
    au.style.borderRadius = "50%";
    au.style.zIndex = "9998";
    au.style.opacity = Math.random();
    au.style.left = Math.random() * 100 + "vw";
    au.style.animation = "fall " + (Math.random() * 2 + 1) + "s linear infinite";
    au.addEventListener("animationiteration", function() {
        au.style.left = Math.random() * 100 + "vw";
        au.style.opacity = Math.random();
    });
    return au;
};
const styleSnowflakes = document.createElement("style");
styleSnowflakes.textContent = " @keyframes fall { 0% { transform: translateY(-10vh); opacity: 1; } 100% { transform: translateY(110vh); opacity: 0; } } .fast-fall { animation-duration: " + (Math.random() * 1 + 1) + "s; } ";
document.head.appendChild(styleSnowflakes);
const snowflakeContainer = document.createElement("div");
snowflakeContainer.style.position = "absolute";
snowflakeContainer.style.top = "0";
snowflakeContainer.style.left = "0";
snowflakeContainer.style.width = "100%";
snowflakeContainer.style.height = "100%";
snowflakeContainer.style.pointerEvents = "none";
snowflakeContainer.style.zIndex = "9998";
snowflakeContainer.style.display = "none";
document.body.appendChild(snowflakeContainer);
const maxSnowflakes = 40;
for (let i = 0; i < maxSnowflakes; i++) {
    const snowflake = createSnowflake();
    if (Math.random() > 0.7) {
        snowflake.classList.add("fast-fall");
    }
    snowflakeContainer.appendChild(snowflake);
}
(function() {
    "use strict";

    let ax = document.createElement("script");
    ax.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(ax);
    let ay = document.createElement("div");
    ay.id = "modSidebar";
    ay.style = "\n        position: fixed; top: 10px; left: 10px; width: 200px;\n        background-color: #2c2f33; color: #fff; padding: 10px;\n        border-radius: 10px; z-index: 1000; font-family: Arial, sans-serif;\n        box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); transition: opacity 0.5s ease,\n        visibility 0.5s ease, transform 0.5s ease; opacity: 0; visibility: hidden;\n        transform: translateX(-220px);\n    ";
    let az = document.createElement("div");
    az.id = "modRightPanel";
    az.style = "\n        position: fixed; top: 10px; left: 220px; width: 350px;\n        background-color: #2c2f33; color: #fff; padding: 10px;\n        border-radius: 10px; z-index: 1000; font-family: Arial, sans-serif;\n        box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); transition: opacity 0.5s ease,\n        visibility 0.5s ease, transform 0.5s ease; opacity: 0; visibility: hidden;\n        transform: translateX(0);\n    ";
    ay.innerHTML = "\n    <h3 style=\"\n        margin-top: 0;\n        text-align: center;\n        text-shadow: 0 0 5px rgba(255, 192, 203, 0.8),\n                     0 0 10px rgba(255, 192, 203, 0.6),\n                     0 0 15px rgba(255, 192, 203, 0.4);\n        color: #fff;\n    \">\n                 Mod for Joykid<3<3\n    <br>\n    <span class=\"subText\">  Mod Fucked by Moonrocks  </span>\n    </h3>\n   <div id=\"tabs\">\n    <button id=\"visualTab\" class=\"tab active\">\n        <img src=\"https://i.ibb.co/z5v8XYc/eyebrow-removebg-preview.png\" class=\"tabIcon\"> Visuals\n    </button>\n    <button id=\"combatTab\" class=\"tab\">\n        <img src=\"https://i.ibb.co/85pZqGk/sword-removebg-preview.png\" class=\"tabIcon\"> Combat\n    </button>\n    <button id=\"miscTab\" class=\"tab\">\n        <img src=\"https://i.ibb.co/gytFzqL/more-1-removebg-preview.png\" class=\"tabIcon\"> Misc\n    </button>\n    <button id=\"devTab\" class=\"tab\">\n        <img src=\"https://i.ibb.co/s6nGQS7/web-development-removebg-preview.png\" class=\"tabIcon\"> Gui Customize\n    </button>\n</div>\n\n";
    az.innerHTML = "\n    <div class=\"right-panel\" onmousedown=\"startDrag(event)\">\n        <div id=\"visualContent\" class=\"content active\">\n            <h4>Visual</h4>\n            <label><input type=\"checkbox\" id=\"healAnim\" checked> Heal/Damage Animations</label><br>\n            <label><input type=\"checkbox\" id=\"notifs\" checked> Notifications</label><br>\n            <label><input type=\"checkbox\" id=\"dmgtext\" checked> Damage Text</label><br>\n            <label><input type=\"checkbox\" id=\"fakePing\" checked> FakePing</label><br>\n            <label><input type=\"checkbox\" id=\"font\" checked> Font</label><br>\n            <label><input type=\"checkbox\" id=\"placeVis\"> Render Placers</label><br>\n            <label><input type=\"checkbox\" id=\"daytime\"> Joykid_Visuals</label><br>\n            <label><input type=\"checkbox\" id=\"spinner\"> Spin</label><br>\n            <label><input type=\"checkbox\" id=\"cleanmode\" checked> Cleanmode</label><br>\n            <label><input type=\"checkbox\" id=\"showgrid\"> showGrid?</label><br>\n            <label for=\"BuildHealth\">BuildHealth Style:</label>\n            <select id=\"BuildHealth\" class=\"styledSelect\">\n                <option value=\"bh1\">Rectangle</option>\n                <option value=\"bh2\">Filled Circle</option>\n                <option value=\"bh3\" selected>Outlined Circle</option>\n            </select><br>\n            <label for=\"Camera\">CameraType:</label>\n            <select id=\"cameramodes\" class=\"styledSelect\">\n                <option value=\"camera1\">still</option>\n                <option value=\"camera2\">smooth</option>\n                <option value=\"camera3\" selected>Smooth + mouse</option>\n            </select><br>\n            <label><input type=\"checkbox\" id=\"combatZoom\" checked> Combat Zoom</label><br>\n            <br>\n        </div>\n    </div>\n\n        <div id=\"combatContent\" class=\"content\">\n            <h4>Combat</h4>\n            <label><input type=\"checkbox\" id=\"healingBeta\" checked> Heal </label><br>\n            <label><input type=\"checkbox\" id=\"autoPush\" checked> Auto Push</label><br>\n            <label><input type=\"checkbox\" id=\"smartInsta\" checked> AutoInsta</label><br>\n            <label><input type=\"checkbox\" id=\"antispike\" checked> Anti Spike</label><br>\n            <label><input type=\"checkbox\" id=\"slowOT\"> SlowOneTick</label><br>\n            <label><input type=\"checkbox\" id=\"safeWalk\" checked> safewalk</label><br>\n            <label><input type=\"checkbox\" id=\"killChat\" checked> Kill Chat</label><br>\n            <input type=\"text\" id=\"killChatInput\" value=\"Signature strike incoming!\" placeholder=\"custom killchat\" oninput=\"document.getElementById('killChat').textContent = this.value\"> <br>\n            <label><input type=\"checkbox\" id=\"autoBuy\" checked> Auto Buy</label><br>\n            <label><input type=\"checkbox\" id=\"autoBuyEquip\" chcked> Auto Buy Equip</label><br>\n            <label><input type=\"checkbox\" id=\"preTick\" checked> PreTick</label><br>\n            <label><input type=\"checkbox\" id=\"revTick\" checked> RevTick</label><br>\n            <label><input type=\"checkbox\" id=\"autoPlace\" checked> Auto Place</label><br>\n            <label><input type=\"checkbox\" id=\"autoReplace\" checked> Auto Replace</label><br>\n            <label><input type=\"checkbox\" id=\"spikeTick\" checked> Spike Tick</label><br>\n            <label><input type=\"checkbox\" id=\"antiTrap\" checked> AntiTrap</label><br>\n            <label><input type=\"checkbox\" id=\"attackDir\" > attackDir</label><br>\n            <label><input type=\"checkbox\" id=\"noDir\" checked> noDir</label><br>\n            <label><input type=\"checkbox\" id=\"showDir\" checked> ShowDir</label><br>\n            <label><input type=\"checkbox\" id=\"autoRespawn\"> AutoRespawn</label><br>\n            <label for=\"AntiBullType\">AntiBullMode:</label>\n            <select id=\"antiBullType\" class=\"styledSelect\">\n            <option value=\"noab\" selected>None</option>\n            <option value=\"abreload\">When Reloaded</option>\n            <option value=\"abalway\" >Primary Reloaded</option>\n            </select><br>\n            </label>\n        </div>\n        <div id=\"miscContent\" class=\"content\">\n            <h4>Misc</h4>\n            <label><input type=\"checkbox\" id=\"weaponGrind\" onclick=\"window.startGrind()\"> Weapon Grinder</label><br>\n            <label><input type=\"checkbox\" id=\"safeAntiSpikeTick\" checked> Safe AntiSpikeTick</label><br>\n            <label><input type=\"checkbox\" id=\"turretCombat\" checked> Turret Gear Combat Assistance</label><br>\n            <label><input type=\"checkbox\" id=\"backupNobull\" checked> Backup Nobull Insta</label><br>\n            <label><input type=\"checkbox\" id=\"autoUpgrade\" checked> Smart Upgrade</label><br>\n            <label><input type=\"checkbox\" id=\"autorespond\" > AutoRespond</label><br>\n            <label><input type=\"checkbox\" id=\"autoSync\" checked> AutoSync (press \"0\")</label><br>\n            <label for=\"AutoInsta\">AutoInsta Mode:</label>\n            <select id=\"AutoInsta\" class=\"styledSelect\">\n            <option value=\"always\">Always Insta</option>\n            <option value=\"smart\" selected>Insta on 5 Shame</option>\n            </select><br>\n            </label>\n            <label for=\"syncMode\">SyncMode:</label>\n            <select id=\"synctype\" class=\"styledSelect\">\n            <option value=\"rangesync\">Ranged</option>\n            <option value=\"meleesync\">Melee</option>\n            <option value=\"instasync\">Insta-sync</option>\n            </select><br>\n        </div>\n\n        <div id=\"devContent\" class=\"content\">\n            <h4>Developer</h4>\n            <label><input type=\"checkbox\" id=\"devMode\" checked> DevMode</label><br>\n            <label>Menu Color: <input type=\"color\" id=\"menuColor\" value=\"#2c2f33\"></label><br>\n            <label>Tab Color: <input type=\"color\" id=\"tabColor\" value=\"#7289da\"></label><br>\n        </div>\n    ";
    document.body.appendChild(ay);
    document.body.appendChild(az);
    const ba = document.createElement("style");
    ba.textContent = "\n    .tab {\n        display: flex; align-items: center; width: 100%; padding: 10px;\n        margin-bottom: 5px; background-color: #23272a; color: white;\n        border: none; border-radius: 5px; text-align: left; cursor: pointer;\n        transition: background-color 0.3s ease, transform 0.3s ease;\n    }\n    .tab.active { background-color: #7289da; transform: scale(1.05); }\n    .tab:hover { background-color: #414755; transform: scale(1.05); }\n    .tabIcon {\n        width: 20px; height: 20px; margin-right: 10px;\n        transition: transform 0.3s ease; /* Smooth transition for movement */\n    }\n    .tab:hover .tabIcon {\n        transform: translateX(10px); /* Move icon to the right on hover */\n    }\n    .content { display: none; }\n    .content.active { display: block; }\n    input[type=\"checkbox\"] {\n        background: #999999; position: relative; appearance: none; width: 25px;\n        height: 12px; border-radius: 50px; box-shadow: inset 0 0 5px rgba(41, 41, 41, 0.2);\n        cursor: pointer; top: 7.5px; left: 0; transition: 0.4s;\n    }\n    input[type=\"checkbox\"]:checked {\n        background: #7289da; box-shadow: inset 0 0 5px rgba(41, 41, 41, 0.2);\n    }\n    input[type=\"checkbox\"]::before {\n        content: \"\"; position: absolute; border-radius: 50%; background: white;\n        width: 16px; height: 16px; top: -2px; left: -2px; transition: 0.4s;\n    }\n    input:checked[type=\"checkbox\"]::before { left: 12px; }\n    .customText { padding: 5px; border-radius: 5px; border: 1px solid #555; background: #333; color: #fff; }\n    .styledSelect { background: #333; color: #fff; border: 1px solid #555; border-radius: 5px; padding: 5px; }\n    .menuB {\n        background: linear-gradient(145deg, #4b7bec, #2e86de);\n        color: #fff;\n        border: none;\n        padding: 5px 10px;\n        border-radius: 6px;\n        cursor: pointer;\n        margin-right: 5px;\n        font-size: 12px;\n        font-weight: normal;\n        text-transform: none;\n        transition: all 0.2s ease;\n        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);\n    }\n    .menuB:hover {\n        background: linear-gradient(145deg, #2e86de, #4b7bec);\n        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);\n    }\n    .menuB:active {\n        background: linear-gradient(145deg, #1f4f8b, #2a5d9f);\n        box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.3);\n    }\n";
    document.head.appendChild(ba);

    function bb(bc) {
        document.querySelectorAll(".tab").forEach(bf => bf.classList.remove("active"));
        document.querySelectorAll(".content").forEach(bg => bg.classList.remove("active"));
        document.getElementById(bc + "Tab").classList.add("active");
        document.getElementById(bc + "Content").classList.add("active");
    }
    document.getElementById("visualTab").addEventListener("click", () => bb("visual"));
    document.getElementById("combatTab").addEventListener("click", () => bb("combat"));
    document.getElementById("miscTab").addEventListener("click", () => bb("misc"));
    document.getElementById("devTab").addEventListener("click", () => bb("dev"));

    function bh() {
        let bj = ay.style.opacity === "1";
        ay.style.opacity = bj ? "0" : "1";
        ay.style.visibility = bj ? "hidden" : "visible";
        ay.style.transform = bj ? "translateX(-220px)" : "translateX(0)";
        az.style.opacity = bj ? "0" : "1";
        az.style.visibility = bj ? "hidden" : "visible";
        az.style.transform = bj ? "translateX(220px)" : "translateX(0)";
    }
    document.addEventListener("keydown", bk => {
        if (bk.key === "Escape") {
            bh();
        }
    });
    document.getElementById("menuColor").addEventListener("input", bm => {
        const bo = bm.target.value;
        ay.style.backgroundColor = bo;
        az.style.backgroundColor = bo;
    });
    document.getElementById("tabColor").addEventListener("input", bp => {
        const bs = bp.target.value;
        document.querySelectorAll(".tab, .menuB").forEach(bt => {
            bt.style.backgroundColor = bs;
        });
    });
})();
const cursorStyles = [{
    name: "Crosshair",
    cursor: "crosshair"
}];
document.body.style.cursor = cursorStyles[0].cursor;
let testMode = window.location.hostname == "127.0.0.1";
let css = document.createElement("style");
css.type = "text/css";
css.appendChild(document.createTextNode("\n\n.actionBarItem {\n    width: 66px;\n    height: 66px;\n    margin-right: 6px;\n    background-color: #00000050;\n    -webkit-border-radius: 0px;\n    -moz-border-radius: 0px;\n    border-radius: 5px;\n    display: inline-block;\n    cursor: pointer;\n    pointer-events: all;\n    background-size: cover;\n    backdrop-filter: blur(1px);\n    box-shadow: 0px 0px 6px #00000050;\n}\n#ageBarContainer {\n    width: 100%;\n    bottom: 120px;\n    text-align: center;\n}\n#ageBar {\n    background-color: #00000050;\n    -webkit-border-radius: 8px;\n    -moz-border-radius: 8px;\n    border-radius: 8px;\n    padding: 5px;\n    width: 314px;\n    height: 10px;\n    display: inline-block;\n    margin-bottom: 8px;\n    backdrop-filter: blur(1px);\n    box-shadow: 0px 0px 6px #00000050;\n}\n\n.gameButton, #leaderboard, .resourceDisplay,\n#mapDisplay, #allianceHolder, #allianceInput,\n.allianceButtonM, #storeHolder, .storeTab, #chatBox {\n    color: #FFF;\n    text-shadow:\n        0 0 5px rgba(173, 216, 230, 0.8),\n        0 0 10px rgba(173, 216, 230, 0.6),\n        0 0 20px rgba(173, 216, 230, 0.4),\n        0 0 30px rgba(173, 216, 230, 0.3);\n    transition: text-shadow 0.3s ease-in-out;\n}\n\n.gameButton:hover, #leaderboard:hover,\n.resourceDisplay:hover, #mapDisplay:hover,\n#allianceHolder:hover, #allianceInput:hover,\n.allianceButtonM:hover, #storeHolder:hover,\n.storeTab:hover, #chatBox:hover {\n    text-shadow:\n        0 0 10px rgba(173, 216, 230, 0.8),\n        0 0 20px rgba(173, 216, 230, 0.6),\n        0 0 30px rgba(173, 216, 230, 0.5),\n        0 0 40px rgba(173, 216, 230, 0.4);\n}\n\n\n"));
document.head.appendChild(css);
document.addEventListener("keydown", function(bv) {
    if (bv.key === "Tab") {
        bv.preventDefault();
    }
    if (bv.key === "F5") {
        bv.preventDefault();
    }
});

function onBoxMouseOver() {
    this.style.transform = "scale(1.05)";
    this.style.transition = "all 0.7s ease-in-out";
}

function onBoxMouseLeave() {
    this.style.transition = "all 0.7s ease-in-out";
    this.style.transform = "scale(1)";
}

function onEnterGameMouseOver() {
    const cb = document.getElementById("enterGame");
    cb.style.backgroundColor = "rgba(255, 255, 0, 0.2)";
    cb.style.borderRadius = "20px";
    cb.style.transition = "all 0.7s ease-in-out";
}

function onEnterGameMouseLeave() {
    const cd = document.getElementById("enterGame");
    cd.style.backgroundColor = "rgba(153, 50, 204, 0.3)";
    cd.style.borderRadius = "15px";
    cd.style.transition = "all 0.7s ease-in-out";
}
const boxes = document.querySelectorAll(".menuCard");
boxes.forEach(ce => {
    ce.style.transition = "transform 1s ease";
    ce.addEventListener("mouseenter", onBoxMouseOver);
    ce.addEventListener("mouseleave", onBoxMouseLeave);
});
const enterGameBox = document.getElementById("enterGame");
enterGameBox.addEventListener("mouseenter", onEnterGameMouseOver);
enterGameBox.addEventListener("mouseleave", onEnterGameMouseLeave);
const guideCardDiv = document.getElementById("guideCard");
if (guideCardDiv) {
    guideCardDiv.style.position = "absolute";
    guideCardDiv.style.width = "300px";
    guideCardDiv.style.height = "200px";
    guideCardDiv.style.top = "100%";
    guideCardDiv.style.left = "41%";
    guideCardDiv.style.zIndex = "9999";
}
let Leuchtturm = false;

function getEl(ci) {
    return document.getElementById(ci);
}
var EasyStar = function(ck) {
    var cm = {};

    function cn(cp) {
        if (cm[cp]) {
            return cm[cp].exports;
        }
        var cr = cm[cp] = {
            i: cp,
            l: false,
            exports: {}
        };
        ck[cp].call(cr.exports, cr, cr.exports, cn);
        cr.l = true;
        return cr.exports;
    }
    cn.m = ck;
    cn.c = cm;
    cn.d = function(cs, ct, cu) {
        if (!cn.o(cs, ct)) {
            Object.defineProperty(cs, ct, {
                enumerable: true,
                get: cu
            });
        }
    };
    cn.r = function(cv) {
        if (typeof Symbol != "undefined" && Symbol.toStringTag) {
            Object.defineProperty(cv, Symbol.toStringTag, {
                value: "Module"
            });
        }
        Object.defineProperty(cv, "__esModule", {
            value: true
        });
    };
    cn.t = function(cx, cy) {
        if (cy & 1) {
            cx = cn(cx);
        }
        if (cy & 8) {
            return cx;
        }
        if (cy & 4 && typeof cx == "object" && cx && cx.__esModule) {
            return cx;
        }
        var dd = Object.create(null);
        cn.r(dd);
        Object.defineProperty(dd, "default", {
            enumerable: true,
            value: cx
        });
        if (cy & 2 && typeof cx != "string") {
            for (var de in cx) {
                cn.d(dd, de, function(df) {
                    return cx[df];
                }.bind(null, de));
            }
        }
        return dd;
    };
    cn.n = function(dg) {
        var di = dg && dg.__esModule ? function() {
            return dg.default;
        } : function() {
            return dg;
        };
        cn.d(di, "f", di);
        return di;
    };
    cn.o = function(dk, dl) {
        return Object.prototype.hasOwnProperty.call(dk, dl);
    };
    cn.p = "/bin/";
    return cn(cn.s = 0);
}([function(dp, dq, ds) {
    var dv = {};
    var dw = ds(1);
    var dx = ds(2);
    var dy = ds(3);
    dp.exports = dv;
    var dz = 1;
    dv.js = function() {
        var eb;
        var ec;
        var ed;
        var ee = 1.4;
        var ef = false;
        var eg = {};
        var eh = {};
        var ei = {};
        var ej = {};
        var ek = true;
        var el = {};
        var em = [];
        var en = Number.MAX_VALUE;
        var eo = false;
        this.setAcceptableTiles = function(ep) {
            if (ep instanceof Array) {
                ed = ep;
            } else if (!isNaN(parseFloat(ep)) && isFinite(ep)) {
                ed = [ep];
            }
        };
        this.enableSync = function() {
            ef = true;
        };
        this.disableSync = function() {
            ef = false;
        };
        this.enableDiagonals = function() {
            eo = true;
        };
        this.disableDiagonals = function() {
            eo = false;
        };
        this.setGrid = function(eq) {
            eb = eq;
            for (var es = 0; es < eb.length; es++) {
                for (var et = 0; et < eb[0].length; et++) {
                    eh[eb[es][et]] ||= 1;
                }
            }
        };
        this.setTileCost = function(eu, ev) {
            eh[eu] = ev;
        };
        this.setAdditionalPointCost = function(ew, ex, ey) {
            if (ei[ex] === undefined) {
                ei[ex] = {};
            }
            ei[ex][ew] = ey;
        };
        this.removeAdditionalPointCost = function(fa, fb) {
            if (ei[fb] !== undefined) {
                delete ei[fb][fa];
            }
        };
        this.removeAllAdditionalPointCosts = function() {
            ei = {};
        };
        this.setDirectionalCondition = function(fc, fd, fe) {
            if (ej[fd] === undefined) {
                ej[fd] = {};
            }
            ej[fd][fc] = fe;
        };
        this.removeAllDirectionalConditions = function() {
            ej = {};
        };
        this.setIterationsPerCalculation = function(ff) {
            en = ff;
        };
        this.avoidAdditionalPoint = function(fg, fh) {
            if (eg[fh] === undefined) {
                eg[fh] = {};
            }
            eg[fh][fg] = 1;
        };
        this.stopAvoidingAdditionalPoint = function(fi, fj) {
            if (eg[fj] !== undefined) {
                delete eg[fj][fi];
            }
        };
        this.enableCornerCutting = function() {
            ek = true;
        };
        this.disableCornerCutting = function() {
            ek = false;
        };
        this.stopAvoidingAllAdditionalPoints = function() {
            eg = {};
        };
        this.findPath = function(fk, fl, fm, fn, fo) {
            function fq(fr) {
                if (ef) {
                    fo(fr);
                } else {
                    setTimeout(function() {
                        fo(fr);
                    });
                }
            }
            if (ed === undefined) {
                throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
            }
            if (eb === undefined) {
                throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
            }
            if (fk < 0 || fl < 0 || fm < 0 || fn < 0 || fk > eb[0].length - 1 || fl > eb.length - 1 || fm > eb[0].length - 1 || fn > eb.length - 1) {
                throw new Error("Your start or end point is outside the scope of your grid.");
            }
            if (fk !== fm || fl !== fn) {
                var fs = eb[fn][fm];
                var ft = false;
                for (var fu = 0; fu < ed.length; fu++) {
                    if (fs === ed[fu]) {
                        ft = true;
                        break;
                    }
                }
                if (ft !== false) {
                    var fw = new dw();
                    fw.openList = new dy(function(fx, fy) {
                        return fx.bestGuessDistance() - fy.bestGuessDistance();
                    });
                    fw.isDoneCalculating = false;
                    fw.nodeHash = {};
                    fw.startX = fk;
                    fw.startY = fl;
                    fw.endX = fm;
                    fw.endY = fn;
                    fw.callback = fq;
                    fw.openList.push(ga(fw, fw.startX, fw.startY, null, 1));
                    fn = dz++;
                    el[fn] = fw;
                    em.push(fn);
                    return fn;
                }
                fq(null);
            } else {
                fq([]);
            }
        };
        this.cancelPath = function(gb) {
            return gb in el && (delete el[gb], true);
        };
        this.calculate = function() {
            if (em.length !== 0 && eb !== undefined && ed !== undefined) {
                for (ec = 0; ec < en; ec++) {
                    if (em.length === 0) {
                        return;
                    }
                    if (ef) {
                        ec = 0;
                    }
                    var ge = em[0];
                    var gf = el[ge];
                    if (gf !== undefined) {
                        if (gf.openList.size() !== 0) {
                            var gg = gf.openList.pop();
                            if (gf.endX !== gg.x || gf.endY !== gg.y) {
                                if ((gg.list = 0) < gg.y) {
                                    gh(gf, gg, 0, -1, +(ei[gg.y - 1] && ei[gg.y - 1][gg.x] || eh[eb[gg.y - 1][gg.x]]));
                                }
                                if (gg.x < eb[0].length - 1) {
                                    gh(gf, gg, 1, 0, +(ei[gg.y] && ei[gg.y][gg.x + 1] || eh[eb[gg.y][gg.x + 1]]));
                                }
                                if (gg.y < eb.length - 1) {
                                    gh(gf, gg, 0, 1, +(ei[gg.y + 1] && ei[gg.y + 1][gg.x] || eh[eb[gg.y + 1][gg.x]]));
                                }
                                if (gg.x > 0) {
                                    gh(gf, gg, -1, 0, +(ei[gg.y] && ei[gg.y][gg.x - 1] || eh[eb[gg.y][gg.x - 1]]));
                                }
                                if (eo) {
                                    if (gg.x > 0 && gg.y > 0 && (ek || gi(eb, ed, gg.x, gg.y - 1, gg) && gi(eb, ed, gg.x - 1, gg.y, gg))) {
                                        gh(gf, gg, -1, -1, ee * (ei[gg.y - 1] && ei[gg.y - 1][gg.x - 1] || eh[eb[gg.y - 1][gg.x - 1]]));
                                    }
                                    if (gg.x < eb[0].length - 1 && gg.y < eb.length - 1 && (ek || gi(eb, ed, gg.x, gg.y + 1, gg) && gi(eb, ed, gg.x + 1, gg.y, gg))) {
                                        gh(gf, gg, 1, 1, ee * (ei[gg.y + 1] && ei[gg.y + 1][gg.x + 1] || eh[eb[gg.y + 1][gg.x + 1]]));
                                    }
                                    if (gg.x < eb[0].length - 1 && gg.y > 0 && (ek || gi(eb, ed, gg.x, gg.y - 1, gg) && gi(eb, ed, gg.x + 1, gg.y, gg))) {
                                        gh(gf, gg, 1, -1, ee * (ei[gg.y - 1] && ei[gg.y - 1][gg.x + 1] || eh[eb[gg.y - 1][gg.x + 1]]));
                                    }
                                    if (gg.x > 0 && gg.y < eb.length - 1 && (ek || gi(eb, ed, gg.x, gg.y + 1, gg) && gi(eb, ed, gg.x - 1, gg.y, gg))) {
                                        gh(gf, gg, -1, 1, ee * (ei[gg.y + 1] && ei[gg.y + 1][gg.x - 1] || eh[eb[gg.y + 1][gg.x - 1]]));
                                    }
                                }
                            } else {
                                var gj = [];
                                gj.push({
                                    x: gg.x,
                                    y: gg.y
                                });
                                for (var gk = gg.parent; gk != null;) {
                                    gj.push({
                                        x: gk.x,
                                        y: gk.y
                                    });
                                    gk = gk.parent;
                                }
                                gj.reverse();
                                gf.callback(gj);
                                delete el[ge];
                                em.shift();
                            }
                        } else {
                            gf.callback(null);
                            delete el[ge];
                            em.shift();
                        }
                    } else {
                        em.shift();
                    }
                }
            }
        };

        function gh(gl, gm, gn, gp, gq) {
            gn = gm.x + gn;
            gp = gm.y + gp;
            if ((eg[gp] === undefined || eg[gp][gn] === undefined) && !!gi(eb, ed, gn, gp, gm)) {
                if ((gp = ga(gl, gn, gp, gm, gq)).list === undefined) {
                    gp.list = 1;
                    gl.openList.push(gp);
                } else if (gm.costSoFar + gq < gp.costSoFar) {
                    gp.costSoFar = gm.costSoFar + gq;
                    gp.parent = gm;
                    gl.openList.updateItem(gp);
                }
            }
        }

        function gi(gs, gt, gu, gv, gw) {
            var gy = ej[gv] && ej[gv][gu];
            if (gy) {
                var gz = ha(gw.x - gu, gw.y - gv);
                if (! function() {
                    for (var hc = 0; hc < gy.length; hc++) {
                        if (gy[hc] === gz) {
                            return true;
                        }
                    }
                    return false;
                }()) {
                    return false;
                }
            }
            for (var hd = 0; hd < gt.length; hd++) {
                if (gs[gv][gu] === gt[hd]) {
                    return true;
                }
            }
            return false;
        }

        function ha(he, hf) {
            if (he === 0 && hf === -1) {
                return dv.TOP;
            }
            if (he === 1 && hf === -1) {
                return dv.TOP_RIGHT;
            }
            if (he === 1 && hf === 0) {
                return dv.RIGHT;
            }
            if (he === 1 && hf === 1) {
                return dv.BOTTOM_RIGHT;
            }
            if (he === 0 && hf === 1) {
                return dv.BOTTOM;
            }
            if (he === -1 && hf === 1) {
                return dv.BOTTOM_LEFT;
            }
            if (he === -1 && hf === 0) {
                return dv.LEFT;
            }
            if (he === -1 && hf === -1) {
                return dv.TOP_LEFT;
            }
            throw new Error("These differences are not valid: " + he + ", " + hf);
        }

        function ga(hh, hi, hj, hk, hl) {
            if (hh.nodeHash[hj] !== undefined) {
                if (hh.nodeHash[hj][hi] !== undefined) {
                    return hh.nodeHash[hj][hi];
                }
            } else {
                hh.nodeHash[hj] = {};
            }
            var hn = ho(hi, hj, hh.endX, hh.endY);
            var hl = hk !== null ? hk.costSoFar + hl : 0;
            var hn = new dx(hk, hi, hj, hl, hn);
            return hh.nodeHash[hj][hi] = hn;
        }

        function ho(hp, hq, hr, hs) {
            var hu;
            var hv;
            if (eo) {
                if ((hu = Math.abs(hp - hr)) < (hv = Math.abs(hq - hs))) {
                    return ee * hu + hv;
                } else {
                    return ee * hv + hu;
                }
            } else {
                return (hu = Math.abs(hp - hr)) + (hv = Math.abs(hq - hs));
            }
        }
    };
    dv.TOP = "TOP";
    dv.TOP_RIGHT = "TOP_RIGHT";
    dv.RIGHT = "RIGHT";
    dv.BOTTOM_RIGHT = "BOTTOM_RIGHT";
    dv.BOTTOM = "BOTTOM";
    dv.BOTTOM_LEFT = "BOTTOM_LEFT";
    dv.LEFT = "LEFT";
    dv.TOP_LEFT = "TOP_LEFT";
}, function(hw, hx) {
    hw.exports = function() {
        this.pointsToAvoid = {};
        this.startX;
        this.callback;
        this.startY;
        this.endX;
        this.endY;
        this.nodeHash = {};
        this.openList;
    };
}, function(hz, ia) {
    hz.exports = function(ic, ie, ig, ih, ii) {
        this.parent = ic;
        this.x = ie;
        this.y = ig;
        this.costSoFar = ih;
        this.simpleDistanceToTarget = ii;
        this.bestGuessDistance = function() {
            return this.costSoFar + this.simpleDistanceToTarget;
        };
    };
}, function(il, im, ip) {
    il.exports = ip(4);
}, function(ir, iu, iv) {
    var ix;
    var iy;
    (function() {
        var ja;
        var jb;
        var jc;
        var jd;
        var je;
        var jf;
        var jg;
        var jh;
        var ji;
        var jj;
        var jk;
        var jl;
        var jm;
        var jn;
        var jo;

        function jp(jq) {
            this.cmp = jq ?? jb;
            this.nodes = [];
        }
        jc = Math.floor;
        jj = Math.min;
        jb = function(jt, ju) {
            if (jt < ju) {
                return -1;
            } else if (ju < jt) {
                return 1;
            } else {
                return 0;
            }
        };
        ji = function(jv, jw, jx, jy, jz) {
            var kb;
            if (jx == null) {
                jx = 0;
            }
            if (jz == null) {
                jz = jb;
            }
            if (jx < 0) {
                throw new Error("lo must be non-negative");
            }
            for (jy == null && (jy = jv.length); jx < jy;) {
                if (jz(jw, jv[kb = jc((jx + jy) / 2)]) < 0) {
                    jy = kb;
                } else {
                    jx = kb + 1;
                }
            }
            [].splice.apply(jv, [jx, jx - jx].concat(jw));
            return jw;
        };
        jf = function(kc, kd, ke) {
            if (ke == null) {
                ke = jb;
            }
            kc.push(kd);
            return jn(kc, 0, kc.length - 1, ke);
        };
        je = function(kg, ki) {
            var kk;
            var kl;
            if (ki == null) {
                ki = jb;
            }
            kk = kg.pop();
            if (kg.length) {
                kl = kg[0];
                kg[0] = kk;
                jo(kg, 0, ki);
            } else {
                kl = kk;
            }
            return kl;
        };
        jh = function(kn, ko, kp) {
            var kq;
            if (kp == null) {
                kp = jb;
            }
            kq = kn[0];
            kn[0] = ko;
            jo(kn, 0, kp);
            return kq;
        };
        jg = function(kr, ks, kt) {
            var kv;
            if (kt == null) {
                kt = jb;
            }
            if (kr.length && kt(kr[0], ks) < 0) {
                ks = (kv = [kr[0], ks])[0];
                kr[0] = kv[1];
                jo(kr, 0, kt);
            }
            return ks;
        };
        jd = function(kw, kx) {
            var kz;
            var la;
            var lb;
            var lc;
            var ld;
            var le;
            if (kx == null) {
                kx = jb;
            }
            ld = [];
            la = 0;
            lb = (lc = function() {
                le = [];
                for (var lg = 0, lh = jc(kw.length / 2); lh >= 0 ? lg < lh : lh < lg; lh >= 0 ? lg++ : lg--) {
                    le.push(lg);
                }
                return le;
            }.apply(this).reverse()).length;
            for (; la < lb; la++) {
                kz = lc[la];
                ld.push(jo(kw, kz, kx));
            }
            return ld;
        };
        jm = function(li, lj, lk) {
            if (lk == null) {
                lk = jb;
            }
            if ((lj = li.indexOf(lj)) !== -1) {
                jn(li, 0, lj, lk);
                return jo(li, lj, lk);
            }
        };
        jk = function(lm, ln, lp) {
            var lr;
            var ls;
            var lt;
            var lu;
            var lv;
            if (lp == null) {
                lp = jb;
            }
            if (!(ls = lm.slice(0, ln)).length) {
                return ls;
            }
            jd(ls, lp);
            lt = 0;
            lu = (lv = lm.slice(ln)).length;
            for (; lt < lu; lt++) {
                lr = lv[lt];
                jg(ls, lr, lp);
            }
            return ls.sort(lp).reverse();
        };
        jl = function(lw, lx, ly) {
            var ma;
            var mb;
            var md;
            var mf;
            var mg;
            var mh;
            var mi;
            var mj;
            var mk;
            if (ly == null) {
                ly = jb;
            }
            if (lx * 10 <= lw.length) {
                if (!(md = lw.slice(0, lx).sort(ly)).length) {
                    return md;
                }
                mb = md[md.length - 1];
                mf = 0;
                mh = (mi = lw.slice(lx)).length;
                for (; mf < mh; mf++) {
                    if (ly(ma = mi[mf], mb) < 0) {
                        ji(md, ma, 0, null, ly);
                        md.pop();
                        mb = md[md.length - 1];
                    }
                }
                return md;
            }
            jd(lw, ly);
            mk = [];
            mg = 0;
            mj = jj(lx, lw.length);
            for (; mj >= 0 ? mg < mj : mj < mg; mj >= 0 ? ++mg : --mg) {
                mk.push(je(lw, ly));
            }
            return mk;
        };
        jn = function(ml, mm, mn, mo) {
            var mp;
            var mq;
            var mr;
            if (mo == null) {
                mo = jb;
            }
            mp = ml[mn];
            while (mm < mn && mo(mp, mq = ml[mr = mn - 1 >> 1]) < 0) {
                ml[mn] = mq;
                mn = mr;
            }
            return ml[mn] = mp;
        };
        jo = function(mt, mu, mv) {
            var mx;
            var mz;
            var na;
            var nb;
            var nc;
            if (mv == null) {
                mv = jb;
            }
            mz = mt.length;
            na = mt[nc = mu];
            mx = mu * 2 + 1;
            while (mx < mz) {
                if ((nb = mx + 1) < mz && !(mv(mt[mx], mt[nb]) < 0)) {
                    mx = nb;
                }
                mt[mu] = mt[mx];
                mx = (mu = mx) * 2 + 1;
            }
            mt[mu] = na;
            return jn(mt, nc, mu, mv);
        };
        jp.push = jf;
        jp.pop = je;
        jp.replace = jh;
        jp.pushpop = jg;
        jp.heapify = jd;
        jp.updateItem = jm;
        jp.nlargest = jk;
        jp.nsmallest = jl;
        jp.prototype.push = function(nd) {
            return jf(this.nodes, nd, this.cmp);
        };
        jp.prototype.pop = function() {
            return je(this.nodes, this.cmp);
        };
        jp.prototype.peek = function() {
            return this.nodes[0];
        };
        jp.prototype.contains = function(nf) {
            return this.nodes.indexOf(nf) !== -1;
        };
        jp.prototype.replace = function(nh) {
            return jh(this.nodes, nh, this.cmp);
        };
        jp.prototype.pushpop = function(nj) {
            return jg(this.nodes, nj, this.cmp);
        };
        jp.prototype.heapify = function() {
            return jd(this.nodes, this.cmp);
        };
        jp.prototype.updateItem = function(nl) {
            return jm(this.nodes, nl, this.cmp);
        };
        jp.prototype.clear = function() {
            return this.nodes = [];
        };
        jp.prototype.empty = function() {
            return this.nodes.length === 0;
        };
        jp.prototype.size = function() {
            return this.nodes.length;
        };
        jp.prototype.clone = function() {
            var ns = new jp();
            ns.nodes = this.nodes.slice(0);
            return ns;
        };
        jp.prototype.toArray = function() {
            return this.nodes.slice(0);
        };
        jp.prototype.insert = jp.prototype.push;
        jp.prototype.top = jp.prototype.peek;
        jp.prototype.front = jp.prototype.peek;
        jp.prototype.has = jp.prototype.contains;
        jp.prototype.copy = jp.prototype.clone;
        ja = jp;
        ix = [];
        if ((iy = typeof(iy = function() {
            return ja;
        }) == "function" ? iy.apply(iu, ix) : iy) !== undefined) {
            ir.exports = iy;
        }
    }).call(this);
}]);
let easystar = new EasyStar.js();
document.getElementById("gameName").innerHTML = "";
$("#gameName").css({
    display: "none"
});
let coolFont = document.createElement("link");
coolFont.rel = "stylesheet";
coolFont.href = "https://fonts.googleapis.com/css2?family=Lilita+One&display=swap";
coolFont.type = "text/css";
document.body.append(coolFont);
let min = document.createElement("script");
min.src = "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js";
document.body.append(min);
window.oncontextmenu = function() {
    return false;
};
let config = window.config;
config.clientSendRate = 9;
config.serverUpdateRate = 9;
config.deathFadeout = 0;
config.playerCapacity = 50;
config.isSandbox = window.location.hostname == "sandbox.moomoo.io";
config.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "#91b2db"];
config.weaponVariants = [{
    id: 0,
    src: "",
    xp: 0,
    val: 1
}, {
    id: 1,
    src: "_g",
    xp: 3000,
    val: 1.1
}, {
    id: 2,
    src: "_d",
    xp: 7000,
    val: 1.18
}, {
    id: 3,
    src: "_r",
    poison: true,
    xp: 12000,
    val: 1.18
}, {
    id: 4,
    src: "_e",
    poison: true,
    heal: true,
    xp: 24000,
    val: 1.18
}];
config.anotherVisual = true;
config.useWebGl = false;
config.resetRender = true;

function waitTime(nu) {
    return new Promise(nv => {
        setTimeout(() => {
            nv();
        }, nu);
    });
}
let botSkts = [];
let canStore;
if (typeof Storage !== "undefined") {
    canStore = true;
}

function saveVal(nw, nx) {
    if (canStore) {
        localStorage.setItem(nw, nx);
    }
}

function deleteVal(nz) {
    if (canStore) {
        localStorage.removeItem(nz);
    }
}

function getSavedVal(ob) {
    if (canStore) {
        return localStorage.getItem(ob);
    }
    return null;
}
let gC = function(oc, od) {
    try {
        let og = JSON.parse(getSavedVal(oc));
        if (typeof og === "object") {
            return od;
        } else {
            return og;
        }
    } catch (oh) {
        return od;
    }
};

function setCommands() {}

function setConfigs() {
    return {};
}
let commands = setCommands();
let configs = setConfigs();
window.removeConfigs = function() {
    for (let oi in configs) {
        deleteVal(oi, configs[oi]);
    }
};
for (let cF in configs) {
    configs[cF] = gC(cF, configs[cF]);
}
window.changeMenu = function() {};
window.debug = function() {};
window.wasdMode = function() {};
window.startGrind = function() {};
window.connectFillBots = function() {};
window.destroyFillBots = function() {};
window.tryConnectBots = function() {};
window.destroyBots = function() {};
window.resBuild = function() {};
window.toggleBotsCircle = function() {};
window.toggleVisual = function() {};
window.prepareUI = function() {};
window.leave = function() {};
window.ping = 0;
class HtmlAction {
    constructor(oj) {
        this.element = oj;
    }
    add(ol) {
        if (!this.element) {
            return undefined;
        }
        this.element.innerHTML += ol;
    }
    newLine(oo) {
        let oq = "<br>";
        if (oo > 0) {
            oq = "";
            for (let os = 0; os < oo; os++) {
                oq += "<br>";
            }
        }
        this.add(oq);
    }
    checkBox(ot) {
        let ov = "<input type = \"checkbox\"";
        if (ot.id) {
            ov += " id = " + ot.id;
        }
        if (ot.style) {
            ov += " style = " + ot.style.replaceAll(" ", "");
        }
        if (ot.class) {
            ov += " class = " + ot.class;
        }
        if (ot.checked) {
            ov += " checked";
        }
        if (ot.onclick) {
            ov += " onclick = " + ot.onclick;
        }
        ov += ">";
        this.add(ov);
    }
    text(ow) {
        let oy = "<input type = \"text\"";
        if (ow.id) {
            oy += " id = " + ow.id;
        }
        if (ow.style) {
            oy += " style = " + ow.style.replaceAll(" ", "");
        }
        if (ow.class) {
            oy += " class = " + ow.class;
        }
        if (ow.size) {
            oy += " size = " + ow.size;
        }
        if (ow.maxLength) {
            oy += " maxLength = " + ow.maxLength;
        }
        if (ow.value) {
            oy += " value = " + ow.value;
        }
        if (ow.placeHolder) {
            oy += " placeHolder = " + ow.placeHolder.replaceAll(" ", "&nbsp;");
        }
        oy += ">";
        this.add(oy);
    }
    select(oz) {
        let pc = "<select";
        if (oz.id) {
            pc += " id = " + oz.id;
        }
        if (oz.style) {
            pc += " style = " + oz.style.replaceAll(" ", "");
        }
        if (oz.class) {
            pc += " class = " + oz.class;
        }
        pc += ">";
        for (let pd in oz.option) {
            pc += "<option value = " + oz.option[pd].id;
            if (oz.option[pd].selected) {
                pc += " selected";
            }
            pc += ">" + pd + "</option>";
        }
        pc += "</select>";
        this.add(pc);
    }
    button(pe) {
        let pg = "<button";
        if (pe.id) {
            pg += " id = " + pe.id;
        }
        if (pe.style) {
            pg += " style = " + pe.style.replaceAll(" ", "");
        }
        if (pe.class) {
            pg += " class = " + pe.class;
        }
        if (pe.onclick) {
            pg += " onclick = " + pe.onclick;
        }
        pg += ">";
        if (pe.innerHTML) {
            pg += pe.innerHTML;
        }
        pg += "</button>";
        this.add(pg);
    }
    selectMenu(pj) {
        let pl = "<select";
        if (!pj.id) {
            alert("please put id skid");
            return;
        }
        window[pj.id + "Func"] = function() {};
        if (pj.id) {
            pl += " id = " + pj.id;
        }
        if (pj.style) {
            pl += " style = " + pj.style.replaceAll(" ", "");
        }
        if (pj.class) {
            pl += " class = " + pj.class;
        }
        pl += " onchange = window." + (pj.id + "Func") + "()";
        pl += ">";
        let pm;
        let pn = 0;
        for (let po in pj.menu) {
            pl += "<option value = " + ("option_" + po) + " id = " + ("O_" + po);
            if (pj.menu[po]) {
                pl += " checked";
            }
            pl += " style = \"color: " + (pj.menu[po] ? "#000" : "") + "; background: " + (pj.menu[po] ? "" : "") + ";\">" + po + "</option>";
            pn++;
        }
        pl += "</select>";
        this.add(pl);
        pn = 0;
        for (let pp in pj.menu) {
            window[pp + "Func"] = function() {
                pj.menu[pp] = getEl("check_" + pp).checked ? true : false;
                saveVal(pp, pj.menu[pp]);
                getEl("O_" + pp).style.color = pj.menu[pp] ? "#000" : "#fff";
                getEl("O_" + pp).style.background = pj.menu[pp] ? "#8ecc51" : "#cc5151";
            };
            this.checkBox({
                id: "check_" + pp,
                style: "display: " + (pn == 0 ? "inline-block" : "none") + ";",
                class: "checkB",
                onclick: "window." + (pp + "Func") + "()",
                checked: pj.menu[pp]
            });
            pn++;
        }
        pm = "check_" + getEl(pj.id).value.split("_")[1];
        window[pj.id + "Func"] = function() {
            getEl(pm).style.display = "none";
            pm = "check_" + getEl(pj.id).value.split("_")[1];
            getEl(pm).style.display = "inline-block";
        };
    }
};
class Html {
    constructor() {
        this.element = null;
        this.action = null;
        this.divElement = null;
        this.startDiv = function(pt, pu) {
            let pw = document.createElement("div");
            if (pt.id) {
                pw.id = pt.id;
            }
            if (pt.style) {
                pw.style = pt.style;
            }
            if (pt.class) {
                pw.className = pt.class;
            }
            this.element.appendChild(pw);
            this.divElement = pw;
            let py = new HtmlAction(pw);
            if (typeof pu == "function") {
                pu(py);
            }
        };
        this.addDiv = function(pz, qa) {
            let qc = document.createElement("div");
            if (pz.id) {
                qc.id = pz.id;
            }
            if (pz.style) {
                qc.style = pz.style;
            }
            if (pz.class) {
                qc.className = pz.class;
            }
            if (pz.appendID) {
                getEl(pz.appendID).appendChild(qc);
            }
            this.divElement = qc;
            let qd = new HtmlAction(qc);
            if (typeof qa == "function") {
                qa(qd);
            }
        };
    }
    set(qe) {
        this.element = getEl(qe);
        this.action = new HtmlAction(this.element);
    }
    resetHTML(qg) {
        if (qg) {
            this.element.innerHTML = "";
        } else {
            this.element.innerHTML = "";
        }
    }
    setStyle(qi) {
        this.element.style = qi;
    }
    setCSS(qk) {
        this.action.add("<style>" + qk + "</style>");
    }
};
let HTML = new Html();
let menuChatDiv = document.createElement("div");
menuChatDiv.id = "menuChatDiv";
document.body.appendChild(menuChatDiv);
HTML.set("menuChatDiv");
HTML.setStyle("");
HTML.resetHTML();
HTML.setCSS(" ");
HTML.startDiv({
    id: "mChDiv",
    class: "chDiv"
}, qn => {
    HTML.addDiv({
        id: "mChMain",
        class: "chMainDiv",
        appendID: "mChDiv"
    }, qp => {});
    qn.text({
        id: "mChBox",
        class: "chMainBox"
    });
});
let menuChats = getEl("mChMain");
let menuChatBox = getEl("mChBox");
let menuCBFocus = false;
let menuChCounts = 0;
menuChatBox.value = "";
menuChatBox.addEventListener("focus", () => {
    menuCBFocus = true;
});
menuChatBox.addEventListener("blur", () => {
    menuCBFocus = false;
});
let menuIndex = 0;
let menus = ["menuMain", "menuConfig", "menuOther"];
window.changeMenu = function() {
    getEl(menus[menuIndex % menus.length]).style.display = "none";
    menuIndex++;
    getEl(menus[menuIndex % menus.length]).style.display = "block";
};
let mStatus = document.createElement("div");
mStatus.id = "status";
getEl("gameUI").appendChild(mStatus);
HTML.set("status");
HTML.setStyle("\n            display: block;\n            position: absolute;\n            color: #ddd;\n            font: 15px Hammersmith One;\n            position: fixed;\n            top: 20px;\n            left: 50%;\n            transform: translateX(-50%);\n            ");
HTML.resetHTML();
HTML.setCSS("\n            .sizing {\n                font-size: 13px;\n            }\n            .mod {\n                font-size: 13px;\n                display: inline-block;\n            }\n            ");
HTML.startDiv({
    id: "uehmod",
    class: "sizing"
}, qr => {
    qr.add("Ping: ");
    HTML.addDiv({
        id: "pingFps",
        class: "mod",
        appendID: "uehmod"
    }, qt => {
        qt.add("None");
    });
});
let openMenu = false;
let WS = undefined;
let socketID = undefined;
let useWasd = false;
let secPacket = 0;
let secMax = 120;
let secTime = 1000;
let firstSend = {
    sec: false
};
let game = {
    tick: 0,
    tickQueue: [],
    tickBase: function(qv, qw) {
        if (this.tickQueue[this.tick + qw]) {
            this.tickQueue[this.tick + qw].push(qv);
        } else {
            this.tickQueue[this.tick + qw] = [qv];
        }
    },
    tickRate: 950 / config.serverUpdateRate,
    tickSpeed: 0,
    lastTick: performance.now()
};
let modConsole = [];
let dontSend = false;
let fpsTimer = {
    last: 0,
    time: 0,
    ltime: 0
};
let lastMoveDir = undefined;
let lastsp = ["unknown1l", 1, "__proto__"];
WebSocket.prototype.nsend = WebSocket.prototype.send;
WebSocket.prototype.send = function(qy) {
    if (!WS) {
        WS = this;
        WS.addEventListener("message", function(ra) {
            getMessage(ra);
        });
        WS.addEventListener("close", rb => {
            if (rb.code == 4001) {
                window.location.reload();
            }
        });
    }
    if (WS == this) {
        dontSend = false;
        let rd = new Uint8Array(qy);
        let rf = window.msgpack.decode(rd);
        let rg = rf[0];
        rd = rf[1];
        if (rg == "6") {
            if (rd[0]) {
                let rh = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
                let ri;
                rh.forEach(rj => {
                    if (rd[0].indexOf(rj) > -1) {
                        ri = "";
                        for (let rl = 0; rl < rj.length; ++rl) {
                            if (rl == 1) {
                                ri += String.fromCharCode(0);
                            }
                            ri += rj[rl];
                        }
                        let rm = new RegExp(rj, "g");
                        rd[0] = rd[0].replace(rm, ri);
                    }
                });
                rd[0] = rd[0].slice(0, 30);
            }
        } else if (rg == "L") {
            rd[0] = rd[0] + String.fromCharCode(0).repeat(7);
            rd[0] = rd[0].slice(0, 7);
        } else if (rg == "M") {
            rd[0].name = rd[0].name == "" ? "unknown" : rd[0].name;
            rd[0].moofoll = true;
            rd[0].skin = rd[0].skin == 10 ? "__proto__" : rd[0].skin;
            lastsp = [rd[0].name, rd[0].moofoll, rd[0].skin];
        } else if (rg == "D") {
            if (my.lastDir == rd[0] || [null, undefined].includes(rd[0])) {
                dontSend = true;
            } else {
                my.lastDir = rd[0];
            }
        } else if (rg == "d") {
            if (!rd[2]) {
                dontSend = true;
            } else if (![null, undefined].includes(rd[1])) {
                my.lastDir = rd[1];
            }
        } else if (rg == "K") {
            if (!rd[1]) {
                dontSend = true;
            }
        } else if (rg == "S") {
            instaC.wait = !instaC.wait;
            dontSend = true;
        } else if (rg == "f") {
            if (rd[1]) {
                if (player.moveDir == rd[0]) {
                    dontSend = true;
                }
                player.moveDir = rd[0];
            } else {
                dontSend = true;
            }
        }
        if (!dontSend) {
            let rn = window.msgpack.encode([rg, rd]);
            this.nsend(rn);
            if (!firstSend.sec) {
                firstSend.sec = true;
                setTimeout(() => {
                    firstSend.sec = false;
                    secPacket = 0;
                }, secTime);
            }
            secPacket++;
        }
    } else {
        this.nsend(qy);
    }
};

function packet(ro) {
    let rq = Array.prototype.slice.call(arguments, 1);
    let rr = window.msgpack.encode([ro, rq]);
    WS.send(rr);
}

function origPacket(rs) {
    let ru = Array.prototype.slice.call(arguments, 1);
    let rv = window.msgpack.encode([rs, ru]);
    WS.nsend(rv);
}
window.leave = function() {
    origPacket("kys", {
        "frvr is so bad": true,
        "sidney is too good": true,
        "dev are too weak": true
    });
};
let io = {
    send: packet
};

function getMessage(rx) {
    let rz = new Uint8Array(rx.data);
    let sa = window.msgpack.decode(rz);
    let sc = sa[0];
    rz = sa[1];
    let sd = {
        A: setInitData,
        C: setupGame,
        D: addPlayer,
        E: removePlayer,
        a: updatePlayers,
        G: updateLeaderboard,
        H: loadGameObject,
        I: loadAI,
        J: animateAI,
        K: gatherAnimation,
        L: wiggleGameObject,
        M: shootTurret,
        N: updatePlayerValue,
        O: updateHealth,
        P: killPlayer,
        Q: killObject,
        R: killObjects,
        S: updateItemCounts,
        T: updateAge,
        U: updateUpgrades,
        V: updateItems,
        X: addProjectile,
        2: allianceNotification,
        3: setPlayerTeam,
        4: setAlliancePlayers,
        5: updateStoreItems,
        6: receiveChat,
        7: updateMinimap,
        8: showText,
        9: pingMap,
        0: pingSocketResponse
    };
    if (sc == "io-init") {
        socketID = rz[0];
    } else if (sd[sc]) {
        sd[sc].apply(undefined, rz);
    }
}
Math.lerpAngle = function(se, sf, sg) {
    let sh = Math.abs(sf - se);
    if (sh > Math.PI) {
        if (se > sf) {
            sf += Math.PI * 2;
        } else {
            se += Math.PI * 2;
        }
    }
    let si = sf + (se - sf) * sg;
    if (si >= 0 && si <= Math.PI * 2) {
        return si;
    }
    return si % (Math.PI * 2);
};
CanvasRenderingContext2D.prototype.roundRect = function(sj, sk, sl, sm, sn) {
    if (sl < sn * 2) {
        sn = sl / 2;
    }
    if (sm < sn * 2) {
        sn = sm / 2;
    }
    if (sn < 0) {
        sn = 0;
    }
    this.beginPath();
    this.moveTo(sj + sn, sk);
    this.arcTo(sj + sl, sk, sj + sl, sk + sm, sn);
    this.arcTo(sj + sl, sk + sm, sj, sk + sm, sn);
    this.arcTo(sj, sk + sm, sj, sk, sn);
    this.arcTo(sj, sk, sj + sl, sk, sn);
    this.closePath();
    return this;
};

function resetMoveDir() {
    keys = {};
    io.send("e");
}
let allChats = [];
let ticks = {
    tick: 0,
    delay: 0,
    time: [],
    manage: []
};
let ais = [];
let players = [];
let alliances = [];
let alliancePlayers = [];
let allianceNotifications = [];
let gameObjects = [];
let liztobj = [];
let projectiles = [];
let deadPlayers = [];
let breakObjects = [];
let player;
let playerSID;
let tmpObj;
let enemy = [];
let nears = [];
let near = [];
let my = {
    reloaded: false,
    waitHit: 0,
    autoAim: false,
    revAim: false,
    ageInsta: true,
    reSync: false,
    bullTick: 0,
    anti0Tick: 0,
    antiSync: false,
    safePrimary: function(sq) {
        return [0, 8].includes(sq.primaryIndex);
    },
    safeSecondary: function(ss) {
        return [10, 11, 14].includes(ss.secondaryIndex);
    },
    lastDir: 0,
    autoPush: false,
    pushData: {}
};

function findID(st, su) {
    return st.find(sw => sw.id == su);
}
let adCard = getEl("adCard");
adCard.remove();
let promoImageHolder = getEl("promoImgHolder");
promoImageHolder.remove();
let chatButton = getEl("chatButton");
chatButton.remove();
let gameCanvas = getEl("gameCanvas");
let mainContext = gameCanvas.getContext("2d");
$("#mapDisplay").css("background", "url('https://wormax.org/chrome3kafa/moomooio-background.png')");
let mapContext = mapDisplay.getContext("2d");
mapDisplay.width = 300;
mapDisplay.height = 300;
let storeMenu = getEl("storeMenu");
let storeHolder = getEl("storeHolder");
let upgradeHolder = getEl("upgradeHolder");
let upgradeCounter = getEl("upgradeCounter");
let chatBox = getEl("chatBox");
let chatHolder = getEl("chatHolder");
let actionBar = getEl("actionBar");
let leaderboardData = getEl("leaderboardData");
let itemInfoHolder = getEl("itemInfoHolder");
let menuCardHolder = getEl("menuCardHolder");
let mainMenu = getEl("mainMenu");
let diedText = getEl("diedText");
let screenWidth;
let screenHeight;
let maxScreenWidth = config.maxScreenWidth;
let maxScreenHeight = config.maxScreenHeight;
let pixelDensity = 1;
let delta;
let now;
let lastUpdate = performance.now();
let camX;
let camY;
let tmpDir;
let mouseX = 0;
let mouseY = 0;
let allianceMenu = getEl("allianceMenu");
let waterMult = 1;
let waterPlus = 0;
let outlineColor = "#525252";
let darkOutlineColor = "#3d3f42";
let outlineWidth = 5.5;
let firstSetup = true;
let keys = {};
let moveKeys = {
    87: [0, -1],
    38: [0, -1],
    83: [0, 1],
    40: [0, 1],
    65: [-1, 0],
    37: [-1, 0],
    68: [1, 0],
    39: [1, 0]
};
let attackState = 0;
let inGame = false;
let macro = {};
let pads = {
    placeSpawnPads: 0
};
let lastDir;
let lastLeaderboardData = [];
let inWindow = true;
window.onblur = function() {
    inWindow = false;
};
window.onfocus = function() {
    inWindow = true;
    if (player && player.alive) {}
};
let ms = {
    avg: 0,
    max: 0,
    min: 0,
    delay: 0
};

function pingSocketResponse() {
    let sz = Math.ceil(window.pingTime * 2.6);
    let ta = window.pingTime;
    const tb = document.getElementById("pingDisplay");
    tb.innerText = "";
    if (ta > ms.max || isNaN(ms.max)) {
        ms.max = ta;
    }
    if (ta < ms.min || isNaN(ms.min)) {
        ms.min = ta;
    }
}
let placeVisible = [];
let preplaceVisible = [];
class Utils {
    constructor() {
        let td = Math.abs;
        let te = Math.cos;
        let tf = Math.sin;
        let tg = Math.pow;
        let th = Math.sqrt;
        let ti = Math.atan2;
        let tj = Math.PI;
        let tk = this;
        this.round = function(tl, tm) {
            return Math.round(tl * tm) / tm;
        };
        this.toRad = function(tp) {
            return tp * (tj / 180);
        };
        this.toAng = function(tq) {
            return tq / (tj / 180);
        };
        this.randInt = function(tr, ts) {
            return Math.floor(Math.random() * (ts - tr + 1)) + tr;
        };
        this.randFloat = function(tu, tv) {
            return Math.random() * (tv - tu + 1) + tu;
        };
        this.lerp = function(tx, ty, tz) {
            return tx + (ty - tx) * tz;
        };
        this.decel = function(ua, ub) {
            if (ua > 0) {
                ua = Math.max(0, ua - ub);
            } else if (ua < 0) {
                ua = Math.min(0, ua + ub);
            }
            return ua;
        };
        this.getDistance = function(ud, ue, uf, ug) {
            return th((uf -= ud) * uf + (ug -= ue) * ug);
        };
        this.getDist = function(uh, ui, uj, uk) {
            let ul = {
                x: uj == 0 ? uh.x : uj == 1 ? uh.x1 : uj == 2 ? uh.x2 : uj == 3 && uh.x3,
                y: uj == 0 ? uh.y : uj == 1 ? uh.y1 : uj == 2 ? uh.y2 : uj == 3 && uh.y3
            };
            let um = {
                x: uk == 0 ? ui.x : uk == 1 ? ui.x1 : uk == 2 ? ui.x2 : uk == 3 && ui.x3,
                y: uk == 0 ? ui.y : uk == 1 ? ui.y1 : uk == 2 ? ui.y2 : uk == 3 && ui.y3
            };
            return th((um.x -= ul.x) * um.x + (um.y -= ul.y) * um.y);
        };
        this.getDirection = function(un, uo, up, uq) {
            return ti(uo - uq, un - up);
        };
        this.getDirect = function(ur, us, ut, uu) {
            let uv = {
                x: ut == 0 ? ur.x : ut == 1 ? ur.x1 : ut == 2 ? ur.x2 : ut == 3 && ur.x3,
                y: ut == 0 ? ur.y : ut == 1 ? ur.y1 : ut == 2 ? ur.y2 : ut == 3 && ur.y3
            };
            let uw = {
                x: uu == 0 ? us.x : uu == 1 ? us.x1 : uu == 2 ? us.x2 : uu == 3 && us.x3,
                y: uu == 0 ? us.y : uu == 1 ? us.y1 : uu == 2 ? us.y2 : uu == 3 && us.y3
            };
            return ti(uv.y - uw.y, uv.x - uw.x);
        };
        this.getAngleDist = function(ux, uy) {
            let uz = td(uy - ux) % (tj * 2);
            if (uz > tj) {
                return tj * 2 - uz;
            } else {
                return uz;
            }
        };
        this.isNumber = function(va) {
            return typeof va == "number" && !isNaN(va) && isFinite(va);
        };
        this.isString = function(vc) {
            return vc && typeof vc == "string";
        };
        this.kFormat = function(vf) {
            if (vf > 999) {
                return (vf / 1000).toFixed(1) + "k";
            } else {
                return vf;
            }
        };
        this.sFormat = function(vh) {
            let vj = [{
                num: 1000,
                string: "k"
            }, {
                num: 1000000,
                string: "m"
            }, {
                num: 1000000000,
                string: "b"
            }, {
                num: 1000000000000,
                string: "q"
            }].reverse();
            let vk = vj.find(vl => vh >= vl.num);
            if (!vk) {
                return vh;
            }
            return (vh / vk.num).toFixed(1) + vk.string;
        };
        this.capitalizeFirst = function(vm) {
            return vm.charAt(0).toUpperCase() + vm.slice(1);
        };
        this.fixTo = function(vo, vp) {
            return parseFloat(vo.toFixed(vp));
        };
        this.sortByPoints = function(vr, vs) {
            return parseFloat(vs.points) - parseFloat(vr.points);
        };
        this.lineInRect = function(vu, vv, vx, vy, vz, wa, wb, wc) {
            let wf = vz;
            let wg = wb;
            if (vz > wb) {
                wf = wb;
                wg = vz;
            }
            if (wg > vx) {
                wg = vx;
            }
            if (wf < vu) {
                wf = vu;
            }
            if (wf > wg) {
                return false;
            }
            let wh = wa;
            let wi = wc;
            let wj = wb - vz;
            if (Math.abs(wj) > 1e-7) {
                let wk = (wc - wa) / wj;
                let wl = wa - wk * vz;
                wh = wk * wf + wl;
                wi = wk * wg + wl;
            }
            if (wh > wi) {
                let wm = wi;
                wi = wh;
                wh = wm;
            }
            if (wi > vy) {
                wi = vy;
            }
            if (wh < vv) {
                wh = vv;
            }
            if (wh > wi) {
                return false;
            }
            return true;
        };
        this.containsPoint = function(wn, wo, wp) {
            let wr = wn.getBoundingClientRect();
            let wt = wr.left + window.scrollX;
            let wu = wr.top + window.scrollY;
            let wv = wr.width;
            let ww = wr.height;
            let wx = wo > wt && wo < wt + wv;
            let wy = wp > wu && wp < wu + ww;
            return wx && wy;
        };
        this.mousifyTouchEvent = function(wz) {
            let xb = wz.changedTouches[0];
            wz.screenX = xb.screenX;
            wz.screenY = xb.screenY;
            wz.clientX = xb.clientX;
            wz.clientY = xb.clientY;
            wz.pageX = xb.pageX;
            wz.pageY = xb.pageY;
        };
        this.hookTouchEvents = function(xc, xd) {
            let xf = !xd;
            let xg = false;
            let xh = false;
            xc.addEventListener("touchstart", this.checkTrusted(xi), xh);
            xc.addEventListener("touchmove", this.checkTrusted(xj), xh);
            xc.addEventListener("touchend", this.checkTrusted(xk), xh);
            xc.addEventListener("touchcancel", this.checkTrusted(xk), xh);
            xc.addEventListener("touchleave", this.checkTrusted(xk), xh);

            function xi(xl) {
                tk.mousifyTouchEvent(xl);
                window.setUsingTouch(true);
                if (xf) {
                    xl.preventDefault();
                    xl.stopPropagation();
                }
                if (xc.onmouseover) {
                    xc.onmouseover(xl);
                }
                xg = true;
            }

            function xj(xn) {
                tk.mousifyTouchEvent(xn);
                window.setUsingTouch(true);
                if (xf) {
                    xn.preventDefault();
                    xn.stopPropagation();
                }
                if (tk.containsPoint(xc, xn.pageX, xn.pageY)) {
                    if (!xg) {
                        if (xc.onmouseover) {
                            xc.onmouseover(xn);
                        }
                        xg = true;
                    }
                } else if (xg) {
                    if (xc.onmouseout) {
                        xc.onmouseout(xn);
                    }
                    xg = false;
                }
            }

            function xk(xq) {
                tk.mousifyTouchEvent(xq);
                window.setUsingTouch(true);
                if (xf) {
                    xq.preventDefault();
                    xq.stopPropagation();
                }
                if (xg) {
                    if (xc.onclick) {
                        xc.onclick(xq);
                    }
                    if (xc.onmouseout) {
                        xc.onmouseout(xq);
                    }
                    xg = false;
                }
            }
        };
        this.removeAllChildren = function(xs) {
            while (xs.hasChildNodes()) {
                xs.removeChild(xs.lastChild);
            }
        };
        this.generateElement = function(xu) {
            let xw = document.createElement(xu.tag || "div");

            function xx(xy, xz) {
                if (xu[xy]) {
                    xw[xz] = xu[xy];
                }
            }
            xx("text", "textContent");
            xx("html", "innerHTML");
            xx("class", "className");
            for (let ya in xu) {
                switch (ya) {
                    case "tag":
                    case "text":
                    case "html":
                    case "class":
                    case "style":
                    case "hookTouch":
                    case "parent":
                    case "children":
                        continue;
                    default:
                        break;
                }
                xw[ya] = xu[ya];
            }
            if (xw.onclick) {
                xw.onclick = this.checkTrusted(xw.onclick);
            }
            if (xw.onmouseover) {
                xw.onmouseover = this.checkTrusted(xw.onmouseover);
            }
            if (xw.onmouseout) {
                xw.onmouseout = this.checkTrusted(xw.onmouseout);
            }
            if (xu.style) {
                xw.style.cssText = xu.style;
            }
            if (xu.hookTouch) {
                this.hookTouchEvents(xw);
            }
            if (xu.parent) {
                xu.parent.appendChild(xw);
            }
            if (xu.children) {
                for (let yb = 0; yb < xu.children.length; yb++) {
                    xw.appendChild(xu.children[yb]);
                }
            }
            return xw;
        };
        this.checkTrusted = function(yc) {
            return function(yd) {
                if (yd && yd instanceof Event && (yd && typeof yd.isTrusted == "boolean" ? yd.isTrusted : true)) {
                    yc(yd);
                } else {}
            };
        };
        this.randomString = function(yf) {
            let yh = "";
            let yi = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let yj = 0; yj < yf; yj++) {
                yh += yi.charAt(Math.floor(Math.random() * yi.length));
            }
            return yh;
        };
        this.countInArray = function(yk, yl) {
            let yn = 0;
            for (let yo = 0; yo < yk.length; yo++) {
                if (yk[yo] === yl) {
                    yn++;
                }
            }
            return yn;
        };
        this.hexToRgb = function(yp) {
            return yp.slice(1).match(/.{1,2}/g).map(yr => parseInt(yr, 16));
        };
        this.getRgb = function(ys, yt, yu) {
            return [ys / 255, yt / 255, yu / 255].join(", ");
        };
    }
};
class Animtext {
    constructor() {
        this.init = function(yx, yy, yz, za, zb, zc, ze) {
            this.x = yx;
            this.y = yy;
            this.color = ze;
            this.scale = yz;
            this.startScale = this.scale;
            this.maxScale = yz * 1.5;
            this.scaleSpeed = 0.7;
            this.speed = za;
            this.life = zb;
            this.text = zc;
        };
        this.update = function(zg) {
            if (this.life) {
                this.life -= zg;
                this.y -= this.speed * zg;
                this.scale += this.scaleSpeed * zg;
                if (this.scale >= this.maxScale) {
                    this.scale = this.maxScale;
                    this.scaleSpeed *= -1;
                } else if (this.scale <= this.startScale) {
                    this.scale = this.startScale;
                    this.scaleSpeed = 0;
                }
                if (this.life <= 0) {
                    this.life = 0;
                }
            }
        };
        this.render = function(zi, zj, zk) {
            zi.fillStyle = this.color;
            if (getEl("font").checked) {
                zi.font = this.scale + "px Lilita One";
            } else {
                zi.font = this.scale + "px Hammersmith One";
            }
            zi.fillText(this.text, this.x - zj, this.y - zk);
        };
    }
};
class Textmanager {
    constructor() {
        this.texts = [];
        this.stack = [];
        this.update = function(zn, zo, zp, zq) {
            zo.textBaseline = "middle";
            zo.textAlign = "center";
            for (let zs = 0; zs < this.texts.length; ++zs) {
                if (this.texts[zs].life) {
                    this.texts[zs].update(zn);
                    this.texts[zs].render(zo, zp, zq);
                }
            }
        };
        this.showText = function(zt, zu, zv, zw, zx, zy, zz) {
            let aac;
            for (let aad = 0; aad < this.texts.length; ++aad) {
                if (!this.texts[aad].life) {
                    aac = this.texts[aad];
                    break;
                }
            }
            if (!aac) {
                aac = new Animtext();
                this.texts.push(aac);
            }
            aac.init(zt, zu, zv, zw, zx, zy, zz);
        };
    }
}
class GameObject {
    constructor(aae) {
        this.sid = aae;
        this.init = function(aag, aah, aai, aaj, aak, aal, aam) {
            aal = aal || {};
            this.sentTo = {};
            this.gridLocations = [];
            this.active = true;
            this.render = true;
            this.doUpdate = aal.doUpdate;
            this.x = aag;
            this.y = aah;
            this.dir = aai + Math.PI;
            this.lastDir = aai;
            this.xWiggle = 0;
            this.yWiggle = 0;
            this.visScale = aaj;
            this.scale = aaj;
            this.type = aak;
            this.id = aal.id;
            this.owner = aam;
            this.name = aal.name;
            this.isItem = this.id != undefined;
            this.group = aal.group;
            this.maxHealth = aal.health;
            this.health = this.maxHealth;
            this.layer = 2;
            if (this.group != undefined) {
                this.layer = this.group.layer;
            } else if (this.type == 0) {
                this.layer = 3;
            } else if (this.type == 2) {
                this.layer = 0;
            } else if (this.type == 4) {
                this.layer = -1;
            }
            this.colDiv = aal.colDiv || 1;
            this.blocker = aal.blocker;
            this.ignoreCollision = aal.ignoreCollision;
            this.dontGather = aal.dontGather;
            this.hideFromEnemy = aal.hideFromEnemy;
            this.friction = aal.friction;
            this.projDmg = aal.projDmg;
            this.dmg = aal.dmg;
            this.pDmg = aal.pDmg;
            this.pps = aal.pps;
            this.zIndex = aal.zIndex || 0;
            this.turnSpeed = aal.turnSpeed;
            this.req = aal.req;
            this.trap = aal.trap;
            this.healCol = aal.healCol;
            this.teleport = aal.teleport;
            this.boostSpeed = aal.boostSpeed;
            this.projectile = aal.projectile;
            this.shootRange = aal.shootRange;
            this.shootRate = aal.shootRate;
            this.shootCount = this.shootRate;
            this.spawnPoint = aal.spawnPoint;
            this.onNear = 0;
            this.breakObj = false;
            this.alpha = aal.alpha || 1;
            this.maxAlpha = aal.alpha || 1;
            this.damaged = 0;
        };
        this.changeHealth = function(aao, aap) {
            this.health += aao;
            return this.health <= 0;
        };
        this.getScale = function(aaq, aar) {
            aaq = aaq || 1;
            return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : aaq * 0.6) * (aar ? 1 : this.colDiv);
        };
        this.visibleToPlayer = function(aat) {
            return !this.hideFromEnemy || this.owner && (this.owner == aat || this.owner.team && aat.team == this.owner.team);
        };
        this.update = function(aav) {
            if (this.health != this.healthMov) {
                if (this.health < this.healthMov) {
                    this.healthMov -= 1.9;
                } else {
                    this.healthMov += 1.9;
                }
                if (Math.abs(this.health - this.healthMov) < 1.9) {
                    this.healthMov = this.health;
                }
            };
            if (this.active) {
                if (this.xWiggle) {
                    this.xWiggle *= Math.pow(0.99, aav);
                }
                if (this.yWiggle) {
                    this.yWiggle *= Math.pow(0.99, aav);
                }
                if (config.anotherVisualTurn) {
                    let aax = UTILS.getAngleDist(this.lastDir, this.dir);
                    if (aax > 0.01) {
                        this.dir += aax / 5;
                    } else {
                        this.dir = this.lastDir;
                    }
                } else if (this.turnSpeed) {
                    this.dir += this.turnSpeed * aav;
                }
            } else if (this.alive) {
                this.alpha -= aav / (200 / this.maxAlpha);
                this.visScale += aav / (this.scale / 2.5);
                if (this.alpha <= 0) {
                    this.alpha = 0;
                    this.alive = false;
                }
            }
        };
        this.isTeamObject = function(aay) {
            if (this.owner == null) {
                return true;
            } else {
                return this.owner && aay.sid == this.owner.sid || aay.findAllianceBySid(this.owner.sid);
            }
        };
    }
}
class Items {
    constructor() {
        this.groups = [{
            id: 0,
            name: "food",
            layer: 0
        }, {
            id: 1,
            name: "walls",
            place: true,
            limit: 30,
            layer: 0
        }, {
            id: 2,
            name: "spikes",
            place: true,
            limit: 15,
            layer: 0
        }, {
            id: 3,
            name: "mill",
            place: true,
            limit: 7,
            layer: 1
        }, {
            id: 4,
            name: "mine",
            place: true,
            limit: 1,
            layer: 0
        }, {
            id: 5,
            name: "trap",
            place: true,
            limit: 6,
            layer: -1
        }, {
            id: 6,
            name: "booster",
            place: true,
            limit: 12,
            layer: -1
        }, {
            id: 7,
            name: "turret",
            place: true,
            limit: 2,
            layer: 1
        }, {
            id: 8,
            name: "watchtower",
            place: true,
            limit: 12,
            layer: 1
        }, {
            id: 9,
            name: "buff",
            place: true,
            limit: 4,
            layer: -1
        }, {
            id: 10,
            name: "spawn",
            place: true,
            limit: 1,
            layer: -1
        }, {
            id: 11,
            name: "sapling",
            place: true,
            limit: 2,
            layer: 0
        }, {
            id: 12,
            name: "blocker",
            place: true,
            limit: 3,
            layer: -1
        }, {
            id: 13,
            name: "teleporter",
            place: true,
            limit: 2,
            layer: -1
        }];
        this.projectiles = [{
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 25,
            speed: 1.6,
            scale: 103,
            range: 1000
        }, {
            indx: 1,
            layer: 1,
            dmg: 25,
            scale: 20
        }, {
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 35,
            speed: 2.5,
            scale: 103,
            range: 1200
        }, {
            indx: 0,
            layer: 0,
            src: "arrow_1",
            dmg: 30,
            speed: 2,
            scale: 103,
            range: 1200
        }, {
            indx: 1,
            layer: 1,
            dmg: 16,
            scale: 20
        }, {
            indx: 0,
            layer: 0,
            src: "bullet_1",
            dmg: 50,
            speed: 3.6,
            scale: 160,
            range: 1400
        }];
        this.weapons = [{
            id: 0,
            type: 0,
            name: "tool hammer",
            desc: "tool for gathering all resources",
            src: "hammer_1",
            length: 140,
            width: 140,
            xOff: -3,
            yOff: 18,
            dmg: 25,
            range: 65,
            gather: 1,
            speed: 300
        }, {
            id: 1,
            type: 0,
            age: 2,
            name: "hand axe",
            desc: "gathers resources at a higher rate",
            src: "axe_1",
            length: 140,
            width: 140,
            xOff: 3,
            yOff: 24,
            dmg: 30,
            spdMult: 1,
            range: 70,
            gather: 2,
            speed: 400
        }, {
            id: 2,
            type: 0,
            age: 8,
            pre: 1,
            name: "great axe",
            desc: "deal more damage and gather more resources",
            src: "great_axe_1",
            length: 140,
            width: 140,
            xOff: -8,
            yOff: 25,
            dmg: 35,
            spdMult: 1,
            range: 75,
            gather: 4,
            speed: 400
        }, {
            id: 3,
            type: 0,
            age: 2,
            name: "short sword",
            desc: "increased attack power but slower move speed",
            src: "sword_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 46,
            dmg: 35,
            spdMult: 0.85,
            range: 110,
            gather: 1,
            speed: 300
        }, {
            id: 4,
            type: 0,
            age: 8,
            pre: 3,
            name: "katana",
            desc: "greater range and damage",
            src: "samurai_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 59,
            dmg: 40,
            spdMult: 0.8,
            range: 118,
            gather: 1,
            speed: 300
        }, {
            id: 5,
            type: 0,
            age: 2,
            name: "polearm",
            desc: "long range melee weapon",
            src: "spear_1",
            iPad: 1.3,
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 53,
            dmg: 45,
            knock: 0.2,
            spdMult: 0.82,
            range: 142,
            gather: 1,
            speed: 700
        }, {
            id: 6,
            type: 0,
            age: 2,
            name: "bat",
            desc: "fast long range melee weapon",
            src: "bat_1",
            iPad: 1.3,
            length: 110,
            width: 180,
            xOff: -8,
            yOff: 53,
            dmg: 20,
            knock: 0.7,
            range: 110,
            gather: 1,
            speed: 300
        }, {
            id: 7,
            type: 0,
            age: 2,
            name: "daggers",
            desc: "really fast short range weapon",
            src: "dagger_1",
            iPad: 0.8,
            length: 110,
            width: 110,
            xOff: 18,
            yOff: 0,
            dmg: 20,
            knock: 0.1,
            range: 65,
            gather: 1,
            hitSlow: 0.1,
            spdMult: 1.13,
            speed: 100
        }, {
            id: 8,
            type: 0,
            age: 2,
            name: "stick",
            desc: "great for gathering but very weak",
            src: "stick_1",
            length: 140,
            width: 140,
            xOff: 3,
            yOff: 24,
            dmg: 1,
            spdMult: 1,
            range: 70,
            gather: 7,
            speed: 400
        }, {
            id: 9,
            type: 1,
            age: 6,
            name: "hunting bow",
            desc: "bow used for ranged combat and hunting",
            src: "bow_1",
            req: ["wood", 4],
            length: 120,
            width: 120,
            xOff: -6,
            yOff: 0,
            Pdmg: 25,
            projectile: 0,
            spdMult: 0.75,
            speed: 600
        }, {
            id: 10,
            type: 1,
            age: 6,
            name: "great hammer",
            desc: "hammer used for destroying structures",
            src: "great_hammer_1",
            length: 140,
            width: 140,
            xOff: -9,
            yOff: 25,
            dmg: 10,
            Pdmg: 10,
            spdMult: 0.88,
            range: 75,
            sDmg: 7.5,
            gather: 1,
            speed: 400
        }, {
            id: 11,
            type: 1,
            age: 6,
            name: "wooden shield",
            desc: "blocks projectiles and reduces melee damage",
            src: "shield_1",
            length: 120,
            width: 120,
            shield: 0.2,
            xOff: 6,
            yOff: 0,
            Pdmg: 0,
            spdMult: 0.7
        }, {
            id: 12,
            type: 1,
            age: 8,
            pre: 9,
            name: "crossbow",
            desc: "deals more damage and has greater range",
            src: "crossbow_1",
            req: ["wood", 5],
            aboveHand: true,
            armS: 0.75,
            length: 120,
            width: 120,
            xOff: -4,
            yOff: 0,
            Pdmg: 35,
            projectile: 2,
            spdMult: 0.7,
            speed: 700
        }, {
            id: 13,
            type: 1,
            age: 9,
            pre: 12,
            name: "repeater crossbow",
            desc: "high firerate crossbow with reduced damage",
            src: "crossbow_2",
            req: ["wood", 10],
            aboveHand: true,
            armS: 0.75,
            length: 120,
            width: 120,
            xOff: -4,
            yOff: 0,
            Pdmg: 30,
            projectile: 3,
            spdMult: 0.7,
            speed: 230
        }, {
            id: 14,
            type: 1,
            age: 6,
            name: "mc grabby",
            desc: "steals resources from enemies",
            src: "grab_1",
            length: 130,
            width: 210,
            xOff: -8,
            yOff: 53,
            dmg: 0,
            Pdmg: 0,
            steal: 250,
            knock: 0.2,
            spdMult: 1.05,
            range: 125,
            gather: 0,
            speed: 700
        }, {
            id: 15,
            type: 1,
            age: 9,
            pre: 12,
            name: "musket",
            desc: "slow firerate but high damage and range",
            src: "musket_1",
            req: ["stone", 10],
            aboveHand: true,
            rec: 0.35,
            armS: 0.6,
            hndS: 0.3,
            hndD: 1.6,
            length: 205,
            width: 205,
            xOff: 25,
            yOff: 0,
            Pdmg: 50,
            projectile: 5,
            hideProjectile: true,
            spdMult: 0.6,
            speed: 1500
        }];
        this.list = [{
            group: this.groups[0],
            name: "apple",
            desc: "restores 20 health when consumed",
            req: ["food", 10],
            consume: function(abb) {
                return abb.changeHealth(20, abb);
            },
            scale: 22,
            holdOffset: 15,
            healing: 20,
            itemID: 0,
            itemAID: 16
        }, {
            age: 3,
            group: this.groups[0],
            name: "cookie",
            desc: "restores 40 health when consumed",
            req: ["food", 15],
            consume: function(abd) {
                return abd.changeHealth(40, abd);
            },
            scale: 27,
            holdOffset: 15,
            healing: 40,
            itemID: 1,
            itemAID: 17
        }, {
            age: 7,
            group: this.groups[0],
            name: "cheese",
            desc: "restores 30 health and another 50 over 5 seconds",
            req: ["food", 25],
            consume: function(abf) {
                if (abf.changeHealth(30, abf) || abf.health < 100) {
                    abf.dmgOverTime.dmg = -10;
                    abf.dmgOverTime.doer = abf;
                    abf.dmgOverTime.time = 5;
                    return true;
                }
                return false;
            },
            scale: 27,
            holdOffset: 15,
            healing: 30,
            itemID: 2,
            itemAID: 18
        }, {
            group: this.groups[1],
            name: "wood wall",
            desc: "provides protection for your village",
            req: ["wood", 10],
            projDmg: true,
            health: 380,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 3,
            itemAID: 19
        }, {
            age: 3,
            group: this.groups[1],
            name: "stone wall",
            desc: "provides improved protection for your village",
            req: ["stone", 25],
            health: 900,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 4,
            itemAID: 20
        }, {
            age: 7,
            group: this.groups[1],
            name: "castle wall",
            desc: "provides powerful protection for your village",
            req: ["stone", 35],
            health: 1500,
            scale: 52,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 5,
            itemAID: 21
        }, {
            group: this.groups[2],
            name: "spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 20, "stone", 5],
            health: 400,
            dmg: 20,
            scale: 49,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 6,
            itemAID: 22
        }, {
            age: 5,
            group: this.groups[2],
            name: "greater spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 30, "stone", 10],
            health: 500,
            dmg: 35,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 7,
            itemAID: 23
        }, {
            age: 9,
            group: this.groups[2],
            name: "poison spikes",
            desc: "poisons enemies when they touch them",
            req: ["wood", 35, "stone", 15],
            health: 600,
            dmg: 30,
            pDmg: 5,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 8,
            itemAID: 24
        }, {
            age: 9,
            group: this.groups[2],
            name: "spinning spikes",
            desc: "damages enemies when they touch them",
            req: ["wood", 30, "stone", 20],
            health: 500,
            dmg: 45,
            turnSpeed: 0.001,
            scale: 52,
            spritePadding: -23,
            holdOffset: 8,
            placeOffset: -5,
            itemID: 9,
            itemAID: 25
        }, {
            group: this.groups[3],
            name: "windmill",
            desc: "generates gold over time",
            req: ["wood", 50, "stone", 10],
            health: 400,
            pps: 1,
            turnSpeed: 0,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 45,
            holdOffset: 20,
            placeOffset: 5,
            itemID: 10,
            itemAID: 26
        }, {
            age: 5,
            group: this.groups[3],
            name: "faster windmill",
            desc: "generates more gold over time",
            req: ["wood", 60, "stone", 20],
            health: 500,
            pps: 1.5,
            turnSpeed: 0,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 47,
            holdOffset: 20,
            placeOffset: 5,
            itemID: 11,
            itemAID: 27
        }, {
            age: 8,
            group: this.groups[3],
            name: "power mill",
            desc: "generates more gold over time",
            req: ["wood", 100, "stone", 50],
            health: 800,
            pps: 2,
            turnSpeed: 0,
            spritePadding: 25,
            iconLineMult: 12,
            scale: 47,
            holdOffset: 20,
            placeOffset: 5,
            itemID: 12,
            itemAID: 28
        }, {
            age: 5,
            group: this.groups[4],
            type: 2,
            name: "mine",
            desc: "allows you to mine stone",
            req: ["wood", 20, "stone", 100],
            iconLineMult: 12,
            scale: 65,
            holdOffset: 20,
            placeOffset: 0,
            itemID: 13,
            itemAID: 29
        }, {
            age: 5,
            group: this.groups[11],
            type: 0,
            name: "sapling",
            desc: "allows you to farm wood",
            req: ["wood", 150],
            iconLineMult: 12,
            colDiv: 0.5,
            scale: 110,
            holdOffset: 50,
            placeOffset: -15,
            itemID: 14,
            itemAID: 30
        }, {
            age: 4,
            group: this.groups[5],
            name: "pit trap",
            desc: "pit that traps enemies if they walk over it",
            req: ["wood", 30, "stone", 30],
            trap: true,
            ignoreCollision: true,
            hideFromEnemy: true,
            health: 500,
            colDiv: 0.2,
            scale: 50,
            holdOffset: 20,
            placeOffset: -5,
            alpha: 0.6,
            itemID: 15,
            itemAID: 31
        }, {
            age: 4,
            group: this.groups[6],
            name: "boost pad",
            desc: "provides boost when stepped on",
            req: ["stone", 20, "wood", 5],
            ignoreCollision: true,
            boostSpeed: 1.5,
            health: 150,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 16,
            itemAID: 32
        }, {
            age: 7,
            group: this.groups[7],
            doUpdate: true,
            name: "turret",
            desc: "defensive structure that shoots at enemies",
            req: ["wood", 200, "stone", 150],
            health: 800,
            projectile: 1,
            shootRange: 700,
            shootRate: 2200,
            scale: 43,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 17,
            itemAID: 33
        }, {
            age: 7,
            group: this.groups[8],
            name: "platform",
            desc: "platform to shoot over walls and cross over water",
            req: ["wood", 20],
            ignoreCollision: true,
            zIndex: 1,
            health: 300,
            scale: 43,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 18,
            itemAID: 34
        }, {
            age: 7,
            group: this.groups[9],
            name: "healing pad",
            desc: "standing on it will slowly heal you",
            req: ["wood", 30, "food", 10],
            ignoreCollision: true,
            healCol: 15,
            health: 400,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 19,
            itemAID: 35
        }, {
            age: 9,
            group: this.groups[10],
            name: "spawn pad",
            desc: "you will spawn here when you die but it will dissapear",
            req: ["wood", 100, "stone", 100],
            health: 400,
            ignoreCollision: true,
            spawnPoint: true,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 20,
            itemAID: 36
        }, {
            age: 7,
            group: this.groups[12],
            name: "blocker",
            desc: "blocks building in radius",
            req: ["wood", 30, "stone", 25],
            ignoreCollision: true,
            blocker: 300,
            health: 400,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 21,
            itemAID: 37
        }, {
            age: 7,
            group: this.groups[13],
            name: "teleporter",
            desc: "teleports you to a random point on the map",
            req: ["wood", 60, "stone", 60],
            ignoreCollision: true,
            teleport: true,
            health: 200,
            colDiv: 0.7,
            scale: 45,
            holdOffset: 20,
            placeOffset: -5,
            itemID: 22,
            itemAID: 38
        }];
        this.checkItem = {
            index: function(abh, abi) {
                if ([0, 1, 2].includes(abh)) {
                    return 0;
                } else if ([3, 4, 5].includes(abh)) {
                    return 1;
                } else if ([6, 7, 8, 9].includes(abh)) {
                    return 2;
                } else if ([10, 11, 12].includes(abh)) {
                    return 3;
                } else if ([13, 14].includes(abh)) {
                    return 5;
                } else if ([15, 16].includes(abh)) {
                    return 4;
                } else if ([17, 18, 19, 21, 22].includes(abh)) {
                    if ([13, 14].includes(abi)) {
                        return 6;
                    } else {
                        return 5;
                    }
                } else if (abh == 20) {
                    if ([13, 14].includes(abi)) {
                        return 7;
                    } else {
                        return 6;
                    }
                } else {
                    return undefined;
                }
            }
        };
        for (let abk = 0; abk < this.list.length; ++abk) {
            this.list[abk].id = abk;
            if (this.list[abk].pre) {
                this.list[abk].pre = abk - this.list[abk].pre;
            }
        }
        if (typeof window !== "undefined") {
            function abl(abm) {
                for (let abo = abm.length - 1; abo > 0; abo--) {
                    const abp = Math.floor(Math.random() * (abo + 1));
                    [abm[abo], abm[abp]] = [abm[abp], abm[abo]];
                }
                return abm;
            }
        }
    }
}
class Objectmanager {
    constructor(abq, abr, abt, abu, abv, abw) {
        let aby = Math.floor;
        let abz = Math.abs;
        let aca = Math.cos;
        let acb = Math.sin;
        let acd = Math.pow;
        let ace = Math.sqrt;
        this.ignoreAdd = false;
        this.hitObj = [];
        this.disableObj = function(acf) {
            acf.active = false;
        };
        let ach;
        this.add = function(aci, acj, ack, acl, acm, acn, aco, acp, acq) {
            ach = gameObjects.find(acs => acs.sid == aci);
            if (!ach) {
                ach = gameObjects.find(act => !act.active);
                if (!ach) {
                    ach = new abq(aci);
                    gameObjects.push(ach);
                }
            }
            if (acp) {
                ach.sid = aci;
            }
            ach.init(acj, ack, acl, acm, acn, aco, acq);
        };
        this.disableBySid = function(acu) {
            let acw = gameObjects.find(acs => acs.sid == acu);
            if (acw) {
                this.disableObj(acw);
            }
        };
        this.removeAllItems = function(acx, acy) {
            gameObjects.filter(ada => ada.active && ada.owner && ada.owner.sid == acx).forEach(adb => this.disableObj(adb));
        };
        this.checkItemLocation = function(adc, ade, adf, adg, adh, adi, adj) {
            let adl = abr.find(adm => adm.active && abt.getDistance(adc, ade, adm.x, adm.y) < adf + (adm.blocker ? adm.blocker : adm.getScale(adg, adm.isItem)));
            if (adl) {
                return false;
            }
            if (!adi && adh != 18 && ade >= abu.mapScale / 2 - abu.riverWidth / 2 && ade <= abu.mapScale / 2 + abu.riverWidth / 2) {
                return false;
            }
            return true;
        };
        this.customCheckItemLocation = (adn, ado, adp, adq, adr, ads, adt, adu, adv, adw, adx) => {
            let adz = adv.find(aea => aea.active && aea.x !== adu.x && aea.y !== adu.y && aea.id !== adu.id && adw.getDistance(adn, ado, aea.x, aea.y) < adp + (aea.blocker ? aea.blocker : aea.getScale(adq, aea.isItem)));
            if (adz) {
                return false;
            }
            if (!ads && adr != 18 && ado >= adx.mapScale / 2 - adx.riverWidth / 2 && ado <= adx.mapScale / 2 + adx.riverWidth / 2) {
                return false;
            }
            return true;
        };
    }
}
class Projectile {
    constructor(aeb, aec, aed, aee, aef, aeg, aeh) {
        this.init = function(aei, aej, aek, ael, aem, aen, aeo, aep, aeq) {
            this.active = true;
            this.tickActive = true;
            this.indx = aei;
            this.x = aej;
            this.y = aek;
            this.x2 = aej;
            this.y2 = aek;
            this.dir = ael;
            this.skipMov = true;
            this.speed = aem;
            this.dmg = aen;
            this.scale = aep;
            this.range = aeo;
            this.r2 = aeo;
            this.owner = aeq;
        };
        this.update = function(aes) {
            if (this.active) {
                let aeu = this.speed * aes;
                if (!this.skipMov) {
                    this.x += aeu * Math.cos(this.dir);
                    this.y += aeu * Math.sin(this.dir);
                    this.range -= aeu;
                    if (this.range <= 0) {
                        this.x += this.range * Math.cos(this.dir);
                        this.y += this.range * Math.sin(this.dir);
                        aeu = 1;
                        this.range = 0;
                        this.active = false;
                    }
                } else {
                    this.skipMov = false;
                }
            }
        };
        this.tickUpdate = function(aev) {
            if (this.tickActive) {
                let aex = this.speed * aev;
                if (!this.skipMov) {
                    this.x2 += aex * Math.cos(this.dir);
                    this.y2 += aex * Math.sin(this.dir);
                    this.r2 -= aex;
                    if (this.r2 <= 0) {
                        this.x2 += this.r2 * Math.cos(this.dir);
                        this.y2 += this.r2 * Math.sin(this.dir);
                        aex = 1;
                        this.r2 = 0;
                        this.tickActive = false;
                    }
                } else {
                    this.skipMov = false;
                }
            }
        };
    }
};
class Store {
    constructor() {
        this.hats = [{
            id: 45,
            name: "Shame!",
            dontSell: true,
            price: 0,
            scale: 120,
            desc: "hacks are for winners"
        }, {
            id: 51,
            name: "Moo Cap",
            price: 0,
            scale: 120,
            desc: "coolest mooer around"
        }, {
            id: 50,
            name: "Apple Cap",
            price: 0,
            scale: 120,
            desc: "apple farms remembers"
        }, {
            id: 28,
            name: "Moo Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 29,
            name: "Pig Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 30,
            name: "Fluff Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 36,
            name: "Pandou Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 37,
            name: "Bear Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 38,
            name: "Monkey Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 44,
            name: "Polar Head",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 35,
            name: "Fez Hat",
            price: 0,
            scale: 120,
            desc: "no effect"
        }, {
            id: 42,
            name: "Enigma Hat",
            price: 0,
            scale: 120,
            desc: "join the enigma army"
        }, {
            id: 43,
            name: "Blitz Hat",
            price: 0,
            scale: 120,
            desc: "hey everybody i'm blitz"
        }, {
            id: 49,
            name: "Bob XIII Hat",
            price: 0,
            scale: 120,
            desc: "like and subscribe"
        }, {
            id: 57,
            name: "Pumpkin",
            price: 50,
            scale: 120,
            desc: "Spooooky"
        }, {
            id: 8,
            name: "Bummle Hat",
            price: 100,
            scale: 120,
            desc: "no effect"
        }, {
            id: 2,
            name: "Straw Hat",
            price: 500,
            scale: 120,
            desc: "no effect"
        }, {
            id: 15,
            name: "Winter Cap",
            price: 600,
            scale: 120,
            desc: "allows you to move at normal speed in snow",
            coldM: 1
        }, {
            id: 5,
            name: "Cowboy Hat",
            price: 1000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 4,
            name: "Ranger Hat",
            price: 2000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 18,
            name: "Explorer Hat",
            price: 2000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 31,
            name: "Flipper Hat",
            price: 2500,
            scale: 120,
            desc: "have more control while in water",
            watrImm: true
        }, {
            id: 1,
            name: "Marksman Cap",
            price: 3000,
            scale: 120,
            desc: "increases arrow speed and range",
            aMlt: 1.3
        }, {
            id: 10,
            name: "Bush Gear",
            price: 3000,
            scale: 160,
            desc: "allows you to disguise yourself as a bush"
        }, {
            id: 48,
            name: "Halo",
            price: 3000,
            scale: 120,
            desc: "no effect"
        }, {
            id: 6,
            name: "Anti Insta",
            price: 4000,
            scale: 120,
            desc: "reduces damage taken but slows movement",
            spdMult: 0.94,
            dmgMult: 0.75
        }, {
            id: 23,
            name: "Anti Venom Gear",
            price: 4000,
            scale: 120,
            desc: "makes you immune to poison",
            poisonRes: 1
        }, {
            id: 13,
            name: "Medic Gear",
            price: 5000,
            scale: 110,
            desc: "slowly regenerates health over time",
            healthRegen: 3
        }, {
            id: 9,
            name: "Miners Helmet",
            price: 5000,
            scale: 120,
            desc: "earn 1 extra gold per resource",
            extraGold: 1
        }, {
            id: 32,
            name: "Musketeer Hat",
            price: 5000,
            scale: 120,
            desc: "reduces cost of projectiles",
            projCost: 0.5
        }, {
            id: 7,
            name: "Bull Helmet",
            price: 6000,
            scale: 120,
            desc: "increases damage done but drains health",
            healthRegen: -5,
            dmgMultO: 1.5,
            spdMult: 0.96
        }, {
            id: 22,
            name: "Emp Helmet",
            price: 6000,
            scale: 120,
            desc: "turrets won't attack but you move slower",
            antiTurret: 1,
            spdMult: 0.7
        }, {
            id: 12,
            name: "Booster Hat",
            price: 6000,
            scale: 120,
            desc: "increases your movement speed",
            spdMult: 1.16
        }, {
            id: 26,
            name: "Barbarian Armor",
            price: 8000,
            scale: 120,
            desc: "knocks back enemies that attack you",
            dmgK: 0.6
        }, {
            id: 21,
            name: "Plague Mask",
            price: 10000,
            scale: 120,
            desc: "melee attacks deal poison damage",
            poisonDmg: 5,
            poisonTime: 6
        }, {
            id: 46,
            name: "Bull Mask",
            price: 10000,
            scale: 120,
            desc: "bulls won't target you unless you attack them",
            bullRepel: 1
        }, {
            id: 14,
            name: "Windmill Hat",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "generates points while worn",
            pps: 1.5
        }, {
            id: 11,
            name: "Spike Gear",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "deal damage to players that damage you",
            dmg: 0.45
        }, {
            id: 53,
            name: "Turret Gear",
            topSprite: true,
            price: 10000,
            scale: 120,
            desc: "you become a walking turret",
            turret: {
                proj: 1,
                range: 700,
                rate: 2500
            },
            spdMult: 0.7
        }, {
            id: 20,
            name: "Samurai Armor",
            price: 12000,
            scale: 120,
            desc: "increased attack speed and fire rate",
            atkSpd: 0.78
        }, {
            id: 58,
            name: "Dark Knight",
            price: 12000,
            scale: 120,
            desc: "restores health when you deal damage",
            healD: 0.4
        }, {
            id: 27,
            name: "Scavenger Gear",
            price: 15000,
            scale: 120,
            desc: "earn double points for each kill",
            kScrM: 2
        }, {
            id: 40,
            name: "Tank Gear",
            price: 15000,
            scale: 120,
            desc: "increased damage to buildings but slower movement",
            spdMult: 0.3,
            bDmg: 3.3
        }, {
            id: 52,
            name: "Thief Gear",
            price: 15000,
            scale: 120,
            desc: "steal half of a players gold when you kill them",
            goldSteal: 0.5
        }, {
            id: 55,
            name: "Bloodthirster",
            price: 20000,
            scale: 120,
            desc: "Restore Health when dealing damage. And increased damage",
            healD: 0.25,
            dmgMultO: 1.2
        }, {
            id: 56,
            name: "Assassin Gear",
            price: 20000,
            scale: 120,
            desc: "Go invisible when not moving. Can't eat. Increased speed",
            noEat: true,
            spdMult: 1.1,
            invisTimer: 1000
        }];
        this.accessories = [{
            id: 12,
            name: "Snowball",
            price: 1000,
            scale: 105,
            xOff: 18,
            desc: "no effect"
        }, {
            id: 9,
            name: "Tree Cape",
            price: 1000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 10,
            name: "Stone Cape",
            price: 1000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 3,
            name: "Cookie Cape",
            price: 1500,
            scale: 90,
            desc: "no effect"
        }, {
            id: 8,
            name: "Cow Cape",
            price: 2000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 11,
            name: "Monkey Tail",
            price: 2000,
            scale: 97,
            xOff: 25,
            desc: "Super speed but reduced damage",
            spdMult: 1.35,
            dmgMultO: 0.2
        }, {
            id: 17,
            name: "Apple Basket",
            price: 3000,
            scale: 80,
            xOff: 12,
            desc: "slowly regenerates health over time",
            healthRegen: 1
        }, {
            id: 6,
            name: "Winter Cape",
            price: 3000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 4,
            name: "Skull Cape",
            price: 4000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 5,
            name: "Dash Cape",
            price: 5000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 2,
            name: "Dragon Cape",
            price: 6000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 1,
            name: "Super Cape",
            price: 8000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 7,
            name: "Troll Cape",
            price: 8000,
            scale: 90,
            desc: "no effect"
        }, {
            id: 14,
            name: "Thorns",
            price: 10000,
            scale: 115,
            xOff: 20,
            desc: "no effect"
        }, {
            id: 15,
            name: "Blockades",
            price: 10000,
            scale: 95,
            xOff: 15,
            desc: "no effect"
        }, {
            id: 20,
            name: "Devils Tail",
            price: 10000,
            scale: 95,
            xOff: 20,
            desc: "no effect"
        }, {
            id: 16,
            name: "Sawblade",
            price: 12000,
            scale: 90,
            spin: true,
            xOff: 0,
            desc: "deal damage to players that damage you",
            dmg: 0.15
        }, {
            id: 13,
            name: "Angel Wings",
            price: 15000,
            scale: 138,
            xOff: 22,
            desc: "slowly regenerates health over time",
            healthRegen: 3
        }, {
            id: 19,
            name: "Shadow Wings",
            price: 15000,
            scale: 138,
            xOff: 22,
            desc: "increased movement speed",
            spdMult: 1.1
        }, {
            id: 18,
            name: "Blood Wings",
            price: 20000,
            scale: 178,
            xOff: 26,
            desc: "restores health when you deal damage",
            healD: 0.2
        }, {
            id: 21,
            name: "Corrupt X Wings",
            price: 20000,
            scale: 178,
            xOff: 26,
            desc: "deal damage to players that damage you",
            dmg: 0.25
        }];
    }
};
class ProjectileManager {
    constructor(aez, afa, afb, afc, afd, afe, aff, afg, afh) {
        this.addProjectile = function(afj, afk, afl, afm, afn, afo, afp, afq, afr, afs) {
            let afu = afe.projectiles[afo];
            let afv;
            for (let afw = 0; afw < afa.length; ++afw) {
                if (!afa[afw].active) {
                    afv = afa[afw];
                    break;
                }
            }
            if (!afv) {
                afv = new aez(afb, afc, afd, afe, aff, afg, afh);
                afv.sid = afa.length;
                afa.push(afv);
            }
            afv.init(afo, afj, afk, afl, afn, afu.dmg, afm, afu.scale, afp);
            afv.ignoreObj = afq;
            afv.layer = afr || afu.layer;
            afv.inWindow = afs;
            afv.src = afu.src;
            return afv;
        };
    }
};
class AiManager {
    constructor(afx, afy, afz, aga, agb, agc, agd, agf, agg) {
        this.aiTypes = [{
            id: 0,
            src: "cow_1",
            killScore: 150,
            health: 500,
            weightM: 0.8,
            speed: 0.00095,
            turnSpeed: 0.001,
            scale: 72,
            drop: ["food", 50]
        }, {
            id: 1,
            src: "pig_1",
            killScore: 200,
            health: 800,
            weightM: 0.6,
            speed: 0.00085,
            turnSpeed: 0.001,
            scale: 72,
            drop: ["food", 80]
        }, {
            id: 2,
            name: "Bull",
            src: "bull_2",
            hostile: true,
            dmg: 20,
            killScore: 1000,
            health: 1800,
            weightM: 0.5,
            speed: 0.00094,
            turnSpeed: 0.00074,
            scale: 78,
            viewRange: 800,
            chargePlayer: true,
            drop: ["food", 100]
        }, {
            id: 3,
            name: "Bully",
            src: "bull_1",
            hostile: true,
            dmg: 20,
            killScore: 2000,
            health: 2800,
            weightM: 0.45,
            speed: 0.001,
            turnSpeed: 0.0008,
            scale: 90,
            viewRange: 900,
            chargePlayer: true,
            drop: ["food", 400]
        }, {
            id: 4,
            name: "Wolf",
            src: "wolf_1",
            hostile: true,
            dmg: 8,
            killScore: 500,
            health: 300,
            weightM: 0.45,
            speed: 0.001,
            turnSpeed: 0.002,
            scale: 84,
            viewRange: 800,
            chargePlayer: true,
            drop: ["food", 200]
        }, {
            id: 5,
            name: "Quack",
            src: "chicken_1",
            dmg: 8,
            killScore: 2000,
            noTrap: true,
            health: 300,
            weightM: 0.2,
            speed: 0.0018,
            turnSpeed: 0.006,
            scale: 70,
            drop: ["food", 100]
        }, {
            id: 6,
            name: "MOOSTAFA",
            nameScale: 50,
            src: "enemy",
            hostile: true,
            dontRun: true,
            fixedSpawn: true,
            spawnDelay: 60000,
            noTrap: true,
            colDmg: 100,
            dmg: 40,
            killScore: 8000,
            health: 18000,
            weightM: 0.4,
            speed: 0.0007,
            turnSpeed: 0.01,
            scale: 80,
            spriteMlt: 1.8,
            leapForce: 0.9,
            viewRange: 1000,
            hitRange: 210,
            hitDelay: 1000,
            chargePlayer: true,
            drop: ["food", 100]
        }, {
            id: 7,
            name: "Treasure",
            hostile: true,
            nameScale: 35,
            src: "crate_1",
            fixedSpawn: true,
            spawnDelay: 120000,
            colDmg: 200,
            killScore: 5000,
            health: 20000,
            weightM: 0.1,
            speed: 0,
            turnSpeed: 0,
            scale: 70,
            spriteMlt: 1
        }, {
            id: 8,
            name: "MOOFIE",
            src: "wolf_2",
            hostile: true,
            fixedSpawn: true,
            dontRun: true,
            hitScare: 4,
            spawnDelay: 30000,
            noTrap: true,
            nameScale: 35,
            dmg: 10,
            colDmg: 100,
            killScore: 3000,
            health: 7000,
            weightM: 0.45,
            speed: 0.0015,
            turnSpeed: 0.002,
            scale: 90,
            viewRange: 800,
            chargePlayer: true,
            drop: ["food", 1000]
        }];
        this.spawn = function(agi, agj, agk, agl) {
            let agn = afx.find(ago => !ago.active);
            if (!agn) {
                agn = new afy(afx.length, agb, afz, aga, agd, agc, agf, agg);
                afx.push(agn);
            }
            agn.init(agi, agj, agk, agl, this.aiTypes[agl]);
            return agn;
        };
    }
};
class AI {
    constructor(agp, agq, agr, ags, agt, agu, agv, agw) {
        this.sid = agp;
        this.isAI = true;
        this.nameIndex = agt.randInt(0, agu.cowNames.length - 1);
        this.init = function(agy, agz, aha, ahb, ahc) {
            this.x = agy;
            this.y = agz;
            this.startX = ahc.fixedSpawn ? agy : null;
            this.startY = ahc.fixedSpawn ? agz : null;
            this.xVel = 0;
            this.yVel = 0;
            this.zIndex = 0;
            this.dir = aha;
            this.dirPlus = 0;
            this.showName = "aaa";
            this.index = ahb;
            this.src = ahc.src;
            if (ahc.name) {
                this.name = ahc.name;
            }
            this.weightM = ahc.weightM;
            this.speed = ahc.speed;
            this.killScore = ahc.killScore;
            this.turnSpeed = ahc.turnSpeed;
            this.scale = ahc.scale;
            this.maxHealth = ahc.health;
            this.leapForce = ahc.leapForce;
            this.health = this.maxHealth;
            this.chargePlayer = ahc.chargePlayer;
            this.viewRange = ahc.viewRange;
            this.drop = ahc.drop;
            this.dmg = ahc.dmg;
            this.hostile = ahc.hostile;
            this.dontRun = ahc.dontRun;
            this.hitRange = ahc.hitRange;
            this.hitDelay = ahc.hitDelay;
            this.hitScare = ahc.hitScare;
            this.spriteMlt = ahc.spriteMlt;
            this.nameScale = ahc.nameScale;
            this.colDmg = ahc.colDmg;
            this.noTrap = ahc.noTrap;
            this.spawnDelay = ahc.spawnDelay;
            this.hitWait = 0;
            this.waitCount = 1000;
            this.moveCount = 0;
            this.targetDir = 0;
            this.active = true;
            this.alive = true;
            this.runFrom = null;
            this.chargeTarget = null;
            this.dmgOverTime = {};
        };
        let ahe = 0;
        let ahf = 0;
        this.animate = function(ahg) {
            if (this.animTime > 0) {
                this.animTime -= ahg;
                if (this.animTime <= 0) {
                    this.animTime = 0;
                    this.dirPlus = 0;
                    ahe = 0;
                    ahf = 0;
                } else if (ahf == 0) {
                    ahe += ahg / (this.animSpeed * agu.hitReturnRatio);
                    this.dirPlus = agt.lerp(0, this.targetAngle, Math.min(1, ahe));
                    if (ahe >= 1) {
                        ahe = 1;
                        ahf = 1;
                    }
                } else {
                    ahe -= ahg / (this.animSpeed * (1 - agu.hitReturnRatio));
                    this.dirPlus = agt.lerp(0, this.targetAngle, Math.max(0, ahe));
                }
            }
        };
        this.startAnim = function() {
            this.animTime = this.animSpeed = 600;
            this.targetAngle = Math.PI * 0.8;
            ahe = 0;
            ahf = 0;
        };
    }
};
class addCh {
    constructor(ahj, ahk, ahl, ahm) {
        this.x = ahj;
        this.y = ahk;
        this.alpha = 0;
        this.active = true;
        this.alive = false;
        this.chat = ahl;
        this.owner = ahm;
    }
};
class DeadPlayer {
    constructor(aho, ahp, ahq, ahr, ahs, aht, ahu, ahv, ahw) {
        this.x = aho;
        this.y = ahp;
        this.lastDir = ahq;
        this.dir = ahq + Math.PI;
        this.buildIndex = ahr;
        this.weaponIndex = ahs;
        this.weaponVariant = aht;
        this.skinColor = ahu;
        this.scale = ahv;
        this.visScale = 0;
        this.name = ahw;
        this.alpha = 1;
        this.active = true;
        this.animate = function(ahy) {
            let aia = UTILS.getAngleDist(this.lastDir, this.dir);
            if (aia > 0.01) {
                this.dir += aia / 20;
            } else {
                this.dir = this.lastDir;
            }
            if (this.visScale < this.scale) {
                this.visScale += ahy / (this.scale / 2);
                if (this.visScale >= this.scale) {
                    this.visScale = this.scale;
                }
            }
            this.alpha -= ahy / 30000;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.active = false;
            }
        };
    }
};
class Player {
    constructor(aib, aic, aid, aie, aif, aig, aih, aii, aij, aik, ail, ain, aio, aip) {
        this.id = aib;
        this.sid = aic;
        this.tmpScore = 0;
        this.team = null;
        this.latestSkin = 0;
        this.oldSkinIndex = 0;
        this.skinIndex = 0;
        this.latestTail = 0;
        this.oldTailIndex = 0;
        this.tailIndex = 0;
        this.hitTime = 0;
        this.lastHit = 0;
        this.showName = "NOOO";
        this.tails = {};
        for (let air = 0; air < ail.length; ++air) {
            if (ail[air].price <= 0) {
                this.tails[ail[air].id] = 1;
            }
        }
        this.skins = {};
        for (let ait = 0; ait < aik.length; ++ait) {
            if (aik[ait].price <= 0) {
                this.skins[aik[ait].id] = 1;
            }
        }
        this.points = 0;
        this.dt = 0;
        this.hidden = false;
        this.itemCounts = {};
        this.isPlayer = true;
        this.pps = 0;
        this.moveDir = undefined;
        this.skinRot = 0;
        this.lastPing = 0;
        this.iconIndex = 0;
        this.skinColor = 0;
        this.dist2 = 0;
        this.aim2 = 0;
        this.maxSpeed = 1;
        this.chat = {
            message: null,
            count: 0
        };
        this.backupNobull = true;
        this.circle = false;
        this.circleRad = 200;
        this.circleRadSpd = 0.1;
        this.cAngle = 0;
        this.spawn = function(aiu) {
            this.attacked = false;
            this.timeDamaged = 0;
            this.timeHealed = 0;
            this.pinge = 0;
            this.millPlace = "NOOO";
            this.lastshamecount = 0;
            this.death = false;
            this.spinDir = 0;
            this.sync = false;
            this.antiBull = 0;
            this.bullTimer = 0;
            this.poisonTimer = 0;
            this.active = true;
            this.alive = true;
            this.lockMove = false;
            this.lockDir = false;
            this.minimapCounter = 0;
            this.chatCountdown = 0;
            this.shameCount = 0;
            this.shameTimer = 0;
            this.sentTo = {};
            this.gathering = 0;
            this.gatherIndex = 0;
            this.shooting = {};
            this.shootIndex = 9;
            this.autoGather = 0;
            this.animTime = 0;
            this.animSpeed = 0;
            this.mouseState = 0;
            this.buildIndex = -1;
            this.weaponIndex = 0;
            this.weaponCode = 0;
            this.weaponVariant = 0;
            this.primaryIndex = undefined;
            this.secondaryIndex = undefined;
            this.dmgOverTime = {};
            this.noMovTimer = 0;
            this.maxXP = 300;
            this.XP = 0;
            this.age = 1;
            this.kills = 0;
            this.upgrAge = 2;
            this.upgradePoints = 0;
            this.x = 0;
            this.y = 0;
            this.oldXY = {
                x: 0,
                y: 0
            };
            this.zIndex = 0;
            this.xVel = 0;
            this.yVel = 0;
            this.slowMult = 1;
            this.dir = 0;
            this.dirPlus = 0;
            this.targetDir = 0;
            this.targetAngle = 0;
            this.maxHealth = 100;
            this.health = this.maxHealth;
            this.oldHealth = this.maxHealth;
            this.damaged = 0;
            this.scale = aid.playerScale;
            this.speed = aid.playerSpeed;
            this.resetMoveDir();
            this.resetResources(aiu);
            this.items = [0, 3, 6, 10];
            this.weapons = [0];
            this.shootCount = 0;
            this.weaponXP = [];
            this.reloads = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0,
                12: 0,
                13: 0,
                14: 0,
                15: 0,
                53: 0
            };
            this.bowThreat = {
                9: 0,
                12: 0,
                13: 0,
                15: 0
            };
            this.damageThreat = 0;
            this.inTrap = false;
            this.canEmpAnti = false;
            this.empAnti = false;
            this.soldierAnti = false;
            this.poisonTick = 0;
            this.bullTick = 0;
            this.setPoisonTick = false;
            this.setBullTick = false;
            this.antiTimer = 2;
        };
        this.resetMoveDir = function() {
            this.moveDir = undefined;
        };
        this.resetResources = function(aix) {
            for (let aiz = 0; aiz < aid.resourceTypes.length; ++aiz) {
                this[aid.resourceTypes[aiz]] = aix ? 100 : 0;
            }
        };
        this.getItemType = function(aja) {
            let ajc = this.items.findIndex(ajd => ajd == aja);
            if (ajc != -1) {
                return ajc;
            } else {
                return aij.checkItem.index(aja, this.items);
            }
        };
        this.setData = function(aje) {
            this.id = aje[0];
            this.sid = aje[1];
            this.name = aje[2];
            this.x = aje[3];
            this.y = aje[4];
            this.dir = aje[5];
            this.health = aje[6];
            this.maxHealth = aje[7];
            this.scale = aje[8];
            this.skinColor = aje[9];
        };
        this.updateTimer = function() {
            this.bullTimer -= 1;
            if (this.bullTimer <= 0) {
                this.setBullTick = false;
                this.bullTick = game.tick - 1;
                this.bullTimer = aid.serverUpdateRate;
            }
            this.poisonTimer -= 1;
            if (this.poisonTimer <= 0) {
                this.setPoisonTick = false;
                this.poisonTick = game.tick - 1;
                this.poisonTimer = aid.serverUpdateRate;
            }
        };
        this.update = function(ajh) {
            if (this.sid == playerSID) {}
            if (this.active) {
                let ajj = {
                    skin: findID(aik, this.skinIndex),
                    tail: findID(ail, this.tailIndex)
                };
                let ajk = (this.buildIndex >= 0 ? 0.5 : 1) * (aij.weapons[this.weaponIndex].spdMult || 1) * (ajj.skin ? ajj.skin.spdMult || 1 : 1) * (ajj.tail ? ajj.tail.spdMult || 1 : 1) * (this.y <= aid.snowBiomeTop ? ajj.skin && ajj.skin.coldM ? 1 : aid.snowSpeed : 1) * this.slowMult;
                this.maxSpeed = ajk;
            }
        };
        let ajl = 0;
        let ajm = 0;
        this.animate = function(ajn) {
            if (this.animTime > 0) {
                this.animTime -= ajn;
                if (this.animTime <= 0) {
                    this.animTime = 0;
                    this.dirPlus = 0;
                    ajl = 0;
                    ajm = 0;
                } else if (ajm == 0) {
                    ajl += ajn / (this.animSpeed * aid.hitReturnRatio);
                    this.dirPlus = aie.lerp(0, this.targetAngle, Math.min(1, ajl));
                    if (ajl >= 1) {
                        ajl = 1;
                        ajm = 1;
                    }
                } else {
                    ajl -= ajn / (this.animSpeed * (1 - aid.hitReturnRatio));
                    this.dirPlus = aie.lerp(0, this.targetAngle, Math.max(0, ajl));
                }
            }
        };
        this.startAnim = function(ajp, ajq) {
            this.animTime = this.animSpeed = aij.weapons[ajq].speed;
            this.targetAngle = ajp ? -aid.hitAngle : -Math.PI;
            ajl = 0;
            ajm = 0;
        };
        this.canSee = function(ajs) {
            if (!ajs) {
                return false;
            }
            let aju = Math.abs(ajs.x - this.x) - ajs.scale;
            let ajv = Math.abs(ajs.y - this.y) - ajs.scale;
            return aju <= aid.maxScreenWidth / 2 * 1.3 && ajv <= aid.maxScreenHeight / 2 * 1.3;
        };
        this.judgeShame = function() {
            this.lastshamecount = this.shameCount;
            if (this.oldHealth < this.health) {
                if (this.hitTime) {
                    let ajx = game.tick - this.hitTime;
                    this.lastHit = game.tick;
                    this.hitTime = 0;
                    if (ajx < 2) {
                        this.shameCount++;
                    } else {
                        this.shameCount = Math.max(0, this.shameCount - 2);
                    }
                }
            } else if (this.oldHealth > this.health) {
                this.hitTime = game.tick;
            }
        };
        this.addShameTimer = function() {
            this.shameCount = 0;
            this.shameTimer = 30;
            let ajz = setInterval(() => {
                this.shameTimer--;
                if (this.shameTimer <= 0) {
                    clearInterval(ajz);
                }
            }, 1000);
        };
        this.isTeam = function(akb) {
            return this == akb || this.team && this.team == akb.team;
        };
        this.findAllianceBySid = function(akd) {
            if (this.team) {
                return alliancePlayers.find(akf => akf === akd);
            } else {
                return null;
            }
        };
        this.checkCanInsta = function(akg) {
            let akj = 0;
            if (this.alive && inGame) {
                let akk = {
                    weapon: this.weapons[0],
                    variant: this.primaryVariant,
                    dmg: this.weapons[0] == undefined ? 0 : aij.weapons[this.weapons[0]].dmg
                };
                let akl = {
                    weapon: this.weapons[1],
                    variant: this.secondaryVariant,
                    dmg: this.weapons[1] == undefined ? 0 : aij.weapons[this.weapons[1]].Pdmg
                };
                let akm = this.skins[7] && !akg ? 1.5 : 1;
                let akn = akk.variant != undefined ? aid.weaponVariants[akk.variant].val : 1;
                if (akk.weapon != undefined && this.reloads[akk.weapon] == 0) {
                    akj += akk.dmg * akn * akm;
                }
                if (akl.weapon != undefined && this.reloads[akl.weapon] == 0) {
                    akj += akl.dmg;
                }
                if (this.skins[53] && this.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate) && near.skinIndex != 22) {
                    akj += 25;
                }
                akj *= near.skinIndex == 6 ? 0.75 : 1;
                return akj;
            }
            return 0;
        };
        this.manageReload = function() {
            if (this.shooting[53]) {
                this.shooting[53] = 0;
                this.reloads[53] = 2500 - game.tickRate;
            } else if (this.reloads[53] > 0) {
                this.reloads[53] = Math.max(0, this.reloads[53] - game.tickRate);
            }
            if (this.reloads[this.weaponIndex] <= 111.11111111111111) {
                let akp = this.weaponIndex;
                let akq = liztobj.filter(akr => (akr.active || akr.alive) && akr.health < akr.maxHealth && akr.group !== undefined && aie.getDist(akr, player, 0, 2) <= aij.weapons[player.weaponIndex].range + akr.scale);
                for (let aks = 0; aks < akq.length; aks++) {
                    let akt = akq[aks];
                    let aku = aij.weapons[akp].dmg * aid.weaponVariants[tmpObj[(akp < 9 ? "prima" : "seconda") + "ryVariant"]].val * (aij.weapons[akp].sDmg || 1) * 3.3;
                    let akv = aij.weapons[akp].dmg * aid.weaponVariants[tmpObj[(akp < 9 ? "prima" : "seconda") + "ryVariant"]].val * (aij.weapons[akp].sDmg || 1);
                    if (akt.health - akv <= 0 && near.length) {
                        place(near.dist2 < near.scale * 1.8 + 50 ? 4 : 2, caf(akt, player) + Math.PI);
                    }
                }
            }
            if (this.gathering || this.shooting[1]) {
                if (this.gathering) {
                    this.gathering = 0;
                    this.reloads[this.gatherIndex] = aij.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
                    this.attacked = true;
                }
                if (this.shooting[1]) {
                    this.shooting[1] = 0;
                    this.reloads[this.shootIndex] = aij.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
                    this.attacked = true;
                }
            } else {
                this.attacked = false;
                if (this.buildIndex < 0) {
                    if (this.reloads[this.weaponIndex] > 0) {
                        this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - 110);
                        if (this == player) {
                            if (getEl("weaponGrind").checked) {
                                for (let akw = 0; akw < Math.PI * 2; akw += Math.PI / 2) {
                                    checkPlace(player.getItemType(22), akw);
                                }
                            }
                        }
                        if (this.reloads[this.primaryIndex] == 0 && this.reloads[this.weaponIndex] == 0) {
                            this.antiBull++;
                            game.tickBase(() => {
                                this.antiBull = 0;
                            }, 1);
                        }
                    }
                }
            }
        };
        this.addDamageThreat = function(aky) {
            let ala = {
                weapon: this.primaryIndex,
                variant: this.primaryVariant
            };
            ala.dmg = ala.weapon == undefined ? 45 : aij.weapons[ala.weapon].dmg;
            let alb = {
                weapon: this.secondaryIndex,
                variant: this.secondaryVariant
            };
            alb.dmg = alb.weapon == undefined ? 35 : aij.weapons[alb.weapon].Pdmg;
            let alc = 1.5;
            let ald = ala.variant != undefined ? aid.weaponVariants[ala.variant].val : 1.18;
            let ale = alb.variant != undefined ? [9, 12, 17, 15].includes(alb.weapon) ? 1 : aid.weaponVariants[alb.variant].val : 1.18;
            if (ala.weapon == undefined ? true : this.reloads[ala.weapon] == 0) {
                this.damageThreat += ala.dmg * ald * alc;
            }
            if (alb.weapon == undefined ? true : this.reloads[alb.weapon] == 0) {
                this.damageThreat += alb.dmg * ale;
            }
            if (this.reloads[53] <= game.tickRate) {
                this.damageThreat += 25;
            }
            this.damageThreat *= aky.skinIndex == 6 ? 0.75 : 1;
            if (!this.isTeam(aky)) {
                if (this.dist2 <= 300) {
                    aky.damageThreat += this.damageThreat;
                }
            }
        };
        this.addDamageProbability = function(alf) {
            let alh = {
                weapon: this.primaryIndex,
                variant: this.primaryVariant
            };
            alh.dmg = alh.weapon == undefined ? 45 : aij.weapons[alh.weapon].dmg;
            let ali = {
                weapon: this.secondaryIndex,
                variant: this.secondaryVariant
            };
            ali.dmg = ali.weapon == undefined ? 50 : aij.weapons[ali.weapon].Pdmg;
            let alj = 1.5;
            let alk = alh.variant != undefined ? aid.weaponVariants[alh.variant].val : 1.18;
            let alm = ali.variant != undefined ? [9, 12, 17, 15].includes(ali.weapon) ? 1 : aid.weaponVariants[ali.variant].val : 1.18;
            if (alh.weapon == undefined ? true : this.reloads[alh.weapon] == 0) {
                this.damageProbably += alh.dmg * alk * alj * 0.75;
            }
            if (ali.weapon == undefined ? true : this.reloads[ali.weapon] == 0) {
                this.damageProbably += ali.dmg * alm;
            }
            this.damageProbably *= 0.75;
            if (!this.isTeam(alf)) {
                if (this.dist2 <= 300) {
                    alf.damageProbably += this.damageProbably;
                }
            }
        };
    }
};

function sendUpgrade(aln) {
    player.reloads[aln] = 0;
    packet("H", aln);
}

function storeEquip(alp, alq) {
    packet("c", 0, alp, alq);
}

function storeBuy(alr, als) {
    packet("c", 1, alr, als);
}

function getVelocity(alt) {
    let alv = caf({
        x: alt.olderX,
        y: alt.olderY
    }, alt);
    let alw = cdf({
        x: alt.olderX,
        y: alt.olderY
    }, alt);
    let alx = alt.x + Math.cos(alv) * 4 * window.pingTime / 111.1111;
    let aly = alt.y + Math.sin(alv) * 4 * window.pingTime / 111.1111;
    return [alw, alx, aly, alv];
}

function buyEquip(alz, ama) {
    let amc = player.skins[6] ? 6 : 0;
    if (player.alive && inGame) {
        if (ama == 0) {
            if (player.skins[alz]) {
                if (player.latestSkin != alz) {
                    packet("c", 0, alz, 0);
                }
            } else if (getEl("autoBuyEquip").checked) {
                let amd = findID(hats, alz);
                if (amd) {
                    if (player.points >= amd.price) {
                        packet("c", 1, alz, 0);
                        packet("c", 0, alz, 0);
                    } else if (player.latestSkin != amc) {
                        packet("c", 0, amc, 0);
                    }
                } else if (player.latestSkin != amc) {
                    packet("c", 0, amc, 0);
                }
            } else if (player.latestSkin != amc) {
                packet("c", 0, amc, 0);
            }
        } else if (ama == 1) {
            if (useWasd && alz != 11 && alz != 0) {
                if (player.latestTail != 0) {
                    packet("c", 0, 0, 1);
                }
                return;
            }
            if (player.tails[alz]) {
                if (player.latestTail != alz) {
                    packet("c", 0, alz, 1);
                }
            } else if (getEl("autoBuyEquip").checked) {
                let ame = findID(accessories, alz);
                if (ame) {
                    if (player.points >= ame.price) {
                        packet("c", 1, alz, 1);
                        packet("c", 0, alz, 1);
                    } else if (player.latestTail != 0) {
                        packet("c", 0, 0, 1);
                    }
                } else if (player.latestTail != 0) {
                    packet("c", 0, 0, 1);
                }
            } else if (player.latestTail != 0) {
                packet("c", 0, 0, 1);
            }
        }
    }
}

function selectToBuild(amf, amg) {
    packet("z", amf, amg);
}

function selectWeapon(amh, ami) {
    if (!ami) {
        player.weaponCode = amh;
    }
    packet("z", amh, 1);
}

function sendAutoGather() {
    packet("K", 1, 1);
}

function sendAtck(amj, amk) {
    packet("F", amj, amk, 1);
}
let placePacketLimiter = false;
let placementsPerTick = 0;
let phantom = [];

function place(aml, amm, amn) {
    try {
        if (aml == undefined) {
            return;
        }
        let amp = items.list[player.items[aml]];
        let amq = player.scale + amp.scale + (amp.placeOffset || 0);
        let amr = player.x2 + amq * Math.cos(amm);
        let ams = player.y2 + amq * Math.sin(amm);
        if (player.alive && inGame && player.itemCounts[amp.group.id] == undefined ? true : player.itemCounts[amp.group.id] < (config.isSandbox ? 299 : amp.group.limit ? amp.group.limit : 99)) {
            selectToBuild(player.items[aml]);
            sendAtck(1, amm);
            selectWeapon(player.weaponCode, 1);
            if (amn && getEl("placeVis").checked) {
                placeVisible.push({
                    x: amr,
                    y: ams,
                    name: amp.name,
                    scale: amp.scale,
                    dir: amm
                });
                game.tickBase(() => {
                    placeVisible.shift();
                }, 1);
            }
        }
    } catch (amt) {}
}

function checkPlace(amu, amv) {
    try {
        if (amu == undefined) {
            return;
        }
        let amx = items.list[player.items[amu]];
        let amy = player.scale + amx.scale + (amx.placeOffset || 0);
        let amz = player.x2 + amy * Math.cos(amv);
        let ana = player.y2 + amy * Math.sin(amv);
        if (objectManager.checkItemLocation(amz, ana, amx.scale, 0.6, amx.id, false, player)) {
            place(amu, amv, 1);
        }
    } catch (anb) {}
}

function soldierMult() {
    if (player.latestSkin == 6) {
        return 0.75;
    } else {
        return 1;
    }
}

function healthBased() {
    if (player.health == 100) {
        return 0;
    }
    if (player.skinIndex != 45 && player.skinIndex != 56) {
        return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
    }
    return 0;
}

function insat1() {
    my.autoAim = true;
    selectWeapon(player.weapons[0]);
    buyEquip(7, 0);
    buyEquip(0, 1);
    sendAutoGather();
    setTimeout(() => {
        selectWeapon(player.weapons[1]);
        buyEquip(53, 0);
        setTimeout(() => {
            sendAutoGather();
            my.autoAim = false;
        }, 180);
    }, 100);
}

function getAttacker(ani) {
    let anj = enemy.filter(ank => {
        let anl = {
            three: ank.attacked
        };
        return anl.three;
    });
    return anj;
}

function healer() {
    for (let anm = 0; anm < healthBased(); anm++) {
        place(0, getAttackDir());
    }
}

function healer33() {
    for (let ann = 0; ann < healthBased(); ann++) {
        place(0, getAttackDir());
    }
}

function healer1() {
    place(0, getAttackDir());
    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
}

function noshameheal() {
    place(0, getAttackDir());
    if (player.shameCount >= 5) {
        place(0, getAttackDir());
        healer33();
    } else if (player.shameCount <= 4 && player.skinIndex != 6 && player.skinIndex != 22) {
        healer33();
        buyEquip(6, 0);
    } else if (player.shameCount >= 5 && player.skinIndex != 6 && player.skinIndex != 22) {
        return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
        healer33();
    }
}
const placedSpikePositions = new Set();
const placedTrapPositions = new Set();

function isPositionValid(anq) {
    const ans = player.x2;
    const ant = player.y2;
    const anu = Math.hypot(anq[0] - ans, anq[1] - ant);
    return anu > 35;
}

function findAllianceBySid(anv) {
    if (player.team) {
        return alliancePlayers.find(anx => anx === anv);
    } else {
        return null;
    }
}

function calculatePossibleTrapPositions(any, anz, aoa) {
    const aoc = [];
    const aod = 16;
    for (let aoe = 0; aoe < aod; aoe++) {
        const aof = Math.PI * 2 * aoe / aod;
        const aog = any + aoa * Math.cos(aof);
        const aoh = anz + aoa * Math.sin(aof);
        const aoi = [aog, aoh];
        if (!aoc.some(aoj => isPositionTooClose(aoi, aoj))) {
            aoc.push(aoi);
        }
    }
    return aoc;
}

function isPositionTooClose(aok, aol, aom = 50) {
    const aoo = Math.hypot(aok[0] - aol[0], aok[1] - aol[1]);
    return aoo < aom;
}

function applCxC(aop) {
    if (player.health == 100) {
        return 0;
    }
    if (player.skinIndex != 45 && player.skinIndex != 56) {
        return Math.ceil(aop / items.list[player.items[0]].healing);
    }
    return 0;
}

function healthBased() {
    if (player.health == 100) {
        return 0;
    }
    if (player.skinIndex != 45 && player.skinIndex != 56) {
        return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
    }
    return 0;
}

function calcDmg(aos) {
    if (aos * player.skinIndex == 6) {
        return 0.75;
    } else {
        return 1;
    }
}

function antirev() {
    if (tmpObj.isPlayer) {
        for (let aou = 0; aou < healthBased(); aou++) {
            place(0, getAttackDir());
            if (player.health == 100 && player.shameCount < 6 && player.skinIndex == 6) {
                place(0, getAttackDir());
                console.log("AAAAAAAAAAAAA");
            } else if (player.health == 100 && player.shameCount < 6 && player.skinIndex != 6) {
                place(0, getAttackDir());
                console.log("AAAAAAAAAAAAA");
            } else if (player.health == 96 && player.shameCount < 5 && player.skinIndex == 6) {
                place(0, getAttackDir());
                setTimeout(() => {
                    place(0, getAttackDir());
                }, 5);
            } else if (player.health == 25 && player.shameCount < 5 && player.skinIndex == 6) {
                place(0, getAttackDir());
                setTimeout(() => {
                    place(0, getAttackDir());
                }, 5);
            } else if (player.health == 10 && player.shameCount < 6 && player.skinIndex == 6) {
                place(0, getAttackDir());
                setTimeout(() => {
                    place(0, getAttackDir());
                }, 5);
            } else if (player.health == 50 && player.shameCount < 7 && player.skinIndex != 6) {
                place(0, getAttackDir());
                setTimeout(() => {
                    place(0, getAttackDir());
                }, 5);
            }
            if (player.shameCount < 6) {
                setTimeout(() => {
                    place(0, getAttackDir());
                }, 30);
            }
        }
    }
}
let slowHeal = function(aov) {
    setTimeout(() => {
        healer();
    }, 25);
};
let isHealing = false;
let delay = 20;

function uziheal() {
    if (!isHealing && player.health < 100) {
        isHealing = true;
        if (player.health < 70) {
            place(0, getAttackDir());
            healer();
            isHealing = false;
        } else {
            const aox = 5;
            const aoy = Math.ceil((100 - player.health) / 25);
            let aoz = 0;

            function apa() {
                if (aoz < aoy) {
                    setTimeout(() => {
                        place(0, getAttackDir());
                        aoz++;
                        apa();
                    }, aox);
                } else {
                    isHealing = false;
                }
            }
            apa();
        }
    }
}

function predictHeal() {}

function antiSyncHealing(apb) {
    my.antiSync = true;
    let apd = setInterval(() => {
        if (player.shameCount < 6) {
            place(0, getAttackDir());
        }
    }, 75);
    setTimeout(() => {
        clearInterval(apd);
        setTimeout(() => {
            my.antiSync = false;
        }, game.tickRate);
    }, game.tickRate);
}

function biomeGear(apg, aph) {
    if (player.moveDir == undefined && near.dist2 > 300) {
        buyEquip(22, 0);
    }
    if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
        if (aph) {
            return 31;
        }
        buyEquip(31, 0);
    } else if (player.y2 <= config.snowBiomeTop) {
        if (aph) {
            if (enemy && near.dist2 <= 300) {
                return 6;
            } else {
                return 15;
            }
        }
        buyEquip(15, 0);
    } else {
        if (aph) {
            if (enemy && near.dist2 <= 300) {
                return 6;
            } else {
                return 12;
            }
        }
        buyEquip(enemy ? 6 : 12, 0);
    }
    if (aph) {
        return 0;
    }
}

function getPossibleObjDmg(apj) {
    return items.weapons[apj.weapons[apj.weapons[1] ? Number(apj.weapons[1] == 10) : 0]].dmg / 4 * (player.skins[40] ? 3.3 : 1) * (items.weapons[apj.weapons[Number(apj.weapons[1] == 10)]].sDmg || 1);
}
let doStuffPingSet = [];

function smartTick(apl) {
    doStuffPingSet.push(apl);
}
class Combat {
    constructor(apn, apo) {
        this.findSpikeHit = {
            x: 0,
            y: 0,
            spikePosX: 0,
            spikePosY: 0,
            canHit: false,
            spikes: []
        };
        this.spikesNearEnemy = [];
        this.doSpikeHit = function() {
            if (enemy.length) {
                let apr = gameObjects.find(aps => aps.active && aps.name == "pit trap" && aps.isTeamObject(player) && apn.getDistance(aps.x, aps.y, near.x2, near.y2) <= 50);
                let apt = 0.3 + (apo.weapons[player.weapons[0]].knock || 0);
                let apu = Math.atan2(near.y2 - player.y2, near.x2 - player.x2);
                let apv = {
                    x: near.x2 + apt * Math.cos(apu) * 224,
                    y: near.y2 + apt * Math.sin(apu) * 224
                };
                if (near.dist2 < apo.weapons[player.weapons[0]].range + 70 && !apr && near) {
                    this.findSpikeHit.x = apv.x;
                    this.findSpikeHit.y = apv.y;
                }
                this.findSpikeHit.spikes = gameObjects.filter(apw => apw.active && apw.dmg && apw.owner.sid == player.sid && apn.getDistance(apw.x, apw.y, apv.x, apv.y) <= 35 + apw.scale);
                for (let apx = 0; apx < this.findSpikeHit.spikes.length; apx++) {
                    let apy = this.findSpikeHit.spikes[apx];
                    const apz = apn.getDist(player, apy, 0, 0);
                    const aqa = apn.getDist(near, apy, 0, 0);
                    const aqb = apn.getDist(apy, near, 0, 0);
                    if (apz > aqa && aqb < 35 + apy.scale + player.scale && (player.primaryDmg >= 35 && player.skinIndex != 6 || player.primaryDmg >= 51)) {
                        if (apy && !apr && near && near.dist2 <= apo.weapons[player.weapons[0]].range + player.scale * 1.8 && player.reloads[player.weapons[0]] == 0) {
                            this.findSpikeHit.canHit = true;
                            this.findSpikeHit.spikePosX = apy.x;
                            this.findSpikeHit.spikePosY = apy.y;
                            if (this.findSpikeHit.canHit) {
                                instaC.canSpikeTick = true;
                                instaC.syncHit = true;
                                if (getEl("revTick").checked && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
                                    instaC.revTick = true;
                                }
                            }
                            smartTick(() => {
                                smartTick(() => {
                                    this.findSpikeHit.spikePosX = 0;
                                    this.findSpikeHit.spikePosY = 0;
                                    this.findSpikeHit.canHit = false;
                                });
                            });
                        }
                    } else {
                        this.findSpikeHit.spikePosX = 0;
                        this.findSpikeHit.spikePosY = 0;
                        this.findSpikeHit.canHit = false;
                    }
                }
            }
        };
    }
}
let advHeal = [];
let enemyKbSpike = {
    x: null,
    y: null
};
let enemyKbSpike2 = {
    x: null,
    y: null
};
let PrePlaceCount = 0;
class Traps {
    constructor(aqd, aqe) {
        this.dist = 0;
        this.aim = 0;
        this.inTrap = false;
        this.replaced = false;
        this.antiTrapped = false;
        this.info = {};
        this.notFast = function() {
            return player.weapons[1] == 10 && (this.info.health > aqe.weapons[player.weapons[0]].dmg || player.weapons[0] == 5);
        };
        this.testCanPlace = function(aqh, aqi = -(Math.PI / 2), aqj = Math.PI / 2, aqk = Math.PI / 18, aql, aqm, aqn) {
            try {
                let aqp = aqe.list[player.items[aqh]];
                let aqq = player.scale + aqp.scale + (aqp.placeOffset || 0);
                let aqr = {
                    attempts: 0,
                    placed: 0
                };
                let aqs = [];
                gameObjects.forEach(aqt => {
                    aqs.push({
                        x: aqt.x,
                        y: aqt.y,
                        active: aqt.active,
                        blocker: aqt.blocker,
                        scale: aqt.scale,
                        isItem: aqt.isItem,
                        type: aqt.type,
                        colDiv: aqt.colDiv,
                        getScale: function(aqv, aqw) {
                            aqv = aqv || 1;
                            return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : aqv * 0.6) * (aqw ? 1 : this.colDiv);
                        }
                    });
                });
                for (let aqy = aqi; aqy < aqj; aqy += aqk) {
                    aqr.attempts++;
                    let aqz = aql + aqy;
                    let ara = player.x2 + aqq * Math.cos(aqz);
                    let arb = player.y2 + aqq * Math.sin(aqz);
                    let ard = aqs.find(arf => arf.active && aqd.getDistance(ara, arb, arf.x, arf.y) < aqp.scale + (arf.blocker ? arf.blocker : arf.getScale(0.6, arf.isItem)));
                    if (ard) {
                        continue;
                    }
                    if (aqp.id != 19 && arb >= config.mapScale / 2 - config.riverWidth / 2 && arb <= config.mapScale / 2 + config.riverWidth / 2) {
                        continue;
                    }
                    if (!aqm && aqn || useWasd) {
                        if (useWasd ? false : aqn.inTrap) {
                            if (aqd.getAngleDist(near.aim2 + Math.PI, aqz + Math.PI) <= Math.PI) {
                                place(2, aqz, 1);
                            } else if (player.items[4] == 15) {
                                place(4, aqz, 1);
                            }
                        } else if (aqd.getAngleDist(near.aim2, aqz) <= config.gatherAngle / 1.5) {
                            place(2, aqz, 1);
                        } else if (player.items[4] == 15) {
                            place(4, aqz, 1);
                        }
                    } else {
                        place(aqh, aqz, 1);
                    }
                    aqs.push({
                        x: ara,
                        y: arb,
                        active: true,
                        blocker: aqp.blocker,
                        scale: aqp.scale,
                        isItem: true,
                        type: null,
                        colDiv: aqp.colDiv,
                        getScale: function() {
                            return this.scale;
                        }
                    });
                    if (aqd.getAngleDist(near.aim2, aqz) <= 1) {
                        aqr.placed++;
                    }
                }
                if (aqr.placed > 0 && aqm && aqp.dmg) {
                    if (near.dist2 <= aqe.weapons[player.weapons[0]].range + player.scale * 1.8 && configs.spikeTick) {
                        instaC.canSpikeTick = true;
                    }
                }
            } catch (arh) {}
        };
        this.checkSpikeTick = function() {
            try {
                if (![3, 4, 5].includes(near.primaryIndex)) {
                    return false;
                }
                if (getEl("safeAntiSpikeTick").checked || my.autoPush ? false : near.primaryIndex == undefined ? true : near.reloads[near.primaryIndex] > game.tickRate) {
                    return false;
                }
                if (near.dist2 <= aqe.weapons[near.primaryIndex || 5 || 7 || 4 || 0].range + near.scale * 1.8) {
                    buyEquip(26, 0);
                    let arj = aqe.list[9];
                    let ark = near.scale + arj.scale + (arj.placeOffset || 0);
                    let arl = 0;
                    let arm = {
                        attempts: 0,
                        block: "unblocked"
                    };
                    for (let arn = -1; arn <= 1; arn += 0.1) {
                        arm.attempts++;
                        let aro = aqd.getDirect(player, near, 2, 2) + arn;
                        let arp = near.x2 + ark * Math.cos(aro);
                        let arq = near.y2 + ark * Math.sin(aro);
                        let arr = gameObjects.find(ars => ars.active && aqd.getDistance(arp, arq, ars.x, ars.y) < arj.scale + (ars.blocker ? ars.blocker : ars.getScale(0.6, ars.isItem)));
                        if (arr) {
                            continue;
                        }
                        if (arq >= config.mapScale / 2 - config.riverWidth / 2 && arq <= config.mapScale / 2 + config.riverWidth / 2) {
                            continue;
                        }
                        arl++;
                        arm.block = "blocked";
                        break;
                    }
                    if (arl) {
                        my.anti0Tick = 1;
                        healer();
                        buyEquip(6, 0);
                        return true;
                    }
                }
            } catch (art) {
                return null;
            }
            return false;
        };
        this.protect = function(aru) {
            if (!configs.antiTrap) {
                return;
            }
            if (player.items[4]) {
                this.testCanPlace(2, -(Math.PI / 2), Math.PI / 2, Math.PI / 18, aru + Math.PI);
                this.antiTrapped = true;
            }
        };
        this.ReTrap = function() {
            let arx = aqe.weapons[player.weaponIndex].range + 70;
            gameObjects.forEach(ary => {
                if (enemy.length) {
                    let asa = aqd.getDist(ary, player, 0, 2);
                    let asb = aqd.getDirect(ary, player, 0, 2);
                    game.tickBase(() => {
                        if (near.dist2 <= arx && ary.health <= 272.58 && PrePlaceCount < 15 && asd(ary, player) <= arx || near.length && near.reloads[near.weaponIndex] <= config.tickRate * (window.pingTime >= 200 ? 2 : 1) || player.reloads[player.weaponIndex] * 1000 <= config.tickRate * (window.pingTime >= 200 ? 2 : 1)) {
                            place(2, asb);
                        } else if (near.dist2 > arx && ary.health <= 272.58 && PrePlaceCount >= 0 && asd(ary, player) <= arx || near.length && near.reloads[near.weaponIndex] <= config.tickRate * (window.pingTime >= 200 ? 2 : 1) || player.reloads[player.weaponIndex] * 1000 <= config.tickRate * (window.pingTime >= 200 ? 2 : 1)) {}
                    }, 1);
                }
            });
        };

        function ase(asf, asg) {
            try {
                return Math.hypot((asg.y2 || asg.y) - (asf.y2 || asf.y), (asg.x2 || asg.x) - (asf.x2 || asf.x));
            } catch (ash) {
                return Infinity;
            }
        }

        function asi(asj) {
            return Math.sqrt(asj.xVel * asj.xVel + asj.yVel * asj.yVel);
        }

        function asl(asm) {
            return Math.atan2(asm.yVel, asm.xVel);
        }

        function aso() {
            let asq = [];
            for (let asr = 0; asr < 360; asr += 250) {
                asq.push(Math.PI / 180 * asr);
            }
            return asq;
        }
        this.protect = function(ass) {
            if (!getEl("antiTrap").checked) {
                return;
            }
            if (player.items[4] && near.dist2 <= 600) {
                this.testCanPlace(2, -(Math.PI / 2), Math.PI / 2, Math.PI / 18, ass + Math.PI);
                this.antiTrapped = true;
            }
        };
        aqd.deg2rad = function(asu) {
            return asu * (Math.PI / 180);
        };
        this.autoPlace = function() {
            if (secPacket >= 90) {
                return;
            }
            let asw;
            asw = 250;
            const asx = 45;
            const asy = Math.PI / 24;
            if (enemy.length && game.tick % (Math.max(1, parseInt) || 1) === 0) {
                let asz = {
                    inTrap: false
                };
                let ata = gameObjects.find(atb => atb.trap && atb.active && atb.isTeamObject(player) && aqd.getDist(atb, near, 0, 2) <= near.scale + atb.getScale() + 5);
                asz.inTrap = !!ata;
                if (near.dist2 < 500 && near.dist2 > 350) {
                    this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, near.aim2);
                }
                if (near.dist2 <= 300 && (near.dist2 > asw && !asz.inTrap || autoQ)) {
                    if (asz.inTrap && near.dist2 <= 250) {
                        checkPlace(2, near.aim2 + Math.PI);
                    } else if (player.items[4] == 15) {
                        checkPlace(4, near.aim2);
                    }
                } else if (!asz.inTrap && (testMode ? enemy.length : near.dist2 <= asw)) {
                    let atc = aqd.getDirect(near, player, 0, 2);
                    let atd = 70;
                    const ate = asi(near);
                    const atf = asl(near);
                    if (near.dist2 <= asw) {
                        if (player.items[4] == 15) {
                            this.testCanPlace(4, aqd.deg2rad(-90), aqd.deg2rad(90), Math.PI / 24, atc, atd, {
                                inTrap: true,
                                enemyVelocity: ate,
                                enemyDirection: atf
                            });
                        }
                    }
                } else if (asz.inTrap) {
                    let atg = aqd.getDirect(ata, player, 0, 2);
                    let ath = 70;
                    const ati = asi(ata);
                    const atj = asl(ata);
                    if (near.dist2 <= 100) {
                        let atk = Math.random() * Math.PI * 2;
                        this.testCanPlace(2, atk, atk + Math.PI * 2, asy, atg, asx, {
                            inTrap: false,
                            enemyVelocity: ati,
                            enemyDirection: atj
                        });
                    }
                }
            }
        };

        function atl(atm, atn, ato, atp) {
            return Math.atan2(atp - atn, ato - atm);
        }

        function atr(ats) {
            const att = 20;
            return ats.health < att;
        }

        function atu() {
            this.info.health <= aqe.weapons[player.weaponIndex].dmg * config.weaponVariants[tmpObj[(player.weaponIndex < 9 ? "prima" : "seconda") + "ryVariant"]].val * (aqe.weapons[player.weaponIndex].sDmg || 1) * 3.3;
            autoQ = true;
        }

        function asd(atw, atx) {
            return Math.sqrt(Math.pow(atx.y - atw.y, 2) + Math.pow(atx.x - atw.x, 2));
        }
        let atz = false;
        let aua = false;
        var aub = {
            draw3: {
                active: false,
                x: 0,
                y: 0,
                scale: 0
            },
            moveDir: undefined,
            lastPos: {
                x: 0,
                y: 0
            }
        };

        function auc(aud, aue) {
            return {
                x: aue.x - aud.x,
                y: aue.y - aud.y
            };
        }

        function auf(aug, auh) {
            let auj = auc(aug, auh);
            let auk = {
                x: Math.cos(player.dir),
                y: Math.sin(player.dir)
            };
            let aul = auk.x * auj.x + auk.y * auj.y;
            let aum = Math.sqrt(auk.x * auk.x + auk.y * auk.y) * Math.sqrt(auj.x * auj.x + auj.y * auj.y);
            let aun = aul / aum;
            let auo = Math.acos(aun);
            auo *= 180 / Math.PI;
            if (auo < 0) {
                auo += 360;
            }
            return auo;
        }
        let aup = false;

        function auq(aur, aus, aut) {
            const auv = Math.abs(aur - aus * Math.cos(Math.atan2(near.yVel, near.xVel)));
            const auw = 1 - auv / aut;
            return Math.max(0, Math.min(1, auw));
        }
        this.replacer = function(aux) {
            if (!aux || !getEl("autoReplace").checked) {
                return;
            }
            if (!inGame) {
                return;
            }
            if (this.antiTrapped) {
                return;
            }
            this.angles = this.angles || [];
            game.tickBase(() => {
                let ava = aqd.getDirect(aux, player, 0, 2);
                let avb = aqd.getDist(aux, player, 0, 2);
                let avc = Math.PI / 6;
                if (getEl("weaponGrind").checked && avb <= aqe.weapons[player.weaponIndex].range + player.scale) {
                    return;
                }
                if (avb <= 300 && near.dist2 <= 300) {
                    let avd = this.checkSpikeTick();
                    let ave = aqe.weapons[near.primaryIndex || 5].range;
                    if (!avd && (near.dist2 <= ave || traps.inTrap && avb <= 150)) {
                        let avf = Math.atan2(player.y - aux.y, player.x - aux.x);
                        let avh = aqd.getDist(aux, player, 0, 2);
                        let avi = 80;
                        let avj = Math.sqrt(near.xVel * near.xVel + near.yVel * near.yVel);
                        let avk = Math.atan2(near.yVel, near.xVel);
                        let avl = avf + avj * Math.cos(avk);
                        let avm = avh + avj * Math.sin(avk);
                        this.angles.push(avl);
                        if (this.angles.length > 5) {
                            this.angles.shift();
                        }
                        let avn = this.angles.reduce((avo, avp) => avo + avp, 0) / this.angles.length;
                        avn += avc;
                        let avq = Math.PI / 24 * Math.sin(Date.now() / 1000);
                        let avr = avn + avq;
                        this.testCanPlace(2, avr, avr + Math.PI * 2, Math.PI / 24, ava, avi);
                    } else if (player.items[4] === 15 || near.dist2 <= 100) {
                        let avs = Math.atan2(player.y - aux.y, player.x - aux.x);
                        let avt = aqd.getDist(aux, player, 0, 2);
                        let avu = 70;
                        let avv = Math.sqrt(near.xVel * near.xVel + near.yVel * near.yVel);
                        let avw = Math.atan2(near.yVel, near.xVel);
                        let avx = avs + avv * Math.cos(avw);
                        let avy = avt + avv * Math.sin(avw);
                        this.angles.push(avx);
                        if (this.angles.length > 5) {
                            this.angles.shift();
                        }
                        let avz = this.angles.reduce((awa, awb) => awa + awb, 0) / this.angles.length;
                        avz += avc;
                        let awc = avz + Math.PI;
                        if (player.items[4] == 15) {
                            this.testCanPlace(4, awc, awc + Math.PI * 2, Math.PI / 24, ava, avu);
                        }
                    }
                }
                let awd = [];
                gameObjects.forEach(awe => {
                    if (awe.dmg === true && awe.isTeamObj(player)) {
                        awd.push(awe);
                    }
                });
                if (aua) {
                    if (player.items[4] == 15) {
                        this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, ava, 1);
                    }
                    aua = false;
                }
                let awg = false;
                awd.forEach(awh => {
                    if (aqd.getDist(awh, player, 0, 2) <= 200) {
                        let awj = Math.atan2(awh.y2 - player.y2, awh.x2 - player.x2);
                        let awk = Math.atan2(near.y2 - awh.y2, near.x2 - awh.x2);
                        let awl = aqd.nearestAngle(awj, awk);
                        let awm = 87;
                        let awn = player.x2 + awm * Math.cos(awl);
                        let awo = player.y2 + awm * Math.sin(awl);
                        let awp = aqd.getDist(near, {
                            x2: awn,
                            y2: awo
                        }, 0, 2);
                        if (aqd.getDist(aux, near, 0, 2) <= 87 && awp > 1 + awm) {
                            place(2, awl);
                            awg = true;
                        }
                    }
                });
                if (!awg) {
                    if (near.dist2 <= 250 && !atz) {
                        for (let awq = 0; awq < 24; awq += 2) {
                            let awr = Math.PI * 2 * awq / 24;
                            this.testCanPlace(2, awr, awr + Math.PI / 24, Math.PI / 24, ava, 1);
                            aua = true;
                            break;
                        }
                    }
                    if (avb <= 250 && near.dist2 <= 250) {
                        let aws = this.checkSpikeTick();
                        if (!aws && near.dist3 <= aqe.weapons[near.primaryIndex || 5 || 7 || 4 || 0].range + near.scale * 1.8) {
                            for (let awt = 0; awt < 24; awt += 2) {
                                let awu = Math.PI * 2 * awt / 24;
                                this.testCanPlace(2, awu, awu + Math.PI / 24, Math.PI / 24, ava, 1);
                                this.testCanPlace(2, Math.PI / 2, Math.PI / 2, Math.PI / 2, near, ava, 1);
                                atz = true;
                                break;
                            }
                        } else if (player.items[4] == 15) {
                            this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, ava, 1);
                        }
                        this.replaced = true;
                    }
                }
            }, 1);
        };
        this.replacer = function(awv) {
            const awx = gameObjects.filter(awy => awy.trap && awy.active).sort((awz, axa) => aqd.getDist(awz, near, 0, 2) - aqd.getDist(axa, near, 0, 2)).find(axb => {
                const axd = Math.hypot(axb.y - near.y2, axb.x - near.x2);
                return axb !== player && (player.sid === axb.owner.sid || findAllianceBySid(axb.owner.sid)) && axd <= 50;
            });
            if (!awv || !configs.autoReplace) {
                return;
            }
            if (!inGame) {
                return;
            }
            if (this.antiTrapped) {
                return;
            }
            if (axf <= aqe.weapons[player.weaponIndex].range + player.scale) {
                return;
            }
            let axf = aqd.getDist(awv, player, 0, 2);
            let axg = aqd.getDirect(awv, player, 0, 2);
            if (axf <= 400 && near.dist2 <= 400) {
                if (near.dist2 < 250) {
                    for (let axh = 0; axh < Math.PI * 2; axh += Math.PI / 9) {
                        checkPlace(2, near.aim2 + axh);
                    }
                } else {
                    for (let axi = 0; axi < Math.PI * 2; axi += Math.PI / 9) {
                        checkPlace(4, near.aim2 + axi);
                    }
                }
                this.replaced = true;
            }
        };
    }
};

class Instakill {
    constructor() {
        this.wait = false;
        this.can = false;
        this.isTrue = false;
        this.nobull = false;
        this.ticking = false;
        this.canSpikeTick = false;
        this.canSpikeSync = false;
        this.startTick = false;
        this.readyTick = false;
        this.canCounter = false;
        this.revTick = false;
        this.syncHit = false;
        this.changeType = function(axk) {
            this.wait = false;
            this.isTrue = true;
            my.autoAim = true;
            let axm = [axk];
            let axn = near.backupNobull;
            near.backupNobull = false;
            if (axk == "rev") {
                healer1();
                selectWeapon(player.weapons[1]);
                buyEquip(53, 0);
                sendAutoGather();
                setTimeout(() => {
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    setTimeout(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 225);
                }, 100);
            } else if (axk == "nobull") {
                selectWeapon(player.weapons[0]);
                healer1();
                buyEquip(7, 0);
                sendAutoGather();
                setTimeout(() => {
                    selectWeapon(player.weapons[1]);
                    buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                    setTimeout(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 255);
                }, 105);
            } else if (axk == "normal") {
                selectWeapon(player.weapons[0]);
                healer1();
                buyEquip(7, 0);
                sendAutoGather();
                game.tickBase(() => {
                    selectWeapon(player.weapons[1]);
                    buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                    setTimeout(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 100);
                }, 1);
            } else {
                setTimeout(() => {
                    this.isTrue = false;
                    my.autoAim = false;
                }, 50);
            }
        };
        this.syncTry = function() {
            if (getEl("synctype").value == "rangesync") {
                buyEquip(53, 0);
                game.tickBase(() => {
                    this.isTrue = true;
                    my.autoAim = true;
                    selectWeapon(player.weapons[1]);
                    sendAutoGather();
                    game.tickBase(() => {
                        my.autoAim = false;
                        this.isTrue = false;
                        sendAutoGather();
                    }, 1);
                }, 2);
            } else if (getEl("synctype").value == "instasync") {
                return "insta them";
            } else {
                this.isTrue = true;
                my.autoAim = true;
                selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                buyEquip(21, 1);
                sendAutoGather();
                game.tickBase(() => {
                    if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                        selectWeapon(player.weapons[0]);
                        buyEquip(53, 0);
                        buyEquip(21, 1);
                        game.tickBase(() => {
                            sendAutoGather();
                            this.isTrue = false;
                            my.autoAim = false;
                        }, 1);
                    } else {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }
                }, 1);
            };
        };
        this.spikeTickType = function() {
            this.isTrue = true;
            my.autoAim = true;
            selectWeapon(player.weapons[0]);
            buyEquip(7, 0);
            buyEquip(21, 1);
            sendAutoGather();
            game.tickBase(() => {
                if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                    selectWeapon(player.weapons[0]);
                    buyEquip(53, 0);
                    buyEquip(21, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                } else {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }
            }, 1);
        };
        this.counterType = function() {
            this.isTrue = true;
            my.autoAim = true;
            selectWeapon(player.weapons[0]);
            buyEquip(7, 0);
            buyEquip(21, 1);
            sendAutoGather();
            game.tickBase(() => {
                if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                    selectWeapon(player.weapons[0]);
                    buyEquip(53, 0);
                    buyEquip(21, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                } else {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                }
            }, 1);
        };
        this.oneTickType = function() {
            this.isTrue = true;
            my.autoAim = true;
            selectWeapon(player.weapons[1]);
            buyEquip(53, 0);
            packet("9", near.aim2, 1);
            if (player.weapons[1] == 15) {
                my.revAim = true;
                sendAutoGather();
            }
            game.tickBase(() => {
                my.revAim = false;
                selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                buyEquip(19, 1);
                packet("9", near.aim2, 1);
                if (player.weapons[1] != 15) {
                    sendAutoGather();
                }
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                    packet("9", undefined, 1);
                }, 1);
            }, 1);
        };
        this.gotoGoal = function(ayj, ayk) {
            let aym = ayn => ayn * config.playerScale;
            let ayo = {
                a: ayj - ayk,
                b: ayj + ayk,
                c: ayj - aym(1),
                d: ayj + aym(1),
                e: ayj - aym(2),
                f: ayj + aym(2),
                g: ayj - aym(4),
                h: ayj + aym(4)
            };
            let ayp = function(ayq, ayr) {
                if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2 && ayr == 0) {
                    buyEquip(31, 0);
                } else {
                    buyEquip(ayq, ayr);
                }
            };
            if (enemy.length) {
                let ayt = near.dist2;
                this.ticking = true;
                if (ayt >= ayo.a && ayt <= ayo.b) {
                    ayp(22, 0);
                    ayp(11, 1);
                    if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                    }
                    return {
                        dir: undefined,
                        action: 1
                    };
                } else {
                    if (ayt < ayo.a) {
                        if (ayt >= ayo.g) {
                            if (ayt >= ayo.e) {
                                if (ayt >= ayo.c) {
                                    ayp(40, 0);
                                    ayp(21, 1);
                                    if (getEl("slowOT").checked) {
                                        if (player.buildIndex != player.items[1]) {
                                            selectToBuild(player.items[1]);
                                        }
                                    } else if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                } else {
                                    ayp(26, 0);
                                    ayp(21, 1);
                                    if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                }
                            } else {
                                ayp(26, 0);
                                ayp(12, 1);
                                if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                }
                            }
                        } else {
                            biomeGear();
                            ayp(11, 1);
                            if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            }
                        }
                        return {
                            dir: near.aim2 + Math.PI,
                            action: 0
                        };
                    } else if (ayt > ayo.b) {
                        if (ayt <= ayo.h) {
                            if (ayt <= ayo.f) {
                                if (ayt <= ayo.d) {
                                    ayp(40, 0);
                                    ayp(9, 1);
                                    if (getEl("slowOT").checked) {
                                        if (player.buildIndex != player.items[1]) {
                                            selectToBuild(player.items[1]);
                                        }
                                    } else if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                } else {
                                    ayp(22, 0);
                                    ayp(19, 1);
                                    if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                    }
                                }
                            } else {
                                ayp(6, 0);
                                ayp(12, 1);
                                if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                }
                            }
                        } else {
                            biomeGear();
                            ayp(19, 1);
                            if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            }
                        }
                        return {
                            dir: near.aim2,
                            action: 0
                        };
                    }
                    return {
                        dir: undefined,
                        action: 0
                    };
                }
            } else {
                this.ticking = false;
                return {
                    dir: undefined,
                    action: 0
                };
            }
        };
        this.bowMovement = function() {
            let ayv = this.gotoGoal(685, 3);
            if (ayv.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.rangeType("ageInsta");
                } else {
                    packet("9", ayv.dir, 1);
                }
            } else {
                packet("9", ayv.dir, 1);
            }
        };
        this.tickMovement = function() {
            let ayx = this.gotoGoal([10, 14].includes(player.weapons[1]) && player.y2 > config.snowBiomeTop ? 240 : player.weapons[1] == 15 ? 250 : player.y2 <= config.snowBiomeTop ? [10, 14].includes(player.weapons[1]) ? 270 : 265 : 275, 3);
            if (ayx.action) {
                if (![6, 22].includes(near.skinIndex) && player.reloads[53] == 0 && !this.isTrue) {
                    if ([10, 14].includes(player.weapons[1]) && player.y2 > config.snowBiomeTop || player.weapons[1] == 15) {
                        this.oneTickType();
                    } else {
                        this.threeOneTickType();
                    }
                } else {
                    packet("9", ayx.dir, 1);
                }
            } else {
                packet("9", ayx.dir, 1);
            }
        };
        this.kmTickMovement = function() {
            let ayz = this.gotoGoal(240, 3);
            if (ayz.action) {
                if (near.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && (game.tick - near.poisonTick) % config.serverUpdateRate == 8) {
                    this.kmTickType();
                } else {
                    packet("9", ayz.dir, 1);
                }
            } else {
                packet("9", ayz.dir, 1);
            }
        };
        this.boostTickMovement = function() {
            let azb = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 390 : player.weapons[1] == 15 ? 365 : 370;
            let azc = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1.5 : player.weapons[1] == 15 ? 2 : 3;
            let azd = this.gotoGoal(azb, azc);
            if (azd.action) {
                if (player.reloads[53] == 0 && !this.isTrue) {
                    this.boostTickType();
                } else {
                    packet("9", azd.dir, 1);
                }
            } else {
                packet("9", azd.dir, 1);
            }
        };
        this.perfCheck = function(aze, azf) {
            if (azf.weaponIndex == 11 && UTILS.getAngleDist(azf.aim2 + Math.PI, azf.d2) <= config.shieldAngle) {
                return false;
            }
            if (![9, 12, 13, 15].includes(player.weapons[1])) {
                return true;
            }
            let azh = {
                x: azf.x2 + Math.cos(azf.aim2 + Math.PI) * 70,
                y: azf.y2 + Math.sin(azf.aim2 + Math.PI) * 70
            };
            if (UTILS.lineInRect(aze.x2 - aze.scale, aze.y2 - aze.scale, aze.x2 + aze.scale, aze.y2 + aze.scale, azh.x, azh.y, azh.x, azh.y)) {
                return true;
            }
            let azi = ais.filter(azj => azj.visible).find(azk => {
                if (UTILS.lineInRect(azk.x2 - azk.scale, azk.y2 - azk.scale, azk.x2 + azk.scale, azk.y2 + azk.scale, azh.x, azh.y, azh.x, azh.y)) {
                    return true;
                }
            });
            if (azi) {
                return false;
            }
            azi = gameObjects.filter(azm => azm.active).find(azn => {
                let azp = azn.getScale();
                if (!azn.ignoreCollision && UTILS.lineInRect(azn.x - azp, azn.y - azp, azn.x + azp, azn.y + azp, azh.x, azh.y, azh.x, azh.y)) {
                    return true;
                }
            });
            if (azi) {
                return false;
            }
            return true;
        };
    }
};
class Autobuy {
    constructor(azq, azr) {
        this.hat = function() {
            azq.forEach(azu => {
                let azw = findID(hats, azu);
                if (azw && !player.skins[azu] && player.points >= azw.price) {
                    packet("c", 1, azu, 0);
                }
            });
        };
        this.acc = function() {
            azr.forEach(azy => {
                let baa = findID(accessories, azy);
                if (baa && !player.tails[azy] && player.points >= baa.price) {
                    packet("c", 1, azy, 1);
                }
            });
        };
    }
};
class Autoupgrade {
    constructor() {
        this.sb = function(bab) {
            bab(3);
            bab(17);
            bab(31);
            bab(23);
            bab(9);
            bab(38);
        };
        this.kh = function(bac) {
            bac(3);
            bac(17);
            bac(31);
            bac(23);
            bac(10);
            bac(38);
            bac(4);
            bac(25);
        };
        this.pb = function(bae) {
            bae(5);
            bae(17);
            bae(32);
            bae(23);
            bae(9);
            bae(38);
        };
        this.ph = function(baf) {
            baf(5);
            baf(17);
            baf(32);
            baf(23);
            baf(10);
            baf(38);
            baf(28);
            baf(25);
        };
        this.db = function(bag) {
            bag(7);
            bag(17);
            bag(31);
            bag(23);
            bag(9);
            bag(34);
        };
        this.km = function(bah) {
            bah(7);
            bah(17);
            bah(31);
            bah(23);
            bah(10);
            bah(38);
            bah(4);
            bah(15);
        };
    }
};
class Damages {
    constructor(bai) {
        this.calcDmg = function(bak, bal) {
            return bak * bal;
        };
        this.getAllDamage = function(bam) {
            return [this.calcDmg(bam, 0.75), bam, this.calcDmg(bam, 1.125), this.calcDmg(bam, 1.5)];
        };
        this.weapons = [];
        for (let bao = 0; bao < bai.weapons.length; bao++) {
            let bap = bai.weapons[bao];
            let baq = bap.name.split(" ").length <= 1 ? bap.name : bap.name.split(" ")[0] + "_" + bap.name.split(" ")[1];
            this.weapons.push(this.getAllDamage(bao > 8 ? bap.Pdmg : bap.dmg));
            this[baq] = this.weapons[bao];
        }
    }
}
let tmpList = [];
let UTILS = new Utils();
let items = new Items();
let objectManager = new Objectmanager(GameObject, gameObjects, UTILS, config);
let store = new Store();
let hats = store.hats;
let accessories = store.accessories;
let projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
let aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
let textManager = new Textmanager();
let traps = new Traps(UTILS, items);
let instaC = new Instakill();
let sCombat = new Combat(UTILS, items);
let autoBuy = new Autobuy([40, 6, 7, 22, 53, 15, 31], [11, 19, 21, 13]);
let autoUpgrade = new Autoupgrade();
let lastDeath;
let minimapData;
let mapMarker = {};
let mapPings = [];
let tmpPing;
let breakTrackers = [];
let pathFindTest = 0;
let grid = [];
let pathFind = {
    active: false,
    grid: 40,
    scale: 1440,
    x: 14400,
    y: 14400,
    chaseNear: false,
    array: [],
    lastX: this.grid / 2,
    lastY: this.grid / 2
};

function sendChat(bar) {
    packet("6", bar.slice(0, 30));
}
let runAtNextTick = [];

function checkProjectileHolder(bas, bau, bav, baw, bax, bay, baz, bba) {
    let bbc = bay == 0 ? 9 : bay == 2 ? 12 : bay == 3 ? 13 : bay == 5 && 15;
    let bbd = config.playerScale * 2;
    let bbe = {
        x: bay == 1 ? bas : bas - bbd * Math.cos(bav),
        y: bay == 1 ? bau : bau - bbd * Math.sin(bav)
    };
    let bbf = players.filter(bbg => bbg.visible && UTILS.getDist(bbe, bbg, 0, 2) <= bbg.scale).sort(function(bbh, bbi) {
        return UTILS.getDist(bbe, bbh, 0, 2) - UTILS.getDist(bbe, bbi, 0, 2);
    })[0];
    if (bbf) {
        if (bay == 1) {
            bbf.shooting[53] = 1;
        } else {
            bbf.shootIndex = bbc;
            bbf.shooting[1] = 1;
            antiProj(bbf, bav, baw, bax, bay, bbc);
        }
    }
}
let projectileCount = 0;

function antiProj(bbk, bbl, bbm, bbn, bbo, bbp) {
    if (!bbk.isTeam(player)) {
        tmpDir = UTILS.getDirect(player, bbk, 2, 2);
        if (UTILS.getAngleDist(tmpDir, bbl) <= 0.2) {
            bbk.bowThreat[bbp]++;
            if (bbo == 5) {
                projectileCount++;
            }
            setTimeout(() => {
                bbk.bowThreat[bbp]--;
                if (bbo == 5) {
                    projectileCount--;
                }
            }, bbm / bbn);
            if (bbk.bowThreat[9] >= 1 && (bbk.bowThreat[12] >= 1 || bbk.bowThreat[15] >= 1)) {
                place(1, bbk.aim2);
                my.anti0Tick = 4;
                if (!my.antiSync) {
                    antiSyncHealing(4);
                }
            } else if (projectileCount >= 2) {
                place(1, bbk.aim2);
                healer();
                buyEquip(22, 0);
                buyEquip(13, 1);
                my.anti0Tick = 4;
                if (!my.antiSync) {
                    autoQ = true;
                    antiSyncHealing(4);
                }
            } else if (projectileCount === 1) {
                buyEquip(6, 0);
                buyEquip(26, 0);
                healer();
                game.tickBase(() => {}, 2);
            }
        }
    }
}

function showItemInfo(bbr, bbs, bbt) {
    if (player && bbr) {
        UTILS.removeAllChildren(itemInfoHolder);
        itemInfoHolder.classList.add("visible");
        UTILS.generateElement({
            id: "itemInfoName",
            text: UTILS.capitalizeFirst(bbr.name),
            parent: itemInfoHolder
        });
        UTILS.generateElement({
            id: "itemInfoDesc",
            text: bbr.desc,
            parent: itemInfoHolder
        });
        if (bbt) {} else if (bbs) {
            UTILS.generateElement({
                class: "itemInfoReq",
                text: !bbr.type ? "primary" : "secondary",
                parent: itemInfoHolder
            });
        } else {
            for (let bbv = 0; bbv < bbr.req.length; bbv += 2) {
                UTILS.generateElement({
                    class: "itemInfoReq",
                    html: bbr.req[bbv] + "<span class='itemInfoReqVal'> x" + bbr.req[bbv + 1] + "</span>",
                    parent: itemInfoHolder
                });
            }
            if (bbr.group.limit) {
                UTILS.generateElement({
                    class: "itemInfoLmt",
                    text: (player.itemCounts[bbr.group.id] || 0) + "/" + (config.isSandbox ? 99 : bbr.group.limit),
                    parent: itemInfoHolder
                });
            }
        }
    } else {
        itemInfoHolder.classList.remove("visible");
    }
}
window.addEventListener("resize", UTILS.checkTrusted(resize));

function resize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    let bbx = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
    gameCanvas.width = screenWidth * pixelDensity;
    gameCanvas.height = screenHeight * pixelDensity;
    gameCanvas.style.width = screenWidth + "px";
    gameCanvas.style.height = screenHeight + "px";
    mainContext.setTransform(bbx, 0, 0, bbx, (screenWidth * pixelDensity - maxScreenWidth * bbx) / 2, (screenHeight * pixelDensity - maxScreenHeight * bbx) / 2);
}
resize();
var usingTouch;
const mals = document.getElementById("touch-controls-fullscreen");
mals.style.display = "block";
mals.addEventListener("mousemove", gameInput, false);

function gameInput(bby) {
    mouseX = bby.clientX;
    mouseY = bby.clientY;
}
let clicks = {
    left: false,
    middle: false,
    right: false
};
mals.addEventListener("mousedown", mouseDown, false);

function mouseDown(bca) {
    if (attackState != 1) {
        attackState = 1;
        if (bca.button == 0) {
            my.autoAim = true;
            clicks.left = true;
        } else if (bca.button == 1) {
            clicks.middle = true;
        } else if (bca.button == 2) {
            clicks.right = true;
        }
    }
}
mals.addEventListener("mouseup", UTILS.checkTrusted(mouseUp));

function mouseUp(bcc) {
    if (attackState != 0) {
        attackState = 0;
        if (bcc.button == 0) {
            my.autoAim = false;
            clicks.left = false;
        } else if (bcc.button == 1) {
            clicks.middle = false;
        } else if (bcc.button == 2) {
            clicks.right = false;
        }
    }
}
mals.addEventListener("wheel", wheel, false);

function wheel(bce) {
    if (player.shameCount > 1 && !near) {
        buyEquip(7, 0);
    } else {
        buyEquip(6, 0);
    }
}

function getMoveDir() {
    let bch = 0;
    let bci = 0;
    for (let bcj in moveKeys) {
        let bck = moveKeys[bcj];
        bch += !!keys[bcj] * bck[0];
        bci += !!keys[bcj] * bck[1];
    }
    if (bch == 0 && bci == 0) {
        return undefined;
    } else {
        return Math.atan2(bci, bch);
    }
}

function getSafeDir() {
    if (!player) {
        return 0;
    }
    if (!player.lockDir) {
        lastDir = Math.atan2(mouseY - screenHeight / 2, mouseX - screenWidth / 2);
    }
    return lastDir || 0;
}

function getAttackDir(bcl) {
    if (bcl) {
        if (!player) {
            return "0";
        }
        if (my.autoAim || (clicks.left || useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) && player.reloads[player.weapons[0]] == 0) {
            lastDir = getEl("weaponGrind").checked ? "getSafeDir()" : enemy.length ? my.revAim ? "(near.aim2 + Math.PI)" : "near.aim2" : "getSafeDir()";
        } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
            lastDir = "getSafeDir()";
        } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
            lastDir = "traps.aim";
        } else if (!player.lockDir) {
            if (getEl("noDir").checked) {
                return "undefined";
            }
            lastDir = "getSafeDir()";
        }
        return lastDir;
    } else {
        if (!player) {
            return 0;
        }
        if (my.autoAim || (clicks.left || useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) && player.reloads[player.weapons[0]] == 0) {
            lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? near.aim2 + Math.PI : near.aim2 : getSafeDir();
        } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
            lastDir = getSafeDir();
        } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
            lastDir = traps.aim;
        } else if (!player.lockDir) {
            if (getEl("noDir").checked) {
                return undefined;
            }
            lastDir = getSafeDir();
        }
        return lastDir || 0;
    }
}

function getVisualDir() {
    if (!player) {
        return 0;
    }
    if (my.autoAim || (clicks.left || useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) && player.reloads[player.weapons[0]] == 0) {
        lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? near.aim2 + Math.PI : near.aim2 : getSafeDir();
    } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
        lastDir = getSafeDir();
    } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
        lastDir = traps.aim;
    } else if (!player.lockDir) {
        lastDir = getSafeDir();
    }
    return lastDir || 0;
}

function keysActive() {
    return allianceMenu.style.display != "block" && chatHolder.style.display != "block" && !menuCBFocus;
}

function toggleMenuChat() {
    if (menuChatDiv.style.display != "none") {
        let bcq = function(bcr) {
            return {
                found: bcr.startsWith("/") && commands[bcr.slice(1).split(" ")[0]]
            };
        };
        let bct = bcq(menuChatBox.value);
        if (bct.found) {
            if (typeof bct.fv.action === "function") {
                bct.fv.action(menuChatBox.value);
            }
        } else {
            sendChat(menuChatBox.value);
        }
        menuChatBox.value = "";
        menuChatBox.blur();
    } else if (menuCBFocus) {
        menuChatBox.blur();
    } else {
        menuChatBox.focus();
    }
}

function keyDown(bcu) {
    let bcw = bcu.which || bcu.keyCode || 0;
    if (player && player.alive && keysActive()) {
        if (!keys[bcw]) {
            keys[bcw] = 1;
            macro[bcu.key] = 1;
            if (bcw == 27) {
                openMenu = !openMenu;
                $("#menuDiv").toggle();
                $("#menuChatDiv").toggle();
            } else if (bcw == 69) {
                sendAutoGather();
            } else if (bcw == 67) {
                updateMapMarker();
            } else if (player.weapons[bcw - 49] != undefined) {
                player.weaponCode = player.weapons[bcw - 49];
            } else if (moveKeys[bcw]) {
                sendMoveDir();
            } else if (bcu.key == "m") {
                pads.placeSpawnPads = !pads.placeSpawnPads;
            } else if (bcu.key == "z") {
                mills.place = !mills.place;
            } else if (bcu.key == "Z") {
                if (typeof window.debug == "function") {
                    window.debug();
                }
            } else if (bcw == 32) {
                packet("F", 1, getSafeDir(), 1);
                packet("F", 0, getSafeDir(), 1);
            } else if (bcu.key == ",") {
                project.send(JSON.stringify(["tezt", "ratio"]));
                for (let bcx = 0; bcx < botz.length; bcx++) {
                    if (botz[bcx][0]) {
                        botz[bcx][0].zync(near);
                        console.log(botz[bcx][0]);
                    }
                    project.send("tezt");
                    botSkts.forEach(bcy => {
                        bcy.zync();
                    });
                    io.send("S", 1);
                }
            }
        }
    }
}
let intervalId;
document.addEventListener("keydown", function(bda) {
    if (["allianceinput", "chatbox", "nameinput", "storeHolder"].includes(document.activeElement.id.toLowerCase())) {
        return null;
    }
    if (bda.key === "p") {
        songChat = !songChat;
        if (songChat) {
            playSongLyrics();
        }
    }
});

function oneTick() {
    my.autoAim = true;
    buyEquip(53, 0);
    selectWeapon(player.weapons[0]);
    game.tickBase(() => {
        buyEquip(7, 0);
        sendAutoGather();
        game.tickBase(() => {
            sendAutoGather();
            my.autoAim = false;
        }, 1);
    }, 1);
}
let songChat = false;
const lyrics = [{
    line: "I have fallen down from space",
    delay: 0
}, {
    line: "Moon is having Fun tonight!",
    delay: 3000
}, {
    line: "I'm just a Gen Z",
    delay: 2000
}, {
    line: "i just want some vacation",
    delay: 3000
}, {
    line: "Bro I aint quitting trying",
    delay: 2000
}, {
    line: "By your side",
    delay: 2000
}, {
    line: "Moon's dick got sucked",
    delay: 2000
}, {
    line: "I wonder how did it happen",
    delay: 1000
}, {
    line: "Wait what the fuck",
    delay: 6000
}, {
    line: "Did I just...",
    delay: 2000
}, {
    line: "Yea Fuck this its even",
    delay: 2000
}, {
    line: "My darling, cmon",
    delay: 1500
}, {
    line: "lettme kill",
    delay: 2000
}, {
    line: "That Chick just ate all semen",
    delay: 3000
}, {
    line: "Holy Moon is such a Demon",
    delay: 2000
}, {
    line: "Anyways heres som free ramen",
    delay: 2000
}, {
    line: "That's semen u dum dum",
    delay: 2500
}, {
    line: "I came",
    delay: 2000
}, {
    line: "But do u like it tho?",
    delay: 7000
}, {
    line: "The knife twists",
    delay: 2500
}, {
    line: "at the thought",
    delay: 2000
}, {
    line: "That I should fall short",
    delay: 2500
}, {
    line: "of the mark",
    delay: 2000
}, {
    line: "Frightened by the bite",
    delay: 3000
}, {
    line: "Though it's no harsher",
    delay: 2500
}, {
    line: "How did it taste?",
    delay: 2000
}, {
    line: "A middle of adventure",
    delay: 4000
}, {
    line: "Such a perfect place",
    delay: 4000
}, {
    line: "Salty?",
    delay: 2000
}, {
    line: "I have fallen down from space",
    delay: 7000
}, {
    line: "We will rise again!!!!!",
    delay: 3000
}, {
    line: "I'm just a Gen Z",
    delay: 2000
}, {
    line: "i just want some vacation",
    delay: 3000
}, {
    line: "Wait what spicy?",
    delay: 2000
}, {
    line: "By your side",
    delay: 2000
}, {
    line: "With your hands",
    delay: 2000
}, {
    line: "How did it happen?",
    delay: 1000
}, {
    line: "But I crumble completely",
    delay: 12000
}, {
    line: "Oh I just ate som burrito",
    delay: 2500
}, {
    line: "She is a good fuck fr",
    delay: 4000
}, {
    line: "You've had to greet me",
    delay: 2000
}, {
    line: "with goodbye",
    delay: 2000
}, {
    line: "I'm always just about to",
    delay: 3000
}, {
    line: "Go and spoil a surprise",
    delay: 2000
}, {
    line: "Take my hands off",
    delay: 3000
}, {
    line: "My bad xDxD",
    delay: 2000
}, {
    line: "So I fuck GenZs",
    delay: 2000
}, {
    line: "I'll eat some pineapple ;)",
    delay: 7000
}, {
    line: "We will rise again!!!!!",
    delay: 3000
}, {
    line: "I'm just a Gen Z",
    delay: 2000
}, {
    line: "i just want some vacation",
    delay: 3000
}, {
    line: "To be continued...",
    delay: 2000
}, {
    line: "By your side",
    delay: 2000
}, {
    line: "With your hands",
    delay: 2000
}, {
    line: "I bet she had a nice ass",
    delay: 1000
}];

function playSongLyrics() {
    let bdg = 0;
    for (let bdh = 0; bdh < lyrics.length; bdh++) {
        const {
            line: bdi,
            delay: bdj
        } = lyrics[bdh];
        bdg += bdj;
        setTimeout(() => {
            if (songChat) {
                sendChat(bdi);
            }
        }, bdg);
    }
}
addEventListener("keydown", UTILS.checkTrusted(keyDown));

function keyUp(bdk) {
    if (player && player.alive) {
        let bdm = bdk.which || bdk.keyCode || 0;
        if (bdm == 13) {
            toggleMenuChat();
        } else if (keysActive()) {
            if (keys[bdm]) {
                keys[bdm] = 0;
                macro[bdk.key] = 0;
                if (moveKeys[bdm]) {
                    sendMoveDir();
                } else if (bdk.key == ",") {
                    player.sync = false;
                }
            }
        }
    }
}
window.addEventListener("keyup", UTILS.checkTrusted(keyUp));

function sendMoveDir() {
    if (found) {
        packet("9", undefined, 1);
    } else {
        let bdo = getMoveDir();
        if (lastMoveDir == undefined || bdo == undefined || Math.abs(bdo - lastMoveDir) > 0.3) {
            if (!my.autoPush && !found) {
                packet("9", bdo, 1);
            }
            lastMoveDir = bdo;
        }
    }
}

function bindEvents() {}
bindEvents();

function chechPathColl(bdp) {
    return (player.scale + bdp.getScale()) / (player.maxSpeed * items.weapons[player.weaponIndex].spdMult) + (bdp.dmg && !bdp.isTeamObject(player) ? 35 : 0);
    if (bdp.colDiv == 0.5) {
        return bdp.scale * bdp.colDiv;
    } else if (!bdp.isTeamObject(player) && bdp.dmg) {
        return bdp.scale + player.scale;
    } else if (bdp.isTeamObject(player) && bdp.trap) {
        return 0;
    } else {
        return bdp.scale;
    }
}

function checkObject() {
    let bds = gameObjects.filter(bdt => player.canSee(bdt) && bdt.active);
    for (let bdu = 0; bdu < pathFind.grid; bdu++) {
        grid[bdu] = [];
        for (let bdv = 0; bdv < pathFind.grid; bdv++) {
            let bdw = {
                x: player.x2 - pathFind.scale / 2 + pathFind.scale / pathFind.grid * bdv,
                y: player.y2 - pathFind.scale / 2 + pathFind.scale / pathFind.grid * bdu
            };
            if (UTILS.getDist(pathFind.chaseNear ? near : pathFind, bdw, pathFind.chaseNear ? 2 : 0, 0) <= (pathFind.chaseNear ? 35 : 60)) {
                pathFind.lastX = bdv;
                pathFind.lastY = bdu;
                grid[bdu][bdv] = 0;
                continue;
            }
            let bdx = bds.find(bdy => UTILS.getDist(bdy, bdw, 0, 0) <= chechPathColl(bdy));
            if (bdx) {
                if (bdx.trap) {
                    grid[bdu][bdv] = 0;
                    continue;
                }
                grid[bdu][bdv] = 1;
            } else {
                grid[bdu][bdv] = 0;
            }
        }
    }
}

function createPath() {
    grid = [];
    checkObject();
}

function Pathfinder() {
    pathFind.scale = config.maxScreenWidth / 2 * 1.3;
    if (!traps.inTrap && (pathFind.chaseNear ? enemy.length : true)) {
        if (near.dist2 <= items.weapons[player.weapons[0]].range) {
            packet("9", undefined, 1);
        } else {
            createPath();
            easystar.setGrid(grid);
            easystar.setAcceptableTiles([0]);
            easystar.enableDiagonals();
            easystar.findPath(grid[0].length / 2, grid.length / 2, pathFind.lastX, pathFind.lastY, function(beg) {
                if (beg === null) {
                    pathFind.array = [];
                    if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                        packet("9", undefined, 1);
                    } else {
                        packet("9", near.aim2, 1);
                    }
                } else {
                    pathFind.array = beg;
                    if (pathFind.array.length > 1) {
                        let bei = {
                            x: player.x2 - pathFind.scale / 2 + pathFind.scale / pathFind.grid * beg[1].x,
                            y: player.y2 - pathFind.scale / 2 + pathFind.scale / pathFind.grid * beg[1].y
                        };
                        packet("9", UTILS.getDirect(bei, player, 0, 2), 1);
                    }
                }
            });
            easystar.calculate();
        }
    }
}
let isItemSetted = [];

function updateItemCountDisplay(bej = undefined) {
    for (let bel = 3; bel < items.list.length; ++bel) {
        let bem = items.list[bel].group.id;
        let ben = items.weapons.length + bel;
        if (!isItemSetted[ben]) {
            isItemSetted[ben] = document.createElement("div");
            isItemSetted[ben].id = "itemCount" + ben;
            getEl("actionBarItem" + ben).appendChild(isItemSetted[ben]);
            isItemSetted[ben].style = "\n                        display: block;\n                        position: absolute;\n                        padding-left: 5px;\n                        font-size: 20px;\n                        font-family: 'Hammersmith One', cursive;\n                        color: #fff;\n                        ";
            isItemSetted[ben].innerHTML = player.itemCounts[bem] || 0;
        } else if (bej == bem) {
            isItemSetted[ben].innerHTML = player.itemCounts[bej] || 0;
        }
    }
}

function fgdo(beo, bep) {
    return Math.sqrt(Math.pow(bep.y - beo.y, 2) + Math.pow(bep.x - beo.x, 2));
}

function autoPush() {
    let bes = liztobj.filter(bet => bet.trap && bet.active && bet.isTeamObject(player) && UTILS.getDist(bet, near, 0, 2) <= near.scale + bet.getScale() + 5).sort(function(beu, bev) {
        return UTILS.getDist(beu, near, 0, 2) - UTILS.getDist(bev, near, 0, 2);
    })[0];
    if (bes) {
        let bex = liztobj.filter(bey => bey.dmg && bey.active && bey.isTeamObject(player) && UTILS.getDist(bey, bes, 0, 0) <= near.scale + bes.scale + bey.scale).sort(function(bez, bfa) {
            return UTILS.getDist(bez, near, 0, 2) - UTILS.getDist(bfa, near, 0, 2);
        })[0];
        if (bex) {
            let bfc = Math.atan2(near.y2 - bex.y, near.x2 - bex.x);
            let bfd = {
                x: bex.x + Math.cos(UTILS.getDirect(near, bex, 2, 0)) * 250,
                y: bex.y + Math.sin(UTILS.getDirect(near, bex, 2, 0)) * 250,
                x2: bex.x + (UTILS.getDist(near, bex, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, bex, 2, 0)) + Math.cos(25),
                y2: bex.y + (UTILS.getDist(near, bex, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, bex, 2, 0)) + Math.sin(25)
            };
            let bfe = liztobj.filter(bff => bff.active).find(bfg => {
                let bfi = bfg.getScale();
                if (!bfg.ignoreCollision && UTILS.lineInRect(bfg.x - bfi, bfg.y - bfi, bfg.x + bfi, bfg.y + bfi, player.x2, player.y2, bfd.x2, bfd.y2)) {
                    return true;
                }
            });
            if (bfe) {
                if (my.autoPush) {
                    my.autoPush = false;
                    packet("9", lastMoveDir || undefined, 1);
                }
            } else {
                my.autoPush = true;
                my.pushData = {
                    x: bex.x + Math.cos(bfc),
                    y: bex.y + Math.sin(bfc),
                    x2: player.x2 + 30,
                    y2: player.y2 + 30
                };
                let bfj = {
                    x: near.x2 + Math.cos(bfc) * 30,
                    y: near.y2 + Math.sin(bfc) * 60
                };
                let bfk = Math.atan2(bfj.y - player.y2, bfj.x - player.x2);
                packet("9", bfk, 1);
                let bfl = player.scale / 10;
                if (UTILS.lineInRect(player.x2 - bfl, player.y2 - bfl, player.x2 + bfl, player.y2 + bfl, near.x2, near.y2, bfd.x, bfd.y)) {
                    packet("9", near.aim2, 1);
                } else {
                    packet("9", UTILS.getDirect(bfd, player, 2, 2), 1);
                }
            }
        } else if (my.autoPush) {
            my.autoPush = false;
            packet("9", lastMoveDir || undefined, 1);
        }
    } else if (my.autoPush) {
        my.autoPush = false;
        packet("9", lastMoveDir || undefined, 1);
    }
}

function knockBackPredict() {
    let bfn = {
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0,
        instax: 0,
        instay: 0,
        turretx: 0,
        turrety: 0
    };
    let bfo = Math.atan2(near.y2 - player.y2, near.x2 - player.x2);
    let bfp = Infinity;
    let bfq = gameObjects.filter(bfr => bfr.name == "pit trap" && bfr.active && bfr.isTeamObject(player) && UTILS.getDist(bfr, near, 0, 2) <= bfr.getScale() + player.scale + 5).sort((bfs, bft) => {
        return UTILS.getDist(bfs, near, 0, 2) - UTILS.UTILS.getDist(bft, near, 0, 2);
    })[0];
    if (near.dist2 - player.scale * 1.8 <= items.weapons[player.weapons[0]].range && !bfq) {
        for (let bfv of gameObjects) {
            let bfw = bfn;
            if (bfv.dmg && bfv.active && bfv.isTeamObject(player)) {
                let bfx = (items.weapons[player.weapons[0]].knock || 0) * items.weapons[player.weapons[0]].range + player.scale * 2;
                let bfy = ![undefined, 9, 12, 13, 15].includes(player.weapons[1]) ? (items.weapons[player.weapons[1]].knock || 0) * items.weapons[player.weapons[1]].range + player.scale * 2 - 10 : player.weapons[1] != undefined ? 60 : 0;
                let bfz = bfx + bfy;
                let bga = player.reloads[53] == 0 ? bfx + bfy + 75 : bfz;
                let bgb = near.x2 + bfx * Math.cos(bfo);
                let bgc = near.y2 + bfx * Math.sin(bfo);
                let bgd = near.x2 + bfy * Math.cos(bfo);
                let bge = near.y2 + bfy * Math.sin(bfo);
                let bgf = near.x2 + bfz * Math.cos(bfo);
                let bgg = near.y2 + bfz * Math.sin(bfo);
                let bgh = near.x2 + bga * Math.cos(bfo);
                let bgi = near.y2 + bga * Math.sin(bfo);
                bfw.x0 = bgb;
                bfw.y0 = bgc;
                bfw.x1 = bgd;
                bfw.y1 = bge;
                bfw.instax = bgf;
                bfw.instay = bgg;
                bfw.turretx = bgh;
                bfw.turrety = bgi;
                if (UTILS.getDist({
                    x: bgb,
                    y: bgc
                }, bfv, 0, 0) <= bfv.scale + player.scale && player.reloads[player.weapons[0]] == 0) {
                    return "insta them";
                }
                if (UTILS.getDist({
                    x: bgf,
                    y: bgg
                }, bfv, 0, 0) <= bfv.scale + player.scale && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                    return "insta them";
                }
            }
        }
    } else {
        bfn = {
            x0: 0,
            y0: 0,
            x1: 0,
            y1: 0,
            instax: 0,
            instay: 0,
            turretx: 0,
            turrety: 0
        };
    }
    return false;
}

function addDeadPlayer(bgj) {
    deadPlayers.push(new DeadPlayer(bgj.x, bgj.y, bgj.dir, bgj.buildIndex, bgj.weaponIndex, bgj.weaponVariant, bgj.skinColor, bgj.scale, bgj.name));
}

function setInitData(bgl) {
    alliances = bgl.teams;
}

function setupGame(bgm) {
    keys = {};
    macro = {};
    playerSID = bgm;
    attackState = 0;
    inGame = true;
    packet("F", 0, getAttackDir(), 1);
    my.ageInsta = true;
    if (firstSetup) {
        firstSetup = false;
        gameObjects.length = 0;
        liztobj.length = 0;
    }
}

function addPlayer(bgo, bgp) {
    let bgr = findID(players, bgo[0]);
    if (!bgr) {
        bgr = new Player(bgo[0], bgo[1], config, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories);
        players.push(bgr);
        if (bgo[1] != playerSID) {
            notif2("Encountered", bgo[2]);
        }
    } else if (bgo[1] != playerSID) {
        notif2("Encountered", bgo[2]);
    }
    bgr.spawn(bgp ? true : null);
    bgr.visible = false;
    bgr.oldPos = {
        x2: undefined,
        y2: undefined
    };
    bgr.x2 = undefined;
    bgr.y2 = undefined;
    bgr.x3 = undefined;
    bgr.y3 = undefined;
    bgr.setData(bgo);
    if (bgp) {
        if (!player) {
            window.prepareUI(bgr);
        }
        player = bgr;
        camX = player.x;
        camY = player.y;
        my.lastDir = 0;
        updateItems();
        updateAge();
        updateItemCountDisplay();
        if (player.skins[7]) {
            my.reSync = true;
        }
    }
}

function removePlayer(bgs) {
    for (let bgu = 0; bgu < players.length; bgu++) {
        if (players[bgu].id == bgs) {
            players.splice(bgu, 1);
            break;
        }
    }
}
Math.getDist = function(bgv, bgw) {
    try {
        let bgy = bgw.x2 || bgw.x;
        let bgz = bgw.y2 || bgw.y;
        let bha = bgv.x2 || bgv.x;
        let bhb = bgv.y2 || bgv.y;
        return Math.sqrt((bha -= bgy) * bha + (bhb -= bgz) * bhb);
    } catch (bhc) {
        return Infinity;
    }
};
Math.getDir = function(bhd, bhe) {
    try {
        return Math.atan2((bhe.y2 || bhe.y) - (bhd.y2 || bhd.y), (bhe.x2 || bhe.x) - (bhd.x2 || bhd.x));
    } catch (bhg) {
        return 0;
    }
};
let potSpikeReplace = 0;

function dmgPot() {
    let bhi = 0;
    if (nears.length && player) {
        nears.forEach(bhj => {
            if (Math.getDist(player, bhj) <= 300) {
                if (bhj.primaryIndex && Math.getDist(player, bhj) <= items.weapons[bhj.primaryIndex].range + player.scale * 2) {
                    if (bhj.reloads[bhj.primaryIndex] <= 0.2) {
                        bhi += items.weapons[bhj.primaryIndex].dmg * config.weaponVariants[bhj.primaryVariant].val * 1.5;
                        if (config.weaponVariants[bhj.primaryVariant].src === "_r") {
                            bhi += 5;
                        }
                    } else if (!bhj.primaryIndex) {
                        bhi += 60;
                    }
                }
                if (bhj.secondaryIndex && bhj.reloads[bhj.secondaryIndex] <= 0.2) {
                    const bhl = bhj.secondaryIndex === 10 ? items.weapons[bhj.secondaryIndex].dmg : items.weapons[bhj.secondaryIndex].Pdmg;
                    bhi += bhl;
                } else if (!bhj.secondaryIndex) {
                    bhi += 50;
                }
                if (bhj.reloads[53] <= 0.2 || bhj.reloads[53] >= 0.8 && Math.getDist(player, bhj) >= 160) {
                    bhi += 25;
                } else if (!bhj.reloads[53]) {
                    bhi += 25;
                }
            }
        });
        liztobj.forEach(bhm => {
            if (bhm.dmg && bhm.active && bhm.ownerSID != player.sid && !bhm.isTeamObject(player)) {
                if (Math.getDist(bhm, player) <= bhm.scale + player.scale + 20) {
                    bhi += bhm.dmg;
                }
            }
        });
        if (player.skinIndex === 7) {
            bhi += 5;
        } else if (player.skinIndex === 6) {
            bhi = bhi * 0.75;
        } else if (player.skinIndex === 13) {
            bhi = bhi - 3;
        } else if (player.skinIndex === 55) {
            if (player.currentReloads.primary === 1) {
                bhi = bhi - items.weapons[player.weapons[0]].dmg * 0.25;
            }
        } else if (player.skinIndex === 58) {
            if (player.currentReloads.primary === 1) {
                bhi = bhi - items.weapons[player.weapons[0]].dmg * 0.4;
            }
        }
        if (player.tailIndex === 13) {
            bhi = bhi - 3;
        } else if (player.tailIndex === 18) {
            if (player.currentReloads.primary === 1) {
                bhi = bhi - items.weapons[player.weapons[0]].dmg * 0.2;
            }
        }
    }
    return bhi;
}
let prevTrap = false;
let prevEnemyBullTick = 0;
let enemyBullTick = 0;
let lastTickDamage = 0;
let skippedTicks = 0;
let countBTicks = 0;
let prevBullTick = 0;
let lastBullTick = 0;

function updateHealth(bho, bhp) {
    let bhr = players.find(acs => acs.sid == bho);
    let bhs = {
        weapon: this.secondaryIndex,
        variant: this.secondaryVariant
    };
    if (!bhr) {
        return;
    }
    if (bhr) {
        bhr.oldHealth = bhr.health;
        bhr.health = bhp;
        bhr.judgeShame();
        if (bhr.oldHealth > bhr.health) {
            bhr.timeDamaged = Date.now();
            bhr.damaged = bhr.oldHealth - bhr.health;
            let bht = bhr.damaged;
            bhr = players.find(acs => acs.sid == bho);
            let bhu = false;
            if (bhr.health <= 0) {
                if (!bhr.death) {
                    bhr.death = true;
                    addDeadPlayer(bhr);
                }
            }
            if (bhr == player) {
                if (bhr.skinIndex == 7 && (bht == 5 || bhr.latestTail == 13 && bht == 2)) {
                    if (my.reSync) {
                        my.reSync = false;
                        bhr.setBullTick = true;
                    }
                    bhu = true;
                }
                let bhv = true;
                let bhw = false;
                let bhx = player.empAnti;
                let bhy = true;
                let bhz = false;
                let bia = true;
                let bib = 85;
                let bic = getAttacker(bht);
                let bid = [0.25, 0.45].map(bie => bie * items.weapons[player.weapons[0]].dmg);
                let bif = near.length ? !bhu && bid.includes(bht) && near[0].skinIndex == 11 && near[0].tailIndex == 21 : false;

                function big(bih) {
                    if (bhx) {
                        setTimeout(() => {
                            healer();
                        }, bih);
                    };
                };
                if (bic.length) {
                    let bii = bic.filter(bij => {
                        if (bij.dist2 <= (bij.weaponIndex < 9 ? 300 : 700)) {
                            tmpDir = UTILS.getDirect(player, bij, 2, 2);
                            if (UTILS.getAngleDist(tmpDir, bij.d2) <= Math.PI) {
                                return bij;
                            }
                        }
                    });
                    if (bib && player.dmg) {
                        if (bib) {
                            bib = 65 || 80;
                            if (bii.length) {
                                let bil = bif ? 10 : 10;
                                if (bht > bil && game.tick - bhr.antiTimer > 1) {
                                    bhr.canEmpAnti = true;
                                    bhr.antiTimer = game.tick;
                                    let bim = 4;
                                    if (bhr.shameCount < bim) {
                                        healer();
                                    } else {
                                        big(bib);
                                    }
                                } else {
                                    big(bib);
                                }
                            } else {
                                big(bib);
                            }
                        };
                    };
                };
                if (inGame) {
                    let bio = bhr.weapons[0] == 4 ? 2 : 5;
                    let bip = bht >= (bif ? 8 : 20) && bhr.damageThreat >= 20;
                    if (bip && bia && game.tick - bhr.antiTimer > 1) {}
                    if (bip && bhz) {
                        setTimeout(() => {
                            healer();
                        }, 120);
                    }
                    if (bip && bhv && bhr.primaryIndex !== "4" && game.tick - bhr.antiTimer > 1);
                    if (bht >= 20 && player.skinIndex == 11 && player.shameCount <= 3) {
                        instaC.canCounter = true;
                    }
                    if (bht >= 0 && bht <= 66 && player.shameCount === 4 && bhr.primaryIndex !== "4") {
                        bhz = true;
                        bhv = false;
                        bhw = false;
                        bia = false;
                    } else if (player.shameCount !== 4) {
                        bhz = false;
                        bhv = true;
                        bia = true;
                    }
                    if (bht <= 66 && player.shameCount === 3 && bhr.primaryIndex !== "4") {
                        bhv = false;
                    } else if (player.shameCount !== 3) {
                        bhv = true;
                    }
                    if (bht <= 66 && player.shameCount === 4 && bhr.primaryIndex !== "4") {
                        bhw = true;
                    } else if (player.shameCount !== 4) {
                        bhw = false;
                    }
                    if (bht <= 66 && player.skinIndex != 6 && enemy.weaponIndex === 4) {
                        game.tickBase(() => {
                            healer1();
                        }, 2);
                    }
                };
                let biq = 100 - player.health;
                if (bht >= (bif ? 8 : 20) && bhr.damageThreat >= 20 && bia && game.tick - bhr.antiTimer > 1) {
                    if (bhr.reloads[53] == 0 && bhr.reloads[bhr.weapons[1]] == 0) {
                        bhr.canEmpAnti = true;
                    } else {
                        player.soldierAnti = true;
                    }
                    bhr.antiTimer = game.tick;
                    let bir = bhr.weapons[0] == 4 ? 2 : 5;
                    if (bhr.shameCount < bir) {
                        healer();
                    } else {
                        game.tickBase(() => {
                            healer();
                        }, 2);
                    }
                    if (bht >= (bif ? 8 : 20) && bhr.damageThreat >= 20 && bhz) {
                        setTimeout(() => {
                            healer();
                        }, 120);
                    }
                    let bis = 100 - player.health;
                    if (bht >= (bif ? 8 : 20) && bhr.damageThreat >= 20 && bhv && bhr.primaryIndex !== "4" && game.tick - bhr.antiTimer > 1) {
                        if (bhr.reloads[53] == 0 && bhr.reloads[bhr.weapons[1]] == 0) {
                            bhr.canEmpAnti = true;
                        } else {
                            player.soldierAnti = true;
                        }
                        bhr.antiTimer = game.tick;
                        let bit = bhr.weapons[0] == 4 ? 2 : 5;
                        if (bhr.shameCount < bit) {
                            healer();
                        } else {
                            game.tickBase(() => {
                                healer();
                            }, 2);
                        }
                    }
                    if (bht >= 20 && player.skinIndex == 11 && player.shameCount <= 3) {
                        instaC.canCounter = true;
                    }
                } else {
                    game.tickBase(() => {
                        healer();
                    }, 2);
                }
            } else {
                bhr.maxShameCount = Math.max(bhr.maxShameCount, bhr.shameCount);
            }
        } else if (!bhr.setPoisonTick && (bhr.damaged == 5 || bhr.latestTail == 13 && bhr.damaged == 2)) {
            bhr.setPoisonTick = true;
        }
    }
    if (nears.length && bhr.shameCount <= 5 && nears.some(biu => [9, 12, 17, 15].includes(bhs.weapon))) {
        if (near.reloads[near.secondaryIndex] == 0) {
            my.empAnti = true;
            my.soldierAnti = false;
        } else {
            my.soldierAnti = true;
            my.empAnti = false;
        }
    }
}

function killPlayer() {
    inGame = false;
    lastDeath = {
        x: player.x,
        y: player.y
    };
}

function updateItemCounts(biv, biw) {
    if (player) {
        player.itemCounts[biv] = biw;
        updateItemCountDisplay(biv);
    }
}

function updateAge(bix, biy, biz) {
    var bjb = document.getElementById("ageText");
    var bjc = document.getElementById("ageBarBody");
    var bjd = document.getElementById("ageBarContainer");
    document.getElementById("woodDisplay").style.display = "none";
    document.getElementById("stoneDisplay").style.display = "none";
    document.getElementById("foodDisplay").style.display = "none";
    if (bix !== undefined) {
        player.XP = bix;
    }
    if (biy !== undefined) {
        player.maxXP = biy;
    }
    if (biz !== undefined) {
        player.age = biz;
    }
    if (player.age >= 9) {
        bjb.style.display = "none";
        bjc.style.display = "block";
        bjd.style.display = "block";
    } else {
        bjb.style.display = "none";
        bjc.style.display = "block";
        bjd.style.display = "block";
        bjb.innerHTML = "AGE " + player.age;
        bjc.style.width = player.XP / player.maxXP * 100 + "%";
    }
}

function updateUpgrades(bje, bjf) {
    player.upgradePoints = bje;
    player.upgrAge = bjf;
    if (bje > 0) {
        tmpList.length = 0;
        UTILS.removeAllChildren(upgradeHolder);
        for (let bjh = 0; bjh < items.weapons.length; ++bjh) {
            if (items.weapons[bjh].age == bjf && (items.weapons[bjh].pre == undefined || player.weapons.indexOf(items.weapons[bjh].pre) >= 0)) {
                let bji = UTILS.generateElement({
                    id: "upgradeItem" + bjh,
                    class: "actionBarItem",
                    onmouseout: function() {
                        showItemInfo();
                    },
                    parent: upgradeHolder
                });
                bji.style.backgroundImage = getEl("actionBarItem" + bjh).style.backgroundImage;
                tmpList.push(bjh);
            }
        }
        for (let bjj = 0; bjj < items.list.length; ++bjj) {
            if (items.list[bjj].age == bjf && (items.list[bjj].pre == undefined || player.items.indexOf(items.list[bjj].pre) >= 0)) {
                let bjk = items.weapons.length + bjj;
                let bjl = UTILS.generateElement({
                    id: "upgradeItem" + bjk,
                    class: "actionBarItem",
                    onmouseout: function() {
                        showItemInfo();
                    },
                    parent: upgradeHolder
                });
                bjl.style.backgroundImage = getEl("actionBarItem" + bjk).style.backgroundImage;
                tmpList.push(bjk);
            }
        }
        for (let bjm = 0; bjm < tmpList.length; bjm++) {
            (function(bjn) {
                let bjp = getEl("upgradeItem" + bjn);
                bjp.onclick = UTILS.checkTrusted(function() {
                    packet("H", bjn);
                });
                UTILS.hookTouchEvents(bjp);
                if (getEl("autoUpgrade").checked) {
                    let bjq = parseInt(getEl("autoUpgrade").checked);
                    if (tmpList.length == 1) {
                        packet("H", bjn);
                    } else if (["17", "31", "23", bjq].find(bjr => bjp.id.includes(bjr))) {
                        packet("H", bjn);
                    }
                }
            })(tmpList[bjm]);
        }
        if (tmpList.length) {
            upgradeHolder.style.display = "block";
            upgradeCounter.style.display = "block";
            upgradeCounter.innerHTML = "SELECT ITEMS (" + bje + ")";
        } else {
            upgradeHolder.style.display = "none";
            upgradeCounter.style.display = "none";
            showItemInfo();
        }
    } else {
        upgradeHolder.style.display = "none";
        upgradeCounter.style.display = "none";
        showItemInfo();
    }
}

function killObject(bjs) {
    let bju = gameObjects.find(acs => acs.sid == bjs);
    objectManager.disableBySid(bjs);
    if (player) {
        for (let bjv = 0; bjv < breakObjects.length; bjv++) {
            if (breakObjects[bjv].sid == bjs) {
                breakObjects.splice(bjv, 1);
                break;
            }
        }
        if (!player.canSee(bju)) {
            breakTrackers.push({
                x: bju.x,
                y: bju.y
            });
        }
        if (breakTrackers.length > 8) {
            breakTrackers.shift();
        }
        traps.replacer(bju);
    }
}

function magnitude(bjw) {
    return Math.sqrt(bjw.x * bjw.x + bjw.y * bjw.y);
}

function vectorDifference(bjy, bjz) {
    return {
        x: bjz.x - bjy.x,
        y: bjz.y - bjy.y
    };
}

function calculateAngleUsingDotProduct(bka, bkb) {
    let bkd = vectorDifference(bka, bkb);
    let bke = {
        x: Math.cos(player.dir),
        y: Math.sin(player.dir)
    };
    let bkf = bke.x * bkd.x + bke.y * bkd.y;
    let bkg = magnitude(bke) * magnitude(bkd);
    let bkh = bkf / bkg;
    let bki = Math.acos(bkh);
    bki *= 180 / Math.PI;
    if (bki < 0) {
        bki += 360;
    }
    return bki;
}

function calculatePerfectAngle(bkj, bkk, bkl, bkm) {
    return Math.atan2(bkm - bkk, bkl - bkj);
}

function killObjects(bko) {
    if (player) {
        objectManager.removeAllItems(bko);
    }
}

function setTickout(bkp, bkq) {
    if (!ticks.manage[ticks.tick + bkq]) {
        ticks.manage[ticks.tick + bkq] = [bkp];
    } else {
        ticks.manage[ticks.tick + bkq].push(bkp);
    }
}

function isAlly(bks, bkt) {
    tmpObj = players.find(acs => acs.sid == bks);
    if (!tmpObj) {
        return;
    }
    if (bkt) {
        let bkv = players.find(acs => acs.sid == bkt);
        if (!bkv) {
            return;
        }
        if (bkv.sid == bks) {
            return true;
        } else if (tmpObj.team) {
            if (tmpObj.team === bkv.team) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    if (!tmpObj) {
        return;
    }
    if (player.sid == bks) {
        return true;
    } else if (tmpObj.team) {
        if (tmpObj.team === player.team) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function caf(bkw, bkx) {
    try {
        return Math.atan2((bkx.y2 || bkx.y) - (bkw.y2 || bkw.y), (bkx.x2 || bkx.x) - (bkw.x2 || bkw.x));
    } catch (bkz) {
        return 0;
    }
}
let found = false;
let autoQ = false;
let autos = {
    insta: {
        todo: false,
        wait: false,
        count: 4,
        shame: 5
    },
    bull: false,
    antibull: 0,
    reloaded: false,
    stopspin: true
};
let placeableSpikes = [];
let placeableTraps = [];
let placeableSpikesPREDICTS = [];

function getDir(bla, blb) {
    try {
        return Math.atan2((blb.y2 || blb.y) - (bla.y2 || bla.y), (blb.x2 || blb.x) - (bla.x2 || bla.x));
    } catch (blc) {
        return 0;
    }
}
const getDistance = (bld, ble, blf, blg) => {
    let bli = blf - bld;
    let blj = blg - ble;
    return Math.sqrt(bli * bli + blj * blj);
};
const getPotentialDamage = (blk, bll) => {
    const bln = bll.weapons[1] === 10 && !player.reloads[bll.weapons[1]] ? 1 : 0;
    const blo = bll.weapons[bln];
    if (player.reloads[blo]) {
        return 0;
    }
    const blp = items.weapons[blo];
    const blq = getDistance(blk.x, blk.y, bll.x2, bll.y2) <= blk.getScale() + blp.range;
    if (bll.visible && blq) {
        return blp.dmg * (blp.sDmg || 1) * 3.3;
    } else {
        return 0;
    }
};
const findPlacementAngle = (blr, bls, blt) => {
    if (!blt) {
        return null;
    }
    const blv = Math.PI * 2;
    const blw = Math.PI / 360;
    const blx = items.list[blr.items[bls]];
    let bly = Math.atan2(blt.y - blr.y, blt.x - blr.x);
    let blz = blr.scale + (blx.scale || 1) + (blx.placeOffset || 0);
    for (let bma = 0; bma < blv; bma += blw) {
        let bmb = [(bly + bma) % blv, (bly - bma + blv) % blv];
        for (let bmc of bmb) {
            let bmd = blr.x + blz * Math.cos(bmc);
            let bme = blr.y + blz * Math.sin(bmc);
            if (objectManager.customCheckItemLocation(bmd, bme, blx.scale, 0.6, blx.id, false, blr, blt, gameObjects, UTILS, config)) {
                return bmc;
            }
        }
    }
    return null;
};
const AutoReplace = () => {
    const bmg = [];
    const bmh = player.x;
    const bmi = player.y;
    const bmj = gameObjects.length;
    for (let bmk = 0; bmk < bmj; bmk++) {
        const bml = gameObjects[bmk];
        if (bml.isItem && bml.active && bml.health > 0) {
            let bmm = players.reduce((bmn, bmo) => bmn + getPotentialDamage(bml, bmo), 0);
            if (bml.health <= bmm) {
                bmg.push(bml);
            }
        }
    }
    const bmp = () => {
        let bmr = gameObjects.filter(bms => bms.trap && bms.active && bms.isTeamObject(player) && getDistance(bms.x, bms.y, bmh, bmi) <= bms.getScale() + 5);
        let bmt = gameObjects.find(bmu => bmu.dmg && bmu.active && bmu.isTeamObject(player) && getDistance(bmu.x, bmu.y, bmh, bmi) < 87 && !bmr.length);
        const bmv = bmt ? 4 : 2;
        bmg.forEach(bmw => {
            let bmx = findPlacementAngle(player, bmv, bmw);
            if (bmx !== null) {
                place(bmv, bmx);
            }
        });
    };
    const bmy = game.tickSpeed - (window.pingTime || 0) + (game.tickSpeed < 110 ? 15 : 15);
    if (near && near.dist2 <= 280) {
        let bmz = window.pingTime;
        if (bmz + 40 < window.pingTime) {
            bmz += 40;
        } else if (bmz + 25 < window.pingTime) {
            bmy += 25;
        }
        setTimeout(bmp, bmy);
    }
};
let lastPos = {
    x: 0,
    y: 0
};
let mills = {
    x: undefined,
    y: undefined,
    size: function(bna) {
        return bna * 1.45;
    },
    dist: function(bnb) {
        return bnb * 1.8;
    },
    active: config.isSandbox ? false : false,
    count: 0
};
let laztPoz = {};
let oldXY = {
    x: undefined,
    y: undefined
};

function notif2(bnc, bnd) {
    let bnf = document.getElementById("notification-container");
    if (!bnf) {
        bnf = document.createElement("div");
        bnf.id = "notification-container";
        bnf.style.position = "fixed";
        bnf.style.top = "10%";
        bnf.style.left = "50%";
        bnf.style.transform = "translateX(-50%)";
        bnf.style.zIndex = "9999";
        document.body.appendChild(bnf);
    }
    const bng = document.createElement("div");
    bng.innerHTML = bnc + ": " + bnd;
    bng.style.fontSize = "1.5rem";
    bng.style.color = "white";
    bng.style.opacity = "0";
    bng.style.transition = "opacity 0.5s ease-in-out";
    bng.style.padding = "10px";
    bng.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    bng.style.borderRadius = "5px";
    bng.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    bng.style.marginBottom = "10px";
    bnf.appendChild(bng);
    const bnh = new Audio("https://cdn.glitch.global/4c998580-5aaf-4a1a-8da3-e0c6b9f241a7/Audio_-_notification3_-_Creator_Store%20(1).mp3?v=1709582087126");
    bnh.volume = 0.4;
    bnh.play();
    setTimeout(function() {
        bng.style.opacity = "1";
    }, 100);
    setTimeout(function() {
        bng.style.opacity = "0";
        setTimeout(function() {
            bng.remove();
        }, 500);
    }, 3000);
}

function notif(bnl, bnm) {
    let bno = player;
    let bnp = textManager;
    if (typeof bnl !== "undefined") {
        bnp.showText(bno.x, bno.y, 40, 0.18, 1000, bnl, "white");
    }
    if (typeof bnm !== "undefined") {
        bnp.showText(bno.x, bno.y + 40, 30, 0.18, 1000, bnm, "white");
    }
}
const safeWalk = () => {
    let bnr = false;
    let bns = null;
    let bnt = false;
    my.autoPush = false;
    pathFind.active = false;
    pathFind.chaseNear = false;
    const bnu = liztobj.sort((bnv, bnw) => Math.hypot(player.y2 - bnv.y, player.x2 - bnv.x) - Math.hypot(player.y2 - bnw.y, player.x2 - bnw.x));
    const bnx = bnu.filter(bny => {
        return (bny.name === "spikes" || bny.name === "greater spikes" || bny.name === "spinning spikes" || bny.name === "poison spikes") && !isAlly(bny.owner.sid) && bny.owner.sid !== player.sid && fgdo(player, bny) < 250 && bny.active;
    });
    const boa = {
        x: player.x2 + (player.x2 - lastPos.x) * 1.2 + Math.cos(player.moveDir) * 50,
        y: player.y2 + (player.y2 - lastPos.y) * 1.2 + Math.sin(player.moveDir) * 50
    };
    for (let boc = 0; boc < bnx.length; boc++) {
        if (fgdo(bnx[boc], boa) < bnx[boc].scale + player.scale + 3) {
            bnr = true;
            bns = bnx[boc];
            break;
        }
    }
    const bod = () => {
        packet("D", Math.atan2(bns.y - player.y2, bns.x - player.x2));
    };
    const bof = () => {
        my.autoPush = false;
        pathFind.active = false;
        pathFind.chaseNear = false;
        selectWeapon(player.weapons[player.weapons[1] === 10 ? 1 : 0]);
        sendAutoGather();
        buyEquip(40, 0);
        bod();
        my.waitHit = 1;
        game.tickBase(() => {
            sendAutoGather();
            my.waitHit = 0;
        }, 1);
    };
    if (bnr && !traps.inTrap && !phantom.find(boi => boi.sid === bns.sid)) {
        if (player.reloads[player.weapons[0]] === 0 && !instaC.isTrue && !clicks.left && !clicks.right && player.reloads[player.weapons[1]] === 0) {
            bof();
        };
        packet("e");
        my.autoPush = false;
        pathFind.active = false;
        pathFind.chaseNear = false;
        bnt = true;
        tracker.draw3.active = true;
        tracker.draw3.x = bns.x;
        tracker.draw3.y = bns.y;
        tracker.draw3.scale = bns.scale;
        if (getEl("notifs").checked) {
            notif("Stop!");
        }
    } else {
        bnt = false;
        tracker.draw3.active = false;
        packet("9", lastMoveDir, 1);
    }
    lastPos.x = player.x2;
    lastPos.y = player.y2;
};

function updatePlayers(boj) {
    safeWalk();
    if (player.shameCount > 0) {
        my.reSync = true;
    } else {
        my.reSync = false;
    }
    if (player.shameCount > 4) {
        player.chat.message = "danger";
        player.chat.count = 1000;
    }
    if (near.shameCount > 4) {
        near.chat.message = "killable";
        near.chat.count = 1000;
    }
    if (tmpObj == player) {
        if (!mills.x || !oldXY.x) {
            mills.x = oldXY.x = tmpObj.x2;
        }
        if (!mills.y || !oldXY.y) {
            mills.y = oldXY.y = tmpObj.y2;
        }
    }
    if (textManager.stack.length) {
        let bol = [];
        let bom = [];
        let bon = 0;
        let boo = 0;
        let bop = {
            x: null,
            y: null
        };
        let boq = {
            x: null,
            y: null
        };
        textManager.stack.forEach(bor => {
            if (bor.value >= 0) {
                if (bon == 0) {
                    bop = {
                        x: bor.x,
                        y: bor.y
                    };
                }
                bon += Math.abs(bor.value);
            } else {
                if (boo == 0) {
                    boq = {
                        x: bor.x,
                        y: bor.y
                    };
                }
                boo += Math.abs(bor.value);
            }
        });
        if (boo > 0) {
            textManager.showText(boq.x, boq.y, Math.max(45, Math.min(50, boo)), 0.18, 500, boo, "#8ecc51");
        }
        if (bon > 0) {
            textManager.showText(bop.x, bop.y, Math.max(45, Math.min(50, bon)), 0.18, 500, bon, "#fff");
        }
        textManager.stack = [];
    }
    if (runAtNextTick.length) {
        runAtNextTick.forEach(bou => {
            checkProjectileHolder(...bou);
        });
        runAtNextTick = [];
    }

    function bov(boy) {
        let bpa = liztobj.sort((bpb, bpc) => Math.hypot(boy.y - bpb.y, boy.x - bpb.x) - Math.hypot(boy.y - bpc.y, boy.x - bpc.x));
        let bpd = bpa.filter(bpe => bpe.dmg && cdf(player, bpe) < 200 && !bpe.isTeamObject(player) && bpe.active);
        let bpf = {
            x: boy.x + (player.oldPos.x2 - boy.x) * -2,
            y: boy.y + (player.oldPos.y2 - boy.y) * -2,
            x: player.x2 + (player.oldPos.x2 - player.x2) * -1,
            y: player.y2 + (player.oldPos.y2 - player.y2) * -1
        };
        let bpg = false;
        for (let bph = 0; bph < bpd.length; bph++) {
            if (cdf(bpf, bpd[bph]) < player.scale + bpd[bph].scale) {
                bpg = true;
            }
        }
        player.oldPos.x2 = boy.x2;
        player.oldPos.y2 = boy.y2;
    }
    game.tick++;
    enemy = [];
    nears = [];
    near = [];
    game.tickSpeed = performance.now() - game.lastTick;
    game.lastTick = performance.now();
    players.forEach(bpi => {
        bpi.forcePos = !bpi.visible;
        bpi.visible = false;
        if (bpi.timeHealed - bpi.timeDamaged > 0 && bpi.lastshamecount < bpi.shameCount) {
            bpi.pinge = bpi.timeHealed - bpi.timeDamaged;
        }
    });
    for (let bpk = 0; bpk < boj.length;) {
        tmpObj = players.find(acs => acs.sid == boj[bpk]);
        if (tmpObj) {
            tmpObj.t1 = tmpObj.t2 === undefined ? game.lastTick : tmpObj.t2;
            tmpObj.t2 = game.lastTick;
            tmpObj.oldPos.x2 = tmpObj.x2;
            tmpObj.oldPos.y2 = tmpObj.y2;
            tmpObj.x1 = tmpObj.x;
            tmpObj.y1 = tmpObj.y;
            tmpObj.x2 = boj[bpk + 1];
            tmpObj.y2 = boj[bpk + 2];
            tmpObj.x3 = tmpObj.x2 + (tmpObj.x2 - tmpObj.oldPos.x2);
            tmpObj.y3 = tmpObj.y2 + (tmpObj.y2 - tmpObj.oldPos.y2);
            tmpObj.d1 = tmpObj.d2 === undefined ? boj[bpk + 3] : tmpObj.d2;
            tmpObj.d2 = boj[bpk + 3];
            tmpObj.dt = 0;
            tmpObj.buildIndex = boj[bpk + 4];
            tmpObj.weaponIndex = boj[bpk + 5];
            tmpObj.weaponVariant = boj[bpk + 6];
            tmpObj.team = boj[bpk + 7];
            tmpObj.isLeader = boj[bpk + 8];
            tmpObj.oldSkinIndex = tmpObj.skinIndex;
            tmpObj.oldTailIndex = tmpObj.tailIndex;
            tmpObj.skinIndex = boj[bpk + 9];
            tmpObj.tailIndex = boj[bpk + 10];
            tmpObj.iconIndex = boj[bpk + 11];
            tmpObj.zIndex = boj[bpk + 12];
            tmpObj.visible = true;
            tmpObj.update(game.tickSpeed);
            tmpObj.dist2 = UTILS.getDist(tmpObj, player, 2, 2);
            tmpObj.aim2 = UTILS.getDirect(tmpObj, player, 2, 2);
            tmpObj.dist3 = UTILS.getDist(tmpObj, player, 3, 3);
            tmpObj.aim3 = UTILS.getDirect(tmpObj, player, 3, 3);
            tmpObj.damageThreat = 0;
            if (tmpObj.skinIndex == 45 && tmpObj.shameTimer <= 0) {
                tmpObj.addShameTimer();
            }
            if (tmpObj.oldSkinIndex == 45 && tmpObj.skinIndex != 45) {
                tmpObj.shameTimer = 0;
                tmpObj.shameCount = 0;
                if (tmpObj == player) {
                    healer();
                }
            }
            botSkts.forEach(bpl => {
                bpl.showName = "YEAHHH";
            });
            for (let bpn = 0; bpn < players.length; bpn++) {
                for (let bpo = 0; bpo < botSkts.length; bpo++) {
                    if (player.id === bpo.id) {
                        bpo.showName = "YEAHHHHHH";
                    }
                }
            }
            if (player.shameCount < 3 && near.dist3 <= 300 && near.reloads[near.primaryIndex] <= game.tickRate * (window.pingTime >= 150 ? 2 : 1)) {
                autoQ = true;
                healer();
            } else {
                if (autoQ) {
                    healer();
                }
                autoQ = false;
            }
            if (phantom.length > 0) {
                for (let bpp of phantom) {
                    objectManager.disableBySid(bpp.sid);
                }
                phantom = [];
            }
            if (tmpObj == player) {
                if (liztobj.length) {
                    liztobj.forEach(bpq => {
                        bpq.onNear = false;
                        if (bpq.active) {
                            if (!bpq.onNear && UTILS.getDist(bpq, tmpObj, 0, 2) <= bpq.scale + items.weapons[tmpObj.weapons[0]].range) {
                                bpq.onNear = true;
                            }
                            if (bpq.isItem && bpq.owner) {
                                bpq.breakObj = true;
                                breakObjects.push({
                                    x: bpq.x,
                                    y: bpq.y,
                                    sid: bpq.sid
                                });
                            }
                        }
                    });
                    let bps = liztobj.filter(bpt => bpt.trap && bpt.active && UTILS.getDist(bpt, tmpObj, 0, 2) <= tmpObj.scale + bpt.getScale() + 25 && !bpt.isTeamObject(tmpObj)).sort(function(bpu, bpv) {
                        return UTILS.getDist(bpu, tmpObj, 0, 2) - UTILS.getDist(bpv, tmpObj, 0, 2);
                    })[0];
                    if (bps) {
                        let bpx = liztobj.filter(bpy => bpy.dmg && cdf(tmpObj, bpy) <= tmpObj.scale + bps.scale / 2 && !bpy.isTeamObject(tmpObj) && bpy.active)[0];
                        traps.dist = UTILS.getDist(bps, tmpObj, 0, 2);
                        traps.aim = UTILS.getDirect(bpx ? bpx : bps, tmpObj, 0, 2);
                        tracker.draw3.active = true;
                        traps.protect(caf(bps, tmpObj) - Math.PI);
                        traps.inTrap = true;
                        traps.info = bps;
                    } else {
                        if (traps.inTrap) {
                            Leuchtturm = true;
                            setTimeout(() => {
                                Leuchtturm = false;
                            }, 240);
                        } else {
                            Leuchtturm = false;
                        }
                        traps.inTrap = false;
                        traps.info = {};
                    }
                } else {
                    tracker.draw3.active = false;
                    traps.inTrap = false;
                }
            }
            if (tmpObj.weaponIndex < 9) {
                tmpObj.primaryIndex = tmpObj.weaponIndex;
                tmpObj.primaryVariant = tmpObj.weaponVariant;
            } else if (tmpObj.weaponIndex > 8) {
                tmpObj.secondaryIndex = tmpObj.weaponIndex;
                tmpObj.secondaryVariant = tmpObj.weaponVariant;
            }
        }
        bpk += 13;
    }
    if (runAtNextTick.length) {
        runAtNextTick.forEach(bpz => {
            checkProjectileHolder(...bpz);
        });
        runAtNextTick = [];
    }
    for (let bqa = 0; bqa < boj.length;) {
        tmpObj = players.find(acs => acs.sid == boj[bqa]);
        if (tmpObj) {
            if (!tmpObj.isTeam(player)) {
                enemy.push(tmpObj);
                if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + player.scale * 2) {
                    nears.push(tmpObj);
                }
            }
            tmpObj.manageReload();
            if (tmpObj != player) {
                tmpObj.addDamageThreat(player);
            }
        }
        bqa += 13;
    }
    if (player && player.alive) {
        if (enemy.length) {
            near = enemy.sort(function(bqb, bqc) {
                return bqb.dist2 - bqc.dist2;
            })[0];
        } else {}
        if (game.tickQueue[game.tick]) {
            game.tickQueue[game.tick].forEach(bqe => {
                bqe();
            });
            game.tickQueue[game.tick] = null;
        }
        if (advHeal.length) {
            advHeal.forEach(bqf => {
                if (window.pingTime < 150) {
                    let bqh = bqf[0];
                    let bqi = bqf[1];
                    let bqj = 100 - bqi;
                    let bqk = bqf[2];
                    tmpObj = players.find(acs => acs.sid == bqh);
                    let bql = false;
                    if (tmpObj && tmpObj.health <= 0) {
                        if (!tmpObj.death) {
                            tmpObj.death = true;
                            if (tmpObj != player) {
                                notif2("KILLED : ", tmpObj.name);
                            }
                            addDeadPlayer(tmpObj);
                        }
                    }
                    if (tmpObj == player) {
                        if (tmpObj.skinIndex == 7 && (bqk == 5 || tmpObj.latestTail == 13 && bqk == 2)) {
                            if (my.reSync) {
                                my.reSync = false;
                                tmpObj.setBullTick = true;
                            }
                            bql = true;
                        }
                        if (inGame) {
                            let bqm = getAttacker(bqk);
                            let bqn = [0.25, 0.45].map(bqo => bqo * items.weapons[player.weapons[0]].dmg * soldierMult());
                            let bqp = enemy.length ? !bql && bqn.includes(bqk) && near.skinIndex == 11 : false;
                            let bqq = 140 - window.pingTime;
                            let bqr = 100 - player.health;
                            let bqs = function(bqt, bqu) {
                                if (!bqu) {
                                    setTimeout(() => {
                                        healer();
                                    }, bqt);
                                } else {
                                    game.tickBase(() => {
                                        healer();
                                    }, 2);
                                }
                            };
                            if (getEl("healingBeta").checked) {
                                if (enemy.length) {
                                    if ([0, 7, 8].includes(near.primaryIndex)) {
                                        if (bqk < 75) {
                                            bqs(bqq);
                                        } else {
                                            healer();
                                        }
                                    }
                                    if (!Leuchtturm && bqk >= 20 && player.skinIndex == 6 && player.shameCount <= 4 && getEl("antiBullType").value == "abalway" && near.dist2 <= 150 && (player.weapons[0] == 4 || player.weapons[0] == 3) && near.primaryIndex != 5) {
                                        instaC.canCounter = true;
                                    }
                                    if (player.weapons[1] == 11) {
                                        if ([15, 9, 12, 13].includes(near.secondaryIndex) && near.reloads[near.secondaryIndex] == 1) {
                                            if (bqk < 75) {
                                                my.autoAim = true;
                                                selectWeapon(player.weapons[1]);
                                                bqs(bqq);
                                                setTimeout(() => {
                                                    selectWeapon(player.weapons[0]);
                                                    my.autoAim = false;
                                                }, 250);
                                            }
                                        }
                                    } else if (player.weapons[1] == 11) {
                                        if (near.skinIndex == 53) {
                                            my.autoAim = true;
                                            selectWeapon(player.weapons[1]);
                                            bqs(bqq);
                                            setTimeout(() => {
                                                selectWeapon(player.weapons[0]);
                                                my.autoAim = false;
                                            }, 250);
                                        }
                                    }
                                    if ([1, 2, 6].includes(near.primaryIndex)) {
                                        if (bqk >= 25 && player.damageThreat + bqr >= 95 && tmpObj.shameCount < 5) {
                                            healer();
                                        } else {
                                            bqs(bqq);
                                        }
                                    }
                                    if (near.primaryIndex == 5 && near.secondaryIndex == 10 && traps.inTrap && bqr >= 10 && near.reloads[near.primaryIndex] == 0) {
                                        healer();
                                    }
                                    if (near.primaryIndex == 3) {
                                        if (near.secondaryIndex == 15) {
                                            if (near.primaryVariant < 2) {
                                                if (bqk >= 35 && player.damageThreat + bqr >= 95 && tmpObj.shameCount < 6) {
                                                    tmpObj.canEmpAnti = true;
                                                    healer();
                                                } else {
                                                    bqs(bqq);
                                                }
                                            } else if (bqk > 35 && player.damageThreat + bqr >= 95 && tmpObj.shameCount < 6 && game.tick - player.antiTimer > 1) {
                                                tmpObj.canEmpAnti = true;
                                                tmpObj.antiTimer = game.tick;
                                                healer();
                                            } else {
                                                bqs(bqq);
                                            }
                                        } else if (bqk >= 25 && player.damageThreat + bqr >= 95 && tmpObj.shameCount < 4) {
                                            healer();
                                        } else {
                                            bqs(bqq);
                                        }
                                    }
                                    if (near.primaryIndex == 4) {
                                        if (near.primaryVariant >= 1) {
                                            if (bqk >= 10 && player.damageThreat + bqr >= 95 && tmpObj.shameCount < 4) {
                                                healer();
                                            } else {
                                                bqs(bqq);
                                            }
                                        } else if (bqk >= 35 && player.damageThreat + bqr >= 95 && tmpObj.shameCount < 3) {
                                            healer();
                                        } else {
                                            bqs(bqq);
                                        }
                                    }
                                    if ([undefined, 5].includes(near.primaryIndex)) {
                                        if (near.secondaryIndex == 10) {
                                            if (bqr >= (bqp ? 10 : 20) && tmpObj.damageThreat + bqr >= 80 && tmpObj.shameCount < 6) {
                                                healer();
                                            } else {
                                                bqs(bqq);
                                            }
                                        } else if (near.primaryVariant >= 2 || near.primaryVariant == undefined) {
                                            if (bqr >= (bqp ? 15 : 20) && tmpObj.damageThreat + bqr >= 50 && tmpObj.shameCount < 6) {
                                                healer();
                                            } else {
                                                bqs(bqq);
                                            }
                                        } else if ([undefined || 15].includes(near.secondaryIndex)) {
                                            if (bqk > (bqp ? 8 : 20) && player.damageThreat >= 25 && game.tick - player.antiTimer > 1) {
                                                if (tmpObj.shameCount < 5) {
                                                    healer();
                                                } else {
                                                    bqs(bqq);
                                                }
                                            } else {
                                                bqs(bqq);
                                            }
                                        } else if ([9, 12, 13].includes(near.secondaryIndex)) {
                                            if (bqr >= 25 && player.damageThreat + bqr >= 70 && tmpObj.shameCount < 6) {
                                                healer();
                                            } else {
                                                bqs(bqq);
                                            }
                                        } else if (bqk > 25 && player.damageThreat + bqr >= 95) {
                                            healer();
                                        } else {
                                            bqs(bqq);
                                        }
                                    }
                                    if (near.primaryIndex == 6) {
                                        if (near.secondaryIndex == 15) {
                                            if (bqk >= 25 && tmpObj.damageThreat + bqr >= 95 && tmpObj.shameCount < 4) {
                                                healer();
                                            } else {
                                                bqs(bqq);
                                            }
                                        } else if (bqk >= 70 && tmpObj.shameCount < 4) {
                                            healer();
                                        } else {
                                            bqs(bqq);
                                        }
                                    }
                                    if (bqk >= 30 && near.reloads[near.secondaryIndex] == 0 && near.dist2 <= 150 && player.skinIndex == 11 && player.tailIndex == 21) {
                                        instaC.canCounter = true;
                                    }
                                } else if (bqk >= 70) {
                                    healer();
                                } else {
                                    bqs(bqq);
                                }
                            } else {
                                if (bqk >= (bqp ? 8 : 25) && bqr + player.damageThreat >= 80 && game.tick - player.antiTimer > 1) {
                                    if (tmpObj.reloads[53] == 0 && tmpObj.reloads[tmpObj.weapons[1]] == 0) {
                                        tmpObj.canEmpAnti = true;
                                    } else {
                                        player.soldierAnti = true;
                                    }
                                    tmpObj.antiTimer = game.tick;
                                    let bqx = [0, 4, 6, 7, 8].includes(near.primaryIndex) ? 2 : 5;
                                    if (tmpObj.shameCount < bqx) {
                                        healer();
                                    } else if (near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21)) {
                                        bqs(bqq);
                                    } else {
                                        bqs(bqq, 1);
                                    }
                                } else if (near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21)) {
                                    bqs(bqq);
                                } else {
                                    bqs(bqq, 1);
                                }
                                if (bqk >= 25 && near.dist2 <= 140 && player.skinIndex == 11 && player.tailIndex == 21) {
                                    instaC.canCounter = true;
                                }
                            }
                        } else if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || tmpObj.latestTail == 13 && tmpObj.damaged == 2)) {
                            tmpObj.setPoisonTick = true;
                        }
                    }
                } else {
                    let [bqy, bqz, bra] = bqf;
                    let brb = 100 - bqz;
                    let brc = players.find(acs => acs.sid == bqy);
                    let brd = false;
                    if (brc == player) {
                        if (brc.skinIndex == 7 && (bra == 5 || brc.latestTail == 13 && bra == 2)) {
                            if (my.reSync) {
                                my.reSync = false;
                                brc.setBullTick = true;
                                brd = true;
                            }
                        }
                        if (inGame) {
                            let bre = getAttacker(bra);
                            let brf = [0.25, 0.45].map(brg => brg * items.weapons[player.weapons[0]].dmg * soldierMult());
                            let brh = enemy.length ? !brd && brf.includes(bra) && near.skinIndex == 11 : false;
                            let bri = 60;
                            let brj = 100 - player.health;
                            let brk = [2, 5][
                                [0, 4, 6, 7, 8].includes(near.primaryIndex) ? 0 : 1
                            ];
                            let brl = function(brm, brn) {
                                if (!brn) {
                                    setTimeout(() => healer(), brm);
                                } else {
                                    game.tickBase(() => healer(), 2);
                                }
                            };
                            if (getEl("healingBeta").checked) {
                                let brp = [0, 7, 8].includes(near.primaryIndex) ? bra < 75 : [1, 2, 6].includes(near.primaryIndex) ? bra >= 25 && player.damageThreat + brj >= 95 && brc.shameCount < 5 : [undefined, 5].includes(near.primaryIndex) ? brj >= (brh ? 15 : 20) && brc.damageThreat + brj >= 50 && brc.shameCount < 6 : near.primaryIndex == 3 && near.secondaryIndex == 15 ? bra >= 35 && player.damageThreat + brj >= 95 && brc.shameCount < 5 && game.tick - player.antiTimer > 1 : near.primaryIndex == 4 ? near.primaryVariant >= 1 ? bra >= 10 && player.damageThreat + brj >= 95 && brc.shameCount < 4 : bra >= 35 && player.damageThreat + brj >= 95 && brc.shameCount < 3 : near.primaryIndex == 6 && near.secondaryIndex == 15 ? bra >= 25 && brc.damageThreat + brj >= 95 && brc.shameCount < 4 : bra >= 25 && player.damageThreat + brj >= 95;
                                if (brp) {
                                    healer();
                                } else {
                                    brl(bri);
                                }
                            } else {
                                let brq = bra >= (brh ? 8 : 25) && brj + player.damageThreat >= 80 && game.tick - player.antiTimer > 1;
                                if (brq) {
                                    if (brc.reloads[53] == 0 && brc.reloads[brc.weapons[1]] == 0) {
                                        brc.canEmpAnti = true;
                                    } else {
                                        player.soldierAnti = true;
                                    }
                                    brc.antiTimer = game.tick;
                                    if (brc.shameCount < brk) {
                                        healer();
                                    } else {
                                        brl(bri, near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21) ? 0 : 1);
                                    }
                                } else {
                                    brl(bri, near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21) ? 0 : 1);
                                }
                            }
                        } else if (!brc.setPoisonTick && (brc.damaged == 5 || brc.latestTail == 13 && brc.damaged == 2)) {
                            brc.setPoisonTick = true;
                        }
                    }
                }
            });
            advHeal = [];
        }
        players.forEach(brr => {
            if (!brr.visible && player != brr) {
                brr.reloads = {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                    12: 0,
                    13: 0,
                    14: 0,
                    15: 0,
                    53: 0
                };
            }
            if (brr.setBullTick) {
                brr.bullTimer = 0;
            }
            if (brr.setPoisonTick) {
                brr.poisonTimer = 0;
            }
            brr.updateTimer();
        });
        if (inGame) {
            if (enemy.length) {
                if (!instaC.isTrue && getEl("preTick").checked && my.anti0Tick <= 0) {
                    let brt = knockBackPredict();
                    if (brt == "insta them" && (![9, 12, 13, 15].includes(player.weapons[1]) || near.dist2 <= items.weapons[player.weapons[1]].range + player.scale * 1.8)) {
                        instaC.changeType(configs.revTick || player.weapons[1] == 10 ? "rev" : "normal");
                        if (getEl("notifs").checked) {
                            notif("KBSpikeTick");
                        }
                    }
                    if (brt == "primary sync") {
                        instaC.spikeTickType("rev");
                    }
                }
                let bru = gameObjects.filter(brv => brv.dmg && brv.active && brv.isTeamObject(player) && UTILS.getDist(brv, near, 0, 3) <= brv.scale + near.scale).sort(function(brw, brx) {
                    return UTILS.getDist(brw, near, 0, 2) - UTILS.getDist(brx, near, 0, 2);
                })[0];
                if (bru) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && getEl("preTick").checked) {
                        instaC.canSpikeTick = true;
                        instaC.syncHit = true;
                        if (getEl("notifs").checked) {
                            notif("AKH");
                        }
                        if (getEl("revTick").checked && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
                            instaC.revTick = true;
                            if (getEl("notifs").checked) {
                                notif("revTick");
                            }
                        }
                    }
                }
                let brz = undefined;
                let bsa = tmpObj.damaged;
                let bsb = gameObjects.filter(bsc => bsc.dmg && bsc.active && !bsc.isTeamObject(player) && UTILS.getDist(bsc, player, 0, 3) < bsc.scale + 40 + player.scale).sort(function(bsd, bse) {
                    return UTILS.getDist(bsd, player, 0, 5) - UTILS.getDist(bse, player, 0, 5);
                })[0];
                let bsg = bsb && brz <= 45 && near.primaryIndex == [5, 4, 3, 7];
                let bsh = near.skinIndex == 7 && brz <= 60;
                let bsi = near.dist2 <= items.weapons[near.primaryIndex || 5].range + near.scale * 1.2;
                let bsj = near.skinIndex == 7;
                let bsk = near.primaryIndex == 5 && brz >= 45 && bsl();
                let bsm = near.secondaryIndex == 0 && brz >= 10 && bsn();
                let bso = near.primaryIndex == 3 && brz >= 30 && bsp();
                let bsq = near.secondaryIndex == 15 && brz >= 30 && bsr();
                let bss = near.secondaryIndex == 13 && brz && bst();
                let bsu = near.primaryIndex == 5 && brz && bsv();
                let bsw = near.secondaryIndex == 15 && brz && bsx();
                let bsy = near.primaryIndex == 5 && brz >= 45 && bsz();
                let bta = near.primaryIndex == 4 && brz >= 33 && btb();
                let btc = near.secondaryIndex == 9 && brz >= 25 && btd();
                let bte = [5, 7, 4, 3].includes(near.primaryIndex) && player.damageThreat && brz >= 20;
                let btf = btg;
                let bth = bsl;
                async function btg() {
                    while (traps.inTrap) {
                        await new Promise(btj => setTimeout(btj, 1));
                        if (bsb && brz >= 70 || bsb && bsa >= 70) {
                            while (bsb && brz >= 70 || bsb && bsa >= 70) {
                                await new Promise(btk => setTimeout(btk, 1));
                                if (brz <= 70 && !bsa) {
                                    return;
                                }
                            }
                        }
                    }
                }
                async function bst() {
                    while (near.secondaryIndex == 13) {
                        await new Promise(btm => setTimeout(btm, 1));
                        if (near.primaryIndex == 5 && near.secondaryIndex != 13 && brz >= 37) {
                            return;
                        }
                    }
                }
                async function btd() {
                    while (near.secondaryIndex == 9) {
                        await new Promise(bto => setTimeout(bto, 1));
                        if (near.primaryIndex == 4 && near.secondaryIndex != 9 && brz >= 30) {
                            return;
                        }
                    }
                }
                async function btb() {
                    while (near.primaryIndex == 4) {
                        await new Promise(btq => setTimeout(btq, 1));
                        if (near.secondaryIndex == 9 && near.primaryIndex != 4 && brz >= 18) {
                            return;
                        }
                    }
                }
                async function bsl() {
                    while (near.primaryIndex == 5) {
                        await new Promise(bts => setTimeout(bts, 1));
                        if (near.secondaryIndex == 0 && near.primaryIndex != 5 && brz >= 5) {
                            return;
                        }
                    }
                }
                async function bsn() {
                    while (near.secondaryIndex == 0) {
                        await new Promise(btu => setTimeout(btu, 1));
                        if (near.primaryIndex == 5 && near.secondaryIndex != 0 && brz >= 40) {
                            return;
                        }
                    }
                }
                async function bsz() {
                    while (near.primaryIndex == 5) {
                        await new Promise(btw => setTimeout(btw, 1));
                        if (near.secondaryIndex == 15 && near.primaryIndex != 5 && brz >= 30) {
                            return;
                        }
                    }
                }
                async function bsr() {
                    while (near.secondaryIndex == 15) {
                        await new Promise(bty => setTimeout(bty, 1));
                        if (near.primaryIndex == 3 && near.secondaryIndex != 15 && brz >= 20) {
                            return;
                        }
                    }
                }
                async function bsp() {
                    while (near.primaryIndex == 3) {
                        await new Promise(bua => setTimeout(bua, 1));
                        if (near.secondaryIndex == 15 && near.primaryIndex != 3 && brz >= 37) {
                            return;
                        }
                    }
                }
                async function bsv() {
                    while (near.primaryIndex == 5) {
                        await new Promise(buc => setTimeout(buc, 1));
                        if (near.secondaryIndex == 13 && near.primaryIndex != 5 && brz >= 30) {
                            return;
                        }
                    }
                }
                async function bsx() {
                    while (near.secondaryIndex == 15) {
                        await new Promise(bue => setTimeout(bue, 1));
                        if (near.primaryIndex == 5 && near.secondaryIndex != 15 && brz >= 35) {
                            return;
                        }
                    }
                }
                async function buf() {
                    while (near.secondaryIndex == 0) {
                        await new Promise(buh => setTimeout(buh, 1));
                        if (near.primaryIndex == 4 && near.secondaryIndex != 0 && brz >= 30) {
                            return;
                        }
                    }
                }
                if (instaC.can && !traps.inTrap || traps.inTrap && player.skinIndex == 40) {
                    if ([0].includes(near.secondaryIndex) && near.secondaryIndex == 0 && player.damageThreat && buf && brz >= 10 || bsj && [9].includes(near.secondaryIndex) && near.primaryIndex == 4 && player.damageThreat && btc && brz >= 10 || bsj && [4].includes(near.primaryIndex) && near.primaryIndex == 4 && player.damageThreat && bta && brz >= 33 || bsj && [4].includes(near.primaryIndex) && near.primaryIndex == 4 && player.damageThreat && bsl && brz >= 45 || [15].includes(near.secondaryIndex) && near.secondaryIndex == 15 && player.damageThreat && bsq && brz >= 30 || bsj && [3].includes(near.primaryIndex) && near.primaryIndex == 3 && player.damageThreat && bso && brz >= 30 || [0].includes(near.secondaryIndex) && near.secondaryIndex == 0 && player.damageThreat && bsm && brz >= 10 || bsj && [5].includes(near.primaryIndex) && near.primaryIndex == 5 && player.damageThreat && bsk && brz >= 45 || bsj && [5].includes(near.primaryIndex) && near.primaryIndex == 5 && player.damageThreat && bsu && brz >= 45 || [5].includes(near.primaryIndex) && near.primaryIndex == 5 && player.damageThreat && bsy && brz >= 45 || [15].includes(near.secondaryIndex) && near.secondaryIndex == 15 && player.damageThreat && bsw && brz >= 30 || [0].includes(near.secondaryIndex) && near.secondaryIndex == 13 && player.damageThreat && bst && brz >= 10) {
                        autoQ = true;
                        buyEquip(6, 0);
                    }
                }
                let bui = gameObjects.filter(buj => buj.dmg && buj.active && !buj.isTeamObject(player) && UTILS.getDist(buj, player, 0, 3) < buj.scale + player.scale).sort(function(buk, bul) {
                    return UTILS.getDist(buk, player, 0, 2) - UTILS.getDist(bul, player, 0, 2);
                })[0];
                if (bui && !traps.inTrap) {
                    if (near.dist2 <= items.weapons[5].range + near.scale * 1.8) {
                        my.anti0Tick = 1;
                        buyEquip(6, 0);
                    }
                    if (bui && traps.inTrap) {
                        if (near.dist3 <= items.weapons[5].range + near.scale * 1.8) {
                            my.anti0Tick = 4;
                            buyEquip(6, 0);
                        }
                    }
                }
            }
            if ((useWasd ? true : (player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100)) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || useWasd && Math.floor(Math.random() * 5) == 0) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && (useWasd ? true(player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate)) : true) && instaC.perfCheck(player, near)) {
                if (player.checkCanInsta(true) >= 100) {
                    instaC.nobull = useWasd ? false : instaC.canSpikeTick ? false : true;
                } else {
                    instaC.nobull = false;
                }
                instaC.can = true;
            } else {
                instaC.can = false;
            }
            if (macro.q) {
                place(0, getAttackDir());
            }
            if (macro.f) {
                place(4, getSafeDir());
            }
            if (macro.v) {
                place(2, getSafeDir());
            }
            if (macro.y) {
                place(5, getSafeDir());
            }
            if (macro.h) {
                place(player.getItemType(22), getSafeDir());
            }
            if (macro.n) {
                place(3, getSafeDir());
            }
            laztPoz.x = player.x;
            laztPoz.y = player.y;
            let bun = mills.size(items.list[player.items[3]].scale);
            let buo = mills.dist(items.list[player.items[3]].scale);
            if (UTILS.getDist(mills, player, 0, 2) > buo + items.list[player.items[3]].placeOffset && game.tick % 2 == 0) {
                if (mills.place) {
                    let bup = {
                        x: mills.x,
                        y: mills.y
                    };
                    let buq = UTILS.getDirect(bup, player, 0, 2);
                    checkPlace(3, buq + UTILS.toRad(bun));
                    checkPlace(3, buq - UTILS.toRad(bun));
                    checkPlace(3, buq);
                    mills.count = Math.max(0, mills.count - 1);
                }
                mills.x = player.x2;
                mills.y = player.y2;
            }
            if (pads.placeSpawnPads) {
                for (let bur = 0; bur < Math.PI * 2; bur += Math.PI / 2) {
                    checkPlace(player.getItemType(20), UTILS.getDirect(player.oldPos, player, 2, 2) + bur);
                }
            }
            if (instaC.can) {
                instaC.changeType(player.weapons[1] == 10 ? "rev" : "normal");
            }
            if (getEl("smartInsta").checked) {
                if (player.weapons[1] == 15 || player.weapons[1] == 9 || player.weapons[1] == 12 || player.weapons[1] == 13) {
                    if (getEl("AutoInsta").value == "smart") {
                        if (near.shameCount >= 5 && player.reloads[player.weapons[0]] === 0 && !instaC.isTrue && !clicks.right && player.reloads[player.weapons[1]] === 0 && near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && player.weapons[1] !== 10) {
                            instaC.changeType(player.weapons[1] == 9 || player.weapons[1] == 12 || player.weapons[1] == 13 ? "rev" : "normal");
                            if (getEl("notifs").checked) {
                                notif("AutoInsta:5 Shame");
                            }
                        }
                    }
                }
                if (getEl("AutoInsta").value == "always" && player.reloads[player.weapons[0]] === 0 && !instaC.isTrue && !clicks.right && player.reloads[player.weapons[1]] === 0 && near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && player.weapons[1] !== 10) {
                    instaC.changeType(player.weapons[1] == 9 || player.weapons[1] == 12 || player.weapons[1] == 13 ? "rev" : "normal");
                }
            }
            if (instaC.canCounter && !Leuchtturm) {
                instaC.canCounter = false;
                if (player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                    instaC.counterType();
                }
            }
            if (instaC.canSpikeTick) {
                instaC.canSpikeTick = false;
                if (instaC.revTick) {
                    instaC.revTick = false;
                    if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[1]] == 0 && !instaC.isTrue) {
                        instaC.changeType("rev");
                    }
                } else if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                    instaC.spikeTickType();
                    if (instaC.syncHit) {}
                }
            }
            if (!clicks.middle && (clicks.left || clicks.right) && !instaC.isTrue) {
                if (player.weaponIndex != (clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
                    selectWeapon(clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                }
                if (player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                    sendAutoGather();
                    my.waitHit = 1;
                    game.tickBase(() => {
                        sendAutoGather();
                        my.waitHit = 0;
                    }, 1);
                }
            }
            if (useWasd && !clicks.left && !clicks.right && !instaC.isTrue && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) {
                if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
                    selectWeapon(player.weapons[0]);
                }
                if (player.reloads[player.weapons[0]] == 0 && !my.waitHit) {
                    sendAutoGather();
                    my.waitHit = 1;
                    game.tickBase(() => {
                        sendAutoGather();
                        my.waitHit = 0;
                    }, 1);
                }
                new ver();
            }
            if (traps.inTrap) {
                let buv = liztobj.sort((buw, bux) => fgdo(player, buw) - fgdo(player, bux));
                let buz = buv.filter(bva => (bva.name == "spikes" || bva.name == "greater spikes" || bva.name == "spinning spikes" || bva.name == "poison spikes") && fgdo(player, bva) < player.scale + bva.scale + 20 && !isAlly(bva.owner.sid) && bva.active)[0];
                if (!clicks.left && !clicks.right && !instaC.isTrue) {
                    if (buz && player.weapons[1] === 10) {
                        tracker.draw3.active = true;
                        traps.aim = Math.atan2(buz.y - player.y, buz.x - player.x);
                    }
                    if (player.weaponIndex != (traps.notFast() ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
                        tracker.draw3.active = true;
                        selectWeapon(traps.notFast() ? player.weapons[1] : player.weapons[0]);
                    }
                    if (player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                        sendAutoGather();
                        my.waitHit = 1;
                        game.tickBase(() => {
                            sendAutoGather();
                            my.waitHit = 0;
                        }, 1);
                    }
                }
            }
            if (clicks.middle && !traps.inTrap) {
                if (!instaC.isTrue && player.reloads[player.weapons[1]] == 0) {
                    if (my.ageInsta && player.weapons[0] != 4 && player.weapons[1] == 9 && player.age >= 9 && enemy.length) {
                        instaC.bowMovement();
                    } else {
                        instaC.rangeType();
                    }
                }
            }
            if (player.weapons[1] && !clicks.left && !clicks.right && !traps.inTrap && !instaC.isTrue && (!useWasd || !(near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8))) {
                if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                    if (!my.reloaded) {
                        my.reloaded = true;
                        let bvc = items.weapons[player.weapons[0]].spdMult < items.weapons[player.weapons[1]].spdMult ? 1 : 0;
                        if (player.weaponIndex != player.weapons[bvc] || player.buildIndex > -1) {
                            selectWeapon(player.weapons[bvc]);
                        }
                    }
                } else {
                    my.reloaded = false;
                    if (useWasd) {
                        autos.stopspin = false;
                    }
                    if (player.reloads[player.weapons[0]] > 0) {
                        if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
                            selectWeapon(player.weapons[0]);
                        }
                    } else if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] > 0) {
                        if (player.weaponIndex != player.weapons[1] || player.buildIndex > -1) {
                            selectWeapon(player.weapons[1]);
                        }
                        if (useWasd) {
                            if (!autos.stopspin) {
                                setTimeout(() => {
                                    autos.stopspin = true;
                                }, 750);
                            }
                        }
                    }
                }
            }
            if (!instaC.isTrue && !traps.inTrap && !traps.replaced) {
                traps.autoPlace();
            }
            if (!macro.q && !macro.f && !macro.v && !macro.h && !macro.n) {
                packet("D", getAttackDir());
            }
            let bve = function() {
                if (my.anti0Tick > 0 || Leuchtturm) {
                    buyEquip(6, 0);
                } else if (clicks.left || clicks.right) {
                    if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45 || my.reSync) && (near && near.dist2 > 140 || !near)) {
                        buyEquip(7, 0);
                    } else if (clicks.left) {
                        buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 22 : player.soldierAnti ? 6 : getEl("antiBullType").value == "abreload" && near.antiBull > 0 ? 6 : near.dist2 <= 275 ? getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0 && (player.weapons[0] == 4 || player.weapons[0] == 3) && near.primaryIndex != 5 ? 6 : 6 : 6, 0);
                    } else if (clicks.right) {
                        buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : player.soldierAnti ? 6 : getEl("antiBullType").value == "abreload" && near.antiBull > 0 ? 6 : near.dist2 <= 275 ? getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0 && (player.weapons[0] == 4 || player.weapons[0] == 3) && near.primaryIndex != 5 ? 6 : 6 : biomeGear(1, 1), 0);
                    }
                } else if (traps.inTrap) {
                    if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                        buyEquip(40, 0);
                    } else if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 7 || 0 && player.skinIndex != 45 || my.reSync) && (near && near.dist2 > 140 || !near)) {
                        buyEquip(6, 0);
                        setTimeout(() => {
                            buyEquip(7, 0);
                        }, 120);
                    } else {
                        buyEquip(player.empAnti || near.dist2 > 300 || !enemy.length ? 22 : 6, 0);
                    }
                } else if (player.empAnti || player.soldierAnti) {
                    buyEquip(player.empAnti ? 22 : 6, 0);
                } else if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45 || my.reSync) && (near && near.dist2 > 140 || !near)) {
                    buyEquip(7, 0);
                    setTimeout(() => {
                        buyEquip(7, 0);
                    }, 120);
                } else if (near.dist2 <= 275) {
                    buyEquip(getEl("antiBullType").value == "abreload" && near.antiBull > 0 ? 6 : getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0 ? 6 : 6, 0);
                } else {
                    biomeGear(1);
                }
            };
            let bvg = function() {
                if (instaC.can && player.checkCanInsta(true) >= 100) {
                    buyEquip(21, 1);
                } else if (clicks.left) {
                    setTimeout(() => {
                        buyEquip(21, 1);
                    }, 100);
                } else if (clicks.right) {
                    setTimeout(() => {
                        buyEquip(21, 1);
                    }, 50);
                } else if (near.dist2 <= 350 && !traps.inTrap) {
                    buyEquip(19, 1);
                } else if (traps.inTrap) {
                    buyEquip(21, 1);
                } else {
                    buyEquip(11, 1);
                }
            };
            let bvi = function() {
                if (my.anti0Tick > 0) {
                    buyEquip(6, 0);
                } else if (clicks.left || clicks.right) {
                    if (player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45 || my.reSync) {
                        buyEquip(7, 0);
                    } else if (clicks.left) {
                        buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : 11);
                    } else if (clicks.right) {
                        buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : 6, 0);
                    }
                } else if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) {
                    if (player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45 || my.reSync) {
                        buyEquip(7, 0);
                    } else {
                        buyEquip(player.reloads[player.weapons[0]] == 0 ? 7 : player.empAnti ? 22 : 6, 0);
                    }
                } else if (traps.inTrap) {
                    if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                        buyEquip(40, 0);
                    } else if (player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45 || my.reSync) {
                        buyEquip(7, 0);
                    } else {
                        buyEquip(player.empAnti ? 22 : 6, 0);
                    }
                } else if (player.empAnti) {
                    buyEquip(22, 0);
                } else if (player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45 || my.reSync) {
                    buyEquip(7, 0);
                } else {
                    buyEquip(6, 0);
                }
                if (clicks.left || clicks.right) {
                    if (clicks.left) {
                        setTimeout(() => {
                            buyEquip(0, 1);
                        }, 50);
                    } else if (clicks.right) {
                        buyEquip(11, 1);
                    }
                } else if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) {
                    buyEquip(0, 1);
                } else if (traps.inTrap) {
                    buyEquip(0, 1);
                } else {
                    buyEquip(11, 1);
                }
            };
            if (near.weaponIndex > 1 && near.dist2 <= 150) {
                buyEquip(6, 0);
            }
            if (storeMenu.style.display != "block" && !instaC.isTrue && !instaC.ticking) {
                if (useWasd) {
                    bvi();
                } else {
                    bve();
                    bvg();
                }
            }
            if (player.alive && inGame && getEl("safeWalk").checked) {
                safeWalk();
            }
            if (getEl("autoPush").checked && enemy.length && !traps.inTrap && !instaC.ticking) {
                autoPush();
            } else if (my.autoPush) {
                my.autoPush = false;
                packet("9", lastMoveDir || undefined, 1);
            }
            if (!my.autoPush && pathFind.active) {
                Pathfinder();
            }
            instaC.ticking &&= false;
            instaC.syncHit &&= false;
            player.empAnti &&= false;
            player.soldierAnti &&= false;
            if (my.anti0Tick > 0) {
                my.anti0Tick--;
            }
            traps.replaced &&= false;
            traps.antiTrapped &&= false;
        }
    }
    if (botSkts.length) {
        botSkts.forEach(bvk => {
            if (true) {
                bvk[0].showName = "YEAHHH";
            }
        });
    }
    AutoReplace();
}
for (var i1 = 0; i1 < liztobj.length; i1++) {
    if (liztobj[i1].active && liztobj[i1].health > 0 && UTILS.getDist(liztobj[i1], player, 0, 2) < 150 && getEl("antipush").checked) {
        tracker.draw3.active = true;
        if (liztobj[i1].name.includes("spike") && liztobj[i1]) {
            tracker.draw3.active = true;
            if (liztobj[i1].owner.sid != player.sid && clicks.left == false && tmpObj.reloads[tmpObj.secondaryIndex] == 0) {
                tracker.draw3.active = true;
                selectWeapon(player.weapons[1]);
                buyEquip(40, 0);
                packet("D", UTILS.getDirect(liztobj[i1], player, 0, 2));
                setTickout(() => {
                    buyEquip(6, 0);
                }, 1);
            }
        }
    };
}

function ez(bvm, bvn, bvo) {
    bvm.fillStyle = "rgba(0, 255, 255, 0.2)";
    bvm.beginPath();
    bvm.arc(bvn, bvo, 55, 0, Math.PI * 2);
    bvm.fill();
    bvm.closePath();
    bvm.globalAlpha = 1;
}
var leaderboard = getEl("leaderboard");

function updateLeaderboard(bvq) {
    lastLeaderboardData = bvq;
    UTILS.removeAllChildren(leaderboardData);
    let bvs = 1;
    for (let bvt = 0; bvt < bvq.length; bvt += 3) {
        (function(bvu) {
            UTILS.generateElement({
                class: "leaderHolder",
                parent: leaderboardData,
                children: [UTILS.generateElement({
                    class: "leaderboardItem",
                    style: "font-family: 'Hammersmith One', cursive; color:" + (bvq[bvu] == playerSID ? "#fff" : "rgba(255,255,255,0.6)") + "; font-size: 16px;",
                    text: bvq[bvu + 1] != "" ? bvq[bvu + 1] + " " : "unknown"
                }), UTILS.generateElement({
                    class: "leaderScore",
                    style: "font-family: 'Hammersmith One', cursive; font-size: 16px; color: #fff;",
                    text: UTILS.sFormat(bvq[bvu + 2]) || "0"
                })]
            });
        })(bvt);
        bvs++;
    }
}
$("#leaderboard").css({
    "-webkit-border-radius": "0px",
    "-moz-border-radius": "0px",
    "border-radius": "15px",
    "background-color": "transparent",
    "box-shadow": "0 0 5px 2px rgba(255,255,255,0.6)",
    "text-align": "center"
});
var leaderboardElement = document.getElementById("leaderboard");
leaderboardElement.style.position = "fixed";
leaderboardElement.style.top = "10px";
leaderboardElement.style.right = "10px";
var killCounterElement = document.getElementById("killCounter");
killCounterElement.style.position = "fixed";
killCounterElement.style.bottom = "220px";
killCounterElement.style.left = "20px";
killCounterElement.style.width = "25px";
var allianceButton = getEl("allianceButton");
var storeButton = getEl("storeButton");
allianceButton.style.right = "330px";
allianceButton.style.width = "40px";
storeButton.style.right = "270px";
storeButton.style.width = "40px";

function loadGameObject(bvw) {
    for (let bvy = 0; bvy < bvw.length;) {
        objectManager.add(bvw[bvy], bvw[bvy + 1], bvw[bvy + 2], bvw[bvy + 3], bvw[bvy + 4], bvw[bvy + 5], items.list[bvw[bvy + 6]], true, bvw[bvy + 7] >= 0 ? {
            sid: bvw[bvy + 7]
        } : null);
        bvy += 8;
    }
}

function loadAI(bvz) {
    for (let bwb = 0; bwb < ais.length; ++bwb) {
        ais[bwb].forcePos = !ais[bwb].visible;
        ais[bwb].visible = false;
    }
    if (bvz) {
        let bwc = performance.now();
        for (let bwd = 0; bwd < bvz.length;) {
            tmpObj = ais.find(acs => acs.sid == bvz[bwd]);
            if (tmpObj) {
                tmpObj.index = bvz[bwd + 1];
                tmpObj.t1 = tmpObj.t2 === undefined ? bwc : tmpObj.t2;
                tmpObj.t2 = bwc;
                tmpObj.x1 = tmpObj.x;
                tmpObj.y1 = tmpObj.y;
                tmpObj.x2 = bvz[bwd + 2];
                tmpObj.y2 = bvz[bwd + 3];
                tmpObj.d1 = tmpObj.d2 === undefined ? bvz[bwd + 4] : tmpObj.d2;
                tmpObj.d2 = bvz[bwd + 4];
                tmpObj.health = bvz[bwd + 5];
                tmpObj.dt = 0;
                tmpObj.visible = true;
            } else {
                tmpObj = aiManager.spawn(bvz[bwd + 2], bvz[bwd + 3], bvz[bwd + 4], bvz[bwd + 1]);
                tmpObj.x2 = tmpObj.x;
                tmpObj.y2 = tmpObj.y;
                tmpObj.d2 = tmpObj.dir;
                tmpObj.health = bvz[bwd + 5];
                if (!aiManager.aiTypes[bvz[bwd + 1]].name) {
                    tmpObj.name = config.cowNames[bvz[bwd + 6]];
                }
                tmpObj.forcePos = true;
                tmpObj.sid = bvz[bwd];
                tmpObj.visible = true;
            }
            bwd += 7;
        }
    }
}

function animateAI(bwe) {
    tmpObj = ais.find(acs => acs.sid == bwe);
    if (tmpObj) {
        tmpObj.startAnim();
    }
}

function gatherAnimation(bwf, bwg, bwh) {
    tmpObj = players.find(acs => acs.sid == bwf);
    if (tmpObj) {
        tmpObj.startAnim(bwg, bwh);
        tmpObj.gatherIndex = bwh;
        tmpObj.gathering = 1;
        if (near.dist2 >= 150 && near.dist2 <= 300 && !tmpObj.isTeam(player) && tmpObj.weaponIndex === 5 && tmpObj.primaryVariant >= 1 && !tmpObj.secondaryIndex !== undefined && tmpObj.skinIndex === 53 && (player.canEmpAnti = true)) {
            buyEquip(6, 0);
            healer();
        }
        if (bwg) {
            let bwj = objectManager.hitObj;
            objectManager.hitObj = [];
            game.tickBase(() => {
                tmpObj = players.find(acs => acs.sid == bwf);
                let bwl = items.weapons[bwh].dmg * config.weaponVariants[tmpObj[(bwh < 9 ? "prima" : "seconda") + "ryVariant"]].val * (items.weapons[bwh].sDmg || 1) * (tmpObj.skinIndex == 40 ? 3.3 : 1);
                bwj.forEach(bwm => {
                    bwm.health -= bwl;
                    if (getEl("dmgtext").checked) {
                        const bwo = Math.floor(Math.random() * 128) + 128;
                        const bwp = Math.floor(Math.random() * 128) + 128;
                        const bwq = Math.floor(Math.random() * 128) + 128;
                        const bwr = "rgb(" + bwo + ", " + bwp + ", " + bwq + ")";
                        textManager.showText(bwm.x, bwm.y, 30, 0.1, 400, Math.round(bwl), bwr);
                    }
                });
            }, 1);
        }
    }
}
if (nears.filter(bws => bws.gathering).length > 1) {
    healer();
}

function wiggleGameObject(bwt, bwu) {
    tmpObj = gameObjects.find(acs => acs.sid == bwu);
    if (tmpObj) {
        tmpObj.xWiggle += config.gatherWiggle * Math.cos(bwt);
        tmpObj.yWiggle += config.gatherWiggle * Math.sin(bwt);
        if (tmpObj.health) {
            tmpObj.damaged = Math.min(255, tmpObj.damaged + 60);
            objectManager.hitObj.push(tmpObj);
        }
    }
}

function shootTurret(bww, bwx) {
    tmpObj = gameObjects.find(acs => acs.sid == bww);
    if (tmpObj) {
        if (config.anotherVisual) {
            tmpObj.lastDir = bwx;
        } else {
            tmpObj.dir = bwx;
        }
        tmpObj.xWiggle += config.gatherWiggle * Math.cos(bwx + Math.PI);
        tmpObj.yWiggle += config.gatherWiggle * Math.sin(bwx + Math.PI);
    }
}

function updatePlayerValue(bwz, bxa, bxb) {
    if (player) {
        player[bwz] = bxa;
        if (bwz == "points") {
            if (getEl("autoBuy").checked) {
                autoBuy.hat();
                autoBuy.acc();
            }
        } else if (bwz == "kills") {}
    }
}

function updateItems(bxf, bxg) {
    if (bxf) {
        if (bxg) {
            player.weapons = bxf;
            player.primaryIndex = player.weapons[0];
            player.secondaryIndex = player.weapons[1];
            if (!instaC.isTrue) {
                selectWeapon(player.weapons[0]);
            }
        } else {
            player.items = bxf;
        }
    }
    for (let bxi = 0; bxi < items.list.length; bxi++) {
        let bxj = items.weapons.length + bxi;
        let bxk = getEl("actionBarItem" + bxj);
        bxk.style.display = player.items.indexOf(items.list[bxi].id) >= 0 ? "inline-block" : "none";
    }
    for (let bxl = 0; bxl < items.weapons.length; bxl++) {
        let bxm = getEl("actionBarItem" + bxl);
        bxm.style.display = player.weapons[items.weapons[bxl].type] == items.weapons[bxl].id ? "inline-block" : "none";
    }
    let bxn = player.weapons[0] == 3 && player.weapons[1] == 15;
    if (bxn) {
        getEl("actionBarItem3").style.display = "none";
        getEl("actionBarItem4").style.display = "inline-block";
    }
}

function addProjectile(bxo, bxp, bxq, bxr, bxs, bxt, bxu, bxv) {
    projectileManager.addProjectile(bxo, bxp, bxq, bxr, bxs, bxt, null, null, bxu, inWindow).sid = bxv;
    runAtNextTick.push(Array.prototype.slice.call(arguments));
}

function remProjectile(bxx, bxy) {
    for (let bya = 0; bya < projectiles.length; ++bya) {
        if (projectiles[bya].sid == bxx) {
            projectiles[bya].range = bxy;
            let byb = objectManager.hitObj;
            objectManager.hitObj = [];
            game.tickBase(() => {
                let byd = projectiles[bya].dmg;
                byb.forEach(bye => {
                    if (bye.projDmg) {
                        bye.health -= byd;
                    }
                });
            }, 1);
        }
    }
}
let noob = false;
let serverReady = true;
var isProd = location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168.");
let wssws = isProd ? "wss" : "ws";
let project = new WebSocket(wssws + "://beautiful-sapphire-toad.glitch.me");
let withSync = true;
project.binaryType = "arraybuffer";
project.onmessage = function(byg) {
    let byi = byg.data;
    if (byi == "isready") {
        serverReady = true;
    }
    if (byi == "fine") {
        noob = false;
    }
    if (byi == "tezt") {}
    if (byi == "yeswearesyncer") {
        let byj = Date.now() - wsDelay;
        withSync = true;
        if (player) {}
    }
};

function allianceNotification(byk, byl) {
    let bym = bots.find(acs => acs.sid == byk);
    if (bym) {}
}

function setPlayerTeam(byn, byo) {
    if (player) {
        player.team = byn;
        player.isOwner = byo;
        if (byn == null) {
            alliancePlayers = [];
        }
    }
}

function setAlliancePlayers(byq) {
    alliancePlayers = byq;
}

function updateStoreItems(byr, bys, byt) {
    if (byt) {
        if (!byr) {
            player.tails[bys] = 1;
        } else {
            player.latestTail = bys;
        }
    } else if (!byr) {
        player.skins[bys] = 1;
        if (bys == 7) {
            my.reSync = true;
        }
    } else {
        player.latestSkin = bys;
    }
}

function isTeam(byv) {
    return byv == player || byv.team && byv.team == player.team;
}

function receiveChat(byx, byy, byz) {
    let bzb = players.find(acs => acs.sid == byx);
    let bzc = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
    if (player == bzb) {
        if (byy.includes(".dc")) {
            setTimeout(() => {
                window.leave();
            }, 50);
        } else if (byy.startsWith(".create")) {
            let bze = byy.split(" ")[1];
            if (!bze) {
                bze = "1l1l1l1l1l1l1l";
            }
            packet("L", bze);
        } else if (byy.includes(".leave")) {
            packet("N");
        }
    }
    if (getEl("autoSync").checked) {
        if (isTeam(bzb) || player == bzb) {
            if (byy.includes(".sync") && !instaC.isTrue && player.reloads[player.weapons[1]] == 0 && player.reloads[player.weapons[0]] == 0) {
                instaC.syncTry();
            }
        }
    }
    if (byy.includes("dc moonrocks")) {
        window.leave();
    }
    if (getEl("autorespond").checked) {
        if (byy.includes("mod")) {}
    }
    if (bzb) {
        if (!config.anotherVisual) {
            allChats.push(new addCh(bzb.x, bzb.y, byy, bzb));
        } else {
            bzb.chatMessage = (bzf => {
                let bzh;
                bzc.forEach(bzi => {
                    if (bzf.indexOf(bzi) > -1) {
                        bzh = "";
                        for (var bzk = 0; bzk < bzi.length; ++bzk) {
                            bzh += bzh.length ? "o" : "M";
                        }
                        var bzl = new RegExp(bzi, "g");
                        bzf = bzf.replace(bzl, bzh);
                    }
                });
                return bzf;
            })(byy);
            bzb.chatCountdown = config.chatCountdown;
        }
    } else {}
}

function updateMinimap(bzm) {
    minimapData = bzm;
}

function showText(bzn, bzo, bzp, bzq, bzr) {
    if (getEl("healAnim").checked) {
        textManager.stack.push({
            x: bzn,
            y: bzo,
            value: bzp
        });
    }
}
let bots = [];
let ranLocation = {
    x: UTILS.randInt(35, 14365),
    y: UTILS.randInt(35, 14365)
};
setInterval(() => {
    ranLocation = {
        x: UTILS.randInt(35, 14365),
        y: UTILS.randInt(35, 14365)
    };
}, 60000);
class Bot {
    constructor(bzu, bzv, bzw, bzx) {
        this.millPlace = true;
        this.id = bzu;
        this.sid = bzv;
        this.team = null;
        this.skinIndex = 0;
        this.tailIndex = 0;
        this.hitTime = 0;
        this.iconIndex = 0;
        this.enemy = [];
        this.near = [];
        this.dist2 = 0;
        this.aim2 = 0;
        this.tick = 0;
        this.itemCounts = {};
        this.latestSkin = 0;
        this.latestTail = 0;
        this.points = 0;
        this.tails = {};
        for (let bzz = 0; bzz < bzx.length; ++bzz) {
            if (bzx[bzz].price <= 0) {
                this.tails[bzx[bzz].id] = 1;
            }
        }
        this.skins = {};
        for (let caa = 0; caa < bzw.length; ++caa) {
            if (bzw[caa].price <= 0) {
                this.skins[bzw[caa].id] = 1;
            }
        }
        this.spawn = function(cab) {
            this.upgraded = 0;
            this.enemy = [];
            this.near = [];
            this.active = true;
            this.alive = true;
            this.lockMove = false;
            this.lockDir = false;
            this.minimapCounter = 0;
            this.chatCountdown = 0;
            this.shameCount = 0;
            this.shameTimer = 0;
            this.sentTo = {};
            this.gathering = 0;
            this.autoGather = 0;
            this.animTime = 0;
            this.animSpeed = 0;
            this.mouseState = 0;
            this.buildIndex = -1;
            this.weaponIndex = 0;
            this.dmgOverTime = {};
            this.noMovTimer = 0;
            this.maxXP = 300;
            this.XP = 0;
            this.age = 1;
            this.kills = 0;
            this.upgrAge = 2;
            this.upgradePoints = 0;
            this.x = 0;
            this.y = 0;
            this.zIndex = 0;
            this.xVel = 0;
            this.yVel = 0;
            this.slowMult = 1;
            this.dir = 0;
            this.nDir = 0;
            this.dirPlus = 0;
            this.targetDir = 0;
            this.targetAngle = 0;
            this.maxHealth = 100;
            this.health = this.maxHealth;
            this.oldHealth = this.maxHealth;
            this.scale = config.playerScale;
            this.speed = config.playerSpeed;
            this.resetMoveDir();
            this.resetResources(cab);
            this.items = [0, 3, 6, 10];
            this.weapons = [0];
            this.shootCount = 0;
            this.weaponXP = [];
            this.isBot = false;
            this.reloads = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0,
                12: 0,
                13: 0,
                14: 0,
                15: 0,
                53: 0
            };
            this.timeZinceZpawn = 0;
            this.whyDie = "";
            this.clearRadius = false;
            this.circlee = 0;
        };
        this.resetMoveDir = function() {
            this.moveDir = undefined;
        };
        this.resetResources = function(cae) {
            for (let cah = 0; cah < config.resourceTypes.length; ++cah) {
                this[config.resourceTypes[cah]] = cae ? 100 : 0;
            }
        };
        this.setData = function(cai) {
            this.id = cai[0];
            this.sid = cai[1];
            this.name = cai[2];
            this.x = cai[3];
            this.y = cai[4];
            this.dir = cai[5];
            this.health = cai[6];
            this.maxHealth = cai[7];
            this.scale = cai[8];
            this.skinColor = cai[9];
        };
        this.judgeShame = function() {
            if (this.oldHealth < this.health) {
                if (this.hitTime) {
                    let cal = this.tick - this.hitTime;
                    this.hitTime = 0;
                    if (cal < 2) {
                        this.lastshamecount = this.shameCount;
                        this.shameCount++;
                    } else {
                        this.lastshamecount = this.shameCount;
                        this.shameCount = Math.max(0, this.shameCount - 2);
                    }
                }
            } else if (this.oldHealth > this.health) {
                this.hitTime = this.tick;
            }
        };
        this.manageReloadaa = function() {
            if (this.shooting[53]) {
                this.shooting[53] = 0;
                this.reloads[53] = 2388.8888888888887;
            } else if (this.reloads[53] > 0) {
                this.reloads[53] = Math.max(0, this.reloads[53] - 111.11111111111111);
            }
            if (this.gathering || this.shooting[1]) {
                if (this.gathering) {
                    this.gathering = 0;
                    this.reloads[this.gatherIndex] = items.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
                    this.attacked = true;
                }
                if (this.shooting[1]) {
                    this.shooting[1] = 0;
                    this.reloads[this.shootIndex] = items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
                    this.attacked = true;
                }
            } else {
                this.attacked = false;
                if (this.buildIndex < 0) {
                    if (this.reloads[this.weaponIndex] > 0) {
                        this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - game.tickRate);
                    }
                }
            }
        };
        this.closeSockets = function(cao) {
            cao.close();
        };
        this.whyDieChat = function(caq, car) {};
    }
};
class BotObject {
    constructor(cat) {
        this.sid = cat;
        this.init = function(cav, caw, cax, cay, caz, cba, cbb) {
            cba = cba || {};
            this.active = true;
            this.x = cav;
            this.y = caw;
            this.scale = cay;
            this.owner = cbb;
            this.id = cba.id;
            this.dmg = cba.dmg;
            this.trap = cba.trap;
            this.teleport = cba.teleport;
            this.isItem = this.id != undefined;
        };
    }
};
class BotObjManager {
    constructor(cbd, cbe) {
        this.disableObj = function(cbg) {
            cbg.active = false;
            if (config.anotherVisual) {} else {
                cbg.alive = false;
            }
        };
        let cbi;
        this.add = function(cbj, cbk, cbl, cbm, cbn, cbo, cbp, cbq, cbr) {
            cbi = cbe(cbj);
            if (!cbi) {
                cbi = cbd.find(cbt => !cbt.active);
                if (!cbi) {
                    cbi = new BotObject(cbj);
                    cbd.push(cbi);
                }
            }
            if (cbq) {
                cbi.sid = cbj;
            }
            cbi.init(cbk, cbl, cbm, cbn, cbo, cbp, cbr);
        };
        this.disableBySid = function(cbu) {
            let cbw = cbe(cbu);
            if (cbw) {
                this.disableObj(cbw);
            }
        };
        this.removeAllItems = function(cbx, cby) {
            cbd.filter(cca => cca.active && cca.owner && cca.owner.sid == cbx).forEach(ccb => this.disableObj(ccb));
        };
    }
};
let botz = [];

function botSpawn(ccd) {
    let ccf;
    console.log(WS);
    let ccg = WS.url.split("wss://")[1].split("?")[0];
    ccf = ccd && new WebSocket("wss://" + ccg + "?token=re:" + encodeURIComponent(ccd));
    let cch = new Map();
    botSkts.push([cch]);
    botz.push([ccf]);
    let cci;
    let ccj = [];
    let cck = [];
    let ccl = {
        x: 0,
        y: 0,
        inGame: false,
        closeSocket: false,
        whyDie: ""
    };
    let ccm = {
        x: 0,
        y: 0
    };
    let ccn = 0;
    let cco = new BotObjManager(ccj, function(ccp) {
        return ccj.find(acs => acs.sid == ccp);
    });
    ccf.binaryType = "arraybuffer";
    ccf.first = true;
    ccf.sendWS = function(ccq) {
        let ccs = Array.prototype.slice.call(arguments, 1);
        let cct = window.msgpack.encode([ccq, ccs]);
        ccf.send(cct);
    };
    ccf.spawn = function() {
        ccf.sendWS("M", {
            name: "unknown1l",
            moofoll: 1,
            skin: "__proto__"
        });
    };
    ccf.sendUpgrade = function(ccv) {
        ccf.sendWS("H", ccv);
    };
    ccf.place = function(ccw, ccx) {
        try {
            let ccz = items.list[cch.items[ccw]];
            if (cch.itemCounts[ccz.group.id] == undefined ? true : cch.itemCounts[ccz.group.id] < (config.isSandbox ? 296 : ccz.group.limit ? ccz.group.limit : 296)) {
                ccf.sendWS("Z", cch.items[ccw]);
                ccf.sendWS("F", 1, ccx);
                ccf.sendWS("Z", cch.weaponIndex, true);
            }
        } catch (cda) {}
    };
    ccf.buye = function(cdb, cdc) {
        let cde = 0;
        if (cch.alive && cch.inGame) {
            if (cdc == 0) {
                if (cch.skins[cdb]) {
                    if (cch.latestSkin != cdb) {
                        ccf.sendWS("c", 0, cdb, 0);
                    }
                } else {
                    let cdg = findID(hats, cdb);
                    if (cdg) {
                        if (cch.points >= cdg.price) {
                            ccf.sendWS("c", 1, cdb, 0);
                            ccf.sendWS("c", 0, cdb, 0);
                        } else if (cch.latestSkin != cde) {
                            ccf.sendWS("c", 0, cde, 0);
                        }
                    } else if (cch.latestSkin != cde) {
                        ccf.sendWS("c", 0, cde, 0);
                    }
                }
            } else if (cdc == 1) {
                if (cch.tails[cdb]) {
                    if (cch.latestTail != cdb) {
                        ccf.sendWS("c", 0, cdb, 1);
                    }
                } else {
                    let cdh = findID(accessories, cdb);
                    if (cdh) {
                        if (cch.points >= cdh.price) {
                            ccf.sendWS("c", 1, cdb, 1);
                            ccf.sendWS("c", 0, cdb, 1);
                        } else if (cch.latestTail != 0) {
                            ccf.sendWS("c", 0, 0, 1);
                        }
                    } else if (cch.latestTail != 0) {
                        ccf.sendWS("c", 0, 0, 1);
                    }
                }
            }
        }
    };
    ccf.fastGear = function() {
        if (cch.y2 >= config.mapScale / 2 - config.riverWidth / 2 && cch.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
            ccf.buye(31, 0);
        } else if (cch.moveDir == undefined) {
            ccf.buye(22, 0);
        } else if (cch.y2 <= config.snowBiomeTop) {
            ccf.buye(15, 0);
        } else {
            ccf.buye(12, 0);
        }
    };
    ccf.selectWeapon = function(cdj) {
        packet("z", cdj, 1);
    };

    function cdk(cdl, cdm) {
        try {
            return Math.atan2((cdm.y2 || cdm.y) - (cdl.y2 || cdl.y), (cdm.x2 || cdm.x) - (cdl.x2 || cdl.x));
        } catch (cdp) {
            return 0;
        }
    }
    ccf.heal = function() {
        if (cch.health < 100) {
            ccf.place(0, 0);
        }
    };

    function cdr(cds, cdt) {
        try {
            return Math.hypot((cdt.y2 || cdt.y) - (cds.y2 || cds.y), (cdt.x2 || cdt.x) - (cds.x2 || cds.x));
        } catch (cdv) {
            return Infinity;
        }
    }
    let cdw = "no";
    ccf.zync = function(cdx) {
        if (!cch.millPlace) {
            cdw = "yeah";
            ccf.place(5, cdk(cch, cdx));
            let cdz = {
                x: cch.x + Math.cos(cdk(cdx, cch) - Math.PI) * 80,
                y: cch.y + Math.sin(cdk(cdx, cch) - Math.PI) * 80,
                x2: cch.x + Math.cos(cdk(cdx, cch) - Math.PI) * 80,
                y2: cch.y + Math.sin(cdk(cdx, cch) - Math.PI) * 80
            };

            function cea(ceb, cec, ced, cee) {
                let ceg = Math.sqrt(Math.pow(ced - ceb, 2) + Math.pow(cee - cec, 2));
                return ceg;
            }

            function ceh() {
                ccf.sendWS("D", cdk(cdx, cch) - Math.PI);
            }
            let cej = setInterval(() => {
                ccf.sendWS("z", cch.weapons[1], true);
                if (ccn == 0) {
                    ccf.sendWS("K", 1);
                    ccn = 1;
                }
                setTimeout(() => {
                    ccf.sendWS("z", cch.weapons[0], true);
                }, 2000);
                ccf.buye(53, 0);
                if (cea(cdz.x, cdz.y, cch.x, cch.y) > 5) {
                    ccf.sendWS("f", cdk(cch, cdz));
                } else {
                    cdw = "no";
                    ccf.sendWS("f", undefined);
                    ceh();
                    clearInterval(cej);
                }
            }, 150);
            setTimeout(() => {
                cdw = "no";
                clearInterval(cej);
            }, 500);
        }
    };
    ccf.onmessage = function(cem) {
        let ceo = new Uint8Array(cem.data);
        let cep = window.msgpack.decode(ceo);
        let ceq = cep[0];
        ceo = cep[1];
        if (ceq == "io-init") {
            ccf.spawn();
        }
        if (ceq == "1") {
            cci = ceo[0];
            console.log(cci);
        }
        if (ceq == "D") {
            if (ceo[1]) {
                cch = new Bot(ceo[0][0], ceo[0][1], hats, accessories);
                cch.setData(ceo[0]);
                cch.inGame = true;
                cch.alive = true;
                cch.x2 = undefined;
                cch.y2 = undefined;
                cch.spawn(1);
                cch.oldHealth = 100;
                cch.health = 100;
                cch.showName = "YEAHHH";
                ccm = {
                    x: ceo[0][3],
                    y: ceo[0][4]
                };
                ccl.inGame = true;
                if (ccf.first) {
                    ccf.first = false;
                    bots.push(ccl);
                }
            }
        }
        if (ceq == "P") {
            ccf.spawn();
            cch.inGame = false;
            ccl.inGame = false;
        }
        if (ceq == "f") {
            let cer = ceo[0];
            cch.tick++;
            cch.enemy = [];
            cch.near = [];
            ccf.showName = "YEAHHH";
            cck = [];
            for (let ces = 0; ces < cer.length;) {
                if (cer[ces] == cch.sid) {
                    cch.x2 = cer[ces + 1];
                    cch.y2 = cer[ces + 2];
                    cch.d2 = cer[ces + 3];
                    cch.buildIndex = cer[ces + 4];
                    cch.weaponIndex = cer[ces + 5];
                    cch.weaponVariant = cer[ces + 6];
                    cch.team = cer[ces + 7];
                    cch.isLeader = cer[ces + 8];
                    cch.skinIndex = cer[ces + 9];
                    cch.tailIndex = cer[ces + 10];
                    cch.iconIndex = cer[ces + 11];
                    cch.zIndex = cer[ces + 12];
                    cch.visible = true;
                    ccl.x2 = cch.x2;
                    ccl.y2 = cch.y2;
                }
                ces += 13;
            }
            for (let cet = 0; cet < cer.length;) {
                tmpObj = players.find(acs => acs.sid == cer[cet]);
                if (tmpObj) {
                    if (!tmpObj.isTeam(cch)) {
                        enemy.push(tmpObj);
                        if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + cch.scale * 2) {
                            nears.push(tmpObj);
                        }
                    }
                }
                cet += 13;
            }
            if (enemy.length) {
                cch.near = enemy.sort(function(ceu, cev) {
                    return ceu.dist2 - cev.dist2;
                })[0];
            }
            if (ccn == 1) {
                ccf.sendWS("K", 1);
                ccn = 0;
            }
            if (ccl.closeSocket) {
                cch.closeSockets(ccf);
            }
            if (ccl.whyDie != "") {
                cch.whyDieChat(ccf, ccl.whyDie);
                ccl.whyDie = "";
            }
            if (cch.alive) {
                if (player.team) {
                    if (cch.team != player.team && cch.tick % 9 === 0) {
                        if (cch.team) {
                            ccf.sendWS("N");
                        }
                        ccf.sendWS("b", player.team);
                    }
                }
                let cex = items.list[cch.items[3]];
                let cey = cch.itemCounts[cex.group.id];
                if ((cey != undefined ? cey : 0) < 201 && cch.millPlace) {
                    if (cch.inGame) {
                        ccf.sendWS("D", cch.moveDir);
                        if (ccn == 0) {
                            ccf.sendWS("K", 1);
                            ccn = 1;
                        }
                        if (UTILS.getDist(ccm, cch, 0, 2) > 90) {
                            let cez = UTILS.getDirect(ccm, cch, 0, 2);
                            ccf.place(3, cez + 7.7);
                            ccf.place(3, cez - 7.7);
                            ccf.place(3, cez);
                            ccm = {
                                x: cch.x2,
                                y: cch.y2
                            };
                        }
                        if (cch.tick % 90 === 0) {
                            let cfa = Math.random() * Math.PI * 2;
                            cch.moveDir = cfa;
                            ccf.sendWS("f", cch.moveDir);
                        }
                    }
                    ccf.fastGear();
                } else if ((cey != undefined ? cey : 0) > 296 && cch.millPlace) {
                    cch.millPlace = false;
                    ccf.fastGear();
                } else if (cch.inGame) {
                    if (ccj.length > 0) {
                        let cfb = ccj.filter(cfc => cfc.active && cfc.isItem && UTILS.getDist(cfc, player, 0, 2) <= 600);
                        if (getEl("mode").value == "fuckemup") {
                            ccf.selectWeapon(cch.weapons[1]);
                            let cfd = UTILS.getDist(cfb[0], cch, 0, 2);
                            let cfe = UTILS.getDirect(cfb[0], cch, 0, 2);
                            cck = ccj.filter(cff => cff.active && (cfb.find(acs => acs.sid == cff.sid) ? true : !cff.trap || player.sid != cff.owner.sid && !player.findAllianceBySid(cff.owner.sid)) && cff.isItem && UTILS.getDist(cff, cch, 0, 2) <= items.weapons[cch.weaponIndex].range + cff.scale + 10).sort(function(cfg, cfh) {
                                return UTILS.getDist(cfg, cch, 0, 2) - UTILS.getDist(cfh, cch, 0, 2);
                            })[0];
                            if (cck) {
                                let cfj = UTILS.getDist(cfb[0], cck, 0, 0);
                                if (cfd - cfj > 0) {
                                    if (cfb.find(acs => acs.sid == cck.sid) ? true : cck.dmg || cck.trap) {
                                        if (cch.moveDir != undefined) {
                                            cch.moveDir = undefined;
                                            ccf.sendWS("f", cch.moveDir);
                                            ccf.sendWS("D", cch.nDir);
                                        }
                                    } else {
                                        cch.moveDir = cfe;
                                        ccf.sendWS("f", cch.moveDir);
                                        ccf.sendWS("D", cch.nDir);
                                    }
                                    if (cch.nDir != UTILS.getDirect(cck, cch, 0, 2)) {
                                        cch.nDir = UTILS.getDirect(cck, cch, 0, 2);
                                        ccf.sendWS("D", cch.nDir);
                                    }
                                    if (ccn == 0) {
                                        ccf.sendWS("K", 1);
                                        ccn = 1;
                                    }
                                    ccf.buye(40, 0);
                                } else {
                                    cch.moveDir = cfe;
                                    ccf.sendWS("f", cch.moveDir);
                                    ccf.sendWS("D", cch.nDir);
                                    ccf.fastGear();
                                }
                            } else {
                                cch.moveDir = cfe;
                                ccf.sendWS("f", cch.moveDir);
                                ccf.sendWS("D", cch.nDir);
                                ccf.fastGear();
                            }
                        }
                    }
                    if (ccj.length > 0) {
                        if (getEl("mode").value == "flex") {
                            const cfk = cch.sid * (Math.PI * 2 / cch.sid);
                            const cfl = Math.cos(Date.now() * 0.01) * 300 + player.x;
                            const cfm = Math.sin(Date.now() * 0.01) * 300 + player.x;
                            ccf.sendWS("f", Math.atan2(cfm - cch.y, cfl - cch.x));
                            const cfn = Math.hypot(cfl - cch.x, cfm - cch.y);
                            if (cfn > 22) {
                                return;
                            }
                        }
                    }
                    if (ccj.length > 0) {
                        cck = ccj.filter(cfo => cfo.active && cfo.isItem && UTILS.getDist(cfo, cch, 0, 2) <= items.weapons[cch.weaponIndex].range).sort(function(cfp, cfq) {
                            return UTILS.getDist(cfp, cch, 0, 2) - UTILS.getDist(cfq, cch, 0, 2);
                        })[0];
                        if (cck) {
                            if (ccn == 0) {
                                ccf.sendWS("K", 1);
                                ccn = 1;
                            }
                            if (cch.nDir != UTILS.getDirect(cck, cch, 0, 2)) {
                                cch.nDir = UTILS.getDirect(cck, cch, 0, 2);
                                ccf.sendWS("D", cch.nDir);
                            }
                            ccf.buye(40, 0);
                            ccf.buye(11, 1);
                        } else {
                            ccf.fastGear();
                            ccf.buye(11, 1);
                        }
                        ccf.buye(11, 1);
                        if (breakObjects.length > 0 && getEl("mode").value == "clear") {
                            ccf.selectWeapon(cch.weapons[1]);
                            let cfs = UTILS.getDist(breakObjects[0], cch, 0, 2);
                            let cft = UTILS.getDirect(breakObjects[0], cch, 0, 2);
                            cck = ccj.filter(cfu => cfu.active && (breakObjects.find(acs => acs.sid == cfu.sid) ? true : !cfu.trap || player.sid != cfu.owner.sid && !player.findAllianceBySid(cfu.owner.sid)) && cfu.isItem && UTILS.getDist(cfu, cch, 0, 2) <= items.weapons[cch.weaponIndex].range + cfu.scale).sort(function(cfv, cfw) {
                                return UTILS.getDist(cfv, cch, 0, 2) - UTILS.getDist(cfw, cch, 0, 2);
                            })[0];
                            if (cck) {
                                let cfy = UTILS.getDist(breakObjects[0], cck, 0, 0);
                                if (cfs - cfy > 0) {
                                    if (breakObjects.find(acs => acs.sid == cck.sid) ? true : cck.dmg || cck.trap) {
                                        if (cch.moveDir != undefined) {
                                            cch.moveDir = undefined;
                                            ccf.sendWS("f", cch.moveDir);
                                            ccf.sendWS("D", cch.nDir);
                                        }
                                    } else {
                                        cch.moveDir = cft;
                                        ccf.sendWS("f", cch.moveDir);
                                        ccf.sendWS("D", cch.nDir);
                                    }
                                    if (cch.nDir != UTILS.getDirect(cck, cch, 0, 2)) {
                                        cch.nDir = UTILS.getDirect(cck, cch, 0, 2);
                                        ccf.sendWS("D", cch.nDir);
                                    }
                                    if (ccn == 0) {
                                        ccf.sendWS("K", 1);
                                        ccn = 1;
                                    }
                                    ccf.buye(40, 0);
                                    ccf.fastGear();
                                } else {
                                    cch.moveDir = cft;
                                    ccf.sendWS("f", cch.moveDir);
                                    ccf.sendWS("D", cch.nDir);
                                    ccf.fastGear();
                                }
                            } else {
                                cch.moveDir = cft;
                                ccf.sendWS("f", cch.moveDir);
                                ccf.sendWS("D", cch.nDir);
                                ccf.fastGear();
                            }
                            if (cfs > 300) {
                                if (UTILS.getDist(ccm, cch, 0, 2) > 90) {
                                    let cfz = UTILS.getDirect(ccm, cch, 0, 2);
                                    ccf.place(3, cfz + 7.7);
                                    ccf.place(3, cfz - 7.7);
                                    ccf.place(3, cfz);
                                    ccm = {
                                        x: cch.x2,
                                        y: cch.y2
                                    };
                                }
                            }
                        }
                    }
                    if (ccj.length > 0 && getEl("mode").value == "zync") {
                        let cga = ccj.filter(cgb => cgb.active && cgb.isItem && UTILS.getDist(cgb, player, 0, 2) <= items.weapons[cch.weaponIndex].range + cgb.scale);
                        if (!cga.length) {
                            if (cdw == "no") {
                                ccf.sendWS("D", UTILS.getDirect(player, cch, 0, 2));
                            }
                            ccf.sendWS("f", cdk(player, cch) + Math.PI);
                        }
                        if (cga.length) {
                            let cgc = UTILS.getDist(cga[0], cch, 0, 2);
                            let cgd = UTILS.getDirect(cga[0], cch, 0, 2);
                            cck = ccj.filter(cge => cge.active && (cga.find(acs => acs.sid == cge.sid) ? true : !cge.trap || player.sid != cge.owner.sid && !player.findAllianceBySid(cge.owner.sid)) && cge.isItem && UTILS.getDist(cge, cch, 0, 2) <= items.weapons[cch.weaponIndex].range + cge.scale).sort(function(cgf, cgg) {
                                return UTILS.getDist(cgf, cch, 0, 2) - UTILS.getDist(cgg, cch, 0, 2);
                            })[0];
                            if (cck) {
                                let cgi = UTILS.getDist(cga[0], cck, 0, 0);
                                if (cgc - cgi > 0) {
                                    if (cga.find(acs => acs.sid == cck.sid) ? true : cck.dmg || cck.trap) {
                                        if (cch.moveDir != undefined) {
                                            cch.moveDir = undefined;
                                            ccf.sendWS("f", cch.moveDir);
                                            ccf.sendWS("D", cch.nDir);
                                        }
                                    } else {
                                        ccf.sendWS("D", cch.nDir);
                                    }
                                    if (cch.nDir != UTILS.getDirect(cck, cch, 0, 2)) {
                                        cch.nDir = UTILS.getDirect(cck, cch, 0, 2);
                                        ccf.sendWS("D", cch.nDir);
                                    }
                                    if (ccn == 0) {
                                        ccf.sendWS("K", 1);
                                        ccn = 1;
                                    }
                                    ccf.buye(40, 0);
                                    ccf.fastGear();
                                } else {
                                    if (cdw == "no") {
                                        ccf.sendWS("D", UTILS.getDirect(cck, cch, 0, 2));
                                    }
                                    if (cdr(player, cch) <= 110) {
                                        ccf.sendWS("f", undefined);
                                    } else {
                                        ccf.sendWS("f", cdk(player, cch) + Math.PI);
                                    }
                                }
                            } else if (cga.length) {
                                if (cdw == "no") {
                                    ccf.sendWS("D", UTILS.getDirect(cga[0], cch, 0, 2));
                                }
                                if (cdr(player, cch) <= 110) {
                                    ccf.sendWS("f", undefined);
                                } else {
                                    ccf.sendWS("f", cdk(player, cch) + Math.PI);
                                }
                            } else {
                                if (cdw == "no") {
                                    ccf.sendWS("D", UTILS.getDirect(player, cch, 0, 2));
                                }
                                if (cdr(player, cch) <= 110) {
                                    ccf.sendWS("f", undefined);
                                } else {
                                    ccf.sendWS("f", cdk(player, cch) + Math.PI);
                                }
                            }
                        }
                    }
                }
            }
        }
        if (ceq == "H") {
            let cgj = ceo[0];
            for (let cgk = 0; cgk < cgj.length;) {
                cco.add(cgj[cgk], cgj[cgk + 1], cgj[cgk + 2], cgj[cgk + 3], cgj[cgk + 4], cgj[cgk + 5], items.list[cgj[cgk + 6]], true, cgj[cgk + 7] >= 0 ? {
                    sid: cgj[cgk + 7]
                } : null);
                cgk += 8;
            }
        }
        if (ceq == "N") {
            let cgl = ceo[0];
            let cgm = ceo[1];
            if (cch) {
                cch[cgl] = cgm;
            }
        }
        if (ceq == "O") {
            if (ceo[0] == cch.sid) {
                cch.oldHealth = cch.health;
                cch.health = ceo[1];
                cch.judgeShame();
                if (cch.oldHealth > cch.health) {
                    if (cch.shameCount < 5) {
                        for (let cgn = 0; cgn < 2; cgn++) {
                            ccf.place(0, cch.nDir);
                        }
                    } else {
                        setTimeout(() => {
                            for (let cgp = 0; cgp < 2; cgp++) {
                                ccf.place(0, cch.nDir);
                            }
                        }, 95);
                    }
                }
            }
        }
        if (ceq == "Q") {
            let cgq = ceo[0];
            cco.disableBySid(cgq);
        }
        if (ceq == "R") {
            let cgr = ceo[0];
            if (cch.alive) {
                cco.removeAllItems(cgr);
            }
        }
        if (ceq == "S") {
            let cgs = ceo[0];
            let cgt = ceo[1];
            if (cch) {
                cch.itemCounts[cgs] = cgt;
            }
        }
        if (ceq == "U") {
            if (ceo[0] > 0) {
                if (getEl("setup").value == "dm") {
                    if (cch.upgraded == 0) {
                        ccf.sendUpgrade(7);
                    } else if (cch.upgraded == 1) {
                        ccf.sendUpgrade(17);
                    } else if (cch.upgraded == 2) {
                        ccf.sendUpgrade(31);
                    } else if (cch.upgraded == 3) {
                        ccf.sendUpgrade(23);
                    } else if (cch.upgraded == 4) {
                        ccf.sendUpgrade(9);
                    } else if (cch.upgraded == 5) {
                        ccf.sendUpgrade(34);
                    } else if (cch.upgraded == 6) {
                        ccf.sendUpgrade(12);
                    } else if (cch.upgraded == 7) {
                        ccf.sendUpgrade(15);
                    }
                } else if (getEl("setup").value == "dr") {
                    if (cch.upgraded == 0) {
                        ccf.sendUpgrade(7);
                    } else if (cch.upgraded == 1) {
                        ccf.sendUpgrade(17);
                    } else if (cch.upgraded == 2) {
                        ccf.sendUpgrade(31);
                    } else if (cch.upgraded == 3) {
                        ccf.sendUpgrade(23);
                    } else if (cch.upgraded == 4) {
                        ccf.sendUpgrade(9);
                    } else if (cch.upgraded == 5) {
                        ccf.sendUpgrade(34);
                    } else if (cch.upgraded == 6) {
                        ccf.sendUpgrade(12);
                    } else if (cch.upgraded == 7) {
                        ccf.sendUpgrade(13);
                    }
                } else if (getEl("setup").value == "kh") {
                    if (cch.upgraded == 0) {
                        ccf.sendUpgrade(3);
                    } else if (cch.upgraded == 1) {
                        ccf.sendUpgrade(17);
                    } else if (cch.upgraded == 2) {
                        ccf.sendUpgrade(31);
                    } else if (cch.upgraded == 3) {
                        ccf.sendUpgrade(27);
                    } else if (cch.upgraded == 4) {
                        ccf.sendUpgrade(10);
                    } else if (cch.upgraded == 5) {
                        ccf.sendUpgrade(34);
                    } else if (cch.upgraded == 6) {
                        ccf.sendUpgrade(4);
                    } else if (cch.upgraded == 7) {
                        ccf.sendUpgrade(25);
                    }
                } else if (getEl("setup").value == "zd") {
                    if (cch.upgraded == 0) {
                        ccf.sendUpgrade(3);
                    } else if (cch.upgraded == 1) {
                        ccf.sendUpgrade(17);
                    } else if (cch.upgraded == 2) {
                        ccf.sendUpgrade(31);
                    } else if (cch.upgraded == 3) {
                        ccf.sendUpgrade(27);
                    } else if (cch.upgraded == 4) {
                        ccf.sendUpgrade(9);
                    } else if (cch.upgraded == 5) {
                        ccf.sendUpgrade(34);
                    } else if (cch.upgraded == 6) {
                        ccf.sendUpgrade(12);
                    } else if (cch.upgraded == 7) {
                        ccf.sendUpgrade(15);
                    }
                }
                cch.upgraded++;
            }
        }
        if (ceq == "V") {
            let cgu = ceo[0];
            let cgv = ceo[1];
            if (cgu) {
                if (cgv) {
                    cch.weapons = cgu;
                } else {
                    cch.items = cgu;
                }
            }
        }
        if (ceq == "5") {
            let cgw = ceo[0];
            let cgx = ceo[1];
            let cgy = ceo[2];
            if (cgy) {
                if (!cgw) {
                    cch.tails[cgx] = 1;
                } else {
                    cch.latestTail = cgx;
                }
            } else if (!cgw) {
                cch.skins[cgx] = 1;
            } else {
                cch.latestSkin = cgx;
            }
        }
        if (ceq == "6") {
            let cgz = ceo[0];
            let cha = ceo[1] + "";
            if (cgz == player.sid && cha.includes("syncon")) {
                ccf.zync(cch.near);
            }
        }
    };
    ccf.onclose = function() {
        cch.inGame = false;
        ccl.inGame = false;
    };
}
let spikes = {
    near: [],
    aim: undefined,
    nearSpike: false,
    nearBreak: false
};
let trapData = {
    sid: undefined,
    hitCount: 0
};
let tracker = {
    draw3: {
        active: false,
        x: 0,
        y: 0,
        scale: 0
    },
    draw2: {
        active: false,
        x: 0,
        y: 0,
        scale: 0
    },
    moveDir: undefined,
    lastPos: {
        x: 0,
        y: 0
    }
};

function renderLeaf(chc, chd, che, chf, chg) {
    let chi = chc + che * Math.cos(chf);
    let chj = chd + che * Math.sin(chf);
    let chk = che * 0.4;
    chg.moveTo(chc, chd);
    chg.beginPath();
    chg.quadraticCurveTo((chc + chi) / 2 + chk * Math.cos(chf + Math.PI / 2), (chd + chj) / 2 + chk * Math.sin(chf + Math.PI / 2), chi, chj);
    chg.quadraticCurveTo((chc + chi) / 2 - chk * Math.cos(chf + Math.PI / 2), (chd + chj) / 2 - chk * Math.sin(chf + Math.PI / 2), chc, chd);
    chg.closePath();
    chg.fill();
    chg.stroke();
}

function renderCircle(chl, chm, chn, cho, chp, chq) {
    cho = cho || mainContext;
    cho.beginPath();
    cho.arc(chl, chm, chn, 0, Math.PI * 2);
    if (!chq) {
        cho.fill();
    }
    if (!chp) {
        cho.stroke();
    }
}

function renderHealthCircle(chs, cht, chu, chv, chw, chx) {
    chv = chv || mainContext;
    chv.beginPath();
    chv.arc(chs, cht, chu, 0, Math.PI * 2);
    if (!chx) {
        chv.fill();
    }
    if (!chw) {
        chv.stroke();
    }
}

function renderStar(chz, cia, cib, cic) {
    let cie = Math.PI / 2 * 3;
    let cif;
    let cig;
    let cih = Math.PI / cia;
    chz.beginPath();
    chz.moveTo(0, -cib);
    for (let cii = 0; cii < cia; cii++) {
        cif = Math.cos(cie) * cib;
        cig = Math.sin(cie) * cib;
        chz.lineTo(cif, cig);
        cie += cih;
        cif = Math.cos(cie) * cic;
        cig = Math.sin(cie) * cic;
        chz.lineTo(cif, cig);
        cie += cih;
    }
    chz.lineTo(0, -cib);
    chz.closePath();
}

function renderHealthStar(cij, cik, cil, cim) {
    let cio = Math.PI / 2 * 3;
    let cip;
    let ciq;
    let cir = Math.PI / cik;
    cij.beginPath();
    cij.moveTo(0, -cil);
    for (let cis = 0; cis < cik; cis++) {
        cip = Math.cos(cio) * cil;
        ciq = Math.sin(cio) * cil;
        cij.lineTo(cip, ciq);
        cio += cir;
        cip = Math.cos(cio) * cim;
        ciq = Math.sin(cio) * cim;
        cij.lineTo(cip, ciq);
        cio += cir;
    }
    cij.lineTo(0, -cil);
    cij.closePath();
}

function renderRect(cit, ciu, civ, ciw, cix, ciy, ciz) {
    if (!ciz) {
        cix.fillRect(cit - civ / 2, ciu - ciw / 2, civ, ciw);
    }
    if (!ciy) {
        cix.strokeRect(cit - civ / 2, ciu - ciw / 2, civ, ciw);
    }
}

function renderHealthRect(cjb, cjc, cjd, cje, cjf, cjg, cjh) {
    if (!cjh) {
        cjf.fillRect(cjb - cjd / 2, cjc - cje / 2, cjd, cje);
    }
    if (!cjg) {
        cjf.strokeRect(cjb - cjd / 2, cjc - cje / 2, cjd, cje);
    }
}

function renderRectCircle(cjj, cjk, cjl, cjm, cjn, cjo, cjp, cjq) {
    cjo.save();
    cjo.translate(cjj, cjk);
    cjn = Math.ceil(cjn / 2);
    for (let cjs = 0; cjs < cjn; cjs++) {
        renderRect(0, 0, cjl * 2, cjm, cjo, cjp, cjq);
        cjo.rotate(Math.PI / cjn);
    }
    cjo.restore();
}

function renderBlob(cjt, cju, cjv, cjw) {
    let cjy = Math.PI / 2 * 3;
    let cjz;
    let cka;
    let ckb = Math.PI / cju;
    let ckc;
    cjt.beginPath();
    cjt.moveTo(0, -cjw);
    for (let ckd = 0; ckd < cju; ckd++) {
        ckc = UTILS.randInt(cjv + 0.9, cjv * 1.2);
        cjt.quadraticCurveTo(Math.cos(cjy + ckb) * ckc, Math.sin(cjy + ckb) * ckc, Math.cos(cjy + ckb * 2) * cjw, Math.sin(cjy + ckb * 2) * cjw);
        cjy += ckb * 2;
    }
    cjt.lineTo(0, -cjw);
    cjt.closePath();
}

function renderTriangle(cke, ckf) {
    ckf = ckf || mainContext;
    let ckh = cke * (Math.sqrt(3) / 2);
    ckf.beginPath();
    ckf.moveTo(0, -ckh / 2);
    ckf.lineTo(-cke / 2, ckh / 2);
    ckf.lineTo(cke / 2, ckh / 2);
    ckf.lineTo(0, -ckh / 2);
    ckf.fill();
    ckf.closePath();
}

function prepareMenuBackground() {}
const speed = 1;

function renderDeadPlayers(cki, ckj) {
    mainContext.fillStyle = "#91b2db";
    const ckl = Date.now();
    deadPlayers.filter(ckm => ckm.active).forEach(ckn => {
        if (!ckn.startTime) {
            ckn.startTime = ckl;
            ckn.angle = 0;
            ckn.radius = 0.1;
        }
        const ckp = ckl - ckn.startTime;
        const ckq = 1;
        ckn.alpha = Math.max(0, ckq - ckp / 3000);
        ckn.animate(delta);
        mainContext.globalAlpha = ckn.alpha;
        mainContext.strokeStyle = outlineColor;
        mainContext.save();
        mainContext.translate(ckn.x - cki, ckn.y - ckj);
        ckn.radius -= 0.001;
        ckn.angle += 10;
        const ckr = 1;
        const cks = ckn.radius * Math.cos(ckn.angle);
        const ckt = ckn.radius * Math.sin(ckn.angle);
        ckn.x += cks * ckr;
        ckn.y += ckt * ckr;
        mainContext.rotate(ckn.angle);
        renderDeadPlayer(ckn, mainContext);
        mainContext.restore();
        mainContext.fillStyle = "#91b2db";
        if (ckp >= 3000) {
            ckn.active = false;
            ckn.startTime = null;
        }
    });
}

function renderPlayers(cku, ckv, ckw) {
    mainContext.globalAlpha = 1;
    mainContext.fillStyle = "#91b2db";
    for (var cky = 0; cky < players.length; ++cky) {
        tmpObj = players[cky];
        if (tmpObj.zIndex == ckw) {
            tmpObj.animate(delta);
            if (tmpObj.visible) {
                tmpObj.skinRot += delta * 0.002;
                tmpDir = !getEl("showDir").checked && !useWasd && tmpObj == player ? getEl("attackDir").checked ? getVisualDir() : getSafeDir() : tmpObj.dir || 0;
                mainContext.save();
                mainContext.translate(tmpObj.x - cku, tmpObj.y - ckv);
                if (getEl("spinner").checked && tmpObj == player) {
                    mainContext.rotate(tmpDir + tmpObj.dt);
                } else {
                    mainContext.rotate(tmpDir + tmpObj.dirPlus);
                }
                renderPlayer(tmpObj, mainContext);
                mainContext.restore();
            }
        }
    }
}

function renderDeadPlayer(ckz, cla) {
    cla = cla || mainContext;
    cla.lineWidth = outlineWidth;
    cla.lineJoin = "miter";
    let clc = Math.PI / 4 * (items.weapons[ckz.weaponIndex].armS || 1);
    let cld = ckz.buildIndex < 0 ? items.weapons[ckz.weaponIndex].hndS || 1 : 1;
    let cle = ckz.buildIndex < 0 ? items.weapons[ckz.weaponIndex].hndD || 1 : 1;
    renderTail2(13, cla, ckz);
    if (ckz.buildIndex < 0 && !items.weapons[ckz.weaponIndex].aboveHand) {
        renderTool(items.weapons[ckz.weaponIndex], config.weaponVariants[ckz.weaponVariant || 0].src || "", ckz.scale, 0, cla);
        if (items.weapons[ckz.weaponIndex].projectile != undefined && !items.weapons[ckz.weaponIndex].hideProjectile) {
            renderProjectile(ckz.scale, 0, items.projectiles[items.weapons[ckz.weaponIndex].projectile], mainContext);
        }
    }
    cla.fillStyle = "#ececec";
    renderCircle(ckz.scale * Math.cos(clc), ckz.scale * Math.sin(clc), 14);
    renderCircle(ckz.scale * cle * Math.cos(-clc * cld), ckz.scale * cle * Math.sin(-clc * cld), 14);
    if (ckz.buildIndex < 0 && items.weapons[ckz.weaponIndex].aboveHand) {
        renderTool(items.weapons[ckz.weaponIndex], config.weaponVariants[ckz.weaponVariant || 0].src || "", ckz.scale, 0, cla);
        if (items.weapons[ckz.weaponIndex].projectile != undefined && !items.weapons[ckz.weaponIndex].hideProjectile) {
            renderProjectile(ckz.scale, 0, items.projectiles[items.weapons[ckz.weaponIndex].projectile], mainContext);
        }
    }
    if (ckz.buildIndex >= 0) {
        var clf = getItemSprite(items.list[ckz.buildIndex]);
        cla.drawImage(clf, ckz.scale - items.list[ckz.buildIndex].holdOffset, -clf.width / 2);
    }
    renderCircle(0, 0, ckz.scale, cla);
    renderSkin2(48, cla, null, ckz);
}

function renderPlayer(clg, clh) {
    clh = clh || mainContext;
    clh.lineWidth = outlineWidth;
    clh.lineJoin = "miter";
    let clj = Math.PI / 4 * (items.weapons[clg.weaponIndex].armS || 1);
    let clk = clg.buildIndex < 0 ? items.weapons[clg.weaponIndex].hndS || 1 : 1;
    let cll = clg.buildIndex < 0 ? items.weapons[clg.weaponIndex].hndD || 1 : 1;
    let clm = clg == player && clg.weapons[0] == 3 && clg.weapons[1] == 15;
    if (clg.tailIndex > 0) {
        renderTailTextureImage(clg.tailIndex, clh, clg);
    }
    if (clg.buildIndex < 0 && !items.weapons[clg.weaponIndex].aboveHand) {
        renderTool(items.weapons[clm ? 4 : clg.weaponIndex], config.weaponVariants[clg.weaponVariant].src, clg.scale, 0, clh);
        if (items.weapons[clg.weaponIndex].projectile != undefined && !items.weapons[clg.weaponIndex].hideProjectile) {
            renderProjectile(clg.scale, 0, items.projectiles[items.weapons[clg.weaponIndex].projectile], mainContext);
        }
    }
    clh.fillStyle = config.skinColors[clg.skinColor];
    renderCircle(clg.scale * Math.cos(clj), clg.scale * Math.sin(clj), 14);
    renderCircle(clg.scale * cll * Math.cos(-clj * clk), clg.scale * cll * Math.sin(-clj * clk), 14);
    if (clg.buildIndex < 0 && items.weapons[clg.weaponIndex].aboveHand) {
        renderTool(items.weapons[clg.weaponIndex], config.weaponVariants[clg.weaponVariant].src, clg.scale, 0, clh);
        if (items.weapons[clg.weaponIndex].projectile != undefined && !items.weapons[clg.weaponIndex].hideProjectile) {
            renderProjectile(clg.scale, 0, items.projectiles[items.weapons[clg.weaponIndex].projectile], mainContext);
        }
    }
    if (clg.buildIndex >= 0) {
        var cln = getItemSprite(items.list[clg.buildIndex]);
        clh.drawImage(cln, clg.scale - items.list[clg.buildIndex].holdOffset, -cln.width / 2);
    }
    renderCircle(0, 0, clg.scale, clh);
    if (clg.skinIndex > 0) {
        clh.rotate(Math.PI / 2);
        renderTextureSkin(clg.skinIndex, clh, null, clg);
    }
}
var skinSprites2 = {};
var skinPointers2 = {};

function renderSkin2(clo, clp, clq, clr) {
    tmpSkin = skinSprites2[clo];
    if (!tmpSkin) {
        var clt = new Image();
        clt.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        clt.src = "https://moomoo.io/img/hats/hat_" + clo + ".png";
        skinSprites2[clo] = clt;
        tmpSkin = clt;
    }
    var clv = clq || skinPointers2[clo];
    if (!clv) {
        for (var clw = 0; clw < hats.length; ++clw) {
            if (hats[clw].id == clo) {
                clv = hats[clw];
                break;
            }
        }
        skinPointers2[clo] = clv;
    }
    if (tmpSkin.isLoaded) {
        clp.drawImage(tmpSkin, -clv.scale / 2, -clv.scale / 2, clv.scale, clv.scale);
    }
    if (!clq && clv.topSprite) {
        clp.save();
        clp.rotate(clr.skinRot);
        renderSkin2(clo + "_top", clp, clv, clr);
        clp.restore();
    }
}

function renderTextureSkin(clx, cly, clz, cma) {
    if (!(tmpSkin = skinSprites[clx + (txt ? "lol" : 0)])) {
        var cmc = new Image();
        cmc.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        cmc.src = setSkinTextureImage(clx, "hat", clx);
        skinSprites[clx + (txt ? "lol" : 0)] = cmc;
        tmpSkin = cmc;
    }
    var cme = clz || skinPointers[clx];
    if (!cme) {
        for (var cmf = 0; cmf < hats.length; ++cmf) {
            if (hats[cmf].id == clx) {
                cme = hats[cmf];
                break;
            }
        }
        skinPointers[clx] = cme;
    }
    if (tmpSkin.isLoaded) {
        cly.drawImage(tmpSkin, -cme.scale / 2, -cme.scale / 2, cme.scale, cme.scale);
    }
    if (!clz && cme.topSprite) {
        cly.save();
        cly.rotate(cma.skinRot);
        renderSkin(clx + "_top", cly, cme, cma);
        cly.restore();
    }
}
var FlareZHat = {
    6: "https://i.imgur.com/HjWADL7.png",
    7: "http://i.imgur.com/wqG2CBb.png"
};

function setSkinTextureImage(cmg, cmh, cmi) {
    if (FlareZHat[cmg] && cmh == "hat") {
        return FlareZHat[cmg];
    } else if (cmh == "acc") {
        return ".././img/accessories/access_" + cmg + ".png";
    } else if (cmh == "hat") {
        return ".././img/hats/hat_" + cmg + ".png";
    } else {
        return ".././img/weapons/" + cmg + ".png";
    }
}
let skinSprites = {};
let skinPointers = {};
let tmpSkin;

function renderSkin(cmk, cml, cmm, cmn) {
    tmpSkin = skinSprites[cmk];
    if (!tmpSkin) {
        let cmq = new Image();
        cmq.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        cmq.src = "https://moomoo.io/img/hats/hat_" + cmk + ".png";
        skinSprites[cmk] = cmq;
        tmpSkin = cmq;
    }
    let cms = cmm || skinPointers[cmk];
    if (!cms) {
        for (let cmt = 0; cmt < hats.length; ++cmt) {
            if (hats[cmt].id == cmk) {
                cms = hats[cmt];
                break;
            }
        }
        skinPointers[cmk] = cms;
    }
    if (tmpSkin.isLoaded) {
        cml.drawImage(tmpSkin, -cms.scale / 2, -cms.scale / 2, cms.scale, cms.scale);
    }
    if (!cmm && cms.topSprite) {
        cml.save();
        cml.rotate(cmn.skinRot);
        renderSkin(cmk + "_top", cml, cms, cmn);
        cml.restore();
    }
}
var FlareZAcc = {};

function setTailTextureImage(cmu, cmv, cmw) {
    if (FlareZAcc[cmu] && cmv == "acc") {
        return FlareZAcc[cmu];
    } else if (cmv == "acc") {
        return ".././img/accessories/access_" + cmu + ".png";
    } else if (cmv == "hat") {
        return ".././img/hats/hat_" + cmu + ".png";
    } else {
        return ".././img/weapons/" + cmu + ".png";
    }
}

function renderTailTextureImage(cmy, cmz, cna) {
    if (!(tmpSkin = accessSprites[cmy + (txt ? "lol" : 0)])) {
        var cnc = new Image();
        cnc.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        cnc.src = setTailTextureImage(cmy, "acc");
        accessSprites[cmy + (txt ? "lol" : 0)] = cnc;
        tmpSkin = cnc;
    }
    var cne = accessPointers[cmy];
    if (!cne) {
        for (var cnf = 0; cnf < accessories.length; ++cnf) {
            if (accessories[cnf].id == cmy) {
                cne = accessories[cnf];
                break;
            }
        }
        accessPointers[cmy] = cne;
    }
    if (tmpSkin.isLoaded) {
        cmz.save();
        cmz.translate(-20 - (cne.xOff || 0), 0);
        if (cne.spin) {
            cmz.rotate(cna.skinRot);
        }
        cmz.drawImage(tmpSkin, -(cne.scale / 2), -(cne.scale / 2), cne.scale, cne.scale);
        cmz.restore();
    }
}
let accessSprites = {};
let accessPointers = {};
var txt = true;

function renderTail(cng, cnh, cni) {
    tmpSkin = accessSprites[cng];
    if (!tmpSkin) {
        let cnk = new Image();
        cnk.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        cnk.src = "https://moomoo.io/img/accessories/access_" + cng + ".png";
        accessSprites[cng] = cnk;
        tmpSkin = cnk;
    }
    let cnm = accessPointers[cng];
    if (!cnm) {
        for (let cnn = 0; cnn < accessories.length; ++cnn) {
            if (accessories[cnn].id == cng) {
                cnm = accessories[cnn];
                break;
            }
        }
        accessPointers[cng] = cnm;
    }
    if (tmpSkin.isLoaded) {
        cnh.save();
        cnh.translate(-20 - (cnm.xOff || 0), 0);
        if (cnm.spin) {
            cnh.rotate(cni.skinRot);
        }
        cnh.drawImage(tmpSkin, -(cnm.scale / 2), -(cnm.scale / 2), cnm.scale, cnm.scale);
        cnh.restore();
    }
}
var accessSprites2 = {};
var accessPointers2 = {};

function renderTail2(cno, cnp, cnq) {
    tmpSkin = accessSprites2[cno];
    if (!tmpSkin) {
        var cns = new Image();
        cns.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        cns.src = "https://moomoo.io/img/accessories/access_" + cno + ".png";
        accessSprites2[cno] = cns;
        tmpSkin = cns;
    }
    var cnu = accessPointers2[cno];
    if (!cnu) {
        for (var cnv = 0; cnv < accessories.length; ++cnv) {
            if (accessories[cnv].id == cno) {
                cnu = accessories[cnv];
                break;
            }
        }
        accessPointers2[cno] = cnu;
    }
    if (tmpSkin.isLoaded) {
        cnp.save();
        cnp.translate(-20 - (cnu.xOff || 0), 0);
        if (cnu.spin) {
            cnp.rotate(cnq.skinRot);
        }
        cnp.drawImage(tmpSkin, -(cnu.scale / 2), -(cnu.scale / 2), cnu.scale, cnu.scale);
        cnp.restore();
    }
}
let toolSprites = {};

function renderTool(cnw, cnx, cny, cnz, coa) {
    let coc = cnw.src + (cnx || "");
    let cod = toolSprites[coc];
    if (!cod) {
        cod = new Image();
        cod.onload = function() {
            this.isLoaded = true;
        };
        cod.src = "https://moomoo.io/img/weapons/" + coc + ".png";
        toolSprites[coc] = cod;
    }
    if (cod.isLoaded) {
        coa.drawImage(cod, cny + cnw.xOff - cnw.length / 2, cnz + cnw.yOff - cnw.width / 2, cnw.length, cnw.width);
    }
}

function renderProjectiles(cof, cog, coh) {
    for (let coj = 0; coj < projectiles.length; coj++) {
        tmpObj = projectiles[coj];
        if (tmpObj.active && tmpObj.layer == cof && tmpObj.inWindow) {
            tmpObj.update(delta);
            if (tmpObj.active && tmpObj.x - cog + tmpObj.scale >= 0 && tmpObj.x - cog - tmpObj.scale <= maxScreenWidth && tmpObj.y - coh + tmpObj.scale >= 0 && (tmpObj.y - coh, tmpObj.scale, maxScreenHeight)) {
                mainContext.save();
                mainContext.translate(tmpObj.x - cog, tmpObj.y - coh);
                mainContext.rotate(tmpObj.dir);
                renderProjectile(0, 0, tmpObj, mainContext, 1);
                mainContext.restore();
            }
        }
    };
}
let projectileSprites = {};

function renderProjectile(cok, col, con, coo, cop) {
    if (con.src) {
        let cor = items.projectiles[con.indx].src;
        let cot = projectileSprites[cor];
        if (!cot) {
            cot = new Image();
            cot.onload = function() {
                this.isLoaded = true;
            };
            cot.src = "https://moomoo.io/img/weapons/" + cor + ".png";
            projectileSprites[cor] = cot;
        }
        if (cot.isLoaded) {
            coo.drawImage(cot, cok - con.scale / 2, col - con.scale / 2, con.scale, con.scale);
        }
    } else if (con.indx == 1) {
        coo.fillStyle = "#939393";
        renderCircle(cok, col, con.scale, coo);
    }
}
let aiSprites = {};

function renderAI(cov, cox) {
    let coz = cov.index;
    let cpa = aiSprites[coz];
    if (!cpa) {
        let cpb = new Image();
        cpb.onload = function() {
            this.isLoaded = true;
            this.onload = null;
        };
        cpb.src = "https://moomoo.io/img/animals/" + cov.src + ".png";
        cpa = cpb;
        aiSprites[coz] = cpa;
    }
    if (cpa.isLoaded) {
        let cpd = cov.scale * 1.2 * (cov.spriteMlt || 1);
        cox.drawImage(cpa, -cpd, -cpd, cpd * 2, cpd * 2);
    }
}

function renderWaterBodies(cpe, cpf, cpg, cph) {
    let cpj = config.riverWidth + cph;
    let cpk = config.mapScale / 2 - cpf - cpj / 2;
    if (cpk < maxScreenHeight && cpk + cpj > 0) {
        cpg.fillRect(0, cpk, maxScreenWidth, cpj);
    }
}
let gameObjectSprites = {};

function getResSprite(cpl) {
    let cpn = cpl.y >= config.mapScale - config.snowBiomeTop ? 2 : cpl.y <= config.snowBiomeTop ? 1 : 0;
    let cpo = cpl.type + "_" + cpl.scale + "_" + cpn;
    let cpp = gameObjectSprites[cpo];
    if (!cpp) {
        let cpq = 6;
        let cpr = document.createElement("canvas");
        cpr.width = cpr.height = cpl.scale * 2.1 + outlineWidth;
        let cps = cpr.getContext("2d");
        cps.translate(cpr.width / 2, cpr.height / 2);
        cps.rotate(UTILS.randFloat(0, Math.PI));
        cps.strokeStyle = outlineColor;
        cps.lineWidth = outlineWidth;
        if (cpl.type == 0) {
            let cpt;
            let cpu = 8;
            cps.globalAlpha = cdf(cpl, player) <= 250 ? 0.5 : 0.5;
            for (let cpv = 0; cpv < 2; ++cpv) {
                cpt = tmpObj.scale * (!cpv ? 1 : 0.5);
                renderBlob(cps, cpu, cpt, cpt * 0.7);
                cps.fillStyle = !cpn ? !cpv ? "#9ebf57" : "#b4db62" : !cpv ? "#e3f1f4" : "#fff";
                cps.fill();
                if (!cpv) {
                    cps.stroke();
                    cps.globalAlpha = 1;
                }
                if (!cpv) {} else {}
            }
        } else if (cpl.type == 1) {
            if (cpn == 2) {
                cps.fillStyle = "#606060";
                renderStar(cps, 6, cpl.scale * 0.3, cpl.scale * 0.71);
                cps.fill();
                cps.stroke();
                cps.fillStyle = "#89a54c";
                renderCircle(0, 0, cpl.scale * 0.55, cps);
                cps.fillStyle = "#a5c65b";
                renderCircle(0, 0, cpl.scale * 0.3, cps, true);
            } else {
                renderBlob(cps, 6, tmpObj.scale, tmpObj.scale * 0.7);
                cps.fillStyle = cpn ? "#e3f1f4" : "#89a54c";
                cps.fill();
                cps.stroke();
                cps.fillStyle = cpn ? "#6a64af" : "#c15555";
                let cpw;
                let cpx = 4;
                let cpy = Math.PI * 2 / cpx;
                for (let cpz = 0; cpz < cpx; ++cpz) {
                    cpw = UTILS.randInt(tmpObj.scale / 3.5, tmpObj.scale / 2.3);
                    renderCircle(cpw * Math.cos(cpy * cpz), cpw * Math.sin(cpy * cpz), UTILS.randInt(10, 12), cps);
                }
            }
        } else if (cpl.type == 2 || cpl.type == 3) {
            cps.fillStyle = cpl.type == 2 ? cpn == 2 ? "#938d77" : "#939393" : "#e0c655";
            renderStar(cps, 3, cpl.scale, cpl.scale);
            cps.fill();
            cps.stroke();
            cps.fillStyle = cpl.type == 2 ? cpn == 2 ? "#b2ab90" : "#bcbcbc" : "#ebdca3";
            renderStar(cps, 3, cpl.scale * 0.55, cpl.scale * 0.65);
            cps.fill();
        }
        cpp = cpr;
        gameObjectSprites[cpo] = cpp;
    }
    return cpp;
}
let itemSprites = [];

function getItemSprite(cqa, cqb) {
    let cqd = itemSprites[cqa.id];
    if (!cqd || cqb) {
        let cqe = !cqb ? 20 : 5;
        let cqf = document.createElement("canvas");
        let cqg = !cqb && cqa.name == "windmill" ? items.list[4].scale : cqa.scale;
        cqf.width = cqf.height = cqg * 2.5 + outlineWidth + (items.list[cqa.id].spritePadding || 0) + cqe;
        let cqh = cqf.getContext("2d");
        cqh.translate(cqf.width / 2, cqf.height / 2);
        cqh.rotate(cqb ? 0 : Math.PI / 2);
        cqh.strokeStyle = outlineColor;
        cqh.lineWidth = outlineWidth * (cqb ? cqf.width / 81 : 1);
        if (!cqb) {}
        if (cqa.name == "apple") {
            cqh.fillStyle = "#c15555";
            renderCircle(0, 0, cqa.scale, cqh);
            cqh.fillStyle = "#89a54c";
            let cqi = -(Math.PI / 2);
            renderLeaf(cqa.scale * Math.cos(cqi), cqa.scale * Math.sin(cqi), 25, cqi + Math.PI / 2, cqh);
        } else if (cqa.name == "cookie") {
            cqh.fillStyle = "#cca861";
            renderCircle(0, 0, cqa.scale, cqh);
            cqh.fillStyle = "#937c4b";
            let cqj = 4;
            let cqk = Math.PI * 2 / cqj;
            let cql;
            for (let cqm = 0; cqm < cqj; ++cqm) {
                cql = UTILS.randInt(cqa.scale / 2.5, cqa.scale / 1.7);
                renderCircle(cql * Math.cos(cqk * cqm), cql * Math.sin(cqk * cqm), UTILS.randInt(4, 5), cqh, true);
            }
        } else if (cqa.name == "cheese") {
            cqh.fillStyle = "#f4f3ac";
            renderCircle(0, 0, cqa.scale, cqh);
            cqh.fillStyle = "#c3c28b";
            let cqn = 4;
            let cqo = Math.PI * 2 / cqn;
            let cqp;
            for (let cqq = 0; cqq < cqn; ++cqq) {
                cqp = UTILS.randInt(cqa.scale / 2.5, cqa.scale / 1.7);
                renderCircle(cqp * Math.cos(cqo * cqq), cqp * Math.sin(cqo * cqq), UTILS.randInt(4, 5), cqh, true);
            }
        } else if (cqa.name == "wood wall" || cqa.name == "stone wall" || cqa.name == "castle wall") {
            cqh.fillStyle = cqa.name == "castle wall" ? "#83898e" : cqa.name == "wood wall" ? "#a5974c" : "#939393";
            let cqr = cqa.name == "castle wall" ? 4 : 3;
            renderStar(cqh, cqr, cqa.scale * 1.1, cqa.scale * 1.1);
            cqh.fill();
            cqh.stroke();
            cqh.fillStyle = cqa.name == "castle wall" ? "#9da4aa" : cqa.name == "wood wall" ? "#c9b758" : "#bcbcbc";
            renderStar(cqh, cqr, cqa.scale * 0.65, cqa.scale * 0.65);
            cqh.fill();
        } else if (cqa.name == "spikes" || cqa.name == "greater spikes" || cqa.name == "poison spikes" || cqa.name == "spinning spikes") {
            cqh.fillStyle = cqa.name == "poison spikes" ? "#7b935d" : "#939393";
            let cqs = cqa.scale * 0.6;
            renderStar(cqh, cqa.name == "spikes" ? 5 : 6, cqa.scale, cqs);
            cqh.fill();
            cqh.stroke();
            cqh.fillStyle = "#a5974c";
            renderCircle(0, 0, cqs, cqh);
            cqh.fillStyle = "#c9b758";
            renderCircle(0, 0, cqs / 2, cqh, true);
        } else if (cqa.name == "windmill" || cqa.name == "faster windmill" || cqa.name == "power mill") {
            cqh.fillStyle = "#a5974c";
            renderCircle(0, 0, cqg, cqh);
            cqh.fillStyle = "#c9b758";
            renderRectCircle(0, 0, cqg * 1.5, 29, 4, cqh);
            cqh.fillStyle = "#a5974c";
            renderCircle(0, 0, cqg * 0.5, cqh);
        } else if (cqa.name == "mine") {
            cqh.fillStyle = "#939393";
            renderStar(cqh, 3, cqa.scale, cqa.scale);
            cqh.fill();
            cqh.stroke();
            cqh.fillStyle = "#bcbcbc";
            renderStar(cqh, 3, cqa.scale * 0.55, cqa.scale * 0.65);
            cqh.fill();
        } else if (cqa.name == "sapling") {
            for (let cqt = 0; cqt < 2; ++cqt) {
                let cqu = cqa.scale * (!cqt ? 1 : 0.5);
                renderStar(cqh, 7, cqu, cqu * 0.7);
                cqh.fillStyle = !cqt ? "#9ebf57" : "#b4db62";
                cqh.fill();
                if (!cqt) {
                    cqh.stroke();
                }
            }
        } else if (cqa.name == "pit trap") {
            cqh.fillStyle = "#a5974c";
            renderStar(cqh, 3, cqa.scale * 1.1, cqa.scale * 1.1);
            cqh.fill();
            cqh.stroke();
            cqh.fillStyle = outlineColor;
            renderStar(cqh, 3, cqa.scale * 0.65, cqa.scale * 0.65);
            cqh.fill();
        } else if (cqa.name == "boost pad") {
            cqh.fillStyle = "#7e7f82";
            renderRect(0, 0, cqa.scale * 2, cqa.scale * 2, cqh);
            cqh.fill();
            cqh.stroke();
            cqh.fillStyle = "#dbd97d";
            renderTriangle(cqa.scale * 1, cqh);
        } else if (cqa.name == "turret") {
            cqh.fillStyle = "#a5974c";
            renderCircle(0, 0, cqa.scale, cqh);
            cqh.fill();
            cqh.stroke();
            cqh.fillStyle = "#939393";
            let cqv = 50;
            renderRect(0, -cqv / 2, cqa.scale * 0.9, cqv, cqh);
            renderCircle(0, 0, cqa.scale * 0.6, cqh);
            cqh.fill();
            cqh.stroke();
        } else if (cqa.name == "platform") {
            cqh.fillStyle = "#cebd5f";
            let cqw = 4;
            let cqx = cqa.scale * 2;
            let cqy = cqx / cqw;
            let cqz = -(cqa.scale / 2);
            for (let cra = 0; cra < cqw; ++cra) {
                renderRect(cqz - cqy / 2, 0, cqy, cqa.scale * 2, cqh);
                cqh.fill();
                cqh.stroke();
                cqz += cqx / cqw;
            }
        } else if (cqa.name == "healing pad") {
            cqh.fillStyle = "#7e7f82";
            renderRect(0, 0, cqa.scale * 2, cqa.scale * 2, cqh);
            cqh.fill();
            cqh.stroke();
            cqh.fillStyle = "#db6e6e";
            renderRectCircle(0, 0, cqa.scale * 0.65, 20, 4, cqh, true);
        } else if (cqa.name == "spawn pad") {
            cqh.fillStyle = "#7e7f82";
            renderRect(0, 0, cqa.scale * 2, cqa.scale * 2, cqh);
            cqh.fill();
            cqh.stroke();
            cqh.fillStyle = "#71aad6";
            renderCircle(0, 0, cqa.scale * 0.6, cqh);
        } else if (cqa.name == "blocker") {
            cqh.fillStyle = "#7e7f82";
            renderCircle(0, 0, cqa.scale, cqh);
            cqh.fill();
            cqh.stroke();
            cqh.rotate(Math.PI / 4);
            cqh.fillStyle = "#db6e6e";
            renderRectCircle(0, 0, cqa.scale * 0.65, 20, 4, cqh, true);
        } else if (cqa.name == "teleporter") {
            cqh.fillStyle = "#7e7f82";
            renderCircle(0, 0, cqa.scale, cqh);
            cqh.fill();
            cqh.stroke();
            cqh.rotate(Math.PI / 4);
            cqh.fillStyle = "#d76edb";
            renderCircle(0, 0, cqa.scale * 0.5, cqh, true);
        }
        cqd = cqf;
        if (!cqb) {
            itemSprites[cqa.id] = cqd;
        }
    }
    return cqd;
}

function getItemSprite2(crb, crc, crd) {
    let crf = mainContext;
    let crg = crb.name == "windmill" ? items.list[4].scale : crb.scale;
    crf.save();
    crf.translate(crc, crd);
    crf.rotate(crb.dir);
    crf.strokeStyle = outlineColor;
    crf.lineWidth = outlineWidth;
    if (crb.name == "apple") {
        crf.fillStyle = "#c15555";
        renderCircle(0, 0, crb.scale, crf);
        crf.fillStyle = "#89a54c";
        let crh = -(Math.PI / 2);
        renderLeaf(crb.scale * Math.cos(crh), crb.scale * Math.sin(crh), 25, crh + Math.PI / 2, crf);
    } else if (crb.name == "cookie") {
        crf.fillStyle = "#cca861";
        renderCircle(0, 0, crb.scale, crf);
        crf.fillStyle = "#937c4b";
        let cri = 4;
        let crj = Math.PI * 2 / cri;
        let crk;
        for (let crl = 0; crl < cri; ++crl) {
            crk = UTILS.randInt(crb.scale / 2.5, crb.scale / 1.7);
            renderCircle(crk * Math.cos(crj * crl), crk * Math.sin(crj * crl), UTILS.randInt(4, 5), crf, true);
        }
    } else if (crb.name == "cheese") {
        crf.fillStyle = "#f4f3ac";
        renderCircle(0, 0, crb.scale, crf);
        crf.fillStyle = "#c3c28b";
        let crm = 4;
        let crn = Math.PI * 2 / crm;
        let cro;
        for (let crp = 0; crp < crm; ++crp) {
            cro = UTILS.randInt(crb.scale / 2.5, crb.scale / 1.7);
            renderCircle(cro * Math.cos(crn * crp), cro * Math.sin(crn * crp), UTILS.randInt(4, 5), crf, true);
        }
    } else if (crb.name == "wood wall" || crb.name == "stone wall" || crb.name == "castle wall") {
        crf.fillStyle = crb.name == "castle wall" ? "#83898e" : crb.name == "wood wall" ? "#a5974c" : "#939393";
        let crq = crb.name == "castle wall" ? 4 : 3;
        renderStar(crf, crq, crb.scale * 1.1, crb.scale * 1.1);
        crf.fill();
        crf.stroke();
        crf.fillStyle = crb.name == "castle wall" ? "#9da4aa" : crb.name == "wood wall" ? "#c9b758" : "#bcbcbc";
        renderStar(crf, crq, crb.scale * 0.65, crb.scale * 0.65);
        crf.fill();
    } else if (crb.name == "spikes" || crb.name == "greater spikes" || crb.name == "poison spikes" || crb.name == "spinning spikes") {
        crf.fillStyle = crb.name == "poison spikes" ? "#7b935d" : "#939393";
        let crr = crb.scale * 0.6;
        renderStar(crf, crb.name == "spikes" ? 5 : 6, crb.scale, crr);
        crf.fill();
        crf.stroke();
        crf.fillStyle = "#a5974c";
        renderCircle(0, 0, crr, crf);
        crf.fillStyle = "#c9b758";
        renderCircle(0, 0, crr / 2, crf, true);
    } else if (crb.name == "windmill" || crb.name == "faster windmill" || crb.name == "power mill") {
        crf.fillStyle = "#a5974c";
        renderCircle(0, 0, crg, crf);
        crf.fillStyle = "#c9b758";
        renderRectCircle(0, 0, crg * 1.5, 29, 4, crf);
        crf.fillStyle = "#a5974c";
        renderCircle(0, 0, crg * 0.5, crf);
    } else if (crb.name == "mine") {
        crf.fillStyle = "#939393";
        renderStar(crf, 3, crb.scale, crb.scale);
        crf.fill();
        crf.stroke();
        crf.fillStyle = "#bcbcbc";
        renderStar(crf, 3, crb.scale * 0.55, crb.scale * 0.65);
        crf.fill();
    } else if (crb.name == "sapling") {
        for (let crs = 0; crs < 2; ++crs) {
            let crt = crb.scale * (!crs ? 1 : 0.5);
            renderStar(crf, 7, crt, crt * 0.7);
            crf.fillStyle = !crs ? "#9ebf57" : "#b4db62";
            crf.fill();
            if (!crs) {
                crf.stroke();
            }
        }
    } else if (crb.name == "pit trap") {
        crf.fillStyle = "#a5974c";
        renderStar(crf, 3, crb.scale * 1.1, crb.scale * 1.1);
        crf.fill();
        crf.stroke();
        crf.fillStyle = outlineColor;
        renderStar(crf, 3, crb.scale * 0.65, crb.scale * 0.65);
        crf.fill();
    } else if (crb.name == "boost pad") {
        crf.fillStyle = "#7e7f82";
        renderRect(0, 0, crb.scale * 2, crb.scale * 2, crf);
        crf.fill();
        crf.stroke();
        crf.fillStyle = "#dbd97d";
        renderTriangle(crb.scale * 1, crf);
    } else if (crb.name == "turret") {
        crf.fillStyle = "#a5974c";
        renderCircle(0, 0, crb.scale, crf);
        crf.fill();
        crf.stroke();
        crf.fillStyle = "#939393";
        let cru = 50;
        renderRect(0, -cru / 2, crb.scale * 0.9, cru, crf);
        renderCircle(0, 0, crb.scale * 0.6, crf);
        crf.fill();
        crf.stroke();
    } else if (crb.name == "platform") {
        crf.fillStyle = "#cebd5f";
        let crv = 4;
        let crw = crb.scale * 2;
        let crx = crw / crv;
        let crz = -(crb.scale / 2);
        for (let csa = 0; csa < crv; ++csa) {
            renderRect(crz - crx / 2, 0, crx, crb.scale * 2, crf);
            crf.fill();
            crf.stroke();
            crz += crw / crv;
        }
    } else if (crb.name == "healing pad") {
        crf.fillStyle = "#7e7f82";
        renderRect(0, 0, crb.scale * 2, crb.scale * 2, crf);
        crf.fill();
        crf.stroke();
        crf.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, crb.scale * 0.65, 20, 4, crf, true);
    } else if (crb.name == "spawn pad") {
        crf.fillStyle = "#7e7f82";
        renderRect(0, 0, crb.scale * 2, crb.scale * 2, crf);
        crf.fill();
        crf.stroke();
        crf.fillStyle = "#71aad6";
        renderCircle(0, 0, crb.scale * 0.6, crf);
    } else if (crb.name == "blocker") {
        crf.fillStyle = "#7e7f82";
        renderCircle(0, 0, crb.scale, crf);
        crf.fill();
        crf.stroke();
        crf.rotate(Math.PI / 4);
        crf.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, crb.scale * 0.65, 20, 4, crf, true);
    } else if (crb.name == "teleporter") {
        crf.fillStyle = "#7e7f82";
        renderCircle(0, 0, crb.scale, crf);
        crf.fill();
        crf.stroke();
        crf.rotate(Math.PI / 4);
        crf.fillStyle = "#d76edb";
        renderCircle(0, 0, crb.scale * 0.5, crf, true);
    }
    crf.restore();
}
let objSprites = [];

function getObjSprite(csb) {
    let csd = objSprites[csb.id];
    if (!csd) {
        let cse = 0;
        let csf = document.createElement("canvas");
        csf.width = csf.height = csb.scale * 2.5 + outlineWidth + (items.list[csb.id].spritePadding || 0) + cse;
        let csg = csf.getContext("2d");
        csg.translate(csf.width / 2, csf.height / 2);
        csg.rotate(Math.PI / 2);
        csg.strokeStyle = outlineColor;
        csg.lineWidth = outlineWidth;
        if (csb.name == "spikes" || csb.name == "greater spikes" || csb.name == "poison spikes" || csb.name == "spinning spikes") {
            csg.fillStyle = csb.name == "poison spikes" ? "#7b935d" : "#939393";
            let csh = csb.scale * 0.6;
            renderStar(csg, csb.name == "spikes" ? 5 : 6, csb.scale, csh);
            csg.fill();
            csg.stroke();
            csg.shadowColor = "rgba(255, 0, 0, 0.8)";
            csg.shadowBlur = 20;
            csg.shadowOffsetX = 0;
            csg.shadowOffsetY = 0;
            csg.fillStyle = "#a5974c";
            renderCircle(0, 0, csh, csg);
            csg.shadowColor = "transparent";
            csg.shadowBlur = 0;
            csg.shadowOffsetX = 0;
            csg.shadowOffsetY = 0;
        } else if (csb.name == "pit trap") {
            csg.fillStyle = "#a5974c";
            renderStar(csg, 3, csb.scale * 1.1, csb.scale * 1.1);
            csg.fill();
            csg.stroke();
            csg.fillStyle = "#cc5151";
            renderStar(csg, 3, csb.scale * 0.65, csb.scale * 0.65);
            csg.fill();
        }
        csd = csf;
        objSprites[csb.id] = csd;
    }
    return csd;
}

function getMarkSprite(csi, csj, csk, csl) {
    let csn = {
        x: screenWidth / 2,
        y: screenHeight / 2
    };
    csj.lineWidth = outlineWidth;
    mainContext.globalAlpha = 0.2;
    csj.strokeStyle = outlineColor;
    csj.save();
    csj.translate(csk, csl);
    csj.rotate(34867844010000000000);
    if (csi.name == "spikes" || csi.name == "greater spikes" || csi.name == "poison spikes" || csi.name == "spinning spikes") {
        csj.fillStyle = csi.name == "poison spikes" ? "#7b935d" : "#939393";
        var cso = csi.scale;
        renderStar(csj, csi.name == "spikes" ? 5 : 6, csi.scale, cso);
        csj.fill();
        csj.stroke();
        csj.fillStyle = "#a5974c";
        renderCircle(0, 0, cso, csj);
        if (player && csi.owner && player.sid != csi.owner.sid && !tmpObj.findAllianceBySid(csi.owner.sid)) {
            csj.fillStyle = "#a34040";
        } else {
            csj.fillStyle = "#c9b758";
        }
        renderCircle(0, 0, cso / 2, csj, true);
    } else if (csi.name == "turret") {
        renderCircle(0, 0, csi.scale, csj);
        csj.fill();
        csj.stroke();
        csj.fillStyle = "#939393";
        let csp = 50;
        renderRect(0, -csp / 2, csi.scale * 0.9, csp, csj);
        renderCircle(0, 0, csi.scale * 0.6, csj);
        csj.fill();
        csj.stroke();
    } else if (csi.name == "teleporter") {
        csj.fillStyle = "#7e7f82";
        renderCircle(0, 0, csi.scale, csj);
        csj.fill();
        csj.stroke();
        csj.rotate(Math.PI / 4);
        csj.fillStyle = "#d76edb";
        renderCircle(0, 0, csi.scale * 0.5, csj, true);
    } else if (csi.name == "platform") {
        csj.fillStyle = "#cebd5f";
        let csq = 4;
        let csr = csi.scale * 2;
        let cst = csr / csq;
        let csu = -(csi.scale / 2);
        for (let csv = 0; csv < csq; ++csv) {
            renderRect(csu - cst / 2, 0, cst, csi.scale * 2, csj);
            csj.fill();
            csj.stroke();
            csu += csr / csq;
        }
    } else if (csi.name == "healing pad") {
        csj.fillStyle = "#7e7f82";
        renderRect(0, 0, csi.scale * 2, csi.scale * 2, csj);
        csj.fill();
        csj.stroke();
        csj.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, csi.scale * 0.65, 20, 4, csj, true);
    } else if (csi.name == "spawn pad") {
        csj.fillStyle = "#7e7f82";
        renderRect(0, 0, csi.scale * 2, csi.scale * 2, csj);
        csj.fill();
        csj.stroke();
        csj.fillStyle = "#71aad6";
        renderCircle(0, 0, csi.scale * 0.6, csj);
    } else if (csi.name == "blocker") {
        csj.fillStyle = "#7e7f82";
        renderCircle(0, 0, csi.scale, csj);
        csj.fill();
        csj.stroke();
        csj.rotate(Math.PI / 4);
        csj.fillStyle = "#db6e6e";
        renderRectCircle(0, 0, csi.scale * 0.65, 20, 4, csj, true);
    } else if (csi.name == "windmill" || csi.name == "faster windmill" || csi.name == "power mill") {
        csj.fillStyle = "#a5974c";
        renderCircle(0, 0, csi.scale, csj);
        csj.fillStyle = "#c9b758";
        renderRectCircle(0, 0, csi.scale * 1.5, 29, 4, csj);
        csj.fillStyle = "#a5974c";
        renderCircle(0, 0, csi.scale * 0.5, csj);
    } else if (csi.name == "pit trap") {
        csj.fillStyle = "#a5974c";
        renderStar(csj, 3, csi.scale * 1.1, csi.scale * 1.1);
        csj.fill();
        csj.stroke();
        if (player && csi.owner && player.sid != csi.owner.sid && !tmpObj.findAllianceBySid(csi.owner.sid)) {
            csj.fillStyle = "#a34040";
        } else {
            csj.fillStyle = outlineColor;
        }
        renderStar(csj, 3, csi.scale * 0.65, csi.scale * 0.65);
        csj.fill();
    }
    csj.restore();
}

function renderGameObjects(csw, csx, csy) {
    let cta;
    let ctb;
    let ctc;
    liztobj.forEach(ctd => {
        tmpObj = ctd;
        if (tmpObj.active && liztobj.includes(ctd) && tmpObj.render) {
            ctb = tmpObj.x + tmpObj.xWiggle - csx;
            ctc = tmpObj.y + tmpObj.yWiggle - csy;
            if (csw == 0) {
                tmpObj.update(delta);
            }
            mainContext.globalAlpha = tmpObj.alpha;
            if (tmpObj.layer == csw && ctb + (tmpObj.scale + (tmpObj.blocker || 0)) >= 0 && ctb - (tmpObj.scale + (tmpObj.blocker || 0)) <= maxScreenWidth && ctc + (tmpObj.scale + (tmpObj.blocker || 0)) >= 0 && (ctc, tmpObj.scale + (tmpObj.blocker || 0), maxScreenHeight)) {
                if (tmpObj.isItem) {
                    if ((tmpObj.dmg || tmpObj.trap) && !tmpObj.isTeamObject(player)) {
                        cta = getObjSprite(tmpObj);
                    } else {
                        cta = getItemSprite(tmpObj);
                    }
                    mainContext.save();
                    mainContext.translate(ctb, ctc);
                    mainContext.rotate(tmpObj.dir);
                    if (!tmpObj.active) {
                        mainContext.scale(tmpObj.visScale / tmpObj.scale, tmpObj.visScale / tmpObj.scale);
                    }
                    mainContext.drawImage(cta, -(cta.width / 2), -(cta.height / 2));
                    if (tmpObj.blocker) {
                        mainContext.strokeStyle = "#db6e6e";
                        mainContext.globalAlpha = 0.3;
                        mainContext.lineWidth = 6;
                        renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                    }
                    mainContext.restore();
                } else {
                    cta = getResSprite(tmpObj);
                    mainContext.drawImage(cta, ctb - cta.width / 2, ctc - cta.height / 2);
                }
            }
            if (csw == 3) {
                if (tmpObj.health < tmpObj.maxHealth && getEl("BuildHealth").value == "bh1") {
                    mainContext.fillStyle = darkOutlineColor;
                    mainContext.roundRect(ctb - config.healthBarWidth / 2 - config.healthBarPad, ctc - config.healthBarPad, config.healthBarWidth + config.healthBarPad * 2, 17, 8);
                    mainContext.fill();
                    mainContext.fillStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
                    mainContext.roundRect(ctb - config.healthBarWidth / 2, ctc, config.healthBarWidth * (tmpObj.health / tmpObj.maxHealth), 17 - config.healthBarPad * 2, 7);
                    mainContext.fill();
                }
                if (tmpObj.health < tmpObj.maxHealth && getEl("BuildHealth").value == "bh2") {
                    mainContext.fillStyle = darkOutlineColor;
                    mainContext.beginPath();
                    mainContext.arc(ctb, ctc, config.healthBarWidth / 2 + config.healthBarPad, 0, Math.PI * 2);
                    mainContext.fill();
                    mainContext.fillStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
                    mainContext.beginPath();
                    const ctf = tmpObj.health / tmpObj.maxHealth;
                    mainContext.arc(ctb, ctc, config.healthBarWidth / 2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ctf);
                    mainContext.lineTo(ctb, ctc);
                    mainContext.fill();
                }
                if (tmpObj.health < tmpObj.maxHealth && getEl("BuildHealth").value == "bh3") {
                    const ctg = tmpObj.health / tmpObj.maxHealth * 360 * (Math.PI / 180);
                    const cth = 14;
                    const cti = 22;
                    mainContext.save();
                    mainContext.lineWidth = 9;
                    mainContext.lineCap = "round";
                    mainContext.translate(ctb, ctc);
                    mainContext.beginPath();
                    mainContext.arc(0, 0, cti, 0, ctg);
                    mainContext.stroke();
                    mainContext.restore();
                    mainContext.save();
                    mainContext.strokeStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
                    mainContext.lineCap = "round";
                    mainContext.translate(ctb, ctc);
                    mainContext.beginPath();
                    mainContext.arc(0, 0, cti, 0, ctg);
                    mainContext.stroke();
                    mainContext.restore();
                }
            }
        }
    });
    if (csw == 0) {
        if (placeVisible.length) {
            placeVisible.forEach(ctj => {
                ctb = ctj.x - csx;
                ctc = ctj.y - csy;
                markObject(ctj, ctb, ctc);
            });
        }
    }
}

function markObject(ctk, ctl, ctm) {
    yen(mainContext, ctl, ctm);
}

function yen(ctn, cto, ctp) {
    ctn.fillStyle = "rgba(0, 255, 255, 0.5)";
    ctn.beginPath();
    ctn.arc(cto, ctp, 55, 0, Math.PI * 2);
    ctn.fill();
    ctn.closePath();
    ctn.globalAlpha = 1;
}
class MapPing {
    constructor(ctr, cts) {
        this.init = function(ctu, ctv) {
            this.scale = 0;
            this.x = ctu;
            this.y = ctv;
            this.active = true;
        };
        this.update = function(ctx, cty) {
            if (this.active) {
                this.scale += cty * 0.05;
                if (this.scale >= cts) {
                    this.active = false;
                } else {
                    ctx.globalAlpha = 1 - Math.max(0, this.scale / cts);
                    ctx.beginPath();
                    ctx.arc(this.x / config.mapScale * mapDisplay.width, this.y / config.mapScale * mapDisplay.width, this.scale, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        };
        this.color = ctr;
    }
}
let relMin = 55;
let relMax = 385;

function getBarColor(cua, cub) {
    let cud = tmpObj;
    if (cub) {
        if (cua <= 0.3703703703703704) {
            return "#8ecc51";
        } else if (cua <= 0.7407407407407408) {
            return "hsl(" + relMin + ", 50%, 60%)";
        } else {
            return "#f9f64f";
        }
    } else {
        let cue = 1 - cua;
        if (cud.secondary != 10) {
            let cuf = "hsl(" + Math.round(relMax + cue * (relMin - relMax)) % 360 + ", 50%, 60%)";
            if (cua == 1) {
                return "#f4f259";
            } else {
                return cuf;
            }
        } else if (cud.secondary == 10) {
            let cug = "hsl(" + Math.round(relMax + cue * (relMin - relMax)) % 360 + ", 50%, 60%)";
            if (cua <= 0.3703703703703704) {
                return "#73bfa2";
            } else if (cua <= 0.7407407407407408) {
                return "#8ecc51";
            } else {
                return "#f9f64f";
            }
        }
    }
}

function pingMap(cuh, cui) {
    tmpPing = mapPings.find(cuk => !cuk.active);
    if (!tmpPing) {
        tmpPing = new MapPing("#fff", config.mapPingScale);
        mapPings.push(tmpPing);
    }
    tmpPing.init(cuh, cui);
}

function updateMapMarker() {
    mapMarker.x = player.x;
    mapMarker.y = player.y;
}

function renderMinimap(cul) {
    if (player && player.alive) {
        mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);
        mapContext.lineWidth = 4;
        for (let cuo = 0; cuo < mapPings.length; ++cuo) {
            tmpPing = mapPings[cuo];
            mapContext.strokeStyle = tmpPing.color;
            tmpPing.update(mapContext, cul);
        }
        mapContext.globalAlpha = 1;
        mapContext.fillStyle = "#ff0000";
        if (breakTrackers.length) {
            mapContext.fillStyle = "#abcdef";
            mapContext.font = "34px Hammersmith One";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            for (let cup = 0; cup < breakTrackers.length;) {
                mapContext.fillText("!", breakTrackers[cup].x / config.mapScale * mapDisplay.width, breakTrackers[cup].y / config.mapScale * mapDisplay.height);
                cup += 2;
            }
        }
        mapContext.globalAlpha = 1;
        mapContext.fillStyle = "#fff";
        renderCircle(player.x / config.mapScale * mapDisplay.width, player.y / config.mapScale * mapDisplay.height, 7, mapContext, true);
        mapContext.fillStyle = "rgba(255,255,255,0.35)";
        if (player.team && minimapData) {
            for (let cuq = 0; cuq < minimapData.length;) {
                renderCircle(minimapData[cuq] / config.mapScale * mapDisplay.width, minimapData[cuq + 1] / config.mapScale * mapDisplay.height, 7, mapContext, true);
                cuq += 2;
            }
        }
        if (bots.length) {
            bots.forEach(cur => {
                if (cur.inGame) {
                    mapContext.globalAlpha = 1;
                    mapContext.strokeStyle = "#cc5151";
                    renderCircle(cur.x2 / config.mapScale * mapDisplay.width, cur.y2 / config.mapScale * mapDisplay.height, 7, mapContext, false, true);
                }
            });
        }
        if (lastDeath) {
            mapContext.fillStyle = "#fc5553";
            mapContext.font = "34px Hammersmith One";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            mapContext.fillText("x", lastDeath.x / config.mapScale * mapDisplay.width, lastDeath.y / config.mapScale * mapDisplay.height);
        }
        if (mapMarker) {
            mapContext.fillStyle = "#fff";
            mapContext.font = "34px Hammersmith One";
            mapContext.textBaseline = "middle";
            mapContext.textAlign = "center";
            mapContext.fillText("x", mapMarker.x / config.mapScale * mapDisplay.width, mapMarker.y / config.mapScale * mapDisplay.height);
        }
    }
}
let crossHairs = ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Crosshairs_Red.svg/1200px-Crosshairs_Red.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Crosshairs_Red.svg/1200px-Crosshairs_Red.svg.png"];
let crossHairSprites = {};
let iconSprites = {};
let icons = ["crown", "skull"];

function loadIcons() {
    for (let cuu = 0; cuu < icons.length; ++cuu) {
        let cuv = new Image();
        cuv.onload = function() {
            this.isLoaded = true;
        };
        cuv.src = "./../img/icons/" + icons[cuu] + ".png";
        iconSprites[icons[cuu]] = cuv;
    }
    for (let cux = 0; cux < crossHairs.length; ++cux) {
        let cuy = new Image();
        cuy.onload = function() {
            this.isLoaded = true;
        };
        cuy.src = crossHairs[cux];
        crossHairSprites[cux] = cuy;
    }
}
loadIcons();

function cdf(cva, cvb) {
    try {
        return Math.hypot((cvb.y2 || cvb.y) - (cva.y2 || cva.y), (cvb.x2 || cvb.x) - (cva.x2 || cva.x));
    } catch (cvd) {
        return Infinity;
    }
}

function updateGame() {
    if (gameObjects.length && inGame) {
        gameObjects.forEach(cvf => {
            if (UTILS.getDistance(cvf.x, cvf.y, player.x, player.y) <= 1200) {
                if (!liztobj.includes(cvf)) {
                    liztobj.push(cvf);
                    cvf.render = true;
                }
            } else if (liztobj.includes(cvf)) {
                if (UTILS.getDistance(cvf.x, cvf.y, player.x, player.y) >= 1200) {
                    cvf.render = false;
                    const cvh = liztobj.indexOf(cvf);
                    if (cvh > -1) {
                        liztobj.splice(cvh, 1);
                    }
                }
            } else if (UTILS.getDistance(cvf.x, cvf.y, player.x, player.y) >= 1200) {
                cvf.render = false;
                const cvi = liztobj.indexOf(cvf);
                if (cvi > -1) {
                    liztobj.splice(cvi, 1);
                }
            } else {
                cvf.render = false;
                const cvj = liztobj.indexOf(cvf);
                if (cvj > -1) {
                    liztobj.splice(cvj, 1);
                }
            }
        });
    }
    mainContext.beginPath();
    mainContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    mainContext.globalAlpha = 1;

    function cvk(cvl, cvm, cvn = 25) {
        camX = (camX * (cvn - 1) + cvl) / cvn;
        camY = (camY * (cvn - 1) + cvm) / cvn;
    }
    if (player) {
        let cvo = player.x;
        let cvp = player.y;
        if (near.dist2 <= 1000 && inGame || !getEl("combatZoom").checked) {
            maxScreenWidth = config.maxScreenWidth * 1;
            maxScreenHeight = config.maxScreenHeight * 1;
        } else {
            maxScreenWidth = config.maxScreenWidth * 1.4;
            maxScreenHeight = config.maxScreenHeight * 1.4;
        }
        let cvq = getEl("cameramodes").value;
        if (cvq === "camera3") {
            cvk(cvo, cvp);
            let cvr = (mouseX - window.innerWidth / 2) / 175;
            let cvs = (mouseY - window.innerHeight / 2) / 175;
            camX += cvr;
            camY += cvs;
            resize();
            let cvt = UTILS.getDistance(camX, camY, cvo, cvp);
            let cvu = UTILS.getDirection(cvo, cvp, camX, camY);
            let cvv = 0.0001;
            let cvw = cvt * cvv;
            if (cvt > 1e-19) {
                camX += (cvw * Math.cos(cvu) - camX) * cvv;
                camY += (cvw * Math.sin(cvu) - camY) * cvv;
            } else {
                camX = cvo;
                camY = cvp;
            }
        } else if (cvq === "camera2") {
            cvk(cvo, cvp);
            let cvx = UTILS.getDistance(camX, camY, cvo, cvp);
            let cvy = UTILS.getDirection(cvo, cvp, camX, camY);
            let cvz = 0.0001;
            let cwa = cvx * cvz;
            if (cvx > 1e-19) {
                camX += (cwa * Math.cos(cvy) - camX) * cvz;
                camY += (cwa * Math.sin(cvy) - camY) * cvz;
            } else {
                camX = cvo;
                camY = cvp;
            }
        } else if (cvq === "camera1") {
            camX = cvo;
            camY = cvp;
            let cwb = UTILS.getDistance(camX, camY, cvo, cvp);
            let cwc = UTILS.getDirection(cvo, cvp, camX, camY);
            let cwd = Math.min(cwb * 0.005 * delta, cwb);
            if (cwb > 0.05) {
                camX += cwd * Math.cos(cwc);
                camY += cwd * Math.sin(cwc);
            } else {
                camX = cvo;
                camY = cvp;
            }
        } else {
            camX = config.mapScale / 2;
            camY = config.mapScale / 2;
        }
    } else {
        camX = config.mapScale / 2;
        camY = config.mapScale / 2;
    }
    let cwe = now - 950 / config.serverUpdateRate;
    let cwf;
    for (let cwg = 0; cwg < players.length + ais.length; ++cwg) {
        tmpObj = players[cwg] || ais[cwg - players.length];
        if (tmpObj && tmpObj.visible) {
            if (tmpObj.forcePos) {
                tmpObj.x = tmpObj.x2;
                tmpObj.y = tmpObj.y2;
                tmpObj.dir = tmpObj.d2;
            } else {
                let cwh = tmpObj.t2 - tmpObj.t1;
                let cwi = cwe - tmpObj.t1;
                let cwj = cwi / cwh;
                let cwk = 170;
                tmpObj.dt += delta;
                let cwl = Math.min(1.7, tmpObj.dt / cwk);
                cwf = tmpObj.x2 - tmpObj.x1;
                tmpObj.x = tmpObj.x1 + cwf * cwl;
                cwf = tmpObj.y2 - tmpObj.y1;
                tmpObj.y = tmpObj.y1 + cwf * cwl;
                if (config.anotherVisual) {
                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, cwj));
                } else {
                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, cwj));
                }
            }
        }
    }
    let cwm = camX - maxScreenWidth / 2;
    let cwn = camY - maxScreenHeight / 2;
    if (config.snowBiomeTop - cwn <= 0 && config.mapScale - config.snowBiomeTop - cwn >= maxScreenHeight) {
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.mapScale - config.snowBiomeTop - cwn <= 0) {
        mainContext.fillStyle = "#dbc666";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - cwn >= maxScreenHeight) {
        mainContext.fillStyle = "#fff";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else if (config.snowBiomeTop - cwn >= 0) {
        mainContext.fillStyle = "#fff";
        mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - cwn);
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, config.snowBiomeTop - cwn, maxScreenWidth, maxScreenHeight - (config.snowBiomeTop - cwn));
    } else {
        mainContext.fillStyle = "#b6db66";
        mainContext.fillRect(0, 0, maxScreenWidth, config.mapScale - config.snowBiomeTop - cwn);
        mainContext.fillStyle = "#dbc666";
        mainContext.fillRect(0, config.mapScale - config.snowBiomeTop - cwn, maxScreenWidth, maxScreenHeight - (config.mapScale - config.snowBiomeTop - cwn));
    }
    if (!firstSetup) {
        waterMult += waterPlus * config.waveSpeed * delta;
        if (waterMult >= config.waveMax) {
            waterMult = config.waveMax;
            waterPlus = -1;
        } else if (waterMult <= 1) {
            waterMult = waterPlus = 1;
        }
        mainContext.globalAlpha = 1;
        mainContext.fillStyle = "#dbc666";
        renderWaterBodies(cwm, cwn, mainContext, config.riverPadding);
        mainContext.fillStyle = "#91b2db";
        renderWaterBodies(cwm, cwn, mainContext, (waterMult - 1) * 250);
    }
    if (getEl("showgrid").checked) {
        mainContext.lineWidth = 4;
        mainContext.strokeStyle = "#000";
        mainContext.globalAlpha = 0.06;
    } else {
        mainContext.lineWidth = 0;
        mainContext.strokeStyle = "#000";
        mainContext.globalAlpha = 0;
    }
    for (let cwo = -camX; cwo < maxScreenWidth; cwo += maxScreenHeight / 18) {
        if (cwo > 0) {
            mainContext.moveTo(cwo, 0);
            mainContext.lineTo(cwo, maxScreenHeight);
        }
    }
    for (let cwp = -camY; cwp < maxScreenHeight; cwp += maxScreenHeight / 18) {
        if (cwp > 0) {
            mainContext.moveTo(0, cwp);
            mainContext.lineTo(maxScreenWidth, cwp);
        }
    }
    mainContext.stroke();
    if (pathFind.active) {
        if (pathFind.array && (pathFind.chaseNear ? enemy.length : true)) {
            mainContext.lineWidth = 3;
            mainContext.globalAlpha = 1;
            mainContext.strokeStyle = "cyan";
            mainContext.beginPath();
            pathFind.array.forEach((cwq, cwr) => {
                let cwt = {
                    x: pathFind.scale / pathFind.grid * cwq.x,
                    y: pathFind.scale / pathFind.grid * cwq.y
                };
                let cwu = {
                    x: player.x2 - pathFind.scale / 2 + cwt.x - cwm,
                    y: player.y2 - pathFind.scale / 2 + cwt.y - cwn
                };
                if (cwr == 0) {
                    mainContext.moveTo(cwu.x, cwu.y);
                } else {
                    mainContext.lineTo(cwu.x, cwu.y);
                }
            });
            mainContext.stroke();
        }
    }
    mainContext.globalAlpha = 1;
    mainContext.strokeStyle = outlineColor;
    renderDeadPlayers(cwm, cwn);
    mainContext.globalAlpha = 1;
    mainContext.strokeStyle = outlineColor;
    renderGameObjects(-1, cwm, cwn);
    mainContext.globalAlpha = 1;
    mainContext.lineWidth = outlineWidth;
    renderProjectiles(0, cwm, cwn);
    renderPlayers(cwm, cwn, 0);
    mainContext.globalAlpha = 1;
    for (let cwv = 0; cwv < ais.length; ++cwv) {
        tmpObj = ais[cwv];
        if (tmpObj.active && tmpObj.visible) {
            tmpObj.animate(delta);
            mainContext.save();
            mainContext.translate(tmpObj.x - cwm, tmpObj.y - cwn);
            mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - Math.PI / 2);
            renderAI(tmpObj, mainContext);
            mainContext.restore();
        }
    }
    renderGameObjects(0, cwm, cwn);
    renderProjectiles(1, cwm, cwn);
    renderGameObjects(1, cwm, cwn);
    renderPlayers(cwm, cwn, 1);
    renderGameObjects(2, cwm, cwn);
    renderGameObjects(3, cwm, cwn);
    mainContext.fillStyle = "#000";
    mainContext.globalAlpha = 0.09;
    if (cwm <= 0) {
        mainContext.fillRect(0, 0, -cwm, maxScreenHeight);
    }
    if (config.mapScale - cwm <= maxScreenWidth) {
        let cww = Math.max(0, -cwn);
        mainContext.fillRect(config.mapScale - cwm, cww, maxScreenWidth - (config.mapScale - cwm), maxScreenHeight - cww);
    }
    if (cwn <= 0) {
        mainContext.fillRect(-cwm, 0, maxScreenWidth + cwm, -cwn);
    }
    if (config.mapScale - cwn <= maxScreenHeight) {
        let cwx = Math.max(0, -cwm);
        let cwy = 0;
        if (config.mapScale - cwm <= maxScreenWidth) {
            cwy = maxScreenWidth - (config.mapScale - cwm);
        }
        mainContext.fillRect(cwx, config.mapScale - cwn, maxScreenWidth - cwx - cwy, maxScreenHeight - (config.mapScale - cwn));
    }
    if (getEl("daytime").checked) {
        mainContext.globalAlpha = 1;
        mainContext.fillStyle = "rgba(0, 0, 70, 0.35)";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    } else {
        mainContext.globalAlpha = 1;
        mainContext.fillStyle = "rgba(0, 0, 70, 0.6)";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
    }
    if (tracker.draw3.active) {
        mainContext.globalAlpha = 1;
        let cwz = {
            x: tracker.draw3.x - cwm,
            y: tracker.draw3.y - cwn,
            scale: tracker.draw3.scale
        };
        mainContext.strokeStyle = "#cc5151";
        mainContext.lineWidth = 3.25;
        mainContext.beginPath();
        mainContext.arc(cwz.x, cwz.y, cwz.scale, 0, Math.PI * 2);
        mainContext.stroke();
    }
    if (tracker.draw2.active) {
        mainContext.globalAlpha = 0.5;
        let cxa = {
            x: tracker.draw2.x - cwm,
            y: tracker.draw2.y - cwn,
            scale: tracker.draw2.scale
        };
        mainContext.fillStyle = "rgba(255, 0, 0, 0.5)";
        mainContext.beginPath();
        mainContext.arc(cxa.x, cxa.y, cxa.scale, 0, Math.PI * 2);
        mainContext.fill();
        mainContext.closePath();
        mainContext.globalAlpha = 1;
    }
    mainContext.strokeStyle = darkOutlineColor;
    mainContext.globalAlpha = 1;
    mainContext.beginPath();
    for (let cxb = 0; cxb < players.length + ais.length; ++cxb) {
        tmpObj = players[cxb] || ais[cxb - players.length];
        if (tmpObj.visible) {
            mainContext.strokeStyle = darkOutlineColor;
            let cxc = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + (tmpObj.name || "");
            if (cxc != "") {
                mainContext.globalAlpha = 1;
                mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
                mainContext.fillStyle = "#fff";
                mainContext.textBaseline = "middle";
                mainContext.textAlign = "center";
                mainContext.lineWidth = tmpObj.nameScale ? 11 : 8;
                mainContext.lineJoin = "round";
                mainContext.strokeText(cxc, tmpObj.x - cwm, tmpObj.y - cwn - tmpObj.scale - config.nameY);
                mainContext.fillText(cxc, tmpObj.x - cwm, tmpObj.y - cwn - tmpObj.scale - config.nameY);
                if (tmpObj.isLeader && iconSprites.crown.isLoaded) {
                    let cxd = config.crownIconScale;
                    let cxe = tmpObj.x - cwm - cxd / 2 - mainContext.measureText(cxc).width / 2 - config.crownPad;
                    mainContext.drawImage(iconSprites.crown, cxe, tmpObj.y - cwn - tmpObj.scale - config.nameY - cxd / 2 - 5, cxd, cxd);
                }
                if (tmpObj.iconIndex == 1 && iconSprites.skull.isLoaded) {
                    let cxf = config.crownIconScale;
                    let cxg = tmpObj.x - cwm - cxf / 2 + mainContext.measureText(cxc).width / 2 + config.crownPad;
                    mainContext.drawImage(iconSprites.skull, cxg, tmpObj.y - cwn - tmpObj.scale - config.nameY - cxf / 2 - 5, cxf, cxf);
                }
                if (tmpObj.isPlayer && instaC.wait && near == tmpObj && (tmpObj.backupNobull ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length && !useWasd) {
                    let cxh = tmpObj.scale * 2.2;
                    mainContext.drawImage(tmpObj.backupNobull ? crossHairSprites[1] : crossHairSprites[0], tmpObj.x - cwm - cxh / 2, tmpObj.y - cwn - cxh / 2, cxh, cxh);
                }
            }
            if (!getEl("cleanmode").checked) {
                if (tmpObj.isPlayer) {
                    let cxi = tmpObj.x - cwm + mainContext.measureText(cxc).width / 2 + config.crownPad;
                    let cxj = tmpObj.y - cwn - tmpObj.scale - config.nameY;
                    if (tmpObj.iconIndex == 1) {
                        cxi = tmpObj.x - cwm - 30 + mainContext.measureText(cxc).width / 2 + config.crownPad * 3.5 + 5;
                    }
                    mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
                    if (tmpObj.shameCount > 4) {
                        mainContext.fillStyle = "#cc5151";
                    } else if (tmpObj.shameCount > 2) {
                        mainContext.fillStyle = "#ffff00";
                    } else {
                        mainContext.fillStyle = tmpObj == player || tmpObj.team && tmpObj.team == player.team ? "#8ecc51" : "#fff";
                    }
                    mainContext.textBaseline = "middle";
                    mainContext.textAlign = "center";
                    mainContext.lineWidth = tmpObj.nameScale ? 11 : 8;
                    mainContext.lineJoin = "round";
                    mainContext.strokeText(tmpObj.shameCount, cxi, cxj);
                    mainContext.fillText(tmpObj.shameCount, cxi, cxj);
                }
            }
            if (tmpObj.health > 0) {
                if (tmpObj.name != "") {
                    mainContext.fillStyle = darkOutlineColor;
                    mainContext.roundRect(tmpObj.x - cwm - config.healthBarWidth - config.healthBarPad, tmpObj.y - cwn + tmpObj.scale + config.nameY, config.healthBarWidth * 2 + config.healthBarPad * 2, 17, 8);
                    mainContext.fill();
                    mainContext.fillStyle = tmpObj == player || tmpObj.team && tmpObj.team == player.team ? "#8ecc51" : "#cc5151";
                    mainContext.roundRect(tmpObj.x - cwm - config.healthBarWidth, tmpObj.y - cwn + tmpObj.scale + config.nameY + config.healthBarPad, config.healthBarWidth * 2 * (tmpObj.health / tmpObj.maxHealth), 17 - config.healthBarPad * 2, 7);
                    mainContext.fill();
                }
                if (tmpObj.isPlayer && !getEl("cleanmode").checked) {
                    mainContext.globalAlpha = 1;
                    let cxk = {
                        primary: tmpObj.primaryIndex == undefined ? 1 : (items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed,
                        secondary: tmpObj.secondaryIndex == undefined ? 1 : (items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed,
                        turret: (2500 - tmpObj.reloads[53]) / 2500
                    };
                    if (!tmpObj.currentReloads) {
                        tmpObj.currentReloads = {
                            primary: cxk.primary,
                            secondary: cxk.secondary,
                            turret: cxk.turret
                        };
                    }
                    const cxl = 0.3;
                    tmpObj.currentReloads.primary = (1 - cxl) * tmpObj.currentReloads.primary + cxl * cxk.primary;
                    tmpObj.currentReloads.secondary = (1 - cxl) * tmpObj.currentReloads.secondary + cxl * cxk.secondary;
                    tmpObj.currentReloads.turret = (1 - cxl) * tmpObj.currentReloads.turret + cxl * cxk.turret;
                    if (tmpObj.currentReloads.secondary < 0.999) {
                        let cxm = tmpObj.currentReloads.secondary;
                        mainContext.fillStyle = darkOutlineColor;
                        mainContext.roundRect(tmpObj.x - cwm + 2 - config.healthBarPad, tmpObj.y - cwn + tmpObj.scale + config.nameY - 13, 47 + config.healthBarPad * 2, 17, 10);
                        mainContext.fill();
                        mainContext.fillStyle = tmpObj == player || tmpObj.team && tmpObj.team == player.team ? "#8ecc51" : "#cc5151";
                        mainContext.roundRect(tmpObj.x - cwm + 2, tmpObj.y - cwn + tmpObj.scale + config.nameY - 13 + config.healthBarPad, cxm * 47, 16 - config.healthBarPad * 2, 10);
                        mainContext.fill();
                    }
                    if (tmpObj.currentReloads.primary < 0.999) {
                        let cxn = tmpObj.currentReloads.primary;
                        mainContext.fillStyle = darkOutlineColor;
                        mainContext.roundRect(tmpObj.x - cwm - 50 - config.healthBarPad, tmpObj.y - cwn + tmpObj.scale + config.nameY - 13, 47 + config.healthBarPad * 2, 17, 10);
                        mainContext.fill();
                        mainContext.fillStyle = tmpObj == player || tmpObj.team && tmpObj.team == player.team ? "#8ecc51" : "#cc5151";
                        mainContext.roundRect(tmpObj.x - cwm - 50, tmpObj.y - cwn + tmpObj.scale + config.nameY - 13 + config.healthBarPad, cxn * 47, 16 - config.healthBarPad * 2, 10);
                        mainContext.fill();
                    }
                    if (tmpObj == player) {}
                }
                if (inGame) {
                    cxo(0, 20, 20, "rgba(0,0,0,5)", "auto", 6, true);
                }
            }
        }
    }

    function cxo(cxp, cxq, cxr, cxs, cxt, cxu = 0, cxv) {
        let cxx = cxv == true ? tmpObj.isPlayer && tmpObj != player : tmpObj.isPlayer && tmpObj.sid != player.sid && (!isAlly(tmpObj.sid) || tmpObj.sid == player.sid);
        let cxy = {
            x: screenWidth / 2,
            y: screenHeight / 2
        };
        let cxz = Math.min(1, UTILS.getDistance(0, 0, player.x - tmpObj.x, (player.y - tmpObj.y) * 1.7777777777777777) * 100 / (config.maxScreenHeight / 2) / cxy.y);
        if (cxx && !tmpObj.isTeam(player)) {
            let cya = Math.sqrt((tmpObj.x - player.x) ** 2 + (tmpObj.x - player.x) ** 2);
            let cyb = player.x + cya * 0.5 * Math.cos(Math.atan2(tmpObj.y - player.y, tmpObj.x - player.x));
            let cyc = player.y + cya * 0.5 * Math.sin(Math.atan2(tmpObj.y - player.y, tmpObj.x - player.x));
            mainContext.save();
            mainContext.translate(cyb - cwm, cyc - cwn);
            mainContext.rotate(Math.atan2(tmpObj.y - player.y, tmpObj.x - player.x) + Math.PI / 2);
            mainContext.fillStyle = cxs;
            mainContext.globalAlpha = cxt == "auto" ? cxz : cxt;
            mainContext.lineWidth = cxu;
            mainContext.lineCap = "round";
            mainContext.beginPath();
            mainContext.strokeStyle = "transparent";
            mainContext.moveTo(cxp, cxp);
            mainContext.lineTo(cxq, cxq);
            mainContext.lineTo(-cxr, cxr);
            mainContext.fill();
            mainContext.stroke();
            mainContext.closePath();
            mainContext.restore();
        }
    }

    function cyd(cye, cyf, cyg, cyh, cyi, cyj, cyk, cyl) {
        mainContext.save();
        mainContext.translate(cyg - cye, cyh - cyf);
        mainContext.rotate(Math.PI / 4);
        mainContext.rotate(cyk);
        mainContext.globalAlpha = 1;
        mainContext.strokeStyle = cyj;
        mainContext.lineCap = "round";
        mainContext.lineWidth = cyl;
        mainContext.beginPath();
        mainContext.moveTo(-cyi, -cyi);
        mainContext.lineTo(cyi, -cyi);
        mainContext.lineTo(cyi, cyi);
        mainContext.stroke();
        mainContext.closePath();
        mainContext.restore();
    }
    if (player) {
        if (my.autoPush && my.pushData) {
            let cyn = near.dist2;
            mainContext.lineWidth = 5;
            mainContext.globalAlpha = Math.max(0.5, 1 - cyn / 1000000);
            mainContext.lineCap = "round";
            mainContext.beginPath();
            mainContext.strokeStyle = "#FFFFFF";
            let cyo = Math.max(5, Math.min(20, cyn / 100));
            mainContext.setLineDash([cyo, cyo * 2]);
            mainContext.moveTo(player.x - cwm, player.y - cwn);
            let cyp = (player.x + my.pushData.x) / 2 - cwm;
            let cyq = (player.y + my.pushData.y) / 2 - cwn - 100;
            mainContext.quadraticCurveTo(cyp, cyq, my.pushData.x - cwm, my.pushData.y - cwn);
            mainContext.stroke();
            mainContext.setLineDash([]);
            mainContext.lineWidth = 9;
            mainContext.globalAlpha = 0.2;
            mainContext.stroke();
        }
    }
    mainContext.globalAlpha = 1;
    renderMinimap(delta);
    textManager.update(delta, mainContext, cwm, cwn);
    for (let cyr = 0; cyr < players.length; ++cyr) {
        tmpObj = players[cyr];
        if (tmpObj.visible) {
            if (tmpObj.chatCountdown > 0) {
                tmpObj.chatCountdown -= delta;
                if (tmpObj.chatCountdown <= 0) {
                    tmpObj.chatCountdown = 0;
                }
                mainContext.font = "22px Lilita One";
                let cys = mainContext.measureText(tmpObj.chatMessage);
                mainContext.textBaseline = "middle";
                mainContext.textAlign = "center";
                let cyt = tmpObj.x - cwm;
                let cyu = tmpObj.y - tmpObj.scale - cwn - 130;
                let cyv = 47;
                let cyw = cys.width + 17;
                mainContext.fillStyle = "rgba(0,0,0,0.2)";
                mainContext.roundRect(cyt - cyw / 2, cyu - cyv / 2, cyw, cyv, 6);
                mainContext.fill();
                mainContext.fillStyle = "#fff";
                mainContext.fillText(tmpObj.chatMessage, cyt, cyu);
            }
            if (tmpObj.chat.count > 0) {
                tmpObj.chat.count -= delta;
                if (tmpObj.chat.count <= 0) {
                    tmpObj.chat.count = 0;
                }
                mainContext.font = "25px Lilita One";
                let cyx = mainContext.measureText(tmpObj.chat.message);
                mainContext.textBaseline = "middle";
                mainContext.textAlign = "center";
                let cyy = tmpObj.x - cwm;
                let cyz = tmpObj.y - tmpObj.scale - cwn + 140;
                let cza = 47;
                let czb = cyx.width + 17;
                mainContext.fillStyle = "rgba(0,0,0,0)";
                mainContext.roundRect(cyy - czb / 2, cyz - cza / 2, czb, cza, 6);
                mainContext.fill();
                mainContext.fillStyle = "#cc5151";
                mainContext.fillText(tmpObj.chat.message, cyy, cyz);
            } else {
                tmpObj.chat.count = 0;
            }
        }
    }
    if (allChats.length) {
        allChats.filter(czc => czc.active).forEach(czd => {
            if (!czd.alive) {
                if (czd.alpha <= 1) {
                    czd.alpha += delta / 250;
                    if (czd.alpha >= 1) {
                        czd.alpha = 1;
                        czd.alive = true;
                    }
                }
            } else {
                czd.alpha -= delta / 5000;
                if (czd.alpha <= 0) {
                    czd.alpha = 0;
                    czd.active = false;
                }
            }
            if (czd.active) {
                mainContext.font = "20px Hammersmith One";
                let czf = mainContext.measureText(czd.chat);
                mainContext.textBaseline = "middle";
                mainContext.textAlign = "center";
                let czg = czd.x - cwm;
                let czh = czd.y - cwn - 90;
                let czi = 40;
                let czj = czf.width + 15;
                mainContext.globalAlpha = czd.alpha;
                mainContext.fillStyle = czd.owner.isTeam(player) ? "#8ecc51" : "#cc5151";
                mainContext.strokeStyle = "rgb(25, 25, 25)";
                mainContext.strokeText(czd.owner.name, czg, czh - 45);
                mainContext.fillText(czd.owner.name, czg, czh - 45);
                mainContext.lineWidth = 5;
                mainContext.fillStyle = "#ccc";
                mainContext.strokeStyle = "rgb(25, 25, 25)";
                mainContext.roundRect(czg - czj / 2, czh - czi / 2, czj, czi, 6);
                mainContext.stroke();
                mainContext.fill();
                mainContext.fillStyle = "#fff";
                mainContext.strokeStyle = "#000";
                mainContext.strokeText(czd.chat, czg, czh);
                mainContext.fillText(czd.chat, czg, czh);
                czd.y -= delta / 100;
            }
        });
    }
    mainContext.globalAlpha = 1;
    renderMinimap(delta);
}
window.requestAnimFrame = function() {
    return null;
};
window.rAF = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(czl) {
        window.setTimeout(czl, 111.11111111111111);
    };
}();

function doUpdate() {
    now = performance.now();
    delta = now - lastUpdate;
    lastUpdate = now;
    let czo = performance.now();
    let czp = czo - fpsTimer.last;
    if (czp >= 950) {
        fpsTimer.ltime = fpsTimer.time * (950 / czp);
        fpsTimer.last = czo;
        fpsTimer.time = 0;
    }
    fpsTimer.time++;
    let czq = window.pingTime;
    if (getEl("fakePing").checked) {
        getEl("pingFps").innerHTML = czq + " | FPS: " + Math.round(fpsTimer.ltime) + " | Packet: " + secPacket + " | AutoMills: " + mills.place + " | CanInsta?: " + instaC.isTrue;
    } else {
        getEl("pingFps").innerHTML = window.pingTime + " | FPS: " + Math.round(fpsTimer.ltime) + " | Packet: " + secPacket + " | AutoMills: " + mills.place + " | CanInsta?: " + instaC.isTrue;
    }
    updateGame();
    rAF(doUpdate);
    ms.avg = Math.round((ms.min + ms.max) / 2);
}
prepareMenuBackground();
doUpdate();

function toggleUseless(czr) {
    getEl("antiBullType").disabled = czr;
    getEl("BuildHealth").disabled = czr;
}
toggleUseless(useWasd);
let changeDays = {};
window.debug = function() {
    my.waitHit = 0;
    my.autoAim = false;
    instaC.isTrue = false;
    traps.inTrap = false;
    my.autoPush = false;
    pathFind.active = false;
    pathFind.chaseNear = false;
    itemSprites = [];
    objSprites = [];
    gameObjectSprites = [];
};
window.wasdMode = function() {
    useWasd = !useWasd;
    toggleUseless(useWasd);
};
window.startGrind = function() {
    if (getEl("weaponGrind").checked) {
        for (let czx = 0; czx < Math.PI * 2; czx += Math.PI / 2) {
            checkPlace(player.getItemType(22), czx);
        }
    }
};
let projects = ["adorable-eight-guppy", "galvanized-bittersweet-windshield"];
let botIDS = 0;
window.connectFillBots = function() {
    botSkts = [];
    botIDS = 0;
    for (let czz = 0; czz < projects.length; czz++) {
        let daa = new WebSocket("wss://" + projects[czz] + ".glitch.me");
        daa.binaryType = "arraybuffer";
        daa.onopen = function() {
            daa.ssend = function(dac) {
                let dae = Array.prototype.slice.call(arguments, 1);
                let daf = window.msgpack.encode([dac, dae]);
                daa.send(daf);
            };
            for (let dag = 0; dag < 4; dag++) {
                window.grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
                    action: "homepage"
                }).then(function(dah) {
                    let daj = WS.url.split("wss://")[1].split("?")[0];
                    daa.ssend("bots", "wss://" + daj + "?token=re:" + encodeURIComponent(dah), botIDS);
                    botSkts.push([daa]);
                    botIDS++;
                });
            }
        };
        daa.onmessage = function(dak) {
            let dam = new Uint8Array(dak.data);
            let dan = window.msgpack.decode(dam);
            let dao = dan[0];
            dam = dan[1];
        };
    }
};
window.destroyFillBots = function() {
    botSkts.forEach(dap => {
        dap[0].close();
    });
    botSkts = [];
};
window.tryConnectBots = function() {
    for (let dat = 0; dat < (bots.length < 3 ? 3 : 4); dat++) {
        window.grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
            action: "homepage"
        }).then(function(dau) {
            botSpawn(dau);
        });
    }
};
window.destroyBots = function() {
    bots.forEach(daw => {
        daw.closeSocket = true;
    });
    bots = [];
};
window.resBuild = function() {
    if (gameObjects.length) {
        gameObjects.forEach(day => {
            day.breakObj = false;
        });
        breakObjects = [];
    }
};
window.toggleBotsCircle = function() {
    player.circle = !player.circle;
};
window.toggleVisual = function() {
    config.anotherVisual = !config.anotherVisual;
    gameObjects.forEach(dbc => {
        if (dbc.active) {
            dbc.dir = dbc.lastDir;
        }
    });
};
window.prepareUI = function(dbe) {
    resize();
    var dbg = document.getElementById("chatBox");
    var dbh = document.getElementById("chatHolder");
    var dbi = document.createElement("div");
    dbi.id = "suggestBox";
    var dbj = [];
    var dbk = 0;

    function dbl() {
        if (!usingTouch) {
            if (dbh.style.display == "block") {
                if (dbg.value) {
                    sendChat(dbg.value);
                }
                dbn();
            } else {
                storeMenu.style.display = "none";
                allianceMenu.style.display = "none";
                dbh.style.display = "block";
                dbg.focus();
                resetMoveDir();
            }
        } else {
            setTimeout(function() {
                var dbp = prompt("chat message");
                if (dbp) {
                    sendChat(dbp);
                }
            }, 1);
        }
        dbg.value = "";
        (() => {
            dbk = 0;
        })();
    }

    function dbn() {
        dbg.value = "";
        dbh.style.display = "none";
    }
    UTILS.removeAllChildren(actionBar);
    for (let dbr = 0; dbr < items.weapons.length + items.list.length; ++dbr) {
        (function(dbs) {
            UTILS.generateElement({
                id: "actionBarItem" + dbs,
                class: "actionBarItem",
                onmouseout: function() {
                    showItemInfo();
                },
                parent: actionBar
            });
        })(dbr);
    }
    for (let dbt = 0; dbt < items.list.length + items.weapons.length; ++dbt) {
        (function(dbu) {
            let dbw = document.createElement("canvas");
            dbw.width = dbw.height = 66;
            let dbx = dbw.getContext("2d");
            dbx.translate(dbw.width / 2, dbw.height / 2);
            dbx.imageSmoothingEnabled = false;
            dbx.webkitImageSmoothingEnabled = false;
            dbx.mozImageSmoothingEnabled = false;
            if (items.weapons[dbu]) {
                dbx.rotate(Math.PI);
                let dby = new Image();
                toolSprites[items.weapons[dbu].src] = dby;
                dby.onload = function() {
                    this.isLoaded = true;
                    let dca = 1 / (this.height / this.width);
                    let dcb = items.weapons[dbu].iPad || 1;
                    dbx.drawImage(this, -(dbw.width * dcb * config.iconPad * dca) / 2, -(dbw.height * dcb * config.iconPad) / 2, dbw.width * dcb * dca * config.iconPad, dbw.height * dcb * config.iconPad);
                    dbx.fillStyle = "rgba(0, 0, 70, 0.2)";
                    dbx.globalCompositeOperation = "source-atop";
                    dbx.fillRect(-dbw.width / 2, -dbw.height / 2, dbw.width, dbw.height);
                    getEl("actionBarItem" + dbu).style.backgroundImage = "url(" + dbw.toDataURL() + ")";
                };
                dby.src = "./../img/weapons/" + items.weapons[dbu].src + ".png";
                let dcc = getEl("actionBarItem" + dbu);
                dcc.onclick = UTILS.checkTrusted(function() {
                    selectWeapon(dbe.weapons[items.weapons[dbu].type]);
                });
                UTILS.hookTouchEvents(dcc);
            } else {
                let dce = getItemSprite(items.list[dbu - items.weapons.length], true);
                let dcf = Math.min(dbw.width - config.iconPadding, dce.width);
                dbx.globalAlpha = 1;
                dbx.drawImage(dce, -dcf / 2, -dcf / 2, dcf, dcf);
                dbx.fillStyle = "rgba(0, 0, 70, 0.1)";
                dbx.globalCompositeOperation = "source-atop";
                dbx.fillRect(-dcf / 2, -dcf / 2, dcf, dcf);
                getEl("actionBarItem" + dbu).style.backgroundImage = "url(" + dbw.toDataURL() + ")";
                let dcg = getEl("actionBarItem" + dbu);
                dcg.onclick = UTILS.checkTrusted(function() {
                    selectToBuild(dbe.items[dbe.getItemType(dbu - items.weapons.length)]);
                });
                UTILS.hookTouchEvents(dcg);
            }
        })(dbt);
    }
};
window.profineTest = function(dci) {
    if (dci) {
        let dck = dci + "";
        dck = dck.slice(0, config.maxNameLength);
        return dck;
    }
};
var uwu = document.getElementById("foodDisplay");
var da = document.getElementById("woodDisplay");
var das = document.getElementById("stoneDisplay");
var dsa = document.getElementById("killCounter");
var ds312a = document.getElementById("scoreDisplay");
var dsa2 = document.getElementById("chatBox");
var ds312a2 = document.getElementById("leaderboard");
var ds312a3 = document.getElementById("ageText");
var ds312a4 = document.getElementById("actionBar");
var ds312a5 = document.getElementById("pingDisplay");
var ds312a6 = document.getElementById("upgradeCounter");
var elements = [uwu, da, das, dsa, ds312a, dsa2, ds312a2, ds312a3, ds312a4, ds312a5, ds312a6];
elements.forEach(function(dcl) {
    if (dcl) {
        dcl.style.fontFamily = "Lilita One";
    }
});
const getContextHandler = {
    apply(dcn, dco, dcp) {
        const dcr = dcn.apply(dco, dcp);
        if (dco.id == "gameCanvas") {
            context = dcr;
        }
        return dcr;
    }
};
const requestAnimationFrameHandler = {
    apply(dcs, dct, dcu) {
        if (context) {
            context.globalAlpha = 0.3;
        }
        return dcs.apply(dct, dcu);
    }
};
let context = null;
Object.setPrototypeOf(getContextHandler, null);
Object.setPrototypeOf(requestAnimationFrameHandler, null);
HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, getContextHandler);
window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, requestAnimationFrameHandler);
document.getElementById("altcha").style.display = "none";
let antiAltcha = () => {
    document.getElementById("altcha_checkbox").click();
};
antiAltcha();