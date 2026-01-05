// ==UserScript==
// @name Anfit's GC Mods Patched Edition
// @description Extra features for SFGC (http://gc.gamestotal.com/)
// @include http://gc.gamestotal.com/*
// @include http://gc.gamestotal.com/
// @icon http://i1275.photobucket.com/albums/y459/420BadWolf/anfits-gc-mods_zps2c81edbc.png
// @namespace http://gc.mmanir.net
// @author (c) 2012 Jan 'anfit' Chimiak <jan.chimiak@gmail.com> + Vorapsak
// @version 1
// @note this version has been patched to allow the extension to work while anfit's server is unresponsive. There is no true support at the moment, so don't contact me or anfit about anything wrong with this version.
// @license Creative Commons Attribution + Noncommercial 3.0 Unported (CC BY-NC 3.0). If you want to use this in an commercial product, contact the author.
// @downloadURL https://update.greasyfork.org/scripts/5289/Anfit%27s%20GC%20Mods%20Patched%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/5289/Anfit%27s%20GC%20Mods%20Patched%20Edition.meta.js
// ==/UserScript==
/*
 * jQuery JavaScript Library v1.6.4
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Sep 12 18:54:48 2011 -0400
 */
(function (a7, K) {
    var ap = a7.document,
        bq = a7.navigator,
        bh = a7.location;
    var b = (function () {
        var bB = function (bX, bY) {
            return new bB.fn.init(bX, bY, bz);
        }, bR = a7.jQuery,
            bD = a7.$,
            bz, bV = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
            bJ = /\S/,
            bF = /^\s+/,
            bA = /\s+$/,
            bE = /\d/,
            bw = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
            bK = /^[\],:{}\s]*$/,
            bT = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
            bM = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            bG = /(?:^|:|,)(?:\s*\[)+/g,
            bu = /(webkit)[ \/]([\w.]+)/,
            bO = /(opera)(?:.*version)?[ \/]([\w.]+)/,
            bN = /(msie) ([\w.]+)/,
            bP = /(mozilla)(?:.*? rv:([\w.]+))?/,
            bx = /-([a-z]|[0-9])/ig,
            bW = /^-ms-/,
            bQ = function (bX, bY) {
                return (bY + "").toUpperCase();
            }, bU = bq.userAgent,
            bS, by, e, bI = Object.prototype.toString,
            bC = Object.prototype.hasOwnProperty,
            bv = Array.prototype.push,
            bH = Array.prototype.slice,
            bL = String.prototype.trim,
            br = Array.prototype.indexOf,
            bt = {};
        bB.fn = bB.prototype = {
            constructor: bB,
            init: function (bX, b1, b0) {
                var bZ, b2, bY, b3;
                if (!bX) {
                    return this;
                }
                if (bX.nodeType) {
                    this.context = this[0] = bX;
                    this.length = 1;
                    return this;
                }
                if (bX === "body" && !b1 && ap.body) {
                    this.context = ap;
                    this[0] = ap.body;
                    this.selector = bX;
                    this.length = 1;
                    return this;
                }
                if (typeof bX === "string") {
                    if (bX.charAt(0) === "<" && bX.charAt(bX.length - 1) === ">" && bX.length >= 3) {
                        bZ = [null, bX, null];
                    } else {
                        bZ = bV.exec(bX);
                    } if (bZ && (bZ[1] || !b1)) {
                        if (bZ[1]) {
                            b1 = b1 instanceof bB ? b1[0] : b1;
                            b3 = (b1 ? b1.ownerDocument || b1 : ap);
                            bY = bw.exec(bX);
                            if (bY) {
                                if (bB.isPlainObject(b1)) {
                                    bX = [ap.createElement(bY[1])];
                                    bB.fn.attr.call(bX, b1, true);
                                } else {
                                    bX = [b3.createElement(bY[1])];
                                }
                            } else {
                                bY = bB.buildFragment([bZ[1]], [b3]);
                                bX = (bY.cacheable ? bB.clone(bY.fragment) : bY.fragment).childNodes;
                            }
                            return bB.merge(this, bX);
                        } else {
                            b2 = ap.getElementById(bZ[2]);
                            if (b2 && b2.parentNode) {
                                if (b2.id !== bZ[2]) {
                                    return b0.find(bX);
                                }
                                this.length = 1;
                                this[0] = b2;
                            }
                            this.context = ap;
                            this.selector = bX;
                            return this;
                        }
                    } else {
                        if (!b1 || b1.jquery) {
                            return (b1 || b0).find(bX);
                        } else {
                            return this.constructor(b1).find(bX);
                        }
                    }
                } else {
                    if (bB.isFunction(bX)) {
                        return b0.ready(bX);
                    }
                } if (bX.selector !== K) {
                    this.selector = bX.selector;
                    this.context = bX.context;
                }
                return bB.makeArray(bX, this);
            },
            selector: "",
            jquery: "1.6.4",
            length: 0,
            size: function () {
                return this.length;
            },
            toArray: function () {
                return bH.call(this, 0);
            },
            get: function (bX) {
                return bX == null ? this.toArray() : (bX < 0 ? this[this.length + bX] : this[bX]);
            },
            pushStack: function (bY, b0, bX) {
                var bZ = this.constructor();
                if (bB.isArray(bY)) {
                    bv.apply(bZ, bY);
                } else {
                    bB.merge(bZ, bY);
                }
                bZ.prevObject = this;
                bZ.context = this.context;
                if (b0 === "find") {
                    bZ.selector = this.selector + (this.selector ? " " : "") + bX;
                } else {
                    if (b0) {
                        bZ.selector = this.selector + "." + b0 + "(" + bX + ")";
                    }
                }
                return bZ;
            },
            each: function (bY, bX) {
                return bB.each(this, bY, bX);
            },
            ready: function (bX) {
                bB.bindReady();
                by.done(bX);
                return this;
            },
            eq: function (bX) {
                return bX === -1 ? this.slice(bX) : this.slice(bX, +bX + 1);
            },
            first: function () {
                return this.eq(0);
            },
            last: function () {
                return this.eq(-1);
            },
            slice: function () {
                return this.pushStack(bH.apply(this, arguments), "slice", bH.call(arguments).join(","));
            },
            map: function (bX) {
                return this.pushStack(bB.map(this, function (bZ, bY) {
                    return bX.call(bZ, bY, bZ);
                }));
            },
            end: function () {
                return this.prevObject || this.constructor(null);
            },
            push: bv,
            sort: [].sort,
            splice: [].splice
        };
        bB.fn.init.prototype = bB.fn;
        bB.extend = bB.fn.extend = function () {
            var b6, bZ, bX, bY, b3, b4, b2 = arguments[0] || {}, b1 = 1,
                b0 = arguments.length,
                b5 = false;
            if (typeof b2 === "boolean") {
                b5 = b2;
                b2 = arguments[1] || {};
                b1 = 2;
            }
            if (typeof b2 !== "object" && !bB.isFunction(b2)) {
                b2 = {};
            }
            if (b0 === b1) {
                b2 = this;
                --b1;
            }
            for (; b1 < b0; b1++) {
                if ((b6 = arguments[b1]) != null) {
                    for (bZ in b6) {
                        bX = b2[bZ];
                        bY = b6[bZ];
                        if (b2 === bY) {
                            continue;
                        }
                        if (b5 && bY && (bB.isPlainObject(bY) || (b3 = bB.isArray(bY)))) {
                            if (b3) {
                                b3 = false;
                                b4 = bX && bB.isArray(bX) ? bX : [];
                            } else {
                                b4 = bX && bB.isPlainObject(bX) ? bX : {};
                            }
                            b2[bZ] = bB.extend(b5, b4, bY);
                        } else {
                            if (bY !== K) {
                                b2[bZ] = bY;
                            }
                        }
                    }
                }
            }
            return b2;
        };
        bB.extend({
            noConflict: function (bX) {
                if (a7.$ === bB) {
                    a7.$ = bD;
                }
                if (bX && a7.jQuery === bB) {
                    a7.jQuery = bR;
                }
                return bB;
            },
            isReady: false,
            readyWait: 1,
            holdReady: function (bX) {
                if (bX) {
                    bB.readyWait++;
                } else {
                    bB.ready(true);
                }
            },
            ready: function (bX) {
                if ((bX === true && !--bB.readyWait) || (bX !== true && !bB.isReady)) {
                    if (!ap.body) {
                        return setTimeout(bB.ready, 1);
                    }
                    bB.isReady = true;
                    if (bX !== true && --bB.readyWait > 0) {
                        return;
                    }
                    by.resolveWith(ap, [bB]);
                    if (bB.fn.trigger) {
                        bB(ap).trigger("ready").unbind("ready");
                    }
                }
            },
            bindReady: function () {
                if (by) {
                    return;
                }
                by = bB._Deferred();
                if (ap.readyState === "complete") {
                    return setTimeout(bB.ready, 1);
                }
                if (ap.addEventListener) {
                    ap.addEventListener("DOMContentLoaded", e, false);
                    a7.addEventListener("load", bB.ready, false);
                } else {
                    if (ap.attachEvent) {
                        ap.attachEvent("onreadystatechange", e);
                        a7.attachEvent("onload", bB.ready);
                        var bX = false;
                        try {
                            bX = a7.frameElement == null;
                        } catch (bY) {}
                        if (ap.documentElement.doScroll && bX) {
                            bs();
                        }
                    }
                }
            },
            isFunction: function (bX) {
                return bB.type(bX) === "function";
            },
            isArray: Array.isArray || function (bX) {
                return bB.type(bX) === "array";
            },
            isWindow: function (bX) {
                return bX && typeof bX === "object" && "setInterval" in bX;
            },
            isNaN: function (bX) {
                return bX == null || !bE.test(bX) || isNaN(bX);
            },
            type: function (bX) {
                return bX == null ? String(bX) : bt[bI.call(bX)] || "object";
            },
            isPlainObject: function (bZ) {
                if (!bZ || bB.type(bZ) !== "object" || bZ.nodeType || bB.isWindow(bZ)) {
                    return false;
                }
                try {
                    if (bZ.constructor && !bC.call(bZ, "constructor") && !bC.call(bZ.constructor.prototype, "isPrototypeOf")) {
                        return false;
                    }
                } catch (bY) {
                    return false;
                }
                var bX;
                for (bX in bZ) {}
                return bX === K || bC.call(bZ, bX);
            },
            isEmptyObject: function (bY) {
                for (var bX in bY) {
                    return false;
                }
                return true;
            },
            error: function (bX) {
                throw bX;
            },
            parseJSON: function (bX) {
                if (typeof bX !== "string" || !bX) {
                    return null;
                }
                bX = bB.trim(bX);
                if (a7.JSON && a7.JSON.parse) {
                    return a7.JSON.parse(bX);
                }
                if (bK.test(bX.replace(bT, "@").replace(bM, "]").replace(bG, ""))) {
                    return (new Function("return " + bX))();
                }
                bB.error("Invalid JSON: " + bX);
            },
            parseXML: function (bZ) {
                var bX, bY;
                try {
                    if (a7.DOMParser) {
                        bY = new DOMParser();
                        bX = bY.parseFromString(bZ, "text/xml");
                    } else {
                        bX = new ActiveXObject("Microsoft.XMLDOM");
                        bX.async = "false";
                        bX.loadXML(bZ);
                    }
                } catch (b0) {
                    bX = K;
                }
                if (!bX || !bX.documentElement || bX.getElementsByTagName("parsererror").length) {
                    bB.error("Invalid XML: " + bZ);
                }
                return bX;
            },
            noop: function () {},
            globalEval: function (bX) {
                if (bX && bJ.test(bX)) {
                    (a7.execScript || function (bY) {
                        a7["eval"].call(a7, bY);
                    })(bX);
                }
            },
            camelCase: function (bX) {
                return bX.replace(bW, "ms-").replace(bx, bQ);
            },
            nodeName: function (bY, bX) {
                return bY.nodeName && bY.nodeName.toUpperCase() === bX.toUpperCase();
            },
            each: function (b0, b3, bZ) {
                var bY, b1 = 0,
                    b2 = b0.length,
                    bX = b2 === K || bB.isFunction(b0);
                if (bZ) {
                    if (bX) {
                        for (bY in b0) {
                            if (b3.apply(b0[bY], bZ) === false) {
                                break;
                            }
                        }
                    } else {
                        for (; b1 < b2;) {
                            if (b3.apply(b0[b1++], bZ) === false) {
                                break;
                            }
                        }
                    }
                } else {
                    if (bX) {
                        for (bY in b0) {
                            if (b3.call(b0[bY], bY, b0[bY]) === false) {
                                break;
                            }
                        }
                    } else {
                        for (; b1 < b2;) {
                            if (b3.call(b0[b1], b1, b0[b1++]) === false) {
                                break;
                            }
                        }
                    }
                }
                return b0;
            },
            trim: bL ? function (bX) {
                return bX == null ? "" : bL.call(bX);
            } : function (bX) {
                return bX == null ? "" : bX.toString().replace(bF, "").replace(bA, "");
            },
            makeArray: function (b0, bY) {
                var bX = bY || [];
                if (b0 != null) {
                    var bZ = bB.type(b0);
                    if (b0.length == null || bZ === "string" || bZ === "function" || bZ === "regexp" || bB.isWindow(b0)) {
                        bv.call(bX, b0);
                    } else {
                        bB.merge(bX, b0);
                    }
                }
                return bX;
            },
            inArray: function (bZ, b0) {
                if (!b0) {
                    return -1;
                }
                if (br) {
                    return br.call(b0, bZ);
                }
                for (var bX = 0, bY = b0.length; bX < bY; bX++) {
                    if (b0[bX] === bZ) {
                        return bX;
                    }
                }
                return -1;
            },
            merge: function (b1, bZ) {
                var b0 = b1.length,
                    bY = 0;
                if (typeof bZ.length === "number") {
                    for (var bX = bZ.length; bY < bX; bY++) {
                        b1[b0++] = bZ[bY];
                    }
                } else {
                    while (bZ[bY] !== K) {
                        b1[b0++] = bZ[bY++];
                    }
                }
                b1.length = b0;
                return b1;
            },
            grep: function (bY, b3, bX) {
                var bZ = [],
                    b2;
                bX = !! bX;
                for (var b0 = 0, b1 = bY.length; b0 < b1; b0++) {
                    b2 = !! b3(bY[b0], b0);
                    if (bX !== b2) {
                        bZ.push(bY[b0]);
                    }
                }
                return bZ;
            },
            map: function (bX, b4, b5) {
                var b2, b3, b1 = [],
                    bZ = 0,
                    bY = bX.length,
                    b0 = bX instanceof bB || bY !== K && typeof bY === "number" && ((bY > 0 && bX[0] && bX[bY - 1]) || bY === 0 || bB.isArray(bX));
                if (b0) {
                    for (; bZ < bY; bZ++) {
                        b2 = b4(bX[bZ], bZ, b5);
                        if (b2 != null) {
                            b1[b1.length] = b2;
                        }
                    }
                } else {
                    for (b3 in bX) {
                        b2 = b4(bX[b3], b3, b5);
                        if (b2 != null) {
                            b1[b1.length] = b2;
                        }
                    }
                }
                return b1.concat.apply([], b1);
            },
            guid: 1,
            proxy: function (b1, b0) {
                if (typeof b0 === "string") {
                    var bZ = b1[b0];
                    b0 = b1;
                    b1 = bZ;
                }
                if (!bB.isFunction(b1)) {
                    return K;
                }
                var bX = bH.call(arguments, 2),
                    bY = function () {
                        return b1.apply(b0, bX.concat(bH.call(arguments)));
                    };
                bY.guid = b1.guid = b1.guid || bY.guid || bB.guid++;
                return bY;
            },
            access: function (bX, b5, b3, bZ, b2, b4) {
                var bY = bX.length;
                if (typeof b5 === "object") {
                    for (var b0 in b5) {
                        bB.access(bX, b0, b5[b0], bZ, b2, b3);
                    }
                    return bX;
                }
                if (b3 !== K) {
                    bZ = !b4 && bZ && bB.isFunction(b3);
                    for (var b1 = 0; b1 < bY; b1++) {
                        b2(bX[b1], b5, bZ ? b3.call(bX[b1], b1, b2(bX[b1], b5)) : b3, b4);
                    }
                    return bX;
                }
                return bY ? b2(bX[0], b5) : K;
            },
            now: function () {
                return (new Date()).getTime();
            },
            uaMatch: function (bY) {
                bY = bY.toLowerCase();
                var bX = bu.exec(bY) || bO.exec(bY) || bN.exec(bY) || bY.indexOf("compatible") < 0 && bP.exec(bY) || [];
                return {
                    browser: bX[1] || "",
                    version: bX[2] || "0"
                };
            },
            sub: function () {
                function bX(b0, b1) {
                    return new bX.fn.init(b0, b1);
                }
                bB.extend(true, bX, this);
                bX.superclass = this;
                bX.fn = bX.prototype = this();
                bX.fn.constructor = bX;
                bX.sub = this.sub;
                bX.fn.init = function bZ(b0, b1) {
                    if (b1 && b1 instanceof bB && !(b1 instanceof bX)) {
                        b1 = bX(b1);
                    }
                    return bB.fn.init.call(this, b0, b1, bY);
                };
                bX.fn.init.prototype = bX.fn;
                var bY = bX(ap);
                return bX;
            },
            browser: {}
        });
        bB.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (bY, bX) {
            bt["[object " + bX + "]"] = bX.toLowerCase();
        });
        bS = bB.uaMatch(bU);
        if (bS.browser) {
            bB.browser[bS.browser] = true;
            bB.browser.version = bS.version;
        }
        if (bB.browser.webkit) {
            bB.browser.safari = true;
        }
        if (bJ.test("\xA0")) {
            bF = /^[\s\xA0]+/;
            bA = /[\s\xA0]+$/;
        }
        bz = bB(ap);
        if (ap.addEventListener) {
            e = function () {
                ap.removeEventListener("DOMContentLoaded", e, false);
                bB.ready();
            };
        } else {
            if (ap.attachEvent) {
                e = function () {
                    if (ap.readyState === "complete") {
                        ap.detachEvent("onreadystatechange", e);
                        bB.ready();
                    }
                };
            }
        }

        function bs() {
            if (bB.isReady) {
                return;
            }
            try {
                ap.documentElement.doScroll("left");
            } catch (bX) {
                setTimeout(bs, 1);
                return;
            }
            bB.ready();
        }
        return bB;
    })();
    var a = "done fail isResolved isRejected promise then always pipe".split(" "),
        aE = [].slice;
    b.extend({
        _Deferred: function () {
            var bt = [],
                bu, br, bs, e = {
                    done: function () {
                        if (!bs) {
                            var bw = arguments,
                                bx, bA, bz, by, bv;
                            if (bu) {
                                bv = bu;
                                bu = 0;
                            }
                            for (bx = 0, bA = bw.length; bx < bA; bx++) {
                                bz = bw[bx];
                                by = b.type(bz);
                                if (by === "array") {
                                    e.done.apply(e, bz);
                                } else {
                                    if (by === "function") {
                                        bt.push(bz);
                                    }
                                }
                            }
                            if (bv) {
                                e.resolveWith(bv[0], bv[1]);
                            }
                        }
                        return this;
                    },
                    resolveWith: function (bw, bv) {
                        if (!bs && !bu && !br) {
                            bv = bv || [];
                            br = 1;
                            try {
                                while (bt[0]) {
                                    bt.shift().apply(bw, bv);
                                }
                            } finally {
                                bu = [bw, bv];
                                br = 0;
                            }
                        }
                        return this;
                    },
                    resolve: function () {
                        e.resolveWith(this, arguments);
                        return this;
                    },
                    isResolved: function () {
                        return !!(br || bu);
                    },
                    cancel: function () {
                        bs = 1;
                        bt = [];
                        return this;
                    }
                };
            return e;
        },
        Deferred: function (br) {
            var e = b._Deferred(),
                bt = b._Deferred(),
                bs;
            b.extend(e, {
                then: function (bv, bu) {
                    e.done(bv).fail(bu);
                    return this;
                },
                always: function () {
                    return e.done.apply(e, arguments).fail.apply(this, arguments);
                },
                fail: bt.done,
                rejectWith: bt.resolveWith,
                reject: bt.resolve,
                isRejected: bt.isResolved,
                pipe: function (bv, bu) {
                    return b.Deferred(function (bw) {
                        b.each({
                            done: [bv, "resolve"],
                            fail: [bu, "reject"]
                        }, function (by, bB) {
                            var bx = bB[0],
                                bA = bB[1],
                                bz;
                            if (b.isFunction(bx)) {
                                e[by](function () {
                                    bz = bx.apply(this, arguments);
                                    if (bz && b.isFunction(bz.promise)) {
                                        bz.promise().then(bw.resolve, bw.reject);
                                    } else {
                                        bw[bA + "With"](this === e ? bw : this, [bz]);
                                    }
                                });
                            } else {
                                e[by](bw[bA]);
                            }
                        });
                    }).promise();
                },
                promise: function (bv) {
                    if (bv == null) {
                        if (bs) {
                            return bs;
                        }
                        bs = bv = {};
                    }
                    var bu = a.length;
                    while (bu--) {
                        bv[a[bu]] = e[a[bu]];
                    }
                    return bv;
                }
            });
            e.done(bt.cancel).fail(e.cancel);
            delete e.cancel;
            if (br) {
                br.call(e, e);
            }
            return e;
        },
        when: function (bw) {
            var br = arguments,
                bs = 0,
                bv = br.length,
                bu = bv,
                e = bv <= 1 && bw && b.isFunction(bw.promise) ? bw : b.Deferred();

            function bt(bx) {
                return function (by) {
                    br[bx] = arguments.length > 1 ? aE.call(arguments, 0) : by;
                    if (!(--bu)) {
                        e.resolveWith(e, aE.call(br, 0));
                    }
                };
            }
            if (bv > 1) {
                for (; bs < bv; bs++) {
                    if (br[bs] && b.isFunction(br[bs].promise)) {
                        br[bs].promise().then(bt(bs), e.reject);
                    } else {
                        --bu;
                    }
                }
                if (!bu) {
                    e.resolveWith(e, br);
                }
            } else {
                if (e !== bw) {
                    e.resolveWith(e, bv ? [bw] : []);
                }
            }
            return e.promise();
        }
    });
    b.support = (function () {
        var bB = ap.createElement("div"),
            bI = ap.documentElement,
            bu, bJ, bC, bs, bA, bv, by, br, bz, bD, bx, bH, bF, bt, bw, bE, bK;
        bB.setAttribute("className", "t");
        bB.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
        bu = bB.getElementsByTagName("*");
        bJ = bB.getElementsByTagName("a")[0];
        if (!bu || !bu.length || !bJ) {
            return {};
        }
        bC = ap.createElement("select");
        bs = bC.appendChild(ap.createElement("option"));
        bA = bB.getElementsByTagName("input")[0];
        by = {
            leadingWhitespace: (bB.firstChild.nodeType === 3),
            tbody: !bB.getElementsByTagName("tbody").length,
            htmlSerialize: !! bB.getElementsByTagName("link").length,
            style: /top/.test(bJ.getAttribute("style")),
            hrefNormalized: (bJ.getAttribute("href") === "/a"),
            opacity: /^0.55$/.test(bJ.style.opacity),
            cssFloat: !! bJ.style.cssFloat,
            checkOn: (bA.value === "on"),
            optSelected: bs.selected,
            getSetAttribute: bB.className !== "t",
            submitBubbles: true,
            changeBubbles: true,
            focusinBubbles: false,
            deleteExpando: true,
            noCloneEvent: true,
            inlineBlockNeedsLayout: false,
            shrinkWrapBlocks: false,
            reliableMarginRight: true
        };
        bA.checked = true;
        by.noCloneChecked = bA.cloneNode(true).checked;
        bC.disabled = true;
        by.optDisabled = !bs.disabled;
        try {
            delete bB.test;
        } catch (bG) {
            by.deleteExpando = false;
        }
        if (!bB.addEventListener && bB.attachEvent && bB.fireEvent) {
            bB.attachEvent("onclick", function () {
                by.noCloneEvent = false;
            });
            bB.cloneNode(true).fireEvent("onclick");
        }
        bA = ap.createElement("input");
        bA.value = "t";
        bA.setAttribute("type", "radio");
        by.radioValue = bA.value === "t";
        bA.setAttribute("checked", "checked");
        bB.appendChild(bA);
        br = ap.createDocumentFragment();
        br.appendChild(bB.firstChild);
        by.checkClone = br.cloneNode(true).cloneNode(true).lastChild.checked;
        bB.innerHTML = "";
        bB.style.width = bB.style.paddingLeft = "1px";
        bz = ap.getElementsByTagName("body")[0];
        bx = ap.createElement(bz ? "div" : "body");
        bH = {
            visibility: "hidden",
            width: 0,
            height: 0,
            border: 0,
            margin: 0,
            background: "none"
        };
        if (bz) {
            b.extend(bH, {
                position: "absolute",
                left: "-1000px",
                top: "-1000px"
            });
        }
        for (bE in bH) {
            bx.style[bE] = bH[bE];
        }
        bx.appendChild(bB);
        bD = bz || bI;
        bD.insertBefore(bx, bD.firstChild);
        by.appendChecked = bA.checked;
        by.boxModel = bB.offsetWidth === 2;
        if ("zoom" in bB.style) {
            bB.style.display = "inline";
            bB.style.zoom = 1;
            by.inlineBlockNeedsLayout = (bB.offsetWidth === 2);
            bB.style.display = "";
            bB.innerHTML = "<div style='width:4px;'></div>";
            by.shrinkWrapBlocks = (bB.offsetWidth !== 2);
        }
        bB.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
        bF = bB.getElementsByTagName("td");
        bK = (bF[0].offsetHeight === 0);
        bF[0].style.display = "";
        bF[1].style.display = "none";
        by.reliableHiddenOffsets = bK && (bF[0].offsetHeight === 0);
        bB.innerHTML = "";
        if (ap.defaultView && ap.defaultView.getComputedStyle) {
            bv = ap.createElement("div");
            bv.style.width = "0";
            bv.style.marginRight = "0";
            bB.appendChild(bv);
            by.reliableMarginRight = (parseInt((ap.defaultView.getComputedStyle(bv, null) || {
                marginRight: 0
            }).marginRight, 10) || 0) === 0;
        }
        bx.innerHTML = "";
        bD.removeChild(bx);
        if (bB.attachEvent) {
            for (bE in {
                submit: 1,
                change: 1,
                focusin: 1
            }) {
                bw = "on" + bE;
                bK = (bw in bB);
                if (!bK) {
                    bB.setAttribute(bw, "return;");
                    bK = (typeof bB[bw] === "function");
                }
                by[bE + "Bubbles"] = bK;
            }
        }
        bx = br = bC = bs = bz = bv = bB = bA = null;
        return by;
    })();
    b.boxModel = b.support.boxModel;
    var aL = /^(?:\{.*\}|\[.*\])$/,
        av = /([A-Z])/g;
    b.extend({
        cache: {},
        uuid: 0,
        expando: "jQuery" + (b.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {
            "embed": true,
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            "applet": true
        },
        hasData: function (e) {
            e = e.nodeType ? b.cache[e[b.expando]] : e[b.expando];
            return !!e && !S(e);
        },
        data: function (bt, br, bv, bu) {
            if (!b.acceptData(bt)) {
                return;
            }
            var bw, by, bz = b.expando,
                bx = typeof br === "string",
                bA = bt.nodeType,
                e = bA ? b.cache : bt,
                bs = bA ? bt[b.expando] : bt[b.expando] && b.expando;
            if ((!bs || (bu && bs && (e[bs] && !e[bs][bz]))) && bx && bv === K) {
                return;
            }
            if (!bs) {
                if (bA) {
                    bt[b.expando] = bs = ++b.uuid;
                } else {
                    bs = b.expando;
                }
            }
            if (!e[bs]) {
                e[bs] = {};
                if (!bA) {
                    e[bs].toJSON = b.noop;
                }
            }
            if (typeof br === "object" || typeof br === "function") {
                if (bu) {
                    e[bs][bz] = b.extend(e[bs][bz], br);
                } else {
                    e[bs] = b.extend(e[bs], br);
                }
            }
            bw = e[bs];
            if (bu) {
                if (!bw[bz]) {
                    bw[bz] = {};
                }
                bw = bw[bz];
            }
            if (bv !== K) {
                bw[b.camelCase(br)] = bv;
            }
            if (br === "events" && !bw[br]) {
                return bw[bz] && bw[bz].events;
            }
            if (bx) {
                by = bw[br];
                if (by == null) {
                    by = bw[b.camelCase(br)];
                }
            } else {
                by = bw;
            }
            return by;
        },
        removeData: function (bu, bs, bv) {
            if (!b.acceptData(bu)) {
                return;
            }
            var bw, bx = b.expando,
                by = bu.nodeType,
                br = by ? b.cache : bu,
                bt = by ? bu[b.expando] : b.expando;
            if (!br[bt]) {
                return;
            }
            if (bs) {
                bw = bv ? br[bt][bx] : br[bt];
                if (bw) {
                    if (!bw[bs]) {
                        bs = b.camelCase(bs);
                    }
                    delete bw[bs];
                    if (!S(bw)) {
                        return;
                    }
                }
            }
            if (bv) {
                delete br[bt][bx];
                if (!S(br[bt])) {
                    return;
                }
            }
            var e = br[bt][bx];
            if (b.support.deleteExpando || !br.setInterval) {
                delete br[bt];
            } else {
                br[bt] = null;
            } if (e) {
                br[bt] = {};
                if (!by) {
                    br[bt].toJSON = b.noop;
                }
                br[bt][bx] = e;
            } else {
                if (by) {
                    if (b.support.deleteExpando) {
                        delete bu[b.expando];
                    } else {
                        if (bu.removeAttribute) {
                            bu.removeAttribute(b.expando);
                        } else {
                            bu[b.expando] = null;
                        }
                    }
                }
            }
        },
        _data: function (br, e, bs) {
            return b.data(br, e, bs, true);
        },
        acceptData: function (br) {
            if (br.nodeName) {
                var e = b.noData[br.nodeName.toLowerCase()];
                if (e) {
                    return !(e === true || br.getAttribute("classid") !== e);
                }
            }
            return true;
        }
    });
    b.fn.extend({
        data: function (bu, bw) {
            var bv = null;
            if (typeof bu === "undefined") {
                if (this.length) {
                    bv = b.data(this[0]);
                    if (this[0].nodeType === 1) {
                        var e = this[0].attributes,
                            bs;
                        for (var bt = 0, br = e.length; bt < br; bt++) {
                            bs = e[bt].name;
                            if (bs.indexOf("data-") === 0) {
                                bs = b.camelCase(bs.substring(5));
                                a1(this[0], bs, bv[bs]);
                            }
                        }
                    }
                }
                return bv;
            } else {
                if (typeof bu === "object") {
                    return this.each(function () {
                        b.data(this, bu);
                    });
                }
            }
            var bx = bu.split(".");
            bx[1] = bx[1] ? "." + bx[1] : "";
            if (bw === K) {
                bv = this.triggerHandler("getData" + bx[1] + "!", [bx[0]]);
                if (bv === K && this.length) {
                    bv = b.data(this[0], bu);
                    bv = a1(this[0], bu, bv);
                }
                return bv === K && bx[1] ? this.data(bx[0]) : bv;
            } else {
                return this.each(function () {
                    var bz = b(this),
                        by = [bx[0], bw];
                    bz.triggerHandler("setData" + bx[1] + "!", by);
                    b.data(this, bu, bw);
                    bz.triggerHandler("changeData" + bx[1] + "!", by);
                });
            }
        },
        removeData: function (e) {
            return this.each(function () {
                b.removeData(this, e);
            });
        }
    });

    function a1(bt, bs, bu) {
        if (bu === K && bt.nodeType === 1) {
            var br = "data-" + bs.replace(av, "-$1").toLowerCase();
            bu = bt.getAttribute(br);
            if (typeof bu === "string") {
                try {
                    bu = bu === "true" ? true : bu === "false" ? false : bu === "null" ? null : !b.isNaN(bu) ? parseFloat(bu) : aL.test(bu) ? b.parseJSON(bu) : bu;
                } catch (bv) {}
                b.data(bt, bs, bu);
            } else {
                bu = K;
            }
        }
        return bu;
    }

    function S(br) {
        for (var e in br) {
            if (e !== "toJSON") {
                return false;
            }
        }
        return true;
    }

    function bd(bu, bt, bw) {
        var bs = bt + "defer",
            br = bt + "queue",
            e = bt + "mark",
            bv = b.data(bu, bs, K, true);
        if (bv && (bw === "queue" || !b.data(bu, br, K, true)) && (bw === "mark" || !b.data(bu, e, K, true))) {
            setTimeout(function () {
                if (!b.data(bu, br, K, true) && !b.data(bu, e, K, true)) {
                    b.removeData(bu, bs, true);
                    bv.resolve();
                }
            }, 0);
        }
    }
    b.extend({
        _mark: function (br, e) {
            if (br) {
                e = (e || "fx") + "mark";
                b.data(br, e, (b.data(br, e, K, true) || 0) + 1, true);
            }
        },
        _unmark: function (bu, bt, br) {
            if (bu !== true) {
                br = bt;
                bt = bu;
                bu = false;
            }
            if (bt) {
                br = br || "fx";
                var e = br + "mark",
                    bs = bu ? 0 : ((b.data(bt, e, K, true) || 1) - 1);
                if (bs) {
                    b.data(bt, e, bs, true);
                } else {
                    b.removeData(bt, e, true);
                    bd(bt, br, "mark");
                }
            }
        },
        queue: function (br, e, bt) {
            if (br) {
                e = (e || "fx") + "queue";
                var bs = b.data(br, e, K, true);
                if (bt) {
                    if (!bs || b.isArray(bt)) {
                        bs = b.data(br, e, b.makeArray(bt), true);
                    } else {
                        bs.push(bt);
                    }
                }
                return bs || [];
            }
        },
        dequeue: function (bt, bs) {
            bs = bs || "fx";
            var e = b.queue(bt, bs),
                br = e.shift(),
                bu;
            if (br === "inprogress") {
                br = e.shift();
            }
            if (br) {
                if (bs === "fx") {
                    e.unshift("inprogress");
                }
                br.call(bt, function () {
                    b.dequeue(bt, bs);
                });
            }
            if (!e.length) {
                b.removeData(bt, bs + "queue", true);
                bd(bt, bs, "queue");
            }
        }
    });
    b.fn.extend({
        queue: function (e, br) {
            if (typeof e !== "string") {
                br = e;
                e = "fx";
            }
            if (br === K) {
                return b.queue(this[0], e);
            }
            return this.each(function () {
                var bs = b.queue(this, e, br);
                if (e === "fx" && bs[0] !== "inprogress") {
                    b.dequeue(this, e);
                }
            });
        },
        dequeue: function (e) {
            return this.each(function () {
                b.dequeue(this, e);
            });
        },
        delay: function (br, e) {
            br = b.fx ? b.fx.speeds[br] || br : br;
            e = e || "fx";
            return this.queue(e, function () {
                var bs = this;
                setTimeout(function () {
                    b.dequeue(bs, e);
                }, br);
            });
        },
        clearQueue: function (e) {
            return this.queue(e || "fx", []);
        },
        promise: function (bz, bs) {
            if (typeof bz !== "string") {
                bs = bz;
                bz = K;
            }
            bz = bz || "fx";
            var e = b.Deferred(),
                br = this,
                bu = br.length,
                bx = 1,
                bv = bz + "defer",
                bw = bz + "queue",
                by = bz + "mark",
                bt;

            function bA() {
                if (!(--bx)) {
                    e.resolveWith(br, [br]);
                }
            }
            while (bu--) {
                if ((bt = b.data(br[bu], bv, K, true) || (b.data(br[bu], bw, K, true) || b.data(br[bu], by, K, true)) && b.data(br[bu], bv, b._Deferred(), true))) {
                    bx++;
                    bt.done(bA);
                }
            }
            bA();
            return e.promise();
        }
    });
    var aJ = /[\n\t\r]/g,
        ab = /\s+/,
        aN = /\r/g,
        g = /^(?:button|input)$/i,
        D = /^(?:button|input|object|select|textarea)$/i,
        l = /^a(?:rea)?$/i,
        aj = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        ba, aU;
    b.fn.extend({
        attr: function (e, br) {
            return b.access(this, e, br, true, b.attr);
        },
        removeAttr: function (e) {
            return this.each(function () {
                b.removeAttr(this, e);
            });
        },
        prop: function (e, br) {
            return b.access(this, e, br, true, b.prop);
        },
        removeProp: function (e) {
            e = b.propFix[e] || e;
            return this.each(function () {
                try {
                    this[e] = K;
                    delete this[e];
                } catch (br) {}
            });
        },
        addClass: function (bu) {
            var bw, bs, br, bt, bv, bx, e;
            if (b.isFunction(bu)) {
                return this.each(function (by) {
                    b(this).addClass(bu.call(this, by, this.className));
                });
            }
            if (bu && typeof bu === "string") {
                bw = bu.split(ab);
                for (bs = 0, br = this.length; bs < br; bs++) {
                    bt = this[bs];
                    if (bt.nodeType === 1) {
                        if (!bt.className && bw.length === 1) {
                            bt.className = bu;
                        } else {
                            bv = " " + bt.className + " ";
                            for (bx = 0, e = bw.length; bx < e; bx++) {
                                if (!~bv.indexOf(" " + bw[bx] + " ")) {
                                    bv += bw[bx] + " ";
                                }
                            }
                            bt.className = b.trim(bv);
                        }
                    }
                }
            }
            return this;
        },
        removeClass: function (bv) {
            var bw, bs, br, bu, bt, bx, e;
            if (b.isFunction(bv)) {
                return this.each(function (by) {
                    b(this).removeClass(bv.call(this, by, this.className));
                });
            }
            if ((bv && typeof bv === "string") || bv === K) {
                bw = (bv || "").split(ab);
                for (bs = 0, br = this.length; bs < br; bs++) {
                    bu = this[bs];
                    if (bu.nodeType === 1 && bu.className) {
                        if (bv) {
                            bt = (" " + bu.className + " ").replace(aJ, " ");
                            for (bx = 0, e = bw.length; bx < e; bx++) {
                                bt = bt.replace(" " + bw[bx] + " ", " ");
                            }
                            bu.className = b.trim(bt);
                        } else {
                            bu.className = "";
                        }
                    }
                }
            }
            return this;
        },
        toggleClass: function (bt, br) {
            var bs = typeof bt,
                e = typeof br === "boolean";
            if (b.isFunction(bt)) {
                return this.each(function (bu) {
                    b(this).toggleClass(bt.call(this, bu, this.className, br), br);
                });
            }
            return this.each(function () {
                if (bs === "string") {
                    var bw, bv = 0,
                        bu = b(this),
                        bx = br,
                        by = bt.split(ab);
                    while ((bw = by[bv++])) {
                        bx = e ? bx : !bu.hasClass(bw);
                        bu[bx ? "addClass" : "removeClass"](bw);
                    }
                } else {
                    if (bs === "undefined" || bs === "boolean") {
                        if (this.className) {
                            b._data(this, "__className__", this.className);
                        }
                        this.className = this.className || bt === false ? "" : b._data(this, "__className__") || "";
                    }
                }
            });
        },
        hasClass: function (e) {
            var bt = " " + e + " ";
            for (var bs = 0, br = this.length; bs < br; bs++) {
                if (this[bs].nodeType === 1 && (" " + this[bs].className + " ").replace(aJ, " ").indexOf(bt) > -1) {
                    return true;
                }
            }
            return false;
        },
        val: function (bt) {
            var e, br, bs = this[0];
            if (!arguments.length) {
                if (bs) {
                    e = b.valHooks[bs.nodeName.toLowerCase()] || b.valHooks[bs.type];
                    if (e && "get" in e && (br = e.get(bs, "value")) !== K) {
                        return br;
                    }
                    br = bs.value;
                    return typeof br === "string" ? br.replace(aN, "") : br == null ? "" : br;
                }
                return K;
            }
            var bu = b.isFunction(bt);
            return this.each(function (bw) {
                var bv = b(this),
                    bx;
                if (this.nodeType !== 1) {
                    return;
                }
                if (bu) {
                    bx = bt.call(this, bw, bv.val());
                } else {
                    bx = bt;
                } if (bx == null) {
                    bx = "";
                } else {
                    if (typeof bx === "number") {
                        bx += "";
                    } else {
                        if (b.isArray(bx)) {
                            bx = b.map(bx, function (by) {
                                return by == null ? "" : by + "";
                            });
                        }
                    }
                }
                e = b.valHooks[this.nodeName.toLowerCase()] || b.valHooks[this.type];
                if (!e || !("set" in e) || e.set(this, bx, "value") === K) {
                    this.value = bx;
                }
            });
        }
    });
    b.extend({
        valHooks: {
            option: {
                get: function (e) {
                    var br = e.attributes.value;
                    return !br || br.specified ? e.value : e.text;
                }
            },
            select: {
                get: function (e) {
                    var bw, bu = e.selectedIndex,
                        bx = [],
                        by = e.options,
                        bt = e.type === "select-one";
                    if (bu < 0) {
                        return null;
                    }
                    for (var br = bt ? bu : 0, bv = bt ? bu + 1 : by.length; br < bv; br++) {
                        var bs = by[br];
                        if (bs.selected && (b.support.optDisabled ? !bs.disabled : bs.getAttribute("disabled") === null) && (!bs.parentNode.disabled || !b.nodeName(bs.parentNode, "optgroup"))) {
                            bw = b(bs).val();
                            if (bt) {
                                return bw;
                            }
                            bx.push(bw);
                        }
                    }
                    if (bt && !bx.length && by.length) {
                        return b(by[bu]).val();
                    }
                    return bx;
                },
                set: function (br, bs) {
                    var e = b.makeArray(bs);
                    b(br).find("option").each(function () {
                        this.selected = b.inArray(b(this).val(), e) >= 0;
                    });
                    if (!e.length) {
                        br.selectedIndex = -1;
                    }
                    return e;
                }
            }
        },
        attrFn: {
            val: true,
            css: true,
            html: true,
            text: true,
            data: true,
            width: true,
            height: true,
            offset: true
        },
        attrFix: {
            tabindex: "tabIndex"
        },
        attr: function (bw, bt, bx, bv) {
            var br = bw.nodeType;
            if (!bw || br === 3 || br === 8 || br === 2) {
                return K;
            }
            if (bv && bt in b.attrFn) {
                return b(bw)[bt](bx);
            }
            if (!("getAttribute" in bw)) {
                return b.prop(bw, bt, bx);
            }
            var bs, e, bu = br !== 1 || !b.isXMLDoc(bw);
            if (bu) {
                bt = b.attrFix[bt] || bt;
                e = b.attrHooks[bt];
                if (!e) {
                    if (aj.test(bt)) {
                        e = aU;
                    } else {
                        if (ba) {
                            e = ba;
                        }
                    }
                }
            }
            if (bx !== K) {
                if (bx === null) {
                    b.removeAttr(bw, bt);
                    return K;
                } else {
                    if (e && "set" in e && bu && (bs = e.set(bw, bx, bt)) !== K) {
                        return bs;
                    } else {
                        bw.setAttribute(bt, "" + bx);
                        return bx;
                    }
                }
            } else {
                if (e && "get" in e && bu && (bs = e.get(bw, bt)) !== null) {
                    return bs;
                } else {
                    bs = bw.getAttribute(bt);
                    return bs === null ? K : bs;
                }
            }
        },
        removeAttr: function (br, e) {
            var bs;
            if (br.nodeType === 1) {
                e = b.attrFix[e] || e;
                b.attr(br, e, "");
                br.removeAttribute(e);
                if (aj.test(e) && (bs = b.propFix[e] || e) in br) {
                    br[bs] = false;
                }
            }
        },
        attrHooks: {
            type: {
                set: function (e, br) {
                    if (g.test(e.nodeName) && e.parentNode) {
                        b.error("type property can't be changed");
                    } else {
                        if (!b.support.radioValue && br === "radio" && b.nodeName(e, "input")) {
                            var bs = e.value;
                            e.setAttribute("type", br);
                            if (bs) {
                                e.value = bs;
                            }
                            return br;
                        }
                    }
                }
            },
            value: {
                get: function (br, e) {
                    if (ba && b.nodeName(br, "button")) {
                        return ba.get(br, e);
                    }
                    return e in br ? br.value : null;
                },
                set: function (br, bs, e) {
                    if (ba && b.nodeName(br, "button")) {
                        return ba.set(br, bs, e);
                    }
                    br.value = bs;
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function (bv, bt, bw) {
            var br = bv.nodeType;
            if (!bv || br === 3 || br === 8 || br === 2) {
                return K;
            }
            var bs, e, bu = br !== 1 || !b.isXMLDoc(bv);
            if (bu) {
                bt = b.propFix[bt] || bt;
                e = b.propHooks[bt];
            }
            if (bw !== K) {
                if (e && "set" in e && (bs = e.set(bv, bw, bt)) !== K) {
                    return bs;
                } else {
                    return (bv[bt] = bw);
                }
            } else {
                if (e && "get" in e && (bs = e.get(bv, bt)) !== null) {
                    return bs;
                } else {
                    return bv[bt];
                }
            }
        },
        propHooks: {
            tabIndex: {
                get: function (br) {
                    var e = br.getAttributeNode("tabindex");
                    return e && e.specified ? parseInt(e.value, 10) : D.test(br.nodeName) || l.test(br.nodeName) && br.href ? 0 : K;
                }
            }
        }
    });
    b.attrHooks.tabIndex = b.propHooks.tabIndex;
    aU = {
        get: function (br, e) {
            var bs;
            return b.prop(br, e) === true || (bs = br.getAttributeNode(e)) && bs.nodeValue !== false ? e.toLowerCase() : K;
        },
        set: function (br, bt, e) {
            var bs;
            if (bt === false) {
                b.removeAttr(br, e);
            } else {
                bs = b.propFix[e] || e;
                if (bs in br) {
                    br[bs] = true;
                }
                br.setAttribute(e, e.toLowerCase());
            }
            return e;
        }
    };
    if (!b.support.getSetAttribute) {
        ba = b.valHooks.button = {
            get: function (bs, br) {
                var e;
                e = bs.getAttributeNode(br);
                return e && e.nodeValue !== "" ? e.nodeValue : K;
            },
            set: function (bs, bt, br) {
                var e = bs.getAttributeNode(br);
                if (!e) {
                    e = ap.createAttribute(br);
                    bs.setAttributeNode(e);
                }
                return (e.nodeValue = bt + "");
            }
        };
        b.each(["width", "height"], function (br, e) {
            b.attrHooks[e] = b.extend(b.attrHooks[e], {
                set: function (bs, bt) {
                    if (bt === "") {
                        bs.setAttribute(e, "auto");
                        return bt;
                    }
                }
            });
        });
    }
    if (!b.support.hrefNormalized) {
        b.each(["href", "src", "width", "height"], function (br, e) {
            b.attrHooks[e] = b.extend(b.attrHooks[e], {
                get: function (bt) {
                    var bs = bt.getAttribute(e, 2);
                    return bs === null ? K : bs;
                }
            });
        });
    }
    if (!b.support.style) {
        b.attrHooks.style = {
            get: function (e) {
                return e.style.cssText.toLowerCase() || K;
            },
            set: function (e, br) {
                return (e.style.cssText = "" + br);
            }
        };
    }
    if (!b.support.optSelected) {
        b.propHooks.selected = b.extend(b.propHooks.selected, {
            get: function (br) {
                var e = br.parentNode;
                if (e) {
                    e.selectedIndex;
                    if (e.parentNode) {
                        e.parentNode.selectedIndex;
                    }
                }
                return null;
            }
        });
    }
    if (!b.support.checkOn) {
        b.each(["radio", "checkbox"], function () {
            b.valHooks[this] = {
                get: function (e) {
                    return e.getAttribute("value") === null ? "on" : e.value;
                }
            };
        });
    }
    b.each(["radio", "checkbox"], function () {
        b.valHooks[this] = b.extend(b.valHooks[this], {
            set: function (e, br) {
                if (b.isArray(br)) {
                    return (e.checked = b.inArray(b(e).val(), br) >= 0);
                }
            }
        });
    });
    var aW = /\.(.*)$/,
        a9 = /^(?:textarea|input|select)$/i,
        N = /\./g,
        be = / /g,
        aB = /[^\w\s.|`]/g,
        G = function (e) {
            return e.replace(aB, "\\$&");
        };
    b.event = {
        add: function (bt, bx, bC, bv) {
            if (bt.nodeType === 3 || bt.nodeType === 8) {
                return;
            }
            if (bC === false) {
                bC = bg;
            } else {
                if (!bC) {
                    return;
                }
            }
            var br, bB;
            if (bC.handler) {
                br = bC;
                bC = br.handler;
            }
            if (!bC.guid) {
                bC.guid = b.guid++;
            }
            var by = b._data(bt);
            if (!by) {
                return;
            }
            var bD = by.events,
                bw = by.handle;
            if (!bD) {
                by.events = bD = {};
            }
            if (!bw) {
                by.handle = bw = function (bE) {
                    return typeof b !== "undefined" && (!bE || b.event.triggered !== bE.type) ? b.event.handle.apply(bw.elem, arguments) : K;
                };
            }
            bw.elem = bt;
            bx = bx.split(" ");
            var bA, bu = 0,
                e;
            while ((bA = bx[bu++])) {
                bB = br ? b.extend({}, br) : {
                    handler: bC,
                    data: bv
                };
                if (bA.indexOf(".") > -1) {
                    e = bA.split(".");
                    bA = e.shift();
                    bB.namespace = e.slice(0).sort().join(".");
                } else {
                    e = [];
                    bB.namespace = "";
                }
                bB.type = bA;
                if (!bB.guid) {
                    bB.guid = bC.guid;
                }
                var bs = bD[bA],
                    bz = b.event.special[bA] || {};
                if (!bs) {
                    bs = bD[bA] = [];
                    if (!bz.setup || bz.setup.call(bt, bv, e, bw) === false) {
                        if (bt.addEventListener) {
                            bt.addEventListener(bA, bw, false);
                        } else {
                            if (bt.attachEvent) {
                                bt.attachEvent("on" + bA, bw);
                            }
                        }
                    }
                }
                if (bz.add) {
                    bz.add.call(bt, bB);
                    if (!bB.handler.guid) {
                        bB.handler.guid = bC.guid;
                    }
                }
                bs.push(bB);
                b.event.global[bA] = true;
            }
            bt = null;
        },
        global: {},
        remove: function (bF, bA, bs, bw) {
            if (bF.nodeType === 3 || bF.nodeType === 8) {
                return;
            }
            if (bs === false) {
                bs = bg;
            }
            var bI, bv, bx, bC, bD = 0,
                bt, by, bB, bu, bz, e, bH, bE = b.hasData(bF) && b._data(bF),
                br = bE && bE.events;
            if (!bE || !br) {
                return;
            }
            if (bA && bA.type) {
                bs = bA.handler;
                bA = bA.type;
            }
            if (!bA || typeof bA === "string" && bA.charAt(0) === ".") {
                bA = bA || "";
                for (bv in br) {
                    b.event.remove(bF, bv + bA);
                }
                return;
            }
            bA = bA.split(" ");
            while ((bv = bA[bD++])) {
                bH = bv;
                e = null;
                bt = bv.indexOf(".") < 0;
                by = [];
                if (!bt) {
                    by = bv.split(".");
                    bv = by.shift();
                    bB = new RegExp("(^|\\.)" + b.map(by.slice(0).sort(), G).join("\\.(?:.*\\.)?") + "(\\.|$)");
                }
                bz = br[bv];
                if (!bz) {
                    continue;
                }
                if (!bs) {
                    for (bC = 0; bC < bz.length; bC++) {
                        e = bz[bC];
                        if (bt || bB.test(e.namespace)) {
                            b.event.remove(bF, bH, e.handler, bC);
                            bz.splice(bC--, 1);
                        }
                    }
                    continue;
                }
                bu = b.event.special[bv] || {};
                for (bC = bw || 0; bC < bz.length; bC++) {
                    e = bz[bC];
                    if (bs.guid === e.guid) {
                        if (bt || bB.test(e.namespace)) {
                            if (bw == null) {
                                bz.splice(bC--, 1);
                            }
                            if (bu.remove) {
                                bu.remove.call(bF, e);
                            }
                        }
                        if (bw != null) {
                            break;
                        }
                    }
                }
                if (bz.length === 0 || bw != null && bz.length === 1) {
                    if (!bu.teardown || bu.teardown.call(bF, by) === false) {
                        b.removeEvent(bF, bv, bE.handle);
                    }
                    bI = null;
                    delete br[bv];
                }
            }
            if (b.isEmptyObject(br)) {
                var bG = bE.handle;
                if (bG) {
                    bG.elem = null;
                }
                delete bE.events;
                delete bE.handle;
                if (b.isEmptyObject(bE)) {
                    b.removeData(bF, K, true);
                }
            }
        },
        customEvent: {
            "getData": true,
            "setData": true,
            "changeData": true
        },
        trigger: function (e, bx, bv, bC) {
            var bA = e.type || e,
                bs = [],
                br;
            if (bA.indexOf("!") >= 0) {
                bA = bA.slice(0, -1);
                br = true;
            }
            if (bA.indexOf(".") >= 0) {
                bs = bA.split(".");
                bA = bs.shift();
                bs.sort();
            }
            if ((!bv || b.event.customEvent[bA]) && !b.event.global[bA]) {
                return;
            }
            e = typeof e === "object" ? e[b.expando] ? e : new b.Event(bA, e) : new b.Event(bA);
            e.type = bA;
            e.exclusive = br;
            e.namespace = bs.join(".");
            e.namespace_re = new RegExp("(^|\\.)" + bs.join("\\.(?:.*\\.)?") + "(\\.|$)");
            if (bC || !bv) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (!bv) {
                b.each(b.cache, function () {
                    var bE = b.expando,
                        bD = this[bE];
                    if (bD && bD.events && bD.events[bA]) {
                        b.event.trigger(e, bx, bD.handle.elem);
                    }
                });
                return;
            }
            if (bv.nodeType === 3 || bv.nodeType === 8) {
                return;
            }
            e.result = K;
            e.target = bv;
            bx = bx != null ? b.makeArray(bx) : [];
            bx.unshift(e);
            var bB = bv,
                bt = bA.indexOf(":") < 0 ? "on" + bA : "";
            do {
                var by = b._data(bB, "handle");
                e.currentTarget = bB;
                if (by) {
                    by.apply(bB, bx);
                }
                if (bt && b.acceptData(bB) && bB[bt] && bB[bt].apply(bB, bx) === false) {
                    e.result = false;
                    e.preventDefault();
                }
                bB = bB.parentNode || bB.ownerDocument || bB === e.target.ownerDocument && a7;
            } while (bB && !e.isPropagationStopped());
            if (!e.isDefaultPrevented()) {
                var bu, bz = b.event.special[bA] || {};
                if ((!bz._default || bz._default.call(bv.ownerDocument, e) === false) && !(bA === "click" && b.nodeName(bv, "a")) && b.acceptData(bv)) {
                    try {
                        if (bt && bv[bA]) {
                            bu = bv[bt];
                            if (bu) {
                                bv[bt] = null;
                            }
                            b.event.triggered = bA;
                            bv[bA]();
                        }
                    } catch (bw) {}
                    if (bu) {
                        bv[bt] = bu;
                    }
                    b.event.triggered = K;
                }
            }
            return e.result;
        },
        handle: function (bx) {
            bx = b.event.fix(bx || a7.event);
            var br = ((b._data(this, "events") || {})[bx.type] || []).slice(0),
                bw = !bx.exclusive && !bx.namespace,
                bu = Array.prototype.slice.call(arguments, 0);
            bu[0] = bx;
            bx.currentTarget = this;
            for (var bt = 0, e = br.length; bt < e; bt++) {
                var bv = br[bt];
                if (bw || bx.namespace_re.test(bv.namespace)) {
                    bx.handler = bv.handler;
                    bx.data = bv.data;
                    bx.handleObj = bv;
                    var bs = bv.handler.apply(this, bu);
                    if (bs !== K) {
                        bx.result = bs;
                        if (bs === false) {
                            bx.preventDefault();
                            bx.stopPropagation();
                        }
                    }
                    if (bx.isImmediatePropagationStopped()) {
                        break;
                    }
                }
            }
            return bx.result;
        },
        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
        fix: function (bu) {
            if (bu[b.expando]) {
                return bu;
            }
            var br = bu;
            bu = b.Event(br);
            for (var bs = this.props.length, bw; bs;) {
                bw = this.props[--bs];
                bu[bw] = br[bw];
            }
            if (!bu.target) {
                bu.target = bu.srcElement || ap;
            }
            if (bu.target.nodeType === 3) {
                bu.target = bu.target.parentNode;
            }
            if (!bu.relatedTarget && bu.fromElement) {
                bu.relatedTarget = bu.fromElement === bu.target ? bu.toElement : bu.fromElement;
            }
            if (bu.pageX == null && bu.clientX != null) {
                var bt = bu.target.ownerDocument || ap,
                    bv = bt.documentElement,
                    e = bt.body;
                bu.pageX = bu.clientX + (bv && bv.scrollLeft || e && e.scrollLeft || 0) - (bv && bv.clientLeft || e && e.clientLeft || 0);
                bu.pageY = bu.clientY + (bv && bv.scrollTop || e && e.scrollTop || 0) - (bv && bv.clientTop || e && e.clientTop || 0);
            }
            if (bu.which == null && (bu.charCode != null || bu.keyCode != null)) {
                bu.which = bu.charCode != null ? bu.charCode : bu.keyCode;
            }
            if (!bu.metaKey && bu.ctrlKey) {
                bu.metaKey = bu.ctrlKey;
            }
            if (!bu.which && bu.button !== K) {
                bu.which = (bu.button & 1 ? 1 : (bu.button & 2 ? 3 : (bu.button & 4 ? 2 : 0)));
            }
            return bu;
        },
        guid: 100000000,
        proxy: b.proxy,
        special: {
            ready: {
                setup: b.bindReady,
                teardown: b.noop
            },
            live: {
                add: function (e) {
                    b.event.add(this, p(e.origType, e.selector), b.extend({}, e, {
                        handler: ag,
                        guid: e.handler.guid
                    }));
                },
                remove: function (e) {
                    b.event.remove(this, p(e.origType, e.selector), e);
                }
            },
            beforeunload: {
                setup: function (bs, br, e) {
                    if (b.isWindow(this)) {
                        this.onbeforeunload = e;
                    }
                },
                teardown: function (br, e) {
                    if (this.onbeforeunload === e) {
                        this.onbeforeunload = null;
                    }
                }
            }
        }
    };
    b.removeEvent = ap.removeEventListener ? function (br, e, bs) {
        if (br.removeEventListener) {
            br.removeEventListener(e, bs, false);
        }
    } : function (br, e, bs) {
        if (br.detachEvent) {
            br.detachEvent("on" + e, bs);
        }
    };
    b.Event = function (br, e) {
        if (!this.preventDefault) {
            return new b.Event(br, e);
        }
        if (br && br.type) {
            this.originalEvent = br;
            this.type = br.type;
            this.isDefaultPrevented = (br.defaultPrevented || br.returnValue === false || br.getPreventDefault && br.getPreventDefault()) ? i : bg;
        } else {
            this.type = br;
        } if (e) {
            b.extend(this, e);
        }
        this.timeStamp = b.now();
        this[b.expando] = true;
    };

    function bg() {
        return false;
    }

    function i() {
        return true;
    }
    b.Event.prototype = {
        preventDefault: function () {
            this.isDefaultPrevented = i;
            var br = this.originalEvent;
            if (!br) {
                return;
            }
            if (br.preventDefault) {
                br.preventDefault();
            } else {
                br.returnValue = false;
            }
        },
        stopPropagation: function () {
            this.isPropagationStopped = i;
            var br = this.originalEvent;
            if (!br) {
                return;
            }
            if (br.stopPropagation) {
                br.stopPropagation();
            }
            br.cancelBubble = true;
        },
        stopImmediatePropagation: function () {
            this.isImmediatePropagationStopped = i;
            this.stopPropagation();
        },
        isDefaultPrevented: bg,
        isPropagationStopped: bg,
        isImmediatePropagationStopped: bg
    };
    var aa = function (bs) {
        var bt = bs.relatedTarget,
            e = false,
            br = bs.type;
        bs.type = bs.data;
        if (bt !== this) {
            if (bt) {
                e = b.contains(this, bt);
            }
            if (!e) {
                b.event.handle.apply(this, arguments);
                bs.type = br;
            }
        }
    }, aR = function (e) {
            e.type = e.data;
            b.event.handle.apply(this, arguments);
        };
    b.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function (br, e) {
        b.event.special[br] = {
            setup: function (bs) {
                b.event.add(this, e, bs && bs.selector ? aR : aa, br);
            },
            teardown: function (bs) {
                b.event.remove(this, e, bs && bs.selector ? aR : aa);
            }
        };
    });
    if (!b.support.submitBubbles) {
        b.event.special.submit = {
            setup: function (br, e) {
                if (!b.nodeName(this, "form")) {
                    b.event.add(this, "click.specialSubmit", function (bu) {
                        var bt = bu.target,
                            bs = b.nodeName(bt, "input") || b.nodeName(bt, "button") ? bt.type : "";
                        if ((bs === "submit" || bs === "image") && b(bt).closest("form").length) {
                            aT("submit", this, arguments);
                        }
                    });
                    b.event.add(this, "keypress.specialSubmit", function (bu) {
                        var bt = bu.target,
                            bs = b.nodeName(bt, "input") || b.nodeName(bt, "button") ? bt.type : "";
                        if ((bs === "text" || bs === "password") && b(bt).closest("form").length && bu.keyCode === 13) {
                            aT("submit", this, arguments);
                        }
                    });
                } else {
                    return false;
                }
            },
            teardown: function (e) {
                b.event.remove(this, ".specialSubmit");
            }
        };
    }
    if (!b.support.changeBubbles) {
        var bj, k = function (br) {
                var e = b.nodeName(br, "input") ? br.type : "",
                    bs = br.value;
                if (e === "radio" || e === "checkbox") {
                    bs = br.checked;
                } else {
                    if (e === "select-multiple") {
                        bs = br.selectedIndex > -1 ? b.map(br.options, function (bt) {
                            return bt.selected;
                        }).join("-") : "";
                    } else {
                        if (b.nodeName(br, "select")) {
                            bs = br.selectedIndex;
                        }
                    }
                }
                return bs;
            }, Y = function Y(bt) {
                var br = bt.target,
                    bs, bu;
                if (!a9.test(br.nodeName) || br.readOnly) {
                    return;
                }
                bs = b._data(br, "_change_data");
                bu = k(br);
                if (bt.type !== "focusout" || br.type !== "radio") {
                    b._data(br, "_change_data", bu);
                }
                if (bs === K || bu === bs) {
                    return;
                }
                if (bs != null || bu) {
                    bt.type = "change";
                    bt.liveFired = K;
                    b.event.trigger(bt, arguments[1], br);
                }
            };
        b.event.special.change = {
            filters: {
                focusout: Y,
                beforedeactivate: Y,
                click: function (bt) {
                    var bs = bt.target,
                        br = b.nodeName(bs, "input") ? bs.type : "";
                    if (br === "radio" || br === "checkbox" || b.nodeName(bs, "select")) {
                        Y.call(this, bt);
                    }
                },
                keydown: function (bt) {
                    var bs = bt.target,
                        br = b.nodeName(bs, "input") ? bs.type : "";
                    if ((bt.keyCode === 13 && !b.nodeName(bs, "textarea")) || (bt.keyCode === 32 && (br === "checkbox" || br === "radio")) || br === "select-multiple") {
                        Y.call(this, bt);
                    }
                },
                beforeactivate: function (bs) {
                    var br = bs.target;
                    b._data(br, "_change_data", k(br));
                }
            },
            setup: function (bs, br) {
                if (this.type === "file") {
                    return false;
                }
                for (var e in bj) {
                    b.event.add(this, e + ".specialChange", bj[e]);
                }
                return a9.test(this.nodeName);
            },
            teardown: function (e) {
                b.event.remove(this, ".specialChange");
                return a9.test(this.nodeName);
            }
        };
        bj = b.event.special.change.filters;
        bj.focus = bj.beforeactivate;
    }

    function aT(br, bt, e) {
        var bs = b.extend({}, e[0]);
        bs.type = br;
        bs.originalEvent = {};
        bs.liveFired = K;
        b.event.handle.call(bt, bs);
        if (bs.isDefaultPrevented()) {
            e[0].preventDefault();
        }
    }
    if (!b.support.focusinBubbles) {
        b.each({
            focus: "focusin",
            blur: "focusout"
        }, function (bt, e) {
            var br = 0;
            b.event.special[e] = {
                setup: function () {
                    if (br++ === 0) {
                        ap.addEventListener(bt, bs, true);
                    }
                },
                teardown: function () {
                    if (--br === 0) {
                        ap.removeEventListener(bt, bs, true);
                    }
                }
            };

            function bs(bu) {
                var bv = b.event.fix(bu);
                bv.type = e;
                bv.originalEvent = {};
                b.event.trigger(bv, null, bv.target);
                if (bv.isDefaultPrevented()) {
                    bu.preventDefault();
                }
            }
        });
    }
    b.each(["bind", "one"], function (br, e) {
        b.fn[e] = function (bx, by, bw) {
            var bv;
            if (typeof bx === "object") {
                for (var bu in bx) {
                    this[e](bu, by, bx[bu], bw);
                }
                return this;
            }
            if (arguments.length === 2 || by === false) {
                bw = by;
                by = K;
            }
            if (e === "one") {
                bv = function (bz) {
                    b(this).unbind(bz, bv);
                    return bw.apply(this, arguments);
                };
                bv.guid = bw.guid || b.guid++;
            } else {
                bv = bw;
            } if (bx === "unload" && e !== "one") {
                this.one(bx, by, bw);
            } else {
                for (var bt = 0, bs = this.length; bt < bs; bt++) {
                    b.event.add(this[bt], bx, bv, by);
                }
            }
            return this;
        };
    });
    b.fn.extend({
        unbind: function (bu, bt) {
            if (typeof bu === "object" && !bu.preventDefault) {
                for (var bs in bu) {
                    this.unbind(bs, bu[bs]);
                }
            } else {
                for (var br = 0, e = this.length; br < e; br++) {
                    b.event.remove(this[br], bu, bt);
                }
            }
            return this;
        },
        delegate: function (e, br, bt, bs) {
            return this.live(br, bt, bs, e);
        },
        undelegate: function (e, br, bs) {
            if (arguments.length === 0) {
                return this.unbind("live");
            } else {
                return this.die(br, null, bs, e);
            }
        },
        trigger: function (e, br) {
            return this.each(function () {
                b.event.trigger(e, br, this);
            });
        },
        triggerHandler: function (e, br) {
            if (this[0]) {
                return b.event.trigger(e, br, this[0], true);
            }
        },
        toggle: function (bt) {
            var br = arguments,
                e = bt.guid || b.guid++,
                bs = 0,
                bu = function (bv) {
                    var bw = (b.data(this, "lastToggle" + bt.guid) || 0) % bs;
                    b.data(this, "lastToggle" + bt.guid, bw + 1);
                    bv.preventDefault();
                    return br[bw].apply(this, arguments) || false;
                };
            bu.guid = e;
            while (bs < br.length) {
                br[bs++].guid = e;
            }
            return this.click(bu);
        },
        hover: function (e, br) {
            return this.mouseenter(e).mouseleave(br || e);
        }
    });
    var aP = {
        focus: "focusin",
        blur: "focusout",
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };
    b.each(["live", "die"], function (br, e) {
        b.fn[e] = function (bB, by, bD, bu) {
            var bC, bz = 0,
                bA, bt, bF, bw = bu || this.selector,
                bs = bu ? this : b(this.context);
            if (typeof bB === "object" && !bB.preventDefault) {
                for (var bE in bB) {
                    bs[e](bE, by, bB[bE], bw);
                }
                return this;
            }
            if (e === "die" && !bB && bu && bu.charAt(0) === ".") {
                bs.unbind(bu);
                return this;
            }
            if (by === false || b.isFunction(by)) {
                bD = by || bg;
                by = K;
            }
            bB = (bB || "").split(" ");
            while ((bC = bB[bz++]) != null) {
                bA = aW.exec(bC);
                bt = "";
                if (bA) {
                    bt = bA[0];
                    bC = bC.replace(aW, "");
                }
                if (bC === "hover") {
                    bB.push("mouseenter" + bt, "mouseleave" + bt);
                    continue;
                }
                bF = bC;
                if (aP[bC]) {
                    bB.push(aP[bC] + bt);
                    bC = bC + bt;
                } else {
                    bC = (aP[bC] || bC) + bt;
                } if (e === "live") {
                    for (var bx = 0, bv = bs.length; bx < bv; bx++) {
                        b.event.add(bs[bx], "live." + p(bC, bw), {
                            data: by,
                            selector: bw,
                            handler: bD,
                            origType: bC,
                            origHandler: bD,
                            preType: bF
                        });
                    }
                } else {
                    bs.unbind("live." + p(bC, bw), bD);
                }
            }
            return this;
        };
    });

    function ag(bB) {
        var by, bt, bH, bv, e, bD, bA, bC, bz, bG, bx, bw, bF, bE = [],
            bu = [],
            br = b._data(this, "events");
        if (bB.liveFired === this || !br || !br.live || bB.target.disabled || bB.button && bB.type === "click") {
            return;
        }
        if (bB.namespace) {
            bw = new RegExp("(^|\\.)" + bB.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
        }
        bB.liveFired = this;
        var bs = br.live.slice(0);
        for (bA = 0; bA < bs.length; bA++) {
            e = bs[bA];
            if (e.origType.replace(aW, "") === bB.type) {
                bu.push(e.selector);
            } else {
                bs.splice(bA--, 1);
            }
        }
        bv = b(bB.target).closest(bu, bB.currentTarget);
        for (bC = 0, bz = bv.length; bC < bz; bC++) {
            bx = bv[bC];
            for (bA = 0; bA < bs.length; bA++) {
                e = bs[bA];
                if (bx.selector === e.selector && (!bw || bw.test(e.namespace)) && !bx.elem.disabled) {
                    bD = bx.elem;
                    bH = null;
                    if (e.preType === "mouseenter" || e.preType === "mouseleave") {
                        bB.type = e.preType;
                        bH = b(bB.relatedTarget).closest(e.selector)[0];
                        if (bH && b.contains(bD, bH)) {
                            bH = bD;
                        }
                    }
                    if (!bH || bH !== bD) {
                        bE.push({
                            elem: bD,
                            handleObj: e,
                            level: bx.level
                        });
                    }
                }
            }
        }
        for (bC = 0, bz = bE.length; bC < bz; bC++) {
            bv = bE[bC];
            if (bt && bv.level > bt) {
                break;
            }
            bB.currentTarget = bv.elem;
            bB.data = bv.handleObj.data;
            bB.handleObj = bv.handleObj;
            bF = bv.handleObj.origHandler.apply(bv.elem, arguments);
            if (bF === false || bB.isPropagationStopped()) {
                bt = bv.level;
                if (bF === false) {
                    by = false;
                }
                if (bB.isImmediatePropagationStopped()) {
                    break;
                }
            }
        }
        return by;
    }

    function p(br, e) {
        return (br && br !== "*" ? br + "." : "") + e.replace(N, "`").replace(be, "&");
    }
    b.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error").split(" "), function (br, e) {
        b.fn[e] = function (bt, bs) {
            if (bs == null) {
                bs = bt;
                bt = null;
            }
            return arguments.length > 0 ? this.bind(e, bt, bs) : this.trigger(e);
        };
        if (b.attrFn) {
            b.attrFn[e] = true;
        }
    });
    /*
     * Sizzle CSS Selector Engine
     *  Copyright 2011, The Dojo Foundation
     *  Released under the MIT, BSD, and GPL Licenses.
     *  More information: http://sizzlejs.com/
     */
    (function () {
        var bB = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
            bC = 0,
            bF = Object.prototype.toString,
            bw = false,
            bv = true,
            bD = /\\/g,
            bJ = /\W/;
        [0, 0].sort(function () {
                bv = false;
                return 0;
            });
        var bt = function (bO, e, bR, bS) {
            bR = bR || [];
            e = e || ap;
            var bU = e;
            if (e.nodeType !== 1 && e.nodeType !== 9) {
                return [];
            }
            if (!bO || typeof bO !== "string") {
                return bR;
            }
            var bL, bW, bZ, bK, bV, bY, bX, bQ, bN = true,
                bM = bt.isXML(e),
                bP = [],
                bT = bO;
            do {
                bB.exec("");
                bL = bB.exec(bT);
                if (bL) {
                    bT = bL[3];
                    bP.push(bL[1]);
                    if (bL[2]) {
                        bK = bL[3];
                        break;
                    }
                }
            } while (bL);
            if (bP.length > 1 && bx.exec(bO)) {
                if (bP.length === 2 && by.relative[bP[0]]) {
                    bW = bG(bP[0] + bP[1], e);
                } else {
                    bW = by.relative[bP[0]] ? [e] : bt(bP.shift(), e);
                    while (bP.length) {
                        bO = bP.shift();
                        if (by.relative[bO]) {
                            bO += bP.shift();
                        }
                        bW = bG(bO, bW);
                    }
                }
            } else {
                if (!bS && bP.length > 1 && e.nodeType === 9 && !bM && by.match.ID.test(bP[0]) && !by.match.ID.test(bP[bP.length - 1])) {
                    bV = bt.find(bP.shift(), e, bM);
                    e = bV.expr ? bt.filter(bV.expr, bV.set)[0] : bV.set[0];
                }
                if (e) {
                    bV = bS ? {
                        expr: bP.pop(),
                        set: bz(bS)
                    } : bt.find(bP.pop(), bP.length === 1 && (bP[0] === "~" || bP[0] === "+") && e.parentNode ? e.parentNode : e, bM);
                    bW = bV.expr ? bt.filter(bV.expr, bV.set) : bV.set;
                    if (bP.length > 0) {
                        bZ = bz(bW);
                    } else {
                        bN = false;
                    }
                    while (bP.length) {
                        bY = bP.pop();
                        bX = bY;
                        if (!by.relative[bY]) {
                            bY = "";
                        } else {
                            bX = bP.pop();
                        } if (bX == null) {
                            bX = e;
                        }
                        by.relative[bY](bZ, bX, bM);
                    }
                } else {
                    bZ = bP = [];
                }
            } if (!bZ) {
                bZ = bW;
            }
            if (!bZ) {
                bt.error(bY || bO);
            }
            if (bF.call(bZ) === "[object Array]") {
                if (!bN) {
                    bR.push.apply(bR, bZ);
                } else {
                    if (e && e.nodeType === 1) {
                        for (bQ = 0; bZ[bQ] != null; bQ++) {
                            if (bZ[bQ] && (bZ[bQ] === true || bZ[bQ].nodeType === 1 && bt.contains(e, bZ[bQ]))) {
                                bR.push(bW[bQ]);
                            }
                        }
                    } else {
                        for (bQ = 0; bZ[bQ] != null; bQ++) {
                            if (bZ[bQ] && bZ[bQ].nodeType === 1) {
                                bR.push(bW[bQ]);
                            }
                        }
                    }
                }
            } else {
                bz(bZ, bR);
            } if (bK) {
                bt(bK, bU, bR, bS);
                bt.uniqueSort(bR);
            }
            return bR;
        };
        bt.uniqueSort = function (bK) {
            if (bE) {
                bw = bv;
                bK.sort(bE);
                if (bw) {
                    for (var e = 1; e < bK.length; e++) {
                        if (bK[e] === bK[e - 1]) {
                            bK.splice(e--, 1);
                        }
                    }
                }
            }
            return bK;
        };
        bt.matches = function (e, bK) {
            return bt(e, null, null, bK);
        };
        bt.matchesSelector = function (e, bK) {
            return bt(bK, null, null, [e]).length > 0;
        };
        bt.find = function (bQ, e, bR) {
            var bP;
            if (!bQ) {
                return [];
            }
            for (var bM = 0, bL = by.order.length; bM < bL; bM++) {
                var bN, bO = by.order[bM];
                if ((bN = by.leftMatch[bO].exec(bQ))) {
                    var bK = bN[1];
                    bN.splice(1, 1);
                    if (bK.substr(bK.length - 1) !== "\\") {
                        bN[1] = (bN[1] || "").replace(bD, "");
                        bP = by.find[bO](bN, e, bR);
                        if (bP != null) {
                            bQ = bQ.replace(by.match[bO], "");
                            break;
                        }
                    }
                }
            }
            if (!bP) {
                bP = typeof e.getElementsByTagName !== "undefined" ? e.getElementsByTagName("*") : [];
            }
            return {
                set: bP,
                expr: bQ
            };
        };
        bt.filter = function (bU, bT, bX, bN) {
            var bP, e, bL = bU,
                bZ = [],
                bR = bT,
                bQ = bT && bT[0] && bt.isXML(bT[0]);
            while (bU && bT.length) {
                for (var bS in by.filter) {
                    if ((bP = by.leftMatch[bS].exec(bU)) != null && bP[2]) {
                        var bY, bW, bK = by.filter[bS],
                            bM = bP[1];
                        e = false;
                        bP.splice(1, 1);
                        if (bM.substr(bM.length - 1) === "\\") {
                            continue;
                        }
                        if (bR === bZ) {
                            bZ = [];
                        }
                        if (by.preFilter[bS]) {
                            bP = by.preFilter[bS](bP, bR, bX, bZ, bN, bQ);
                            if (!bP) {
                                e = bY = true;
                            } else {
                                if (bP === true) {
                                    continue;
                                }
                            }
                        }
                        if (bP) {
                            for (var bO = 0;
                                (bW = bR[bO]) != null; bO++) {
                                if (bW) {
                                    bY = bK(bW, bP, bO, bR);
                                    var bV = bN ^ !! bY;
                                    if (bX && bY != null) {
                                        if (bV) {
                                            e = true;
                                        } else {
                                            bR[bO] = false;
                                        }
                                    } else {
                                        if (bV) {
                                            bZ.push(bW);
                                            e = true;
                                        }
                                    }
                                }
                            }
                        }
                        if (bY !== K) {
                            if (!bX) {
                                bR = bZ;
                            }
                            bU = bU.replace(by.match[bS], "");
                            if (!e) {
                                return [];
                            }
                            break;
                        }
                    }
                }
                if (bU === bL) {
                    if (e == null) {
                        bt.error(bU);
                    } else {
                        break;
                    }
                }
                bL = bU;
            }
            return bR;
        };
        bt.error = function (e) {
            throw "Syntax error, unrecognized expression: " + e;
        };
        var by = bt.selectors = {
            order: ["ID", "NAME", "TAG"],
            match: {
                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },
            leftMatch: {},
            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },
            attrHandle: {
                href: function (e) {
                    return e.getAttribute("href");
                },
                type: function (e) {
                    return e.getAttribute("type");
                }
            },
            relative: {
                "+": function (bP, bK) {
                    var bM = typeof bK === "string",
                        bO = bM && !bJ.test(bK),
                        bQ = bM && !bO;
                    if (bO) {
                        bK = bK.toLowerCase();
                    }
                    for (var bL = 0, e = bP.length, bN; bL < e; bL++) {
                        if ((bN = bP[bL])) {
                            while ((bN = bN.previousSibling) && bN.nodeType !== 1) {}
                            bP[bL] = bQ || bN && bN.nodeName.toLowerCase() === bK ? bN || false : bN === bK;
                        }
                    }
                    if (bQ) {
                        bt.filter(bK, bP, true);
                    }
                },
                ">": function (bP, bK) {
                    var bO, bN = typeof bK === "string",
                        bL = 0,
                        e = bP.length;
                    if (bN && !bJ.test(bK)) {
                        bK = bK.toLowerCase();
                        for (; bL < e; bL++) {
                            bO = bP[bL];
                            if (bO) {
                                var bM = bO.parentNode;
                                bP[bL] = bM.nodeName.toLowerCase() === bK ? bM : false;
                            }
                        }
                    } else {
                        for (; bL < e; bL++) {
                            bO = bP[bL];
                            if (bO) {
                                bP[bL] = bN ? bO.parentNode : bO.parentNode === bK;
                            }
                        }
                        if (bN) {
                            bt.filter(bK, bP, true);
                        }
                    }
                },
                "": function (bM, bK, bO) {
                    var bN, bL = bC++,
                        e = bH;
                    if (typeof bK === "string" && !bJ.test(bK)) {
                        bK = bK.toLowerCase();
                        bN = bK;
                        e = br;
                    }
                    e("parentNode", bK, bL, bM, bN, bO);
                },
                "~": function (bM, bK, bO) {
                    var bN, bL = bC++,
                        e = bH;
                    if (typeof bK === "string" && !bJ.test(bK)) {
                        bK = bK.toLowerCase();
                        bN = bK;
                        e = br;
                    }
                    e("previousSibling", bK, bL, bM, bN, bO);
                }
            },
            find: {
                ID: function (bK, bL, bM) {
                    if (typeof bL.getElementById !== "undefined" && !bM) {
                        var e = bL.getElementById(bK[1]);
                        return e && e.parentNode ? [e] : [];
                    }
                },
                NAME: function (bL, bO) {
                    if (typeof bO.getElementsByName !== "undefined") {
                        var bK = [],
                            bN = bO.getElementsByName(bL[1]);
                        for (var bM = 0, e = bN.length; bM < e; bM++) {
                            if (bN[bM].getAttribute("name") === bL[1]) {
                                bK.push(bN[bM]);
                            }
                        }
                        return bK.length === 0 ? null : bK;
                    }
                },
                TAG: function (e, bK) {
                    if (typeof bK.getElementsByTagName !== "undefined") {
                        return bK.getElementsByTagName(e[1]);
                    }
                }
            },
            preFilter: {
                CLASS: function (bM, bK, bL, e, bP, bQ) {
                    bM = " " + bM[1].replace(bD, "") + " ";
                    if (bQ) {
                        return bM;
                    }
                    for (var bN = 0, bO;
                        (bO = bK[bN]) != null; bN++) {
                        if (bO) {
                            if (bP ^ (bO.className && (" " + bO.className + " ").replace(/[\t\n\r]/g, " ").indexOf(bM) >= 0)) {
                                if (!bL) {
                                    e.push(bO);
                                }
                            } else {
                                if (bL) {
                                    bK[bN] = false;
                                }
                            }
                        }
                    }
                    return false;
                },
                ID: function (e) {
                    return e[1].replace(bD, "");
                },
                TAG: function (bK, e) {
                    return bK[1].replace(bD, "").toLowerCase();
                },
                CHILD: function (e) {
                    if (e[1] === "nth") {
                        if (!e[2]) {
                            bt.error(e[0]);
                        }
                        e[2] = e[2].replace(/^\+|\s*/g, "");
                        var bK = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(e[2] === "even" && "2n" || e[2] === "odd" && "2n+1" || !/\D/.test(e[2]) && "0n+" + e[2] || e[2]);
                        e[2] = (bK[1] + (bK[2] || 1)) - 0;
                        e[3] = bK[3] - 0;
                    } else {
                        if (e[2]) {
                            bt.error(e[0]);
                        }
                    }
                    e[0] = bC++;
                    return e;
                },
                ATTR: function (bN, bK, bL, e, bO, bP) {
                    var bM = bN[1] = bN[1].replace(bD, "");
                    if (!bP && by.attrMap[bM]) {
                        bN[1] = by.attrMap[bM];
                    }
                    bN[4] = (bN[4] || bN[5] || "").replace(bD, "");
                    if (bN[2] === "~=") {
                        bN[4] = " " + bN[4] + " ";
                    }
                    return bN;
                },
                PSEUDO: function (bN, bK, bL, e, bO) {
                    if (bN[1] === "not") {
                        if ((bB.exec(bN[3]) || "").length > 1 || /^\w/.test(bN[3])) {
                            bN[3] = bt(bN[3], null, null, bK);
                        } else {
                            var bM = bt.filter(bN[3], bK, bL, true ^ bO);
                            if (!bL) {
                                e.push.apply(e, bM);
                            }
                            return false;
                        }
                    } else {
                        if (by.match.POS.test(bN[0]) || by.match.CHILD.test(bN[0])) {
                            return true;
                        }
                    }
                    return bN;
                },
                POS: function (e) {
                    e.unshift(true);
                    return e;
                }
            },
            filters: {
                enabled: function (e) {
                    return e.disabled === false && e.type !== "hidden";
                },
                disabled: function (e) {
                    return e.disabled === true;
                },
                checked: function (e) {
                    return e.checked === true;
                },
                selected: function (e) {
                    if (e.parentNode) {
                        e.parentNode.selectedIndex;
                    }
                    return e.selected === true;
                },
                parent: function (e) {
                    return !!e.firstChild;
                },
                empty: function (e) {
                    return !e.firstChild;
                },
                has: function (bL, bK, e) {
                    return !!bt(e[3], bL).length;
                },
                header: function (e) {
                    return (/h\d/i).test(e.nodeName);
                },
                text: function (bL) {
                    var e = bL.getAttribute("type"),
                        bK = bL.type;
                    return bL.nodeName.toLowerCase() === "input" && "text" === bK && (e === bK || e === null);
                },
                radio: function (e) {
                    return e.nodeName.toLowerCase() === "input" && "radio" === e.type;
                },
                checkbox: function (e) {
                    return e.nodeName.toLowerCase() === "input" && "checkbox" === e.type;
                },
                file: function (e) {
                    return e.nodeName.toLowerCase() === "input" && "file" === e.type;
                },
                password: function (e) {
                    return e.nodeName.toLowerCase() === "input" && "password" === e.type;
                },
                submit: function (bK) {
                    var e = bK.nodeName.toLowerCase();
                    return (e === "input" || e === "button") && "submit" === bK.type;
                },
                image: function (e) {
                    return e.nodeName.toLowerCase() === "input" && "image" === e.type;
                },
                reset: function (bK) {
                    var e = bK.nodeName.toLowerCase();
                    return (e === "input" || e === "button") && "reset" === bK.type;
                },
                button: function (bK) {
                    var e = bK.nodeName.toLowerCase();
                    return e === "input" && "button" === bK.type || e === "button";
                },
                input: function (e) {
                    return (/input|select|textarea|button/i).test(e.nodeName);
                },
                focus: function (e) {
                    return e === e.ownerDocument.activeElement;
                }
            },
            setFilters: {
                first: function (bK, e) {
                    return e === 0;
                },
                last: function (bL, bK, e, bM) {
                    return bK === bM.length - 1;
                },
                even: function (bK, e) {
                    return e % 2 === 0;
                },
                odd: function (bK, e) {
                    return e % 2 === 1;
                },
                lt: function (bL, bK, e) {
                    return bK < e[3] - 0;
                },
                gt: function (bL, bK, e) {
                    return bK > e[3] - 0;
                },
                nth: function (bL, bK, e) {
                    return e[3] - 0 === bK;
                },
                eq: function (bL, bK, e) {
                    return e[3] - 0 === bK;
                }
            },
            filter: {
                PSEUDO: function (bL, bQ, bP, bR) {
                    var e = bQ[1],
                        bK = by.filters[e];
                    if (bK) {
                        return bK(bL, bP, bQ, bR);
                    } else {
                        if (e === "contains") {
                            return (bL.textContent || bL.innerText || bt.getText([bL]) || "").indexOf(bQ[3]) >= 0;
                        } else {
                            if (e === "not") {
                                var bM = bQ[3];
                                for (var bO = 0, bN = bM.length; bO < bN; bO++) {
                                    if (bM[bO] === bL) {
                                        return false;
                                    }
                                }
                                return true;
                            } else {
                                bt.error(e);
                            }
                        }
                    }
                },
                CHILD: function (e, bM) {
                    var bP = bM[1],
                        bK = e;
                    switch (bP) {
                    case "only":
                    case "first":
                        while ((bK = bK.previousSibling)) {
                            if (bK.nodeType === 1) {
                                return false;
                            }
                        }
                        if (bP === "first") {
                            return true;
                        }
                        bK = e;
                    case "last":
                        while ((bK = bK.nextSibling)) {
                            if (bK.nodeType === 1) {
                                return false;
                            }
                        }
                        return true;
                    case "nth":
                        var bL = bM[2],
                            bS = bM[3];
                        if (bL === 1 && bS === 0) {
                            return true;
                        }
                        var bO = bM[0],
                            bR = e.parentNode;
                        if (bR && (bR.sizcache !== bO || !e.nodeIndex)) {
                            var bN = 0;
                            for (bK = bR.firstChild; bK; bK = bK.nextSibling) {
                                if (bK.nodeType === 1) {
                                    bK.nodeIndex = ++bN;
                                }
                            }
                            bR.sizcache = bO;
                        }
                        var bQ = e.nodeIndex - bS;
                        if (bL === 0) {
                            return bQ === 0;
                        } else {
                            return (bQ % bL === 0 && bQ / bL >= 0);
                        }
                    }
                },
                ID: function (bK, e) {
                    return bK.nodeType === 1 && bK.getAttribute("id") === e;
                },
                TAG: function (bK, e) {
                    return (e === "*" && bK.nodeType === 1) || bK.nodeName.toLowerCase() === e;
                },
                CLASS: function (bK, e) {
                    return (" " + (bK.className || bK.getAttribute("class")) + " ").indexOf(e) > -1;
                },
                ATTR: function (bO, bM) {
                    var bL = bM[1],
                        e = by.attrHandle[bL] ? by.attrHandle[bL](bO) : bO[bL] != null ? bO[bL] : bO.getAttribute(bL),
                        bP = e + "",
                        bN = bM[2],
                        bK = bM[4];
                    return e == null ? bN === "!=" : bN === "=" ? bP === bK : bN === "*=" ? bP.indexOf(bK) >= 0 : bN === "~=" ? (" " + bP + " ").indexOf(bK) >= 0 : !bK ? bP && e !== false : bN === "!=" ? bP !== bK : bN === "^=" ? bP.indexOf(bK) === 0 : bN === "$=" ? bP.substr(bP.length - bK.length) === bK : bN === "|=" ? bP === bK || bP.substr(0, bK.length + 1) === bK + "-" : false;
                },
                POS: function (bN, bK, bL, bO) {
                    var e = bK[2],
                        bM = by.setFilters[e];
                    if (bM) {
                        return bM(bN, bL, bK, bO);
                    }
                }
            }
        };
        var bx = by.match.POS,
            bs = function (bK, e) {
                return "\\" + (e - 0 + 1);
            };
        for (var bu in by.match) {
            by.match[bu] = new RegExp(by.match[bu].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
            by.leftMatch[bu] = new RegExp(/(^(?:.|\r|\n)*?)/.source + by.match[bu].source.replace(/\\(\d+)/g, bs));
        }
        var bz = function (bK, e) {
            bK = Array.prototype.slice.call(bK, 0);
            if (e) {
                e.push.apply(e, bK);
                return e;
            }
            return bK;
        };
        try {
            Array.prototype.slice.call(ap.documentElement.childNodes, 0)[0].nodeType;
        } catch (bI) {
            bz = function (bN, bM) {
                var bL = 0,
                    bK = bM || [];
                if (bF.call(bN) === "[object Array]") {
                    Array.prototype.push.apply(bK, bN);
                } else {
                    if (typeof bN.length === "number") {
                        for (var e = bN.length; bL < e; bL++) {
                            bK.push(bN[bL]);
                        }
                    } else {
                        for (; bN[bL]; bL++) {
                            bK.push(bN[bL]);
                        }
                    }
                }
                return bK;
            };
        }
        var bE, bA;
        if (ap.documentElement.compareDocumentPosition) {
            bE = function (bK, e) {
                if (bK === e) {
                    bw = true;
                    return 0;
                }
                if (!bK.compareDocumentPosition || !e.compareDocumentPosition) {
                    return bK.compareDocumentPosition ? -1 : 1;
                }
                return bK.compareDocumentPosition(e) & 4 ? -1 : 1;
            };
        } else {
            bE = function (bR, bQ) {
                if (bR === bQ) {
                    bw = true;
                    return 0;
                } else {
                    if (bR.sourceIndex && bQ.sourceIndex) {
                        return bR.sourceIndex - bQ.sourceIndex;
                    }
                }
                var bO, bK, bL = [],
                    e = [],
                    bN = bR.parentNode,
                    bP = bQ.parentNode,
                    bS = bN;
                if (bN === bP) {
                    return bA(bR, bQ);
                } else {
                    if (!bN) {
                        return -1;
                    } else {
                        if (!bP) {
                            return 1;
                        }
                    }
                }
                while (bS) {
                    bL.unshift(bS);
                    bS = bS.parentNode;
                }
                bS = bP;
                while (bS) {
                    e.unshift(bS);
                    bS = bS.parentNode;
                }
                bO = bL.length;
                bK = e.length;
                for (var bM = 0; bM < bO && bM < bK; bM++) {
                    if (bL[bM] !== e[bM]) {
                        return bA(bL[bM], e[bM]);
                    }
                }
                return bM === bO ? bA(bR, e[bM], -1) : bA(bL[bM], bQ, 1);
            };
            bA = function (bK, e, bL) {
                if (bK === e) {
                    return bL;
                }
                var bM = bK.nextSibling;
                while (bM) {
                    if (bM === e) {
                        return -1;
                    }
                    bM = bM.nextSibling;
                }
                return 1;
            };
        }
        bt.getText = function (e) {
            var bK = "",
                bM;
            for (var bL = 0; e[bL]; bL++) {
                bM = e[bL];
                if (bM.nodeType === 3 || bM.nodeType === 4) {
                    bK += bM.nodeValue;
                } else {
                    if (bM.nodeType !== 8) {
                        bK += bt.getText(bM.childNodes);
                    }
                }
            }
            return bK;
        };
        (function () {
            var bK = ap.createElement("div"),
                bL = "script" + (new Date()).getTime(),
                e = ap.documentElement;
            bK.innerHTML = "<a name='" + bL + "'/>";
            e.insertBefore(bK, e.firstChild);
            if (ap.getElementById(bL)) {
                by.find.ID = function (bN, bO, bP) {
                    if (typeof bO.getElementById !== "undefined" && !bP) {
                        var bM = bO.getElementById(bN[1]);
                        return bM ? bM.id === bN[1] || typeof bM.getAttributeNode !== "undefined" && bM.getAttributeNode("id").nodeValue === bN[1] ? [bM] : K : [];
                    }
                };
                by.filter.ID = function (bO, bM) {
                    var bN = typeof bO.getAttributeNode !== "undefined" && bO.getAttributeNode("id");
                    return bO.nodeType === 1 && bN && bN.nodeValue === bM;
                };
            }
            e.removeChild(bK);
            e = bK = null;
        })();
        (function () {
            var e = ap.createElement("div");
            e.appendChild(ap.createComment(""));
            if (e.getElementsByTagName("*").length > 0) {
                by.find.TAG = function (bK, bO) {
                    var bN = bO.getElementsByTagName(bK[1]);
                    if (bK[1] === "*") {
                        var bM = [];
                        for (var bL = 0; bN[bL]; bL++) {
                            if (bN[bL].nodeType === 1) {
                                bM.push(bN[bL]);
                            }
                        }
                        bN = bM;
                    }
                    return bN;
                };
            }
            e.innerHTML = "<a href='#'></a>";
            if (e.firstChild && typeof e.firstChild.getAttribute !== "undefined" && e.firstChild.getAttribute("href") !== "#") {
                by.attrHandle.href = function (bK) {
                    return bK.getAttribute("href", 2);
                };
            }
            e = null;
        })();
        if (ap.querySelectorAll) {
            (function () {
                var e = bt,
                    bM = ap.createElement("div"),
                    bL = "__sizzle__";
                bM.innerHTML = "<p class='TEST'></p>";
                if (bM.querySelectorAll && bM.querySelectorAll(".TEST").length === 0) {
                    return;
                }
                bt = function (bX, bO, bS, bW) {
                    bO = bO || ap;
                    if (!bW && !bt.isXML(bO)) {
                        var bV = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(bX);
                        if (bV && (bO.nodeType === 1 || bO.nodeType === 9)) {
                            if (bV[1]) {
                                return bz(bO.getElementsByTagName(bX), bS);
                            } else {
                                if (bV[2] && by.find.CLASS && bO.getElementsByClassName) {
                                    return bz(bO.getElementsByClassName(bV[2]), bS);
                                }
                            }
                        }
                        if (bO.nodeType === 9) {
                            if (bX === "body" && bO.body) {
                                return bz([bO.body], bS);
                            } else {
                                if (bV && bV[3]) {
                                    var bR = bO.getElementById(bV[3]);
                                    if (bR && bR.parentNode) {
                                        if (bR.id === bV[3]) {
                                            return bz([bR], bS);
                                        }
                                    } else {
                                        return bz([], bS);
                                    }
                                }
                            }
                            try {
                                return bz(bO.querySelectorAll(bX), bS);
                            } catch (bT) {}
                        } else {
                            if (bO.nodeType === 1 && bO.nodeName.toLowerCase() !== "object") {
                                var bP = bO,
                                    bQ = bO.getAttribute("id"),
                                    bN = bQ || bL,
                                    bZ = bO.parentNode,
                                    bY = /^\s*[+~]/.test(bX);
                                if (!bQ) {
                                    bO.setAttribute("id", bN);
                                } else {
                                    bN = bN.replace(/'/g, "\\$&");
                                } if (bY && bZ) {
                                    bO = bO.parentNode;
                                }
                                try {
                                    if (!bY || bZ) {
                                        return bz(bO.querySelectorAll("[id='" + bN + "'] " + bX), bS);
                                    }
                                } catch (bU) {} finally {
                                    if (!bQ) {
                                        bP.removeAttribute("id");
                                    }
                                }
                            }
                        }
                    }
                    return e(bX, bO, bS, bW);
                };
                for (var bK in e) {
                    bt[bK] = e[bK];
                }
                bM = null;
            })();
        }(function () {
            var e = ap.documentElement,
                bL = e.matchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.msMatchesSelector;
            if (bL) {
                var bN = !bL.call(ap.createElement("div"), "div"),
                    bK = false;
                try {
                    bL.call(ap.documentElement, "[test!='']:sizzle");
                } catch (bM) {
                    bK = true;
                }
                bt.matchesSelector = function (bP, bR) {
                    bR = bR.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                    if (!bt.isXML(bP)) {
                        try {
                            if (bK || !by.match.PSEUDO.test(bR) && !/!=/.test(bR)) {
                                var bO = bL.call(bP, bR);
                                if (bO || !bN || bP.document && bP.document.nodeType !== 11) {
                                    return bO;
                                }
                            }
                        } catch (bQ) {}
                    }
                    return bt(bR, null, null, [bP]).length > 0;
                };
            }
        })();
        (function () {
            var e = ap.createElement("div");
            e.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (!e.getElementsByClassName || e.getElementsByClassName("e").length === 0) {
                return;
            }
            e.lastChild.className = "e";
            if (e.getElementsByClassName("e").length === 1) {
                return;
            }
            by.order.splice(1, 0, "CLASS");
            by.find.CLASS = function (bK, bL, bM) {
                if (typeof bL.getElementsByClassName !== "undefined" && !bM) {
                    return bL.getElementsByClassName(bK[1]);
                }
            };
            e = null;
        })();

        function br(bK, bP, bO, bS, bQ, bR) {
            for (var bM = 0, bL = bS.length; bM < bL; bM++) {
                var e = bS[bM];
                if (e) {
                    var bN = false;
                    e = e[bK];
                    while (e) {
                        if (e.sizcache === bO) {
                            bN = bS[e.sizset];
                            break;
                        }
                        if (e.nodeType === 1 && !bR) {
                            e.sizcache = bO;
                            e.sizset = bM;
                        }
                        if (e.nodeName.toLowerCase() === bP) {
                            bN = e;
                            break;
                        }
                        e = e[bK];
                    }
                    bS[bM] = bN;
                }
            }
        }

        function bH(bK, bP, bO, bS, bQ, bR) {
            for (var bM = 0, bL = bS.length; bM < bL; bM++) {
                var e = bS[bM];
                if (e) {
                    var bN = false;
                    e = e[bK];
                    while (e) {
                        if (e.sizcache === bO) {
                            bN = bS[e.sizset];
                            break;
                        }
                        if (e.nodeType === 1) {
                            if (!bR) {
                                e.sizcache = bO;
                                e.sizset = bM;
                            }
                            if (typeof bP !== "string") {
                                if (e === bP) {
                                    bN = true;
                                    break;
                                }
                            } else {
                                if (bt.filter(bP, [e]).length > 0) {
                                    bN = e;
                                    break;
                                }
                            }
                        }
                        e = e[bK];
                    }
                    bS[bM] = bN;
                }
            }
        }
        if (ap.documentElement.contains) {
            bt.contains = function (bK, e) {
                return bK !== e && (bK.contains ? bK.contains(e) : true);
            };
        } else {
            if (ap.documentElement.compareDocumentPosition) {
                bt.contains = function (bK, e) {
                    return !!(bK.compareDocumentPosition(e) & 16);
                };
            } else {
                bt.contains = function () {
                    return false;
                };
            }
        }
        bt.isXML = function (e) {
            var bK = (e ? e.ownerDocument || e : 0).documentElement;
            return bK ? bK.nodeName !== "HTML" : false;
        };
        var bG = function (e, bQ) {
            var bO, bM = [],
                bN = "",
                bL = bQ.nodeType ? [bQ] : bQ;
            while ((bO = by.match.PSEUDO.exec(e))) {
                bN += bO[0];
                e = e.replace(by.match.PSEUDO, "");
            }
            e = by.relative[e] ? e + "*" : e;
            for (var bP = 0, bK = bL.length; bP < bK; bP++) {
                bt(e, bL[bP], bM);
            }
            return bt.filter(bN, bM);
        };
        b.find = bt;
        b.expr = bt.selectors;
        b.expr[":"] = b.expr.filters;
        b.unique = bt.uniqueSort;
        b.text = bt.getText;
        b.isXMLDoc = bt.isXML;
        b.contains = bt.contains;
    })();
    var X = /Until$/,
        al = /^(?:parents|prevUntil|prevAll)/,
        a5 = /,/,
        bm = /^.[^:#\[\.,]*$/,
        P = Array.prototype.slice,
        H = b.expr.match.POS,
        at = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };
    b.fn.extend({
        find: function (e) {
            var bs = this,
                bu, br;
            if (typeof e !== "string") {
                return b(e).filter(function () {
                    for (bu = 0, br = bs.length; bu < br; bu++) {
                        if (b.contains(bs[bu], this)) {
                            return true;
                        }
                    }
                });
            }
            var bt = this.pushStack("", "find", e),
                bw, bx, bv;
            for (bu = 0, br = this.length; bu < br; bu++) {
                bw = bt.length;
                b.find(e, this[bu], bt);
                if (bu > 0) {
                    for (bx = bw; bx < bt.length; bx++) {
                        for (bv = 0; bv < bw; bv++) {
                            if (bt[bv] === bt[bx]) {
                                bt.splice(bx--, 1);
                                break;
                            }
                        }
                    }
                }
            }
            return bt;
        },
        has: function (br) {
            var e = b(br);
            return this.filter(function () {
                for (var bt = 0, bs = e.length; bt < bs; bt++) {
                    if (b.contains(this, e[bt])) {
                        return true;
                    }
                }
            });
        },
        not: function (e) {
            return this.pushStack(aA(this, e, false), "not", e);
        },
        filter: function (e) {
            return this.pushStack(aA(this, e, true), "filter", e);
        },
        is: function (e) {
            return !!e && (typeof e === "string" ? b.filter(e, this).length > 0 : this.filter(e).length > 0);
        },
        closest: function (bA, br) {
            var bx = [],
                bu, bs, bz = this[0];
            if (b.isArray(bA)) {
                var bw, bt, bv = {}, e = 1;
                if (bz && bA.length) {
                    for (bu = 0, bs = bA.length; bu < bs; bu++) {
                        bt = bA[bu];
                        if (!bv[bt]) {
                            bv[bt] = H.test(bt) ? b(bt, br || this.context) : bt;
                        }
                    }
                    while (bz && bz.ownerDocument && bz !== br) {
                        for (bt in bv) {
                            bw = bv[bt];
                            if (bw.jquery ? bw.index(bz) > -1 : b(bz).is(bw)) {
                                bx.push({
                                    selector: bt,
                                    elem: bz,
                                    level: e
                                });
                            }
                        }
                        bz = bz.parentNode;
                        e++;
                    }
                }
                return bx;
            }
            var by = H.test(bA) || typeof bA !== "string" ? b(bA, br || this.context) : 0;
            for (bu = 0, bs = this.length; bu < bs; bu++) {
                bz = this[bu];
                while (bz) {
                    if (by ? by.index(bz) > -1 : b.find.matchesSelector(bz, bA)) {
                        bx.push(bz);
                        break;
                    } else {
                        bz = bz.parentNode;
                        if (!bz || !bz.ownerDocument || bz === br || bz.nodeType === 11) {
                            break;
                        }
                    }
                }
            }
            bx = bx.length > 1 ? b.unique(bx) : bx;
            return this.pushStack(bx, "closest", bA);
        },
        index: function (e) {
            if (!e) {
                return (this[0] && this[0].parentNode) ? this.prevAll().length : -1;
            }
            if (typeof e === "string") {
                return b.inArray(this[0], b(e));
            }
            return b.inArray(e.jquery ? e[0] : e, this);
        },
        add: function (e, br) {
            var bt = typeof e === "string" ? b(e, br) : b.makeArray(e && e.nodeType ? [e] : e),
                bs = b.merge(this.get(), bt);
            return this.pushStack(C(bt[0]) || C(bs[0]) ? bs : b.unique(bs));
        },
        andSelf: function () {
            return this.add(this.prevObject);
        }
    });

    function C(e) {
        return !e || !e.parentNode || e.parentNode.nodeType === 11;
    }
    b.each({
        parent: function (br) {
            var e = br.parentNode;
            return e && e.nodeType !== 11 ? e : null;
        },
        parents: function (e) {
            return b.dir(e, "parentNode");
        },
        parentsUntil: function (br, e, bs) {
            return b.dir(br, "parentNode", bs);
        },
        next: function (e) {
            return b.nth(e, 2, "nextSibling");
        },
        prev: function (e) {
            return b.nth(e, 2, "previousSibling");
        },
        nextAll: function (e) {
            return b.dir(e, "nextSibling");
        },
        prevAll: function (e) {
            return b.dir(e, "previousSibling");
        },
        nextUntil: function (br, e, bs) {
            return b.dir(br, "nextSibling", bs);
        },
        prevUntil: function (br, e, bs) {
            return b.dir(br, "previousSibling", bs);
        },
        siblings: function (e) {
            return b.sibling(e.parentNode.firstChild, e);
        },
        children: function (e) {
            return b.sibling(e.firstChild);
        },
        contents: function (e) {
            return b.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : b.makeArray(e.childNodes);
        }
    }, function (e, br) {
        b.fn[e] = function (bv, bs) {
            var bu = b.map(this, br, bv),
                bt = P.call(arguments);
            if (!X.test(e)) {
                bs = bv;
            }
            if (bs && typeof bs === "string") {
                bu = b.filter(bs, bu);
            }
            bu = this.length > 1 && !at[e] ? b.unique(bu) : bu;
            if ((this.length > 1 || a5.test(bs)) && al.test(e)) {
                bu = bu.reverse();
            }
            return this.pushStack(bu, e, bt.join(","));
        };
    });
    b.extend({
        filter: function (bs, e, br) {
            if (br) {
                bs = ":not(" + bs + ")";
            }
            return e.length === 1 ? b.find.matchesSelector(e[0], bs) ? [e[0]] : [] : b.find.matches(bs, e);
        },
        dir: function (bs, br, bu) {
            var e = [],
                bt = bs[br];
            while (bt && bt.nodeType !== 9 && (bu === K || bt.nodeType !== 1 || !b(bt).is(bu))) {
                if (bt.nodeType === 1) {
                    e.push(bt);
                }
                bt = bt[br];
            }
            return e;
        },
        nth: function (bu, e, bs, bt) {
            e = e || 1;
            var br = 0;
            for (; bu; bu = bu[bs]) {
                if (bu.nodeType === 1 && ++br === e) {
                    break;
                }
            }
            return bu;
        },
        sibling: function (bs, br) {
            var e = [];
            for (; bs; bs = bs.nextSibling) {
                if (bs.nodeType === 1 && bs !== br) {
                    e.push(bs);
                }
            }
            return e;
        }
    });

    function aA(bt, bs, e) {
        bs = bs || 0;
        if (b.isFunction(bs)) {
            return b.grep(bt, function (bv, bu) {
                var bw = !! bs.call(bv, bu, bv);
                return bw === e;
            });
        } else {
            if (bs.nodeType) {
                return b.grep(bt, function (bv, bu) {
                    return (bv === bs) === e;
                });
            } else {
                if (typeof bs === "string") {
                    var br = b.grep(bt, function (bu) {
                        return bu.nodeType === 1;
                    });
                    if (bm.test(bs)) {
                        return b.filter(bs, br, !e);
                    } else {
                        bs = b.filter(bs, br);
                    }
                }
            }
        }
        return b.grep(bt, function (bv, bu) {
            return (b.inArray(bv, bs) >= 0) === e;
        });
    }
    var ac = / jQuery\d+="(?:\d+|null)"/g,
        am = /^\s+/,
        R = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        d = /<([\w:]+)/,
        w = /<tbody/i,
        U = /<|&#?\w+;/,
        O = /<(?:script|object|embed|option|style)/i,
        n = /checked\s*(?:[^=]|=\s*.checked.)/i,
        bi = /\/(java|ecma)script/i,
        aI = /^\s*<!(?:\[CDATA\[|\-\-)/,
        ar = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            area: [1, "<map>", "</map>"],
            _default: [0, "", ""]
        };
    ar.optgroup = ar.option;
    ar.tbody = ar.tfoot = ar.colgroup = ar.caption = ar.thead;
    ar.th = ar.td;
    if (!b.support.htmlSerialize) {
        ar._default = [1, "div<div>", "</div>"];
    }
    b.fn.extend({
        text: function (e) {
            if (b.isFunction(e)) {
                return this.each(function (bs) {
                    var br = b(this);
                    br.text(e.call(this, bs, br.text()));
                });
            }
            if (typeof e !== "object" && e !== K) {
                return this.empty().append((this[0] && this[0].ownerDocument || ap).createTextNode(e));
            }
            return b.text(this);
        },
        wrapAll: function (e) {
            if (b.isFunction(e)) {
                return this.each(function (bs) {
                    b(this).wrapAll(e.call(this, bs));
                });
            }
            if (this[0]) {
                var br = b(e, this[0].ownerDocument).eq(0).clone(true);
                if (this[0].parentNode) {
                    br.insertBefore(this[0]);
                }
                br.map(function () {
                    var bs = this;
                    while (bs.firstChild && bs.firstChild.nodeType === 1) {
                        bs = bs.firstChild;
                    }
                    return bs;
                }).append(this);
            }
            return this;
        },
        wrapInner: function (e) {
            if (b.isFunction(e)) {
                return this.each(function (br) {
                    b(this).wrapInner(e.call(this, br));
                });
            }
            return this.each(function () {
                var br = b(this),
                    bs = br.contents();
                if (bs.length) {
                    bs.wrapAll(e);
                } else {
                    br.append(e);
                }
            });
        },
        wrap: function (e) {
            return this.each(function () {
                b(this).wrapAll(e);
            });
        },
        unwrap: function () {
            return this.parent().each(function () {
                if (!b.nodeName(this, "body")) {
                    b(this).replaceWith(this.childNodes);
                }
            }).end();
        },
        append: function () {
            return this.domManip(arguments, true, function (e) {
                if (this.nodeType === 1) {
                    this.appendChild(e);
                }
            });
        },
        prepend: function () {
            return this.domManip(arguments, true, function (e) {
                if (this.nodeType === 1) {
                    this.insertBefore(e, this.firstChild);
                }
            });
        },
        before: function () {
            if (this[0] && this[0].parentNode) {
                return this.domManip(arguments, false, function (br) {
                    this.parentNode.insertBefore(br, this);
                });
            } else {
                if (arguments.length) {
                    var e = b(arguments[0]);
                    e.push.apply(e, this.toArray());
                    return this.pushStack(e, "before", arguments);
                }
            }
        },
        after: function () {
            if (this[0] && this[0].parentNode) {
                return this.domManip(arguments, false, function (br) {
                    this.parentNode.insertBefore(br, this.nextSibling);
                });
            } else {
                if (arguments.length) {
                    var e = this.pushStack(this, "after", arguments);
                    e.push.apply(e, b(arguments[0]).toArray());
                    return e;
                }
            }
        },
        remove: function (e, bt) {
            for (var br = 0, bs;
                (bs = this[br]) != null; br++) {
                if (!e || b.filter(e, [bs]).length) {
                    if (!bt && bs.nodeType === 1) {
                        b.cleanData(bs.getElementsByTagName("*"));
                        b.cleanData([bs]);
                    }
                    if (bs.parentNode) {
                        bs.parentNode.removeChild(bs);
                    }
                }
            }
            return this;
        },
        empty: function () {
            for (var e = 0, br;
                (br = this[e]) != null; e++) {
                if (br.nodeType === 1) {
                    b.cleanData(br.getElementsByTagName("*"));
                }
                while (br.firstChild) {
                    br.removeChild(br.firstChild);
                }
            }
            return this;
        },
        clone: function (br, e) {
            br = br == null ? false : br;
            e = e == null ? br : e;
            return this.map(function () {
                return b.clone(this, br, e);
            });
        },
        html: function (bt) {
            if (bt === K) {
                return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(ac, "") : null;
            } else {
                if (typeof bt === "string" && !O.test(bt) && (b.support.leadingWhitespace || !am.test(bt)) && !ar[(d.exec(bt) || ["", ""])[1].toLowerCase()]) {
                    bt = bt.replace(R, "<$1></$2>");
                    try {
                        for (var bs = 0, br = this.length; bs < br; bs++) {
                            if (this[bs].nodeType === 1) {
                                b.cleanData(this[bs].getElementsByTagName("*"));
                                this[bs].innerHTML = bt;
                            }
                        }
                    } catch (bu) {
                        this.empty().append(bt);
                    }
                } else {
                    if (b.isFunction(bt)) {
                        this.each(function (bv) {
                            var e = b(this);
                            e.html(bt.call(this, bv, e.html()));
                        });
                    } else {
                        this.empty().append(bt);
                    }
                }
            }
            return this;
        },
        replaceWith: function (e) {
            if (this[0] && this[0].parentNode) {
                if (b.isFunction(e)) {
                    return this.each(function (bt) {
                        var bs = b(this),
                            br = bs.html();
                        bs.replaceWith(e.call(this, bt, br));
                    });
                }
                if (typeof e !== "string") {
                    e = b(e).detach();
                }
                return this.each(function () {
                    var bs = this.nextSibling,
                        br = this.parentNode;
                    b(this).remove();
                    if (bs) {
                        b(bs).before(e);
                    } else {
                        b(br).append(e);
                    }
                });
            } else {
                return this.length ? this.pushStack(b(b.isFunction(e) ? e() : e), "replaceWith", e) : this;
            }
        },
        detach: function (e) {
            return this.remove(e, true);
        },
        domManip: function (bx, bB, bA) {
            var bt, bu, bw, bz, by = bx[0],
                br = [];
            if (!b.support.checkClone && arguments.length === 3 && typeof by === "string" && n.test(by)) {
                return this.each(function () {
                    b(this).domManip(bx, bB, bA, true);
                });
            }
            if (b.isFunction(by)) {
                return this.each(function (bD) {
                    var bC = b(this);
                    bx[0] = by.call(this, bD, bB ? bC.html() : K);
                    bC.domManip(bx, bB, bA);
                });
            }
            if (this[0]) {
                bz = by && by.parentNode;
                if (b.support.parentNode && bz && bz.nodeType === 11 && bz.childNodes.length === this.length) {
                    bt = {
                        fragment: bz
                    };
                } else {
                    bt = b.buildFragment(bx, this, br);
                }
                bw = bt.fragment;
                if (bw.childNodes.length === 1) {
                    bu = bw = bw.firstChild;
                } else {
                    bu = bw.firstChild;
                } if (bu) {
                    bB = bB && b.nodeName(bu, "tr");
                    for (var bs = 0, e = this.length, bv = e - 1; bs < e; bs++) {
                        bA.call(bB ? a6(this[bs], bu) : this[bs], bt.cacheable || (e > 1 && bs < bv) ? b.clone(bw, true, true) : bw);
                    }
                }
                if (br.length) {
                    b.each(br, bl);
                }
            }
            return this;
        }
    });

    function a6(e, br) {
        return b.nodeName(e, "table") ? (e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody"))) : e;
    }

    function t(e, bx) {
        if (bx.nodeType !== 1 || !b.hasData(e)) {
            return;
        }
        var bw = b.expando,
            bt = b.data(e),
            bu = b.data(bx, bt);
        if ((bt = bt[bw])) {
            var by = bt.events;
            bu = bu[bw] = b.extend({}, bt);
            if (by) {
                delete bu.handle;
                bu.events = {};
                for (var bv in by) {
                    for (var bs = 0, br = by[bv].length; bs < br; bs++) {
                        b.event.add(bx, bv + (by[bv][bs].namespace ? "." : "") + by[bv][bs].namespace, by[bv][bs], by[bv][bs].data);
                    }
                }
            }
        }
    }

    function ad(br, e) {
        var bs;
        if (e.nodeType !== 1) {
            return;
        }
        if (e.clearAttributes) {
            e.clearAttributes();
        }
        if (e.mergeAttributes) {
            e.mergeAttributes(br);
        }
        bs = e.nodeName.toLowerCase();
        if (bs === "object") {
            e.outerHTML = br.outerHTML;
        } else {
            if (bs === "input" && (br.type === "checkbox" || br.type === "radio")) {
                if (br.checked) {
                    e.defaultChecked = e.checked = br.checked;
                }
                if (e.value !== br.value) {
                    e.value = br.value;
                }
            } else {
                if (bs === "option") {
                    e.selected = br.defaultSelected;
                } else {
                    if (bs === "input" || bs === "textarea") {
                        e.defaultValue = br.defaultValue;
                    }
                }
            }
        }
        e.removeAttribute(b.expando);
    }
    b.buildFragment = function (bv, bt, br) {
        var bu, e, bs, bw;
        if (bt && bt[0]) {
            bw = bt[0].ownerDocument || bt[0];
        }
        if (!bw.createDocumentFragment) {
            bw = ap;
        }
        if (bv.length === 1 && typeof bv[0] === "string" && bv[0].length < 512 && bw === ap && bv[0].charAt(0) === "<" && !O.test(bv[0]) && (b.support.checkClone || !n.test(bv[0]))) {
            e = true;
            bs = b.fragments[bv[0]];
            if (bs && bs !== 1) {
                bu = bs;
            }
        }
        if (!bu) {
            bu = bw.createDocumentFragment();
            b.clean(bv, bw, bu, br);
        }
        if (e) {
            b.fragments[bv[0]] = bs ? bu : 1;
        }
        return {
            fragment: bu,
            cacheable: e
        };
    };
    b.fragments = {};
    b.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (e, br) {
        b.fn[e] = function (bs) {
            var bv = [],
                by = b(bs),
                bx = this.length === 1 && this[0].parentNode;
            if (bx && bx.nodeType === 11 && bx.childNodes.length === 1 && by.length === 1) {
                by[br](this[0]);
                return this;
            } else {
                for (var bw = 0, bt = by.length; bw < bt; bw++) {
                    var bu = (bw > 0 ? this.clone(true) : this).get();
                    b(by[bw])[br](bu);
                    bv = bv.concat(bu);
                }
                return this.pushStack(bv, e, by.selector);
            }
        };
    });

    function bb(e) {
        if ("getElementsByTagName" in e) {
            return e.getElementsByTagName("*");
        } else {
            if ("querySelectorAll" in e) {
                return e.querySelectorAll("*");
            } else {
                return [];
            }
        }
    }

    function au(e) {
        if (e.type === "checkbox" || e.type === "radio") {
            e.defaultChecked = e.checked;
        }
    }

    function E(e) {
        if (b.nodeName(e, "input")) {
            au(e);
        } else {
            if ("getElementsByTagName" in e) {
                b.grep(e.getElementsByTagName("input"), au);
            }
        }
    }
    b.extend({
        clone: function (bu, bw, bs) {
            var bv = bu.cloneNode(true),
                e, br, bt;
            if ((!b.support.noCloneEvent || !b.support.noCloneChecked) && (bu.nodeType === 1 || bu.nodeType === 11) && !b.isXMLDoc(bu)) {
                ad(bu, bv);
                e = bb(bu);
                br = bb(bv);
                for (bt = 0; e[bt]; ++bt) {
                    if (br[bt]) {
                        ad(e[bt], br[bt]);
                    }
                }
            }
            if (bw) {
                t(bu, bv);
                if (bs) {
                    e = bb(bu);
                    br = bb(bv);
                    for (bt = 0; e[bt]; ++bt) {
                        t(e[bt], br[bt]);
                    }
                }
            }
            e = br = null;
            return bv;
        },
        clean: function (bs, bu, bD, bw) {
            var bB;
            bu = bu || ap;
            if (typeof bu.createElement === "undefined") {
                bu = bu.ownerDocument || bu[0] && bu[0].ownerDocument || ap;
            }
            var bE = [],
                bx;
            for (var bA = 0, bv;
                (bv = bs[bA]) != null; bA++) {
                if (typeof bv === "number") {
                    bv += "";
                }
                if (!bv) {
                    continue;
                }
                if (typeof bv === "string") {
                    if (!U.test(bv)) {
                        bv = bu.createTextNode(bv);
                    } else {
                        bv = bv.replace(R, "<$1></$2>");
                        var bG = (d.exec(bv) || ["", ""])[1].toLowerCase(),
                            bt = ar[bG] || ar._default,
                            bz = bt[0],
                            br = bu.createElement("div");
                        br.innerHTML = bt[1] + bv + bt[2];
                        while (bz--) {
                            br = br.lastChild;
                        }
                        if (!b.support.tbody) {
                            var e = w.test(bv),
                                by = bG === "table" && !e ? br.firstChild && br.firstChild.childNodes : bt[1] === "<table>" && !e ? br.childNodes : [];
                            for (bx = by.length - 1; bx >= 0; --bx) {
                                if (b.nodeName(by[bx], "tbody") && !by[bx].childNodes.length) {
                                    by[bx].parentNode.removeChild(by[bx]);
                                }
                            }
                        }
                        if (!b.support.leadingWhitespace && am.test(bv)) {
                            br.insertBefore(bu.createTextNode(am.exec(bv)[0]), br.firstChild);
                        }
                        bv = br.childNodes;
                    }
                }
                var bC;
                if (!b.support.appendChecked) {
                    if (bv[0] && typeof (bC = bv.length) === "number") {
                        for (bx = 0; bx < bC; bx++) {
                            E(bv[bx]);
                        }
                    } else {
                        E(bv);
                    }
                }
                if (bv.nodeType) {
                    bE.push(bv);
                } else {
                    bE = b.merge(bE, bv);
                }
            }
            if (bD) {
                bB = function (bH) {
                    return !bH.type || bi.test(bH.type);
                };
                for (bA = 0; bE[bA]; bA++) {
                    if (bw && b.nodeName(bE[bA], "script") && (!bE[bA].type || bE[bA].type.toLowerCase() === "text/javascript")) {
                        bw.push(bE[bA].parentNode ? bE[bA].parentNode.removeChild(bE[bA]) : bE[bA]);
                    } else {
                        if (bE[bA].nodeType === 1) {
                            var bF = b.grep(bE[bA].getElementsByTagName("script"), bB);
                            bE.splice.apply(bE, [bA + 1, 0].concat(bF));
                        }
                        bD.appendChild(bE[bA]);
                    }
                }
            }
            return bE;
        },
        cleanData: function (br) {
            var bu, bs, e = b.cache,
                bz = b.expando,
                bx = b.event.special,
                bw = b.support.deleteExpando;
            for (var bv = 0, bt;
                (bt = br[bv]) != null; bv++) {
                if (bt.nodeName && b.noData[bt.nodeName.toLowerCase()]) {
                    continue;
                }
                bs = bt[b.expando];
                if (bs) {
                    bu = e[bs] && e[bs][bz];
                    if (bu && bu.events) {
                        for (var by in bu.events) {
                            if (bx[by]) {
                                b.event.remove(bt, by);
                            } else {
                                b.removeEvent(bt, by, bu.handle);
                            }
                        }
                        if (bu.handle) {
                            bu.handle.elem = null;
                        }
                    }
                    if (bw) {
                        delete bt[b.expando];
                    } else {
                        if (bt.removeAttribute) {
                            bt.removeAttribute(b.expando);
                        }
                    }
                    delete e[bs];
                }
            }
        }
    });

    function bl(e, br) {
        if (br.src) {
            b.ajax({
                url: br.src,
                async: false,
                dataType: "script"
            });
        } else {
            b.globalEval((br.text || br.textContent || br.innerHTML || "").replace(aI, "/*$0*/"));
        } if (br.parentNode) {
            br.parentNode.removeChild(br);
        }
    }
    var af = /alpha\([^)]*\)/i,
        ao = /opacity=([^)]*)/,
        z = /([A-Z]|^ms)/g,
        a8 = /^-?\d+(?:px)?$/i,
        bk = /^-?\d/,
        I = /^([\-+])=([\-+.\de]+)/,
        a3 = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        }, ai = ["Left", "Right"],
        aY = ["Top", "Bottom"],
        V, aD, aS;
    b.fn.css = function (e, br) {
        if (arguments.length === 2 && br === K) {
            return this;
        }
        return b.access(this, e, br, true, function (bt, bs, bu) {
            return bu !== K ? b.style(bt, bs, bu) : b.css(bt, bs);
        });
    };
    b.extend({
        cssHooks: {
            opacity: {
                get: function (bs, br) {
                    if (br) {
                        var e = V(bs, "opacity", "opacity");
                        return e === "" ? "1" : e;
                    } else {
                        return bs.style.opacity;
                    }
                }
            }
        },
        cssNumber: {
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },
        cssProps: {
            "float": b.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function (bt, bs, bz, bu) {
            if (!bt || bt.nodeType === 3 || bt.nodeType === 8 || !bt.style) {
                return;
            }
            var bx, by, bv = b.camelCase(bs),
                br = bt.style,
                bA = b.cssHooks[bv];
            bs = b.cssProps[bv] || bv;
            if (bz !== K) {
                by = typeof bz;
                if (by === "string" && (bx = I.exec(bz))) {
                    bz = (+(bx[1] + 1) * +bx[2]) + parseFloat(b.css(bt, bs));
                    by = "number";
                }
                if (bz == null || by === "number" && isNaN(bz)) {
                    return;
                }
                if (by === "number" && !b.cssNumber[bv]) {
                    bz += "px";
                }
                if (!bA || !("set" in bA) || (bz = bA.set(bt, bz)) !== K) {
                    try {
                        br[bs] = bz;
                    } catch (bw) {}
                }
            } else {
                if (bA && "get" in bA && (bx = bA.get(bt, false, bu)) !== K) {
                    return bx;
                }
                return br[bs];
            }
        },
        css: function (bu, bt, br) {
            var bs, e;
            bt = b.camelCase(bt);
            e = b.cssHooks[bt];
            bt = b.cssProps[bt] || bt;
            if (bt === "cssFloat") {
                bt = "float";
            }
            if (e && "get" in e && (bs = e.get(bu, true, br)) !== K) {
                return bs;
            } else {
                if (V) {
                    return V(bu, bt);
                }
            }
        },
        swap: function (bt, bs, bu) {
            var e = {};
            for (var br in bs) {
                e[br] = bt.style[br];
                bt.style[br] = bs[br];
            }
            bu.call(bt);
            for (br in bs) {
                bt.style[br] = e[br];
            }
        }
    });
    b.curCSS = b.css;
    b.each(["height", "width"], function (br, e) {
        b.cssHooks[e] = {
            get: function (bu, bt, bs) {
                var bv;
                if (bt) {
                    if (bu.offsetWidth !== 0) {
                        return o(bu, e, bs);
                    } else {
                        b.swap(bu, a3, function () {
                            bv = o(bu, e, bs);
                        });
                    }
                    return bv;
                }
            },
            set: function (bs, bt) {
                if (a8.test(bt)) {
                    bt = parseFloat(bt);
                    if (bt >= 0) {
                        return bt + "px";
                    }
                } else {
                    return bt;
                }
            }
        };
    });
    if (!b.support.opacity) {
        b.cssHooks.opacity = {
            get: function (br, e) {
                return ao.test((e && br.currentStyle ? br.currentStyle.filter : br.style.filter) || "") ? (parseFloat(RegExp.$1) / 100) + "" : e ? "1" : "";
            },
            set: function (bu, bv) {
                var bt = bu.style,
                    br = bu.currentStyle,
                    e = b.isNaN(bv) ? "" : "alpha(opacity=" + bv * 100 + ")",
                    bs = br && br.filter || bt.filter || "";
                bt.zoom = 1;
                if (bv >= 1 && b.trim(bs.replace(af, "")) === "") {
                    bt.removeAttribute("filter");
                    if (br && !br.filter) {
                        return;
                    }
                }
                bt.filter = af.test(bs) ? bs.replace(af, e) : bs + " " + e;
            }
        };
    }
    b(function () {
        if (!b.support.reliableMarginRight) {
            b.cssHooks.marginRight = {
                get: function (bs, br) {
                    var e;
                    b.swap(bs, {
                        "display": "inline-block"
                    }, function () {
                        if (br) {
                            e = V(bs, "margin-right", "marginRight");
                        } else {
                            e = bs.style.marginRight;
                        }
                    });
                    return e;
                }
            };
        }
    });
    if (ap.defaultView && ap.defaultView.getComputedStyle) {
        aD = function (bu, bs) {
            var br, bt, e;
            bs = bs.replace(z, "-$1").toLowerCase();
            if (!(bt = bu.ownerDocument.defaultView)) {
                return K;
            }
            if ((e = bt.getComputedStyle(bu, null))) {
                br = e.getPropertyValue(bs);
                if (br === "" && !b.contains(bu.ownerDocument.documentElement, bu)) {
                    br = b.style(bu, bs);
                }
            }
            return br;
        };
    }
    if (ap.documentElement.currentStyle) {
        aS = function (bu, bs) {
            var bv, br = bu.currentStyle && bu.currentStyle[bs],
                e = bu.runtimeStyle && bu.runtimeStyle[bs],
                bt = bu.style;
            if (!a8.test(br) && bk.test(br)) {
                bv = bt.left;
                if (e) {
                    bu.runtimeStyle.left = bu.currentStyle.left;
                }
                bt.left = bs === "fontSize" ? "1em" : (br || 0);
                br = bt.pixelLeft + "px";
                bt.left = bv;
                if (e) {
                    bu.runtimeStyle.left = e;
                }
            }
            return br === "" ? "auto" : br;
        };
    }
    V = aD || aS;

    function o(bs, br, e) {
        var bu = br === "width" ? bs.offsetWidth : bs.offsetHeight,
            bt = br === "width" ? ai : aY;
        if (bu > 0) {
            if (e !== "border") {
                b.each(bt, function () {
                    if (!e) {
                        bu -= parseFloat(b.css(bs, "padding" + this)) || 0;
                    }
                    if (e === "margin") {
                        bu += parseFloat(b.css(bs, e + this)) || 0;
                    } else {
                        bu -= parseFloat(b.css(bs, "border" + this + "Width")) || 0;
                    }
                });
            }
            return bu + "px";
        }
        bu = V(bs, br, br);
        if (bu < 0 || bu == null) {
            bu = bs.style[br] || 0;
        }
        bu = parseFloat(bu) || 0;
        if (e) {
            b.each(bt, function () {
                bu += parseFloat(b.css(bs, "padding" + this)) || 0;
                if (e !== "padding") {
                    bu += parseFloat(b.css(bs, "border" + this + "Width")) || 0;
                }
                if (e === "margin") {
                    bu += parseFloat(b.css(bs, e + this)) || 0;
                }
            });
        }
        return bu + "px";
    }
    if (b.expr && b.expr.filters) {
        b.expr.filters.hidden = function (bs) {
            var br = bs.offsetWidth,
                e = bs.offsetHeight;
            return (br === 0 && e === 0) || (!b.support.reliableHiddenOffsets && (bs.style.display || b.css(bs, "display")) === "none");
        };
        b.expr.filters.visible = function (e) {
            return !b.expr.filters.hidden(e);
        };
    }
    var j = /%20/g,
        ak = /\[\]$/,
        bp = /\r?\n/g,
        bn = /#.*$/,
        ay = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
        aV = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        aH = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        aK = /^(?:GET|HEAD)$/,
        c = /^\/\//,
        L = /\?/,
        a2 = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        q = /^(?:select|textarea)/i,
        h = /\s+/,
        bo = /([?&])_=[^&]*/,
        J = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
        A = b.fn.load,
        W = {}, r = {}, az, s, aO = ["*/"] + ["*"];
    try {
        az = bh.href;
    } catch (aq) {
        az = ap.createElement("a");
        az.href = "";
        az = az.href;
    }
    s = J.exec(az.toLowerCase()) || [];

    function f(e) {
        return function (bu, bw) {
            if (typeof bu !== "string") {
                bw = bu;
                bu = "*";
            }
            if (b.isFunction(bw)) {
                var bt = bu.toLowerCase().split(h),
                    bs = 0,
                    bv = bt.length,
                    br, bx, by;
                for (; bs < bv; bs++) {
                    br = bt[bs];
                    by = /^\+/.test(br);
                    if (by) {
                        br = br.substr(1) || "*";
                    }
                    bx = e[br] = e[br] || [];
                    bx[by ? "unshift" : "push"](bw);
                }
            }
        };
    }

    function aQ(br, bA, bv, bz, bx, bt) {
        bx = bx || bA.dataTypes[0];
        bt = bt || {};
        bt[bx] = true;
        var bw = br[bx],
            bs = 0,
            e = bw ? bw.length : 0,
            bu = (br === W),
            by;
        for (; bs < e && (bu || !by); bs++) {
            by = bw[bs](bA, bv, bz);
            if (typeof by === "string") {
                if (!bu || bt[by]) {
                    by = K;
                } else {
                    bA.dataTypes.unshift(by);
                    by = aQ(br, bA, bv, bz, by, bt);
                }
            }
        }
        if ((bu || !by) && !bt["*"]) {
            by = aQ(br, bA, bv, bz, "*", bt);
        }
        return by;
    }

    function ah(bs, bt) {
        var br, e, bu = b.ajaxSettings.flatOptions || {};
        for (br in bt) {
            if (bt[br] !== K) {
                (bu[br] ? bs : (e || (e = {})))[br] = bt[br];
            }
        }
        if (e) {
            b.extend(true, bs, e);
        }
    }
    b.fn.extend({
        load: function (bs, bv, bw) {
            if (typeof bs !== "string" && A) {
                return A.apply(this, arguments);
            } else {
                if (!this.length) {
                    return this;
                }
            }
            var bu = bs.indexOf(" ");
            if (bu >= 0) {
                var e = bs.slice(bu, bs.length);
                bs = bs.slice(0, bu);
            }
            var bt = "GET";
            if (bv) {
                if (b.isFunction(bv)) {
                    bw = bv;
                    bv = K;
                } else {
                    if (typeof bv === "object") {
                        bv = b.param(bv, b.ajaxSettings.traditional);
                        bt = "POST";
                    }
                }
            }
            var br = this;
            b.ajax({
                url: bs,
                type: bt,
                dataType: "html",
                data: bv,
                complete: function (by, bx, bz) {
                    bz = by.responseText;
                    if (by.isResolved()) {
                        by.done(function (bA) {
                            bz = bA;
                        });
                        br.html(e ? b("<div>").append(bz.replace(a2, "")).find(e) : bz);
                    }
                    if (bw) {
                        br.each(bw, [bz, bx, by]);
                    }
                }
            });
            return this;
        },
        serialize: function () {
            return b.param(this.serializeArray());
        },
        serializeArray: function () {
            return this.map(function () {
                return this.elements ? b.makeArray(this.elements) : this;
            }).filter(function () {
                return this.name && !this.disabled && (this.checked || q.test(this.nodeName) || aV.test(this.type));
            }).map(function (e, br) {
                var bs = b(this).val();
                return bs == null ? null : b.isArray(bs) ? b.map(bs, function (bu, bt) {
                    return {
                        name: br.name,
                        value: bu.replace(bp, "\r\n")
                    };
                }) : {
                    name: br.name,
                    value: bs.replace(bp, "\r\n")
                };
            }).get();
        }
    });
    b.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (e, br) {
        b.fn[br] = function (bs) {
            return this.bind(br, bs);
        };
    });
    b.each(["get", "post"], function (e, br) {
        b[br] = function (bs, bu, bv, bt) {
            if (b.isFunction(bu)) {
                bt = bt || bv;
                bv = bu;
                bu = K;
            }
            return b.ajax({
                type: br,
                url: bs,
                data: bu,
                success: bv,
                dataType: bt
            });
        };
    });
    b.extend({
        getScript: function (e, br) {
            return b.get(e, K, br, "script");
        },
        getJSON: function (e, br, bs) {
            return b.get(e, br, bs, "json");
        },
        ajaxSetup: function (br, e) {
            if (e) {
                ah(br, b.ajaxSettings);
            } else {
                e = br;
                br = b.ajaxSettings;
            }
            ah(br, e);
            return br;
        },
        ajaxSettings: {
            url: az,
            isLocal: aH.test(s[1]),
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": aO
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": a7.String,
                "text html": true,
                "text json": b.parseJSON,
                "text xml": b.parseXML
            },
            flatOptions: {
                context: true,
                url: true
            }
        },
        ajaxPrefilter: f(W),
        ajaxTransport: f(r),
        ajax: function (bv, bt) {
            if (typeof bv === "object") {
                bt = bv;
                bv = K;
            }
            bt = bt || {};
            var bz = b.ajaxSetup({}, bt),
                bO = bz.context || bz,
                bC = bO !== bz && (bO.nodeType || bO instanceof b) ? b(bO) : b.event,
                bN = b.Deferred(),
                bJ = b._Deferred(),
                bx = bz.statusCode || {}, by, bD = {}, bK = {}, bM, bu, bH, bA, bE, bw = 0,
                bs, bG, bF = {
                    readyState: 0,
                    setRequestHeader: function (bP, bQ) {
                        if (!bw) {
                            var e = bP.toLowerCase();
                            bP = bK[e] = bK[e] || bP;
                            bD[bP] = bQ;
                        }
                        return this;
                    },
                    getAllResponseHeaders: function () {
                        return bw === 2 ? bM : null;
                    },
                    getResponseHeader: function (bP) {
                        var e;
                        if (bw === 2) {
                            if (!bu) {
                                bu = {};
                                while ((e = ay.exec(bM))) {
                                    bu[e[1].toLowerCase()] = e[2];
                                }
                            }
                            e = bu[bP.toLowerCase()];
                        }
                        return e === K ? null : e;
                    },
                    overrideMimeType: function (e) {
                        if (!bw) {
                            bz.mimeType = e;
                        }
                        return this;
                    },
                    abort: function (e) {
                        e = e || "abort";
                        if (bH) {
                            bH.abort(e);
                        }
                        bB(0, e);
                        return this;
                    }
                };

            function bB(bV, bQ, bW, bS) {
                if (bw === 2) {
                    return;
                }
                bw = 2;
                if (bA) {
                    clearTimeout(bA);
                }
                bH = K;
                bM = bS || "";
                bF.readyState = bV > 0 ? 4 : 0;
                var bP, b0, bZ, bT = bQ,
                    bU = bW ? bf(bz, bF, bW) : K,
                    bR, bY;
                if (bV >= 200 && bV < 300 || bV === 304) {
                    if (bz.ifModified) {
                        if ((bR = bF.getResponseHeader("Last-Modified"))) {
                            b.lastModified[by] = bR;
                        }
                        if ((bY = bF.getResponseHeader("Etag"))) {
                            b.etag[by] = bY;
                        }
                    }
                    if (bV === 304) {
                        bT = "notmodified";
                        bP = true;
                    } else {
                        try {
                            b0 = F(bz, bU);
                            bT = "success";
                            bP = true;
                        } catch (bX) {
                            bT = "parsererror";
                            bZ = bX;
                        }
                    }
                } else {
                    bZ = bT;
                    if (!bT || bV) {
                        bT = "error";
                        if (bV < 0) {
                            bV = 0;
                        }
                    }
                }
                bF.status = bV;
                bF.statusText = "" + (bQ || bT);
                if (bP) {
                    bN.resolveWith(bO, [b0, bT, bF]);
                } else {
                    bN.rejectWith(bO, [bF, bT, bZ]);
                }
                bF.statusCode(bx);
                bx = K;
                if (bs) {
                    bC.trigger("ajax" + (bP ? "Success" : "Error"), [bF, bz, bP ? b0 : bZ]);
                }
                bJ.resolveWith(bO, [bF, bT]);
                if (bs) {
                    bC.trigger("ajaxComplete", [bF, bz]);
                    if (!(--b.active)) {
                        b.event.trigger("ajaxStop");
                    }
                }
            }
            bN.promise(bF);
            bF.success = bF.done;
            bF.error = bF.fail;
            bF.complete = bJ.done;
            bF.statusCode = function (bP) {
                if (bP) {
                    var e;
                    if (bw < 2) {
                        for (e in bP) {
                            bx[e] = [bx[e], bP[e]];
                        }
                    } else {
                        e = bP[bF.status];
                        bF.then(e, e);
                    }
                }
                return this;
            };
            bz.url = ((bv || bz.url) + "").replace(bn, "").replace(c, s[1] + "//");
            bz.dataTypes = b.trim(bz.dataType || "*").toLowerCase().split(h);
            if (bz.crossDomain == null) {
                bE = J.exec(bz.url.toLowerCase());
                bz.crossDomain = !! (bE && (bE[1] != s[1] || bE[2] != s[2] || (bE[3] || (bE[1] === "http:" ? 80 : 443)) != (s[3] || (s[1] === "http:" ? 80 : 443))));
            }
            if (bz.data && bz.processData && typeof bz.data !== "string") {
                bz.data = b.param(bz.data, bz.traditional);
            }
            aQ(W, bz, bt, bF);
            if (bw === 2) {
                return false;
            }
            bs = bz.global;
            bz.type = bz.type.toUpperCase();
            bz.hasContent = !aK.test(bz.type);
            if (bs && b.active++ === 0) {
                b.event.trigger("ajaxStart");
            }
            if (!bz.hasContent) {
                if (bz.data) {
                    bz.url += (L.test(bz.url) ? "&" : "?") + bz.data;
                    delete bz.data;
                }
                by = bz.url;
                if (bz.cache === false) {
                    var br = b.now(),
                        bL = bz.url.replace(bo, "$1_=" + br);
                    bz.url = bL + ((bL === bz.url) ? (L.test(bz.url) ? "&" : "?") + "_=" + br : "");
                }
            }
            if (bz.data && bz.hasContent && bz.contentType !== false || bt.contentType) {
                bF.setRequestHeader("Content-Type", bz.contentType);
            }
            if (bz.ifModified) {
                by = by || bz.url;
                if (b.lastModified[by]) {
                    bF.setRequestHeader("If-Modified-Since", b.lastModified[by]);
                }
                if (b.etag[by]) {
                    bF.setRequestHeader("If-None-Match", b.etag[by]);
                }
            }
            bF.setRequestHeader("Accept", bz.dataTypes[0] && bz.accepts[bz.dataTypes[0]] ? bz.accepts[bz.dataTypes[0]] + (bz.dataTypes[0] !== "*" ? ", " + aO + "; q=0.01" : "") : bz.accepts["*"]);
            for (bG in bz.headers) {
                bF.setRequestHeader(bG, bz.headers[bG]);
            }
            if (bz.beforeSend && (bz.beforeSend.call(bO, bF, bz) === false || bw === 2)) {
                bF.abort();
                return false;
            }
            for (bG in {
                success: 1,
                error: 1,
                complete: 1
            }) {
                bF[bG](bz[bG]);
            }
            bH = aQ(r, bz, bt, bF);
            if (!bH) {
                bB(-1, "No Transport");
            } else {
                bF.readyState = 1;
                if (bs) {
                    bC.trigger("ajaxSend", [bF, bz]);
                }
                if (bz.async && bz.timeout > 0) {
                    bA = setTimeout(function () {
                        bF.abort("timeout");
                    }, bz.timeout);
                }
                try {
                    bw = 1;
                    bH.send(bD, bB);
                } catch (bI) {
                    if (bw < 2) {
                        bB(-1, bI);
                    } else {
                        b.error(bI);
                    }
                }
            }
            return bF;
        },
        param: function (e, bs) {
            var br = [],
                bu = function (bv, bw) {
                    bw = b.isFunction(bw) ? bw() : bw;
                    br[br.length] = encodeURIComponent(bv) + "=" + encodeURIComponent(bw);
                };
            if (bs === K) {
                bs = b.ajaxSettings.traditional;
            }
            if (b.isArray(e) || (e.jquery && !b.isPlainObject(e))) {
                b.each(e, function () {
                    bu(this.name, this.value);
                });
            } else {
                for (var bt in e) {
                    v(bt, e[bt], bs, bu);
                }
            }
            return br.join("&").replace(j, "+");
        }
    });

    function v(bs, bu, br, bt) {
        if (b.isArray(bu)) {
            b.each(bu, function (bw, bv) {
                if (br || ak.test(bs)) {
                    bt(bs, bv);
                } else {
                    v(bs + "[" + (typeof bv === "object" || b.isArray(bv) ? bw : "") + "]", bv, br, bt);
                }
            });
        } else {
            if (!br && bu != null && typeof bu === "object") {
                for (var e in bu) {
                    v(bs + "[" + e + "]", bu[e], br, bt);
                }
            } else {
                bt(bs, bu);
            }
        }
    }
    b.extend({
        active: 0,
        lastModified: {},
        etag: {}
    });

    function bf(bz, by, bv) {
        var br = bz.contents,
            bx = bz.dataTypes,
            bs = bz.responseFields,
            bu, bw, bt, e;
        for (bw in bs) {
            if (bw in bv) {
                by[bs[bw]] = bv[bw];
            }
        }
        while (bx[0] === "*") {
            bx.shift();
            if (bu === K) {
                bu = bz.mimeType || by.getResponseHeader("content-type");
            }
        }
        if (bu) {
            for (bw in br) {
                if (br[bw] && br[bw].test(bu)) {
                    bx.unshift(bw);
                    break;
                }
            }
        }
        if (bx[0] in bv) {
            bt = bx[0];
        } else {
            for (bw in bv) {
                if (!bx[0] || bz.converters[bw + " " + bx[0]]) {
                    bt = bw;
                    break;
                }
                if (!e) {
                    e = bw;
                }
            }
            bt = bt || e;
        } if (bt) {
            if (bt !== bx[0]) {
                bx.unshift(bt);
            }
            return bv[bt];
        }
    }

    function F(bD, bv) {
        if (bD.dataFilter) {
            bv = bD.dataFilter(bv, bD.dataType);
        }
        var bz = bD.dataTypes,
            bC = {}, bw, bA, bs = bz.length,
            bx, by = bz[0],
            bt, bu, bB, br, e;
        for (bw = 1; bw < bs; bw++) {
            if (bw === 1) {
                for (bA in bD.converters) {
                    if (typeof bA === "string") {
                        bC[bA.toLowerCase()] = bD.converters[bA];
                    }
                }
            }
            bt = by;
            by = bz[bw];
            if (by === "*") {
                by = bt;
            } else {
                if (bt !== "*" && bt !== by) {
                    bu = bt + " " + by;
                    bB = bC[bu] || bC["* " + by];
                    if (!bB) {
                        e = K;
                        for (br in bC) {
                            bx = br.split(" ");
                            if (bx[0] === bt || bx[0] === "*") {
                                e = bC[bx[1] + " " + by];
                                if (e) {
                                    br = bC[br];
                                    if (br === true) {
                                        bB = e;
                                    } else {
                                        if (e === true) {
                                            bB = br;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    if (!(bB || e)) {
                        b.error("No conversion from " + bu.replace(" ", " to "));
                    }
                    if (bB !== true) {
                        bv = bB ? bB(bv) : e(br(bv));
                    }
                }
            }
        }
        return bv;
    }
    var ax = b.now(),
        u = /(\=)\?(&|$)|\?\?/i;
    b.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            return b.expando + "_" + (ax++);
        }
    });
    b.ajaxPrefilter("json jsonp", function (bz, bw, by) {
        var bt = bz.contentType === "application/x-www-form-urlencoded" && (typeof bz.data === "string");
        if (bz.dataTypes[0] === "jsonp" || bz.jsonp !== false && (u.test(bz.url) || bt && u.test(bz.data))) {
            var bx, bs = bz.jsonpCallback = b.isFunction(bz.jsonpCallback) ? bz.jsonpCallback() : bz.jsonpCallback,
                bv = a7[bs],
                e = bz.url,
                bu = bz.data,
                br = "$1" + bs + "$2";
            if (bz.jsonp !== false) {
                e = e.replace(u, br);
                if (bz.url === e) {
                    if (bt) {
                        bu = bu.replace(u, br);
                    }
                    if (bz.data === bu) {
                        e += (/\?/.test(e) ? "&" : "?") + bz.jsonp + "=" + bs;
                    }
                }
            }
            bz.url = e;
            bz.data = bu;
            a7[bs] = function (bA) {
                bx = [bA];
            };
            by.always(function () {
                a7[bs] = bv;
                if (bx && b.isFunction(bv)) {
                    a7[bs](bx[0]);
                }
            });
            bz.converters["script json"] = function () {
                if (!bx) {
                    b.error(bs + " was not called");
                }
                return bx[0];
            };
            bz.dataTypes[0] = "json";
            return "script";
        }
    });
    b.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function (e) {
                b.globalEval(e);
                return e;
            }
        }
    });
    b.ajaxPrefilter("script", function (e) {
        if (e.cache === K) {
            e.cache = false;
        }
        if (e.crossDomain) {
            e.type = "GET";
            e.global = false;
        }
    });
    b.ajaxTransport("script", function (bs) {
        if (bs.crossDomain) {
            var e, br = ap.head || ap.getElementsByTagName("head")[0] || ap.documentElement;
            return {
                send: function (bt, bu) {
                    e = ap.createElement("script");
                    e.async = "async";
                    if (bs.scriptCharset) {
                        e.charset = bs.scriptCharset;
                    }
                    e.src = bs.url;
                    e.onload = e.onreadystatechange = function (bw, bv) {
                        if (bv || !e.readyState || /loaded|complete/.test(e.readyState)) {
                            e.onload = e.onreadystatechange = null;
                            if (br && e.parentNode) {
                                br.removeChild(e);
                            }
                            e = K;
                            if (!bv) {
                                bu(200, "success");
                            }
                        }
                    };
                    br.insertBefore(e, br.firstChild);
                },
                abort: function () {
                    if (e) {
                        e.onload(0, 1);
                    }
                }
            };
        }
    });
    var B = a7.ActiveXObject ? function () {
            for (var e in M) {
                M[e](0, 1);
            }
        } : false,
        y = 0,
        M;

    function aG() {
        try {
            return new a7.XMLHttpRequest();
        } catch (br) {}
    }

    function ae() {
        try {
            return new a7.ActiveXObject("Microsoft.XMLHTTP");
        } catch (br) {}
    }
    b.ajaxSettings.xhr = a7.ActiveXObject ? function () {
        return !this.isLocal && aG() || ae();
    } : aG;
    (function (e) {
        b.extend(b.support, {
            ajax: !! e,
            cors: !! e && ("withCredentials" in e)
        });
    })(b.ajaxSettings.xhr());
    if (b.support.ajax) {
        b.ajaxTransport(function (e) {
            if (!e.crossDomain || b.support.cors) {
                var br;
                return {
                    send: function (bx, bs) {
                        var bw = e.xhr(),
                            bv, bu;
                        if (e.username) {
                            bw.open(e.type, e.url, e.async, e.username, e.password);
                        } else {
                            bw.open(e.type, e.url, e.async);
                        } if (e.xhrFields) {
                            for (bu in e.xhrFields) {
                                bw[bu] = e.xhrFields[bu];
                            }
                        }
                        if (e.mimeType && bw.overrideMimeType) {
                            bw.overrideMimeType(e.mimeType);
                        }
                        if (!e.crossDomain && !bx["X-Requested-With"]) {
                            bx["X-Requested-With"] = "XMLHttpRequest";
                        }
                        try {
                            for (bu in bx) {
                                bw.setRequestHeader(bu, bx[bu]);
                            }
                        } catch (bt) {}
                        bw.send((e.hasContent && e.data) || null);
                        br = function (bG, bA) {
                            var bB, bz, by, bE, bD;
                            try {
                                if (br && (bA || bw.readyState === 4)) {
                                    br = K;
                                    if (bv) {
                                        bw.onreadystatechange = b.noop;
                                        if (B) {
                                            delete M[bv];
                                        }
                                    }
                                    if (bA) {
                                        if (bw.readyState !== 4) {
                                            bw.abort();
                                        }
                                    } else {
                                        bB = bw.status;
                                        by = bw.getAllResponseHeaders();
                                        bE = {};
                                        bD = bw.responseXML;
                                        if (bD && bD.documentElement) {
                                            bE.xml = bD;
                                        }
                                        bE.text = bw.responseText;
                                        try {
                                            bz = bw.statusText;
                                        } catch (bF) {
                                            bz = "";
                                        }
                                        if (!bB && e.isLocal && !e.crossDomain) {
                                            bB = bE.text ? 200 : 404;
                                        } else {
                                            if (bB === 1223) {
                                                bB = 204;
                                            }
                                        }
                                    }
                                }
                            } catch (bC) {
                                if (!bA) {
                                    bs(-1, bC);
                                }
                            }
                            if (bE) {
                                bs(bB, bz, bE, by);
                            }
                        };
                        if (!e.async || bw.readyState === 4) {
                            br();
                        } else {
                            bv = ++y;
                            if (B) {
                                if (!M) {
                                    M = {};
                                    b(a7).unload(B);
                                }
                                M[bv] = br;
                            }
                            bw.onreadystatechange = br;
                        }
                    },
                    abort: function () {
                        if (br) {
                            br(0, 1);
                        }
                    }
                };
            }
        });
    }
    var Q = {}, a4, m, aw = /^(?:toggle|show|hide)$/,
        aM = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
        aZ, aC = [
            ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
            ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
            ["opacity"]
        ],
        a0;
    b.fn.extend({
        show: function (bt, bw, bv) {
            var bs, bu;
            if (bt || bt === 0) {
                return this.animate(aX("show", 3), bt, bw, bv);
            } else {
                for (var br = 0, e = this.length; br < e; br++) {
                    bs = this[br];
                    if (bs.style) {
                        bu = bs.style.display;
                        if (!b._data(bs, "olddisplay") && bu === "none") {
                            bu = bs.style.display = "";
                        }
                        if (bu === "" && b.css(bs, "display") === "none") {
                            b._data(bs, "olddisplay", x(bs.nodeName));
                        }
                    }
                }
                for (br = 0; br < e; br++) {
                    bs = this[br];
                    if (bs.style) {
                        bu = bs.style.display;
                        if (bu === "" || bu === "none") {
                            bs.style.display = b._data(bs, "olddisplay") || "";
                        }
                    }
                }
                return this;
            }
        },
        hide: function (bs, bv, bu) {
            if (bs || bs === 0) {
                return this.animate(aX("hide", 3), bs, bv, bu);
            } else {
                for (var br = 0, e = this.length; br < e; br++) {
                    if (this[br].style) {
                        var bt = b.css(this[br], "display");
                        if (bt !== "none" && !b._data(this[br], "olddisplay")) {
                            b._data(this[br], "olddisplay", bt);
                        }
                    }
                }
                for (br = 0; br < e; br++) {
                    if (this[br].style) {
                        this[br].style.display = "none";
                    }
                }
                return this;
            }
        },
        _toggle: b.fn.toggle,
        toggle: function (bs, br, bt) {
            var e = typeof bs === "boolean";
            if (b.isFunction(bs) && b.isFunction(br)) {
                this._toggle.apply(this, arguments);
            } else {
                if (bs == null || e) {
                    this.each(function () {
                        var bu = e ? bs : b(this).is(":hidden");
                        b(this)[bu ? "show" : "hide"]();
                    });
                } else {
                    this.animate(aX("toggle", 3), bs, br, bt);
                }
            }
            return this;
        },
        fadeTo: function (e, bt, bs, br) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({
                opacity: bt
            }, e, bs, br);
        },
        animate: function (bu, br, bt, bs) {
            var e = b.speed(br, bt, bs);
            if (b.isEmptyObject(bu)) {
                return this.each(e.complete, [false]);
            }
            bu = b.extend({}, bu);
            return this[e.queue === false ? "each" : "queue"](function () {
                if (e.queue === false) {
                    b._mark(this);
                }
                var by = b.extend({}, e),
                    bF = this.nodeType === 1,
                    bC = bF && b(this).is(":hidden"),
                    bv, bz, bx, bE, bD, bB, bw, bA, bG;
                by.animatedProperties = {};
                for (bx in bu) {
                    bv = b.camelCase(bx);
                    if (bx !== bv) {
                        bu[bv] = bu[bx];
                        delete bu[bx];
                    }
                    bz = bu[bv];
                    if (b.isArray(bz)) {
                        by.animatedProperties[bv] = bz[1];
                        bz = bu[bv] = bz[0];
                    } else {
                        by.animatedProperties[bv] = by.specialEasing && by.specialEasing[bv] || by.easing || "swing";
                    } if (bz === "hide" && bC || bz === "show" && !bC) {
                        return by.complete.call(this);
                    }
                    if (bF && (bv === "height" || bv === "width")) {
                        by.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY];
                        if (b.css(this, "display") === "inline" && b.css(this, "float") === "none") {
                            if (!b.support.inlineBlockNeedsLayout) {
                                this.style.display = "inline-block";
                            } else {
                                bE = x(this.nodeName);
                                if (bE === "inline") {
                                    this.style.display = "inline-block";
                                } else {
                                    this.style.display = "inline";
                                    this.style.zoom = 1;
                                }
                            }
                        }
                    }
                }
                if (by.overflow != null) {
                    this.style.overflow = "hidden";
                }
                for (bx in bu) {
                    bD = new b.fx(this, by, bx);
                    bz = bu[bx];
                    if (aw.test(bz)) {
                        bD[bz === "toggle" ? bC ? "show" : "hide" : bz]();
                    } else {
                        bB = aM.exec(bz);
                        bw = bD.cur();
                        if (bB) {
                            bA = parseFloat(bB[2]);
                            bG = bB[3] || (b.cssNumber[bx] ? "" : "px");
                            if (bG !== "px") {
                                b.style(this, bx, (bA || 1) + bG);
                                bw = ((bA || 1) / bD.cur()) * bw;
                                b.style(this, bx, bw + bG);
                            }
                            if (bB[1]) {
                                bA = ((bB[1] === "-=" ? -1 : 1) * bA) + bw;
                            }
                            bD.custom(bw, bA, bG);
                        } else {
                            bD.custom(bw, bz, "");
                        }
                    }
                }
                return true;
            });
        },
        stop: function (br, e) {
            if (br) {
                this.queue([]);
            }
            this.each(function () {
                var bt = b.timers,
                    bs = bt.length;
                if (!e) {
                    b._unmark(true, this);
                }
                while (bs--) {
                    if (bt[bs].elem === this) {
                        if (e) {
                            bt[bs](true);
                        }
                        bt.splice(bs, 1);
                    }
                }
            });
            if (!e) {
                this.dequeue();
            }
            return this;
        }
    });

    function bc() {
        setTimeout(an, 0);
        return (a0 = b.now());
    }

    function an() {
        a0 = K;
    }

    function aX(br, e) {
        var bs = {};
        b.each(aC.concat.apply([], aC.slice(0, e)), function () {
            bs[this] = br;
        });
        return bs;
    }
    b.each({
        slideDown: aX("show", 1),
        slideUp: aX("hide", 1),
        slideToggle: aX("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function (e, br) {
        b.fn[e] = function (bs, bu, bt) {
            return this.animate(br, bs, bu, bt);
        };
    });
    b.extend({
        speed: function (bs, bt, br) {
            var e = bs && typeof bs === "object" ? b.extend({}, bs) : {
                complete: br || !br && bt || b.isFunction(bs) && bs,
                duration: bs,
                easing: br && bt || bt && !b.isFunction(bt) && bt
            };
            e.duration = b.fx.off ? 0 : typeof e.duration === "number" ? e.duration : e.duration in b.fx.speeds ? b.fx.speeds[e.duration] : b.fx.speeds._default;
            e.old = e.complete;
            e.complete = function (bu) {
                if (b.isFunction(e.old)) {
                    e.old.call(this);
                }
                if (e.queue !== false) {
                    b.dequeue(this);
                } else {
                    if (bu !== false) {
                        b._unmark(this);
                    }
                }
            };
            return e;
        },
        easing: {
            linear: function (bs, bt, e, br) {
                return e + br * bs;
            },
            swing: function (bs, bt, e, br) {
                return ((-Math.cos(bs * Math.PI) / 2) + 0.5) * br + e;
            }
        },
        timers: [],
        fx: function (br, e, bs) {
            this.options = e;
            this.elem = br;
            this.prop = bs;
            e.orig = e.orig || {};
        }
    });
    b.fx.prototype = {
        update: function () {
            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this);
            }(b.fx.step[this.prop] || b.fx.step._default)(this);
        },
        cur: function () {
            if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
                return this.elem[this.prop];
            }
            var e, br = b.css(this.elem, this.prop);
            return isNaN(e = parseFloat(br)) ? !br || br === "auto" ? 0 : br : e;
        },
        custom: function (bv, bu, bt) {
            var e = this,
                bs = b.fx;
            this.startTime = a0 || bc();
            this.start = bv;
            this.end = bu;
            this.unit = bt || this.unit || (b.cssNumber[this.prop] ? "" : "px");
            this.now = this.start;
            this.pos = this.state = 0;

            function br(bw) {
                return e.step(bw);
            }
            br.elem = this.elem;
            if (br() && b.timers.push(br) && !aZ) {
                aZ = setInterval(bs.tick, bs.interval);
            }
        },
        show: function () {
            this.options.orig[this.prop] = b.style(this.elem, this.prop);
            this.options.show = true;
            this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
            b(this.elem).show();
        },
        hide: function () {
            this.options.orig[this.prop] = b.style(this.elem, this.prop);
            this.options.hide = true;
            this.custom(this.cur(), 0);
        },
        step: function (bu) {
            var bt = a0 || bc(),
                e = true,
                bv = this.elem,
                br = this.options,
                bs, bx;
            if (bu || bt >= br.duration + this.startTime) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();
                br.animatedProperties[this.prop] = true;
                for (bs in br.animatedProperties) {
                    if (br.animatedProperties[bs] !== true) {
                        e = false;
                    }
                }
                if (e) {
                    if (br.overflow != null && !b.support.shrinkWrapBlocks) {
                        b.each(["", "X", "Y"], function (by, bz) {
                            bv.style["overflow" + bz] = br.overflow[by];
                        });
                    }
                    if (br.hide) {
                        b(bv).hide();
                    }
                    if (br.hide || br.show) {
                        for (var bw in br.animatedProperties) {
                            b.style(bv, bw, br.orig[bw]);
                        }
                    }
                    br.complete.call(bv);
                }
                return false;
            } else {
                if (br.duration == Infinity) {
                    this.now = bt;
                } else {
                    bx = bt - this.startTime;
                    this.state = bx / br.duration;
                    this.pos = b.easing[br.animatedProperties[this.prop]](this.state, bx, 0, 1, br.duration);
                    this.now = this.start + ((this.end - this.start) * this.pos);
                }
                this.update();
            }
            return true;
        }
    };
    b.extend(b.fx, {
        tick: function () {
            for (var br = b.timers, e = 0; e < br.length; ++e) {
                if (!br[e]()) {
                    br.splice(e--, 1);
                }
            }
            if (!br.length) {
                b.fx.stop();
            }
        },
        interval: 13,
        stop: function () {
            clearInterval(aZ);
            aZ = null;
        },
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function (e) {
                b.style(e.elem, "opacity", e.now);
            },
            _default: function (e) {
                if (e.elem.style && e.elem.style[e.prop] != null) {
                    e.elem.style[e.prop] = (e.prop === "width" || e.prop === "height" ? Math.max(0, e.now) : e.now) + e.unit;
                } else {
                    e.elem[e.prop] = e.now;
                }
            }
        }
    });
    if (b.expr && b.expr.filters) {
        b.expr.filters.animated = function (e) {
            return b.grep(b.timers, function (br) {
                return e === br.elem;
            }).length;
        };
    }

    function x(bt) {
        if (!Q[bt]) {
            var e = ap.body,
                br = b("<" + bt + ">").appendTo(e),
                bs = br.css("display");
            br.remove();
            if (bs === "none" || bs === "") {
                if (!a4) {
                    a4 = ap.createElement("iframe");
                    a4.frameBorder = a4.width = a4.height = 0;
                }
                e.appendChild(a4);
                if (!m || !a4.createElement) {
                    m = (a4.contentWindow || a4.contentDocument).document;
                    m.write((ap.compatMode === "CSS1Compat" ? "<!doctype html>" : "") + "<html><body>");
                    m.close();
                }
                br = m.createElement(bt);
                m.body.appendChild(br);
                bs = b.css(br, "display");
                e.removeChild(a4);
            }
            Q[bt] = bs;
        }
        return Q[bt];
    }
    var T = /^t(?:able|d|h)$/i,
        Z = /^(?:body|html)$/i;
    if ("getBoundingClientRect" in ap.documentElement) {
        b.fn.offset = function (bE) {
            var bu = this[0],
                bx;
            if (bE) {
                return this.each(function (e) {
                    b.offset.setOffset(this, bE, e);
                });
            }
            if (!bu || !bu.ownerDocument) {
                return null;
            }
            if (bu === bu.ownerDocument.body) {
                return b.offset.bodyOffset(bu);
            }
            try {
                bx = bu.getBoundingClientRect();
            } catch (bB) {}
            var bD = bu.ownerDocument,
                bs = bD.documentElement;
            if (!bx || !b.contains(bs, bu)) {
                return bx ? {
                    top: bx.top,
                    left: bx.left
                } : {
                    top: 0,
                    left: 0
                };
            }
            var by = bD.body,
                bz = aF(bD),
                bw = bs.clientTop || by.clientTop || 0,
                bA = bs.clientLeft || by.clientLeft || 0,
                br = bz.pageYOffset || b.support.boxModel && bs.scrollTop || by.scrollTop,
                bv = bz.pageXOffset || b.support.boxModel && bs.scrollLeft || by.scrollLeft,
                bC = bx.top + br - bw,
                bt = bx.left + bv - bA;
            return {
                top: bC,
                left: bt
            };
        };
    } else {
        b.fn.offset = function (bB) {
            var bv = this[0];
            if (bB) {
                return this.each(function (bC) {
                    b.offset.setOffset(this, bB, bC);
                });
            }
            if (!bv || !bv.ownerDocument) {
                return null;
            }
            if (bv === bv.ownerDocument.body) {
                return b.offset.bodyOffset(bv);
            }
            b.offset.initialize();
            var by, bs = bv.offsetParent,
                br = bv,
                bA = bv.ownerDocument,
                bt = bA.documentElement,
                bw = bA.body,
                bx = bA.defaultView,
                e = bx ? bx.getComputedStyle(bv, null) : bv.currentStyle,
                bz = bv.offsetTop,
                bu = bv.offsetLeft;
            while ((bv = bv.parentNode) && bv !== bw && bv !== bt) {
                if (b.offset.supportsFixedPosition && e.position === "fixed") {
                    break;
                }
                by = bx ? bx.getComputedStyle(bv, null) : bv.currentStyle;
                bz -= bv.scrollTop;
                bu -= bv.scrollLeft;
                if (bv === bs) {
                    bz += bv.offsetTop;
                    bu += bv.offsetLeft;
                    if (b.offset.doesNotAddBorder && !(b.offset.doesAddBorderForTableAndCells && T.test(bv.nodeName))) {
                        bz += parseFloat(by.borderTopWidth) || 0;
                        bu += parseFloat(by.borderLeftWidth) || 0;
                    }
                    br = bs;
                    bs = bv.offsetParent;
                }
                if (b.offset.subtractsBorderForOverflowNotVisible && by.overflow !== "visible") {
                    bz += parseFloat(by.borderTopWidth) || 0;
                    bu += parseFloat(by.borderLeftWidth) || 0;
                }
                e = by;
            }
            if (e.position === "relative" || e.position === "static") {
                bz += bw.offsetTop;
                bu += bw.offsetLeft;
            }
            if (b.offset.supportsFixedPosition && e.position === "fixed") {
                bz += Math.max(bt.scrollTop, bw.scrollTop);
                bu += Math.max(bt.scrollLeft, bw.scrollLeft);
            }
            return {
                top: bz,
                left: bu
            };
        };
    }
    b.offset = {
        initialize: function () {
            var e = ap.body,
                br = ap.createElement("div"),
                bu, bw, bv, bx, bs = parseFloat(b.css(e, "marginTop")) || 0,
                bt = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
            b.extend(br.style, {
                position: "absolute",
                top: 0,
                left: 0,
                margin: 0,
                border: 0,
                width: "1px",
                height: "1px",
                visibility: "hidden"
            });
            br.innerHTML = bt;
            e.insertBefore(br, e.firstChild);
            bu = br.firstChild;
            bw = bu.firstChild;
            bx = bu.nextSibling.firstChild.firstChild;
            this.doesNotAddBorder = (bw.offsetTop !== 5);
            this.doesAddBorderForTableAndCells = (bx.offsetTop === 5);
            bw.style.position = "fixed";
            bw.style.top = "20px";
            this.supportsFixedPosition = (bw.offsetTop === 20 || bw.offsetTop === 15);
            bw.style.position = bw.style.top = "";
            bu.style.overflow = "hidden";
            bu.style.position = "relative";
            this.subtractsBorderForOverflowNotVisible = (bw.offsetTop === -5);
            this.doesNotIncludeMarginInBodyOffset = (e.offsetTop !== bs);
            e.removeChild(br);
            b.offset.initialize = b.noop;
        },
        bodyOffset: function (e) {
            var bs = e.offsetTop,
                br = e.offsetLeft;
            b.offset.initialize();
            if (b.offset.doesNotIncludeMarginInBodyOffset) {
                bs += parseFloat(b.css(e, "marginTop")) || 0;
                br += parseFloat(b.css(e, "marginLeft")) || 0;
            }
            return {
                top: bs,
                left: br
            };
        },
        setOffset: function (bt, bC, bw) {
            var bx = b.css(bt, "position");
            if (bx === "static") {
                bt.style.position = "relative";
            }
            var bv = b(bt),
                br = bv.offset(),
                e = b.css(bt, "top"),
                bA = b.css(bt, "left"),
                bB = (bx === "absolute" || bx === "fixed") && b.inArray("auto", [e, bA]) > -1,
                bz = {}, by = {}, bs, bu;
            if (bB) {
                by = bv.position();
                bs = by.top;
                bu = by.left;
            } else {
                bs = parseFloat(e) || 0;
                bu = parseFloat(bA) || 0;
            } if (b.isFunction(bC)) {
                bC = bC.call(bt, bw, br);
            }
            if (bC.top != null) {
                bz.top = (bC.top - br.top) + bs;
            }
            if (bC.left != null) {
                bz.left = (bC.left - br.left) + bu;
            }
            if ("using" in bC) {
                bC.using.call(bt, bz);
            } else {
                bv.css(bz);
            }
        }
    };
    b.fn.extend({
        position: function () {
            if (!this[0]) {
                return null;
            }
            var bs = this[0],
                br = this.offsetParent(),
                bt = this.offset(),
                e = Z.test(br[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : br.offset();
            bt.top -= parseFloat(b.css(bs, "marginTop")) || 0;
            bt.left -= parseFloat(b.css(bs, "marginLeft")) || 0;
            e.top += parseFloat(b.css(br[0], "borderTopWidth")) || 0;
            e.left += parseFloat(b.css(br[0], "borderLeftWidth")) || 0;
            return {
                top: bt.top - e.top,
                left: bt.left - e.left
            };
        },
        offsetParent: function () {
            return this.map(function () {
                var e = this.offsetParent || ap.body;
                while (e && (!Z.test(e.nodeName) && b.css(e, "position") === "static")) {
                    e = e.offsetParent;
                }
                return e;
            });
        }
    });
    b.each(["Left", "Top"], function (br, e) {
        var bs = "scroll" + e;
        b.fn[bs] = function (bv) {
            var bt, bu;
            if (bv === K) {
                bt = this[0];
                if (!bt) {
                    return null;
                }
                bu = aF(bt);
                return bu ? ("pageXOffset" in bu) ? bu[br ? "pageYOffset" : "pageXOffset"] : b.support.boxModel && bu.document.documentElement[bs] || bu.document.body[bs] : bt[bs];
            }
            return this.each(function () {
                bu = aF(this);
                if (bu) {
                    bu.scrollTo(!br ? bv : b(bu).scrollLeft(), br ? bv : b(bu).scrollTop());
                } else {
                    this[bs] = bv;
                }
            });
        };
    });

    function aF(e) {
        return b.isWindow(e) ? e : e.nodeType === 9 ? e.defaultView || e.parentWindow : false;
    }
    b.each(["Height", "Width"], function (br, e) {
        var bs = e.toLowerCase();
        b.fn["inner" + e] = function () {
            var bt = this[0];
            return bt && bt.style ? parseFloat(b.css(bt, bs, "padding")) : null;
        };
        b.fn["outer" + e] = function (bu) {
            var bt = this[0];
            return bt && bt.style ? parseFloat(b.css(bt, bs, bu ? "margin" : "border")) : null;
        };
        b.fn[bs] = function (bv) {
            var bw = this[0];
            if (!bw) {
                return bv == null ? null : this;
            }
            if (b.isFunction(bv)) {
                return this.each(function (bA) {
                    var bz = b(this);
                    bz[bs](bv.call(this, bA, bz[bs]()));
                });
            }
            if (b.isWindow(bw)) {
                var bx = bw.document.documentElement["client" + e],
                    bt = bw.document.body;
                return bw.document.compatMode === "CSS1Compat" && bx || bt && bt["client" + e] || bx;
            } else {
                if (bw.nodeType === 9) {
                    return Math.max(bw.documentElement["client" + e], bw.body["scroll" + e], bw.documentElement["scroll" + e], bw.body["offset" + e], bw.documentElement["offset" + e]);
                } else {
                    if (bv === K) {
                        var by = b.css(bw, bs),
                            bu = parseFloat(by);
                        return b.isNaN(bu) ? by : bu;
                    } else {
                        return this.css(bs, typeof bv === "string" ? bv : bv + "px");
                    }
                }
            }
        };
    });
    a7.jQuery = a7.$ = b;
})(window);
/*
 * jQuery Templates Plugin 1.0.0pre
 * http://github.com/jquery/jquery-tmpl
 * Requires jQuery 1.4.2
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function (i, f) {
    var t = i.fn.domManip,
        h = "_tmplitem",
        u = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,
        p = {}, e = {}, y, x = {
            key: 0,
            data: {}
        }, w = 0,
        q = 0,
        g = [];

    function k(B, A, D, E) {
        var C = {
            data: E || (E === 0 || E === false) ? E : (A ? A.data : {}),
            _wrap: A ? A._wrap : null,
            tmpl: null,
            parent: A || null,
            nodes: [],
            calls: c,
            nest: b,
            wrap: n,
            html: r,
            update: z
        };
        if (B) {
            i.extend(C, B, {
                nodes: [],
                parent: A
            });
        }
        if (D) {
            C.tmpl = D;
            C._ctnt = C._ctnt || C.tmpl(i, C);
            C.key = ++w;
            (g.length ? e : p)[w] = C;
        }
        return C;
    }
    i.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (A, B) {
        i.fn[A] = function (C) {
            var F = [],
                I = i(C),
                E, G, D, J, H = this.length === 1 && this[0].parentNode;
            y = p || {};
            if (H && H.nodeType === 11 && H.childNodes.length === 1 && I.length === 1) {
                I[B](this[0]);
                F = this;
            } else {
                for (G = 0, D = I.length; G < D; G++) {
                    q = G;
                    E = (G > 0 ? this.clone(true) : this).get();
                    i(I[G])[B](E);
                    F = F.concat(E);
                }
                q = 0;
                F = this.pushStack(F, A, I.selector);
            }
            J = y;
            y = null;
            i.tmpl.complete(J);
            return F;
        };
    });
    i.fn.extend({
        tmpl: function (C, B, A) {
            return i.tmpl(this[0], C, B, A);
        },
        tmplItem: function () {
            return i.tmplItem(this[0]);
        },
        template: function (A) {
            return i.template(A, this[0]);
        },
        domManip: function (E, H, G, I) {
            if (E[0] && i.isArray(E[0])) {
                var B = i.makeArray(arguments),
                    A = E[0],
                    F = A.length,
                    C = 0,
                    D;
                while (C < F && !(D = i.data(A[C++], "tmplItem"))) {}
                if (D && q) {
                    B[2] = function (J) {
                        i.tmpl.afterManip(this, J, G);
                    };
                }
                t.apply(this, B);
            } else {
                t.apply(this, arguments);
            }
            q = 0;
            if (!y) {
                i.tmpl.complete(p);
            }
            return this;
        }
    });
    i.extend({
        tmpl: function (C, F, E, B) {
            var D, A = !B;
            if (A) {
                B = x;
                C = i.template[C] || i.template(null, C);
                e = {};
            } else {
                if (!C) {
                    C = B.tmpl;
                    p[B.key] = B;
                    B.nodes = [];
                    if (B.wrapped) {
                        s(B, B.wrapped);
                    }
                    return i(m(B, null, B.tmpl(i, B)));
                }
            } if (!C) {
                return [];
            }
            if (typeof F === "function") {
                F = F.call(B || {});
            }
            if (E && E.wrapped) {
                s(E, E.wrapped);
            }
            D = i.isArray(F) ? i.map(F, function (G) {
                return G ? k(E, B, C, G) : null;
            }) : [k(E, B, C, F)];
            return A ? i(m(B, null, D)) : D;
        },
        tmplItem: function (B) {
            var A;
            if (B instanceof i) {
                B = B[0];
            }
            while (B && B.nodeType === 1 && !(A = i.data(B, "tmplItem")) && (B = B.parentNode)) {}
            return A || x;
        },
        template: function (B, A) {
            if (A) {
                if (typeof A === "string") {
                    A = l(A);
                } else {
                    if (A instanceof i) {
                        A = A[0] || {};
                    }
                } if (A.nodeType) {
                    A = i.data(A, "tmpl") || i.data(A, "tmpl", l(A.innerHTML));
                }
                return typeof B === "string" ? (i.template[B] = A) : A;
            }
            return B ? (typeof B !== "string" ? i.template(null, B) : (i.template[B] || i.template(null, u.test(B) ? B : i(B)))) : null;
        },
        encode: function (A) {
            return ("" + A).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;");
        }
    });
    i.extend(i.tmpl, {
        tag: {
            "tmpl": {
                _default: {
                    $2: "null"
                },
                open: "if($notnull_1){__=__.concat($item.nest($1,$2));}"
            },
            "wrap": {
                _default: {
                    $2: "null"
                },
                open: "$item.calls(__,$1,$2);__=[];",
                close: "call=$item.calls();__=call._.concat($item.wrap(call,__));"
            },
            "each": {
                _default: {
                    $2: "$index, $value"
                },
                open: "if($notnull_1){$.each($1a,function($2){with(this){",
                close: "}});}"
            },
            "if": {
                open: "if(($notnull_1) && $1a){",
                close: "}"
            },
            "else": {
                _default: {
                    $1: "true"
                },
                open: "}else if(($notnull_1) && $1a){"
            },
            "html": {
                open: "if($notnull_1){__.push($1a);}"
            },
            "=": {
                _default: {
                    $1: "$data"
                },
                open: "if($notnull_1){__.push($.encode($1a));}"
            },
            "!": {
                open: ""
            }
        },
        complete: function (A) {
            p = {};
        },
        afterManip: function v(C, A, D) {
            var B = A.nodeType === 11 ? i.makeArray(A.childNodes) : A.nodeType === 1 ? [A] : [];
            D.call(C, A);
            o(B);
            q++;
        }
    });

    function m(A, E, C) {
        var D, B = C ? i.map(C, function (F) {
                return (typeof F === "string") ? (A.key ? F.replace(/(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g, "$1 " + h + '="' + A.key + '" $2') : F) : m(F, A, F._ctnt);
            }) : A;
        if (E) {
            return B;
        }
        B = B.join("");
        B.replace(/^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/, function (G, H, F, I) {
            D = i(F).get();
            o(D);
            if (H) {
                D = a(H).concat(D);
            }
            if (I) {
                D = D.concat(a(I));
            }
        });
        return D ? D : a(B);
    }

    function a(B) {
        var A = document.createElement("div");
        A.innerHTML = B;
        return i.makeArray(A.childNodes);
    }

    function l(A) {
        return new Function("jQuery", "$item", "var $=jQuery,call,__=[],$data=$item.data;" + "with($data){__.push('" + i.trim(A).replace(/([\\'])/g, "\\$1").replace(/[\r\t\n]/g, " ").replace(/\$\{([^\}]*)\}/g, "{{= $1}}").replace(/\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g, function (I, C, G, D, E, J, F) {
            var L = i.tmpl.tag[G],
                B, H, K;
            if (!L) {
                throw "Unknown template tag: " + G;
            }
            B = L._default || [];
            if (J && !/\w$/.test(E)) {
                E += J;
                J = "";
            }
            if (E) {
                E = j(E);
                F = F ? ("," + j(F) + ")") : (J ? ")" : "");
                H = J ? (E.indexOf(".") > -1 ? E + j(J) : ("(" + E + ").call($item" + F)) : E;
                K = J ? H : "(typeof(" + E + ")==='function'?(" + E + ").call($item):(" + E + "))";
            } else {
                K = H = B.$1 || "null";
            }
            D = j(D);
            return "');" + L[C ? "close" : "open"].split("$notnull_1").join(E ? "typeof(" + E + ")!=='undefined' && (" + E + ")!=null" : "true").split("$1a").join(K).split("$1").join(H).split("$2").join(D || B.$2 || "") + "__.push('";
        }) + "');}return __;");
    }

    function s(B, A) {
        B._wrap = m(B, true, i.isArray(A) ? A : [u.test(A) ? A : i(A).html()]).join("");
    }

    function j(A) {
        return A ? A.replace(/\\'/g, "'").replace(/\\\\/g, "\\") : null;
    }

    function d(A) {
        var B = document.createElement("div");
        B.appendChild(A.cloneNode(true));
        return B.innerHTML;
    }

    function o(G) {
        var I = "_" + q,
            B, A, E = {}, F, D, C;
        for (F = 0, D = G.length; F < D; F++) {
            if ((B = G[F]).nodeType !== 1) {
                continue;
            }
            A = B.getElementsByTagName("*");
            for (C = A.length - 1; C >= 0; C--) {
                H(A[C]);
            }
            H(B);
        }

        function H(O) {
            var L, N = O,
                M, J, K;
            if ((K = O.getAttribute(h))) {
                while (N.parentNode && (N = N.parentNode).nodeType === 1 && !(L = N.getAttribute(h))) {}
                if (L !== K) {
                    N = N.parentNode ? (N.nodeType === 11 ? 0 : (N.getAttribute(h) || 0)) : 0;
                    if (!(J = p[K])) {
                        J = e[K];
                        J = k(J, p[N] || e[N]);
                        J.key = ++w;
                        p[w] = J;
                    }
                    if (q) {
                        P(K);
                    }
                }
                O.removeAttribute(h);
            } else {
                if (q && (J = i.data(O, "tmplItem"))) {
                    P(J.key);
                    p[J.key] = J;
                    N = i.data(O.parentNode, "tmplItem");
                    N = N ? N.key : 0;
                }
            } if (J) {
                M = J;
                while (M && M.key != N) {
                    M.nodes.push(O);
                    M = M.parent;
                }
                delete J._ctnt;
                delete J._wrap;
                i.data(O, "tmplItem", J);
            }

            function P(Q) {
                Q = Q + I;
                J = E[Q] = (E[Q] || k(J, p[J.parent.key + I] || J.parent));
            }
        }
    }

    function c(C, A, D, B) {
        if (!C) {
            return g.pop();
        }
        g.push({
            _: C,
            tmpl: A,
            item: this,
            data: D,
            options: B
        });
    }

    function b(A, C, B) {
        return i.tmpl(i.template(A), C, B, this);
    }

    function n(C, A) {
        var B = C.options || {};
        B.wrapped = A;
        return i.tmpl(i.template(C.tmpl), C.data, B, C.item);
    }

    function r(B, C) {
        var A = this._wrap;
        return i.map(i(i.isArray(A) ? A.join("") : A).filter(B || "*"), function (D) {
            return C ? D.innerText || D.textContent : D.outerHTML || d(D);
        });
    }

    function z() {
        var A = this.nodes;
        i.tmpl(null, null, null, this).insertBefore(A[0]);
        i(A).remove();
    }
})(jQuery);
/*
 * Log console
 * Requires jQuery 1.6.3
 *
 * Copyright 2011, Jan Chimiak
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 */
var console = (function () {
    $("body").append('<div id="a-logappender-wrap"><div class="body"><div id="a-logappender"></div></div>');

    function c(g, f) {
        var d, e;
        if (g.join) {
            return g.join(f);
        }
        d = "";
        for (e = 0; e < g.length; e = e + 1) {
            d += g[e];
            if (e + 1 < g.length) {
                g += f;
            }
        }
        return d;
    }

    function b(f, g, h) {
        var e, d;
        e = c(f, ", ");
        d = h !== "log" ? $("<div>[" + h + "] " + e + "</ div>") : $("<div> " + e + "</ div>");
        $("#a-logappender").prepend(d);
        d.fadeOut(g);
        if (unsafeWindow.console && jQuery.browser.mozilla) {
            unsafeWindow.console[h].apply(this, f);
        }
    }
    var a = {
        level: "INFO",
        log: function () {
            b(arguments, 5000, "log");
        },
        error: function () {
            b(arguments, 11000, "error");
        },
        warn: function () {
            if (a.level === "ERROR") {
                return;
            }
            b(arguments, 9000, "warn");
        },
        info: function () {
            if (a.level === "WARN" || a.level === "ERROR") {
                return;
            }
            b(arguments, 7000, "info");
        },
        debug: function () {
            if (a.level === "WARN" || a.level === "INFO" || a.level === "ERROR") {
                return;
            }
            b(arguments, 5000, "debug");
        }
    };
    return a;
})();
/*
 * Non-Firefox support for main GM functions
 * Requires jQuery 1.6.3
 *
 * Copyright 2011, Jan Chimiak
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 */
if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported") > -1)) {
    this.GM_getValue = function (a, b) {
        if (localStorage[a] === undefined) {
            return b;
        }
        if (localStorage[a] === "false") {
            return false;
        }
        if (localStorage[a] === "true") {
            return true;
        }
        return localStorage[a];
    };
    this.GM_setValue = function (a, b) {
        return (localStorage[a] = b);
    };
    this.GM_deleteValue = function (a) {
        return delete localStorage[a];
    };
    /*
     * Anfit's GC Mods
     * (c) 2012 Jan 'anfit' Chimiak
     * http://gc.mmanir.net/
     *
     * This document is licensed as free software under the terms of the
     * Creative Commons Attribution + Noncommercial 3.0 Unported (CC BY-NC 3.0).
     * If you want to use this in an commercial product, contact the author.
     */
}
var app = {};
app.version = "5.0.30";
app.releaseNotes = "(2012-04-12): This release fixes some minor bugs, mainly makes the removal of the ugly blue background (from previous version) optional.";
app.gameServer = "http://gc.gamestotal.com/";
app.modsServer = "http://128.0.0.1";
app.mod = {};
app.util = {};
app.util.sortByPowerDesc = function (d, c) {
    return ((d.power > c.power) ? -1 : ((d.power < c.power) ? 1 : 0));
};
app.util.startDragging = function (f) {
    var d = {
        zIndex: 0
    };
    d.elNode = f.target;
    if (d.elNode.nodeType === 3) {
        d.elNode = d.elNode.parentNode;
    }
    if (d.elNode.nodeName === "INPUT" || d.elNode.nodeName === "SPAN") {
        return;
    }
    while (!d.elNode.className.match("draggable")) {
        d.elNode = d.elNode.parentNode;
    }
    var b = d.elNode.id;
    d.cursorStartX = f.clientX + window.scrollX;
    d.cursorStartY = f.clientY + window.scrollY;
    d.elStartLeft = parseInt(d.elNode.style.left, 10);
    d.elStartTop = parseInt(d.elNode.style.top, 10);
    d.elStartRight = d.elStartLeft + parseInt(d.elNode.clientWidth, 10);
    d.elStartBottom = d.elStartTop + parseInt(d.elNode.clientHeight, 10);
    d.elNode.style.zIndex = d.zIndex + 1;

    function a(l) {
        var g = l.clientX + window.scrollX;
        var m = l.clientY + window.scrollY;
        var k, j, h, i;
        k = d.elStartTop + m - d.cursorStartY;
        j = d.elStartLeft + g - d.cursorStartX;
        h = d.elStartBottom + m - d.cursorStartY;
        i = d.elStartRight + g - d.cursorStartX;
        if (k > 0 && j > 0 && h + 5 < window.innerHeight && i + 5 < window.innerWidth) {
            d.elNode.style.left = j + "px";
            d.elNode.style.top = k + "px";
        }
    }

    function c(j) {
        var g = j.clientX + window.scrollX;
        var k = j.clientY + window.scrollY;
        var i;
        var h;
        i = d.elStartTop + k - d.cursorStartY;
        h = d.elStartLeft + g - d.cursorStartX;
        $(document).unbind("mousemove." + b, a);
        $(document).unbind("mouseup." + b, c);
        $(document).trigger("dragStop", [b, i, h]);
    }
    $(document).bind("mousemove." + b, a);
    $(document).bind("mouseup." + b, c);
};
app.util.countInArray = function (b, e) {
    var d = 0;
    for (var a = 0; a < e.length; a = a + 1) {
        if (e[a] === b) {
            d = d + 1;
        }
    }
    return d;
};
app.util.formatCurrency = function (c) {
    var a = c + "";
    for (var b = 0; b < Math.round(a.length / 3 - 0.5); b = b + 1) {
        a = a.replace(/(\d)(\d{3})($|,)/g, "$1,$2$3");
    }
    return a;
};
app.util.getRandomNumber = function (b, a) {
    return Math.random() * (a - b) + b;
};
app.PropertyDomNode = function (b, a, c) {
    this.el = c;
    this.min = b;
    this.max = a;
    this.connected = false;
};
app.PropertyDomNode.prototype.setValue = function (a) {
    if (this.connected !== true) {
        return;
    }
    this.el.html(this.prefix + app.util.formatCurrency(a) + this.suffix);
    this.refreshEl();
};
app.PropertyDomNode.prototype.setMax = function (a) {
    if (this.connected !== true) {
        return;
    }
    this.max = 1 * a;
    this.refreshEl();
};
app.PropertyDomNode.prototype.setMin = function (a) {
    if (this.connected !== true) {
        return;
    }
    this.min = 1 * a;
    this.refreshEl();
};
app.PropertyDomNode.prototype.refreshEl = function () {
    var a = this.el.text().replace(/\D/g, "") * 1;
    if (a > this.max || a < this.min) {
        this.el.removeClass("bodybox", "a-bodybox-yellow").addClass("a-bodybox-red");
    } else {
        if (a === this.max) {
            this.el.removeClass("bodybox", "a-bodybox-red").addClass("a-bodybox-yellow");
        } else {
            this.el.removeClass("a-bodybox-yellow");
            this.el.removeClass("a-bodybox-red");
            this.el.addClass("bodybox");
        }
    }
};
app.PropertyDomNode.prototype.connect = function (a) {
    this.el = a;
    this.connected = true;
    this.prefix = this.el.html().replace(/-{0,1}\d.*/, "");
    this.suffix = this.el.html().replace(/.*\d/, "");
    this.refreshEl();
};
app.Property = function (d, c, a, b) {
    this.defaultMax = a;
    this.defaultMin = c;
    this.parent = b;
    this.id = d;
    this.max = this.parent.getValue(this.id + ".max") ? this.parent.getValue(this.id + ".max") : this.defaultMax;
    this.min = this.parent.getValue(this.id + ".min") ? this.parent.getValue(this.id + ".min") : this.defaultMin;
    this.domDao = new app.PropertyDomNode(this.min, this.max);
};
app.Property.prototype.setEl = function (a) {
    this.dom = a;
    if (this.parent.isNewest()) {
        this.domDao.connect(a);
    }
    var b = this;
    $(this.dom).click(function (h) {
        var g, f, c, d;
        h.stopPropagation();
        g = $(this).position().left - ($(this).outerWidth()) / 2;
        f = $(this).position().top + $(this).outerHeight();
        var i = b.id;
        c = b.max;
        d = b.min;
        $("body").append('<table id="change-property-' + i + '" class="a-property" style="top: ' + f + "; left: " + g + ';"><tr><td><b>Limits for ' + i + ':</b></td><td><button id="close-' + i + '" class="a-property-close">x</input></td></tr><tr><td>max:</td><td><input type="text" id="max-' + i + '" value="' + c + '"></td></tr><tr><td>min:</td><td><input type="text" id="min-' + i + '" value="' + d + '"/></td></tr><tr><td colspan="2"><button id="restore-default-' + i + '"  class="a-property-restore">restore default values</button></td></tr></table>');
        $("#max-" + i).change(function () {
            b.setMax($(this).val());
        });
        $("#min-" + i).change(function () {
            b.setMin($(this).val());
        });
        $("#restore-default-" + i).click(function () {
            b.setMin(b.defaultMin);
            $("#min-" + i).val(b.defaultMin);
            b.setMax(b.defaultMax);
            $("#max-" + i).val(b.defaultMax);
        });
        $("body").click(function () {
            $("#change-property-" + i).remove();
        });
        $("#close-" + i).click(function () {
            $("#change-property-" + i).remove();
        });
        $("#change-property-" + i).click(function (j) {
            j.stopPropagation();
        });
    });
};
app.Property.prototype.setValue = function (a) {
    this.parent.setValue(this.id, a);
    this.domDao.setValue(a);
};
app.Property.prototype.setMax = function (b, a) {
    if (a === true) {
        this.defaultMax = b;
    }
    this.domDao.setMax(b);
    this.parent.setValue(this.id + ".max", b);
    this.max = b;
};
app.Property.prototype.setMin = function (b, a) {
    if (a === true) {
        this.defaultMin = b;
    }
    this.domDao.setMin(b);
    this.parent.setValue(this.id + ".min", b);
    this.min = b;
};
app.Property.prototype.getValue = function () {
    return this.parent.getValue(this.id);
};
app.Property.prototype.addValue = function (a) {
    this.setValue(1 * a + this.getValue());
};
app.Property.prototype.subtractValue = function (a) {
    this.setValue(-1 * a + this.getValue());
};
app.Property.prototype.updateEl = function (a) {
    if (a !== undefined) {
        this.domDao.setValue(a);
    } else {
        this.domDao.setValue(this.getValue());
    }
};
app.ModControl = function (b) {
    this.mods = b.mods;
    this.location = document.location.href.replace(new RegExp(".*/"), "").replace(/&\d\d\d\d&/, "");
    this.timestamp = (new Date()).getTime();
    this.cash = new app.Property("cash", 0, 999999999999, this);
    this.food = new app.Property("food", 0, 2000000000, this);
    this.turns = new app.Property("turns", 0, 0, this);
    this.power = new app.Property("power", 0, 1199999999, this);
    var c;
    if (this.isPropertyPage() && this.isNewest()) {
        c = this.readProperties();
        this.assignAccessorEls();
        c = this.setServer(c, c.serverName);
        this.serializeProperties(c);
        this.setGlobalValue("a-propertycheck-timestamp", this.timestamp);
        this.setValue("a-propertycheck-timestamp", this.timestamp);
    } else {
        if (this.isPropertyPage() && !this.isNewest()) {
            c = this.readProperties();
            this.assignAccessorEls();
            c = this.deserializeProperties();
            c = this.setServer(c, c.serverName);
        } else {
            c = this.deserializeProperties();
            c = this.setServer(c, c.serverName);
        }
    }
    this.empireName = c.empireName;
    this.userName = c.userName;
    this.server = c.server;
    this.isPaid = c.paid;
    this.antiReload = c.antiReload;
    this.authenticated = c.authenticated;
    this.authToken = c.authToken;
    if (!this.empireName) {
        this.loaded = false;
        return;
    } else {
        this.loaded = true;
    }
    this.forceDefaultSettings();
    this.showMessage("Anfit GC Mods " + app.version, app.releaseNotes, "a-release-" + app.version);
    if (!this.getValue("a-last-update-check")) {
        this.setValue("a-last-update-check", this.timestamp);
    }
};
app.ModControl.prototype.isPropertyPage = function (b) {
    if (b === undefined) {
        b = $("body");
    }
    var a = $("table.smallfont td.bodybox:has(a:contains('Private Messages')), table.smallfont td:has(a > font:contains('Private Messages'))", b);
    if (a.length) {
        a.attr("id", "a-privatemessages");
        return true;
    }
    return false;
};
app.ModControl.prototype.readProperties = function (b) {
    if (b === undefined) {
        b = $("body");
    }
    var c = $("td.bodybox:contains('$'),td.bodybox:contains('$') ~ td.bodybox", b);
    var a = {
        cash: -1,
        food: -1,
        power: -1,
        turns: -1,
        serverName: "",
        empireName: "",
        userName: "",
        antireload: -1,
        paid: false
    };
    a.cash = c.eq(0).text().replace(/\D/g, "") * 1;
    a.food = c.eq(1).text().replace(/\D/g, "") * 1;
    a.power = c.eq(2).text().replace(/\D/g, "") * 1;
    a.turns = c.eq(3).text().replace(/\D/g, "") * 1;
    a.serverName = $.trim(c.eq(4).text());
    a.empireName = $.trim(c.eq(5).text());
    a.userName = a.serverName + "." + a.empireName;
    a.antiReload = $("a:contains('Private Messages')", b).attr("href").replace(/.*\&(\d*)\&.*/, "$1") * 1;
    if ($("img[src*='logo_gc2']").length) {
        a.paid = true;
    }
    a.authToken = this.getGlobalValue(a.userName + ".a-authentication-token");
    a.authenticated = a.authToken ? true : false;
    return a;
};
app.ModControl.prototype.assignAccessorEls = function () {
    var a = $("td.bodybox:contains('$'),td.bodybox:contains('$') ~ td.bodybox");
    this.cash.setEl(a.eq(0));
    this.food.setEl(a.eq(1));
    this.power.setEl(a.eq(2));
    this.turns.setEl(a.eq(3));
    a.eq(0).parent().removeAttr("onmouseover");
    a.eq(0).parent().removeAttr("onclick");
};
app.ModControl.prototype.deserializeProperties = function () {
    var a = {
        cash: -1,
        food: -1,
        power: -1,
        turns: -1,
        serverName: "",
        empireName: "",
        userName: "",
        antiReload: -1,
        paid: false
    };
    a.serverName = this.getGlobalValue("serverName");
    a.empireName = this.getGlobalValue("empireName");
    a.userName = this.getGlobalValue("userName");
    a.cash = this.getGlobalValue(a.userName + "." + this.cash.id);
    a.food = this.getGlobalValue(a.userName + "." + this.food.id);
    a.power = this.getGlobalValue(a.userName + "." + this.power.id);
    a.turns = this.getGlobalValue(a.userName + "." + this.turns.id);
    a.antiReload = this.getGlobalValue(a.userName + ".antiReload");
    a.paid = this.getGlobalValue(a.userName + ".isPaid");
    a.authToken = this.getGlobalValue(a.userName + ".a-authentication-token");
    a.authenticated = a.authToken ? true : false;
    return a;
};
app.ModControl.prototype.serializeProperties = function (a) {
    this.setGlobalValue("serverName", a.serverName);
    this.setGlobalValue("empireName", a.empireName);
    this.setGlobalValue("userName", a.userName);
    this.setGlobalValue(a.userName + "." + "isPaid", a.paid);
    this.setGlobalValue(a.userName + "." + "antiReload", a.antiReload);
    this.setGlobalValue(a.userName + "." + "cash", a.cash);
    this.setGlobalValue(a.userName + "." + "food", a.food);
    this.setGlobalValue(a.userName + "." + "turns", a.turns);
    this.setGlobalValue(a.userName + "." + "power", a.power);
};
app.ModControl.prototype.setServer = function (b, d) {
    b.server = {
        id: -1,
        name: "",
        turnRate: -1,
        turnHold: -1
    };
    var c = [{
        id: 0,
        name: "Normal",
        turnRate: 900000,
        turnHold: 180
    }, {
        id: 1,
        name: "Fast",
        turnRate: 300000,
        turnHold: 150
    }, {
        id: 2,
        name: "Slow",
        turnRate: 1800000,
        turnHold: 250
    }, {
        id: 3,
        name: "Ultra",
        turnRate: 120000,
        turnHold: 100
    }, {
        id: 4,
        name: "RT",
        turnRate: 7800,
        turnHold: 30
    }, {
        id: 5,
        name: "DM",
        turnRate: 3000,
        turnHold: 120
    }];
    for (var a = 0; a < c.length; a = a + 1) {
        if (c[a].name === d) {
            b.server = c[a];
            break;
        }
    }
    if (b.paid) {
        b.server.turnRate = b.server.turnRate * 0.85;
        b.server.turnHold = b.server.turnHold * 1.5;
    }
    this.turns.setMax(b.server.turnHold, true);
    if (b.server.name === "DM") {
        app.gameServer += "dm/";
    }
    return b;
};
app.ModControl.prototype.getGlobalValue = function (a, e) {
    var c = GM_getValue(a);
    if (c === "false") {
        return false;
    }
    if (c === false) {
        return false;
    }
    if (c === "true") {
        return true;
    }
    if (c === true) {
        return true;
    }
    if (c * 1 === 0 && typeof c === "string" && c.match("\n|\t| ")) {
        return c;
    }
    if (c * 1 * 0 === 0) {
        return c * 1;
    }
    if (e === "JSON_AS_ARRAY") {
        var b = [];
        if (c) {
            b = $.parseJSON(c);
            if (!b) {
                b = [];
            }
        }
        return b;
    }
    if (e === "JSON_AS_OBJECT") {
        var d = {};
        if (c) {
            d = $.parseJSON(c);
            if (!d) {
                d = {};
            }
        }
        return d;
    }
    return c;
};
app.ModControl.prototype.openInTab = function (a) {
    GM_openInTab(a);
};
app.ModControl.prototype.setGlobalValue = function (a, b) {
    if (typeof (b) === "number" && b > 100000) {
        GM_setValue(a, b.toString());
    } else {
        GM_setValue(a, b);
    }
};
app.ModControl.prototype.getValue = function (a, b) {
    return this.getGlobalValue(this.userName + "." + a, b);
};
app.ModControl.prototype.setValue = function (a, b) {
    this.setGlobalValue(this.userName + "." + a, b);
};
app.ModControl.prototype.isNewest = function () {
    if (this.getGlobalValue("a-propertycheck-timestamp")) {
        return this.timestamp - this.getGlobalValue("a-propertycheck-timestamp") >= 0;
    }
    return true;
};
app.ModControl.prototype.forceDefaultSettings = function () {
    var a = this;
    $.each(this.mods, function (b, c) {
		if(c) {
			if (c.defaultValue !== undefined && a.getValue(c.id) === undefined) {
				a.setValue(c.id, c.defaultValue);
			}
			if (!c.items) {
				return;
			}
			$.each(c.items, function (d, e) {
				if (e.id) {
					if (e.defaultValue !== undefined && a.getValue(e.id) === undefined) {
						a.setValue(e.id, e.defaultValue);
					}
					e.value = a.getValue(e.id);
				}
			});
		}
    });
};
app.ModControl.prototype.showMessage = function (d, a, e) {
    if (e) {
        e = e.replace(/\W/g, "");
    }
    var c = this;
    if (!e || this.getValue(e) !== false) {
        var b = $("body").prepend('<div class="a-info-wrap">' + '<div class="a-info-title" id="' + e + '">' + d + "</div>" + '<div class="a-info" >' + a + "</div>" + "</div>");
        $(".a-info-title", b).click(function (h) {
            var g = $(h.target),
                k = g.attr("id"),
                j = g.offset(),
                i = h.pageX - j.left,
                f = h.pageY - j.top;
            if (g.hasClass("a-info-title") && 770 < i && i < 796 && 0 < f && f < 16) {
                g.parent().fadeOut("slow", function () {
                    $(this).remove();
                    if (k) {
                        c.setValue(k, false);
                    }
                });
            }
        });
    }
};
app.ModControl.prototype.runMods = function () {
    var c = '<li class="a-mod" id="${id}"><div class="a-mod-line" ><ul><li class="a-mod-submit"><input type=checkbox id="${id}-checkbox" /></li><li class="a-mod-name"><a name=${id}></a><b>${title}</b><br /></li></div></ul><div class="a-mod-line" ><i>${description}</i></div><div><ul class="a-mod-item" /></div></li>';
    var e = '<li class="a-mod-item-list"><ul class="a-mod-item-parts"><li class="a-mod-item-parts-body">${description}<br /><textarea id="${id}" cols="70">${value}</textarea></li></ul></li>';
    var f = '<li class="a-mod-item-input"><ul class="a-mod-item-parts"><li class="a-mod-item-parts-body"><span class="a-mod-item-input-desc">${description}</span><span class="a-mod-item-input-submit"><input id="${id}" value="${value}" /></span></li></ul></li>';
    var a = '<li class="a-mod-item-info">${text}</li>';
    var b = '<li class="a-mod-item-checkbox"><ul class="a-mod-item-parts"><li class="a-mod-item-parts-submit"><input id="${id}" type="checkbox" /></li><li class="a-mod-item-parts-body">${description}</li></ul></li>';
    if (gc.location.match(/i.cfm.f.option($|#.*)/)) {
        $("table.bodybox[width='550'] > tbody > tr > td").attr("id", "a-options-wrap").append('<div id="a-about"><div><b>Welcome, ' + gc.empireName + '!</b></div><div class="a-separator"/><div>Thank you for trying Anfit\'s Mods for Spacefed GC v.' + app.version + '. All mods are listed below with short explanations. Also, some of the mods require additional configuration they can be switched on.<div class="a-separator"/><div>My mods cannot affect gameplay, they are just UI (User Interface) tweaks, to make this game slightly more playable.</div><div class="a-separator"/><div>To enable more advanced tweaks which interact with other players please enter your gc.mmanir.net authentication token.</div><div class="a-separator"/><div><i>What? Authentication token? What is it? Why?</i></div><div class="a-separator"/><div>Some more advanced mods share data between players. You always know when and how. The best example of this are status tags: you set your status text, all other users of Anfit\'s Mods can see it in the ranking lists, you can see theirs.</div><div>This is possible only through another server located at gc.mmanir.net (one I\'m hosting). To authenticate with this server you have to: </div><div><ol><li>Create an account and login at <a href="http://gc.mmanir.net" target="blank">gc.mmanir.net</a>.</li><li>Retrieve an authentication token (it\'s provided just after login page).</li><li>Copy the authentication token here.</li></ol></div><div><b>Enter your authentication token here</b>: <input id="a-authentication-token" type="text" size="32" /></div><div class="a-separator"/><div>If you have problems, questions or ideas while using Anfit\'s GC Mods contact me (<a href="http://gc.mmanir.net/">Anfit</a>) at <a href="mailto:jan.chimiak@gmail.com?subject=[GC Mods]">jan.chimiak@gmail.com</a> or send me a <a href="javascript:cmsgu(\'i.cfm?popup=msguser&uid=213512\');">private message</a> at GC/normal.</div><div>');
        var d = gc.getValue("a-authentication-token") || "";
        $("#a-authentication-token").val(d);
        if (!gc.authenticated) {
            $("#a-authentication-token").parent().css("background-color", "ff0000");
            $("#a-authentication-token").parent().children().filter("b").css("color", "00ffff");
        }
        $("#a-authentication-token").change(function () {
            var g = $(this).val();
			gc.authenticated = true;
            $(this).addClass("a-loading");
        });
    }
    $.each(this.mods, function (h, i) {
        if (i && gc.location.match(/i.cfm.f.option($|#.*)/)) {
            $.tmpl(c, i).appendTo("#a-options-wrap");
            $("#" + i.id + "-checkbox").prop("checked", gc.getValue(i.id));
            var g = $("#" + i.id + " ul.a-mod-item");
            if (i.items) {
                $.each(i.items, function (j, k) {
                    if (k.id) {
                        k.value = gc.getValue(k.id);
                    }
                    switch (k.type) {
                    case "list":
                        $.tmpl(e, k).appendTo(g);
                        $("#" + k.id).change(function () {
                            gc.setValue(k.id, $("#" + k.id).val());
                        });
                        break;
                    case "info":
                        $.tmpl(a, k).appendTo(g);
                        break;
                    case "input":
                        $.tmpl(f, k).appendTo(g);
                        $("#" + k.id).change(function () {
                            gc.setValue(k.id, $("#" + k.id).val());
                        });
                        break;
                    case "checkbox":
                        $.tmpl(b, k).appendTo(g);
                        $("#" + k.id).prop("checked", k.value);
                        $("#" + k.id).click(function () {
                            gc.setValue(k.id, $("#" + k.id).prop("checked"));
                        });
                        break;
                    default:
                        console.error("[Options] Unrecognized option type");
                        break;
                    }
                });
            }
            $("#" + i.id + "-checkbox").click(function () {
                gc.setValue($(this).attr("id").replace("-checkbox", ""), $(this).prop("checked"));
            });
            if (i.onAfterRender) {
                i.onAfterRender.call(this);
            }
        }
        if (i && i.filter.call()) {
            i.plugin.call();
        }
    });
};
app.ModControl.prototype.xhr = function (a) {
    if (!a || !a.url) {
        console.error("[Ajax] empty xhr request");
        return;
    }
    var b = {
        method: "POST",
        url: a.url,
        headers: {
            "Accept": "application/atom+xml,application/xml,text/xml",
            "Content-type": "application/x-www-form-urlencoded"
        },
        onload: function (c) {
            var f = $("td.bodybox a:contains('Private Messages')");
            var g;
            if (f.length) {
                var d = f.first().attr("href");
                if (d) {
                    g = d.replace(/\D/g, "");
                }
                if (g) {
                    gc.setValue("antiReload", g);
                }
            }
            if (c.status !== 200) {
                if (a.onFailure) {
                    a.onFailure.call(this, c.responseText);
                }
                return;
            }
            if (c.responseText.indexOf("{") === 0 && $.isPlainObject($.parseJSON(c.responseText))) {} else {
                if (gc.isPropertyPage(c.responseText)) {
                    var e = gc.readProperties(c.responseText);
                    e = gc.setServer(e, e.serverName);
                    gc.serializeProperties(e);
                    gc.turns.updateEl();
                    gc.power.updateEl();
                    gc.cash.updateEl();
                    gc.food.updateEl();
                }
            } if (a.successCondition && $(a.successCondition, c.responseText).length) {
                a.onSuccess.call(this, c.responseText);
            } else {
                if (a.successCondition) {
                    a.onFailure.call(this, c.responseText);
                } else {
                    a.onSuccess.call(this, c.responseText);
                }
            }
        },
        onerror: function (c) {
            console.error("XHR error", a, c);
            a.onFailure.call(this, c);
        }
    };
    if (a.data) {
        b.data = a.data;
    }
    if (a.method) {
        b.method = a.method;
    }
    if (a.extra) {
        b.extra = a.extra;
    }
    GM_xmlhttpRequest(b);
};
app.mod.automatedcapsulelab = {
    id: "a-automatedcapsulelab",
    defaultValue: true,
    title: "Automated capsule lab",
    description: "Shows a list of fusable artifacts (incl. your stocks). Clicking on the list fills the fusion form...",
    items: [{
        type: "checkbox",
        id: "a-automatedcapsulelab-showall",
        description: "Show all artifacts, not only those you can fuse"
    }],
    filter: function () {
        if (!gc.getValue("a-automatedcapsulelab")) {
            return false;
        }
        if (gc.location.match(/i.cfm.*f.com_project2.id.3$/) && $("select").length) {
            return true;
        }
        if (gc.location.indexOf("com_market_use") !== -1) {
            return true;
        }
        return false;
    },
    plugin: function () {
        if (gc.location.match(/com_market_use$/)) {
            (function () {
                var i = [];
                $("table.table_back[width='50%'] tr.table_row1").each(function () {
                    i.push({
                        id: $("td a:first", this).attr("href").replace(/.*id=/, "").replace(/\D/, "", "g") * 1,
                        stock: $.trim($("td:eq(2)", this).text()) * 1
                    });
                });
                gc.setValue("a-automatedcapsulelab-stocks", JSON.stringify(i));
            })();
            return;
        } else {
            if (gc.location.match(/com_market_use.*id=/)) {
                (function () {
                    var r = $("table.table_back[width='50%'] tr.table_row1:first");
                    var t = $("td a:first", r).attr("href").replace(/.*id=/, "").replace(/\D/, "", "g") * 1;
                    var s = $("td:eq(2)", r).text().replace(/\D/, "", "g") * 1;
                    var q = gc.getValue("a-automatedcapsulelab-stocks", "JSON_AS_ARRAY");
                    for (var p = 0; p < q.length; p = p + 1) {
                        if (q[p].id === t) {
                            console.log(q[p]);
                            q.splice(p, 1);
                            break;
                        }
                    }
                    q.unshift({
                        id: t,
                        stock: s
                    });
                    gc.setValue("a-automatedcapsulelab-stocks", JSON.stringify(q));
                })();
                return;
            }
        } if (!gc.getValue("a-automatedcapsulelab-definitions")) {
            gc.setValue("a-automatedcapsulelab-definitions", '{"items":[{"id":10,"type":"Common","name":"Energy Pod","effect":"Used to fuse other artifacts","ingredients":[]},{"id":13,"type":"Common","name":"White Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":14,"type":"Common","name":"Black Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":15,"type":"Common","name":"Blue Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":16,"type":"Common","name":"Green Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":17,"type":"Common","name":"Orange Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":18,"type":"Common","name":"Yellow Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":19,"type":"Common","name":"Purple Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":20,"type":"Common","name":"Gray Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":21,"type":"Common","name":"Brown Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":22,"type":"Common","name":"Moccasin Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":23,"type":"Common","name":"Golden Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":24,"type":"Common","name":"Turquoise Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":25,"type":"Common","name":"Aqua Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":26,"type":"Common","name":"Pink Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":27,"type":"Common","name":"Plum Orb","effect":"Used to fuse other artifacts","ingredients":[]},{"id":7,"type":"Special","name":"Organic Base","effect":"Used to fuse other artifacts","ingredients":[]},{"id":8,"type":"Special","name":"Assimillated Base","effect":"Used to fuse other artifacts","ingredients":[]},{"id":28,"type":"Uncommon","name":"Cuarto Mapa","effect":"Gives Artifact Formulas","ingredients":[{"id":13,"amount":1},{"id":14,"amount":1},{"id":15,"amount":1},{"id":16,"amount":1},{"id":17,"amount":1}]},{"id":29,"type":"Uncommon","name":"Bronze Dinero","effect":"Target empire credits increase a small amount","ingredients":[{"id":14,"amount":1},{"id":17,"amount":1},{"id":16,"amount":1},{"id":15,"amount":1},{"id":18,"amount":1}]},{"id":30,"type":"Uncommon","name":"Silver Dinero","effect":"Target empire credits increase a small amount","ingredients":[{"id":18,"amount":1},{"id":13,"amount":1},{"id":20,"amount":1},{"id":19,"amount":1},{"id":26,"amount":1}]},{"id":31,"type":"Uncommon","name":"Gold Dinero","effect":"Target empire credits increase a small amount","ingredients":[{"id":20,"amount":1},{"id":26,"amount":1},{"id":25,"amount":1},{"id":24,"amount":1},{"id":27,"amount":1}]},{"id":32,"type":"Uncommon","name":"Platinum Dinero","effect":"Target empire credits increase a small amount","ingredients":[{"id":25,"amount":2},{"id":27,"amount":1},{"id":26,"amount":2},{"id":26,"amount":2},{"id":25,"amount":2}]},{"id":33,"type":"Uncommon","name":"Amber Dinero","effect":"Target empire credits decrease a small amount","ingredients":[{"id":18,"amount":2},{"id":21,"amount":1},{"id":19,"amount":1},{"id":20,"amount":1},{"id":18,"amount":2}]},{"id":34,"type":"Uncommon","name":"Garnet Dinero","effect":"Target empire credits decrease a small amount","ingredients":[{"id":16,"amount":1},{"id":22,"amount":2},{"id":24,"amount":1},{"id":23,"amount":1},{"id":22,"amount":2}]},{"id":35,"type":"Uncommon","name":"Topaz Dinero","effect":"Target empire credits decrease a small amount","ingredients":[{"id":15,"amount":1},{"id":23,"amount":1},{"id":17,"amount":1},{"id":24,"amount":1},{"id":26,"amount":1}]},{"id":36,"type":"Uncommon","name":"Opal Dinero","effect":"Target empire credits decrease a small amount","ingredients":[{"id":10,"amount":2},{"id":18,"amount":1},{"id":25,"amount":1},{"id":15,"amount":1},{"id":10,"amount":2}]},{"id":37,"type":"Uncommon","name":"Amethyst Dinero","effect":"Target empire credits decrease a small amount","ingredients":[{"id":10,"amount":1},{"id":23,"amount":1},{"id":17,"amount":1},{"id":16,"amount":1},{"id":21,"amount":1}]},{"id":11,"type":"Unique","name":"STC","effect":"Target empire receives 10 turns","ingredients":[{"id":46,"amount":1},{"id":47,"amount":1},{"id":44,"amount":1},{"id":45,"amount":1},{"id":43,"amount":1}]},{"id":38,"type":"Rare","name":"Minor Suerte","effect":"Gives Luck","ingredients":[{"id":28,"amount":1},{"id":7,"amount":1},{"id":30,"amount":1},{"id":29,"amount":1},{"id":31,"amount":1}]},{"id":39,"type":"Rare","name":"Major Suerte","effect":"Gives Luck","ingredients":[{"id":8,"amount":1},{"id":30,"amount":1},{"id":29,"amount":1},{"id":31,"amount":1},{"id":32,"amount":1}]},{"id":40,"type":"Rare","name":"Minor Requerido","effect":"Target empire raw material decreases","ingredients":[{"id":30,"amount":1},{"id":7,"amount":1},{"id":31,"amount":1},{"id":32,"amount":1},{"id":33,"amount":1}]},{"id":41,"type":"Rare","name":"Minor Gente","effect":"Target empire population decreases(Doesnt work)","ingredients":[{"id":34,"amount":1},{"id":32,"amount":2},{"id":32,"amount":2},{"id":31,"amount":1},{"id":8,"amount":1}]},{"id":42,"type":"Rare","name":"Minor Alimento","effect":"Target empire food decreases","ingredients":[{"id":36,"amount":1},{"id":34,"amount":1},{"id":35,"amount":1},{"id":33,"amount":1},{"id":32,"amount":1}]},{"id":43,"type":"Rare","name":"Minor Cosecha","effect":"Target empire population decreases","ingredients":[{"id":33,"amount":1},{"id":34,"amount":1},{"id":35,"amount":1},{"id":36,"amount":1},{"id":37,"amount":1}]},{"id":44,"type":"Rare","name":"Minor Tierra","effect":"Target empire Ore decreases","ingredients":[{"id":31,"amount":1},{"id":30,"amount":3},{"id":28,"amount":1},{"id":30,"amount":3},{"id":30,"amount":3}]},{"id":45,"type":"Rare","name":"Traicione","effect":"Target empire loyalty decreases","ingredients":[{"id":36,"amount":1},{"id":33,"amount":2},{"id":29,"amount":1},{"id":28,"amount":1},{"id":33,"amount":2}]},{"id":12,"type":"Unique","name":"BTC","effect":"Gives 100 Turns(up to max any over are wasted)","ingredients":[{"id":11,"amount":2},{"id":58,"amount":1},{"id":59,"amount":1},{"id":11,"amount":2},{"id":57,"amount":1}]},{"id":46,"type":"Unique","name":"Minor Gordo","effect":"Increases max land on top planet +20-40 land (not homeworld)","ingredients":[{"id":43,"amount":2},{"id":43,"amount":2},{"id":44,"amount":1},{"id":42,"amount":1},{"id":41,"amount":1}]},{"id":47,"type":"Rare","name":"Minor Barrera","effect":"Prevents artifacts of any type to be used on Empire. Breakable with 5 rares","ingredients":[{"id":28,"amount":2},{"id":36,"amount":2},{"id":28,"amount":2},{"id":36,"amount":2},{"id":30,"amount":1}]},{"id":48,"type":"Unique","name":"Historia","effect":"Target empire loses 40 turns","ingredients":[{"id":38,"amount":1},{"id":11,"amount":1},{"id":40,"amount":1},{"id":39,"amount":1},{"id":43,"amount":1}]},{"id":49,"type":"Unique","name":"Minor Afortunado","effect":"Gives Luck","ingredients":[{"id":40,"amount":1},{"id":39,"amount":1},{"id":38,"amount":2},{"id":41,"amount":1},{"id":38,"amount":2}]},{"id":50,"type":"Unique","name":"Major Afortunado","effect":"Gives Luck","ingredients":[{"id":39,"amount":1},{"id":40,"amount":1},{"id":41,"amount":2},{"id":42,"amount":1},{"id":41,"amount":2}]},{"id":51,"type":"Unique","name":"Minor Estructura","effect":"Destroys infrastructure on outermost planet of target empire","ingredients":[{"id":41,"amount":1},{"id":40,"amount":1},{"id":11,"amount":1},{"id":43,"amount":1},{"id":42,"amount":1}]},{"id":52,"type":"Unique","name":"Major Alimento","effect":"You don\'t notice any effect","ingredients":[{"id":47,"amount":2},{"id":46,"amount":3},{"id":47,"amount":2},{"id":46,"amount":3},{"id":46,"amount":3}]},{"id":53,"type":"Unique","name":"Major Cosecha","effect":"You don\'t notice any effect","ingredients":[{"id":46,"amount":2},{"id":45,"amount":3},{"id":45,"amount":3},{"id":46,"amount":2},{"id":45,"amount":3}]},{"id":54,"type":"Unique","name":"Major Tierra","effect":"You don\'t notice any effect","ingredients":[{"id":43,"amount":2},{"id":44,"amount":3},{"id":44,"amount":3},{"id":43,"amount":2},{"id":44,"amount":3}]},{"id":55,"type":"Unique","name":"Persiana","effect":"Attacks against empire are halted for a time. Generally 2-3 attack attempts","ingredients":[{"id":40,"amount":1},{"id":11,"amount":2},{"id":41,"amount":1},{"id":11,"amount":2},{"id":42,"amount":1}]},{"id":56,"type":"Special","name":"Major Gordo","effect":"Adds 60-100 land on outermost planets. Does not work on homeworld","ingredients":[{"id":58,"amount":1},{"id":55,"amount":1},{"id":46,"amount":1},{"id":50,"amount":1},{"id":12,"amount":1}]},{"id":57,"type":"Unique","name":"Major Barrera","effect":"Prevents artifacts of any kind being used on target empire. Breakable with 20 rare artifacts","ingredients":[{"id":40,"amount":1},{"id":41,"amount":1},{"id":42,"amount":1}]},{"id":58,"type":"Unique","name":"Regalo","effect":"Gives Random number of a Random Artifacts, excluding other Regalos. Works best during Rare dig and after luck artifacts","ingredients":[{"id":46,"amount":1},{"id":34,"amount":1},{"id":45,"amount":1},{"id":42,"amount":1},{"id":43,"amount":1}]},{"id":59,"type":"Unique","name":"Major Producto","effect":"Decreases Consumer Goods of Target Empire (Roughly 500k)","ingredients":[{"id":43,"amount":1},{"id":44,"amount":1},{"id":45,"amount":1},{"id":41,"amount":1},{"id":42,"amount":1}]},{"id":60,"type":"Unique","name":"Major Dinero","effect":"Decreases target empire credits 3%","ingredients":[{"id":42,"amount":1},{"id":43,"amount":1},{"id":44,"amount":1},{"id":33,"amount":1},{"id":40,"amount":1}]},{"id":61,"type":"Special","name":"Grand Estructura","effect":"Destroys infrastructure on outermost planet","ingredients":[{"id":46,"amount":1},{"id":51,"amount":1},{"id":48,"amount":1},{"id":49,"amount":1},{"id":52,"amount":1}]},{"id":62,"type":"Special","name":"Grand Alimenter","effect":"Target Empire food Increases","ingredients":[{"id":50,"amount":1},{"id":49,"amount":1},{"id":51,"amount":1},{"id":53,"amount":1},{"id":52,"amount":1}]},{"id":63,"type":"Special","name":"Grand Cosecha","effect":"Target Empire food increases","ingredients":[{"id":50,"amount":1},{"id":52,"amount":1},{"id":51,"amount":1},{"id":54,"amount":1},{"id":53,"amount":1}]},{"id":64,"type":"Special","name":"Grand Gente","effect":"Target Empire population decreases","ingredients":[{"id":53,"amount":1},{"id":12,"amount":1},{"id":54,"amount":1},{"id":11,"amount":1},{"id":50,"amount":1}]},{"id":65,"type":"Special","name":"Grand Tierra","effect":"Target Empire Ore decreases 25%","ingredients":[{"id":52,"amount":1},{"id":54,"amount":1},{"id":53,"amount":1},{"id":55,"amount":1},{"id":56,"amount":1}]},{"id":66,"type":"Special","name":"Grand Requerido","effect":"Target Empire raw material decreases approx 3%","ingredients":[{"id":56,"amount":1},{"id":55,"amount":1},{"id":54,"amount":1},{"id":53,"amount":1},{"id":57,"amount":1}]},{"id":67,"type":"Special","name":"Grand Barrera","effect":"Prevents artifacts of any kind being used on target empire","ingredients":[{"id":55,"amount":1},{"id":54,"amount":1},{"id":57,"amount":1},{"id":56,"amount":1},{"id":58,"amount":1}]},{"id":68,"type":"Special","name":"Grand Producto","effect":"Target Empires consumer goods decrease","ingredients":[{"id":58,"amount":2},{"id":52,"amount":2},{"id":42,"amount":1},{"id":58,"amount":2},{"id":52,"amount":2}]},{"id":69,"type":"Special","name":"Grand Alimento","effect":"Target Empire food decreases","ingredients":[{"id":56,"amount":1},{"id":48,"amount":1},{"id":57,"amount":1},{"id":59,"amount":1},{"id":58,"amount":1}]},{"id":70,"type":"Special","name":"Grand Dinero","effect":"Target empire credits decrease 10%","ingredients":[{"id":53,"amount":1},{"id":52,"amount":1},{"id":51,"amount":1},{"id":40,"amount":1},{"id":55,"amount":1}]},{"id":9,"type":"Special","name":"PCC","effect":"Random planet assigned to border","ingredients":[{"id":29,"amount":1},{"id":62,"amount":1},{"id":64,"amount":1},{"id":63,"amount":1},{"id":65,"amount":1}]}]}');
        }
        gc.showMessage("Unresearched capsule lab warning", "Please note, that if you entered this page from a link in the extra menu of Anfit's GC mods, but had not researched Capsule Lab, then investing turns here will not gain you anything...", "a-automatedcapsulelab-warning");
        var c = function (i) {
            this.id = i.id;
            this.amount = i.amount;
        };
        c.prototype.validate = function () {
            if (this.id === undefined) {
                return false;
            }
            if (this.amount === undefined) {
                return false;
            }
            return true;
        };
        var k = function (q) {
            this.id = q.id;
            this.name = q.name;
            this.type = q.type;
            this.stock = q.stock;
            this.effect = q.effect;
            this.ingredients = [];
            if (q.ingredients !== undefined) {
                for (var r = 0; r < q.ingredients.length; r = r + 1) {
                    var p = new c(q.ingredients[r]);
                    if (p.validate() === true) {
                        this.ingredients.push(p);
                    } else {
                        console.error("An erroneous ingredient spotted in artifact " + this.id);
                    }
                }
            }
        };
        k.prototype.validate = function () {
            if (this.id === undefined) {
                return false;
            }
            if (this.name === undefined) {
                return false;
            }
            if (this.type === undefined) {
                return false;
            }
            return true;
        };
        var b = function (v) {
            this.items = [];
            this.keys = {};
            this.results = {};
            var u = $.parseJSON(v);
            var t = 0;
            if (u.items !== undefined) {
                for (var s = 0; s < u.items.length; s = s + 1) {
                    var q = new k(u.items[s]);
                    if (q.validate() === true) {
                        this.items.push(q);
                        this.keys["a_" + q.id] = t;
                        for (var r = 0; r < q.ingredients.length; r = r + 1) {
                            var p = this.results["a_" + q.ingredients[r].id];
                            if (p === undefined) {
                                this.results["a_" + q.ingredients[r].id] = [];
                            }
                            this.results["a_" + q.ingredients[r].id].push(t);
                        }
                        t = t + 1;
                    } else {
                        console.error("An erroneous artifact spotted in artifactlist argument at " + s);
                    }
                }
            }
        };
        b.prototype.get = function (p) {
            var i = this.keys["a_" + p];
            if (i === undefined) {
                return undefined;
            }
            return this.items[i];
        };
        b.prototype.getResults = function (u) {
            var t = this.results["a_" + u];
            if (t === undefined) {
                return undefined;
            }
            var p = [];
            for (var s = 0; s < t.length; s = s + 1) {
                var r = t[s];
                var q = this.items[r];
                if (q) {
                    p.push(q);
                }
            }
            return p;
        };
        b.prototype.onAfterSuccessfulFuse = function (p) {
            for (var r = 0; r < this.items.length; r = r + 1) {
                if (this.items[r].id === 0) {
                    continue;
                }
                if (this.items[r].id === p.id) {
                    this.items[r].stock = this.items[r].stock + 1;
                }
                for (var q = 0; q < p.ingredients.length; q = q + 1) {
                    if (this.items[r].id === p.ingredients[q].id) {
                        this.items[r].stock = this.items[r].stock - p.ingredients[q].amount;
                        break;
                    }
                }
            }
            this.resetFusable();
        };
        b.prototype.stringify = function () {
            var q = this.keys;
            var p = this.results;
            delete this.keys;
            delete this.results;
            var i = JSON.stringify(this);
            this.keys = q;
            this.results = p;
            return i;
        };
        b.prototype.setStock = function (q, p) {
            if (q === 0) {
                console.debug("ArtifactList.setStock: Zero artifact is not allowed");
                return;
            }
            var i = this.get(q);
            if (i) {
                i.stock = p;
            } else {
                console.debug("ArtifactList.setStock: No such artifact: " + q, this.items);
                return;
            }
        };
        b.prototype.resetFusable = function () {
            var t;
            for (t = 0; t < this.items.length; t = t + 1) {
                delete this.items[t].fusable;
            }
            for (t = 0; t < this.items.length; t = t + 1) {
                var p = this.items[t];
                if (p.id === 0) {
                    continue;
                }
                var s = this.getResults(p.id);
                if (s !== undefined) {
                    for (var r = 0; r < s.length; r = r + 1) {
                        var u = Math.floor(p.stock / app.util.countInArray(s[r], s));
                        if (!u) {
                            u = 0;
                        }
                        var q = s[r].fusable;
                        if (q === undefined) {
                            s[r].fusable = u;
                        } else {
                            s[r].fusable = Math.min(u, q);
                        }
                    }
                }
            }
        };
        var j;
        var a;
        var e;
        var h;
        var d;
        var m = function (u) {
            var s = j.get(u),
                p = [];
            $('select[name^="g"]').val(0);
            $("#a-automatedcapsulelab-ingredients-body").show();
            $("#a-automatedcapsulelab-ingredients-body tr:gt(0)").remove();
            gc.setValue("a-automatedcapsulelab-last", u);
            $("input[type='submit']:first").val("Fuse " + s.name);
            for (var t = 0; t < s.ingredients.length; t = t + 1) {
                var r = j.get(s.ingredients[t].id);
                p.push(r);
                $('select[name="g' + (t + 1) + '"]').val(r.id);
            }
            var q = '<tr class="table_row1"><td>${name}</td><td width="1%" align="center"><small>${type}</small></td><td align="right">${stock}</td><td align="right">${fusable}</td></tr>';
            $.tmpl(q, p).appendTo("#a-automatedcapsulelab-ingredients-body");
            $("#a-artifact-effect").html(s.effect);
        };
        if (!gc.getValue("a-automatedcapsulelab-stocks")) {
            console.log("[Automated capsule lab] Artifacts stock is not cached. Re-caching. Please wait until the page reloads.");
            gc.xhr({
                url: "i.cfm?f=com_market_use",
                method: "GET",
                successCondition: "b:contains('ARTIFACTS')",
                onSuccess: function (i) {
                    var p = [];
                    $("table.table_back[width='50%'] tr.table_row1", i).each(function () {
                        p.push({
                            id: $("td a:first", this).attr("href").replace(/.*id=/, "").replace(/\D/, "", "g") * 1,
                            stock: $("td:eq(2)", this).text().replace(/\D/, "", "g") * 1
                        });
                    });
                    gc.setValue("a-automatedcapsulelab-stocks", JSON.stringify(p));
                    document.location.href = app.gameServer + "i.cfm?f=com_project2&id=3";
                },
                onFailure: function (i) {
                    console.error("[Automated capsule lab] Failed to re-cache artifacts stocks with a background xhr.");
                }
            });
            return;
        }
        var f = gc.getValue("a-automatedcapsulelab-stocks", "JSON_AS_ARRAY");
        j = new b(gc.getValue("a-automatedcapsulelab-definitions"));
        for (d = 0; d < f.length; d = d + 1) {
            j.setStock(f[d].id, f[d].stock);
        }
        j.resetFusable();
        var g = gc.getValue("a-automatedcapsulelab-last");
        if (g && $("b:contains('was successfully created')").length) {
            var n = j.get(g);
            j.onAfterSuccessfulFuse(n);
            var l = [];
            for (d = 0; d < j.items.length; d = d + 1) {
                l.push({
                    id: j.items[d].id,
                    stock: j.items[d].stock
                });
            }
            gc.setValue("a-automatedcapsulelab-stocks", JSON.stringify(l));
        }
        $("table.bodybox[width='310']").attr("id", "a-automatedcapsulelab-rightpanel-wrap");
        h = $("#a-automatedcapsulelab-rightpanel-wrap div:first");
        h.attr("id", "a-automatedcapsulelab-rightpanel-body");
        $("a:last", h).remove();
        h.append('<table width="230" class="a-table" id="a-automatedcapsulelab-ingredients-wrap"><tbody id="a-automatedcapsulelab-ingredients-body"><tr class="table_row0"><th>Ingredient</th><th width="1%" align="center">Type</th><th align="right">Stock</th><th align="right">Fusable</th></tr></tbody></table><div id="a-artifact-effect" />');
        a = $("table.bodybox[width='250']");
        a.attr("id", "a-automatedcapsulelab-leftpanel-wrap");
        e = $("#a-automatedcapsulelab-leftpanel-wrap tbody");
        e.attr("id", "a-automatedcapsulelab-leftpanel-body");
        e.html('<div class="a-bold">Anfit\'s Upgraded Capsule Lab</div>');
        e.append('<div>Allows fusing artifacts</div><table id="a-automatedcapsulelab-artifacts-wrap" class="a-table"><tbody id="a-automatedcapsulelab-artifacts-body"><tr class="table_row0"><th>Artifact</th><th width="1%" align="center">Type</th><th align="right">Stock</th><th align="right">Fusable</th></tr></tbody></table><div><a href="i.cfm?&f=com_project">Back to project list</a></div>');
        var o = '<tr id="a-automatedcapsulelab-artifact-${id}" class="table_row1 fusable-${fusable}"><td><a href="i.cfm?&amp;f=com_market_use&amp;id=${id}">${name}</a></td><td align="center"><small>${type}</small></td><td align="right">${stock}</td><td align="right">${fusable}</td></tr>';
        $.tmpl(o, j.items).appendTo("#a-automatedcapsulelab-artifacts-body");
        if (!gc.getValue("a-automatedcapsulelab-showall")) {
            $("#a-automatedcapsulelab-artifacts-body .fusable-0, #a-automatedcapsulelab-artifacts-body .fusable-").hide();
        }
        $("#a-automatedcapsulelab-artifacts-body tr").click(function (i) {
            var p = $(this);
            var q = p.attr("id").replace("a-automatedcapsulelab-artifact-", "");
            if (p.hasClass("table_row1")) {
                p.addClass("table_row0").removeClass("table_row1");
                p.siblings("tr:gt(0).table_row0").addClass("table_row1").removeClass("table_row0");
                m(q);
            }
        });
        window.addEventListener("keypress", function (q) {
            for (var p = q.target; p; p = p.parentNode) {
                if (p.nodeName === "TEXTAREA" || p.nodeName === "INPUT" || p.nodeName === "BUTTON") {
                    return;
                }
            }
            if (String.fromCharCode(q.which) === "q") {
                if (!gc.getValue("AGC_chainReactor")) {
                    gc.setValue("AGC_chainReactor", 1);
                    $("#a-automatedcapsulelab-leftpanel-wrap").addClass("automated");
                } else {
                    gc.setValue("AGC_chainReactor", 0);
                    $("#a-automatedcapsulelab-leftpanel-wrap").removeClass("automated");
                }
            }
        }, true);
        $("#a-automatedcapsulelab-artifacts-body #a-automatedcapsulelab-artifact-" + g).addClass("table_row0").removeClass("table_row1");
        if (g) {
            m(g);
        }
        if (gc.getValue("AGC_chainReactor")) {
            $("#a-automatedcapsulelab-leftpanel-wrap").addClass("automated");
            if ($("#a-automatedcapsulelab-rightpanel-body").text().match("Not enought")) {
                console.error("Cannot fuse any more of the selected artifact, run out of ingredients");
            } else {
                window.setTimeout(function () {
                    $("input[type='submit']:first")[0].click();
                }, app.util.getRandomNumber(232, 3201));
            }
        }
    }
};
app.mod.battlesmarkup = {
    id: "a-battlesmarkup",
    defaultValue: true,
    title: "Battles markup",
    description: "Replaces copy-pasted battle logs in fed chat and in the forums with a neat table.",
    filter: function () {
        if (!gc.getValue("a-battlesmarkup")) {
            return false;
        }
        if (gc.location.indexOf("fed_forum") !== -1) {
            return true;
        }
        return false;
    },
    plugin: function () {
        var e = /^\s*([\-\w \.\(\)]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s*$/gi;
        var d = '<ul class="a-battlesmarkup-ship"><li class="a-battlesmarkup-ship-name">$1</li><li class="a-battlesmarkup-ship-amount">$2</li><li class="a-battlesmarkup-ship-lost">$3</li><li class="a-battlesmarkup-ship-remaining">$4</li></ul>';
        var c = $("table.table_back[width='500'] table tr td:odd");
        var b = 0;
        var a;
        c.each(function () {
            $(this).contents().each(function () {
                if (this.nodeType === 3 && this.textContent.match(e)) {
                    if (b === 0) {
                        b = 1;
                    } else {
                        $(a).remove();
                    }
                    $(this).replaceWith(this.textContent.replace(e, d));
                } else {
                    if (this.nodeType === 3) {
                        if (b === 1) {
                            b = 0;
                        }
                    } else {
                        if (this.nodeName === "BR") {
                            a = this;
                        }
                    }
                }
            });
        });
    }
};
app.mod.chathighlighter = {
    id: "a-chathighlighter",
    title: "Chat highlighter",
    description: "Assign colours to particular phrases in the chat! (requested by Certicom).",
    items: [{
        type: "list",
        id: "a-chathighlighter-list",
        defaultValue: "ace700;FF0000\nborrok;00FF00",
        description: "One entry per line, marked phrase separated from a hexadecimal color with a semi-colon:"
    }],
    filter: function () {
        if (!gc.getValue("a-chathighlighter")) {
            return false;
        }
        if (!gc.getValue("a-chathighlighter-list")) {
            return false;
        }
        if (!$("#chat, table.bodybox[width='105'], td[colspan='3'] table.table_back").length) {
            return false;
        }
        return true;
    },
    plugin: function () {
        function c(e, d, f) {
            e.contents().each(function () {
                if (this.nodeType === 3 && $(this).text().match(d)) {
                    $(this).replaceWith($(this).text().replace(d, '<span style="color: #' + f + '">' + d + "</span>", "g"));
                } else {
                    if (this.nodeType === 3) {} else {
                        if ($(this).text().match(d)) {
                            c($(this), d, f);
                        }
                    }
                }
            });
        }
        var b = gc.getValue("a-chathighlighter-list") ? gc.getValue("a-chathighlighter-list").split("\n") : [];
        var a = function () {
            for (var e = 0; e < b.length; e = e + 1) {
                if (!b[e].match(";")) {
                    console.error("[Chat highlighter] Setting '" + b[e] + "' is incorrect. There should be a semicolon in it.");
                    continue;
                }
                var g = b[e].split(";");
                var d = g[0];
                var f = g[1];
                if ((f.length !== 6 && f.length !== 3) || f.replace(/\D/g, "") === "") {
                    console.error("[Chat highlighter] Setting '" + b[e] + "' is incorrect. The assigned colour value is incorrect.");
                    continue;
                }
                c($("#chat, table.bodybox[width='105'], td[colspan='3'] table.table_back"), d, f);
            }
        };
        a();
        if (gc.location.indexOf("i_chat.cfm") !== -1) {
            window.setInterval(a, 10000);
        }
    }
};
app.mod.clicktocontinue = {
    id: "a-clicktocontinue",
    defaultValue: true,
    title: "Click to continue",
    description: 'Some pages show a "Click to continue" message. This mod clicks there automatically.',
    filter: function () {
        if (!gc.getValue("a-clicktocontinue")) {
            return false;
        }
        return true;
    },
    plugin: function () {
        var a = $("a:contains('Click here to continue.')");
        if (a.length) {
            a[0].click();
        }
    }
};
app.mod.clusterbuilder = {
    id: "a-clusterbuilder",
    defaultValue: true,
    title: "Cluster builder",
    description: "Build your C1s and C2s really fast. You must have researched respective colony levels first, of course...",
    filter: function () {
        if (!gc.getValue("a-clusterbuilder")) {
            return false;
        }
        if (gc.location.match(/f=com_col$/)) {
            return true;
        }
        return false;
    },
    plugin: function () {
        var a = $("input[value='Plunder Colony']");
        a.after("<br /><span class=\"table_row1 a-clusterbuilder-button a-button\"	id=\"a-clusterbuilder-createc1\">Create a C1</span>&nbsp;&nbsp;<span class=\"table_row1 a-clusterbuilder-button a-button\"	id=\"a-clusterbuilder-createc2\">Create a C2</span>&nbsp;&nbsp;<select id=\"a-clusterbuilder-mineral\">	<option value=\"1\">Terran Metal</option>	<option value=\"2\">Red Crystal</option>	<option value=\"3\">White Crystal</option>	<option value=\"4\">Rutile</option>	<option value=\"5\">Composite</option>	<option value=\"6\" selected=\"selected\">Strafez Organism</option></select>");
        $("#a-clusterbuilder-createc1").click(function (c) {
            var b = $("#a-clusterbuilder-mineral option:selected").val();
            gc.xhr({
                url: app.gameServer + "i.cfm?&" + gc.getValue("antiReload") + "&f=com_colupgrade&tid=20&con=1",
                data: "goodid=" + b,
                onFailure: function (d) {
                    console.error("[Cluster builder] XHR query to create a C1 cluster failed.");
                },
                successCondition: "td:contains('New C1 was formed !')",
                onSuccess: function (d) {
                    console.log("[Cluster builder] A new C1 cluster was formed.");
                }
            });
        });
        $("#a-clusterbuilder-createc2").click(function (c) {
            var b = $("#a-clusterbuilder-mineral option:selected").val();
            gc.xhr({
                url: app.gameServer + "i.cfm?&" + gc.getValue("antiReload") + "&f=com_colupgrade&tid=21&con=1",
                data: "goodid=" + b,
                onFailure: function (d) {
                    console.error("[Cluster builder] XHR query to create a C2 cluster failed.");
                },
                successCondition: "td:contains('New C2 was formed !')",
                onSuccess: function (d) {
                    console.log("[Cluster builder] A new C2 cluster was formed.");
                }
            });
        });
    }
};
app.mod.commoncss = {
    id: "a-commoncss",
    defaultValue: true,
    title: "Common css actions",
    description: "Css manipulations common to most mods, eg.: on mouse over background change for action buttons.",
    items: [{
        type: "info",
        text: "You really should not disable this part, but if you want to take the eye candy off, feel free to do so."
    }],
    filter: function () {
        if (!gc.getValue("a-commoncss")) {
            return false;
        }
        return true;
    },
    plugin: function () {
        $(".a-button").hover(function () {
            $(this).addClass("table_row0").removeClass("table_row1");
        }, function () {
            $(this).removeClass("table_row0").addClass("table_row1");
        });
        $(".a-revbutton").hover(function () {
            $(this).removeClass("table_row0").addClass("table_row1");
        }, function () {
            $(this).addClass("table_row0").removeClass("table_row1");
        });
    }
};
app.mod.credits = {
    id: "a-credits",
    defaultValue: true,
    title: "Credits",
    description: "Adds a short info blob about the mods to status page.",
    filter: function () {
        if (!gc.getValue("a-credits")) {
            return false;
        }
        if (gc.location.match(/com_empire&cm=2/)) {
            return true;
        }
        if (gc.location.match(/com_empire&cm=4/)) {
            return true;
        }
        return false;
    },
    plugin: function () {
        var a = '<div id="a-credits-text">You\'re using <a href="javascript:cmsgu(\'i.cfm?popup=msguser&uid=213512\');">Anfit</a>\'s GC Mod Pack v.${version} <a href="i.cfm?f=option">Check out the options and enjoy!</a> <a href="http://gc.mmanir.net"><img src="data:image/jpeg;base64,%2F9j%2F4AAQSkZJRgABAQAAAQABAAD%2F2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys%2FRD84QzQ5Ojf%2F2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf%2FwAARCAAKAAoDASIAAhEBAxEB%2F8QAFwAAAwEAAAAAAAAAAAAAAAAAAgQGB%2F%2FEACAQAAEFAAICAwAAAAAAAAAAAAECAwQFERIhAAZRUpH%2FxAAUAQEAAAAAAAAAAAAAAAAAAAAF%2F8QAGREBAAMBAQAAAAAAAAAAAAAAAQACAwQi%2F9oADAMBAAIRAxEAPwAPX6Wt9IZXZzkGfFXCbkKjvw0K5cwCSFYcQnQOX26A77lri%2Fp3LecuK8lDCpDhaQls4lPI4BgzM%2BOvGba1sXaOVDdsJa4ojlIYU8oowDocdzBg%2FPM28NribHphuPLXrF0Wf%2F%2FZ"/></a> (${paid} account${authenticated})</div>';
        $.tmpl(a, {
            paid: gc.isPaid ? "paid" : "normal",
            authenticated: gc.authenticated ? "" : ", UNAUTHENTICATED with modserver",
            version: app.version
        }).appendTo("td:contains('Welcome to (SFGC) Galactic Conquest'):last");
    }
};
app.mod.disbandertweaks = {
    id: "a-disbandertweaks",
    defaultValue: true,
    title: "Fleet disbander tweaks",
    description: 'Slightly improves the "Manage Fleet" page. Calculates total PR and fleet PR after disbanding, shows 130% and 150% threshold, etc.',
    items: [{
        type: "info",
        text: "You can also disband stacks entire from the manage fleet page if you have that mod enabled."
    }],
    filter: function () {
        if (!gc.getValue("a-disbandertweaks")) {
            return false;
        }
        if (gc.location.match(/com_disband$/)) {
            return true;
        }
        return false;
    },
    plugin: function () {
        $("table.bodybox[width='550'] td:first").append("<div>Anfit's tweaks:<ul><li>All you have to do is type in the input fields.</li><li>Quick disband (-10/-50) idea by VorteX...</li></ul></div>");
        var d = $("table.table_back[width='500'] table");
        var e = $("tr", d);
        if (e && e.length === 1) {
            return;
        }
        e.first().append('<td class="a-revbutton a-disbandertweaks-disband10" title="Click to prepare a 10% stack disband query">-10</td><td class="a-revbutton a-disbandertweaks-disband50" title="Click to prepare a 50% stack disband query">-50</td><td class="a-revbutton a-disbandertweaks-disbandall" title="Click to prepare a full stack disband query">all</small></td>');
        e.filter("tr:gt(0)").append('<td class="a-button a-disbandertweaks-disband10" title="Click to prepare a 10% stack disband query">-10</td><td class="a-button a-disbandertweaks-disband50" title="Click to prepare a 50% stack disband query">-50</td><td class="a-button a-disbandertweaks-disbandall" title="Click to prepare a full stack disband query">all</small></td>');
        $("tr.table_row0:first", d).parent().attr("id", "a-disbandertweaks-parentTable");
        $("td.a-disbandertweaks-disband10:first").click(function () {
            $("td.a-disbandertweaks-disband10:gt(0)").each(function () {
                $(this)[0].click();
            });
        });
        $("td.a-disbandertweaks-disband50:first").click(function () {
            $("td.a-disbandertweaks-disband50:gt(0)").each(function () {
                $(this)[0].click();
            });
        });
        $("td.a-disbandertweaks-disbandall:first").click(function () {
            $("td.a-disbandertweaks-disbandall:gt(0)").each(function () {
                $(this)[0].click();
            });
        });
        $("tr:gt(0)", d).each(function () {
            var h = $.trim($("td:eq(0)", this).text());
            var g = $("td:eq(5)", this).text().replace(/\D/g, "");
            var l = $("td:eq(3)", this).text().replace(/\D/g, "");
            var k = $("td:eq(4)", this).text().replace(/\D/g, "");
            var j = k / l;
            var m = $("td:eq(2) input", this);
            m.val(0);
            var n = $("td:eq(3)", this);
            var i = $("td:eq(4)", this);
            var f = $("td:eq(6)", this);
            f.addClass("a-disbandertweaks-stackpr");
            $("td.a-disbandertweaks-disband10", this).click(function (o) {
                m.val(Math.floor(l * 0.1));
                m.trigger("change");
            });
            $("td.a-disbandertweaks-disband50", this).click(function (o) {
                m.val(Math.floor(l * 0.5));
                m.trigger("change");
            });
            $("td.a-disbandertweaks-disbandall", this).click(function (o) {
                m.val(l);
                m.trigger("change");
            });
            m.change(function (s) {
                var r = $(this).val().replace(/\D/g, "") * 1;
                var q = Math.max(l - r, 0);
                n.html(app.util.formatCurrency(q) + "&nbsp;");
                i.html(app.util.formatCurrency(q * j) + "&nbsp;");
                f.html(app.util.formatCurrency(q * g));
                var o = 0;
                $("td.a-disbandertweaks-stackpr").each(function () {
                    o += $(this).text().replace(/\D/g, "") * 1;
                });
                var p = $("#a-disbandertweaks-fleetPr").attr("basePr") * 1;
                $("#a-disbandertweaks-fleetPr").text(app.util.formatCurrency(o));
                $("#a-disbandertweaks-totalPr").text(app.util.formatCurrency(p + o));
                $("#a-disbandertweaks-totalPr130").text(app.util.formatCurrency(Math.floor((p + o) / 1.3)));
                $("#a-disbandertweaks-totalPr150").text(app.util.formatCurrency(Math.floor((p + o) / 1.5)));
            });
        });
        var a = 0;
        $("td.a-disbandertweaks-stackpr").each(function () {
            a += $(this).text().replace(/\D/g, "") * 1;
        });
        var c = 1 * gc.power.getValue() - a;
        var b = '<tr class="table_row0"><td colspan="5"/><td>total fleet pr:</td><td id="a-disbandertweaks-fleetPr" align="right" basepr="${basePr}">${fleetPr}</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr class="table_row0"><td colspan="5"/><td>total pr:</td><td id="a-disbandertweaks-totalPr" align="right">${totalPr}</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr class="table_row0"><td colspan="5"/><td>pr / 130%:</td><td id="a-disbandertweaks-totalPr130" align="right">${totalPr130}</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr class="table_row0"><td colspan="5"/><td>pr / 150%:</td><td id="a-disbandertweaks-totalPr150" align="right">${totalPr150}</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
        $.tmpl(b, {
            basePr: c,
            fleetPr: app.util.formatCurrency(a),
            totalPr: app.util.formatCurrency(gc.power.getValue()),
            totalPr130: app.util.formatCurrency(Math.floor(gc.power.getValue() / 1.3)),
            totalPr150: app.util.formatCurrency(Math.floor(gc.power.getValue() / 1.5))
        }).appendTo("#a-disbandertweaks-parentTable", d);
    }
};
app.mod.fedchat = {
    id: "a-fedchat",
    defaultValue: true,
    title: "Fed chat instead of Chat",
    description: "Replaces the usual chat on main GC pages (on the right) with fed discussion board.",
    filter: function () {
        if (!gc.getValue("a-fedchat")) {
            return false;
        }
        if (gc.location.indexOf("fed_forum") !== -1) {
            return false;
        }
        if ($("table.bodybox[width='105'] tbody tr td")[0]) {
            return true;
        }
        return false;
    },
    plugin: function () {
        var a = $("table.bodybox[width='105'] tbody tr td:first");
        if (!gc.getValue("a-fedchat-lastupdate") || !gc.getValue("a-fedchat-lastupdate")) {
            gc.setValue("a-fedchat-lastupdate", gc.timestamp);
        }
        if (gc.timestamp - 600000 > gc.getValue("a-fedchat-lastupdate") || !gc.getValue("fedchat.html")) {
            gc.xhr({
                method: "GET",
                url: app.gameServer + "i.cfm?f=fed_forum",
                onFailure: function (b) {
                    console.error("[Fed chat] XHR query to get posts failed");
                },
                onSuccess: function (b) {
                    var c = "";
                    $("tr.table_row1[valign='top'], tr.table_row2", b).each(function () {
                        var d = $(this).children().first().html().replace(/\s+<a.*/, "");
                        var e = $(this).children().last().text();
                        c += "<u>" + d + "</u>: " + e + '<br/><img height="5" src="i/w/sp_.gif"/><br/>';
                    });
                    gc.setValue("a-fedchat-lastupdate", gc.timestamp);
                    a.html(c);
                    gc.setValue("fedchat.html", c);
                }
            });
        } else {
            a.html(gc.getValue("fedchat.html"));
        }
        a.attr("title", "Doubleclick to switch to fedchat");
        a.dblclick(function () {
            document.location.href = "http://gc.gamestotal.com/i.cfm?f=fed_forum";
        });
    }
};
app.mod.fedpms = {
    id: "a-fedpms",
    defaultValue: true,
    title: "Fed private messages",
    description: "Send a pm to all the members of your federation with a single click.",
    items: [{
        type: "info",
        text: "This mods adds a special message box below on the page listing members of the fed you are in."
    }],
    filter: function () {
        if (!gc.getValue("a-fedpms")) {
            return false;
        }
        if (gc.location.indexOf("fed_member") !== -1 || gc.location.match(/#post/)) {
            return true;
        }
        return false;
    },
    plugin: function () {
        if (gc.location.match(/#post/)) {
            $("textarea[name='forum2']").val(gc.getValue("a-fedpms-message"));
            $("input[name='remLen2']").val(gc.getValue("a-fedpms-remaining"));
            $("input[value*='Send']")[0].click();
            return;
        }
        $("table.bodybox[width='400'] td:first").prepend('<div><center>PM all of the above, except yourself, via this form:<br /><textarea cols=67 rows=5 id="message"></textarea><br /><br /><input id="a-fedpms-submit" type="button" value="submit" /></center><br /></div>');
        var b = [];
        $("a[href*='msguser']").each(function () {
            var c = $.trim($(this).text());
            if (c !== gc.empireName) {
                b.push(c);
            }
        });
        $("body:first").append('<iframe id="a-fedpms-iframe"></iframe>');

        function a() {
            var c = b.shift();
            gc.setValue("a-fedpms-recipient", c);
            gc.setValue("a-fedpms-status", "SENDING");
            console.log("[Fed PMs] Sending message to " + c + " ...");
            $("#a-fedpms-iframe")[0].src = "i.cfm?popup=msguser&nic=" + c + "&se=" + gc.server.id + "#post";
        }
        $("#a-fedpms-iframe").load(function (d) {
            if ($(this)[0].src) {
                var c = gc.getValue("a-fedpms-status");
                if (c === "SENDING") {
                    console.log("[Fed PMs] Message to " + gc.getValue("a-fedpms-recipient") + " sent or sending failed silently.");
                    gc.setValue("a-fedpms-status", "IDLE");
                    if (b.length) {
                        a();
                    } else {
                        $("#message").val("");
                        gc.setValue("a-fedpms-message", "");
                        gc.setValue("a-fedpms-remaining", "");
                        gc.setValue("a-fedpms-recipient", "");
                        gc.setValue("a-fedpms-status", "");
                        console.log("[Fed PMs] Outgoing message queue is empty.");
                    }
                }
            }
        });
        $("#a-fedpms-submit").click(function () {
            var d = $("#message").val().substring(0, 2000);
            var c = 2000 - d.length;
            gc.setValue("a-fedpms-message", d);
            gc.setValue("a-fedpms-remaining", c);
            console.log("[Fed PMs] PMs are being sent to your fedmates. Do not close this window for a while unless you want to stop sending...");
            a();
        });
    }
};
app.mod.forumkillfile = {
    id: "a-forumkillfile",
    title: "Forum killfile",
    description: "Removes forum posts and threads by users you list in the settings.",
    items: [{
        type: "list",
        id: "a-forumkillfile-list",
        defaultValue: "usernameOne,usernameTwo",
        description: "Enter name of people you want to ignore, comma-separated (in one line)"
    }],
    filter: function () {
        if (!gc.getValue("a-forumkillfile")) {
            return false;
        }
        if (!gc.getValue("a-forumkillfile-list")) {
            return false;
        }
        if (gc.location.indexOf("hef") !== -1) {
            return true;
        }
        return false;
    },
    plugin: function () {
        var b = gc.getValue("a-forumkillfile-list").replace(/ /g, "").split(",");
        for (var c = 0; c < b.length; c = c + 1) {
            var a = b[c];
            if (!a) {
                continue;
            }
            $("tr td.fs font:contains('" + a + "')").parent().parent().addClass("a-forumkillfile-hidden");
            $("tr td:first-child a:contains('" + a + "')").parent().parent().addClass("a-forumkillfile-hidden");
            $("tr.tb1 td:first-child").attr("width", "1%");
        }
    }
};
app.mod.infratweak = {
    id: "a-infratweak",
    defaultValue: true,
    title: "Infrastructure building tweak",
    description: "Build at most 99999 of anything on a colony (at once) instead of 999.",
    filter: function () {
        if (!gc.getValue("a-infratweak")) {
            return false;
        }
        if (gc.location.match(/com_col.*colid/)) {
            return true;
        }
        return false;
    },
    plugin: function () {
        $("input[maxlength='3']").attr("maxlength", 5);
    }
};
app.mod.keybindings = {
    id: "a-keybindings",
    title: "Key bindings",
    description: "Add key bindings of your choice to most GC pages (all except forum - if you feel forum should be included, contact me - Anfit).",
    items: [{
        type: "list",
        id: "a-keybindings-list",
        defaultValue: app.gameServer + "forum2/;F\n" + app.gameServer + "i.cfm?&antireload&f=com_ship2&shiptype=19;V",
        description: 'Replace SFGC\'s antireload with "antireload". V is capital v and stands for "Shift+v".'
    }],
    filter: function () {
        if (!gc.getValue("a-keybindings")) {
            return false;
        }
        if (!gc.getValue("a-keybindings-list")) {
            return false;
        }
        if (gc.location.indexOf("i.cfm") !== -1) {
            return true;
        }
        return false;
    },
    plugin: function () {
        $(window).keypress(function (e) {
            var g = $(e.target).parentsUntil("TEXTAREA, INPUT, BUTTON");
            if (g.length) {
                return;
            }
            var d = gc.getValue("a-keybindings-list").replace(/antireload/g, gc.getValue("antiReload")).split("\n");
            for (var b = 0; b < d.length; b = b + 1) {
                var f = d[b].split(";");
                var a = f[1];
                var c = f[0];
                if (f.length !== 2 || a.length !== 1) {
                    console.error("[Key bindings] config line " + d[b] + " is wrong...");
                    continue;
                }
                if (String.fromCharCode(e.which) === a) {
                    document.location.href = c;
                }
            }
        });
    }
};
app.mod.markettweaks = {
    id: "a-markettweaks",
    defaultValue: true,
    title: "Market tweaks",
    description: "Adds small improvements to the market (buy faster and similar, see notes added to the market pages). Thx, Wingnut for the idea!.",
    items: [{
        type: "info",
        text: "Type in a price total and is calculates the amount; click on the topmost offer to fill in the purchase form with that amount; ctrl-click on the topmost offer to buy it."
    }],
    filter: function () {
        if (!gc.getValue("a-markettweaks")) {
            return false;
        }
        if (gc.location.indexOf("market2") !== -1) {
            return true;
        }
        return false;
    },
    plugin: function () {
        $("input[name^='total']").removeAttr("onfocus");
        $("input[name='totalbuy']").change(function (b) {
            $("input[name='amount']").val(Math.floor($("input[name='totalbuy']").val() / $("input[name='price']").val()));
        });
        $("input[name='totalsell']").change(function (b) {
            $("input[name='amount']").val(Math.floor($("input[name='totalsell']").val() / $("input[name='price']").val()));
        });
        var a = $("table.bodybox[width='550'] table.table_back:eq(3) table tr:eq(1)");
        a.attr("title", "Click to fill the buy field with the amount from the topmost offer. Ctrl-click to buy this offer, instead.");
        a.addClass("a-button");
        a.click(function (b) {
            $("input[name='amount']").val($("td:eq(1)", this).text().replace(/^\s*|,|\s*$/g, ""));
            if (b.ctrlKey === true) {
                $("input[name='buyflag']")[0].click();
            }
        });
        $("table.bodybox[width='550'] td:first").append("<div><ul><li>Type total price and amount gets calculated automagickally (idea by wingnut),</li><li>Click on the topmost offer to fill the buy field with that amount,</li><li>Ctrl-click on the topmost offer to BUY it.</li></ul></div>");
    }
};
app.mod.newbieranking = {
    id: "a-newbieranking",
    defaultValue: true,
    title: "Ranking around newbie protection",
    description: "Replaces the absurd empty 'Rank near me' page for empires in Newbie Protection with something which may show some empires around thr 5000PR threashold. If your servers is underpopulated you might want to change the threshold value below to something higher (idea: wingnut).",
    items: [{
        id: "a-newbieranking-threshold",
        defaultValue: "7000",
        type: "list",
        description: 'Show empires with power rating this high or lower. If no empires above newbie protection, but below this value exist, then the usual "Nothing listed here" message will be shown...'
    }],
    filter: function () {
        if (!gc.getValue("a-newbieranking")) {
            return false;
        }
        if (!gc.location.indexOf("rank") !== -1) {
            return false;
        }
        if (gc.power.getValue() >= 5000) {
            return false;
        }
        return true;
    },
    plugin: function () {
        $("a[href$='rank2']").attr("href", "i.cfm?f=rank2&nx=" + gc.getValue("a-newbieranking-threshold"));
    }
};
app.mod.pagetitles = {
    id: "a-pagetitles",
    defaultValue: true,
    title: "Page titles",
    description: "Adds sensible page titles to most GC Pages. Makes multi-tab browsing way more user-friendly: different pages get different tab titles.",
    items: [{
        type: "info",
        text: "A page title == global prefix + local prefix + page title. Here you can change the first one and toggle the second one on/off."
    }, {
        type: "input",
        id: "a-pagetitles-tag",
        description: "Set the global prefix here:",
        defaultValue: "(GC) "
    }, {
        type: "checkbox",
        id: "a-pagetitles-allowlocal",
        description: 'Allow local prefixes like "Build:" before shipnames and "Market:" before minerals etc?'
    }],
    filter: function () {
        if (!gc.getValue("a-pagetitles")) {
            return false;
        }
        return true;
    },
    plugin: function () {
        var f = gc.getValue("a-pagetitles-tag");
        var g = f ? f : "";
        var c = "";
        var a = [{
            title: "Counters",
            regexp: "rank2.*ty=3"
        }, {
            title: "Rank near me",
            regexp: "rank2"
        }, {
            title: "Top Stats",
            regexp: "rank_s"
        }, {
            title: "Top Planets",
            regexp: "rank.*ty=1"
        }, {
            title: "Top Ranking",
            regexp: "rank$"
        }, {
            title: "Options",
            regexp: "option"
        }, {
            title: "Fed Battles",
            regexp: "fed_prev"
        }, {
            title: "Feds2",
            regexp: "fed_join2"
        }, {
            title: "Feds",
            regexp: "fed_join$"
        }, {
            title: "Fedchat",
            regexp: "fed_forum"
        }, {
            title: "Fed Details",
            regexp: "fed_detail"
        }, {
            title: "Fed...",
            regexp: "fed_"
        }, {
            title: "Research Mining",
            regexp: "com_research2.*rtype=5"
        }, {
            title: "Research Agriculture",
            regexp: "com_research2.*rtype=4"
        }, {
            title: "Research Industry",
            regexp: "com_research2.*rtype=3"
        }, {
            title: "Research Commercial",
            regexp: "com_research2.*rtype=2"
        }, {
            title: "Research Housing",
            regexp: "com_research2.*rtype=1"
        }, {
            title: "Research",
            regexp: "com_research$"
        }, {
            title: "Capsule Lab",
            regexp: "com_project2.*id=3.*new=1"
        }, {
            title: "Loktar",
            regexp: "com_project2.*id=2.*new=1"
        }, {
            title: "Hektar",
            regexp: "com_project2.*id=1.*new=1"
        }, {
            title: "Projects",
            regexp: "com_project"
        }, {
            title: "Missions",
            regexp: "com_mission"
        }, {
            title: "Strafez",
            regexp: "com_market2.*gid=6"
        }, {
            title: "Composite",
            regexp: "com_market2.*gid=5"
        }, {
            title: "Rutile",
            regexp: "com_market2.*gid=4"
        }, {
            title: "White Crystal",
            regexp: "com_market2.*gid=3"
        }, {
            title: "Consumer Goods",
            regexp: "com_market2.*gid=24"
        }, {
            title: "Raws",
            regexp: "com_market2.*gid=23"
        }, {
            title: "Ore",
            regexp: "com_market2.*gid=22"
        }, {
            title: "Food",
            regexp: "com_market2.*gid=21"
        }, {
            title: "Red Crystal",
            regexp: "com_market2.*gid=2"
        }, {
            title: "Terran Metal",
            regexp: "com_market2.*gid=1"
        }, {
            title: "Market",
            regexp: "com_market$"
        }, {
            title: "Intelligence",
            regexp: "com_intel"
        }, {
            title: "Income",
            regexp: "com_income"
        }, {
            title: "Explore",
            regexp: "com_explore"
        }, {
            title: "Events",
            regexp: "com_empire.*cm=4"
        }, {
            title: "Summary",
            regexp: "com_empire.*cm=3"
        }, {
            title: "Events",
            regexp: "com_empire.*cm=2"
        }, {
            title: "Fleet",
            regexp: "com_disband"
        }, {
            title: "Create C3",
            regexp: "com_colupgrade.*tid=22"
        }, {
            title: "Create C2",
            regexp: "com_colupgrade.*tid=21"
        }, {
            title: "Create C1",
            regexp: "com_colupgrade.*tid=20"
        }, {
            title: "Clustering",
            regexp: "com_colupgrade"
        }, {
            title: "Reward",
            regexp: "com_col_r.*colid.\d+"
        }, {
            title: "Plunder",
            regexp: "com_col_plunder.*colid.\d+"
        }, {
            title: "Dig",
            regexp: "com_col_find.*colid.\d+"
        }, {
            title: "Colony",
            regexp: "com_col.*colid.\d+"
        }, {
            title: "Colonies",
            regexp: "com_col"
        }, {
            title: "Battle Result",
            regexp: "com_attack3"
        }, {
            title: "Attack Info",
            regexp: "com_attack2"
        }, {
            title: "Battle Logs",
            regexp: "com_attack_prev"
        }, {
            title: "Attack",
            regexp: "com_attack"
        }, {
            title: "Forum",
            regexp: "hef.cfm"
        }, {
            title: "Chat",
            regexp: "com_msgsector"
        }, {
            title: "Post to Chat",
            regexp: "popup=msgsector"
        }, {
            title: "Build Ships",
            regexp: "com_ship"
        }, {
            title: "Artifacts",
            regexp: "com_market_use"
        }];
        var e = "";
        if (gc.location.indexOf("com_ship2") !== -1) {
            e = "Build: ";
            var b = $("td[width='40%']:first");
            if (b.length) {
                c = $.trim(b.text());
            } else {
                c = "Build";
            }
        } else {
            if (gc.location.indexOf("com_market2") !== -1) {
                e = "Market: ";
            }
            for (var d = 0; d < a.length; d = d + 1) {
                if (gc.location.match(new RegExp(a[d].regexp))) {
                    c = a[d].title;
                    break;
                }
            }
        } if (gc.getValue("a-pagetitles-allowlocal")) {
            g += e;
        }
        g += c;
        if (c) {
            document.title = g;
        }
    }
};
app.mod.planetplunderer = {
    id: "a-planetplunderer",
    defaultValue: true,
    title: "Planet plunderer",
    description: "Fast plunder for non-paid accounts.",
    items: [{
        type: "info",
        text: "Adds direct plunder buttons to planet list. Support Stephen so he can update GC oh so often. Or be a cheap bastard and use this tweak... And, no, you cannot plunder somebody else's planets, I have checked >:)"
    }],
    filter: function () {
        if (!gc.getValue("a-planetplunderer")) {
            return false;
        }
        if (gc.isPaid) {
            return false;
        }
        if (gc.location.match(/f=com_col$/)) {
            return true;
        }
        return false;
    },
    plugin: function () {
        var b = $("table.table_back[width='100%'] table[width='100%']");
        $("tr:first", b).append("<td>&nbsp;x&nbsp;</td>");
        $("tr td:first", b).remove();
        var c = $("tr.table_row1", b);
        c.each(function () {
            var d = $("input", this).val();
            $(this).children().first().remove();
            if (d) {
                $(this).append('<td class="a-planetplunderer-plunderable a-button" planetid="' + d + '">&nbsp;x&nbsp;</td>');
            } else {
                $(this).append("<td>&nbsp;&nbsp;&nbsp;</td>");
            }
        });
        $(".a-planetplunderer-plunderable").click(function () {
            var d = $(this).attr("planetid");
            gc.xhr({
                url: app.gameServer + "i.cfm?&f=com_col_plunder&cid=" + d + "&co=1",
                successCondition: "b:contains('Colony has been destroyed')",
                onSuccess: function (e) {
                    console.log("[Planet plunderer] Planet " + d + " was destroyed.");
                    $("td.a-planetplunderer-plunderable[planetid='" + d + "']").parent().remove();
                },
                onFailure: function (e) {
                    console.error("[Planet plunderer] XHR query to plunder aa planet " + d + " failed.");
                }
            });
        });
        var a = $("input[value='Plunder Colony']");
        a.hide();
    }
};
app.mod.presetbuilder = {
    id: "a-presetbuilder",
    defaultValue: true,
    title: "Preset builder",
    description: "Build stacks fast from saved presets.",
    items: [{
        type: "info",
        text: "This mod replaces the quick dial. It offers some of the functionalities its predecessor. Is quite likely to be actively developed in the future."
    }],
    filter: function () {
        if (!gc.getValue("a-presetbuilder")) {
            return false;
        }
        if (gc.location.indexOf("rank") !== -1) {
            return true;
        }
        if (gc.location.indexOf("com_explore") !== -1) {
            return true;
        }
        if (gc.location.indexOf("com_attack") !== -1) {
            return true;
        }
        return false;
    },
    plugin: function () {
        $("body").append('<div id="a-presetbuilder-wrap" class="draggable" title="These presets can be edited from the Build Ships page"><b>Presets: </b><br/><table class="a-table" width="100%" id="a-presetbuilder-saves"><tbody><tr class="table_row2"><td id="a-ship-save-a" class="a-presetbuilder-save a-button">&nbsp;</td><td id="a-ship-save-b" class="a-presetbuilder-save a-button">&nbsp;</td><td id="a-ship-save-c" class="a-presetbuilder-save a-button">&nbsp;</td><td id="a-ship-save-d" class="a-presetbuilder-save a-button">&nbsp;</td><td id="a-ship-save-e" class="a-presetbuilder-save a-button">&nbsp;</td></tr><tr class="table_row2"><td id="a-ship-save-f" class="a-presetbuilder-save a-button">&nbsp;</td><td id="a-ship-save-g" class="a-presetbuilder-save a-button">&nbsp;</td><td id="a-ship-save-h" class="a-presetbuilder-save a-button">&nbsp;</td><td id="a-ship-save-i" class="a-presetbuilder-save a-button">&nbsp;</td><td id="a-ship-save-j" class="a-presetbuilder-save a-button">&nbsp;</td></tr></tbody></table></div><div id="a-presetbuilder-save-infobox" style="display: none;"><table width="100%"><tbody><tr></tr></tbody></table></div>');
        var a = gc.getValue("a-allships", "JSON_AS_ARRAY");
        var c = "How to use the preset builder";
        var b = "Preset builder allows to build many different ships at once, fast. You have to define a preset first in the ship builder. Afterwards you can just click on an item in the preset list to build it, if you have the resources and turns of course.";
        gc.showMessage(c, b, "a-presetbuilder-usagehelp");
        var d = $("#a-presetbuilder-wrap b:contains('Presets')");
        d.append('<img src="i/help.gif" title="' + c + '" />').click(function () {
            if (!$("#a-presetbuilder-usagehelp").length) {
                gc.showMessage(c, b);
            }
        });
        $("#a-presetbuilder-wrap").css("top", typeof gc.getValue("a-presetbuilder-wrap-top") === "undefined" ? 108 : gc.getValue("a-presetbuilder-wrap-top"));
        $("#a-presetbuilder-wrap").css("left", typeof gc.getValue("a-presetbuilder-wrap-left") === "undefined" ? 0 : gc.getValue("a-presetbuilder-wrap-left"));
        $("#a-presetbuilder-wrap").mousedown(app.util.startDragging);
        $(document).bind("dragStop", function (i, f, h, g) {
            gc.setValue(f + "-top", h);
            gc.setValue(f + "-left", g);
        });
        $(".a-presetbuilder-save").each(function () {
            var f = $(this).attr("id");
            var e = gc.getValue(f + "-name");
            if (e) {
                $(this).text(e);
            }
        });
        $(".a-presetbuilder-save").click(function () {
            var j = $(this).attr("id");
            var g = gc.getValue(j + "-value", "JSON_AS_ARRAY");
            if (g.length) {
                var h = function (i) {
                    var k = $("td:contains('You bought ')", i).contents().filter(function () {
                        return this.nodeType === 3 && this.textContent.match("You bought");
                    });
                    console.log("[Preset builder] " + k.text());
                };
                var f = function (i) {
                    var k = $("b:contains('SHIPS')", i).text();
                    var l = $("font[color='red'] > b", i).text();
                    console.error("[Preset builder] " + k + ": " + l);
                };
                for (var e = 0; e < g.length; e = e + 1) {
                    gc.xhr({
                        url: "i.cfm?&f=com_ship2&shiptype=" + g[e].id,
                        data: "amount=" + g[e].amount,
                        successCondition: "td:contains('You bought ')",
                        onSuccess: h,
                        onFailure: f
                    });
                }
            }
        });
        $(".a-presetbuilder-save").hover(function (l) {
            var f = $(this).attr("id");
            var o = gc.getValue(f + "-value");
            if (o && o !== "[]") {
                $(this).text("build");
                var m = gc.getValue(f + "-value", "JSON_AS_ARRAY");
                var g = {
                    name: "total",
                    amount: "",
                    turns: 0,
                    power: 0
                };
                var h = [];
                for (var j = 0; j < m.length; j = j + 1) {
                    var n = jQuery.extend(true, {}, a[m[j].id]);
                    n.amount = m[j].amount;
                    n.turns = Math.ceil(m[j].amount / n.build);
                    n.power = n.power * n.amount;
                    g.turns += n.turns;
                    g.power += n.power;
                    h.push(n);
                }
                h.sort(app.util.sortByPowerDesc);
                var p = '<tr class="a-presetbuilder-save-body"><td align="left"  width="70%">${name}</td><td align="right" width="10%">${amount}</td><td align="right" width="10%">${turns}</td><td align="right" width="10%">${power}</td></tr>';
                $("#a-presetbuilder-save-infobox").attr("style", "display: block; top: " + (l.clientY + 25) + "px; left: " + (l.clientX + 5) + "px;");
                $.tmpl(p, h).appendTo("#a-presetbuilder-save-infobox tbody");
                var k = '<tr id="a-presetbuilder-totals-body"><td align="left"  width="70%">${name}</td><td align="right" width="10%">${amount}</td><td align="right" width="10%">${turns}</td><td align="right" width="10%">${power}</td></tr>';
                $.tmpl(k, g).appendTo("#a-presetbuilder-save-infobox tbody");
            }
        }, function () {
            var g = $(this).attr("id");
            var f = gc.getValue(g + "-value");
            if (f && f !== "[]") {
                var e = gc.getValue(g + "-name");
                $(this).text(e);
                $("#a-presetbuilder-save-infobox tr").remove();
                $("#a-presetbuilder-save-infobox").hide();
            } else {
                $(this).html("&nbsp;");
            }
        });
    }
};
app.mod.rankingtweaks = {
    id: "a-rankingtweaks",
    defaultValue: true,
    title: "Ranking tweaks",
    description: "Many tweaks to the ranking list. See below for a details.",
    items: [{
        type: "checkbox",
        id: "a-rankingtweaks-statuses",
        defaultValue: true,
        description: "Enable empire statuses"
    }, {
        type: "info",
        text: "Show your empire's status and other empires' statuses in the ranking list below empire name (others will still see yours). Status is a short text meant to be visible to others. It will be visible to other users of this mod. Statuses are stored on my (Anfit's) server, so they can be changed and re-checked only if that server is up and running."
    }, {
        type: "input",
        id: "a-rankingtweaks-statuses-mystatus",
        defaultValue: "I have installed Anfit Mods",
        description: "Your empire's status:"
    }, {
        type: "input",
        id: "a-rankingtweaks-statuses-forceupdate",
        description: "Statuses are re-checked (redownloaded) only every two days, but you can do it manualy by clicking here:"
    }, {
        type: "checkbox",
        id: "a-rankingtweaks-labels",
        defaultValue: true,
        description: "Enable empire labels?"
    }, {
        type: "info",
        text: 'A label is a short text you add. This tweak adds a new column (titled "Label") in the ranking list in which you can set custom labels. If you doubleclick a cell in this column, you will be prompted to add your label. It can be anything as it will be visible just for you.'
    }, {
        type: "checkbox",
        id: "a-rankingtweaks-fedtags",
        defaultValue: true,
        description: "Enable empire fed tags?"
    }, {
        type: "info",
        text: 'Fed tag is the name of the federation an empire is in (or "N/A"). This tweak makes it possible to show fed tags in the the ranking list, below empire names. To make it less server intensive you have to doubleclick on the race field of the empire, which fed tag you want to check. Please note that (to save server load), once checked it will be cached for 7 days - unless you doubleclick again.'
    }, {
        type: "checkbox",
        id: "a-rankingtweaks-fedtags-showall",
        defaultValue: true,
        description: "Show all cached fed tags"
    }, {
        type: "checkbox",
        id: "a-rankingtweaks-bloodwar",
        description: "Enable Blood War?"
    }, {
        type: "info",
        text: "Blood War is an extension of the fed tag tweak. If you enable it tweak, you'll see federations your federation is in war with in red, allies will be shown in green, and neutrals in blue. This is not automatic, you have to define which fed is which below. Just fed names, no extra data, one per line!"
    }, {
        type: "list",
        id: "a-rankingtweaks-bloodwar-enemies",
        description: "Name your blood enemies.",
        defaultValue: "Example Fed One\nExample Fed Two"
    }, {
        type: "list",
        id: "a-rankingtweaks-bloodwar-allies",
        description: "Name your kin.",
        defaultValue: "Example Fed One\nExample Fed Two"
    }, {
        type: "list",
        id: "a-rankingtweaks-bloodwar-neutrals",
        description: "Name the neutral bystanders.",
        defaultValue: "Example Fed One\nExample Fed Two"
    }],
    
    filter: function () {
        if (!gc.getValue("a-rankingtweaks")) {
            return false;
        }
        if (gc.location.indexOf("rank") !== -1) {
            return true;
        }
        return false;
    }
    
};
app.mod.researchtweak = {
    id: "a-researchtweak",
    defaultValue: true,
    title: "Reasearch tweak",
    description: "Reasearch at most 999 turns of anything (at once) instead of 9.",
    filter: function () {
        if (!gc.getValue("a-researchtweak")) {
            return false;
        }
        if (gc.location.indexOf("com_research") !== -1) {
            return true;
        }
        return false;
    },
    plugin: function () {
        $("input[name='turns']").attr("maxlength", 3).val(999);
    }
};
app.mod.shipbuilder = {
    id: "a-shipbuilder",
    defaultValue: true,
    title: "Ship builder",
    description: "Build many stacks at once, clean and fast.",
    items: [{
        type: "info",
        text: "This mod replaces the old fleet builder mod. Old functionalities are still there: a doubleclick removes a saved preset. The main new thing is that this mods acquires ship data dynamically, whenever you visit a build page of a particular ship. If some of the data (e.g. build rates) are wrong, just visit the apropriate ship page. Also: you can use this to manage existing fleets..."
    }, {
        type: "checkbox",
        defaultValue: true,
        id: "a-shipbuilder-resetafterbuild",
        description: "Reset form after successful build"
    }],
    filter: function () {
        if (!gc.getValue("a-shipbuilder")) {
            return false;
        }
        if (gc.location.indexOf("com_ship") !== -1) {
            return true;
        }
        return false;
    },
    plugin: function () {
        var g, r, f, m;
        g = function (v) {
            if (v === undefined) {
                v = $("body");
            }
            var u = $("table.table_back table", v);
            var w = {};
            w.id = $("form[name='stepform']", v).attr("action").replace(/.*shiptype=/, "") * 1;
            w.type = $.trim($("td:contains('Class')", u).next().text());
            w.build = $.trim($("td:contains('1 turn produces')", u).next().text().replace(/[^\.\d]/g, "")) * 1;
            w.weapon = $.trim($("td:contains('Weapon')", u).next().text().replace(/[^\.\d]/g, "")) * 1;
            w.damage = {};
            w.damage.energy = $.trim($("td:contains('Energy Damage')", u).next().text().replace(/[^\.\d]/g, "")) * 1;
            w.damage.kinetic = $.trim($("td:contains('Kinetic Damage')", u).next().text().replace(/[^\.\d]/g, "")) * 1;
            w.damage.missile = $.trim($("td:contains('Missile Damage')", u).next().text().replace(/[^\.\d]/g, "")) * 1;
            w.damage.chemical = $.trim($("td:contains('Chemical Damage')", u).next().text().replace(/[^\.\d]/g, "")) * 1;
            w.hull = $.trim($("td:contains('Hull')", u).next().text().replace(/[^\.\d]/g, "")) * 1;
            w.range = $.trim($("td:contains('Range')", u).next().text().replace(/[^\.\d]/g, "")) * 1;
            w.scanner = $.trim($("td:contains('Scanner rating')", u).next().text().replace(/[^\.\d]/g, "")) * 1;
            w.power = $.trim($("td:contains('Power rating')", u).next().text().replace(/[^\.\d]/g, "")) * 1;
            w.cost = $.trim($("td:contains('Cost per unit')", u).next().text().replace(/[^\.\d]/g, "")) * 1;
            w.upkeep = $.trim($("td:contains('Upkeep')", u).next().text().replace(/[^\.\d]/g, "")) * 1;
            w.minerals = {};
            w.minerals.terranMetal = $.trim($("td:contains('Terran Metal')", u).next().next().text().replace(/[^\.\d]/g, "")) * 1;
            w.minerals.redCrystal = $.trim($("td:contains('Red Crystal')", u).next().next().text().replace(/[^\.\d]/g, "")) * 1;
            w.minerals.whiteCrystal = $.trim($("td:contains('White Crystal')", u).next().next().text().replace(/[^\.\d]/g, "")) * 1;
            w.minerals.rutile = $.trim($("td:contains('Rutile')", u).next().next().text().replace(/[^\.\d]/g, "")) * 1;
            w.minerals.composite = $.trim($("td:contains('Composite')", u).next().next().text().replace(/[^\.\d]/g, "")) * 1;
            w.minerals.strafezOrganism = $.trim($("td:contains('Strafez Organism')", u).next().next().text().replace(/[^\.\d]/g, "")) * 1;
            return w;
        };
        if (!gc.getValue("a-allships", "JSON_AS_ARRAY")) {
            gc.setValue("a-allships", "[    null,    {        \"id\": 1,        \"name\": \"T.Ryu-jin\",        \"power\": 8,        \"cost\": 88,        \"upkeep\": 3,        \"weapon\": 5,        \"hull\": 10,        \"range\": 1,        \"race\": \"Terran\",        \"type\": \"Fighter\",        \"damage\": {            \"energy\": 5,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 1,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 4500    },    {        \"id\": 2,        \"name\": \"Viator\",        \"power\": 1,        \"cost\": 27,        \"upkeep\": 30,        \"weapon\": 0,        \"hull\": 3,        \"range\": 1,        \"race\": \"Terran\",        \"type\": \"Scout\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 9,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 80    },    {        \"id\": 3,        \"name\": \"T.Maru\",        \"power\": 51,        \"cost\": 590,        \"upkeep\": 22,        \"weapon\": 35,        \"hull\": 10015,        \"range\": 3,        \"race\": \"Terran\",        \"type\": \"Corvette\",        \"damage\": {            \"energy\": 35,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 5,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 650    },    {        \"id\": 4,        \"name\": \"T.Sentouki\",        \"power\": 174,        \"cost\": 1855,        \"upkeep\": 125,        \"weapon\": 56,        \"hull\": 500,        \"range\": 7,        \"race\": \"Terran\",        \"type\": \"Frigate\",        \"damage\": {            \"energy\": 28,            \"kinetic\": 28,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 10,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 100    },    {        \"id\": 5,        \"name\": \"T.Garuda\",        \"power\": 956,        \"cost\": 9420,        \"upkeep\": 750,        \"weapon\": 400,        \"hull\": 200030,        \"range\": 9,        \"race\": \"Terran\",        \"type\": \"Destroyer\",        \"damage\": {            \"energy\": 400,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 50,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 28    },    {        \"id\": 6,        \"name\": \"T.Kalieum\",        \"power\": 1701,        \"cost\": 15435,        \"upkeep\": 1800,        \"weapon\": 350,        \"hull\": 400050,        \"range\": 8,        \"race\": \"Terran\",        \"type\": \"Cruiser\",        \"damage\": {            \"energy\": 350,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 100,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 20    },    {        \"id\": 7,        \"name\": \"Light fighter-drone\",        \"power\": 5,        \"cost\": 66,        \"upkeep\": 1,        \"weapon\": 5,        \"hull\": 520,        \"range\": 1,        \"race\": \"\",        \"type\": \"Fighter\",        \"damage\": {            \"energy\": 5,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 7000    },    {        \"id\": 8,        \"name\": \"Light Corvette\",        \"power\": 34,        \"cost\": 364,        \"upkeep\": 6,        \"weapon\": 20,        \"hull\": 5020,        \"range\": 3,        \"race\": \"\",        \"type\": \"Corvette\",        \"damage\": {            \"energy\": 20,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 2,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 800    },    {        \"id\": 9,        \"name\": \"Light Frigate\",        \"power\": 126,        \"cost\": 1265,        \"upkeep\": 25,        \"weapon\": 53,        \"hull\": 25020,        \"range\": 5,        \"race\": \"\",        \"type\": \"Frigate\",        \"damage\": {            \"energy\": 53,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 8,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 120    },    {        \"id\": 10,        \"name\": \"Small Strafez Fodder\",        \"power\": 55,        \"cost\": 535,        \"upkeep\": 1,        \"weapon\": 0,        \"hull\": 200,        \"range\": 1,        \"race\": \"\",        \"type\": \"Special\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 0,        \"build\": 700,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 2        }    },    {        \"id\": 11,        \"name\": \"Large Strafez Fodder\",        \"power\": 205,        \"cost\": 2035,        \"upkeep\": 5,        \"weapon\": 0,        \"hull\": 80095,        \"range\": 1,        \"race\": \"\",        \"type\": \"Special\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 0,        \"build\": 180,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        }    },    {        \"id\": 12,        \"name\": \"Small Strafez Runner\",        \"power\": 115,        \"cost\": 1046,        \"upkeep\": 2,        \"weapon\": 80,        \"hull\": 1,        \"range\": 7,        \"race\": \"\",        \"type\": \"Special\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 80        },        \"scanner\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 2        },        \"build\": 400    },    {        \"id\": 13,        \"name\": \"Large Strafez Runner\",        \"power\": 435,        \"cost\": 4247,        \"upkeep\": 12,        \"weapon\": 400,        \"hull\": 299.95,        \"range\": 7,        \"race\": \"\",        \"type\": \"Special\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 400        },        \"scanner\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 100    },    {        \"id\": 14,        \"name\": \"T.Empereur\",        \"power\": 5881,        \"cost\": 52475,        \"upkeep\": 5400,        \"weapon\": 2500,        \"hull\": 800020,        \"range\": 7,        \"race\": \"Terran\",        \"type\": \"Battleship\",        \"damage\": {            \"energy\": 1500,            \"kinetic\": 1000,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 500,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 8    },    {        \"id\": 15,        \"name\": \"C.Aries\",        \"power\": 51,        \"cost\": 617,        \"upkeep\": 37,        \"weapon\": 20,        \"hull\": 200,        \"range\": 1,        \"race\": \"\",        \"type\": \"Corvette\",        \"damage\": {            \"energy\": 20,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 2,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 100    },    {        \"id\": 16,        \"name\": \"C.Gemini\",        \"power\": 243,        \"cost\": 2784,        \"upkeep\": 230,        \"weapon\": 53,        \"hull\": 1000,        \"range\": 5,        \"race\": \"\",        \"type\": \"Frigate\",        \"damage\": {            \"energy\": 53,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 4,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 40    },    {        \"id\": 17,        \"name\": \"C.Taurus\",        \"power\": 1488,        \"cost\": 14595,        \"upkeep\": 1300,        \"weapon\": 400,        \"hull\": 4000,        \"range\": 7,        \"race\": \"\",        \"type\": \"Destroyer\",        \"damage\": {            \"energy\": 200,            \"kinetic\": 200,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 85,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 20    },    {        \"id\": 18,        \"name\": \"C.Cancer\",        \"power\": 1804,        \"cost\": 18355,        \"upkeep\": 1800,        \"weapon\": 350,        \"hull\": 6000,        \"range\": 6,        \"race\": \"\",        \"type\": \"Cruiser\",        \"damage\": {            \"energy\": 350,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 25,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 16    },    {        \"id\": 19,        \"name\": \"Viator II\",        \"power\": 25,        \"cost\": 636,        \"upkeep\": 400,        \"weapon\": 0,        \"hull\": 1,        \"range\": 1,        \"race\": \"Terran\",        \"type\": \"Scout\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 500,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 160    },    {        \"id\": 20,        \"name\": \"P.Apollo\",        \"power\": 66,        \"cost\": 811,        \"upkeep\": 55,        \"weapon\": 80,        \"hull\": 25,        \"range\": 5,        \"race\": \"Terran\",        \"type\": \"Corvette\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 80,            \"chemical\": 0        },        \"scanner\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 220    },    {        \"id\": 21,        \"name\": \"P.Odin\",        \"power\": 201,        \"cost\": 2311,        \"upkeep\": 255,        \"weapon\": 212,        \"hull\": 125,        \"range\": 9,        \"race\": \"Terran\",        \"type\": \"Frigate\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 212,            \"chemical\": 0        },        \"scanner\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 90    },    {        \"id\": 22,        \"name\": \"P.Thor\",        \"power\": 1624,        \"cost\": 16905,        \"upkeep\": 1600,        \"weapon\": 1600,        \"hull\": 500,        \"range\": 11,        \"race\": \"Terran\",        \"type\": \"Destroyer\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 1600,            \"chemical\": 0        },        \"scanner\": 50,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 16    },    {        \"id\": 23,        \"name\": \"P.Zeus\",        \"power\": 1755,        \"cost\": 17175,        \"upkeep\": 3000,        \"weapon\": 1400,        \"hull\": 1000,        \"range\": 10,        \"race\": \"Terran\",        \"type\": \"Cruiser\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 1400,            \"chemical\": 0        },        \"scanner\": 50,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 16    },    {        \"id\": 24,        \"name\": \"Nirvana\",        \"power\": 18030,        \"cost\": 175410,        \"upkeep\": 22000,        \"weapon\": 12000,        \"hull\": 2000060,        \"range\": 6,        \"race\": \"Terran\",        \"type\": \"Dreadnought\",        \"damage\": {            \"energy\": 5000,            \"kinetic\": 5000,            \"missile\": 2000,            \"chemical\": 0        },        \"scanner\": 200,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 3    },    {        \"id\": 25,        \"name\": \"Chimaera\",        \"power\": 21393,        \"cost\": 213765,        \"upkeep\": 10054,        \"weapon\": 10000,        \"hull\": 45000,        \"range\": 5,        \"race\": \"Terran\",        \"type\": \"Starbase\",        \"damage\": {            \"energy\": 4000,            \"kinetic\": 6000,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 500,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 3    },    {        \"id\": 26,        \"name\": \"Eel\",        \"power\": 60,        \"type\": \"Fighter\",        \"weapon\": 50,        \"damage\": {            \"energy\": 0,            \"kinetic\": 25,            \"missile\": 25,            \"chemical\": 0        },        \"hull\": 505,        \"range\": 3,        \"scanner\": 13,        \"cost\": 655,        \"upkeep\": 10,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 300    },    {        \"id\": 27,        \"name\": \"Ray\",        \"power\": 82,        \"type\": \"Corvette\",        \"weapon\": 50,        \"damage\": {            \"energy\": 25,            \"kinetic\": 25,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 150,        \"range\": 6,        \"scanner\": 10,        \"cost\": 917,        \"upkeep\": 12,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 250    },    {        \"id\": 28,        \"name\": \"Piranha\",        \"power\": 379,        \"type\": \"Frigate\",        \"weapon\": 80,        \"damage\": {            \"energy\": 40,            \"kinetic\": 40,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 750,        \"range\": 5,        \"scanner\": 50,        \"cost\": 3332,        \"upkeep\": 56,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 45    },    {        \"id\": 29,        \"name\": \"Barracuda\",        \"power\": 2272,        \"type\": \"Destroyer\",        \"weapon\": 800,        \"damage\": {            \"energy\": 600,            \"kinetic\": 200,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 300080,        \"range\": 8,        \"scanner\": 250,        \"cost\": 19440,        \"upkeep\": 522,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 14    },    {        \"id\": 30,        \"name\": \"Shark\",        \"power\": 2052,        \"type\": \"Cruiser\",        \"weapon\": 500,        \"damage\": {            \"energy\": 250,            \"kinetic\": 250,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 500030,        \"range\": 7,        \"scanner\": 100,        \"cost\": 19180,        \"upkeep\": 307,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 16    },    {        \"id\": 31,        \"name\": \"Pyth\",        \"power\": 22527,        \"type\": \"Battleship\",        \"weapon\": 20000,        \"damage\": {            \"energy\": 7500,            \"kinetic\": 7500,            \"missile\": 5000,            \"chemical\": 0        },        \"hull\": 2000015,        \"range\": 6,        \"scanner\": 6500,        \"cost\": 244195,        \"upkeep\": 4280,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 3    },    {        \"id\": 32,        \"name\": \"M.Lyth\",        \"power\": 30040,        \"type\": \"Dreadnought\",        \"weapon\": 15000,        \"damage\": {            \"energy\": 3000,            \"kinetic\": 0,            \"missile\": 12000,            \"chemical\": 0        },        \"hull\": 3500035,        \"range\": 7,        \"scanner\": 1250,        \"cost\": 270270,        \"upkeep\": 52052,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 2    },    {        \"id\": 33,        \"name\": \"M.Hal\",        \"power\": 23,        \"type\": \"Fighter\",        \"weapon\": 20,        \"damage\": {            \"energy\": 20,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 2520,        \"range\": 4,        \"scanner\": 1,        \"cost\": 287,        \"upkeep\": 5,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 1500    },    {        \"id\": 34,        \"name\": \"M.Alium\",        \"power\": 46,        \"type\": \"Corvette\",        \"weapon\": 30,        \"damage\": {            \"energy\": 30,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 50,        \"range\": 4,        \"scanner\": 5,        \"cost\": 487,        \"upkeep\": 28,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 500    },    {        \"id\": 35,        \"name\": \"M.Illite\",        \"power\": 182,        \"type\": \"Frigate\",        \"weapon\": 80,        \"damage\": {            \"energy\": 80,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 40010,        \"range\": 6,        \"scanner\": 10,        \"cost\": 1880,        \"upkeep\": 130,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 125    },    {        \"id\": 36,        \"name\": \"M.Epidote\",        \"power\": 936,        \"type\": \"Destroyer\",        \"weapon\": 500,        \"damage\": {            \"energy\": 500,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 150010,        \"range\": 9,        \"scanner\": 50,        \"cost\": 9195,        \"upkeep\": 740,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 28    },    {        \"id\": 37,        \"name\": \"M.Chlor\",        \"power\": 1656,        \"type\": \"Cruiser\",        \"weapon\": 500,        \"damage\": {            \"energy\": 500,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 500010,        \"range\": 8,        \"scanner\": 50,        \"cost\": 17160,        \"upkeep\": 1900,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 16    },    {        \"id\": 38,        \"name\": \"M.Flysch\",        \"power\": 7231,        \"type\": \"Battleship\",        \"weapon\": 3000,        \"damage\": {            \"energy\": 1500,            \"kinetic\": 500,            \"missile\": 1000,            \"chemical\": 0        },        \"hull\": 1000015,        \"range\": 7,        \"scanner\": 500,        \"cost\": 64225,        \"upkeep\": 5254,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 9    },    {        \"id\": 39,        \"name\": \"A.Aragonite\",        \"power\": 5035,        \"type\": \"Dreadnought\",        \"weapon\": 2500,        \"damage\": {            \"energy\": 1000,            \"kinetic\": 1500,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 600025,        \"range\": 7,        \"scanner\": 200,        \"cost\": 45445,        \"upkeep\": 5982,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 12    },    {        \"id\": 40,        \"name\": \"M.Lakko\",        \"power\": 24444,        \"type\": \"Starbase\",        \"weapon\": 23700,        \"damage\": {            \"energy\": 7700,            \"kinetic\": 0,            \"missile\": 16000,            \"chemical\": 0        },        \"hull\": 3650095,        \"range\": 3,        \"scanner\": 416,        \"cost\": 286791,        \"upkeep\": 20666,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 3    },    {        \"id\": 41,        \"name\": \"A.Kryo\",        \"power\": 75182,        \"type\": \"Starbase\",        \"weapon\": 6000,        \"damage\": {            \"energy\": 1500,            \"kinetic\": 1500,            \"missile\": 3000,            \"chemical\": 0        },        \"hull\": 15000020,        \"range\": 7,        \"scanner\": 8000,        \"cost\": 601480,        \"upkeep\": 32328,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 2    },    {        \"id\": 42,        \"name\": \"Seeker\",        \"power\": 2,        \"type\": \"Scout\",        \"weapon\": 0,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 195,        \"range\": 1,        \"scanner\": 40,        \"cost\": 61,        \"upkeep\": 60,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 60    },    {        \"id\": 43,        \"name\": \"Ranger\",        \"power\": 50,        \"type\": \"Scout\",        \"weapon\": 0,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 195,        \"range\": 1,        \"scanner\": 1000,        \"cost\": 1261,        \"upkeep\": 800,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 160    },    {        \"id\": 44,        \"name\": \"G.Livid\",        \"power\": 13013,        \"type\": \"Fighter\",        \"weapon\": 8000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 8000,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 2500085,        \"range\": 5,        \"scanner\": 4000,        \"cost\": 140365,        \"upkeep\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 1    },    null,    null,    null,    null,    null,    null,    null,    null,    {        \"id\": 53,        \"name\": \"G.Livid (r)\",        \"power\": 12513,        \"type\": \"Fighter\",        \"weapon\": 5000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 5000,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 2500075,        \"range\": 5,        \"scanner\": 2750,        \"cost\": 121615,        \"upkeep\": 15641,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 4    },    {        \"id\": 54,        \"name\": \"G.Agate\",        \"power\": 13135,        \"type\": \"Fighter\",        \"weapon\": 5000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 5000,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 2500020,        \"range\": 4,        \"scanner\": 2700,        \"cost\": 208814,        \"upkeep\": 1712,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 4    },    {        \"id\": 55,        \"name\": \"G.Amethyst\",        \"power\": 18018,        \"type\": \"Corvette\",        \"weapon\": 15000,        \"damage\": {            \"energy\": 15000,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 24000,        \"range\": 6,        \"scanner\": 1800,        \"cost\": 329892,        \"upkeep\": 2030,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 4    },    {        \"id\": 56,        \"name\": \"G.Quartz\",        \"power\": 36068,        \"type\": \"Frigate\",        \"weapon\": 14000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 14000,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 8000020,        \"range\": 5,        \"scanner\": 3500,        \"cost\": 592766,        \"upkeep\": 4596,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 3    },    {        \"id\": 57,        \"name\": \"L.Garnet\",        \"power\": 16303,        \"type\": \"Frigate\",        \"weapon\": 8000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 8000,            \"chemical\": 0        },        \"hull\": 2000010,        \"range\": 8,        \"scanner\": 2050,        \"cost\": 248981,        \"upkeep\": 1834,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 5    },    {        \"id\": 58,        \"name\": \"G.Corundum\",        \"power\": 55028,        \"type\": \"Destroyer\",        \"weapon\": 30000,        \"damage\": {            \"energy\": 18750,            \"kinetic\": 11250,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 6500070,        \"range\": 7,        \"scanner\": 4500,        \"cost\": 855858,        \"upkeep\": 5357,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 2    },    {        \"id\": 59,        \"name\": \"L.Topaz\",        \"power\": 49081,        \"type\": \"Cruiser\",        \"weapon\": 16000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 16000,            \"chemical\": 0        },        \"hull\": 10000045,        \"range\": 7,        \"scanner\": 2700,        \"cost\": 759069,        \"upkeep\": 5091,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 1    },    {        \"id\": 60,        \"name\": \"G.Fluorite\",        \"power\": 69768,        \"type\": \"Cruiser\",        \"weapon\": 30000,        \"damage\": {            \"energy\": 30000,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 16000010,        \"range\": 3,        \"scanner\": 1500,        \"cost\": 1173120,        \"upkeep\": 7500,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 1    },    {        \"id\": 61,        \"name\": \"L.Emerald\",        \"power\": 41636,        \"type\": \"Destroyer\",        \"weapon\": 30000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 30000,            \"chemical\": 0        },        \"hull\": 2000060,        \"range\": 9,        \"scanner\": 3400,        \"cost\": 647673,        \"upkeep\": 4536,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 2    },    {        \"id\": 62,        \"name\": \"G.Diamond\",        \"power\": 139532,        \"type\": \"Starbase\",        \"weapon\": 20000,        \"damage\": {            \"energy\": 10000,            \"kinetic\": 10000,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 24000015,        \"range\": 7,        \"scanner\": 15000,        \"cost\": 1863823,        \"upkeep\": 17946,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 1    },    {        \"id\": 63,        \"name\": \"S.Lapiz\",        \"power\": 25,        \"type\": \"Scout\",        \"weapon\": 0,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 520,        \"range\": 1,        \"scanner\": 500,        \"cost\": 1074,        \"upkeep\": 50,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 30    },    {        \"id\": 64,        \"name\": \"S.Opal\",        \"power\": 75,        \"type\": \"Scout\",        \"weapon\": 0,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 520,        \"range\": 1,        \"scanner\": 1500,        \"cost\": 3168,        \"upkeep\": 150,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 20    },    {        \"id\": 65,        \"name\": \"D.Hammerhead\",        \"power\": 3612,        \"type\": \"Frigate\",        \"weapon\": 4000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 1500,            \"missile\": 2500,            \"chemical\": 0        },        \"hull\": 300015,        \"range\": 7,        \"scanner\": 75,        \"cost\": 41955,        \"upkeep\": 632,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 9    },    {        \"id\": 66,        \"name\": \"D.Bullhead\",        \"power\": 6336,        \"type\": \"Cruiser\",        \"weapon\": 3250,        \"damage\": {            \"energy\": 1250,            \"kinetic\": 0,            \"missile\": 2000,            \"chemical\": 0        },        \"hull\": 700025,        \"range\": 8,        \"scanner\": 400,        \"cost\": 57160,        \"upkeep\": 1140,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 6    },    {        \"id\": 67,        \"name\": \"D.Angel\",        \"power\": 23206,        \"type\": \"Battleship\",        \"weapon\": 22000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 7000,            \"missile\": 15000,            \"chemical\": 0        },        \"hull\": 1500010,        \"range\": 7,        \"scanner\": 0,        \"cost\": 244850,        \"upkeep\": 4614,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 4    },    {        \"id\": 68,        \"name\": \"M.Chlorite\",        \"power\": 1236,        \"type\": \"Destroyer\",        \"weapon\": 1000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 1000,            \"chemical\": 0        },        \"hull\": 800,        \"range\": 9,        \"scanner\": 60,        \"cost\": 12330,        \"upkeep\": 962,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 22    },    {        \"id\": 69,        \"name\": \"Manta\",        \"power\": 74,        \"type\": \"Fighter\",        \"weapon\": 75,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 75,            \"chemical\": 0        },        \"hull\": 50,        \"range\": 6,        \"scanner\": 15,        \"cost\": 882,        \"upkeep\": 13,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 250    },    {        \"id\": 70,        \"name\": \"G.Lictor\",        \"power\": 51178,        \"type\": \"Juggernaught\",        \"weapon\": 14000,        \"damage\": {            \"energy\": 10000,            \"kinetic\": 4000,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 8000040,        \"range\": 5,        \"scanner\": 2500,        \"cost\": 428440,        \"upkeep\": 40000,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 2    },    {        \"id\": 71,        \"name\": \"Hercules\",        \"power\": 45402,        \"cost\": 385310,        \"upkeep\": 35000,        \"weapon\": 20000,        \"hull\": 4500030,        \"range\": 5,        \"race\": \"Terran\",        \"type\": \"Juggernaught\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 12000,            \"missile\": 8000,            \"chemical\": 0        },        \"scanner\": 2000,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 2    },    {        \"id\": 72,        \"name\": \"Strafez Queen\",        \"power\": 896,        \"cost\": 8121,        \"upkeep\": 20,        \"weapon\": 700,        \"hull\": 2599.95,        \"range\": 8,        \"race\": \"\",        \"type\": \"Special\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 700        },        \"scanner\": 30,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 40    },    {        \"id\": 73,        \"name\": \"F.Axe\",        \"power\": 178,        \"cost\": 1898,        \"upkeep\": 152,        \"weapon\": 65,        \"hull\": 500,        \"range\": 5,        \"race\": \"\",        \"type\": \"Frigate\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 65,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 8,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 100    },    {        \"id\": 74,        \"name\": \"F.Sword\",        \"power\": 1152,        \"cost\": 11400,        \"upkeep\": 955,        \"weapon\": 600,        \"hull\": 2000,        \"range\": 8,        \"race\": \"\",        \"type\": \"Destroyer\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 600,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 60,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 20    },    {        \"id\": 75,        \"name\": \"F.Spear\",        \"power\": 1512,        \"cost\": 14670,        \"upkeep\": 2100,        \"weapon\": 400,        \"hull\": 4000,        \"range\": 6,        \"race\": \"\",        \"type\": \"Cruiser\",        \"damage\": {            \"energy\": 0,            \"kinetic\": 400,            \"missile\": 0,            \"chemical\": 0        },        \"scanner\": 50,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 20    },    {        \"id\": 76,        \"name\": \"Pike\",        \"power\": 1276,        \"type\": \"Destroyer\",        \"weapon\": 1000,        \"damage\": {            \"energy\": 500,            \"kinetic\": 500,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 100010,        \"range\": 9,        \"scanner\": 60,        \"cost\": 12780,        \"upkeep\": 382,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 20    },    null,    null,    {        \"id\": 79,        \"name\": \"K.Hun-Li\",        \"power\": 51224,        \"type\": \"Destroyer\",        \"weapon\": 14000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 4000,            \"missile\": 0,            \"chemical\": 10000        },        \"hull\": 5000050,        \"range\": 6,        \"scanner\": 7500,        \"cost\": 663602,        \"upkeep\": 5343,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 1    },    {        \"id\": 80,        \"name\": \"K.Hun-Xe\",        \"power\": 71322,        \"type\": \"Cruiser\",        \"weapon\": 12000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 4000,            \"chemical\": 8000        },        \"hull\": 8000050,        \"range\": 5,        \"scanner\": 11000,        \"cost\": 883831,        \"upkeep\": 7596,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 1    },    {        \"id\": 81,        \"name\": \"Sting\",        \"power\": 1611,        \"type\": \"Cruiser\",        \"weapon\": 1000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 1000,            \"chemical\": 0        },        \"hull\": 2000,        \"range\": 8,        \"scanner\": 50,        \"cost\": 15685,        \"upkeep\": 272,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 20    },    {        \"id\": 82,        \"name\": \"Tourmaline\",        \"power\": 6510,        \"type\": \"Fighter\",        \"weapon\": 8000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 8000,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 1500040,        \"range\": 4,        \"scanner\": 250,        \"cost\": 153414,        \"upkeep\": 720,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 6    },    {        \"id\": 83,        \"name\": \"Ruby\",        \"power\": 11268,        \"type\": \"Corvette\",        \"weapon\": 13000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 13000,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 1600050,        \"range\": 6,        \"scanner\": 350,        \"cost\": 237432,        \"upkeep\": 1220,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 5    },    {        \"id\": 84,        \"name\": \"V.Borrelly\",        \"power\": 452,        \"type\": \"Destroyer\",        \"weapon\": 400,        \"damage\": {            \"energy\": 0,            \"kinetic\": 100,            \"missile\": 0,            \"chemical\": 300        },        \"hull\": 50050,        \"range\": 8,        \"scanner\": 0,        \"cost\": 4965,        \"upkeep\": 271,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 60    },    {        \"id\": 85,        \"name\": \"V.Chiron\",        \"power\": 18482,        \"type\": \"Starbase\",        \"weapon\": 8000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 3000,            \"missile\": 0,            \"chemical\": 5000        },        \"hull\": 3000050,        \"range\": 7,        \"scanner\": 1000,        \"cost\": 170980,        \"upkeep\": 9241,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 3    },    {        \"id\": 86,        \"name\": \"Kohoutek\",        \"power\": 20,        \"type\": \"Scout\",        \"weapon\": 0,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 120,        \"range\": 1,        \"scanner\": 400,        \"cost\": 511,        \"upkeep\": 200,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 180    },    {        \"id\": 87,        \"name\": \"R.Pinnace\",        \"power\": 162,        \"type\": \"Corvette\",        \"weapon\": 200,        \"damage\": {            \"energy\": 0,            \"kinetic\": 200,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 200,        \"range\": 4,        \"scanner\": 0,        \"cost\": 2100,        \"upkeep\": 74,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 200    },    {        \"id\": 88,        \"name\": \"R.Sloop\",        \"power\": 558,        \"type\": \"Frigate\",        \"weapon\": 550,        \"damage\": {            \"energy\": 550,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 75010,        \"range\": 7,        \"scanner\": 0,        \"cost\": 6547,        \"upkeep\": 177,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 55    },    {        \"id\": 89,        \"name\": \"H.Galleon\",        \"power\": 2056,        \"type\": \"Destroyer\",        \"weapon\": 900,        \"damage\": {            \"energy\": 0,            \"kinetic\": 800,            \"missile\": 100,            \"chemical\": 0        },        \"hull\": 450010,        \"range\": 9,        \"scanner\": 100,        \"cost\": 20595,        \"upkeep\": 417,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 22    },    {        \"id\": 90,        \"name\": \"R.Schooner\",        \"power\": 2136,        \"type\": \"Destroyer\",        \"weapon\": 1150,        \"damage\": {            \"energy\": 900,            \"kinetic\": 0,            \"missile\": 250,            \"chemical\": 0        },        \"hull\": 2500,        \"range\": 9,        \"scanner\": 170,        \"cost\": 19815,        \"upkeep\": 476,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 16    },    {        \"id\": 91,        \"name\": \"H.Barkentine\",        \"power\": 3246,        \"type\": \"Cruiser\",        \"weapon\": 1300,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 1300,            \"chemical\": 0        },        \"hull\": 500030,        \"range\": 8,        \"scanner\": 300,        \"cost\": 29360,        \"upkeep\": 949,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 14    },    {        \"id\": 92,        \"name\": \"K.Yang-Fo\",        \"power\": 747092,        \"type\": \"Juggernaught\",        \"weapon\": 45000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 15000,            \"missile\": 15000,            \"chemical\": 15000        },        \"hull\": 45000060,        \"range\": 2,        \"scanner\": 106333,        \"cost\": 4629313,        \"upkeep\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 200    },    {        \"id\": 93,        \"name\": \"K.Yang-Xe\",        \"power\": 747092,        \"type\": \"Juggernaught\",        \"weapon\": 42000,        \"damage\": {            \"energy\": 15000,            \"kinetic\": 0,            \"missile\": 15000,            \"chemical\": 12000        },        \"hull\": 45000099,        \"range\": 2,        \"scanner\": 106333,        \"cost\": 4614313,        \"upkeep\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 200    },    {        \"id\": 94,        \"name\": \"K.Wai-Li\",        \"power\": 373555,        \"type\": \"Dreadnought\",        \"weapon\": 32000,        \"damage\": {            \"energy\": 9000,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 23000        },        \"hull\": 30000099,        \"range\": 3,        \"scanner\": 54708,        \"cost\": 2457513,        \"upkeep\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 200    },    {        \"id\": 95,        \"name\": \"K.Wai-Xe\",        \"power\": 373555,        \"type\": \"Dreadnought\",        \"weapon\": 32000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 9000,            \"missile\": 0,            \"chemical\": 23000        },        \"hull\": 30000099,        \"range\": 3,        \"scanner\": 54708,        \"cost\": 2457513,        \"upkeep\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 200    },    {        \"id\": 96,        \"name\": \"K.Wei-Li\",        \"power\": 186772,        \"type\": \"Battleship\",        \"weapon\": 22000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 10000,            \"chemical\": 12000        },        \"hull\": 15000060,        \"range\": 5,        \"scanner\": 31000,        \"cost\": 1262410,        \"upkeep\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 400    },    {        \"id\": 97,        \"name\": \"K.Wei-Xe\",        \"power\": 168094,        \"type\": \"Battleship\",        \"weapon\": 22000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 10000,            \"missile\": 0,            \"chemical\": 12000        },        \"hull\": 15000099,        \"range\": 5,        \"scanner\": 31000,        \"cost\": 1169020,        \"upkeep\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 1    },    {        \"id\": 98,        \"name\": \"F.Broadsword\",        \"power\": 1116,        \"type\": \"Destroyer\",        \"weapon\": 700,        \"damage\": {            \"energy\": 0,            \"kinetic\": 700,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 100010,        \"range\": 9,        \"scanner\": 80,        \"cost\": 10500,        \"upkeep\": 635,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 20    },    {        \"id\": 99,        \"name\": \"Tyr\",        \"power\": 13035,        \"cost\": 130245,        \"upkeep\": 14500,        \"weapon\": 10000,        \"hull\": 1200020,        \"range\": 7,        \"race\": \"Terran\",        \"type\": \"Dreadnought\",        \"damage\": {            \"energy\": 500,            \"kinetic\": 500,            \"missile\": 9000,            \"chemical\": 0        },        \"scanner\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 5    },    {        \"id\": 100,        \"name\": \"Scorpion\",        \"power\": 73606,        \"cost\": 548850,        \"upkeep\": 27500,        \"weapon\": 8000,        \"hull\": 10500020,        \"range\": 7,        \"race\": \"Terran\",        \"type\": \"Starbase\",        \"damage\": {            \"energy\": 1000,            \"kinetic\": 1000,            \"missile\": 6000,            \"chemical\": 0        },        \"scanner\": 9500,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 1    },    {        \"id\": 101,        \"name\": \"M.Calcite\",        \"power\": 1701,        \"type\": \"Cruiser\",        \"weapon\": 850,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 850,            \"chemical\": 0        },        \"hull\": 2000,        \"range\": 8,        \"scanner\": 100,        \"cost\": 15435,        \"upkeep\": 962,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 18    },    {        \"id\": 102,        \"name\": \"A.Hoko\",        \"power\": 9945,        \"type\": \"Starbase\",        \"weapon\": 4000,        \"damage\": {            \"energy\": 1000,            \"kinetic\": 1000,            \"missile\": 2000,            \"chemical\": 0        },        \"hull\": 1000015,        \"range\": 10,        \"scanner\": 400,        \"cost\": 82725,        \"upkeep\": 4475,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 7    },    {        \"id\": 103,        \"name\": \"Tiger\",        \"power\": 1496,        \"type\": \"Destroyer\",        \"weapon\": 1200,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 1200,            \"chemical\": 0        },        \"hull\": 1500,        \"range\": 9,        \"scanner\": 50,        \"cost\": 15495,        \"upkeep\": 448,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 18    },    {        \"id\": 104,        \"name\": \"H.Brigantine\",        \"power\": 286,        \"type\": \"Frigate\",        \"weapon\": 300,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 100,            \"chemical\": 200        },        \"hull\": 30035,        \"range\": 6,        \"scanner\": 0,        \"cost\": 3365,        \"upkeep\": 90,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 135    },    {        \"id\": 105,        \"name\": \"R.Snow\",        \"power\": 6804,        \"type\": \"Battleship\",        \"weapon\": 4000,        \"damage\": {            \"energy\": 1800,            \"kinetic\": 0,            \"missile\": 2200,            \"chemical\": 0        },        \"hull\": 750010,        \"range\": 7,        \"scanner\": 330,        \"cost\": 63795,        \"upkeep\": 1908,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 10    },    {        \"id\": 106,        \"name\": \"H.Man-O-War\",        \"power\": 450,        \"type\": \"Starbase\",        \"weapon\": 250,        \"damage\": {            \"energy\": 100,            \"kinetic\": 150,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 60020,        \"range\": 7,        \"scanner\": 13,        \"cost\": 4333,        \"upkeep\": 200,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 80    },    {        \"id\": 107,        \"name\": \"D. Mako\",        \"power\": 12645,        \"type\": \"Starbase\",        \"weapon\": 3000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 3000        },        \"hull\": 15000,        \"range\": 7,        \"scanner\": 1453,        \"cost\": 98498,        \"upkeep\": 2000,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 100    },    {        \"id\": 108,        \"name\": \"D. Luminous\",        \"power\": 12645,        \"type\": \"Starbase\",        \"weapon\": 7000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 7000,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 10000100,        \"range\": 7,        \"scanner\": 903,        \"cost\": 111698,        \"upkeep\": 2000,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 100    },    {        \"id\": 109,        \"name\": \"D. Megalodon\",        \"power\": 72902,        \"type\": \"Juggernaught\",        \"weapon\": 50000,        \"damage\": {            \"energy\": 10000,            \"kinetic\": 0,            \"missile\": 20000,            \"chemical\": 20000        },        \"hull\": 6500030,        \"range\": 6,        \"scanner\": 0,        \"cost\": 695820,        \"upkeep\": 4000,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 100    },    {        \"id\": 110,        \"name\": \"D. Icithio\",        \"power\": 12645,        \"type\": \"Starbase\",        \"weapon\": 11000,        \"damage\": {            \"energy\": 11000,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 900050,        \"range\": 8,        \"scanner\": 152,        \"cost\": 129707,        \"upkeep\": 2000,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 100    },    {        \"id\": 111,        \"name\": \"D. White\",        \"power\": 12645,        \"type\": \"Starbase\",        \"weapon\": 12000,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 12000,            \"chemical\": 0        },        \"hull\": 7000,        \"range\": 10,        \"scanner\": 50,        \"cost\": 132125,        \"upkeep\": 2000,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 100    },    {        \"id\": 112,        \"name\": \"Strafez King\",        \"power\": 890,        \"type\": \"Special\",        \"weapon\": 550,        \"damage\": {            \"energy\": 0,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 550        },        \"hull\": 20090,        \"range\": 8,        \"scanner\": 50,        \"cost\": 7580,        \"upkeep\": 60,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 40    },    {        \"id\": 113,        \"name\": \"T.Fenrir\",        \"power\": 1512,        \"type\": \"Cruiser\",        \"weapon\": 600,        \"damage\": {            \"energy\": 350,            \"kinetic\": 250,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 2800,        \"range\": 8,        \"scanner\": 68,        \"cost\": 14208,        \"upkeep\": 1400,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 18    },    {        \"id\": 114,        \"name\": \"D.Thresher\",        \"power\": 11956,        \"type\": \"Battleship\",        \"weapon\": 9000,        \"damage\": {            \"energy\": 7000,            \"kinetic\": 1000,            \"missile\": 1000,            \"chemical\": 0        },        \"hull\": 800030,        \"range\": 7,        \"scanner\": 450,        \"cost\": 115300,        \"upkeep\": 2032,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 4    },    {        \"id\": 115,        \"name\": \"C.Leo\",        \"power\": 2848,        \"type\": \"Cruiser\",        \"weapon\": 1000,        \"damage\": {            \"energy\": 500,            \"kinetic\": 500,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 5000,        \"range\": 7,        \"scanner\": 175,        \"cost\": 25735,        \"upkeep\": 2100,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 10    },    {        \"id\": 116,        \"name\": \"H.Corsair\",        \"power\": 110,        \"type\": \"Fighter\",        \"weapon\": 75,        \"damage\": {            \"energy\": 25,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 50        },        \"hull\": 10030,        \"range\": 4,        \"scanner\": 20,        \"cost\": 1110,        \"upkeep\": 22,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 300    },    {        \"id\": 117,        \"name\": \"K.Hun-Zen\",        \"power\": 61780,        \"type\": \"Cruiser\",        \"weapon\": 18000,        \"damage\": {            \"energy\": 8000,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 10000        },        \"hull\": 6000025,        \"range\": 6,        \"scanner\": 5750,        \"cost\": 803515,        \"upkeep\": 6000,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 1    },    {        \"id\": 118,        \"name\": \"V.Cronus\",        \"power\": 2016,        \"type\": \"Cruiser\",        \"weapon\": 1000,        \"damage\": {            \"energy\": 300,            \"kinetic\": 0,            \"missile\": 0,            \"chemical\": 700        },        \"hull\": 200020,        \"range\": 8,        \"scanner\": 140,        \"cost\": 17800,        \"upkeep\": 950,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 16    },    {        \"id\": 119,        \"name\": \"K.Hun-Zen\",        \"power\": 1500003,        \"type\": \"Starbase\",        \"weapon\": 345000,        \"damage\": {            \"energy\": 80000,            \"kinetic\": 75000,            \"missile\": 100000,            \"chemical\": 90000        },        \"hull\": 100000099,        \"range\": 4,        \"scanner\": 214530,        \"cost\": 10689585,        \"upkeep\": 0,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 100    },    {        \"id\": 120,        \"name\": \"G.Sapphire\",        \"power\": 17624,        \"type\": \"Destroyer\",        \"weapon\": 12000,        \"damage\": {            \"energy\": 2000,            \"kinetic\": 10000,            \"missile\": 0,            \"chemical\": 0        },        \"hull\": 2000045,        \"range\": 6,        \"scanner\": 1000,        \"cost\": 174180,        \"upkeep\": 16300,        \"minerals\": {            \"terranMetal\": 0,            \"redCrystal\": 0,            \"whiteCrystal\": 0,            \"rutile\": 0,            \"composite\": 0,            \"strafezOrganism\": 0        },        \"build\": 3    }]");
        }
        var d = gc.getValue("a-allships", "JSON_AS_ARRAY");
        var h = [];
        $("table.table_back[width='95%'] table tr.table_row1").each(function (x) {
            var v = $(this);
            var w = $("td:eq(1) a", this).attr("href").replace(/.*shiptype=/, "") * 1;
            var u = d[w];
            if (!u) {
                u = {};
            }
            u.race = $.trim($("td:eq(0)", this).text());
            u.name = $.trim($("td:eq(1)", this).text());
            u.id = w;
            u.type = $.trim($("td:eq(2)", this).text());
            u.cost = $.trim($("td:eq(3)", this).text()).replace(/[^\.\d]/g, "") * 1;
            u.upkeep = $.trim($("td:eq(4)", this).text()).replace(/[^\.\d]/g, "") * 1;
            u.weapon = $.trim($("td:eq(5)", this).text()).replace(/[^\.\d]/g, "") * 1;
            u.hull = $.trim($("td:eq(6)", this).text()).replace(/[^\.\d]/g, "") * 1;
            u.range = $.trim($("td:eq(7)", this).text()).replace(/[^\.\d]/g, "") * 1;
            u.power = $.trim($("td:eq(8)", this).text()).replace(/[^\.\d]/g, "") * 1;
            if (!u.order) {
                u.order = x;
            }
            if (!u.build) {
                gc.showMessage("Incomplete " + u.name + " data", "Data for " + u.name + " appears to be incomplete, please wait until it gets harvested. Reload this page after you see an appropriate success message in mod console (left bottom page corner).");
                gc.xhr({
                    url: "i.cfm?f=com_ship2&shiptype=" + w,
                    onSuccess: function (y) {
                        d[w] = g(y);
                        gc.setValue("a-allships", JSON.stringify(d));
                        console.log("Harvested data of " + u.name + ".");
                    },
                    onFailure: function (y) {
                        console.log("Query to the ship page for " + u.name + " returned no reply. Terminated.");
                    }
                });
            }
            d[w] = u;
            h.push(u);
        });
        h.sort(function (w, u) {
            var x = 0,
                v = 0;
            if (w && w.order) {
                x = w.order;
            }
            if (u && u.order) {
                v = u.order;
            }
            if (typeof x === "string" || typeof v === "string") {
                return (x + "").localeCompare((v + ""));
            }
            return x - v;
        });
        if (gc.location.match(/com_ship$/)) {
            gc.setValue("a-shipbuilder-shipsAvailable", JSON.stringify(h));
        }
        if (gc.location.match(/com_ship.*shiptype/)) {
            var k = (gc.location + "").replace(/.*shiptype=/, "") * 1;
            var a = d[k];
            if (!a) {
                a = {};
            }
            $.extend(a, g());
            d[k] = a;
        }
        gc.setValue("a-allships", JSON.stringify(d));
        var e = $("b:contains('BUILDING SHIPS')");
        gc.showMessage("Ship data caching", 'For the ship builder to work it requires valid ship data (power rating, build rate, etc.). Some of that can and will be harvested from the <a href="i.cfm?f=com_ship">ship list page</a>. However, if any build rate on this page is incorrect or missing, it has to be harvested from that ship\'s respective build page (e.g. <a href="i.cfm?f=com_ship2&shiptype=10">this page for Small Strafez Fodder</a>). There, that ship\'s data will be harvested and cached, to be used in the ship builder and other mods which require detailed ship data. The ship builder page will have to be refreshed afterward to use the newly cached data. This process is automated in case of missing data, but it its incorrect, you have to do it on your own. I would be nice if you emailed me that that happened, though.', "a-shipbuilder-shipdatahelp");
        var c = "How to use the ship builder";
        var n = 'Ship builder allows to build many different ships at once, fast. The ship types you can build are listed below. The input fields are where you place amounts, which is reflected by the stack building queue below the ship list. If you have enough turns to build what you selected, you will see a submit button there, too.<br />Please note, that some cells in the ship list change background when you move your mouse over them. Those are shortcuts to add/remove from given stack.<br />Furthermore, that above the ship list there are 10 slots for saving fleet presets - just click to save what is currently in the form, to be pasted later. These presets can be used by other mods to quickly build what you want e.g. from the ranking list.<br/ >Lastly, the stack list below the ship list shows not only the stacks you want to build but also the stacks you have already got (queried remotely from the disband page). If you wish to refresh it, either build something or click the "R" header. It may become inaccurate after a while.';
        gc.showMessage(c, n, "a-shipbuilder-usagehelp");
        e.text("SHIP BUILDER");
        e.append('<img src="i/help.gif" title="' + c + '" />').click(function () {
            if (!$("#a-shipbuilder-usagehelp").length) {
                gc.showMessage(c, n);
            }
        });
        e.siblings("b ~ a, b ~ table").remove();
        e.next().next().after("<table width=\"70px\" class=\"a-table a-shipbuilder-submit-wrap\">	<tbody>		<tr align=\"center\" class=\"table_row1\">			<td class=\"a-button\" id=\"a-shipbuilder-submit\"				title=\"Build the stacks above\">Build all</td>		</tr>	</tbody></table><br /><table class=\"a-table\" width=\"95%\" id=\"a-shipbuilder-saves\">	<tbody>		<tr class=\"table_row2\">			<td id=\"a-ship-save-a\" class=\"a-shipbuilder-save a-button\">&nbsp;</td>			<td id=\"a-ship-save-b\" class=\"a-shipbuilder-save a-button\">&nbsp;</td>			<td id=\"a-ship-save-c\" class=\"a-shipbuilder-save a-button\">&nbsp;</td>			<td id=\"a-ship-save-d\" class=\"a-shipbuilder-save a-button\">&nbsp;</td>			<td id=\"a-ship-save-e\" class=\"a-shipbuilder-save a-button\">&nbsp;</td>			<td id=\"a-ship-save-f\" class=\"a-shipbuilder-save a-button\">&nbsp;</td>			<td id=\"a-ship-save-g\" class=\"a-shipbuilder-save a-button\">&nbsp;</td>			<td id=\"a-ship-save-h\" class=\"a-shipbuilder-save a-button\">&nbsp;</td>			<td id=\"a-ship-save-i\" class=\"a-shipbuilder-save a-button\">&nbsp;</td>			<td id=\"a-ship-save-j\" class=\"a-shipbuilder-save a-button\">&nbsp;</td>		</tr>	</tbody></table><br /><br /><table class=\"a-table\" width=\"95%\" id=\"a-shipbuilder-ships-wrap\">	<tbody>		<tr align=\"center\" class=\"table_row0\">			<td>Race</td>			<td width=\"30%\">Name</td>			<td width=\"10%\">Amount</td>			<td>Build Rate</td>			<td>Cost</td>			<td>PR</td>			<td>Stack PR</td>			<td>Order</td>		</tr>		<tr align=\"center\" class=\"table_row0 a-shipbuilder-actionsrow\">			<td class=\"a-revbutton a-shipbuilder-addoneall\"				title=\"Click to add one to all build requests\">+1</td>			<td width=\"30%\"></td>			<td width=\"10%\"></td>			<td class=\"a-revbutton a-shipbuilder-addturnall\"				title=\"Click to add one turnful to all build requests\">+T</td>			<td class=\"a-revbutton a-shipbuilder-removeturnall\"				title=\"Click to remove one to all build requests\">-T</td>			<td class=\"a-revbutton a-shipbuilder-doubleall\"				title=\"Click to double all build requests\">x2</td>			<td class=\"a-revbutton a-shipbuilder-clearall\"				title=\"Click to clear all build requests\">clear</td>			<td class=\"a-revbutton a-shipbuilder-resetorder\"				title=\"Click to reset ship order\">reset</td>		</tr>	</tbody></table><br /><br /><table width=\"95%\" class=\"a-table\" id=\"a-shipbuilder-stacks-wrap\">	<tbody>		<tr align=\"center\" class=\"table_row0\">			<td width=\"20%\">Name</td>			<td width=\"10%\">To build</td>			<td width=\"10%\">In fleet</td>			<td>Turns</td>			<td>Cost</td>			<td>Upkeep</td>			<td>Weapon</td>			<td>Hull</td>			<td>Scanner</td>			<td>Power<br>			Rating</td>			<td id=\"a-shipbuilder-refresh-stacks\" title=\"Refresh\"				class=\"a-revbutton\">R</td>		</tr>	</tbody></table><br /><br /><table width=\"70px\" class=\"a-table a-shipbuilder-submit-wrap\">	<tbody>		<tr align=\"center\" class=\"table_row1\">			<td class=\"a-button\" id=\"a-shipbuilder-submit\"				title=\"Build the stacks above\">Build all</td>		</tr>	</tbody></table><br /><br /><table class=\"a-table\" id=\"a-shipbuilder-options\" width=\"100%\">	<tbody>		<tr align=\"left\" class=\"table_row0\">			<td>				<input type=\"checkbox\" id=\"a-shipbuilder-resetafterbuild\" />Reset form after build			</td>		</tr>		<tr align=\"left\" class=\"table_row0\">			<td>				<input type=\"checkbox\" id=\"a-shipbuilder-optimize\" />Optimize requests to minimize upkeep (not implemented yet)			</td>		</tr>	</tbody></table><div id=\"a-shipbuilder-save-infobox\" style=\"display: none;\"><table width=\"100%\">	<tbody>		<tr></tr>	</tbody></table></div>");
        var b = "<tr class=\"table_row1\" id=\"a-shipbuilder-ship-${id}\" sid=\"${id}\">	<td class=\"a-button a-shipbuilder-addone\"		title=\"Click to add just one to build request\">${race}</td>	<td align=\"left\"><a href=\"i.cfm?f=com_ship2&shiptype=${id}\" class=\"\">${name}</a></td>	<td align=\"center\" class=\"a-shipbuilder-input\"><input type=\"text\"		style=\"width: 50px;\" /></td>	<td align=\"right\" class=\"a-button a-shipbuilder-addturn\"		title=\"Click to add a turnful to build request\">${build}</td>	<td align=\"right\" class=\"a-button a-shipbuilder-removeturn\"		title=\"Click to remove a turnful to build request\">${cost}</td>	<td align=\"right\" class=\"a-button a-shipbuilder-double\"		title=\"Click to double build request\">${power}</td>	<td align=\"right\" class=\"a-button a-shipbuilder-clear a-shipbuilder-stackpower\"		title=\"Click to clear build request\">${stack_power}</td>	<td align=\"right\" class=\"a-button a-shipbuilder-order\"><input type=\"text\"		style=\"width: 50px;\" value=\"${order}\"/></td></tr>";
        $.tmpl(b, h).appendTo("#a-shipbuilder-ships-wrap tbody");
        var p = [];
        var q = "<tr class=\"table_row1 a-shipbuilder-stack\" id=\"a-shipbuilder-ship-${id}\"id=\"${id}\">	<td align=\"left\"><a href=\"i.cfm?f=com_ship2&shiptype=${id}\" class=\"\">${name}</a></td>	<td align=\"right\">${amount}</td>	<td align=\"right\">${existing}</td>	<td align=\"right\">${turns}</td>	<td align=\"right\">${cost}</td>	<td align=\"right\">${upkeep}</td>	<td align=\"right\">${weapon}</td>	<td align=\"right\">${hull}</td>	<td align=\"right\">${scanner}</td>	<td align=\"right\">${power}</td>	<td align=\"right\" class=\"a-button a-shipbuilder-disbandall\"		disbandId=\"${disband}\" disbandAmount=\"${existing}\"		title=\"Click to disband this stack\">x</td></tr>";
        var j = "<tr class=\"table_row0\" id=\"a-shipbuilder-ship-totals\">	<td align=\"left\">Totals</td>	<td align=\"right\">${amount}</td>	<td align=\"right\">&nbsp;</td>	<td align=\"right\">${turns}</td>	<td align=\"right\">${cost}</td>	<td align=\"right\">${upkeep}</td>	<td align=\"right\">${weapon}</td>	<td align=\"right\">${hull}</td>	<td align=\"right\">${scanner}</td>	<td align=\"right\">${power}</td>	<td align=\"right\">&nbsp;</td></tr>";
        var s = {};
        var t = function () {
            var w = jQuery.extend(true, [], p);
            w.sort(app.util.sortByPowerDesc);
            $("#a-shipbuilder-stacks-wrap tbody tr.table_row1, #a-shipbuilder-ship-totals").remove();
            $.tmpl(q, w).appendTo("#a-shipbuilder-stacks-wrap tbody");
            $("#a-shipbuilder-stacks-wrap td.a-button").hover(function () {
                $(this).addClass("table_row0").removeClass("table_row1");
            }, function () {
                $(this).removeClass("table_row0").addClass("table_row1");
            });
            $(".a-shipbuilder-disbandall").click(function () {
                gc.xhr({
                    url: "i.cfm?f=com_disband",
                    data: "submitflag=1&" + $(this).attr("disbandId") + "=" + $(this).attr("disbandAmount"),
                    onSuccess: r
                });
            });
            s = {};
            for (var v = 0; v < p.length; v = v + 1) {
                if (!p[v]) {
                    continue;
                }
                for (var u in p[v]) {
                    if (p[v].hasOwnProperty(u)) {
                        if (!s[u]) {
                            s[u] = 0;
                        }
                        s[u] += p[v][u];
                    }
                }
            }
            $.tmpl(j, s).appendTo("#a-shipbuilder-stacks-wrap tbody");
        };
        f = gc.getValue("a-shipbuilder-resetafterbuild") === true ? true : false;
        $("#a-shipbuilder-resetafterbuild").prop("checked", f);
        $("#a-shipbuilder-resetafterbuild").click(function () {
            f = !f;
            gc.setValue("a-shipbuilder-resetafterbuild", f);
        });
        m = gc.getValue("a-shipbuilder-optimize") === true ? true : false;
        $("#a-shipbuilder-optimize").prop("checked", m);
        $("#a-shipbuilder-optimize").click(function () {
            m = !m;
            gc.setValue("a-shipbuilder-optimize", m);
        });
        var o = function (y, A) {
            var w = y.siblings(".a-shipbuilder-input").children().first();
            var v = w.val().replace(/\D/, "", "g") * 1;
            var x = A(v);
            var u = y.parent().attr("sid");
            if (!x && !p[u]) {
                return;
            }
            w.val(x ? x : "");
            var z = 0;
            var B = jQuery.extend(true, {}, d[u]);
            if (p[u] && p[u].existing) {
                B.existing = p[u].existing;
                B.disband = p[u].disband;
                z = p[u].existing * 1;
            }
            if (p[u] && !(x + z)) {
                delete p[u];
            } else {
                p[u] = B;
                p[u].amount = x;
                p[u].turns = Math.ceil(x / B.build);
                p[u].cost = B.cost * x;
                p[u].upkeep = B.upkeep * (x + z);
                p[u].weapon = B.weapon * (x + z);
                p[u].hull = B.hull * (x + z);
                p[u].power = B.power * (x + z);
                p[u].scanner = B.scanner * (x + z);
            }
            t();
            y.siblings(".a-shipbuilder-stackpower").text(p[u].power);
        };
        $(".a-shipbuilder-addone").click(function () {
            o($(this), function (u) {
                return u + 1;
            });
        });
        $(".a-shipbuilder-addturn").click(function () {
            var w = $(this);
            var v = w.parent().attr("sid");
            var u = d[v].build;
            o(w, function (x) {
                return x + u;
            });
        });
        $(".a-shipbuilder-removeturn").click(function () {
            var w = $(this);
            var v = w.parent().attr("sid");
            var u = d[v].build;
            o(w, function (x) {
                return Math.max(x - u, 0);
            });
        });
        $(".a-shipbuilder-double").click(function () {
            o($(this), function (u) {
                return u * 2;
            });
        });
        $(".a-shipbuilder-clear").click(function () {
            o($(this), function (u) {
                return 0;
            });
        });
        $(".a-shipbuilder-addoneall").click(function () {
            $("td.a-shipbuilder-input input").each(function () {
                var u = $(this).parent().next();
                o(u, function (w) {
                    return w + 1;
                });
            });
        });
        $(".a-shipbuilder-addturnall").click(function () {
            $("td.a-shipbuilder-input input").each(function () {
                var w = $(this).parent().next();
                var v = w.parent().attr("sid");
                var u = d[v].build;
                o(w, function (x) {
                    return x + u;
                });
            });
        });
        $(".a-shipbuilder-removeturnall").click(function () {
            $("td.a-shipbuilder-input input").each(function () {
                var w = $(this).parent().next();
                var v = w.parent().attr("sid");
                var u = d[v].build;
                o(w, function (x) {
                    return Math.max(x - u, 0);
                });
            });
        });
        $(".a-shipbuilder-doubleall").click(function () {
            $("td.a-shipbuilder-input input").each(function () {
                var u = $(this).parent().next();
                o(u, function (w) {
                    return w * 2;
                });
            });
        });
        $(".a-shipbuilder-clearall").click(function () {
            $("td.a-shipbuilder-input input").each(function () {
                var u = $(this).parent().next();
                o(u, function (w) {
                    return 0;
                });
            });
        });
        $(".a-shipbuilder-resetorder").click(function () {
            for (var u = 0; u < d.length; u = u + 1) {
                if (d[u] && d[u].order) {
                    delete d[u].order;
                }
            }
            gc.setValue("a-allships", JSON.stringify(d));
            console.log("Order was reset, please refresh page.");
        });
        $("td.a-shipbuilder-order input").change(function () {
            var v = $(this).parent();
            var u = v.parent().attr("sid");
            var w = d[u];
            if (w) {
                w.order = $(this).val();
            }
        });
        $("td.a-shipbuilder-input input").change(function () {
            var u = $(this).parent().next();
            o(u, function (w) {
                return w;
            });
        });
        $(".a-shipbuilder-save").each(function () {
            var v = $(this).attr("id");
            var u = gc.getValue(v + "-name");
            if (u) {
                $(this).text(u);
            }
        });
        $(".a-shipbuilder-save").dblclick(function () {
            var v = $(this).attr("id");
            var u = gc.getValue(v + "-value");
            if (u && u !== "[]") {
                gc.setValue(v + "-value", "");
                gc.setValue(v + "-name", "");
                $(this).html("&nbsp;");
            }
        });
        $(".a-shipbuilder-save").click(function () {
            var v;
            var y = $(this).attr("id");
            var x = gc.getValue(y + "-value", "JSON_AS_ARRAY");
            if (x.length) {
                for (v = 0; v < x.length; v = v + 1) {
                    var w = $("#a-shipbuilder-ship-" + x[v].id + " td.a-shipbuilder-input").next();
                    o(w, function (z) {
                        return x[v].amount;
                    });
                }
            } else {
                x = [];
                for (v = 0; v < p.length; v = v + 1) {
                    if (p[v] && p[v].amount) {
                        x.push({
                            id: v,
                            amount: p[v].amount
                        });
                    }
                }
                if (!x.length) {
                    return;
                }
                var u = prompt("Enter a label for this stack preset, 10 characters at most, preferably 7");
                if (u) {
                    gc.setValue(y + "-value", JSON.stringify(x));
                    u = u.substring(0, 10);
                    gc.setValue(y + "-name", u);
                    $(this).text(u);
                    console.log("[Ship builder] A preset " + u + " was created.");
                }
            }
        });
        var l = function (A) {
            var B = $(this).attr("id");
            var z = gc.getValue(B + "-value");
            if (z && z !== "[]") {
                $(this).text("paste");
                var y = gc.getValue(B + "-value", "JSON_AS_ARRAY");
                var v = [];
                for (var w = 0; w < y.length; w = w + 1) {
                    var u = jQuery.extend(true, {}, d[y[w].id]);
                    u.amount = y[w].amount;
                    u.turns = Math.ceil(y[w].amount / u.build);
                    v.push(u);
                }
                v.sort(app.util.sortByPowerDesc);
                var x = '<tr class="a-shipbuilder-save-body""><td align="left"  width="70%">${name}</td><td align="right" width="10%">${amount}</td><td align="right" width="10%">${turns}</td><td align="right" width="10%">${power}</td></tr>';
                $("#a-shipbuilder-save-infobox").attr("style", "display: block; top: " + (A.clientY + 15) + "px; left: " + $(this).position().left + 5 + "px;");
                $.tmpl(x, v).appendTo("#a-shipbuilder-save-infobox tbody");
            } else {
                if (s.power > 0) {
                    $(this).text("save");
                }
            }
        };
        var i = function () {
            var w = $(this).attr("id");
            var v = gc.getValue(w + "-value");
            if (v && v !== "[]") {
                var u = gc.getValue(w + "-name");
                $(this).text(u);
                $("#a-shipbuilder-save-infobox tr").remove();
                $("#a-shipbuilder-save-infobox").hide();
            } else {
                $(this).html("&nbsp;");
            }
        };
        $(".a-shipbuilder-save").hover(l, i);
        $(".a-shipbuilder-submit-wrap").click(function () {
            var x = $(this);
            var v = 0,
                u, z = 0;
            for (u = 0; u < p.length; u = u + 1) {
                if (p[u] && p[u].amount && p[u].id) {
                    v += p[u].turns * 1;
                    z = z + 1;
                }
            }
            var y = function (A) {
                var B = $("td:contains('You bought ')", A).contents().filter(function () {
                    return this.nodeType === 3 && this.textContent.match("You bought");
                });
                console.log("[Ship builder] " + B.text());
                gc.turns.subtractValue(this.extra.turns);
                gc.cash.subtractValue(this.extra.cost);
                z = z - 1;
                if (f && z === 0) {
                    console.log("Resetting building form");
                    $("td.a-shipbuilder-input input").each(function () {
                        var C = $(this).parent().next();
                        o(C, function (D) {
                            return 0;
                        });
                    });
                }
                if (z === 0) {
                    r();
                }
            };
            var w = function (A) {
                var B = $("b:contains('SHIPS')", A).text();
                var C = $("font[color='red'] > b", A).text();
                console.error("[Ship builder] " + B + ": " + C);
            };
            if (v > gc.turns.getValue()) {
                console.log("Not enough turns to build all stacks");
                return;
            }
            for (u = 0; u < p.length; u = u + 1) {
                if (p[u] && p[u].amount && p[u].id) {
                    gc.xhr({
                        extra: p[u],
                        url: "i.cfm?&f=com_ship2&shiptype=" + p[u].id,
                        data: "amount=" + p[u].amount,
                        successCondition: "td:contains('You bought ')",
                        onSuccess: y,
                        onFailure: w
                    });
                }
            }
        });
        r = function () {
            gc.xhr({
                url: "i.cfm?f=com_disband",
                method: "GET",
                onSuccess: function (u) {
                    var v;
                    for (v = 0; v < p.length; v = v + 1) {
                        if (p[v]) {
                            p[v].existing = 0;
                        }
                    }
                    $("input[name^='dis']", u).each(function () {
                        var y = $(this);
                        var B = y.attr("name");
                        var w = $.trim(y.parent().prev().prev().text());
                        var z = y.parent().next().text().replace(/[^\.\d]/g, "");
                        var C = 0;
                        for (v = 0; v < d.length; v = v + 1) {
                            if (d[v] && d[v].name === w) {
                                C = v;
                                break;
                            }
                        }
                        var A = jQuery.extend(true, {}, d[C]);
                        var x = 0;
                        if (p[C] && p[C].amount) {
                            x = p[C].amount;
                        } else {
                            p[C] = jQuery.extend(true, {}, d[C]);
                        }
                        p[C].existing = z;
                        p[C].disband = B;
                        p[C].turns = Math.ceil(x / A.build);
                        p[C].cost = A.cost * x;
                        p[C].upkeep = A.upkeep * (x + z);
                        p[C].weapon = A.weapon * (x + z);
                        p[C].hull = A.hull * (x + z);
                        p[C].power = A.power * (x + z);
                        p[C].scanner = A.scanner * (x + z);
                    });
                    for (v = 0; v < p.length; v = v + 1) {
                        if (p[v] && (!p[v].amount && !p[v].existing)) {
                            delete p[v];
                        }
                    }
                    t();
                }
            });
        };
        r();
        $("#a-shipbuilder-refresh-stacks").click(r);
    }
};
app.mod.stylehandler = {
    id: "a-stylehandler",
    defaultValue: true,
    title: "CSS tweaks",
    description: "Adapts game CSS stylesheet.",
    items: [{
        type: "checkbox",
        id: "a-stylehandler-nobgimage",
        defaultValue: true,
        description: "Remove background images from most gc pages."
    }],
    filter: function () {
        if (!gc.getValue("a-stylehandler")) {
            return false;
        }
        return true;
    },
    plugin: function () {
        if (gc.getValue("a-stylehandler-nobgimage") && gc.isPropertyPage()) {
            $("body").addClass("no-blue-image");
        }
    }
};
app.mod.tabbedpms = {
    id: "a-tabbedpms",
    defaultValue: true,
    title: "Tabbed private messages",
    description: "When it spots the blinking yellow annoyance it opens a new tab with PM inbox. And more...",
    items: [{
        type: "checkbox",
        id: "a-tabbedpms-autoopen",
        defaultValue: true,
        description: "Jump to new PMs automagically (in new tab each)?"
    }],
    filter: function () {
        if (!gc.getValue("a-tabbedpms")) {
            return false;
        }
        if (gc.location.indexOf("i.cfm") !== -1) {
            return true;
        }
        return false;
    },
    plugin: function () {
        if ($("td[background*='blink']").length && !gc.location.match(/.*f=pm/)) {
            gc.openInTab(app.gameServer + "i.cfm?f=pm");
        }
        if (gc.location.match(/.*f=pm$/)) {
            var a = $("table.table_back[width='80%'] img[src='i/w/pm_n.gif']");
            if (a.length) {
                var c;
                if (a.length > 1) {
                    c = a.length + " PMs";
                } else {
                    c = a.first().parent().siblings().eq(2).text();
                }
                document.title = c;
                if (gc.getValue("a-tabbedpms-autoopen")) {
                    if (a.length > 1) {
                        a.each(function () {
                            var d = $(this).first().parent().siblings().eq(3).children().first().attr("href");
                            gc.openInTab(app.gameServer + d);
                        });
                    } else {
                        var b = a.first().parent().siblings().eq(3).children().first().attr("href");
                        document.location.href = app.gameServer + b;
                    }
                }
            }
        } else {
            if (gc.location.match(/.*f=pm/)) {
                document.title = $.trim($("img[src='i/w/pm_add.gif']").first().parent().parent().text());
            }
        }
    }
};
app.mod.turnticker = {
    id: "a-turnticker",
    defaultValue: true,
    title: "Turn ticker",
    description: "Updates the turn counts while you wait. Relative to last sync with gc servers  (req.: Taiaha).",
    items: [{
        type: "info",
        text: "It should also spot that you have logged onto another game speed in another tab and notify you (server gets marked with red)."
    }, {
        type: "checkbox",
        id: "a-turnticker-showturns",
        description: "Show turns in tab titles"
    }, {
        type: "checkbox",
        id: "a-turnticker-showmaxedturns",
        description: "Show maxed-out turns in tab titles"
    }],
    filter: function () {
        if (!gc.getValue("a-turnticker")) {
            return false;
        }
        return true;
    },
    plugin: function () {
        var b = new Date().getTime();
        window.setInterval(function () {
            var d = (gc.getValue("a-propertycheck-timestamp") - b) % gc.server.turnRate;
            if (gc.userName === gc.getGlobalValue("userName")) {
                $("#a-server-name").removeClass("a-bodybox-red").addClass("bodybox");
            } else {
                $("#a-server-name").removeClass("bodybox").addClass("a-bodybox-red");
            } if (gc.turns.getValue() >= gc.turns.max) {
                return;
            }
            if (d < 0) {
                if (gc.isNewest()) {
                    gc.turns.addValue(1);
                }
                if (gc.turns.getValue() < gc.turns.max) {
                    window.setTimeout(function () {
                        if (gc.isNewest()) {
                            gc.turns.addValue(1);
                        }
                    }, (gc.server.turnRate - d));
                }
            } else {
                window.setTimeout(function () {
                    if (gc.isNewest()) {
                        gc.turns.addValue(1);
                    }
                }, d);
            }
        }, gc.server.turnRate);
        var a = true;
        var c = document.title;
        if (gc.getValue("a-turnticker-showturns")) {
            document.title = gc.turns.getValue() + " " + c;
        }
        window.setInterval(function () {
            if (gc.getValue("a-turnticker-showturns")) {
                document.title = gc.turns.getValue() + " " + c;
            }
            if (gc.isNewest() === false && gc.userName === gc.getGlobalValue("userName")) {
                gc.turns.updateEl();
                gc.power.updateEl();
                gc.food.updateEl();
                gc.cash.updateEl();
                $("a").each(function () {
                    var d = $(this).attr("href");
                    if (d) {
                        $(this).attr("href", d.replace(/&\d\d\d\d&/, "&" + gc.getValue("antiReload") + "&"));
                    }
                });
                $("form").each(function () {
                    var d = $(this).attr("action");
                    if (d) {
                        $(this).attr("action", d.replace(/&\d\d\d\d&/, "&" + gc.getValue("antiReload") + "&"));
                    }
                });
                $("input").each(function () {
                    var d = this.getAttribute("onclick");
                    if (d) {
                        this.setAttribute("onclick", d.replace(/&\d\d\d\d&/, "&" + gc.getValue("antiReload") + "&"));
                    }
                });
            }
            if (gc.getValue("a-turnticker-showmaxedturns") && gc.turns.getValue() === gc.turns.max) {
                if (a) {
                    document.title = gc.turns.getValue() + " " + c;
                    a = false;
                } else {
                    document.title = (gc.turns.getValue() + "").replace(/./g, "_") + " " + c;
                    a = true;
                }
            }
        }, 1000);
    }
};
(function (a) {
    a.gc = new app.ModControl({
        mods: [app.mod.automatedcapsulelab, app.mod.battlesmarkup, app.mod.chathighlighter, app.mod.clicktocontinue, app.mod.clusterbuilder, app.mod.credits, app.mod.disbandertweaks, app.mod.extramenu, app.mod.fedchat, app.mod.fedpms, app.mod.forumkillfile, app.mod.infratweak, app.mod.researchtweak, app.mod.keybindings, app.mod.markettweaks, app.mod.pagetitles, app.mod.planetplunderer, app.mod.presetbuilder, app.mod.rankingtweaks, app.mod.newbieranking, app.mod.shipbuilder, app.mod.stylehandler, app.mod.tabbedpms, app.mod.turnticker, app.mod.commoncss]
    });
    if (gc.loaded === false) {
        return;
    }
    $("head:first").append('<style type="text/css">.a-bodybox-red{background-image:url(data:image/gif;base64,R0lGODlhMgAyAKEBALAAAP8AAP8AAP8AACH/C05FVFNDQVBFMi4wAwEAAAAh+QQEMgD/ACwAAAAAMgAyAAACM4yPqcvtD6OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITConBQAh+QQBMgABACwAAAAAMgAyAAACM4SPqcvtD6OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITConBQA7);border:1px solid #595959;color:#9EDCFE;}.a-bodybox-yellow{background-image:url(data:image/gif;base64,R0lGODlhMgAyAJEAAP//ALCwAP4BAgAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQEMgD/ACwAAAAAMgAyAAACM4SPqcvtD6OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITConBQAh+QQFMgACACwAAAAAMgAyAAACM4yPqcvtD6OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITConBQA7);border:1px solid #595959;color:#4f4f00;}.a-hidden{display:none;}.a-separator{height:10px;}.a-table{border-collapse:collapse;border-spacing:0;border-width:0 0 1px 1px;}.a-table td,.a-table th{border-width:1px 1px 0 0;margin:0;padding:1px;}.a-table,.a-table td,.a-table th{border-color:gray;border-style:solid;}#a-about{border:1px solid #595959;text-align:left;margin:5px 5px 20px;padding:4px;}.a-mod{border:1px solid #595959;list-style:none;text-align:left;margin:5px;padding:4px;}.a-mod-item{list-style-type:none;margin-left:5px;margin-top:7px;padding-left:15px;}.a-mod-item li{margin:6px;}.a-mod-item-parts{padding:0;}.a-mod-item-parts li{display:inline;margin:0;}.a-mod-item-parts-submit input{cursor:pointer;margin-left:-20px;vertical-align:middle;}.a-mod-line li{display:inline;}.a-mod-line ul{padding-left:0;margin:0;}.a-mod-submit{cursor:pointer;float:right;}.a-info-wrap{background-color:#383838;width:796px;padding:1px;border:solid 1px yellow;color:white;margin-left:auto;margin-right:auto;margin-top:2px;border-radius:4px 4px 4px 4px;}.a-info-title{font-weight:bold;color:#A4A400;width:100%;padding:3px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAADXCAYAAADFuwsIAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sJEwoLKCBHKKsAAALnSURBVGje7dtNaxNBGMDxfxLNgmmtynZ9CV2jNLQVFNQcdE85RTAeBCVnPek938VPkFM+QYkhIItzEm+iqFF8jWlqm4htM9Wqh8zUdUm0Z3l+EJaZzLM7M8/s7dkEf0oAHjANHAD2ARvmtwJsxwdbGeCUCRpnB3gL9GxHylwPAktAmsmSwGFz/WI7UsB8bBZ/cxyYscGeWRsArVbrWhiGN2w7DMMbzWazHLvBCUzQIdtTKpVm8vl8wXGcaaVUYmdn5+fCwkKgtR4EQfBAKfXVDJ0G0ikgZ6fcbrd1r9d7UiwWz3qeN++67pzWelCtVu8tLy/3Y09fT8bXWqvVet1ut23bnU7nZb1eXx2z9lQS0NEepdRN3/cvaK0HWutBLpe7GN2DiO3dbQcIgmAqm80u2alWq9V7WuuB7/uLhUIhmv9tYCthcnvW5rxcLh/OZDIpO9VKpeL2+/1vjUZjEAl+Baza9c6a07UX68CL6AnbBH6aFCT+Efga+MGYgQdM6qbimwO8Az5PejGi0sB+c4i2gS2EEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBD/n3hFcRI4AxxlVBmfBtYYlSE/Bb5OCvaAwASN8w14BDyzHbaKOgtcYXKBvx07BzjAB9uRBq4yKnzei1mzjC92jY79p9Vq3Q7D8I5th2F4p9ls3ord4ByMSqyztqdUKnn5fH7RcRxHKXXX1Okvaa2HQRAcUUqtRfZnKgVcMrtMu93e6PV6L4rF4nnP8465rjurtR6aOv1Psae/S9pAq1arvel2ux3b7nQ6H+v1+tsxa08nGX1rsUspddf3/VNa66HWepjL5U5H9yBiIwnsTicIgiPZbPaknaqp0x/6vn+yUCjMRAI3gbUEo+L26zZV5XL5eCaT2W+nWqlU/H6/P2w0GiuR4IfAc3vCFoHLe8zze+B+9ISt8vv7k8Q/AkPg+7gXwzUzcGP9m8BjzJcBk94qa8qcc8dkY23coF8WkP7lZPMGIgAAAABJRU5ErkJggg==) 777px 5px no-repeat transparent;}.a-info{padding:3px 15px 3px 3px;}.a-info-title:hover{background-position:777px -195px;}.a-loading{background:url(data:image/gif;base64,R0lGODlhDgAOAIQAAAQCBIyOjERCRBweHMzKzBQSFFxaXLSytCwuLGRmZAwKDJyanCQmJBwaHLy6vGxubAQGBJSSlFRSVCQiJPz+/BQWFFxeXLS2tDQyNGxqbAwODAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQIBgAAACwAAAAADgAOAAAFbuAmiso0QeMIVBXQMEwDsYBYwc3NVO9uw4ONprDpNUSQhiyVXFYEmFpqAyjIJAYDYyqETSQWLVfjfSKkqVVDIUxkjiOE4wA3RCIZiEQCuFAoCyISAREJDwQEDwd/ESRYGgGIAQ0LAURTCAcHCFMhACH5BAgGAAAALAAAAAAOAA4AhAQCBISGhERCRCQiJBQSFMzKzGRmZLS2tDQ2NAwKDIyOjFRSVBwaHHRydOTm5Dw+PAQGBIyKjERGRCQmJBQWFGxqbDw6PAwODJSSlFxeXBweHHx6fPz+/AAAAAAAAAAAAAVzYCeKyTBA4whQFMBMEwOxgEjBzD1R727Dms6F0OkxRBCGLJVcJhiEWqoDiRwsA9hl2qlwOI7sZDs1fB3JFheiuHYSDwFxNMBEKCJLJiOAWCwACgUFGyIIewILChgLAYMNSAgICQYYChUUGxVkKQMBAQNTIQAh+QQIBgAAACwAAAAADgAOAAAFceAmiso0QeMIVBXQMEwzLEEhVnCDM9VBUZEbbLDR2C6/hQjSaKBGCMehsVE0CoDUMhNATGAa7UZCIBy+jLCWbGa2xBAuYsN0phqZhHo3ADAmAFwRBkIxGAYWGAkRERIiKw0AAhYGAhoGEk8pFRISFVohACH5BAgGAAAALAAAAAAOAA4AhAQCBISGhERCRCQiJBQSFMzKzGRmZLS2tDQ2NAwKDIyOjFRSVBwaHHRydOTm5Dw+PAQGBIyKjERGRCQmJBQWFGxqbDw6PAwODJSSlFxeXBweHHx6fPz+/AAAAAAAAAAAAAVwYCeKj+NY4whQFHBw3EFt1SVS08REcBQVhcYtx0gYKhAMcCOCMIopjSJA6SQYBECquTBMBjnb1oLBBMATcYpsdra2HUh3EH9CUoTHIzGcaDoXNgIZGSgdODoEORSDGQgiKwwADEQJCAh3WwkDA3wpIQAh+QQIBgAAACwAAAAADgAOAAAFc+AmithxYeNYBMsQEERQSJIiBhR1PHCWRBGJaJFzAGiAX8QgGhwciFQjkShsFI0CICWCYASVCYOh4W4mFoNETDYzDBYJpFHZcgHfymbegKTmFX4bFWMDGxplA2MNIoQMWWMVDYsiAJIAk4+YWmYKExM2KSEAIfkECAYAAAAsAAAAAA4ADgCEBAIEhIaEREJEJCIkFBIUzMrMZGZktLa0NDY0DAoMjI6MVFJUHBocdHJ05ObkPD48BAYEjIqMREZEJCYkFBYUbGpsPDo8DA4MlJKUXF5cHB4cfHp8/P78AAAAAAAAAAAABXFgJ4pDEAzjeDUNVWGYkVgIJDZFES0KtjyZDEK0ySkgNIggaBFRAgqUSvBIdB6HiC3VAVAYEAeHY+B2LpPJQEw2E9IDrNYMIDCsAIZmK0owGABOaRpnFx0MaRQiiBMMbxNfaQwidYCMlgSBXAkDA1YpIQAh+QQIBgAAACwAAAAADgAOAAAFc+AmipUkVeOoSIYmWIYAVRUgSkGUYDDWMAzUxhCJZACMCWAAbIg0iYRQBBk0bIjAA5ISAQoNyIVAkHQ3GuDkQDZ308lshtv9NhSbwcGBSEEaYSILFBQOaBp5QEIBhAcFij8MThsFEQuATQANBTZdEEl4KSEAIfkECAYAAAAsAAAAAA4ADgCEBAIEhIaEREJEJCIkFBIUzMrMZGZktLa0NDY0DAoMjI6MVFJUHBocdHJ05ObkPD48BAYEjIqMREZEJCYkFBYUbGpsPDo8DA4MlJKUXF5cHB4cfHp8/P78AAAAAAAAAAAABXJgJ4rJMEDjCCFWQk0TA1EUICJZ9rwTxcAUkSWzkHQIic4vRnoICCkIQ9YZGBaoVAdAkAUwGIu2c4ENvgqxtjwxXbMpgC9JiWAG0amtsykUFBAGBhAaQCINfgEKHBwKSwwkFRsUB4wHAAwEeykWDg5qIyEAOw==) no-repeat right top;}#a-authentication-token{width:228px;}.no-blue-image{background-image:none;}#a-logappender{float:left;left:10px;overflow:hidden;width:100%;}#a-logappender-wrap{bottom:0;left:0;overflow:auto;position:fixed;width:380px;}.a-battlesmarkup-ship{width:383px!important;list-style:none;padding-left:5px;margin:5px;}.a-battlesmarkup-ship-lost{width:60px!important;color:#faa;}.a-battlesmarkup-ship-amount{width:60px!important;}.a-battlesmarkup-ship-name{width:202px!important;}.a-battlesmarkup-ship-remaining{width:60px!important;color:#afa;}ul.a-battlesmarkup-ship>li{display:inline;float:left;width:50px;}.a-clusterbuilder-button{border:1px solid gray;padding:3px;}#a-credits-text{margin-top:5px;}#a-fedpms-iframe{color:#FFF;filter:alpha(opacity=0);height:0;opacity:0;width:0;}.a-forumkillfile-hidden{display:none;}#a-presetbuilder-wrap{position:fixed;width:300px;}#a-presetbuilder-save-infobox{background-color:#000;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAK8AAACvABQqw0mAAAACF0RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgMy4w72kx8AAAAQNJREFUeJzt0TENACEAwMDnpWAF96hiRgEd7hQ06Vhz7I+M/3UAN0NiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIk52jsB+O+6+asAAAAASUVORK5CYII=);border:1px solid #C46200;color:#FFF;display:block;filter:alpha(opacity=85);font-size:xx-small;left:5px;opacity:.85;position:fixed;text-align:left;top:5px;width:252px;padding:4px;}#a-presetbuilder-totals-body td{border-top:1px solid #C46200;}#a-presetbuilder-saves td{text-align:center;width:10%;}.a-shipbuilder-actionsrow{font-size:xx-small;height:25px;}.a-rankingtweaks-bloodwar-ally{color:#0f0;}.a-rankingtweaks-bloodwar-enemy{color:red;}.a-rankingtweaks-bloodwar-neutral{color:#00f;}.a-rankingtweaks-fedtag{font-size:x-small;padding-left:3px;}.a-rankingtweaks-statustag{font-size:x-small;font-style:italic;padding-left:3px;}#a-shipbuilder-save-infobox{background-color:#000;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAK8AAACvABQqw0mAAAACF0RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgMy4w72kx8AAAAQNJREFUeJzt0TENACEAwMDnpWAF96hiRgEd7hQ06Vhz7I+M/3UAN0NiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIkxJMaQGENiDIk52jsB+O+6+asAAAAASUVORK5CYII=);border:1px solid #C46200;color:#FFF;display:block;filter:alpha(opacity=85);font-size:xx-small;left:5px;opacity:.85;position:fixed;text-align:left;top:5px;width:252px;padding:4px;}#a-shipbuilder-saves td{text-align:center;width:10%;}.a-shipbuilder-actionsrow{font-size:xx-small;height:25px;}.a-property{background-color:#000;border:1px solid #FF0;filter:alpha(opacity=85);height:38px;opacity:.85;position:fixed;margin:2px;padding:2px;}.a-property-close{background-color:#FFF;float:right;font-size:9px;}.a-property-restore{background-color:#FFF;font-size:9px;}</style>');
    gc.runMods();
})(window);