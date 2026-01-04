// ==UserScript==
// @name         Bonk Speedrun Timer
// @version      3.0.1
// @author       Fury_101
// @description  Adds a speedrun timer.
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @license      GNU GPLv3
// @namespace    https://greasyfork.org/users/919958
// @downloadURL https://update.greasyfork.org/scripts/445721/Bonk%20Speedrun%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/445721/Bonk%20Speedrun%20Timer.meta.js
// ==/UserScript==

const container = document.createElement("div");
document.getElementById('pagecontainer').appendChild(container);
container.outerHTML = `
<div class="windowShadow" style="display: unset;" id="BST__container">
    <div class="newbonklobby_boxtop newbonklobby_boxtop_classic" id="BST__top" style="background-color: #009688;">
        BST
    </div>
	<div id="BST__timercontainer" style="text-align:center">
        <span class="BST__time" id="BST__currtime">00:00.00</span>
    </div>
    <div id="BST__container-btm">
	    <div class="newbonklobby_settings_button brownButton brownButton_classic buttonShadow" style="width:100%;" id="BST__hidetimer">
	    	Hide Timer
        </div>
        <div>
          <input type="range" id="BST__speed" name="BST__speed" step="0.1" min="0.5" max="1.5" value="1" oninput="this.nextElementSibling.value = this.value">
          <output>1</output>
          <label for="BST__speed">Speed</label>
        </div>
        <button id="BST__settings" style="padding: 0.2em;" class="brownButton brownButton_classic buttonShadow">
            <svg style="width: 1em; height: 1em;" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        </button>
        <button id="BST__clear" style="padding: 0.2em;" class="brownButton brownButton_classic buttonShadow">
            <svg style="width: 1em; height: 1em;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    </div>
</div>
`

document.getElementById("BST__hidetimer").addEventListener("click", (e) => {
    if (document.getElementById("BST__container").style.visibility === "hidden") {
        document.getElementById('BST__container').style.visibility = "inherit"; //shows the container
        document.getElementById("BST__container").style.height="auto";
        e.target.style.width='100%';
        e.target.innerHTML='Hide Timer';
        return;
    }
    document.getElementById("BST__container").style.height="30px"; //hides the container
    document.getElementById("BST__container").style.visibility = "hidden";
    e.target.style.width='25%';
    e.target.style.margin="0 auto";
    e.target.innerHTML='Show';
});

let BSTCSS = document.createElement('style');
BSTCSS.innerHTML = `
#BST__container {
    text-align: center;
    font-family: "futurept_b1";
    background-color: #cfd8cd;
    width: calc(35.2vw - 400px);
    min-width: 154px;
    max-width: 260px;
    position: absolute;
    height: auto;
    right: 1%;
    top: 60px;
    border-radius: 7px;
    transition: ease-in-out 100ms;
    z-index: 10;
}
.BST__time {
    height: 32px;
    line-height: 32px;
    font-size: 20px;
    display: block;
}
.BST__split {
    color: blue;
}
#BST__currtime {
    margin-bottom: calc(100px);
}
#BST__container-btm {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}
#BST__hidetimer {
    visibility: visible;
}
#BST__container label {
    width: 100%;
    text-align: center;
}
.BST__highlight {
    position: absolute;
    z-index: 10;
    border: 1px solid limegreen;
    background: rgba(50	205	50 / 0.1);
}
`
document.getElementsByTagName('head')[0].appendChild(BSTCSS);

window.BST = {};
window.BST.settings = false;
window.BST.drawing = {
    curr: false,
    el: null
};

const getRelPosition = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - Math.round(rect.left);
    const y = e.clientY - Math.round(rect.top);

    return {x, y}
}

const canvToBonkCoords = (x, y) => {
    return {x: x / window.BST.ppm / window.BST.scaleRatio, y: y / window.BST.ppm / window.BST.scaleRatio};
}

