function decrypt(str) {
    // 该函数定义 bays4
    // 解密：basy4.d(data)
    // 该函数是扇贝单词官方代码，并非作者混淆，该函数仅用于解密数据请求
    return (function (r) {
        var n = {};

        function o(t) {
            if (n[t])
                return n[t].exports;
            var e = n[t] = {
                i: t,
                l: !1,
                exports: {}
            };
            return r[t].call(e.exports, e, e.exports, o),
                e.l = !0,
                e.exports
        }

        return o.m = r, o.c = n,
            o.i = function (t) {
                return t
            },
            o.d = function (t, e, r) {
                o.o(t, e) || Object.defineProperty(t, e, {
                    configurable: !1,
                    enumerable: !0,
                    get: r
                })
            },
            o.n = function (t) {
                var e = t && t.__esModule ? function () {
                            return t.default
                        }
                        : function () {
                            return t
                        }
                ;
                return o.d(e, "a", e),
                    e
            },
            o.o = function (t, e) {
                return Object.prototype.hasOwnProperty.call(t, e)
            },
            o.p = "",
            o(o.s = 3)
    }([function (t, e, r) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = function () {
            function n(t, e) {
                for (var r = 0; r < e.length; r++) {
                    var n = e[r];
                    n.enumerable = n.enumerable || !1,
                        n.configurable = !0,
                    "value" in n && (n.writable = !0),
                        Object.defineProperty(t, n.key, n)
                }
            }

            return function (t, e, r) {
                return e && n(t.prototype, e),
                r && n(t, r),
                    t
            }
        }()
            , o = function () {
            function r() {
                !function (t, e) {
                    if (!(t instanceof r))
                        throw new TypeError("Cannot call a class as a function")
                }(this)
            }

            return n(r, null, [{
                key: "loop",
                value: function (t, r) {
                    "v".repeat(t).split("").map(function (t, e) {
                        return r(e)
                    })
                }
            }]),
                r
        }();
        e.default = o
    }
        , function (t, e, r) {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            });
            var n = function () {
                function n(t, e) {
                    for (var r = 0; r < e.length; r++) {
                        var n = e[r];
                        n.enumerable = n.enumerable || !1,
                            n.configurable = !0,
                        "value" in n && (n.writable = !0),
                            Object.defineProperty(t, n.key, n)
                    }
                }

                return function (t, e, r) {
                    return e && n(t.prototype, e),
                    r && n(t, r),
                        t
                }
            }()
                , o = a(r(5))
                , u = a(r(0));

            function a(t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            }

            function i(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }

            var f = function () {
                function t() {
                    i(this, t),
                        this._char = ".",
                        this._children = {}
                }

                return n(t, [{
                    key: "getChar",
                    value: function () {
                        return this._char
                    }
                }, {
                    key: "getChildren",
                    value: function () {
                        return this._children
                    }
                }, {
                    key: "setChar",
                    value: function (t) {
                        this._char = t
                    }
                }, {
                    key: "setChildren",
                    value: function (t, e) {
                        this._children[t] = e
                    }
                }]),
                    t
            }()
                , s = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
                , c = [1, 2, 2, 2, 2, 2]
                , l = function () {
                function e(t) {
                    i(this, e),
                        this._random = new o.default,
                        this._sign = "",
                        this._inter = {},
                        this._head = new f
                }

                return n(e, [{
                    key: "init",
                    value: function (t) {
                        var e = this;
                        this._random.seed(t),
                            this._sign = t,
                            u.default.loop(64, function (t) {
                                e._addSymbol("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[t], c[parseInt((t + 1) / 11)])
                            }),
                            this._inter["="] = "="
                    }
                }, {
                    key: "_addSymbol",
                    value: function (t, e) {
                        var r = this
                            , n = this._head
                            , o = "";
                        return u.default.loop(e, function (t) {
                            for (var e = s[r._random.generate(32)]; e in n.getChildren() && "." !== n.getChildren()[e].getChar();)
                                e = s[r._random.generate(32)];
                            o += e,
                            e in n.getChildren() || n.setChildren(e, new f),
                                n = n.getChildren()[e]
                        }),
                            n.setChar(t),
                            this._inter[t] = o
                    }
                }, {
                    key: "decode",
                    value: function (t) {
                        for (var e = "", r = 4; r < t.length;)
                            if ("=" !== t[r]) {
                                for (var n = this._head; t[r] in n.getChildren();)
                                    n = n.getChildren()[t[r]],
                                        r++;
                                e += n.getChar()
                            } else
                                e += "=",
                                    r++;
                        return e
                    }
                }]),
                    e
            }();
            e.default = l
        }
        , function (module, exports, __webpack_require__) {
            var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__, ya, za;
            ya = "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : this,
                za = function (global) {
                    "use strict";
                    global = global || {};
                    var _Base64 = global.Base64, version = "2.5.1", buffer;
                    if (void 0 !== module && module.exports)
                        try {
                            buffer = eval("require('buffer').Buffer")
                        } catch (t) {
                            buffer = void 0
                        }
                    var b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
                        , b64tab = function (t) {
                            for (var e = {}, r = 0, n = t.length; r < n; r++)
                                e[t.charAt(r)] = r;
                            return e
                        }(b64chars)
                        , fromCharCode = String.fromCharCode
                        , cb_utob = function (t) {
                            if (t.length < 2)
                                return (e = t.charCodeAt(0)) < 128 ? t : e < 2048 ? fromCharCode(192 | e >>> 6) + fromCharCode(128 | 63 & e) : fromCharCode(224 | e >>> 12 & 15) + fromCharCode(128 | e >>> 6 & 63) + fromCharCode(128 | 63 & e);
                            var e = 65536 + 1024 * (t.charCodeAt(0) - 55296) + (t.charCodeAt(1) - 56320);
                            return fromCharCode(240 | e >>> 18 & 7) + fromCharCode(128 | e >>> 12 & 63) + fromCharCode(128 | e >>> 6 & 63) + fromCharCode(128 | 63 & e)
                        }
                        , re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g
                        , utob = function (t) {
                            return t.replace(re_utob, cb_utob)
                        }
                        , cb_encode = function (t) {
                            var e = [0, 2, 1][t.length % 3]
                                ,
                                r = t.charCodeAt(0) << 16 | (1 < t.length ? t.charCodeAt(1) : 0) << 8 | (2 < t.length ? t.charCodeAt(2) : 0);
                            return [b64chars.charAt(r >>> 18), b64chars.charAt(r >>> 12 & 63), 2 <= e ? "=" : b64chars.charAt(r >>> 6 & 63), 1 <= e ? "=" : b64chars.charAt(63 & r)].join("")
                        }
                        , btoa = global.btoa ? function (t) {
                                return global.btoa(t)
                            }
                            : function (t) {
                                return t.replace(/[\s\S]{1,3}/g, cb_encode)
                            }
                        ,
                        _encode = buffer ? buffer.from && Uint8Array && buffer.from !== Uint8Array.from ? function (t) {
                                    return (t.constructor === buffer.constructor ? t : buffer.from(t)).toString("base64")
                                }
                                : function (t) {
                                    return (t.constructor === buffer.constructor ? t : new buffer(t)).toString("base64")
                                }
                            : function (t) {
                                return btoa(utob(t))
                            }
                        , encode = function (t, e) {
                            return e ? _encode(String(t)).replace(/[+\/]/g, function (t) {
                                return "+" == t ? "-" : "_"
                            }).replace(/=/g, "") : _encode(String(t))
                        }
                        , encodeURI = function (t) {
                            return encode(t, !0)
                        }
                        , re_btou = new RegExp(["[À-ß][-¿]", "[à-ï][-¿]{2}", "[ð-÷][-¿]{3}"].join("|"), "g")
                        , cb_btou = function (t) {
                            switch (t.length) {
                                case 4:
                                    var e = ((7 & t.charCodeAt(0)) << 18 | (63 & t.charCodeAt(1)) << 12 | (63 & t.charCodeAt(2)) << 6 | 63 & t.charCodeAt(3)) - 65536;
                                    return fromCharCode(55296 + (e >>> 10)) + fromCharCode(56320 + (1023 & e));
                                case 3:
                                    return fromCharCode((15 & t.charCodeAt(0)) << 12 | (63 & t.charCodeAt(1)) << 6 | 63 & t.charCodeAt(2));
                                default:
                                    return fromCharCode((31 & t.charCodeAt(0)) << 6 | 63 & t.charCodeAt(1))
                            }
                        }
                        , btou = function (t) {
                            return t.replace(re_btou, cb_btou)
                        }
                        , cb_decode = function (t) {
                            var e = t.length
                                , r = e % 4
                                ,
                                n = (0 < e ? b64tab[t.charAt(0)] << 18 : 0) | (1 < e ? b64tab[t.charAt(1)] << 12 : 0) | (2 < e ? b64tab[t.charAt(2)] << 6 : 0) | (3 < e ? b64tab[t.charAt(3)] : 0)
                                , o = [fromCharCode(n >>> 16), fromCharCode(n >>> 8 & 255), fromCharCode(255 & n)];
                            return o.length -= [0, 0, 2, 1][r],
                                o.join("")
                        }
                        , _atob = global.atob ? function (t) {
                                return global.atob(t)
                            }
                            : function (t) {
                                return t.replace(/\S{1,4}/g, cb_decode)
                            }
                        , atob = function (t) {
                            return _atob(String(t).replace(/[^A-Za-z0-9\+\/]/g, ""))
                        }
                        ,
                        _decode = buffer ? buffer.from && Uint8Array && buffer.from !== Uint8Array.from ? function (t) {
                                    return (t.constructor === buffer.constructor ? t : buffer.from(t, "base64")).toString()
                                }
                                : function (t) {
                                    return (t.constructor === buffer.constructor ? t : new buffer(t, "base64")).toString()
                                }
                            : function (t) {
                                return btou(_atob(t))
                            }
                        , decode = function (t) {
                            return _decode(String(t).replace(/[-_]/g, function (t) {
                                return "-" == t ? "+" : "/"
                            }).replace(/[^A-Za-z0-9\+\/]/g, ""))
                        }
                        , noConflict = function () {
                            var t = global.Base64;
                            return global.Base64 = _Base64,
                                t
                        };
                    if (global.Base64 = {
                        VERSION: version,
                        atob: atob,
                        btoa: btoa,
                        fromBase64: decode,
                        toBase64: encode,
                        utob: utob,
                        encode: encode,
                        encodeURI: encodeURI,
                        btou: btou,
                        decode: decode,
                        noConflict: noConflict,
                        __buffer__: buffer
                    },
                    "function" == typeof Object.defineProperty) {
                        var noEnum = function (t) {
                            return {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        };
                        global.Base64.extendString = function () {
                            Object.defineProperty(String.prototype, "fromBase64", noEnum(function () {
                                return decode(this)
                            })),
                                Object.defineProperty(String.prototype, "toBase64", noEnum(function (t) {
                                    return encode(this, t)
                                })),
                                Object.defineProperty(String.prototype, "toBase64URI", noEnum(function () {
                                    return encode(this, !0)
                                }))
                        }
                    }
                    return global.Meteor && (Base64 = global.Base64),
                        void 0 !== module && module.exports ? module.exports.Base64 = global.Base64 : (__WEBPACK_AMD_DEFINE_ARRAY__ = [],
                            __WEBPACK_AMD_DEFINE_RESULT__ = function () {
                                return global.Base64
                            }
                                .apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
                        void 0 === __WEBPACK_AMD_DEFINE_RESULT__ || (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)),
                        {
                            Base64: global.Base64
                        }
                }
                ,
                module.exports = za(ya)
        }
        , function (t, e, r) {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            });
            var n, o = function () {
                function n(t, e) {
                    for (var r = 0; r < e.length; r++) {
                        var n = e[r];
                        n.enumerable = n.enumerable || !1,
                            n.configurable = !0,
                        "value" in n && (n.writable = !0),
                            Object.defineProperty(t, n.key, n)
                    }
                }

                return function (t, e, r) {
                    return e && n(t.prototype, e),
                    r && n(t, r),
                        t
                }
            }(), u = r(2), a = (n = r(1)) && n.__esModule ? n : {
                default: n
            }, i = function (t) {
                var e = t.charCodeAt();
                return 65 <= e ? e - 65 : e - 65 + 41
            }, f = function () {
                function r() {
                    !function (t, e) {
                        if (!(t instanceof r))
                            throw new TypeError("Cannot call a class as a function")
                    }(this)
                }

                return o(r, null, [{
                    key: "_checkVersion",
                    value: function (t) {
                        return ((32 * i(t[0]) + i(t[1])) * i(t[2]) + i(t[3])) % 32 <= 1
                    }
                }, {
                    key: "d",
                    value: function (t) {
                        if (!this._checkVersion(t))
                            return "";
                        var e = new a.default;
                        e.init(t.substr(0, 4));
                        var r = e.decode(t);
                        return u.Base64.decode(r)
                    }
                }]),
                    r
            }();
            e.default = f,
                t.exports = f
        }
        , function (t, e, r) {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            });
            var n = function () {
                function n(t, e) {
                    for (var r = 0; r < e.length; r++) {
                        var n = e[r];
                        n.enumerable = n.enumerable || !1,
                            n.configurable = !0,
                        "value" in n && (n.writable = !0),
                            Object.defineProperty(t, n.key, n)
                    }
                }

                return function (t, e, r) {
                    return e && n(t.prototype, e),
                    r && n(t, r),
                        t
                }
            }()
                , o = function () {
                function r() {
                    !function (t, e) {
                        if (!(t instanceof r))
                            throw new TypeError("Cannot call a class as a function")
                    }(this)
                }

                return n(r, null, [{
                    key: "get",
                    value: function (t) {
                        return t >>> 0
                    }
                }, {
                    key: "xor",
                    value: function (t, e) {
                        return this.get(this.get(t) ^ this.get(e))
                    }
                }, {
                    key: "and",
                    value: function (t, e) {
                        return this.get(this.get(t) & this.get(e))
                    }
                }, {
                    key: "mul",
                    value: function (t, e) {
                        var r = ((4294901760 & t) >>> 0) * e
                            , n = (65535 & t) * e;
                        return this.get((r >>> 0) + (n >>> 0))
                    }
                }, {
                    key: "or",
                    value: function (t, e) {
                        return this.get(this.get(t) | this.get(e))
                    }
                }, {
                    key: "not",
                    value: function (t) {
                        return this.get(~this.get(t))
                    }
                }, {
                    key: "shiftLeft",
                    value: function (t, e) {
                        return this.get(this.get(t) << e)
                    }
                }, {
                    key: "shiftRight",
                    value: function (t, e) {
                        return this.get(t) >>> e
                    }
                }, {
                    key: "mod",
                    value: function (t, e) {
                        return this.get(this.get(t) % e)
                    }
                }]),
                    r
            }();
            e.default = o
        }
        , function (t, e, r) {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            });
            var n = function () {
                function n(t, e) {
                    for (var r = 0; r < e.length; r++) {
                        var n = e[r];
                        n.enumerable = n.enumerable || !1,
                            n.configurable = !0,
                        "value" in n && (n.writable = !0),
                            Object.defineProperty(t, n.key, n)
                    }
                }

                return function (t, e, r) {
                    return e && n(t.prototype, e),
                    r && n(t, r),
                        t
                }
            }()
                , o = a(r(0))
                , u = a(r(4));

            function a(t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            }

            var i = function () {
                function r() {
                    !function (t, e) {
                        if (!(t instanceof r))
                            throw new TypeError("Cannot call a class as a function")
                    }(this),
                        this._status = [],
                        this._mat1 = 0,
                        this._mat2 = 0,
                        this._tmat = 0
                }

                return n(r, [{
                    key: "seed",
                    value: function (e) {
                        var r = this;
                        o.default.loop(4, function (t) {
                            e.length > t ? r._status[t] = u.default.get(e.charAt(t).charCodeAt()) : r._status[t] = u.default.get(110)
                        }),
                            this._mat1 = this._status[1],
                            this._mat2 = this._status[2],
                            this._tmat = this._status[3],
                            this._init()
                    }
                }, {
                    key: "_init",
                    value: function () {
                        var e = this;
                        o.default.loop(7, function (t) {
                            e._status[t + 1 & 3] = u.default.xor(e._status[t + 1 & 3], t + 1 + u.default.mul(1812433253, u.default.xor(e._status[3 & t], u.default.shiftRight(e._status[3 & t], 30))))
                        }),
                        0 == (2147483647 & this._status[0]) && 0 === this._status[1] && 0 === this._status[2] && 0 === this._status[3] && (this._status[0] = 66,
                            this._status[1] = 65,
                            this._status[2] = 89,
                            this._status[3] = 83),
                            o.default.loop(8, function () {
                                return e._next_state()
                            })
                    }
                }, {
                    key: "_next_state",
                    value: function () {
                        var t = void 0
                            , e = void 0;
                        e = this._status[3],
                            t = u.default.xor(u.default.and(this._status[0], 2147483647), u.default.xor(this._status[1], this._status[2])),
                            t = u.default.xor(t, u.default.shiftLeft(t, 1)),
                            e = u.default.xor(e, u.default.xor(u.default.shiftRight(e, 1), t)),
                            this._status[0] = this._status[1],
                            this._status[1] = this._status[2],
                            this._status[2] = u.default.xor(t, u.default.shiftLeft(e, 10)),
                            this._status[3] = e,
                            this._status[1] = u.default.xor(this._status[1], u.default.and(-u.default.and(e, 1), this._mat1)),
                            this._status[2] = u.default.xor(this._status[2], u.default.and(-u.default.and(e, 1), this._mat2))
                    }
                }, {
                    key: "generate",
                    value: function (t) {
                        this._next_state();
                        var e, r = void 0;
                        return r = this._status[3],
                            e = u.default.xor(this._status[0], u.default.shiftRight(this._status[2], 8)),
                            r = u.default.xor(r, e),
                        (r = u.default.xor(u.default.and(-u.default.and(e, 1), this._tmat), r)) % t
                    }
                }]),
                    r
            }();
            e.default = i
        }
    ])).d(str);
}