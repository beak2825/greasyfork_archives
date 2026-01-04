// ==UserScript==
// @name         Astral Client
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Shift + Z
// @license      OSI
// @author       _x7333 on discord
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scenexe.io
// @match        https://scenexe2.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491605/Astral%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/491605/Astral%20Client.meta.js
// ==/UserScript==

!function() {
    "use strict";

console.log("%c Astral %c Client %c v1.6 %c by %c _x7333",
    "font-size: 24px; font-weight: bold; color: #691b70; background: #461c63; border-radius: 5px; padding: 5px;",
    "font-size: 24px; font-weight: bold; color: #461c63; background: #691b70; border-radius: 5px; padding: 5px;",
    "font-size: 15px; font-weight: bold; color: white; background: black; border-radius: 5px; padding: 5px;",
    "font-size: 15px; font-weight: bold; color: white; background: black; border-radius: 5px; padding: 5px;",
    "font-size: 15px; font-weight: 700; color: #9300a1; background: black; border-radius: 5px; padding: 5px;");
    GM_addStyle(`
        .n {
            z-index: 9999;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 5px 8px;
            border-radius: 10px;
            font-family: 'Roboto', sans-serif;
            font-size: 1.2em;
            font-weight: 700;
            margin-bottom: 3px;
            opacity: 0;
            transform: translateY(-20px);
            transition: transform 0.5s ease-out, opacity 0.5s ease-out;
        }
        .n.f-o {
            opacity: 0;
            transform: translateY(-20px);
        }
        .n-c {
            position: fixed;
            top: 8px;
            left: 50%;
            transform: translate(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .n-d {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    `);
const nc = document.createElement("div");
const nd = document.createElement("div");

nc.className = "n-c";
document.body.appendChild(nc);

nd.className = "n-d";
document.body.appendChild(nd);

function sN(e) {
    const t = document.createElement("div");
    t.className = "n";
    t.innerText = e.trim();
    nc.insertBefore(t, nc.firstChild);
    setTimeout(() => {
        t.style.transform = "translateY(0)";
        t.style.opacity = "1";
        setTimeout(() => {
            t.classList.add("f-o");
            setTimeout(() => {
                nc.removeChild(t);
            }, 500);
        }, 5000);
    }, 100);
}

let ks = [];
let t = new Date();
let sto;

function sE(e) {
    const t = document.createElement("div");
    t.className = "n";
    t.innerText = e.trim();
    t.style.top = "50%";
    t.style.left = "50%";
    t.style.transform = "translate(-50%, -50%)";
    t.style.zIndex = "9999";
    nd.insertBefore(t, nd.firstChild);
    setTimeout(() => {
        t.style.transform = "translateY(0)";
        t.style.opacity = "1";
        setTimeout(() => {
            t.classList.add("f-o");
            setTimeout(() => {
                nd.removeChild(t);
            }, 500);
        }, 5000);
    }, 100);
}

function a() {
}

let ac = false;
window.ac = window.ac || false;
document.addEventListener("mousedown", (function(e) {
    if (0 !== e.button || window.ac) return;
    a();
    window.ac = true;
}));

const ls = document.createElement('div');
ls.style.position = 'fixed';
ls.style.top = '0';
ls.style.left = '0';
ls.style.width = '100%';
ls.style.height = '100%';
ls.style.background = 'linear-gradient(to right, #55157d, #db0fb9)';
ls.style.color = 'white';
ls.style.display = 'flex';
ls.style.justifyContent = 'center';
ls.style.alignItems = 'center';
ls.style.zIndex = '9999';
ls.style.font = "'Lora', sans-serif";
ls.style.fontSize = '2em';
ls.style.fontWeight = "700";
ls.style.opacity = "1";
ls.style.transition = "opacity 1s linear";

const la = document.createElement('div');
la.style.width = '50px';
la.style.height = '50px';
la.style.border = '5px solid white';
la.style.borderTop = '5px solid transparent';
la.style.borderRadius = '50%';
la.style.animation = 'spin 1s linear infinite';

ls.appendChild(la);
ls.innerText = 'Loading Astral Client';
document.body.appendChild(ls);

setTimeout(() => {
    ls.style.opacity = "0";
}, 2000);
setTimeout(() => {
    document.body.removeChild(ls);
}, 5000);

function pn() {
    const message = prompt("Send Notification:");
    if (message) {
        sN(message);
    }
}


function cp() {
    const mp = document.createElement('div');
    mp.style.padding = '10px';
    mp.style.background = 'rgba(105, 27, 112, 0.2)';
    mp.style.color = 'black';
    mp.style.borderRadius = '5px';
    mp.style.border = '4px solid #461c63';
    mp.style.margin = '10px 0';

    const t = document.createElement('div');
    t.textContent = 'Music Player (NOT WORKING)';
    t.style.fontSize = '1.2em';
    t.style.fontWeight = 'bold';
    t.style.marginBottom = '10px';
    t.style.color = "black"
    mp.appendChild(t);

    const ui = document.createElement('input');
    ui.type = 'text';
    ui.style.padding = '10px';
    ui.style.background = 'rgba(105, 27, 112, 0.2)';
    ui.style.color = 'black';
    ui.style.borderRadius = '5px';
    ui.style.border = '4px solid #461c63';
    ui.placeholder = 'Enter audio URL';
    ui.style.marginRight = '10px';
    ui.style.setProperty('--placeholder-color', 'white');
    mp.appendChild(ui);

    const auc = document.createElement('div');
    auc.style.background = 'rgba(105, 27, 112, 0.2)';
    auc.style.color = 'black';
    auc.style.borderRadius = '5px';
    auc.style.border = '4px solid #461c63';
    auc.style.padding = '10px';
    auc.style.marginTop = '10px';
    mp.appendChild(auc);

    const au = document.createElement('audio');
    au.controls = true;
    auc.appendChild(au);

    ui.oninput = function() {
        au.src = ui.value;
    };

    return mp;
}

let iR = false;

function tc() {
    if (iR) {
        iR = false;
        return;
    }

    iR = true;

    let c = window.prompt('Input color (hex/color)');
    function cc() {
        var all = document.getElementsByTagName('*');
        for (var i = 0, max = all.length; i < max; i++) {
            if (all[i].textContent.trim() !== '') {
                all[i].style.color = c;
            }
        }
    }

    setInterval(cc, 1000);
}

function u() {
    const n = new Date();
    const e = n - window.performance.timing.navigationStart;
    const h = Math.floor(e / 3600000);
    const m = Math.floor((e % 3600000) / 60000);
    const s = Math.floor((e % 60000) / 1000);
    const p = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return p;
}

function cm() {
    let m = document.getElementById('m');
    if (!m) {
        m = document.createElement('div');
        m.id = 'm';
        m.style.position = 'fixed';
        m.style.top = '0';
        m.style.left = '0';
        m.style.width = '100%';
        m.style.height = '100%';
        m.style.background = 'transparent';
        m.style.display = 'flex';
        m.style.flexDirection = 'column';
        m.style.justifyContent = 'center';
        m.style.alignItems = 'center';
        m.style.zIndex = '9999';
        m.style.backdropFilter = 'blur(5px)';
        m.style.opacity = '0';
        m.style.transition = 'opacity 0.5s ease-in-out';

       const hc = document.createElement('div');
        hc.style.display = 'flex';
        hc.style.justifyContent = 'space-between';
        hc.style.width = '15.5%';

        const h = document.createElement('div');
        h.textContent = 'Astral';
        h.style.fontSize = '2em';
        h.style.fontWeight = '700';
        h.style.color = "#461c63";
        h.style.marginBottom = '20px';

        hc.appendChild(h);

        const h2 = document.createElement('div');
        h2.textContent = 'Client';
        h2.style.fontSize = '2em';
        h2.style.fontWeight = '700';
        h2.style.color = "#691b70";
        h2.style.marginBottom = '20px';
        hc.appendChild(h2);

        m.appendChild(hc);

        const c = document.createElement('div');
        c.style.width = '80%';
        c.style.height = '80%';
        c.style.overflowY = 'scroll';
        c.style.padding = '20px';
        c.style.background = 'rgba(105, 27, 112, 0.2)';
        c.style.borderColor = '#461c63';
        c.style.borderWidth = '4px';
        c.style.borderStyle = 'solid';
        c.style.borderRadius = '10px';
        m.appendChild(c);

        const mp = cp();
        c.appendChild(mp);

        const p = document.createElement('div');
        p.style.fontSize = '1.5em';
        p.style.background = 'rgba(105, 27, 112, 0.2)';
        p.style.color = 'black';
        p.style.borderRadius = '5px';
        p.style.borderColor = '#461c63';
        p.style.borderWidth = '4px';
        p.style.borderStyle = 'solid';
        p.style.padding = '10px';
        p.style.marginTop = '10px';
        p.style.color = '#fff';
        p.style.marginBottom = '20px';
        c.appendChild(p);

        setInterval(() => {
            p.textContent = `Playtime: ${u()}`;
            p.style.color = 'black'
        }, 1000);

        const b = document.createElement('button');
        b.textContent = 'Notification';
        b.onclick = pn;
        b.style.backgroundColor = 'rgba(105, 27, 112, 0.2)';
        b.style.color = 'black';
        b.style.border = '4px solid #461c63';
        b.style.padding = '10px 20px';
        b.style.fontSize = '1em';
        b.style.cursor = 'pointer';
        b.style.borderRadius = '5px';
        b.style.transition = 'background-color 0.3s ease';
        b.style.outline = 'none';
        b.style.margin = '0 10px 10px 0';
        c.appendChild(b);

        const t = document.createElement('button');
        t.textContent = 'Text Color';
        t.onclick = tc;
        t.style.backgroundColor = 'rgba(105, 27, 112, 0.2)';
        t.style.color = 'black';
        t.style.border = '4px solid #461c63';
        t.style.padding = '10px 20px';
        t.style.fontSize = '1em';
        t.style.cursor = 'pointer';
        t.style.borderRadius = '5px';
        t.style.transition = 'background-color 0.3s ease';
        t.style.outline = 'none';
        t.style.margin = '0 10px 10px 0';
        c.appendChild(t);

        m.style.opacity = '1';
        document.body.appendChild(m);
    } else {
        if (m.style.opacity === '1') {
            m.style.opacity = '0';
            document.body.style.overflow = 'auto';
            m.remove();
        } else {
            m.style.opacity = '1';
            document.body.style.overflow = 'hidden';
        }
    }
}


document.addEventListener('keydown', function(e) {
    if (e.shiftKey && e.key === 'z' || e.key === "Z") {
        const f = document.activeElement;
        const i = f.tagName === 'INPUT' || f.tagName === 'TEXTAREA' || f.tagName === 'SELECT';
        if (!i) {
            cm();
        }
    }
});

function am() {
    let m = document.getElementById('m');
    if (!m) {
        m = document.createElement('div');
        m.id = 'm';
        m.style.position = 'fixed';
        m.style.top = '0';
        m.style.left = '0';
        m.style.width = '100%';
        m.style.height = '100%';
        m.style.background = 'transparent';
        m.style.display = 'flex';
        m.style.flexDirection = 'column';
        m.style.justifyContent = 'center';
        m.style.alignItems = 'center';
        m.style.zIndex = '9999';
        m.style.backdropFilter = 'blur(5px)';
        m.style.opacity = '0';
        m.style.transition = 'opacity 0.5s ease-in-out';
        document.body.appendChild(m);
    }
    const mp = cp();
    m.appendChild(mp);
}

window.onload = function() {
            function replaceText(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.textContent = node.textContent.replace(/scenexe2\.io/g, 'Astral Client');
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    for (var i = 0; i < node.childNodes.length; i++) {
                        replaceText(node.childNodes[i]);
                    }
                }
            }
            replaceText(document.body);
        };
