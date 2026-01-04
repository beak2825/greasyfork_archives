// ==UserScript==
// @name         Infinity Ware
// @namespace    http://tampermonkey.net/
// @version      .03
// @description  x18k-chicken hybrid
// @author       Mr. who think he Zyphyr
// @match        https://*.moomoo.io/*
// @grant        none
// @icon         http://moomoo.io/img/icons/crown.png
// @downloadURL https://update.greasyfork.org/scripts/530781/Infinity%20Ware.user.js
// @updateURL https://update.greasyfork.org/scripts/530781/Infinity%20Ware.meta.js
// ==/UserScript==
let whereverifybutton = document.querySelector("#altcha_checkbox")
function clicktheverify() {
if (whereverifybutton) {
    whereverifybutton.click()
}
}
setInterval(clicktheverify, 1000);



const {
    sin: V,
    cos: U,
    min: j,
    max: oe,
    random: t,
    floor: f,
    trunc: n,
    ceil: c,
    round: H,
    tan: i,
    PI: W,
    sqrt: D,
    abs: S,
    pow: re,
    log: s,
    LN2: o,
    atan2: P,
    SQRT2: r,
    acos: a,
    sign: l,
    hypot: d
} = Math;
const ae = W * 2;
const h = W / 2.6;
const le = JSON.stringify;
const E = JSON.parse;
const ce = 1e3 / 9;
const u = ce * 2;
const {
    now: R
} = Date;
var N = "https://fonts.googleapis.com/css2?family=Lilita+One&display=swap";
var O = document.createElement("link");
O.rel = "stylesheet";
O.href = N;
document.head.appendChild(O);
const L = .35;
const F = new Set(["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "#67A9DD"]);
let _ = [];

function de(e, t) {
    const n = e => parseInt(e, 16);
    const i = (e, t) => e * t | 0;
    const s = e => e.toString(16).padStart(2, "0");
    const o = i(n(e.substr(1, 2)), 1 - t);
    const r = i(n(e.substr(3, 2)), 1 - t);
    const a = i(n(e.substr(5, 2)), 1 - t);
    return `#${s(o)}${s(r)}${s(a)}`
}

function ue(e, t) {
    const n = e => parseInt(e, 16);
    const i = (e, t) => Math.min(255, e + t | 0);
    const s = e => e.toString(16).padStart(2, "0");
    const o = 255 * t;
    const r = i(n(e.substr(1, 2)), o);
    const a = i(n(e.substr(3, 2)), o);
    const l = i(n(e.substr(5, 2)), o);
    return `#${s(r)}${s(a)}${s(l)}`
}
var fe = {
    hats: {},
    accessories: {},
    weapons: {},
    animals: {}
};
const he = document.createElement("div");
he.id = "transparentMenu";
document.body.appendChild(he);
var pe = `
 #transparentMenu {
     position: fixed;
     top: 0;
     left: 0;
     background: rgba(16, 16, 16, 0.9);
     /* Darker background color */
     color: #ffffff;
     padding: 20px;
     transition: all 0.5s ease-in-out;
     z-index: 9999;
     max-height: 80vh;
     overflow-y: auto;
     display: none;
     width: 400px;
     font-family: 'Arial', sans-serif;
     border: 2px solid #3a3a3a;
     /* Slightly lighter border color */
     border-radius: 12px;
     box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
 }

 #tabs {
     display: flex;
     margin-bottom: 10px;
     overflow-x: auto;
     scrollbar-width: thin;
     scrollbar-color: transparent transparent;
 }

 #tabs::-webkit-scrollbar {
     width: 6px;
 }

 #tabs::-webkit-scrollbar-thumb {
     background-color: #282828;
     /* Dark scrollbar thumb color */
 }

 .tab {
     cursor: pointer;
     padding: 12px;
     /* Slightly larger padding */
     margin-right: 8px;
     /* Slightly smaller margin */
     background: #333333;
     color: #ffffff;
     border: 1px solid #555555;
     border-bottom: none;
     user-select: none;
     white-space: nowrap;
     transition: background 0.3s ease-in-out, border 0.3s ease-in-out, color 0.3s ease-in-out;
     border-radius: 8px;
     /* Smaller border radius */
 }

 .tab.active {
     background: #2a2a2a;
     /* Darker active tab background color */
     border: 1px solid #3a3a3a;
     /* Slightly lighter active tab border color */
     color: #cccccc;
 }

 .section {
     margin-top: 10px;
     display: none;
     overflow-y: auto;
     max-height: 200px;
 }

 .section.active {
     display: block;
 }

 .section label {
     display: flex;
     align-items: center;
     margin-bottom: 8px;
     /* Slightly smaller margin */
     color: #ffffff;
 }

 .toggle-slider {
     position: relative;
     display: flex;
     align-items: center;
     width: 100%;
     height: 24px;
     /* Slightly larger height */
 }

 .toggle-slider input {
     opacity: 0;
     width: 0;
     height: 0;
 }

 .slider {
     position: relative;
     cursor: pointer;
     width: 50px;
     /* Wider slider */
     height: 24px;
     /* Slightly larger height */
     background-color: #2e2d2d;
     transition: background 0.3s ease-in-out;
     border-radius: 12px;
     /* Smaller border radius */
     margin-right: 8px;
     /* Slightly smaller margin */
 }

 .slider:before {
     position: absolute;
     content: "";
     height: 20px;
     /* Slightly larger height */
     width: 20px;
     /* Slightly larger width */
     left: 4px;
     bottom: 2px;
     background-color: black;
     transition: background 0.3s ease-in-out;
     border-radius: 50%;
 }

 input:checked+.slider {
     background-color: #666666;
 }

 input:focus+.slider {
     box-shadow: 0 0 1px #666666;
 }

 input:checked+.slider:before {
     transform: translateX(26px);
     /* Longer translation */
 }

 .slider.round {
     border-radius: 12px;
     /* Smaller border radius */
 }

 .slider.round:before {
     border-radius: 50%;
 }

 .dropdown-label {
     color: #ffffff;
     margin-top: 8px;
     /* Slightly smaller margin */
     width: 50%;
     /* Adjust width for the label */
 }

 .dropdown-container {
     display: flex;
     align-items: center;
     width: 50%;
     /* Adjust width for the dropdown */
     margin-top: 8px;
     /* Slightly smaller margin */
 }

 .chat-container {
     position: fixed;
     top: 0;
     left: 0;
     width: 400px;
     height: 250px;
     background: rgba(0, 0, 0, .0);
     color: white;
     opacity: 1;
     font-family: 'Norican', cursive;
     font-weight: bold;
     border-bottom-right-radius: 8px;
     padding: 10px;
     display: flex;
     flex-direction: column;
     justify-content: space-between;
 }

 .chat-history {
     height: 400px;
     overflow-y: auto;
     scrollbar-width: thin;
     scrollbar-color: rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.5);
 }

 .chat-input {
     height: 30px;
     background-color: rgba(255, 255, 255, 0);
     border: none;
     border-radius: 4px;
     outline: none;
     color: white;

     padding: 5px;
 }

 .scroll-button {
     position: fixed;
     top: 220px;
     left: 380px;
     // width: 18px;
     // height: 18px;
     // background-color: rgba(0, 0, 0, 0.3);
     border-radius: 100%;
     display: flex;
     justify-content: center;
     align-items: center;
     cursor: pointer;
     z-index: 1;
 }

 .scroll-button:hover {
     background-color: rgba(0, 0, 0, 0.8);
 }

 .scroll-button::before {
     content: "";
     width: 0;
     height: 0;
     border-top: 10px solid white;
     border-left: 7px solid transparent;
     border-right: 7px solid transparent;
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
 }
`;
const me = document.createElement("style");
me.textContent = pe;
document.head.appendChild(me);
const ge = document.createElement("div");
ge.className = "scroll-button";
ge.color = "white";
const ye = document.createElement("div");
ye.className = "chat-container";
const xe = document.createElement("div");
xe.className = "chat-history";
const we = document.createElement("input");
we.type = "text";
we.className = "chat-input";
we.placeholder = "To chat click here or press / key";
we.maxLength = 100;
ye.appendChild(xe);
ye.appendChild(we);
document.body.appendChild(ge);
document.body.appendChild(ye);
const be = 2e3;
const b = (e, t, n, i, s) => {
    const o = xe.scrollHeight - xe.scrollTop <= xe.clientHeight + 1;
    const r = document.createElement("div");
    r.style.wordWrap = "break-word";
    r.style.color = i ? "#6bdb79" : "white";
    xe.appendChild(r);
    if (!s) {
        const e = document.createElement("span");
        e.style.color = "rgba(255, 255, 255, 0.5)";
        e.style.marginRight = "5px";
        e.textContent = Me();
        r.appendChild(e)
    }
    const a = document.createElement("span");
    a.style.color = n;
    a.textContent = e;
    r.appendChild(a);
    const l = document.createElement("span");
    l.textContent = t;
    r.appendChild(l);
    if (xe.children.length > be) {
        xe.removeChild(xe.children[0])
    }
    if (o) {
        xe.scrollTop = xe.scrollHeight;
        ke()
    } else {
        ge.style.display = "block"
    }
};
const ve = () => {
    return xe.scrollHeight - xe.scrollTop <= xe.clientHeight + 1
};
const ke = () => {
    if (ve() || xe.clientHeight >= xe.scrollHeight) {
        ge.style.display = "none"
    } else {
        ge.style.display = "block"
    }
};
ge.addEventListener("click", () => {
    xe.scrollTop = xe.scrollHeight
});
xe.addEventListener("scroll", ke);
ge.style.display = "none";
we.addEventListener("keydown", e => {
    e.stopPropagation()
});

function Ae(e, t) {
    const n = De(e, t[0]);
    const i = t.map(e => `
            <option value="${e}" ${e===n?"selected":""}>${e}</option>
        `).join("");
    return `
     <label class="dropdown-label">${e}</label>
       <div class="dropdown-container">
       <select id="${e}" class="dropdown"">
         ${i}
       </select>
     </div>
    `
}

function e(e, t) {
    const n = De(e, t === undefined ? true : t);
    return `
        <label class="toggle-slider">
            <span>${e}</span>
            <input type="checkbox" ${n?"checked":""} id="${e}">
            <span class="slider round"></span>
        </label>
    `
}

function Ie(e, t, n = 200) {
    const i = De(e, "");
    return `
        <label>${e}</label>
        <input type="${t}" value="${i}" id="${e}" maxlength="${n}">
    `
}

function Se(e, t, n, i, s) {
    const o = De(e, i);
    return `
     <div>${s||""}</div>
     <label class="throttle-slider">
       <span>${e}</span>
       <input type="range" min="${t}" max="${n}" value="${o}" id="${e}">
       <span id="${e}-value">${o}</span>
     </label>
    `
}

function Ee(e) {
    const t = gy(e);
    const n = gy(`${e}-value`);
    n.innerText = t.value;
    Pe(e, t.value)
}
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        Be()
    }
});
const Te = ["Combat", "Healing", "AI", "Visuals", "Extra"];
const Ce = [
    ["auto break", "Qsync", "chatSync", "bots Qsync", "auto place", "onetick bypass", "auto replace", "spike sync", "auto push", "polearm aids", "melee sync", "bleed insta", "apple insta", "kbInsta", "stop break"],
    ["auto heal", "autoQ"],
    ["e", "stop on collision", "break spike trap", "bots auto clear", "auto hit", "strict soldier", "adv bot auto proj sync", "bot auto proj sync"],
    ["reload bars", "smooth reloads", "all visuals", "building hp", "building owner", "mill rotate", "stacked damages", "skull", "shame count", "shadows", "fp", "animated text"],
    ["Assassin Bots", "Assassin", "music", "circle bots", "bots APB", "bots break utility", "autobuy", "autohat", "stealing animal", "auto accept bots", "stop break bots", "auto equip fastest weapon", "send ws", "strict monkey", "bot smart aim"]
];
he.innerHTML = `
<div id="tabs">
  <div class="tab" onclick="showTab('section1')">Combat</div>
  <div class="tab" onclick="showTab('section2')">heal</div>
  <div class="tab" onclick="showTab('section3')">Visuals</div>
  <div class="tab" onclick="showTab('section4')">Keybinds</div>
  <div class="tab" onclick="showTab('section5')">Bots</div>
  <div class="tab" onclick="showTab('section6')">Throttles</div>
  <div class="tab" onclick="showTab('section7')">Extra</div>
</div>
<div id="section1" class="section active"> ${e("auto break")} ${e("stop on break")} ${e("auto place")} ${e("auto replace",false)} ${e("auto push")} ${e("polearm aids")} ${e("aids spike sync",false)} ${e("melee sync",false)} ${e("bleed insta",false)} ${e("apple insta",false)} ${e("kbInsta")} ${e("kbInsta without turret gear",false)} ${e("kbAssist",false)} ${e("stop break")} ${e("stop on collision",false)} ${e("movement on collision",false)} ${e("strict soldier")} ${e("strict monkey")} ${e("auto equip fastest weapon")} ${e("break spike trap")} ${e("Auto Emp")} ${e("autohat")} ${Se("APA",20,180,50)} </div>
<div id="section2" class="section"> ${e("auto heal")} ${e("autoQ",false)} </div>
<div id="section3" class="section"> ${e("reload bars",false)} ${e("packet count",true)} ${e("all visuals")} ${e("no outline arcs")} ${e("no arcs")} ${e("reload arcs")} ${e("smooth reloads")} ${e("building hp")} ${e("building owner")} ${e("mill rotate",false)} ${e("regular grid")} ${e("stacked damages")} ${e("stacked heal text")} ${e("show place duration",false)} ${e("log autoplace",false)} ${e("spike kb visual")} ${e("skull",true)} ${e("shame count")} ${e("log projectiles",false)} ${e("shadows")} ${e("animated text")} ${e("ChatLog")} ${e("vis aim")} ${e("hide name")} ${e("See through player")} ${e("Shaders",false)} ${e("Legacy Visuals",false)} ${e("Default Visuals",false)} ${e("Op Visuals",false)} </div>
<div id="section4" class="section"> ${e("Toggle Quest 1")} ${Ie("Quest Progress","number")} ${e("Toggle Quest 2")} ${Ie("Quest Reward","text")} ${e("Toggle Quest 3")} ${Ie("Quest Difficulty","number")} </div>
<div id="section5" class="section"> ${Ae("Bot Summon Movement",["Cursor","Copy","Towards","none"],"itemType")} ${e("bot smart aim")} ${e("farm mats")} ${e("auto accept bots")} ${e("stop break bots",false)} ${e("safe walk bots",false)} ${e("bots break utility")} ${e("bots APB")} ${e("bots Qsync")} ${e("Assassin Bots",false)} ${e("circle bots",false)} ${e("bot auto proj sync")} ${e("adv bot auto proj sync")} ${e("Bots Auto Chat","text",30)} </div>
<div id="section6" class="section"> ${Se("Auto Place Accuracy",20,180,50,"higher means longer calculation time ↓")} </div>
<div id="section7" class="section"> ${e("Assassin",false)} ${e("send ws")} ${e("autobuy")} ${e("fix ws")} ${e("fakePing",true)} <div id="toggleContainer"> ${e("fakePing",false)} <div id="sliderContainer" style="display:none;">
<input type="range" min="0" max="100" value="40" id="pingSlider">
`;

function Be() {
    const e = document.getElementById("transparentMenu");
    const t = e.style.display === "block";
    e.style.display = t ? "none" : "block"
}

function De(e, t, n) {
    const i = localStorage.getItem(e);
    if (!n) {
        return i !== null ? JSON.parse(i) : t
    }
    return i !== null ? JSON.parse(i).value : t
}

function Pe(e, t) {
    localStorage.setItem(e, JSON.stringify(t))
}

function Re(e) {
    const t = document.querySelectorAll(".tab");
    t.forEach(e => e.classList.remove("active"));
    const n = document.querySelectorAll(".section");
    n.forEach(e => e.classList.remove("active"));
    const i = document.querySelector(`[onclick="showTab('${e}')"]`);
    const s = document.getElementById(e);
    if (i && s) {
        i.classList.add("active");
        s.classList.add("active")
    }
}
if (gy("ChatLog")?.checked) {
    xe.style.display = "block";
    we.style.display = "block"
} else {
    xe.style.display = "none";
    we.style.display = "none"
}
Re("section1");
document.getElementById("transparentMenu").addEventListener("change", function(e) {
    const n = e.target;
    const t = n.id;
    if (t === "ChatLog") {
        const e = document.querySelector(".chat-history");
        const t = document.querySelector(".chat-input");
        if (n.checked) {
            e.style.display = "block";
            t.style.display = "block"
        } else {
            e.style.display = "none";
            t.style.display = "none"
        }
    }
    const i = n.type == "checkbox" ? n.checked : n.value;
    console.log(n.type, n.id, n.value);
    Pe(t, i);
    if (n.type == "range") {
        Ee(t)
    }
});
document.getElementById("tabs").addEventListener("click", function(e) {
    const t = e.target.closest(".tab");
    if (t) {
        Re(t.getAttribute("onclick").match(/'([^']+)'/)[1])
    }
});

function Me() {
    const e = new Date;
    let t = e.getHours();
    let n = e.getMinutes();
    let i = "AM";
    if (t === 0) {
        t = 12
    } else if (t > 12) {
        i = "PM";
        t = t % 12
    }
    if (n < 10) {
        n = "0" + n
    }
    const s = t + ":" + n + " " + i;
    return s
}

function Ne(t, n) {
    const e = Math.SQRT2 - 1;
    t = S(t);
    n = S(n);
    if (t > n) {
        let e = t;
        t = n;
        n = e
    }
    return e * t + n
}

function Le(e, t, n, i, s) {
    if (!i) i = n;
    var o = document.createElement("canvas");
    var r = o.getContext("2d");
    o.width = n;
    o.height = i;
    r.shadowColor = "rgba(0, 0, 0, 1)";
    r.shadowBlur = e === "animal" ? 18 : e === "weapon" ? 12 : e == "accessory" ? 9 : 20;
    r.drawImage(t, 0, 0, n, i);
    var a = new Image;
    a.src = o.toDataURL();
    return a
}

function BotNames() {
    var e = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",d];
    var t = [""];

    var n = e[Math.floor(Math.random() * e.length)];
    var i = t[Math.floor(Math.random() * t.length)];

    return n + i;
}
var _e = BotNames();
setInterval(() => {
    _e = BotNames();
}, 100);
var Ve = [],
    m = [],
    Ue = [],
    je, He = 0,
    We = 0,
    Qe = 0,
    Ye = [],
    ze = 0,
    Ge = [],
    Ke = msgpack,
    Xe = [],
    v = 0,
    Je = [],
    qe = [],
    $e = [],
    Ze = [],
    et = 0,
    tt, nt = {},
    it = Date.now(),
    st = false,
    g = [],
    ot = false,
    rt = null,
    at, lt, y, ct = false,
    dt = [],
    ut = [],
    ft = [],
    ht = [],
    pt, mt, gt = false,
    yt = [],
    xt = null,
    wt = null,
    bt = [],
    vt, kt = [],
    At = false,
    It = [],
    St = 0,
    Et = 0,
    Tt = true,
    Ct = false,
    Bt = false,
    Dt, Pt, Rt, Mt = false,
    Nt, Ot = false,
    Lt, Ft, _t = false,
    Vt = 0,
    Ut = null,
    jt = false,
    Ht = false,
    Wt = {
        sec: false,
        min: false
    },
    Qt, Yt = [],
    zt = [51, 50, 28, 29, 30, 36, 37, 38, 44, 35, 42, 43, 49, 57, 8, 2, 15, , 5, 4, 18, 31, 1, 10, 48, 6, 23, 13, 9, 32, 22, 12, 26, 21, 46, 14, 11, 58, 27, 52, 55],
    Gt = [0],
    Kt = [0],
    Q = [],
    Xt = [],
    Jt, qt, $t = null,
    Zt = null,
    en = false,
    tn = Date.now(),
    nn = 0,
    sn = 0,
    on = {
        status: false,
        w: null,
        a: null,
        s: null,
        d: null,
        aim: null,
        x: 0,
        y: 0
    },
    rn = [],
    an = [],
    ln = [],
    cn = [],
    dn = false,
    un = false,
    p = false,
    fn = false,
    hn = false,
    pn = [],
    mn, gn, yn, xn = false,
    wn, bn, vn = [],
    kn = [],
    An = [],
    In = true,
    Sn = [],
    En = [1, 1.1, 1.18, 1.18],
    Y, Tn = [],
    Cn = [],
    Bn = [],
    Dn = null,
    Pn = [],
    Rn = [],
    Mn = [],
    Nn = [51, 50, 28, 29, 30, 36, 37, 38, 44, 35, 42, 43, 49],
    On = [],
    Ln = [],
    Fn = [
        [11], 40, 6, 7, 53, [21], 12, 56, 15, 22, 31, 26, 11, 20, [18],
        [19],
        [13]
    ],
    _n = false,
    Vn = false,
    Un = false,
    jn = "not",
    Hn = false,
    Wn, Qn, Yn, zn = [],
    Gn = false,
    Kn = false,
    Xn, Jn, qn, $n, Zn = {
        msg: "",
        time: 0,
        id: null
    },
    z, ei = [],
    ti, ni, ii, si, oi = null,
    ri, ai = "Wander",
    li = 400,
    ci = 290,
    di = 222,
    ui, fi = 1e3,
    hi = "all",
    pi = 0,
    mi = 0,
    gi = "all",
    yi = 110,
    xi = {
        ID: null,
        player: null
    },
    wi = false,
    bi = "L Nigger Faggot",
    vi = "Samurai: Fastest",
    ki = 200,
    Ai = [],
    Ii = [],
    Si = [],
    Ei = [],
    Ti = true,
    Ci = [],
    Bi = 0,
    Di = null,
    Pi = false,
    Ri = [],
    Mi = 111,
    Ni = [],
    Oi = false,
    Li = false,
    Fi = null,
    _i = {
        x: null,
        y: null
    },
    Vi = [],
    Ui = [],
    ji = [],
    Hi = 0,
    Wi = [],
    Qi = new Map,
    Yi = new Map,
    zi = [],
    Gi = 0,
    Ki, Xi, Ji, qi, $i = undefined,
    Zi = {
        players: [],
        player: null,
        builds: [],
        isDoing: false,
        isMe: null
    },
    es = {
        players: [],
        player: null,
        builds: [],
        rPlayer: null,
        rBuilds: [],
        isDoing: false,
        isMe: null
    },
    ts = {
        players: [],
        bot: null,
        builds: []
    },
    G = {
        "do": null,
        val: 0,
        play: false
    };
let ns = [],
    is = [],
    ss = [];
let os = [],
    rs = [];
const as = (t, e) => e.some(e => e.sid === t.sid);
const ls = document.getElementById("Auto Place Accuracy");
const cs = document.getElementById("auto place");
const ds = document.getElementById("log autoplace");
const us = document.getElementById("mill rotate");
const fs = document.getElementById("send ws");
const hs = document.getElementById("stacked damages");
const ps = document.getElementById("stacked heal text");
const ms = document.getElementById("auto replace");
const gs = document.getElementById("regular grid");
const ys = document.getElementById("reload arcs");
const xs = document.getElementById("shame count");
const ws = document.getElementById("all visuals");
const bs = document.getElementById("reload bars");
const vs = document.getElementById("packet count");
const ks = document.getElementById("building hp");
const As = document.getElementById("building owner");
const Is = document.getElementById("smooth reloads");
const Ss = document.getElementById("Shaders");
const Es = document.getElementById("shadows");
const Ts = document.getElementById("autoQ");
const Cs = document.getElementById("apple insta");
const Bs = document.getElementById("bleed insta");
const Ds = document.getElementById("auto break");
const Ps = document.getElementById("stop break");
const Rs = document.getElementById("BotChat");
const Ms = document.getElementById("auto equip fastest weapon");
const Ns = document.getElementById("no arcs");
const Os = document.getElementById("no outline arcs");
const Ls = document.getElementById("See through player");
const Fs = document.getElementById("skull");
const _s = document.getElementById("auto accept bots");
const Vs = document.getElementById("break spike trap");
const Us = document.getElementById("auto heal");
const js = document.getElementById("strict soldier");
const Hs = document.getElementById("autohat");
const Ws = document.getElementById("strict monkey");
const Qs = document.getElementById("autobuy");
const Ys = document.getElementById("stop on collision");
const zs = document.getElementById("movement on collision");
const Gs = document.getElementById("show place duration");
const Ks = document.getElementById("spike kb visual");
const Xs = document.getElementById("melee sync");
const Js = document.getElementById("auto push");
const qs = document.getElementById("vis aim");
const $s = document.getElementById("stealing animal");
const Zs = document.getElementById("bots break utility");
const eo = document.getElementById("hide name");
const to = document.getElementById("kbInsta");
const no = document.getElementById("Auto Emp");
const io = document.getElementById("Assassin");
const so = document.getElementById("spike sync");
const oo = document.getElementById("log projectiles");
const ro = document.getElementById("circle bots");
const ao = document.getElementById("Bot Summon Movement");
const lo = document.getElementById("bots Qsync");
const co = document.getElementById("Qsync");
const uo = document.getElementById("bot smart aim");
const fo = document.getElementById("polearm aids");
const ho = document.getElementById("bot auto proj sync");
const po = document.getElementById("adv bot auto proj sync");
const mo = document.getElementById("Assassin Bots");
const go = document.getElementById("bots APB");
const yo = document.getElementById("safe walk bots");
const xo = document.getElementById("stop break bots");
const wo = document.getElementById("kbAssist");
const bo = document.getElementById("Legacy Visuals");
const vo = document.getElementById("Default Visuals");
const ko = document.getElementById("aids spike sync");
(function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const t of document.querySelectorAll('link[rel="modulepreload"]')) i(t);
    new MutationObserver(e => {
        for (const t of e)
            if (t.type === "childList")
                for (const n of t.addedNodes) n.tagName === "LINK" && n.rel === "modulepreload" && i(n)
    }).observe(document, {
        childList: !0,
        subtree: !0
    });

    function n(e) {
        const t = {};
        return e.integrity && (t.integrity = e.integrity), e.referrerpolicy && (t.referrerPolicy = e.referrerpolicy), e.crossorigin === "use-credentials" ? t.credentials = "include" : e.crossorigin === "anonymous" ? t.credentials = "omit" : t.credentials = "same-origin", t
    }

    function i(e) {
        if (e.ep) return;
        e.ep = !0;
        const t = n(e);
        fetch(e.href, t)
    }
})();
var Ao = 4294967295;

function Io(e, t, n) {
    var i = n / 4294967296,
        s = n;
    e.setUint32(t, i), e.setUint32(t + 4, s)
}

function So(e, t, n) {
    var i = f(n / 4294967296),
        s = n;
    e.setUint32(t, i), e.setUint32(t + 4, s)
}

function Eo(e, t) {
    var n = e.getInt32(t),
        i = e.getUint32(t + 4);
    return n * 4294967296 + i
}

function To(e, t) {
    var n = e.getUint32(t),
        i = e.getUint32(t + 4);
    return n * 4294967296 + i
}
var Co, Bo, Do, Po = (typeof process > "u" || ((Co = process == null ? void 0 : process.env) === null || Co === void 0 ? void 0 : Co.TEXT_ENCODING) !== "never") && typeof TextEncoder < "u" && typeof TextDecoder < "u";

function Ro(e) {
    for (var t = e.length, n = 0, i = 0; i < t;) {
        var s = e.charCodeAt(i++);
        if (s & 4294967168)
            if (!(s & 4294965248)) n += 2;
            else {
                if (s >= 55296 && s <= 56319 && i < t) {
                    var o = e.charCodeAt(i);
                    (o & 64512) === 56320 && (++i, s = ((s & 1023) << 10) + (o & 1023) + 65536)
                }
                s & 4294901760 ? n += 4 : n += 3
            }
        else {
            n++;
            continue
        }
    }
    return n
}

function Mo(e, t, n) {
    for (var i = e.length, s = n, o = 0; o < i;) {
        var r = e.charCodeAt(o++);
        if (r & 4294967168)
            if (!(r & 4294965248)) t[s++] = r >> 6 & 31 | 192;
            else {
                if (r >= 55296 && r <= 56319 && o < i) {
                    var a = e.charCodeAt(o);
                    (a & 64512) === 56320 && (++o, r = ((r & 1023) << 10) + (a & 1023) + 65536)
                }
                r & 4294901760 ? (t[s++] = r >> 18 & 7 | 240, t[s++] = r >> 12 & 63 | 128, t[s++] = r >> 6 & 63 | 128) : (t[s++] = r >> 12 & 15 | 224, t[s++] = r >> 6 & 63 | 128)
            }
        else {
            t[s++] = r;
            continue
        }
        t[s++] = r & 63 | 128
    }
}
var No = Po ? new TextEncoder : void 0,
    Oo = Po ? typeof process < "u" && ((Bo = process == null ? void 0 : process.env) === null || Bo === void 0 ? void 0 : Bo.TEXT_ENCODING) !== "force" ? 200 : 0 : Ao;

function Lo(e, t, n) {
    t.set(No.encode(e), n)
}

function Fo(e, t, n) {
    No.encodeInto(e, t.subarray(n))
}
var _o = No != null && No.encodeInto ? Fo : Lo,
    Vo = 4096;

function Uo(e, t, n) {
    for (var i = t, s = i + n, o = [], r = ""; i < s;) {
        var a = e[i++];
        if (!(a & 128)) o.push(a);
        else if ((a & 224) === 192) {
            var l = e[i++] & 63;
            o.push((a & 31) << 6 | l)
        } else if ((a & 240) === 224) {
            var l = e[i++] & 63,
                c = e[i++] & 63;
            o.push((a & 31) << 12 | l << 6 | c)
        } else if ((a & 248) === 240) {
            var l = e[i++] & 63,
                c = e[i++] & 63,
                d = e[i++] & 63,
                u = (a & 7) << 18 | l << 12 | c << 6 | d;
            u > 65535 && (u -= 65536, o.push(u >>> 10 & 1023 | 55296), u = 56320 | u & 1023), o.push(u)
        } else o.push(a);
        o.length >= Vo && (r += String.fromCharCode.apply(String, o), o.length = 0)
    }
    return o.length > 0 && (r += String.fromCharCode.apply(String, o)), r
}
var jo = Po ? new TextDecoder : null,
    Ho = Po ? typeof process < "u" && ((Do = process == null ? void 0 : process.env) === null || Do === void 0 ? void 0 : Do.TEXT_DECODER) !== "force" ? 200 : 0 : Ao;

function Wo(e, t, n) {
    var i = e.subarray(t, t + n);
    return jo.decode(i)
}
var Qo = function() {
    function e(e, t) {
        this.type = e, this.data = t
    }
    return e
}(),
    Yo = globalThis && globalThis.__extends || function() {
        var i = function(e, t) {
            return i = Object.setPrototypeOf || {
                __proto__: []
            }
            instanceof Array && function(e, t) {
                e.__proto__ = t
            } || function(e, t) {
                for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
            }, i(e, t)
        };
        return function(e, t) {
            if (typeof t != "function" && t !== null) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
            i(e, t);

            function n() {
                this.constructor = e
            }
            e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n)
        }
    }(),
    zo = function(i) {
        Yo(s, i);

        function s(e) {
            var t = i.call(this, e) || this,
                n = Object.create(s.prototype);
            return Object.setPrototypeOf(t, n), Object.defineProperty(t, "name", {
                configurable: !0,
                enumerable: !1,
                value: s.name
            }), t
        }
        return s
    }(Error),
    Go = -1,
    Ko = 4294967296 - 1,
    Xo = 17179869184 - 1;

function Jo(e) {
    var t = e.sec,
        n = e.nsec;
    if (t >= 0 && n >= 0 && t <= Xo)
        if (n === 0 && t <= Ko) {
            var i = new Uint8Array(4),
                s = new DataView(i.buffer);
            return s.setUint32(0, t), i
        } else {
            var o = t / 4294967296,
                r = t & 4294967295,
                i = new Uint8Array(8),
                s = new DataView(i.buffer);
            return s.setUint32(0, n << 2 | o & 3), s.setUint32(4, r), i
        }
    else {
        var i = new Uint8Array(12),
            s = new DataView(i.buffer);
        return s.setUint32(0, n), So(s, 4, t), i
    }
}

function qo(e) {
    var t = e.getTime(),
        n = f(t / 1e3),
        i = (t - n * 1e3) * 1e6,
        s = f(i / 1e9);
    return {
        sec: n + s,
        nsec: i - s * 1e9
    }
}

function $o(e) {
    if (e instanceof Date) {
        var t = qo(e);
        return Jo(t)
    } else return null
}

function Zo(e) {
    var t = new DataView(e.buffer, e.byteOffset, e.byteLength);
    switch (e.byteLength) {
        case 4: {
            var n = t.getUint32(0),
                i = 0;
            return {
                sec: n,
                nsec: i
            }
        }
        case 8: {
            var s = t.getUint32(0),
                o = t.getUint32(4),
                n = (s & 3) * 4294967296 + o,
                i = s >>> 2;
            return {
                sec: n,
                nsec: i
            }
        }
        case 12: {
            var n = Eo(t, 4),
                i = t.getUint32(0);
            return {
                sec: n,
                nsec: i
            }
        }
        default:
            throw new zo("Unrecognized data size for timestamp (expected 4, 8, or 12): ".concat(e.length))
    }
}

function er(e) {
    var t = Zo(e);
    return new Date(t.sec * 1e3 + t.nsec / 1e6)
}
var tr = {
    type: Go,
    encode: $o,
    decode: er
},
    nr = function() {
        function e() {
            this.builtInEncoders = [], this.builtInDecoders = [], this.encoders = [], this.decoders = [], this.register(tr)
        }
        return e.prototype.register = function(e) {
            var t = e.type,
                n = e.encode,
                i = e.decode;
            if (t >= 0) this.encoders[t] = n, this.decoders[t] = i;
            else {
                var s = 1 + t;
                this.builtInEncoders[s] = n, this.builtInDecoders[s] = i
            }
        }, e.prototype.tryToEncode = function(e, t) {
            for (var n = 0; n < this.builtInEncoders.length; n++) {
                var i = this.builtInEncoders[n];
                if (i != null) {
                    var s = i(e, t);
                    if (s != null) {
                        var o = -1 - n;
                        return new Qo(o, s)
                    }
                }
            }
            for (var n = 0; n < this.encoders.length; n++) {
                var i = this.encoders[n];
                if (i != null) {
                    var s = i(e, t);
                    if (s != null) {
                        var o = n;
                        return new Qo(o, s)
                    }
                }
            }
            return e instanceof Qo ? e : null
        }, e.prototype.decode = function(e, t, n) {
            var i = t < 0 ? this.builtInDecoders[-1 - t] : this.decoders[t];
            return i ? i(e, t, n) : new Qo(t, e)
        }, e.defaultCodec = new e, e
    }();

function ir(e) {
    return e instanceof Uint8Array ? e : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : e instanceof ArrayBuffer ? new Uint8Array(e) : Uint8Array.from(e)
}

function sr(e) {
    if (e instanceof ArrayBuffer) return new DataView(e);
    var t = ir(e);
    return new DataView(t.buffer, t.byteOffset, t.byteLength)
}
var or = 100,
    rr = 2048,
    ar = function() {
        function e(e, t, n, i, s, o, r, a) {
            e === void 0 && (e = nr.defaultCodec), t === void 0 && (t = void 0), n === void 0 && (n = or), i === void 0 && (i = rr), s === void 0 && (s = !1), o === void 0 && (o = !1), r === void 0 && (r = !1), a === void 0 && (a = !1), this.extensionCodec = e, this.context = t, this.maxDepth = n, this.initialBufferSize = i, this.sortKeys = s, this.forceFloat32 = o, this.ignoreUndefined = r, this.forceIntegerToFloat = a, this.pos = 0, this.view = new DataView(new ArrayBuffer(this.initialBufferSize)), this.bytes = new Uint8Array(this.view.buffer)
        }
        return e.prototype.reinitializeState = function() {
            this.pos = 0
        }, e.prototype.encodeSharedRef = function(e) {
            return this.reinitializeState(), this.doEncode(e, 1), this.bytes.subarray(0, this.pos)
        }, e.prototype.encode = function(e) {
            return this.reinitializeState(), this.doEncode(e, 1), this.bytes.slice(0, this.pos)
        }, e.prototype.doEncode = function(e, t) {
            if (t > this.maxDepth) throw new Error("Too deep objects in depth ".concat(t));
            e == null ? this.encodeNil() : typeof e == "boolean" ? this.encodeBoolean(e) : typeof e == "number" ? this.encodeNumber(e) : typeof e == "string" ? this.encodeString(e) : this.encodeObject(e, t)
        }, e.prototype.ensureBufferSizeToWrite = function(e) {
            var t = this.pos + e;
            this.view.byteLength < t && this.resizeBuffer(t * 2)
        }, e.prototype.resizeBuffer = function(e) {
            var t = new ArrayBuffer(e),
                n = new Uint8Array(t),
                i = new DataView(t);
            n.set(this.bytes), this.view = i, this.bytes = n
        }, e.prototype.encodeNil = function() {
            this.writeU8(192)
        }, e.prototype.encodeBoolean = function(e) {
            e === !1 ? this.writeU8(194) : this.writeU8(195)
        }, e.prototype.encodeNumber = function(e) {
            Number.isSafeInteger(e) && !this.forceIntegerToFloat ? e >= 0 ? e < 128 ? this.writeU8(e) : e < 256 ? (this.writeU8(204), this.writeU8(e)) : e < 65536 ? (this.writeU8(205), this.writeU16(e)) : e < 4294967296 ? (this.writeU8(206), this.writeU32(e)) : (this.writeU8(207), this.writeU64(e)) : e >= -32 ? this.writeU8(224 | e + 32) : e >= -128 ? (this.writeU8(208), this.writeI8(e)) : e >= -32768 ? (this.writeU8(209), this.writeI16(e)) : e >= -2147483648 ? (this.writeU8(210), this.writeI32(e)) : (this.writeU8(211), this.writeI64(e)) : this.forceFloat32 ? (this.writeU8(202), this.writeF32(e)) : (this.writeU8(203), this.writeF64(e))
        }, e.prototype.writeStringHeader = function(e) {
            if (e < 32) this.writeU8(160 + e);
            else if (e < 256) this.writeU8(217), this.writeU8(e);
            else if (e < 65536) this.writeU8(218), this.writeU16(e);
            else if (e < 4294967296) this.writeU8(219), this.writeU32(e);
            else throw new Error("Too long string: ".concat(e, " bytes in UTF-8"))
        }, e.prototype.encodeString = function(e) {
            var t = 5,
                n = e.length;
            if (n > Oo) {
                var i = Ro(e);
                this.ensureBufferSizeToWrite(t + i), this.writeStringHeader(i), _o(e, this.bytes, this.pos), this.pos += i
            } else {
                var i = Ro(e);
                this.ensureBufferSizeToWrite(t + i), this.writeStringHeader(i), Mo(e, this.bytes, this.pos), this.pos += i
            }
        }, e.prototype.encodeObject = function(e, t) {
            var n = this.extensionCodec.tryToEncode(e, this.context);
            if (n != null) this.encodeExtension(n);
            else if (Array.isArray(e)) this.encodeArray(e, t);
            else if (ArrayBuffer.isView(e)) this.encodeBinary(e);
            else if (typeof e == "object") this.encodeMap(e, t);
            else throw new Error("Unrecognized object: ".concat(Object.prototype.toString.apply(e)))
        }, e.prototype.encodeBinary = function(e) {
            var t = e.byteLength;
            if (t < 256) this.writeU8(196), this.writeU8(t);
            else if (t < 65536) this.writeU8(197), this.writeU16(t);
            else if (t < 4294967296) this.writeU8(198), this.writeU32(t);
            else throw new Error("Too large binary: ".concat(t));
            var n = ir(e);
            this.writeU8a(n)
        }, e.prototype.encodeArray = function(e, t) {
            var n = e.length;
            if (n < 16) this.writeU8(144 + n);
            else if (n < 65536) this.writeU8(220), this.writeU16(n);
            else if (n < 4294967296) this.writeU8(221), this.writeU32(n);
            else throw new Error("Too large array: ".concat(n));
            for (var i = 0, s = e; i < s.length; i++) {
                var o = s[i];
                this.doEncode(o, t + 1)
            }
        }, e.prototype.countWithoutUndefined = function(e, t) {
            for (var n = 0, i = 0, s = t; i < s.length; i++) {
                var o = s[i];
                e[o] !== void 0 && n++
            }
            return n
        }, e.prototype.encodeMap = function(e, t) {
            var n = Object.keys(e);
            this.sortKeys && n.sort();
            var i = this.ignoreUndefined ? this.countWithoutUndefined(e, n) : n.length;
            if (i < 16) this.writeU8(128 + i);
            else if (i < 65536) this.writeU8(222), this.writeU16(i);
            else if (i < 4294967296) this.writeU8(223), this.writeU32(i);
            else throw new Error("Too large map object: ".concat(i));
            for (var s = 0, o = n; s < o.length; s++) {
                var r = o[s],
                    a = e[r];
                this.ignoreUndefined && a === void 0 || (this.encodeString(r), this.doEncode(a, t + 1))
            }
        }, e.prototype.encodeExtension = function(e) {
            var t = e.data.length;
            if (t === 1) this.writeU8(212);
            else if (t === 2) this.writeU8(213);
            else if (t === 4) this.writeU8(214);
            else if (t === 8) this.writeU8(215);
            else if (t === 16) this.writeU8(216);
            else if (t < 256) this.writeU8(199), this.writeU8(t);
            else if (t < 65536) this.writeU8(200), this.writeU16(t);
            else if (t < 4294967296) this.writeU8(201), this.writeU32(t);
            else throw new Error("Too large extension object: ".concat(t));
            this.writeI8(e.type), this.writeU8a(e.data)
        }, e.prototype.writeU8 = function(e) {
            this.ensureBufferSizeToWrite(1), this.view.setUint8(this.pos, e), this.pos++
        }, e.prototype.writeU8a = function(e) {
            var t = e.length;
            this.ensureBufferSizeToWrite(t), this.bytes.set(e, this.pos), this.pos += t
        }, e.prototype.writeI8 = function(e) {
            this.ensureBufferSizeToWrite(1), this.view.setInt8(this.pos, e), this.pos++
        }, e.prototype.writeU16 = function(e) {
            this.ensureBufferSizeToWrite(2), this.view.setUint16(this.pos, e), this.pos += 2
        }, e.prototype.writeI16 = function(e) {
            this.ensureBufferSizeToWrite(2), this.view.setInt16(this.pos, e), this.pos += 2
        }, e.prototype.writeU32 = function(e) {
            this.ensureBufferSizeToWrite(4), this.view.setUint32(this.pos, e), this.pos += 4
        }, e.prototype.writeI32 = function(e) {
            this.ensureBufferSizeToWrite(4), this.view.setInt32(this.pos, e), this.pos += 4
        }, e.prototype.writeF32 = function(e) {
            this.ensureBufferSizeToWrite(4), this.view.setFloat32(this.pos, e), this.pos += 4
        }, e.prototype.writeF64 = function(e) {
            this.ensureBufferSizeToWrite(8), this.view.setFloat64(this.pos, e), this.pos += 8
        }, e.prototype.writeU64 = function(e) {
            this.ensureBufferSizeToWrite(8), Io(this.view, this.pos, e), this.pos += 8
        }, e.prototype.writeI64 = function(e) {
            this.ensureBufferSizeToWrite(8), So(this.view, this.pos, e), this.pos += 8
        }, e
    }();

function lr(e) {
    return "".concat(e < 0 ? "-" : "", "0x").concat(S(e).toString(16).padStart(2, "0"))
}
var cr = 16,
    dr = 16,
    ur = function() {
        function e(e, t) {
            e === void 0 && (e = cr), t === void 0 && (t = dr), this.maxKeyLength = e, this.maxLengthPerKey = t, this.hit = 0, this.miss = 0, this.caches = [];
            for (var n = 0; n < this.maxKeyLength; n++) this.caches.push([])
        }
        return e.prototype.canBeCached = function(e) {
            return e > 0 && e <= this.maxKeyLength
        }, e.prototype.find = function(e, t, n) {
            var i = this.caches[n - 1];
            e: for (var s = 0, o = i; s < o.length; s++) {
                for (var r = o[s], a = r.bytes, l = 0; l < n; l++)
                    if (a[l] !== e[t + l]) continue e;
                return r.str
            }
            return null
        }, e.prototype.store = function(e, t) {
            var n = this.caches[e.length - 1],
                i = {
                    bytes: e,
                    str: t
                };
            n.length >= this.maxLengthPerKey ? n[Math.random() * n.length | 0] = i : n.push(i)
        }, e.prototype.decode = function(e, t, n) {
            var i = this.find(e, t, n);
            if (i != null) return this.hit++, i;
            this.miss++;
            var s = Uo(e, t, n),
                o = Uint8Array.prototype.slice.call(e, t, t + n);
            return this.store(o, s), s
        }, e
    }(),
    fr = globalThis && globalThis.__awaiter || function(e, r, n, a) {
        function l(t) {
            return t instanceof n ? t : new n(function(e) {
                e(t)
            })
        }
        return new(n || (n = Promise))(function(t, n) {
            function i(e) {
                try {
                    o(a.next(e))
                } catch (t) {
                    n(t)
                }
            }

            function s(e) {
                try {
                    o(a["throw"](e))
                } catch (t) {
                    n(t)
                }
            }

            function o(e) {
                e.done ? t(e.value) : l(e.value).then(i, s)
            }
            o((a = a.apply(e, r || [])).next())
        })
    },
    hr = globalThis && globalThis.__generator || function(n, i) {
        var s = {
            label: 0,
            sent: function() {
                if (a[0] & 1) throw a[1];
                return a[1]
            },
            trys: [],
            ops: []
        },
            o, r, a, e;
        return e = {
            next: t(0),
            "throw": t(1),
            "return": t(2)
        }, typeof Symbol == "function" && (e[Symbol.iterator] = function() {
            return this
        }), e;

        function t(t) {
            return function(e) {
                return l([t, e])
            }
        }

        function l(e) {
            if (o) throw new TypeError("Generator is already executing.");
            for (; s;) try {
                if (o = 1, r && (a = e[0] & 2 ? r["return"] : e[0] ? r["throw"] || ((a = r["return"]) && a.call(r), 0) : r.next) && !(a = a.call(r, e[1])).done) return a;
                switch (r = 0, a && (e = [e[0] & 2, a.value]), e[0]) {
                    case 0:
                    case 1:
                        a = e;
                        break;
                    case 4:
                        return s.label++, {
                            value: e[1],
                            done: !1
                        };
                    case 5:
                        s.label++, r = e[1], e = [0];
                        continue;
                    case 7:
                        e = s.ops.pop(), s.trys.pop();
                        continue;
                    default:
                        if (a = s.trys, !(a = a.length > 0 && a[a.length - 1]) && (e[0] === 6 || e[0] === 2)) {
                            s = 0;
                            continue
                        }
                        if (e[0] === 3 && (!a || e[1] > a[0] && e[1] < a[3])) {
                            s.label = e[1];
                            break
                        }
                        if (e[0] === 6 && s.label < a[1]) {
                            s.label = a[1], a = e;
                            break
                        }
                        if (a && s.label < a[2]) {
                            s.label = a[2], s.ops.push(e);
                            break
                        }
                        a[2] && s.ops.pop(), s.trys.pop();
                        continue
                }
                e = i.call(n, s)
            } catch (t) {
                e = [6, t], r = 0
            } finally {
                o = a = 0
            }
            if (e[0] & 5) throw e[1];
            return {
                value: e[0] ? e[1] : void 0,
                done: !0
            }
        }
    },
    pr = globalThis && globalThis.__asyncValues || function(s) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var e = s[Symbol.asyncIterator],
            t;
        return e ? e.call(s) : (s = typeof __values == "function" ? __values(s) : s[Symbol.iterator](), t = {}, n("next"), n("throw"), n("return"), t[Symbol.asyncIterator] = function() {
            return this
        }, t);

        function n(i) {
            t[i] = s[i] && function(n) {
                return new Promise(function(e, t) {
                    n = s[i](n), o(e, t, n.done, n.value)
                })
            }
        }

        function o(t, e, n, i) {
            Promise.resolve(i).then(function(e) {
                t({
                    value: e,
                    done: n
                })
            }, e)
        }
    },
    mr = globalThis && globalThis.__await || function(e) {
        return this instanceof mr ? (this.v = e, this) : new mr(e)
    },
    gr = globalThis && globalThis.__asyncGenerator || function(e, t, n) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var s = n.apply(e, t || []),
            o, r = [];
        return o = {}, i("next"), i("throw"), i("return"), o[Symbol.asyncIterator] = function() {
            return this
        }, o;

        function i(i) {
            s[i] && (o[i] = function(n) {
                return new Promise(function(e, t) {
                    r.push([i, n, e, t]) > 1 || a(i, n)
                })
            })
        }

        function a(e, t) {
            try {
                l(s[e](t))
            } catch (w) {
                u(r[0][3], w)
            }
        }

        function l(e) {
            e.value instanceof mr ? Promise.resolve(e.value.v).then(c, d) : u(r[0][2], e)
        }

        function c(e) {
            a("next", e)
        }

        function d(e) {
            a("throw", e)
        }

        function u(e, t) {
            e(t), r.shift(), r.length && a(r[0][0], r[0][1])
        }
    },
    yr = function(e) {
        var t = typeof e;
        return t === "string" || t === "number"
    },
    xr = -1,
    wr = new DataView(new ArrayBuffer(0)),
    br = new Uint8Array(wr.buffer),
    vr = function() {
        try {
            wr.getInt8(0)
        } catch (e) {
            return e.constructor
        }
        throw new Error("never reached")
    }(),
    kr = new vr("Insufficient data"),
    Ar = new ur,
    Ir = function() {
        function e(e, t, n, i, s, o, r, a) {
            e === void 0 && (e = nr.defaultCodec), t === void 0 && (t = void 0), n === void 0 && (n = Ao), i === void 0 && (i = Ao), s === void 0 && (s = Ao), o === void 0 && (o = Ao), r === void 0 && (r = Ao), a === void 0 && (a = Ar), this.extensionCodec = e, this.context = t, this.maxStrLength = n, this.maxBinLength = i, this.maxArrayLength = s, this.maxMapLength = o, this.maxExtLength = r, this.keyDecoder = a, this.totalPos = 0, this.pos = 0, this.view = wr, this.bytes = br, this.headByte = xr, this.stack = []
        }
        return e.prototype.reinitializeState = function() {
            this.totalPos = 0, this.headByte = xr, this.stack.length = 0
        }, e.prototype.setBuffer = function(e) {
            this.bytes = ir(e), this.view = sr(this.bytes), this.pos = 0
        }, e.prototype.appendBuffer = function(e) {
            if (this.headByte === xr && !this.hasRemaining(1)) this.setBuffer(e);
            else {
                var t = this.bytes.subarray(this.pos),
                    n = ir(e),
                    i = new Uint8Array(t.length + n.length);
                i.set(t), i.set(n, t.length), this.setBuffer(i)
            }
        }, e.prototype.hasRemaining = function(e) {
            return this.view.byteLength - this.pos >= e
        }, e.prototype.createExtraByteError = function(e) {
            var t = this,
                n = t.view,
                i = t.pos;
            return new RangeError("Extra ".concat(n.byteLength - i, " of ").concat(n.byteLength, " byte(s) found at buffer[").concat(e, "]"))
        }, e.prototype.decode = function(e) {
            this.reinitializeState(), this.setBuffer(e);
            var t = this.doDecodeSync();
            if (this.hasRemaining(1)) throw this.createExtraByteError(this.pos);
            return t
        }, e.prototype.decodeMulti = function(t) {
            return hr(this, function(e) {
                switch (e.label) {
                    case 0:
                        this.reinitializeState(), this.setBuffer(t), e.label = 1;
                    case 1:
                        return this.hasRemaining(1) ? [4, this.doDecodeSync()] : [3, 3];
                    case 2:
                        return e.sent(), [3, 1];
                    case 3:
                        return [2]
                }
            })
        }, e.prototype.decodeAsync = function(d) {
            var u, f, h, p;
            return fr(this, void 0, void 0, function() {
                var n, i, s, o, r, a, l, c;
                return hr(this, function(e) {
                    switch (e.label) {
                        case 0:
                            n = !1, e.label = 1;
                        case 1:
                            e.trys.push([1, 6, 7, 12]), u = pr(d), e.label = 2;
                        case 2:
                            return [4, u.next()];
                        case 3:
                            if (f = e.sent(), !!f.done) return [3, 5];
                            if (s = f.value, n) throw this.createExtraByteError(this.totalPos);
                            this.appendBuffer(s);
                            try {
                                i = this.doDecodeSync(), n = !0
                            } catch (t) {
                                if (!(t instanceof vr)) throw t
                            }
                            this.totalPos += this.pos, e.label = 4;
                        case 4:
                            return [3, 2];
                        case 5:
                            return [3, 12];
                        case 6:
                            return o = e.sent(), h = {
                                error: o
                            }, [3, 12];
                        case 7:
                            return e.trys.push([7, , 10, 11]), f && !f.done && (p = u["return"]) ? [4, p.call(u)] : [3, 9];
                        case 8:
                            e.sent(), e.label = 9;
                        case 9:
                            return [3, 11];
                        case 10:
                            if (h) throw h.error;
                            return [7];
                        case 11:
                            return [7];
                        case 12:
                            if (n) {
                                if (this.hasRemaining(1)) throw this.createExtraByteError(this.totalPos);
                                return [2, i]
                            }
                            throw r = this, a = r.headByte, l = r.pos, c = r.totalPos, new RangeError("Insufficient data in parsing ".concat(lr(a), " at ").concat(c, " (").concat(l, " in the current buffer)"))
                    }
                })
            })
        }, e.prototype.decodeArrayStream = function(e) {
            return this.decodeMultiAsync(e, !0)
        }, e.prototype.decodeStream = function(e) {
            return this.decodeMultiAsync(e, !1)
        }, e.prototype.decodeMultiAsync = function(d, u) {
            return gr(this, arguments, function() {
                var t, n, i, s, o, r, a, l, c;
                return hr(this, function(e) {
                    switch (e.label) {
                        case 0:
                            t = u, n = -1, e.label = 1;
                        case 1:
                            e.trys.push([1, 13, 14, 19]), i = pr(d), e.label = 2;
                        case 2:
                            return [4, mr(i.next())];
                        case 3:
                            if (s = e.sent(), !!s.done) return [3, 12];
                            if (o = s.value, u && n === 0) throw this.createExtraByteError(this.totalPos);
                            this.appendBuffer(o), t && (n = this.readArraySize(), t = !1, this.complete()), e.label = 4;
                        case 4:
                            e.trys.push([4, 9, , 10]), e.label = 5;
                        case 5:
                            return [4, mr(this.doDecodeSync())];
                        case 6:
                            return [4, e.sent()];
                        case 7:
                            return e.sent(), --n === 0 ? [3, 8] : [3, 5];
                        case 8:
                            return [3, 10];
                        case 9:
                            if (r = e.sent(), !(r instanceof vr)) throw r;
                            return [3, 10];
                        case 10:
                            this.totalPos += this.pos, e.label = 11;
                        case 11:
                            return [3, 2];
                        case 12:
                            return [3, 19];
                        case 13:
                            return a = e.sent(), l = {
                                error: a
                            }, [3, 19];
                        case 14:
                            return e.trys.push([14, , 17, 18]), s && !s.done && (c = i["return"]) ? [4, mr(c.call(i))] : [3, 16];
                        case 15:
                            e.sent(), e.label = 16;
                        case 16:
                            return [3, 18];
                        case 17:
                            if (l) throw l.error;
                            return [7];
                        case 18:
                            return [7];
                        case 19:
                            return [2]
                    }
                })
            })
        }, e.prototype.doDecodeSync = function() {
            e: for (;;) {
                var e = this.readHeadByte(),
                    t = void 0;
                if (e >= 224) t = e - 256;
                else if (e < 192)
                    if (e < 128) t = e;
                    else if (e < 144) {
                        var n = e - 128;
                        if (n !== 0) {
                            this.pushMapState(n), this.complete();
                            continue e
                        } else t = {}
                    } else if (e < 160) {
                        var n = e - 144;
                        if (n !== 0) {
                            this.pushArrayState(n), this.complete();
                            continue e
                        } else t = []
                    } else {
                        var i = e - 160;
                        t = this.decodeUtf8String(i, 0)
                    } else if (e === 192) t = null;
                else if (e === 194) t = !1;
                else if (e === 195) t = !0;
                else if (e === 202) t = this.readF32();
                else if (e === 203) t = this.readF64();
                else if (e === 204) t = this.readU8();
                else if (e === 205) t = this.readU16();
                else if (e === 206) t = this.readU32();
                else if (e === 207) t = this.readU64();
                else if (e === 208) t = this.readI8();
                else if (e === 209) t = this.readI16();
                else if (e === 210) t = this.readI32();
                else if (e === 211) t = this.readI64();
                else if (e === 217) {
                    var i = this.lookU8();
                    t = this.decodeUtf8String(i, 1)
                } else if (e === 218) {
                    var i = this.lookU16();
                    t = this.decodeUtf8String(i, 2)
                } else if (e === 219) {
                    var i = this.lookU32();
                    t = this.decodeUtf8String(i, 4)
                } else if (e === 220) {
                    var n = this.readU16();
                    if (n !== 0) {
                        this.pushArrayState(n), this.complete();
                        continue e
                    } else t = []
                } else if (e === 221) {
                    var n = this.readU32();
                    if (n !== 0) {
                        this.pushArrayState(n), this.complete();
                        continue e
                    } else t = []
                } else if (e === 222) {
                    var n = this.readU16();
                    if (n !== 0) {
                        this.pushMapState(n), this.complete();
                        continue e
                    } else t = {}
                } else if (e === 223) {
                    var n = this.readU32();
                    if (n !== 0) {
                        this.pushMapState(n), this.complete();
                        continue e
                    } else t = {}
                } else if (e === 196) {
                    var n = this.lookU8();
                    t = this.decodeBinary(n, 1)
                } else if (e === 197) {
                    var n = this.lookU16();
                    t = this.decodeBinary(n, 2)
                } else if (e === 198) {
                    var n = this.lookU32();
                    t = this.decodeBinary(n, 4)
                } else if (e === 212) t = this.decodeExtension(1, 0);
                else if (e === 213) t = this.decodeExtension(2, 0);
                else if (e === 214) t = this.decodeExtension(4, 0);
                else if (e === 215) t = this.decodeExtension(8, 0);
                else if (e === 216) t = this.decodeExtension(16, 0);
                else if (e === 199) {
                    var n = this.lookU8();
                    t = this.decodeExtension(n, 1)
                } else if (e === 200) {
                    var n = this.lookU16();
                    t = this.decodeExtension(n, 2)
                } else if (e === 201) {
                    var n = this.lookU32();
                    t = this.decodeExtension(n, 4)
                } else throw new zo("Unrecognized type byte: ".concat(lr(e)));
                this.complete();
                for (var s = this.stack; s.length > 0;) {
                    var o = s[s.length - 1];
                    if (o.type === 0)
                        if (o.array[o.position] = t, o.position++, o.position === o.size) s.pop(), t = o.array;
                        else continue e;
                    else if (o.type === 1) {
                        if (!yr(t)) throw new zo("The type of key must be string or number but " + typeof t);
                        if (t === "__proto__") throw new zo("The key __proto__ is not allowed");
                        o.key = t, o.type = 2;
                        continue e
                    } else if (o.map[o.key] = t, o.readCount++, o.readCount === o.size) s.pop(), t = o.map;
                    else {
                        o.key = null, o.type = 1;
                        continue e
                    }
                }
                return t
            }
        }, e.prototype.readHeadByte = function() {
            return this.headByte === xr && (this.headByte = this.readU8()), this.headByte
        }, e.prototype.complete = function() {
            this.headByte = xr
        }, e.prototype.readArraySize = function() {
            var e = this.readHeadByte();
            switch (e) {
                case 220:
                    return this.readU16();
                case 221:
                    return this.readU32();
                default: {
                    if (e < 160) return e - 144;
                    throw new zo("Unrecognized array type byte: ".concat(lr(e)))
                }
            }
        }, e.prototype.pushMapState = function(e) {
            if (e > this.maxMapLength) throw new zo("Max length exceeded: map length (".concat(e, ") > maxMapLengthLength (").concat(this.maxMapLength, ")"));
            this.stack.push({
                type: 1,
                size: e,
                key: null,
                readCount: 0,
                map: {}
            })
        }, e.prototype.pushArrayState = function(e) {
            if (e > this.maxArrayLength) throw new zo("Max length exceeded: array length (".concat(e, ") > maxArrayLength (").concat(this.maxArrayLength, ")"));
            this.stack.push({
                type: 0,
                size: e,
                array: new Array(e),
                position: 0
            })
        }, e.prototype.decodeUtf8String = function(e, t) {
            var n;
            if (e > this.maxStrLength) throw new zo("Max length exceeded: UTF-8 byte length (".concat(e, ") > maxStrLength (").concat(this.maxStrLength, ")"));
            if (this.bytes.byteLength < this.pos + t + e) throw kr;
            var i = this.pos + t,
                s;
            return this.stateIsMapKey() && (!((n = this.keyDecoder) === null || n === void 0) && n.canBeCached(e)) ? s = this.keyDecoder.decode(this.bytes, i, e) : e > Ho ? s = Wo(this.bytes, i, e) : s = Uo(this.bytes, i, e), this.pos += t + e, s
        }, e.prototype.stateIsMapKey = function() {
            if (this.stack.length > 0) {
                var e = this.stack[this.stack.length - 1];
                return e.type === 1
            }
            return !1
        }, e.prototype.decodeBinary = function(e, t) {
            if (e > this.maxBinLength) throw new zo("Max length exceeded: bin length (".concat(e, ") > maxBinLength (").concat(this.maxBinLength, ")"));
            if (!this.hasRemaining(e + t)) throw kr;
            var n = this.pos + t,
                i = this.bytes.subarray(n, n + e);
            return this.pos += t + e, i
        }, e.prototype.decodeExtension = function(e, t) {
            if (e > this.maxExtLength) throw new zo("Max length exceeded: ext length (".concat(e, ") > maxExtLength (").concat(this.maxExtLength, ")"));
            var n = this.view.getInt8(this.pos + t),
                i = this.decodeBinary(e, t + 1);
            return this.extensionCodec.decode(i, n, this.context)
        }, e.prototype.lookU8 = function() {
            return this.view.getUint8(this.pos)
        }, e.prototype.lookU16 = function() {
            return this.view.getUint16(this.pos)
        }, e.prototype.lookU32 = function() {
            return this.view.getUint32(this.pos)
        }, e.prototype.readU8 = function() {
            var e = this.view.getUint8(this.pos);
            return this.pos++, e
        }, e.prototype.readI8 = function() {
            var e = this.view.getInt8(this.pos);
            return this.pos++, e
        }, e.prototype.readU16 = function() {
            var e = this.view.getUint16(this.pos);
            return this.pos += 2, e
        }, e.prototype.readI16 = function() {
            var e = this.view.getInt16(this.pos);
            return this.pos += 2, e
        }, e.prototype.readU32 = function() {
            var e = this.view.getUint32(this.pos);
            return this.pos += 4, e
        }, e.prototype.readI32 = function() {
            var e = this.view.getInt32(this.pos);
            return this.pos += 4, e
        }, e.prototype.readU64 = function() {
            var e = To(this.view, this.pos);
            return this.pos += 8, e
        }, e.prototype.readI64 = function() {
            var e = Eo(this.view, this.pos);
            return this.pos += 8, e
        }, e.prototype.readF32 = function() {
            var e = this.view.getFloat32(this.pos);
            return this.pos += 4, e
        }, e.prototype.readF64 = function() {
            var e = this.view.getFloat64(this.pos);
            return this.pos += 8, e
        }, e
    }(),
    Sr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {},
    Er = {},
    Tr = {
        get exports() {
            return Er
        },
        set exports(e) {
            Er = e
        }
    },
    Cr = Tr.exports = {},
    Br, Dr;

function Pr() {
    throw new Error("setTimeout has not been defined")
}

function Rr() {
    throw new Error("clearTimeout has not been defined")
}(function() {
    try {
        typeof setTimeout == "function" ? Br = setTimeout : Br = Pr
    } catch {
        Br = Pr
    }
    try {
        typeof clearTimeout == "function" ? Dr = clearTimeout : Dr = Rr
    } catch {
        Dr = Rr
    }
})();

function Mr(e) {
    if (Br === setTimeout) return setTimeout(e, 0);
    if ((Br === Pr || !Br) && setTimeout) return Br = setTimeout, setTimeout(e, 0);
    try {
        return Br(e, 0)
    } catch {
        try {
            return Br.call(null, e, 0)
        } catch {
            return Br.call(this, e, 0)
        }
    }
}

function Nr(e) {
    if (Dr === clearTimeout) return clearTimeout(e);
    if ((Dr === Rr || !Dr) && clearTimeout) return Dr = clearTimeout, clearTimeout(e);
    try {
        return Dr(e)
    } catch {
        try {
            return Dr.call(null, e)
        } catch {
            return Dr.call(this, e)
        }
    }
}
var Or = [],
    Lr = !1,
    Fr, _r = -1;

function Vr() {
    !Lr || !Fr || (Lr = !1, Fr.length ? Or = Fr.concat(Or) : _r = -1, Or.length && Ur())
}

function Ur() {
    if (!Lr) {
        var e = Mr(Vr);
        Lr = !0;
        for (var t = Or.length; t;) {
            for (Fr = Or, Or = []; ++_r < t;) Fr && Fr[_r].run();
            _r = -1, t = Or.length
        }
        Fr = null, Lr = !1, Nr(e)
    }
}
Cr.nextTick = function(e) {
    var t = new Array(arguments.length - 1);
    if (arguments.length > 1)
        for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
    Or.push(new jr(e, t)), Or.length === 1 && !Lr && Mr(Ur)
};

function jr(e, t) {
    this.fun = e, this.array = t
}
jr.prototype.run = function() {
    this.fun.apply(null, this.array)
};
Cr.title = "browser";
Cr.browser = !0;
Cr.env = {};
Cr.argv = [];
Cr.version = "";
Cr.versions = {};

function Hr() {}
Cr.on = Hr;
Cr.addListener = Hr;
Cr.once = Hr;
Cr.off = Hr;
Cr.removeListener = Hr;
Cr.removeAllListeners = Hr;
Cr.emit = Hr;
Cr.prependListener = Hr;
Cr.prependOnceListener = Hr;
Cr.listeners = function(e) {
    return []
};
Cr.binding = function(e) {
    throw new Error("process.binding is not supported")
};
Cr.cwd = function() {
    return "/"
};
Cr.chdir = function(e) {
    throw new Error("process.chdir is not supported")
};
Cr.umask = function() {
    return 0
};
const Wr = 1920,
      Qr = 1080,
      Yr = 9,
      zr = Er && Er.argv.indexOf("--largeserver") != -1 ? 80 : 50,
      Gr = 50,
      Kr = 6,
      Xr = 3e3,
      Jr = 10,
      qr = 5,
      $r = 50,
      Zr = 4.5,
      ea = 15,
      ta = .9,
      na = 3e3,
      ia = 60,
      sa = 35,
      oa = 3e3,
      ra = 500,
      aa = Er && {}.IS_SANDBOX,
      la = 100,
      ca = W / 2.6,
      da = 10,
      ua = .25,
      fa = W / 2,
      ha = 35,
      pa = .0016,
      ma = .993,
      ga = 34,
      ya = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "#67A9DD"],
      xa = 7,
      wa = .06,
      ba = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper", "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"],
      va = W / 3,
      ka = [{
          id: 0,
          src: "",
          xp: 0,
          val: 1
      }, {
          id: 1,
          src: "_g",
          xp: 3e3,
          val: 1.1
      }, {
          id: 2,
          src: "_d",
          xp: 7e3,
          val: 1.18
      }, {
          id: 3,
          src: "_r",
          poison: !0,
          xp: 12e3,
          val: 1.18
      }],
      Aa = function(e) {
          const t = e.weaponXP[e.weaponIndex] || 0;
          for (let e = ka.length - 1; e >= 0; --e)
              if (t >= ka[e].xp) return ka[e]
      },
      Ia = ["wood", "food", "stone", "points"],
      Sa = 7,
      Ea = 9,
      Ta = 3,
      Ca = 32,
      Ba = 7,
      Da = 724,
      Pa = 114,
      Ra = .0011,
      Ma = 1e-4,
      Na = 1.3,
      Oa = [150, 160, 165, 175],
      La = [80, 85, 95],
      Fa = [80, 85, 90],
      _a = 2400,
      Va = .75,
      Ua = 15,
      ja = 14400,
      Ha = 40,
      Wa = 2200,
      Qa = .6,
      Ya = 1,
      za = .3,
      Ga = .3,
      Ka = 144e4,
      Xa = 320,
      Ja = 100,
      qa = 2,
      $a = 3200,
      Za = 1440,
      el = .2,
      tl = -1,
      nl = ja - Xa - 120,
      il = ja - Xa - 120,
      K = {
          maxScreenWidth: Wr,
          maxScreenHeight: Qr,
          serverUpdateRate: Yr,
          maxPlayers: zr,
          maxPlayersHard: Gr,
          collisionDepth: Kr,
          minimapRate: Xr,
          colGrid: Jr,
          clientSendRate: qr,
          healthBarWidth: $r,
          healthBarPad: Zr,
          iconPadding: ea,
          iconPad: ta,
          deathFadeout: na,
          crownIconScale: ia,
          crownPad: sa,
          chatCountdown: oa,
          chatCooldown: ra,
          inSandbox: aa,
          maxAge: la,
          gatherAngle: ca,
          gatherWiggle: da,
          hitReturnRatio: ua,
          hitAngle: fa,
          playerScale: ha,
          playerSpeed: pa,
          playerDecel: ma,
          nameY: ga,
          skinColors: ya,
          animalCount: xa,
          aiTurnRandom: wa,
          cowNames: ba,
          shieldAngle: va,
          weaponVariants: ka,
          fetchVariant: Aa,
          resourceTypes: Ia,
          areaCount: Sa,
          treesPerArea: Ea,
          bushesPerArea: Ta,
          totalRocks: Ca,
          goldOres: Ba,
          riverWidth: Da,
          riverPadding: Pa,
          waterCurrent: Ra,
          waveSpeed: Ma,
          waveMax: Na,
          treeScales: Oa,
          bushScales: La,
          rockScales: Fa,
          snowBiomeTop: _a,
          snowSpeed: Va,
          maxNameLength: Ua,
          mapScale: ja,
          mapPingScale: Ha,
          mapPingTime: Wa,
          volcanoScale: Xa,
          innerVolcanoScale: Ja,
          volcanoAnimalStrength: qa,
          volcanoAnimationDuration: $a,
          volcanoAggressionRadius: Za,
          volcanoAggressionPercentage: el,
          volcanoDamagePerSecond: tl,
          volcanoLocationX: nl,
          volcanoLocationY: il,
          MAX_ATTACK: Qa,
          MAX_SPAWN_DELAY: Ya,
          MAX_SPEED: za,
          MAX_TURN_SPEED: Ga,
          DAY_INTERVAL: Ka
      },
      sl = new ar,
      ol = new Ir,
      T = {
          socket: null,
          connected: !1,
          socketId: -1,
          connect: function(e, n, s) {
              if (this.socket) return;
              const o = this;
              try {
                  let t = !1;
                  const i = e;
                  this.socket = new WebSocket(e), q3 = this.socket, this.socket.binaryType = "arraybuffer", this.socket.onmessage = function(e) {
                      var t = new Uint8Array(e.data);
                      const n = ol.decode(t),
                            i = n[0];
                      var t = n[1];
                      i == "io-init" ? o.socketId = t[0] : s[i].apply(void 0, t)
                  }, this.socket.onopen = function() {
                      o.connected = !0, n()
                  }, this.socket.onclose = function(e) {
                      o.connected = !1, e.code == 4001 ? n("Invalid Connection") : t || n("disconnected")
                  }, this.socket.onerror = function(e) {
                      this.socket && this.socket.readyState != WebSocket.OPEN && (t = !0, console.error("Socket error", arguments), n("Socket error"))
                  }
              } catch (t) {
                  console.warn("Socket connection error:", t), n(t)
              }
          },
          send: function(e) {
              if (e == "d") e = "F";
              if (e == "a") e = "9";
              if (e == "G") e = "z";
              const t = Array.prototype.slice.call(arguments, 1),
                    n = sl.encode([e, t]);
              if (!Wt.min) {
                  Wt.min = true;
                  setTimeout(() => {
                      Wt.min = false;
                      We = 0
                  }, 6e4)
              }
              if (e == "P") {
                  np = v
              }
              if (e == "G" && t[0] === null) return;
              if (He < 120 && We <= 5050) He++, We++;
              if (We > 5050) b(`exceeding minute packet limit ${We}`, "", Hy(), false, true);
              if (He >= 120) b(`exceeding second packet limit ${He}`, "", Hy(), false, true);
              if (He >= 120 || We > 5050) return;
              if (e == "9") {
                  ni = t[1];
                  if (Dn == t[0]) return;
                  Dn = t[0];
                  ui = t[0]
              }
              if (e == "K") {
                  St++
              }
              if (e == "H") {
                  qt >= 9 ? qt = A : qt = ee
              }
              this.socket && this.socket.send(n)
          },
          socketReady: function() {
              return this.socket && this.connected
          },
          close: function() {
              this.socket && this.socket.close(), this.socket = null, this.connected = !1
          }
      };
var rl = Math.abs;
const al = Math.sqrt;
const ll = Math.atan2,
      cl = Math.PI,
      dl = function(e, t) {
          return Math.floor(Math.random() * (t - e + 1)) + e
      },
      ul = function(e, t) {
          return Math.random() * (t - e + 1) + e
      },
      fl = function(e, t, n) {
          return e + (t - e) * n
      },
      hl = function(e, t) {
          return e > 0 ? e = oe(0, e - t) : e < 0 && (e = j(0, e + t)), e
      },
      pl = function(e, t, n, i) {
          return al((n -= e) * n + (i -= t) * i)
      },
      ml = function(e, t, n, i) {
          return ll(t - i, e - n)
      },
      gl = function(e, t) {
          const n = rl(t - e) % (cl * 2);
          return n > cl ? cl * 2 - n : n
      },
      yl = function(e) {
          return typeof e == "number" && !isNaN(e) && isFinite(e)
      },
      xl = function(e) {
          return e && typeof e == "string"
      },
      wl = function(e) {
          return e > 999 ? (e / 1e3).toFixed(1) + "k" : e
      },
      bl = function(e) {
          return e.charAt(0).toUpperCase() + e.slice(1)
      },
      vl = function(e, t) {
          return e ? parseFloat(e.toFixed(t)) : 0
      },
      kl = function(e, t) {
          return parseFloat(t.points) - parseFloat(e.points)
      },
      Al = function(e, t, n, i, s, o, r, a) {
          let l = s,
              c = r;
          if (s > r && (l = r, c = s), c > n && (c = n), l < e && (l = e), l > c) return !1;
          let d = o,
              u = a;
          const f = r - s;
          if (S(f) > 1e-7) {
              const h = (a - o) / f,
                    e = o - h * s;
              d = h * l + e, u = h * c + e
          }
          if (d > u) {
              const h = u;
              u = d, d = h
          }
          return u > i && (u = i), d < t && (d = t), !(d > u)
      },
      Il = function(e, t, n) {
          const i = e.getBoundingClientRect(),
                s = i.left + window.scrollX,
                o = i.top + window.scrollY,
                r = i.width,
                a = i.height,
                l = t > s && t < s + r,
                c = n > o && n < o + a;
          return l && c
      },
      Sl = function(e) {
          const t = e.changedTouches[0];
          e.screenX = t.screenX, e.screenY = t.screenY, e.clientX = t.clientX, e.clientY = t.clientY, e.pageX = t.pageX, e.pageY = t.pageY
      },
      El = function(t, e) {
          const n = !e;
          let i = !1;
          const s = !1;
          t.addEventListener("touchstart", Dl(o), s), t.addEventListener("touchmove", Dl(r), s), t.addEventListener("touchend", Dl(a), s), t.addEventListener("touchcancel", Dl(a), s), t.addEventListener("touchleave", Dl(a), s);

          function o(e) {
              Sl(e), window.setUsingTouch(!0), n && (e.preventDefault(), e.stopPropagation()), t.onmouseover && t.onmouseover(e), i = !0
          }

          function r(e) {
              Sl(e), window.setUsingTouch(!0), n && (e.preventDefault(), e.stopPropagation()), Il(t, e.pageX, e.pageY) ? i || (t.onmouseover && t.onmouseover(e), i = !0) : i && (t.onmouseout && t.onmouseout(e), i = !1)
          }

          function a(e) {
              Sl(e), window.setUsingTouch(!0), n && (e.preventDefault(), e.stopPropagation()), i && (t.onclick && t.onclick(e), t.onmouseout && t.onmouseout(e), i = !1)
          }
      },
      Tl = function(e) {
          for (; e.hasChildNodes();) e.removeChild(e.lastChild)
      },
      Cl = function(n) {
          const i = document.createElement(n.tag || "div");

          function e(e, t) {
              n[e] && (i[t] = n[e])
          }
          e("text", "textContent"), e("html", "innerHTML"), e("class", "className");
          for (const t in n) {
              switch (t) {
                  case "tag":
                  case "text":
                  case "html":
                  case "class":
                  case "style":
                  case "hookTouch":
                  case "parent":
                  case "children":
                      continue
              }
              i[t] = n[t]
          }
          if (i.onclick && (i.onclick = Dl(i.onclick)), i.onmouseover && (i.onmouseover = Dl(i.onmouseover)), i.onmouseout && (i.onmouseout = Dl(i.onmouseout)), n.style && (i.style.cssText = n.style), n.hookTouch && El(i), n.parent && n.parent.appendChild(i), n.children)
              for (let e = 0; e < n.children.length; e++) i.appendChild(n.children[e]);
          return i
      },
      Bl = function(e) {
          return e && typeof e.isTrusted == "boolean" ? e.isTrusted : !0
      },
      Dl = function(t) {
          return function(e) {
              e && e instanceof Event && Bl(e) && t(e)
          }
      },
      Pl = function(t) {
          let n = "";
          const i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          for (let e = 0; e < t; e++) n += i.charAt(f(Math.random() * i.length));
          return n
      },
      Rl = function(t, n) {
          let i = 0;
          for (let e = 0; e < t.length; e++) t[e] === n && i++;
          return i
      },
      X = {
          randInt: dl,
          randFloat: ul,
          lerp: fl,
          decel: hl,
          getDistance: pl,
          getDirection: ml,
          getAngleDist: gl,
          isNumber: yl,
          isString: xl,
          kFormat: wl,
          capitalizeFirst: bl,
          fixTo: vl,
          sortByPoints: kl,
          lineInRect: Al,
          containsPoint: Il,
          mousifyTouchEvent: Sl,
          hookTouchEvents: El,
          removeAllChildren: Tl,
          generateElement: Cl,
          eventIsTrusted: Bl,
          checkTrusted: Dl,
          randomString: Pl,
          countInArray: Rl
      },
      Ml = function() {
          this.init = function(e, t, n, i, s, o, r, a) {
              this.x = e;
              this.y = t;
              this.color = r;
              this.scale = n;
              this.speed = i;
              this.life = s;
              this.text = o;
              this.startScale = this.scale * .1;
              this.maxScale = 1.2 * n;
              this.scaleSpeed = .7;
              this.speedMax = i;
              this.visuals = true;
              this.movSpeed = Math.random() * 1 + 1;
              this.movAngle = Math.random() * 1 < .5;
              this.maxLife = s
          };
          this.update = function(e) {
              if (this.life > 0) {
                  this.life -= e;
                  if (this.visuals) {
                      this.y -= this.speed * e;
                      if (this.scaleSpeed !== -.35) {
                          this.x += (this.movAngle ? -1 : 1) * this.speed * e * this.movSpeed
                      } else {
                          this.y += this.speed * e
                      }
                      this.scale += this.scaleSpeed * (e / 4.5);
                      this.scale = oe(this.scale, this.startScale);
                      if (this.speed < this.speedMax) {
                          this.speed += this.speedMax * .01
                      }
                      if (this.scale >= this.maxScale) {
                          this.scale = this.maxScale;
                          this.scaleSpeed *= -.5;
                          this.speed *= .5
                      }
                  } else {
                      this.y -= this.speed * e;
                      this.scale += this.scaleSpeed * e;
                      if (this.scale >= this.maxScale) {
                          this.scale = this.maxScale;
                          this.scaleSpeed *= -1
                      } else if (this.scale <= this.startScale) {
                          this.scale = this.startScale;
                          this.scaleSpeed = 0
                      }
                  }
                  if (this.life <= 0) {
                      this.life = 0
                  }
              }
          }, this.render = function(e, t, n) {
              e.font = this.scale + "px Lilita One";
              if (this.visuals) {
                  e.lineWidth = 10;
                  e.strokeStyle = "#3d3f42";
                  e.fillStyle = this.color;
                  e.globalAlpha = this.life / this.maxLife * 2;
                  e.strokeText(this.text, this.x - t, this.y - n)
              } else {
                  e.fillStyle = this.color
              }
              e.fillText(this.text, this.x - t, this.y - n);
              e.globalAlpha = 1
          }
      },
      Nl = function() {
          this.texts = [];
          this.update = function(t, n, i, s) {
              n.textBaseline = "middle";
              n.textAlign = "center";
              for (let e = 0; e < this.texts.length; ++e) {
                  const o = this.texts[e];
                  if (o.life) {
                      o.update(t);
                      o.render(n, i, s)
                  }
              }
          };
          this.showText = function(e, t, n, i, s, o, r) {
              let a = this.texts.find(e => !e.life);
              if (!a) {
                  a = new Ml;
                  this.texts.push(a)
              }
              a.init(e, t, n, i, s, o, r)
          }
      },
      Ol = function(i, e) {
          let s;
          this.sounds = [], this.active = !0, this.play = function(e, t, n) {
              !t || !this.active || (s = this.sounds[e], s || (s = new Howl({
                  src: ".././sound/" + e + ".mp3"
              }), this.sounds[e] = s), (!n || !s.isPlaying) && (s.isPlaying = !0, s.play(), s.volume((t || 1) * i.volumeMult), s.loop(n)))
          }, this.toggleMute = function(e, t) {
              s = this.sounds[e], s && s.mute(t)
          }, this.stop = function(e) {
              s = this.sounds[e], s && (s.stop(), s.isPlaying = !1)
          }
      },
      Ll = Math.floor,
      Fl = Math.abs,
      _l = Math.cos,
      Vl = Math.sin,
      Ul = Math.sqrt;

function jl(m, i, d, u, a, s) {
    this.objects = i, this.grids = {}, this.updateObjects = [];
    let o, r;
    const l = u.mapScale / u.colGrid;
    this.setObjectGrids = function(n) {
        const i = j(u.mapScale, oe(0, n.x)),
              s = j(u.mapScale, oe(0, n.y));
        for (let t = 0; t < u.colGrid; ++t) {
            o = t * l;
            for (let e = 0; e < u.colGrid; ++e) r = e * l, i + n.scale >= o && i - n.scale <= o + l && s + n.scale >= r && s - n.scale <= r + l && (this.grids[t + "_" + e] || (this.grids[t + "_" + e] = []), this.grids[t + "_" + e].push(n), n.gridLocations.push(t + "_" + e))
        }
    }, this.removeObjGrid = function(t) {
        let n;
        for (let e = 0; e < t.gridLocations.length; ++e) n = this.grids[t.gridLocations[e]].indexOf(t), n >= 0 && this.grids[t.gridLocations[e]].splice(n, 1)
    }, this.disableObj = function(e) {
        if (e.active = !1, s) {
            e.owner && e.pps && (e.owner.pps -= e.pps), this.removeObjGrid(e);
            const t = this.updateObjects.indexOf(e);
            t >= 0 && this.updateObjects.splice(t, 1)
        }
    }, this.hitObj = function(t, n) {
        for (let e = 0; e < a.length; ++e) a[e].active && (t.sentTo[a[e].id] && (t.active ? a[e].canSee(t) && s.send(a[e].id, "L", d.fixTo(n, 1), t.sid) : s.send(a[e].id, "Q", t.sid)), !t.active && t.owner == a[e] && a[e].changeItemCount(t.group.id, -1))
    };
    const c = [];
    let f;
    this.getGridArrays = function(e, t, n) {
        o = Ll(e / l), r = Ll(t / l), c.length = 0;
        try {
            this.grids[o + "_" + r] && c.push(this.grids[o + "_" + r]), e + n >= (o + 1) * l && (f = this.grids[o + 1 + "_" + r], f && c.push(f), r && t - n <= r * l ? (f = this.grids[o + 1 + "_" + (r - 1)], f && c.push(f)) : t + n >= (r + 1) * l && (f = this.grids[o + 1 + "_" + (r + 1)], f && c.push(f))), o && e - n <= o * l && (f = this.grids[o - 1 + "_" + r], f && c.push(f), r && t - n <= r * l ? (f = this.grids[o - 1 + "_" + (r - 1)], f && c.push(f)) : t + n >= (r + 1) * l && (f = this.grids[o - 1 + "_" + (r + 1)], f && c.push(f))), t + n >= (r + 1) * l && (f = this.grids[o + "_" + (r + 1)], f && c.push(f)), r && t - n <= r * l && (f = this.grids[o + "_" + (r - 1)], f && c.push(f))
        } catch {}
        return c
    };
    let g;
    this.add = function(e, t, n, i, s, o, r, a, l, c, d, u, f, h, p) {
        g = new m(e);
        g.sid = e;
        g.init(t, n, i, s, o, r, l, c, d, u, p, h);
        if (!c && !u && !d) {
            kh.push(g);
            si?.addBuilding(g)
        } else if (c && !u) {
            c.builds.push(g)
        } else if (d && !c && !u) {
            es.builds.push(g)
        } else {
            Ze.push(g);
            if (f) $e.push(g);
            Je = Q.concat($e)
        }
    }, this.disableBySid = function(t) {
        for (let e = 0; e < i.length; ++e)
            if (i[e].sid == t) {
                this.disableObj(i[e]);
                break
            }
    }, this.removeAllItems = function(t, e) {
        for (let e = 0; e < i.length; ++e) i[e].active && i[e].owner && i[e].owner.sid == t && this.disableObj(i[e]);
        e && e.broadcast("R", t)
    }, this.fetchSpawnObj = function(t) {
        let n = null;
        for (let e = 0; e < i.length; ++e)
            if (g = i[e], g.active && g.owner && g.owner.sid == t && g.spawnPoint) {
                n = [g.x, g.y], this.disableObj(g), s.broadcast("Q", g.sid), g.owner && g.owner.changeItemCount(g.group.id, -1);
                break
            } return n
    }, this.checkItemLocation = function(t, n, i, s, e, o, r) {
        for (let e = 0; e < Je.length; ++e) {
            const a = Je[e].blocker ? Je[e].blocker : Je[e].getScale(s, Je[e].isItem);
            if (Je[e].active && d.getDistance(t, n, Je[e].x, Je[e].y) < i + a && !(Je[e].assumeBreak && r)) return !1
        }
        return !(!o && e != 18 && n >= u.mapScale / 2 - u.riverWidth / 2 && n <= u.mapScale / 2 + u.riverWidth / 2)
    }, this.checkItemLocation2 = function(t, n, i, s, e, o, r) {
        for (var a = 0; a < Xt.length; ++a) {
            let e = Xt[a];
            var l = e.blocker ? e.blocker : e.getScale(s, e.isItem);
            if (e.active && d.getDistance(t, n, e.x, e.y) < i + l) return !1
        }
        return !(!o && 18 != e && n >= u.mapScale / 2 - u.riverWidth / 2 && n <= u.mapScale / 2 + u.riverWidth / 2)
    }, this.checkItemLocationOrig = function(e, t, n, i, s, o, r) {
        for (var a = 0; a < Q.length; ++a) {
            var l = Q[a].blocker ? Q[a].blocker : Q[a].getScale(i, Q[a].isItem);
            if (Q[a].active && a.getDistance(e, t, Q[a].x, Q[a].y) < n + l) return false
        }
        if (!o && s != 18 && t >= K.mapScale / 2 - K.riverWidth / 2 && t <= K.mapScale / 2 + K.riverWidth / 2) {
            return false
        }
        return true
    };
    this.checkItemLocation3 = function(t, n, i, s, e, o, r, a) {
        for (var l = 0; l < Q.length; ++l) {
            var c = Q[l].blocker ? Q[l].blocker : Q[l].getScale(s, Q[l].isItem);
            let e = d.getDistance(t, n, Q[l].x, Q[l].y) < i + c;
            if (e) {
                a.overlap.push(Q[l]);
                a.preplacer.push(Q[l].assumeBreak);
                a.sids.push(Q[l].sid)
            }
        }
        if (a.preplacer.includes(false)) return !1;
        return !(!o && 18 != e && n >= u.mapScale / 2 - u.riverWidth / 2 && n <= u.mapScale / 2 + u.riverWidth / 2)
    }, this.checkItemLocation4 = function(e, t, n, i, s, o, r) {
        for (var a = 0; a < Q.length; ++a) {
            var l = Q[a].blocker ? Q[a].blocker : Q[a].getScale(i, Q[a].isItem);
            if (Q[a].active && d.getDistance(e, t, Q[a].x, Q[a].y) < n + l && r.sid != Q[a].sid) return !1
        }
        return !(!o && 18 != s && t >= u.mapScale / 2 - u.riverWidth / 2 && t <= u.mapScale / 2 + u.riverWidth / 2)
    }, this.checkItemLocationBot = function(e, t, n, i, s, o, r) {
        for (var a = 0; a < r.length; ++a) {
            var l = r[a].blocker ? r[a].blocker : r[a].getScale(i, r[a].isItem);
            if (d.getDistance(e, t, r[a].x, r[a].y) < n + l) return !1
        }
        return !(!o && 18 != s && t >= u.mapScale / 2 - u.riverWidth / 2 && t <= u.mapScale / 2 + u.riverWidth / 2)
    }, this.addProjectile = function(e, t, n, i, s) {
        const o = items.projectiles[s];
        let r;
        for (let e = 0; e < projectiles.length; ++e)
            if (!projectiles[e].active) {
                r = projectiles[e];
                break
            } r || (r = new Projectile(a, d), projectiles.push(r)), r.init(s, e, t, n, o.speed, i, o.scale)
    }, this.checkCollision = function(t, n, i) {
        i = i || 1;
        const s = t.x - n.x,
              o = t.y - n.y;
        let r = t.scale + n.scale;
        if (Fl(s) <= r || Fl(o) <= r) {
            r = t.scale + (n.getScale ? n.getScale() : n.scale);
            let e = Ul(s * s + o * o) - r;
            if (e <= 0) {
                if (n.ignoreCollision) n.trap && !t.noTrap && n.owner != t && !(n.owner && n.owner.team && n.owner.team == t.team) ? (t.lockMove = !0, n.hideFromEnemy = !1) : n.boostSpeed ? (t.xVel += i * n.boostSpeed * (n.weightM || 1) * _l(n.dir), t.yVel += i * n.boostSpeed * (n.weightM || 1) * Vl(n.dir)) : n.healCol ? t.healCol = n.healCol : n.teleport && (t.x = d.randInt(0, u.mapScale), t.y = d.randInt(0, u.mapScale));
                else {
                    const a = d.getDirection(t.x, t.y, n.x, n.y);
                    if (d.getDistance(t.x, t.y, n.x, n.y), n.isPlayer ? (e = e * -1 / 2, t.x += e * _l(a), t.y += e * Vl(a), n.x -= e * _l(a), n.y -= e * Vl(a)) : (t.x = n.x + r * _l(a), t.y = n.y + r * Vl(a), t.xVel *= .75, t.yVel *= .75), n.dmg && n.owner != t && !(n.owner && n.owner.team && n.owner.team == t.team)) {
                        t.changeHealth(-n.dmg, n.owner, n);
                        const l = 1.5 * (n.weightM || 1);
                        t.xVel += l * _l(a), t.yVel += l * Vl(a), n.pDmg && !(t.skin && t.skin.poisonRes) && (t.dmgOverTime.dmg = n.pDmg, t.dmgOverTime.time = 5, t.dmgOverTime.doer = n.owner), t.colDmg && n.health && (n.changeHealth(-t.colDmg) && this.disableObj(n), this.hitObj(n, d.getDirection(t.x, t.y, n.x, n.y)))
                    }
                }
                return n.zIndex > t.zIndex && (t.zIndex = n.zIndex), !0
            }
        }
        return !1
    }, this.checkCollision2 = function(e, t, n) {
        n = n || 1;
        var i = e.x2 - t.x,
            s = e.y2 - t.y,
            o = 35 + (t.realScale ? t.realScale : t.scale);
        if (Fl(i) <= o || Fl(s) <= o) {
            o = 35 + (t.getScale ? t.getScale() : t.scale);
            var r = Ul(i * i + s * s) - o;
            if (r <= 0) {
                return t.zIndex > t.zIndex && (t.zIndex = t.zIndex), !0
            }
        }
        return !1
    }
}

function Hl(u, f, h, p, m, g, y, x, w) {
    this.addProjectile = function(e, t, n, i, s, o, r, a, l) {
        const c = g.projectiles[o];
        let d;
        for (let e = 0; e < f.length; ++e)
            if (!f[e].active) {
                d = f[e];
                break
            } return d || (d = new u(h, p, m, g, y, x, w), d.sid = f.length, f.push(d)), d.init(o, e, t, n, s, c.dmg, i, c.scale, r), d.ignoreObj = a, d.layer = l || c.layer, d.src = c.src, d
    }
}

function Wl(o, r, a, l, c, d, u, f, h) {
    this.aiTypes = [{
        id: 0,
        src: "cow_1",
        killScore: 150,
        health: 500,
        weightM: .8,
        speed: 95e-5,
        turnSpeed: .001,
        scale: 72,
        drop: ["food", 50]
    }, {
        id: 1,
        src: "pig_1",
        killScore: 200,
        health: 800,
        weightM: .6,
        speed: 85e-5,
        turnSpeed: .001,
        scale: 72,
        drop: ["food", 80]
    }, {
        id: 2,
        name: "Bull",
        src: "bull_2",
        hostile: !0,
        dmg: 20,
        killScore: 1e3,
        health: 1800,
        weightM: .5,
        speed: 94e-5,
        turnSpeed: 74e-5,
        scale: 78,
        viewRange: 800,
        chargePlayer: !0,
        drop: ["food", 100]
    }, {
        id: 3,
        name: "Bully",
        src: "bull_1",
        hostile: !0,
        dmg: 20,
        killScore: 2e3,
        health: 2800,
        weightM: .45,
        speed: .001,
        turnSpeed: 8e-4,
        scale: 90,
        viewRange: 900,
        chargePlayer: !0,
        drop: ["food", 400]
    }, {
        id: 4,
        name: "Wolf",
        src: "wolf_1",
        hostile: !0,
        dmg: 8,
        killScore: 500,
        health: 300,
        weightM: .45,
        speed: .001,
        turnSpeed: .002,
        scale: 84,
        viewRange: 800,
        chargePlayer: !0,
        drop: ["food", 200]
    }, {
        id: 5,
        name: "Quack",
        src: "chicken_1",
        dmg: 8,
        killScore: 2e3,
        noTrap: !0,
        health: 300,
        weightM: .2,
        speed: .0018,
        turnSpeed: .006,
        scale: 70,
        drop: ["food", 100]
    }, {
        id: 6,
        name: "MOOSTAFA",
        nameScale: 50,
        src: "enemy",
        hostile: !0,
        dontRun: !0,
        fixedSpawn: !0,
        spawnDelay: 6e4,
        noTrap: !0,
        colDmg: 100,
        dmg: 40,
        killScore: 8e3,
        health: 18e3,
        weightM: .4,
        speed: 7e-4,
        turnSpeed: .01,
        scale: 80,
        spriteMlt: 1.8,
        leapForce: .9,
        viewRange: 1e3,
        hitRange: 210,
        hitDelay: 1e3,
        chargePlayer: !0,
        drop: ["food", 100]
    }, {
        id: 7,
        name: "Treasure",
        hostile: !0,
        nameScale: 35,
        src: "crate_1",
        fixedSpawn: !0,
        spawnDelay: 12e4,
        colDmg: 200,
        killScore: 5e3,
        health: 2e4,
        weightM: .1,
        speed: 0,
        turnSpeed: 0,
        scale: 70,
        spriteMlt: 1
    }, {
        id: 8,
        name: "MOOFIE",
        src: "wolf_2",
        hostile: !0,
        fixedSpawn: !0,
        dontRun: !0,
        hitScare: 4,
        spawnDelay: 3e4,
        noTrap: !0,
        nameScale: 35,
        dmg: 10,
        colDmg: 100,
        killScore: 3e3,
        health: 7e3,
        weightM: .45,
        speed: .0015,
        turnSpeed: .002,
        scale: 90,
        viewRange: 800,
        chargePlayer: !0,
        drop: ["food", 1e3]
    }, {
        id: 9,
        name: "💀MOOFIE",
        src: "wolf_2",
        hostile: !0,
        fixedSpawn: !0,
        dontRun: !0,
        hitScare: 50,
        spawnDelay: 6e4,
        noTrap: !0,
        nameScale: 35,
        dmg: 12,
        colDmg: 100,
        killScore: 3e3,
        health: 9e3,
        weightM: .45,
        speed: .0015,
        turnSpeed: .0025,
        scale: 94,
        viewRange: 1440,
        chargePlayer: !0,
        drop: ["food", 3e3],
        minSpawnRange: .85,
        maxSpawnRange: .9
    }, {
        id: 10,
        name: "💀Wolf",
        src: "wolf_1",
        hostile: !0,
        fixedSpawn: !0,
        dontRun: !0,
        hitScare: 50,
        spawnDelay: 3e4,
        dmg: 10,
        killScore: 700,
        health: 500,
        weightM: .45,
        speed: .00115,
        turnSpeed: .0025,
        scale: 88,
        viewRange: 1440,
        chargePlayer: !0,
        drop: ["food", 400],
        minSpawnRange: .85,
        maxSpawnRange: .9
    }, {
        id: 11,
        name: "💀Bully",
        src: "bull_1",
        hostile: !0,
        fixedSpawn: !0,
        dontRun: !0,
        hitScare: 50,
        dmg: 20,
        killScore: 5e3,
        health: 5e3,
        spawnDelay: 1e5,
        weightM: .45,
        speed: .00115,
        turnSpeed: .0025,
        scale: 94,
        viewRange: 1440,
        chargePlayer: !0,
        drop: ["food", 800],
        minSpawnRange: .85,
        maxSpawnRange: .9
    }], this.spawn = function(e, t, n, i) {
        if (!this.aiTypes[i]) return console.error("missing ai type", i), this.spawn(e, t, n, 0);
        let s;
        for (let e = 0; e < o.length; ++e)
            if (!o[e].active) {
                s = o[e];
                break
            } return s || (s = new r(o.length, c, a, l, u, d, f, h), o.push(s)), s.init(e, t, n, i, this.aiTypes[i]), s
    }
}
const Ql = Math.PI * 2,
      Yl = 0;

function zl(e, y, x, t, w, b, s, v) {
    this.sid = e, this.isAI = !0, this.nameIndex = w.randInt(0, b.cowNames.length - 1), this.init = function(e, t, n, i, s) {
        this.x = e, this.y = t, this.startX = s.fixedSpawn ? e : null, this.startY = s.fixedSpawn ? t : null, this.xVel = 0, this.yVel = 0, this.zIndex = 0, this.dir = n, this.dirPlus = 0, this.index = i, this.src = s.src, s.name && (this.name = s.name), (this.name || "").startsWith("💀") && (this.isVolcanoAi = !0), this.weightM = s.weightM, this.speed = s.speed, this.killScore = s.killScore, this.turnSpeed = s.turnSpeed, this.scale = s.scale, this.maxHealth = s.health, this.health2 = 0, this.leapForce = s.leapForce, this.health = this.maxHealth, this.chargePlayer = s.chargePlayer, this.viewRange = s.viewRange, this.drop = s.drop, this.dmg = s.dmg, this.hostile = s.hostile, this.dontRun = s.dontRun, this.hitRange = s.hitRange, this.hitDelay = s.hitDelay, this.hitScare = s.hitScare, this.spriteMlt = s.spriteMlt, this.nameScale = s.nameScale, this.colDmg = s.colDmg, this.noTrap = s.noTrap, this.spawnDelay = s.spawnDelay, this.minSpawnRange = s.minSpawnRange, this.maxSpawnRange = s.maxSpawnRange, this.hitWait = 0, this.waitCount = 1e3, this.moveCount = 0, this.targetDir = 0, this.active = !0, this.alive = !0, this.runFrom = null, this.chargeTarget = null, this.dmgOverTime = {}
    }, this.getVolcanoAggression = function() {
        const e = w.getDistance(this.x, this.y, b.volcanoLocationX, b.volcanoLocationY),
              t = e > b.volcanoAggressionRadius ? 0 : b.volcanoAggressionRadius - e;
        return 1 + b.volcanoAggressionPercentage * (1 - t / b.volcanoAggressionRadius)
    };
    let k = 0;
    this.update = function(i) {
        if (this.active) {
            if (this.spawnCounter) {
                if (this.spawnCounter -= i * (1 + 0) * this.getVolcanoAggression(), this.spawnCounter <= 0)
                    if (this.spawnCounter = 0, this.minSpawnRange || this.maxSpawnRange) {
                        const p = b.mapScale * this.minSpawnRange,
                              m = b.mapScale * this.maxSpawnRange;
                        this.x = w.randInt(p, m), this.y = w.randInt(p, m)
                    } else this.x = this.startX || w.randInt(0, b.mapScale), this.y = this.startY || w.randInt(0, b.mapScale);
                return
            }
            k -= i, k <= 0 && (this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer), this.dmgOverTime.time -= 1, this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)), k = 1e3);
            let e = !1,
                t = 1;
            if (!this.zIndex && !this.lockMove && this.y >= b.mapScale / 2 - b.riverWidth / 2 && this.y <= b.mapScale / 2 + b.riverWidth / 2 && (t = .33, this.xVel += b.waterCurrent * i), this.lockMove) this.xVel = 0, this.yVel = 0;
            else if (this.waitCount > 0) {
                if (this.waitCount -= i, this.waitCount <= 0)
                    if (this.chargePlayer) {
                        let e, t, n;
                        for (var s = 0; s < x.length; ++s) x[s].alive && !(x[s].skin && x[s].skin.bullRepel) && (n = w.getDistance(this.x, this.y, x[s].x, x[s].y), n <= this.viewRange && (!e || n < t) && (t = n, e = x[s]));
                        e ? (this.chargeTarget = e, this.moveCount = w.randInt(8e3, 12e3)) : (this.moveCount = w.randInt(1e3, 2e3), this.targetDir = w.randFloat(-W, W))
                    } else this.moveCount = w.randInt(4e3, 1e4), this.targetDir = w.randFloat(-W, W)
            } else if (this.moveCount > 0) {
                var o = this.speed * t * (1 + b.MAX_SPEED * Yl) * this.getVolcanoAggression();
                if (this.runFrom && this.runFrom.active && !(this.runFrom.isPlayer && !this.runFrom.alive) ? (this.targetDir = w.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y), o *= 1.42) : this.chargeTarget && this.chargeTarget.alive && (this.targetDir = w.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y), o *= 1.75, e = !0), this.hitWait && (o *= .3), this.dir != this.targetDir) {
                    this.dir %= Ql;
                    const p = (this.dir - this.targetDir + Ql) % Ql,
                          m = j(S(p - Ql), p, this.turnSpeed * i),
                          g = p - W >= 0 ? 1 : -1;
                    this.dir += g * m + Ql
                }
                this.dir %= Ql, this.xVel += o * i * U(this.dir), this.yVel += o * i * V(this.dir), this.moveCount -= i, this.moveCount <= 0 && (this.runFrom = null, this.chargeTarget = null, this.waitCount = this.hostile ? 1500 : w.randInt(1500, 6e3))
            }
            this.zIndex = 0, this.lockMove = !1;
            var r;
            const d = w.getDistance(0, 0, this.xVel * i, this.yVel * i),
                  u = j(4, oe(1, H(d / 40))),
                  f = 1 / u;
            for (var s = 0; s < u; ++s) {
                this.xVel && (this.x += this.xVel * i * f), this.yVel && (this.y += this.yVel * i * f), r = y.getGridArrays(this.x, this.y, this.scale);
                for (var a = 0; a < r.length; ++a)
                    for (let e = 0; e < r[a].length; ++e) r[a][e].active && y.checkCollision(this, r[a][e], f)
            }
            let n = !1;
            if (this.hitWait > 0 && (this.hitWait -= i, this.hitWait <= 0)) {
                n = !0, this.hitWait = 0, this.leapForce && !w.randInt(0, 2) && (this.xVel += this.leapForce * U(this.dir), this.yVel += this.leapForce * V(this.dir));
                var r = y.getGridArrays(this.x, this.y, this.hitRange),
                    l, c;
                for (let e = 0; e < r.length; ++e)
                    for (var a = 0; a < r[e].length; ++a) l = r[e][a], l.health && (c = w.getDistance(this.x, this.y, l.x, l.y), c < l.scale + this.hitRange && (l.changeHealth(-this.dmg * 5) && y.disableObj(l), y.hitObj(l, w.getDirection(this.x, this.y, l.x, l.y))));
                for (var a = 0; a < x.length; ++a) x[a].canSee(this) && v.send(x[a].id, "J", this.sid)
            }
            if (e || n) {
                var l, c;
                let e;
                for (var s = 0; s < x.length; ++s) l = x[s], l && l.alive && (c = w.getDistance(this.x, this.y, l.x, l.y), this.hitRange ? !this.hitWait && c <= this.hitRange + l.scale && (n ? (e = w.getDirection(l.x, l.y, this.x, this.y), l.changeHealth(-this.dmg * (1 + b.MAX_ATTACK * Yl) * this.getVolcanoAggression()), l.xVel += .6 * U(e), l.yVel += .6 * V(e), this.runFrom = null, this.chargeTarget = null, this.waitCount = 3e3, this.hitWait = w.randInt(0, 2) ? 0 : 600) : this.hitWait = this.hitDelay) : c <= this.scale + l.scale && (e = w.getDirection(l.x, l.y, this.x, this.y), l.changeHealth(-this.dmg * (1 + b.MAX_ATTACK * Yl) * this.getVolcanoAggression()), l.xVel += .55 * U(e), l.yVel += .55 * V(e)))
            }
            this.xVel && (this.xVel *= re(b.playerDecel, i)), this.yVel && (this.yVel *= re(b.playerDecel, i));
            const h = this.scale;
            this.x - h < 0 ? (this.x = h, this.xVel = 0) : this.x + h > b.mapScale && (this.x = b.mapScale - h, this.xVel = 0), this.y - h < 0 ? (this.y = h, this.yVel = 0) : this.y + h > b.mapScale && (this.y = b.mapScale - h, this.yVel = 0), this.isVolcanoAi && (this.chargeTarget && (w.getDistance(this.chargeTarget.x, this.chargeTarget.y, b.volcanoLocationX, b.volcanoLocationY) || 0) > b.volcanoAggressionRadius && (this.chargeTarget = null), this.xVel && (this.x < b.volcanoLocationX - b.volcanoAggressionRadius ? (this.x = b.volcanoLocationX - b.volcanoAggressionRadius, this.xVel = 0) : this.x > b.volcanoLocationX + b.volcanoAggressionRadius && (this.x = b.volcanoLocationX + b.volcanoAggressionRadius, this.xVel = 0)), this.yVel && (this.y < b.volcanoLocationY - b.volcanoAggressionRadius ? (this.y = b.volcanoLocationY - b.volcanoAggressionRadius, this.yVel = 0) : this.y > b.volcanoLocationY + b.volcanoAggressionRadius && (this.y = b.volcanoLocationY + b.volcanoAggressionRadius, this.yVel = 0)))
        }
    }, this.canSee = function(e) {
        if (!e || e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer) return !1;
        const t = S(e.x - this.x) - e.scale,
              n = S(e.y - this.y) - e.scale;
        return t <= b.maxScreenWidth / 2 * 1.3 && n <= b.maxScreenHeight / 2 * 1.3
    };
    let n = 0,
        i = 0;
    this.animate = function(e) {
        this.animTime > 0 && (this.animTime -= e, this.animTime <= 0 ? (this.animTime = 0, this.dirPlus = 0, n = 0, i = 0) : i == 0 ? (n += e / (this.animSpeed * b.hitReturnRatio), this.dirPlus = w.lerp(0, this.targetAngle, j(1, n)), n >= 1 && (n = 1, i = 1)) : (n -= e / (this.animSpeed * (1 - b.hitReturnRatio)), this.dirPlus = w.lerp(0, this.targetAngle, oe(0, n))))
    }, this.startAnim = function() {
        this.animTime = this.animSpeed = 600, this.targetAngle = W * .8, n = 0, i = 0
    }, this.changeHealth = function(e, t, n) {
        if (this.active && (this.health += e, n && (this.hitScare && !w.randInt(0, this.hitScare) ? (this.runFrom = n, this.waitCount = 0, this.moveCount = 2e3) : this.hostile && this.chargePlayer && n.isPlayer ? (this.chargeTarget = n, this.waitCount = 0, this.moveCount = 8e3) : this.dontRun || (this.runFrom = n, this.waitCount = 0, this.moveCount = 2e3)), e < 0 && this.hitRange && w.randInt(0, 1) && (this.hitWait = 500), t && t.canSee(this) && e < 0 && v.send(t.id, "8", H(this.x), H(this.y), H(-e), 1), this.health <= 0)) {
            if (this.spawnDelay) this.spawnCounter = this.spawnDelay, this.x = -1e6, this.y = -1e6;
            else if (this.minSpawnRange || this.maxSpawnRange) {
                const e = b.mapScale * this.minSpawnRange,
                      i = b.mapScale * this.maxSpawnRange;
                this.x = w.randInt(e, i), this.y = w.randInt(e, i)
            } else this.x = this.startX || w.randInt(0, b.mapScale), this.y = this.startY || w.randInt(0, b.mapScale);
            if (this.health = this.maxHealth, this.runFrom = null, t && (s(t, this.killScore), this.drop))
                for (let e = 0; e < this.drop.length;) t.addResource(b.resourceTypes.indexOf(this.drop[e]), this.drop[e + 1]), e += 2
        }
    }
}

function Gl(e) {
    this.sid = e, this.init = function(e, t, n, i, s, o, r, a, l, c, d, u) {
        o = o || {}, this.sentTo = {}, this.gridLocations = [], this.active = !0, this.doUpdate = o.doUpdate, this.x = e, this.y = t, this.dir = n, this.xWiggle = 0, this.yWiggle = 0, this.scale = i, this.type = s, this.id = o.id, this.owner = r, this.name = o.name ? o.name : this.type === 0 ? "Tree" : this.type === 1 && this.y >= 12e3 ? "Cactus" : this.type === 1 ? "Bush" : this.type === 2 ? "Stone" : this.type === 3 ? "Gold Stone" : null, this.isItem = this.id != null, this.group = o.group, this.health = this.maxHealth = o.health;
        this.health2 = 0, this.buildingID = o.buildingID, this.setType = o.setType, this.layer = 2, this.group != null ? this.layer = this.group.layer : this.type == 0 ? this.layer = 3 : this.type == 2 ? this.layer = 0 : this.type == 4 && (this.layer = -1), this.colDiv = o.colDiv || 1, this.blocker = o.blocker, this.ignoreCollision = o.ignoreCollision, this.dontGather = o.dontGather, this.hideFromEnemy = o.hideFromEnemy, this.friction = o.friction, this.projDmg = o.projDmg, this.dmg = o.dmg, this.pDmg = o.pDmg, this.pps = o.pps, this.zIndex = o.zIndex || 0, this.turnSpeed = o.turnSpeed, this.req = o.req, this.trap = o.trap, this.healCol = o.healCol, this.teleport = o.teleport, this.boostSpeed = o.boostSpeed, this.projectile = o.projectile, this.opacity = o.name == "pit trap" ? 1 : 1, this.opacity2 = 1, this.fadingOut = false, this.dmgpot = 0, this.assumeBreak = false, this.ignoreWiggleDirs = [], this.wiggleDirs = [], this.shootRange = o.shootRange, this.shootRate = o.shootRate, this.shootCount = this.shootRate, this.spawnPoint = o.spawnPoint, this.tick = v, this.preplace = u, this.fake = c, this.bot = a, this.elevation = typeof this.type === "number" && this.owner === null || this.name == "turret" || this?.group?.name === "mill" ? 2 : 1, this.restricter = d, this.realScale = this.type <= 1 && this.type !== null ? this.scale * .6 : this.scale;
        this.pathScale = this.type === 1 && this.y <= 12e3 ? this.scale * .6 + 15 : this.type === 0 ? this.scale * .7 + 10 : this.dmg && !te(this?.owner?.sid) || this.teleport || this.boostSpeed ? this.scale + 47 : this.type === 1 && this.y >= 12e3 ? this.scale * .55 + 47 : this.name == "pit trap" && !te(this?.owner?.sid) ? this.scale + 38 : this.ignoreCollision ? 0 : this.scale + 10
    }, this.changeHealth = function(e, t) {
        return this.health += e, this.health <= 0
    }, this.getScale = function(e, t) {
        return e = e || 1, this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : .6 * e) * (t ? 1 : this.colDiv)
    }, this.visibleToPlayer = function(e) {
        return !this.hideFromEnemy || this.owner && (this.owner == e || this.owner.team && e.team == this.owner.team)
    }, this.update = function(e) {
        this.active && (this.xWiggle && (this.xWiggle *= re(.99, e)), this.yWiggle && (this.yWiggle *= re(.99, e)), (us.checked && this?.group?.name == "mill" || this?.group?.name != "mill") && this.turnSpeed && (this.dir += this.turnSpeed * e))
    }
}
const Kl = [{
    id: 0,
    name: "food",
    layer: 0
}, {
    id: 1,
    name: "walls",
    place: !0,
    limit: 30,
    layer: 0
}, {
    id: 2,
    name: "spikes",
    place: !0,
    limit: 15,
    layer: 0
}, {
    id: 3,
    name: "mill",
    place: !0,
    limit: 7,
    sandboxLimit: 299,
    layer: 1
}, {
    id: 4,
    name: "mine",
    place: !0,
    limit: 1,
    layer: 0
}, {
    id: 5,
    name: "trap",
    place: !0,
    limit: 6,
    layer: -1
}, {
    id: 6,
    name: "booster",
    place: !0,
    limit: 12,
    sandboxLimit: 299,
    layer: -1
}, {
    id: 7,
    name: "turret",
    place: !0,
    limit: 2,
    layer: 1
}, {
    id: 8,
    name: "watchtower",
    place: !0,
    limit: 12,
    layer: 1
}, {
    id: 9,
    name: "buff",
    place: !0,
    limit: 4,
    layer: -1
}, {
    id: 10,
    name: "spawn",
    place: !0,
    limit: 1,
    layer: -1
}, {
    id: 11,
    name: "sapling",
    place: !0,
    limit: 2,
    layer: 0
}, {
    id: 12,
    name: "blocker",
    place: !0,
    limit: 3,
    layer: -1
}, {
    id: 13,
    name: "teleporter",
    place: !0,
    limit: 2,
    sandboxLimit: 299,
    layer: -1
}],
      Xl = [{
          indx: 0,
          layer: 0,
          src: "arrow_1",
          dmg: 25,
          speed: 1.6,
          scale: 103,
          range: 1e3
      }, {
          indx: 1,
          layer: 1,
          dmg: 25,
          speed: 1.5,
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
      }],
      Jl = [{
          id: 0,
          type: 0,
          name: "tool hammer",
          uF: [],
          desc: "tool for gathering all resources",
          age: 1,
          src: "hammer_1",
          length: 140,
          width: 140,
          xOff: -3,
          yOff: 18,
          dmg: 25,
          spdMult: 1,
          range: 65,
          gather: 1,
          speed: 300
      }, {
          id: 1,
          type: 0,
          age: 2,
          uF: [0],
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
          uF: [1, 0, 15, 12, 13, null],
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
          uF: [0, 4],
          name: "short sword",
          desc: "increased attack power but slower move speed",
          src: "sword_1",
          iPad: 1.3,
          length: 130,
          width: 210,
          xOff: -8,
          yOff: 46,
          dmg: 35,
          spdMult: .85,
          range: 110,
          gather: 1,
          speed: 300
      }, {
          id: 4,
          type: 0,
          uF: [3, 0, 15, 12, 13, null, 9],
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
          spdMult: .8,
          range: 118,
          gather: 1,
          speed: 300
      }, {
          id: 5,
          type: 0,
          age: 2,
          uF: [0],
          name: "polearm",
          desc: "long range melee weapon",
          src: "spear_1",
          iPad: 1.3,
          length: 130,
          width: 210,
          xOff: -8,
          yOff: 53,
          dmg: 45,
          knock: .2,
          spdMult: .82,
          range: 142,
          gather: 1,
          speed: 700
      }, {
          id: 6,
          type: 0,
          age: 2,
          uF: [0],
          name: "bat",
          desc: "fast long range melee weapon",
          src: "bat_1",
          iPad: 1.3,
          length: 110,
          width: 180,
          xOff: -8,
          yOff: 53,
          dmg: 20,
          spdMult: 1,
          knock: .7,
          range: 110,
          gather: 1,
          speed: 300
      }, {
          id: 7,
          type: 0,
          age: 2,
          uF: [0],
          name: "daggers",
          desc: "really fast short range weapon",
          src: "dagger_1",
          iPad: .8,
          length: 110,
          width: 110,
          xOff: 18,
          yOff: 0,
          dmg: 20,
          knock: .1,
          range: 65,
          gather: 1,
          hitSlow: .1,
          spdMult: 1.13,
          speed: 100
      }, {
          id: 8,
          type: 0,
          age: 2,
          uF: [0],
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
          uF: [null],
          name: "hunting bow",
          desc: "bow used for ranged combat and hunting",
          src: "bow_1",
          req: ["wood", 4, "ez", 0],
          length: 120,
          width: 120,
          xOff: -6,
          dmg: 25,
          yOff: 0,
          projSpd: 1.6,
          projectile: 0,
          spdMult: .75,
          speed: 600
      }, {
          id: 10,
          type: 1,
          age: 6,
          uF: [null],
          name: "great hammer",
          desc: "hammer used for destroying structures",
          src: "great_hammer_1",
          length: 140,
          width: 140,
          xOff: -9,
          yOff: 25,
          dmg: 10,
          spdMult: .88,
          range: 75,
          sDmg: 7.5,
          gather: 1,
          speed: 400
      }, {
          id: 11,
          type: 1,
          age: 6,
          uF: [null],
          name: "wooden shield",
          desc: "blocks projectiles and reduces melee damage",
          src: "shield_1",
          length: 120,
          dmg: 0,
          width: 120,
          shield: .2,
          xOff: 6,
          yOff: 0,
          spdMult: .7,
          speed: 1
      }, {
          id: 12,
          type: 1,
          age: 8,
          pre: 9,
          uF: [9, null, 4],
          name: "crossbow",
          desc: "deals more damage and has greater range",
          src: "crossbow_1",
          req: ["wood", 5, "ez", 0],
          aboveHand: !0,
          armS: .75,
          length: 120,
          width: 120,
          xOff: -4,
          yOff: 0,
          dmg: 35,
          projSpd: 2.5,
          projectile: 2,
          spdMult: .7,
          speed: 700
      }, {
          id: 13,
          type: 1,
          age: 9,
          uF: [12, 9, null, 4, 2],
          pre: 12,
          name: "repeater crossbow",
          desc: "high firerate crossbow with reduced damage",
          src: "crossbow_2",
          req: ["wood", 10, "ez", 0],
          aboveHand: !0,
          armS: .75,
          length: 120,
          width: 120,
          xOff: -4,
          dmg: 30,
          yOff: 0,
          projSpd: 2,
          projectile: 3,
          spdMult: .7,
          speed: 230
      }, {
          id: 14,
          type: 1,
          age: 6,
          uF: [null],
          name: "mc grabby",
          desc: "steals resources from enemies",
          src: "grab_1",
          length: 130,
          width: 210,
          xOff: -8,
          yOff: 53,
          dmg: 0,
          steal: 250,
          knock: .2,
          spdMult: 1.05,
          range: 125,
          gather: 0,
          speed: 700
      }, {
          id: 15,
          type: 1,
          age: 9,
          uF: [12, 9, null, 4, 2],
          pre: 12,
          name: "musket",
          desc: "slow firerate but high damage and range",
          src: "musket_1",
          req: ["stone", 10, "ez", 0],
          aboveHand: !0,
          dmg: 50,
          rec: .35,
          armS: .6,
          hndS: .3,
          hndD: 1.6,
          length: 205,
          width: 205,
          xOff: 25,
          yOff: 0,
          projectile: 5,
          projSpd: 3.6,
          hideProjectile: !0,
          spdMult: .6,
          speed: 1500
      }],
      ql = [{
          group: Kl[0],
          name: "apple",
          desc: "restores 20 health when consumed",
          req: ["food", 10],
          consume: function(e) {
              return e.changeHealth(20, e)
          },
          scale: 22,
          holdOffset: 15
      }, {
          age: 3,
          group: Kl[0],
          name: "cookie",
          desc: "restores 40 health when consumed",
          req: ["food", 15],
          consume: function(e) {
              return e.changeHealth(40, e)
          },
          scale: 27,
          holdOffset: 15
      }, {
          age: 7,
          group: Kl[0],
          name: "cheese",
          desc: "restores 30 health and another 50 over 5 seconds",
          req: ["food", 25],
          consume: function(e) {
              return e.changeHealth(30, e) || e.health < 100 ? (e.dmgOverTime.dmg = -10, e.dmgOverTime.doer = e, e.dmgOverTime.time = 5, !0) : !1
          },
          scale: 27,
          holdOffset: 15
      }, {
          age: 1,
          group: Kl[1],
          name: "wood wall",
          desc: "provides protection for your village",
          req: ["wood", 10, "ez", 0],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAA4JJREFUeF7tmr1v00AYxh9baWmLxEcpbakYECyIBRALQojZcYfWlZBgQEKCjQkQ/wUwMdIBCQnE4jDkXDoihFgqYEEsSAwISCnlQ9C0SWQjJzE40fnzfHFKX29R7uz3/fl5nzvfnQK6mgQU4tAiQCDaSiAQBKLTFEgRpAhSBHegpNLol9KYnp47WK/buxcXS0t5zmlyVYSuGxsABtsAKoyZk3nByAWErhtOWMKMmT2Pq+cPjILgAeo1jJ6BCAIwMtQSx9o6P5ReAZEOQteNOwCu8EpBO12Dqrb+sW1g4ZlnF11jvIJ75bJ5UaZ/SAOh60YJwAwveP1MLTQn9pQPxHGcJ5ZV0mQAkQJC1+d+Ac72NBD+ekQADADfGDNHs4aRKYgwI4xSQVBiQepw2zvO+pBlWe4QLHxlAkIGgO7MwoBkYahCIDTNOKuqeMR7HSeONDAxZgu/Kf8NKisqlt4U+N8KinOhXC7dT/vAVCA0beaqqqq3eQ89dayOXTtC50sd3faObmv+/rIaX+Hffyp4/mqAm7Pj2Dcs6/HNpEBSgQgqhaQ+cGB/p5++//A7UfxB5ZKmVDIBIQqgO3tRILmASAJhsKBianI41lv/+LmKWiO+x/jV0bcghocKmBhreUHSq7Kygep6I7Jb34Po9oHIjAIaRJVL34LICkBc/yAQbVIEgkB0Fg0pghRBiuAOsFQaVBpUGlQaLoGgqTZ5BHkEecTm8ggv2qy+QjftZ7j/tY0MFzC+J93CzPLXDaxV/4OFGT+QwQEVUxMxl+oqVdTqm2ipzk00ybql2z6qXKLKoNskulezc1mz9AclCkQUgBdLL0FcA3CLZ98nj9YxulPuBs/qDwUvXvM3eABcZ8zkbj6FrZem2tfwbqhpxjlVxQPeA44fbmDfePwaj7Oo+2lZxcu3/C0/28b5hQXzYZz78NoIgfBuuOU3gbvJygAiexfcyyETRXCAuJuYIzwJxjXUEABrjJncQyhpy8LtJwVEc0jVDQagmAZGCASLMVMXSTiorzQQ//xj9i6gXOIFEPcwGeDMM1a6LAOA1NLgqiDgkOmWOV6YxFD9bdNMikQUI700kqhDZGYoAkGqWcYJrFg0aoqC5hTRcVC3LJN/wDLOzQTb5KIIf8zF4uwh97dlld4J5iLUPXcQQtFn2JlAtGESCALRWVekCFIEKYI71lBpUGl0CuMPpubCUvT4yHcAAAAASUVORK5CYII=",
          projDmg: !0,
          uF: [],
          health: 380,
          scale: 50,
          indx: .5,
          holdOffset: 20,
          placeOffset: -5
      }, {
          age: 3,
          group: Kl[1],
          name: "stone wall",
          desc: "provides improved protection for your village",
          req: ["stone", 25, "ez", 0],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAA2RJREFUeF7tmj9v00AYxp9YIopIOkArlXapBGozZa/6CZzr0LoSEgxISLAxAeJbABMjDEhIIBaHIee2HyDqwtSpiRi6pIrUiiEJCqlkI4dYONH5vy9O6Zstynvn9/35eZ9z7pwDfUYEcsThLwECMVYCgSAQk6ZAiiBFkCKECyW1xry0xvb23t3LS/PW4WHte5bPNJkqgjHtN4D8GECHc/1OVjAyAcGYZvkVzLk+87xmfsEgCA6gWcOYGQgvAIVCYVT7YDAQimRWQKSDYEx7B+CZqMrNzU0oijL6yTRNHB0diZe2HD7W6/pjmf4hDQRjWg3Ajij5ra0t35oajYbwd8uyDgyjpsoAIgUEY3s9wCrGgeCM8YIB4Cfn+u20YaQKws8Ig1TgVZgPEFjWoGAYhr0EJ/6kAkIGgOnK/ICkYaiJQKiqdl9R8FV0O8rlMhYXFxPfKfcEFxcXODk58TBU61G9XvsU94KxQKjqznNFUd6KLlqpVLCwsBA6n+Xl5VFsp9MJPabb7eL4+NjDUM1XhvHtdejJxoGxQHi1QlQfWF9fn8i31WpFyt+rXeK0SiogkgKYrj4pkExARIGQz+extrYW6q6fnp5iOByGirWD3OqYWxDFYhGrq6uhi3IHtttt9Pv9wLFzD2LaBwIr8ggIape5BZEWgLD+QSDGpAgEgZhsGlIEKYIUIVxgqTWoNag1qDVsAl6P2uQR5BHkEVfLI5xs0/oXemX/hrtvW6lUwsrKSqytiLOzM/R6vcCxc2uWosz/6606u+Ao+5Z2fFC7BLXBNOTp3exM9izdSSUFkhSAk8ssQbwA8EYk/6wPeAC85FwXHj75GU2scw1nQlXVHigKPosusLGxgaWlpUCTixJwfn6OZrMpHGKaeLi/r3+JMp87NhEIZ6Jrfwg8TV8GENmn4E4NqShCAMQ+kbkpkmlYQ/UB8ItzXfgSSty2sMdJAWFPzJjGAVTjwPCBYHCusyQFe42VBuKff+y+B3JPRAmEfZkMsD5wXnsqA4DU1hAlfO1fL4xiqO7YOA9FSRQjvTWiqCPJk2ESCFLNMkxi1ao2zOVww461LFwahu68oB5meKoxmSjCXUG1unvP/m4YtR+pVhZxssxBRMxXWjiBGKMlEARisstIEaQIUoRw5aHWoNaYFMYfhr/EUpJ56XkAAAAASUVORK5CYII=",
          health: 900,
          uF: [],
          scale: 50,
          holdOffset: 20,
          indx: .5,
          placeOffset: -5
      }, {
          age: 7,
          group: Kl[1],
          name: "castle wall",
          desc: "provides powerful protection for your village",
          req: ["stone", 35, "ez", 0],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAA6pJREFUeF7tmkFrU0EQxzdRIpik0Ai1pSdFQcGLF8/pNe3BQr+P9fsI9dDm2py9eBEUFD2V1oIpNEnBoE1Z0wfvTfbNzuzOvg24PTabzczv/f+zs/u2ptLfPwK1xGFOIIG4VUICkUAUi0JSRFJEUoRxoUzWWBZr9Hqv9+v1u4PDw3eDmD1NVEX0eruzfPL9/kG0eCr/Ya0ApWpvsKdfq6nB0dHBVpUKqQQEJfmypOv1O1tV2CYoCAqAtY1NNR5dqqvxCBVAaCBBQEDvmzJ88fLVwr8no0v149sXqyNC1BIxEJTk9dNfW9+0JqoHnJ+dqPPTE3SsZC3xBrGzs9e9vv57jEXMAQDn+f71cyW28QaBKcEkf5IcSgZhUHzt4gVie3v3eDZT3Xzc0smXgfv08cPCRz4wvEBANVQFISMAYSwFCFcIq52OajTuqZ9np06uycOIAsJHDVnypszHk5GajMZkKFKqcLZGHsT9Vls9fvrcGnyj0VCrnQfWcXoAVSFRQcAlE7MFJ/kyQjYoRRizt/3++30S7dwgJ0VwbPFwfYMbk3E8BkNCFWwQUA2YLaQgZGTKYCx2oXxVsEHEUIMNhP7cVxVeIGyts7QiLoa/1HQ6NVoHqoK7lLJAwE4SK5LSEPiq4NmDBYJqi2a7pVrNtkiRhJNMp7/VxXBonNvHHs4gHj15pprtFWNAodTAVQXHHmQQVDXoYJcFhI6FCoMEIuaSaZIcZg/XpZQEAp49YqsFto+QLBplPQU8s6CedZJA6ASSNXKPMQ8jxtJpK5bw8JdaH/S8ZEVwVBHSHtg2vcLls/iWKoYqqJsv7gk3SxFQFVjRlNh+w+KKQai0xebYI0Q/QVUDp3/IYDsoomgPTBXSjZX0kplXHBsERxWS9sB2nj5F0lkRcxD0oilhEQwCPIugNlCw/jgpgqMK+INUu9iSz+aFnSSnd/C2hg8I/V1sm47tI0wtuoQt2A0VDITaaWJ7DK0QbvL5+aK/4PFVhcQGTEoNoorIEnN99ccFAyFwO0mxYplNVHYtgPr2iwPA9AY8+75rkfRaPvPBUy6K+ECh3JxxXTJFVg34JE13JeAY2/F/fjwFgB7vqwQxRZikTblPVXb4i8lfygammJ0bKoq3qbZptVesF8eU4r2noMQXxBrYD1OAlH8/LICg1sCgUGpJ6KdfuTVs8vyvL6VDOHPb/Om6XO6wgeZ8HrRYcgKJPTaBuH0CCUQCUTRjUkRSRFKEcYFK1kjWKArjBu9WC2HgRkavAAAAAElFTkSuQmCC",
          health: 1500,
          uF: [],
          scale: 52,
          holdOffset: 20,
          indx: .5,
          placeOffset: -5
      }, {
          age: 1,
          group: Kl[2],
          name: "spikes",
          desc: "damages enemies when they touch them",
          req: ["wood", 20, "stone", 5],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAABBdJREFUeF7tms1uEzEQx70JLZWQQgFxQCKiHLhFcATlgNpr+iFa8QC8Sds34QFQi/qRaysOERxBuXFAKEgcEFAiIRVKssibWvXOju3xrrMf4JX2knjt8W//Mx6PN2D+iggEnsOEgAdxrgQPwoOIBwWvCK+IkihibW1jC1ux9vZ20N+nvboV5hqdzpMtxoLN+ATD7W73pQfB2H8JYj3E5N7t7hai0kIG7XRwCAJMETByB4HHBqiN/F2kABBxNbTb7YhCr9eL0chbFbmCgC7RarVYo9GIAAwGg+iWrzxh5AZieXn9KAzZopgoB8BByBdURZ6rSC4gVlaeLo7HoyN50sIlYHQoykVyAQFdgqthOBySk8U8XGTqIKBLkGcvNfwnQJhyBiqYacOYmiJo+QJj169OEsxvP8ymBAE7PjzcXaLCs2lnHp3YGxYQsUfv3Rkxfuuuryc19ubdJW0bDiUI6tsHBy+OiSbq+8vSCfWt8zEe3v/DbsyPrYajABEd1mr1pSxQrBVhM3lhZOfxbysAsHH31azV82nUogWxurrxbDQaLyTrBnS7skIQI9nCkC3kagmC8cL+/s5zleVGRZiifrPZZPzmF0yGXEFQwRBJGc9J+v2+9u2YVh0jCN47hIFlhdwQOUnSxYS5y3V26+Ycavj34Rk7GeKuBGOG/BJEZ2n3LEQQybIahEFVw93bV0h+9eHTT7QddBGTHdT9CgkEtwjLEGUjZBAqNVAhCAIYjPcf64zf4lLZwP+3yTvIIDAXEdKEboHFhvnGLLvWmCGpQTT6/OWUnf5K5hyyKoQNaV1CjGUFAoPBt9IwUGEgbNWgUwV0D8wGU3CEbyQFCKwMH+82bxBwUmmSK2sQE1WoYfC9w6MHZwkXcKmI129nlHsTm7ggG5kKBOYiotOiQdi6ROoYIVNUJVtFuUZaCNEKYxXGQWPVjrMIEGnighPXEJ1g8QIDocsmVS9DlWUm9x3Zz0EyKeICRvysQlVzsA2YWEKFbc2zuISTGKGLF6oNFxUGNcV2ASFzjBAgsFih23TpskxVNsnHwtSQNTY4VYRN0MwSnLGaRCVARPlGxuqUAKcqzFQGhAsYuupUqUFgJ1muirfJvrMvnc6CJcwleI0Abs2FxClAYM1BPCsOjuNFoJKD4MZjNQIYLKkHPOraaAVA8EmrlGGzeujLcRUBISac/PbBjAL7hoI/VVrXgPVMXR3RPP1kC/nLGggibf0BjuJkrwFBcH+GnwHhAC5kTf18AJblSg3C9NZ1az/PUsNwtCl/ZqTrr4Ig7IMa5YS9EiBcGWlSiYsdqJMYAUt2rtJezCUwlZQMhL30TbHE9L+AUhoQJoOr8L8T16jCRE02ehDnhDwIDyLuLF4RXhFeEegC4l3Du4Z3DdQ1/gLN32VhHtKeXAAAAABJRU5ErkJggg==",
          health: 400,
          uF: [],
          dmg: 20,
          scale: 49,
          id: 6,
          spritePadding: -23,
          holdOffset: 8,
          indx: .5,
          placeOffset: -5
      }, {
          age: 5,
          group: Kl[2],
          name: "greater spikes",
          uF: [],
          desc: "damages enemies when they touch them",
          req: ["wood", 30, "stone", 10],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAABB9JREFUeF7tm89rE0EUx2cT20aEpCoFBYN48Bb0qPQg7TX9gS3+Af4ntv+Jf4C00h+5VjwEPVZy8yASQaGoTUBMrUnkbTJxdjK/Z5xJzSzkkt2dmfeZ75v39s1uguKREkgihwGBCGKohAgigsguClERURETooi1tc2nrIi1v7/zPEQkC+Ya1erjLYSSZ1mj+9u12sutqQIBxlarG33S6FptN9jEBOuYhoCBhIIRBMTq6pOlXq97xHaBMO4RBARPDSFV4R0EDaFcLqf2N5vNjEB8u0hwEIuLiymAer0+PSBWVjaO+n20hC2uVCqoWCyOAISE4U0R9AIJAAAEeTQaDdRut0d/5XL55YODF6985BXeQLDWhlarlRqOVVEqlYKtFV5AyKKEbMZ9LJxKIEDW/X53lA6Tfi4zIsT5JEEjdzo83F1WGYMSCFY6rNK4yjXXSoMs+1tLeSgqzY6uUVWTVu+2EofR3b3dTX+i4+tpDr19d0nLYNbFOoutNxAqAGhj3hzPWClFVQ3QrxYIlovghAgbQecCIP2H98+tZpcFRNavDgRDENk6AqTIOE2m8wAXEDBBGgbZL4Rg6BsfOi6B79FWhEgVtBqqj35ZKYG+ufZ6NvOXy/TcCQiYHZwc4ZHK1HBjoYAuz+Uzhn1vn6PTNh/e+495BD98QL+QhJFqgHO6bmHkGngQsgjCU0NhLo9uLhSEShEBoVVBN2TiFpYgWDXHwbAe3PuNrs/3xoydL86iq8UZJXf5fNJBnbPxMEurItuYeVHHyDVkquCp4c6tK0oQ8EUfPv1gXs9ThYlLWC2Wf0GwVcECoaMG3P7Psy76ctIZg8EGYa4GK9cQqYIFQlcNIlWwQNiowRGIrCp40cIlCDqnMF0gSalZrRHQEF1wCQECITu3cKSI7CYNNDp1rsHetmODYCVQshDCyycmbrHkJVVTFT55aoBZ5j1yq2SVWCU8NYhrFeZrhdFiKd6yG5jCU4VKPsHLKqFdWYptGkaNQNAuAWV5eOgid6tkhRgWEF4ChVVCh02ofruqfDsBwXsc/q8fw2m3IHerQBGkKmSP4rKoQZ5nqQFvENH9muQV2oqg3UJWMnMBY+JKdbIahGiGTYCIH7nletJZOJUVoRIp5EPj1yrIe20B4Lb+CQgbNciUAucvzAYPbOljgy7Sll+S5LdVdtSVXUNF9rxrbNWkI3HTcXoBkWaa1KuEuPIN5/CrAa6SIxMY3kDEF0WI6RHlIPRuFWztq27pmyiAvsebInDHPBgh359yUqHSnY34eqHARWiYPqJEcNcYRBD+LpmLirSuSoO4Bm+tMEmLTQzm3eN9sSQHEj9TGNLIuoh5vdGFMoIqAgxYX99Mv9jZ29sJ8uUOhhgchIvZdNFGBDGkGEFEEFmHioqIioiKYAaZP321OmHR4N2KAAAAAElFTkSuQmCC",
          health: 500,
          dmg: 35,
          scale: 52,
          id: 7,
          spritePadding: -23,
          indx: .5,
          holdOffset: 8,
          placeOffset: -5
      }, {
          age: 9,
          group: Kl[2],
          uF: [],
          name: "poison spikes",
          desc: "poisons enemies when they touch them",
          req: ["wood", 35, "stone", 15],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAABEJJREFUeF7tm01rE0EYx2ezpkkUklopKLWIoLeiR8WDtNf0BVv8AH4T22/iB5BW+pJrxYPoUelNQUSLQrE2AU1iTVZmN7Pdmc77TmcSOwu9dF9m5jf/53n+O7MJgD9iAoHnkBDwIAZK8CA8CDwpeEV4RQyJIhYXV57QKtbW1vozF5XMWWjU649WAQie4oOO1hqNF6vnCgQcbL2+HGUH3WhsOJsYZw2TEBAQVzCcgFhYeDzb7/d26SHgJjycgGCpwaUqrIMgIUxMF+PxH345xgRiO0Scg7j14GIM4OPr3+cHxPz88m4UgVk04qmZEqhUwxSASxjWFEEmyEq1AKZmypgK9vc6oN3qp/8rFMK57e3nL234CmsgaLmh3ezFA4dQ4FGphc5yhRUQoiohmnEbiVMKBJR1FPVSO5yNc9EgXJwPApCG087OxpxMH6RA0OywzMNlrpmoJS77sCndFZnHptfIqkmp9bwSh727faMX//GOH0cF8Pb9BaUB0y5WSbbWQMgAIAfz5l0xl1Jk1QDbVQJBCxFkiNAgSC8ApX//Lu4aVaeaBkTUrgoETRD4OgK0yMgmkz7ABAQEjYSRbbfd6oH9vW4u/6GsCJ4qSDXUH/5RnXzu9Y1XY9h5k/bcCAg4O8gcoZ6K1HB1sgwqpRN7De/72ToGRy02vA+fQwD/0jami6BSK2BqgOdUw0IrNFAnRBWEpYZyKQTXJnFrTcqAB4RUBXmvSqXI3quliCQ8aGuOyaPv3fkLroyfvDOgBserY+ByNXntFh3fDjqg0z1dZklV4M/RX9TRBkHLFalaGLnh5vVLovFj5z99/UW9nqUKnZBADeQEQVcFLSxU1IA61+72wPeDzikYdBD6asiVI3i5ggZCVQ3o+TRV0EDkUYMhEISvYBgokyBIT6GbII0kS/QQcsGFVTbPEgQA+cLCkCLwTZo4iVKSpUkQQxcarBJKA0EzUKISwvITQ5csWaaKZaZUVTES5ZNnqFiv3DKuEqmEpQb+WoV+rtDyEfwtu2QoLFXI+AmWq4TPFVls3TKqBYIMCbg/0W72sRVo0UIMDQjLQCGVkGUTrn6bWvk2AoL1Ovxfv4aTYZHdrYL7l9k9TNGruKhqZM/T1IA2iMh2dXyFsiLIsBAtmZmAMXRLdaI1CN4M6wDhv3KL9aSSOKUVIVMpxF1jr1Vk780LAD3rTEDkUYNIKfD8yGzwwC19NKBR2vILgnBNZkddOjRkZM+6Jq+aVCSu208rIGKnSXxKiFa+4Tn0aYApc6QDwxoI/6FIZnp4HoTcrYJb+7Jb+joKIO+xpgjUMAuGy++njKxQqc6G/7yQEyIkTBtVwnloJBWEvUtmYkVaVaVOQoOVK3Rssc6AWfdYT5bZjvifKQxo4CGiv95oQhlOFQEHsLS0Ev9iZ3Nz3ckvdxBE5yBMzKaJZ3gQA4oehAeBB5RXhFeEVwS1yPwDNX06YQXmnr8AAAAASUVORK5CYII=",
          health: 600,
          dmg: 30,
          pDmg: 5,
          id: 8,
          scale: 52,
          spritePadding: -23,
          holdOffset: 8,
          indx: .5,
          placeOffset: -5
      }, {
          age: 9,
          group: Kl[2],
          name: "spinning spikes",
          desc: "damages enemies when they touch them",
          req: ["wood", 30, "stone", 20],
          health: 500,
          uF: [],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAABB9JREFUeF7tm89rE0EUx2cT20aEpCoFBYN48Bb0qPQg7TX9gS3+Af4ntv+Jf4C00h+5VjwEPVZy8yASQaGoTUBMrUnkbTJxdjK/Z5xJzSzkkt2dmfeZ75v39s1uguKREkgihwGBCGKohAgigsguClERURETooi1tc2nrIi1v7/zPEQkC+Ya1erjLYSSZ1mj+9u12sutqQIBxlarG33S6FptN9jEBOuYhoCBhIIRBMTq6pOlXq97xHaBMO4RBARPDSFV4R0EDaFcLqf2N5vNjEB8u0hwEIuLiymAer0+PSBWVjaO+n20hC2uVCqoWCyOAISE4U0R9AIJAAAEeTQaDdRut0d/5XL55YODF6985BXeQLDWhlarlRqOVVEqlYKtFV5AyKKEbMZ9LJxKIEDW/X53lA6Tfi4zIsT5JEEjdzo83F1WGYMSCFY6rNK4yjXXSoMs+1tLeSgqzY6uUVWTVu+2EofR3b3dTX+i4+tpDr19d0nLYNbFOoutNxAqAGhj3hzPWClFVQ3QrxYIlovghAgbQecCIP2H98+tZpcFRNavDgRDENk6AqTIOE2m8wAXEDBBGgbZL4Rg6BsfOi6B79FWhEgVtBqqj35ZKYG+ufZ6NvOXy/TcCQiYHZwc4ZHK1HBjoYAuz+Uzhn1vn6PTNh/e+495BD98QL+QhJFqgHO6bmHkGngQsgjCU0NhLo9uLhSEShEBoVVBN2TiFpYgWDXHwbAe3PuNrs/3xoydL86iq8UZJXf5fNJBnbPxMEurItuYeVHHyDVkquCp4c6tK0oQ8EUfPv1gXs9ThYlLWC2Wf0GwVcECoaMG3P7Psy76ctIZg8EGYa4GK9cQqYIFQlcNIlWwQNiowRGIrCp40cIlCDqnMF0gSalZrRHQEF1wCQECITu3cKSI7CYNNDp1rsHetmODYCVQshDCyycmbrHkJVVTFT55aoBZ5j1yq2SVWCU8NYhrFeZrhdFiKd6yG5jCU4VKPsHLKqFdWYptGkaNQNAuAWV5eOgid6tkhRgWEF4ChVVCh02ofruqfDsBwXsc/q8fw2m3IHerQBGkKmSP4rKoQZ5nqQFvENH9muQV2oqg3UJWMnMBY+JKdbIahGiGTYCIH7nletJZOJUVoRIp5EPj1yrIe20B4Lb+CQgbNciUAucvzAYPbOljgy7Sll+S5LdVdtSVXUNF9rxrbNWkI3HTcXoBkWaa1KuEuPIN5/CrAa6SIxMY3kDEF0WI6RHlIPRuFWztq27pmyiAvsebInDHPBgh359yUqHSnY34eqHARWiYPqJEcNcYRBD+LpmLirSuSoO4Bm+tMEmLTQzm3eN9sSQHEj9TGNLIuoh5vdGFMoIqAgxYX99Mv9jZ29sJ8uUOhhgchIvZdNFGBDGkGEFEEFmHioqIioiKYAaZP321OmHR4N2KAAAAAElFTkSuQmCC",
          dmg: 45,
          turnSpeed: .0015,
          scale: 52,
          id: 9,
          spritePadding: -23,
          holdOffset: 8,
          indx: .5,
          placeOffset: -5
      }, {
          group: Kl[3],
          name: "windmill",
          desc: "generates gold over time",
          req: ["wood", 50, "stone", 10],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAAudJREFUeF7tm79v00AUx5+TwFaxgVQGJsaO7YgSicktUYuYUP+D/hFN/oj+B4gJkSgkniolYmzHjEwMIMGG2CCJq3Ps5OzcD5/vXRw5z1Imn+/H577v3r13Fw/oiQh4xGFJgEDESiAQBCK9KJAiSBElKaLdftsp4qEGg8+FvjNta2um4fsXoWnnWPkg6G2lj1tphA2IQMQy4EE8OVDz//N3LZ5KK4KBuHzTEFrKhy8zIBAAQCBifRAIApFeKkgRVVeEaP9g4jUSvbh2o043VLJNVBEQDEitVm8Nh58mRXaoum+cgPD98w6Ady1rvCiIZX1hNwj66PEHOojT04txGEJTNQN2IAA8DyajUa+lm2WT96ggREp4+WIO7Bd8fbzqlwkI/9U/+Pa9Hv3SD64y0ECcnb1rLhbzMd9ZNojVYmcBQlQHdmSKBiK7MPIQok4LQNxN5/Dz1zLAOnzmwclRfWOLraoHEwYKiCyExBx4dfAgTGw3C0JkJhiu1QmIbOezirABIarLOQiWXpvNQqkbNBlQ2WUbDa+rSvspFeEShEg1NsrRgd5JEDIIMu+gG2Se92ggdOk1WWf4bBMro4Mgg2HbPioIWXpNNSM3H/+vXueFIIJx9f5RnolPleFD+lJBsH3C/XSBAuL4qBbtM0yenQHRv53Bj9/rjLSNIp4/9eD8tTjhK4NDIGIyOwOCTIPTaiUXS5OFKilbOfdZBILsG92iWTRAU/URzX1iglBtrFxAYO3tLAhssLr6rEDoKk/e65IyNsFUnpDeeRheFMTeJmYim8/ciNnLVF0eE7HJYssiUswDH5RU3RrE5sHO3qXzExh0wMOtrHTkx8EQHfgkr01OunjPheEmZZ4QdY0QNULXAjJUstcL6VYdAJiYhktz4OfKuWmI9hgEIqZCIAhEOhYhRXCKUEW2e3MXO294H+Ux6P8aS1yVA0F/ZTKxgxLLbm1DVeIYczVNIGJMBIJApC2GFEGKSCviAbuwhmEKe216AAAAAElFTkSuQmCC",
          health: 400,
          stop: true,
          pps: 1,
          uF: [],
          turnSpeed: .0016,
          spritePadding: 25,
          iconLineMult: 12,
          indx: 2,
          scale: 45,
          holdOffset: 20,
          placeOffset: 5
      }, {
          age: 5,
          pre: 1,
          group: Kl[3],
          name: "faster windmill",
          uF: [],
          stop: true,
          desc: "generates more gold over time",
          req: ["wood", 60, "stone", 20],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAAudJREFUeF7tm79v00AUx5+TwFaxgVQGJsaO7YgSicktUYuYUP+D/hFN/oj+B4gJkSgkniolYmzHjEwMIMGG2CCJq3Ps5OzcD5/vXRw5z1Imn+/H577v3r13Fw/oiQh4xGFJgEDESiAQBCK9KJAiSBElKaLdftsp4qEGg8+FvjNta2um4fsXoWnnWPkg6G2lj1tphA2IQMQy4EE8OVDz//N3LZ5KK4KBuHzTEFrKhy8zIBAAQCBifRAIApFeKkgRVVeEaP9g4jUSvbh2o043VLJNVBEQDEitVm8Nh58mRXaoum+cgPD98w6Ady1rvCiIZX1hNwj66PEHOojT04txGEJTNQN2IAA8DyajUa+lm2WT96ggREp4+WIO7Bd8fbzqlwkI/9U/+Pa9Hv3SD64y0ECcnb1rLhbzMd9ZNojVYmcBQlQHdmSKBiK7MPIQok4LQNxN5/Dz1zLAOnzmwclRfWOLraoHEwYKiCyExBx4dfAgTGw3C0JkJhiu1QmIbOezirABIarLOQiWXpvNQqkbNBlQ2WUbDa+rSvspFeEShEg1NsrRgd5JEDIIMu+gG2Se92ggdOk1WWf4bBMro4Mgg2HbPioIWXpNNSM3H/+vXueFIIJx9f5RnolPleFD+lJBsH3C/XSBAuL4qBbtM0yenQHRv53Bj9/rjLSNIp4/9eD8tTjhK4NDIGIyOwOCTIPTaiUXS5OFKilbOfdZBILsG92iWTRAU/URzX1iglBtrFxAYO3tLAhssLr6rEDoKk/e65IyNsFUnpDeeRheFMTeJmYim8/ciNnLVF0eE7HJYssiUswDH5RU3RrE5sHO3qXzExh0wMOtrHTkx8EQHfgkr01OunjPheEmZZ4QdY0QNULXAjJUstcL6VYdAJiYhktz4OfKuWmI9hgEIqZCIAhEOhYhRXCKUEW2e3MXO294H+Ux6P8aS1yVA0F/ZTKxgxLLbm1DVeIYczVNIGJMBIJApC2GFEGKSCviAbuwhmEKe216AAAAAElFTkSuQmCC",
          health: 500,
          pps: 1.5,
          turnSpeed: .0025,
          spritePadding: 25,
          iconLineMult: 12,
          index: 2,
          scale: 47,
          holdOffset: 20,
          placeOffset: 5
      }, {
          age: 8,
          group: Kl[3],
          name: "power mill",
          uF: [],
          stop: true,
          desc: "generates more gold over time",
          req: ["wood", 100, "stone", 50],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAAudJREFUeF7tm79v00AUx5+TwFaxgVQGJsaO7YgSicktUYuYUP+D/hFN/oj+B4gJkSgkniolYmzHjEwMIMGG2CCJq3Ps5OzcD5/vXRw5z1Imn+/H577v3r13Fw/oiQh4xGFJgEDESiAQBCK9KJAiSBElKaLdftsp4qEGg8+FvjNta2um4fsXoWnnWPkg6G2lj1tphA2IQMQy4EE8OVDz//N3LZ5KK4KBuHzTEFrKhy8zIBAAQCBifRAIApFeKkgRVVeEaP9g4jUSvbh2o043VLJNVBEQDEitVm8Nh58mRXaoum+cgPD98w6Ady1rvCiIZX1hNwj66PEHOojT04txGEJTNQN2IAA8DyajUa+lm2WT96ggREp4+WIO7Bd8fbzqlwkI/9U/+Pa9Hv3SD64y0ECcnb1rLhbzMd9ZNojVYmcBQlQHdmSKBiK7MPIQok4LQNxN5/Dz1zLAOnzmwclRfWOLraoHEwYKiCyExBx4dfAgTGw3C0JkJhiu1QmIbOezirABIarLOQiWXpvNQqkbNBlQ2WUbDa+rSvspFeEShEg1NsrRgd5JEDIIMu+gG2Se92ggdOk1WWf4bBMro4Mgg2HbPioIWXpNNSM3H/+vXueFIIJx9f5RnolPleFD+lJBsH3C/XSBAuL4qBbtM0yenQHRv53Bj9/rjLSNIp4/9eD8tTjhK4NDIGIyOwOCTIPTaiUXS5OFKilbOfdZBILsG92iWTRAU/URzX1iglBtrFxAYO3tLAhssLr6rEDoKk/e65IyNsFUnpDeeRheFMTeJmYim8/ciNnLVF0eE7HJYssiUswDH5RU3RrE5sHO3qXzExh0wMOtrHTkx8EQHfgkr01OunjPheEmZZ4QdY0QNULXAjJUstcL6VYdAJiYhktz4OfKuWmI9hgEIqZCIAhEOhYhRXCKUEW2e3MXO294H+Ux6P8aS1yVA0F/ZTKxgxLLbm1DVeIYczVNIGJMBIJApC2GFEGKSCviAbuwhmEKe216AAAAAElFTkSuQmCC",
          health: 800,
          pps: 2,
          turnSpeed: .005,
          spritePadding: 25,
          iconLineMult: 12,
          indx: 2,
          scale: 47,
          holdOffset: 20,
          placeOffset: 5
      }, {
          age: 5,
          group: Kl[4],
          type: 2,
          uF: [],
          name: "mine",
          desc: "allows you to mine stone",
          req: ["wood", 20, "stone", 100],
          iconLineMult: 12,
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAABypJREFUeF7tml1MU2cYx/98FwoojK8WRapeiMigbBoj02r8QA5zybLIYozbjVmW7XK7dRfb4tV2uZtlu8FEM8yyZMpBJToZSjRurWYi3iDIoOXDSAIUyvfyf9dD2nIOAXpK2+S8N1zQc/o+v/6fj/d5nwQYSxBIMDj8T8AA4VeCAcIAERwUDEUYijAUoZooDdcwXCO2XCMRQIq/npkBsBCtAi9arkEAZsD0VnW1/UJ2drbt7t2284DvEQBvNIBEA4QJMFkBHJCkukuBCpDllo+BxfvA9ACAaQCLG6WQjQSRBCATSKuRJKl5JQNlWX4XmL4PYBzA/EbA2AgQKYD5DWCuSpKkltUa5fV6+9va2j4Bkl2AdyTSQCIJgnHABKRX2u2VFy0Wy2E1CNPT01hcXITJZFJlNDjo+cPpdH4GzPQBmIqUu0QKRCqQXgjM75Wk+l+1VJCXl4eioiLx78HBQbx69UpTMLLc/D6Q9BcwNQyAGUbXpTeIpWxQVVX5jdVqfUdtt1TA9u3bkZ+fj6Qkhg5gfn4ew8PD6OnpQUKC+ra8Xm9fW9ufHwG+vwFM6pld9AKRCGTlALMVdnvl1xaL9aAagIWFBezevRvZ2dkCQKjBBEQgY2NjePbsGRITyXX58gM5B6R0AuOjegAJFwSfTwNMFput9IuysrLP1TY+MzODbdu2CQWYzWbNX1x5lkAmJycxNDSEgYGBJdWEvrurq+uHnp7e7wDfYLjpNhwQzAa5wFylJEk3tRx206ZN2LJlCzIzM8UvrCX70OcVdXi9XnR1dYFq0lAHs8t5IPkx4H0NYHY9wWO9INKA1Pckqb5J60spfwLgXzWJ09DZ2VlMTU0JOMwaKSkpqqDm5uZAIH19fRgfZ2mhvmS5+UNg5ncAvrXCWA+IBCAzT5KOM3ovW9z0rl27kJOTg+Tk5CDDaDx/WQJgHOjt7cXZs2fFO65cuYLS0lKhnNTU1GXw+CzfPTo6KhRCaGpLllsLgQnWHWuqStcJIsMiSbUsg4NWbm4uiouLRRwIVIECgDUDMwMD4smTJ1UNaWxshNVqRUFBwRKQQHciSKqDseP1a3pC8JLlm8XApCdqIMrLy5GVlbUEQDGem+aGVzJeS8YrQSEQuklnZ2fQ41EHYbfbkZ6eLjal+PTIyAgqKipErAhnuVwuoSQWYFSbUnswvvB/gStmQFAJBFBTUxOO7ZrPdnR0CCB0l5gHweh+7NixiIBobW0VNUnMg6D1PDccPKhaXIYNp729fel8EtOKoKVMcfv27QvbaLUXPHz4EMxOXDEPYmJiQpTT4QbJUBD9/f0i/rDWiAsQrBeY52tra3VVxY0bNwTctLS0+ADB9Pn06VOcPn1aVxBXr17Fnj17RMUaF4pg8dTd3Y36+npdQVy/fh07d+6MjzqClrPqc7vdOHLkiK4g7ty5I0p4pXyP+WDJoopl9f79+3UF8eDBA5ExlLNHzIOg9TwH8OCkZ+ZwOp0iY8QVCP5aDJrV1dW6qIIQGCSV80xcBEtukgGTpfaJEyd0AcHSeuvWrUFtu7hwDaUDxSZsuGn01q1bIkiGdrDiAgRlQBgsrlgR1tXVrUsZLS0tonOl1vWOSRC8p+DxWG3DTKcsu1lbNDQ0rApIU1MTduzYsdT0DXxIaezyQujFixdB74t6P4K70WrVKerw+Xyio3TmzJkVYVy+fFlUkGzohna9Y6xVl5kvSceH1KxhY7asrEyzeUs5M4ieOnVKFca1a9dEUMzIyFjW+FWat8+fP18qs0NfIsutBcAE7w4j3rzld5v87fxftH5a9i9LSkqC+piKMmiQx+PB0aNHgx6/ffu26DWEBkV+nq7FWMPut9aS5eYGfzufsxVrWuvpYitfoFzwVDkcjp/MZrNqY1K54FF6jYrU6efsW1AdPLKzPti8efOy5i8BrHTBw83IslwLJD+JxgWPAkO58iuy2Uq/1LryY03B9FdYWBgkefo7/8fFIKucIQiJ3W/2Hl6+fCna+mrLf+X3PeBj+z6sCZtwFBG4N+USuNzhOHTJbDaXqG1cr0tgj8fd7nI9+QpI+SdWLoFD7eX1dQaHxByOQ41aQPiL22w2cRYJHAugApgOte5H3W73vcePn1zwjwXoOnSmlyJCgXBQpACYf1uS6n/TilprHBT5AEh6BEwxW8X8oEigzYScDqS/WV1debGoyKLanGBtQQUo7bdQaB6P567L5foUmP7Xf7kbkVnMSCki0B5lmMzucDh+1MouaqqRZbnOf90f18NkobZxRigLSDuwivHCev944USkp+kC09+aCo8wP6ykWw6c1khSXWPg+2S55RyADsDnXs+MQzh72wjXUNufMnS29/Bhx89jY2PdTqfr20hkg9XCiRYIZX8EwmqJ5wKO/EQkEK4GRrRBrGaPG/IZA4QfswHCABHscYYiDEUYilDNQoZrGK5huIaqa/wH4HLecO4SZnEAAAAASUVORK5CYII=",
          scale: 65,
          indx: .5,
          holdOffset: 20,
          placeOffset: 0
      }, {
          age: 5,
          group: Kl[11],
          type: 0,
          uF: [],
          name: "sapling",
          desc: "allows you to farm wood",
          req: ["wood", 150],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAACIdJREFUeF7tm/tTlNcZx7/v7rIXFlBQQFgQUINCYomYiumEoiZaONDOrDNtxhr1lzbJ9Mf+If2lM51O219i0smkTtyZBs6SpiYSTb3ULAlaryRCXITlKruwN/bSOXt7L7wL++4F0ul7ZhyX9ZzzPs/nPM9znud5kYM6YgQ4lUOcgAoiYQkqCBWEOCioFqFahGoRshel6hqqa3y/XIMDDN0AwkDgEwDRzUrwNtk1THWEdD9hylM6uBPwxT5vxthEECYLId1OodKUDtYBvon/JxB6QqwBOYUptRkABDcaxmZYhL6xsfn3ra3Pvymn7NTU1CWH4xrZaBgbDYID9K8T0vv+WidO6cApIPjBRgbPjQTBAUUvEdJ3UwihqnUGkUgUs/erRGwo7T8ErNzaKBgbCMLYQEjPmNQSjp7VxL767HxklZFQam8C/KvWFCJ+5AKC5QDNgKYCgBaIGuMCRpOf2d7sjwnQaAnpOS9VoPMUB4NJG/s66Avj8/dXpxGU2s8CEUbJB4D9HQU4P8CF4/uxzywPicwDgYfZWlAuILSEWEPZns4haxhl5eyC4Id7IYCbtjiYbAalNl0civKRC4iMAp+cSK3HvKhtLJOV9umYG3c/LVasCaUDbwDBvypemFiQCwgARW2E9H2l5OGWtjnsa68Cx8k/OhqN4r5jGhNfb1OyLSgdaAOCI4oWCSbnCALlhFjnhQ9vObIMnZ43b62OA9OZAxf7vnSrIfZzcoRD8SCp1cWDJhvRKOB5FkAoGEY0UX6EVvj4wb6/d9ks0plSG4tVC5sFYlWGeOycFhptZnzZ6T8YmcX8lBcvn9iZ1kqkyjF40luGUpsewMpmgeAIsYruvR/9IorikqJ15WGn/uDrGbzS0xCbe9U+jr1t2zOC4V1awb/+JoZNqY2ZVNbVa2ZHt6ZahrcIIX9MTtl/wo/qupJ1QUyOe7D/cLVo3u3rLtQ0lK671uVcwu1/JG7rWOVqfwvw/2ndhWtMyAOIohcJ6RtOPmPr7kkc/HF9Kg4w85947MbinA+RxHmt+EM48XqzrFgff/AQeiO7BQENx2HLNiMsTWUiS3F87sT86I7Uekr7DwIrjk0GUbqdkNdmUsGP8+L4uVJoNHHGkXAUVXXiwKZU4GnncirusHT8k3c80Eb5K5bSf1YCnlml+wrn58EisCpgCjNGFgtuXPoOfWf2ZSXnR+fv4/BrLJDGl8tloPko3fMCwmLZ9WFbW1tfUtP2viAqqvgT+270Gdo7a7MC4bjyFDv3bE2tnXd54RhgF0R8OJ1PHCMjt17OtWzPFQSrN94mhPxBqOXBnwZRXsmDWHYH0bCXV0YJkfEHz2Au4xVfmPHiy4/4n9lelNK3gQALlpt1axj2EEIeCRWrfn4GLxzaIQpuOYF4uAhzKX8ds+B75+YUXP+pFPGklD4HBEaVQM5TjOAbr6lAqZvH8TcqU4Ey6dO1u9a/EtdS4Om3HugTVWosALOA+d4MtCGWTPKD0sF6wCfqg2YKJlvXKCLEuqqvKE2mWKC8P+xCZ29TpvLIzrvS/xj72qtFqblcUhV3k+wyzGxAaAHDm9K4IC2rGYSxB/P44dG6nCAkF//7Myca91aIYLB65MZFcdmeiBd/UVqOZwHC2EVIz2VpXNjfUSNSWJpC50rji8FxNP+gUgSC7Xn7xqRMvLAfAfxDSp6pEMTquKCrHEdnT5OoehQKwO79b+7NobO3UYlcqblXBsawq2VbqpMl3YQVYFfsjxGaidcsyaE0XigBUUyIdVlOG82WKXScqI4VW3JtBmYdzKeH+r/B2d+2ZwTk/O8c6OrdheJSffo9PUFcp25EvfJXM6U2doezFt+6QwkIPaDvJaT3YrpdI5wPHT/ToazCKFtFTj3x4IVD4kIr3V53brqwo371bcNuDPe8H9f63SiKpG/eUDpwEggOZJpoKQHBZOYAcxUQOikNlkKF0lmIbzmE+j3yLTopkCejbpjM8eKLjZhVrWMBbB6l9DeA7iKwPK0kwVIKQijvFkB/nJDeC+lOldP7cex0Scq02WlWWcQF2PDVSYTDEbzUZRFtMz2xnMpHGITLF+YQXtqS1sQpHfg5EGRv1BfX9QOZCbmAyMhC2HuLZBuOKeRyxt3j1tAELA1lKDLEr7+VYBgTY+4YENfEErQavnUn15Hig2J2FiBlkSuIdS2k42Q41qdMDqYUp+FE2adwE2Y1rGIQtvs8iwHc+FCaL+RmAYUEkbAQ42lCet5NPmjPKx40NpdnY62pNWMPFzB6lQ+clNrPAH7Wus+6yCo0CACG3YQQvvgxLuDVU+l7kaFEF1sn6GILhWRF1qcXnIgu8QkbpfbdgP/bnOhKFufTNZJblxBi9Qifc+SMBroi3ufZvzEA086l1MuclqPeWK9TOo/FjqH3xAdPqY2Zx9L3HYTmwIHDl2pqao4kBU32J1iw9HtDeHR7BtN3xWV0cm7N/jk0tVTAZI4nZwuzPnz5d74Mn5ycvDw8fP3VxHvQvLEohEUw9+gmhNiTUtYfXEDDc+V4dGcWrjvbMxLe8uI8mvZVgMUHp4OPMZTSHiAwmNEmCiYVCERxDSE/eapAjrRTl32LMJv4/IHSj2sB72Q+9hbuUSAQMBJizSjHj7fidXpCuq9lohylNhMA9qsAeR2FArHqDZhQ6rifj5wGvC5B30ADmGoPHGh7VxhfpNrm+kYrHb1CgQBg/BUhPX+WABgaHv7qHOBn7bR0v8egBUw1XV2dX5jN5p3C9ZTafw34WdMl76OAIPQthPTeZRJTOvBLIEgBuBUkQUy2EsBoJaTnncQ+rUDwXt4pFPi/MpkAQxcQYL6vBIBUTwakDDB0AIGrALz/ayAKIW/B9iygaxRM5oJsrIJIYFVBqCDEHqZahGoRqkXI3jqqa6iuobqG6hprpaT/Bagy/2FMRPJUAAAAAElFTkSuQmCC",
          iconLineMult: 12,
          colDiv: .5,
          scale: 110,
          indx: .5,
          holdOffset: 50,
          placeOffset: -15
      }, {
          age: 4,
          group: Kl[5],
          name: "pit trap",
          uF: [],
          desc: "pit that traps enemies if they walk over it",
          req: ["wood", 30, "stone", 30],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAA4hJREFUeF7tms1r1EAYxp8EldL6WT+qV70UFapUQUR7zqaHNgVBD4KgN08q/hfqyaMeBEHxkvWwk9pjFRF00YKKF8+yftSvttRmSWR3szUbJp+T2Wztu7dlZybz/vK8z8y+Mwro0ySgEIcWAQLhKYFAEIhOUyBFkCJIEdyFklKjV1JjfHxqv207O2ZmytUi9zSFKkLXjT8ANnkAaoyZe4uCUQgIXTfcqIAZM7s+r64/MA5CG1C3YXQNRBiA/r6WOJaW+VPpFhDpIHTduA3gMi8VtFMrUNXWL44DTD9r20VgjVdwr1IxL8j0D2kgdN0oA5jgTV4fW4mMic3ygbiu+8SyypoMIFJA6PrUAuAOZIGw6hEhMAB8Z8wczBtGriCijDBOBWGBhamj0d51l/ssy2oswcKfXEDIABCMLApIHoYqBELTjDOqike81zF6sI6hXY7wm/IPUPuqovp+A/+/guKer1TK97M+MBMITZu4oqrqLd5DTx6xsX1r5H6po9vch1ZgI8P1xDH8+KXg+ZuN3Pau61y3rMc3Eg/mNcwEIiwV0vpAUO6i/VeNNsPONBcQeQXQDkR0vCyeIQwizaQXlhTMvuJLOijlsWM2NvcnTzG/unoWxJd5FS/f8k0uLpePH65j92C86fY8iKhlLw6C//c45fUsiLwABGGFASEQHikCQSA6k4YUQYogRXBXXUoNSg1KDUqNBgHaWXo6IBAEotMS1pwiVstm4ecTaf6Fh3oD7zk9W5ipfVNRfZetMDN6qI6hnf9BYcb/2n8vKnhaTVaqOz1qY8vAGirVRS1pYdqPK9rEVaOC4wbHKyQ10pTT4gIQBVBEOf8qgJu8N35ixMbgtuSSznLAM/9TwYu50BS7xpjJPXyKcudM5fz2gJpmnFVVPOA94OhwHfv2xJtcmqXj02cVr72TsWA/x8G56WnzYZrx/G2FQLQHWveHwEH6MoDIPgVvx5CLIjhAFgH082Sa1BAjACwxZnIvoWRNi0Y/KSCaS6puMAClLDAiIFiMmbpIwGF9pYH45x+TdwDlIm8CSS+TAe5dxsqXZACQmhpcFYRcMl031wvTGKq/bZbdoYhipKdGGnWI7AxFIEg1yyQTK5WMFUVBc4vourAty+RfsEwymGCbQhThn3OpNHmg8d2yyh8FYxHqXjgIodnn2JlAeDAJBIHozCtSBCmCFMFdayg1KDU6hfEXXvzCUuiEamMAAAAASUVORK5CYII=",
          trap: !0,
          ignoreCollision: !0,
          hideFromEnemy: !0,
          health: 500,
          colDiv: .2,
          scale: 50,
          indx: 0,
          holdOffset: 20,
          placeOffset: -5
      }, {
          age: 4,
          group: Kl[6],
          name: "boost pad",
          uF: [],
          desc: "provides boost when stepped on",
          req: ["stone", 20, "wood", 5],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAAZ5JREFUeF7tmktOAkEQhhvQI3AGiSzcsTLxDCYeqA9k4hlIWLFzIeIZOIL4CNhDMmMDXVPz6NKPJel59DffX12TnoHjtycwgMMPAUAEEwABiHJRwAiMwIjoQkk0iAbR0EfDez+01Il67z9T71dUI3Yglsvnj9ST9zluNrsZAcI5B4igYacgribTPu3/de239cvhP0BghHMYESwABCDK9RIjMAIjov0L0fgL0RiPv9xmI3r3O9rNmjbi4f59P7HHp0t1u24WRAGhIKCFYRLELhJ3t9uSBfPFhSomJkFUbWjCCnMgYjb8SxDHbNDCMGXEKRsKEKvXoVutR+JVxAyIFAgaK8yAOBeJqgLS5RQQllpsqQ11IpK9EZLaUI2HpHBmD6KuDVIrsgahhSCBkS0ITSTqRCRbENeTZveLzzVZ2YIQt4bKAwBhqY9QPuykwzECI9jXYF/jVLGgRlAjMqkRSWtaT4M6/YaqpzkmXRYQAVPrIJIeRyaDWvvyNpP5tXIbzezHt3Jr3Z4UEIE3IABRjh5GYARGRJcjokE0iEY0Gt/OdwVhhTbZ6QAAAABJRU5ErkJggg==",
          ignoreCollision: !0,
          boostSpeed: 1.5,
          health: 150,
          colDiv: .7,
          scale: 45,
          indx: 0,
          holdOffset: 20,
          placeOffset: -5
      }, {
          age: 7,
          group: Kl[7],
          doUpdate: !0,
          uF: [],
          name: "turret",
          desc: "defensive structure that shoots at enemies",
          req: ["wood", 200, "stone", 150],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAABBlJREFUeF7tmj1vE0EQhufsJBUyiBRUCRUSEhYUFKBIoKTMJUUs8X+S/BokBHKK+FImQiiCggIUlIIKuaIIAosqxD40ttfeG8/e3u7NWRHsSZYL3349+847++EIwjMkEAUOIwIBxFgJAUQAkTWFoIigiKAINlFWFhqbmzvtKKq/lE7PSfLmlXSdlabPEYhoR7LTaZoeHB0dtCTrVHVVrIgAAoIixlqjINbW1rwUfXp6Oin3T4TGfwsijlvnAHBfTacEiCiCd51O+5mXtCyFKjHLOG6ltF0JEKrOJGmL91u8Qg4CDkASRBTBSafT3pBUhhiION7ZA4h2TZ2TBDFtI91PkoM9CSAiIDgIS4sAl3+mXZQAQesc1S4DQwhE1hPu3e1D73cE3y9qExISIO4sD6BxI4Wv3+oZEUh4RmkQW1ut4zSFdb1n8fNL+PhlgQXR7XYBP6an0WjA6uoq4Dc++joCQTx+cAXJ26WZ4mVhlAJBjRGVgB98KAiJOFYgsC5UhaQyvEFsb79YHwz6x2qAt2+m8PTR1BSqBoHtvv+0CD9+6UPw9wtvEFQNGA76YwOxsrIC+NGfXq8HZ2dnRvHoipisKUiY+IaIFwiqhicPr2D51iAzgNnZGv1c1DR1b1AVcyBoiNRq9Y3Dw9cnrqHoBcKmBuwENTROAbbOojpQJdSIaTnalo8qnEFQNWCnaFjQjmEGaDabtnGzv3NZxtaejyqcQdB0yYUFBVE0HEykaJhQELMZxN00nUHYwuLiZw0+fF6YjKksBFWRDkNP01KmKQ6CmmQVIIqEo6tPlAJB1w7UJNEX1ArRyyC0QtQraHjQCZgrCJtEpdTAhYfNJwKIMbUAIoDIbsLmqgibWfqsJk2mSvch18osi6QxKcPU1xG2CRhmL8cD3lLpkwNBV3lVgCiymp0DiOwhrS2Fuuw4fZfYdDXrc8rtrAifTVcZryiyA6V7m7lsuobhQC5wqHFx23CfHWiRnSfXlmtYYB3OisBCVBVceHAddAkT7mCG8wYaFj5q8AZRVBXcAavyAW4fknfCXRS2jxpKgsiaJpfSsAE6Yz6bLy70sB660fJVQykQnCpMs2YKkyJQTBCuzXG+GgR36WvqvFIIDiJ7DJ9FkgeUg+qTLukkeJklrSTvoqfIrLu8I60E1bYQiNmbcJNnuAyavstfEbifT3J9EAEx8gv+bwFcynOFYc4+MhBKmyU3IO5SWL3nAiUv9Q59wnFTZYMvpgi9IdO/ZvR3MHTo7Rim2jwTVeWlIVSiCNVZbk9imxX773KhUEnWyBuABJAyCyU73NEblYQG1zgCSdP+Lv1Tibmj6X6ttnDic6FbdPD6e3MD4dO5eZYJIMa0A4gAIht4QRFBEUERbDIKoRFCI4RGCI28lWrwiDGdv3AZkWGMex2dAAAAAElFTkSuQmCC",
          health: 800,
          stop: true,
          projectile: 1,
          shootRange: 700,
          shootRate: 2200,
          scale: 43,
          index: 2,
          holdOffset: 20,
          placeOffset: -5
      }, {
          age: 7,
          group: Kl[8],
          name: "platform",
          uF: [],
          desc: "platform to shoot over walls and cross over water",
          req: ["wood", 20],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAAVtJREFUeF7tmkEOwVAURV9jQJiIHZiYGhoa64gFSOzAWsQGxAbMiKHYhYlVSEyU/PqhX59qI5o2jmH9tq/Hve/d1PeET0jAg8OdACCsEgABCLcpoAgUgSLUQYk1sAbWwBpJKTpzj/D90bUMsXy9XmV6tkyLDQBAWBkAQgEx6NdUl2z3ZwmC51fv1m12Z+f8NOtaTU963ap63+j1crWGKbzTrsSKmi9PDojppKEWPlucnONp1hkQ42E9dr3D8SKAEBFAWG0AAhBum0ARKAJFMD6NBsgR1gmAAIRINIqjCBSBIh5BAWtYFIAAhBufUQSKQBEf320SqAhUBCoC1WujYHwyPhmfjE9DgP8+rQ4AAQi2BYQaYH+Ekg9K3yy1efd3W4fUoV+Qg7nuoSrIM6tlAMJi+TmIIqvgm9oy77z95mZFPhcQ9tcBBCBco6IIFIEi1OGFNbAG1sAaScn2BpFWBnB82lh8AAAAAElFTkSuQmCC",
          ignoreCollision: !0,
          zIndex: 1,
          health: 300,
          scale: 43,
          indx: 0,
          holdOffset: 20,
          placeOffset: -5
      }, {
          age: 7,
          group: Kl[9],
          name: "healing pad",
          uF: [],
          desc: "standing on it will slowly heal you",
          req: ["wood", 30, "food", 10],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAAVJJREFUeF7tmkEKwjAQRVM9gOAlFFy460k8UA7kSbrrQtBLCB5AEXUQgqGdjjZp8LmUpkle3p8ETeX4PAlUcHgRAISYAAhAhEUBIzACI6IbJdEgGkTj+2h472clnUS99zfteAfViAeIpmmv2pfnfK6ut3NAOOcAIRomBbFab3La/9H36Xh4fwcIjHAOI8QCQJQKYnc5dxbZ/WJpKsLFGQEIWWdAACKMPEZgBEZEt0Gi8U/R6Ftt00kp0ih26JrUgQoQSu0x4lcE5D1EAxChUhiBEYUZoamJfVssP8x0aK8BPKkDlWbAGKE8dBENotG/I2giR43gf43QE4wo1QhN3i3PFGeEZZKaNoAgGoUXS43mlmeyRcMy2FRtkt6hSjUpSz+AEGqjg7CsTq42o928zTWhFP0OuoudYkC5+gCEkAcEIMIQYgRGYER0YyIaRINoRKNxB85lEmEa+oa0AAAAAElFTkSuQmCC",
          ignoreCollision: !0,
          healCol: 15,
          health: 400,
          colDiv: .7,
          scale: 45,
          indx: 0,
          holdOffset: 20,
          placeOffset: -5
      }, {
          age: 9,
          group: Kl[10],
          name: "spawn pad",
          uF: [],
          desc: "you will spawn here when you die but it will dissapear",
          req: ["wood", 100, "stone", 100],
          health: 400,
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAAiNJREFUeF7tmrtOwzAUhk9hQAqCpYEFtYKplRjYupR3YOZFmDPzIsy8A126MSC1E6gVC6QLiEgMIBRwqtQ9ceziJLb0d0wcX7585/jStAi/XwItcPgjABDCBIAAiNWkACNgBIxgJ0qEBkIDofH/0IiiaMunlWgURd+6/TXKESmI8fj+S7fyJssNBmfbAEFEACE0rBVEr3/apP1rbU8nD8trAAEjiGCEsAAgfAMRxy+0iF+1Emyne0xBsKtVNivkhRHz2SMlSWI0sCAIqNM90X7GeRD5DmqPKldQd5p2FkQRgP3ekPb6Q5ZJfHdDn4s5e68MiDcgVADkkXNAvATB2XB0cWUUGc+312vlVTCcM4JLjKYQMgIyDFUCdQpEknzQfPa0fJM77Q6F55dGJsiF3ycjepuOlpfb4QGF4aHbew05JDY1QR6lbAYXIk4Zke+MDRsyILIVXoGwZQOXLwBCUAEIgCDKJ0wYASM8NsJkb1G24pL3Hl6FRjo4W1Oodwsq+RTKhhWyDUWnV06tLFMLsOnKBTq24QoYJnsPeW+RVuvlwUza8aKjOhUQDkDG1lsQ3DF72TTJ3S8DwLXj7H+fOM7PvWL59EplR9EplOoZ56bPTfS38QxACIoAARCrAQUjmjbCRoKrqo5a1xFVDcJGvQAhKFYOwsbbqquOyr68rWsATbRj9C12Ex2sq02AEKQBAiBWgw5GwAgYwU5ECA2EBkKDDY0fJZh+YTa6MyMAAAAASUVORK5CYII=",
          ignoreCollision: !0,
          spawnPoint: !0,
          scale: 45,
          indx: 0,
          holdOffset: 20,
          placeOffset: -5
      }, {
          age: 7,
          group: Kl[12],
          name: "blocker",
          uF: [],
          desc: "blocks building in radius",
          req: ["wood", 30, "stone", 25],
          ignoreCollision: !0,
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAA05JREFUeF7tms9L3EAUxyeuXWqsFdrVg6BUKFjopWdPevCyelDw/1H/H8EedC89uKeevQgtCBYFD+1WUGsqq2tk4k47yc7vecmu5i2IsHnZ5H3y/b6ZN5mA4CchECCHRwIIoqsEBIEg0kUBFYGKQEUIB0q0BloDrYHWUM2iC60RKyvrC3Hc2YhjsqC8qYA0g6Cytbu73SyqBSgERL2+uklIsOGSVBCQ5t7ezqLLuTbn5AbCJ3l5AvFWo/F50yZB09hcQNTra7HuBt7WJkgYjiZ/UXSdhNP/v1u/dKeSRmMH/L7Bf1AFYe7DR22SfMD3b4fSeGgYYCBkVrBNXpa5GAqcVUBA5A2BwckTBhCIdE0Iw5BMz8xa2cA0+PTkmERRlAqHsIk3iGxNgLKCDkxWHb4wvEBkIaiUMN65I7PtNjkYCXU5Jsc//Y3IcbVKLirDwnhoZTiDENUFmRoohKU/l0lCR9WXWhgUwvv2TRL/5dVrKYzemuFePD1ApOuCDML89RWZurvtearb42+ET3r94rzn+7PhF+Tr6JgwHsoiICBsIciUwSshm7UpDNda4QRieXltn2+cRCB4O8iKAm8TFQR2vswmaVW42cMJhG6kMIHAkqMw6IfVBF0lFcGAsIc1CNpK39939tkNi9Rg8nR1CZuoSDYdHxqqLNq28NYgTGzBhj/Tp2wKRTXi8Kpwad2tQehswSclGgFMkxbFyUYaGutrDy8QtJWu1SaVuUHYxGTu0Wr9TLXwtqOHF4jpmXfJeoLu4wPDBAK9Pl3LOD358e9WBhKEa80whcCy5+1RKAibBstFFTYgnoQiXCDw8wyTRq2vILBYctVRZY9nPXzihKqrApxic3bQzS5L0XRRHtnVqUFqw136DJqT9cySCYNXRWkXZh5VgUt1iShw8VZRNEu5nC+qFfQ7m/5D17WqjvuuP2R/27lY8j9k86LHJ3l6LvSLHXY/QCDEO2Kg1THwL4FlxRPSKnlC8JpHyCRe+o0iqpohgsa2DtFjbPvQs9o69H80cd9JJy+obm+xTAo0SLHUXSjbuuvi08fzS56/TiEg2AVLv+HUTgH9iS5UEf1J0eyqCKLLCUEgiLRlUBGoCFSEcBhBa6A10BpoDdUc8wG9ozFhleVISQAAAABJRU5ErkJggg==",
          blocker: 300,
          health: 400,
          colDiv: .7,
          indx: 0,
          scale: 45,
          holdOffset: 20,
          placeOffset: -5
      }, {
          age: 7,
          group: Kl[13],
          name: "teleporter",
          uF: [],
          desc: "teleports you to a random point on the map",
          req: ["wood", 60, "stone", 60],
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAAAXNSR0IArs4c6QAAAzVJREFUeF7tmkFP2zAUxx16YMom7bBsN9B2otO+Age4Fg5F2vcBvs8keoBe6YGvMFFOTHDbssOkLdoOJZPbesRuHPs9v7gTeZUQqmon9i///3vPjhPBnzmBhDksCDCIpRIYBIPQgwIrghXBiqhNlGwNtgZbg63RVEVHjRGHhx/3ynJ2XJZir3FQiZgkSe/0/PzTJNYSIAqIwWB4IkRyjJlUkojJxcXZPqYvpE9rIEImb59AeToej04gE/Rt2wqIweCodA3gVfZapOnz+V9R/Jo3l/+/599cXcV4fEY+bvILNkHY6X9wTrLa4Gb62dqeGgYZCJsVoJO3zbweCp1VSEC0DUHBaRMGEQg9JqRpKra234Fs4Nv4/u5WFEWhNaewSTAIMyZQWcEFxlRHKIwgECaENpVggqFWBhpEXVyIpQZ7zMAHzwAQelyAQtj9uSuyWaY96JvNqbh+NnW5Qu9jpFisRUhAQCDUATBnDgVSjRdRQRwcHF1WF06+IIY/hqCnPXo58mqvB06cPVCKwGQKKARFwAcGRQYBg5BL6YeH2aUaqI8asBCwMDY2evvQJTwYBNQW73/3xc6fvpfEbY3yXi6uXlw1XqOqCszSHQwCaotQNfiqItQeQSDkUjrL3lifFIUa1MVdqsjzr9oSHpo9gkBsbb+d7yfYPlRq8FGF3Mu4v/vybyidBSEJhNQTQYpwZQxWxFKgnQHhCpY+5bRvXnWV3WsNlnISsezhqjCjp09oQUWhCpcazEAZpaDiErtiZmh1KbtiA6fLEqYa5HdoDSH7gNOn7GTuTrnihGIIheEDgcIWaBALGI87VL4gZD+fsttVTq9s5FR2qTBqIAPhkz3MwdcBgQKgskUgiNU33BBl+NYPTe1WX/jgdqeCQJj2kN87uZ2vnhQmg7ShBmxsUGNBZQ1zIjFf9FC/2CEGUX8ihjpm/PcvgetqC0WaCkabEIKDZZ3XO39QpAoFcnRokW0Wx4ee1NGhx2yCP0lnzyr4OsGVqUiyhusm5tLd1V7/vb3JV+8TBYS6YecPnMIUsJ7WURWxnin63ZVBLDkxCAahW4YVwYpgRdSmEbYGW4OtwdZoqjH/Av5ExVLxSFbJAAAAAElFTkSuQmCC",
          ignoreCollision: !0,
          teleport: !0,
          health: 200,
          colDiv: .7,
          indx: 0,
          scale: 45,
          holdOffset: 20,
          placeOffset: -5
      }];
for (let e = 0; e < ql.length; ++e) ql[e].id = e, ql[e].pre && (ql[e].pre = e - ql[e].pre);
const x = {
    groups: Kl,
    projectiles: Xl,
    weapons: Jl,
    list: ql
},
      $l = [],
      Zl = {
          words: $l
      };
var ec = {},
    tc = [],
    nc = null,
    ic = {
        object: ec,
        array: tc,
        regex: nc
    };
const sc = Zl.words;
const oc = ic.array;
class rc {
    constructor(e = {}) {
        Object.assign(this, {
            list: e.emptyList && [] || Array.prototype.concat.apply(sc, [oc, e.list || []]),
            exclude: e.exclude || [],
            splitRegex: e.splitRegex || /\b/,
            placeHolder: e.placeHolder || "*",
            regex: e.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
            replaceRegex: e.replaceRegex || /\w/g
        })
    }
    isProfane(n) {
        return this.list.filter(e => {
            const t = new RegExp(`\\b ${e.replace(/(\W)/g,"\\$1")}\\b`, "gi");
            return !this.exclude.includes(e.toLowerCase()) && t.test(n)
        }).length > 0 || !1;
        return false
    }
    replaceWord(e) {
        return e.replace(this.regex, "").replace(this.replaceRegex, this.placeHolder)
    }
    clean(e) {
        return e.split(this.splitRegex).map(e => this.isProfane(e) ? this.replaceWord(e) : e).join(this.splitRegex.exec(e)[0])
    }
    addWords() {
        let e = Array.from(arguments);
        this.list.push(...e), e.map(e => e.toLowerCase()).forEach(e => {
            this.exclude.includes(e) && this.exclude.splice(this.exclude.indexOf(e), 1)
        })
    }
    removeWords() {
        this.exclude.push(...Array.from(arguments).map(e => e.toLowerCase()))
    }
}
var ac = rc;
const lc = new ac,
      cc = [];
lc.addWords(...cc);
const dc = Math.abs,
      uc = Math.cos,
      fc = Math.sin,
      hc = Math.pow,
      pc = Math.sqrt;

function mc(e, t, p, m, u, g, y, x, w, n, i, f, s, o) {
    this.id = e, this.sid = t, this.tmpScore = 0, this.team = null, this.skinIndex = 0, this.tailIndex = 0, this.hitTime = 0, this.tails = {};
    for (var r = 0; r < i.length; ++r) i[r].price <= 0 && (this.tails[i[r].id] = 1);
    this.skins = {};
    for (var r = 0; r < n.length; ++r) n[r].price <= 0 && (this.skins[n[r].id] = 1);
    this.points = 0, this.dt = 0, this.hidden = !1, this.itemCounts = {}, this.isPlayer = !0, this.pps = 0, this.moveDir = void 0, this.skinRot = 0, this.lastPing = 0, this.iconIndex = 0, this.deaths = 0, this.skinColor = 0, this.spawn = function(e) {
        this.active = !0, this.alive = !0, this.lockMove = !1, this.lockDir = !1, this.minimapCounter = 0, this.chatCountdown = 0, this.shameCount = 0, this.shameTimer = 0, this.sentTo = {}, this.gathering = 0, this.autoGather = 0, this.animTime = 0, this.animSpeed = 0, this.mouseState = 0, this.buildIndex = -1, this.weaponIndex = 0, this.dmgOverTime = {}, this.noMovTimer = 0, this.maxXP = 300, this.deathCount = 0, this.XP = 0, this.age = 1, this.kills = 0, this.upgrAge = 2, this.upgradePoints = 0, this.x = 0, this.y = 0, this.zIndex = 0, this.xVel = 0, this.yVel = 0, this.slowMult = 1, this.dir = 0, this.dirPlus = 0, this.targetDir = 0, this.targetAngle = 0, this.maxHealth = 100, this.health2 = 0, this.samRP = 1, this.samRS = 1, this.pr = 1, this.sr = 1, this.hasSoldier = false, this.hasTank = false, this.health = this.maxHealth, this.scale = p.playerScale, this.speed = p.playerSpeed, this.resetMoveDir(), this.resetResources(e), this.items = [0, 3, 6, 10], this.weapons = [0], this.shootCount = 0, this.weaponXP = [], this.reloads = {}, this.timeSpentNearVolcano = 0
    }, this.resetMoveDir = function() {
        this.moveDir = void 0
    }, this.resetResources = function(t) {
        for (let e = 0; e < p.resourceTypes.length; ++e) this[p.resourceTypes[e]] = t ? 100 : 100
    }, this.addItem = function(t) {
        const n = w.list[t];
        if (n) {
            for (let e = 0; e < this.items.length; ++e)
                if (w.list[this.items[e]].group == n.group) return this.buildIndex == this.items[e] && (this.buildIndex = t), this.items[e] = t, !0;
            return this.items.push(t), !0
        }
        return !1
    }, this.setUserData = function(n) {
        if (n) {
            this.name = "NaN";
            let e = n.name + "";
            e = e.slice(0, p.maxNameLength), e = e.replace(/[^\w:\(\)\/? -]+/gim, " "), e = e.replace(/[^\x00-\x7F]/g, " "), e = e.trim();
            let t = !1;
            const i = e.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
            for (const s of lc.list)
                if (i.indexOf(s) != -1) {
                    t = !0;
                    break
                } e.length > 0 && !t && (this.name = e), this.skinColor = 0, p.skinColors[n.skin] && (this.skinColor = n.skin)
        }
    }, this.getData = function() {
        return [this.id, this.sid, this.name, m.fixTo(this.x, 2), m.fixTo(this.y, 2), m.fixTo(this.dir, 3), this.health, this.maxHealth, this.scale, this.skinColor]
    }, this.setData = function(e, t, n, i) {
        if (e[2] != t.name && t.name != undefined && !Ei.includes(e[1])) {
            b(`${t.name}[${t.sid}] has changed name to ${e[2]}`, "", "#e38b49")
        }
        this.id = e[0], this.sid = e[1], this.name = e[2], this.x = e[3], this.y = e[4], this.dir = e[5], this.bot = n ? true : false, this.health = e[6], this.maxHealth = e[7], this.scale = e[8], this.skinColor = e[9], this.pr = 1, this.sr = 1, this.tr = 1, this.hitProjs = 0, this.primary = undefined, this.secondary = undefined, this.shameCount = 0, this.primaryVar = 3, this.secondaryVar = 3, this.lastx = 0, this.tick = v, this.lasty = 0
    };
    let h = 0;
    this.update = function(i) {
        if (!this.alive) return;
        if ((m.getDistance(this.x, this.y, p.volcanoLocationX, p.volcanoLocationY) || 0) < p.volcanoAggressionRadius && (this.timeSpentNearVolcano += i, this.timeSpentNearVolcano >= 1e3 && (this.changeHealth(p.volcanoDamagePerSecond, null), f.send(this.id, "8", H(this.x), H(this.y), p.volcanoDamagePerSecond, -1), this.timeSpentNearVolcano %= 1e3)), this.shameTimer > 0 && (this.shameTimer -= i, this.shameTimer <= 0 && (this.shameTimer = 0, this.shameCount = 0)), h -= i, h <= 0) {
            const l = (this.skin && this.skin.healthRegen ? this.skin.healthRegen : 0) + (this.tail && this.tail.healthRegen ? this.tail.healthRegen : 0);
            l && this.changeHealth(l, this), this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer), this.dmgOverTime.time -= 1, this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)), this.healCol && this.changeHealth(this.healCol, this), h = 1e3
        }
        if (!this.alive) return;
        if (this.slowMult < 1 && (this.slowMult += 8e-4 * i, this.slowMult > 1 && (this.slowMult = 1)), this.noMovTimer += i, (this.xVel || this.yVel) && (this.noMovTimer = 0), this.lockMove) this.xVel = 0, this.yVel = 0;
        else {
            let e = (this.buildIndex >= 0 ? .5 : 1) * (w.weapons[this.weaponIndex].spdMult || 1) * (this.skin && this.skin.spdMult || 1) * (this.tail && this.tail.spdMult || 1) * (this.y <= p.snowBiomeTop ? this.skin && this.skin.coldM ? 1 : p.snowSpeed : 1) * this.slowMult;
            !this.zIndex && this.y >= p.mapScale / 2 - p.riverWidth / 2 && this.y <= p.mapScale / 2 + p.riverWidth / 2 && (this.skin && this.skin.watrImm ? (e *= .75, this.xVel += p.waterCurrent * .4 * i) : (e *= .33, this.xVel += p.waterCurrent * i));
            let t = this.moveDir != null ? uc(this.moveDir) : 0,
                n = this.moveDir != null ? fc(this.moveDir) : 0;
            const c = pc(t * t + n * n);
            c != 0 && (t /= c, n /= c), t && (this.xVel += t * this.speed * e * i), n && (this.yVel += n * this.speed * e * i)
        }
        this.zIndex = 0, this.lockMove = !1, this.healCol = 0;
        let n;
        const e = m.getDistance(0, 0, this.xVel * i, this.yVel * i),
              t = j(4, oe(1, H(e / 40))),
              s = 1 / t;
        let o = {};
        for (var r = 0; r < t; ++r) {
            this.xVel && (this.x += this.xVel * i * s), this.yVel && (this.y += this.yVel * i * s), n = g.getGridArrays(this.x, this.y, this.scale);
            for (let t = 0; t < n.length; ++t) {
                for (let e = 0; e < n[t].length && !(n[t][e].active && !o[n[t][e].sid] && g.checkCollision(this, n[t][e], s) && (o[n[t][e].sid] = !0, !this.alive)); ++e);
                if (!this.alive) break
            }
            if (!this.alive) break
        }
        for (var a = y.indexOf(this), r = a + 1; r < y.length; ++r) y[r] != this && y[r].alive && g.checkCollision(this, y[r]);
        if (this.xVel && (this.xVel *= hc(p.playerDecel, i), this.xVel <= .01 && this.xVel >= -.01 && (this.xVel = 0)), this.yVel && (this.yVel *= hc(p.playerDecel, i), this.yVel <= .01 && this.yVel >= -.01 && (this.yVel = 0)), this.x - this.scale < 0 ? this.x = this.scale : this.x + this.scale > p.mapScale && (this.x = p.mapScale - this.scale), this.y - this.scale < 0 ? this.y = this.scale : this.y + this.scale > p.mapScale && (this.y = p.mapScale - this.scale), this.buildIndex < 0) {
            if (this.reloads[this.weaponIndex] > 0) this.reloads[this.weaponIndex] -= i, this.gathering = this.mouseState;
            else if (this.gathering || this.autoGather) {
                let e = !0;
                if (w.weapons[this.weaponIndex].gather != null) this.gather(y);
                else if (w.weapons[this.weaponIndex].projectile != null && this.hasRes(w.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0)) {
                    this.useRes(w.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0), this.noMovTimer = 0;
                    var a = w.weapons[this.weaponIndex].projectile;
                    const d = this.scale * 2,
                          c = this.skin && this.skin.aMlt ? this.skin.aMlt : 1;
                    w.weapons[this.weaponIndex].rec && (this.xVel -= w.weapons[this.weaponIndex].rec * uc(this.dir), this.yVel -= w.weapons[this.weaponIndex].rec * fc(this.dir)), u.addProjectile(this.x + d * uc(this.dir), this.y + d * fc(this.dir), this.dir, w.projectiles[a].range * c, w.projectiles[a].speed * c, a, this, null, this.zIndex)
                } else e = !1;
                this.gathering = this.mouseState, e && (this.reloads[this.weaponIndex] = w.weapons[this.weaponIndex].speed * (this.skin && this.skin.atkSpd || 1))
            }
        }
    }, this.addWeaponXP = function(e) {
        this.weaponXP[this.weaponIndex] || (this.weaponXP[this.weaponIndex] = 0), this.weaponXP[this.weaponIndex] += e
    }, this.earnXP = function(e) {
        this.age < p.maxAge && (this.XP += e, this.XP >= this.maxXP ? (this.age < p.maxAge ? (this.age++, this.XP = 0, this.maxXP *= 1.2) : this.XP = this.maxXP, this.upgradePoints++, f.send(this.id, "U", this.upgradePoints, this.upgrAge), f.send(this.id, "T", this.XP, m.fixTo(this.maxXP, 1), this.age)) : f.send(this.id, "T", this.XP))
    }, this.changeHealth = function(e, t) {
        if (e > 0 && this.health >= this.maxHealth) return !1;
        e < 0 && this.skin && (e *= this.skin.dmgMult || 1), e < 0 && this.tail && (e *= this.tail.dmgMult || 1), e < 0 && (this.hitTime = Date.now()), this.health += e, this.health > this.maxHealth && (e -= this.health - this.maxHealth, this.health = this.maxHealth), this.health <= 0 && this.kill(t);
        for (let e = 0; e < y.length; ++e) this.sentTo[y[e].id] && f.send(y[e].id, "O", this.sid, this.health);
        return t && t.canSee(this) && !(t == this && e < 0) && f.send(t.id, "8", H(this.x), H(this.y), H(-e), 1), !0
    }, this.kill = function(e) {
        e && e.alive && (e.kills++, e.skin && e.skin.goldSteal ? s(e, H(this.points / 2)) : s(e, H(this.age * 100 * (e.skin && e.skin.kScrM ? e.skin.kScrM : 1))), f.send(e.id, "N", "kills", e.kills, 1)), this.alive = !1, f.send(this.id, "P"), o()
    }, this.addResource = function(e, t, n) {
        !n && t > 0 && this.addWeaponXP(t), e == 3 ? s(this, t, !0) : (this[p.resourceTypes[e]] += t, f.send(this.id, "N", p.resourceTypes[e], this[p.resourceTypes[e]], 1))
    }, this.changeItemCount = function(e, t) {
        this.itemCounts[e] = this.itemCounts[e] || 0, this.itemCounts[e] += t, f.send(this.id, "S", e, this.itemCounts[e])
    }, this.buildItem = function(t) {
        const e = this.scale + t.scale + (t.placeOffset || 0),
              n = this.x + e * uc(this.dir),
              i = this.y + e * fc(this.dir);
        if (this.canBuild(t) && !(t.consume && this.skin && this.skin.noEat) && (t.consume || g.checkItemLocation(n, i, t.scale, .6, t.id, !1, this))) {
            let e = !1;
            if (t.consume) {
                if (this.hitTime) {
                    const s = Date.now() - this.hitTime;
                    this.hitTime = 0, s <= 120 ? (this.shameCount++, this.shameCount >= 8 && (this.shameTimer = 3e4, this.shameCount = 0)) : (this.shameCount -= 2, this.shameCount <= 0 && (this.shameCount = 0))
                }
                this.shameTimer <= 0 && (e = t.consume(this))
            } else e = !0, t.group.limit && this.changeItemCount(t.group.id, 1), t.pps && (this.pps += t.pps), g.add(g.objects.length, n, i, this.dir, t.scale, t.type, t, !1, this);
            e && (this.useRes(t), this.buildIndex = -1)
        }
    }, this.hasRes = function(t, n) {
        for (let e = 0; e < t.req.length;) {
            if (this[t.req[e]] < H(t.req[e + 1] * (n || 1))) return !1;
            e += 2
        }
        return !0
    }, this.useRes = function(t, n) {
        if (!p.inSandbox)
            for (let e = 0; e < t.req.length;) this.addResource(p.resourceTypes.indexOf(t.req[e]), -H(t.req[e + 1] * (n || 1))), e += 2
    }, this.canBuild = function(e) {
        const t = _n ? e.group.sandboxLimit || oe(e.group.limit * 3, 99) : e.group.limit;
        return t && this.itemCounts[e.group.id] >= t ? !1 : _n ? !0 : this.hasRes(e)
    }, this.gather = function() {
        this.noMovTimer = 0, this.slowMult -= w.weapons[this.weaponIndex].hitSlow || .3, this.slowMult < 0 && (this.slowMult = 0);
        const e = p.fetchVariant(this),
              n = e.poison,
              i = e.val,
              t = {};
        let s, o, r, a;
        const l = g.getGridArrays(this.x, this.y, w.weapons[this.weaponIndex].range);
        for (let e = 0; e < l.length; ++e)
            for (var c = 0; c < l[e].length; ++c)
                if (r = l[e][c], r.active && !r.dontGather && !t[r.sid] && r.visibleToPlayer(this) && (s = m.getDistance(this.x, this.y, r.x, r.y) - r.scale, s <= w.weapons[this.weaponIndex].range && (o = m.getDirection(r.x, r.y, this.x, this.y), m.getAngleDist(o, this.dir) <= p.gatherAngle))) {
                    if (t[r.sid] = 1, r.health) {
                        if (r.changeHealth(-w.weapons[this.weaponIndex].dmg * i * (w.weapons[this.weaponIndex].sDmg || 1) * (this.skin && this.skin.bDmg ? this.skin.bDmg : 1), this)) {
                            for (let e = 0; e < r.req.length;) this.addResource(p.resourceTypes.indexOf(r.req[e]), r.req[e + 1]), e += 2;
                            g.disableObj(r)
                        }
                    } else {
                        if (r.name === "volcano") this.hitVolcano(w.weapons[this.weaponIndex].gather);
                        else {
                            this.earnXP(4 * w.weapons[this.weaponIndex].gather);
                            const d = w.weapons[this.weaponIndex].gather + (r.type == 3 ? 4 : 0);
                            this.addResource(r.type, d)
                        }
                        this.skin && this.skin.extraGold && this.addResource(3, 1)
                    }
                    a = !0, g.hitObj(r, o)
                } for (var c = 0; c < y.length + x.length; ++c)
                    if (r = y[c] || x[c - y.length], r != this && r.alive && !(r.team && r.team == this.team) && (s = m.getDistance(this.x, this.y, r.x, r.y) - r.scale * 1.8, s <= w.weapons[this.weaponIndex].range && (o = m.getDirection(r.x, r.y, this.x, this.y), m.getAngleDist(o, this.dir) <= p.gatherAngle))) {
                        let e = w.weapons[this.weaponIndex].steal;
                        e && r.addResource && (e = j(r.points || 0, e), this.addResource(3, e), r.addResource(3, -e));
                        let t = i;
                        r.weaponIndex != null && w.weapons[r.weaponIndex].shield && m.getAngleDist(o + W, r.dir) <= p.shieldAngle && (t = w.weapons[r.weaponIndex].shield);
                        const u = w.weapons[this.weaponIndex].dmg,
                              f = u * (this.skin && this.skin.dmgMultO ? this.skin.dmgMultO : 1) * (this.tail && this.tail.dmgMultO ? this.tail.dmgMultO : 1),
                              h = .3 * (r.weightM || 1) + (w.weapons[this.weaponIndex].knock || 0);
                        r.xVel += h * uc(o), r.yVel += h * fc(o), this.skin && this.skin.healD && this.changeHealth(f * t * this.skin.healD, this), this.tail && this.tail.healD && this.changeHealth(f * t * this.tail.healD, this), r.skin && r.skin.dmg && this.changeHealth(-u * r.skin.dmg, r), r.tail && r.tail.dmg && this.changeHealth(-u * r.tail.dmg, r), r.dmgOverTime && this.skin && this.skin.poisonDmg && !(r.skin && r.skin.poisonRes) && (r.dmgOverTime.dmg = this.skin.poisonDmg, r.dmgOverTime.time = this.skin.poisonTime || 1, r.dmgOverTime.doer = this), r.dmgOverTime && n && !(r.skin && r.skin.poisonRes) && (r.dmgOverTime.dmg = 5, r.dmgOverTime.time = 5, r.dmgOverTime.doer = this), r.skin && r.skin.dmgK && (this.xVel -= r.skin.dmgK * uc(o), this.yVel -= r.skin.dmgK * fc(o)), r.changeHealth(-f * t, this, this)
                    } this.sendAnimation(a ? 1 : 0)
    }, this.hitVolcano = function(e) {
        const t = 5 + H(e / 3.5);
        this.addResource(2, t), this.addResource(3, t)
    }, this.sendAnimation = function(t) {
        for (let e = 0; e < y.length; ++e) this.sentTo[y[e].id] && this.canSee(y[e]) && f.send(y[e].id, "K", this.sid, t ? 1 : 0, this.weaponIndex)
    };
    let a = 0,
        l = 0;
    this.animate = function(e) {
        this.animTime > 0 && (this.animTime -= e, this.animTime <= 0 ? (this.animTime = 0, this.dirPlus = 0, a = 0, l = 0) : l == 0 ? (a += e / (this.animSpeed * p.hitReturnRatio), this.dirPlus = m.lerp(0, this.targetAngle, j(1, a)), a >= 1 && (a = 1, l = 1)) : (a -= e / (this.animSpeed * (1 - p.hitReturnRatio)), this.dirPlus = m.lerp(0, this.targetAngle, oe(0, a))))
    }, this.startAnim = function(e, t) {
        this.animTime = this.animSpeed = w.weapons[t].speed, this.targetAngle = e ? -p.hitAngle : -W, a = 0, l = 0
    }, this.canSee = function(e) {
        if (!e || e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer) return !1;
        const t = dc(e.x - this.x) - e.scale,
              n = dc(e.y - this.y) - e.scale;
        return t <= p.maxScreenWidth / 2 * 1.3 && n <= p.maxScreenHeight / 2 * 1.3
    }
}
const gc = [{
    id: 45,
    name: "Shame!",
    dontSell: !0,
    price: 0,
    scale: 120,
    desc: "hacks are for losers"
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
    price: 1e3,
    scale: 120,
    desc: "no effect"
}, {
    id: 4,
    name: "Ranger Hat",
    price: 2e3,
    scale: 120,
    desc: "no effect"
}, {
    id: 18,
    name: "Explorer Hat",
    price: 2e3,
    scale: 120,
    desc: "no effect"
}, {
    id: 31,
    name: "Flipper Hat",
    price: 2500,
    scale: 120,
    desc: "have more control while in water",
    watrImm: !0
}, {
    id: 1,
    name: "Marksman Cap",
    price: 3e3,
    scale: 120,
    desc: "increases arrow speed and range",
    aMlt: 1.3
}, {
    id: 10,
    name: "Bush Gear",
    price: 3e3,
    scale: 160,
    desc: "allows you to disguise yourself as a bush"
}, {
    id: 48,
    name: "Halo",
    price: 3e3,
    scale: 120,
    desc: "no effect"
}, {
    id: 6,
    name: "Soldier Helmet",
    price: 4e3,
    scale: 120,
    desc: "reduces damage taken but slows movement",
    spdMult: .94,
    dmgMult: .75
}, {
    id: 23,
    name: "Anti Venom Gear",
    price: 4e3,
    scale: 120,
    desc: "makes you immune to poison",
    poisonRes: 1
}, {
    id: 13,
    name: "Medic Gear",
    price: 5e3,
    scale: 110,
    desc: "slowly regenerates health over time",
    healthRegen: 3
}, {
    id: 9,
    name: "Miners Helmet",
    price: 5e3,
    scale: 120,
    desc: "earn 1 extra gold per resource",
    extraGold: 1
}, {
    id: 32,
    name: "Musketeer Hat",
    price: 5e3,
    scale: 120,
    desc: "reduces cost of projectiles",
    projCost: .5
}, {
    id: 7,
    name: "Bull Helmet",
    price: 6e3,
    scale: 120,
    desc: "increases damage done but drains health",
    healthRegen: -5,
    dmgMultO: 1.5,
    spdMult: .96
}, {
    id: 22,
    name: "Emp Helmet",
    price: 6e3,
    scale: 120,
    desc: "turrets won't attack but you move slower",
    antiTurret: 1,
    spdMult: .7
}, {
    id: 12,
    name: "Booster Hat",
    price: 6e3,
    scale: 120,
    desc: "increases your movement speed",
    spdMult: 1.16
}, {
    id: 26,
    name: "Barbarian Armor",
    price: 8e3,
    scale: 120,
    desc: "knocks back enemies that attack you",
    dmgK: .6
}, {
    id: 21,
    name: "Plague Mask",
    price: 1e4,
    scale: 120,
    desc: "melee attacks deal poison damage",
    poisonDmg: 5,
    poisonTime: 6
}, {
    id: 46,
    name: "Bull Mask",
    price: 1e4,
    scale: 120,
    desc: "bulls won't target you unless you attack them",
    bullRepel: 1
}, {
    id: 14,
    name: "Windmill Hat",
    topSprite: !0,
    price: 1e4,
    scale: 120,
    desc: "generates points while worn",
    pps: 1.5
}, {
    id: 11,
    name: "Spike Gear",
    topSprite: !0,
    price: 1e4,
    scale: 120,
    desc: "deal damage to players that damage you",
    dmg: .45
}, {
    id: 53,
    name: "Turret Gear",
    topSprite: !0,
    price: 1e4,
    scale: 120,
    desc: "you become a walking turret",
    turret: {
        proj: 1,
        range: 700,
        rate: 2500
    },
    spdMult: .7
}, {
    id: 20,
    name: "Samurai Armor",
    price: 12e3,
    scale: 120,
    desc: "increased attack speed and fire rate",
    atkSpd: .78
}, {
    id: 58,
    name: "Dark Knight",
    price: 12e3,
    scale: 120,
    desc: "restores health when you deal damage",
    healD: .4
}, {
    id: 27,
    name: "Scavenger Gear",
    price: 15e3,
    scale: 120,
    desc: "earn double points for each kill",
    kScrM: 2
}, {
    id: 40,
    name: "Tank Gear",
    price: 15e3,
    scale: 120,
    desc: "increased damage to buildings but slower movement",
    spdMult: .3,
    bDmg: 3.3
}, {
    id: 52,
    name: "Thief Gear",
    price: 15e3,
    scale: 120,
    desc: "steal half of a players gold when you kill them",
    goldSteal: .5
}, {
    id: 55,
    name: "Bloodthirster",
    price: 2e4,
    scale: 120,
    desc: "Restore Health when dealing damage. And increased damage",
    healD: .25,
    dmgMultO: 1.2
}, {
    id: 56,
    name: "Assassin Gear",
    price: 2e4,
    scale: 120,
    desc: "Go invisible when not moving. Can't eat. Increased speed",
    noEat: !0,
    spdMult: 1.1,
    invisTimer: 1e3
}],
      yc = [{
          id: 12,
          name: "Snowball",
          price: 1e3,
          scale: 105,
          xOff: 18,
          desc: "no effect"
      }, {
          id: 9,
          name: "Tree Cape",
          price: 1e3,
          scale: 90,
          desc: "no effect"
      }, {
          id: 10,
          name: "Stone Cape",
          price: 1e3,
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
          price: 2e3,
          scale: 90,
          desc: "no effect"
      }, {
          id: 11,
          name: "Monkey Tail",
          price: 2e3,
          scale: 97,
          xOff: 25,
          desc: "Super speed but reduced damage",
          spdMult: 1.35,
          dmgMultO: .2
      }, {
          id: 17,
          name: "Apple Basket",
          price: 3e3,
          scale: 80,
          xOff: 12,
          desc: "slowly regenerates health over time",
          healthRegen: 1
      }, {
          id: 6,
          name: "Winter Cape",
          price: 3e3,
          scale: 90,
          desc: "no effect"
      }, {
          id: 4,
          name: "Skull Cape",
          price: 4e3,
          scale: 90,
          desc: "no effect"
      }, {
          id: 5,
          name: "Dash Cape",
          price: 5e3,
          scale: 90,
          desc: "no effect"
      }, {
          id: 2,
          name: "Dragon Cape",
          price: 6e3,
          scale: 90,
          desc: "no effect"
      }, {
          id: 1,
          name: "Super Cape",
          price: 8e3,
          scale: 90,
          desc: "no effect"
      }, {
          id: 7,
          name: "Troll Cape",
          price: 8e3,
          scale: 90,
          desc: "no effect"
      }, {
          id: 14,
          name: "Thorns",
          price: 1e4,
          scale: 115,
          xOff: 20,
          desc: "no effect"
      }, {
          id: 15,
          name: "Blockades",
          price: 1e4,
          scale: 95,
          xOff: 15,
          desc: "no effect"
      }, {
          id: 20,
          name: "Devils Tail",
          price: 1e4,
          scale: 95,
          xOff: 20,
          desc: "no effect"
      }, {
          id: 16,
          name: "Sawblade",
          price: 12e3,
          scale: 90,
          spin: !0,
          xOff: 0,
          desc: "deal damage to players that damage you",
          dmg: .15
      }, {
          id: 13,
          name: "Angel Wings",
          price: 15e3,
          scale: 138,
          xOff: 22,
          desc: "slowly regenerates health over time",
          healthRegen: 3
      }, {
          id: 19,
          name: "Shadow Wings",
          price: 15e3,
          scale: 138,
          xOff: 22,
          desc: "increased movement speed",
          spdMult: 1.1
      }, {
          id: 18,
          name: "Blood Wings",
          price: 2e4,
          scale: 178,
          xOff: 26,
          desc: "restores health when you deal damage",
          healD: .2
      }, {
          id: 21,
          name: "Corrupt X Wings",
          price: 2e4,
          scale: 178,
          xOff: 26,
          desc: "deal damage to players that damage you",
          dmg: .25
      }],
      xc = {
          hats: gc,
          accessories: yc
      };

function wc(a, t, l, c, d, u, f) {
    this.init = function(e, t, n, i, s, o, r, a, l) {
        this.active = !0, this.indx = e, this.x = t, this.y = n, this.dir = i, this.skipMov = !0, this.speed = s, this.dmg = o, this.scale = a, this.range = r, this.owner = l, f && (this.sentTo = {})
    };
    const h = [];
    let p;
    this.update = function(e) {
        if (this.active) {
            let n = this.speed * e,
                i;
            if (this.skipMov ? this.skipMov = !1 : (this.x += n * U(this.dir), this.y += n * V(this.dir), this.range -= n, this.range <= 0 && (this.x += this.range * U(this.dir), this.y += this.range * V(this.dir), n = 1, this.range = 0, this.active = !1)), f) {
                for (var s = 0; s < a.length; ++s) !this.sentTo[a[s].id] && a[s].canSee(this) && (this.sentTo[a[s].id] = 1, f.send(a[s].id, "X", u.fixTo(this.x, 1), u.fixTo(this.y, 1), u.fixTo(this.dir, 2), u.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid));
                h.length = 0;
                for (var s = 0; s < a.length + t.length; ++s) p = a[s] || t[s - a.length], p.alive && p != this.owner && !(this.owner.team && p.team == this.owner.team) && u.lineInRect(p.x - p.scale, p.y - p.scale, p.x + p.scale, p.y + p.scale, this.x, this.y, this.x + n * U(this.dir), this.y + n * V(this.dir)) && h.push(p);
                const o = l.getGridArrays(this.x, this.y, this.scale);
                for (let t = 0; t < o.length; ++t)
                    for (let e = 0; e < o[t].length; ++e) p = o[t][e], i = p.getScale(), p.active && this.ignoreObj != p.sid && this.layer <= p.layer && h.indexOf(p) < 0 && !p.ignoreCollision && u.lineInRect(p.x - i, p.y - i, p.x + i, p.y + i, this.x, this.y, this.x + n * U(this.dir), this.y + n * V(this.dir)) && h.push(p);
                if (h.length > 0) {
                    let e = null,
                        t = null,
                        n = null;
                    for (var s = 0; s < h.length; ++s) n = u.getDistance(this.x, this.y, h[s].x, h[s].y), (t == null || n < t) && (t = n, e = h[s]);
                    if (e.isPlayer || e.isAI) {
                        const r = .3 * (e.weightM || 1);
                        e.xVel += r * U(this.dir), e.yVel += r * V(this.dir), (e.weaponIndex == null || !(c.weapons[e.weaponIndex].shield && u.getAngleDist(this.dir + W, e.dir) <= d.shieldAngle)) && e.changeHealth(-this.dmg, this.owner, this.owner)
                    } else {
                        e.projDmg && e.health && e.changeHealth(-this.dmg) && l.disableObj(e);
                        for (var s = 0; s < a.length; ++s) a[s].active && (e.sentTo[a[s].id] && (e.active ? a[s].canSee(e) && f.send(a[s].id, "L", u.fixTo(this.dir, 2), e.sid) : f.send(a[s].id, "Q", e.sid)), !e.active && e.owner == a[s] && a[s].changeItemCount(e.group.id, -1))
                    }
                    this.active = !1;
                    for (var s = 0; s < a.length; ++s) this.sentTo[a[s].id] && f.send(a[s].id, "Y", this.sid, u.fixTo(t, 1))
                }
            }
        }
    }
}
var bc = {},
    vc = {
        get exports() {
            return bc
        },
        set exports(e) {
            bc = e
        }
    },
    kc = {},
    Ac = {
        get exports() {
            return kc
        },
        set exports(e) {
            kc = e
        }
    };
(function() {
    var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        n = {
            rotl: function(e, t) {
                return e << t | e >>> 32 - t
            },
            rotr: function(e, t) {
                return e << 32 - t | e >>> t
            },
            endian: function(e) {
                if (e.constructor == Number) return n.rotl(e, 8) & 16711935 | n.rotl(e, 24) & 4278255360;
                for (var t = 0; t < e.length; t++) e[t] = n.endian(e[t]);
                return e
            },
            randomBytes: function(e) {
                for (var t = []; e > 0; e--) t.push(f(Math.random() * 256));
                return t
            },
            bytesToWords: function(e) {
                for (var t = [], n = 0, i = 0; n < e.length; n++, i += 8) t[i >>> 5] |= e[n] << 24 - i % 32;
                return t
            },
            wordsToBytes: function(e) {
                for (var t = [], n = 0; n < e.length * 32; n += 8) t.push(e[n >>> 5] >>> 24 - n % 32 & 255);
                return t
            },
            bytesToHex: function(e) {
                for (var t = [], n = 0; n < e.length; n++) t.push((e[n] >>> 4).toString(16)), t.push((e[n] & 15).toString(16));
                return t.join("")
            },
            hexToBytes: function(e) {
                for (var t = [], n = 0; n < e.length; n += 2) t.push(parseInt(e.substr(n, 2), 16));
                return t
            },
            bytesToBase64: function(e) {
                for (var t = [], n = 0; n < e.length; n += 3)
                    for (var i = e[n] << 16 | e[n + 1] << 8 | e[n + 2], s = 0; s < 4; s++) n * 8 + s * 6 <= e.length * 8 ? t.push(o.charAt(i >>> 6 * (3 - s) & 63)) : t.push("=");
                return t.join("")
            },
            base64ToBytes: function(e) {
                e = e.replace(/[^A-Z0-9+\/]/gi, "");
                for (var t = [], n = 0, i = 0; n < e.length; i = ++n % 4) i != 0 && t.push((o.indexOf(e.charAt(n - 1)) & re(2, -2 * i + 8) - 1) << i * 2 | o.indexOf(e.charAt(n)) >>> 6 - i * 2);
                return t
            }
        };
    Ac.exports = n
})();
var Ic = {
    utf8: {
        stringToBytes: function(e) {
            return Ic.bin.stringToBytes(unescape(encodeURIComponent(e)))
        },
        bytesToString: function(e) {
            return decodeURIComponent(escape(Ic.bin.bytesToString(e)))
        }
    },
    bin: {
        stringToBytes: function(e) {
            for (var t = [], n = 0; n < e.length; n++) t.push(e.charCodeAt(n) & 255);
            return t
        },
        bytesToString: function(e) {
            for (var t = [], n = 0; n < e.length; n++) t.push(String.fromCharCode(e[n]));
            return t.join("")
        }
    }
},
    Sc = Ic;
var Ec = function(e) {
    return e != null && (Tc(e) || Cc(e) || !!e._isBuffer)
};

function Tc(e) {
    return !!e.constructor && typeof e.constructor.isBuffer == "function" && e.constructor.isBuffer(e)
}

function Cc(e) {
    return typeof e.readFloatLE == "function" && typeof e.slice == "function" && Tc(e.slice(0, 0))
}(function() {
    var y = kc,
        x = Sc.utf8,
        w = Ec,
        b = Sc.bin,
        v = function(e, t) {
            e.constructor == String ? t && t.encoding === "binary" ? e = b.stringToBytes(e) : e = x.stringToBytes(e) : w(e) ? e = Array.prototype.slice.call(e, 0) : !Array.isArray(e) && e.constructor !== Uint8Array && (e = e.toString());
            for (var n = y.bytesToWords(e), i = e.length * 8, s = 1732584193, o = -271733879, r = -1732584194, a = 271733878, l = 0; l < n.length; l++) n[l] = (n[l] << 8 | n[l] >>> 24) & 16711935 | (n[l] << 24 | n[l] >>> 8) & 4278255360;
            n[i >>> 5] |= 128 << i % 32, n[(i + 64 >>> 9 << 4) + 14] = i;
            for (var c = v._ff, d = v._gg, u = v._hh, f = v._ii, l = 0; l < n.length; l += 16) {
                var h = s,
                    p = o,
                    m = r,
                    g = a;
                s = c(s, o, r, a, n[l + 0], 7, -680876936), a = c(a, s, o, r, n[l + 1], 12, -389564586), r = c(r, a, s, o, n[l + 2], 17, 606105819), o = c(o, r, a, s, n[l + 3], 22, -1044525330), s = c(s, o, r, a, n[l + 4], 7, -176418897), a = c(a, s, o, r, n[l + 5], 12, 1200080426), r = c(r, a, s, o, n[l + 6], 17, -1473231341), o = c(o, r, a, s, n[l + 7], 22, -45705983), s = c(s, o, r, a, n[l + 8], 7, 1770035416), a = c(a, s, o, r, n[l + 9], 12, -1958414417), r = c(r, a, s, o, n[l + 10], 17, -42063), o = c(o, r, a, s, n[l + 11], 22, -1990404162), s = c(s, o, r, a, n[l + 12], 7, 1804603682), a = c(a, s, o, r, n[l + 13], 12, -40341101), r = c(r, a, s, o, n[l + 14], 17, -1502002290), o = c(o, r, a, s, n[l + 15], 22, 1236535329), s = d(s, o, r, a, n[l + 1], 5, -165796510), a = d(a, s, o, r, n[l + 6], 9, -1069501632), r = d(r, a, s, o, n[l + 11], 14, 643717713), o = d(o, r, a, s, n[l + 0], 20, -373897302), s = d(s, o, r, a, n[l + 5], 5, -701558691), a = d(a, s, o, r, n[l + 10], 9, 38016083), r = d(r, a, s, o, n[l + 15], 14, -660478335), o = d(o, r, a, s, n[l + 4], 20, -405537848), s = d(s, o, r, a, n[l + 9], 5, 568446438), a = d(a, s, o, r, n[l + 14], 9, -1019803690), r = d(r, a, s, o, n[l + 3], 14, -187363961), o = d(o, r, a, s, n[l + 8], 20, 1163531501), s = d(s, o, r, a, n[l + 13], 5, -1444681467), a = d(a, s, o, r, n[l + 2], 9, -51403784), r = d(r, a, s, o, n[l + 7], 14, 1735328473), o = d(o, r, a, s, n[l + 12], 20, -1926607734), s = u(s, o, r, a, n[l + 5], 4, -378558), a = u(a, s, o, r, n[l + 8], 11, -2022574463), r = u(r, a, s, o, n[l + 11], 16, 1839030562), o = u(o, r, a, s, n[l + 14], 23, -35309556), s = u(s, o, r, a, n[l + 1], 4, -1530992060), a = u(a, s, o, r, n[l + 4], 11, 1272893353), r = u(r, a, s, o, n[l + 7], 16, -155497632), o = u(o, r, a, s, n[l + 10], 23, -1094730640), s = u(s, o, r, a, n[l + 13], 4, 681279174), a = u(a, s, o, r, n[l + 0], 11, -358537222), r = u(r, a, s, o, n[l + 3], 16, -722521979), o = u(o, r, a, s, n[l + 6], 23, 76029189), s = u(s, o, r, a, n[l + 9], 4, -640364487), a = u(a, s, o, r, n[l + 12], 11, -421815835), r = u(r, a, s, o, n[l + 15], 16, 530742520), o = u(o, r, a, s, n[l + 2], 23, -995338651), s = f(s, o, r, a, n[l + 0], 6, -198630844), a = f(a, s, o, r, n[l + 7], 10, 1126891415), r = f(r, a, s, o, n[l + 14], 15, -1416354905), o = f(o, r, a, s, n[l + 5], 21, -57434055), s = f(s, o, r, a, n[l + 12], 6, 1700485571), a = f(a, s, o, r, n[l + 3], 10, -1894986606), r = f(r, a, s, o, n[l + 10], 15, -1051523), o = f(o, r, a, s, n[l + 1], 21, -2054922799), s = f(s, o, r, a, n[l + 8], 6, 1873313359), a = f(a, s, o, r, n[l + 15], 10, -30611744), r = f(r, a, s, o, n[l + 6], 15, -1560198380), o = f(o, r, a, s, n[l + 13], 21, 1309151649), s = f(s, o, r, a, n[l + 4], 6, -145523070), a = f(a, s, o, r, n[l + 11], 10, -1120210379), r = f(r, a, s, o, n[l + 2], 15, 718787259), o = f(o, r, a, s, n[l + 9], 21, -343485551), s = s + h >>> 0, o = o + p >>> 0, r = r + m >>> 0, a = a + g >>> 0
            }
            return y.endian([s, o, r, a])
        };
    v._ff = function(e, t, n, i, s, o, r) {
        var a = e + (t & n | ~t & i) + (s >>> 0) + r;
        return (a << o | a >>> 32 - o) + t
    }, v._gg = function(e, t, n, i, s, o, r) {
        var a = e + (t & i | n & ~i) + (s >>> 0) + r;
        return (a << o | a >>> 32 - o) + t
    }, v._hh = function(e, t, n, i, s, o, r) {
        var a = e + (t ^ n ^ i) + (s >>> 0) + r;
        return (a << o | a >>> 32 - o) + t
    }, v._ii = function(e, t, n, i, s, o, r) {
        var a = e + (n ^ (t | ~i)) + (s >>> 0) + r;
        return (a << o | a >>> 32 - o) + t
    }, v._blocksize = 16, v._digestsize = 16, vc.exports = function(e, t) {
        if (e == null) throw new Error("Illegal argument " + e);
        var n = y.wordsToBytes(v(e, t));
        return t && t.asBytes ? n : t && t.asString ? b.bytesToString(n) : y.bytesToHex(n)
    }
})();
var Bc, Dc;

function Pc() {
    if (Dc) return Bc;
    Dc = 1;

    function s(e, t, n, i, s, o) {
        return {
            tag: e,
            key: t,
            attrs: n,
            children: i,
            text: s,
            dom: o,
            domSize: void 0,
            state: void 0,
            events: void 0,
            instance: void 0
        }
    }
    return s.normalize = function(e) {
        return Array.isArray(e) ? s("[", void 0, void 0, s.normalizeChildren(e), void 0, void 0) : e == null || typeof e == "boolean" ? null : typeof e == "object" ? e : s("#", void 0, void 0, String(e), void 0, void 0)
    }, s.normalizeChildren = function(e) {
        var t = [];
        if (e.length) {
            for (var n = e[0] != null && e[0].key != null, i = 1; i < e.length; i++)
                if ((e[i] != null && e[i].key != null) !== n) throw new TypeError(n && (e[i] != null || typeof e[i] == "boolean") ? "In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole." : "In fragments, vnodes must either all have keys or none have keys.");
            for (var i = 0; i < e.length; i++) t[i] = s.normalize(e[i])
        }
        return t
    }, Bc = s, Bc
}
var Rc = Pc(),
    Mc = function() {
        var e = arguments[this],
            t = this + 1,
            n;
        if (e == null ? e = {} : (typeof e != "object" || e.tag != null || Array.isArray(e)) && (e = {}, t = this), arguments.length === t + 1) n = arguments[t], Array.isArray(n) || (n = [n]);
        else
            for (n = []; t < arguments.length;) n.push(arguments[t++]);
        return Rc("", e.key, e, n)
    },
    Nc = {}.hasOwnProperty,
    Oc = Pc(),
    Lc = Mc,
    Fc = Nc,
    _c = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g,
    Vc = {};

function Uc(e) {
    for (var t in e)
        if (Fc.call(e, t)) return !1;
    return !0
}

function jc(e) {
    for (var t, n = "div", i = [], s = {}; t = _c.exec(e);) {
        var o = t[1],
            r = t[2];
        if (o === "" && r !== "") n = r;
        else if (o === "#") s.id = r;
        else if (o === ".") i.push(r);
        else if (t[3][0] === "[") {
            var a = t[6];
            a && (a = a.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")), t[4] === "class" ? i.push(a) : s[t[4]] = a === "" ? a : a || !0
        }
    }
    return i.length > 0 && (s.className = i.join(" ")), Vc[e] = {
        tag: n,
        attrs: s
    }
}

function Hc(e, t) {
    var n = t.attrs,
        i = Fc.call(n, "class"),
        s = i ? n["class"] : n.className;
    if (t.tag = e.tag, t.attrs = {}, !Uc(e.attrs) && !Uc(n)) {
        var o = {};
        for (var r in n) Fc.call(n, r) && (o[r] = n[r]);
        n = o
    }
    for (var r in e.attrs) Fc.call(e.attrs, r) && r !== "className" && !Fc.call(n, r) && (n[r] = e.attrs[r]);
    (s != null || e.attrs.className != null) && (n.className = s != null ? e.attrs.className != null ? String(e.attrs.className) + " " + String(s) : s : e.attrs.className != null ? e.attrs.className : null), i && (n["class"] = null);
    for (var r in n)
        if (Fc.call(n, r) && r !== "key") {
            t.attrs = n;
            break
        } return t
}

function Wc(e) {
    if (e == null || typeof e != "string" && typeof e != "function" && typeof e.view != "function") throw Error("The selector must be either a string or a component.");
    var t = Lc.apply(1, arguments);
    return typeof e == "string" && (t.children = Oc.normalizeChildren(t.children), e !== "[") ? Hc(Vc[e] || jc(e), t) : (t.tag = e, t)
}
var Qc = Wc,
    Yc = Pc(),
    zc = function(e) {
        return e == null && (e = ""), Yc("<", void 0, void 0, e, void 0, void 0)
    },
    Gc = Pc(),
    Kc = Mc,
    Xc = function() {
        var e = Kc.apply(0, arguments);
        return e.tag = "[", e.children = Gc.normalizeChildren(e.children), e
    },
    Jc = Qc;
Jc.trust = zc;
Jc.fragment = Xc;
var qc = Jc,
    $c = {},
    Zc = {
        get exports() {
            return $c
        },
        set exports(e) {
            $c = e
        }
    },
    ed, td;

function nd() {
    if (td) return ed;
    td = 1;
    var h = function(e) {
        if (!(this instanceof h)) throw new Error("Promise must be called with 'new'.");
        if (typeof e != "function") throw new TypeError("executor must be a function.");
        var r = this,
            a = [],
            l = [],
            o = t(a, !0),
            c = t(l, !1),
            d = r._instance = {
                resolvers: a,
                rejectors: l
            },
            u = typeof setImmediate == "function" ? setImmediate : setTimeout;

        function t(i, s) {
            return function o(t) {
                var e;
                try {
                    if (s && t != null && (typeof t == "object" || typeof t == "function") && typeof(e = t.then) == "function") {
                        if (t === r) throw new TypeError("Promise can't be resolved with itself.");
                        f(e.bind(t))
                    } else u(function() {
                        !s && i.length === 0 && console.error("Possible unhandled promise rejection:", t);
                        for (var e = 0; e < i.length; e++) i[e](t);
                        a.length = 0, l.length = 0, d.state = s, d.retry = function() {
                            o(t)
                        }
                    })
                } catch (n) {
                    c(n)
                }
            }
        }

        function f(e) {
            var n = 0;

            function t(t) {
                return function(e) {
                    n++ > 0 || t(e)
                }
            }
            var i = t(c);
            try {
                e(t(o), i)
            } catch (s) {
                i(s)
            }
        }
        f(e)
    };
    return h.prototype.then = function(e, t) {
        var n = this,
            s = n._instance;

        function i(t, e, n, i) {
            e.push(function(e) {
                if (typeof t != "function") n(e);
                else try {
                    o(t(e))
                } catch (w) {
                    r && r(w)
                }
            }), typeof s.retry == "function" && i === s.state && s.retry()
        }
        var o, r, a = new h(function(e, t) {
            o = e, r = t
        });
        return i(e, s.resolvers, o, !0), i(t, s.rejectors, r, !1), a
    }, h.prototype["catch"] = function(e) {
        return this.then(null, e)
    }, h.prototype["finally"] = function(t) {
        return this.then(function(e) {
            return h.resolve(t()).then(function() {
                return e
            })
        }, function(e) {
            return h.resolve(t()).then(function() {
                return h.reject(e)
            })
        })
    }, h.resolve = function(t) {
        return t instanceof h ? t : new h(function(e) {
            e(t)
        })
    }, h.reject = function(n) {
        return new h(function(e, t) {
            t(n)
        })
    }, h.all = function(a) {
        return new h(function(n, i) {
            var s = a.length,
                o = 0,
                r = [];
            if (a.length === 0) n([]);
            else
                for (var e = 0; e < a.length; e++)(function(t) {
                    function e(e) {
                        o++, r[t] = e, o === s && n(r)
                    }
                    a[t] != null && (typeof a[t] == "object" || typeof a[t] == "function") && typeof a[t].then == "function" ? a[t].then(e, i) : e(a[t])
                })(e)
        })
    }, h.race = function(i) {
        return new h(function(e, t) {
            for (var n = 0; n < i.length; n++) i[n].then(e, t)
        })
    }, ed = h, ed
}
var id = nd();
typeof window < "u" ? (typeof window.Promise > "u" ? window.Promise = id : window.Promise.prototype["finally"] || (window.Promise.prototype["finally"] = id.prototype["finally"]), Zc.exports = window.Promise) : typeof Sr < "u" ? (typeof Sr.Promise > "u" ? Sr.Promise = id : Sr.Promise.prototype["finally"] || (Sr.Promise.prototype["finally"] = id.prototype["finally"]), Zc.exports = Sr.Promise) : Zc.exports = id;
var sd, od;

function rd() {
    if (od) return sd;
    od = 1;
    var te = Pc();
    return sd = function(e) {
        var d = e && e.document,
            c, t = {
                svg: "http://www.w3.org/2000/svg",
                math: "http://www.w3.org/1998/Math/MathML"
            };

        function u(e) {
            return e.attrs && e.attrs.xmlns || t[e.tag]
        }

        function f(e, t) {
            if (e.state !== t) throw new Error("'vnode.state' must not be modified.")
        }

        function h(e) {
            var t = e.state;
            try {
                return this.apply(t, arguments)
            } finally {
                f(e, t)
            }
        }

        function p() {
            try {
                return d.activeElement
            } catch {
                return null
            }
        }

        function C(e, t, n, i, s, o, r) {
            for (var a = n; a < i; a++) {
                var l = t[a];
                l != null && B(e, l, s, r, o)
            }
        }

        function B(e, t, n, i, s) {
            var o = t.tag;
            if (typeof o == "string") switch (t.state = {}, t.attrs != null && O(t.attrs, t, n), o) {
                case "#":
                    r(e, t, s);
                    break;
                case "<":
                    a(e, t, i, s);
                    break;
                case "[":
                    _(e, t, n, i, s);
                    break;
                default:
                    V(e, t, n, i, s)
            } else j(e, t, n, i, s)
        }

        function r(e, t, n) {
            t.dom = d.createTextNode(t.children), y(e, t.dom, n)
        }
        var l = {
            caption: "table",
            thead: "table",
            tbody: "table",
            tfoot: "table",
            tr: "tbody",
            th: "tr",
            td: "tr",
            colgroup: "table",
            col: "colgroup"
        };

        function a(e, t, n, i) {
            var s = t.children.match(/^\s*?<(\w+)/im) || [],
                o = d.createElement(l[s[1]] || "div");
            n === "http://www.w3.org/2000/svg" ? (o.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + t.children + "</svg>", o = o.firstChild) : o.innerHTML = t.children, t.dom = o.firstChild, t.domSize = o.childNodes.length, t.instance = [];
            for (var r = d.createDocumentFragment(), a; a = o.firstChild;) t.instance.push(a), r.appendChild(a);
            y(e, r, i)
        }

        function _(e, t, n, i, s) {
            var o = d.createDocumentFragment();
            if (t.children != null) {
                var r = t.children;
                C(o, r, 0, r.length, n, null, i)
            }
            t.dom = o.firstChild, t.domSize = o.childNodes.length, y(e, o, s)
        }

        function V(e, t, n, i, s) {
            var o = t.tag,
                r = t.attrs,
                a = r && r.is;
            i = u(t) || i;
            var l = i ? a ? d.createElementNS(i, o, {
                is: a
            }) : d.createElementNS(i, o) : a ? d.createElement(o, {
                is: a
            }) : d.createElement(o);
            if (t.dom = l, r != null && X(t, r, i), y(e, l, s), !x(t) && t.children != null) {
                var c = t.children;
                C(l, c, 0, c.length, n, null, i), t.tag === "select" && r != null && q(t, r)
            }
        }

        function U(e, t) {
            var n;
            if (typeof e.tag.view == "function") {
                if (e.state = Object.create(e.tag), n = e.state.view, n.$$reentrantLock$$ != null) return;
                n.$$reentrantLock$$ = !0
            } else {
                if (e.state = void 0, n = e.tag, n.$$reentrantLock$$ != null) return;
                n.$$reentrantLock$$ = !0, e.state = e.tag.prototype != null && typeof e.tag.prototype.view == "function" ? new e.tag(e) : e.tag(e)
            }
            if (O(e.state, e, t), e.attrs != null && O(e.attrs, e, t), e.instance = te.normalize(h.call(e.state.view, e)), e.instance === e) throw Error("A view cannot return the vnode it received as argument");
            n.$$reentrantLock$$ = null
        }

        function j(e, t, n, i, s) {
            U(t, n), t.instance != null ? (B(e, t.instance, n, i, s), t.dom = t.instance.dom, t.domSize = t.dom != null ? t.instance.domSize : 0) : t.domSize = 0
        }

        function m(e, t, n, i, s, o) {
            if (!(t === n || t == null && n == null))
                if (t == null || t.length === 0) C(e, n, 0, n.length, i, s, o);
                else if (n == null || n.length === 0) M(e, t, 0, t.length);
                else {
                    var r = t[0] != null && t[0].key != null,
                        a = n[0] != null && n[0].key != null,
                        l = 0,
                        c = 0;
                    if (!r)
                        for (; c < t.length && t[c] == null;) c++;
                    if (!a)
                        for (; l < n.length && n[l] == null;) l++;
                    if (r !== a) M(e, t, c, t.length), C(e, n, l, n.length, i, s, o);
                    else if (a) {
                        for (var d = t.length - 1, u = n.length - 1, f, h, p, m, g, y; d >= c && u >= l && (m = t[d], g = n[u], m.key === g.key);) m !== g && D(e, m, g, i, s, o), g.dom != null && (s = g.dom), d--, u--;
                        for (; d >= c && u >= l && (h = t[c], p = n[l], h.key === p.key);) c++, l++, h !== p && D(e, h, p, i, P(t, c, s), o);
                        for (; d >= c && u >= l && !(l === u || h.key !== g.key || m.key !== p.key);) y = P(t, c, s), R(e, m, y), m !== p && D(e, m, p, i, y, o), ++l <= --u && R(e, h, s), h !== g && D(e, h, g, i, s, o), g.dom != null && (s = g.dom), c++, d--, m = t[d], g = n[u], h = t[c], p = n[l];
                        for (; d >= c && u >= l && m.key === g.key;) m !== g && D(e, m, g, i, s, o), g.dom != null && (s = g.dom), d--, u--, m = t[d], g = n[u];
                        if (l > u) M(e, t, c, d + 1);
                        else if (c > d) C(e, n, l, u + 1, i, s, o);
                        else {
                            var x = s,
                                w = u - l + 1,
                                b = new Array(w),
                                v = 0,
                                k = 0,
                                A = 2147483647,
                                I = 0,
                                f, S;
                            for (k = 0; k < w; k++) b[k] = -1;
                            for (k = u; k >= l; k--) {
                                f == null && (f = G(t, c, d + 1)), g = n[k];
                                var E = f[g.key];
                                E != null && (A = E < A ? E : -1, b[k - l] = E, m = t[E], t[E] = null, m !== g && D(e, m, g, i, s, o), g.dom != null && (s = g.dom), I++)
                            }
                            if (s = x, I !== d - c + 1 && M(e, t, c, d + 1), I === 0) C(e, n, l, u + 1, i, s, o);
                            else if (A === -1)
                                for (S = K(b), v = S.length - 1, k = u; k >= l; k--) p = n[k], b[k - l] === -1 ? B(e, p, i, o, s) : S[v] === k - l ? v-- : R(e, p, s), p.dom != null && (s = n[k].dom);
                            else
                                for (k = u; k >= l; k--) p = n[k], b[k - l] === -1 && B(e, p, i, o, s), p.dom != null && (s = n[k].dom)
                        }
                    } else {
                        var T = t.length < n.length ? t.length : n.length;
                        for (l = l < c ? l : c; l < T; l++) h = t[l], p = n[l], !(h === p || h == null && p == null) && (h == null ? B(e, p, i, o, P(t, l + 1, s)) : p == null ? N(e, h) : D(e, h, p, i, P(t, l + 1, s), o));
                        t.length > T && M(e, t, l, t.length), n.length > T && C(e, n, l, n.length, i, s, o)
                    }
                }
        }

        function D(e, t, n, i, s, o) {
            var r = t.tag,
                a = n.tag;
            if (r === a) {
                if (n.state = t.state, n.events = t.events, ee(n, t)) return;
                if (typeof r == "string") switch (n.attrs != null && L(n.attrs, n, i), r) {
                    case "#":
                        H(t, n);
                        break;
                    case "<":
                        W(e, t, n, o, s);
                        break;
                    case "[":
                        Q(e, t, n, i, s, o);
                        break;
                    default:
                        Y(t, n, i, o)
                } else z(e, t, n, i, s, o)
            } else N(e, t), B(e, n, i, o, s)
        }

        function H(e, t) {
            e.children.toString() !== t.children.toString() && (e.dom.nodeValue = t.children), t.dom = e.dom
        }

        function W(e, t, n, i, s) {
            t.children !== n.children ? (w(e, t), a(e, n, i, s)) : (n.dom = t.dom, n.domSize = t.domSize, n.instance = t.instance)
        }

        function Q(e, t, n, i, s, o) {
            m(e, t.children, n.children, i, s, o);
            var r = 0,
                a = n.children;
            if (n.dom = null, a != null) {
                for (var l = 0; l < a.length; l++) {
                    var c = a[l];
                    c != null && c.dom != null && (n.dom == null && (n.dom = c.dom), r += c.domSize || 1)
                }
                r !== 1 && (n.domSize = r)
            }
        }

        function Y(e, t, n, i) {
            var s = t.dom = e.dom;
            i = u(t) || i, t.tag === "textarea" && t.attrs == null && (t.attrs = {}), $(t, e.attrs, t.attrs, i), x(t) || m(s, e.children, t.children, n, null, i)
        }

        function z(e, t, n, i, s, o) {
            if (n.instance = te.normalize(h.call(n.state.view, n)), n.instance === n) throw Error("A view cannot return the vnode it received as argument");
            L(n.state, n, i), n.attrs != null && L(n.attrs, n, i), n.instance != null ? (t.instance == null ? B(e, n.instance, i, o, s) : D(e, t.instance, n.instance, i, s, o), n.dom = n.instance.dom, n.domSize = n.instance.domSize) : t.instance != null ? (N(e, t.instance), n.dom = void 0, n.domSize = 0) : (n.dom = t.dom, n.domSize = t.domSize)
        }

        function G(e, t, n) {
            for (var i = Object.create(null); t < n; t++) {
                var s = e[t];
                if (s != null) {
                    var o = s.key;
                    o != null && (i[o] = t)
                }
            }
            return i
        }
        var g = [];

        function K(e) {
            for (var t = [0], n = 0, i = 0, s = 0, o = g.length = e.length, s = 0; s < o; s++) g[s] = e[s];
            for (var s = 0; s < o; ++s)
                if (e[s] !== -1) {
                    var r = t[t.length - 1];
                    if (e[r] < e[s]) {
                        g[s] = r, t.push(s);
                        continue
                    }
                    for (n = 0, i = t.length - 1; n < i;) {
                        var a = (n >>> 1) + (i >>> 1) + (n & i & 1);
                        e[t[a]] < e[s] ? n = a + 1 : i = a
                    }
                    e[s] < e[t[n]] && (n > 0 && (g[s] = t[n - 1]), t[n] = s)
                } for (n = t.length, i = t[n - 1]; n-- > 0;) t[n] = i, i = g[i];
            return g.length = 0, t
        }

        function P(e, t, n) {
            for (; t < e.length; t++)
                if (e[t] != null && e[t].dom != null) return e[t].dom;
            return n
        }

        function R(e, t, n) {
            var i = d.createDocumentFragment();
            o(e, i, t), y(e, i, n)
        }

        function o(e, t, n) {
            for (; n.dom != null && n.dom.parentNode === e;) {
                if (typeof n.tag != "string") {
                    if (n = n.instance, n != null) continue
                } else if (n.tag === "<")
                    for (var i = 0; i < n.instance.length; i++) t.appendChild(n.instance[i]);
                else if (n.tag !== "[") t.appendChild(n.dom);
                else if (n.children.length === 1) {
                    if (n = n.children[0], n != null) continue
                } else
                    for (var i = 0; i < n.children.length; i++) {
                        var s = n.children[i];
                        s != null && o(e, t, s)
                    }
                break
            }
        }

        function y(e, t, n) {
            n != null ? e.insertBefore(t, n) : e.appendChild(t)
        }

        function x(e) {
            if (e.attrs == null || e.attrs.contenteditable == null && e.attrs.contentEditable == null) return !1;
            var t = e.children;
            if (t != null && t.length === 1 && t[0].tag === "<") {
                var n = t[0].children;
                e.dom.innerHTML !== n && (e.dom.innerHTML = n)
            } else if (t != null && t.length !== 0) throw new Error("Child node of a contenteditable must be trusted.");
            return !0
        }

        function M(e, t, n, i) {
            for (var s = n; s < i; s++) {
                var o = t[s];
                o != null && N(e, o)
            }
        }

        function N(e, t) {
            var n = 0,
                i = t.state,
                s, o;
            if (typeof t.tag != "string" && typeof t.state.onbeforeremove == "function") {
                var r = h.call(t.state.onbeforeremove, t);
                r != null && typeof r.then == "function" && (n = 1, s = r)
            }
            if (t.attrs && typeof t.attrs.onbeforeremove == "function") {
                var r = h.call(t.attrs.onbeforeremove, t);
                r != null && typeof r.then == "function" && (n |= 2, o = r)
            }
            if (f(t, i), !n) v(t), b(e, t);
            else {
                if (s != null) {
                    var a = function() {
                        n & 1 && (n &= 2, n || l())
                    };
                    s.then(a, a)
                }
                if (o != null) {
                    var a = function() {
                        n & 2 && (n &= 1, n || l())
                    };
                    o.then(a, a)
                }
            }

            function l() {
                f(t, i), v(t), b(e, t)
            }
        }

        function w(e, t) {
            for (var n = 0; n < t.instance.length; n++) e.removeChild(t.instance[n])
        }

        function b(e, t) {
            for (; t.dom != null && t.dom.parentNode === e;) {
                if (typeof t.tag != "string") {
                    if (t = t.instance, t != null) continue
                } else if (t.tag === "<") w(e, t);
                else {
                    if (t.tag !== "[" && (e.removeChild(t.dom), !Array.isArray(t.children))) break;
                    if (t.children.length === 1) {
                        if (t = t.children[0], t != null) continue
                    } else
                        for (var n = 0; n < t.children.length; n++) {
                            var i = t.children[n];
                            i != null && b(e, i)
                        }
                }
                break
            }
        }

        function v(e) {
            if (typeof e.tag != "string" && typeof e.state.onremove == "function" && h.call(e.state.onremove, e), e.attrs && typeof e.attrs.onremove == "function" && h.call(e.attrs.onremove, e), typeof e.tag != "string") e.instance != null && v(e.instance);
            else {
                var t = e.children;
                if (Array.isArray(t))
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i != null && v(i)
                    }
            }
        }

        function X(e, t, n) {
            e.tag === "input" && t.type != null && e.dom.setAttribute("type", t.type);
            var i = t != null && e.tag === "input" && t.type === "file";
            for (var s in t) k(e, s, null, t[s], n, i)
        }

        function k(e, t, n, i, s, o) {
            if (!(t === "key" || t === "is" || i == null || A(t) || n === i && !Z(e, t) && typeof i != "object" || t === "type" && e.tag === "input")) {
                if (t[0] === "o" && t[1] === "n") return T(e, t, i);
                if (t.slice(0, 6) === "xlink:") e.dom.setAttributeNS("http://www.w3.org/1999/xlink", t.slice(6), i);
                else if (t === "style") E(e.dom, n, i);
                else if (I(e, t, s)) {
                    if (t === "value") {
                        if ((e.tag === "input" || e.tag === "textarea") && e.dom.value === "" + i && (o || e.dom === p()) || e.tag === "select" && n !== null && e.dom.value === "" + i || e.tag === "option" && n !== null && e.dom.value === "" + i) return;
                        if (o && "" + i != "") {
                            console.error("`value` is read-only on file inputs!");
                            return
                        }
                    }
                    e.dom[t] = i
                } else typeof i == "boolean" ? i ? e.dom.setAttribute(t, "") : e.dom.removeAttribute(t) : e.dom.setAttribute(t === "className" ? "class" : t, i)
            }
        }

        function J(e, t, n, i) {
            if (!(t === "key" || t === "is" || n == null || A(t)))
                if (t[0] === "o" && t[1] === "n") T(e, t, void 0);
                else if (t === "style") E(e.dom, n, null);
                else if (I(e, t, i) && t !== "className" && t !== "title" && !(t === "value" && (e.tag === "option" || e.tag === "select" && e.dom.selectedIndex === -1 && e.dom === p())) && !(e.tag === "input" && t === "type")) e.dom[t] = null;
                else {
                    var s = t.indexOf(":");
                    s !== -1 && (t = t.slice(s + 1)), n !== !1 && e.dom.removeAttribute(t === "className" ? "class" : t)
                }
        }

        function q(e, t) {
            if ("value" in t)
                if (t.value === null) e.dom.selectedIndex !== -1 && (e.dom.value = null);
                else {
                    var n = "" + t.value;
                    (e.dom.value !== n || e.dom.selectedIndex === -1) && (e.dom.value = n)
                }
            "selectedIndex" in t && k(e, "selectedIndex", null, t.selectedIndex, void 0)
        }

        function $(e, t, n, i) {
            if (t && t === n && console.warn("Don't reuse attrs object, use new object for every redraw, this will throw in next major"), n != null) {
                e.tag === "input" && n.type != null && e.dom.setAttribute("type", n.type);
                var s = e.tag === "input" && n.type === "file";
                for (var o in n) k(e, o, t && t[o], n[o], i, s)
            }
            var r;
            if (t != null)
                for (var o in t)(r = t[o]) != null && (n == null || n[o] == null) && J(e, o, r, i)
        }

        function Z(e, t) {
            return t === "value" || t === "checked" || t === "selectedIndex" || t === "selected" && e.dom === p() || e.tag === "option" && e.dom.parentNode === d.activeElement
        }

        function A(e) {
            return e === "oninit" || e === "oncreate" || e === "onupdate" || e === "onremove" || e === "onbeforeremove" || e === "onbeforeupdate"
        }

        function I(e, t, n) {
            return n === void 0 && (e.tag.indexOf("-") > -1 || e.attrs != null && e.attrs.is || t !== "href" && t !== "list" && t !== "form" && t !== "width" && t !== "height") && t in e.dom
        }
        var n = /[A-Z]/g;

        function s(e) {
            return "-" + e.toLowerCase()
        }

        function S(e) {
            return e[0] === "-" && e[1] === "-" ? e : e === "cssFloat" ? "float" : e.replace(n, s)
        }

        function E(e, t, n) {
            if (t !== n)
                if (n == null) e.style.cssText = "";
                else if (typeof n != "object") e.style.cssText = n;
                else if (t == null || typeof t != "object") {
                    e.style.cssText = "";
                    for (var i in n) {
                        var s = n[i];
                        s != null && e.style.setProperty(S(i), String(s))
                    }
                } else {
                    for (var i in n) {
                        var s = n[i];
                        s != null && (s = String(s)) !== String(t[i]) && e.style.setProperty(S(i), s)
                    }
                    for (var i in t) t[i] != null && n[i] == null && e.style.removeProperty(S(i))
                }
        }

        function i() {
            this._ = c
        }
        i.prototype = Object.create(null), i.prototype.handleEvent = function(e) {
            var t = this["on" + e.type],
                n;
            typeof t == "function" ? n = t.call(e.currentTarget, e) : typeof t.handleEvent == "function" && t.handleEvent(e), this._ && e.redraw !== !1 && (0, this._)(), n === !1 && (e.preventDefault(), e.stopPropagation())
        };

        function T(e, t, n) {
            if (e.events != null) {
                if (e.events._ = c, e.events[t] === n) return;
                n != null && (typeof n == "function" || typeof n == "object") ? (e.events[t] == null && e.dom.addEventListener(t.slice(2), e.events, !1), e.events[t] = n) : (e.events[t] != null && e.dom.removeEventListener(t.slice(2), e.events, !1), e.events[t] = void 0)
            } else n != null && (typeof n == "function" || typeof n == "object") && (e.events = new i, e.dom.addEventListener(t.slice(2), e.events, !1), e.events[t] = n)
        }

        function O(e, t, n) {
            typeof e.oninit == "function" && h.call(e.oninit, t), typeof e.oncreate == "function" && n.push(h.bind(e.oncreate, t))
        }

        function L(e, t, n) {
            typeof e.onupdate == "function" && n.push(h.bind(e.onupdate, t))
        }

        function ee(e, t) {
            do {
                if (e.attrs != null && typeof e.attrs.onbeforeupdate == "function") {
                    var n = h.call(e.attrs.onbeforeupdate, e, t);
                    if (n !== void 0 && !n) break
                }
                if (typeof e.tag != "string" && typeof e.state.onbeforeupdate == "function") {
                    var n = h.call(e.state.onbeforeupdate, e, t);
                    if (n !== void 0 && !n) break
                }
                return !1
            } while (!1);
            return e.dom = t.dom, e.domSize = t.domSize, e.instance = t.instance, e.attrs = t.attrs, e.children = t.children, e.text = t.text, !0
        }
        var F;
        return function(e, t, n) {
            if (!e) throw new TypeError("DOM element being rendered to does not exist.");
            if (F != null && e.contains(F)) throw new TypeError("Node is currently being rendered to and thus is locked.");
            var i = c,
                s = F,
                o = [],
                r = p(),
                a = e.namespaceURI;
            F = e, c = typeof n == "function" ? n : void 0;
            try {
                e.vnodes == null && (e.textContent = ""), t = te.normalizeChildren(Array.isArray(t) ? t : [t]), m(e, e.vnodes, t, o, null, a === "http://www.w3.org/1999/xhtml" ? void 0 : a), e.vnodes = t, r != null && p() !== r && typeof r.focus == "function" && r.focus();
                for (var l = 0; l < o.length; l++) o[l]()
            } finally {
                c = i, F = s
            }
        }
    }, sd
}
var ad, ld;

function cd() {
    return ld || (ld = 1, ad = rd()(typeof window < "u" ? window : null)), ad
}
var dd = Pc(),
    ud = function(i, e, t) {
        var s = [],
            n = !1,
            o = -1;

        function r() {
            for (o = 0; o < s.length; o += 2) try {
                i(s[o], dd(s[o + 1]), a)
            } catch (e) {
                t.error(e)
            }
            o = -1
        }

        function a() {
            n || (n = !0, e(function() {
                n = !1, r()
            }))
        }
        a.sync = r;

        function l(e, t) {
            if (t != null && t.view == null && typeof t != "function") throw new TypeError("m.mount expects a component, not a vnode.");
            var n = s.indexOf(e);
            n >= 0 && (s.splice(n, 2), n <= o && (o -= 2), i(e, [])), t != null && (s.push(e, t), i(e, dd(t), a))
        }
        return {
            mount: l,
            redraw: a
        }
    },
    fd = cd(),
    hd = ud(fd, typeof requestAnimationFrame < "u" ? requestAnimationFrame : null, typeof console < "u" ? console : null),
    pd, md;

function gd() {
    return md || (md = 1, pd = function(e) {
        if (Object.prototype.toString.call(e) !== "[object Object]") return "";
        var i = [];
        for (var t in e) s(t, e[t]);
        return i.join("&");

        function s(e, t) {
            if (Array.isArray(t))
                for (var n = 0; n < t.length; n++) s(e + "[" + n + "]", t[n]);
            else if (Object.prototype.toString.call(t) === "[object Object]")
                for (var n in t) s(e + "[" + n + "]", t[n]);
            else i.push(encodeURIComponent(e) + (t != null && t !== "" ? "=" + encodeURIComponent(t) : ""))
        }
    }), pd
}
var yd, xd;

function wd() {
    if (xd) return yd;
    xd = 1;
    var i = Nc;
    return yd = Object.assign || function(e, t) {
        for (var n in t) i.call(t, n) && (e[n] = t[n])
    }, yd
}
var bd, vd;

function kd() {
    if (vd) return bd;
    vd = 1;
    var m = gd(),
        g = wd();
    return bd = function(e, i) {
        if (/:([^\/\.-]+)(\.{3})?:/.test(e)) throw new SyntaxError("Template parameter names must be separated by either a '/', '-', or '.'.");
        if (i == null) return e;
        var t = e.indexOf("?"),
            n = e.indexOf("#"),
            s = n < 0 ? e.length : n,
            o = t < 0 ? s : t,
            r = e.slice(0, o),
            a = {};
        g(a, i);
        var l = r.replace(/:([^\/\.-]+)(\.{3})?/g, function(e, t, n) {
            return delete a[t], i[t] == null ? e : n ? i[t] : encodeURIComponent(String(i[t]))
        }),
            c = l.indexOf("?"),
            d = l.indexOf("#"),
            u = d < 0 ? l.length : d,
            f = c < 0 ? u : c,
            h = l.slice(0, f);
        t >= 0 && (h += e.slice(t, s)), c >= 0 && (h += (t < 0 ? "?" : "&") + l.slice(c, u));
        var p = m(a);
        return p && (h += (t < 0 && c < 0 ? "?" : "&") + p), n >= 0 && (h += e.slice(n)), d >= 0 && (h += (n < 0 ? "" : "&") + l.slice(d)), h
    }, bd
}
var Ad = kd(),
    Id = Nc,
    Sd = function(m, n, l) {
        var r = 0;

        function c(e) {
            return new n(e)
        }
        c.prototype = n.prototype, c.__proto__ = n;

        function e(a) {
            return function(t, i) {
                typeof t != "string" ? (i = t, t = t.url) : i == null && (i = {});
                var e = new n(function(n, e) {
                    a(Ad(t, i.params), i, function(e) {
                        if (typeof i.type == "function")
                            if (Array.isArray(e))
                                for (var t = 0; t < e.length; t++) e[t] = new i.type(e[t]);
                            else e = new i.type(e);
                        n(e)
                    }, e)
                });
                if (i.background === !0) return e;
                var s = 0;

                function o() {
                    --s === 0 && typeof l == "function" && l()
                }
                return r(e);

                function r(t) {
                    var n = t.then;
                    return t.constructor = c, t.then = function() {
                        s++;
                        var e = n.apply(t, arguments);
                        return e.then(o, function(e) {
                            if (o(), s === 0) throw e
                        }), r(e)
                    }, t
                }
            }
        }

        function g(e, t) {
            for (var n in e.headers)
                if (Id.call(e.headers, n) && n.toLowerCase() === t) return !0;
            return !1
        }
        return {
            request: e(function(r, a, l, c) {
                var e = a.method != null ? a.method.toUpperCase() : "GET",
                    t = a.body,
                    n = (a.serialize == null || a.serialize === JSON.serialize) && !(t instanceof m.FormData || t instanceof m.URLSearchParams),
                    d = a.responseType || (typeof a.extract == "function" ? "" : "json"),
                    u = new m.XMLHttpRequest,
                    f = !1,
                    h = !1,
                    i = u,
                    s, o = u.abort;
                u.abort = function() {
                    f = !0, o.call(this)
                }, u.open(e, r, a["async"] !== !1, typeof a.user == "string" ? a.user : void 0, typeof a.password == "string" ? a.password : void 0), n && t != null && !g(a, "content-type") && u.setRequestHeader("Content-Type", "application/json; charset=utf-8"), typeof a.deserialize != "function" && !g(a, "accept") && u.setRequestHeader("Accept", "application/json, text/*"), a.withCredentials && (u.withCredentials = a.withCredentials), a.timeout && (u.timeout = a.timeout), u.responseType = d;
                for (var p in a.headers) Id.call(a.headers, p) && u.setRequestHeader(p, a.headers[p]);
                u.onreadystatechange = function(t) {
                    if (!f && t.target.readyState === 4) try {
                        var e = t.target.status >= 200 && t.target.status < 300 || t.target.status === 304 || /^file:\/\//i.test(r),
                            n = t.target.response,
                            i;
                        if (d === "json") {
                            if (!t.target.responseType && typeof a.extract != "function") try {
                                n = E(t.target.responseText)
                            } catch {
                                n = null
                            }
                        } else(!d || d === "text") && n == null && (n = t.target.responseText);
                        if (typeof a.extract == "function" ? (n = a.extract(t.target, a), e = !0) : typeof a.deserialize == "function" && (n = a.deserialize(n)), e) l(n);
                        else {
                            var s = function() {
                                try {
                                    i = t.target.responseText
                                } catch {
                                    i = n
                                }
                                var e = new Error(i);
                                e.code = t.target.status, e.response = n, c(e)
                            };
                            u.status === 0 ? setTimeout(function() {
                                h || s()
                            }) : s()
                        }
                    } catch (o) {
                        c(o)
                    }
                }, u.ontimeout = function(e) {
                    h = !0;
                    var t = new Error("Request timed out");
                    t.code = e.target.status, c(t)
                }, typeof a.config == "function" && (u = a.config(u, a, r) || u, u !== i && (s = u.abort, u.abort = function() {
                    f = !0, s.call(this)
                })), t == null ? u.send() : typeof a.serialize == "function" ? u.send(a.serialize(t)) : t instanceof m.FormData || t instanceof m.URLSearchParams ? u.send(t) : u.send(le(t))
            }),
            jsonp: e(function(e, t, n, i) {
                var s = t.callbackName || "_mithril_" + H(Math.random() * 1e16) + "_" + r++,
                    o = m.document.createElement("script");
                m[s] = function(e) {
                    delete m[s], o.parentNode.removeChild(o), n(e)
                }, o.onerror = function() {
                    delete m[s], o.parentNode.removeChild(o), i(new Error("JSONP request failed"))
                }, o.src = e + (e.indexOf("?") < 0 ? "?" : "&") + encodeURIComponent(t.callbackKey || "callback") + "=" + encodeURIComponent(s), m.document.documentElement.appendChild(o)
            })
        }
    },
    Ed = $c,
    Td = hd,
    Cd = Sd(typeof window < "u" ? window : null, Ed, Td.redraw),
    Bd, Dd;

function Pd() {
    if (Dd) return Bd;
    Dd = 1;

    function m(e) {
        try {
            return decodeURIComponent(e)
        } catch {
            return e
        }
    }
    return Bd = function(e) {
        if (e === "" || e == null) return {};
        e.charAt(0) === "?" && (e = e.slice(1));
        for (var t = e.split("&"), n = {}, i = {}, s = 0; s < t.length; s++) {
            var o = t[s].split("="),
                r = m(o[0]),
                a = o.length === 2 ? m(o[1]) : "";
            a === "true" ? a = !0 : a === "false" && (a = !1);
            var l = r.split(/\]\[?|\[/),
                c = i;
            r.indexOf("[") > -1 && l.pop();
            for (var d = 0; d < l.length; d++) {
                var u = l[d],
                    f = l[d + 1],
                    h = f == "" || !isNaN(parseInt(f, 10));
                if (u === "") {
                    var r = l.slice(0, d).join();
                    n[r] == null && (n[r] = Array.isArray(c) ? c.length : 0), u = n[r]++
                } else if (u === "__proto__") break;
                if (d === l.length - 1) c[u] = a;
                else {
                    var p = Object.getOwnPropertyDescriptor(c, u);
                    p != null && (p = p.value), p == null && (c[u] = p = h ? [] : {}), c = p
                }
            }
        }
        return i
    }, Bd
}
var Rd, Md;

function Nd() {
    if (Md) return Rd;
    Md = 1;
    var r = Pd();
    return Rd = function(e) {
        var t = e.indexOf("?"),
            n = e.indexOf("#"),
            i = n < 0 ? e.length : n,
            s = t < 0 ? i : t,
            o = e.slice(0, s).replace(/\/{2,}/g, "/");
        return o ? (o[0] !== "/" && (o = "/" + o), o.length > 1 && o[o.length - 1] === "/" && (o = o.slice(0, -1))) : o = "/", {
            path: o,
            params: t < 0 ? {} : r(e.slice(t + 1, i))
        }
    }, Rd
}
var Od, Ld;

function Fd() {
    if (Ld) return Od;
    Ld = 1;
    var t = Nd();
    return Od = function(e) {
        var i = t(e),
            s = Object.keys(i.params),
            o = [],
            r = new RegExp("^" + i.path.replace(/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g, function(e, t, n) {
                return t == null ? "\\" + e : (o.push({
                    k: t,
                    r: n === "..."
                }), n === "..." ? "(.*)" : n === "." ? "([^/]+)\\." : "([^/]+)" + (n || ""))
            }) + "$");
        return function(e) {
            for (var t = 0; t < s.length; t++)
                if (i.params[s[t]] !== e.params[s[t]]) return !1;
            if (!o.length) return r.test(e.path);
            var n = r.exec(e.path);
            if (n == null) return !1;
            for (var t = 0; t < o.length; t++) e.params[o[t].k] = o[t].r ? n[t + 1] : decodeURIComponent(n[t + 1]);
            return !0
        }
    }, Od
}
var _d, Vd;

function Ud() {
    if (Vd) return _d;
    Vd = 1;
    var s = Nc,
        o = new RegExp("^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$");
    return _d = function(e, t) {
        var n = {};
        if (t != null)
            for (var i in e) s.call(e, i) && !o.test(i) && t.indexOf(i) < 0 && (n[i] = e[i]);
        else
            for (var i in e) s.call(e, i) && !o.test(i) && (n[i] = e[i]);
        return n
    }, _d
}
var jd, Hd;

function Wd() {
    if (Hd) return jd;
    Hd = 1;
    var n = Pc(),
        l = Qc,
        i = $c,
        A = kd(),
        I = Nd(),
        S = Fd(),
        E = wd(),
        T = Ud(),
        C = {};

    function B(e) {
        try {
            return decodeURIComponent(e)
        } catch {
            return e
        }
    }
    return jd = function(c, d) {
        var e = c == null ? null : typeof c.setImmediate == "function" ? c.setImmediate : c.setTimeout,
            u = i.resolve(),
            t = !1,
            o = !1,
            f = 0,
            h, p, m = C,
            g, y, x, w, s = {
                onbeforeupdate: function() {
                    return f = f ? 2 : 1, !(!f || C === m)
                },
                onremove: function() {
                    c.removeEventListener("popstate", a, !1), c.removeEventListener("hashchange", r, !1)
                },
                view: function() {
                    if (!(!f || C === m)) {
                        var e = [n(g, y.key, y)];
                        return m && (e = m.render(e[0])), e
                    }
                }
            },
            b = k.SKIP = {};

        function r() {
            t = !1;
            var e = c.location.hash;
            k.prefix[0] !== "#" && (e = c.location.search + e, k.prefix[0] !== "?" && (e = c.location.pathname + e, e[0] !== "/" && (e = "/" + e)));
            var o = e.concat().replace(/(?:%[a-f89][a-f0-9])+/gim, B).slice(k.prefix.length),
                r = I(o);
            E(r.params, c.history.state);

            function a(e) {
                console.error(e), v(p, null, {
                    replace: !0
                })
            }
            l(0);

            function l(t) {
                for (; t < h.length; t++)
                    if (h[t].check(r)) {
                        var n = h[t].component,
                            e = h[t].route,
                            i = n,
                            s = w = function(e) {
                                if (s === w) {
                                    if (e === b) return l(t + 1);
                                    g = e != null && (typeof e.view == "function" || typeof e == "function") ? e : "div", y = r.params, x = o, w = null, m = n.render ? n : null, f === 2 ? d.redraw() : (f = 2, d.redraw.sync())
                                }
                            };
                        n.view || typeof n == "function" ? (n = {}, s(i)) : n.onmatch ? u.then(function() {
                            return n.onmatch(r.params, o, e)
                        }).then(s, o === p ? null : a) : s("div");
                        return
                    } if (o === p) throw new Error("Could not resolve default route " + p + ".");
                v(p, null, {
                    replace: !0
                })
            }
        }

        function a() {
            t || (t = !0, e(r))
        }

        function v(e, t, n) {
            if (e = A(e, t), o) {
                a();
                var i = n ? n.state : null,
                    s = n ? n.title : null;
                n && n.replace ? c.history.replaceState(i, s, k.prefix + e) : c.history.pushState(i, s, k.prefix + e)
            } else c.location.href = k.prefix + e
        }

        function k(e, t, n) {
            if (!e) throw new TypeError("DOM element being rendered to does not exist.");
            if (h = Object.keys(n).map(function(e) {
                if (e[0] !== "/") throw new SyntaxError("Routes must start with a '/'.");
                if (/:([^\/\.-]+)(\.{3})?:/.test(e)) throw new SyntaxError("Route parameter names must be separated with either '/', '.', or '-'.");
                return {
                    route: e,
                    component: n[e],
                    check: S(e)
                }
            }), p = t, t != null) {
                var i = I(t);
                if (!h.some(function(e) {
                    return e.check(i)
                })) throw new ReferenceError("Default route doesn't match any known routes.")
            }
            typeof c.history.pushState == "function" ? c.addEventListener("popstate", a, !1) : k.prefix[0] === "#" && c.addEventListener("hashchange", r, !1), o = !0, d.mount(e, s), r()
        }
        return k.set = function(e, t, n) {
            w != null && (n = n || {}, n.replace = !0), w = null, v(e, t, n)
        }, k.get = function() {
            return x
        }, k.prefix = "#!", k.Link = {
            view: function(e) {
                var t = l(e.attrs.selector || "a", T(e.attrs, ["options", "params", "selector", "onclick"]), e.children),
                    n, i, s;
                return (t.attrs.disabled = Boolean(t.attrs.disabled)) ? (t.attrs.href = null, t.attrs["aria-disabled"] = "true") : (n = e.attrs.options, i = e.attrs.onclick, s = A(t.attrs.href, e.attrs.params), t.attrs.href = k.prefix + s, t.attrs.onclick = function(e) {
                    var t;
                    typeof i == "function" ? t = i.call(e.currentTarget, e) : i == null || typeof i != "object" || typeof i.handleEvent == "function" && i.handleEvent(e), t !== !1 && !e.defaultPrevented && (e.button === 0 || e.which === 0 || e.which === 1) && (!e.currentTarget.target || e.currentTarget.target === "_self") && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && (e.preventDefault(), e.redraw = !1, k.set(s, null, n))
                }), t
            }
        }, k.param = function(e) {
            return y && e != null ? y[e] : y
        }, k
    }, jd
}
var Qd, Yd;

function zd() {
    if (Yd) return Qd;
    Yd = 1;
    var e = hd;
    return Qd = Wd()(typeof window < "u" ? window : null, e), Qd
}
var Gd = qc,
    Kd = Cd,
    Xd = hd,
    Jd = function() {
        return Gd.apply(this, arguments)
    };
Jd.m = Gd;
Jd.trust = Gd.trust;
Jd.fragment = Gd.fragment;
Jd.Fragment = "[";
Jd.mount = Xd.mount;
Jd.route = zd();
Jd.render = cd();
Jd.redraw = Xd.redraw;
Jd.request = Kd.request;
Jd.jsonp = Kd.jsonp;
Jd.parseQueryString = Pd();
Jd.buildQueryString = gd();
Jd.parsePathname = Nd();
Jd.buildPathname = kd();
Jd.vnode = Pc();
Jd.PromisePolyfill = nd();
Jd.censor = Ud();
var qd = Jd;

function $d(e, t, n, i, s) {
    this.debugLog = !1, this.baseUrl = e, this.lobbySize = n, this.devPort = t, this.lobbySpread = i, this.rawIPs = !!s, this.server = void 0, this.gameIndex = void 0, this.callback = void 0, this.errorCallback = void 0
}
$d.prototype.regionInfo = {
    0: {
        name: "Local",
        latitude: 0,
        longitude: 0
    },
    "us-east": {
        name: "Miami",
        latitude: 40.1393329,
        longitude: -75.8521818
    },
    miami: {
        name: "Miami",
        latitude: 40.1393329,
        longitude: -75.8521818
    },
    "us-west": {
        name: "Silicon Valley",
        latitude: 47.6149942,
        longitude: -122.4759879
    },
    siliconvalley: {
        name: "Silicon Valley",
        latitude: 47.6149942,
        longitude: -122.4759879
    },
    gb: {
        name: "London",
        latitude: 51.5283063,
        longitude: -.382486
    },
    london: {
        name: "London",
        latitude: 51.5283063,
        longitude: -.382486
    },
    "eu-west": {
        name: "Frankfurt",
        latitude: 50.1211273,
        longitude: 8.496137
    },
    frankfurt: {
        name: "Frankfurt",
        latitude: 50.1211273,
        longitude: 8.496137
    },
    au: {
        name: "Sydney",
        latitude: -33.8479715,
        longitude: 150.651084
    },
    sydney: {
        name: "Sydney",
        latitude: -33.8479715,
        longitude: 150.651084
    },
    saopaulo: {
        name: "São Paulo",
        latitude: 23.5558,
        longitude: 46.6396
    },
    sg: {
        name: "Singapore",
        latitude: 1.3147268,
        longitude: 103.7065876
    },
    singapore: {
        name: "Singapore",
        latitude: 1.3147268,
        longitude: 103.7065876
    }
};
$d.prototype.start = function(e, t, n, i) {
    if (this.callback = t, this.errorCallback = n, i) return t();
    const s = this.parseServerQuery(e);
    s && s.length > 0 ? (this.log("Found server in query."), this.password = s[3], this.connect(s[0], s[1], s[2])) : this.errorCallback("Unable to find server")
};
$d.prototype.parseServerQuery = function(e) {
    const t = new URLSearchParams(location.search, !0),
          n = e || t.get("server");
    if (typeof n != "string") return [];
    const [i, s] = n.split(":");
    return [i, s, t.get("password")]
};
$d.prototype.findServer = function(e, t) {
    var n = this.servers[e];
    for (let e = 0; e < n.length; e++) {
        const i = n[e];
        if (i.name === t) return i
    }
    console.warn("Could not find server in region " + e + " with serverName " + t + ".")
};
$d.prototype.seekServer = function(e, t, n) {
    n == null && (n = "random"), t == null && (t = !1);
    const i = ["random"],
          s = this.lobbySize,
          o = this.lobbySpread,
          r = this.servers[e].flatMap(function(n) {
              let i = 0;
              return n.games.map(function(e) {
                  const t = i++;
                  return {
                      region: n.region,
                      index: n.index * n.games.length + t,
                      gameIndex: t,
                      gameCount: n.games.length,
                      playerCount: e.playerCount,
                      playerCapacity: 50,
                      isPrivate: e.isPrivate
                  }
              })
          }).filter(function(e) {
              return !e.isPrivate
          }).filter(function(e) {
              return t ? e.playerCount == 0 && e.gameIndex >= e.gameCount / 2 : !0
          }).filter(function(e) {
              return n == "random" ? !0 : i[e.index % i.length].key == n
          }).sort(function(e, t) {
              return t.playerCount - e.playerCount
          }).filter(function(e) {
              return e.playerCount < s
          });
    if (t && r.reverse(), r.length == 0) {
        this.errorCallback("No open servers.");
        return
    }
    const a = j(o, r.length);
    var l = f(Math.random() * a);
    l = j(l, r.length - 1);
    const c = r[l],
          d = c.region;
    var l = f(c.index / c.gameCount);
    const u = c.index % c.gameCount;
    return this.log("Found server."), [d, l, u]
};
$d.prototype.connect = function(e, t, n) {
    if (this.connected) return;
    const i = this.findServer(e, t);
    if (i == null) {
        this.errorCallback("Failed to find server for region " + e + " and serverName " + t);
        return
    }
    if (this.log("Connecting to server", i, "with game index", n), i.playerCount >= 50) {
        this.errorCallback("Server is already full.");
        return
    }
    window.history.replaceState(document.title, document.title, this.generateHref(e, t, this.password)), this.server = i, this.gameIndex = n, this.log("Calling callback with address", this.serverAddress(i), "on port", this.serverPort(i)), this.callback(this.serverAddress(i), this.serverPort(i), n), Zd && clearInterval(Zd)
};
$d.prototype.switchServer = function(e, t) {
    this.switchingServers = !0, window.location = this.generateHref(e, t, null)
};
$d.prototype.generateHref = function(e, t, n) {
    let i = window.location.href.split("?")[0];
    return i += "?server=" + e + ":" + t, n && (i += "&password=" + encodeURIComponent(n)), i
};
$d.prototype.serverAddress = function(e) {
    return e.region == 0 ? "localhost" : e.key + "." + e.region + "." + this.baseUrl
};
$d.prototype.serverPort = function(e) {
    return e.port
};
let Zd;

function eu(e) {
    e = e.filter(e => e.playerCount !== 50);
    const t = j(...e.map(e => e.ping || 1 / 0)),
          n = e.filter(e => e.ping === t);
    return !n.length > 0 ? null : n.reduce((e, t) => e.playerCount > t.playerCount ? e : t)
}
$d.prototype.processServers = function(l) {
    return Zd && clearInterval(Zd), new Promise(e => {
        const a = {},
              t = e => {
                  const n = a[e],
                        t = n[0];
                  let i = this.serverAddress(t);
                  const s = this.serverPort(t);
                  s && (i += `:${s}`);
                  const o = `https://${i}/ping`,
                        r = (new Date).getTime();
                  return Promise.race([fetch(o).then(() => {
                      const t = (new Date).getTime() - r;
                      n.forEach(e => {
                          e.pings = e.pings ?? [], e.pings.push(t), e.pings.length > 10 && e.pings.shift(), e.ping = f(e.pings.reduce((e, t) => e + t, 0) / e.pings.length)
                      })
                  })["catch"](() => {}), new Promise(e => setTimeout(() => e(), 100))])
              },
              n = async () => {
                  await Promise.all(Object.keys(a).map(t)), window.blockRedraw || qd.redraw()
              };
        l.forEach(e => {
            a[e.region] = a[e.region] || [], a[e.region].push(e)
        });
        for (const r in a) a[r] = a[r].sort(function(e, t) {
            return t.playerCount - e.playerCount
        });
        this.servers = a;
        let i;
        const [s, o] = this.parseServerQuery();
        l.forEach(e => {
            s === e.region && o === e.name && (e.selected = !0, i = e)
        }), n().then(n).then(() => {
            if (i) return;
            let e = eu(l);
            e || (e = l[0]), e && (e.selected = !0, window.history.replaceState(document.title, document.title, this.generateHref(e.region, e.name, this.password))), window.blockRedraw || qd.redraw()
        }).then(n)["catch"](e => {})["finally"](e), Zd = setInterval(n, 5e3)
    })
};
$d.prototype.ipToHex = function(e) {
    return e.split(".").map(e => ("00" + parseInt(e).toString(16)).substr(-2)).join("").toLowerCase()
};
$d.prototype.hashIP = function(e) {
    return bc(this.ipToHex(e))
};
$d.prototype.log = function() {
    if (this.debugLog) return console.log.apply(void 0, arguments);
    if (console.verbose) return console.verbose.apply(void 0, arguments)
};
$d.prototype.stripRegion = function(e) {
    return e.startsWith("vultr:") ? e = e.slice(6) : e.startsWith("do:") && (e = e.slice(3)), e
};
const tu = function(e, t) {
    return e.concat(t)
},
      nu = function(e, t) {
          return t.map(e).reduce(tu, [])
      };
Array.prototype.flatMap = function(e) {
    return nu(e, this)
};
const iu = (e, t) => {
    const n = t.x - e.x,
          i = t.y - e.y;
    return D(n * n + i * i)
},
      su = (e, t) => {
          const n = t.x - e.x,
                i = t.y - e.y;
          return au(P(i, n))
      },
      ou = (e, t, n) => {
          const i = {
              x: 0,
              y: 0
          };
          return n = ru(n), i.x = e.x - t * U(n), i.y = e.y - t * V(n), i
      },
      ru = e => e * (W / 180),
      au = e => e * (180 / W),
      lu = e => isNaN(e.buttons) ? e.pressure !== 0 : e.buttons !== 0,
      cu = new Map,
      du = e => {
          cu.has(e) && clearTimeout(cu.get(e)), cu.set(e, setTimeout(e, 100))
      },
      uu = (t, e, n) => {
          const i = e.split(/[ ,]+/g);
          let s;
          for (let e = 0; e < i.length; e += 1) s = i[e], t.addEventListener ? t.addEventListener(s, n, !1) : t.attachEvent && t.attachEvent(s, n)
      },
      fu = (t, e, n) => {
          const i = e.split(/[ ,]+/g);
          let s;
          for (let e = 0; e < i.length; e += 1) s = i[e], t.removeEventListener ? t.removeEventListener(s, n) : t.detachEvent && t.detachEvent(s, n)
      },
      hu = e => (e.preventDefault(), e.type.match(/^touch/) ? e.changedTouches : e),
      pu = () => {
          const e = window.pageXOffset !== void 0 ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
                t = window.pageYOffset !== void 0 ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
          return {
              x: e,
              y: t
          }
      },
      mu = (e, t) => {
          t.top || t.right || t.bottom || t.left ? (e.style.top = t.top, e.style.right = t.right, e.style.bottom = t.bottom, e.style.left = t.left) : (e.style.left = t.x + "px", e.style.top = t.y + "px")
      },
      gu = (e, i, s) => {
          const t = xu(e);
          for (let e in t)
              if (t.hasOwnProperty(e))
                  if (typeof i == "string") t[e] = i + " " + s;
                  else {
                      let n = "";
                      for (let e = 0, t = i.length; e < t; e += 1) n += i[e] + " " + s + ", ";
                      t[e] = n.slice(0, -2)
                  } return t
      },
      yu = (e, t) => {
          const n = xu(e);
          for (let e in n) n.hasOwnProperty(e) && (n[e] = t);
          return n
      },
      xu = t => {
          const n = {};
          return n[t] = "", ["webkit", "Moz", "o"].forEach(function(e) {
              n[e + t.charAt(0).toUpperCase() + t.slice(1)] = ""
          }), n
      },
      wu = (t, n) => {
          for (let e in n) n.hasOwnProperty(e) && (t[e] = n[e]);
          return t
      },
      bu = (t, n) => {
          const i = {};
          for (let e in t) t.hasOwnProperty(e) && n.hasOwnProperty(e) ? i[e] = n[e] : t.hasOwnProperty(e) && (i[e] = t[e]);
          return i
      },
      vu = (n, i) => {
          if (n.length)
              for (let e = 0, t = n.length; e < t; e += 1) i(n[e]);
          else i(n)
      },
      ku = (e, t, n) => ({
          x: j(oe(e.x, t.x - n), t.x + n),
          y: j(oe(e.y, t.y - n), t.y + n)
      });
var Au = "ontouchstart" in window,
    Iu = !!window.PointerEvent,
    Su = !!window.MSPointerEvent,
    Eu = {
        touch: {
            start: "touchstart",
            move: "touchmove",
            end: "touchend, touchcancel"
        },
        mouse: {
            start: "mousedown",
            move: "mousemove",
            end: "mouseup"
        },
        pointer: {
            start: "pointerdown",
            move: "pointermove",
            end: "pointerup, pointercancel"
        },
        MSPointer: {
            start: "MSPointerDown",
            move: "MSPointerMove",
            end: "MSPointerUp"
        }
    },
    Tu, Cu = {};
Iu ? Tu = Eu.pointer : Su ? Tu = Eu.MSPointer : Au ? (Tu = Eu.touch, Cu = Eu.mouse) : Tu = Eu.mouse;

function Bu() {}
Bu.prototype.on = function(e, t) {
    var n = this,
        i = e.split(/[ ,]+/g),
        s;
    n._handlers_ = n._handlers_ || {};
    for (var o = 0; o < i.length; o += 1) s = i[o], n._handlers_[s] = n._handlers_[s] || [], n._handlers_[s].push(t);
    return n
};
Bu.prototype.off = function(e, t) {
    var n = this;
    return n._handlers_ = n._handlers_ || {}, e === void 0 ? n._handlers_ = {} : t === void 0 ? n._handlers_[e] = null : n._handlers_[e] && n._handlers_[e].indexOf(t) >= 0 && n._handlers_[e].splice(n._handlers_[e].indexOf(t), 1), n
};
Bu.prototype.trigger = function(e, t) {
    var n = this,
        i = e.split(/[ ,]+/g),
        s;
    n._handlers_ = n._handlers_ || {};
    for (var o = 0; o < i.length; o += 1) s = i[o], n._handlers_[s] && n._handlers_[s].length && n._handlers_[s].forEach(function(e) {
        e.call(n, {
            type: s,
            target: n
        }, t)
    })
};
Bu.prototype.config = function(e) {
    var t = this;
    t.options = t.defaults || {}, e && (t.options = bu(t.options, e))
};
Bu.prototype.bindEvt = function(e, t) {
    var n = this;
    return n._domHandlers_ = n._domHandlers_ || {}, n._domHandlers_[t] = function() {
        typeof n["on" + t] == "function" ? n["on" + t].apply(n, arguments) : console.warn('[WARNING] : Missing "on' + t + '" handler.')
    }, uu(e, Tu[t], n._domHandlers_[t]), Cu[t] && uu(e, Cu[t], n._domHandlers_[t]), n
};
Bu.prototype.unbindEvt = function(e, t) {
    var n = this;
    return n._domHandlers_ = n._domHandlers_ || {}, fu(e, Tu[t], n._domHandlers_[t]), Cu[t] && fu(e, Cu[t], n._domHandlers_[t]), delete n._domHandlers_[t], this
};

function Du(e, t) {
    return this.identifier = t.identifier, this.position = t.position, this.frontPosition = t.frontPosition, this.collection = e, this.defaults = {
        size: 100,
        threshold: .1,
        color: "white",
        fadeTime: 250,
        dataOnly: !1,
        restJoystick: !0,
        restOpacity: .5,
        mode: "dynamic",
        zone: document.body,
        lockX: !1,
        lockY: !1,
        shape: "circle"
    }, this.config(t), this.options.mode === "dynamic" && (this.options.restOpacity = 0), this.id = Du.id, Du.id += 1, this.buildEl().stylize(), this.instance = {
        el: this.ui.el,
        on: this.on.bind(this),
        off: this.off.bind(this),
        show: this.show.bind(this),
        hide: this.hide.bind(this),
        add: this.addToDom.bind(this),
        remove: this.removeFromDom.bind(this),
        destroy: this.destroy.bind(this),
        setPosition: this.setPosition.bind(this),
        resetDirection: this.resetDirection.bind(this),
        computeDirection: this.computeDirection.bind(this),
        trigger: this.trigger.bind(this),
        position: this.position,
        frontPosition: this.frontPosition,
        ui: this.ui,
        identifier: this.identifier,
        id: this.id,
        options: this.options
    }, this.instance
}
Du.prototype = new Bu;
Du.constructor = Du;
Du.id = 0;
Du.prototype.buildEl = function(e) {
    return this.ui = {}, this.options.dataOnly ? this : (this.ui.el = document.createElement("div"), this.ui.back = document.createElement("div"), this.ui.front = document.createElement("div"), this.ui.el.className = "nipple collection_" + this.collection.id, this.ui.back.className = "back", this.ui.front.className = "front", this.ui.el.setAttribute("id", "nipple_" + this.collection.id + "_" + this.id), this.ui.el.appendChild(this.ui.back), this.ui.el.appendChild(this.ui.front), this)
};
Du.prototype.stylize = function() {
    if (this.options.dataOnly) return this;
    var e = this.options.fadeTime + "ms",
        t = yu("borderRadius", "50%"),
        n = gu("transition", "opacity", e),
        i = {};
    return i.el = {
        position: "absolute",
        opacity: this.options.restOpacity,
        display: "block",
        zIndex: 999
    }, i.back = {
        position: "absolute",
        display: "block",
        width: this.options.size + "px",
        height: this.options.size + "px",
        marginLeft: -this.options.size / 2 + "px",
        marginTop: -this.options.size / 2 + "px",
        background: this.options.color,
        opacity: ".5"
    }, i.front = {
        width: this.options.size / 2 + "px",
        height: this.options.size / 2 + "px",
        position: "absolute",
        display: "block",
        marginLeft: -this.options.size / 4 + "px",
        marginTop: -this.options.size / 4 + "px",
        background: this.options.color,
        opacity: ".5",
        transform: "translate(0px, 0px)"
    }, wu(i.el, n), this.options.shape === "circle" && wu(i.back, t), wu(i.front, t), this.applyStyles(i), this
};
Du.prototype.applyStyles = function(e) {
    for (var t in this.ui)
        if (this.ui.hasOwnProperty(t))
            for (var n in e[t]) this.ui[t].style[n] = e[t][n];
    return this
};
Du.prototype.addToDom = function() {
    return this.options.dataOnly || document.body.contains(this.ui.el) ? this : (this.options.zone.appendChild(this.ui.el), this)
};
Du.prototype.removeFromDom = function() {
    return this.options.dataOnly || !document.body.contains(this.ui.el) ? this : (this.options.zone.removeChild(this.ui.el), this)
};
Du.prototype.destroy = function() {
    clearTimeout(this.removeTimeout), clearTimeout(this.showTimeout), clearTimeout(this.restTimeout), this.trigger("destroyed", this.instance), this.removeFromDom(), this.off()
};
Du.prototype.show = function(e) {
    var t = this;
    return t.options.dataOnly || (clearTimeout(t.removeTimeout), clearTimeout(t.showTimeout), clearTimeout(t.restTimeout), t.addToDom(), t.restCallback(), setTimeout(function() {
        t.ui.el.style.opacity = 1
    }, 0), t.showTimeout = setTimeout(function() {
        t.trigger("shown", t.instance), typeof e == "function" && e.call(this)
    }, t.options.fadeTime)), t
};
Du.prototype.hide = function(t) {
    var n = this;
    if (n.options.dataOnly) return n;
    if (n.ui.el.style.opacity = n.options.restOpacity, clearTimeout(n.removeTimeout), clearTimeout(n.showTimeout), clearTimeout(n.restTimeout), n.removeTimeout = setTimeout(function() {
        var e = n.options.mode === "dynamic" ? "none" : "block";
        n.ui.el.style.display = e, typeof t == "function" && t.call(n), n.trigger("hidden", n.instance)
    }, n.options.fadeTime), n.options.restJoystick) {
        const e = n.options.restJoystick,
              i = {};
        i.x = e === !0 || e.x !== !1 ? 0 : n.instance.frontPosition.x, i.y = e === !0 || e.y !== !1 ? 0 : n.instance.frontPosition.y, n.setPosition(t, i)
    }
    return n
};
Du.prototype.setPosition = function(e, t) {
    var n = this;
    n.frontPosition = {
        x: t.x,
        y: t.y
    };
    var i = n.options.fadeTime + "ms",
        s = {};
    s.front = gu("transition", ["transform"], i);
    var o = {
        front: {}
    };
    o.front = {
        transform: "translate(" + n.frontPosition.x + "px," + n.frontPosition.y + "px)"
    }, n.applyStyles(s), n.applyStyles(o), n.restTimeout = setTimeout(function() {
        typeof e == "function" && e.call(n), n.restCallback()
    }, n.options.fadeTime)
};
Du.prototype.restCallback = function() {
    var e = this,
        t = {};
    t.front = gu("transition", "none", ""), e.applyStyles(t), e.trigger("rested", e.instance)
};
Du.prototype.resetDirection = function() {
    this.direction = {
        x: !1,
        y: !1,
        angle: !1
    }
};
Du.prototype.computeDirection = function(e) {
    var t = e.angle.radian,
        n = W / 4,
        i = W / 2,
        s, o, r;
    if (t > n && t < n * 3 && !e.lockX ? s = "up" : t > -n && t <= n && !e.lockY ? s = "left" : t > -n * 3 && t <= -n && !e.lockX ? s = "down" : e.lockY || (s = "right"), e.lockY || (t > -i && t < i ? o = "left" : o = "right"), e.lockX || (t > 0 ? r = "up" : r = "down"), e.force > this.options.threshold) {
        var a = {},
            l;
        for (l in this.direction) this.direction.hasOwnProperty(l) && (a[l] = this.direction[l]);
        var c = {};
        this.direction = {
            x: o,
            y: r,
            angle: s
        }, e.direction = this.direction;
        for (l in a) a[l] === this.direction[l] && (c[l] = !0);
        if (c.x && c.y && c.angle) return e;
        (!c.x || !c.y) && this.trigger("plain", e), c.x || this.trigger("plain:" + o, e), c.y || this.trigger("plain:" + r, e), c.angle || this.trigger("dir dir:" + s, e)
    } else this.resetDirection();
    return e
};

function Pu(e, t) {
    var n = this;
    n.nipples = [], n.idles = [], n.actives = [], n.ids = [], n.pressureIntervals = {}, n.manager = e, n.id = Pu.id, Pu.id += 1, n.defaults = {
        zone: document.body,
        multitouch: !1,
        maxNumberOfNipples: 10,
        mode: "dynamic",
        position: {
            top: 0,
            left: 0
        },
        catchDistance: 200,
        size: 100,
        threshold: .1,
        color: "white",
        fadeTime: 250,
        dataOnly: !1,
        restJoystick: !0,
        restOpacity: .5,
        lockX: !1,
        lockY: !1,
        shape: "circle",
        dynamicPage: !1,
        follow: !1
    }, n.config(t), (n.options.mode === "static" || n.options.mode === "semi") && (n.options.multitouch = !1), n.options.multitouch || (n.options.maxNumberOfNipples = 1);
    const i = getComputedStyle(n.options.zone.parentElement);
    return i && i.display === "flex" && (n.parentIsFlex = !0), n.updateBox(), n.prepareNipples(), n.bindings(), n.begin(), n.nipples
}
Pu.prototype = new Bu;
Pu.constructor = Pu;
Pu.id = 0;
Pu.prototype.prepareNipples = function() {
    var e = this,
        i = e.nipples;
    i.on = e.on.bind(e), i.off = e.off.bind(e), i.options = e.options, i.destroy = e.destroy.bind(e), i.ids = e.ids, i.id = e.id, i.processOnMove = e.processOnMove.bind(e), i.processOnEnd = e.processOnEnd.bind(e), i.get = function(e) {
        if (e === void 0) return i[0];
        for (var t = 0, n = i.length; t < n; t += 1)
            if (i[t].identifier === e) return i[t];
        return !1
    }
};
Pu.prototype.bindings = function() {
    var e = this;
    e.bindEvt(e.options.zone, "start"), e.options.zone.style.touchAction = "none", e.options.zone.style.msTouchAction = "none"
};
Pu.prototype.begin = function() {
    var e = this,
        t = e.options;
    if (t.mode === "static") {
        var n = e.createNipple(t.position, e.manager.getIdentifier());
        n.add(), e.idles.push(n)
    }
};
Pu.prototype.createNipple = function(e, t) {
    var n = this,
        i = n.manager.scroll,
        s = {},
        o = n.options,
        r = {
            x: n.parentIsFlex ? i.x : i.x + n.box.left,
            y: n.parentIsFlex ? i.y : i.y + n.box.top
        };
    if (e.x && e.y) s = {
        x: e.x - r.x,
        y: e.y - r.y
    };
    else if (e.top || e.right || e.bottom || e.left) {
        var a = document.createElement("DIV");
        a.style.display = "hidden", a.style.top = e.top, a.style.right = e.right, a.style.bottom = e.bottom, a.style.left = e.left, a.style.position = "absolute", o.zone.appendChild(a);
        var l = a.getBoundingClientRect();
        o.zone.removeChild(a), s = e, e = {
            x: l.left + i.x,
            y: l.top + i.y
        }
    }
    var c = new Du(n, {
        color: o.color,
        size: o.size,
        threshold: o.threshold,
        fadeTime: o.fadeTime,
        dataOnly: o.dataOnly,
        restJoystick: o.restJoystick,
        restOpacity: o.restOpacity,
        mode: o.mode,
        identifier: t,
        position: e,
        zone: o.zone,
        frontPosition: {
            x: 0,
            y: 0
        },
        shape: o.shape
    });
    return o.dataOnly || (mu(c.ui.el, s), mu(c.ui.front, c.frontPosition)), n.nipples.push(c), n.trigger("added " + c.identifier + ":added", c), n.manager.trigger("added " + c.identifier + ":added", c), n.bindNipple(c), c
};
Pu.prototype.updateBox = function() {
    var e = this;
    e.box = e.options.zone.getBoundingClientRect()
};
Pu.prototype.bindNipple = function(e) {
    var n = this,
        i, t = function(e, t) {
            i = e.type + " " + t.id + ":" + e.type, n.trigger(i, t)
        };
    e.on("destroyed", n.onDestroyed.bind(n)), e.on("shown hidden rested dir plain", t), e.on("dir:up dir:right dir:down dir:left", t), e.on("plain:up plain:right plain:down plain:left", t)
};
Pu.prototype.pressureFn = function(t, n, e) {
    var i = this,
        s = 0;
    clearInterval(i.pressureIntervals[e]), i.pressureIntervals[e] = setInterval(function() {
        var e = t.force || t.pressure || t.webkitForce || 0;
        e !== s && (n.trigger("pressure", e), i.trigger("pressure " + n.identifier + ":pressure", e), s = e)
    }.bind(i), 100)
};
Pu.prototype.onstart = function(n) {
    var i = this,
        t = i.options,
        s = n;
    n = hu(n), i.updateBox();
    var e = function(e) {
        i.actives.length < t.maxNumberOfNipples ? i.processOnStart(e) : s.type.match(/^touch/) && (Object.keys(i.manager.ids).forEach(function(t) {
            if (Object.values(s.touches).findIndex(function(e) {
                return e.identifier === t
            }) < 0) {
                var e = [n[0]];
                e.identifier = t, i.processOnEnd(e)
            }
        }), i.actives.length < t.maxNumberOfNipples && i.processOnStart(e))
    };
    return vu(n, e), i.manager.bindDocument(), !1
};
Pu.prototype.processOnStart = function(t) {
    var n = this,
        e = n.options,
        i, s = n.manager.getIdentifier(t),
        o = t.force || t.pressure || t.webkitForce || 0,
        r = {
            x: t.pageX,
            y: t.pageY
        },
        a = n.getOrCreate(s, r);
    a.identifier !== s && n.manager.removeIdentifier(a.identifier), a.identifier = s;
    var l = function(e) {
        e.trigger("start", e), n.trigger("start " + e.id + ":start", e), e.show(), o > 0 && n.pressureFn(t, e, e.identifier), n.processOnMove(t)
    };
    if ((i = n.idles.indexOf(a)) >= 0 && n.idles.splice(i, 1), n.actives.push(a), n.ids.push(a.identifier), e.mode !== "semi") l(a);
    else {
        var c = iu(r, a.position);
        if (c <= e.catchDistance) l(a);
        else {
            a.destroy(), n.processOnStart(t);
            return
        }
    }
    return a
};
Pu.prototype.getOrCreate = function(e, t) {
    var n = this,
        i = n.options,
        s;
    return /(semi|static)/.test(i.mode) ? (s = n.idles[0], s ? (n.idles.splice(0, 1), s) : i.mode === "semi" ? n.createNipple(t, e) : (console.warn("Coudln't find the needed nipple."), !1)) : (s = n.createNipple(t, e), s)
};
Pu.prototype.processOnMove = function(e) {
    var n = this,
        t = n.options,
        i = n.manager.getIdentifier(e),
        s = n.nipples.get(i),
        o = n.manager.scroll;
    if (!lu(e)) {
        this.processOnEnd(e);
        return
    }
    if (!s) {
        console.error("Found zombie joystick with ID " + i), n.manager.removeIdentifier(i);
        return
    }
    if (t.dynamicPage) {
        var r = s.el.getBoundingClientRect();
        s.position = {
            x: o.x + r.left,
            y: o.y + r.top
        }
    }
    s.identifier = i;
    var a = s.options.size / 2,
        l = {
            x: e.pageX,
            y: e.pageY
        };
    t.lockX && (l.y = s.position.y), t.lockY && (l.x = s.position.x);
    var c = iu(l, s.position),
        d = su(l, s.position),
        u = ru(d),
        f = c / a,
        h = {
            distance: c,
            position: l
        },
        p, m;
    if (s.options.shape === "circle" ? (p = j(c, a), m = ou(s.position, p, d)) : (m = ku(l, s.position, a), p = iu(m, s.position)), t.follow) {
        if (c > a) {
            let e = l.x - m.x,
                t = l.y - m.y;
            s.position.x += e, s.position.y += t, s.el.style.top = s.position.y - (n.box.top + o.y) + "px", s.el.style.left = s.position.x - (n.box.left + o.x) + "px", c = iu(l, s.position)
        }
    } else l = m, c = p;
    var g = l.x - s.position.x,
        y = l.y - s.position.y;
    s.frontPosition = {
        x: g,
        y: y
    }, t.dataOnly || (s.ui.front.style.transform = "translate(" + g + "px," + y + "px)");
    var x = {
        identifier: s.identifier,
        position: l,
        force: f,
        pressure: e.force || e.pressure || e.webkitForce || 0,
        distance: c,
        angle: {
            radian: u,
            degree: d
        },
        vector: {
            x: g / a,
            y: -y / a
        },
        raw: h,
        instance: s,
        lockX: t.lockX,
        lockY: t.lockY
    };
    x = s.computeDirection(x), x.angle = {
        radian: ru(180 - d),
        degree: 180 - d
    }, s.trigger("move", x), n.trigger("move " + s.id + ":move", x)
};
Pu.prototype.processOnEnd = function(e) {
    var t = this,
        n = t.options,
        i = t.manager.getIdentifier(e),
        s = t.nipples.get(i),
        o = t.manager.removeIdentifier(s.identifier);
    s && (n.dataOnly || s.hide(function() {
        n.mode === "dynamic" && (s.trigger("removed", s), t.trigger("removed " + s.id + ":removed", s), t.manager.trigger("removed " + s.id + ":removed", s), s.destroy())
    }), clearInterval(t.pressureIntervals[s.identifier]), s.resetDirection(), s.trigger("end", s), t.trigger("end " + s.id + ":end", s), t.ids.indexOf(s.identifier) >= 0 && t.ids.splice(t.ids.indexOf(s.identifier), 1), t.actives.indexOf(s) >= 0 && t.actives.splice(t.actives.indexOf(s), 1), /(semi|static)/.test(n.mode) ? t.idles.push(s) : t.nipples.indexOf(s) >= 0 && t.nipples.splice(t.nipples.indexOf(s), 1), t.manager.unbindDocument(), /(semi|static)/.test(n.mode) && (t.manager.ids[o.id] = o.identifier))
};
Pu.prototype.onDestroyed = function(e, t) {
    var n = this;
    n.nipples.indexOf(t) >= 0 && n.nipples.splice(n.nipples.indexOf(t), 1), n.actives.indexOf(t) >= 0 && n.actives.splice(n.actives.indexOf(t), 1), n.idles.indexOf(t) >= 0 && n.idles.splice(n.idles.indexOf(t), 1), n.ids.indexOf(t.identifier) >= 0 && n.ids.splice(n.ids.indexOf(t.identifier), 1), n.manager.removeIdentifier(t.identifier), n.manager.unbindDocument()
};
Pu.prototype.destroy = function() {
    var e = this;
    e.unbindEvt(e.options.zone, "start"), e.nipples.forEach(function(e) {
        e.destroy()
    });
    for (var t in e.pressureIntervals) e.pressureIntervals.hasOwnProperty(t) && clearInterval(e.pressureIntervals[t]);
    e.trigger("destroyed", e.nipples), e.manager.unbindDocument(), e.off()
};

function Ru(e) {
    var n = this;
    n.ids = {}, n.index = 0, n.collections = [], n.scroll = pu(), n.config(e), n.prepareCollections();
    var t = function() {
        var t;
        n.collections.forEach(function(e) {
            e.forEach(function(e) {
                t = e.el.getBoundingClientRect(), e.position = {
                    x: n.scroll.x + t.left,
                    y: n.scroll.y + t.top
                }
            })
        })
    };
    uu(window, "resize", function() {
        du(t)
    });
    var i = function() {
        n.scroll = pu()
    };
    return uu(window, "scroll", function() {
        du(i)
    }), n.collections
}
Ru.prototype = new Bu;
Ru.constructor = Ru;
Ru.prototype.prepareCollections = function() {
    var e = this;
    e.collections.create = e.create.bind(e), e.collections.on = e.on.bind(e), e.collections.off = e.off.bind(e), e.collections.destroy = e.destroy.bind(e), e.collections.get = function(t) {
        var n;
        return e.collections.every(function(e) {
            return n = e.get(t), !n
        }), n
    }
};
Ru.prototype.create = function(e) {
    return this.createCollection(e)
};
Ru.prototype.createCollection = function(e) {
    var t = this,
        n = new Pu(t, e);
    return t.bindCollection(n), t.collections.push(n), n
};
Ru.prototype.bindCollection = function(e) {
    var n = this,
        i, t = function(e, t) {
            i = e.type + " " + t.id + ":" + e.type, n.trigger(i, t)
        };
    e.on("destroyed", n.onDestroyed.bind(n)), e.on("shown hidden rested dir plain", t), e.on("dir:up dir:right dir:down dir:left", t), e.on("plain:up plain:right plain:down plain:left", t)
};
Ru.prototype.bindDocument = function() {
    var e = this;
    e.binded || (e.bindEvt(document, "move").bindEvt(document, "end"), e.binded = !0)
};
Ru.prototype.unbindDocument = function(e) {
    var t = this;
    (!Object.keys(t.ids).length || e === !0) && (t.unbindEvt(document, "move").unbindEvt(document, "end"), t.binded = !1)
};
Ru.prototype.getIdentifier = function(e) {
    var t;
    return e ? (t = e.identifier === void 0 ? e.pointerId : e.identifier, t === void 0 && (t = this.latest || 0)) : t = this.index, this.ids[t] === void 0 && (this.ids[t] = this.index, this.index += 1), this.latest = t, this.ids[t]
};
Ru.prototype.removeIdentifier = function(e) {
    var t = {};
    for (var n in this.ids)
        if (this.ids[n] === e) {
            t.id = n, t.identifier = this.ids[n], delete this.ids[n];
            break
        } return t
};
Ru.prototype.onmove = function(e) {
    var t = this;
    return t.onAny("move", e), !1
};
Ru.prototype.onend = function(e) {
    var t = this;
    return t.onAny("end", e), !1
};
Ru.prototype.oncancel = function(e) {
    var t = this;
    return t.onAny("end", e), !1
};
Ru.prototype.onAny = function(e, t) {
    var n = this,
        i, s = "processOn" + e.charAt(0).toUpperCase() + e.slice(1);
    t = hu(t);
    var o = function(e, t, n) {
        n.ids.indexOf(t) >= 0 && (n[s](e), e._found_ = !0)
    },
        r = function(e) {
            i = n.getIdentifier(e), vu(n.collections, o.bind(null, e, i)), e._found_ || n.removeIdentifier(i)
        };
    return vu(t, r), !1
};
Ru.prototype.destroy = function() {
    var e = this;
    e.unbindDocument(!0), e.ids = {}, e.index = 0, e.collections.forEach(function(e) {
        e.destroy()
    }), e.off()
};
Ru.prototype.onDestroyed = function(e, t) {
    var n = this;
    if (n.collections.indexOf(t) < 0) return !1;
    n.collections.splice(n.collections.indexOf(t), 1)
};
const Mu = new Ru,
      Nu = {
          create: function(e) {
              return Mu.create(e)
          },
          factory: Mu
      };
let Ou = !1;
const Lu = e => {
    if (Ou) return;
    Ou = !0;
    const t = document.getElementById("touch-controls-left"),
          n = Nu.create({
              zone: t
          });
    n.on("start", e.onStartMoving), n.on("end", e.onStopMoving), n.on("move", e.onRotateMoving);
    const i = document.getElementById("touch-controls-right"),
          s = Nu.create({
              zone: i
          });
    s.on("start", e.onStartAttacking), s.on("end", e.onStopAttacking), s.on("move", e.onRotateAttacking), t.style.display = "block", i.style.display = "block"
},
      Fu = {
          enable: Lu
      };
const Oe = k1;
(function(e, t) {
    const n = k1,
          i = e();
    while (!![]) {
        try {
            const o = parseInt(n(905)) / (-4820 * 2 + -9288 + 18929) * (-parseInt(n(1369)) / (-1294 * -2 + 4028 + -1 * 6614)) + -parseInt(n(1078)) / (7236 + 1646 * -1 + -5587) * (parseInt(n(1332)) / (1 * -2737 + 48 * 112 + -2635)) + parseInt(n(1383)) / (-4203 + 5 * -1747 + 12943) + parseInt(n(1310)) / (6189 + -4308 + 15 * -125) * (parseInt(n(1231)) / (-279 * 8 + 887 * -1 + 3126)) + parseInt(n(376)) / (-1 * -4521 + -338 * -29 + -409 * 35) * (-parseInt(n(692)) / (1 * -991 + 1114 + 1 * -114)) + parseInt(n(478)) / (3092 * 1 + 2693 * 1 + -5775) * (parseInt(n(800)) / (-1830 + -5986 + -7827 * -1)) + -parseInt(n(990)) / (-1201 + 8690 + 1 * -7477) * (-parseInt(n(1102)) / (-1339 * -1 + -6201 + 65 * 75));
            if (o === t) break;
            else i["push"](i["shift"]())
        } catch (s) {
            i["push"](i["shift"]())
        }
    }
})(v1, -3 * 209743 + 909303 * -1 + 2142188 * 1);
var _u = Object[Oe(1519)],
    Vu = (e, t, n) => t in e ? _u(e, t, {
        enumerable: !(-3613 + -6601 + 10214),
        configurable: !(-48 * 55 + -2141 * -2 + -2 * 821),
        writable: !(4967 + 5628 + -13 * 815),
        value: n
    }) : e[t] = n,
    Uu = (e, t, n) => Vu(e, typeof t != "symbol" ? t + "" : t, n);
const ju = {};
ju[Oe(1033)] = "text/javascript;charset=utf-8";
const Hu = Oe(624),
      Wu = e => Uint8Array["from"](atob(e), e => e[Oe(1093)](1 * -8293 + 6795 + -107 * -14)),
      Qu = typeof self < "u" && self[Oe(883)] && new Blob([Wu(Hu)], ju);

function Yu(e) {
    const t = Oe,
          n = {};
    n[t(1584)] = function(e, t) {
        return e == t
    }, n[t(1297)] = "error", n["TpOZL"] = t(1348);
    const i = n;
    let s;
    try {
        if (s = Qu && (self[t(729)] || self[t(1162)])["createObjectURL"](Qu), !s) throw "";
        const o = new Worker(s, {
            name: i["FuupB"](e, null) ? void(-4965 + 1312 + 3653 * 1) : e[t(726)]
        });
        return o[t(742)](i[t(1297)], () => {
            const e = t;
            (self[e(729)] || self[e(1162)])["revokeObjectURL"](s)
        }), o
    } catch {
        return new Worker(i[t(1295)] + Hu, {
            name: i["FuupB"](e, null) ? void(412 * 8 + 357 * -4 + -1868) : e[t(726)]
        })
    } finally {
        s && (self["URL"] || self["webkitURL"])[t(894)](s)
    }
}

function zu() {}

function Gu(e, t) {
    for (const n in t) e[n] = t[n];
    return e
}

function Ku(e) {
    const t = Oe,
          n = {
              QUXHX: function(e) {
                  return e()
              }
          };
    return n[t(345)](e)
}

function Xu() {
    const e = Oe;
    return Object[e(1145)](null)
}

function Ju(e) {
    const t = Oe;
    e[t(699)](Ku)
}

function qu(e) {
    const t = Oe;
    return typeof e == t(719)
}

function $u(e, t) {
    const n = Oe,
          i = {};
    i["MNRJn"] = function(e, t) {
        return e == t
    }, i[n(1241)] = function(e, t) {
        return e !== t
    }, i[n(1525)] = n(1032);
    const s = i;
    return e != e ? s["MNRJn"](t, t) : s[n(1241)](e, t) || e && s[n(300)](typeof e, s[n(1525)]) || s[n(300)](typeof e, n(719))
}

function Zu(e) {
    const t = Oe,
          n = {};
    n[t(1077)] = function(e, t) {
        return e === t
    };
    const i = n;
    return i[t(1077)](Object[t(874)](e)[t(1296)], -6823 * -1 + 160 * 7 + -7943)
}

function ef(e, t, n, i) {
    if (e) {
        const s = tf(e, t, n, i);
        return e[-4248 + -1931 * 1 + 167 * 37](s)
    }
}

function tf(e, t, n, i) {
    const s = Oe,
          o = {
              QQXvy: function(e, t, n) {
                  return e(t, n)
              }
          };
    return e[-2 * -1433 + -3028 + 1 * 163] && i ? o[s(1447)](Gu, n[s(1200)][s(527)](), e[97 * -82 + -122 * 32 + 11859](i(t))) : n["ctx"]
}

function nf(e, t, n, i) {
    const s = Oe,
          o = {
              PznZu: function(e) {
                  return e()
              },
              ftXFH: function(e, t, n) {
                  return e(t, n)
              },
              pNJEv: function(e) {
                  return e()
              },
              gSIce: "XYARv",
              UkZVn: s(1424),
              PJBCd: function(e, t) {
                  return e(t)
              },
              SEZCh: function(e, t) {
                  return e === t
              },
              ZdCYN: function(e, t) {
                  return e === t
              },
              mDwzk: "PLugu",
              WrfrM: function(e, t) {
                  return e | t
              },
              UTSdi: function(e, t) {
                  return e | t
              }
          };
    if (e[-6152 + -1342 * -4 + 786 * 1] && i) {
        if (o[s(1372)] !== o[s(1514)]) {
            const r = e[345 + -279 * 25 + 6632](o["PJBCd"](i, n));
            if (o[s(1061)](t[s(494)], void(4359 + 5445 + -9804))) return r;
            if (typeof r == s(1032)) {
                if (o["ZdCYN"](o[s(982)], o["mDwzk"])) {
                    const a = [],
                          l = Math[s(1250)](t[s(494)][s(1296)], r[s(1296)]);
                    for (let e = 9952 + -9947 + -5; e < l; e += 1484 + 38 * -215 + 6687) a[e] = o[s(558)](t["dirty"][e], r[e]);
                    return a
                } else {
                    const c = {};
                    c[s(1037)] = _0x464a8c, this[s(522)](c), o[s(1193)](_0x26adc7)
                }
            }
            return o[s(717)](t[s(494)], r)
        } else {
            const d = {
                AZDxl: function(e, t, n) {
                    const i = s;
                    return o[i(1415)](e, t, n)
                }
            };
            o[s(1415)](_0x278d35, 9296 + 3001 + -2 * 6145, _0x294e17 = _0x5e49ca[s(1050)]), _0x442b88(s(1559)), o[s(749)](_0x48d0b2)["then"](() => {
                const e = s,
                      t = {};
                t[e(341)] = _0x491f2b, d["AZDxl"](_0x50b55f, e(1559), t)
            })
        }
    }
    return t[s(494)]
}

function sf(e, t, n, i, s, o) {
    const r = Oe,
          a = {
              LregL: function(e, t) {
                  return e === t
              },
              RZbTw: function(e) {
                  return e()
              },
              IUOxB: function(e, t) {
                  return e !== t
              },
              SKpsn: "tlAbq",
              yhREA: "nheon",
              aSmQV: function(e, t, n, i, s) {
                  return e(t, n, i, s)
              }
          };
    if (s) {
        if (a[r(279)](a[r(510)], a[r(752)])) {
            const l = a[r(1129)](tf, t, n, i, o);
            e["p"](l, s)
        } else a["LregL"](_0x6592f0, _0x3123d2[r(821)]) && a[r(804)](_0x2bc7ee)
    }
}

function of(e) {
    const t = Oe,
          n = {};
    n[t(324)] = function(e, t) {
        return e > t
    };
    const i = n;
    if (i[t(324)](e[t(1200)]["length"], 2192 + -1 * 7341 + 5181)) {
        const s = [],
              o = e["ctx"]["length"] / (1 * 3556 + 1669 + -1731 * 3);
        for (let e = -8359 + 8558 + -199; e < o; e++) s[e] = -(8402 + 2965 + -1 * 11366);
        return s
    }
    return -(-2138 + -7197 + 9336)
}

function rf(e, t) {
    e["appendChild"](t)
}

function af(e, t, n) {
    const i = Oe,
          s = {
              EfoGx: function(e, t) {
                  return e == t
              },
              GkMSA: function(e, t) {
                  return e(t)
              },
              OvgDI: function(e, t) {
                  return e === t
              },
              HVXIz: i(628),
              fxbjC: i(1073),
              ZrhoA: function(e, t) {
                  return e(t)
              },
              ieoGb: function(e, t, n) {
                  return e(t, n)
              }
          },
          o = s[i(1180)](lf, e);
    if (!o[i(643)](t)) {
        if (s["OvgDI"](s[i(1472)], s[i(616)])) s[i(781)](_0x57cb85, null) ? _0x11f745[i(1588)](_0x1b3e51) : _0x173140[i(1526)](_0x42d343) !== _0x554e59 && _0x554aee[i(506)](_0x230517, _0x4d8b09);
        else {
            const r = s[i(1446)](ff, "style");
            r["id"] = t, r["textContent"] = n, s[i(1553)](cf, o, r)
        }
    }
}

function lf(e) {
    const t = Oe;
    if (!e) return document;
    const n = e[t(525)] ? e[t(525)]() : e["ownerDocument"];
    return n && n[t(1427)] ? n : e[t(389)]
}

function cf(e, t) {
    const n = Oe,
          i = {
              kHvtF: function(e, t, n) {
                  return e(t, n)
              }
          };
    return i[n(1400)](rf, e["head"] || e, t), t[n(1323)]
}

function df(e, t, n) {
    const i = Oe,
          s = {};
    s[i(306)] = function(e, t) {
        return e || t
    };
    const o = s;
    e[i(935)](t, o[i(306)](n, null))
}

function uf(e) {
    const t = Oe;
    e[t(1268)] && e[t(1268)]["removeChild"](e)
}

function ff(e) {
    const t = Oe;
    return document[t(743)](e)
}

function hf(e) {
    const t = Oe,
          n = {};
    n["yvSgZ"] = "http://www.w3.org/2000/svg";
    const i = n;
    return document["createElementNS"](i[t(1071)], e)
}

function pf(e) {
    return document["createTextNode"](e)
}

function mf() {
    const e = Oe,
          t = {
              nsnCy: function(e, t) {
                  return e(t)
              }
          };
    return t[e(1614)](pf, " ")
}

function gf(e, t, n, i) {
    const s = Oe;
    return e[s(742)](t, n, i), () => e[s(1352)](t, n, i)
}

function M(e, t, n) {
    const i = Oe,
          s = {};
    s["TyWyZ"] = function(e, t) {
        return e == t
    };
    const o = s;
    o[i(706)](n, null) ? e[i(1588)](t) : e["getAttribute"](t) !== n && e[i(506)](t, n)
}

function yf(e) {
    const t = Oe;
    return Array["from"](e[t(541)])
}

function xf(e, t, n) {
    const i = Oe;
    e[i(1085)]["toggle"](t, !!n)
}

function wf(e, t, {
    bubbles: n = !(-2 * -2735 + -7888 + 2419),
    cancelable: i = !(3678 + -9390 + -29 * -197)
} = {}) {
    const s = Oe,
          o = {};
    return o[s(776)] = t, o[s(460)] = n, o[s(523)] = i, new CustomEvent(e, o)
}

function bf(e) {
    const n = Oe,
          t = {};
    t["jloEk"] = "default";
    const i = t,
          s = {};
    return e[n(541)]["forEach"](e => {
        const t = n;
        s[e[t(1454)] || i[t(1281)]] = !(4518 + -1408 * 1 + 1 * -3110)
    }), s
}
let vf;

function kf(e) {
    vf = e
}

function Af() {
    const e = Oe,
          t = {};
    t[e(1282)] = "Function called outside component initialization";
    const n = t;
    if (!vf) throw new Error(n["XmcdB"]);
    return vf
}

function If(e) {
    const t = Oe,
          n = {
              DcUZT: function(e) {
                  return e()
              }
          };
    n[t(639)](Af)["$$"]["on_mount"]["push"](e)
}

function Sf(e) {
    const t = Oe,
          n = {
              celIR: function(e) {
                  return e()
              }
          };
    n["celIR"](Af)["$$"]["on_destroy"][t(959)](e)
}

function Ef() {
    const a = {
        WwdzG: function(e, t, n, i) {
            return e(t, n, i)
        },
        ECgnL: function(e) {
            return e()
        }
    },
          l = a["ECgnL"](Af);
    return (e, t, {
        cancelable: n = !(14 * 697 + 7251 * -1 + -358 * 7)
    } = {}) => {
        const i = k1,
              s = l["$$"][i(1497)][e];
        if (s) {
            const o = {};
            o[i(523)] = n;
            const r = a["WwdzG"](wf, e, t, o);
            return s["slice"]()[i(699)](e => {
                const t = i;
                e[t(1405)](l, r)
            }), !r[i(630)]
        }
        return !(-2018 * -1 + -9002 * -1 + -11020)
    }
}
const Tf = [],
      Cf = [];
let Bf = [];
const Df = [],
      Pf = Promise[Oe(646)]();
let Rf = !(-66 * 74 + 2594 + 2291);

function Mf() {
    const e = Oe;
    Rf || (Rf = !(1 * -8923 + -7142 * -1 + 1781), Pf[e(388)](_f))
}

function Nf() {
    const e = Oe,
          t = {
              gyxPE: function(e) {
                  return e()
              }
          };
    return t[e(1481)](Mf), Pf
}

function Of(e) {
    Bf["push"](e)
}
const Lf = new Set;
let Ff = 9837 + -6111 + -3726;

function _f() {
    const t = Oe,
          n = {
              eEAbL: function(e, t, n, i, s) {
                  return e(t, n, i, s)
              },
              HiLoy: function(e, t) {
                  return e !== t
              },
              TsBAS: t(1595),
              HpWQP: t(1528),
              SQxTQ: function(e, t) {
                  return e < t
              },
              njMma: function(e, t) {
                  return e(t)
              },
              CUqVj: function(e, t) {
                  return e(t)
              },
              auKSB: function(e, t) {
                  return e < t
              },
              DihCj: function(e) {
                  return e()
              },
              EzuAs: function(e, t) {
                  return e(t)
              }
          };
    if (n[t(782)](Ff, 42 + -1537 * 4 + 6106)) return;
    const e = vf;
    do {
        try {
            if (n[t(782)](n[t(829)], n["HpWQP"]))
                for (; n["SQxTQ"](Ff, Tf[t(1296)]);) {
                    const s = Tf[Ff];
                    Ff++, n[t(1081)](kf, s), n["njMma"](Vf, s["$$"])
                } else {
                    if (_0x52b01d) {
                        const o = n[t(1011)](_0x3918a4, _0x1f6f68, _0x32aee6, _0x5296b5, _0xace433);
                        _0x50a4d3["p"](o, _0x3abbc7)
                    }
                }
        } catch (i) {
            throw Tf[t(1296)] = -1 * -8735 + -6958 * -1 + -5231 * 3, Ff = 1752 + -3850 * -2 + -9452, i
        }
        for (n["CUqVj"](kf, null), Tf[t(1296)] = -5 * 719 + -8803 + 2 * 6199, Ff = -7152 + 670 * 8 + -14 * -128; Cf["length"];) Cf[t(375)]()();
        for (let e = -9311 * -1 + 94 + -9405; n[t(456)](e, Bf[t(1296)]); e += 946 + 9672 * 1 + -10617) {
            const r = Bf[e];
            Lf[t(1204)](r) || (Lf[t(352)](r), n[t(983)](r))
        }
        Bf[t(1296)] = 3748 * -2 + 2502 + 454 * 11
    } while (Tf["length"]);
    for (; Df[t(1296)];) Df[t(375)]()();
    Rf = !(2338 + 1 * 5219 + -7556), Lf[t(873)](), n[t(1074)](kf, e)
}

function Vf(e) {
    const t = Oe,
          n = {
              GLauD: function(e, t, n, i) {
                  return e(t, n, i)
              },
              ioWDF: function(e, t, n) {
                  return e(t, n)
              },
              IILem: function(e, t, n) {
                  return e(t, n)
              },
              AmQnn: function(e, t) {
                  return e !== t
              },
              jPRBm: t(441),
              ReFip: t(528),
              LSOkM: function(e, t) {
                  return e(t)
              }
          };
    if (n[t(932)](e["fragment"], null)) {
        if (n[t(932)](n[t(398)], n[t(335)])) {
            e[t(1417)](), n[t(1147)](Ju, e[t(1355)]);
            const i = e[t(494)];
            e[t(494)] = [-(2 * -460 + -1675 + 2596)], e[t(1317)] && e[t(1317)]["p"](e[t(1200)], i), e["after_update"][t(699)](Of)
        } else n[t(586)](_0x15dac3, _0x42d16b, _0x1088b2, _0x2358bf), n[t(1429)](_0x51afed, _0x209eed, _0x12d2c4), n["ioWDF"](_0x3de46d, _0x18dc7e, _0x437c3e), n[t(1578)](_0x1ad42, _0x312335, _0x200eab), _0x38858c["m"](_0x276aa, null)
    }
}

function Uf(t) {
    const n = Oe,
          i = [],
          s = [];
    Bf[n(699)](e => t[n(1003)](e) === -(-2791 * -1 + 4418 + -7208) ? i[n(959)](e) : s[n(959)](e)), s[n(699)](e => e()), Bf = i
}
const jf = new Set;
let Hf;

function Wf(e, t) {
    const n = Oe;
    e && e["i"] && (jf[n(625)](e), e["i"](t))
}

function Qf(t, e, n, i) {
    const s = Oe,
          o = {};
    o["ZLcHw"] = function(e, t) {
        return e === t
    }, o[s(1343)] = s(1449);
    const r = o;
    if (t && t["o"]) {
        if (jf["has"](t)) return;
        jf["add"](t), Hf["c"][s(959)](() => {
            const e = s;
            if (r["ZLcHw"](r[e(1343)], r[e(1343)])) jf[e(625)](t);
            else return {
                promise: _0x30662a["reject"](),
                controller: _0x12e06d
            }
        }), t["o"](e)
    }
}

function Yf(n, e, t) {
    const i = Oe,
          {
              fragment: s,
              after_update: o
          } = n["$$"];
    s && s["m"](e, t), Of(() => {
        const e = k1,
              t = n["$$"][e(792)][e(1313)](Ku)[e(594)](qu);
        n["$$"][e(1382)] ? n["$$"][e(1382)][e(959)](...t) : Ju(t), n["$$"][e(792)] = []
    }), o[i(699)](Of)
}

function zf(e, t) {
    const n = Oe,
          i = {
              gXwoE: function(e, t) {
                  return e !== t
              },
              IpudL: function(e, t) {
                  return e(t)
              }
          },
          s = e["$$"];
    i[n(1035)](s[n(1317)], null) && (Uf(s[n(1121)]), i["IpudL"](Ju, s[n(1382)]), s["fragment"] && s[n(1317)]["d"](t), s["on_destroy"] = s["fragment"] = null, s[n(1200)] = [])
}

function Gf(e, t) {
    const n = Oe,
          i = {};
    i[n(414)] = function(e, t) {
        return e === t
    }, i[n(1175)] = function(e, t) {
        return e | t
    }, i["rzDkl"] = function(e, t) {
        return e / t
    }, i[n(707)] = function(e, t) {
        return e << t
    }, i[n(461)] = function(e, t) {
        return e % t
    };
    const s = i;
    s[n(414)](e["$$"][n(494)][-9640 + -11 * 183 + 11653], -(-247 + -2 * 1087 + 2422)) && (Tf[n(959)](e), Mf(), e["$$"]["dirty"][n(591)](-5699 + -8957 + -458 * -32)), e["$$"][n(494)][s[n(1175)](s[n(672)](t, 9151 * 1 + 1 * 1487 + -1 * 10607), -1 * 832 + -53 * 43 + 3111)] |= s[n(707)](7980 + -2160 + -5819 * 1, s[n(461)](t, -1 * -1513 + 241 * -26 + 16 * 299))
}

function Kf(o, e, t, n, r, i, s = null, a = [-(-9244 + -22 * 233 + 14371)]) {
    const l = Oe,
          c = {
              EEeTs: function(e) {
                  return e()
              },
              FRdsE: function(e, t) {
                  return e(t)
              },
              LsZwB: function(e, t) {
                  return e === t
              },
              VJgJO: l(1064),
              TYBBt: function(e, t) {
                  return e(t)
              },
              rILhX: function(e, t) {
                  return e(t)
              },
              YiveE: function(e, t, n, i) {
                  return e(t, n, i)
              },
              tLJoR: function(e) {
                  return e()
              }
          },
          d = vf;
    kf(o);
    const u = o["$$"] = {
        fragment: null,
        ctx: [],
        props: i,
        update: zu,
        not_equal: r,
        bound: c[l(1017)](Xu),
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(e[l(1038)] || (d ? d["$$"]["context"] : [])),
        callbacks: Xu(),
        dirty: a,
        skip_bound: !(3217 * 1 + 4973 + -431 * 19),
        root: e[l(1494)] || d["$$"]["root"]
    };
    s && c[l(987)](s, u["root"]);
    let f = !(2722 + 5394 + -5 * 1623);
    if (u["ctx"] = t ? t(o, e[l(801)] || {}, (e, t, ...n) => {
        const i = l,
              s = n["length"] ? n[551 * 9 + 3229 * 3 + -1 * 14646] : t;
        return u["ctx"] && r(u["ctx"][e], u[i(1200)][e] = s) && (!u[i(1034)] && u[i(323)][e] && u[i(323)][e](s), f && Gf(o, e)), t
    }) : [], u["update"](), f = !(1 * -3701 + 7647 * 1 + -3946), Ju(u["before_update"]), u[l(1317)] = n ? n(u[l(1200)]) : !(9565 + 7807 + -17371), e[l(1494)]) {
        if (e[l(526)]) {
            if (c[l(1431)](c[l(571)], l(1083))) return this["$$"][l(1200)][99 * -55 + -4745 + 2 * 5113];
            else {
                const h = c[l(588)](yf, e[l(1494)]);
                u["fragment"] && u[l(1317)]["l"](h), h[l(699)](uf)
            }
        } else u["fragment"] && u[l(1317)]["c"]();
        e[l(1622)] && c[l(585)](Wf, o["$$"][l(1317)]), c[l(564)](Yf, o, e[l(1494)], e[l(1521)]), c[l(432)](_f)
    }
    kf(d)
}
let Xf;
typeof HTMLElement == Oe(719) && (Xf = class extends HTMLElement {
    constructor(e, t, n) {
        const i = Oe,
              s = {
                  rUKUC: function(e, t, n) {
                      return e(t, n)
                  },
                  Hsitd: i(1426),
                  eFHob: i(1118),
                  CebuH: i(991),
                  MpdwJ: function(e, t, n, i) {
                      return e(t, n, i)
                  },
                  OWbCP: i(455),
                  vthcg: i(952),
                  WHNBC: function(e, t, n, i) {
                      return e(t, n, i)
                  },
                  XPSbK: i(317),
                  WOfVb: i(290),
                  SNPId: i(382)
              };
        super(), s["rUKUC"](Uu, this, s[i(716)]), Uu(this, s["eFHob"]), s[i(540)](Uu, this, i(1263)), Uu(this, i(292), !(-5861 + -1016 * -1 + 4846)), Uu(this, s[i(1240)], {}), s[i(1132)](Uu, this, s[i(635)], !(2511 * 3 + -1901 + -1877 * 3)), s["MpdwJ"](Uu, this, s[i(678)], {}), s[i(299)](Uu, this, s[i(854)], {}), Uu(this, s["WOfVb"], new Map), this[i(1426)] = e, this[i(1118)] = t, n && this[i(1091)]({
            mode: s[i(1600)]
        })
    } ["addEventListener"](e, t, n) {
        const i = Oe,
              s = {
                  YBycX: function(e) {
                      return e()
                  },
                  vFDxL: i(1363),
                  WUuCQ: i(415),
                  UJIhu: i(1026),
                  CDiCl: function(e, t) {
                      return e(t)
                  },
                  cMKwN: "click",
                  SGyGr: i(373),
                  BWHPx: i(1115),
                  cxhia: function(e, t) {
                      return e === t
                  },
                  BvtGj: i(1252),
                  mkbHE: "ZLVuK"
              };
        if (this[i(317)][e] = this["$$l"][e] || [], this[i(317)][e]["push"](t), this[i(1263)]) {
            if (s[i(660)](s[i(400)], s[i(403)])) s[i(539)](_0x46e38e), _0x155ff4 && (_0x5657d6[i(1352)](s[i(1096)], _0x1bbc7d), _0x3663c1[i(1352)](s[i(1237)], _0x4ece35), _0x3b3e07["removeEventListener"](s[i(1597)], _0x269ffc), _0x858a61 = null), _0x560858 && (s[i(657)](_0x41d91d, _0x3b2a3d), _0x64eea1 = null), _0x2ad342["removeEventListener"](s[i(445)], _0x12dcfd), _0x18ac09["removeEventListener"](s[i(548)], _0x45ea45), _0x2c8687["removeEventListener"](s[i(501)], _0x3cdeb4);
            else {
                const o = this[i(1263)][i(1025)](e, t);
                this[i(290)]["set"](t, o)
            }
        }
        super[i(742)](e, t, n)
    } [Oe(1352)](e, t, n) {
        const i = Oe,
              s = {
                  VBkzT: function(e) {
                      return e()
                  }
              };
        if (super[i(1352)](e, t, n), this[i(1263)]) {
            const o = this[i(290)][i(1506)](t);
            o && (s["VBkzT"](o), this[i(290)][i(625)](t))
        }
        if (this["$$l"][e]) {
            const r = this[i(317)][e][i(1003)](t);
            r >= -2502 + -5999 * 1 + 8501 && this[i(317)][e][i(1206)](r, 1 * 6563 + -2645 + -3917 * 1)
        }
    }
    async [Oe(1106)]() {
        const s = Oe,
              a = {
                  jqtvl: function(e, t) {
                      return e === t
                  },
                  iqlaL: s(1280),
                  zWdtn: s(334),
                  JAmFB: function(e, t) {
                      return e(t)
                  },
                  PkEoq: "slot",
                  maBEm: function(e, t) {
                      return e !== t
                  },
                  XUqxT: "default",
                  iOVFP: s(726),
                  Nojlf: "sUPrC",
                  dVYmF: function(e) {
                      return e()
                  },
                  hycPN: s(420),
                  VTWrv: function(e, t, n, i, s) {
                      return e(t, n, i, s)
                  },
                  qUzoW: s(430),
                  aUqcd: function(e, t) {
                      return e(t)
                  },
                  NbSSt: function(e, t) {
                      return e in t
                  }
              };
        if (this[s(292)] = !(2747 + 8208 + -10955), !this["$$c"]) {
            let e = function(i) {
                return () => {
                    const s = k1,
                          o = {
                              VBhBP: function(e, t) {
                                  return a["jqtvl"](e, t)
                              },
                              Tgoce: a[s(519)],
                              ALVxP: a[s(914)],
                              wvjcX: function(e, t) {
                                  const n = s;
                                  return a[n(1270)](e, t)
                              },
                              CQNal: a[s(818)],
                              AflXQ: function(e, t) {
                                  return a["maBEm"](e, t)
                              },
                              bXfys: a[s(476)],
                              ydmRz: function(e, t, n, i) {
                                  return e(t, n, i)
                              },
                              DRhyx: a[s(544)],
                              TQqFu: function(e, t) {
                                  return e == t
                              },
                              ubpAi: a[s(282)],
                              gYRBh: s(688)
                          };
                    let r;
                    return {
                        c: function() {
                            const e = s,
                                  t = {
                                      sltwO: function(e) {
                                          return e()
                                      }
                                  };
                            if (o["VBhBP"](o["Tgoce"], o[e(822)])) {
                                const n = {};
                                n[e(685)] = _0x5aec20, this[e(522)](n), t[e(487)](_0x17ea16)
                            } else r = o[e(790)](ff, o[e(1459)]), o["AflXQ"](i, o[e(833)]) && o[e(327)](M, r, o["DRhyx"], i)
                        },
                        m: function(e, t) {
                            df(e, r, t)
                        },
                        d: function(e) {
                            const t = s;
                            if (o[t(1567)](o[t(1456)], o[t(875)])) {
                                this[t(455)] = !(-4 * -862 + 2702 * -2 + -4 * -489);
                                for (const n in this[t(952)])
                                    if (this[t(991)][n] = this["$$c"]["$$"][t(1200)][this[t(1263)]["$$"]["props"][n]], this["$$p_d"][n][t(737)]) {
                                        const i = _0x187606(n, this[t(991)][n], this[t(952)], t(430));
                                        o[t(1009)](i, null) ? this["removeAttribute"](this["$$p_d"][n][t(1059)] || n) : this[t(506)](this[t(952)][n][t(1059)] || n, i)
                                    } this[t(455)] = !(-7541 + -6019 + 13561)
                            } else e && o[t(790)](uf, r)
                        }
                    }
                }
            };
            if (await Promise["resolve"](), !this[s(292)] || this["$$c"]) return;
            const t = {},
                  n = a[s(1273)](bf, this);
            for (const r of this[s(1118)]) a[s(1285)](r, n) && (t[r] = [a[s(1270)](e, r)]);
            for (const l of this[s(307)]) {
                const c = this[s(532)](l["name"]);
                a[s(1285)](c, this[s(991)]) || (this[s(991)][c] = Jf(c, l[s(1344)], this[s(952)], s(799)))
            }
            for (const d in this[s(952)]) !a[s(1285)](d, this[s(991)]) && a[s(1027)](this[d], void(6895 * 1 + -1 * 4595 + -2300)) && (this[s(991)][d] = this[d], delete this[d]);
            const i = {};
            i[s(1200)] = [], this[s(1263)] = new this[s(1426)]({
                target: this[s(710)] || this,
                props: {
                    ...this["$$d"],
                    $$slots: t,
                    $$scope: i
                }
            });
            const o = () => {
                const e = s;
                this[e(455)] = !(-2160 + 6 * -419 + 41 * 114);
                for (const t in this[e(952)])
                    if (this["$$d"][t] = this[e(1263)]["$$"]["ctx"][this["$$c"]["$$"][e(801)][t]], this[e(952)][t][e(737)]) {
                        if (a[e(1027)]("KCuLl", a[e(684)])) {
                            const n = {};
                            n[e(744)] = _0x56a998, this[e(522)](n), a["dVYmF"](_0x1b53b5)
                        } else {
                            const i = a[e(815)](Jf, t, this[e(991)][t], this["$$p_d"], a[e(1371)]);
                            i == null ? this["removeAttribute"](this[e(952)][t][e(1059)] || t) : this[e(506)](this[e(952)][t][e(1059)] || t, i)
                        }
                    } this[e(455)] = !(-241 * 1 + -21 * -351 + -7129 * 1)
            };
            this[s(1263)]["$$"]["after_update"][s(959)](o), a[s(731)](o);
            for (const u in this["$$l"])
                for (const f of this[s(317)][u]) {
                    const h = this["$$c"][s(1025)](u, f);
                    this["$$l_u"][s(1545)](f, h)
                }
            this[s(317)] = {}
        }
    } [Oe(495)](e, t, n) {
        const i = Oe,
              s = {
                  dMcbr: function(e, t, n, i, s) {
                      return e(t, n, i, s)
                  },
                  rUmAP: "toProp",
                  gfCEV: function(e, t) {
                      return e == t
                  }
              };
        var o;
        this["$$r"] || (e = this["$$g_p"](e), this[i(991)][e] = s[i(846)](Jf, e, n, this[i(952)], s[i(419)]), s[i(1302)](o = this[i(1263)], null) || o[i(514)]({
            [e]: this[i(991)][e]
        }))
    } [Oe(1308)]() {
        const t = Oe;
        this["$$cn"] = !(4419 + -9780 + -383 * -14), Promise[t(646)]()[t(388)](() => {
            const e = t;
            !this[e(292)] && this[e(1263)] && (this["$$c"][e(440)](), this[e(1263)] = void(4691 + -41 * -232 + -14203))
        })
    } [Oe(532)](t) {
        const n = Oe;
        return Object[n(874)](this["$$p_d"])[n(848)](e => this[n(952)][e][n(1059)] === t || !this["$$p_d"][e][n(1059)] && e[n(978)]() === t) || t
    }
});

function Jf(e, t, n, i) {
    const s = Oe,
          o = {};
    o["GMrxh"] = function(e, t) {
        return e === t
    }, o["vbWKw"] = s(989), o[s(721)] = function(e, t) {
        return e != t
    }, o[s(1393)] = s(971), o[s(976)] = function(e, t) {
        return e === t
    }, o[s(694)] = "toAttribute", o[s(508)] = "Array", o[s(950)] = function(e, t) {
        return e == t
    }, o["VpSqr"] = s(542), o["Cxvor"] = function(e, t) {
        return e ?? t
    }, o[s(662)] = s(1422);
    const r = o;
    var a;
    const l = (a = n[e]) == null ? void(-565 * -10 + 3873 + -107 * 89) : a[s(1033)];
    if (t = r[s(966)](l, r["vbWKw"]) && r[s(721)](typeof t, r[s(1393)]) ? r[s(721)](t, null) : t, !i || !n[e]) return t;
    if (r[s(976)](i, r["Ntals"])) switch (l) {
        case s(1422):
        case r[s(508)]:
            return r["YqTWW"](t, null) ? null : JSON[s(547)](t);
        case r[s(518)]:
            return t ? "" : null;
        case r["VpSqr"]:
            return r[s(1483)](t, null);
        default:
            return t
    } else switch (l) {
        case r[s(662)]:
        case r[s(508)]:
            return t && JSON[s(520)](t);
        case r[s(518)]:
            return t;
        case s(542):
            return r["PRmDN"](t, null) ? +t : t;
        default:
            return t
    }
}

function qf(t, s, n, e, i, o) {
    const r = Oe,
          a = {
              TiASR: function(e, t) {
                  return e !== t
              },
              FbPLi: r(1215),
              auqju: r(865),
              qWkSF: function(e, t, n, i) {
                  return e(t, n, i)
              },
              APykf: function(e, t) {
                  return e(t)
              },
              bvANK: r(832),
              YRLjz: r(1260),
              qMaOl: function(e) {
                  return e()
              },
              QyIKx: r(1192),
              phlpQ: function(e, t, n, i) {
                  return e(t, n, i)
              },
              bSBoC: r(1225),
              TSMEH: r(671),
              WtFTb: function(e, t, n, i) {
                  return e(t, n, i)
              },
              ieDOC: r(1300),
              Cjcbr: r(856),
              jMdZq: r(1160),
              CKJCg: "0 0 24 24",
              mmkgH: r(271),
              XZRwM: "1.5",
              bnpaf: "currentColor",
              bBJuM: "class",
              JNgiu: "altcha-error svelte-ddsc3z",
              TXbCE: function(e, t) {
                  return e in t
              },
              RpAMG: r(1271),
              ELdEs: r(1562),
              tyeym: function(e, t) {
                  return e == t
              },
              XVMmD: function(e, t) {
                  return e === t
              },
              Uivxy: r(1416)
          };
    let l = class extends Xf {
        constructor() {
            const e = r;
            super(t, n, i), this[e(952)] = s
        }
        static get[r(897)]() {
            const t = r;
            if (a[t(381)](a[t(1509)], a[t(753)])) return Object[t(874)](s)["map"](e => (s[e][t(1059)] || e)[t(978)]());
            else _0x48fd4e()["$$"]["on_mount"][t(959)](_0x2091a2)
        }
    };
    return Object[r(874)](s)["forEach"](i => {
        const o = r,
              t = {
                  IarPo: function(e, t) {
                      return a["APykf"](e, t)
                  },
                  aCbaJ: a[o(1088)],
                  WFbuV: o(1294),
                  kyDwu: a["YRLjz"],
                  iWDKe: function(e) {
                      const t = o;
                      return a[t(778)](e)
                  },
                  FZHBd: function(e, t, n, i) {
                      const s = o;
                      return a[s(574)](e, t, n, i)
                  },
                  wLzWr: a[o(1279)],
                  FzxTs: function(e, t, n, i) {
                      const s = o;
                      return a[s(402)](e, t, n, i)
                  },
                  kwpZg: a[o(738)],
                  ILqUz: a["TSMEH"],
                  cQYNf: function(e, t, n, i) {
                      const s = o;
                      return a[s(1065)](e, t, n, i)
                  },
                  iGWzJ: a[o(1149)],
                  QvhIR: a[o(1182)],
                  xJpSX: a[o(645)],
                  iErha: function(e, t, n, i) {
                      return a["phlpQ"](e, t, n, i)
                  },
                  hcvIR: a["CKJCg"],
                  KsGmG: a["mmkgH"],
                  hbuvy: a[o(357)],
                  TXUuw: "stroke",
                  vVTCo: a[o(664)],
                  CIoHR: a[o(553)],
                  Biaan: a[o(354)],
                  RIaRC: function(e, t) {
                      return a["TXbCE"](e, t)
                  }
              };
        a[o(381)](a[o(1367)], a[o(1367)]) ? (_0x23dd40 = t[o(644)](_0x386a02, t[o(1174)]), _0x21ebc0 = t[o(644)](_0x3bb833, t[o(1443)]), _0x2c31d7 = t[o(644)](_0x544f95, t[o(1075)]), _0x36a0f8 = t[o(791)](_0xb7c34), _0x341860["c"](), t[o(1433)](_0x119333, _0x1db127, o(392), t[o(1124)]), t[o(371)](_0x15f85a, _0x419f60, t[o(1501)], t[o(1124)]), t["FzxTs"](_0x3f7d67, _0x501f5c, "d", o(1561)), t[o(1433)](_0x3ca026, _0x195dac, o(479), "14"), _0x2609f5(_0x73e831, t[o(967)], "14"), t[o(368)](_0x58ea79, _0x33ae3b, t[o(1450)], t[o(604)]), _0x2bd5f7(_0x2494ba, o(591), t[o(1125)]), t[o(786)](_0x64531f, _0x2aa316, o(620), t[o(1002)]), t[o(786)](_0x13819e, _0x4ffba0, t[o(1255)], t[o(1502)]), t[o(786)](_0x30ad25, _0xcde31a, t[o(590)], t[o(1110)]), t[o(371)](_0x5d1ff7, _0x2df052, t["CIoHR"], t[o(1346)])) : Object["defineProperty"](l["prototype"], i, {
            get() {
                const e = o;
                return this[e(1263)] && t[e(747)](i, this["$$c"]) ? this["$$c"][i] : this[e(991)][i]
            },
            set(e) {
                const t = o;
                var n;
                e = a["qWkSF"](Jf, i, e, s), this[t(991)][i] = e, (n = this[t(1263)]) == null || n["$set"]({
                    [i]: e
                })
            }
        })
    }), e[r(699)](n => {
        const i = r,
              s = {
                  bhSmQ: function(e, t, n, i) {
                      const s = k1;
                      return a[s(1065)](e, t, n, i)
                  },
                  zvikn: function(e, t, n, i) {
                      return e(t, n, i)
                  },
                  utFTu: a[i(1165)],
                  Jjhmw: function(e, t) {
                      const n = i;
                      return a[n(638)](e, t)
                  }
              };
        if (a[i(866)](a[i(1508)], i(1530))) {
            const e = {};
            return e[i(1350)] = _0x73816f["algorithm"], e[i(538)] = _0x5df6ad[i(538)], e["number"] = _0x4c7a93[i(273)], e["salt"] = _0x320857[i(483)], e[i(410)] = _0x3432f2[i(410)], e["test"] = _0xcafb6a ? !(-8966 + -3204 + -1217 * -10) : void(-15 * -191 + 7 * -926 + 1 * 3617), e["took"] = _0x59aae0[i(649)], _0xa31336(_0x31062b[i(547)](e))
        } else Object["defineProperty"](l[i(328)], n, {
            get() {
                const e = i;
                if (s[e(563)] === s[e(563)]) {
                    var t;
                    return s[e(1596)](t = this[e(1263)], null) ? void(3681 * -2 + 9019 + -1657 * 1) : t[n]
                } else s[e(1288)](_0xfe276b, _0x31aa02, _0x8ced28, _0x27af31), _0x111fad[e(407)] = _0xbd51c0, s["zvikn"](_0x32e7a2, _0x340f78, _0x299ed9, _0x5cc18b), s["zvikn"](_0x47a7c2, _0x39295a, _0x3a9274, _0x2f9e6c)
            }
        })
    }), t[r(1479)] = l, l
}
class $f {
    constructor() {
        const e = Oe,
              t = {
                  VGwHG: function(e, t, n) {
                      return e(t, n)
                  },
                  JXnPl: e(522)
              };
        t["VGwHG"](Uu, this, "$$"), t["VGwHG"](Uu, this, t[e(474)])
    } ["$destroy"]() {
        const e = Oe,
              t = {
                  ufDUU: function(e, t, n) {
                      return e(t, n)
                  }
              };
        t[e(933)](zf, this, 4555 + 377 + 4931 * -1), this[e(440)] = zu
    } [Oe(1025)](e, i) {
        const s = Oe,
              o = {
                  wNzWl: function(e, t) {
                      return e !== t
                  },
                  zWRjM: function(e, t) {
                      return e === t
                  },
                  gYULU: s(682),
                  UPWsc: function(e, t) {
                      return e(t)
                  }
              };
        if (!o[s(509)](qu, i)) return zu;
        const r = this["$$"][s(1497)][e] || (this["$$"]["callbacks"][e] = []);
        return r[s(959)](i), () => {
            const e = s;
            if (o[e(1015)](o[e(572)], e(682))) {
                const t = r["indexOf"](i);
                t !== -(-1469 * -3 + -1 * -6761 + -11167) && r["splice"](t, 4870 + -732 + -4137 * 1)
            } else {
                const n = _0x1f0442[e(1003)](_0x52781c);
                o[e(1082)](n, -(7722 + 3 * -1559 + -3044)) && _0x47708d[e(1206)](n, 131 * 1 + 7781 + -7911)
            }
        }
    } [Oe(514)](e) {
        const t = Oe;
        this[t(522)] && !Zu(e) && (this["$$"][t(1034)] = !(-8690 + -329 * -16 + 3426), this["$$set"](e), this["$$"][t(1034)] = !(-1867 + 10 * 916 + -7292))
    }
}
const Zf = "4";
typeof window < "u" && (window[Oe(1542)] || (window["__svelte"] = {
    v: new Set
}))["v"][Oe(352)](Zf);
const e1 = new TextEncoder;

function t1(e) {
    const t = Oe;
    return [...new Uint8Array(e)][t(1313)](e => e["toString"](5 * -1571 + 1464 + 6407)["padStart"](133 + -5026 + 4895, "0"))["join"]("")
}
async function n1(e, t = Oe(296), n = 3 * 51938 + 1 * 143138 + -24869 * 8) {
    const i = Oe,
          s = {
              xQKlE: function(e, t) {
                  return e * t
              },
              TtmiD: function(e, t, n, i) {
                  return e(t, n, i)
              }
          },
          o = Date[i(741)]()[i(1114)](7 * 509 + -23 * 3 + -3478);
    e || (e = Math[i(1192)](s[i(1229)](Math[i(1233)](), n)));
    const r = await s[i(1306)](i1, o, e, t),
          a = {};
    return a["algorithm"] = t, a[i(538)] = r, a[i(483)] = o, a[i(410)] = "", a
}
async function i1(e, t, n) {
    const i = Oe,
          s = {
              vuGsk: function(e, t) {
                  return e(t)
              },
              bldVl: function(e, t) {
                  return e + t
              }
          };
    return s["vuGsk"](t1, await crypto[i(1398)][i(372)](n[i(366)](), e1["encode"](s[i(995)](e, t))))
}

function s1(n, i, s = Oe(296), o = 25 * 15749 + 339189 + 267086, r = 4921 + -61 * 17 + -1 * 3884) {
    const e = Oe,
          a = {
              reLbj: e(816),
              zJdUR: function(e, t, n) {
                  return e(t, n)
              },
              jSsYY: function(e, t) {
                  return e in t
              },
              uBbDY: function(e, t) {
                  return e in t
              },
              LjRwb: e(1037),
              YxxYc: function(e, t) {
                  return e in t
              },
              AnmjC: e(896),
              sqBeN: e(1134),
              eSvOs: function(e, t) {
                  return e in t
              },
              qZDSu: e(1269),
              IgDwq: function(e, t) {
                  return e in t
              },
              LmttA: function(e, t, n) {
                  return e(t, n)
              },
              dnviT: e(703),
              fbEJJ: function(e, t, n) {
                  return e(t, n)
              },
              lNomP: e(685),
              WRetO: "hidefooter",
              hWCxP: "hidelogo",
              hHfyP: function(e, t, n) {
                  return e(t, n)
              },
              NLRbo: function(e, t) {
                  return e in t
              },
              mLuCj: e(726),
              yndRC: e(652),
              hLlpk: "mockerror",
              rSMyS: function(e, t) {
                  return e in t
              },
              ZWLJb: e(1399),
              XhguG: function(e, t) {
                  return e in t
              },
              kpxzQ: "plugins",
              vBkKu: function(e, t, n) {
                  return e(t, n)
              },
              JZBeY: "refetchonexpire",
              InIrx: e(1437),
              fdDwV: e(744),
              yUSpM: e(680),
              HTmkA: function(e, t) {
                  return e in t
              },
              YndCc: "verifyurl",
              uQsQH: function(e, t) {
                  return e in t
              },
              OHUYm: e(393),
              uCcBg: e(955),
              SuKqP: function(e, t) {
                  return e !== t
              },
              SEuAG: e(1552),
              EmUbO: e(1095),
              gZfHz: function(e, t) {
                  return e <= t
              },
              pYnxG: function(e, t, n, i) {
                  return e(t, n, i)
              },
              PDflU: function(e, t) {
                  return e - t
              }
          },
          l = new AbortController,
          c = Date["now"]();
    return {
        promise: (async () => {
            const t = e;
            if (a[t(1022)](a[t(397)], a[t(1020)])) {
                for (let e = r; a[t(561)](e, o); e += -1950 + 1 * -5944 + 7895) {
                    if (l[t(857)][t(1223)]) return null;
                    if (await a[t(481)](i1, i, e, s) === n) return {
                        number: e,
                        took: a[t(1498)](Date[t(741)](), c)
                    }
                }
                return null
            } else a["reLbj"] in _0x40a2fc && a[t(1484)](_0x2a277f, 1755 + -5817 + 4062 * 1, _0x4d3bd4 = _0x18ae33["auto"]), a[t(515)](t(1330), _0x3ae122) && a[t(1484)](_0x2bbc0e, -3342 + -9865 * 1 + -1 * -13223, _0x1f9bda = _0x4fe966["blockspam"]), a[t(595)](a[t(612)], _0x4ab58b) && a["zJdUR"](_0x18ed55, -23 * 121 + -1 * 2213 + 1 * 5011, _0x17e91e = _0x1b6216["challengeurl"]), a[t(353)](a[t(391)], _0x2ac9d5) && _0x4b84ec(9760 * 1 + 3971 + 548 * -25, _0x5e45bf = _0x26787d["challengejson"]), a[t(353)](a[t(1184)], _0x2fd8c7) && _0x9d2b20(-479 * -7 + 1 * -2861 + -475, _0x47ff64 = _0x27eeeb["debug"]), a[t(640)](a[t(780)], _0x4f2426) && a[t(1484)](_0x3f859b, -582 * -16 + 1997 * 3 + -15285, _0xc6aef0 = _0x164151[t(1269)]), a["IgDwq"]("expire", _0x206b6a) && a[t(1070)](_0x5f5508, -342 + 3 * -2804 + -1 * -8773, _0x1b8783 = _0x3f6e72["expire"]), a["IgDwq"](a[t(1256)], _0x4db457) && a[t(969)](_0x487d5d, 587 * -2 + -7843 + 9 * 1002, _0x2f6e0 = _0x50540c["floating"]), a[t(1402)] in _0x33874d && a[t(1484)](_0x403439, 1 * -4734 + -8505 + 13259, _0x41687c = _0x3393cb[t(685)]), a[t(640)](t(1067), _0x3d190b) && _0x4c9373(1101 + -285 + -795, _0x361486 = _0x5b67a2[t(1067)]), a[t(900)] in _0x36b252 && _0x2f8a0b(-7 * 1032 + -7437 + 14663, _0x2d9004 = _0x43b442[t(1301)]), a["hWCxP"] in _0x727332 && a[t(507)](_0xfb2902, -5 * -1621 + -745 * 10 + -652, _0x5533ef = _0x62e9ea["hidelogo"]), a[t(1014)](a[t(760)], _0x51ac41) && _0x1b929b(-709 + -5935 + -831 * -8, _0x302d3f = _0x1ac304[t(726)]), a[t(359)] in _0x42eab2 && _0x48a068(691 + 258 * -17 + 9 * 413, _0x3ea8a0 = _0x4de6d4[t(652)]), a[t(1014)](a[t(1004)], _0xab31c4) && _0x3b294b(5 * 941 + 46 * -114 + 562, _0x2d3a1c = _0x1014b1[t(1594)]), a["rSMyS"](a[t(1385)], _0x10c78b) && _0x2a9e3b(-11 * -125 + 9618 * -1 + 8267, _0x3bfaa8 = _0x4ed776[t(1399)]), a["XhguG"](a[t(537)], _0x390679) && a[t(724)](_0x37fb51, -7231 + -6589 + 13852, _0x14b1ca = _0x23b34c[t(1425)]), a[t(640)](a["JZBeY"], _0x27e098) && a[t(1070)](_0x3793fa, 12 * -571 + 18 * 238 + 2593, _0x18dbd8 = _0x18cbc6[t(305)]), a["rSMyS"](a["InIrx"], _0x12cfab) && _0x31f073(-3290 + 3849 + -533, _0x3c6fde = _0x276c89[t(1437)]), a[t(920)] in _0x5dd7da && _0x7db754(-8602 + -53 * 92 + 13511, _0x4fb122 = _0x1f933a[t(744)]), a["rSMyS"](a[t(303)], _0x5c80ea) && a["fbEJJ"](_0xa8c931, -4 * 2243 + 7627 + 1372, _0xef5008 = _0x73ec8e[t(680)]), a[t(1403)](a[t(954)], _0x22dc61) && a[t(724)](_0xa16a91, 3105 + 8902 * -1 + 5825 * 1, _0x4158a7 = _0x1f8a57[t(953)]), a["uQsQH"](a[t(597)], _0x3e1f72) && _0x5ca3e2(194 * -43 + 4390 + 3 * 1327, _0x1b6980 = _0x4d9c90["workers"]), t(436) in _0x3a0d9e && _0x3ec64b(7766 + -19 * -499 + -9 * 1913, _0x3010d4 = _0xba39e5["workerurl"]), a[t(1254)] in _0x153636 && a[t(1484)](_0x3782c9, 9 * -192 + -849 + -19 * -138, _0x1f7f32 = _0x520eb6["$$scope"])
        })(),
        controller: l
    }
}

function o1() {
    const e = Oe;
    try {
        return Intl[e(820)]()["resolvedOptions"]()["timeZone"]
    } catch {}
}

function r1(e) {
    const t = Oe,
          n = {
              ZzmEl: function(e, t) {
                  return e(t)
              },
              vcJOI: function(e, t) {
                  return e < t
              }
          },
          i = n["ZzmEl"](atob, e),
          s = new Uint8Array(i["length"]);
    for (let e = -1842 * -3 + -9205 + 1 * 3679; n["vcJOI"](e, i[t(1296)]); e++) s[e] = i[t(1093)](e);
    return s
}

function a1(t, n = 3444 + -368 * 4 + -1960) {
    const i = Oe,
          e = {};
    e[i(444)] = function(e, t) {
        return e < t
    }, e[i(284)] = function(e, t) {
        return e / t
    };
    const s = e,
          o = new Uint8Array(n);
    for (let e = 2 * 3718 + 1272 + -8708; s[i(444)](e, n); e++) o[e] = t % (6846 + 5107 + -11697), t = Math[i(1358)](s["rUlcJ"](t, -6398 + -3390 + 10044));
    return o
}
async function l1(e, t = "", i = 905018 * 1 + -60 * -24652 + -1384138, s = 5708 + 2498 + -1 * 8206) {
    const r = Oe,
          a = {
              aSPlT: function(e, t) {
                  return e(t)
              },
              SRSQg: r(832),
              YBtVJ: function(e, t) {
                  return e(t)
              },
              OJbTZ: function(e, t) {
                  return e(t)
              },
              vgLkH: r(1260),
              kmkHZ: function(e, t) {
                  return e(t)
              },
              QZBBU: r(1421),
              gPLCF: r(591),
              GJxgh: function(e, t, n, i) {
                  return e(t, n, i)
              },
              JkoJC: r(620),
              IMzoO: "0 0 20 20",
              dnzPH: r(1160),
              AXetD: r(1202),
              ktVap: r(1494),
              OonDO: "_blank",
              rxxmK: "aria-label",
              vCvSX: function(e, t) {
                  return e <= t
              },
              rhNVv: r(310),
              jbqYF: r(1590),
              pnXaI: r(296),
              mspnc: r(593),
              ExYZC: r(468),
              luXhf: function(e) {
                  return e()
              }
          },
          l = a[r(1585)],
          c = new AbortController,
          d = Date["now"](),
          n = async () => {
              const o = r,
                    t = {
                        nVCmE: function(e, t) {
                            const n = k1;
                            return a[n(1284)](e, t)
                        },
                        YQKqv: a[o(837)],
                        VcuDJ: function(e, t) {
                            const n = o;
                            return a[n(1090)](e, t)
                        },
                        HXnRL: "svg",
                        OEDZw: function(e, t) {
                            const n = o;
                            return a[n(1381)](e, t)
                        },
                        IHeHG: a[o(1158)],
                        JNQKB: function(e, t) {
                            const n = o;
                            return a[n(459)](e, t)
                        },
                        SGSUh: function(e, t) {
                            return e(t)
                        },
                        WZDrA: "currentColor",
                        LYlkr: function(e, t, n, i) {
                            return e(t, n, i)
                        },
                        HZFgn: a[o(1181)],
                        uypmc: a[o(451)],
                        UlIpH: function(e, t, n, i) {
                            const s = o;
                            return a[s(1334)](e, t, n, i)
                        },
                        xTZlM: a[o(470)],
                        hCzsd: a["IMzoO"],
                        xkbTV: a[o(808)],
                        oJple: function(e, t, n, i) {
                            return e(t, n, i)
                        },
                        cHOWM: "xmlns",
                        nbFwG: a[o(1153)],
                        nLYYy: a[o(1013)],
                        cFjHP: a[o(972)],
                        PEofw: o(1408),
                        XXFUt: a[o(288)]
                    };
              for (let e = s; a["vCvSX"](e, i); e += 4856 + -19 * -144 + 7591 * -1) {
                  if (a[o(1008)] === a[o(1008)]) {
                      if (c[o(857)]["aborted"] || !u || !f) return null;
                      try {
                          const n = await crypto[o(1398)][o(468)]({
                              name: l,
                              iv: a1(e)
                          }, u, f);
                          if (n) return {
                              clearText: (new TextDecoder)[o(1311)](n),
                              took: Date["now"]() - d
                          }
                      } catch {}
                  } else _0x1afaf2 = t["nVCmE"](_0x174163, t[o(704)]), _0xd8bc82 = t[o(890)](_0x5d2dc2, "a"), _0x43ff19 = t["nVCmE"](_0x417aed, t[o(913)]), _0x5cdd41 = t[o(855)](_0x124309, t[o(1277)]), _0x15a455 = t[o(923)](_0x401217, t[o(1277)]), _0x38dea9 = t[o(964)](_0x46ad33, o(1260)), _0x46b836(_0x670000, "d", o(940)), _0x2f9da6(_0xa63d9b, o(591), t[o(1489)]), t["LYlkr"](_0x1c4e9f, _0x10e53c, "d", t[o(881)]), _0x34d498(_0x2fea48, t[o(1603)], t["WZDrA"]), t[o(1517)](_0x2a34f8, _0x414050, "d", o(1478)), t[o(1517)](_0x2bf5b2, _0x12da26, t[o(1603)], "currentColor"), t[o(423)](_0x5db80b, _0x17e136, o(479), "22"), _0x563ed3(_0x4a7333, o(671), "22"), t[o(1517)](_0x55caab, _0x125121, t[o(1467)], t[o(380)]), t[o(423)](_0xe8a8fe, _0x4d96b5, t[o(1603)], t[o(1127)]), t[o(361)](_0x40ab2f, _0x101f0, t[o(1320)], o(856)), t[o(361)](_0x3aff09, _0x2f3996, t[o(1170)], _0x3a7e5d), _0x3a7e31(_0x356602, t[o(598)], t[o(602)]), _0x1979e0(_0x4c6a56, t[o(318)], o(1513)), _0x38136e(_0x2849ea, t[o(1084)], _0x3f8a7e = _0x407984[5191 + 7618 + 6399 * -2][o(517)])
              }
              return null
          };
    let u = null,
        f = null;
    try {
        f = a[r(1090)](r1, e);
        const o = await crypto[r(1398)][r(372)](a["pnXaI"], e1[r(443)](t));
        u = await crypto[r(1398)][r(937)](a[r(603)], o, l, !(4417 + -7630 + 3214), [a[r(396)]])
    } catch {
        return {
            promise: Promise[r(277)](),
            controller: c
        }
    }
    return {
        promise: a[r(1550)](n),
        controller: c
    }
}
var c1 = (e => (e[Oe(1463)] = Oe(1023), e[Oe(1050)] = Oe(1559), e[Oe(1154)] = Oe(957), e[Oe(821)] = "unverified", e["EXPIRED"] = "expired", e))(c1 || {});

function d1(e) {
    const t = Oe,
          n = {
              sWYLE: function(e, t, n, i) {
                  return e(t, n, i)
              },
              YEqXJ: t(1135),
              IheZj: '.altcha.svelte-ddsc3z.svelte-ddsc3z{background:var(--altcha-color-base, transparent);border:var(--altcha-border-width, 1px) solid var(--altcha-color-border, #a0a0a0);border-radius:var(--altcha-border-radius, 3px);color:var(--altcha-color-text, currentColor);display:flex;flex-direction:column;max-width:var(--altcha-max-width, 260px);position:relative;text-align:left}.altcha.svelte-ddsc3z.svelte-ddsc3z:focus-within{border-color:var(--altcha-color-border-focus, currentColor)}.altcha[data-floating].svelte-ddsc3z.svelte-ddsc3z{background:var(--altcha-color-base, white);display:none;filter:drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.2));left:-100%;position:fixed;top:-100%;width:var(--altcha-max-width, 260px);z-index:999999}.altcha[data-floating=top].svelte-ddsc3z .altcha-anchor-arrow.svelte-ddsc3z{border-bottom-color:transparent;border-top-color:var(--altcha-color-border, #a0a0a0);bottom:-12px;top:auto}.altcha[data-floating=bottom].svelte-ddsc3z.svelte-ddsc3z:focus-within::after{border-bottom-color:var(--altcha-color-border-focus, currentColor)}.altcha[data-floating=top].svelte-ddsc3z.svelte-ddsc3z:focus-within::after{border-top-color:var(--altcha-color-border-focus, currentColor)}.altcha[data-floating].svelte-ddsc3z.svelte-ddsc3z:not([data-state=unverified]){display:block}.altcha-anchor-arrow.svelte-ddsc3z.svelte-ddsc3z{border:6px solid transparent;border-bottom-color:var(--altcha-color-border, #a0a0a0);content:"";height:0;left:12px;position:absolute;top:-12px;width:0}.altcha-main.svelte-ddsc3z.svelte-ddsc3z{align-items:center;display:flex;gap:0.4rem;padding:0.7rem}.altcha-label.svelte-ddsc3z.svelte-ddsc3z{flex-grow:1}.altcha-label.svelte-ddsc3z label.svelte-ddsc3z{cursor:pointer}.altcha-logo.svelte-ddsc3z.svelte-ddsc3z{color:currentColor;opacity:0.3}.altcha-logo.svelte-ddsc3z.svelte-ddsc3z:hover{opacity:1}.altcha-error.svelte-ddsc3z.svelte-ddsc3z{color:var(--altcha-color-error-text, #f23939);display:flex;font-size:0.85rem;gap:0.3rem;padding:0 0.7rem 0.7rem}.altcha-footer.svelte-ddsc3z.svelte-ddsc3z{align-items:center;background-color:var(--altcha-color-footer-bg, transparent);display:flex;font-size:0.75rem;opacity:0.4;padding:0.2rem 0.7rem;text-align:right}.altcha-footer.svelte-ddsc3z.svelte-ddsc3z:hover{opacity:1}.altcha-footer.svelte-ddsc3z>.svelte-ddsc3z:first-child{flex-grow:1}.altcha-footer.svelte-ddsc3z a{color:currentColor}.altcha-checkbox.svelte-ddsc3z.svelte-ddsc3z{display:flex;align-items:center;height:24px;width:24px}.altcha-checkbox.svelte-ddsc3z input.svelte-ddsc3z{width:18px;height:18px;margin:0}.altcha-hidden.svelte-ddsc3z.svelte-ddsc3z{display:none}.altcha-spinner.svelte-ddsc3z.svelte-ddsc3z{animation:svelte-ddsc3z-altcha-spinner 0.75s infinite linear;transform-origin:center}@keyframes svelte-ddsc3z-altcha-spinner{100%{transform:rotate(360deg)}}'
          };
    n[t(701)](af, e, n["YEqXJ"], n[t(1195)])
}

function u1(e) {
    const s = Oe,
          o = {
              tHsGH: function(e, t) {
                  return e(t)
              },
              cDBzB: "svg",
              ERvSv: s(1260),
              RsOvQ: function(e, t, n, i) {
                  return e(t, n, i)
              },
              NwZGK: s(591),
              ZfCWA: s(690),
              xgDBz: s(1230),
              PIpIb: ".25",
              CGSkx: s(675),
              noeZs: s(1408),
              REQwz: s(458),
              EKOMO: function(e, t, n, i) {
                  return e(t, n, i)
              },
              GbHKv: s(479),
              ltUdh: s(671),
              MVjpN: s(620),
              IfWaD: s(346),
              Kdywf: s(1300),
              VXALE: function(e, t) {
                  return e & t
              },
              CpUhm: function(e, t) {
                  return e !== t
              },
              ETGvJ: function(e, t) {
                  return e + t
              },
              pOtSB: function(e, t) {
                  return e !== t
              },
              AGdGU: s(1356),
              QgwCx: function(e, t, n, i) {
                  return e(t, n, i)
              },
              FFbHI: function(e, t, n) {
                  return e(t, n)
              }
          };
    let r, a, l;
    return {
        c() {
            const e = s;
            r = o[e(1040)](hf, o[e(1194)]), a = hf(o["ERvSv"]), l = o[e(1040)](hf, o[e(1477)]), M(a, "d", e(1491)), o["RsOvQ"](M, a, o[e(606)], o["ZfCWA"]), o[e(426)](M, a, o[e(1435)], o["PIpIb"]), o[e(426)](M, l, "d", o[e(705)]), o[e(426)](M, l, o[e(606)], o["ZfCWA"]), M(l, o["noeZs"], o[e(582)]), o["EKOMO"](M, r, o["GbHKv"], "24"), o[e(1448)](M, r, o[e(592)], "24"), M(r, o[e(876)], o[e(1197)]), M(r, o[e(301)], e(856))
        },
        m(e, t) {
            const n = s,
                  i = {
                      aIase: function(e, t) {
                          const n = k1;
                          return o[n(819)](e, t)
                      },
                      syJWK: function(e, t) {
                          return o["CpUhm"](e, t)
                      },
                      QAlhO: function(e, t) {
                          const n = k1;
                          return o[n(1444)](e, t)
                      },
                      qjJPS: function(e, t, n, i) {
                          const s = k1;
                          return o[s(426)](e, t, n, i)
                      }
                  };
            o["pOtSB"](n(1272), o[n(1547)]) ? (o[n(1602)](df, e, r, t), o[n(1445)](rf, r, a), rf(r, l)) : (i[n(824)](_0x1cdbf3[-7745 + -1 * -2719 + -2 * -2513], -755 + -4004 + 6807) && i[n(1139)](_0x2dda31, _0x3df874 = i["QAlhO"](_0x5f2609[-7355 + -6873 + -29 * -491]["expired"], "")) && (_0x4dcc61[n(407)] = _0x209db8), _0x5bcd6c[3 * 1283 + 1 * 4783 + -8632] & 4669 + -11 * -393 + -256 * 35 && i[n(1571)](_0x2c164c, _0x43c991, n(473), _0x2a0b64[-1936 + -1 * -5479 + -3538]))
        },
        d(e) {
            e && uf(r)
        }
    }
}

function f1(n) {
    const i = Oe,
          s = {
              SPebk: function(e) {
                  return e()
              },
              isVQb: function(e, t) {
                  return e !== t
              },
              UQlTE: i(1041),
              bVVnJ: "label",
              Wavpf: function(e, t, n, i) {
                  return e(t, n, i)
              },
              qyHno: i(1042),
              zYLgQ: function(e, t) {
                  return e + t
              },
              TsCdx: i(805),
              EXCIK: i(1408),
              xkrFY: "svelte-ddsc3z",
              EryKC: function(e, t) {
                  return e & t
              },
              feMpB: function(e, t) {
                  return e !== t
              },
              fAWOT: function(e, t) {
                  return e !== t
              },
              itdFS: function(e, t) {
                  return e + t
              },
              JhAiW: function(e, t) {
                  return e(t)
              }
          };
    let o, r = n[1457 + 5877 + 2441 * -3][i(1092)] + "",
        a;
    return {
        c() {
            const e = i;
            if (s["isVQb"](e(1041), s["UQlTE"])) {
                const t = {};
                t["obfuscated"] = _0x126042, this[e(522)](t), s[e(1377)](_0x42496f)
            } else o = ff(s["bVVnJ"]), s[e(712)](M, o, s[e(1555)], a = s[e(291)](n[-2849 + 324 + -9 * -281], s[e(686)])), M(o, s[e(1243)], s[e(700)])
        },
        m(e, t) {
            const n = i;
            df(e, o, t), o[n(407)] = r
        },
        p(e, t) {
            const n = i;
            s[n(1599)](t[-9364 + -7 * 668 + 14040], 6661 * 1 + 522 + 395 * -13) && s[n(668)](r, r = s["zYLgQ"](e[9430 + 4784 + 7 * -2029][n(1092)], "")) && (o[n(407)] = r), s[n(1599)](t[8317 + -2758 + 1853 * -3], -4072 + 1891 + 169 * 13) && s[n(1549)](a, a = s["itdFS"](e[-1681 * -3 + 9187 + -14226], s["TsCdx"])) && M(o, s[n(1555)], a)
        },
        d(e) {
            e && s["JhAiW"](uf, o)
        }
    }
}

function h1(e) {
    const s = Oe,
          o = {
              DQvgF: function(e, t) {
                  return e === t
              },
              YMAqy: s(958),
              uhTNq: s(1177),
              XyzWO: s(302),
              xadtO: function(e, t, n, i) {
                  return e(t, n, i)
              },
              jFlsW: function(e, t) {
                  return e(t)
              },
              sNYiB: s(609),
              biYrA: "iKZbH",
              MKOnJ: s(1236),
              mxQFz: function(e, t) {
                  return e + t
              }
          };
    let r, a = e[354 * -14 + 3470 + -1497 * -1][s(957)] + "";
    return {
        c() {
            const e = s;
            if (o[e(1043)](o[e(362)], o[e(730)])) return this["$$"][e(1200)][251 * 1 + 6304 + -6514];
            else r = ff(o[e(490)])
        },
        m(e, t) {
            const n = s;
            o[n(746)](df, e, r, t), r["innerHTML"] = a
        },
        p(e, t) {
            const n = s;
            if (o[n(1043)](o[n(637)], o[n(1178)])) {
                const i = o["jFlsW"](_0xd9f800, o[n(841)]);
                i["id"] = _0x28c457, i[n(442)] = _0xf0fe8b, _0x20327c(_0x3bcc7c, i)
            } else t[5073 + -25 * -217 + 10498 * -1] & -3467 + 7985 + -2470 && a !== (a = o[n(898)](e[-1229 * -7 + 1 * -8939 + 1 * 347][n(957)], "")) && (r["innerHTML"] = a)
        },
        d(e) {
            const t = s;
            e && o[t(936)](uf, r)
        }
    }
}

function p1(n) {
    const i = Oe,
          o = {
              AZiPL: i(1199),
              OlKUc: i(636),
              gdoTN: function(e, t, n) {
                  return e(t, n)
              },
              wYCvB: "plugins",
              nBXmx: "none",
              wHkfg: function(e, t) {
                  return e(t)
              },
              tVoRf: i(370),
              hKXPl: i(415),
              IesOB: function(e, t) {
                  return e === t
              },
              payXT: i(1378),
              PzuxO: function(e) {
                  return e()
              },
              CEMdS: i(449),
              yWBNO: "span",
              CrYGE: "input",
              vtrZB: function(e, t, n, i) {
                  return e(t, n, i)
              },
              dnNvF: i(1033),
              ETDCU: "hidden",
              IAeIM: function(e, t, n, i) {
                  return e(t, n, i)
              },
              pfBQT: function(e, t) {
                  return e(t)
              },
              yrSWu: i(1454),
              rrzcS: function(e, t) {
                  return e !== t
              },
              hJsot: i(404),
              mybpH: i(726),
              mzJFS: function(e, t) {
                  return e === t
              },
              Ecewg: i(1428),
              tywSB: i(1228),
              eQWxj: function(e, t, n, i) {
                  return e(t, n, i)
              },
              aeAic: function(e, t, n, i) {
                  return e(t, n, i)
              },
              JQlxz: function(e, t) {
                  return e & t
              },
              SkjJa: i(884),
              IpmAo: function(e, t) {
                  return e(t)
              },
              PmDrU: function(e, t) {
                  return e + t
              }
          };
    let r, s = o[i(583)](n[1 * 58 + 905 * 5 + 18 * -254][i(1559)], ""),
        a, l;
    return {
        c() {
            const s = i,
                  e = {
                      nEmxu: o[s(1460)],
                      oIIFp: o[s(677)],
                      UlCKy: function(e, t, n) {
                          return o["gdoTN"](e, t, n)
                      },
                      AeAhK: s(393),
                      cMNxE: function(e) {
                          return e()
                      },
                      eUuSV: function(e, t, n) {
                          const i = s;
                          return o[i(549)](e, t, n)
                      },
                      Ehkbg: o[s(642)],
                      bAadG: o["nBXmx"],
                      CeMlL: function(e, t) {
                          const n = s;
                          return o[n(1458)](e, t)
                      },
                      XHovn: function(e, t) {
                          const n = s;
                          return o[n(1458)](e, t)
                      },
                      YyXCp: function(e, t) {
                          return e !== t
                      },
                      OfXAt: o[s(529)],
                      HYHCs: o[s(613)],
                      mEgcg: s(1389),
                      kqhzw: function(e, t) {
                          return o["IesOB"](e, t)
                      },
                      zwlWh: o[s(904)],
                      tFqCO: function(e) {
                          const t = s;
                          return o[t(999)](e)
                      },
                      GAnTz: s(851)
                  };
            if ("JokUX" !== o[s(550)]) {
                const t = {};
                t[s(1028)] = !(2658 * 2 + -9838 + -17 * -266), _0x4af040(e["nEmxu"], e[s(761)]), e["UlCKy"](_0x4d3518, e[s(962)], _0x56cfcd), e[s(1055)](_0x477b4a), e["eUuSV"](_0x240656, e[s(293)], _0x453669[s(1296)] ? _0x18099a[s(1313)](e => e[s(1143)][s(1112)])[s(486)](", ") : e[s(1362)]), _0x131894 && e[s(1226)](_0x1ca35b, s(926)), _0x412539 && e[s(1539)](_0x1e537f, _0x280c40), e[s(910)](_0x482cc4, void(-1 * -313 + 6992 + -7305)) && _0x57dc45(s(816), _0x2f7259), _0x2ae15c !== void(-1146 + 3099 + -1953) && e[s(1539)](_0x188bc2, _0x466436), _0x5b6f49 = _0x109df8["closest"](e[s(784)]), _0x25ab78 && (_0x28f8bb[s(742)](s(1363), _0x328889, t), _0x449f67[s(742)](e[s(1123)], _0x3e17f1), _0x4a28b1 === e[s(1359)] && _0x4ebb54[s(742)]("focusin", _0x83c441)), e[s(1036)](_0x52c9f0, e[s(1245)]) && (_0x30f596 ? e[s(477)](_0x11e6fc) : _0x5e098b()), _0x5ef94c && (_0x4b21a6 || _0xd625bb) && _0x118945(e[s(1503)]), _0x193634(() => {
                    const e = s;
                    _0x3e3241(e(1211))
                })
            } else r = ff(o["yWBNO"]), a = o["PzuxO"](mf), l = o[s(1458)](ff, o["CrYGE"]), o[s(850)](M, l, o["dnNvF"], o["ETDCU"]), o[s(823)](M, l, s(726), n[-8129 + -9 * 228 + 679 * 15]), l[s(1344)] = n[1542 + -4559 + 3023 * 1]
        },
        m(e, t) {
            const n = i;
            o[n(1164)](o[n(1133)], o[n(1527)]) ? (_0x5bd04d = o[n(1068)](_0x3e9e83, o["yrSWu"]), o[n(1412)](_0x2ecc6d, o[n(1413)]) && o[n(850)](_0x52f14e, _0x166e70, o[n(1314)], _0xf230dc)) : (o["eQWxj"](df, e, r, t), r[n(407)] = s, df(e, a, t), o[n(1613)](df, e, l, t))
        },
        p(e, t) {
            const n = i;
            t[1 * 7496 + -3679 + -3817 * 1] & -233 + -430 * 4 + -1 * -4001 && o[n(1412)](s, s = e[1 * 6881 + -1 * -1037 + -7907][n(1559)] + "") && (r[n(407)] = s), o[n(1406)](t[-1 * -88 + 4321 + -4409], 826 + -1 * 4724 + 103 * 38) && M(l, n(726), e[-13 * -710 + 2 * 2908 + -15042]), o[n(1406)](t[8 * 835 + -9593 + 1 * 2913], -330 + -12 * -478 + 2 * -2671) && (l[n(1344)] = e[-1 * 3727 + -1500 + 5233])
        },
        d(e) {
            const t = i;
            if (o[t(566)](t(884), o[t(283)])) e && (o[t(1068)](uf, r), o[t(383)](uf, a), o[t(383)](uf, l));
            else return this["$$"][t(1200)][26 * 95 + 7830 + -10298]
        }
    }
}

function m1(t) {
    const o = Oe,
          r = {
              NHNgN: function(e, t) {
                  return e(t)
              },
              rLMHo: o(832),
              ZGchL: o(1294),
              fxQrQ: function(e, t) {
                  return e(t)
              },
              TxvPK: o(1260),
              IEBqR: function(e, t, n, i) {
                  return e(t, n, i)
              },
              MvKph: o(940),
              vALlc: function(e, t, n, i) {
                  return e(t, n, i)
              },
              wBzOr: "fill",
              qaVjk: "currentColor",
              BBFWh: "M3.57212 2.33956C1.65755 3.94607 0.496389 6.11731 0.12782 8.40523L2.04639 9.13961C2.26047 7.15832 3.21057 5.25375 4.8577 3.87164C8.24231 1.03162 13.2883 1.4731 16.1284 4.8577L13.8302 6.78606L19.9633 9.13364C19.7929 7.15555 19.0335 5.20847 17.6604 3.57212C14.1104 -0.658624 7.80283 -1.21043 3.57212 2.33956Z",
              EOUOo: "M7 10H5C5 12.7614 7.23858 15 10 15C12.7614 15 15 12.7614 15 10H13C13 11.6569 11.6569 13 10 13C8.3431 13 7 11.6569 7 10Z",
              pjDDT: function(e, t, n, i) {
                  return e(t, n, i)
              },
              KvLEm: o(479),
              XhlGe: o(1475),
              pjZKO: function(e, t, n, i) {
                  return e(t, n, i)
              },
              LINxY: o(1160),
              meogQ: o(1300),
              dmADF: "href",
              hisMZ: function(e, t, n, i) {
                  return e(t, n, i)
              },
              uKycY: o(1366),
              rWvov: "class",
              TxCqo: o(1513),
              npYHp: function(e, t, n, i) {
                  return e(t, n, i)
              },
              YlWsy: o(1291),
              NHbRd: function(e) {
                  return e()
              },
              GLQwi: function(e, t) {
                  return e === t
              },
              sAWpK: function(e, t, n, i) {
                  return e(t, n, i)
              },
              HrRlJ: function(e, t, n) {
                  return e(t, n)
              },
              cmmDr: "HfyqG",
              IZhRr: function(e, t) {
                  return e & t
              },
              soGgu: function(e, t, n, i) {
                  return e(t, n, i)
              },
              gfftj: function(e, t, n, i) {
                  return e(t, n, i)
              },
              HJWTJ: function(e, t) {
                  return e !== t
              },
              sAbws: "APGSo"
          };
    let a, l, c, d, u, f, i;
    return {
        c() {
            const e = o;
            a = r[e(344)](ff, r[e(1609)]), l = r["NHNgN"](ff, "a"), c = r[e(344)](hf, r[e(511)]), d = r["fxQrQ"](hf, r[e(1341)]), u = r[e(344)](hf, r[e(1341)]), f = r[e(1604)](hf, r["TxvPK"]), r["IEBqR"](M, d, "d", r[e(1278)]), r["vALlc"](M, d, r[e(493)], r[e(951)]), M(u, "d", r["BBFWh"]), r["IEBqR"](M, u, r[e(493)], r["qaVjk"]), M(f, "d", r[e(321)]), r[e(679)](M, f, r[e(493)], r["qaVjk"]), r[e(1213)](M, c, r[e(735)], "22"), r[e(903)](M, c, e(671), "22"), r[e(903)](M, c, e(620), r[e(828)]), r["pjZKO"](M, c, e(591), r[e(1462)]), M(c, r[e(319)], e(856)), r[e(1213)](M, l, r[e(1376)], S1), r[e(1221)](M, l, e(1494), r[e(1546)]), M(l, r["rWvov"], r[e(431)]), r[e(1146)](M, l, r[e(985)], i = t[-7871 * 1 + 1 * -2063 + 9945][e(517)])
        },
        m(e, t) {
            const n = o,
                  i = {
                      RMuev: function(e) {
                          const t = k1;
                          return r[t(922)](e)
                      }
                  };
            if (r[n(1144)](n(272), n(793))) {
                const s = {};
                s[n(436)] = _0x147ffa, this[n(522)](s), i[n(919)](_0x25d374)
            } else r[n(365)](df, e, a, t), rf(a, l), rf(l, c), r["HrRlJ"](rf, c, d), rf(c, u), rf(c, f)
        },
        p(e, t) {
            const n = o;
            if (r["GLQwi"](r["cmmDr"], n(1232))) return _0x38d130[n(557)](_0x2fb07d);
            else r[n(634)](t[-34 * -261 + 4 * 1389 + 13 * -1110], -3808 + 7306 + -1450) && i !== (i = e[23 * -13 + 1928 * 5 + -9330][n(517)]) && r["soGgu"](M, l, r[n(985)], i)
        },
        d(e) {
            const n = o,
                  t = {
                      RGqcW: function(e, t, n, i) {
                          const s = k1;
                          return r[s(1249)](e, t, n, i)
                      }
                  };
            if (r[n(1386)](r[n(546)], r["sAbws"])) {
                const i = {};
                i["cancelable"] = _0x3afabc;
                const s = t[n(1316)](_0x1265aa, _0x26642b, _0x389074, i);
                return _0x14d752["slice"]()[n(699)](e => {
                    const t = n;
                    e[t(1405)](_0x239279, s)
                }), !s[n(630)]
            } else e && r[n(344)](uf, a)
        }
    }
}

function g1(e) {
    const o = Oe,
          r = {
              dPWWV: function(e, t) {
                  return e === t
              },
              uBQKO: function(e, t) {
                  return e(t)
              },
              ckXHD: function(e, t) {
                  return e !== t
              },
              hgAEr: o(1560),
              CScwS: o(767),
              ONnMw: o(832),
              Akhpd: function(e, t) {
                  return e(t)
              },
              kITiu: o(1294),
              PMPOn: function(e) {
                  return e()
              },
              CsAbC: function(e, t, n, i) {
                  return e(t, n, i)
              },
              jhaLA: o(392),
              ViPwO: o(1192),
              SObqV: function(e, t, n, i) {
                  return e(t, n, i)
              },
              yvaFv: o(1225),
              Sbatp: "M6 18L18 6M6 6l12 12",
              cobxd: function(e, t, n, i) {
                  return e(t, n, i)
              },
              tOPNp: "width",
              mpebe: o(671),
              xoDju: o(1300),
              FKUiQ: o(856),
              RyhOt: function(e, t, n, i) {
                  return e(t, n, i)
              },
              laUGl: o(591),
              fIqLB: function(e, t, n, i) {
                  return e(t, n, i)
              },
              jtGKl: o(620),
              RCHdm: o(346),
              tjbAE: function(e, t, n, i) {
                  return e(t, n, i)
              },
              ppUfC: o(271),
              uaQvS: "1.5",
              hrttr: o(448),
              iMQBa: o(1592),
              bSXah: function(e, t) {
                  return e + t
              },
              OMEZy: o(773),
              JaARX: function(e, t, n, i) {
                  return e(t, n, i)
              },
              jhQYS: function(e, t, n) {
                  return e(t, n)
              },
              MzfSy: function(e, t, n) {
                  return e(t, n)
              },
              sPOkI: function(e, t) {
                  return e(t)
              },
              WUbxL: function(e, t) {
                  return e(t)
              },
              QirXU: function(e, t) {
                  return e(t)
              }
          };
    let a, l, c, d;

    function i(e, t) {
        const n = o;
        if (r[n(1117)]("hyiSV", "hyiSV")) return r[n(1117)](e[718 + -940 + 229], c1[n(1248)]) ? x1 : y1;
        else _0x24958f && _0x281ba1(_0x5ca859)
    }
    let s = r[o(1235)](i, e),
        u = r["QirXU"](s, e);
    return {
        c() {
            const n = o,
                  e = {
                      WqpMH: function(e, t) {
                          const n = k1;
                          return r[n(925)](e, t)
                      }
                  };
            if (r[n(1126)](r[n(934)], r[n(465)])) a = r[n(925)](ff, r["ONnMw"]), l = r[n(1116)](hf, r[n(1063)]), c = r[n(1116)](hf, n(1260)), d = r["PMPOn"](mf), u["c"](), r[n(1168)](M, c, r["jhaLA"], r[n(1388)]), r[n(1024)](M, c, r[n(653)], r[n(1388)]), r[n(1024)](M, c, "d", r[n(1457)]), r[n(899)](M, l, r[n(621)], "14"), M(l, r[n(938)], "14"), r[n(1024)](M, l, r["xoDju"], r["FKUiQ"]), r[n(1189)](M, l, r[n(1309)], "none"), r["fIqLB"](M, l, r["jtGKl"], r[n(1556)]), r[n(1157)](M, l, r[n(655)], r[n(1136)]), r["SObqV"](M, l, r[n(1432)], n(690)), r[n(1189)](M, a, "class", r[n(732)]);
            else {
                const t = {};
                t[n(806)] = function(e, t) {
                    return e !== t
                };
                const i = t;
                if (!e[n(1579)](_0x1b39e0, _0x13a6e1)) return _0x177e04;
                const s = this["$$"][n(1497)][_0x2b89a8] || (this["$$"]["callbacks"][_0x411aeb] = []);
                return s[n(959)](_0x20666d), () => {
                    const e = n,
                          t = s[e(1003)](_0x46affb);
                    i[e(806)](t, -(-5969 + -4683 + 10653)) && s[e(1206)](t, -11 * 151 + 582 + 15 * 72)
                }
            }
        },
        m(e, t) {
            const n = o;
            r[n(754)] === r[n(754)] ? (r["JaARX"](df, e, a, t), r[n(765)](rf, a, l), r[n(1563)](rf, l, c), r[n(1563)](rf, a, d), u["m"](a, null)) : _0x775679[-8018 + -5 * 1811 + 9 * 1897] & -4622 + -31 * 83 + 13 * 711 && _0x1a9be6 !== (_0x9b2d5a = r[n(1247)](_0x38dbf4[-1 * -5184 + -1 * -2194 + -7367][n(957)], "")) && (_0x4e321a["innerHTML"] = _0x390b24)
        },
        p(e, t) {
            const n = o;
            r[n(1117)](s, s = r[n(880)](i, e)) && u ? u["p"](e, t) : (u["d"](8618 + 3742 + -12359), u = r[n(880)](s, e), u && (u["c"](), u["m"](a, null)))
        },
        d(e) {
            const t = o;
            e && r[t(1116)](uf, a), u["d"]()
        }
    }
}

function y1(t) {
    const i = Oe,
          s = {
              tgKDT: function(e, t) {
                  return e(t)
              },
              HtGUX: i(832),
              QwBSd: function(e, t, n, i) {
                  return e(t, n, i)
              },
              ZhIXG: i(473),
              thsTt: function(e, t, n, i) {
                  return e(t, n, i)
              },
              lNHIE: function(e, t) {
                  return e !== t
              },
              ZNhYH: function(e, t) {
                  return e + t
              },
              MFghe: function(e, t, n, i) {
                  return e(t, n, i)
              },
              qXLAS: "fbDCm",
              vzRsM: i(1338),
              IMhrT: function(e, t) {
                  return e + t
              }
          };
    let o, r = s[i(416)](t[7 * -970 + -8189 * 1 + -2998 * -5][i(1023)], "");
    return {
        c() {
            const e = i;
            o = s[e(1589)](ff, s["HtGUX"]), s[e(358)](M, o, s["ZhIXG"], t[-2227 + 8641 + -6409])
        },
        m(e, t) {
            const n = i;
            s["thsTt"](df, e, o, t), o[n(407)] = r
        },
        p(e, t) {
            const n = i;
            t[4951 * -2 + -4815 + 1 * 14717] & -14 * -59 + -2 * 657 + 317 * 8 && s[n(812)](r, r = s[n(817)](e[-5191 + 8261 + -7 * 437][n(1023)], "")) && (o[n(407)] = r), t[-1966 * 3 + 8306 + -2408] & -1655 + -848 * 2 + -17 * -199 && s["MFghe"](M, o, s[n(892)], e[-1 * 2587 + 8520 + -4 * 1482])
        },
        d(e) {
            const t = i;
            if (s["lNHIE"](s[t(418)], s[t(1053)])) e && s[t(1589)](uf, o);
            else return this["$$"]["ctx"][-25 * 2 + -1 * -557 + -53 * 9]
        }
    }
}

function x1(t) {
    const i = Oe,
          s = {
              qOwAQ: function(e, t) {
                  return e(t)
              },
              XjnPy: i(832),
              rrceQ: i(473),
              Wqvlh: function(e, t, n, i) {
                  return e(t, n, i)
              },
              QgTkL: function(e, t) {
                  return e & t
              },
              PkvvC: function(e, t) {
                  return e !== t
              },
              dXQEj: function(e, t) {
                  return e + t
              },
              JTVFZ: function(e, t, n, i) {
                  return e(t, n, i)
              },
              KEyyk: function(e, t, n) {
                  return e(t, n)
              },
              mMYit: function(e, t, n) {
                  return e(t, n)
              },
              mDOYM: function(e, t, n) {
                  return e(t, n)
              },
              alJnS: "change",
              FLqHy: function(e, t, n, i) {
                  return e(t, n, i)
              },
              zYAxo: function(e, t, n, i) {
                  return e(t, n, i)
              },
              GKHlQ: i(697),
              FBDvL: i(942),
              jnoKA: function(e, t) {
                  return e(t)
              },
              qxBfC: function(e, t) {
                  return e + t
              }
          };
    let o, r = s[i(844)](t[-9923 * -1 + -187 + 9725 * -1][i(695)], "");
    return {
        c() {
            const e = i;
            o = s[e(406)](ff, s[e(1030)]), M(o, s[e(610)], t[-5614 + -2 * -4867 + 5 * -823])
        },
        m(e, t) {
            const n = i;
            s[n(1593)](df, e, o, t), o[n(407)] = r
        },
        p(e, t) {
            const n = i;
            s[n(656)](t[512 + -1 * 2833 + 2321 * 1], 1561 * -3 + 1957 + -4774 * -1) && s[n(1373)](r, r = s[n(1439)](e[-5305 + 160 * 35 + -284]["expired"], "")) && (o["innerHTML"] = r), t[5 * 1713 + 1571 * -1 + -6994] & -2 * -4983 + 1535 + -11469 && s[n(1593)](M, o, s[n(610)], e[-1 * 5853 + -6 * -921 + 332])
        },
        d(e) {
            const t = i;
            s[t(1140)] !== t(942) ? (_0x52b1be && _0x4ea446["m"](_0x2881f7, _0x4ac0ec), s["Wqvlh"](_0x7b8869, _0x417aa5, _0x39009c, _0x53272a), s[t(488)](_0x3beb2e, _0x5d043e, _0x549143, _0x5a0ee8), s[t(943)](_0xa2e692, _0x2a5f8b, _0x34d4a5), _0x1ae17e && _0x13f647["m"](_0x2876a0, null), s["KEyyk"](_0x35f289, _0x5b7afe, _0x39eca7), s[t(943)](_0x53c0dd, _0x2862a9, _0x256adb), s[t(1303)](_0x31dcbc, _0x49a83e, _0x25e754), _0x452eff[t(1531)] = _0x39ac09[-9537 + -3392 + 12937], s["KEyyk"](_0x1b35af, _0x5d9e9f, _0x202cde), _0x4fc4a1(_0x5bf6c5, _0x57f7bf), _0x2bce2f["m"](_0x599a29, null), s["mMYit"](_0x411507, _0x5532cb, _0x26cccb), _0x463c0b && _0x31eae8["m"](_0x5bbb53, null), s["KEyyk"](_0xae5a0c, _0x3719fb, _0xed2d8d), _0x478e3c && _0x3d85c1["m"](_0x368641, null), s[t(1615)](_0x2a68b5, _0x11fee9, _0x1934be), _0x3c8fcd && _0x115ca1["m"](_0x158942, null), s[t(1303)](_0x4aaf5d, _0xf748ea, _0x498c05), _0x1d56b6 && _0x3647c4["m"](_0xc18616, null), _0x4e1b76[-31 * 113 + 1534 + -2 * -1009](_0x35c3f1), _0x23bd98 = !(274 * 18 + -2111 + 13 * -217), _0x5a4721 || (_0x7bd4f2 = [s["Wqvlh"](_0xaa13a3, _0x18254d, s[t(309)], _0x555103[-5056 + -9967 + 15070]), s[t(619)](_0x45e576, _0x43a426, s["alJnS"], _0x4912c2[-6133 + -6143 + 12289]), s[t(1442)](_0x34ad9c, _0x12eeb2, s[t(1108)], _0x4d03f9[288 + -9 * 280 + 2246])], _0x334f26 = !(8141 * -1 + -7897 + -2673 * -6))) : e && s[t(543)](uf, o)
        }
    }
}

function w1(e) {
    const s = Oe,
          o = {
              CliRJ: function(e, t) {
                  return e(t)
              },
              NBpaB: s(832),
              JzQKe: function(e, t, n, i) {
                  return e(t, n, i)
              },
              LvxUZ: s(1408),
              dhYZu: s(1135),
              xuFng: function(e, t, n, i) {
                  return e(t, n, i)
              },
              PxneK: s(1576),
              TNilb: s(1434),
              vHtcy: function(e, t, n, i) {
                  return e(t, n, i)
              },
              nvJLb: function(e, t, n) {
                  return e(t, n)
              },
              VAdas: function(e, t, n) {
                  return e(t, n)
              },
              YUSML: s(838),
              cBcOK: function(e, t) {
                  return e === t
              },
              nkHKN: "hRzth",
              Usexu: "EWATv",
              rlCeZ: function(e, t) {
                  return e & t
              },
              Yeupy: function(e, t) {
                  return e + t
              },
              RWiJw: s(673),
              GlXWK: s(336),
              CzEdW: function(e, t) {
                  return e(t)
              }
          };
    let r, a, l = o[s(1364)](e[-9997 + 7082 + 133 * 22]["footer"], "");
    return {
        c() {
            const e = s;
            r = o[e(909)](ff, o[e(1407)]), a = o[e(909)](ff, o["NBpaB"]), o[e(1056)](M, a, o[e(607)], o[e(1611)]), o[e(1274)](M, r, e(1408), e(748))
        },
        m(e, t) {
            const n = s;
            if (o[n(1258)] === o["TNilb"]) {
                const i = {};
                return i[n(816)] = _0x312f06, i[n(1330)] = _0x13d1f6, i["challengeurl"] = _0x389409, i["debug"] = _0x2be8c6, i[n(1269)] = _0x4585db, i[n(1476)] = _0x316ca8, i["floating"] = _0x1dad4e, i[n(685)] = _0x48d405, i[n(1067)] = _0x481a16, i["hidefooter"] = _0x2704a9, i["hidelogo"] = _0x494795, i[n(726)] = _0x3b0ca0, i[n(652)] = _0x31b987, i[n(1594)] = _0x4d169a, i[n(1399)] = _0x307c99, i["refetchonexpire"] = _0x19c331, i[n(1437)] = _0x42b564, i[n(744)] = _0x2795d0, i["test"] = _0x59e809, i[n(953)] = _0x59f2ce, i[n(393)] = _0x4672a4, i[n(436)] = _0x414458, i
            } else o[n(472)](df, e, r, t), o["nvJLb"](rf, r, a), a[n(407)] = l
        },
        p(e, t) {
            const n = s,
                  i = {
                      qPKXM: function(e, t, n) {
                          const i = k1;
                          return o[i(1342)](e, t, n)
                      },
                      PAhpj: o[n(1049)]
                  };
            o["cBcOK"](o[n(600)], o[n(475)]) ? i[n(722)](_0x57bfda, i[n(350)], _0x480732) : o[n(1224)](t[-8233 + -47 * -135 + 1888], 5963 + -5735 + -140 * -13) && l !== (l = o[n(1364)](e[5806 * 1 + -137 * 11 + -4288][n(647)], "")) && (a[n(407)] = l)
        },
        d(e) {
            const t = s;
            if (o[t(629)] !== o["GlXWK"]) e && o[t(944)](uf, r);
            else return this["$$"][t(1200)][-2740 + -5 * 1572 + -3 * -3541]
        }
    }
}

function b1(i) {
    const s = Oe,
          o = {
              pRqJs: function(e, t) {
                  return e !== t
              },
              KNrwc: s(980),
              nlhhJ: function(e, t) {
                  return e(t)
              },
              yWvMl: s(832),
              qedLD: function(e, t, n, i) {
                  return e(t, n, i)
              },
              OLljL: s(1408),
              ZxSYP: s(762),
              XjqWp: function(e, t, n, i) {
                  return e(t, n, i)
              },
              XulQK: function(e, t, n) {
                  return e(t, n)
              },
              lpxtL: function(e, t) {
                  return e !== t
              },
              lBwGo: "mROdD"
          };
    let r;
    return {
        c() {
            const e = s;
            if (o["pRqJs"](e(980), o[e(326)])) {
                const t = this[e(1263)][e(1025)](_0x54fd63, _0x6077c0);
                this[e(290)][e(1545)](_0x381c9a, t)
            } else r = o["nlhhJ"](ff, o["yWvMl"]), o[e(1374)](M, r, o[e(1251)], o[e(355)])
        },
        m(e, t) {
            const n = s;
            o[n(1203)](df, e, r, t), i[-9975 + 5351 + -292 * -16](r)
        },
        p: zu,
        d(e) {
            const t = s,
                  n = {
                      YtDyz: function(e, t, n) {
                          const i = k1;
                          return o[i(1418)](e, t, n)
                      }
                  };
            if (o[t(756)]("mROdD", o[t(411)])) return n["YtDyz"](_0x3806b3, _0x31a022[t(1239)] || _0xbec9e7, _0x41c368), _0x2eb5b1[t(1323)];
            else e && o[t(1219)](uf, r), i[8637 + 568 + -1 * 9157](null)
        }
    }
}

function v1() {
    const e = ["msWGu", "LkXDJ", "xGsSd", "sgnTP", "vunhD", "pReuG", "blockspam", "key", "4Ipzkcb", "ncBrq", "GJxgh", "UJcxz", "MPAfx", "RSGBm", "vtfOu", "IKoav", "cRkNg", "TxvPK", "VAdas", "YVHto", "value", "mocking error", "Biaan", "onErrorChange", "data:text/javascript;base64,", "wuYqN", "algorithm", "pTBxc", "removeEventListener", "csuhG", "eRuag", "before_update", "oQTwK", "SAnuT", "floor", "mEgcg", "documentElement", "kkfSP", "bAadG", "submit", "Yeupy", "ayVRl", "_blank", "RpAMG", 'input[name="', "311678FumWmk", "FnOYN", "qUzoW", "gSIce", "PkvvC", "qedLD", "WmITY", "dmADF", "SPebk", "onload", "kGfnr", "KSSoC", "OJbTZ", "on_destroy", "2124355dTxESq", "PKdVC", "ZWLJb", "HJWTJ", "JOist", "ViPwO", "onfocus", "eXDRu", "eVLkn", "WEQVV", "OAoLu", "nFoiL", "DDouh", "NGzCA", "YZebk", "subtle", "obfuscated", "kHvtF", "DnePO", "lNomP", "HTmkA", "fvZPT", "call", "JQlxz", "NBpaB", "class", "DixiV", "ZSyfl", "hcyJD", "rrzcS", "hJsot", "zBLGZ", "ftXFH", "HRwVP", "update", "XulQK", "aEKZN", "[name=", "M3.57212 2.33956C1.65755 3.94607 0.496389 6.11731 0.12782 8.40523L2.04639 9.13961C2.26047 7.15832 3.21057 5.25375 4.8577 3.87164C8.24231 1.03162 13.2883 1.4731 16.1284 4.8577L13.8302 6.78606L19.9633 9.13364C19.7929 7.15555 19.0335 5.20847 17.6604 3.57212C14.1104 -0.658624 7.80283 -1.21043 3.57212 2.33956Z", "Object", "zORhn", "dHpDA", "plugins", "$$ctor", "host", "SMOpe", "ioWDF", "jpPuP", "LsZwB", "hrttr", "FZHBd", "dKzNX", "xgDBz", "LYEln", "spamfilter", "application/json", "dXQEj", "lZvlm", "yPbwr", "zYAxo", "WFbuV", "ETGvJ", "FFbHI", "ZrhoA", "QQXvy", "EKOMO", "btoSb", "iGWzJ", "HKfHj", "eDbmf", "uemgU", "slot", "KnEok", "ubpAi", "Sbatp", "wHkfg", "CQNal", "AZiPL", "checkbox", "LINxY", "ERROR", "tjOQN", "wToUl", "wgdYx", "xTZlM", "state", "gefsA", "left", "false", "HVXIz", "batKB", "AtwSk", "0 0 20 20", "expire", "ERvSv", "M7 10H5C5 12.7614 7.23858 15 10 15C12.7614 15 15 12.7614 15 10H13C13 11.6569 11.6569 13 10 13C8.3431 13 7 11.6569 7 10Z", "element", "yVvIe", "gyxPE", "NcrWg", "Cxvor", "zJdUR", "eNLPR", "serververification", "solve", "Miueg", "WZDrA", "ffRyr", "M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z", "verify", "HhiWw", "target", "MbBKr", "clientHeight", "callbacks", "PDflU", "GsSOv", "hHlfF", "kwpZg", "hbuvy", "GAnTz", "uHKtj", "Fuqwe", "get", "fields", "Uivxy", "FbPLi", "AAbMg", "classifier", "PiOOe", "altcha-logo svelte-ddsc3z", "UkZVn", "QqcVp", "kXGtE", "LYlkr", "altchaCreateWorker", "defineProperty", "PPDMS", "anchor", 'input[type="text"]:not([data-no-spamfilter]), textarea:not([data-no-spamfilter])', "X-Altcha-Config", "uPJpA", "HyEBD", "getAttribute", "tywSB", "RlxrV", "querySelectorAll", "eQqIy", "checked", "vHrzl", "XMPtC", "XvybN", "MkVJz", "sMrxD", "ggNqv", "ZkUeS", "XHovn", "lqjAA", "DrOpW", "__svelte", "MSVJl", "/altcha", "set", "uKycY", "AGdGU", "expectedCountries", "fAWOT", "luXhf", "VkRcD", "bctlO", "ieoGb", "gvcYW", "qyHno", "RCHdm", "wLPDa", "yRzVW", "verified", "SLSyh", "M6 18L18 6M6 6l12 12", "VGhsb", "MzfSy", "GGSBL", "replace", "xtJaE", "VBhBP", "lqdbC", "hFvBr", "oTIqS", "qjJPS", "YWNnx", "mXcRc", "BhSXa", "ZyTCQ", "iOQXb", "clientWidth", "IILem", "WqpMH", "ZlSNB", "AmnWo", "GXKCG", "hZfwA", "FuupB", "jbqYF", "altcha svelte-ddsc3z", "ObAbf", "removeAttribute", "tgKDT", "AES-GCM", "DvmDG", "altcha-error svelte-ddsc3z", "Wqvlh", "mockerror", "fZHrD", "Jjhmw", "UJIhu", "cuxMf", "EryKC", "SNPId", "NxrfB", "QgwCx", "uypmc", "fxQrQ", "FmHtO", "lnmnb", "YbvlX", "KsRCQ", "rLMHo", "ELPPJ", "dhYZu", "hzlBp", "aeAic", "nsnCy", "mDOYM", "aQTOj", "xuyJp", "timeZone", "MUUsD", "x-altcha-spam-filter", "expectedLanguages", "intro", "iyjFq", "stroke-width", "Vptfp", "number", "FtCaV", "SxCZm", "fLuak", "reject", "arsOR", "IUOxB", "setFloatingAnchor", "cdxAn", "Nojlf", "SkjJa", "rUlcJ", "NYwXb", "off", "clearText", "rxxmK", "zKqkp", "$$l_u", "zYLgQ", "$$cn", "Ehkbg", "Kxcaj", "WVpOm", "SHA-256", "YiGKU", "IryLE", "WHNBC", "MNRJn", "Kdywf", "span", "yUSpM", "UbjfQ", "refetchonexpire", "mAdNR", "attributes", "QBDAO", "alJnS", "XzjID", "(?<!\\r)\\n", "Challenge is too short. Min. 40 chars.", 'input[type="submit"], button[type="submit"], button:not([type="button"]):not([type="reset"])', "CtzAd", "reduce", "xsAoi", "$$l", "PEofw", "meogQ", "pAQbj", "EOUOo", "log", "bound", "YRPWT", "ZaMKA", "KNrwc", "ydmRz", "prototype", "AprAP", "XOMWw", "onsubmit", "aCdhc", "ESGmi", "JmtSz", "ReFip", "SMKFh", "CzgVs", "Qjrtu", "PmwHG", "aufra", "payload", "PnfVr", "define", "NHNgN", "QUXHX", "0 0 24 24", "wgrlC", "LzMPw", "iNbHK", "PAhpj", "data-state", "add", "YxxYc", "JNgiu", "ZxSYP", "ZEsuX", "XZRwM", "QwBSd", "yndRC", "ipAddress", "oJple", "YMAqy", "ucjLt", "jtcJg", "sAWpK", "toUpperCase", "nmOtQ", "cQYNf", "etbWf", "form", "FzxTs", "digest", "scroll", "eHJct", "pop", "8ezOkqN", "jKzOt", "DVyiv", "YSbBO", "hCzsd", "TiASR", "open", "IpmAo", "BpAPi", "wEjUZ", "sGqax", "WIDYS", "then", "ownerDocument", "nDJkG", "AnmjC", "stroke-linecap", "workers", "Server responded with ", "XayQe", "ExYZC", "SEuAG", "jPRBm", "NiuFq", "BvtGj", "kfmbH", "phlpQ", "mkbHE", "default", "zzUWa", "qOwAQ", "innerHTML", "mJNcD", "pWMIN", "signature", "lBwGo", "JuSfl", "tUJMA", "wMNtC", "reset", "IMhrT", "BvFtq", "qXLAS", "rUmAP", "KCuLl", "TbNjV", "KjrTx", "UlIpH", "HsDEe", "StYga", "RsOvQ", "GekuB", "kKMoA", "TvgiD", "toAttribute", "TxCqo", "tLJoR", "EQDrB", "xXCkP", "xBFrm", "workerurl", "zPYgx", "hsiVg", "fBNwB", "$destroy", "deGTx", "textContent", "encode", "GhDrv", "cMKwN", "qNMki", "VNUKR", "stroke", "JokUX", "altchaPlugins", "gPLCF", "SrlXx", "Plugin `obfuscation` not found. Import `altcha/plugins/obfuscation` to load it.", "LMLWn", "$$r", "auKSB", "bottom", "altcha-spinner svelte-ddsc3z", "kmkHZ", "bubbles", "PvOQB", "ZPDwP", "xTIgt", "tTkvi", "CScwS", "susTx", "SpamFilter returned negative classification.", "decrypt", "https://altcha.org/", "JkoJC", "postMessage", "vHtcy", "title", "JXnPl", "Usexu", "XUqxT", "tFqCO", "10799610qWSzhu", "width", "Verification failed. Try again later.", "pYnxG", "ojDtq", "salt", "AxUAA", "data", "join", "sltwO", "JTVFZ", "lkypW", "XyzWO", "email", '">ALTCHA</a>', "wBzOr", "dirty", "attributeChangedCallback", "FCZPu", "KSeCl", "wsjQR", "wKgNP", "xkkvM", "BWHPx", "icBuy", "QIIYX", "oppmy", "IXHHh", "setAttribute", "hHfyP", "uKzcN", "UPWsc", "SKpsn", "ZGchL", "bOQOd", "eSucG", "$set", "jSsYY", "DjcnP", "ariaLinkLabel", "vbWKw", "iqlaL", "parse", "json", "$$set", "cancelable", "MJzhN", "getRootNode", "hydrate", "slice", "tCoDO", "tVoRf", "SkziS", "UEfHT", "$$g_p", "RTumo", "KeSCp", "action", "duxLh", "kpxzQ", "challenge", "YBycX", "rUKUC", "childNodes", "Number", "jnoKA", "iOVFP", "hsENE", "sAbws", "stringify", "SGyGr", "gdoTN", "CEMdS", "SkPwE", "qPwIA", "bBJuM", "LPPNP", "Unknown algorithm value. Allowed values: ", "RrShO", "createTextNode", "WrfrM", "ASaEP", "jEIFW", "gZfHz", "reportValidity", "utFTu", "YiveE", "catch", "IesOB", "mrlPu", "getTime", "JgWfF", "IJRWf", "VJgJO", "gYULU", "bAQVL", "qWkSF", "JodZM", "rfhHZ", "cEpdb", "icruo", "fCLrN", "altcha", "lMFio", "REQwz", "PmDrU", "TbrNq", "rILhX", "GLauD", "hvtzC", "TYBBt", "znCBX", "TXUuw", "fill", "ltUdh", "raw", "filter", "uBbDY", "IaGES", "OHUYm", "nLYYy", "npKXE", "nkHKN", "nasQj", "cFjHP", "mspnc", "QvhIR", "wXanm", "NwZGK", "LvxUZ", "CISmp", "style", "rrceQ", "promise", "LjRwb", "hKXPl", "Unexpected result returned.", "requestSubmit", "fxbjC", "AjoMY", "CKkig", "FLqHy", "viewBox", "tOPNp", "getState", "plNbb", "KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2NvbnN0IGY9bmV3IFRleHRFbmNvZGVyO2Z1bmN0aW9uIHAoZSl7cmV0dXJuWy4uLm5ldyBVaW50OEFycmF5KGUpXS5tYXAodD0+dC50b1N0cmluZygxNikucGFkU3RhcnQoMiwiMCIpKS5qb2luKCIiKX1hc3luYyBmdW5jdGlvbiB3KGUsdCxyKXtyZXR1cm4gcChhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdChyLnRvVXBwZXJDYXNlKCksZi5lbmNvZGUoZSt0KSkpfWZ1bmN0aW9uIGIoZSx0LHI9IlNIQS0yNTYiLG49MWU2LHM9MCl7Y29uc3Qgbz1uZXcgQWJvcnRDb250cm9sbGVyLGE9RGF0ZS5ub3coKTtyZXR1cm57cHJvbWlzZTooYXN5bmMoKT0+e2ZvcihsZXQgYz1zO2M8PW47Yys9MSl7aWYoby5zaWduYWwuYWJvcnRlZClyZXR1cm4gbnVsbDtpZihhd2FpdCB3KHQsYyxyKT09PWUpcmV0dXJue251bWJlcjpjLHRvb2s6RGF0ZS5ub3coKS1hfX1yZXR1cm4gbnVsbH0pKCksY29udHJvbGxlcjpvfX1mdW5jdGlvbiBoKGUpe2NvbnN0IHQ9YXRvYihlKSxyPW5ldyBVaW50OEFycmF5KHQubGVuZ3RoKTtmb3IobGV0IG49MDtuPHQubGVuZ3RoO24rKylyW25dPXQuY2hhckNvZGVBdChuKTtyZXR1cm4gcn1mdW5jdGlvbiBnKGUsdD0xMil7Y29uc3Qgcj1uZXcgVWludDhBcnJheSh0KTtmb3IobGV0IG49MDtuPHQ7bisrKXJbbl09ZSUyNTYsZT1NYXRoLmZsb29yKGUvMjU2KTtyZXR1cm4gcn1hc3luYyBmdW5jdGlvbiBtKGUsdD0iIixyPTFlNixuPTApe2NvbnN0IHM9IkFFUy1HQ00iLG89bmV3IEFib3J0Q29udHJvbGxlcixhPURhdGUubm93KCksbD1hc3luYygpPT57Zm9yKGxldCB1PW47dTw9cjt1Kz0xKXtpZihvLnNpZ25hbC5hYm9ydGVkfHwhY3x8IXkpcmV0dXJuIG51bGw7dHJ5e2NvbnN0IGQ9YXdhaXQgY3J5cHRvLnN1YnRsZS5kZWNyeXB0KHtuYW1lOnMsaXY6Zyh1KX0sYyx5KTtpZihkKXJldHVybntjbGVhclRleHQ6bmV3IFRleHREZWNvZGVyKCkuZGVjb2RlKGQpLHRvb2s6RGF0ZS5ub3coKS1hfX1jYXRjaHt9fXJldHVybiBudWxsfTtsZXQgYz1udWxsLHk9bnVsbDt0cnl7eT1oKGUpO2NvbnN0IHU9YXdhaXQgY3J5cHRvLnN1YnRsZS5kaWdlc3QoIlNIQS0yNTYiLGYuZW5jb2RlKHQpKTtjPWF3YWl0IGNyeXB0by5zdWJ0bGUuaW1wb3J0S2V5KCJyYXciLHUscywhMSxbImRlY3J5cHQiXSl9Y2F0Y2h7cmV0dXJue3Byb21pc2U6UHJvbWlzZS5yZWplY3QoKSxjb250cm9sbGVyOm99fXJldHVybntwcm9taXNlOmwoKSxjb250cm9sbGVyOm99fWxldCBpO29ubWVzc2FnZT1hc3luYyBlPT57Y29uc3R7dHlwZTp0LHBheWxvYWQ6cixzdGFydDpuLG1heDpzfT1lLmRhdGE7bGV0IG89bnVsbDtpZih0PT09ImFib3J0IilpPT1udWxsfHxpLmFib3J0KCksaT12b2lkIDA7ZWxzZSBpZih0PT09IndvcmsiKXtpZigib2JmdXNjYXRlZCJpbiByKXtjb25zdHtrZXk6YSxvYmZ1c2NhdGVkOmx9PXJ8fHt9O289YXdhaXQgbShsLGEscyxuKX1lbHNle2NvbnN0e2FsZ29yaXRobTphLGNoYWxsZW5nZTpsLHNhbHQ6Y309cnx8e307bz1iKGwsYyxhLHMsbil9aT1vLmNvbnRyb2xsZXIsby5wcm9taXNlLnRoZW4oYT0+e3NlbGYucG9zdE1lc3NhZ2UoYSYmey4uLmEsd29ya2VyOiEwfSl9KX19fSkoKTsK", "delete", "uwCht", "SNJQg", "fFXxL", "RWiJw", "defaultPrevented", "oLWqA", "ODXBs", ".altcha.org", "IZhRr", "OWbCP", "1.0.6", "biYrA", "tyeym", "DcUZT", "eSvOs", "LPHnW", "wYCvB", "getElementById", "IarPo", "jMdZq", "resolve", "footer", "AnHvl", "took", 'input[type="email"]:not([data-no-spamfilter])', "OLUUJ", "maxnumber", "yvaFv", "hidelogo", "ppUfC", "QgTkL", "CDiCl", "SpBJi", "Verifying...", "cxhia", "bRxnw", "NFzGe", "NDZoq", "bnpaf", "louVQ", "POST", "disableRules", "feMpB", "dispatch", "vyBMP", "height", "rzDkl", "rxLlo", "ALTCHA", "M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z", "XUPGv", "OlKUc", "vthcg", "IEBqR", "test", "getPlugin", "xeKGe", "hkBpc", "hycPN", "floatinganchor", "TsCdx", "oAPeG", "NEknx", "mkgIG", "currentColor", "tjyou", "6097365JBuJQf", "QyVdK", "Ntals", "expired", "rpDlH", "invalid", "seMTv", "forEach", "xkrFY", "sWYLE", "lzXmP", "floating", "YQKqv", "CGSkx", "TyWyZ", "SjaCd", "ouJlC", "zwrLc", "shadowRoot", "BmnUj", "Wavpf", "string", "Fwxrb", "koOEg", "Hsitd", "UTSdi", "HoXUe", "function", "FUUQy", "PRmDN", "qPKXM", "DvEXr", "vBkKu", "sEDyQ", "name", "Fmwpu", "acxWA", "URL", "uhTNq", "dVYmF", "iMQBa", "EsCTF", "bFZBL", "KvLEm", "vHLiw", "reflect", "bSBoC", "Pidfl", "LKgqw", "now", "addEventListener", "createElement", "strings", "QUnEM", "xadtO", "RIaRC", "altcha-footer svelte-ddsc3z", "pNJEv", "tEQBc", "OjVxD", "yhREA", "auqju", "OMEZy", "BisDm", "lpxtL", "classification", "Verification expired. Try again.", "lPzvI", "mLuCj", "oIIFp", "altcha-anchor-arrow svelte-ddsc3z", "AmMeK", "resolvedOptions", "jhQYS", "RFzel", "ayLsx", "getConfiguration", "script-widget", "iRgOr", "headers", "uYXFr", "YlIZt", "GloJT", "VifvV", "detail", "BoRsZ", "qMaOl", "Jtswj", "qZDSu", "EfoGx", "HiLoy", "SkagF", "OfXAt", "jPavr", "iErha", "jkFsC", "min", "blockedCountries", "wvjcX", "iWDKe", "on_mount", "dDiNK", "display", "unable to find floating anchor element", "configure", "hATGi", "ARRXy", "toProp", "11zMawxo", "props", "ipYDf", "fIdXn", "RZbTw", "_checkbox", "pjlIt", "ZDYQJ", "dnzPH", "clarify", "IdpjL", "contains", "lNHIE", "top", "altcha-label svelte-ddsc3z", "VTWrv", "auto", "ZNhYH", "PkEoq", "VXALE", "DateTimeFormat", "UNVERIFIED", "ALVxP", "IAeIM", "aIase", "Verified", "uLbPW", "yPDxg", "XhlGe", "TsBAS", "sXVUJ", "GcIXw", "div", "bXfys", "DVJur", "NtYfY", "aceva", "SRSQg", "unable to configure from X-Altcha-Config", "using provided json data", "ISJxc", "sNYiB", "rfDnO", "psPzP", "qxBfC", "ETpuM", "dMcbr", "kUgCy", "find", "wCfdC", "vtrZB", "Attributes hidefooter and hidelogo ignored because usage with free API Keys requires attribution.", "KjDpK", "AAYtz", "XPSbK", "OEDZw", "http://www.w3.org/2000/svg", "signal", "rfhpB", "unshift", "pmrwj", "tLbZX", "Worker", "DkdNR", "generating test challenge", "nqmMw", "XVMmD", "IeNlO", "terminate", "Pwpsw", "qAynK", "GBlQs", "BAD", "clear", "keys", "gYRBh", "MVjpN", "wwcds", "iEVTg", "oACwl", "sPOkI", "HZFgn", "UBIzc", "Blob", "ZCtQg", "WYexw", "IvUpM", "voCfe", "QidFj", "vGXQx", "VcuDJ", "LUion", "ZhIXG", "kjdek", "revokeObjectURL", "altcha-main svelte-ddsc3z", "challengejson", "observedAttributes", "mxQFz", "cobxd", "WRetO", "ceil", "TaeWM", "vALlc", "payXT", "5HNRthS", "pXiOK", "destroy", "ebNZW", "CliRJ", "YyXCp", "yXSvw", "ROYdt", "HXnRL", "zWdtn", "kZyvV", "wvjwZ", "hTJoh", "TqYzg", "RMuev", "fdDwV", "NziEN", "NHbRd", "JNQKB", "xdCjb", "uBQKO", "using test mode", "obfuscation", "rcjBg", "CAfEe", "QLmpT", "bsGuL", "AmQnn", "ufDUU", "hgAEr", "insertBefore", "jFlsW", "importKey", "mpebe", "aezSN", "M2.33955 16.4279C5.88954 20.6586 12.1971 21.2105 16.4279 17.6604C18.4699 15.947 19.6548 13.5911 19.9352 11.1365L17.9886 10.4279C17.8738 12.5624 16.909 14.6459 15.1423 16.1284C11.7577 18.9684 6.71167 18.5269 3.87164 15.1423C1.03163 11.7577 1.4731 6.71166 4.8577 3.87164C8.24231 1.03162 13.2883 1.4731 16.1284 4.8577C16.9767 5.86872 17.5322 7.02798 17.804 8.2324L19.9522 9.01429C19.7622 7.07737 19.0059 5.17558 17.6604 3.57212C14.1104 -0.658624 7.80283 -1.21043 3.57212 2.33956C-0.658625 5.88958 -1.21046 12.1971 2.33955 16.4279Z", "nAIFR", "ulrJz", "KEyyk", "CzEdW", "PYBIs", "PBCZv", "pKVhh", "TIsuv", "ZvPoW", "YqTWW", "qaVjk", "$$p_d", "verifyurl", "YndCc", "$$scope", "qypAI", "verifying", "wvEQl", "push", "bjjSy", "Invalid challenge. Property algorithm is missing.", "AeAhK", "preventDefault", "SGSUh", "tcuHZ", "GMrxh", "ILqUz", "BuNTi", "fbEJJ", "apiKey=ckey_", "boolean", "OonDO", "qRTXd", "SVbcn", "Naedf", "aSkkC", "TKAEW", "toLowerCase", "ukykh", "ztyop", "WXCGp", "mDwzk", "DihCj", "jiHTp", "YlWsy", "AZHXu", "FRdsE", "TOffB", "Boolean", "3350436bHaHSK", "$$d", "gyrCs", "JMejX", "ENdsE", "bldVl", "EeVeS", "COfAZ", "Jhnij", "PzuxO", "utHRE", "ukTJg", "hcvIR", "indexOf", "hLlpk", "GLdZK", "QWWPp", "bjTII", "rhNVv", "TQqFu", "aLWsK", "eEAbL", "wAgtk", "ktVap", "NLRbo", "zWRjM", "jZayR", "EEeTs", "MlUYd", "ibgwG", "EmUbO", "KJsWZ", "SuKqP", "error", "SObqV", "$on", "focusin", "maBEm", "capture", "kuANw", "XjnPy", "data-floating", "object", "type", "skip_bound", "gXwoE", "kqhzw", "challengeurl", "context", "sfkgy", "tHsGH", "wmJYu", "for", "DQvgF", "DqewF", "change", "DzoJa", "Visit Altcha.org", "fPWQg", "YUSML", "VERIFIED", "MiXtm", "querySelector", "vzRsM", "yhyXa", "cMNxE", "JzQKe", "inHOl", "3|1|2|4|0", "attribute", "all", "SEZCh", "tNnxJ", "kITiu", "pTcYw", "WtFTb", "LhOlM", "floatingoffset", "pfBQT", "zPRHJ", "LmttA", "yvSgZ", "wvulm", "OdyXY", "EzuAs", "kyDwu", "VXcVA", "IooUe", "3604503fBZXnb", "JTpCD", "otRqO", "njMma", "wNzWl", "XFjXI", "XXFUt", "classList", "RKaff", "rqhCM", "bvANK", "hardwareConcurrency", "YBtVJ", "attachShadow", "label", "charCodeAt", "RMoQY", "XNDGS", "vFDxL", "ZdHSr", "expires", "Mocked error.", "OWDQb", "SHA-384", "39PmKXrK", "DFczE", "getFloatingAnchor", "TXlsv", "connectedCallback", "ehFeC", "GKHlQ", "jGdMR", "vVTCo", "OnPyT", "pluginName", "DJSdQ", "toString", "resize", "Akhpd", "dPWWV", "$$s", "input", "FoZpr", "after_update", "cVsrP", "HYHCs", "wLzWr", "xJpSX", "ckXHD", "xkbTV", "eVwAJ", "aSmQV", "LEYwD", '" target="_blank" aria-label="', "MpdwJ", "Ecewg", "debug", "svelte-ddsc3z", "uaQvS", "rgqOS", "onStateChange", "syJWK", "FBDvL", "Ywrmr", "DEoIZ", "constructor", "GLQwi", "create", "npYHp", "LSOkM", "includes", "ieDOC", "RCbpt", "hcBAq", "vIFBf", "AXetD", "VERIFYING", "wdZrs", "stopPropagation", "tjbAE", "vgLkH", "fGoxH", "none", "click", "webkitURL", "setState", "mzJFS", "ELdEs", "hMIbw", "rvXoh", "CsAbC", "rHwpK", "nbFwG", "YBesK", "dkPvB", "BnSUK", "aCbaJ", "HAswK", "gbueJ", "yTUpk", "MKOnJ", "NHhtv", "GkMSA", "QZBBU", "Cjcbr", "VSXHB", "sqBeN", "status", "lJywh", "KRffa", "solution", "RyhOt", "dMxhA", "kONBH", "round", "PznZu", "cDBzB", "IheZj", "drTLh", "IfWaD", "XIjZh", "mounted", "ctx", "sHILj", "href", "XjqWp", "has", "VTFdV", "splice", "xlNyE", "message", "split", "wtYxk", "load", "vjSNg", "pjDDT", "FVWxH", "kWjfZ", "nnhay", "SDkMY", "TtGvj", "nlhhJ", "wReca", "hisMZ", "ltArJ", "aborted", "rlCeZ", "stroke-linejoin", "CeMlL", "qTejr", "mnzHR", "xQKlE", "opacity", "7IuZCoF", "cnaPc", "random", "rrxmL", "WUbxL", "hTAWc", "WUuCQ", "gMuep", "head", "CebuH", "NMgNZ", "jbdoN", "EXCIK", "LvHCc", "zwlWh", "JEtKR", "bSXah", "EXPIRED", "gfftj", "max", "OLljL", "vMUbL", "Oekge", "uCcBg", "KsGmG", "dnviT", "block", "PxneK", "vDCfs", "path", "bHUQd", "RLAxM", "$$c", "fwKuC", "iNmjF", "AxQHr", "LfiKl", "parentNode", "delay", "JAmFB", "Kxxet", "urKrU", "aUqcd", "xuFng", "WHOMF", "vsEwl", "IHeHG", "MvKph", "QyIKx", "IBDnQ", "jloEk", "XmcdB", "kRert", "aSPlT", "NbSSt", "RMLqG", "gVXqp", "bhSmQ", "vQLWY", "LyuQz", "aria-label", "tTekq", "BwwLs", "svg", "TpOZL", "length", "UjHkw", "Attribute challengeurl not set.", "JMxKp", "xmlns", "hidefooter", "gfCEV", "mMYit", "SEPTC", "JQHTH", "TtmiD", "JuTMa", "disconnectedCallback", "laUGl", "5516376Wigmrq", "decode", "QnNtn", "map", "mybpH", "text", "RGqcW", "fragment", "oiJbN", "mpTNn", "cHOWM", "fetching challenge from", "getBoundingClientRect", "sheet"];
    v1 = function() {
        return e
    };
    return v1()
}

function k1(e, t) {
    const i = v1();
    return k1 = function(e, t) {
        e = e - (266 * -16 + 6 * 1659 + -118 * 46);
        let n = i[e];
        return n
    }, k1(e, t)
}

function A1(i) {
    const s = Oe,
          o = {
              DrOpW: function(e, t) {
                  return e === t
              },
              YZebk: function(e) {
                  return e()
              },
              zwrLc: function(e, t) {
                  return e(t)
              },
              JMejX: "div",
              wdZrs: function(e, t) {
                  return e(t)
              },
              AjoMY: function(e, t) {
                  return e(t)
              },
              xGsSd: s(1119),
              gyrCs: function(e) {
                  return e()
              },
              TbrNq: function(e) {
                  return e()
              },
              ltArJ: function(e, t, n, i) {
                  return e(t, n, i)
              },
              UbjfQ: s(1033),
              yXSvw: function(e, t, n, i) {
                  return e(t, n, i)
              },
              KSeCl: s(805),
              jZayR: function(e, t) {
                  return e !== t
              },
              BwwLs: s(331),
              aceva: "off",
              bFZBL: s(1408),
              ETpuM: s(1135),
              sbupl: function(e, t, n, i) {
                  return e(t, n, i)
              },
              rvXoh: "altcha-hidden",
              ZiTvh: s(814),
              FKgDF: function(e, t, n, i) {
                  return e(t, n, i)
              },
              RLAxM: s(895),
              MSVJl: function(e, t, n, i) {
                  return e(t, n, i)
              },
              BhVCX: s(1586),
              GsSOv: function(e, t, n, i) {
                  return e(t, n, i)
              },
              yPbwr: s(1031),
              XvybN: function(e, t, n, i) {
                  return e(t, n, i)
              },
              NHhtv: function(e, t, n) {
                  return e(t, n)
              },
              PHsCO: function(e, t, n) {
                  return e(t, n)
              },
              VifvV: function(e, t, n) {
                  return e(t, n)
              },
              LhOlM: function(e, t, n, i) {
                  return e(t, n, i)
              },
              SEPTC: s(1045),
              vsEwl: function(e, t, n, i) {
                  return e(t, n, i)
              },
              xTIgt: s(697),
              SkPwE: function(e, t, n, i, s, o, r) {
                  return e(t, n, i, s, o, r)
              },
              JOist: function(e, t) {
                  return e + t
              },
              KjDpK: function(e, t) {
                  return e & t
              },
              GekuB: function(e, t) {
                  return e !== t
              },
              pWMIN: function(e, t) {
                  return e(t)
              },
              JTpCD: function(e, t) {
                  return e(t)
              },
              WyHSA: function(e, t) {
                  return e & t
              },
              ESGmi: s(351),
              DlJBj: function(e, t, n) {
                  return e(t, n)
              },
              YiGKU: function(e, t) {
                  return e(t)
              },
              IeNlO: function(e, t, n, i, s) {
                  return e(t, n, i, s)
              },
              lnNDg: function(e, t) {
                  return e === t
              },
              FtCaV: function(e) {
                  return e()
              },
              fGoxH: function(e, t) {
                  return e !== t
              },
              etbWf: function(e, t) {
                  return e === t
              }
          };
    let r, a, l, c, d, u, f, h, p, m, g, y, x, w, b, v, k;
    const A = i[-9885 + -291 * 3 + 10804]["default"],
          I = o[s(867)](ef, A, i, i[3 * 241 + 2 * 1277 + -808 * 4], null);
    let S = o["lnNDg"](i[1 * -4697 + -3868 + 4 * 2143], c1[s(1154)]) && o[s(274)](u1);

    function E(e, t) {
        const n = s;
        return o[n(1541)](e[-2184 + -1 * 8871 + 11062 * 1], c1["VERIFIED"]) ? p1 : o["DrOpW"](e[3119 * 3 + -6327 + 3023 * -1], c1[n(1154)]) ? h1 : f1
    }
    let T = o[s(297)](E, i),
        C = o["YiGKU"](T, i),
        B = (o[s(1159)](i[-6450 * -1 + 7911 + 3 * -4786], !(-7492 + -5 * 1021 + -57 * -221)) || i[-27 * 141 + -5854 * 1 + -9673 * -1]) && m1(i),
        D = (i[3 * -499 + -3738 + 5240] || o[s(369)](i[-206 * 41 + -1108 + 3 * 3187], c1[s(1248)])) && o[s(617)](g1, i),
        P = i[-8377 * 1 + -4472 * -1 + 2 * 1958][s(647)] && (i[1 * -3199 + -7131 + 82 * 126] !== !(-9958 + 63 * -121 + 1 * 17581) || i[-2 * 1013 + 391 * 20 + -5782]) && w1(i),
        R = i[-4 * 1266 + -3 * -1737 + -146] && b1(i);
    return {
        c() {
            const e = s;
            I && I["c"](), r = o[e(1397)](mf), a = o["zwrLc"](ff, o["JMejX"]), l = o[e(1155)](ff, o[e(993)]), S && S["c"](), c = o["YZebk"](mf), d = o[e(617)](ff, o["JMejX"]), u = ff(o[e(1326)]), p = o[e(992)](mf), m = o[e(709)](ff, o[e(993)]), C["c"](), g = mf(), B && B["c"](), y = mf(), D && D["c"](), x = o[e(992)](mf), P && P["c"](), w = o[e(584)](mf), R && R["c"](), o[e(1222)](M, u, o[e(304)], e(1461)), o[e(911)](M, u, "id", f = i[-2292 + 2859 * 3 + 6281 * -1] + o["KSeCl"]), u["required"] = h = o[e(1016)](i[-2709 + -1211 + 3920], o[e(1293)]) && (!i[-150 + 136 * -71 + 3269 * 3] || o["jZayR"](i[362 * 3 + -5 * 1188 + 4854], o["aceva"])), o[e(911)](M, u, o[e(734)], o[e(845)]), M(d, o[e(734)], "altcha-checkbox svelte-ddsc3z"), o["sbupl"](xf, d, o[e(1167)], i[4 * 1802 + -27 * 334 + 1817] === c1["VERIFYING"]), M(m, e(1408), o["ZiTvh"]), o["FKgDF"](M, l, o[e(734)], o[e(1262)]), o[e(1543)](M, a, o[e(734)], o["BhVCX"]), M(a, e(351), i[-937 * -8 + 8210 + -15699 * 1]), o[e(1499)](M, a, o[e(1441)], i[7975 + 7185 + 3 * -5053])
        },
        m(e, t) {
            const n = s;
            I && I["m"](e, t), o[n(911)](df, e, r, t), o[n(1534)](df, e, a, t), o[n(1179)](rf, a, l), S && S["m"](l, null), o[n(1179)](rf, l, c), rf(l, d), o[n(1179)](rf, d, u), u[n(1531)] = i[-8856 + -82 * 29 + 11242], o[n(1179)](rf, l, p), rf(l, m), C["m"](m, null), rf(l, g), B && B["m"](l, null), o[n(1179)](rf, a, y), D && D["m"](a, null), o["PHsCO"](rf, a, x), P && P["m"](a, null), o[n(775)](rf, a, w), R && R["m"](a, null), i[-1 * -3469 + 5344 + -8764](a), b = !(7689 + -4725 + -2964), v || (k = [o[n(1066)](gf, u, o["SEPTC"], i[8703 + 4526 + -13182]), o["LhOlM"](gf, u, o[n(1304)], i[-6044 * 1 + -2143 * 2 + 10343]), o[n(1276)](gf, u, o[n(463)], i[10 * 725 + 596 * -2 + -6044])], v = !(-5 * -1124 + -4832 + -788))
        },
        p(e, t) {
            const n = s;
            I && I["p"] && (!b || t[7057 * -1 + -7351 * 1 + 14409] & -3 * 4181 + 3 * -1209 + 32554) && o[n(551)](sf, I, A, e, e[-487 * 3 + 37 * 179 + -43 * 119], b ? nf(A, e[2083 + -611 + -1 * 1427], t, null) : of(e[2 * 971 + 6615 + -112 * 76]), null), e[1 * -7087 + 5 * 515 + -1 * -4519] === c1[n(1154)] ? S || (S = o[n(584)](u1), S["c"](), S["m"](l, c)) : S && (S["d"](-4117 + 5491 + -1373 * 1), S = null), (!b || t[-2841 + -919 * 3 + -18 * -311] & -4 * 2467 + 6816 + -767 * -4 && o[n(1016)](f, f = o[n(1387)](e[3964 + 3017 * 1 + -1 * 6977], o[n(497)]))) && o["MSVJl"](M, u, "id", f), (!b || o[n(852)](t[6696 + 1361 * -1 + -5335], 9793 + -2449 + 2447 * -3) && h !== (h = e[8139 * -1 + -9236 + 17375] !== o[n(1293)] && (!e[9813 + 2099 * -4 + -1 * 1416] || o[n(427)](e[-1 * 8291 + 3947 + -3 * -1448], o[n(836)])))) && (u["required"] = h), t[2 * 1154 + 9223 + -11531 * 1] & 5091 + -4148 + -687 * 1 && (u[n(1531)] = e[766 + 2631 * -1 + 1873]), (!b || t[-8885 + -3345 + 12230] & 1678 + -3486 * 1 + -8 * -242) && o["MSVJl"](xf, d, o[n(1167)], o[n(1541)](e[-5668 + 7521 + -1846], c1[n(1154)])), T === (T = o[n(709)](E, e)) && C ? C["p"](e, t) : (C["d"](-3 * -2539 + -5 * -1699 + -16111), C = o[n(409)](T, e), C && (C["c"](), C["m"](m, null))), o[n(1016)](e[3082 + -2 * 2564 + 2049], !(-3889 + -2338 * -3 + 1 * -3125)) || e[-6 * -1358 + -4303 * -2 + -16742] ? B ? B["p"](e, t) : (B = m1(e), B["c"](), B["m"](l, null)) : B && (B["d"](5 * 1714 + -7928 + -641), B = null), e[7528 * -1 + -3 * 2827 + 16014] || e[658 + 11 * 439 + -1370 * 4] === c1[n(1248)] ? D ? D["p"](e, t) : (D = g1(e), D["c"](), D["m"](a, x)) : D && (D["d"](-4051 + 1 * -8076 + 1516 * 8), D = null), e[4597 + 5590 + 106 * -96]["footer"] && (o[n(427)](e[-4 * -1471 + 421 + -33 * 191], !(-1478 + -478 * 5 + 3868)) || e[-1119 + -2289 * 3 + -1333 * -6]) ? P ? P["p"](e, t) : (P = o[n(1079)](w1, e), P["c"](), P["m"](a, w)) : P && (P["d"](7036 + 1 * 4071 + 1234 * -9), P = null), e[-2144 + -6219 + -82 * -102] ? R ? R["p"](e, t) : (R = o[n(1079)](b1, e), R["c"](), R["m"](a, null)) : R && (R["d"](-5643 + 9137 + -3493), R = null), (!b || o["WyHSA"](t[6600 + -900 * 4 + -3e3], -8017 * -1 + 9424 + 87 * -199)) && o[n(1543)](M, a, o[n(333)], e[1 * 2036 + 6163 * 1 + -8192]), (!b || t[-2461 * -1 + 3097 * -3 + 6830] & 2483 + -6977 + 16 * 281) && M(a, o[n(1441)], e[1 * -7981 + -1398 * -3 + -947 * -4])
        },
        i(e) {
            b || (Wf(I, e), b = !(3 * -1452 + 16 * 99 + 2772))
        },
        o(e) {
            o["DlJBj"](Qf, I, e), b = !(681 * 9 + 1 * -9447 + 3319)
        },
        d(e) {
            const t = s;
            e && (o["YiGKU"](uf, r), o[t(409)](uf, a)), I && I["d"](e), S && S["d"](), C["d"](), B && B["d"](), D && D["d"](), P && P["d"](), R && R["d"](), i[3171 + 109 * 15 + 4757 * -1](null), v = !(4794 + 8387 + 2636 * -5), Ju(k)
        }
    }
}
const I1 = Oe(1047),
      S1 = Oe(469);

function E1(e) {
    const t = Oe;
    return JSON[t(520)](e)
}

function T1(n, e, w) {
    const b = Oe,
          v = {
              JQHTH: "submit",
              eDbmf: b(415),
              TvgiD: b(1026),
              xsAoi: function(e, t) {
                  return e(t)
              },
              wqYrJ: b(1211),
              XOMWw: function(e, t) {
                  return e !== t
              },
              AnHvl: b(500),
              fLuak: function(e, t, n) {
                  return e(t, n)
              },
              AAYtz: b(1199),
              eXDRu: function(e, t, n) {
                  return e(t, n)
              },
              vQLWY: b(393),
              vGXQx: function(e) {
                  return e()
              },
              louVQ: "plugins",
              JgWfF: "none",
              EeVeS: function(e, t) {
                  return e(t)
              },
              IdpjL: function(e, t, n) {
                  return e(t, n)
              },
              LKgqw: b(816),
              NxrfB: function(e, t) {
                  return e(t)
              },
              voCfe: function(e, t) {
                  return e === t
              },
              ipYDf: b(1378),
              wgrlC: function(e, t) {
                  return e(t)
              },
              EBmde: b(851),
              LyuQz: function(e, t) {
                  return e(t)
              },
              lqjAA: function(e, t) {
                  return e !== t
              },
              EsCTF: b(275),
              wReca: function(e, t) {
                  return e / t
              },
              lMFio: function(e, t) {
                  return e !== t
              },
              cVsrP: "pLdMM",
              ouJlC: b(285),
              LecxN: function(e, t) {
                  return e && t
              },
              RTumo: function(e, t) {
                  return e === t
              },
              NtYfY: function(e) {
                  return e()
              },
              kjdek: function(e, t) {
                  return e == t
              },
              EQDrB: b(719),
              uemgU: function(e, t) {
                  return e !== t
              },
              oAPeG: function(e, t, n) {
                  return e(t, n)
              },
              BSGBL: function(e, t) {
                  return e === t
              },
              hcyJD: function(e, t, n) {
                  return e(t, n)
              },
              LUion: b(1345),
              fvZPT: b(1099),
              StYga: function(e, t) {
                  return e(t)
              },
              rkilW: b(839),
              VSXHB: b(864),
              zPYgx: function(e, t) {
                  return e(t)
              },
              wKgNP: function(e, t) {
                  return e != t
              },
              FmHtO: b(971),
              WIDYS: b(605),
              TIsuv: function(e, t) {
                  return e && t
              },
              ucjLt: b(956),
              TVjOq: b(535),
              hTJoh: function(e, t) {
                  return e + t
              },
              aQTOj: b(1544),
              atJeI: b(1298),
              rpDlH: b(1321),
              zBLGZ: function(e, t) {
                  return e !== t
              },
              KnEok: b(1523),
              WHOMF: b(1098),
              nasQj: b(1476),
              kuANw: "JuSfl",
              pmrwj: function(e, t) {
                  return e - t
              },
              msWGu: function(e, t) {
                  return e > t
              },
              JuTMa: function(e, t) {
                  return e(t)
              },
              icruo: b(1032),
              vDCfs: b(1351),
              mkgIG: "unable to configure from X-Altcha-Config",
              GcIXw: function(e, t) {
                  return e - t
              },
              tiogZ: function(e, t) {
                  return e(t)
              },
              QexTk: function(e, t) {
                  return e == t
              },
              iRgOr: b(713),
              OmnUU: b(650),
              fIdXn: function(e, t) {
                  return e(t)
              },
              bHUQd: function(e, t) {
                  return e === t
              },
              FoZpr: b(947),
              DqewF: function(e, t) {
                  return e && t
              },
              SrlXx: b(311),
              jpPuP: function(e, t) {
                  return e === t
              },
              LYEln: b(298),
              bOQOd: function(e, t) {
                  return e == t
              },
              tjOQN: function(e, t) {
                  return e != t
              },
              batKB: b(1522),
              cRkNg: function(e, t) {
                  return e || t
              },
              vyBMP: b(1216),
              QyVdK: function(e, t) {
                  return e instanceof t
              },
              YWNnx: b(1023),
              Fuqwe: function(e, t) {
                  return e == t
              },
              BmnUj: function(e, t, n) {
                  return e(t, n)
              },
              KjrTx: function(e, t) {
                  return e === t
              },
              TKAEW: function(e, t) {
                  return e === t
              },
              lzXmP: function(e, t, n, i) {
                  return e(t, n, i)
              },
              JodZM: function(e, t) {
                  return e !== t
              },
              DzoJa: function(e, t) {
                  return e && t
              },
              etEZH: function(e, t) {
                  return e === t
              },
              dkPvB: b(286),
              UEfHT: function(e, t) {
                  return e === t
              },
              nmOtQ: function(e, t, n, i) {
                  return e(t, n, i)
              },
              YBesK: function(e, t) {
                  return e !== t
              },
              VNUKR: "FkynM",
              ZVGhd: b(408),
              nFoiL: function(e, t) {
                  return e == t
              },
              PPDMS: function(e, t) {
                  return e === t
              },
              wtYxk: "NIjXg",
              DFczE: b(1336),
              npKXE: function(e) {
                  return e()
              },
              DVJur: b(929),
              csuhG: function(e, t) {
                  return e == t
              },
              arsOR: "onsubmit",
              gmWqt: function(e, t) {
                  return e === t
              },
              gvcYW: function(e) {
                  return e()
              },
              pAQbj: function(e, t) {
                  return e !== t
              },
              RMLqG: function(e, t) {
                  return e === t
              },
              ZFStm: function(e, t) {
                  return e && t
              },
              QBDAO: function(e, t) {
                  return e === t
              },
              GXKCG: function(e, t, n, i) {
                  return e(t, n, i)
              },
              ROYdt: function(e, t) {
                  return e === t
              },
              ObAbf: function(e) {
                  return e()
              },
              ayVRl: function(e, t) {
                  return e !== t
              },
              RrShO: "NnvpN",
              jPavr: function(e, t) {
                  return e !== t
              },
              dMxhA: function(e, t) {
                  return e(t)
              },
              vHrzl: function(e, t, n) {
                  return e(t, n)
              },
              DDouh: function(e, t) {
                  return e === t
              },
              bRxnw: b(1238),
              XayQe: b(930),
              qRTXd: b(1607),
              fiLhb: function(e, t, n) {
                  return e(t, n)
              },
              Miueg: function(e, t) {
                  return e === t
              },
              hZfwA: function(e, t) {
                  return e > t
              },
              flNnF: function(e, t) {
                  return e + t
              },
              TqYzg: function(e, t) {
                  return e + t
              },
              RSGBm: function(e, t) {
                  return e === t
              },
              xdCjb: b(813),
              jbdoN: function(e, t) {
                  return e - t
              },
              LkXDJ: function(e, t) {
                  return e - t
              },
              LPPNP: function(e, t) {
                  return e + t
              },
              lxNJQ: function(e, t) {
                  return e - t
              },
              ELPPJ: function(e, t, n, i) {
                  return e(t, n, i)
              },
              jHDtP: function(e, t) {
                  return e + t
              },
              Jhnij: function(e, t, n, i) {
                  return e(t, n, i)
              },
              uwCht: "bottom",
              OWDQb: function(e, t) {
                  return e + t
              },
              SNJQg: function(e, t) {
                  return e / t
              },
              GGSBL: function(e, t) {
                  return e(t)
              },
              ABJfs: function(e, t, n, i) {
                  return e(t, n, i)
              },
              uPJpA: b(1408),
              Naedf: function(e, t) {
                  return e !== t
              },
              utHRE: "Attribute verifyurl not set.",
              JMxKp: "vSDak",
              xuyJp: b(1007),
              ukTJg: function(e, t) {
                  return e === t
              },
              wuYqN: function(e, t, n) {
                  return e(t, n)
              },
              nDJkG: b(1438),
              IaGES: b(666),
              WVpOm: function(e, t, n) {
                  return e(t, n)
              },
              jNvJf: b(1486),
              RKaff: b(872),
              hDmcx: function(e, t, n) {
                  return e(t, n)
              },
              NziEN: function(e, t) {
                  return e(t)
              },
              wvjwZ: function(e, t) {
                  return e < t
              },
              IvUpM: function(e) {
                  return e()
              },
              susTx: function(e, t, n) {
                  return e(t, n)
              },
              iEVTg: b(703),
              koOEg: function(e, t) {
                  return e !== t
              },
              hzlBp: function(e, t, n, i) {
                  return e(t, n, i)
              },
              ZkUeS: function(e, t, n, i) {
                  return e(t, n, i)
              },
              AprAP: function(e, t, n) {
                  return e(t, n)
              },
              tTekq: function(e, t) {
                  return e === t
              },
              TOffB: function(e, t) {
                  return e === t
              },
              MZZWO: b(373),
              PmwHG: b(1161),
              wHSIe: function(e, t) {
                  return e === t
              },
              DixiV: function(e, t, n) {
                  return e(t, n)
              },
              Jtswj: b(1058),
              lkypW: "Salt is too short. Min. 10 chars.",
              AmnWo: function(e, t) {
                  return e === t
              },
              jtwXb: "Invalid challenge. Property signature is missing.",
              lqdbC: b(961),
              MUUsD: function(e, t) {
                  return e < t
              },
              BvFtq: b(1294),
              IXHHh: b(1491),
              XIjZh: function(e, t, n, i) {
                  return e(t, n, i)
              },
              HzBMl: b(1230),
              GBlQs: ".25",
              kONBH: b(675),
              oiJbN: "currentColor",
              BnSUK: "altcha-spinner svelte-ddsc3z",
              cdxAn: function(e, t, n, i) {
                  return e(t, n, i)
              },
              Oekge: b(671),
              ZyTCQ: "0 0 24 24",
              hvtzC: b(1300),
              KsRCQ: b(856),
              iRUXL: function(e, t) {
                  return e === t
              },
              JcrpE: b(1012),
              KSSoC: function(e, t, n) {
                  return e(t, n)
              },
              vHLiw: function(e, t) {
                  return e !== t
              },
              AAbMg: b(1399),
              cEpdb: function(e, t) {
                  return e in t
              },
              kGfnr: function(e, t, n, i) {
                  return e(t, n, i)
              },
              ZvPoW: function(e, t, n, i, s) {
                  return e(t, n, i, s)
              },
              OnPyT: "abort",
              NGzCA: function(e, t) {
                  return e(t)
              },
              YUfmb: function(e, t) {
                  return e !== t
              },
              FVWxH: b(1021),
              ojDtq: b(984),
              NcrWg: "work",
              VpuAD: b(1141),
              rgqOS: function(e, t) {
                  return e * t
              },
              QqcVp: b(404),
              MJzhN: b(809),
              IXwXJ: function(e, t) {
                  return e === t
              },
              HsDEe: b(714),
              kRert: function(e, t, n) {
                  return e(t, n)
              },
              pXiOK: b(453),
              rtrkS: function(e, t) {
                  return e == t
              },
              sMrxD: function(e, t) {
                  return e === t
              },
              ENdsE: b(1392),
              ZaMKA: function(e, t, n) {
                  return e(t, n)
              },
              ZSyfl: function(e, t, n) {
                  return e(t, n)
              },
              wwcds: function(e, t, n) {
                  return e(t, n)
              },
              WXCGp: function(e, t, n) {
                  return e(t, n)
              },
              inHOl: function(e, t) {
                  return e !== t
              },
              txzCk: function(e, t) {
                  return e(t)
              },
              SkziS: function(e, t) {
                  return e !== t
              },
              eVLkn: function(e, t) {
                  return e !== t
              },
              ISJxc: function(e, t, n) {
                  return e(t, n)
              },
              wToUl: function(e, t, n) {
                  return e(t, n)
              },
              wLPDa: function(e, t, n) {
                  return e(t, n)
              },
              hsENE: function(e, t) {
                  return e == t
              },
              UJcxz: function(e, t) {
                  return e !== t
              },
              ZdHSr: function(e, t, n) {
                  return e(t, n)
              },
              rHwpK: function(e, t, n) {
                  return e(t, n)
              },
              CISmp: b(651),
              mXcRc: b(1423),
              kfmbH: function(e, t) {
                  return e(t)
              },
              pReuG: function(e, t, n) {
                  return e(t, n)
              },
              RMoQY: function(e, t, n) {
                  return e(t, n)
              },
              MlUYd: function(e, t) {
                  return e == t
              },
              rfhpB: function(e, t) {
                  return e !== t
              },
              ZXreC: function(e, t) {
                  return e !== t
              },
              kZyvV: b(349),
              ehFeC: b(847),
              YNTxG: function(e, t) {
                  return e(t)
              },
              QnNtn: function(e, t, n) {
                  return e(t, n)
              },
              WiKOf: function(e, t) {
                  return e === t
              },
              aEKZN: b(579),
              Fmwpu: b(663),
              kKMoA: function(e, t, n) {
                  return e(t, n)
              },
              tTkvi: function(e, t, n) {
                  return e(t, n)
              },
              WmITY: function(e, t) {
                  return e === t
              },
              tNnxJ: function(e, t) {
                  return e(t)
              },
              eRuag: function(e, t, n) {
                  return e(t, n)
              },
              gbueJ: function(e, t, n) {
                  return e(t, n)
              },
              wWrKC: function(e, t) {
                  return e(t)
              },
              GLdZK: b(832),
              SAnuT: b(946),
              DMyzz: function(e, t, n) {
                  return e(t, n)
              },
              Pidfl: b(341),
              PiOOe: function(e, t) {
                  return e === t
              },
              CKkig: function(e, t, n) {
                  return e(t, n)
              },
              ZPDwP: b(1559),
              BisDm: function(e, t) {
                  return e === t
              },
              hMIbw: b(504),
              lZvlm: function(e, t, n) {
                  return e(t, n)
              },
              DkdNR: function(e, t) {
                  return e / t
              },
              niWva: function(e, t) {
                  return e - t
              },
              aCdhc: function(e, t, n, i) {
                  return e(t, n, i)
              },
              EstVb: b(567),
              NiuFq: b(859),
              ebNZW: b(959),
              mpTNn: function(e, t) {
                  return e === t
              },
              wEjUZ: b(570),
              tswHP: b(885),
              RxnOn: b(1485),
              DjcnP: function(e, t) {
                  return e !== t
              },
              iNlUE: b(1361),
              HKfHj: function(e, t) {
                  return e in t
              },
              AxUAA: b(1330),
              kXGtE: function(e, t, n) {
                  return e(t, n)
              },
              HoXUe: function(e, t) {
                  return e in t
              },
              oACwl: function(e, t) {
                  return e in t
              },
              fBNwB: b(1134),
              SpBJi: "delay",
              ntNbJ: function(e, t, n) {
                  return e(t, n)
              },
              gCgjO: function(e, t, n) {
                  return e(t, n)
              },
              wgdYx: b(685),
              icBuy: b(1301),
              MbBKr: function(e, t) {
                  return e in t
              },
              SWRgD: "hidelogo",
              hATGi: function(e, t, n) {
                  return e(t, n)
              },
              VTFdV: function(e, t) {
                  return e in t
              },
              ggNqv: b(726),
              lJywh: function(e, t, n) {
                  return e(t, n)
              },
              TXlsv: function(e, t) {
                  return e in t
              },
              YlGNl: "maxnumber",
              tcuHZ: b(1594),
              BuNTi: function(e, t) {
                  return e in t
              },
              oLWqA: function(e, t) {
                  return e in t
              },
              Cxvtl: b(305),
              sgnTP: b(1437),
              eVwAJ: function(e, t, n) {
                  return e(t, n)
              },
              bjjSy: b(744),
              JEtKR: b(680),
              SDkMY: function(e, t) {
                  return e in t
              },
              iNmjF: function(e, t) {
                  return e in t
              },
              eSucG: function(e, t) {
                  return e in t
              },
              uYXFr: b(436),
              gefsA: function(e, t, n) {
                  return e(t, n)
              },
              OYrBk: function(e, t) {
                  return e in t
              },
              drTLh: "$$scope",
              hFvBr: function(e, t) {
                  return e & t
              },
              tUJMA: b(633),
              FUUQy: function(e, t) {
                  return e & t
              },
              ZEsuX: function(e, t) {
                  return e(t)
              },
              duxLh: function(e, t, n) {
                  return e(t, n)
              },
              Jjerq: b(825),
              lPzvI: "Verifying... please wait.",
              aZRpi: "statechange",
              pYIfh: b(580),
              sXVUJ: "SHA-256",
              DvmDG: "SHA-512",
              psPzP: function(e, t) {
                  return e == t
              },
              BoRsZ: function(e, t) {
                  return e(t)
              }
          };
    var t, F;
    let _, V, i, o, {
        $$slots: U = {},
        $$scope: j
    } = e,
        {
            auto: s = void(-7710 + -601 * 1 + 8311)
        } = e,
        {
            blockspam: y = void(826 + -3951 + -25 * -125)
        } = e,
        {
            challengeurl: k = void(-38 * 188 + 4975 + 2169)
        } = e,
        {
            challengejson: H = void(-5335 + -2173 + -1877 * -4)
        } = e,
        {
            debug: r = !(55 * -75 + -707 * 5 + 7661)
        } = e,
        {
            delay: a = -29 * 313 + 3177 * -1 + -1114 * -11
        } = e,
        {
            expire: A = void(-5819 * 1 + 4617 + 601 * 2)
        } = e,
        {
            floating: d = void(1739 + 4354 + -6093 * 1)
        } = e,
        {
            floatinganchor: u = void(1 * -3404 + -122 + 3526)
        } = e,
        {
            floatingoffset: f = void(2547 + -5560 + 3013 * 1)
        } = e,
        {
            hidefooter: l = !(-10 * 415 + -6268 + 10419)
        } = e,
        {
            hidelogo: c = !(8781 + -1 * -6857 + 15637 * -1)
        } = e,
        {
            name: h = v["pYIfh"]
        } = e,
        {
            maxnumber: p = -1016675 + 1343024 + 673651
        } = e,
        {
            mockerror: W = !(-3170 + 1206 * -4 + 39 * 205)
        } = e,
        {
            obfuscated: m = void(2645 + 499 + -3144)
        } = e,
        {
            plugins: Q = void(6963 + -5512 + -1451)
        } = e,
        {
            refetchonexpire: Y = !(79 * -15 + 9312 + 7 * -1161)
        } = e,
        {
            spamfilter: I = !(-1935 + -6264 + 8 * 1025)
        } = e,
        {
            strings: z = void(-2831 + 174 * -15 + 5441)
        } = e,
        {
            test: S = !(-4943 + -2363 + 7307)
        } = e,
        {
            verifyurl: x = void(6545 + 7670 + 1 * -14215)
        } = e,
        {
            workers: g = Math[b(788)](-3347 * 1 + -6538 + 9901 * 1, navigator[b(1089)] || 1 * -3517 + -869 * -5 + -820)
        } = e,
        {
            workerurl: G = void(1581 * 3 + 6189 + -5466 * 2)
        } = e;
    const K = Ef(),
          X = [v[b(830)], b(1101), v[b(1591)]],
          J = v[b(843)](F = v["hsENE"](t = document["documentElement"]["lang"], null) ? void(9488 + -538 * -14 + 10 * -1702) : t["split"]("-"), null) ? void(1627 + -3 * -1194 + 1 * -5209) : F[-3702 + -295 + 3997];
    let E = !(-6161 + -6437 + 12599),
        T, C = null,
        B = null,
        D = null,
        q = null,
        P = null,
        R = null,
        M = [],
        N = c1[b(821)];
    v[b(777)](Sf, () => {
        const e = b;
        Z(), D && (D["removeEventListener"](v[e(1305)], ue), D[e(1352)](v[e(1452)], fe), D[e(1352)](v[e(429)], de), D = null), P && (v[e(316)](clearTimeout, P), P = null), document[e(1352)]("click", ae), document[e(1352)](e(373), le), window[e(1352)](e(1115), me)
    }), If(() => {
        const t = b;
        if (v[t(330)](v[t(648)], v["AnHvl"])) return _0x1821cf[t(820)]()[t(764)]()[t(1618)];
        else {
            const e = {};
            e[t(1028)] = !(2 * -81 + -5352 + -919 * -6), v[t(276)](O, v[t(853)], t(636)), v[t(1390)](O, v[t(1289)], g), v[t(889)](oe), v[t(276)](O, v[t(665)], M[t(1296)] ? M[t(1313)](e => e[t(1143)][t(1112)])[t(486)](", ") : v[t(569)]), S && v[t(316)](O, t(926)), A && v[t(996)](xe, A), v[t(330)](s, void(3648 + -9459 + 5811)) && v[t(810)](O, v[t(740)], s), v[t(330)](d, void(-6389 * 1 + -2081 + 1 * 8470)) && v[t(1601)](we, d), D = T["closest"](t(370)), D && (D[t(742)](v[t(1305)], ue, e), D[t(742)](v[t(1452)], fe), s === t(1389) && D["addEventListener"](v[t(429)], de)), v[t(887)](s, v[t(802)]) && (m ? Ae() : v[t(889)](L)), _ && (l || c) && v[t(347)](O, v["EBmde"]), v[t(1290)](requestAnimationFrame, () => {
                K(v["wqYrJ"])
            })
        }
    });

    function $(e, t) {
        const n = b,
              i = {};
        return i[n(1350)] = e[n(1350)], i["challenge"] = e[n(538)], i["number"] = t[n(273)], i[n(483)] = e[n(483)], i[n(410)] = e[n(410)], i["test"] = S ? !(4 * 305 + -18 * 410 + 35 * 176) : void(-9182 + -1611 * -3 + -4349 * -1), i[n(649)] = t[n(649)], btoa(JSON["stringify"](i))
    }

    function Z() {
        const e = b;
        if (v[e(1540)](v[e(733)], v[e(733)])) return this["$$"][e(1200)][3029 + 8 * 509 + 65 * -109];
        else {
            for (const t of M) t[e(907)]()
        }
    }

    function ee() {
        const t = b,
              n = {
                  SkagF: function(e, t) {
                      const n = k1;
                      return v[n(1220)](e, t)
                  },
                  bAQVL: function(e, t) {
                      return e < t
                  }
              };
        if (v[t(581)](v[t(1122)], v[t(708)])) v["LecxN"](k, Y) && v[t(533)](N, c1[t(1050)]) ? L() : Be(c1[t(1248)], o[t(695)]);
        else {
            const i = [],
                  s = n[t(783)](_0x1822a7[t(1200)][t(1296)], -8599 + 17 * -289 + 1 * 13544);
            for (let e = -3948 + -2741 + 6689; n[t(573)](e, s); e++) i[e] = -(2945 + -4564 * 2 + -2 * -3092);
            return i
        }
    }
    async function te() {
        const s = b,
              t = {
                  uHKtj: function(e) {
                      const t = k1;
                      return v[t(835)](e)
                  },
                  sGqax: function(e, t) {
                      const n = k1;
                      return v[n(893)](e, t)
                  },
                  xXCkP: v[s(433)],
                  oQMxM: function(e, t) {
                      const n = s;
                      return v[n(1453)](e, t)
                  },
                  RCbpt: function(e, t) {
                      return e(t)
                  },
                  rqhCM: function(e, t, n) {
                      const i = s;
                      return v[i(687)](e, t, n)
                  },
                  wCfdC: function(e, t) {
                      return v["BSGBL"](e, t)
                  },
                  vunhD: function(e, t, n) {
                      return v["hcyJD"](e, t, n)
                  }
              };
        var e;
        if (W) throw v[s(1290)](O, v[s(891)]), new Error(v[s(1404)]);
        if (V) return v["StYga"](O, v["rkilW"]), V;
        if (S) return v["oAPeG"](O, v[s(1183)], {
            test: S
        }), v[s(437)](n1, v["wKgNP"](typeof S, v[s(1605)]) ? +S : void(5872 + 4996 * -2 + 1030 * 4));
        {
            if (v["lqjAA"](v[s(387)], v["WIDYS"])) {
                for (const i of _0x57fc36) t[s(386)](typeof i[s(1138)], t[s(434)]) && i[s(1138)](_0x27d57e);
                _0x5ee530 && t["oQMxM"](_0x2ea66, _0x11bccd[s(821)]) && t[s(1150)](_0x53a5db, () => {
                    const e = s;
                    t[e(1504)](_0x3afeb3)
                }), t[s(1087)](_0x2136db, 2 * 1811 + 8004 + -157 * 74, _0x40083b = t[s(849)](_0x4bbe03, _0x1241a6[s(1050)]))
            } else {
                if (v[s(948)](!k, D)) {
                    if (v[s(363)] === v[s(363)]) {
                        const h = D[s(1526)](v["TVjOq"]);
                        v[s(499)](h, null) && h[s(1148)]("/form/") && v["hcyJD"](w, 347 * 18 + -5 * -719 + -9826, k = v[s(917)](h, v[s(1616)]))
                    } else return this["$$"][s(1200)][-7209 + -11 * 188 + 16 * 582]
                }
                if (!k) throw new Error(v["atJeI"]);
                v[s(687)](O, v[s(696)], k);
                const o = {};
                o[s(1620)] = "1";
                const r = {};
                r[s(771)] = I ? o : {};
                const a = await fetch(k, r);
                if (v[s(1414)](a[s(1185)], -7700 + 69 * -41 + 10729 * 1)) throw new Error("Server responded with " + a["status"] + ".");
                const l = a[s(771)][s(1506)]("Expires"),
                      c = a[s(771)][s(1506)](v[s(1455)]),
                      d = await a["json"](),
                      u = new URLSearchParams(v[s(893)](e = d[s(483)]["split"]("?"), null) ? void(-2 * -3569 + 358 * -5 + -2 * 2674) : e[-4626 + 8146 + 1 * -3519]),
                      f = u[s(1506)](v[s(1275)]) || u[s(1506)](v[s(601)]);
                if (f) {
                    if (v[s(1029)] !== s(412)) return this["$$"][s(1200)][3908 + 1361 + -5226];
                    else {
                        const p = new Date(+f * (-23 * -373 + -4032 + -3547 * 1)),
                              m = v[s(1290)](isNaN, p["getTime"]()) ? -3093 + -2011 * -2 + -929 : v[s(860)](p[s(568)](), Date["now"]());
                        v[s(1324)](m, -9 * -1051 + 7136 + -16595) && v[s(1307)](xe, m)
                    }
                }
                if (c) try {
                    const g = JSON[s(520)](c);
                    g && v["kjdek"](typeof g, v[s(578)]) && (g[s(953)] && (g["verifyurl"] = new URL(g[s(953)], new URL(k))["toString"]()), v[s(437)](Ie, g))
                } catch (n) {
                    v[s(533)](v[s(1259)], v[s(1259)]) ? v["eXDRu"](O, v[s(689)], n) : (_0x11113e(_0x53c3c4, _0x1c0642, _0x517e32), _0x52ccba(_0x1dd662, _0x270788), t[s(1328)](_0x930d7, _0x546137, _0x4168c2), _0x2ace2f(_0x4feee7, _0x53ff22), t[s(1087)](_0x2e1834, _0x306b2b, _0x2dcec7), t[s(1087)](_0x21a06a, _0x4ac82b, _0x53283d))
                }
                if (!A && v["wKgNP"](l, null) && l[s(1296)]) {
                    const y = Date[s(520)](l);
                    if (y) {
                        const x = v[s(831)](y, Date["now"]());
                        x > -7519 + -1 * 3918 + -1 * -11437 && v["tiogZ"](xe, x)
                    }
                }
                return d
            }
        }
    }

    function ne(e) {
        const t = b;
        var n;
        const i = v["QexTk"](D, null) ? void(1297 * -1 + 6740 + 5443 * -1) : D["querySelector"](v["kjdek"](typeof e, v[t(770)]) ? 'input[name="' + e + '"]' : v["OmnUU"]);
        return ((n = v["QexTk"](i, null) ? void(2 * -1388 + -5354 + -542 * -15) : i[t(1344)]) == null ? void(-3639 + 4954 + -1315) : n["slice"](i[t(1344)]["indexOf"]("@"))) || void(6346 + -7 * -644 + -10854)
    }

    function ie() {
        const e = b,
              t = {};
        t[e(789)] = void(-350 * -14 + 1762 * 3 + -10186 * 1), t[e(1511)] = void(1 * 4903 + -7 * 916 + 1509), t[e(667)] = void(1411 * -5 + 746 + 6309), t[e(491)] = !(10 * 937 + -973 * 1 + -2099 * 4), t[e(1548)] = void(-7555 + 4043 + 3512), t[e(1621)] = void(-5986 + -9 * -519 + 1315), t[e(1507)] = !(-8693 + -8876 + 17570), t[e(360)] = void(-7330 * -1 + -8144 + 814), t[e(1315)] = void(3296 * -2 + -166 * -6 + 4 * 1399), t["timeZone"] = void(3720 + -2414 + -1306 * 1);
        const n = {};
        return n[e(789)] = void(2 * -3495 + 7737 + -747), n[e(1511)] = void(-6523 + -773 * -4 + 3431), n[e(667)] = void(-33 * -31 + 49 * 4 + 1 * -1219), n[e(491)] = void(-7100 + 5279 + 1821), n["expectedCountries"] = void(8987 * 1 + -6678 + -1 * 2309), n[e(1621)] = void(-1263 * 2 + -361 * 25 + 1 * 11551), n[e(1507)] = void(6426 + 166 * -16 + -3770), n[e(360)] = void(3369 + 13 * -119 + -1822 * 1), n["text"] = void(-4964 + -5953 + 3639 * 3), n[e(1618)] = void(-737 * -8 + -1045 + -4851), I === "ipAddress" ? t : typeof I == v["icruo"] ? I : n
    }

    function se(e) {
        const r = b,
              a = {
                  MbVuX: function(e, t) {
                      const n = k1;
                      return v[n(1261)](e, t)
                  },
                  JoIXu: v[r(1120)],
                  VXcVA: function(e, t) {
                      const n = r;
                      return v[n(1044)](e, t)
                  },
                  QFYOH: v[r(452)]
              };
        if (v[r(1430)]("OBSNT", v[r(1436)]))
            for (; _0x4355bb < _0x18c582[r(1296)];) {
                const t = _0x32e0eb[_0x5cca46];
                _0x27127c++, v[r(803)](_0x4b3153, t), v[r(1307)](_0x36a58e, t["$$"])
            } else return [...(v[r(512)](D, null) ? void(-5 * -1850 + 56 * -166 + -46 * -1) : D[r(1529)](v[r(1464)](e, null) && e[r(1296)] ? e[r(1313)](e => r(1368) + e + '"]')[r(486)](", ") : v[r(1473)])) || []][r(315)]((e, t) => {
                const n = r;
                if (a["MbVuX"](n(947), a["JoIXu"])) {
                    const i = t[n(726)],
                          s = t["value"];
                    return a[n(1076)](i, s) && (e[i] = /\n/ [n(680)](s) ? s[n(1565)](new RegExp(a["QFYOH"], "g"), "\r\n") : s), e
                } else {
                    const o = this[n(1263)][n(1025)](_0x44bf72, _0x3cdf84);
                    this[n(290)][n(1545)](_0xb2e99b, o)
                }
            }, {})
    }

    function oe() {
        const e = b,
              t = Q !== void(8807 * -1 + -200 + 9007) ? Q[e(1209)](",") : void(-9397 + 2839 + 6558),
              n = {};
        n["el"] = T, n[e(809)] = Ae, n[e(669)] = K, n[e(768)] = Se, n[e(1104)] = Ee, n[e(622)] = Ce, n[e(322)] = O, n[e(415)] = Be, n[e(1487)] = ve, n[e(1163)] = Pe, n[e(280)] = De, n[e(1492)] = L;
        for (const i of globalThis["altchaPlugins"])(!t || t[e(1148)](i["pluginName"])) && M[e(959)](new i(n))
    }

    function O(...e) {
        const t = b;
        v[t(887)](t(766), v[t(670)]) ? _0x1e8746[t(935)](_0x3c4b28, v["cRkNg"](_0x24b4ca, null)) : (r || e["some"](e => e instanceof Error)) && console[v[t(693)](e[-6434 + 807 + 5627], Error) ? v[t(1572)] : t(322)](t(674), t(1420) + h + "]", ...e)
    }

    function re() {
        const e = b;
        [c1[e(821)], c1[e(1463)], c1["EXPIRED"]]["includes"](N) ? I && v[e(1430)](v[e(1505)](D, null) ? void(101 * -23 + 2711 + -1 * 388) : D[e(562)](), !(-9383 * 1 + 5 * -751 + -1877 * -7)) ? v[e(711)](w, 4676 + -261 + -4407, E = !(-4201 + -337 * -11 + 495)) : m ? v[e(889)](Ae) : v[e(889)](L): v["fLuak"](w, 9458 + -1 * 6469 + -2981, E = !(-1054 + 1626 + -572))
    }

    function ae(e) {
        const t = b,
              n = e[t(1494)];
        d && n && !T[t(811)](n) && (v["bHUQd"](N, c1["VERIFIED"]) || v[t(422)](s, t(286)) && v[t(977)](N, c1[t(821)])) && v["lzXmP"](w, 213 * 7 + 7002 + -8484, T[t(609)][t(794)] = v[t(569)], T)
    }

    function le() {
        const e = b;
        d && v[e(575)](N, c1[e(821)]) && v[e(835)](ge)
    }

    function ce(e) {
        const t = b;
        if (v[t(1171)](v[t(447)], v["ZVGhd"])) {
            for (const n of M) v[t(1394)](typeof n[t(1347)], v[t(433)]) && n[t(1347)](q)
        } else {
            const i = _0x3f7a67[t(1494)];
            v[t(1046)](_0x5866e8, i) && !_0x41ff8f[t(811)](i) && (v[t(422)](_0x168751, _0x110ad5[t(1050)]) || v["etEZH"](_0x5917b4, v[t(1172)]) && v[t(531)](_0x26af70, _0x55a165[t(821)])) && v[t(367)](_0x1aeef7, -8114 + 3 * 3268 + 1 * -1681, _0x58fe34[t(609)]["display"] = v["JgWfF"], _0x4207c1)
        }
    }

    function de(e) {
        const t = b;
        if (v["PPDMS"](v[t(1210)], v[t(1103)])) return this["$$"][t(1200)][75 * -89 + -8453 + -5 * -3029];
        else v[t(1430)](N, c1[t(821)]) && v[t(599)](L)
    }

    function ue(e) {
        const i = b,
              t = {
                  ZbbaZ: function(e, t) {
                      return v["YBesK"](e, t)
                  },
                  CzgVs: v[i(834)],
                  IKoav: function(e, t) {
                      const n = i;
                      return v[n(1353)](e, t)
                  }
              };
        D && v[i(1520)](s, v[i(278)]) ? v["gmWqt"](N, c1[i(821)]) ? (e[i(963)](), e[i(1156)](), v[i(1554)](L)[i(388)](() => {
            const e = i;
            if (t["ZbbaZ"](t[e(337)], e(929))) return this["$$"][e(1200)][2 * 4387 + 28 + -8780];
            else t[e(1339)](D, null) || D[e(615)]()
        })) : v[i(320)](N, c1[i(1050)]) && (e[i(963)](), e["stopPropagation"](), v[i(1286)](N, c1[i(1154)]) && v[i(889)](he)) : v["ZFStm"](D, d) && v[i(308)](s, v[i(1172)]) && N === c1[i(821)] && (e[i(963)](), e[i(1156)](), v[i(1582)](w, 7224 + 25 * -192 + -2415, T["style"][i(794)] = i(1257), T), ge())
    }

    function fe() {
        v["vGXQx"](Be)
    }

    function he() {
        const e = b;
        v[e(912)](N, c1["VERIFYING"]) && o["waitAlert"] && v[e(996)](alert, o["waitAlert"])
    }

    function pe(e) {
        const t = b,
              n = {
                  hcBAq: function(e, t) {
                      const n = k1;
                      return v[n(1365)](e, t)
                  },
                  QWWPp: t(1291)
              };
        if (v["JodZM"](v["RrShO"], v[t(556)])) _0x580c4a[-1 * 266 + 9268 + -9002] & 5900 + -3067 + -785 * 1 && n[t(1151)](_0x3f86f3, _0x2b7fa1 = _0x2604d1[4252 + -529 * -6 + -1 * 7415][t(517)]) && _0x3eb925(_0x57fc3f, n[t(1006)], _0x438468);
        else {
            for (const i of M) v[t(512)](typeof i[t(1138)], v["EQDrB"]) && i[t(1138)](N);
            d && v[t(785)](N, c1[t(821)]) && v[t(1190)](requestAnimationFrame, () => {
                v["ObAbf"](ge)
            }), v[t(1532)](w, 17 * 439 + -5 * -1867 + -16790, E = N === c1[t(1050)])
        }
    }

    function me() {
        const e = b;
        if (v[e(1395)](v[e(661)], v[e(395)])) {
            for (const t of _0x5d42c0) t[e(907)]()
        } else d && v[e(1587)](ge)
    }

    function ge(e = 4632 + -9 * 967 + 4091) {
        const t = b;
        if (T) {
            if (B || (B = (u ? document["querySelector"](u) : D == null ? void(7704 + -3956 + 2 * -1874) : D[t(1052)](t(313))) || D), B) {
                if (v[t(973)] === t(378)) return this["$$"][t(1200)][26 * 343 + 1 * 7537 + -16418];
                else {
                    const n = v["fiLhb"](parseInt, f, -1 * 2411 + 3930 + -1509 * 1) || 2179 + 5824 + -7991,
                          i = B["getBoundingClientRect"](),
                          s = T[t(1322)](),
                          o = document["documentElement"]["clientHeight"],
                          r = document["documentElement"][t(1577)],
                          a = v[t(1488)](d, t(816)) ? v[t(1583)](v["flNnF"](v[t(918)](i["bottom"], s[t(671)]) + n, e), o) : v["RSGBm"](d, v[t(924)]),
                          l = Math["max"](e, Math["min"](v[t(1242)](v["LkXDJ"](r, e), s[t(479)]), v[t(1325)](v[t(554)](i[t(1470)], i["width"] / (1 * -927 + -6616 + 3 * 2515)), v[t(1220)](s[t(479)], -8493 + -9624 + 18119))));
                    if (a ? v[t(702)](w, 900 + -3 * -745 + -3126, T[t(609)]["top"] = v["lxNJQ"](i[t(813)], v[t(554)](s["height"], n)) + "px", T) : v[t(1610)](w, -7944 + 100 * -29 + 10853, T["style"][t(813)] = v["jHDtP"](i[t(457)], n) + "px", T), v[t(998)](w, -2 * -4834 + 1 * 7315 + -16974, T[t(609)][t(1470)] = l + "px", T), T["setAttribute"]("data-floating", a ? "top" : v[t(626)]), C) {
                        const c = C[t(1322)]();
                        w(8854 + -8727 + -117 * 1, C["style"][t(1470)] = v[t(1100)](v["pmrwj"](i["left"], l), v[t(627)](i["width"], 1 * 7071 + -9849 * -1 + -8459 * 2)) - v[t(1220)](c[t(479)], 8851 + -2 * -1318 + -1 * 11485) + "px", C)
                    }
                }
            } else v["GGSBL"](O, t(795))
        }
    }
    async function ye(e) {
        const t = b;
        if (v[t(975)]("rcjBg", t(928))) return this["$$"][t(1200)][-6803 * 1 + -7127 + 13972];
        else {
            if (!x) throw new Error(v[t(1e3)]);
            O("requesting server verification from", x);
            const n = {};
            n[t(341)] = e;
            const i = n;
            if (I) {
                if (v[t(1299)] === v[t(1617)]) {
                    const r = {
                        PYBIs: function(e, t, n, i) {
                            return v["ABJfs"](e, t, n, i)
                        },
                        qTejr: v[t(1524)]
                    };
                    let n;
                    return {
                        c() {
                            const e = t;
                            n = _0x196380(e(832)), r[e(945)](_0x2c6575, n, r[e(1227)], e(762))
                        },
                        m(e, t) {
                            _0x127f72(e, n, t), _0x3db699[6920 + 1428 + -8300](n)
                        },
                        p: _0x3fac26,
                        d(e) {
                            e && _0x2e3325(n), _0x4b3902[-2851 + -332 * -7 + 575 * 1](null)
                        }
                    }
                } else {
                    const {
                        blockedCountries: a,
                        classifier: l,
                        disableRules: c,
                        email: d,
                        expectedLanguages: u,
                        expectedCountries: f,
                        fields: h,
                        ipAddress: p,
                        text: m,
                        timeZone: g
                    } = v[t(889)](ie);
                    i[t(789)] = a, i[t(1511)] = l, i["disableRules"] = c, i[t(491)] = v[t(1001)](d, !(7391 + 1 * 7647 + -15037)) ? void(-9433 + 9833 + -400) : v[t(1564)](ne, d), i[t(1548)] = f, i[t(1621)] = u || (J ? [J] : void(-2619 + -3085 + -248 * -23)), i[t(1507)] = h === !(313 * -7 + 4449 + 1 * -2257) ? void(1035 + -3361 * 1 + -2326 * -1) : v[t(316)](se, h), i[t(360)] = v["ROYdt"](p, !(76 + 8047 + -62 * 131)) ? void(-231 * -3 + -7979 + 7286) : v[t(1340)](p, v["LKgqw"]), i["text"] = m, i[t(1618)] = g === !(1 * 8565 + -7764 + -800) ? void(-8150 + -1052 + 1 * 9202) : g || o1()
                }
            }
            const s = await v[t(1349)](fetch, x, {
                body: JSON[t(547)](i),
                headers: {
                    "content-type": v[t(390)]
                },
                method: v[t(596)]
            });
            if (v["XOMWw"](s[t(1185)], -494 * 17 + -7348 + -34 * -469)) throw new Error(t(394) + s[t(1185)] + ".");
            const o = await s[t(521)]();
            if (o != null && o[t(341)] && v[t(295)](w, 3217 * -1 + -9832 + 13055, R = o[t(341)]), K(v["jNvJf"], o), y && v[t(422)](o[t(757)], v[t(1086)])) throw new Error(t(467))
        }
    }

    function xe(e) {
        v["hDmcx"](O, "expire", e), P && (v["NziEN"](clearTimeout, P), P = null), v["wvjwZ"](e, -5 * -1511 + 7710 + 636 * -24) ? v["IvUpM"](ee) : P = setTimeout(ee, e)
    }

    function we(e) {
        const t = b;
        v["susTx"](O, v[t(878)], e), v[t(715)](d, e) && (v[t(1612)](w, 8413 + -302 * 23 + -1458 * 1, T[t(609)][t(1470)] = "", T), v[t(1538)](w, -4 * 2111 + -2987 + 11440, T[t(609)][t(813)] = "", T)), v[t(329)](w, 1 * 9740 + -3047 + 1673 * -4, d = v[t(1292)](e, !(1080 + 2323 + -3403)) || e === "" ? v["LKgqw"] : v[t(988)](e, !(6999 + -7397 + 7 * 57)) || e === t(1471) ? void(7695 + 4082 + -11777 * 1) : d), d ? (s || w(40 * -193 + 6541 + -1179 * -1, s = t(331)), document[t(742)](v["MZZWO"], le), document[t(742)](v[t(339)], ae), window[t(742)](t(1115), me)) : v["wHSIe"](s, v["arsOR"]) && v[t(1409)](w, -6985 + -5 * -737 + 5 * 660, s = void(-2513 * 2 + -1 * -8179 + 1051 * -3))
    }

    function be(e) {
        const t = b,
              n = v[t(779)]["split"]("|");
        let i = -4057 * 2 + 1 * 4822 + 3292;
        while (!![]) {
            switch (n[i++]) {
                case "0":
                    if (!e["salt"] || v[t(916)](e[t(483)][t(1296)], -904 + 5022 + -4108)) throw new Error(v[t(489)]);
                    continue;
                case "1":
                    if (v[t(1581)](e[t(410)], void(6848 + 4593 + -11441 * 1))) throw new Error(v["jtwXb"]);
                    continue;
                case "2":
                    if (!X[t(1148)](e[t(1350)][t(366)]())) throw new Error(t(555) + X[t(486)](", "));
                    continue;
                case "3":
                    if (!e[t(1350)]) throw new Error(v[t(1568)]);
                    continue;
                case "4":
                    if (!e["challenge"] || v[t(1619)](e["challenge"][t(1296)], 4928 + 435 * 15 + -11413)) throw new Error(t(312));
                    continue
            }
            break
        }
    }
    async function ve(t) {
        const r = b,
              a = {
                  nAIFR: function(e, t, n, i) {
                      const s = k1;
                      return v[s(1612)](e, t, n, i)
                  },
                  bsGuL: function(e, t, n) {
                      const i = k1;
                      return v[i(1411)](e, t, n)
                  }
              };
        if (v["iRUXL"]("wAgtk", v["JcrpE"])) {
            let e = null;
            if (r(862) in window) {
                try {
                    e = await v[r(1380)](ke, t, t["maxnumber"])
                } catch (n) {
                    v["dMxhA"](O, n)
                }
                if (v[r(736)](v[r(1394)](e, null) ? void(177 * 17 + 353 * 5 + -62 * 77) : e[r(273)], void(-4157 * 1 + -1 * 4139 + 122 * 68)) || v["AAbMg"] in t) return {
                    data: t,
                    solution: e
                }
            }
            if (v[r(577)](v[r(1510)], t)) {
                const i = await v[r(1379)](l1, t[r(1399)], t[r(1331)], t[r(652)]),
                      s = {};
                return s[r(485)] = t, s[r(1188)] = await i[r(611)], s
            }
            return {
                data: t,
                solution: await v[r(949)](s1, t[r(538)], t[r(483)], t["algorithm"], t[r(652)] || p)[r(611)]
            }
        } else {
            const l = {
                yPDxg: function(e, t) {
                    const n = r;
                    return v[n(1601)](e, t)
                },
                eHJct: v[r(417)],
                xBFrm: function(e, t, n, i) {
                    return e(t, n, i)
                },
                BpAPi: v[r(505)],
                QIIYX: function(e, t, n, i) {
                    const s = r;
                    return v[s(1198)](e, t, n, i)
                },
                SVbcn: v["HzBMl"],
                VkRcD: v[r(871)],
                Qjrtu: v[r(1191)],
                LPHnW: v[r(1318)],
                FCZPu: r(1408),
                mhrkr: v[r(1173)],
                plNbb: function(e, t, n, i) {
                    const s = r;
                    return v[s(281)](e, t, n, i)
                },
                zPRHJ: v[r(1253)],
                HhiWw: "viewBox",
                VCtPh: v[r(1575)],
                xIxry: v[r(587)],
                yVvIe: v[r(1608)],
                LzMPw: function(e, t) {
                    const n = r;
                    return v[n(921)](e, t)
                }
            };
            let i, s, o;
            return {
                c() {
                    const e = r;
                    i = l[e(827)](_0x3022a0, l[e(374)]), s = l[e(827)](_0x8d2e8c, e(1260)), o = l["yPDxg"](_0x42f692, e(1260)), l["xBFrm"](_0xb5f135, s, "d", l[e(384)]), _0x2c54ff(s, e(591), e(690)), l[e(503)](_0x2cc6c7, s, l[e(974)], l[e(1551)]), l[e(503)](_0x8e51ac, o, "d", l[e(338)]), l[e(503)](_0x3cac17, o, e(591), l[e(641)]), l[e(435)](_0x38f802, o, l[e(496)], l["mhrkr"]), l[e(623)](_0x15fabc, i, e(479), "24"), _0x281a97(i, l[e(1069)], "24"), l["xBFrm"](_0x5809f8, i, l[e(1493)], l["VCtPh"]), l[e(623)](_0x257a47, i, l["xIxry"], l[e(1480)])
                },
                m(e, t) {
                    const n = r;
                    a[n(941)](_0x20a2df, e, i, t), _0x577aa8(i, s), a[n(931)](_0x14f0d2, i, o)
                },
                d(e) {
                    const t = r;
                    e && l[t(348)](_0x46187c, i)
                }
            }
        }
    }
    async function ke(l, e = typeof S == b(273) ? S : p, t = Math[b(901)](g)) {
        const i = b,
              c = {
                  XMPtC: function(e, t, n, i, s) {
                      return v["ZvPoW"](e, t, n, i, s)
                  },
                  gVXqp: function(e, t) {
                      return e !== t
                  },
                  ncBrq: v[i(1111)],
                  PLRzN: function(e, t) {
                      const n = i;
                      return v[n(1396)](e, t)
                  },
                  LfiKl: function(e, t) {
                      return v["YUfmb"](e, t)
                  },
                  jEIFW: v[i(1214)],
                  AxQHr: v[i(482)],
                  oTIqS: i(1208),
                  tLbZX: function(e, t) {
                      return e + t
                  },
                  tjyou: v[i(1482)],
                  cuxMf: v["VpuAD"],
                  DEoIZ: function(e, t) {
                      const n = i;
                      return v[n(1137)](e, t)
                  }
              },
              d = [];
        t = Math[i(788)](-578 + -89 * 46 + 4688, Math["max"](-545 + 4783 + -4237, t));
        for (let e = 2 * -1992 + -5506 + 130 * 73; v[i(1619)](e, t); e++) d[i(959)](v[i(425)](altchaCreateWorker, G));
        const u = Math[i(901)](v[i(627)](e, t)),
              n = await Promise[i(1060)](d[i(1313)]((r, e) => {
                  const t = i;
                  if (c[t(1267)](t(1141), c[t(1598)])) {
                      if (_0x241c0f) {
                          const n = c[t(1533)](_0x16f4a6, _0x420141, _0x54f3f1, _0x5abb24, _0x57d9bd);
                          return _0x3b6378[-8 * -634 + 155 + -5227](n)
                      }
                  } else {
                      const a = c[t(1142)](e, u);
                      return new Promise(i => {
                          const s = t,
                                o = {
                                    TptIO: function(e, t) {
                                        const n = k1;
                                        return c[n(1287)](e, t)
                                    },
                                    TaeWM: c[s(1333)],
                                    jKzOt: function(e, t) {
                                        return c["PLRzN"](e, t)
                                    }
                                };
                          if (c[s(1267)](c[s(560)], c[s(1266)])) r[s(742)](c[s(1570)], e => {
                              const t = s;
                              if (e[t(485)]) {
                                  for (const n of d) o["TptIO"](n, r) && n["postMessage"]({
                                      type: o[t(902)]
                                  })
                              }
                              o[t(377)](i, e[t(485)])
                          }), r[s(471)]({
                              payload: l,
                              max: c[s(861)](a, u),
                              start: a,
                              type: c[s(691)]
                          });
                          else return _0x5e22c0[s(848)](e => e[s(1143)][s(1112)] === _0x15f053)
                      })
                  }
              }));
        for (const s of d) s[i(868)]();
        return n[i(848)](e => !!e) || null
    }
    async function Ae() {
        const t = b;
        if (!m) {
            w(3104 + -76 * -5 + -3477, N = c1[t(1463)]);
            return
        }
        const e = M[t(848)](e => e[t(1143)][t(1112)] === t(927));
        if (!e || !v[t(577)](v[t(524)], e)) {
            if (v["IXwXJ"](v[t(424)], v[t(424)])) {
                v[t(1283)](w, 227 * 9 + -978 * 9 + 6766, N = c1[t(1463)]), v[t(1307)](O, v[t(906)]);
                return
            } else _0x59e3fd[_0x2185ba[t(1454)] || v[t(1515)]] = !(40 * -25 + 7 * 463 + 3 * -747)
        }
        if (v["cEpdb"]("clarify", e) && v["rtrkS"](typeof e["clarify"], v[t(433)])) return e[t(809)]()
    }

    function Ie(e) {
        const t = b;
        if (v[t(1536)](v[t(994)], v[t(994)])) v[t(1414)](e[t(1399)], void(-1266 + -5777 + 1 * 7043)) && v[t(325)](w, 611 + 8403 + -4495 * 2, m = e[t(1399)]), e[t(816)] !== void(781 * -11 + -6941 + -44 * -353) && (v[t(1410)](w, -6340 + 1523 + 4817, s = e["auto"]), s === "onload" && (m ? Ae() : L())), e["blockspam"] !== void(29 * 176 + 5 * 99 + -5599) && v[t(325)](w, -3 * -1786 + -8 * -349 + 166 * -49, y = !!e["blockspam"]), v[t(1365)](e[t(685)], void(-7445 + 542 * 11 + 1483 * 1)) && v[t(877)](w, 773 * -10 + -3089 * -1 + 59 * 79, u = e["floatinganchor"]), e[t(1269)] !== void(-959 + -6734 + 7693) && v[t(981)](w, -8835 + 3636 + 141 * 37, a = e[t(1269)]), e[t(1067)] !== void(-1154 * 8 + -6396 + 3907 * 4) && v["hcyJD"](w, -7120 + -79 * 101 + -40 * -378, f = e["floatingoffset"]), v[t(1057)](e[t(703)], void(6933 + -61 * 38 + -4615)) && we(e[t(703)]), v[t(320)](e[t(1476)], void(8869 + -7 * -1231 + -17486)) && (v["txzCk"](xe, e[t(1476)]), w(1510 + -5 * 1663 + 6824 * 1, A = e[t(1476)])), e[t(538)] && (v["GGSBL"](be, e[t(538)]), V = e[t(538)]), v["Naedf"](e[t(1037)], void(1 * 9321 + -9658 + 337)) && w(7 * -15 + -4232 + 4352, k = e["challengeurl"]), e[t(1134)] !== void(3359 + -4529 + -1170 * -1) && w(15 * 617 + 5107 + -14345, r = !!e["debug"]), v[t(530)](e[t(1301)], void(9365 + 8251 + -12 * 1468)) && v["eXDRu"](w, 4 * -1077 + -55 * 25 + -5 * -1137, l = !!e[t(1301)]), v[t(1365)](e[t(654)], void(-6970 + 2 * -1262 + 47 * 202)) && v["fiLhb"](w, -3792 + -3023 * 3 + 12864, c = !!e[t(654)]), v[t(1453)](e[t(652)], void(382 * 1 + 3377 * -1 + 2995 * 1)) && v[t(1380)](w, 393 * -17 + -7322 * 1 + 14025, p = +e["maxnumber"]), v[t(1391)](e["mockerror"], void(-7868 + -9197 + 3413 * 5)) && v[t(840)](w, 3265 * -2 + -5654 + 12207, W = !!e[t(1594)]), v[t(1540)](e[t(726)], void(702 * 6 + 1 * 2860 + -7072)) && w(-9258 + 8385 + 877, h = e[t(726)]), e[t(305)] !== void(6296 + -1704 + 82 * -56) && v[t(1465)](w, 1 * 7787 + 1 * -1558 + 44 * -141, Y = !!e[t(305)]), v[t(1540)](e[t(1437)], void(-1 * 1849 + -1 * -31 + 1818)) && v[t(1410)](w, -1 * -4652 + 2437 * -3 + 537 * 5, I = typeof e[t(1437)] == v[t(578)] ? e[t(1437)] : !!e[t(1437)]), e["strings"] && v[t(687)](w, 7247 + 13 * 348 + 3909 * -3, i = e["strings"]), e[t(680)] !== void(8165 + 2453 + 5309 * -2) && v[t(1557)](w, -7 * 1097 + -7190 + 14896, S = v[t(545)](typeof e[t(680)], t(273)) ? e["test"] : !!e[t(680)]), v[t(1335)](e[t(953)], void(-31 * 297 + -1315 + 10522)) && v[t(466)](w, 475 * 16 + -2 * -2155 + -13 * 914, x = e[t(953)]), v["inHOl"](e[t(393)], void(1 * 8289 + -3051 + 1746 * -3)) && v[t(1097)](w, 519 * 11 + 9313 + -14993, g = +e[t(393)]), e[t(436)] !== void(1 * 1583 + -6343 + 140 * 34) && v[t(1169)](w, -5930 + 3466 + 2494, G = e[t(436)]);
        else try {
            return _0x131a2f[t(820)]()["resolvedOptions"]()[t(1618)]
        } catch {}
    }

    function Se() {
        const e = b,
              t = {};
        return t[e(816)] = s, t[e(1330)] = y, t[e(1037)] = k, t[e(1134)] = r, t["delay"] = a, t[e(1476)] = A, t[e(703)] = d, t[e(685)] = u, t[e(1067)] = f, t[e(1301)] = l, t[e(654)] = c, t[e(726)] = h, t[e(652)] = p, t[e(1594)] = W, t[e(1399)] = m, t[e(305)] = Y, t[e(1437)] = I, t[e(744)] = o, t[e(680)] = S, t[e(953)] = x, t["workers"] = g, t["workerurl"] = G, t
    }

    function Ee() {
        const e = b;
        if (v[e(608)] === v[e(1573)]) {
            const t = {};
            t["auto"] = _0x1a3b8a, this[e(522)](t), v[e(1587)](_0x366f5a)
        } else return B
    }

    function Te(t) {
        const n = b;
        return M["find"](e => e[n(1143)][n(1112)] === t)
    }

    function Ce() {
        const s = b,
              e = {
                  ukykh: function(e, t) {
                      return v["XOMWw"](e, t)
                  },
                  qPwIA: function(e, t, n) {
                      return v["vHrzl"](e, t, n)
                  },
                  ZlSNB: function(e, t, n) {
                      return e(t, n)
                  },
                  AtwSk: function(e, t) {
                      return v["PPDMS"](e, t)
                  },
                  QidFj: v[s(802)],
                  dwVeY: function(e) {
                      const t = s;
                      return v[t(599)](e)
                  },
                  CtzAd: function(e, t, n) {
                      return e(t, n)
                  },
                  rfhHZ: function(e, t) {
                      return e !== t
                  },
                  gHtnV: function(e, t) {
                      const n = s;
                      return v[n(401)](e, t)
                  },
                  MKWAu: function(e, t) {
                      return e(t)
                  },
                  hHlfF: function(e, t) {
                      const n = s;
                      return v[n(785)](e, t)
                  },
                  otRqO: function(e, t, n) {
                      return e(t, n)
                  },
                  ASaEP: function(e, t) {
                      return e !== t
                  },
                  MiXtm: function(e, t) {
                      return e !== t
                  },
                  zzUWa: function(e, t, n) {
                      const i = s;
                      return v[i(1329)](e, t, n)
                  },
                  ARRXy: function(e, t) {
                      const n = s;
                      return v[n(715)](e, t)
                  },
                  apqun: function(e, t, n) {
                      return e(t, n)
                  },
                  jtcJg: function(e, t, n) {
                      const i = s;
                      return v[i(1094)](e, t, n)
                  },
                  LEYwD: function(e, t, n) {
                      return e(t, n)
                  },
                  qNMki: function(e, t) {
                      const n = s;
                      return v[n(1018)](e, t)
                  },
                  fwKuC: v["icruo"],
                  FnOYN: function(e, t, n) {
                      return v["DixiV"](e, t, n)
                  },
                  OCwYP: function(e, t) {
                      const n = s;
                      return v[n(1414)](e, t)
                  },
                  DJSdQ: function(e, t) {
                      const n = s;
                      return v[n(1505)](e, t)
                  },
                  TbNjV: function(e, t) {
                      const n = s;
                      return v[n(858)](e, t)
                  },
                  yRzVW: function(e, t) {
                      return v["ZXreC"](e, t)
                  },
                  acxWA: function(e, t, n) {
                      return e(t, n)
                  }
              };
        if (v[s(912)](v[s(915)], "TZTJC")) e["ukykh"](_0x2f93c9[s(1399)], void(-1 * 1402 + 5779 + -3 * 1459)) && e[s(552)](_0x2f6abe, -1672 + 2 * -2887 + 7470, _0x4aafeb = _0xb68068[s(1399)]), e[s(979)](_0x1edffe[s(816)], void(-1 * -2306 + 12 * -571 + -2 * -2273)) && (e[s(1580)](_0x1f3ded, -1e4 + -2573 * 1 + 1143 * 11, _0x9998c = _0x278fc9[s(816)]), e[s(1474)](_0x31267d, e[s(888)]) && (_0x4be479 ? _0x455eb0() : e["dwVeY"](_0x1c694f))), _0x454202[s(1330)] !== void(-8415 + -3 * -1423 + 4146) && _0x4b4254(5368 + 1543 + -1 * 6895, _0x3953cd = !!_0x42971d[s(1330)]), e["ukykh"](_0x58cd5e[s(685)], void(-4 * -2137 + -3809 + -7 * 677)) && _0x26f5b2(5434 + -4369 + 1 * -1045, _0x58b9ac = _0x237c03[s(685)]), _0x121589[s(1269)] !== void(-7938 + -1242 + -54 * -170) && e[s(314)](_0x50cf16, -39 * -217 + 7 * 424 + -1 * 11413, _0x3e8638 = _0x137b4f[s(1269)]), _0x11acd5["floatingoffset"] !== void(5233 * -1 + -9490 + -14723 * -1) && e[s(1580)](_0x310c7b, -4064 + -859 * 11 + 13534, _0x49a52a = _0x438b0f[s(1067)]), e[s(576)](_0xbf4496[s(703)], void(5 * 138 + -1 * 237 + -453)) && e["gHtnV"](_0x4898eb, _0x34c142[s(703)]), e[s(576)](_0x38a40f[s(1476)], void(5301 + -3 * -2099 + 6 * -1933)) && (_0x227ba0(_0x36ff80["expire"]), e[s(552)](_0xc594df, 5400 + -5843 * -1 + -11224, _0x2dfa9a = _0x511306[s(1476)])), _0x5dffec[s(538)] && (e["MKWAu"](_0xc83d2c, _0x31f7c3[s(538)]), _0x4fa59f = _0x5ed345[s(538)]), e[s(1500)](_0x1992f6[s(1037)], void(5597 + 154 * 3 + -1 * 6059)) && e[s(1080)](_0x39539d, 6024 + -9430 + 3421, _0x3259b = _0x5aef43[s(1037)]), e[s(559)](_0x1e17c7["debug"], void(-6551 * 1 + 6541 + -10 * -1)) && e[s(1080)](_0x1a2edb, 7976 + 5201 + -13160, _0x52c64d = !!_0x567e19[s(1134)]), e[s(1051)](_0x24a7cb[s(1301)], void(1561 + 530 * -12 + 4799 * 1)) && e["zzUWa"](_0x146a40, 18 * 2 + 5237 + 1 * -5271, _0x13bc6b = !!_0x2417a8["hidefooter"]), e[s(798)](_0x57c34a[s(654)], void(5061 + -5263 + 202)) && e["apqun"](_0x4fd1b8, 2 * -4571 + 571 * 1 + 8574, _0x2969e2 = !!_0x57cb84[s(654)]), _0x2c1a97[s(652)] !== void(3654 + -1080 + 3 * -858) && e["ZlSNB"](_0x10fd55, 793 * 1 + 6582 + -1 * 7353, _0x4f75a9 = +_0x5dcea9["maxnumber"]), e[s(559)](_0x44ccbb[s(1594)], void(2446 * -4 + -191 * 49 + 19143)) && e[s(364)](_0x4c1951, 12 * -91 + -2779 * 1 + 3894, _0x3b1328 = !!_0x3dd2bf[s(1594)]), _0x5895ca[s(726)] !== void(18 * 25 + 9098 + 124 * -77) && e[s(1130)](_0x34e540, -4778 * -1 + -83 + -1 * 4691, _0x56f5a9 = _0x1186b0[s(726)]), e[s(576)](_0x5a2ff9[s(305)], void(1087 + -9 * 131 + 1 * 92)) && e[s(405)](_0x103e71, -1 * 9209 + -568 + 9802, _0x5aa3e5 = !!_0x30ef84[s(305)]), e[s(1500)](_0x1cfce7[s(1437)], void(6344 + -37 * -266 + -16186)) && e[s(1130)](_0x4a17af, 1559 * 3 + 431 + 2541 * -2, _0x4807f0 = e[s(446)](typeof _0x13226[s(1437)], e[s(1264)]) ? _0x2cd80f[s(1437)] : !!_0x42dcd1[s(1437)]), _0x10286b["strings"] && e[s(1370)](_0x12bb5a, 10 * 333 + 29 * 258 + -10768, _0x47f670 = _0x1946d6[s(744)]), e["OCwYP"](_0x5d0931[s(680)], void(-8473 + 2727 + 5746)) && _0x47d4d2(26 * 233 + -179 * 48 + -1 * -2561, _0x42e566 = e[s(1113)](typeof _0x55135b[s(680)], s(273)) ? _0x394f65[s(680)] : !!_0x408177[s(680)]), e[s(421)](_0x21b239[s(953)], void(-6 * 521 + 3542 + -2 * 208)) && e["CtzAd"](_0x1db156, -6550 + -902 + -68 * -110, _0x34dd23 = _0x94946c["verifyurl"]), _0x48cb8a[s(393)] !== void(4621 * -2 + 1 * 5477 + 3765) && e[s(1080)](_0x3b0291, 1 * -6403 + -7293 + -3 * -4575, _0x48ba2e = +_0x436ca4["workers"]), e[s(1558)](_0x115f3b[s(436)], void(1 * -6619 + -1 * 3377 + 9996)) && e[s(728)](_0x3ec130, -7779 + 2 * 1301 + -5207 * -1, _0x1f0544 = _0x369050[s(436)]);
        else return N
    }

    function Be(e = c1[b(821)], t = null) {
        const n = b,
              i = {};
        i[n(1201)] = n(799);
        const s = i;
        if ("fZfGG" !== v[n(1107)]) P && (v["YNTxG"](clearTimeout, P), P = null), w(5927 + 3785 + -9704, E = !(-4350 * 2 + 3219 + 5482)), v["ISJxc"](w, -6162 + 5773 + 394, q = t), v["ZaMKA"](w, 5 * 835 + -1 * 2713 + -208 * 7, R = null), v[n(1312)](w, 75 * 49 + -1321 + -2347, N = e);
        else {
            var o;
            this[n(455)] || (_0x599851 = this["$$g_p"](_0x4d2598), this["$$d"][_0x1f06a6] = _0x3fdb52(_0x160f4f, _0x5d3def, this[n(952)], s[n(1201)]), (o = this[n(1263)]) == null || o[n(514)]({
                [_0xc7eb9d]: this[n(991)][_0x424cbe]
            }))
        }
    }

    function De(e) {
        B = e
    }

    function Pe(e, t = null) {
        const n = b;
        v["WiKOf"](v[n(1419)], v[n(727)]) ? _0x5bcff4 = _0x1bf62b : (v["kKMoA"](w, 1287 + -3 * -2973 + -10199, N = e), v["tTkvi"](w, -3608 + 3457 + 3 * 52, q = t))
    }
    async function L() {
        const s = b,
              r = {
                  jkFsC: function(e, t) {
                      return v["wWrKC"](e, t)
                  },
                  PKdVC: v[s(1005)],
                  seMTv: function(e, t, n, i) {
                      return e(t, n, i)
                  },
                  uLbPW: v[s(1357)],
                  xtJaE: function(e, t, n) {
                      const i = s;
                      return v[i(466)](e, t, n)
                  },
                  AmMeK: s(1188),
                  ibgwG: function(e, t) {
                      return e in t
                  },
                  sfkgy: s(287),
                  iyjFq: function(e, t) {
                      return e !== t
                  },
                  XUPGv: function(e, t, n) {
                      return e(t, n)
                  },
                  TIUav: function(e, t, n) {
                      return v["DMyzz"](e, t, n)
                  },
                  aLWsK: function(e, t, n) {
                      return e(t, n)
                  },
                  wsjQR: v[s(739)],
                  JoHQO: "Unable to find a solution. Ensure that the 'maxnumber' attribute is greater than the randomly generated number.",
                  QUnEM: function(e, t) {
                      const n = s;
                      return v[n(1512)](e, t)
                  },
                  OuBRT: s(774),
                  AZHXu: function(e, t, n) {
                      const i = s;
                      return v[i(618)](e, t, n)
                  },
                  rrxmL: v[s(462)]
              };
        return v[s(755)](s(504), v[s(1166)]) ? (Be(c1[s(1154)]), await new Promise(e => setTimeout(e, a || 9833 + -8820 + -1013)), v[s(886)](te)[s(388)](e => (be(e), O(s(538), e), ve(e)))["then"](({
            data: e,
            solution: t
        }) => {
            const o = s,
                  n = {
                      LCYbQ: function(e, t) {
                          const n = k1;
                          return r[n(787)](e, t)
                      },
                      UIgSp: r[o(1384)],
                      TtGvj: function(e, t, n, i) {
                          const s = o;
                          return r[s(698)](e, t, n, i)
                      },
                      McKoK: o(473)
                  };
            if (o(340) === r[o(826)]) _0x2f392c = n["LCYbQ"](_0x439549, n["UIgSp"]), n[o(1218)](_0x2224cb, _0x311f6a, n["McKoK"], _0x31ce8d[-1 * -8529 + 3 * -1213 + -5 * 977]);
            else {
                if (r[o(1566)](O, r[o(763)], t), r[o(1019)]("challenge", e) && t && !(r[o(1039)] in t)) {
                    if (r[o(270)](t == null ? void(-4109 + 6399 + -2 * 1145) : t[o(273)], void(1766 + 835 + -3 * 867))) {
                        if (x) return ye(r[o(676)]($, e, t));
                        r["TIUav"](w, -2 * 755 + 4834 * -1 + -10 * -635, R = r[o(1010)]($, e, t)), O(r[o(498)], R)
                    } else throw O(r["JoHQO"]), new Error(o(614))
                }
            }
        })["then"](() => {
            const n = s;
            if (r[n(745)](n(774), r["OuBRT"])) r[n(986)](w, 20 * 44 + -5186 + 4313, N = c1[n(1050)]), r[n(787)](O, r[n(1234)]), Nf()[n(388)](() => {
                const e = n,
                      t = {};
                t[e(341)] = R, K("verified", t)
            });
            else return this["$$"]["ctx"][605 * -6 + -4010 + 7644]
        })[s(565)](e => {
            const t = s;
            if (v[t(1375)](t(294), t(294))) v[t(1062)](O, e), v[t(1354)](w, -9831 + 8573 + 55 * 23, N = c1[t(1463)]), v[t(1176)](w, 3303 + -197 * 1 + -3101, q = e[t(1208)]);
            else return r[t(745)](_0x49c396[-7092 + 1873 * 2 + 3353], _0x109ef9["EXPIRED"]) ? _0x521d15 : _0x4c3591
        })) : this["$$"][s(1200)][911 * -5 + 844 + 3744]
    }

    function Re() {
        const e = b;
        E = this[e(1531)], v[e(1440)](w, 303 + -4161 + 3866, E)
    }

    function Me(d) {
        const u = b;
        Cf[d ? v[u(399)] : v[u(908)]](() => {
            const o = u,
                  e = {
                      KRffa: function(e, t, n) {
                          return v["eRuag"](e, t, n)
                      },
                      hkBpc: function(e, t) {
                          const n = k1;
                          return v[n(533)](e, t)
                      },
                      xlNyE: v[o(740)],
                      vjSNg: function(e, t) {
                          return e > t
                      },
                      znCBX: function(e, t) {
                          return v["jHDtP"](e, t)
                      },
                      YSbBO: v["xdCjb"],
                      aezSN: function(e, t) {
                          const n = o;
                          return v[n(1242)](e, t)
                      },
                      ZDYQJ: function(e, t) {
                          const n = o;
                          return v[n(627)](e, t)
                      },
                      jGdMR: function(e, t) {
                          const n = o;
                          return v[n(863)](e, t)
                      },
                      lnmnb: function(e, t, n, i) {
                          return e(t, n, i)
                      },
                      mukKB: function(e, t) {
                          return v["niWva"](e, t)
                      },
                      UBIzc: function(e, t, n, i) {
                          const s = o;
                          return v[s(332)](e, t, n, i)
                      },
                      MkVJz: function(e, t, n, i) {
                          const s = o;
                          return v[s(1610)](e, t, n, i)
                      },
                      AGbcc: o(1031),
                      rfDnO: function(e, t) {
                          const n = o;
                          return v[n(831)](e, t)
                      },
                      hsiVg: function(e, t) {
                          const n = o;
                          return v[n(1220)](e, t)
                      }
                  };
            if (v["EstVb"] === o(567)) C = d, v[o(295)](w, -59 * 57 + -93 + 3466, C);
            else {
                const t = e[o(1187)](_0x5ce074, _0x492f31, 281 + 9757 + -10028) || -4005 + 2408 * 2 + 1 * -799,
                      n = _0xb452f0["getBoundingClientRect"](),
                      i = _0x47787c[o(1322)](),
                      s = _0x43910f["documentElement"][o(1496)],
                      r = _0x45841f[o(1360)]["clientWidth"],
                      a = e[o(683)](_0x19b993, e[o(1207)]) ? e[o(1212)](e[o(589)](e["znCBX"](e[o(589)](n["bottom"], i["height"]), t), _0x566c84), s) : _0x2bf677 === e[o(379)],
                      l = _0x5de779["max"](_0x376303, _0x571164[o(788)](e[o(939)](r, _0x563128) - i[o(479)], e[o(939)](n[o(1470)] + e[o(807)](n[o(479)], 122 * 73 + -7213 + -1691), e[o(1109)](i[o(479)], 5533 + -1 * 1945 + -3586))));
                if (a ? e[o(1606)](_0x22b2c8, -5887 + -1 * 7845 + 13741, _0xe78e27[o(609)][o(813)] = e["mukKB"](n[o(813)], e[o(589)](i["height"], t)) + "px", _0x59244b) : e[o(882)](_0x565556, -1 * 1585 + -3477 + 5071, _0x589159[o(609)]["top"] = e["znCBX"](n["bottom"], t) + "px", _0x14e85b), e[o(1535)](_0x583bbb, -9560 + -1 * 465 + 10034, _0x4132cb[o(609)][o(1470)] = l + "px", _0x2c164b), _0x13e538[o(506)](e["AGbcc"], a ? e[o(379)] : o(457)), _0x406a6e) {
                    const c = _0x138270["getBoundingClientRect"]();
                    _0x1e4aed(-1301 * -7 + -131 * -11 + 10538 * -1, _0x314ac4[o(609)]["left"] = e[o(589)](e[o(842)](n["left"], l), n[o(479)] / (183 * 17 + 5453 + -8562)) - e[o(438)](c[o(479)], 1 * 2364 + 69 + -2431) + "px", _0x3aeabf)
                }
            }
        })
    }

    function Ne(e) {
        const n = b,
              t = {
                  yhyXa: function(e, t) {
                      const n = k1;
                      return v[n(912)](e, t)
                  }
              };
        v[n(1337)](v["tswHP"], v["RxnOn"]) ? (t[n(1054)](_0x34180d["$$"][n(494)][-5971 + -8133 + 4 * 3526], -(6958 + -2038 * -2 + -1003 * 11)) && (_0x1cf08d["push"](_0x207280), _0x48000a(), _0x184959["$$"][n(494)][n(591)](-330 + -2 * 2102 + 4534)), _0x375534["$$"][n(494)][_0x6dfde0 / (-3527 + -4661 + 8219) | -8210 + -599 * 11 + 14799] |= -2 * 263 + -8131 * 1 + 234 * 37 << _0x45ee4d % (3116 * -1 + 1168 + -1 * -1979)) : Cf[e ? v[n(399)] : v[n(908)]](() => {
            const t = n;
            if (v[t(1319)](v[t(385)], v[t(385)])) T = e, v[t(1329)](w, -2688 + 1922 + 25 * 31, T);
            else return [...new _0x151fae(_0x293122)][t(1313)](e => e[t(1114)](3049 + -104 * -90 + -12393 * 1)["padStart"](3903 * 1 + -2 * 2759 + 1617 * 1, "0"))[t(486)]("")
        })
    }
    return n[b(522)] = e => {
        const t = b;
        v[t(516)](v["iNlUE"], "kkfSP") ? (_0x512e17 = this["checked"], _0x3ae5ed(2710 + 128 + -2830, _0x4ee7a7)) : (v[t(577)](t(816), e) && w(-247 + 1 * -5302 + 5549, s = e[t(816)]), v[t(1451)](v[t(484)], e) && v["kXGtE"](w, -165 * -2 + -5759 + -99 * -55, y = e[t(1330)]), t(1037) in e && w(514 * 3 + 6636 + -8163, k = e[t(1037)]), v[t(718)](t(896), e) && w(7859 + 8977 + 5 * -3361, H = e["challengejson"]), v[t(879)](v[t(439)], e) && w(77 + -1786 + 1726, r = e["debug"]), v["HKfHj"](v[t(658)], e) && v["ntNbJ"](w, 3035 * -1 + -9125 + 12178, a = e["delay"]), v[t(718)](t(1476), e) && w(155 * 33 + -158 * -5 + -5886, A = e["expire"]), v[t(878)] in e && v["gCgjO"](w, 5807 + 9534 + 1534 * -10, d = e["floating"]), v[t(879)](v[t(1466)], e) && v[t(428)](w, 30 * 109 + -9216 + 5966, u = e[t(685)]), t(1067) in e && v[t(1411)](w, -589 + 1 * 410 + 40 * 5, f = e["floatingoffset"]), v[t(1451)](v[t(502)], e) && w(-8234 * -1 + -7255 + -977, l = e[t(1301)]), v[t(1495)](v["SWRgD"], e) && v[t(797)](w, 2755 + 1737 + -67 * 67, c = e[t(654)]), v[t(1205)](v[t(1537)], e) && v[t(1186)](w, 4262 + 8422 + -12680, h = e[t(726)]), v[t(1105)](v["YlGNl"], e) && v[t(1329)](w, 5233 * -1 + -1753 + 7008, p = e[t(652)]), v[t(965)] in e && w(1489 * -1 + 4703 + -3191, W = e[t(1594)]), t(1399) in e && v[t(1516)](w, -2982 + -647 + -13 * -281, m = e[t(1399)]), v["BuNTi"](t(1425), e) && v["QnNtn"](w, 9284 + 4 * -157 + -8624, Q = e[t(1425)]), v[t(631)](v["Cxvtl"], e) && v[t(1169)](w, 8743 + 7329 * -1 + -1389, Y = e[t(305)]), v[t(1327)] in e && v[t(1128)](w, -8396 + 5795 * -1 + -7 * -2031, I = e[t(1437)]), v[t(960)] in e && v[t(1465)](w, 5171 + -540 + 38 * -121, z = e[t(744)]), v[t(968)](v[t(1246)], e) && v[t(618)](w, 2207 + -1 * 3822 + 1642, S = e[t(680)]), v[t(1217)](t(953), e) && v["WVpOm"](w, 1757 * 2 + -606 + -2880, x = e[t(953)]), v[t(1265)](t(393), e) && v[t(1532)](w, 5870 + -2483 + -146 * 23, g = e[t(393)]), v[t(513)](v[t(772)], e) && v[t(1469)](w, -4 * 9 + -7441 * 1 + 1 * 7507, G = e[t(436)]), v["OYrBk"](v[t(1196)], e) && v[t(464)](w, 4333 + 1 * 2749 + 31 * -227, j = e[t(955)]))
    }, n["$$"][b(1417)] = () => {
        const e = b,
              t = {};
        t[e(341)] = R, t[e(1468)] = N, v[e(1569)](n["$$"][e(494)][-2320 * -2 + 2 * 1434 + -7508], -1571 * -39 + 1 * 61207 + -89708) && v["kRert"](w, 4982 + 2316 + 7286 * -1, _ = !!(v[e(499)](k, null) && k[e(1148)](v[e(413)])) && !!(v[e(499)](k, null) && k["includes"](e(970)))), v["hFvBr"](n["$$"][e(494)][5976 + 9645 + 20 * -781], -1064 + 4426 + 1 * -3361) && (V = H ? E1(H) : void(-23 * -1 + -5463 + 10 * 544)), v["FUUQy"](n["$$"][e(494)][4138 + 2863 * 2 + -9863], 1509 * -3 + 672 * 8 + -5 * 169) && w(-4854 + -1056 + 5954 * 1, i = z ? v[e(356)](E1, z) : {}), v[e(720)](n["$$"][e(494)][7994 + 7340 + -15333], 6312 + -3251 + 5131) && v[e(536)](w, 223 * 17 + 887 + -4667, o = {
            ariaLinkLabel: I1,
            error: e(480),
            expired: e(758),
            footer: 'Protected by <a href="' + S1 + e(1131) + (i["ariaLinkLabel"] || I1) + e(492),
            label: "I'm not a robot",
            verified: v["Jjerq"],
            verifying: e(659),
            waitAlert: v[e(759)],
            ...i
        }), n["$$"]["dirty"][-2726 + -33 * -23 + 1967] & -401 + 4268 + 175 * -21 && v["rHwpK"](K, v["aZRpi"], t), v["FUUQy"](n["$$"][e(494)][-2322 + -6763 * -1 + -4441 * 1], 302 * -31 + -2 * -3634 + 2126) && v[e(889)](ce), v[e(1569)](n["$$"][e(494)][9526 * 1 + 4751 + 14277 * -1], -1223 * -7 + 6357 + 6 * -2465) && v[e(599)](pe)
    }, [s, d, l, c, h, q, R, N, E, T, C, o, _, re, he, k, y, r, a, A, u, f, p, W, m, Y, I, S, x, g, G, H, Q, z, Ae, Ie, Se, Ee, Te, Ce, Be, De, Pe, L, i, j, U, Re, Me, Ne]
}
class C1 extends $f {
    constructor(e) {
        const t = Oe,
              n = {
                  DvEXr: function(e, t, n, i, s, o, r, a, l) {
                      return e(t, n, i, s, o, r, a, l)
                  }
              };
        super(), n[t(723)](Kf, this, e, T1, A1, $u, {
            auto: 0,
            blockspam: 16,
            challengeurl: 15,
            challengejson: 31,
            debug: 17,
            delay: 18,
            expire: 19,
            floating: 1,
            floatinganchor: 20,
            floatingoffset: 21,
            hidefooter: 2,
            hidelogo: 3,
            name: 4,
            maxnumber: 22,
            mockerror: 23,
            obfuscated: 24,
            plugins: 32,
            refetchonexpire: 25,
            spamfilter: 26,
            strings: 33,
            test: 27,
            verifyurl: 28,
            workers: 29,
            workerurl: 30,
            clarify: 34,
            configure: 35,
            getConfiguration: 36,
            getFloatingAnchor: 37,
            getPlugin: 38,
            getState: 39,
            reset: 40,
            setFloatingAnchor: 41,
            setState: 42,
            verify: 43
        }, d1, [-(4639 + 67 + 1 * -4705), -(3173 + 2645 + -5817), -(61 * 151 + -2927 * 1 + -6283)])
    }
    get[Oe(816)]() {
        const e = Oe;
        return this["$$"][e(1200)][-635 * 3 + -7464 + -9 * -1041]
    }
    set[Oe(816)](e) {
        const t = Oe,
              n = {
                  LvHCc: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(816)] = e, this[t(522)](i), n[t(1244)](_f)
    }
    get[Oe(1330)]() {
        const e = Oe;
        return this["$$"][e(1200)][3357 + -2 * 4112 + 4883]
    }
    set[Oe(1330)](e) {
        const t = Oe,
              n = {
                  OjVxD: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(1330)] = e, this["$$set"](i), n[t(751)](_f)
    }
    get[Oe(1037)]() {
        const e = Oe;
        return this["$$"][e(1200)][-7228 + -2 * -4265 + 1287 * -1]
    }
    set["challengeurl"](e) {
        const t = Oe,
              n = {
                  DnePO: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(1037)] = e, this[t(522)](i), n[t(1401)](_f)
    }
    get["challengejson"]() {
        const e = Oe;
        return this["$$"][e(1200)][3549 + 2 * 1968 + -7454 * 1]
    }
    set[Oe(896)](e) {
        const t = Oe,
              n = {
                  KeSCp: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(896)] = e, this[t(522)](i), n[t(534)](_f)
    }
    get[Oe(1134)]() {
        const e = Oe;
        return this["$$"][e(1200)][9538 + 1016 + -10537]
    }
    set[Oe(1134)](e) {
        const t = Oe,
              n = {
                  PnfVr: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(1134)] = e, this[t(522)](i), n[t(342)](_f)
    }
    get[Oe(1269)]() {
        return this["$$"]["ctx"][-8621 * -1 + -1 * 3847 + -4756]
    }
    set["delay"](e) {
        const t = Oe,
              n = {
                  LMLWn: function(e) {
                      return e()
                  }
              },
              i = {};
        i["delay"] = e, this[t(522)](i), n[t(454)](_f)
    }
    get[Oe(1476)]() {
        const e = Oe;
        return this["$$"][e(1200)][5093 * 1 + 4230 + -9304]
    }
    set[Oe(1476)](e) {
        const t = Oe,
              n = {
                  fPWQg: function(e) {
                      return e()
                  }
              },
              i = {};
        i["expire"] = e, this[t(522)](i), n[t(1048)](_f)
    }
    get[Oe(703)]() {
        const e = Oe;
        return this["$$"][e(1200)][1 * -5407 + -17 * 251 + 25 * 387]
    }
    set[Oe(703)](e) {
        const t = Oe,
              n = {};
        n["floating"] = e, this[t(522)](n), _f()
    }
    get[Oe(685)]() {
        return this["$$"]["ctx"][1 * -338 + 5582 + -5224]
    }
    set[Oe(685)](e) {
        const t = Oe,
              n = {};
        n[t(685)] = e, this[t(522)](n), _f()
    }
    get[Oe(1067)]() {
        const e = Oe;
        return this["$$"][e(1200)][32 * 293 + 9915 + 2 * -9635]
    }
    set[Oe(1067)](e) {
        const t = Oe,
              n = {
                  Pwpsw: function(e) {
                      return e()
                  }
              },
              i = {};
        i["floatingoffset"] = e, this["$$set"](i), n[t(869)](_f)
    }
    get[Oe(1301)]() {
        const e = Oe;
        return this["$$"][e(1200)][-1168 * -7 + -167 + -8007]
    }
    set[Oe(1301)](e) {
        const t = Oe,
              n = {
                  wvulm: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(1301)] = e, this["$$set"](i), n[t(1072)](_f)
    }
    get[Oe(654)]() {
        const e = Oe;
        return this["$$"][e(1200)][-7375 + -7295 * 1 + -201 * -73]
    }
    set[Oe(654)](e) {
        const t = Oe,
              n = {
                  zKqkp: function(e) {
                      return e()
                  }
              },
              i = {};
        i["hidelogo"] = e, this[t(522)](i), n[t(289)](_f)
    }
    get["name"]() {
        const e = Oe;
        return this["$$"][e(1200)][-5400 + 274 + -9 * -570]
    }
    set[Oe(726)](e) {
        const t = Oe,
              n = {
                  ODXBs: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(726)] = e, this[t(522)](i), n[t(632)](_f)
    }
    get[Oe(652)]() {
        return this["$$"]["ctx"][4 * 733 + -6 * -293 + 12 * -389]
    }
    set[Oe(652)](e) {
        const t = Oe,
              n = {
                  vIFBf: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(652)] = e, this[t(522)](i), n[t(1152)](_f)
    }
    get["mockerror"]() {
        const e = Oe;
        return this["$$"][e(1200)][-4479 + 2 * 2297 + -92]
    }
    set[Oe(1594)](e) {
        const t = Oe,
              n = {
                  sEDyQ: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(1594)] = e, this[t(522)](i), n[t(725)](_f)
    }
    get[Oe(1399)]() {
        const e = Oe;
        return this["$$"][e(1200)][8166 + 2102 + -10244]
    }
    set["obfuscated"](e) {
        const t = Oe,
              n = {};
        n[t(1399)] = e, this["$$set"](n), _f()
    }
    get[Oe(1425)]() {
        return this["$$"]["ctx"][-3338 + -7543 * 1 + -10913 * -1]
    }
    set[Oe(1425)](e) {
        const t = Oe,
              n = {};
        n[t(1425)] = e, this["$$set"](n), _f()
    }
    get[Oe(305)]() {
        const e = Oe;
        return this["$$"][e(1200)][-2556 + -1126 * -3 + -797]
    }
    set[Oe(305)](e) {
        const t = Oe,
              n = {};
        n["refetchonexpire"] = e, this[t(522)](n), _f()
    }
    get[Oe(1437)]() {
        return this["$$"]["ctx"][-4975 + -7898 + -1 * -12899]
    }
    set[Oe(1437)](e) {
        const t = Oe,
              n = {
                  qAynK: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(1437)] = e, this["$$set"](i), n[t(870)](_f)
    }
    get["strings"]() {
        const e = Oe;
        return this["$$"][e(1200)][-7449 * -1 + 1993 + -9409]
    }
    set[Oe(744)](e) {
        const t = Oe,
              n = {
                  tEQBc: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(744)] = e, this[t(522)](i), n[t(750)](_f)
    }
    get[Oe(680)]() {
        const e = Oe;
        return this["$$"][e(1200)][1 * -9938 + -3989 * 1 + -6977 * -2]
    }
    set["test"](e) {
        const t = Oe,
              n = {
                  ffRyr: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(680)] = e, this[t(522)](i), n[t(1490)](_f)
    }
    get[Oe(953)]() {
        const e = Oe;
        return this["$$"][e(1200)][59 * 33 + -1 * 8678 + 6759]
    }
    set[Oe(953)](e) {
        const t = Oe,
              n = {
                  COfAZ: function(e) {
                      return e()
                  }
              },
              i = {};
        i["verifyurl"] = e, this[t(522)](i), n[t(997)](_f)
    }
    get["workers"]() {
        const e = Oe;
        return this["$$"][e(1200)][-1612 * 5 + 168 + 1 * 7921]
    }
    set[Oe(393)](e) {
        const t = Oe,
              n = {
                  LGGXH: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(393)] = e, this["$$set"](i), n["LGGXH"](_f)
    }
    get[Oe(436)]() {
        const e = Oe;
        return this["$$"][e(1200)][3457 + -6114 + 2687]
    }
    set[Oe(436)](e) {
        const t = Oe,
              n = {
                  BhSXa: function(e) {
                      return e()
                  }
              },
              i = {};
        i[t(436)] = e, this[t(522)](i), n[t(1574)](_f)
    }
    get[Oe(809)]() {
        const e = Oe;
        return this["$$"][e(1200)][1 * -4535 + 6478 * -1 + 11047]
    }
    get[Oe(796)]() {
        const e = Oe;
        return this["$$"][e(1200)][-1167 + -6941 + 8143]
    }
    get["getConfiguration"]() {
        const e = Oe;
        return this["$$"][e(1200)][1908 + -675 + -1197]
    }
    get[Oe(1104)]() {
        const e = Oe;
        return this["$$"][e(1200)][3299 + -1 * 8571 + -5309 * -1]
    }
    get[Oe(681)]() {
        const e = Oe;
        return this["$$"][e(1200)][-3448 + -8812 + 12298]
    }
    get["getState"]() {
        const e = Oe;
        return this["$$"][e(1200)][8807 * 1 + 5758 + -14526 * 1]
    }
    get[Oe(415)]() {
        return this["$$"]["ctx"][3876 + 5785 + -9 * 1069]
    }
    get[Oe(280)]() {
        return this["$$"]["ctx"][-806 + 5158 + 1 * -4311]
    }
    get[Oe(1163)]() {
        const e = Oe;
        return this["$$"][e(1200)][-997 * 5 + -2844 + 463 * 17]
    }
    get[Oe(1492)]() {
        const e = Oe;
        return this["$$"][e(1200)][1 * -5479 + -38 * 206 + 2670 * 5]
    }
}
const B1 = {};
B1["type"] = Oe(989);
const D1 = {};
D1[Oe(1033)] = Oe(989);
const P1 = {};
P1[Oe(1033)] = Oe(989);
const R1 = {};
R1["type"] = Oe(989);
const M1 = {};
M1[Oe(1033)] = "Boolean";
const N1 = {};
N1["type"] = Oe(989);
const O1 = {};
O1[Oe(1033)] = Oe(989);
const L1 = {};
L1["auto"] = {}, L1[Oe(1330)] = {}, L1["challengeurl"] = {}, L1["challengejson"] = {}, L1[Oe(1134)] = B1, L1[Oe(1269)] = {}, L1[Oe(1476)] = {}, L1["floating"] = {}, L1[Oe(685)] = {}, L1[Oe(1067)] = {}, L1[Oe(1301)] = D1, L1[Oe(654)] = P1, L1[Oe(726)] = {}, L1[Oe(652)] = {}, L1[Oe(1594)] = R1, L1[Oe(1399)] = {}, L1["plugins"] = {}, L1["refetchonexpire"] = M1, L1[Oe(1437)] = N1, L1[Oe(744)] = {}, L1["test"] = O1, L1[Oe(953)] = {}, L1[Oe(393)] = {}, L1[Oe(436)] = {}, customElements[Oe(343)](Oe(769), qf(C1, L1, [Oe(404)], [Oe(809), Oe(796), "getConfiguration", Oe(1104), Oe(681), Oe(622), Oe(415), Oe(280), Oe(1163), Oe(1492)], !(-8590 + 6957 + 19 * 86))), globalThis[Oe(1518)] = e => e ? new Worker(new URL(e)) : new Yu, globalThis[Oe(450)] = globalThis[Oe(450)] || [];
window.setupCard.innerHTML += "<script-widget style='position: fixed;top: -100%;' id='script-altcha' challengeurl='https://api.moomoo.io/verify'></script-widget>";
window.altcha.replaceWith(window["script-altcha"]);
window.loadedScript = !0;
const F1 = location.hostname !== "localhost" && location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168."),
      _1 = location.hostname === "sandbox-dev.moomoo.io" || location.hostname === "sandbox.moomoo.io",
      V1 = location.hostname === "dev.moomoo.io" || location.hostname === "dev2.moomoo.io",
      U1 = new Nl;
let j1, H1;
const W1 = location.hostname === "localhost" || location.hostname === "127.0.0.1",
      Q1 = !1,
      Y1 = W1 || Q1;
_1 ? (j1 = "https://api-sandbox.moomoo.io", H1 = "moomoo.io") : V1 ? (j1 = "https://api-dev.moomoo.io", H1 = "moomoo.io") : (j1 = "https://api.moomoo.io", H1 = "moomoo.io");
const z1 = !Y1,
      G1 = new $d(H1, 443, 50, 5, z1);
G1.debugLog = !1;
const K1 = {
    animationTime: 0,
    land: null,
    lava: null,
    x: K.volcanoLocationX,
    y: K.volcanoLocationY
};

function X1() {
    let t = !1;
    return function(e) {
        (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(e) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0, 4))) && (t = !0)
    }(navigator.userAgent || navigator.vendor || window.opera), t
}
const J1 = X1();
let q1 = !1,
    $1 = !1;

function Z1() {
    !O0 || $1 || ($1 = !0, F1 || Y1 ? V0 && th("alt:" + V0) : V0 ? th("alt:" + V0) : th())
}
let eh = !1;

function th(s) {
    G1.start(H0, function(e, t, n) {
        let i = "wss" + "://" + e;
        s && (i += "?token=" + encodeURIComponent(s)), W1 && (i = "wss://localhost:3000"), T.connect(i, function(e) {
            if (eh) {
                eh = !1;
                return
            }
            ey(), e ? L0(e) : (q1 = !0, Um())
        }, {
            A: M0,
            B: L0,
            C: Ym,
            D: dg,
            E: ug,
            a: Fg,
            G: r2,
            H: J2,
            I: og,
            J: sg,
            K: v2,
            L: q2,
            M: $2,
            N: gg,
            O: yg,
            P: Km,
            Q: $m,
            R: Xm,
            S: fg,
            T: o2,
            U: s2,
            V: Lp,
            X: Z2,
            Y: ig,
            Z: ty,
            g: sp,
            1: ap,
            2: ep,
            3: op,
            4: rp,
            5: Dp,
            6: Zp,
            7: Ip,
            8: zm,
            9: kp,
            0: $g
        })
    }, function(e) {
        console.error("Vultr error:", e), alert(`Error:
` + e), L0("disconnected")
    }, W1)
}

function nh() {
    return T.connected
}

function ih() {
    const e = prompt("party key", H0);
    e && (window.onbeforeunload = void 0, window.location.href = "/?server=" + e)
}
const sh = new Ol(K),
      oh = Math.PI,
      rh = oh * 2;
Math.lerpAngle = function(e, t, n) {
    S(t - e) > oh && (e > t ? t += rh : e += rh);
    const i = t + (e - t) * n;
    return i >= 0 && i <= rh ? i : i % rh
};
CanvasRenderingContext2D.prototype.roundRect = function(e, t, n, i, s) {
    return n < 2 * s && (s = n / 2), i < 2 * s && (s = i / 2), s < 0 && (s = 0), this.beginPath(), this.moveTo(e + s, t), this.arcTo(e + n, t, e + n, t + i, s), this.arcTo(e + n, t + i, e, t + i, s), this.arcTo(e, t + i, e, t, s), this.arcTo(e, t, e + n, t, s), this.closePath(), this
};
let ah;
typeof Storage < "u" && (ah = !0);

function lh(e, t) {
    ah && localStorage.setItem(e, t)
}

function ch(e) {
    return ah ? localStorage.getItem(e) : null
}
let dh = ch("moofoll");

function uh() {
    dh || (dh = !0, lh("moofoll", 1))
}
let fh, hh, ph = 1,
    mh, gh, yh, xh = Date.now();
let wh;
var bh = [],
    J = [];
let vh = [];
var kh = [],
    Ah = [],
    Ih = new Hl(wc, Ah, J, bh, C, x, K, X),
    Sh = new Wl(bh, zl, J, x, null, K, X);
let Eh, q, Th = 1,
    Ch = 0,
    Bh = 0,
    Dh = 0,
    Ph, Rh, Mh, Nh = 0;
var Oh = K.maxScreenWidth,
    Lh = K.maxScreenHeight;
let Fh, _h, Vh = !1;
document.getElementById("ad-container");
const Uh = document.getElementById("mainMenu"),
      jh = document.getElementById("enterGame"),
      Hh = document.getElementById("promoImg");
Hh.remove();
document.getElementById("promoImgHolder").remove();
const Wh = document.getElementById("joinPartyButton"),
      Qh = document.getElementById("settingsButton"),
      Yh = Qh.getElementsByTagName("span")[0],
      zh = document.getElementById("allianceButton"),
      Gh = document.getElementById("storeButton"),
      Kh = document.getElementById("chatButton"),
      Xh = document.getElementById("gameCanvas"),
      $ = Xh.getContext("2d");
Kh.remove();
var Jh = document.getElementById("serverBrowser");
const qh = document.getElementById("nativeResolution"),
      $h = document.getElementById("showPing");
document.getElementById("playMusic");
const Zh = document.getElementById("pingDisplay"),
      e0 = document.getElementById("shutdownDisplay"),
      t0 = document.getElementById("menuCardHolder"),
      n0 = document.getElementById("guideCard"),
      i0 = document.getElementById("loadingText"),
      s0 = document.getElementById("gameUI"),
      o0 = document.getElementById("actionBar"),
      r0 = document.getElementById("scoreDisplay"),
      a0 = document.getElementById("foodDisplay"),
      l0 = document.getElementById("woodDisplay"),
      c0 = document.getElementById("stoneDisplay"),
      d0 = document.getElementById("killCounter"),
      u0 = document.getElementById("leaderboardData"),
      f0 = document.getElementById("nameInput"),
      h0 = document.getElementById("itemInfoHolder"),
      p0 = document.getElementById("ageText"),
      m0 = document.getElementById("ageBarBody"),
      g0 = document.getElementById("upgradeHolder"),
      y0 = document.getElementById("upgradeCounter"),
      x0 = document.getElementById("allianceMenu"),
      w0 = document.getElementById("allianceHolder"),
      b0 = document.getElementById("allianceManager"),
      v0 = document.getElementById("mapDisplay"),
      k0 = document.getElementById("diedText"),
      A0 = document.getElementById("skinColorHolder"),
      I0 = v0.getContext("2d");
const S0 = document.getElementById("storeMenu"),
      E0 = document.getElementById("storeHolder"),
      T0 = document.getElementById("noticationDisplay"),
      C0 = xc.hats,
      B0 = xc.accessories;
var C = new jl(Gl, kh, X, K);
const D0 = "#525252",
      P0 = "#3d3f42",
      R0 = 5.5;
K.DAY_INTERVAL / 24;
K.DAY_INTERVAL / 2;
window.addEventListener("wheel", function(e) {
    if (!m.q) return;
    if (e.deltaY > 0) {
        Oh *= 1.05;
        Lh *= 1.05
    } else {
        Oh /= 1.05;
        Lh /= 1.05
    }
    sm()
});

function M0(e) {
    vh = e.teams
}
let N0 = !0;
var O0 = !1;
(!Y1 || W1) && (O0 = !0);
window.onblur = function() {
    N0 = !1
};
window.onfocus = function() {
    N0 = !0, z && z.alive && Am()
};
window.captchaCallbackHook = function() {
    O0 = !0
};
window.captchaCallbackComplete && window.captchaCallbackHook();
window.addEventListener("keydown", function(e) {
    e.keyCode == 32 && e.target == document.body && e.preventDefault()
});
Xh.oncontextmenu = function() {
    return !1
};
["touch-controls-left", "touch-controls-right", "touch-controls-fullscreen", "storeMenu"].forEach(e => {
    document.getElementById(e) && (document.getElementById(e).oncontextmenu = function(e) {
        e.preventDefault()
    })
});

function L0(e) {
    q1 = !1, T.close(), F0(e)
}

function F0(e, t) {
    Uh.style.display = "block", s0.style.display = "none", t0.style.display = "none", k0.style.display = "none", i0.style.display = "block", i0.innerHTML = e + (t ? "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>" : "")
}

function _0() {
    Zh.hidden = false, i0.style.display = "none", Uh.style.display = "block", t0.style.display = "block", Op(), j0(), n2(), i0.style.display = "none", t0.style.display = "block";
    let e = ch("moo_name") || "";
    !e.length && FRVR.profile && (e = FRVR.profile.name(), e && (e += f(Math.random() * 90) + 9)), f0.value = e || ""
}
var V0;

function U0(e) {
    var t;
    ((t = e == null ? void 0 : e.detail) == null ? void 0 : t.state) === "verified" && (V0 = e.detail.payload, document.getElementById("script-altcha").remove(), jh.classList.remove("disabled"), ! function() {
        document.getElementById("enterGame").innerText = "Enter Game";
    }())
}
window.addEventListener("load", () => {
    document.getElementById("altcha_checkbox").click();
    document.getElementById("enterGame").innerText = "Generating Token";
    const e = document.getElementById("script-altcha");
    e == null || e.addEventListener("statechange", U0)
});

function j0() {
    jh.onclick = X.checkTrusted(function() {
        jh.classList.contains("disabled") || F0("Connecting..."), nh() ? Um() : Z1()
    }), X.hookTouchEvents(jh), Hh && (Hh.onclick = X.checkTrusted(function() {}), X.hookTouchEvents(Hh)), Wh && (Wh.onclick = X.checkTrusted(function() {
        setTimeout(function() {
            ih()
        }, 10)
    }), X.hookTouchEvents(Wh)), Qh.onclick = X.checkTrusted(function() {
        Vp()
    }), X.hookTouchEvents(Qh), zh.onclick = X.checkTrusted(function() {
        lp()
    }), X.hookTouchEvents(zh), Gh.onclick = X.checkTrusted(function() {
        Cp()
    }), X.hookTouchEvents(Gh), Kh.onclick = X.checkTrusted(function() {
        Qp()
    }), X.hookTouchEvents(Kh), v0.onclick = X.checkTrusted(function(e) {
        console.log(e);
        const t = v0.getBoundingClientRect();
        const n = e.clientX - t.left;
        const i = e.clientY - t.top;
        let s = 14400 / t.width;
        const o = n * s;
        const r = i * s;
        si?.updateChat(`goto ${o} ${r}`, z?.sid);
        si?.updateChat("path", z?.sid);
        Fm()
    }), X.hookTouchEvents(v0)
}
let H0;
const W0 = {
    view: () => {
        if (!G1.servers) return;
        let t = 0;
        const e = Object.keys(G1.servers).map(a => {
            const l = G1.regionInfo[a].name;
            let c = 0;
            const e = G1.servers[a].map(e => {
                var t;
                c += e.playerCount;
                const n = e.selected;
                let i = l + " " + e.name + " [" + Math.min(e.playerCount, 50) + "/" + 50 + "]";
                const s = e.name,
                      o = n ? "selected" : "";
                e.ping && ((t = e.pings) == null ? void 0 : t.length) >= 2 ? i += ` [${Math.floor(e.ping)}ms]` : n || (i += " [?]");
                let r = {
                    value: a + ":" + s
                };
                return o && (H0 = a + ":" + s, r.selected = !0), qd("option", r, i)
            });
            return t += c, [qd("option[disabled]", `${l} - ${c} players`), e, qd("option[disabled]")]
        });
        return qd("select", {
            value: H0,
            onfocus: () => {
                window.blockRedraw = !0
            },
            onblur: () => {
                window.blockRedraw = !1
            },
            onchange: X0
        }, [e, qd("option[disabled]", `All Servers - ${t} players`)])
    }
};
qd.mount(Jh, W0);
var Q0, Y0;
location.hostname == "sandbox.moomoo.io" ? (Q0 = "Back to MooMoo", Y0 = "//moomoo.io/") : (Q0 = "Try the sandbox", Y0 = "//sandbox.moomoo.io/");
document.getElementById("altServer").innerHTML = "<a href='" + Y0 + "'>" + Q0 + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>";
const z0 = `${j1}/servers?v=1.26`,
      G0 = async () => fetch(z0).then(e => e.json()).then(async e => G1.processServers(e))["catch"](e => {
          console.error("Failed to load server data with status code:", e)
      }), K0 = () => G0().then(_0)["catch"](e => {
          console.error("Failed to load.")
      });
window.frvrSdkInitPromise.then(() => window.FRVR.bootstrapper.complete()).then(() => K0());
const X0 = e => {
    if (window.blockRedraw = !1, FRVR.channelCharacteristics.allowNavigation) {
        const [t, n] = e.target.value.split(":");
        G1.switchServer(t, n)
    } else q1 && (q1 = !1, $1 = !1, eh = !0, Wm = !0, T.close())
};
document.getElementById("pre-content-container");

function J0() {}
window.showPreAd = J0;

function q0(t, e, n) {
    if (z && t) {
        if (X.removeAllChildren(h0), h0.classList.add("visible"), X.generateElement({
            id: "itemInfoName",
            text: X.capitalizeFirst(t.name),
            parent: h0
        }), X.generateElement({
            id: "itemInfoDesc",
            text: t.desc,
            parent: h0
        }), !n)
            if (e) X.generateElement({
                "class": "itemInfoReq",
                text: t.type ? "secondary" : "primary",
                parent: h0
            });
            else {
                for (let e = 0; e < t.req.length; e += 2) X.generateElement({
                    "class": "itemInfoReq",
                    html: t.req[e] + "<span class='itemInfoReqVal'> x" + t.req[e + 1] + "</span>",
                    parent: h0
                });
                const i = _1 ? t.group.sandboxLimit || Math.max(t.group.limit * 3, 99) : t.group.limit;
                t.group.limit && X.generateElement({
                    "class": "itemInfoLmt",
                    text: (z.itemCounts[t.group.id] || 0) + "/" + i,
                    parent: h0
                })
            }
    } else h0.classList.remove("visible")
}
let $0 = [],
    Z0 = [];

function ep(e, t) {
    $0.push({
        sid: e,
        name: t
    }), b(`${t}[${e}] requested to join ${z.team}`, "", "blue", false, true);
    tp()
}
async function tp() {
    if ($0[0]) {
        var e = $0[0];
        var t = Ei.includes(e.sid) ? "#53a7db" : "#FFFFFF";
        X.removeAllChildren(T0);
        T0.style.display = "block";
        if (!(Ei.includes(e.sid) && gy("auto accept bots")?.checked) && true === false) {
            var n = X.generateElement({
                "class": "notificationText",
                parent: T0
            });
            n.textContent = e.name + ` [${e.sid}]`;
            n.style.color = t;
            X.generateElement({
                "class": "notifButton",
                html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
                parent: T0,
                onclick: function() {
                    up(0)
                },
                hookTouch: !0
            }), X.generateElement({
                "class": "notifButton",
                html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
                parent: T0,
                onclick: function() {
                    up(1)
                },
                hookTouch: !0
            })
        }
    } else T0.style.display = "none"
}
var np = 0;
async function ip(t, e) {
    np === 0 && (np = v);
    await A4();
    await A4();
    if (v - np <= 5) return;
    for (let e = 0; e < $0.length; e++) {
        if ($0[e].sid === t) {
            T.send("P", t, 1);
            $0.splice(e, 1);
            break;
            return
        }
    }
}

function sp(e) {
    vh.push(e), x0.style.display == "block" && dp()
}

function op(e, t) {
    z && (z.team = e, z.isOwner = t, x0.style.display == "block" && dp());
    if (e == undefined && t == undefined || e == null && t == false) {
        py = [];
        if (si?.goal?.pathing) {
            kh.forEach(e => {
                if (e.dmg && !te(e?.owner?.sid)) {
                    e.pathScale = e.scale + 47
                }
                if (e.name == "pit trap" && !te(e?.owner?.sid)) {
                    e.pathScale = e.scale + 38
                }
            });
            ri?.setBuildings(kh)
        }
    }
}

function rp(e) {
    Z0 = e, x0.style.display == "block" && dp();
    py = e;
    if (si?.goal?.pathing) {
        kh.forEach(e => {
            if (e.dmg && !te(e?.owner?.sid)) {
                e.pathScale = e.scale + 50
            }
            if (e.name == "pit trap" && !te(e?.owner?.sid)) {
                e.pathScale = e.scale + 40
            }
        });
        ri?.setBuildings(kh)
    }
}

function ap(t) {
    np = 0;
    for (let e = vh.length - 1; e >= 0; e--) vh[e].sid == t && vh.splice(e, 1);
    x0.style.display == "block" && dp()
}

function lp() {
    Am(), x0.style.display != "block" ? dp() : cp()
}

function cp() {
    x0.style.display == "block" && (x0.style.display = "none")
}

function dp() {
    if (z && z.alive) {
        if (Jp(), S0.style.display = "none", x0.style.display = "block", X.removeAllChildren(w0), z.team)
            for (var e = 0; e < Z0.length; e += 2)(function(e) {
                const t = X.generateElement({
                    "class": "allianceItem",
                    style: "color:" + (Z0[e] == z.sid ? "#fff" : Ei.includes(Z0[e]) ? "#53a7db" : "rgba(255,255,255,0.6)"),
                    text: Z0[e + 1] + ` [${Z0[e]}]`,
                    parent: w0
                });
                z.isOwner && Z0[e] != z.sid && X.generateElement({
                    "class": "joinAlBtn",
                    text: "Kick",
                    onclick: function() {
                        fp(Z0[e])
                    },
                    hookTouch: !0,
                    parent: t
                })
            })(e);
        else if (vh.length)
            for (var e = 0; e < vh.length; ++e)(function(e) {
                const t = X.generateElement({
                    "class": "allianceItem",
                    style: "color:" + (vh[e].sid == z.team ? "#fff" : "rgba(255,255,255,0.6)"),
                    text: vh[e].sid,
                    parent: w0
                });
                X.generateElement({
                    "class": "joinAlBtn",
                    text: "Join",
                    onclick: function() {
                        hp(e)
                    },
                    hookTouch: !0,
                    parent: t
                })
            })(e);
        else X.generateElement({
            "class": "allianceItem",
            text: "No Tribes Yet",
            parent: w0
        });
        X.removeAllChildren(b0), z.team ? X.generateElement({
            "class": "allianceButtonM",
            style: "width: 360px",
            text: z.isOwner ? "Delete Tribe" : "Leave Tribe",
            onclick: function() {
                mp()
            },
            hookTouch: !0,
            parent: b0
        }) : (X.generateElement({
            tag: "input",
            type: "text",
            id: "allianceInput",
            maxLength: 7,
            placeholder: "unique name",
            onchange: e => {
                e.target.value = (e.target.value || "").slice(0, 7)
            },
            onkeypress: e => {
                if (e.key === "Enter") return e.preventDefault(), pp(), !1
            },
            parent: b0
        }), X.generateElement({
            tag: "div",
            "class": "allianceButtonM",
            style: "width: 140px;",
            text: "Create",
            onclick: function() {
                pp()
            },
            hookTouch: !0,
            parent: b0
        }))
    }
}

function up(e) {
    np === 0 && (np = v);
    T.send("P", $0[0].sid, e), $0.splice(0, 1);
    tp()
}

function fp(e) {
    T.send("Q", e)
}

function hp(e) {
    T.send("b", vh[e].sid)
}

function pp(e = document.getElementById("allianceInput").value) {
    np = 0;
    T.send("L", e == "" ? String.fromCharCode(0) : e)
}

function mp() {
    np = 0;
    $0 = [], tp(), T.send("N")
}
let gp, yp, xp;
const wp = [];
let bp;

function vp() {
    this.init = function(e, t) {
        this.scale = 0, this.x = e, this.y = t, this.active = !0
    }, this.update = function(e, t) {
        this.active && (this.scale += .05 * t, this.scale >= K.mapPingScale ? this.active = !1 : (e.globalAlpha = 1 - oe(0, this.scale / K.mapPingScale), e.beginPath(), e.arc(this.x / K.mapScale * v0.width, this.y / K.mapScale * v0.width, this.scale, 0, ae), e.stroke()))
    }
}

function kp(e, t) {
    for (let e = 0; e < wp.length; ++e)
        if (!wp[e].active) {
            bp = wp[e];
            break
        } bp || (bp = new vp, wp.push(bp)), bp.init(e, t)
}

function Ap() {
    xp || (xp = {}), xp.x = z.x, xp.y = z.y
}

function Ip(e) {
    yp = e
}

function Sp(e) {
    if (z && z.alive) {
        I0.clearRect(0, 0, v0.width, v0.height), I0.strokeStyle = "#fff", I0.lineWidth = 4;
        if (Yt.length && Tt) {
            Yt.forEach(t => {
                let n = $n.find(e => e.name == t.name)?.url;
                if (n) {
                    I0.globalAlpha = 1;
                    let e = new Image;
                    e.src = n;
                    I0.drawImage(e, t.x / K.mapScale * v0.width - 32 / 2, t.y / K.mapScale * v0.height - 32 / 2, 32, 32)
                }
            })
        }
        I0.strokeStyle = "#fff", I0.lineWidth = 1;
        for (var t = 0; t < wp.length; ++t) bp = wp[t], bp.update(I0, e);
        if (I0.globalAlpha = 1, I0.fillStyle = "#fff", k(z.x / K.mapScale * v0.width, z.y / K.mapScale * v0.height, 7, I0, !0), z.team && yp)
            for (var t = 0; t < yp.length;) {
                I0.fillStyle = "rgba(255,255,255,0.35)";
                k(yp[t] / K.mapScale * v0.width, yp[t + 1] / K.mapScale * v0.height, 7, I0, !0), t += 2;
                gp && (I0.fillStyle = "#fc5553", I0.font = "34px Lilita One", I0.textBaseline = "middle", I0.textAlign = "center", I0.fillText("x", gp.x / K.mapScale * v0.width, gp.y / K.mapScale * v0.height)), xp && (I0.fillStyle = "#fff", I0.font = "34px Lilita One", I0.textBaseline = "middle", I0.textAlign = "center", I0.fillText("x", xp.x / K.mapScale * v0.width, xp.y / K.mapScale * v0.height))
            }
        si?.drawWaypointMap(I0, v0);
        ie.forEach(e => {
            if (e.enemies.length) {
                e.enemies.forEach(e => {
                    I0.fillStyle = "red";
                    I0.globalAlpha = 1;
                    k(e.x / K.mapScale * v0.width, e.y / K.mapScale * v0.height, 5, I0, !0)
                })
            }
        });
        if (Gn && zn.length) {
            for (let e = 0; e < zn.length; e++) {
                I0.globalAlpha = 1;
                I0.fillStyle = "#000000";
                k(zn[e].x2 / K.mapScale * v0.width, zn[e].y2 / K.mapScale * v0.height, 8, I0, !0)
            }
        }
        if (G["do"] && ie.length && ie[G.val]?.HERE) {
            I0.globalAlpha = 1;
            I0.fillStyle = "#000000";
            k(ie[G.val].x2 / K.mapScale * v0.width, ie[G.val].y2 / K.mapScale * v0.height, 8, I0, !0)
        }
        ht.forEach((t, e, n) => {
            let i = t?.sid ? Hg(t.sid) : t?.name ? J.find(e => e.name === t.name) : false;
            if (i?.visible) {
                i.color = t.color;
                i.spotted = true;
                n[e] = i
            }
            let s = wy(t);
            if (s) {
                s.color = t.color;
                let e = i && i.visible ? i : s;
                I0.fillStyle = e.color;
                I0.globalAlpha = 1;
                k(e.x / K.mapScale * v0.width, e.y / K.mapScale * v0.height, 9, I0, true)
            } else {
                t.spotted = false
            }
        })
    }
}
let Ep = 0;

function Tp(e) {
    Ep != e && (Ep = e, Pp())
}

function Cp() {
    S0.style.display != "block" ? (S0.style.display = "block", x0.style.display = "none", Jp(), Pp()) : Bp()
}

function Bp() {
    S0.style.display == "block" && (S0.style.display = "none", q0())
}

function Dp(e, t, n) {
    n ? e ? (z.tailIndex = t, Zt = t) : z.tails[t] = 1 : e ? (z.skinIndex = t, $t = t) : z.skins[t] = 1;
    S0.style.display == "block" && Pp();
    if (e == 0 && t != 0) {
        if (n == 0) Nn.push(t);
        if (n == 1) On.push(t);
        if (Fn.length && (n == 0 || n == 1)) {
            for (let e = 0; e < Fn.length; e++) {
                if (n == 0 && !Array.isArray(Fn[e]) && Fn[e] == t) {
                    Fn.splice(e, 1)
                }
                if (n == 1 && Array.isArray(Fn[e]) && Fn[e][0] == t) {
                    Fn.splice(e, 1)
                }
            }
            if ([40, 12, 22, 6, 7, 56, 53, 15, 31].includes(t) && !Gt.includes(t) && n == 0) Gt.push(t);
            if ([11, 19].includes(t) && !Kt.includes(t) && n == 1) Kt.push(t)
        }
    }
}

function Pp() {
    if (z) {
        X.removeAllChildren(E0);
        const r = Ep,
              a = r ? B0 : C0;
        for (let e = 0; e < a.length; ++e) a[e].dontSell || function(e) {
            const t = X.generateElement({
                id: "storeDisplay" + e,
                "class": "storeItem",
                onmouseout: q0(),
                onmouseover: () => q0(a[e], !1, !0),
                parent: E0
            });
            X.hookTouchEvents(t, !0);
            const n = "./img/" + (r ? "accessories/access_" : "hats/hat_") + a[e].id + (a[e].topSprite ? "_p" : "") + ".png";
            const i = X.generateElement({
                tag: "img",
                "class": "hatPreview smallImage",
                src: n,
                parent: t
            });
            const s = X.generateElement({
                tag: "span",
                style: "font-size: 85%; vertical-align: middle; line-height: 1.2;",
                text: `[${a[e].id}] ${a[e].name}`,
                parent: t
            });
            if (r ? !z.tails[a[e].id] : !z.skins[a[e].id]) {
                X.generateElement({
                    "class": "joinAlBtn",
                    style: "margin-top: 5px; font-size: 85%; vertical-align: middle; line-height: 1.51;",
                    text: "Buy",
                    onclick: () => Mp(a[e].id, r),
                    hookTouch: !0,
                    parent: t
                });
                X.generateElement({
                    tag: "span",
                    "class": "itemPrice",
                    style: "font-size: 85%; vertical-align: middle; line-height: 1.51;",
                    text: a[e].price / 1e3 >= 1 ? a[e].price / 1e3 + "k" : a[e].price,
                    parent: t
                })
            } else {
                const o = (r ? z.tailIndex : z.skinIndex) == a[e].id ? "Unequip" : "Equip";
                X.generateElement({
                    "class": "joinAlBtn",
                    style: "margin-top: 5px; font-size: 85%; vertical-align: middle; line-height: 1.51;",
                    text: o,
                    onclick: () => o == "Unequip" ? Rp(0, r) : Rp(a[e].id, r),
                    hookTouch: !0,
                    parent: t
                })
            }
        }(e)
    }
}

function Rp(e, t) {
    T.send("c", 0, e, t)
}

function Mp(e, t) {
    T.send("c", 1, e, t)
}

function Np() {
    S0.style.display = "none", x0.style.display = "none", Jp()
}

function Op() {
    const e = ch("native_resolution");
    Fp(e ? e == "true" : typeof cordova < "u"), hh = "true";
    Zh.hidden = false;
    ch("moo_moosic"), setInterval(function() {
        window.cordova && (document.getElementById("downloadButtonContainer").classList.add("cordova"), document.getElementById("mobileDownloadButtonContainer").classList.add("cordova"))
    }, 1e3), Up(), X.removeAllChildren(o0);
    for (var t = 0; t < x.weapons.length + x.list.length; ++t)(function(e) {
        X.generateElement({
            id: "actionBarItem" + e,
            "class": "actionBarItem",
            style: "display:none",
            onmouseout: function() {
                q0()
            },
            parent: o0
        })
    })(t);
    for (var t = 0; t < x.list.length + x.weapons.length; ++t)(function(n) {
        const i = document.createElement("canvas");
        i.width = i.height = 66;
        const s = i.getContext("2d");
        if (s.translate(i.width / 2, i.height / 2), s.imageSmoothingEnabled = !1, s.webkitImageSmoothingEnabled = !1, s.mozImageSmoothingEnabled = !1, x.weapons[n]) {
            s.rotate(Math.PI / 4 + Math.PI);
            var e = new Image;
            N2[x.weapons[n].src] = e, e.onload = function() {
                this.isLoaded = !0;
                const e = 1 / (this.height / this.width),
                      t = x.weapons[n].iPad || 1;
                s.drawImage(this, -(i.width * t * K.iconPad * e) / 2, -(i.height * t * K.iconPad) / 2, i.width * t * e * K.iconPad, i.height * t * K.iconPad), s.fillStyle = "rgba(0, 0, 70, 0.1)", s.globalCompositeOperation = "source-atop", s.fillRect(-i.width / 2, -i.height / 2, i.width, i.height), document.getElementById("actionBarItem" + n).style.backgroundImage = "url(" + i.toDataURL() + ")"
            }, e.src = "./img/weapons/" + x.weapons[n].src + ".png";
            var t = document.getElementById("actionBarItem" + n);
            t.onmouseover = X.checkTrusted(function() {
                q0(x.weapons[n], !0)
            }), t.onclick = X.checkTrusted(function() {
                Vm(n, !0)
            }), X.hookTouchEvents(t)
        } else {
            var e = j2(x.list[n - x.weapons.length], !0, true);
            const o = Math.min(i.width - K.iconPadding, e.width);
            s.globalAlpha = 1, s.drawImage(e, -o / 2, -o / 2, o, o), s.fillStyle = "rgba(0, 0, 70, 0.1)", s.globalCompositeOperation = "source-atop", s.fillRect(-o / 2, -o / 2, o, o), document.getElementById("actionBarItem" + n).style.backgroundImage = "url(" + i.toDataURL() + ")";
            var t = document.getElementById("actionBarItem" + n);
            t.onmouseover = X.checkTrusted(function() {
                q0(x.list[n - x.weapons.length])
            }), t.onclick = X.checkTrusted(function() {
                Vm(n - x.weapons.length)
            }), X.hookTouchEvents(t)
        }
    })(t);
    f0.onchange = e => {
        e.target.value = (e.target.value || "").slice(0, 15)
    }, f0.onkeypress = e => {
        if (e.key === "Enter") return e.preventDefault(), jh.onclick(e), !1
    }, qh.checked = fh, qh.onchange = X.checkTrusted(function(e) {
        Fp(e.target.checked)
    }), $h.checked = true;
    $h.onchange = X.checkTrusted(function(e) {
        hh = "true";
        Zh.hidden = true
    })
}

function Lp(e, t) {
    e && (t ? z.weapons = e : z.items = e);
    for (var n = 0; n < x.list.length; ++n) {
        const i = x.weapons.length + n;
        document.getElementById("actionBarItem" + i).style.display = z.items.indexOf(x.list[n].id) >= 0 ? "inline-block" : "none"
    }
    for (var n = 0; n < x.weapons.length; ++n) document.getElementById("actionBarItem" + n).style.display = z.weapons[x.weapons[n].type] == x.weapons[n].id ? "inline-block" : "none"
}

function Fp(e) {
    fh = e, ph = e && window.devicePixelRatio || 2, qh.checked = e, lh("native_resolution", e.toString()), sm()
}

function _p() {
    am ? n0.classList.add("touch") : n0.classList.remove("touch")
}

function Vp() {
    n0.classList.contains("showing") ? (n0.classList.remove("showing"), Yh.innerText = "Settings") : (n0.classList.add("showing"), Yh.innerText = "Close")
}

function Up() {
    let t = "";
    for (let e = 0; e < K.skinColors.length; ++e) e == Nh ? t += "<div class='skinColorItem activeSkin' style='background-color:" + K.skinColors[e] + "' onclick='selectSkinColor(" + e + ")'></div>" : t += "<div class='skinColorItem' style='background-color:" + K.skinColors[e] + "' onclick='selectSkinColor(" + e + ")'></div>";
    A0.innerHTML = t
}

function jp(e) {
    Nh = e, Up()
}
const Hp = document.getElementById("chatBox"),
      Wp = document.getElementById("chatHolder");

function Qp() {
    if (document.activeElement === we) return;
    am ? Xp(prompt("chat message")) : Wp.style.display == "block" ? (Hp.value && Xp(Hp.value), Jp()) : (S0.style.display = "none", x0.style.display = "none", Wp.style.display = "block", Hp.focus(), Am()), Hp.value = ""
}

function Yp(i, s, o, e = 1, t) {
    if (Ci.length + e >= 1500) {
        b(`Error amount exceeds player render capacity rate`, "", "#5c0620", false, true);
        return false
    }
    let r = i;
    i = Ci.find(e => e.purpose == "formation" && e.sid == i);
    console.log(Ci);
    if (!i) {
        b(`Error ID: ${r} not found`, "", "#5c0620", false, true);
        return false
    }
    for (let n = 0; n < e; n++) {
        let e = P3(i.x2, i.y2, Z(s) - Z(90), o * (n + 1));
        let t = {
            ...z
        };
        t.sid = Vi.length + 1;
        Vi.push({
            origin: r,
            distance: o * (n + 1),
            angle: s
        });
        x3(y3(t, e.x, e.y, 0, 0, 0), "formation")
    }
}

function zp() {
    b(`Pathfinder commands ↓`, "", "#5c0620", false, true);
    b(`"setPF (search radius) (resolution)" to adjust Pathfinder`, "", "#5c0620", false, true);
    b(`</ * path`, "", "#5c0620", false, true);
    b(`* stop`, "", "#5c0620", false, true);
    b(`* goal`, "", "#5c0620", false, true);
    b(`* <goal/goto> x [Number: x position]`, "", "#5c0620", false, true);
    b(`* <goal/goto> y [Number: y position]`, "", "#5c0620", false, true);
    b(`* <goal/goto> [x: Number] [y: Number]`, "", "#5c0620", false, true);
    b(`* waypoint set [name: String]`, "", "#5c0620", false, true);
    b(`* waypoint del [name: String]`, "", "#5c0620", false, true);
    b(`* waypoint goto [name: String]`, "", "#5c0620", false, true);
    b(`* follow player <[ID/Name: Any]/all(default)>`, "", "#5c0620", false, true);
    b(`* follow animal <[ID/Name: Any]/all(default)>`, "", "#5c0620", false, true);
    b(`* wander />`, "", "#5c0620", false, true);
    b(`---------------------------------------------------`, "", "#5c0620", false, true);
    b(`Bot commands ↓`, "", "#5c0620", false, true);
    b(`dc bots "!dc (any | all | botID) if using "any" → (number of bots)"`, "", "#5c0620", false, true);
    b(`"!clear (radius) (all | team | clan | enemy | enemies) (all)"`, "", "#5c0620", false, true);
    b(`"!summon" to summon bots "!summon false" to wander`, "", "#5c0620", false, true);
    b(`scout bot (best when bots set to wander) → "!find (sid or -(name))"`, "", "#5c0620", false, true);
    b(`bots attack → "!attack (sid | don't fill for nearest enemy) " (coming soon)`, "", "#5c0620", false, true);
    b(`q = proj sync with bots`, "", "#5c0620", false, true);
    b(`!q instachat (chatInput) [sets q sync chat]`, "", "#5c0620", false, true);
    b(`!target (id) [sets target for q sync insta] | !target [none] | resets target to nearest enemy (default)`, "", "#5c0620", false, true);
    b(`spawn bots press 'y'`, "", "#5c0620", false, true);
    b(`!watch (botID) to spectate bot`, "", "#5c0620", false, true);
    b(`!play (botID) to play as bot`, "", "#5c0620", false, true);
    b(`v = spike macro f = trap macro n = triple mills`, "", "#5c0620", false, true);
    b(`zoom = hold q and use mouse wheel`, "", "#5c0620", false, true);
    b(`p = reset camera zoom`, "", "#5c0620", false, true)
}

function Gp(t = 400) {
    let n = "";
    for (let e = 0; e < t; e++) {
        n += t
    }
    return n
}

function Kp(e) {
    if (e === "debug") {
        console.log("debugged");
        p = false;
        hn = false;
        $t = null;
        Zt = null;
        return true
    }
}
document.addEventListener("keydown", function(e) {
    if (e.key === "m") {
        Kp("debug")
    }
});

function Xp(n, e) {
    let t = function(e) {
        return n.toLowerCase().startsWith("!" + e.toLowerCase())
    };
    const s = n.split(" ");
    if (t("radius")) {
        const r = parseFloat(s[1]);
        if (!isNaN(r)) {
            s3 = r;
            b(`move circle radius set at ${r}`, "", Hy(), false, true);
            return true
        }
    } else if (t("speed")) {
        const r = parseFloat(s[1]);
        if (!isNaN(r)) {
            i3 = r;
            b(`move circle speed set at ${r}`, "", Hy(), false, true);
            return true
        }
    }
    if (t("botCount") || t("bc")) {
        b(`bot count is ${ie.length}`, "", Hy(), false, true);
        return true
    }
    if (t("kys")) {
        const r = parseFloat(s[1]);
        if (s[1] == ".all") {
            ie.forEach(e => {
                e.kys = !e.kys
            });
            return true
        } else if (!isNaN(r)) {
            let t = s[1].split(",").map(e => parseFloat(e.trim()));
            ie.forEach(e => {
                t.includes(e.sid) && (e.kys = !e.kys)
            });
            return true
        }
    }
    if (t("chat")) {
        const r = parseFloat(s[1]);
        if (!isNaN(r)) {
            for (let e = 0; e < r; e++) {
                xe.removeChild(xe.children[0])
            }
            return
        }
    }
    if (t("botMsg")) {
        if (s[1] == "?player") {
            let e = parseFloat(s[2]);
            if (isNaN(e)) {
                b(`${e} is NaN`, "", "red", false, true);
                return true
            }
            let t = Hg(e);
            if (!t) {
                b(`player [${e}] is NaN`, "", "red", false, true);
                return true
            } else {
                Rs.value = t.chatMessage;
                b(`botMsg copied chat ${t.name}[${t.sid}] "${s[1]}"`, "", "red", false, true);
                return true
            }
        }
        Rs.value = s[1];
        b(`botMsg is ${s[1]}`, "", "red", false, true);
        return true
    }
    if (t("logmsgs")) {
        Pi = !Pi;
        b(`logging messages is ${Pi}`, "", "red", false, true);
        return true
    }
    if (t("hitlist")) {
        let i = false;
        for (let n = 0; n < ht.length; n++) {
            let t = ht[n];
            if (t.name || t.sid) {
                i = true;
                let e = t?.sid && t?.name ? `${t.name}[${t.sid}]` : t.name ? `${t.name}` : `${t.sid}`;
                b(`${n+1}. ${e}`, "", t.color, false, true)
            }
        }
        if (i) return true
    }
    if (t("start")) {
        e5()
    }
    if (t("botdist")) {
        let e = parseFloat(s[1]);
        if (!isNaN(e)) {
            ki = e;
            b(`bot distance set to ${e}`, "", Hy(), false, true);
            return true
        }
    }
    if (t("origin")) {
        Ci = Ci.filter(e => e?.purpose != "formation");
        Vi = [];
        _i.x = z.x2;
        _i.y = z.y2;
        let e = {
            ...z
        };
        e.sid = 1;
        Vi.push(e);
        x3(y3(e, z.x2, z.y2, 0, 0, 0), "formation");
        return true
    }
    if (t("changeBot")) {
        if (s.length !== 4) {
            b("Error: 3 parameters required (ID/all, property, value)", "", "red", false, true);
            return true
        }
        console.log(s);
        let t = s[1] === "all" ? "all" : parseFloat(s[1]);
        let n = isNaN(parseFloat(s[3])) ? s[3] === "true" || s[3] === "false" ? E(s[3]) : s[3] : parseFloat(s[3]);
        if (isNaN(t) && t !== "all") {
            return b("Error: 1st parameter invalid (all / ID)", "", "red", false, true)
        }
        if (s[2] === "dir" || s[2] === "d2" || s[2] === "d1") n = Z(n) - Z(90);
        Ci.forEach(e => {
            if (e.purpose === "formation" && (t === "all" || e.sid === t)) {
                e[s[2]] = n;
                b(`Fake ID: [${e.sid}] changed ${s[2]} to ${n}`, "", "red", false, true)
            }
        });
        return true
    }
    if (t("createFrom")) {
        if (!_i.x && !_i.y) {
            b("Error create an origin point first", "", "red", false, true)
        }
        let e = [parseFloat(s[1]), parseFloat(s[2]), parseFloat(s[3]), parseFloat(s[4])];
        for (let t = 0; t < 4; t++) {
            if (isNaN(e[t])) {
                let e;
                switch (t) {
                    case 0:
                        e = "Error first parameter (creation point) is NaN";
                        break;
                    case 1:
                        e = "Error second parameter (angle - degrees) is NaN";
                        break;
                    case 2:
                        e = "Error third parameter (distance) is NaN";
                        break
                }
                b(e, "", "red", false, true);
                return true
            }
        }
        Yp(e[0], e[1], e[2], e[3] || 1);
        return true
    }
    if (t("savePos") && _i.x) {}
    if (t("delay")) {
        let e = parseFloat(s[1]);
        if (!isNaN(e)) {
            Mi = e;
            b(`preplace delay set to ${e}`, "", Hy(), false, true);
            return true
        }
    }
    if (t("pdelay")) {
        let e = parseFloat(s[1]);
        if (!isNaN(e)) {
            Bi = e * 111;
            b(`preplace in advance delay set to ${e*111}`, "", Hy(), false, true);
            return true
        }
    }
    if (t("kick")) {
        let n = parseFloat(s[1]);
        if (!isNaN(n) && te(n)) {
            fp(n);
            let e = Hg(n);
            let t = e ? `kicked player: ${e.name}[${e.sid}]` : `kicked ID: [${n}]`;
            b(t, "", Hy(), false, true);
            return true
        } else {
            let e = isNaN(n) ? `Syntax Error: input value is not a number => !kick (teammate SID)` : `ID: ${n} is not in the clan`;
            b(e, "", Hy(), false, true);
            return true
        }
    }
if (t("repeater crossbow") && ie.length) {
    let n = parseFloat(s[1]);
    if (!isNaN(n)) {
        let e = ie.find(e => e.sid == n);
        if (!e) {
            b(`cannot set properties of bot undefined`, "", "red", false, true);
            return;
        }
        e.getCrossBow = !e.getCrossBow;
        b(`${e.name}[${n}] crossbow set to ${e.getCrossBow}`, "", Hy(), false, true);
        return true;
    }
    if (s[1] === "all") {
        let t = s[2] === "true" || s[2] === "false" ? E(s[2]) : !isNaN(parseFloat(s[2])) ? parseFloat(s[2]) : null;
        ie.forEach(e => {
            e.getCrossBow = t !== null ? t : !e.getCrossBow;
            b(`${e.name}[${n}] crossbow set to ${e.getCrossBow}`, "", Hy(), false, true);
        });
        return true;
    }
    b(`error in setting bot loadout`, "", "red", false, true);
}

    if (t("apd")) {
        let e = parseFloat(s[1]);
        if (!isNaN(e)) {
            yi = e;
            b(`autoplace distance set to ${e}`, "", Hy(), false, true);
            return true
        }
    }
    if (t("botinfo")) {
        let t = parseFloat(s[1]);
        let e = ie.find(e => e.sid == t);
        if (!e) {
            b(`bot ID: ${t} not found`, "red", false, true);
            return true
        }
        if (!isNaN(t)) {
            console.log(e);
            return true
        }
    }
    if (t("watch") && ie.length) {
        let t = parseFloat(s[1]);
        let n = ie.find(e => e.sid == t);
        if (n) {
            let e = ie.findIndex(e => e.sid === n.sid);
            G = {
                "do": true,
                val: e,
                play: false
            };
            b(`watching Bot ID: ${t}`, "", Hy(), false, true);
            return
        } else {
            b(`Bot ID: ${s[1]} not found`, "", Hy(), false, true)
        }
    }
    if (n === "!play" && G["do"]) {
        G.play = true;
        b(`playing as Bot: ${ts?.bot?.name}[${ts.bot?.sid}]`, "", Hy(), false, true);
        return
    } else if (t("play") && ie.length) {
        let i = [parseFloat(s[1]), parseFloat(s[2])];
        if (!isNaN(i[0])) {
            let e = ie.findIndex(e => e.sid === i[0]);
            let t = ie.find(e => e.sid === i[0]);
            if (!t) {
                b(`Bot ID: ${s[1]} not found`, "", Hy(), false, true);
                return
            }
            G = {
                "do": true,
                val: e,
                play: true
            };
            let n = t.findPlayer(t.sid);
            b(`playing as Bot: ${n.name}[${n.sid}]`, "", Hy(), false, true);
            return
        } else {
            b(`Bot ID: ${s[1]} not found`, "", Hy(), false, true);
            return
        }
    }
    if (t("target")) {
        let e = parseFloat(s[1]);
        xi.ID = e;
        let t = isNaN(e) ? "target ID has been reset" : `projectile sync target set to ID: ${e}`;
        b(t, "", Hy(), false, true);
        return true
    }
    if (t("instachat")) {
        let e = s.slice(1).join(" ");
        bi = e;
        b(`Q sync insta chat set to ${e}`, "", Hy(), false, true);
        return true
    }
    if (t("botName")) {
        let e = s.slice(1).join(" ");
        _e = e;
        b(`bot name set to ${e}`, "", Hy(), false, true);
        return true
    }
    if (t("skip")) {
        if (qx !== null) {
            qx.pause();
            qx = null;
            return true
        }
    }
    if (t("syncChat")) {
        let e = s.slice(1).join(" ");
        vi = e;
        b(`syncChat name set to ${e}`, "", Hy(), false, true);
        return true
    }
    if (t("sDist")) {
        let e = parseFloat(s[1]);
        if (!isNaN(e)) {
            li = e;
            b(`soldier distance set to ${e}`, "", Hy(), false, true);
            return true
        }
    }
    if (s[1] === ".clan") {}
    if (t("accept")) {
        let n = parseFloat(s[1]);
        T.send("P", n, 1);
        for (let t = 0; t < $0.length; t++) {
            let e = $0[t];
            if (e.sid === n) {
                b(`accepted request ${e.name}[${e.sid}]`, "", "#32CD32");
                $0.slice(t, 1)
            }
        }
        return true
    }
    if (t("decline")) {
        let n = parseFloat(s[1]);
        T.send("P", n, 0);
        for (let t = 0; t < $0.length; t++) {
            let e = $0[t];
            if (e.sid === n) {
                b(`declined request ${e.name}[${e.sid}]`, "", "#FF7F7F");
                $0.slice(t, 1)
            }
        }
        return true
    }
    if (t("kick")) {
        let n = parseFloat(s[1]);
        fp(n);
        for (let t = 0; t < py.length; t++) {
            let e = py[t];
            if (e.sid === n) {
                b(`kicked request ${e.name}[${e.sid}]`, "", "#FF7F7F");
                $0.slice(t, 1)
            }
        }
        return true
    }
    if (t("autodecline")) {
        let e = parseFloat(s[1]);
        if (!isNaN(e)) An.push(e)
    }
    if (t("clanreq")) {
        for (let t = 0; t < $0.length; t++) {
            let e = $0[t];
            if (t === 0) b(`clan requests`, "", "blue", false, true);
            b(`${t}. ${e.name}[${e.sid}]`, "", "blue", false, true)
        }
        return true
    }
    if (t("clanreset")) {
        for (let e = 0; e < $0.length; e++) {
            T.send("P", $0[e].sid, 0)
        }
        return true
    }
    if (t("search")) {
        let e = parseFloat(s[1]);
        let n = Hg(e);
        if (n) {
            let t = [`Deaths: ${n.deaths}`, n.noAnti ? `Leaks shame at: ${n.noAnti}` : `Could not find information about shame from heal tracking`];
            b(`Information found for ${n.name} [${n.sid}]`, "", "#f2e9d3", false, true);
            for (let e = 0; e < t.length; e++) {
                b(`${t[e]}`, "", "#f2e9d3", false, true)
            }
        } else {
            b(`Could not find player.`, "", "#f2e9d3", false, true)
        }
        return true
    }
    if (t("lookup")) {
        if (vh.length) {
            b(`Clans found: ${vh.length}`, "", "#baab99", false, true);
            for (var i = 0; i < vh.length; ++i) {
                let e = Hg(vh[i].owner);
                if (e) {
                    b(`Clan ${vh[i].sid} ${e.name} [${vh[i].owner}]`, "", "#f2e9d3", false, true)
                } else {
                    b(`Clan: ${vh[i].sid} [${vh[i].owner}]`, "", "#f2e9d3", false, true)
                }
            }
        } else {
            b(`No clans found.`, "", "#FF7F7F", false, true)
        }
        return true
    }
    if (t("ping")) {
        if (Hn && en) {
            Ki.send(le({
                msg: "pinger",
                player: z,
                sender: z?.sid,
                doing: false,
                time: Date.now(),
                server: location.href
            }));
            Gn = 1e4;
            zn = []
        }
        return true
    }
    if (t("XP")) {
        b(`Primary: ${z.weaponXP[z.weapons[0]]}, Secondary: ${z.weaponXP[z.weapons[1]]}`, "", "#baab99", false, true);
        return true
    }
    if (t("mute")) {
        const r = [parseFloat(s[1]), parseFloat(s[2]), parseFloat(s[3])];
        if (!isNaN(r[0])) {
            Ii.push(r[0]);
            let e = Hg(r[0]);
            let t = e ? `${e.name}[${e.sid}]` : `ID: ${r[0]}`;
            b(`muted ${t}`, "", "red", false, true);
            return true
        }
        if (s[1] === ".clanval" && r[1]) {
            let t = Hg(r[1]);
            if (t && typeof t.team === "string") {
                J.forEach(e => {
                    if (e.team === t.team) {
                        Ii.push(e.sid);
                        b(`muted ${e.name}[${e.sid}] in clan ${t.team}`, "", "red", false, true)
                    }
                });
                return true
            }
        }
        b(`failed to mute parameter issue`, "", "red", false, true)
    }
    if (t("unmute")) {
        const r = [parseFloat(s[1]), parseFloat(s[2]), parseFloat(s[3])];
        if (!isNaN(r[0]) && Ii.includes(r[0])) {
            Ii = Ii.filter(e => e != r[0]);
            let e = Hg(r[0]);
            let t = e ? `${e.name}[${e.sid}]` : `ID: ${r[0]}`;
            b(`unmuted ${t}`, "", "green", false, true);
            return true
        }
        if (s[1] === ".clanval" && r[1]) {
            let n = Hg(r[1]);
            if (n && typeof n.team === "string") {
                for (let t = 0; t < Ii.length; t++) {
                    J.forEach(e => {
                        if (e.team === n.team && Ii[t] === e.sid) {
                            Ii.splice(t, 1);
                            b(`unmuted ${e.name}[${e.sid}] in clan ${n.team}`, "", "green", false, true)
                        }
                    })
                }
                return true
            }
        }
        b(`failed to unmute parameter issue`, "", "green", false, true)
    }
    if (t("find")) {
        var o;
        const r = [parseFloat(s[1]), parseFloat(s[2]), parseFloat(s[3])];
        if (s[1] === ".del") {
            let t;
            if (s[2] == "all") {
                ht = [];
                b(`hit list cleared`, "", Hy(), false, true);
                return true
            }
            if (!isNaN(r[1])) {
                t = ht.find(e => e.sid == r[1]);
                ht = ht.filter(e => e.sid != r[1]);
                let e = t ? `${t.name}[${t.sid}]` : `${t.name}`;
                b(`${e} has been removed from hit list`, "", t.color, false, true);
                return true
            }
        }
        if (!isNaN(r[0])) {
            o = Hg(r[0]);
            if (o) {
                if (!o.color) o.color = Hy(ht);
                o.spotted = o.visible ? true : false;
                ht.push(o);
                b(`${o?.name}[${o.sid}] was added to the hit list`, "", o.color, false, true);
                return true
            } else {
                o = {};
                o.sid = r[0];
                if (!o.color) o.color = Hy(ht);
                o.spotted = false;
                ht.push(o);
                b(`ID: ${o.sid} was added to the hit list`, "", o.color, false, true);
                return true
            }
        }
        if (isNaN(r[0]) && typeof s[1] === "string") {
            let t = n.split(".");
            o = J.find(e => e.name == t[1]);
            if (o) {
                if (!o.color) o.color = Hy(ht);
                ht.push(o);
                o.spotted = o.visible ? true : false;
                b(`${o.name}[${o.sid}] was added to the hit list`, "", o.color, false, true);
                return true
            } else {
                o = {};
                o.name = t[1];
                if (!o.color) o.color = Hy(ht);
                o.spotted = false;
                ht.push(o);
                b(`${o.name} was added to the hit list`, "", o.color, false, true);
                return true
            }
        }
    }
    if (n.startsWith("setPF")) {
        if (!isNaN(s[1]) || !isNaN(s[2])) {
            ri.size = parseInt(s[1]);
            ri.res = parseInt(s[2]);
            ri.initiateCanvas();
            si.pathfinder.size = parseInt(s[1]);
            si.pathfinder.res = parseInt(s[2]);
            si.pathfinder.initiateCanvas();
            if (si.goal.pathing) {
                si?.updateChat("stop", z?.sid);
                si?.updateChat("path", z?.sid);
                b(`Change Pathfinder | radius: ${s[1]} resolution: ${s[2]} `, "", Hy())
            }
            return true
        }
    }
    si?.updateChat(n.slice(0, 30), z?.sid);
    if (t("commands") || t("help")) {
        zp();
        return true
    }
    if (t("teamID")) {
        vt = parseFloat(s[1]);
        b(`sync ID set to ${vt}`, "", Hy(), false, true);
        return true
    }
    if (t("bMin")) {
        ci = parseFloat(s[1]);
        b(`bMin is ${ci}`, "", Hy(), false, true);
        return true
    }
    if (t("bMax")) {
        di = parseFloat(s[1]);
        b(`max one tick distance: ${di}`, "", Hy(), false, true);
        return true
    }
    if (t("set")) {
        fi = parseFloat(s[1]);
        hi = s[2];
        gi = s[3];
        if (Vt) {
            setTimeout(() => {
                Xp(`!clear ${fi} ${hi} ${gi}`)
            }, 500)
        }
        return true
    }
    if (t("summon")) {
        ai = "Summon";
        return true
    }
    if (t("wander")) {
        ai = "Wander";
        return true
    }
    if (t("Static")) {
        ai = "Static";
        return true
    }
    if (t("dc")) {
        const r = [parseFloat(s[1]), parseFloat(s[2])];
        if (s[1] == "any") {
            if (!isNaN(r[1])) {
                ie.slice(-r[1]).forEach(e => {
                    e.close()
                });
                return true
            }
        }
        if (s[1] == "all") {
            ie.forEach(e => e.close());
            return true
        }
        if (!isNaN(r[0])) {
            ie.forEach(e => e.sid == r[0] && e.close());
            return true
        }
    }
    if (t("clear")) {
        const r = parseFloat(s[1]);
        if (!isNaN(r)) {
            if (!ts?.bot) {
                Ft = {
                    x: z.x2,
                    y: z.y2,
                    scale: r
                };
                let n = s[2];
                !n ? n = x.sid : !isNaN(parseFloat(n)) ? n = parseFloat(n) : n = n;
                s[3] = s[3] + (s[4] !== undefined && s[4] !== null && typeof s[4] !== "number" ? s[4] : "");
                let i = s[3];
                Ut = {
                    x: z.x2,
                    y: z.y2,
                    types: i,
                    IDS: n,
                    value: r,
                    r: false
                };
                Vt = kh.filter(e => {
                    const t = se(z, e);
                    if (e.name == "pit trap") {
                        e.opacity = 1
                    } else e.opacity = 1;
                    if (t <= r && (i != "all" && (e.group?.name === "spikes" || e.name === "pit trap" || e?.name == "turret" && Zs.checked || e?.name == "teleporter" && Zs.checked) || i == "all" || e?.name == i || e?.group?.name == i) && (e.type === null || e.type === undefined)) {
                        if ((n == "team" || n == "clan" || n == "tribe") && te(e?.owner?.sid)) return true;
                        if ((n == "enemy" || n == "enemies" || n == "hostile" || n == "nEnemy") && !te(e?.owner?.sid)) return true;
                        if (typeof n === "number" && e?.owner?.sid === n) {
                            return true
                        }
                        if (n == "all" || n == "every" || n == "everything") return true;
                        if (!n && e?.owner?.sid === x.sid) return true
                    }
                    return false
                })
            } else {
                Ft = {
                    x: ts?.bot.x,
                    y: ts?.bot.y,
                    scale: r
                };
                let n = s[2];
                !n ? n = x.sid : !isNaN(parseFloat(n)) ? n = parseFloat(n) : n = n;
                s[3] = s[3] + (s[4] !== undefined && s[4] !== null && typeof s[4] !== "number" ? s[4] : "");
                let i = s[3];
                Ut = {
                    x: ts?.bot.x,
                    y: ts?.bot.y,
                    types: i,
                    IDS: n,
                    value: r,
                    r: false
                };
                Vt = ts.builds.filter(e => {
                    const t = se(ts.bot, e);
                    if (e.name == "pit trap") {
                        e.opacity = 1
                    } else e.opacity = 1;
                    if (t <= r && (i != "all" && (e.group?.name === "spikes" || e.name === "pit trap" || e?.name == "turret" && Zs.checked || e?.name == "teleporter" && Zs.checked) || i == "all" || e?.name == i || e?.group?.name == i) && (e.type === null || e.type === undefined)) {
                        if ((n == "team" || n == "clan" || n == "tribe") && te(e?.owner?.sid)) return true;
                        if ((n == "enemy" || n == "enemies" || n == "hostile" || n == "nEnemy") && !te(e?.owner?.sid)) return true;
                        if (typeof n === "number" && e?.owner?.sid === n) {
                            return true
                        }
                        if (n == "all" || n == "every" || n == "everything") return true;
                        if (!n && e?.owner?.sid === x.sid) return true
                    }
                    return false
                })
            }
            return true
        }
    }
    if (t("rclear")) {
        const r = parseFloat(s[1]);
        if (!isNaN(r)) {
            Ft = {
                x: z.x2,
                y: z.y2,
                scale: r
            };
            let n = s[2];
            !n ? n = x.sid : !isNaN(parseFloat(n)) ? n = parseFloat(n) : n = n;
            s[3] = s[3] + (s[4] !== undefined && s[4] !== null && typeof s[4] !== "number" ? s[4] : "");
            let i = s[3];
            Ut = {
                x: z.x2,
                y: z.y2,
                types: i,
                IDS: n,
                value: r,
                r: true
            };
            Vt = kh.filter(e => {
                const t = se(z, e);
                if (e.name == "pit trap") {
                    e.opacity = 1
                } else e.opacity = 1;
                if (t >= r && (i != "all" && (e.group?.name === "spikes" || e.name === "pit trap" || e?.name == "turret" && Zs.checked || e?.name == "teleporter" && Zs.checked) || i == "all" || e?.name == i || e?.group?.name == i) && (e.type === null || e.type === undefined)) {
                    if ((n == "team" || n == "clan" || n == "tribe") && te(e?.owner?.sid)) return true;
                    if ((n == "enemy" || n == "enemies" || n == "hostile" || n == "nEnemy") && !te(e?.owner?.sid)) return true;
                    if (typeof n === "number" && e?.owner?.sid === n) {
                        return true
                    }
                    if (n == "all" || n == "every" || n == "everything") return true;
                    if (!n && e?.owner?.sid === x.sid) return true
                }
                return false
            });
            return true
        }
    }
    if (G["do"] && ie.length) {
        ie[G.val].emit("6", n.slice(0, 30));
        return
    }
    if ($p) {
        !e && T.send("6", n.slice(0, 30), false)
    } else if (qp) {
        Ki.send(le({
            message: n.slice(0, 30),
            id: z.sid,
            time: 3e3
        }))
    }
}

function Jp() {
    Hp.value = "", Wp.style.display = "none"
}
let qp = false;
let $p = true;

function Zp(e, n) {
    const t = Hg(e);
    if (Pi) console.log(`${t.name}[${t.sid}] ${n}`);
    if ((!Ei.includes(e) || ts?.bot?.sid === e) && !Ii.includes(t.sid)) b(`${t.name}[${t.sid}]: `, n, z.sid == e || ts?.bot?.sid === e ? "#0aa8fc" : "#FFFFFF");
    if ((e == z.sid || ts?.bot?.sid === e) && Hn && document.getElementById("send ws")?.checked) {
        Ki.send(le({
            message: n,
            id: z.sid === e ? z.sid : ts?.bot?.sid,
            time: 3e3
        }))
    }
    if (e == z.sid && n == "spectate none" && Hn && en) {
        es.isDoing = false;
        b(`You have stopped spectating`, "", "#2b0640", false, true);
        Ki.send(le({
            msg: "spectate",
            playerToSpec: undefined,
            sender: z?.sid,
            doing: false,
            time: Date.now(),
            server: location.href
        }))
    } else if (e == z.sid && n.startsWith("spectate") && Hn && en) {
        let e = n.split("spectate");
        let t = Number(e[1]);
        if (t != z?.sid) {
            b(`You are now spectating ${Hg(t)?.name} [${t}]`, "", "#2b0640", false, true);
            es.isDoing = true;
            Ki.send(le({
                msg: "spectate",
                playerToSpec: t,
                sender: z?.sid,
                time: Date.now(),
                server: location.href
            }))
        } else {
            b(`You cannot spectate yourself.`, "", "#2b0640", false, true)
        }
    }
    if (e == z.sid && n == "ping" && Hn && en) {
        Ki.send(le({
            msg: "pinger",
            player: z,
            sender: z?.sid,
            doing: false,
            time: Date.now(),
            server: location.href
        }));
        Gn = 1e4;
        zn = []
    }
    Hn && document.getElementById("send ws").checked && (!Ei.includes(e) || ts?.bot?.sid === e) && Ki.send(le({
        chat: n,
        id: t,
        chatter: false,
        color: z.sid == e || ts?.bot?.sid === e ? "#0aa8fc" : "#FFFFFF",
        server: location.href
    }));
    t && (t.chatMessage = n, t.chatCountdown = K.chatCountdown)
}
window.addEventListener("resize", X.checkTrusted(sm));
async function em() {
    if (Oh > K.maxScreenWidth + 1) {
        await wx(2);
        Oh /= 1.05;
        Lh /= 1.05;
        sm();
        em()
    } else if (Oh < K.maxScreenWidth - 1) {
        await wx(2);
        Oh *= 1.05;
        Lh *= 1.05;
        sm();
        em()
    } else return
}
let tm = window.innerWidth;
let nm = window.innerHeight;
let im = 1;

function sm() {
    Fh = window.innerWidth;
    _h = window.innerHeight;
    im *= Math.min(Oh / tm, Lh / nm);
    tm = Oh;
    nm = Lh;
    const e = Math.max(Fh / Oh, _h / Lh) * ph;
    Xh.width = Fh * ph;
    Xh.height = _h * ph;
    Xh.style.width = Fh + "px";
    Xh.style.height = _h + "px";
    $.setTransform(e, 0, 0, e, (Fh * ph - Oh * e) / 2, (_h * ph - Lh * e) / 2)
}
var om = {
    x: null,
    y: null,
    x2: null,
    y2: null
};

function rm(e, t) {
    t = Xh.getBoundingClientRect();
    if (e) {
        om.x = e.clientX;
        om.y = e.clientY
    }
    const n = (om.x - Fh / 2) * im * .91975;
    const i = (om.y - _h / 2) * im * .91975;
    const s = z.x2 + n;
    const o = z.y2 + i;
    om.x2 = s;
    om.y2 = o;
    return {
        x: s,
        y: o
    }
}
sm();
let am;
lm(!1);

function lm(e) {
    am = e, _p()
}
window.setUsingTouch = lm;
let cm = document.getElementById("leaderboardButton"),
    dm = document.getElementById("leaderboard");
cm.addEventListener("touchstart", () => {
    dm.classList.add("is-showing")
});
const um = () => {
    dm.classList.remove("is-showing")
};
document.body.addEventListener("touchend", um);
document.body.addEventListener("touchleave", um);
document.body.addEventListener("touchcancel", um);
if (!J1) {
    let e = function(e) {
        rm(e);
        e.preventDefault(), e.stopPropagation(), lm(!1), Bh = e.clientX, Dh = e.clientY
    },
        t = function(e) {
            if (e.button == 0) {
                if (m.lc === undefined) m.lc = 0;
                m.lc = 1
            }
            if (e.button == 1) {
                if (m.mc === undefined) m.mc = 0;
                m.mc = 1
            }
            if (e.button == 2) {
                if (m.rc === undefined) m.rc = 0;
                m.rc = 1
            }
            lm(!1), wh != 1 && (wh = 1, Bm())
        },
        n = function(e) {
            if (e.button == 0) {
                if (m.lc === undefined) m.lc = 0;
                m.lc = 0
            }
            if (e.button == 1) {
                if (m.mc === undefined) m.mc = 0;
                m.mc = 0
            }
            if (e.button == 2) {
                if (m.rc === undefined) m.rc = 0;
                m.rc = 0
            }
            lm(!1), wh != 0 && (wh = 0, Bm())
        };
    var fm = e,
        hm = t,
        pm = n;
    const E4 = document.getElementById("touch-controls-fullscreen");
    E4.style.display = "block", E4.addEventListener("mousemove", e, !1), E4.addEventListener("mousedown", t, !1), E4.addEventListener("mouseup", n, !1)
}
let mm = !1,
    gm;

function ym() {
    let e = 0,
        t = 0,
        n;
    if (am) {
        if (!mm) return;
        n = gm
    }
    for (var i in km) {
        var s = km[i];
        e += !!vm[i] * s[0], t += !!vm[i] * s[1]
    }
    if ((e != 0 || t != 0) && (n = P(t, e)), n !== void 0) return X.fixTo(n, 2)
}
let xm;

function wm(e) {
    if (ct && !e) return z.dir;
    return z ? (!z.lockDir && !am && (xm = P(Dh - _h / 2, Bh - Fh / 2)), X.fixTo(xm || 0, 2)) : 0
}

function bm() {
    return z ? (!z.lockDir && !am && (xm = P(Dh - _h / 2, Bh - Fh / 2)), X.fixTo(xm || 0, 2)) : 0
}
var vm = {},
    km = {
        87: [0, -1],
        83: [0, 1],
        65: [-1, 0],
        68: [1, 0]
    };

function Am() {
    vm = {}
}

function Im() {
    return x0.style.display != "block" && Wp.style.display != "block"
}
var Sm = false;
var Em = false;

function Tm(e) {
    if (!I4() || !en) return;
    const t = e.which || e.keyCode || 0;
    78 == t && (on.status = !on.status);
    e.key == "e" && (Ct = !Ct);
    if (m[e.key] === undefined) m[e.key] = 0;
    m[e.key] <= 2 && m[e.key]++;
    t == 27 ? Np() : z && z.alive && Im() && (vm[t] || (vm[t] = 1, t == 75 ? si?.setWaypoint("quick", z) : t == 88 ? Lm() : z.weapons[t - 49] != null ? Vm(z.weapons[t - 49], !0) : z.items[t - 49 - z.weapons.length] != null ? Vm(z.items[t - 49 - z.weapons.length]) : t == 82 ? Fm() : t == 32 && (wh = 1, Bm())));
    Ue[e.keyCode] = 1;
    let n;
    if (e.keyCode == 79) {
        if (ai == "Wander") {
            ai = "Summon"
        } else {
            ai = "Wander"
        }
        U1.showText(z.x2, z.y2, 30, .2, 400, ai, "#fff")
    } else if (e.keyCode == 189) {
        if (ai == "Static") {
            ai = "Summon"
        } else {
            n = ai;
            ai = "Static"
        }
        U1.showText(z.x2, z.y2, 30, .2, 400, ai, "#fff")
    }
    if (ie.length) {
        if (e.keyCode === 37) {
            G["do"] = true;
            G.val = (G.val - 1 + ie.length) % ie.length;
            G.play = false
        } else if (e.keyCode === 39) {
            G["do"] = true;
            G.val = (G.val + 1) % ie.length;
            G.play = false
        }
    }
    if (e.code == "ShiftRight") {
        G["do"] = false;
        G.play = false
    }
    if (e.keyCode == 66 && ie.length) {
        if (!Vt) {
            Xp(`!clear ${fi} ${hi} ${gi}`)
        } else {
            Ut = null;
            Vt = null;
            kh.forEach(e => {
                if (e.name == "pit trap") {
                    e.opacity = 1
                } else {
                    e.opacity = 1
                }
            })
        }
    }
    Ue[e.keyCode] = 1;
    if (m[e.key] === undefined) m[e.key] = 0;
    m[e.key] <= 2 && m[e.key]++;
    if (m.q) {
        xn = true;
        setTimeout(() => {
            xn = false
        }, ce)
    }
    if (e.code == "ShiftRight" || e.code == "ShiftLeft") {
        if (m[e.code] === undefined) m[e.key] = 0;
        m[e.code] = 1
    }
    e.key == "l" && (In = !In, U1.showText(z.x2, z.y2, 30, .2, 400, In, "#fff"));
    e.key == "U" && !Hn && (T5(), console.log("trying to connect"));
    e.key == "p" && em();
    e.key == "r" && (un = un == "normal" ? un = false : un = "normal");
    e.key == "R" && (un = un == "reverse" ? un = false : un = "reverse");
    e.code == "NumpadMultiply" && (fn = !fn, U1.showText(z.x2, z.y2, 30, .2, 400, fn, "#fff"));
    e.code == "NumpadSubtract" && (z.customColor = Array.from(F)[f(Math.random() * F.size)]);
    e.key == "t" && si.goal.pathing ? si?.updateChat("stop", z?.sid) : e.key == "t" ? si?.updateChat("path", z?.sid) : null;
    e.key == "0" && (Em = false);
    if (e.keyCode == 32) {
        if (m.mc === undefined) m.mc = 0;
        m.mc = 1
    }
    if (e.key == "y") {

        const i = async () => {
            let e = [];
            for (let e = 0; e < 20; e++) {
                bx(ie.length);
                if (!Em) {
                    console.log("stopped spawning");
                    break
                }
            }
        };
        i().then(() => {})["catch"](e => {})
    }
    m["1"] == 1 && (qt = ee);
    m["2"] == 1 && A != null && (qt = A)
}
window.addEventListener("keydown", X.checkTrusted(Tm));

function Cm(e) {
    if (z && z.alive) {
        const t = e.which || e.keyCode || 0;
        if (t == 13) {
            if (x0.style.display === "block") return;
            Qp()
        } else {
            Im() && vm[t] && (vm[t] = 0, t == 32 && (wh = 0, Bm()))
        }
        if (m[e.key] === undefined) m[e.key] = 0;
        m[e.key] = 0;
        m[e.key] = 0;
        Ue[e.keyCode] = 0
    }
    if (e.code == "ShiftRight" || e.code == "ShiftLeft") {
        if (m[e.code] === undefined) m[e.key] = 0;
        m[e.code] = 0
    }
    if (e.key === "Enter") {
        if (document.activeElement === we) {
            const n = we.value.trim();
            if (n !== "") {
                Xp(we.value, true);
                document.getElementById("send ws").checked && Ki.send(le({
                    chat: n,
                    id: z,
                    chatter: true,
                    color: "#0aa8fc",
                    server: location.href,
                    pm: true
                }))
            }
            we.value = "";
            setTimeout(() => {
                we.blur()
            }, 0)
        }
    }
    if (e.key === "/" && "chatbox" !== document.activeElement.id.toLowerCase()) {
        we.focus()
    }
    if (e.keyCode == 32) {
        if (m.mc === undefined) m.mc = 0;
        m.mc = 0
    }
}
window.addEventListener("keyup", X.checkTrusted(Cm));
bo.onclick = function() {
    if (bo.checked) {
        K.healthBarWidth = 50
    } else {
        K.healthBarWidth = 35
    }
};

function Bm() {
    return
}
var Dm = null;

function Pm(e, t, n, i, s, o) {
    return D((e - i) ** 2 + (t - s) ** 2) - (n + o) < 1
}
const Rm = W / 12;

function Mm(t) {
    let n = w4(z) * y4;
    w;
    if (t === undefined) return undefined;
    if (Nm(t, n) === null) {
        for (let e = 0; e < W; e += Rm) {
            if (Nm(t + e, n) !== null) return t + e;
            if (Nm(t - e, n) !== null) return t - e
        }
        return W + null
    }
    return t
}

function Nm(e, t) {
    let s = z.x2 + U(e) * t;
    let o = z.y2 + V(e) * t;
    let r = 45;
    if (Pm(s, o, 35, Nt.x, Nt.y, 45)) {
        let e = P(s - Nt.x, o - Nt.y),
            t = D((s - Nt.x) ** 2 + (o - Nt.y) ** 2) + 35;
        let n = s + U(e) * t;
        let i = o + V(e) * t;
        if (Pm(n, i, 35, Nt.x, Nt.y, r)) {
            return null
        }
    }
    return e
}

function Om(e = false) {
    var t = ym();
    let n = {
        ...z
    };
    let i = Vg(1, t);
    n.buildIndex = -1;
    n.weaponIndex = y != null ? y : z.weaponIndex;
    n.skinIndex = z.skins[i.skinIndex] ? i.skinIndex : z.skinIndex;
    n.tailIndex = z.tails[i.tailIndex] ? i.tailIndex : z.tailIndex;
    e = !isNaN(t) ? E3(z, t, l4(n, t, n, 1)) : false;
    let s = !(ie.length && G["do"] && G.play) ? false : true;
    let o = s ? ui : Dm;
    if (e && !m.ShiftLeft && !(ni == "pathfinder" && si.goal.pathing)) t = undefined;
    if (t == Dn && !s) return;
    if ((null == ui || null == t || Math.abs(t - ui) > .3) && !(ni == "pathfinder" && si.goal.pathing && !s) && !jt) {
        if (!s) {
            T.send("a", t);
            ui = t
        } else {
            ie[G.val].emit("a", t);
            Dm = t
        }
    }
}

function Lm() {
    z.lockDir = z.lockDir ? 0 : 1
}

function Fm() {
    T.send("S", 1)
}

function _m() {
    T.send("K", 1)
}

function Vm(e, t) {
    T.send("G", e, t)
}
window.io = T;

function Um() {
    Zh.hidden = !hh, window.onbeforeunload = function(e) {
        return "Are you sure?"
    }, window.FRVR && window.FRVR.tracker.levelStart("game_start"), lh("moo_name", f0.value), !Vh && nh() && (Vh = !0, sh.stop("menu"), F0("Loading..."), T.send("M", {
        name: f0.value,
        moofoll: 1,
        skin: Nh === 10 ? "constructor" : Nh
    })), jm()
}

function jm() {
    var e = document.getElementById("ot-sdk-btn-floating");
    e && (e.style.display = "none")
}

function Hm() {
    var e = document.getElementById("ot-sdk-btn-floating");
    e && (e.style.display = "block")
}
let Wm = !0,
    Qm = !1;

function Ym(e) {
    en = true;
    st = true;
    on = {
        status: false,
        w: null,
        a: null,
        s: null,
        d: null,
        aim: null,
        x: 0,
        y: 0
    };
    i0.style.display = "none", t0.style.display = "block", Uh.style.display = "none", vm = {}, Eh = e, wh = 0, Vh = !0, Wm && (Wm = !1, kh.length = 0);
    J1 && Fu.enable({
        onStartMoving: () => {
            Bp(), cp(), lm(!0), mm = !0
        },
        onStopMoving: () => {
            mm = !1, Om()
        },
        onRotateMoving: (e, t) => {
            t.force < .25 || (gm = -t.angle.radian, Om(), Qm || (xm = -t.angle.radian))
        }
    })
}

function zm(e, t, n, i) {
    if (n < 0 || !hs.checked) {
        i === -1 ? U1.showText(e, t, 50, .18, 500, n, "#ee5551") : ps.checked ? zi.push({
            x: e,
            y: t,
            value: n
        }) : U1.showText(e, t, 50, .18, 500, S(n), n >= 0 ? "#fff" : "#8ecc51")
    }
}
let Gm = 99999;
async function Km() {
    Vh = !1, Hm();
    en = false;
    St = 0;
    p = false;
    on = {
        status: false,
        w: null,
        a: null,
        s: null,
        d: null,
        aim: null,
        x: 0,
        y: 0
    };
    si?.setWaypoint("death", z);
    s0.style.display = "none", Np(), gp = {
        x: z.x,
        y: z.y
    }, i0.style.display = "none", k0.style.display = "block", k0.style.fontSize = "0px", Gm = 0, setTimeout(function() {
        t0.style.display = "block", Uh.style.display = "block", k0.style.display = "none"
    }, K.deathFadeout), G0();
    await A4();
    setTimeout(() => {
        b(le(z.dmgpots), "", "black", false, true);
        b(le(z.healths), "", "#ff17dd", false, true);
        b(`Ping: ${window.pingTime}`, "", "black", false, true);
        b(`Shame Leak attempted: ${z.shameLeak}`, "", "black", false, true)
    }, 10)
}

function Xm(t) {
    if (xi.ID == t) {
        b(`target ID reset to undefined`, "", "green", false, true);
        xi.ID = null
    }
    kh = kh.filter(e => e?.owner?.sid != t);
    ht = ht.filter(e => e?.sid != t);
    ie.length && (ie = ie.filter(e => e.HERE));
    $0 = $0.filter(e => e.sid != t)
}

function Jm(r, s, t, e) {
    let a;
    let l;
    let c = Q.filter(e => (e.name == "pit trap" || e.group?.name == "spikes" || e.type === 1 && e.y >= 12e3) && e.distance <= 450);
    let d = {};
    let u = x.list[ly].scale - 50;
    for (let e = 0; e < t.length; e++) {
        let o = t[e];
        for (let i = 0; i < s.length; i++) {
            let n = true;
            for (let t = 0; t < o.placePot.possible.length; t++) {
                let e = o.placePot.possible[t];
                d[s[i].angle + o.name + o.sid + e.angle] = S4(s[i], e);
                if (d[s[i].angle + o.name + o.sid + e.angle] <= s[i].scale + e.scale) {
                    s[i].placePriority = true;
                    n = false;
                    break
                }
            }
            let e = S4(s[i], o);
            if (e <= 200) s[i].points += 1;
            if (e <= 20.4) {
                s[i].points += 1
            }
            if (e <= 50) {
                s[i].collide.push(o.sid);
                s[i].points += Nt ? 4 : 2
            }
            let t = c.filter(e => (e?.group?.name === "spikes" && (te(e.owner.sid) || !o.team && e?.owner?.sid != o.sid) || e.y >= 12e3 && e.type === 1) && Ne(e.x - s[i].x, e.y - s[i].y) <= 50 + (e.type == 1 ? e.scale * .55 : e.scale) + 24 && !s[i].sids.includes(e.sid));
            if (t.length) {
                s[i].points += 1 + t.length;
                s[i].canPush = true
            }
            if (e <= o.placePot.placeRange) {
                if (n) {
                    s[i].points += 1
                } else {
                    s[i].points += .5
                }
            }
            if (!l || l.points <= s[i].points) l = s[i]
        }
        for (let s = 0; s < r.length; s++) {
            r[s].bounce = false;
            r[s].collision = false;
            if (kx(r[s])) continue;
            let e = S4(r[s], o);
            let n = true;
            for (let t = 0; t < o.placePot.possible.length; t++) {
                let e = o.placePot.possible[t];
                if (d[r[s].angle + o.name + o.sid + e.angle] + u <= r[s].scale + e.scale) {
                    r[s].placePriority = true;
                    n = false;
                    break
                }
            }
            let t = o.inTrap ? S4(r[s], o.inTrap) : Infinity;
            let i = Ay(P(r[s].y - z.y2, r[s].x - z.x2), Ay(P(o.y2 - z.y2, o.x2 - z.x2)));
            if (e <= 35 + r[s].scale) {
                if (r[s].collide.length >= 1) r[s].origin.push({
                    amount: 1,
                    from: `collides with ${o.name}[${o.sid}]`,
                    player: o
                });
                r[s].collide.push(o.sid);
                r[s].collision = true;
                let e = j5(r[s], c, o);
                if (e.building) {
                    r[s].into = e;
                    if (e.building.name == "pit trap" && !(r[s].preplace && o.inTrap && r[s].sids.includes(o.inTrap.sid))) {
                        r[s].points += 2.5
                    } else if (e.bounce) {
                        r[s].bounce = true;
                        r[s].points += 5
                    } else if (e.building.name !== "pit trap") {
                        r[s].points += 3
                    } else {
                        r[s].into = false
                    }
                }
                if (o.inTrap && !r[s].sids.includes(o.inTrap.sid)) {
                    r[s].points += 2;
                    r[s].spikeTrap = true;
                    r[s].canPush = true
                }
            }
            if (o.inTrap && !r[s].sids.includes(o.inTrap.sid) && t <= 50 + r[s].scale + 21) {
                r[s].canPush = true;
                r[s].points += 1
            }
            if (o.inTrap && e <= 250 && (Ay(r[s].angle, o.inTrap.angToMe) >= 1.5 || Dn === null || Dn === undefined)) {
                r[s].points += 2
            }
            if (o.inTrap && jt && Ay(ne.dir, P(o.y2 - z.y2, o.x2 - z.x2)) > 4.7) {
                i4("prevents bounce back");
                r[s].points += 2
            }
            if (n && e <= o.placePot.placeRange) {
                r[s].points += 1
            }
            if (!a || a.points <= r[s].points) a = r[s]
        }
        d = {}
    }
    return {
        spikes: r,
        traps: s,
        bestSpike: a,
        bestTrap: l
    }
}
let qm = false;

function $m(s, e, t) {
    kh = kh.filter(e => {
        if (e.sid !== s) return true;
        if (!L3(z, e)) {
            e.TICK = v;
            Yt.push(e)
        }
        if (e.sid == s && Nt.sid === e.sid) {
            I(6, z.tailIndex)
        }
        if (e.sid == s && Y && Y?.globalTrap?.sid === e.sid && se(z, e) <= 126) {
            cn.push({
                build: e,
                destroyedAt: v
            });
            if (gt) {
                c4(z.items[2], B(z, e));
                c4(z.items[2], B(z, Y))
            }
        }
        if (e.sid === s && !qm && Y && se(z, Y) <= 235 && se(z, e) <= 190 && ms.checked && x.list[z.items[4]]?.name == "pit trap") {
            const n = F5(ly, 0, 0, W / ls.value);
            const i = F5(uy, 0, 0, W / ls.value);
            const o = Jm(n, i, ss);
            const {
                bestTrap: r,
                bestSpike: a
            } = o;
            o.spikes.sort((e, t) => t.points - e.points);
            o.traps.sort((e, t) => t.points - e.points);
            if (o.spikes.length && o.traps.length) {
                function t(n, e = o.spikes.concat(o.traps)) {
                    e = e.filter(e => e.points > 0);
                    if (He >= 85 || !a && !r && !m.c) return;
                    e.sort((e, t) => {
                        if (t.points === e.points && e.name !== t.name) {
                            return e.name === "pit trap" ? -1 : 1
                        }
                        return t.points - e.points
                    });
                    for (let t of e) {
                        const i = n.some(e => S4(e, t) <= e.scale + t.scale);
                        const s = os.some(e => S4(e, t) <= e.scale + t.scale);
                        if (!i && !s) {
                            n.push(t)
                        }
                        if (n.length === 4) break
                    }
                    for (let e of n) {
                        if (!e.did) {
                            Z5(e.id, e.angle);
                            rs.push(e);
                            Tn.push({
                                ...e,
                                tick: v
                            })
                        }
                    }
                }
                let e = [];
                if (a && a.points > 0 && !os.some(e => S4(e, a) <= e.scale + a.scale) && (!r.canPush || a.into) && (jt && r.points > 0 || a.bounce)) {
                    if (a.into) {
                        m3(a.into.newPos)
                    }
                    if (a.collision) {
                        i4(`spike sync tester`)
                    }
                    if (a.placePriority) {
                        Z5(Nt ? 15 : ly, a.angle);
                        Tn.push({
                            ...a,
                            tick: v
                        })
                    } else {
                        Z5(Nt ? 15 : ly, a.angle);
                        Tn.push({
                            ...a,
                            tick: v
                        })
                    }
                    a.did = true;
                    e.push(a);
                    rs.push(a)
                }
                if (r && r.points > 0 && !os.some(e => S4(e, r) <= e.scale + r.scale) && !(a && a.points > 0 && (!jt && a.bounce) && se(r, a) <= r.scale + a.scale) || r?.canPush || jt) {
                    if (r.placePriority) {
                        Z5(uy, r.angle);
                        Tn.push({
                            ...r,
                            tick: v
                        })
                    } else {
                        Z5(uy, r.angle);
                        Tn.push({
                            ...r,
                            tick: v
                        })
                    }
                    r.did = true;
                    e.push(r);
                    rs.push(r)
                }
                t(e)
            }
        }
        return false
    })
}

function Zm() {
    r0.innerText = z.points, a0.innerText = z.food, l0.innerText = z.wood, c0.innerText = z.stone, d0.innerText = z.kills
}
const e2 = {},
      t2 = ["crown", "skull"];

function n2() {
    for (let e = 0; e < t2.length; ++e) {
        const t = new Image;
        t.onload = function() {
            this.isLoaded = !0
        }, t.src = "./img/icons/" + t2[e] + ".png", e2[t2[e]] = t
    }
}
const i2 = [];

function s2(e, t) {
    pg();
    if (z.upgradePoints = e, z.upgrAge = t, e > 0) {
        i2.length = 0, X.removeAllChildren(g0);
        for (var n = 0; n < x.weapons.length; ++n)
            if (x.weapons[n].age == t && (x.weapons[n].pre == null || z.weapons.indexOf(x.weapons[n].pre) >= 0)) {
                var i = X.generateElement({
                    id: "upgradeItem" + n,
                    "class": "actionBarItem",
                    onmouseout: function() {
                        q0()
                    },
                    parent: g0
                });
                i.style.backgroundImage = document.getElementById("actionBarItem" + n).style.backgroundImage, i2.push(n)
            } for (var n = 0; n < x.list.length; ++n)
                if (x.list[n].age == t && (x.list[n].pre == null || z.items.indexOf(x.list[n].pre) >= 0)) {
                    const s = x.weapons.length + n;
                    var i = X.generateElement({
                        id: "upgradeItem" + s,
                        "class": "actionBarItem",
                        onmouseout: function() {
                            q0()
                        },
                        parent: g0
                    });
                    i.style.backgroundImage = document.getElementById("actionBarItem" + s).style.backgroundImage, i2.push(s)
                } for (var n = 0; n < i2.length; n++)(function(e) {
                    const t = document.getElementById("upgradeItem" + e);
                    t.onmouseover = function() {
                        x.weapons[e] ? q0(x.weapons[e], !0) : q0(x.list[e - x.weapons.length])
                    }, t.onclick = X.checkTrusted(function() {
                        T.send("H", e)
                    }), X.hookTouchEvents(t)
                })(i2[n]);
        i2.length ? (g0.style.display = "block", y0.style.display = "block", y0.innerHTML = "SELECT ITEMS (" + e + ")") : (g0.style.display = "none", y0.style.display = "none", q0())
    } else g0.style.display = "none", y0.style.display = "none", q0()
}

function o2(e, t, n) {
    e != null && (z.XP = e), t != null && (z.maxXP = t), n != null && (z.age = n), n == K.maxAge ? (p0.innerHTML = "MAX AGE", m0.style.width = "100%") : (p0.innerHTML = "AGE " + z.age, m0.style.width = z.XP / z.maxXP * 100 + "%")
}

function r2(t) {
    X.removeAllChildren(u0);
    let n = 1;
    for (let e = 0; e < t.length; e += 3) {
        (function(e) {
            X.generateElement({
                "class": "leaderHolder",
                style: "font-size: 14px; display: flex; justify-content: space-between; align-items: center;",
                parent: u0,
                children: [X.generateElement({
                    "class": "",
                    style: "color:" + (t[e] == Eh ? "#fff; font-size: 14px;" : "rgba(255,255,255,0.6); font-size: 14px;"),
                    text: `${t[e+1]} [${t[e]}]`
                }), X.generateElement({
                    "class": "leaderScore",
                    style: "font-size: 14px;",
                    text: X.kFormat(t[e + 2]) || "0"
                })]
            })
        })(e);
        n++
    }
}
let a2 = null;

function l2() {
    {
        if (z && (!yh || gh - yh >= 1e3 / K.clientSendRate)) {
            yh = gh;
            const r = wm();
            a2 !== r && (a2 = r)
        }
        let e = !ts?.bot && !es.isDoing ? z : es.isDoing ? es?.rPlayer : ts?.bot;
        if (Gm < 120 && (Gm += .1 * mh, k0.style.fontSize = j(H(Gm), 120) + "px"), e) {
            const r = X.getDistance(Ph, Rh, e.x, e.y),
                  v = X.getDirection(e.x, e.y, Ph, Rh),
                  a = j(r * .01 * mh, r);
            r > .05 ? (Ph += a * U(v), Rh += a * V(v)) : (Ph = e.x, Rh = e.y)
        } else Ph = K.mapScale / 2, Rh = K.mapScale / 2;
        const x = gh - ce;
        for (var i, s = 0, o = J.concat(Ci, ts.players, es.rPlayers); s < o.length + bh.length; ++s)
            if ((q = o[s] || bh[s - o.length]) && q && (q?.visible || q?.fake))
                if (q.forcePos) q.x = q.x2, q.y = q.y2, q.dir = q.d2;
                else {
                    var r = q.t2 - q.t1,
                        a = (x - q.t1) / r,
                        l = 170;
                    q.dt += mh;
                    var c = j(1.7, q.dt / l);
                    var i = q.x2 - q.x1;
                    q.x = q.x1 + i * c, i = q.y2 - q.y1, q.y = q.y1 + i * c, q.lastx = q.x;
                    q.lasty = q.y;
                    q.dir = Math.lerpAngle(q.d2, q.d1, j(1.2, a));
                    if (q?.bot) {
                        let e = ie[G?.val]?.findPlayer(q.sid);
                        e && (e = q)
                    }
                } const w = Ph - Oh / 2 + pi,
                      b = Rh - Lh / 2 + mi;
        K.snowBiomeTop - b <= 0 && K.mapScale - K.snowBiomeTop - b >= Lh ? ($.fillStyle = "#b6db66", $.fillRect(0, 0, Oh, Lh)) : K.mapScale - K.snowBiomeTop - b <= 0 ? ($.fillStyle = "#dbc666", $.fillRect(0, 0, Oh, Lh)) : K.snowBiomeTop - b >= Lh ? ($.fillStyle = "#fff", $.fillRect(0, 0, Oh, Lh)) : K.snowBiomeTop - b >= 0 ? ($.fillStyle = "#fff", $.fillRect(0, 0, Oh, K.snowBiomeTop - b), $.fillStyle = "#b6db66", $.fillRect(0, K.snowBiomeTop - b, Oh, Lh - (K.snowBiomeTop - b))) : ($.fillStyle = "#b6db66", $.fillRect(0, 0, Oh, K.mapScale - K.snowBiomeTop - b), $.fillStyle = "#dbc666", $.fillRect(0, K.mapScale - K.snowBiomeTop - b, Oh, Lh - (K.mapScale - K.snowBiomeTop - b))), Wm || (Th += Ch * K.waveSpeed * mh, Th >= K.waveMax ? (Th = K.waveMax, Ch = -1) : Th <= 1 && (Th = Ch = 1), $.globalAlpha = 1, $.fillStyle = "#dbc666", p2(w, b, $, K.riverPadding), $.fillStyle = "#91b2db", p2(w, b, $, (Th - 1) * 250)), $.lineWidth = 4, $.strokeStyle = "#000", $.globalAlpha = .06, $.beginPath();
        if (!gs.checked && !vo.checked) {
            for (var d = (14400 - w) % 1440; d < Oh; d += 1440) d > 0 && ($.moveTo(d, 0), $.lineTo(d, Lh));
            for (var u = (14400 - b) % 1440; u < Lh; u += 1440) u > 0 && ($.moveTo(0, u), $.lineTo(Oh, u))
        } else {
            for (var f = -Ph; f < Oh; f += Lh / 18) f > 0 && ($.moveTo(f, 0), $.lineTo(f, Lh));
            for (let e = -Rh; e < Lh; e += Lh / 18) f > 0 && ($.moveTo(0, e), $.lineTo(Oh, e))
        }
        $.stroke(), $.globalAlpha = 1, $.strokeStyle = D0, b2(-1, w, b), $.globalAlpha = 1, $.lineWidth = R0, c2(0, w, b), A2(w, b, 0), $.globalAlpha = 1;
        for (var s = 0; s < bh.length; ++s) q = bh[s], q.active && q.visible && (q.animate(mh), $.save(), $.translate(q.x - w, q.y - b), $.rotate(q.dir + q.dirPlus - W / 2), lg(q, $), $.restore());
        if (b2(0, w, b), c2(1, w, b), b2(1, w, b), A2(w, b, 1), b2(2, w, b), b2(3, w, b), $.fillStyle = "#000", $.globalAlpha = .09, w <= 0 && $.fillRect(0, 0, -w, Lh), K.mapScale - w <= Oh) {
            var h = oe(0, -b);
            $.fillRect(K.mapScale - w, h, Oh - (K.mapScale - w), Lh - h)
        }
        if (b <= 0 && $.fillRect(-w, 0, Oh + w, -b), K.mapScale - b <= Lh) {
            var p = oe(0, -w);
            let e = 0;
            K.mapScale - w <= Oh && (e = Oh - (K.mapScale - w)), $.fillRect(p, K.mapScale - b, Oh - p - e, Lh - (K.mapScale - b))
        }
        if (z && si?.goal?.pathing) {
            $.globalAlpha = 1;
            $.save();
            $.translate(-w, -b);
            ri?.drawPath($, "#ffffff", z, "#00FF00");
            si?.drawWaypoints($, z.skinRot);
            $.restore()
        }
        $.fillStyle = vo.checked ? `rgba(0, 0, 70, 0.35)` : `rgba(15, 0, 70, 0.49)`;
        $.globalAlpha = 1, $.fillRect(0, 0, Oh, Lh), $.strokeStyle = P0;
        let t = J.concat(ts.players, es.rPlayers);
        for (var s = 0; s < t.length + bh.length; ++s)
            if (q = t[s] || bh[s - t.length], q?.visible && (q?.skinIndex != 10 || q?.skinIndex == 10 || q == z || q?.team && q?.team == z.team)) {
                const v = (q.team ? "[" + q.team + "] " : "") + (q.name || "");
                if (!eo.checked && !Ei.includes(q.sid) && ws.checked) {
                    if (v !== "") {
                        $.font = (q.nameScale || 30) + "px Lilita One";
                        $.fillStyle = bo.checked ? "#fff" : q.isAI ? "#f2eff9" : q === z ? "#a0cac2" : q.team && q.team === z.team ? "#a6c7e7" : "#ebaebc";
                        $.textBaseline = "middle";
                        $.textAlign = "center";
                        $.lineWidth = q.nameScale ? 11 : 8;
                        $.lineJoin = "round";
                        const A = q.x - w;
                        const I = q.y - b - q.scale - K.nameY;
                        $.strokeText(v, A, I);
                        $.fillText(v, A, I);
                        if (q.isLeader && e2.crown.isLoaded) {
                            const S = K.crownIconScale;
                            const E = A - S / 2 - $.measureText(v).width / 2 - K.crownPad;
                            $.drawImage(e2.crown, E, I - S / 2 - 5, S, S)
                        }
                        if (q.iconIndex === 1 && e2.skull.isLoaded) {
                            const T = K.crownIconScale;
                            const C = A + $.measureText(v).width / 2 + K.crownPad - T / 2;
                            $.drawImage(e2.skull, C, I - T / 2 - 5, T, T)
                        }
                    }
                }
                if (q.isPlayer && ws.checked) {
                    $.globalAlpha = 1;
                    $.textAlign = "center";
                    $.fillStyle = q.customColor;
                    $.font = "19px Lilita One";
                    $.strokeStyle = "#212123";
                    $.lineWidth = 6;
                    $.strokeText(q.sid, q.x - w, q.y - b);
                    $.fillText(q.sid, q.x - w, q.y - b)
                }
                if (q.isPlayer && ws.checked && !Ei.includes(q.sid)) {
                    if (!Ei.includes(q.sid) || G?.["do"] && ts?.bot?.sid == q.sid) {
                        if (q.sid != z.sid && !vo.checked) {
                            $.globalAlpha = 1;
                            $.textAlign = "center", $.fillStyle = "#fff", $.font = "20px Lilita One", $.strokeStyle = "#212123", $.lineWidth = 3, $.strokeText(`[${q.gainSpeed?H(q.gainSpeed):0} / ${q.leakSpeed?H(q.leakSpeed):0}]`, q.x - w, q.y - b - 50);
                            $.fillText(`[${q.gainSpeed?H(q.gainSpeed):0} / ${q.leakSpeed?H(q.leakSpeed):0}]`, q.x - w, q.y - b - 50)
                        }
                        if (xs.checked || !vo.checked) {
                            const B = bo.checked ? 29 : 12;
                            $.textAlign = "center", $.fillStyle = bo.checked ? "#fff" : q.isAI ? "#f2eff9" : q === z ? "#a0cac2" : q.team && q.team == z.team ? "#a6c7e7" : "#ebaebc", $.font = "18px Lilita One", $.strokeStyle = P0, $.lineWidth = 5, $.strokeText(!q.clowned ? q.shameCount : q.shameTimer > 0 ? H(1e3 * q.shameTimer) / 1e3 : 0, q.x - w, q.y - b + q.scale + K.nameY + B), $.fillText(!q.clowned ? q.shameCount : q.shameTimer > 0 ? H(1e3 * q.shameTimer) / 1e3 : 0, q.x - w, q.y - b + q.scale + K.nameY + B)
                        }
                        if (!vo.checked || (ys.checked || bo.checked)) {
                            $.globalAlpha = .06;
                            $.beginPath();
                            $.arc(q.x - w, q.y - b, q.scale, W / 2, W / 2 + W / 1.5);
                            $.stroke();
                            $.strokeStyle = q.lastpr != 1 ? `hsl(${100-q.pr*405},100%,50%)` : "rgba(0, 0, 70, 0.35)";
                            $.lineWidth = 4;
                            $.beginPath();
                            $.globalAlpha = q.lastpr == 1 ? .06 : 1;
                            $.arc(q.x - w, q.y - b, q.scale, W / 2, W / 2 + W / 1.5 * (q.lastpr + (q.multpr - q.lastpr) * j(1, q.dt / q.delta)), false);
                            $.stroke();
                            $.strokeStyle = "rgba(0, 0, 70, 0.35)";
                            $.lineWidth = 6;
                            $.globalAlpha = .06;
                            $.beginPath();
                            $.arc(q.x - w, q.y - b, q.scale, W / 2 + W / 1.5 * 2, W / 2 + W / 1.5 * 2 + W / 1.5);
                            $.stroke();
                            $.globalAlpha = q.lastsr == 1 ? .06 : 1;
                            $.strokeStyle = q.lastsr != 1 ? `hsl(${100-q.sr*405},100%,50%)` : "rgba(0, 0, 70, 0.35)";
                            $.lineWidth = 4;
                            $.beginPath();
                            $.arc(q.x - w, q.y - b, q.scale, W / 2 + W / 1.5 * 2, W / 2 + W / 1.5 * 2 + W / 1.5 * (q.lastsr + (q.multsr - q.lastsr) * j(1, q.dt / q.delta)), false);
                            $.stroke();
                            $.strokeStyle = "rgba(0, 0, 70, 0.35)";
                            $.lineWidth = 6;
                            $.globalAlpha = .06;
                            $.beginPath();
                            $.arc(q.x - w, q.y - b, q.scale, W / 2 + W / 1.5, W / 2 + W / 1.2 + W / 2);
                            $.stroke();
                            $.globalAlpha = q.lasttr == 1 ? .06 : 1;
                            $.strokeStyle = q.lasttr != 1 ? `hsl(${100-q.tr*405},100%,50%)` : "rgba(0, 0, 70, 0.35)";
                            $.lineWidth = 4;
                            $.beginPath();
                            $.arc(q.x - w, q.y - b, q.scale, W / 2 + W / 1.5, W / 2 + W / 1.2 + W / 2 * (q.lasttr + (q.tr - q.lasttr) * j(1, q.dt / q.delta)), false);
                            $.stroke()
                        }
                        $.globalAlpha = 1;
                        if (bs.checked && z.sid == q.sid) {
                            let e = He;
                            let t = 0;
                            t += (e - t) * .75;
                            const D = 120;
                            const P = t / D;
                            let n, i, s;
                            if (P < .5) {
                                n = Math.floor(510 * P);
                                i = 255;
                                s = 0
                            } else {
                                n = 255;
                                i = Math.floor(510 * (1 - P));
                                s = 0
                            }
                            const R = `rgb(${n},${i},${s})`;
                            $.fillStyle = P0;
                            $.roundRect(q.x - w - K.healthBarWidth - K.healthBarPad + 34.7, q.y - b + q.scale - 170 + K.nameY, K.healthBarWidth * 2 / 3.25 + K.healthBarPad * 2, 17, 8);
                            $.fill();
                            $.fillStyle = R;
                            $.roundRect(q.x - w - K.healthBarWidth + 34.7, q.y - b + q.scale - 170 + K.nameY + K.healthBarPad, K.healthBarWidth * 2 / 3.25 * (t / 120), 17 - K.healthBarPad * 2, 7);
                            $.fill()
                        }
                    }
                    if (Y && q.sid == Y.sid && typeof Ny === "object" && jt) {
                        $.globalAlpha = .3;
                        $.fillStyle = "#5f6ee7";
                        $.strokeStyle = "#5f6ee7";
                        $.beginPath();
                        $.arc(Ny.x - w, Ny.y - b, 35, 0, ae);
                        $.arc(Y.x2 + ne.x - w, Y.y2 + ne.y - b, 35, 0, ae);
                        $.fill()
                    }
                }
                $.font = "20px Lilita One";
                const k = $.measureText(q.name).width;
                if (Y && q.isPlayer && q.sid == Y.sid && !vo.checked) {
                    const e = se(z, Y) - 35;
                    if (e > 350) {
                        $.globalAlpha = 0;
                        $.fillStyle = "black";
                        $.strokeStyle = "black";
                        $.lineWidth = 5;
                        $.beginPath();
                        $.moveTo(z.x - w, z.y - b);
                        $.lineTo(q.x - w, q.y - b);
                        $.stroke();
                        $.globalAlpha = 1;
                        $.fillStyle = "white";
                        $.lineWidth = 5;
                        const M = (q.x + z.x) / 2 - w;
                        const N = (q.y + z.y) / 2 - b;
                        const O = M - k / 2;
                        const L = N + 15;
                        $.strokeText(q.name, O, L);
                        $.fillText(q.name, O, L)
                    }
                }
                if (q.isAI) {
                    $.globalAlpha = 1;
                    $.textAlign = "center", $.fillStyle = "#fff", $.font = "20px Lilita One", $.strokeStyle = "#212123", $.lineWidth = 3, $.strokeText(q.health, q.x - w, q.y - b), $.fillText(q.health, q.x - w, q.y - b)
                }
                if (Vt?.length && q.sid == z.sid) {
                    $.globalAlpha = .4;
                    $.lineWidth = 5;
                    $.strokeStyle = "black";
                    $.beginPath();
                    $.arc(Ft.x - w, Ft.y - b, Ft.scale, 0, ae);
                    $.stroke();
                    $.globalAlpha = 1
                }
                if (Y && q.sid == Y.sid && q.isPlayer && (un || fn && ee == 5)) {
                    $.globalAlpha = 1;
                    if (q.scaler === undefined) {
                        q.scaler = 0;
                        q.scalerR = false;
                        q.rotater = 0;
                        q.rotaterR = false
                    }
                    q.scalerR ? q.scaler -= .05 : q.scaler += .05;
                    q.rotaterR ? q.rotater -= 1.8 : q.rotater += 1.8;
                    if (q.rotater >= 360) q.rotater = 0;
                    if (Math.round(q.scaler * 10) / 10 >= 1 || Math.round(q.scaler * 10) / 10 <= -1) q.scalerR = !q.scalerR;
                    $.strokeStyle = "#ba5e69";
                    $.lineWidth = 5;
                    let o = q.scale + 15 + q.scaler * 5;
                    let e = Math.PI / 6;
                    let i = 2 * Math.PI / 3 - e;
                    for (let n = 0; n < 3; n++) {
                        let e = 2 * Math.PI / 3 * n + Z(q.rotater);
                        let t = e + i;
                        $.beginPath();
                        $.arc(q.x - w, q.y - b, o, e, t);
                        $.stroke()
                    }
                    $.fillStyle = "#ba5e69";
                    let t = 3;
                    let n = 20 + q.scaler * 4;
                    let r = 30 + q.scaler * 6;
                    let a = [Z(q.rotater) + i / 2 + W / 3, Z(q.rotater) + 2 * W / 3 + i / 2 + W / 3, Z(q.rotater) + 4 * W / 3 + i / 2 + W / 3];
                    for (let s = 0; s < t; s++) {
                        let e = a[s];
                        let t = f2(q.x, q.y, e, o);
                        let n = f2(t.x, t.y, e + W / 6, r);
                        let i = f2(t.x, t.y, e - W / 6, r);
                        $.beginPath();
                        $.moveTo(t.x - w, t.y - b);
                        $.lineTo(n.x - w, n.y - b);
                        $.lineTo(i.x - w, i.y - b);
                        $.closePath();
                        $.fill()
                    }
                }
                if (q.sid === z.sid && !q.isAI) {
                    Ci.forEach(e => {
                        if (e.purpose === "formation" && e.showSID) {
                            $.globalAlpha = 1;
                            $.textAlign = "center";
                            $.fillStyle = "white";
                            $.font = "19px Lilita One";
                            $.strokeStyle = "black";
                            $.lineWidth = 6;
                            $.strokeText(e.sid, e.x - w, e.y - b);
                            $.fillText(e.sid, e.x - w, e.y - b)
                        }
                    });
                    $.globalAlpha = 1;
                    $.lineWidth = 5;
                    for (let e = 0; e < Q.length; e++) {
                        if (Q[e].group !== undefined && Q[e].type === null && Q[e].distance <= 300 && ks.checked && Q[e].health !== Q[e].maxHealth) {
                            const F = Q[e].health;
                            $.fillStyle = bo.checked ? "black" : z.sid == Q[e].owner.sid ? de("#657ba3", .35) : te(Q[e].owner.sid) && Q[e].owner.sid !== z.sid ? de("#657ba3", .35) : de("#a4628a", .35);
                            $.roundRect(Q[e].x - w - 33 - K.healthBarPad, Q[e].y - b + Q[e].scale + K.nameY - 90, 1.45 * 45 + 2 * K.healthBarPad, 17, 10);
                            $.fill();
                            $.fillStyle = bo.checked ? z.sid == Q[e].owner.sid ? "#2693c7" : te(Q[e].owner.sid) && Q[e].owner.sid != z.sid ? "#2693c7" : "#c9346b" : z.sid == Q[e].owner.sid ? "#93d1fa" : te(Q[e].owner.sid) && Q[e].owner.sid !== z.sid ? "#93d1fa" : "#d38595";
                            $.roundRect(Q[e].x - w - 33, Q[e].y - b + Q[e].scale + K.nameY - 90 + K.healthBarPad, 1.45 * 45 * (Q[e].health / Q[e].maxHealth), 17 - 2 * K.healthBarPad, 10);
                            $.fill()
                        }
                        if (Q[e].group !== undefined && Q[e].owner?.sid > 0 && Q[e].active !== 0 && As.checked) {
                            $.fillStyle = bo.checked ? te(Q[e].owner.sid) ? "#2693c7" : "#c9346b" : te(Q[e].owner.sid) ? "#93d1fa" : "#d38595";
                            $.textBaseline = "middle";
                            $.textAlign = "center";
                            $.font = "13px Lilita One";
                            $.strokeStyle = bo.checked ? "black" : "#212123";
                            $.strokeText(Q[e].owner.sid.toString(), Q[e].x - w, Q[e].y - b + Q[e].scale - 20);
                            $.fillText(Q[e].owner.sid.toString(), Q[e].x - w, Q[e].y - b + Q[e].scale - 20)
                        }
                    }
                    $.globalAlpha = 1;
                    if (kt.length && Gs.checked) {
                        $.globalAlpha = 1;
                        $.textAlign = "center";
                        $.fillStyle = "#fff";
                        $.font = "20px Lilita One";
                        $.strokeStyle = "#212123";
                        $.lineWidth = 3;
                        $.strokeText(le(kt), q.x - w, q.y - b - 50);
                        $.fillText(le(kt), q.x - w, q.y - b - 50)
                    }
                }
                if (q.sid === z.sid && ws.checked) {
                    $.globalAlpha = .45;
                    Wi.forEach(e => {
                        "#212123";
                        $.fillStyle = e.assumeBreak ? "#c9346b" : "#2693c7";
                        $.strokeStyle = e.assumeBreak ? "#c9346b" : "#2693c7", $.beginPath();
                        $.arc(e.x - w, e.y - b, e.scale * .35, 0, ae);
                        $.fill();
                        $.stroke()
                    })
                }
                if (q.sid == z.sid && ws.checked && vs.checked) {
                    $.globalAlpha = 1;
                    $.textAlign = "center", $.fillStyle = "#fff", $.font = "20px Lilita One";
                    $.strokeStyle = "black";
                    $.lineWidth = 3;
                    $.strokeText(He, q.x - w, q.y - b - 100 + q.scale + K.nameY - 70);
                    $.fillText(He, q.x - w, q.y - b - 100 + q.scale + K.nameY - 70)
                }
                if (Y3 && Y3.length && q.sid == z.sid) {
                    $.lineCap = "round";
                    $.strokeStyle = "white";
                    $.lineWidth = 3;
                    $.beginPath();
                    var m = Y3.length;
                    $.moveTo(Y3[0] - w, Y3[1] - b);
                    for (let e = 0; e < m; e += 2) {
                        $.lineTo(Y3[e] - w, Y3[e + 1] - b);
                        $.stroke()
                    }
                }
                $.strokeStyle = P0;
                $.globalAlpha = 1;
                q.health2 += (q.health - q.health2) * .5;
                if (q.health > 0 && !Ei.includes(q.sid) || G?.["do"] && ts?.bot?.sid == q.sid) {
                    let e = bo.checked ? 0 : 20;
                    $.fillStyle = P0;
                    $.roundRect(q.x - w - K.healthBarWidth - K.healthBarPad, q.y - b + q.scale + K.nameY - e, K.healthBarWidth * 2 + K.healthBarPad * 2, 17, 8);
                    $.fill();
                    $.fillStyle = bo.checked ? P0 : de(q.isAI ? "#f2eff9" : q === z ? "#a0cac2" : q.team && q.team == z.team ? "#a6c7e7" : "#ebaebc", .35);
                    $.roundRect(q.x - w - K.healthBarWidth, q.y - b + q.scale + K.nameY + K.healthBarPad - e, K.healthBarWidth * 2, 17 - K.healthBarPad * 2, 7);
                    $.fill();
                    $.fillStyle = bo.checked ? q == z || q.team && q.team == z.team ? "#8ecc51" : "#cc5151" : q.isAI ? "#f2eff9" : q === z ? "#a0cac2" : q.team && q.team == z.team ? "#a6c7e7" : "#ebaebc";
                    let t = !bo.checked ? q.isAI ? q.health2 : q.lastHealth == undefined || q.animatedHealth == undefined ? q.health2 : q.lastHealth + (q.health - q.lastHealth) * j(1, oe(0, 1 - re(1 - j(1, (Date.now() - q.animatedHealth) / 250), 2))) : q.health;
                    let n = t / q.maxHealth;
                    let i = K.healthBarWidth * 2 * n;
                    $.roundRect(q.x - w - K.healthBarWidth, q.y - b + q.scale + K.nameY + K.healthBarPad - e, i, 17 - K.healthBarPad * 2, 7);
                    $.fill()
                }
            } U1.update(mh, $, w, b);
        let n = J.concat(ts.players, es.rPlayer);
        for (var s = 0; s < n.length; ++s) {
            if (q = n[s], q?.visible && !Ei.includes(q?.sid) && q.chatCountdown > 0) {
                q.chatCountdown -= mh, q.chatCountdown <= 0 && (q.chatCountdown = 0);
                $.font = "32px Lilita One";
                const v = $.measureText(q.chatMessage);
                $.strokeStyle = "2d3030";
                $.textBaseline = "middle", $.textAlign = "center";
                var p = q.x - w,
                    h = q.y - q.scale - b - 90;
                const c = 47,
                      e = v.width + 17;
                $.lineWidth = 11;
                $.strokeStyle = "black";
                $.fillStyle = $.color;
                $.strokeText(q.chatMessage, p, h);
                $.fillStyle = "rgba(0,0,0,0.2)";
                $.roundRect(p - e / 2, h - c / 2, e, c, 6);
                $.fill();
                $.fillStyle = "#fff";
                $.fillText(q.chatMessage, p, h)
            }
            if (Zn.time > 0 && (q = n[s])?.sid == z?.sid && en) {
                Zn.time -= mh;
                $.font = "32px Lilita One";
                $.strokeStyle = "#2d3030";
                var g = $.measureText(Zn.message);
                $.textBaseline = "middle", $.textAlign = "center", p = q.x - w, h = q.y - q.scale - b - 140;
                var y = g.width + 17;
                $.fillStyle = "rgba(0,0,0,.5)", $.roundRect(p - y / 2, h - 23.5, y, 47, 6), $.fill(), $.fillStyle = "#fff", $.fillText(Zn.message, p, h)
            }
        }
        if (!Ss.checked) {
            Et += (1 - Et) / 160;
            const _ = $.getTransform();
            $.setTransform(1, 0, 0, 1, 0, 0);
            $.fillStyle = `rgba(${[24,0,82,.3].map(e=>e*Et).join(", ")})`;
            $.fillRect(0, 0, Xh.width, Xh.height);
            $.setTransform(_)
        }
    }
    Sp(mh)
}

function c2(t, n, i) {
    for (let e = 0; e < Ah.length; ++e) q = Ah[e], q.active && q.layer == t && (q.update(mh), q.active && cg(q.x - n, q.y - i, q.scale) && ($.save(), $.translate(q.x - n, q.y - i), $.rotate(q.dir), u2(0, 0, q, $), $.restore()))
}
const d2 = {};

function u2(e, t, n, i, s) {
    if (n.src) {
        var o = x.projectiles[n.indx].src,
            r = d2[o];
        if (!r) {
            r = new Image;
            r.onload = function() {
                this.isLoaded = true;
                fe.weapons[o] = Le(1, this, n.scale)
            };
            r.src = ".././img/weapons/" + o + ".png";
            d2[o] = r
        } else if (r && fe.weapons[o] == undefined) {
            r = new Image;
            r.onload = function() {
                this.isLoaded = true;
                fe.weapons[o] = Le(1, this, n.scale)
            };
            r.src = ".././img/weapons/" + o + ".png";
            d2[o] = r
        }
        if (r.isLoaded) {
            var a = Es.checked ? fe.weapons[o] : r;
            if (a) {
                i.drawImage(a, e - n.scale / 2, t - n.scale / 2, n.scale, n.scale)
            }
        }
    } else if (n.indx === 1) {
        i.fillStyle = "#939393";
        k(e, t, n.scale, i)
    }
}

function f2(e, t, n, i) {
    return {
        x: e + i * U(n),
        y: t + i * V(n)
    }
}

function h2() {
    const e = Ph - Oh / 2,
          t = Rh - Lh / 2;
    K1.animationTime += mh, K1.animationTime %= K.volcanoAnimationDuration;
    const n = K.volcanoAnimationDuration / 2,
          i = 1.7 + .3 * (S(n - K1.animationTime) / n),
          s = K.innerVolcanoScale * i;
    $.drawImage(K1.land, K1.x - K.volcanoScale - e, K1.y - K.volcanoScale - t, K.volcanoScale * 2, K.volcanoScale * 2), $.drawImage(K1.lava, K1.x - s - e, K1.y - s - t, s * 2, s * 2)
}

function p2(e, t, n, i) {
    const s = K.riverWidth + i,
          o = K.mapScale / 2 - t - s / 2;
    o < Lh && o + s > 0 && n.fillRect(0, o, Oh, s)
}
const m2 = .05;
const g2 = .025;
const y2 = .1;
const x2 = 1;

function w2(e) {
    if (!e.fadingOut) {
        e.opacity2 += m2;
        if (e.opacity2 >= x2) {
            e.opacity2 = x2;
            e.fadingOut = true
        }
    } else {
        e.opacity2 -= g2;
        if (e.opacity2 <= y2) {
            e.opacity2 = y2;
            e.fadingOut = false
        }
    }
    return e.opacity2
}

function b2(t, n, i, s) {
    let o, r, a, l;
    s = en ? Xt.concat(Ze, ts.builds, es.rBuilds) : kh;
    l = s.length;
    for (let e = 0; e < l; ++e) {
        q = s[e];
        if (!q || !q.active) continue;
        r = q.x + q.xWiggle - n;
        a = q.y + q.yWiggle - i;
        if (t === 0) q.update(mh);
        Wi;
        if (q.layer === t && cg(r, a, q.scale + (q.blocker || 0))) {
            if (Wi.some(e => e.sid === q.sid)) {
                w2(q);
                $.globalAlpha = q.hideFromEnemy ? .6 : q.preplace ? .7 : q.fake ? .3 : q.opacity2
            } else {
                $.globalAlpha = q.hideFromEnemy ? .6 : q.preplace ? .7 : q.fake ? .3 : q.opacity
            }
            if (q.isItem) {
                if (q.fake && !Ns.checked) {
                    $.save();
                    $.translate(r, a);
                    $.rotate(q.dir);
                    $.beginPath();
                    $.arc(0, 0, q.scale, 0, ae);
                    $.fillStyle = q.restricter ? "#6bed5f" : q.preplace ? "#d4577c" : "#7da7b1";
                    $.fill();
                    $.stroke();
                    $.restore()
                } else {
                    o = H2(q, false, false, q);
                    $.save();
                    $.translate(r, a);
                    $.rotate(q.dir);
                    $.drawImage(o, -(o.width / 2), -(o.height / 2));
                    if (q.blocker) {
                        $.strokeStyle = "#db6e6e";
                        $.globalAlpha = .3;
                        $.lineWidth = 6;
                        k(0, 0, q.blocker, $, false, true)
                    }
                    $.restore()
                }
            } else if (q.type === 4) {
                h2()
            } else {
                o = F2(q);
                $.drawImage(o, r - o.width / 2, a - o.height / 2)
            }
        }
    }
}
async function v2(e, t, n, i, s) {
    if (!i) {
        if (s = Hg(e)) {
            s.startAnim(t, n);
            k2(e, t, n, false);
            s.hitBuild = t
        }
        await A4();
        if (t) {
            s = Hg(e);
            ft.forEach(e => {
                e.attemptResolve(s, s.skinIndex, v)
            })
        }
    } else {
        s = i.findPlayer(e);
        s.startAnim(t, n)
    }
}

function k2(e, n, t, i, s, o) {
    if (!i) return pn.push({
        id: k2,
        data: [e, t, n, true]
    });
    o = Hg(e);
    if (o === null) return;
    n > 9 ? o.sr = 0 : o.pr = 0;
    o.slowMult -= x.weapons[n].hitSlow || .3;
    if (o.slowMult < 0) o.slowMult = 0;
    o.sid == z.sid && (z.invisTime = 1e3);
    o.skinIndex == 20 && n > 9 ? o.samRS = .78 : o.samRS = 1;
    o.skinIndex == 20 && n < 9 ? o.samRP = .78 : o.samRP = 1;
    s = Hg(e);
    let r = J.concat(bh);
    r.filter(e => {
        let t = e.sid != s.sid && se(s, e, "player") <= x.weapons[n].range && (s.team && s.team != e.team || !s.team) && X.getAngleDist(B(s, e), s.d2) <= h ? true : false;
        if (!e.isAI && t) {
            if (n >= 9 && (s.secondaryVar === 3 || s.skinIndex == 21) || n < 9 && (s.primaryVar === 3 || s.skinIndex == 21)) e.poison = 5
        }
        if (t) {
            if (s.skinIndex == 58 || s.skinIndex == 55 || s.tailIndex == 18) {
                s.gatherHeal = {
                    dmg: x.weapons[n].dmg,
                    tick: v
                }
            }
        }
    })
}

function A2(i, s, o, r) {
    for (let e = 0, n = J.concat(Ci, ts.players, es.rPlayers); e < n.length; ++e) {
        let t = n[e];
        if (t) {
            if (t?.zIndex == o) {
                t.animate(mh);
                if (t.fake) {
                    $.globalAlpha = t.vals && (t.vals = oe(0, t.vals -= t.decay))
                } else if (r) {
                    $.globalAlpha = .55
                } else if (Ei.includes(t.sid)) {
                    $.globalAlpha = .295
                } else {
                    $.globalAlpha = !Ls.checked ? 1 : .67
                }
                if (t.visible || t.fake || t.spectate) {
                    t.skinRot += .002 * mh;
                    let e = (t == z ? wm() : t.dir) + t.dirPlus;
                    $.save();
                    $.translate(t.x - i, t.y - s);
                    $.rotate(e);
                    I2(t, $);
                    $.restore()
                }
            }
        }
    }
}

function k(e, t, n, i, s, o) {
    i = i || $;
    i.beginPath();
    i.arc(e, t, n, 0, ae);
    o || i.fill();
    s || i.stroke()
}

function I2(e, t) {
    t = t || $, t.lineWidth = R0, t.lineJoin = "miter";
    const n = W / 4 * (x.weapons[e.weaponIndex].armS || 1),
          i = e.buildIndex < 0 && x.weapons[e.weaponIndex].hndS || 1,
          s = e.buildIndex < 0 && x.weapons[e.weaponIndex].hndD || 1;
    if (e.tailIndex > 0 && M2(e.tailIndex, t, e), e.buildIndex < 0 && !x.weapons[e.weaponIndex].aboveHand && (O2(x.weapons[e.weaponIndex], K.weaponVariants[e.weaponVariant]?.src, e.scale, 0, t), x.weapons[e.weaponIndex].projectile != null && !x.weapons[e.weaponIndex].hideProjectile && u2(e.scale, 0, x.projectiles[x.weapons[e.weaponIndex].projectile], $)), t.fillStyle = e.customColor, k(e.scale * U(n), e.scale * V(n), 14), k(e.scale * s * U(-n * i), e.scale * s * V(-n * i), 14), e.buildIndex < 0 && x.weapons[e.weaponIndex].aboveHand && (O2(x.weapons[e.weaponIndex], K.weaponVariants[e.weaponVariant]?.src, e.scale, 0, t), x.weapons[e.weaponIndex].projectile != null && !x.weapons[e.weaponIndex].hideProjectile && u2(e.scale, 0, x.projectiles[x.weapons[e.weaponIndex].projectile], $)), e.buildIndex >= 0) {
        const o = j2(x.list[e.buildIndex]);
        t.drawImage(o, e.scale - x.list[e.buildIndex].holdOffset, -o.width / 2)
    }
    k(0, 0, e.scale, t), e.skinIndex > 0 && (t.rotate(W / 2), C2(e.skinIndex, t, null, e));
    D2(e, t)
}
const S2 = {},
      E2 = {};
let T2;

function C2(e, t, n, i) {
    if (!(T2 = S2[e])) {
        var s = new Image;
        s.onload = function() {
            this.isLoaded = true;
            this.onload = null;
            fe.hats[e] = Le(1, this, o.scale)
        };
        s.src = ".././img/hats/hat_" + e + ".png";
        S2[e] = s;
        T2 = s
    }
    var o = n || E2[e];
    if (!o) {
        for (var r = 0; r < C0.length; ++r) {
            if (C0[r].id == e) {
                o = C0[r];
                break
            }
        }
        E2[e] = o
    }
    if (T2.isLoaded) {
        var a = gy("shadows")?.checked ? fe.hats[e] : T2;
        if (a) {
            t.drawImage(a, -o.scale / 2, -o.scale / 2, o.scale, o.scale)
        }
        if (!n && o.topSprite) {
            t.save();
            t.rotate(i.skinRot);
            C2(e + "_top", t, o, i);
            t.restore()
        }
    }
}

function B2(e, t, n, i, s, o, r) {
    let a = e[t];
    if (!a) {
        const c = new Image;
        c.onload = function() {
            this.isLoaded = true;
            this.onload = null;
            e[t] = Le(r, this, o)
        };
        c.src = i + t + s;
        a = c
    }
    const l = gy("shadows")?.checked ? e[t] : a;
    if (l) {
        n.drawImage(l, -s.scale / 2, -s.scale / 2, s.scale, s.scale)
    }
    if (!i && s.topSprite) {
        n.save();
        n.rotate(o.skinRot);
        B2(e, t + "_top", n, i, s, o, r);
        n.restore()
    }
}

function D2(e, t) {
    if (Y && e.sid == Y?.sid && jt) {
        t.strokeStyle = "blue";
        t.fillStyle = "blue";
        if (Ne(ne.x, ne.y) > 10) {
            t.beginPath();
            t.moveTo(0, 0);
            t.lineTo(ne.x, ne.y);
            t.stroke()
        }
    }
}
const P2 = {},
      R2 = {};

function M2(t, e, n) {
    let i = R2[t];
    if (!(T2 = P2[t])) {
        var s = new Image;
        s.onload = function() {
            this.isLoaded = true;
            fe.accessories[t] = Le("accessory", this, i.scale, i.scale, n.fake)
        };
        s.src = ".././img/accessories/access_" + t + ".png";
        P2[t] = s;
        T2 = s
    }
    if (!i) {
        for (let e = 0; e < B0.length; ++e)
            if (B0[e].id == t) {
                i = B0[e];
                break
            } R2[t] = i
    }
    if (T2.isLoaded) {
        var o = gy("shadows")?.checked ? fe.accessories[t] : T2;
        if (o) {
            e.save();
            e.translate(-20 - (i.xOff || 0), 0);
            if (i.spin) {
                e.rotate(n.skinRot)
            }
            e.drawImage(o, -i.scale / 2, -i.scale / 2, i.scale, i.scale);
            e.restore()
        }
    }
}
var N2 = {};

function O2(e, t, n, i, s) {
    var o = e.src + (t || ""),
        r = N2[o];
    if (!r) {
        r = new Image;
        r.onload = function() {
            this.isLoaded = true;
            fe.weapons[o] = Le("weapon", this, e.length, e.width)
        };
        r.src = ".././img/weapons/" + o + ".png";
        N2[o] = r
    } else if (r && fe.weapons[o] == undefined) {
        r = new Image;
        r.onload = function() {
            this.isLoaded = true;
            fe.weapons[o] = Le("weapon", this, e.length, e.width)
        };
        r.src = ".././img/weapons/" + o + ".png";
        N2[o] = r
    }
    if (r.isLoaded) {
        var a = gy("shadows")?.checked ? fe.weapons[o] : r;
        if (a) {
            s.drawImage(a, n + e.xOff - e.length / 2, i + e.yOff - e.width / 2, e.length, e.width)
        }
    }
}
const L2 = {};

function F2(e) {
    const n = e.y >= K.mapScale - K.snowBiomeTop ? 2 : e.y <= K.snowBiomeTop ? 1 : 0,
          i = e.type + "_" + e.scale + "_" + n;
    let s = Es.checked && !n ? 0 : 54;
    let o = L2[i + s];
    if (!o) {
        let t = Es.checked;
        const a = document.createElement("canvas");
        a.width = a.height = e.scale * 2.1 + R0;
        const l = a.getContext("2d");
        if (l.translate(a.width / 2, a.height / 2), l.rotate(X.randFloat(0, W)), l.strokeStyle = D0, l.lineWidth = R0, e.type == 0) {
            let e;
            for (var r = 0; r < 2; ++r) {
                l.shadowBlur = r === 0 && t ? 21 : 0;
                l.shadowColor = r === 0 && t ? "rgba(0, 0, 0, 1)" : 0;
                e = q.scale * (r ? .5 : 1), Q2(l, q.sid % 2 === 0 ? 5 : 7, e, e * .7), l.fillStyle = n ? r ? "#fff" : "#e3f1f4" : r ? "#b4db62" : "#9ebf57", l.fill(), r || l.stroke()
            }
        } else if (e.type == 1) {
            if (n == 2) l.fillStyle = "#606060", Q2(l, 6, e.scale * .3, e.scale * .71), l.fill(), l.stroke(), l.fillStyle = "#89a54c", k(0, 0, e.scale * .55, l), l.fillStyle = "#a5c65b", k(0, 0, e.scale * .3, l, !0);
            else {
                l.shadowBlur = t ? 22 : 0;
                l.shadowColor = t ? "rgba(0, 0, 0, 1)" : null;
                G2(l, 6, q.scale, q.scale * .7), l.fillStyle = n ? "#e3f1f4" : "#89a54c", l.fill(), l.shadowBlur = 0;
                l.shadowColor = null;
                l.stroke(), l.fillStyle = n ? "#6a64af" : "#c15555";
                let e;
                const c = 4,
                      d = rh / c;
                for (var r = 0; r < c; ++r) e = X.randInt(q.scale / 3.5, q.scale / 2.3), k(e * U(d * r), e * V(d * r), X.randInt(10, 12), l)
            }
        } else {
            e.type == 2 || e.type == 3;
            l.shadowBlur = t ? 12 : 0;
            l.shadowColor = t ? "rgba(0, 0, 0, 1)" : null;
            l.fillStyle = e.type == 2 ? n == 2 ? "#938d77" : "#939393" : "#e0c655", Q2(l, 3, e.scale, e.scale), l.fill(), l.stroke(), l.fillStyle = e.type == 2 ? n == 2 ? "#b2ab90" : "#bcbcbc" : "#ebdca3", l.shadowBlur = 0;
            l.shadowColor = null;
            Q2(l, 3, e.scale * .55, e.scale * .65), l.fill();
            l.shadowBlur = 0;
            l.shadowColor = null
        }
        o = a, L2[i + s] = o
    }
    return o
}

function _2(t, n, i) {
    const s = t.lineWidth || 0;
    i /= 2, t.beginPath();
    let o = ae / n;
    for (let e = 0; e < n; e++) t.lineTo(i + (i - s / 2) * U(o * e), i + (i - s / 2) * V(o * e));
    t.closePath()
}

function V2() {
    const e = K.volcanoScale * 2,
          t = document.createElement("canvas");
    t.width = e, t.height = e;
    const n = t.getContext("2d");
    n.strokeStyle = "#3e3e3e", n.lineWidth = R0 * 2, n.fillStyle = "#7f7f7f", _2(n, 10, e), n.fill(), n.stroke(), K1.land = t;
    const i = document.createElement("canvas"),
          s = K.innerVolcanoScale * 2;
    i.width = s, i.height = s;
    const o = i.getContext("2d");
    o.strokeStyle = D0, o.lineWidth = R0 * 1.6, o.fillStyle = "#f54e16", o.strokeStyle = "#f56f16", _2(o, 10, s), o.fill(), o.stroke(), K1.lava = i
}
V2();
const U2 = [];

function j2(i, e, s, o) {
    let t = Es.checked && !s && !e ? 0 : 54;
    let r = U2[i.id + t];
    if (!r || e || i.lastAnim != ws.checked) {
        const f = document.createElement("canvas");
        f.width = f.height = i.scale * 2.5 + R0 + (x.list[i.id].spritePadding || 0);
        const h = f.getContext("2d");
        let n = Es.checked && !s ? true : 0;
        h.shadowBlur = n ? 15 : 0;
        h.shadowColor = `rgba(0, 0, 0, 0.35)`;
        if (h.translate(f.width / 2, f.height / 2), h.rotate(e ? 0 : W / 2), h.strokeStyle = D0, h.lineWidth = R0 * (e ? f.width / 81 : 1), i.name == "apple") {
            h.fillStyle = "#c15555", k(0, 0, i.scale, h), h.fillStyle = "#89a54c";
            const p = -(W / 2);
            W2(i.scale * U(p), i.scale * V(p), 25, p + W / 2, h)
        } else if (i.name == "cookie") {
            h.fillStyle = "#cca861", k(0, 0, i.scale, h), h.fillStyle = "#937c4b";
            for (var a = 4, l = rh / a, c, d = 0; d < a; ++d) c = X.randInt(i.scale / 2.5, i.scale / 1.7), k(c * U(l * d), c * V(l * d), X.randInt(4, 5), h, !0)
        } else if (i.name == "cheese") {
            h.fillStyle = "#f4f3ac", k(0, 0, i.scale, h), h.fillStyle = "#c3c28b";
            for (var a = 4, l = rh / a, c, d = 0; d < a; ++d) c = X.randInt(i.scale / 2.5, i.scale / 1.7), k(c * U(l * d), c * V(l * d), X.randInt(4, 5), h, !0)
        } else if (i.name == "wood wall" || i.name == "stone wall" || i.name == "castle wall") {
            h.fillStyle = i.name == "castle wall" ? "#83898e" : i.name == "wood wall" ? "#a5974c" : "#939393";
            const p = i.name == "castle wall" ? 4 : 3;
            Q2(h, p, i.scale * 1.1, i.scale * 1.1), h.fill(), h.stroke(), h.fillStyle = i.name == "castle wall" ? "#9da4aa" : i.name == "wood wall" ? "#c9b758" : "#bcbcbc", Q2(h, p, i.scale * .65, i.scale * .65), h.fill()
        } else if (i.name == "spikes" || i.name == "greater spikes" || i.name == "poison spikes" || i.name == "spinning spikes") {
            let e = i.name == "spikes" ? 8 : 8.5;
            let t = i.name == "spikes" ? .6 : .65;
            h.shadowBlur = n ? e : 0;
            h.shadowColor = `rgba(0, 0, 0, ${t})`;
            h.fillStyle = i.name == "poison spikes" ? "#7b935d" : "#79A9CA";
            var u = i.scale * .6;
            if (s || (Os.checked ? true : !o?.fake)) {
                Q2(h, i.name == "spikes" ? 5 : 6, i.scale, u);
                h.fill();
                h.stroke();
                h.fillStyle = "#a5974c";
                h.shadowBlur = 0, h.shadowColor = null;
                k(0, 0, u, h);
                h.fillStyle = "#c9b758";
                k(0, 0, u / 2, h, !0)
            } else if (o?.fake) {
                h.strokeStyle = !o?.fake ? "#525252" : o?.restricter ? "#6bed5f" : o?.preplace ? "#d4577c" : "#000000", Q2(h, i.name == "spikes" ? 5 : 6, i.scale, u);
                h.stroke();
                h.shadowBlur = 0, h.shadowColor = null;
                if (!o?.fake) {
                    h.beginPath();
                    h.arc(0, 0, u, 0, ae);
                    h.stroke()
                }
            }
        } else if (i.name == "windmill" || i.name == "faster windmill" || i.name == "power mill") h.fillStyle = "#a5974c", k(0, 0, i.scale, h), h.fillStyle = "#c9b758", z2(0, 0, i.scale * 1.5, 29, 4, h), h.shadowBlur = 0, h.shadowColor = null, h.fillStyle = "#a5974c", k(0, 0, i.scale * .5, h);
        else if (i.name == "mine") h.fillStyle = "#939393", Q2(h, 3, i.scale, i.scale), h.fill(), h.stroke(), h.fillStyle = "#bcbcbc", Q2(h, 3, i.scale * .55, i.scale * .65), h.fill();
        else if (i.name == "sapling")
            for (var d = 0; d < 2; ++d) {
                var u = i.scale * (d ? .5 : 1);
                Q2(h, 7, u, u * .7), h.fillStyle = d ? "#b4db62" : "#9ebf57", h.fill(), d || h.stroke()
            } else if (i.name == "pit trap") {
                h.shadowBlur = n ? 8.5 : 0;
                h.shadowColor = `rgba(0, 0, 0, ${.65})`;
                if (s || (Os.checked ? true : !o?.fake)) {
                    h.fillStyle = "#a5974c", Q2(h, 3, i.scale * 1.1, i.scale * 1.1), h.fill(), h.stroke(), h.fillStyle = D0, Q2(h, 3, i.scale * .65, i.scale * .65), h.fill()
                } else if (o?.fake || o?.preplace) {
                    h.strokeStyle = !o?.fake ? "#525252" : o?.restricter ? "#6bed5f" : o?.preplace ? "#d4577c" : "#5e79db", Q2(h, 3, i.scale * 1.1, i.scale * 1.1), h.stroke();
                    if (!o?.fake) {
                        Q2(h, 3, i.scale * .65, i.scale * .65), h.stroke()
                    }
                }
            } else if (i.name == "boost pad") h.fillStyle = "#7e7f82", Y2(0, 0, i.scale * 2, i.scale * 2, h), h.fill(), h.stroke(), h.fillStyle = "#dbd97d", K2(i.scale * 1, h);
        else if (i.name == "turret") {
            h.fillStyle = "#a5974c", k(0, 0, i.scale, h), h.fill(), h.stroke(), h.fillStyle = "#939393";
            const p = 50;
            Y2(0, -p / 2, i.scale * .9, p, h), k(0, 0, i.scale * .6, h), h.fill(), h.stroke()
        } else if (i.name == "platform") {
            h.fillStyle = "#cebd5f";
            const p = 4,
                  m = i.scale * 2,
                  g = m / p;
            let e = -(i.scale / 2);
            for (var d = 0; d < p; ++d) Y2(e - g / 2, 0, g, i.scale * 2, h), h.fill(), h.stroke(), e += m / p
        } else i.name == "healing pad" ? (h.fillStyle = "#7e7f82", Y2(0, 0, i.scale * 2, i.scale * 2, h), h.fill(), h.stroke(), h.fillStyle = "#db6e6e", z2(0, 0, i.scale * .65, 20, 4, h, !0)) : i.name == "spawn pad" ? (h.fillStyle = "#7e7f82", Y2(0, 0, i.scale * 2, i.scale * 2, h), h.fill(), h.stroke(), h.fillStyle = "#71aad6", k(0, 0, i.scale * .6, h)) : i.name == "blocker" ? (h.fillStyle = "#7e7f82", k(0, 0, i.scale, h), h.fill(), h.stroke(), h.rotate(W / 4), h.fillStyle = "#db6e6e", z2(0, 0, i.scale * .65, 20, 4, h, !0)) : i.name == "teleporter" && (h.fillStyle = "#7e7f82", k(0, 0, i.scale, h), h.fill(), h.stroke(), h.rotate(W / 4), h.fillStyle = "#d76edb", k(0, 0, i.scale * .5, h, !0));
        r = f, e || (U2[i.id + t] = r)
    }
    i.lastAnim = ws.checked;
    return r
}

function H2(i, e, s, o) {
    let t = Es.checked && !s && !e ? 0 : 54;
    let r = U2[i.id + t];
    if (!r || e || i.lastAnim != ws.checked) {
        const f = document.createElement("canvas");
        f.width = f.height = i.scale * 2.5 + R0 + (x.list[i.id].spritePadding || 0);
        const h = f.getContext("2d");
        let n = Es.checked && !s ? true : 0;
        h.shadowBlur = n ? 15 : 0;
        h.shadowColor = `rgba(0, 0, 0, 0.35)`;
        if (h.translate(f.width / 2, f.height / 2), h.rotate(e ? 0 : W / 2), h.strokeStyle = D0, h.lineWidth = R0 * (e ? f.width / 81 : 1), i.name == "apple") {
            h.fillStyle = "#c15555", k(0, 0, i.scale, h), h.fillStyle = "#89a54c";
            const p = -(W / 2);
            W2(i.scale * U(p), i.scale * V(p), 25, p + W / 2, h)
        } else if (i.name == "cookie") {
            h.fillStyle = "#cca861", k(0, 0, i.scale, h), h.fillStyle = "#937c4b";
            for (var a = 4, l = rh / a, c, d = 0; d < a; ++d) c = X.randInt(i.scale / 2.5, i.scale / 1.7), k(c * U(l * d), c * V(l * d), X.randInt(4, 5), h, !0)
        } else if (i.name == "cheese") {
            h.fillStyle = "#f4f3ac", k(0, 0, i.scale, h), h.fillStyle = "#c3c28b";
            for (var a = 4, l = rh / a, c, d = 0; d < a; ++d) c = X.randInt(i.scale / 2.5, i.scale / 1.7), k(c * U(l * d), c * V(l * d), X.randInt(4, 5), h, !0)
        } else if (i.name == "wood wall" || i.name == "stone wall" || i.name == "castle wall") {
            h.fillStyle = i.name == "castle wall" ? "#83898e" : i.name == "wood wall" ? "#a5974c" : "#939393";
            const p = i.name == "castle wall" ? 4 : 3;
            Q2(h, p, i.scale * 1.1, i.scale * 1.1), h.fill(), h.stroke(), h.fillStyle = i.name == "castle wall" ? "#9da4aa" : i.name == "wood wall" ? "#c9b758" : "#bcbcbc", Q2(h, p, i.scale * .65, i.scale * .65), h.fill()
        } else if (i.name == "spikes" || i.name == "greater spikes" || i.name == "poison spikes" || i.name == "spinning spikes") {
            let e = i.name == "spikes" ? 8 : 8.5;
            let t = i.name == "spikes" ? .6 : .65;
            h.shadowBlur = n ? e : 0;
            h.shadowColor = `rgba(0, 0, 0, ${t})`;
            h.fillStyle = i.name == "poison spikes" ? "#7b935d" : "#79A9CA";
            var u = i.scale * .6;
            if (s || (Os.checked ? true : !o?.fake)) {
                Q2(h, i.name == "spikes" ? 5 : 6, i.scale, u);
                h.fill();
                h.stroke();
                h.fillStyle = "#a5974c";
                h.shadowBlur = 0, h.shadowColor = null;
                k(0, 0, u, h);
                h.fillStyle = "#c9b758";
                k(0, 0, u / 2, h, !0)
            } else if (o?.fake) {
                h.strokeStyle = !o?.fake ? "#525252" : o?.restricter ? "#6bed5f" : o?.preplace ? "#d4577c" : "#000000", Q2(h, i.name == "spikes" ? 5 : 6, i.scale, u);
                h.stroke();
                h.shadowBlur = 0, h.shadowColor = null;
                if (!o?.fake) {
                    h.beginPath();
                    h.arc(0, 0, u, 0, ae);
                    h.stroke()
                }
            }
        } else if (i.name == "windmill" || i.name == "faster windmill" || i.name == "power mill") h.fillStyle = "#a5974c", k(0, 0, i.scale, h), h.fillStyle = "#c9b758", z2(0, 0, i.scale * 1.5, 29, 4, h), h.shadowBlur = 0, h.shadowColor = null, h.fillStyle = "#a5974c", k(0, 0, i.scale * .5, h);
        else if (i.name == "mine") h.fillStyle = "#939393", Q2(h, 3, i.scale, i.scale), h.fill(), h.stroke(), h.fillStyle = "#bcbcbc", Q2(h, 3, i.scale * .55, i.scale * .65), h.fill();
        else if (i.name == "sapling")
            for (var d = 0; d < 2; ++d) {
                var u = i.scale * (d ? .5 : 1);
                Q2(h, 7, u, u * .7), h.fillStyle = d ? "#b4db62" : "#9ebf57", h.fill(), d || h.stroke()
            } else if (i.name == "pit trap") {
                h.shadowBlur = n ? 8.5 : 0;
                h.shadowColor = `rgba(0, 0, 0, ${.65})`;
                if (s || (Os.checked ? true : !o?.fake)) {
                    h.fillStyle = "#a5974c", Q2(h, 3, i.scale * 1.1, i.scale * 1.1), h.fill(), h.stroke(), h.fillStyle = D0, Q2(h, 3, i.scale * .65, i.scale * .65), h.fill()
                } else if (o?.fake || o?.preplace) {
                    h.strokeStyle = !o?.fake ? "#525252" : o?.restricter ? "#6bed5f" : o?.preplace ? "#d4577c" : "#5e79db", Q2(h, 3, i.scale * 1.1, i.scale * 1.1), h.stroke();
                    if (!o?.fake) {
                        Q2(h, 3, i.scale * .65, i.scale * .65), h.stroke()
                    }
                }
            } else if (i.name == "boost pad") h.fillStyle = "#7e7f82", Y2(0, 0, i.scale * 2, i.scale * 2, h), h.fill(), h.stroke(), h.fillStyle = "#dbd97d", K2(i.scale * 1, h);
        else if (i.name == "turret") {
            h.fillStyle = "#a5974c", k(0, 0, i.scale, h), h.fill(), h.stroke(), h.fillStyle = "#939393";
            const p = 50;
            Y2(0, -p / 2, i.scale * .9, p, h), k(0, 0, i.scale * .6, h), h.fill(), h.stroke()
        } else if (i.name == "platform") {
            h.fillStyle = "#cebd5f";
            const p = 4,
                  m = i.scale * 2,
                  g = m / p;
            let e = -(i.scale / 2);
            for (var d = 0; d < p; ++d) Y2(e - g / 2, 0, g, i.scale * 2, h), h.fill(), h.stroke(), e += m / p
        } else i.name == "healing pad" ? (h.fillStyle = "#7e7f82", Y2(0, 0, i.scale * 2, i.scale * 2, h), h.fill(), h.stroke(), h.fillStyle = "#db6e6e", z2(0, 0, i.scale * .65, 20, 4, h, !0)) : i.name == "spawn pad" ? (h.fillStyle = "#7e7f82", Y2(0, 0, i.scale * 2, i.scale * 2, h), h.fill(), h.stroke(), h.fillStyle = "#71aad6", k(0, 0, i.scale * .6, h)) : i.name == "blocker" ? (h.fillStyle = "#7e7f82", k(0, 0, i.scale, h), h.fill(), h.stroke(), h.rotate(W / 4), h.fillStyle = "#db6e6e", z2(0, 0, i.scale * .65, 20, 4, h, !0)) : i.name == "teleporter" && (h.fillStyle = "#7e7f82", k(0, 0, i.scale, h), h.fill(), h.stroke(), h.rotate(W / 4), h.fillStyle = "#d76edb", k(0, 0, i.scale * .5, h, !0));
        r = f, e || (U2[i.id + t] = r)
    }
    i.lastAnim = ws.checked;
    return r
}

function W2(e, t, n, i, s) {
    const o = e + n * U(i),
          r = t + n * V(i),
          a = n * .4;
    s.moveTo(e, t), s.beginPath(), s.quadraticCurveTo((e + o) / 2 + a * U(i + W / 2), (t + r) / 2 + a * V(i + W / 2), o, r), s.quadraticCurveTo((e + o) / 2 - a * U(i + W / 2), (t + r) / 2 - a * V(i + W / 2), e, t), s.closePath(), s.fill(), s.stroke()
}

function k(e, t, n, i, s, o) {
    i = i || $, i.beginPath(), i.arc(e, t, n, 0, ae), o || i.fill(), s || i.stroke()
}

function Q2(t, n, i, s) {
    let o = W / 2 * 3,
        r, a;
    const l = W / n;
    t.beginPath(), t.moveTo(0, -i - 25e-6);
    for (let e = 0; e < n; e++) r = U(o) * i, a = V(o) * i, t.lineTo(r, a), o += l, r = U(o) * s, a = V(o) * s, t.lineTo(r, a), o += l;
    t.lineTo(0, -i), t.closePath()
}

function Y2(e, t, n, i, s, o) {
    s.fillRect(e - n / 2, t - i / 2, n, i), o || s.strokeRect(e - n / 2, t - i / 2, n, i)
}

function z2(e, t, n, i, s, o, r) {
    o.save(), o.translate(e, t), s = c(s / 2);
    for (let e = 0; e < s; e++) Y2(0, 0, n * 2, i, o, r), o.rotate(W / s);
    o.restore()
}

function G2(t, n, i, s) {
    let o = W / 2 * 3;
    const r = W / n;
    let a;
    t.beginPath(), t.moveTo(0, -s);
    for (let e = 0; e < n; e++) a = X.randInt(i + .9, i * 1.2), t.quadraticCurveTo(U(o + r) * a, V(o + r) * a, U(o + r * 2) * s, V(o + r * 2) * s), o += r * 2;
    t.lineTo(0, -s), t.closePath()
}

function K2(e, t) {
    t = t || $;
    const n = e * (D(3) / 2);
    t.beginPath(), t.moveTo(0, -n / 2), t.lineTo(-e / 2, n / 2), t.lineTo(e / 2, n / 2), t.lineTo(0, -n / 2), t.fill(), t.closePath()
}

function X2() {
    const e = K.mapScale / 2;
    C.add(0, e, e + 200, 0, K.treeScales[3], 0), C.add(1, e, e - 480, 0, K.treeScales[3], 0), C.add(2, e + 300, e + 450, 0, K.treeScales[3], 0), C.add(3, e - 950, e - 130, 0, K.treeScales[2], 0), C.add(4, e - 750, e - 400, 0, K.treeScales[3], 0), C.add(5, e - 700, e + 400, 0, K.treeScales[2], 0), C.add(6, e + 800, e - 200, 0, K.treeScales[3], 0), C.add(7, e - 260, e + 340, 0, K.bushScales[3], 1), C.add(8, e + 760, e + 310, 0, K.bushScales[3], 1), C.add(9, e - 800, e + 100, 0, K.bushScales[3], 1), C.add(10, e - 800, e + 300, 0, x.list[4].scale, x.list[4].id, x.list[10]), C.add(11, e + 650, e - 390, 0, x.list[4].scale, x.list[4].id, x.list[10]), C.add(12, e - 400, e - 450, 0, K.rockScales[2], 2)
}

function J2(e, t) {
    for (var n = 0; n < e.length; n += 8) {
        C.add(...e.slice(n, n + 6), x.list[e[n + 6]], true, e[n + 7] >= 0 ? {
            sid: e[n + 7]
        } : null);
        t = Hg(e[n + 7]);
        if (e[n + 7] !== null && t != null && L3(z, t)) {
            b4(Hg(e[n + 7]).loadout, e[n + 6])
        }
    }
}
async function q2(e, t) {
    await A4();
    if (q = Qg(t)) {
        q.xWiggle += K.gatherWiggle * U(e);
        q.yWiggle += K.gatherWiggle * V(e);
        q.tick = v;
        ft.push(new O3(e, q));
        q.lastHealth = q.health;
        q.animatedHealth = Date.now()
    }
}

function $2(e, t) {
    if (q = Qg(e)) {
        q.dir = t;
        q.xWiggle += K.gatherWiggle * U(t + W);
        q.yWiggle += K.gatherWiggle * V(t + W)
    }
}

function Z2(e, t, n, i, s, o, r, a, l) {
    N0 && (Ih.addProjectile(e, t, n, i, s, o, null, null, r).sid = a);
    if (!l) {
        tg(e, t, n, i, s, o)
    }
}

function eg(t, n) {
    n = Xt.filter(e => e.name == "platform");
    if (!n.length) return 0;
    for (let e = 0; e < n.length; e++) {
        if (S4(n[e], t) <= 35 + n[e].scale) {
            return 1
        }
    }
    return 0
}
async function tg(i, s, o, e, t, n, r, a, l, c) {
    if (r && !a && !l) return r.updater.push({
        id: tg,
        data: [i, s, o, e, t, n, r, true]
    });
    if (!r && !a && !l) return pn.push({
        id: tg,
        data: [i, s, o, e, t, n, false, true]
    });
    if (n == 1) {
        let e = v4(i, s);
        if (l && e) return e;
        if (e) return
    }
    let d = Infinity;
    let u = -1;
    let f = null;
    let h = P3(i, s, o + W, 70);
    for (let e = 0; e < J.length; e++) {
        c = J[e];
        if (t == 1.5 && n == 1) {
            if (c.visible && c.skinIndex == 53 && se({
                x: i,
                y: s
            }, c) <= 2) {
                f = c;
                break
            }
        }
        if (!(t == 1.5 && n == 1)) {
            if (c.visible && c?.weaponIndex == c?.secondary && c.d2 === o && x.weapons[c.weaponIndex].projectile == n && S4(h, c) <= 20) {
                f = c;
                break
            }
        }
    }
    if (l) return f;
    if (f) {
        Ln.push({
            x: f.x2,
            y: f.y2,
            dir: o,
            spd: t * (f.skinIndex === 1 ? 1.3 : 1),
            avoid: t == 1.5 || eg(f) ? 1 : 0,
            max: x.projectiles[n].range,
            dmg: x.projectiles[n].dmg,
            traveled: 0,
            owner: f,
            building: null,
            hit: null,
            info: x.projectiles[n]
        });
        let e = ng.find(e => e.player.sid === f.sid);
        if (!e) {
            ng.push({
                player: f,
                projs: [n],
                amt: 1,
                tick: v
            })
        } else {
            if (!e.projs.includes(n)) e.amt++;
            e.projs.push(n);
            e.tick = v
        }
    }
    if (t == 1.5 && n == 1 && f) {
        if (rn[f.sid] === 1 && !te(f.sid) && se(f, z) <= 300 && (f.primary === 5 && f.primaryVar >= 2 || f.primary === undefined)) {
            wn = 1;
            $y()
        }
        f.tr = 0
    }
    if (t != 1.5 && n != 1 && f) {
        f.skinIndex == 20 ? f.samRS = .78 : f.samRS = 1;
        f.sr = 0
    }
    if (f && !te(f.sid)) {
        let e = B({
            x: i,
            y: s
        }, z);
        let t = B(z, {
            x: i,
            y: s
        });
        let n = ng.find(e => e.player?.sid == f.sid);
        if (Ay(o, e) < .6 && n?.amt >= 3) {
            b(`anti bow insta ${f.name}[${f.sid}]`, "", "red", false, true);
            c4(cy, t);
            c4(ay, t);
            if (!z.inTrap) {
                T.send("a", o + Z(90))
            }
            p = true;
            I(6, 11);
            setTimeout(() => {
                c4(ry)
            }, ce);
            setTimeout(() => {
                c4(ry);
                c4(ry);
                T.send("a", undefined);
                p = false
            }, 222)
        }
    }
}
var ng = [];

function ig(t, n) {
    for (let e = 0; e < Ah.length; ++e) Ah[e].sid == t && (Ah[e].range = n)
}
async function sg(e) {
    if (q = Wg(e)) {
        q.startAnim();
        await A4();
        ft.forEach(e => {
            e.attemptResolve(1, 1, v, 0, q)
        })
    }
}

function og(n) {
    Xi = undefined;
    Ji = undefined;
    qi = undefined;
    for (var e = bh.length; e--;) {
        bh[e].forcePos = !bh[e].visible;
        bh[e].visible = false
    }
    if (n) {
        for (let e = 0, t = Date.now(); e < n.length; e += 7) {
            if (q = Wg(n[e])) {
                q.index = n[e + 1];
                q.t1 = q.t2 === undefined ? t : q.t2;
                q.t2 = t;
                q.x1 = q.x;
                q.y1 = q.y;
                q.x2 = n[e + 2];
                q.y2 = n[e + 3];
                q.d1 = q.d2 === undefined ? n[e + 4] : q.d2;
                q.d2 = n[e + 4];
                q.health = n[e + 5];
                q.dt = 0;
                q.visible = true
            } else {
                q = Sh.spawn(n[e + 2], n[e + 3], n[e + 4], n[e + 1]);
                q.x2 = q.x;
                q.y2 = q.y;
                q.d2 = q.dir;
                q.health = n[e + 5];
                if (!Sh.aiTypes[n[e + 1]].name) q.name = K.cowNames[n[e + 6]];
                q.forcePos = true;
                q.sid = n[e];
                q.visible = true
            }
            if (q.id < 6) continue;
            if (q.name === "MOOSTAFA") Xi = q;
            else if (q.name === "MOOFIE") Ji = q;
            else if (q.name === "Treasure") qi = q
        }
    }
}

function rg() {
    let {
        playerGathers: e,
        playerHits: a,
        objectsWiggled: t,
        newBuilds: n
    } = thisTick;
    let l = a.length;
    for (let e = t.length; e--;) {
        By((q = t[e]).ignoreWiggleDirs, q.wiggleDirs);
        let s = Xi ? P(Xi.y - q.y, Xi.x - q.x) : undefined;
        let o = Ji ? P(Ji.y - q.y, Ji.x - q.x) : undefined;
        let r = qi ? P(qi.y - q.y, qi.x - q.x) : undefined;
        for (let e = q.wiggleDirs.length, t, n, i; e--;) {
            for (n = l, t = q.wiggleDirs[e]; n--;) {
                if (X.getAngleDist(P(q.y - (i = a[n]).y2, q.x - i.x2), t) <= .05) {
                    q.wiggleDirs[e] = undefined;
                    q.health -= i.gatherWeapon.dmg;
                    (i.gatherWeapon.sDmg || 1) * (i.skinObj?.bDmg || 1);
                    U1.showText(q.x, q.y, 20, .085, 350, H(i.gatherWeapon.dmg * (i.gatherWeapon.sDmg || 1) * (i.skinObj?.bDmg || 1)), "#00aaff");
                    break
                }
            }
            if (X.getAngleDist(t, s) <= .05 || X.getAngleDist(t, o) <= .05) {
                q.wiggleDirs[e] = undefined;
                q.health -= 100;
                U1.showText(q.x, q.y, 20, .085, 350, 100, "#00aaff");
                break
            } else if (X.getAngleDist(t, r) <= .05) {
                q.wiggleDirs[e] = undefined;
                q.health -= 200;
                U1.showText(q.x, q.y, 20, .085, 350, 200, "#00aaff");
                break
            }
        }
    }
    let i = t.length;
    for (; i--;) {
        t[i].ignoreWiggleDirs.length = 0
    }
    t.length = a.length = e.length = n.length = 0
}
const ag = {};

function lg(e, t) {
    const n = e.index;
    let i = ag[n];
    if (!i) {
        const s = new Image;
        s.onload = function() {
            this.isLoaded = !0, this.onload = null
        }, s.src = "./img/animals/" + e.src + ".png", i = s, ag[n] = i
    }
    if (i.isLoaded) {
        const s = e.scale * 1.2 * (e.spriteMlt || 1);
        t.drawImage(i, -s, -s, s * 2, s * 2)
    }
}

function cg(e, t, n) {
    return e + n >= 0 && e - n <= Oh && t + n >= 0 && t - n <= Lh
}

function dg(t, n, i) {
    let e = jg(t[0]);
    if (!i) {
        !e && !n && !i && b(`Encountered ${t[2]}[${t[1]}]`, "", "#15c283");
        e || (e = new mc(t[0], t[1], K, X, Ih, C, J, bh, x, C0, B0), J.push(e)), e.spawn(n ? dh : null), e.visible = !1, e.x2 = void 0, e.y2 = void 0, e.setData(t, e), n && (z = e, Ph = z.x, Rh = z.y, Lp(), Zm(), o2(), s2(0), s0.style.display = "block")
    } else {
        let e = i.findPlayer(t[1]);
        e || (e = new mc(t[0], t[1], K, X, Ih, C, i.players, bh, x, C0, B0), i.players.push(e));
        e.spawn(n ? dh : null);
        e.visible = !1;
        e.x2 = void 0;
        e.y2 = void 0;
        e.setData(t, e, true);
        return
    }!e.customColor && (e.customColor = Array.from(F)[f(Math.random() * F.size)]);
    !e.color && (e.color = Hy(J));
    rn[t[1]] = 1, an[t[1]] = 1, e.pr = 1, e.sr = 1;
    !e.seenCount ? e.seenCount = 1 : e.seenCount++, e.primary = null;
    e.secondary = null;
    e.samRP = 1;
    e.didDeath = false;
    e.samRS = 1;
    e.noAntiList = e.noAntiList ?? new Array(10).fill(0);
    e.healArr = [];
    e.loadout = {
        spike: x.list[9],
        spawnpad: false,
        utility: undefined,
        windmill: undefined,
        trap: true,
        wall: x.list[3],
        food: x.list[0]
    };
    ln[t[1]] = 1;
    e.deathDmgs = [];
    e.dmgsNow = [];
    !e.trackLeak && (e.trackLeak = []);
    !e.trackGain && (e.trackGain = []);
    e.tr = 1;
    e.shameCount = 0;
    e.healTrack = [];
    e.Alive = true;
    if (e.seenCount > 1 && !n) b(`Encountered ${t[2]}[${t[1]}] ${m4(e.seenCount)} time`, "", "#15c283");
    if (e.sid === z.sid && Hn) Ki.send(le({
        updating: z,
        server: location.href
    }))
}

function ug(t) {
    ie.length && (ie = ie.filter(e => e.HERE));
    Ln.length && (Ln = Ln.filter(e => e.owner.sid != t));
    $0 = $0.filter(e => e.sid != t);
    for (let e = 0; e < J.length; e++)
        if (J[e].id == t) {
            b(`${J[e].name}[${J[e].sid}] has left`, " ", "red");
            J.splice(e, 1);
            break
        }
}

function fg(e, t) {
    z && (z.itemCounts[e] = t);
    pg(e)
}
var hg = [];

function pg(i = undefined) {
    for (let n = 3; n < x.list.length; ++n) {
        let e = x.list[n].group.id;
        let t = x.weapons.length + n;
        if (!hg[t]) {
            hg[t] = document.createElement("div");
            hg[t].id = "itemCount" + t;
            gy("actionBarItem" + t).appendChild(hg[t]);
            hg[t].style = `
                        display: block;
                        position: absolute;
                        padding-left: 5px;
                        font-size: 2em;
                        color: #fff;
                        `;
            hg[t].innerHTML = z.itemCounts[e] || 0
        } else {
            if (i == e) hg[t].innerHTML = z.itemCounts[i] || 0
        }
    }
}
let mg = ["food", "stone", "wood"];
async function gg(e, t, n) {
    if (z) {
        z[e] = t;
        if (mg.includes(e.toString())) {
            const i = parseInt(document.getElementById(`${e}Display`).innerText),
                  s = t - i;
            await A4();
            if (s > 0) {
                if (!z.weaponXP[z.weaponIndex]) z.weaponXP[z.weaponIndex] = 0;
                z.weaponXP[z.weaponIndex] += s
            }
        }
        n && Zm()
    }
}

function yg(e, t) {
    if (!(q = Hg(e))) return;
    let n = Date.now();
    let i = t - q.health;
    q.isPlayer && q.healArr.push([i, t, n]);
    q.lastHealth = q.health;
    q.animatedHealth = Date.now();
    q.health = t
}

function xg(e, t) {
    const n = e.concat(t);
    const i = n.filter((t, e, n) => {
        return e === n.findIndex(e => e.sid === t.sid)
    });
    return i
}

function wg(s, t, e = Q) {
    let o = e.filter(e => se(z, e, "object") <= t);
    let r = B(z, s);
    let a = [s];
    let l = 0;
    let c = 0;
    for (let t = 0; t < 36; t++) {
        let n = B(z, s) + Z(t * 10);
        let i = [];
        let e = o.reduce((e, t) => {
            if (X.getAngleDist(B(z, t), n) <= h && X.getAngleDist(B(z, s), n) <= h) {
                i.push(t);
                return e + 1
            }
            return e
        }, 0);
        if (X.getAngleDist(B(z, s), n) <= h) {
            if (e > c) {
                c = e;
                r = n;
                a = i
            }
        }
        if (e > l) {
            l = e
        }
    }
    Wi.push(a);
    Wi = Wi.flat();
    return r
}

function bg(o, t, e = Q) {
    let r = e.filter(e => se(z, e, "object") <= t);
    let a = B(z, o);
    let l = [o];
    if (r.length > 1) {
        let s = 0;
        for (let t = 0; t < 36; t++) {
            let n = B(z, o) + Z(t * 10);
            let i = [];
            let e = r.reduce((e, t) => {
                if (X.getAngleDist(B(z, t), n) <= h && X.getAngleDist(B(z, o), n) <= h) {
                    i.push(t);
                    return e + 1
                }
                return e
            }, 0);
            if (e > s) {
                s = e;
                a = n;
                l = i
            }
        }
    }
    Wi.push(l);
    Wi = Wi.flat();
    return a
}

function vg(o, t, e = Q) {
    let r = e.filter(e => se(z, e, "object") <= t);
    let a = B(z, o);
    let l = [o];
    if (r.length > 1) {
        let s = 0;
        for (let t = 0; t < 36; t++) {
            let n = B(z, o) + Z(t * 10);
            let i = [];
            let e = r.reduce((e, t) => {
                if (X.getAngleDist(B(z, t), n) <= h && X.getAngleDist(B(z, o), n) <= h) {
                    i.push(t);
                    return e + 1
                }
                return e
            }, 0);
            if (e > s) {
                s = e;
                a = n;
                l = i
            }
        }
    }
    Wi.push(l);
    Wi = Wi.flat();
    return a
}

function kg(e, t) {
    const n = e.x2 - t.x;
    const i = e.y2 - t.y;
    return n * n + i * i
}

function Ag(e, t, n) {
    const i = t.reduce((e, t) => e + t.x, 0) / t.length;
    const s = t.reduce((e, t) => e + t.y, 0) / t.length;
    const o = P(s - e.y2, i - e.x2);
    if (!n) return o;
    if (n) return {
        x: i,
        y: s
    }
}

function Ig(e, t, n) {
    const i = t.reduce((e, t) => e + t.x2, 0) / t.length;
    const s = t.reduce((e, t) => e + t.y2, 0) / t.length;
    const o = P(s - e.y2, i - e.x2);
    if (!n) return o;
    if (n) return {
        x: i,
        y: s
    }
}
var Sg;

function Eg(e, t, n, i, s) {
    if (!(v > 5 && !Ci.length)) return;
    s.x = e;
    s.x2 = t;
    s.x1 = e;
    s.y = t;
    s.y1 = t;
    s.y2 = t;
    s.sid = 1e3;
    s.distance = 1e4
}

function Tg(n, e) {
    Q.forEach(e => {
        e.assumeBreak = false
    });
    for (let e = 0; e < J.length; e++) {
        if (!J[e].visible || z.sid === J[e].sid) continue;
        n = J[e];
        n.bDmg = n?.secondary === 10 && (n.sr === 1 || Bi && _y(n, Bi) === 1) ? {
            dmg: 10 * (En[n.secondaryVar] * 7.5 * 3.3),
            wep: 10
        } : n?.primary && (n?.pr === 1 || n.weaponIndex == n.primary && Bi && _y(n, Bi) === 1) ? {
            dmg: x.weapons[n?.primary]?.dmg * 3.3 * En[n.primaryVar],
            wep: n.primary
        } : 0;
        if (n.bDmg === 0) continue;
        for (let t = 0; t < Q.length; t++) {
            if (Q[t].type !== null || !Q[t]?.owner?.sid) continue;
            let e = se(n, Q[t], "object") <= x.weapons[n.bDmg.wep].range;
            e && (!Q[t].dmgpot || Q[t].dmgpot < n.bDmg.dmg) && (Q[t].dmgpot = n.bDmg.dmg);
            if (Q[t].dmgpot >= Q[t].health && e) {
                Q[t].assumeBreak = true;
                continue
            }
        }
    }
}

function Cg(t, n, i, s, o, e, r, a, l, c, d, u) {
    if (!vn.length) return;
    for (let e = vn.length; e--;) {
        if (vn[e].skinIndex == 11 || vn[e].tailIndex == 21 || vn[e].tailIndex == 16) {
            a = B(z, vn[e]);
            if (se(z, vn[e], "player") <= x.weapons[n].range && X.getAngleDist(a, t) <= h) {
                l = x.weapons[n].dmg * (C0.find(e => e.id === s)?.dmgMultO || 1) * (B0.find(e => e.id === o)?.dmgMultO || 1) * En[i];
                d = vn[e].skinIndex === 11 ? .45 : 0;
                u = vn[e].tailIndex === 21 ? .25 : vn[e].tailIndex === 16 ? .15 : 0;
                c = l * (d + u);
                if (n === 10 && z.sr === 1 || n != 10 && z.pr === 1) {
                    U1.showText(vn[e].x2, vn[e].y2, 20, .18, 300, c, "#fff")
                }
            }
        }
    }
}

function Bg(e, n, i, s, o, t, r, a, l) {
    for (let t = 0; t < Q.length; t++) {
        a = B(z, Q[t]);
        if (se(z, Q[t], "object") <= x.weapons[n].range && X.getAngleDist(a, e) <= h && Q[t].type === null) {
            l = x.weapons[n].dmg * (n === 10 ? 7.5 : 1) * (s === 40 ? 3.3 : 1) * En[i];
            let e = (n === 10 && z.sr === 1 || n != 10 && z.pr === 1) && Q[t].dmgpot + l >= Q[t].health;
            if (o && !e) Wi.push(Q[t]);
            if (e) {
                Q[t].assumeBreak = true;
                Q[t].manualBreak = true;
                Wi.push(Q[t])
            }
        }
    }
}

function Dg(n, e, i) {
    if ((m.q >= 1 || xn) && lo.checked) return true;
    if (!ho.checked) return false;
    if (!po.checked) return true;
    let t = bh.filter(e => e.visible);
    let s = Xt.concat(t, n.enemies);
    let o = Infinity;
    let r = null;
    s.forEach(t => {
        let e = t.realScale ? t.realScale : t.scale;
        if (X.lineInRect((t.x2 || t.x) - e, (t.y2 || t.y) - e, (t.x2 || t.x) + e, (t.y2 || t.y) + e, n.x2, n.y2, n.x2 + i * U(n.dir), n.y2 + i * V(n.dir))) {
            const e = S4(n, t);
            if (e < o) {
                o = e;
                r = t
            }
        }
    });
    return r.isPlayer && e.sid == r.sid
}
let Pg = [];

function Rg(e) {
    let n = bh.filter(e => e.visible);
    let t = [];
    for (let c = 0; c < Ln.length; c++) {
        let s = Infinity;
        let o = Infinity;
        let r = [];
        let a = Ln[c];
        let t = Hg(a.owner.sid);
        if (!t) {
            Ln.splice(c, 1);
            continue
        }
        let e = J.filter(e => e.visible && !(typeof t.team == "string" && e.team == t.team) && e.sid != t.sid);
        let l = Xt.filter(e => !e.ignoreCollision && e.elevation > a.avoid).concat(n, e);
        for (let i = 0; i < l.length; i++) {
            let e = l[i];
            let t = e.realScale ? e.realScale : e.scale;
            const n = S4(a, e);
            r[0] = X.lineInRect((e.x2 || e.x) - t, (e.y2 || e.y) - t, (e.x2 || e.x) + t, (e.y2 || e.y) + t, a.owner.x2, a.owner.y2, a.x + a.spd * ce * U(a.dir), a.y + a.spd * ce * V(a.dir));
            r[1] = X.lineInRect((e.x2 || e.x) - t, (e.y2 || e.y) - t, (e.x2 || e.x) + t, (e.y2 || e.y) + t, a.owner.x2, a.owner.y2, a.x + a.spd * u * U(a.dir), a.y + a.spd * u * V(a.dir));
            if (r[0]) {
                if (n < s) {
                    s = n;
                    Ln[c].hit = e;
                    if (e.realScale) {
                        Ln[c].building = e
                    } else Ln[c].building = null
                }
            }
            if (r[1]) {
                if (n < o) {
                    o = n;
                    Ln[c].futureHit = e
                }
            }
        }
        if (Ln[c].futureHit && !Ln[c].hit) {
            if (Ln[c].futureHit.isPlayer) {
                Hg(Ln[c].futureHit.sid).hitProjs += Ln[c].dmg;
                if (z.sid == Ln[c].futureHit.sid) b(`updated projectile dmgpot`, "", "red");
                if (oo.checked) b(`${Ln[c].futureHit.name}[${Ln[c].futureHit.sid}] getting hit next tick ${v+1} by ${Ln[c].info.src}[${Ln[c].owner.sid}]`, "", "red");
                if (Ln[c].owner.sid != z.sid && te(Ln[c].owner.sid) && Y && Ln[c].futureHit.sid == Y.sid) {
                    U1.showText(Hg(Ln[c].futureHit.sid).x2, Hg(Ln[c].futureHit.sid).y2, 20, .18, 300, "sync ally proj hit", "#fff");
                    if (ee == 5 && Y && !p && (se(z.np.accel, Y.np.real, "player") <= x.weapons[ee].range || se(z, Y, "player") <= x.weapons[ee].range) && z.pr == 1 && z.sr == 1 && en && o4(z, Y)) {
                        un = false;
                        p = true;
                        I(7, 18);
                        g[0] = B(z, Y);
                        ct = true;
                        T.send("D", B(z, Y), "client");
                        T.send("G", ee, true);
                        y = ee;
                        setTimeout(() => {
                            p = false
                        }, 120)
                    }
                }
            }
        }
        Ln[c].x += a.spd * ce * U(a.dir);
        Ln[c].y += a.spd * ce * V(a.dir);
        Ln[c].traveled += a.spd * ce;
        if (Ln[c].hit && oo.checked) b(`${Ln[c].info.src}[${Ln[c].owner.sid}] has hit ${Ln[c].hit.name} [${Ln[c].hit.sid}] on ${v}`, "", "red")
    }
    Ln.forEach(t => {
        if (t.building) {
            setTimeout(() => {
                ft.forEach(e => {
                    e.attemptResolve(1, 1, v, t)
                })
            }, 10)
        }
    });
    Ln = Ln.filter(e => {
        if (e.hit || e.traveled >= e.max) return;
        if (!e.hit && e.traveled < e.max) return e
    })
}

function Mg() {}

function Ng() {}

function Og() {
    m.f >= 1 && c4(z.items[4]);
    m.v >= 1 && c4(z.items[2]);
    m.h >= 1 && c4(hy);
    m.m >= 1 && c4(fy);
    m.i >= 1 && c4(ay, bm());
    m.j >= 1 && dy != null && c4(dy)
}

function Lg(e, t = {}, n) {
    const i = {
        ...e,
        tick: v
    };
    t.skinIndex = e.skinIndex;
    t.skinTick = v;
    t.tailIndex = e.tailIndex;
    t.tailTick = v;
    if (e.skinIndex !== t.skinIndex) {
        console.log(n, "OLD", i.skinIndex, "NEW", t.skinIndex)
    }
    if (e.tailIndex !== t.tailIndex) {
        console.log(n, "OLD", i.tailIndex, "NEW", t.tailIndex)
    }
}
async function Fg(i) {
    Qe = 0;
    At = false;
    $y();
    Ot = false;
    tn = Date.now();
    v++;
    if (!(v % 9)) {
        Ye.push(He);
        if (Ye.length > 5) Ye.shift();
        ze = c(Ye.reduce((e, t) => e + t) / Ye.length);
        He = 0
    }
    ss.length = ns.length = is.length = vn.length = Sn.length = 0;
    y = null;
    for (var e = J.length; e--;) {
        J[e].visible ? J[e].vis2 = true : J[e].vis2 = false;
        (q = J[e]).forcePos = !q.visible;
        q.visible = false
    }
    let n = ce,
        s = i.length;
    for (let e = 0, t = Date.now(); e < s; e += 13) {
        if (!(q = Hg(i[e]))) continue;
        q.t1 = void 0 === q.t2 ? t : q.t2, Xe[q.sid] = q, q.t2 = t, q.x1 = q.x, q.y1 = q.y, q.preX = q.x2, q.preY = q.y2, q.pmovDir = q.movDir, q.x2 = i[e + 1], q.y2 = i[e + 2], q.d1 = void 0 === q.d2 ? i[e + 3] : q.d2, q.d2 = i[e + 3], q.delta = q.dt, q.dt = 0, q.buildIndex = i[e + 4], q.weaponIndex = i[e + 5], q.xVel = q.x2 - q.preX, q.xVel2 = q.x2 - q.x1, q.yVel = q.y2 - q.preY, q.yVel2 = q.x2 - q.x1, q.weaponVariant = i[e + 6], q.team = i[e + 7], q.isLeader = i[e + 8], q.skinIndex = i[e + 9], q.skinIndex != 45 && (q.shameTimer = 30, q.clowned = false), q.skinIndex == 45 && q.shameTimer == 30 && x5(q), q.tailIndex = i[e + 10], q.iconIndex = i[e + 11], q.zIndex = i[e + 12], q.visible = true, q.slowMult = oe(1, q.slowMult + 8e-4 * n), q.movSpd = D((q.preY - q.y2) ** 2 + (q.preX - q.x2) ** 2), q.movSpd2 = D((q.y1 - q.y2) ** 2 + (q.x1 - q.x2) ** 2), q.movDir = P(q.y2 - q.preY, q.x2 - q.preX), (q.movDir == 0 && q.movSpd == 0 || q.preX == q.x2 && q.preY == q.y2) && (q.movDir = undefined), q.weaponIndex >= 9 ? q.secondary = q.weaponIndex : q.primary = q.weaponIndex, q.weaponIndex == q.primary && (q.primaryVar = q.weaponVariant), q.weaponIndex == q.secondary && (q.secondaryVar = q.weaponVariant), q.lastpr = q.pr, q.lastsr = q.sr, q.lasttr = q.tr, q.tick = v, xy(q), q.weaponE = q.weaponIndex == q.secondary ? q.sr : q.pr, q.multpr = q.lastpr == q.pr && q.pr == 0 ? (q.multpr = .015, q.lastpr = .015) : q.pr, q.multsr = q.lastsr == q.sr && q.sr == 0 ? (q.multsr = .015, q.lastsr = .015) : q.sr, q.hitProjs = 0, q.hitSpike = false, q.np = l4(q), q.inWater = q.y2 >= K.mapScale / 2 - K.riverWidth / 2 && q.y2 <= K.mapScale / 2 + K.riverWidth / 2, q.buildIndex != -1 && b4(q.loadout, q.buildIndex), q.assumeAge = g4(q);
        if (te(q.sid)) {
            Sn.push(q)
        } else {
            vn.push(q)
        }
    }
    rm();
    yy();
    if (z.d1 == z.dir && z.d2 == z.dir && g[0] === null) ct = false;
    ie.length && (ie = ie.filter(e => e.HERE));
    z.shameLeak = false;
    Og();
    await wx(1);
    Xt = kh.filter(e => (e.distance = X5(e.x - z.x2, e.y - z.y2)) <= 2e3);
    Q = Xt.filter(e => e.distance <= 800);
    $e = $e.filter(e => C.checkItemLocation(e.x, e.y, e.scale, .6, e.id, false) && v - e.sid <= 3);
    os = [];
    qm = false;
    Ve.forEach(e => e());
    Ve = [];
    pn.forEach(e => e.id(...e.data));
    pn = [];
    ri?.setPos(z.x2, z.y2);
    si?.setSend(T.send.bind(T));
    si?.setSelf(z);
    si?.updatePlayers(J);
    _ = false;
    for (let e = J.length; e--;) {
        if (i = J[e]) {
            i.visible && (i.weaponR = i.weaponIndex == i.secondary ? i.sr : i.pr);
            if (isNaN(i.poison)) i.poison = 0;
            i.poison > 0 && (i.poison = oe(0, i.poison - i.delta / 1e3));
            if (!i?.Alive2 && !i?.Alive) {
                let n = "";
                i.deathDmgs.forEach((e, t) => {
                    n += `${le(e)}`;
                    if (t < i.deathDmgs.length - 1) {
                        n += ", "
                    }
                });
                n = n.replace(/,/g, ", ");
                b(`${i.name}[${i.sid}] has died ${n}`, "", "#ed5a55");
                i.deaths++
            }
            i.Alive2 = true;
            if (hs.checked) {
                if (i.dmgs >= 0 && i.dmgs < 100 && (!Ei.includes(i.sid) || G["do"] && ts?.bot?.sid === i.sid)) U1.showText(i.x2, i.y2, 50, .18, 700, H(S(i.dmgs)), i.customColor);
                if (i.dmgs >= 100) U1.showText(i.x2, i.y2, 60, .18, 1e3, Fs.checked ? "☠️" : H(i.dmgs), i.customColor)
            }
            i.dmgs = "XD";
            if (i.vis2 == false && i.visible && i.buildIndex == -1) {
                if (i.weaponIndex != i?.primary && i.primaryVar <= 2) {
                    i.primaryVar = 3
                } else if (i.weaponIndex != i?.secondary && i.secondaryVar <= 2 && (i.secondary == 10 || i.secondary == 14)) i.secondaryVar = 3
            }
            if (i.healArr.length) {
                i.healArr.forEach(e => l5(i.sid, e[0], e[1], e[2])), i.healArr = []
            }
            if (i.dmgsNow.length) i.deathDmgs.push(i.dmgsNow);
            i.dmgsNow = [];
            if (i.health === 100) i.deathDmgs = [];
            i.bleed = i.lastBull ? ((v - i.lastBull + (i.sid === z.sid ? et : 0)) % 9 + 9) % 9 : undefined
        }
    }
    if (Ts.checked && window.pingTime >= 95) {
        z.Qheal = false;
        if (en && z?.dmgpot?.add + z?.dmgpot?.turretGear >= 100 && z.shameCount < 7 && !z.shameLeak) {
            p4();
            b(`AutoQ`, "", "#5c0620", false, true);
            z.Qheal = true
        } else if ((!_n && (z.health < 85 || z.shameCount > 0 && z.health < 100) || _n && z.health < 100) && en && z.skinIndex != 45) {
            setTimeout(() => {
                if (Ts.checked && z.health < 100 && (z.health > z.dmgpot?.hp * (z.skinIndex == 6 && !z.hitting && !p ? .75 : 1) || z.shameCount >= 7)) u4()
            }, 120 - xt + 9)
        }
    }
    if (en && zi.length > 0) {
        Gi = zi.reduce((e, t) => e + S(t.value), 0);
        U1.showText(zi[0].x, zi[0].y, 50, .18, 500, Gi, "#8ecc51");
        zi = []
    }
    if (!z.dmgpots) z.dmgpots = [];
    if (vn.length) {
        for (let e = vn.length; e--;) vn[e].distance = D((vn[e].x2 - z.x2) ** 2 + (vn[e].y2 - z.y2) ** 2);
        vn = vn.sort((e, t) => e.distance - t.distance)
    }
    Y = vn[0];
    xi.player = J.find(e => e.sid === xi.ID && e.visible);
    if (xi.player) {
        xi.player.positions = a4(xi.player, 6)
    } else if (Y) {
        xi.player = Y;
        xi.player.positions = a4(xi.player, 6)
    }
    z.antiOneTickBowInsta = false;
    z.hitting = false;
    z.movSpd != 0 && (z.invisTime = 1e3);
    z.movSpd == 0 && (z.invisTime -= z.delta);
    k4();
    if (!ie.length || !G["do"]) ts = {
        players: [],
        bot: null,
        builds: [],
        realBuilds: []
    };
    Zy();
    h3();
    w3();
    Ei = ie.map(e => e?.sid);
    ri?.setBuildings(kh);
    by();
    ri?.setSpeed(55 * x4(z));
    L5(ly, 1, 0, W / ls.value);
    let t = p == true || z.hitting ? true : false;
    Xs.checked && fs.checked && Y && Hn && Ki.send(le({
        team: z,
        busy: t,
        msg: "status",
        move: Dn,
        server: location.href
    }));
    e3();
    Yt = Yt.filter(t => v - t.TICK <= 200 && !L3(z, t) && !ie.find(e => L3(e, t)));
    if (Gn) {
        Hn && fs.checked && Ki.send(le({
            msg: "ping",
            player: z,
            time: tn,
            server: location.href
        }));
        Gn = oe(Gn - z.delta, 0)
    }
    s4();
    P5(un);
    Rg();
    cn = cn.filter(e => v - e.destroyedAt <= 2);
    for (let e = vn.length; e--;) {
        if (i = vn[e]) {
            if (i.distance <= 275) ss.push(i);
            i.kbpot = w5(i, z, B(i, z));
            i.KB = w5(z, i, B(z, i));
            i.placePot = i.distance <= 300 ? O5(i, i.loadout.spike.id, B(i, z)) : {
                onPlayer: [],
                possible: [],
                placeRange: null
            };
            i.dmgpot = m5(i);
            i.inTrap = false;
            i.globalTrap = false;
            for (let e = Xt.length; e--;) {
                if (Xt[e].name === "pit trap" && S4(i, Xt[e]) <= 47 && te(Xt[e]?.owner?.sid)) {
                    i.inTrap = Xt[e];
                    break
                }
            }
            for (let e = Xt.length; e--;) {
                if (Xt[e].name === "pit trap" && S4(i, Xt[e]) <= 47 && (te(Xt[e]?.owner?.sid) || !i.team && Xt[e]?.owner?.sid != i.sid)) {
                    i.globalTrap = Xt[e];
                    break
                }
            }
            if (i.inTrap) i.inTrap.angToMe = B(z, i.inTrap);
            const o = B(z, i),
                  e = se(z, i);
            if (se(z, i.np.accel) < se(z, i) && se(i.np.accel, z) < 200 && Ay(B(i, z), i.movDir) < 1 && i.movSpd >= 114 && z.delta < 123 && v - Xe[i.sid].tick <= 1) {
                if (hy != null && x.list[hy]?.name == "blocker" && z.canBuild(x.list[hy])) {
                    for (let e = 0; e < 18; e++) {
                        u5(hy, o + Z(e * 20));
                        u5(hy, o - Z(e * 20))
                    }
                    console.log("anti boost blocker")
                } else if (z.canBuild(x.list[ly])) {
                    u5(ly, o + Z(90));
                    u5(ly, o - Z(90));
                    u5(ly, o + Z(180));
                    console.log("anti boost spike")
                } else if (uy != null && z.canBuild(x.list[uy])) {
                    for (let e = 0; e < 18; e++) {
                        u5(uy, o + Z(e * 20));
                        u5(uy, o - Z(e * 20))
                    }
                    console.log("anti boost trap")
                } else {
                    for (let e = 0; e < 18; e++) {
                        u5(ay, o + Z(e * 20));
                        u5(ay, o - Z(e * 20))
                    }
                    console.log("anti boost wall")
                }
            }
            if (i.movSpd <= 5 && z.movSpd <= 5 && (i.secondary == 9 || i.secondary == null || i.secondary == undefined) && (e >= 665 && e <= 705)) {
                z.antiOneTickBowInsta = true
            }
        }
    }
    z.dmgpot = p5();
    Wi = [];
    Tg();
    sy();
    Yx();
    z.primaryVar > 1 && ee == 5 && A == 10 ? Yx() : Qx();
    jx();
    ii = Sn.find(e => e.sid == vt);
    ng = ng.filter(e => v - e?.tick <= 4);
    Nt = false;
    for (let e = Q.length; e--;) {
        if (D((Q[e].x - z.x2) ** 2 + (Q[e].y - z.y2) ** 2) > 350 && (!(Q[e].dmg || Q[e].trap) || Q[e]?.type !== 1 && Q[e].y < 12e3)) continue;
        if (Q[e].dmg || Q[e]?.type === 1 && Q[e].y >= 12e3) {
            ns.push(Q[e])
        } else if (Q[e].trap) {
            is.push(Q[e])
        }
    }
    for (let e = Q.length; e--;) {
        if ((q = Q[e]).trap) {
            if (D((q.x - z.x2) ** 2 + (q.y - z.y2) ** 2) <= 47 && !te(q?.owner?.sid)) {
                Nt = q;
                break
            }
        }
    }
    z.spikeTrap = Q.filter(e => Nt && e?.group?.name === "spikes" && (Y && se(z, Y) <= 130 && Ay(B(Y, e), B(Y, z)) <= 3 || se(z, e) <= 35 + e.realScale + 2) && !te(e.owner.sid) && se(z, e, "object") <= (A === 10 ? 75 : x.weapons[ee]?.range)).sort((e, t) => se(z, e, "object") - se(z, t, "object"))[0];
    Js.checked ? Ly() : Oy();
    fn && Nx();
    if (Cs.checked && ee == 5 && A == 10 && Y && !(Y.inTrap && Wx(x.list[ly], B(z, Y.inTrap), Y.inTrap) && jt && ee == 5 && z.primaryVar > 0) && !Mt && _y(Y) == 1 && !p && Y.weaponR != 1 && !gt && (Y.weaponIndex <= 10 && Y.weaponIndex != 9 && Y)) {
        if (Vy(z, Y, x.weapons[A].range, true) && o4(z, Y) && (z.primaryVar >= 1 || z.secondaryVar >= 1 && z.primaryVar < 1 && (v - Y?.lastBull) % 9 == 8) && Y.skinIndex == 6 && z.pr == 1 && z.sr == 1 && z.tr == 1 && Y) {
            ct = true;
            b(`AI on ${Y.name}[${Y.sid}]`, "", "#5c0620", false, true);
            p = true;
            y = A;
            I(53);
            T.send("G", A, true);
            g[0] = B(z, Y);
            T.send("D", g[0], "client");
            setTimeout(() => {
                y = ee;
                T.send("G", ee, true);
                I(7);
                g[0] = B(z, Y);
                T.send("D", g[0], "client")
            }, ce);
            setTimeout(() => {
                p = false;
                ct = false;
                g[0] = null
            }, u)
        }
    }
    if (Y && !Mt && !p && A == 10 && ee == 5 && Bs.checked) {
        let e = x.weapons[A].range;
        if (Y && Vy(z, Y, e, true) && Y && o4(z, Y) && (v - Y?.lastBull) % 9 == 8 && (z.primaryVar == 3 || z.primaryVar >= 2 && z.secondaryVar == 3) && Y.skinIndex != 6 && z.pr === 1 && z.sr === 1) {
            p = true;
            b(`Bleed Insta on ${Y.name}[${Y.sid}]`, "", "#5c0620", false, true);
            y = A;
            ct = true;
            T.send("G", A, true);
            g[0] = B(z, Y);
            I(7, 18);
            T.send("D", g[0], "client");
            setTimeout(() => {
                y = ee;
                T.send("G", ee, true);
                I(7, 18);
                g[0] = B(z, Y);
                T.send("D", g[0], "client")
            }, ce);
            setTimeout(() => {
                p = false;
                ct = false;
                y = null
            }, u)
        }
    }
    Hn && Ki.send(le({
        fixer: z,
        server: location.href,
        time: Date.now()
    }));
    Sg = no.checked ? Xt.filter(e => e.name == "turret" && se(z, e) <= 700 + z.movSpd && e?.time == 2200 && !te(e?.owner?.sid)) : [];
    z.doAssassin = io.checked && !Sg.length && Nn.includes(56) && z.invisTime <= 0 && "chatbox" !== document.activeElement.id.toLowerCase() && z.health === 100 && (Dn === undefined || Dn === null) && z.movSpd == 0 ? true : false;
    g[0] = null;
    Om();
    z.selectedWeapon = null;
    if (Nt && !p && Ds.checked) {
        let e;
        if (!(z.spikeTrap && Vs.checked)) {
            e = B(z, Nt);
            z.selectedWeapon = A == 10 && Nt.health - x.weapons[ee].dmg * K.weaponVariants[z.primaryVar].val <= 0 && (ee == 7 ? true : z.pr === 1)
        } else {
            e = B(z, z.spikeTrap);
            z.selectedWeapon = A == 10 && z.spikeTrap.health - x.weapons[ee].dmg * K.weaponVariants[z.primaryVar].val <= 0 && (ee == 7 ? true : z.pr === 1)
        }
        if (z.selectedWeapon ? z.pr === 1 : z.pr == 1 && A != 10 || z.sr == 1 && A == 10) {
            g[0] = e
        }
        Bg(e, z.selectedWeapon ? ee : A === 10 ? A : ee, z.selectedWeapon ? z.primaryVar : A === 10 ? z.secondaryVar : z.primaryVar, z?.dmgpot?.forceSoldier ? 6 : z.selectedWeapon ? 0 : Nn.includes(40) ? 40 : 0, 1)
    }
    if (Nt && !p && Ds.checked) {
        y = z.selectedWeapon ? ee : A != 10 ? ee : 10;
        if (z.selectedWeapon ? z.pr === 1 : z.sr == 1 && A == 10 || z.pr == 1 && A != 10) {
            I(Sg.length ? 22 : z?.dmgpot?.forceSoldier ? 6 : z.selectedWeapon ? 6 : 40, 11);
            z.hitting = true
        }
    }
    if (!p && !gt) {
        if (!Nt) {
            if (m.lc) {
                y = ee;
                if (z.weaponIndex != ee || z.buildIndex != null) T.send("G", ee, true);
                if (z.pr == 1) {
                    if (z.tailIndex === 11) {
                        Rp(On.includes(18) ? 19 : 0, 1)
                    } else {
                        I(z.dmgpot?.soldier ? 6 : Sg.length ? 22 : 7, 18)
                    }
                    z.hitting = true
                }
                Bg(bm(), y, z.primaryVar, 0, 1)
            }
            if (m.rc) {
                !m.ShiftLeft && A == 10 ? y = A : y = ee;
                if (z.sr == 1 && A == 10 && z.weaponIndex == A && !m.ShiftLeft || z.pr == 1 && (z.weaponIndex == ee || m.ShiftLeft)) {
                    I(z.dmgpot?.soldier ? 6 : Sg.length ? 22 : et < 2 ? 40 : 7, 11, 1);
                    z.hitting = true
                }
                Bg(bm(), y, y === 10 ? z.secondaryVar : z.primaryVar, Nn.includes(40) ? 40 : 0, 1)
            }
            if (m.mc) {
                for (let n = Q.filter(e => e.health && se(z, e, "object") <= (!m.ShiftLeft && A === 10 ? 75 : x.weapons[ee].range)).sort((e, t) => Ne(z.x2 - e.x, z.y2 - e.y) - Ne(z.x2 - t.x, z.y2 - e.y)), i = n.length; i--;) {
                    let e = n[i];
                    let t = bg(e, A === 10 ? 75 : x.weapons[ee].range, n);
                    !m.ShiftLeft && A == 10 ? y = A : y = ee;
                    if (z.sr == 1 && A == 10 && z.weaponIndex == A && !m.ShiftLeft || z.pr == 1 && (z.weaponIndex == ee || m.ShiftLeft)) {
                        I(z.dmgpot?.soldier ? 6 : Sg.length ? 22 : et < 2 ? 40 : 7, 11, 1);
                        z.hitting = true
                    }
                    g[0] = t;
                    Bg(t, y, y === 10 ? z.secondaryVar : z.primaryVar, Nn.includes(40) ? 40 : 0, 1);
                    break
                }
            }
        }
        Vg()
    }
    if (z.lastBull && Nn.includes(7) && !z.hitSpike && z.dmgpot?.hp < 80 && z.shameCount > 0 && z.poison <= 0 && !z.dmgpot?.soldier && z.bleed === 0 && en && !Sg.length && $t != 7) {
        if (z.lastDamage == 0 && z.skinIndex != 45) {
            z.shameLeak = true;
            et++;
            I(7, 11)
        }
    }
    if (z.hitSpike && Nt || !Nt && z.hitSpike && z?.dmgpot?.shouldHeal) {
        if (z.health <= z.hitSpike.dmg || z.hitSpike.dmg + z?.dmgpot?.primary + z?.dmgpot?.turretGear >= z.health) p4()
    } else if (Us.checked) {
        if (z.alive && z.health <= z.dmgpot?.hp * (z.skinIndex == 6 && !z.hitting && !p && !Sg.length && !gt && !z.shameLeak ? .75 : 1) && z.skinIndex != 45 && z.shameCount < 7) {
            u4()
        } else if ((!_n && (z.health < 85 || z.shameCount > 0 && z.health < 100) || _n && Date.now() - z.lastDamage >= 100 && z.health < 100 || _n && z.health <= 69) && en && z.skinIndex != 45) {
            if (z.health <= 69) {
                setTimeout(() => {
                    u4()
                }, 120 - xt + 9)
            } else {
                u4()
            }
        }
    }
    Ze = [];
    e4();
    Je = Q.concat($e);
    if (!p && !gt) {
        if (g[0]) ct = true;
        if (z.dir != g[0] && g[0] !== null) T.send("D", g[0]);
        if (y && (y == ee || y == A) && (z.weaponIndex != y || z.buildIndex != -1)) T.send("G", y, true);
        if (g[0] === null && z.dir != bm()) T.send("D", bm())
    }
    if (z.dmgpots.length >= 4) z.dmgpots.pop();
    if (z.dmgpot) z.dmgpots.unshift({
        ping: window.pingTime,
        tick: v,
        dmgpot: z.dmgpot,
        health: z.health,
        packets: He,
        currentHat: z.skinIndex,
        nextHat: $t,
        shameCount: z.shameCount,
        spikeTrap: z.hitSpike && Nt
    });
    k5[1] = false;
    A5();
    t3();
    if (Ct || p && !At && !hn || m.rc || m.lc || m.mc || z.hitting || gt || Ot) {
        if (St % 2 == 0 && en) {
            T.send("K", 1)
        }
    } else {
        if (St % 2 == 1) {
            T.send("K", 1)
        }
    }
    d5();
    Iy()
}

function _g(e, t, n, i, s = 6) {
    let o = Ei.includes(e.sid) ? l4(e, e.moveDirection, e, 1).real : e.np.real;
    let r = {
        norm: {
            dir: null,
            ticks: null,
            dist: null
        },
        marks: {
            dir: null,
            ticks: null,
            dist: null
        }
    };
    let a = Array.isArray(t) ? t : a4(i, 6);
    for (let t = 0; t < a.length; t++) {
        let e = {
            dir: B(o, a[t].real),
            dist: se(o, a[t].real) - 105,
            position: a[t]
        };
        if (l(e.dist, n * 111) === t && !r.norm.dir) {
            r.norm.dir = e.dir;
            r.norm.ticks = t;
            r.norm.dist = e.dist + 105;
            r.position = e.position
        }
        if (l(e.dist, n * 111 * 1.3) === t && !r.marks.dir) {
            r.marks.dir = e.dir;
            r.marks.ticks = t;
            r.marks.dist = e.dist + 105;
            r.position = e.position
        }
    }
    if (r.norm.dir || r.marks.dir) return r;
    return null;

    function l(e, t) {
        if (t === 0) {
            throw new Error("Cannot divide by zero.")
        }
        const n = Math.floor(e / t);
        const i = e % t;
        const s = i > 0 ? 1 : 0;
        return n + s
    }
}

function Vg(t, e = Dn) {
    if (Ot && !z.dmgpot.soldier && !t) return;
    let n = Y && se(z, Y) <= li && !z.inWater && js.checked ? true : false;
    let i = Y && se(z, Y) <= li && !Ws.checked ? 21 : 11;
    if (!js.checked) {
        if (z.dmgpot?.add >= 100 || z.dmgpot?.secondary >= 100 || z.dmgpot?.soldier || e === undefined) {
            if (t) return {
                skinIndex: 6,
                tailIndex: Ws.checked ? 21 : 21
            };
            n = true
        }
    }
    if (Hs.checked || t) {
        if (!z.antiOneTickBowInsta && z.doAssassin) {
            I(56, 0);
            if (t) return {
                skinIndex: 56,
                tailIndex: 0
            }
        } else {
            if (!z.antiOneTickBowInsta && !z.hitting && S0.style.display == "none" && !At) {
                if (!Sg.length && !(et >= 2 && !z.dmgpot.soldier) && (e === undefined || n || Nt && Ds.checked) && !z.doAssassin || !n && i === 19) {
                    let e = 6;
                    if (!n && i === 19) e = b5(1).skinIndex;
                    if (t) return {
                        skinIndex: e,
                        tailIndex: i
                    };
                    I(e, i)
                } else if (!wn && !Sg.length && !(et >= 2 && !z.dmgpot.soldier) && !z.doAssassin) {
                    if (t) return b5(1);
                    b5()
                } else if (et >= 2 && !z.antiOneTickBowInsta && !wn) {
                    if (t) return {
                        skinIndex: 7,
                        tailIndex: z.tailIndex
                    };
                    I(7)
                } else if (!wn) {
                    if (t) return {
                        skinIndex: 22,
                        tailIndex: 11
                    };
                    I(22, 11)
                }
            }
            if (t) return b5(1)
        }
    }
}

function Ug(e) {
    if (Fi) {
        I(Fi)
    }
}

function jg(t) {
    for (let e = 0; e < J.length; ++e)
        if (J[e].id == t) return J[e];
    return null
}

function Hg(t) {
    for (let e = 0; e < J.length; ++e)
        if (J[e].sid == t) return J[e];
    return null
}

function Wg(t) {
    for (let e = 0; e < bh.length; ++e)
        if (bh[e].sid == t) return bh[e];
    return null
}

function Qg(t) {
    for (let e = kh.length; e--;) {
        if (kh[e].sid === t) {
            return kh[e]
        }
    }
    return null
}

function Yg(t) {
    for (let e = 0; e < es.players.length; ++e) {
        if (es.players[e].sid == t) {
            return es.players[e]
        }
    }
    return null
}

function zg(t) {
    for (let e = 0; e < es.builds.length; ++e) {
        if (es.builds[e].sid == t) {
            return es.builds[e]
        }
    }
    return null
}
let Gg = -1;
const Kg = document.getElementById("fakePing");
Kg.addEventListener("change", function() {
    const e = document.getElementById("sliderContainer");
    if (this.checked) {
        e.style.display = "block"
    } else {
        e.style.display = "none"
    }
});
const Xg = document.getElementById("pingSlider");
const Jg = document.getElementById("pingSliderValue");
Xg.addEventListener("input", function() {
    Jg.innerText = this.value
});
const qg = false;

function $g() {
    const e = Date.now() - Gg;
    window.pingTime = e;
    bn = e;
    if (!qg || !qg.checked) {
        if (!Kg.checked) {
            wd = e
        } else {
            const t = parseInt(Xg.value);
            wd = f(Math.random() * t) + parseInt(Xg.value) + 90
        }
        Zh.innerText = e + (Kg.checked ? wd : "") + " ms";
        yt.push(e);
        if (yt.length >= 4) {
            yt.shift()
        }
        xt = yt.reduce((e, t) => e + t, 0) / yt.length
    } else {
        Zh.innerText = "Hidden"
    }
}
let Zg;

function ey() {
    Zg && clearTimeout(Zg), nh() && (Gg = Date.now(), T.send("0")), Zg = setTimeout(ey, 400)
}

function ty(e) {
    if (e < 0) return;
    const t = f(e / 60);
    let n = e % 60;
    n = ("0" + n).slice(-2), e0.innerText = "Server restarting in " + t + ":" + n, e0.hidden = !1
}
window.requestAFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(e) {
        window.setTimeout(e, 1e3 / 60)
    }
}();

function ny() {
    gh = Date.now(), mh = gh - xh, xh = gh, l2(), requestAFrame(ny)
}
X2();
ny();

function iy(e) {
    window.open(e, "_blank")
}
window.openLink = iy;
window.aJoinReq = up;
window.follmoo = uh;
window.kickFromClan = fp;
window.sendJoin = hp;
window.leaveAlliance = mp;
window.createAlliance = pp;
window.storeBuy = Mp;
window.storeEquip = Rp;
window.showItemInfo = q0;
window.selectSkinColor = jp;
window.changeStoreIndex = Tp;
window.config = K;
async function sy(e) {
    if (!Y || ee != 5 || z.tr != 1 || z.pr != 1 || p || Mt || !to.checked) return;
    if (Y && Vy(z, Y, x.weapons[ee].range, true) && o4(z, Y) && !Y?.inTrap) {
        let e = [v3(Y, B(z.np.real, Y.np.real), se(Y, Y.KB.fpriTKB), true, 1), v3(Y, B(z.np.real, Y.np.real), se(Y, Y.KB.fsecKB), true, 1)];
        if (!e[0]) return;
        let t = {
            newPos: {
                ...Y
            }
        };
        let n = Ne(Y.np.real.x - e[0].x, Y.np.real.y - e[0].y);
        let i = P3(Y.np.real.x, Y.np.real.y, B(z, Y), j(n, 170));
        t.newPos.NEWX = i.x;
        t.newPos.NEWY = i.y;
        t.originDir = B(z, Y);
        t.newPos.dstSpd = n;
        t.newPos["static"] = true;
        t.newPos.expire = 3;
        m3(t.newPos);
        b(`KnockBack Insta on ${Y.name}[${Y.sid}]`, "", "#5c0620", false, true);
        hn = true;
        p = true;
        I(53, 11);
        g[0] = B(z, Y);
        ct = true;
        T.send("G", A, true);
        y = A;
        await A4();
        if (Y) {
            p = true;
            hn = false;
            y = ee;
            T.send("G", ee, true);
            g[0] = B(z, Y);
            T.send("D", B(z, Y), "client");
            I(7, 18)
        } else {
            p = false;
            return
        }
        await A4();
        p = false
    }
}

function Z(e) {
    return e * (W / 180)
}

function oy(e) {
    return e * 180 / W
}
var ee, A, ry, ay, ly, cy, dy, uy, fy, hy, py = [];

function my(e) {
    return e.offsetParent !== null
}

function gy(e) {
    return document.getElementById(e)
}

function te(t) {
    if (t == z.sid) return true;
    for (let e = 0; e < py.length; e += 2) {
        if (t == py[e]) return true
    }
    return false
}

function yy() {
    ee = null;
    ry = null;
    A = null;
    dy = null;
    ay = null;
    ly = null;
    cy = null;
    fy = null;
    hy = null;
    for (let e = 0; e < 9; e++) {
        if (my(document.getElementById("actionBarItem" + e))) {
            ee = e
        }
    }
    for (let e = 9; e < 16; e++) {
        if (my(document.getElementById("actionBarItem" + e))) {
            A = e
        }
    }
    for (let e = 16; e < 19; e++) {
        if (my(document.getElementById("actionBarItem" + e))) {
            ry = e - 16
        }
    }
    for (let e = 19; e < 22; e++) {
        if (my(document.getElementById("actionBarItem" + e))) {
            ay = e - 16
        }
    }
    for (let e = 22; e < 26; e++) {
        if (my(document.getElementById("actionBarItem" + e))) {
            ly = e - 16
        }
    }
    for (let e = 26; e < 29; e++) {
        if (my(document.getElementById("actionBarItem" + e))) {
            cy = e - 16
        }
    }
    for (let e = 29; e < 31; e++) {
        if (my(document.getElementById("actionBarItem" + e))) {
            dy = e - 16
        }
    }
    for (let e = 31; e < 33; e++) {
        if (my(document.getElementById("actionBarItem" + e))) {
            uy = e - 16
        }
    }
    if (my(document.getElementById("actionBarItem" + 36))) {
        fy = 36 - 16
    }
    for (let e = 33; e < 39; e++) {
        if (my(document.getElementById("actionBarItem" + e)) && e != 36) {
            hy = e - 16
        }
    }

    function e(e) {
        return null !== e.offsetParent
    }!A && (qt = ee)
}

function xy(t, e) {
    if (Ei.includes(t.sid) && !e) return;
    if (e) {
        t = Hg(t.sid)
    }
    if (e && t === null) return;
    if (t.buildIndex == -1) {
        if (t.weaponIndex <= 8) {
            let {
                speed: e
            } = x.weapons[t.primary];
            t.pr = j(1, t.pr + (t.delta > 190 ? t.delta : ce) / (e * t.samRP))
        } else if (t.weaponIndex > 8) {
            let {
                speed: e
            } = x.weapons[t.secondary];
            t.sr = j(1, t.sr + (t.delta > 190 ? t.delta : ce) / (e * t.samRS))
        }
    }
    t.tr = j(1, t.tr + t.delta / 2400);
    rn[t.sid] = t.pr;
    an[t.sid] = t.sr;
    ln[t.sid] = t.tr;
    if (t.sid != z.sid) {
        if (!t.hasSoldier && t.skinIndex == 6) {
            t.hasSoldier = true
        }
        if (!t.hasTank && t.skinIndex == 40) {
            t.hasTank = true
        }
    }
}

function wy(i) {
    for (let n = 0; n < ie.length; n++) {
        for (let e = 0; e < ie[n].players.length; e++) {
            let t = ie[n].players[e];
            if ((i.name && !i.sid && t.name == i.name || i.sid && i.sid == t.sid) && t.visible) {
                if (!i.spotted) {
                    let e = `${t.name}[${t.sid}]`;
                    if (!L3(z, t)) b(`bot ID: [${ie[n].sid}] spotted ${e}`, "", i.color, false, true)
                }
                i.spotted = true;
                return t
            }
        }
    }
    return false
}

function by(t) {
    for (let e = 0; e < J.length; e++) {
        if (!J[e].visible && J[e].sid != z.sid && !Ei.includes(J[e].sid)) {
            t = J[e];
            t.pr != undefined && t.pr !== 1 && (t.pr = j(1, t.pr + ce / (x.weapons[t?.primary]?.speed * t.samRP)));
            t.sr != undefined && t.sr !== 1 && (t.sr = j(1, t.sr + ce / (x.weapons[t?.secondary]?.speed * t.samRS)));
            t.tr != undefined && t.tr !== 1 && (t.tr = j(1, t.tr + ce / 2500));
            rn[t.sid] = t.pr;
            an[t.sid] = t.sr;
            ln[t.sid] = t.tr
        }
    }
}

function vy(e, t) {
    return se(e, t)
}

function ky(e, t) {
    return S(e.x - t.x) + S(e.y - t.y)
}

function Ay(e, t) {
    let n = S(e - t);
    n = n % ae;
    if (n > W) {
        n = ae - n
    }
    return n
}

function Iy() {
    if (Nn.length + On.length >= 66 || !en || !_n || S0.style.display != "none" || !Qs.checked) return;
    if (Fn.length) {
        if (!Array.isArray(Fn[0]) && z.points >= C0.find(e => e.id == Fn[0]).price) Mp(Fn[0], 0);
        if (Array.isArray(Fn[0]) && z.points >= B0.find(e => e.id == Fn[0][0]).price) Mp(Fn[0][0], 1)
    }
    if (Fn.length == 0 && Nn.length != C0.length - 1) {
        let e = C0.find(e => e.id != 45 && !Nn.includes(e.id) && z.points >= e.price);
        if (e) Mp(e.id, 0);
        let t = B0.find(e => !On.includes(e.id) && z.points >= e.price);
        if (t) Mp(t.id, 1)
    }
}

function Sy(e, t) {
    const n = e * (W / 180);
    const i = t * (W / 180);
    const s = (n + i) / 2;
    let o = s % ae;
    if (o < 0) {
        o += ae
    }
    o = o * (180 / W);
    return o
}
var Ey = false;
async function Ty(e, t, n, i, s, o, r = Math.abs, a = Math.round) {
    if (!Y || Ey) return;
    let l = B(z, Y),
        c = l4(z, l),
        d = B(c.accel, Y),
        u = c.accel.x - Y.x2,
        f = c.accel.y - Y.y2,
        h = se(c.accel, Y);
    T.send("a", l, "client");
    if (r(u) <= 70 || r(f) <= 70) {
        const m = u * u + f * f;
        var p = Math.sqrt(m) - 70;
        if (p <= 0) {
            Ey = true;
            p = p * -.5;
            n = Y.x2 - p * Math.cos(d);
            i = Y.y2 - p * Math.sin(d);
            s = n + p * Math.cos(d);
            o = i + p * Math.sin(d);
            console.log({
                x: n,
                y: i
            }, {
                x: s,
                y: o
            }, "did", v);
            console.log(a(Y.movSpd), a(z.movSpd), p)
        }
    }
    await A4();
    console.log(se({
        x: n,
        y: i
    }, Y));
    Ey = false;
    console.log("_____________________________")
}

function I(e, t) {
    if (!isNaN(e)) {
        if (!Nn.includes(e)) {
            if ($t != 0) Rp(0, 0), lt = 0, nn = 0
        } else {
            if ($t != e) Rp(e, 0), lt = e, nn = e
        }
    }
    if (!isNaN(t)) {
        if (!On.includes(t)) {
            if (Zt != 0) Rp(0, 1), mt = 0, sn = 0
        } else {
            if (Zt != t) Rp(t, 1), mt = t, sn = t
        }
    }
}

function Cy(e, t) {
    if (e.x2 && t.x2) return D(re(t.y2 - e.y2, 2) + re(t.x2 - e.x2, 2));
    if (!e.x2 == undefined && !t.x2) return D(re(t.y - e.y, 2) + re(t.x - e.x, 2));
    if (e.x2 && !t.x2) return D(re(t.y - e.y2, 2) + re(t.x - e.x2, 2));
    if (!e.x2 && t.x2) return D(re(t.y2 - e.y, 2) + re(t.x2 - e.x, 2))
}

function By(i, s) {
    for (let e = 0, t, n; e < i.length; e++) {
        for (n = s.length, t = i[e]; n--;) {
            if (t === s[n]) {
                i.splice(e, 1);
                s.splice(n, 1);
                e--;
                break
            }
        }
    }
}

function B(e, t) {
    return P((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x))
}

function Dy(e, t) {
    return d((e.x2 || e.x) - (t.x2 || t.x), (e.y2 || e.y) - (t.y2 || t.y))
}

function Py(e, t, n) {
    return (e.x * t + e.y * n) / (e.x * n - e.y * t)
}
var Ry, My = 65,
    ne = {
        x: null,
        y: null,
        objs: [],
        dev: null,
        dir: null
    },
    Ny = {
        x: null,
        y: null
    };

function Oy(r, e, t, n, i, s, o) {
    if (!Y?.inTrap || !Y || !In || Y && z.skinIndex == 45 && se(z, Y) > 90) {
        jt = false;
        Ht = false;
        jn = "not";
        ne = "not";
        Ny = "not";
        ni == "autopush" && T.send("a", undefined);
        return false
    }
    let a;
    let l;
    jt = false;
    Ht = false;
    r = B(z, Y);
    ne = {
        x: U(r),
        y: V(r),
        objs: [],
        dev: null,
        dir: null
    };
    let c = Q.sort((e, t) => se(e, Y) - se(t, Y));
    for (let e = 0; e < c.length; e++) {
        i = c[e];
        if (Y.inTrap.sid === i.sid) continue;
        if (se(Y.inTrap, i) <= 50 + (i.type == 1 ? i.scale * .55 : i.scale) + 26 && (te(i?.owner?.sid) && i?.group?.name == "spikes" || !Y.team && i?.group?.name == "spikes" && i?.owner?.sid != Y.sid || i?.type === 1 && i.y >= 12e3) || ne.objs.length === 1 && se(i, Y.inTrap) <= 50 + i.scale + 22.5 && se(i, ne.objs[0]) <= ne.objs[0].scale + i.scale + 42.5 && !i.ignoreCollision) {
            let e = P(i.y - Y.y2, i.x - Y.x2);
            let t = 170 - Dy(i, Y);
            if (ne.objs[0] && Ay(B(i, Y.inTrap), B(ne.objs[0], Y.inTrap)) <= 1.9 && se(i, ne.objs[0]) <= i.scale + ne.objs[0].scale + 67.5 || !ne.objs.length) {
                ne.x += t * U(e);
                ne.y += t * V(e);
                if (ne.objs[0]) console.log(Ay(B(i, Y.inTrap), B(ne.objs[0], Y.inTrap)), Math.round(se(i, ne.objs[0])) - (ne.objs[0].scale + i.scale));
                ne.objs.push(i)
            }
            if (Py(ne, Y.inTrap.x - Y.x2, Y.inTrap.y - Y.y2) > 0) {
                ne.x += (Y.inTrap.x - Y.x2) * 2;
                ne.y += (Y.inTrap.y - Y.y2) * 2
            }
        }
    }
    if (Ne(ne.x, ne.y) > 5) {
        let e = Dy(Y, z);
        let t = Ay(r, P(ne.y, ne.x));
        let i = ne.objs[0];
        let n = se(Y, i) <= i.scale + 38.75;
        let s = 3600 + re(e, 2) - (28.5 + (n ? 71.5 : 0)) * e * U(t);
        let o = Math.acos((re(e, 2) + s - 3600) / (2 * e * D(s)));
        if (o) {
            l = r - Math.sign((Y.x2 - z.x2) * ne.y - (Y.y2 - z.y2) * ne.x) * o;
            let e = se(z, Y) + 30;
            Ny = {
                x: z.x2 + e * U(l),
                y: z.y2 + e * V(l)
            };
            let t = E3(z, l, l4(z, l, z, 1));
            let n = Ay(B(Y, i), B(z, Y)) <= 2;
            if ((!Y.hitSpike || se(z, Ny) > 100 && Y.hitSpike) && Ys.checked || !Ys.checked && n && !t) {
                T.send("a", l, "autopush");
                ne.dev = o;
                ne.dir = l
            } else {
                T.send("a", null, "autopush")
            }
            jt = true;
            Ht = true
        }
    }
}

function Ly(t, n, e) {
    if (!Y?.inTrap || !Y || !In) {
        jt = false;
        Ht = false;
        jn = "not";
        Ny = "not";
        ni == "autopush" && T.send("a", undefined);
        ne = "not";
        return false
    }
    if (!t) t = [];
    let i = Q.filter(e => !t.includes(e.sid) && se(Y.inTrap, e) <= 50 + (e.type == 1 ? e.scale * .55 : e.scale) + 26 && (te(e?.owner?.sid) && e?.group?.name == "spikes" || !Y.team && e?.group?.name == "spikes" && e?.owner?.sid != Y.sid || e?.type == 1 && e.y >= 12e3)).sort((e, t) => se(e, Y) - se(t, Y));
    if (!i.length || se(z, Y) >= 400) {
        Ht = false;
        jt = false;
        jn = "not";
        ne = "not";
        Ny = "not";
        ni == "autopush" && T.send("a", undefined);
        return false
    }
    Y = Hg(Y.sid);
    const s = Y.x2 - i[0].x;
    const o = Y.y2 - i[0].y;
    const r = Y.x2 - z.x2;
    const a = Y.y2 - z.y2;
    const l = Y.x2 - Y.inTrap.x;
    const c = Y.y2 - Y.inTrap.y;
    const d = i[0].x - Y.inTrap.x;
    const u = i[0].y - Y.inTrap.y;
    const f = D(s * s + o * o);
    Qn = {
        x: s / f,
        y: o / f
    };
    const h = D(r * r + a * a);
    Wn = {
        x: r / h,
        y: a / h
    };
    const p = D(l * l + c * c);
    Yn = {
        x: l / p,
        y: c / p
    };
    const m = D(d * d + u * u);
    let g = {
        x: d / m,
        y: u / m
    };
    const y = [P(Qn.y, Qn.x), P(Yn.y, Yn.x), P(Wn.y, Wn.x)];
    const x = [(y[0] + y[1]) / 2, (y[0] + y[2]) / 2];
    const w = [{
        x: U(x[0]),
        y: V(x[0])
    }, {
        x: U(x[1]),
        y: V(x[2])
    }];
    Jn = Qn.x * Wn.x + Qn.y * Wn.y;
    Xn = i[0]?.type == 1 ? (i[0].scale * .55, i[0].realScale = i[0].scale * .55) : i[0].scale;
    qn = i[0];
    jn = {
        x: Y.x2 + Qn.x * (Jn + Xn),
        y: Y.y2 + Qn.y * (Jn + Xn)
    };
    const b = B(z, jn);
    const v = se(z, jn);
    const k = Ay(b, B(z, Y));
    e = v <= 100 && k <= 2;
    let A = C.checkCollision2(Y, i[0]);
    let I = {
        x: Y.x2,
        y: Y.y2,
        scale: 35,
        "do": true
    };
    let S = e ? Q : Q.concat(I);
    let E = Date.now();
    Y3 = [];
    if (A) {
        Fy()
    }
    if (Y.hitSpike && !zs.checked) {
        jt = false;
        Ht = false;
        jn = "not";
        Ny = "not";
        ni == "autopush" && T.send("a", undefined);
        ne = "not";
        return
    }
    if (e) {
        Oy()
    }
    if (!e) {
        U3({
            player: z,
            target: {
                x: Y.x2 + Qn.x * (Jn + Xn + 35),
                y: Y.y2 + Qn.y * (Jn + Xn + 35)
            },
            buildings: S,
            clan: py
        }).then(e => {
            let t = e;
            Y = Hg(Y.sid);
            Ht = false;
            jt = true;
            if (!t) {
                Ht = false;
                jt = false;
                jn = "not";
                ne = "not";
                Ny = "not";
                return false
            }
            n = Ax(E, 360, true);
            if (!n) {
                Ht = false;
                jt = false;
                jn = "not";
                ne = "not";
                Ny = "not";
                Y3 = [];
                return
            }
        })["catch"](e => {
            jt = false;
            Ht = false;
            jn = "not";
            return false
        })
    }
}
async function Fy() {
    if (Y && (Y.weaponR == 1 || Y.skinIndex != 6) && !p && (se(z.np.accel, Y.np.real, "player") <= x.weapons[ee].range || se(z, Y, "player") <= x.weapons[ee].range) && z.pr == 1 && en && (Y.weaponIndex == 11 && X.getAngleDist(B(z, Y) + W, Y.dir) > W / 3 || Y.weaponIndex != 11)) {
        un = false;
        p = true;
        if (z.skinIndex != 11) {
            I(7, 18)
        } else Rp(19, 1);
        g[0] = B(z, Y);
        ct = true;
        T.send("D", B(z, Y), "client");
        T.send("G", ee, true);
        y = ee;
        await A4();
        I(53);
        await A4();
        p = false
    }
}

function _y(e, t) {
    if (!e) return;
    !t && (t = 111);
    return j(1, e.weaponR + t / x.weapons[e.weaponIndex]?.speed)
}

function Vy(e, t, n, i) {
    return se(e, t, "player") <= n || i && se(e?.np?.real, t?.np?.real, "player") <= n
}

function Uy(e, t, n, i, s, o) {
    s = se(e, t) - 35;
    o = s / (i * 111);
    return o
}

function jy(e, s, t, n) {
    const i = e.map(e => {
        let t = P3(e.x2, e.y2, B(e, s), 35);
        const n = Uy(t, s, 5, 3.6);
        const i = Uy(t, s, 1, 1.54);
        return {
            player: e,
            musketTicks: n,
            turretBallTicks: i
        }
    });
    i.sort((e, t) => e.musketTicks - t.musketTicks);
    const o = oe(...i.map(e => e.turretBallTicks));
    i.forEach(e => {
        e.waitTicksForTurretBall = o - e.turretBallTicks
    });
    const r = i.map(e => e.player.name);
    i.forEach(e => {
        e.waitTimeForMusket = e.musketTicks * 111;
        e.waitTimeForTurretBall = e.waitTicksForTurretBall * 111
    });
    return {
        pP: i,
        syncOrder: r
    }
}

function Hy(e) {
    const t = f(Math.random() * 360);
    const n = f(Math.random() * 81) + 20;
    const i = f(Math.random() * 61) + 20;
    const s = `hsl(${t}, ${n}%, ${i}%)`;
    if (!e) return s;
    if (e.some(({
        color: e
    }) => e && Wy(e, s))) {
        return Hy(e)
    }
    return s
}

function Wy(e, t) {
    const [n, i, s] = Qy(e);
    const [o, r, a] = Qy(t);
    const l = S(n - o);
    const c = S(i - r);
    const d = S(s - a);
    return l <= 60 && c <= 20 && d <= 20
}

function Qy(e) {
    const t = e.indexOf(",") > -1 ? "," : " ";
    const [n, i, s] = e.substr(e.indexOf("(") + 1).split(")")[0].split(t).map(Number);
    const o = n / 255;
    const r = i / 255;
    const a = s / 255;
    const l = Math.max(o, r, a);
    const c = Math.min(o, r, a);
    let d, u, f;
    if (l === c) {
        d = 0
    } else if (l === o) {
        d = 60 * ((r - a) / (l - c)) + 0
    } else if (l === r) {
        d = 60 * ((a - o) / (l - c)) + 120
    } else {
        d = 60 * ((o - r) / (l - c)) + 240
    }
    f = (l + c) / 2;
    if (l === c) {
        u = 0
    } else if (f <= .5) {
        u = (l - c) / (l + c)
    } else {
        u = (l - c) / (2 - l - c)
    }
    return [H(d), H(f * 100), H(u * 100)]
}

function Yy(e) {
    return e.type === 1 && e.y >= 12e3 ? e.scale * .55 : e.type === 1 ? e.scale * .6 : e.type === 0 ? e.scale * .7 : e.scale
}
const zy = `
self.onmessage = (msg) => {

    const bitmap = msg.data.bitmap;
    const player = JSON.parse(msg.data.R)
    const time = msg.data.time
    const size = msg.data.size
    const res = msg.data.res
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);
    ctx.clearRect(Math.floor(bitmap.width/2), Math.floor(bitmap.height/2), 1, 1);

    const endpoints = [];
    const data = ctx.getImageData(0,0,bitmap.width, bitmap.height).data;

    const map = new Map(canvas,player,size,res);

    for(let i = 0;i < data.length;i += 4){

        let l = i / 4;

map.graph[l % bitmap.width][Math.floor(l / bitmap.width)].cost = data[i]


        if(data[i + 2]){
            endpoints.push({
                x: l % bitmap.width,
                y: Math.floor(l / bitmap.width),
            });
        }
    }
    bitmap.close();

    if(!endpoints.length){
        endpoints.push(map.getCentreNode());
    }

    //begin the pathfinding

    let openSet = new BinHeap();
    openSet.setCompare = (a, b) => a.f > b.f;
    openSet.push(map.getCentreNode());

    let currentNode;


    while(openSet.length){
        currentNode = openSet.remove(0)

        if(endpoints.some((goal) => goal.x == currentNode.x && goal.y == currentNode.y)){
            break;
        }

        let neighbors = map.getNeighbor(currentNode.x, currentNode.y,player,size,res);
        for(let i = 0;i < neighbors.length;i++){
            let neighbor = neighbors[i];
            if(neighbor && neighbor.cost == 0){//make weighted later
                let tempG = currentNode.g + Map[i % 2 == 0 ? "DiagonalCost" : "TraversalCost"];
                if(tempG < neighbor.g){
                    neighbor.parent = currentNode;
                    neighbor.g = tempG;
                    neighbor.h = Math.min.apply(Math, endpoints.map((goal) => fastHypot(neighbor.x - goal.x, neighbor.y - goal.y)));
                    if(!neighbor.inset){
                        openSet.insert(neighbor);
                    }
                }
            }
        }
    }


    //recontruct path
    if(!endpoints.some((goal) => goal.x == currentNode.x && goal.y == currentNode.y)){
        currentNode = map.getLowest('h',player,size,res);
    }
    let output = [];
    while(currentNode.parent){
        let nextNode = currentNode.parent;
        let d = Math.round(Math.atan2(nextNode.y - currentNode.y, nextNode.x - currentNode.x) / Math.PI * 4);
        if(d < 0){d+=8};
        output.push(d);
        currentNode = nextNode;
    }
    output = new Uint8Array(output.reverse()).buffer;

    self.postMessage(output, [output]);

}

//approximate hypot
function fastHypot(a, b){
    const c = Math.SQRT2-1;
    a = Math.abs(a);
    b = Math.abs(b);
    if(a > b){
        let temp = a;
        a = b;
        b = temp;
    }
    return (c * a) + b
}

//Map Constructor for object
class Map{
    static TraversalCost = 1;
    static DiagonalCost = Math.sqrt(2) * 1;
    constructor(canvas,player,size,res){
        //init variables
        this.width = canvas.width;
        this.height = canvas.height;

        this.middleWidth = Math.floor(this.width / 2);
        this.middleHeight = Math.floor(this.height / 2);
        this.graph = new Array(canvas.width);

        for(let x = 0;x < this.width;x++){
            this.graph[x] = new Array(this.height);
            for(let y = 0;y < this.height; y++){
                this.graph[x][y] = new Node(x, y);
            }
        }
        this.getCentreNode(player,size,res).g = 0;
        this.getCentreNode(player,size,res).pending = false;
    }
    getLowest(type,player,size,res){
        let lowestNode = this.graph[0][0];
        for(let x = 0;x < this.width;x++){

            for(let y = 0;y < this.height; y++){

            let node = this.getNode(x, y, player,size,res)
                if(lowestNode[type] > node[type]){
                    lowestNode = node;
                }
            }
        }
        return lowestNode;
    }
    getNode(x, y, player,size,res){

let X =  x*res+ player.x2-size, Y = y*res + player.y2-size
if(X<0||Y<0||X>14400||Y>14400){
if(this.graph[x] && this.graph[x][y]?.cost!=undefined){
this.graph[x][y].cost = 100
return this.graph[x][y];
}

return undefined
 }


        if(this.graph[x]){
            return this.graph[x][y];
        }
    }
    getCentreNode(player,size,res){
        return this.graph[this.middleWidth][this.middleHeight];
    }
    getNeighbor(x, y,player,size,res){

        return [
            this.getNode(x - 1, y - 1,player,size,res),
            this.getNode(x + 0, y - 1,player,size,res),
            this.getNode(x + 1, y - 1,player,size,res),
            this.getNode(x + 1, y + 0,player,size,res),
            this.getNode(x + 1, y + 1,player,size,res),
            this.getNode(x + 0, y + 1,player,size,res),
            this.getNode(x - 1, y + 1,player,size,res),
            this.getNode(x - 1, y + 0,player,size,res),
        ]
    }

lineOfSight(node1, node2) {
    let x0 = node1.x;
    let y0 = node1.y;
    let x1 = node2.x;
    let y1 = node2.y;

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (x0 !== x1 || y0 !== y1) {
        if (this.graph[x0][y0].cost !== 0) {
            return false; // Line-of-sight blocked
        }

        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }

    return true; // Line-of-sight clear
}
}

//Node for Map
class Node{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.g = Number.POSITIVE_INFINITY;//distance to start
        this.h = Number.POSITIVE_INFINITY;//estimated distance to end
        this.parent;//where it came from
    }
    get f(){
        return this.h + this.g;
    }
}

//binary heap object constructor
class BinHeap extends Array {
    //private variable declaration
    #compare = (a, b) => a < b;
    //constuctor
    constructor(len = 0) {
        super(len);
    }
    //change compare function
    set setCompare(func) {
        if (typeof func == "function") {
            this.#compare = func;
        } else {
            throw new Error("Needs a function for comparing")
        }
    }
    //sort into a binary heap
    sort() {
        for (let i = Math.trunc(this.length / 2); i >= 0; i--) {
            this.siftDown(i)
        }
    }
    //old array sort
    arraySort(compare) {
        super.sort(compare)
    }
    //sift down
    siftDown(index) {
        let left = index * 2 + 1;
        let right = index * 2 + 2;
        let max = index;
        if (left < this.length && this.#compare(this[max], this[left])){
            max = left;
        }
        if (right < this.length && this.#compare(this[max], this[right])){
            max = right;
        }
        if (max != index) {
            this.swap(index, max);
            this.siftDown(max);
        }
    }
    //sift up
    siftUp(index) {
        let parent = (index - (index % 2 || 2)) / 2;
        if (parent >= 0 && this.#compare(this[parent], this[index])) {
            this.swap(index, parent);
            this.siftUp(parent);
        }
    }
    //inserts element into the binary heap
    insert(elem) {
        this.push(elem);
        this.siftUp(this.length - 1);
    }
    //removes elem at index from binary heap
    remove(index) {
        if (index < this.length) {
            this.swap(index, this.length - 1);
            let elem = super.pop();
            this.siftUp(index);
            this.siftDown(index);
            return elem;
        } else {
            throw new Error("Index Out Of Bounds")
        }
    }
    //changes elem at index
    update(index, elem) {
        if (index < this.length) {
            this[index] = elem;
            this.siftUp(index);
            this.siftDown(index);
        } else {
            throw new Error("Index Out Of Bounds")
        }
    }
    //swap two elem at indexes
    swap(i1, i2) {
        let temp = this[i1];
        this[i1] = this[i2];
        this[i2] = temp;
    }
}
`;
var Gy;
var Ky;
class Xy {
    constructor(e, t) {
        this.size = e;
        this.res = t;
        this.prevPos = {};
        this.prevPath = [];
        b(`Default pathfinder | radius: ${e} resolution: ${t} `, "", "#5c0620", false, true);
        b(`use !help, !commands to navigate hack.`, "", "#5c0620", false, true);
        this.blob = new Blob([zy], {
            type: "application/javascript"
        });
        this.url = URL.createObjectURL(this.blob);
        this.worker = new Worker(this.url);
        this.worker.url = this.url;
        this.worker.onmessage = e => {
            Ky = Date.now() - Gy;
            this.attemptFulfil(new Uint8Array(e.data))
        };
        this.worker.onerror = e => {
            throw e
        };
        this.initiateCanvas()
    }
    close() {
        this.worker.terminate();
        URL.revokeObjectURL(this.url);
        si = null
    }
    attemptFulfil(e, t = 0) {
        if (this.resolve) {
            this.resolve(e);
            this.resolve = null
        } else {
            if (t < 10) {
                setTimeout(() => {
                    this.attemptFulfil(e, t + 1)
                }, 0)
            } else {
                console.error("Unexpected Message from Worker at ", this)
            }
        }
    }
    initiateCanvas() {
        this.width = c(this.size * 2 / this.res) + 1;
        if (this.canvas) {
            this.canvas.width = this.width;
            this.canvas.height = this.width
        } else {
            this.canvas = new OffscreenCanvas(this.width, this.width);
            this.ctx = this.canvas.getContext("2d")
        }
    }
    setBuildings(e) {
        this.buildings = e
    }
    setSpeed(e) {
        this.estimatedSpeed = e
    }
    setPos(e, t) {
        this.x = e;
        this.y = t
    }
    clearPath() {
        this.prevPath = []
    }
    pathBlocked(e) {
        if (se(e[0], si.finalGoal) >= 30) {
            this.pathBlocked = true
        }
    }
    async drawPath(n, e = "#0000FF", i = this, t = "#00FF00") {
        if (this.prevPath.length) {
            const s = Date.now() * .3;
            n.lineWidth = 5;
            n.globalAlpha = 1;
            for (let e = 0; e < this.prevPath.length - 1; e++) {
                const o = (e / (this.prevPath.length - 1) * 360 + s) % 360;
                const r = ((e + 1) / (this.prevPath.length - 1) * 360 + s) % 360;
                const [a, l, c] = qy(o / 360, 1, .55);
                const [d, u, f] = qy(r / 360, 1, .55);
                const h = n.createLinearGradient(this.prevPath[e].x, this.prevPath[e].y, this.prevPath[e + 1].x, this.prevPath[e + 1].y);
                h.addColorStop(0, `rgba(${a}, ${l}, ${c}, 1)`);
                h.addColorStop(1, `rgba(${d}, ${u}, ${f}, 1)`);
                n.beginPath();
                n.moveTo(this.prevPath[e].x, this.prevPath[e].y);
                n.lineTo(this.prevPath[e + 1].x, this.prevPath[e + 1].y);
                n.strokeStyle = h;
                n.stroke()
            }
            if (i.x && i.y) {
                n.lineWidth = 5;
                n.globalAlpha = 1;
                n.strokeStyle = "#ffffff";
                n.beginPath();
                for (let t of this.prevPath) {
                    n.globalAlpha = 1;
                    let e = Math.hypot(i.x - t.x, i.y - t.y);
                    if (e < this.estimatedSpeed + this.res * 2) {
                        if (e > this.estimatedSpeed) {
                            n.moveTo(i.x, i.y);
                            n.lineTo(t.x, t.y)
                        }
                        break
                    }
                }
                n.stroke()
            }
        }
    }
    async response() {
        return await new Promise(e => {
            this.resolve = e
        })
    }
    checkBoundaries(e, t) {
        return e >= 0 && t >= 0 && e <= 14400 && t <= 14400
    }
    fastHypot(t, n) {
        const e = Math.SQRT2 - 1;
        t = Math.abs(t);
        n = Math.abs(n);
        if (t > n) {
            let e = t;
            t = n;
            n = e
        }
        return e * t + n
    }
    getPath() {
        window.pf = this;
        for (let n in this.prevPath) {
            let e = this.prevPath[n];
            let t = Math.hypot(z.x2 - e.x, z.y2 - e.y);
            if (t < this.estimatedSpeed + this.res * 2) {
                if (t > this.estimatedSpeed) {
                    return {
                        ang: Math.atan2(e.y - z.y2, e.x - z.x2),
                        dist: parseInt(n)
                    }
                } else {
                    break
                }
            }
        }
    }
    norm(e) {
        return Math.max(0, Math.min(this.width - 1, e))
    }
    async initCalc(t, e = false, n) {
        if (this.resolve) {
            return
        }
        this.prevGoal = t.map(e => {
            return {
                x: e.x,
                y: e.y
            }
        });
        if (e && !n) {
            this.prevPos = this.prevPath[0]
        } else {
            this.prevPos = {
                x: this.x,
                y: this.y
            }
        }
        t = t.map(e => {
            return {
                x: this.norm((e.x - this.prevPos.x + this.size) / this.res),
                y: this.norm((e.y - this.prevPos.y + this.size) / this.res)
            }
        });
        const s = ae;
        this.ctx.fillStyle = "#FF0000";
        for (let i of this.buildings) {
            let e = (i.x - this.prevPos.x + this.size) / this.res;
            let t = (i.y - this.prevPos.y + this.size) / this.res;
            let n = i.pathScale;
            this.ctx.beginPath();
            this.ctx.arc(e, t, n / this.res, 0, s);
            this.ctx.fill()
        }
        this.ctx.fillStyle = "#0000FF";
        for (let e of t) {
            this.ctx.fillRect(Math.round(e.x), Math.round(e.y), 1, 1)
        }
        let i = await createImageBitmap(this.canvas, 0, 0, this.width, this.width);
        this.worker.postMessage({
            bitmap: i,
            R: le(z),
            time: Date.now(),
            res: this.res,
            size: this.size
        });
        Gy = Date.now();
        this.initiateCanvas();
        let o = await this.response();
        const r = [-1, -1, 0, 1, 1, 1, 0, -1];
        const a = [0, -1, -1, -1, 0, 1, 1, 1];
        if (!e || n) {
            this.prevPath = []
        }
        let l = {
            x: this.prevPos.x,
            y: this.prevPos.y
        };
        for (let e = 0; e < o.length; e++) {
            l = {
                x: l.x + r[o[e]] * this.res,
                y: l.y + a[o[e]] * this.res
            };
            this.checkBoundaries(l.x, l.y) && this.prevPath.unshift(l)
        }
        return
    }
    async pathTo(n, t) {
        if (!(n instanceof Array)) {
            n = [n]
        }
        if (this.prevGoal?.length == n.length && this.prevGoal.every((e, t) => e.x == n[t].x && e.y == n[t].y) || t) {
            let e = this.getPath();
            if (e) {
                if (e.dist < 150 || t) {
                    this.initCalc(n, true, t)
                }
                return e
            }
        }
        await this.initCalc(n, false, t);
        return this.getPath()
    }
}
ri = new Xy(2e3, 10);
class Jy {
    constructor(e) {
        this.pathfinder = e;
        this.goal = {
            pathing: false,
            type: null,
            entity: null,
            pos: {
                x: null,
                y: null
            },
            hasGoal: false
        };
        this.finalGoal = {
            x: null,
            y: null
        };
        this.waypoints = {
            death: {
                x: null,
                y: null
            },
            quick: {
                x: null,
                y: null
            }
        }
    }
    setWaypoint(e, t) {
        if (t.x && t.y) {
            this.waypoints[e] = {
                x: t.x,
                y: t.y
            }
        }
    }
    drawWaypointMap(t, n) {
        t.font = "34px Lilita One";
        t.textBaseline = "middle";
        t.textAlign = "center";
        for (let e in this.waypoints) {
            if (e == "death") {
                t.fillStyle = "#E44"
            } else if (e == "quick") {
                t.fillStyle = "#44E"
            } else {
                t.fillStyle = "#fff"
            }
            if (this.waypoints[e].x && this.waypoints[e].y) {
                t.fillText("x", this.waypoints[e].x / 14400 * n.width, this.waypoints[e].y / 14400 * n.height)
            }
        }
        t.strokeStyle = "#4E4";
        if (this.goal.type == "xpos") {
            t.beginPath();
            t.moveTo(this.goal.pos.x / 14400 * n.width, 0);
            t.lineTo(this.goal.pos.x / 14400 * n.width, n.height);
            t.stroke()
        } else if (this.goal.type == "ypos") {
            t.beginPath();
            t.moveTo(0, this.goal.pos.y / 14400 * n.height);
            t.lineTo(n.width, this.goal.pos.y / 14400 * n.height);
            t.stroke()
        } else if (this.goal.pos.x && this.goal.pos.y) {
            t.fillStyle = "#4E4";
            t.fillText("x", this.goal.pos.x / 14400 * n.width, this.goal.pos.y / 14400 * n.height)
        }
    }
    drawWaypoints(n, i) {
        for (let e in this.waypoints) {
            if (e == "death") {
                n.strokeStyle = "#E44"
            } else if (e == "quick") {
                n.strokeStyle = "#44E"
            } else {
                n.strokeStyle = "#fff"
            }
            if (this.waypoints[e].x && this.waypoints[e].y) {
                n.save();
                n.translate(this.waypoints[e].x, this.waypoints[e].y);
                n.rotate(i);
                n.globalAlpha = .6;
                n.lineWidth = 8;
                for (let e = 0; e < 4; e++) {
                    n.rotate(e * Math.PI / 2);
                    n.beginPath();
                    n.arc(0, 0, 50, 0, Math.PI / 4);
                    n.stroke()
                }
                n.lineWidth = 6;
                n.globalAlpha = Math.min(.4, 1 - Math.pow(Math.sin(i / 2), 2) / 1.2);
                n.beginPath();
                n.arc(0, 0, 50 + Math.max(0, Math.tan(i / 2)), 0, ae);
                n.stroke();
                n.restore()
            }
        }
        n.strokeStyle = "#4F4";
        n.lineWidth = 10;
        n.globalAlpha = .8;
        if (this.goal.type == "xpos") {
            n.beginPath();
            n.moveTo(this.goal.pos.x, 0);
            n.lineTo(this.goal.pos.x, 14400);
            n.stroke()
        } else if (this.goal.type == "ypos") {
            n.beginPath();
            n.moveTo(0, this.goal.pos.y);
            n.lineTo(14400, this.goal.pos.y);
            n.stroke()
        } else if (this.goal.pos.x && this.goal.pos.y) {
            n.save();
            n.translate(this.goal.pos.x, this.goal.pos.y);
            n.beginPath();
            n.arc(0, 0, 10, 0, ae);
            n.stroke();
            n.beginPath();
            n.rotate(i / 3);
            let t = Math.cos(i) * 10;
            for (let e = 0; e < 3; e++) {
                n.rotate(ae / 3);
                n.moveTo(60 + t, 0);
                n.lineTo(120 + t, -20);
                n.lineTo(100 + t, 0);
                n.lineTo(120 + t, 20);
                n.closePath()
            }
            n.stroke();
            n.restore()
        }
    }
    setSelf(e) {
        this.self = e
    }
    setSend(e) {
        this.send = e
    }
    abort() {
        this.goal.pathing = false
    }
    updateChat(e, t) {
        if (t != this.self.sid) {
            return
        }
        let n = e.trimEnd().split(" ");
        if (n[0] == "path") {
            if (this.goal.type) {
                this.goal.pathing = true;
                this.pathfinder.clearPath()
            }
        } else if (n[0] == "stop") {
            if (this.goal.pathing) {
                this.goal.pathing = false;
                this.pathfinder.clearPath();
                T.send("a", null, "client")
            }
        } else if (n[0] == "goal" || n[0] == "goto") {
            if (isNaN(parseInt(n[1]))) {
                if (n[1] == "x") {
                    let e = parseInt(n[2]);
                    if (e >= 0 && e <= 14400) {
                        this.goal.pathing = n[0] == "goto";
                        this.goal.type = "xpos";
                        this.goal.pos.x = e
                    }
                } else if (n[1] == "y") {
                    let e = parseInt(n[2]);
                    if (e >= 0 && e <= 14400) {
                        this.goal.pathing = n[0] == "goto";
                        this.goal.type = "ypos";
                        this.goal.pos.y = e
                    }
                } else if (n[0] == "goal" && !n[1]) {
                    this.goal.type = "pos";
                    this.goal.pos.x = this.self.x;
                    this.goal.pos.y = this.self.y
                }
            } else {
                let e = parseInt(n[1]);
                let t = parseInt(n[2]);
                if (e >= 0 && e <= 14400 && t >= 0 && t <= 14400) {
                    this.goal.pathing = n[0] == "goto";
                    this.goal.type = "pos";
                    this.goal.pos.x = e;
                    this.goal.pos.y = t
                }
            }
        } else if (n[0] == "thisway" || n[0] == "project") {
            let e = parseInt(n[1]);
            let t = parseFloat(n[2]) || this.self.dir;
            if (!isNaN(e) && this.self.x && this.self.y && this.self.dir) {
                this.goal.type = "pos";
                this.goal.pos.x = Math.max(0, Math.min(14400, this.self.x + Math.cos(t) * e));
                this.goal.pos.y = Math.max(0, Math.min(14400, this.self.y + Math.sin(t) * e))
            }
        } else if (n[0] == "follow" || n[0] == "flw") {
            if (n[1] == "player" || n[1] == "ply") {
                this.goal.pathing = true;
                this.goal.type = "player";
                if (n[2]) {
                    this.goal.entity = n.slice(2).join(" ")
                } else {
                    this.goal.entity = -1
                }
            } else if (n[1] == "team") {
                this.goal.pathing = true;
                this.goal.type = "team"
            } else if (n[1] == "animal") {
                this.goal.pathing = true;
                this.goal.type = "animal";
                if (n[2]) {
                    this.goal.entity = n[2]
                } else {
                    this.goal.entity = -1
                }
            }
        } else if (n[0] == "find" || n[0] == "fnd") {} else if (n[0] == "waypoint" || n[0] == "wp") {
            if (n[1] == "set") {
                if (Boolean(n[2]) && !this.waypoints[n[2]]) {
                    this.waypoints[n[2]] = {
                        x: this.self.x,
                        y: this.self.y
                    }
                }
            } else if (n[1] == "del") {
                delete this.waypoints[n[2]]
            } else if (n[1] == "goto") {
                if (this.waypoints[n[2]]?.x && this.waypoints[n[2]]?.y) {
                    this.goal.pathing = true;
                    this.goal.type = "pos";
                    this.goal.pos.x = this.waypoints[n[2]].x;
                    this.goal.pos.y = this.waypoints[n[2]].y
                }
            }
        } else if (n[0] == "wander" || n[0] == "wnd") {
            this.goal.pathing = true;
            this.goal.type = "wander";
            this.goal.pos.x = Math.random() * 14400;
            this.goal.pos.y = Math.random() * 14400
        }
    }
    reachedGoal() {
        if (this.goal.type == "xpos") {
            return Math.abs(this.self.x - this.goal.pos.x) < this.pathfinder.estimatedSpeed
        } else if (this.goal.type == "ypos") {
            return Math.abs(this.self.y - this.goal.pos.y) < this.pathfinder.estimatedSpeed
        } else if (this.goal.type == "pos" || this.goal.type == "wander") {
            return Math.hypot(this.self.x - this.goal.pos.x, this.self.y - this.goal.pos.y) < this.pathfinder.estimatedSpeed
        }
    }
    async updatePlayers(n) {
        if (this.goal.pathing) {
            let t;
            if (this.goal.type == "xpos") {
                t = [];
                for (let e = -this.pathfinder.size; e <= this.pathfinder.size; e++) {
                    t.push({
                        x: this.goal.pos.x,
                        y: this.self.y + e * this.pathfinder.res
                    })
                }
            } else if (this.goal.type == "ypos") {
                t = [];
                for (let e = -this.pathfinder.size; e <= this.pathfinder.size; e += 3) {
                    t.push({
                        x: this.self.x + e * this.pathfinder.res,
                        y: this.goal.pos.y
                    })
                }
            } else if (this.goal.type == "pos" || this.goal.type == "wander") {
                t = {
                    x: this.goal.pos.x,
                    y: this.goal.pos.y
                }
            } else if (this.goal.type == "player") {
                if (this.goal.entity === -1) {
                    t = [];
                    for (let e of n) {
                        if (e.visible && e.sid != this.self.sid) {
                            t.push(e)
                        }
                    }
                    if (!t.length) {
                        t = null
                    }
                } else {
                    for (let e of n) {
                        if (e.visible && e.sid != this.self.sid && (e.sid == this.goal.entity || e.name == this.goal.entity)) {
                            t = e;
                            break
                        }
                    }
                }
            } else if (this.goal.type == "team") {
                t = [];
                for (let e of n) {
                    if (e.team == this.self.team && e.sid != this.self.sid) {
                        t.push(e)
                    }
                }
                if (!t.length || !this.self.team) {
                    t = null
                }
            }
            if (t && !jt) {
                if (this.reachedGoal()) {
                    if (this.goal.type == "wander") {
                        this.goal.pos.x = Math.random() * 14400;
                        this.goal.pos.y = Math.random() * 14400
                    } else {
                        this.goal.pathing = false
                    }
                    this.pathfinder.clearPath();
                    T.send("a", undefined, "pathfinder")
                } else {
                    let e = await ri.pathTo(t);
                    if (e) {
                        T.send("a", e.ang, "pathfinder")
                    } else {
                        T.send("a", undefined, "pathfinder")
                    }
                }
            }
            this.finalGoal = t
        }
    }
    async updateAnimals(n) {
        if (this.goal.type == "animal" && this.goal.pathing) {
            let t;
            if (this.goal.entity === -1) {
                t = [];
                for (let e of n) {
                    if (e.visible && e.sid != this.self.sid) {
                        t.push(e)
                    }
                }
                if (!t.length) {
                    t = null
                }
            } else {
                for (let e of n) {
                    if (e.visible && (e.sid == this.goal.entity || e.name == this.goal.entity)) {
                        t = e;
                        break
                    }
                }
            }
            if (this.reachedGoal()) {
                this.pathfinder.clearPath();
                this.goal.pathing = false;
                T.send("a", undefined, "client")
            } else if (t) {
                let e = await this.pathfinder.pathTo(t);
                if (e) {
                    T.send("a", e.ang, "pathfinder")
                } else {
                    T.send("a", undefined, "pathfinder")
                }
            }
            this.finalGoal = t
        }
    }
    async addBuilding(n) {
        await new Promise(e => {
            let t = setInterval(() => {
                if (!this.pathfinder.resolve) {
                    e();
                    clearInterval(t)
                }
            })
            });
        let e = this.pathfinder.getPath();
        let i = e?.dist + this.pathfinder.estimatedSpeed / this.pathfinder.res + 3;
        i = Math.min(this.pathfinder.prevPath.length - 1, Math.trunc(i));
        if (i && !jt) {
            for (let t = i; t >= 0; t--) {
                let e = this.pathfinder.prevPath[t];
                if (Math.hypot(e.x - n.x, e.y - n.y) < n.pathScale) {
                    this.pathfinder.prevPath = this.pathfinder.prevPath.slice(t);
                    let e = await this.pathfinder.pathTo(this.finalGoal, true);
                    e && T.send("a", e.ang, "pathfinder");
                    break
                }
            }
        }
    }
}
si = new Jy(ri);

function qy(e, t, n) {
    let i, s, o;
    if (t === 0) {
        i = s = o = n
    } else {
        const r = function r(e, t, n) {
            if (n < 0) n += 1;
            if (n > 1) n -= 1;
            if (n < 1 / 6) return e + (t - e) * 6 * n;
            if (n < 1 / 2) return t;
            if (n < 2 / 3) return e + (t - e) * (2 / 3 - n) * 6;
            return e
        };
        const a = n < .5 ? n * (1 + t) : n + t - n * t;
        const l = 2 * n - a;
        i = r(l, a, e + 1 / 3);
        s = r(l, a, e);
        o = r(l, a, e - 1 / 3)
    }
    return [H(i * 255), H(s * 255), H(o * 255)]
}
async function $y() {
    if (wn) {
        I(6, 11);
        await A4();
        await A4();
        await A4();
        wn = false
    }
}

function Zy() {
    if (ro.checked && !Ut) {
        const e = (e, t) => (e => e > W ? ae - e : e)(S(e - t) % ae);
        const s = (e, t) => D(((t.x2 ?? t.x) - (e.x2 ?? e.x)) ** 2 + ((t.y2 ?? t.y) - (e.y2 ?? e.y)) ** 2);
        const n = ie.filter(e => s(z, e) <= s3 + 80 && !((xn || m.q) && s(z, e) < 900 && e.sr === 1 && lo.checked) && !e.inTrap && (e.millCount === 299 || e.upgraded >= 7));
        const i = n.reduce((e, t) => {
            const n = x4(t);
            return e + n
        }, 0) / n.length;
        let t = !isNaN(ae * n.length * i / s3) ? ae * n.length * i / s3 : 0;
        o3 += i3;
        const o = Array.from({
            length: n.length
        }, (e, t) => o3 + ae * t / n.length);
        const r = o.map(e => ({
            x: z.x2 + s3 * U(e),
            y: z.y2 + s3 * V(e)
        }));
        n.forEach((e, t) => {
            e.emit("a", B(e, r[t]));
            e.emit("D", B(z, e));
            e.bh(1)
        });
        const a = ae / n.length;
        ie.forEach((e, t) => {
            let n = s(z, e),
                i = B(e, z);
            if (n > s3 + 80 && !e.inTrap && (e.millCount === 299 || e.upgraded >= 7)) {
                e.bh();
                e.emit("a", i);
                e.emit("D", i);
                e.emit("d", 1, i);
                e.emit("d", 0, i)
            }
        })
    }
}

function e3() {
    if (!ie.length || !Ut) {
        Ut = null;
        Vt = null;
        return
    }
    Vt = kh.filter(e => {
        const t = Ut.r ? se(Ut, e) >= Ut.value : se(Ut, e) <= Ut.value;
        if (t && (Ut.types != "all" && (e.group?.name === "spikes" || e.name === "pit trap" || e?.name == "turret" && Zs.checked || e?.name == "teleporter" && Zs.checked) || Ut.types == "all" || e?.name == Ut.types || e?.group?.name == Ut.types) && (e.type === null || e.type === undefined)) {
            if ((Ut.IDS == "team" || Ut.IDS == "clan") && te(e?.owner?.sid)) {
                e.opacity = .15;
                return true
            }
            if ((Ut.IDS == "enemy" || Ut.IDS == "enemies" || Ut.IDS == "hostile" || Ut.IDS == "nEnemy") && !te(e?.owner?.sid)) {
                e.opacity = .15;
                return true
            }
            if (typeof Ut.IDS === "number" && e?.owner?.sid === Ut.IDS) {
                e.opacity = .15;
                return true
            }
            if (Ut.IDS == "all" || Ut.IDS == "every" || Ut.IDS == "everything") {
                e.opacity = .15;
                return true
            }
            if (!Ut.IDS && e?.owner?.sid === z.sid) {
                e.opacity = .15;
                return true
            }
        }
        return false
    });
    if (!Vt?.length) {
        Ut = null;
        Vt = null;
        U1.showText(z.x2, z.y2, 25, .35, 1500, "cleared buildings", "#fff")
    }
}

function t3(e, t) {
    if (!Ms.checked) return;
    t = x.weapons[ee]?.spdMult >= x.weapons[A]?.spdMult || A == null ? t = ee : t = A;
    if (e && z.buildIndex != -1) return t;
    if (p || Mt || hn || y || gt || z.pr != 1 || z.sr != 1 || z.hitting || At || Ct || z.buildIndex != -1) return;
    if (z.weaponIndex != t) T.send("G", t, true);
    if (e) return t
}

function n3() {
    return l4(z, 0, {
        buildIndex: -1,
        weaponIndex: z.weaponIndex,
        skinIndex: z.skinIndex,
        tailIndex: z.tailIndex,
        y2: z.y2,
        zIndex: null
    })
}
Si = x.weapons;
var i3 = .07;
var s3 = 650;
let o3 = 0;
const r3 = re(.993, 111);
const a3 = .5;

function l3(e, t) {
    if (isNaN(e) || e == Infinity) return null;
    let n = e;
    while (n >= .5) {
        n = n * re(.993, 111);
        e += n
    }
    return e
}

function c3(e, t, n, i) {
    return {
        buildIndex: !i ? -1 : i,
        weaponIndex: e,
        skinIndex: t,
        tailIndex: n,
        y: z.y2,
        zIndex: null
    }
}
const d3 = 1e3;
const u3 = Math.PI;
const f3 = 2 * Math.PI / d3;

function h3(t) {
    function n(e, t) {
        return typeof e === "number" && (e > t || t === undefined)
    }
    const i = new Map;
    Ci.forEach(e => {
        if (e.sid) {
            const t = i.get(e.sid);
            if (!t || n(e.expire, t.expire)) {
                i.set(e.sid, {
                    ...e
                })
            }
        }
    });
    Ci = Array.from(i.values());
    Ci.forEach(t => {
        if (t.deathAnim === true) {
            let e = P3(t.x, t.y, t.originDir, t.dstSpd);
            t.t1 = void 0 === t.t2 ? Date.now() : t.t2;
            t.t2 = Date.now();
            t.distance -= t.dstSpd;
            t.dt = 0;
            t.d1 = t.d2;
            t.spinSpd ? t.d2 += t.spinSpd : t.d2 = z.d2;
            t.x1 = t.x;
            t.y1 = t.y;
            t.x2 = e.x;
            t.y2 = e.y;
            if (t.tick === v + 1 && t.dstSpd === 0) {
                U1.showText(z.x2, z.y2, 50, .1, 500, H((se({
                    x: t.positions.accel.x,
                    y: t.positions.accel.y
                }, z) - 0) * 100) / 100, "#fff", true)
            }
        } else if (!isNaN(t.expire)) {
            t.t1 = void 0 === t.t2 ? Date.now() : t.t2;
            t.t2 = Date.now();
            t.distance -= t.dstSpd;
            t.dt = 0;
            t.d1 = t.d2;
            t.expire -= 1;
            t.x1 = t.x;
            t.y1 = t.y;
            t.x2 = t.NEWX;
            t.y2 = t.NEWY
        }
    });
    for (let e = 0; e < Ci.length; e++) {
        t = Ci[e];
        if (!t.deathAnim) continue;
        if (t.distance <= 0 || t.tick < v + 1 && t.dstSpd === 0 || t.vals === 0) Ci.splice(e, 1)
    }
    Ci = Ci.filter(e => e.expire >= 0 || e.expire === undefined)
}
var p3 = 0;

function m3(e, t, n) {
    if (!Ks || Date.now() - p3 < 730) return;
    var i = {
        ...e
    };
    i.vals = .5;
    i.expire = 3;
    i.decay = 0;
    i.distance = t;
    i.fake = true;
    i.dstSpd = t;
    i.orginDir = n;
    Ci.push(i);
    p3 = Date.now()
}

function g3(e, t, n, i, s, o, r, a) {
    var l = {
        ...e
    };
    l.skinIndex = i;
    l.tailIndex = s;
    l.vals = .8;
    l.deathAnim = true;
    l.spinSpd = n || 0;
    l.decay = o || 0;
    l.distance = 3e3;
    l.fake = true;
    l.dstSpd = t;
    l.tick = v + r + 1;
    l.positions = a;
    l.originDir = e.sid === z.sid ? Math.random() * 1e3 : B(z, e);
    Ci.push(l)
}

function y3(e, t, n, i, s, o) {
    var r = {
        ...e
    };
    r.x1 = t;
    r.y1 = n;
    r.x2 = t;
    r.y2 = n;
    r.showSID = true;
    r.skinIndex = i || 0;
    r.tailIndex = s || 0;
    r.weaponIndex = o || 0;
    console.log(r);
    return r
}

function x3(e, t, n, i) {
    var s = {
        ...e
    };
    s.purpose = t;
    s.moving = n;
    s.spinning = i;
    Ci.push(s)
}
async function w3() {
    if (!G["do"] || !ie.length || !ie[G?.val]) return;
    let n = ie[G.val];
    let e = Hg(n.sid);
    if (Date.now() - n.spawnTime < 300) return;
    const t = (t, e) => e.some(e => e.sid === t.sid);
    const i = (t, e) => e.some(e => e.visible && t.visible && e.sid === t.sid && e.sid != n.sid || t.sid == n.sid && e.sid === n.sid && e.visible);
    const s = n.builds.filter(e => !t(e, Xt));
    const o = n.players.filter(e => !i(e, J));
    ts = {
        players: o,
        bot: e?.visible ? e : n.findPlayer(n.sid),
        builds: s
    }
}
async function b3() {
    if ($i == z.sid) {
        Hn && fs.checked && Ki.send(le({
            msg: "spectateData",
            sender: z?.sid,
            player: z,
            players: J,
            builds: kh,
            time: tn,
            server: location.href
        }))
    }
    if (!es.isDoing) {
        es.rPlayer = null;
        es.players = [];
        es.builds = []
    } else {
        es.rBuilds = es?.builds.filter(e => !as(e, Xt));
        es.rPlayer = es?.player;
        es.rPlayers = es?.players
    }
}

function v3(o, r, a, e, l, c, d, u, f) {
    let t = {
        x: Infinity,
        y: Infinity,
        fake: true
    };
    c = Q.filter(e => e?.group?.name == "spikes" && (o.sid != z.sid ? te(e?.owner?.sid) || o?.team === null && e?.owner?.sid != o.sid : !te(e?.owner?.sid)) || e?.type == 1 && e.y >= 12e3);
    if (!c) return false;
    if (e) {
        d = o.np.real.x;
        u = o.np.real.y
    } else {
        d = o.x2;
        u = o.y2
    }
    for (let s in c) {
        let t = c[s];
        f = t.type === 1 ? f = t.scale * .55 + 35 : t.scale + 35;
        let n = se(o, t);
        let e = P3(d, u, r, n);
        let i = se(e, t);
        if (i < f && n - f < a && (l && t.dmg >= 35 || t.type === 1 || !l)) {
            let e = P3(d, u, r, n - f);
            return {
                x: e.x,
                y: e.y,
                obj: t
            }
        }
    }
    return false
}

function k3(o, r, a, e, t, l, c, d, u) {
    let n = {
        x: Infinity,
        y: Infinity,
        fake: true
    };
    l = Q.filter(e => e.name == "pit trap" && (o.sid != z.sid ? te(e?.owner?.sid) || o?.team === null && e?.owner?.sid != o.sid : !te(e?.owner?.sid)));
    if (!l) return false;
    if (e) {
        c = o.np.real.x;
        d = o.np.real.y
    } else {
        c = o.x2;
        d = o.y2
    }
    for (let s in l) {
        let t = l[s];
        u = t.scale + 35;
        let n = se(o, t);
        let e = P3(c, d, r, n);
        let i = se(e, t);
        if (i < u && n - u < a) {
            let e = P3(c, d, r, n - u);
            return {
                x: e.x,
                y: e.y,
                obj: t
            }
        }
    }
    return false
}
let A3 = 0;
let I3 = {
    time: Date.now(),
    type: null
};
var S3 = 0;

function E3(c, d, u, f, h, p) {
    if (!en) return;
    h = Q.filter(e => e?.group?.name == "spikes" && !te(e?.owner?.sid) || e?.type == 1 && e.y >= 12e3 || e.name == "teleporter").sort((e, t) => Ne(c.x2 - e.x, c.y2 - e.y) - Ne(c.x2 - t.x, c.y2 - e.y));
    if (!h.length) return false;
    for (let a = 0, l; a < h.length; a++) {
        p = (l = h[a]).type === 1 ? l.scale * .6 + 35 : l.teleport ? l.scale * .75 + 35 : l.scale + 35;
        let e = [l3(u.vel), l3(c.movSpd)];
        let t = [P3(c.x2, c.y2, d, e[0]), P3(c.x2, c.y2, d, e[1])];
        let n = se(t[0], l) <= p || se(t[1], l) <= p;
        isNaN(f) === true && (f = 0);
        let i = A === 10 ? 75 : x.weapons[ee].range;
        let s = [se(c, l, "object") <= i, se(c.np.decel, l, "object") <= i];
        let o = Ps.checked && (s[0] || s[1]) && n && l.type !== 1;
        let r = n || (s[0] || s[1]) && n && l.type !== 1;
        if (r) {
            let e;
            if (o) {
                e = vg(l, A === 10 ? 75 : x.weapons[ee].range, h)
            }
            if (!m.ShiftLeft) {
                T.send("a", undefined);
                if (Date.now() - I3.time >= 250 && I3.type == "static" || I3.type != "static") U1.showText(c.x2, c.y2, 30, .1, 500, "stop", "#fff", true), I3 = {
                    time: Date.now(),
                    type: "static"
                };
                if (o && (A === 10 && c.sr === 1 || c.pr === 1 && A != 10 && ee != 8)) {
                    y = A === 10 ? 10 : ee;
                    Ot = true;
                    S3 = v;
                    g[0] = e;
                    Bg(e, A === 10 ? A : ee, A === 10 ? z.secondaryVar : z.primaryVar, Nn.includes(40) && !z.dmgpot.soldier ? 40 : 6, 1);
                    ct = true;
                    if ($t != 40) I(z.dmgpot.soldier ? 6 : 40, 11);
                    nn = z.dmgpot.soldier ? 6 : 40
                }
            } else if (Date.now() - I3.time >= 250 && I3.type == "override" || I3.type != "override") U1.showText(c.x2, c.y2, 20, .22, 500, "override", "#fff"), I3 = {
                time: Date.now(),
                type: "override"
            };
            return l
        }
    }
    return false
}

function T3(e, t, n, i) {
    const s = t[0] - e[0];
    const o = t[1] - e[1];
    const r = s * s + o * o;
    if (r === 0) {
        const d = (e[0] - n[0]) ** 2 + (e[1] - n[1]) ** 2;
        return d <= i ** 2
    }
    const a = oe(0, j(1, ((n[0] - e[0]) * s + (n[1] - e[1]) * o) / r));
    const l = e[0] + a * s;
    const c = e[1] + a * o;
    const d = (l - n[0]) ** 2 + (c - n[1]) ** 2;
    return d <= i ** 2
}

function C3(a, l, c, d) {
    if (a.inTrap || !yo.checked) return;
    c = a.builds.filter(e =>
        (e?.group?.name == "spikes" && !a.teamer(e?.owner?.sid)) ||
        e.name == "teleporter" ||
        e.name == "boost pad" // Added boost pads
    ).sort((e, t) => Ne(a.x2 - e.x, a.y2 - e.y) - Ne(a.x2 - t.x, a.y2 - e.y));
    a.np = l4(a, l, a, 1);
    if (!c.length) return false;
    for (let r = 0; r < c.length; r++) {
        let e = c[r];
        d = e.type === 1 ? e.scale * .6 :
            e.teleport ? e.scale * .8 :
            e.name == "boost pad" ? e.scale * .7 : // Adjusted scale for boost pads
            e.scale;
        d += 35;
        let t = l3(a.np.vel);
        let n = P3(a.x2, a.y2, l, j(d, t));
        let i = se(n, e) <= d;
        let s = a.weapons[1] === 10 ? x.weapons[10].range : x.weapons[a.weapons[0]].range;
        let o = xo.checked && (i || a.tick - a.stopHit <= 3 && (se(a, e, "object") <= s || se(a.np.decel, e, "object") <= s) && e.type !== 1 && a.skinIndex === 40) ? true : false;
        if (o) {
            a.emit("a", null);
            a["break"](e);
            a.stopHit = a.tick;
        }
        if (i) return {
            obj: e,
            "break": o
        };
    }
    return false;
}


function B3(t, n, i) {
    let s = function(t) {
        for (let e = 0; e < C0.length; e++)
            if (t == C0[e].id) {
                return C0[e].spdMult
            }
    }($t) || 1;
    let e = function(t) {
        for (let e = 0; e < B0.length; e++)
            if (t == B0[e].id) {
                return B0[e].spdMult
            }
    }(Zt) || 1;
    let o = x.weapons[z.weapons[z.weaponIndex] || z.weapons[0]].spdMult || 1;
    Ry = My * o * s * e * (z.y2 < K.snowBiomeTop && $t != 15 ? K.snowSpeed : 1);
    if (Dn !== undefined) {
        n = {
            x2: z.x2 + Ry * U(Dn) + (z.x2 - z.x1) / 100,
            y2: z.y2 + Ry * V(Dn) + (z.y2 - z.y1) / 100
        };
        for (let e = 0; e < Q.length; e++) {
            i = Q[e];
            if (se(x, i) > Ry + 100) {
                break
            }
            if (i?.group?.name == "spikes" && !te(i.owner.sid) || i.type === 1 && i.y >= 12e3) {
                let e = Dy(i, n);
                if (Dy(i, n) < i.scale + 40) {
                    t = null;
                    T.send("a", t);
                    return true;
                    break
                }
            }
        }
    }
    if (Dn === undefined) {
        n = {
            x2: z.x2 + Ry * U(Dn) + (z.x2 - z.x1) / 90,
            y2: z.y2 + Ry * V(Dn) + (z.y2 - z.y1) / 90
        };
        for (let e = 0; e < Q.length; e++) {
            i = Q[e];
            if (se(x, i) > Ry + 100) {
                break
            }
            if (i?.group?.name == "spikes" && !te(i.owner.sid) || i.type === 1 && i.y >= 12e3) {
                let e = Dy(i, n);
                if (Dy(i, n) < i.scale + 40) {
                    if (Dy(Y, z) > x.weapons[z.weapons[z.weapons[1] == 10 ? 1 : 0]].range + 200 && z.skins[40]) {
                        let e = Ry * .3 / s;
                        n = {
                            x2: z.x2 + e * U(Dn) + (z.x2 - z.x1) / 90,
                            y2: z.y2 + e * V(Dn) + (z.y2 - z.y1) / 90
                        };
                        if (Dy(i, n) > i.scale + 60) {} else {
                            t = null;
                            T.send("a", t);
                            return true
                        }
                    } else {
                        t = null;
                        T.send("a", t);
                        return true
                    }
                    break
                }
            }
        }
    }
    return false
}

function D3(s, o, r, a, t) {
    let l = {
        x: Infinity,
        y: Infinity,
        fake: true
    };
    t = Xt.concat(J, bh);
    for (let e in t) {
        let i = t[e];
        if (!i.ignoreCollision) {
            let t = ky(s, o, i.x, i.y);
            let e = P3(s, o, r, t);
            let n = ky(e.x, e.y, i.x, i.y);
            if (n < i.scale && t - i.scale < a) {
                let e = P3(s, o, r, t - i.scale);
                if (ky(l.x, l.y, z.x, z.y) > ky(e.x, e.y, z.x, z.y)) {
                    l = e
                }
            }
        }
    }
    if (l.fake) {
        return false
    } else {
        return l
    }
}

function P3(e, t, n, i) {
    if (n == undefined) {
        return {
            x: z.x,
            y: z.y
        }
    } else {
        e = e + i * U(n);
        t = t + i * V(n);
        return {
            x: e,
            y: t
        }
    }
}

function R3(t, n, i, e) {
    let s = e(z, {
        x: t,
        y: n
    });
    let o = P3(t, n, i, e);
    let r = e(z, o);
    if (r < 35 && s - 35 < e) {
        let e = P3(t, n, i, s - 35);
        return true
    } else {
        return false
    }
}

function M3(e, t, n) {
    return t <= e + n / 2 && t >= e - n / 2 || (e >= 0 ? e + n / 2 > 3.14 && t <= -3.14 + (e + n / 2 - 3.14) : e - n / 2 < -3.14 && t >= 3.14 + (e - n / 2 + 3.14))
}

function N3(e, t) {
    return Math.atan2(t.y - e.y, t.x - e.x)
}
class O3 {
    constructor(e, t) {
        this.dir = e;
        this.building = t;
        this.building.players = [];
        let n = this;
        new Promise(function(e, t) {
            n.resolve = e;
            setTimeout(function() {
                t()
            }, 111)
        }).then(function(e) {
            n.building.health -= e;
            n.remove()
        })["catch"](function() {
            n.remove()
        })
    }
    remove() {
        for (let e = 0; e < ft.length; e++) {
            if (ft[e] == this) {
                ft.splice(e, 1);
                break
            }
        }
    }
    attemptResolve(s, o, r, e, t) {
        if (e && this.building.sid == e.building.sid && r === this.building.tick) {
            this.resolve(this.building.projDmg ? e.dmg : 0)
        } else if (t && !e && r === this.building.tick) {
            this.resolve(200);
            if (ws.checked) U1.showText(this.building.x, this.building.y, 20, .085, 350, 200, "#00aaff")
        } else if (!e && this.building.owner != null && this.building.name != "mine" && this.building.name != "sapling") {
            let e = P(this.building.y - s.y2, this.building.x - s.x2);
            let t = B(s, this.building);
            let n = Math.hypot(s.x2 - this.building.x, s.y2 - this.building.y);
            let i = {
                x: s.x2 + Math.cos(s.d2) * 35 * (n > this.building.scale),
                y: s.y2 + Math.sin(s.d2) * 35 * (n > this.building.scale)
            };
            if ((H(e * 10) / 10 == this.dir || Ay(H(e * 10) / 10, this.dir) <= .1005) && r == this.building.tick && se(s, this.building, "object") <= x.weapons[s.weaponIndex].range && X.getAngleDist(t, s.d2) <= h && !this.building.players.includes(s.sid)) {
                this.resolve(En[s.weaponVariant] * (o == 40 ? 3.3 : 1) * x.weapons[s.weaponIndex].dmg * (s.weaponIndex == 10 ? 7.5 : 1));
                this.building.players.push(s.sid);
                if (!Ei.includes(s.sid) && ws.checked) U1.showText(this.building.x, this.building.y, 20, .085, 350, H(En[s.weaponVariant] * (o == 40 ? 3.3 : 1) * x.weapons[s.weaponIndex].dmg * (s.weaponIndex == 10 ? 7.5 : 1)), "#00aaff")
            }
        }
    }
}

function L3(e, t) {
    let n = S((e.x2 || e.x) - (t.x2 || t.x));
    let i = S((e.y2 || e.y) - (t.y2 || t.y));
    if (n <= K.maxScreenWidth / 2 * 1.3 && i <= K.maxScreenHeight / 2 * 1.3) {
        return true
    }
    return false
}
const F3 = "(" + (() => {
    const {
        sqrt: u,
        abs: f,
        floor: h
    } = Math;
    const {
        MAX_VALUE: p
    } = Number;
    const r = u(2);
    const m = 900;
    const g = 12;
    const y = g / 2;
    const t = JSON.stringify(new Array(Math.round(m / g)).fill([]));
    const x = JSON.parse(t).length;
    const w = [0, -1, 0, 1, -1, 0, 1, 0, 1, 1, 1, -1, -1, 1, -1, -1];
    const b = w.length;
    const e = ["boost pad", "teleporter"];

    function v(e, t, n, i) {
        return u((e - n) ** 2 + (t - i) ** 2)
    }

    function k(e, t, n, i) {
        const s = f(e - n);
        const o = f(t - i);
        return ((s === 0) + (o === 0)) * g + (s !== 0 && o !== 0) * g * r
    }

    function A(s, o, r, a, l) {
        let e = JSON.parse(t),
            c = 0,
            d = 0;
        for (let i = 0; i < x; i++) {
            let t = e[i];
            for (let e = 0; e < x; e++) {
                let n = t[e] = {
                    x: i * g - m / 2 + s,
                    y: e * g - m / 2 + o,
                    obstacle: false,
                    available: 1,
                    n: i * x + e
                };
                if (n.x < 0 || n.x > 14400 || n.y < 0 || n.y > 14400) {
                    n.obstacle = 1;
                    continue
                }
                for (let e = r.length, t; e--, t = r[e];) {
                    if (n.obstacle = f(t.x - n.x) <= t.scale2 + 20 && f(t.y - n.y) <= t.scale2 + 20 && u((t.x - n.x) ** 2 + (t.y - n.y) ** 2) - t.scale2 - 20 <= 0) break
                }
                n.target = f(n.x - a) <= y && f(n.y - l) <= y;
                c = n.target * n.n + !n.target * c;
                n.start = f(n.x - s) <= y && f(n.y - o) <= y;
                d = n.start * n.n + !n.start * d;
                n.fCost = n.start * -p;
                n.gCost = !n.start * p;
                if (n.target + n.start > 0) continue
            }
        }
        return {
            map: e,
            targetNode: c,
            startNode: d
        }
    }
    onmessage = function(e) {
        let {
            player: t,
            target: s,
            buildings: n,
            clan: i
        } = e.data;
        if (v(t.x2, t.y2, s.x, s.y) <= 0) return postMessage("reached target");
        let {
            map: o,
            startNode: r,
            targetNode: a
        } = A(t.x2, t.y2, n.filter(e => {
            e.scale2 = (e.owner == null || e.name == "sapling") && e.type === 0 ? e.scale * .7 : e.dmg && !i.includes(e?.owner?.sid) && e?.owner?.sid != t.sid ? e.scale + 40 : e.type === 1 && e.y < 12e3 && (e.teleport || e.boostSpeed) ? e.scale + 35 : e["do"] ? e.scale : e.scale - 10;
            return (e.ignoreCollision ? e.name === "pit trap" ? e?.owner?.sid != t.sid && !i.includes(e.owner?.sid) : e.name === "boost pad" || e.name === "teleporter" : true) && v(e.x, e.y, t.x2, t.y2) < m
        }), s.x, s.y);
        let l = [],
            c = [],
            d, u = 1e5;
        l.push(r);
        while (l.length * u--) {
            let n = Infinity,
                i;
            for (let e = l.length, t; e--;) {
                t = o[h(l[e] / x)][l[e] % x];
                if (t.fCost < n) {
                    d = t;
                    n = t.fCost;
                    i = e
                }
            }
            l.splice(i, 1);
            c.push(d.n);
            if (d.target) break;
            for (let t = 0, n; t < b; t++) {
                n = o[h(d.n / x) + w[t]]?.[d.n % x + w[t + 1]];
                if (!n || c.includes(n.n)) continue;
                let e = d.gCost + k(w[t], w[t + 1], 0, 0);
                if (!n.obstacle && n.available === 1) {
                    if (!l.includes(n.n)) {
                        n.parent = d.n;
                        n.gCost = e;
                        n.hCost = v(n.x, n.y, s.x, s.y);
                        n.fCost = e + n.hCost;
                        l.push(n.n)
                    } else if (e < n.gCost) {
                        n.parent = d.n;
                        n.gCost = e;
                        n.fCost = e + n.hCost
                    }
                }
            }
        }
        if (u === 0) return postMessage("reached max iterations");
        if (!l.length) return postMessage("couldn't reach target");
        l = [];
        while (!d.start) {
            l.push(d.y, d.x);
            d = o[h(d.parent / x)][d.parent % x]
        }
        postMessage(l.reverse())
    }
}).toString() + ")();";
var _3 = [];
var V3 = [];

function U3(o) {
    return new Promise((n, t) => {
        o = JSON.parse(le(o));
        let i = -1;
        for (let e = 0; e < V3.length; e++) {
            if (V3[e]) {
                i = e;
                V3[e] = false;
                _3[e].postMessage(o);
                break
            }
        }
        if (i === -1) {
            j3();
            i = _3.length - 1;
            V3.push(false);
            _3[i].postMessage(o)
        }

        function e(e) {
            let t = false;
            if (typeof e.data === "string") {
                Y3 = [];
                t = false
            } else {
                Y3 = e.data;
                t = e.data.length > 0
            }
            H3(_3[i]);
            n(t)
        }

        function s(e) {
            t(e)
        }
        _3[i].onmessage = e;
        _3[i].onerror = s
    })
}

function j3() {
    let e = new Blob([F3]);
    let t = URL.createObjectURL(e);
    e = new Worker(t);
    _3.push(e);
    V3.push(true)
}

function H3(t) {
    for (let e = _3.length; e--;) {
        if (_3[e] === t) {
            V3[e] = true;
            return
        }
    }
}
var W3, Q3;
var Y3 = [];
var z3;
var G3 = Infinity;
var K3;
var X3 = 0;
var J3 = 0;
var q3, ie = [];
var $3 = [],
    Z3 = [],
    ex = {
        x: 0,
        y: 0
    },
    tx = [];
const nx = document.createElement("style");
nx.innerHTML = `
    #customMenu {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        height: 600px;
        background-color: white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        border-radius: 10px;
        display: none;
        padding: 20px;
        box-sizing: border-box;
        overflow-y: auto; /* Vertical scroll bar */
    }
    #botPanelText {
        margin-bottom: 10px;
        font-size: 1.5em;
        font-weight: bold;
    }
    #botCount {
        margin-bottom: 20px;
        font-size: 1.2em;
        color: #4CAF50; /* Green color */
        font-weight: bold;
    }
    .tabContainer {
        display: flex;
        flex-direction: column; /* Display tabs vertically */
        align-items: center; /* Center-align tabs */
        width: 100%;
    }
    .menuTab {
        margin: 5px;
        padding: 15px 30px;
        background-color: #007BFF;
        color: white;
        text-align: center;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        font-size: 1.2em;
        position: relative; /* Positioning for relative elements */
    }
    #backBtn {
        margin-top: 20px; /* Add margin to separate from tabs */
        padding: 15px 30px;
        background-color: #FF5733;
        color: white;
        text-align: center;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        display: none;
        font-size: 1.2em;
    }
    .pageContent {
        display: none;
        text-align: center;
        width: 100%;
        height: 100%;
        overflow: auto;
        position: relative; /* Positioning for relative elements */
    }
    .pageContent h1 {
        margin-top: 0;
    }
    .disconnectBtn {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #FF5733;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1em;
    }
    .navBtn {
        position: absolute;
        bottom: 10px;
        font-size: 1em;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
    }
    .prevBtn {
        left: 20px;
        background-color: #FFA500; /* Orange color */
        color: white;
    }
    .nextBtn {
        right: 20px;
        background-color: #FFA500; /* Orange color */
        color: white;
    }
`;
document.head.appendChild(nx);
const ix = document.createElement("div");
ix.id = "customMenu";
const sx = document.createElement("div");
sx.id = "botPanelText";
sx.innerText = "x18k Bot Panel";
ix.appendChild(sx);
const ox = document.createElement("div");
ox.id = "botCount";
ox.innerText = "Bot Count: 0";
ix.appendChild(ox);
const rx = document.createElement("div");
rx.className = "tabContainer";
ix.appendChild(rx);
const ax = document.createElement("a");
ax.id = "backBtn";
ax.innerText = "Back to Menu";
ax.href = "#";
ax.onclick = function(e) {
    e.preventDefault();
    gx()
};
ix.appendChild(ax);
document.body.appendChild(ix);
let lx = 0;
document.addEventListener("keydown", function(e) {
    if (e.key === "`") {
        if (ix.style.display === "none" || ix.style.display === "") {
            ix.style.display = "flex";
            gx()
        } else {
            ix.style.display = "none"
        }
    }
});
let cx;
let dx;
let ux;

function fx(t) {
    const e = document.createElement("a");
    e.className = "menuTab";
    e.innerText = `Bot ${t}`;
    e.href = `#page${t}`;
    e.id = `tab${t}`;
    e.onclick = function(e) {
        e.preventDefault();
        mx(t)
    };
    ix.appendChild(e);
    const n = document.createElement("div");
    n.className = "pageContent";
    n.id = `page${t}`;
    cx = document.createElement("p");
    cx.id = `age${t}`;
    cx.innerText = `Age: 0`;
    n.appendChild(cx);
    dx = document.createElement("p");
    dx.id = `windmillCount${t}`;
    dx.innerText = `Windmill Count: 0`;
    n.appendChild(dx);
    ux = document.createElement("p");
    ux.id = `gold${t}`;
    ux.innerText = `Gold: 0`;
    n.appendChild(ux);
    const i = document.createElement("p");
    i.innerText = `You are Viewing: Bot ${t}`;
    n.appendChild(i);
    const s = document.createElement("button");
    s.className = "disconnectBtn";
    s.innerText = "Disconnect";
    s.onclick = function() {
        hx(t);
        Xp(`!dc ${t}`)
    };
    n.appendChild(s);
    const o = document.createElement("button");
    o.className = "navBtn prevBtn";
    o.innerText = "Prev";
    o.onclick = function() {
        if (t > 1) {
            mx(t - 1)
        }
    };
    n.appendChild(o);
    const r = document.createElement("button");
    r.className = "navBtn nextBtn";
    r.innerText = "Next";
    r.onclick = function() {
        const e = document.querySelectorAll(".menuTab").length;
        if (t < e) {
            mx(t + 1)
        }
    };
    n.appendChild(r);
    ix.appendChild(n)
}

function hx(e) {
    const t = document.getElementById(`tab${e}`);
    if (t) {
        t.remove();
        const n = document.getElementById(`page${e}`);
        if (n) {
            n.remove()
        }
    }
}

function px() {
    rx.innerHTML = "";
    const e = document.querySelectorAll(".pageContent");
    e.forEach(e => e.remove())
}

function mx(e) {
    const t = document.querySelectorAll(".menuTab");
    t.forEach(e => e.style.display = "none");
    ax.style.display = "block";
    const n = document.querySelectorAll(".pageContent");
    n.forEach(e => e.style.display = "none");
    const i = document.getElementById(`page${e}`);
    if (i) {
        i.style.display = "block"
    }
    lx = e
}

function gx() {
    const e = document.querySelectorAll(".menuTab");
    e.forEach(e => e.style.display = "block");
    ax.style.display = "none";
    const t = document.querySelectorAll(".pageContent");
    t.forEach(e => e.style.display = "none")
}
const yx = document.getElementById("botCount");
let xx;
const wx = async t => new Promise(e => setTimeout(e, t));
const bx = (e, t) => {

console.log(V0);
    const n = q3.url.split("token=")[0] + "token=" + encodeURIComponent("alt:" + V0);

console.log(n);
    let c = new WebSocket(n);
    c.binaryType = "arraybuffer";
    c.botType = t;
    c.healTimeout = Date.now();
    c.builds = [];
    c.primary = null;
    c.secondary = null;
    c.invisTime = 1e3;
    c.players = [];
    c.oldCoords = {};
    c.millCount = 0;
    c.spawnTime = Date.now();
    c.HERE = true;
    c.enemies = [];
    c.pingTime = -1;
    c.holdItem = 0;
    c.aimAt = 0;
    c.nEnemy = null;
    c.kys = false;
    c.alive = false;
    c.deaths = 0;
    c.clanMates = [];
    c.samRS = 1;
    c.samRP = 1;
    c.breaker = false;
    c.stopHit = false;
    c.upgraded = 0;
    c.moveDir = 0;
    c.moveDirection = 0;
    c.health = 100;
    c.gold = 100;
    c.doMills = true;
    c.fS = false;
    c.x2 = 0;
    c.sid = null;
    c.y2 = 0;
    c.buyer = [
        [11], 40, 1, 53, 6, 7, 56, 12, 15, 31, [21], 22, 26, 11, 20, [18],
        [19],
        [13]
    ];
    c.x = 0;
    c.y = 0;
    c.getCrossBow = true;
    c.ping = 0;
    c.pingavg = 0;
    c.pingarr = [];
    c.weaponIndex = 0;
    c.packets = 0;
    c.autoHit = false;
    c.hitPacket = 0;
    c.player = [];
    c.skins = [0];
    c.tails = [];
    c.pr = 1;
    c.sr = 1;
    c.tr = 1;
    c.updater = [];
    c.moveRan = {
        angle: vx(),
        x: 0,
        y: 0,
        lastChange: 0
    };
    c.justShot = Date.now();
    c.emit = (e, t, n, i) => {
        if (e == "G") e = "z";
        if (e == "d") e = "F";
        if (e == "a") e = "9";
        if (!c.fS) {
            c.fS = true;
            setTimeout(() => {
                c.fS = false;
                c.packets = 0
            }, 1e3)
        }
        c.packets++;
        if (c.packets >= 85) return;
        if (e == "9") c.moveDir = t;
        if (e === "K") {
            c.hitPacket++
        }
        c.send(window.msgpack.encode([e, [t, n, i]]))
    };
    c.findPlayer = function(t) {
        for (let e = 0; e < c.players.length; e++) {
            if (c.players[e].sid == t) return c.players[e]
        }
        return null
    };
    c.findBuilding = function(t) {
        for (let e = 0; e < c.builds.length; e++) {
            if (c.builds[e].sid == t) return c.builds[e]
        }
        return null
    };
    c.spawn = function(e) {
        c.wood = 100;
        c.stone = 100;
        c.food = 100;
        c.points = 100;
        c.upgraded = 0;
        c.alive = true;
        c.kys = false;
        c.sr = 1;
        c.pr = 1;
        c.weapons = [0];
        c.primary = 0;
        c.secondary = null;
        c.items = [0, 3, 6, 10];
        e = H(Math.random() * 11);
        c.emit("M", {
            name: _e,
            moofoll: 1,
            skin: 0
        });
        c.health = 100
    };
    c.storeEquip = function(e, t) {
        c.emit("c", 0, e, t)
    };
    c.checkMove = function(s, o, r, e, t, a, l, c) {
        let n = {
            x: Infinity,
            y: Infinity,
            fake: true
        };
        if (e) {
            a = s.np.real.x;
            l = s.np.real.y
        } else {
            a = s.x2;
            l = s.y2
        }
        for (let e in t) {
            let i = t[e];
            c = i.real.scale + 35 + 30;
            if (Y.team == null) {
                let t = se(s, i);
                let e = P3(a, l, o, t);
                let n = se(e, i);
                if (n < c && t - c < r + c) {
                    let e = P3(a, l, o, t - c);
                    return {
                        x: e.x,
                        y: e.y,
                        obj: i
                    }
                }
            }
        }
        return false
    };
    c.storeBuy = function(e, t) {
        c.emit("c", 1, e, t)
    };
    c.wait = async function(e) {
        await wx(e)
    };
    c.buyEquip = function(t, e) {
        if (e == 0) {
            if (c.skins.includes(t)) {
                if (c.skinIndex != t) {
                    c.storeEquip(t, 0)
                }
            } else {
                let e = C0.find(e => e.id == t)?.price;
                if (c.gold >= e) {
                    c.storeBuy(t, 0)
                }
            }
        } else if (e == 1) {
            if (c.tails.includes(t)) {
                if (c.tailIndex != t) {
                    c.storeEquip(t, 1)
                }
            } else {
                if (t == 11) {
                    B0.find(e => c.gold >= e?.price);
                    if (c.gold >= 2e3) {
                        c.storeBuy(t, 1)
                    } else {
                        if (c.tailIndex != 0) {
                            c.storeEquip(0, 1)
                        }
                    }
                }
            }
        }
    };
    c.Hg = function(e, t) {
        if (c.kys) e = 7;
        if (e) c.buyEquip(e, 0);
        if (t) c.buyEquip(m.ShiftLeft ? c.skins.includes(19) ? 19 : 0 : t, 1)
    };
    c.bh = function(e) {
        let t = c.nEnemy && c.nEnemy.distance < 300 || c.health <= 80 || c.moveDirection === null || c.moveDirection === undefined ? true : false;
        if (c.y < 2400) {
            c.Hg(t ? 6 : 15, m.ShiftLeft ? 0 : 11)
        } else if (c.y >= K.mapScale / 2 - K.riverWidth / 2 && c.y <= K.mapScale / 2 + K.riverWidth / 2) {
            c.Hg(31, 11)
        } else {
            c.Hg(t ? 6 : 12, m.ShiftLeft ? 0 : 11)
        }
    };
    c.checkPlace = function(e, t, n, i) {
        i = x.list[e];
        n = i.scale + 35 + (i.placeOffset || 0);
        var s = c.x2 + n * U(t);
        var o = c.y2 + n * V(t);
        if (C.checkItemLocationBot(s, o, i.scale, .6, i.id, false, c.builds)) {
            c.emit("G", e);
            c.emit("d", 1, t);
            c.emit("G", c.weaponIndex, 1)
        }
    };

    function i() {
        c.emit("G", c.items[0]);
        c.emit("G", 1);
        c.emit("G", c.weaponIndex, true)
    }
    c.autobuy = function() {
        if (c.skins.length + c.tails.length >= 66) return;
        if (c.buyer.length) {
            if (!Array.isArray(c.buyer[0]) && c.gold >= C0.find(e => e.id == c.buyer[0]).price) c.storeBuy(c.buyer[0], 0);
            if (Array.isArray(c.buyer[0]) && c.gold >= B0.find(e => e.id == c.buyer[0][0]).price) c.storeBuy(c.buyer[0][0], 1)
        }
        if (c.buyer.length == 0 && c.skins.length != C0.length - 1) {
            let e = C0.find(e => e.id != 45 && !c.skins.includes(e.id) && c.gold >= e.price);
            if (e) c.storeBuy(e.id, 0);
            let t = B0.find(e => !c.tails.includes(e.id) && c.gold >= e.price);
            if (t) c.storeBuy(t.id, 1)
        }
    };

    function s(e) {
        return e * (W / 180)
    }
    c.upgrade = function(e) {
        c.emit("H", e)
    };
    c.mill = {
        x: 0,
        y: 0
    };
    c.old = {
        x: 0,
        y: 0
    };
    c.miller = function() {
        if ((c.old.x != c.x || c.old.y != c.y) && !(c.y >= K.mapScale / 2 - K.riverWidth / 2 && c.y <= K.mapScale / 2 + K.riverWidth / 2)) {
            if (Math.hypot(c.mill.y - c.y, c.mill.x - c.x) > 94) {
                c.place(c.items[3], c.moveDirection - s(94 / 1.25) + W);
                c.place(c.items[3], c.moveDirection + s(94 / 1.25) + W);
                c.place(c.items[3], c.moveDirection + W);
                c.emit("G", c.primary, true);
                c.mill.x = c.x;
                c.mill.y = c.y
            }
            c.old.x = c.x;
            c.old.y = c.y
        }
    };
    c.weapons = [0];
    c.items = [0, 3, 6, 10];
    c.autoaiming = false;
    c.tick = 0;
    c.time = Date.now();
    c.teamer = function(e) {
        if (e == c.sid) return true;
        return c.clanMates.includes(e)
    };
    c.mapping = Date.now();
    c.mapFix = function() {
        c.oldCoords = {
            x: c.x,
            y: c.y
        }
    };
    c.doProjectileSync = (e, t) => {
        let n = Hg(xi ? xi : Y.sid);
        if (xi && (!n || !n.visible)) n = Y;
        let i = n.sid === Y.sid ? Y.positions : n;
        let s = n ? _g(c, i, x.weapons[c.weapons[1]].projSpd, n) : null;
        let o;
        let r = [];
        let a = {
            ...n
        };
        a.sid = 1e5;
        if (s === null) return false;
        if (uo.checked) {
            if (s.norm.dist > 700 || c.secondary === 12) {
                a.x2 = s.marks.pos.x;
                a.x2 = s.marks.pos.y;
                if (Dg(c, N5, t)) {
                    o = s.marks.dir;
                    r = [1, 11]
                }
            }
            if (!r.length && s.norm.dist <= 700) {
                a.x2 = s.norm.pos.x;
                a.x2 = s.norm.pos.y;
                if (Dg(c, N5, t)) {
                    o = s.norm.dir;
                    r = [53, 11]
                }
            }
        } else {
            o = B(c, Y);
            r = [53, 11]
        }
        c.Hg(r[0], r[1]);
        c.emit("G", c.weapons[1], true);
        c.emit("D", o);
        if (c.items[5] == 18) {
            c.place(c.items[5], o, c.weapons[1]);
            c.place(c.items[5], o + Z(180), c.weapons[1]);
            c.place(c.items[5], o - Z(90), c.weapons[1]);
            c.place(c.items[5], o + Z(90), c.weapons[1])
        }
        c.emit("d", 1, o);
        c.emit("d", 0, o)
    };
    c.place = function(e, t, n) {
        !n && (n = c.weaponIndex);
        c.emit("G", e, null);
        c.emit("d", 1, t);
        n && c.emit("G", n, true)
    };
    c.pingSocketResponse = function() {
        c.pingTime = Date.now()
    };
    c.health = 100;
    c.onopen = async () => {
        c.HERE = true;
        await wx(111);
        c.spawn();
        c.pingSocketResponse()
    };
    c["break"] = function(e) {
        let t = B(c, e);
        c.emit("D", t);
        c.emit("d", 1, t);
        c.emit("d", 0, t);
        c.Hg(40, 11)
    };
    c.onclose = () => {
        c.HERE = false;
        c.ISHERE && ie.length && (ie = ie.filter(e => e.HERE));
        if (c.ISHERE) b(`Bot count is ${ie.length}, -1`, "", Hy(), false, true);
        yx.innerText = `Bot Count: ${ie.length}`;
        $3[c.botType] = [];
        Z3[c.botType] = [];
        hx(c.sid)
    };
    c.heal = function(e, t = [20, 40, 30]) {
        for (var n = e; n < 100; n += t[c.items[0]]) c.place(c.items[0], null)
    };
    c.reloadConfig = function(e, t, n, i, s, o) {
        if (!i) return c.updater.push({
            id: c.reloadConfig,
            data: [e, n, t, true]
        });
        o = c.findPlayer(e);
        if (c.sid == e) {
            t > 9 ? c.sr = 0 : c.pr = 0;
            c.invisTime = 1e3;
            c.skinIndex == 20 && t > 9 ? c.samRS = .78 : c.samRS = 1;
            c.skinIndex == 20 && t < 9 ? c.samRP = .78 : c.samRP = 1
        }
        t > 9 ? o.sr = 0 : o.pr = 0;
        o.skinIndex == 20 && t > 9 ? o.samRS = .78 : o.samRS = 1;
        o.skinIndex == 20 && t < 9 ? o.samRP = .78 : o.samRP = 1
    };
    c.projDetect = function(t, n, i, e, s, o, r, a) {
        if (!r) c.updater.push({
            id: c.projDetect,
            data: [t, n, i, e, s, o, true]
        });
        let l = null;
        if (s == 1.5 && o == 1) {
            if (c.skinIndex == 53 && se({
                x: t,
                y: n
            }, c) <= 2) {
                l = c
            }
        }
        if (!(s == 1.5 && o == 1)) {
            if (c?.weaponIndex == c?.secondary && c.dir === i && x.weapons[c.weaponIndex].projectile == o) {
                let e = P3(t, n, i + W, 70);
                if (S4(e, c) <= 20) l = c
            }
        }
        if (!l) return;
        if (l) {
            if (s == 1.5 && o == 1) {
                if (c.sid == l.sid) c.tr = 0;
                l.tr = 0
            } else {
                if (l.sid === c.sid) {
                    c.sr = 0;
                    c.samRS = c.skinIndex === 20 ? .78 : 1
                }
                l.sr = 0;
                l.samRS = l.skinIndex === 20 ? .78 : 1
            }
        }
    };
    c.reloadWeapon = function(e, t) {
        if (!t) {
            if (e.buildIndex == -1) {
                if (e.weaponIndex <= 8) {
                    e.pr = j(1, e.pr + 111 / (x.weapons[e.primary].speed * e.samRP))
                } else if (e.weaponIndex > 8) {
                    e.sr = j(1, e.sr + 111 / (x.weapons[e.secondary].speed * e.samRS))
                }
            }
            e.tr = j(1, e.tr + 111 / 2400)
        } else {
            if (c.buildIndex == -1) {
                if (c.weaponIndex <= 8) {
                    c.pr = j(1, c.pr + 111 / (x.weapons[c.primary].speed * c.samRP))
                } else if (c.weaponIndex > 8) {
                    c.sr = j(1, c.sr + 111 / (x.weapons[c.secondary].speed * c.samRS))
                }
            }
            c.tr = j(1, c.tr + 111 / 2400)
        }
    };
    c.doAll = function(e, t) {
        if (!t && e.length) {
            $3[c.botType] = e;
            c.sid = e[0];
            c.speed = Ne(c.x - e[1], c.y - e[2]);
            c.speed != 0 && (c.invisTime = 1e3);
            c.speed == 0 && (c.invisTime -= z.delta);
            c.xVel = e[1] - c.x;
            c.yVel = e[2] - c.y;
            c.sid = e[0];
            c.x2 = e[1];
            c.y2 = e[2];
            c.x = e[1];
            c.y = e[2];
            c.dir = e[3];
            c.dt = 0;
            c.buildIndex = e[4];
            c.weaponIndex = e[5];
            c.team = e[7];
            c.isLeader = e[8];
            c.skinIndex = e[9];
            c.tailIndex = e[10];
            c.isSkull = e[11];
            c.visb = true;
            c.enemies.length && (c.enemies = c.enemies.map(e => ({
                enemy: e,
                distance: S4(e, c)
            })).sort((e, t) => e.distance - t.distance));
            c.nEnemy = c.enemies[0];
            c.doMills = window.location.hostname != "sandbox.moomoo.io" || c.upgraded >= 7 && (c.buyer.length <= 8 || c.millCount >= 230 || ai == "Summon" || ai == "Static" || ro.checked || ao.value == "Cursor" && ai == "Summon") || c.millCount === 299 ? false : true
        }
        c.reloadWeapon(c, 1);
        c.updater.forEach(e => e.id(...e.data));
        c.updater = [];
        if (c.tick % 7 === 0 && !(G["do"] && G.play && ts?.bot?.sid === c.sid)) {}
        if (c.doMills && Date.now() - c.moveRan.lastChange >= 1e4 || D(re(c.moveRan.y - c.y, 2) + re(c.moveRan.x - c.x, 2)) > 3300 || c.speed === 0) {
            c.moveRan.angle = vx(c.moveRan.angle);
            c.moveRan.y = c.y;
            c.moveRan.x = c.x;
            c.moveRan.lastChange = Date.now()
        }
        c.autobuy();
        c.ownerDist = ao.value == "Cursor" && ai == "Summon" ? Ne(om.x2 - c.x, om.y2 - c.y) : Ne(z.x2 - c.x, z.y2 - c.y);
        if (G["do"] && ts?.bot?.sid === c.sid) {
            xi.player = c.players.find(e => e.sid === xi.ID && e.visible);
            if (xi.player) {
                xi.player.positions = a4(xi.player, 6)
            } else if (c.nEnemy) {
                xi.player = c.nEnemy.enemy;
                xi.player.positions = a4(xi.player, 6)
            }
        }
        if (G["do"] && G.play && ts?.bot?.sid === c.sid) {
            c.moveDirection = Dm
        } else if (c.doMills && window.location.hostname == "sandbox.moomoo.io" || ai === "Wander") {
            c.moveDirection = c.moveRan.angle
        } else if (ai === "Static") {
            c.moveDirection = null
        } else if (ai === "Summon") {
            if (ao.value == "Cursor") {
                c.moveDirection = B(c, om)
            } else if (ao.value == "Towards") {
                c.moveDirection = B(c, z.np.real)
            } else {
                if (c.ownerDist <= ki) {
                    if (ao.value == "Copy") {
                        c.moveDirection = Dn
                    } else c.moveDirection = null
                } else c.moveDirection = B(c, z.np.real)
            }
        }
        c.inTrap = c.builds.find(e => e.name === "pit trap" && e.owner?.sid != c.sid && !c.teamer(e.owner?.sid) && Ne(e.x - c.x, e.y - c.y) <= 50);
        ie.forEach((e, t) => {
            if (e.sid == c.sid) {
                c.botType = t;
                ie[t] = c
            }
        });
        c.doingAll = c.upgraded >= 7 || window.location.hostname != "sandbox.moomoo.io";
        if (c.alive) {
            let e;
            if (!(ai === "Summon" && ro.checked && c.doingAll) && !(Vt?.length && c.doingAll)) {
                e = C3(c, c.moveDirection);
                !e && c.emit("a", c.moveDirection)
            }!e && !c.inTrap && c.emit("D", c.moveDirection);
            if (m.z && x.list[c?.items[4]]?.name === "pit trap") {
                c.place(c.items[4], c.moveDirection);
                c.place(c.items[4], c.moveDirection + Z(180));
                c.place(c.items[4], c.moveDirection - Z(90));
                c.place(c.items[4], c.moveDirection + Z(90));
                c.emit("G", c.weaponIndex, true)
            }
            if (c.inTrap && go.checked) {
                c.autohit = true;
                let e = B(c, c.inTrap);
                c.emit("G", c.weapons[0], true);
                c.emit("D", e);
                c.emit("d", 1, e);
                c.emit("d", 0, e);
                if (c.pr === 1) {
                    c.Hg(40, 11)
                } else c.Hg(6, 11)
            } else if (e) {} else if (c.secondary && (G["do"] ? true : c.ownerDist < 900) && (m.q || xn) && c.sr === 1 && xi.player && lo.checked) {
                let e = xi.player.positions;
                let t = _g(c, e, x.weapons[c.weapons[1]].projSpd, xi.player);
                let n;
                let i = [];
                if (uo.checked && t) {
                    if (t.norm.dist > 700 || c.weapons[1] === 12) {
                        n = t.marks.dir;
                        i = [1, 11]
                    }
                    if (!i.length && t.norm.dist <= 700) {
                        n = t.norm.dir;
                        i = [53, 11]
                    }
                } else {
                    n = B(c, Y);
                    i = [53, 11]
                }
                c.Hg(i[0], i[1]);
                if (c.items[5] == 18) {
                    c.place(c.items[5], n);
                    c.place(c.items[5], n + Z(180));
                    c.place(c.items[5], n - Z(90));
                    c.place(c.items[5], n + Z(90))
                }
                c.emit("G", c.weapons[1], true);
                c.emit("d", 1, n);
                c.emit("d", 0, n);
                c.emit("D", n)
            } else if (Vt?.length && c.doingAll) {
                c.weaponIndex != c.primary && c.emit("G", c.primary, true);
                const n = Vt?.reduce((e, t) => {
                    const n = Ne(c.x - t.x, c.y - t.y);
                    if (e === null || n < e.distance) {
                        return {
                            building: t,
                            distance: n
                        }
                    } else {
                        return e
                    }
                }, null).building;
                let e = B(c, n);
                let t = n.name === "pit trap" && !c.teamer(n.owner.sid) ? 0 : x.weapons[c.weapons[0]].range;
                if (se(c, n, "object") <= t) {
                    c.emit("a", null);
                    if (c.pr === 1) {
                        c.emit("D", e);
                        c.emit("d", 1, e);
                        c.emit("d", 0, e);
                        c.Hg(40, 11)
                    }
                } else {
                    c.emit("a", e);
                    c.bh();
                    c.emit("d", 1, e);
                    c.emit("d", 0, e);
                    c.emit("D", e)
                }
            } else if (Nt && se(c, Nt, "object") <= x.weapons[c.weapons[0]].range) {
                if (c.pr === 1) {
                    c["break"](Nt)
                } else {
                    c.Hg(6, 11)
                }
            } else {
                let e = c.sr != 1 ? c.secondary : c.primary;
                (c.weaponIndex != e || c.buildIndex != -1) && c.emit("G", e, true);
                if (c.doMills) {
                    c.miller()
                }
                if (e != c.secondary && c.invisTime <= 0 && mo.checked && c.health === 100 && (c.ownerDist <= ki || ai == "Static" && !c.doMills)) {
                    c.Hg(56, 0)
                } else {
                    if (e != c.secondary && c.weaponIndex != c.secondary && ai !== "Static" && !(ai == "Summon" && c.ownerDist <= ki) || ao.value == "Cursor" && ai == "Summon" && c.weaponIndex != c.secondary) {
                        c.emit("d", 1, c.moveDirection);
                        c.emit("d", 0, c.moveDirection)
                    }
                    c.bh()
                }
            }
            if (c.skinIndex != 45 && c.alive && c.health != 100 && !c.kys) {
                if (c.health >= 64.5) {
                    setTimeout(() => {
                        c.heal(c.health)
                    }, 85)
                } else {
                    c.heal(c.health)
                }
            }
        }
        if (c.sid === lx) {
            document.getElementById(`age${c.sid}`).innerText = `Age: ${c.upgraded}`;
            document.getElementById(`windmillCount${c.sid}`).innerText = `Windmills: ${c.millCount}`;
            document.getElementById(`gold${c.sid}`).innerText = `Gold: ${c.gold}`
        }
    };
    c.onmessage = e => {
        let t = window.msgpack.decode(new Uint8Array(e.data));
        let s;
        if (t.length > 1) {
            s = [t[0], ...t[1]];
            if (s[1] instanceof Array) {
                s = s
            }
        } else {
            s = t
        }
        if (!s) return;
        if (s[0] == "O") {
            c.findPlayer(s[1]).health = s[2];
            if (s[1] == c.sid) c.health = s[2]
        }
        if (s[0] == "A") {
            c.team = s[1].teams
        }
        if (s[0] == "4") {
            c.alliancePlayers = s[1];
            c.clanMates = s[1]
        }
        if (s[0] == "0") {
            c.ping = Date.now() - c.pingTime;
            setTimeout(() => {}, 350)
        }
        if (s[0] == "K") {
            c.reloadConfig(s[1], s[2], s[3]);
            if (s[1] == c.sid) {
                c.invisTime = 1e3
            }
            if (G.val === c.botType) v2(s[1], s[2], s[3], c)
        }
        if (s[0] == "X") {
            c.projDetect(s[1], s[2], s[3], s[4], s[5], s[6]);
            if (L3(z, {
                x: s[1],
                y: s[2]
            })) return;
            Z2(s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], c)
        }
        if (s[0] == "L") {
            if (G.val == c.botType) {
                (q = c.findBuilding(s[2])) && (q.xWiggle += K.gatherWiggle * U(s[1]), q.yWiggle += K.gatherWiggle * V(s[1]))
            }
        }
        if (s[0] == "3") {
            if (s[1] == undefined && s[2] == undefined || s[1] == null && s[2] == false) c.clanMates = []
        }
        if (s[0] == "P") {
            c.health = 100;
            c.alive = false;
            c.deaths++;
            setTimeout(() => {
                c.spawn()
            }, 111)
        }
        if (s[0] == "C") {
            c.sid = s[1];
            !c.ISHERE && ie.push(c) && b(`Bot count is ${ie.length}`, "", Hy(), false, true);
            c.ISHERE = true;
            yx.innerText = `Bot Count: ${ie.length}`;
            fx(c.sid)
        }
        if (s[0] == "V") {
            if (s[1]) {
                if (s[2]) {
                    c.weapons = s[1];
                    c.primary = s[1][0];
                    c.secondary = s[1][1]
                } else c.items = s[1]
            }
        }
        if (s[0] == "S") {
            if (s[1] == 3) {
                c.millCount = s[2]
            }
        }
        if (s[0] == "I") {}
        if (s[0] === "H") {
            for (var n = 0; n < s[1].length;) {
                let e = s[1];
                C.add(e[n], e[n + 1], e[n + 2], e[n + 3], e[n + 4], e[n + 5], x.list[e[n + 6]], !0, e[n + 7] >= 0 ? {
                    sid: e[n + 7]
                } : null, c);
                n += 8
            }
        }
        if (s[0] == "D") {
            dg(s[1], s[2], c)
        }
        if (s[0] == "R") {
            c.players = c.players.filter(e => e.sid != s[1]);
            c.builds = c.builds.filter(e => e?.owner?.sid != s[1])
        }
        if (s[0] == "6") {
            let e = c.findPlayer(s[1]);
            e.chatMessage = s[2];
            e.chatCountdown = 3500
        }
        if (s[0] == "N") {
            if (s[1] == "wood") c.wood = s[2];
            if (s[1] == "food") c.food = s[2];
            if (s[1] == "stone") c.stone = s[2];
            if (s[1] == "points") c.gold = s[2]
        }
        if (s[0] == "U") {
            if (s[1] > 0) {
                if (c.upgraded == 0) {
                    c.upgrade(3)
                } else if (c.upgraded == 1) {
                    c.upgrade(17)
                } else if (c.upgraded == 2) {
                    c.upgrade(31)
                } else if (c.upgraded == 3) {
                    c.upgrade(23)
                } else if (c.upgraded == 4) {
                    c.upgrade(9)
                } else if (c.upgraded == 5) {
                    c.upgrade(34)
                } else if (c.upgraded == 6) {
                    c.upgrade(12)
                } else if (c.upgraded == 7) {
                    c.upgrade(c.getCrossBow ? 25 : 15)
                }
                c.upgraded++
            }
        }
        if (s[0] == "5") {
            if (s[3]) {
                if (!s[1]) {
                    c.tails.push(s[2])
                } else c.tailIndex = s[2]
            } else {
                if (!s[1]) {
                    c.skins.push(s[2])
                } else c.skinIndex = s[2]
            }
            if (c.buyer.length && (s[3] == 0 || s[3] == 1)) {
                for (let e = 0; e < c.buyer.length; e++) {
                    if (s[3] == 0 && !Array.isArray(c.buyer[e]) && c.buyer[e] == s[2]) {
                        c.buyer.splice(e, 1)
                    }
                    if (s[3] == 1 && Array.isArray(c.buyer[e]) && c.buyer[e][0] == s[2]) {
                        c.buyer.splice(e, 1)
                    }
                }
            }
        }
        if (s[0] == "Q") {
            c.builds = c.builds.filter(e => e.sid != s[1])
        }
        if (s[0] == "a") {
            c.tick++;
            c.time = Date.now();
            c.players.forEach(e => {
                e.forcePos = false, e.visible = !1
            });
            let i = [];
            xx = null;
            for (let n = 0; n < s[1].length / 13; n++) {
                let e = s[1].slice(13 * n, 13 * n + 13);
                c.enemies = [];
                let t = c.findPlayer(e[0]);
                t.t1 = void 0 === t.t2 ? Date.now() : t.t2;
                t.t2 = Date.now();
                if (t != null) {
                    if (G["do"] && c.botType != G.val || !G["do"]) {
                        t.x = e[1];
                        t.y = e[2]
                    }
                    t.x1 = t.x;
                    t.y1 = t.y;
                    t.speed = Ne(t.x2 - e[1], t.y2 - e[2]);
                    t.xVel = e[1] - t.x2;
                    t.yVel = e[2] - t.y2;
                    t.x2 = e[1];
                    t.y2 = e[2];
                    t.d1 = void 0 === t.d2 ? e[3] : t.d2;
                    t.d2 = e[3];
                    t.dt = 0;
                    t.buildIndex = e[4];
                    t.weaponIndex = e[5];
                    t.weaponIndex >= 9 ? t.secondary = t.weaponIndex : t.primary = t.weaponIndex;
                    t.weaponVariant = e[6];
                    t.team = e[7];
                    t.isLeader = e[8];
                    t.skinIndex = e[9];
                    t.tailIndex = e[10];
                    t.isSkull = e[11];
                    t.visible = true;
                    !Ei.includes(t.sid) && !c.teamer(t.sid) && c.enemies.push(t);
                    if (!(e[0] == c.sid || e[7] && e[7] == c.clan)) {
                        Z3[c.botType] = e
                    }
                }
                if (e[0] === c.sid) {
                    i = e
                }
                c.reloadWeapon(t)
            }
            c.doAll(i, c.skinIndex == 56 && !i ? true : false);
            if (c.autohit) {
                if (c.hitPacket % 2 == 0 && c.alive) {}
            } else {
                if (c.hitPacket % 2 == 1) {}
            }
            if (G["do"] && ts?.bot?.sid === c.sid) {}
            if (z.team && c.team != z.team) {
                if (c.team && c.team != z.team) {
                    c.emit("Q", undefined)
                } else {
                    if (c.team != z.team) {
                        c.emit("b", z.team);
                        ip(c.sid)
                    }
                }
            }
        }
    }
};

function vx(e, t) {
    t = Math.random() * ae;
    if (e && Ay(e, t) <= 2) {
        return vx(e)
    }
    return t
}

function kx(t) {
    if (Y3.length && (Ht == false && jt) && t.name != "pit trap") {
        for (let e = 0; e < Y3.length; e += 2) {
            if (se({
                x: Y3[e],
                y: Y3[e + 1]
            }, t) <= t.scale - 7.5) {
                return true
            }
        }
    }
    return false
}

function Ax(e, i, s) {
    if (Y3 && Y3.length && (m.z || Ht == false && jt)) {
        let t = 0,
            n = 0;
        if (jt && Y3.length * 7 >= i) return;
        while (n < Y3.length) {
            const o = Y3[n];
            const r = Y3[n + 1];
            const a = D((z.x2 - o) ** 2 + (z.y2 - r) ** 2);
            let e = s ? 10 : 35;
            if (a <= e) {
                t += 2
            } else {
                if (!jt) break
            }
            if (jt && a > i) {
                return false
            }
            n += 2
        }
        if (t + 2 < Y3.length) {
            const l = {
                x: Y3[t],
                y: Y3[t + 1]
            };
            T.send("a", B(z, l), "pathfinder");
            Y3.splice(0, t)
        }
    }
    return true
}

function Ix(e) {
    e = H(Math.random() * z.items.length - 1);
    if (e == 0) return Ix();
    return e
}

function Sx(t, n, i = []) {
    for (let e = 0; e < t.length; e += 13) {
        i.push(t[e]);
        for (let e = 0; e < n.length; e += 13) {
            if (i.includes(n[e])) n.splice(e, 13)
        }
    }
    return t.concat(n)
}
$n = x.list;

function Ex(e, t, l, c, n, d = [], u = [], i, f = x.weapons[ee].range, h = x.projectiles[1].range + 35) {
    const s = {
        buildIndex: -1,
        weaponIndex: 0,
        skinIndex: [e, 53, 7][c] || 0,
        tailIndex: 0,
        y: z.y2,
        zIndex: null,
        sid: z.sid
    };
    c == 2 ? i = 2 : i = 3;
    Array.from({
        length: i
    }, (e, t) => {
        d[t] = {
            ...s,
            ...c === 0 || c === 1 ? {
                weaponIndex: [A, ee, ee][t],
                buildIndex: t === 2 ? 3 : -1
            } : {},
            ...c === 2 ? {
                tailIndex: t === 0 ? 19 : 0,
                weaponIndex: ee
            } : {}
        }
    });
    const o = (n, e, i, s, o, r, t = []) => {
        !s && (s = z);
        for (let t = 0; t < l.length; t++) {
            const a = l4(s, 111, l[t], {
                ...d[n]
            });
            console.log(c, s, l[t], {
                ...d[n]
            });
            o = i ? a.decel : a.accel;
            const e = c === 2 ? se(o, Y.np.real, "player") : se(o, Y.np.real);
            console.log(l[t]);
            r = {
                pos: a,
                move: i ? undefined : l[t],
                ...d[n],
                distance: e,
                x2: o.x,
                y2: o.y,
                sid: z.sid,
                xVel: a.xVel,
                yVel: a.yVel,
                type: i ? "decel" : "accel"
            };
            r.t1 = c == 0 ? r : s.t1 ? s.t1 : 0;
            r.t2 = c == 1 ? r : s.t2 ? s.t2 : 0;
            if (c == 2) r.t3 = r;
            (!c || c === 1) && e >= h && u.push(r);
            c === 2 && e <= f && u.push(r)
        }
    };
    e: for (const a of Kt) {
        if (a == 11 && c === 2) continue e;
        for (let t = 0; t < i; t++) {
            d[t].tailIndex = a;
            n ? n.forEach(e => o(t, a, false, e)) : o(t, a)
        }
    }
    console.log(u);
    console.log("move", u.move);
    if (!c) return u;
    if (c === 1) return Mx(7, f, l, 2, u);
    let r = h + f;
    u.length ? u = u.reduce((e, t) => {
        const n = t.t2.distance + t.t3.distance;
        const i = e.t2.distance + e.t3.distance;
        const s = Math.abs(i - r);
        const o = Math.abs(n - r);
        if (o < s) {
            return t
        } else {
            return e
        }
    }) : u = null;
    return u
}

function Tx(e, t, n = 53) {
    return {
        buildIndex: t,
        weaponIndex: e,
        skinIndex: n,
        tailIndex: 0,
        y: z.y2,
        zIndex: null
    }
}

function Cx(e, t, n, i) {
    const s = {
        ...i,
        tailIndex: n
    };
    e = JSON.parse(JSON.stringify(e));
    console.log(e);
    const o = l4(e, 111, t, s);
    return {
        ...s,
        x2: o.accel.x,
        y2: o.accel.y,
        dist: se(o.accel, e),
        xVel: e.xVel,
        yVel: e.yVel,
        sid: z.sid
    }
}

function Bx(e, t, n, i = [], s = [], o) {
    i[0] = Tx(ee, -1, e);
    i[1] = Tx(A, -1, e);
    i[2] = Tx(z.primary, 3, e);
    o = Y.np.real;
    for (let e = 0; e < 3; e++) {
        s[e] = {
            pos: l4(z, 111, B(z, Y), i[e]),
            move: n,
            loadout: i[e]
        };
        s[e].dist = se(s[e].pos.accel, o);
        s[e].x2 = s[e].pos.accel.x;
        s[e].y2 = s[e].pos.accel.y
    }
    if (Kt.includes(11)) {
        for (let e = 0; e < 3; e++) {
            i[e].tailIndex = 11;
            s[e + 3] = {
                pos: l4(z, 111, B(z, Y), i[e]),
                move: n,
                loadout: i[e]
            };
            s[e + 3].dist = se(s[e + 3].pos.accel, o);
            s[e + 3].x2 = s[e + 3].pos.accel.x;
            s[e + 3].y2 = s[e + 3].pos.accel.y
        }
    }
    if (Kt.includes(19)) {
        for (let e = 0; e < 3; e++) {
            i[e].tailIndex = 19;
            s[e + 6] = {
                pos: l4(z, 111, B(z, Y), i[e]),
                move: n,
                loadout: i[e]
            };
            s[e + 6].dist = se(s[e + 6].pos.accel, o);
            s[e + 6].x2 = s[e + 6].pos.accel.x;
            s[e + 6].y2 = s[e + 6].pos.accel.y
        }
    }
    s = s.filter(e => e.dist >= t);
    console.log(`Loadouts ${s}`);
    return s
}

function Dx(e, t, n = [], i = []) {
    for (let e = 0; e < 3; e++) {
        i[e] = Tx(e === 0 ? A : ee, e === 2 ? 3 : -1)
    }
    const s = {
        pos: z,
        move: undefined
    };
    console.log(i);
    s.dist = se(s.pos, i);
    s.x2 = s.pos.x;
    s.y2 = s.pos.y;
    e.push(s);
    for (const t of e) {
        for (let e = 0; e < 3; e++) {
            n.push(Cx(t.pos, t.move, 0, i[e]));
            n.push(Cx(t.pos, t.move, 11, i[e]))
        }
        if (Kt.includes(19)) {
            for (let e = 0; e < 3; e++) {
                n.push(Cx(t.pos, t.move, 19, i[e]))
            }
        }
    }
    return n
}

function Px(e, t, n = [], i = []) {
    for (let e = 0; e < 2; e++) {
        i[e] = Tx(ee, -1, 53);
        i[e].tailIndex = e === 0 ? 19 : 0
    }
    const s = {
        pos: z,
        move: undefined
    };
    s.dist = se(s.pos, i);
    s.x2 = s.pos.x;
    s.y2 = s.pos.y;
    e.push(s);
    console.log(s);
    for (const t of e) {
        for (let e = 0; e < 3; e++) {
            n.push(Cx(t.pos, t.move, 0, i[e]));
            n.push(Cx(t.pos, t.move, 11, i[e]))
        }
        if (Kt.includes(19)) {
            for (let e = 0; e < 3; e++) {
                n.push(Cx(t.pos, t.move, 19, i[e]))
            }
        }
    }
    return n
}

function Rx(e, t, n) {
    let i = [];
    let s = Bx(e, t, n);
    console.log(s);
    s = Dx(s, null, i);
    s = Px(s, null, i);
    return s
}

function Mx(e, t, n, l, i, c = []) {
    const s = {
        buildIndex: -1,
        weaponIndex: 0,
        skinIndex: [e, 53, 7][l] || 0,
        tailIndex: 0,
        y: z.y2,
        zIndex: null,
        sid: z.sid
    };
    const o = l === 2 ? 2 : 3;
    const d = Array.from({
        length: o
    }, (e, t) => ({
        ...s,
        ...l === 0 || l === 1 ? {
            weaponIndex: [A, ee, ee][t],
            buildIndex: t === 2 ? 3 : -1
        } : {},
        ...l === 2 ? {
            tailIndex: t === 0 ? 19 : 0,
            weaponIndex: ee
        } : {}
    }));
    const r = (i, e, s, t) => {
        console.log(t);
        const o = !t ? z : {
            t1: t.t1 || 0,
            t2: t.t2 || 0,
            t3: l === 2 ? t : 0
        };
        console.log(o, o);
        for (const r of n) {
            const a = l4(z, r, {
                ...d[i]
            });
            let e = s ? a.decel : a.accel;
            (!l || l === 1) && console.log(se(e, Y.np.real));
            const t = l === 2 ? se(e, Y.np.real, "player") : se(e, Y.np.real);
            let n = {
                pos: a,
                move: s ? undefined : r,
                ...d[i],
                distance: t,
                x2: a.x,
                y2: a.y,
                sid: z.sid,
                xVel: a.xVel,
                yVel: a.yVel,
                type: s ? "decel" : "accel",
                ...o
            };
            console.log(`distance: ${t}`);
            (!l || l === 1) && t >= x.projectiles[1].speed * 111 + 35 && c.push(n);
            l === 2 && t <= x.weapons[ee].range && c.push(n)
        }
    };
    for (const u of Kt) {
        if (u == 11 && l === 2) continue;
        for (let t = 0; t < o; t++) {
            d[t].tailIndex = u;
            i ? i.forEach(e => r(t, u, false, e)) : r(t, u)
        }
    }
    if (!l) return c;
    if (l === 1) return Mx(7, x.weapons[ee].range, n, 2, c);
    const a = x.projectiles[1].speed * 111 + 35 + x.weapons[ee].range;
    c.length && (c = c.reduce((e, t) => {
        const n = t.t2.distance + t.t3.distance;
        const i = e.t2.distance + e.t3.distance;
        const s = Math.abs(i - a);
        const o = Math.abs(n - a);
        return o < s ? t : e
    }));
    return c || null
}
async function Nx(t, e, n, i, s, o, r) {
    if (!Y || ee != 5 || p || !fn) {
        hn = false;
        return
    }
    t = x.projectiles[1].speed * 111 + 35;
    e = se(z, Y);
    n = [B(z, Y), B(Y, z), undefined];
    s = Gt.map(e => Mx(e, t, n, 0));
    console.log(s);
    o = Mx(53, t, n, 1, s);
    hn = true;
    if (o.move && z.tr === 1 && z.pr === 1) {
        fn = false;
        console.log(o);
        r = o.t1;
        I(r.skinIndex, r.tailIndex);
        T.send("G", r.weaponIndex, true);
        T.send("a", r.move, "pathfinder");
        await A4();
        r = o.t2;
        ct = true;
        g[0] = B(z, Y);
        y = ee;
        U1.showText(z.x2, z.y2, 50, .3, 1e3, se(o.t2, z), "#fff");
        T.send("G", r.weaponIndex, true);
        I(53, r.tailIndex);
        T.send("a", r.move, "pathfinder");
        await A4();
        r = o;
        hn = false;
        p = true;
        ct = true;
        y = ee;
        U1.showText(z.x2, z.y2, 50, .3, 1e3, se(o.t2, z), "#fff");
        T.send("G", r.weaponIndex, true);
        g[0] = B(z, Y);
        T.send("D", B(z, Y));
        T.send("a", r.move, "pathfinder");
        I(7, r.tailIndex);
        await A4();
        p = false;
        y = null;
        T.send("a", null);
        U1.showText(z.x2, z.y2, 50, .3, 1e3, se(o, z), "#fff")
    } else if (e < t) {
        Dn != n[1] && T.send("a", n[1], "pathfinder")
    } else if (e > t) {
        Dn != n[0] && T.send("a", n[0], "pathfinder")
    }
}

function Ox(e, t, l, c, n, d = []) {
    const i = {
        buildIndex: -1,
        weaponIndex: 0,
        skinIndex: [e, 53, 7][c] || 0,
        tailIndex: 0,
        y: z.y2,
        zIndex: null,
        sid: z.sid
    };
    const s = c === 2 ? 2 : 3;
    const u = Array.from({
        length: s
    }, (e, t) => ({
        ...i,
        ...c === 0 || c === 1 ? {
            weaponIndex: [A, ee, ee][t],
            buildIndex: t === 2 ? 3 : -1
        } : {},
        ...c === 2 ? {
            tailIndex: t === 0 ? 19 : 0,
            weaponIndex: ee
        } : {}
    }));
    const o = (n, e, i, s, o, r, t = []) => {
        !s && (s = z);
        for (let t = 0; t < l.length; t++) {
            const a = l4(s, 111, l[t], {
                ...u[n]
            });
            console.log(c, s, l[t], {
                ...u[n]
            });
            o = i ? a.decel : a.accel;
            const e = c === 2 ? se(o, Y.np.real, "player") : se(o, Y.np.real);
            console.log("dist", e);
            console.log("type", c);
            r = {
                pos: a,
                move: i ? undefined : l[t],
                ...u[n],
                distance: e,
                x2: o.x,
                y2: o.y,
                sid: z.sid,
                xVel: a.xVel,
                yVel: a.yVel,
                type: i ? "decel" : "accel"
            };
            r.tick1 = c == 0 ? r : s.tick1 ? s.tick1 : 0;
            r.tick2 = c == 1 ? r : s.tick2 ? s.tick2 : 0;
            if (c == 2) r.tick3 = r;
            (!c || c === 1) && e >= x.projectiles[1].range + 35 && d.push(r);
            c === 2 && e <= x.projectiles[1].range + 35 && d.push(r)
        }
    };
    for (const a of Kt) {
        if (a == 11 && c === 2) continue;
        for (let t = 0; t < s; t++) {
            u[t].tailIndex = a;
            n ? n.forEach(e => o(t, a, false, e)) : o(t, a)
        }
    }
    if (!c) return d;
    if (c === 1) return Mx(7, x.weapons[ee].range, l, 2, d);
    const r = x.projectiles[1].range + x.weapons[ee].range;
    d.length && (d = d.reduce((e, t) => {
        const n = t.t2.distance + t.t3.distance;
        const i = e.t2.distance + e.t3.distance;
        const s = Math.abs(i - r);
        const o = Math.abs(n - r);
        return o < s ? t : e
    }));
    return d || null
}

function Lx(e, t, l, c, n, d = []) {
    const i = {
        buildIndex: -1,
        weaponIndex: 0,
        skinIndex: [e, 53, 7][c] || 0,
        tailIndex: 0,
        y: z.y2,
        zIndex: null,
        sid: z.sid
    };
    const s = c === 2 ? 2 : 3;
    const u = Array.from({
        length: s
    }, (e, t) => ({
        ...i,
        ...c === 0 || c === 1 ? {
            weaponIndex: [A, ee, ee][t],
            buildIndex: t === 2 ? 3 : -1
        } : {},
        ...c === 2 ? {
            tailIndex: t === 0 ? 19 : 0,
            weaponIndex: ee
        } : {}
    }));
    const o = (t, e, n, i) => {
        for (const s of l) {
            const o = l4(z, 111, s, {
                ...u[t]
            });
            const r = n ? o.decel : o.accel;
            const e = c === 2 ? se(r, Y.np.real, "player") : se(r, Y.np.real);
            console.log("next", o, "dist", e, "dir", s);
            console.log(n ? "decel" : "accel");
            const a = {
                pos: o,
                move: n ? undefined : s,
                ...u[t],
                distance: e,
                x2: r.x,
                y2: r.y,
                sid: z.sid,
                xVel: o.xVel,
                yVel: o.yVel,
                type: n ? "decel" : "accel"
            };
            a.tick1 = c == 0 ? a : z.tick1 ? z.tick1 : 0;
            a.tick2 = c == 1 ? a : z.tick2 ? z.tick2 : 0;
            if (c == 2) a.tick3 = a;
            (!c || c === 1) && e >= x.projectiles[1].range + 35 && d.push(a);
            c === 2 && e <= x.weapons[ee].range && d.push(a);
            console.log("v", d)
        }
    };
    for (const a of Kt) {
        if (a == 11 && c === 2) continue;
        for (let t = 0; t < s; t++) {
            u[t].tailIndex = a;
            n ? n.forEach(e => o(t, a, false, e)) : o(t, a)
        }
    }
    if (!c) return d;
    if (c === 1) return Mx(7, x.weapons[ee].range, l, 2, d);
    const r = x.projectiles[1].range + x.weapons[ee].range;
    d.length && (d = d.reduce((e, t) => {
        const n = t.tick2.distance + t.tick3.distance;
        const i = e.tick2.distance + e.tick3.distance;
        const s = S(i - r);
        const o = S(n - r);
        return o < s ? t : e
    }));
    return d || null
}

function Fx(i = [], s = 0, e, t) {
    if (!Y) return;
    const o = {
        buildIndex: -1,
        weaponIndex: z.weaponIndex,
        skinIndex: z.skinIndex,
        tailIndex: z.tailIndex,
        y: z.y2,
        zIndex: null,
        sid: z.sid
    };
    const r = a4(Y, 3, Y.movDir);
    const a = s === 0 ? Gt.concat([19], [0]) : s === 1 ? [53] : [7];
    const l = [B(z, Y), B(Y, z), B(z, r[2].real), B(r[2].real, z), undefined];
    const c = [ee, A, [ay]];
    let d;
    const u = function(e, t, n) {
        console.log(e, t, n);
        e.tick = v + s;
        e.skinIndex = n.skinIndex;
        e.tailIndex = n.tailIndex;
        e.weaponIndex = n.weaponIndex;
        e.buildIndex = n.buildIndex;
        e.xVel = e.xVel;
        e.yVel = e.yVel;
        e.x2 = e.real.x;
        e.y2 = e.real.y;
        e.moveAngle = t;
        e.distance = s === 2 ? se(e, r[2], "player") : se(e, r[s]);
        console.log(s, se(e, r[2], "player"), se(e, r[s]))
    };
    for (let n = 0; n < a.length; n++) {
        for (let t = 0; t < l.length; t++) {
            for (let e = 0; e < c.length; e++) {
                const f = {
                    ...o
                };
                if (!Array.isArray(a[n])) {
                    f.skinIndex = a[n];
                    f.weaponIndex = s === 2 ? ee : c[e];
                    f.buildIndex = !Array.isArray(c[e]) || s === 2 ? -1 : ay;
                    d = l4(z, l[t], f)
                } else {
                    f.tailIndex = a[n][0];
                    f.weaponIndex = !Array.isArray(c[e]) ? c[e] : z.weaponIndex;
                    f.buildIndex = Array.isArray(c[e]) ? ay : -1;
                    d = l4(z, l[t], f)
                }
                if (s === 1 && se(d.real, r[1].real) > x.projectiles[1] * 111 - 35 || s === 2 && se(d.real, r[2].real, "player") <= x.weapons[ee].range || s === 0) {
                    i.push(d);
                    u(d, l[t], f)
                }
            }
        }
    }
}

function _x(e, t, n = 0, i = 4, o = {
    hat: null,
    tail: null,
    weapon: null
}, s = []) {
    const r = {
        buildIndex: -1,
        weaponIndex: null,
        skinIndex: null,
        tailIndex: null,
        y: z.y2,
        zIndex: null,
        sid: z.sid
    };
    const a = Gt.concat([19], [0]);
    if (n < i) {
        const d = a4(t, n, t.movDir);
        const u = [B(z, t), B(Y, z), B(z, d[n - 1].real), B(d[n - 1].real, z), undefined];

        function l(e, t, n, i, s = 111) {
            a.forEach(n => {
                u.forEach(e => {
                    const t = {
                        ...o,
                        skinIndex: n,
                        tailIndex: n
                    }
                    })
            })
        }
        if (n === i) {
            console.log("Final positions:", s)
        }


        function c(e, t, n, i, s, o, r) {
            let a = {
                ...e
            };
            e.x2 = i;
            e.y2 = s;
            e.xVel = o;
            e.yVel = r;
            e.skinIndex = t;
            e.tailIndex = n;
            return e
        }
    }
}

function Vx(e, t, n, i, s) {
    i = Ux(e, t, n);
    i && (s = true);
    i = Ux(e, t + Z(15), n);
    i && (s = true);
    i = Ux(e, t - Z(15), n);
    i && (s = true);
    i = Ux(e, t + Z(30), n);
    i && (s = true);
    i = Ux(e, t - Z(30), n);
    i && (s = true);
    i = Ux(e, t + Z(45), n);
    i && (s = true);
    i = Ux(e, t - Z(45), n);
    i && (s = true);
    if (s) return true;
    return false
}

function Ux(e, t, n, i) {
    i = 35 + e.scale + (e.placeOffset || 0);
    let s = Y.x2 - (z.x2 + U(t) * i),
        o = Y.y2 - (z.y2 + V(t) * i),
        r = 35 + e.scale,
        a = C.checkItemLocation3(z.x2 + U(t) * i, z.y2 + V(t) * i, e.scale, .6, e.id, false);
    if (n && a) {
        if ((S(s) <= r || S(o) <= r) && se(Y, z) <= 35 + n.scale) {
            c4(e.id, t);
            return true
        }
    }
    return false
}

function jx(t, n, i, s) {
    if (!Y || z.pr != 1 || p || !ko.checked || hn) return;
    if (ee == 3 || ee == 4 || ee == 5) {
        for (let e = kn.length - 1; e >= 0; e--) {
            t = kn[e];
            if (!L3(z, t)) {
                kn.splice(e, 1);
                continue
            }
            n = C.checkItemLocation2(t.x, t.y, x.list[ly].scale, .6, t.id, false);
            if (!n) {
                kn.splice(e, 1);
                continue
            }
            console.log(t);
            if (n && !p && se(z, t) <= 126 && se(Y, t) <= t.scale + 35 && se(z, Y, "player") <= x.weapons[ee].range) {
                i = Wx(x.list[ly], B(z, t), t);
                console.log("n", i);
                if (!i) {
                    kn.splice(e, 1);
                    continue
                }
                kn.splice(e, 1);
                b(`Spike tick on ${Y.name}[${Y.sid}]`, "", "#5c0620", false, true);
                c4(z.items[2], B(z, t));
                p = true;
                s = B(z, Y);
                g[0] = s;
                T.send("D", s, "client");
                ct = true;
                I(7, 18);
                y = ee;
                T.send("G", ee, true);
                setTimeout(() => {
                    p = false;
                    ct = false;
                    y = null
                }, 1)
            }
        }
        kn = []
    }
}

function Hx(e, t, n, i, s) {
    s = 35 + e.scale + (e.placeOffset || 0);
    let o = Y.x2 - (z.x2 + U(t) * s),
        r = Y.y2 - (z.y2 + V(t) * s),
        a = 35 + e.scale,
        l = C.checkItemLocation4(z.x2 + U(t) * s, z.y2 + V(t) * s, e.scale, .6, n.id, false, n);
    if (n && l) {
        if ((S(o) <= a || S(r) <= a) && se(Y, n) <= n.scale + 35) {
            return true
        }
    }
    return false
}

function Wx(e, t, n, i, s) {
    i = Hx(e, t, n);
    i && (s = true);
    i = Hx(e, t + Z(15), n);
    i && (s = true);
    i = Hx(e, t - Z(15), n);
    i && (s = true);
    i = Hx(e, t + Z(30), n);
    i && (s = true);
    i = Hx(e, t - Z(30), n);
    i && (s = true);
    if (s) return true;
    return false
}
async function Qx(t, n, i, s, o) {
    if (!fo.checked || !Y || A != 10 || !Y?.inTrap || gt || p || hn || jt || z.sr != 1 || z.pr != 1) return;
    if (ee == 3 || ee == 4 || ee == 5) {
        let e;
        n = Y.inTrap;
        t = B(z, n);
        i = 75 * En[z.secondaryVar] * (Nn.includes(40) ? 3.3 : 1) >= n.health;
        s = x.weapons;
        o = [se(z, n, "object"), se(z, Y, "player")];
        if (o[0] <= s[A].range && o[1] <= s[ee].range && Wx(x.list[ly], t, n) && o4(z, Y) && i && (ee == 5 && z?.primaryVar == 1 || ee == 4 && z?.primaryVar > 1 ? Y.weaponR == 1 && Y.weaponIndex <= 10 : true) && z.tailIndex != 11) {
            gt = true;
            if (z?.dmgpot?.soldier && Y.pr == 1 && z?.dmgpot?.shouldHeal && [4, 5].includes(Y?.primary)) {
                b(`Cancelled TA due to spike sync threat`, "", "#5c0620", false, true);
                I(6, 0)
            } else {
                I(40, 0)
            }
            g[0] = t;
            T.send("D", t);
            ct = true;
            y = A;
            z.hitting = true;
            T.send("G", A, true);
            Mt = true;
            b(`TA on ${Y.name}[${Y.sid}]`, "", "#5c0620", false, true);
            await A4();
            b(`${Y.health}`, "", "#5c0620", false, true);
            gt = false;
            p = true;
            y = ee;
            if (z?.dmgpot?.soldier && Y.pr == 1 && z?.dmgpot?.shouldHeal && [4, 5].includes(Y?.primary)) {
                b(`Cancelled TA due to spike sync threat`, "", "#5c0620", false, true);
                I(6)
            } else {
                I(7)
            }
            T.send("G", ee, true);
            t = B(z, n);
            z.hitting = true;
            g[0] = t;
            T.send("D", B(z, Y));
            c4(ly, t + Z(15), ee);
            c4(ly, t - Z(15), ee);
            c4(ly, B(z, Y), ee);
            T.send("D", B(z, Y));
            T.send("G", ee, true);
            await A4();
            ct = false;
            y = null;
            Mt = false;
            g[0] = null;
            p = false
        }
    }
}
async function Yx(e, t, n, i, s, o) {
    if (ee != 5 || z.primaryVar < 2 || !fo.checked || !Y || A != 10 || !Y?.inTrap || gt || p || hn || jt || z.sr != 1 || z.pr != 1) return;
    let r;
    t = Y.inTrap;
    e = B(z, t);
    n = 75 * En[z.secondaryVar] * (Nn.includes(40) ? 3.3 : 1) >= t.health;
    i = 75 * En[z.secondaryVar] * (Nn.includes(40) ? 3.3 : 1) + (Y.secondary == 10 ? 75 : x.weapons[Y.primary].dmg) * En[z.secondary == 10 ? Y.secondaryVar : Y.primaryVar] * 3.3 >= t.health;
    s = x.weapons;
    o = [se(z, t, "object"), se(z, Y, "player")];
    if (o[0] <= s[A].range && o[1] <= s[ee].range && Wx(x.list[ly], e, t) && o4(z, Y) && z.tailIndex != 11) {
        if (n) {
            gt = true;
            I(40, 0);
            g[0] = e;
            T.send("D", e, "client");
            ct = true;
            y = A;
            z.hitting = true;
            T.send("G", A, true);
            Mt = true;
            b(`PA on ${Y.name}[${Y.sid}]`, "", "#5c0620", false, true);
            Bg(e, A, z.secondaryVar, 40, 1);
            await A4();
            p = true;
            y = ee;
            I(7, 18);
            T.send("G", ee, true);
            e = B(z, t);
            z.hitting = true;
            g[0] = e;
            T.send("D", B(z, Y), "client");
            c4(ly, e + Z(15), ee);
            c4(ly, e - Z(15), ee);
            c4(ly, B(z, Y), ee);
            c4(ly, e, ee);
            T.send("D", B(z, Y), "client");
            T.send("G", ee, true);
            await A4();
            ct = false;
            gt = false;
            y = null;
            Mt = false;
            g[0] = null;
            p = false
        }
    }
}

function zx() {
    if (!Y || !z.pr || !z.sr || !(z.primaryVar === 3 || z.secondaryVar === 3) || A != 10 || ee != 5) return
}

function Gx() {
    if (z && en && ii) {
        return oe(o5(z, Y, 1, 1.5, B(z, Y)), o5(ii, Y, 1, 1.5, B(ii, Y)))
    }
}

function Kx() {
    if (Sn.length > 0 && en && Y) {
        return oe(...Sn.map(e => o5(e, Y, 1, 1.5, B(e, Y))))
    }
}
let Xx = [];
let Jx = [];
let qx = null;

function $x(e) {
    Xx = e;
    if (gy("music")?.checked) {
        if (qx !== null) {
            qx.pause()
        }
        if (Jx.length === Xx.length) {
            Jx = []
        }
        let e;
        do {
            e = f(Math.random() * Xx.length)
        } while (Jx.includes(e));
        const t = Xx[e];
        qx = new Audio;
        qx.src = t;
        qx.preload = "auto";
        qx.play();
        qx.addEventListener("ended", Zx)
    } else {
        if (qx !== null) {
            qx.pause()
        }
    }
}

function Zx() {
    if (qx !== null) {
        qx.removeEventListener("ended", Zx);
        Jx.push(Xx.indexOf(qx.src));
        qx = null
    }
}

function e5() {
    if (qx === null) {
        $x(Xx)
    }
}
const t5 = ["https://example.com/song1.mp3", "https://example.com/song2.mp3", "https://example.com/song3.mp3"];

function n5(e, t) {
    if (z.sr !== 1 || z.tr !== 1 || !Y || !ii || se(z, Y) > 700 || se(ii, Y) > 700 || ii.sr !== 1 || ii.tr !== 1) return;
    if (z && en && Y && ii) {
        var n;
        var i = o5(z, Y, 1, 1.5, B(z, Y));
        var s = Gx();
        var o;
        if (x.list[hy].name == "platform") c4(hy, B(z, Y));
        if (A == 15 && o5(z, Y, 1, 1.5, B(z, Y)) == o5(z, Y, 5, 3.6, B(z, Y))) {
            o = o5(z, Y, 5, 3.6, B(z, Y))
        } else if (A == 15 && o5(z, Y, 1, 1.5, B(z, Y)) !== o5(z, Y, 5, 3.6, B(z, Y))) {
            o = o5(z, Y, 5, 4.68, B(z, Y))
        }
        if (A == 9) {
            o = o5(z, Y, 0, 1.6, B(z, Y))
        }
        if (A == 13) {
            o = o5(z, Y, 3, 2, B(z, Y))
        }
        if (A == 12) {
            o = o5(z, Y, 2, 2.5, B(z, Y))
        }
        e = s * 111 - o * 111;
        t = s * 111 - i * 111
    }
    setTimeout(() => {
        p = true;
        g[0] = B(z, Y);
        ct = true;
        T.send("D", B(z, Y), "client");
        I(53, 0)
    }, t);
    setTimeout(() => {
        if (o5(z, Y, 1, 1.5, B(z, Y)) !== o5(z, Y, 5, 3.6, B(z, Y))) {
            I(1, 0)
        }
        p = true;
        g[0] = B(z, Y);
        ct = true;
        T.send("D", B(z, Y), "client");
        T.send("G", A, true);
        y = A
    }, e);
    setTimeout(() => {
        p = false
    }, 666)
}
async function i5(e) {
    if (!m.R || z.sr !== 1 || z.tr !== 1 || !Y) return;
    if (z && en && Y) {
        var t;
        var n = o5(z, Y, 1, 1.5, B(z, Y));
        var i;
        if (A == 15 && o5(z, Y, 1, 1.5, B(z, Y)) == o5(z, Y, 5, 3.6, B(z, Y))) {
            i = o5(z, Y, 5, 3.6, B(z, Y))
        } else if (A == 15 && o5(z, Y, 1, 1.5, B(z, Y)) !== o5(z, Y, 5, 3.6, B(z, Y))) {
            i = o5(z, Y, 5, 4.68, B(z, Y))
        }
        if (A == 9) {
            i = o5(z, Y, 0, 1.6, B(z, Y))
        }
        if (A == 13) {
            i = o5(z, Y, 3, 2, B(z, Y))
        }
        if (A == 12) {
            i = o5(z, Y, 2, 2.5, B(z, Y))
        }
        e = n * 111 - i * 111;
        console.log(e)
    }
    p = true;
    g[0] = B(z, Y);
    ct = true;
    T.send("D", B(z, Y));
    I(53, 0);
    await s5(e);
    if (o5(z, Y, 1, 1.5, B(z, Y)) !== o5(z, Y, 5, 3.6, B(z, Y))) {
        I(1, 0)
    }
    p = true;
    g[0] = B(z, Y);
    ct = true;
    T.send("D", B(z, Y));
    T.send("G", A, true);
    y = A;
    await s5(222);
    p = false
}

function s5(t) {
    return new Promise(e => setTimeout(e, t))
}

function o5(e, t, n, i, s) {
    var o = i * U(s);
    var r = i * V(s);
    var a = se(e, t);
    var l;
    if (n !== 1) {
        l = oe((a - 105) / D(o * o + r * r), 0)
    } else {
        l = oe((a - 35) / D(o * o + r * r), 0)
    }
    var c;
    c = f(l / 111);
    return c
}

function r5(e, t, n, i, s) {
    var o = i * U(s);
    var r = i * V(s);
    var a = se(z, t);
    var l = (a - 35) / (i * 111);
    l = l < 1 ? 0 : c(l);
    return l
}

function a5(e, t, n) {
    n = P3(z.x2, z.y2, B(z, Y), e == 1 ? 0 : 70);
    return (se(n, Y) - 35) / t
}
async function l5(e, t, n, i, s, o) {
    let r;
    o = Hg(e);
    if (o.health <= 0 && o.vis2 && !o.visible && !o.didDeath) g3(o, 55, .28, 48, 13, .00215, 0), o.deaths++, o.didDeath = true;
    if (!z.healths) z.healths = [];
    if (o.sid == z.sid) {
        if (z.healths.length >= 8) z.healths.pop();
        if (o.sid == z.sid) z.healths.push({
            hp: o.health,
            tick: v
        })
    }
    if (t == -5 * (o.skinIndex == 6 ? .75 : 1) && o.poison) {
        o.lastBull = v - 1
    }
    if (o.health <= 0) o.Alive = false, o.Alive2 = false;
    if (t < 0) {
        if (o.sid != z.sid && o.dmgs == "XD") {
            o.dmgs = 0
        }
        if (o.sid != z.sid) {
            o.dmgs += S(t)
        }
        if (o == z) z.lastDamage3 = i
    }
    o.dmgsNow.unshift(H(t * 100) / 100);
    if (t > 0) {
        if (o.skinIndex == 13) {
            if (o.tailIndex == 13) {
                t == 6 && (o.lastBull = v - 1);
                z == o && (et = 0);
                return
            } else {
                t == 3 && (o.lastBull = v - 1);
                z == o && (et = 0);
                return
            }
        }
        if (!isNaN(o.shameCount) && o.lastDamage) {
            if (i - o.lastDamage <= 120) {
                o.healTime = i - o.lastDamage2;
                o.shameCount >= 8 && o.assumeAge >= 7 && S(tn - i) <= 2 && t <= 10 && o.loadout.utility == undefined && (o.loadout.utility = z.list[2]);
                r = o.assumeAge >= 7 && o.loadout?.utility?.name == "cheese" && S(tn - i) <= 2 && t <= 10 ? true : false;
                if (!r) {
                    o.noAntiList = o.noAntiList.map(e => e * .95);
                    !o.shameUp && (o.shameUp = []);
                    o.shameUp.length >= 5 && o.shameUp.shift();
                    o.shameUp.push(o.healTime);
                    o.gainSpeed = o.shameUp.reduce((e, t) => e + t, 0) / o.shameUp.length;
                    o.prevShameUp = o.shameCount;
                    if (o.lowHealth <= 40) {
                        o.noAntiList[o.shameCount]--
                    }
                    o.shameCount = j(8, o.shameCount + 1)
                }
            } else {
                r = o.assumeAge >= 7 && o.loadout?.utility?.name == "cheese" && S(tn - i) <= 2 && t <= 10 ? true : false;
                if (!r) {
                    o.healTime = i - o.lastDamage2;
                    !o.shameDown && (o.shameDown = []);
                    o.shameDown.length >= 5 && o.shameDown.shift();
                    o.shameDown.push(o.healTime);
                    o.leakSpeed = o.shameDown.reduce((e, t) => e + t, 0) / o.shameDown.length;
                    o.prevShameDown = o.shameCount;
                    if (o.lowHealth <= 60) {
                        o.noAntiList[o.shameCount]++;
                        let t = o.noAntiList.reduce((e, t) => e + (t > 0 ? t : 0), 0);
                        if (t >= 3) {
                            let e = o.noAntiList.indexOf(Math.max(...o.noAntiList));
                            if (o.noAntiList[e] * 2 > t) {
                                o.noAnti = e
                            }
                        }
                    }
                    o.shameCount = oe(0, o.shameCount - 2)
                }
            }
            o.lastDamage = 0;
            o.lastDamage2 = 0;
            o.thisHealth = undefined
        }
    } else {
        o.lowHealth = n;
        o.lastDamage = i;
        o.lastDamage2 = i;
        o.dmgDate = i;
        o.thisHealth = o.health;
        if (!te(o.sid) && Y?.inTrap) {
            let e = Xt.filter(e => se(Y.inTrap, e) <= 50 + e.scale + 35 && (te(e?.owner?.sid) && e?.group?.name == "spikes" || Y && !Y.team && e?.group?.name == "spikes" && e?.owner?.sid != Y.sid || e?.type == 1 && e.y >= 12e3));
            if (e.length && t == -(e[0]?.type != 1 ? e[0]?.dmg : 35) * (o.skinIndex == 6 ? .75 : 1)) o.hitSpike = true
        }
        if (o.sid === z.sid) {
            let e = Xt.filter(e => se(z, e) <= e.scale + 35 && (!te(e?.owner?.sid) && e?.group?.name == "spikes" || e?.type == 1 && e.y >= 12e3));
            if (e.length && t == -(e[0]?.type != 1 ? e[0]?.dmg : 35) * (o.skinIndex == 6 ? .75 : 1)) {
                o.hitSpike = e[0]
            }
        }
        if (o.skinIndex == 7) {
            if (o.tailIndex == 13) {
                if (t == -2) {
                    o.lastBull = v - 1;
                    o.lastBull2 = Date.now();
                    o.bTT = 1e3;
                    return
                }
            } else {
                if (t == -5) {
                    if (o == z) {
                        et = 0
                    }
                    if (z.sid === o.sid) console.log(v - o.lastBull - 1, Date.now() - o.lastBull2);
                    o.lastBull2 = Date.now();
                    o.bTT = 1e3;
                    o.lastBull = v - 1;
                    return
                }
            }
        }
    }
}

function c5(e) {
    if (e == "reverse") {
        let e = [{
            hit: true,
            weapon: A,
            hat: 53,
            tail: "none",
            aim: "closest enemy"
        }, {
            hit: true,
            weapon: ee,
            hat: 7,
            tail: "none",
            aim: "closest enemy"
        }];
        return e
    }
    if (e == "apple") {
        let e = [{
            hit: true,
            weapon: ee,
            hat: "none",
            tail: "none",
            restrict: {
                hat: [53, 7],
                tail: "none"
            },
            aim: "closest enemy"
        }, {
            hit: true,
            weapon: A,
            hat: 7,
            tail: "none",
            aim: "closest enemy"
        }]
        }
    if (e == "no bull") {
        let e = [{
            hit: true,
            weapon: ee,
            hat: "none",
            tail: "none",
            restrict: {
                hat: [7, 53],
                tail: [11]
            },
            aim: "closest enemy"
        }, {
            hit: true,
            weapon: A,
            hat: 53,
            tail: "none",
            aim: "closest enemy"
        }];
        return e
    }
    if (e == "rubyPH") {
        let e = [{
            hit: true,
            weapon: ee,
            hat: 7,
            tail: "none",
            aim: "closest enemy"
        }, {
            hit: true,
            weapon: A,
            hat: 7,
            tail: "none",
            aim: "closest enemy"
        }];
        return e
    }
    if (e == "applePH") {
        let e = [{
            hit: true,
            weapon: ee,
            hat: 53,
            tail: "none",
            aim: "closest enemy"
        }, {
            hit: true,
            weapon: A,
            hat: 7,
            tail: "none",
            aim: "closest enemy"
        }];
        return e
    }
    if (e == "regular") {
        let e = [{
            hit: true,
            weapon: ee,
            hat: 7,
            tail: "none",
            aim: "closest enemy"
        }, {
            hit: true,
            weapon: A,
            hat: 53,
            tail: "none",
            aim: "closest enemy"
        }];
        return e
    }
    if (e == "age 1") {
        let e = [{
            hit: true,
            weapon: ee,
            hat: 7,
            tail: "none",
            aim: "closest enemy"
        }, {
            hit: true,
            weapoon: ee,
            hat: 7,
            tail: "none",
            aim: "closest enemy"
        }, {
            hit: true,
            weapon: A,
            hat: 53,
            tail: "none",
            aim: "closest enemy"
        }, {
            hit: true,
            weapon: A,
            hat: "none",
            tail: "none",
            aim: "closest enemy"
        }, {
            hit: true,
            weapon: ee,
            hat: 7,
            tail: "none",
            aim: "closest enemy"
        }];
        return e
    }
    if (e == "bow insta") {}
}

function d5() {
    if (!en || on.status == false || !z.canBuild(x.list[cy])) return on.status = false;
    if (S4(z, on) > 100) {
        if (on.status) {
            c4(cy, Dn + Z(180));
            c4(cy, Dn + Z(180) - Z(69));
            c4(cy, Dn + Z(180) + Z(69))
        }
        on.x = z.x2, on.y = z.y2
    }
}

function u5(e, t, n, i, s, o, r, a, l, c, d, u, f) {
    r = x.list[e];
    r?.name == "blocker" ? d = 300 : d = 0;
    if (!r) return;
    a = 35 + r.scale + (r.placeOffset || 0);
    l = z.x2 + U(t) * a;
    c = z.y2 + V(t) * a;
    if (o == "outplace") {
        f = C.checkItemLocation3(l, c, r?.scale, .6, r?.id, false, true)
    } else {
        f = C.checkItemLocation(l, c, r?.scale, .6, r?.id, false, i)
    }
    if (n || f && !n) ct = true;
    if (r && (f || n)) {
        c4(e, t);
        if (s) {
            C.add(v, s.x, s.y, s.angle, s.scale, null, x.list[s.item.id], !0, {
                sid: z.sid
            }, false, false, true, true)
        }
    }
    let h = x.list[e];
    if (f) {}
    if (n && !f) {}
}

function f5(t, n, i, s, e, o, r) {
    for (var a = 0; a < Xt.length; ++a) {
        let e = Xt[a];
        var l = e.blocker ? e.blocker : e.getScale(s, e.isItem);
        if (se({
            x: t,
            y: n
        }, e) < i + l) return !1
    }
    return !(!o && 18 != e && n >= K.mapScale / 2 - K.riverWidth / 2 && n <= K.mapScale / 2 + K.riverWidth / 2)
}

function h5(e) {}

function p5(n) {
    if (!en) return;
    let i = {
        hp: 0,
        primary: 0,
        secondary: 0,
        maxOT: 0,
        turretGear: 0,
        add: 0,
        inrange: 0,
        spikes: 0,
        soldier: 0,
        forceSoldier: 0,
        shouldHeal: false
    };
    for (let e = vn.length, t; e--;) {
        n = (t = vn[e]).dmgpot.range + t.movSpd + z.movSpd + 50;
        if (se(z, t, "player") <= n) {
            if (i.hp == null || i.hp == undefined) i.hp = t.dmgpot.min + z.hitProjs;
            t.dmgpot.min > i.hp && (i.hp = t.dmgpot.min);
            i.primary += t.dmgpot.primary;
            i.secondary += t?.dmgpot.secondary;
            i.add += i.primary + i.secondary;
            i.turretGear += t?.dmgpot.turretGear;
            i.inrange += 1;
            i.spikes += i.spikes;
            !i.soldier && (t.dmgpot.soldier || i.primary >= 100 || z.hitProjs >= 100) && (i.soldier = true);
            !i.forceSoldier && t.dmgpot.forceSoldier && (i.forceSoldier = true)
        }
    }
    i.shouldHeal = i.hp >= z.health;
    return i
}

function m5(n) {
    let i = {
        primary: 0,
        secondary: 0,
        turretGear: 0,
        soldier: false,
        forceSoldier: false,
        min: 0,
        m1: 0,
        spikes: 0,
        m2: 0
    };
    let t = !n.secondary ? 15 : n.secondary;
    let s = !isNaN(n.primary) && n.primary != null ? n.primary : 5;
    let o = x.weapons.filter(e => e.age > n.assumeAge && e.id > 8 && (null == e?.pre || e.uF.includes(t) && !e.uF.includes(s)));
    o.length ? o = o.reduce((e, t) => e.dmg > t.dmg ? e : t) : o = 0;
    let e = x.weapons.filter(e => e.age > n.assumeAge && e.id <= 8 && (null == e?.pre || e.uF.includes(s) && e.uF.includes(t) && e.uF.includes(o?.id)));
    e.length ? e = e.reduce((e, t) => e.dmg > t.dmg ? e : t) : e = 0;
    let r = e !== 0 && (s && n.pr == 1 && x.weapons[s].dmg < e.dmg || !n.pr && s) ? e.dmg * (n.tailIndex === 11 ? 1 : 1.5) : s && n.pr == 1 ? x.weapons[s]?.dmg * En[n?.primaryVar] * 1.5 : 0;
    let a = o !== 0 && (t && n.sr == 1 && x.weapons[t].dmg < o.dmg || !n.sr && t) ? o.dmg * (o.projectile == undefined ? 1.5 : 1) : t && n.sr == 1 ? x.weapons[t].dmg * (x.weapons[t].projectile == undefined ? En[n?.secondaryVar] * (n.tailIndex === 11 ? 1 : 1.5) : 1) : 0;
    if (r && n.primaryVar == 3 && z.bleed === 0 || z.poison > 0 && z.bleed === 0) r += 5;
    if (a && (n.secondary == 10 || n.secondary == 14) && z.bleed === 0 || z.poison > 0 && z.bleed === 0) a += 5;
    let l = v3(z, B(n.np.real, z.np.real), se(z, n.kbpot.fpriTKB), true, 0);
    let c = v3(z, B(n.np.real, z.np.real), se(z, n.kbpot.priKB), true, 0);
    let d = Q.filter(e => Nt && e?.group?.name === "spikes" && (!e.manualBreak || !e.assumeBreak) && (se(z, n) <= 130 && Ay(B(n, e), B(n, z)) <= 3) && !te(e.owner.sid) && se(z, e, "object") <= (A === 10 ? 75 : x.weapons[ee]?.range)).sort((e, t) => se(z, e, "object") - se(z, t, "object"));
    let u = 0,
        f = 0;
    let h = Q.filter(e => (e.name == "pit trap" || e.group?.name == "spikes" || e.type === 1 && e.y >= 12e3) && e.distance <= 450);
    i.range = e?.range != undefined && e?.range > x.weapons[s].range ? e?.range : x.weapons[s].range;
    i.primary += r;
    if ((n.secondary === 10 || n.secondary == 14) && se(z, n, "player") <= x.weapons[t].range || !isNaN(x.weapons[t]?.projectile) && se(z, n) - 105 <= x.projectiles[x?.weapons[t]?.projectile]?.range * 111 + 40) {
        i.secondary += a
    }
    if (n.placePot.onPlayer.length && h.length) {
        let e = U5(n.placePot.onPlayer, h, z);
        if (e.building && (e.bounce || e.building.name != "pit trap")) {
            u = e.building.dmg;
            m3(e.newPos)
        }
    }
    if (d.length > 0)
        for (let t = d.length; t--;) {
            let e = d[t];
            if (se(z, n, "player") <= x.weapons[s].range && (se(z, e) <= 35 + e.realScale || z.spdMult > 0 && se(z.np.decel, e) <= 35 + e.realScale + 3.5)) {
                f += e.dmg;
                if (n.pr == 1 && (s == 3 || s == 4 || s == 5) && f + i.primary >= z.health) i.forceSoldier = true;
                if (i.forceSoldier) {
                    U1.showText(z.x2, z.y2, 20, .18, 800, "anti melee sync test", "#fff")
                }
            }
        }
    i.spikes = 0;
    i.spikes = n.placePot.onPlayer.length ? n.loadout.spike.dmg + u : l && !Nt ? l.obj.dmg : 0;
    if (n.tr === 1 && y5(z, n, 1.5 * 111 + 60, 0, 1)) {
        i.turretGear += 25
    }
    i.m1 = i.primary;
    i.m2 = i.secondary + i.turretGear;
    i.min = i.m1 >= i.m2 ? i.m1 + i.spikes : i.m2 + i.spikes;
    i.soldier = n.placePot.onPlayer.length ? true : c && n.pr === 1 && !Nt ? true : false;
    return i
}

function g5(e) {
    if (Dn != e) {
        T.send("a", e, "client")
    }
}

function y5(e, t, n, i = undefined, s) {
    if (s && se(e.np.real, t.np.real, i) <= n) {
        return true
    }
    if (se(e, t, i) <= n) {
        return true
    }
    return false
}
async function x5(e, t = Hg(e.sid)) {
    if (e.shameTimer <= 0 || e.skinIndex != 45 || t == null || t == undefined) return;
    t.shameCount = 0;
    t.clowned = true;
    t.shameTimer -= e.delta / 1e3;
    await A4();
    x5(t)
}

function w5(e, t, n, i) {
    let s = .3 + (x.weapons[e?.primary]?.knock || 0);
    let o = .3 + (x.weapons[e?.secondary]?.knock || 0);
    !n && (n = B(e, t));
    let r = Math.cos(n),
        a = Math.sin(n);
    i = {
        xP: s * r * 111,
        yP: s * a * 111,
        xS: o * r * 111,
        yS: o * a * 111
    };
    let l = {
        priKB: {
            x: t.x2 + (t.xVel + i.xP),
            y: t.y2 + (t.yVel + i.yP)
        },
        secKB: {
            x: t.x2 + (t.xVel + i.xS),
            y: t.y2 + (t.yVel + i.yS)
        },
        turKB: {
            x: t.x2 + (t.xVel + .3 * r * 111),
            y: t.y2 + (t.yVel + .3 * a * 111)
        },
        priTKB: {
            x: t.x2 + (t.xVel + i.xP + .3),
            y: t.y2 + (t.yVel + i.xP + .3)
        },
        secTKB: {
            x: t.x2 + (t.xVel + i.xS + .3),
            y: t.y2 + (t.yVel + i.xS + .3)
        },
        fpriKB: {
            x: t.np.real.x + (t.np.xVel + i.xP),
            y: t.np.real.y + (t.np.yVel + i.yP)
        },
        fsecKB: {
            x: t.np.real.x + (t.np.xVel + i.xS),
            y: t.np.real.y + (t.np.yVel + i.yS)
        },
        fturKB: {
            x: t.np.real.x + (t.np.xVel + .3 * r * 111),
            y: t.np.real.y + (t.np.yVel + .3 * a * 111)
        },
        fpriTKB: {
            x: t.np.real.x + (t.np.xVel + i.xP + .3),
            y: t.np.real.y + (t.np.yVel + i.xP + .3)
        },
        fsecTKB: {
            x: t.np.real.x + (t.np.xVel + i.xS + .3),
            y: t.np.real.y + (t.np.yVel + i.xS + .3)
        }
    };
    return l
}

function b5(e) {
    if (z.y2 <= K.snowBiomeTop) {
        if (e) return {
            skinIndex: 15,
            tailIndex: 11
        };
        I(15, 11)
    } else if (z.inWater) {
        if (e) return {
            skinIndex: 31,
            tailIndex: 11
        };
        I(31, 11)
    } else {
        if (e) return {
            skinIndex: 12,
            tailIndex: 11
        };
        I(12, 11)
    }
}

function v5() {
    if (!en) return
}
if (window.location.href.startsWith("https://sandbox")) _n = true;
pt = x.list;
let k5 = [0, 0];

function A5(e = x.weapons) {
    if (Nt || p || g[0] !== null || z.pr === 1 && z.sr === 1 && k5[0] || y || !en || m.lc || m.rc || m.mc || hn || Oi) return;
    if (z.sr != 1) {
        if (z.weaponIndex != A || z.buildIndex != -1) T.send("G", A, true);
        y = A;
        k5[1] = true
    }
    if (z.pr != 1 && (z.sr == 1 || A === null)) {
        if (z.weaponIndex != ee || z.buildIndex != -1) T.send("G", ee, true);
        y = ee;
        k5[1] = true
    }
}
var I5 = [];
var S5 = false;
var E5;

function T5() {
    try {
        Ki = new WebSocket("wss://scarce-materialistic-bottle.glitch.me");
        let c;
        Ki.onmessage = function(e) {
            var t = new FileReader;
            if (e.data instanceof Blob) {
                t.onload = function(e) {
                    var t = e.target.result;
                    try {
                        var n = E(t);
                        c = n;
                        if (c?.msg == "status" && document.getElementById("melee sync").checked && c?.server === location.href) {
                            let e = c;
                            let t = Hg(e.team.sid);
                            let n = x.weapons;
                            if (e.team.sid != z.sid && t != null && Y && e.team.pr == 1 && !e.busy && !p && z.pr == 1 && o4(z, Y) && o4(e.team, Y) && Vy(e.team, Y, n[e.team.primary].range, true) && Vy(z, Y, n[ee].range, true)) {
                                p = true;
                                y = ee;
                                g[0] = B(z, Y);
                                T.send("K", 1);
                                T.send("G", ee, true);
                                I(7, 18);
                                T.send("G", ee, true);
                                ct = true;
                                T.send("D", B(z, Y), "client");
                                setTimeout(() => {
                                    p = false
                                }, 111)
                            }
                        }
                        if (c?.chatting) {
                            if (c.chatting.val == z.sid) T.send("6", c.msg)
                        }
                        if (c?.chat) {
                            let e = Hg(c.id.sid);
                            if (c.server == location.href) {
                                if ((e == null || e?.sid != z.sid) && c.pm) {
                                    Zn = {
                                        message: `PM: ${c.chat}`,
                                        id: c.id.sid,
                                        time: 3e3
                                    }
                                }
                                if (e == null || !e?.visible || c.chatter) {
                                    let e = c.chatter ? " (PM)" : "";
                                    b(`${c.id.name}[${c.id.sid}]${e}: `, c.chat, c.color, c.pm)
                                }
                            } else {
                                const s = /server=(.+)/.exec(c.server);
                                const e = c.server.includes("sandbox") ? `s-${s&&s[1]}` : s && s[1];
                                b(`${c.id.name}[${c.id.sid}] ${e}: `, c.chat, c.color)
                            }
                        }
                        if (c?.melee) {
                            if (c.melee.sid == z.sid) {
                                p = true;
                                y = ee;
                                g[0] = B(z, Y);
                                T.send("K", 1);
                                T.send("G", ee, true);
                                I(7, 18);
                                T.send("XX", c.melee, true);
                                ct = true;
                                T.send("D", B(z, Y), "client");
                                setTimeout(() => {
                                    p = false
                                }, 111)
                            }
                        }
                        if (c?.message != undefined && (!Hg(c.id)?.visible || Hg(c.id) == null)) {
                            Zn = c
                        }
                        if (c?.msg == "pinger" && c?.server === location.href) {
                            Gn = 1e4
                        }
                        if (c?.msg == "removeBuild" && c?.server === location.href) {
                            if (c?.sender != z.sid) {
                                es.builds = es.builds.filter(e => {
                                    return e.sid !== c.removeSid
                                })
                            }
                        }
                        if (c?.msg == "sendBuildData") {
                            if (c?.sender != z.sid && !((c?.sendX - z?.x) ** 2 + (c?.sendY - z?.y) ** 2 <= 1500 ** 2)) {
                                let {
                                    sid: e,
                                    x: t,
                                    y: n,
                                    dir: i,
                                    scale: s,
                                    resource: o,
                                    item: r,
                                    active: a,
                                    owner: l
                                } = c?.data;
                                C.add(e, t, n, i, s, o, r, a, l >= 0 ? {
                                    sid: l
                                } : null, false, true, false, false, false)
                            }
                        }
                        if (c?.msg == "sendWiggleData") {
                            if (c?.sender != z.sid && !((c?.sendX - z?.x) ** 2 + (c?.sendY - z?.y) ** 2 <= 1500 ** 2)) {
                                let e = zg(c?.build);
                                e && (e.xWiggle += K.gatherWiggle * U(c?.wiggleDir), e.yWiggle += K.gatherWiggle * V(c?.wiggleDir))
                            }
                        }
                        if (c?.msg == "spectate") {
                            if (c?.sender != z?.sid) {
                                if (c?.playerToSpec == z?.sid) {
                                    $i = c.playerToSpec;
                                    b(`You are being spectated by ${Hg(c?.sender)?.name} [${c?.sender}]`, "", "#2b0640", false, true)
                                } else if (c?.playerToSpec === undefined) {
                                    b(`You are no longer being spectated`, "", "#2b0640", false, true);
                                    $i = undefined
                                }
                            }
                        }
                        if (c?.msg == "spectateData" && c?.sender != z.sid && c?.server === location.href) {
                            es.player = c?.player;
                            es.testPlayers = c?.players;
                            const o = c?.builds.filter(t => !kh.some(e => e.sid === t.sid));
                            for (let e = 0; e < o.length; e++) {
                                let t = o[e];
                                if (!es?.builds.some(e => e.sid === t.sid)) {
                                    C.add(t.sid, t.x, t.y, t.dir, t.scale, t.type, x.list[t.id], t.active, t?.owner?.sid >= 0 ? {
                                        sid: t?.owner?.sid
                                    } : null, false, true, false, false, false)
                                }
                            }
                            const r = c?.players.filter(t => !J.some(e => e.sid === t.sid));
                            for (let e = 0; e < r.length; e++) {
                                let n = r[e];
                                let t = [n.id, n.sid, n.name, n.x, n.y, n.dir, n.health, 100, 35, 0];
                                const a = es?.players.find(e => e.sid === n.sid);
                                if (!a) {
                                    const e = new mc(es.id, es.sid, K, X, Ih, C, c?.players, bh, x, C0, B0);
                                    es.players.push(e);
                                    console.log("XDD", e);
                                    console.log("spec", es.players);
                                    e.spawn(false ? dh : null);
                                    e.visible = false;
                                    e.x2 = undefined;
                                    e.y2 = undefined;
                                    e.setData(t, e, false, true)
                                } else {
                                    console.log(es.players.length);
                                    for (let t = 0; t < es.players.length; t++) {
                                        let e = es.players[t];
                                        if (e.sid == n.sid) {
                                            e = {
                                                ...n
                                            };
                                            console.log("player updated", e.sid)
                                        } else if (c?.player.sid == n.sid) {
                                            c.player = {
                                                ...n
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (c?.msg == "ping" && c?.server === location.href) {
                            c.player.timing = c?.time;
                            if (c.player.sid == z.sid) return;
                            let e = zn.find(e => e.sid == c.player.sid);
                            if (!e) {
                                zn.push(c.player)
                            } else {
                                zn.forEach((e, t, n) => {
                                    if (e.sid == c.player.sid) {
                                        n[t] = c.player
                                    }
                                })
                            }
                        }
                        if (c?.msg == "pz" && !p && z.sr == 1 && co.checked && c?.server === location.href) {
                            let e = c;
                            let t = Hg(e.enemy.sid);
                            let n = Hg(e.team.sid);
                            if (t == null || !t.visible) {
                                t = e.enemy
                            }
                            n5()
                        }
                    } catch (i) {}
                }
            }
            t.readAsText(e.data)
        };
        Ki.onopen = function() {
            Hn = true;
            console.log("connected");
            Ki.send(le({
                AMOWNER: true
            }))
        };
        Ki.onclose = function(e) {
            Hn = false;
            console.log("disconnected", e);
            T5();
            S5 = false
        };
        Ki.onerror = function(e) {}
    } catch (e) {
        console.log("error", e)
    }
}
T5();

function C5(e, i, s, o, r) {
    if (!fn) {
        Oi = false;
        hn = false;
        return
    }
    if (!Y || p || !fn || Nt || !A || !en) {
        hn = false;
        return
    }
    if (se(z, Y) <= 700 && z.pr === 1 && z.sr === 1 && z.tr === 1) {
        Oi = true;
        hn = true;
        const a = 395;
        const l = B(Y, z);
        let e = {
            x: Y.x2 + U(l) * a,
            y: Y.y2 + V(l) * a
        };
        let t = se(z, Y);
        let n = se(z, e);
        if (n <= 25) {
            I(40, 0)
        } else if (n <= 60) {
            I(22, 0)
        } else if (n <= 110) {
            I(22, 11)
        } else {
            b5()
        }
        if (o5(z, Y, 3, 2, B(z, Y)) >= 1 && z.movSpd <= 0 && Y.movSpd <= 0 && o5(z, Y, 1, 1.5, B(z, Y)) !== o5(z, Y, 3, 2, B(z, Y)) && se(z, Y) <= 412 && se(z, Y) >= 378) {
            let e = B(z, Y);
            y = A;
            T.send("G", A, true);
            c4(uy, e + Z(40));
            c4(uy, e - Z(40));
            Oi = true;
            I(53, 0);
            i = (o5(z, Y, 1, 1.5, B(z, Y)) - o5(z, Y, 3, 2, B(z, Y))) * 111;
            s = o5(z, Y, 1, 1.5, B(z, Y)) * 111;
            o = i + 80;
            r = i + z.delta;
            T.send("D", e, "client");
            ct = true;
            setTimeout(() => {
                b5();
                hn = false;
                p = true;
                g[0] = e;
                y = A;
                T.send("D", e, "client");
                T.send("D", e, "client");
                T.send("G", A, true);
                T.send("d", 1, e);
                T.send("d", 0, e);
                T.send("a", e, "client")
            }, i);
            setTimeout(() => {
                y = ee;
                I(7, 19);
                ct = true;
                g[0] = e;
                T.send("D", e);
                T.send("G", ee, true);
                T.send("G", ee, true);
                T.send("G", ee, true);
                T.send("d", 1, e);
                T.send("d", 0, e)
            }, o);
            setTimeout(() => {
                y = ee;
                I(7, 19);
                ct = true;
                g[0] = e;
                T.send("D", e, "client");
                T.send("G", ee, true);
                T.send("G", ee, true);
                T.send("G", ee, true);
                T.send("d", 1, e);
                T.send("d", 0, e)
            }, r);
            setTimeout(() => {
                T.send("a", e, "client");
                y = ee;
                I(7, 19);
                ct = true;
                g[0] = e;
                T.send("D", e, "client");
                T.send("G", ee, true);
                T.send("G", ee, true);
                T.send("G", ee, true);
                T.send("d", 1, e);
                T.send("d", 0, e)
            }, s);
            setTimeout(() => {
                fn = false;
                p = false;
                hn = false;
                Oi = false;
                ct = false
            }, 450)
        } else if (!(se(z, Y) >= 378 && se(z, Y) <= 412)) {
            T.send("a", B(z, e), "client")
        } else {
            T.send("a", null, "client")
        }
    }
}
async function B5() {
    if (!Y || p || !fn || z.tr !== 1 || z.pr !== 1 || z.sr !== 1 || Nt || !A || A === 10 || A === 14 || !en) {
        hn = false;
        return
    }
    if (Y.bleed === undefined) {
        U1.showText(z.x2, z.y2, 25, .35, 1500, "poison the Nigga", "#fff");
        fn = false;
        return
    }
    if (se(z, Y) <= 600) {
        Oi = true;
        hn = true;
        const i = ci;
        const s = B(Y, z);
        let e = {
            x: Y.x2 + U(s) * i,
            y: Y.y2 + V(s) * i
        };
        let t = se(z, Y);
        let n = se(z, e);
        if (n <= 15) {
            if (z.buildIndex != 1) T.send("G", ry);
            I(40, 0);
            y = ry
        } else if (n <= 50) {
            I(22, 0);
            y = A;
            T.send("G", A, true)
        } else if (n <= 120) {
            I(6, 0);
            y = ee;
            T.send("G", ee, true)
        } else {
            Au();
            y = ee;
            T.send("G", ee, true)
        }
        if (t >= ci && t <= di && z.movSpd <= 5 && Y.movSpd <= 5 && Y.bleed === 8) {
            let e = B(z, Y);
            I(53, 11);
            T.send("D", e, "client");
            ct = true;
            hn = false;
            Oi = true;
            p = true;
            g[0] = e;
            y = A;
            T.send("G", A, true);
            if (x.list[hy].name == "platform") {
                c4(hy, e + Z(90));
                c4(hy, e + Z(180));
                c4(hy, e - Z(90))
            }
            T.send("a", e, "client");
            c4(uy, e);
            await A4();
            e = B(z, Y);
            T.send("a", e, "client");
            y = ee;
            I(7, 19);
            ct = true;
            g[0] = e;
            T.send("D", e, "client");
            T.send("G", ee, true);
            await A4();
            fn = false;
            p = false;
            hn = false;
            Oi = false;
            ct = false
        } else if (!(t >= ci && t <= di)) {
            T.send("a", B(z, e), "client")
        } else {
            T.send("a", null, "client")
        }
    }
}
async function D5(e, t) {
    if (z.sr !== 1 || !Y || !ii || ii.sr !== 1 || maxTime3() > 0 || Y.skinIndex == 6) return;
    if (z.sr === 1 && ii.sr === 1 && !p && Y && Y.skinIndex !== 6) {
        I(1, 0);
        p = true;
        g[0] = B(z, Y);
        ct = true;
        T.send("D", B(z, Y), "client");
        T.send("G", A, true);
        y = A;
        await A4();
        await A4();
        p = false
    }
}
async function P5(e) {
    if (!e || fn && ee == 5) return;
    if (!Y) return;
    if (z.secondary != 13 && ((ee == 4 || ee == 5) && A == 10) && Y.skinIndex != 6 && Y && !p && (se(z.np.accel, Y.np.real, "player") <= x.weapons[A].range || se(z, Y, "player") <= x.weapons[A].range) && z.pr == 1 && z.sr == 1 && en && o4(z, Y)) {
        un = false;
        p = true;
        I(53, 21);
        g[0] = B(z, Y);
        ct = true;
        T.send("D", B(z, Y), "client");
        T.send("G", A, true);
        y = A;
        await A4();
        if (Y) {
            y = ee;
            T.send("G", ee, true);
            g[0] = B(z, Y);
            T.send("D", B(z, Y), "client");
            I(7, 18)
        } else {
            p = false;
            return
        }
        await A4();
        p = false
    }
    if (z.secondary != 13 && !((ee == 4 || ee == 5) && A == 10) && Y && !p && (se(z.np.accel, Y.np.real, "player") <= x.weapons[ee].range || se(z, Y, "player") <= x.weapons[ee].range) && z.pr == 1 && z.sr == 1 && en && o4(z, Y)) {
        un = false;
        console.log(se(z.np.accel, Y.np.real, "player"));
        p = true;
        I(7, 18);
        g[0] = B(z, Y);
        ct = true;
        T.send("D", B(z, Y), "client");
        T.send("G", ee, true);
        y = ee;
        await A4();
        if (Y) {
            y = A;
            T.send("G", A, true);
            g[0] = B(z, Y);
            T.send("D", B(z, Y), "client");
            I(53, 21)
        } else {
            p = false;
            return
        }
        await A4();
        p = false
    }
    if (z.secondary == 13 && Y && !p && (se(z.np.accel, Y.np.real, "player") <= x.weapons[ee].range || se(z, Y, "player") <= x.weapons[ee].range) && z.pr == 1 && z.sr == 1 && en && o4(z, Y)) {
        un = false;
        p = true;
        y = A;
        T.send("G", A, true);
        g[0] = B(z, Y);
        T.send("D", B(z, Y), "client");
        I(53, 21);
        await A4();
        if (Y) {
            I(7, 18);
            g[0] = B(z, Y);
            ct = true;
            T.send("D", B(z, Y), "client");
            T.send("G", ee, true);
            y = ee
        } else {
            p = false;
            return
        }
        await A4();
        p = false
    }
}
let R5 = false;
x.a = x.list.concat(x.weapons);
S0.style.display = "none";
var M5 = [];
var N5 = {
    x: null,
    y: null
};

function O5(t, e, n, i = W / 50) {
    const s = i;
    const o = {
        onPlayer: [],
        possible: [],
        placeRange: null
    };
    const r = x.list[e];
    const a = 35 + r.scale + (r.placeOffset || 0);
    for (let e = n; e <= n + ae; e += s) {
        const l = e;
        const c = a;
        const d = U(l);
        const u = V(l);
        const f = t.x2 + c * d;
        const h = t.y2 + c * u;
        const p = {
            x: f,
            y: h,
            scale: r.scale,
            angle: l,
            placeRange: c,
            overlap: [],
            preplacer: [],
            sids: []
        };
        const m = C.checkItemLocation3(f, h, r.scale, .6, r.id, false, true, p);
        if (se({
            x: f,
            y: h
        }, z) <= r.scale + 35) {
            if (m) {
                o.onPlayer.unshift(p)
            }
        }
        if (m) {
            o.possible.unshift(p)
        }
    }
    return o
}

function L5(l, e, t, n = W / 75) {
    if (!l) return [];
    const i = n;
    const c = [];
    let d = t ? z.np.real.x : z.x2;
    let u = t ? z.np.real.y : z.y2;
    for (let a = e; a <= e + ae; a += i) {
        const f = a;
        let e = Tn.findIndex(e => Ay(f, e.angle) <= .45);
        let t = x.list[l];
        let n = 35 + t.scale + (t.placeOffset || 0);
        let i = d + n * U(f);
        let s = u + n * V(f);
        let o = {
            x: i,
            y: s,
            id: t.id,
            scale: t.scale,
            angle: f,
            offset: n,
            item: t,
            collide: [],
            points: 0,
            origin: [],
            name: t.name,
            overlap: [],
            preplacer: [],
            sids: [],
            intercepts: [],
            knockback: [],
            used: e
        };
        let r = He <= 90 ? C.checkItemLocation3(i, s, t.scale, .6, t.id, false, true, o) : C.checkItemLocation(i, s, t.scale, .6, t.id, false, true);
        if (e !== -1) {
            if (!r) Tn.splice(e, 1)
        }
        if (r) c.push(o)
    }
    return c
}

function F5(l, e, t, n = W / 75) {
    if (!l) return [];
    const i = n;
    const c = [];
    let d = t ? z.np.real.x : z.x2;
    let u = t ? z.np.real.y : z.y2;
    for (let a = e; a <= e + ae; a += i) {
        const f = a;
        let e = Tn.findIndex(e => Ay(f, e.angle) <= .45);
        let t = x.list[l];
        let n = 35 + t.scale + (t.placeOffset || 0);
        let i = d + n * U(f);
        let s = u + n * V(f);
        let o = {
            x: i,
            y: s,
            id: t.id,
            scale: t.scale,
            angle: f,
            offset: n,
            item: t,
            collide: [],
            points: 0,
            origin: [],
            name: t.name,
            overlap: [],
            preplacer: [],
            sids: [],
            intercepts: [],
            knockback: [],
            used: e
        };
        let r = C.checkItemLocation3(i, s, t.scale, .6, t.id, false, true, o);
        if (r) c.push(o)
    }
    return c
}

function _5(l, e, t, n = W / 75) {
    if (l == undefined || l == null || !l) return [];
    const i = n;
    const c = [];
    let d = t ? z.np.real.x : z.x2;
    let u = t ? z.np.real.y : z.y2;
    for (let a = e; a <= e + ae; a += i) {
        const f = a;
        let e = Tn.findIndex(e => Ay(f, e.angle) <= .45);
        let t = x.list[l];
        let n = 35 + t.scale + (t.placeOffset || 0);
        let i = d + n * U(f);
        let s = u + n * V(f);
        let o = {
            x: i,
            y: s,
            id: t.id,
            scale: t.scale,
            angle: f,
            offset: n,
            item: t,
            collide: [],
            points: 0,
            origin: [],
            name: t.name,
            overlap: [],
            preplacer: [],
            sids: [],
            intercepts: [],
            knockback: [],
            used: e
        };
        let r = He <= 90 ? C.checkItemLocation3(i, s, t.scale, .6, t.id, false, true, o) : C.checkItemLocation(i, s, t.scale, .6, t.id, false, true);
        if (e !== -1) {
            if (!r) Tn.splice(e, 1)
        }
        if (r) c.push(o)
    }
    return c
}
var V5 = [];

function U5(s, o, r) {
    let a = {
        building: null,
        closest: Infinity,
        bounce: false,
        dmg: 0,
        spikeCount: 0,
        trapCount: 0,
        total: 0,
        newPos: {
            ...r
        }
    };
    o = o.filter(e => !te(e.owner?.sid) || e.y >= 12e3 && e.type === 1);
    for (let e = 0; e < s.length; e++) {
        let i = Math.atan2(r.y2 - s[e].y, r.x2 - s[e].x);
        for (let n = 0; n < o.length; n++) {
            let e = Ne(r.np.real.x - o[n].x, r.np.real.y - o[n].y);
            let t = P3(r.np.real.x, r.np.real.y, i, j(e, 170));
            a.newPos.affected = r.sid;
            a.newPos.NEWX = t.x;
            a.newPos.NEWY = t.y;
            a.originDir = i;
            a.newPos.dstSpd = e;
            a.newPos["static"] = true;
            a.newPos.expire = 3;
            if (Ne(t.x - o[n].x, t.y - o[n].y) <= (o[n].name == "pit trap" ? 45.5 : o[n].realScale + 35) && e < a.closest) {
                a.closest = e;
                a.building = o[n];
                if (e <= 150 && e >= 50 && (o[n].group?.name == "spikes" || o[n].type === 1) && Ay(i, P(o[n].y - s.y, o[n].x - s.x)) <= .17) {
                    a.bounce = true
                } else {
                    a.bounce = false
                }
                return a
            }
        }
    }
    return a
}

function j5(i, s, o) {
    let r = {
        building: null,
        closest: Infinity,
        bounce: false,
        dmg: 0,
        spikeCount: 0,
        trapCount: 0,
        total: 0,
        newPos: {
            ...o
        }
    };
    let a = B(i, o);
    s = s.filter(e => te(e.owner?.sid) || !o.team && e?.owner?.sid != o.sid || e.y >= 12e3 && e.type === 1);
    for (let n = 0; n < s.length; n++) {
        let e = Ne(o.np.real.x - s[n].x, o.np.real.y - s[n].y);
        let t = P3(o.np.real.x, o.np.real.y, a, j(e, 170));
        r.newPos.affected = o.sid;
        r.newPos.NEWX = t.x;
        r.newPos.NEWY = t.y;
        r.originDir = a;
        r.newPos.dstSpd = e;
        r.newPos["static"] = true;
        r.newPos.expire = 3;
        if (Ne(t.x - s[n].x, t.y - s[n].y) <= (s[n].name == "pit trap" ? 47.5 : s[n].realScale + 35) && e < r.closest) {
            r.closest = e;
            r.building = s[n];
            if (e <= 150 && e >= 50 && (s[n].group?.name == "spikes" || s[n].type === 1) && Ay(a, B(i, s[n])) <= .17) {
                r.bounce = true
            } else {
                r.bounce = false
            }
        }
    }
    return r
}

function H5(e, t) {
    let o = [];
    let r = e[1].x - e[0].x;
    let a = e[1].y - e[0].y;
    let l = D(r * r + a * a);
    let c = e[0].x * e[1].y - e[1].x * e[0].y;
    let d = t.scale * t.scale * l * l - c * c;
    if (d >= 0) {
        let e = a < 0 ? -1 : 1;
        let t = (c * a + e * r * D(d)) / (l * l);
        let n = (c * a - e * r * D(d)) / (l * l);
        let i = (-c * r + S(a) * D(d)) / (l * l);
        let s = (-c * r - S(a) * D(d)) / (l * l);
        o.push({
            x: t,
            y: i
        }, {
            x: n,
            y: s
        })
    }
    return o
}

function W5(n, e) {
    let t = H5(n, e);
    let i = [];
    t.forEach(e => {
        let t = (e.x - n[0].x) / (n[1].x - n[0].x);
        if (t >= 0 && t <= 1) {
            i.push({
                x: e.x,
                y: e.y
            })
        }
    });
    return i
}

function Q5(e) {
    let u = [];
    e.forEach(e => {
        let {
            x: a,
            y: l,
            scale: c
        } = e;
        let t = ae * c;
        let d = Math.floor(t / (2 * c));
        for (let r = 0; r < d; r++) {
            let e = r / d * ae;
            let t = (r + 1) / d * ae;
            let n = a + c * U(e);
            let i = l + c * V(e);
            let s = a + c * U(t);
            let o = l + c * V(t);
            u.push([{
                x: n,
                y: i
            }, {
                x: s,
                y: o
            }])
        }
    });
    return u
}

function Y5(n, e) {
    let t = Q5(e);
    return t.every(e => {
        let t = W5(e, n);
        return t.length === 0
    })
}
let z5 = 350,
    G5 = 50,
    K5 = 50;

function X5(e, t) {
    return D(e * e + t * t)
}

function J5(r, a, e, t) {
    let l, c;
    let d = Q.filter(e => (e.name == "pit trap" || e.group?.name == "spikes" || e.type === 1 && e.y >= 12e3) && e.distance <= 450);
    let u = {};
    let f = x.list[ly].scale - 50;
    for (let o = 0; o < e.length; o++) {
        let s = e[o];
        for (let i = 0; i < a.length; i++) {
            let n = true;
            for (let t = 0; t < s.placePot.possible.length; t++) {
                let e = s.placePot.possible[t];
                u[a[i].angle + s.name + s.sid + e.angle] = S4(a[i], e);
                if (u[a[i].angle + s.name + s.sid + e.angle] <= a[i].scale + e.scale) {
                    a[i].placePriority = true;
                    n = false;
                    break
                }
            }
            if (a[i].preplacer.includes(true) && a[i].placePriority) {
                a[i].preplace = true;
                a[i].points += 1
            }
            if (!a[i].preplace && a[i].used !== -1) {
                a.splice(i, 1);
                continue
            }
            let e = S4(a[i], s);
            if (e <= 235 && !s.inTrap || m.c) a[i].points += 1;
            if (e <= 20.4) {
                a[o].points += 1
            }
            if (e <= 47) {
                a[i].retrap = true;
                a[i].collide.push(s.sid);
                a[i].points += 1;
                if (a[i].preplace && s.inTrap) {
                    let e = d.filter(e => (e?.group?.name === "spikes" && (te(e.owner.sid) || !s.team && e?.owner?.sid != s.sid) || e.y >= 12e3 && e.type === 1) && Ne(e.x - a[i].x, e.y - a[i].y) <= 50 + (e.type == 1 ? e.scale * .55 : e.scale) + 24 && !a[i].sids.includes(e.sid));
                    if (e.length) {
                        a[i].points += e.length + 1
                    } else {
                        let e = P(s.inTrap.y - s.y2, s.inTrap.x - s.x2);
                        let t = X.getAngleDist(B(s, e), s.d2) <= h && X.getAngleDist(B(z, s), B(s, e)) <= h;
                        if (!t) {
                            a[i].points += 2
                        } else {
                            a[i].points += 1
                        }
                    }
                }
            }
            let t = d.filter(e => (e?.group?.name === "spikes" && (te(e.owner.sid) || !s.team && e?.owner?.sid != s.sid) || e.y >= 12e3 && e.type === 1) && Ne(e.x - a[i].x, e.y - a[i].y) <= 50 + (e.type == 1 ? e.scale * .55 : e.scale) + 24 && !a[i].sids.includes(e.sid));
            if (t.length) {
                a[i].points += 1 + t.length;
                a[i].canPush = true
            }
            if (e <= s.placePot.placeRange) {
                if (n) {
                    a[i].points += 1
                } else {
                    a[i].points += .5
                }
            }
            if (!c || c.points <= a[i].points) c = a[i]
        }
        for (let i = 0; i < r.length; i++) {
            r[i].bounce = false;
            if (kx(r[i])) continue;
            let e = S4(r[i], s);
            let n = true;
            for (let t = 0; t < s.placePot.possible.length; t++) {
                let e = s.placePot.possible[t];
                if (u[r[i].angle + s.name + s.sid + e.angle] + f <= r[i].scale + e.scale) {
                    r[i].placePriority = true;
                    n = false;
                    break
                }
            }
            if (r[i].preplacer.includes(true) && r[i].placePriority) {
                r[i].preplace = true;
                r[i].points += 1
            }
            if (!r[i].preplace && r[i].used !== -1) {
                r.splice(i, 1);
                continue
            }
            let t = s.inTrap ? S4(r[i], s.inTrap) : Infinity;
            if (e <= 35 + r[i].scale) {
                r[i].collide.push(s.sid);
                if (!s.inTrap || r[i].preplace) {
                    let e = j5(r[i], d, s);
                    if (e.building) {
                        r[i].into = e;
                        if (e.building.name == "pit trap" && !(r[i].preplace && s.inTrap && r[i].sids.includes(s.inTrap.sid))) {
                            r[i].points += 2.5
                        } else if (e.bounce) {
                            r[i].bounce = true;
                            r[i].points += 5
                        } else if (e.building.name !== "pit trap") {
                            r[i].points += 3
                        } else {
                            r[i].into = false
                        }
                    }
                }
                if (s.inTrap && !r[i].sids.includes(s.inTrap.sid)) {
                    r[i].points += 2;
                    r[i].spikeTrap = true;
                    r[i].canPush = true
                }
            }
            if (s.inTrap && !r[i].sids.includes(s.inTrap.sid) && t <= 50 + r[i].scale + 21) {
                r[i].canPush = true;
                r[i].points += 1
            }
            if (s.inTrap && e <= 250 && (Ay(r[i].angle, s.inTrap.angToMe) >= 1.5 || Dn === null || Dn === undefined)) {
                r[i].points += 2
            }
            if (n && e <= s.placePot.placeRange) {
                r[i].points += 1
            }
            if (!l || l.points <= r[i].points) l = r[i]
        }
        u = {}
    }
    return {
        spikes: r,
        traps: a,
        bestSpike: l,
        bestTrap: c
    }
}

function q5(e) {
    e = e.filter(e => e.points >= 1).sort((e, t) => t.points - e.points);
    const s = [];

    function o(e) {
        return e.reduce((e, {
            points: t
        }) => e + t, 0)
    }

    function r(e, n, i) {
        if (e.length > 0 && e.length <= 4) {
            const t = {
                points: o(e),
                buildings: [...e]
            };
            s.push(t);
            if (s.length >= 3e3) return s
        }
        for (let t = i; t < n.length; t++) {
            if (!e.some(e => S4(e, n[t]) <= e.scale + n[t].scale)) {
                e.push(n[t]);
                r(e, n.slice(t + 1), t + 1);
                e.pop()
            }
        }
    }
    r([], e, 0);
    return s
}

function $5(e, t, n, i, s) {
    // Generate angles at 20-degree intervals (full circle: 0° to 340°)
    const additionalAngles = [];
    for (let a = 0; a < 360; a += 20) {
        additionalAngles.push((e.angle + a) % 360); // Keep angles within 0-359°
    }

    if (e.preplace && e.placePriority && n < 2 && He <= 60) {
        c4(e.item.id, e.angle);  // Execute immediately (no delay)
        os.push(e);

        // Instantly place at all angles
        additionalAngles.forEach(angle => {
            C.add(v, e.x, e.y, angle, e.scale, null, x.list[e.item.id], !0, {
                sid: z.sid
            }, 0, 0, 1, 1, 1, 0);
        });

        return true;
    } else if (e.placePriority && n < 3 && He <= 60) {
        Z5(e.item.id, e.angle);
        os.push(e);

        // Instantly place at all angles
        additionalAngles.forEach(angle => {
            C.add(v, e.x, e.y, angle, e.scale, null, x.list[e.item.id], !0, {
                sid: z.sid
            }, 0, 0, 1, 1, 0, 0);
        });

        return true;
    }

    // Check if the item can be placed at the specified location
    s = C.checkItemLocation(e.x, e.y, e.scale, .6, e.item.id, false, t);
    if (s) {
        Z5(e.item.id, e.angle);

        // Instantly place at all angles
        additionalAngles.forEach(angle => {
            C.add(v, e.x, e.y, angle, e.scale, null, x.list[e.item.id], !0, {
                sid: z.sid
            }, 0, 0, 1, 1, 0, 1);
        });

        return true;
    }

    return false;
}






















function Z5(e, t) {
    T.send("G", e, null);
    T.send("d", 1, t);
    T.send("G", y ? y : z.weaponIndex, true)
}

function e4(e, t) {
    if (!cs.checked || !Y || !en || x.list[z.items[4]]?.name != "pit trap" || !z.items[4] || gt) return;
    let s = Date.now();
    let o = 0;
    let n = L5(ly, 0, 0, W / ls.value);
    let i = L5(uy, 0, 0, W / ls.value);
    let r = J5(n, i, ss, s);
    Tn = Tn.filter(e => v - e.tick <= 6 && se(z, e) <= e.offset + 20);
    e = r.bestTrap;
    t = r.bestSpike;
    r.spikes.sort((e, t) => t.points - e.points);
    r.traps.sort((e, t) => t.points - e.points);
    if (!r.spikes.length && !r.traps.length) return;

    function a(n, i = r.spikes.concat(r.traps)) {
        i.filter(e => e.points > 0);
        if (He >= 85) return;
        if (!t && !e && !m.c) return;
        i = i.sort((e, t) => {
            if (t.points === e.points && e.name !== t.name) {
                return e.name === "pit trap" ? -1 : 1
            }
            return t.points - e.points
        });
        for (let t = 0; t < i.length; t++) {
            if (!n.some(e => S4(e, i[t]) <= e.scale + i[t].scale)) {
                n.push(i[t])
            }
            if (n.length === 4) break
        }
        for (let e = 0; e < n.length; e++) {
            if (!n[e].did) {
                if (n[e].preplace && n[e].placePriority && He <= 60) o++;
                $5(n[e], He <= 60 ? n[e].placePriority : 0, o, s);
                Tn.push({
                    ...n[e],
                    tick: v
                })
            }
        }
    }
    let l = [];
    if (t && t.points > 0 && (!e?.canPush || (!e?.retrap || !t.into))) {
        if (t.into) {
            m3(t.into.newPos)
        }
        if (t.placePriority) {
            if (t.preplace) {
                o++;
                setTimeout(() => {
                    c4(ly, t.angle);
                    Tn.push({
                        ...t,
                        tick: v
                    });
                    os.push(t)
                }, Mi - xt)
            } else {
                Z5(ly, t.angle);
                Tn.push({
                    ...t,
                    tick: v
                });
                os.push(t)
            }
            t.did = true;
            l.push(t);
            C.add(v, t.x, t.y, t.angle, t.scale, null, x.list[ly], !0, {
                sid: z.sid
            }, false, true, true, t.preplace)
        } else {
            $5(t, 0);
            Tn.push({
                ...t,
                tick: v
            });
            t.did = true;
            l.push(t)
        }
    }
    if (e && e.points > 0 && !(t && t.points > 0 && se(e, t) <= e.scale + t.scale && !kx(t)) || (e?.canPush || e?.retrap && !t.into)) {
        if (e.placePriority) {
            if (e.preplace) {
                o++;
                setTimeout(() => {
                    c4(uy, e.angle);
                    Tn.push({
                        ...e,
                        tick: v
                    });
                    os.push(e)
                }, Mi - xt)
            } else {
                Z5(uy, e.angle);
                Tn.push({
                    ...e,
                    tick: v
                });
                os.push(e)
            }
            e.did = true;
            l.push(e);
            C.add(v, e.x, e.y, e.angle, e.scale, null, x.list[uy], !0, {
                sid: z.sid
            }, false, true, true, e.preplace)
        } else {
            $5(e, 0);
            Tn.push({
                ...e,
                tick: v
            });
            e.did = true;
            l.push(e)
        }
    }
    a(l);
    if (kt.length >= 6) kt.pop();
    kt.unshift(Date.now() - tn)
}
let t4 = [];
const n4 = 5e3;

function i4(t) {
    const e = t4.find(e => e.message === t);
    if (e) {
        e.count++
    } else {
        t4.push({
            message: t,
            count: 1
        })
    }
    t4.forEach(e => {
        b(`${e.message} (${e.count})`, "", "#5c0620", false, true)
    });
    setTimeout(() => {
        t4 = t4.filter(e => e.count > 1)
    }, n4)
}
async function s4(e, t) {
    if (p || !en) return;
    e = bh.filter(e => e.health < x.weapons[ee].dmg * (Nn.includes(7) ? 1.5 : 1) * En[z.primaryVar] && e.visible);
    e = e.sort((e, t) => t.killScore - e.killScore)[0];
    if (e && se(z, e) - 1.8 * e.scale <= x.weapons[ee].range && z.pr == 1) {
        console.log(e);
        p = true;
        T.send("K", 1);
        g[0] = B(z, e);
        T.send("G", ee, true);
        I(7, 18);
        T.send("D", B(z, e), "client");
        await A4();
        p = false
    }
}

function o4(e, t, n) {
    if (t.weaponIndex != 11) return true;
    n = B(e, t);
    return X.getAngleDist(n + W, t.dir) > W / 3
}
async function r4() {
    Y3 = [];
    if (!(Cy >= 670 && Cy <= 700)) {
        T.send("a", B(z, nt), "client")
    } else {
        T.send("a", null, "client")
    }
    if (z.age < 9) U1.showText(z.x2, z.y2, 20, .18, 300, "age up first", "#fff");
    if (Cy >= 670 && Cy <= 700 && z.movSpd <= 5 && Y.movSpd <= 5 && hy != undefined && z.age >= 9) {
        console.log(Cy, "bow insta distance");
        if (x.list[hy].name == "platform") c4(hy, B(z, Y));
        await A4();
        I(53, 0);
        y = A;
        p = true;
        At = false;
        T.send("G", A, true);
        g[0] = B(z, Y);
        T.send("D", B(z, Y), "client");
        console.log(Cy);
        await A4();
        I(38, 0);
        y = A;
        g[0] = B(z, Y);
        T.send("H", 12);
        await A4();
        y = A;
        g[0] = B(z, Y);
        T.send("H", 15);
        await A4();
        y = null;
        p = false;
        At = false;
        ct = false
    }
}

function a4(e, t, n, i, s = [], o, r, a) {
    r = {
        ...e
    };
    if (e.sid == z.sid && n !== 0 && !n) {
        n = Dn
    } else if (Nt && e.sid == z.sid) {
        n = undefined
    } else if (!n && n !== 0) {
        n = e.movDir
    }
    a = l4(r, n);
    r.xVel = a.xVel;
    r.yVel = a.yVel;
    r.x2 = a.real.x;
    r.y2 = a.real.y;
    s.push(a);
    if (t - 1 <= 0) {
        return s
    } else {
        return a4(r, t - 1, n, r, s)
    }
}

function l4(e, t, n, i, s = 111) {
    if (!i) {
        if (e.sid == z.sid && t !== 0 && !t) {
            t = Dn
        } else if (Nt && e.sid == z.sid) {
            t = undefined
        } else if (!t && t !== 0) {
            t = e.movDir
        }
    }
    let o = U(t);
    let r = V(t);
    let a = D(o * o + r * r);
    a != 0 && (o /= a, r /= a);
    if (!n) n = e;
    let l = x4(n);
    e.speedXD = 0;
    e.speedYD = 0;
    e.predY = 0;
    e.predX = 0;
    o && (e.speedXD += o * .0016 * l * s);
    r && (e.speedYD += r * .0016 * l * s);
    var c = X.getDistance(0, 0, e.speedXD * s, e.speedYD * s),
        d = j(4, oe(1, H(c / 40))),
        u = 1 / d;
    e.speedXD && (e.predX += e.speedXD * s);
    e.speedYD && (e.predY += e.speedYD * s);
    let f = e.xVel * re(.993, s),
        h = e.yVel * re(.993, s),
        p = f + e.predX,
        m = h + e.predY,
        g = {
            x: e.x2 + p,
            y: e.y2 + m,
            type: "accel"
        },
        y = {
            x: e.x2 + f,
            y: e.y2 + h,
            type: "decel"
        },
        x = T(p, m, {
            x: e.x2 + p,
            y: e.y2 + m
        }),
        w = {
            x: e.x2,
            y: e.y2,
            type: "current"
        },
        b = {
            x: p,
            y: m,
            type: "nextVel"
        },
        v = g,
        k = H(D(p * p + m * m)),
        A = l,
        I, S;
    I = s * 1.5 * U(t);
    S = s * 1.5 * V(t);
    let E = {
        x: e.x2 + I,
        y: e.y2 + S
    };
    if (Xe[e.sid]?.np != undefined && e.sid != z.sid) v = se(e, Xe[e.sid]?.np?.accel) > se(e, Xe[e.sid]?.np?.decel) && Ay(e.movDir, e.pmovDir) <= .3 ? y : g;
    if (e.sid == z.sid) {
        if (Dn == undefined || Dn == null) {
            v = y
        } else {
            v = g
        }
    }

    function T(e, t, n, i, s) {
        if (isNaN(e) || isNaN(t)) return;
        try {
            i = e * r3;
            s = t * r3;
            if (e != i) {
                e = i;
                n.x += e
            }
            if (t != s) {
                t = s;
                n.y += t
            }
            if (e == i && t == s) {
                return {
                    x: n.x,
                    y: n.y,
                    type: "full decel"
                }
            } else {
                return T(e, t, n)
            }
        } catch (e) {}
    }
    let C = {
        accel: g,
        decel: y,
        boostCoords: E,
        boostVel: {
            x: I,
            y: S
        },
        nextVel: b,
        real: v,
        current: w,
        fullDecel: x,
        xVel: p,
        spd: l,
        yVel: m,
        vel: k
    };
    return C
}

function c4(e, t, n) {
    if (e == null || e == undefined || e == ry && z.food < x.list[ry].req[1] && !_n || !z.canBuild(x.list[e]) && e != ry || !en || e == ry && z.skinIndex == 45) return;
    !n && y ? n = y : n = z.weaponIndex;
    T.send("G", e, null);
    T.send("d", 1, t);
    T.send("G", n, n == n || n == A ? true : null)
}

function d4(e, t, n) {
    if (e == null || e == undefined || e == ry && z.food < x.list[ry].req[1] && !_n || !z.canBuild(x.list[e]) && e != ry || !en || e == ry && z.skinIndex == 45) return;
    !n && y ? n = y : n = z.weaponIndex;
    T.send("G", e);
    T.send("d", 1);
    T.send("G", n, n == n || n == A ? true : null)
}

function u4(e = z.health, t = [20, 40, 30]) {
    for (var n = e; n < 100; n += t[z.items[0]]) d4(z.items[0], true)
}

function f4(e, t) {
    let n = x.list[e];
    let i = 35 + n.scale + (n.placeOffset || 0);
    let s = z.x2 + U(t) * i;
    let o = z.y2 + V(t) * i;
    console.log("PLS");
    C.add(v, s, o, X.fixTo(P(o - z.y2, s - z.x2) || 0, 2), n.scale, null, x.list[n.id], !0, {
        sid: z.sid
    }, false, false, true, true)
}

function h4(e, t) {
    if (e == null || e == undefined || e == ry && z.food < x.list[ry].req[1] && !_n || !z.canBuild(x.list[e]) && e != ry || !en || e == ry && z.skinIndex == 45) return;
    !t && y ? t = y : t = z.weaponIndex;
    T.send("G", e);
    T.send("d", 1);
    T.send("G", t, t == t || t == A ? true : null)
}

function p4(e = 100 - z?.dmgpot?.hp, t = [20, 40, 30]) {
    for (var n = e; n < 100; n += t[z.items[0]]) h4(z.items[0], true)
}

function m4(e) {
    const t = ["th", "st", "nd", "rd"];
    const n = e % 10;
    const i = t[e % 100 > 10 && e % 100 < 20 ? 0 : n < 1 || n > 3 ? 0 : n];
    return e + i
}

function g4(e) {
    let t = 0;
    let n = e.loadout;
    if (n?.spawnpad || x.weapons[e?.secondary]?.age == 9 || n?.spike?.age == 9) return 9;
    n.utility && (t = 7);
    t < x.weapons[e?.secondary]?.age && (t = x.weapons[e?.secondary]?.age);
    t < x.weapons[e?.primary]?.age && (t = x.weapons[e?.primary]?.age);
    t < n?.spike?.age && (t = n.spike.age);
    t < n?.food?.age && (t = n.food.age);
    t < n?.windmill?.age && (t = n.windmill.age);
    t < n?.wall?.age && (t = n.wall.age);
    e?.weaponIndex == 0 && (t = 1);
    if (e?.primary == 0 && t > 1) e.primary = undefined;
    return t
}
const y4 = ce / 2;

function x4(t) {
    var e = ((t.buildIndex < 0) + 1) / 2 * (x.weapons[t.weaponIndex]?.spdMult || 1) * (t.skinIndex && C0.find(e => e.id == t.skinIndex)?.spdMult || 1) * (t.tailIndex && B0.find(e => e.id == t.tailIndex)?.spdMult || 1) * (t.y2 <= K.snowBiomeTop ? t.skinIndex && C0.find(e => e.id == t.skinIndex)?.coldM ? 1 : .75 : 1) * 1;
    !t.zIndex && t.y2 >= K.mapScale / 2 - K.riverWidth / 2 && t.y2 <= K.mapScale / 2 + K.riverWidth / 2 && (t.skinIndex && C0.find(e => e.id == t.skinIndex).watrImm ? e *= .75 : e *= .33);
    return e
}

function w4(t, e) {
    t = {
        buildIndex: t?.buildIndex ?? e?.buildIndex ?? -1,
        weaponIndex: t?.weaponIndex ?? e?.weaponIndex ?? null,
        skinIndex: t?.skinIndex ?? e?.skinIndex ?? null,
        tailIndex: t?.tailIndex ?? e?.tailIndex ?? null,
        y2: t?.y2 ?? e?.y2 ?? 0,
        zIndex: t?.zIndex ?? e?.zIndex ?? false
    };
    let n = ((t.buildIndex < 0) + 1) / 2 * (x.weapons[t.weaponIndex]?.spdMult || 1) * (t.skinIndex && C0.find(e => e.id == t.skinIndex)?.spdMult || 1) * (t.tailIndex && B0.find(e => e.id == t.tailIndex)?.spdMult || 1) * (t.y2 <= K.snowBiomeTop ? t.skinIndex && C0.find(e => e.id == t.skinIndex)?.coldM ? 1 : .75 : 1) * 1;
    if (!t.zIndex && t.y2 >= K.mapScale / 2 - K.riverWidth / 2 && t.y2 <= K.mapScale / 2 + K.riverWidth / 2) {
        const i = t.skinIndex && C0.find(e => e.id == t.skinIndex)?.watrImm ? .75 : .33;
        n *= i
    }
    return y4 * n
}

function b4(e, t) {
    let n = 0;
    let i = x.list[t];
    if (i.group.name == "mill") {
        e.windmill = i
    }
    if (i.group.name == "spikes") {
        e.spike = i
    }
    if (i.name == "boost pad") {
        e.trap = false
    }
    if (i.age == 7) {
        e.utility = i
    }
    if (i.group.name == "walls") {
        e.wall = i
    }
    if (i.group.name == "food") {
        e.food = i
    }
    if (i.name == "spawn pad") {
        e.spawnpad = true
    }
}

function v4(t, n) {
    let e = kh.find(e => e.name == "turret" && e.x == t && e.y == n);
    if (e) {
        e.time = 2200;
        e.NOW = false;
        e.shot = Date.now();
        return e
    }
    return false
}

function k4() {
    for (let t = 0; t < kh.length; t++) {
        let e = kh[t];
        if (e.name == "turret" && e?.time) e.time -= z.delta;
        if (e.name == "turret" && e?.time <= 0) e.time = 2200
    }
}

function A4() {
    return new Promise(e => {
        Ve[Ve.length] = e
    })
}

function I4() {
    if (document.activeElement.id === "") return true;
    return false
}

function S4(e, t) {
    return X.getDistance(e.x2 || e.x, e.y2 || e.y, t.x2 || t.x, t.y2 || t.y)
}

function se(e, t, n) {
    const i = n === "player" ? -1.8 * 35 : n === "object" ? -t?.scale : 0;
    return X.getDistance(e.x2 || e.x, e.y2 || e.y, t.x2 || t.x, t.y2 || t.y) + i
}
// Define player and autoBuy
let player = {};
let autoBuy = {
    hat: function () {
        console.log("Hat auto-purchased.");
    },
    acc: function () {
        console.log("Accessory auto-purchased.");
    }
};

