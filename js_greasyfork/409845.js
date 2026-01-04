// ==UserScript==
// @name         Better TPT
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  QoL changes for The Prestige Tree.
// @author       Yhvr
// @match        https://jacorb90.github.io/Prestige-Tree/index.html
// @match        http://despatpt.glitch.me
// @match        http://tptrespec.glitch.me
// @match        https://aarextiaokhiao.github.io/Prestige-Tree/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409845/Better%20TPT.user.js
// @updateURL https://update.greasyfork.org/scripts/409845/Better%20TPT.meta.js
// ==/UserScript==

// TOFIX: Unlocking new row when `darkTheme` is `false` doesn't invert that row's respec button
console.log(`!!! IMPORTANT !!!
If you think you've found a bug in the game, please disable Better TPT and make sure it occurs without it.
If you think you've found a bug in Better TPT, please disable Better TPT and make sure it only occurs with it.`);

addGlobalStyle(`
.btptButtons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
}

.btptWindowContainer {
    position: absolute;
    background-color: grey;
    transition: 0s;
    /* always last */
    z-index: 1000
}

.btptWindowContent {
    resize: both;
    overflow: auto;
    transition: 0s;
    min-width: 150px;
    width: 500px
}

.opt {
    margin-left: 0;
    margin-right: 0;
}

.back {
    position: sticky;
    right: calc(100% - 45px);
}
`)

// Mod detection

window.mod = null;

try {
    mod = modInfo.id
} catch (e) {
   console.info(`[BTPT] mod assignment failed, must be playing vanilla`)
}

// Keybinds!
/* const keydown = document.onkeydown
const PROPER_LAYERS = ["p", "b", "g", "sb", "t", "e", "s", "h", "q"]
document.onkeydown = e => {
    keydown(e)
    if (e.key === "ArrowLeft") player.tab = PROPER_LAYERS[PROPER_LAYERS.indexOf(player.tab) - 1 % PROPER_LAYERS.length]
    if (e.key === "ArrowRight") player.tab = PROPER_LAYERS[PROPER_LAYERS.indexOf(player.tab) + 1 % PROPER_LAYERS.length]
} */

// Init. alt fonts
let altFont = false;

// Themeing
let darkTheme = true;

const darkCSS = `
body {
    background-color: black;
    color: white;
}

${ mod === null ? `.s_txt, .ss_txt {
    color: white;
}` : ""}

.back {
    background-color: black;
    color: white;
}`

const lightCSS = `
body {
    background-color: white;
    color: black;
}

#points {
    color: black;
}

${ mod === null ? ` .s_txt, .ss_txt {
    color: black;
}` : ""}

.back {
    background-color: white;
    color: black;
}`

function toggleTheme(change = true) {
    if (change) darkTheme = !darkTheme;
    const el = document.getElementById("btpttheme");
    if (darkTheme) {
        if (el) el.innerHTML = darkCSS;
        else addGlobalStyle(darkCSS, "btpttheme");
        document.querySelectorAll("img").forEach(n => (n.style.filter = "invert(0%)"));
    } else {
        if (el) el.innerHTML = lightCSS;
        else addGlobalStyle(lightCSS, "btpttheme");
        document.querySelectorAll("img").forEach(n => (n.style.filter = "invert(100%)"));
    }
    if (player === undefined) {
        setTimeout(() => {
            drawTree();
            document.getElementById("optionWheel").onclick = newBTPTPrompt;
        }, 250)
    } else drawTree();
}

const customFont = `*{font-family:"JetBrains Mono", "Menlo", "monospace"}`;
const normalFont = `*{font-family:"Lucida Console", "Courier New", monospace}`

function toggleFont(change = true) {
    if (change) altFont = !altFont
    const el = document.getElementById("btptfont");
    if (altFont) {
        if (change) fontNotice();
        if (el) el.innerHTML = customFont;
        else addGlobalStyle(customFont, "btptfont");
    } else {
        if (el) el.innerHTML = normalFont;
        else addGlobalStyle(normalFont, "btptfont");
    }
}