eval(`
const a = document.querySelectorAll("div#title");
a.forEach((t) => {
    t.textContent = "Astral Client";
});

const b = document.querySelectorAll("#serverSelect");
b.forEach((e) => {
    e.style.height = "125px";
    e.style.width = "400px";
});

const c = document.querySelectorAll("div#playMenu");
c.forEach((e) => {
    e.style.height = "50px";
    e.style.width = "400px";
});

const d = document.querySelectorAll("div#serverSelectLowerText");
d.forEach((e) => {
    e.textContent = "Astral Client";
});

const e = document.querySelectorAll("div#credits");
e.forEach((e) => {
    e.remove();
});

const f = document.querySelectorAll("div#featured");
f.forEach((e) => {
    e.remove();
});

const g = document.querySelectorAll("div#modals");
g.forEach((e) => {
    e.remove();
});

const i = document.querySelectorAll("div#discordButton");
i.forEach((e) => {
    e.remove();
});

const j = document.querySelectorAll("button#b3");
j.forEach((e) => {
    e.remove();
});

const k = document.querySelectorAll("button");
k.forEach((button) => {
    if (k.innerText === "ad") {
        k.remove();
    }
});

const l = document.querySelectorAll("button#b0");
l.forEach((e) => {
    e.remove();
});

function h() {
    const t = document.getElementById("-0"),
          e = document.getElementById("-1"),
          n = document.getElementById("-2");
    if (t && e && n) {
        t.style.opacity = "0.1";
        e.style.opacity = "0.1";
        n.style.opacity = "0.1";
    }
}
h();
`);
}();