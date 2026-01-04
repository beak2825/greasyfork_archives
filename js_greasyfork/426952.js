// ==UserScript==
// @name            百度网盘视频播放尊享 VIP | 解锁视频倍数 | 解锁全部清晰度
// @namespace       https://timer.palerock.cn
// @version         0.1.1
// @description     使用该脚本进入百度网盘视频播放页面，自动解锁 VIP 限制，可以使用 VIP 的绝大多数功能
// @include         https://pan.baidu.com/play/video*
// @include         https://pan.baidu.com/s/*
// @include         https://pan.baidu.com/mbox/*
// @include         https://timer.palerock.cn/configuration*
// @author          Cangshi
// @run-at          document-start
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/426952/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%B0%8A%E4%BA%AB%20VIP%20%7C%20%E8%A7%A3%E9%94%81%E8%A7%86%E9%A2%91%E5%80%8D%E6%95%B0%20%7C%20%E8%A7%A3%E9%94%81%E5%85%A8%E9%83%A8%E6%B8%85%E6%99%B0%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/426952/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%B0%8A%E4%BA%AB%20VIP%20%7C%20%E8%A7%A3%E9%94%81%E8%A7%86%E9%A2%91%E5%80%8D%E6%95%B0%20%7C%20%E8%A7%A3%E9%94%81%E5%85%A8%E9%83%A8%E6%B8%85%E6%99%B0%E5%BA%A6.meta.js
// ==/UserScript==