function promptBuilder(name, func, height = 300, isFlex = false) {
    return () => {
        if (document.getElementById(`btpt${name}`)) document.getElementById(`btpt${name}`).remove();
        const el = document.createElement("div");
        const el2 = document.getElementById("btptmain") || document.body;
        el.classList.add("btptWindowContainer");
        el.style.left = `${el2.offsetLeft}px`;
        el.style.top = `${el2.offsetTop + el2.offsetHeight}px`;
        el.id = `btpt${name}`
        el.innerHTML = `${header(`btpt${name}`)}<h3${name}</h3>`;
        const el3 = document.createElement("div");
        el3.classList.add("btptWindowContent");
        el3.style.height = `${height}px`;
        if (isFlex) el3.classList.add("btptButtons");
        func(el3);
        el.appendChild(el3);
        document.body.appendChild(el);
        dragElement(document.getElementById(`btpt${name}`));
    }
}

const fontNotice = promptBuilder("notice", el => {
    el.innerHTML += "Enabled Alt. font! Please note, you'll need to manually" +
        " install JetBrains Mono. Find it here https://www.jetbrains.com/lp/mono/"
}, 100, true)

const stylePrompt = promptBuilder("styling", el => {
    el.appendChild(button("Change Theme", toggleTheme));
    el.appendChild(button("Change Font", toggleFont));
}, 150, true)

const autoBuyPrompt = promptBuilder("autobuy", el => {
    LAYERS.filter(n => Object.keys(LAYER_UPGS[n] || []).length > 2).map(n => {
        const btn = document.createElement("button");
        btn.classList.add("treeNode");
        btn.classList.add(n);
        btn.textContent = n.toUpperCase();
        btn.onclick = () => toggleAutobuyer(n);
        btn.id = `btptAutobuy${n}`;
        btn.classList.add(autobuy[n] ? "can" : "locked");
        return btn;
    }).forEach(n => el.appendChild(n));
})

function toggleAutobuyer(autobuyer) {
    autobuy[autobuyer] = !autobuy[autobuyer];
    if (autobuy[autobuyer]) {
        const btn = document.getElementById(`btptAutobuy${autobuyer}`);
        btn.classList.remove("locked");
        btn.classList.add("can");
    } else {
        const btn = document.getElementById(`btptAutobuy${autobuyer}`);
        btn.classList.remove("can");
        btn.classList.add("locked");
    }
}

const autoPrestigePrompt = promptBuilder("autoprestige", el => {
    LAYERS.filter(n => LAYER_TYPE[n] === "static").map(n => {
        const btn = document.createElement("button");
        btn.classList.add("treeNode");
        btn.classList.add(n);
        btn.textContent = n.toUpperCase();
        btn.onclick = () => toggleAutoPrestige(n);
        btn.id = `btptAutoPrestige${n}`;
        btn.classList.add(autoprestige[n] ? "can" : "locked");
        return btn;
    }).forEach(n => el.appendChild(n));
    document.body.appendChild(el);
})

function toggleAutoPrestige(n) {
    autoprestige[n] = !autoprestige[n];
    if (autoprestige[n]) {
        const btn = document.getElementById(`btptAutoPrestige${n}`)
        btn.classList.remove("locked")
        btn.classList.add("can")
    } else {
        const btn = document.getElementById(`btptAutoPrestige${n}`)
        if (!btn) return;
        btn.classList.remove("can")
        btn.classList.add("locked")
    }
}

const miscPrompt = promptBuilder("auto", el => {
    // TODO: Use switch instead?
    if (mod === null || mod === "default") {
        el.appendChild(button("Auto Enhance", () => (enhanceAuto = !enhanceAuto)));
        el.appendChild(button("Auto Capsule", () => (capsuleAuto = !capsuleAuto)));
    }
    if (mod === "dalt") {
        el.appendChild(button("No automation for DespaTPT... :(", () => {}))
    }
}, 150, true)

