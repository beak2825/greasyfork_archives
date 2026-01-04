// ==UserScript==
// @name         24k UNOBFUSCATED (zombs.io)
// @namespace    discord.gg/GGQmaspr9N
// @version      ALPHA-Pro
// @description  better than u
// @author       ehScripts
// @match        zombs.io/*
// @icon         https://cdn.discordapp.com/attachments/873589347314700359/985564558594826280/24k.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466290/24k%20UNOBFUSCATED%20%28zombsio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466290/24k%20UNOBFUSCATED%20%28zombsio%29.meta.js
// ==/UserScript==

window.FontAwesomeKitConfig = {
    "asyncLoading": {
        "enabled": false
    },
    "autoA11y": {
        "enabled": true
    },
    "baseUrl": "https://ka-f.fontawesome.com",
    "baseUrlKit": "https://kit.fontawesome.com",
    "detectConflictsUntil": null,
    "iconUploads": {},
    "id": 134114787,
    "license": "free",
    "method": "css",
    "minify": {
        "enabled": true
    },
    "token": "ca28382911",
    "v4FontFaceShim": {
        "enabled": true
    },
    "v4shim": {
        "enabled": true
    },
    "v5FontFaceShim": {
        "enabled": true
    },
    "version": "6.4.0"
};
! function(t) {
    "function" == typeof define && define.amd ? define("kit-loader", t) : t()
}((function() {
    "use strict";

    function t(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(t);
            e && (r = r.filter((function(e) {
                return Object.getOwnPropertyDescriptor(t, e).enumerable
            }))), n.push.apply(n, r)
        }
        return n
    }

    function e(e) {
        for (var n = 1; n < arguments.length; n++) {
            var o = null != arguments[n] ? arguments[n] : {};
            n % 2 ? t(Object(o), !0).forEach((function(t) {
                r(e, t, o[t])
            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(o)) : t(Object(o)).forEach((function(t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(o, t))
            }))
        }
        return e
    }

    function n(t) {
        return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        })(t)
    }

    function r(t, e, n) {
        return (e = function(t) {
            var e = function(t, e) {
                if ("object" != typeof t || null === t) return t;
                var n = t[Symbol.toPrimitive];
                if (void 0 !== n) {
                    var r = n.call(t, e || "default");
                    if ("object" != typeof r) return r;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === e ? String : Number)(t)
            }(t, "string");
            return "symbol" == typeof e ? e : String(e)
        }(e)) in t ? Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : t[e] = n, t
    }

    function o(t, e) {
        return function(t) {
            if (Array.isArray(t)) return t
        }(t) || function(t, e) {
            var n = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
            if (null != n) {
                var r, o, i, c, a = [],
                    u = !0,
                    f = !1;
                try {
                    if (i = (n = n.call(t)).next, 0 === e) {
                        if (Object(n) !== n) return;
                        u = !1
                    } else
                        for (; !(u = (r = i.call(n)).done) && (a.push(r.value), a.length !== e); u = !0);
                } catch (t) {
                    f = !0, o = t
                } finally {
                    try {
                        if (!u && null != n.return && (c = n.return(), Object(c) !== c)) return
                    } finally {
                        if (f) throw o
                    }
                }
                return a
            }
        }(t, e) || function(t, e) {
            if (!t) return;
            if ("string" == typeof t) return i(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === n && t.constructor && (n = t.constructor.name);
            if ("Map" === n || "Set" === n) return Array.from(t);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return i(t, e)
        }(t, e) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }

    function i(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
        return r
    }

    function c(t, e) {
        var n = e && e.addOn || "",
            r = e && e.baseFilename || t.license + n,
            o = e && e.minify ? ".min" : "",
            i = e && e.fileSuffix || t.method,
            c = e && e.subdir || t.method;
        return t.baseUrl + "/releases/" + ("latest" === t.version ? "latest" : "v".concat(t.version)) + "/" + c + "/" + r + o + "." + i
    }

    function a(t) {
        return t.baseUrlKit + "/" + t.token + "/" + t.id + "/kit-upload.css"
    }

    function u(t, e) {
        var n = e || ["fa"],
            r = "." + Array.prototype.join.call(n, ",."),
            o = t.querySelectorAll(r);
        Array.prototype.forEach.call(o, (function(e) {
            var n = e.getAttribute("title");
            e.setAttribute("aria-hidden", "true");
            var r = !e.nextElementSibling || !e.nextElementSibling.classList.contains("sr-only");
            if (n && r) {
                var o = t.createElement("span");
                o.innerHTML = n, o.classList.add("sr-only"), e.parentNode.insertBefore(o, e.nextSibling)
            }
        }))
    }
    var f, s = function() {},
        d = "undefined" != typeof global && void 0 !== global.process && "function" == typeof global.process.emit,
        l = "undefined" == typeof setImmediate ? setTimeout : setImmediate,
        h = [];

    function m() {
        for (var t = 0; t < h.length; t++) h[t][0](h[t][1]);
        h = [], f = !1
    }

    function p(t, e) {
        h.push([t, e]), f || (f = !0, l(m, 0))
    }

    function v(t) {
        var e = t.owner,
            n = e._state,
            r = e._data,
            o = t[n],
            i = t.then;
        if ("function" == typeof o) {
            n = "fulfilled";
            try {
                r = o(r)
            } catch (t) {
                w(i, t)
            }
        }
        y(i, r) || ("fulfilled" === n && b(i, r), "rejected" === n && w(i, r))
    }

    function y(t, e) {
        var r;
        try {
            if (t === e) throw new TypeError("A promises callback cannot return that same promise.");
            if (e && ("function" == typeof e || "object" === n(e))) {
                var o = e.then;
                if ("function" == typeof o) return o.call(e, (function(n) {
                    r || (r = !0, e === n ? g(t, n) : b(t, n))
                }), (function(e) {
                    r || (r = !0, w(t, e))
                })), !0
            }
        } catch (e) {
            return r || w(t, e), !0
        }
        return !1
    }

    function b(t, e) {
        t !== e && y(t, e) || g(t, e)
    }

    function g(t, e) {
        "pending" === t._state && (t._state = "settled", t._data = e, p(S, t))
    }

    function w(t, e) {
        "pending" === t._state && (t._state = "settled", t._data = e, p(j, t))
    }

    function A(t) {
        t._then = t._then.forEach(v)
    }

    function S(t) {
        t._state = "fulfilled", A(t)
    }

    function j(t) {
        t._state = "rejected", A(t), !t._handled && d && global.process.emit("unhandledRejection", t._data, t)
    }

    function O(t) {
        global.process.emit("rejectionHandled", t)
    }

    function E(t) {
        if ("function" != typeof t) throw new TypeError("Promise resolver " + t + " is not a function");
        if (this instanceof E == !1) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
        this._then = [],
            function(t, e) {
            function n(t) {
                w(e, t)
            }
            try {
                t((function(t) {
                    b(e, t)
                }), n)
            } catch (t) {
                n(t)
            }
        }(t, this)
    }
    E.prototype = {
        constructor: E,
        _state: "pending",
        _then: null,
        _data: void 0,
        _handled: !1,
        then: function(t, e) {
            var n = {
                owner: this,
                then: new this.constructor(s),
                fulfilled: t,
                rejected: e
            };
            return !e && !t || this._handled || (this._handled = !0, "rejected" === this._state && d && p(O, this)), "fulfilled" === this._state || "rejected" === this._state ? p(v, n) : this._then.push(n), n.then
        },
        catch: function(t) {
            return this.then(null, t)
        }
    }, E.all = function(t) {
        if (!Array.isArray(t)) throw new TypeError("You must pass an array to Promise.all().");
        return new E((function(e, n) {
            var r = [],
                o = 0;

            function i(t) {
                return o++,
                    function(n) {
                    r[t] = n, --o || e(r)
                }
            }
            for (var c, a = 0; a < t.length; a++)(c = t[a]) && "function" == typeof c.then ? c.then(i(a), n) : r[a] = c;
            o || e(r)
        }))
    }, E.race = function(t) {
        if (!Array.isArray(t)) throw new TypeError("You must pass an array to Promise.race().");
        return new E((function(e, n) {
            for (var r, o = 0; o < t.length; o++)(r = t[o]) && "function" == typeof r.then ? r.then(e, n) : e(r)
        }))
    }, E.resolve = function(t) {
        return t && "object" === n(t) && t.constructor === E ? t : new E((function(e) {
            e(t)
        }))
    }, E.reject = function(t) {
        return new E((function(e, n) {
            n(t)
        }))
    };
    var _ = "function" == typeof Promise ? Promise : E;

    function F(t, e) {
        var n = e.fetch,
            r = e.XMLHttpRequest,
            o = e.token,
            i = t;
        return "URLSearchParams" in window ? (i = new URL(t)).searchParams.set("token", o) : i = i + "?token=" + encodeURIComponent(o), i = i.toString(), new _((function(t, e) {
            if ("function" == typeof n) n(i, {
                mode: "cors",
                cache: "default"
            }).then((function(t) {
                if (t.ok) return t.text();
                throw new Error("")
            })).then((function(e) {
                t(e)
            })).catch(e);
            else if ("function" == typeof r) {
                var o = new r;
                o.addEventListener("loadend", (function() {
                    this.responseText ? t(this.responseText) : e(new Error(""))
                }));
                ["abort", "error", "timeout"].map((function(t) {
                    o.addEventListener(t, (function() {
                        e(new Error(""))
                    }))
                })), o.open("GET", i), o.send()
            } else {
                e(new Error(""))
            }
        }))
    }

    function P(t, e, n) {
        var r = t;
        return [
            [/(url\("?)\.\.\/\.\.\/\.\./g, function(t, n) {
                return "".concat(n).concat(e)
            }],
            [/(url\("?)\.\.\/webfonts/g, function(t, r) {
                return "".concat(r).concat(e, "/releases/v").concat(n, "/webfonts")
            }],
            [/(url\("?)https:\/\/kit-free([^.])*\.fontawesome\.com/g, function(t, n) {
                return "".concat(n).concat(e)
            }]
        ].forEach((function(t) {
            var e = o(t, 2),
                n = e[0],
                i = e[1];
            r = r.replace(n, i)
        })), r
    }

    function C(t, n) {
        var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {},
            o = n.document || o,
            i = u.bind(u, o, ["fa", "fab", "fas", "far", "fal", "fad", "fak"]),
            f = Object.keys(t.iconUploads || {}).length > 0;
        t.autoA11y.enabled && r(i);
        var s = [{
            id: "fa-main",
            addOn: void 0
        }];
        t.v4shim && t.v4shim.enabled && s.push({
            id: "fa-v4-shims",
            addOn: "-v4-shims"
        }), t.v5FontFaceShim && t.v5FontFaceShim.enabled && s.push({
            id: "fa-v5-font-face",
            addOn: "-v5-font-face"
        }), t.v4FontFaceShim && t.v4FontFaceShim.enabled && s.push({
            id: "fa-v4-font-face",
            addOn: "-v4-font-face"
        }), f && s.push({
            id: "fa-kit-upload",
            customCss: !0
        });
        var d = s.map((function(r) {
            return new _((function(o, i) {
                F(r.customCss ? a(t) : c(t, {
                    addOn: r.addOn,
                    minify: t.minify.enabled
                }), n).then((function(i) {
                    o(T(i, e(e({}, n), {}, {
                        baseUrl: t.baseUrl,
                        version: t.version,
                        id: r.id,
                        contentFilter: function(t, e) {
                            return P(t, e.baseUrl, e.version)
                        }
                    })))
                })).catch(i)
            }))
        }));
        return _.all(d)
    }

    function T(t, e) {
        var n = e.contentFilter || function(t, e) {
            return t
        },
            r = document.createElement("style"),
            o = document.createTextNode(n(t, e));
        return r.appendChild(o), r.media = "all", e.id && r.setAttribute("id", e.id), e && e.detectingConflicts && e.detectionIgnoreAttr && r.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), r
    }

    function U(t, n) {
        n.autoA11y = t.autoA11y.enabled, "pro" === t.license && (n.autoFetchSvg = !0, n.fetchSvgFrom = t.baseUrl + "/releases/" + ("latest" === t.version ? "latest" : "v".concat(t.version)) + "/svgs", n.fetchUploadedSvgFrom = t.uploadsUrl);
        var r = [];
        return t.v4shim.enabled && r.push(new _((function(r, o) {
            F(c(t, {
                addOn: "-v4-shims",
                minify: t.minify.enabled
            }), n).then((function(t) {
                r(k(t, e(e({}, n), {}, {
                    id: "fa-v4-shims"
                })))
            })).catch(o)
        }))), r.push(new _((function(r, o) {
            F(c(t, {
                minify: t.minify.enabled
            }), n).then((function(t) {
                var o = k(t, e(e({}, n), {}, {
                    id: "fa-main"
                }));
                r(function(t, e) {
                    var n = e && void 0 !== e.autoFetchSvg ? e.autoFetchSvg : void 0,
                        r = e && void 0 !== e.autoA11y ? e.autoA11y : void 0;
                    void 0 !== r && t.setAttribute("data-auto-a11y", r ? "true" : "false");
                    n && (t.setAttributeNode(document.createAttribute("data-auto-fetch-svg")), t.setAttribute("data-fetch-svg-from", e.fetchSvgFrom), t.setAttribute("data-fetch-uploaded-svg-from", e.fetchUploadedSvgFrom));
                    return t
                }(o, n))
            })).catch(o)
        }))), _.all(r)
    }

    function k(t, e) {
        var n = document.createElement("SCRIPT"),
            r = document.createTextNode(t);
        return n.appendChild(r), n.referrerPolicy = "strict-origin", e.id && n.setAttribute("id", e.id), e && e.detectingConflicts && e.detectionIgnoreAttr && n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), n
    }

    function I(t) {
        var e, n = [],
            r = document,
            o = r.documentElement.doScroll,
            i = (o ? /^loaded|^c/ : /^loaded|^i|^c/).test(r.readyState);
        i || r.addEventListener("DOMContentLoaded", e = function() {
            for (r.removeEventListener("DOMContentLoaded", e), i = 1; e = n.shift();) e()
        }), i ? setTimeout(t, 0) : n.push(t)
    }

    function L(t) {
        "undefined" != typeof MutationObserver && new MutationObserver(t).observe(document, {
            childList: !0,
            subtree: !0
        })
    }
    try {
        if (window.FontAwesomeKitConfig) {
            var x = window.FontAwesomeKitConfig,
                M = {
                    detectingConflicts: x.detectConflictsUntil && new Date <= new Date(x.detectConflictsUntil),
                    detectionIgnoreAttr: "data-fa-detection-ignore",
                    fetch: window.fetch,
                    token: x.token,
                    XMLHttpRequest: window.XMLHttpRequest,
                    document: document
                },
                N = document.currentScript,
                D = N ? N.parentElement : document.head;
            (function() {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                return "js" === t.method ? U(t, e) : "css" === t.method ? C(t, e, (function(t) {
                    I(t), L(t)
                })) : void 0
            })(x, M).then((function(t) {
                t.map((function(t) {
                    try {
                        D.insertBefore(t, N ? N.nextSibling : null)
                    } catch (e) {
                        D.appendChild(t)
                    }
                })), M.detectingConflicts && N && I((function() {
                    N.setAttributeNode(document.createAttribute(M.detectionIgnoreAttr));
                    var t = function(t, e) {
                        var n = document.createElement("script");
                        return e && e.detectionIgnoreAttr && n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)), n.src = c(t, {
                            baseFilename: "conflict-detection",
                            fileSuffix: "js",
                            subdir: "js",
                            minify: t.minify.enabled
                        }), n
                    }(x, M);
                    document.body.appendChild(t)
                }))
            })).catch((function(t) {
                console.error("".concat("Font Awesome Kit:", " ").concat(t))
            }))
        }
    } catch (t) {
        console.error("".concat("Font Awesome Kit:", " ").concat(t))
    }
}));

