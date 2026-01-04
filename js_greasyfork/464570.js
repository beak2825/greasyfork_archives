// ==UserScript==
// @name         csgoc simple tools
// @namespace    http://tampermonkey.net/
// @version      v0.2.1
// @description  Basic management tools to work alongside other scripts
// @author       sdoma/Ana
// @license      MIT
// @match        https://csgoclicker.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csgoclicker.net
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// @downloadURL https://update.greasyfork.org/scripts/464570/csgoc%20simple%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/464570/csgoc%20simple%20tools.meta.js
// ==/UserScript==

var dupeloaded = false;
var failed = true;

var ratelimit = 27500;
var idlist = []

function barren() {
    let barren = document.createElement('div')
    barren.style.zIndex = "9999999999999999999999999";
    barren.style.width = "100%";
    barren.style.height = "100%";
    barren.style.top = "0";
    barren.style.backgroundColor = "black"
    barren.style.position = "Absolute";
    barren.style.display = "flex";
    barren.style.alignItems = "center";
    document.body.append(barren);

    let barrentext = document.createElement('h1')
    barrentext.style.width = "100%";
    barrentext.style.textAlign = "Center";
    barrentext.style.fontFamily = "monospace";
    barrentext.innerHTML = "An error occurred:<br>Socket connection failed.<br>Socket connection is required for duping, fast-opening, and socket-selling.<br><br>Please press ctrl+F5 or disable the simpletools script."
    barrentext.style.margin = "0";
    barrentext.style.fontSize = "30px";
    barrentext.style.color = "blue";
    barren.append(barrentext);
}

const originalLog = console.log;
console.log = function () {
    originalLog.apply(console, arguments);
    const message = Array.from(arguments).join(' ');
    if (message.includes('aspects fast-dupe loaded.')) {
        failed = false;
    }
};

(async function () {

    function getitemprice(st, p, s, r, f) {
        var floatname = ''
        if (f < 0) {
            floatname = ''
        } else if (f <= 0.07) {
            floatname = ' (Factory New)'
        } else if (f <= 0.15) {
            floatname = ' (Minimal Wear)'
        } else if (f <= 0.37) {
            floatname = ' (Field-Tested)'
        } else if (f <= 0.44) {
            floatname = ' (Well-Worn)'
        } else if (f <= 1) {
            floatname = ' (Battle-Scarred)'
        }
        return window.PriceList[((r == 'gold') ? '★ ' : '') + ((st) ? 'StatTrak™ ' : '') + p + ((s !== "Vanilla") ? " | " + s : '') + floatname]
    }
    window.sockets = [];
    const nativeWebSocket = window.WebSocket;
    window.WebSocket = function (...args) {
        const socket = new nativeWebSocket(...args);
        socket.addEventListener("message", (event) => {
            if (!event.data.slice(0, 4) === "probe") {
                var ed = JSON.parse(event.data.slice(2))
                console.log(ed)
            }
        });
        sockets.push(socket);
        if (!window.sellunder) {
            console.log("sdoma's socket-sell loaded.")
            window.sellunder = async function () {
                if (!window.sockets[0]) return console.warn("Socket was not hooked.")
                var res = await fetch('https://api.csgoclicker.net/v1/profile', { credentials: 'include' })
                var profileData = await res.json()
                var mostExpensive = { id: "", val: 0 }
                profileData.inventory.forEach(item => {
                    var p = getitemprice(item.stattrak, item.primaryName, item.secondaryName, item.rarity, item.float)
                    if (p < storage.sprice) {
                        console.log(item.primaryName + " | " + item.secondaryName + " => with value of $" + p + " was sold.");
                        idlist.push(item.id)
                    }
                    sockets[0].send(`42` + JSON.stringify(["sell item", [idlist]]))
                })
            }
        }
        return socket;
    };
})();