const infoPrompt = promptBuilder("info", el => {
    el.innerHTML += `
<h2>Better TPT</h2>
<h5>Version 1.1.5</h5>
<p>Made by Yhvr
<ul>
<li><a href="https://greasyfork.org/en/scripts/409845-better-tpt">GreasyFork</a></li>
<li><a href="https://discord.gg/cGuyHPG">Discord</a></li>
</ul></p>`
}, 150)

toggleOpt = (opt, text) => {
    player[opt] = !player[opt]
    const el = document.getElementById(opt)
    if (el) el.textContent = text(player[opt])
}

adjustMSDisp = () => {
    let displays = ["always", "automation", "incomplete", "never"];
    player.msDisplay = displays[(displays.indexOf(player.msDisplay) + 1) % displays.length]
    document.getElementById("msdisp").innerHTML = `Show Milestones: ${player.msDisplay.toUpperCase()}`
}

const optPrompt = promptBuilder("vanilla options", el => {
    el.appendChild(button("Save", save));
    el.appendChild(button("HARD RESET", hardReset))
    el.appendChild(button("Export", exportSave))
    el.appendChild(button("Import", importSave))
    el.appendChild(button(`Autosave: ${player.autosave ? "ON" : "OFF"}`, () => toggleOpt("autosave", bool => `Autosave: ${bool ? "ON" : "OFF"}`), "autosave"))
    el.appendChild(button(`Show Milestones: ${player.msDisplay.toUpperCase()}`, adjustMSDisp, "msdisp"))
}, 250, true)

drawTreeBranch = (a, b) => {
    let c = document.getElementById(a).getBoundingClientRect();
    let d = document.getElementById(b).getBoundingClientRect();
    let e = c.left + (c.width / 2) + (document.getElementById("treeTab").scrollLeft || document.body.scrollLeft);
    let f = c.top + (c.height / 2) + (document.getElementById("treeTab").scrollTop || document.body.scrollTop);
    let g = d.left + (d.width / 2) + (document.getElementById("treeTab").scrollLeft || document.body.scrollLeft);
    let h = d.top + (d.height / 2) + (document.getElementById("treeTab").scrollTop || document.body.scrollTop);
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.strokeStyle = darkTheme ? "white" : "black";
    ctx.moveTo(e, f);
    ctx.lineTo(g, h);
    ctx.stroke();
};

// HTML changing-upping
function button(text, click, id) {
    const btn = document.createElement("button");
    btn.classList.add("opt");
    btn.innerHTML = text;
    btn.onclick = click;
    if (id) btn.id = id;
    return btn;
}

function header(name) {
    const el = document.createElement("div");
    el.zIndex = "1000";
    el.padding = "10px";
    el.style.userSelect = "none";
    el.style.backgroundColor = "darkgrey";
    el.id = `${name}header`;
    el.style.transition = "0s";
    el.style.textTransform = "capitalize";
    el.style.overflow = "hidden";
    el.innerHTML = `${name.substr(4)}<button style="
        position: absolute;
        right: 0;
        background: none;
        color: red;
        border: none;
" onmousedown="this.parentElement.parentElement.remove()">x</button>`;
    return el.outerHTML;
}

function newBTPTPrompt() {
    if (document.getElementById("btptmain")) document.getElementById("btptmain").remove();
    const el = document.createElement("div")
    el.style.position = "absolute";
    el.style.backgroundColor = "grey";
    el.style.left = "0px";
    el.style.top = "0px";
    el.style.transition = "0s";
    el.id = "btptmain"
    el.innerHTML = header("btptmain");
    el.style.zIndex = "999";
    const el2 = document.createElement("div");
    el2.innerHTML = "<h3 style='display: block'>Better TPT</h3>"
    el2.style.resize = "both";
    el2.style.overflow = "auto";
    el2.style.transition = "0s";
    el2.style.width = "300px";
    el2.style.height = "250px";
    el2.appendChild(button("Auto Upgrades", autoBuyPrompt));
    el2.appendChild(button("Auto Prestige", autoPrestigePrompt));
    el2.appendChild(button("Misc. Automation", miscPrompt));
    el2.appendChild(button("Style Options", stylePrompt));
    el2.appendChild(button("Vanilla Options", optPrompt));
    el2.appendChild(button("About Better TPT", infoPrompt));
    el.appendChild(el2)
    document.body.appendChild(el);
    dragElement(document.getElementById("btptmain"));
}