document.getElementsByClassName("hud-intro-name")[0].maxLength = 29;

let savedTabs = [];
let gameServers = game.options.servers;

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = `
<h1>Tab Saver</h1>
<br />
Tabs saved:<br />
<div id="savedTabs">
</div>
<hr />
<p style="width: 300px;">
To exit a saved tab and go back to the main menu, click the blank spell icon on the left side of the screen.
</p>
`;

document.getElementsByClassName('hud-chat')[0].style.width = "auto";
document.getElementsByClassName('hud-chat')[0].style.minWidth = "520px";

document.getElementsByClassName('hud-intro-form')[0].insertAdjacentHTML('beforeend', '<button class="btn btn-red hud-intro-play" id="hstb">Host Saved Tab</button>');

let stElem = document.getElementById('savedTabs');

let newPlayButton = document.getElementsByClassName("hud-intro-play")[0].cloneNode();

newPlayButton.classList.replace('hud-intro-play', 'longbtn')
newPlayButton.style.display = "none";
newPlayButton.style.marginTop = "10px";
newPlayButton.style.marginLeft = "-.5px";
newPlayButton.innerText = "Enter Saved Tab";
newPlayButton.style.width = "100%";
newPlayButton.style.height = "50px";
newPlayButton.classList.replace('btn-green', 'btn-facebook');

newPlayButton.addEventListener('click', function() {
    game.ui.components.Intro.componentElem.style.display = "none";
});

addEventListener('load', function() {
    document.querySelector(".hud-intro-guide").style.width = "auto";
});

document.getElementsByClassName('hud-intro-play')[0].insertAdjacentElement("beforebegin", newPlayButton);

let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity3");
spell.classList.add("hud-zipp3-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

document.getElementsByClassName("hud-zipp3-icon")[0].addEventListener("click", function() {
    game.ui.components.PopupOverlay.showConfirmation('Are you sure you want to go back to the main menu? (This will not close your saved tabs.)', 5000, () => {
        if(window.parent !== window) {
            window.parent.ostb();
        };
        for(let tb of savedTabs) {
            tb.iframe.style.display = "none"
            game.ui.components.Intro.componentElem.style.display = "block";
        }
    });
});

let realPlayButton = true

const switchPlayButtons = () => {
    realPlayButton = !realPlayButton;
    if(realPlayButton) {
        newPlayButton.style.display = "none";
        document.getElementsByClassName("hud-intro-play")[0].style.display = "block";
    } else {
        document.getElementsByClassName("hud-intro-play")[0].style.display = "none";
        newPlayButton.style.display = "block";
    };
};

const updateSavedTabs = () => {
    stElem.innerHTML = ``;
    let oneEnabled = false;
    for(let tabi in savedTabs) {
        let tab = savedTabs[tabi]
        let tabBtn = document.createElement('button');
        if(tab.enabled) { oneEnabled = true; }
        tabBtn.classList.add('btn', tab.enabled ? "btn-green" : "btn-red");
        tabBtn.innerText = savedTabs[tabi].id;
        stElem.appendChild(tabBtn);
        let xBtn = document.createElement('button')
        xBtn.classList.add('btn');
        xBtn.innerText = "X"
        xBtn.style.marginTop = "2.5px";
        xBtn.style.display = "inline-block";
        stElem.appendChild(xBtn);
        let writeBtn = document.createElement('button')
        writeBtn.classList.add('btn');
        writeBtn.innerHTML = "<i class='fa fa-pencil'></i>"
        writeBtn.style.marginTop = "2.5px";
        stElem.appendChild(writeBtn);
        writeBtn.style.display = "inline-block"
        let enterBtn = document.createElement('button')
        enterBtn.classList.add('btn');
        enterBtn.innerHTML = "<i class='fa fa-check'></i>"
        enterBtn.style.marginTop = "2.5px";
        enterBtn.style.display = "none";
        stElem.appendChild(enterBtn);
        let resetBtn = document.createElement('button')
        resetBtn.classList.add('btn');
        resetBtn.innerHTML = "<i class='fa fa-rotate-left'></i>"
        resetBtn.style.marginTop = "2.5px";
        resetBtn.style.display = "none";
        stElem.appendChild(resetBtn);
        let oldId;
        writeBtn.addEventListener('click', function() {
            if(this.dataset.editing) {
                updateSavedTabs();
            } else {
                resetBtn.style.display = "inline-block";
                resetBtn.classList.replace('btn', 'disabledBtn');
                enterBtn.style.display = "inline-block";
                enterBtn.classList.replace('btn', 'disabledBtn');
                oldId = savedTabs[tabi].id;
                tabBtn.innerHTML = `<input style="width:100px;" type="text" />`
               tabBtn.children[0].addEventListener('input', function() {
                   this.value = this.value.replaceAll(' ', '_');
                   if(this.value == oldId || this.value == "") {
                       if(this.value !== "") {
                           resetBtn.classList.replace('btn', 'disabledBtn');
                       };
                       if(this.value == "") {
                           enterBtn.classList.replace('btn', 'disabledBtn');
                       }
                   } else {
                       resetBtn.classList.replace('disabledBtn', 'btn');
                       enterBtn.classList.replace('disabledBtn', 'btn');
                   };
                   if(savedTabs.find(i => i.id == this.value)) {
                       enterBtn.classList.replace('btn', 'disabledBtn');
                   };
               })
                tabBtn.children[0].focus();
                tabBtn.children[0].value = savedTabs[tabi].id;
                tabBtn.setAttribute('disabled', true);
                this.innerHTML = "<i class='fa fa-square'>"
                xBtn.setAttribute('disabled', true)
                this.dataset.editing = true;
                xBtn.classList.replace('btn', 'disabledBtn');
            };
        });
        resetBtn.addEventListener('click', function() {
            tabBtn.children[0].value = oldId;
        });
        enterBtn.addEventListener('click', function() {
            savedTabs[tabi].id = tabBtn.children[0].value;
            updateSavedTabs();
        });
        xBtn.addEventListener('click', function() {
            let c = confirm('Are you sure you want to close this tab?');
            if(c) {
                tab.iframe.remove();
                savedTabs.splice(tabi, tabi + 1);
                updateSavedTabs();
            };
        })
        savedTabs[tabi].btn = tabBtn;
        tabBtn.addEventListener('click', function() {
            savedTabs[tabi].enabled = !savedTabs[tabi].enabled;
            tab.iframe.style.display = "block";
            document.getElementsByTagName('canvas')[0].style.display = "none";
            for(let component in game.ui.components) {
                if(component !== "Intro") {
                    game.ui.components[component].componentElem.style.display = "none";
                };
            };
            for(let tbi in savedTabs) {
                let tb = savedTabs[tbi];
                if((tb.serverId !== tab.serverId) || (tb.serverId == tab.serverId && tb.no !== tab.no)) {
                    tb.iframe.style.display = "none";
                    savedTabs[tbi].enabled = false;
                };
            };
            updateSavedTabs();
        })
        stElem.insertAdjacentHTML('beforeend', '<br />')
    };
    if(oneEnabled) {
        document.getElementsByTagName('canvas')[0].style.display = "none";
        for(let component in game.ui.components) {
            if(component !== "Intro") {
                game.ui.components[component].componentElem.style.display = "none";
            };
        };
        if(realPlayButton) {
            switchPlayButtons();
        };
    } else {
        document.getElementsByTagName('canvas')[0].style.display = "block";
        if(!realPlayButton) {
            switchPlayButtons();
        };
        for(let tb of savedTabs) {
            tb.iframe.style.display = "none"
        };
        for(let component in game.ui.components) {
            if(component !== "Intro") {
                game.ui.components[component].componentElem.style.display = "block";
            };
        };
        for(let component in game.ui.components) {
            if(component !== "Intro") {
                game.ui.components[component].componentElem.style.display = "block";
            };
        };
    };
};

const hostSavedTab = serverId => {
    let iframe = document.createElement('iframe');
    iframe.src = `https://zombs.io/#/${serverId}/tabsession`;
    iframe.style.diplay = "none";
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.position = 'absolute';
    iframe.style.display = "none";
    document.getElementsByClassName('hud')[0].append(iframe);
    iframe.onload = () => {
        if(iframe.dataset.loaded) { return; }
        iframe.dataset.loaded = true;
        if(gameServers[serverId].hostno) {
            gameServers[serverId].hostno++;
        } else {
            gameServers[serverId].hostno = 1;
        }
        let tabi = savedTabs.length;
        savedTabs.push({ serverId: serverId, serverName: game.options.servers[serverId].name, no: gameServers[serverId].hostno, iframe: iframe, id: `${game.options.servers[serverId].name.replaceAll(' ', '-')}_#${gameServers[serverId].hostno}` })
        updateSavedTabs();
        iframe.contentWindow.eval(`
           document.getElementsByClassName("hud-intro-play")[0].click()
           let hasJoined = false
           game.network.addEnterWorldHandler(() => {
               if(hasJoined) { return; }
               hasJoined = true;
           });
       `);
        setTimeout(() => {
            if(!iframe.contentWindow.game.world.inWorld) {
                iframe.remove();
                savedTabs.splice(tabi, tabi + 1);
                game.ui.components.Intro.componentElem.style.display = "block";
                updateSavedTabs();
            };
        }, 10000);
    };
};

document.getElementById('hstb').addEventListener('click', function() {
    hostSavedTab(document.getElementsByClassName('hud-intro-server')[0].value)
})

window.stOpt = {
    ust: updateSavedTabs,
    gst: () => savedTabs,
    spb: switchPlayButtons
}

window.ostb = () => {
    game.ui.components.Intro.componentElem.style.display = "block";
};

window.joinST = id => {
    let tab = savedTabs.find(i => i.id == id);
    if(tab) {
        for(let tb of savedTabs) {
            tb.iframe.style.display = "none"
        };
        tab.iframe.style.display = "block";
    };
};

document.body.style.overscrollBehavior = "none";

let lastMousePos = {};
let mouseDown = false;
let mousePos = {};
let dragBoxElem;
let dragBoxMenuElem;
let dragBoxMenuOpen;
let dragBoxMenuOpenWhenStarted;
let placingSelection;
let placingSelectionWhenStarted;
let placingSelectionId;
const dayNightOverlay = document.getElementById("hud-day-night-overlay");

const buildingModels = ["Wall", "Door", "SlowTrap", "GoldMine", "Harvester", "MagicTower", "CannonTower", "ArrowTower", "BombTower", "MeleeTower"];

const savedSelections = {};

Number.prototype.nearest = function(n) { return Math.round(this / n) * n; };

const options = {
    dayBright: {
        onUpdate: enabled => {
            if(enabled) {
                dayNightOverlay.style.display = "none";
            } else {
                dayNightOverlay.style.display = "block";
            };
        },
        enabled: false,
        name: "DayBright",
        id: "dayBright"
    },
    dragBox: {
        onUpdate: e => {
            if(!e) {
                if(dragBoxElem) { dragBoxElem.remove(); };
                if(dragBoxMenuElem) { dragBoxMenuElem.remove(); };
            };
        },
        enabled: false,
        name: "DragBox",
        id: "dragBox"
    },
    grapplingHook: {
        onUpdate: () => {},
        enabled: false,
        name: "Grappling Hook",
        id: "grapplingHook"
    },
    frss: {
        onUpdate: () => {},
        enabled: false,
        name: "Full RSS",
        id: "frss"
    }
};

window.optUpdate = (feature, enabled) => {
    options[feature].enabled = enabled;
    options[feature].onUpdate(enabled);
};

const menuOpen = () => game.ui.components.MenuSettings.isVisible() || game.ui.components.MenuParty.isVisible() || game.ui.components.MenuShop.isVisible() || window.scannerMenu.style.display == "block";

addEventListener('mousedown', function(e) {
    if(!window.obo && e.button == 0) {
        for(const ws of Object.values(webSockets)) {
            ws.network.sendInput({ space: 1 });
            ws.network.sendInput({ space: 0 });
        };
    };
    if(e.button == 2 && window.scatterAlts && !menuOpen()) {
        const wsList = Object.values(webSockets);
        if(wsList.length < 1) { return; };
        window.scaOG = moveType;
        moveType = "idle";
        window.scaOGs = {}
        for(const wsId in webSockets) {
            const ws = webSockets[wsId];
            window.scaOGs[wsId] = ws.moveType;
            webSockets[wsId].moveType = "idle";
        };
        const NWalt = wsList.sort((a, b) => Math.hypot(a.playerTick.position.x, a.playerTick.position.y) - Math.hypot(b.playerTick.position.x, b.playerTick.position.y))[0];
        const SEalt = wsList.sort((a, b) => Math.hypot(b.playerTick.position.x, b.playerTick.position.y) - Math.hypot(a.playerTick.position.x, a.playerTick.position.y))[0];
        const Nalt = wsList.sort((a, b) => Math.hypot(a.playerTick.position.x - 12000, a.playerTick.position.y) - Math.hypot(b.playerTick.position.x - 12000, b.playerTick.position.y))[0];
        const Salt = wsList.sort((a, b) => Math.hypot(b.playerTick.position.x - 12000, b.playerTick.position.y) - Math.hypot(a.playerTick.position.x - 12000, a.playerTick.position.y))[0];
        const NEalt = wsList.sort((a, b) => Math.hypot(a.playerTick.position.x - 24000, a.playerTick.position.y) - Math.hypot(b.playerTick.position.x - 24000, b.playerTick.position.y))[0];
        const SWalt = wsList.sort((a, b) => Math.hypot(b.playerTick.position.x - 24000, b.playerTick.position.y) - Math.hypot(a.playerTick.position.x - 24000, a.playerTick.position.y))[0];
        const Ealt = wsList.sort((a, b) => Math.hypot(a.playerTick.position.x - 24000, a.playerTick.position.y - 12000) - Math.hypot(b.playerTick.position.x - 24000, b.playerTick.position.y - 12000))[0];
        const Walt = wsList.sort((a, b) => Math.hypot(b.playerTick.position.x - 24000, b.playerTick.position.y - 12000) - Math.hypot(a.playerTick.position.x - 24000, a.playerTick.position.y - 12000))[0];
        NWalt.network.sendInput({ up: 0, left: 0, down: 1, right: 1 });
        Nalt.network.sendInput({ up: 1, left: 0, down: 0, right: 0 });
        NEalt.network.sendInput({ up: 1, left: 0, down: 0, right: 1 });
        Ealt.network.sendInput({ up: 0, left: 0, down: 0, right: 1 });
        SEalt.network.sendInput({ up: 0, left: 0, down: 1, right: 1 });
        Salt.network.sendInput({ up: 0, left: 0, down: 1, right: 0 });
        SWalt.network.sendInput({ up: 0, left: 1, down: 1, right: 0 });
        Walt.network.sendInput({ up: 0, left: 1, down: 0, right: 0 });
        return;
    };
    lastMousePos = { x: mousePos.x, y: mousePos.y };
    dragBoxMenuOpenWhenStarted = dragBoxMenuOpen;
    placingSelectionWhenStarted = placingSelection;
    if(placingSelection) {
        for(let index in game.ui.components.PlacementOverlay.overlayEntities) {
            const entity = game.ui.components.PlacementOverlay.overlayEntities[index];
            entity.setVisible(0);
            delete game.ui.components.PlacementOverlay.overlayEntities[index];
        };
        game.ui.components.PlacementOverlay.overlayEntities = game.ui.components.PlacementOverlay.overlayEntities.filter(i => !!i);
        const mousePos = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
        let buildingSchema = game.ui.getBuildingSchema();
        let mousePosition = game.ui.getMousePosition();
        let world = game.world;
        for(let building of savedSelections[placingSelectionId]) {
            let schemaData = buildingSchema[building.tower];
            let worldPos = game.renderer.screenToWorld(mousePosition.x, mousePosition.y);
            worldPos.x += building.x;
            worldPos.y += building.y;
            let cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, {
                width: schemaData.gridWidth,
                height: schemaData.gridHeight
            });
            let cellSize = world.entityGrid.getCellSize();
            let cellAverages = {
                x: 0,
                y: 0
            };
            for (let i in cellIndexes) {
                if (!cellIndexes[i]) {
                    return false;
                }
                let cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
                cellAverages.x += cellPos.x;
                cellAverages.y += cellPos.y;
            }
            cellAverages.x = cellAverages.x / cellIndexes.length;
            cellAverages.y = cellAverages.y / cellIndexes.length;
            let gridPos = {
                x: cellAverages.x * cellSize + cellSize / 2,
                y: cellAverages.y * cellSize + cellSize / 2
            };
            const rpc = {
                name: "MakeBuilding",
                x: gridPos.x,
                y: gridPos.y,
                type: building.tower,
                yaw: building.yaw
            };
            game.network.sendRpc(rpc);
        };
        placingSelection = false;
    } else if(options.dragBox.enabled && !dragBoxMenuOpen) {
        dragBoxElem = document.createElement('div');
        dragBoxElem.classList.add('dragBox');
        dragBoxElem.style.top = `${mousePos.y}px`;
        dragBoxElem.style.left = `${mousePos.x}px`;
        document.body.appendChild(dragBoxElem);
    };
    mouseDown = true;
});

