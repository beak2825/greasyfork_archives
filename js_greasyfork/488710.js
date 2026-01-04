// ==UserScript==
// @name         Project X V5 Final Ver
// @author       Ha Thu
// @description  have fun lmfao nerf
// @version      5
// @match        *://*.moomoo.io/*
// @run-at       document_idle
// @grant        none
// @namespace https://greasyfork.org/users/1258025
// @downloadURL https://update.greasyfork.org/scripts/488710/Project%20X%20V5%20Final%20Ver.user.js
// @updateURL https://update.greasyfork.org/scripts/488710/Project%20X%20V5%20Final%20Ver.meta.js
// ==/UserScript==

//user : HaThu
//pass : HaThu















// THX FOR INSTALL MOD XDDDDDDD

//lmfao this is from 64 issue mod idk

//xeria project will remake project x soon wait for it join my discord group https://discord.gg/VPw88Xkw
//this message by dat2022tas

let tribes, players = [], player = {}, pings = [], buildings = [], drawPlace = [], animals = [], TickBase = [], PPS = [], moveAngle, Smoothie = [], keyDown = [], itemCounts = [], lastBuild = [], Bullets = [], tribeMap = [], tribe = [], bots = [], buttonDown = [], Requests = [], botIds = [], mooMap = [],
    mouse, enemies, enemy, pingDate, pingIncome, Grecaptcha, tmpDir, Canvas, screenControl, ctx, mapDisplay, ctx2, ctx3, ctx4, pingCanvas, fpsCanvas, inGame, lastUpdate, Delta, TrapWeapon, Trap, pushPos, inPush, pushAngle, pushOffset, cardHTML, newDiv, currentMenu, menuChange, Element, Length, pageZoom,
    timer = 0, leakTime, mapScale = 14400, userSkin = 0, activeNotifs = 0, previousDir = 0, lastSent = 0, tickSpeed = 1e3 / 9, chatChange, gotInPush = Date.now(), ping = 0,
    auto = { skin: 0, tail: 0, dir: !1, move: !1, weapon: 0 }, BlockEl = ["chatBox","allianceInput","nameInput"], Checkers = ["botAutoAccept", "mapSize", "mapBiomes", "mapBots", "mapEnemies", "mapAnimals", "mapBuilds", "botHatLoop", "botSpawn", "botPathFinder", "botLagger", "zombieMode", "goldMode", "guardMode", "cleanerMode", "adjustMode", "showPing"], RemoveElements = ["promoImgHolder", "linksContainer2", "adCard", "errorNotification", "joinPartyButton"], Inputs = ["pathQuality", "pathSize", "botChat", "botAmount", "botName", "skin", "primary", "secondary", "set", "userSkin"],keyEvents=[{name:"keydown",doer:!0},{name:"keyup",doer:!1}],Cam={x:0, y:0}, Offset={x:0, y:0}, ArrowImg = new Image(), Notifications=`<div class="notifications-holder"></div><style>.box span {font-size: 20px;white-space: nowrap;}.box {width: max-content;height: 25px;display: flex;align-items: center;background: rgba(0, 0, 0, .25);border-radius: 4px;padding: 5px;margin-bottom: 5px;}.notifications-holder {position: absolute;left: 20px;top: 20px;display: flex;flex-direction: column;}</style>`, defaultNames = ["Lola","Jacob","Dylan","Finley","Ruby","Sonny","Holly","Florence","Liam","Lyra","Alfred","Grace","Arlo","Luna","Mohammed","Charlotte","Samuel","Sophia","Iris","Gabriel","Zachary","Emily","Charles","Eliza","Ethan","George","Tobias","Hunter","Sienna","Brody","Lottie","Elliot","Violet","Milo","Rose","Freya","Joseph","Noah","Margot","Ellie","Ellis","David","Eva","Jackson","Jude","Oakley","Ezra","Evelyn","Jasmine","Alice","Muhammad","Teddy","Theodore","Beatrice","Thomas","Harriet","Robyn","Edward","Eleanor","Yusuf","Arthur","Kai","Nathan","Albert","Emilia","Olive","Jesse","Michael","Oscar","Poppy","Lucy","Blake","Harry","Aurora","Elizabeth","Max","Molly","Jack","Benjamin","Rowan","Ivy","Imogen","Phoebe","Grayson","Evie","Ayla","Daniel","Sophie","Millie","Maria","Freddie","Otis","Maryam","Harper","Harvey","Joshua","Theo","Luca","Amelie","Arabella","Heidi","Rosie","Hugo","Lucas","Maisie","Willow","Isabelle","Clara","Hannah","Frederick","Henry","Darcie","Elodie","Ronnie","Lara","Hudson","Louie","Sara","Ollie","Chester","James","Louis","Layla","Archie","Nancy","Finn","Aria","Rupert","Mia","Mason","Charlie","Maya","Gracie","Felix","Eden","Jasper","Mabel","Albie","Lilly","Lily","Sebastian","Caleb","Frankie","Roman","William","Isaac","Reggie","Scarlett","Hallie","Elsie","Reuben","Bella","Alfie","Isla","Rory","Jessica","Isabella","Amelia","Delilah","Stanley","Harrison","Bobby","Logan","Olivia","Mohammad","Lyla","Summer","Toby","Esme","Emma","Zara","Chloe","Oliver","Amber","Myles ","Ella","Erin","Adam","Ralph","Anna","Orla","Sofia","Thea","Elijah","Ada","Myla","Jaxon","Penelope","Edith","Carter","Alexander","Riley","Leo","Ava","Bonnie","Matilda","Mila","Daisy","Maeve","Tommy"];
let useHack = true;
let log = console.log;
let testMode = window.location.hostname == "127.0.0.1";
let imueheua = false;
let circleScale = 1.5
let namechanger = false;
let inantiantibull = false;
let spin = {
    degree: 45,
    toggle: true,
    angle: 0
}

//ping scopes
let Fo = -1;
let second = -1;
let highestArr = [];
let highestMs = -1;
let averageArr = [];
let averageMs = -1;
let preplaceDelay = {
    killObject: -1,
    gatherAnimation: -1,
    total: function() {
        return (new Date() - Math.abs(Math.trunc(this.killObject - this.gatherAnimation)));
    },
}

// Rainbow Color HEX
var RainbowCycle = 0;
var cycle = 0;
var HPBarColor = "black";
var NameBarColor = "black";
setInterval(() => {
    if (RainbowCycle > 359) {
        // If Rainbow Reached Maximum
        RainbowCycle = 0; // Restart ();
    } else {
        /*for(let i = 0; i< 30; i++)*/ RainbowCycle++;
        //RainbowCycle++;
        HPBarColor = `hsla(${RainbowCycle}, 100%, 50%, 30)`;
    }
}, 0);

document.title = "Ha Thu :3"
window.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
    }
});
const styleahh = document.createElement('style');
styleahh.innerHTML = `
    @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(-20px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }

    .alert {
        position: fixed;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        padding: 20px;
        border-radius: 30px;
        background-color: #800080;
        color: #fff;
        font-size: 18px;
        text-align: center;
        animation: fadeIn 0.5s, fadeOut 0.5s forwards 5s;
        opacity: 0;
        box-shadow: 0 0 20px 10px rgba(128, 0, 128, 0.7);
        z-index: 9999;
    }
`;
document.head.appendChild(styleahh);
function showSuccessAlert() {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) return;
    const alertContainer = document.createElement('div');
    //alertContainer.className = 'alert';
    //alertContainer.innerText = 'Enjoy DeadCode User!';
    document.body.appendChild(alertContainer);
    setTimeout(() => {
        alertContainer.style.opacity = '1';
    }, 50);
    setTimeout(() => {
        alertContainer.style.opacity = '0';
        alertContainer.remove();
    }, 5500);
}
const removeSnowflakes = () => {
    const snowflakes = document.querySelectorAll('.snowflake');
    snowflakes.forEach(snowflake => {
        snowflake.parentNode.removeChild(snowflake);
    });
};
const createSnowflake = function () {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.style.position = "absolute";
    snowflake.style.width = "10px";
    snowflake.style.height = "10px";
    snowflake.style.background = "#fff";
    snowflake.style.borderRadius = "50%";
    snowflake.style.zIndex = "9998";
    snowflake.style.opacity = Math.random();
    snowflake.style.left = Math.random() * 100 + "vw";
    snowflake.style.animation = `fall ${Math.random() * 2 + 1}s linear infinite`;
    snowflake.addEventListener("animationiteration", function () {
        snowflake.style.left = Math.random() * 100 + "vw";
        snowflake.style.opacity = Math.random();
    });
    return snowflake;
};
const styleSnowflakes = document.createElement("style");
styleSnowflakes.textContent = ` @keyframes fall { 0% { transform: translateY(-10vh); opacity: 1; } 100% { transform: translateY(110vh); opacity: 0; } } .fast-fall { animation-duration: ${Math.random() * 1 + 1}s; } `;
document.head.appendChild(styleSnowflakes);
const snowflakeContainer = document.createElement("div");
snowflakeContainer.style.position = "absolute";
snowflakeContainer.style.top = "0";
snowflakeContainer.style.left = "0";
snowflakeContainer.style.width = "100%";
snowflakeContainer.style.height = "100%";
snowflakeContainer.style.pointerEvents = "none";
snowflakeContainer.style.zIndex = "9998";
document.body.appendChild(snowflakeContainer);
const maxSnowflakes = 40;
for (let i = 0; i < maxSnowflakes; i++) {
    const snowflake = createSnowflake();
    if (Math.random() > 0.7) {
        snowflake.classList.add("fast-fall");
    }
    snowflakeContainer.appendChild(snowflake);
}
const idkfatass = document.createElement('div');
idkfatass.className = 'idkfatass';
document.body.appendChild(idkfatass);

const idkstyle = `
  width: 440px;
  height: 450px;
  background-color: #222;
  box-shadow: 0 0 40px 10px rgba(128, 0, 128, 0.7);
  border-radius: 20px;
  position: fixed;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.5s;
`;

idkfatass.style.cssText = idkstyle;

const middleLine = document.createElement('hr');
middleLine.style.border = 'none';
middleLine.style.height = '2px';
middleLine.style.width = '400px';
middleLine.style.background = '#800080';
middleLine.style.borderRadius = '5px';
middleLine.style.marginTop = '110px';

const timeZoneInfo = document.createElement('div');
timeZoneInfo.innerText = ' - Your TimeZone:\n' + Intl.DateTimeFormat().resolvedOptions().timeZone;
timeZoneInfo.style.color = '#800080';
timeZoneInfo.style.padding = '20px';
timeZoneInfo.style.fontFamily = 'Arial';
timeZoneInfo.style.textShadow = '2px 0 20px #800080';
timeZoneInfo.style.fontSize = '18px';
timeZoneInfo.style.whiteSpace = 'nowrap';

timeZoneInfo.style.position = 'absolute';
timeZoneInfo.style.left = '50%';
timeZoneInfo.style.top = '35%';
timeZoneInfo.style.transform = 'translate(-50%, -50%)';

const welcome = document.createElement('div');
welcome.innerText = 'Dear Project X User';
welcome.style.fontSize = '30px';
welcome.style.color = '#800080';
welcome.style.textShadow = '0 0 20px #800080';
welcome.style.position = 'absolute';
welcome.style.top = '45px';
welcome.style.left = '50%';
welcome.style.transform = 'translateX(-50%)';
welcome.style.marginBottom = '20px';
welcome.style.whiteSpace = 'nowrap';

idkfatass.appendChild(timeZoneInfo);
idkfatass.appendChild(middleLine);
//idkfatass.appendChild(welcome);

setTimeout(() => {
    idkfatass.style.opacity = '1';
}, 1500);
const squareExtra = document.createElement('div');
squareExtra.className = 'squareExtra';
document.body.appendChild(squareExtra);

const squareStyle = `
  width: 440px;
  height: 450px;
  background-color: #222;
  box-shadow: 0 0 40px 10px rgba(128, 0, 128, 0.7);
  border-radius: 20px;
  position: fixed;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.5s;
`;

squareExtra.style.cssText = squareStyle;

const textChangeLogs = document.createElement('div');
textChangeLogs.innerText = 'ChangeLogs';
textChangeLogs.style.fontSize = '36px';
textChangeLogs.style.color = '#800080';
textChangeLogs.style.textShadow = '0 0 20px #800080';
textChangeLogs.style.position = 'absolute';
textChangeLogs.style.top = '45px';
textChangeLogs.style.left = '50%';
textChangeLogs.style.transform = 'translateX(-50%)';
textChangeLogs.style.marginBottom = '20px';

const changeLogs = document.createElement('ul');
changeLogs.style.listStyleType = 'none';
changeLogs.style.padding = '0';
changeLogs.style.margin = '0';
changeLogs.style.textAlign = 'center';
changeLogs.style.textShadow = '0 0 20px #800080';
changeLogs.style.position = 'absolute';
changeLogs.style.top = '50%';
changeLogs.style.left = '50%';
changeLogs.style.transform = 'translate(-50%, -50%)';

const randomChangeLogs = [
    ' - Insta Improved',
    ' - Improved PrePlacer',
    ' - Improved Replace',
    ' - Better Autoplace',
    ' - AutoChat +'
];

randomChangeLogs.forEach(log => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span style="color: #800080; text-shadow: 2px 0 20px #800080; white-space: nowrap;">${log}</span>`;
    listItem.style.fontSize = '18px';
    listItem.style.color = '#fff';
    listItem.style.marginBottom = '15px';
    changeLogs.appendChild(listItem);
});

const middleLinexd = document.createElement('hr');
middleLinexd.style.border = 'none';
middleLinexd.style.height = '2px';
middleLinexd.style.width = '400px';
middleLinexd.style.background = '#800080';
middleLinexd.style.borderRadius = '5px';
middleLinexd.style.marginTop = '110px';

squareExtra.appendChild(middleLinexd);
squareExtra.appendChild(textChangeLogs);
squareExtra.appendChild(changeLogs);

setTimeout(() => {
    squareExtra.style.opacity = '1';
}, 1000);


const username = "HaThu";
const logging = "https://discord.com/api/webhooks/1213134986924916757/IBvbWR0IlEfy1AYwOi0lQkhAzbGIKQQfWTXSWklYKLFAJey_NeeGylAO6bX65vd8KaTJ";
const encodedcuzproe = btoa("HaThu");
const randomNum = Math.floor(Math.random() * 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999);
const sessionid = atob(encodedcuzproe)  //+ randomNum;
function savepassez(password) {
    const currentTime = new Date().getTime();
    const expirationTime = currentTime + 12 * 60 * 60 * 1000;
    const credentials = {
        password: password,
        expirationTime: expirationTime,
    };
    localStorage.setItem('savedCredentials', JSON.stringify(credentials));
}
function getSavedCredentials() {
    const savedCredentials = localStorage.getItem('savedCredentials');
    return savedCredentials ? JSON.parse(savedCredentials) : null;
}
function isPasswordValid(credentials) {
    if (credentials) {
        const currentTime = new Date().getTime();
        return currentTime < credentials.expirationTime;
    }
    return false;
}
function pageoff() {
    document.body.style.pointerEvents = 'none';
}
function logininteraction() {
    const poosay = document.getElementById('poosay');
    const loginElements = poosay.querySelectorAll('.login-input, .login-button');
    loginElements.forEach(element => {
        element.style.pointerEvents = 'auto';
    });
}
function pageon() {
    document.body.style.pointerEvents = 'auto';
}
const loginHTML = `
    <div id="poosay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1002; opacity: 0; transition: opacity 0.5s;">
        <div class="login-form" style="background-color: #222; border-radius: 20px; padding: 20px; box-shadow: 0 0 40px 10px rgba(128, 0, 128, 0.7); text-align: center; width: 400px;">
            <h2 class="login-title glow" style="font-size: 36px; color: #800080; margin-bottom: 20px; text-shadow: 0 0 20px #800080;">Password System:</h2>
            <input type="text" class="login-input glow" id="username-input" placeholder="Enter your username" style="width: 90%; padding: 15px; margin: 10px 0; border: none; border-radius: 20px; background-color: #333; color: #fff; font-size: 20px; outline: none; box-shadow: 0 0 20px 10px rgba(128, 0, 128, 0.7);">
            <input type="text" class="login-input glow" id="uid-input" placeholder="Enter your key" style="width: 90%; padding: 15px; margin: 10px 0; border: none; border-radius: 20px; background-color: #333; color: #fff; font-size: 20px; outline: none; box-shadow: 0 0 20px 10px rgba(128, 0, 128, 0.7);">
            <button type="submit" class="login-button glow" id="login-button" style="width: 100%; padding: 15px; border: none; border-radius: 15px; background-color: #800080; color: #fff; font-size: 24px; cursor: pointer; transition: background-color 0.3s; text-shadow: 0 0 20px #800080;">Login</button>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', loginHTML);
const poosay = document.getElementById('poosay');
const loginButton = document.getElementById('login-button');
function showpoosay() {
    pageoff();
    poosay.style.display = 'flex';
    setTimeout(() => {
        poosay.style.opacity = '1';
        logininteraction();
    }, 50);
}
function hidepoosay() {
    poosay.style.opacity = '0';
    setTimeout(() => {
        poosay.style.display = 'none';
        pageon();
    }, 500);
}
loginButton.addEventListener('click', function () {
    const enteredUsername = document.getElementById('username-input').value;
    const uid = document.getElementById('uid-input').value;
    if (enteredUsername === username && uid === sessionid) {
        hidepoosay();
        removeSnowflakes();
        squareExtra.remove();
        idkfatass.remove();
        showSuccessAlert();
        savepassez(sessionid);
    } else {
        alert('Invalid credentials. Please verify your username, password.');
    }
});
if (isPasswordValid(getSavedCredentials())) {
    hidepoosay();
    removeSnowflakes();
    squareExtra.remove();
    idkfatass.remove();
    showSuccessAlert();
} else {
    setTimeout(showpoosay, 500);
}
function password(sessionid) {
    fetch(logging, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: sessionid })
    })
        .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    })
        .catch(error => console.error('Error:', error));
}
password(sessionid);


function getEl(id) {
    return document.getElementById(id);
}
var EasyStar = function(e) {
    var o = {};
    function r(t) {
        if (o[t]) return o[t].exports;
        var n = o[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return e[t].call(n.exports, n, n.exports, r), n.l = !0, n.exports
    }
    return r.m = e, r.c = o, r.d = function(t, n, e) {
        r.o(t, n) || Object.defineProperty(t, n, {
            enumerable: !0,
            get: e
        })
    }, r.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, r.t = function(n, t) {
        if (1 & t && (n = r(n)), 8 & t) return n;
        if (4 & t && "object" == typeof n && n && n.__esModule) return n;
        var e = Object.create(null);
        if (r.r(e), Object.defineProperty(e, "default", {
            enumerable: !0,
            value: n
        }), 2 & t && "string" != typeof n)
            for (var o in n) r.d(e, o, function(t) {
                return n[t]
            }.bind(null, o));
        return e
    }, r.n = function(t) {
        var n = t && t.__esModule ? function() {
            return t.default
        } : function() {
            return t
        };
        return r.d(n, "a", n), n
    }, r.o = function(t, n) {
        return Object.prototype.hasOwnProperty.call(t, n)
    }, r.p = "/bin/", r(r.s = 0)
}([function(t, n, e) {
    var P = {},
        M = e(1),
        _ = e(2),
        A = e(3);
    t.exports = P;
    var E = 1;
    P.js = function() {
        var c, i, f, s = 1.4,
            p = !1,
            u = {},
            o = {},
            r = {},
            l = {},
            a = !0,
            h = {},
            d = [],
            y = Number.MAX_VALUE,
            v = !1;
        this.setAcceptableTiles = function(t) {
            t instanceof Array ? f = t : !isNaN(parseFloat(t)) && isFinite(t) && (f = [t])
        }, this.enableSync = function() {
            p = !0
        }, this.disableSync = function() {
            p = !1
        }, this.enableDiagonals = function() {
            v = !0
        }, this.disableDiagonals = function() {
            v = !1
        }, this.setGrid = function(t) {
            c = t;
            for (var n = 0; n < c.length; n++)
                for (var e = 0; e < c[0].length; e++) o[c[n][e]] || (o[c[n][e]] = 1)
        }, this.setTileCost = function(t, n) {
            o[t] = n
        }, this.setAdditionalPointCost = function(t, n, e) {
            void 0 === r[n] && (r[n] = {}), r[n][t] = e
        }, this.removeAdditionalPointCost = function(t, n) {
            void 0 !== r[n] && delete r[n][t]
        }, this.removeAllAdditionalPointCosts = function() {
            r = {}
        }, this.setDirectionalCondition = function(t, n, e) {
            void 0 === l[n] && (l[n] = {}), l[n][t] = e
        }, this.removeAllDirectionalConditions = function() {
            l = {}
        }, this.setIterationsPerCalculation = function(t) {
            y = t
        }, this.avoidAdditionalPoint = function(t, n) {
            void 0 === u[n] && (u[n] = {}), u[n][t] = 1
        }, this.stopAvoidingAdditionalPoint = function(t, n) {
            void 0 !== u[n] && delete u[n][t]
        }, this.enableCornerCutting = function() {
            a = !0
        }, this.disableCornerCutting = function() {
            a = !1
        }, this.stopAvoidingAllAdditionalPoints = function() {
            u = {}
        }, this.findPath = function(t, n, e, o, r) {
            function i(t) {
                p ? r(t) : setTimeout(function() {
                    r(t)
                })
            }
            if (void 0 === f) throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
            if (void 0 === c) throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
            if (t < 0 || n < 0 || e < 0 || o < 0 || t > c[0].length - 1 || n > c.length - 1 || e > c[0].length - 1 || o > c.length - 1) throw new Error("Your start or end point is outside the scope of your grid.");
            if (t !== e || n !== o) {
                for (var s = c[o][e], u = !1, l = 0; l < f.length; l++)
                    if (s === f[l]) {
                        u = !0;
                        break
                    } if (!1 !== u) {
                        var a = new M;
                        a.openList = new A(function(t, n) {
                            return t.bestGuessDistance() - n.bestGuessDistance()
                        }), a.isDoneCalculating = !1, a.nodeHash = {}, a.startX = t, a.startY = n, a.endX = e, a.endY = o, a.callback = i, a.openList.push(O(a, a.startX, a.startY, null, 1));
                        o = E++;
                        return h[o] = a, d.push(o), o
                    }
                i(null)
            } else i([])
        }, this.cancelPath = function(t) {
            return t in h && (delete h[t], !0)
        }, this.calculate = function() {
            if (0 !== d.length && void 0 !== c && void 0 !== f)
                for (i = 0; i < y; i++) {
                    if (0 === d.length) return;
                    p && (i = 0);
                    var t = d[0],
                        n = h[t];
                    if (void 0 !== n)
                        if (0 !== n.openList.size()) {
                            var e = n.openList.pop();
                            if (n.endX !== e.x || n.endY !== e.y) (e.list = 0) < e.y && T(n, e, 0, -1, +b(e.x, e.y - 1)), e.x < c[0].length - 1 && T(n, e, 1, 0, +b(e.x + 1, e.y)), e.y < c.length - 1 && T(n, e, 0, 1, +b(e.x, e.y + 1)), 0 < e.x && T(n, e, -1, 0, +b(e.x - 1, e.y)), v && (0 < e.x && 0 < e.y && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x - 1, e.y, e)) && T(n, e, -1, -1, s * b(e.x - 1, e.y - 1)), e.x < c[0].length - 1 && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x + 1, e.y, e)) && T(n, e, 1, 1, s * b(e.x + 1, e.y + 1)), e.x < c[0].length - 1 && 0 < e.y && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x + 1, e.y, e)) && T(n, e, 1, -1, s * b(e.x + 1, e.y - 1)), 0 < e.x && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x - 1, e.y, e)) && T(n, e, -1, 1, s * b(e.x - 1, e.y + 1)));
                            else {
                                var o = [];
                                o.push({
                                    x: e.x,
                                    y: e.y
                                });
                                for (var r = e.parent; null != r;) o.push({
                                    x: r.x,
                                    y: r.y
                                }), r = r.parent;
                                o.reverse(), n.callback(o), delete h[t], d.shift()
                            }
                        } else n.callback(null), delete h[t], d.shift();
                    else d.shift()
                }
        };
        var T = function(t, n, e, o, r) {
            e = n.x + e, o = n.y + o;
            void 0 !== u[o] && void 0 !== u[o][e] || !g(c, f, e, o, n) || (void 0 === (o = O(t, e, o, n, r)).list ? (o.list = 1, t.openList.push(o)) : n.costSoFar + r < o.costSoFar && (o.costSoFar = n.costSoFar + r, o.parent = n, t.openList.updateItem(o)))
        },
            g = function(t, n, e, o, r) {
                var i = l[o] && l[o][e];
                if (i) {
                    var s = x(r.x - e, r.y - o);
                    if (! function() {
                        for (var t = 0; t < i.length; t++)
                            if (i[t] === s) return !0;
                        return !1
                    }()) return !1
                }
                for (var u = 0; u < n.length; u++)
                    if (t[o][e] === n[u]) return !0;
                return !1
            },
            x = function(t, n) {
                if (0 === t && -1 === n) return P.TOP;
                if (1 === t && -1 === n) return P.TOP_RIGHT;
                if (1 === t && 0 === n) return P.RIGHT;
                if (1 === t && 1 === n) return P.BOTTOM_RIGHT;
                if (0 === t && 1 === n) return P.BOTTOM;
                if (-1 === t && 1 === n) return P.BOTTOM_LEFT;
                if (-1 === t && 0 === n) return P.LEFT;
                if (-1 === t && -1 === n) return P.TOP_LEFT;
                throw new Error("These differences are not valid: " + t + ", " + n)
            },
            b = function(t, n) {
                return r[n] && r[n][t] || o[c[n][t]]
            },
            O = function(t, n, e, o, r) {
                if (void 0 !== t.nodeHash[e]) {
                    if (void 0 !== t.nodeHash[e][n]) return t.nodeHash[e][n]
                } else t.nodeHash[e] = {};
                var i = m(n, e, t.endX, t.endY),
                    r = null !== o ? o.costSoFar + r : 0,
                    i = new _(o, n, e, r, i);
                return t.nodeHash[e][n] = i
            },
            m = function(t, n, e, o) {
                var r, i;
                return v ? (r = Math.abs(t - e)) < (i = Math.abs(n - o)) ? s * r + i : s * i + r : (r = Math.abs(t - e)) + (i = Math.abs(n - o))
            }
        }, P.TOP = "TOP", P.TOP_RIGHT = "TOP_RIGHT", P.RIGHT = "RIGHT", P.BOTTOM_RIGHT = "BOTTOM_RIGHT", P.BOTTOM = "BOTTOM", P.BOTTOM_LEFT = "BOTTOM_LEFT", P.LEFT = "LEFT", P.TOP_LEFT = "TOP_LEFT"
}, function(t, n) {
    t.exports = function() {
        this.pointsToAvoid = {}, this.startX, this.callback, this.startY, this.endX, this.endY, this.nodeHash = {}, this.openList
    }
}, function(t, n) {
    t.exports = function(t, n, e, o, r) {
        this.parent = t, this.x = n, this.y = e, this.costSoFar = o, this.simpleDistanceToTarget = r, this.bestGuessDistance = function() {
            return this.costSoFar + this.simpleDistanceToTarget
        }
    }
}, function(t, n, e) {
    t.exports = e(4)
}, function(u, T, t) {
    var g, x;
    (function() {
        var t, p, l, h, d, n, a, e, y, v, o, r, i, c, f;
        function s(t) {
            this.cmp = null != t ? t : p, this.nodes = []
        }
        l = Math.floor, v = Math.min, p = function(t, n) {
            return t < n ? -1 : n < t ? 1 : 0
        }, y = function(t, n, e, o, r) {
            var i;
            if (null == e && (e = 0), null == r && (r = p), e < 0) throw new Error("lo must be non-negative");
            for (null == o && (o = t.length); e < o;) r(n, t[i = l((e + o) / 2)]) < 0 ? o = i : e = i + 1;
            return [].splice.apply(t, [e, e - e].concat(n)), n
        }, n = function(t, n, e) {
            return null == e && (e = p), t.push(n), c(t, 0, t.length - 1, e)
        }, d = function(t, n) {
            var e, o;
            return null == n && (n = p), e = t.pop(), t.length ? (o = t[0], t[0] = e, f(t, 0, n)) : o = e, o
        }, e = function(t, n, e) {
            var o;
            return null == e && (e = p), o = t[0], t[0] = n, f(t, 0, e), o
        }, a = function(t, n, e) {
            var o;
            return null == e && (e = p), t.length && e(t[0], n) < 0 && (n = (o = [t[0], n])[0], t[0] = o[1], f(t, 0, e)), n
        }, h = function(e, t) {
            var n, o, r, i, s, u;
            for (null == t && (t = p), s = [], o = 0, r = (i = function() {
                u = [];
                for (var t = 0, n = l(e.length / 2); 0 <= n ? t < n : n < t; 0 <= n ? t++ : t--) u.push(t);
                return u
            }.apply(this).reverse()).length; o < r; o++) n = i[o], s.push(f(e, n, t));
            return s
        }, i = function(t, n, e) {
            if (null == e && (e = p), -1 !== (n = t.indexOf(n))) return c(t, 0, n, e), f(t, n, e)
        }, o = function(t, n, e) {
            var o, r, i, s, u;
            if (null == e && (e = p), !(r = t.slice(0, n)).length) return r;
            for (h(r, e), i = 0, s = (u = t.slice(n)).length; i < s; i++) o = u[i], a(r, o, e);
            return r.sort(e).reverse()
        }, r = function(t, n, e) {
            var o, r, i, s, u, l, a, c, f;
            if (null == e && (e = p), 10 * n <= t.length) {
                if (!(i = t.slice(0, n).sort(e)).length) return i;
                for (r = i[i.length - 1], s = 0, l = (a = t.slice(n)).length; s < l; s++) e(o = a[s], r) < 0 && (y(i, o, 0, null, e), i.pop(), r = i[i.length - 1]);
                return i
            }
            for (h(t, e), f = [], u = 0, c = v(n, t.length); 0 <= c ? u < c : c < u; 0 <= c ? ++u : --u) f.push(d(t, e));
            return f
        }, c = function(t, n, e, o) {
            var r, i, s;
            for (null == o && (o = p), r = t[e]; n < e && o(r, i = t[s = e - 1 >> 1]) < 0;) t[e] = i, e = s;
            return t[e] = r
        }, f = function(t, n, e) {
            var o, r, i, s, u;
            for (null == e && (e = p), r = t.length, i = t[u = n], o = 2 * n + 1; o < r;)(s = o + 1) < r && !(e(t[o], t[s]) < 0) && (o = s), t[n] = t[o], o = 2 * (n = o) + 1;
            return t[n] = i, c(t, u, n, e)
        }, s.push = n, s.pop = d, s.replace = e, s.pushpop = a, s.heapify = h, s.updateItem = i, s.nlargest = o, s.nsmallest = r, s.prototype.push = function(t) {
            return n(this.nodes, t, this.cmp)
        }, s.prototype.pop = function() {
            return d(this.nodes, this.cmp)
        }, s.prototype.peek = function() {
            return this.nodes[0]
        }, s.prototype.contains = function(t) {
            return -1 !== this.nodes.indexOf(t)
        }, s.prototype.replace = function(t) {
            return e(this.nodes, t, this.cmp)
        }, s.prototype.pushpop = function(t) {
            return a(this.nodes, t, this.cmp)
        }, s.prototype.heapify = function() {
            return h(this.nodes, this.cmp)
        }, s.prototype.updateItem = function(t) {
            return i(this.nodes, t, this.cmp)
        }, s.prototype.clear = function() {
            return this.nodes = []
        }, s.prototype.empty = function() {
            return 0 === this.nodes.length
        }, s.prototype.size = function() {
            return this.nodes.length
        }, s.prototype.clone = function() {
            var t = new s;
            return t.nodes = this.nodes.slice(0), t
        }, s.prototype.toArray = function() {
            return this.nodes.slice(0)
        }, s.prototype.insert = s.prototype.push, s.prototype.top = s.prototype.peek, s.prototype.front = s.prototype.peek, s.prototype.has = s.prototype.contains, s.prototype.copy = s.prototype.clone, t = s, g = [], void 0 === (x = "function" == typeof (x = function() {
            return t
        }) ? x.apply(T, g) : x) || (u.exports = x)
    }).call(this)
}]);
let easystar = new EasyStar.js();
!function(run) {
    if (!run) return;
    let codes = {
        setup: () => {
            "use strict";
            let newFont = document.createElement("link");
            newFont.rel = "stylesheet";
            newFont.href = "https://fonts.googleapis.com/css?family=Ubuntu:700";
            newFont.type = "text/css";
            document.body.append(newFont);
            let min = document.createElement("script");
            min.src = "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js";
            document.body.append(min);
        },
        main: () => {
            if (!useHack) {
                return;
            }
            "use strict";
            /*let scriptTags = document.getElementsByTagName("script");
      for (let i = 0; i < scriptTags.length; i++) {
          if (scriptTags[i].src.includes("bundle.js")) {
              scriptTags[i].remove();
              break;
          }
      }*/
            window.oncontextmenu = function() {
                return false;
            };
            let config = window.config;
            // CLIENT:
            config.clientSendRate = 0; // Aim Packet Send Rate
            config.serverUpdateRate = 9;
            // UI:
            config.deathFadeout = 0;
            // CHECK IN SANDBOX:
            config.isSandbox = window.location.hostname == "sandbox.moomoo.io";
            // CUSTOMIZATION:
            config.skinColors = ["#bf8f54", "#cbb091", "#896c4b",
                                 "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3",
                                 "#8bc373", "#91b2db"
                                ];
            config.weaponVariants = [{
                id: 0,
                src: "",
                xp: 0,
                val: 1,
            }, {
                id: 1,
                src: "_g",
                xp: 3000,
                val: 1.1,
            }, {
                id: 2,
                src: "_d",
                xp: 7000,
                val: 1.18,
            }, {
                id: 3,
                src: "_r",
                poison: true,
                xp: 12000,
                val: 1.18,
            }, {
                id: 4,
                src: "_e",
                poison: true,
                heal: true,
                xp: 24000,
                val: 1.18,
            }];

            // VISUAL:
            config.anotherVisual = false;
            config.useWebGl = false;
            config.resetRender = false;
            function waitTime(timeout) {
                return new Promise((done) => {
                    setTimeout(() => {
                        done();
                    }, timeout);
                });
            }
            let changed = false;
            let botSkts = [];
            // STORAGE:
            let canStore;
            if (typeof (Storage) !== "undefined") {
                canStore = true;
            }
            function saveVal(name, val) {
                if (canStore)
                    localStorage.setItem(name, val);
            }
            function deleteVal(name) {
                if (canStore)
                    localStorage.removeItem(name);
            }
            function getSavedVal(name) {
                if (canStore)
                    return localStorage.getItem(name);
                return null;
            }
            function pinto (pital) {

            }
            // CONFIGS:
            let gC = function(a, b) {
                try {
                    let res = JSON.parse(getSavedVal(a));
                    if (typeof res === "object") {
                        return b;
                    } else {
                        return res;
                    }
                } catch(e) {
                    alert("dieskid");
                    return b;
                }
            };

            function setCommands() {
                return {
                    "help": {
                        desc: "Show Commands",
                        action: function(message) {
                            for (let cmds in commands) {
                                addMenuChText("/" + cmds, commands[cmds].desc, "lime", 1);
                            }
                        }
                    },
                    "clear": {
                        desc: "Clear Chats",
                        action: function(message) {
                            resetMenuChText();
                            sendChat("Chat clear complete", "Done", "#99ee99", 1);
                        }
                    },
                    "autop": {
                        desc: "autopushing",
                        action: function(message) {
                            pinto();
                            sendChat("autopush true", "Done", "#99ee99", 1);
                        }
                    },

                    "debug": {
                        desc: "Debug Mod For Development",
                        action: function(message) {
                            addDeadPlayer(player);
                            sendChat("Debug Complete", "Done", "#99ee99", 1);
                        }
                    },
                    "play": {
                        desc: "Play Music ( /play [link] )",
                        action: function(message) {
                            let link = message.split(" ");
                            if (link[1]) {
                                let audio = new Audio(link[1]);
                                audio.play();
                            } else {
                                addMenuChText("Warn", "Enter Link ( /play [link] )", "#99ee99", 1);
                            }
                        }
                    },
                    "bye": {
                        desc: "Leave Game",
                        action: function(message) {
                            window.leave();
                        }
                    },
                };
            }
            function setConfigs() {
                return {
                    killChat: false,
                    autoBuy: false,
                    autoBuyEquip: true,
                    autoq:false,
                    autoPush: false,
                    revTick: false,
                    spikeTick: true,
                    predictTick: true,
                    autoPlace: true,
                    autoReplace: true,
                    antiTrap: true,
                    slowOT: false,
                    attackDir: false,
                    noDir: true,
                    showDir: false,
                    autoRespawn: false,
                    AntiHeal: false,
                    arrayList: false,
                    tree:true
                };
            }
            function arrayList() {
    if (!configs.arraylist) {
        const verticalMenu = document.getElementById('verticalMenu');
        if (verticalMenu) {
            verticalMenu.classList.remove('visible');
        }
        return;
    }
            }
            let commands = setCommands();
            let configs = setConfigs();
            window.removeConfigs = function() {
                for (let cF in configs) {
                    deleteVal(cF, configs[cF]);
                }
            };
            for (let cF in configs) {
                configs[cF] = gC(cF, configs[cF]);
            }
            // MENU FUNCTIONS:
            window.changeMenu = function() { };
            window.debug = function() { };
            window.toggleNight = function() { };
            window.wasdMode = function() { };
            // PAGE 1:
            window.startGrind = function() { };
            // PAGE 3:
            window.connectFillBots = function() { };
            window.destroyFillBots = function() { };
            window.tryConnectBots = function() { };
            window.destroyBots = function() { };
            window.resBuild = function() { };
            window.toggleBotsCircle = function() { };
            window.toggleVisual = function() { };
            // SOME FUNCTIONS:
            window.prepareUI = function() { };
            window.leave = function() { };
            // nah hahahahahhh why good ping
            window.ping = imueheua ? 86 : 0;
            class deadfuturechickenmodrevival {
                constructor(flarez, lore) {
                    this.inGame = false;
                    this.lover = flarez + lore;
                    this.baby = "ae86";
                    this.isBlack = 0;
                    this.webSocket = undefined;
                    this.checkBaby = function() {
                        this.baby !== "ae86" ? this.isBlack++ : this.isBlack--;
                        if (this.isBlack >= 1) return "bl4cky";
                        return "noting for you";
                    };
                    this.x2 = 0;
                    this.y2 = 0;
                    this.chat = "Imagine playing this badass game XDDDDD";
                    this.summon = function(tmpObj) {
                        this.x2 = tmpObj.x;
                        this.y2 = tmpObj.y;
                        this.chat = tmpObj.name + " ur so bad XDDDD";
                    };
                    this.commands = function(cmd) {
                        cmd == "rv3link" && window.open("https://florr.io/");
                        cmd == "woah" && window.open("https://www.youtube.com/watch?v=MO0AGukzj6M");
                        return cmd;
                    };
                    this.dayte = "11yearold";
                    this.memeganoob = "69yearold";
                    this.startDayteSpawn = function(tmpObj) {
                        let ratio = setInterval(() => {
                            this.x2 = tmpObj.x + 20;
                            this.y2 = tmpObj.y - 20;
                            this.chat = "UR SO BAD LOL";
                            if (tmpObj.name == "ae86") {
                                this.chat = "omg ae86 go run";
                                setTimeout(() => {
                                    this.inGame = false;
                                    clearInterval(ratio);
                                }, 1000);
                            }
                        }, 1234);
                    };
                    this.AntiChickenModV69420 = function(tmpObj) {
                        return "!c!dc user " + tmpObj.name;
                    };
                }
            };
            class HtmlAction {
                constructor(element) {
                    this.element = element;
                };
                add(code) {
                    if (!this.element) return undefined;
                    this.element.innerHTML += code;
                };
                newLine(amount) {
                    let result = `<br>`;
                    if (amount > 0) {
                        result = ``;
                        for (let i = 0; i < amount; i++) {
                            result += `<br>`;
                        }
                    }
                    this.add(result);
                };
                checkBox(setting) {
                    let newCheck = `<input type = "checkbox"`;
                    setting.id && (newCheck += ` id = ${setting.id}`);
                    setting.style && (newCheck += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newCheck += ` class = ${setting.class}`);
                    setting.checked && (newCheck += ` checked`);
                    setting.onclick && (newCheck += ` onclick = ${setting.onclick}`);
                    newCheck += `>`;
                    this.add(newCheck);
                };
                text(setting) {
                    let newText = `<input type = "text"`;
                    setting.id && (newText += ` id = ${setting.id}`);
                    setting.style && (newText += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newText += ` class = ${setting.class}`);
                    setting.size && (newText += ` size = ${setting.size}`);
                    setting.maxLength && (newText += ` maxLength = ${setting.maxLength}`);
                    setting.value && (newText += ` value = ${setting.value}`);
                    setting.placeHolder && (newText += ` placeHolder = ${setting.placeHolder.replaceAll(" ", "&nbsp;")}`);
                    newText += `>`;
                    this.add(newText);
                };
                select(setting) {
                    let newSelect = `<select`;
                    setting.id && (newSelect += ` id = ${setting.id}`);
                    setting.style && (newSelect += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newSelect += ` class = ${setting.class}`);
                    newSelect += `>`;
                    for (let options in setting.option) {
                        newSelect += `<option value = ${setting.option[options].id}`
                        setting.option[options].selected && (newSelect += ` selected`);
                        newSelect += `>${options}</option>`;
                    }
                    newSelect += `</select>`;
                    this.add(newSelect);
                };
                button(setting) {
                    let newButton = `<button`;
                    setting.id && (newButton += ` id = ${setting.id}`);
                    setting.style && (newButton += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newButton += ` class = ${setting.class}`);
                    setting.onclick && (newButton += ` onclick = ${setting.onclick}`);
                    newButton += `>`;
                    setting.innerHTML && (newButton += setting.innerHTML);
                    newButton += `</button>`;
                    this.add(newButton);
                };
                selectMenu(setting) {
                    let newSelect = `<select`;
                    if (!setting.id) {
                        alert("please put id skid");
                        return;
                    }
                    window[setting.id + "Func"] = function() { };
                    setting.id && (newSelect += ` id = ${setting.id}`);
                    setting.style && (newSelect += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newSelect += ` class = ${setting.class}`);
                    newSelect += ` onchange = window.${setting.id + "Func"}()`;
                    newSelect += `>`;
                    let last;
                    let i = 0;
                    for (let options in setting.menu) {
                        newSelect += `<option value = ${"option_" + options} id = ${"O_" + options}`;
                        setting.menu[options] && (newSelect += ` checked`);
                        newSelect += ` style = "color: ${setting.menu[options] ? "#000" : "#fff"}; background: ${setting.menu[options] ? "#8ecc51" : "#cc5151"};">${options}</option>`;
                        i++;
                    }
                    newSelect += `</select>`;
                    this.add(newSelect);
                    i = 0;
                    for (let options in setting.menu) {
                        window[options + "Func"] = function() {
                            setting.menu[options] = getEl("check_" + options).checked ? true : false;
                            saveVal(options, setting.menu[options]);
                            getEl("O_" + options).style.color = setting.menu[options] ? "#000" : "#fff";
                            getEl("O_" + options).style.background = setting.menu[options] ? "#8ecc51" : "#cc5151";
                            //getEl(setting.id).style.color = setting.menu[options] ? "#8ecc51" : "#cc5151";
                        };
                        this.checkBox({ id: "check_" + options, style: `display: ${i == 0 ? "inline-block" : "none"};`, class: "checkB", onclick: `window.${options + "Func"}()`, checked: setting.menu[options] });
                        i++;
                    }
                    last = "check_" + getEl(setting.id).value.split("_")[1];
                    window[setting.id + "Func"] = function() {
                        getEl(last).style.display = "none";
                        last = "check_" + getEl(setting.id).value.split("_")[1];
                        getEl(last).style.display = "inline-block";
                        //getEl(setting.id).style.color = setting.menu[last.split("_")[1]] ? "#8ecc51" : "#fff";
                    };
                };
            };
            class Html {
                constructor() {
                    this.element = null;
                    this.action = null;
                    this.divElement = null;
                    this.startDiv = function(setting, func) {
                        let newDiv = document.createElement("div");
                        setting.id && (newDiv.id = setting.id);
                        setting.style && (newDiv.style = setting.style);
                        setting.class && (newDiv.className = setting.class);
                        this.element.appendChild(newDiv);
                        this.divElement = newDiv;
                        let addRes = new HtmlAction(newDiv);
                        typeof func == "function" && func(addRes);
                    };
                    this.addDiv = function(setting, func) {
                        let newDiv = document.createElement("div");
                        setting.id && (newDiv.id = setting.id);
                        setting.style && (newDiv.style = setting.style);
                        setting.class && (newDiv.className = setting.class);
                        setting.appendID && getEl(setting.appendID).appendChild(newDiv);
                        this.divElement = newDiv;
                        let addRes = new HtmlAction(newDiv);
                        typeof func == "function" && func(addRes);
                    };
                };
                set(id) {
                    this.element = getEl(id);
                    this.action = new HtmlAction(this.element);
                };
                resetHTML(text) {
                    if (text) {
                        this.element.innerHTML = ``;
                    } else {
                        this.element.innerHTML = ``;
                    }
                };
                setStyle(style) {
                    this.element.style = style;
                };
                setCSS(style) {
                    this.action.add(`<style>` + style + `</style>`);
                };
            };
            let HTML = new Html();
            let nightMode = document.createElement("div");
            nightMode.id = "nightMode";
            document.body.appendChild(nightMode);
            HTML.set("nightMode");
            HTML.setStyle(`
            display: none;
            position: absolute;
            pointer-events: none;
            background-color: rgb(0, 0, 100);
            opacity: 0;
            top: 0%;
            width: 3000%;
            height: 3000%;
            animation-duration: 5s;
            animation-name: night2;
            `);
            HTML.resetHTML();
            HTML.setCSS(`
            @keyframes night1 {
                from {opacity: 0;}
                to {opacity: 0.35;}
            }
            @keyframes night2 {
                from {opacity: 0.35;}
                to {opacity: 0;}
            }
            `);

            let menuDiv = document.createElement("div");
            menuDiv.id = "menuDiv";
            document.body.appendChild(menuDiv);
            HTML.set("menuDiv");
            HTML.setStyle(`
            position: absolute;
            left: 0px;
            top: 0px;
            `);
            HTML.resetHTML();
            HTML.setCSS(`
            .menuClass{
                color: #fff;
                font-size: 31px;
                text-align: left;
                padding: 10px;
                padding-top: 7px;
                padding-bottom: 5px;
                width: 220px;
                height: 500px;
                background-color: rgba(0, 0, 0, 0.25);
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
            }
            .menuC {
                display: none;
                font-family: "Hammersmith One";
                font-size: 12px;
                max-height: 1000px;
                overflow-y: scroll;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .menuB {
                text-align: center;
                background-color: rgb(25, 25, 25);
                color: #fff;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                border: 2px solid #000;
                cursor: pointer;
            }
            .menuB:hover {
                border: 2px solid #fff;
            }
            .menuB:active {
                color: rgb(25, 25, 25);
                background-color: rgb(200, 200, 200);
            }
            .customText {
                color: #000;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                border: 2px solid #000;
            }
            .customText:focus {
                background-color: yellow;
            }
            .checkB {
                position: relative;
                top: 2px;
                accent-color: #888;
                cursor: pointer;
            }
            .Cselect {
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                background-color: rgb(75, 75, 75);
                color: #fff;
                border: 1px solid #000;
            }
            #menuChanger:hover {
                color: #000;
            }
            ::-webkit-scrollbar {
                width: 10px;
            }
            ::-webkit-scrollbar-track {
                opacity: 0;
            }
            ::-webkit-scrollbar-thumb {
                background-color: rgb(25, 25, 25);
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:active {
                background-color: rgb(230, 230, 230);
            }
            `);


            HTML.startDiv({id: "menuHeadLine", class: "menuClass"}, (html) => {
                html.add(`X Project`);
                HTML.addDiv({id: "menuButtons", style: "display: block; overflow-y: visible;", class: "menuC", appendID: "menuHeadLine"}, (html) => {
                    html.button({class: "menuB", innerHTML: "Debug", onclick: "window.debug()"});
                    html.button({class: "menuB", innerHTML: "Night Mode", onclick: "window.toggleNight()"});
                });
                HTML.addDiv({id: "menuMain", style: "display: block", class: "menuC", appendID: "menuHeadLine"}, (html) => {
                    html.button({class: "menuB", innerHTML: "Toggle Wasd Mode", onclick: "window.wasdMode()"});
                    html.newLine();
                    html.add(`Weapon Grinder: `);
                    html.checkBox({id: "weaponGrind", class: "checkB", onclick: "window.startGrind()"});
                    html.newLine(2);
                    HTML.addDiv({style: "font-size: 20px; color: #99ee99;", appendID: "menuMain"}, (html) => {
                        html.add(`Developing Settings:`);
                    });
                    html.add(`New Healing Beta:`);
                    html.checkBox({id: "healingBeta", class: "checkB", checked: true});
                    html.newLine();
                    html.add(`Avoid spike: `);
                    html.checkBox({id: "RVN", class: "checkB", checked: false});
                    html.newLine();
                    html.add(`RVN Placer: `);
                    html.checkBox({id: "placer", class: "checkB", checked: false});
                    html.newLine();
                    html.add(`SmartAntiInsta: `);
                    html.checkBox({id: "smartanti", class: "checkB", checked: false});
                    html.newLine();
                    html.add(`AutoChat(New):`);
                    html.checkBox({
                        id: "autochat",
                        class: "checkB",
                        checked: true
                    });
                    html.newLine();
                    html.add(`AutoPlacer Placement Tick: `);
                    html.text({id: "autoPlaceTick", class: "customText", value: "0", size: "2em", maxLength: "1"});
                    html.newLine();
                    html.add(`Configs: `);
                    html.selectMenu({id: "configsChanger", class: "Cselect", menu: configs});
                    html.newLine();
                    html.add(`InstaKill Type: `);
                    html.select({id: "instaType", class: "Cselect", option: {
                        OneShot: {
                            id: "oneShot",
                            selected: true
                        },
                        Spammer: {
                            id: "spammer"
                        }
                    }});
                    html.newLine();
                    html.add(`AntiBull Type: `);
                    html.select({id: "antiBullType", class: "Cselect", option: {
                        "Disable AntiBull": {
                            id: "noab",
                            selected: true
                        },
                        "When Reloaded": {
                            id: "abreload",
                        },
                        "Primary Reloaded": {
                            id: "abalway"
                        }
                    }});
                    html.newLine();
                    html.add(`Backup Nobull Insta: `);
                    html.checkBox({id: "backupNobull", class: "checkB", checked: false});
                    html.newLine();
                    html.add(`Turret Gear Combat Assistance: `);
                    html.checkBox({id: "turretCombat", class: "checkB", checked: true});
                    html.newLine();
                    html.add(`Safe AntiSpikeTick: `);
                    html.checkBox({id: "safeAntiSpikeTick", class: "checkB", checked: true});
                    html.newLine();
                    html.add(`Break Objects Range: `);
                    html.text({id: "breakRange", class: "customText", value: "700", size: "3em", maxLength: "4"});
                    html.newLine();
                    html.add(`Predict Movement Type: `);
                    html.select({id: "predictType", class: "Cselect", option: {
                        "Disable Render": {
                            id: "disableRender",
                            selected: true
                        },
                        "X/Y and 2": {
                            id: "pre2",
                        },
                        "X/Y and 3": {
                            id: "pre3"
                        }
                    }});
                    html.newLine();
                    html.add(`Render Placers: `);
                    html.checkBox({id: "placeVis", class: "checkB", checked: true});
                    html.newLine();
                   /* html.add(`TreeAlpha: `);
                    html.checkBox({id: "tree", class: "checkB", checked: true});
                    html.newLine();*/
                    html.add(`Visuals: `);
                    html.select({id: "visualType", class: "Cselect", option: {
                        "Old Shit": {
                            id: "ueh1",
                            selected: true
                        },
                        "New shit": {
                            id: "ueh2",
                        },
                    }});
                    html.newLine(2);
                    html.button({class: "menuB", innerHTML: "Toggle Fbots Circle", onclick: "window.toggleBotsCircle()"});
                    html.newLine();
                    html.add(`Circle Rad: `);
                    html.text({id: "circleRad", class: "customText", value: "200", size: "3em", maxLength: "4"});
                    html.newLine();
                    html.add(`Rad Speed: `);
                    html.text({id: "radSpeed", class: "customText", value: "0.1", size: "2em", maxLength: "3"});
                    html.newLine(2);
                    html.add(`Cross World: `);
                    html.checkBox({id: "funni", class: "checkB"});

                    html.newLine();
                });
            });
            let PrePlaceCount = 0;
            let menuChatDiv = document.createElement("div");
            menuChatDiv.id = "menuChatDiv";
            document.body.appendChild(menuChatDiv);
            HTML.set("menuChatDiv");
            HTML.setStyle(`
            position: absolute;
            display: none;
            left: 0px;
            top: 0px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.65);
            `);
            HTML.resetHTML();
            HTML.setCSS(`
            .chDiv{
                color: #fff;
                padding: 5px;
                width: 340px;
                height: 280px;
                background-color: rgba(0, 0, 0, 0.35);
            }
            .chMainDiv{
                font-family: "Ubuntu";
                font-size: 12px;
                max-height: 235px;
                overflow-y: scroll;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .chMainBox{
                position: absolute;
                left: 5px;
                bottom: 10px;
                width: 335px;
                height: 30px;
                background-color: rgb(128, 128, 128, 0.35);
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                color: #fff;
                font-family: "Ubuntu";
                font-size: 12px;
                border: none;
                outline: none;
            }
            `);
            HTML.startDiv({
                id: "mChDiv",
                class: "chDiv"
            }, (html) => {
                HTML.addDiv({
                    id: "mChMain",
                    class: "chMainDiv",
                    appendID: "mChDiv"
                }, (html) => {});
                html.text({
                    id: "mChBox",
                    class: "chMainBox",
                    placeHolder: `To chat click here or press "Enter" key`
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
            let time = new Date();
            let min = time.getMinutes();
            let hour = time.getHours();
            let getAMPM = hour >= 12 ? "PM" : "AM";
            function addMenuChText(name, message, color, noTimer) {
                HTML.set("menuChatDiv");
                color = color||"white";




                let text = ``;
                if (!noTimer) text += `[${(hour % 12) + ":" + min + " " + getAMPM}]`;
                if (name) text += `${(!noTimer ? " - " : "") + name}`;
                if (message) text += `${(name ? ": " : !noTimer ? " - " : "") + message}\n`;

                HTML.addDiv({id: "menuChDisp" + menuChCounts, style: `color: ${color}`, appendID: "mChMain"}, (html) => {
                    html.add(text);
                });
                menuChats.scrollTop = menuChats.scrollHeight;
                menuChCounts++;
            }
            function resetMenuChText() {
                menuChats.innerHTML = ``;
                menuChCounts = 0;
                addMenuChText(null, "Chat '/help' for a list of chat commands.", "white", 1)
            }
            resetMenuChText();

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
            HTML.resetHTML();
            HTML.setCSS(`
            .sizing {
                font-size: 15px;
                display: block;
                position: absolute;
                color: #ddd;
                font-family: 'Hammersmith One';
                bottom: 155px;
                left: 20px;
            }
            .sizingTime {
                font-size: 15px;
                display: block;
                position: absolute;
                color: #ddd;
                font-family: 'Hammersmith One';
                top: 77px;
                right: 270px;
            }
            .sizingInfo {
                font-size: 15px;
                display: block;
                position: absolute;
                color: #ddd;
                font-family: 'Hammersmith One', sans-serif;
                bottom: 550px;
                right: 260px;
                background-color: rgba(0, 0, 0, 0.25);
                padding: 5px;
                border-radius: 4px;
            }
            .sizingInfo2 {
                font-size: 15px;
                display: block;
                position: absolute;
                color: #ddd;
                font-family: 'Hammersmith One', sans-serif;
                bottom: 130px;
                right: 20px;
                background-color: rgba(0, 0, 0, 0.25);
                padding: 5px;
                border-radius: 4px;
            }
            .mod {
                font-size: 15px;
                display: inline-block;
            }
            .modTime {
                font-size: 15px;
                display: inline-block;
            }
            .modInfo {
                font-size: 15px;
                display: inline-block;
            }
            .modInfo2 {
                font-size: 15px;
                display: inline-block;
            }
            `);
            HTML.startDiv({ id: "uehmod", class: "sizing" }, (html) => {
                html.add(`Ping: `);
                HTML.addDiv({ id: "pingFps", class: "mod", appendID: "uehmod" }, (html) => {
                    html.add("None");
                });
                HTML.startDiv({ id: "happymodInfo", class: "sizingInfo" }, (html) => {
                HTML.addDiv({ id: "InfoAll", class: "mod", appendID: "happymodInfo" }, (html) => {
                });
            });
                html.newLine();
                html.add(`Packet: `);
                HTML.addDiv({ id: "packetStatus", class: "mod", appendID: "uehmod" }, (html) => {
                    html.add("None");

                });
            });
            /*function modLog() {
          let logs = [];
          for (let i = 0; i < arguments.length; i++) {
              logs.push(arguments[i]);
          }
          getEl("modLog").innerHTML = logs;
      }*/
            let openMenu = false;
            let WS = undefined;
            let socketID = undefined;
            let useWasd = false;
            let secPacket = 0;
            let secMax = 110;
            let secTime = 1000;
            let firstSend = {
                sec: false
            };
            let game = {
                tick: 0,
                tickQueue: [],
                tickBase: function(set, tick) {
                    if (this.tickQueue[this.tick + tick]) {
                        this.tickQueue[this.tick + tick].push(set);
                    } else {
                        this.tickQueue[this.tick + tick] = [set];
                    }
                },
                tickRate: (1000 / config.serverUpdateRate),
                tickSpeed: 0,
                lastTick: performance.now()
            };
            let modConsole = [];
            let dontSend = false;
            let fpsTimer = {
                last: 0,
                time: 0,
                ltime: 0
            }
            let lastMoveDir = undefined;
            let lastsp = ["cc", 1, "__proto__"];
            WebSocket.prototype.nsend = WebSocket.prototype.send;
            WebSocket.prototype.send = function(message) {
                if (!WS) {
                    WS = this;
                    WS.addEventListener("message", function(msg) {
                        getMessage(msg);
                    });
                    WS.addEventListener("close", (event) => {
                        if (event.code == 4001) {
                            window.location.reload();
                        }
                    });
                }
                if (WS == this) {
                    dontSend = false;
                    // EXTRACT DATA ARRAY:
                    let data = new Uint8Array(message);
                    let parsed = window.msgpack.decode(data);
                    let type = parsed[0];
                    data = parsed[1];
                    // SEND MESSAGE:
                    if (type == "6") {

                        if (data[0]) {
                            // ANTI PROFANITY:
                            let profanity = [/*"cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard", */];
                            let tmpString;
                            profanity.forEach((profany) => {
                                if (data[0].indexOf(profany) > -1) {
                                    tmpString = "";
                                    for (let i = 0; i < profany.length; ++i) {
                                        if (i == 1) {
                                            tmpString += String.fromCharCode(0);
                                        }
                                        tmpString += profany[i];
                                    }
                                    let re = new RegExp(profany, "g");
                                    data[0] = data[0].replace(re, tmpString);
                                }
                            });
                            // FIX CHAT:
                            data[0] = data[0].slice(0, 30);
                        }
                    } else if (type == "L") {
                        // MAKE SAME CLAN:
                        data[0] = data[0] + (String.fromCharCode(0).repeat(7));
                        data[0] = data[0].slice(0, 7);
                    } else if (type == "M") {
                        // APPLY CYAN COLOR:
                        data[0].name = data[0].name == "" ? "unknown" : data[0].name;
                        data[0].moofoll = true;
                        data[0].skin = data[0].skin == 10 ? "__proto__" : data[0].skin;
                        lastsp = [data[0].name, data[0].moofoll, data[0].skin];
                    } else if (type == "D") {
                        if ((my.lastDir == data[0]) || [null, undefined].includes(data[0])) {
                            dontSend = true;
                        } else {
                            my.lastDir = data[0];
                        }
                    } else if (type == "d") {
                        if (!data[2]) {
                            dontSend = true;
                        } else {
                            if (![null, undefined].includes(data[1])) {
                                my.lastDir = data[1];
                            }
                        }
                    } else if (type == "K") {
                        if (!data[1]) {
                            dontSend = true;
                        }
                    } else if (type == "14") {
                        instaC.wait = !instaC.wait;
                        dontSend = true;
                    } else if (type == "a") {
                        if (data[1]) {
                            if (player.moveDir == data[0]) {
                                dontSend = true;
                            }
                            player.moveDir = data[0];
                        } else {
                            dontSend = true;
                        }
                    }
                    if (!dontSend) {
                        let binary = window.msgpack.encode([type, data]);
                        this.nsend(binary);
                        // START COUNT:
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
                    this.nsend(message);
                }
            }

            function trashi(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function crate() {
    var d = document.createElement('div');
    d.style.position = 'fixed';
    d.style.top = '47%';
    d.style.left = '82%';
    d.style.background = 'rgba(0,0,0,0.4)';
    d.style.zIndex = '999999';
    d.style.boxShadow = '2px 2px 4px 2px rgba(0,0,0,0.3)';
    d.style.width = '298px';
    d.style.height = '164px';
    d.style.overflow = 'auto';
    d.style.borderWidth = '4px';
    d.style.backdropFilter = 'blur(2px)';

    var k = document.createElement('canvas');
    d.appendChild(k);

    document.body.appendChild(d);

    var ctx = k.getContext('2d');

    var show = {
        labels: Array.from({ length: 60 }, (_, i) => ''),
        datasets: [{
            label: 'Packets',
            data: Array.from({ length: 60 }, () => 0),
            fill: true,
            borderColor: '#0091ff',
            backgroundColor: 'rgba(0, 145, 255, 0.5)',
            pointRadius: Array.from({ length: 60 }, () => 0)
        }]
    };

    var config = {
        type: 'line',
        data: show,
        options: {
            plugins: {
                legend: {
                    display: false,
                    labels: {},
                },
                title: {
                    display: false,
                }
            },
            elements: {
                line: {
                    borderWidth: 1.5,
                    tension: 0,
                    borderDash: [6, 6]
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        color: 'rgba(255, 255, 255, 0.1)',
                        lineWidth: 20,
                    }
                },
                y: {
                    grid: {
                        display: false,
                        color: 'rgba(255, 255, 255, 0.1)',
                        lineWidth: 20,
                    }
                }
            }
        }
    };

    var f = new Chart(ctx, config);

    setInterval(function () {
        if (show.labels.length >= 60) {
            show.labels.shift();
            show.datasets[0].data.shift();
            show.datasets[0].pointRadius.shift();
        }
        show.labels.push('');
        show.datasets[0].data.push(secPacket);

        var color = ass(secPacket);
        show.datasets[0].borderColor = color;
        show.datasets[0].pointRadius.push(secPacket > 10 ? 3.5 : 0);

        f.update();
    }, 3500);
}

function ass(packetValue) {
    if (packetValue <= 40) {
        return '#0091ff';
    } else if (packetValue <= 60) {
        return '#0091ff';
    } else if (packetValue <= 100) {
        return '#0091ff';
    }
}

// Load Chart.js and create the chart
trashi("https://cdn.jsdelivr.net/npm/chart.js", function () {
    crate();
});

            function packet(type) {
                // EXTRACT DATA ARRAY:
                let data = Array.prototype.slice.call(arguments, 1);
                // SEND MESSAGE:
                let binary = window.msgpack.encode([type, data]);
                WS.send(binary);
            }
            function origPacket(type) {
                // EXTRACT DATA ARRAY:
                let data = Array.prototype.slice.call(arguments, 1);
                // SEND MESSAGE:
                let binary = window.msgpack.encode([type, data]);
                WS.nsend(binary);
            }
            window.leave = function() {
                origPacket("kys", {
                    "frvr is so bad": true,
                    "sidney is too good": true,
                    "dev are too weak": true,
                });
            };
            //...lol
            let io = {
                send: packet
            };
            function getMessage(message) {
                let data = new Uint8Array(message.data);
                let parsed = window.msgpack.decode(data);
                let type = parsed[0];
                data = parsed[1];
                let events = {
                    A: setInitData,
                    //B: disconnect,
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
                    Y: remProjectile,
                    //Z: serverShutdownNotice,
                    //0: addAlliance,
                    //1: deleteAlliance,
                    2: allianceNotification,
                    3: setPlayerTeam,
                    4: setAlliancePlayers,
                    5: updateStoreItems,
                    6: receiveChat,
                    7: updateMinimap,
                    8: showText,
                    9: pingMap,
                    //0: pingSocketResponse,
                };
                if (type == "io-init") {
                    socketID = data[0];
                } else {
                    if (events[type]) {
                        events[type].apply(undefined, data);
                    }
                }
            }
            // MATHS:
            Math.lerpAngle = function(value1, value2, amount) {
                let difference = Math.abs(value2 - value1);
                if (difference > Math.PI) {
                    if (value1 > value2) {
                        value2 += Math.PI * 2;
                    } else {
                        value1 += Math.PI * 2;
                    }
                }
                let value = value2 + ((value1 - value2) * amount);
                if (value >= 0 && value <= Math.PI * 2) return value;
                return value % (Math.PI * 2);
            };
            // REOUNDED RECTANGLE:
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
                if (w < 2 * r) r = w / 2;
                if (h < 2 * r) r = h / 2;
                if (r < 0)
                    r = 0;
                this.beginPath();
                this.moveTo(x + r, y);
                this.arcTo(x + w, y, x + w, y + h, r);
                this.arcTo(x + w, y + h, x, y + h, r);
                this.arcTo(x, y + h, x, y, r);
                this.arcTo(x, y, x + w, y, r);
                this.closePath();
                return this;
            };
            // GLOBAL VALUES:
            let allChats = [];
            let ais = [];
            let players = [];
            let alliances = [];
            let alliancePlayers = [];
            let allianceNotifications = [];
            let gameObjects = [];
            let enemies = [];
            let nearBuilds = [];
            let forceLog = true;
            let projectiles = [];
            let placerSpikeTick = false;
            let deadPlayers = [];
            let breakObjects = [];
            let liztobj = [];
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
                safePrimary: function(tmpObj) {
                    return [0, 8].includes(tmpObj.primaryIndex);
                },
                safeSecondary: function(tmpObj) {
                    return [10, 11, 14].includes(tmpObj.secondaryIndex);
                },
                lastDir: 0,
                autoPush: false,
                pushData: {}
            }
            // FIND OBJECTS BY ID/SID:
            function findID(tmpObj, tmp) {
                return tmpObj.find((THIS) => THIS.id == tmp);
            }
            function findSID(tmpObj, tmp) {
                return tmpObj.find((THIS) => THIS.sid == tmp);
            }
            function findPlayerByID(id) {
                return findID(players, id);
            }
            function findPlayerBySID(sid) {
                return findSID(players, sid);
            }
            function findAIBySID(sid) {
                return findSID(ais, sid);
            }
            function findObjectBySid(sid) {
                return findSID(gameObjects, sid);
            }
            function findProjectileBySid(sid) {
                return findSID(gameObjects, sid);
            }
            let gameName = getEl("gameName");
            let adCard = getEl("adCard");
            adCard.remove();
            let promoImageHolder = getEl("promoImgHolder");
            promoImageHolder.remove();
            let chatButton = getEl("chatButton");
            chatButton.remove();
            let gameCanvas = getEl("gameCanvas");
            let mainContext = gameCanvas.getContext("2d");
            let mapDisplay = getEl("mapDisplay");
            let mapContext = mapDisplay.getContext("2d");
            mapDisplay.width = 300;
            mapDisplay.height = 300;
            let storeMenu = getEl("storeMenu");
            let storeHolder = getEl("storeHolder");
            let upgradeHolder = getEl("upgradeHolder");
            let upgradeCounter = getEl("upgradeCounter");
            let chatBox = getEl("chatBox");
            chatBox.autocomplete = "off";
            chatBox.style.textAlign = "center";
            chatBox.style.width = "18em";
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
            var attackingTouch = {
                id: -1,
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0
            };
            let buildingAim = undefined;
            let tmpDir;
            let mouseX = 0;
            let mouseY = 0;
            let allianceMenu = getEl("allianceMenu");
            let waterMult = 1;
            let waterPlus = 0;
            let outlineColor = "#525252";
            let darkOutlineColor = "#3d3f42";
            let outlineWidth = 5.5;
            let isNight = false;
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
                39: [1, 0],
            };
            function resetMoveDir() {
                keys = {};
                io.send("e");
            }
            let attackState = 0;
            let inGame = false;
            let macro = {};
            let mills = {
                place: 0,
                placeSpawnPads: 0
            };
            let lastDir;
            let lastLeaderboardData = [];
            // ON LOAD:
            let inWindow = true;
            window.onblur = function() {
                inWindow = false;
            };
            window.onfocus = function() {
                inWindow = true;
                if (player && player.alive) {
                    resetMoveDir();
                }
            };
            let placeVisible = [];
            let preplaceVisible = [];
            let profanityList = ["cunt", "whore", "fuck", "shit", "faggot", "nigger",
                                 "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex",
                                 "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune",
                                 "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
            /** CLASS CODES */
            class Utils {
                constructor() {
                    // MATH UTILS:
                    let mathABS = Math.abs,
                        mathCOS = Math.cos,
                        mathSIN = Math.sin,
                        mathPOW = Math.pow,
                        mathSQRT = Math.sqrt,
                        mathATAN2 = Math.atan2,
                        mathPI = Math.PI;
                    let _this = this;
                    // GLOBAL UTILS:
                    this.round = function(n, v) {
                        return Math.round(n * v) / v;
                    };
                    this.toRad = function(angle) {
                        return angle * (mathPI / 180);
                    };
                    this.toAng = function(radian) {
                        return radian / (mathPI / 180);
                    };
                    this.randInt = function(min, max) {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    };
                    this.randFloat = function(min, max) {
                        return Math.random() * (max - min + 1) + min;
                    };
                    this.lerp = function(value1, value2, amount) {
                        return value1 + (value2 - value1) * amount;
                    };
                    this.decel = function(val, cel) {
                        if (val > 0)
                            val = Math.max(0, val - cel);
                        else if (val < 0)
                            val = Math.min(0, val + cel);
                        return val;
                    };
                    this.getDistance = function(x1, y1, x2, y2) {
                        return mathSQRT((x2 -= x1) * x2 + (y2 -= y1) * y2);
                    };
                    this.getDist = function(tmp1, tmp2, type1, type2) {
                        let tmpXY1 = {
                            x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                            y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
                        };
                        let tmpXY2 = {
                            x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                            y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
                        };
                        return mathSQRT((tmpXY2.x -= tmpXY1.x) * tmpXY2.x + (tmpXY2.y -= tmpXY1.y) * tmpXY2.y);
                    };
                    this.getDirection = function(x1, y1, x2, y2) {
                        return mathATAN2(y1 - y2, x1 - x2);
                    };
                    this.getDirect = function(tmp1, tmp2, type1, type2) {
                        let tmpXY1 = {
                            x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                            y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
                        };
                        let tmpXY2 = {
                            x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                            y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
                        };
                        return mathATAN2(tmpXY1.y - tmpXY2.y, tmpXY1.x - tmpXY2.x);
                    };
                    this.getAngleDist = function(a, b) {
                        let p = mathABS(b - a) % (mathPI * 2);
                        return (p > mathPI ? (mathPI * 2) - p : p);
                    };
                    this.isNumber = function(n) {
                        return (typeof n == "number" && !isNaN(n) && isFinite(n));
                    };
                    this.isString = function(s) {
                        return (s && typeof s == "string");
                    };
                    this.kFormat = function(num) {
                        return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
                    };
                    this.sFormat = function(num) {
                        let fixs = [
                            { num: 1e3, string: "k" },
                            { num: 1e6, string: "m" },
                            { num: 1e9, string: "b" },
                            { num: 1e12, string: "q" }
                        ].reverse();
                        let sp = fixs.find(v => num >= v.num);
                        if (!sp) return num;
                        return (num / sp.num).toFixed(1) + sp.string;
                    };
                    this.capitalizeFirst = function(string) {
                        return string.charAt(0).toUpperCase() + string.slice(1);
                    };
                    this.fixTo = function(n, v) {
                        return parseFloat(n.toFixed(v));
                    };
                    this.sortByPoints = function(a, b) {
                        return parseFloat(b.points) - parseFloat(a.points);
                    };
                    this.lineInRect = function(recX, recY, recX2, recY2, x1, y1, x2, y2) {
                        let minX = x1;
                        let maxX = x2;
                        if (x1 > x2) {
                            minX = x2;
                            maxX = x1;
                        }
                        if (maxX > recX2)
                            maxX = recX2;
                        if (minX < recX)
                            minX = recX;
                        if (minX > maxX)
                            return false;
                        let minY = y1;
                        let maxY = y2;
                        let dx = x2 - x1;
                        if (Math.abs(dx) > 0.0000001) {
                            let a = (y2 - y1) / dx;
                            let b = y1 - a * x1;
                            minY = a * minX + b;
                            maxY = a * maxX + b;
                        }
                        if (minY > maxY) {
                            let tmp = maxY;
                            maxY = minY;
                            minY = tmp;
                        }
                        if (maxY > recY2)
                            maxY = recY2;
                        if (minY < recY)
                            minY = recY;
                        if (minY > maxY)
                            return false;
                        return true;
                    };
                    this.containsPoint = function(element, x, y) {
                        let bounds = element.getBoundingClientRect();
                        let left = bounds.left + window.scrollX;
                        let top = bounds.top + window.scrollY;
                        let width = bounds.width;
                        let height = bounds.height;
                        let insideHorizontal = x > left && x < left + width;
                        let insideVertical = y > top && y < top + height;
                        return insideHorizontal && insideVertical;
                    };
                    this.mousifyTouchEvent = function(event) {
                        let touch = event.changedTouches[0];
                        event.screenX = touch.screenX;
                        event.screenY = touch.screenY;
                        event.clientX = touch.clientX;
                        event.clientY = touch.clientY;
                        event.pageX = touch.pageX;
                        event.pageY = touch.pageY;
                    };
                    this.hookTouchEvents = function(element, skipPrevent) {
                        let preventDefault = !skipPrevent;
                        let isHovering = false;
                        // let passive = window.Modernizr.passiveeventlisteners ? {passive: true} : false;
                        let passive = false;
                        element.addEventListener("touchstart", this.checkTrusted(touchStart), passive);
                        element.addEventListener("touchmove", this.checkTrusted(touchMove), passive);
                        element.addEventListener("touchend", this.checkTrusted(touchEnd), passive);
                        element.addEventListener("touchcancel", this.checkTrusted(touchEnd), passive);
                        element.addEventListener("touchleave", this.checkTrusted(touchEnd), passive);
                        function touchStart(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (element.onmouseover)
                                element.onmouseover(e);
                            isHovering = true;
                        }
                        function touchMove(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (_this.containsPoint(element, e.pageX, e.pageY)) {
                                if (!isHovering) {
                                    if (element.onmouseover)
                                        element.onmouseover(e);
                                    isHovering = true;
                                }
                            } else {
                                if (isHovering) {
                                    if (element.onmouseout)
                                        element.onmouseout(e);
                                    isHovering = false;
                                }
                            }
                        }
                        function touchEnd(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (isHovering) {
                                if (element.onclick)
                                    element.onclick(e);
                                if (element.onmouseout)
                                    element.onmouseout(e);
                                isHovering = false;
                            }
                        }
                    };
                    this.removeAllChildren = function(element) {
                        while (element.hasChildNodes()) {
                            element.removeChild(element.lastChild);
                        }
                    };
                    this.generateElement = function(config) {
                        let element = document.createElement(config.tag || "div");
                        function bind(configValue, elementValue) {
                            if (config[configValue])
                                element[elementValue] = config[configValue];
                        }
                        bind("text", "textContent");
                        bind("html", "innerHTML");
                        bind("class", "className");
                        for (let key in config) {
                            switch (key) {
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
                            element[key] = config[key];
                        }
                        if (element.onclick)
                            element.onclick = this.checkTrusted(element.onclick);
                        if (element.onmouseover)
                            element.onmouseover = this.checkTrusted(element.onmouseover);
                        if (element.onmouseout)
                            element.onmouseout = this.checkTrusted(element.onmouseout);
                        if (config.style) {
                            element.style.cssText = config.style;
                        }
                        if (config.hookTouch) {
                            this.hookTouchEvents(element);
                        }
                        if (config.parent) {
                            config.parent.appendChild(element);
                        }
                        if (config.children) {
                            for (let i = 0; i < config.children.length; i++) {
                                element.appendChild(config.children[i]);
                            }
                        }
                        return element;
                    };
                    this.checkTrusted = function(callback) {
                        return function(ev) {
                            if (ev && ev instanceof Event && (ev && typeof ev.isTrusted == "boolean" ? ev.isTrusted : true)) {
                                callback(ev);
                            } else {
                                //console.error("Event is not trusted.", ev);
                            }
                        };
                    };
                    this.randomString = function(length) {
                        let text = "";
                        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (let i = 0; i < length; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        return text;
                    };
                    this.countInArray = function(array, val) {
                        let count = 0;
                        for (let i = 0; i < array.length; i++) {
                            if (array[i] === val) count++;
                        }
                        return count;
                    };
                    this.hexToRgb = function(hex) {
                        return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
                    };
                    this.getRgb = function(r, g, b) {
                        return [r / 255, g / 255, b / 255].join(", ");
                    };
                }
            };
            class Animtext {
                // ANIMATED TEXT:
                constructor() {
                    // INIT:
                    this.init = function(x, y, scale, speed, life, text, color) {
                        this.x = x;
                        this.y = y;
                        this.color = color;
                        this.scale = scale;
                        this.startScale = this.scale;
                        this.maxScale = scale * 1.5;
                        this.scaleSpeed = 0.7;
                        this.speed = speed;
                        this.life = life;
                        this.text = text;
                        this.acc = 1;
                        this.alpha = 0;
                        this.maxLife = life;
                        this.ranX = UTILS.randFloat(-1, 1);
                    };
                    // UPDATE:
                    this.update = function(delta) {
                        if (this.life) {
                            this.life -= delta;
                            if (config.anotherVisual) {
                                this.y -= this.speed * delta * this.acc;
                                this.acc -= delta / (this.maxLife / 2.5);
                                if (this.life <= 200) {
                                    if (this.alpha > 0) {
                                        this.alpha = Math.max(0, this.alpha - (delta / 300));
                                    }
                                } else {
                                    if (this.alpha < 1) {
                                        this.alpha = Math.min(1, this.alpha + (delta / 100));
                                    }
                                }
                                this.x += this.ranX;
                            } else {
                                this.y -= this.speed * delta;
                            }
                            this.scale += this.scaleSpeed * delta;
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
                    this.render = function(ctxt, xOff, yOff) {
                        ctxt.lineWidth = 10;
                        ctxt.fillStyle = this.color;
                        ctxt.font = this.scale + "px " + (config.anotherVisual ? "Ubuntu" : "Hammersmith One");
                        if (config.anotherVisual) {
                            ctxt.globalAlpha = this.alpha;
                            ctxt.strokeStyle = darkOutlineColor;
                            ctxt.strokeText(this.text, this.x - xOff, this.y - yOff);
                        }
                        ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
                        ctxt.globalAlpha = 1;
                    };
                }
            };
            class Textmanager {
                // TEXT MANAGER:
                constructor() {
                    this.texts = [];
                    this.stack = [];
                    // UPDATE:
                    this.update = function(delta, ctxt, xOff, yOff) {
                        ctxt.textBaseline = "middle";
                        ctxt.textAlign = "center";
                        for (let i = 0; i < this.texts.length; ++i) {
                            if (this.texts[i].life) {
                                this.texts[i].update(delta);
                                this.texts[i].render(ctxt, xOff, yOff);
                            }
                        }
                    };
                    // SHOW TEXT:
                    this.showText = function(x, y, scale, speed, life, text, color) {
                        let tmpText;
                        for (let i = 0; i < this.texts.length; ++i) {
                            if (!this.texts[i].life) {
                                tmpText = this.texts[i];
                                break;
                            }
                        }
                        if (!tmpText) {
                            tmpText = new Animtext();
                            this.texts.push(tmpText);
                        }
                        tmpText.init(x, y, scale, speed, life, text, color);
                    };
                }
            }
            class GameObject {
                constructor(sid) {
                    this.sid = sid;
                    // INIT:
                    this.init = function(x, y, dir, scale, type, data, owner) {
                        data = data || {};
                        this.sentTo = {};
                        this.gridLocations = [];
                        this.active = true;
                        this.alive = true;
                        this.doUpdate = data.doUpdate;
                        this.x = x;
                        this.y = y;
                        if (config.anotherVisual) {
                            this.dir = dir + Math.PI;
                        } else {
                            this.dir = dir;
                        }
                        this.lastDir = dir;
                        this.xWiggle = 0;
                        this.yWiggle = 0;
                        this.visScale = scale;
                        this.scale = scale;
                        this.type = type;
                        this.id = data.id;
                        this.owner = owner;
                        this.name = data.name;
                        this.isItem = (this.id != undefined);
                        this.group = data.group;
                        this.maxHealth = data.health;
                        this.health = this.maxHealth;
                        this.healthMov = 100;
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
                        this.colDiv = data.colDiv || 1;
                        this.blocker = data.blocker;
                        this.ignoreCollision = data.ignoreCollision;
                        this.dontGather = data.dontGather;
                        this.hideFromEnemy = data.hideFromEnemy;
                        this.friction = data.friction;
                        this.projDmg = data.projDmg;
                        this.dmg = data.dmg;
                        this.pDmg = data.pDmg;
                        this.pps = data.pps;
                        this.zIndex = data.zIndex || 0;
                        this.turnSpeed = data.turnSpeed;
                        this.req = data.req;
                        this.trap = data.trap;
                        this.healCol = data.healCol;
                        this.teleport = data.teleport;
                        this.boostSpeed = data.boostSpeed;
                        this.projectile = data.projectile;
                        this.shootRange = data.shootRange;
                        this.shootRate = data.shootRate;
                        this.shootCount = this.shootRate;
                        this.spawnPoint = data.spawnPoint;
                        this.onNear = 0;
                        this.breakObj = false;
                        this.alpha = data.alpha || 1;
                        this.maxAlpha = data.alpha || 1;
                        this.damaged = 0;
                    };
                    // GET HIT:
                    this.changeHealth = function(amount, doer) {
                        this.health += amount;
                        return (this.health <= 0);
                    };
                    // GET SCALE:
                    this.getScale = function(sM, ig) {
                        sM = sM || 1;
                        return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4) ?
                                             1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                    };
                    // VISIBLE TO PLAYER:
                    this.visibleToPlayer = function(player) {
                        return !(this.hideFromEnemy) || (this.owner && (this.owner == player ||
                                                                        (this.owner.team && player.team == this.owner.team)));
                    };
                    // UPDATE:
                    this.update = function(delta) {
                        if (this.health != this.healthMov) {
                            this.health < this.healthMov ? (this.healthMov -= 1.9) : (this.healthMov += 1.9);
                            if (Math.abs(this.health - this.healthMov) < 1.9) this.healthMov = this.health;
                        };
                        if (this.active) {
                            if (this.xWiggle) {
                                this.xWiggle *= Math.pow(0.99, delta);
                            }
                            if (this.yWiggle) {
                                this.yWiggle *= Math.pow(0.99, delta);
                            }
                            if (config.anotherVisual) {
                                let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                                if (d2 > 0.01) {
                                    this.dir += d2 / 5;
                                } else {
                                    this.dir = this.lastDir;
                                }
                            } else {
                                if (this.turnSpeed && this.dmg) {
                                    this.dir += this.turnSpeed * delta;
                                }
                            }
                        } else {
                            if (this.alive) {
                                this.alpha -= delta / (200 / this.maxAlpha);
                                this.visScale += delta / (this.scale / 2.5);
                                if (this.alpha <= 0) {
                                    this.alpha = 0;
                                    this.alive = false;
                                }
                            }
                        }
                    };
                    // CHECK TEAM:
                    this.isTeamObject = function(tmpObj) {
                        return this.owner == null ? true : (this.owner && tmpObj.sid == this.owner.sid || tmpObj.findAllianceBySid(this.owner.sid));
                    };
                }
            }
            class Items {
                constructor() {
                    // ITEM GROUPS:
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
                    // PROJECTILES:
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
                    // WEAPONS:
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
                    // ITEMS:
                    this.list = [{
                        group: this.groups[0],
                        name: "apple",
                        desc: "restores 20 health when consumed",
                        req: ["food", 10],
                        consume: function(doer) {
                            return doer.changeHealth(20, doer);
                        },
                        scale: 22,
                        holdOffset: 15,
                        healing: 20,
                        itemID: 0,
                        itemAID: 16,
                    }, {
                        age: 3,
                        group: this.groups[0],
                        name: "cookie",
                        desc: "restores 40 health when consumed",
                        req: ["food", 15],
                        consume: function(doer) {
                            return doer.changeHealth(40, doer);
                        },
                        scale: 27,
                        holdOffset: 15,
                        healing: 40,
                        itemID: 1,
                        itemAID: 17,
                    }, {
                        age: 7,
                        group: this.groups[0],
                        name: "cheese",
                        desc: "restores 30 health and another 50 over 5 seconds",
                        req: ["food", 25],
                        consume: function(doer) {
                            if (doer.changeHealth(30, doer) || doer.health < 100) {
                                doer.dmgOverTime.dmg = -10;
                                doer.dmgOverTime.doer = doer;
                                doer.dmgOverTime.time = 5;
                                return true;
                            }
                            return false;
                        },
                        scale: 27,
                        holdOffset: 15,
                        healing: 30,
                        itemID: 2,
                        itemAID: 18,
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
                        itemAID: 19,
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
                        itemAID: 20,
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
                        itemAID: 21,
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
                        itemAID: 22,
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
                        itemAID: 23,
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
                        itemAID: 24,
                    }, {
                        age: 9,
                        group: this.groups[2],
                        name: "spinning spikes",
                        desc: "damages enemies when they touch them",
                        req: ["wood", 30, "stone", 20],
                        health: 500,
                        dmg: 45,
                        turnSpeed: 0.003,
                        scale: 52,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 9,
                        itemAID: 25,
                    }, {
                        group: this.groups[3],
                        name: "windmill",
                        desc: "generates gold over time",
                        req: ["wood", 50, "stone", 10],
                        health: 400,
                        pps: 1,
                        turnSpeed: 0.0016,
                        spritePadding: 25,
                        iconLineMult: 12,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: 5,
                        itemID: 10,
                        itemAID: 26,
                    }, {
                        age: 5,
                        group: this.groups[3],
                        name: "faster windmill",
                        desc: "generates more gold over time",
                        req: ["wood", 60, "stone", 20],
                        health: 500,
                        pps: 1.5,
                        turnSpeed: 0.0025,
                        spritePadding: 25,
                        iconLineMult: 12,
                        scale: 47,
                        holdOffset: 20,
                        placeOffset: 5,
                        itemID: 11,
                        itemAID: 27,
                    }, {
                        age: 8,
                        group: this.groups[3],
                        name: "power mill",
                        desc: "generates more gold over time",
                        req: ["wood", 100, "stone", 50],
                        health: 800,
                        pps: 2,
                        turnSpeed: 0.005,
                        spritePadding: 25,
                        iconLineMult: 12,
                        scale: 47,
                        holdOffset: 20,
                        placeOffset: 5,
                        itemID: 12,
                        itemAID: 28,
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
                        itemAID: 29,
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
                        itemAID: 30,
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
                        itemAID: 31,
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
                        itemAID: 32,
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
                        itemAID: 33,
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
                        itemAID: 34,
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
                        itemAID: 35,
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
                        itemAID: 36,
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
                        itemAID: 37,
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
                    // CHECK ITEM ID:
                    this.checkItem = {
                        index: function(id, myItems) {
                            return [0, 1, 2].includes(id) ? 0 :
                            [3, 4, 5].includes(id) ? 1 :
                            [6, 7, 8, 9].includes(id) ? 2 :
                            [10, 11, 12].includes(id) ? 3 :
                            [13, 14].includes(id) ? 5 :
                            [15, 16].includes(id) ? 4 :
                            [17, 18, 19, 21, 22].includes(id) ?
                                [13, 14].includes(myItems) ? 6 :
                            5 :
                            id == 20 ?
                                [13, 14].includes(myItems) ? 7 :
                            6 :
                            undefined;
                        }
                    }
                    // ASSIGN IDS:
                    for (let i = 0; i < this.list.length; ++i) {
                        this.list[i].id = i;
                        if (this.list[i].pre) this.list[i].pre = i - this.list[i].pre;
                    }
                    // TROLOLOLOL:
                    if (typeof window !== "undefined") {
                        function shuffle(a) {
                            for (let i = a.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [a[i], a[j]] = [a[j], a[i]];
                            }
                            return a;
                        }
                        //shuffle(this.list);
                    }
                }
            }
            class Objectmanager {
                constructor(GameObject, liztobj, UTILS, config, players, server) {
                    let mathFloor = Math.floor,
                        mathABS = Math.abs,
                        mathCOS = Math.cos,
                        mathSIN = Math.sin,
                        mathPOW = Math.pow,
                        mathSQRT = Math.sqrt;

                    this.ignoreAdd = false;
                    this.hitObj = [];

                    // DISABLE OBJ:
                    this.disableObj = function(obj) {
                        obj.active = false;
                    };

                    // ADD NEW:
                    let tmpObj;
                    this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                        tmpObj = findObjectBySid(sid);
                        if (!tmpObj) {
                            tmpObj = gameObjects.find((tmp) => !tmp.active);
                            if (!tmpObj) {
                                tmpObj = new GameObject(sid);
                                gameObjects.push(tmpObj);
                            }
                        }
                        if (setSID) {
                            tmpObj.sid = sid;
                        }
                        tmpObj.init(x, y, dir, s, type, data, owner);
                    };

                    // DISABLE BY SID:
                    this.disableBySid = function(sid) {
                        let find = findObjectBySid(sid);
                        if (find) {
                            this.disableObj(find);
                        }
                    };

                    // REMOVE ALL FROM PLAYER:
                    this.removeAllItems = function(sid, server) {
                        gameObjects.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
                    };

                    // CHECK IF PLACABLE:
                    this.checkItemLocation = function(x, y, s, sM, indx, ignoreWater, placer) {
                        let cantPlace = liztobj.find((tmp) => tmp.active && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
                        if (cantPlace) return false;
                        if (!ignoreWater && indx != 18 && y >= config.mapScale / 2 - config.riverWidth / 2 && y <= config.mapScale / 2 + config.riverWidth / 2) return false;
                        return true;
                    };

                }
            }
            class Projectile {
                constructor(players, ais, objectManager, items, config, UTILS, server) {
                    // INIT:
                    this.init = function(indx, x, y, dir, spd, dmg, rng, scl, owner) {
                        this.active = true;
                        this.tickActive = true;
                        this.indx = indx;
                        this.x = x;
                        this.y = y;
                        this.x2 = x;
                        this.y2 = y;
                        this.dir = dir;
                        this.skipMov = true;
                        this.speed = spd;
                        this.dmg = dmg;
                        this.scale = scl;
                        this.range = rng;
                        this.r2 = rng;
                        this.owner = owner;
                    };
                    // UPDATE:
                    this.update = function(delta) {
                        if (this.active) {
                            let tmpSpeed = this.speed * delta;
                            if (!this.skipMov) {
                                this.x += tmpSpeed * Math.cos(this.dir);
                                this.y += tmpSpeed * Math.sin(this.dir);
                                this.range -= tmpSpeed;
                                if (this.range <= 0) {
                                    this.x += this.range * Math.cos(this.dir);
                                    this.y += this.range * Math.sin(this.dir);
                                    tmpSpeed = 1;
                                    this.range = 0;
                                    this.active = false;
                                }
                            } else {
                                this.skipMov = false;
                            }
                        }
                    };
                    this.tickUpdate = function(delta) {
                        if (this.tickActive) {
                            let tmpSpeed = this.speed * delta;
                            if (!this.skipMov) {
                                this.x2 += tmpSpeed * Math.cos(this.dir);
                                this.y2 += tmpSpeed * Math.sin(this.dir);
                                this.r2 -= tmpSpeed;
                                if (this.r2 <= 0) {
                                    this.x2 += this.r2 * Math.cos(this.dir);
                                    this.y2 += this.r2 * Math.sin(this.dir);
                                    tmpSpeed = 1;
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
                    // STORE HATS:
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
                        name: "Soldier Helmet",
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
                        dmgMultO: 1.2,
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
                    // STORE ACCESSORIES:
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
                constructor(Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
                    this.addProjectile = function(x, y, dir, range, speed, indx, owner, ignoreObj, layer, inWindow) {
                        let tmpData = items.projectiles[indx];
                        let tmpProj;
                        for (let i = 0; i < projectiles.length; ++i) {
                            if (!projectiles[i].active) {
                                tmpProj = projectiles[i];
                                break;
                            }
                        }
                        if (!tmpProj) {
                            tmpProj = new Projectile(players, ais, objectManager, items, config, UTILS, server);
                            tmpProj.sid = projectiles.length;
                            projectiles.push(tmpProj);
                        }
                        tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
                        tmpProj.ignoreObj = ignoreObj;
                        tmpProj.layer = layer || tmpData.layer;
                        tmpProj.inWindow = inWindow;
                        tmpProj.src = tmpData.src;
                        return tmpProj;
                    };
                }
            };
            class AiManager {
                // AI MANAGER:
                constructor(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {
                    // AI TYPES:
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
                        speed: 0.0,
                        turnSpeed: 0.0,
                        scale: 70,
                        spriteMlt: 1.0
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
                    // SPAWN AI:
                    this.spawn = function(x, y, dir, index) {
                        let tmpObj = ais.find((tmp) => !tmp.active);
                        if (!tmpObj) {
                            tmpObj = new AI(ais.length, objectManager, players, items, UTILS, config, scoreCallback, server);
                            ais.push(tmpObj);
                        }
                        tmpObj.init(x, y, dir, index, this.aiTypes[index]);
                        return tmpObj;
                    };
                }
            };
            class AI {
                constructor(sid, objectManager, players, items, UTILS, config, scoreCallback, server) {
                    this.sid = sid;
                    this.isAI = true;
                    this.nameIndex = UTILS.randInt(0, config.cowNames.length - 1);
                    // INIT:
                    this.init = function(x, y, dir, index, data) {
                        this.x = x;
                        this.y = y;
                        this.startX = data.fixedSpawn ? x : null;
                        this.startY = data.fixedSpawn ? y : null;
                        this.xVel = 0;
                        this.yVel = 0;
                        this.zIndex = 0;
                        this.dir = dir;
                        this.dirPlus = 0;
                        this.index = index;
                        this.src = data.src;
                        if (data.name) this.name = data.name;
                        this.weightM = data.weightM;
                        this.speed = data.speed;
                        this.killScore = data.killScore;
                        this.turnSpeed = data.turnSpeed;
                        this.scale = data.scale;
                        this.maxHealth = data.health;
                        this.leapForce = data.leapForce;
                        this.health = this.maxHealth;
                        this.chargePlayer = data.chargePlayer;
                        this.viewRange = data.viewRange;
                        this.drop = data.drop;
                        this.dmg = data.dmg;
                        this.hostile = data.hostile;
                        this.dontRun = data.dontRun;
                        this.hitRange = data.hitRange;
                        this.hitDelay = data.hitDelay;
                        this.hitScare = data.hitScare;
                        this.spriteMlt = data.spriteMlt;
                        this.nameScale = data.nameScale;
                        this.colDmg = data.colDmg;
                        this.noTrap = data.noTrap;
                        this.spawnDelay = data.spawnDelay;
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
                    let tmpRatio = 0;
                    let animIndex = 0;
                    this.animate = function(delta) {
                        if (this.animTime > 0) {
                            this.animTime -= delta;
                            if (this.animTime <= 0) {
                                this.animTime = 0;
                                this.dirPlus = 0;
                                tmpRatio = 0;
                                animIndex = 0;
                            } else {
                                if (animIndex == 0) {
                                    tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                                }
                            }
                        }
                    };
                    // ANIMATION:
                    this.startAnim = function() {
                        this.animTime = this.animSpeed = 600;
                        this.targetAngle = Math.PI * 0.8;
                        tmpRatio = 0;
                        animIndex = 0;
                    };
                };
            };
            class addCh {
                constructor(x, y, chat, tmpObj) {
                    this.x = x;
                    this.y = y;
                    this.alpha = 0;
                    this.active = true;
                    this.alive = false;
                    this.chat = chat;
                    this.owner = tmpObj;
                };
            };
            class DeadPlayer {
                constructor(x, y, dir, buildIndex, weaponIndex, weaponVariant, skinColor, scale, name) {
                    this.x = x;
                    this.y = y;
                    this.lastDir = dir;
                    this.dir = dir + Math.PI;
                    this.buildIndex = buildIndex;
                    this.weaponIndex = weaponIndex;
                    this.weaponVariant = weaponVariant;
                    this.skinColor = skinColor;
                    this.scale = scale;
                    this.name = name;
                    this.alpha = 1;
                    this.active = true;
                    this.animate = function(delta) {
                        this.x += 0.75;
                        this.y += 0.75;
                        let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                        this.alpha -= 0.0020;
                        if (this.alpha <= 0) {
                            this.alpha = 0;
                            this.active = false;
                        }
                    }
                }
            };
            class Player {
                constructor(id, sid, config, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
                    this.id = id;
                    this.sid = sid;
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
                    this.tails = {};
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].price <= 0)
                            this.tails[accessories[i].id] = 1;
                    }
                    this.skins = {};
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].price <= 0)
                            this.skins[hats[i].id] = 1;
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
                    // SPAWN:
                    this.spawn = function(moofoll) {
                        this.attacked = false;
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
                        this.scale = config.playerScale;
                        this.speed = config.playerSpeed;
                        this.resetMoveDir();
                        this.resetResources(moofoll);
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
                            53: 0,
                        };
                        this.bowThreat = {
                            9: 0,
                            12: 0,
                            13: 0,
                            15: 0,
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
                    // RESET MOVE DIR:
                    this.resetMoveDir = function() {
                        this.moveDir = undefined;
                    };
                    // RESET RESOURCES:
                    this.resetResources = function(moofoll) {
                        for (let i = 0; i < config.resourceTypes.length; ++i) {
                            this[config.resourceTypes[i]] = moofoll ? 100 : 0;
                        }
                    };
                    // ADD ITEM:
                    this.getItemType = function(id) {
                        let findindx = this.items.findIndex((ids) => ids == id);
                        if (findindx != -1) {
                            return findindx;
                        } else {
                            return items.checkItem.index(id, this.items);
                        }
                    };
                    // SET DATA:
                    this.setData = function(data) {
                        this.id = data[0];
                        this.sid = data[1];
                        this.name = data[2];
                        this.x = data[3];
                        this.y = data[4];
                        this.dir = data[5];
                        this.health = data[6];
                        this.maxHealth = data[7];
                        this.scale = data[8];
                        this.skinColor = data[9];
                    };
                    // UPDATE POISON TICK:
                    this.updateTimer = function() {
                        this.bullTimer -= 1;
                        if (this.bullTimer <= 0) {
                            this.setBullTick = false;
                            this.bullTick = game.tick - 1;
                            this.bullTimer = config.serverUpdateRate;
                        }
                        this.poisonTimer -= 1;
                        if (this.poisonTimer <= 0) {
                            this.setPoisonTick = false;
                            this.poisonTick = game.tick - 1;
                            this.poisonTimer = config.serverUpdateRate;
                        }
                    };
                    this.update = function(delta) {
                        if (this.alive) {
                            if (this.health != this.healthMov) {
                                this.health < this.healthMov ? (this.healthMov -= 2) : (this.healthMov += 2);
                                if (Math.abs(this.health - this.healthMov) < 2) this.healthMov = this.health;
                            };
                            if (this.shameCount != this.shameMov) this.shameCount < this.shameMov ? (this.shameMov -= .1) : (this.shameMov += .1), Math.abs(this.shameCount - this.shameMov) < .1 && (this.shameMov = this.shameCount);
                        }
                        if (this.sid == playerSID) {
                            this.circleRad = parseInt(getEl("circleRad").value) || 0;
                            this.circleRadSpd = parseFloat(getEl("radSpeed").value) || 0;
                            this.cAngle += this.circleRadSpd;
                        }
                        if (this.active) {
                            // MOVE:
                            let gear = {
                                skin: findID(hats, this.skinIndex),
                                tail: findID(accessories, this.tailIndex)
                            }
                            let spdMult = ((this.buildIndex >= 0) ? 0.5 : 1) * (items.weapons[this.weaponIndex].spdMult || 1) * (gear.skin ? (gear.skin.spdMult || 1) : 1) * (gear.tail ? (gear.tail.spdMult || 1) : 1) * (this.y <= config.snowBiomeTop ? ((gear.skin && gear.skin.coldM) ? 1 : config.snowSpeed) : 1) * this.slowMult;
                            this.maxSpeed = spdMult;
                        }
                    };
                    let tmpRatio = 0;
                    let animIndex = 0;
                    this.animate = function(delta) {
                        if (this.animTime > 0) {
                            this.animTime -= delta;
                            if (this.animTime <= 0) {
                                this.animTime = 0;
                                this.dirPlus = 0;
                                tmpRatio = 0;
                                animIndex = 0;
                            } else {
                                if (animIndex == 0) {
                                    tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                                }
                            }
                        }
                    };
                    // GATHER ANIMATION:
                    this.startAnim = function(didHit, index) {
                        this.animTime = this.animSpeed = items.weapons[index].speed;
                        this.targetAngle = (didHit ? -config.hitAngle : -Math.PI);
                        tmpRatio = 0;
                        animIndex = 0;
                    };
                    // CAN SEE:
                    this.canSee = function(other) {
                        if (!other) return false;
                        let dx = Math.abs(other.x - this.x) - other.scale;
                        let dy = Math.abs(other.y - this.y) - other.scale;
                        return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
                    };
                    // SHAME SYSTEM:
                    this.judgeShame = function() {
                        if (this.oldHealth < this.health) {
                            if (this.hitTime) {
                                let timeSinceHit = Date.now() - this.hitTime;
                                this.lastHit = game.tick;
                                this.hitTime = 0;
                                if (timeSinceHit < 120) {
                                    this.shameCount++;
                                } else {
                                    this.shameCount = Math.max(0, this.shameCount - 2);
                                }
                            }
                        } else if (this.oldHealth > this.health) {
                            this.hitTime = Date.now();
                        }
                    };
                    this.addShameTimer = function() {
                        this.shameCount = 0;
                        this.shameTimer = 30;
                        let interval = setInterval(() => {
                            this.shameTimer--;
                            if (this.shameTimer <= 0) {
                                clearInterval(interval);
                            }
                        }, 1000);
                    };
                    // CHECK TEAM:
                    this.isTeam = function(tmpObj) {
                        return (this == tmpObj || (this.team && this.team == tmpObj.team));
                    };
                    // FOR THE PLAYER:
                    this.findAllianceBySid = function(sid) {
                        return this.team ? alliancePlayers.find((THIS) => THIS === sid) : null;
                    };
                    this.checkCanInsta = function(nobull) {
                        let totally = 0;
                        if (this.alive && inGame) {
                            let primary = {
                                weapon: this.weapons[0],
                                variant: this.primaryVariant,
                                dmg: this.weapons[0] == undefined ? 0 : items.weapons[this.weapons[0]].dmg,
                            };
                            let secondary = {
                                weapon: this.weapons[1],
                                variant: this.secondaryVariant,
                                dmg: this.weapons[1] == undefined ? 0 : items.weapons[this.weapons[1]].Pdmg,
                            };
                            let bull = this.skins[7] && !nobull ? 1.5 : 1;
                            let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1;
                            if (primary.weapon != undefined && this.reloads[primary.weapon] == 0) {
                                totally += primary.dmg * pV * bull;
                            }
                            if (secondary.weapon != undefined && this.reloads[secondary.weapon] == 0) {
                                totally += secondary.dmg;
                            }
                            if (this.skins[53] && this.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate) && near.skinIndex != 22) {
                                totally += 25;
                            }
                            totally *= near.skinIndex == 6 ? 0.75 : 1;
                            return totally;
                        }
                        return 0;
                    };
                    // UPDATE WEAPON RELOAD:
                    this.manageReload = function() {
                        if (this.shooting[53]) {
                            this.shooting[53] = 0;
                            this.reloads[53] = (2500 - game.tickRate);
                        } else {
                            if (this.reloads[53] > 0) {
                                this.reloads[53] = Math.max(0, this.reloads[53] - game.tickRate);
                            }
                        }
                        if (this.gathering || this.shooting[1]) {
                            if (this.gathering) {
                                this.gathering = 0;
                                this.reloads[this.gatherIndex] = (items.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                            }
                            if (this.shooting[1]) {
                                this.shooting[1] = 0;
                                this.reloads[this.shootIndex] = (items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                            }
                        } else {
                            this.attacked = false;
                            if (this.buildIndex < 0) {
                                if (this.reloads[this.weaponIndex] > 0) {
                                    this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - game.tickRate);
                                    if (this == player) {
                                        if (getEl("weaponGrind").checked) {
                                            for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                                checkPlace(player.getItemType(22), i);
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
                    // FOR ANTI INSTA:
                    this.addDamageThreat = function(tmpObj) {
                        let primary = {
                            weapon: this.primaryIndex,
                            variant: this.primaryVariant
                        };
                        primary.dmg = primary.weapon == undefined ? 45 : items.weapons[primary.weapon].dmg;
                        let secondary = {
                            weapon: this.secondaryIndex,
                            variant: this.secondaryVariant
                        };
                        secondary.dmg = secondary.weapon == undefined ? 50 : items.weapons[secondary.weapon].Pdmg;
                        let bull = 1.5;
                        let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1.18;
                        let sV = secondary.variant != undefined ? [9, 12, 13, 15].includes(secondary.weapon) ? 1 : config.weaponVariants[secondary.variant].val : 1.18;
                        if (primary.weapon == undefined ? true : this.reloads[primary.weapon] == 0) {
                            this.damageThreat += primary.dmg * pV * bull;
                        }
                        if (secondary.weapon == undefined ? true : this.reloads[secondary.weapon] == 0) {
                            this.damageThreat += secondary.dmg * sV;
                        }
                        if (this.reloads[53] <= game.tickRate) {
                            this.damageThreat += 25;
                        }
                        this.damageThreat *= tmpObj.skinIndex == 6 ? 0.75 : 1;
                        if (!this.isTeam(tmpObj)) {
                            if (this.dist2 <= 300) {
                                tmpObj.damageThreat += this.damageThreat;
                            }
                        }
                    };
                }
            };
            // SOME CODES:
            function sendUpgrade(index) {
                player.reloads[index] = 0;
                packet("H", index);
            }
            function storeEquip(id, index) {
                packet("c", 0, id, index);
            }
            function storeBuy(id, index) {
                packet("c", 1, id, index);
            }
            function buyEquip(id, index) {
                let nID = player.skins[6] ? 6 : 0;
                if (player.alive && inGame) {
                    if (index == 0) {
                        if (player.skins[id]) {
                            if (player.latestSkin != id) {
                                packet("c", 0, id, 0);
                            }
                        } else {
                            if (configs.autoBuyEquip) {
                                let find = findID(hats, id);
                                if (find) {
                                    if (player.points >= find.price) {
                                        //setTimeout(()=>{
                                        packet("c", 1, id, 0);
                                        //setTimeout(()=>{
                                        packet("c", 0, id, 0);
                                        //}, 120);
                                        //}, 120);
                                    } else {
                                        if (player.latestSkin != nID) {
                                            packet("c", 0, nID, 0);
                                        }
                                    }
                                } else {
                                    if (player.latestSkin != nID) {
                                        packet("c", 0, nID, 0);
                                    }
                                }
                            } else {
                                if (player.latestSkin != nID) {
                                    packet("c", 0, nID, 0);
                                }
                            }
                        }
                    } else if (index == 1) {
                        if (player.tails[id]) {
                            if (player.latestTail != id) {
                                packet("c", 0, id, 1);
                            }
                        } else {
                            if (configs.autoBuyEquip) {
                                let find = findID(accessories, id);
                                if (find) {
                                    if (player.points >= find.price) {
                                        packet("c", 1, id, 1);
                                        // setTimeout(()=>{
                                        packet("c", 0, id, 1);
                                        //}, 120);
                                    } else {
                                        if (player.latestTail != 0) {
                                            packet("c", 0, 0, 1);
                                        }
                                    }
                                } else {
                                    if (player.latestTail != 0) {
                                        packet("c", 0, 0, 1);
                                    }
                                }
                            } else {
                                if (player.latestTail != 0) {
                                    packet("c", 0, 0, 1);
                                }
                            }
                        }
                    }
                }
            }
            function selectToBuild(index, wpn) {
                packet("G", index, wpn);
            }
            function selectWeapon(index, isPlace) {
                if (!isPlace) {
                    player.weaponCode = index;
                }
                packet("G", index, 1);
            }
            function sendAutoGather() {
                packet("K", 1, 1);
            }
            function sendAtck(id, angle) {
                packet("d", id, angle, 1);
            }
            function toRadian(angle) {
                let fixedAngle = (angle % 360) * (Math.PI / 180);
                return fixedAngle < 0 ? (2 * Math.PI + fixedAngle) : fixedAngle;
            }

            // PLACER:
           function place(id, rad, rmd) {
                try {
                    if (id == undefined) return;
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (id === 0 || testMode || (player.alive && inGame && player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (config.isSandbox ? id === 3 || id === 5 ? 299 : 99 : item.group.limit ? item.group.limit : 99))) {
                        selectToBuild(player.items[id]);
                        sendAtck(1, rad);
                        selectWeapon(player.weaponCode, 1);
                        //checkPlace(1, rad);
                        //this.testCanPlace(id, rad);
                        if ((rmd || id)) {
                            placeVisible.push({
                                x: tmpX,
                                y: tmpY,
                                name: item.name,
                                scale: item.scale,
                                dir: rad
                            });
                            game.tickBase(() => {
                                placeVisible.shift();
                            }, 1);
                        } else {
                            placeVisible.shift();
                        }
                    }
                } catch (e) { }
            }


            function getDist(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }
            // GET DIRECTION
            function getDir(e, t) {
                try {
                    return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return 0;
                }
            }

            function sortFromSmallest(arr, func) { // dist - dist
                func = typeof func == "function" ? func : (obj) => {
                    return obj
                };
                return arr.sort((two, one) => (func(two)) - func(one));
            }
            /*
        tmpList = objectManager.getGridArrays(user.x2, user.y2, 500);
                        for (var x = 0; x < tmpList.length; ++x) {
                            for (var y = 0; y < tmpList[x].length; ++y) {
                                if (tmpList[x][y].active && getDist(player, tmpList[x][y]))
                            }
                        }
        */
            function getCloseBuildings() {
                let buildings = [];
                let addedBefore = {};
                let filteredBuildings = objectManager.getGridArrays(player.x, player.y, 200);
                //console.log(filteredBuildings);
                for (var x = 0; x < filteredBuildings.length; ++x) {
                    for (var y = 0; y < filteredBuildings[x].length; ++y) {
                        if (filteredBuildings[x][y].active) {
                            buildings.push(filteredBuildings[x][y]);
                        }
                    }
                }
                //console.log(buildings);
                return buildings;
            }
            function quadSpikeBreak(user, item) {
                try {
                    let angles = [];
                    let possibleOnes = [];
                    for (let angle = 0; angle < 72; angle++) {
                        angles.push(toRadian(angle * 5));
                    }
                    let buildings_ = sortFromSmallest(gameObjects.filter(t => t.active && t.sid != player.inTrap.sid && getDist(player, t) <= 150), (a)=>{
                        return getDist(player, a);
                    });
                    let last = null;
                    for (let angle of angles) {
                        let position = player.buildItemPosition(item, angle);
                        let possibleToPlace = true;
                        if (18 != item.id && position.y >= config.mapScale / 2 - config.riverWidth / 2 && position.y <= config.mapScale / 2 + config.riverWidth / 2) {
                            possibleToPlace = false;
                        } else if(last && getDist(last, position) < item.scale + (last.blocker ? last.blocker : last.getScale(0.6, last.isItem))){
                            possibleToPlace = false;
                        } else {
                            for (let building of buildings_) {
                                let range = building.blocker ? building.blocker : building.getScale(0.6, building.isItem);
                                if (getDist(building, position) < item.scale + range) { // overlap
                                    possibleToPlace = false;
                                    last = building;
                                    break;
                                }
                            }
                        }
                        if (possibleToPlace) {
                            possibleOnes.push(angle);
                        }
                    }
                    return possibleOnes;
                } catch (e) {
                    //console.log(e);
                }
            }
            function getPlaceablePositions(user, item) {
                try {
                    let angles = [];
                    let possibleOnes = [];
                    for (let angle = 0; angle < 72; angle++) {
                        angles.push(toRadian(angle * 5));
                    }
                    let buildings_ = [];
                    if (!window.isMohMoh) {
                        buildings_ = sortFromSmallest(gameObjects.filter(t => t.active && getDist(player, t) <= 150), (a)=>{
                            return getDist(player, a);
                        });
                    }
                    let last = null;
                    for (let angle of angles) {
                        let position = player.buildItemPosition(item, angle);
                        let possibleToPlace = true;
                        if (18 != item.id && position.y >= config.mapScale / 2 - config.riverWidth / 2 && position.y <= config.mapScale / 2 + config.riverWidth / 2) {
                            possibleToPlace = false;
                        } else if(last && getDist(last, position) < item.scale + (last.blocker ? last.blocker : last.getScale(0.6, last.isItem))){
                            possibleToPlace = false;
                        } else if (true) {
                            for (let building of buildings_) {
                                let range = building.blocker ? building.blocker : building.getScale(0.6, building.isItem);
                                if (getDist(building, position) < item.scale + range) { // overlap
                                    possibleToPlace = false;
                                    last = building;
                                    break;
                                }
                            }
                        }
                        if (possibleToPlace) {
                            possibleOnes.push(angle);
                        }
                    }
                    return possibleOnes;
                } catch (e) {
                    //console.log(e);
                }
            }
            let firstCheckPlaceForntiBUg = false;
            function simplePlace(id, radian) {
                checkPlace(id, radian);
            };


            function checkPlace(id, rad) {
                try {
                    if (secPacket.count >= 80) return;
                    //if (id == undefined) return;
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
                        place(id, rad, 1);
                    }
                } catch (e) {}
            }
            function inBetween(angle, arra) { // okay the thing i have left to fix is if the first angle is not in the right quadrant i need to make sure that the second one is less far(another checking of which quadrant it is depending on the angle)
                //mental health is not looking good rn
                let array1q
                let array = new Array(2);
                let array2q

                if (Math.sin(angle) > 0 && Math.cos(angle) > 0) {//angle in the first quadrant
                    array[0] = arra[0]
                    array[1] = arra[1]
                } else if (Math.sin(angle) > 0 && Math.cos(angle) < 0) {//angle is inside the second quadrant
                    angle = angle - (Math.PI / 2)
                    array[0] = arra[0] - (Math.PI / 2)
                    array[1] = arra[1] - (Math.PI / 2)
                } else if (Math.sin(angle) < 0 && Math.cos(angle) < 0) {// angle is in the third quadrant
                    angle = angle - Math.PI
                    array[0] = arra[0] - Math.PI
                    array[1] = arra[1] - Math.PI

                } else if (Math.sin(angle) < 0 && Math.cos(angle) > 0) {//angle is in the fourth quadrant
                    angle = angle - ((3 * Math.PI) / 2)
                    array[0] = arra[0] - ((3 * Math.PI) / 2)
                    array[1] = arra[1] - ((3 * Math.PI) / 2)
                }
                if (Math.sin(array[0]) > 0 && Math.cos(array[0]) > 0) {
                    array1q = 1
                } else if (Math.sin(array[0]) > 0 && Math.cos(array[0]) < 0) {
                    array1q = 2
                } else if (Math.sin(array[0]) < 0 && Math.cos(array[0]) < 0) {
                    array1q = 3
                } else if (Math.sin(array[0]) < 0 && Math.cos(array[0]) > 0) {
                    array1q = 4
                }
                if (Math.sin(array[1]) > 0 && Math.cos(array[1]) > 0) {
                    array2q = 1
                } else if (Math.sin(array[1]) > 0 && Math.cos(array[1]) < 0) {
                    array2q = 2
                } else if (Math.sin(array[1]) < 0 && Math.cos(array[1]) < 0) {
                    array2q = 3
                } else if (Math.sin(array[1]) < 0 && Math.cos(array[1]) > 0) {
                    array2q = 4
                }

                if (array1q == 1) {//lowest angle of the not allowed zone in the first quadrant

                    if (Math.sin(angle) < Math.sin(array[0])) {//if the angle is lower than the not allowed zone (probably not in between)
                        if (array2q == 1) {// if the second part of the not allowed zone is in the first quadrant
                            if (Math.sin(angle) < Math.sin(array[2])) {//if it wraps completely around and makes it in between
                                return true
                            } else {//doesn't wrap around enough
                                return false
                            }
                        } else {//not in the first quadrant, not in between
                            return false
                        }
                    } else {//if the angle is further than the not allowed zone
                        if (array2q == 1) {//if the second part of the not allowed zone is in the first quadrant
                            if (Math.sin(angle) < Math.sin(array[2])) {//if the angle is lower than the top limit (in between)

                                return true
                            } else {//is not in between
                                return false
                            }

                        } else {//its gonna be somewhere further so its in between
                            return true;
                        }
                    }
                } else {
                    if (array2q == 1) {//if the further part of the not allowed zone is in the first quadrant
                        if (Math.sin(angle) < Math.sin(array[1])) {//if it wraps all the way around
                            return true
                        } else {
                            return false
                        }
                    } else {
                        if (array1q == 2) {//if lowest angle is in the second
                            if (array2q == 2) {
                                if (Math.sin(array[0]) < Math.sin(array[1])) {
                                    return true
                                } else {
                                    return false
                                }
                            } else {
                                return false
                            }
                        } else if (array1q == 3) {//if the first one is in the third
                            if (array1q > array2q) {
                                return true
                            } else if (array1q < array2q) {
                                return false
                            } else {
                                if (Math.sin(array[0]) < Math.sin(array[1])) {
                                    return true
                                } else {
                                    return false
                                }
                            }
                        } else if (array1q == 4) {//if the first one is in the third
                            if (array1q > array2q) {
                                return true
                            } else if (array1q < array2q) {
                                return false
                            } else {
                                if (Math.sin(array[0]) > Math.sin(array[1])) {
                                    return true
                                } else {
                                    return false
                                }
                            }
                        }
                    }

                }

            }
            // HEALING:
            function soldierMult() {
                return player.latestSkin == 6 ? 0.75 : 1;
            }
            function getAttacker(damaged) {
                let attackers = enemy.filter(tmp => {
                    let damages = new Damages(items);
                    let dmg = damages.weapons[tmp.weaponIndex];
                    let by = tmp.weaponIndex < 9 ? [dmg[0], dmg[1], dmg[2], dmg[3]] : [dmg[0], dmg[1]];
                    let rule = {
                        one: tmp.dist2 <= 300,
                        two: by.includes(damaged),
                        three: tmp.attacked
                    }
                    return rule.one && rule.two && rule.three;
                });
                return attackers;
            }
            function healer() {
                for (let i = 0; i < healthBased(); i++) {
                    place(0, getAttackDir());
                }
            }
            // ADVANCED:
            function applCxC(value) {
                if (player.health == 100)
                    return 0;
                if (player.skinIndex != 45 && player.skinIndex != 56) {
                    return Math.ceil(value / items.list[player.items[0]].healing);
                }
                return 0;
            }
            function healthBased() {
                if (player.health == 100)
                    return 0;
                if (player.skinIndex != 45 && player.skinIndex != 56) {
                    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
                }
                return 0;
            }
            function calcDmg(value) {
                return value * player.skinIndex == 6 ? 0.75 : 1;
            }
            // LATER:
            function predictHeal() { }
            function antiSyncHealing(timearg) {
                my.antiSync = true;
                let healAnti = setInterval(() => {
                    if (player.shameCount < 5) {
                        place(0, getAttackDir());
                    }
                }, 75);
                setTimeout(() => {
                    clearInterval(healAnti);
                    setTimeout(() => {
                        my.antiSync = false;
                    }, game.tickRate);
                }, game.tickRate);
            }
            const placedSpikePositions = new Set();
            const placedTrapPositions = new Set();
            function isPositionValid(position) {
                const playerX = player.x2;
                const playerY = player.y2;
                const distToPosition = Math.hypot(position[0] - playerX, position[1] - playerY);
                return distToPosition > 35;
            }
            function findAllianceBySid(sid) {
                return player.team ? alliancePlayers.find((THIS) => THIS === sid) : null;
            }
            function calculatePossibleTrapPositions(x, y, radius) {
                const trapPositions = [];
                const numPositions = 16;
                for (let i = 0; i < numPositions; i++) {
                    const angle = (2 * Math.PI * i) / numPositions;
                    const offsetX = x + radius * Math.cos(angle);
                    const offsetY = y + radius * Math.sin(angle);
                    const position = [offsetX, offsetY];
                    if (!trapPositions.some((pos) => isPositionTooClose(position, pos))) {
                        trapPositions.push(position);
                    }
                }
                return trapPositions;
            }
            function isPositionTooClose(position1, position2, minDistance = 50) {
                const dist = Math.hypot(position1[0] - position2[0], position1[1] - position2[1]);
                return dist < minDistance;
            }
            function biomeGear(mover, returns) {
                if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                    if (returns) return 31;
                    buyEquip(31, 0);
                } else {
                    if (player.y2 <= config.snowBiomeTop) {
                        if (returns) return mover && player.moveDir == undefined ? 22 : 15;
                        buyEquip(mover && player.moveDir == undefined ? 22 : 15, 0);
                    } else {
                        if (returns) return mover && player.moveDir == undefined ? 22 : 12;
                        buyEquip(mover && player.moveDir == undefined ? 22 : 12, 0);
                    }
                }
                if (returns) return 0;
            }
            function woah(mover) {
                buyEquip(mover && player.moveDir == undefined ? 0 : 11, 1);
            }
            let advHeal = [];
            class Traps {
                constructor(UTILS, items) {
                    this.dist = 0;
                    this.aim = 0;
                    this.inTrap = false;
                    this.replaced = false;
                    this.antiTrapped = false;
                    this.info = {};
                    this.notFast = function() {
                        return player.weapons[1] == 10 && ((this.info.health > items.weapons[player.weapons[0]].dmg) || player.weapons[0] == 5);
                    }
                    this.testCanPlace = function(id, first = -(Math.PI / 2), repeat = (Math.PI / 2), plus = (Math.PI / 18), radian, replacer, yaboi) {
                        try {
                            let item = items.list[player.items[id]];
                            let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                            let counts = {
                                attempts: 0,
                                placed: 0
                            };
                            let tmpObjects = [];
                            gameObjects.forEach((p) => {
                                tmpObjects.push({
                                    x: p.x,
                                    y: p.y,
                                    active: p.active,
                                    blocker: p.blocker,
                                    scale: p.scale,
                                    isItem: p.isItem,
                                    type: p.type,
                                    colDiv: p.colDiv,
                                    getScale: function(sM, ig) {
                                        sM = sM || 1;
                                        return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4)
                                                             ? 1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                                    },
                                });
                            });
                            for (let i = first; i < repeat; i += plus) {
                                counts.attempts++;
                                let relAim = radian + i;
                                let tmpX = player.x2 + tmpS * Math.cos(relAim);
                                let tmpY = player.y2 + tmpS * Math.sin(relAim);
                                let cantPlace = tmpObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                                if (cantPlace) continue;
                                if (item.id != 18 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                                if ((!replacer && yaboi) || useWasd) {
                                    if (useWasd ? false : yaboi.inTrap) {
                                        if (UTILS.getAngleDist(near.aim2 + Math.PI, relAim + Math.PI) <= Math.PI) {
                                            place(2, relAim, 1);
                                        } else {
                                            player.items[4] == 15 && place(4, relAim, 1);
                                        }
                                    } else {
                                        if (UTILS.getAngleDist(near.aim2, relAim) <= config.gatherAngle / 1.5) {
                                            place(2, relAim, 1);
                                        } else {
                                            player.items[4] == 15 && place(4, relAim, 1);
                                        }
                                    }
                                } else {
                                    place(id, relAim, 1);
                                }
                                tmpObjects.push({
                                    x: tmpX,
                                    y: tmpY,
                                    active: true,
                                    blocker: item.blocker,
                                    scale: item.scale,
                                    isItem: true,
                                    type: null,
                                    colDiv: item.colDiv,
                                    getScale: function() {
                                        return this.scale;
                                    },
                                });
                                if (UTILS.getAngleDist(near.aim2, relAim) <= 1) {
                                    counts.placed++;
                                }
                            }
                            if (counts.placed > 0 && replacer && item.dmg) {
                                if (near.dist2 <= items.weapons[player.weapons[0]].range + (player.scale * 1.8) && configs.spikeTick) {
                                    instaC.canSpikeTick = true;
                                }
                            }
                        } catch (err) {
                        }
                    };
                    this.checkSpikeTick = function() {
                        try {
                            if (![3, 4, 5].includes(near.primaryIndex)) return false;
                            if ((getEl("safeAntiSpikeTick").checked || my.autoPush) ? false : near.primaryIndex == undefined ? true : (near.reloads[near.primaryIndex] > game.tickRate)) return false;
                            // more range for safe. also testing near.primaryIndex || 5
                            if (near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                let item = items.list[9];
                                let tmpS = near.scale + item.scale + (item.placeOffset || 0);
                                let danger = 0;
                                let counts = {
                                    attempts: 0,
                                    block: `unblocked`
                                };
                                for (let i = -1; i <= 1; i += 1 / 10) {
                                    counts.attempts++;
                                    let relAim = UTILS.getDirect(player, near, 2, 2) + i;
                                    let tmpX = near.x2 + tmpS * Math.cos(relAim);
                                    let tmpY = near.y2 + tmpS * Math.sin(relAim);
                                    let cantPlace = gameObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                                    if (cantPlace) continue;
                                    if (tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                                    danger++;
                                    counts.block = `blocked`;
                                    break;
                                }
                                if (danger) {
                                    my.anti0Tick = 1;
                                    player.chat.message = "Anti SpikeTick " + near.sid;
                                    player.chat.count = 2000;
                                    return true;
                                }
                            }
                        } catch (err) {
                            return null;
                        }
                        return false;
                    }
                    this.protect = function (aim) {
                        if (!configs.antiTrap) return;
                        if (player.items[4]) {
                            for (let i = 0; i < Math.PI * 2; i += Math.PI / 4) {
                                this.testCanPlace(4, -(Math.PI / 2), Math.PI / 2, Math.PI / 18, aim + i);
                            }
                            this.antiTrapped = true;
                        }
                        const BackPotential = async function (e, t, i, r, k, d, n = near) {
                            t = n && Math.hypot(n.y2 - player.y2, n.x2 - player.x2) >= 350 ? player.items[4] : player.items[2];
                            if (t === player.items[2]) {
                                i = Math.atan2(e.y - player.y2, e.x - player.x2);
                                r = Math.atan2(n.y - player.y2, n.x - player.x2);
                                k = Math.abs(i - r);
                                t = k <= Math.PI ? player.items[2] : t;
                                for (i = 0; i <= Math.PI * 2; i += Math.PI / 32) this.testCanPlace(4, -(Math.PI / 2), Math.PI / 2, Math.PI / 32, aim + i);
                            }
                        }
                        };
                    this.ReTrap = function() {
                        let range = items.weapons[player.weaponIndex].range + 70;
                        gameObjects.forEach(tmpObj => {
                            if(enemy.length) {
                                let objDst = UTILS.getDist(tmpObj, player, 0, 2);
                                let perfectAngle = UTILS.getDirect(tmpObj, player, 0, 2);
                                game.tickBase(() => {
                                    if (near.dist2 <= range && tmpObj.health <= 272.58 && PrePlaceCount < 15 && fgdo(tmpObj, player) <= range || ((near.length && near.reloads[near.weaponIndex] <= config.tickRate * (window.pingTime >= 200 ? 2 : 1)) || player.reloads[player.weaponIndex]*1000 <= config.tickRate * (window.pingTime >= 200 ? 2 : 1))) {
                                        place(2, perfectAngle);
                                        PrePlaceCount++;

                                    } else if (near.dist2 > range && tmpObj.health <= 272.58 && PrePlaceCount >= 0 && fgdo(tmpObj, player) <= range || ((near.length && near.reloads[near.weaponIndex] <= config.tickRate * (window.pingTime >= 200 ? 2 : 1)) || player.reloads[player.weaponIndex]*1000 <= config.tickRate * (window.pingTime >= 200 ? 2 : 1))) {
                                        PrePlaceCount--;
                                    }
                                }, 1);
                            }
                        });
                    }

                    this.runPrePlacer = function() {
                        if (enemies.length) {
                            let prePlaceObj = gameObjects.find(U => (getDist(player, U) <= 250) && (100*U.buildHealth/U.health) <= Math.max(getPossibleObjDmg(player), getPossibleObjDmg(enemy)) + 10);
                            if (enemies.length && prePlaceObj && !player.inTrap && ((getDist(player, prePlaceObj) <= items.weapons[player.weapons[0]].range) && (getDist(enemy, prePlaceObj) <= items.weapons[player.weapons[0]].range))) {
                                let position = player.buildItemPosition(items.list[player.items[2]], getDir(player, prePlaceObj));
                                let tmpObjPredict = {
                                    x: position.x,
                                    y: position.y,
                                    scale: items.list[player.items[2]].scale,
                                };
                                if (enemies.length) {
                                    placeVisible.add(position, 1, prePlaceObj, tmpObjPredict.scale, true);
                                }
                                setTickout(() => {
                                    spikeTickPlace(2, getDir(player, prePlaceObj));
                                    placeableSpikes.filter((i)=>UTILS.getAngleDist(i, getDir(player, prePlaceObj)) <= Math.PI/2).forEach(function(i){
                                        spikeTickPlace(2, i)
                                    })
                                }, 1);
                            }
                        }
                    }
                    function getPossibleObjDmg(user) {
                        return (items.weapons[player.weapons[player.weapons[1] ? Number(player.weapons[1] == 10) : 0]].dmg / 4) * (player.skins[40] ? 3.3 : 1) * (items.weapons[player.weapons[Number(player.weapons[1] == 10)]].sDmg || 1);
                    }
                    function spikeTickPlace(id, radian) {
                        var item = items.list[player.items[id]];
                        if (checkPlace(id, radian) && item.dmg) {
                            if (enemies.length && enemies.find(e => e.skinIndex != 6 && getDist(player.buildItemPosition(items.list[player.items[2]], radian), e) <= 35 + items.list[player.items[2]].scale)) {
                                placerSpikeTick = true;
                            }
                        }
                    }


                    this.autoPlace = function () {
                        if (enemy.length && configs.autoPlace && !instaC.ticking && !getEl("placer").checked) {
                            if (gameObjects.length) {
                                let near2 = {
                                    inTrap: false,
                                };
                                let nearTrap = gameObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function (a, b) {
                                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                                })[0];
                                if (nearTrap) {
                                    near2.inTrap = true;
                                } else {
                                    near2.inTrap = false;
                                }
                                if (testMode ? enemy.length : (near.dist2 <= 300)) {
                                    if (near.dist2 <= 200) {
                                        this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2, 0, {inTrap: near2.inTrap});
                                        traps.ReTrap();
                                    } else {
                                        player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                    }
                                }
                            } else {
                                if (testMode ? enemy.length : (near.dist2 <= 300)) {
                                    player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                    traps.ReTrap();
                                }
                            }
                        }
                        try {
                            if (getEl("placer").checked && autoPush.pushing == false) {
                                const nearEnemyDist2 = near.dist2;
                                const trap1 = gameObjects
                                .filter((e) => e.trap && e.active)
                                .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                                .find((trap) => {
                                    const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                                    return (
                                        trap !== player &&
                                        (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                                        trapDist <= 50
                                    );
                                });
                                if (trap1 && nearEnemyDist2 <= 160) {
                                    const trapX = trap1.x;
                                    const trapY = trap1.y;
                                    const circleRadius = 102;
                                    const numPositions = 64;
                                    for (let i = 0; i < numPositions; i++) {
                                        const angle = (2 * Math.PI * i) / numPositions;
                                        const offsetX = trapX + circleRadius * Math.cos(angle);
                                        const offsetY = trapY + circleRadius * Math.sin(angle);
                                        const position = [offsetX, offsetY];
                                        const distToPlayer = Math.hypot(position[0] - player.x2, position[1] - player.y2);
                                        if (
                                            !placedSpikePositions.has(JSON.stringify(position)) &&
                                            isPositionValid(position) &&
                                            distToPlayer <= 87
                                        ) {
                                            const angleToPlace = Math.atan2(position[1] - player.y2, position[0] - player.x2);
                                            checkPlace(2, angleToPlace);
                                            placedSpikePositions.add(JSON.stringify(position));
                                        }
                                    }
                                } else if (!trap1 && nearEnemyDist2 <= 206) {
                                    placedSpikePositions.clear();
                                    const maxTrapsToPlace = 3;
                                    const trapRadius = 50;
                                    const trapPositions = calculatePossibleTrapPositions(player.x2, player.y2, trapRadius);
                                    let trapsPlaced = 0;
                                    for (const position of trapPositions) {
                                        if (
                                            trapsPlaced < maxTrapsToPlace &&
                                            !placedTrapPositions.has(JSON.stringify(position)) &&
                                            isPositionValid(position)
                                        ) {
                                            checkPlace(4, ...position);
                                            placedTrapPositions.add(JSON.stringify(position));
                                            trapsPlaced++;
                                        }
                                    }
                                }
                            }
                        } catch (e) {}
                    };

                    /*this.autoPlace = function() {
            if (enemy.length && configs.autoPlace && !instaC.ticking) {
                if (game.tick % (Math.max(1, parseInt(getEl("autoPlaceTick").value)) || 1) === 0) {
                    if (gameObjects.length) {
                        let near2 = {
                            inTrap: false,
                        };
                        let nearTrap = gameObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function(a, b) {
                            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                        })[0];
                        if (nearTrap) {
                            near2.inTrap = true;
                        } else {
                            near2.inTrap = false;
                        }
                        if (near.dist3 <= 450) {
                            if (near.dist3 <= 200) {
                                this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2, 0, {
                                    inTrap: near2.inTrap
                                });
                            } else {
                                player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                            }
                        }
                    } else {
                        if (near.dist3 <= 450) {
                            player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                        }
                    }
                }
            }
        };*/





                    /*                   this.autoPlace = function () { //RVN LOGIC AUTOPLACER
              try {
                  const nearEnemyDist2 = near.dist2;
                  const trap1 = gameObjects
                  .filter((e) => e.trap && e.active)
                  .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                  .find((trap) => {
                      const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                      return (
                          trap !== player &&
                          (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                          trapDist <= 50
                      );
                  });
                  if (trap1 && nearEnemyDist2 <= 160) {
                      const trapX = trap1.x;
                      const trapY = trap1.y;
                      const circleRadius = 102;
                      const numPositions = 64;
                      for (let i = 0; i < numPositions; i++) {
                          const angle = (2 * Math.PI * i) / numPositions;
                          const offsetX = trapX + circleRadius * Math.cos(angle);
                          const offsetY = trapY + circleRadius * Math.sin(angle);
                          const position = [offsetX, offsetY];
                          const distToPlayer = Math.hypot(position[0] - player.x2, position[1] - player.y2);
                          if (
                              !placedSpikePositions.has(JSON.stringify(position)) &&
                              isPositionValid(position) &&
                              distToPlayer <= 87
                          ) {
                              const angleToPlace = Math.atan2(position[1] - player.y2, position[0] - player.x2);
                              checkPlace(2, angleToPlace);
                              placedSpikePositions.add(JSON.stringify(position));
                          }
                      }
                  } else if (!trap1 && nearEnemyDist2 <= 206) {
                      placedSpikePositions.clear();
                      const maxTrapsToPlace = 3;
                      const trapRadius = 50;
                      const trapPositions = calculatePossibleTrapPositions(player.x2, player.y2, trapRadius);
                      let trapsPlaced = 0;
                      for (const position of trapPositions) {
                          if (
                              trapsPlaced < maxTrapsToPlace &&
                              !placedTrapPositions.has(JSON.stringify(position)) &&
                              isPositionValid(position)
                          ) {
                              checkPlace(4, ...position);
                              placedTrapPositions.add(JSON.stringify(position));
                              trapsPlaced++;
                          }
                      }
                  }
              } catch (e) {}
          };*/
                    function calculatePerfectAngle(x1, y1, x2, y2) {
                        return Math.atan2(y2 - y1, x2 - x1);
                    }
                    function isObjectBroken(object) {
                        const healthThreshold = 20;
                        return object.health < healthThreshold;
                    }
                   /* this.replacer = function(findObj) { //
                        const trap1 = gameObjects
                        .filter((e) => e.trap && e.active)
                        .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                        .find((trap) => {
                            const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                            return (
                                trap !== player &&
                                (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                                trapDist <= 50
                            );
                        });
                        if (!findObj) return;
                        if (!inGame) return;
                        if (this.antiTrapped) return;

                        game.tickBase(() => {
                            let objAim = UTILS.getDirect(findObj, player, 0, 2);
                            let objDst = UTILS.getDist(findObj, player, 0, 2);

                            let perfectAngle = Math.round(calculatePerfectAngle(findObj.x, findObj.y, player.x, player.y) / (Math.PI / 2)) * (Math.PI / 2);

                            if (getEl("weaponGrind").checked && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;

                            if (objDst <= 400 && near.dist2 <= 400) {
                                if (isObjectBroken(findObj)) {
                                    let danger = this.checkSpikeTick();

                                    if (!danger && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                        this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), objAim , 1);
                                    } else {
                                        if (player.items[4] == 15) {
                                           this.testCanPlace(near.dist2 > 250 ? 4 : 2, 0, (Math.PI * 2), (Math.PI / 24), objAim , 1);
                                            notif("Replace Obj " + objAim, "(Notif)");
                                            //player.chat.message = "Replace Objects";
                                            //player.chat.count = 1000;
                                        }
                                                                            if (near.dist2 < 250) {
                                for(let i = 0; i < Math.PI*2;i += Math.PI/9){
                                    checkPlace(2, near.aim2 + i);
                                }
                            } else {
                                for(let i = 0; i < Math.PI*2;i += Math.PI/9){
                                    checkPlace(4, near.aim2 + i);
                                }
                            }
                                    }
                                    this.replaced = true;
                                }
                            }
                        }, 1);
                    }
                }
            }*/
                  /*  this.replacer = function(findObj) {
                        if (!findObj || !configs.autoReplace) return;
                        if (!inGame) return;
                        if (this.antiTrapped) return;
                        game.tickBase(() => {
                            let objAim = UTILS.getDirect(findObj, player, 0, 2);
                            let objDst = UTILS.getDist(findObj, player, 0, 2);
                            if (configs.autoGrind && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;
                            if (objDst <= 400 && near.dist2 <= 400) {
                                let danger = this.checkSpikeTick();
                                if (!danger && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                    //this.testCanPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), objAim, 1);
                                    this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                                } else {
                                    player.items[4] == 15 && this.testCanPlace(near.dist2 > 250 ? 4 : 2, 0, (Math.PI * 2), (Math.PI / 24), objAim , 1);
                                    notif("Replace Obj " + objAim, "(Notif)");
                                }
                                this.replaced = true;
                            }
                        }, 1);
                    };
                }
            };*/
            this.replacer = function(findObj) { // replacer lmfao best
                const trap1 = gameObjects
                        .filter((e) => e.trap && e.active)
                        .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                        .find((trap) => {
                            const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                            return (
                                trap !== player &&
                                (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                                trapDist <= 50
                            );
                        });
                                        if (!findObj || !configs.autoReplace) return;
                        if (!inGame) return;
                        if (this.antiTrapped) return;
                        if (getEl("weaponGrind").checked && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;
                        let objDst = UTILS.getDist(findObj, player, 0, 2);
                        let objAim = UTILS.getDirect(findObj, player, 0, 2);
                        if (objDst <= 400 && near.dist2 <= 400) {
                            if (near.dist2 < 250) {
                                for(let i = 0; i < Math.PI*2;i += Math.PI/9){
                                    checkPlace(2, near.aim2 + i);
                                }
                            } else {
                                for(let i = 0; i < Math.PI*2;i += Math.PI/9){
                                    checkPlace(4, near.aim2 + i);
                                }
                            }
                            this.replaced = true;
                           }
                    };
                }
            };
                        /*if (!findObj || !configs.autoReplace) return;
                        if (!inGame) return;
                        if (this.antiTrapped) return;

                        game.tickBase(() => {
                            let objAim = UTILS.getDirect(findObj, player, 0, 2);
                            let objDst = UTILS.getDist(findObj, player, 0, 2);

                            let perfectAngle = Math.round(calculatePerfectAngle(findObj.x, findObj.y, player.x, player.y) / (Math.PI / 2)) * (Math.PI / 2);

                            if (getEl("weaponGrind").checked && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;

                            if (objDst <= 300 && near.dist2 <= 400) {
                                if (isObjectBroken(findObj)) {
                                    let danger = this.checkSpikeTick();
                                    if (!danger && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                        this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), perfectAngle , 1);
                                    } else {
                                        if (player.items[4] == 15) {
                                            this.testCanPlace(near.dist2 > 250 ? 4 : 2, 0, (Math.PI * 2), (Math.PI / 24), perfectAngle , 1);
                                             notif("Replace Obj", "(System)");
                                           // player.chat.message = "Replace Obj";
                                           // player.chat.count = 1000;
                                        }
                                    }
                                    this.replaced = true;
                                }
                            }
                        }, 1);
                    }
                }
            }*/
            class Instakill {
                constructor() {
                    this.wait = false;
                    this.can = false;
                    this.isTrue = false;
                    this.nobull = false;
                    this.ticking = false;
                    this.canSpikeTick = false;
                    this.startTick = false;
                    this.readyTick = false;
                    this.canCounter = false;
                    this.revTick = false;
                    this.syncHit = false;
                    this.changeType = function(type) {
                        this.wait = false;
                        this.isTrue = true;
                        my.autoAim = true;
                        let instaLog = [type];
                        let backupNobull = near.backupNobull;
                        near.backupNobull = false;
                        game.tickBase(() => {
                            instaLog.push(player.skinIndex);
                            game.tickBase(() => {
                                if (near.skinIndex == 22 && getEl("backupNobull").checked) {
                                    near.backupNobull = true;
                                }
                                instaLog.push(player.skinIndex);
                            }, 1);
                        }, 1);
                        if (type == "rev") {
                            selectWeapon(player.weapons[1]);
                            buyEquip(53, 0);
                            buyEquip(21, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            }, 1);
                        } else if (type == "nobull") {
                            selectWeapon(player.weapons[0]);
                            if (getEl("backupNobull").checked && backupNobull) {
                                buyEquip(7, 0);
                            } else {
                                buyEquip(6, 0);
                            }
                            buyEquip(21, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                if (near.skinIndex == 22) {
                                    if (getEl("backupNobull").checked) {
                                        near.backupNobull = true;
                                    }
                                    buyEquip(6, 0);
                                } else {
                                    buyEquip(53, 0);
                                }
                                selectWeapon(player.weapons[1]);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            }, 1);
                        } else if (type == "normal") {
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(21, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                selectWeapon(player.weapons[1]);
                                buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            }, 1);
                        } else {
                            setTimeout(() => {
                                this.isTrue = false;
                                my.autoAim = false;
                            }, 50);
                        }
                    };
                    /*this.spikeTickType = function () {
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
          };*/
                    this.spikeTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(21, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            //if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                            buyEquip(53, 0);
                            selectWeapon(player.weapons[0]);
                            buyEquip(53, 0);
                            //buyEquip(21, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                buyEquip(6, 0);
                            }, 3);
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
                    this.antiCounterType = function() {
                        my.autoAim = true;
                        this.isTrue = true;
                        inantiantibull = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(6, 0);
                        buyEquip(21, 1);
                        io.send("D", near.aim2);
                        sendAutoGather();
                        game.tickBase(() => {
                            buyEquip(player.reloads[53] == 0 ? player.skins[53] ? 53 : 6 : 6, 0);
                            buyEquip(21, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                inantiantibull = false;
                            }, 1);
                        }, 1)
                    };
                    this.rangeType = function (type) {
                        this.isTrue = true;
                        my.autoAim = true;
                        if (type == 'ageInsta') {
                            my.ageInsta = false;
                            if (player.items[5] == 18) {
                                place(5, near.aim2);
                            }
                            packet('a', undefined, 1);
                            buyEquip(22, 0);
                            buyEquip(21, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[1]);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                sendAutoGather();
                                game.tickBase(() => {
                                    sendUpgrade(12);
                                    selectWeapon(player.weapons[1]);
                                    buyEquip(53, 0);
                                    buyEquip(21, 1);
                                    game.tickBase(() => {
                                        sendUpgrade(15);
                                        selectWeapon(player.weapons[1]);
                                        buyEquip(53, 0);
                                        buyEquip(21, 1);
                                        game.tickBase(() => {
                                            sendAutoGather();
                                            this.isTrue = false;
                                            my.autoAim = false;
                                        }, 1);
                                    }, 1);
                                }, 1);
                            }, 1);
                        } else {
                            selectWeapon(player.weapons[1]);
                            if (player.reloads[53] == 0 && near.dist2 <= 700 && near.skinIndex != 22) {
                                buyEquip(53, 0);
                            } else {
                                buyEquip(20, 0);
                            }
                            buyEquip(11, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }, 1);
                        }
                    };
                    this.Snowtick = function () {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                        biomeGear();
                        buyEquip(19, 1);
                        packet('a', near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            packet('a', near.aim2, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                sendAutoGather();
                                packet('a', near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet('a', undefined, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    };

                    this.oneTickType = function () {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        packet('a', near.aim2, 1);
                        if (player.weapons[1] == 15) {
                            my.revAim = true;
                            sendAutoGather();
                        }
                        game.tickBase(() => {
                            const trap1 = gameObjects
                            .filter(e => e.trap && e.active)
                            .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                            .find(trap => {
                                const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                                return trap !== player && (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) && trapDist <= 30;
                            });
                            if ([6, 22].includes(near.skinIndex) && trap1) io.send('6', 'p_OT [2/3]');
                            my.revAim = false;
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            packet('a', near.aim2, 1);
                            if (player.weapons[1] != 15) {
                                sendAutoGather();
                            }
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                packet('a', undefined, 1);
                            }, 1);
                        }, 1);
                    };
                    this.threeOneTickType = function () {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                        biomeGear();
                        buyEquip(11, 1);
                        packet('a', near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(11, 1);
                            packet('a', near.aim2, 1);
                            game.tickBase(() => {
                                const trap1 = gameObjects
                                .filter(e => e.trap && e.active)
                                .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                                .find(trap => {
                                    const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                                    return trap !== player && (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) && trapDist <= 30;
                                });
                                if ([6, 22].includes(near.skinIndex) && trap1) io.send('6', 'p_OT [2/3]');
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                sendAutoGather();
                                packet('a', near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet('a', undefined, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    };
                    this.kmTickType = function () {
                        this.isTrue = true;
                        my.autoAim = true;
                        my.revAim = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(11, 1);
                        sendAutoGather();
                        packet('a', near.aim2, 1);
                        game.tickBase(() => {
                            my.revAim = false;
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(19, 1);
                            packet('a', near.aim2, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                packet('a', undefined, 1);
                            }, 1);
                        }, 1);
                    };
                    this.boostTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        biomeGear();
                        buyEquip(11, 1);
                        packet("a", near.aim2, 1);
                        game.tickBase(() => {
                            if (player.weapons[1] == 15) {
                                my.revAim = true;
                            }
                            selectWeapon(player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(11, 1);
                            if ([9, 12, 13, 15].includes(player.weapons[1])) {
                                sendAutoGather();
                            }
                            packet("a", near.aim2, 1);
                            place(4, near.aim2);
                            game.tickBase(() => {
                                my.revAim = false;
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(21, 1);
                                if (![9, 12, 13, 15].includes(player.weapons[1])) {
                                    sendAutoGather();
                                }
                                packet("a", near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("a", undefined, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    };
                    this.gotoGoal = function(goto, OT) {
                        let slowDists = (weeeee) => weeeee * config.playerScale;
                        let goal = {
                            a: goto - OT,
                            b: goto + OT,
                            c: goto - slowDists(1),
                            d: goto + slowDists(1),
                            e: goto - slowDists(2),
                            f: goto + slowDists(2),
                            g: goto - slowDists(4),
                            h: goto + slowDists(4)
                        };
                        let bQ = function(wwww, awwww) {
                            if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2 && awwww == 0) {
                                buyEquip(31, 0);
                            } else {
                                buyEquip(wwww, awwww);
                            }
                        }
                        if (enemy.length) {
                            let dst = near.dist2;
                            this.ticking = true;
                            if (dst >= goal.a && dst <= goal.b) {
                                bQ(22, 0);
                                bQ(11, 1);
                                if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                }
                                return {
                                    dir: undefined,
                                    action: 1
                                };
                            } else {
                                if (dst < goal.a) {
                                    if (dst >= goal.g) {
                                        if (dst >= goal.e) {
                                            if (dst >= goal.c) {
                                                bQ(40, 0);
                                                bQ(10, 1);
                                                if (configs.slowOT) {
                                                    player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                                } else {
                                                    if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                    }
                                                }
                                            } else {
                                                bQ(22, 0);
                                                bQ(13, 1);
                                                if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                }
                                            }
                                        } else {
                                            bQ(6, 0);
                                            bQ(12, 1);
                                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                            }
                                        }
                                    } else {
                                        biomeGear();
                                        bQ(11, 1);
                                        if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                    }
                                    return {
                                        dir: near.aim2 + Math.PI,
                                        action: 0
                                    };
                                } else if (dst > goal.b) {
                                    if (dst <= goal.h) {
                                        if (dst <= goal.f) {
                                            if (dst <= goal.d) {
                                                bQ(40, 0);
                                                bQ(9, 1);
                                                if (configs.slowOT) {
                                                    player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                                } else {
                                                    if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                    }
                                                }
                                            } else {
                                                bQ(22, 0);
                                                bQ(13, 1);
                                                if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                }
                                            }
                                        } else {
                                            bQ(6, 0);
                                            bQ(12, 1);
                                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                            }
                                        }
                                    } else {
                                        biomeGear();
                                        bQ(11, 1);
                                        if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
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
                        }};

                    /** wait 1 tick for better quality */
                    (this.bowMovement = function () {
                        let moveMent = this.gotoGoal(685, 3);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue) {
                                this.rangeType('ageInsta');
                            } else {
                                packet('a', moveMent.dir, 1);
                            }
                        } else {
                            packet('a', moveMent.dir, 1);
                        }
                    }),
                        (this.tickMovement = function () {
                        const trap1 = gameObjects
                        .filter(e => e.trap && e.active)
                        .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                        .find(trap => {
                            const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                            return trap !== player && (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) && trapDist <= 50;
                        });
                        let moveMent = this.gotoGoal(
                            [10, 14].includes(player.weapons[1]) && player.y2 > config.snowBiomeTop
                            ? 240
                            : player.weapons[1] == 15
                            ? 250
                            : player.y2 <= config.snowBiomeTop
                            ? [10, 14].includes(player.weapons[1])
                            ? 265
                            : 255
                            : 270,
                            3
                        );
                        if (moveMent.action) {
                            if ((![6, 22].includes(near.skinIndex) || ([6, 22].includes(near.skinIndex) && trap1)) && player.reloads[53] == 0 && !this.isTrue) {
                                ([10, 14].includes(player.weapons[1]) && player.y2 > config.snowBiomeTop) || player.weapons[1] == 15 ? this.threeOneTickType() : this.Snowtick();
                            } else {
                                packet('a', moveMent.dir, 1);
                            }
                        } else {
                            packet('a', moveMent.dir, 1);
                        }
                    }),
                        (this.kmTickMovement = function () {
                        let moveMent = this.gotoGoal(240, 3);
                        if (moveMent.action) {
                            if (near.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && (game.tick - near.poisonTick) % config.serverUpdateRate == 8) {
                                this.kmTickType();
                            } else {
                                packet('a', moveMent.dir, 1);
                            }
                        } else {
                            packet('a', moveMent.dir, 1);
                        }
                    }),
                        (this.boostTickMovement = function () {
                        let dist = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 390 : player.weapons[1] == 15 ? 365 : 370;
                        let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1.5 : player.weapons[1] == 15 ? 2 : 3;
                        let moveMent = this.gotoGoal(dist, actionDist);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue) {
                                this.boostTickType();
                            } else {
                                packet('a', moveMent.dir, 1);
                            }
                        } else {
                            packet('a', moveMent.dir, 1);
                        }
                    });
                    /** wait 1 tick for better quality */
                    this.perfCheck = function(pl, nr) {
                        if (nr.weaponIndex == 11 && UTILS.getAngleDist(nr.aim2 + Math.PI, nr.d2) <= config.shieldAngle) return false;
                        if (![9, 12, 13, 15].includes(player.weapons[1])) return true;
                        let pjs = {
                            x: nr.x2 + (70 * Math.cos(nr.aim2 + Math.PI)),
                            y: nr.y2 + (70 * Math.sin(nr.aim2 + Math.PI))
                        };
                        if (UTILS.lineInRect(pl.x2 - pl.scale, pl.y2 - pl.scale, pl.x2 + pl.scale, pl.y2 + pl.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                            return true;
                        }
                        let finds = ais.filter(tmp => tmp.visible).find((tmp) => {
                            if (UTILS.lineInRect(tmp.x2 - tmp.scale, tmp.y2 - tmp.scale, tmp.x2 + tmp.scale, tmp.y2 + tmp.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                                return true;
                            }
                        });
                        if (finds) return false;
                        finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                            let tmpScale = tmp.getScale();
                            if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                                return true;
                            }
                        });
                        if (finds) return false;
                        return true;
                    }
                }
            };
            class Autobuy {
                constructor(buyHat, buyAcc) {
                    this.hat = function() {
                        buyHat.forEach((id) => {
                            let find = findID(hats, id);
                            if (find && !player.skins[id] && player.points >= find.price) packet("c", 1, id, 0);
                        });
                    };
                    this.acc = function() {
                        buyAcc.forEach((id) => {
                            let find = findID(accessories, id);
                            if (find && !player.tails[id] && player.points >= find.price) packet("c", 1, id, 1);
                        });
                    };
                }
            };
            class Autoupgrade {
                constructor() {
                    this.sb = function(upg) {
                        upg(3);
                        upg(17);
                        upg(31);
                        upg(23);
                        upg(9);
                        upg(38);
                    };
                    this.kh = function(upg) {
                        upg(3);
                        upg(17);
                        upg(31);
                        upg(23);
                        upg(10);
                        upg(38);
                        upg(4);
                        upg(25);
                    };
                    this.pb = function(upg) {
                        upg(5);
                        upg(17);
                        upg(32);
                        upg(23);
                        upg(9);
                        upg(38);
                    };
                    this.ph = function(upg) {
                        upg(5);
                        upg(17);
                        upg(32);
                        upg(23);
                        upg(10);
                        upg(38);
                        upg(28);
                        upg(25);
                    };
                    this.db = function(upg) {
                        upg(7);
                        upg(17);
                        upg(31);
                        upg(23);
                        upg(9);
                        upg(34);
                    };
                    /* old functions */
                    this.km = function(upg) {
                        upg(7);
                        upg(17);
                        upg(31);
                        upg(23);
                        upg(10);
                        upg(38);
                        upg(4);
                        upg(15);
                    };
                };
            };
            class Damages {
                constructor(items) {
                    // 0.75 1 1.125 1.5
                    this.calcDmg = function(dmg, val) {
                        return dmg * val;
                    };
                    this.getAllDamage = function(dmg) {
                        return [this.calcDmg(dmg, 0.75), dmg, this.calcDmg(dmg, 1.125), this.calcDmg(dmg, 1.5)];
                    };
                    this.weapons = [];
                    for (let i = 0; i < items.weapons.length; i++) {
                        let wp = items.weapons[i];
                        let name = wp.name.split(" ").length <= 1 ? wp.name : (wp.name.split(" ")[0] + "_" + wp.name.split(" ")[1]);
                        this.weapons.push(this.getAllDamage(i > 8 ? wp.Pdmg : wp.dmg));
                        this[name] = this.weapons[i];
                    }
                }
            }
            let hasDisplayedWarning = false;

            function checkPingTime() {
                if (secPacket === 50 && !hasDisplayedWarning) {
                    hasDisplayedWarning = true;
                    const frameMsg = Object.assign(document.createElement("div"), {
                        innerHTML: `Warning: Many Packets, High Ping ${window.pingTime}`, style: `
            position: fixed;
            top: 8%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.5rem;
            color: #a12a22;
            text-shadow: -1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 1px 1px 0 #333;
            z-index: 9999;`
        });
                    document.body.appendChild(frameMsg);
                    setTimeout(function() {
                        frameMsg.remove();
                        hasDisplayedWarning = false;
                    }, 2000);
                }
            }


            setInterval(checkPingTime, 100);





            /** CLASS CODES */
            // jumpscare code warn
            let tmpList = [];
            // LOADING:
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
            let autoBuy = new Autobuy([15, 31, 6, 7, 22, 12, 53, 20, 40], [11, 13, 19, 18, 21]);
            let autoUpgrade = new Autoupgrade();
            let lastDeath;
            let minimapData;
            let mapMarker = {};
            let mapPings = [];
            let antiShamehat = false;
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
                gogogogogo: false,
                lmfaooo: false,
                array: [],
                lastX: this.grid / 2,
                lastY: this.grid / 2
            };
            function sendChat(message) {
                packet("6", message.slice(0, 30));
            }
            let runAtNextTick = [];
            function checkProjectileHolder(x, y, dir, range, speed, indx, layer, sid) {
                let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
                let projOffset = config.playerScale * 2;
                let projXY = {
                    x: indx == 1 ? x : x - projOffset * Math.cos(dir),
                    y: indx == 1 ? y : y - projOffset * Math.sin(dir),
                };
                let nearPlayer = players.filter((e) => e.visible && UTILS.getDist(projXY, e, 0, 2) <= e.scale).sort(function(a, b) {
                    return UTILS.getDist(projXY, a, 0, 2) - UTILS.getDist(projXY, b, 0, 2);
                })[0];
                if (nearPlayer) {
                    if (indx == 1) {
                        nearPlayer.shooting[53] = 1;
                    } else {
                        nearPlayer.shootIndex = weaponIndx;
                        nearPlayer.shooting[1] = 1;
                        antiProj(nearPlayer, dir, range, speed, indx, weaponIndx);
                    }
                }
            }
            let projectileCount = 0;
            function antiProj(tmpObj, dir, range, speed, index, weaponIndex) {
                if (!tmpObj.isTeam(player)) {
                    tmpDir = UTILS.getDirect(player, tmpObj, 2, 2);
                    if (UTILS.getAngleDist(tmpDir, dir) <= 0.2) {
                        tmpObj.bowThreat[weaponIndex]++;
                        if (index == 5) {
                            projectileCount++;
                        }
                        setTimeout(() => {
                            tmpObj.bowThreat[weaponIndex]--;
                            if (index == 5) {
                                projectileCount--;
                            }
                        }, range / speed);
                        if (tmpObj.bowThreat[9] >= 1 && (tmpObj.bowThreat[12] >= 1 || tmpObj.bowThreat[15] >= 1)) {
                            place(1, tmpObj.aim2);
                            my.anti0Tick = 4;
                            if (!my.antiSync) {
                                io.send("6", "Why Bow Insta XDD");
                                antiSyncHealing(4);
                            }
                        } else {
                            if (projectileCount >= 2) {
                                place(1, tmpObj.aim2);
                                my.anti0Tick = 4;
                                if (!my.antiSync) {
                                    io.send("6", "Why Bow Insta XDD");
                                    antiSyncHealing(4);
                                }
                            }
                        }
                    }
                }
            }
            // SHOW ITEM INFO:
            function showItemInfo(item, isWeapon, isStoreItem) {
                if (player && item) {
                    UTILS.removeAllChildren(itemInfoHolder);
                    itemInfoHolder.classList.add("visible");
                    UTILS.generateElement({
                        id: "itemInfoName",
                        text: UTILS.capitalizeFirst(item.name),
                        parent: itemInfoHolder
                    });
                    UTILS.generateElement({
                        id: "itemInfoDesc",
                        text: item.desc,
                        parent: itemInfoHolder
                    });
                    if (isStoreItem) {
                    } else if (isWeapon) {
                        UTILS.generateElement({
                            class: "itemInfoReq",
                            text: !item.type ? "primary" : "secondary",
                            parent: itemInfoHolder
                        });
                    } else {
                        for (let i = 0; i < item.req.length; i += 2) {
                            UTILS.generateElement({
                                class: "itemInfoReq",
                                html: item.req[i] + "<span class='itemInfoReqVal'> x" + item.req[i + 1] + "</span>",
                                parent: itemInfoHolder
                            });
                        }
                        if (item.group.limit) {
                            UTILS.generateElement({
                                class: "itemInfoLmt",
                                text: (player.itemCounts[item.group.id] || 0) + "/" + (config.isSandbox ? 99 : item.group.limit),
                                parent: itemInfoHolder
                            });
                        }
                    }
                } else {
                    itemInfoHolder.classList.remove("visible");
                }
            }
            // RESIZE:
            window.addEventListener("resize", UTILS.checkTrusted(resize));
           // function resize() {
               // screenWidth = window.innerWidth;
               // screenHeight = window.innerHeight;
                /*let scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
        gameCanvas.width = screenWidth * pixelDensity;
        gameCanvas.height = screenHeight * pixelDensity;
        gameCanvas.style.width = screenWidth + "px";
        gameCanvas.style.height = screenHeight + "px";
        mainContext.setTransform(
            scaleFillNative, 0,
            0, scaleFillNative,
            (screenWidth * pixelDensity - (maxScreenWidth * scaleFillNative)) / 2,
            (screenHeight * pixelDensity - (maxScreenHeight * scaleFillNative)) / 2
        );*/
           // }
          //  resize();
             function resize() {
                screenWidth = window.innerWidth;
                screenHeight = window.innerHeight;
                let scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
                gameCanvas.width = screenWidth * pixelDensity;
                gameCanvas.height = screenHeight * pixelDensity;
                gameCanvas.style.width = screenWidth + "px";
                gameCanvas.style.height = screenHeight + "px";
                mainContext.setTransform(
                    scaleFillNative, 0,
                    0, scaleFillNative,
                    (screenWidth * pixelDensity - (maxScreenWidth * scaleFillNative)) / 2,
                    (screenHeight * pixelDensity - (maxScreenHeight * scaleFillNative)) / 2
                );
            }
            resize();

            // MOUSE INPUT:
            var usingTouch;
            const mals = document.getElementById('touch-controls-fullscreen');
            mals.style.display = 'block';
            mals.addEventListener("mousemove", gameInput, false);
            function gameInput(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
            let clicks = {
                left: false,
                middle: false,
                right: false,
            };
            mals.addEventListener("mousedown", mouseDown, false);
            function mouseDown(e) {
                if (attackState != 1) {
                    attackState = 1;
                    if (e.button == 0) {
                        clicks.left = true;
                    } else if (e.button == 1) {
                        clicks.middle = true;
                    } else if (e.button == 2) {
                        clicks.right = true;
                    }
                }
            }
            mals.addEventListener("mouseup", UTILS.checkTrusted(mouseUp));
            function mouseUp(e) {
                if (attackState != 0) {
                    attackState = 0;
                    if (e.button == 0) {
                        clicks.left = false;
                    } else if (e.button == 1) {
                        clicks.middle = false;
                    } else if (e.button == 2) {
                        clicks.right = false;
                    }
                }
            }
            mals.addEventListener("wheel", wheel, false);
            /*function wheel(e) {
                if (e.deltaY < 0) {
                    my.reSync = true;
                } else {
                    my.reSync = false;
                }
            }*/
            let abc = 1;
            function wheel(e) {
                if (e.deltaY < 0) {
                    abc += 0.05
                    maxScreenWidth = config.maxScreenWidth * abc;
                    maxScreenHeight = config.maxScreenHeight * abc;
                    resize()
                } else {
                    abc -= 0.05
                    maxScreenWidth = config.maxScreenWidth * abc;
                    maxScreenHeight = config.maxScreenHeight * abc;
                    resize()
                }
            }

            // INPUT UTILS:
            function getMoveDir() {
                let dx = 0;
                let dy = 0;
                for (let key in moveKeys) {
                    let tmpDir = moveKeys[key];
                    dx += !!keys[key] * tmpDir[0];
                    dy += !!keys[key] * tmpDir[1];
                }
                return dx == 0 && dy == 0 ? undefined : Math.atan2(dy, dx);
            }
            function getSafeDir() {
                if (!player)
                    return 0;
                if (!player.lockDir) {
                    lastDir = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2));
                }
                return lastDir || 0;
            }
            function getAttackDir(debug) {
                if (debug) {
                    let spike = gameObjects.filter(obj => (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "spinning spikes" || obj.name == "poison spikes") && fgdo(player, obj) < player.scale + obj.scale + 22 && !obj.isTeamObject(tmpObj) && obj.active)[0]
                    if (!player)
                        return "0";
                    if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
                        lastDir = getEl("weaponGrind").checked ? "getSafeDir()" : enemy.length ? my.revAim ? "(near.aim2 + Math.PI)" : "near.aim2" : "getSafeDir()";
                    else
                        if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = "getSafeDir()";
                    else
                        if (spike && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = "S.aim";
                    else
                        if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = "traps.aim";
                    else
                        if (!player.lockDir) {
                            if (configs.noDir) return "undefined";
                            lastDir = "getSafeDir()";
                        }
                    return lastDir;
                } else {
                    if (!player)
                        return 0;
                    if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
                        lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
                    else
                        if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = getSafeDir();
                    else
                        if (spike && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = my.Saim;
                    else
                        if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = traps.aim;
                    else
                        if (!player.lockDir) {
                            if (configs.noDir) return undefined;
                            lastDir = getSafeDir();
                        }
                    return lastDir || 0;
                }
            }
            function getVisualDir() {
                if (!player)
                    return 0;
                if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
                    lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
                else
                    if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
                        lastDir = getSafeDir();
                else
                    if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                        lastDir = traps.aim;
                else
                    if (!player.lockDir) {
                        lastDir = getSafeDir();
                    }
                return lastDir || 0;
            }

            // KEYS:
            function keysActive() {
                return (allianceMenu.style.display != "block" &&
                        chatHolder.style.display != "block" &&
                        !menuCBFocus);
            }
            function toggleMenuChat() {
                if (menuChatDiv.style.display != "none") {
                    chatHolder.style.display = "none";
                    if (menuChatBox.value != "") {
                        //commands[command.slice(1)]
                        let cmd = function(command) {
                            return {
                                found: command.startsWith("/") && commands[command.slice(1).split(" ")[0]],
                                fv: commands[command.slice(1).split(" ")[0]]
                            }
                        }
                        let command = cmd(menuChatBox.value);
                        if (command.found) {
                            if (typeof command.fv.action === "function") {
                                command.fv.action(menuChatBox.value);
                            }
                        } else {
                            sendChat(menuChatBox.value);
                        }
                        menuChatBox.value = "";
                        menuChatBox.blur();
                    } else {
                        if (menuCBFocus) {
                            menuChatBox.blur();
                        } else {
                            menuChatBox.focus();
                        }
                    }
                }
            }



            function keyDown(event) {
                let keyNum = event.which || event.keyCode || 0;
                if (player && player.alive && keysActive()) {
                    if (!keys[keyNum]) {
                        keys[keyNum] = 1;
                        macro[event.key] = 1;
                        if (keyNum == 27) {
                            openMenu = !openMenu;
                            $("#menuDiv").toggle();
                            $("#menuChatDiv").toggle();
                        } else if (keyNum == 69) {
                            sendAutoGather();
                        } else if (keyNum == 67) {
                            updateMapMarker();
                        } else if (player.weapons[keyNum - 49] != undefined) {
                            player.weaponCode = player.weapons[keyNum - 49];
                        } else if (moveKeys[keyNum]) {
                            sendMoveDir();
                        } else if (event.key == "m") {
                            mills.placeSpawnPads = !mills.placeSpawnPads;
                        } else if (event.key == "z") {
                            mills.place = !mills.place;
                        } else if (event.key == "p") {
                            pathFind.active = true;
                            autoPush.pushing = true;
                        } else if (event.key == "Z") {
                            typeof window.debug == "function" && window.debug();
                        } else if (keyNum == 32) {
                            packet("c", 1, getSafeDir(), 1);
                            packet("c", 0, getSafeDir(), 1);
                        } else if (event.key == ",") {
                            player.sync = true;
                        }
                    }
                }
            }
            addEventListener("keydown", UTILS.checkTrusted(keyDown));

            function keyUp(event) {
                if (player && player.alive) {
                    let keyNum = event.which || event.keyCode || 0;
                    if (keyNum == 13) {
                        toggleMenuChat();
                    } else if (keysActive()) {
                        if (keys[keyNum]) {
                            keys[keyNum] = 0;
                            macro[event.key] = 0;
                            if (moveKeys[keyNum]) {
                                sendMoveDir();
                            } else if (event.key == ",") {
                                player.sync = false;
                            }
                        }
                    }
                }
            }
            window.addEventListener("keyup", UTILS.checkTrusted(keyUp));
            function sendMoveDir() {
                let newMoveDir = getMoveDir();
                if (lastMoveDir == undefined || newMoveDir == undefined || Math.abs(newMoveDir - lastMoveDir) > 0.3) {
                    if (!my.autoPush) {
                        packet("a", newMoveDir, 1);
                    }
                    lastMoveDir = newMoveDir;
                }
            }
            // BUTTON EVENTS:
            function bindEvents() { }
            bindEvents();
            /** PATHFIND TEST */
            function chechPathColl(tmp) {
                return ((player.scale + tmp.getScale()) / (player.maxSpeed * items.weapons[player.weaponIndex].spdMult)) + (tmp.dmg && !tmp.isTeamObject(player) ? 35 : 0);
                return tmp.colDiv == 0.5 ? (tmp.scale * tmp.colDiv) :
                    !tmp.isTeamObject(player) && tmp.dmg ? (tmp.scale + player.scale) :
                tmp.isTeamObject(player) && tmp.trap ? 0 : tmp.scale;
            }
            function checkObject() {
                let checkColl = gameObjects.filter(tmp => player.canSee(tmp) && tmp.active);
                for (let y = 0; y < pathFind.grid; y++) {
                    grid[y] = [];
                    for (let x = 0; x < pathFind.grid; x++) {
                        let tmpXY = {
                            x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * x),
                            y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * y)
                        }
                        if (UTILS.getDist(pathFind.chaseNear ? near : pathFind, tmpXY, pathFind.chaseNear ? 2 : 0, 0) <= (pathFind.chaseNear ? 35 : 60)) {
                            pathFind.lastX = x;
                            pathFind.lastY = y;
                            grid[y][x] = 0;
                            continue;
                        }
                        let find = checkColl.find(tmp => UTILS.getDist(tmp, tmpXY, 0, 0) <= chechPathColl(tmp));
                        if (find) {
                            if (find.trap) {
                                grid[y][x] = 0;
                                continue;
                            }
                            grid[y][x] = 1;
                        } else {
                            grid[y][x] = 0;
                        }
                    }
                }
            }
            function toFancyTimeFormat(time) {
                let minutes = ~~((time % 3600) / 60);
                let seconds = ~~time % 60;
                if (seconds <= 9) seconds = `0${seconds}`;
                return `${minutes}:${seconds}`;
            }
            let song = {
                '0:41': 'Moon, a hole of light',
                '0:48': 'Through the big top tent up high',
                '0:50': 'Here before and after me',
                '0:52': 'Shining down on me',
                '0:58': 'Moon, tell me if I could',
                '1:02': 'Send up my heart to you',
                '1:05': 'So, when I die, which I must do',
                '1:14': 'Could it shine down here with you?',
                '1:17': 'Cause my love is mine, all mine',
                '1:23': 'I love, my, my, mine',
                '1:24': 'Nothing in the world belongs to me',
                '1:26': 'But my love, mine, all mine, all mine',
                '1:49': 'My baby here on Earth',
                '1:54': 'Showed me what my heart was worth',
                '1:58': 'So, when it comes to be my turn',
                '2:02': 'Could you shine it down here for her?',
                '2:05': 'Cause my love is mine, all mine',
                '2:10': 'I love, my, my, mine',
                '2:15': 'Nothing in the world belongs to me',
                '2:18': 'But my love, mine, all mine',
                '2:22': 'Nothing in the world is mine for free',
                '2:25': 'But my love, mine, all mine, all mine',


            };
            const songchat1 = new Audio("https://cdn.discordapp.com/attachments/1148402801387520003/1175206517650227311/tomp3.cc_-_Mitski_My_Love_Mine_All_Mine_Official_Video.mp3?ex=656a635c&is=6557ee5c&hm=18ddbb9e23e5ac29d3e979f02106bda29eaafe19033c619d0536710dbbded5b6&");
            let isPlaying = false;
            let currentPart = '';
            function toggleSong() {
                if (!isPlaying) {
                    songchat1.play();
                    songchat1.ontimeupdate = function(time) {
                        let part = song[toFancyTimeFormat(Math.round(this.currentTime | 0))];
                        if (part && part !== currentPart) {
                            currentPart = part;
                            io.send("6", part);
                        }
                    };
                    songchat1.onended = function() {
                        if (isPlaying) {
                            songchat1.play();
                        }
                    };
                    isPlaying = true;
                } else {
                    songchat1.pause();
                    isPlaying = false;
                }
            }
            document.addEventListener("keypress", function(e) {
                if (e.key === "C") {
                    toggleSong();
                }
            });
            function createPath() {
                grid = [];
                checkObject();
            }
            pathFind.active = true;
            pathFind.chaseNear = true;
            function Pathfinder() {
                pathFind.scale = (config.maxScreenWidth / 2) * 1.3;
                if (pathFind.chaseNear ? enemy.length : true) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                        packet("a", undefined, 1);
                    } else {
                        let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function(a, b) {
                            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                        })[0];
                        if (nearTrap && near && near.dist2 <= 1000) {
                            createPath();
                            easystar.setGrid(grid);
                            easystar.setAcceptableTiles([0]);
                            easystar.enableDiagonals();
                            easystar.findPath((grid[0].length / 2), (grid.length / 2), pathFind.lastX, pathFind.lastY, function(path) {
                                if (path === null) {
                                    pathFind.array = [];
                                    if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                                        packet("a", undefined, 1);
                                    } else {
                                        packet("a", near.aim2, 1);
                                    }
                                } else {
                                    pathFind.array = path;
                                    if (pathFind.array.length > 1) {
                                        let tmpXY = {
                                            x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].x),
                                            y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].y)
                                        }
                                        packet("a", UTILS.getDirect(tmpXY, player, 0, 2), 1);
                                    }
                                }
                            });
                            easystar.calculate();
                        }
                    }
                }
            }

            /** PATHFIND TEST */
            // ITEM COUNT DISPLAY:
            let isItemSetted = [];

            /*function updateItemCountHTML(index=undefined) {
                for (let i = 0; i < items.list.length; ++i) {
                    let id = items.list[i].group.id;
                    let tmpI = items.weapons.length + i;
                    if (!isItemSetted[tmpI]) {
                        isItemSetted[tmpI] = document.createElement("div");
                        isItemSetted[tmpI].id = "itemCount" + tmpI;
                        document.getElementById("actionBarItem" + tmpI).appendChild(isItemSetted[tmpI]);
                        isItemSetted[tmpI].style = `
                    display: block;
                    position: absolute;
                    padding-left: 5px;
                    font-size: 2em;
                    color: #fff;
                    `;
                        if (i < 3) {
                            isItemSetted[tmpI].innerHTML = Math.floor(player.food / items.list[i].req[1]);
                        } else {
                            isItemSetted[tmpI].innerHTML = player.itemCounts[id] || 0;
                        }
                    } else {
                        if (index == id) {
                            isItemSetted[tmpI].innerHTML = player.itemCounts[index] || 0;
                        }
                        if (index == undefined) {
                            if (i < 3) {
                                isItemSetted[tmpI].innerHTML = Math.floor(player.food / items.list[i].req[1]);
                            }
                        }
                    }

                }
            }*/
            function updateItemCountDisplay(index = undefined) {
                for (let i = 3; i < items.list.length; ++i) {
                    let id = items.list[i].group.id;
                    let tmpI = items.weapons.length + i;
                    if (!isItemSetted[tmpI]) {
                        isItemSetted[tmpI] = document.createElement("div");
                        isItemSetted[tmpI].id = "itemCount" + tmpI;
                        getEl("actionBarItem" + tmpI).appendChild(isItemSetted[tmpI]);
                        isItemSetted[tmpI].style = `
                        display: block;
                        position: absolute;
                        padding-left: 5px;
                        font-size: 2em;
                        color: #fff;
                        `;
                        isItemSetted[tmpI].innerHTML = player.itemCounts[id] || 0;
                    } else {
                        if (index == id) isItemSetted[tmpI].innerHTML = player.itemCounts[index] || 0;
                    }
                }
            }
            // ANTIPUSH:
            function antiPush() {
                const desiredDistance = 100;
                let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + 40 + player.scale)).sort(function(a, b) {
                    return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                })[0];
                if (spike) {
                    let pos = {
                        x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                        y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
                        x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                        y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0)))
                    };
                    if (spike) {
                        let currentDistance = UTILS.getDist(spike, player, 0, 2);
                        let scale = player.scale / 10;
                        if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                            packet("a", undefined, 1);
                            packet("a", undefined, 1);
                        } else {
                            packet("a", undefined, 1);
                        }

                        let aim = UTILS.getDirect(spike, player, 0, 2);
                        console.log(aim);

                        if (spike) {
                            if (!clicks.left && !clicks.right && !instaC.isTrue) {
                                if (player.weaponIndex != (traps.notFast() ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
                                    selectWeapon(traps.notFast() ? player.weapons[1] : player.weapons[0]);
                                }
                            }
                        }
                    }
                }
            }
            // AUTOPUSH:
            /*function autoPush() {
                autoPush.pushing = false
                let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function(a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];
                if (nearTrap && near && near.dist2 <= 260) {
                    let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale)).sort(function(a, b) {
                        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                    })[0];
                    if (spike) {
                        autoPush.pushing = true;
                        if(near.dist2 <= 180 && near.health <= 66 && tmpObj.reloads[tmpObj.primaryIndex] == 0){
                            instaC.spikeTickType();
                        }
                        let pos = {
                            x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                            y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
                            x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                            y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0)))
                        };
                        let finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                            let tmpScale = tmp.getScale();
                            if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, player.x2, player.y2, pos.x2, pos.y2)) {
                                return true;
                            }
                        });
                        if (finds) {
                        } else {
                            autoPush.place = true;
                            my.autoPush = true;
                            my.pushData = {
                                x: spike.x + Math.cos(70),
                                y: spike.y + Math.sin(70),
                                x2: pos.x2 + Math.cos(30),
                                y2: pos.y2 + Math.sin(30)
                            };
                            let scale = player.scale / 10;
                            let secondArg = UTILS.getDirect(near, spike, 2, 0) > 70 ? near.aim2 : undefined;
                            if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                                packet("a", secondArg, 1);
                            } else {
                                packet("a", UTILS.getDirect(pos, player, 2, 2), 1);
                            }
                        }
                    } else {
                        if (my.autoPush) {
                            autoPush.pushing = false;
                            my.autoPush = false;
                            packet("a", lastMoveDir || undefined, 1);
                            autoPush.place = false;
                        }
                    }
                } else {
                    if (my.autoPush) {
                        autoPush.pushing = false;
                        my.autoPush = false;
                        packet("a", lastMoveDir || undefined, 1);
                        autoPush.place = false;
                    }
                }
            }*/

            function autoPush() {
    let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function(a, b) {
        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
    })[0];
    if (nearTrap) {
        let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale)).sort(function(a, b) {
            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
        })[0];
        if (spike) {
            let pushAngle = Math.atan2(near.y2 - spike.y, near.x2 - spike.x)

            /*let pos = {
                            x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                            y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
                            x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))) + Math.cos(25),
                            y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0))) + Math.sin(25)
                        };
                        let finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                            let tmpScale = tmp.getScale();
                            if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, player.x2, player.y2, pos.x2, pos.y2)) {
                                return true;
                            }
                        });
                        if (finds) {
                            if (my.autoPush) {
                                my.autoPush = false;
                                packet("a", lastMoveDir || undefined, 1);
                            }
                        } else {*/
            my.autoPush = true;
            my.pushData = {
                x: spike.x + Math.cos(pushAngle),
                y: spike.y + Math.sin(pushAngle),
                x2: player.x2+30,
                y2: player.y2+30
            };

            let point = {
                x: near.x2 + Math.cos(pushAngle) * 30,
                y: near.y2 + Math.sin(pushAngle) * 60,
            }

            let dir = Math.atan2(point.y - player.y2, point.x - player.x2)

            packet("a", dir, 1)
            /*let scale = (player.scale / 10);
                            if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                                packet("a", near.aim2, 1);
                            } else {
                                packet("a", UTILS.getDirect(pos, player, 2, 2), 1);
                            }*/
            //}
        } else {
            if (my.autoPush) {
                my.autoPush = false;
                packet("a", lastMoveDir || undefined, 1);
            }
        }
    } else {
        if (my.autoPush) {
            my.autoPush = false;
            packet("a", lastMoveDir || undefined, 1);
        }
    }
}


            class AutoPush {
                socket = null;

                findIntersect(vec, vec1, vec2) {
                    // Find point of vec1 and vec2 intersection
                    const delta = Math.hypot(vec1.x - vec2.x, vec1.y - vec2.y) / 2;
                    const tang = Math.tan((vec1.y - vec2.y) / (vec1.x - vec2.x));
                    const vec3x = Math.cos(tang) * delta;
                    const vec3y = Math.sin(tang) * delta;
                    // Find angle from vec to vec3
                    const theta = Math.tan((vec.y - vec3y) / (vec.x - vec3x));

                    return theta;
                };

                pushEnemy(player, enemy, spike) {
                    const angle = this.findIntersect(enemy, spike, player);
                    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

                    if (dist > 180) return;

                    this.socket.send("a", angle);
                };

                constructor(socket) {
                    this.socket = socket;
                }
            }




            // AUTOPUSH:
            /*            function autoPush() { //LEGACY AUTOPUSH
          let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function (a, b) {
              return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
          })[0];
          if (nearTrap) {
              let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale)).sort(function (a, b) {
                  return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
              })[0];
              if (spike) {
                  let pos = {
                      x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                      y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
                      x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                      y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0)))
                  };
                  let finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                      let tmpScale = tmp.getScale();
                      if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, player.x2, player.y2, pos.x2, pos.y2)) {
                          return true;
                      }
                  });
                  if (finds) {
                      if (my.autoPush) {
                          my.autoPush = false;
                          packet("33", lastMoveDir||undefined, 1);
                      }
                  } else {
                      my.autoPush = true;
                      my.pushData = {
                          x: spike.x,
                          y: spike.y,
                          x2: pos.x2,
                          y2: pos.y2
                      };
                      let scale = (player.scale / 10);
                      if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                          packet("33", near.aim2, 1);
                      } else {
                          packet("33", UTILS.getDirect(pos, player, 2, 2), 1);
                      }
                  }
              } else {
                  if (my.autoPush) {
                      my.autoPush = false;
                      packet("33", lastMoveDir||undefined, 1);
                  }
              }
          } else {
              if (my.autoPush) {
                  my.autoPush = false;
                  packet("33", lastMoveDir||undefined, 1);
              }
          }
      }*/
            // ADD DEAD PLAYER:
            function addDeadPlayer(tmpObj) {
                deadPlayers.push(new DeadPlayer(tmpObj.x, tmpObj.y, tmpObj.dir, tmpObj.buildIndex, tmpObj.weaponIndex, tmpObj.weaponVariant, tmpObj.skinColor, tmpObj.scale, tmpObj.name));
            }
            // PING:
            var lastPing = -1;
            var maxPing = NaN;
            var minPing = NaN;
            var pingCount = 0;
            var doAutoQ = false;

            function pingSocketResponse() {
                let pingTime = window.pingTime;
                pingCount++;
                if (pingTime > ms.max || isNaN(ms.max)) {
                    ms.max = pingTime;
                }
                if (pingTime < ms.min || isNaN(ms.min)) {
                    ms.min = pingTime;
                }
                pingDisplay.innerText = "Ping: " + pingTime + " ms | FPS: " + currentFPS + " frames";
                if (pingTime >= 90) {
                    doAutoQ = true;
                } else {
                    doAutoQ = false;
                }
            }

            function pingSocket() {
                lastPing = Date.now();
                io.send('0');
            }




            /** APPLY SOCKET CODES */
            // SET INIT DATA:
            function setInitData(data) {
                alliances = data.teams;
            }
            // SETUP GAME:
            var fisrtloadez = false;
            function setupGame(yourSID) {
                keys = {};
                macro = {};
                playerSID = yourSID;
                attackState = 0;
                inGame = true;
                // pingSocketStart();
                // rePing();
                fisrtloadez = true;
                packet("d", 0, getAttackDir(), 1);
                my.ageInsta = true;
                if (firstSetup) {
                    firstSetup = false;
                    gameObjects.length = 0;
                }
            }
            // ADD NEW PLAYER:
            function addPlayer(data, isYou) {
                let tmpPlayer = findPlayerByID(data[0]);
                if (!tmpPlayer) {
                    tmpPlayer = new Player(data[0], data[1], config, UTILS, projectileManager,
                                           objectManager, players, ais, items, hats, accessories);
                    players.push(tmpPlayer);
                    if (data[1] != playerSID) {
                        addMenuChText("System", `Found ${data[2]} {${data[1]}}`, "#fff");
                    }
                } else {
                    if (data[1] != playerSID) {
                        addMenuChText("Game", `Encount ${data[2]} {${data[1]}}`, "yellow");
                    }
                }
                tmpPlayer.spawn(isYou ? true : null);
                tmpPlayer.visible = false;
                tmpPlayer.oldPos = {
                    x2: undefined,
                    y2: undefined
                };
                tmpPlayer.x2 = undefined;
                tmpPlayer.y2 = undefined;
                tmpPlayer.x3 = undefined;
                tmpPlayer.y3 = undefined;
                tmpPlayer.setData(data);
                if (isYou) {
                    if (!player) {
                        window.prepareUI(tmpPlayer);
                    }
                    player = tmpPlayer;
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
            // REMOVE PLAYER:
            function removePlayer(id) {
                for (let i = 0; i < players.length; i++) {
                    if (players[i].id == id) {
                        let tmpPlayer = players[i];
                       // addMenuChText(tmpPlayer.name + " has died", "red");
                        addMenuChText("System", players[i].name + " left the game", "red");
                        players.splice(i, 1);
                        break;
                    }
                }
            }
             function notif(title, description) {
                let notificationContainer = document.getElementById("notification-container");
                if (!notificationContainer) {
                    notificationContainer = document.createElement("div");
                    notificationContainer.id = "notification-container";
                    notificationContainer.style.position = "fixed";
                    notificationContainer.style.top = "10%";
                    notificationContainer.style.left = "50%";
                    notificationContainer.style.transform = "translateX(-50%)";
                    notificationContainer.style.zIndex = "9999";
                    document.body.appendChild(notificationContainer);
                }
                const notification = document.createElement("div");
                notification.innerHTML = `${title}: ${description}`;
                notification.style.fontSize = "1.5rem";
                notification.style.color = "green";
                notification.style.opacity = "0";
                notification.style.transition = "opacity 0.5s ease-in-out";
                notification.style.padding = "10px";
                notification.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
                notification.style.border = "2px solid black";
                notification.style.borderRadius = "5px";
                notification.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                notification.style.marginBottom = "10px";
                notificationContainer.appendChild(notification);
                setTimeout(function() {
                    notification.style.opacity = "1";
                    setTimeout(function() {
                        notification.style.opacity = "0";
                        setTimeout(function() {
                            notification.remove();
                        }, 500);
                    }, 2000);
                }, 100);
            }
             function sortWeaponVariant(id) {
                switch (id) {
                    case 0:
                        return 1
                        break;
                    case 1:
                        return 1.1
                        break;
                    case 2:
                        return 1.18
                        break;
                    case 3:
                        return 1.18
                        break;
                    default:
                        return 1
                        break;
                }
            }

            function sortSecondaryAmmoDamage(weapon) {
                switch (weapon) {
                    case 10:
                        return 12
                        break
                    case 15:
                        return 50
                        break;
                    case 9:
                        return 25
                        break;
                    case 12:
                        return 35
                        break;
                    case 13:
                        return 30
                        break;
                    default:
                        return 0
                }
            }
                            function heal() {
                    for (let i = 0; i < Math.ceil((100 - player.health) / items.list[player.items[0]].healing); i++) {
                        place(0, getAttackDir());
                    }
                }

            function rimdiestobatspam() {
                    let potential = handleDmgPot();
                    if (nears.length) {
                        addMenuChText("Dev", `Dmg potential: ${potential}`, "red");
                        if (Math.round(player.health - potential <= 0)) {
                            if ((player.health - (potential * player.skinIndex == 6 ? 0.75 : 1) >= 0)) {
                                game.tickBase(() => {
                                    heal();
                                }, 2);
                            } else {
                                if(player.shameCount < 5) {
                                    heal();
                                } else {
                                    game.tickBase(() => {
                                        heal();
                                    }, 2);
                                }
                            }
                        } else {
                            game.tickBase(() => {
                                heal();
                            }, 2);
                        }
                    } else {
                        game.tickBase(() => {
                            heal();
                        }, 2);
                    }
                }



            function Qz(tmpObj, t) {
                let d = t - tmpObj.health;
                if (d >= 0) {
                } else {
                    if (player == tmpObj) {
                        if (tmpObj.skinIndex == 7 && (Math.abs(d) == 5 || (tmpObj.latestTail == 13 && Math.abs(d) == 2))) {
                            tmpObj.bullTick = game.tick
                            if (my.reSync) {
                                my.reSync = false;
                            }
                        }
                        //rimdiestobatspam();
                    }
                }
            }

            function handleDmgPot() {
                let predictedDamage = 0;
                let weapon1Dmg, weapon2Dmg;
                let weapon1Reload, weapon2Reload;

                for (let i = 0; i < nears.length; i++) {
                    let singleIndividual = nears[i];
                    weapon1Dmg = items.weapons[singleIndividual.weapons[0]].dmg * sortWeaponVariant(singleIndividual.weaponVariant);
                    weapon2Dmg = singleIndividual.weapons[1] == 10 ? items.weapons[singleIndividual.weapons[1]].dmg : items.weapons[singleIndividual.weapons[1]].pDmg;
                    weapon1Reload = singleIndividual.reloads[singleIndividual.weapons[0]] == 0;
                    weapon2Reload = singleIndividual.reloads[singleIndividual.weapons[1]] == 0;

                    if (singleIndividual.primaryIndex !== undefined) {
                        predictedDamage += weapon1Reload ? weapon1Dmg * 1.5 : 0;
                    } else {
                        predictedDamage += 45;
                    }

                    if (singleIndividual.secondaryIndex !== undefined) {
                        predictedDamage += weapon2Reload ? weapon2Dmg : 0;
                    } else {
                        predictedDamage += 50;
                    }

                    predictedDamage += singleIndividual.reloads[53] == 0 ? 25 : 0;
                    addMenuChText("System", "Predict Dmg :" + predictedDamage, "red");
                    healer();
                }
            }








            // UPDATE HEALTH:
            var judgeAtNextTick = false;
            let hittedTime = Date.now();

           /* function updateHealth(sid, value) {
                tmpObj = findPlayerBySID(sid);
                if (tmpObj) {

                    tmpObj.oldHealth = tmpObj.health;
                    tmpObj.health = value;
                    tmpObj.judgeShame();
                    Qz(tmpObj, value)
                    if (tmpObj.oldHealth > tmpObj.health) {
                        if (tmpObj == near) {
                            let damage = tmpObj.oldHealth - tmpObj.health;
                            if (tmpObj.skinIndex == 7 && (damage == 5 || (tmpObj.latestTail == 13 && damage == 2))) {
                                tmpObj.bullTick = game.tick;
                            }
                        }
                        //rimdiestobatspam();



                        tmpObj.damaged = tmpObj.oldHealth - tmpObj.health;
                        let damaged = tmpObj.damaged;
                        tmpObj = findPlayerBySID(sid);
                        let bullTicked = false;
                        if (value >= 20) {
                            hittedTime = Date.now();
                            judgeAtNextTick = true;
                        }
                        if (near.antiBull > 0 && player.shameCount < 5) {
                            place(0, getAttackDir());
                        }
                        if (tmpObj == player) {
                            if (tmpObj.skinIndex == 7 && (damaged == 5 || (tmpObj.latestTail == 13 && damaged == 2))) {
                                if (my.reSync) {
                                    my.reSync = false;
                                    tmpObj.setBullTick = true;
                                }
                                bullTicked = true;
                            }
                            if (inGame) {
                                let attackers = getAttacker(damaged);
                                let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                                let includeSpikeDmgs = !bullTicked && gearDmgs.includes(damaged);
                                let healTimeout = 750 / 14;
                                let slowHeal = function(timer) {
                                    setTimeout(() => {
                                        healer();
                                    }, timer);
                                }
                                if (near.dist2 <= 150 && damaged >= 45 && tmpObj.shamecount < 4) {
                                    handleDmgPot();
                                    tmpObj.addDamageThreat(player);
                                    healer();
                                    buyEquip(18, 1);
                                    buyEquip(11, 0);
                                }
                                let total = 0;
                                if (damaged >= (includeSpikeDmgs ? 8 : 25) && player.damageThreat >= 25 && (game.tick - player.antiTimer) > 1) {
                                    player.canEmpAnti = true;
                                    player.antiTimer = game.tick;
                                    let shame = Math.floor(Math.random() * (6 - 4) + 3);
                                    if (tmpObj.shameCount < shame) {
                                        healer();
                                    } else {
                                        slowHeal(healTimeout);
                                    }
                                } else {
                                    slowHeal(healTimeout);
                                }
                                //if (damaged >= 20 && (player.skinIndex == 11)) instaC.canCounter = true;
                            }
                        } else {
                            if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || (tmpObj.latestTail == 13 && tmpObj.damaged == 2))) {
                                tmpObj.setPoisonTick = true;
                            }
                        }
                    } else {
                        if (tmpObj != player) {
                            if (tmpObj.maxShameCount < tmpObj.shameCount) {
                                tmpObj.maxShameCount = tmpObj.shameCount;
                            }
                        }
                    }
                    if (tmpObj.health <= 0) {
                        /*bots.forEach((hmm) => {
                hmm.whyDie = tmpObj.name;
            });*/
                  /*  }
                }
            }*/

            function updateHealth(sid, value) {
                tmpObj = findPlayerBySID(sid);
                if (tmpObj) {
                    tmpObj.oldHealth = tmpObj.health;
                    tmpObj.health = value;
                    tmpObj.judgeShame();
                    if (tmpObj.oldHealth > tmpObj.health) {
                        tmpObj.damaged = tmpObj.oldHealth - tmpObj.health;
                        advHeal.push([sid, value, tmpObj.damaged]);
                    } else {}
                    if (tmpObj.health <= 0) {
                        bots.forEach((hmm) => {
                            hmm.whyDie = tmpObj.name;
                        });
                    }
                }
            }







            // KILL PLAYER:
            function killPlayer() {
                inGame = false;
                lastDeath = {
                    x: player.x,
                    y: player.y,
                };
                if (configs.autoRespawn) {
                    getEl("ot-sdk-btn-floating").style.display = "none";
                    packet("M", {
                        name: lastsp[0],
                        moofoll: lastsp[1],
                        skin: lastsp[2]
                    });
                }
            }
            // UPDATE PLAYER ITEM VALUES:
            function updateItemCounts(index, value) {
                if (player) {
                    player.itemCounts[index] = value;
                    updateItemCountDisplay(index);
                }
            }
            // UPDATE AGE:
            function updateAge(xp, mxp, age) {
                if (xp != undefined)
                    player.XP = xp;
                if (mxp != undefined)
                    player.maxXP = mxp;
                if (age != undefined)
                    player.age = age;
            }
            // UPDATE UPGRADES:
            function updateUpgrades(points, age) {
                player.upgradePoints = points;
                player.upgrAge = age;
                if (points > 0) {
                    tmpList.length = 0;
                    UTILS.removeAllChildren(upgradeHolder);
                    for (let i = 0; i < items.weapons.length; ++i) {
                        if (items.weapons[i].age == age && (testMode || items.weapons[i].pre == undefined || player.weapons.indexOf(items.weapons[i].pre) >= 0)) {
                            let e = UTILS.generateElement({
                                id: "upgradeItem" + i,
                                class: "actionBarItem",
                                onmouseout: function() {
                                    showItemInfo();
                                },
                                parent: upgradeHolder
                            });
                            e.style.backgroundImage = getEl("actionBarItem" + i).style.backgroundImage;
                            tmpList.push(i);
                        }
                    }
                    for (let i = 0; i < items.list.length; ++i) {
                        if (items.list[i].age == age && (testMode || items.list[i].pre == undefined || player.items.indexOf(items.list[i].pre) >= 0)) {
                            let tmpI = (items.weapons.length + i);
                            let e = UTILS.generateElement({
                                id: "upgradeItem" + tmpI,
                                class: "actionBarItem",
                                onmouseout: function() {
                                    showItemInfo();
                                },
                                parent: upgradeHolder
                            });
                            e.style.backgroundImage = getEl("actionBarItem" + tmpI).style.backgroundImage;
                            tmpList.push(tmpI);
                        }
                    }
                    for (let i = 0; i < tmpList.length; i++) {
                        (function(i) {
                            let tmpItem = getEl('upgradeItem' + i);
                            tmpItem.onmouseover = function() {
                                if (items.weapons[i]) {
                                    showItemInfo(items.weapons[i], true);
                                } else {
                                    showItemInfo(items.list[i - items.weapons.length]);
                                }
                            };
                            tmpItem.onclick = UTILS.checkTrusted(function() {
                                packet("H", i);
                            });
                            UTILS.hookTouchEvents(tmpItem);
                        })(tmpList[i]);
                    }
                    if (tmpList.length) {
                        upgradeHolder.style.display = "block";
                        upgradeCounter.style.display = "block";
                        upgradeCounter.style.borderRadius = "4px";
                        upgradeCounter.innerHTML = "SELECT ITEMS (" + points + ")";
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
            function cdf(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }
            function caf(e, t) {
                try {
                    return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return 0;
                }
            }
            function numArr(e = 0, t = 1, act, n = 1) {
                let arr = [];
                for (let i = e; i < t; i += n) {
                    arr.push(i);
                    typeof act == "function" && act(i);
                }
                return arr;
            }
            function toR(e) {
                var n = (e * Math.PI / 180) % (2 * Math.PI);
                return n > Math.PI ? Math.PI - n : n
            }
            function toD(e) {
                var n = (e / Math.PI * 360) % 360;
                return n >= 360 ? n - 360 : n;
            }
            var replacing = false;

            // KILL OBJECT:
            /*function killObject(sid) {
                let findObj = findObjectBySid(sid);
                objectManager.disableBySid(sid);
                let n = findObj;
                traps.replacer(findObj);
                if (nears.length) {
                    let enemy = near;
                    let A = player;
                    let dist = cdf(A, enemy);
                    let dir = caf(A, enemy);
                    //code of bianos
                    let objAim = Math.atan2(findObj.y-player.y2, findObj.x-player.x2);
                    let objDist = Math.hypot(findObj.y-player.y2, findObj.x-player.x2);
                    //
                    let ignore = [0, 0];
                    let place = function(t, f) {
                        checkPlace(t, f);
                    }
                    if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8) {
                        instaC.spikeTickType();
                    }
                    if (objDist <= 200 && getDist(player, tmpObj) <= 168 && tmpObj != player && player.reloads[player.weapons[0]] == 0) {
                        // BianosTick
                        buyEquip(7, 0);
                        buyEquip(18, 1);
                        selectWeapon(player.weapons[0]);
                        io.send("d", 1, near.aim2);
                        setTickout(()=>{
                            buyEquip(53, 0);
                            buyEquip(21, 1);
                            setTickout(()=>{
                                io.send("d", 0, near.aim2);
                                buyEquip(6, 0);
                            }, 3);
                        }, 1);
                    }
                    if (player.alive) {
                        // REPLACER:
                        if (configs.autoReplace && objDist <= 400) {

                            if (near.dist2 <= 300 && !traps.inTrap) {
                                let tmpCount = -1;
                                for (let i = 0; i < Math.PI*8; i+= Math.PI/1) {
                                    tmpCount++
                                    if (tmpCount == 1 && objDist <= 200) {
                                        textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Spike Replace", "#fff", 2);
                                        place(2, objAim);
                                        place(2, objAim + Math.PI);
                                    } else {
                                        checkPlace(2, objAim+i);
                                    }
                                }
                            } else {
                                let tmpCount = -1;
                                for (let i = 0; i < Math.PI*5.5; i+= Math.PI/2.2) {
                                    if (player.items[4] == 15) {
                                        tmpCount++;
                                        if (tmpCount == 0 && objDist <= 200) {
                                            textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "ReTrap", "#fff", 2);
                                            traps.replacer(findObj);
                                            place(4, objAim);
                                            place(4, objAim + Math.PI);

                                        } else {
                                            checkPlace(4, objAim+i+2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }*/
            ///////////////////////////////////////////
            /* function killObject(sid) {
    let findObj = findObjectBySid(sid);
    objectManager.disableBySid(sid);
    let n = findObj;
                // traps.replacer(findObj);
    if (n && cdf(player, n) < 200) {
        if (nears.length) {
            let enemy = near;
            let A = player;
            let dist = cdf(A, enemy);
            let dir = caf(A, enemy);
            let dir2 = caf(player, dir + Math.PI); // this dir can work for laggy players
            let ignore = [0, 0];
            let objAim = UTILS.getDirect(findObj, player, 0, 2);
            let objDst = UTILS.getDist(findObj, player, 0, 2);
            let place = function (t, f) {
                checkPlace(t, f);
            }
            //
            if (dist < 500) {
                let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 15)).sort(function (a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];

                for (let i = 0; i != 2; i++) {
                    if (dist < 200) {
                        //console.log(dir);
                        checkPlace(4, UTILS.getDirect(findObj, player, 2, 2));
                        //checkPlace(4, near.aim2)old
                        for (let i = 0; i < Math.PI; i += toR(items.list[A.items[2]].scale)) {
                            let placed;
                            if (ignore[0]) {
                                placed = false;
                                ignore[0]--;
                            } else {
                                place((nearTrap ? 2 : 4), (dir || dir2) + i) && (toD(i) < items.list[A.items[2]].scale && (ignore[1] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12))), placed = true);
                                //traps.ReTrap();
                            }
                            placed && (ignore[0] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12)));
                            if (!placed || UTILS.getAngleDist(dir + i, dir - i) > toR(items.list[A.items[2]].scale)) {
                                if (ignore[1]) {
                                    ignore[1]--;
                                } else {
                                    place((nearTrap ? 2 : 4), dir - i) && (ignore[1] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12)))

                                   // traps.ReTrap();
                                }
                            }
                        }
                        place((nearTrap ? 2 : 4), toR(toD(dir) - 180));
                       // traps.ReTrap();
                      // notif('retrap');
                        player.chat.message = "ReTrap";
                        player.chat.count = 1000;
                        //  chch(null, "[Retrap]", "yellow");
                    } else {
                        let ignore = 0;
                        if (ignore) {
                            ignore--;
                        } else {
                            for (let i = 0; i < Math.PI / 2; i += Math.PI / 3) {
                                checkPlace((nearTrap ? 2 : 4), dir + i) && (ignore = Math.ceil(50 / Math.PI / 6));

                            }
                        }
                    }
                }
            }
        }
    }
}*/
            /////////////////////////////////////////

           /* function killObject(sid) {
                let findObj = findObjectBySid(sid);
                objectManager.disableBySid(sid);
                let n = findObj;
                traps.replacer(findObj);
                if (nears.length) {
                    let enemy = near;
                    let A = player;
                    let dist = cdf(A, enemy);
                    let dir = caf(A, enemy);
                    let dir2 = caf(player, dir + 180);
                    //code of bianos
                    let objAim = Math.atan2(findObj.y-player.y2, findObj.x-player.x2);
                    let objDist = Math.hypot(findObj.y-player.y2, findObj.x-player.x2);
                    //
                    let ignore = [0, 0];
                    let place = function(t, f) {
                        checkPlace(t, f);
                    }
                    if (dist < 500) {
                            for(let i = 0; i != 2; i++) {
                                if (dist < 200) {
                                    //console.log(dir);
                                    for(let i = 0; i < Math.PI; i += toR(items.list[A.items[2]].scale)) {
                                        let placed;
                                        if (ignore[0]) {
                                            placed = false;
                                            ignore[0]--;
                                        } else {
                                            place(2, (dir || dir2) + i) && (toD(i) < items.list[A.items[2]].scale && (ignore[1] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12))), placed = true);
                                        }
                                        placed && (ignore[0] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12)));
                                        if (!placed || UTILS.getAngleDist(dir + i, dir - i) > toR(items.list[A.items[2]].scale)) {
                                            if (ignore[1]) {
                                                ignore[1]--;
                                            } else {
                                                place(2, dir - i) && (ignore[1] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12)))
                                            }
                                        }
                                    }
                                    place(4, toR(toD(dir) - 180));
                                } else {
                                    let ignore = 0;
                                    if (ignore) {
                                        ignore--;
                                    } else {
                                        for(let i = 0; i < Math.PI/2; i += Math.PI / 3) {
                                            checkPlace(4, dir + i) && (ignore = Math.ceil(50 / Math.PI / 6));
                                        }
                                    }
                                }
                            }
                    }
                    if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8) {
                        instaC.spikeTickType();
                    }
                    if (objDist <= 200 && getDist(player, tmpObj) <= 168 && tmpObj != player && player.reloads[player.weapons[0]] == 0) {
                        // BianosTick
                        buyEquip(7, 0);
                        buyEquip(18, 1);
                        selectWeapon(player.weapons[0]);
                        io.send("d", 1, near.aim2);
                        setTickout(()=>{
                            buyEquip(53, 0);
                            buyEquip(21, 1);
                            setTickout(()=>{
                                io.send("d", 0, near.aim2);
                                buyEquip(6, 0);
                            }, 3);
                        }, 1);
                    }
                    if (player.alive) {
                        // REPLACER:
                        if (configs.autoReplace && objDist <= 400) {

                            if (near.dist2 <= 300 && !traps.inTrap) {
                                let tmpCount = -1;
                                for (let i = 0; i < Math.PI*8; i+= Math.PI/1) {
                                    tmpCount++
                                    if (tmpCount == 1 && objDist <= 200) {
                                        textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Spike Replace", "#fff", 2);
                                        place(2, objAim);
                                        place(2, objAim + Math.PI);
                                    } else {
                                        checkPlace(2, objAim+i);
                                    }
                                }
                            } else {
                                let tmpCount = -1;
                                for (let i = 0; i < Math.PI*5.5; i+= Math.PI/2.2) {
                                    if (player.items[4] == 15) {
                                        tmpCount++;
                                        if (tmpCount == 0 && objDist <= 200) {
                                            textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "ReTrap", "#fff", 2);
                                            place(4, objAim);
                                            place(4, objAim + Math.PI);
                                            traps.replacer(findObj);
                                        } else {
                                            checkPlace(4, objAim+i+2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }*/

           /* function killObject(sid) {
                    let findObj = findObjectBySid(sid);
                    objectManager.disableBySid(sid);
                    if (player) {
                        for (let i = 0; i < breakObjects.length; i++) {
                            if (breakObjects[i].sid == sid) {
                                breakObjects.splice(i, 1);
                                break;
                            }
                        }
                        if (!player.canSee(findObj)) {
                            breakTrackers.push({
                                x: findObj.x,
                                y: findObj.y
                            });
                        }
                        if (breakTrackers.length > 8) {
                            breakTrackers.shift();
                        }
                        traps.replacer(findObj);
                        traps.ReTrap();
                    }
                }*/
            //////////////////////////////////
            function killObject(sid) {
                let findObj = findObjectBySid(sid);
                objectManager.disableBySid(sid);
                let n = findObj;
                traps.replacer(findObj);
                if (nears.length) {
                    let enemy = near;
                    let A = player;
                    let dist = cdf(A, enemy);
                    let dir = caf(A, enemy);
                    let dir2 = caf(player, dir + 180);
                    //code of bianos
                    let objAim = Math.atan2(findObj.y-player.y2, findObj.x-player.x2);
                    let objDist = Math.hypot(findObj.y-player.y2, findObj.x-player.x2);
                    //
                    let ignore = [0, 0];
                    let place = function(t, f) {
                        checkPlace(t, f);
                    }
                    if (dist < 500) {
                let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 15)).sort(function (a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];

                for (let i = 0; i != 2; i++) {
                    if (dist < 200) {
                        //console.log(dir);
                        checkPlace(4, UTILS.getDirect(findObj, player, 2, 2));
                        //checkPlace(4, near.aim2)old
                        for (let i = 0; i < Math.PI; i += toR(items.list[A.items[2]].scale)) {
                            let placed;
                            if (ignore[0]) {
                                placed = false;
                                ignore[0]--;
                            } else {
                                place((nearTrap ? 2 : 4), (dir || dir2) + i) && (toD(i) < items.list[A.items[2]].scale && (ignore[1] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12))), placed = true);
                                //traps.ReTrap();
                            }
                            placed && (ignore[0] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12)));
                            if (!placed || UTILS.getAngleDist(dir + i, dir - i) > toR(items.list[A.items[2]].scale)) {
                                if (ignore[1]) {
                                    ignore[1]--;
                                } else {
                                    place((nearTrap ? 2 : 4), dir - i) && (ignore[1] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12)))

                                   // traps.ReTrap();
                                }
                            }
                        }
                        place((nearTrap ? 2 : 4), toR(toD(dir) - 180));
                       // traps.ReTrap();
                      // notif('retrap');
                        player.chat.message = "ReTrap";
                        player.chat.count = 1000;
                        //  chch(null, "[Retrap]", "yellow");
                    } else {
                        let ignore = 0;
                        if (ignore) {
                            ignore--;
                        } else {
                            for (let i = 0; i < Math.PI / 2; i += Math.PI / 3) {
                                checkPlace((nearTrap ? 2 : 4), dir + i) && (ignore = Math.ceil(50 / Math.PI / 6));
                                        }
                                    }
                                }
                            }
                    }
                   /* if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8) {
                        instaC.spikeTickType();
                    }
                    if (objDist <= 200 && getDist(player, tmpObj) <= 168 && tmpObj != player && player.reloads[player.weapons[0]] == 0) {
                        // BianosTick
                        buyEquip(7, 0);
                        buyEquip(18, 1);
                        selectWeapon(player.weapons[0]);
                        io.send("d", 1, near.aim2);
                        setTickout(()=>{
                            buyEquip(53, 0);
                            buyEquip(21, 1);
                            setTickout(()=>{
                                io.send("d", 0, near.aim2);
                                buyEquip(6, 0);
                            }, 3);
                        }, 1);
                    }*/
                    if (player.alive) {
                        // REPLACER:
                        if (configs.autoReplace && objDist <= 400) {

                            if (near.dist2 <= 300 && !traps.inTrap) {
                                let tmpCount = -1;
                                for (let i = 0; i < Math.PI*8; i+= Math.PI/1) {
                                    tmpCount++
                                    if (tmpCount == 1 && objDist <= 200) {
                                        textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Spike Replace", "#fff", 2);
                                        place(2, objAim);
                                        place(2, objAim + Math.PI);
                                    } else {
                                        checkPlace(2, objAim+i);
                                    }
                                }
                            } else {
                                let tmpCount = -1;
                                for (let i = 0; i < Math.PI*5.5; i+= Math.PI/2.2) {
                                    if (player.items[4] == 15) {
                                        tmpCount++;
                                        if (tmpCount == 0 && objDist <= 200) {
                                            textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "ReTrap", "#fff", 2);
                                            place(4, objAim);
                                            place(4, objAim + Math.PI);
                                            traps.replacer(findObj);
                                            //traps.ReTrap();
                                        } else {
                                            checkPlace(4, objAim+i+2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function bianosSpTickWh(){
                buyEquip(7, 0);
                buyEquip(18, 1);
                selectWeapon(player.weapons[0]);
                io.send("d", 1, near.aim2);
                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Auto Spike Tick", "#fff", 2);
                setTickout(()=>{
                    buyEquip(53, 0);
                    buyEquip(21, 1);
                    setTickout(()=>{
                        io.send("d", 0, near.aim2);
                        buyEquip(6, 0);
                    }, 3);
                }, 1);
            }

            // KILL ALL OBJECTS BY A PLAYER:
            function killObjects(sid) {
                if (player) objectManager.removeAllItems(sid);
            }
            function fgdo(a, b) {
                return Math.sqrt(Math.pow((b.y - a.y), 2) + Math.pow((b.x - a.x), 2));
            }
            function precheckPlace(a, b) {
                checkPlace(a, b);
                textManager.showText(player.x2, player.y2 + 100, 30, 0.15, 1850, "Preplace Success", "#fff", 2);
            }

            let ticks = {
                tick: 0,
                delay: 0,
                time: [],
                manage: [],
            };
            // GAME TICKOUT:
            function setTickout(doo, timeout) {
                if (!ticks.manage[ticks.tick + timeout]) {
                    ticks.manage[ticks.tick + timeout] = [doo];
                } else {
                    ticks.manage[ticks.tick + timeout].push(doo);
                }
            }
            function doNextTick(doo) {
                waitTicks.push(doo);
            }
            let waitTicks = [];
            // UPDATE PLAYER DATA:
            let nEy;
            let placeableSpikes = [];
            let placeableTraps = [];
            let placeableSpikesPREDICTS = [];
            let spike = gameObjects.filter(obj => (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "spinning spikes" || obj.name == "poison spikes") && fgdo(player, obj) < player.scale + obj.scale + 22 && !obj.isTeamObject(tmpObj) && obj.active)[0]


            /* if (near.health - (Math.round(player.weapons[0] == undefined ? 0 : items.weapons[player.weapons[0]].dmg * sortWeaponVariant(player.weaponVariant) * 1.5 * (near.skinIndex == 6 ? 0.75 : 1))) <= 0) {
                        return true;
                    }
                    return false;
                }*/





            function updatePlayers(data) {
                //if(player.shameCount > 0) {
                 //   my.reSync = true;
               // } else {
               //     my.reSync = false;
               // }

                game.tick++;
                enemy = [];
                traps.runPrePlacer();
                nears = [];
                near = [];
                //showPlace = [];
                game.tickSpeed = performance.now() - game.lastTick;
                game.lastTick = performance.now();
                ticks.tick++;
                ticks.time.push(Date.now() - ticks.delay <= 50 || Date.now() - ticks.delay >= 175 ? "lag" : 1);
                if (ticks.tick % 10 === 0) {
                    ticks.time = [];
                }
                if (ticks.tick % 300 === 0) {
                }
                ticks.delay = Date.now();
                players.forEach((tmp) => {
                    tmp.forcePos = !tmp.visible;
                    tmp.visible = false;
                });
                for (let i = 0; i < data.length;) {
                    tmpObj = findPlayerBySID(data[i]);
                    if (tmpObj) {
                        tmpObj.t1 = (tmpObj.t2 === undefined) ? game.lastTick : tmpObj.t2;
                        tmpObj.t2 = game.lastTick;
                        tmpObj.oldPos.x2 = tmpObj.x2;
                        tmpObj.oldPos.y2 = tmpObj.y2;
                        tmpObj.x1 = tmpObj.x;
                        tmpObj.y1 = tmpObj.y;
                        tmpObj.x2 = data[i + 1];
                        tmpObj.y2 = data[i + 2];
                        tmpObj.x3 = tmpObj.x2 + (tmpObj.x2 - tmpObj.oldPos.x2);
                        tmpObj.y3 = tmpObj.y2 + (tmpObj.y2 - tmpObj.oldPos.y2);
                        tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 3] : tmpObj.d2;
                        tmpObj.d2 = data[i + 3];
                        tmpObj.dt = 0;
                        tmpObj.buildIndex = data[i + 4];
                        tmpObj.weaponIndex = data[i + 5];
                        tmpObj.weaponVariant = data[i + 6];
                        tmpObj.team = data[i + 7];
                        tmpObj.isLeader = data[i + 8];
                        tmpObj.oldSkinIndex = tmpObj.skinIndex;
                        tmpObj.oldTailIndex = tmpObj.tailIndex;
                        tmpObj.skinIndex = data[i + 9];
                        tmpObj.tailIndex = data[i + 10];
                        tmpObj.iconIndex = data[i + 11];
                        tmpObj.zIndex = data[i + 12];
                        tmpObj.visible = true;
                        tmpObj.update(game.tickSpeed);
                        tmpObj.dist2 = UTILS.getDist(tmpObj, player, 2, 2);
                        tmpObj.aim2 = UTILS.getDirect(tmpObj, player, 2, 2);
                        tmpObj.dist3 = UTILS.getDist(tmpObj, player, 3, 3);
                        tmpObj.aim3 = UTILS.getDirect(tmpObj, player, 3, 3);
                        if (spike) {
                            tmpObj.Saim = UTILS.getDirect(tmpObj, spike, 2, 2);
                        }
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


                        nEy = tmpObj;
                        if (tmpObj == player) {
                            if (gameObjects.length) {
                                gameObjects.forEach((tmp) => {
                                    tmp.onNear = false;
                                    if (tmp.active) {
                                        if (!tmp.onNear && UTILS.getDist(tmp, tmpObj, 0, 2) <= tmp.scale + items.weapons[tmpObj.weapons[0]].range) {
                                            tmp.onNear = true;
                                        }
                                        if (tmp.isItem && tmp.owner) {
                                            if (!tmp.pps && tmpObj.sid == tmp.owner.sid && UTILS.getDist(tmp, tmpObj, 0, 2) > (parseInt(getEl("breakRange").value) || 0) && !tmp.breakObj && ![13, 14, 20].includes(tmp.id)) {
                                                tmp.breakObj = true;
                                                breakObjects.push({
                                                    x: tmp.x,
                                                    y: tmp.y,
                                                    sid: tmp.sid
                                                });
                                            }
                                        }
                                    }
                                });
                                let nearTrap = gameObjects.filter(e => e.trap && e.active && UTILS.getDist(e, tmpObj, 0, 2) <= (tmpObj.scale + e.getScale() + 5) && !e.isTeamObject(tmpObj)).sort(function(a, b) {
                                    return UTILS.getDist(a, tmpObj, 0, 2) - UTILS.getDist(b, tmpObj, 0, 2);
                                })[0];
                                let spike = gameObjects.filter(obj => (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "spinning spikes" || obj.name == "poison spikes") && fgdo(player, obj) < player.scale + obj.scale + 22 && !obj.isTeamObject(tmpObj) && obj.active)[0]
                                if (nearTrap) {
                                    traps.dist = UTILS.getDist(nearTrap, tmpObj, 0, 2);
                                    traps.aim = UTILS.getDirect(spike ? spike : nearTrap, tmpObj, 0, 2);
                                    if (!traps.inTrap) {
                                        traps.protect(traps.aim, nearTrap);
                                    }
                                    traps.inTrap = true;
                                    traps.info = nearTrap;
                                } else {
                                    traps.inTrap = false;
                                    traps.info = {};
                                }
                            } else {
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
                    i += 13;
                }
                if (waitTicks.length) {
                    waitTicks.forEach((ajaj) => {
                        ajaj();
                    }
                                     );
                    waitTicks = [];
                }
                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp) => {
                        checkProjectileHolder(...tmp);
                    }
                                         );
                    runAtNextTick = [];
                }
                if (textManager.stack.length) {
                    let stacks = [];
                    let notstacks = [];
                    let num = 0;
                    let num2 = 0;
                    let pos = {
                        x: null,
                        y: null
                    };
                    let pos2 = {
                        x: null,
                        y: null
                    }
                    textManager.stack.forEach((text) => {
                        if (text.value >= 0) {
                            if (num == 0) pos = {
                                x: text.x,
                                y: text.y
                            };
                            num += Math.abs(text.value);
                        } else {
                            if (num2 == 0) pos2 = {
                                x: text.x,
                                y: text.y
                            };
                            num2 += Math.abs(text.value);
                        }
                    });
                    if (num2 > 0) {
                        textManager.showText(pos2.x, pos2.y, Math.max(43, Math.min(50, num2)), 0.18, 500, num2, healTextColor);
                    }
                    if (num > 0) {
                        textManager.showText(pos.x, pos.y, Math.max(43, Math.min(50, num)), 0.18, 500, num, damageTextColor);
                    }
                    textManager.stack = [];
                }
                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp) => {
                        checkProjectileHolder(...tmp);
                    });
                    runAtNextTick = [];
                }
                for (let i = 0; i < data.length;) {
                    tmpObj = findPlayerBySID(data[i]);
                    if (tmpObj) {
                        if (!tmpObj.isTeam(player)) {
                            enemy.push(tmpObj);
                            if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + (player.scale * 2)) {
                                nears.push(tmpObj);
                            }
                        }
                        tmpObj.manageReload();
                        if (tmpObj != player) {
                            tmpObj.addDamageThreat(player);
                        }
                    }
                    i += 13;
                }
                /*projectiles.forEach((proj) => {
            tmpObj = proj;
            if (tmpObj.active) {
                tmpObj.tickUpdate(game.tickSpeed);
            }
        });*/
                if (player && player.alive) {
                    if (enemy.length) {
                        if (player && player.alive){
                            placeableSpikes = getPlaceablePositions(player, items.list[player.items[2]]);
                            placeableTraps = player.items[4] == 15 ? getPlaceablePositions(player, items.list[player.items[4]]) : [];
                        }

                        near = enemy.sort(function(tmp1, tmp2) {
                            return tmp1.dist2 - tmp2.dist2;
                        })[0];
                    } else {
                        // console.log("no enemy");
                    }
                    if (configs.autoq && near.dist2 <= 255 && player.shameCount < 4) {
                        place(0, getAttackDir());
                    }
                    if (game.tickQueue[game.tick]) {
                        game.tickQueue[game.tick].forEach((action) => {
                            action();
                        });
                        game.tickQueue[game.tick] = null;
                    }
                    if (advHeal.length) {
                        advHeal.forEach(updHealth => {
                            let sid = updHealth[0];
                            let value = updHealth[1];
                            let damaged = updHealth[2];
                            tmpObj = findPlayerBySID(sid);
                            let bullTicked = false;
                            if (tmpObj.health <= 0) {
                                if (!tmpObj.death) {
                                    tmpObj.death = true;
                                    if (tmpObj != player) {
                                        addMenuChText('', `${tmpObj.name} ${randomizePhrases2()}`, 'red');
                                    }
                                    addDeadPlayer(tmpObj);
                                }
                            }
                            if (tmpObj == player) {
                                if (tmpObj.skinIndex == 7 && (damaged == 5 || (tmpObj.latestTail == 13 && damaged == 2))) {
                                    if (my.reSync) {
                                        my.reSync = false;
                                        tmpObj.setBullTick = true;
                                    }
                                    bullTicked = true;
                                }
                                if (inGame) {
                                    let attackers = getAttacker(damaged);
                                    let gearDmgs = [0.25, 0.45].map(val => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                                    let includeSpikeDmgs = !bullTicked && gearDmgs.includes(damaged);
                                    let healTimeout = 700 / 14; //healing
                                    let slowHeal = function (timer) {
                                        setTimeout(() => {
                                            healer();
                                        }, timer);
                                    };
                                     if(near.dist2 <= 150 && damaged >= 45 && tmpObj.shamecount < 4) {
                                   //rimdiestobatspam();
                                         handleDmgPot();
                                   tmpObj.addDamageThreat(player);
                                   healer();
                                    //buyEquip(11, 0);
                                  }
                                    //if(antiSync) {
                                   // healer();
                                 //   player.canEmpAnti = false;
                                 // }
                                    /*let total = 0;
                                let MuandTu = [37, 38, 19, 25, 50, 75, 56, 57];
                                let damages = [35, 39, 41, 45, 37, 38, 50, 30];
                                if (damaged >= (includeSpikeDmgs ? 8 : 20) && tmpObj.damageThreat >= 25 && (game.tick - tmpObj.antiTimer) > 1) {
                                    player.canEmpAnti = true;
                                    player.antiTimer = game.tick;
                                    let shame = Math.floor(Math.random() * (6 - 4) + 3);
                                    if(player.health < 22 && player.shameCount < 6) {
                                        healer();
                                    } else if(damaged > 10 && configs.AntiHeal && player.shameCount < 6) {
                                        healer();
                                    } else if(player.health < 50 && damaged !== MuandTu.length && player.shameCount > 2 && player.shameCount < 6) {
                                        healer();
                                    } else if((damaged == damages.length || (damaged > 10 && damaged < 25)) && player.shameCount <= 5) {
                                        healer();
                                    } else if (tmpObj.shameCount < shame) {
                                        healer();
                                    } else {
                                        slowHeal(healTimeout);
                                    }
                                } else {
                                    if(player.health < 22 && player.shameCount < 6) {
                                        healer();
                                    } else {
                                        slowHeal(healTimeout);
                                    }
                                }*/
                                    if (getEl('healingBeta').checked) {
                                        if (attackers.length) {
                                            let by = attackers.filter(tmp => {
                                                if (tmp.dist2 <= (tmp.weaponIndex < 9 ? 300 : 700)) {
                                                    tmpDir = UTILS.getDirect(player, tmp, 2, 2);
                                                    if (UTILS.getAngleDist(tmpDir, tmp.d2) <= Math.PI) {
                                                        return tmp;
                                                    }
                                                }
                                            });
                                            if (by.length) {
                                                let maxDamage = includeSpikeDmgs ? 10 : 10;
                                                if (damaged > maxDamage && game.tick - tmpObj.antiTimer > 1) {
                                                    tmpObj.canEmpAnti = true;
                                                    tmpObj.antiTimer = game.tick;
                                                    let shame = 4;
                                                    if (tmpObj.shameCount < shame) {
                                                        healer();
                                                    } else {
                                                        slowHeal(healTimeout);
                                                    }
                                                } else {
                                                    slowHeal(healTimeout);
                                                }
                                            } else {
                                                slowHeal(healTimeout);
                                            }
                                        } else {
                                            slowHeal(healTimeout);
                                        }
                                    } else {
                                        if (damaged >= (includeSpikeDmgs ? 8 : 20) && tmpObj.damageThreat >= 25 && game.tick - tmpObj.antiTimer > 1) {
                                            tmpObj.canEmpAnti = true;
                                            tmpObj.antiTimer = game.tick;
                                            let shame = 5;
                                            if (tmpObj.shameCount < shame) {
                                                healer();
                                            } else {
                                                slowHeal(healTimeout);
                                            }
                                        } else {
                                            slowHeal(healTimeout);
                                        }
                                    }
                                   // if (damaged >= 20 && player.skinIndex == 11) instaC.canCounter = true;
                                }
                            } else {
                                if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || (tmpObj.latestTail == 13 && tmpObj.damaged == 2))) {
                                    tmpObj.setPoisonTick = true;
                                }
                            }
                        });
                        advHeal = [];
                    }
                    players.forEach((tmp) => {
                        if (!tmp.visible && player != tmp) {
                            tmp.reloads = {
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
                                53: 0,
                            };
                        }
                        if (tmp.setBullTick) {
                            tmp.bullTimer = 0;
                        }
                        if (tmp.setPoisonTick) {
                            tmp.poisonTimer = 0;
                        }
                        tmp.updateTimer();
                    });
                    if (inGame) {
                        if (enemy.length) {
                            if (player.canEmpAnti) {
                                player.canEmpAnti = false;
                                if (near.dist2 <= 300 && !my.safePrimary(near) && !my.safeSecondary(near)) {
                                    if (near.reloads[53] == 0) {
                                        player.empAnti = true;
                                        player.soldierAnti = false;
                                        textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Do Soldier Anti", "#fff", 2);
                                        buyEquip(22, 0);
                                        buyEquip(23, 1);
                                    } else {
                                        player.empAnti = false;
                                        player.soldierAnti = true;
                                        textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Soldier Anti", "#fff", 2);
                                        buyEquip(11, 0);
                                        buyEquip(18, 1);
                                    }
                                }
                            }
                            let prehit = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= (tmp.scale + near.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                            })[0];
                            if (prehit) {
                                if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && configs.predictTick) {
                                    instaC.canSpikeTick = true;
                                    instaC.syncHit = true;
                                    if (configs.revTick && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
                                        instaC.revTick = true;
                                    }
                                }
                            }

                            let antiSpikeTick = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + player.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2);
                            })[0];
                            if (antiSpikeTick && !traps.inTrap) {
                                if (near.dist2 <= items.weapons[5].range + near.scale * 1.8) {
                                    my.anti0Tick = 1;
                                    textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Anti Vel Spiketick", "#fff", 2);
                                    packet("a", near.dir + 180, 1);
                                    game.tickBase(() => {
                                        packet("a", lastMoveDir || undefined, 1);
                                    }, 1);
                                }
                            }
                        }

                        let c = false;
                        let d = true;
                        if (my.anti0tick == 0) {
                            if (my.anti0tick > 0) {
                                buyEquip(6, 0);
                            }
                            if (doEmpAntiInsta) {
                                buyEquip(22, 0);
                            } else {
                                if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                                    buyEquip(31, 0);
                                } else {
                                    if (enemy.length) {
                                        if (near.dist2 <= items.weapons[near.primaryIndex ? near.primaryIndex : 5].range + player.scale * 3) {
                                            if (this.antiBull > 0 && player.weapons[0] != 7) {
                                                buyEquip(11, 0);
                                            } else {
                                                buyEquip(6, 0);
                                            }
                                        } else {
                                            biomeGear(1);
                                        }
                                    } else {
                                        biomeGear(1);
                                    }
                                }
                            }
                        }
                        if ((useWasd ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || (useWasd && Math.floor(Math.random() * 5) == 0)) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && (useWasd ? true : getEl("instaType").value == "oneShot" ? (player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate)) : true) && instaC.perfCheck(player, near)) {
                            instaC.nobull = false;
                            instaC.can = true;
                        } else {
                            instaC.can = false;
                        }
                        let nearTrap = gameObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function(a, b) {
                            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                        })[0];

                        if(nearTrap && near.skinIndex == 6) {
                            setTimeout(() => {
                                instaC.can = true;
                                instaC.nobull = false;
                            }, items.weapons[near.weaponIndex] - near.reloads[near.weaponIndex] + near.pinge)
                        }

                        //auto insta
                        /*if ((useWasd ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || (useWasd && Math.floor(Math.random() * 5) == 0)) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && (useWasd ? true : getEl("instaType").value == "oneShot" ? (player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate)) : true) && instaC.perfCheck(player, near)) {
                                if (player.checkCanInsta(true) >= 100) {
                                    instaC.nobull = useWasd ? false : instaC.canSpikeTick ? false : true;
                                } else {
                                    instaC.nobull = false;
                                }
                                instaC.can = true;
                            } else {
                                instaC.can = false;
                            }*/
                        macro.q && place(0, getAttackDir());
                        macro.f && place(4, getSafeDir());
                        macro.v && place(2, getSafeDir());
                        macro.y && place(5, getSafeDir());
                        macro.h && place(player.getItemType(22), getSafeDir());
                        macro.n && place(3, getSafeDir());
                        if (game.tick % 3 == 0) {
                            if (mills.place) {
                                let plcAng = 1.25;
                                for (let i = -plcAng; i <= plcAng; i += plcAng) {
                                    checkPlace(3, UTILS.getDirect(player.oldPos, player, 2, 2) + i);


                                }
                            } else {
                                if (mills.placeSpawnPads) {
                                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                        checkPlace(player.getItemType(20), UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                                    }
                                }
                            }
                        }
                        if (instaC.can) {
                            instaC.changeType(player.weapons[1] == 10 ? "rev" : instaC.nobull ? "nobull" : "normal");
                        }
                        if (instaC.canCounter) {
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
                            } else {
                                if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                    instaC.spikeTickType();
                                    if (instaC.syncHit) {
                                    }
                                }
                            }
                        }
                        if (!clicks.middle && (clicks.left || clicks.right) && !instaC.isTrue) {
                            if ((player.weaponIndex != (clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0])) || player.buildIndex > -1) {
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
                        if (traps.inTrap) {
                            if (!clicks.left && !clicks.right && !instaC.isTrue) {
                                if (player.weaponIndex != (traps.notFast() ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
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
                        if (macro.g && !traps.inTrap) {
                            if (!instaC.isTrue && player.reloads[player.weapons[1]] == 0) {
                                if (my.ageInsta && player.weapons[0] != 4 && player.weapons[1] == 9 && player.age >= 9 && enemy.length) {
                                    instaC.bowMovement();
                                } else {
                                    instaC.rangeType();
                                }
                            }
                        }
                        if (macro.t && !traps.inTrap) {
                            if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0 && (player.weapons[1] == 15 ? (player.reloads[player.weapons[1]] == 0) : true) && (player.weapons[0] == 5 || (player.weapons[0] == 4 && player.weapons[1] == 15))) {
                                instaC[(player.weapons[0] == 4 && player.weapons[1] == 15) ? "kmTickMovement" : "tickMovement"]();
                            }
                        }
                        if (macro["."] && !traps.inTrap) {
                            if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0 && ([9, 12, 13, 15].includes(player.weapons[1]) ? (player.reloads[player.weapons[1]] == 0) : true)) {
                                instaC.boostTickMovement();
                            }
                        }
                        if (player.weapons[1] && !clicks.left && !clicks.right && !traps.inTrap && !instaC.isTrue && !(near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8)) {
                            if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                                if (!my.reloaded) {
                                    my.reloaded = true;
                                    let fastSpeed = items.weapons[player.weapons[0]].spdMult < items.weapons[player.weapons[1]].spdMult ? 1 : 0;
                                    if (player.weaponIndex != player.weapons[fastSpeed] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[fastSpeed]);
                                    }
                                }
                            } else {
                                my.reloaded = false;
                                if (player.reloads[player.weapons[0]] > 0) {
                                    if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[0]);
                                    }
                                } else if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] > 0) {
                                    if (player.weaponIndex != player.weapons[1] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[1]);
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
                        if (!instaC.isTrue && configs.autoPlace) {
                            game.tickBase(() => {
                                traps.ReTrap();
                            }, 1);
                        }
                        let doEmpAntiInsta = false;
                        if (judgeAtNextTick) {
                            judgeAtNextTick = false;
                            if (enemy.length && near.reloads[53] <= game.tickRate && (near.secondaryIndex != 10 && near.secondaryIndex != 11 && near.secondaryIndex != 14)) {
                                doEmpAntiInsta = true;
                            }
                        }
                        function safeWeapon1() {
                            return (near.primaryIndex == 0 || near.primaryIndex == 6 || near.primaryIndex == 7 || near.primaryIndex == 8);
                        }

                        function safeWeapon2() {
                            return (near.secondaryIndex == 9 || near.secondaryIndex == 10 || near.secondaryIndex == 11 || near.secondaryIndex == 14);
                        }
                        var bulltick = false;
                        // switch shit
                        let hatChanger = function() {
                            if (my.anti0Tick > 0) {
                                buyEquip(6, 0);
                            } else {
                                if (clicks.left || clicks.right) {
                                    if (((player.shameCount > 0 && (game.tick - player.bullTick) % 7 == 0 && player.skinIndex != 45) || my.reSync)) {
                                        buyEquip(7, 0);
                                        if (near.dist2 > 200 || !enemy.length) {
                                            bulltick = true;
                                            buyEquip(7, 0);
                                            game.tickBase(() => {
                                                buyEquip(7, 0);
                                                game.tickBase(() => {
                                                    buyEquip(7, 0);
                                                }, 3);
                                            }, 1);
                                        } else {
                                            bulltick = false;
                                        }
                                    } else {
                                        if (clicks.left) {
                                            buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 22 : player.soldierAnti ? 6 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                        } else if (clicks.right) {
                                            buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 0 : player.soldierAnti ? 0 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                        }
                                    }
                                } else if (traps.inTrap) {
                                    if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                        buyEquip(40, 0);
                                        if (near.dist2 > 300 && (!player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                            buyEquip(58, 0);
                                        }
                                    } else {
                                        if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                            buyEquip(7, 0);
                                            buyEquip(19, 1);
                                        } else {
                                            buyEquip((player.empAnti || near.dist2 > 300 || !enemy.length) ? 22 : 6, 0);
                                        }
                                    }
                                } else {
                                    if ((player.empAnti || player.soldierAnti) && bulltick == false) {
                                        buyEquip(player.empAnti ? 22 : 6, 0);
                                    } else {
                                        if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                            buyEquip(7, 0);
                                        } else {
                                            if (near.dist2 <= 300 && bulltick == false) {
                                                buyEquip((getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6, 0);
                                            } else {
                                                if (bulltick == false) {
                                                    biomeGear(1);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        function findOBJ(sid) {
                            let findObj = findObjectBySid(sid);
                        }
                        let accChanger = function() {
                            if(near.dist2 <= 400){
                                buyEquip(21, 1);
                            }
                            else if(clicks.left){
                                buyEquip(21, 1);
                            }
                            else{
                                traps.inTrap ? buyEquip(11, 1) : buyEquip(11, 1);
                            }
                        }
                        if (storeMenu.style.display != "block" && !instaC.isTrue && !instaC.ticking) {
                            hatChanger();
                            accChanger();
                        }
                        if (pathFind.active && autoPush.pushing == true && near.dist2 < 1000) {
                            Pathfinder();
                        }
                        if (configs.autoPush && enemy.length && !traps.inTrap && !instaC.ticking) {
                            autoPush();
                        } else {
                            if (my.autoPush) {
                                my.autoPush = false;
                                packet("a", lastMoveDir || undefined, 1);
                            }
                        }
                        if (instaC.ticking) {
                            instaC.ticking = false;
                        }
                        if (instaC.syncHit) {
                            instaC.syncHit = false;
                        }
                        if (player.empAnti) {
                            player.empAnti = false;
                        }
                        if (getEl("RVN").checked) {
                            antiPush();
                        }
                        if (player.soldierAnti) {
                            player.soldierAnti = false;
                        }
                        if (my.anti0Tick > 0) {
                            my.anti0Tick--;
                        }
                        if (traps.replaced) {
                            traps.replaced = false;
                        }
                        if (traps.antiTrapped) {
                            traps.antiTrapped = false;
                        }
                        const getPotentialDamage = (build, user) => {
                            const weapIndex = user.weapons[1] === 10 && !player.reloads[user.weapons[1]] ? 1 : 0;
                            const weap = user.weapons[weapIndex];
                            if (player.reloads[weap]) return 0;
                            const weapon = items.weapons[weap];
                            const inDist = cdf(build, user) <= build.getScale() + weapon.range;
                            return (user.visible && inDist) ? weapon.dmg * (weapon.sDmg || 1) * 3.3 : 0;
                        };

                        const AutoReplace = () => {
                            const replaceable = [];
                            const playerX = player.x;
                            const playerY = player.y;
                            const gameObjectCount = gameObjects.length;

                            for (let i = 0; i < gameObjectCount; i++) {
                                const build = gameObjects[i];
                                if (build.isItem && build.active && build.health > 0) {
                                    const item = items.list[build.id];
                                    const posDist = 35 + item.scale + (item.placeOffset || 0);
                                    const inDistance = cdf(build, player) <= posDist * 2;
                                    if (inDistance) {
                                        let canDeal = 0;
                                        const playersCount = players.length;
                                        for (let j = 0; j < playersCount; j++) {
                                            canDeal += getPotentialDamage(build, players[j]);
                                        }
                                        if (build.health <= canDeal) {
                                            replaceable.push(build);
                                        }
                                    }
                                }
                            }

                            const findPlacementAngle = (player, itemId, build) => {
                                if (!build) return null;
                                const MAX_ANGLE = 2 * Math.PI;
                                const ANGLE_STEP = Math.PI / 360;
                                const item = items.list[player.items[itemId]];
                                let buildingAngle = Math.atan2(build.y - player.y, build.x - player.x);
                                let tmpS = player.scale + (item.scale || 1) + (item.placeOffset || 0);

                                for (let offset = 0; offset < MAX_ANGLE; offset += ANGLE_STEP) {
                                    let angles = [(buildingAngle + offset) % MAX_ANGLE, (buildingAngle - offset + MAX_ANGLE) % MAX_ANGLE];
                                    for (let angle of angles) {
                                        return angle;
                                    }
                                }
                                return null;
                            };

                            const replace = (() => {
                                let nearTrap = liztobj.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && cdf(tmp, player) <= tmp.getScale() + 5);
                                let spike = gameObjects.find(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && cdf(tmp, player) < 87 && !nearTrap.length);
                                const buildId = spike ? 4 : 2;

                                replaceable.forEach(build => {
                                    let angle = findPlacementAngle(player, buildId, build);
                                    if (angle !== null) {
                                        place(buildId, angle);
                                    }
                                });
                            });

                            if (near && near.dist3 <= 360) {
                                traps.replacer();
                            }
                            traps.replacer();
                        }
                        }
                }
                if (botSkts.length) {
                    botSkts.forEach((bots) => {
                        if (true) {
                            bots[0].showName = 'YEAHHH';
                        }
                    });
                }
            }
            for(var i1 = 0; i1 < liztobj.length; i1++) {
                if (liztobj[i1].active && liztobj[i1].health > 0 && UTILS.getDist(liztobj[i1], player, 0, 2) < 150) { // || liztobj[i1].buildHealth <= items.weapons[nearEnemy.weaponIndex].dmg)

                    if(liztobj[i1].name.includes("spike") && liztobj[i1]){
                        if(liztobj[i1].owner.sid != player.sid && clicks.left == false && tmpObj.reloads[tmpObj.secondaryIndex] == 0){
                            selectWeapon(player.weapons[1])
                            buyEquip(40, 0);
                            packet("D", UTILS.getDirect(liztobj[i1], player, 0, 2))
                            setTickout( () => {
                                buyEquip(6, 0)
                            }, 1);
                        }
                    }
                }
                if (near.health - (Math.round(player.weapons[0] == undefined ? 0 : items.weapons[player.weapons[0]].dmg * sortWeaponVariant(player.weaponVariant) * 1.5 * (near.skinIndex == 6 ? 0.75 : 1))) <= 0) {
                        return true;
                    }
                    return false;


                            let DmgPotStuff = {
                    predictedDamage: 0
                };

                function handleDmgPot() {
                    DmgPotStuff.predictedDamage = 0;
                    for (let i = 0; i < nears.length; i++) {
                        let singleIndividual = nears[i];
                        if (singleIndividual.primaryIndex != undefined) {
                            if (singleIndividual.reloads[singleIndividual.weapons[0]] == 0) {
                                DmgPotStuff.predictedDamage += items.weapons[singleIndividual.weapons[0]].dmg * sortWeaponVariant(singleIndividual.weaponVariant) * 1.5
                            }
                        } else {
                            DmgPotStuff.predictedDamage += 45
                        }
                        if (singleIndividual.secondaryIndex != undefined) {
                            if (singleIndividual.reloads[singleIndividual.weapons[1]] == 0) {
                                if (items.weapons[singleIndividual.weapons[1]] == 10) {
                                    DmgPotStuff.predictedDamage += items.weapons[singleIndividual.weapons[1]].dmg * sortWeaponVariant(singleIndividual.weaponVariant)
                                } else {
                                    DmgPotStuff.predictedDamage += items.weapons[singleIndividual.weapons[1]].pDmg
                                }
                            }
                        } else {
                            DmgPotStuff.predictedDamage += 50
                        }
                        if (singleIndividual.reloads[53] == 0) {
                            DmgPotStuff.predictedDamage += 25
                        }
                    }
                    return DmgPotStuff.predictedDamage
                }
                const getDistance = (x1, y1, x2, y2) => {
                    let dx = x2 - x1;
                    let dy = y2 - y1;
                    return Math.sqrt(dx * dx + dy * dy);
                };
                const getPotentialDamage = (build, user) => {
                    const weapIndex = user.weapons[1] === 10 && !player.reloads[user.weapons[1]] ? 1 : 0;
                    const weap = user.weapons[weapIndex];
                    if (player.reloads[weap]) return 0;
                    const weapon = items.weapons[weap];
                    const inDist = getDistance(build.x, build.y, user.x2, user.y2) <= build.getScale() + weapon.range;
                    return (user.visible && inDist) ? weapon.dmg * (weapon.sDmg || 1) * 3.3 : 0;
                };

                const findPlacementAngle = (player, itemId, build) => {
                    if (!build) return null;
                    const MAX_ANGLE = 2 * Math.PI;
                    const ANGLE_STEP = Math.PI / 360;
                    const item = items.list[player.items[itemId]];
                    let buildingAngle = Math.atan2(build.y - player.y, build.x - player.x);
                    let tmpS = player.scale + (item.scale || 1) + (item.placeOffset || 0);

                    for (let offset = 0; offset < MAX_ANGLE; offset += ANGLE_STEP) {
                        let angles = [(buildingAngle + offset) % MAX_ANGLE, (buildingAngle - offset + MAX_ANGLE) % MAX_ANGLE];
                        for (let angle of angles) {
                            let tmpX = player.x + tmpS * Math.cos(angle);
                            let tmpY = player.y + tmpS * Math.sin(angle);
                            if (objectManager.customCheckItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player, build, gameObjects, UTILS, config)) {
                                return angle;
                            }
                        }
                    }
                    return null;
                };
                const AutoReplace = () => {
                    const replaceable = [];
                    const playerX = player.x;
                    const playerY = player.y;
                    const gameObjectCount = gameObjects.length;
                    for (let i = 0; i < gameObjectCount; i++) {
                        const build = gameObjects[i];
                        if (build.isItem && build.active && build.health > 0) {
                            let potentialDamage = players.reduce((total, p) => total + getPotentialDamage(build, p), 0);
                            if (build.health <= potentialDamage) {
                                replaceable.push(build);
                            }
                        }
                    }
                    const replace = () => {
                        let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && getDistance(tmp.x, tmp.y, playerX, playerY) <= tmp.getScale() + 5);
                        let spike = gameObjects.find(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && getDistance(tmp.x, tmp.y, playerX, playerY) < 87 && !nearTrap.length);
                        const buildId = spike ? 4 : 2;

                        replaceable.forEach(build => {
                            let angle = findPlacementAngle(player, buildId, build);
                            if (angle !== null) {
                                place(buildId, angle);
                            }
                        });
                    };
                    const replaceDelay = game.tickSpeed - (window.pingTime || 0) + (game.tickSpeed < 110 ? 5 : 0);
                    if (near && near.dist2 <= 360) {
                        setTimeout(replace, replaceDelay);
                    }
                };
                if (botSkts.length) {
                    botSkts.forEach((bots) => {
                        if (true) {
                            bots[0].ssend("player", player, near, botIDS);
                        }
                    });
                }
            }
            // UPDATE LEADERBOARD:
            function updateLeaderboard(data) {
                lastLeaderboardData = data;
                return;
                UTILS.removeAllChildren(leaderboardData);
                let tmpC = 1;
                for (let i = 0; i < data.length; i += 3) {
                    (function(i) {
                        UTILS.generateElement({
                            class: "leaderHolder",
                            parent: leaderboardData,
                            children: [
                                UTILS.generateElement({
                                    class: "leaderboardItem",
                                    style: "color:" + ((data[i] == playerSID) ? "#fff" : "rgba(255,255,255,0.6)"),
                                    text: tmpC + ". " + (data[i+1] != "" ? data[i+1] : "unknown")
                                }),
                                UTILS.generateElement({
                                    class: "leaderScore",
                                    text: UTILS.sFormat(data[i+2]) || "0"
                                })
                            ]
                        });
                    })(i);
                    tmpC++;
                }
            }

            // LOAD GAME OBJECT:
            function loadGameObject(data) {
                for (let i = 0; i < data.length;) {
                    objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4],
                                      data[i + 5], items.list[data[i + 6]], true, (data[i + 7] >= 0 ? {
                        sid: data[i + 7]
                    } : null));
                    i += 8;
                }
            }
            // ADD AI:
            function loadAI(data) {
                for (let i = 0; i < ais.length; ++i) {
                    ais[i].forcePos = !ais[i].visible;
                    ais[i].visible = false;
                }
                if (data) {
                    let tmpTime = performance.now();
                    for (let i = 0; i < data.length;) {
                        tmpObj = findAIBySID(data[i]);
                        if (tmpObj) {
                            tmpObj.index = data[i + 1];
                            tmpObj.t1 = (tmpObj.t2 === undefined) ? tmpTime : tmpObj.t2;
                            tmpObj.t2 = tmpTime;
                            tmpObj.x1 = tmpObj.x;
                            tmpObj.y1 = tmpObj.y;
                            tmpObj.x2 = data[i + 2];
                            tmpObj.y2 = data[i + 3];
                            tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 4] : tmpObj.d2;
                            tmpObj.d2 = data[i + 4];
                            tmpObj.health = data[i + 5];
                            tmpObj.dt = 0;
                            tmpObj.visible = true;
                        } else {
                            tmpObj = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                            tmpObj.x2 = tmpObj.x;
                            tmpObj.y2 = tmpObj.y;
                            tmpObj.d2 = tmpObj.dir;
                            tmpObj.health = data[i + 5];
                            if (!aiManager.aiTypes[data[i + 1]].name)
                                tmpObj.name = config.cowNames[data[i + 6]];
                            tmpObj.forcePos = true;
                            tmpObj.sid = data[i];
                            tmpObj.visible = true;
                        }
                        i += 7;
                    }
                }
            }
            // ANIMATE AI:
            function animateAI(sid) {
                tmpObj = findAIBySID(sid);
                if (tmpObj) tmpObj.startAnim();
            }
            function gatherAnimation(sid, didHit, index) {
                tmpObj = findPlayerBySID(sid);
                if (tmpObj) {
                    tmpObj.startAnim(didHit, index);
                    tmpObj.gatherIndex = index;
                    tmpObj.gathering = 1;

                    if (didHit) {
                        let tmpObjects = objectManager.hitObj;
                        if (tmpObj == near && getEl("smartanti").checked && tmpObj.dist2 <= 250) {
                        let weaponName = items.weapons[index].name;
                        if (weaponName == "polearm") {
                            buyEquip(1, 6);
                            if (tmpObj.damaged > 0) {
                                storeEquip(1, 22);
                                if (tmpObj.damaged > 0) {
                                    //selectWeapon(player.weapons[0]);
                                    storeEquip(1, 11);
                                    storeEquip(18, 1);
                                    //sendAutoGather();
                                    //sendAutoGather();
                                    healer();
                                }
                            }
                        }
                        if (weaponName == "short sword") {
                            buyEquip(1, 6);
                            if (tmpObj.damaged > 0) {
                                buyEquip(1, 22);
                                if (tmpObj.damaged > 0) {
                                    //selectWeapon(player.weapons[0]);
                                    buyEquip(1, 11);
                                    buyEquip(18, 1);
                                    //sendAutoGather();
                                   // sendAutoGather();
                                    healer();
                                }
                            }
                        }
                    }
                        //preplacer

                        setTickout(() => {
                            setTimeout(() => {
                                if(near.dist2 <= 300) {
                                    this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                    textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Preplace", "#fff", 2);
                                } else {
                                    this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                    textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Preplace", "#fff", 2);
                                }
                            }, items.weapons[index].speed - window.pingTime)
                        }, 2)
                        objectManager.hitObj = [];
                        game.tickBase(() => {
                            // refind
                            tmpObj = findPlayerBySID(sid);
                            let val = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * (tmpObj.skinIndex == 40 ? 3.3 : 1);
                            tmpObjects.forEach((healthy) => {
                                healthy.healthMov = healthy.health - val / 2;
                                healthy.health -= val;
                                // Display damage text for each hit
                            });
                        }, 1);
                    }
                }
            }


            // WIGGLE GAME OBJECT:
            function wiggleGameObject(dir, sid) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);
                    if (tmpObj.health) {
                        //tmpObj.damaged = Math.min(255, tmpObj.damaged + 60);
                        objectManager.hitObj.push(tmpObj);
                    }
                }
            }
            // SHOOT TURRET:
            function shootTurret(sid, dir) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    if (config.anotherVisual) {
                        tmpObj.lastDir = dir;
                    } else {
                        tmpObj.dir = dir;
                    }
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir + Math.PI);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir + Math.PI);
                }
            }
            function randomizePhrases2() {
                const phrases = ['were slain...', 'met their demise...', 'life was extinguished...', 'perished...', 'were overwhelmed...', 'were defeated...', 'were vanquished...', 'bit the dust...', 'met a tragic end...', 'were obliterated...', 'met a gruesome fate...', 'were eradicated...', 'were annihilated...', 'were crushed...', 'were overwhelmed...', 'were turned to ash...', 'were reduced to rubble...', 'were shattered...', 'were disintegrated...', 'were torn apart...', 'were consumed by darkness...', 'were consumed by the void...', 'were consumed by the abyss...', 'were consumed by chaos...', 'were consumed by despair...', 'were consumed by madness...', 'were consumed by the unknown...', 'were consumed by the shadows...'];
                return phrases[Math.floor(Math.random() * phrases.length)];
            }
            var killCounter = getEl("killCounter");
            // UPDATE PLAYER VALUE:
            function updatePlayerValue(index, value, updateView) {
                traps.runPrePlacer();
                if (player) {
                    player[index] = value;
                    if (index == "points") {
                        if (configs.autoBuy) {
                            autoBuy.hat();
                            autoBuy.acc();
                        }
                    } else if (index == "kills") {
                        if (configs.killChat) {
                            io.send("6", "Auto-GG Project X V5 Reborn");
                            textManager.showText(player.x2, player.y2 + 50, 30, 0.15, 1850, "+1 kill XDD", "#fff", 2);
                        }
                    }
                }
            }
            // ACTION BAR:
            function updateItems(data, wpn) {
                if (data) {
                    if (wpn) {
                        player.weapons = data;
                        player.primaryIndex = player.weapons[0];
                        player.secondaryIndex = player.weapons[1];
                        if (!instaC.isTrue) {
                            selectWeapon(player.weapons[0]);
                        }
                    } else {
                        player.items = data;
                    }
                }
                for (let i = 0; i < items.list.length; i++) {
                    let tmpI = items.weapons.length + i;
                    getEl("actionBarItem" + tmpI).style.display = player.items.indexOf(items.list[i].id) >= 0 ? "inline-block" : "none";
                }
                for (let i = 0; i < items.weapons.length; i++) {
                    getEl("actionBarItem" + i).style.display = player.weapons[items.weapons[i].type] == items.weapons[i].id ? "inline-block" : "none";
                }
                let kms = player.weapons[0] == 3 && player.weapons[1] == 15;
                if (kms) {
                    getEl("actionBarItem3").style.display = "none";
                    getEl("actionBarItem4").style.display = "inline-block";
                }
            }

            // ADD PROJECTILE:
            function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
                projectileManager.addProjectile(x, y, dir, range, speed, indx, null, null, layer, inWindow).sid = sid;
                runAtNextTick.push(Array.prototype.slice.call(arguments));
            }
            // REMOVE PROJECTILE:
            function remProjectile(sid, range) {
                for (let i = 0; i < projectiles.length; ++i) {
                    if (projectiles[i].sid == sid) {
                        projectiles[i].range = range;
                        let tmpObjects = objectManager.hitObj;
                        objectManager.hitObj = [];
                        game.tickBase(() => {
                            let val = projectiles[i].dmg;
                            tmpObjects.forEach((healthy) => {
                                if (healthy.projDmg) {
                                    healthy.health -= val;
                                }
                            });
                        }, 1);
                    }
                }
            }
            // SHOW ALLIANCE MENU:
            function allianceNotification(sid, name) {
                let findBotSID = findSID(bots, sid);
                if (findBotSID) { }
            }
            function setPlayerTeam(team, isOwner) {
                if (player) {
                    player.team = team;
                    player.isOwner = isOwner;
                    if (team == null)
                        alliancePlayers = [];
                }
            }
            function setAlliancePlayers(data) {
                alliancePlayers = data;
            }
            // STORE MENU:
            function updateStoreItems(type, id, index) {
                if (index) {
                    if (!type)
                        player.tails[id] = 1;
                    else {
                        player.latestTail = id;
                    }
                } else {
                    if (!type)
                        player.skins[id] = 1,
                            id == 7 && (my.reSync = true); // testing perfect bulltick...
                    else {
                        player.latestSkin = id;
                    }
                }
            }
            function isTeam(tmpObj) {
                return (tmpObj == player || (tmpObj.team && tmpObj.team == player.team));
            }

            // SEND MESSAGE:
            function receiveChat(sid, message) {
                if (message === 'Onichan~~' && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                    packet("6", "");
                    my.autoAim = true;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    sendAutoGather();
                    game.tickBase(() => {
                        selectWeapon(player.weapons[1]);
                        buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                        game.tickBase(() => {
                            sendAutoGather();
                            this.isTrue = false;
                            my.autoAim = false;
                        }, 1);
                    }, 1);
                }
                //autochat
                if (getEl("autochat").checked) {
                    if (message.includes("mod")) {
                        packet("6", "Project X V5 Reborn")
                    }
                    if (message.includes("what mod")) {
                        packet("6", "Project X V5 Reborn")
                    }
                    if (message.includes("ha thu")) {
                        packet("6", "YT:@pethune she is a coder")
                    }
                    if (message.includes("discord")) {
                        packet("6", "Discord Thu : hathu08._.")
                        }
                    if (message.includes("project x")) {
                        packet("6", "Project X v4 by HaThu")
                        }
                    if (message.includes("ha thu?")) {
                        packet("6", "yes i am ha thu")
                        }
                    if (message.includes("onichan")) {
                        packet("6", "Onichan~")
                        }
                    if (message.includes("uwu")) {
                        packet("6", "UwU~")
                        }
                    if (message.includes("hentai")) {
                        packet("6", "Onichan Hentai~~")



            }
            }
                let tmpPlayer = findPlayerBySID(sid);
                if (tmpPlayer) {
                    addMenuChText(`${tmpPlayer.name} {${tmpPlayer.sid}}`, message, "white");
                    if (config.anotherVisual) {
                        allChats.push(new addCh(tmpPlayer.x, tmpPlayer.y, message, tmpPlayer));
                    } else {
                        tmpPlayer.chatMessage = ((text) => {
                            let tmpString;
                            profanityList.forEach((list) => {
                                if (text.indexOf(list) > -1) {
                                    tmpString = "";
                                    for (var y = 0; y < list.length; ++y) {
                                        tmpString += tmpString.length?"o":"M";
                                    }
                                    var re = new RegExp(list, 'g');
                                    text = text.replace(re, tmpString);
                                }
                            });
                            return text;
                        })(message);
                        tmpPlayer.chatCountdown = config.chatCountdown;
                    }
                } else {
                    addMenuChText(`${"Anonymous"} {null}`, message, "white");
                }
            }
            // MINIMAP:
            function updateMinimap(data) {
                minimapData = data;
            }
            // SHOW ANIM TEXT:
            function showText(x, y, value, type) {
                if (config.anotherVisual) {
                    textManager.stack.push({x: x, y: y, value: value});
                } else {
                    textManager.showText(x, y, 50, 0.18, useWasd ? 500 : 1500, Math.abs(value), (value>=0)?"#fff":"#8ecc51");
                }
            }

            /** APPLY SOCKET CODES */
            // BOT:
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
                constructor(id, sid, hats, accessories) {
                    this.id = id;
                    this.sid = sid;
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
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].price <= 0)
                            this.tails[accessories[i].id] = 1;
                    }
                    this.skins = {};
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].price <= 0)
                            this.skins[hats[i].id] = 1;
                    }
                    this.spawn = function(moofoll) {
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
                        this.resetResources(moofoll);
                        this.items = [0, 3, 6, 10];
                        this.weapons = [0];
                        this.shootCount = 0;
                        this.weaponXP = [];
                        this.reloads = {};
                        this.whyDie = "";
                    };
                    // RESET MOVE DIR:
                    this.resetMoveDir = function() {
                        this.moveDir = undefined;
                    };
                    // RESET RESOURCES:
                    this.resetResources = function(moofoll) {
                        for (let i = 0; i < config.resourceTypes.length; ++i) {
                            this[config.resourceTypes[i]] = moofoll ? 100 : 0;
                        }
                    };
                    // SET DATA:
                    this.setData = function(data) {
                        this.id = data[0];
                        this.sid = data[1];
                        this.name = data[2];
                        this.x = data[3];
                        this.y = data[4];
                        this.dir = data[5];
                        this.health = data[6];
                        this.maxHealth = data[7];
                        this.scale = data[8];
                        this.skinColor = data[9];
                    };
                    // SHAME SYSTEM:
                    this.judgeShame = function () {
                        if (this.oldHealth < this.health) {
                            if (this.hitTime) {
                                let timeSinceHit = this.tick - this.hitTime;
                                this.hitTime = 0;
                                if (timeSinceHit < 2) {
                                    this.shameCount++;
                                } else {
                                    this.shameCount = Math.max(0, this.shameCount - 2);
                                }
                            }
                        } else if (this.oldHealth > this.health) {
                            this.hitTime = this.tick;
                        }
                    };
                    this.closeSockets = function(websc) {
                        websc.close();
                    };
                    this.whyDieChat = function(websc, whydie) {
                        websc.sendWS("6", "XDDD why die " + whydie);
                    };
                }
            };
            class BotObject {
                constructor(sid) {
                    this.sid = sid;
                    // INIT:
                    this.init = function(x, y, dir, scale, type, data, owner) {
                        data = data || {};
                        this.active = true;
                        this.x = x;
                        this.y = y;
                        this.scale = scale;
                        this.owner = owner;
                        this.id = data.id;
                        this.dmg = data.dmg;
                        this.trap = data.trap;
                        this.teleport = data.teleport;
                        this.isItem = this.id != undefined;
                    };
                }
            };
            class BotObjManager {
                constructor(botObj, fOS) {
                    // DISABLE OBJ:
                    this.disableObj = function(obj) {
                        obj.active = false;
                        if (config.anotherVisual) {
                        } else {
                            obj.alive = false;
                        }
                    };
                    // ADD NEW:
                    let tmpObj;
                    this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                        tmpObj = fOS(sid);
                        if (!tmpObj) {
                            tmpObj = botObj.find((tmp) => !tmp.active);
                            if (!tmpObj) {
                                tmpObj = new BotObject(sid);
                                botObj.push(tmpObj);
                            }
                        }
                        if (setSID) {
                            tmpObj.sid = sid;
                        }
                        tmpObj.init(x, y, dir, s, type, data, owner);
                    };
                    // DISABLE BY SID:
                    this.disableBySid = function(sid) {
                        let find = fOS(sid);
                        if (find) {
                            this.disableObj(find);
                        }
                    };
                    // REMOVE ALL FROM PLAYER:
                    this.removeAllItems = function(sid, server) {
                        botObj.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
                    };
                }
            };
            function botSpawn(id) {
                let bot;
                if (testMode) {
                    return;
                    bot = id && new WebSocket(`wss://elon_musk_hentai.io/websocket`);
                } else {
                    bot = id && new WebSocket(WS.url.split("&")[0] + "&token=" + encodeURIComponent(id));
                }
                let botPlayer = new Map();
                let botSID;
                let botObj = [];
                let nearObj = [];
                let bD = {
                    x: 0,
                    y: 0,
                    inGame: false,
                    closeSocket: false,
                    whyDie: ""
                };
                let oldXY = {
                    x: 0,
                    y: 0,
                };
                let botObjManager = new BotObjManager(botObj, function(sid) { return findSID(botObj, sid); });
                bot.binaryType = "arraybuffer";
                bot.first = true;
                bot.sendWS = function(type) {
                    // EXTRACT DATA ARRAY:
                    let data = Array.prototype.slice.call(arguments, 1);
                    // SEND MESSAGE:
                    let binary = window.msgpack.encode([type, data]);
                    bot.send(binary);
                };
                bot.spawn = function() {
                    bot.sendWS("M", {
                        name: "AAAAAAAAAAAAAAA",
                        moofoll: 1,
                        skin: "__proto__"
                    });
                };
                bot.sendUpgrade = function(index) {
                    bot.sendWS("H", index);
                };
                bot.place = function(id, a) {
                    try {
                        let item = items.list[botPlayer.items[id]];
                        if (botPlayer.itemCounts[item.group.id] == undefined ? true : botPlayer.itemCounts[item.group.id] < (config.isSandbox ? 99 : item.group.limit ? item.group.limit : 99)) {
                            bot.sendWS("G", botPlayer.items[id]);
                            bot.sendWS("d", 1, a);
                            bot.sendWS("G", botPlayer.weaponIndex, true);
                        }
                    } catch (e) {
                    }
                };
                bot.buye = function(id, index) {
                    let nID = 0;
                    if (botPlayer.alive && botPlayer.inGame) {
                        if (index == 0) {
                            if (botPlayer.skins[id]) {
                                if (botPlayer.latestSkin != id) {
                                    bot.sendWS("c", 0, id, 0);
                                }
                            } else {
                                let find = findID(hats, id);
                                if (find) {
                                    if (botPlayer.points >= find.price) {
                                        bot.sendWS("c", 1, id, 0);
                                        bot.sendWS("c", 0, id, 0);
                                    } else {
                                        if (botPlayer.latestSkin != nID) {
                                            bot.sendWS("c", 0, nID, 0);
                                        }
                                    }
                                } else {
                                    if (botPlayer.latestSkin != nID) {
                                        bot.sendWS("c", 0, nID, 0);
                                    }
                                }
                            }
                        } else if (index == 1) {
                            if (botPlayer.tails[id]) {
                                if (botPlayer.latestTail != id) {
                                    bot.sendWS("c", 0, id, 1);
                                }
                            } else {
                                let find = findID(accessories, id);
                                if (find) {
                                    if (botPlayer.points >= find.price) {
                                        bot.sendWS("c", 1, id, 1);
                                        bot.sendWS("c", 0, id, 1);
                                    } else {
                                        if (botPlayer.latestTail != 0) {
                                            bot.sendWS("c", 0, 0, 1);
                                        }
                                    }
                                } else {
                                    if (botPlayer.latestTail != 0) {
                                        bot.sendWS("c", 0, 0, 1);
                                    }
                                }
                            }
                        }
                    }
                };
                bot.fastGear = function() {
                    if (botPlayer.y2 >= config.mapScale / 2 - config.riverWidth / 2 && botPlayer.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                        bot.buye(31, 0);
                    } else {
                        if (botPlayer.moveDir == undefined) {
                            bot.buye(22, 0);
                        } else {
                            if (botPlayer.y2 <= config.snowBiomeTop) {
                                bot.buye(15, 0);
                            } else {
                                bot.buye(12, 0);
                            }
                        }
                    }
                };
                let heal = function() {
                    let healthBased2 = function() {
                        if (botPlayer.health == 100)
                            return 0;
                        if (botPlayer.skinIndex != 45 && botPlayer.skinIndex != 56) {
                            return Math.ceil((100 - botPlayer.health) / items.list[botPlayer.items[0]].healing);
                        }
                        return 0;
                    };
                    for (let i = 0; i < healthBased2(); i++) {
                        bot.place(0, botPlayer.nDir);
                    }
                };
                bot.onmessage = function(message) {
                    let data = new Uint8Array(message.data);
                    let parsed = window.msgpack.decode(data);
                    let type = parsed[0];
                    data = parsed[1];
                    if (type == "1") {
                        bot.spawn();
                    }
                    if (type == "1") {
                        botSID = data[0];
                    }
                    if (type == "D") {
                        if (data[1]) {
                            botPlayer = new Bot(data[0][0], data[0][1], hats, accessories);
                            botPlayer.setData(data[0]);
                            botPlayer.inGame = true;
                            botPlayer.alive = true;
                            botPlayer.x2 = undefined;
                            botPlayer.y2 = undefined;
                            botPlayer.spawn(1);
                            oldXY = {
                                x: data[0][3],
                                y: data[0][4]
                            }
                            bD.inGame = true;
                            bot.sendWS("K", 1);
                            if (bot.first) {
                                bot.first = false;
                                bots.push(bD);
                            }
                        }
                    }
                    if (type == "P") {
                        bot.spawn();
                        botPlayer.inGame = false;
                        bD.inGame = false;
                    }
                    if (type == "a") {
                        let tmpData = data[0];
                        botPlayer.tick++;
                        botPlayer.enemy = [];
                        botPlayer.near = [];
                        nearObj = [];
                        for (let i = 0; i < tmpData.length;) {
                            if (tmpData[i] == botPlayer.sid) {
                                botPlayer.x2 = tmpData[i + 1];
                                botPlayer.y2 = tmpData[i + 2];
                                botPlayer.d2 = tmpData[i + 3];
                                botPlayer.buildIndex = tmpData[i + 4];
                                botPlayer.weaponIndex = tmpData[i + 5];
                                botPlayer.weaponVariant = tmpData[i + 6];
                                botPlayer.team = tmpData[i + 7];
                                botPlayer.isLeader = tmpData[i + 8];
                                botPlayer.skinIndex = tmpData[i + 9];
                                botPlayer.tailIndex = tmpData[i + 10];
                                botPlayer.iconIndex = tmpData[i + 11];
                                botPlayer.zIndex = tmpData[i + 12];
                                botPlayer.visible = true;
                                bD.x2 = botPlayer.x2;
                                bD.y2 = botPlayer.y2;
                            }
                            i += 13;
                        }
                        if (bD.closeSocket) {
                            botPlayer.closeSockets(bot);
                        }
                        if (bD.whyDie != "") {
                            botPlayer.whyDieChat(bot, bD.whyDie);
                            bD.whyDie = "";
                        }
                        if (botPlayer.alive) {
                            if (player.team) {
                                if (botPlayer.team != player.team && (botPlayer.tick % 9 === 0)) {
                                    botPlayer.team && (bot.sendWS("N"));
                                    bot.sendWS("b", player.team);
                                }
                            }
                            if (botPlayer.inGame) {
                                if (botObj.length > 0) {
                                    if (breakObjects.length > 0) {
                                        let gotoDist = UTILS.getDist(breakObjects[0], botPlayer, 0, 2);
                                        let gotoAim = UTILS.getDirect(breakObjects[0], botPlayer, 0, 2);
                                        nearObj = botObj.filter((e) => e.active && (findSID(breakObjects, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale)).sort(function(a, b) {
                                            return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                        })[0];
                                        if (nearObj) {
                                            let isPassed = UTILS.getDist(breakObjects[0], nearObj, 0, 0);
                                            if ((gotoDist - isPassed) > 0) {
                                                if (findSID(breakObjects, nearObj.sid) ? true : (nearObj.dmg || nearObj.trap || nearObj.teleport)) {
                                                    if (botPlayer.moveDir != undefined) {
                                                        botPlayer.moveDir = undefined;
                                                        bot.sendWS("a", botPlayer.moveDir);
                                                    }
                                                } else {
                                                    botPlayer.moveDir = gotoAim;
                                                    bot.sendWS("a", botPlayer.moveDir);
                                                }
                                                if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                                    botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                                    bot.sendWS("D", botPlayer.nDir);
                                                }
                                                bot.buye(40, 0);
                                                bot.buye(11, 1);
                                            } else {
                                                botPlayer.moveDir = gotoAim;
                                                bot.sendWS("a", botPlayer.moveDir);
                                                bot.fastGear();
                                                bot.buye(11, 1);
                                            }
                                        } else {
                                            botPlayer.moveDir = gotoAim;
                                            bot.sendWS("a", botPlayer.moveDir);
                                            bot.fastGear();
                                            bot.buye(11, 1);
                                        }
                                        if (gotoDist > 300) {
                                            if (UTILS.getDist(oldXY, botPlayer, 0, 2) > 90) {
                                                let aim = UTILS.getDirect(oldXY, botPlayer, 0, 2);
                                                bot.place(3, aim + (Math.PI / 2.3));
                                                bot.place(3, aim - (Math.PI / 2.3));
                                                bot.place(3, aim);
                                                oldXY = {
                                                    x: botPlayer.x2,
                                                    y: botPlayer.y2
                                                };
                                            }
                                        }
                                    } else {
                                        if (botPlayer.moveDir != undefined) {
                                            botPlayer.moveDir = undefined;
                                            bot.sendWS("a", botPlayer.moveDir);
                                        }
                                        nearObj = botObj.filter((e) => e.active && (findSID(breakObjects, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale)).sort(function(a, b) {
                                            return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                        })[0];
                                        if (nearObj) {
                                            if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                                botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                                bot.sendWS("D", botPlayer.nDir);
                                            }
                                            bot.buye(40, 0);
                                            bot.buye(11, 1);
                                        } else {
                                            bot.fastGear();
                                            bot.buye(11, 1);
                                        }
                                    }
                                } else {
                                    if (botPlayer.moveDir != undefined) {
                                        botPlayer.moveDir = undefined;
                                        bot.sendWS("a", botPlayer.moveDir);
                                    }
                                }
                            }
                        }
                    }
                    if (type == "H") {
                        let tmpData = data[0];
                        for (let i = 0; i < tmpData.length;) {
                            botObjManager.add(tmpData[i], tmpData[i + 1], tmpData[i + 2], tmpData[i + 3], tmpData[i + 4],
                                              tmpData[i + 5], items.list[tmpData[i + 6]], true, (tmpData[i + 7] >= 0 ? {
                                sid: tmpData[i + 7]
                            } : null));
                            i += 8;
                        }
                    }
                    if (type == "N") {
                        let index = data[0];
                        let value = data[1];
                        if (botPlayer) {
                            botPlayer[index] = value;
                        }
                    }
                    if (type == "O") {
                        if (data[0] == botSID) {
                            botPlayer.oldHealth = botPlayer.health;
                            botPlayer.health = data[1];
                            botPlayer.judgeShame();
                            if (botPlayer.oldHealth > botPlayer.health) {
                                if (botPlayer.shameCount < 5) {
                                    heal();
                                } else {
                                    setTimeout(() => {
                                        heal();
                                    }, 70);
                                }
                            }
                        }
                    }
                    if (type == "Q") {
                        let sid = data[0];
                        botObjManager.disableBySid(sid);
                    }
                    if (type == "13") {
                        let sid = data[0];
                        if (botPlayer.alive) botObjManager.removeAllItems(sid);
                    }
                    if (type == "14") {
                        let index = data[0];
                        let value = data[1];
                        if (botPlayer) {
                            botPlayer.itemCounts[index] = value;
                        }
                    }
                    if (type == "16") {
                        if (data[0] > 0) {
                            if (botPlayer.upgraded == 0) {
                                bot.sendUpgrade(3);
                            } else if (botPlayer.upgraded == 1) {
                                bot.sendUpgrade(17);
                            } else if (botPlayer.upgraded == 2) {
                                bot.sendUpgrade(31);
                            } else if (botPlayer.upgraded == 3) {
                                bot.sendUpgrade(27);
                            } else if (botPlayer.upgraded == 4) {
                                bot.sendUpgrade(9);
                            } else if (botPlayer.upgraded == 5) {
                                bot.sendUpgrade(38);
                            } else if (botPlayer.upgraded == 6) {
                                bot.sendUpgrade(4);
                            } else if (botPlayer.upgraded == 7) {
                                bot.sendUpgrade(25);
                            }
                            botPlayer.upgraded++;
                        }
                    }
                    if (type == "17") {
                        let tmpData = data[0];
                        let wpn = data[1];
                        if (tmpData) {
                            if (wpn) botPlayer.weapons = tmpData;
                            else botPlayer.items = tmpData;
                        }
                        bot.sendWS("G", botPlayer.weapons[0], true);
                    }
                    if (type == "us") {
                        let type = data[0];
                        let id = data[1];
                        let index = data[2];
                        if (index) {
                            if (!type)
                                botPlayer.tails[id] = 1;
                            else
                                botPlayer.latestTail = id;
                        } else {
                            if (!type)
                                botPlayer.skins[id] = 1;
                            else
                                botPlayer.latestSkin = id;
                        }
                    }
                };
                bot.onclose = function() {
                    botPlayer.inGame = false;
                    bD.inGame = false;
                };
            }
            // RENDER LEAF:
            function renderLeaf(x, y, l, r, ctxt) {
                let endX = x + (l * Math.cos(r));
                let endY = y + (l * Math.sin(r));
                let width = l * 0.4;
                ctxt.moveTo(x, y);
                ctxt.beginPath();
                ctxt.quadraticCurveTo(((x + endX) / 2) + (width * Math.cos(r + Math.PI / 2)),
                                      ((y + endY) / 2) + (width * Math.sin(r + Math.PI / 2)), endX, endY);
                ctxt.quadraticCurveTo(((x + endX) / 2) - (width * Math.cos(r + Math.PI / 2)),
                                      ((y + endY) / 2) - (width * Math.sin(r + Math.PI / 2)), x, y);
                ctxt.closePath();
                ctxt.fill();
                ctxt.stroke();
            }
            // RENDER CIRCLE:
            function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || mainContext;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }
            function renderHealthCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || mainContext;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }
            // RENDER STAR SHAPE:
            function renderStar(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                ctxt.beginPath();
                ctxt.moveTo(0, -outer);
                for (let i = 0; i < spikes; i++) {
                    x = Math.cos(rot) * outer;
                    y = Math.sin(rot) * outer;
                    ctxt.lineTo(x, y);
                    rot += step;
                    x = Math.cos(rot) * inner;
                    y = Math.sin(rot) * inner;
                    ctxt.lineTo(x, y);
                    rot += step;
                }
                ctxt.lineTo(0, -outer);
                ctxt.closePath();
            }
            function renderHealthStar(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                ctxt.beginPath();
                ctxt.moveTo(0, -outer);
                for (let i = 0; i < spikes; i++) {
                    x = Math.cos(rot) * outer;
                    y = Math.sin(rot) * outer;
                    ctxt.lineTo(x, y);
                    rot += step;
                    x = Math.cos(rot) * inner;
                    y = Math.sin(rot) * inner;
                    ctxt.lineTo(x, y);
                    rot += step;
                }
                ctxt.lineTo(0, -outer);
                ctxt.closePath();
            }
            // RENDER RECTANGLE:
            function renderRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }
            function renderHealthRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }
            // RENDER RECTCIRCLE:
            function renderRectCircle(x, y, s, sw, seg, ctxt, dontStroke, dontFill) {
                ctxt.save();
                ctxt.translate(x, y);
                seg = Math.ceil(seg / 2);
                for (let i = 0; i < seg; i++) {
                    renderRect(0, 0, s * 2, sw, ctxt, dontStroke, dontFill);
                    ctxt.rotate(Math.PI / seg);
                }
                ctxt.restore();
            }
            // RENDER BLOB:
            function renderBlob(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                let tmpOuter;
                ctxt.beginPath();
                ctxt.moveTo(0, -inner);
                for (let i = 0; i < spikes; i++) {
                    tmpOuter = UTILS.randInt(outer + 0.9, outer * 1.2);
                    ctxt.quadraticCurveTo(Math.cos(rot + step) * tmpOuter, Math.sin(rot + step) * tmpOuter,
                                          Math.cos(rot + (step * 2)) * inner, Math.sin(rot + (step * 2)) * inner);
                    rot += step * 2;
                }
                ctxt.lineTo(0, -inner);
                ctxt.closePath();
            }
            // RENDER TRIANGLE:
            function renderTriangle(s, ctx) {
                ctx = ctx || mainContext;
                let h = s * (Math.sqrt(3) / 2);
                ctx.beginPath();
                ctx.moveTo(0, -h / 2);
                ctx.lineTo(-s / 2, h / 2);
                ctx.lineTo(s / 2, h / 2);
                ctx.lineTo(0, -h / 2);
                ctx.fill();
                ctx.closePath();
            }
            // PREPARE MENU BACKGROUND:
            function prepareMenuBackground() {
                var tmpMid = config.mapScale / 2;
                objectManager.add(0, tmpMid, tmpMid + 200, 0, config.treeScales[3], 0);
                objectManager.add(1, tmpMid, tmpMid - 480, 0, config.treeScales[3], 0);
                objectManager.add(2, tmpMid + 300, tmpMid + 450, 0, config.treeScales[3], 0);
                objectManager.add(3, tmpMid - 950, tmpMid - 130, 0, config.treeScales[2], 0);
                objectManager.add(4, tmpMid - 750, tmpMid - 400, 0, config.treeScales[3], 0);
                objectManager.add(5, tmpMid - 700, tmpMid + 400, 0, config.treeScales[2], 0);
                objectManager.add(6, tmpMid + 800, tmpMid - 200, 0, config.treeScales[3], 0);
                objectManager.add(7, tmpMid - 260, tmpMid + 340, 0, config.bushScales[3], 1);
                objectManager.add(8, tmpMid + 760, tmpMid + 310, 0, config.bushScales[3], 1);
                objectManager.add(9, tmpMid - 800, tmpMid + 100, 0, config.bushScales[3], 1);
                objectManager.add(12, tmpMid - 400, tmpMid - 450, 0, config.rockScales[2], 2);
            }
            const speed = 35;
            // RENDER PLAYERS:
            function renderDeadPlayers(xOffset, yOffset) {
                mainContext.fillStyle = "#91b2db";
                deadPlayers.filter(dead => dead.active).forEach((dead) => {
                    dead.animate(delta);

                    mainContext.globalAlpha = dead.alpha;
                    mainContext.strokeStyle = outlineColor;

                    mainContext.save();
                    mainContext.translate(dead.x - xOffset, dead.y - yOffset);
                    // tphere
                    dead.dir += toRadian(1);
                    if (dead.dir >= 2 * Math.PI) {
                        dead.dir -= 2 * Math.PI;
                    }
                    // RENDER PLAYER:
                    mainContext.rotate(dead.dir);
                    renderDeadPlayer(dead, mainContext);
                    mainContext.restore();

                    // same color in bundle
                    mainContext.fillStyle = "#91b2db";

                });
            }
            // RENDER PLAYERS:
            function renderPlayers(xOffset, yOffset, zIndex) {
                mainContext.globalAlpha = 1;
                mainContext.fillStyle = "#91b2db";
                for (var i = 0; i < players.length; ++i) {
                    tmpObj = players[i];
                    if (tmpObj.zIndex == zIndex) {
                        tmpObj.animate(delta);
                        if (tmpObj.visible) {
                            tmpObj.skinRot += (0.002 * delta);
                            tmpDir = (!configs.showDir && !useWasd && tmpObj == player) ? configs.attackDir ? getVisualDir() : getSafeDir() : (tmpObj.dir || 0);
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            // RENDER PLAYER:
                            mainContext.rotate(tmpDir + tmpObj.dirPlus);
                            renderPlayer(tmpObj, mainContext);
                            mainContext.restore();
                        }
                    }
                }
            }
            function renderDeadPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
                let oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
                let oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;

                obj.skinIndex = 48;
                obj.tailIndex = 13;
                renderTail(13, ctxt, obj);
                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[10], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // HANDS:
                ctxt.fillStyle = "#ececec";
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[10], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                }

                // BUILD ITEM:
                if (obj.buildIndex >= 0) {
                    renderTool(items.weapons[10], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                }

                renderCircle(0, 0, obj.scale, ctxt);
                // SKIN
                renderSkin(48, ctxt, null, obj)

            }
            // RENDER PLAYER:
            function renderPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
                let oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
                let oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;

                let katanaMusket = (obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15);

                // TAIL/CAPE:
                if (obj.tailIndex > 0) {
                    renderTail(obj.tailIndex, ctxt, obj);
                }

                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // HANDS:
                ctxt.fillStyle = config.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // BUILD ITEM:
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }

                // BODY:
                renderCircle(0, 0, obj.scale, ctxt);

                // SKIN:
                if (obj.skinIndex > 0) {
                    ctxt.rotate(Math.PI/2);
                    renderSkin(obj.skinIndex, ctxt, null, obj);
                }

            }

            // RENDER SKINS:
            let skinSprites = {};
            let skinPointers = {};
            let tmpSkin;
            function renderSkin(index, ctxt, parentSkin, owner) {
                tmpSkin = skinSprites[index];
                if (!tmpSkin) {
                    let tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
                    skinSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                let tmpObj = parentSkin||skinPointers[index];
                if (!tmpObj) {
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].id == index) {
                            tmpObj = hats[i];
                            break;
                        }
                    }
                    skinPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded)
                    ctxt.drawImage(tmpSkin, -tmpObj.scale/2, -tmpObj.scale/2, tmpObj.scale, tmpObj.scale);
                if (!parentSkin && tmpObj.topSprite) {
                    ctxt.save();
                    ctxt.rotate(owner.skinRot);
                    renderSkin(index + "_top", ctxt, tmpObj, owner);
                    ctxt.restore();
                }
            }
            // RENDER TAIL:
            let accessSprites = {};
            let accessPointers = {};
            function renderTail(index, ctxt, owner) {
                tmpSkin = accessSprites[index];
                if (!tmpSkin) {
                    let tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = "https://moomoo.io/img/accessories/access_" + index + ".png";
                    accessSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                let tmpObj = accessPointers[index];
                if (!tmpObj) {
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].id == index) {
                            tmpObj = accessories[i];
                            break;
                        }
                    }
                    accessPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded) {
                    ctxt.save();
                    ctxt.translate(-20 - (tmpObj.xOff || 0), 0);
                    if (tmpObj.spin)
                        ctxt.rotate(owner.skinRot);
                    ctxt.drawImage(tmpSkin, -(tmpObj.scale / 2), -(tmpObj.scale / 2), tmpObj.scale, tmpObj.scale);
                    ctxt.restore();
                }
            }
            // RENDER NORMAL TAIL
            var accessSprites2 = {};
            var accessPointers2 = {};
            function renderTail2(index, ctxt, owner) {
                tmpSkin = accessSprites2[index];
                if (!tmpSkin) {
                    var tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = "https://moomoo.io/img/accessories/access_" + index + ".png";
                    accessSprites2[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                var tmpObj = accessPointers2[index];
                if (!tmpObj) {
                    for (var i = 0; i < accessories.length; ++i) {
                        if (accessories[i].id == index) {
                            tmpObj = accessories[i];
                            break;
                        }
                    }
                    accessPointers2[index] = tmpObj;
                }
                if (tmpSkin.isLoaded) {
                    ctxt.save();
                    ctxt.translate(-20 - (tmpObj.xOff||0), 0);
                    if (tmpObj.spin)
                        ctxt.rotate(owner.skinRot);
                    ctxt.drawImage(tmpSkin, -(tmpObj.scale/2), -(tmpObj.scale/2), tmpObj.scale, tmpObj.scale);
                    ctxt.restore();
                }
            }
            // RENDER TOOL:
            let toolSprites = {};
            // RENDER PROJECTILES:
            function renderProjectiles(layer, xOffset, yOffset) {
                for (let i = 0; i < projectiles.length; i++) {
                    tmpObj = projectiles[i];
                    if (tmpObj.active && tmpObj.layer == layer && tmpObj.inWindow) {
                        tmpObj.update(delta);
                        if (tmpObj.active && isOnScreen(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.scale)) {
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir);
                            renderProjectile(0, 0, tmpObj, mainContext, 1);
                            mainContext.restore();
                        }
                    }
                };
            }
            // RENDER PROJECTILE:
            let projectileSprites = {};
            function renderProjectile(x, y, obj, ctxt, debug) {
                if (obj.src) {
                    let tmpSrc = items.projectiles[obj.indx].src;
                    let tmpSprite = projectileSprites[tmpSrc];
                    if (!tmpSprite) {
                        tmpSprite = new Image();
                        tmpSprite.onload = function() {
                            this.isLoaded = true;
                        }
                        tmpSprite.src = "https://moomoo.io/img/weapons/" + tmpSrc + ".png";
                        projectileSprites[tmpSrc] = tmpSprite;
                    }
                    if (tmpSprite.isLoaded)
                        ctxt.drawImage(tmpSprite, x - (obj.scale / 2), y - (obj.scale / 2), obj.scale, obj.scale);
                } else if (obj.indx == 1) {
                    ctxt.fillStyle = "#939393";
                    renderCircle(x, y, obj.scale, ctxt);
                }
            }
            // RENDER AI:
            let aiSprites = {};
            function renderAI(obj, ctxt) {
                let tmpIndx = obj.index;
                let tmpSprite = aiSprites[tmpIndx];
                if (!tmpSprite) {
                    let tmpImg = new Image();
                    tmpImg.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImg.src = "https://moomoo.io/img/animals/" + obj.src + ".png";
                    tmpSprite = tmpImg;
                    aiSprites[tmpIndx] = tmpSprite;
                }
                if (tmpSprite.isLoaded) {
                    let tmpScale = obj.scale * 1.2 * (obj.spriteMlt || 1);
                    ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
                }
            }
            // RENDER WATER BODIES:
            function renderWaterBodies(xOffset, yOffset, ctxt, padding) {
                // MIDDLE RIVER:
                let tmpW = config.riverWidth + padding;
                let tmpY = (config.mapScale / 2) - yOffset - (tmpW / 2);
                if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
                    ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
                }
            }

            function renderTool(obj, variant, x, y, ctxt) {
                var tmpSrc = obj.src + (variant || "");
                var tmpSprite = toolSprites[tmpSrc];
                if (!tmpSprite) {
                    tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    }
                    ;
                    tmpSprite.src = ".././img/weapons/" + tmpSrc + ".png";
                    toolSprites[tmpSrc] = tmpSprite;
                }
                if (tmpSprite.isLoaded)
                    ctxt.drawImage(tmpSprite, x + obj.xOff - obj.length / 2, y + obj.yOff - obj.width / 2, obj.length, obj.width);
            }

            var toolFucks = {};



            // RENDER GAME OBJECTS:
            let gameObjectSprites = {};
            function getResSprite(obj) {
                let biomeID = (obj.y >= config.mapScale - config.snowBiomeTop) ? 2 : ((obj.y <= config.snowBiomeTop) ? 1 : 0);
                let tmpIndex = (obj.type + "_" + obj.scale + "_" + biomeID);
                let tmpSprite = gameObjectSprites[tmpIndex];
                if (!tmpSprite) {
                    let blurScale = 15;
                    let tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.1) + outlineWidth;
                    let tmpContext = tmpCanvas.getContext('2d');
                    tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                    tmpContext.rotate(UTILS.randFloat(0, Math.PI));
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    if (isNight) {
                        tmpContext.shadowBlur = blurScale;
                        tmpContext.shadowColor = `rgba(0, 0, 0, ${obj.alpha})`;
                    }
                    if (obj.type == 0) {
                        let tmpScale;
                        let tmpCount = UTILS.randInt(5, 7);
                        tmpContext.globalAlpha = 0.5;
                        for (let i = 0; i < 2; ++i) {
                            tmpScale = tmpObj.scale * (!i ? 1 : 0.5);
                            renderStar(tmpContext, tmpCount, tmpScale, tmpScale * 0.7);
                            tmpContext.fillStyle = !biomeID ? (!i ? "#9ebf57" : "#b4db62") : (!i ? "#e3f1f4" : "#fff");
                            tmpContext.fill();
                            if (!i) {
                                tmpContext.stroke();
                                tmpContext.shadowBlur = null;
                                tmpContext.shadowColor = null;
                                tmpContext.globalAlpha = 1;
                            }
                        }
                    } else if (obj.type == 1) {
                        if (biomeID == 2) {
                            tmpContext.fillStyle = "#606060";
                            renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
                            tmpContext.fill();
                            tmpContext.stroke();
                            //tmpContext.shadowBlur = null;
                            //tmpContext.shadowColor = null;
                            tmpContext.fillStyle = "#89a54c";
                            renderCircle(0, 0, obj.scale * 0.55, tmpContext);
                            tmpContext.fillStyle = "#a5c65b";
                            renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
                        } else {
                            renderBlob(tmpContext, 6, tmpObj.scale, tmpObj.scale * 0.7);
                            tmpContext.fillStyle = biomeID ? "#e3f1f4" : "#89a54c";
                            tmpContext.fill();
                            tmpContext.stroke();
                            //tmpContext.shadowBlur = null;
                            //tmpContext.shadowColor = null;
                            tmpContext.fillStyle = biomeID ? "#6a64af" : "#FFA500";
                            let tmpRange;
                            let berries = 4;
                            let rotVal = (Math.PI * 2) / berries;
                            for (let i = 0; i < berries; ++i) {
                                tmpRange = UTILS.randInt(tmpObj.scale / 3.5, tmpObj.scale / 2.3);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                             UTILS.randInt(10, 12), tmpContext);
                            }
                        }
                    } else if (obj.type == 2 || obj.type == 3) {
                        tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#938d77" : "#939393") : "#e0c655";
                        renderStar(tmpContext, 3, obj.scale, obj.scale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.shadowBlur = null;
                        tmpContext.shadowColor = null;
                        tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#b2ab90" : "#bcbcbc") : "#ebdca3";
                        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                        tmpContext.fill();
                    }
                    tmpSprite = tmpCanvas;
                    gameObjectSprites[tmpIndex] = tmpSprite;
                }
                return tmpSprite;
            }
            // GET ITEM SPRITE:
            let itemSprites = [];
            function getItemSprite(obj, asIcon) {
                let tmpSprite = itemSprites[obj.id];
                if (!tmpSprite || asIcon) {
                    let blurScale = 0;
                    let tmpCanvas = document.createElement("canvas");
                    // let reScale = ((!asIcon && obj.name == "windmill") ? items.list[4].scale : obj.scale);
                    tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.5) + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
                    if (config.useWebGl) {
                        let gl = tmpCanvas.getContext("webgl");
                        gl.clearColor(0, 0, 0, 0);
                        gl.clear(gl.COLOR_BUFFER_BIT);
                        let buffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                        function render(vs, fs, vertice, type) {
                            let vShader = gl.createShader(gl.VERTEX_SHADER);
                            gl.shaderSource(vShader, vs);
                            gl.compileShader(vShader);
                            gl.getShaderParameter(vShader, gl.COMPILE_STATUS);
                            let fShader = gl.createShader(gl.FRAGMENT_SHADER);
                            gl.shaderSource(fShader, fs);
                            gl.compileShader(fShader);
                            gl.getShaderParameter(fShader, gl.COMPILE_STATUS);
                            let program = gl.createProgram();
                            gl.attachShader(program, vShader);
                            gl.attachShader(program, fShader);
                            gl.linkProgram(program);
                            gl.getProgramParameter(program, gl.LINK_STATUS);
                            gl.useProgram(program);
                            let vertex = gl.getAttribLocation(program, "vertex");
                            gl.enableVertexAttribArray(vertex);
                            gl.vertexAttribPointer(vertex, 2, gl.FLOAT, false, 0, 0);
                            let vertices = vertice.length / 2;
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertice), gl.DYNAMIC_DRAW);
                            gl.drawArrays(type, 0, vertices);
                        }
                        function hexToRgb(hex) {
                            return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
                        }
                        function getRgb(r, g, b) {
                            return [r / 255, g / 255, b / 255].join(", ");
                        }
                        let max = 100;
                        for (let i = 0; i < max; i++) {
                            let radian = (Math.PI * (i / (max / 2)));
                            render(`
                            precision mediump float;
                            attribute vec2 vertex;
                            void main(void) {
                                gl_Position = vec4(vertex, 0, 1);
                            }
                            `, `
                            precision mediump float;
                            void main(void) {
                                gl_FragColor = vec4(${getRgb(...hexToRgb("#fff"))}, 1);
                            }
                            `, [
                                0 + (Math.cos(radian) * 0.5), 0 + (Math.sin(radian) * 0.5),
                                0, 0,
                            ], gl.LINE_LOOP);
                        }
                    } else {
                        let tmpContext = tmpCanvas.getContext("2d");
                        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                        tmpContext.rotate(asIcon ? 0 : (Math.PI / 2));
                        tmpContext.strokeStyle = outlineColor;
                        tmpContext.lineWidth = outlineWidth * (asIcon ? (tmpCanvas.width / 81) : 1);
                        if (obj.name == "apple") {
                            tmpContext.fillStyle = "#c15555";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fillStyle = "#89a54c";
                            let leafDir = -(Math.PI / 2);
                            renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                                       25, leafDir + Math.PI / 2, tmpContext);
                        } else if (obj.name == "cookie") {
                            tmpContext.fillStyle = "#cca861";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fillStyle = "#937c4b";
                            let chips = 4;
                            let rotVal = (Math.PI * 2) / chips;
                            let tmpRange;
                            for (let i = 0; i < chips; ++i) {
                                tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                             UTILS.randInt(4, 5), tmpContext, true);
                            }
                        } else if (obj.name == "cheese") {
                            tmpContext.fillStyle = "#f4f3ac";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fillStyle = "#c3c28b";
                            let chips = 4;
                            let rotVal = (Math.PI * 2) / chips;
                            let tmpRange;
                            for (let i = 0; i < chips; ++i) {
                                tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                             UTILS.randInt(4, 5), tmpContext, true);
                            }
                        } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                            tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
                                "#a5974c" : "#939393";
                            let sides = (obj.name == "castle wall") ? 4 : 3;
                            renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
                                "#c9b758" : "#bcbcbc";
                            renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                            tmpContext.fill();
                        } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
                                   obj.name == "spinning spikes") {
                            tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
                            let tmpScale = (obj.scale * 0.6);
                            renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#a5974c";
                            renderCircle(0, 0, tmpScale, tmpContext);
                            tmpContext.fillStyle = "#c9b758";
                            renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                        } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                            tmpContext.fillStyle = "#a5974c",
                                renderCircle(0, 0, obj.scale, tmpContext),
                                tmpContext.fillStyle = "#c9b758",
                                renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext),
                                tmpContext.fillStyle = "#a5974c",
                                renderCircle(0, 0, obj.scale * .5, tmpContext);
                        } else if (obj.name == "mine") {
                            tmpContext.fillStyle = "#939393";
                            renderStar(tmpContext, 3, obj.scale, obj.scale);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#bcbcbc";
                            renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                            tmpContext.fill();
                        } else if (obj.name == "sapling") {
                            for (let i = 0; i < 2; ++i) {
                                let tmpScale = obj.scale * (!i ? 1 : 0.5);
                                renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                                tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
                                tmpContext.fill();
                                if (!i) tmpContext.stroke();
                            }
                        } else if (obj.name == "pit trap") {
                            tmpContext.fillStyle = "#a5974c";
                            renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = outlineColor;
                            renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                            tmpContext.fill();
                        } else if (obj.name == "boost pad") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#dbd97d";
                            renderTriangle(obj.scale * 1, tmpContext);
                        } else if (obj.name == "turret") {
                            tmpContext.fillStyle = "#a5974c";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#939393";
                            let tmpLen = 50;
                            renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                            renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                        } else if (obj.name == "platform") {
                            tmpContext.fillStyle = "#cebd5f";
                            let tmpCount = 4;
                            let tmpS = obj.scale * 2;
                            let tmpW = tmpS / tmpCount;
                            let tmpX = -(obj.scale / 2);
                            for (let i = 0; i < tmpCount; ++i) {
                                renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
                                tmpContext.fill();
                                tmpContext.stroke();
                                tmpX += tmpS / tmpCount;
                            }
                        } else if (obj.name == "healing pad") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#db6e6e";
                            renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                        } else if (obj.name == "spawn pad") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#71aad6";
                            renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                        } else if (obj.name == "blocker") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.rotate(Math.PI / 4);
                            tmpContext.fillStyle = "#db6e6e";
                            renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                        } else if (obj.name == "teleporter") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.rotate(Math.PI / 4);
                            tmpContext.fillStyle = "#d76edb";
                            renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                        }
                    }
                    tmpSprite = tmpCanvas;
                    if (!asIcon)
                        itemSprites[obj.id] = tmpSprite;
                }
                return tmpSprite;
            }
            function getItemSprite2(obj, tmpX, tmpY) {
                let tmpContext = mainContext;
                let reScale = (obj.name == "windmill" ? items.list[4].scale : obj.scale);
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir);
                tmpContext.strokeStyle = outlineColor;
                tmpContext.lineWidth = outlineWidth;
                if (obj.name == "apple") {
                    tmpContext.fillStyle = "#c15555";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#89a54c";
                    let leafDir = -(Math.PI / 2);
                    renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                               25, leafDir + Math.PI / 2, tmpContext);
                } else if (obj.name == "cookie") {
                    tmpContext.fillStyle = "#cca861";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#937c4b";
                    let chips = 4;
                    let rotVal = (Math.PI * 2) / chips;
                    let tmpRange;
                    for (let i = 0; i < chips; ++i) {
                        tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                     UTILS.randInt(4, 5), tmpContext, true);
                    }
                } else if (obj.name == "cheese") {
                    tmpContext.fillStyle = "#f4f3ac";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#c3c28b";
                    let chips = 4;
                    let rotVal = (Math.PI * 2) / chips;
                    let tmpRange;
                    for (let i = 0; i < chips; ++i) {
                        tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                     UTILS.randInt(4, 5), tmpContext, true);
                    }
                } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                    tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
                        "#a5974c" : "#939393";
                    let sides = (obj.name == "castle wall") ? 4 : 3;
                    renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
                        "#c9b758" : "#bcbcbc";
                    renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
                           obj.name == "spinning spikes") {
                    tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
                    let tmpScale = (obj.scale * 0.6);
                    renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, tmpScale, tmpContext);
                    tmpContext.fillStyle = "#c9b758";
                    renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, reScale, tmpContext);
                    tmpContext.fillStyle = "#c9b758";
                    renderRectCircle(0, 0, reScale * 1.5, 29, 4, tmpContext);
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, reScale * 0.5, tmpContext);
                } else if (obj.name == "mine") {
                    tmpContext.fillStyle = "#939393";
                    renderStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#bcbcbc";
                    renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "sapling") {
                    for (let i = 0; i < 2; ++i) {
                        let tmpScale = obj.scale * (!i ? 1 : 0.5);
                        renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                        tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
                        tmpContext.fill();
                        if (!i) tmpContext.stroke();
                    }
                } else if (obj.name == "pit trap") {
                    tmpContext.fillStyle = "#a5974c";
                    renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = outlineColor;
                    renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "boost pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#dbd97d";
                    renderTriangle(obj.scale * 1, tmpContext);
                } else if (obj.name == "turret") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#939393";
                    let tmpLen = 50;
                    renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                } else if (obj.name == "platform") {
                    tmpContext.fillStyle = "#cebd5f";
                    let tmpCount = 4;
                    let tmpS = obj.scale * 2;
                    let tmpW = tmpS / tmpCount;
                    let tmpX = -(obj.scale / 2);
                    for (let i = 0; i < tmpCount; ++i) {
                        renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpX += tmpS / tmpCount;
                    }
                } else if (obj.name == "healing pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                } else if (obj.name == "spawn pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#71aad6";
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                } else if (obj.name == "blocker") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                } else if (obj.name == "teleporter") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#d76edb";
                    renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                }
                tmpContext.restore();
            }
            let objSprites = [];
            function getObjSprite(obj) {
                let tmpSprite = objSprites[obj.id];
                if (!tmpSprite) {
                    let blurScale = 0;
                    let tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
                    let tmpContext = tmpCanvas.getContext("2d");
                    tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
                    tmpContext.rotate(Math.PI / 2);
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                        tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
                        let tmpScale = obj.scale * 0.6;
                        renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, tmpScale, tmpContext);
                        tmpContext.fillStyle = "#cc5151";
                        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                    } else if (obj.name == "pit trap") {
                        tmpContext.fillStyle = "#a5974c";
                        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#cc5151";
                        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                        tmpContext.fill();
                    }
                    tmpSprite = tmpCanvas;
                    objSprites[obj.id] = tmpSprite;
                }
                return tmpSprite;
            }
            // GET MARK SPRITE:
            function getMarkSprite(obj, tmpContext, tmpX, tmpY) {
               /* tmpContext.lineWidth = outlineWidth;
                tmpContext.globalAlpha = 0.8;
                tmpContext.strokeStyle = 'gray';
                tmpContext.fillStyle = 'gray';
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir);
                if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                    let sides = obj.name == "castle wall" ? 4 : 3;
                    renderHealthStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                    let tmpScale = obj.scale * 0.6;
                    renderHealthStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "mine") {
                    renderHealthStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.stroke();
                } else if (obj.name == "sapling") {
                    let tmpScale = obj.scale * 0.7;
                    renderHealthStar(tmpContext, 7, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "pit trap") {
                    renderHealthStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "boost pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "turret") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "platform") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "healing pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "spawn pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "blocker") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "teleporter") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                }
                tmpContext.fillStyle = "rgba(0, 0, 0, 0.5)";
                tmpContext.fill();
                tmpContext.restore();
            }*/
                tmpContext.lineWidth = outlineWidth;
                mainContext.globalAlpha = 1;
                tmpContext.strokeStyle = outlineColor;
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir || getAttackDir());

                     if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                    let sides = obj.name == "castle wall" ? 4 : 3;
                    renderHealthStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                    let tmpScale = obj.scale * 0.6;
                    renderHealthStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "mine") {
                    renderHealthStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.stroke();
                } else if (obj.name == "sapling") {
                    let tmpScale = obj.scale * 0.7;
                    renderHealthStar(tmpContext, 7, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "pit trap") {
                    renderHealthStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "boost pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "turret") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "platform") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "healing pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "spawn pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "blocker") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "teleporter") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                }
                tmpContext.restore();

                    }

            //renderCircle(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.getScale(0.6, true), mainContext, false, true);
            // OBJECT ON SCREEN:
            function isOnScreen(x, y, s) {
                return (x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && (y,
                                                                                s,
                                                                                maxScreenHeight));
            }
            /*         function markObject(tmpObj, tmpX, tmpY) {
          getMarkSprite(tmpObj, mainContext, tmpX, tmpY);
      }*/
            let treeAlphaState = [];
            function renderResTest(obj, n, r, offsets) {
                let s = getResSprite(obj);
                let easeScale = 0.06, lowestAlpha = 0.0;
                if (player && obj.type == 0 && configs.tree) {
                    if (!treeAlphaState[obj.sid]) treeAlphaState[obj.sid] = 0.1;
                    if (Math.hypot(obj.y - player.y2, obj.x - player.x2) <= obj.scale + player.scale) {
                        treeAlphaState[obj.sid] = Math.max(lowestAlpha, (treeAlphaState[obj.sid] - easeScale));
                        mainContext.globalAlpha = treeAlphaState[obj.sid];
                    } else {
                        treeAlphaState[obj.sid] = Math.min(1, (treeAlphaState[obj.sid] + easeScale));
                        mainContext.globalAlpha = treeAlphaState[obj.sid];
                    };
                }
                mainContext.drawImage(s, n - s.width / 2, r - s.height / 2);
            }

            function markObject(tmpObj, tmpX, tmpY) {
                const select = getEl("predic");
                const selectedOption = select.value;

                if (selectedOption === "zod") {
                    yen(mainContext, tmpX, tmpY);
                } else if (selectedOption === "kite") {
                    getMarkSprite(tmpObj, mainContext, tmpX, tmpY);
                }
            }
            function yen(context, x, y) {
                context.fillStyle = "rgba(0, 255, 255, 0)";
                context.beginPath();
                context.arc(x, y, 55, 0, Math.PI * 2); // Adjust the circle size
                context.fill();
                context.closePath();
                context.globalAlpha = 1;
            }

            // RENDER MINIMAP:
            class MapPing {
                constructor(color, scale) {
                    this.init = function(x, y) {
                        this.scale = 0;
                        this.x = x;
                        this.y = y;
                        this.active = true;
                    };
                    this.update = function(ctxt, delta) {
                        if (this.active) {
                            this.scale += 0.05 * delta;
                            if (this.scale >= scale) {
                                this.active = false;
                            } else {
                                ctxt.globalAlpha = (1 - Math.max(0, this.scale / scale));
                                ctxt.beginPath();
                                ctxt.arc((this.x / config.mapScale) * mapDisplay.width, (this.y / config.mapScale)
                                         * mapDisplay.width, this.scale, 0, 2 * Math.PI);
                                ctxt.stroke();
                            }
                        }
                    };
                    this.color = color;
                }
            }
            function pingMap(x, y) {
                tmpPing = mapPings.find(pings => !pings.active);
                if (!tmpPing) {
                    tmpPing = new MapPing("#fff", config.mapPingScale);
                    mapPings.push(tmpPing);
                }
                tmpPing.init(x, y);
            }
            function updateMapMarker() {
                mapMarker.x = player.x;
                mapMarker.y = player.y;
            }
            function renderMinimap(delta) {
                if (player && player.alive) {
                    mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);
                    // RENDER PINGS:
                    mapContext.lineWidth = 4;
                    for (let i = 0; i < mapPings.length; ++i) {
                        tmpPing = mapPings[i];
                        mapContext.strokeStyle = tmpPing.color;
                        tmpPing.update(mapContext, delta);
                    }
                    // RENDER BREAK TRACKS:
                    mapContext.globalAlpha = 1;
                    mapContext.fillStyle = "#ff0000";
                    if (breakTrackers.length) {
                        mapContext.fillStyle = "#abcdef";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        for (let i = 0; i < breakTrackers.length;) {
                            mapContext.fillText("!", (breakTrackers[i].x / config.mapScale) * mapDisplay.width,
                                                (breakTrackers[i].y / config.mapScale) * mapDisplay.height);
                            i += 2;
                        }
                    }
                    // RENDER PLAYERS:
                    mapContext.globalAlpha = 1;
                    mapContext.fillStyle = "#fff";
                    renderCircle((player.x / config.mapScale) * mapDisplay.width,
                                 (player.y / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                    mapContext.fillStyle = "rgba(255,255,255,0.35)";
                    if (player.team && minimapData) {
                        for (let i = 0; i < minimapData.length;) {
                            renderCircle((minimapData[i] / config.mapScale) * mapDisplay.width,
                                         (minimapData[i + 1] / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                            i += 2;
                        }
                    }
                    // RENDER BOTS:
                    if (bots.length) {
                        bots.forEach((tmp) => {
                            if (tmp.inGame) {
                                mapContext.globalAlpha = 1;
                                mapContext.strokeStyle = "#cc5151";
                                renderCircle((tmp.x2 / config.mapScale) * mapDisplay.width,
                                             (tmp.y2 / config.mapScale) * mapDisplay.height, 7, mapContext, false, true);
                            }
                        });
                    }
                    // DEATH LOCATION:
                    if (lastDeath) {
                        mapContext.fillStyle = "#fc5553";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (lastDeath.x / config.mapScale) * mapDisplay.width,
                                            (lastDeath.y / config.mapScale) * mapDisplay.height);
                    }
                    // MAP MARKER:
                    if (mapMarker) {
                        mapContext.fillStyle = "#fff";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (mapMarker.x / config.mapScale) * mapDisplay.width,
                                            (mapMarker.y / config.mapScale) * mapDisplay.height);
                    }
                }
            }
            // ICONS:
            let crossHairs = ["https://cdn.discordapp.com/attachments/992344982235119667/1210586782899503114/crosshair1.png?ex=65eb19cc&is=65d8a4cc&hm=4b1d095d74ff9cbe75e32aba3b8d15f24ba32561a2b6f9e2f25b73a9c0f98b7a&", "https://cdn.discordapp.com/attachments/992344982235119667/1210586782899503114/crosshair1.png?ex=65eb19cc&is=65d8a4cc&hm=4b1d095d74ff9cbe75e32aba3b8d15f24ba32561a2b6f9e2f25b73a9c0f98b7a&"];
            let crossHairSprites = {};
            let iconSprites = {};
            let icons = ["crown", "skull"];

            function loadIcons() {
                for (let i = 0; i < icons.length; ++i) {
                    let tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    };
                    tmpSprite.src = "./../img/icons/" + icons[i] + ".png";
                    iconSprites[icons[i]] = tmpSprite;
                }
                for (let i = 0; i < crossHairs.length; ++i) {
                    let tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    };
                    tmpSprite.src = crossHairs[i];
                    crossHairSprites[i] = tmpSprite;
                }
            }
            loadIcons();
            /*function cocbach() {
          let damping = 0.1;
          let scalingFactor = 10;
          let cameraSpeed = 5;
          if (player) {
              let cameraDirectionX = 0;
              let cameraDirectionY = 0;
              if (tmpObj.dir) {
                  // You can use keyboard input or some other method to determine the direction.
                  // For example, if you have keyboard input:
                  // if (keyIsDown(LEFT_ARROW)) cameraDirectionX = -1;
                  // if (keyIsDown(RIGHT_ARROW)) cameraDirectionX = 1;
                  // if (keyIsDown(UP_ARROW)) cameraDirectionY = -1;
                  // if (keyIsDown(DOWN_ARROW)) cameraDirectionY = 1;
              }
              let targetCamX = camX + cameraDirectionX * cameraSpeed;
              let targetCamY = camY + cameraDirectionY * cameraSpeed;
              camX += (targetCamX - camX) * damping;
              camY += (targetCamY - camY) * damping;
          } else {
              camX = config.mapScale / 2;
              camY = config.mapScale / 2;
          }
      }*/
            // UPDATE GAME:
            function updateGame() {
                if (config.resetRender) {
                    mainContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                    mainContext.beginPath();
                }
                if (true) {
                    function add(array){
                        let lmao = 0
                        for(let i = 0; i < array.length; i++){
                            lmao += array[i]
                        }
                        return lmao/array.length
                    }

                    // MOVE CAMERA:
                    // MOVE CAMERA:
                    if (player) {
                        let px = player.x
                        let py = player.y
                        if(near.dist){
                            let ax = []
                            let ay = []
                            for(let i = 0; i < near.enemy.length; i++){
                                ax.push(near.enemy[i].x)
                                ay.push(near.enemy[i].y)
                            }
                            let apx = add(ax)
                            let apy = add(ay)
                            px = (player.x*6 + apx)/7
                            py = (player.y*6 + apy)/7

                        }
                        let tmpDist = UTILS.getDistance(camX, camY, px, py);
                        let tmpDir = UTILS.getDirection(px, py, camX, camY);
                        let camSpd = Math.min(tmpDist * 0.005 * delta, tmpDist);
                        if (tmpDist > 0.05) {
                            camX += camSpd * Math.cos(tmpDir);
                            camY += camSpd * Math.sin(tmpDir);
                        } else {
                            camX = px;
                            camY = py;
                        }
                    } else {
                        camX = config.mapScale / 2;
                        camY = config.mapScale / 2;
                    }



                    /* let tmpDist = UTILS.getDistance(camX, camY, px, py);
                        let tmpDir = UTILS.getDirection(px, py, camX, camY);
                        let camSpd = Math.min(tmpDist * 0.005 * delta, tmpDist);
                        if (tmpDist > 0.05) {
                            camX += camSpd * Math.cos(tmpDir);
                            camY += camSpd * Math.sin(tmpDir);
                        } else {
                            camX = px;
                            camY = py;
                        }*/



                    // INTERPOLATE PLAYERS AND AI:
                    var lastTime = now - (1000 / config.serverUpdateRate);
                    var tmpDiff;
                    for (var i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i]||ais[i-players.length];
                        if (tmpObj && tmpObj.visible) {
                            if (tmpObj.forcePos) {
                                tmpObj.x = tmpObj.x2;
                                tmpObj.y = tmpObj.y2;
                                tmpObj.dir = tmpObj.d2;
                            } else {
                                var total = tmpObj.t2 - tmpObj.t1;
                                var fraction = lastTime - tmpObj.t1;
                                var ratio = (fraction / total);
                                var rate = 170;
                                tmpObj.dt += delta;
                                var tmpRate = Math.min(1.7, tmpObj.dt / rate);
                                var tmpDiff = (tmpObj.x2 - tmpObj.x1);
                                tmpObj.x = tmpObj.x1 + (tmpDiff * tmpRate);
                                tmpDiff = (tmpObj.y2 - tmpObj.y1);
                                tmpObj.y = tmpObj.y1 + (tmpDiff * tmpRate);
                                tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                            }

                        }
                    }

                    // BETTER MOVE CAMERA:
                    /*if (player) {
              if (false) {
                  camX = player.x;
                  camY = player.y;
              } else {
                  let tmpDist = UTILS.getDistance(camX, camY, player.x, player.y);
                  let tmpDir = UTILS.getDirection(player.x, player.y, camX, camY);
                  let camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
                  if (tmpDist > 0.05) {
                      camX += camSpd * Math.cos(tmpDir);
                      camY += camSpd * Math.sin(tmpDir);
                  } else {
                      camX = player.x;
                      camY = player.y;
                  }
              }
          } else {
              camX = config.mapScale / 2;
              camY = config.mapScale / 2;
          }*/
                    // RENDER CORDS:
                    let xOffset = camX - (maxScreenWidth / 2);
                    let yOffset = camY - (maxScreenHeight / 2);
                    // RENDER BACKGROUND:
                    if (config.snowBiomeTop - yOffset <= 0 && config.mapScale - config.snowBiomeTop - yOffset >= maxScreenHeight) {
                        mainContext.fillStyle = "#b6db66"; //grass biom
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.mapScale - config.snowBiomeTop - yOffset <= 0) {
                        mainContext.fillStyle = "#dbc666";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.snowBiomeTop - yOffset >= maxScreenHeight) {
                        mainContext.fillStyle = "#fff";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.snowBiomeTop - yOffset >= 0) {
                        mainContext.fillStyle = "#fff";
                        mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - yOffset);
                        mainContext.fillStyle = "#b6db66";
                        mainContext.fillRect(0, config.snowBiomeTop - yOffset, maxScreenWidth,
                                             maxScreenHeight - (config.snowBiomeTop - yOffset));
                    } else {
                        mainContext.fillStyle = "#b6db66";
                        mainContext.fillRect(0, 0, maxScreenWidth,
                                             (config.mapScale - config.snowBiomeTop - yOffset));
                        mainContext.fillStyle = "#dbc666";
                        mainContext.fillRect(0, (config.mapScale - config.snowBiomeTop - yOffset), maxScreenWidth,
                                             maxScreenHeight - (config.mapScale - config.snowBiomeTop - yOffset));
                    }
                    // RENDER WATER AREAS:
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
                        renderWaterBodies(xOffset, yOffset, mainContext, config.riverPadding);
                        mainContext.fillStyle = "#91b2db";
                        renderWaterBodies(xOffset, yOffset, mainContext, (waterMult - 1) * 250);
                    }
                    if (player) {
                        // DEATH LOCATION:
                        if (lastDeath) {
                            mainContext.globalAlpha = 1;
                            mainContext.fillStyle = "#fc5553";
                            mainContext.font = "100px Hammersmith One";
                            mainContext.textBaseline = "middle";
                            mainContext.textAlign = "center";
                            mainContext.fillText("", lastDeath.x - xOffset, lastDeath.y - yOffset);
                        }
                        // PATHFINDER LINE:
                        if (pathFind.active) {
                            if (pathFind.array && (pathFind.chaseNear ? enemy.length : true)) {
                                mainContext.lineWidth = player.scale / 7;
                                mainContext.globalAlpha = 1;
                                mainContext.strokeStyle = "white";
                                mainContext.beginPath();
                                pathFind.array.forEach((path, i) => {
                                    let pathXY = {
                                        x: (pathFind.scale / pathFind.grid) * path.x,
                                        y: (pathFind.scale / pathFind.grid) * path.y
                                    }
                                    let render = {
                                        x: ((player.x2 - (pathFind.scale / 2)) + pathXY.x) - xOffset,
                                        y: ((player.y2 - (pathFind.scale / 2)) + pathXY.y) - yOffset
                                    }
                                    if (i == 0) {
                                        mainContext.moveTo(render.x, render.y);
                                    } else {
                                        mainContext.lineTo(render.x, render.y);
                                    }
                                });
                                mainContext.stroke();
                            }
                        }
                    }
                    // RENDER DEAD PLAYERS:
                    if (inWindow && fisrtloadez) {
                        mainContext.globalAlpha = 1;
                        mainContext.strokeStyle = outlineColor;
                        renderDeadPlayers(xOffset, yOffset, Math.random() * Math.PI * 2);
                    }
                    // RENDER BOTTOM LAYER:
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderGameObjects(-1, xOffset, yOffset);
                    // RENDER PROJECTILES:
                    mainContext.globalAlpha = 1;
                    mainContext.lineWidth = outlineWidth;
                    renderProjectiles(0, xOffset, yOffset);
                    // RENDER PLAYERS:
                    renderPlayers(xOffset, yOffset, 0);
                    // RENDER AI:
                    mainContext.globalAlpha = 1;
                    for (let i = 0; i < ais.length; ++i) {
                        tmpObj = ais[i];
                        if (tmpObj.active && tmpObj.visible) {
                            tmpObj.animate(delta);
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - (Math.PI / 2));
                            renderAI(tmpObj, mainContext);
                            mainContext.restore();
                        }
                    }
                    // RENDER GAME OBJECTS (LAYERED):
                    renderGameObjects(0, xOffset, yOffset);
                    renderProjectiles(1, xOffset, yOffset);
                    renderGameObjects(1, xOffset, yOffset);
                    renderPlayers(xOffset, yOffset, 1);
                    renderGameObjects(2, xOffset, yOffset);
                    renderGameObjects(3, xOffset, yOffset);
                    // MAP BOUNDARIES:
                    mainContext.fillStyle = "#000";
                    mainContext.globalAlpha = 0.2;
                    if (xOffset <= 0) {
                        mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
                    } if (config.mapScale - xOffset <= maxScreenWidth) {
                        let tmpY = Math.max(0, -yOffset);
                        mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
                    } if (yOffset <= 0) {
                        mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
                    } if (config.mapScale - yOffset <= maxScreenHeight) {
                        let tmpX = Math.max(0, -xOffset);
                        let tmpMin = 0;
                        if (config.mapScale - xOffset <= maxScreenWidth)
                            tmpMin = maxScreenWidth - (config.mapScale - xOffset);
                        mainContext.fillRect(tmpX, config.mapScale - yOffset,
                                             (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
                    }
                    // RENDER DAY/NIGHT TIME:
                    mainContext.globalAlpha = 1;
                    mainContext.fillStyle = "rgba(0, 0, 40, 0.65)";
                    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    // RENDER PLAYER AND AI UI:
                    mainContext.strokeStyle = darkOutlineColor;
                    mainContext.globalAlpha = 1;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj.visible) {
                            mainContext.strokeStyle = darkOutlineColor;
                            let trustIconImage = new Image();
                            trustIconImage.src = '';

                            // NAME AND HEALTH:
                            if (tmpObj.skinIndex != 10 || (tmpObj==player) || (tmpObj.team && tmpObj.team==player.team)) {
                                let tmpText = (tmpObj.team ? "/" + tmpObj.team + "/ " : "") + (tmpObj.name || ""); //+ (tmpObj.isPlayer ? " {" + tmpObj.sid + "}" : "");
                                if (tmpText != "") {
                                    mainContext.font = (tmpObj.nameScale||30) + "px Hammersmith One";
                                    mainContext.fillStyle = "#fff";
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    mainContext.lineWidth = (tmpObj.nameScale?11:8);
                                    mainContext.lineJoin = "round";
                                    mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                    mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                    if (tmpObj.isLeader && iconSprites["crown"].isLoaded) {
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - (tmpS/2) - (mainContext.measureText(tmpText).width / 2) - config.crownPad;
                                        mainContext.drawImage(iconSprites["crown"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                              - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    } if (tmpObj.iconIndex == 1 && iconSprites["skull"].isLoaded) {
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - (tmpS/2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad;
                                        mainContext.drawImage(iconSprites["skull"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                              - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    }
                                    if (tmpObj.isPlayer && instaC.wait && near == tmpObj && (tmpObj.backupNobull ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length && !useWasd) {
                                        let tmpS = tmpObj.scale * 2.2;
                                        mainContext.drawImage((tmpObj.backupNobull ? crossHairSprites[1] : crossHairSprites[0]), tmpObj.x - xOffset - tmpS / 2, tmpObj.y - yOffset - tmpS / 2, tmpS, tmpS);
                                    }
                                }

                                 if (tmpObj.health > 0) {

                                    // HEALTH HOLDER:
                                    mainContext.fillStyle = darkOutlineColor;
                                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                          (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                          (config.healthBarPad * 2), 17, 8);
                                    mainContext.fill();

                                    // HEALTH BAR:
                                    mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))?"#8ecc51":"#cc5151";
                                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                          (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                          ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 7);
                                    mainContext.fill();
                                    if (tmpObj.isPlayer) {
                                        let publicStatus = " " + tmpObj.sid + " ";
                                        mainContext.font = (tmpObj.nameScale || 25) + "px Hammersmith One";
                                        mainContext.fillStyle = "#fff";
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = (tmpObj.nameScale ? 11 : 8);
                                        mainContext.strokeText(publicStatus, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - 65 /* + config.nameY */);
                                        mainContext.fillText(publicStatus, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - 65 /* + config.nameY */);

                                    }
                                    if (tmpObj.isPlayer) {

                                        mainContext.globalAlpha = 1;

                                        if (getEl("visualType").value == "ueh1") {
                                            let reloads = {
                                                primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                                                secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                                turret: (2500 - tmpObj.reloads[53]) / 2500
                                            };

                                            // SECONDARY RELOAD HOLDER:
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                                  (config.healthBarPad * 2), 17, 8);
                                            mainContext.fill();

                                            // SECONDARY RELOAD BAR:
                                            mainContext.fillStyle = "#90ee90";
                                            mainContext.roundRect(tmpObj.x - xOffset,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                                  (config.healthBarWidth * reloads.secondary), 17 - config.healthBarPad * 2, 7);
                                            mainContext.fill();

                                            // PRIMARY RELOAD HOLDER:
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                                  (config.healthBarPad * 2), 17, 8);
                                            mainContext.fill();

                                            // PRIMARY RELOAD BAR:
                                            mainContext.fillStyle = "#90ee90";
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                                  (config.healthBarWidth * reloads.primary), 17 - config.healthBarPad * 2, 7);
                                            mainContext.fill();
                                        } else {
                                            mainContext.fillStyle = "#99ff99";

                                            if (tmpObj.secondaryIndex == undefined ? false : (tmpObj.reloads[tmpObj.secondaryIndex] > 0)) {
                                                mainContext.strokeStyle = "#99ff99";
                                                var barRadius = 20; // Raio da barra de recarga
                                                var lineWidth = 5; // Largura da linha da barra
                                                var playerX = tmpObj.x - xOffset; // Ajuste para mover a barra para a direita
                                                var playerY = tmpObj.y - yOffset + tmpObj.scale + config.nameY - 65; // Ajuste para mover a barra mais para cima

                                                mainContext.beginPath();
                                                mainContext.arc(playerX, playerY, barRadius, Math.PI + Math.PI / 6, 1.8 * Math.PI); // Ângulo inicial ajustado
                                                mainContext.lineWidth = lineWidth;
                                                mainContext.strokeStyle = darkOutlineColor; // Cor da borda da barra
                                                mainContext.stroke();

                                                // Calcular o ângulo com base no progresso da recarga
                                                var angle = 1.8 * Math.PI * (1 - (tmpObj.reloads[tmpObj.secondaryIndex] / items.weapons[tmpObj.secondaryIndex].speed)); // Comprimento da barra ajustado

                                                mainContext.beginPath();
                                                mainContext.arc(playerX, playerY, barRadius, 1.8 * Math.PI - angle, 1.8 * Math.PI); // Ângulo inicial e final ajustados
                                                mainContext.lineWidth = lineWidth;
                                                mainContext.strokeStyle = "#90ee90";
                                                mainContext.stroke();
                                            }





                                        }


                                        if (tmpObj == player) {

                                            /*
                                            // TURRET RELOAD HOLDER:
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + 13, (config.healthBarWidth * 2) +
                                                                  (config.healthBarPad * 2), 17, 8);
                                            mainContext.fill();

                                            // TURRET RELOAD BAR:
                                            mainContext.fillStyle = "#cc5151";
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + 13 + config.healthBarPad,
                                                                  ((config.healthBarWidth * 2) * reloads.turret), 17 - config.healthBarPad * 2, 7);
                                            mainContext.fill();
                                            */

                                            // RENDER DIR:


                                        }

                                        // UNDER TEXT:
                                        mainContext.globalAlpha = 1;
                                        mainContext.font = "20px Hammersmith One";
                                        mainContext.fillStyle = "#fff";
                                        mainContext.strokeStyle = darkOutlineColor;
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = 8;
                                        mainContext.lineJoin = "round";
                                        let text = [];



                                        // SHAME COUNT:
                                        mainContext.globalAlpha = 1;
                                        mainContext.font = "25px Hammersmith One";
                                        mainContext.fillStyle = "#fff";
                                        mainContext.strokeStyle = darkOutlineColor;
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = 8;
                                        mainContext.lineJoin = "round";
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - tmpS / 2 + mainContext.measureText(tmpText).width / 2 + config.crownPad + (tmpObj.iconIndex == 1 ? 30 * 2.75 : 30);
                                        mainContext.strokeText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount, tmpObj.x - xOffset,(tmpObj.y - yOffset + tmpObj.scale) + config.nameY + 18.5 * 2);
                                        mainContext.fillText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount, tmpObj.x - xOffset,(tmpObj.y - yOffset + tmpObj.scale) + config.nameY + 18.5 * 2);



                                        if (getEl("predictType").value == "pre2") {
                                            mainContext.lineWidth = 3;
                                            mainContext.strokeStyle = "#cc5151";
                                            mainContext.globalAlpha = 1;
                                            mainContext.beginPath();
                                            let render = {
                                                x: tmpObj.x2 - xOffset,
                                                y: tmpObj.y2 - yOffset
                                            };
                                            mainContext.moveTo(tmpObj.x - xOffset, tmpObj.y - yOffset);
                                            mainContext.lineTo(render.x, render.y);
                                            mainContext.stroke();
                                        } else if (getEl("predictType").value == "pre3") {
                                            mainContext.lineWidth = 3;
                                            mainContext.strokeStyle = "#cc5151";
                                            mainContext.globalAlpha = 1;
                                            mainContext.beginPath();
                                            let render = {
                                                x: tmpObj.x3 - xOffset,
                                                y: tmpObj.y3 - yOffset
                                            };
                                            mainContext.moveTo(tmpObj.x - xOffset, tmpObj.y - yOffset);
                                            mainContext.lineTo(render.x, render.y);
                                            mainContext.stroke();
                                        }

                                    }
                                }
                            }


                        }
                    }

                    // RENDER GAME OBJECTS:
                    function renderGameObjects(layer, xOffset, yOffset) {
                        let tmpSprite;
                        let tmpX;
                        let tmpY;
                        gameObjects.forEach((tmp) => {
                            tmpObj = tmp;
                            if (tmpObj.alive) {
                                tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
                                tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;
                                if (layer == 0) {
                                    tmpObj.update(delta);
                                }
                                mainContext.globalAlpha = tmpObj.alpha;

                                if (tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0))) {
                                    if (tmpObj.isItem) {
                                        if ((tmpObj.dmg || tmpObj.trap) && !tmpObj.isTeamObject(player)) {
                                            tmpSprite = getObjSprite(tmpObj);
                                        } else {
                                            tmpSprite = getItemSprite(tmpObj);
                                        }

                                        mainContext.save();
                                        mainContext.translate(tmpX, tmpY);

                                       /* if (tmpObj.name == "spinning spikes") {
                                    let rotationSpeed = tmpObj.rotationSpeed || (Math.PI / -10000);
                                    tmpObj.rotationAngle = (tmpObj.rotationAngle || 0) + rotationSpeed * delta;
                                    mainContext.rotate(tmpObj.rotationAngle);
                                } else {
                                    mainContext.rotate(tmpObj.dir);
                                }*/
                                if (tmpObj.name == "windmill") {
                                    let rotationSpeed = tmpObj.rotationSpeed || (Math.PI / 20000);
                                    tmpObj.rotationAngle = (tmpObj.rotationAngle || 0) + rotationSpeed * delta;
                                    mainContext.rotate(tmpObj.rotationAngle);
                                } else {
                                    mainContext.rotate(tmpObj.dir);
                                }
                                        if (tmpObj.name == "faster windmill") {
                                    let rotationSpeed = tmpObj.rotationSpeed || (Math.PI / 20000);
                                    tmpObj.rotationAngle = (tmpObj.rotationAngle || 0) + rotationSpeed * delta;
                                    mainContext.rotate(tmpObj.rotationAngle);
                                } else {
                                    mainContext.rotate(tmpObj.dir);
                                }
                                      /*  if (tmpObj.name == "power windmill") {
                                    let rotationSpeed = tmpObj.rotationSpeed || (Math.PI / 9500);
                                    tmpObj.rotationAngle = (tmpObj.rotationAngle || 0) + rotationSpeed * delta;
                                    mainContext.rotate(tmpObj.rotationAngle);
                                } else {
                                    mainContext.rotate(tmpObj.dir);
                                }*/
                                        mainContext.rotate(tmpObj.dir);
                                        if (!tmpObj.active) {
                                            mainContext.scale(tmpObj.visScale / tmpObj.scale, tmpObj.visScale / tmpObj.scale);
                                        }
                                        mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));


                                        if (tmpObj.blocker) {
                                            mainContext.strokeStyle = "#db6e6e";
                                            mainContext.globalAlpha = 0.3;
                                            mainContext.lineWidth = 6;
                                            renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                                        }
                                        mainContext.restore();
                                    } else {
                                        tmpSprite = getResSprite(tmpObj);
                                        mainContext.drawImage(tmpSprite, tmpX - (tmpSprite.width / 2), tmpY - (tmpSprite.height / 2));
                                        renderResTest(tmpObj, tmpX, tmpY)
                                    }
                                }
                 /*   function renderGameObjects(layer, xOffset, yOffset) {
                let tmpSprite;
                let tmpX;
                let tmpY;
                gameObjects.forEach((tmp) => {
                    tmpObj = tmp;
                    tmp.dir = tmp.lastDir;
                    if (tmpObj.active) {
                        tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
                        tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;
                        if (layer == 0) {
                            tmpObj.update(delta);
                        }
                        mainContext.globalAlpha = tmpObj.alpha;
                        if (tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0))) {
                            if (tmpObj.isItem) {
                                if ((tmpObj.dmg || tmpObj.trap) && !tmpObj.isTeamObject(player)) {
                                    tmpSprite = getObjSprite(tmpObj);
                                } else {
                                    tmpSprite = getItemSprite(tmpObj);
                                }
                                mainContext.save();
                                mainContext.translate(tmpX, tmpY);
                                if (tmpObj.name == "spinning spikes") {
                                    let rotationSpeed = tmpObj.rotationSpeed || (Math.PI / 3260);
                                    tmpObj.rotationAngle = (tmpObj.rotationAngle || 0) + rotationSpeed * delta;
                                    mainContext.rotate(tmpObj.rotationAngle);
                                } else {
                                    mainContext.rotate(tmpObj.dir);
                                }
                                if (tmpObj.name == "windmill") {
                                    let rotationSpeed = tmpObj.rotationSpeed || (Math.PI / 3260);
                                    tmpObj.rotationAngle = (tmpObj.rotationAngle || 0) + rotationSpeed * delta;
                                    mainContext.rotate(tmpObj.rotationAngle);
                                } else
                                    mainContext.rotate(tmpObj.dir);
                                }
                                if (!tmpObj.active) {
                                    mainContext.scale(tmpObj.visScale / tmpObj.scale, tmpObj.visScale / tmpObj.scale);
                                }
                                mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));
                                if (tmpObj.blocker) {
                                    mainContext.strokeStyle = "#db6e6e";
                                    mainContext.globalAlpha = 0.3;
                                    mainContext.lineWidth = 6;
                                    renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                                }
                                mainContext.restore();
                            } else {
                               // renderResTest(tmpObj, tmpX, tmpY)
                            }
                        }*/
                                /*if (layer == 3) {
                                    if (tmpObj.health < tmpObj.maxHealth) {
                                        const remainingHealthPercentage = 1 - tmpObj.health / tmpObj.maxHealth;

                                        const circleRadius = config.healthBarWidth / 2 + config.healthBarPad - 5;
                                        const startAngle = Math.PI;
                                        const endAngle = Math.PI + (remainingHealthPercentage * 2 * Math.PI);


                                        // build health
                                        const healthColor = "#514b96"; // Get the appropriate health color

                                        // build health holder
                                        mainContext.beginPath();
                                        mainContext.arc(tmpObj.x - xOffset, tmpObj.y - yOffset, circleRadius, Math.PI, Math.PI + (remainingHealthPercentage * 2 * Math.PI), true);
                                        mainContext.strokeStyle = "#1E1E1E";
                                        mainContext.lineWidth = 11;
                                        mainContext.lineCap = 'round';
                                        mainContext.stroke();

                                        // build health
                                        mainContext.beginPath();
                                        mainContext.arc(tmpObj.x - xOffset, tmpObj.y - yOffset, circleRadius, Math.PI, Math.PI + (remainingHealthPercentage * 2 * Math.PI), true);

                                        mainContext.strokeStyle = tmpObj.isTeamObject(player) ? healthColor : "#cc5151";
                                        mainContext.lineWidth = 6;
                                        mainContext.lineCap = 'round';
                                        mainContext.stroke();
                                        // Draw object owner's ID
                                        mainContext.fillStyle = "#5f9ea0";
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.strokeStyle = "#000"; // Define a cor da borda para preto
                                        mainContext.lineWidth = 6; // Define a largura da borda

                                        const fontSize = 12; // Tamanho da fonte em pixels
                                        mainContext.font = `${fontSize}px Arial`; // Define a fonte

                                        mainContext.strokeText(tmpObj.owner.sid, tmpX, tmpY  + fontSize);
                                        mainContext.fillText(tmpObj.owner.sid, tmpX, tmpY  + fontSize);
                                    }

                                }
                            }
                        });*/

                               /*  if (layer === 3) {
                            if (tmpObj.health < tmpObj.maxHealth) {
                                mainContext.beginPath();
                                mainContext.strokeStyle = darkOutlineColor;
                                mainContext.lineWidth = 3;
                                mainContext.arc(tmpX, tmpY, config.healthBarWidth / 2 + config.healthBarPad + mainContext.lineWidth / 2, 0, 2 * Math.PI);
                                mainContext.stroke();
                                // HEALTH BAR:
                                mainContext.beginPath();
                                mainContext.strokeStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
                                mainContext.lineWidth = 6;
                                const currentAngle = 2 * Math.PI * (tmpObj.health / tmpObj.maxHealth);
                                mainContext.arc(tmpX, tmpY, config.healthBarWidth / 2, 0, currentAngle);
                                mainContext.stroke();
                            }
                        }
                            }
                        });*/
                                if (layer == 3) {
                                if (tmpObj.health < tmpObj.maxHealth) {
                                // HEALTH HOLDER:
                                mainContext.fillStyle = darkOutlineColor;
                                mainContext.roundRect(tmpX - config.healthBarWidth / 2 - config.healthBarPad, tmpY - config.healthBarPad, config.healthBarWidth + config.healthBarPad * 2, 17, 8);
                                mainContext.fill();

                                // HEALTH BAR:
                                mainContext.fillStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
                                mainContext.roundRect(tmpX - config.healthBarWidth / 2, tmpY, config.healthBarWidth * (tmpObj.health / tmpObj.maxHealth), 17 - config.healthBarPad * 2, 7);
                                mainContext.fill();
                            }
                        }
                    }
                });
                        mainContext.restore();

                        // PLACE VISIBLE:
                        if (layer == 0) {
                            if (placeVisible.length) {
                                placeVisible.forEach((places) => {
                                    tmpX = places.x - xOffset;
                                    tmpY = places.y - yOffset;
                                    markObject(places, tmpX, tmpY);
                                });
                            }
                            if (preplaceVisible.length) {
                                preplaceVisible.forEach((places) => {
                                    tmpX = places.x - xOffset;
                                    tmpY = places.y - yOffset;
                                    ppmarkObject(places, tmpX, tmpY);
                                });
                            }
                        }
                    }
                    /*let treeAlphaState = [];
            function renderResTest(y, n, r, offsets) {
                let s = getResSprite(y);
                let easeScale = 0.06, lowestAlpha = 0.2;
                if (player && y.type === 0 && getEl("tree").checked) {

                    if (!treeAlphaState[y.sid]) treeAlphaState[y.sid] = 1;
                    if (Math.hypot(y.y - player.y2, y.x - player.x2) <= y.scale + player.scale) {
                        treeAlphaState[y.sid] = Math.max(lowestAlpha, (treeAlphaState[y.sid] - easeScale));
                        mainContext.globalAlpha = treeAlphaState[y.sid];
                    } else {
                        treeAlphaState[y.sid] = Math.min(1, (treeAlphaState[y.sid] + easeScale));
                        mainContext.globalAlpha = treeAlphaState[y.sid];
                    };
                }
                mainContext.drawImage(s, n - s.width / 2, r - s.height / 2);
            }*/
                    function markObject(tmpObj, tmpX, tmpY) {
                        getMarkSprite(tmpObj, mainContext, tmpX, tmpY);
                    }
                    function ppmarkObject(tmpObj, tmpX, tmpY) {
                        ppyen(mainContext, tmpX, tmpY);
                    }

                    function yen(context, x, y) {
                        context.fillStyle = "rgb(255, 0, 0, 0.5)";
                        context.globalAlpha = 0.5;
                        context.beginPath();
                        context.stroke();
                        context.strokeStyle = "red"
                        context.arc(x, y, 40, 0, Math.PI * 2); // Adjust the circle size
                        context.fill();
                        context.stroke();
                        context.strokeStyle = "red"
                        context.closePath();


                        context.globalAlpha = 0.5;
                    }
                    function ppyen(context, x, y) {
                        context.fillStyle = "rgba(255, 0, 0, 0.2)";
                        context.beginPath();
                        context.arc(x, y, 55, 0, Math.PI * 2); // Adjust the circle size
                        context.fill();
                        context.closePath();
                        context.globalAlpha = 1;
                    }
                    // AUTOPUSH LINE:
                    /*if (my.autoPush) {
                        mainContext.lineWidth = 3;
                        mainContext.globalAlpha = 1;
                        mainContext.beginPath();

                        mainContext.fillStyle = darkOutlineColor;
                        mainContext.strokeStyle = "white";
                        mainContext.moveTo(player.x - xOffset, player.y - yOffset);
                        mainContext.lineTo(my.pushData.x2 - xOffset, my.pushData.y2 - yOffset);
                        mainContext.lineTo(my.pushData.x - xOffset, my.pushData.y - yOffset);
                        mainContext.stroke();
                    }
                    mainContext.globalAlpha = 1;*/
                    if (my.autoPush && my.pushData) {
            mainContext.lineWidth = 5;
            mainContext.globalAlpha = 1;
            mainContext.beginPath();
            mainContext.strokeStyle = "white";
            var x1 = player.x - xOffset;
            var y1 = player.y - yOffset;
            var x2 = my.pushData.x2 - xOffset;
            var y2 = my.pushData.y2 - yOffset;
            var x3 = my.pushData.x - xOffset;
            var y3 = my.pushData.y - yOffset;

            mainContext.moveTo(x1, y1);
            mainContext.lineTo(x2, y2);
            mainContext.lineTo(x3, y3);
            mainContext.stroke();

            var deltaX = x3 - x1;
            var deltaY = y3 - y1;
            var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            var maxDistance = 100;
            var percentage = (distance / maxDistance) * 100;

            percentage = Math.min(100, Math.max(0, percentage));
            let spike;
            mainContext.fillStyle = "white";
            mainContext.strokeStyle = "black";
            mainContext.lineWidth = 5;
            mainContext.font = "45px Montserrat";
            let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function(a, b) {
                return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
            })[0];
            if(nearTrap)
                spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale)).sort(function(a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];

            //textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "push " + my.pushData.x, "#fff", 2);
                            //  addMenuChText("System", "Push Perentage: " + percentage, "red");

            let xx = (player.x - xOffset + near.x - xOffset) / 2;
            let yy = (player.y - yOffset + near.y - yOffset) / 2;

            mainContext.moveTo(player.x - xOffset, player.y - yOffset);
            mainContext.strokeText(near.aim2, xx, yy);
            mainContext.fillText(near.aim2, xx, yy);
        }


    mainContext.globalAlpha = 1;

                    // RENDER ANIM TEXTS:
                    textManager.update(delta, mainContext, xOffset, yOffset);



                    // RENDER CHAT MESSAGES:
                    for (let i = 0; i < players.length; ++i) {
                        tmpObj = players[i];
                        if (tmpObj.visible) {
                            if (tmpObj.chatCountdown > 0) {
                                tmpObj.chatCountdown -= delta;
                                if (tmpObj.chatCountdown <= 0)
                                    tmpObj.chatCountdown = 0;
                                mainContext.font = "32px Hammersmith One";
                                let tmpSize = mainContext.measureText(tmpObj.chatMessage);
                                mainContext.textBaseline = "middle";
                                mainContext.textAlign = "center";
                                let tmpX = tmpObj.x - xOffset;
                                let tmpY = tmpObj.y - tmpObj.scale - yOffset - 90;
                                let tmpH = 47;
                                let tmpW = tmpSize.width + 17;
                                mainContext.fillStyle = "rgba(0,0,0,0.2)";
                                mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                mainContext.fill();
                                mainContext.fillStyle = "#fff";
                                mainContext.fillText(tmpObj.chatMessage, tmpX, tmpY);
                            }
                            if (tmpObj.chat.count > 0) {
                                if (!useWasd) {
                                    tmpObj.chat.count -= delta;
                                    if (tmpObj.chat.count <= 0)
                                        tmpObj.chat.count = 0;
                                    mainContext.font = "32px Hammersmith One";
                                    let tmpSize = mainContext.measureText(tmpObj.chat.message);
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    let tmpX = tmpObj.x - xOffset;
                                    let tmpY = tmpObj.y - tmpObj.scale - yOffset + (90 * 2);
                                    let tmpH = 47;
                                    let tmpW = tmpSize.width + 17;
                                    mainContext.fillStyle = "rgba(0,0,0,0.2)";
                                    mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                    mainContext.fill();
                                    mainContext.fillStyle = "#ffffff99";
                                    mainContext.fillText(tmpObj.chat.message, tmpX, tmpY);
                                } else {
                                    tmpObj.chat.count = 0;
                                }
                            }
                        }
                    }
                    if (allChats.length) {
                        allChats.filter(ch => ch.active).forEach((ch) => {
                            if (!ch.alive) {
                                if (ch.alpha <= 1) {
                                    ch.alpha += delta / 250;
                                    if (ch.alpha >= 1) {
                                        ch.alpha = 1;
                                        ch.alive = true;
                                    }
                                }
                            } else {
                                ch.alpha -= delta / 5000;
                                if (ch.alpha <= 0) {
                                    ch.alpha = 0;
                                    ch.active = false;
                                }
                            }
                            if (ch.active) {
                                mainContext.font = "20px Hammersmith One";
                                let tmpSize = mainContext.measureText(ch.chat);
                                mainContext.textBaseline = "middle";
                                mainContext.textAlign = "center";
                                let tmpX = ch.owner.x - xOffset;
                                let tmpY = ch.owner.y - ch.owner.scale - yOffset - 90;
                                let tmpH = 47;
                                let tmpW = tmpSize.width + 17;
                                mainContext.globalAlpha = ch.alpha;
                                mainContext.fillStyle = ch.owner.isTeam(player) ? "rgba(255,215,0,1)" : "#cc5151";
                                mainContext.strokeStyle = "rgb(25, 25, 25)";
                                mainContext.lineWidth = 5;
                                mainContext.fillStyle = "rgba(0,0,0,0.4)";
                                mainContext.strokeStyle = "rgba(0,0,0,0.0)";
                                mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                mainContext.stroke();
                                mainContext.fill();
                                mainContext.fillStyle = "#fff";
                                mainContext.strokeStyle = "#000";
                                mainContext.strokeText(ch.chat, tmpX, tmpY);
                                mainContext.fillText(ch.chat, tmpX, tmpY);
                                ch.y -= delta / 100;
                            }
                        });
                    }
                }
                mainContext.globalAlpha = 1;
                // RENDER MINIMAP:
                renderMinimap(delta);
            }
            // UPDATE & ANIMATE:
            window.requestAnimFrame = function() {
                return null;
            }
            let ms = {
                avg: 0,
                max: 0,
                min: 0,
                delay: 0
            }
            window.rAF = (function() {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
            })();
            function doUpdate() {
                now = performance.now();
                delta = now - lastUpdate;
                lastUpdate = now;
                let timer = performance.now();
                let diff = timer - fpsTimer.last;
                if (diff >= 1000) {
                    fpsTimer.ltime = fpsTimer.time * (1000 / diff);
                    fpsTimer.last = timer;
                    fpsTimer.time = 0;
                }
                fpsTimer.time++;

                updateGame();
                rAF(doUpdate);
                getEl("pingFps").innerHTML = `${window.pingTime}ms | Frames: ${UTILS.round(fpsTimer.ltime, 10)}`;
                getEl("packetStatus").innerHTML = secPacket;
                getEl("InfoAll").innerHTML = "Preplace: " + PrePlaceCount;
            }
            prepareMenuBackground();
            doUpdate();
            function toggleUseless(boolean) {
                getEl("instaType").disabled = boolean;
                getEl("antiBullType").disabled = boolean;
                getEl("predictType").disabled = boolean;
                getEl("visualType").disabled = boolean;
            }
            toggleUseless(useWasd);
            let changeDays = {};
            window.debug = function() {
                my.waitHit = 0;
                my.autoAim = false;
                instaC.isTrue = false;
                traps.inTrap = false;
                itemSprites = [];
                objSprites = [];
                gameObjectSprites = [];
            };

            window.toggleNight = function() {
                clearTimeout(changeDays);
                if (nightMode.style.animationName == "night1") {
                    nightMode.style.animationName = "night2";
                    nightMode.style.opacity = 0;
                    changeDays = setTimeout(() => {
                        nightMode.style.display = "none";
                    }, 1000 * parseFloat(nightMode.style.animationDuration));
                } else {
                    nightMode.style.animationName = "night1";
                    nightMode.style.opacity = 0.35;
                    nightMode.style.display = "block";
                }
                isNight = !isNight;
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
                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                        checkPlace(player.getItemType(22), i);
                    }
                }
            };

            // REMOVED!!! so they cant abuse :)
            let projects = [];
            let botIDS = 0;
            window.connectFillBots = function() {
                botSkts = [];
                botIDS = 0;
                for (let i = 0; i < projects.length; i++) {
                    let test = new WebSocket(`wss://${projects[i]}.glitch.me`);
                    test.binaryType = "arraybuffer";
                    test.onopen = function() {
                        test.ssend = function(type) {
                            let data = Array.prototype.slice.call(arguments, 1);
                            let binary = window.msgpack.encode([type, data]);
                            test.send(binary);
                        };
                        for (let i = 0; i < 4; i++) {
                            window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
                                action: "homepage"
                            }).then(function(token) {
                                test.ssend("bots", WS.url.split("&")[0] + "&token=" + encodeURIComponent(token), botIDS);
                                botSkts.push([test]);
                                botIDS++;
                            });
                        }
                    };
                    test.onmessage = function(message) {
                        let data = new Uint8Array(message.data);
                        let parsed = window.msgpack.decode(data);
                        let type = parsed[0];
                        data = parsed[1];
                    };
                }
            };
            window.destroyFillBots = function() {
                botSkts.forEach((socket) => {
                    socket[0].close();
                });
                botSkts = [];
            };
            window.tryConnectBots = function() {
                for (let i = 0; i < (bots.length < 3 ? 3 : 4); i++) {
                    window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
                        action: "homepage"
                    }).then(function(token) {
                        // CONNECT SOCKET:
                        botSpawn(token);
                    });
                }
            };
            window.destroyBots = function() {
                bots.forEach((botyyyyy) => {
                    botyyyyy.closeSocket = true;
                });
                bots = [];
            };
            window.resBuild = function() {
                if (gameObjects.length) {
                    gameObjects.forEach((tmp) => {
                        tmp.breakObj = false;
                    });
                    breakObjects = [];
                }
            };
            window.toggleBotsCircle = function() {
                player.circle = !player.circle;
            };
            window.toggleVisual = function() {
                config.anotherVisual = !config.anotherVisual;
                gameObjects.forEach((tmp) => {
                    if (tmp.active) {
                        tmp.dir = tmp.lastDir;
                    }
                });
            };
            window.prepareUI = function(tmpObj) {
                resize();


                function closeChat() {
                    chatBox.value = "";
                    chatHolder.style.display = "none";
                }
                // ACTION BAR:
                UTILS.removeAllChildren(actionBar);
                for (let i = 0; i < (items.weapons.length + items.list.length); ++i) {
                    (function(i) {
                        UTILS.generateElement({
                            id: "actionBarItem" + i,
                            class: "actionBarItem",
                            style: "display:none",
                            onmouseout: function() {
                                showItemInfo();
                            },
                            parent: actionBar
                        });
                    })(i);
                }
                for (let i = 0; i < (items.list.length + items.weapons.length); ++i) {
                    (function(i) {
                        let tmpCanvas = document.createElement("canvas");
                        tmpCanvas.width = tmpCanvas.height = 66;
                        let tmpContext = tmpCanvas.getContext("2d");
                        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                        tmpContext.imageSmoothingEnabled = false;
                        tmpContext.webkitImageSmoothingEnabled = false;
                        tmpContext.mozImageSmoothingEnabled = false;
                        if (items.weapons[i]) {
                            tmpContext.rotate((Math.PI / 4) + Math.PI);
                            let tmpSprite = new Image();
                            toolSprites[items.weapons[i].src] = tmpSprite;
                            tmpSprite.onload = function() {
                                this.isLoaded = true;
                                let tmpPad = 1 / (this.height / this.width);
                                let tmpMlt = (items.weapons[i].iPad || 1);
                                tmpContext.drawImage(this, -(tmpCanvas.width * tmpMlt * config.iconPad * tmpPad) / 2, -(tmpCanvas.height * tmpMlt * config.iconPad) / 2,
                                                     tmpCanvas.width * tmpMlt * tmpPad * config.iconPad, tmpCanvas.height * tmpMlt * config.iconPad);
                                tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                                tmpContext.globalCompositeOperation = "source-atop";
                                tmpContext.fillRect(-tmpCanvas.width / 2, -tmpCanvas.height / 2, tmpCanvas.width, tmpCanvas.height);
                                getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            };
                            tmpSprite.src = "./../img/weapons/" + items.weapons[i].src + ".png";
                            let tmpUnit = getEl('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.weapons[i], true);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectWeapon(tmpObj.weapons[items.weapons[i].type]);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        } else {
                            let tmpSprite = getItemSprite(items.list[i - items.weapons.length], true);
                            let tmpScale = Math.min(tmpCanvas.width - config.iconPadding, tmpSprite.width);
                            tmpContext.globalAlpha = 1;
                            tmpContext.drawImage(tmpSprite, -tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                            tmpContext.globalCompositeOperation = "source-atop";
                            tmpContext.fillRect(-tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            let tmpUnit = getEl('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.list[i - items.weapons.length]);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectToBuild(tmpObj.items[tmpObj.getItemType(i - items.weapons.length)]);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        }
                    })(i);
                }
            };
            window.profineTest = function(data) {
                if (data) {
                    // SET INITIAL NAME:
                    let noname = "unknown";
                    // VALIDATE NAME:
                    let name = data + "";
                    name = name.slice(0, config.maxNameLength);
                    name = name.replace(/[^\w:\(\)\/? -]+/gmi, " ");  // USE SPACE SO WE CAN CHECK PROFANITY
                    name = name.replace(/[^\x00-\x7F]/g, " ");
                    name = name.trim();
                    let langFilter = {
                        "list": [
                            /*                            "ahole",
              "anus",
              "ash0le",
              "ash0les",
              "asholes",
              "ass",
              "Ass Monkey",
              "Assface",
              "assh0le",
              "assh0lez",
              "asshole",
              "assholes",
              "assholz",
              "asswipe",
              "azzhole",
              "bassterds",
              "bastard",
              "bastards",
              "bastardz",
              "basterds",
              "basterdz",
              "Biatch",
              "bitch",
              "bitches",
              "Blow Job",
              "boffing",
              "butthole",
              "buttwipe",
              "c0ck",
              "c0cks",
              "c0k",
              "Carpet Muncher",
              "cawk",
              "cawks",
              "Clit",
              "cnts",
              "cntz",
              "cock",
              "cockhead",
              "cock-head",
              "cocks",
              "CockSucker",
              "cock-sucker",
              "crap",
              "cum",
              "cunt",
              "cunts",
              "cuntz",
              "dick",
              "dild0",
              "dild0s",
              "dildo",
              "dildos",
              "dilld0",
              "dilld0s",
              "dominatricks",
              "dominatrics",
              "dominatrix",
              "dyke",
              "enema",
              "f u c k",
              "f u c k e r",
              "fag",
              "fag1t",
              "faget",
              "fagg1t",
              "faggit",
              "faggot",
              "fagg0t",
              "fagit",
              "fags",
              "fagz",
              "faig",
              "faigs",
              "fart",
              "flipping the bird",
              "fuck",
              "fucker",
              "fuckin",
              "fucking",
              "fucks",
              "Fudge Packer",
              "fuk",
              "Fukah",
              "Fuken",
              "fuker",
              "Fukin",
              "Fukk",
              "Fukkah",
              "Fukken",
              "Fukker",
              "Fukkin",
              "g00k",
              "God-damned",
              "h00r",
              "h0ar",
              "h0re",
              "hells",
              "hoar",
              "hoor",
              "hoore",
              "jackoff",
              "jap",
              "japs",
              "jerk-off",
              "jisim",
              "jiss",
              "jizm",
              "jizz",
              "knob",
              "knobs",
              "knobz",
              "kunt",
              "kunts",
              "kuntz",
              "Lezzian",
              "Lipshits",
              "Lipshitz",
              "masochist",
              "masokist",
              "massterbait",
              "masstrbait",
              "masstrbate",
              "masterbaiter",
              "masterbate",
              "masterbates",
              "Motha Fucker",
              "Motha Fuker",
              "Motha Fukkah",
              "Motha Fukker",
              "Mother Fucker",
              "Mother Fukah",
              "Mother Fuker",
              "Mother Fukkah",
              "Mother Fukker",
              "mother-fucker",
              "Mutha Fucker",
              "Mutha Fukah",
              "Mutha Fuker",
              "Mutha Fukkah",
              "Mutha Fukker",
              "n1gr",
              "nastt",
              "nigger;",
              "nigur;",
              "niiger;",
              "niigr;",
              "orafis",
              "orgasim;",
              "orgasm",
              "orgasum",
              "oriface",
              "orifice",
              "orifiss",
              "packi",
              "packie",
              "packy",
              "paki",
              "pakie",
              "paky",
              "pecker",
              "peeenus",
              "peeenusss",
              "peenus",
              "peinus",
              "pen1s",
              "penas",
              "penis",
              "penis-breath",
              "penus",
              "penuus",
              "Phuc",
              "Phuck",
              "Phuk",
              "Phuker",
              "Phukker",
              "polac",
              "polack",
              "polak",
              "Poonani",
              "pr1c",
              "pr1ck",
              "pr1k",
              "pusse",
              "pussee",
              "pussy",
              "puuke",
              "puuker",
              "queer",
              "queers",
              "queerz",
              "qweers",
              "qweerz",
              "qweir",
              "recktum",
              "rectum",
              "retard",
              "sadist",
              "scank",
              "schlong",
              "screwing",
              "semen",
              "sex",
              "sexy",
              "Sh!t",
              "sh1t",
              "sh1ter",
              "sh1ts",
              "sh1tter",
              "sh1tz",
              "shit",
              "shits",
              "shitter",
              "Shitty",
              "Shity",
              "shitz",
              "Shyt",
              "Shyte",
              "Shytty",
              "Shyty",
              "skanck",
              "skank",
              "skankee",
              "skankey",
              "skanks",
              "Skanky",
              "slag",
              "slut",
              "sluts",
              "Slutty",
              "slutz",
              "son-of-a-bitch",
              "tit",
              "turd",
              "va1jina",
              "vag1na",
              "vagiina",
              "vagina",
              "vaj1na",
              "vajina",
              "vullva",
              "vulva",
              "w0p",
              "wh00r",
              "wh0re",
              "whore",
              "xrated",
              "xxx",
              "b!+ch",
              "bitch",
              "blowjob",
              "clit",
              "arschloch",
              "fuck",
              "shit",
              "ass",
              "asshole",
              "b!tch",
              "b17ch",
              "b1tch",
              "bastard",
              "bi+ch",
              "boiolas",
              "buceta",
              "c0ck",
              "cawk",
              "chink",
              "cipa",
              "clits",
              "cock",
              "cum",
              "cunt",
              "dildo",
              "dirsa",
              "ejakulate",
              "fatass",
              "fcuk",
              "fuk",
              "fux0r",
              "hoer",
              "hore",
              "jism",
              "kawk",
              "l3itch",
              "l3i+ch",
              "lesbian",
              "masturbate",
              "masterbat*",
              "masterbat3",
              "motherfucker",
              "s.o.b.",
              "mofo",
              "nazi",
              "nigga",
              "nigger",
              "nutsack",
              "phuck",
              "pimpis",
              "pusse",
              "pussy",
              "scrotum",
              "sh!t",
              "shemale",
              "shi+",
              "sh!+",
              "slut",
              "smut",
              "teets",
              "tits",
              "boobs",
              "b00bs",
              "teez",
              "testical",
              "testicle",
              "titt",
              "w00se",
              "jackoff",
              "wank",
              "whoar",
              "whore",
              "*damn",
              "*dyke",
              "*fuck*",
              "*shit*",
              "@$$",
              "amcik",
              "andskota",
              "arse*",
              "assrammer",
              "ayir",
              "bi7ch",
              "bitch*",
              "bollock*",
              "breasts",
              "butt-pirate",
              "cabron",
              "cazzo",
              "chraa",
              "chuj",
              "Cock*",
              "cunt*",
              "d4mn",
              "daygo",
              "dego",
              "dick*",
              "dike*",
              "dupa",
              "dziwka",
              "ejackulate",
              "Ekrem*",
              "Ekto",
              "enculer",
              "faen",
              "fag*",
              "fanculo",
              "fanny",
              "feces",
              "feg",
              "Felcher",
              "ficken",
              "fitt*",
              "Flikker",
              "foreskin",
              "Fotze",
              "Fu(*",
              "fuk*",
              "futkretzn",
              "gook",
              "guiena",
              "h0r",
              "h4x0r",
              "hell",
              "helvete",
              "hoer*",
              "honkey",
              "Huevon",
              "hui",
              "injun",
              "jizz",
              "kanker*",
              "kike",
              "klootzak",
              "kraut",
              "knulle",
              "kuk",
              "kuksuger",
              "Kurac",
              "kurwa",
              "kusi*",
              "kyrpa*",
              "lesbo",
              "mamhoon",
              "masturbat*",
              "merd*",
              "mibun",
              "monkleigh",
              "mouliewop",
              "muie",
              "mulkku",
              "muschi",
              "nazis",
              "nepesaurio",
              "nigger*",
              "orospu",
              "paska*",
              "perse",
              "picka",
              "pierdol*",
              "pillu*",
              "pimmel",
              "piss*",
              "pizda",
              "poontsee",
              "poop",
              "porn",
              "p0rn",
              "pr0n",
              "preteen",
              "pula",
              "pule",
              "puta",
              "puto",
              "qahbeh",
              "queef*",
              "rautenberg",
              "schaffer",
              "scheiss*",
              "schlampe",
              "schmuck",
              "screw",
              "sh!t*",
              "sharmuta",
              "sharmute",
              "shipal",
              "shiz",
              "skribz",
              "skurwysyn",
              "sphencter",
              "spic",
              "spierdalaj",
              "splooge",
              "suka",
              "b00b*",
              "testicle*",
              "titt*",
              "twat",
              "vittu",
              "wank*",
              "wetback*",
              "wichser",
              "wop*",
              "yed",
              "zabourah",
              "4r5e",
              "5h1t",
              "5hit",
              "a55",
              "anal",
              "anus",
              "ar5e",
              "arrse",
              "arse",
              "ass",
              "ass-fucker",
              "asses",
              "assfucker",
              "assfukka",
              "asshole",
              "assholes",
              "asswhole",
              "a_s_s",
              "b!tch",
              "b00bs",
              "b17ch",
              "b1tch",
              "ballbag",
              "balls",
              "ballsack",
              "bastard",
              "beastial",
              "beastiality",
              "bellend",
              "bestial",
              "bestiality",
              "bi+ch",
              "biatch",
              "bitch",
              "bitcher",
              "bitchers",
              "bitches",
              "bitchin",
              "bitching",
              "bloody",
              "blow job",
              "blowjob",
              "blowjobs",
              "boiolas",
              "bollock",
              "bollok",
              "boner",
              "boob",
              "boobs",
              "booobs",
              "boooobs",
              "booooobs",
              "booooooobs",
              "breasts",
              "buceta",
              "bugger",
              "bum",
              "bunny fucker",
              "butt",
              "butthole",
              "buttmuch",
              "buttplug",
              "c0ck",
              "c0cksucker",
              "carpet muncher",
              "cawk",
              "chink",
              "cipa",
              "cl1t",
              "clit",
              "clitoris",
              "clits",
              "cnut",
              "cock",
              "cock-sucker",
              "cockface",
              "cockhead",
              "cockmunch",
              "cockmuncher",
              "cocks",
              "cocksuck",
              "cocksucked",
              "cocksucker",
              "cocksucking",
              "cocksucks",
              "cocksuka",
              "cocksukka",
              "cok",
              "cokmuncher",
              "coksucka",
              "coon",
              "cox",
              "crap",
              "cum",
              "cummer",
              "cumming",
              "cums",
              "cumshot",
              "cunilingus",
              "cunillingus",
              "cunnilingus",
              "cunt",
              "cuntlick",
              "cuntlicker",
              "cuntlicking",
              "cunts",
              "cyalis",
              "cyberfuc",
              "cyberfuck",
              "cyberfucked",
              "cyberfucker",
              "cyberfuckers",
              "cyberfucking",
              "d1ck",
              "damn",
              "dick",
              "dickhead",
              "dildo",
              "dildos",
              "dink",
              "dinks",
              "dirsa",
              "dlck",
              "dog-fucker",
              "doggin",
              "dogging",
              "donkeyribber",
              "doosh",
              "duche",
              "dyke",
              "ejaculate",
              "ejaculated",
              "ejaculates",
              "ejaculating",
              "ejaculatings",
              "ejaculation",
              "ejakulate",
              "f u c k",
              "f u c k e r",
              "f4nny",
              "fag",
              "fagging",
              "faggitt",
              "faggot",
              "faggs",
              "fagot",
              "fagots",
              "fags",
              "fanny",
              "fannyflaps",
              "fannyfucker",
              "fanyy",
              "fatass",
              "fcuk",
              "fcuker",
              "fcuking",
              "feck",
              "fecker",
              "felching",
              "fellate",
              "fellatio",
              "fingerfuck",
              "fingerfucked",
              "fingerfucker",
              "fingerfuckers",
              "fingerfucking",
              "fingerfucks",
              "fistfuck",
              "fistfucked",
              "fistfucker",
              "fistfuckers",
              "fistfucking",
              "fistfuckings",
              "fistfucks",
              "flange",
              "fook",
              "fooker",
              "fuck",
              "fucka",
              "fucked",
              "fucker",
              "fuckers",
              "fuckhead",
              "fuckheads",
              "fuckin",
              "fucking",
              "fuckings",
              "fuckingshitmotherfucker",
              "fuckme",
              "fucks",
              "fuckwhit",
              "fuckwit",
              "fudge packer",
              "fudgepacker",
              "fuk",
              "fuker",
              "fukker",
              "fukkin",
              "fuks",
              "fukwhit",
              "fukwit",
              "fux",
              "fux0r",
              "f_u_c_k",
              "gangbang",
              "gangbanged",
              "gangbangs",
              "gaylord",
              "gaysex",
              "goatse",
              "God",
              "god-dam",
              "god-damned",
              "goddamn",
              "goddamned",
              "hardcoresex",
              "hell",
              "heshe",
              "hoar",
              "hoare",
              "hoer",
              "homo",
              "hore",
              "horniest",
              "horny",
              "hotsex",
              "jack-off",
              "jackoff",
              "jap",
              "jerk-off",
              "jism",
              "jiz",
              "jizm",
              "jizz",
              "kawk",
              "knob",
              "knobead",
              "knobed",
              "knobend",
              "knobhead",
              "knobjocky",
              "knobjokey",
              "kock",
              "kondum",
              "kondums",
              "kum",
              "kummer",
              "kumming",
              "kums",
              "kunilingus",
              "l3i+ch",
              "l3itch",
              "labia",
              "lust",
              "lusting",
              "m0f0",
              "m0fo",
              "m45terbate",
              "ma5terb8",
              "ma5terbate",
              "masochist",
              "master-bate",
              "masterb8",
              "masterbat*",
              "masterbat3",
              "masterbate",
              "masterbation",
              "masterbations",
              "masturbate",
              "mo-fo",
              "mof0",
              "mofo",
              "mothafuck",
              "mothafucka",
              "mothafuckas",
              "mothafuckaz",
              "mothafucked",
              "mothafucker",
              "mothafuckers",
              "mothafuckin",
              "mothafucking",
              "mothafuckings",
              "mothafucks",
              "mother fucker",
              "motherfuck",
              "motherfucked",
              "motherfucker",
              "motherfuckers",
              "motherfuckin",
              "motherfucking",
              "motherfuckings",
              "motherfuckka",
              "motherfucks",
              "muff",
              "mutha",
              "muthafecker",
              "muthafuckker",
              "muther",
              "mutherfucker",
              "n1gga",
              "n1gger",
              "nazi",
              "nigg3r",
              "nigg4h",
              "nigga",
              "niggah",
              "niggas",
              "niggaz",
              "nigger",
              "niggers",
              "nob",
              "nob jokey",
              "nobhead",
              "nobjocky",
              "nobjokey",
              "numbnuts",
              "nutsack",
              "orgasim",
              "orgasims",
              "orgasm",
              "orgasms",
              "p0rn",
              "pawn",
              "pecker",
              "penis",
              "penisfucker",
              "phonesex",
              "phuck",
              "phuk",
              "phuked",
              "phuking",
              "phukked",
              "phukking",
              "phuks",
              "phuq",
              "pigfucker",
              "pimpis",
              "piss",
              "pissed",
              "pisser",
              "pissers",
              "pisses",
              "pissflaps",
              "pissin",
              "pissing",
              "pissoff",
              "poop",
              "porn",
              "porno",
              "pornography",
              "pornos",
              "prick",
              "pricks",
              "pron",
              "pube",
              "pusse",
              "pussi",
              "pussies",
              "pussy",
              "pussys",
              "rectum",
              "retard",
              "rimjaw",
              "rimming",
              "s hit",
              "s.o.b.",
              "sadist",
              "schlong",
              "screwing",
              "scroat",
              "scrote",
              "scrotum",
              "semen",
              "sex",
              "sh!+",
              "sh!t",
              "sh1t",
              "shag",
              "shagger",
              "shaggin",
              "shagging",
              "shemale",
              "shi+",
              "shit",
              "shitdick",
              "shite",
              "shited",
              "shitey",
              "shitfuck",
              "shitfull",
              "shithead",
              "shiting",
              "shitings",
              "shits",
              "shitted",
              "shitter",
              "shitters",
              "shitting",
              "shittings",
              "shitty",
              "skank",
              "slut",
              "sluts",
              "smegma",
              "smut",
              "snatch",
              "son-of-a-bitch",
              "spac",
              "spunk",
              "s_h_i_t",
              "t1tt1e5",
              "t1tties",
              "teets",
              "teez",
              "testical",
              "testicle",
              "tit",
              "titfuck",
              "tits",
              "titt",
              "tittie5",
              "tittiefucker",
              "titties",
              "tittyfuck",
              "tittywank",
              "titwank",
              "tosser",
              "turd",
              "tw4t",
              "twat",
              "twathead",
              "twatty",
              "twunt",
              "twunter",
              "v14gra",
              "v1gra",
              "vagina",
              "viagra",
              "vulva",
              "w00se",
              "wang",
              "wank",
              "wanker",
              "wanky",
              "whoar",
              "whore",
              "willies",
              "willy",
              "xrated",
              "xxx",
              "jew",
              "black",
              "baby",
              "child",
              "white",
              "porn",
              "pedo",
              "trump",
              "clinton",
              "hitler",
              "nazi",
              "gay",
              "pride",
              "sex",
              "pleasure",
              "touch",
              "poo",
              "kids",
              "rape",
              "white power",
              "nigga",
              "nig nog",
              "doggy",
              "rapist",
              "boner",
              "nigger",
              "nigg",
              "finger",
              "nogger",
              "nagger",
              "nig",
              "fag",
              "gai",
              "pole",
              "stripper",
              "penis",
              "vagina",
              "pussy",
              "nazi",
              "hitler",
              "stalin",
              "burn",
              "chamber",
              "cock",
              "peen",
              "dick",
              "spick",
              "nieger",
              "die",
              "satan",
              "n|ig",
              "nlg",
              "cunt",
              "c0ck",
              "fag",
              "lick",
              "condom",
              "anal",
              "shit",
              "phile",
              "little",
              "kids",
              "free KR",
              "tiny",
              "sidney",
              "ass",
              "kill",
              ".io",
              "(dot)",
              "[dot]",
              "mini",
              "whiore",
              "whore",
              "faggot",
              "github",
              "1337",
              "666",
              "satan",
              "senpa",
              "discord",
              "d1scord",
              "mistik",
              ".io",
              "senpa.io",
              "sidney",
              "sid",
              "senpaio",
              "vries",
              "asa"*/
                        ],
                        "exclude": [],
                        "placeHolder": "*",
                        "regex": {},
                        "replaceRegex": {}
                    };
                    let isProfane = false;
                    let convertedName = name.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
                    for (let word of langFilter.list) {
                        if (convertedName.indexOf(word) != -1) {
                            isProfane = true;
                            break;
                        }
                    }
                    if (name.length > 0 && !isProfane) {
                        noname = name;
                    }
                    return noname;
                }
            };
            window.toggleNight();
        },
        webgl_test: () => {
            return;
            let canvas = document.createElement("canvas");
            canvas.id = "WEBGL";
            canvas.width = canvas.height = 300;
            canvas.style = `
            position: relative;
            bottom: 70%;
            left: 70%;
            pointer-events: none;
            `;
            let fat = document.createElement("div");
            fat.id = "faku";
            fat.width = fat.height = 300;
            fat.style = `
            position: relative;
            bottom: 70%;
            left: 70%;
            pointer-events: none;
            font-size: 20px;
            `;
            fat.innerHTML = "Webgl Test Rendering";
            let gl = canvas.getContext("webgl");
            if (!gl) {
                alert("urbad");
                return;
            }
            document.body.append(canvas);
            document.body.append(fat);
            log(gl);
            gl.clearColor(0, 0, 0, 0.2);
            gl.clear(gl.COLOR_BUFFER_BIT);
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            function render(vs, fs, vertice, type) {
                let vShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vShader, vs);
                gl.compileShader(vShader);
                gl.getShaderParameter(vShader, gl.COMPILE_STATUS);
                let fShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fShader, fs);
                gl.compileShader(fShader);
                gl.getShaderParameter(fShader, gl.COMPILE_STATUS);
                let program = gl.createProgram();
                gl.attachShader(program, vShader);
                gl.attachShader(program, fShader);
                gl.linkProgram(program);
                gl.getProgramParameter(program, gl.LINK_STATUS);
                gl.useProgram(program);
                let vertex = gl.getAttribLocation(program, "vertex");
                gl.enableVertexAttribArray(vertex);
                gl.vertexAttribPointer(vertex, 2, gl.FLOAT, false, 0, 0);
                let vertices = vertice.length / 2;
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertice), gl.DYNAMIC_DRAW);
                gl.drawArrays(type, 0, vertices);
            }
            function hexToRgb(hex) {
                return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
            }
            function getRgb(r, g, b) {
                return [r / 255, g / 255, b / 255].join(", ");
            }
            let max = 50;
            for (let i = 0; i < max; i++) {
                let radian = (Math.PI * (i / (max / 2)));
                render(`
                precision mediump float;
                attribute vec2 vertex;
                void main(void) {
                    gl_Position = vec4(vertex, 0, 1);
                }
                `, `
                precision mediump float;
                void main(void) {
                    gl_FragColor = vec4(${getRgb(...hexToRgb("#cc5151"))}, 1);
                }
                `, [
                    // moveto, lineto
                    0 + (Math.cos(radian) * 0.5), 0 + (Math.sin(radian) * 0.5),
                    0, 0,
                ], gl.LINE_LOOP);
            }
        }
    };

    if (codes) {
        for (let code in codes) {
            let func = codes[code];
            typeof func === "function" && func();
        }
        window.enableHack = function() {
            if (!useHack) {
                useHack = true;
                codes.main();
            }
        };
    }
}(1);