!function(e, t) {
    'object' == typeof exports && 'undefined' != typeof module ? t(exports) : 'function' == typeof define && define.amd ? define(['exports'], t) : t((e = 'undefined' != typeof globalThis ? globalThis : e || self).$hookBaiduPanVideo = {})
}(this, (function(e) {
    'use strict'

    function t(e, t) {
        if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function')
    }

    function n(e, t) {
        for (var n = 0; n < t.length; n++) {
            var o = t[n]
            o.enumerable = o.enumerable || !1, o.configurable = !0, 'value' in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
        }
    }

    function o(e, t, o) {
        return t && n(e.prototype, t), o && n(e, o), e
    }

    function i(e) {
        if (void 0 === e) throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')
        return e
    }

    function r(e) {
        return (r = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
            return e.__proto__ || Object.getPrototypeOf(e)
        })(e)
    }

    function u(e, t, n) {
        return (u = 'undefined' != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
            var o = function(e, t) {
                for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = r(e));)
                return e
            }(e, t)
            if (o) {
                var i = Object.getOwnPropertyDescriptor(o, t)
                return i.get ? i.get.call(n) : i.value
            }
        })(e, t, n || e)
    }

    function a(e, t) {
        return (a = Object.setPrototypeOf || function(e, t) {
            return e.__proto__ = t, e
        })(e, t)
    }

    function c(e) {
        return (c = 'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : typeof e
        })(e)
    }

    function f(e, t) {
        return !t || 'object' !== c(t) && 'function' != typeof t ? i(e) : t
    }

    function l(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n, enumerable: !0, configurable: !0, writable: !0
        }) : e[t] = n, e
    }

    var s, p

    function y() {
        return null == p && (p = 'undefined' == typeof unsafeWindow ? window : unsafeWindow), p
    }

    function d() {
        var e = y().parent !== y()
        try {
            e = e && 'FRAMESET' !== y().parent.document.body.tagName
        } catch (e) {
        }
        return e
    }

    !function(e) {
        e.BOOLEAN = 'boolean', e.STRING = 'string', e.NUMBER = 'number', e.SHORTCUT = 'shortcut', e.LONG_STRING = 'long_string', e.DATE = 'date', e.COLOR = 'color', e.ARRAY = 'array', e.PICKLIST = 'picklist', e.DUELING_PICKLIST = 'dueling_picklist'
    }(s || (s = {}))
    var h = '__hooks_load_module', v = '___hooks_preModules'
    var g = function() {
        if (!d()) {
            for (var e, t = arguments.length, n = new Array(t), o = 0; o < t; o++) n[o] = arguments[o]
            n.unshift('[TimerHook]'), (e = console).warn.apply(e, n)
        }
    }, b = function() {
        function e() {
            t(this, e), l(this, 'host', void 0), l(this, 'isActive', !1), l(this, 'isMountHost', !1)
        }

        return o(e, [{
            key: 'mountHost', value: function(e) {
                this.host = e, this.isMountHost = !0, this.onMounted()
            }
        }, {
            key: 'activate', value: function() {
                this.isActive = !0, this.init()
            }
        }, {
            key: 'deactivate', value: function() {
                this.isActive = !1, this.onDestroy()
            }
        }, {
            key: 'moduleName', get: function() {
            }
        }, {
            key: 'priority', get: function() {
                return 50
            }
        }, {
            key: 'autoActivate', get: function() {
                return !0
            }
        }, {
            key: 'isCoreModule', get: function() {
                return !1
            }
        }, {
            key: 'isOnlyOuterIframe', get: function() {
                return !1
            }
        }, {
            key: 'getDependencyModule', value: function(e) {
                if (null != this.host) {
                    var t = this.host.getModule(e)
                    return t && t.moduleIdentityName ? t : void 0
                }
            }
        }, {
            key: 'init', value: function() {
            }
        }, {
            key: 'onMounted', value: function() {
            }
        }, {
            key: 'onDestroy', value: function() {
            }
        }, {
            key: 'declareConfigs', value: function() {
                return []
            }
        }, {
            key: 'setConfig', value: function(e, t) {
                var n = this.getDependencyModule('configs')
                n && n.available() || g('Config module not found, can\'t set configs values.'), n.setValue(this.moduleIdentityName, e, t)
            }
        }, {
            key: 'getConfig', value: function(e) {
                var t, n = this.getDependencyModule('configs'), o = (this.declareConfigs().find((function(t) {
                    return t.key === e
                })) || {}).default
                return n && n.available() && null !== (t = n.getValue(this.moduleIdentityName, e)) && void 0 !== t ? t : o
            }
        }, {
            key: 'window', get: function() {
                return this.host ? this.host.getWindow() : y()
            }
        }, {
            key: 'document', get: function() {
                return this.window.document
            }
        }]), e
    }()

    function k(e) {
        var t = function() {
            if ('undefined' == typeof Reflect || !Reflect.construct) return !1
            if (Reflect.construct.sham) return !1
            if ('function' == typeof Proxy) return !0
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {
                }))), !0
            } catch (e) {
                return !1
            }
        }()
        return function() {
            var n, o = r(e)
            if (t) {
                var i = r(this).constructor
                n = Reflect.construct(o, arguments, i)
            } else n = o.apply(this, arguments)
            return f(this, n)
        }
    }

    var m = ['loc', 'als'].join(''), O = ['locals', 'back'].join('_'), w = new (function(e) {
        !function(e, t) {
            if ('function' != typeof t && null !== t) throw new TypeError('Super expression must either be null or a function')
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e, writable: !0, configurable: !0
                }
            }), t && a(e, t)
        }(c, e)
        var n = k(c)

        function c() {
            var e
            t(this, c)
            for (var o = arguments.length, r = new Array(o), u = 0; u < o; u++) r[u] = arguments[u]
            return l(i(e = n.call.apply(n, [this].concat(r))), 'hasInit', !1), e
        }

        return o(c, [{
            key: 'moduleIdentityName', get: function() {
                return 'baiduPanVideo'
            }
        }, {
            key: 'moduleName', get: function() {
                return '百度网盘视频 VIP'
            }
        }, {
            key: 'init', value: function() {
                u(r(c.prototype), 'init', this).call(this), this.hasInit || (this.applyVipRoles(), this.hasInit = !0)
            }
        }, {
            key: 'priority', get: function() {
                return 0
            }
        }, {
            key: 'getConfigMapper', value: function(e) {
                var t = this
                return e.reduce((function(e, n) {
                    return e[n] = t.getConfig(n), e
                }), {})
            }
        }, {
            key: 'getterMapper', get: function() {
                return this.getConfigMapper(['hitvideosample'])
            }
        }, {
            key: 'setterMapper', get: function() {
                return this.getConfigMapper(['is_vip', 'is_svip', 'is_evip', 'show_vip_ad', 'vip_level'])
            }
        }, {
            key: 'applyVipRoles', value: function() {
                var e = this.window, t = this.getterMapper, n = this.setterMapper
                Object.defineProperty(e, m, {
                    get: function() {
                        var n = e[O].get
                        return e[O].get = function() {
                            var e = Array.prototype.slice.call(arguments)
                            if (e.length > 1) {
                                var o = e[e.length - 1]
                                e[e.length - 1] = function() {
                                    var n = Array.prototype.slice.call(arguments)
                                    return n.forEach((function(o, i) {
                                        e[i] in t && (n[i] = t[e[i]])
                                    })), o.apply(this, n)
                                }
                            } else if (e[0] in t) return t[e[0]]
                            return n.apply(this, e)
                        }, e[O]
                    }, set: function(t) {
                        e[O] = t
                        var o = e[O].set
                        e[O].set = function() {
                            var e = Object.keys(n)
                            return e.includes(arguments[0]) && (arguments[1] = n[arguments[0]]), o.apply(this, arguments)
                        }
                    }
                })
            }
        }, {
            key: 'declareConfigs', value: function() {
                return [{ key: 'is_vip', default: !0, type: s.BOOLEAN, title: '普通 VIP' }, {
                    key: 'is_svip', default: !0, type: s.BOOLEAN, title: '超级 VIP'
                }, { key: 'is_evip', default: !0, type: s.BOOLEAN, title: '临时 VIP' }, {
                    key: 'show_vip_ad', default: !0, type: s.BOOLEAN, title: '播放 VIP 广告'
                }, { key: 'hitvideosample', default: !0, type: s.BOOLEAN, title: '使用 VIP 播放器' }, {
                    key: 'vip_level', default: 7, type: s.NUMBER, title: '用户 VIP 等级'
                }]
            }
        }]), c
    }(b))
    !function(e) {
        y()[h] ? y().dispatchEvent(new CustomEvent(h, { detail: e })) : (window[v] = window[v] || [], window[v].push(e))
    }(w), w.init(), e.baiduPanVideo = w, Object.defineProperty(e, '__esModule', { value: !0 })
}))
