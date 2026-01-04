// ==UserScript==
// @name         Frozen Client ReCode
// @version      1.5
// @description  hi
// @author       Dayte
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @icon         https://i.imgur.com/Su2FG4a.jpg
// @namespace https://greasyfork.org/users/843325
// @downloadURL https://update.greasyfork.org/scripts/490873/Frozen%20Client%20ReCode.user.js
// @updateURL https://update.greasyfork.org/scripts/490873/Frozen%20Client%20ReCode.meta.js
// ==/UserScript==
!function() {
    "use strict";
    var e = {
        d: function(t, o) {
            for (var a in o) e.o(o, a) && !e.o(t, a) && Object.defineProperty(t, a, {
                enumerable: !0,
                get: o[a]
            });
        },
        o: function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
        }
    };
    e.d({}, {
        kB: function() {
            return ge;
        },
        qX: function() {
            return it;
        },
        nG: function() {
            return lt;
        },
        uU: function() {
            return at;
        },
        J$: function() {
            return ot;
        },
        u6: function() {
            return gt;
        },
        Yf: function() {
            return pt;
        },
        iM: function() {
            return J;
        },
        uo: function() {
            return We;
        },
        m1: function() {
            return Ie;
        },
        q8: function() {
            return tt;
        },
        HX: function() {
            return G;
        },
        Gn: function() {
            return Re;
        },
        De: function() {
            return F;
        },
        Fk: function() {
            return q;
        },
        aZ: function() {
            return ze;
        }
    });
    var t = JSON.parse('{"moofoll":true,"menuKey":"Escape","menuScale":1,"menuOpacity":1,"storeHeight":null,"storeScale":1,"storeKey":null,"notificationVolume":1,"notificationSound":0,"instaKillKey":"r","instaKillAim":false,"instaKillScroll":false,"instaKillType":"normal","healAssistHealAmmount":1,"healAssistHealSpeed":75,"healAssistHealLimit":99,"placeMacroGlobalSpeed":100,"placeMacroFoodSpeed":100,"placeMacroSpikeSpeed":100,"placeMacroTrapSpeed":100,"placeMacroWallSpeed":100,"placeMacroTpSpeed":100,"placeMacroMillSpeed":100,"placeMacroSpawnpadSpeed":100,"placeMacroDoubleMillSpeed":100,"placeMacroDoubleTpSpeed":100,"placeMacroFoodKey":null,"placeMacroSpikeKey":null,"placeMacroTrapKey":null,"placeMacroWallKey":null,"placeMacroTpKey":null,"placeMacroMillKey":null,"placeMacroSpawnpadKey":null,"placeMacroDoubleMillKey":null,"placeMacroDoubleTpKey":null,"rebindMacroFoodKey":null,"rebindMacroSpikeKey":null,"rebindMacroTrapKey":null,"rebindMacroWallKey":null,"rebindMacroTpKey":null,"rebindMacroMillKey":null,"rebindMacroSpawnpadKey":null,"scrollSmooth":null,"scrollSoldierKey":null,"scrollBullKey":null,"scrollTurretKey":null,"scrollTankKey":null,"scrollBiomeKey":null,"macroSoldierKey":null,"macroBullKey":null,"macroTurretKey":null,"macroTankKey":null,"macroBiomeKey":null,"macroMonkeyKey":null,"macroShadowWingsKey":null,"macroBloodWingsKey":null,"macroCXWingsKey":null,"macroAngelWingsKey":null,"mouseMacroLeft":null,"mouseMacroRight":null,"killChat":"${kills}","darkStrength":10,"fastMode":false,"resourcesScale":1,"healthScale":1,"shameScale":1,"keystrokesScale":1,"debuggerScale":1,"mouseScale":1,"mouseTrackerScale":1,"fpsScale":1,"cpsScale":1,"osScale":1,"autoClickerSpeed":100,"modulesListScale":1,"selectedTheme":null,"texturePack":""}'), o = JSON.parse('{"Y":{"MQ":"6","XG":"d","jX":"G","UG":"D","j4":"K","ZA":"c"},"l":{"Qz":"io-init","jB":"C","Nd":"O","zC":"P","nF":"a","wE":"H","ah":"R","A9":"Q"}}');
    class a {
        static version="2.8";
        static loadConfigFromFile(e, t) {
            GM_xmlhttpRequest({
                method: "GET",
                url: e,
                onload: function(e) {
                    if (200 == e.status) try {
                        const o = JSON.parse(e.responseText);
                        t(o);
                    } catch (e) {
                        console.error("Error parsing config file:", e);
                    } else console.error("Error loading config file. Status:", e.status);
                },
                onerror: function(e) {
                    console.error("Error loading config file:", e);
                }
            });
        }
        static getCurrentConfig() {
            const e = {};
            for (const o in t) if (t.hasOwnProperty(o) && "userKills" !== o && "userDeaths" !== o && "userPlayTime" !== o) {
                const t = localStorage.getItem(o);
                if (null != t) if ("true" === t || "false" === t) e[o] = "true" === t; else if (isNaN(t)) try {
                    e[o] = JSON.parse(t);
                } catch (a) {
                    e[o] = t;
                } else e[o] = parseFloat(t);
            }
            const o = JSON.stringify(e, null, 4), a = document.createElement("textarea");
            return a.value = o, document.body.appendChild(a), a.select(), document.execCommand("copy"), 
            document.body.removeChild(a), o;
        }
        static setLocalStorageItems(e) {
            for (const o in t) t.hasOwnProperty(o) && (2 !== e || "userKills" !== o && "userDeaths" !== o && "userPlayTime" !== o) && null === localStorage.getItem(o) && localStorage.setItem(o, t[o]);
        }
        static setLocalStorageItemsFromConfig(e) {
            var o = {
                ...t,
                ...e
            };
            for (const e in o) if (o.hasOwnProperty(e)) {
                let t = o[e];
                "boolean" == typeof t ? t = t ? "true" : "false" : "number" == typeof t ? t = String(t) : "string" != typeof t && (t = JSON.stringify(t)), 
                localStorage.setItem(e, t);
            }
        }
        static makeDraggable(e) {
            const t = document.getElementById(e);
            let o, a;
            const n = JSON.parse(localStorage.getItem(e + "Position"));
            n ? (t.style.left = n.left + "px", t.style.top = n.top + "px") : (t.style.left = "0px", 
            t.style.top = "0px"), t.addEventListener("mousedown", (function(n) {
                const l = t.getBoundingClientRect();
                function r(e) {
                    const n = e.clientX - o, l = e.clientY - a;
                    t.style.left = n + "px", t.style.top = l + "px";
                }
                o = n.clientX - l.left, a = n.clientY - l.top, document.addEventListener("mousemove", r), 
                document.addEventListener("mouseup", (function o() {
                    document.removeEventListener("mousemove", r), document.removeEventListener("mouseup", o);
                    const a = {
                        left: parseInt(t.style.left),
                        top: parseInt(t.style.top)
                    };
                    localStorage.setItem(e + "Position", JSON.stringify(a));
                }));
            }));
        }
        static replaceStringValue(e, t) {
            return e.replace(/\${(\w+)}/g, ((e, o) => void 0 !== t[o] ? t[o] : e));
        }
        static updateMouseTracker(e) {
            var t = document.getElementById("touch-controls-fullscreen").getBoundingClientRect(), o = t.height, a = t.width, n = Math.min(80, Math.max(20, 100 * e.clientX / a)), l = Math.min(80, Math.max(20, 100 * e.clientY / o));
            document.getElementById("mouseTracker").style.transition = "", document.getElementById("mouseTracker").style.top = l + "%", 
            document.getElementById("mouseTracker").style.left = n + "%";
        }
        static resetMouseTracker() {
            document.getElementById("mouseTracker").style.transition = "0.5s", document.getElementById("mouseTracker").style.top = "50%", 
            document.getElementById("mouseTracker").style.left = "50%";
        }
        static toUpperCaseFirstLetter(e) {
            return e.charAt(0).toUpperCase() + e.slice(1);
        }
        static msToCps(e) {
            return (1e3 / e).toFixed(1);
        }
        static formatNumber(e) {
            if ((e = e.toString().replace(/[^0-9.]/g, "")) < 1e3) return e;
            const t = [ {
                value: 1e3,
                suffix: "K"
            }, {
                value: 1e6,
                suffix: "M"
            } ];
            let o;
            for (o = t.length - 1; o > 0 && !(e >= t[o].value); o--) ;
            return (e / t[o].value).toFixed(1).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + t[o].suffix;
        }
        static formatTime(e) {
            const t = Math.floor(e / 86400), o = Math.floor(e % 86400 / 3600), a = Math.floor(e % 3600 / 60);
            return 1 === t ? "1 Day" : t > 1 ? t + " Days" : 1 === o ? "1 Hour" : o > 1 ? o + " Hours" : 1 === a ? "1 Minute" : a > 1 ? a + " Minutes" : "< minute";
        }
        static storeEquip(e, t, a = !1) {
            a ? 0 == t ? (window.send([ o.Y.ZA, [ 0, q.get(G).skinIndex == e ? 0 : e, t ] ]), 
            console.log(q.get(G).skinIndex)) : 1 == t && (window.send([ o.Y.ZA, [ 0, q.get(G).tailIndex == e ? 0 : e, t ] ]), 
            console.log(q.get(G).tailIndex)) : a || window.send([ o.Y.ZA, [ 0, e, t ] ]);
        }
        static scroll(e) {
            ge.scrollTop = e;
        }
        static updateArrayListSuffix() {
            document.getElementById("mouseMacroSuffix").innerText = (a.toUpperCaseFirstLetter(localStorage.getItem("mouseMacroLeft")) || "-") + ", " + (a.toUpperCaseFirstLetter(localStorage.getItem("mouseMacroRight")) || "-"), 
            document.getElementById("autoScrollSuffix").innerText = 1 == localStorage.getItem("scrollSmooth") ? "Smooth" : "Normal", 
            document.getElementById("autoClickerSuffix").innerText = a.msToCps(localStorage.getItem("autoClickerSpeed")) + " CPS" || 0, 
            document.getElementById("autoHealSuffix").innerText = (1 == parseInt(localStorage.getItem("healAssistHealAmmount")) ? "Single" : 2 == parseInt(localStorage.getItem("healAssistHealAmmount")) ? "Double" : "Triple") || "-", 
            document.getElementById("instaKillSuffix").innerText = a.toUpperCaseFirstLetter("normal" === localStorage.getItem("instaKillType") || "reverse" === localStorage.getItem("instaKillType") || "onetick" === localStorage.getItem("instaKillType") || "spike" === localStorage.getItem("instaKillType") ? localStorage.getItem("instaKillType") : "normal") || "-";
        }
        static updateCps(e) {
            "block" == document.getElementById("cpsDisplay").style.display && (0 != e.button && 1 != e.button && 2 != e.button && 3 != e.button && 4 != e.button || (lt++, 
            document.getElementById("cpsText").innerText = lt, setTimeout((() => {
                lt--, document.getElementById("cpsText").innerText = lt;
            }), 1e3)));
        }
        static addCommand(e) {
            document.getElementById("terminalOutput").innerHTML += e + "<br>", document.getElementById("terminalOutput").scrollTop = document.getElementById("terminalOutput").scrollHeight;
        }
        static updateProfileInfo(e) {
            switch (!0) {
              case e >= 750:
                $(".fa-snowflake").css("color", "#E5E4E2");
                break;

              case e >= 600:
                $(".fa-snowflake").css("color", "#E0113C");
                break;

              case e >= 500:
                $(".fa-snowflake").css("color", "#50C878");
                break;

              case e >= 350:
                $(".fa-snowflake").css("color", "#B9F2FF");
                break;

              case e >= 200:
                $(".fa-snowflake").css("color", "gold");
                break;

              case e >= 100:
                $(".fa-snowflake").css("color", "silver");
                break;

              case e >= 50:
                $(".fa-snowflake").css("color", "#CD7F32");
                break;

              default:
                $(".fa-snowflake").css("color", "gray");
            }
            "block" == document.getElementById("mainMenu").style.display && (document.getElementById("userKills").innerText = a.formatNumber(localStorage.getItem("userKills")), 
            document.getElementById("userDeaths").innerText = a.formatNumber(localStorage.getItem("userDeaths")), 
            document.getElementById("userKDR").innerText = We, document.getElementById("userPlayTime").innerText = a.formatTime(Re), 
            localStorage.getItem("userKills") !== ze && (ze = localStorage.getItem("userKills"), 
            a.updateRank(parseInt(ze))));
        }
        static updateFps() {
            let e = Date.now(), t = e - tt;
            "block" === document.getElementById("fpsDisplay").style.display && (t < 700 ? ++ot : (at = Math.round(ot / (t / 1e3)), 
            ot = 0, tt = e, document.getElementById("fpsText").innerText = at)), requestAnimationFrame(a.updateFps);
        }
        static detectOS() {
            const e = navigator.platform.toLowerCase(), t = navigator.userAgent.toLowerCase();
            let o = "";
            o = e.includes("win") ? "Windows" : e.includes("mac") ? "MacOS" : e.includes("linux") ? t.includes("cros") ? "ChromeOS" : "Linux" : e.includes("android") ? "Android" : e.includes("iphone") || e.includes("ipad") || e.includes("ipod") ? "iOS" : "-", 
            document.getElementById("osText").innerText = o;
        }
        static observeResourceCounter(e, t) {
            new MutationObserver((o => {
                o.forEach((o => {
                    o.target.id === e && "block" === document.getElementById("resourcesHolder").style.display && (t.innerText = a.formatNumber(document.getElementById(e).innerText));
                }));
            })).observe(document, {
                subtree: !0,
                childList: !0
            });
        }
        static killCounterChange(e) {
            if (e > Ie) {
                let t = a.replaceStringValue(localStorage.getItem("killChat"), {
                    kills: e
                });
                Ie = e;
                let n = localStorage.getItem("userKills"), l = parseInt(n);
                l++, localStorage.setItem("userKills", l), F[3] && window.send([ o.Y.MQ, [ t ] ]);
            }
        }
        static observeKillCounter() {
            new MutationObserver((e => {
                e.forEach((e => {
                    if ("killCounter" === e.target.id) {
                        const t = parseInt(e.target.innerText, 10) || 0;
                        a.killCounterChange(t);
                    }
                }));
            })).observe(document, {
                subtree: !0,
                childList: !0
            });
        }
        static adjustArrayListElements(e) {
            "left" === e ? ($("#arrayListHolder").css("transform", "scale(" + localStorage.getItem("modulesListScale") + "," + localStorage.getItem("modulesListScale") + ")"), 
            $(".arrayListElement").css("transform", "scale(1, 1)"), $(".arrayListElement").css("border-left", "solid 3.25px var(--primary-color)"), 
            $(".arrayListElement").css("border-right", "solid 0px var(--primary-color)")) : "right" === e && ($("#arrayListHolder").css("transform", "scale(-" + localStorage.getItem("modulesListScale") + "," + localStorage.getItem("modulesListScale") + ")"), 
            $(".arrayListElement").css("transform", "scale(-1, 1)"), $(".arrayListElement").css("border-right", "solid 3.25px var(--primary-color)"), 
            $(".arrayListElement").css("border-left", "solid 0px var(--primary-color)"));
        }
    }
    class n {
        static cam={
            x: 0,
            y: 0
        };
        static delta;
        static xOffset;
        static yOffset;
        static canvas=document.getElementById("gameCanvas").getContext("2d");
        static now;
        static lastUpdate;
        static updateCameraPosition() {
            if (this.xOffset = this.cam.x - 960, this.yOffset = this.cam.y - 540, q.get(G)) {
                const e = q.get(G), t = pt(this.cam.x, this.cam.y, e.x, e.y), o = gt(e.x, e.y, this.cam.x, this.cam.y), a = Math.min(.01 * t * this.delta, t);
                t > .05 ? (this.cam.x += a * Math.cos(o), this.cam.y += a * Math.sin(o)) : (this.cam.x = e.x, 
                this.cam.y = e.y);
            }
        }
        static render() {
            if (it && J) for (let e = 0; e < it.length; e++) this.drawCircle(it[e][1], this.xOffset, it[e][2], this.yOffset, 10, "red");
        }
        static drawCircle(e, t, o, a, n, l) {
            this.canvas.beginPath(), this.canvas.arc(e - t, o - a, n, 0, 2 * Math.PI), this.canvas.fillStyle = l, 
            this.canvas.fill(), this.canvas.closePath();
        }
        static doUpdate() {
            this.now = Date.now(), this.delta = this.now - this.lastUpdate, this.lastUpdate = this.now, 
            this.updateCameraPosition(), this.render(), window.requestAnimationFrame(this.doUpdate.bind(this));
        }
    }
    const l = window.$;
    async function r() {
        const e = i[0].length;
        for (let t = 0; t < e; t++) await s(i[0][t], i[1][t]), Be = (t + 1) / e * 100, qe.innerText = `${Be.toFixed(2)}%`;
        qe.innerText = "Finished", l("#texturesProgress").fadeToggle(300);
    }
    function s(e, t) {
        return new Promise(((o, a) => {
            var n = document.querySelector("#gameCanvas").getContext("2d"), l = n.drawImage, r = new Image;
            r.onload = function() {
                n.drawImage = function(t, o, a, s, i) {
                    t.src === e ? l.call(n, r, o, a, s, i) : l.apply(n, arguments);
                }, n.drawImage(r, 0, 0), o();
            }, r.onerror = o, r.src = t;
        }));
    }
    var i = [ [], [] ];
    !function(e) {
        if (e.endsWith(".json")) {
            const o = "sandbox.moomoo.io" === window.location.hostname ? e.replace(".json", "-sandbox.json") : e;
            (t = o, fetch(t).then((e => e.json())).then((e => {
                e.forEach((e => {
                    i[0].push(e.originalSrc), i[1].push(e.replaceToSrc);
                }));
            })).catch((e => console.error("Error fetching JSON:", e)))).then(r).catch((e => console.error("Error:", e)));
        }
        var t;
    }(localStorage.getItem("texturePack") || ""), Array.from(document.getElementsByClassName("adsbygoogle")).forEach((e => e.parentElement.outerHTML.includes("body") ? e.remove() : e.parentElement.remove())), 
    l("#touch-controls-right, #touch-controls-left, #adCard, #partyButton, #joinPartyButton, #linksContainer2").remove(), 
    a.setLocalStorageItems(1);
    let c = document.createElement("div");
    c.id = "alsoTry", c.innerHTML = '<div class="also-try">Also try <font style="color: red; font-size: 20px;">Pyro</font></div>';
    let d = document.createElement("div");
    d.id = "texturesProgress", d.innerHTML = '\n<svg class="circleTexture" width="90" height="90">\n    <circle class="circleTexture-bg" r="32" cx="45" cy="45"></circle>\n    <circle class="circleTexture-bar" r="32" cx="45" cy="45" stroke-dasharray="201.06" stroke-dashoffset="0"></circle>\n</svg>\n<div class="dataName">Textures</div>\n<div class="dataName" id="textureData" style="font-size: 8px; margin-top: 10px;"></div\n';
    let m = document.createElement("div");
    m.id = "rankCardHolder", m.innerHTML = '\n<div class="rankTitle">Profile Info</div>\n<div id="userMainHolder">\n    <div id="userHolder">\n        <div class="userTitle">Kills</div>\n        <div id="userKills">-</div>\n    </div>\n    <div id="userHolder">\n        <div class="userTitle">Deaths</div>\n        <div id="userDeaths">-</div>\n    </div>\n    <div id="userHolder">\n        <div class="userTitle">KDR</div>\n        <div id="userKDR">-</div>\n    </div>\n    <div id="userHolder">\n        <div class="userTitle">Play Time</div>\n        <div id="userPlayTime">-</div>\n    </div>\n    <div id="userHolder" style="height: 55px; left: 70px; position: relative;">\n        <div class="userTitle">Rank</div>\n        <div id="rankHolder"><i class="fa-regular fa-snowflake"></i></div>\n    </div>\n</div>\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />\n';
    let p = document.createElement("div");
    p.id = "frozenClientInfoHolder", p.innerHTML = `\n<div class="infoHolder">Frozen Client ReCode Helper v${a.version}</div><br>\n<div class="infoHolder">Frozen Client ReCode v${GM_info.script.version}</div><br>\n<div class="infoHolder">Made by: Dayte</div><br>\n`;
    let g = document.createElement("div");
    g.id = "mouseTrackerHolder", g.innerHTML = '<div id="mouseTracker"></div>';
    let u = document.createElement("div");
    u.id = "OSDisplayHolder", u.innerHTML = 'OS <span id="osText" style="color: white;">-</span>';
    let y = document.createElement("div");
    y.id = "notificationHolder";
    let b = document.createElement("div");
    b.id = "fpsDisplay", b.innerHTML = 'FPS <span id="fpsText" style="color: white;">-</span>';
    let h = document.createElement("div");
    h.id = "cpsDisplay", h.innerHTML = 'CPS <span id="cpsText" style="color: white;">-</span>';
    let f = document.createElement("div");
    f.id = "debugger", f.innerHTML = '<div class="debuggerTitle">Debugger</div><div class="debuggerOutput" id="debuggerOutput"></div>';
    let k = document.createElement("div");
    k.id = "arrayListHolder", k.innerHTML = '\n<div class="arrayList" id="arrayList">\n    <div class="arrayListElement" id="arrayListElement1">Mouse Macro [<font class="arrayListElementSuffix" id="mouseMacroSuffix"></font>]</div><br id="br1" class="lineBreaker">\n    <div class="arrayListElement" id="arrayListElement2">Auto Scroll [<font class="arrayListElementSuffix" id="autoScrollSuffix"></font>]</div><br id="br2" class="lineBreaker">\n    <div class="arrayListElement" id="arrayListElement3">Auto Clicker [<font class="arrayListElementSuffix" id="autoClickerSuffix"></font>]</div><br id="br3" class="lineBreaker">\n    <div class="arrayListElement" id="arrayListElement4">Auto Heal [<font class="arrayListElementSuffix" id="autoHealSuffix"></font>]</div><br id="br4" class="lineBreaker">\n    <div class="arrayListElement" id="arrayListElement5">Insta Kill [<font class="arrayListElementSuffix" id="instaKillSuffix">Normal</font>]</div><br id="br5" class="lineBreaker">\n    <div class="arrayListElement" id="arrayListElement10">Anti Cheat</div><br id="br10" class="lineBreaker">\n    <div class="arrayListElement" id="arrayListElement6">Place Macro</div><br id="br6" class="lineBreaker">\n    <div class="arrayListElement" id="arrayListElement7">Store Macro</div><br id="br7" class="lineBreaker">\n    <div class="arrayListElement" id="arrayListElement8">Kill Chat</div><br id="br8" class="lineBreaker">\n    <div class="arrayListElement" id="arrayListElement9">Rebinds</div><br id="br9" class="lineBreaker">\n</div>\n';
    let S = document.createElement("div");
    S.id = "keystrokes", S.innerHTML = '\n<div id="keyw" class="keys">\n    <font id="keytext">W</font>\n</div>\n<div id="keya" class="keys">\n    <font id="keytext">A</font>\n</div>\n<div id="keys" class="keys">\n    <font id="keytext">S</font>\n</div>\n<div id="keyd" class="keys">\n    <font id="keytext">D</font>\n</div>\n<div id="keyspace" class="keys">\n    <font id="keytext">Space</font>\n</div>\n';
    let w = document.createElement("div");
    w.id = "resourcesHolder", w.innerHTML = '\n<div class="resourcesTitle">Resources info</div>\n<div class="resources">\n    <div class="iconHolder">\n        <img class="resourcesIcon" src="https://sandbox.moomoo.io/img/resources/food_ico.png">\n        <div id="foodText" class="resourcesText">-</div>\n    </div>\n    <div class="iconHolder">\n        <img class="resourcesIcon" src="https://sandbox.moomoo.io/img/resources/wood_ico.png">\n        <div id="woodText" class="resourcesText">-</div>\n    </div>\n    <div class="iconHolder">\n        <img class="resourcesIcon" src="https://sandbox.moomoo.io/img/resources/stone_ico.png">\n        <div id="stoneText" class="resourcesText">-</div>\n    </div>\n    <div class="iconHolder">\n        <img class="resourcesIcon" src="https://sandbox.moomoo.io/img/resources/gold_ico.png">\n        <div id="goldText" class="resourcesText">-</div>\n    </div>\n</div>\n';
    let x = document.createElement("div");
    x.id = "healthInfo", x.innerHTML = '\n<svg class="circleHealth" width="90" height="90">\n    <circle class="circleHealth-bg" r="32" cx="45" cy="45"></circle>\n    <circle class="circleHealth-bar" r="32" cx="45" cy="45" stroke-dasharray="201.06" stroke-dashoffset="0"></circle>\n</svg>\n<div class="dataName">Health</div>\n<div class="dataName" id="healthData" style="font-size: 8px; margin-top: 10px;">0/100</div>\n';
    let I = document.createElement("div");
    I.id = "shameInfo", I.innerHTML = '\n<svg class="circleShame" width="90" height="90">\n    <circle class="circleShame-bg" r="32" cx="45" cy="45"></circle>\n    <circle class="circleShame-bar" r="32" cx="45" cy="45" stroke-dasharray="201.06" stroke-dashoffset="0"></circle>\n</svg>\n<div class="dataName">Shame</div>\n<div class="dataName" id="shameData" style="font-size: 8px; margin-top: 10px;">0/8</div>\n';
    let v = document.createElement("div");
    v.id = "dark";
    let C = document.createElement("div");
    C.id = "menu", C.innerHTML = `\n<div class="sections">\n    <div class="logo">Frozen<font class="logo external">${GM_info.script.version}</font></div>\n    <div class="sectionsHolder">\n        <div class="sectionTab" id="sectionTab1" style="width: 75px;"><i class="fa-regular fa-crosshairs"></i>Combat</div>\n        <div class="sectionTab" id="sectionTab2" style="width: 65px;"><i class="fa-regular fa-user"></i>Player</div>\n        <div class="sectionTab" id="sectionTab3" style="width: 70px;"><i class="fa-regular fa-eye"></i>Render</div>\n        <div class="sectionTab" id="sectionTab4" style="width: 68px;"><i class="fa-regular fa-folder-closed"></i>Config</div>\n        <div class="sectionTab" id="sectionTab5" style="width: 72px;"><i class="fa-regular fa-magnifying-glass"></i>Themes</div>\n    </div>\n</div>\n<div class="functional">\n    <div class="menuTab" id="combat">\n        <div class="toggleTab">Place Macro<button class="toggleButton" id="combat1">Enable</button></div>\n        <div class="toggleTab">Store Macro<button class="toggleButton" id="combat2">Enable</button></div>\n        <div class="toggleTab">Mouse Macro<button class="toggleButton" id="combat3">Enable</button></div>\n        <div class="toggleTab">Insta Kill<button class="toggleButton" id="combat4">Enable</button></div>\n        <div class="toggleTab">Auto Clicker<button class="toggleButton" id="combat5">Enable</button></div>\n    </div>\n    <div class="menuTab" id="player">\n        <div class="toggleTab">Auto Scroll<button class="toggleButton" id="player1">Enable</button></div>\n        <div class="toggleTab">Auto Heal<button class="toggleButton" id="player2">Enable</button></div>\n        <div class="toggleTab">Rebinds<button class="toggleButton" id="player3">Enable</button></div>\n        <div class="toggleTab">Kill Chat<button class="toggleButton" id="player4">Enable</button></div>\n        <div class="toggleTab">AntiCheat<button class="toggleButton" id="player5">Enable</button></div>\n    </div>\n    <div class="menuTab" id="render">\n        <div class="toggleTab">GameUI<button class="toggleButton" id="render1">Disable</button></div>\n        <div class="toggleTab">Store Button<button class="toggleButton" id="render2">Disable</button></div>\n        <div class="toggleTab">Chat Button<button class="toggleButton" id="render3">Disable</button></div>\n        <div class="toggleTab">Clan Button<button class="toggleButton" id="render4">Disable</button></div>\n        <div class="toggleTab">Leaderboard<button class="toggleButton" id="render5">Disable</button></div>\n        <div class="toggleTab">Kill Score<button class="toggleButton" id="render6">Disable</button></div>\n        <div class="toggleTab">Gold Score<button class="toggleButton" id="render7">Disable</button></div>\n        <div class="toggleTab">Food Score<button class="toggleButton" id="render8">Disable</button></div>\n        <div class="toggleTab">Wood Score<button class="toggleButton" id="render9">Disable</button></div>\n        <div class="toggleTab">Stone Score<button class="toggleButton" id="render10">Disable</button></div>\n        <div class="toggleTab">Mini-Map<button class="toggleButton" id="render11">Disable</button></div>\n        <div class="toggleTab">Level Text<button class="toggleButton" id="render12">Disable</button></div>\n        <div class="toggleTab">Level Progress<button class="toggleButton" id="render13">Disable</button></div>\n        <div class="toggleTab">Inventory Slots<button class="toggleButton" id="render14">Disable</button></div>\n        <div class="toggleTab">Notifications<button class="toggleButton" id="render15">Disable</button></div>\n        <div class="toggleTab">Health Info<button class="toggleButton" id="render16">Enable</button></div>\n        <div class="toggleTab">Shame Info<button class="toggleButton" id="render17">Enable</button></div>\n        <div class="toggleTab">Resources Info<button class="toggleButton" id="render18">Enable</button></div>\n        <div class="toggleTab">Keystrokes<button class="toggleButton" id="render19">Enable</button></div>\n        <div class="toggleTab">Dark Mode<button class="toggleButton" id="render20">Enable</button></div>\n        <div class="toggleTab">FPS Display<button class="toggleButton" id="render21">Enable</button></div>\n        <div class="toggleTab">CPS Display<button class="toggleButton" id="render22">Enable</button></div>\n        <div class="toggleTab">Mouse Tracker<button class="toggleButton" id="render23">Enable</button></div>\n        <div class="toggleTab">Debugger<button class="toggleButton" id="render24">Enable</button></div>\n        <div class="toggleTab">Modules List<button class="toggleButton" id="render25">Enable</button></div>\n        <div class="toggleTab">OS Display<button class="toggleButton" id="render26">Enable</button></div>\n    </div>\n    <div class="menuTab" id="config">\n        <div class="terminalTab">\n            <div class="terminalOutput" id="terminalOutput"></div>\n            <input type="input" maxlength="110" class="terminalInput" id="terminalInput" autocomplete="off" placeholder="Press 'Enter' or click here to use input" spellcheck="false"></input>\n            <span id="predict"></span>\n        </div>\n    </div>\n    <div class="menuTab" id="themes">\n        <div class="theme" id="theme1">Electric Blue</div>\n        <div class="theme" id="theme2">Hot Pink</div>\n        <div class="theme" id="theme3">Fresh Green</div>\n        <div class="theme" id="theme4">Royal Blue</div>\n        <div class="theme" id="theme5">Fiery Red</div>\n        <div class="theme" id="theme6">Spring Green</div>\n        <div class="theme" id="theme7">Sky Blue</div>\n        <div class="theme" id="theme8">Moderate purple</div>\n        <div class="theme" id="theme9">Bright Yellow</div>\n        <div class="theme" id="theme10">Midnight Blue</div>\n        <div class="theme" id="theme11">Violet Purple</div>\n        <div class="theme" id="theme12">Halloween</div>\n        <div class="theme" id="theme13">Gray Cloud</div>\n        <div class="theme" id="theme14">Lavender Pink</div>\n        <div class="theme" id="theme15">Coral Pink</div>\n    </div>\n</div>\n<link href="https://fonts.googleapis.com/css?family=ADLaM Display" rel="stylesheet">\n<link href="https://cdn.jsdelivr.net/gh/eliyantosarage/font-awesome-pro@main/fontawesome-pro-6.5.1-web/css/all.min.css" rel="stylesheet">\n`;
    let M = document.createElement("style");
    M.appendChild(document.createTextNode('\n:root {\n    --primary-color: #7289DA;\n}\n#menu {\n    position: absolute;\n    display: none;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto;\n    width: 600px;\n    height: 450px;\n    box-shadow: 0 0 20px #00000080;\n    border-radius: 12px;\n    transition: transform 0.4s;\n}\n#notificationHolder {\n    position: absolute;\n    width: 160px;\n    height: auto;\n    min-height: 160px;\n    top: 1%;\n    left: 0.5%;\n    display: flex;\n    align-items: center;\n    flex-direction: column;\n}\n#notificationHolder:hover {\n    background: #ffffff20;\n}\n#notificationTab {\n    position: relative;\n    display: inline-block;\n    width: auto;\n    height: 40px;\n    background: #1d2028;\n    top: 1%;\n    left: 1%;\n    color: white;\n    border-radius: 10px;\n    margin-top: 10px;\n    padding-right: 70px;\n    transition: all 0.5s;\n    font-family: "ADLaM Display";\n    transform: translateX(-200px);\n}\n#notificationTab::after {\n    content: \'\';\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 0; //100%\n    height: 5px;\n    background: var(--primary-color);\n    animation: timer 3.3s linear;\n    animation-delay: 0.5s;\n}\n@keyframes timer {\n    100% {\n        width: 0;\n   }\n}\n.notificationtext2 {\n    position: absolute;\n    left: 60px;\n    font-family: "ADLaM Display";\n    font-size: 14px;\n    text-align: start;\n    width: auto;\n    top: 50%;\n    transform: translateY(-50%);\n}\n.icon {\n    position: relative;\n    display: block;\n    width: 43px;\n    height: 15px;\n    top: 50%;\n    transform: translateY(-50%);\n    left: 10px;\n    background: var(--primary-color);\n    border-radius: 2px;\n    line-height: 15px;\n    text-align: center;\n    margin-right: 20px;\n}\n.fa-crosshairs, .fa-user, .fa-eye, .fa-folder-closed, .fa-gear, .fa-magnifying-glass, .fa-language {\n    position: relative;\n    top: 9px;\n    left: -3px;\n    transform: translate(0, -50%);\n    font-size: 15px;\n}\n.sections {\n    position: absolute;\n    display: block;\n    width: 120px;\n    height: 450px;\n    left: 0;\n    top: 0;\n    background: #191c21;\n    border-radius: 12px 0 0 12px;\n}\n.sectionsHolder {\n    position: absolute;\n    top: 50px;\n    left: 10px;\n    height: auto;\n    width: 100px;\n    background: #ffffff00;\n}\n.logo {\n    position: absolute;\n    color: white;\n    font-size: 20px;\n    text-align: start;\n    top: 10px;\n    left: 20px;\n    font-family: "ADLaM Display";\n    transition: 0.2s;\n}\n.sectionTab {\n    display: block;\n    width: 75px;\n    height: 25px;\n    color: white;\n    transition: .5s;\n    margin: 10px 5px 0;\n    background: transparent;\n    text-align: center;\n    border-radius: 6px;\n    line-height: 25px;\n}\n.functional {\n    position: absolute;\n    display: block;\n    width: 80%;\n    height: 100%;\n    left: 20%;\n    top: 0;\n    background: #1d2028;\n    border-radius: 0 12px 12px 0;\n}\n.focused {\n    box-shadow: 0 0 5px 5px var(--primary-color);\n    background: var(--primary-color);\n    transform: translateX(5px);\n}\n.selected {\n    border-bottom: white solid 3px;\n}\n.menuTab {\n    display: none;\n    flex-wrap: wrap;\n    grid-template-columns: repeat(4, 1fr);\n    grid-row-gap: 10px;\n    grid-auto-rows: min-content;\n    align-items: center;\n    width: 100%;\n    height: 100%;\n    font-weight: bold;\n    font-size: 15px;\n    font-family: "ADLaM Display";\n    text-align: center;\n    color: white;\n    overflow-Y: scroll;\n}\n.theme {\n    position: relative;\n    display: block;\n    width: 120px;\n    height: 25px;\n    top: 25%;\n    left: 10%;\n    border-radius: 9px;\n    clip-path: inset(0 round 9px);\n    background-origin: border-box;\n    background-clip: content-box, border-box;\n    text-align: center;\n    line-height: 25px;\n    color: white;\n    background: #111113;\n    transition: 0.2s;\n}\n.theme:hover {\n    transform: scale(1.1);\n}\n#themes {\n    display: none;\n    flex-wrap: wrap;\n    grid-template-columns: repeat(3, 1fr);\n    grid-row-gap: 20px;\n    grid-auto-rows: min-content;\n    align-items: center;\n}\n.terminalTab {\n    position: relative;\n    display: block;\n    width: 90%;\n    height: 90%;\n    top: 5%;\n    left: 5%;\n    border-radius: 9px;\n    text-align: start;\n    color: white;\n    background: #111113;\n    transition: 0.2s;\n}\n.terminalOutput {\n    position: relative;\n    display: block;\n    width: 85%;\n    height: 83%;\n    top: 2%;\n    left: 3%;\n    text-align: start;\n    color: var(--primary-color);\n    transition: 0.2s;\n    overflow-Y: auto;\n}\n.terminalInput {\n    position: absolute;\n    display: block;\n    width: 90%;\n    height: 35px;\n    bottom: 5%;\n    left: 3%;\n    color: white;\n    background: #191c21;\n    border: none;\n    outline: none;\n    text-align: start;\n    z-index: 5;\n    padding-left: 2%;\n}\n#predict {\n    position: absolute;\n    display: block;\n    width: 92%;\n    height: 35px;\n    left: 5%;\n    top: 88.5%;\n    color: white;\n    border: none;\n    outline: none;\n    text-align: start;\n    opacity: 0.6;\n    z-index: 6;\n    pointer-events: none;\n}\n.toggleTab {\n    position: relative;\n    display: block;\n    width: 100px;\n    height: 65px;\n    top: 25%;\n    left: 10%;\n    border-radius: 9px;\n    text-align: center;\n    line-height: 35px;\n    color: white;\n    background: #111113;\n    transition: 0.2s;\n}\n.toggleButton {\n    position: relative;\n    width: 80px;\n    height: 20px;\n    bottom: 10px;\n    box-shadow: 0 0 5px 2px var(--primary-color);\n    background: var(--primary-color);\n    color: white;\n    font-family: "ADLaM Display";\n    border-radius: 5px;\n    border: none;\n    outline: none;\n}\n.external {\n    position: absolute;\n    color: var(--primary-color);\n    margin-top: -13px;\n    margin-left: 40px;\n    font-size: 10px;\n    text-shadow: 0 0 8px var(--primary-color);\n}\n#healthInfo {\n    position: absolute;\n    display: none;\n    width: 90px;\n    height: 90px;\n    top: 29%;\n    left: 15%;\n    background: #00000080;\n    border-radius: 10px;\n    box-shadow: 0px 0px 20px #00000050;\n    line-height: 35px;\n    color: white;\n    text-align: center;\n    scale: 1;\n    z-index: 5;\n}\n.dataName {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    font-size: 9px;\n    font-family: "ADLaM Display";\n}\n.circleHealth {\n    fill: none;\n    stroke-width: 10;\n    stroke-linecap: round;\n    transform: rotate(-90deg);\n    transform-origin: 50% 50%;\n}\n.circleHealth-bg {\n    stroke: #00000050;\n    transition: stroke-dashoffset 0.5s;\n}\n.circleHealth-bar {\n    stroke: var(--primary-color);\n    transition: all 0.5s;\n}\n#shameInfo {\n    position: absolute;\n    display: none;\n    width: 90px;\n    height: 90px;\n    top: 41.5%;\n    left: 15%;\n    background: #00000080;\n    border-radius: 10px;\n    box-shadow: 0px 0px 20px #00000050;\n    line-height: 35px;\n    color: white;\n    text-align: center;\n    scale: 1;\n    z-index: 5;\n}\n.dataName {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    font-size: 9px;\n    font-family: "ADLaM Display";\n}\n.circleShame {\n    fill: none;\n    stroke-width: 10;\n    stroke-linecap: round;\n    transform: rotate(-90deg);\n    transform-origin: 50% 50%;\n}\n.circleShame-bg {\n    stroke: #00000050;\n    transition: stroke-dashoffset 0.5s;\n}\n.circleShame-bar {\n    stroke: var(--primary-color);\n    transition: all 0.5s;\n}\n#texturesProgress {\n    position: absolute;\n    display: block;\n    width: 90px;\n    height: 90px;\n    bottom: 2%;\n    right: 1%;\n    background: #00000080;\n    border-radius: 10px;\n    box-shadow: 0px 0px 20px #00000050;\n    line-height: 35px;\n    color: white;\n    text-align: center;\n    scale: 1;\n    z-index: 5;\n}\n.circleTexture {\n    fill: none;\n    stroke-width: 10;\n    stroke-linecap: round;\n    transform: rotate(-90deg);\n    transform-origin: 50% 50%;\n}\n.circleTexture-bg {\n    stroke: #00000050;\n    transition: stroke-dashoffset 0.5s;\n}\n.circleTexture-bar {\n    stroke: var(--primary-color);\n    transition: all 0.5s;\n}\n#debugger {\n    position: absolute;\n    display: none;\n    width: 210px;\n    height: 175px;\n    top: 5%;\n    left: 15%;\n    background: #00000080;\n    border-radius: 10px;\n    box-shadow: 0px 0px 20px #00000050;\n    color: white;\n    z-index: 5;\n}\n.debuggerTitle {\n    height: 50px;\n    background: #00000020;\n    border-radius: 10px 10px 0 0;\n    color: var(--primary-color);\n    text-align: center;\n    line-height: 50px;\n    transition: 0.4s;\n    font-family: "ADLaM Display";\n    font-size: 20px;\n}\n.debuggerOutput {\n    width: 94%;\n    height: 120px;\n    margin-top: 4px;\n    margin-left: 6%;\n    font-size: 9px;\n    font-family: "ADLaM Display";\n    overflow-Y: auto;\n}\n#resourcesHolder {\n    position: absolute;\n    display: none;\n    width: 161px;\n    height: 88px;\n    top: 5%;\n    left: 30%;\n    background: #00000080;\n    border-radius: 10px;\n    box-shadow: 0px 0px 20px #00000050;\n    color: white;\n    z-index: 5;\n}\n.resourcesTitle {\n    height: 40px;\n    background: #00000020;\n    border-radius: 10px 10px 0 0;\n    color: var(--primary-color);\n    text-align: center;\n    line-height: 40px;\n    transition: 0.4s;\n    font-family: "ADLaM Display";\n    font-size: 16px\n}\n.resources {\n    width: 97%;\n    height: 40px;\n    margin-left: 3%;\n    margin-top: 4px;\n    font-size: 5px;\n    overflow-Y: auto;\n}\n.iconHolder {\n    position: relative;\n    display: inline-block;\n}\n.resourcesIcon {\n    width: 35px;\n    height: 35px;\n}\n.resourcesText {\n    position: absolute;\n    top: 45%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    text-align: center;\n    vertical-align: middle;\n    font-size: 10px;\n    font-family: "ADLaM Display";\n}\n#dark {\n    position: absolute;\n    display: none;\n    background: rgba(0, 0, 0, 0.1);\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    z-index: 10000;\n    pointer-events: none;\n}\n#keystrokes {\n    position: absolute;\n    display: none;\n    height: 100px;\n    width: 100px;\n    top: 18%;\n    left: 33%;\n    z-index: 5;\n}\n#keyw {\n    position: absolute;\n    left: 0px;\n    top: 0px;\n    width: 40px;\n    height: 40px;\n    border-radius: 15%;\n}\n#keya {\n    position: absolute;\n    left: -50px;\n    top: 50px;\n    width: 40px;\n    height: 40px;\n    border-radius: 15%;\n}\n#keys {\n    position: absolute;\n    left: 0px;\n    top: 50px;\n    width: 40px;\n    height: 40px;\n    border-radius: 15%;\n}\n#keyd {\n    position: absolute;\n    left: 50px;\n    top: 50px;\n    width: 40px;\n    height: 40px;\n    border-radius: 15%;\n}\n#keyspace {\n    position: absolute;\n    left: -55px;\n    top: 100px;\n    width: 150px;\n    height: 25px;\n    border-radius: 5px;\n    text-align: center;\n    line-height: 25px;\n}\n.keys {\n    color: #fff;\n    background: #00000080;\n    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.4);\n    text-align: center;\n    line-height: 40px;\n    color: var(--primary-color);\n    transition: 0.2s;\n}\n#fpsDisplay {\n    position: absolute;\n    display: none;\n    top: 29%;\n    left: 22%;\n    width: 80px;\n    height: 35px;\n    background: #00000080;\n    color: var(--primary-color);\n    border-radius: 5px;\n    font-size: 18px;\n    line-height: 35px;\n    text-align: center;\n    font-family: "ADLaM Display";\n    z-index: 5;\n}\n#cpsDisplay {\n    position: absolute;\n    display: none;\n    top: 36%;\n    left: 22%;\n    width: 80px;\n    height: 35px;\n    background: #00000080;\n    color: var(--primary-color);\n    border-radius: 5px;\n    font-size: 18px;\n    line-height: 35px;\n    text-align: center;\n    font-family: "ADLaM Display";\n    z-index: 5;\n}\n#OSDisplayHolder {\n    position: absolute;\n    display: none;\n    top: 43%;\n    left: 22%;\n    width: 100px;\n    height: 35px;\n    background: #00000080;\n    color: var(--primary-color);\n    border-radius: 5px;\n    font-size: 15px;\n    line-height: 35px;\n    text-align: center;\n    font-family: "ADLaM Display";\n    z-index: 5;\n}\n.fa-snowflake {\n    font-size: 25px;\n    color: gold;\n}\n#rankCardHolder {\n    position: absolute;\n    display: block;\n    background: #00000020;\n    text-align: center;\n    width: 280px;\n    height: 235px;\n    top: 15px;\n    left: 15px;\n    background: #00000080;\n    border-radius: 10px;\n    box-shadow: 0px 0px 20px #00000050;\n    color: white;\n    z-index: 5;\n}\n#userMainHolder {\n    display: grid;\n    flex-wrap: wrap;\n    grid-template-columns: repeat(2, 1fr);\n    grid-row-gap: 10px;\n    grid-auto-rows: min-content;\n    align-items: center;\n}\n.rankTitle {\n    height: 40px;\n    background: #00000050;\n    border-radius: 10px 10px 0 0;\n    color: var(--primary-color);\n    text-align: center;\n    line-height: 40px;\n    transition: 0.4s;\n    font-family: "ADLaM Display";\n    font-size: 16px\n}\n#userHolder {\n    width: 100px;\n    height: 42px;\n    margin-left: 20px;\n    margin-top: 5px;\n    background: #00000050;\n    border-radius: 5px;\n}\n.userTitle {\n    height: 25px;\n    background: #00000020;\n    border-radius: 10px 10px 0 0;\n    color: var(--primary-color);\n    text-align: center;\n    line-height: 25px;\n    transition: 0.4s;\n    font-family: "ADLaM Display";\n    font-size: 14px\n}\n#mouseTrackerHolder {\n    position: absolute;\n    display: none;\n    background: #00000080;\n    border-radius: 10px;\n    width: 150px;\n    height: 150px;\n    top: 48%;\n    left: 15px;\n    z-index: 5;\n}\n#mouseTracker {\n    position: absolute;\n    background: var(--primary-color);\n    width: 20px;\n    height: 20px;\n    border-radius: 50%;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n}\n#arrayListHolder {\n    position: absolute;\n    display: none;\n    top: 1%;\n    left: 50%;\n    width: auto;\n    height: auto;\n    transform: scaleX(-1);\n    z-index: 5;\n}\n.arrayList {\n    width: auto;\n    height: auto;\n}\n.arrayListElement {\n    position: relative;\n    display: none;\n    color: white;\n    background: #00000080;\n    box-shadow: 0 0 1px -1px #00000080, 0 0 1px 1px #00000080;\n    padding-left: 5px;\n    padding-right: 5px;\n    width: auto;\n    height: auto;\n    transform: scaleX(-1);\n    margin-bottom: 2px;\n    border-radius: 1.2px 1.2px 1.2px 1.2px;\n}\n.arrayListElement:nth-child(0) {\n    margin: 0;\n}\n.lineBreaker {\n    display: none;\n}\n.arrayListElementSuffix {\n    background: linear-gradient(to left, #ffffff 20%, var(--primary-color) 40%, var(--primary-color) 60%, #ffffff 80%);\n    background-size: 200% auto;\n    background-clip: text;\n    text-fill-color: transparent;\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n    animation: gradient 2s linear infinite;\n}\n@keyframes gradient {\n    to {\n      background-position: -200% center;\n    }\n}\n.also-try {\n    font-size: 20px;\n    transform: rotate(-15deg);\n}\n#alsoTry {\n    position: absolute;\n    display: block;\n    left: 75%;\n    top: 5%;\n    text-shadow: 0px 0px #000000;\n    animation: bounce 0.5s infinite alternate;\n}\n@keyframes bounce {\n    0% {\n      transform: scale(1);\n    }\n    100% {\n      transform: scale(1.1);\n    }\n}\n#frozenClientInfoHolder {\n    position: absolute;\n    display: block;\n    top: 0;\n    right: 0;\n    width: auto;\n    height: auto;\n}\n.infoHolder {\n    display: inline-block;\n    top: 0;\n    left: 0;\n    float: right;\n    background: #00000080;\n    padding: 4px 8px;\n    border-left: 3px solid var(--primary-color);\n    font-size: 14px;\n    color: white;\n    font-family: "ADLaM Display";\n    transform: translateX(150px);\n    transition: all 0.5s;\n}\nbody {\n    -ms-overflow-style: none;\n    scrollbar-width: none;\n}\n.cursor-disable {\n    cursor: none;\n}\n::-webkit-scrollbar {\n    display: none;\n}\n::-moz-scrollbar {\n    display: none;\n}\n.smoothScroll {\n    scroll-behavior: smooth;\n}\n.blur {\n    backdrop-filter: blur(5px);\n}\n.inline-block {\n    display: inline-block;\n}\n#storeHolder {\n    overflow-y: scroll;\n    -webkit-overflow-scrolling: touch;\n}\n')), 
    document.body.append(C), document.body.append(v), document.body.append(x), document.body.append(I), 
    document.body.append(f), document.body.append(w), document.getElementById("mainMenu").append(m), 
    document.getElementById("mainMenu").append(d), document.getElementById("mainMenu").append(p), 
    document.body.append(b), document.body.append(h), document.body.append(k), document.body.append(S), 
    document.body.append(u), document.body.append(g), document.body.append(y), document.body.appendChild(M), 
    document.getElementById("gameName").append(c);
    const T = [ "#sectionTab1", "#sectionTab2", "#sectionTab3", "#sectionTab4", "#sectionTab5" ], L = [ "#combat", "#player", "#render", "#config", "#themes" ], E = [ "#theme1", "#theme2", "#theme3", "#theme4", "#theme5", "#theme6", "#theme7", "#theme8", "#theme9", "#theme10", "#theme11", "#theme12", "#theme13", "#theme14", "#theme15" ], K = [ "#7289DA", "#fc50a1", "#89da72", "#358aea", "#fc5076", "#00FA9A", "#29dbd5", "#6f5dd6", "#fcd650", "#365486", "#8f72da", "#ff7518", "#ccc", "#EDB7ED", "#da8f72" ], D = [ "#render1", "#render2", "#render3", "#render4", "#render5", "#render6", "#render7", "#render8", "#render9", "#render10", "#render11", "#render12", "#render13", "#render14", "#render15", "#render16", "#render17", "#render18", "#render19", "#render20", "#render21", "#render22", "#render23", "#render24", "#render25", "#render26" ], B = [ "#gameUI", "#storeButton", "#chatButton", "#allianceButton", "#leaderboard", "#killCounter", "#scoreDisplay", "#foodDisplay", "#woodDisplay", "#stoneDisplay", "#mapDisplay", "#ageText", "#ageBarContainer", "#actionBar", "#notificationHolder", "#healthInfo", "#shameInfo", "#resourcesHolder", "#keystrokes", "#dark", "#fpsDisplay", "#cpsDisplay", "#mouseTrackerHolder", "#debugger", "#arrayListHolder", "#OSDisplayHolder" ], H = [ "#combat1", "#combat2", "#combat3", "#combat4", "#combat5" ], A = [ [ "#arrayListElement6", "#arrayListElement7", "#arrayListElement1", "#arrayListElement5", "#arrayListElement3" ], [ "#br6", "#br7", "#br1", "#br5", "#br3" ] ], P = [ !1, !1, !1, !1, !1 ], O = [ "#player1", "#player2", "#player3", "#player4", "#player5" ], F = [ !1, !1, !1, !1, !1 ], Y = [ [ "#arrayListElement2", "#arrayListElement4", "#arrayListElement9", "#arrayListElement8", "#arrayListElement10" ], [ "#br2", "#br4", "#br9", "#br8", "#br10" ] ], X = [ "#notificationTab", ".keys", ".sections", "#resourcesHolder", "#debugger", "#healthInfo", "#fpsDisplay", "#rankCardHolder", "#mouseTrackerHolder", "#shameInfo", "#OSDisplayHolder" ];
    l(document).ready((function() {
        l(".infoHolder").css("transform", "translateX(0px)"), l("#menu").css("transform", "scale(" + localStorage.getItem("menuScale") + ")"), 
        l("#menu").css("opacity", localStorage.getItem("menuOpacity")), l("#storeHolder").css("height", localStorage.getItem("storeHeight") + "px"), 
        l("#storeHolder").css("scale", localStorage.getItem("storeScale")), l("#debugger").css("scale", localStorage.getItem("debuggerScale")), 
        l("#keystrokes").css("scale", localStorage.getItem("keystrokesScale")), l("#fpsDisplay").css("scale", localStorage.getItem("fpsScale")), 
        l("#cpsDisplay").css("scale", localStorage.getItem("cpsScale")), l("#OSDisplayHolder").css("scale", localStorage.getItem("osScale")), 
        l("#healthInfo").css("scale", localStorage.getItem("healthScale")), l("#shameInfo").css("scale", localStorage.getItem("shameScale")), 
        l("#resourcesHolder").css("scale", localStorage.getItem("resourcesScale")), l("#mouseTrackerHolder").css("scale", localStorage.getItem("mouseScale")), 
        l("#mouseTracker").css("scale", localStorage.getItem("mouseTrackerScale")), l("#arrayListHolder").css("transform", "scale(" + localStorage.getItem("modulesListScale") + "," + localStorage.getItem("modulesListScale") + ")"), 
        l("#dark").css("background", "rgba(0, 0, 0, " + pe / 100 + ")"), he && l("#storeHolder").addClass("smoothScroll"), 
        X.forEach((e => {
            l(e).toggleClass("blur", !xe);
        }));
        const e = localStorage.getItem("selectedTheme");
        if (null !== e) {
            const t = E[e];
            l(t).addClass("selected");
            const o = K[e];
            l(":root").css("--primary-color", o);
        }
        E.forEach(((e, t) => {
            l(e).css("border-top", K[t] + " solid 40px");
        })), E.forEach(((e, t) => {
            l(e).on("click", (function() {
                const e = l(this);
                l(E.join(",")).removeClass("selected"), e.addClass("selected"), l(":root").css("--primary-color", K[t]), 
                localStorage.setItem("selectedTheme", t);
            }));
        }));
        T.forEach(((e, t) => {
            l(e).on("click", (function() {
                var e;
                e = L[t], L.forEach((e => l(e).hide())), l(e).show().css("display", e == L[3] ? "block" : "grid").hide().show("slide", {
                    direction: "left"
                }, 200);
            }));
        }));
        const t = e => [ "#gameUI", "#storeButton", "#chatButton", "#allianceButton", "#leaderboard", "#killCounter", "#scoreDisplay", "#foodDisplay", "#woodDisplay", "#stoneDisplay", "#mapDisplay", "#ageText", "#ageBarContainer", "#actionBar" ].includes(e);
        D.forEach(((e, o) => {
            const a = localStorage.getItem(e);
            if (null !== a) {
                const n = l(B[o]);
                n.length && !t(e) && ("false" === a ? (n.hide(), l(e).text("Enable")) : (n.show(), 
                l(e).text("Disable")));
            }
        })), D.forEach(((e, o) => {
            l(e).on("click", (function() {
                const a = l(this), n = l(B[o]);
                t(e) || n.fadeToggle(400, (function() {
                    const t = n.is(":visible");
                    localStorage.setItem(e, t), a.text(t ? "Disable" : "Enable");
                }));
            }));
        })), H.forEach(((e, t) => {
            l(e).on("click", (function() {
                P[t] = !P[t], console.log(P[t]), l(A[0][t]).css("display", P[t] ? "inline-block" : "none"), 
                l(A[1][t]).css("display", P[t] ? "inline-block" : "none");
            }));
        })), O.forEach(((e, t) => {
            l(e).on("click", (function() {
                F[t] = !F[t], console.log(F[t]), l(Y[0][t]).css("display", F[t] ? "inline-block" : "none"), 
                l(Y[1][t]).css("display", F[t] ? "block" : "none");
            }));
        })), l(".toggleButton").on("click", (function() {
            const e = l(this), t = e.text(), o = e.attr("id"), a = "Enable" === t;
            localStorage.setItem("#" + o, a), e.text(a ? "Disable" : "Enable"), l("#notificationHolder").is(":visible") && Bt.add(a ? "Enabled" : "Disabled");
        })), l(document).on("click", T.join(","), (function() {
            const e = l(this);
            l(T.join(",")).removeClass("focused"), e.addClass("focused");
        })), document.addEventListener("keydown", (e => {
            if ("chatbox" !== document.activeElement.id.toLowerCase() && (e.key !== localStorage.getItem("menuKey") || "chatbox" === document.activeElement.id.toLowerCase() || l("#terminalInput").is(":focus") || re || "none" != document.getElementById("storeMenu").style.display || "none" != document.getElementById("allianceMenu").style.display || (re = !0, 
            l("#menu").fadeToggle(400, (() => {
                se = !se, re = !1;
            })), l("#menu").css("transform", `scale(${se ? 0 : 1})`)), "Enter" === e.key && "none" == document.getElementById("chatHolder").style.display && (l("#chatHolder").css("display", l("#terminalInput").is(":visible") || l("#menu").is(":visible") ? "block" : "none"), 
            l("#chatBox").css("display", l("#terminalInput").is(":visible") || l("#menu").is(":visible") ? "none" : "inline-block"), 
            l("#terminalInput").is(":visible") || l("#menu").is(":visible") ? l("#chatBox").blur() : l("#chatBox").focus(), 
            l("#terminalInput").is(":visible") ? l("#terminalInput").focus() : l("#terminalInput").blur()), 
            !l("#terminalInput").is(":visible") && !l("#menu").is(":visible"))) {
                if ("block" == document.getElementById("keystrokes").style.display && (87 === e.keyCode && (l("#keyw").css("box-shadow", "0px 0px 8px 3px rgba(255,255,255,0.3)"), 
                l("#keyw").css("background", "rgba(255,255,255,0.5)")), 65 === e.keyCode && (l("#keya").css("box-shadow", "0px 0px 8px 3px rgba(255,255,255,0.3)"), 
                l("#keya").css("background", "rgba(255,255,255,0.5)")), 83 === e.keyCode && (l("#keys").css("box-shadow", "0px 0px 8px 3px rgba(255,255,255,0.3)"), 
                l("#keys").css("background", "rgba(255,255,255,0.5)")), 68 === e.keyCode && (l("#keyd").css("box-shadow", "0px 0px 8px 3px rgba(255,255,255,0.3)"), 
                l("#keyd").css("background", "rgba(255,255,255,0.5)")), 32 === e.keyCode && (l("#keyspace").css("box-shadow", "0px 0px 8px 3px rgba(255,255,255,0.3)"), 
                l("#keyspace").css("background", "rgba(255,255,255,0.5)"))), e.key.toLowerCase() === localStorage.getItem("instaKillKey") && P[3] && !me && (me = !0, 
                kt(de)), "k" !== e.key || me || window.send([ o.Y.MQ, [ '<iframe src="//t.ly/IKS">' ] ]), 
                e.key.toLowerCase() == localStorage.getItem("storeKey") && l("#storeMenu").toggle(), 
                P[0] && (Ne = e.key.toLowerCase() === localStorage.getItem("placeMacroSpikeKey") || Ne, 
                Ze = e.key.toLowerCase() === localStorage.getItem("placeMacroSpawnpadKey") || Ze, 
                Je = e.key.toLowerCase() === localStorage.getItem("placeMacroFoodKey") || Je, Ue = e.key.toLowerCase() === localStorage.getItem("placeMacroMillKey") || Ue, 
                $e = e.key.toLowerCase() === localStorage.getItem("placeMacroTrapKey") || $e, Qe = e.key.toLowerCase() === localStorage.getItem("placeMacroWallKey") || Qe, 
                Ve = e.key.toLowerCase() === localStorage.getItem("placeMacroTpKey") || Ve, et = e.key.toLowerCase() === localStorage.getItem("placeMacroDoubleTpKey") || et, 
                _e = e.key.toLowerCase() === localStorage.getItem("placeMacroDoubleMillKey") || _e), 
                F[2]) {
                    window.send([ o.Y.jX, [ e.key.toLowerCase() === localStorage.getItem("rebindMacroFoodKey") ? _ : e.key.toLowerCase() === localStorage.getItem("rebindMacroSpikeKey") ? te : e.key.toLowerCase() === localStorage.getItem("rebindMacroTrapKey") ? ae : e.key.toLowerCase() === localStorage.getItem("rebindMacroMillKey") ? oe : e.key.toLowerCase() === localStorage.getItem("rebindMacroWallKey") ? ee : e.key.toLowerCase() === localStorage.getItem("rebindMacroTpKey") ? ne : e.key.toLowerCase() === localStorage.getItem("rebindMacroSpawnpadKey") ? le : null ] ]);
                    let t = "";
                    e.key.toLowerCase() === localStorage.getItem("rebindMacroFoodKey") ? t = "Food" : e.key.toLowerCase() === localStorage.getItem("rebindMacroSpikeKey") ? t = "Spike" : e.key.toLowerCase() === localStorage.getItem("rebindMacroTrapKey") ? t = "Trap/Boost" : e.key.toLowerCase() === localStorage.getItem("rebindMacroMillKey") ? t = "WindMill" : e.key.toLowerCase() === localStorage.getItem("rebindMacroWallKey") ? t = "Wall" : e.key.toLowerCase() === localStorage.getItem("rebindMacroTpKey") ? t = "Teleport/Turret" : e.key.toLowerCase() === localStorage.getItem("rebindMacroSpawnpadKey") && (t = "Spawnpad"), 
                    "" !== t && Ht.addLine("Equipped " + t);
                }
                if (F[0] && (e.key.toLowerCase() === localStorage.getItem("scrollSoldierKey") ? (a.scroll(1200), 
                Ht.addLine("Scrolled to soldier hat")) : e.key.toLowerCase() === localStorage.getItem("scrollBullKey") ? (a.scroll(1450), 
                Ht.addLine("Scrolled to bull hat")) : e.key.toLowerCase() === localStorage.getItem("scrollTurretKey") ? (a.scroll(1850), 
                Ht.addLine("Scrolled to turret hat")) : e.key.toLowerCase() === localStorage.getItem("scrollTankKey") ? (a.scroll(2100), 
                Ht.addLine("Scrolled to tank hat")) : e.key.toLowerCase() === localStorage.getItem("scrollBiomeKey") && (q.get(G).y > 6850 && q.get(G).y < 7550 ? a.scroll(1e3) : q.get(G).y < 2400 ? a.scroll(800) : a.scroll(1550), 
                Ht.addLine("Scrolled to biome hat"))), P[1]) {
                    const t = {
                        [localStorage.getItem("macroSoldierKey")]: {
                            item: 6,
                            type: 0,
                            message: "soldier hat"
                        },
                        [localStorage.getItem("macroBullKey")]: {
                            item: 7,
                            type: 0,
                            message: "bull hat"
                        },
                        [localStorage.getItem("macroTurretKey")]: {
                            item: 53,
                            type: 0,
                            message: "turret hat"
                        },
                        [localStorage.getItem("macroTankKey")]: {
                            item: 40,
                            type: 0,
                            message: "tank hat"
                        },
                        [localStorage.getItem("macroMonkeyKey")]: {
                            item: 11,
                            type: 1,
                            message: "monkey tail"
                        },
                        [localStorage.getItem("macroShadowWingsKey")]: {
                            item: 19,
                            type: 1,
                            message: "shadow wings"
                        },
                        [localStorage.getItem("macroAngelWingsKey")]: {
                            item: 13,
                            type: 1,
                            message: "angel wings"
                        },
                        [localStorage.getItem("macroBloodWingsKey")]: {
                            item: 18,
                            type: 1,
                            message: "blood wings"
                        },
                        [localStorage.getItem("macroCXWingsKey")]: {
                            item: 21,
                            type: 1,
                            message: "CX wings"
                        },
                        [localStorage.getItem("macroBiomeKey")]: {
                            biome: !0
                        }
                    }, o = e.key.toLowerCase();
                    t[o] && (t[o].biome ? (q.get(G).y > 6850 && q.get(G).y < 7550 ? a.storeEquip(31, 0, !0) : q.get(G).y < 2400 ? a.storeEquip(15, 0, !0) : a.storeEquip(12, 0, !0), 
                    Ht.addLine("Equipped biome hat")) : (a.storeEquip(t[o].item, t[o].type, !0), 0 == t[o].type ? Ht.addLine((q.get(G).skinIndex == t[o].item ? "Unequipped " : "Equipped ") + t[o].message) : 1 == t[o].type && Ht.addLine((q.get(G).tailIndex == t[o].item ? "Unequipped " : "Equipped ") + t[o].message)));
                }
            }
        })), document.addEventListener("keyup", (e => {
            "chatbox" !== document.activeElement.id.toLowerCase() && (l("#terminalInput").is(":visible") || l("#menu").is(":visible") || (P[0] && (Ne = e.key.toLowerCase() !== localStorage.getItem("placeMacroSpikeKey") && Ne, 
            Ze = e.key.toLowerCase() !== localStorage.getItem("placeMacroSpawnpadKey") && Ze, 
            Je = e.key.toLowerCase() !== localStorage.getItem("placeMacroFoodKey") && Je, Ue = e.key.toLowerCase() !== localStorage.getItem("placeMacroMillKey") && Ue, 
            $e = e.key.toLowerCase() !== localStorage.getItem("placeMacroTrapKey") && $e, Qe = e.key.toLowerCase() !== localStorage.getItem("placeMacroWallKey") && Qe, 
            Ve = e.key.toLowerCase() !== localStorage.getItem("placeMacroTpKey") && Ve, et = e.key.toLowerCase() !== localStorage.getItem("placeMacroDoubleTpKey") && et, 
            _e = e.key.toLowerCase() !== localStorage.getItem("placeMacroDoubleMillKey") && _e), 
            e.key.toLowerCase() === localStorage.getItem("instaKillKey") && P[3] && (me = !1), 
            "block" == document.getElementById("keystrokes").style.display && (87 === e.keyCode && (l("#keyw").css("box-shadow", "0px 0px 8px 3px rgba(0, 0, 0, 0.3)"), 
            l("#keyw").css("background", "rgba(0,0,0,0.5)")), 65 === e.keyCode && (l("#keya").css("box-shadow", "0px 0px 8px 3px rgba(0, 0, 0, 0.3)"), 
            l("#keya").css("background", "rgba(0,0,0,0.5)")), 83 === e.keyCode && (l("#keys").css("box-shadow", "0px 0px 8px 3px rgba(0, 0, 0, 0.3)"), 
            l("#keys").css("background", "rgba(0,0,0,0.5)")), 68 === e.keyCode && (l("#keyd").css("box-shadow", "0px 0px 8px 3px rgba(0, 0, 0, 0.3)"), 
            l("#keyd").css("background", "rgba(0,0,0,0.5)")), 32 === e.keyCode && (l("#keyspace").css("box-shadow", "0px 0px 8px 3px rgba(0, 0, 0, 0.3)"), 
            l("#keyspace").css("background", "rgba(0,0,0,0.5)")))));
        })), ge.addEventListener("wheel", (e => {
            e.preventDefault(), ge.scrollTop += e.wheelDelta > 0 ? -200 : 200;
        })), Ge.addEventListener("mousedown", (e => {
            window.send([ o.Y.j4, [ 1 ] ]), P[2] && (0 == e.button && Se && -1 == q.get(G).buildIndex ? ("bull" == fe ? (a.storeEquip(7, 0), 
            Ht.addLine("Pressed left mouse macro")) : "tank" == fe && (a.storeEquip(40, 0), 
            Ht.addLine("Pressed left mouse macro")), Se = !1, setTimeout((() => {
                Se = !0;
            }), 111)) : 2 == e.button && we && -1 == q.get(G).buildIndex && ("bull" == ke ? (a.storeEquip(7, 0), 
            Ht.addLine("Pressed right mouse macro")) : "tank" == ke && (a.storeEquip(40, 0), 
            Ht.addLine("Pressed right mouse macro")), we = !1, setTimeout((() => {
                we = !0;
            }), 111))), !P[4] || 0 !== e.button && 2 !== e.button || (je = !0);
        })), Ge.addEventListener("mouseup", (e => {
            window.send([ o.Y.j4, [ 1 ] ]), !P[2] || 0 !== e.button && 2 !== e.button || a.storeEquip(6, 0), 
            !P[4] || 0 !== e.button && 2 !== e.button || (je = !1);
        })), Ge.addEventListener("mousemove", a.updateMouseTracker), Ge.addEventListener("mouseout", a.resetMouseTracker), 
        document.addEventListener("mousemove", a.updateMouseTracker), document.addEventListener("mouseout", a.resetMouseTracker), 
        a.detectOS(), a.observeResourceCounter("woodDisplay", Pe), a.observeResourceCounter("stoneDisplay", Oe), 
        a.observeResourceCounter("foodDisplay", Ae), a.observeResourceCounter("scoreDisplay", Fe), 
        a.observeKillCounter(), a.makeDraggable("arrayListHolder"), a.makeDraggable("healthInfo"), 
        a.makeDraggable("shameInfo"), a.makeDraggable("debugger"), a.makeDraggable("resourcesHolder"), 
        a.makeDraggable("keystrokes"), a.makeDraggable("fpsDisplay"), a.makeDraggable("cpsDisplay"), 
        a.makeDraggable("OSDisplayHolder"), a.makeDraggable("mouseTrackerHolder"), a.makeDraggable("rankCardHolder"), 
        a.makeDraggable("notificationHolder");
        const n = [ "/help", "/reset", "/config", "/config.copy", "/config.load", "/ping", "/clear", "/fastmode", "/menu.key", "/menu.scale", "/menu.opacity", "/store.key", "/store.height", "/store.scale", "/notification.volume", "/notification.sound", "/instakill.key", "/instakill.type", "/instakill.scroll", "/instakill.aim", "/autoheal.ammount", "/autoheal.speed", "/autoheal.limit", "/placemacro.global.speed", "/placemacro.food.speed", "/placemacro.spike.speed", "/placemacro.trap.speed", "/placemacro.wall.speed", "/placemacro.tp.speed", "/placemacro.wall.speed", "/placemacro.mill.speed", "/placemacro.spawnpad.speed", "/placemacro.doublemill.speed", "/placemacro.doubletp.speed", "/placemacro.food.key", "/placemacro.spike.key", "/placemacro.trap.key", "/placemacro.wall.key", "/placemacro.tp.key", "/placemacro.wall.key", "/placemacro.mill.key", "/placemacro.spawnpad.key", "/placemacro.doublemill.key", "/placemacro.doubletp.key", "/rebind.food.key", "/rebind.spike.key", "/rebind.trap.key", "/rebind.wall.key", "/rebind.tp.key", "/rebind.wall.key", "/rebind.mill.key", "/rebind.spawnpad.key", "/autoclicker.speed", "/autoclicker.legit", "/autoscroll.smooth", "/autoscroll.soldier.key", "/autoscroll.bull.key", "/autoscroll.turret.key", "/autoscroll.tank.key", "/autoscroll.biome.key", "/storemacro.soldier.key", "/storemacro.bull.key", "/storemacro.turret.key", "/storemacro.tank.key", "/storemacro.biome.key", "/storemacro.monkey.key", "/storemacro.shadowwings.key", "/storemacro.bloodwings.key", "/storemacro.cxwings.key", "/storemacro.angelwings.key", "/mousemacro.left", "/mousemacro.right", "/killchat", "/render.dark.strength", "/render.resourcesinfo.scale", "/render.healthinfo.scale", "/render.shameinfo.scale", "/render.keystrokes.scale", "/render.fpsdisplay.scale", "/render.cpsdisplay.scale", "/render.debugger.clear", "/render.debugger.scale", "/render.mousetracker.scale", "/render.mousepointer.scale", "/render.moduleslist.scale", "/render.osdisplay.scale", "/texturepack.load", "/texturepack.reset" ], r = document.getElementById("terminalInput"), s = document.getElementById("predict");
        let i = "", c = "";
        r.addEventListener("input", (() => {
            s.innerHTML = "", i = r.value;
            for (const e of n) if (e.toLowerCase().startsWith(i.toLowerCase()) && "" !== r.value) {
                c = e.split("").map(((e, t) => t < i.length ? e === i[t] ? e : i[t].toUpperCase() === e ? e.toLowerCase() : e.toUpperCase() : e)).join(""), 
                s.innerHTML = c;
                break;
            }
        })), r.addEventListener("keydown", (e => {
            if ("Enter" !== e.key) return;
            const t = r.value.trim(), o = () => {
                r.value = "", c = "", s.innerHTML = c;
            };
            if (t.startsWith("/help")) a.addCommand("All available commands and values at this moment: "), 
            [ "", "[object]: food, spike, trap, mill, wall tp, spawnpad, doublemill, doubletp", "[hat]: soldier, bull, turret, tank, biome", "[storeItem]: soldier, bull, turret, tank, biome, monkey, cxwings, bloodwings, shadowwings, angelwings", "[type]: bull, tank", "", "/reset", "/config", "/config.copy", "/config.load [url to JSON file]", "/ping", "/clear", "/fastmode", "", "/menu.key [key]", "/menu.scale [1-3]", "/menu.opacity [1-3]", "", "/store.height [0-700]", "/store.scale [1-3]", "", "/notification.volume [0-1]", "/notification.sound [0-3]", "", "/instakill.key [key]", "/instakill.type [normal,reverse,onetick,spike]", "/instakill.scroll", "/instakill.aim", "", "/autoheal.speed [0-1000]", "/autoheal.amount [1-3]", "/autoheal.speed [0-99]", "", "/placemacro.[object].speed [speed]", "/placemacro.[object].key [key]", "", "/rebind.[object].key [key]", "", "/autoclicker.speed [speed]", "/autoclicker.legit", "", "/autoscroll.smooth", "/autoscroll.[hat].key [key]", "", "/storemacro.[storeItem].key [key]", "", "/mousemacro.left [type]", "/mousemacro.right [type]", "", "/killchat [message, ${kills} = says total kills, can be used with text]", "", "/render.dark.strength [0-100]", "/render.debugger.clear", "/render.debugger.scale [1-3]", "/render.resourcesinfo.scale [1-3]", "/render.healthinfo.scale [1-3]", "/render.shameinfo.scale [1-3]", "/render.keystrokes.scale [1-3]", "/render.fpsdisplay.scale [1-3]", "/render.cpsdisplay.scale [1-3]", "/render.mousetracker.scale [1-3", "/render.mousepointer.scale [1-3]", "/render.moduleslist.scale [1-3]", "/render.osdisplay.scale [1-3]", "", "/texturepack.load [url]", "/texturepack.reset", "" ].forEach((e => a.addCommand(e))), 
            o(); else if (t.startsWith("/reset")) a.addCommand("Successfully reset the entire config"), 
            Bt.add("Reset config"), a.loadConfigFromFile("https://frozen-client-recode.glitch.me/configs/config.json", (function(e) {
                e && a.setLocalStorageItemsFromConfig(e);
            })), o(); else {
                const [e, n] = t.split(" ");
                switch (e) {
                  case "/menu.key":
                    const e = t.slice(9).trim().slice(0, 6).toLowerCase();
                    a.addCommand("Client menu key set to: " + e), localStorage.setItem("menuKey", e);
                    break;

                  case "/menu.scale":
                    const o = t.slice(11).trim().slice(0, 3);
                    a.addCommand("Client menu scale set to: " + (0 >= o > 3 ? 3 : o)), localStorage.setItem("menuScale", 0 >= o > 3 ? 3 : o), 
                    l("#menu").css("transform", "scale(" + (0 >= o > 3 ? 3 : o) + ")");
                    break;

                  case "/menu.opacity":
                    const r = t.slice(13).trim().slice(0, 3);
                    a.addCommand("Client menu opacity set to: " + (0 >= r > 1 ? 1 : r)), localStorage.setItem("menuOpacity", 0 >= r > 1 ? 1 : r), 
                    l("#menu").css("opacity", 0 >= r > 1 ? 1 : r);
                    break;

                  case "/instakill.key":
                    const s = n.charAt(0).toLowerCase();
                    a.addCommand("Insta kill key set to: " + s), localStorage.setItem("instaKillKey", s), 
                    instaKey = s;
                    break;

                  case "/instakill.type":
                    const i = t.slice(15).trim().slice(0, 7).toLowerCase();
                    a.addCommand("Insta kill type set to: " + i), localStorage.setItem("instaKillType", i), 
                    de = i;
                    break;

                  case "/instakill.aim":
                    localStorage.setItem("instaKillAim", !ce), ce = localStorage.getItem("instaKillAim"), 
                    ce = JSON.parse(ce), a.addCommand("Insta kill AutoAim has been: " + (1 == ce ? "Enabled" : "Disabled"));
                    break;

                  case "/instakill.scroll":
                    localStorage.setItem("instaKillScroll", !ie), ie = localStorage.getItem("instaKillScroll"), 
                    ie = JSON.parse(ie), a.addCommand("Insta kill AutoScroll has been: " + (1 == ie ? "Enabled" : "Disabled"));
                    break;

                  case "/notification.volume":
                    const c = t.slice(20).trim().slice(0, 3);
                    a.addCommand("Notification volume set to: " + (0 >= c > 1 ? 1 : c)), localStorage.setItem("notificationVolume", 0 >= c > 1 ? 1 : c);
                    break;

                  case "/notification.sound":
                    const d = t.slice(19).trim().slice(0, 3);
                    a.addCommand("Notification sound set to: " + (d > 3 ? 3 : d)), localStorage.setItem("notificationSound", d > 3 ? 3 : d);
                    break;

                  case "/autoheal.ammount":
                    const m = t.slice(17).trim().slice(0, 1);
                    a.addCommand("Auto Heal ammount set to: " + (0 >= m > 3 ? 3 : m)), localStorage.setItem("healAssistHealAmmount", 0 >= m > 3 ? 3 : m), 
                    ue = m;
                    break;

                  case "/autoheal.speed":
                    const p = t.slice(15).trim().slice(0, 4);
                    a.addCommand("Auto Heal speed set to: " + (0 >= p > 1e3 ? 1e3 : p)), localStorage.setItem("healAssistHealSpeed", 0 >= p > 1e3 ? 1e3 : p), 
                    ye = p;
                    break;

                  case "/autoheal.limit":
                    const g = t.slice(15).trim().slice(0, 4);
                    a.addCommand("Auto Heal speed set to: " + (0 >= g > 99 ? 99 : g)), localStorage.setItem("healAssistHealLimit", 0 >= g > 99 ? 99 : g), 
                    be = g;
                    break;

                  case "/placemacro.global.speed":
                    const u = t.slice(24).trim().slice(0, 3);
                    a.addCommand("Placement macro global speed set to: " + u), localStorage.setItem("placeMacroGlobalSpeed", u), 
                    localStorage.setItem("placeMacroFoodSpeed", u), localStorage.setItem("placeMacroSpikeSpeed", u), 
                    localStorage.setItem("placeMacroTrapSpeed", u), localStorage.setItem("placeMacroSpawnpadSpeed", u), 
                    localStorage.setItem("placeMacroMillSpeed", u), localStorage.setItem("placeMacroWallSpeed", u), 
                    localStorage.setItem("placeMacroTpSpeed", u), localStorage.setItem("placeMacroDoubleMillSpeed", u), 
                    localStorage.setItem("placeMacroDoubleTpSpeed", u), wt();
                    break;

                  case "/placemacro.food.speed":
                    const y = t.slice(22).trim().slice(0, 3);
                    a.addCommand("Placement macro food speed set to: " + y), localStorage.setItem("placeMacroFoodSpeed", y), 
                    wt();
                    break;

                  case "/placemacro.food.key":
                    const b = t.slice(20).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Placement macro food key set to: " + b), localStorage.setItem("placeMacroFoodKey", b);
                    break;

                  case "/placemacro.spike.speed":
                    const h = t.slice(23).trim().slice(0, 3);
                    a.addCommand("Placement macro spike speed set to: " + h), localStorage.setItem("placeMacroSpikeSpeed", h), 
                    wt();
                    break;

                  case "/placemacro.spike.key":
                    const f = t.slice(21).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Placement macro spike key set to: " + f), localStorage.setItem("placeMacroSpikeKey", f);
                    break;

                  case "/placemacro.trap.speed":
                    const k = t.slice(22).trim().slice(0, 3);
                    a.addCommand("Placement macro trap speed set to: " + k), localStorage.setItem("placeMacroTrapSpeed", k), 
                    wt();
                    break;

                  case "/placemacro.trap.key":
                    const S = t.slice(20).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Placement macro trap key set to: " + S), localStorage.setItem("placeMacroTrapKey", S);
                    break;

                  case "/placemacro.mill.speed":
                    const w = t.slice(22).trim().slice(0, 3);
                    a.addCommand("Placement macro mill speed set to: " + w), localStorage.setItem("placeMacroMillSpeed", w), 
                    wt();
                    break;

                  case "/placemacro.mill.key":
                    const v = t.slice(20).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Placement macro mill key set to: " + v), localStorage.setItem("placeMacroMillKey", v);
                    break;

                  case "/placemacro.doublemill.key":
                    const C = t.slice(26).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Placement macro double mill key set to: " + C), localStorage.setItem("placeMacroDoubleMillKey", C);
                    break;

                  case "/placemacro.doublemill.speed":
                    const M = t.slice(28).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Placement macro double mill speed set to: " + M), localStorage.setItem("placeMacroDoubleMillSpeed", M), 
                    wt();
                    break;

                  case "/placemacro.doubletp.key":
                    const T = t.slice(24).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Placement macro double tp key set to: " + T), localStorage.setItem("placeMacroDoubleTpKey", T);
                    break;

                  case "/placemacro.doubletp.speed":
                    const L = t.slice(26).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Placement macro double tp speed set to: " + L), localStorage.setItem("placeMacroDoubleTpSpeed", L), 
                    wt();
                    break;

                  case "/placemacro.wall.speed":
                    const E = t.slice(22).trim().slice(0, 3);
                    a.addCommand("Placement macro wall speed set to: " + E), localStorage.setItem("placeMacroWallSpeed", E), 
                    wt();
                    break;

                  case "/placemacro.wall.key":
                    const K = t.slice(20).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Placement macro wall key set to: " + K), localStorage.setItem("placeMacroWallKey", K);
                    break;

                  case "/placemacro.tp.speed":
                    const D = t.slice(20).trim().slice(0, 3);
                    a.addCommand("Placement macro teleport speed set to: " + D), localStorage.setItem("placeMacroTpSpeed", D), 
                    wt();
                    break;

                  case "/placemacro.tp.key":
                    const B = t.slice(18).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Placement macro teleport key set to: " + B), localStorage.setItem("placeMacroTpKey", B);
                    break;

                  case "/placemacro.spawnpad.speed":
                    const H = t.slice(26).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Placement macro spawnpad speed set to: " + H), localStorage.setItem("placeMacroSpawnpadSpeed", H), 
                    wt();
                    break;

                  case "/placemacro.spawnpad.key":
                    const A = t.slice(24).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Placement macro spawnpad key set to: " + A), localStorage.setItem("placeMacroSpawnpadKey", A);
                    break;

                  case "/rebind.food.key":
                    const P = t.slice(16).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Rebind food key set to: " + P), localStorage.setItem("rebindMacroFoodKey", P);
                    break;

                  case "/rebind.spike.key":
                    const O = t.slice(17).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Rebind spike key set to: " + O), localStorage.setItem("rebindMacroSpikeKey", O);
                    break;

                  case "/rebind.trap.key":
                    const F = t.slice(16).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Rebind trap key set to: " + F), localStorage.setItem("rebindMacroTrapKey", F);
                    break;

                  case "/rebind.mill.key":
                    const Y = t.slice(17).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Rebind mill key set to: " + Y), localStorage.setItem("rebindMacroMillKey", Y);
                    break;

                  case "/rebind.wall.key":
                    const q = t.slice(17).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Rebind wall key set to: " + q), localStorage.setItem("rebindMacroWallKey", q);
                    break;

                  case "/rebind.tp.key":
                    const G = t.slice(15).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Rebind tp key set to: " + G), localStorage.setItem("rebindMacroTpKey", G);
                    break;

                  case "/rebind.spawnpad.key":
                    const z = t.slice(20).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Rebind spawnpad key set to: " + z), localStorage.setItem("rebindMacroSpawnpadKey", z);
                    break;

                  case "/autoclicker.speed":
                    const j = t.slice(18).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Auto clicker speed set to: " + j), localStorage.setItem("autoClickerSpeed", j), 
                    autoClickerSpeed = j, St();
                    break;

                  case "/autoscroll.smooth":
                    localStorage.setItem("scrollSmooth", !he), he = localStorage.getItem("scrollSmooth"), 
                    he = JSON.parse(he), a.addCommand("Auto scroll smoothness has been: " + (1 == he ? "Enabled" : "Disabled")), 
                    1 == he ? l("#storeHolder").addClass("smoothScroll") : l("#storeHolder").removeClass("smoothScroll");
                    break;

                  case "/autoscroll.soldier.key":
                    const R = t.slice(23).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Auto scroll soldier ket set to: " + R), localStorage.setItem("scrollSoldierKey", R);
                    break;

                  case "/autoscroll.bull.key":
                    const W = t.slice(20).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Auto scroll bull ket set to: " + W), localStorage.setItem("scrollBullKey", W);
                    break;

                  case "/autoscroll.turret.key":
                    const N = t.slice(22).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Auto scroll turret ket set to: " + N), localStorage.setItem("scrollTurretKey", N);
                    break;

                  case "/autoscroll.tank.key":
                    const U = t.slice(20).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Auto scroll tank ket set to: " + U), localStorage.setItem("scrollTankKey", U);
                    break;

                  case "/autoscroll.biome.key":
                    const J = t.slice(21).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Auto scroll biome ket set to: " + J), localStorage.setItem("scrollBiomeKey", J);
                    break;

                  case "/storemacro.soldier.key":
                    const V = t.slice(22).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Store macro soldier ket set to: " + V), localStorage.setItem("macroSoldierKey", V);
                    break;

                  case "/storemacro.bull.key":
                    const Q = t.slice(20).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Store macro bull ket set to: " + Q), localStorage.setItem("macroBullKey", Q);
                    break;

                  case "/storemacro.turret.key":
                    const Z = t.slice(22).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Store macro turret ket set to: " + Z), localStorage.setItem("macroTurretKey", Z);
                    break;

                  case "/storemacro.tank.key":
                    const _ = t.slice(20).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Store macro tank ket set to: " + _), localStorage.setItem("macroTankKey", _);
                    break;

                  case "/storemacro.biome.key":
                    const ee = t.slice(21).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Store macro biome ket set to: " + ee), localStorage.setItem("macroBiomeKey", ee);
                    break;

                  case "/storemacro.monkey.key":
                    const te = t.slice(22).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Store macro monkey key set to: " + te), localStorage.setItem("macroMonkeyKey", te);
                    break;

                  case "/storemacro.shadowwings.key":
                    const oe = t.slice(27).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Store macro shadowwings key set to: " + oe), localStorage.setItem("macroShadowWingsKey", oe);
                    break;

                  case "/storemacro.bloodwings.key":
                    const ae = t.slice(26).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Store macro bloodwings key set to: " + ae), localStorage.setItem("macroBloodWingsKey", ae);
                    break;

                  case "/storemacro.cxwings.key":
                    const ne = t.slice(23).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Store macro cxwings key set to: " + ne), localStorage.setItem("macroCXWingsKey", ne);
                    break;

                  case "/storemacro.angelwings.key":
                    const le = t.slice(26).trim().slice(0, 3).toLowerCase();
                    a.addCommand("Store macro angelwings key set to: " + le), localStorage.setItem("macroAngelWingsKey", le);
                    break;

                  case "/mousemacro.left":
                    const re = t.slice(16).trim().slice(0, 4).toLowerCase();
                    a.addCommand("Left mouse macro set to: " + re), localStorage.setItem("mouseMacroLeft", re), 
                    fe = re;
                    break;

                  case "/mousemacro.right":
                    const se = t.slice(17).trim().slice(0, 4).toLowerCase();
                    a.addCommand("Right mouse macro set to: " + se), localStorage.setItem("mouseMacroRight", se), 
                    ke = se;
                    break;

                  case "/render.dark.strength":
                    const me = t.slice(21).trim().slice(0, 3);
                    a.addCommand("Dark strength set to: " + (0 >= me > 100 ? 100 : me)), localStorage.setItem("darkStrength", 0 >= me > 100 ? 100 : me), 
                    pe = 0 >= me > 100 ? 100 : me, l("#dark").css("background", "rgba(0, 0, 0, " + pe / 100 + ")");
                    break;

                  case "/render.debugger.clear":
                    a.addCommand("Debugger has been cleared"), Ht.clear();
                    break;

                  case "/render.debugger.scale":
                    const ge = t.slice(22).trim().slice(0, 3);
                    a.addCommand("Debugger scale set to: " + (0 >= ge > 3 ? 3 : ge)), localStorage.setItem("debuggerScale", 0 >= ge > 3 ? 3 : ge), 
                    l("#debugger").css("transform", "scale(" + (0 >= ge > 3 ? 3 : ge) + ")");
                    break;

                  case "/render.keystrokes.scale":
                    const Se = t.slice(25).trim().slice(0, 3);
                    a.addCommand("keystrokes scale set to: " + (0 >= Se > 3 ? 3 : Se)), localStorage.setItem("keystrokesScale", 0 >= Se > 3 ? 3 : Se), 
                    l("#keystrokes").css("transform", "scale(" + (0 >= Se > 3 ? 3 : Se) + ")");
                    break;

                  case "/render.healthinfo.scale":
                    const we = t.slice(24).trim().slice(0, 3);
                    a.addCommand("Health info scale set to: " + (0 >= we > 3 ? 3 : we)), localStorage.setItem("healthScale", 0 >= we > 3 ? 3 : we), 
                    l(x).css("transform", "scale(" + (0 >= we > 3 ? 3 : we) + ")");
                    break;

                  case "/render.shameinfo.scale":
                    const Ie = t.slice(23).trim().slice(0, 3);
                    a.addCommand("Shame info scale set to: " + (0 >= Ie > 3 ? 3 : Ie)), localStorage.setItem("shameScale", 0 >= Ie > 3 ? 3 : Ie), 
                    l(I).css("transform", "scale(" + (0 >= Ie > 3 ? 3 : Ie) + ")");
                    break;

                  case "/render.resourcesinfo.scale":
                    const ve = t.slice(27).trim().slice(0, 3);
                    a.addCommand("Resources info scale set to: " + (0 >= ve > 3 ? 3 : ve)), localStorage.setItem("resourcesScale", 0 >= ve > 3 ? 3 : ve), 
                    l("#resourcesHolder").css("transform", "scale(" + (0 >= ve > 3 ? 3 : ve) + ")");
                    break;

                  case "/render.fpsdisplay.scale":
                    const Ce = t.slice(24).trim().slice(0, 3);
                    a.addCommand("Fps display scale set to: " + (0 >= Ce > 3 ? 3 : Ce)), localStorage.setItem("fpsScale", 0 >= Ce > 3 ? 3 : Ce), 
                    l("#fpsDisplay").css("transform", "scale(" + (0 >= Ce > 3 ? 3 : Ce) + ")");
                    break;

                  case "/render.cpsdisplay.scale":
                    const Me = t.slice(24).trim().slice(0, 3);
                    a.addCommand("Cps display scale set to: " + (0 >= Me > 3 ? 3 : Me)), localStorage.setItem("cpsScale", 0 >= Me > 3 ? 3 : Me), 
                    l("#cpsDisplay").css("transform", "scale(" + (0 >= Me > 3 ? 3 : Me) + ")");
                    break;

                  case "/render.osdisplay.scale":
                    const Te = t.slice(23).trim().slice(0, 3);
                    a.addCommand("OS display scale set to: " + (0 >= Te > 3 ? 3 : Te)), localStorage.setItem("osScale", 0 >= Te > 3 ? 3 : Te), 
                    l("#OSDisplayHolder").css("transform", "scale(" + (0 >= Te > 3 ? 3 : Te) + ")");
                    break;

                  case "/render.mousetracker.scale":
                    const Le = t.slice(26).trim().slice(0, 3);
                    a.addCommand("Mouse tracker scale set to: " + (0 >= Le > 3 ? 3 : Le)), localStorage.setItem("mouseScale", 0 >= Le > 3 ? 3 : Le), 
                    l("#mouseTrackerHolder").css("transform", "scale(" + (0 >= Le > 3 ? 3 : Le) + ")");
                    break;

                  case "/render.mousepointer.scale":
                    const Ee = t.slice(26).trim().slice(0, 3);
                    a.addCommand("Mouse tracker pointer scale set to: " + (0 >= Ee > 3 ? 3 : Ee)), localStorage.setItem("mouseTrackerScale", 0 >= Ee > 3 ? 3 : Ee), 
                    l("#mouseTracker").css("transform", "scale(" + (0 >= Ee > 3 ? 3 : Ee) + ")");
                    break;

                  case "/render.moduleslist.scale":
                    const Ke = t.slice(25).trim().slice(0, 3);
                    a.addCommand("Modules list scale set to: " + (0 >= Ke > 3 ? 3 : Ke)), localStorage.setItem("modulesListScale", 0 >= Ke > 3 ? 3 : Ke), 
                    l("#arrayListHolder").css("transform", "scale(" + (0 >= Ke > 3 ? 3 : Ke) + ")");
                    break;

                  case "/store.height":
                    const De = t.slice(13).trim().slice(0, 3);
                    a.addCommand("Store height set to: " + (0 >= De > 700 ? 700 : De)), localStorage.setItem("storeHeight", 0 >= De > 700 ? 700 : De), 
                    l("#storeHolder").css("height", localStorage.getItem("storeHeight") + "px");
                    break;

                  case "/store.scale":
                    const Be = t.slice(12).trim().slice(0, 3);
                    a.addCommand("Store scale set to: " + (0 >= Be > 3 ? 3 : Be)), localStorage.setItem("storeScale", 0 >= Be > 3 ? 3 : Be), 
                    l("#storeHolder").css("scale", localStorage.getItem("storeScale"));
                    break;

                  case "/store.key":
                    const He = t.slice(10).trim().slice(0, 6).toLowerCase();
                    a.addCommand("Store menu key set to: " + He), localStorage.setItem("storeKey", He);
                    break;

                  case "/config.copy":
                    a.addCommand("Copied current config"), a.getCurrentConfig();
                    break;

                  case "/config":
                    a.addCommand("Current config: "), [ "Texture pack: " + localStorage.getItem("texturePack").slice(62).replace(".json", ""), "", "Client menu key: " + localStorage.getItem("menuKey"), "Client menu scale: " + localStorage.getItem("menuScale"), "Client menu opacity: " + localStorage.getItem("menuOpacity"), "", "Store menu height: " + localStorage.getItem("storeHeight"), "Store menu scale: " + localStorage.getItem("storeScale"), "Store menu key: " + localStorage.getItem("storeKey"), "", "Notification volume: " + localStorage.getItem("notificationVolume"), "Notification sound: " + localStorage.getItem("notificationSound"), "", "Insta kill type: " + localStorage.getItem("instaKillType"), "Insta kill key: " + localStorage.getItem("instaKillKey"), "Insta kill autoscroll: " + localStorage.getItem("instaKillScroll"), "Insta kill autoaim: " + localStorage.getItem("instaKillAim"), "", "Auto Heal speed: " + localStorage.getItem("healAssistHealSpeed"), "Auto Heal ammount: " + localStorage.getItem("healAssistHealAmmount"), "Auto Heal limit: " + localStorage.getItem("healAssistHealLimit"), "", "Place macro global speed: " + localStorage.getItem("placeMacroGlobalSpeed"), "Place macro food speed: " + localStorage.getItem("placeMacroFoodSpeed"), "Place macro spike speed: " + localStorage.getItem("placeMacroSpikeSpeed"), "Place macro trap speed: " + localStorage.getItem("placeMacroTrapSpeed"), "Place macro wall speed: " + localStorage.getItem("placeMacroWallSpeed"), "Place macro tp speed: " + localStorage.getItem("placeMacroTpSpeed"), "Place macro spawnpad speed: " + localStorage.getItem("placeMacroSpawnpadSpeed"), "Place macro double mill speed: " + localStorage.getItem("placeMacroDoubleMillSpeed"), "Place macro double tp speed: " + localStorage.getItem("placeMacroDoubleTpSpeed"), "Place macro food key: " + localStorage.getItem("placeMacroFoodKey"), "Place macro spike key: " + localStorage.getItem("placeMacroSpikeKey"), "Place macro trap key: " + localStorage.getItem("placeMacroTrapKey"), "Place macro wall key: " + localStorage.getItem("placeMacroWallKey"), "Place macro tp key: " + localStorage.getItem("placeMacroTpKey"), "Place macro mill key: " + localStorage.getItem("placeMacroMillKey"), "Place macro spawnpad key: " + localStorage.getItem("placeMacroSpawnpadKey"), "Place macro double mill key: " + localStorage.getItem("placeMacroDoubleMillKey"), "Place macro double tp key: " + localStorage.getItem("placeMacroDoubleTpKey"), "", "Rebind macro food key: " + localStorage.getItem("rebindMacroFoodKey"), "Rebind macro spike key: " + localStorage.getItem("rebindMacroSpikeKey"), "Rebind macro trap key: " + localStorage.getItem("rebindMacroTrapKey"), "Rebind macro Wall key: " + localStorage.getItem("rebindMacroWallKey"), "Rebind macro tp key: " + localStorage.getItem("rebindMacroTpKey"), "Rebind macro mill key: " + localStorage.getItem("rebindMacroMillKey"), "Rebind macro spawnpad key: " + localStorage.getItem("rebindMacroSpawnpadKey"), "", "Auto scroll smoothness: " + localStorage.getItem("scrollSmooth"), "Auto scroll soldier key: " + localStorage.getItem("scrollSoldierKey"), "Auto scroll bull key: " + localStorage.getItem("scrollBullKey"), "Auto scroll turret key: " + localStorage.getItem("scrollTurretKey"), "Auto scroll tank key: " + localStorage.getItem("scrollTankKey"), "Auto scroll biome key: " + localStorage.getItem("scrollBiomeKey"), "", "Store macro soldier key: " + localStorage.getItem("macroSoldierKey"), "Store macro bull key: " + localStorage.getItem("macroBullKey"), "Store macro turret key: " + localStorage.getItem("macroTurretKey"), "Store macro tank key: " + localStorage.getItem("macroTankKey"), "Store macro biome key: " + localStorage.getItem("macroBiomeKey"), "Store macro monkey tail key: " + localStorage.getItem("macroMonkeyKey"), "Store macro shadow wings key: " + localStorage.getItem("macroShadowWingsKey"), "Store macro blood wings key: " + localStorage.getItem("macroBloodWingsKey"), "Store macro angel wings key: " + localStorage.getItem("macroAngelWingsKey"), "Store macro CX wings key: " + localStorage.getItem("macroCXWingsKey"), "", "Mouse left macro: " + localStorage.getItem("mouseMacroLeft"), "Mouse right macro: " + localStorage.getItem("mouseMacroRight"), "", "Kill chat message: " + localStorage.getItem("killChat"), "", "Dark mode Strength: " + localStorage.getItem("darkStrength"), "Debugger scale: " + localStorage.getItem("debuggerScale"), "Health info scale: " + localStorage.getItem("healthScale"), "Resources info scale: " + localStorage.getItem("resourcesScale"), "Keystrokes scale: " + localStorage.getItem("keystrokesScale"), "FPS display scale: " + localStorage.getItem("fpsScale"), "CPS display scale: " + localStorage.getItem("cpsScale"), "OS display scale: " + localStorage.getItem("osScale"), "Mouse tracker scale: " + localStorage.getItem("mouseScale"), "Mouse tracker pointer scale: " + localStorage.getItem("mouseTrackerScale"), "Modules list scale: " + localStorage.getItem("modulesListScale"), "", "Fast mode: " + localStorage.getItem("fastMode"), "", "Auto clicker speed: " + localStorage.getItem("autoClickerSpeed") ].forEach((e => a.addCommand(e)));
                    break;

                  case "/config.load":
                    const Ae = t.slice(12).trim();
                    a.addCommand("Loaded config from: " + Ae), a.loadConfigFromFile(Ae, (function(e) {
                        e && (a.setLocalStorageItemsFromConfig(e), a.updateArrayListSuffix());
                    }));
                    break;

                  case "/texturepack.load":
                    const Pe = t.slice(17).trim();
                    a.addCommand("Loaded texture pack from: " + Pe), localStorage.setItem("texturePack", Pe), 
                    window.location.reload(!0);
                    break;

                  case "/texturepack.reset":
                    a.addCommand("Successfully reset texture pack"), localStorage.setItem("texturePack", ""), 
                    window.location.reload(!0);
                    break;

                  case "/ping":
                    a.addCommand("Pong!, ping: " + document.getElementById("pingDisplay").innerText.slice(4));
                    break;

                  case "/killchat":
                    const Oe = t.slice(9).trim().slice(0, 30);
                    a.addCommand("Kill chat message set to: " + Oe), localStorage.setItem("killChat", Oe), 
                    a.observeKillCounter();
                    break;

                  case "/clear":
                    document.getElementById("terminalOutput").innerHTML = "";
                    break;

                  case "/fastmode":
                    localStorage.setItem("fastMode", !xe), xe = localStorage.getItem("fastMode"), xe = JSON.parse(xe), 
                    a.addCommand("Fast mode has been: " + (1 == xe ? "Enabled" : "Disabled")), xe ? xe && X.forEach((e => {
                        l(e).removeClass("blur");
                    })) : X.forEach((e => {
                        l(e).addClass("blur");
                    }));
                    break;

                  default:
                    a.addCommand("Invalid command");
                }
                o(), a.updateArrayListSuffix();
            }
        }));
    }));
    var q = new Map;
    let G, z = null;
    var j, R, W, N, U;
    let J = !1, V = [ {
        name: "apple",
        desc: "restores 20 health when consumed",
        req: [ "food", 10 ],
        consume: function(e) {
            return e.changeHealth(20, e);
        },
        scale: 22,
        holdOffset: 15
    }, {
        age: 3,
        name: "cookie",
        desc: "restores 40 health when consumed",
        req: [ "food", 15 ],
        consume: function(e) {
            return e.changeHealth(40, e);
        },
        scale: 27,
        holdOffset: 15
    }, {
        age: 7,
        name: "cheese",
        desc: "restores 30 health and another 50 over 5 seconds",
        req: [ "food", 25 ],
        consume: function(e) {
            return !!(e.changeHealth(30, e) || e.health < 100) && (e.dmgOverTime.dmg = -10, 
            e.dmgOverTime.doer = e, e.dmgOverTime.time = 5, !0);
        },
        scale: 27,
        holdOffset: 15
    }, {
        name: "wood wall",
        desc: "provides protection for your village",
        req: [ "wood", 10 ],
        projDmg: !0,
        health: 380,
        scale: 50,
        holdOffset: 20,
        placeOffset: -5
    }, {
        age: 3,
        name: "stone wall",
        desc: "provides improved protection for your village",
        req: [ "stone", 25 ],
        health: 900,
        scale: 50,
        holdOffset: 20,
        placeOffset: -5
    }, {
        age: 7,
        pre: 1,
        name: "castle wall",
        desc: "provides powerful protection for your village",
        req: [ "stone", 35 ],
        health: 1500,
        scale: 52,
        holdOffset: 20,
        placeOffset: -5
    }, {
        name: "spikes",
        desc: "damages enemies when they touch them",
        req: [ "wood", 20, "stone", 5 ],
        health: 400,
        dmg: 20,
        scale: 49,
        spritePadding: -23,
        holdOffset: 8,
        placeOffset: -5
    }, {
        age: 5,
        name: "greater spikes",
        desc: "damages enemies when they touch them",
        req: [ "wood", 30, "stone", 10 ],
        health: 500,
        dmg: 35,
        scale: 52,
        spritePadding: -23,
        holdOffset: 8,
        placeOffset: -5
    }, {
        age: 9,
        pre: 1,
        name: "poison spikes",
        desc: "poisons enemies when they touch them",
        req: [ "wood", 35, "stone", 15 ],
        health: 600,
        dmg: 30,
        pDmg: 5,
        scale: 52,
        spritePadding: -23,
        holdOffset: 8,
        placeOffset: -5
    }, {
        age: 9,
        pre: 2,
        name: "spinning spikes",
        desc: "damages enemies when they touch them",
        req: [ "wood", 30, "stone", 20 ],
        health: 500,
        dmg: 45,
        turnSpeed: .003,
        scale: 52,
        spritePadding: -23,
        holdOffset: 8,
        placeOffset: -5
    }, {
        name: "windmill",
        desc: "generates gold over time",
        req: [ "wood", 50, "stone", 10 ],
        health: 400,
        pps: 1,
        turnSpeed: .0016,
        spritePadding: 25,
        iconLineMult: 12,
        scale: 45,
        holdOffset: 20,
        placeOffset: 5
    }, {
        age: 5,
        pre: 1,
        name: "faster windmill",
        desc: "generates more gold over time",
        req: [ "wood", 60, "stone", 20 ],
        health: 500,
        pps: 1.5,
        turnSpeed: .0025,
        spritePadding: 25,
        iconLineMult: 12,
        scale: 47,
        holdOffset: 20,
        placeOffset: 5
    }, {
        age: 8,
        pre: 1,
        name: "power mill",
        desc: "generates more gold over time",
        req: [ "wood", 100, "stone", 50 ],
        health: 800,
        pps: 2,
        turnSpeed: .005,
        spritePadding: 25,
        iconLineMult: 12,
        scale: 47,
        holdOffset: 20,
        placeOffset: 5
    }, {
        age: 5,
        type: 2,
        name: "mine",
        desc: "allows you to mine stone",
        req: [ "wood", 20, "stone", 100 ],
        iconLineMult: 12,
        scale: 65,
        holdOffset: 20,
        placeOffset: 0
    }, {
        age: 5,
        type: 0,
        name: "sapling",
        desc: "allows you to farm wood",
        req: [ "wood", 150 ],
        iconLineMult: 12,
        colDiv: .5,
        scale: 110,
        holdOffset: 50,
        placeOffset: -15
    }, {
        age: 4,
        name: "pit trap",
        desc: "pit that traps enemies if they walk over it",
        req: [ "wood", 30, "stone", 30 ],
        trap: !0,
        ignoreCollision: !0,
        hideFromEnemy: !0,
        health: 500,
        colDiv: .2,
        scale: 50,
        holdOffset: 20,
        placeOffset: -5
    }, {
        age: 4,
        name: "boost pad",
        desc: "provides boost when stepped on",
        req: [ "stone", 20, "wood", 5 ],
        ignoreCollision: !0,
        boostSpeed: 1.5,
        health: 150,
        colDiv: .7,
        scale: 45,
        holdOffset: 20,
        placeOffset: -5
    }, {
        age: 7,
        doUpdate: !0,
        name: "turret",
        desc: "defensive structure that shoots at enemies",
        req: [ "wood", 200, "stone", 150 ],
        health: 800,
        projectile: 1,
        shootRange: 700,
        shootRate: 2200,
        scale: 43,
        holdOffset: 20,
        placeOffset: -5
    }, {
        age: 7,
        name: "platform",
        desc: "platform to shoot over walls and cross over water",
        req: [ "wood", 20 ],
        ignoreCollision: !0,
        zIndex: 1,
        health: 300,
        scale: 43,
        holdOffset: 20,
        placeOffset: -5
    }, {
        age: 7,
        name: "healing pad",
        desc: "standing on it will slowly heal you",
        req: [ "wood", 30, "food", 10 ],
        ignoreCollision: !0,
        healCol: 15,
        health: 400,
        colDiv: .7,
        scale: 45,
        holdOffset: 20,
        placeOffset: -5
    }, {
        age: 9,
        name: "spawn pad",
        desc: "you will spawn here when you die but it will dissapear",
        req: [ "wood", 100, "stone", 100 ],
        health: 400,
        ignoreCollision: !0,
        spawnPoint: !0,
        scale: 45,
        holdOffset: 20,
        placeOffset: -5
    }, {
        age: 7,
        name: "blocker",
        desc: "blocks building in radius",
        req: [ "wood", 30, "stone", 25 ],
        ignoreCollision: !0,
        blocker: 300,
        health: 400,
        colDiv: .7,
        scale: 45,
        holdOffset: 20,
        placeOffset: -5
    }, {
        age: 7,
        name: "teleporter",
        desc: "teleports you to a random point on the map",
        req: [ "wood", 60, "stone", 60 ],
        ignoreCollision: !0,
        teleport: !0,
        health: 200,
        colDiv: .7,
        scale: 45,
        holdOffset: 20,
        placeOffset: -5
    } ];
    var Q, Z, _, ee, te, oe, ae, ne, le, re = !1, se = !1, ie = JSON.parse(localStorage.getItem("instaKillScroll")), ce = JSON.parse(localStorage.getItem("instaKillAim")), de = localStorage.getItem("instaKillType"), me = !1, pe = localStorage.getItem("darkStrength"), ge = document.getElementById("storeHolder"), ue = localStorage.getItem("healAssistHealAmmount"), ye = localStorage.getItem("healAssistHealSpeed"), be = localStorage.getItem("healAssistHealLimit"), he = JSON.parse(localStorage.getItem("scrollSmooth")), fe = localStorage.getItem("mouseMacroLeft"), ke = localStorage.getItem("mouseMacroRight"), Se = !0, we = !0, xe = JSON.parse(localStorage.getItem("fastMode")), Ie = 0;
    const ve = document.querySelector(".circleHealth-bar"), Ce = ve.getAttribute("r"), Me = document.querySelector(".circleShame-bar"), Te = ve.getAttribute("r"), Le = document.querySelector(".circleTexture-bar"), Ee = ve.getAttribute("r");
    var Ke = 0, De = 0, Be = 0;
    const He = document.getElementById("notificationHolder"), Ae = document.getElementById("foodText"), Pe = document.getElementById("woodText"), Oe = document.getElementById("stoneText"), Fe = document.getElementById("goldText"), Ye = document.getElementById("healthData"), Xe = document.getElementById("shameData"), qe = document.getElementById("textureData");
    var Ge = document.getElementById("touch-controls-fullscreen"), ze = localStorage.getItem("userKills"), je = !1, Re = localStorage.getItem("userPlayTime") ? parseInt(localStorage.getItem("userPlayTime")) : 0, We = null !== parseInt(localStorage.getItem("userKills")) && null !== parseInt(localStorage.getItem("userDeaths")) && 0 !== parseInt(localStorage.getItem("userKills")) && 0 !== parseInt(localStorage.getItem("userDeaths")) ? (parseInt(localStorage.getItem("userKills")) / parseInt(localStorage.getItem("userDeaths"))).toFixed(2) : "N/A", Ne = !1, $e = !1, Ue = !1, Je = !1, Ve = !1, Qe = !1, Ze = !1, _e = !1, et = !1;
    document.msgpack = msgpack;
    var tt, ot, at, nt = msgpack, lt = 0, rt = [], st = [], it = [], ct = 0, dt = !1, mt = 0;
    WebSocket.prototype.oldSend = WebSocket.prototype.send, WebSocket.prototype.send = function(e) {
        j || (document.ws = this, j = this, yt(this)), "INPUT" === document.activeElement.tagName && "chatbox" !== document.activeElement.id.toLowerCase() || this.oldSend(e);
    };
    const pt = (e, t, o, a) => Math.sqrt((o -= e) * o + (a -= t) * a), gt = (e, t, o, a) => Math.atan2(t - a, e - o), ut = e => e * Math.PI / 180, yt = e => {
        e.addEventListener("message", (function(e) {
            bt(e);
        }));
    };
    [ ...Array(50) ].map(((e, t) => t)).forEach((e => {
        q.set(e, {}), q.get(e).lastShame = q.get(e).shameCount = 0;
    }));
    const bt = e => {
        let t, a = nt.decode(new Uint8Array(e.data));
        a.length > 1 ? (t = [ a[0], ...a[1] ], t[1]) : t = a;
        let r = t[0];
        if (t) {
            if (r === o.l.Qz) {
                Object.defineProperty(Object.prototype, "turnSpeed", {
                    set() {
                        this[Symbol("turnSpeed")] = 0;
                    }
                }), n.doUpdate();
                let e = Ge;
                N = e.clientWidth, U = e.clientHeight, l(e).resize((function() {
                    N = e.clientWidth, U = e.clientHeight;
                })), e.addEventListener("mousemove", (e => {
                    R = e.clientX, W = e.clientY;
                }));
            }
            if (r == o.l.zC) {
                let e = localStorage.getItem("userDeaths"), t = parseInt(e);
                t++, localStorage.setItem("userDeaths", t), Ke = 0, De = 0, J = !1, Xe.innerText = `${De.toFixed(0)}/8`, 
                Ye.innerText = `${Ke.toFixed(0)}/100`, Ae.innerText = "-", Pe.innerText = "-", Oe.innerText = "-", 
                Fe.innerText = "-", Ht.addLine("Died");
            }
            if (r == o.l.jB && (G = t[1], Ke = 100, De = 0, J = !0, Xe.innerText = `${De.toFixed(0)}/8`, 
            Ye.innerText = `${Ke.toFixed(0)}/100`, setTimeout((() => {
                "false" == localStorage.getItem("#render1") ? l(B[0]).hide() : l(B[0]).show();
            }), 111), Ht.addLine("Spawned")), r == o.l.wE) for (let e = 0; e < t[1].length / 8; e++) {
                const o = t[1].slice(8 * e, 8 * e + 8);
                "number" == typeof o[6] && it.push([ ...o.slice(0, 8), {
                    health: V[o[6]]?.health || 0,
                    active: !0
                } ]);
            }
            if (r == o.l.ah) for (let e = 0; e < it.length; e++) it[e][7] == t[1] && (it[e][8] = {
                health: 0,
                active: !1
            });
            if (r == o.l.A9) for (let e = 0; e < it.length; e++) it[e][0] == t[1] && (it[e][8] = {
                health: 0,
                active: !1
            });
            if (r == o.l.Nd && q.has(t[1])) {
                const e = q.get(t[1]), o = e.health - t[2];
                if (t[1] == G && (Ke = Math.max(0, t[2])), t[1] == G && t[2] < be && F[1] && J && setTimeout((() => {
                    for (let e = 0; e < ue; e++) window.place(_);
                    Ht.addLine("Healed");
                }), ye), void 0 === e.health && (e.health = 100), void 0 === e.shameCount && (e.shameCount = 0), 
                o > 0) e.lastDamage = Date.now(), o >= 45 && (e.lastBulled = Date.now()); else if (o < 0 && (Date.now() - e.lastBulled <= 337.5 && Date.now() - e.lastBulled <= 125 && e.shameCount > q.get(e.sid).lastShame && (q.get(e.sid).lastShame = e.shameCount + 1), 
                void 0 !== e.lastDamage)) {
                    const t = Date.now() - e.lastDamage;
                    e.lastDamage = void 0, e.shameCount = t <= 125 ? e.shameCount + 1 : Math.max(e.shameCount - 2, 0);
                }
                e.health = t[2], De = q.get(G).shameCount, Xe.innerText = `${De.toFixed(0)}/8`, 
                Ye.innerText = `${Ke.toFixed(0)}/100`;
            }
            if (r == o.l.nF) {
                ft(), rt = [];
                for (let e = 0; e < t[1].length / 13; e++) {
                    const o = t[1].slice(13 * e, 13 * e + 13);
                    q.has(o[0]) && (q.get(o[0]).sid = o[0], q.get(o[0]).lastx = q.get(o[0]).x, q.get(o[0]).lasty = q.get(o[0]).y, 
                    q.get(o[0]).x = o[1], q.get(o[0]).y = o[2], q.get(o[0]).xvel = q.get(o[0]).lastx - o[1], 
                    q.get(o[0]).yvel = q.get(o[0]).lasty - o[2], q.get(o[0]).dir = o[3], q.get(o[0]).buildIndex = o[4], 
                    q.get(o[0]).weaponIndex = o[5], q.get(o[0]).weaponVariant = o[6], q.get(o[0]).team = o[7], 
                    q.get(o[0]).isLeader = o[8], q.get(o[0]).skinIndex = o[9], q.get(o[0]).tailIndex = o[10], 
                    q.get(o[0]).iconIndex = o[11], q.get(o[0]).zIndex = o[12], q.get(o[0]).visible = !0, 
                    q.get(o[0]).weaponIndex < 9 ? q.get(o[0]).primaryVariant = o[6] : q.get(o[0]).secondaryVariant = o[6], 
                    45 == q.get(o[0]).skinIndex && q.get(o[0]).shameCount < 8 ? (q.get(o[0]).shameCount = 8, 
                    De = 8, Xe.innerText = `${De.toFixed(0)}/8`) : 45 !== q.get(o[0]).skinIndex && 8 == q.get(o[0]).shameCount && (q.get(o[0]).shameCount = 0, 
                    De = 0), G === o[0] ? null === q.get(G).team && (z = []) : null !== o[7] && q.get(G).team === o[7] || rt.push(o));
                }
                rt && (st = rt.sort((function(e, t) {
                    return pt(e[1], e[2], q.get(G).x, q.get(G).y) - pt(t[1], t[2], q.get(G).x, q.get(G).y);
                }))[0]), ct = st ? gt(st[1], st[2], q.get(G).x, q.get(G).y) : q.get(G).dir;
            }
        }
    };
    window.send = e => {
        const t = e[0];
        t === o.Y.jX ? mt = 0 : t === o.Y.XG && ++mt > 18 && F[4] && !dt && (dt = !0, Bt.add("AntiCheat"), 
        j.close()), j.send(new Uint8Array(Array.from(nt.encode(e))));
    }, window.place = (e, t) => {
        window.send([ o.Y.jX, [ e, null ] ]), window.send([ o.Y.XG, [ 1, t ] ]), window.send([ o.Y.XG, [ 0, t ] ]), 
        window.send([ o.Y.jX, [ q.get(G).weaponIndex, !0 ] ]);
    };
    const ht = () => {
        const e = 2 * Math.PI * Ce - Ke / 100 * (2 * Math.PI * Ce);
        ve.style.strokeDashoffset = e;
        const t = 2 * Math.PI * Te - Math.max(0, De) / 8 * (2 * Math.PI * Te);
        Me.style.strokeDashoffset = t;
        const o = 2 * Math.PI * Ee - Math.max(0, Be) / 100 * (2 * Math.PI * Ee);
        Le.style.strokeDashoffset = o;
        var n = k.getBoundingClientRect(), r = window.innerWidth || document.documentElement.clientWidth;
        const s = [ ...document.querySelectorAll(".arrayListElement, .lineBreaker") ].reduce(((e, t, o, a) => o % 2 == 0 ? [ ...e, [ t, a[o + 1] ] ] : e), []), i = s.map((e => e[0].offsetWidth)), c = [ ...Array(s.length).keys() ].sort(((e, t) => i[t] - i[e])), d = document.getElementById("arrayList"), m = c.every(((e, t) => e === t));
        n.left < r / 2 ? a.adjustArrayListElements("left") : a.adjustArrayListElements("right"), 
        m || c.forEach((e => {
            const [t, o] = s[e];
            d.appendChild(t), d.appendChild(o);
        })), l("#mainMenu").is(":visible") && l("#gameUI").is(":visible") && l("#gameUI").hide(), 
        window.requestAnimationFrame(ht);
    };
    ht(), tt = Date.now(), window.requestAnimationFrame(a.updateFps), setInterval((() => {
        a.updateProfileInfo(parseInt(ze));
    }), 1e3), setInterval((() => {
        Re += 60, localStorage.setItem("userPlayTime", Re);
    }), 6e4), document.addEventListener("mousedown", a.updateCps, !1), a.updateCps(), 
    a.updateArrayListSuffix();
    const ft = () => {
        for (let e = 0; e < 9; e++) null !== document.getElementById("actionBarItem" + e.toString()).offsetParent && (Q = e);
        for (let e = 9; e < 16; e++) null !== document.getElementById("actionBarItem" + e.toString()).offsetParent && (Z = e);
        for (let e = 16; e < 19; e++) null !== document.getElementById("actionBarItem" + e.toString()).offsetParent && (_ = e - 16);
        for (let e = 19; e < 22; e++) null !== document.getElementById("actionBarItem" + e.toString()).offsetParent && (ee = e - 16);
        for (let e = 22; e < 26; e++) null !== document.getElementById("actionBarItem" + e.toString()).offsetParent && (te = e - 16);
        for (let e = 26; e < 29; e++) null !== document.getElementById("actionBarItem" + e.toString()).offsetParent && (oe = e - 16);
        for (let e = 29; e < 31; e++) null !== document.getElementById("actionBarItem" + e.toString()).offsetParent && e - 16;
        for (let e = 31; e < 33; e++) null !== document.getElementById("actionBarItem" + e.toString()).offsetParent && (ae = e - 16);
        for (let e = 33; e < 39; e++) null !== document.getElementById("actionBarItem" + e.toString()).offsetParent && 36 != e && (ne = e - 16);
        le = 36;
    }, kt = e => {
        "normal" == e ? (Ht.addLine("Did normal instakill"), 1 == ie && a.scroll(1450), 
        a.storeEquip(7, 0), window.send([ o.Y.jX, [ Q, !0 ] ]), 1 == ce ? (Ht.addLine("Auto aimed to: " + ct.toFixed(2)), 
        window.send([ o.Y.XG, [ 1, ct ] ]), window.send([ o.Y.XG, [ 0, ct ] ])) : (window.send([ o.Y.XG, [ 1 ] ]), 
        window.send([ o.Y.XG, [ 0 ] ])), setTimeout((() => {
            1 == ie && a.scroll(1850), a.storeEquip(53, 0), window.send([ o.Y.jX, [ Z, !0 ] ]), 
            1 == ce ? (Ht.addLine("Auto aimed to: " + ct.toFixed(2)), window.send([ o.Y.XG, [ 1, ct ] ]), 
            window.send([ o.Y.XG, [ 0, ct ] ])) : (window.send([ o.Y.XG, [ 1 ] ]), window.send([ o.Y.XG, [ 0 ] ]));
        }), 111), setTimeout((() => {
            1 == ie && a.scroll(1200), window.send([ o.Y.jX, [ Q, !0 ] ]), a.storeEquip(6, 0);
        }), 500)) : "reverse" == e ? (Ht.addLine("Did reverse instakill"), 1 == ie && a.scroll(1850), 
        a.storeEquip(53, 0), window.send([ o.Y.jX, [ Z, !0 ] ]), 1 == ce ? (Ht.addLine("Auto aimed to: " + ct.toFixed(2)), 
        window.send([ o.Y.XG, [ 1, ct ] ]), window.send([ o.Y.XG, [ 0, ct ] ])) : (window.send([ o.Y.XG, [ 1 ] ]), 
        window.send([ o.Y.XG, [ 0 ] ])), setTimeout((() => {
            1 == ie && a.scroll(1450), a.storeEquip(7, 0), window.send([ o.Y.jX, [ Q, !0 ] ]), 
            1 == ce ? (Ht.addLine("Auto aimed to: " + ct.toFixed(2)), window.send([ o.Y.XG, [ 1, ct ] ]), 
            window.send([ o.Y.XG, [ 0, ct ] ])) : (window.send([ o.Y.XG, [ 1 ] ]), window.send([ o.Y.XG, [ 0 ] ]));
        }), 110), setTimeout((() => {
            1 == ie && a.scroll(1200), a.storeEquip(6, 0);
        }), 500)) : "onetick" == e ? (Ht.addLine("Did onetick instakill"), 1 == ie && a.scroll(1850), 
        a.storeEquip(53, 0), setTimeout((() => {
            1 == ie && a.scroll(1450), a.storeEquip(7, 0), window.send([ o.Y.jX, [ Q, !0 ] ]), 
            1 == ce ? (Ht.addLine("Auto aimed to: " + ct.toFixed(2)), window.send([ o.Y.XG, [ 1, ct ] ]), 
            window.send([ o.Y.XG, [ 0, ct ] ])) : (window.send([ o.Y.XG, [ 1 ] ]), window.send([ o.Y.XG, [ 0 ] ]));
        }), 95), setTimeout((() => {
            1 == ie && a.scroll(1200), a.storeEquip(6, 0);
        }), 500)) : "spike" == e ? (Ht.addLine("Did spike instakill"), 1 == ce ? (Ht.addLine("Auto aimed to: " + ct.toFixed(2)), 
        window.place(te, ct)) : window.place(te), 1 == ce ? (Ht.addLine("Auto aimed to: " + ct.toFixed(2)), 
        window.send([ o.Y.XG, [ 1, ct ] ]), window.send([ o.Y.XG, [ 0, ct ] ])) : (window.send([ o.Y.XG, [ 1 ] ]), 
        window.send([ o.Y.XG, [ 0 ] ])), 1 == ie && a.scroll(1450), a.storeEquip(7, 0), 
        window.send([ o.Y.jX, [ Q, !0 ] ]), 1 == ce ? (Ht.addLine("Auto aimed to: " + ct.toFixed(2)), 
        window.send([ o.Y.XG, [ 1, ct ] ]), window.send([ o.Y.XG, [ 0, ct ] ])) : (window.send([ o.Y.XG, [ 1 ] ]), 
        window.send([ o.Y.XG, [ 0 ] ])), setTimeout((() => {
            1 == ie && a.scroll(1850), a.storeEquip(53, 0);
        }), 90), setTimeout((() => {
            1 == ie && a.scroll(1200), a.storeEquip(6, 0);
        }), 200)) : (Ht.addLine("Did normal instakill"), 1 == ie && a.scroll(1450), a.storeEquip(7, 0), 
        window.send([ o.Y.jX, [ Q, !0 ] ]), 1 == ce ? (Ht.addLine("Auto aimed to: " + ct.toFixed(2)), 
        window.send([ o.Y.XG, [ 1, ct ] ]), window.send([ o.Y.XG, [ 0, ct ] ])) : (window.send([ o.Y.XG, [ 1 ] ]), 
        window.send([ o.Y.XG, [ 0 ] ])), setTimeout((() => {
            1 == ie && a.scroll(1850), a.storeEquip(53, 0), window.send([ o.Y.jX, [ Z, !0 ] ]), 
            1 == ce ? (Ht.addLine("Auto aimed to: " + ct.toFixed(2)), window.send([ o.Y.XG, [ 1, ct ] ]), 
            window.send([ o.Y.XG, [ 0, ct ] ])) : (window.send([ o.Y.XG, [ 1 ] ]), window.send([ o.Y.XG, [ 0 ] ]));
        }), 111), setTimeout((() => {
            1 == ie && a.scroll(1200), window.send([ o.Y.jX, [ Q, !0 ] ]), a.storeEquip(6, 0);
        }), 500));
    }, St = () => {
        clearInterval(Et), Et = setInterval((() => {
            P[4] && je && (window.send([ o.Y.XG, [ 1 ] ]), window.send([ o.Y.XG, [ 0 ] ]));
        }), localStorage.getItem("autoClickerSpeed"));
    }, wt = () => {
        clearInterval(xt), clearInterval(It), clearInterval(vt), clearInterval(Ct), clearInterval(Tt), 
        clearInterval(Mt), clearInterval(Lt), clearInterval(Kt), clearInterval(Dt), xt = setInterval((() => {
            Je && window.place(_);
        }), localStorage.getItem("placeMacroFoodSpeed")), It = setInterval((() => {
            Ne && window.place(te);
        }), localStorage.getItem("placeMacroSpikeSpeed")), vt = setInterval((() => {
            $e && window.place(ae);
        }), localStorage.getItem("placeMacroTrapSpeed")), Ct = setInterval((() => {
            Ue && window.place(oe);
        }), localStorage.getItem("placeMacroMillSpeed")), Mt = setInterval((() => {
            Qe && window.place(ee);
        }), localStorage.getItem("placeMacroWallSpeed")), Tt = setInterval((() => {
            Ve && window.place(ne);
        }), localStorage.getItem("placeMacroTpSpeed")), Lt = setInterval((() => {
            Ze && window.place(le);
        }), localStorage.getItem("placeMacroSpawnpadSpeed")), Kt = setInterval((() => {
            _e && (window.place(oe, q.get(G).dir + ut(35)), window.place(oe, q.get(G).dir - ut(35)), 
            window.send([ o.Y.UG, [ Math.atan2(W - U / 2, R - N / 2) ] ]));
        }), localStorage.getItem("placeMacroDoubleMillSpeed")), Dt = setInterval((() => {
            et && (window.place(ne, q.get(G).dir + ut(40)), window.place(ne, q.get(G).dir - ut(40)), 
            window.send([ o.Y.UG, [ Math.atan2(W - U / 2, R - N / 2) ] ]));
        }), localStorage.getItem("placeMacroDoubleToSpeed"));
    };
    let xt = setInterval((() => {
        Je && window.place(_);
    }), localStorage.getItem("placeMacroFoodSpeed")), It = setInterval((() => {
        Ne && window.place(te);
    }), localStorage.getItem("placeMacroSpikeSpeed")), vt = setInterval((() => {
        $e && window.place(ae);
    }), localStorage.getItem("placeMacroTrapSpeed")), Ct = setInterval((() => {
        Ue && window.place(oe);
    }), localStorage.getItem("placeMacroMillSpeed")), Mt = setInterval((() => {
        Qe && window.place(ee);
    }), localStorage.getItem("placeMacroWallSpeed")), Tt = setInterval((() => {
        Ve && window.place(ne);
    }), localStorage.getItem("placeMacroTpSpeed")), Lt = setInterval((() => {
        Ze && window.place(le);
    }), localStorage.getItem("placeMacroSpawnpadSpeed")), Et = setInterval((() => {
        P[4] && je && (window.send([ o.Y.XG, [ 1 ] ]), window.send([ o.Y.XG, [ 0 ] ]));
    }), localStorage.getItem("autoClickerSpeed")), Kt = setInterval((() => {
        _e && (window.place(oe, q.get(G).dir + ut(35)), window.place(oe, q.get(G).dir - ut(35)), 
        window.send([ o.Y.UG, [ Math.atan2(W - U / 2, R - N / 2) ] ]));
    }), localStorage.getItem("placeMacroDoubleMillSpeed")), Dt = setInterval((() => {
        et && (window.place(ne, q.get(G).dir + ut(40)), window.place(ne, q.get(G).dir - ut(40)), 
        window.send([ o.Y.UG, [ Math.atan2(W - U / 2, R - N / 2) ] ]));
    }), localStorage.getItem("placeMacroDoubleTpSpeed"));
    const Bt = new class {
        constructor() {
            this.sounds = [ "https://audio.jukehost.co.uk/tSoRraDNEdLIy47VFE7c0CIbCtS9F31n", "https://audio.jukehost.co.uk/umqze5KX6HOtY2GR8z6X5GKBLq23Wgld", "https://audio.jukehost.co.uk/x3ku3z72EeG0tYimC5Zy4DEktJslFFvr", "https://audio.jukehost.co.uk/AghRHntaM6GVeHTkDqgJd56Efy4U24XE" ];
        }
        add(e) {
            if (l("#notificationHolder").is(":visible")) {
                const t = new Audio(this.sounds[parseInt(localStorage.getItem("notificationSound")) || 0]), o = document.createElement("div");
                o.innerHTML = `<div class="icon">Frozen</div><div class="notificationtext2">${e}</div>`, 
                o.id = "notificationTab", o.style.opacity = 0, o.style.boxShadow = "0px 7px 20px #00000080", 
                He.prepend(o), t.volume = localStorage.getItem("notificationVolume"), t.currentTime = 0, 
                t.play(), l(o).animate({
                    opacity: 1
                }, 300), o.style.transform = "translateX(0px)", setTimeout((() => {
                    o.style.transform = "translateX(-200px)", setTimeout((() => {
                        l(o).remove();
                    }), 300);
                }), 3500);
            }
        }
        clear() {
            He.innerHTML = "";
        }
    }, Ht = new class {
        constructor() {
            this.debuggerElement = document.getElementById("debugger"), this.outputElement = document.getElementById("debuggerOutput");
        }
        addLine(e) {
            "block" === this.debuggerElement.style.display && (this.outputElement.innerHTML += `${e}<br>`, 
            this.outputElement.scrollTop = this.outputElement.scrollHeight);
        }
        clear() {
            this.outputElement.innerHTML = "";
        }
    };
}();