(async function () {

    setTimeout(() => {
        if (failed) {
            barren();
        } else {
            console.log("Socket connected!")
        }
    }, 1000)

    function getitemprice(st, p, s, r, f) {
        var floatname = ''
        if (f < 0) {
            floatname = ''
        } else if (f <= 0.07) {
            floatname = ' (Factory New)'
        } else if (f <= 0.15) {
            floatname = ' (Minimal Wear)'
        } else if (f <= 0.37) {
            floatname = ' (Field-Tested)'
        } else if (f <= 0.44) {
            floatname = ' (Well-Worn)'
        } else if (f <= 1) {
            floatname = ' (Battle-Scarred)'
        }
        return window.PriceList[((r == 'gold') ? '★ ' : '') + ((st) ? 'StatTrak™ ' : '') + p + ((s !== "Vanilla") ? " | " + s : '') + floatname]
    }
    window.sockets = [];
    const nativeWebSocket = window.WebSocket;
    window.WebSocket = function (...args) {
        const socket = new nativeWebSocket(...args);
        socket.addEventListener("message", (event) => {
            if (!event.data.slice(0, 4) === "probe") {
                var ed = JSON.parse(event.data.slice(2))
                console.log(ed)
            }
        });
        sockets.push(socket);
        dupeloaded = true;
        if (!window.dupeHighestItem) {
            console.log("aspects fast-dupe loaded.")
            window.dupeHighestItem = async function () {
                if (!window.sockets[0]) return console.warn("Socket was not hooked.")
                var res = await fetch('https://api.csgoclicker.net/v1/profile', { credentials: 'include' })
                var profileData = await res.json()
                var mostExpensive = { id: "", val: 0 }
                profileData.inventory.forEach(item => {
                    var p = getitemprice(item.stattrak, item.primaryName, item.secondaryName, item.rarity, item.float)
                    if (p > mostExpensive.val && !item.primaryName.includes("AK-")) {
                        mostExpensive.id = item.id
                        mostExpensive.val = p
                    }
                })
                var loopTimes = 10
                for (var i = 0; i < loopTimes; i++) {
                    sockets[0].send(`42` + JSON.stringify(["create coinflip", { itemIDs: [mostExpensive.id, mostExpensive.id], side: 1 }]))
                }
            }
        }
        return socket;
    };
})();

(function () {
    window.s = [];
    const n = window.WebSocket;
    window.WebSocket = function (...a) {
        const x = new n(...a);
        x.addEventListener("message", (e) => {
            if (!e.data.slice(0, 4) === "probe") {
                const z = JSON.parse(e.data.slice(2));
                console.log(z);
            }
        });
        x.d = function (y) {
            x.send(`42${JSON.stringify(y)}`);
        };
        window.s.push(x);
        return x;
    };

    setInterval(() => {

        if (storage.fopen) {
            for (let i = 0; i < 10; i++) {
                s[0].d(["open case", storage.fcase]);
                console.log("Opening: " + storage.fcase);
            }
            sellunder();
        }

    }, ratelimit);
})();

var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "https://fonts.googleapis.com/css2?family=Rubik&display=swap";

var head = document.getElementsByTagName("head")[0];
head.appendChild(link);

const boldChars = {
    'a': '𝗮',
    'b': '𝗯',
    'c': '𝗰',
    'd': '𝗱',
    'e': '𝗲',
    'f': '𝗳',
    'g': '𝗴',
    'h': '𝗵',
    'i': '𝗶',
    'j': '𝗷',
    'k': '𝗸',
    'l': '𝗹',
    'm': '𝗺',
    'n': '𝗻',
    'o': '𝗼',
    'p': '𝗽',
    'q': '𝗾',
    'r': '𝗿',
    's': '𝘀',
    't': '𝘁',
    'u': '𝘂',
    'v': '𝘃',
    'w': '𝘄',
    'x': '𝘅',
    'y': '𝘆',
    'z': '𝘇',
    'A': '𝗔',
    'B': '𝗕',
    'C': '𝗖',
    'D': '𝗗',
    'E': '𝗘',
    'F': '𝗙',
    'G': '𝗚',
    'H': '𝗛',
    'I': '𝗜',
    'J': '𝗝',
    'K': '𝗞',
    'L': '𝗟',
    'M': '𝗠',
    'N': '𝗡',
    'O': '𝗢',
    'P': '𝗣',
    'Q': '𝗤',
    'R': '𝗥',
    'S': '𝗦',
    'T': '𝗧',
    'U': '𝗨',
    'V': '𝗩',
    'W': '𝗪',
    'X': '𝗫',
    'Y': '𝗬',
    'Z': '𝗭',
};