const rebuilders = {
};

const untilRpc = rpcName => {
    return new Promise((res, rej) => {
        let resolved = false;
        game.network.addRpcHandler(rpcName, data => {
            if(!resolved) {
                res(data);
                resolved = true;
            };
        });
    });
};

game.network.addEntityUpdateHandler(() => {
    let buildingSchema = game.ui.getBuildingSchema();
    let mousePosition = game.ui.getMousePosition();
    let world = game.world;
    const schema = game.ui.getBuildingSchema();
    for(let entity of placementOverlay.overlayEntities) {
        let worldPos = game.renderer.screenToWorld(mousePosition.x, mousePosition.y);
        worldPos.x += entity.towerOffset.x;
        worldPos.y += entity.towerOffset.y;
        let cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, {
            width: schema[entity.tower].gridWidth,
            height: schema[entity.tower].gridHeight
        });
        let cellSize = world.entityGrid.getCellSize();
        let cellAverages = {
            x: 0,
            y: 0
        };
        let gridPos_1 = {};
        for (let i in cellIndexes) {
            if (!cellIndexes[i]) {
                continue;
            };
            let cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
            gridPos_1 = {
                x: cellPos.x * cellSize + cellSize / 2,
                y: cellPos.y * cellSize + cellSize / 2
            };
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
        }
        cellAverages.x = cellAverages.x / cellIndexes.length;
        cellAverages.y = cellAverages.y / cellIndexes.length;
        const newPos = game.renderer.worldToUi(gridPos_1.x, gridPos_1.y);
        entity.setPosition(newPos.x, newPos.y);
    };
    for(let id in rebuilders) {
        const rebuilder = rebuilders[id];
        if(!rebuilder.enabled) { continue; };
        let towers = {};
        for(let uid in game.world.entities) {
            const entity = game.world.entities[uid];
            if(buildingModels.includes(entity.fromTick.model)) {
                const building = entity.targetTick.position;
                if(
                    building.x > Math.min(rebuilder.from.x, rebuilder.to.x) &&
                    building.x < Math.max(rebuilder.from.x, rebuilder.to.x) &&
                    building.y > Math.min(rebuilder.from.y, rebuilder.to.y) &&
                    building.y < Math.max(rebuilder.from.y, rebuilder.to.y)
                ) {
                    towers[uid] = {
                        type: entity.fromTick.model,
                        x: building.x,
                        y: building.y,
                        tier: entity.targetTick.tier,
                        yaw: entity.targetTick.yaw
                    };
                };
            }
        };
        if(rebuilder.lastTowers) {
            if(JSON.stringify(rebuilder.lastTowers) != JSON.stringify(towers)) {
                for(const uid in rebuilder.lastTowers) {
                    if(!towers[uid]) {
                        const tower = rebuilder.lastTowers[uid];
                        const buildingRpc = {
                            name: "MakeBuilding",
                            x: tower.x,
                            y: tower.y,
                            yaw: tower.yaw,
                            type: tower.type
                        };
                        game.network.sendRpc(buildingRpc);
                        untilRpc("LocalBuilding").then(data => {
                            for(const localTower of data) {
                                let isTower = true;
                                for(let key in localTower) {
                                    if(["dead", "tier", "uid"].includes(key)) { continue; };
                                    if(localTower[key] != buildingRpc[key]) {
                                        isTower = false;
                                    };
                                };
                                if(isTower) {
                                    if(localTower.tier == tower.tier) { return; };
                                    const towerUid = localTower.uid;
                                    for(let i = 0; i < tower.tier; i++) {
                                        game.network.sendRpc({
                                            name: "UpgradeBuilding",
                                            uid: towerUid
                                        });
                                    };
                                };
                            };
                        });
                    };
                };
            };
        };
        rebuilders[id].lastTowers = towers;
    };
});

