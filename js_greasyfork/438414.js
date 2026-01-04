// ==UserScript==
// @name         SURVIV.IO HACK
// @namespace    https://github.com/iBLiSSIN
// @version      1.0.0
// @license MIT
// @description Survivio Hacks - Best Surviv Cheat 2021
// @author       vnbpm YT
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438414/SURVIVIO%20HACK.user.js
// @updateURL https://update.greasyfork.org/scripts/438414/SURVIVIO%20HACK.meta.js
// ==/UserScript==
! function () {
    return function n(e, t, i) {

        function a(r, s) {
            if (!t[r]) {
                if (!e[r]) {
                    var l = "function" == typeof require && require;
                    if (!s && l) return l(r, true);
                    if (o) return o(r, true);
                    var c = new Error("Cannot find module '" + r + "'");
                    throw c.code = "MODULE_NOT_FOUND", c
                }
                var p = t[r] = {
                    exports: {}
                };
                e[r][0].call(p.exports, function (n) {
                    return a(e[r][1][n] || n)
                }, p, p.exports, n, e, t, i)
            }
            return t[r].exports
        }
        for (var o = "function" == typeof require && require, r = 0; r < i.length; r++) a(i[r]);
        return a
    }
}()({
    1: [function (n, e, t) {
        "use strict";
        var i = [],
            a = function (n, e) {
                var t = document.head || document.getElementsByTagName("head")[0],
                    a = i[i.length - 1];
                if ((e = e || {}).insertAt = e.insertAt || "bottom", "top" === e.insertAt) a ? a.nextSibling ? t.insertBefore(n, a.nextSibling) : t.appendChild(n) : t.insertBefore(n, t.firstChild), i.push(n);
                else {
                    if ("bottom" !== e.insertAt) throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
                    t.appendChild(n)
                }
            };
        e.exports = {
            createLink: function (n, e) {
                var t = document.head || document.getElementsByTagName("head")[0],
                    i = document.createElement("link");
                for (var a in i.href = n, i.rel = "stylesheet", e)
                    if (e.hasOwnProperty(a)) {
                        var o = e[a];
                        i.setAttribute("data-" + a, o)
                    }
                t.appendChild(i)
            },
            createStyle: function (n, e, t) {
                t = t || {};
                var i = document.createElement("style");
                for (var o in i.type = "text/css", e)
                    if (e.hasOwnProperty(o)) {
                        var r = e[o];
                        i.setAttribute("data-" + o, r)
                    }
                i.sheet ? (i.innerHTML = n, i.sheet.cssText = n, a(i, {
                    insertAt: t.insertAt
                })) : i.styleSheet ? (a(i, {
                    insertAt: t.insertAt
                }), i.styleSheet.cssText = n) : (i.appendChild(document.createTextNode(n)), a(i, {
                    insertAt: t.insertAt
                }))
            }
        }
    }, {}],
    2: [function (n, e, t) {
        (function (n) {
            var i, a;
            i = void 0 !== n ? n : window || this.window || this.global, a = function (n) {
                "use strict";
                var e = {},
                    t = (document.querySelector("body"), !!/Mobi/.test(navigator.userAgent)),
                    i = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
                    a = "undefined" != typeof InstallTrigger,
                    o = "ontouchstart" in document.documentElement,
                    r = ["bottomRight", "bottomLeft", "bottomCenter", "topRight", "topLeft", "topCenter", "center"],
                    s = {};
                e.children = {};
                var l = {
                    id: null,
                    class: "",
                    title: "",
                    titleColor: "",
                    titleSize: "",
                    titleLineHeight: "",
                    message: "",
                    messageColor: "",
                    messageSize: "",
                    messageLineHeight: "",
                    backgroundColor: "",
                    theme: "light",
                    color: "",
                    icon: "",
                    iconText: "",
                    iconColor: "",
                    iconUrl: null,
                    image: "",
                    imageWidth: 50,
                    maxWidth: null,
                    zindex: null,
                    layout: 1,
                    balloon: false,
                    close: true,
                    closeOnEscape: false,
                    closeOnClick: false,
                    displayMode: 0,
                    position: "bottomRight",
                    target: "",
                    targetFirst: true,
                    timeout: 5e3,
                    rtl: false,
                    animateInside: true,
                    drag: true,
                    pauseOnHover: true,
                    resetOnHover: false,
                    progressBar: true,
                    progressBarColor: "",
                    progressBarEasing: "linear",
                    overlay: false,
                    overlayClose: false,
                    overlayColor: "rgba(0, 0, 0, 0.6)",
                    transitionIn: "fadeInUp",
                    transitionOut: "fadeOut",
                    transitionInMobile: "fadeInUp",
                    transitionOutMobile: "fadeOutDown",
                    buttons: {},
                    inputs: {},
                    onOpening: function () {},
                    onOpened: function () {},
                    onClosing: function () {},
                    onClosed: function () {}
                };
                if ("remove" in Element.prototype || (Element.prototype.remove = function () {
                        this.parentNode && this.parentNode.removeChild(this)
                    }), "function" != typeof window.CustomEvent) {
                    var c = function (n, e) {
                        e = e || {
                            bubbles: false,
                            cancelable: false,
                            detail: void 0
                        };
                        var t = document.createEvent("CustomEvent");
                        return t.initCustomEvent(n, e.bubbles, e.cancelable, e.detail), t
                    };
                    c.prototype = window.Event.prototype, window.CustomEvent = c
                }
                var p = function (n, e, t) {
                        if ("[object Object]" === Object.prototype.toString.call(n))
                            for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && e.call(t, n[i], i, n);
                        else if (n)
                            for (var a = 0, o = n.length; a < o; a++) e.call(t, n[a], a, n)
                    },
                    d = function (n, e) {
                        var t = {};
                        return p(n, function (e, i) {
                            t[i] = n[i]
                        }), p(e, function (n, i) {
                            t[i] = e[i]
                        }), t
                    },
                    u = function (n) {
                        var e = document.createDocumentFragment(),
                            t = document.createElement("div");
                        for (t.innerHTML = n; t.firstChild;) e.appendChild(t.firstChild);
                        return e
                    },
                    m = {
                        move: function (n, e, t, o) {
                            var r;
                            0 !== o && (n.classList.add("iziToast-dragged"), n.style.transform = "translateX(" + o + "px)", o > 0 ? (r = (180 - o) / 180) < .3 && e.hide(d(t, {
                                transitionOut: "fadeOutRight",
                                transitionOutMobile: "fadeOutRight"
                            }), n, "drag") : (r = (180 + o) / 180) < .3 && e.hide(d(t, {
                                transitionOut: "fadeOutLeft",
                                transitionOutMobile: "fadeOutLeft"
                            }), n, "drag"), n.style.opacity = r, r < .3 && ((i || a) && (n.style.left = o + "px"), n.parentNode.style.opacity = .3, this.stopMoving(n, null)))
                        },
                        startMoving: function (n, e, t, i) {
                            i = i || window.event;
                            var a = o ? i.touches[0].clientX : i.clientX,
                                r = n.style.transform.replace("px)", ""),
                                s = a - (r = r.replace("translateX(", ""));
                            t.transitionIn && n.classList.remove(t.transitionIn), t.transitionInMobile && n.classList.remove(t.transitionInMobile), n.style.transition = "", o ? document.ontouchmove = function (i) {
                                i.preventDefault();
                                var a = (i = i || window.event).touches[0].clientX - s;
                                m.move(n, e, t, a)
                            } : document.onmousemove = function (i) {
                                i.preventDefault();
                                var a = (i = i || window.event).clientX - s;
                                m.move(n, e, t, a)
                            }
                        },
                        stopMoving: function (n, e) {
                            o ? document.ontouchmove = function () {} : document.onmousemove = function () {}, n.style.opacity = "", n.style.transform = "", n.classList.contains("iziToast-dragged") && (n.classList.remove("iziToast-dragged"), n.style.transition = "transform 0.4s ease, opacity 0.4s ease", setTimeout(function () {
                                n.style.transition = ""
                            }, 400))
                        }
                    };
                return e.setSetting = function (n, t, i) {
                    e.children[n][t] = i
                }, e.getSetting = function (n, t) {
                    return e.children[n][t]
                }, e.destroy = function () {
                    p(document.querySelectorAll(".iziToast-overlay"), function (n, e) {
                        n.remove()
                    }), p(document.querySelectorAll(".iziToast-wrapper"), function (n, e) {
                        n.remove()
                    }), p(document.querySelectorAll(".iziToast"), function (n, e) {
                        n.remove()
                    }), this.children = {}, document.removeEventListener("iziToast-opened", {}, false), document.removeEventListener("iziToast-opening", {}, false), document.removeEventListener("iziToast-closing", {}, false), document.removeEventListener("iziToast-closed", {}, false), document.removeEventListener("keyup", {}, false), s = {}
                }, e.settings = function (n) {
                    e.destroy(), s = n, l = d(l, n || {})
                }, p({
                    info: {
                        color: "blue",
                        icon: "ico-info"
                    },
                    success: {
                        color: "green",
                        icon: "ico-success"
                    },
                    warning: {
                        color: "orange",
                        icon: "ico-warning"
                    },
                    error: {
                        color: "red",
                        icon: "ico-error"
                    },
                    question: {
                        color: "yellow",
                        icon: "ico-question"
                    }
                }, function (n, t) {
                    e[t] = function (e) {
                        var t = d(s, e || {});
                        t = d(n, t || {}), this.show(t)
                    }
                }), e.progress = function (n, e, t) {
                    var i = this,
                        a = e.getAttribute("data-iziToast-ref"),
                        o = d(this.children[a], n || {}),
                        r = e.querySelector(".iziToast-progressbar div");
                    return {
                        start: function () {
                            void 0 === o.time.REMAINING && (e.classList.remove("iziToast-reseted"), null !== r && (r.style.transition = "width " + o.timeout + "ms " + o.progressBarEasing, r.style.width = "0%"), o.time.START = (new Date).getTime(), o.time.END = o.time.START + o.timeout, o.time.TIMER = setTimeout(function () {
                                clearTimeout(o.time.TIMER), e.classList.contains("iziToast-closing") || (i.hide(o, e, "timeout"), "function" == typeof t && t.apply(i))
                            }, o.timeout), i.setSetting(a, "time", o.time))
                        },
                        pause: function () {
                            if (void 0 !== o.time.START && !e.classList.contains("iziToast-paused") && !e.classList.contains("iziToast-reseted")) {
                                if (e.classList.add("iziToast-paused"), o.time.REMAINING = o.time.END - (new Date).getTime(), clearTimeout(o.time.TIMER), i.setSetting(a, "time", o.time), null !== r) {
                                    var n = window.getComputedStyle(r).getPropertyValue("width");
                                    r.style.transition = "none", r.style.width = n
                                }
                                "function" == typeof t && setTimeout(function () {
                                    t.apply(i)
                                }, 10)
                            }
                        },
                        resume: function () {
                            void 0 !== o.time.REMAINING ? (e.classList.remove("iziToast-paused"), null !== r && (r.style.transition = "width " + o.time.REMAINING + "ms " + o.progressBarEasing, r.style.width = "0%"), o.time.END = (new Date).getTime() + o.time.REMAINING, o.time.TIMER = setTimeout(function () {
                                clearTimeout(o.time.TIMER), e.classList.contains("iziToast-closing") || (i.hide(o, e, "timeout"), "function" == typeof t && t.apply(i))
                            }, o.time.REMAINING), i.setSetting(a, "time", o.time)) : this.start()
                        },
                        reset: function () {
                            clearTimeout(o.time.TIMER), delete o.time.REMAINING, i.setSetting(a, "time", o.time), e.classList.add("iziToast-reseted"), e.classList.remove("iziToast-paused"), null !== r && (r.style.transition = "none", r.style.width = "100%"), "function" == typeof t && setTimeout(function () {
                                t.apply(i)
                            }, 10)
                        }
                    }
                }, e.hide = function (n, e, i) {
                    "object" != typeof e && (e = document.querySelector(e));
                    var a = this,
                        o = d(this.children[e.getAttribute("data-iziToast-ref")], n || {});
                    o.closedBy = i || null, delete o.time.REMAINING, e.classList.add("iziToast-closing"),
                        function () {
                            var n = document.querySelector(".iziToast-overlay");
                            if (null !== n) {
                                var e = n.getAttribute("data-iziToast-ref"),
                                    t = (e = e.split(",")).indexOf(String(o.ref)); - 1 !== t && e.splice(t, 1), n.setAttribute("data-iziToast-ref", e.join()), 0 === e.length && (n.classList.remove("fadeIn"), n.classList.add("fadeOut"), setTimeout(function () {
                                    n.remove()
                                }, 700))
                            }
                        }(), o.transitionIn && e.classList.remove(o.transitionIn), o.transitionInMobile && e.classList.remove(o.transitionInMobile), t || window.innerWidth <= 568 ? o.transitionOutMobile && e.classList.add(o.transitionOutMobile) : o.transitionOut && e.classList.add(o.transitionOut);
                    var r = e.parentNode.offsetHeight;
                    e.parentNode.style.height = r + "px", e.style.pointerEvents = "none", (!t || window.innerWidth > 568) && (e.parentNode.style.transitionDelay = "0.2s");
                    try {
                        var s = new CustomEvent("iziToast-closing", {
                            detail: o,
                            bubbles: true,
                            cancelable: true
                        });
                        document.dispatchEvent(s)
                    } catch (n) {
                        console.warn(n)
                    }
                    setTimeout(function () {
                        e.parentNode.style.height = "0px", e.parentNode.style.overflow = "", setTimeout(function () {
                            delete a.children[o.ref], e.parentNode.remove();
                            try {
                                var n = new CustomEvent("iziToast-closed", {
                                    detail: o,
                                    bubbles: true,
                                    cancelable: true
                                });
                                document.dispatchEvent(n)
                            } catch (n) {
                                console.warn(n)
                            }
                            void 0 !== o.onClosed && o.onClosed.apply(null, [o, e, i])
                        }, 1e3)
                    }, 200), void 0 !== o.onClosing && o.onClosing.apply(null, [o, e, i])
                }, e.show = function (n) {
                    var i, a = this,
                        c = d(s, n || {});
                    if ((c = d(l, c)).time = {}, null === c.id && (c.id = (i = c.title + c.message + c.color, btoa(encodeURIComponent(i)).replace(/=/g, ""))), 1 === c.displayMode || "once" == c.displayMode) try {
                        if (document.querySelectorAll(".iziToast#" + c.id).length > 0) return false
                    }
                    catch (n) {
                        console.warn("[iziToast] Could not find an element with this selector: #" + c.id + ". Try to set an valid id.")
                    }
                    if (2 === c.displayMode || "replace" == c.displayMode) try {
                        p(document.querySelectorAll(".iziToast#" + c.id), function (n, e) {
                            a.hide(c, n, "replaced")
                        })
                    }
                    catch (n) {
                        console.warn("[iziToast] Could not find an element with this selector: #" + c.id + ". Try to set an valid id.")
                    }
                    c.ref = (new Date).getTime() + Math.floor(1e7 * Math.random() + 1), e.children[c.ref] = c;
                    var f, b = {
                        body: document.querySelector("body"),
                        overlay: document.createElement("div"),
                        toast: document.createElement("div"),
                        toastBody: document.createElement("div"),
                        toastTexts: document.createElement("div"),
                        toastCapsule: document.createElement("div"),
                        cover: document.createElement("div"),
                        buttons: document.createElement("div"),
                        inputs: document.createElement("div"),
                        icon: c.iconUrl ? document.createElement("img") : document.createElement("i"),
                        wrapper: null
                    };
                    b.toast.setAttribute("data-iziToast-ref", c.ref), b.toast.appendChild(b.toastBody), b.toastCapsule.appendChild(b.toast),
                        function () {
                            if (b.toast.classList.add("iziToast"), b.toast.classList.add("iziToast-opening"), b.toastCapsule.classList.add("iziToast-capsule"), b.toastBody.classList.add("iziToast-body"), b.toastTexts.classList.add("iziToast-texts"), t || window.innerWidth <= 568 ? c.transitionInMobile && b.toast.classList.add(c.transitionInMobile) : c.transitionIn && b.toast.classList.add(c.transitionIn), c.class) {
                                var n = c.class.split(" ");
                                p(n, function (n, e) {
                                    b.toast.classList.add(n)
                                })
                            }
                            var e;
                            c.id && (b.toast.id = c.id), c.rtl && (b.toast.classList.add("iziToast-rtl"), b.toast.setAttribute("dir", "rtl")), c.layout > 1 && b.toast.classList.add("iziToast-layout" + c.layout), c.balloon && b.toast.classList.add("iziToast-balloon"), c.maxWidth && (isNaN(c.maxWidth) ? b.toast.style.maxWidth = c.maxWidth : b.toast.style.maxWidth = c.maxWidth + "px"), "" === c.theme && "light" === c.theme || b.toast.classList.add("iziToast-theme-" + c.theme), c.color && ("#" == (e = c.color).substring(0, 1) || "rgb" == e.substring(0, 3) || "hsl" == e.substring(0, 3) ? b.toast.style.background = c.color : b.toast.classList.add("iziToast-color-" + c.color)), c.backgroundColor && (b.toast.style.background = c.backgroundColor, c.balloon && (b.toast.style.borderColor = c.backgroundColor))
                        }(), c.image && (b.cover.classList.add("iziToast-cover"), b.cover.style.width = c.imageWidth + "px", function (n) {
                            try {
                                return btoa(atob(n)) == n
                            } catch (n) {
                                return false
                            }
                        }(c.image.replace(/ /g, "")) ? b.cover.style.backgroundImage = "url(data:image/png;base64," + c.image.replace(/ /g, "") + ")" : b.cover.style.backgroundImage = "url(" + c.image + ")", c.rtl ? b.toastBody.style.marginRight = c.imageWidth + 10 + "px" : b.toastBody.style.marginLeft = c.imageWidth + 10 + "px", b.toast.appendChild(b.cover)), c.close ? (b.buttonClose = document.createElement("button"), b.buttonClose.type = "button", b.buttonClose.classList.add("iziToast-close"), b.buttonClose.addEventListener("click", function (n) {
                            n.target, a.hide(c, b.toast, "button")
                        }), b.toast.appendChild(b.buttonClose)) : c.rtl ? b.toast.style.paddingLeft = "18px" : b.toast.style.paddingRight = "18px", c.progressBar && (b.progressBar = document.createElement("div"), b.progressBarDiv = document.createElement("div"), b.progressBar.classList.add("iziToast-progressbar"), b.progressBarDiv.style.background = c.progressBarColor, b.progressBar.appendChild(b.progressBarDiv), b.toast.appendChild(b.progressBar)), c.timeout && (c.pauseOnHover && !c.resetOnHover && (b.toast.addEventListener("mouseenter", function (n) {
                            a.progress(c, b.toast).pause()
                        }), b.toast.addEventListener("mouseleave", function (n) {
                            a.progress(c, b.toast).resume()
                        })), c.resetOnHover && (b.toast.addEventListener("mouseenter", function (n) {
                            a.progress(c, b.toast).reset()
                        }), b.toast.addEventListener("mouseleave", function (n) {
                            a.progress(c, b.toast).start()
                        }))), c.iconUrl ? (b.icon.setAttribute("class", "iziToast-icon"), b.icon.setAttribute("src", c.iconUrl)) : c.icon && (b.icon.setAttribute("class", "iziToast-icon " + c.icon), c.iconText && b.icon.appendChild(document.createTextNode(c.iconText)), c.iconColor && (b.icon.style.color = c.iconColor)), (c.icon || c.iconUrl) && (c.rtl ? b.toastBody.style.paddingRight = "33px" : b.toastBody.style.paddingLeft = "33px", b.toastBody.appendChild(b.icon)), c.title.length > 0 && (b.strong = document.createElement("strong"), b.strong.classList.add("iziToast-title"), b.strong.appendChild(u(c.title)), b.toastTexts.appendChild(b.strong), c.titleColor && (b.strong.style.color = c.titleColor), c.titleSize && (isNaN(c.titleSize) ? b.strong.style.fontSize = c.titleSize : b.strong.style.fontSize = c.titleSize + "px"), c.titleLineHeight && (isNaN(c.titleSize) ? b.strong.style.lineHeight = c.titleLineHeight : b.strong.style.lineHeight = c.titleLineHeight + "px")), c.message.length > 0 && (b.p = document.createElement("p"), b.p.classList.add("iziToast-message"), b.p.appendChild(u(c.message)), b.toastTexts.appendChild(b.p), c.messageColor && (b.p.style.color = c.messageColor), c.messageSize && (isNaN(c.titleSize) ? b.p.style.fontSize = c.messageSize : b.p.style.fontSize = c.messageSize + "px"), c.messageLineHeight && (isNaN(c.titleSize) ? b.p.style.lineHeight = c.messageLineHeight : b.p.style.lineHeight = c.messageLineHeight + "px")), c.title.length > 0 && c.message.length > 0 && (c.rtl ? b.strong.style.marginLeft = "10px" : 2 === c.layout || c.rtl || (b.strong.style.marginRight = "10px")), b.toastBody.appendChild(b.toastTexts), c.inputs.length > 0 && (b.inputs.classList.add("iziToast-inputs"), p(c.inputs, function (n, e) {
                            b.inputs.appendChild(u(n[0])), (f = b.inputs.childNodes)[e].classList.add("iziToast-inputs-child"), n[3] && setTimeout(function () {
                                f[e].focus()
                            }, 300), f[e].addEventListener(n[1], function (e) {
                                return (0, n[2])(a, b.toast, this, e)
                            })
                        }), b.toastBody.appendChild(b.inputs)), c.buttons.length > 0 && (b.buttons.classList.add("iziToast-buttons"), p(c.buttons, function (n, e) {
                            b.buttons.appendChild(u(n[0]));
                            var t = b.buttons.childNodes;
                            t[e].classList.add("iziToast-buttons-child"), n[2] && setTimeout(function () {
                                t[e].focus()
                            }, 300), t[e].addEventListener("click", function (e) {
                                return e.preventDefault(), (0, n[1])(a, b.toast, this, e, f)
                            })
                        })), b.toastBody.appendChild(b.buttons), c.message.length > 0 && (c.inputs.length > 0 || c.buttons.length > 0) && (b.p.style.marginBottom = "0"), (c.inputs.length > 0 || c.buttons.length > 0) && (c.rtl ? b.toastTexts.style.marginLeft = "10px" : b.toastTexts.style.marginRight = "10px", c.inputs.length > 0 && c.buttons.length > 0 && (c.rtl ? b.inputs.style.marginLeft = "8px" : b.inputs.style.marginRight = "8px")), b.toastCapsule.style.visibility = "hidden", setTimeout(function () {
                            var n = b.toast.offsetHeight,
                                e = b.toast.currentStyle || window.getComputedStyle(b.toast),
                                t = e.marginTop;
                            t = t.split("px"), t = parseInt(t[0]);
                            var i = e.marginBottom;
                            i = i.split("px"), i = parseInt(i[0]), b.toastCapsule.style.visibility = "", b.toastCapsule.style.height = n + i + t + "px", setTimeout(function () {
                                b.toastCapsule.style.height = "auto", c.target && (b.toastCapsule.style.overflow = "visible")
                            }, 500), c.timeout && a.progress(c, b.toast).start()
                        }, 100),
                        function () {
                            var n = c.position;
                            if (c.target) b.wrapper = document.querySelector(c.target), b.wrapper.classList.add("iziToast-target"), c.targetFirst ? b.wrapper.insertBefore(b.toastCapsule, b.wrapper.firstChild) : b.wrapper.appendChild(b.toastCapsule);
                            else {
                                if (-1 == r.indexOf(c.position)) return void console.warn("[iziToast] Incorrect position.\nIt can be › " + r);
                                n = t || window.innerWidth <= 568 ? "bottomLeft" == c.position || "bottomRight" == c.position || "bottomCenter" == c.position ? "iziToast-wrapper-bottomCenter" : "topLeft" == c.position || "topRight" == c.position || "topCenter" == c.position ? "iziToast-wrapper-topCenter" : "iziToast-wrapper-center" : "iziToast-wrapper-" + n, b.wrapper = document.querySelector(".iziToast-wrapper." + n), b.wrapper || (b.wrapper = document.createElement("div"), b.wrapper.classList.add("iziToast-wrapper"), b.wrapper.classList.add(n), document.body.appendChild(b.wrapper)), "topLeft" == c.position || "topCenter" == c.position || "topRight" == c.position ? b.wrapper.insertBefore(b.toastCapsule, b.wrapper.firstChild) : b.wrapper.appendChild(b.toastCapsule)
                            }
                            isNaN(c.zindex) ? console.warn("[iziToast] Invalid zIndex.") : b.wrapper.style.zIndex = c.zindex
                        }(), c.overlay && (null !== document.querySelector(".iziToast-overlay.fadeIn") ? (b.overlay = document.querySelector(".iziToast-overlay"), b.overlay.setAttribute("data-iziToast-ref", b.overlay.getAttribute("data-iziToast-ref") + "," + c.ref), isNaN(c.zindex) || null === c.zindex || (b.overlay.style.zIndex = c.zindex - 1)) : (b.overlay.classList.add("iziToast-overlay"), b.overlay.classList.add("fadeIn"), b.overlay.style.background = c.overlayColor, b.overlay.setAttribute("data-iziToast-ref", c.ref), isNaN(c.zindex) || null === c.zindex || (b.overlay.style.zIndex = c.zindex - 1), document.querySelector("body").appendChild(b.overlay)), c.overlayClose ? (b.overlay.removeEventListener("click", {}), b.overlay.addEventListener("click", function (n) {
                            a.hide(c, b.toast, "overlay")
                        })) : b.overlay.removeEventListener("click", {})),
                        function () {
                            if (c.animateInside) {
                                b.toast.classList.add("iziToast-animateInside");
                                var n = [200, 100, 300];
                                "bounceInLeft" != c.transitionIn && "bounceInRight" != c.transitionIn || (n = [400, 200, 400]), c.title.length > 0 && setTimeout(function () {
                                    b.strong.classList.add("slideIn")
                                }, n[0]), c.message.length > 0 && setTimeout(function () {
                                    b.p.classList.add("slideIn")
                                }, n[1]), (c.icon || c.iconUrl) && setTimeout(function () {
                                    b.icon.classList.add("revealIn")
                                }, n[2]);
                                var e = 150;
                                c.buttons.length > 0 && b.buttons && setTimeout(function () {
                                    p(b.buttons.childNodes, function (n, t) {
                                        setTimeout(function () {
                                            n.classList.add("revealIn")
                                        }, e), e += 150
                                    })
                                }, c.inputs.length > 0 ? 150 : 0), c.inputs.length > 0 && b.inputs && (e = 150, p(b.inputs.childNodes, function (n, t) {
                                    setTimeout(function () {
                                        n.classList.add("revealIn")
                                    }, e), e += 150
                                }))
                            }
                        }(), c.onOpening.apply(null, [c, b.toast]);
                    try {
                        var A = new CustomEvent("iziToast-opening", {
                            detail: c,
                            bubbles: true,
                            cancelable: true
                        });
                        document.dispatchEvent(A)
                    } catch (n) {
                        console.warn(n)
                    }
                    setTimeout(function () {
                        b.toast.classList.remove("iziToast-opening"), b.toast.classList.add("iziToast-opened");
                        try {
                            var n = new CustomEvent("iziToast-opened", {
                                detail: c,
                                bubbles: true,
                                cancelable: true
                            });
                            document.dispatchEvent(n)
                        } catch (n) {
                            console.warn(n)
                        }
                        c.onOpened.apply(null, [c, b.toast])
                    }, 1e3), c.drag && (o ? (b.toast.addEventListener("touchstart", function (n) {
                        m.startMoving(this, a, c, n)
                    }, false), b.toast.addEventListener("touchend", function (n) {
                        m.stopMoving(this, n)
                    }, false)) : (b.toast.addEventListener("mousedown", function (n) {
                        n.preventDefault(), m.startMoving(this, a, c, n)
                    }, false), b.toast.addEventListener("mouseup", function (n) {
                        n.preventDefault(), m.stopMoving(this, n)
                    }, false))), c.closeOnEscape && document.addEventListener("keyup", function (n) {
                        27 == (n = n || window.event).keyCode && a.hide(c, b.toast, "esc")
                    }), c.closeOnClick && b.toast.addEventListener("click", function (n) {
                        a.hide(c, b.toast, "toast")
                    }), a.toast = b.toast
                }, e
            }, "function" == typeof define && define.amd ? define([], a()) : "object" == typeof t ? e.exports = a() : i.iziToast = a()
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    3: [function (n, e, t) {
        "object" == typeof e && (e.exports = function () {
            var n = Date.now(),
                e = n,
                t = 0,
                i = 1 / 0,
                a = 0,
                o = 0,
                r = 1 / 0,
                s = 0,
                l = 0,
                c = 0,
                p = document.createElement("div");
            p.id = "stats", p.addEventListener("mousedown", function (n) {
                n.preventDefault(), g(++c % 2)
            }, false), p.style.cssText = "width:80px;opacity:0.9;cursor:pointer";
            var d = document.createElement("div");
            d.id = "fps", d.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#002", p.appendChild(d);
            var u = document.createElement("div");
            u.id = "fpsText", u.style.cssText = "color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px", u.innerHTML = "FPS", d.appendChild(u);
            var m = document.createElement("div");
            for (m.id = "fpsGraph", m.style.cssText = "position:relative;width:74px;height:30px;background-color:#0ff", d.appendChild(m); 74 > m.children.length;) {
                var f = document.createElement("span");
                f.style.cssText = "width:1px;height:30px;float:left;background-color:#113", m.appendChild(f)
            }
            var b = document.createElement("div");
            b.id = "ms", b.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#020;display:none", p.appendChild(b);
            var A = document.createElement("div");
            A.id = "msText", A.style.cssText = "color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px", A.innerHTML = "MS", b.appendChild(A);
            var y = document.createElement("div");
            for (y.id = "msGraph", y.style.cssText = "position:relative;width:74px;height:30px;background-color:#0f0", b.appendChild(y); 74 > y.children.length;)(f = document.createElement("span")).style.cssText = "width:1px;height:30px;float:left;background-color:#131", y.appendChild(f);
            var g = function (n) {
                switch (c = n) {
                    case 0:
                        d.style.display = "block", b.style.display = "none";
                        break;
                    case 1:
                        d.style.display = "none", b.style.display = "block"
                }
            };
            return {
                REVISION: 12,
                domElement: p,
                setMode: g,
                begin: function () {
                    n = Date.now()
                },
                end: function () {
                    var c = Date.now();
                    t = c - n, i = Math.min(i, t), a = Math.max(a, t), A.textContent = t + " MS (" + i + "-" + a + ")";
                    var p = Math.min(30, 30 - t / 200 * 30);
                    return y.appendChild(y.firstChild).style.height = p + "px", l++, c > e + 1e3 && (o = Math.round(1e3 * l / (c - e)), r = Math.min(r, o), s = Math.max(s, o), u.textContent = o + " FPS (" + r + "-" + s + ")", p = Math.min(30, 30 - o / 100 * 30), m.appendChild(m.firstChild).style.height = p + "px", e = c, l = 0), c
                },
                update: function () {
                    n = this.end()
                }
            }
        })
    }, {}],
    4: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e, t) {
            var i = e.playerBarn,
                a = ["playerBarn"],
                o = [],
                r = false,
                s = function (n) {};
            return {
                bind: function () {
                    r || (s = i.prototype.render, i.prototype.render = function (n) {
                        var e = true,
                            i = false,
                            a = void 0;
                        try {
                            for (var r, l = o[Symbol.iterator](); !(e = (r = l.next()).done); e = true) {
                                var c = r.value;
                                "playerBarn" == c.type && t[c.callback].call()
                            }
                        } catch (n) {
                            i = true, a = n
                        } finally {
                            try {
                                !e && l.return && l.return()
                            } finally {
                                if (i) throw a
                            }
                        }
                        s.call(this, n)
                    }), r = true
                },
                unbind: function () {
                    r && (i.prototype.render = s, o = []), r = false
                },
                add: function (n, e) {
                    return !(!a.includes(n) || function (n, e) {
                        return o.filter(function (n, t, i) {
                            return n.callback === e
                        }).length > 0
                    }(0, e) || (o.push({
                        type: n,
                        callback: e
                    }), 0))
                },
                remove: function (n, e) {
                    for (var t = 0; t < o.length; t++)
                        if (o[t].type == n && o[t].callback == e) return o.splice(t, 1), true;
                    return false
                }
            }
        }
    }, {}],
    5: [function (n, e, t) {
        var i = `/* Izitoast */
        /*
        * iziToast | v1.4.0
        * http://izitoast.marcelodolce.com
        * by Marcelo Dolce.
        */
        .iziToast-capsule {
            font-size: 0;
            height: 0;
            width: 100%;
            transform: translateZ(0);
            backface-visibility: hidden;
            transition: transform .5s cubic-bezier(.25, .8, .25, 1), height .5s cubic-bezier(.25, .8, .25, 1);
        }
        
        .iziToast-capsule,
        .iziToast-capsule * {
            box-sizing: border-box;
        }
        
        .iziToast-overlay {
            display: block;
            position: fixed;
            top: -100px;
            left: 0;
            right: 0;
            bottom: -100px;
            z-index: 997;
        }
        
        .iziToast {
            display: inline-block;
            clear: both;
            position: relative;
            font-family: 'Lato', Tahoma, Arial;
            font-size: 14px;
            padding: 8px 45px 9px 0;
            background: rgba(238, 238, 238, .9);
            border-color: rgba(238, 238, 238, .9);
            width: 100%;
            pointer-events: all;
            cursor: default;
            transform: translateX(0);
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            min-height: 54px;
        }
        
        .iziToast>.iziToast-progressbar {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            z-index: 1;
            background: rgba(255, 255, 255, .2);
        }
        
        .iziToast>.iziToast-progressbar>div {
            height: 2px;
            width: 100%;
            background: rgba(0, 0, 0, .3);
            border-radius: 0 0 3px 3px;
        }
        
        .iziToast.iziToast-balloon:before {
            content: '';
            position: absolute;
            right: 8px;
            left: auto;
            width: 0;
            height: 0;
            top: 100%;
            border-right: 0 solid transparent;
            border-left: 15px solid transparent;
            border-top: 10px solid #000;
            border-top-color: inherit;
            border-radius: 0;
        }
        
        .iziToast.iziToast-balloon .iziToast-progressbar {
            top: 0;
            bottom: auto;
        }
        
        .iziToast.iziToast-balloon>div {
            border-radius: 0 0 0 3px;
        }
        
        .iziToast>.iziToast-cover {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            height: 100%;
            margin: 0;
            background-size: 100%;
            background-position: 50% 50%;
            background-repeat: no-repeat;
            background-color: rgba(0, 0, 0, .1);
        }
        
        .iziToast>.iziToast-close {
            position: absolute;
            right: 0;
            top: 0;
            border: 0;
            padding: 0;
            opacity: .6;
            width: 42px;
            height: 100%;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAJPAAACTwBcGfW0QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAD3SURBVFiF1ZdtDoMgDEBfdi4PwAX8vLFn0qT7wxantojKupmQmCi8R4tSACpgjC2ICCUbEBa8ingjsU1AXRBeR8aLN64FiknswN8CYefBBDQ3whuFESy7WyQMeC0ipEI0A+0FeBvHUFN8xPaUhAH/iKoWsnXHGegy4J0yxialOfaHJAz4bhRzQzgDvdGnz4GbAonZbCQMuBm1K/kcFu8Mp1N2cFFpsxsMuJqqbIGExGl4loARajU1twskJLLhIsID7+tvUoDnIjTg5T9DPH9EBrz8rxjPzciAl9+O8SxI8CzJ8CxKFfh3ynK8Dyb8wNHM/XDqejx/AtNyPO87tNybAAAAAElFTkSuQmCC) no-repeat 50% 50%;
            background-size: 8px;
            cursor: pointer;
            outline: 0;
        }
        
        .iziToast>.iziToast-close:hover {
            opacity: 1;
        }
        
        .iziToast>.iziToast-body {
            position: relative;
            padding: 0 0 0 10px;
            height: auto;
            min-height: 36px;
            margin: 0 0 0 15px;
            text-align: left;
        }
        
        .iziToast>.iziToast-body:after {
            content: \"\";  display: table;  clear: both;}.iziToast>.iziToast-body .iziToast-texts {  margin: 10px 0 0;  padding-right: 2px;  display: inline-block;  float: left;}.iziToast>.iziToast-body .iziToast-inputs {  min-height: 19px;  float: left;  margin: 3px -2px;}.iziToast>.iziToast-body .iziToast-inputs>input:not([type=checkbox]):not([type=radio]),.iziToast>.iziToast-body .iziToast-inputs>select {  position: relative;  display: inline-block;  margin: 2px;  border-radius: 2px;  border: 0;  padding: 4px 7px;  font-size: 13px;  letter-spacing: .02em;  background: rgba(0,0,0,.1);  color: #000;  box-shadow: 0 0 0 1px rgba(0,0,0,.2);  min-height: 26px;}.iziToast>.iziToast-body .iziToast-inputs>input:not([type=checkbox]):not([type=radio]):focus,.iziToast>.iziToast-body .iziToast-inputs>select:focus {  box-shadow: 0 0 0 1px rgba(0,0,0,.6);}.iziToast>.iziToast-body .iziToast-buttons {  min-height: 17px;  float: left;  margin: 4px -2px;}.iziToast>.iziToast-body .iziToast-buttons>a,.iziToast>.iziToast-body .iziToast-buttons>button,.iziToast>.iziToast-body .iziToast-buttons>input:not([type=checkbox]):not([type=radio]) {  position: relative;  display: inline-block;  margin: 2px;  border-radius: 2px;  border: 0;  padding: 5px 10px;  font-size: 12px;  letter-spacing: .02em;  cursor: pointer;  background: rgba(0,0,0,.1);  color: #000;}.iziToast>.iziToast-body .iziToast-buttons>a:hover,.iziToast>.iziToast-body .iziToast-buttons>button:hover,.iziToast>.iziToast-body .iziToast-buttons>input:not([type=checkbox]):not([type=radio]):hover {  background: rgba(0,0,0,.2);}.iziToast>.iziToast-body .iziToast-buttons>a:focus,.iziToast>.iziToast-body .iziToast-buttons>button:focus,.iziToast>.iziToast-body .iziToast-buttons>input:not([type=checkbox]):not([type=radio]):focus {  box-shadow: 0 0 0 1px rgba(0,0,0,.6);}.iziToast>.iziToast-body .iziToast-buttons>a:active,.iziToast>.iziToast-body .iziToast-buttons>button:active,.iziToast>.iziToast-body .iziToast-buttons>input:not([type=checkbox]):not([type=radio]):active {  top: 1px;}.iziToast>.iziToast-body .iziToast-icon {  position: absolute;  left: 0;  top: 50%;  display: table;  font-size: 23px;  line-height: 24px;  margin-top: -12px;  color: #000;  width: 24px;  height: 24px;}.iziToast>.iziToast-body .iziToast-icon.ico-info {  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAflBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACCtoPsAAAAKXRSTlMA6PsIvDob+OapavVhWRYPrIry2MxGQ97czsOzpJaMcE0qJQOwVtKjfxCVFeIAAAI3SURBVFjDlJPZsoIwEETnCiGyb8q+qmjl/3/wFmGKwjBROS9QWbtnOqDDGPq4MdMkSc0m7gcDDhF4NRdv8NoL4EcMpzoJglPl/KTDz4WW3IdvXEvxkfIKn7BMZb1bFK4yZFqghZ03jk0nG8N5NBwzx9xU5cxAg8fXi20/hDdC316lcA8o7t16eRuQvW1XGd2d2P8QSHQDDbdIII/9CR3lUF+lbucfJy4WfMS64EJPORnrZxtfc2pjJdnbuags3l04TTtJMXrdTph4Pyg4XAjugAJqMDf5Rf+oXx2/qi4u6nipakIi7CsgiuMSEF9IGKg8heQJKkxIfFSUU/egWSwNrS1fPDtLfon8sZOcYUQml1Qv9a3kfwsEUyJEMgFBKzdV8o3Iw9yAjg1jdLQCV4qbd3no8yD2GugaC3oMbF0NYHCpJYSDhNI5N2DAWB4F4z9Aj/04Cna/x7eVAQ17vRjQZPh+G/kddYv0h49yY4NWNDWMMOMUIRYvlTECmrN8pUAjo5RCMn8KoPmbJ/+Appgnk//Sy90GYBCGgm7IAskQ7D9hFKW4ApB1ei3FSYD9PjGAKygAV+ARFYBH5BsVgG9kkBSAQWKUFYBRZpkUgGVinRWAdUZQDABBQdIcAElDVBUAUUXWHQBZx1gMAGMprM0AsLbVXHsA5trZe93/wp3svQ0YNb/jWV3AIOLsMtlznSNOH7JqjOpDVh7z8qCZR10ftvO4nxeOvPLkpSuvfXnxzKtvXr7j+v8C5ii0e71At7cAAAAASUVORK5CYII=) no-repeat 50% 50%;  background-size: 85%;}.iziToast>.iziToast-body .iziToast-icon.ico-warning {  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAMAAAAPzWOAAAAAkFBMVEUAAAAAAAABAAIAAAABAAIAAAMAAAABAAIBAAIBAAIAAAIAAAABAAIAAAABAAICAAICAAIAAAIAAAAAAAAAAAABAAIBAAIAAAMAAAABAAIBAAMBAAECAAIAAAIAAAIAAAABAAIBAAIBAAMBAAIBAAEAAAIAAAMAAAAAAAABAAECAAICAAIAAAIAAAMAAAQAAAE05yNAAAAAL3RSTlMAB+kD7V8Q+PXicwv7I9iYhkAzJxnx01IV5cmnk2xmHfzexsK4eEw5L7Gei39aRw640awAAAHQSURBVFjD7ZfJdoJAEEWJgCiI4oDiPM8m7///LidErRO7sHrY5u7YXLr7vKqu9kTC0HPmo9n8cJbEQOzqqAdAUHeUZACQuTkGDQBoDJwkHZR0XBz9FkpafXuHP0SJ09mGeJLZ5wwlTmcbA0THPmdEK7XPGTG1zxmInn3OiJ19zkB0jSVTKExMHT0wjAwlWzC0fSPHF1gWRpIhWMYm7fYTFcQGlbemf4dFfdTGg0B/KXM8qBU/3wntbq7rSGqvJ9kla6IpueFJet8fxfem5yhykjyOgNaWF1qSGd5JMNNxpNF7SZQaVh5JzLrTCZIEJ1GyEyVyd+pClMjdaSJK5O40giSRu5PfFiVyd1pAksjdKRnrSsbVdbiHrgT7yss315fkVQPLFQrL+4FHeOXKO5YRFEKv5AiFaMlKLlBpJuVCJlC5sJfvCgztru/3NmBYccPgGTxRAzxn1XGEMUf58pXZvjoOsOCgjL08+b53mtfAM/SVsZcjKLtysQZPqIy9HPP3m/3zKItRwT0LyQo8sTr26tcO83DIUMWIJjierHLsJda/tbNBFY0BP/bKtcM8HNIWCK3aYR4OMzgxo5w5EFLOLKDExXAm9gI4E3iAO94/Ct/lKWuM2LMGbgAAAABJRU5ErkJggg==) no-repeat 50% 50%;  background-size: 85%;}.iziToast>.iziToast-body .iziToast-icon.ico-error {  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAeFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVyEiIAAAAJ3RSTlMA3BsB98QV8uSyWVUFz7+kcWMM2LuZioBpTUVBNcq2qaibj4d1azLZZYABAAACZElEQVRYw7WX25KCMAyGAxUoFDkpiohnV97/DXeGBtoOUprZ2dyo1K82fxKbwJJVp+KQZ7so2mX5oThVQLKwjDe9YZu4DF3ptAn6rxY0qQPOEq9fNC9ha3y77a22ba24v+9Xbe8v8x03dPOC2/NdvB6xeSreLfGJpnx0TyotKqLm2s7Jd/WO6ivXNp0tCy02R/aFz5VQ5wUPlUL5fIfj5KIlVGU0nWHm/5QtoTVMWY8mzIVu1K9O7XH2JiU/xnOOT39gnUfj+lFHddx4tFjL3/H8jjzaFCy2Rf0c/fdQyQszI8BDR973IyMSKa4krjxAiW/lkRvMP+bKK9WbYS1ASQg8dKjaUGlYPwRe/WoIkz8tiQchH5QAEMv6T0k8MD4mUyWr4E7jAWqZ+xWcMIYkXvlwggJ3IvFK+wIOcpXAo8n8P0COAaXyKH4OsjBuZB4ew0IGu+H1SebhNazsQBbWm8yj+hFuUJB5eMsN0IUXmYendAFFfJB5uEkRMYwxmcd6zDGRtmQePEykAgubymMRFmMxCSIPCRbTuFNN5OGORTjmNGc0Po0m8Uv0gcCry6xUhR2QeLii9tofbEfhz/qvNti+OfPqNm2Mq6105FUMvdT4GPmufMiV8PqBMkc+DdT1bjYYbjzU/ew23VP4n3mLAz4n8Jtv/Ui3ceTT2mzz5o1mZt0gnBpmsdjqRqVlmplcPdqa7X23kL9brdm2t/uBYDPn2+tyu48mtIGD10JTuUrukVrbCFiwDzcHrPjxKt7PW+AZQyT/WESO+1WL7f3o+WLHL2dYMSZsg6dg/z360ofvP4//v1NPzgs28WlWAAAAAElFTkSuQmCC) no-repeat 50% 50%;  background-size: 80%;}.iziToast>.iziToast-body .iziToast-icon.ico-success {  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt0UjBAAAACnRSTlMApAPhIFn82wgGv8mVtwAAAKVJREFUSMft0LEJAkEARNFFFEw1NFJb8CKjAy1AEOzAxNw+bEEEg6nyFjbY4LOzcBwX7S/gwUxoTdIn+Jbv4Lv8bx446+kB6VsBtK0B+wbMCKxrwL33wOrVeeChX28n7KTOTjgoEu6DRSYAgAAAAkAmAIAAAAIACQIkMkACAAgAIACAyECBKAOJuCagTJwSUCaUAEMAABEBRwAAEQFLbCJgO4bW+AZKGnktR+jAFAAAAABJRU5ErkJggg==) no-repeat 50% 50%;  background-size: 85%;}.iziToast>.iziToast-body .iziToast-icon.ico-question {  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhCQkUEhFovxTxAAAEDklEQVRo3s2ZTWgTQRTHf03ipTRUqghNSgsRjHgQrFUQC6JgD1Kak3gQUUoPqRdBglf1oBehBws9Cn4cGk+1SOmh2upBxAYVoeJHrR9tgq0i1Cq0lqYeks7MbpPdmU00/c8hm9n33v/t7Nt5M2+qMEWQI0QIibZKRrQpHvLL2KI2wnQzzBKrDm2RIeKEy01dTYKUI7G1ZRknQXV5yP10kTYgly1NF/5S6duZ8ES+1iZodyaocrjXxE0OFeifYYgp0mRIkwFChAkRJsIxGgrIP+I0n82fvZW5dc/zkss0O2o1c5mX6/TmaDWl77RFe5YkUW3tKEmyFv0lOvXJ/fTYnmCEFuMRbGHEZqVHLyT9DFjUJmkzJl9DG5MWWwM6Llif/gF1nukB6nhgGwUXdFrE+wiURA8QoM9i0zEWWpXQW+ZsyeRrOMuyEo5Fv4gmy4dXPvqcC+pH2VRYaMwy+OWG+iLGCgm0W0Kv9HdvR8ASjmKCXpuK/bxiV/76A/v5UdDIZuKcJGjrnec5KZ7wwsWFOp6xPX/9mt2sqDe7FO+Kf/fXHBPPDWpdXGhTpLvUG9VKwh1xMDDjkvu+cNDFBTk7ptX1QkKZ850m3duu6fcrWxwdaFFyREJ2j4vOpKP6Du6z4uJCv8sYJIVkCnJBGGZaBONO3roY2EqNrSfIPi7SKP4fdXyNUd6I6wbSAHEl33tFLe+FlSsusnK90A0+oEPcuufZgXnOi+u9LrKSJQZQw6LwqBnv2CKsfHORbFbyQhA6xN/pEuihSdj56Co7LWRjPiKie6gkB2LiKuUqK5kiPkLiz1QJ9K1cNXBAMoUCigNpQ9IqDtMI1HKA4/jyvUsaoSyZLA5kjOjDPFZen8Ql5TsvBskUgjciIPSX3QAXC86DT7VWvlEh/xZ+ij9BDVWJ0QL0SbZq6QaFxoLPcXPmBLveLCc4wXdDK6s+6/vwhCSniFLPXW0NJe5UB8zKCsviqpc7vGPVQFcyZbyPwGD+d5ZnxmNWlhG4xSBZZjivjIWHEQgoDkSMjMwTo54569JSE5IpA7EyJSMTyGTUAUFlO1ZKOtaHTMeL1PhYYFTcihmY2cQ5+ullj7EDkiVfVez2sCTz8yiv84djhg7IJVk81xFWJlPdfHBG0flkRC/zQFZ+DSllNtfDdUsOMCliyGX5uOzU3ZhIXFDof4m1gDuKbEx0t2YS25gVGpcMnr/I1kx3c6piB8P8ZoqEwfMX3ZyCXynJTmq/U7NUXqfUzCbWL1wqVKBQUeESzQYoUlW8TAcVL1RCxUu1G6BYXfFyfQ4VPbDI4T8d2WzgQ6sc/vmxnTsqfHCZQzUJxm1h5dxS5Tu6lQgTZ0ipqRVqSwzTbbLHMt+c19iO76tsx/cLZub+Ali+tYC93olEAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA5LTA5VDIwOjE4OjE3KzAyOjAwjKtfjgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wOS0wOVQyMDoxODoxNyswMjowMP325zIAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC) no-repeat 50% 50%;  background-size: 85%;}.iziToast>.iziToast-body .iziToast-message,.iziToast>.iziToast-body .iziToast-title {  padding: 0;  font-size: 14px;  line-height: 16px;  text-align: left;  float: left;  white-space: normal;}.iziToast>.iziToast-body .iziToast-title {  color: #000;  margin: 0;}.iziToast>.iziToast-body .iziToast-message {  margin: 0 0 10px;  color: rgba(0,0,0,.6);}.iziToast.iziToast-animateInside .iziToast-buttons-child,.iziToast.iziToast-animateInside .iziToast-icon,.iziToast.iziToast-animateInside .iziToast-inputs-child,.iziToast.iziToast-animateInside .iziToast-message,.iziToast.iziToast-animateInside .iziToast-title {  opacity: 0;}.iziToast-target {  position: relative;  width: 100%;  margin: 0 auto;}.iziToast-target .iziToast-capsule {  overflow: hidden;}.iziToast-target .iziToast-capsule:after {  visibility: hidden;  display: block;  font-size: 0;  content: \" \";  clear: both;  height: 0;}.iziToast-target .iziToast-capsule .iziToast {  width: 100%;  float: left;}.iziToast-wrapper {  z-index: 99999;  position: fixed;  width: 100%;  pointer-events: none;  display: flex;  flex-direction: column;}.iziToast-wrapper .iziToast.iziToast-balloon:before {  border-right: 0 solid transparent;  border-left: 15px solid transparent;  border-top: 10px solid #000;  border-top-color: inherit;  right: 8px;  left: auto;}.iziToast-wrapper-bottomLeft {  left: 0;  bottom: 0;  text-align: left;}.iziToast-wrapper-bottomLeft .iziToast.iziToast-balloon:before,.iziToast-wrapper-topLeft .iziToast.iziToast-balloon:before {  border-right: 15px solid transparent;  border-left: 0 solid transparent;  right: auto;  left: 8px;}.iziToast-wrapper-bottomRight {  right: 0;  bottom: 0;  text-align: right;}.iziToast-wrapper-topLeft {  left: 0;  top: 0;  text-align: left;}.iziToast-wrapper-topRight {  top: 0;  right: 0;  text-align: right;}.iziToast-wrapper-topCenter {  top: 0;  left: 0;  right: 0;  text-align: center;}.iziToast-wrapper-bottomCenter,.iziToast-wrapper-center {  bottom: 0;  left: 0;  right: 0;  text-align: center;}.iziToast-wrapper-center {  top: 0;  justify-content: center;  flex-flow: column;  align-items: center;}.iziToast-rtl {  direction: rtl;  padding: 8px 0 9px 45px;  font-family: Tahoma,'Lato',Arial;}.iziToast-rtl .iziToast-cover {  left: auto;  right: 0;}.iziToast-rtl .iziToast-close {  right: auto;  left: 0;}.iziToast-rtl .iziToast-body {  padding: 0 10px 0 0;  margin: 0 16px 0 0;  text-align: right;}.iziToast-rtl .iziToast-body .iziToast-buttons,.iziToast-rtl .iziToast-body .iziToast-inputs,.iziToast-rtl .iziToast-body .iziToast-message,.iziToast-rtl .iziToast-body .iziToast-texts,.iziToast-rtl .iziToast-body .iziToast-title {  float: right;  text-align: right;}.iziToast-rtl .iziToast-body .iziToast-icon {  left: auto;  right: 0;}@media only screen and (min-width:568px) {  .iziToast-wrapper {    padding: 10px 15px;  }  .iziToast {    margin: 5px 0;    border-radius: 3px;    width: auto;  }  .iziToast:after {    content: '';    z-index: -1;    position: absolute;    top: 0;    left: 0;    width: 100%;    height: 100%;    border-radius: 3px;    box-shadow: inset 0 -10px 20px -10px rgba(0,0,0,.2),inset 0 0 5px rgba(0,0,0,.1),0 8px 8px -5px rgba(0,0,0,.25);  }  .iziToast:not(.iziToast-rtl) .iziToast-cover {    border-radius: 3px 0 0 3px;  }  .iziToast.iziToast-rtl .iziToast-cover {    border-radius: 0 3px 3px 0;  }  .iziToast.iziToast-color-dark:after {    box-shadow: inset 0 -10px 20px -10px rgba(255,255,255,.3),0 10px 10px -5px rgba(0,0,0,.25);  }  .iziToast.iziToast-balloon .iziToast-progressbar {    background: 0 0;  }  .iziToast.iziToast-balloon:after {    box-shadow: 0 10px 10px -5px rgba(0,0,0,.25),inset 0 10px 20px -5px rgba(0,0,0,.25);  }  .iziToast-target .iziToast:after {    box-shadow: inset 0 -10px 20px -10px rgba(0,0,0,.2),inset 0 0 5px rgba(0,0,0,.1);  }}.iziToast.iziToast-theme-dark {  background: #565c70;  border-color: #565c70;}.iziToast.iziToast-theme-dark .iziToast-title {  color: #fff;}.iziToast.iziToast-theme-dark .iziToast-message {  color: rgba(255,255,255,.7);  font-weight: 300;}.iziToast.iziToast-theme-dark .iziToast-close {  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfgCR4OIQIPSao6AAAAwElEQVRIx72VUQ6EIAwFmz2XB+AConhjzqTJ7JeGKhLYlyx/BGdoBVpjIpMJNjgIZDKTkQHYmYfwmR2AfAqGFBcO2QjXZCd24bEggvd1KBx+xlwoDpYmvnBUUy68DYXD77ESr8WDtYqvxRex7a8oHP4Wo1Mkt5I68Mc+qYqv1h5OsZmZsQ3gj/02h6cO/KEYx29hu3R+VTTwz6D3TymIP1E8RvEiiVdZfEzicxYLiljSxKIqlnW5seitTW6uYnv/Aqh4whX3mEUrAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTA5LTMwVDE0OjMzOjAyKzAyOjAwl6RMVgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0wOS0zMFQxNDozMzowMiswMjowMOb59OoAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC) no-repeat 50% 50%;  background-size: 8px;}.iziToast.iziToast-theme-dark .iziToast-icon {  color: #fff;}.iziToast.iziToast-theme-dark .iziToast-icon.ico-info {  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAflBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////vroaSAAAAKXRSTlMA6PsIvDob+OapavVhWRYPrIry2MxGQ97czsOzpJaMcE0qJQOwVtKjfxCVFeIAAAI3SURBVFjDlJPZsoIwEETnCiGyb8q+qmjl/3/wFmGKwjBROS9QWbtnOqDDGPq4MdMkSc0m7gcDDhF4NRdv8NoL4EcMpzoJglPl/KTDz4WW3IdvXEvxkfIKn7BMZb1bFK4yZFqghZ03jk0nG8N5NBwzx9xU5cxAg8fXi20/hDdC316lcA8o7t16eRuQvW1XGd2d2P8QSHQDDbdIII/9CR3lUF+lbucfJy4WfMS64EJPORnrZxtfc2pjJdnbuags3l04TTtJMXrdTph4Pyg4XAjugAJqMDf5Rf+oXx2/qi4u6nipakIi7CsgiuMSEF9IGKg8heQJKkxIfFSUU/egWSwNrS1fPDtLfon8sZOcYUQml1Qv9a3kfwsEUyJEMgFBKzdV8o3Iw9yAjg1jdLQCV4qbd3no8yD2GugaC3oMbF0NYHCpJYSDhNI5N2DAWB4F4z9Aj/04Cna/x7eVAQ17vRjQZPh+G/kddYv0h49yY4NWNDWMMOMUIRYvlTECmrN8pUAjo5RCMn8KoPmbJ/+Appgnk//Sy90GYBCGgm7IAskQ7D9hFKW4ApB1ei3FSYD9PjGAKygAV+ARFYBH5BsVgG9kkBSAQWKUFYBRZpkUgGVinRWAdUZQDABBQdIcAElDVBUAUUXWHQBZx1gMAGMprM0AsLbVXHsA5trZe93/wp3svQ0YNb/jWV3AIOLsMtlznSNOH7JqjOpDVh7z8qCZR10ftvO4nxeOvPLkpSuvfXnxzKtvXr7j+v8C5ii0e71At7cAAAAASUVORK5CYII=) no-repeat 50% 50%;  background-size: 85%;}.iziToast.iziToast-theme-dark .iziToast-icon.ico-warning {  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAMAAAAPzWOAAAAAllBMVEUAAAD////+//3+//3+//3///////z+//3+//3+//3////////////9//3////+//39//3///3////////////+//3+//39//3///z+//z+//7///3///3///3///3////////+//3+//3+//3+//z+//3+//7///3///z////////+//79//3///3///z///v+//3///+trXouAAAAMHRSTlMAB+j87RBf+PXiCwQClSPYhkAzJxnx05tSyadzcmxmHRbp5d7Gwrh4TDkvsYt/WkdQzCITAAAB1UlEQVRYw+3XaXKCQBCGYSIIighoxCVqNJrEPfly/8vFImKXduNsf/Mc4K1y7FnwlMLQc/bUbj85R6bA1LXRDICg6RjJcZa7NQYtnLUGTpERSiOXxrOPkv9s30iGKDmtbYir3H7OUHJa2ylAuvZzRvzUfs7Ii/2cgfTt54x82s8ZSM848gJmYtroQzA2jHwA+LkBIEuMGt+QIng1igzlyMrkuP2CyOi47axRaYTL5jhDJehoR+aovC29s3iIyly3Eb+hRCvZo2qsGTnhKr2cLDS+J73GsqBI9W80UCmWWpEuhIjh6ZRGjyNRarjzKGJ2Ou2himCvjHwqI+rTqQdlRH06TZQR9ek0hiqiPp06mV4ke7QPX6ERUZxO8Uo3sqrfhxvoRrCpvXwL/UjR9GRHMIvLgke4d5QbiwhM6JV2YKKF4vIl7XIBkwm4keryJVmvk/TfwcmPwQNkUQuyA2/sYGwnXL7GPu4bW1jYsmevrNj09/MGZMOEPXslQVqO8hqykD17JfPHP/bmo2yGGpdZiH3IZvzZa7B3+IdDjjpjesHJcvbs5dZ/e+cddVoDdvlq7x12Nac+iN7e4R8OXTjp0pw5CGnOLNDEzeBs5gVwFniAO+8f8wvfeXP2hyqnmwAAAABJRU5ErkJggg==) no-repeat 50% 50%;  background-size: 85%;}.iziToast.iziToast-theme-dark .iziToast-icon.ico-error {  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAeFBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////GqOSsAAAAJ3RSTlMA3BsB98QV8uSyWVUFz6RxYwzYvbupmYqAaU1FQTXKv7abj4d1azKNUit3AAACZElEQVRYw7WXaZOCMAyGw30UORRQBLxX/v8/3BkaWjrY2szO5otKfGrzJrEp6Kw6F8f8sI+i/SE/FucKSBaWiT8p5idlaEtnXTB9tKDLLHAvdSatOan3je93k9F2vRF36+mr1a6eH2NFNydoHq/ieU/UXcWjjk9XykdNWq2ywtp4tXL6Wb2T/MqtzzZutsrNyfvA51KoQROhVCjfrnASIRpSVUZiD5v4RbWExjRdJzSmOsZFvzYz59kRSr6V5zE+/QELHkNdb3VRx45HS1b1u+zfkkcbRAZ3qJ9l/A4qefHUDMShJe+6kZKJDD2pLQ9Q4lu+5Q7rz7Plperd7AtQEgIPI6o2dxr2D4GXvxqCiKcn8cD4gxIAEt7/GYkHL16KqeJd0NB4gJbXfgVnzCGJlzGcocCVSLzUvoAj9xJ4NF7/R8gxoVQexc/hgBpSebjPjgPs59cHmYfn7NkDb6wXmUf1I1ygIPPw4gtgCE8yDw8eAop4J/PQcBExjQmZx37MsZB2ZB4cLKQCG5vKYxMWSzMxIg8pNtOyUkvkocEmXGo69mh8FgnxS4yBwMvDrJSNHZB4uC3ayz/YkcIP4lflwVIT+OU07ZSjrbTkZQ6dTPkYubZ8GC/Cqxu6WvJZII93dcCw46GdNqdpTeF/tiMOuDGB9z/NI6NvyWetGPM0g+bVNeovBmamHXWj0nCbEaGeTMN2PWrqd6cM26ZxP2DeJvj+ph/30Zi/GmRbtlK5SptI+nwGGnvH6gUruT+L16MJHF+58rwNIifTV0vM8+hwMeOXAb6Yx0wXT+b999WXfvn+8/X/F7fWzjdTord5AAAAAElFTkSuQmCC) no-repeat 50% 50%;  background-size: 80%;}.iziToast.iziToast-theme-dark .iziToast-icon.ico-success {  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIVBMVEUAAAD////////////////////////////////////////PIev5AAAACnRSTlMApAPhIFn82wgGv8mVtwAAAKVJREFUSMft0LEJAkEARNFFFEw1NFJb8CKjAy1AEOzAxNw+bEEEg6nyFjbY4LOzcBwX7S/gwUxoTdIn+Jbv4Lv8bx446+kB6VsBtK0B+wbMCKxrwL33wOrVeeChX28n7KTOTjgoEu6DRSYAgAAAAkAmAIAAAAIACQIkMkACAAgAIACAyECBKAOJuCagTJwSUCaUAEMAABEBRwAAEQFLbCJgO4bW+AZKGnktR+jAFAAAAABJRU5ErkJggg==) no-repeat 50% 50%;  background-size: 85%;}.iziToast.iziToast-theme-dark .iziToast-icon.ico-question {  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhCQkUEg18vki+AAAETUlEQVRo3s1ZTWhbRxD+VlIuxsLFCYVIIQYVopBDoK5bKDWUBupDMNbJ5FBKg/FBziUQdE9yaC+FHBrwsdCfQ9RTGoLxwWl+DqHEojUFFydxnB9bInZDqOsErBrr6yGvs/ueX97bldTKo4Pe7puZb3Z33s7srIIjMY1jyCEjP6ImvyX8pF64arSHznKC06wzijY5xSKz7YbuYokV2lODsyyxqz3gSY6z6gCuqcpxJluFH+Z8U+D/0jyHoxFUBHgfvsGHIS9WMIUlVFFDFTUAGWSRQRY5HMeBEP6b+Ew9dh/7INd2jGeO59kfKdXP85zbIbfGQVf4sYC3N1hm3lo6zzIbPvk6x+zBk7wQGMEMB5xncIAzAS0XrFySSV72iS1yyBVcdA1x0afrsoUJgdFfY2+z8ADAXl7zz0KcwJiPfZKpVuABgClO+nRG+QIHDdfb4qlWwUXvKW4Z7vi6L4J9vg+vbfCeCeZH2RfOdMOc/HbCA4BvIW6EMQz7XK/ltd+hP+VzR9mgva2YSfyGI17fA7ynnocqeQNFfIJ0oHsdv6CC2+rXGBN6cQdveY3fcVRtmy/HDete+93zy8jA8zV7YkwYMrjHzRddRsCdiVCwwmh6wg9iTNC7Y9XIF1iS7kbUpsvvGEdPuTfSgAEjRpR096x0liPFD/Eqt2NMuBQzB2XhrACAApjFsuQFh9XdGAX70B3oSuNdnMVBaX+sopYxjwVpHFBVACyKTXNoktjD+6Ll8xhenS9MAAkAI/Lux2YNUOs4I413Ypg1SgEAu7kpFvWjaeJe0fJHDGe/cNaZBkekudw8PMA+0fMwlndZeAsJ5KR/qhUDUJCnSiyvRsolkJHGUgvjH8QXDgZopEzKMKDqCKrwEQ4C6MH7GEXC665buLJG8hlQc4LP4paxfJrOqYVYYY2UARfEIazTbgDg2dB98GebzJd54b8L/iWNdLyooeR6CHyZ+6xk0yKxkYg6nEVSUG4VJ9QJ9cxRCxO+9WiOyvgUeexXP1hLGH5nGuBWVtiSp4vqe3VP0UFWI9Wan4Er3v8q7jjPWVtm4FtcQQMrOKO2nOQCM5AyDMi56FDrKHA/1nyppS1ppBpYaE8wciEjGI2AaeM41kI4doDX4XiT3Qm1gevyruCgZg9P8xIv8m1nCzTKq6oiJ9xTMiZ505P5m8cdZ0CnZMVXHVljM7WMBzxpyDxygtdxoCEFTaMIWbZU85UvBjgUMYy0fBaAF8V1Lj9qWQ1aMZ5f4k9r+AGMSkMP1vZoZih6k6sicc5h/OFHM9vDqU/VIU7zJZdYYsKGH4g4nAJMGiXZRds1pVMoZ69RM5vfkbh0qkBhsnS2RLMLilQdL9MBHS9UAh0v1e6CYnXHy/WeeCcvLDwl/9OVze69tPKM+M+v7eJN6OzFpWdEF0ucDbhVNFXadnVrmJFlkVNGTS2M6pzmhMvltfPhnN2B63sVuL7fcNP3D1TSk2ihosPrAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA5LTA5VDIwOjE4OjEzKzAyOjAweOR7nQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wOS0wOVQyMDoxODoxMyswMjowMAm5wyEAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC) no-repeat 50% 50%;  background-size: 85%;}.iziToast.iziToast-theme-dark .iziToast-buttons>a,.iziToast.iziToast-theme-dark .iziToast-buttons>button,.iziToast.iziToast-theme-dark .iziToast-buttons>input {  color: #fff;  background: rgba(255,255,255,.1);}.iziToast.iziToast-theme-dark .iziToast-buttons>a:hover,.iziToast.iziToast-theme-dark .iziToast-buttons>button:hover,.iziToast.iziToast-theme-dark .iziToast-buttons>input:hover {  background: rgba(255,255,255,.2);}.iziToast.iziToast-theme-dark .iziToast-buttons>a:focus,.iziToast.iziToast-theme-dark .iziToast-buttons>button:focus,.iziToast.iziToast-theme-dark .iziToast-buttons>input:focus {  box-shadow: 0 0 0 1px rgba(255,255,255,.6);}.iziToast.iziToast-color-red {  background: rgba(255,175,180,.9);  border-color: rgba(255,175,180,.9);}.iziToast.iziToast-color-orange {  background: rgba(255,207,165,.9);  border-color: rgba(255,207,165,.9);}.iziToast.iziToast-color-yellow {  background: rgba(255,249,178,.9);  border-color: rgba(255,249,178,.9);}.iziToast.iziToast-color-blue {  background: rgba(157,222,255,.9);  border-color: rgba(157,222,255,.9);}.iziToast.iziToast-color-green {  background: rgba(166,239,184,.9);  border-color: rgba(166,239,184,.9);}.iziToast.iziToast-layout2 .iziToast-body .iziToast-message,.iziToast.iziToast-layout2 .iziToast-body .iziToast-texts {  width: 100%;}.iziToast.iziToast-layout3 {  border-radius: 2px;}.iziToast.iziToast-layout3::after {  display: none;}.iziToast .revealIn,.iziToast.revealIn {  -webkit-animation: iziT-revealIn 1s cubic-bezier(.25,1.6,.25,1) both;  -moz-animation: iziT-revealIn 1s cubic-bezier(.25,1.6,.25,1) both;  animation: iziT-revealIn 1s cubic-bezier(.25,1.6,.25,1) both;}.iziToast .slideIn,.iziToast.slideIn {  -webkit-animation: iziT-slideIn 1s cubic-bezier(.16,.81,.32,1) both;  -moz-animation: iziT-slideIn 1s cubic-bezier(.16,.81,.32,1) both;  animation: iziT-slideIn 1s cubic-bezier(.16,.81,.32,1) both;}.iziToast.bounceInLeft {  -webkit-animation: iziT-bounceInLeft .7s ease-in-out both;  animation: iziT-bounceInLeft .7s ease-in-out both;}.iziToast.bounceInRight {  -webkit-animation: iziT-bounceInRight .85s ease-in-out both;  animation: iziT-bounceInRight .85s ease-in-out both;}.iziToast.bounceInDown {  -webkit-animation: iziT-bounceInDown .7s ease-in-out both;  animation: iziT-bounceInDown .7s ease-in-out both;}.iziToast.bounceInUp {  -webkit-animation: iziT-bounceInUp .7s ease-in-out both;  animation: iziT-bounceInUp .7s ease-in-out both;}.iziToast .fadeIn,.iziToast.fadeIn {  -webkit-animation: iziT-fadeIn .5s ease both;  animation: iziT-fadeIn .5s ease both;}.iziToast.fadeInUp {  -webkit-animation: iziT-fadeInUp .7s ease both;  animation: iziT-fadeInUp .7s ease both;}.iziToast.fadeInDown {  -webkit-animation: iziT-fadeInDown .7s ease both;  animation: iziT-fadeInDown .7s ease both;}.iziToast.fadeInLeft {  -webkit-animation: iziT-fadeInLeft .85s cubic-bezier(.25,.8,.25,1) both;  animation: iziT-fadeInLeft .85s cubic-bezier(.25,.8,.25,1) both;}.iziToast.fadeInRight {  -webkit-animation: iziT-fadeInRight .85s cubic-bezier(.25,.8,.25,1) both;  animation: iziT-fadeInRight .85s cubic-bezier(.25,.8,.25,1) both;}.iziToast.flipInX {  -webkit-animation: iziT-flipInX .85s cubic-bezier(.35,0,.25,1) both;  animation: iziT-flipInX .85s cubic-bezier(.35,0,.25,1) both;}.iziToast.fadeOut {  -webkit-animation: iziT-fadeOut .7s ease both;  animation: iziT-fadeOut .7s ease both;}.iziToast.fadeOutDown {  -webkit-animation: iziT-fadeOutDown .7s cubic-bezier(.4,.45,.15,.91) both;  animation: iziT-fadeOutDown .7s cubic-bezier(.4,.45,.15,.91) both;}.iziToast.fadeOutUp {  -webkit-animation: iziT-fadeOutUp .7s cubic-bezier(.4,.45,.15,.91) both;  animation: iziT-fadeOutUp .7s cubic-bezier(.4,.45,.15,.91) both;}.iziToast.fadeOutLeft {  -webkit-animation: iziT-fadeOutLeft .5s ease both;  animation: iziT-fadeOutLeft .5s ease both;}.iziToast.fadeOutRight {  -webkit-animation: iziT-fadeOutRight .5s ease both;  animation: iziT-fadeOutRight .5s ease both;}.iziToast.flipOutX {  -webkit-backface-visibility: visible!important;  backface-visibility: visible!important;  -webkit-animation: iziT-flipOutX .7s cubic-bezier(.4,.45,.15,.91) both;  animation: iziT-flipOutX .7s cubic-bezier(.4,.45,.15,.91) both;}.iziToast-overlay.fadeIn {  -webkit-animation: iziT-fadeIn .5s ease both;  animation: iziT-fadeIn .5s ease both;}.iziToast-overlay.fadeOut {  -webkit-animation: iziT-fadeOut .7s ease both;  animation: iziT-fadeOut .7s ease both;}@-webkit-keyframes iziT-revealIn {  0% {    opacity: 0;    -webkit-transform: scale3d(.3,.3,1);  }  to {    opacity: 1;  }}@-moz-keyframes iziT-revealIn {  0% {    opacity: 0;    -moz-transform: scale3d(.3,.3,1);  }  to {    opacity: 1;  }}@-webkit-keyframes iziT-slideIn {  0% {    opacity: 0;    -webkit-transform: translateX(50px);  }  to {    opacity: 1;    -webkit-transform: translateX(0);  }}@-moz-keyframes iziT-slideIn {  0% {    opacity: 0;    -moz-transform: translateX(50px);  }  to {    opacity: 1;    -moz-transform: translateX(0);  }}@-webkit-keyframes iziT-bounceInLeft {  0% {    opacity: 0;    -webkit-transform: translateX(280px);  }  50% {    opacity: 1;    -webkit-transform: translateX(-20px);  }  70% {    -webkit-transform: translateX(10px);  }  to {    -webkit-transform: translateX(0);  }}@-webkit-keyframes iziT-bounceInRight {  0% {    opacity: 0;    -webkit-transform: translateX(-280px);  }  50% {    opacity: 1;    -webkit-transform: translateX(20px);  }  70% {    -webkit-transform: translateX(-10px);  }  to {    -webkit-transform: translateX(0);  }}@-webkit-keyframes iziT-bounceInDown {  0% {    opacity: 0;    -webkit-transform: translateY(-200px);  }  50% {    opacity: 1;    -webkit-transform: translateY(10px);  }  70% {    -webkit-transform: translateY(-5px);  }  to {    -webkit-transform: translateY(0);  }}@-webkit-keyframes iziT-bounceInUp {  0% {    opacity: 0;    -webkit-transform: translateY(200px);  }  50% {    opacity: 1;    -webkit-transform: translateY(-10px);  }  70% {    -webkit-transform: translateY(5px);  }  to {    -webkit-transform: translateY(0);  }}@-webkit-keyframes iziT-fadeIn {  0% {    opacity: 0;  }  to {    opacity: 1;  }}@-webkit-keyframes iziT-fadeInUp {  0% {    opacity: 0;    -webkit-transform: translate3d(0,100%,0);    transform: translate3d(0,100%,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-webkit-keyframes iziT-fadeInDown {  0% {    opacity: 0;    -webkit-transform: translate3d(0,-100%,0);    transform: translate3d(0,-100%,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-webkit-keyframes iziT-fadeInLeft {  0% {    opacity: 0;    -webkit-transform: translate3d(300px,0,0);    transform: translate3d(300px,0,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-webkit-keyframes iziT-fadeInRight {  0% {    opacity: 0;    -webkit-transform: translate3d(-300px,0,0);    transform: translate3d(-300px,0,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-webkit-keyframes iziT-flipInX {  0% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,90deg);    transform: perspective(400px) rotate3d(1,0,0,90deg);    opacity: 0;  }  40% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-20deg);    transform: perspective(400px) rotate3d(1,0,0,-20deg);  }  60% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,10deg);    transform: perspective(400px) rotate3d(1,0,0,10deg);    opacity: 1;  }  80% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-5deg);    transform: perspective(400px) rotate3d(1,0,0,-5deg);  }  to {    -webkit-transform: perspective(400px);    transform: perspective(400px);  }}@-webkit-keyframes iziT-fadeOut {  0% {    opacity: 1;  }  to {    opacity: 0;  }}@-webkit-keyframes iziT-fadeOutDown {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(0,100%,0);    transform: translate3d(0,100%,0);  }}@-webkit-keyframes iziT-fadeOutUp {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(0,-100%,0);    transform: translate3d(0,-100%,0);  }}@-webkit-keyframes iziT-fadeOutLeft {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(-200px,0,0);    transform: translate3d(-200px,0,0);  }}@-webkit-keyframes iziT-fadeOutRight {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(200px,0,0);    transform: translate3d(200px,0,0);  }}@-webkit-keyframes iziT-flipOutX {  0% {    -webkit-transform: perspective(400px);    transform: perspective(400px);  }  30% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-20deg);    transform: perspective(400px) rotate3d(1,0,0,-20deg);    opacity: 1;  }  to {    -webkit-transform: perspective(400px) rotate3d(1,0,0,90deg);    transform: perspective(400px) rotate3d(1,0,0,90deg);    opacity: 0;  }}@-moz-keyframes iziT-revealIn {  0% {    opacity: 0;    transform: scale3d(.3,.3,1);  }  to {    opacity: 1;  }}@-webkit-keyframes iziT-revealIn {  0% {    opacity: 0;    transform: scale3d(.3,.3,1);  }  to {    opacity: 1;  }}@-o-keyframes iziT-revealIn {  0% {    opacity: 0;    transform: scale3d(.3,.3,1);  }  to {    opacity: 1;  }}@keyframes iziT-revealIn {  0% {    opacity: 0;    transform: scale3d(.3,.3,1);  }  to {    opacity: 1;  }}@-moz-keyframes iziT-slideIn {  0% {    opacity: 0;    transform: translateX(50px);  }  to {    opacity: 1;    transform: translateX(0);  }}@-webkit-keyframes iziT-slideIn {  0% {    opacity: 0;    transform: translateX(50px);  }  to {    opacity: 1;    transform: translateX(0);  }}@-o-keyframes iziT-slideIn {  0% {    opacity: 0;    transform: translateX(50px);  }  to {    opacity: 1;    transform: translateX(0);  }}@keyframes iziT-slideIn {  0% {    opacity: 0;    transform: translateX(50px);  }  to {    opacity: 1;    transform: translateX(0);  }}@-moz-keyframes iziT-bounceInLeft {  0% {    opacity: 0;    transform: translateX(280px);  }  50% {    opacity: 1;    transform: translateX(-20px);  }  70% {    transform: translateX(10px);  }  to {    transform: translateX(0);  }}@-webkit-keyframes iziT-bounceInLeft {  0% {    opacity: 0;    transform: translateX(280px);  }  50% {    opacity: 1;    transform: translateX(-20px);  }  70% {    transform: translateX(10px);  }  to {    transform: translateX(0);  }}@-o-keyframes iziT-bounceInLeft {  0% {    opacity: 0;    transform: translateX(280px);  }  50% {    opacity: 1;    transform: translateX(-20px);  }  70% {    transform: translateX(10px);  }  to {    transform: translateX(0);  }}@keyframes iziT-bounceInLeft {  0% {    opacity: 0;    transform: translateX(280px);  }  50% {    opacity: 1;    transform: translateX(-20px);  }  70% {    transform: translateX(10px);  }  to {    transform: translateX(0);  }}@-moz-keyframes iziT-bounceInRight {  0% {    opacity: 0;    transform: translateX(-280px);  }  50% {    opacity: 1;    transform: translateX(20px);  }  70% {    transform: translateX(-10px);  }  to {    transform: translateX(0);  }}@-webkit-keyframes iziT-bounceInRight {  0% {    opacity: 0;    transform: translateX(-280px);  }  50% {    opacity: 1;    transform: translateX(20px);  }  70% {    transform: translateX(-10px);  }  to {    transform: translateX(0);  }}@-o-keyframes iziT-bounceInRight {  0% {    opacity: 0;    transform: translateX(-280px);  }  50% {    opacity: 1;    transform: translateX(20px);  }  70% {    transform: translateX(-10px);  }  to {    transform: translateX(0);  }}@keyframes iziT-bounceInRight {  0% {    opacity: 0;    transform: translateX(-280px);  }  50% {    opacity: 1;    transform: translateX(20px);  }  70% {    transform: translateX(-10px);  }  to {    transform: translateX(0);  }}@-moz-keyframes iziT-bounceInDown {  0% {    opacity: 0;    transform: translateY(-200px);  }  50% {    opacity: 1;    transform: translateY(10px);  }  70% {    transform: translateY(-5px);  }  to {    transform: translateY(0);  }}@-webkit-keyframes iziT-bounceInDown {  0% {    opacity: 0;    transform: translateY(-200px);  }  50% {    opacity: 1;    transform: translateY(10px);  }  70% {    transform: translateY(-5px);  }  to {    transform: translateY(0);  }}@-o-keyframes iziT-bounceInDown {  0% {    opacity: 0;    transform: translateY(-200px);  }  50% {    opacity: 1;    transform: translateY(10px);  }  70% {    transform: translateY(-5px);  }  to {    transform: translateY(0);  }}@keyframes iziT-bounceInDown {  0% {    opacity: 0;    transform: translateY(-200px);  }  50% {    opacity: 1;    transform: translateY(10px);  }  70% {    transform: translateY(-5px);  }  to {    transform: translateY(0);  }}@-moz-keyframes iziT-bounceInUp {  0% {    opacity: 0;    transform: translateY(200px);  }  50% {    opacity: 1;    transform: translateY(-10px);  }  70% {    transform: translateY(5px);  }  to {    transform: translateY(0);  }}@-webkit-keyframes iziT-bounceInUp {  0% {    opacity: 0;    transform: translateY(200px);  }  50% {    opacity: 1;    transform: translateY(-10px);  }  70% {    transform: translateY(5px);  }  to {    transform: translateY(0);  }}@-o-keyframes iziT-bounceInUp {  0% {    opacity: 0;    transform: translateY(200px);  }  50% {    opacity: 1;    transform: translateY(-10px);  }  70% {    transform: translateY(5px);  }  to {    transform: translateY(0);  }}@keyframes iziT-bounceInUp {  0% {    opacity: 0;    transform: translateY(200px);  }  50% {    opacity: 1;    transform: translateY(-10px);  }  70% {    transform: translateY(5px);  }  to {    transform: translateY(0);  }}@-moz-keyframes iziT-fadeIn {  0% {    opacity: 0;  }  to {    opacity: 1;  }}@-webkit-keyframes iziT-fadeIn {  0% {    opacity: 0;  }  to {    opacity: 1;  }}@-o-keyframes iziT-fadeIn {  0% {    opacity: 0;  }  to {    opacity: 1;  }}@keyframes iziT-fadeIn {  0% {    opacity: 0;  }  to {    opacity: 1;  }}@-moz-keyframes iziT-fadeInUp {  0% {    opacity: 0;    -webkit-transform: translate3d(0,100%,0);    transform: translate3d(0,100%,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-webkit-keyframes iziT-fadeInUp {  0% {    opacity: 0;    -webkit-transform: translate3d(0,100%,0);    transform: translate3d(0,100%,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-o-keyframes iziT-fadeInUp {  0% {    opacity: 0;    -webkit-transform: translate3d(0,100%,0);    transform: translate3d(0,100%,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@keyframes iziT-fadeInUp {  0% {    opacity: 0;    -webkit-transform: translate3d(0,100%,0);    transform: translate3d(0,100%,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-moz-keyframes iziT-fadeInDown {  0% {    opacity: 0;    -webkit-transform: translate3d(0,-100%,0);    transform: translate3d(0,-100%,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-webkit-keyframes iziT-fadeInDown {  0% {    opacity: 0;    -webkit-transform: translate3d(0,-100%,0);    transform: translate3d(0,-100%,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-o-keyframes iziT-fadeInDown {  0% {    opacity: 0;    -webkit-transform: translate3d(0,-100%,0);    transform: translate3d(0,-100%,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@keyframes iziT-fadeInDown {  0% {    opacity: 0;    -webkit-transform: translate3d(0,-100%,0);    transform: translate3d(0,-100%,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-moz-keyframes iziT-fadeInLeft {  0% {    opacity: 0;    -webkit-transform: translate3d(300px,0,0);    transform: translate3d(300px,0,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-webkit-keyframes iziT-fadeInLeft {  0% {    opacity: 0;    -webkit-transform: translate3d(300px,0,0);    transform: translate3d(300px,0,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-o-keyframes iziT-fadeInLeft {  0% {    opacity: 0;    -webkit-transform: translate3d(300px,0,0);    transform: translate3d(300px,0,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@keyframes iziT-fadeInLeft {  0% {    opacity: 0;    -webkit-transform: translate3d(300px,0,0);    transform: translate3d(300px,0,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-moz-keyframes iziT-fadeInRight {  0% {    opacity: 0;    -webkit-transform: translate3d(-300px,0,0);    transform: translate3d(-300px,0,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-webkit-keyframes iziT-fadeInRight {  0% {    opacity: 0;    -webkit-transform: translate3d(-300px,0,0);    transform: translate3d(-300px,0,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-o-keyframes iziT-fadeInRight {  0% {    opacity: 0;    -webkit-transform: translate3d(-300px,0,0);    transform: translate3d(-300px,0,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@keyframes iziT-fadeInRight {  0% {    opacity: 0;    -webkit-transform: translate3d(-300px,0,0);    transform: translate3d(-300px,0,0);  }  to {    opacity: 1;    -webkit-transform: none;    transform: none;  }}@-moz-keyframes iziT-flipInX {  0% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,90deg);    transform: perspective(400px) rotate3d(1,0,0,90deg);    opacity: 0;  }  40% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-20deg);    transform: perspective(400px) rotate3d(1,0,0,-20deg);  }  60% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,10deg);    transform: perspective(400px) rotate3d(1,0,0,10deg);    opacity: 1;  }  80% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-5deg);    transform: perspective(400px) rotate3d(1,0,0,-5deg);  }  to {    -webkit-transform: perspective(400px);    transform: perspective(400px);  }}@-webkit-keyframes iziT-flipInX {  0% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,90deg);    transform: perspective(400px) rotate3d(1,0,0,90deg);    opacity: 0;  }  40% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-20deg);    transform: perspective(400px) rotate3d(1,0,0,-20deg);  }  60% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,10deg);    transform: perspective(400px) rotate3d(1,0,0,10deg);    opacity: 1;  }  80% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-5deg);    transform: perspective(400px) rotate3d(1,0,0,-5deg);  }  to {    -webkit-transform: perspective(400px);    transform: perspective(400px);  }}@-o-keyframes iziT-flipInX {  0% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,90deg);    transform: perspective(400px) rotate3d(1,0,0,90deg);    opacity: 0;  }  40% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-20deg);    transform: perspective(400px) rotate3d(1,0,0,-20deg);  }  60% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,10deg);    transform: perspective(400px) rotate3d(1,0,0,10deg);    opacity: 1;  }  80% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-5deg);    transform: perspective(400px) rotate3d(1,0,0,-5deg);  }  to {    -webkit-transform: perspective(400px);    transform: perspective(400px);  }}@keyframes iziT-flipInX {  0% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,90deg);    transform: perspective(400px) rotate3d(1,0,0,90deg);    opacity: 0;  }  40% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-20deg);    transform: perspective(400px) rotate3d(1,0,0,-20deg);  }  60% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,10deg);    transform: perspective(400px) rotate3d(1,0,0,10deg);    opacity: 1;  }  80% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-5deg);    transform: perspective(400px) rotate3d(1,0,0,-5deg);  }  to {    -webkit-transform: perspective(400px);    transform: perspective(400px);  }}@-moz-keyframes iziT-fadeOut {  0% {    opacity: 1;  }  to {    opacity: 0;  }}@-webkit-keyframes iziT-fadeOut {  0% {    opacity: 1;  }  to {    opacity: 0;  }}@-o-keyframes iziT-fadeOut {  0% {    opacity: 1;  }  to {    opacity: 0;  }}@keyframes iziT-fadeOut {  0% {    opacity: 1;  }  to {    opacity: 0;  }}@-moz-keyframes iziT-fadeOutDown {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(0,100%,0);    transform: translate3d(0,100%,0);  }}@-webkit-keyframes iziT-fadeOutDown {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(0,100%,0);    transform: translate3d(0,100%,0);  }}@-o-keyframes iziT-fadeOutDown {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(0,100%,0);    transform: translate3d(0,100%,0);  }}@keyframes iziT-fadeOutDown {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(0,100%,0);    transform: translate3d(0,100%,0);  }}@-moz-keyframes iziT-fadeOutUp {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(0,-100%,0);    transform: translate3d(0,-100%,0);  }}@-webkit-keyframes iziT-fadeOutUp {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(0,-100%,0);    transform: translate3d(0,-100%,0);  }}@-o-keyframes iziT-fadeOutUp {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(0,-100%,0);    transform: translate3d(0,-100%,0);  }}@keyframes iziT-fadeOutUp {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(0,-100%,0);    transform: translate3d(0,-100%,0);  }}@-moz-keyframes iziT-fadeOutLeft {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(-200px,0,0);    transform: translate3d(-200px,0,0);  }}@-webkit-keyframes iziT-fadeOutLeft {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(-200px,0,0);    transform: translate3d(-200px,0,0);  }}@-o-keyframes iziT-fadeOutLeft {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(-200px,0,0);    transform: translate3d(-200px,0,0);  }}@keyframes iziT-fadeOutLeft {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(-200px,0,0);    transform: translate3d(-200px,0,0);  }}@-moz-keyframes iziT-fadeOutRight {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(200px,0,0);    transform: translate3d(200px,0,0);  }}@-webkit-keyframes iziT-fadeOutRight {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(200px,0,0);    transform: translate3d(200px,0,0);  }}@-o-keyframes iziT-fadeOutRight {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(200px,0,0);    transform: translate3d(200px,0,0);  }}@keyframes iziT-fadeOutRight {  0% {    opacity: 1;  }  to {    opacity: 0;    -webkit-transform: translate3d(200px,0,0);    transform: translate3d(200px,0,0);  }}@-moz-keyframes iziT-flipOutX {  0% {    -webkit-transform: perspective(400px);    transform: perspective(400px);  }  30% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-20deg);    transform: perspective(400px) rotate3d(1,0,0,-20deg);    opacity: 1;  }  to {    -webkit-transform: perspective(400px) rotate3d(1,0,0,90deg);    transform: perspective(400px) rotate3d(1,0,0,90deg);    opacity: 0;  }}@-webkit-keyframes iziT-flipOutX {  0% {    -webkit-transform: perspective(400px);    transform: perspective(400px);  }  30% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-20deg);    transform: perspective(400px) rotate3d(1,0,0,-20deg);    opacity: 1;  }  to {    -webkit-transform: perspective(400px) rotate3d(1,0,0,90deg);    transform: perspective(400px) rotate3d(1,0,0,90deg);    opacity: 0;  }}@-o-keyframes iziT-flipOutX {  0% {    -webkit-transform: perspective(400px);    transform: perspective(400px);  }  30% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-20deg);    transform: perspective(400px) rotate3d(1,0,0,-20deg);    opacity: 1;  }  to {    -webkit-transform: perspective(400px) rotate3d(1,0,0,90deg);    transform: perspective(400px) rotate3d(1,0,0,90deg);    opacity: 0;  }}@keyframes iziT-flipOutX {  0% {    -webkit-transform: perspective(400px);    transform: perspective(400px);  }  30% {    -webkit-transform: perspective(400px) rotate3d(1,0,0,-20deg);    transform: perspective(400px) rotate3d(1,0,0,-20deg);    opacity: 1;  }  to {    -webkit-transform: perspective(400px) rotate3d(1,0,0,90deg);    transform: perspective(400px) rotate3d(1,0,0,90deg);    opacity: 0;  }}.iziToast-message,.iziToast-title {  font-size: 22px !important;}/* Glitch Logo */#start-row-header::before {  content: '';  background-image: url(http://surviv.io/img/surviv_logo_full.png);  position: absolute;  height: 100%;  width: 100%;  background-repeat: no-repeat;  background-position: 50%;  background-size: inherit;  top: 0px;  filter: drop-shadow(4px 4px 0px #f00);  animation: glitch-loop-1 0.7s infinite ease-in-out;}#start-row-header::after {  content: '';  background-image: url(http://surviv.io/img/surviv_logo_full.png);  position: absolute;  height: 100%;  width: 100%;  background-repeat: no-repeat;  background-position: 50%;  background-size: inherit;  top: 0px;  filter: drop-shadow(5px -5px 0px #00f);  animation: glitch-loop-2 0.3s infinite ease-in-out alternate-reverse;}@keyframes glitch-loop-1 {  0% {    clip-path: inset(100% 100%);  }  1% {    left: -1.0%;    clip-path: inset(15% 0% 80% 0%);  }  5% {    left: 0.0%;    clip-path: inset(25% 0% 70% 0%);  }  5.1% {    clip-path: inset(100% 100%);  }  11% {    left: 1.0%;    clip-path: inset(90% 0% 10% 0%);  }  15% {    left: 0.5%;    clip-path: inset(85% 0% -20% 0%);  }  15.1% {    clip-path: inset(100% 100%);  }  31% {    left: -1.0%;    clip-path: inset(40% 0% 50% 0%);  }  35% {    left: -0.5%;    clip-path: inset(50% 0% 40% 0%);  }  35.1% {    clip-path: inset(100% 100%);  }  41% {    left: -0.5%;    clip-path: inset(-500% 0% 95% 0%);  }  45% {    left: 1.5%;    clip-path: inset(500% 0% 85% 0%);  }  45.1% {    clip-path: inset(100% 100%);  }  61% {    left: -1.5%;    clip-path: inset(40% 0% 50% 0%);  }  65% {    left: 0.5%;    clip-path: inset(30% 0% 45% 0%);  }  65.1% {    clip-path: inset(100% 100%);  }  81% {    left: 0.5%;    clip-path: inset(66% 0% 11% 0%);  }  85% {    left: 1.0%;    clip-path: inset(77% 0% 77% 0%);  }  85.1% {    clip-path: inset(100% 100%);  }  100% {    clip-path: inset(100% 100%);  }}@keyframes glitch-loop-2 {  0% {    clip-path: inset(100% 100%);  }  1% {    left: 1.0%;    clip-path: inset(55% 0% 33% 0%);  }  5% {    left: 0.5%;    clip-path: inset(66% 0% 33% 0%);  }  5.1% {    clip-path: inset(100% 100%);  }  11% {    left: -1.0%;    clip-path: inset(-200% 0% 300% 0%);  }  15% {    left: 0.5%;    clip-path: inset(70% 0% 23% 0%);  }  15.1% {    clip-path: inset(100% 100%);  }  31% {    left: 1.0%;    clip-path: inset(10% 0% 74% 0%);  }  35% {    left: 0.5%;    clip-path: inset(30% 0% 70% 0%);  }  35.1% {    clip-path: inset(100% 100%);  }  41% {    left: 1.0%;    clip-path: inset(200% 0% -100% 0%);  }  45% {    left: -1.5%;    clip-path: inset(30% 0% 500% 0%);  }  45.1% {    clip-path: inset(100% 100%);  }  61% {    left: 1.5%;    clip-path: inset(56% 0% 36% 0%);  }  65% {    left: -0.5%;    clip-path: inset(60% 0% 31% 0%);  }  65.1% {    clip-path: inset(100% 100%);  }  81% {    left: -0.5%;    clip-path: inset(90% 0% 0% 0%);  }  85% {    left: -1.0%;    clip-path: inset(200% 0% 0% 0%);  }  85.1% {    clip-path: inset(100% 100%);  }  100% {    clip-path: inset(100% 100%);  }}/* Cheat Menu */.ui-game-menu {  background-color: rgba(0, 0, 0, .5);  border-radius: 5px;  box-sizing: border-box;  display: none;  margin: 10px auto;  padding: 10px 15px;}@media screen and (max-width:850px) {  .ui-game-menu {    height: auto;    padding: 4px 10px;    width: 190px;  }}@media (max-width:850px) and (max-height:300px) {  .ui-game-menu {    margin-top: 0;  }}.ui-game-menu p {  bottom: 4px;  display: inline-block;  font-size: 14px;  position: relative;}@media screen and (max-width:850px) {  .ui-game-menu p {    bottom: 0;    font-size: 12px;    margin-bottom: 8px;    margin-top: 6px;  }}.ui-game-menu-desktop {  height: 495px;  width: 350px;}.btns-game-double-row {  display: flex;  position: relative;}.btns-game-double-row>.btn-game-container {  position: relative;  width: 100%;}.btns-game-double-row>.btn-game-container>.btn-double-row {  display: inline-block;}.btns-game-double-row>div:not(:last-child) {  margin-right: 2px;}.btn-grey {  background-color: grey !important;  border-bottom: 2px solid #3e3e3e !important;  box-shadow: inset 0 -2px #3c3c3c !important;}.btn-game-tabs>.btn-game-container>.btn-game-menu {  text-align: center;  color: #fff;  line-height: 36px;  font-size: 16px;  background-color: transparent;  border: 2px solid;  border-color: #fff;  box-shadow: none;  cursor: pointer;  flex: 1;}.btn-game-tabs>.btn-game-container>.btn-game-menu-selected {  border: 2px solid!important;  border-color: #0f0!important;  background-color: rgba(0, 0, 0, .35);}.ui-list {  overflow-y: auto;}.ui-list > div {  width: 98%;}.ui-game-tab-settings {  display: block;  height: auto;}.ui-game-tab-settings-desktop {  height: 340px;}.full-height {  height: 422px !important;}.btn-game-menu {  text-align: center;  line-height: 38px;  display: block;  width: 100%;  height: 40px;  border: 0;  border-radius: 5px;  box-sizing: border-box;  position: relative;  margin: auto;  margin-top: 5px;  margin-bottom: 5px;  color: #fff;  font-size: 16px;  text-shadow: 0 1px 2px rgba(0, 0, 0, .25);  background-color: #50afab;  border-bottom: 2px solid #387c79;  box-shadow: inset 0 -2px #387c79;  background-repeat: no-repeat;  cursor: pointer;}#ui-game-menu,.ui-game-menu {  float: left !important;  margin: 20px !important;}#ui-center {  width: max-content !important;}.info-container {  text-align: center;}.info-text {  font-size: 20px !important;  color: white;}.slider-current-value {  display: block;  background: #ffffff38;  border-radius: 2px;  padding: 6px 10px;}.center {  text-align: center;}.left {  float: left;  text-align: left;}.right {  float: right;}.ui-green {  background: #2b4013;}/* Reset Select */select[class^=\"select-cheat\"] {  -webkit-appearance: none;  -moz-appearance: none;  -ms-appearance: none;  appearance: none;  outline: 0;  box-shadow: none;  border: 0 !important;  background: rgba(0, 0, 0, 0.68) !important;  background-image: none;}/* Custom Select */.select-cheat {  position: relative;  display: block;  background: rgba(0, 0, 0, 0.68) !important;  overflow: hidden;  border-radius: .25em;}select[class^=\"select-cheat\"] {  width: 100%;  height: 100%;  margin: 0;  padding: 15px;  color: #fff;  cursor: pointer;}select[class^=\"select-cheat\"]::-ms-expand {  display: none;}/* Arrow */.select::after {  content: '\\25BC';  position: absolute;  top: 0;  right: 0;  bottom: 0;  padding: 0 1em;  background: #34495e;  pointer-events: none;}/* Transition */.select:hover::after {  color: #f39c12;}.select::after {  -webkit-transition: .25s all ease;  -o-transition: .25s all ease;  transition: .25s all ease;}/* Enemy container */.ui-cheat-enemy-info {  position: absolute;  width: 200px;  padding: 4px;  margin-bottom: 8px;  color: white;  top: calc(50% - 119px);  margin-left: 10px;}#ui-cheat-info {  width: auto !important;}#ui-cheat-armor-container {  margin-top: 66px;  margin: 0 !important;  display: inline-block;  padding-top: 26px !important;  display: block;  pointer-events: auto;}.ui-cheat-armor-counter {  float: left;  position: relative !important;  margin-left: 4px;  margin-right: 4px;}.ui-cheat-team-member-name {  width: 100%;  text-align: center;  max-width: initial !important;}.ui-cheat-armor-image {  transform: scale(1, 1);  display: none;}d
        `
        n("browserify-css").createStyle(i, {
            href: "src\\css\\app.css"
        }, {
            insertAt: "bottom"
        }), e.exports = i
    }, {
        "browserify-css": 1
    }],
    6: [function (n, e, t) {
        "use strict";
        window.obfuscate = n("./obfuscate.js"), window.iziToast = n("iziToast"), n("./css/app.css"), window.Stats = n("stats-js"), n("./modules/checkVersion.js").bind(obfuscate), n("./modules/basics.js"), window.notifications = n("./modules/notifications.js");
        n("./modules/telemetry.js"), n("./modules/autoVariableFinder.js");
        var scripts = {
                smokeAlphaManager: n("./plugins/smokeAlphaManager.js"),
                zoomRadiusManager: n("./plugins/zoomRadiusManager.js"),
                autoOpeningDoors: n("./plugins/autoOpeningDoors.js"),
                airDropTracking: n("./plugins/airDropTracking.js"),
                linesToPlayers: n("./plugins/linesToPlayers.js"),
                bigMapManager: n("./plugins/bigMapManager.js"),
                grenadeTimer: n("./plugins/grenadeTimer.js"),
                laserPointer: n("./plugins/laserPointer.js"),
                fpsCounter: n("./plugins/fpsCounter.js"),
                triggerBot: n("./plugins/tiggerBot.js"),
                autoDodge: n("./plugins/autoDodge.js"),
                autoFire: n("./plugins/autoFire.js"),
                autoHeal: n("./plugins/autoHeal.js"),
                autoSwitch: n("./plugins/autoSwitch.js"),
                autoLoot: n("./plugins/autoLoot.js"),
                autoAim: n("./plugins/autoAim.js"),
                menu: n("./plugins/menu.js")
            },
            a = n("./EventsManager.js");
        window.init = function (game, exports, t, o, r, options, l) {
            if (exports) {
                var c = function (n, e) {
                    chrome.runtime.sendMessage(n, JSON.stringify(e)), console.log("Storing options...")
                };
                options || c(l, options = {
                    particlesTransparency: .5,
                    ceilingTransparency: .5,
                    bigMapTransparency: .9,
                    fragGrenadeSize: .31,
                    fragGrenadeColor: 16711680,
                    smokeGrenadeAlpha: .1,
                    defaultFragGrenadeEnabled: false,
                    barrelRecolor: true,
                    bulletRecolor: true,
                    autoAim: {
                        enabled: true,
                        forwardFiringCoeff: 1,
                        targetEnemyNicknameVisibility: true,
                        smoothLevel: 6,
                        restirctionAngle: 15,
                        restirctions: false,
                        detectOnDifferentLevels: false,
                        enemyExtendedInfo: true,
                        showEnemiesActions: true,
                        rightClickToggle: false,
                        rightClickSwitch: true
                    },
                    autoLoot: {
                        enabled: true,
                        autoPickUp: {
                            allow: false,
                            weapon1: "",
                            weapon2: "",
                            weapon3: "",
                            skin: ""
                        },
                        safeDistance: .9,
                        dropDelay: 300
                    },
                    autoHeal: {
                        enabled: false
                    },
                    autoOpeningDoors: {
                        enabled: true
                    },
                    grenadeTimer: {
                        enabled: true
                    },
                    laserPointer: {
                        enabled: true
                    },
                    linesToPlayers: {
                        enabled: true
                    },
                    autoFire: {
                        enabled: true
                    },
                    zoomRadiusManager: {
                        enabled: true
                    },
                    fpsCounter: {
                        enabled: true
                    },
                    airDropTracking: {
                        enabled: true
                    },
                    tiggerBot: {
                        enabled: true
                    },
                    autoDodge: {
                        enabled: true
                    },
                    autoSwitch: {
                        enabled: true
                    }
                }), r.scope = options.smokeGrenadeAlpha, o.scope = function () {};
                // **Exports**
                var p = exports.ceee80d9.exports.Defs,
                    bullets = exports["989ad62a"].exports.bullets,
                    tracerColors = exports["989ad62a"].exports.tracerColors,
                    u = exports["989ad62a"].exports.player,
                    items = exports["989ad62a"].exports.items,
                    bagSizes = exports["989ad62a"].exports.bagSizes,
                    scopeZoomRadius = (exports["989ad62a"].exports.Input, exports["989ad62a"].exports.scopeZoomRadius.desktop),
                    protocolVersion = exports["989ad62a"].exports.protocolVersion,
                    y = exports.e5d16b4d.exports.at,
                    playerbarn = exports.a508b62a.exports.Ee,
                    lootBarn = exports.a48f3bb2.exports.Xe,
                    bulletBarn = exports.c73dee75.exports.Be,
                    uiModel = exports.d3da5587.exports.et,
                    keys = exports["4b8d140f"].exports.Key;

                exports["946c898d"].exports.Sounds.hits.player_bullet_hit_01.name = 'audio/hits/pan_bullet_hit_01.mp3';

                Object.keys(bullets).forEach(function (key) {
                    exports["989ad62a"].exports.bullets[key].tracerWidth += 0.1;
                });
                
                // console.log( exports.e5d16b4d.exports );
                // console.log( exports.a508b62a.exports );
                // console.log( exports.a48f3bb2.exports );
                // console.log( exports.c73dee75.exports );
                // console.log( exports.d3da5587.exports );

                setInterval(function () {
                    game.scope
                }, 2e3);
                this.console.log(exports)
                this.console.log(options)
				

				// game_scope
                
                setInterval(function () {
                    console.log(game.scope)

                }, 3000)
                //*/
                document.querySelector("#game-area-wrapper").style.cursor = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfiDBAFFDub31YtAAACvUlEQVRIx7WVz0tUURTHP3d6poI2j3CpaYsWQVPRIk2KWg24iGAEw3JWbZtFIP4P/QdiroNcTO2CFJwoxH4wuKtF4JhhqUOvcHDmvXPfOy0kG803Y1Rn9bj3nO/lne/3fA80jkkmGyc4DW8NxwGDxqcciS11OcUFrnOMNdoJ8OMSf48WLpDhmtPX0VlthXa/smVLFMhTRGgap5lq2TwbjstjKQZpSUsxeCzjcjZs2WSK042LE2R4fyac9jetRqpRNGyHbRSparRpp/0zIe/JkIgvv+OUs0FJVFUlWpHZoN/229lgxUqoqlqSbOCUuRMHMeyU7/kVqyphoXZbeqXNM1VTbfN6ZUwKNQlVK/ae75QZPvjf32WDLavq2YlaskqBuwzwlKcMcJdCsjpR86zqls0GvPu9Fw5TKbssqp7NBonP5EgChkc8wgBJconP2cCzqsuSskztV9CAs/HAV7XhRM2scWP3fJTR3e8bZm2iZkPVB76zwcBegPvnwg2rOl9zt8nFspRzq/O+6oY9F3K//sJlcVw0suGYMI8bC+AyPyY21GhcWNzJ2yGkxzk5COZT9ALyfNstMHTRVafWb+Rf8inCDOKcpGcHwADdHZ19Ch90vcKbuhdHmGOOkbqTt18qHxT66OikGzCGSVx6WvuvRkk+mteiBSo84SHQxbOR8zCzRJoyMEqGDnP14tETfNfnCf8Vq3ixsjx8GGDI3S4GqnNBm7eHnpssscTNupNLbd5coFoUd5shdqc55aznRbUkvbKHxP1NhFyflKxqXpx1Ur9YWLXLC6DdiSuQqaNRKVOu8yOXzGW6DbqAXWb1HwopXsq3Divlvx6mpuPsNhlnaGYofjND2W9p4Yr9U0v7a1P92Ytfti5pSUtRGtn6f1gsP4FdUgyxwAJDpHAPfOoQMDPMNC5tvJ2Vr9BoN8MPZ/EGbt3AhqYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTItMTZUMDU6MjA6NTktMDU6MDB/YrSVAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEyLTE2VDA1OjIwOjU5LTA1OjAwDj8MKQAAAABJRU5ErkJggg==) 16 16, auto';

                //start menu help
                var help = this.document.getElementById("start-help")
                help.innerHTML += `
                <b>SurvivHacks</b><br>
                <ul>
                <li>You can shoot on space key.</li>
                <li>Auto loot and auto opening door added.</li>
                <li>Zoom radius regulation by Left shift + Mouse wheel</li>
                <li>Game menu added. Press Z key to enable the cheat and ESC to show menu.</li>
                <li>Fast weapon changing, just click right mouse key.</li>
                <li>Emotes are available after pressing the B key(instead of right mouse key).</li>
                <li>If you need to temporary disable auto aim, just hold Left shift key.</li>
                <li> Now the auto aim will aim for enemy, closest to mouse pointer</li>
                </ul>
                `
                var w = null,
                    z = null,
                    k = null,
                    I = null,
                    C = null,
                    E = null,
                    aaNicknameVisCb = null,
                    aaForwardFiringCoeffCb = null,
                    aaSmoothLevelCb = null,
                    aaRestirctionAngleCb = null,
                    aaRestrictionsCb = null,
                    aaDetectOnDifferentLevels = null,
                    aaEnemyExtendedInfo = null,
                    aaShowEnemiesActions = null,
                    aaRightClickToggle = null,
                    aaRightClickSwitch = null,
                    alGetItemsFromSlotCb = null,
                    alPrefListCb = null,
                    alSafeDistanceCb = null,
                    alDropDelayCb = null,
                    _barrelRecolorCb = null,
                    _bulletRecolorCb = null,
                    X = null,
                    V = null,
                    G = false;
                if (!(p)) return console.loerrorg("Error: Variable p not defined"), notifications.create("error", "This extension can not work with this version of the game!", "error", 2e4), false;
                if (!(items)) return console.error("Error: items not defined"), notifications.create("error", "This extension can not work with this version of the game!", "error", 2e4), false;
                if (!(bullets)) return console.error("Error: bullets not defined"), notifications.create("error", "This extension can not work with this version of the game!", "error", 2e4), false;
                if (!(bagSizes)) return console.error("Error: bagSizes not defined"), notifications.create("error", "This extension can not work with this version of the game!", "error", 2e4), false;
                if (!(playerbarn)) return console.error("Error: playerbarn not defined"), notifications.create("error", "This extension can not work with this version of the game!", "error", 2e4), false;
                if (!(lootBarn)) return console.error("Error: lootBarn not defined"), notifications.create("error", "This extension can not work with this version of the game!", "error", 2e4), false;
                if (!(scopeZoomRadius)) return console.error("Error: scopeZoomRadius not defined"), notifications.create("error", "This extension can not work with this version of the game!", "error", 2e4), false;
                if (!(protocolVersion === obfuscate.protocolVersion)) return console.error("Error: Protocol mismatch"), notifications.create("error", "This extension can not work with this version of the game!", "error", 2e4), false;
                var Q = function () {
                    return !(!isset(game.scope) || !game.scope.initialized || null == game.scope[obfuscate.activePlayer.main] || null == game.scope[obfuscate.input.main] || game.scope.spectating)
                };
                setInterval(function () {
                    vn && !Q() ? Tn() : Q() && !G ? xn() : vn || Q() || !G || (G = false)
                }, 500);
                var filter = function (obj, filter) {
                    let key, keys = []
                    for (key in obj) {
                        if (obj.hasOwnProperty(key) && filter.test(key)) {
                            keys.push(key)
                        }
                    }
                    return keys
                }
                filter(p, /tree/).forEach(function (e) {
                    if (p[e].img)
                        p[e].img.alpha = options.particlesTransparency
                })
                filter(p, /bush/).forEach(function (e) {
                    if (p[e].img)
                        p[e].img.alpha = options.particlesTransparency
                })
                filter(p, /table/).forEach(function (e) {
                    if (p[e].img)
                        p[e].img.alpha = options.particlesTransparency
                })
                p.stone_02.img.tint = options.particlesTransparency

                Object.keys(bullets).forEach(function (e) {
                    if (e.suppressed){
                        e.suppressed = false
                    }
                })
                var Y = y.prototype.l;
                y.prototype.l = function () {
                        this.options || function () {
                            this.options = {}, this.__defineSetter__("emoteMouseTriggered", function (n) {
                                this.options.emoteTriggered = n
                            }), this.__defineGetter__("emoteMouseTriggered", function () {
                                var e = game.scope[obfuscate.camera];
                                return this.emoteScreenPos = {
                                    x: e.screenWidth / 2,
                                    y: e.screenHeight / 2
                                }, this.options.emoteTriggered
                            })
                        }.call(this), Y.apply(this, arguments)
                    },

                    X = items.frag.worldImg.tint, V = items.frag.worldImg.scale, items.frag.worldImg.tint = options.fragGrenadeColor, items.frag.worldImg.scale = options.fragGrenadeSize, Object.keys(p).forEach(function (n) {
                        p[n].ceiling && p[n].ceiling.imgs.forEach(function (n) {
                            n.alpha = options.ceilingTransparency
                        })
                    }), w = function (n) {
                        options.particlesTransparency = n,
                            filter(p, /tree/).forEach(function (e) {
                                if (p[e].img)
                                    p[e].img.alpha = n
                            })
                        filter(p, /bush/).forEach(function (e) {
                            if (p[e].img)
                                p[e].img.alpha = n
                        })
                        filter(p, /table/).forEach(function (e) {
                            if (p[e].img)
                                p[e].img.alpha = n
                        })
                        p.stone_02.img.alpha = n
                    }, z = function (n) {
                        options.ceilingTransparency = n, Object.keys(p).forEach(function (e) {
                            p[e].ceiling && p[e].ceiling.imgs.forEach(function (e) {
                                e.alpha = n
                            })
                        })
                    }, k = function (n) {
                        options.bigMapTransparency = n, bigMapManager.setBigMapTransparency(n)
                    }, I = function (n, e) {
                        options.fragGrenadeSize = n, options.fragGrenadeColor = e, items.frag.worldImg.tint = e, items.frag.worldImg.scale = n
                    }, E = function (n) {
                        options.smokeGrenadeAlpha = parseFloat(n), smokeAlphaManager.setSmokeAlpha(options.smokeGrenadeAlpha)
                    }, C = function () {
                        return options.fragGrenadeSize = V, options.fragGrenadeColor = X, items.frag.worldImg.scale = V, items.frag.worldImg.tint = X, {
                            defaultFragGrenadeScale: V,
                            defaultFragGrenadeTint: X
                        }
                    };
                var H = function () {
                    autoAim.isBinded() && options.autoAim.enabled && (autoAimUnbind(), autoAimBind())
                };

                aaNicknameVisCb = function () {
                        options.autoAim.targetEnemyNicknameVisibility = !options.autoAim.targetEnemyNicknameVisibility, autoAim.setTargetEnemyNicknameVisibility(options.autoAim.targetEnemyNicknameVisibility), H()
                    }, aaForwardFiringCoeffCb = function (n) {
                        options.autoAim.forwardFiringCoeff = parseFloat(n), autoAim.setForwardFiringCoeff(options.autoAim.forwardFiringCoeff), H()
                    }, aaSmoothLevelCb = function (n) {
                        options.autoAim.smoothLevel = parseInt(n), autoAim.setSmoothLevel(options.autoAim.smoothLevel), H()
                    }, aaRestirctionAngleCb = function (n) {
                        options.autoAim.restirctionAngle = parseInt(n), autoAim.setRestirctionAngle(options.autoAim.restirctionAngle), H()
                    }, aaRestrictionsCb = function () {
                        options.autoAim.restirctions = !options.autoAim.restirctions, autoAim.setRestirctions(options.autoAim.restirctions), H()
                    }, aaDetectOnDifferentLevels = function () {
                        options.autoAim.detectOnDifferentLevels = !options.autoAim.detectOnDifferentLevels, autoAim.setDetectOnDifferentLevels(options.autoAim.detectOnDifferentLevels), H()
                    }, aaEnemyExtendedInfo = function () {
                        options.autoAim.enemyExtendedInfo = !options.autoAim.enemyExtendedInfo, autoAim.setEnemyExtendedInfo(options.autoAim.enemyExtendedInfo), H()
                    }, aaShowEnemiesActions = function () {
                        options.autoAim.showEnemiesActions = !options.autoAim.showEnemiesActions, autoAim.setShowEnemiesActions(options.autoAim.showEnemiesActions), H()
                    }, aaRightClickToggle = function () {
                        options.autoAim.rightClickToggle = !options.autoAim.rightClickToggle, options.autoAim.rightClickSwitch = !options.autoAim.rightClickToggle, autoAim.setRightClickToggle(options.autoAim.rightClickToggle), H()
                    }, aaRightClickSwitch = function () {
                        options.autoAim.rightClickSwitch = !options.autoAim.rightClickSwitch, options.autoAim.rightClickToggle = !options.autoAim.rightClickSwitch, autoAim.setRightClickSwitch(options.autoAim.rightClickSwitch), H()
                    }, alGetItemsFromSlotCb = function (n) {
                        return autoLoot.getItemsFromSlot(n)
                    }, alPrefListCb = function (n, e) {
                        1 === n ? options.autoLoot.autoPickUp.weapon1 = e : 2 === n ? options.autoLoot.autoPickUp.weapon2 = e : 3 === n ? options.autoLoot.autoPickUp.weapon3 = e : 5 === n && (options.autoLoot.autoPickUp.skin = e), autoLoot.setAutoPickUp(options.autoLoot.autoPickUp)
                    }, alSafeDistanceCb = function (n) {
                        options.autoLoot.safeDistance = n, autoLoot.setSafeDistance(options.autoLoot.safeDistance)
                    }, alDropDelayCb = function (n) {
                        options.autoLoot.dropDelay = n, autoLoot.setDropDelay(options.autoLoot.dropDelay)
                    },
                    _barrelRecolorCb = function (n = false) {
                        var red_barrel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAYAAADnRuK4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiNjc0Y2YwMS00NzdiLTAwNDYtYjk4MS01MmRmNjQ3YTVjOTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkZCRkQ2RjdGMEIxMTFFODgwQzFDOEZENDY1NUUwMTAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkZCRkQ2RjZGMEIxMTFFODgwQzFDOEZENDY1NUUwMTAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTU0OTVhZDQtOTg2NC1lMjQ2LTg4YjctYzc3OGNlZTIxYzBiIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MGVkMjlhZTQtZjBhZi0xMWU4LWI2M2Mt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';

                        if (!n) {
                            options.barrelRecolor ? options.barrelRecolor = false : options.barrelRecolor = true;
                        }

                        if (options.barrelRecolor) {
                            p.barrel_01.img.sprite = red_barrel;
                        } else {
                            p.barrel_01.img.sprite = 'map-barrel-01.img';
                        }
                    },
                    _bulletRecolorCb = function (n = false) {
                        if (!n) {
                            options.bulletRecolor ? options.bulletRecolor = false : options.bulletRecolor = true;
                        }
						
                        if (options.bulletRecolor) {
                            // Make 9mm bullets yellow
                            tracerColors["9mm"].regular = 16756224;
                            tracerColors["9mm"].saturated = 16756224;
        
                            // Make 7.62mm bullets blue
                            tracerColors["762mm"].regular = 26367;
                            tracerColors["762mm"].saturated = 26367;
        
                            // Make 12gauge bullets red
                            tracerColors["12gauge"].regular = 16711680;
                            tracerColors["12gauge"].saturated = 16711680;
        
                            // Make 556mm bullets green
                            tracerColors["556mm"].regular = 237056;
                            tracerColors["556mm"].saturated = 237056;
							
                            //Make .45 ACP purple
                            tracerColors["45acp"].regular = 7536811;
                            tracerColors["45acp"].saturated = 7536811;
                        } else {
                            // Make 9mm bullets default
                            tracerColors["9mm"].regular = 16704198;
                            tracerColors["9mm"].saturated = 16767411;
        
                            // Make 7.62mm bullets default
                            tracerColors["762mm"].regular = 12965630;
                            tracerColors["762mm"].saturated = 11257087;
        
                            // Make 12gauge bullets default
                            tracerColors["12gauge"].regular = 16702684;
                            tracerColors["12gauge"].saturated = 16702684;
        
                            // Make 556mm bullets default
                            tracerColors["556mm"].regular = 11141010;
                            tracerColors["556mm"].saturated = 11141010;
							
                            // Make .45 ACP default
                            tracerColors["45acp"].regular = 15515391;
                            tracerColors["45acp"].saturated = 15183103;
						}
                    
                    };
					
                _barrelRecolorCb(true);
                _bulletRecolorCb(true);

                var autoAimBind = function () {
                        autoAim.bind({
                            targetEnemyNicknameVisibility: options.autoAim.targetEnemyNicknameVisibility,
                            forwardFiringCoeff: options.autoAim.forwardFiringCoeff,
                            smoothLevel: options.autoAim.smoothLevel,
                            restirctionAngle: options.autoAim.restirctionAngle,
                            restirctions: options.autoAim.restirctions,
                            detectOnDifferentLevels: options.autoAim.detectOnDifferentLevels,
                            enemyExtendedInfo: options.autoAim.enemyExtendedInfo,
                            showEnemiesActions: options.autoAim.showEnemiesActions,
                            rightClickToggle: options.autoAim.rightClickToggle,
                            rightClickSwitch: options.autoAim.rightClickSwitch
                        })
                    },
                    autoAimUnbind = function () {
                        autoAim.unbind()
                    },
                    autoLootBind = function () {
                        autoLoot.bind({
                            autoPickUp: options.autoLoot.autoPickUp,
                            safeDistance: options.autoLoot.safeDistance,
                            dropDelay: options.autoLoot.dropDelay
                        })
                    },
                    autoLootUnbind = function () {
                        autoLoot.unbind()
                    },
                    q = function (e) {
                        return !(!isset(game.scope) || true !== game.scope.initialized) && e.isBinded()
                    };
                window.events = a(obfuscate, {
                    playerBarn: playerbarn
                }, {
                    autoAimRenderCb: function () {
                        q(autoAim) && autoAim.render()
                    },
                    laserPointerRenderCb: function () {
                        q(laserPointer) && laserPointer.render()
                    },
                    linesToPlayersRenderCb: function () {
                        q(linesToPlayers) && linesToPlayers.render()
                    },
                    airDropTrackingRenderCb: function () {
                        q(airDropTracking) && airDropTracking.render()
                    },
                    tiggerBotRenderCb: function () {
                        q(triggerBot) && triggerBot.render()
                    },
                    autoFireRenderCb: function () {
                        q(autoFire) && autoFire.render()
                    }
                });
                var autoAim = scripts.autoAim(obfuscate, game, {
                        bullets: bullets,
                        items: items,
                        playerBarn: playerbarn,
                        options: options
                    }),
                    autoLoot = scripts.autoLoot(obfuscate, game, {
                        lootBarn: lootBarn,
                        bagSizes: bagSizes,
                        items: items,
                        uiModule: uiModel
                    }),
                    autoHeal = scripts.autoHeal(obfuscate, game, {
                        key: keys
                    }),
                    autoSwitch = scripts.autoSwitch(obfuscate, game, {
                        key: keys,
                        bullets: bullets,
                        items: items,
                        playerBarn: playerbarn
                    }),
                    autoOpeningDoors = scripts.autoOpeningDoors(obfuscate, game, o, t),
                    bigMapManager = scripts.bigMapManager(obfuscate, game),
                    grenadeTimer = scripts.grenadeTimer(obfuscate, game),
                    laserPointer = scripts.laserPointer(obfuscate, game, {
                        bullets: bullets,
                        items: items
                    }),
                    linesToPlayers = scripts.linesToPlayers(obfuscate, game),
                    autoFire = scripts.autoFire(obfuscate, game, {
                        items: items
                    }),
                    zoomRadiusManager = scripts.zoomRadiusManager(obfuscate, game, {
                        scopeZoomRadius: scopeZoomRadius
                    }),
                    smokeAlphaManager = scripts.smokeAlphaManager(obfuscate, game, r),
                    fpsCounter = scripts.fpsCounter(obfuscate, game),
                    airDropTracking = scripts.airDropTracking(obfuscate, game),
                    triggerBot = scripts.triggerBot(obfuscate, game, {
                        bullets: bullets,
                        items: items
                    }),
                    autoDodge = scripts.autoDodge(obfuscate, game, {
                        bulletBarn: bulletBarn,
                        player: u,
                        key: keys
                    }),
                    fn = function (e) {
                        var t = game.scope[obfuscate.input.main].binds,
                            i = null != t[31] ? t[31].code : -1;
                        16 == e.which ? (autoAim.isBinded() && autoAimUnbind(), autoLoot.isBinded() && autoLootUnbind(), autoHeal.isBinded() && autoHeal.unbind(), autoSwitch.isBinded() && autoSwitch.unbind()) : e.which == i && autoAim.isBinded() && autoAimUnbind()
                    },
                    bn = function (e) {
                        var t = game.scope[obfuscate.input.main].binds,
                            i = null != t[31] ? t[31].code : -1;
                        16 == e.which ? (options.autoAim.enabled && !autoAim.isBinded() && autoAimBind(), options.autoLoot.enabled && !autoLoot.isBinded() && autoLootBind(), options.autoHeal.enabled && !autoHeal.isBinded() && autoHeal.bind(), options.autoSwitch.enabled && !autoSwitch.isBinded() && autoSwitch.bind()) : e.which == i && options.autoAim.enabled && !autoAim.isBinded() && autoAimBind()
                    },
                    An = function () {
                        window.addEventListener("keydown", fn), window.addEventListener("keyup", bn), options.autoAim.enabled && !autoAim.isBinded() && autoAimBind(), options.autoLoot.enabled && !autoLoot.isBinded() && autoLootBind(), options.autoHeal.enabled && !autoHeal.isBinded() && autoHeal.bind(), options.autoSwitch.enabled && !autoSwitch.isBinded() && autoSwitch.bind(), options.autoOpeningDoors.enabled && !autoOpeningDoors.isBinded() && autoOpeningDoors.bind(), bigMapManager.isBinded() || bigMapManager.bind(options.bigMapTransparency), options.grenadeTimer.enabled && !grenadeTimer.isBinded() && grenadeTimer.bind(), options.laserPointer.enabled && !laserPointer.isBinded() && laserPointer.bind(), options.linesToPlayers.enabled && !linesToPlayers.isBinded() && linesToPlayers.bind(), options.autoFire.enabled && !autoFire.isBinded() && autoFire.bind(), options.zoomRadiusManager.enabled && !zoomRadiusManager.isBinded() && zoomRadiusManager.bind(), smokeAlphaManager.isBinded() || smokeAlphaManager.bind({
                            smokeAlpha: options.smokeGrenadeAlpha
                        }), options.fpsCounter.enabled && !fpsCounter.isBinded() && fpsCounter.bind(), options.airDropTracking.enabled && !airDropTracking.isBinded() && airDropTracking.bind(), options.tiggerBot.enabled && !triggerBot.isBinded() && triggerBot.bind(), options.autoDodge.enabled && !autoDodge.isBinded() && autoDodge.bind(), window.events.bind()
                    },
                    yn = function () {
                        window.removeEventListener("keydown", fn), window.removeEventListener("keyup", bn), autoAim.isBinded() && autoAimUnbind(), autoLoot.isBinded() && autoLootUnbind(), autoHeal.isBinded() && autoHeal.unbind(), autoSwitch.isBinded() && autoSwitch.unbind(), autoOpeningDoors.isBinded() && autoOpeningDoors.unbind(), bigMapManager.isBinded() && bigMapManager.unbind(), grenadeTimer.isBinded() && grenadeTimer.unbind(), laserPointer.isBinded() && laserPointer.unbind(), linesToPlayers.isBinded() && linesToPlayers.unbind(), autoFire.isBinded() && autoFire.unbind(), zoomRadiusManager.isBinded() && zoomRadiusManager.unbind(), smokeAlphaManager.isBinded() && smokeAlphaManager.unbind(), fpsCounter.isBinded() && fpsCounter.unbind(), airDropTracking.isBinded() && airDropTracking.unbind(), triggerBot.isBinded() && triggerBot.unbind(), autoDodge.isBinded() && autoDodge.unbind(), window.events.unbind()
                    },
                    gn = function () {
                        return !game.scope || !!game.scope.gameOver
                    },
                    vn = false,
                    hn = function (n) {
                        90 == n.which && (gn() || (vn ? (Tn(), G = true) : xn()))
                    };
                scripts.menu(obfuscate, game, options, {
                    particlesTransparencyCb: w,
                    ceilingTransparencyCb: z,
                    bigMapTransparencyCb: k,
                    grenadePropertiesCb: I,
                    defaultGrenadePropertiesCb: C,
                    smokeGrenadePropertiesCb: E,
                    autoAimEnableCb: function () {
                        options.autoAim.enabled ? (q(autoAim) && autoAimUnbind(), options.autoAim.enabled = false) : options.autoAim.enabled || (!q(autoAim) && Q() && autoAimBind(), options.autoAim.enabled = true)
                    },
                    autoAimSmoothLevelCb: aaSmoothLevelCb,
                    autoAimRestirctionsCb: aaRestrictionsCb,
                    autoAimRestirctionAngleCb: aaRestirctionAngleCb,
                    autoAimEnemyExtendedInfoCb: aaEnemyExtendedInfo,
                    autoAimForwardFiringCoeffCb: aaForwardFiringCoeffCb,
                    autoAimDetectOnDifferentLevelsCb: aaDetectOnDifferentLevels,
                    autoAimTargetEnemyNicknameVisibilityCb: aaNicknameVisCb,
                    autoAimShowEnemiesActionsCb: aaShowEnemiesActions,
                    autoAimRightClickToggleCb: aaRightClickToggle,
                    autoAimRightClickSwitchCb: aaRightClickSwitch,
                    barrelRecolorCb: _barrelRecolorCb,
                    bulletRecolorCb: _bulletRecolorCb,
                    autoLootEnableCb: function () {
                        options.autoLoot.enabled ? (q(autoLoot) && autoLootUnbind(), options.autoLoot.enabled = false) : options.autoLoot.enabled || (!q(autoLoot) && Q() && autoLootBind(), options.autoLoot.enabled = true)
                    },
                    getAutoLootAutoPickUpCb: alGetItemsFromSlotCb,
                    setAutoLootAutoPickUpCb: alPrefListCb,
                    autoLootSafeDistanceCb: alSafeDistanceCb,
                    autoLootDropDelayCb: alDropDelayCb,
                    airDropTrackingEnableCb: function () {
                        options.airDropTracking.enabled ? (q(airDropTracking) && airDropTracking.unbind(), options.airDropTracking.enabled = false) : options.airDropTracking.enabled || (!q(airDropTracking) && Q() && airDropTracking.bind(), options.airDropTracking.enabled = true)
                    },
                    autoHealEnableCb: function () {
                        options.autoHeal.enabled ? (q(autoHeal) && autoHeal.unbind(), options.autoHeal.enabled = false) : options.autoHeal.enabled || (!q(autoHeal) && Q() && autoHeal.bind(), options.autoHeal.enabled = true)
                    },
                    autoSwitchEnableCb: function () {
                        options.autoSwitch.enabled ? (q(autoSwitch) && autoSwitch.unbind(), options.autoSwitch.enabled = false) : options.autoSwitch.enabled || (!q(autoSwitch) && Q() && autoSwitch.bind(), options.autoSwitch.enabled = true)
                    },
                    autoOpeningDoorsEnableCb: function () {
                        options.autoOpeningDoors.enabled ? (q(autoOpeningDoors) && autoOpeningDoors.unbind(), options.autoOpeningDoors.enabled = false) : options.autoOpeningDoors.enabled || (!q(autoOpeningDoors) && Q() && autoOpeningDoors.bind(), options.autoOpeningDoors.enabled = true)
                    },
                    laserPointerEnableCb: function () {
                        options.laserPointer.enabled ? (q(laserPointer) && laserPointer.unbind(), options.laserPointer.enabled = false) : options.laserPointer.enabled || (!q(laserPointer) && Q() && laserPointer.bind(), options.laserPointer.enabled = true)
                    },
                    linesToPlayersEnableCb: function () {
                        options.linesToPlayers.enabled ? (q(linesToPlayers) && linesToPlayers.unbind(), options.linesToPlayers.enabled = false) : options.linesToPlayers.enabled || (!q(linesToPlayers) && Q() && linesToPlayers.bind(), options.linesToPlayers.enabled = true)
                    },
                    autoFireEnableCb: function () {
                        options.autoFire.enabled ? (q(autoFire) && autoFire.unbind(), options.autoFire.enabled = false) : options.autoFire.enabled || (!q(autoFire) && Q() && autoFire.bind(), options.autoFire.enabled = true)
                    },
                    zoomRadiusManagerEnableCb: function () {
                        options.zoomRadiusManager.enabled ? (q(zoomRadiusManager) && zoomRadiusManager.unbind(), options.zoomRadiusManager.enabled = false) : options.zoomRadiusManager.enabled || (!q(zoomRadiusManager) && Q() && zoomRadiusManager.bind(), options.zoomRadiusManager.enabled = true)
                    },
                    grenadeTimerEnableCb: function () {
                        options.grenadeTimer.enabled ? (q(grenadeTimer) && grenadeTimer.unbind(), options.grenadeTimer.enabled = false) : options.grenadeTimer.enabled || (!q(grenadeTimer) && Q() && grenadeTimer.bind(), options.grenadeTimer.enabled = true)
                    },
                    fpsCounterEnableCb: function () {
                        options.fpsCounter.enabled ? (q(fpsCounter) && fpsCounter.unbind(), options.fpsCounter.enabled = false) : options.fpsCounter.enabled || (!q(fpsCounter) && Q() && fpsCounter.bind(), options.fpsCounter.enabled = true)
                    },
                    tiggerBotEnableCb: function () {
                        options.tiggerBot.enabled ? (q(triggerBot) && triggerBot.unbind(), options.tiggerBot.enabled = false) : options.tiggerBot.enabled || (!q(triggerBot) && Q() && triggerBot.bind(), options.tiggerBot.enabled = true)
                    },
                    autoDodgeEnableCb: function () {
                        options.autoDodge.enabled ? (q(autoDodge) && autoDodge.unbind(), options.autoDodge.enabled = false) : options.autoDodge.enabled || (!q(autoDodge) && Q() && autoDodge.bind(), options.autoDodge.enabled = true)
                    },
                    storeOptionsCb: function () {
                        c(l, options)
                    }
                }).bind(), window.removeEventListener("keyup", hn), window.addEventListener("keyup", hn)
            } else console.log("Error: Exports not defined, return.");

            function xn() {
                !game.scope || gn() || vn || (An(), vn = true)
            }

            function Tn() {
                vn && (yn(), vn = false)
            }
        }
    }, {
        "./EventsManager.js": 4,
        "./css/app.css": 5,
        "./modules/autoVariableFinder.js": 7,
        "./modules/basics.js": 8,
        "./modules/checkVersion.js": 9,
        "./modules/notifications.js": 10,
        "./modules/telemetry.js": 11,
        "./obfuscate.js": 12,
        "./plugins/airDropTracking.js": 13,
        "./plugins/autoAim.js": 14,
        "./plugins/autoDodge.js": 15,
        "./plugins/autoFire.js": 16,
        "./plugins/autoHeal.js": 17,
        "./plugins/autoLoot.js": 18,
        "./plugins/autoOpeningDoors.js": 19,
        "./plugins/bigMapManager.js": 20,
        "./plugins/fpsCounter.js": 21,
        "./plugins/grenadeTimer.js": 22,
        "./plugins/laserPointer.js": 23,
        "./plugins/linesToPlayers.js": 24,
        "./plugins/menu.js": 25,
        "./plugins/smokeAlphaManager.js": 26,
        "./plugins/tiggerBot.js": 27,
        "./plugins/zoomRadiusManager.js": 28,
        "./plugins/autoSwitch.js": 29,
        iziToast: 2,
        "stats-js": 3
    }],
    7: [function (n, e, t) {
        "use strict";
        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (n) {
            return typeof n
        } : function (n) {
            return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n
        };
        e.exports = function (n) {
            var e = function (e) {
                for (var t = Object.keys(n), a = 0; a < t.length; a++)
                    if ("object" == i(n[t[a]]) && null != n[t[a]] && void 0 !== n[t[a]][e]) return t[a]
            };
            return {
                findAllVariables: function (n, t) {
                    for (var i = Object.keys(n), a = 0; a < i.length; a++) n[i[a]] = e(t[i[a]]);
                    return n
                }
            }
        }
    }, {}],
    8: [function (n, e, t) {
        "use strict";
        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (n) {
            return typeof n
        } : function (n) {
            return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n
        };
        window.isset = function (n) {
            return void 0 !== n && null !== n && "" !== n
        };
        window.removeHTMLElement = function (n) {
            document.getElementById(n) && function (n) {
                var e = document.getElementById(n);
                e.parentNode.removeChild(e)
            }(n)
        }, window.fetchFromObject = function (n, e) {
            if (!isset(n)) return false;
            var t = e.indexOf(".");
            return t > -1 ? fetchFromObject(n[e.substring(0, t)], e.substr(t + 1)) : n[e]
        }, window.hasClass = function (n, e) {
            return n.classList ? n.classList.contains(e) : !!n.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"))
        }, window.addClass = function (n, e) {
            n.classList ? n.classList.add(e) : hasClass(n, e) || (n.className += " " + e)
        }, window.removeClass = function (n, e) {
            if (n.classList) n.classList.remove(e);
            else if (hasClass(n, e)) {
                var t = new RegExp("(\\s|^)" + e + "(\\s|$)");
                n.className = n.className.replace(t, " ")
            }
        }, document.getElementsByAttribute = function (n, e, t) {
            e = e.replace(/\|/g, "\\|").replace(/\[/g, "\\[").replace(/\(/g, "\\(").replace(/\+/g, "\\+").replace(/\./g, "\\.").replace(/\*/g, "\\*").replace(/\?/g, "\\?").replace(/\//g, "\\/");
            t = !!isset(t) && t;
            for (var i, a, o = document.getElementsByTagName("*"), r = [], s = new RegExp(t ? "\\b" + e + "\\b" : "^" + e + "$"), l = 0; a = o.item(l++);)(i = a.getAttributeNode(n)) && i.specified && s.test(i.value) && r.push(a);
            return r
        }, window.isObject = function (n) {
            return n && "object" === (void 0 === n ? "undefined" : i(n)) && n.constructor === Object
        }
    }, {}],
    9: [function (n, e, t) {
        "use strict";
        var i = {},
            a = function () {
                fetch("https://raw.githubusercontent.com/zbot473/SurvivHacks/master/ChromeExtension/manifest.json").then(function (n) {
                    return n.json()
                }).then(function (n) {
                    return function (n, e) {
                        if (n && e) {
                            var t = n.split("."),
                                i = e.split(".");
                            t.filter(function (n, e, t) {
                                return n < i[e]
                            }).length > 0 && notifications.create("info", "A new version of the cheat is available! Use the auto update scripts!", "INFO", 1e4)
                        }
                    }(i.version, n.version)
                }).catch(function (n) {
                    return console.error("Error:", n)
                })
            };
        e.exports = {
            bind: function (n) {
                i = n, a()
            },
            unbind: function () {}
        }
    }, {}],
    10: [function (n, e, t) {
        "use strict";
        iziToast.settings({
            transitionIn: "flipInX",
            transitionOut: "flipOutX",
            zindex: 1e4
        });
        e.exports = {
            create: function (n, e, t) {
                var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1500;
                return ("success" == n || "error" == n || "info" == n) && (iziToast[n]({
                    timeout: i,
                    title: t,
                    message: e
                }), true)
            }
        }
    }, {}],
    11: [function (n, e, t) {
        "use strict";
        e.exports = {
            init: function (n, e) {
                window.onerror = function (t, i, a, o, r) {
                    var s = {
                        msg: t,
                        url: i,
                        line: a,
                        col: o,
                        error: r,
                        extensionId: n,
                        userAgent: navigator.userAgent,
                        cheatVersion: e,
                        type: "telemetry"
                    };
                    chrome.runtime.sendMessage(n, JSON.stringify(s))
                }
            }
        }
    }, {}],
    12: [function (n, e, t) {//game_vars
        "use strict";
        e.exports = {
			// fe: o {game: r, particleBarn: l, localization: i, touch: e, inputBinds: e, …}
            menu: "fe",
			// N: i {pos: {…}, ppu: 16, zoom: 1.132234974067752, f: 0.5785845588235294, screenWidth: 1259, …}
            camera: "N",
			// Ee: o {bullets: Array(0)}
            bullets: "Oe",
			// can not find planes variable
            planes: "Re",
			// ct: 3058
            activeId: "ct",
			// f: 1
            targetZoom: "f",
			// ;t: r {idToObj: {…}, types: {…}, seenCount: 34}
            objectCreator: "lt",
			// Ye: i {Gt: false, dirty: false, container: e, mobileOffset: 0, clientData: {…}, …}
            pieTimer: "Je",
			// Ae: s {display: {…}, width: 720, height: 720, seed: 192487212, biome: 1, …}
            map: "Ae",
            input: {
				// ye: e {input: o, config: e, binds: Array(36), boundKeys: {…}, menuHovered: false}
                main: "ye",
                input: "input",
                mousePressed: "$"
            },
            activePlayer: {
				// dt: n {bodySprite: e, chestSprite: e, helmetSprite: e, backpackSprite: e, handLSprite: e, …}
                main: "dt",
                netData: "q",
                localData: "U"
            },
            playerBarn: {
				// Ie: s {ne: i, At: {…}, teamInfo: {…}, teammateData: {…}}
                main: "De",
                players: "It"
            },
            lootBarn: {
				// He: r {it: i, Pt: null}
                main: "He",
                itemf: "Pt",
                lootPool: "it",
                pool: "de"
            },
            version: "1.1.009",
            protocolVersion: 44
        }
    }, {}],
    13: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e) {
            var t = false,
                i = {
                    draw: [],
                    lastPlaneId: -1
                },
                a = {},
                o = window.PIXI.Texture.fromImage("img/map/map-plane-01.svg"),
                r = function (t) {
                    var a = e.scope[n.menu];
                    if (a && a.container) {
                        var r = null;
                        if (isset(i.draw[t.id]) && (r = i.draw[t.id]), r || ((r = window.PIXI.Sprite.from(o)).visible = false, r.scale.set(.4, .4), r.tint = 16711680, r.alpha = .6, r.anchor.set(.5, .5), a.display.player.addChild(r), i.draw[t.id] = r), r) {
                            var s = function (n, e) {
                                return {
                                    x: n.mapSprite.x - n.mapSprite.width / 2 + e.x / n.mapWidth * n.mapSprite.width,
                                    y: n.mapSprite.y + n.mapSprite.height / 2 - e.y / n.mapHeight * n.mapSprite.height
                                }
                            }(e.scope[n.menu], t.pos);
                            r.position.set(s.x, s.y), r.rotation = t.sprite.rotation, r.visible = t.active
                        }
                    }
                },
                s = function () {
                    for (var t = e.scope[n.menu].airdropSprites, i = 0; i < t.length; i++) {
                        var o = t[i];
                        0 != o.pingPulseWave.position.x && true === o.pingPulseWave.displayed && 1 == !a[i] && (o.mapSprite.maxLife = 100, o.mapSprite.life = 100, a[i] = true)
                    }
                };
            return {
                bind: function () {
                    ! function () {
                        i.draw = [], i.lastPlaneId = -1, a = {};
                        for (var n = 0; n < 20; n++) a[n] = false
                    }(), t = true, window.events.add("playerBarn", "airDropTrackingRenderCb")
                },
                unbind: function () {
                    window.events.remove("playerBarn", "airDropTrackingRenderCb"), t = false
                },
                isBinded: function () {
                    return t
                },
                render: function () {
                    // t && e.scope.initialized && (s(), function () {
                        // var t = e.scope[n.planes].planes,
                            // a = t.length;
                        // if (a > 0) {
                            // for (var o = 0; o < a; o++) r(t[o]);
                            // t[a - 1].id != i.lastPlaneId && (i.lastPlaneId = t[a - 1].id, notifications.create("info", "Attention, the next plane is coming!", "OK", 5e3))
                        // }
                    // }())
                }
            }
        }
    }, {}],
    14: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e, t) {
            var i = t.bullets,
                a = t.items,
                o = t.playerBarn,
                op = t.options,
                r = false,
                s = null,
                l = {},
                c = window.PIXI.Texture.fromImage("img/gui/ping-team-coming.svg"),
                p = window.PIXI.Texture.fromImage("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiICAgdmVyc2lvbj0iMS4xIiAgIHg9IjBweCIgICB5PSIwcHgiICAgdmlld0JveD0iMCAwIDQ4NCA0ODQiICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwMCAxMDAwIiAgIHhtbDpzcGFjZT0icHJlc2VydmUiICAgaWQ9InN2ZzgiICAgc29kaXBvZGk6ZG9jbmFtZT0iZTJmMzM2M2JhN2NlNzMzNTRiZjZkMDUwMzIwODNkZDEuc3ZnIiAgIHdpZHRoPSI0ODQiICAgaGVpZ2h0PSI0ODQiICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45Mi4zICgyNDA1NTQ2LCAyMDE4LTAzLTExKSI+PGRlZnMgICBpZD0iZGVmczEyIiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcgICBwYWdlY29sb3I9IiNmZmZmZmYiICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiICAgYm9yZGVyb3BhY2l0eT0iMSIgICBvYmplY3R0b2xlcmFuY2U9IjEwIiAgIGdyaWR0b2xlcmFuY2U9IjEwIiAgIGd1aWRldG9sZXJhbmNlPSIxMCIgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIiAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTM2NiIgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI3MDUiICAgaWQ9Im5hbWVkdmlldzEwIiAgIHNob3dncmlkPSJmYWxzZSIgICBpbmtzY2FwZTp6b29tPSIwLjk0NCIgICBpbmtzY2FwZTpjeD0iMzI1LjQ4MDI0IiAgIGlua3NjYXBlOmN5PSIyNjIuNTEyNSIgICBpbmtzY2FwZTp3aW5kb3cteD0iLTgiICAgaW5rc2NhcGU6d2luZG93LXk9Ii04IiAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnOCIgLz48bWV0YWRhdGEgICBpZD0ibWV0YWRhdGEyIj4gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gPHJkZjpSREY+PGNjOldvcmsgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZSAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZT48L2RjOnRpdGxlPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZyAgIGlkPSJnNiIgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjQ4OTQ1MjI5LDAsMCwwLjUwNDg4Mzk2LC0yLjMwOTc3NzIsLTExLjY0NTc4NikiPjxwYXRoICAgICBkPSJtIDk4Ny40LDQ2Ni45IC01NCw5NS4xIC01NC43LDk2LjQgaCAtMC4xIGMgLTIuNyw0LjQgLTcuNSw3LjQgLTEzLjEsNy40IC01LjYsMCAtMTAuNiwtMy4xIC0xMy4zLC03LjcgdiAwIEwgNzk3LjgsNTYyIDc0My43LDQ2Ni42IGMgLTEuNSwtMi40IC0yLjQsLTUuMyAtMi40LC04LjMgMCwtOC43IDYuOSwtMTUuNyAxNS41LC0xNS43IGggNzAuOCBDIDgwMC44LDI4NC4yIDY2NS4yLDE2My44IDUwMiwxNjMuOCBjIC02My42LDAgLTEyMywxOC4zIC0xNzMuNCw1MCAtNi44LDQuOSAtMTUuMSw3LjkgLTI0LDcuOSAtMjIuOCwwIC00MS4zLC0xOC44IC00MS4zLC00MiAwLC0xNS45IDguOCwtMjkuOCAyMS42LC0zNi45IEMgMzQ4LDEwMyA0MjIuNCw4MCA1MDIuMSw4MCA3MTEsODAgODgzLjUsMjM3LjcgOTExLjEsNDQyLjUgaCA2My41IGMgOC41LDAgMTUuNCw3IDE1LjQsMTUuNyAwLDMuMiAtMSw2LjIgLTIuNiw4LjcgeiBtIC03NDQuMiwyNC40IGggLTcxLjUgYyAtMC4xLDIuOSAtMC4xLDUuNyAtMC4xLDguNyAwLDE4NS43IDE0Ny45LDMzNi4yIDMzMC40LDMzNi4yIDc0LjQsMCAxNDMsLTI1IDE5OC4zLC02Ny4zIDAsMCAwLDAuMSAwLjEsMC4xIDcuNCwtNy4xIDE3LjMsLTExLjQgMjguMiwtMTEuNCAyMi44LDAgNDEuMywxOC44IDQxLjMsNDIgMCwxMi40IC01LjMsMjMuNyAtMTMuOCwzMS40IDAsMCAwLDAgMCwwLjEgLTAuMywwLjIgLTAuNiwwLjUgLTAuOSwwLjcgLTEsMC44IC0yLjEsMS42IC0zLjEsMi40IC02OS40LDUzLjggLTE1Niw4NS44IC0yNTAsODUuOCAtMjI4LDAgLTQxMi44LC0xODguMSAtNDEyLjgsLTQyMCAwLC0yLjkgMCwtNS44IDAuMSwtOC44IGggLTY0IGMgLTguNSwwIC0xNS40LC03IC0xNS40LC0xNS43IDAsLTMuMSAwLjksLTYgMi40LC04LjQgbCA1NC4yLC05NS40IDU0LjUsLTk2IHYgMCBjIDIuNywtNC42IDcuNiwtNy43IDEzLjIsLTcuNyA1LjUsMCAxMC40LDIuOSAxMy4xLDcuNCBoIDAuMSBsIDU0LjcsOTYuMyA1NCw5NS4yIGMgMS42LDIuNSAyLjUsNS41IDIuNSw4LjcgMCw4LjcgLTYuOSwxNS43IC0xNS41LDE1LjcgeiIgICAgIGlkPSJwYXRoNCIgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+PC9nPjwvc3ZnPg=="),
                d = window.PIXI.Texture.fromImage("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0ODQiIGhlaWdodD0iNDg0Ij48ZWxsaXBzZSBjeD0iMjQyLjcwOCIgY3k9IjM4NC41MjYiIHJ4PSIxODIuNzA4IiByeT0iNDUuMjgiIGZpbGw9IiNiOGNiY2QiLz48cGF0aCBkPSJNMjYyLjEzMiA5Ni4wNDJsLTE3LjUyOCAxNy41MjgtMTcuNTI4LTE3LjUyOGMtMzkuOC0zOS43OTYtMTA0LjMyNC0zOS43OTYtMTQ0LjEyIDAtMzkuNzk2IDM5Ljc5Ni0zOS43OTYgMTA0LjMyIDAgMTQ0LjExNmwxNy41MjggMTcuNTMyIDE0NC4xMiAxNDQuMTE2TDM4OC43MiAyNTcuNjlsMTcuNTI4LTE3LjUzMmMzOS43OTYtMzkuNzk2IDM5Ljc5Ni0xMDQuMzIgMC0xNDQuMTE2LTM5Ljc5Ni0zOS43OTYtMTA0LjMyLTM5LjgtMTQ0LjExNiAweiIgZmlsbD0iI2ZmYmFiMCIvPjxnIGZpbGw9IiM3ODM3NDEiPjxwYXRoIGQ9Ik0yNDQuNjA0IDQxMy44MDZjLTMuMDcyIDAtNi4xNC0xLjE3Mi04LjQ4NC0zLjUxNkw3NC40NzIgMjQ4LjY0MmMtNDQuNDE2LTQ0LjQxMi00NC40MTYtMTE2LjY3NiAwLTE2MS4wODQgMjEuNTEyLTIxLjUxNiA1MC4xMTYtMzMuMzY0IDgwLjU0NC0zMy4zNjQgMzAuNDI0IDAgNTkuMDMyIDExLjg0OCA4MC41NDggMzMuMzY0bDkuMDQ0IDkuMDQ0IDkuMDQ0LTkuMDQ0YzIxLjUxMi0yMS41MTYgNTAuMTE2LTMzLjM2NCA4MC41NDQtMzMuMzY0IDMwLjQyNCAwIDU5LjAzMiAxMS44NDggODAuNTQ0IDMzLjM2NCAyMS41MTYgMjEuNTEyIDMzLjM2NCA1MC4xMTYgMzMuMzY0IDgwLjU0NCAwIDMwLjQyNC0xMS44NDggNTkuMDMyLTMzLjM2NCA4MC41NDRMMjUzLjA5NiA0MTAuMjk0YTEyLjAwMiAxMi4wMDIgMCAwIDEtOC40OTIgMy41MTJ6TTE1NS4wMTYgNzguMTk0Yy0yNC4wMTYgMC00Ni41OTIgOS4zNTItNjMuNTc2IDI2LjMzMi0zNS4wNTYgMzUuMDU2LTM1LjA1NiA5Mi4wOTIgMCAxMjcuMTQ4bDE1My4xNjQgMTUzLjE2NCAxNTMuMTYtMTUzLjE2NGMzNS4wNTYtMzUuMDU2IDM1LjA1Ni05Mi4wOTIgMC0xMjcuMTQ4LTE2Ljk4LTE2Ljk4LTM5LjU2LTI2LjMzMi02My41NzYtMjYuMzMycy00Ni41OTIgOS4zNTItNjMuNTc2IDI2LjMzMmwtMTcuNTI4IDE3LjUyOGMtNC42ODggNC42ODgtMTIuMjggNC42ODgtMTYuOTY4IDBsLTE3LjUyOC0xNy41MjhjLTE2Ljk4LTE2Ljk4LTM5LjU2LTI2LjMzMi02My41NzItMjYuMzMyeiIvPjxwYXRoIGQ9Ik0yNDQuNjA0IDM4Ni4xOTRjLTMuMDcyIDAtNi4xNC0xLjE3Mi04LjQ4NC0zLjUxNkw5My41NTIgMjQwLjExOGwtMTUuNTItNi45OGMtNi4wNDQtMi43Mi04Ljc0NC05LjgyNC02LjAyNC0xNS44NjggMi43Mi02LjA0NCA5LjgyLTguNzQ4IDE1Ljg2OC02LjAyNGwxNy41MjggNy44ODRhMTEuOTEgMTEuOTEgMCAwIDEgMy41NjQgMi40NmwxMzUuNjM2IDEzNS42MzJMMzgwLjIzNiAyMjEuNTljLjUzNi0uNTQgMS4xMi0xLjAyNCAxLjc1Mi0xLjQ0OGwxNy41MjgtMTEuODg0YzUuNDg4LTMuNzI0IDEyLjk0OC0yLjI4IDE2LjY2OCAzLjIgMy43MiA1LjQ4NCAyLjI4NCAxMi45NDgtMy4yIDE2LjY2OEwzOTYuNCAyMzkuMzcgMjUzLjA4OCAzODIuNjc4YTExLjk1NyAxMS45NTcgMCAwIDEtOC40ODQgMy41MTZ6IiBvcGFjaXR5PSIuMiIvPjwvZz48cGF0aCBkPSJNNTYgMjI5LjgwNkgxMmMtNi42MjggMC0xMi01LjM3Mi0xMi0xMnM1LjM3Mi0xMiAxMi0xMmg0NGM2LjYyOCAwIDEyIDUuMzcyIDEyIDEycy01LjM3MiAxMi0xMiAxMnoiIGZpbGw9IiM3ODM3NDEiLz48cGF0aCBmaWxsPSIjZmZiYWIwIiBkPSJNNjAgMjE4LjE5NGgxMDRsMzItNjggNTIgMTQ0IDQ0LTEyNCAyMCA0NGgxMjAiLz48cGF0aCBkPSJNMjQ4IDMwMi4xOTRhNy45OTggNy45OTggMCAwIDEtNy41MjQtNS4yOGwtNDUuNDUyLTEyNS44Ni0yMy43ODggNTAuNTQ4YTggOCAwIDAgMS03LjI0IDQuNTkyaC0xMDRhOCA4IDAgMCAxIDAtMTZoOTguOTJsMjkuODQtNjMuNDA4YzEuMzc2LTIuOTI0IDQuMTU2LTQuNzQ0IDcuNjEyLTQuNTg0YTggOCAwIDAgMSA3LjE0OCA1LjI3Mmw0NC40MTIgMTIyLjk4IDM2LjUyOC0xMDIuOTM2YTcuOTkgNy45OSAwIDAgMSA3LjE5Ni01LjMxNmMzLjM0LS4wOTYgNi4yNzYgMS43MTIgNy42MjQgNC42ODRsMTcuODcyIDM5LjMwOGgxMTQuODQ4YzQuNDE2IDAgOCAzLjU4NCA4IDhzLTMuNTg0IDgtOCA4aC0xMjBhNy45OSA3Ljk5IDAgMCAxLTcuMjgtNC42OTJsLTExLjgwNC0yNS45NjQtMzcuMzc2IDEwNS4zMzJhNy45OTMgNy45OTMgMCAwIDEtNy41MTYgNS4zMjRIMjQ4eiIgZmlsbD0iIzc4Mzc0MSIvPjxwYXRoIGQ9Ik00NzIgMjI1LjgwNmgtMzZjLTYuNjI4IDAtMTItNS4zNzItMTItMTJzNS4zNzItMTIgMTItMTJoMzZjNi42MjggMCAxMiA1LjM3MiAxMiAxMnMtNS4zNzIgMTItMTIgMTJ6IiBmaWxsPSIjNzgzNzQxIi8+PC9zdmc+");
            if (i && a && o) {
                var pressKey = function (t) {
                        var i = e.scope[n.input.main][n.input.input].keys;
                        i[t] || setTimeout(function () {
                            i[t] = true, setTimeout(function () {
                                delete i[t]
                            }, 50)
                        }, 0)
                    },
                    //angle
                    calcuateAngle = function (n, e, t, i) {
                        var a = i - e,
                            o = t - n;
                        return Math.atan2(a, o)
                    },
                    //distance
                    calculateDistance = function (n, e, t, i) {
                        return Math.sqrt(Math.pow(n - t, 2) + Math.pow(e - i, 2))
                    },
                    getPos = function () {
                        return e.scope[n.activePlayer.main].pos
                    },
                    getScreenPos = function () {
                        return e.scope[n.input.main][n.input.input].mousePos
                    },
                    checkLayer = function (n, e) {
                        var t = true;
                        return l.detectOnDifferentLevels || n.layer == e.layer || 2 == e.layer || 2 == n.layer || 3 == e.layer || 3 == n.layer || (t = false), t
                    },
                    getTeam = function (n, e, t, i) {
                        return t.teamId == e || i == n
                    },
                    setPlayerNameStyle = function () {
                        s.player.nameText.visible = true, s.player.nameText.style.fontSize = 100, s.player.nameText.style.fill = "#D50000"
                    },
                    rightClickHandler = function () {
                        if (e.scope[n.input.main][n.input.input].mouseButtons["2"] != undefined) {
                            return !e.scope[n.input.main][n.input.input].mouseButtons["2"]
                        }
                    },
					l_function = function (n) {
						return !! function (n) {
							return c_function(n.A, n.B, n.C) || c_function(n.A, n.B, n.D) || c_function(n.C, n.D, n.A) || c_function(n.C, n.D, n.B)
						}(n) || !(p_function(n.A, n.B, n.C) * p_function(n.A, n.B, n.D) >= 0 || p_function(n.C, n.D, n.A) * p_function(n.C, n.D, n.B) >= 0)
					},
					c_function = function (n, e, t) {
						return 0 == n.x * e.y + e.x * t.y + t.x * n.y - t.x * e.y - n.x * t.y - e.x * n.y && Math.min([n.x, e.x]) <= t.x && t.x <= Math.max([n.x, e.x]) && Math.min([n.y, e.y]) <= t.y && t.y <= Math.max([n.y], e.y)
					},
					p_function = function (n, e, t) {
						return n.x * e.y + e.x * t.y + t.x * n.y - t.x * e.y - n.x * t.y - e.x * n.y
					},
					isNotCollideble = function (t) {
						var pos = (u = e.scope[n.activePlayer.main]).pos,
							objects = e.scope[n.objectCreator].idToObj,
							collidableObjects = Object.keys(objects).filter(function (n) {
								var curObj = objects[n];
								
								return void 0 !== objects[n].collidable && objects[n].collidable && !objects[n].destructible;
							}, ),
							p = [];
						//console.log(pos)
						p.A = [], p.B = [], p.C = [], p.D = [], p.A.x = pos.x, p.A.y = pos.y, p.B.x = t.x, p.B.y = t.y;
						var d = true;
						collidableObjects.forEach(function (n, e, t) {
							var i;
							objects[n].layer !== u.layer || objects[n].dead || void 0 !== (i = objects[n]).img && i.img.indexOf("window") > -1 || (void 0 !== objects[n].collider && void 0 !== objects[n].collider.min && void 0 !== objects[n].collider.max ? (p.C.x = objects[n].collider.min.x, p.C.y = objects[n].collider.min.y, p.D.x = objects[n].collider.max.x, p.D.y = objects[n].collider.min.y, l_function(p) && (d = false), p.C.x = objects[n].collider.max.x, p.C.y = objects[n].collider.min.y, p.D.x = objects[n].collider.max.x, p.D.y = objects[n].collider.max.y, l_function(p) && (d = false), p.C.x = objects[n].collider.max.x, p.C.y = objects[n].collider.max.y, p.D.x = objects[n].collider.min.x, p.D.y = objects[n].collider.max.y, l_function(p) && (d = false), p.C.x = objects[n].collider.min.x, p.C.y = objects[n].collider.max.y, p.D.x = objects[n].collider.min.x, p.D.y = objects[n].collider.max.y, l_function(p) && (d = false)) : function (n, e, t, i, a, o) {
								var r, s, l = a - t,
									c = o - i,
									p = l * l + c * c,
									d = -1;
								0 != p && (d = ((n - t) * l + (e - i) * c) / p), d < 0 ? (r = t, s = i) : d > 1 ? (r = a, s = o) : (r = t + d * l, s = i + d * c);
								var u = n - r,
									m = e - s;
								return Math.sqrt(u * u + m * m)
							}(objects[n].collider.pos.x, objects[n].collider.pos.y, p.A.x, p.A.y, p.B.x, p.B.y) <= objects[n].collider.rad && (d = false))
						});
						var u = e.scope[n.activePlayer.main];
						return d;
					},
                    h = null,
                    x = function () {
                        var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
                        null != h && h != n && (h.visible = false, h = null), h = null != n ? n : null
                    },
                    T = function (t) {
                        var o = getPos(),
                            r = {
                                x: o.x + s.mouseRelPointPos.x,
                                y: o.y + s.mouseRelPointPos.y
                            },
                            p = [],
                            d = [],
                            u = [],
                            A = [],
                            y = [],
                            g = Object.keys(t);
                        if (!g.length) return s.new && (s.new = false, l.targetEnemyNicknameVisibility && setPlayerNameStyle(), window.aimTarget = null), x(), void I();

                        for (var h = 0; h < g.length; h++) {
                            var T = t[g[h]][n.activePlayer.netData].pos,
                                w = calculateDistance(o.x, o.y, T.x, T.y),
                                k = calculateDistance(r.x, r.y, T.x, T.y),
                                C = calcuateAngle(o.x, o.y, T.x, T.y),
                                E = Math.abs(C - calcuateAngle(o.x, o.y, r.x, r.y));
                            p.push(w), d.push(k), u.push(C), A.push(E), y.push(true)
                        }
                        var B, L = null;
                        if (l.restirctions) {
                            var M = null;
                            y = y.map(function (n, e) {
                                var t = A[e] < l.restirctionAngle * Math.PI / 180;
                                return t && (null == M || d[M] > d[e]) && (M = e), t
                            }), L = M
                        } else L = (B = d).indexOf(Math.min.apply(null, B));
                        if (null != L) {
                            for (s.unshift({
                                    distance: p[L],
                                    radianAngle: u[L],
                                    pos: t[g[L]][n.activePlayer.netData].pos,
                                    timestamp: Date.now()
                                }), s.pop(), s[0].targetMousePosition = function (t, o, r, s, c) {
                                    var p = 0,
                                        d = 1 / 0;
                                    p = e.scope[n.activePlayer.main].weapType && a[e.scope[n.activePlayer.main].weapType].bulletType ? i[a[e.scope[n.activePlayer.main].weapType].bulletType].speed * l.forwardFiringCoeff : 1e3;
                                    for (var u = getPos(), A = {
                                            x: t.x,
                                            y: t.y
                                        }, y = calculateDistance(u.x, u.y, t.x, t.y), g = (t.x - r.x) / ((o - s + 1) / 1e3), v = (t.y - r.y) / ((o - s + 1) / 1e3), h = 0; h < 10; h++) d = y / p, A = {
                                        x: t.x + g * d,
                                        y: t.y + v * d
                                    }, y = calculateDistance(u.x, u.y, A.x, A.y);
                                    var x = e.scope[n.camera].screenWidth / 2,
                                        T = e.scope[n.camera].screenHeight / 2,
                                        w = T > x ? x : T;
                                    w = Math.floor(w - 1);
                                    var z = calcuateAngle(u.x, u.y, A.x, A.y);
                                    return {
                                        x: x + w * Math.cos(z),
                                        y: T - w * Math.sin(z)
                                    }
                                }(s[0].pos, s[0].timestamp, s[1].pos, s[1].timestamp, s.distance), s.averageTargetMousePosition = {
                                    x: 0,
                                    y: 0
                                }, h = 0; h < s.length; h++) s.averageTargetMousePosition.x += s[h].targetMousePosition.x, s.averageTargetMousePosition.y += s[h].targetMousePosition.y;


                            var chest_level = t[g[L]][n.activePlayer.netData]['chest'];
                            var chest_int = 0;

                            if ("" != chest_level) {
                                chest_int = parseInt(chest_level.slice(-2), 10);
                            }

                            var helmet_level = t[g[L]][n.activePlayer.netData]['helmet'];
                            var helmet_int = 0;

                            if ("" != helmet_level) {
                                helmet_int = parseInt(helmet_level.slice(-2), 10);
                            }

                            var enemy_name = t[g[L]][n.activePlayer.netData].curWeapType;

                            enemy_name = enemy_name + ' Lvl: ' + (chest_int + helmet_int);

                            s.averageTargetMousePosition.x /= s.length, s.averageTargetMousePosition.y /= s.length, l.targetEnemyNicknameVisibility && setPlayerNameStyle(), s.player = t[g[L]], l.targetEnemyNicknameVisibility && (s.player.nameText.visible = true, s.player.nameText.style.fontSize = 100, s.player.nameText.style.fill = "#D50000"), window.aimTarget = s.player, s.player.nameText._text = enemy_name,
                                function () {
                                    var e = s.player,
                                        t = e[n.activePlayer.netData].dir;
									// enemy detection icon
                                    if (e && e[n.activePlayer.netData].dir) {
                                        var i = e.targetIndicator;
                                        if (i || ((i = window.PIXI.Sprite.from(c)).visible = false, i.scale.set(.6, .6), i.tint = 16711680, i.alpha = .5, e.container.addChild(i), e.targetIndicator = i), i) {
                                            var a = {
                                                x: -.5 * i.width + t.x,
                                                y: -.5 * i.height + t.y
                                            };
                                            i.position.set(a.x, a.y), i.visible = true, x(i)
                                        }
                                    }
                                }(), l.enemyExtendedInfo && z(), s.new = true
                        } else s.new = false, window.aimTarget = null, x()
                    },
                    w = function (n) {
                        var e = Object.keys(a),
                            t = true,
                            i = false,
                            o = void 0;
                        try {
                            for (var r, s = e[Symbol.iterator](); !(t = (r = s.next()).done); t = true) {
                                var l = r.value,
                                    c = a[l];
                                if (l === n) return c
                            }
                        } catch (n) {
                            i = true, o = n
                        } finally {
                            try {
                                !t && s.return && s.return()
                            } finally {
                                if (i) throw o
                            }
                        }
                        return null
                    },
                    z = function () {
                        var e, t = s.player,
                            i = t[n.activePlayer.netData];
                        k(), e = t.nameText._text, t[n.activePlayer.netData].curWeapType, document.getElementById("ui-cheat-info").getElementsByClassName("ui-cheat-team-member-name")[0].innerHTML = e,
                            function (n) {
                                var e = document.getElementById("ui-cheat-armor-container"),
                                    t = true,
                                    i = false,
                                    a = void 0;
                                try {
                                    for (var o, r = ["helmet", "chest", "backpack", "curWeapType"][Symbol.iterator](); !(t = (o = r.next()).done); t = true) {
                                        var s = o.value,
                                            l = e.getElementsByClassName(s)[0],
                                            c = (l.getElementsByClassName("ui-armor-counter-inner")[0], l.getElementsByClassName("ui-armor-level")[0]),
                                            p = l.getElementsByTagName("img")[0];
                                        if ("" != n[s]) {
                                            var d = parseInt(n[s].slice(-2), 10);
                                            if (Number.isInteger(d) && "curWeapType" !== s ? (c.style.color = 3 == d ? "rgb(255, 153, 0)" : "rgb(255, 255, 255)", c.innerHTML = "P. " + d) : c.innerHTML = "", "backpack" === s && (s = "pack"), "curWeapType" !== s) p.src = "img/loot/loot-" + s + "-0" + d + ".svg", p.style.display = "block";
                                            else {
                                                var u = w(n[s]);
                                                if (u) {
                                                    var m = u.lootImg.sprite.replace(".img", ".svg");
                                                    p.src = "img/loot/" + m, p.style.display = "block"
                                                }
                                            }
                                        } else p.style.display = "none"
                                    }
                                } catch (n) {
                                    i = true, a = n
                                } finally {
                                    try {
                                        !t && r.return && r.return()
                                    } finally {
                                        if (i) throw a
                                    }
                                }
                            }(i)
                    },
                    k = function () {
                        var n = document.getElementById("ui-game");
                        if (!document.getElementById("ui-cheat-info")) {
                            var e = document.createElement("div");
                            e.id = "ui-cheat-info", e.className = "ui-cheat-enemy-info ui-bg-standard", e.appendChild(function () {
                                var n = document.createElement("div");
                                n.className = "ui-basic-info";
                                var e = document.createElement("div");
                                return e.className = "ui-team-member-name ui-cheat-team-member-name", n.appendChild(e), n
                            }()), e.appendChild(function () {
                                var n = document.createElement("div");
                                n.id = "ui-cheat-armor-container", n.className = "ui-armor-container";
                                var e = true,
                                    t = false,
                                    i = void 0;
                                try {
                                    for (var a, o = ["helmet", "chest", "backpack", "curWeapType"][Symbol.iterator](); !(e = (a = o.next()).done); e = true) {
                                        var r = a.value,
                                            s = document.createElement("div");
                                        s.id = r, s.className = "ui-armor-counter ui-cheat-armor-counter ui-outline-hover " + r;
                                        var l = document.createElement("div");
                                        l.className = "ui-armor-counter-inner";
                                        var c = document.createElement("div");
                                        c.className = "ui-armor-level";
                                        var p = document.createElement("img");
                                        p.className = "ui-armor-image ui-cheat-armor-image ui-loot-image", s.appendChild(l), s.appendChild(c), s.appendChild(p), n.appendChild(s)
                                    }
                                } catch (n) {
                                    t = true, i = n
                                } finally {
                                    try {
                                        !e && o.return && o.return()
                                    } finally {
                                        if (t) throw i
                                    }
                                }
                                return n
                            }()), n.appendChild(e)
                        }
                    },
                    I = function () {
                        var n, e;
                        document.getElementById("ui-cheat-info") && (n = "ui-cheat-info", (e = document.getElementById(n)).parentNode.removeChild(e))
                    },
                    C = function (e) { // healing action
                        var t = e[n.activePlayer.netData].dir,
                            i = e.curAction.type;
                        if (e && e[n.activePlayer.netData].dir) {
                            var a = e.targetAction;
                            if (a || ((a = window.PIXI.Sprite.from(p)).visible = false, a.scale.set(.15, .15), a.tint = 16711680, a.alpha = .5, e.container.addChild(a), e.targetAction = a, a.actionType = 1), a) {
                                1 === i && a.actionType !== i ? a.texture = p : 2 === i && a.actionType !== i && (a.texture = d), a.actionType = i;
                                var o = {
                                    x: -.5 * a.width + t.x,
                                    y: -1.5 * a.width + t.y
                                };
                                a.position.set(o.x, o.y), a.visible = 1 === i || 2 === i
                            }
                        }
                    },
                    E = function (n) {},
                    B = function (n) {},
                    L = function () {
                        for (var t = e.scope[n.input.main].binds, i = t.length, a = 0; a < i; a++)
                            if (null != t[a] && 2 == t[a].type && 2 == t[a].code) return true;
                        return false
                    },
                    M = function (t) {
                        //console.log(op)
                        //if (2 === t.button && !L() && op.autoAim.rightClickSwitch) {
                        if (2 === t.button && !L()) {
                            var i = e.scope[n.activePlayer.main];
                            if (i.curWeapIdx) return void pressKey("49");
                            if (!i.curWeapIdx) return void pressKey("50")
                        }
                        if ((0 === t.button || 2 === t.button && !L()) && s.new) {
                            var a = e.scope[n.input.main][n.input.input],
                                o = t.button;
                            a.mousePos = s.averageTargetMousePosition, a.mouseButtonsOld[o] = false, a.mouseButtons[o] = true
                        } else E(t)
                    },
                    D = function (t) {
                        var i = getPos(),
                            a = e.scope[n.camera].screenToPoint({
                                x: t.clientX,
                                y: t.clientY
                            });
                        s.mouseRelPointPos = {
                            x: a.x - i.x,
                            y: a.y - i.y
                        }, s.new || B(t)
                    },
                    P = function () {
                        window.removeEventListener("mousedown", M), window.removeEventListener("mousemove", D)
                    },
                    O = function (t) {

                    },
                    R = function (t) {
                       if (32 == t.which ) {
							var i = e.scope[n.activePlayer.main];
                            if (i.curWeapIdx) return void pressKey("49");
                            if (!i.curWeapIdx) return void pressKey("50")
					   }
                    },
                    S = function () {
                        window.removeEventListener("keydown", O), window.removeEventListener("keyup", R)
                    };
                return {
                    bind: function (t) {
                        var i, a, o, c = e.scope[n.input.main][n.input.input];
                        i = t, l.targetEnemyNicknameVisibility = i.targetEnemyNicknameVisibility, l.forwardFiringCoeff = i.forwardFiringCoeff, l.smoothLevel = i.smoothLevel, l.restirctionAngle = i.restirctionAngle, l.restirctions = i.restirctions, l.detectOnDifferentLevels = i.detectOnDifferentLevels, l.enemyExtendedInfo = i.enemyExtendedInfo, l.showEnemiesActions = i.showEnemiesActions, l.rightClickToggle = i.rightClickToggle, l.rightClickSwitch = i.rightClickSwitch, s = function () {
                            for (var n = [], e = 0; e < l.smoothLevel; e++) n.push({
                                distance: null,
                                radianAngle: null,
                                pos: getScreenPos(),
                                targetMousePosition: getScreenPos(),
                                timestamp: 0
                            });
                            return n.new = null, n.player = {
                                nameText: {
                                    visible: false,
                                    style: {
                                        fontSize: 22,
                                        fill: "#00FFFF"
                                    }
                                }
                            }, n.averageTargetMousePosition = null, n.mouseRelPointPos = {
                                x: 0,
                                y: 0
                            }, n
                         }(), E = c.bOnMouseDown, B = c.bOnMouseMove, window.removeEventListener("mousedown", c.bOnMouseDown), window.removeEventListener("mousemove", c.bOnMouseMove), P(), S(), window.addEventListener("mousedown", M), window.addEventListener("mousemove", D), window.addEventListener("keydown", O), window.addEventListener("keyup", R), a = e.scope[n.input.main].binds, o = e.scope[n.input.main].boundKeys, null != a[31] && 2 === a[31].code && 2 === a[31].type && (a[31].type = 1, a[31].code = 66, o[66] = true), r = true, window.events.add("playerBarn", "autoAimRenderCb")
                    },
                    unbind: function () {
                        window.events.remove("playerBarn", "autoAimRenderCb"), P(), S(), window.removeEventListener("mousedown", E), window.removeEventListener("mousemove", B), window.addEventListener("mousedown", E), window.addEventListener("mousemove", B), x(), I(), window.aimTarget = null, r = false
                    },
                    isBinded: function () {
                        return r
                    },
                    setTargetEnemyNicknameVisibility: function (n) {
                        l.setTargetEnemyNicknameVisibility = n
                    },
                    setForwardFiringCoeff: function (n) {
                        l.forwardFiringCoeff = n
                    },
                    setSmoothLevel: function (n) {
                        l.smoothLevel = n
                    },
                    setRestirctionAngle: function (n) {
                        l.restirctionAngle = n
                    },
                    setRestirctions: function (n) {
                        l.restirctions = n
                    },
                    setDetectOnDifferentLevels: function (n) {
                        l.detectOnDifferentLevels = n
                    },
                    setEnemyExtendedInfo: function (n) {
                        l.enemyExtendedInfo = n
                    },
                    setShowEnemiesActions: function (n) {
                        l.showEnemiesActions = n
                    },
                    setRightClickToggle: function (n) {
                        l.rightClickToggle = n
                    },
                    setRightClickSwitch: function (n) {
                        l.rightClickSwitch = n
                    },
                    render: function () {
                        var t;

						T(function () {
							var t = [];
							
							if (!e.scope[n.playerBarn.main][n.playerBarn.players][e.scope[n.activeId]]) return t;
	
							for (var i, a = e.scope[n.activeId], o = e.scope[n.playerBarn.main][n.playerBarn.players][a].teamId, r = Object.keys(e.scope[n.playerBarn.main][n.playerBarn.players]), s = e.scope[n.activePlayer.main], c = 0; c < r.length; c++) {
								
								// Remove our id from array we don't need it
								if ( r[c] != e.scope[n.activeId] ) {
									var p = e.scope[n.objectCreator].idToObj[r[c]],
										d = e.scope[n.playerBarn.main][n.playerBarn.players][r[c]];
										
									if ( e.scope[n.objectCreator].idToObj[r[c]] ) {
										if ( !p[n.activePlayer.netData].dead || !p[n.activePlayer.netData].downed ) {
											var po = p[n.activePlayer.netData].pos;
											
											var shoot_him = isNotCollideble( po )
											
											if ( shoot_him ) {
												p && (l.showEnemiesActions && C(p), (i = p)[n.activePlayer.netData].dead || i[n.activePlayer.netData].downed || getTeam(a, o, d, r[c]) || !checkLayer(s, p) || (t[r[c]] = p))
											} else {
												p && (l.showEnemiesActions && C(p), (i = p)[n.activePlayer.netData].dead || i[n.activePlayer.netData].downed || getTeam(a, o, d, r[c]) || !checkLayer(s, p))
											}
										}
									}
								}
							}

							return t
						}()), s.new && (t = s.averageTargetMousePosition, e.scope[n.input.main][n.input.input].mousePos = t)
					
                    }
                }
            }
            console.log("Cannot init autoaim")
        }
    }, {}],
    15: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e, t) {
            var i = t.bulletBarn,
                a = t.player,
                o = t.key,
                r = false;
            if (i && a) {
                var s = function (t) {
                        var i = e.scope[n.input.main][n.input.input].keys;
                        i[t] || setTimeout(function () {
                            i[t] = true, setTimeout(function () {
                                delete i[t]
                            }, 50)
                        }, 0)
                    },
                    l = function () {
                        return e.scope[n.activePlayer.main].pos
                    },
                    c = function (n, e, t, i) {
                        return (i * n - t * e) / -t
                    },
                    p = function (n, e, t, i) {
                        return Math.sqrt(Math.pow(n - t, 2) + Math.pow(e - i, 2))
                    },
                    d = function (n) {};
                return {
                    bind: function () {
                        d = i.prototype.render, i.prototype.render = function (t) {
                            ! function (n) {
                                if (n.length)
                                    for (var e = l(), t = 0; t < n.length; t++) {
                                        var i = {
                                                x: e.x + n[t].intersectionOfCoordLines.x,
                                                y: e.y + n[t].intersectionOfCoordLines.y
                                            },
                                            a = {
                                                x: p(n[t].bullet.pos.x, n[t].bullet.pos.y, i.x, e.y),
                                                y: p(n[t].bullet.pos.x, n[t].bullet.pos.y, e.x, i.y)
                                            };
                                        a.x < a.y ? Math.sign(n[t].intersectionOfCoordLines.x) < 0 ? s(o.D) : s(o.A) : Math.sign(n[t].intersectionOfCoordLines.y) < 0 ? s(o.W) : s(o.S);
                                    }
                            }(function () {
                                for (var t, i, o, r, s = [], p = l(), d = a.maxVisualRadius * Math.sqrt(2), u = e.scope[n.activePlayer.main], m = e.scope[n.bullets].bullets, f = 0; f < m.length; f++)
                                    if (m[f].alive && u.layer == m[f].layer) {
                                        var b = {
                                                x: m[f].pos.x - p.x,
                                                y: m[f].pos.y - p.y
                                            },
                                            A = m[f].dir;
                                        if (Math.sign(b.x) == Math.sign(A.x) && Math.sign(b.y) == Math.sign(A.y)) continue;
                                        var y = {
                                            x: (t = b.x, i = b.y, o = A.x, r = A.y, (r * t - o * i) / r),
                                            y: c(b.x, b.y, A.x, A.y)
                                        };
                                        (Math.abs(y.x) < d || Math.abs(y.y) < d) && s.push({
                                            bullet: e.scope[n.bullets].bullets[f],
                                            intersectionOfCoordLines: y
                                        })
                                    }
                                return s
                            }()), d.call(this, t)
                        }, r = true
                    },
                    unbind: function () {
                        i.prototype.render = d, r = false
                    },
                    isBinded: function () {
                        return r
                    }
                }
            }
            console.log("Cannot init autododge")
        }
    }, {}],
    16: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e, t) {
            var i = t.items,
                a = false,
                o = false,
                r = [];
            if (i) {
                var s = function (n) {};
                return {
                    bind: function () {
                        var t = function (n) {
                                var e = [],
                                    t = Object.keys(i),
                                    a = true,
                                    o = false,
                                    r = void 0;
                                try {
                                    for (var s, l = t[Symbol.iterator](); !(a = (s = l.next()).done); a = true) {
                                        var c = s.value;
                                        i[c].fireMode === n && e.push(c)
                                    }
                                } catch (n) {
                                    o = true, r = n
                                } finally {
                                    try {
                                        !a && l.return && l.return()
                                    } finally {
                                        if (o) throw r
                                    }
                                }
                                return e
                            }("single"),
                            l = function (n) {
                                var e = [],
                                    t = Object.keys(i),
                                    a = true,
                                    o = false,
                                    r = void 0;
                                try {
                                    for (var s, l = t[Symbol.iterator](); !(a = (s = l.next()).done); a = true) {
                                        var c = s.value;
                                        i[c].type === n && e.push(c)
                                    }
                                } catch (n) {
                                    o = true, r = n
                                } finally {
                                    try {
                                        !a && l.return && l.return()
                                    } finally {
                                        if (o) throw r
                                    }
                                }
                                return e
                            }("melee");
                        r = t.concat(l, "fists"), s = e.scope[n.input.main][n.input.input][n.input.mousePressed], e.scope[n.input.main][n.input.input][n.input.mousePressed] = function (t) {
                            return !(0 !== t || !o && !window.autoFire) || s.call(e.scope[n.input.main][n.input.input], t)
                        }, a = true, window.events.add("playerBarn", "autoFireRenderCb")
                    },
                    unbind: function () {
                        window.events.remove("playerBarn", "autoFireRenderCb"), a = false, s = function (n) {
                            return !this.mouseButtonsOld[n] && !!this.mouseButtons[n]
                        }, e.scope[n.input.main][n.input.input][n.input.mousePressed] = s, o = false
                    },
                    isBinded: function () {
                        return a
                    },
                    render: function () {
                        var t = e.scope[n.activePlayer.main],
                            i = e.scope[n.input.main][n.input.input].mouseButtons;
                        o = !(!i[0] || !r.includes(t.weapType))
                    }
                }
            }
            console.log("Cannot init autoFire")
        }
    }, {}],
    17: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e, t) {
            var i = t.key,
                a = false,
                o = null,
                r = function (t) {
                    var i = e.scope[n.input.main][n.input.input].keys;
                    i[t] || setTimeout(function () {
                        i[t] = true, setTimeout(function () {
                            delete i[t]
                        }, 90)
                    }, 0)
                },
                s = function () {
                    if (function () {
                            var t = e.scope[n.playerBarn.main][n.playerBarn.players];
                            if (!t[e.scope[n.activeId]]) return false;
                            for (var i = t[e.scope[n.activeId]].teamId, a = Object.keys(t), o = e.scope[n.objectCreator].idToObj, r = 0; r < a.length; r++) {
                                var s = a[r];
                                if (o[s] && !o[s][n.activePlayer.netData].dead && !o[s][n.activePlayer.netData].downed && t[s].teamId != i) return false
                            }
                            return true
                        }() && !((o = e.scope[n.input.main][n.input.input].keys)[i.W] || o[i.D] || o[i.S] || o[i.A]) && ("Reloading" != (a = e.scope[n.pieTimer]).clientData.label || !a.active)) {
                        var t = e.scope[n.activePlayer.main][n.activePlayer.localData];
                        if (t.health < 30 && t.inventory.healthkit > 0) return void r(i.Eight);
                        if (t.health < 70 && t.boost < 40 && t.inventory.bandage > 0) return void r(i.Seven);
                        if (t.boost < 50 && t.inventory.painkiller > 0) return void r(i.Zero);
                        if (t.boost < 75 && t.inventory.soda > 0) return void r(i.Nine)
                    }
                    var a, o
                };
            return {
                bind: function () {
                    ! function n() {
                        s(), o = setTimeout(n, 1e3)
                    }(), a = true
                },
                unbind: function () {
                    clearTimeout(o), o = null, a = false
                },
                isBinded: function () {
                    return a
                }
            }
        }
    }, {}],
    18: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e, t) {
            var i = t.lootBarn,
                a = t.bagSizes,
                o = t.items,
                r = t.uiModule,
                s = false,
                l = {},
                c = window.performance.now();
            if (i && a && o && r) {
                var p = function (t) {
                        var i = e.scope[n.input.main][n.input.input].keys;
                        i[t] || setTimeout(function () {
                            i[t] = true, setTimeout(function () {
                                delete i[t]
                            }, 90)
                        }, 0)
                    },
                    d = function (n, e) {
                        var t = Object.keys(o),
                            i = true,
                            a = false,
                            r = void 0;
                        try {
                            for (var s, l = t[Symbol.iterator](); !(i = (s = l.next()).done); i = true) {
                                var c = s.value,
                                    p = o[c],
                                    d = true,
                                    u = false,
                                    m = void 0;
                                try {
                                    for (var f, b = e[Symbol.iterator](); !(d = (f = b.next()).done); d = true) {
                                        var A = f.value;
                                        if (p.type === A && c === n) return c
                                    }
                                } catch (n) {
                                    u = true, m = n
                                } finally {
                                    try {
                                        !d && b.return && b.return()
                                    } finally {
                                        if (u) throw m
                                    }
                                }
                            }
                        } catch (n) {
                            a = true, r = n
                        } finally {
                            try {
                                !i && l.return && l.return()
                            } finally {
                                if (a) throw r
                            }
                        }
                        return null
                    },
                    u = function (n, e) {
                        //console.log(e.pos)
                        return t = n.pos, i = e.pos, a = i.x - t.x, o = i.y - t.y, Math.sqrt(a * a + o * o);
                        var t, i, a, o
                    },
                    m = function () {
                        var t, i, o = e.scope[n.lootBarn.main][n.lootBarn.itemf],
                            r = e.scope[n.activePlayer.main][n.activePlayer.netData],
                            s = e.scope[n.activePlayer.main][n.activePlayer.localData];
                        if (o && o.active && function (t) {
                                
                                return e.scope[n.lootBarn.main][n.lootBarn.lootPool][n.lootBarn.pool].filter(function (n) {
                                    //console.log(t)
                                    return n.active && u(n, t) < l.safeDistance
                                }).length > 0
                            }(r) && (i = c, window.performance.now() - i > l.dropDelay)) {
                            if (function (n, e, t) {
                                    if (null !== d(n.name, ["ammo", "heal", "boost", "throwable"])) {
                                        var i = t ? parseInt(t.slice(-2), 10) : 0,
                                            o = a[n.name][i];
                                        return e[n.name] !== o && p("70"), true
                                    }
                                    return false
                                }(o, s.inventory, r.backpack)) return;
                            if (function (n, e) {
                                    return !!/scope/.test(n.name) && (parseInt(n.name.slice(0, -6), 10), e[n.name] || p("70"), true)
                                }(o, s.inventory)) return;
                            if (function (t, i, a) {
                                    if (/helmet/.test(t.name) || /chest/.test(t.name) || /backpack/.test(t.name)) {
                                        var o = t.name.slice(0, -2),
                                            r = parseInt(t.name.slice(-2), 10);
                                        return e.scope[n.activePlayer.main][n.activePlayer.netData][o] ? (parseInt(a[o].slice(-2), 10) < r && p("70"), true) : (p("70"), true)
                                    }
                                    return false
                                }(o, r.backpack, r)) return;
                            if (l.autoPickUp.allow = function () {
                                    var t = e.scope[n.playerBarn.main][n.playerBarn.players];
                                    if (!t[e.scope[n.activeId]]) return false;
                                    for (var i = t[e.scope[n.activeId]].teamId, a = Object.keys(t), o = e.scope[n.objectCreator].idToObj, r = 0; r < a.length; r++) {
                                        var s = a[r];
                                        if (o[s] && !o[s][n.activePlayer.netData].dead && !o[s][n.activePlayer.netData].downed && t[s].teamId != i) return false
                                    }
                                    return true
                                }() && ("Reloading" != (t = e.scope[n.pieTimer]).clientData.label || !t.active), function (n, e) {
                                    var t = d(n.name, ["gun"]);
                                    if (l.autoPickUp.allow) {
                                        if (l.autoPickUp.weapon1 === t && e[0].name !== t) return p("49"), p("70"), true;
                                        if (l.autoPickUp.weapon2 === t && e[1].name !== t) return p("50"), p("70"), true
                                    }
                                    return ("" === e[0].name || "" === e[1].name) && null !== t && (p("70"), true)
                                }(o, s.weapons)) return;
                            if (function (n, e) {
                                    var t = d(n.name, ["melee"]);
                                    return l.autoPickUp.allow && l.autoPickUp.weapon3 === t && e[2].name !== t ? (p("51"), p("70"), true) : "fists" === e[2].name && null !== t && (p("70"), true)
                                }(o, s.weapons)) return;
                            if (function (n, e) {
                                    var t = d(n.name, ["skin"]);
                                    return l.autoPickUp.skin === t && e.skin !== t ? (p("70"), true) : "outfitBase" === e.skin && "outfitBase" !== l.autoPickUp.skin && t !== e.skin && "outfitBase" !== t && null !== t && (p("70"), true)
                                }(o, r)) return
                        }
                    },
                    f = function (n, e, t, i) {},
                    b = {},
                    A = function (n) {};
                return {
                    bind: function (n) {
                        var e;
                        e = n, l.autoPickUp = e.autoPickUp, l.safeDistance = e.safeDistance, l.dropDelay = e.dropDelay, f = i.prototype.l, i.prototype.l = function (n, e, t, i) {
                            b = this, m(), f.call(b, n, e, t, i)
                        }, A = r.prototype.pushAction, r.prototype.pushAction = function (n) {
                            ! function (n) {
                                "drop" === n.action && (c = window.performance.now())
                            }(n), A.call(this, n)
                        }, s = true
                    },
                    unbind: function () {
                        i.prototype.l = f, r.prototype.pushAction = A, s = false
                    },
                    isBinded: function () {
                        return s
                    },
                    getItemsFromSlot: function (n) {
                        var e = void 0;
                        return 1 != n && 2 != n || (e = "gun"), 3 == n && (e = "melee"), 5 == n && (e = "skin"),
                            function (n) {
                                var e = [],
                                    t = Object.keys(o),
                                    i = true,
                                    a = false,
                                    r = void 0;
                                try {
                                    for (var s, l = t[Symbol.iterator](); !(i = (s = l.next()).done); i = true) {
                                        var c = s.value;
                                        o[c].type === n && e.push({
                                            name: o[c].name,
                                            key: c
                                        })
                                    }
                                } catch (n) {
                                    a = true, r = n
                                } finally {
                                    try {
                                        !i && l.return && l.return()
                                    } finally {
                                        if (a) throw r
                                    }
                                }
                                return e
                            }(e).filter(function (n) {
                                return "fists" != n.key.toLowerCase()
                            })
                    },
                    setAutoPickUp: function (n) {
                        l.autoPickUp = n
                    },
                    setSafeDistance: function (n) {
                        l.safeDistance = n
                    },
                    setDropDelay: function (n) {
                        l.dropDelay = n
                    }
                }
            }
            console.log("Cannot init autoloot")
        }
    }, {}],
    19: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e, t, i) {
            var a = false,
                o = 2;
            return {
                bind: function () {
                    t.scope = function () {
                        if (i.scope) switch (i.scope.__type) {
                            case o:
                                i.scope.hasOwnProperty("door") && !i.scope.door.open && (t = "70", (a = e.scope[n.input.main][n.input.input].keys)[t] || setTimeout(function () {
                                    a[t] = true, setTimeout(function () {
                                        delete a[t]
                                    }, 50)
                                }, 50))
                        }
                        var t, a
                    }, a = true
                },
                unbind: function () {
                    t.scope = function () {}, a = false
                },
                isBinded: function () {
                    return a
                }
            }
        }
    }, {}],
    20: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e) {
            var t = false,
                i = function (t) {
                    e.scope[n.menu].container.alpha = t
                };
            return {
                bind: function (n) {
                    i(n), t = true
                },
                unbind: function () {
                    t = false
                },
                isBinded: function () {
                    return t
                },
                setBigMapTransparency: i
            }
        }
    }, {}],
    21: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e) {
            var t = false,
                i = false,
                a = function n() {
                    i && i.update(), t && requestAnimationFrame(n)
                };
            return {
                bind: function () {
                    t = true, i = new Stats,
                        function () {
                            if (i) {
                                var n = i.domElement.style;
                                n.position = "absolute", n.top = "", n.bottom = "4px", n.left = "4px", document.body.appendChild(i.domElement)
                            }
                        }(), requestAnimationFrame(a)
                },
                unbind: function () {
                    t = false, i.domElement.remove(), i = false
                },
                isBinded: function () {
                    return t
                }
            }
        }
    }, {}],
    22: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e) {
            var t = false,
                i = true,
                a = function () {
                    e.scope[n.pieTimer].a(function () {
                            o()
                        }, 4.2, "Grenade", true), i = false,
                        function t() {
                            var a = e.scope[n.activePlayer.main];
                            3 !== a.curWeapIdx || "frag" !== a.weapType || i ? o() : setTimeout(t, 100)
                        }()
                },
                o = function () {
                    e.scope[n.pieTimer] && e.scope[n.pieTimer].o(true), i = true
                },
                r = function (t) {
                    var o = e.scope[n.activePlayer.main];
                    3 === o.curWeapIdx && "frag" === o.weapType && i && 0 === t.button && !e.scope.gameOver && a()
                },
                s = function (n) {
                    0 !== n.button || i || o()
                };
            return {
                bind: function (n) {
                    window.addEventListener("mousedown", r), window.addEventListener("mouseup", s), t = true
                },
                unbind: function () {
                    window.removeEventListener("mousedown", r), window.addEventListener("mouseup", s), t = false
                },
                isBinded: function () {
                    return t
                }
            }
        }
    }, {}],
    23: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e, t) {
            var i = t.bullets,
                a = t.items,
                o = false,
                r = {
                    draw: null,
                    range: 0,
                    direction: 0,
                    angle: 0
                };
            if (i && a) {
                var s = function (n) {
                        return (window.performance.now() - n) / 1e3
                    },
                    l = function (n, e) {
                        if (n) {
                            var t = {
                                pos: n.pos,
                                time: window.performance.now()
                            };
                            if (!n.posData || s(n.posData[0].time) > .19) return n.posData = [t], n.prediction = {
                                x: 0,
                                y: 0
                            }, n.speed = 0, n.distance = 0, void(n.direction = null);
                            var i, a, o, r, l = n.posData[0],
                                c = (i = t.pos, a = l.pos, o = a.x - i.x, r = a.y - i.y, Math.sqrt(o * o + r * r));
                            n.direction = c > 1e-4 ? {
                                x: (t.pos.x - l.pos.x) / c,
                                y: (t.pos.y - l.pos.y) / c
                            } : null;
                            var p = c / s(l.time);
                            for (n.speed && (p = p * (1 - e) + n.speed * e), n.speed = p, n.distance = c, n.posData.push(t); n.posData.length > 4;) n.posData.shift()
                        }
                    },
                    c = function () {
                        r.draw && e.scope.initialized && r.draw.clear()
                    };
                return {
                    bind: function () {
                        o = true, r.draw = null, c(), window.events.add("playerBarn", "laserPointerRenderCb")
                    },
                    unbind: function () {
                        window.events.remove("playerBarn", "laserPointerRenderCb"), o = false, c()
                    },
                    isBinded: function () {
                        return o
                    },
                    render: function () {
                        var t = e.scope[n.activePlayer.main];
                        if (t.weapType) {
                            var o = e.scope[n.camera],
                                s = a[t.weapType];
                            isset(s.shotSpread) && isset(s.bulletType) ? (l(t[n.activePlayer.netData], .1), r.range = i[s.bulletType].distance * o.ppu, r.direction = Math.atan2(t[n.activePlayer.netData].dir.x, t[n.activePlayer.netData].dir.y) - Math.PI / 2, r.angle = .01745329252 * (s.shotSpread + (t[n.activePlayer.netData].speed > .01 ? s.moveSpread : 0)) / 2, function () {
                                var t, i = r.draw;
                                if (i || (i = new window.PIXI.Graphics, r.draw = i, (t = e.scope[n.activePlayer.main]).container.addChild(i), t.container.setChildIndex(i, 0)), i.graphicsData) {
                                    i.clear();
                                    var a = 0,
                                        o = 0,
                                        s = r.range,
                                        l = r.direction - r.angle,
                                        c = r.direction + r.angle;
                                    l = l > 2 * Math.PI ? l - 2 * Math.PI : l < 0 ? l + 2 * Math.PI : l, c = c > 2 * Math.PI ? c - 2 * Math.PI : c < 0 ? c + 2 * Math.PI : c, i.beginFill(16711680, .35), i.moveTo(a, o), i.arc(a, o, s, l, c), i.lineTo(a, o), i.endFill()
                                }
                            }()) : c()
                        }
                    }
                }
            }
            console.log("Cannot init laserpointer")
        }
    }, {}],
    24: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e) {
            var t = false,
                i = {
                    draw: null,
                    points: null
                },
                a = function (t) {
                    var a = function () {
                            var t = e.scope[n.playerBarn.main][n.playerBarn.players],
                                i = e.scope[n.activeId],
                                a = [];
                            if (!t[i]) return a;
                            for (var o = e.scope[n.objectCreator].idToObj, r = t[i].teamId, s = Object.keys(t), l = 0; l < s.length; l++) !o[s[l]] || o[s[l]][n.activePlayer.netData].dead || o[s[l]][n.activePlayer.netData].downed || t[s[l]].teamId == r || s[l] != i && (a[s[l]] = o[s[l]]);
                            return a
                        }(),
                        o = e.scope[n.camera];
                    i.points = a.map(function (e) {
                        return {
                            x: (e.pos.x - t[n.activePlayer.netData].pos.x) * o.ppu,
                            y: (t[n.activePlayer.netData].pos.y - e.pos.y) * o.ppu
                        }
                    })
                },
                o = function () {
                    i.draw && e.scope.initialized && i.draw.clear()
                };
            return {
                bind: function () {
                    t = true, i.draw = null, o(), window.events.add("playerBarn", "linesToPlayersRenderCb")
                },
                unbind: function () {
                    window.events.remove("playerBarn", "linesToPlayersRenderCb"), t = false, o()
                },
                isBinded: function () {
                    return t
                },
                render: function () {
                    var t = e.scope[n.activePlayer.main];
                    a(t),
                        function (n) {
                            if (n && n.container) {
                                var e = i.points,
                                    t = i.draw;
                                !e && e.length > 0 || (t || (t = new window.PIXI.Graphics, i.draw = t, n.container.addChild(t), n.container.setChildIndex(t, 0)), t.graphicsData && (t.clear(), t.beginFill(), t.lineStyle(2, 16562432), e.forEach(function (n) {
                                    t.moveTo(0, 0), t.lineTo(n.x, n.y)
                                }), t.endFill()))
                            }
                        }(t)
                }
            }
        }
    }, {}],
    25: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e, t, i) {
            var a = false,
                o = false,
                r = false,
                s = null,
                l = false,
                c = [{
                    name: "Modules"
                }, {
                    name: "Config"
                }],
                p = [{
                        type: "checkbox",
                        description: "Auto aim enabled",
                        inputProps: {
                            value: "autoAim.enabled"
                        },
                        callbacks: {
                            value: "autoAimEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "checkbox",
                        description: "Auto loot enabled",
                        inputProps: {
                            value: "autoLoot.enabled"
                        },
                        callbacks: {
                            value: "autoLootEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "checkbox",
                        description: "Auto heal enabled",
                        inputProps: {
                            value: "autoHeal.enabled"
                        },
                        callbacks: {
                            value: "autoHealEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "checkbox",
                        description: "Auto Switch enabled",
                        inputProps: {
                            value: "autoSwitch.enabled"
                        },
                        callbacks: {
                            value: "autoSwitchEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "checkbox",
                        description: "AutoDodge enabled",
                        inputProps: {
                            value: "autoDodge.enabled"
                        },
                        callbacks: {
                            value: "autoDodgeEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "checkbox",
                        description: "Auto opening doors enabled",
                        inputProps: {
                            value: "autoOpeningDoors.enabled"
                        },
                        callbacks: {
                            value: "autoOpeningDoorsEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "checkbox",
                        description: "Grenade timer enabled",
                        inputProps: {
                            value: "grenadeTimer.enabled"
                        },
                        callbacks: {
                            value: "grenadeTimerEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "checkbox",
                        description: "Laser pointer enabled",
                        inputProps: {
                            value: "laserPointer.enabled"
                        },
                        callbacks: {
                            value: "laserPointerEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "checkbox",
                        description: "Lines to players enabled",
                        inputProps: {
                            value: "linesToPlayers.enabled"
                        },
                        callbacks: {
                            value: "linesToPlayersEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "checkbox",
                        description: "Bump fire enabled",
                        inputProps: {
                            value: "autoFire.enabled"
                        },
                        callbacks: {
                            value: "autoFireEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "checkbox",
                        description: "Zoom changing enabled",
                        inputProps: {
                            value: "zoomRadiusManager.enabled"
                        },
                        callbacks: {
                            value: "zoomRadiusManagerEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "checkbox",
                        description: "Air drop tracking enabled",
                        inputProps: {
                            value: "airDropTracking.enabled"
                        },
                        callbacks: {
                            value: "airDropTrackingEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "checkbox",
                        description: "FPS counter enabled",
                        inputProps: {
                            value: "fpsCounter.enabled"
                        },
                        callbacks: {
                            value: "fpsCounterEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "checkbox",
                        description: "TriggerBot enabled",
                        inputProps: {
                            value: "tiggerBot.enabled"
                        },
                        callbacks: {
                            value: "tiggerBotEnableCb"
                        },
                        tabId: 0
                    }, {
                        type: "info",
                        description: "Transparency",
                        tabId: 1
                    }, {
                        type: "slider",
                        description: "Particles transparency level",
                        inputProps: {
                            min: "0",
                            max: "1",
                            step: "0.01",
                            value: "particlesTransparency"
                        },
                        callbacks: {
                            value: "particlesTransparencyCb"
                        },
                        tabId: 1
                    }, {
                        type: "slider",
                        description: "Ceiling transparency level",
                        inputProps: {
                            min: "0",
                            max: "1",
                            step: "0.01",
                            value: "ceilingTransparency"
                        },
                        callbacks: {
                            value: "ceilingTransparencyCb"
                        },
                        tabId: 1
                    }, {
                        type: "slider",
                        description: "Big map transparency level",
                        inputProps: {
                            min: "0",
                            max: "1",
                            step: "0.01",
                            value: "bigMapTransparency"
                        },
                        callbacks: {
                            value: "bigMapTransparencyCb"
                        },
                        tabId: 1
                    }, {
                        type: "slider",
                        description: "Grenade color",
                        inputProps: {
                            min: "0",
                            max: "16777216",
                            step: "1",
                            value: "fragGrenadeColor"
                        },
                        callbacks: {
                            value: "grenadePropertiesCb",
                            useInputValueFrom: "fragGrenadeSize",
                            position: 0
                        },
                        tabId: 1
                    }, {
                        type: "slider",
                        description: "Grenade size",
                        inputProps: {
                            min: "0.1",
                            max: "0.5",
                            step: "0.01",
                            value: "fragGrenadeSize"
                        },
                        callbacks: {
                            value: "grenadePropertiesCb",
                            useInputValueFrom: "fragGrenadeColor",
                            position: 1
                        },
                        tabId: 1
                    }, {
                        type: "checkbox",
                        description: "Barrel Recolor",
                        inputProps: {
                            value: "barrelRecolor"
                        },
                        callbacks: {
                            value: "barrelRecolorCb"
                        },
                        tabId: 1
                    },{
                        type: "checkbox",
                        description: "Bullet Recolor",
                        inputProps: {
                            value: "bulletRecolor"
                        },
                        callbacks: {
                            value: "bulletRecolorCb"
                        },
                        tabId: 1
                    }, {
                        type: "resetButton",
                        description: "Reset grenade properties",
                        callbacks: {
                            value: "defaultGrenadePropertiesCb"
                        },
                        tabId: 1
                    }, {
                        type: "slider",
                        description: "Smoke alpha",
                        inputProps: {
                            min: "0",
                            max: "1",
                            step: "0.01",
                            value: "smokeGrenadeAlpha"
                        },
                        callbacks: {
                            value: "smokeGrenadePropertiesCb"
                        },
                        tabId: 1
                    }, {
                        type: "info",
                        description: "Auto Aim",
                        tabId: 1
                    }, {
                        type: "checkbox",
                        description: "Target enemy nickname visibility enabled",
                        inputProps: {
                            value: "autoAim.targetEnemyNicknameVisibility"
                        },
                        callbacks: {
                            value: "autoAimTargetEnemyNicknameVisibilityCb"
                        },
                        tabId: 1
                    }, {
                        type: "checkbox",
                        description: "Target enemy extended info enabled",
                        inputProps: {
                            value: "autoAim.enemyExtendedInfo"
                        },
                        callbacks: {
                            value: "autoAimEnemyExtendedInfoCb"
                        },
                        tabId: 1
                    }, {
                        type: "checkbox",
                        description: "Detect on different levels",
                        inputProps: {
                            value: "autoAim.detectOnDifferentLevels"
                        },
                        callbacks: {
                            value: "autoAimDetectOnDifferentLevelsCb"
                        },
                        tabId: 1
                    }, {
                        type: "checkbox",
                        description: "Show enemies actions",
                        inputProps: {
                            value: "autoAim.showEnemiesActions"
                        },
                        callbacks: {
                            value: "autoAimShowEnemiesActionsCb"
                        },
                        tabId: 1
                    }, {
                        type: "checkbox",
                        description: "Turn off permanent tracking",
                        inputProps: {
                            value: "autoAim.restirctions"
                        },
                        callbacks: {
                            value: "autoAimRestirctionsCb"
                        },
                        options: {
                            showOrHide: ["autoAimrestirctionAngle"]
                        },
                        tabId: 1
                    },
                    // {
                    // type: "checkbox",
                    // description: "Right Click Toggle",
                    // inputProps: {
                    // value: "autoAim.rightClickToggle"
                    // },
                    // callbacks: {
                    // value: "autoAimRightClickToggleCb"
                    // },
                    // tabId: 1
                    // },
                    // {
                    // type: "checkbox",
                    // description: "Switch Guns",
                    // inputProps: {
                    // value: "autoAim.rightClickSwitch"
                    // },
                    // callbacks: {
                    // value: "autoAimRightClickSwitchCb"
                    // },
                    // tabId: 1
                    // },
                    {
                        type: "slider",
                        description: "Forward firing coeff",
                        inputProps: {
                            min: "0.9",
                            max: "1.1",
                            step: "0.01",
                            value: "autoAim.forwardFiringCoeff"
                        },
                        callbacks: {
                            value: "autoAimForwardFiringCoeffCb"
                        },
                        tabId: 1
                    }, {
                        type: "slider",
                        description: "Smooth level",
                        inputProps: {
                            min: "2",
                            max: "20",
                            step: "1",
                            value: "autoAim.smoothLevel"
                        },
                        callbacks: {
                            value: "autoAimSmoothLevelCb"
                        },
                        tabId: 1
                    }, {
                        type: "slider",
                        description: "Restirction angle",
                        inputProps: {
                            min: "1",
                            max: "60",
                            step: "1",
                            value: "autoAim.restirctionAngle"
                        },
                        callbacks: {
                            value: "autoAimRestirctionAngleCb"
                        },
                        options: {
                            display: {
                                value: "autoAim.restirctions"
                            },
                            id: "autoAimrestirctionAngle"
                        },
                        tabId: 1
                    }, {
                        type: "info",
                        description: "Auto Loot",
                        tabId: 1
                    }, {
                        type: "slider",
                        description: "Safe distance",
                        inputProps: {
                            min: "0.1",
                            max: "1.3",
                            step: "0.1",
                            value: "autoLoot.safeDistance"
                        },
                        callbacks: {
                            value: "autoLootSafeDistanceCb"
                        },
                        tabId: 1
                    }, {
                        type: "slider",
                        description: "Autoloot drop delay",
                        inputProps: {
                            min: "0",
                            max: "2000",
                            step: "10",
                            value: "autoLoot.dropDelay"
                        },
                        callbacks: {
                            value: "autoLootDropDelayCb"
                        },
                        tabId: 1
                    }, {
                        type: "select",
                        description: "Automatic weapon(slot 1) pick up",
                        inputProps: {
                            valuesFromFunction: "getAutoLootAutoPickUpCb",
                            functionValue: {
                                value: 1
                            },
                            selected: "autoLoot.autoPickUp.weapon1"
                        },
                        callbacks: {
                            value: "setAutoLootAutoPickUpCb",
                            functionValue: {
                                value: 1,
                                position: 0
                            }
                        },
                        tabId: 1
                    }, {
                        type: "select",
                        description: "Automatic weapon(slot 2) pick up",
                        inputProps: {
                            valuesFromFunction: "getAutoLootAutoPickUpCb",
                            functionValue: {
                                value: 2
                            },
                            selected: "autoLoot.autoPickUp.weapon2"
                        },
                        callbacks: {
                            value: "setAutoLootAutoPickUpCb",
                            functionValue: {
                                value: 2,
                                position: 0
                            }
                        },
                        tabId: 1
                    }, {
                        type: "select",
                        description: "Automatic weapon(slot 3) pick up",
                        inputProps: {
                            valuesFromFunction: "getAutoLootAutoPickUpCb",
                            functionValue: {
                                value: 3
                            },
                            selected: "autoLoot.autoPickUp.weapon3"
                        },
                        callbacks: {
                            value: "setAutoLootAutoPickUpCb",
                            functionValue: {
                                value: 3,
                                position: 0
                            }
                        },
                        tabId: 1
                    }, {
                        type: "select",
                        description: "Automatic skin pick up",
                        inputProps: {
                            valuesFromFunction: "getAutoLootAutoPickUpCb",
                            functionValue: {
                                value: 5
                            },
                            selected: "autoLoot.autoPickUp.skin"
                        },
                        callbacks: {
                            value: "setAutoLootAutoPickUpCb",
                            functionValue: {
                                value: 5,
                                position: 0
                            }
                        },
                        tabId: 1
                    }
                ],
                d = function () {
                    setTimeout(function () {
                        i.storeOptionsCb.call()
                    })
                },
                u = function (n, e) {
                    e ? removeClass(n, "btn-grey") : addClass(n, "btn-grey")
                },
                m = function (n) {
                    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                        t = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                        i = document.createElement("div");
                    i.className = "btn-game-container";
                    var a = document.createElement("a");
                    a.className = "btn-game-settings btn-game-tab-select btn-game-menu btn-darken", a.setAttribute("data-cheat-tab", "tab-" + n), e && (a.innerHTML = e);
                    var o = document.createElement("div");
                    return t && (o.className = "btn-double-row game-menu-icon-static", addClass(o, t.className)), a.addEventListener("click", function () {
                        var n = this.getAttribute("data-cheat-tab").split("-")[1];
                        b(n)
                    }), i.appendChild(a), i.appendChild(o), i
                },
                f = function () {
                    var n = function () {
                            var n = document.createElement("div");
                            return n.className = "btn-game-tabs btns-game-double-row", n.style = "display: flex", n
                        }(),
                        e = 0,
                        t = true,
                        i = false,
                        a = void 0;
                    try {
                        for (var o, r = c[Symbol.iterator](); !(t = (o = r.next()).done); t = true) {
                            var s = o.value,
                                l = !!isset(s.name) && s.name,
                                p = !!isset(s.name) && s.icon,
                                d = m(e, l, p);
                            n.appendChild(d), e++
                        }
                    } catch (n) {
                        i = true, a = n
                    } finally {
                        try {
                            !t && r.return && r.return()
                        } finally {
                            if (i) throw a
                        }
                    }
                    return n
                },
                b = function (n) {
                    if (n = parseInt(n), s !== n) {
                        var e = document.getElementsByAttribute("data-cheat-tab", "tab-" + n)[0];
                        if (addClass(e, "btn-game-menu-selected"), null !== s) {
                            var t = document.getElementsByAttribute("data-cheat-tab", "tab-" + s)[0];
                            removeClass(t, "btn-game-menu-selected")
                        }
                        document.getElementById("ui-cheat-tab-" + n).style = "display: block", null !== s && (document.getElementById("ui-cheat-tab-" + s).style = "display: none"), s = n
                    }
                },
                A = function (n) {
                    var e = document.createElement("div");
                    e.className = "ui-list ui-game-tab ui-game-tab-settings-desktop full-height", e.style = "display: none;", e.id = "ui-cheat-tab-" + n;
                    var t = document.createElement("div");
                    return t.style = "height: 100%;", e.appendChild(t), e
                },
                y = function (n) {
                    var e, a, o, r, s = null;
                    if ("slider" === n.type) {
                        var l = false;
                        isset(n.options) && (l = n.options), s = function (n, e, a) {
                            var o = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
                                r = document.createElement("div");
                            if (i[a.value]) {
                                r.className = "slider-container ui-slider-container center", isset(o.id) && (r.id = o.id), isset(o.display) && (fetchFromObject(t, o.display.value) || (r.style = "display: none;"));
                                var s = document.createElement("p");
                                s.className = "slider-text left", s.innerHTML = n;
                                var l = fetchFromObject(t, e.value),
                                    c = document.createElement("span");
                                c.className = "slider-current-value right", c.innerHTML = l;
                                var p = document.createElement("input");
                                p.className = "slider", p.type = "range", p.min = e.min, p.max = e.max, p.step = e.step, p.value = l, p.addEventListener("input", function () {
                                    if (isset(a.useInputValueFrom)) {
                                        var n = fetchFromObject(t, a.useInputValueFrom),
                                            e = 0 === a.position ? n : this.value,
                                            o = 1 === a.position ? n : this.value;
                                        i[a.value].call(this, e, o)
                                    } else i[a.value].call(this, this.value);
                                    c.innerHTML = this.value, d()
                                }, false), r.appendChild(s), r.appendChild(c), r.appendChild(p)
                            }
                            return r
                        }(n.description, n.inputProps, n.callbacks, l)
                    } else "checkbox" === n.type ? (l = false, isset(n.options) && (l = n.options), s = function (n, e, a) {
                        var o = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
                            r = document.createElement("div");
                        if (i[a]) {
                            var s = document.createElement("button");
                            s.className = "btn-game-menu btn-darken", s.style = "display: block", s.innerHTML = n, s.setAttribute("data", fetchFromObject(t, e.value)), u(s, fetchFromObject(t, e.value)), s.addEventListener("click", function () {
                                i[a].call();
                                var n = fetchFromObject(t, e.value);
                                if (u(this, n), d(), isset(o.showOrHide)) {
                                    var r = true,
                                        s = false,
                                        l = void 0;
                                    try {
                                        for (var c, p = o.showOrHide[Symbol.iterator](); !(r = (c = p.next()).done); r = true) {
                                            var m = c.value,
                                                f = document.getElementById(m);
                                            f.style.display = n ? "block" : "none"
                                        }
                                    } catch (n) {
                                        s = true, l = n
                                    } finally {
                                        try {
                                            !r && p.return && p.return()
                                        } finally {
                                            if (s) throw l
                                        }
                                    }
                                }
                            }, false), r.appendChild(s)
                        }
                        return r
                    }(n.description, n.inputProps, n.callbacks.value, l)) : "resetButton" === n.type ? (e = n.description, a = n.callbacks.value, o = n.tabId, r = document.createElement("div"), i[a] && (r.className = "menu-option btn-darken", r.innerHTML = e, r.addEventListener("click", function () {
                        i[a].call(), setTimeout(function () {
                            v(), g(), b(o), d()
                        })
                    }, false)), s = r) : "select" === n.type ? s = function (n, e, a) {
                        var o = document.createElement("div");
                        if (i[a.value]) {
                            var r = document.createElement("p");
                            r.className = "slider-text", r.innerHTML = n;
                            var s = document.createElement("select");
                            s.className = "select-cheat";
                            var l = [];
                            if (isset(e.values)) l = fetchFromObject(t, e.values);
                            else if (isset(e.functionValue)) {
                                var c = e.functionValue.value;
                                l = fetchFromObject(i, e.valuesFromFunction).call(this, c)
                            } else l = fetchFromObject(i, e.valuesFromFunction).call(this);
                            l.unshift({
                                name: "None",
                                key: ""
                            });
                            for (var p = 0; p < l.length; p++) {
                                var u = document.createElement("option");
                                u.value = l[p].key, u.text = l[p].name, fetchFromObject(t, e.selected) === l[p].key && (u.selected = true), s.appendChild(u)
                            }
                            s.addEventListener("change", function () {
                                if (isset(a.functionValue)) {
                                    var n = a.functionValue.value,
                                        e = 0 === a.functionValue.position ? n : this.value,
                                        t = 1 === a.functionValue.position ? n : this.value;
                                    i[a.value].call(this, e, t)
                                } else i[a.value].call(this);
                                d()
                            }, false), o.appendChild(r), o.appendChild(s)
                        }
                        return o
                    }(n.description, n.inputProps, n.callbacks) : "info" === n.type && (s = function (n) {
                        var e = document.createElement("div");
                        e.className = "info-container";
                        var t = document.createElement("p");
                        return t.className = "info-text", t.innerHTML = n, e.appendChild(t), e
                    }(n.description));
                    return s
                },
                g = function () {
                    var n;
                    r && ((n = document.getElementById("game-area-wrapper")).style.display = "contents", n.style.opacity = ""), removeHTMLElement("ui-cheat-menu"), T();
                    var e = function () {
                            var n = document.createElement("div");
                            return n.className = "ui-game-menu ui-game-menu-desktop", r && addClass(n, "ui-green"), n.style = "display: block; float: right;", n.id = "ui-cheat-menu", n
                        }(),
                        t = f();
                    e.appendChild(t);
                    var i = function () {
                            for (var n = [], e = 0; e < c.length; e++) {
                                for (var t = A(e), i = 0; i < p.length; i++)
                                    if (p[i].tabId === e) {
                                        var a = y(p[i]);
                                        isset(a) && t.firstChild.appendChild(a)
                                    }
                                n.push(t)
                            }
                            return n
                        }(),
                        a = true,
                        o = false,
                        l = void 0;
                    try {
                        for (var d, u = i[Symbol.iterator](); !(a = (d = u.next()).done); a = true) {
                            var m = d.value;
                            e.appendChild(m)
                        }
                    } catch (n) {
                        o = true, l = n
                    } finally {
                        try {
                            !a && u.return && u.return()
                        } finally {
                            if (o) throw l
                        }
                    }
                    document.getElementById("ui-center").appendChild(e), document.getElementById("btn-game-resume").addEventListener("click", v), document.getElementById("btn-game-quit").addEventListener("click", v), s = null, b(0)
                },
                v = function n() {
                    removeHTMLElement("ui-cheat-menu"), l && document.getElementById("btn-game-resume").removeEventListener("click", n, false), l && document.getElementById("btn-game-quit").removeEventListener("click", n, false), o = false, l = false
                },
                h = function (n) {
                    27 == event.which && (T(true), (o = !o) ? g() : v())
                },
                x = function () {
                    window.removeEventListener("keyup", h)
                },
                T = function () {
                    var t, i = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                    t = !(r = !(isset(e.scope) && true === e.scope.initialized)) && i ? !e.scope[n.menu].escMenuDisplayed : r ? o : e.scope[n.menu].escMenuDisplayed, o = t
                };
            return {
                bind: function () {
                    removeHTMLElement("ui-cheat-menu"), T(), x(), window.addEventListener("keyup", h), a = true
                },
                unbind: function () {
                    o && (v(), o = false), x(), a = false
                },
                isBinded: function () {
                    return a
                }
            }
        }
    }, {}],
    26: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e, t) {
            var i = false;
            return {
                bind: function (n) {
                    t.scope = n.smokeAlpha, i = true
                },
                unbind: function () {
                    t.scope = 1, i = false
                },
                isBinded: function () {
                    return i
                },
                setSmokeAlpha: function (n) {
                    t.scope = n
                }
            }
        }
    }, {}],
    27: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e, t) {
            var i = t.bullets,
                a = t.items,
                o = false;
            if (a) {
                var calculateDistance = function (n, e, t, i) {
                        return Math.sqrt(Math.pow(n - t, 2) + Math.pow(e - i, 2))
                    },
                    s = function (t) {
                        var pos = (u = e.scope[n.activePlayer.main]).pos,
                            objects = e.scope[n.objectCreator].idToObj,
                            shootable = function (curObj) {
								// what is this? :D
                                if (curObj.collidable && curObj.collidable) {
                                    if (curObj.isBush != undefined && curObj.isBush) {
                                        return true
                                    }
                                } else {
                                    return false
                                }
                            },
                            collidableObjects = Object.keys(objects).filter(function (n) {
                                var curObj = objects[n]
                                if (typeof curObj.img == "string") {
									// collidable elements filter
                                    return void 0 !== objects[n].collidable && objects[n].collidable || !objects[n].isDoor || !objects[n].isBush || !objects[n].img.includes("stair")
                                } else {
                                    return void 0 !== objects[n].collidable && objects[n].collidable
                                }
                            }, ),
                            p = [];
                        p.A = [], p.B = [], p.C = [], p.D = [], p.A.x = pos.x, p.A.y = pos.y, p.B.x = t.x, p.B.y = t.y;
                        var d = true;
                        collidableObjects.forEach(function (n, e, t) {
                            var i;
                            objects[n].layer !== u.layer || objects[n].dead || void 0 !== (i = objects[n]).img && i.img.indexOf("window") > -1 || (void 0 !== objects[n].collider && void 0 !== objects[n].collider.min && void 0 !== objects[n].collider.max ? (p.C.x = objects[n].collider.min.x, p.C.y = objects[n].collider.min.y, p.D.x = objects[n].collider.max.x, p.D.y = objects[n].collider.min.y, l(p) && (d = false), p.C.x = objects[n].collider.max.x, p.C.y = objects[n].collider.min.y, p.D.x = objects[n].collider.max.x, p.D.y = objects[n].collider.max.y, l(p) && (d = false), p.C.x = objects[n].collider.max.x, p.C.y = objects[n].collider.max.y, p.D.x = objects[n].collider.min.x, p.D.y = objects[n].collider.max.y, l(p) && (d = false), p.C.x = objects[n].collider.min.x, p.C.y = objects[n].collider.max.y, p.D.x = objects[n].collider.min.x, p.D.y = objects[n].collider.max.y, l(p) && (d = false)) : function (n, e, t, i, a, o) {
                                var r, s, l = a - t,
                                    c = o - i,
                                    p = l * l + c * c,
                                    d = -1;
                                0 != p && (d = ((n - t) * l + (e - i) * c) / p), d < 0 ? (r = t, s = i) : d > 1 ? (r = a, s = o) : (r = t + d * l, s = i + d * c);
                                var u = n - r,
                                    m = e - s;
                                return Math.sqrt(u * u + m * m)
                            }(objects[n].collider.pos.x, objects[n].collider.pos.y, p.A.x, p.A.y, p.B.x, p.B.y) <= objects[n].collider.rad && (d = false))
                        });
                        var u = e.scope[n.activePlayer.main];
                        d && !e.scope[n.pieTimer].active && 3 !== u.curWeapIdx && function (curPlayer, enemy) {
                            var t = calculateDistance(curPlayer.pos.x, curPlayer.pos.y, enemy.pos.x, enemy.pos.y);
                            if (curPlayer.weapType) {
                                var o = a[curPlayer.weapType]
                                if (isset(o.bulletType)) {
                                    var inRange = t < i[o.bulletType].distance
                                }
                                var enoughAmmo = curPlayer[n.activePlayer.localData].weapons.filter(function (e) {
                                    return e.name == curPlayer.weapType
                                })[0].ammo > 0
                                return enoughAmmo && inRange
                            }
                            return true
                        }(u, window.aimTarget) ? window.autoFire = true : window.autoFire = false
                    };
                return {
                    bind: function () {
                        window.events.add("playerBarn", "tiggerBotRenderCb"), o = true
                    },
                    unbind: function () {
                        window.events.remove("playerBarn", "tiggerBotRenderCb"), o = false, window.autoFire = false
                    },
                    isBinded: function () {
                        return o
                    },
                    render: function () {
                        void 0 !== window.aimTarget && null != window.aimTarget ? s(window.aimTarget.pos) : window.autoFire = false
                    }
                }
            }

            function l(n) {
                return !! function (n) {
                    return c(n.A, n.B, n.C) || c(n.A, n.B, n.D) || c(n.C, n.D, n.A) || c(n.C, n.D, n.B)
                }(n) || !(p(n.A, n.B, n.C) * p(n.A, n.B, n.D) >= 0 || p(n.C, n.D, n.A) * p(n.C, n.D, n.B) >= 0)
            }

            function c(n, e, t) {
                return 0 == n.x * e.y + e.x * t.y + t.x * n.y - t.x * e.y - n.x * t.y - e.x * n.y && Math.min([n.x, e.x]) <= t.x && t.x <= Math.max([n.x, e.x]) && Math.min([n.y, e.y]) <= t.y && t.y <= Math.max([n.y], e.y)
            }

            function p(n, e, t) {
                return n.x * e.y + e.x * t.y + t.x * n.y - t.x * e.y - n.x * t.y - e.x * n.y
            }
            console.log("Cannot init autoFire")
        }
    }, {}],
    28: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e, t) {
            var i = t.scopeZoomRadius,
                a = Object.assign({}, i),
                o = false;
            if (i) {
                var r = function (n) {
                        i ? Object.keys(i).map(function (e) {
                            "scope" === e.replace(/[0-9]/g, "").slice(1) && (i[e] = n)
                        }) : console.log("Scope zoom and radius not patched")
                    },
                    s = 68,
                    l = function (n) {},
                    c = function (n) {
                        if (n.shiftKey) {
                            var e = n.deltaY || n.detail || n.wheelDelta;
                            (s += 10 * Math.sign(e)) < 10 && (s = 10), s > 1e3 && (s = 1e3), r(s)
                        } else l(n)
                    },
                    p = function (n) {
                        window.removeEventListener("wheel", c)
                    };
                return {
                    bind: function () {
                        var t = e.scope[n.input.main][n.input.input];
                        l = t.bOnMouseWheel, window.removeEventListener("wheel", t.bOnMouseWheel), p(), window.addEventListener("wheel", c), r(s), o = true
                    },
                    unbind: function () {
                        p(), window.removeEventListener("wheel", l), window.addEventListener("wheel", l), i ? Object.keys(i).map(function (n) {
                            "scope" === n.replace(/[0-9]/g, "").slice(1) && (i[n] = a[n])
                        }) : console.log("Scope zoom and radius not patched"), o = false
                    },
                    isBinded: function () {
                        return o
                    }
                }
            }
            console.log("Cannot init zoom radius manager")
        }
    }, {}],
    29: [function (n, e, t) {
        "use strict";
        e.exports = function (n, e, t) {
            var isBinded = false,
                o = null,
                realMousePos = {
                    x: 0,
                    y: 0
                },
                curAction = null,
                items = t.items,
                bullets = t.bullets,
                //returns enemies inside playerbarn from objectcreator
                getEnemies = function () {
                    var result = [],
                        curTeamId = e.scope[n.playerBarn.main][n.playerBarn.players][e.scope[n.activeId]].teamId,
                        playerIds = Object.keys(e.scope[n.playerBarn.main][n.playerBarn.players])
                    for (var i = 0; i < playerIds.length; i++) {
                        var enemyObject = e.scope[n.objectCreator].idToObj[playerIds[i]]
                        if (enemyObject && enemyObject.__id != e.scope[n.activeId] && !e.scope[n.objectCreator].idToObj[playerIds[i]][n.activePlayer.localData].dead && !e.scope[n.objectCreator].idToObj[playerIds[i]][n.activePlayer.netData].downed && e.scope[n.playerBarn.main][n.playerBarn.players][playerIds[i]].teamId != curTeamId) {
                            result[playerIds[i]] = e.scope[n.objectCreator].idToObj[playerIds[i]];
                        }
                    }
                    return result

                },
                calculateDistance = function (x1, y1, x2, y2) {
                    // ___________________
                    //√(x1-x2)^2+(y1-y2)^2
                    return (Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
                },
                //get player position
                getCurPos = function () {
                    return e.scope[n.activePlayer.main].pos
                },
                pressKey = function (key) {
                    var keys = e.scope[n.input.main][n.input.input].keys;
                    keys[key] || setTimeout(function () {
                        keys[key] = true, setTimeout(function () {
                            delete keys[key]
                        }, 90)
                    }, 0)
                },
                getMousePos = function (event) {
                    var playerPos = getCurPos();
                    realMousePos = e.scope[n.camera].screenToPoint({
                        x: event.clientX + playerPos.x,
                        y: event.clientY + playerPos.y
                    });
                },
                selectEnemy = function () {
                    var enemies = getEnemies(),
                        distanceArray = []

                    if (enemies) {
                        enemies = enemies.filter(function (e) {
                            return e
                        });
                        for (var i = 0; i < enemies.length; i++) {
                            distanceArray[i] = calculateDistance(realMousePos.x, realMousePos.y, enemies[i].pos.x, enemies[i].pos.y)
                        }
                        var min = Math.min.apply(null, distanceArray)
                        if (min != Infinity) {
                            var minIndex = distanceArray.findIndex(function (e) {
                                return e == min
                            })
                            return enemies[minIndex]
                        }
                    }
                },
                switchWeapon = function () {

                    var netData = e.scope[n.activePlayer.main][n.activePlayer.localData],
                        gun1 = items[netData.weapons["0"].name],
                        gun2 = items[netData.weapons["1"].name],
                        distanceToEnemy = null,
                        curPos = getCurPos(),
                        enemy = selectEnemy(),
                        mouseDown = false
                    curAction = netData.action.type,
                        window.onmousedown = function () {
                            mouseDown = true
                        }
                    if (gun1 != undefined && gun2 != undefined && !mouseDown) {
                        var bullet1 = bullets[gun1.bulletType],
                            bullet2 = bullets[gun2.bulletType]
                        //true / false if we can reload or not
                        var needtoReload1 = netData.weapons["0"].ammo < gun1.maxReload,
                            needtoReload2 = netData.weapons["1"].ammo < gun2.maxReload,
                            reloading = false
                        if (needtoReload1 || needtoReload2) {
                            // if(no enemy, not doing anything, not shooting and need to reload) then reload
                            if (!enemy && curAction == 0 && !reloading && needtoReload1 && netData.inventory[bullet1.tracerColor] > 0) {
                                pressKey("49")
                                pressKey("82")
                                setTimeout(function () {
                                    reloading = false
                                }, gun1.reloadTime * 1000)
                            }
                            if (!enemy && curAction == 0 && !reloading && needtoReload2 && netData.inventory[bullet2.tracerColor] > 0) {
                                pressKey("50")
                                pressKey("82")
                                reloading = true
                                setTimeout(function () {
                                    reloading = false
                                }, gun2.reloadTime * 1000)
                            }
                        }
                        if (enemy != undefined && curPos && bullets && items && curAction == 0 && !needtoReload1 && !needtoReload2) {
                            distanceToEnemy = calculateDistance(curPos.x, curPos.y, enemy.pos.x, enemy.pos.y)
                            //  Bullet count per trigger pull * Bullet damage * Exponential falloff calculation / Fire delay / Acuraccy
                            var Pref1 = ((2 * ((gun1.bulletCount * bullet1.damage - Math.pow(distanceToEnemy, bullet1.falloff))) / gun1.fireDelay) / gun1.shotSpread),
                                Pref2 = ((2 * ((gun2.bulletCount * bullet2.damage - Math.pow(distanceToEnemy, bullet2.falloff))) / gun2.fireDelay) / gun2.shotSpread)
                            //Check if outside range or if magazine is empty
                            if (distanceToEnemy > bullet1.distance || e.scope[n.activePlayer.main][n.activePlayer.localData].weapons["0"].ammo == 0) {
                                Pref1 = -100000
                            }
                            if (distanceToEnemy > bullet2.distance || e.scope[n.activePlayer.main][n.activePlayer.localData].weapons["1"].ammo == 0) {
                                Pref2 = -100000
                            }
                            //Perform switch
                            if (!(e.scope[n.activePlayer.main].curWeapIdx == 3 || e.scope[n.activePlayer.main].curWeapIdx == 4)) {
                                if (Pref2 == Pref1) {
                                    return null //do nothing
                                } else if (Pref2 > Pref1) {
                                    pressKey("50")
                                } else {
                                    pressKey("49");
                                }

                            }

                        }
                    }
                }
            return {
                bind: function () {
                    var pos = getCurPos()
                    realMousePos.x = pos.x
                    realMousePos.y = pos.y
                    window.addEventListener("mousemove", getMousePos);

                    ! function n() {
                        switchWeapon(), o = setTimeout(n, 5e2)
                    }()

                    isBinded = true
                },
                unbind: function () {
                    window.removeEventListener("mousemove", getMousePos)
                    clearTimeout(o), o = null, isBinded = false
                },
                isBinded: function () {
                    return isBinded
                }
            }
        }
    }, {}]
}, {}, [6]);