const pane = new Tweakpane.Pane({ title: "SimpleTools", expanded: false });
pane.element.parentElement.style.zIndex = "100000";
pane.element.parentElement.style.paddingRight = "375px";
pane.element.parentElement.style.paddingTop = "10px";
pane.element.parentElement.style.width = "410px";
pane.element.style.fontFamily = 'Rubik, sans-serif';

var styleElement = document.createElement('style');
styleElement.textContent = '.message:not(:first-child) .timestamp { display: none; }';
document.head.appendChild(styleElement);

var style = document.createElement('style');
style.innerHTML = `:root {
    --tp-base-background-color: hsla(230, 20%, 11%, 1.00);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
    --tp-button-background-color: hsla(230, 26%, 50%, 1.00);
    --tp-button-background-color-active: hsla(231, 26%, 65%, 1.00);
    --tp-button-background-color-focus: hsla(230, 26%, 60%, 1.00);
    --tp-button-background-color-hover: hsla(230, 26%, 55%, 1.00);
    --tp-button-foreground-color: hsla(230, 20%, 11%, 1.00);
    --tp-container-background-color: hsla(230, 25%, 16%, 1.00);
    --tp-container-background-color-active: hsla(230, 25%, 31%, 1.00);
    --tp-container-background-color-focus: hsla(230, 25%, 26%, 1.00);
    --tp-container-background-color-hover: hsla(230, 25%, 21%, 1.00);
    --tp-container-foreground-color: hsla(230, 10%, 80%, 1.00);
    --tp-groove-foreground-color: hsla(230, 20%, 8%, 1.00);
    --tp-input-background-color: hsla(230, 20%, 8%, 1.00);
    --tp-input-background-color-active: hsla(230, 28%, 23%, 1.00);
    --tp-input-background-color-focus: hsla(230, 28%, 18%, 1.00);
    --tp-input-background-color-hover: hsla(230, 20%, 13%, 1.00);
    --tp-input-foreground-color: hsla(230, 10%, 80%, 1.00);
    --tp-label-foreground-color: hsla(230, 12%, 48%, 1.00);
    --tp-monitor-background-color: hsla(230, 20%, 8%, 1.00);
    --tp-monitor-foreground-color: hsla(230, 12%, 48%, 1.00);
  }`;
document.body.append(style);

const params = {
    'Sell Price': 100,
    'Custom Case': '"Clutch Case"'
}

var storage = {
    sprice: 100,
    bchat: false,
    schat: 13,
    wreel: false,
    mdupe: false,
    bgold: false,
    bname: false,
    ttime: false,
    fopen: false,
    fcase: "Clutch Case",
    aubuy: true,
}

function sell() {
    let sellToggle = document.getElementsByClassName('sellToggle')[0];
    if (!sellToggle.classList.contains('on')) {
        sellToggle.click();
    }
    let skinlist = document.querySelectorAll('.invItem');
    skinlist.forEach(function (skin) {
        let price = skin.querySelector('.price').innerHTML.replace("$", '');
        price = price.includes(",") ? price.replace(",", ".") : price;
        if (price < storage.sprice) {
            skin.click();
        }
    });
    document.getElementsByClassName('sellItemsButton')[0].click();
    sellToggle.click();
}

const invpane = pane.addFolder({
    title: 'Inventory Options',
    expanded: false
});

const sellval = invpane.addInput(
    params, 'Sell Price'
).on('change', (e) => {
    storage.sprice = e.value;
})

pane.addSeparator();

const sellbtn = invpane.addButton({
    title: 'sell'
}).on('click', (e) => {
    sell(storage.sprice);
})

invpane.addSeparator();

const maxdupe = invpane.addInput(storage, "mdupe", {
    label: "Max Dupe",
    type: "checkbox",
}).on("change", () => {
    console.log(storage.mdupe);
})

const dupebtn = invpane.addButton({
    title: 'dupe'
}).on('click', (e) => {
    if (!storage.mdupe) { dupeHighestItem(); return; };
    if (storage.mdupe) {
        for (let i = 0; i < 20; i++) {
            dupeHighestItem();
        }
        return;
    }
})

const chatpane = pane.addFolder({
    title: 'Chat Options',
    expanded: false
});

const boldchat = chatpane.addInput(storage, "bchat", {
    label: "Bold Typing",
    type: "checkbox",
}).on("change", () => {
    console.log(storage.bchat);
})