addEventListener('mouseup', function(e) {
    if(!window.obo && e.button == 0) {
        for(const ws of Object.values(webSockets)) {
            ws.network.sendInput({ space: 1 });
            ws.network.sendInput({ space: 0 });
        };
    };
    if(e.button == 2 && window.scatterAlts && !menuOpen()) {
        for(const wsId in webSockets) {
            webSockets[wsId].network.sendInput({ left: 0, up: 0, down: 0, right: 0 });
            webSockets[wsId].moveType = window.scaOGs[wsId];
            moveType = window.scaOG;
        };
        return;
    };
    let newPos = { x: mousePos.x, y: mousePos.y };
    let oldPos = { x: lastMousePos.x, y: lastMousePos.y };
    if(options.dragBox.enabled && !dragBoxMenuOpenWhenStarted && !placingSelectionWhenStarted) {
        if(Math.hypot(newPos.x-oldPos.x, newPos.y-oldPos.y) < 10) {
            dragBoxElem.remove();
            return;
        };
        options.dragBox.enabled = false;
        dragBoxMenuElem = document.createElement('div');
        dragBoxMenuElem.classList.add('dragBoxMenu');
        dragBoxMenuElem.style.top = `${mousePos.y}px`;
        dragBoxMenuElem.style.left = `${mousePos.x}px`;
        dragBoxMenuElem.innerHTML = `
        <button id="saveSelection">Save Towers</button>
        <div id="selectionIdPrompt" style="display: none;">
            <input type="text" id="selectionId" placeholder="Selection ID..." />
            <small style="color: red; display: none;" id="selectionIdErrorMessage">That selection ID is already taken. Please try again.</small>
            <button id="saveSelectionIdPrompt">Save</button>
            <button id="exitSelectionIdPrompt">Exit</button>
        </div>
        <button id="saveRebuilder">Save Rebuilder</button>
        <div id="rebuilderIdPrompt" style="display: none;">
            <input type="text" id="rebuilderId" placeholder="Rebuilder ID..." />
            <small style="color: red; display: none;" id="rebuilderIdErrorMessage">That rebuilder ID is already taken. Please try again.</small>
            <button id="saveRebuilderIdPrompt">Save</button>
            <button id="exitRebuilderIdPrompt">Exit</button>
        </div>
        <button id="cancelDragBox">Cancel</button>
        `;
        document.body.appendChild(dragBoxMenuElem);
        document.getElementById("cancelDragBox").addEventListener("click", function() {
            dragBoxMenuElem.remove();
            dragBoxElem.remove();
            dragBoxMenuOpen = false;
            options.dragBox.enabled = true;
        });
        document.getElementById("saveSelection").addEventListener("click", function() {
            this.style.display = "none";
            document.getElementById("selectionIdPrompt").style.display = "block";
            document.getElementById("selectionId").value = "";
        });
        document.getElementById("saveSelectionIdPrompt").addEventListener("click", function() {
            const selectionId = document.getElementById("selectionId").value;
            if(savedSelections[selectionId]) {
                document.getElementById("selectionIdErrorMessage").style.display = "block";
            } else {
                const pos1 = game.renderer.screenToWorld(oldPos.x, oldPos.y);
                const pos2 = game.renderer.screenToWorld(newPos.x, newPos.y);
                const centerPos = {
                    x: (pos1.x + pos2.x) / 2,
                    y: (pos1.y + pos2.y) / 2
                };
                let towers = [];
                for(let uid in game.world.entities) {
                    const entity = game.world.entities[uid];
                    if(buildingModels.includes(entity.fromTick.model)) {
                        const building = entity.targetTick.position;
                        if(
                            building.x > Math.min(pos1.x, pos2.x) &&
                            building.x < Math.max(pos1.x, pos2.x) &&
                            building.y > Math.min(pos1.y, pos2.y) &&
                            building.y < Math.max(pos1.y, pos2.y)
                        ) {
                            towers.push({
                                tower: entity.fromTick.model,
                                x: building.x - centerPos.x,
                                y: building.y - centerPos.y,
                                tier: entity.targetTick.tier,
                                yaw: entity.targetTick.yaw
                            });
                        };
                    }
                };
                savedSelections[selectionId] = towers;
                dragBoxMenuElem.remove();
                dragBoxElem.remove();
                dragBoxMenuOpen = false;
                options.dragBox.enabled = true;
                updateNav();
            };
        });
        document.getElementById("selectionId").addEventListener("keydown", function(e) {
            if(e.keyCode == 13) {
                document.getElementById("saveSelectionIdPrompt").click();
            };
        });
        document.getElementById("exitSelectionIdPrompt").addEventListener("click", function() {
            document.getElementById("selectionIdPrompt").style.display = "none";
        });
        document.getElementById("saveRebuilderIdPrompt").addEventListener("click", function() {
            const rebuilderId = document.getElementById("rebuilderId").value;
            if(rebuilders[rebuilderId]) {
                document.getElementById("rebuilderIdErrorMessage").style.display = "block";
            } else {
                rebuilders[rebuilderId] = {
                    from: game.renderer.screenToWorld(oldPos.x, oldPos.y),
                    to: game.renderer.screenToWorld(newPos.x, newPos.y),
                    enabled: true
                };
                dragBoxMenuElem.remove();
                dragBoxElem.remove();
                dragBoxMenuOpen = false;
                options.dragBox.enabled = true;
                updateNav();
            };
        });
        document.getElementById("rebuilderId").addEventListener("keydown", function(e) {
            if(e.keyCode == 13) {
                document.getElementById("saveRebuilderIdPrompt").click();
            };
        });
        document.getElementById("exitRebuilderIdPrompt").addEventListener("click", function() {
            document.getElementById("rebuilderIdPrompt").style.display = "none";
        });
        document.getElementById("saveRebuilder").addEventListener("click", function() {
            this.style.display = "none";
            document.getElementById("rebuilderIdPrompt").style.display = "block";
            document.getElementById("rebuilderId").value = "";
        });
    };
    mouseDown = false;
});
addEventListener('mousemove', function(e) {
    mousePos = { x: e.pageX, y: e.pageY };
    if(mouseDown && options.dragBox.enabled && !dragBoxMenuOpenWhenStarted) {
        dragBoxElem.style.top = `${Math.min(mousePos.y, lastMousePos.y)}px`;
        dragBoxElem.style.left = `${Math.min(mousePos.x, lastMousePos.x)}px`;
        dragBoxElem.style.width = `${Math.abs(mousePos.x - lastMousePos.x)}px`;
        dragBoxElem.style.height = `${Math.abs(mousePos.y - lastMousePos.y)}px`;
    };
});