showTab = name => {
    if (mod === "default") {
        if (LAYERS.includes(name) && !layerUnl(name)) return
    }
    else if (!TAB_REQS[name]()) return
    const bk = player.tab;
    player.tab = name
    if (mod === "default") {
        var toTreeTab = name == "tree"

        if (toTreeTab != onTreeTab) {
            document.getElementById("treeTab").className = toTreeTab ? "fullWidth" : "col left"
            onTreeTab = toTreeTab
            resizeCanvas()
        }

        delete player.notify[name]
    } else {
        if (name === "tree") {
            needCanvasUpdate = true;
        }
    }

    if (name === "options") {
        player.tab = bk;
        newBTPTPrompt();
        document.getElementById("optionWheel").onclick = newBTPTPrompt;
    }
    if (!darkTheme) {
        setTimeout(() => {
            document.querySelectorAll("img").forEach(n => (n.style.filter = "invert(100%)"))
        }, 0);
    }
    LAYERS.forEach(layer => {
        try {
            document.querySelector(`.${layer.toLowerCase()}`).oncontextmenu = e => {
                    e.preventDefault();
                    doReset(layer);
                }
        } catch (e) {}
    })
};

// Autobuy!
let capsuleAuto = false;
let enhanceAuto = false;
let autoprestige = {};
let autobuy = {};
const cache = {};

function buyAll(type) {
    if (!cache[type]) {
        if (!LAYER_UPGS[type]) return;
        cache[type] = Object.keys(LAYER_UPGS[type]).filter(n => Number(n) == n).map(Number);
    }
    cache[type].forEach(upg => buyUpg(type, upg));
}

clearInterval(interval);
interval = setInterval(() => {
    if (player === undefined || tmp === undefined) return;
	let diff = (Date.now() - player.time) / 1000
	if (offTime.remain > 0) {
		offTime.speed = offTime.remain / 5 + 1
		diff += offTime.speed/50
		offTime.remain = Math.max(offTime.remain - offTime.speed / 50, 0)
	}
	player.time = Date.now()
	if (needCanvasUpdate) resizeCanvas();
	updateTemp();
	gameLoop(new Decimal(diff))
    Object.keys(autoprestige).filter(n => autoprestige[n]).forEach(n => doReset(n));
    Object.keys(autobuy).filter(n => autobuy[n]).forEach(buyAll);
    if (capsuleAuto) buyExtCapsule();
    if (enhanceAuto) buyEnhancer();
}, 50);

setInterval(() => {
    localStorage.setItem("btpt", JSON.stringify({
        altFont, darkTheme, autobuy, autoprestige, capsuleAuto, enhanceAuto
    }));
}, 2500)

// Load, if it's there
const BTPTData = localStorage.getItem("btpt")
if (BTPTData) {
    const d = JSON.parse(BTPTData)
    if (d.altFont !== undefined) { altFont = d.altFont; toggleFont(false); }
    if (d.darkTheme !== undefined) { darkTheme = d.darkTheme; toggleTheme(false); }
    if (d.autoprestige !== undefined) autoprestige = d.autoprestige;
    if (d.autobuy !== undefined) autobuy = d.autobuy;
    if (d.capsuleAuto !== undefined) capsuleAuto = d.capsuleAuto;
    if (d.enhanceAuto !== undefined) enhanceAuto = d.enhanceAuto;
}

var zIndex = 1000;

// TAKEN FROM https://www.w3schools.com/howto/howto_js_draggable.asp

// Make the DIV element draggable:
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }
    elmnt.onclick = () => { zIndex++; elmnt.style.zIndex = zIndex; };

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        zIndex++;
        elmnt.style.zIndex = zIndex;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// https://stackoverflow.com/a/46285637/10637301

function addGlobalStyle(css, id) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    if (id) style.id = id;
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}