const toptimestamp = chatpane.addInput(storage, "ttime", {
    label: "Top Timestamp",
    type: "checkbox",
}).on("change", () => {
    console.log("TTIME CLICK")
    if (storage.ttime) {
        console.log("TOP")
        let messageBodies = document.querySelectorAll('.messageBody')
        for (let i = 0; i < messageBodies.length; i++) {
            messageBodies[i].style.fontSize = storage.schat + "px";
            let parentElement = messageBodies[i].parentNode;
            let timestampElement = parentElement.querySelector('.timestamp');
            timestampElement.style.position = "relative";
            timestampElement.style.top = "-27.5px";
        }
    } else {
        console.log("NORMAL")
        let messageBodies = document.querySelectorAll('.messageBody')
        for (let i = 0; i < messageBodies.length; i++) {
            messageBodies[i].style.fontSize = storage.schat + "px";
            let parentElement = messageBodies[i].parentNode;
            let timestampElement = parentElement.querySelector('.timestamp');
            timestampElement.style.position = "relative";
            timestampElement.style.top = "0px";
        }
    }
})

const sizeslide = chatpane.addBlade({
    view: 'slider',
    label: 'Chat Size',
    min: 1,
    max: 26,
    value: 13,
    step: 1,
}).on("change", (e) => {
    storage.schat = Math.round(e.value);
    console.log(Math.round(e.value) + "|" + storage.schat);
    let messageBodies = document.querySelectorAll('.messageBody')
    for (let i = 0; i < messageBodies.length; i++) {
        messageBodies[i].style.fontSize = storage.schat + "px";
        let parentElement = messageBodies[i].parentNode;
        let timestampElement = parentElement.querySelector('.timestamp');
        timestampElement.style.position = "relative";
        timestampElement.style.top = "-27.5px";
    }
});

pane.addSeparator();

const uipane = pane.addFolder({
    title: 'UI Options',
    expanded: false
});

const bluegolds = uipane.addInput(storage, "bgold", {
    label: "Blue Golds",
    type: "checkbox",
}).on("change", () => {
    goldstyle(storage.bgold);
})

const bluename = uipane.addInput(storage, "bname", {
    label: "Blue Namebar",
    type: "checkbox",
}).on("change", () => {
    storage.bname ? loadStyles(false) : unloadStyles();
})

pane.addSeparator();

const casepane = pane.addFolder({
    title: 'Unboxing',
    expanded: false
});

const caselist = casepane.addBlade({
    view: 'list',
    label: 'Case',
    options: [
        { text: 'Clutch', value: 'Clutch Case' },
        { text: 'Glove', value: 'Glove Case' },
        { text: 'Bravo', value: 'Operation Bravo Case' },
        { text: 'Weapon 1', value: 'CS:GO Weapon Case' },
        { text: 'Custom', value: 'Custom' },
    ],
    value: 'Clutch Case',
}).on("change", (e) => {
    console.log(e.value);
    storage.fcase = e.value;
    params["Custom Case"] = `${e.value}`;
    ucase.refresh();
    if (e.value == "Custom") {
        ucase.disabled = false;
    } else {
        ucase.disabled = true;
    }
})


const ucase = casepane.addInput(params, 'Custom Case', { disabled: true }).on('change', (e) => {
    console.log(params["Custom Case"])
    storage.fcase = params["Custom Case"];
});

const fastopen = casepane.addInput(storage, "fopen", {
    label: "Quick Unbox",
    type: "checkbox",
})

const autobuy = casepane.addInput(storage, "aubuy", {
    label: "Auto Buy",
    type: "checkbox",
})

pane.addSeparator();

const credpane = pane.addFolder({
    title: 'Credits',
    expanded: false
});

const creatorbtn = credpane.addButton({
    title: 'sdoma/Ana',
    label: 'Created By'
})

const thanksbtn1 = credpane.addButton({
    title: 'Aspect/Preston',
    label: 'With help from'
})

const thanksbtn2 = credpane.addButton({
    title: 'WS | Mute',
    label: 'And a shoutout to'
})

var gstyle = document.createElement("style");