let mouseX, mouseY;
addEventListener('mousemove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

const tfkStyles = `
button, input, select {
    transition: 125ms all;
}
input {
    cursor: text;
}
a:hover, input:focus {
    opacity: 0.7;
}
::selection {
    background-color: gold;
}
.hud-intro-form, .hud-intro-guide {
    background: rgba(255, 215, 0, 0.3) !important;
    box-shadow: 0px 0px 20px 20px rgba(255, 215, 0, 0.2);
}
.btn {
    cursor: pointer;
}
.btn-24k {
    background-color: #d4af37;
    box-shadow: 0px 0px 10px 10px rgba(212, 175, 55, 0.7);
}
.btn-24k:hover {
    background-color: rgba(212, 175, 55, 0.7);
    box-shadow: 0px 0px 10px 10px rgba(212, 175, 55, 0.5);
}
div.customPage {
    color: whitesmoke;
    padding: 15px;
}
.hud-intro::before {
    background: url("https://wallpaperaccess.com/full/4645975.jpg") !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
}
#sidebar {
    width: auto;
    display: inline-block;
    background-color: #111;
    height: 100%;
    padding: 25px;
    text-align: center;
    border-radius: inherit;
    float: left;
    position: sticky;
    overflow: auto;
}
#content {
    color: whitesmoke;
    height: 100%;
    width: auto;
    border-radius: inherit;
    padding: 15px;
    overflow: auto;
}
#hud-menu-settings {
    padding: 0px !important;
}
* {
    font-family: Hammersmith One;
}
.nav-btn {
    width: 100%;
}
h1 {
    text-align: center;
}
select.default {
    padding: 10px;
    display: inline-block;
    width: auto;
    height: 40px;
    line-height: 34px;
    padding: 8px 14px;
    background: #eee;
    border: 2px solid #eee;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
}
input[type='checkbox'] {
    cursor: default;
    display: inline-block;
}
.hud-party-member {
    color: whitesmoke !important;
    border: 2px solid rgba(0, 0, 0, 0.3);
    box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.3);
}
.dragBox {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.3);
    border: 3px solid rgba(0, 0, 0, 0.1);
}
.dragBoxMenu {
    background-color: whitesmoke;
    border-radius: 5px;
    color: #111;
    transform: translate(-50%, -50%);
    position: absolute;
    padding: 3px;
    width: auto;
}
.dragBoxMenu > button, .dragBoxMenu > input {
    width: 100%;
    background-color: whitesmoke;
    border: none;
    border-radius: 2px;
    cursor: default;
    transition: none;
}
.dragBoxMenu > button:hover, .dragBoxMenu > input:focus {
    background-color: grey;
    color: whitesmoke;
}
.dragBoxMenu > input:focus::placeholder {
    color: whitesmoke;
}
#topRight {
    float: right;
}
.topRight {
    text-decoration: none;
    opacity: 0.7;
    color: whitesmoke;
    margin: 25px;
}
.topRight:hover {
    opacity: 0.9;
}
.btn-label {
    cursor: text;
}
input[type='text'].default {
    padding: 11px 14px;
    margin: 10px 0px 0px 0px;
    background: #eee;
    border: none;
    font-size: 14px;
    border-radius: 4px;
}
#playerPerspInput, #perspType, .inputBtn {
    display: block;
    width: 150px;
    height: 40px;
    line-height: 34px;
    padding: 8px 14px;
    margin: 0 5px 10px;
    margin-left: 0px !important;
    background: #eee;
    border: 0;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}
#perspType {
    cursor: pointer;
}
#perspType, #playerPersp, #resetPersp {
    margin: 5px;
    margin-top: 10px;
    margin-left: 0px !important;
}
#anchorBtns {
    margin-top: 5px;
}
#anchorBtns > button {
    z-index: 5;
    background-color: orange;
    border: none;
    color: whitesmoke;
}
.hud-bottom-left {
    transform: scale(1.25);
    transition: 250ms all;
    margin-left: 45px;
    margin-bottom: 45px;
}
.hud-scanner-icon::before {
    background-image: url("https://cdn.discordapp.com/attachments/1100813173256368179/1103128363784228914/magnifying-glass-solid.svg");
    filter: invert(1);
}
#results {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    padding: 6px;
}
.resultDiv {
    display: inline-block;
    padding: 5px;
}
.resultDiv > a {
    text-decoration: none;
    color: gold;
}
.hud-leaderboard-party > strong {
    transition: font-size 150ms;
}
.hud-leaderboard-party > strong:hover {
    font-size: 25px;
}
.hud-map-resource {
    display: none;
    position: absolute;
    width: 4px;
    height: 4px;
    margin: -2px 0 0 -2px;
    background: #eee;
    border-radius: 50%;
    z-index: 2;
    transform: scale(0.6);
}

.hud-map-player {
    box-shadow: 0px 0px 1px 1px whitesmoke;
}
.hud-bottom-left:hover {
    transform: scale(175%);
    margin-left: 60px;
    margin-bottom: 84px;
}
`;
document.body.insertAdjacentHTML("beforeend", `<style>${tfkStyles}</style>`);

const playButton = document.getElementsByClassName("hud-intro-play")[0];

playButton.classList.replace("btn-green", "btn-24k");

document.querySelectorAll('.ad-unit, .hud-intro-wrapper > h2, .hud-intro-form > label, .hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());

document.getElementsByClassName("hud-intro-footer")[0].innerHTML = `
<span>© 2022 ehScripts, Inc.</span>
`;
document.querySelector(".hud-intro-left > a").style.visibility = "hidden";

document.querySelector(".hud-intro-wrapper > h1").innerHTML = "24<small>k</small>";

const sm = document.querySelector("#hud-menu-settings");
// MENU START
const menuHTML = `
<div id="sidebar">
<h1>24k</h1>
<div id="navigation">
</div>
</div>
<div id="content">
</div>
`;
// MENU END
sm.innerHTML = menuHTML;

const navElem = document.getElementById("navigation");
const contentElem = document.getElementById("content");

let activePage = "home";

const download = (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};

let moveType = "follow";

const pages = {
    "home": {
        name: "Home",
        html: `
<h1>24k</h1>
<p>Welcome to <b>24k!</b></p>
<hr />
<strong>Population: __POP__</strong>&nbsp; <button onclick="window.refreshPg();">Refresh</button>
<hr />
<h3>Options</h3>
<br />
__OPTIONS__
<br />
<label style="display:inline-block;margin-right:10px;">Anchor: </label>
<div id="anchorBtns" style="display:inline-block;">
<button style=\"border-top-left-radius: 25%; border-bottom-left-radius: 25%; \">←</button><button>→</button><button>↑</button><button style=\"border-top-right-radius: 25%; border-bottom-right-radius: 25%; \">↓</button>
</div>
<hr />
<h3>Keybinds</h3>
<br />
<strong>[N]:</strong> Zoom In<br />
<strong>[M]:</strong> Zoom Out<br />
<strong>[X]:</strong> Lock / Unlock Aim<br />
        `,
        replacements: [{
            old: "__OPTIONS__",
            new: () => {
                return Object.values(options).map(option => {
                    return `
                    <label>${option.name}: </label>
                    <select onchange="window.optUpdate('${option.id}', !!parseInt(this.value))">
                    <option value=1${option.enabled ? " selected" : ""}>On</option>
                    <option value=0${option.enabled ? "" : " selected"}>Off</option>
                    </select>
                    `;
                }).join("<br />");
            }
        }, {
            old: "__POP__",
            new: () => {
                let serverPop = 0;
                for (let party of Object.values(game.ui.parties)) {
                    serverPop += party.memberCount;
                };
                return serverPop;
            }
        }],
        script: `
    const AnchorButtons = document.getElementById("anchorBtns");
    const anchor = (dir) => {
        eval(\`anchor\${dir}Interval = setInterval(() => { game.network.sendInput({ \${dir.toLowerCase()}: 1 }); });\`)
    };

    const unanchor = (dir) => {
        eval(\`clearInterval(anchor\${dir}Interval);\`);
        game.network.sendInput({ left: 0, right: 0, up: 0, down: 0 });
    };
    AnchorButtons.childNodes[1].addEventListener('click', function() {
        if(this.style.backgroundColor == "") {
            this.style.backgroundColor = "green";
            anchor("Left");
        } else {
            this.style.backgroundColor = "";
            unanchor("Left");
        };
    });

    AnchorButtons.childNodes[2].addEventListener('click', function() {
        if(this.style.backgroundColor == "") {
            this.style.backgroundColor = "green";
            anchor("Right");
        } else {
            this.style.backgroundColor = "";
            unanchor("Right");
        };
    });

    AnchorButtons.childNodes[3].addEventListener('click', function() {
        if(this.style.backgroundColor == "") {
            this.style.backgroundColor = "green";
            anchor("Up");
        } else {
            this.style.backgroundColor = "";
            unanchor("Up");
        };
    });

    AnchorButtons.childNodes[4].addEventListener('click', function() {
        if(this.style.backgroundColor == "") {
            this.style.backgroundColor = "green";
            anchor("Down");
        } else {
            this.style.backgroundColor = "";
            unanchor("Down");
        };
    });
        `
    },
    "ws": {
        name: "Socket",
        html: `
<h1>WebSockets</h1>
<button class="btn btn-label">Alt Name: </button>
<select class="default" id="altName">
<optgroup label="Alt Name">
<option value="24k">24k</option>
<option value=0>Custom...</option>
</optgroup>
</select>
<input type="text" class="default" id="customName" placeholder="Custom name..." style="display: none;" />
<hr />
<button class="btn btn-green" id="sendWs">Send Alt</button>
<hr />
<h2>Active Alts</h2>
<label>Global Movement: </label><select id="movement"><optgroup label="Movement"><option value="mouseMove"${moveType == "mouseMove" ? " selected" : ""}>MouseMove</option><option value="mirror"${moveType == "mirror" ? " selected" : ""}>Mirror</option><option value="follow"${moveType == "follow" ? " selected" : ""}>Follow</option><option value="grapplingHook"${moveType == "grapplingHook" ? " selected" : ""}>Grappling Hook</option><option value="idle"${moveType == "idle" ? " selected" : ""}>Idle</option></optgroup></select>
<hr />
<div id="alts">
__ALTS__
</div>
`,
        script: `
const selectName = document.getElementById("altName");
const inputName = document.getElementById("customName");
document.getElementById("sendWs").addEventListener("click", function() {
    window.sendWs(selectName.value, inputName.value);
});
selectName.addEventListener("change", function() {
    if(this.value == 0) {
        inputName.style.display = "block";
    } else {
        inputName.style.display = "none";
    };
});
    document.getElementById("movement").addEventListener("change", function() {
        const mms = this.value;
        moveType = mms;
        grapplingHook = mms == "grapplingHook";
        for(const ws of Object.values(webSockets)) {
            ws.moveType = moveType;
            ws.network.sendInput({ left: 0, right: 0, up: 0, down: 0 });
        };
    });
`,
        replacements: [{
            old: "__ALTS__",
            new: () => Object.entries(webSockets).map(i => `<button class="btn btn-red" onclick="window.altMenu(${i[0]});">#${i[0]} ${i[1].name}</button>`).join("<br />")
        }]
    },
    "base": {
        name: "Base",
        html: `
<h1>Base</h1>
<h2>Misc. Options</h2>
<label>AHRC: </label><select onchange="window.AHRC = !!parseInt(this.value);"><optgroup label="AHRC"><option value=1__AHRC1__>On</option></option><option value=0__AHRC0__>Off</option></optgroup></select></select>
<hr />
<h2>Waves</h2>
<label>AITO: </label><select id="aito"><optgroup label="AITO"><option value=1__AITO1__>On</option></option><option value=0__AITO0__>Off</option></optgroup></select><br />
<hr />
<h2>Score</h2>
<label>Player Trick: </label><select onchange="window.playerTrickToggle = !!parseInt(this.value); window.playerTrick();"><optgroup label="Player Trick"><option value=1__PTON__>On</option></option><option value=0__PTOFF__>Off</option></optgroup></select><br />
<label>SPW Logger: </label><select onchange="window.scoreLogger = !!parseInt(this.value);"><optgroup label="SPW Logger"><option value=1__SLON__>On</option></option><option value=0__SLOFF__>Off</option></optgroup></select>
<hr />
<h2>Saved Tower Selections</h2>
__SELECTIONS__
<hr />
<h2>Saved Rebuilders</h2>
__REBUILDERS__
`,
        replacements: [{
            old: "__SELECTIONS__",
            new: () => {
                return Object.entries(savedSelections).map(i => {
                    return `<em>${i[0]}</em> - <strong>${i[1].length}</strong> towers <a href="javascript:void(0);" onclick="window.placeSelection('${i[0].replaceAll("'", "\\'")}');" style="color: turquoise;">Place</a>&nbsp;<a href="javascript:void(0);" onclick="window.deleteSelection('${i[0]}');" style="color: red;">Delete</a>`;
                }).join("<br />");
            }
        }, {
            old: "__REBUILDERS__",
            new: () => {
                return Object.entries(rebuilders).map(i => {
                    return `<em>${i[0]}</em> - <a href="javascript:void(0);" onclick="window.toggleRebuilder('${i[0].replaceAll("'", "\\'")}');" style="color: ${i[1].enabled ? "red" : "green"};">${i[1].enabled ? "Dis" : "En"}able</a>&nbsp;<a href="javascript:void(0);" onclick="window.deleteRebuilder('${i[0]}');" style="color: red;">Delete</a>`;
                }).join("<br />");
            }
        }, {
            old: "__SLON__",
            new: () => window.scoreLogger ? " selected" : ""
        }, {
            old: "__SLOFF__",
            new: () => window.scoreLogger ? "" : " selected"
        }, {
            old: "__PTON__",
            new: () => window.playerTrickToggle ? " selected" : ""
        }, {
            old: "__PTOFF__",
            new: () => window.playerTrickToggle ? "" : " selected"
        }, {
            old: "__AITO1__",
            new: () => window.startaito ? " selected" : ""
        }, {
            old: "__AITO0__",
            new: () => window.startaito ? "" : " selected"
        }, {
            old: "__AHRC1__",
            new: () => window.AHRC ? " selected" : ""
        }, {
            old: "__AHRC0__",
            new: () => window.AHRC ? "" : " selected"
        }],
        script: `
   let aitoInput = document.getElementById("aito");
   const toggleAito = () => {
       window.startaito = !window.startaito;
       if(window.startaito) {
           window.sendAitoAlt();
       };
   };
   aitoInput.addEventListener("change", function() {
       toggleAito(true);
   });
        `
    },
    "raid": {
        name: "Raid",
        html: `
<h1>Raid</h1>
<label>One by One: </label><select onchange="window.obo = !!parseInt(this.value);"><optgroup label="One by One"><option value=1__OBO1__>On</option></option><option value=0__OBO0__>Off</option></optgroup></select><br />
<label>Scatter Alts: </label><select onchange="window.scatterAlts = !!parseInt(this.value);"><optgroup label="Scatter Alts"><option value=1__SCA1__>On</option></option><option value=0__SCA0__>Off</option></optgroup></select><br />
<label>Alt ID Names: </label><select onchange="window.altIdNames = !!parseInt(this.value);"><optgroup label="Alt ID Names"><option value=1__AIN1__>On</option></option><option value=0__AIN0__>Off</option></optgroup></select><br />
<label>Aim Alts At Stash: </label><select onchange="window.aimAtStash = !!parseInt(this.value);"><optgroup label="Aim At Stash"><option value=1__AAS1__>On</option></option><option value=0__AAS0__>Off</option></optgroup></select>
`,
        replacements: [{
            old: "__OBO1__",
            new: () => window.obo ? " selected" : ""
        }, {
            old: "__OBO0__",
            new: () => window.obo ? "" : " selected"
        }, {
            old: "__SCA1__",
            new: () => window.scatterAlts ? " selected" : ""
        }, {
            old: "__SCA0__",
            new: () => window.scatterAlts ? "" : " selected"
        }, {
            old: "__AIN1__",
            new: () => window.altIdNames ? " selected" : ""
        }, {
            old: "__AIN0__",
            new: () => window.altIdNames ? "" : " selected"
        }, {
            old: "__AAS1__",
            new: () => window.aimAtStash ? " selected" : ""
        }, {
            old: "__AAS0__",
            new: () => window.aimAtStash ? "" : " selected"
        }]
    },
    "render": {
        name: "Render",
        html: `
<h1>Render</h1>
<label>Render Ground: </label><select onchange="game.renderer.ground.setVisible(!!parseInt(this.value));"><optgroup label="Render Ground"><option value=1__RGN1__>On</option></option><option value=0__RGN0__>Off</option></optgroup></select>
<hr />
<h2>Entity Perspective</h2>
<hr />
<input type="text" id="playerPerspInput" style="margin-right:10px;" placeholder="Player name..." class="hud-intro-name" /><button class="btn btn-blue" id="playerPersp" style="margin-top:6px;">Entity Perspective</button><button class="btn btn-red" id="resetPersp" style="margin-top:6px;">Reset View</button>
<select id="perspType"><option value="name" selected>Player Name</option><option value="uid">UID</option></select>
<h2>Player Viewport</h2>
<hr />
<label style="display:inline-block;margin-right:10px;">FreeCam?</label><input type="checkbox" id="freecam" style="display:inline-block;" />
<br />
<label style="display:inline-block;margin-right:10px;">Ghost?</label><input type="checkbox" id="Ghost" style="display:inline-block;" />
<br />
<label style="display:inline-block;margin-right:10px;">Lock Camera?</label><input type="checkbox" id="lockCam" style="display:inline-block;" />
        `,
        replacements: [{
            old: "__RGN1__",
            new: () => game.renderer.ground.isVisible ? " selected" : ""
        }, {
            old: "__RGN0__",
            new: () => game.renderer.ground.isVisible ? "" : " selected"
        }],
        script: `
const PlayerPerspectiveInput = document.getElementById("playerPerspInput");
const PlayerPerspectiveButton = document.getElementById("playerPersp");
const PlayerPerspectiveResetButton = document.getElementById("resetPersp");
let playerPerspectiveType = "name";
    const lookAtPlayer = name => {
        Object.values(game.world.entities)
            .forEach((entity => {
            if (entity.entityClass === "PlayerEntity") {
                if (entity.targetTick.name === name) {
                    game.renderer.followingObject = entity;
                };
            };
        }));
    };

    const lookAtEntity = uid => {
        Object.values(game.world.entities)
            .forEach((entity => {
            if (entity.uid === uid) {
                game.renderer.followingObject = entity;
            };
        }));
    };
    PlayerPerspectiveButton.addEventListener('click', function (event) {
        if(playerPerspectiveType === "name") {
            let PlayerNameVal = PlayerPerspectiveInput.value;
            lookAtPlayer(PlayerNameVal);
        } else {
            let EntityUidVal = PlayerPerspectiveInput.value;
            lookAtEntity(parseInt(EntityUidVal));
        };
    });
    const restoreView = () => {
        lookAtPlayer(game.world.localPlayer.entity.targetTick.name);
    };
    PlayerPerspectiveResetButton.addEventListener('click', function (event) {
        restoreView();
    });

    const PerspectiveTypeSelect = document.getElementById("perspType");
    PerspectiveTypeSelect.addEventListener('change', function(event) {
        switch(this.value) {
            case "uid":
                PlayerPerspectiveInput.placeholder = "Entity UID...";
                break;
            case "name":
                PlayerPerspectiveInput.placeholder = "Player Name...";
                break;
        };
        playerPerspectiveType = this.value;
    });
    const GhostInput = document.getElementById("Ghost");
    const FreecamInput = document.getElementById("freecam");
    const LockInput = document.getElementById("lockCam");
    const onGhost = event => {
        game.world.localPlayer.entity.targetTick.position = game.renderer.screenToWorld(event.clientX, event.clientY);
    };

    const toggleGhost = checked => {
        if(!checked) {
            removeEventListener('mousemove', onGhost);
        } else {
            addEventListener('mousemove', onGhost);
        };
    };
    GhostInput.addEventListener('change', function() {
        toggleGhost(this.checked);
    });

    const moveCameraTo = (x, y) => {
        game.renderer.follow({ getPositionX: () => x, getPositionY: () => y }); // The game doesn't even check if its an entity lol
    };

    const onFreecam = event => {
        let worldPos = game.renderer.screenToWorld(event.clientX, event.clientY);
        moveCameraTo(worldPos.x, worldPos.y);
    };

    const toggleFreecam = checked => {
        if(!checked) {
            removeEventListener('mousemove', onFreecam);
            game.renderer.followingObject = game.world.localPlayer.entity;
        } else {
            addEventListener('mousemove', onFreecam);
        };
    };

    FreecamInput.addEventListener('change', function() {
        toggleFreecam(this.checked);
    });

    const lockCamera = () => {
        let xSave = game.world.localPlayer.entity.getPositionX();
        let ySave = game.world.localPlayer.entity.getPositionY();
        window.lockCameraInterval = setInterval(() => {
            moveCameraTo(xSave, ySave);
        });
    };

    const unlockCamera = () => {
        clearInterval(window.lockCameraInterval);
        game.renderer.follow(game.world.localPlayer.entity);
    };

    LockInput.addEventListener('change', function() {
        if(this.checked) {
            lockCamera();
        } else {
            unlockCamera();
        };
    });

        `
    }
};

const updateNav = () => {
    navElem.innerHTML = "";
    let contentHTML = pages[activePage].html;
    if(pages[activePage].replacements) {
        for(let replacement of pages[activePage].replacements) {
            contentHTML = contentHTML.replaceAll(replacement.old, replacement.new());
        };
    };
    contentElem.innerHTML = contentHTML;
    eval(pages[activePage].script);
    for(let id in pages) {
        let page = pages[id];
        navElem.innerHTML += `
        <hr />
        <button class="btn nav-btn${id == activePage ? " btn-24k" : ""}" id="btn-${id}">${page.name}</button>
        `;
    };
    for(let id in pages) {
        document.getElementById(`btn-${id}`).addEventListener('click', function() {
            activePage = id;
            updateNav();
        });
    };
};

updateNav();

const hideMenu = () => {
    document.getElementById("hud-menu-settings").style.display = "none";
};

window.placeSelection = id => {
    hideMenu();
    game.ui.components.PlacementOverlay.addMouseOverlay(savedSelections[id]);
    placingSelection = true;
    placingSelectionId = id;
};

window.deleteSelection = id => {
    delete savedSelections[id];
    updateNav();
};

window.deleteRebuilder = id => {
    delete rebuilders[id];
    updateNav();
};

window.refreshPg = () => {
    updateNav();
};

const placementOverlay = game.ui.components.PlacementOverlay;

game.ui.components.PlacementOverlay.overlayEntities = [];

game.ui.components.PlacementOverlay.addMouseOverlay = function (towers) {
    placementOverlay.buildingId && placementOverlay.cancelPlacing();
    placementOverlay.overlayEntities = [];

    const schema = game.ui.getBuildingSchema();

    for (let tower of towers) {
        const mouseWorldPos = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
        const buildingType = schema[tower.tower],
              placeholderEntity = Game.currentGame.assetManager.loadModel(buildingType.modelName, {});
        placeholderEntity.setAlpha(0.5);
        placeholderEntity.setRotation(tower.yaw);
        placeholderEntity.setPosition(0, 0);
        placeholderEntity.towerOffset = { x: tower.x, y: tower.y };
        placeholderEntity.tower = tower.tower;

        Game.currentGame.renderer.ui.addAttachment(placeholderEntity);
        placementOverlay.overlayEntities.push(placeholderEntity);
    };
};

const webSockets = {};
let wsId = 0;

window.sendWs = (name, custom) => {
    name == 0 && (name = custom);
    let iframe = document.createElement('iframe');
    iframe.src = 'https://zombs.io/#alt';
    iframe.style.display = 'none';
    document.body.append(iframe);

    let iframeWindow = iframe.contentWindow;
    iframe.addEventListener("load", () => {
        let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
        iframeWindow.game.network.connectionOptions = connectionOptions;
        iframeWindow.game.network.connected = true;

        let ws = new WebSocket(`wss://${connectionOptions.hostname}:443`);
        ws.binaryType = 'arraybuffer';

        ws.onopen = (data) => {
            ws.network = new game.networkType();
            ws.inputPacketCreator = new game.inputPacketCreatorType();

            ws.network.sendPacket = (_event, _data) => {
                ws.send(ws.network.codec.encode(_event, _data));
            };

            ws.playerTick = {};

            ws.onRpc = (data) => {
                switch(data.name){
                    case 'Dead':
                        ws.network.sendPacket(3, { respawn: 1 });
                        break;
                };
            };

            ws.moveType = moveType;

            ws.gameUpdate = () => {
                ws.moveToward = (position) => {
                    let x = Math.round(position.x);
                    let y = Math.round(position.y);

                    let myX = Math.round(ws.playerTick.position.x);
                    let myY = Math.round(ws.playerTick.position.y);

                    let offset = 100;

                    if (-myX + x > offset) ws.network.sendInput({ left: 0 }); else ws.network.sendInput({ left: 1 });
                    if (myX - x > offset) ws.network.sendInput({ right: 0 }); else ws.network.sendInput({ right: 1 });

                    if (-myY + y > offset) ws.network.sendInput({ up: 0 }); else ws.network.sendInput({ up: 1 });
                    if (myY - y > offset) ws.network.sendInput({ down: 0 }); else ws.network.sendInput({ down: 1 });
                };
                if(ws.moveType == "mouseMove") {
                    ws.moveToward(game.renderer.screenToWorld(game.inputManager.mousePosition.x, game.inputManager.mousePosition.y));
                    return;
                };
                if(ws.moveType == "follow") {
                    ws.moveToward(game.ui.playerTick.position);
                    return;
                };
            };

            ws.entities = {};

            ws.onmessage = msg => {
                if (new Uint8Array(msg.data)[0] == 5){
                    game.network.codec.decodePreEnterWorldResponse = buffer => buffer;

                    let data = iframeWindow.game.network.codec.decodePreEnterWorldResponse(game.network.codec.decode(msg.data));

                    ws.send(ws.network.codec.encode(4, { displayName: name, extra: data.extra}));
                    return;
                };

                ws.data = ws.network.codec.decode(msg.data);

                let gameMousePos, gameMWPos, nearestStashPos, nearestSPS;

                switch(ws.data.opcode) {
                    case 0:
                        for(const uid in ws.data.entities) {
                            if(ws.data.entities[uid] == true) { continue; };
                            const entity = ws.entities[uid] || ws.data.entities[uid];
                            if(uid == game.world.myUid || Object.values(webSockets).filter(i => i.playerTick.uid !== ws.playerTick.uid).find(i => i.playerTick.uid == uid)) { continue; };
                            if(ws.entities[uid]) {
                                for(const key in ws.data.entities[uid]) {
                                    ws.entities[uid][key] = ws.data.entities[uid][key];
                                };
                                if(uid != ws.playerTick.uid && game.world.entities[uid]) {
                                    game.world.updateEntity(uid, ws.entities[uid]);
                                    continue;
                                };
                            };
                            if(!ws.entities[uid]) {
                                game.world.createEntity(ws.data.entities[uid]);
                                ws.entities[uid] = ws.data.entities[uid];
                            };
                        }

                        for(const uid in ws.entities) {
                            if(!ws.data.entities[uid] && game.world.entities[uid]) {
                                game.world.removeEntity(uid);
                            };
                        };

                        ws.playerTick = ws.entities[ws.uid];
                        ws.playerTick.uid = ws.uid;

                        gameMousePos = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
                        gameMWPos = game.renderer.worldToScreen(gameMousePos.x + (game.ui.playerTick.position.x - ws.playerTick.position.x), gameMousePos.y + (game.ui.playerTick.position.y - ws.playerTick.position.y));

                        if(window.aimAtStash) {
                            nearestStashPos = Object.values(game.world.entities).filter(i => i.fromTick.model == "GoldStash").map(i => i.targetTick.position).sort((a, b) => Math.hypot(a.x - ws.playerTick.position.x, a.y - ws.playerTick.position.y) - Math.hypot(b.x - ws.playerTick.position.x, b.y - ws.playerTick.position.y))[0];
                            nearestStashPos && (nearestSPS = game.renderer.worldToScreen(nearestStashPos.x + (game.ui.playerTick.position.x - ws.playerTick.position.x), nearestStashPos.y + (game.ui.playerTick.position.y - ws.playerTick.position.y)));
                        };

                        ws.network.sendInput({
                            mouseMoved: ws.inputPacketCreator.screenToYaw(nearestSPS ? nearestSPS.x : gameMWPos.x, nearestSPS ? nearestSPS.y : gameMWPos.y),
                            worldX: 0, worldY: 0, distance: 0
                        });

                        ws.gameUpdate();
                        break;
                    case 4:
                        ws.send(iframeWindow.game.network.codec.encode(6, {}));
                        iframe.remove();
                        ws.uid = ws.data.uid;
                        ws.name = name;
                        (ws.joinMainParty = () => { ws.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey }); })();
                        console.log(ws.joinMainParty);
                        wsId++;
                        ws.id = wsId;
                        webSockets[wsId] = ws;
                        updateNav();
                        break;
                    case 9:
                        ws.onRpc(ws.data);
                        break;
                }
            }

            ws.onclose = e => {
                iframe.remove();
            };
        };
    });
};