const bonkToCanvCoords = (x, y) => {
    return {x: x * window.BST.ppm * window.BST.scaleRatio, y: y * window.BST.ppm * window.BST.scaleRatio};
}

window.BST.splitZones = [];

document.getElementById("BST__settings").addEventListener("click", (e) => {
    if (!window.BST.ppm) return;
    window.BST.settings = !window.BST.settings;
});

document.getElementById("BST__clear").addEventListener("click", (e) => {
    window.BST.splitZones = [];
    [...document.querySelectorAll(".BST__highlight")].forEach(e => e.remove());
    localStorage.setObject("BST__splitZones", window.BST.splitZones);
});

const createHighlight = (x, y) => {
    const highlight = document.createElement("div");
    highlight.classList.add("BST__highlight");
    document.getElementById("bonkiocontainer").appendChild(highlight);

    highlight.style.top = y + 'px';
    highlight.style.left = x + 'px';

    return highlight;
}

document.getElementById("bonkiocontainer").addEventListener("mousedown", (e) => {
    if (!window.BST.settings) return;

    const {x, y} = getRelPosition(e);

    const highlight = createHighlight(x, y);

    window.BST.drawing = {
        curr: true,
        el: highlight
    };
});

document.getElementById("bonkiocontainer").addEventListener("mousemove", (e) => {
    if (!window.BST.settings || !window.BST.drawing.curr) return;

    const {x, y} = getRelPosition(e);

    const el = window.BST.drawing.el;
    el.style.width = Math.abs(x - Number(el.style.left.slice(0, -2))) + 'px';
    el.style.height = Math.abs(y - Number(el.style.top.slice(0, -2))) + 'px';

    const flipX = x - Number(el.style.left.slice(0, -2)) < 0;
    const flipY = y - Number(el.style.top.slice(0, -2)) < 0;

    if (flipX && flipY)
        el.style.transform = "translateX(-100%) translateY(-100%)";
    else if (flipX)
        el.style.transform = "translateX(-100%)";
    else if (flipY)
        el.style.transform = "translateY(-100%)";
    else
        el.style.transform = "";
});

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

document.getElementById("bonkiocontainer").addEventListener("mouseup", (e) => {
    if (window.BST.drawing.curr) {
        const el = window.BST.drawing.el;
        if (!window.BST.splitZones)
            window.BST.splitZones = [];

        window.BST.splitZones.push({
            bonk: {
                p1: canvToBonkCoords(Number(el.style.left.slice(0, -2)), Number(el.style.top.slice(0, -2))),
                p2: canvToBonkCoords(getRelPosition(e).x, getRelPosition(e).y),
            },
            canv: {
                p1: {x: Number(el.style.left.slice(0, -2)), y: Number(el.style.top.slice(0, -2))},
                p2: getRelPosition(e)
            }
        });

        localStorage.setObject("BST__splitZones", window.BST.splitZones);
    }

    window.BST.drawing = {
        curr: false,
        el: null
    };
});

const credit = document.getElementById("ingamemapcredit");
const countdown = document.getElementById("ingamecountdown");
const winner = document.getElementById("ingamewinner");
const lobby = document.getElementById("newbonklobby");
const config = {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["style"]
}

window.BST.startTime = null;
window.BST.timerStarted = false;

const startObserver = new MutationObserver(mutationList => { //checks if the countdown or map credit screen goes away
    for (const mutation of mutationList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            if (mutation.target.style.visibility === "hidden" && mutation.oldValue.search("visibility: inherit") !== -1) {
                console.log("START TIMER");
                [...document.querySelectorAll(".BST__split")].map(e => {e.remove()});
                window.BST.startTime = Date.now();
                window.BST.timerStarted = true;
                break;
            }
        }
    }
});

startObserver.observe(countdown, config);
startObserver.observe(credit, config);