function goldstyle(x) {
    console.log("gold styling called.")
    if (x) {
        console.log("blue golds")
        var head = document.getElementsByTagName("head")[0];

        gstyle.type = "text/css";

        var css =
            ".invItemContainer .invItem.gold[data-v-12c929a4] { border-bottom: 1px solid blue; background: linear-gradient(transparent, rgba(0, 94, 255,0.08)) }";

        if (gstyle.styleSheet) {
            gstyle.styleSheet.cssText = css;
        } else {
            gstyle.appendChild(document.createTextNode(css));
        }

        head.appendChild(gstyle);
    } else {
        console.log("gold golds")
        var ncss =
            ".invItemContainer .invItem.gold[data-v-12c929a4] { border-bottom: 1px solid gold; background: linear-gradient(transparent, rgba(255, 215, 0,0.08)) }";

        if (gstyle.styleSheet) {
            gstyle.styleSheet.cssText = ncss;
        } else {
            gstyle.appendChild(document.createTextNode(ncss));
        }
    }
}



document.addEventListener('DOMNodeInserted', function (event) {
    try {
        if (event.target.matches('.messageGroup')) {
            let messageBodies = document.querySelectorAll('.chatComponent .chatMessages .scrollContainer .chatScroll .messageGroup')
            for (let i = 0; i < messageBodies.length; i++) {
                messageBodies[i].style.fontSize = storage.schat + "px";
            }
            for (let i = 0; i < messageBodies.length; i++) {
                messageBodies[i].style.fontSize = storage.schat + "px";
                let parentElement = messageBodies[i].parentNode;
                let timestampElement = parentElement.querySelector('.timestamp');
                timestampElement.style.position = "relative";
                timestampElement.style.top = "-27.5px";
            }
        }
    } catch (e) {
        return;
    }
});


function loadStyles(log) {
    log ? console.log("Loaded, styling..") : setTimeout(function () { }, 1);
    let navbar = document.querySelector('.navbarComponent');
    navbar.style.backgroundImage = 'linear-gradient(to right, transparent 60%, rgba(40,40,40,0.1) 75%, rgb(0 58 255 / 10%))';
    let arrow = document.querySelector('.dropDown>.arrow');
    arrow.style.color = "#172ed1"
    let namebar = document.querySelector('.navProfile>.info>.name');
    namebar.style.color = "rgb(59 84 255)"
    let bgimg = document.querySelector("#interface > div > div.navbarComponent.noselect > div.navBackground")
    bgimg ? bgimg.remove() : (function () { return; })
    let messageBodies = document.querySelectorAll('.messageBody')
    for (let i = 0; i < messageBodies.length; i++) {
        messageBodies[i].style.fontSize = storage.schat + "px";
        let parentElement = messageBodies[i].parentNode;
        let timestampElement = parentElement.querySelector('.timestamp');
        timestampElement.style.position = "relative";
        timestampElement.style.top = "-27.5px";
    }
}

function unloadStyles() {
    let navbar = document.querySelector('.navbarComponent');
    navbar.style.backgroundImage = 'linear-gradient(to right, transparent 60%, rgba(47,37,7,0.1) 75%, rgba(255,191,0,0.1))';
    let arrow = document.querySelector('.dropDown>.arrow');
    arrow.style.color = "gold"
    let namebar = document.querySelector('.navProfile>.info>.name');
    namebar.style.color = "gold"
    let bgimg = document.querySelector("#interface > div > div.navbarComponent.noselect > div.navBackground")
    bgimg ? bgimg.remove() : (function () { return; })
    let messageBodies = document.querySelectorAll('.messageBody')
    for (let i = 0; i < messageBodies.length; i++) {
        messageBodies[i].style.fontSize = storage.schat + "px";
        let parentElement = messageBodies[i].parentNode;
        let timestampElement = parentElement.querySelector('.timestamp');
        timestampElement.style.position = "relative";
        timestampElement.style.top = "-27.5px";
    }
}

document.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT' && storage.bchat) {
        const inputText = event.target.value;
        let boldText = '';
        for (let i = 0; i < inputText.length; i++) {
            const char = inputText[i];
            if (boldChars[char]) {
                boldText += boldChars[char];
            } else {
                boldText += inputText[i];
            }
        }

        event.target.value = boldText;
    }
});

var messages = document.querySelectorAll('.messageGroup')
messages.forEach((message) => {
    console.log(message)
})