const turnTowards = (x, y) => {
    let worldPos = game.renderer.worldToScreen(x, y);
    game.inputManager.emit('mouseMoved', { clientX: worldPos.x, clientY: worldPos.y });
};

let blockedNames = [];

window.blockPlayer = name => {
    game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to block ${name}?`, 3500, () => {
        blockedNames.push(name);
        for(let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
            if(msg.childNodes[2].innerText === name) {
                let bl = msg.childNodes[0];
                bl.innerHTML = "Unblock";
                bl.style.color = "red";
                bl.onclick = () => {
                    window.unblockPlayer(name);
                };
            };
        };
    }, () => {});
};

const getClock = () => {
    var date = new Date();
    var d = date.getDate();
    var d1 = date.getDay();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds()
    var session = "PM";

    if(h == 2){
        h = 12;
    };

    if(h < 13) {
        session = "AM"
    };
    if(h > 12){
        session = "PM";
        h -= 12;
    };

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    return `${h}:${m} ${session}`;
}

const kickAll = () => {
    const kickInterval = setInterval(() => {
        if(!game.ui.playerPartyMembers[1]) { clearInterval(kickInterval); return; };
        game.network.sendRpc({
            name: "KickParty",
            uid: game.ui.playerPartyMembers[1].playerUid
        });
    }, 100);
};

const joinAll = () => {
    for (const sck of Object.values(webSockets)) {
        sck.joinMainParty();
    };
};

let isDay,
    tickStarted,
    tickToEnd,
    hasKicked = false,
    hasJoined = false;

game.network.addEntityUpdateHandler(tick => {
    if(window.playerTrickToggle) {
        if (!hasKicked) {
            if (tick.tick >= tickStarted + 22 * (1000 / game.world.replicator.msPerTick)) {
                kickAll();
                hasKicked = true;
            };
        };
        if (!hasJoined) {
            if (tick.tick >= tickStarted + 118 * (1000 / game.world.replicator.msPerTick)) {
                joinAll();
                hasJoined = true;
            };
        };
    };
});

game.network.addRpcHandler("DayCycle", e => {
    if(window.playerTrickToggle) {
        isDay = !!e.isDay;
        if (!isDay) {
            tickStarted = e.cycleStartTick;
            tickToEnd = e.nightEndTick;
            hasKicked = false;
            hasJoined = false;
        };
    };
});

window.unblockPlayer = name => {
    blockedNames.splice(blockedNames.indexOf(name), 1);
    for(let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
        if(msg.childNodes[2].innerText === name) {
            let bl = msg.childNodes[0];
            bl.innerHTML = "Block";
            bl.style.color = "red";
            bl.onclick = () => {
                window.blockPlayer(name);
            };
        };
    };
};

let oldScore = 0,
    newScore = 0;
Game.currentGame.network.addRpcHandler("DayCycle", () => {
    if (game.ui.components.DayNightTicker.tickData.isDay == 0 && window.scoreLogger) {
        newScore = game.ui.playerTick.score;
        game.network.sendRpc({ name:"SendChatMessage", message: `Wave: ${game.ui.playerTick.wave}, Score: ${(newScore - oldScore).toLocaleString("en")}`, channel: "Local" })
        oldScore = game.playerTick.score;
    };
});

Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
let onMessageReceived = (msg => {
    if(blockedNames.includes(msg.displayName) || window.chatDisabled) { return; };
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = msg.displayName.replaceAll(/<(?:.|\n)*?>/gm, ''),
        c = msg.message.replaceAll(/<(?:.|\n)*?>/gm, '')
    if(c.startsWith("MjRr")) {
        // Encoded chat feature (finish in beta pls)
        const encodedMsg = atob(msg.message.slice(4)).split("").map(i => String.fromCharCode(i.charCodeAt(0) + 20)).join("");
        c = encodedMsg;
    };
    let d = a.ui.createElement(`<div class="hud-chat-message"><a href="javascript:void(0);" onclick="window.blockPlayer(\`${b.replaceAll(">", "").replaceAll("`", "").replaceAll(")", "").replaceAll("(", "")}\`)" style="color: red;">Block</a> <strong>${b}</strong> <small> at ${getClock()}</small>: ${c}</div>`);
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
})
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);