const endObserver = new MutationObserver(mutationList => { //checks if the winning screen shows up
    for (const mutation of mutationList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style' && window.BST.timerStarted) {
            if (mutation.target.style.visibility === "inherit" && mutation.oldValue.search("visibility: hidden") !== -1) {
                console.log("END TIMER");
                window.BST.timerStarted = false;
                console.log(`FINAL TIME: ${Date.now() - window.BST.startTime}`);
            }
        }
    }
});

endObserver.observe(winner, config);

const checkObserver = new MutationObserver(mutationList => { //checks if the lobby shows up as a precaution
    for (const mutation of mutationList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style' && window.BST.timerStarted) {
            if (mutation.target.style.display === "block" && mutation.oldValue.search("display: none;") !== -1) {
                console.log("END TIMER");
                window.BST.timerStarted = false;
                console.log(`FINAL TIME: ${Date.now() - window.BST.startTime}`);
            }
        }
    }
});

checkObserver.observe(lobby, config);

window.BST.splitFunc = () => {
    const now = new Date(Date.now() - window.BST.startTime)
    const span = document.createElement("span");
    span.innerText = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(2, '0')}`;
    span.classList.add("BST__time", "BST__split");
    document.getElementById("BST__timercontainer").insertBefore(span, document.getElementById("BST__currtime"));
}

window.onload = e => {
    /*
    const oldnow = Date.now;
    Date.now = function() {
        return oldnow(...arguments)/2;
    }
    */

    Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    }

    const zones = localStorage.getObject("BST__splitZones");
    window.BST.splitZones = zones ?? [];

    if (zones) {
        for (const el of zones) {
            console.log(el);
            const highlight = createHighlight(el.canv.p1.x, el.canv.p1.y);

            highlight.style.width = Math.abs(el.canv.p2.x - el.canv.p1.x) + 'px';
            highlight.style.height = Math.abs(el.canv.p2.y - el.canv.p1.y) + 'px';

            const flipX = el.canv.p2.x - el.canv.p1.x < 0;
            const flipY = el.canv.p2.y - el.canv.p1.y < 0;

            if (flipX && flipY)
                highlight.style.transform = "translateX(-100%) translateY(-100%)";
            else if (flipX)
                highlight.style.transform = "translateX(-100%)";
            else if (flipY)
                highlight.style.transform = "translateY(-100%)";
            else
                highlight.style.transform = "";
        }
    }

    parent.document.getElementById("adboxverticalCurse").style.zIndex = -10; //put bonk container above ads

    document.addEventListener("keydown", e => {
        if (e.target.nodeName === "INPUT") return; //if in chat
        if (e.key === "r") //restart macro
            document.getElementById("hostPlayerMenuRestartButton").click();
        if (e.key === "t" && window.BST.timerStarted) //split macro
            window.BST.splitFunc();
    });
}

function injector(src){
    let newSrc = src;

    const pos = { //parkour floors grapple
        "x": 59.05781006338773,
        "y": 5.872289248091114
    }

    window.BST.inSplitZone = false;
    const replacements = [
        { //updates timer every frame and checks split zone
            position: "{V6D[67][h1k[9][1121]][h1k[9][1660]]();}",
            value: `
                if (window?.BST.timerStarted) {
                    const now = new Date(Date.now() - window.BST.startTime);
                    document.getElementById("BST__currtime").innerText = \`\${now.getMinutes().toString().padStart(2, "0")}:\${now.getSeconds().toString().padStart(2, "0")}.\${now.getMilliseconds().toString().padStart(2, "0")}\`;
                }
                const x = window.BST.discs?.[window.BST.playerIndex?.getLSID()]?.body.m_xf.position.x;
                const y = window.BST.discs?.[window.BST.playerIndex?.getLSID()]?.body.m_xf.position.y;
                let flag = false;
                for (const zone of window.BST.splitZones) {
                    let p1 = {};
                    let p2 = {};
                    p1.x = Math.min(zone.bonk.p1.x, zone.bonk.p2.x);
                    p1.y = Math.min(zone.bonk.p1.y, zone.bonk.p2.y);
                    p2.x = Math.max(zone.bonk.p1.x, zone.bonk.p2.x);
                    p2.y = Math.max(zone.bonk.p1.y, zone.bonk.p2.y);
                    /*
                    console.table({
                        p1,
                        p2,
                        pos: {
                            x,
                            y
                        }
                    })
                    */
                    if (x > p1.x && x < p2.x && y > p1.y && y < p2.y) {
                        if (!window.BST.wasInSplitZone)
                            window.BST.splitFunc();
                        flag = true;
                    }
                }
                window.BST.wasInSplitZone = flag;
            `
        },
        { //sets speed according to slider in step function
            position: "Q[V6D[3][129]][V6D[3][128]]=function(h4w,d5Z,y9B,l4e,l1V,N69,j0P,H9G){",
            value: `
                arguments[3] = 30 / document.getElementById("BST__speed").value;
            `
        },
        { //finds ppm in step function
            position: `Q[N4X[8][131]]={discs:N4X[4],shakeVectorThisStep:N4X[22],soundsThisStep:N4X[12],capEvent:l5,teamGoalEvent:x6,inputState:N4X[0][0],gameSettings:N4X[0][4],swingCollideDestroyEvents:N4X[17]};`,
            value: `
                if (!window.BST)
                    window.BST = {};
                window.BST.ppm = Q[N4X[8][131]].gameSettings.map?.physics.ppm;
            `
        },
        { //finds scaleratio in graphics class
            position: `render(e46,b2Y,H0o,k3r,i8X,v4$) {`,
            value: `
                window.BST.scaleRatio = this.scaleRatio;
            `
        },
        { //finds discs array
            position: "Q[N4X[8][131]]={discs:N4X[4],shakeVectorThisStep:N4X[22],soundsThisStep:N4X[12],capEvent:l5,teamGoalEvent:x6,inputState:N4X[0][0],gameSettings:N4X[0][4],swingCollideDestroyEvents:N4X[17]};",
            value: `window.BST.discs=Q[N4X[8][131]].discs;`,
        },
        { //find local player id with netengine
            position: RegExp(`${/else ?{if\(([^)]+?)\){\1\[([^,]+?)\]\([^;]+?\)(;\1\[\2\]\([^;]*?\)){5}[^}]*\+ ?([^;]*)\[0\] ?\+/.exec(src)[1].replace(/([[\]])/g, "\\$1")}=new [^(]+?\\(([^,]*?),([^,]*?),[^)]+?\\);`).exec(src)[0],
            value: `window.BST.playerIndex = ${RegExp(`${/else ?{if\(([^)]+?)\){\1\[([^,]+?)\]\([^;]+?\)(;\1\[\2\]\([^;]*?\)){5}[^}]*\+ ?([^;]*)\[0\] ?\+/.exec(src)[1].replace(/([[\]])/g, "\\$1")}=new [^(]+?\\(([^,]*?),([^,]*?),[^)]+?\\);`).exec(src)[1]};`,
        }
    ]

    replacements.forEach(e => {
        const prev = newSrc;
        newSrc = newSrc.replace(e.position, e.position + e.value.toString());
        if(newSrc === prev) {
            console.groupCollapsed("Debug Info:");
            console.log("Position: " + e.position);
            console.log("Value: " + e.value);
            console.groupEnd();
            throw "Injection failed!";
        }
    });


    console.log("Bonk Speedrun Timer injector run");
    return newSrc;
}

// Compatibility with Excigma's code injector userscript
if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
    try {
        return injector(bonkCode);
    } catch (error) {
        alert(`Whoops! Bonk Speedrun Timer was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
Bonk Speedrun Timer`);
        throw error;
    }
});

console.log("Bonk Speedrun Timer injector loaded");