window.altMenu = altId => {
    const ws = webSockets[altId];
    document.getElementById(`btn-${activePage}`).classList.remove("btn-24k");
    activePage = null;
    contentElem.innerHTML = `
    <h1>#${altId} ${ws.name}</h1>
    <label>Movement: </label><select id="movement"><optgroup label="Movement"><option value="mouseMove"${ws.moveType == "mouseMove" ? " selected" : ""}>MouseMove</option><option value="mirror"${ws.moveType == "mirror" ? " selected" : ""}>Mirror</option><option value="follow"${ws.moveType == "follow" ? " selected" : ""}>Follow</option><option value="grapplingHook"${ws.moveType == "grapplingHook" ? " selected" : ""}>Grappling Hook</option><option value="idle"${ws.moveType == "idle" ? " selected" : ""}>Idle</option></optgroup></select><hr />
    <input type="text" class="inputBtn" id="psk" style="width: 300px;" placeholder="Party share key..." /><button class="btn btn-discord" id="joinParty">Join Party</button><hr />
    <button class="btn btn-red" id="leaveParty">Leave Party</button>
    <hr />
    <button id="deleteAlt" class="btn btn-red">Delete Alt</button>
    `;
    document.getElementById("movement").addEventListener("change", function() {
        const mms = this.value;
        ws.moveType = mms;
        ws.network.sendInput({ left: 0, right: 0, up: 0, down: 0 });
    });
    document.getElementById("deleteAlt").addEventListener("click", function() {
        ws.close();
        delete webSockets[ws.id];
        activePage = "ws";
        updateNav();
    });
    document.getElementById("leaveParty").addEventListener("click", function() {
        ws.network.sendRpc({ name: "LeaveParty" });
    });
    const psk = document.getElementById("psk");
    document.getElementById("joinParty").addEventListener("click", function() {
        ws.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: psk.value });
        psk.value = "";
    });
};

const moveTowards = (targetX, targetY, movesMade) => {
    let player = game.world.localPlayer.entity.targetTick.position;
    if (player.x <= targetX && player.y <= targetY) {
        game.network.sendInput({
            right: 1,
            left: 0,
            up: 0,
            down: 1
        });
    } else if (player.x >= targetX && player.y <= targetY) {
        game.network.sendInput({
            right: 0,
            left: 1,
            up: 0,
            down: 1
        });
    } else if (player.x <= targetX && player.y >= targetY) {
        game.network.sendInput({
            right: 1,
            left: 0,
            up: 1,
            down: 0
        });
    } else if (player.x >= targetX && player.y >= targetY) {
        game.network.sendInput({
            right: 0,
            left: 1,
            up: 1,
            down: 0
        });
    };
    turnTowards(targetX, targetY);
    return movesMade + 1;
};

addEventListener('contextmenu', function(e) {
    e.preventDefault();
    let pos = game.renderer.screenToWorld(mouseX, mouseY);
    if(options.grapplingHook.enabled) {
        let grapplInterval = setInterval(() => {
            moveTowards(pos.x, pos.y, 0);
        }, 100);
        setTimeout(() => {
            game.network.sendInput({ right: 0, left: 0, up: 0, down: 0 });
            clearInterval(grapplInterval);
        }, 1800);
    };
    for(const id in webSockets) {
        const ws = webSockets[id];
        if(ws.moveType == "grapplingHook") {
            let grapplInterval = setInterval(() => {
                ws.moveToward(pos);
            }, 100);
            setTimeout(() => {
                ws.network.sendInput({ right: 0, left: 0, up: 0, down: 0 });
                clearInterval(grapplInterval);
            }, 1800);
        };
    };
});

window.sendAitoAlt = () => {
    let iframe = document.createElement('iframe');
    iframe.src = 'https://zombs.io';
    iframe.style.display = 'none';
    document.body.append(iframe);

    let iframeWindow = iframe.contentWindow;
    iframe.addEventListener("load", () => {
        let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
        iframeWindow.game.network.connectionOptions = connectionOptions;
        iframeWindow.game.network.connected = true;
        connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];

        let ws = new WebSocket(`wss://${connectionOptions.hostname}:443`);

        ws.binaryType = "arraybuffer";

        ws.onclose = () => {
            ws.isclosed = true;
        };

        ws.onmessage = msg => {
            if (new Uint8Array(msg.data)[0] == 5){
                game.network.codec.decodePreEnterWorldResponse = buffer => buffer;

                let data = iframeWindow.game.network.codec.decodePreEnterWorldResponse(game.network.codec.decode(msg.data));

                ws.network = new game.networkType();
                ws.send(ws.network.codec.encode(4, { displayName: "24K AITO", extra: data.extra}));

                ws.network.sendPacket = (_event, _data) => {
                    ws.send(ws.network.codec.encode(_event, _data));
                };
                return;
            };

            ws.data = ws.network.codec.decode(msg.data);

            if (ws.data.uid) {
                ws.uid = ws.data.uid;
            };

            if (ws.data.name) {
                ws.dataType = ws.data;
            };

            if (!window.startaito && !ws.isclosed) {
                ws.isclosed = true;

                ws.close();
            };

            if (ws.verified) {
                if (!ws.isDay && !ws.isclosed) {
                    ws.isclosed = true;

                    ws.close();

                    window.sendAitoAlt();
                };
            };

            if (ws.data.name == "DayCycle") {
                ws.isDay = ws.data.response.isDay;

                if (ws.isDay) {
                    ws.verified = true;
                };
            };

            if (ws.data.name == "Dead") {
                ws.network.sendRpc({
                    respawn: 1
                });
            };

            if (ws.data.name == "Leaderboard") {
                ws.lb = ws.data;

                if (ws.psk) {
                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.getPlayerPartyShareKey()
                    });

                    if (ws.psk.response.partyShareKey == game.ui.getPlayerPartyShareKey()) {
                        ws.network.sendRpc({
                            name: "BuyItem",
                            itemName: "Pause",
                            tier: 1
                        });
                    };
                };
            };

            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
            };
        };
    });
};

let ahrcInterval = setInterval(() => {
    if(window.AHRC) {
        const entities = game.world.entities;
        for(const uid in entities) {
            const obj = entities[uid];
            if(obj.fromTick.model == "Harvester") {
                let amount = obj.fromTick.tier * 0.07 - 0.02;
                game.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: obj.fromTick.uid,
                    deposit: amount
                });
                game.network.sendRpc({
                    name: "CollectHarvester",
                    uid: obj.fromTick.uid
                });
            }
        }
    };
}, 20);

const fullRSS = () => {
    if(!options.frss.enabled) { return; };
    let resources = ["wood", "stone", "gold"];
    let pt = game.ui.playerTick;
    let rc = game.ui.components.Resources;
    for(let i = 0; i < resources.length; i++) {
        let rs = resources[i];
        rc[`${rs}Elem`].innerHTML = Math.round(pt[rs]).toLocaleString("en");
    };
    rc.tokensElem.innerHTML = Math.round(pt.token).toLocaleString("en");
};

game.network.addEnterWorldHandler(() => {
    game.ui.addListener('playerTickUpdate', fullRSS);
});

game.network.sendPacket2 = game.network.sendPacket;
game.network.sendPacket = (opcode, packet) => {
    if(opcode == 3) {
        if(Object.keys(packet).find(i => ["up", "down", "left", "right"].includes(i))) {
            for(const ws of Object.values(webSockets)) {
                if(ws.moveType == "mirror") {
                    ws.network.sendInput(packet);
                };
            };
        };
        if(typeof packet.space == "number" && !window.obo) {
            for(const ws of Object.values(webSockets)) {
                ws.network.sendInput(packet);
            };
        };
    };
    game.network.sendPacket2(opcode, packet);
};

let goldStashPos;

game.world.removeEntity2 = game.world.removeEntity;
game.world.removeEntity = uid => {
    const entity = game.world.entities[uid];
    if(["Tree", "Stone", "NeutralCamp", "Wall", "Door", "SlowTrap", "ArrowTower", "BombTower", "MagicTower", "ResourceHarvester", "CannonTower", "MeleeTower", "GoldMine", "GoldStash"].includes(entity.fromTick.model)) {
        if(Math.hypot(entity.targetTick.position.x - game.ui.playerTick.position.x, entity.targetTick.position.y - game.ui.playerTick.position.y) > 1500) {
            entity.setAlpha(0.5);
        };
        return;
    };
    game.world.removeEntity2(uid);
};

const minimap = document.getElementById("hud-map");

game.world.createEntity2 = game.world.createEntity;
game.world.createEntity = entity => {
    if(["Tree", "Stone", "NeutralCamp"].includes(entity.model)) {
        const entityDiv = document.createElement("div");
        entityDiv.classList.add("hud-map-resource");
        entityDiv.style.background = ({ Tree: "green", Stone: "grey", NeutralCamp: "red" })[entity.model];
        entityDiv.style.left = `${entity.position.x / 24000 * 100}%`;
        entityDiv.style.top = `${entity.position.y / 24000 * 100}%`;
        entityDiv.style.display = "block";
        minimap.appendChild(entityDiv);
    };
    if(["Wall", "Door", "SlowTrap", "ArrowTower", "BombTower", "MagicTower", "ResourceHarvester", "CannonTower", "MeleeTower", "GoldMine", "GoldStash"].includes(entity.model)) {
        const entityDiv = document.createElement("div");
        entityDiv.classList.add("hud-map-building");
        entityDiv.style.left = `${entity.position.x / 24000 * 100}%`;
        entityDiv.style.top = `${entity.position.y / 24000 * 100}%`;
        entityDiv.style.display = "block";
        minimap.appendChild(entityDiv);
    };
    game.world.createEntity2(entity);
};

let dimension = 1;

const onWindowResize = () => {
    const renderer = Game.currentGame.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = Math.max(canvasWidth / (1920 * dimension), canvasHeight / (1080 * dimension));
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
}

onWindowResize();

window.onresize = onWindowResize;

window.onwheel = e => {
    if(menuOpen()) { return; };
    if (e.deltaY > 0) {
        dimension = dimension * 1.03;
        onWindowResize();
    } else if (e.deltaY < 0) {
        dimension = dimension * 0.97;
        onWindowResize();
    }
}

addEventListener("keypress", function(e) {
    if(document.activeElement.tagName == "INPUT") { return; };
    console.log(e.keyCode);
    switch(e.keyCode) {
        case 110:
            dimension = dimension * 0.9;
            onWindowResize();
            break;
        case 109:
            dimension = dimension * 1.1;
            onWindowResize();
            break;
        case 120:
            game.inputPacketCreator.sendMouseMoveChance = !!game.inputPacketCreator.sendMouseMoveChance ? 0 : 1;
            break;
    };
});

addEventListener("click", function() {
    if(window.obo) {
        const pos = game.renderer.screenToWorld(mousePos.x, mousePos.y);
        for(const entity of Object.values(game.world.entities)) {
            if(Math.hypot(entity.targetTick.position.x-pos.x, entity.targetTick.position.y-pos.y) < 50) {
                if(entity.fromTick.model == "GamePlayer") {
                    console.log(entity.uid);
                    console.log(Object.values(webSockets)[0].playerTick.uid);
                    for(const ws of Object.values(webSockets)) {
                        if(ws.playerTick.uid == entity.uid) {
                            ws.network.sendInput({ space: 1 });
                            ws.network.sendInput({ space: 0 });
                            setTimeout(() => {
                                ws.network.sendInput({ space: 1 });
                                ws.network.sendInput({ space: 0 });
                            }, 250);
                        };
                    };
                };
            };
        };
    };
});

let ws;
let opcode5Listeners = [];

const decodeOpcode5 = (data) => {
    return new Promise((res, rej) => {
        ws.send(JSON.stringify({ type: "decodePreEnterWorld", data: data, preEnterWorldToken: ws.preEnterWorldToken }));
        opcode5Listeners.push((decoded) => {
            res(decoded);
        });
    });
};

let scannerAlts = [];

const scanServer = serverId => {
    return new Promise((res, rej) => {
        let connectionOptions = game.options.servers[serverId];

        let ws = new WebSocket(`wss://${connectionOptions.hostname}:443`);
        scannerAlts.push(ws);
        ws.binaryType = 'arraybuffer';

        ws.onopen = (data) => {
            ws.network = new game.networkType();

            ws.network.sendPacket = (_event, _data) => {
                ws.send(ws.network.codec.encode(_event, _data));
            };

            ws.onmessage = msg => {
                if (new Uint8Array(msg.data)[0] == 5) {
                    ws.network = new game.networkType();

                    ws.network.sendPacket = (e, t) => {
                        ws.readyState === 1 && ws.send(ws.network.codec.encode(e, t));
                    };
                    decodeOpcode5(Array.from(new Uint8Array(msg.data))).then(decoded => {
                        ws.network.sendPacket(4, {
                            displayName: "24k Scanner",
                            extra: new Uint8Array(decoded[5])
                        });

                        ws.EnterWorld2Response = decoded[6];
                    });

                    return;
                };

                const data = ws.network.codec.decode(msg.data);
                if(data.opcode == 4) {
                    ws.EnterWorld2Response && ws.send(new Uint8Array(ws.EnterWorld2Response));
                    for (let i = 0; i < 50; i++) ws.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125]));
                    ws.send(new Uint8Array([9, 6, 0, 0, 0, 126, 8, 0, 0, 108, 27, 0, 0, 146, 23, 0, 0, 82, 23, 0, 0, 8, 91, 11, 0, 8, 91, 11, 0, 0, 0, 0, 0, 32, 78, 0, 0, 76, 79, 0, 0, 172, 38, 0, 0, 120, 155, 0, 0, 166, 39, 0, 0, 140, 35, 0, 0, 36, 44, 0, 0, 213, 37, 0, 0, 100, 0, 0, 0, 120, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 6, 0, 0]));
                };
                if(data.name == "Leaderboard") {
                    if(!ws.partyList) { return; };
                    const population = ws.partyList.map(i => i.memberCount).reduce((a, b) => a + b);
                    if (data.response.length == 1 && population > 1) {
                        return;
                    };
                    res({ lb: data.response, pop: population });
                    ws.close();
                };
                if(data.name == "SetPartyList") {
                    ws.partyList = data.response;
                };
            }
        };
    });
};

const replNames = ["", "a", "b", "c"];

const newScannerWS = () => {
    fetch(`https://24k${replNames[Math.floor(Math.random() * replNames.length)]}.zombsscripts.repl.co`).then(res => res.text()).then(url => {
        const previousReconnect = ws ? ws.reconnect : 0;
        ws = new WebSocket(`wss://${url}`);
        ws.addEventListener("open", () => {
            ws.reconnect = previousReconnect;
            ws.send(JSON.stringify({ type: "getData" }));
            ws.addEventListener("message", msg => {
                const data = JSON.parse(msg.data);
                switch(data.type) {
                    case "scanServer":
                        ws.preEnterWorldToken = data.preEnterWorldToken;
                        setTimeout(() => {
                            let scanned = false;
                            scanServer(data.serverId).then(serverData => {
                                ws.send(JSON.stringify({ type: "serverData", serverId: data.serverId, lb: serverData.lb, pop: serverData.pop }));
                                ws.send(JSON.stringify({ type: "getData" }));
                                scanned = true;
                            });
                            setTimeout(() => {
                                if(!scanned) {
                                    ws.send(JSON.stringify({ type: "serverData", serverId: game.options.serverId, lb: game.ui.components.Leaderboard.leaderboardData, pop: Object.values(game.ui.parties).map(i => i.memberCount).reduce((a, b) => a + b) }));
                                    for(const scannerWs of scannerAlts) {
                                        scannerWs.close();
                                    };
                                    scannerAlts = [];
                                };
                            }, 28000);
                        }, 3000);
                        break;
                    case "scanData":
                        window.scanData = data.data;
                        for(const server of Array.from(document.querySelectorAll(".hud-intro-server > optgroup > option"))) {
                            const serverScanData = window.scanData[server.value];
                            server.innerHTML = `${game.options.servers[server.value].name} (${server.value}) { ${serverScanData ? serverScanData.pop : 32}/32 }${serverScanData ? ` ${serverScanData.lb[0].name.replaceAll(/<(?:.|\n)*?>/gm, '')} W: ${parseInt(serverScanData.lb[0].wave).toLocaleString("en")} | S: ${parseInt(serverScanData.lb[0].score).toLocaleString("en")}` : ""}`;
                        };
                        break;
                    case "preEnterWorldData":
                        for(let i in opcode5Listeners) {
                            opcode5Listeners[i](data.data);
                            delete opcode5Listeners[i];
                        };
                        break;
                };
            });
            ws.addEventListener("close", () => {
                if(ws.reconnect < 5) {
                    ws.reconnect++;
                    newScannerWS();
                };
            });
        });
    });
};

newScannerWS();

if(location.hash !== "#alt") {
    let hasEnteredWorld;
    game.network.addEnterWorldHandler(() => {
        if(hasEnteredWorld) {
            return;
        } else {
            hasEnteredWorld = true;
        };
        for (let i = 0; i < 50; i++) game.network.socket.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125]));
        game.network.socket.send(new Uint8Array([9, 6, 0, 0, 0, 126, 8, 0, 0, 108, 27, 0, 0, 146, 23, 0, 0, 82, 23, 0, 0, 8, 91, 11, 0, 8, 91, 11, 0, 0, 0, 0, 0, 32, 78, 0, 0, 76, 79, 0, 0, 172, 38, 0, 0, 120, 155, 0, 0, 166, 39, 0, 0, 140, 35, 0, 0, 36, 44, 0, 0, 213, 37, 0, 0, 100, 0, 0, 0, 120, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 6, 0, 0]));
        setTimeout(() => {
            ws.send(JSON.stringify({ type: "serverData", serverId: Object.values(game.options.servers).find(i => game.network.socket.url.split("/")[2].split(":")[0] == i.hostname).id, lb: game.ui.components.Leaderboard.leaderboardData, pop: Object.values(game.ui.parties).map(i => i.memberCount).reduce((a, b) => a + b) }));
        }, 2000);
        const scannerIcon = document.createElement("div");
        scannerIcon.classList.add("hud-menu-icon");
        scannerIcon.dataset.type = "Scanner";
        scannerIcon.innerText = "Scanner";
        scannerIcon.classList.add("hud-scanner-icon");

        document.getElementById("hud-menu-icons").appendChild(scannerIcon);

        const scannerMenu = document.createElement("div");
        window.scannerMenu = scannerMenu;
        scannerMenu.classList.add("hud-menu-settings");
        scannerMenu.style.height = "575px";
        scannerMenu.style.overflow = "scroll";
        scannerMenu.style.top = "400px";

        scannerMenu.innerHTML = `
<h1>24k Scanner</h1>
<p>Welcome to 24k's scanner made by ehScripts.</p>
<input type="text" class="inputBtn" id="nameScan" placeholder="Name to scan..." style="display: inline-block;" />
<button class="btn" id="scanName" style="display: inline-block;">Scan Name</button>&nbsp;&nbsp;
<input type="text" class="inputBtn" id="serverScan" placeholder="Server ID..." maxlength=5 value="v2004" style="width: 100px; display: inline-block;" />
<button class="btn" id="scanServer">Scan Server</button>
<br />
<select id="sortType" class="btn"><optgroup label="Sort Type"><option value="wave" selected>Wave</option><option value="score">Score</option></optgroup></select>
<select id="playerSort" class="btn"><optgroup label="Player Sort"><option value=1>High to Low</option><option value=0>Low to High</option></optgroup></select>
<select class="btn" style="width: 110px;" id="playerConstraints"><optgroup label="Player Constraints"><option value="1" selected="">Above:</option><option value="0">Below:</option></optgroup></select>
<input class="inputBtn" type="number" min="0" value="0" style="width: 150px; display: inline-block;" id="playerConstraintValue">
<hr />
<button class="btn" id="scanPop">Scan Population</button>
<select class="btn" style="width: 150px;" id="sortPop"><optgroup label="Sort Population"><option value=1 selected>High to Low</option><option value=0>Low to High</option></optgroup></select>
<select class="btn" style="width: 180px;" id="popConstraints"><optgroup label="Population Constraints"><option value=1>Above Population: </option><option value=0 selected>Below Population:</option></optgroup></select>&nbsp;
<input class="inputBtn" type="number" min=0 max=32 value=32 style="width: 60px; display: inline-block;" id="popConstraintValue" />
<hr />
<div id="results" style="overflow: scroll; height: 225px;">
Results will appear here.
</div>
`;

        document.getElementById("hud").appendChild(scannerMenu);

        scannerIcon.addEventListener("click", function() {
            scannerMenu.style.display = scannerMenu.style.display == "block" ? "none" : "block";
            game.ui.components.MenuShop.closeElem.click();
            game.ui.components.MenuParty.closeElem.click();
            game.ui.components.MenuSettings.closeElem.click();
            if(scannerMenu.style.display == "block") {
                ws.send(JSON.stringify({ type: "getData" }));
            };
        });

        const nameScan = document.getElementById("nameScan");
        const results = document.getElementById("results");
        const sortTypeSelect = document.getElementById("sortType");
        const playerSortSelect = document.getElementById("playerSort");
        const playerConstraintsSelect = document.getElementById("playerConstraints");
        const playerConstraintInput = document.getElementById("playerConstraintValue")

        document.getElementById("scanName").addEventListener("click", function() {
            const name = nameScan.value.toLowerCase();
            const sortType = sortTypeSelect.value;
            const playerSort = !!parseInt(playerSortSelect.value);
            const playerConstraints = !!parseInt(playerConstraintsSelect.value);
            const playerConstraintValue = playerConstraintInput.value;
            results.innerHTML = Object.entries(window.scanData).filter(i => i[1].lb.map).map(i => i[1].lb.map(j => new Object({ serverId: i[0], ...j }))).reduce((initial, current) => initial.concat(current), []).filter(i => i.name.toLowerCase().includes(name) && playerConstraints ? i[sortType] >= playerConstraintValue : i[sortType] < playerConstraintValue).sort((a, b) => playerSort ? b[sortType] - a[sortType] : a[sortType] - b[sortType]).map(i => `
<div class="resultDiv">
<a href="https://zombs.io/#/${i.serverId}/24k" target="_blank">${i.serverId}</a>: ${i.name.replaceAll(/<(?:.|\n)*?>/gm, '')}
<br /><strong>Wave: </strong>${parseInt(i.wave).toLocaleString("en")}<br /><strong>Score: </strong>${parseInt(i.score).toLocaleString("en")}
</div>
`).join("");
        });

        document.getElementById("scanPop").addEventListener("click", function() {
            const sortMethod = !!parseInt(document.getElementById("sortPop").value);
            const popConstraints = !!parseInt(document.getElementById("popConstraints").value);
            const popConstraintValue = document.getElementById("popConstraintValue").value;
            results.innerHTML = Object.entries(window.scanData).filter(i => i[0].startsWith("v") && i[1].pop && (popConstraints ? i[1].pop > popConstraintValue : i[1].pop < popConstraintValue)).sort((a, b) => !!sortMethod ? b[1].pop - a[1].pop : a[1].pop - b[1].pop).map(i => `
<div class="resultDiv">
<a href="https://zombs.io/#/v${parseInt(i[0].slice(1))}/24k" target="_blank">v${parseInt(i[0].slice(1))}</a><br />
<label>Population: </label>${parseInt(i[1].pop)}
</div>
`).join("");
        });

        document.getElementById("scanServer").addEventListener("click", function() {
            const serverId = document.getElementById("serverScan").value;
            const server = window.scanData[serverId];
            const sortType = sortTypeSelect.value;
            const playerSort = !!parseInt(playerSortSelect.value);
            const playerConstraints = !!parseInt(playerConstraintsSelect.value);
            const playerConstraintValue = playerConstraintInput.value;
            if(server) {
                results.innerHTML = `
<h3>${serverId}</h3> <hr />
<strong>Server Population: ${server.pop}</strong><hr />
${server.lb.filter(i => playerConstraints ? i[sortType] >= playerConstraintValue : i[sortType] < playerConstraintValue).sort((a, b) => playerSort ? b[sortType] - a[sortType] : a[sortType] - b[sortType]).map(i => `
<div class="resultDiv">
<strong>${i.name.replaceAll(/<(?:.|\n)*?>/gm, '')}</strong><br />
<strong>Wave: </strong>${parseInt(i.wave).toLocaleString("en")}<br />
<strong>Score: </strong>${parseInt(i.score).toLocaleString("en")}
</div>
`).join("")}

            `;
            };
        });

        for(const icon of document.querySelectorAll("#hud-menu-icons > div")) {
            if(icon.dataset.type == "Scanner") { continue; };
            icon.addEventListener("click", function() {
                window.scannerMenu.style.display = "none";
            });
        };

        window.toggleRebuilder = rebuilderId => {
            rebuilders[rebuilderId].enabled = !rebuilders[rebuilderId].enabled;
            updateNav();
        };
    });
};

const positionDiv = document.createElement("div");

positionDiv.style.color = "whitesmoke";
positionDiv.style.position = "absolute";
positionDiv.style.top = "50px";
positionDiv.style.width = "100vw";
positionDiv.style.textAlign = "center";
positionDiv.style.userSelect = "text";

document.body.appendChild(positionDiv);

game.network.addEntityUpdateHandler(() => {
    if(!game.ui.playerTick) { return; };
    const pp = game.ui.playerTick.position;
    for(const entity of Object.values(game.world.entities)) {
        const ep = entity.targetTick.position;
        if(Math.hypot(ep.x-pp.x, ep.y-pp.y) < 1500) {
            entity.setAlpha(1);
        };
    };
    positionDiv.innerText = `X: ${Math.round(game.ui.playerTick.position.x).toLocaleString("en")}, Y: ${Math.round(game.ui.playerTick.position.y).toLocaleString("en")}`
    for(const i of Object.entries(webSockets).filter(i => i[1].playerTick)) {
        const ws = i[1];
        const id = i[0];
        const entity = game.world.entities[ws.playerTick.uid];
        if(entity) {
            game.world.entities[ws.playerTick.uid].targetTick.name = window.altIdNames ? id : ws.name;
        };
    };
});

game.network.sendRpc2 = game.network.sendRpc;

game.network.sendRpc = m => {
    if(m.name == "MakeBuilding" && m.type == "GoldStash") {
        goldStashPos = { x: m.x, y: m.y };
    };
    if(["BuyItem", "EquipItem"].includes(m.name)) {
        for(const ws of Object.values(webSockets)) {
            ws.network.sendRpc(m);
        };
    };
    game.network.sendRpc2(m);
};

window.jj = () => webSockets;