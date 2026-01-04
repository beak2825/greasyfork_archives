// ==UserScript==
// @name         姐夫爱问答助手
// @namespace    aiask/askHelper
// @version      0.001
// @author       aiask
// @description  全平台问答助手，一键获取整个页面的试题答案，目前支持【超星学习通、知到智慧树、国家开放大学、广东开放大学、江苏开放大学、上海开放大学、云南开放大学、芯位教育、云慕学苑、职教云、川农在线、长江雨课堂(半兼容)、安徽继续教育平台、青书学堂、睿学在线、成教云、京人平台、绎通继教云、学起Plus、云上河开、河南继续教育、四川开放大学、良师在线、继教云、日照专业技术人员继续教育、麦能网、21tb、168网校、云班课、电大中专、learnin、西财在线】，更多平台开发中...
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAHVQTFRFR3BMgICBQD8/QUVHQ0ZIRUhKX2FiQD8/Tk1NP0VJPzs7Pz8/QD4+UE9QQD8/PVlnQD8/M6vj////n5+fN5C60NDQSl9qOXWSZL/qTFNXzOr4QWl8yMjItLS02traOIOnNZzN6OfnlJeZ9/f3PYGgpdrzmdXxgSBJqQAAABB0Uk5TAP5E6vys+7/Q0RhsfPFV/OwFarYAAAEESURBVHjapdHrboMgGIBhUHBaD/sAlTE8VOt2/5c4GlBMRZOl7w8j+kQQ0FaVwbG48IDq+piMPcgkO1bD/8DXvhD4/fb9ePDuGiqa2krV7pO1AxSLYIl2ABoeTLSvYMBi4N0sphOAlVaqg1aTPggmZYYaFvNMBYGQz6G6m2vbhEBvF81MxALFTDpbQQd3ZhvBgxqiFfBEO/CJ7ZxkNPcUbWBwn5DJw4KSsJHcHPCTLLDuQxpLkiMLbAIWJs1wBRVkyAFXT7Sa+AYQjTywNfOD74DNA18I9Ifjpg7Es/3Jj5eKyIEcBgNwhk5L8XMPonMQQcfNhBfRpIfbFbiRskCX5enFyz/07TSN9vGxKwAAAABJRU5ErkJggg==
// @match        *://*.chaoxing.com/*
// @match        *://*.exam.lntvu.com/*
// @match        *://*.hlju.edu.cn/*
// @match        *://lms.ouchn.cn/*
// @match        *://*.ouchn.cn/*
// @match        *://xczxzdbf.moodle.qwbx.ouchn.cn/*
// @match        *://study.ouchn.cn/*
// @match        *://moodle.syxy.ouchn.cn/*
// @match        *://moodle.qwbx.ouchn.cn/*
// @match        *://chatglm.cn/*
// @match        *://xinghuo.xfyun.cn/*
// @match        *://chat.deepseek.com/*
// @match        *://*.zhihuishu.com/*
// @match        *://course.ougd.cn/*
// @match        *://elearning.bjou.edu.cn/*
// @match        *://whkpc.hnqtyq.cn:5678/*
// @match        *://www.51xinwei.com/*
// @match        *://*.w-ling.cn/*
// @match        *://*.edu-edu.com/*
// @match        *://xuexi.jsou.cn/*
// @match        *://spoc-exam.icve.com.cn/*
// @match        *://*.icve.com.cn/*
// @match        *://zice.cnzx.info/*
// @match        *://any.cnzx.info:81/*
// @match        *://www.icourse163.org/*
// @match        *://*.yuketang.cn/*
// @match        *://*.shou.org.cn/*
// @match        *://main.ahjxjy.cn/*
// @match        *://*.chinaedu.net/*
// @match        *://*.qingshuxuetang.com/*
// @match        *://cce.org.uooconline.com/*
// @match        *://*.courshare.cn/*
// @match        *://*.cep.webtrn.cn/*
// @match        *://*.webtrn.cn/*
// @match        *://*.cj-edu.com/*
// @match        *://*.ytccr.com/*
// @match        *://*.exam-cloud.cn/*
// @match        *://gdrtvu.exam-cloud.cn/*
// @match        *://*.open.ha.cn/*
// @match        *://lhycjy.cloudwis.tech/*
// @match        *://*.sclecb.cn/*
// @match        *://*.web2.superchutou.com/*
// @match        *://*.ls365.net/*
// @match        *://*.jijiaox.com/*
// @match        *://*.wencaischool.net/*
// @match        *://sdrz.gxk.yxlearning.com/*
// @match        *://*.crjxjy.net/*
// @match        *://*.cjnep.net/*
// @match        *://*.91huayi.com/*
// @match        *://teach.ynou.edu.cn/*
// @match        *://*.edu-edu.com.cn/*
// @match        *://*.21tb.com/*
// @match        *://*.168wangxiao.com/*
// @match        *://*.mynep.com/*
// @match        *://www.mosoteach.cn/*
// @match        *://*.aufe.edu.cn/*
// @match        *://*.learnin.com.cn/*
// @match        *://*.ouchn.edu.cn/*
// @match        *://*.swufe-online.com/*
// @match        *://ks.cqsdx.cn/*
// @match        *://*.qau.edu.cn/*
// @match        *://*.gdufemooc.cn/*
// @match        *://*.telfri-edu.com/*
// @match        *://www.beeline-ai.com/*
// @match        *://*.wxic.edu.cn/*
// @match        *://*.yxbyun.com/*
// @match        *://*.wdjycj.com/*
// @match        *://*.hbcjpt.com/*
// @require      https://lib.baomitu.com/vue/3.4.27/vue.global.min.js
// @require      https://lib.baomitu.com/vue-demi/0.14.6/index.iife.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://lib.baomitu.com/element-plus/2.8.2/index.full.min.js
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-10-y/jquery/3.6.0/jquery.min.js
// @require      https://lib.baomitu.com/markdown-it/13.0.1/markdown-it.min.js
// @require      https://lib.baomitu.com/dompurify/3.1.6/purify.min.js
// @require      https://lib.baomitu.com/crypto-js/4.2.0/crypto-js.min.js
// @resource     ElementPlus       https://lib.baomitu.com/element-plus/2.8.2/index.min.css
// @resource     ElementPlusStyle  https://lib.baomitu.com/element-plus/2.8.2/index.min.css
// @connect      127.0.0.1
// @connect      icodef.com
// @connect      muketool.com
// @connect      wk66.top
// @connect      82.157.105.20
// @connect      zhihuishu.com
// @connect      yuketang.cn
// @connect      greasyfork.org
// @connect      chaoxing.com
// @connect      shou.org.cn
// @connect      jsdelivr.net
// @connect      jsdmirror.cn
// @connect      gitee.com
// @connect      vxo.im
// @connect      zeroai.chat
// @connect      forestpolice.org
// @connect      *
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521171/%E5%A7%90%E5%A4%AB%E7%88%B1%E9%97%AE%E7%AD%94%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521171/%E5%A7%90%E5%A4%AB%E7%88%B1%E9%97%AE%E7%AD%94%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// hello
 
(function (vue, I, P, D, z, B) {
    'use strict';
 
    var e = Object.defineProperty;
 
    let G;
 
    const setActivePinia = e => G = e, V = Symbol();
 
    function isPlainObject(e) {
        return e && "object" == typeof e && "[object Object]" === Object.prototype.toString.call(e) && "function" != typeof e.toJSON;
    }
 
    var N, R;
 
    (R = N || (N = {})).direct = "direct", R.patchObject = "patch object", R.patchFunction = "patch function";
 
    const noop = () => {};
 
    function addSubscription(e, t, n, a = noop) {
        e.push(t);
        const removeSubscription = () => {
            const n = e.indexOf(t);
            n > -1 && (e.splice(n, 1), a());
        };
        return !n && vue.getCurrentScope() && vue.onScopeDispose(removeSubscription), removeSubscription;
    }
 
    function triggerSubscriptions(e, ...t) {
        e.slice().forEach((e => {
            e(...t);
        }));
    }
 
    const fallbackRunWithContext = e => e(), W = Symbol(), Q = Symbol();
 
    function mergeReactiveObjects(e, t) {
        e instanceof Map && t instanceof Map ? t.forEach(((t, n) => e.set(n, t))) : e instanceof Set && t instanceof Set && t.forEach(e.add, e);
        for (const n in t) {
            if (!t.hasOwnProperty(n)) continue;
            const a = t[n], s = e[n];
            isPlainObject(s) && isPlainObject(a) && e.hasOwnProperty(n) && !vue.isRef(a) && !vue.isReactive(a) ? e[n] = mergeReactiveObjects(s, a) : e[n] = a;
        }
        return e;
    }
 
    const J = Symbol();
 
    const {assign: X} = Object;
 
    function createSetupStore(e, a, s = {}, o, p, h) {
        let m;
        const f = X({
            actions: {}
        }, s), y = {
            deep: !0
        };
        let g, w, v, b = [], k = [];
        const x = o.state.value[e];
        let _;
        function $patch(t) {
            let n;
            g = w = !1, "function" == typeof t ? (t(o.state.value[e]), n = {
                type: N.patchFunction,
                storeId: e,
                events: v
            }) : (mergeReactiveObjects(o.state.value[e], t), n = {
                type: N.patchObject,
                payload: t,
                storeId: e,
                events: v
            });
            const a = _ = Symbol();
            vue.nextTick().then((() => {
                _ === a && (g = !0);
            })), w = !0, triggerSubscriptions(b, n, o.state.value[e]);
        }
        h || x || (o.state.value[e] = {}), vue.ref({});
        const q = h ? function() {
            const {state: e} = s, t = e ? e() : {};
            this.$patch((e => {
                X(e, t);
            }));
        } : noop;
        const action = (t, n = "") => {
            if (W in t) return t[Q] = n, t;
            const wrappedAction = function() {
                setActivePinia(o);
                const n = Array.from(arguments), a = [], s = [];
                let i;
                triggerSubscriptions(k, {
                    args: n,
                    name: wrappedAction[Q],
                    store: T,
                    after: function(e) {
                        a.push(e);
                    },
                    onError: function(e) {
                        s.push(e);
                    }
                });
                try {
                    i = t.apply(this && this.$id === e ? this : T, n);
                } catch (r) {
                    throw triggerSubscriptions(s, r), r;
                }
                return i instanceof Promise ? i.then((e => (triggerSubscriptions(a, e), e))).catch((e => (triggerSubscriptions(s, e), 
                Promise.reject(e)))) : (triggerSubscriptions(a, i), i);
            };
            return wrappedAction[W] = !0, wrappedAction[Q] = n, wrappedAction;
        }, C = {
            _p: o,
            $id: e,
            $onAction: addSubscription.bind(null, k),
            $patch: $patch,
            $reset: q,
            $subscribe(t, n = {}) {
                const a = addSubscription(b, t, n.detached, (() => s())), s = m.run((() => vue.watch((() => o.state.value[e]), (a => {
                    ("sync" === n.flush ? w : g) && t({
                        storeId: e,
                        type: N.direct,
                        events: v
                    }, a);
                }), X({}, y, n))));
                return a;
            },
            $dispose: function() {
                m.stop(), b = [], k = [], o._s.delete(e);
            }
        }, T = vue.reactive(C);
        o._s.set(e, T);
        const A = (o._a && o._a.runWithContext || fallbackRunWithContext)((() => o._e.run((() => (m = vue.effectScope()).run((() => a({
            action: action
        })))))));
        for (const t in A) {
            const n = A[t];
            if (vue.isRef(n) && (!vue.isRef(U = n) || !U.effect) || vue.isReactive(n)) h || (!x || isPlainObject(S = n) && S.hasOwnProperty(J) || (vue.isRef(n) ? n.value = x[t] : mergeReactiveObjects(n, x[t])), 
            o.state.value[e][t] = n); else if ("function" == typeof n) {
                const e = action(n, t);
                A[t] = e, f.actions[t] = n;
            }
        }
        var S, U;
        return X(T, A), X(vue.toRaw(T), A), Object.defineProperty(T, "$state", {
            get: () => o.state.value[e],
            set: e => {
                $patch((t => {
                    X(t, e);
                }));
            }
        }), o._p.forEach((e => {
            X(T, m.run((() => e({
                store: T,
                app: o._a,
                pinia: o,
                options: f
            }))));
        })), x && h && s.hydrate && s.hydrate(T.$state, x), g = !0, w = !0, T;
    }
 
    function defineStore(e, t, n) {
        let i, r;
        const l = "function" == typeof t;
        function useStore(e, n) {
            const c = vue.hasInjectionContext();
            (e = e || (c ? vue.inject(V, null) : null)) && setActivePinia(e), (e = G)._s.has(i) || (l ? createSetupStore(i, t, r, e) : function(e, t, n) {
                const {state: s, actions: o, getters: i} = t, r = n.state.value[e];
                createSetupStore(e, (function() {
                    r || (n.state.value[e] = s ? s() : {});
                    const t = vue.toRefs(n.state.value[e]);
                    return X(t, o, Object.keys(i || {}).reduce(((t, s) => (t[s] = vue.markRaw(vue.computed((() => {
                        setActivePinia(n);
                        const t = n._s.get(e);
                        return i[s].call(t, t);
                    }))), t)), {}));
                }), t, n, 0, !0);
            }(i, r, e));
            return e._s.get(i);
        }
        return "string" == typeof e ? (i = e, r = l ? n : t) : (r = e, i = e.id), useStore.$id = i, 
        useStore;
    }
 
    var Z = (() => "undefined" != typeof GM_deleteValue ? GM_deleteValue : void 0)(), Y = (() => "undefined" != typeof GM_getResourceText ? GM_getResourceText : void 0)(), K = (() => "undefined" != typeof GM_getValue ? GM_getValue : void 0)(), ee = (() => "undefined" != typeof GM_info ? GM_info : void 0)(), te = (() => "undefined" != typeof GM_listValues ? GM_listValues : void 0)(), ne = (() => "undefined" != typeof GM_setValue ? GM_setValue : void 0)(), ae = (() => "undefined" != typeof GM_xmlhttpRequest ? GM_xmlhttpRequest : void 0)(), se = (() => "undefined" != typeof unsafeWindow ? unsafeWindow : void 0)();
 
    const oe = "AiAsk_";
 
    class Cache {
        static set(e, t, n = 0) {
            e = oe + e;
            const a = {
                value: t,
                expire: n > 0 ? Date.now() + 1e3 * n : 0
            };
            return ne(e, a), K(e);
        }
        static get(e, t = null) {
            const n = K(e = oe + e);
            return n && n.expire && n.expire < Date.now() ? (Z(e), t) : n ? n.value : t;
        }
        static match(e) {
            return e = oe + e, te().filter((t => t.startsWith(e)));
        }
        static matchGet(e) {
            const t = oe + e;
            let n = te().filter((e => e.startsWith(t))).map((e => {
                const t = K(e, {
                    value: null,
                    expire: 0
                }).value;
                return t && (t.key = e.replace(oe, "")), t;
            })).filter((e => null !== e));
            return n.sort(((e, t) => (t.createTime || 0) - (e.createTime || 0))), n;
        }
        static remove(e) {
            Z(oe + e);
        }
        static clear() {
            te().filter((e => e.startsWith(oe))).forEach(Z);
        }
        static matchRemove(e) {
            e = oe + e, te().filter((t => t.startsWith(e))).forEach(Z);
        }
    }
 
    function getDefaultExportFromCjs(e) {
        return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
    }
 
    var ie, re, le = {
        exports: {}
    }, ce = {
        exports: {}
    };
 
    ie = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", re = {
        rotl: function(e, t) {
            return e << t | e >>> 32 - t;
        },
        rotr: function(e, t) {
            return e << 32 - t | e >>> t;
        },
        endian: function(e) {
            if (e.constructor == Number) return 16711935 & re.rotl(e, 8) | 4278255360 & re.rotl(e, 24);
            for (var t = 0; t < e.length; t++) e[t] = re.endian(e[t]);
            return e;
        },
        randomBytes: function(e) {
            for (var t = []; e > 0; e--) t.push(Math.floor(256 * Math.random()));
            return t;
        },
        bytesToWords: function(e) {
            for (var t = [], n = 0, a = 0; n < e.length; n++, a += 8) t[a >>> 5] |= e[n] << 24 - a % 32;
            return t;
        },
        wordsToBytes: function(e) {
            for (var t = [], n = 0; n < 32 * e.length; n += 8) t.push(e[n >>> 5] >>> 24 - n % 32 & 255);
            return t;
        },
        bytesToHex: function(e) {
            for (var t = [], n = 0; n < e.length; n++) t.push((e[n] >>> 4).toString(16)), t.push((15 & e[n]).toString(16));
            return t.join("");
        },
        hexToBytes: function(e) {
            for (var t = [], n = 0; n < e.length; n += 2) t.push(parseInt(e.substr(n, 2), 16));
            return t;
        },
        bytesToBase64: function(e) {
            for (var t = [], n = 0; n < e.length; n += 3) for (var a = e[n] << 16 | e[n + 1] << 8 | e[n + 2], s = 0; s < 4; s++) 8 * n + 6 * s <= 8 * e.length ? t.push(ie.charAt(a >>> 6 * (3 - s) & 63)) : t.push("=");
            return t.join("");
        },
        base64ToBytes: function(e) {
            e = e.replace(/[^A-Z0-9+\/]/gi, "");
            for (var t = [], n = 0, a = 0; n < e.length; a = ++n % 4) 0 != a && t.push((ie.indexOf(e.charAt(n - 1)) & Math.pow(2, -2 * a + 8) - 1) << 2 * a | ie.indexOf(e.charAt(n)) >>> 6 - 2 * a);
            return t;
        }
    }, ce.exports = re;
 
    var ue, pe, he, de, me, fe = ce.exports, ye = {
        utf8: {
            stringToBytes: function(e) {
                return ye.bin.stringToBytes(unescape(encodeURIComponent(e)));
            },
            bytesToString: function(e) {
                return decodeURIComponent(escape(ye.bin.bytesToString(e)));
            }
        },
        bin: {
            stringToBytes: function(e) {
                for (var t = [], n = 0; n < e.length; n++) t.push(255 & e.charCodeAt(n));
                return t;
            },
            bytesToString: function(e) {
                for (var t = [], n = 0; n < e.length; n++) t.push(String.fromCharCode(e[n]));
                return t.join("");
            }
        }
    }, ge = ye, isBuffer_1 = function(e) {
        return null != e && (isBuffer(e) || function(e) {
            return "function" == typeof e.readFloatLE && "function" == typeof e.slice && isBuffer(e.slice(0, 0));
        }(e) || !!e._isBuffer);
    };
 
    function isBuffer(e) {
        return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);
    }
 
    ue = fe, pe = ge.utf8, he = isBuffer_1, de = ge.bin, (me = function(e, t) {
        e.constructor == String ? e = t && "binary" === t.encoding ? de.stringToBytes(e) : pe.stringToBytes(e) : he(e) ? e = Array.prototype.slice.call(e, 0) : Array.isArray(e) || e.constructor === Uint8Array || (e = e.toString());
        for (var n = ue.bytesToWords(e), a = 8 * e.length, s = 1732584193, o = -271733879, i = -1732584194, r = 271733878, l = 0; l < n.length; l++) n[l] = 16711935 & (n[l] << 8 | n[l] >>> 24) | 4278255360 & (n[l] << 24 | n[l] >>> 8);
        n[a >>> 5] |= 128 << a % 32, n[14 + (a + 64 >>> 9 << 4)] = a;
        var c = me._ff, u = me._gg, p = me._hh, h = me._ii;
        for (l = 0; l < n.length; l += 16) {
            var d = s, m = o, f = i, y = r;
            s = c(s, o, i, r, n[l + 0], 7, -680876936), r = c(r, s, o, i, n[l + 1], 12, -389564586), 
            i = c(i, r, s, o, n[l + 2], 17, 606105819), o = c(o, i, r, s, n[l + 3], 22, -1044525330), 
            s = c(s, o, i, r, n[l + 4], 7, -176418897), r = c(r, s, o, i, n[l + 5], 12, 1200080426), 
            i = c(i, r, s, o, n[l + 6], 17, -1473231341), o = c(o, i, r, s, n[l + 7], 22, -45705983), 
            s = c(s, o, i, r, n[l + 8], 7, 1770035416), r = c(r, s, o, i, n[l + 9], 12, -1958414417), 
            i = c(i, r, s, o, n[l + 10], 17, -42063), o = c(o, i, r, s, n[l + 11], 22, -1990404162), 
            s = c(s, o, i, r, n[l + 12], 7, 1804603682), r = c(r, s, o, i, n[l + 13], 12, -40341101), 
            i = c(i, r, s, o, n[l + 14], 17, -1502002290), s = u(s, o = c(o, i, r, s, n[l + 15], 22, 1236535329), i, r, n[l + 1], 5, -165796510), 
            r = u(r, s, o, i, n[l + 6], 9, -1069501632), i = u(i, r, s, o, n[l + 11], 14, 643717713), 
            o = u(o, i, r, s, n[l + 0], 20, -373897302), s = u(s, o, i, r, n[l + 5], 5, -701558691), 
            r = u(r, s, o, i, n[l + 10], 9, 38016083), i = u(i, r, s, o, n[l + 15], 14, -660478335), 
            o = u(o, i, r, s, n[l + 4], 20, -405537848), s = u(s, o, i, r, n[l + 9], 5, 568446438), 
            r = u(r, s, o, i, n[l + 14], 9, -1019803690), i = u(i, r, s, o, n[l + 3], 14, -187363961), 
            o = u(o, i, r, s, n[l + 8], 20, 1163531501), s = u(s, o, i, r, n[l + 13], 5, -1444681467), 
            r = u(r, s, o, i, n[l + 2], 9, -51403784), i = u(i, r, s, o, n[l + 7], 14, 1735328473), 
            s = p(s, o = u(o, i, r, s, n[l + 12], 20, -1926607734), i, r, n[l + 5], 4, -378558), 
            r = p(r, s, o, i, n[l + 8], 11, -2022574463), i = p(i, r, s, o, n[l + 11], 16, 1839030562), 
            o = p(o, i, r, s, n[l + 14], 23, -35309556), s = p(s, o, i, r, n[l + 1], 4, -1530992060), 
            r = p(r, s, o, i, n[l + 4], 11, 1272893353), i = p(i, r, s, o, n[l + 7], 16, -155497632), 
            o = p(o, i, r, s, n[l + 10], 23, -1094730640), s = p(s, o, i, r, n[l + 13], 4, 681279174), 
            r = p(r, s, o, i, n[l + 0], 11, -358537222), i = p(i, r, s, o, n[l + 3], 16, -722521979), 
            o = p(o, i, r, s, n[l + 6], 23, 76029189), s = p(s, o, i, r, n[l + 9], 4, -640364487), 
            r = p(r, s, o, i, n[l + 12], 11, -421815835), i = p(i, r, s, o, n[l + 15], 16, 530742520), 
            s = h(s, o = p(o, i, r, s, n[l + 2], 23, -995338651), i, r, n[l + 0], 6, -198630844), 
            r = h(r, s, o, i, n[l + 7], 10, 1126891415), i = h(i, r, s, o, n[l + 14], 15, -1416354905), 
            o = h(o, i, r, s, n[l + 5], 21, -57434055), s = h(s, o, i, r, n[l + 12], 6, 1700485571), 
            r = h(r, s, o, i, n[l + 3], 10, -1894986606), i = h(i, r, s, o, n[l + 10], 15, -1051523), 
            o = h(o, i, r, s, n[l + 1], 21, -2054922799), s = h(s, o, i, r, n[l + 8], 6, 1873313359), 
            r = h(r, s, o, i, n[l + 15], 10, -30611744), i = h(i, r, s, o, n[l + 6], 15, -1560198380), 
            o = h(o, i, r, s, n[l + 13], 21, 1309151649), s = h(s, o, i, r, n[l + 4], 6, -145523070), 
            r = h(r, s, o, i, n[l + 11], 10, -1120210379), i = h(i, r, s, o, n[l + 2], 15, 718787259), 
            o = h(o, i, r, s, n[l + 9], 21, -343485551), s = s + d >>> 0, o = o + m >>> 0, i = i + f >>> 0, 
            r = r + y >>> 0;
        }
        return ue.endian([ s, o, i, r ]);
    })._ff = function(e, t, n, a, s, o, i) {
        var r = e + (t & n | ~t & a) + (s >>> 0) + i;
        return (r << o | r >>> 32 - o) + t;
    }, me._gg = function(e, t, n, a, s, o, i) {
        var r = e + (t & a | n & ~a) + (s >>> 0) + i;
        return (r << o | r >>> 32 - o) + t;
    }, me._hh = function(e, t, n, a, s, o, i) {
        var r = e + (t ^ n ^ a) + (s >>> 0) + i;
        return (r << o | r >>> 32 - o) + t;
    }, me._ii = function(e, t, n, a, s, o, i) {
        var r = e + (n ^ (t | ~a)) + (s >>> 0) + i;
        return (r << o | r >>> 32 - o) + t;
    }, me._blocksize = 16, me._digestsize = 16, le.exports = function(e, t) {
        if (null == e) throw new Error("Illegal argument " + e);
        var n = ue.wordsToBytes(me(e, t));
        return t && t.asBytes ? n : t && t.asString ? de.bytesToString(n) : ue.bytesToHex(n);
    };
 
    const we = getDefaultExportFromCjs(le.exports), ve = [ {
        type: "hook",
        name: "\u4e91\u5e55\u5b66\u82d1hook",
        match: location.host.includes("w-ling.cn"),
        main: e => {
            se.mainClass = D("#app")[0].__vue__.$route.path;
            let t = new MutationObserver((async e => {
                se.mainClass !== D("#app")[0].__vue__.$route.path && (se.mainClass = D("#app")[0].__vue__.$route.path, 
                "homework-detail-container" === se.mainClass && await waitUntil((function() {
                    return 0 !== D(".selectDan").length;
                })), vuePageChange$1(), t.disconnect());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "save",
        name: "\u4e91\u5e55\u5b66\u82d1\u6536\u5f55",
        match: () => location.host.includes("w-ling.cn") && location.href.includes("practiceRecord"),
        question: {
            html: ".selectDan >div >div",
            question: ".title",
            options: ".selectItem label .tagbq",
            type: ".question-box .tag",
            workType: "yunmuxueyuan",
            pageType: "yunmuxueyuan"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".selectDan >div >div");
            }));
        },
        answerHook: e => {
            const t = D(e.html).parent().find("h3").text().split("\u3001")[1];
            e.question = e.question.replace(/^\d+\u3001/, ""), e.question = e.question.replace(/\(\d+\u5206\)$/, "");
            let n = D(e.html).find(".anaylize > span:eq(0)").text().replace("\u4f5c\u7b54\u6b63\u786e\uff1a", "");
            switch ("" === n && (n = D(e.html).find(".falsanaly > span:eq(1)").text().replace("\u6b63\u786e\u7b54\u6848\uff1a", "")), 
            t) {
              case "\u5355\u9009\u9898":
              case "\u591a\u9009\u9898":
                let t = n.split("");
                if (e.answer = t.map((t => e.options[t.charCodeAt(0) - 65])), 0 === e.answer.length) return;
                e.answer.length > 1 ? e.type = "1" : e.type = "0";
                break;
 
              case "\u5224\u65ad\u9898":
                e.type = "3", "T" == n && (e.answer = [ "\u6b63\u786e" ]), "F" == n && (e.answer = [ "\u9519\u8bef" ]);
                break;
 
              case "\u586b\u7a7a\u9898":
                e.answer = D(e.html).find(".riganswer > span").first().nextAll("span").map(((e, t) => removeHtml(D(t).text()))).get(), 
                e.type = "2";
            }
            return e;
        }
    }, {
        type: "ask",
        name: "\u4e91\u5e55\u5b66\u82d1",
        tips: "\u4e91\u5e55\u5b66\u82d1\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad\uff0c\u5176\u4ed6\u9898\u578b\u5f85\u9002\u914d",
        match: () => location.host.includes("w-ling.cn") && (location.href.includes("practicePaper") || location.href.includes("examIndex")),
        question: {
            html: ".selectDan >div >div",
            question: ".title",
            options: ".selectItem label .tagbq",
            type: ".question-box .tag",
            workType: "yunmuxueyuan",
            pageType: "yunmuxueyuan"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".selectDan >div >div").length;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            e.question = e.question.replace(/^\d+\u3001/, ""), e.question = e.question.replace(/\(\d+\u5206\)$/, "");
            switch (D(e.html).parent().find("h4").text().split("\u3001")[1]) {
              case "\u5355\u9009\u9898":
                e.type = "0";
                break;
 
              case "\u591a\u9009\u9898":
                e.type = "1";
                break;
 
              case "\u5224\u65ad\u9898":
                e.type = "3", e.$options = D(e.html).find(".selectItem label"), e.options = e.$options.map(((e, t) => removeHtml(D(t).text()))).get(), 
                e.$options;
                break;
 
              case "\u586b\u7a7a\u9898":
                e.type = "2";
            }
            return e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "3":
                break;
 
              case "2":
                return D(e.html).find(".tiankong input").each(((t, n) => {
                    let a = D(n).parent()[0].__vue__;
                    D(n).val(e.answer[t]);
                    const s = new Event("input");
                    n.dispatchEvent(s), a.$emit("change", e.answer[t]);
                })), !1;
            }
            return !0;
        },
        finish: e => {}
    } ];
 
    class Answer {
        constructor() {}
        static score(e, t) {
            let n = Cache.get("api_" + e, {
                score: 0
            });
            n.score += t, Cache.set("api_" + e, n, 600);
        }
        static async getAllAnswers(e) {
            const t = [ this.getAnswer1(e) ];
            return Promise.all(t);
        }
        static async getAnswersFree(e) {
            const t = [ this.getMainAnswer(e), this.getAnswer1(e) ];
            return Promise.all(t);
        }
        static async getAnswer1(e) {
            let t = function() {
                let e = Array.from({
                    length: 4
                }, (() => Math.floor(255 * Math.random()))).join(".");
                return {
                    "X-Forwarded-For": e,
                    "X-Real-IP": e
                };
            }();
            return new Promise((n => {
                request("http://cx.icodef.com/wyn-nb?v=4", "POST", {
                    question: e.question
                }, t).then((e => {
                    let t = e[1];
                    try {
                        e = JSON.parse(e[0].responseText);
                    } catch (s) {
                        n({
                            form: "\u4e00\u4e4b\u9898\u5e93",
                            answer: null,
                            error: s,
                            duration: t
                        });
                    }
                    let a = "";
                    if (1 === e.code) {
                        let t = e.data.replace(/javascript:void\(0\);/g, "").trim().replace(/\n/g, "");
                        [ "\u53db\u9006", "\u516c\u4f17\u53f7", "\u674e\u6052\u96c5", "\u4e00\u4e4b" ].every((e => !t.includes(e))) && (a = t.split("#"));
                    }
                    n({
                        form: "\u4e00\u4e4b\u9898\u5e93",
                        answer: a,
                        duration: t
                    });
                })).catch((e => {
                    "timeout" === e && this.score("icodef", -1), n({
                        form: "\u4e00\u4e4b\u9898\u5e93",
                        answer: "",
                        msg: e,
                        duration: 5e3
                    });
                }));
            }));
        }
        static async getAnswer2(e) {
            return new Promise((t => {
                [ 0, 1, 2 ].includes(parseInt(e.type)) ? request("https://api.muketool.com/cx/v2/query", "POST", {
                    question: e.question,
                    type: parseInt(e.type)
                }, {}).then((e => {
                    let n = e[1];
                    e = JSON.parse(e[0].responseText), t({
                        form: "muketool",
                        answer: 1 === e.code ? e.data.split("#") : "",
                        duration: n
                    });
                })).catch((e => {
                    "timeout" === e && this.score("muketool", -1), t({
                        form: "muketool",
                        answer: ""
                    });
                })) : t({
                    form: "muketool",
                    answer: "",
                    duration: "\u4e0d\u652f\u6301\u7684\u9898\u578b"
                });
            }));
        }
        static getTimestamp() {
            return Math.floor((new Date).getTime() / 1e3);
        }
        static cacheAnswer(e) {
            const t = {
                type: e.type,
                question: e.question,
                options: e.options,
                answer: e.answer
            }, n = questionHash(t.type, t.question, t.options);
            t.createTime = this.getTimestamp(), Cache.set("ques1_" + n, t);
        }
        static async getCacheAnswer(e) {
            const t = questionHash(e.type, e.question, e.options);
            let n = Cache.get("ques1_" + t);
            return n ? {
                form: "\u672c\u5730\u7f13\u5b58",
                answer: n.answer,
                duration: 10
            } : {
                form: "\u672c\u5730\u7f13\u5b58",
                answer: "",
                duration: 10,
                msg: "\u672a\u627e\u5230\u7f13\u5b58"
            };
        }
        static getMainAnswer(e) {
            const t = {
                type: e.type,
                question: e.question,
                options: e.options.map((e => e)),
                html: e.html.innerHTML,
                workType: e.workType,
                pageType: e.pageType
            };
            return new Promise((e => {
                requestApi("https://aiask.wk66.top/api/search", "POST", t, {}).then((t => {
                    let n = t[1];
                    200 === (t = JSON.parse(t[0].responseText)).code ? e({
                        form: "\u7231\u95ee\u7b54\u9898\u5e93",
                        answer: t.data.answer,
                        duration: n,
                        msg: t.msg
                    }) : e({
                        form: "\u7231\u95ee\u7b54\u9898\u5e93",
                        answer: "",
                        duration: n,
                        msg: t.msg
                    });
                })).catch((t => {
                    e({
                        form: "\u7231\u95ee\u7b54\u9898\u5e93",
                        answer: "",
                        error: t,
                        duration: 10,
                        msg: "\u8bf7\u6c42\u5931\u8d25"
                    });
                }));
            }));
        }
        static async syncQuestionList(e) {
            return new Promise((t => {
                requestApi("https://aiask.wk66.top/api/sync", "POST", e, {}).then((e => {
                    e[0].responseText, t(e[0].responseText);
                })).catch((e => {
                    t(e);
                }));
            }));
        }
        static async syncPaper(e) {
            return new Promise((t => {
                requestApi("https://aiask.wk66.top/api/syncPaper", "POST", e, {}).then((e => {
                    e[0].responseText, t(e[0].responseText);
                })).catch((e => {
                    t(e);
                }));
            }));
        }
    }
 
    const defaultSetAnswer = async (e, t, n, a) => {
        var s;
        switch (e) {
          case "xx":
            for (let s = 0; s < n.$options.length; s++) if (t.includes(s)) {
                if (a.ischecked && a.ischecked(n.$options.eq(s))) continue;
                n.$options.eq(s).click(), await sleep(Math.floor(300 * Math.random() + 200));
            } else a.ischecked && a.ischecked(n.$options.eq(s)) && (n.$options.eq(s).click(), 
            await sleep(Math.floor(300 * Math.random() + 200)));
            break;
 
          case "pd":
            let e = t;
            0 == n.options.length ? n.$options.each(((t, n) => {
                isTrue(e) && isTrue(removeHtml(D(n).html())) && D(n).click(), isFalse(e) && isFalse(removeHtml(D(n).html())) && D(n).click();
            })) : n.$options.each(((t, a) => {
                isTrue(e) && isTrue(n.options[t]) && D(a).click(), isFalse(e) && isFalse(n.options[t]) && D(a).click();
            }));
            break;
 
          case "jd":
            D(n.html).find("textarea").each((function(e) {
                se.UE.getEditor(D(this).attr("name")).ready((function() {
                    this.setContent(t[e].replace(/\u7b2c.\u7a7a:/g, ""));
                }));
            })), null == (s = D(n.html).find(".savebtndiv>a")) || s.click();
        }
    }, ApiAnswerMatch = (e, t, n = !1) => {
        const a = getAskStore();
        let s, o = 0, i = !0, r = t.type, l = t.html, c = [], u = [ "", c, t, a.rule ];
        switch (t.$options && "function" == typeof t.$options && (t.$options = t.$options()), 
        r) {
          case "0":
          case "1":
            for (let s = 0; s < e.length; s++) {
                let a = e[s].answer;
                "" == a && (a = []), n && (a = a.replace(/[^a-zA-Z]/g, ""), a = a.split("").map((e => {
                    let n = e.charCodeAt() - 65;
                    return t.options[n];
                })));
                let o = matchAnswer(a, t.options);
                e[s].match = o;
            }
            if (c = e.filter((e => e.match.length > 0)), 0 === c.length) return {
                res: e,
                haveAnswer: !1
            };
            if (c.length > 1) {
                if (!c.every((e => e.match.length === c[0].match.length))) {
                    let e = c[0];
                    for (let t = 1; t < c.length; t++) c[t].match.length > e.match.length && (e = c[t]);
                    c = [ e ];
                }
            }
            let a = c[0].match;
            u[0] = "xx", u[1] = a;
            break;
 
          case "3":
            if (c = e.map((e => {
                let t = e.answer;
                return "object" == typeof t && (t = t[0]), isTrue(t) ? e.answer = "\u6b63\u786e" : isFalse(t) ? e.answer = "\u9519\u8bef" : e.answer = "", 
                e;
            })), c = e.filter((e => "" !== e.answer)), 0 === c.length) return {
                res: e,
                haveAnswer: !1
            };
            u[0] = "pd", u[1] = c[0].answer;
            break;
 
          case "2":
          case "9":
          case "4":
          case "5":
          case "6":
          case "7":
            if (o = D(l).find("textarea").length, 0 === o && (o = t.$options.length), c = e.filter((e => e.answer.length > 0)), 
            0 === c.length) return {
                res: e,
                haveAnswer: !1
            };
            if (s = c[0].answer, "string" == typeof s && (s = [ s ]), 0 !== o && (c = c.filter((e => ("string" == typeof e.answer ? 1 : e.answer.length) === o)), 
            0 === c.length)) return {
                res: e,
                haveAnswer: !1
            };
            u[0] = "jd", u[1] = s;
            break;
 
          case "14":
            if (o = t.$options.length, c = e.filter((e => e.answer.length > 0 && e.answer.length === o)), 
            0 === c.length) return {
                res: e,
                haveAnswer: !1
            };
            if (s = c[0].answer, c = c.filter((e => ("string" == typeof e.answer ? 1 : e.answer.length) === o)), 
            0 === c.length) return {
                res: e,
                haveAnswer: !1
            };
            u[0] = "wxtk", u[1] = s;
            break;
 
          case "11":
            if (c = e.filter((e => "object" == typeof e.answer)), 0 === c.length) return {
                res: e,
                haveAnswer: !1
            };
            s = c[0].answer, u[0] = "lx", u[1] = s;
            break;
 
          default:
            return {
                res: e,
                haveAnswer: !1
            };
        }
        return a.rule.setAnswerHook && "function" == typeof a.rule.setAnswerHook && a.rule.setAnswerHook({
            type: r,
            answer: u[1],
            html: t.html,
            ques: t
        }), a.rule.setAnswer && "function" == typeof a.rule.setAnswer && (i = a.rule.setAnswer({
            type: r,
            answer: u[1],
            html: l,
            ques: t,
            rule: a.rule
        })), i && defaultSetAnswer(u[0], u[1], t, a.rule), {
            res: e,
            form: c ? c[0] : [],
            haveAnswer: !0
        };
    }, be = class _Paper {
        static getPaper(e) {
            return Cache.get(`${_Paper.prefix}_${e}`);
        }
        static setPaper(e, t) {
            if (!e || !t) return;
            const n = _Paper.getPaper(e) || {
                chapter: []
            };
            t.chapter && t.chapter.forEach((e => {
                const t = n.chapter.find((t => t.hash === e.hash));
                t ? (e.question.forEach((e => {
                    const n = t.question.findIndex((t => t.hash === e.hash));
                    -1 !== n ? t.question[n] = e : t.question.push(e);
                })), Object.keys(e).forEach((n => {
                    "question" !== n && (t[n] = e[n]);
                }))) : n.chapter.push(e);
            })), Object.keys(t).forEach((e => {
                "chapter" !== e && (n[e] = t[e]);
            })), Cache.set(`${_Paper.prefix}_${e}`, n), Answer.syncPaper(n);
        }
        static hasChapter(e, t) {
            const n = _Paper.getPaper(e);
            return !(!n || !n.chapter) && n.chapter.some((e => e.hash === t));
        }
    };
 
    var ke;
 
    ((t, n, a) => {
        n in t ? e(t, n, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: a
        }) : t[n] = a;
    })(be, "symbol" != typeof (ke = "prefix") ? ke + "" : ke, "paper_");
 
    let xe = be;
 
    var _e = {
        parse: function(e) {
            var t = _e._bin, n = new Uint8Array(e), a = 0;
            t.readFixed(n, a), a += 4;
            var s = t.readUshort(n, a);
            a += 2, t.readUshort(n, a), a += 2, t.readUshort(n, a), a += 2, t.readUshort(n, a), 
            a += 2;
            for (var o = [ "cmap", "head", "hhea", "maxp", "hmtx", "name", "OS/2", "post", "loca", "glyf", "kern", "CFF ", "GPOS", "GSUB", "SVG " ], i = {
                _data: n
            }, r = {}, l = 0; l < s; l++) {
                var c = t.readASCII(n, a, 4);
                a += 4, t.readUint(n, a), a += 4;
                var u = t.readUint(n, a);
                a += 4;
                var p = t.readUint(n, a);
                a += 4, r[c] = {
                    offset: u,
                    length: p
                };
            }
            for (l = 0; l < o.length; l++) {
                var h = o[l];
                r[h] && (i[h.trim()] = _e[h.trim()].parse(n, r[h].offset, r[h].length, i));
            }
            return i;
        },
        _tabOffset: function(e, t) {
            for (var n = _e._bin, a = n.readUshort(e, 4), s = 12, o = 0; o < a; o++) {
                var i = n.readASCII(e, s, 4);
                s += 4, n.readUint(e, s), s += 4;
                var r = n.readUint(e, s);
                if (s += 4, n.readUint(e, s), s += 4, i == t) return r;
            }
            return 0;
        }
    };
 
    _e._bin = {
        readFixed: function(e, t) {
            return (e[t] << 8 | e[t + 1]) + (e[t + 2] << 8 | e[t + 3]) / 65540;
        },
        readF2dot14: function(e, t) {
            return _e._bin.readShort(e, t) / 16384;
        },
        readInt: function(e, t) {
            var n = _e._bin.t.uint8;
            return n[0] = e[t + 3], n[1] = e[t + 2], n[2] = e[t + 1], n[3] = e[t], _e._bin.t.int32[0];
        },
        readInt8: function(e, t) {
            return _e._bin.t.uint8[0] = e[t], _e._bin.t.int8[0];
        },
        readShort: function(e, t) {
            var n = _e._bin.t.uint8;
            return n[1] = e[t], n[0] = e[t + 1], _e._bin.t.int16[0];
        },
        readUshort: function(e, t) {
            return e[t] << 8 | e[t + 1];
        },
        readUshorts: function(e, t, n) {
            for (var a = [], s = 0; s < n; s++) a.push(_e._bin.readUshort(e, t + 2 * s));
            return a;
        },
        readUint: function(e, t) {
            var n = _e._bin.t.uint8;
            return n[3] = e[t], n[2] = e[t + 1], n[1] = e[t + 2], n[0] = e[t + 3], _e._bin.t.uint32[0];
        },
        readUint64: function(e, t) {
            return 4294967296 * _e._bin.readUint(e, t) + _e._bin.readUint(e, t + 4);
        },
        readASCII: function(e, t, n) {
            for (var a = "", s = 0; s < n; s++) a += String.fromCharCode(e[t + s]);
            return a;
        },
        readUnicode: function(e, t, n) {
            for (var a = "", s = 0; s < n; s++) {
                var o = e[t++] << 8 | e[t++];
                a += String.fromCharCode(o);
            }
            return a;
        },
        _tdec: window.TextDecoder ? new window.TextDecoder : null,
        readUTF8: function(e, t, n) {
            var a = _e._bin._tdec;
            return a && 0 == t && n == e.length ? a.decode(e) : _e._bin.readASCII(e, t, n);
        },
        readBytes: function(e, t, n) {
            for (var a = [], s = 0; s < n; s++) a.push(e[t + s]);
            return a;
        },
        readASCIIArray: function(e, t, n) {
            for (var a = [], s = 0; s < n; s++) a.push(String.fromCharCode(e[t + s]));
            return a;
        }
    }, _e._bin.t = {
        buff: new ArrayBuffer(8)
    }, _e._bin.t.int8 = new Int8Array(_e._bin.t.buff), _e._bin.t.uint8 = new Uint8Array(_e._bin.t.buff), 
    _e._bin.t.int16 = new Int16Array(_e._bin.t.buff), _e._bin.t.uint16 = new Uint16Array(_e._bin.t.buff), 
    _e._bin.t.int32 = new Int32Array(_e._bin.t.buff), _e._bin.t.uint32 = new Uint32Array(_e._bin.t.buff), 
    _e._lctf = {}, _e._lctf.parse = function(e, t, n, a, s) {
        var o = _e._bin, i = {}, r = t;
        o.readFixed(e, t), t += 4;
        var l = o.readUshort(e, t);
        t += 2;
        var c = o.readUshort(e, t);
        t += 2;
        var u = o.readUshort(e, t);
        return t += 2, i.scriptList = _e._lctf.readScriptList(e, r + l), i.featureList = _e._lctf.readFeatureList(e, r + c), 
        i.lookupList = _e._lctf.readLookupList(e, r + u, s), i;
    }, _e._lctf.readLookupList = function(e, t, n) {
        var a = _e._bin, s = t, o = [], i = a.readUshort(e, t);
        t += 2;
        for (var r = 0; r < i; r++) {
            var l = a.readUshort(e, t);
            t += 2;
            var c = _e._lctf.readLookupTable(e, s + l, n);
            o.push(c);
        }
        return o;
    }, _e._lctf.readLookupTable = function(e, t, n) {
        var a = _e._bin, s = t, o = {
            tabs: []
        };
        o.ltype = a.readUshort(e, t), t += 2, o.flag = a.readUshort(e, t), t += 2;
        var i = a.readUshort(e, t);
        t += 2;
        for (var r = 0; r < i; r++) {
            var l = a.readUshort(e, t);
            t += 2;
            var c = n(e, o.ltype, s + l);
            o.tabs.push(c);
        }
        return o;
    }, _e._lctf.numOfOnes = function(e) {
        for (var t = 0, n = 0; n < 32; n++) e >>> n & 1 && t++;
        return t;
    }, _e._lctf.readClassDef = function(e, t) {
        var n = _e._bin, a = [], s = n.readUshort(e, t);
        if (t += 2, 1 == s) {
            var o = n.readUshort(e, t);
            t += 2;
            var i = n.readUshort(e, t);
            t += 2;
            for (var r = 0; r < i; r++) a.push(o + r), a.push(o + r), a.push(n.readUshort(e, t)), 
            t += 2;
        }
        if (2 == s) {
            var l = n.readUshort(e, t);
            t += 2;
            for (r = 0; r < l; r++) a.push(n.readUshort(e, t)), t += 2, a.push(n.readUshort(e, t)), 
            t += 2, a.push(n.readUshort(e, t)), t += 2;
        }
        return a;
    }, _e._lctf.getInterval = function(e, t) {
        for (var n = 0; n < e.length; n += 3) {
            var a = e[n], s = e[n + 1];
            if (e[n + 2], a <= t && t <= s) return n;
        }
        return -1;
    }, _e._lctf.readValueRecord = function(e, t, n) {
        var a = _e._bin, s = [];
        return s.push(1 & n ? a.readShort(e, t) : 0), t += 1 & n ? 2 : 0, s.push(2 & n ? a.readShort(e, t) : 0), 
        t += 2 & n ? 2 : 0, s.push(4 & n ? a.readShort(e, t) : 0), t += 4 & n ? 2 : 0, s.push(8 & n ? a.readShort(e, t) : 0), 
        t += 8 & n ? 2 : 0, s;
    }, _e._lctf.readCoverage = function(e, t) {
        var n = _e._bin, a = {};
        a.fmt = n.readUshort(e, t), t += 2;
        var s = n.readUshort(e, t);
        return t += 2, 1 == a.fmt && (a.tab = n.readUshorts(e, t, s)), 2 == a.fmt && (a.tab = n.readUshorts(e, t, 3 * s)), 
        a;
    }, _e._lctf.coverageIndex = function(e, t) {
        var n = e.tab;
        if (1 == e.fmt) return n.indexOf(t);
        if (2 == e.fmt) {
            var a = _e._lctf.getInterval(n, t);
            if (-1 != a) return n[a + 2] + (t - n[a]);
        }
        return -1;
    }, _e._lctf.readFeatureList = function(e, t) {
        var n = _e._bin, a = t, s = [], o = n.readUshort(e, t);
        t += 2;
        for (var i = 0; i < o; i++) {
            var r = n.readASCII(e, t, 4);
            t += 4;
            var l = n.readUshort(e, t);
            t += 2, s.push({
                tag: r.trim(),
                tab: _e._lctf.readFeatureTable(e, a + l)
            });
        }
        return s;
    }, _e._lctf.readFeatureTable = function(e, t) {
        var n = _e._bin;
        n.readUshort(e, t), t += 2;
        var a = n.readUshort(e, t);
        t += 2;
        for (var s = [], o = 0; o < a; o++) s.push(n.readUshort(e, t + 2 * o));
        return s;
    }, _e._lctf.readScriptList = function(e, t) {
        var n = _e._bin, a = t, s = {}, o = n.readUshort(e, t);
        t += 2;
        for (var i = 0; i < o; i++) {
            var r = n.readASCII(e, t, 4);
            t += 4;
            var l = n.readUshort(e, t);
            t += 2, s[r.trim()] = _e._lctf.readScriptTable(e, a + l);
        }
        return s;
    }, _e._lctf.readScriptTable = function(e, t) {
        var n = _e._bin, a = t, s = {}, o = n.readUshort(e, t);
        t += 2, s.default = _e._lctf.readLangSysTable(e, a + o);
        var i = n.readUshort(e, t);
        t += 2;
        for (var r = 0; r < i; r++) {
            var l = n.readASCII(e, t, 4);
            t += 4;
            var c = n.readUshort(e, t);
            t += 2, s[l.trim()] = _e._lctf.readLangSysTable(e, a + c);
        }
        return s;
    }, _e._lctf.readLangSysTable = function(e, t) {
        var n = _e._bin, a = {};
        n.readUshort(e, t), t += 2, a.reqFeature = n.readUshort(e, t), t += 2;
        var s = n.readUshort(e, t);
        return t += 2, a.features = n.readUshorts(e, t, s), a;
    }, _e.CFF = {}, _e.CFF.parse = function(e, t, n) {
        var a = _e._bin;
        (e = new Uint8Array(e.buffer, t, n))[t = 0], e[++t], e[++t], e[++t], t++;
        var s = [];
        t = _e.CFF.readIndex(e, t, s);
        for (var o = [], i = 0; i < s.length - 1; i++) o.push(a.readASCII(e, t + s[i], s[i + 1] - s[i]));
        t += s[s.length - 1];
        var r = [];
        t = _e.CFF.readIndex(e, t, r);
        var l = [];
        for (i = 0; i < r.length - 1; i++) l.push(_e.CFF.readDict(e, t + r[i], t + r[i + 1]));
        t += r[r.length - 1];
        var c = l[0], u = [];
        t = _e.CFF.readIndex(e, t, u);
        var p = [];
        for (i = 0; i < u.length - 1; i++) p.push(a.readASCII(e, t + u[i], u[i + 1] - u[i]));
        if (t += u[u.length - 1], _e.CFF.readSubrs(e, t, c), c.CharStrings) {
            t = c.CharStrings;
            u = [];
            t = _e.CFF.readIndex(e, t, u);
            var h = [];
            for (i = 0; i < u.length - 1; i++) h.push(a.readBytes(e, t + u[i], u[i + 1] - u[i]));
            c.CharStrings = h;
        }
        c.Encoding && (c.Encoding = _e.CFF.readEncoding(e, c.Encoding, c.CharStrings.length)), 
        c.charset && (c.charset = _e.CFF.readCharset(e, c.charset, c.CharStrings.length)), 
        c.Private && (t = c.Private[1], c.Private = _e.CFF.readDict(e, t, t + c.Private[0]), 
        c.Private.Subrs && _e.CFF.readSubrs(e, t + c.Private.Subrs, c.Private));
        var d = {};
        for (var m in c) -1 != [ "FamilyName", "FullName", "Notice", "version", "Copyright" ].indexOf(m) ? d[m] = p[c[m] - 426 + 35] : d[m] = c[m];
        return d;
    }, _e.CFF.readSubrs = function(e, t, n) {
        var a = _e._bin, s = [];
        t = _e.CFF.readIndex(e, t, s);
        var o, i = s.length;
        o = i < 1240 ? 107 : i < 33900 ? 1131 : 32768, n.Bias = o, n.Subrs = [];
        for (var r = 0; r < s.length - 1; r++) n.Subrs.push(a.readBytes(e, t + s[r], s[r + 1] - s[r]));
    }, _e.CFF.tableSE = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117, 118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131, 0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0, 0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0 ], 
    _e.CFF.glyphByUnicode = function(e, t) {
        for (var n = 0; n < e.charset.length; n++) if (e.charset[n] == t) return n;
        return -1;
    }, _e.CFF.glyphBySE = function(e, t) {
        return t < 0 || t > 255 ? -1 : _e.CFF.glyphByUnicode(e, _e.CFF.tableSE[t]);
    }, _e.CFF.readEncoding = function(e, t, n) {
        _e._bin;
        var a = [ ".notdef" ], s = e[t];
        if (t++, 0 != s) throw "error: unknown encoding format: " + s;
        var o = e[t];
        t++;
        for (var i = 0; i < o; i++) a.push(e[t + i]);
        return a;
    }, _e.CFF.readCharset = function(e, t, n) {
        var a = _e._bin, s = [ ".notdef" ], o = e[t];
        if (t++, 0 == o) for (var i = 0; i < n; i++) {
            var r = a.readUshort(e, t);
            t += 2, s.push(r);
        } else {
            if (1 != o && 2 != o) throw "error: format: " + o;
            for (;s.length < n; ) {
                r = a.readUshort(e, t);
                t += 2;
                var l = 0;
                1 == o ? (l = e[t], t++) : (l = a.readUshort(e, t), t += 2);
                for (i = 0; i <= l; i++) s.push(r), r++;
            }
        }
        return s;
    }, _e.CFF.readIndex = function(e, t, n) {
        var a = _e._bin, s = a.readUshort(e, t), o = e[t += 2];
        if (t++, 1 == o) for (var i = 0; i < s + 1; i++) n.push(e[t + i]); else if (2 == o) for (i = 0; i < s + 1; i++) n.push(a.readUshort(e, t + 2 * i)); else if (3 == o) for (i = 0; i < s + 1; i++) n.push(16777215 & a.readUint(e, t + 3 * i - 1)); else if (0 != s) throw "unsupported offset size: " + o + ", count: " + s;
        return (t += (s + 1) * o) - 1;
    }, _e.CFF.getCharString = function(e, t, n) {
        var a = _e._bin, s = e[t], o = e[t + 1];
        e[t + 2], e[t + 3], e[t + 4];
        var i = 1, r = null, l = null;
        s <= 20 && (r = s, i = 1), 12 == s && (r = 100 * s + o, i = 2), 21 <= s && s <= 27 && (r = s, 
        i = 1), 28 == s && (l = a.readShort(e, t + 1), i = 3), 29 <= s && s <= 31 && (r = s, 
        i = 1), 32 <= s && s <= 246 && (l = s - 139, i = 1), 247 <= s && s <= 250 && (l = 256 * (s - 247) + o + 108, 
        i = 2), 251 <= s && s <= 254 && (l = 256 * -(s - 251) - o - 108, i = 2), 255 == s && (l = a.readInt(e, t + 1) / 65535, 
        i = 5), n.val = null != l ? l : "o" + r, n.size = i;
    }, _e.CFF.readCharString = function(e, t, n) {
        for (var a = t + n, s = _e._bin, o = []; t < a; ) {
            var i = e[t], r = e[t + 1];
            e[t + 2], e[t + 3], e[t + 4];
            var l = 1, c = null, u = null;
            i <= 20 && (c = i, l = 1), 12 == i && (c = 100 * i + r, l = 2), 19 != i && 20 != i || (c = i, 
            l = 2), 21 <= i && i <= 27 && (c = i, l = 1), 28 == i && (u = s.readShort(e, t + 1), 
            l = 3), 29 <= i && i <= 31 && (c = i, l = 1), 32 <= i && i <= 246 && (u = i - 139, 
            l = 1), 247 <= i && i <= 250 && (u = 256 * (i - 247) + r + 108, l = 2), 251 <= i && i <= 254 && (u = 256 * -(i - 251) - r - 108, 
            l = 2), 255 == i && (u = s.readInt(e, t + 1) / 65535, l = 5), o.push(null != u ? u : "o" + c), 
            t += l;
        }
        return o;
    }, _e.CFF.readDict = function(e, t, n) {
        for (var a = _e._bin, s = {}, o = []; t < n; ) {
            var i = e[t], r = e[t + 1];
            e[t + 2], e[t + 3], e[t + 4];
            var l = 1, c = null, u = null;
            if (28 == i && (u = a.readShort(e, t + 1), l = 3), 29 == i && (u = a.readInt(e, t + 1), 
            l = 5), 32 <= i && i <= 246 && (u = i - 139, l = 1), 247 <= i && i <= 250 && (u = 256 * (i - 247) + r + 108, 
            l = 2), 251 <= i && i <= 254 && (u = 256 * -(i - 251) - r - 108, l = 2), 255 == i) throw u = a.readInt(e, t + 1) / 65535, 
            l = 5, "unknown number";
            if (30 == i) {
                var p = [];
                for (l = 1; ;) {
                    var h = e[t + l];
                    l++;
                    var d = h >> 4, m = 15 & h;
                    if (15 != d && p.push(d), 15 != m && p.push(m), 15 == m) break;
                }
                for (var f = "", y = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber" ], g = 0; g < p.length; g++) f += y[p[g]];
                u = parseFloat(f);
            }
            if (i <= 21) if (c = [ "version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues", "FamilyOtherBlues", "StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", "defaultWidthX", "nominalWidthX" ][i], 
            l = 1, 12 == i) c = [ "Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale", "BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", 0, 0, "LanguageGroup", "ExpansionFactor", "initialRandomSeed", "SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", 0, 0, 0, 0, 0, 0, "ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName" ][r], 
            l = 2;
            null != c ? (s[c] = 1 == o.length ? o[0] : o, o = []) : o.push(u), t += l;
        }
        return s;
    }, _e.cmap = {}, _e.cmap.parse = function(e, t, n) {
        e = new Uint8Array(e.buffer, t, n), t = 0;
        var a = _e._bin, s = {};
        a.readUshort(e, t), t += 2;
        var o = a.readUshort(e, t);
        t += 2;
        var i = [];
        s.tables = [];
        for (var r = 0; r < o; r++) {
            var l = a.readUshort(e, t);
            t += 2;
            var c = a.readUshort(e, t);
            t += 2;
            var u = a.readUint(e, t);
            t += 4;
            var p = "p" + l + "e" + c, h = i.indexOf(u);
            if (-1 == h) {
                var d;
                h = s.tables.length, i.push(u);
                var m = a.readUshort(e, u);
                0 == m ? d = _e.cmap.parse0(e, u) : 4 == m ? d = _e.cmap.parse4(e, u) : 6 == m ? d = _e.cmap.parse6(e, u) : 12 == m ? d = _e.cmap.parse12(e, u) : console.log("unknown format: " + m, l, c, u), 
                s.tables.push(d);
            }
            if (null != s[p]) throw "multiple tables for one platform+encoding";
            s[p] = h;
        }
        return s;
    }, _e.cmap.parse0 = function(e, t) {
        var n = _e._bin, a = {};
        a.format = n.readUshort(e, t), t += 2;
        var s = n.readUshort(e, t);
        t += 2, n.readUshort(e, t), t += 2, a.map = [];
        for (var o = 0; o < s - 6; o++) a.map.push(e[t + o]);
        return a;
    }, _e.cmap.parse4 = function(e, t) {
        var n = _e._bin, a = t, s = {};
        s.format = n.readUshort(e, t), t += 2;
        var o = n.readUshort(e, t);
        t += 2, n.readUshort(e, t), t += 2;
        var i = n.readUshort(e, t);
        t += 2;
        var r = i / 2;
        s.searchRange = n.readUshort(e, t), t += 2, s.entrySelector = n.readUshort(e, t), 
        t += 2, s.rangeShift = n.readUshort(e, t), t += 2, s.endCount = n.readUshorts(e, t, r), 
        t += 2 * r, t += 2, s.startCount = n.readUshorts(e, t, r), t += 2 * r, s.idDelta = [];
        for (var l = 0; l < r; l++) s.idDelta.push(n.readShort(e, t)), t += 2;
        for (s.idRangeOffset = n.readUshorts(e, t, r), t += 2 * r, s.glyphIdArray = []; t < a + o; ) s.glyphIdArray.push(n.readUshort(e, t)), 
        t += 2;
        return s;
    }, _e.cmap.parse6 = function(e, t) {
        var n = _e._bin, a = {};
        a.format = n.readUshort(e, t), t += 2, n.readUshort(e, t), t += 2, n.readUshort(e, t), 
        t += 2, a.firstCode = n.readUshort(e, t), t += 2;
        var s = n.readUshort(e, t);
        t += 2, a.glyphIdArray = [];
        for (var o = 0; o < s; o++) a.glyphIdArray.push(n.readUshort(e, t)), t += 2;
        return a;
    }, _e.cmap.parse12 = function(e, t) {
        var n = _e._bin, a = {};
        a.format = n.readUshort(e, t), t += 2, t += 2, n.readUint(e, t), t += 4, n.readUint(e, t), 
        t += 4;
        var s = n.readUint(e, t);
        t += 4, a.groups = [];
        for (var o = 0; o < s; o++) {
            var i = t + 12 * o, r = n.readUint(e, i + 0), l = n.readUint(e, i + 4), c = n.readUint(e, i + 8);
            a.groups.push([ r, l, c ]);
        }
        return a;
    }, _e.glyf = {}, _e.glyf.parse = function(e, t, n, a) {
        for (var s = [], o = 0; o < a.maxp.numGlyphs; o++) s.push(null);
        return s;
    }, _e.glyf._parseGlyf = function(e, t) {
        var n = _e._bin, a = e._data, s = _e._tabOffset(a, "glyf") + e.loca[t];
        if (e.loca[t] == e.loca[t + 1]) return null;
        var o = {};
        if (o.noc = n.readShort(a, s), s += 2, o.xMin = n.readShort(a, s), s += 2, o.yMin = n.readShort(a, s), 
        s += 2, o.xMax = n.readShort(a, s), s += 2, o.yMax = n.readShort(a, s), s += 2, 
        o.xMin >= o.xMax || o.yMin >= o.yMax) return null;
        if (o.noc > 0) {
            o.endPts = [];
            for (var i = 0; i < o.noc; i++) o.endPts.push(n.readUshort(a, s)), s += 2;
            var r = n.readUshort(a, s);
            if (s += 2, a.length - s < r) return null;
            o.instructions = n.readBytes(a, s, r), s += r;
            var l = o.endPts[o.noc - 1] + 1;
            o.flags = [];
            for (i = 0; i < l; i++) {
                var c = a[s];
                if (s++, o.flags.push(c), 8 & c) {
                    var u = a[s];
                    s++;
                    for (var p = 0; p < u; p++) o.flags.push(c), i++;
                }
            }
            o.xs = [];
            for (i = 0; i < l; i++) {
                var h = !!(2 & o.flags[i]), d = !!(16 & o.flags[i]);
                h ? (o.xs.push(d ? a[s] : -a[s]), s++) : d ? o.xs.push(0) : (o.xs.push(n.readShort(a, s)), 
                s += 2);
            }
            o.ys = [];
            for (i = 0; i < l; i++) {
                h = !!(4 & o.flags[i]), d = !!(32 & o.flags[i]);
                h ? (o.ys.push(d ? a[s] : -a[s]), s++) : d ? o.ys.push(0) : (o.ys.push(n.readShort(a, s)), 
                s += 2);
            }
            var m = 0, f = 0;
            for (i = 0; i < l; i++) m += o.xs[i], f += o.ys[i], o.xs[i] = m, o.ys[i] = f;
        } else {
            var y;
            o.parts = [];
            do {
                y = n.readUshort(a, s), s += 2;
                var g = {
                    m: {
                        a: 1,
                        b: 0,
                        c: 0,
                        d: 1,
                        tx: 0,
                        ty: 0
                    },
                    p1: -1,
                    p2: -1
                };
                if (o.parts.push(g), g.glyphIndex = n.readUshort(a, s), s += 2, 1 & y) {
                    var w = n.readShort(a, s);
                    s += 2;
                    var v = n.readShort(a, s);
                    s += 2;
                } else {
                    w = n.readInt8(a, s);
                    s++;
                    v = n.readInt8(a, s);
                    s++;
                }
                2 & y ? (g.m.tx = w, g.m.ty = v) : (g.p1 = w, g.p2 = v), 8 & y ? (g.m.a = g.m.d = n.readF2dot14(a, s), 
                s += 2) : 64 & y ? (g.m.a = n.readF2dot14(a, s), s += 2, g.m.d = n.readF2dot14(a, s), 
                s += 2) : 128 & y && (g.m.a = n.readF2dot14(a, s), s += 2, g.m.b = n.readF2dot14(a, s), 
                s += 2, g.m.c = n.readF2dot14(a, s), s += 2, g.m.d = n.readF2dot14(a, s), s += 2);
            } while (32 & y);
            if (256 & y) {
                var b = n.readUshort(a, s);
                s += 2, o.instr = [];
                for (i = 0; i < b; i++) o.instr.push(a[s]), s++;
            }
        }
        return o;
    }, _e.GPOS = {}, _e.GPOS.parse = function(e, t, n, a) {
        return _e._lctf.parse(e, t, n, a, _e.GPOS.subt);
    }, _e.GPOS.subt = function(e, t, n) {
        if (2 != t) return null;
        var a = _e._bin, s = n, o = {};
        o.format = a.readUshort(e, n), n += 2;
        var i = a.readUshort(e, n);
        n += 2, o.coverage = _e._lctf.readCoverage(e, i + s), o.valFmt1 = a.readUshort(e, n), 
        n += 2, o.valFmt2 = a.readUshort(e, n), n += 2;
        var r = _e._lctf.numOfOnes(o.valFmt1), l = _e._lctf.numOfOnes(o.valFmt2);
        if (1 == o.format) {
            o.pairsets = [];
            var c = a.readUshort(e, n);
            n += 2;
            for (var u = 0; u < c; u++) {
                var p = a.readUshort(e, n);
                n += 2, p += s;
                var h = a.readUshort(e, p);
                p += 2;
                for (var d = [], m = 0; m < h; m++) {
                    var f = a.readUshort(e, p);
                    p += 2, 0 != o.valFmt1 && (k = _e._lctf.readValueRecord(e, p, o.valFmt1), p += 2 * r), 
                    0 != o.valFmt2 && (x = _e._lctf.readValueRecord(e, p, o.valFmt2), p += 2 * l), d.push({
                        gid2: f,
                        val1: k,
                        val2: x
                    });
                }
                o.pairsets.push(d);
            }
        }
        if (2 == o.format) {
            var y = a.readUshort(e, n);
            n += 2;
            var g = a.readUshort(e, n);
            n += 2;
            var w = a.readUshort(e, n);
            n += 2;
            var v = a.readUshort(e, n);
            n += 2, o.classDef1 = _e._lctf.readClassDef(e, s + y), o.classDef2 = _e._lctf.readClassDef(e, s + g), 
            o.matrix = [];
            for (u = 0; u < w; u++) {
                var b = [];
                for (m = 0; m < v; m++) {
                    var k = null, x = null;
                    0 != o.valFmt1 && (k = _e._lctf.readValueRecord(e, n, o.valFmt1), n += 2 * r), 0 != o.valFmt2 && (x = _e._lctf.readValueRecord(e, n, o.valFmt2), 
                    n += 2 * l), b.push({
                        val1: k,
                        val2: x
                    });
                }
                o.matrix.push(b);
            }
        }
        return o;
    }, _e.GSUB = {}, _e.GSUB.parse = function(e, t, n, a) {
        return _e._lctf.parse(e, t, n, a, _e.GSUB.subt);
    }, _e.GSUB.subt = function(e, t, n) {
        var a = _e._bin, s = n, o = {};
        if (1 != t && 4 != t && 5 != t) return null;
        o.fmt = a.readUshort(e, n), n += 2;
        var i = a.readUshort(e, n);
        if (n += 2, o.coverage = _e._lctf.readCoverage(e, i + s), 1 == t) {
            if (1 == o.fmt) o.delta = a.readShort(e, n), n += 2; else if (2 == o.fmt) {
                var r = a.readUshort(e, n);
                n += 2, o.newg = a.readUshorts(e, n, r), n += 2 * o.newg.length;
            }
        } else if (4 == t) {
            o.vals = [];
            r = a.readUshort(e, n);
            n += 2;
            for (var l = 0; l < r; l++) {
                var c = a.readUshort(e, n);
                n += 2, o.vals.push(_e.GSUB.readLigatureSet(e, s + c));
            }
        } else if (5 == t) if (2 == o.fmt) {
            var u = a.readUshort(e, n);
            n += 2, o.cDef = _e._lctf.readClassDef(e, s + u), o.scset = [];
            var p = a.readUshort(e, n);
            n += 2;
            for (l = 0; l < p; l++) {
                var h = a.readUshort(e, n);
                n += 2, o.scset.push(0 == h ? null : _e.GSUB.readSubClassSet(e, s + h));
            }
        } else console.log("unknown table format", o.fmt);
        return o;
    }, _e.GSUB.readSubClassSet = function(e, t) {
        var n = _e._bin.readUshort, a = t, s = [], o = n(e, t);
        t += 2;
        for (var i = 0; i < o; i++) {
            var r = n(e, t);
            t += 2, s.push(_e.GSUB.readSubClassRule(e, a + r));
        }
        return s;
    }, _e.GSUB.readSubClassRule = function(e, t) {
        var n = _e._bin.readUshort, a = {}, s = n(e, t), o = n(e, t += 2);
        t += 2, a.input = [];
        for (var i = 0; i < s - 1; i++) a.input.push(n(e, t)), t += 2;
        return a.substLookupRecords = _e.GSUB.readSubstLookupRecords(e, t, o), a;
    }, _e.GSUB.readSubstLookupRecords = function(e, t, n) {
        for (var a = _e._bin.readUshort, s = [], o = 0; o < n; o++) s.push(a(e, t), a(e, t + 2)), 
        t += 4;
        return s;
    }, _e.GSUB.readChainSubClassSet = function(e, t) {
        var n = _e._bin, a = t, s = [], o = n.readUshort(e, t);
        t += 2;
        for (var i = 0; i < o; i++) {
            var r = n.readUshort(e, t);
            t += 2, s.push(_e.GSUB.readChainSubClassRule(e, a + r));
        }
        return s;
    }, _e.GSUB.readChainSubClassRule = function(e, t) {
        for (var n = _e._bin, a = {}, s = [ "backtrack", "input", "lookahead" ], o = 0; o < s.length; o++) {
            var i = n.readUshort(e, t);
            t += 2, 1 == o && i--, a[s[o]] = n.readUshorts(e, t, i), t += 2 * a[s[o]].length;
        }
        i = n.readUshort(e, t);
        return t += 2, a.subst = n.readUshorts(e, t, 2 * i), t += 2 * a.subst.length, a;
    }, _e.GSUB.readLigatureSet = function(e, t) {
        var n = _e._bin, a = t, s = [], o = n.readUshort(e, t);
        t += 2;
        for (var i = 0; i < o; i++) {
            var r = n.readUshort(e, t);
            t += 2, s.push(_e.GSUB.readLigature(e, a + r));
        }
        return s;
    }, _e.GSUB.readLigature = function(e, t) {
        var n = _e._bin, a = {
            chain: []
        };
        a.nglyph = n.readUshort(e, t), t += 2;
        var s = n.readUshort(e, t);
        t += 2;
        for (var o = 0; o < s - 1; o++) a.chain.push(n.readUshort(e, t)), t += 2;
        return a;
    }, _e.head = {}, _e.head.parse = function(e, t, n) {
        var a = _e._bin, s = {};
        return a.readFixed(e, t), t += 4, s.fontRevision = a.readFixed(e, t), t += 4, a.readUint(e, t), 
        t += 4, a.readUint(e, t), t += 4, s.flags = a.readUshort(e, t), t += 2, s.unitsPerEm = a.readUshort(e, t), 
        t += 2, s.created = a.readUint64(e, t), t += 8, s.modified = a.readUint64(e, t), 
        t += 8, s.xMin = a.readShort(e, t), t += 2, s.yMin = a.readShort(e, t), t += 2, 
        s.xMax = a.readShort(e, t), t += 2, s.yMax = a.readShort(e, t), t += 2, s.macStyle = a.readUshort(e, t), 
        t += 2, s.lowestRecPPEM = a.readUshort(e, t), t += 2, s.fontDirectionHint = a.readShort(e, t), 
        t += 2, s.indexToLocFormat = a.readShort(e, t), t += 2, s.glyphDataFormat = a.readShort(e, t), 
        t += 2, s;
    }, _e.hhea = {}, _e.hhea.parse = function(e, t, n) {
        var a = _e._bin, s = {};
        return a.readFixed(e, t), t += 4, s.ascender = a.readShort(e, t), t += 2, s.descender = a.readShort(e, t), 
        t += 2, s.lineGap = a.readShort(e, t), t += 2, s.advanceWidthMax = a.readUshort(e, t), 
        t += 2, s.minLeftSideBearing = a.readShort(e, t), t += 2, s.minRightSideBearing = a.readShort(e, t), 
        t += 2, s.xMaxExtent = a.readShort(e, t), t += 2, s.caretSlopeRise = a.readShort(e, t), 
        t += 2, s.caretSlopeRun = a.readShort(e, t), t += 2, s.caretOffset = a.readShort(e, t), 
        t += 2, t += 8, s.metricDataFormat = a.readShort(e, t), t += 2, s.numberOfHMetrics = a.readUshort(e, t), 
        t += 2, s;
    }, _e.hmtx = {}, _e.hmtx.parse = function(e, t, n, a) {
        for (var s = _e._bin, o = {
            aWidth: [],
            lsBearing: []
        }, i = 0, r = 0, l = 0; l < a.maxp.numGlyphs; l++) l < a.hhea.numberOfHMetrics && (i = s.readUshort(e, t), 
        t += 2, r = s.readShort(e, t), t += 2), o.aWidth.push(i), o.lsBearing.push(r);
        return o;
    }, _e.kern = {}, _e.kern.parse = function(e, t, n, a) {
        var s = _e._bin, o = s.readUshort(e, t);
        if (t += 2, 1 == o) return _e.kern.parseV1(e, t - 2, n, a);
        var i = s.readUshort(e, t);
        t += 2;
        for (var r = {
            glyph1: [],
            rval: []
        }, l = 0; l < i; l++) {
            t += 2;
            n = s.readUshort(e, t);
            t += 2;
            var c = s.readUshort(e, t);
            t += 2;
            var u = c >>> 8;
            if (0 != (u &= 15)) throw "unknown kern table format: " + u;
            t = _e.kern.readFormat0(e, t, r);
        }
        return r;
    }, _e.kern.parseV1 = function(e, t, n, a) {
        var s = _e._bin;
        s.readFixed(e, t), t += 4;
        var o = s.readUint(e, t);
        t += 4;
        for (var i = {
            glyph1: [],
            rval: []
        }, r = 0; r < o; r++) {
            s.readUint(e, t), t += 4;
            var l = s.readUshort(e, t);
            t += 2, s.readUshort(e, t), t += 2;
            var c = l >>> 8;
            if (0 != (c &= 15)) throw "unknown kern table format: " + c;
            t = _e.kern.readFormat0(e, t, i);
        }
        return i;
    }, _e.kern.readFormat0 = function(e, t, n) {
        var a = _e._bin, s = -1, o = a.readUshort(e, t);
        t += 2, a.readUshort(e, t), t += 2, a.readUshort(e, t), t += 2, a.readUshort(e, t), 
        t += 2;
        for (var i = 0; i < o; i++) {
            var r = a.readUshort(e, t);
            t += 2;
            var l = a.readUshort(e, t);
            t += 2;
            var c = a.readShort(e, t);
            t += 2, r != s && (n.glyph1.push(r), n.rval.push({
                glyph2: [],
                vals: []
            }));
            var u = n.rval[n.rval.length - 1];
            u.glyph2.push(l), u.vals.push(c), s = r;
        }
        return t;
    }, _e.loca = {}, _e.loca.parse = function(e, t, n, a) {
        var s = _e._bin, o = [], i = a.head.indexToLocFormat, r = a.maxp.numGlyphs + 1;
        if (0 == i) for (var l = 0; l < r; l++) o.push(s.readUshort(e, t + (l << 1)) << 1);
        if (1 == i) for (l = 0; l < r; l++) o.push(s.readUint(e, t + (l << 2)));
        return o;
    }, _e.maxp = {}, _e.maxp.parse = function(e, t, n) {
        var a = _e._bin, s = {}, o = a.readUint(e, t);
        return t += 4, s.numGlyphs = a.readUshort(e, t), t += 2, 65536 == o && (s.maxPoints = a.readUshort(e, t), 
        t += 2, s.maxContours = a.readUshort(e, t), t += 2, s.maxCompositePoints = a.readUshort(e, t), 
        t += 2, s.maxCompositeContours = a.readUshort(e, t), t += 2, s.maxZones = a.readUshort(e, t), 
        t += 2, s.maxTwilightPoints = a.readUshort(e, t), t += 2, s.maxStorage = a.readUshort(e, t), 
        t += 2, s.maxFunctionDefs = a.readUshort(e, t), t += 2, s.maxInstructionDefs = a.readUshort(e, t), 
        t += 2, s.maxStackElements = a.readUshort(e, t), t += 2, s.maxSizeOfInstructions = a.readUshort(e, t), 
        t += 2, s.maxComponentElements = a.readUshort(e, t), t += 2, s.maxComponentDepth = a.readUshort(e, t), 
        t += 2), s;
    }, _e.name = {}, _e.name.parse = function(e, t, n) {
        var a = _e._bin, s = {};
        a.readUshort(e, t), t += 2;
        var o = a.readUshort(e, t);
        t += 2, a.readUshort(e, t);
        for (var i, r = t += 2, l = 0; l < o; l++) {
            var c = a.readUshort(e, t);
            t += 2;
            var u = a.readUshort(e, t);
            t += 2;
            var p = a.readUshort(e, t);
            t += 2;
            var h = a.readUshort(e, t);
            t += 2;
            n = a.readUshort(e, t);
            t += 2;
            var d = a.readUshort(e, t);
            t += 2;
            var m = "p" + c;
            null == s[m] && (s[m] = {});
            var f, y = [ "copyright", "fontFamily", "fontSubfamily", "ID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "urlVendor", "urlDesigner", "licence", "licenceURL", "---", "typoFamilyName", "typoSubfamilyName", "compatibleFull", "sampleText", "postScriptCID", "wwsFamilyName", "wwsSubfamilyName", "lightPalette", "darkPalette" ][h], g = r + 12 * o + d;
            if (0 == c) f = a.readUnicode(e, g, n / 2); else if (3 == c && 0 == u) f = a.readUnicode(e, g, n / 2); else if (0 == u) f = a.readASCII(e, g, n); else if (1 == u) f = a.readUnicode(e, g, n / 2); else if (3 == u) f = a.readUnicode(e, g, n / 2); else {
                if (1 != c) throw "unknown encoding " + u + ", platformID: " + c;
                f = a.readASCII(e, g, n), console.log("reading unknown MAC encoding " + u + " as ASCII");
            }
            s[m][y] = f, s[m]._lang = p;
        }
        for (var w in s) if (null != s[w].postScriptName && 1033 == s[w]._lang) return s[w];
        for (var w in s) if (null != s[w].postScriptName && 3084 == s[w]._lang) return s[w];
        for (var w in s) if (null != s[w].postScriptName) return s[w];
        for (var w in s) {
            i = w;
            break;
        }
        return console.log("returning name table with languageID " + s[i]._lang), s[i];
    }, _e["OS/2"] = {}, _e["OS/2"].parse = function(e, t, n) {
        var a = _e._bin.readUshort(e, t);
        t += 2;
        var s = {};
        if (0 == a) _e["OS/2"].version0(e, t, s); else if (1 == a) _e["OS/2"].version1(e, t, s); else if (2 == a || 3 == a || 4 == a) _e["OS/2"].version2(e, t, s); else {
            if (5 != a) throw "unknown OS/2 table version: " + a;
            _e["OS/2"].version5(e, t, s);
        }
        return s;
    }, _e["OS/2"].version0 = function(e, t, n) {
        var a = _e._bin;
        return n.xAvgCharWidth = a.readShort(e, t), t += 2, n.usWeightClass = a.readUshort(e, t), 
        t += 2, n.usWidthClass = a.readUshort(e, t), t += 2, n.fsType = a.readUshort(e, t), 
        t += 2, n.ySubscriptXSize = a.readShort(e, t), t += 2, n.ySubscriptYSize = a.readShort(e, t), 
        t += 2, n.ySubscriptXOffset = a.readShort(e, t), t += 2, n.ySubscriptYOffset = a.readShort(e, t), 
        t += 2, n.ySuperscriptXSize = a.readShort(e, t), t += 2, n.ySuperscriptYSize = a.readShort(e, t), 
        t += 2, n.ySuperscriptXOffset = a.readShort(e, t), t += 2, n.ySuperscriptYOffset = a.readShort(e, t), 
        t += 2, n.yStrikeoutSize = a.readShort(e, t), t += 2, n.yStrikeoutPosition = a.readShort(e, t), 
        t += 2, n.sFamilyClass = a.readShort(e, t), t += 2, n.panose = a.readBytes(e, t, 10), 
        t += 10, n.ulUnicodeRange1 = a.readUint(e, t), t += 4, n.ulUnicodeRange2 = a.readUint(e, t), 
        t += 4, n.ulUnicodeRange3 = a.readUint(e, t), t += 4, n.ulUnicodeRange4 = a.readUint(e, t), 
        t += 4, n.achVendID = [ a.readInt8(e, t), a.readInt8(e, t + 1), a.readInt8(e, t + 2), a.readInt8(e, t + 3) ], 
        t += 4, n.fsSelection = a.readUshort(e, t), t += 2, n.usFirstCharIndex = a.readUshort(e, t), 
        t += 2, n.usLastCharIndex = a.readUshort(e, t), t += 2, n.sTypoAscender = a.readShort(e, t), 
        t += 2, n.sTypoDescender = a.readShort(e, t), t += 2, n.sTypoLineGap = a.readShort(e, t), 
        t += 2, n.usWinAscent = a.readUshort(e, t), t += 2, n.usWinDescent = a.readUshort(e, t), 
        t += 2;
    }, _e["OS/2"].version1 = function(e, t, n) {
        var a = _e._bin;
        return t = _e["OS/2"].version0(e, t, n), n.ulCodePageRange1 = a.readUint(e, t), 
        t += 4, n.ulCodePageRange2 = a.readUint(e, t), t += 4;
    }, _e["OS/2"].version2 = function(e, t, n) {
        var a = _e._bin;
        return t = _e["OS/2"].version1(e, t, n), n.sxHeight = a.readShort(e, t), t += 2, 
        n.sCapHeight = a.readShort(e, t), t += 2, n.usDefault = a.readUshort(e, t), t += 2, 
        n.usBreak = a.readUshort(e, t), t += 2, n.usMaxContext = a.readUshort(e, t), t += 2;
    }, _e["OS/2"].version5 = function(e, t, n) {
        var a = _e._bin;
        return t = _e["OS/2"].version2(e, t, n), n.usLowerOpticalPointSize = a.readUshort(e, t), 
        t += 2, n.usUpperOpticalPointSize = a.readUshort(e, t), t += 2;
    }, _e.post = {}, _e.post.parse = function(e, t, n) {
        var a = _e._bin, s = {};
        return s.version = a.readFixed(e, t), t += 4, s.italicAngle = a.readFixed(e, t), 
        t += 4, s.underlinePosition = a.readShort(e, t), t += 2, s.underlineThickness = a.readShort(e, t), 
        t += 2, s;
    }, _e.SVG = {}, _e.SVG.parse = function(e, t, n) {
        var a = _e._bin, s = {
            entries: []
        }, o = t;
        a.readUshort(e, t), t += 2;
        var i = a.readUint(e, t);
        t += 4, a.readUint(e, t), t += 4, t = i + o;
        var r = a.readUshort(e, t);
        t += 2;
        for (var l = 0; l < r; l++) {
            var c = a.readUshort(e, t);
            t += 2;
            var u = a.readUshort(e, t);
            t += 2;
            var p = a.readUint(e, t);
            t += 4;
            var h = a.readUint(e, t);
            t += 4;
            for (var d = new Uint8Array(e.buffer, o + p + i, h), m = a.readUTF8(d, 0, d.length), f = c; f <= u; f++) s.entries[f] = m;
        }
        return s;
    }, _e.SVG.toPath = function(e) {
        var t = {
            cmds: [],
            crds: []
        };
        if (null == e) return t;
        for (var n = (new DOMParser).parseFromString(e, "image/svg+xml").firstChild; "svg" != n.tagName; ) n = n.nextSibling;
        var a = n.getAttribute("viewBox");
        a = a ? a.trim().split(" ").map(parseFloat) : [ 0, 0, 1e3, 1e3 ], _e.SVG._toPath(n.children, t);
        for (var s = 0; s < t.crds.length; s += 2) {
            var o = t.crds[s], i = t.crds[s + 1];
            o -= a[0], i = -(i -= a[1]), t.crds[s] = o, t.crds[s + 1] = i;
        }
        return t;
    }, _e.SVG._toPath = function(e, t, n) {
        for (var a = 0; a < e.length; a++) {
            var s = e[a], o = s.tagName, i = s.getAttribute("fill");
            if (null == i && (i = n), "g" == o) _e.SVG._toPath(s.children, t, i); else if ("path" == o) {
                t.cmds.push(i || "#000000");
                var r = s.getAttribute("d"), l = _e.SVG._tokens(r);
                _e.SVG._toksToPath(l, t), t.cmds.push("X");
            } else "defs" == o || console.log(o, s);
        }
    }, _e.SVG._tokens = function(e) {
        for (var t = [], n = 0, a = !1, s = ""; n < e.length; ) {
            var o = e.charCodeAt(n), i = e.charAt(n);
            n++;
            var r = 48 <= o && o <= 57 || "." == i || "-" == i;
            a ? "-" == i ? (t.push(parseFloat(s)), s = i) : r ? s += i : (t.push(parseFloat(s)), 
            "," != i && " " != i && t.push(i), a = !1) : r ? (s = i, a = !0) : "," != i && " " != i && t.push(i);
        }
        return a && t.push(parseFloat(s)), t;
    }, _e.SVG._toksToPath = function(e, t) {
        for (var n = 0, a = 0, s = 0, o = 0, i = 0, r = {
            M: 2,
            L: 2,
            H: 1,
            V: 1,
            S: 4,
            C: 6
        }, l = t.cmds, c = t.crds; n < e.length; ) {
            var u = e[n];
            if (n++, "z" == u) l.push("Z"), a = o, s = i; else for (var p = u.toUpperCase(), h = r[p], d = _e.SVG._reps(e, n, h), m = 0; m < d; m++) {
                var f = 0, y = 0;
                if (u != p && (f = a, y = s), "M" == p) a = f + e[n++], s = y + e[n++], l.push("M"), 
                c.push(a, s), o = a, i = s; else if ("L" == p) a = f + e[n++], s = y + e[n++], l.push("L"), 
                c.push(a, s); else if ("H" == p) a = f + e[n++], l.push("L"), c.push(a, s); else if ("V" == p) s = y + e[n++], 
                l.push("L"), c.push(a, s); else if ("C" == p) {
                    var g = f + e[n++], w = y + e[n++], v = f + e[n++], b = y + e[n++], k = f + e[n++], x = y + e[n++];
                    l.push("C"), c.push(g, w, v, b, k, x), a = k, s = x;
                } else if ("S" == p) {
                    var _ = Math.max(c.length - 4, 0);
                    g = a + a - c[_], w = s + s - c[_ + 1], v = f + e[n++], b = y + e[n++], k = f + e[n++], 
                    x = y + e[n++];
                    l.push("C"), c.push(g, w, v, b, k, x), a = k, s = x;
                } else console.log("Unknown SVG command " + u);
            }
        }
    }, _e.SVG._reps = function(e, t, n) {
        for (var a = t; a < e.length && "string" != typeof e[a]; ) a += n;
        return (a - t) / n;
    }, null == _e && (_e = {}), null == _e.U && (_e.U = {}), _e.U.codeToGlyph = function(e, t) {
        var n = e.cmap, a = -1;
        if (null != n.p0e4 ? a = n.p0e4 : null != n.p3e1 ? a = n.p3e1 : null != n.p1e0 && (a = n.p1e0), 
        -1 == a) throw "no familiar platform and encoding!";
        var s = n.tables[a];
        if (0 == s.format) return t >= s.map.length ? 0 : s.map[t];
        if (4 == s.format) {
            for (var o = -1, i = 0; i < s.endCount.length; i++) if (t <= s.endCount[i]) {
                o = i;
                break;
            }
            if (-1 == o) return 0;
            if (s.startCount[o] > t) return 0;
            return 65535 & (0 != s.idRangeOffset[o] ? s.glyphIdArray[t - s.startCount[o] + (s.idRangeOffset[o] >> 1) - (s.idRangeOffset.length - o)] : t + s.idDelta[o]);
        }
        if (12 == s.format) {
            if (t > s.groups[s.groups.length - 1][1]) return 0;
            for (i = 0; i < s.groups.length; i++) {
                var r = s.groups[i];
                if (r[0] <= t && t <= r[1]) return r[2] + (t - r[0]);
            }
            return 0;
        }
        throw "unknown cmap table format " + s.format;
    }, _e.U.glyphToPath = function(e, t) {
        var n = {
            cmds: [],
            crds: []
        };
        if (e.SVG && e.SVG.entries[t]) {
            var a = e.SVG.entries[t];
            return null == a ? n : ("string" == typeof a && (a = _e.SVG.toPath(a), e.SVG.entries[t] = a), 
            a);
        }
        if (e.CFF) {
            var s = {
                x: 0,
                y: 0,
                stack: [],
                nStems: 0,
                haveWidth: !1,
                width: e.CFF.Private ? e.CFF.Private.defaultWidthX : 0,
                open: !1
            };
            _e.U._drawCFF(e.CFF.CharStrings[t], s, e.CFF, n);
        } else e.glyf && _e.U._drawGlyf(t, e, n);
        return n;
    }, _e.U._drawGlyf = function(e, t, n) {
        var a = t.glyf[e];
        null == a && (a = t.glyf[e] = _e.glyf._parseGlyf(t, e)), null != a && (a.noc > -1 ? _e.U._simpleGlyph(a, n) : _e.U._compoGlyph(a, t, n));
    }, _e.U._simpleGlyph = function(e, t) {
        for (var n = 0; n < e.noc; n++) {
            for (var a = 0 == n ? 0 : e.endPts[n - 1] + 1, s = e.endPts[n], o = a; o <= s; o++) {
                var i = o == a ? s : o - 1, r = o == s ? a : o + 1, l = 1 & e.flags[o], c = 1 & e.flags[i], u = 1 & e.flags[r], p = e.xs[o], h = e.ys[o];
                if (o == a) if (l) {
                    if (!c) {
                        _e.U.P.moveTo(t, p, h);
                        continue;
                    }
                    _e.U.P.moveTo(t, e.xs[i], e.ys[i]);
                } else c ? _e.U.P.moveTo(t, e.xs[i], e.ys[i]) : _e.U.P.moveTo(t, (e.xs[i] + p) / 2, (e.ys[i] + h) / 2);
                l ? c && _e.U.P.lineTo(t, p, h) : u ? _e.U.P.qcurveTo(t, p, h, e.xs[r], e.ys[r]) : _e.U.P.qcurveTo(t, p, h, (p + e.xs[r]) / 2, (h + e.ys[r]) / 2);
            }
            _e.U.P.closePath(t);
        }
    }, _e.U._compoGlyph = function(e, t, n) {
        for (var a = 0; a < e.parts.length; a++) {
            var s = {
                cmds: [],
                crds: []
            }, o = e.parts[a];
            _e.U._drawGlyf(o.glyphIndex, t, s);
            for (var i = o.m, r = 0; r < s.crds.length; r += 2) {
                var l = s.crds[r], c = s.crds[r + 1];
                n.crds.push(l * i.a + c * i.b + i.tx), n.crds.push(l * i.c + c * i.d + i.ty);
            }
            for (r = 0; r < s.cmds.length; r++) n.cmds.push(s.cmds[r]);
        }
    }, _e.U._getGlyphClass = function(e, t) {
        var n = _e._lctf.getInterval(t, e);
        return -1 == n ? 0 : t[n + 2];
    }, _e.U.getPairAdjustment = function(e, t, n) {
        if (e.GPOS) {
            for (var a = null, s = 0; s < e.GPOS.featureList.length; s++) {
                var o = e.GPOS.featureList[s];
                if ("kern" == o.tag) for (var i = 0; i < o.tab.length; i++) 2 == e.GPOS.lookupList[o.tab[i]].ltype && (a = e.GPOS.lookupList[o.tab[i]]);
            }
            if (a) for (s = 0; s < a.tabs.length; s++) {
                var r = a.tabs[s], l = _e._lctf.coverageIndex(r.coverage, t);
                if (-1 != l) {
                    if (1 == r.format) {
                        var c = r.pairsets[l];
                        for (i = 0; i < c.length; i++) c[i].gid2 == n && (h = c[i]);
                        if (null == h) continue;
                    } else if (2 == r.format) var u = _e.U._getGlyphClass(t, r.classDef1), p = _e.U._getGlyphClass(n, r.classDef2), h = r.matrix[u][p];
                    return h.val1[2];
                }
            }
        }
        if (e.kern) {
            var d = e.kern.glyph1.indexOf(t);
            if (-1 != d) {
                var m = e.kern.rval[d].glyph2.indexOf(n);
                if (-1 != m) return e.kern.rval[d].vals[m];
            }
        }
        return 0;
    }, _e.U.stringToGlyphs = function(e, t) {
        for (var n = [], a = 0; a < t.length; a++) {
            var s = t.codePointAt(a);
            s > 65535 && a++, n.push(_e.U.codeToGlyph(e, s));
        }
        var o = e.GSUB;
        if (null == o) return n;
        for (var i = o.lookupList, r = o.featureList, l = '\n\t" ,.:;!?()  \u060c', c = "\u0622\u0623\u0624\u0625\u0627\u0629\u062f\u0630\u0631\u0632\u0648\u0671\u0672\u0673\u0675\u0676\u0677\u0688\u0689\u068a\u068b\u068c\u068d\u068e\u068f\u0690\u0691\u0692\u0693\u0694\u0695\u0696\u0697\u0698\u0699\u06c0\u06c3\u06c4\u06c5\u06c6\u06c7\u06c8\u06c9\u06ca\u06cb\u06cd\u06cf\u06d2\u06d3\u06d5\u06ee\u06ef\u0710\u0715\u0716\u0717\u0718\u0719\u071e\u0728\u072a\u072c\u072f\u074d\u0759\u075a\u075b\u076b\u076c\u0771\u0773\u0774\u0778\u0779\u0840\u0846\u0847\u0849\u0854\u0867\u0869\u086a\u08aa\u08ab\u08ac\u08ae\u08b1\u08b2\u08b9\u0ac5\u0ac7\u0ac9\u0aca\u0ace\u0acf\u0ad0\u0ad1\u0ad2\u0add\u0ae1\u0ae4\u0aef\u0b81\u0b83\u0b84\u0b85\u0b89\u0b8c\u0b8e\u0b8f\u0b91\u0ba9\u0baa\u0bab\u0bac", u = 0; u < n.length; u++) {
            var p = n[u], h = 0 == u || -1 != l.indexOf(t[u - 1]), d = u == n.length - 1 || -1 != l.indexOf(t[u + 1]);
            h || -1 == c.indexOf(t[u - 1]) || (h = !0), d || -1 == c.indexOf(t[u]) || (d = !0), 
            d || -1 == "\ua872\u0acd\u0ad7".indexOf(t[u + 1]) || (d = !0), h || -1 == "\ua872\u0acd\u0ad7".indexOf(t[u]) || (h = !0);
            var m = null;
            m = h ? d ? "isol" : "init" : d ? "fina" : "medi";
            for (var f = 0; f < r.length; f++) if (r[f].tag == m) for (var y = 0; y < r[f].tab.length; y++) {
                1 == (b = i[r[f].tab[y]]).ltype && _e.U._applyType1(n, u, b);
            }
        }
        var g = [ "rlig", "liga", "mset" ];
        for (u = 0; u < n.length; u++) {
            p = n[u];
            var w = Math.min(3, n.length - u - 1);
            for (f = 0; f < r.length; f++) {
                var v = r[f];
                if (-1 != g.indexOf(v.tag)) for (y = 0; y < v.tab.length; y++) for (var b = i[v.tab[y]], k = 0; k < b.tabs.length; k++) if (null != b.tabs[k]) {
                    var x = _e._lctf.coverageIndex(b.tabs[k].coverage, p);
                    if (-1 != x) if (4 == b.ltype) for (var _ = b.tabs[k].vals[x], q = 0; q < _.length; q++) {
                        var C = _[q], T = C.chain.length;
                        if (!(T > w)) {
                            for (var A = !0, S = 0; S < T; S++) C.chain[S] != n[u + (1 + S)] && (A = !1);
                            if (A) {
                                n[u] = C.nglyph;
                                for (S = 0; S < T; S++) n[u + S + 1] = -1;
                            }
                        }
                    } else if (5 == b.ltype) {
                        var U = b.tabs[k];
                        if (2 != U.fmt) continue;
                        var H = _e._lctf.getInterval(U.cDef, p), E = U.cDef[H + 2], F = U.scset[E];
                        for (a = 0; a < F.length; a++) {
                            var j = F[a], $ = j.input;
                            if (!($.length > w)) {
                                for (A = !0, S = 0; S < $.length; S++) {
                                    var L = _e._lctf.getInterval(U.cDef, n[u + 1 + S]);
                                    if (-1 == H && U.cDef[L + 2] != $[S]) {
                                        A = !1;
                                        break;
                                    }
                                }
                                if (A) {
                                    var I = j.substLookupRecords;
                                    for (q = 0; q < I.length; q += 2) I[q], I[q + 1];
                                }
                            }
                        }
                    }
                }
            }
        }
        return n;
    }, _e.U._applyType1 = function(e, t, n) {
        for (var a = e[t], s = 0; s < n.tabs.length; s++) {
            var o = n.tabs[s], i = _e._lctf.coverageIndex(o.coverage, a);
            -1 != i && (1 == o.fmt ? e[t] = e[t] + o.delta : e[t] = o.newg[i]);
        }
    }, _e.U.glyphsToPath = function(e, t, n) {
        for (var a = {
            cmds: [],
            crds: []
        }, s = 0, o = 0; o < t.length; o++) {
            var i = t[o];
            if (-1 != i) {
                for (var r = o < t.length - 1 && -1 != t[o + 1] ? t[o + 1] : 0, l = _e.U.glyphToPath(e, i), c = 0; c < l.crds.length; c += 2) a.crds.push(l.crds[c] + s), 
                a.crds.push(l.crds[c + 1]);
                n && a.cmds.push(n);
                for (c = 0; c < l.cmds.length; c++) a.cmds.push(l.cmds[c]);
                n && a.cmds.push("X"), s += e.hmtx.aWidth[i], o < t.length - 1 && (s += _e.U.getPairAdjustment(e, i, r));
            }
        }
        return a;
    }, _e.U.pathToSVG = function(e, t) {
        null == t && (t = 5);
        for (var n = [], a = 0, s = {
            M: 2,
            L: 2,
            Q: 4,
            C: 6
        }, o = 0; o < e.cmds.length; o++) {
            var i = e.cmds[o], r = a + (s[i] ? s[i] : 0);
            for (n.push(i); a < r; ) {
                var l = e.crds[a++];
                n.push(parseFloat(l.toFixed(t)) + (a == r ? "" : " "));
            }
        }
        return n.join("");
    }, _e.U.pathToContext = function(e, t) {
        for (var n = 0, a = e.crds, s = 0; s < e.cmds.length; s++) {
            var o = e.cmds[s];
            "M" == o ? (t.moveTo(a[n], a[n + 1]), n += 2) : "L" == o ? (t.lineTo(a[n], a[n + 1]), 
            n += 2) : "C" == o ? (t.bezierCurveTo(a[n], a[n + 1], a[n + 2], a[n + 3], a[n + 4], a[n + 5]), 
            n += 6) : "Q" == o ? (t.quadraticCurveTo(a[n], a[n + 1], a[n + 2], a[n + 3]), n += 4) : "#" == o.charAt(0) ? (t.beginPath(), 
            t.fillStyle = o) : "Z" == o ? t.closePath() : "X" == o && t.fill();
        }
    }, _e.U.P = {}, _e.U.P.moveTo = function(e, t, n) {
        e.cmds.push("M"), e.crds.push(t, n);
    }, _e.U.P.lineTo = function(e, t, n) {
        e.cmds.push("L"), e.crds.push(t, n);
    }, _e.U.P.curveTo = function(e, t, n, a, s, o, i) {
        e.cmds.push("C"), e.crds.push(t, n, a, s, o, i);
    }, _e.U.P.qcurveTo = function(e, t, n, a, s) {
        e.cmds.push("Q"), e.crds.push(t, n, a, s);
    }, _e.U.P.closePath = function(e) {
        e.cmds.push("Z");
    }, _e.U._drawCFF = function(e, t, n, a) {
        for (var s = t.stack, o = t.nStems, i = t.haveWidth, r = t.width, l = t.open, c = 0, u = t.x, p = t.y, h = 0, d = 0, m = 0, f = 0, y = 0, g = 0, w = 0, v = 0, b = 0, k = 0, x = {
            val: 0,
            size: 0
        }; c < e.length; ) {
            _e.CFF.getCharString(e, c, x);
            var _ = x.val;
            if (c += x.size, "o1" == _ || "o18" == _) s.length % 2 != 0 && !i && (r = s.shift() + n.Private.nominalWidthX), 
            o += s.length >> 1, s.length = 0, i = !0; else if ("o3" == _ || "o23" == _) {
                s.length % 2 != 0 && !i && (r = s.shift() + n.Private.nominalWidthX), o += s.length >> 1, 
                s.length = 0, i = !0;
            } else if ("o4" == _) s.length > 1 && !i && (r = s.shift() + n.Private.nominalWidthX, 
            i = !0), l && _e.U.P.closePath(a), p += s.pop(), _e.U.P.moveTo(a, u, p), l = !0; else if ("o5" == _) for (;s.length > 0; ) u += s.shift(), 
            p += s.shift(), _e.U.P.lineTo(a, u, p); else if ("o6" == _ || "o7" == _) for (var q = s.length, C = "o6" == _, T = 0; T < q; T++) {
                var A = s.shift();
                C ? u += A : p += A, C = !C, _e.U.P.lineTo(a, u, p);
            } else if ("o8" == _ || "o24" == _) {
                q = s.length;
                for (var S = 0; S + 6 <= q; ) h = u + s.shift(), d = p + s.shift(), m = h + s.shift(), 
                f = d + s.shift(), u = m + s.shift(), p = f + s.shift(), _e.U.P.curveTo(a, h, d, m, f, u, p), 
                S += 6;
                "o24" == _ && (u += s.shift(), p += s.shift(), _e.U.P.lineTo(a, u, p));
            } else {
                if ("o11" == _) break;
                if ("o1234" == _ || "o1235" == _ || "o1236" == _ || "o1237" == _) "o1234" == _ && (d = p, 
                m = (h = u + s.shift()) + s.shift(), k = f = d + s.shift(), g = f, v = p, u = (w = (y = (b = m + s.shift()) + s.shift()) + s.shift()) + s.shift(), 
                _e.U.P.curveTo(a, h, d, m, f, b, k), _e.U.P.curveTo(a, y, g, w, v, u, p)), "o1235" == _ && (h = u + s.shift(), 
                d = p + s.shift(), m = h + s.shift(), f = d + s.shift(), b = m + s.shift(), k = f + s.shift(), 
                y = b + s.shift(), g = k + s.shift(), w = y + s.shift(), v = g + s.shift(), u = w + s.shift(), 
                p = v + s.shift(), s.shift(), _e.U.P.curveTo(a, h, d, m, f, b, k), _e.U.P.curveTo(a, y, g, w, v, u, p)), 
                "o1236" == _ && (h = u + s.shift(), d = p + s.shift(), m = h + s.shift(), k = f = d + s.shift(), 
                g = f, w = (y = (b = m + s.shift()) + s.shift()) + s.shift(), v = g + s.shift(), 
                u = w + s.shift(), _e.U.P.curveTo(a, h, d, m, f, b, k), _e.U.P.curveTo(a, y, g, w, v, u, p)), 
                "o1237" == _ && (h = u + s.shift(), d = p + s.shift(), m = h + s.shift(), f = d + s.shift(), 
                b = m + s.shift(), k = f + s.shift(), y = b + s.shift(), g = k + s.shift(), w = y + s.shift(), 
                v = g + s.shift(), Math.abs(w - u) > Math.abs(v - p) ? u = w + s.shift() : p = v + s.shift(), 
                _e.U.P.curveTo(a, h, d, m, f, b, k), _e.U.P.curveTo(a, y, g, w, v, u, p)); else if ("o14" == _) {
                    if (s.length > 0 && !i && (r = s.shift() + n.nominalWidthX, i = !0), 4 == s.length) {
                        var U = s.shift(), H = s.shift(), E = s.shift(), F = s.shift(), j = _e.CFF.glyphBySE(n, E), $ = _e.CFF.glyphBySE(n, F);
                        _e.U._drawCFF(n.CharStrings[j], t, n, a), t.x = U, t.y = H, _e.U._drawCFF(n.CharStrings[$], t, n, a);
                    }
                    l && (_e.U.P.closePath(a), l = !1);
                } else if ("o19" == _ || "o20" == _) {
                    s.length % 2 != 0 && !i && (r = s.shift() + n.Private.nominalWidthX), o += s.length >> 1, 
                    s.length = 0, i = !0, c += o + 7 >> 3;
                } else if ("o21" == _) s.length > 2 && !i && (r = s.shift() + n.Private.nominalWidthX, 
                i = !0), p += s.pop(), u += s.pop(), l && _e.U.P.closePath(a), _e.U.P.moveTo(a, u, p), 
                l = !0; else if ("o22" == _) s.length > 1 && !i && (r = s.shift() + n.Private.nominalWidthX, 
                i = !0), u += s.pop(), l && _e.U.P.closePath(a), _e.U.P.moveTo(a, u, p), l = !0; else if ("o25" == _) {
                    for (;s.length > 6; ) u += s.shift(), p += s.shift(), _e.U.P.lineTo(a, u, p);
                    h = u + s.shift(), d = p + s.shift(), m = h + s.shift(), f = d + s.shift(), u = m + s.shift(), 
                    p = f + s.shift(), _e.U.P.curveTo(a, h, d, m, f, u, p);
                } else if ("o26" == _) for (s.length % 2 && (u += s.shift()); s.length > 0; ) h = u, 
                d = p + s.shift(), u = m = h + s.shift(), p = (f = d + s.shift()) + s.shift(), _e.U.P.curveTo(a, h, d, m, f, u, p); else if ("o27" == _) for (s.length % 2 && (p += s.shift()); s.length > 0; ) d = p, 
                m = (h = u + s.shift()) + s.shift(), f = d + s.shift(), u = m + s.shift(), p = f, 
                _e.U.P.curveTo(a, h, d, m, f, u, p); else if ("o10" == _ || "o29" == _) {
                    var L = "o10" == _ ? n.Private : n;
                    if (0 == s.length) console.log("error: empty stack"); else {
                        var I = s.pop(), P = L.Subrs[I + L.Bias];
                        t.x = u, t.y = p, t.nStems = o, t.haveWidth = i, t.width = r, t.open = l, _e.U._drawCFF(P, t, n, a), 
                        u = t.x, p = t.y, o = t.nStems, i = t.haveWidth, r = t.width, l = t.open;
                    }
                } else if ("o30" == _ || "o31" == _) {
                    var O = s.length, M = (S = 0, "o31" == _);
                    for (S += O - (q = -3 & O); S < q; ) M ? (d = p, m = (h = u + s.shift()) + s.shift(), 
                    p = (f = d + s.shift()) + s.shift(), q - S == 5 ? (u = m + s.shift(), S++) : u = m, 
                    M = !1) : (h = u, d = p + s.shift(), m = h + s.shift(), f = d + s.shift(), u = m + s.shift(), 
                    q - S == 5 ? (p = f + s.shift(), S++) : p = f, M = !0), _e.U.P.curveTo(a, h, d, m, f, u, p), 
                    S += 4;
                } else {
                    if ("o" == (_ + "").charAt(0)) throw console.log("Unknown operation: " + _, e), 
                    _;
                    s.push(_);
                }
            }
        }
        t.x = u, t.y = p, t.nStems = o, t.haveWidth = i, t.width = r, t.open = l;
    };
 
    const qe = getDefaultExportFromCjs(_e), decode = async () => {
        var e;
        const t = se.document.querySelectorAll("style");
        let n = null;
        if (t.forEach((e => {
            var t;
            -1 !== (null == (t = e.textContent) ? void 0 : t.indexOf("font-cxsecret")) && (n = e);
        })), !n) return !0;
        const a = null == (e = n.textContent) ? void 0 : e.match(/base64,([\w\W]+?)'/);
        if (!a) return;
        const s = base64ToUint8Array(a[1]), o = qe.parse(s);
        let i = await ttfDownload1("https://www.forestpolice.org/ttf/2.0/table.json") || await ttfDownload1("https://cdn.jsdelivr.net/gh/chengbianruan/staticfile/c.json");
        if (!i) return !1;
        let r = {};
        for (let l = 19968; l < 40870; l++) {
            let e = qe.U.codeToGlyph(o, l);
            e && (e = qe.U.glyphToPath(o, e), e = somd5(JSON.stringify(e)).slice(24), r[l] = i[e]);
        }
        return se.document.querySelectorAll(".font-cxsecret").forEach((e => {
            let t = e.innerHTML;
            Object.keys(r).forEach((e => {
                const n = new RegExp(String.fromCharCode(e), "g");
                t = t.replace(n, String.fromCharCode(r[e]));
            })), e.innerHTML = t, e.classList.remove("font-cxsecret");
        })), !0;
    }, base64ToUint8Array = e => {
        const t = atob(e), n = new Uint8Array(t.length);
        for (let a = 0; a < t.length; a++) n[a] = t.charCodeAt(a);
        return n;
    }, Ce = [ {
        type: "save",
        name: "\u5b66\u4e60\u901a\u8003\u8bd5\u65b0\u7248\u6536\u5f55",
        match: () => location.href.includes("work/view") || location.href.includes("test/reVersionPaperMarkContentNew"),
        question: {
            html: ".questionLi",
            question: "h3.mark_name",
            options: "ul.mark_letter.colorDeep > li",
            type: ".colorShallow",
            workType: "zj",
            pageType: "cx"
        },
        answerHook: e => {
            let t = removeHtml(D(e.html).find('span[class="colorShallow"]').html());
            if ("" === t) return null;
            let n = t.match(/^\((.+?)\)/);
            if (null === n) return null;
            e.type = n[1].split(",")[0], e.question = titleClean(e.question.split(t)[1].trim()).trim(), 
            e.options = removeStartChar(e.options);
            const a = D(e.html).find(".mark_score>.totalScore>i").text(), s = t.match(/(\d+(\.\d+)?)/);
            let o, i = D(e.html).find(".marking_dui").length > 0 || a == ((null == s ? void 0 : s[0]) || 0);
            switch (e.type) {
              case "\u5355\u9009\u9898":
              case "\u591a\u9009\u9898":
                e.type = "\u5355\u9009\u9898" === e.type ? "0" : "1", e.answer = D(e.html).find(".mark_answer>div>span.colorGreen:eq(0)").text().replace("\u6b63\u786e\u7b54\u6848:", "").trim().split("").map((t => e.options[t.charCodeAt(0) - 65])), 
                e.answer = e.answer.filter((e => "" !== e)), 0 === e.answer.length && i && (e.answer = D(e.html).find(".mark_answer>div>span.colorDeep:eq(0)").text().replace("\u6211\u7684\u7b54\u6848:", "").trim().split("").map((t => e.options[t.charCodeAt(0) - 65])), 
                e.answer = e.answer.filter((e => "" !== e)));
                break;
 
              case "\u5224\u65ad\u9898":
                if (e.type = "3", e.options = [], e.answer = judgeAnswer(D(e.html).find(".mark_answer>div>span.colorGreen:eq(0)").text().replace("\u6b63\u786e\u7b54\u6848", "")), 
                e.answer, 0 === e.answer.length) {
                    if (o = removeHtml(D(e.html).find(".mark_answer>div>span.colorDeep:eq(0)").html()), 
                    e.answer = judgeAnswer(o), 0 === e.answer.length) return null;
                    i || (e.answer = "\u6b63\u786e" === e.answer[0] ? [ "\u9519\u8bef" ] : [ "\u6b63\u786e" ]);
                }
                break;
 
              case "\u7b80\u7b54\u9898":
                if (e.type = "4", e.answer = removeHtml(D(e.html).find(".mark_answer>div>.colorGreen:eq(0)").html()).replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim(), 
                e.answer.length < 10) return null;
                e.answer = [ e.answer ];
                break;
 
              case "\u540d\u8bcd\u89e3\u91ca":
                if (e.type = "5", e.answer = removeHtml(D(e.html).find(".mark_answer>div>.colorGreen:eq(0)").html()).replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim(), 
                e.answer.length < 10) return null;
                e.answer = [ e.answer ];
                break;
 
              case "\u8ba1\u7b97\u9898":
                if (e.type = "7", e.answer = removeHtml(D(e.html).find(".mark_answer>div>.colorGreen:eq(0)").html()).replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim(), 
                e.answer.length < 10) return null;
                e.answer = [ e.answer ];
                break;
 
              case "\u8bba\u8ff0\u9898":
                if (e.type = "6", e.answer = removeHtml(D(e.html).find(".mark_answer>div>.colorGreen:eq(0)").html()).replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim(), 
                e.answer.length < 10) return null;
                e.answer = [ e.answer ];
                break;
 
              case "\u586b\u7a7a\u9898":
                if (e.type = "2", e.answer = D(e.html).find(".mark_answer>div>.colorGreen:eq(0)>dd").map(((e, t) => removeHtml(D(t).html()).replace(`(${e + 1})`, "").trim())).get(), 
                0 == e.answer.length) {
                    const t = D(e.html).find(".mark_answer>div>.colorDeep:eq(0)>dd").map(((e, t) => removeHtml(D(t).html()).replace(`(${e + 1})`, "").trim())).get();
                    D(e.html).find(".mark_answer>div>.colorDeep:eq(0)>dd>.marking_dui").length == t.length && (e.answer = t);
                }
                break;
 
              default:
                return null;
            }
            return e;
        },
        paper: async e => {
            const t = {
                platform: "cx"
            }, n = D("#courseId").val(), a = (se.document.body.innerHTML.match(/(?:examId|relationId)=(\d+)/) || [])[1] || "", s = `https://mobilelearn.chaoxing.com/v2/apis/class/getClassDetail?courseId=${n}&classId=${D("#classId").val()}`;
            await request(s, "GET").then((e => {
                const n = JSON.parse(e[0].responseText).data.course.data[0];
                t.name = n.name, t.info = {}, t.info.imageurl = n.imageurl;
            })), t.hash = n, t.info = {}, t.chapter = [ {
                hash: `${a}`,
                name: D(".mark_title").text().trim(),
                question: e
            } ], xe.setPaper(t.hash, t);
        }
    }, {
        type: "hook",
        name: "hook",
        match: location.href.includes("work/selectWorkQuestionYiPiYue") && location.href.includes("mooc2=0"),
        main: e => {
            location.href.includes("mooc2=0") ? se.location.href = location.href.replace("mooc2=0", "mooc2=1") : se.location.href = location.href + "&mooc2=1";
        }
    }, {
        type: "save",
        name: "\u5b66\u4e60\u901a\u4f5c\u4e1a\u6536\u5f55\u65b0",
        match: () => location.href.includes("work/selectWorkQuestionYiPiYue") && location.href.includes("mooc2=1"),
        question: {
            html: ".TiMu",
            question: ".Zy_TItle .clearfix",
            options: "ul.Zy_ulTop li",
            type: ".newZy_TItle",
            workType: "zj",
            pageType: "cx"
        },
        answerHook: e => {
            e.type = D(e.html).find(".newZy_TItle").text().replace(/\u3010|\u3011/g, "").trim();
            let t, n = D(e.html).find(".marking_dui").length > 0;
            switch (removeHtml(D(e.html).find(".Py_addpy:eq(0)").html()), e.question = titleClean(e.question).trim(), 
            e.type) {
              case "\u5355\u9009\u9898":
              case "\u591a\u9009\u9898":
                e.type = "\u5355\u9009\u9898" === e.type ? "0" : "1", e.options = D(e.html).find("ul.Zy_ulTop li").map(((e, t) => {
                    let n = D(t).find("i.fl").text().trim(), a = removeHtml(D(t).html());
                    return "" === n ? a.trim() : a.split(n)[1].trim();
                })).get(), e.answer = D(e.html).find(".correctAnswer >.fl.answerCon").text().trim().split("").map((t => e.options[t.charCodeAt(0) - 65])), 
                0 === e.answer.length && n && (e.answer = D(e.html).find(".myAnswer > .fl.answerCon").text().trim().split("").map((t => e.options[t.charCodeAt(0) - 65])));
                break;
 
              case "\u5224\u65ad\u9898":
                if (e.type = "3", e.answer = D(e.html).find(".correctAnswer > .fl.answerCon").text().trim().split("").map((e => e.includes("\u6b63\u786e") || e.includes("\u5bf9") || e.includes("\u221a") ? "\u6b63\u786e" : e.includes("\u9519\u8bef") || e.includes("\u9519") || e.includes("\xd7") ? "\u9519\u8bef" : null)).filter((e => null !== e)), 
                0 === e.answer.length) {
                    t = removeHtml(D(e.html).find(".fl.answerCon").html());
                    let [n, a] = [ ".marking_dui", ".marking_cuo" ].map((t => D(e.html).find(t).length));
                    if (n + a === 0) return null;
                    if (t.includes("\u6b63\u786e") || t.includes("\u5bf9") || t.includes("\u221a")) e.answer = [ "\u6b63\u786e" ]; else {
                        if (!(t.includes("\u9519\u8bef") || t.includes("\u9519") || t.includes("\xd7"))) return null;
                        e.answer = [ "\u9519\u8bef" ];
                    }
                    0 === n && 0 !== a && (e.answer = "\u6b63\u786e" === e.answer[0] ? "\u9519\u8bef" : "\u6b63\u786e");
                }
                break;
 
              case "\u586b\u7a7a\u9898":
                e.type = "2", e.answer = D(e.html).find(".correctAnswerBx>.correctAnswer>p:not(.clear)").map(((e, t) => removeHtml(D(t).html()).replace(`(${e + 1})`, "").trim())).get().filter((e => "" !== e)), 
                0 == e.answer.length && (e.answer = D(e.html).find(".myAllAnswerBx>.myAnswerBx>.myAnswer").map(((e, t) => removeHtml(D(t).html()).replace(/\u7b2c[\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d]+\u7a7a\uff1a/, "").trim())).get(), 
                e.answer.length !== D(e.html).find(".marking_dui").length && (e.answer = []));
                break;
 
              case "\u5206\u5f55\u9898":
                if (e.type = "9", e.answer = D(e.html).find(".correctAnswerBx>.correctAnswer>p:not(.clear)").map(((e, t) => removeHtml(D(t).html()))).get().filter((e => "" !== e)), 
                e.answer.length != D(e.html).find(".CorrectOrNot").length) {
                    if (D(e.html).find(".marking_cuo").length > 0) return null;
                    if (e.answer = D(e.html).find(".myAnswerBx>.myAnswer>p:not(.clear)").map(((e, t) => removeHtml(D(t).html()))).get().filter((e => "" !== e)), 
                    e.answer.length != D(e.html).find(".CorrectOrNot").length) return null;
                }
                e.answer;
                break;
 
              case "\u8fde\u7ebf\u9898":
                e.type = "11";
                let a = D(e.html).find("ul.firstUlList>li:not(.groupTitile)").map(((e, t) => {
                    let n = D(t).clone();
                    return n.find(".fl").remove(), removeHtml(n.html());
                })).get(), s = D(e.html).find("ul.secondUlList>li:not(.groupTitile)").map(((e, t) => {
                    let n = D(t).clone();
                    return n.find(".fl").remove(), removeHtml(n.html());
                })).get();
                t = D(e.html).find(".correctAnswer >.fl.answerCon >.collectAnswer").map(((e, t) => removeHtml(D(t).text()))).get(), 
                e.options = [ a, s ];
                let o = {};
                t.forEach((e => {
                    let [t, n] = e.split("-");
                    t.charCodeAt(0) >= 65 ? t = (t.charCodeAt(0) - 65).toString() : /^\d+$/.test(t) && (t = (parseInt(t) - 1).toString()), 
                    n.charCodeAt(0) >= 65 ? n = (n.charCodeAt(0) - 65).toString() : /^\d+$/.test(n) && (n = (parseInt(n) - 1).toString()), 
                    o[a[t]] = s[n];
                })), e.answer = o, e.answer;
                break;
 
              default:
                return e.type, null;
            }
            return e;
        },
        paper: async e => {
            const t = {
                platform: "cx"
            }, n = se.courseId, a = se.jobid, s = `https://mobilelearn.chaoxing.com/v2/apis/class/getClassDetail?courseId=${n}&classId=${se.classId}`;
            await request(s, "GET").then((e => {
                const n = JSON.parse(e[0].responseText).data.course.data[0];
                t.name = n.name, t.info = {}, t.info.imageurl = n.imageurl;
            })), t.hash = n, t.info = {}, t.chapter = [ {
                hash: `${a}`,
                name: D(".ceyan_name>h3").text().trim(),
                question: e
            } ], xe.setPaper(t.hash, t);
        }
    }, {
        type: "ask",
        name: "\u5b66\u4e60\u901a\u65b0\u7248\u4f5c\u4e1a",
        match: /\/mooc2\/work\/dowork/i.test(location.pathname),
        question: {
            html: ".questionLi",
            question: "h3",
            options: "ul:eq(0) li .after, .answer_p",
            type: "input[name^=answertype]:eq(0)",
            workType: "zy",
            pageType: "cx"
        },
        questionHook: e => {
            const t = removeHtml(D(e.html).find(".colorShallow").html());
            return e.question = titleClean(e.question.split(t)[1].trim()).trim(), e.$options = D(e.html).find(".answerBg"), 
            e;
        },
        setAnswerHook: e => {
            qc(e.html), qc1(e.html);
        }
    }, {
        type: "ask",
        name: "\u5b66\u4e60\u901a\u65b0\u7248\u8003\u8bd5",
        match: /exam\/preview/i.test(location.pathname) || /exam\/test\/reVersionTestStartNew/i.test(location.pathname),
        question: {
            html: ".questionLi",
            question: "h3",
            options: "ul:eq(0) li .after, .answer_p",
            type: "input[name^=type]:not([name=type])",
            workType: "ks",
            pageType: "cx"
        },
        questionHook: e => {
            const t = removeHtml(D(e.html).find(".colorShallow").html());
            if (e.question = titleClean(e.question.split(t)[1].trim()).trim(), e.$options = D(e.html).find(".answerBg"), 
            "3" === e.type) e.options = [];
            return e;
        },
        setAnswerHook: e => {
            qc(e.html), qc1(e.html);
        },
        next: () => {
            D('.nextDiv .jb_btn:contains("\u4e0b\u4e00\u9898")').click();
        }
    }, {
        type: "ask",
        name: "\u5b66\u4e60\u901a\u65e7\u7248\u4f5c\u4e1a",
        match: /work\/doHomeWorkNew/i.test(location.pathname) && 0 == location.href.includes("mooc2=1"),
        init: async () => {
            if (!(await decode())) return msg("\u9875\u9762\u89e3\u5bc6\u5931\u8d25\uff0c\u65e0\u6cd5\u7b54\u9898\uff0c\u8bf7\u5c1d\u8bd5\u5207\u6362\u7f51\u7edc\u6216\u53cd\u9988\u7ed9\u4f5c\u8005\u5427", "error"), 
            !1;
        },
        question: {
            html: ".TiMu",
            question: ".clearfix.fontLabel",
            options: "ul:eq(0) li .after",
            type: "input[name^=answertype]:eq(0), .answer_p",
            workType: "zy",
            pageType: "cx"
        },
        questionHook: e => {
            switch (e.question = titleClean(e.question).trim(), e.$options = D(e.html).find(".fl.before"), 
            e.type) {
              case "3":
                e.options = D(e.html).find("ul:eq(0) li").map(((e, t) => D(t).find(".ri").length > 0 ? "\u6b63\u786e" : D(t).find(".wr").length > 0 ? "\u9519\u8bef" : isTrue(D(t).attr("aria-label") || "") ? "\u6b63\u786e" : isFalse(D(t).attr("aria-label") || "") ? "\u9519\u8bef" : void 0)).get(), 
                e.options = [], e.$options = D(e.html).find("ul>li");
                break;
 
              case "11":
                let t = D(e.html).find("ul.firstUlList>li:not(.groupTitile)").map(((e, t) => {
                    let n = D(t).clone();
                    return n.find(".fl").remove(), removeHtml(n.html());
                })).get(), n = D(e.html).find("ul.secondUlList>li:not(.groupTitile)").map(((e, t) => {
                    let n = D(t).clone();
                    return n.find(".fl").remove(), removeHtml(n.html());
                })).get();
                e.options = [ t, n ], e.$options = D(e.html).find("ul.thirdUlList>li:not(.groupTitile)");
            }
            return e;
        },
        setAnswerHook: e => {
            qc(e.html), qc1(e.html);
        },
        setAnswer: e => {
            switch (e.type) {
              case "11":
                return e.ques.$options.each(((t, n) => {
                    let a = e.ques.options[0], s = e.ques.options[1], o = e.answer[a[t]], i = s.indexOf(o);
                    o = String.fromCharCode(i + 65), D(n).find("select>option").each(((e, t) => {
                        D(t).val(), D(t).val() == o && D(t).prop("selected", !0);
                    }));
                })), e.answer, !1;
 
              case "3":
                let t = e.answer;
                return e.ques.$options.each(((e, n) => {
                    isTrue(t) && isTrue(removeHtml(D(n).html())) && D(n).find("input").click(), isFalse(t) && isFalse(removeHtml(D(n).html())) && D(n).find("input").click();
                })), !1;
 
              default:
                return !0;
            }
        }
    }, {
        type: "ask",
        name: "\u5b66\u4e60\u901a\u65b0\u7248\u7ae0\u8282",
        match: /work\/doHomeWorkNew/i.test(location.pathname) && location.href.includes("mooc2=1"),
        init: async () => {
            if (!(await decode())) return msg("\u9875\u9762\u89e3\u5bc6\u5931\u8d25\uff0c\u65e0\u6cd5\u7b54\u9898\uff0c\u8bf7\u5c1d\u8bd5\u5207\u6362\u7f51\u7edc\u6216\u53cd\u9988\u7ed9\u4f5c\u8005\u5427", "error"), 
            !1;
        },
        question: {
            html: ".TiMu",
            question: ".clearfix.fontLabel",
            options: "ul:eq(0) li .after, .answer_p",
            type: "input[name^=answertype]:eq(0)",
            workType: "zj",
            pageType: "cx"
        },
        questionHook: e => {
            switch (e.question = titleClean(e.question).trim(), e.type) {
              case "3":
                e.options = D(e.html).find("ul:eq(0) li").map(((e, t) => "true" === D(t).find(".num_option").attr("data") ? "\u6b63\u786e" : "false" === D(t).find(".num_option").attr("data") ? "\u9519\u8bef" : void 0)).get(), 
                e.options = [];
                break;
 
              case "11":
                let t = D(e.html).find("ul.firstUlList>li:not(.groupTitile)").map(((e, t) => {
                    let n = D(t).clone();
                    return n.find(".fl").remove(), removeHtml(n.html());
                })).get(), n = D(e.html).find("ul.secondUlList>li:not(.groupTitile)").map(((e, t) => {
                    let n = D(t).clone();
                    return n.find(".fl").remove(), removeHtml(n.html());
                })).get();
                e.options = [ t, n ], e.$options = D(e.html).find("ul.thirdUlList>li:not(.groupTitile)");
                break;
 
              default:
                e.type;
            }
            return e;
        },
        setAnswerHook: e => {
            qc(e.html), qc1(e.html);
        },
        setAnswer: e => (e.ques.options, "11" !== e.type || (e.ques.$options.each(((t, n) => {
            let a = e.ques.options[0], s = e.ques.options[1], o = e.answer[a[t]], i = s.indexOf(o);
            o = String.fromCharCode(i + 65), se.$(n).find(".dept_select").chosen().val(o).trigger("chosen:updated");
        })), e.answer, !1))
    } ], Te = [ {
        type: "ask",
        name: "\u667a\u6167\u6811\u7ae0\u8282",
        tips: "\u667a\u6167\u6811\u5fc5\u987b\u5f00\u81ea\u52a8\u8df3\u8f6c\uff0c\u5426\u5219\u7b54\u6848\u53ef\u80fd\u65e0\u6cd5\u4fdd\u5b58\u5bfc\u81f4\u4f4e\u5206\uff01",
        match: location.href.includes("zhihuishu.com") && !location.href.includes("checkHomework") && location.host.includes("zhihuishu") && ("/stuExamWeb.html" === location.pathname || location.href.includes("/webExamList/dohomework/") || location.href.includes("/webExamList/doexamination/")),
        question: {
            html: ".examPaper_box > div:eq(1) >div:not(.examPaper_partTit)",
            question: ".subject_describe.dynamic-fonts:eq(0) div:eq(0)",
            options: ".subject_node .nodeLab .label.clearfix .node_detail",
            type: ".subject_type span:first-child",
            workType: "zhs",
            pageType: "zhs"
        },
        init: async () => {
            await waitUntil((function() {
                return !D(".yidun_popup").hasClass("yidun_popup--light") && se.zhsques;
            }));
        },
        next: () => {
            D(".switch-btn-box button:eq(1)").click();
        },
        questionHook: (e, t) => {
            const n = se.zhsques.examBase.workExamParts.map((e => e.questionDtos)).flat()[t];
            return e.type = typeConvert(n.questionType.name), e.question = removeHtml(n.name), 
            e.options = n.questionOptions ? n.questionOptions.map((e => removeHtml(e.content))) : [], 
            "3" == e.type && (e.options = []), e;
        }
    }, {
        type: "save",
        name: "\u667a\u6167\u6811\u4f5c\u4e1a\u6536\u5f55",
        match: location.href.includes("zhihuishu.com") && location.href.includes("checkHomework") && location.host.includes("zhihuishu") && ("/stuExamWeb.html" === location.pathname || location.href.includes("/webExamList/checkHomework/")),
        question: {
            html: ".questionType",
            question: ".subject_describe",
            options: ".examquestions-answer",
            type: ".newZy_TItle",
            workType: "zhs",
            pageType: "zhs"
        },
        init: async () => {
            await waitUntil((function() {
                return D(".questionType").length > 0 && se.zhsques && se.zhsimgAnswer;
            }));
        },
        answerHook: e => {
            let t = D(e.html).find(".examPaper_subject").attr("data-questionid");
            const n = se.zhsimgAnswer;
            let a = se.zhsques.examBase.workExamParts.map((e => e.questionDtos)).flat().find((e => e.id == t));
            return a.answer = n[a.id], e.question = removeHtml(a.name), e.type = typeConvert(a.questionType.name), 
            e.options = a.questionOptions.map((e => removeHtml(e.content))), e.answer = a.answer.split("").map((t => e.options[t.charCodeAt(0) - 65])), 
            "3" == e.type && (e.options = [], e.answer = isTrue(e.answer[0]) ? [ "\u6b63\u786e" ] : isFalse(e.answer[0]) ? [ "\u9519\u8bef" ] : []), 
            e;
        }
    } ], Ae = [ {
        type: "hook",
        name: "\u82af\u4f4d\u6559\u80b2hook",
        match: "www.beeline-ai.com" === location.host,
        main: e => {
            se.mainClass = D(".el-main > div:eq(0)").attr("class");
            let t = new MutationObserver((async e => {
                se.mainClass !== D(".el-main > div:eq(0)").attr("class") && (se.mainClass = D(".el-main > div:eq(0)").attr("class"), 
                "homework-detail-container" === se.mainClass && await waitUntil((function() {
                    return 0 === D(".el-loading-mask").length;
                })), vuePageChange$1(), t.disconnect());
                for (let n of e) "attributes" === n.type && "class" === n.attributeName && n.target.textContent && (n.target.textContent.includes("\u4e0b\u4e00\u9898") || n.target.textContent.includes("\u4e0a\u4e00\u9898")) && (t.disconnect(), 
                vuePageChange$1());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u82af\u4f4d\u6559\u80b2\u4f5c\u4e1a",
        tips: "\u82af\u4f4d\u6559\u80b2\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad\uff0c\u5176\u4ed6\u9898\u578b\u5f85\u9002\u914d",
        match: () => "www.beeline-ai.com" === location.host && (/student\/#\/courseInfo\/[A-Za-z0-9]+\/homework/i.test(location.href) || /student\/#\/courseInfo\/[A-Za-z0-9]+\/exam/i.test(location.href)),
        question: {
            html: ".content-area > div.content",
            question: ".content",
            options: ".el-radio-group label .label,.el-checkbox-group label .label",
            type: ".question-box .tag",
            workType: "xinwei",
            pageType: "xinwei"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".question-box").length;
            }));
        },
        next: () => {
            D('.toggle-box > button:contains("\u4e0b\u4e00\u9898")').click();
        },
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => (e.type = typeMatch(D(e.html).find(".question-box>.tag").text()), 
        e)
    }, {
        type: "save",
        name: "\u82af\u4f4d\u6559\u80b2\u6536\u5f55",
        match: () => "www.beeline-ai.com" === location.host && location.href.includes("/homeworkDetailPage"),
        question: {
            html: ".question-content-body",
            question: ".topic-title",
            options: ".el-radio-group label .label,.el-checkbox-group label .label",
            type: ".question-box .tag",
            workType: "xinwei",
            pageType: "xinwei"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".question-content-body").length;
            }));
        },
        answerHook: e => {
            e.type = typeMatch(D(e.html).find(".question-box>.tag").text());
            let t = D(e.html).find(".answer-area > span:eq(1)").text();
            switch (e.type) {
              case "0":
              case "1":
                let n = t.split(",");
                if (e.answer = n.map((t => e.options[t.charCodeAt(0) - 65])), 0 === e.answer.length) return;
                break;
 
              case "3":
                "T" == t && (e.answer = [ "\u6b63\u786e" ]), "F" == t && (e.answer = [ "\u9519\u8bef" ]);
            }
            return e;
        }
    } ], Se = [ {
        type: "hook",
        name: "\u667a\u666e\u6e05\u8a00token\u83b7\u53d6",
        match: /chatglm.cn\/main\//i.test(location.href),
        main: e => {
            const t = e.app, n = document.cookie.split(";");
            let a = "";
            n.forEach((e => {
                /chatglm_refresh_token/i.test(e) && (a = e.split("=")[1]);
            })), a && (t.app.gpt.forEach((e => {
                "GLM" === e.name && (e.key = a);
            })), t.setConfig(t.app), msg("\u667a\u666e\u6e05\u8a00token\u83b7\u53d6\u6210\u529f"));
        }
    }, {
        type: "hook",
        name: "\u8baf\u98de\u661f\u706btoken\u83b7\u53d6",
        match: /xinghuo.xfyun.cn\/desk/i.test(location.href),
        main: e => {
            const t = e.app, n = document.cookie.split(";");
            let a = "";
            n.forEach((e => {
                /ssoSessionId/i.test(e) && (a = e.split("=")[1]);
            })), a && (t.app.gpt.forEach((e => {
                "spark" === e.name && (e.key = a);
            })), t.setConfig(t.app), msg("\u8baf\u98de\u661f\u706btoken\u83b7\u53d6\u6210\u529f"));
        }
    } ], Ue = {
        single_selection: "\u5355\u9009\u9898",
        multiple_selection: "\u591a\u9009\u9898",
        true_or_false: "\u5224\u65ad\u9898",
        fill_in_blank: "\u586b\u7a7a\u9898",
        short_answer: "\u7b80\u7b54\u9898",
        text: "\u6587\u672c",
        analysis: "\u7efc\u5408\u9898",
        matching: "\u5339\u914d\u9898",
        random: "\u968f\u673a\u9898",
        cloze: "\u5b8c\u5f62\u586b\u7a7a\u9898"
    }, He = [ {
        type: "hook",
        name: "\u56fd\u5f00hook",
        match: location.host.includes("ouchn.cn"),
        main: e => {
            se.mainClass = getUrl();
            let t = new MutationObserver((async e => {
                se.mainClass !== getUrl() && (se.mainClass = getUrl(), "homework-detail-container" === se.mainClass && await waitUntil((function() {
                    return 0 !== D(".selectDan").length;
                })), vuePageChange$1(), t.disconnect());
            }));
            D("body").length >= 1 && t.observe(D("body")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "save",
        name: "\u56fd\u5f00\u7b54\u6848\u6536\u5f55\u65e7",
        match: /\/exam\/([0-9]+)\/subjects#\/submission\/([0-9]+)/i.test(location.href),
        question: {
            html: "li.subject",
            question: ".summary-title .subject-description",
            options: ".subject-options li .option-content",
            type: ".subject-point > span:eq(0)",
            workType: "guokai",
            pageType: "guokai"
        },
        init: async () => {
            await waitUntil((function() {
                return D(".loading-gif").hasClass("ng-hide");
            }));
        },
        answerHook: e => {
            const t = se.angular.element(e.html).scope().subject;
            if ("text" === t.type) return;
            let n = !1;
            const a = parseFloat(t.point), s = parseFloat(t.score), o = 0 !== a && a === s;
            let i = D(`<div>${t.description}</div>`).clone();
            if (i.find("span.__blank__").remove(), e.question = removeHtml(i.html()), e.options = t.options.map((e => removeHtml(e.content))), 
            e.type = typeConvert(Ue[t.type]), t.correctOptions && t.correctOptions.length > 0 && (e.answer = t.correctOptions.map((e => removeHtml(e.content))), 
            n = !0), t.correct_answers && t.correct_answers.length > 0 && (e.answer = t.correct_answers.map((e => e.content)), 
            n = !0), n || o || "true_or_false" === t.type) {
                switch (t.type) {
                  case "single_selection":
                  case "multiple_selection":
                  case "true_or_false":
                    if (n) {
                        if ("true_or_false" === t.type) {
                            const t = e.answer[0];
                            e.options = [];
                            const n = isTrue(t) ? "\u6b63\u786e" : isFalse(t) ? "\u9519\u8bef" : "";
                            n && (e.answer = [ n ]);
                        }
                    } else {
                        if (e.answer = t.options.filter((e => e.isChosen)).map((e => removeHtml(e.content))), 
                        0 === e.answer.length) return;
                        if ("true_or_false" === t.type) {
                            const t = e.answer[0];
                            e.options = [];
                            const n = isTrue(t) ? "\u6b63\u786e" : isFalse(t) ? "\u9519\u8bef" : "";
                            e.answer = n ? [ o ? n : "\u6b63\u786e" === n ? "\u9519\u8bef" : "\u6b63\u786e" ] : [];
                        }
                    }
                    break;
 
                  case "analysis":
                    break;
 
                  case "cloze":
                    t.sub_subjects, e.options = t.sub_subjects.map((e => e.options.map((e => removeHtml(e.content)))));
                    break;
 
                  case "fill_in_blank":
                    n || (e.answer = t.answers.map((e => e.content)));
                }
                return e;
            }
        },
        paper: e => {
            const t = se.globalData.course, n = se.angular.element(D("body")).scope(), a = se.angular.element(D(".hd")).scope().exam, s = n.submissionData.id;
            if (!n.examSubmissions.find((e => (e.id, String(e.id) === String(s))))) return;
            const o = {
                platform: "guokai"
            };
            o.hash = t.id, o.name = t.name, o.info = {}, o.info.school = t.orgName, o.chapter = [ {
                hash: `${a.id}`,
                name: a.title,
                question: e
            } ], xe.setPaper(o.hash, o);
        }
    }, {
        type: "save",
        name: "\u5e7f\u5f00\u7b54\u6848\u6536\u5f55",
        match: /mod\/quiz\/review\.php/i.test(location.pathname) && [ "moodle.syxy.ouchn.cn", "xczxzdbf.moodle.qwbx.ouchn.cn", "elearning.bjou.edu.cn", "whkpc.hnqtyq.cn:5678", "course.ougd.cn", "study.ouchn.cn" ].includes(location.host),
        question: {
            html: ".que",
            question: ".qtext",
            options: ".answer > div",
            type: "",
            answer: ".rightanswer",
            workType: "ougd",
            pageType: "ougd"
        },
        init: async () => {
            D(".specificfeedback").remove();
        },
        next: async () => {
            !D(".qn_buttons > a").last().hasClass("thispage") && D(".arrow_text").click();
        },
        answerHook: e => {
            const t = D(e.html).find(".info .state").text();
            switch (e.type = (D(e.html).attr("class") || "").split(" ")[1], D(e.html).find(".qtext .accesshide").remove(), 
            e.question = removeHtml(D(e.html).find(".qtext").html()), e.type, e.type) {
              case "truefalse":
                e.type = "3", e.$options = D(e.html).find("input[type=radio]"), e.options = D(e.html).find(".answer > div").map(((e, t) => removeHtml(D(t).html()).trim())).get(), 
                e.answer = [], e.answer = D(e.html).find(".answer > div").map(((t, n) => e.$options.eq(t).prop("checked") ? e.options[t] : "")).get(), 
                e.answer = e.answer.filter((e => "" !== e)), 0 === e.answer.length ? (e.temp = removeHtml(D(e.html).find(".rightanswer").html()).replace("\u6b63\u786e\u7b54\u6848\u662f", "").trim(), 
                e.answer = [ e.temp ]) : t.includes("\u6b63\u786e") || (e.answer = e.options.filter((t => !t.includes(e.answer[0])))), 
                isTrue(e.answer[0]) ? e.answer = [ "\u6b63\u786e" ] : isFalse(e.answer[0]) ? e.answer = [ "\u9519\u8bef" ] : e.answer = [], 
                e.options = [];
                break;
 
              case "multichoice":
              case "multichoiceset":
                if (e.type = "1", e.$options = D(e.html).find("input[type=checkbox]"), 0 === e.$options.length && (e.type = "0", 
                e.$options = D(e.html).find("input[type=radio]")), e.options = D(e.html).find(".answer > div").map(((e, t) => {
                    let n = D(t).find(".answernumber").text().trim(), a = removeHtml(D(t).html());
                    return "" === n ? a.trim() : a.split(n)[1].trim();
                })).get(), t.includes("\u6b63\u786e") && !t.includes("\u90e8\u5206\u6b63\u786e")) e.answer = [], 
                e.answer = D(e.html).find(".answer > div").map(((t, n) => {
                    let a = D(n).find(".answernumber").text().trim(), s = removeHtml(D(n).html());
                    return e.$options.eq(t).prop("checked") && D(n).find(".text-success").length > 0 ? "" === a ? s.trim() : s.split(a)[1].trim() : "";
                })).get(), e.answer = e.answer.filter((e => "" !== e)); else {
                    e.temp = removeHtml(D(e.html).find(".rightanswer").html(), !1).replace("\u6b63\u786e\u7b54\u6848\u662f\uff1a", "").trim();
                    const t = e.options.slice(0);
                    t.sort(((e, t) => t.length - e.length)), e.answer = t.map((t => e.temp.includes(t) ? (e.temp = e.temp.replace(t, ""), 
                    t) : "")), e.answer = e.answer.filter((e => "" !== e)), e.answer.length;
                }
                break;
 
              case "shortanswer":
                e.type = "4", e.$options = D(e.html).find("input[type=text]"), e.answer = removeHtml(D(e.html).find(".rightanswer").html()).replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim();
                break;
 
              case "match":
                e.type = "24", e.match = D(".answer tr td.text").map(((e, t) => removeHtml(D(t).html()))).get(), 
                e.$options = D(".answer tr td.control select"), e.selects = D(".answer tr td.control select").map(((e, t) => [ D(t).find("option").map(((e, t) => ({
                    value: D(t).val(),
                    text: D(t).text()
                }))).get() ])).get();
                break;
 
              case "multianswer":
                e.type = "14";
                let n = D(e.html).find(".formulation").clone();
                n.find(".subquestion").remove(), n.find(".accesshide").remove(), e.question = removeHtml(n.html());
                let a = [], s = [];
                D(e.html).find(".subquestion").map(((e, t) => {
                    let n = D(t).find("select>option").map(((e, t) => removeHtml(D(t).html()))).get();
                    n = n.filter((e => "" !== e)), a.push(n);
                    let o = D(t).find("select>option:selected").map(((e, t) => removeHtml(D(t).html()))).get();
                    s.push(o[0]);
                })), e.options = a;
                D(e.html).find(".text-success").length == e.options.length && (e.answer = s);
                break;
 
              case "description":
                return;
            }
            return e;
        },
        paper: async e => {
            const t = {
                platform: "ougd"
            };
            t.hash = (se.document.body.innerHTML.match(/(?:courseid)=(\d+)/) || [])[1] || "";
            const n = (se.document.body.innerHTML.match(/(?:cmid)=(\d+)/) || [])[1] || "";
            "" !== t.hash && "" !== n && (t.info = {}, t.name = D("h1").text().trim(), t.chapter = [ {
                hash: `${n}`,
                name: se.document.title.trim(),
                question: e
            } ], xe.setPaper(t.hash, t));
        }
    }, {
        type: "ask",
        name: "\u5e7f\u5f00\u5f62\u8003",
        tips: "\u5e7f\u5f00\u4ec5\u652f\u6301\u57fa\u7840\u9898\u578b\uff0c\u7279\u6b8a\u9898\u578b\u8bf7\u624b\u52a8\u5b8c\u6210",
        match: /mod\/quiz\/attempt\.php/i.test(location.pathname) && [ "moodle.syxy.ouchn.cn", "xczxzdbf.moodle.qwbx.ouchn.cn", "elearning.bjou.edu.cn", "whkpc.hnqtyq.cn:5678", "course.ougd.cn", "study.ouchn.cn" ].includes(location.host),
        question: {
            html: ".que",
            question: ".qtext",
            options: ".answer > div",
            type: "",
            workType: "ougd",
            pageType: "ougd"
        },
        ischecked: e => Boolean(e.prop("checked")),
        questionHook: e => {
            switch (e.type = (D(e.html).attr("class") || "").split(" ")[1], D(e.html).find(".qtext .accesshide").remove(), 
            e.question = removeHtml(D(e.html).find(".qtext").html()), e.type) {
              case "truefalse":
                e.type = "3", e.$options = D(e.html).find("input[type=radio]"), e.options = [];
                break;
 
              case "multichoice":
              case "multichoiceset":
                e.type = "1", e.$options = D(e.html).find("input[type=checkbox]"), 0 === e.$options.length && (e.type = "0", 
                e.$options = D(e.html).find("input[type=radio]")), e.options = D(e.html).find(".answer > div").map(((e, t) => {
                    let n = D(t).find(".answernumber").text().trim(), a = removeHtml(D(t).html());
                    return "" === n ? a.trim() : a.split(n)[1].trim();
                })).get();
                break;
 
              case "shortanswer":
                e.type = "4", e.$options = D(e.html).find("input[type=text]");
                break;
 
              case "match":
                e.type = "24", e.match = D(".answer tr td.text").map(((e, t) => removeHtml(D(t).html()))).get(), 
                e.$options = D(".answer tr td.control select"), e.selects = D(".answer tr td.control select").map(((e, t) => [ D(t).find("option").map(((e, t) => ({
                    value: D(t).val(),
                    text: D(t).text()
                }))).get() ])).get();
 
              case "essay":
                e.type = "4", e.$options = D(e.html).find("iframe");
                break;
 
              case "multianswer":
                e.type = "14";
                let t = D(e.html).find(".formulation").clone();
                t.find(".subquestion").remove(), t.find(".accesshide").remove(), e.question = removeHtml(t.html());
                let n = [];
                D(e.html).find(".subquestion").map(((e, t) => {
                    let a = D(t).find("select>option").map(((e, t) => removeHtml(D(t).html()))).get();
                    a = a.filter((e => "" !== e)), n.push(a), D(t).find("select>option:selected").map(((e, t) => removeHtml(D(t).html()))).get();
                })), e.$options = D(e.html).find("select"), e.options = n;
                break;
 
              case "description":
                return;
            }
            return e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "4":
                return D(e.html).find("input.form-control").each((function(t, n) {
                    D(n).val(e.answer[t]);
                })), D(e.html).find("iframe:eq(0)").contents().find("body").html(e.answer[0]), !1;
 
              case "3":
                e.ques.$options.each(((t, n) => {
                    const a = D(n).parent().find("label").text();
                    return "object" == typeof e.answer && (e.answer = e.answer[0]), isTrue(e.answer) && isTrue(a) ? (D(n).click(), 
                    !1) : !isFalse(e.answer) || !isFalse(a) || (D(n).click(), !1);
                }));
 
              case "14":
                return D(e.html).find("select").each(((t, n) => {
                    const a = e.answer[t];
                    D(n).find(`option:contains("${a}")`).prop("selected", !0);
                })), !1;
 
              default:
                return !0;
            }
        },
        finish: e => {
            D(".submitbtns .btn-primary").click();
        }
    }, {
        type: "ask",
        name: "\u56fd\u5f00\u4e13\u9898\u6d4b\u9a8c",
        match: "lms.ouchn.cn" === location.host && /\/exam\/([0-9]+)\/subjects/i.test(location.pathname) && !/\/exam\/([0-9]+)\/subjects#\/submission\/([0-9]+)/i.test(location.href),
        question: {
            html: "li.subject",
            question: ".summary-title .subject-description",
            options: ".subject-options li .option-content",
            type: ".summary-sub-title span:eq(0)",
            workType: "guokai",
            pageType: "guokai"
        },
        init: async () => {
            await waitUntil((function() {
                return D(".loading-gif").hasClass("ng-hide") && "" === D(".hd .examinee .submit-label").eq(0).text();
            })), await waitUntil((function() {
                return 0 !== D("li.subject").length;
            }));
        },
        ischecked: e => Boolean(e.parent().find("input").eq(-1).prop("checked")),
        questionHook: e => {
            const t = se.angular.element(e.html).scope(), n = t.subject;
            if ("text" === n.type) return;
            e.type = typeConvert(Ue[n.type]);
            let a = D(`<div>${n.description}</div>`).clone();
            switch (a.find("span.__blank__").remove(), e.question = removeHtml(a.html()), n.options = n.options.sort(((e, t) => e.sort - t.sort)), 
            e.options = n.options.map((e => removeHtml(e.content))), e.type, n.type, n.type) {
              case "cloze":
                e.options = n.sub_subjects.map((e => e.options.map((e => removeHtml(e.content))))), 
                e.$options = D(e.html).find("select");
 
              case "true_or_false":
                e.options = [];
            }
            return e.subject = n, e.scope = t, e;
        },
        setAnswer: e => {
            switch (e.ques, e.type) {
              case "2":
                return D(e.html).find(".___answer"), D(e.html).find(".___answer").each(((t, n) => {
                    D(n).html(e.answer[t]), e.ques.scope.subject.answers[t].content = e.answer[t], e.ques.scope.onChangeSubmission(e.ques.subject);
                })), !1;
 
              case "4":
                return D(e.html).find(".simditor-body.needsclick>p").each((function(t, n) {
                    D(n).html(e.answer[t]), e.ques.subject.answered_content = e.answer[t];
                })), e.ques.scope.onChangeSubmission(e.ques.subject), !1;
 
              case "14":
                return e.ques.subject.sub_subjects.forEach(((t, n) => {
                    let a = e.answer[n];
                    t.options.forEach(((s, o) => {
                        s.content === a && (t.answeredOption = String(s.id), e.ques.scope.onChangeSubmission(t), 
                        D(e.html).find(`input[value="${s.id}"]`).click(), D(e.html).find(`button:eq(${n})>span:eq(1)`).text(a));
                    }));
                })), !1;
            }
            return !0;
        }
    }, {
        type: "save",
        name: "\u4e0a\u6d77\u5f00\u653e\u6536\u5f55",
        match: () => "l.shou.org.cn" === location.host && location.href.includes("assignment/history.aspx?homeWorkId"),
        question: {
            html: ".e-q-body",
            question: ".ErichText",
            options: "ul>li>.ErichText",
            type: ".question-box .tag",
            workType: "shou",
            pageType: "shou"
        },
        init: async () => {},
        answerHook: e => {
            e.$options = D(e.html).find("ul>li");
            let t = D(e.html).find("ul>li.checked").map(((e, t) => removeHtml(D(t).find(".ErichText").html()))).get();
            const n = D(e.html).find(".e-q-right").length > 0;
            e.answer = t.filter((e => "" !== e));
            let a = D(e.html).find(".e-ans-ref .e-ans-r").map(((e, t) => removeHtml(D(t).html()))).get().map((t => {
                let n = t.charCodeAt() - 65;
                return e.options[n];
            })).filter((e => "" !== e && void 0 !== e));
            switch (D(e.html).attr("data-questiontype")) {
              case "2":
                e.type = "1";
                break;
 
              case "1":
                e.type = "0";
                break;
 
              case "3":
                e.type = "3", e.answer = D(e.html).find("ul>li.checked").map(((e, t) => removeHtml(D(t).html()))).get(), 
                e.options = [], isTrue(e.answer[0]) ? e.answer = [ "\u6b63\u786e" ] : isFalse(e.answer[0]) ? e.answer = [ "\u9519\u8bef" ] : e.answer = [];
                break;
 
              case "11":
                e.type = "19";
                const t = D(e.html).find("form").map(((e, t) => ({
                    type: "0",
                    question: removeHtml(D(t).find(".e-q-q .ErichText").html()),
                    options: D(t).find("ul li .ErichText").map(((e, t) => removeHtml(D(t).html()))).get()
                }))).get();
                a = a.length > 0 ? judgeAnswer(a[0]) : [], e.options = t;
 
              default:
                return void D(e.html).attr("data-questiontype");
            }
            if (a.length > 0) return e.answer = a, e;
            if (!n && "3" === e.type && e.answer.length > 0) e.answer = isTrue(e.answer[0]) ? [ "\u9519\u8bef" ] : isFalse(e.answer[0]) ? [ "\u6b63\u786e" ] : []; else if (!n) return;
            return e;
        },
        paper: async e => {
            const t = {
                platform: "shou"
            }, n = D("input[name=CourseOpenId]").val(), a = D("input[name=WorkId]").val();
            await request("https://l.shou.org.cn/student/CourseScoreNew-inside.aspx", "GET").then((e => {
                const a = D(e[0].responseText);
                t.name = a.find(`#courseSelect>option[data-xid="${n}"]`).text().trim(), t.info = {};
            })), t.hash = n, t.info = {}, t.chapter = [ {
                hash: `${a}`,
                name: D(".mark_title").text().trim(),
                question: e
            } ], xe.setPaper(t.hash, t);
        }
    }, {
        type: "ask",
        name: "\u4e0a\u6d77\u5f00\u653e\u4f5c\u4e1a",
        tips: "\u4e0a\u6d77\u5f00\u653e\u5927\u5b66\u76ee\u524d\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u624b\u52a8\u5b8c\u6210",
        match: () => "l.shou.org.cn" === location.host && location.href.includes("assignment/preview.aspx?homeWorkId"),
        question: {
            html: ".e-q-body",
            question: ".ErichText",
            options: "ul>li>.ErichText",
            type: ".question-box .tag",
            workType: "shou",
            pageType: "shou"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".e-q-body").length;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            switch (D(e.html).attr("data-questiontype")) {
              case "2":
                e.type = "1";
                break;
 
              case "1":
                e.type = "0";
                break;
 
              case "3":
                e.type = "3", e.$options = D(e.html).find("ul>li");
                break;
 
              default:
                return void D(e.html).attr("data-questiontype");
            }
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    } ], Ee = [ {
        type: "ask",
        name: "\u6210\u6559\u4e91\u8003\u8bd5",
        tips: "\u6210\u6559\u4e91\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.href.includes("student/exam/resource/paper_card"),
        question: {
            html: ".ui-question",
            question: ".ui-question-content-wrapper",
            options: ".ui-question-options li .ui-question-content-wrapper",
            type: ".ui-question-group-title",
            workType: "chengjiaoyun",
            pageType: "chengjiaoyun"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".ui-question");
            })), !se.top.location.href.includes("student/exam2/doexam")) return !1;
        },
        toquestion: e => {
            D(`.ui-card-questions ul li:eq(${e - 1})`).click();
        },
        next: async () => {
            D("#next-btn").click();
        },
        ischecked: e => e.hasClass("ui-option-selected"),
        questionHook: e => {
            let t = D(e.html).parent().find(".ui-question-group-title").text().split(".")[1].trim();
            switch (e.$options = D(e.html).find(".ui-question-options li>span"), t) {
              case "\u5355\u9009\u9898":
                e.type = "0";
                break;
 
              case "\u591a\u9009\u9898":
                e.type = "1";
                break;
 
              case "\u5224\u65ad\u9898":
                e.type = "3", e.options = [];
            }
            return e;
        },
        setAnswer: e => {
            if ("3" === e.type) {
                let t = e.answer;
                return e.ques.$options.each(((e, n) => {
                    isTrue(t) && isTrue(removeHtml(D(n).parent().html())) && D(n).click(), isFalse(t) && isFalse(removeHtml(D(n).parent().html())) && D(n).click();
                })), !1;
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u6210\u6559\u4e91\u6536\u5f55",
        match: () => location.href.includes("student/exam/resource/paper_card"),
        question: {
            html: ".ui-question",
            question: ".ui-question-content-wrapper",
            options: ".ui-question-options li .ui-question-content-wrapper",
            type: ".ui-question-group-title",
            workType: "chengjiaoyun",
            pageType: "chengjiaoyun"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".ui-question");
            })), se.top.location.href.includes("student/exam2/doexam")) return !1;
        },
        answerHook: e => {
            let t = D(e.html).parent().find(".ui-question-group-title").text().split(".")[1].trim();
            switch (e.$options = D(e.html).find(".ui-question-options li>span"), e.answer = D(e.html).find(".ui-question-options li.ui-correct-answer .ui-question-content-wrapper").map(((e, t) => removeHtml(D(t).html()))).get(), 
            t) {
              case "\u5355\u9009\u9898":
                e.type = "0";
                break;
 
              case "\u591a\u9009\u9898":
                e.type = "1";
                break;
 
              case "\u5224\u65ad\u9898":
                e.type = "3", e.options = [], e.answer = isTrue(e.answer[0]) ? [ "\u6b63\u786e" ] : isFalse(e.answer[0]) ? [ "\u9519\u8bef" ] : [];
            }
            return e;
        }
    } ], Fe = [ {
        type: "hook",
        name: "hook",
        match: () => "xuexi.jsou.cn" === location.host && location.href.includes("newHomework/showHomeworkByStatus") && location.href.includes("checked=true"),
        main: e => {
            se.mainClass = D("#homeworkHistory").find(".active").attr("id");
            let t = new MutationObserver((async e => {
                se.mainClass !== D("#homeworkHistory").find(".active").attr("id") && (se.mainClass = D("#homeworkHistory").find(".active").attr("id"), 
                await waitUntil((function() {
                    return 0 === D(".layui-layer-shade").length;
                })), vuePageChange$1(), t.disconnect());
                for (let n of e) "attributes" === n.type && "class" === n.attributeName && n.target.textContent && (n.target.textContent.includes("\u4e0b\u4e00\u9898") || n.target.textContent.includes("\u4e0a\u4e00\u9898")) && (t.disconnect(), 
                vuePageChange$1());
            }));
            D("body").length >= 1 && t.observe(D("body")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u6c5f\u82cf\u5f00\u653e\u5927\u5b66\u7b54\u9898",
        tips: "\u6c5f\u5f00\u9002\u914d\u4e2d\uff0c\u76ee\u524d\u4ec5\u652f\u6301\u9009\u62e9\u3001\u5224\u65ad\u9898\u3001\u586b\u7a7a\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u8d26\u53f7\u7ed9\u4f5c\u8005",
        match: () => "xuexi.jsou.cn" === location.host && location.href.includes("/showHomeworkByStatus") && location.href.includes("checked=false"),
        question: {
            html: ".insert",
            question: ".window-title",
            options: ".questionId-option li > div:not(.numberCover)",
            type: ".questionDiv >div:eq(0)",
            workType: "jsou",
            pageType: "jsou"
        },
        init: async () => {
            document.addEventListener("copy", (function(e) {
                e.stopImmediatePropagation(), layer.msg("\u590d\u5236\u6210\u529f", {
                    icon: 4
                }), e.clipboardData.setData("text/plain", window.getSelection().toString());
            })), document.addEventListener("paste", (() => {
                event.stopImmediatePropagation();
                let e = (event.clipboardData || window.clipboardData).getData("text");
                layer.msg("\u7c98\u8d34\u6210\u529f", {
                    icon: 4
                }), document.execCommand("insertText", !1, e);
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => (e.type = D(e.html).find(".questionDiv >div:eq(1)").text().trim(), 
        e.type = typeConvert(e.type), e.$options = D(e.html).find(".questionId-option li .numberCover"), 
        "3" == e.type && (e.options = []), e),
        setAnswer: e => {
            switch (e.type) {
              case "2":
                if (e.$options = D(e.html).find(".questionTitle input"), e.$options.length == e.answer.length) return e.$options.each(((t, n) => {
                    D(n).val(e.answer[t]);
                })), !1;
                break;
 
              case "3":
                let t = e.answer;
                return D(e.html).find(".questionId-option>.default-option").each(((e, n) => {
                    isTrue(t) && isTrue(removeHtml(D(n).find(".option-title>div:eq(1)").html())) && D(n).find("div.numberCover").click(), 
                    isFalse(t) && isFalse(removeHtml(D(n).find(".option-title>div:eq(1)").html())) && D(n).find("div.numberCover").click();
                })), !1;
 
              case "4":
                const n = D(e.html).find(".jianda-answer>div").attr("id");
                return se.UE.getEditor(`${n}`).setContent(e.answer), !1;
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u6c5f\u82cf\u5f00\u653e\u5927\u5b66\u6536\u5f55",
        match: () => "xuexi.jsou.cn" === location.host && location.href.includes("newHomework/showHomeworkByStatus") && location.href.includes("checked=true"),
        question: {
            html: ".insert",
            question: ".window-title",
            options: "#questionId-option li > div:not(.numberCover)",
            type: ".questionDiv >div:eq(0)",
            workType: "jsou",
            pageType: "jsou"
        },
        init: async () => {},
        answerHook: e => {
            e.type = D(e.html).find(".questionDiv >div:eq(1)").text();
            let t = D(e.html).find(".questionDiv >div").text().match(/\u5206\u503c(\d+)\u5206/)[1], n = D(e.html).find(".questionDiv >div").text().match(/\u5f97\u5206\uff1a(\d+)/)[1];
            e.type = typeConvert(e.type);
            let a = t == n && "0" != `${n}`;
            if (a || 3 == e.type) {
                switch (e.type) {
                  case "0":
                  case "1":
                  case "3":
                    if (e.answer = D(e.html).find(".answer .correctAnswer").text().trim().split("\uff1b").map((t => e.options[t.charCodeAt(0) - 65])), 
                    e.answer = e.answer.filter((e => e)), 0 == e.answer.length && (e.answer = D(e.html).find(".answer .studentAnswer").text().trim().split("\uff1b").map((t => e.options[t.charCodeAt(0) - 65]))), 
                    e.answer = e.answer.filter((e => e)), 3 == e.type) {
                        e.options = [];
                        let t = e.answer[0];
                        if (isFalse(t)) e.answer = "\u9519\u8bef"; else {
                            if (!isTrue(t)) return;
                            e.answer = "\u6b63\u786e";
                        }
                        [ "\u6b63\u786e", "\u9519\u8bef" ].includes(e.answer) && !a && (e.answer = "\u6b63\u786e" === e.answer ? "\u9519\u8bef" : "\u6b63\u786e");
                    }
                    break;
 
                  case "2":
                    e.options = [], e.answer = D(e.html).find(".answer .correctAnswer").text().trim().split("\uff1b"), 
                    e.answer = e.answer.filter((e => e)), 0 == e.answer.length && (e.answer = D(e.html).find(".answer .studentAnswer").text().trim().split("\uff1b")), 
                    e.answer = e.answer.filter((e => e));
                    break;
 
                  default:
                    return;
                }
                return e;
            }
        },
        paper: e => {
            const t = se.homework, n = {
                platform: "jsou"
            };
            n.hash = t.courseId, n.name = t.courseName, n.info = {}, n.chapter = [ {
                hash: `${t.homeworkId}`,
                name: t.title,
                question: e
            } ], xe.setPaper(n.hash, n);
        }
    } ], je = [ {
        type: "hook",
        name: "hook",
        match: "spoc-exam.icve.com.cn" === location.host || location.host.includes("exam.courshare.cn") || location.host.includes("webtrn.cn"),
        main: e => {
            se.mainClass = D(".q_content").first().attr("id");
            let t = new MutationObserver((async e => {
                se.mainClass !== D(".q_content").first().attr("id") && (se.mainClass = D(".q_content").first().attr("id"), 
                "homework-detail-container" === se.mainClass && await waitUntil((function() {
                    return 0 !== D(".q_content").length;
                })), vuePageChange$1(), t.disconnect());
                for (let n of e) "attributes" === n.type && "class" === n.attributeName && n.target.textContent && (n.target.textContent.includes("\u4e0b\u4e00\u9898") || n.target.textContent.includes("\u4e0a\u4e00\u9898")) && (t.disconnect(), 
                vuePageChange$1());
            }));
            D("#examPage").length >= 1 && t.observe(D("#examPage")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "hook",
        name: "hook",
        match: "zjy2.icve.com.cn" === location.host || "zyk.icve.com.cn" === location.host,
        main: e => {
            D(".minimized-dialog img").css({
                "z-index": "999999"
            }), se.mainClass = D("#app")[0].__vue__.$route.name;
            let t = new MutationObserver((async e => {
                se.mainClass !== D("#app")[0].__vue__.$route.name && (se.mainClass = D("#app")[0].__vue__.$route.name, 
                "homework-detail-container" === se.mainClass && await waitUntil((function() {
                    return 0 !== D(".q_content").length;
                })), vuePageChange$1(), t.disconnect());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u804c\u6559\u4e91\u4f5c\u4e1a",
        tips: "\u804c\u6559\u4e91\u53ea\u652f\u6301\u9009\u62e9\u3001\u5224\u65ad\u9898\uff0c\u586b\u7a7a\u3001\u7b80\u7b54\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.href.includes("examflow_index.action"),
        question: {
            html: ".q_content",
            question: ".divQuestionTitle",
            options: ".questionOptions > div",
            type: ".question-box .tag",
            workType: "zhijiaoyun",
            pageType: "zhijiaoyun"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".q_content").length;
            }));
        },
        next: () => {},
        finish: e => {
            D('.paging_next:contains("\u4e0b\u4e00\u9875")').click();
        },
        ischecked: e => 0 !== e.parent().find(".checkbox_on").length,
        questionHook: e => {
            var t, n;
            e.question = removeHtml(D(e.html).find(".divQuestionTitle").html());
            let a = D(e.html).find("[name='quesId']").attr("id"), s = null == (n = null == (t = document.getElementById(`questionId[${a}]`)) ? void 0 : t.getAttribute("answertype")) ? void 0 : n.trim(), o = D(e.html).find("span[name^='questionIndex']").text().trim() + "\u3001", i = D(e.html).find(".q_score").text().trim();
            switch (e.question = e.question.replace(o, "").replace(i, "").trim(), e.options = D(e.html).find(".questionOptions>div").map(((e, t) => {
                let n = D(t).find(".option_index").text().trim();
                return removeHtml(D(t).html()).replace(n, "").trim();
            })).get(), e.$options = D(e.html).find(".questionOptions>div input"), s) {
              case "\u5355\u9879\u9009\u62e9\u9898":
              case "\u5355\u9009\u9898":
              case "singlechoice":
                e.type = "0";
                break;
 
              case "\u591a\u9879\u9009\u62e9\u9898":
              case "\u591a\u9009\u9898":
              case "multichoice":
                e.type = "1";
                break;
 
              case "\u5224\u65ad\u9898":
              case "bijudgement":
                e.type = "3", e.options = [];
                break;
 
              case "fillblank":
                e.type = "2", e.question = removeHtml(D(e.html).find("[name='fillblankTitle']").html());
                break;
 
              case "cloze":
                e.type = "14", e.options = D(e.html).find(".questionOptions>.exam_cloze_choice").map(((e, t) => [ D(t).find(".optionContent").map(((e, t) => removeHtml(D(t).html()))).get() ])).get();
                break;
 
              case "textarea":
                e.type = "4", e.options = [];
            }
            return e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "2":
                return D(e.html).find(".fillblank_input > input").each(((t, n) => {
                    D(n).val(e.answer[t]);
                })), !1;
 
              case "3":
                let t = e.answer;
                return e.ques.$options.each(((e, n) => {
                    isTrue(t) && isTrue(removeHtml(D(n).parent().html())) && D(n).click(), isFalse(t) && isFalse(removeHtml(D(n).parent().html())) && D(n).click();
                })), !1;
 
              case "4":
                let n = D(e.html).find("[name='quesId']").attr("id");
                return se.UE.getEditor(`_baidu_editor_${n}`).setContent(`<p>${e.answer}</p>`), !1;
            }
            return !0;
        }
    }, {
        type: "save",
        name: "\u804c\u6559\u4e91\u6536\u5f55",
        match: () => location.href.includes("examrecord_recordDetail.action"),
        question: {
            html: ".q_content",
            question: ".divQuestionTitle",
            options: ".questionOptions>div.q_option_readonly",
            type: ".question-box .tag",
            workType: "zhijiaoyun",
            pageType: "zhijiaoyun"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".q_content").length;
            }));
        },
        answerHook: e => {
            const t = D(e.html).find(".exam.icon_examright").length, n = D(e.html).find("input[name='quesId']:not([id='']").attr("id"), a = D(`input#qId${n}`).attr("qtype"), s = D(e.html).find("span[name^='questionIndex']").text().trim() + "\u3001", o = D(e.html).find(".q_score").text().trim();
            switch (e.question = e.question.replace(s, "").replace(o, "").trim(), e.options = D(e.html).find(".questionOptions>div.q_option_readonly").map(((e, t) => {
                let n = D(t).find("span[name='optionIndexName']").text().trim();
                return removeHtml(D(t).html()).replace(n, "").trim();
            })).get(), a) {
              case "\u5355\u9879\u9009\u62e9\u9898":
              case "\u5355\u9009\u9898":
              case "singlechoice":
                e.type = "0";
                break;
 
              case "\u591a\u9879\u9009\u62e9\u9898":
              case "\u591a\u9009\u9898":
              case "multichoice":
                e.type = "1";
                break;
 
              case "\u5224\u65ad\u9898":
              case "bijudgement":
                e.type = "3";
                break;
 
              case "fillblank":
              case "\u586b\u7a7a\u9898":
                e.type = "2";
                const t = D(e.html).find(".answerOption>span:eq(0)").clone();
                t.find(".exam_answers").remove(), e.question = titleClean(removeHtml(t.html())).replace(/\uff08.*?\u5206\uff09/g, "").trim();
                break;
 
              case "cloze":
              case "\u5b8c\u5f62\u586b\u7a7a":
                e.type = "14", e.options = D(e.html).find(".questionOptions>.exam_cloze_choice").map(((e, t) => [ D(t).find(".optionContent").map(((e, t) => removeHtml(D(t).html()))).get() ])).get(), 
                e.answer = D(e.html).find(".exam_rightAnswer .answer_table .one_answer>span").map(((t, n) => {
                    const a = D(n).text().trim();
                    return e.options[t][a.charCodeAt(0) - 65];
                })).get();
                break;
 
              case "textarea":
                e.type = "4", e.options = [], e.answer = removeHtml(D(e.html).find(".exam_rightAnswer .has_standard_answer").html());
            }
            switch (e.type) {
              case "0":
              case "1":
                if (e.answer = D(e.html).find('.exam_rightAnswer .exam_answers_tit>span[name="rightAnswer"]').text().trim().split("").map((t => e.options[t.charCodeAt(0) - 65])), 
                e.answer, 0 == e.answer.length) {
                    if (0 == t) return;
                    e.answer = D(e.html).find('.exam_stu_answer span[name="stuAnswer"]').text().trim().split("").map((t => e.options[t.charCodeAt(0) - 65]));
                }
                break;
 
              case "2":
                e.answer = 0 == t ? D(e.html).find(".exam_rightAnswer span.fillblank_answer").map(((e, t) => removeHtml(D(t).html()))).get() : D(e.html).find(".exam_stu_answer span.fillblank_answer").map(((e, t) => removeHtml(D(t).html()))).get(), 
                e.answer;
                break;
 
              case "3":
                e.options = [];
                let n = D(e.html).find('.exam_stu_answer span[name="stuAnswer"]').text().trim();
                [ "\u6b63\u786e", "\u9519\u8bef" ].includes(n) && (e.answer = t ? [ n ] : [ "\u6b63\u786e" === n ? "\u9519\u8bef" : "\u6b63\u786e" ]);
            }
            return e;
        }
    }, {
        type: "save",
        name: "\u667a\u6167\u804c\u6559\u6536\u5f55",
        match: () => "zjy2.icve.com.cn" === location.host && (location.href.includes("/spocviewsJob") || location.href.includes("/viewExam")),
        question: {
            html: ".subjectDet",
            question: ".seeTitle .htmlP.ql-editor",
            options: ".optionList .htmlP.ql-editor",
            type: ".question-box .tag",
            workType: "zhijiaoyun",
            pageType: "zhijiaoyun"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".subjectDet").length;
            }));
        },
        answerHook: e => {
            const t = D(e.html).find(".xvhao").text().trim();
            e.type = typeConvert(t.match(/\u3010(.*)\u3011/)[1].trim().replace("\u586b\u7a7a\u9898(\u5ba2\u89c2)", "\u586b\u7a7a\u9898"));
            let n = D(e.html).find(".answer").text().trim();
            switch (e.answer = n.split(",").map((t => e.options[t.charCodeAt(0) - 65])), e.type) {
              case "2":
                e.options = [], e.answer = D(e.html).find(".answer>span").map(((e, t) => removeHtml(D(t).html()))).get();
                break;
 
              case "3":
                e.options = D(e.html).find(".optionList>div").map(((e, t) => removeHtml(D(t).html()))).get(), 
                e.answer = n.split(",").map((t => e.options[t.charCodeAt(0) - 65])), e.answer = judgeAnswer(e.answer[0]), 
                e.options = [];
                break;
 
              case "11":
                const t = D(e.html).find(".optionList .matching>.htmlP.ql-editor").map(((e, t) => removeHtml(D(t).html()))).get(), a = D(e.html).find(".optionList>.text .htmlP.ql-editor").map(((e, t) => removeHtml(D(t).html()))).get();
                e.options = [ t, a ];
                let s = {};
                n = D(e.html).find(".answer>span").map(((e, n) => {
                    let [o, i] = D(n).text().trim().split(".");
                    o.charCodeAt(0) >= 65 ? o = (o.charCodeAt(0) - 65).toString() : /^\d+$/.test(o) && (o = (parseInt(o) - 1).toString()), 
                    i.charCodeAt(0) >= 65 ? i = (i.charCodeAt(0) - 65).toString() : /^\d+$/.test(i) && (i = (parseInt(i) - 1).toString()), 
                    s[t[o]] = a[i];
                })), e.answer = s;
            }
            return e;
        }
    }, {
        type: "ask",
        name: "\u667a\u6167\u804c\u6559+\u7b54\u9898",
        tips: "\u8be5\u5e73\u53f0\u95ee\u9898\u8f83\u591a\uff0c\u9047\u5230\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.href.includes("coursePreview/jobTest") || location.href.includes("spockeepTest") || location.href.includes("spocjobTest"),
        question: {
            html: ".subjectDet",
            question: ".ql-editor",
            options: ".optionList .ql-editor",
            type: ".question-box .tag",
            workType: "zhijiaoyun",
            pageType: "zhijiaoyun"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".subjectDet").length;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().parent().hasClass("is-checked"),
        questionHook: e => {
            const t = D(e.html).find(".title.titleTwo").text().trim();
            if (e.type = typeConvert(t.match(/\u3010(.*)\u3011/)[1].trim().replace("\u586b\u7a7a\u9898(\u5ba2\u89c2)", "\u586b\u7a7a\u9898")), 
            "3" === e.type) e.options = [], e.$options = D(e.html).find(".optionList>div label");
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u667a\u6167\u804c\u6559+\u6536\u5f55",
        match: () => "zyk.icve.com.cn" === location.host && (location.href.includes("/coursePreview/viewJob1") || location.href.includes("/viewExam")),
        question: {
            html: ".subjectDet",
            question: ".seeTitle>span:eq(1)",
            options: ".optionList>div",
            type: ".question-box .tag",
            workType: "zhijiaoyun",
            pageType: "zhijiaoyun"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".subjectDet").length;
            }));
        },
        answerHook: e => {
            e.options = removeStartChar(e.options);
            const t = D(e.html).find(".xvhao").text().trim();
            e.type = typeConvert(t.match(/\u3010(.*)\u3011/)[1].trim().replace("\u586b\u7a7a\u9898(\u5ba2\u89c2)", "\u586b\u7a7a\u9898"));
            let n = D(e.html).find(".answer").text().trim();
            switch (e.answer = n.split(",").map((t => e.options[t.charCodeAt(0) - 65])), e.type) {
              case "2":
                e.options = [], e.answer = D(e.html).find(".answer>span").map(((e, t) => removeHtml(D(t).html()))).get();
                break;
 
              case "3":
                e.options = D(e.html).find(".optionList>div").map(((e, t) => removeHtml(D(t).html()))).get(), 
                e.answer = n.split(",").map((t => e.options[t.charCodeAt(0) - 65])), e.answer = judgeAnswer(e.answer[0]), 
                e.options = [];
            }
            return e;
        }
    } ], $e = [ {
        type: "ask",
        name: "\u5ddd\u519c\u5728\u7ebf\u7b54\u9898",
        tips: "\u5ddd\u519c\u5728\u7ebf\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988",
        match: () => ("any.cnzx.info:81" === location.host || "zice.cnzx.info" === location.host) && location.href.includes("KaoShi/ShiTiYe.aspx"),
        question: {
            html: "li.question",
            question: ".wenti >p.stem",
            options: ".wenti > ol > li",
            type: ".question_head > span:eq(0)",
            workType: "cnzx",
            pageType: "cnzx"
        },
        init: async () => {},
        ischecked: e => e.find("input").prop("checked"),
        questionHook: e => (e.$options = D(e.html).find(".wenti > ol > li input"), 0 !== e.options.length && (e.type = "radio" === e.$options.eq(0).attr("type") ? "0" : "1", 
        2 === e.options.length && e.options.includes("\u6b63\u786e") && e.options.includes("\u9519\u8bef") && (e.type = "3", 
        e.options = [])), e),
        setAnswer: e => "3" !== e.type || (D(e.html).find(".wenti > ol > li").each(((t, n) => {
            isTrue(e.answer) && isTrue(removeHtml(D(n).html())) && e.ques.$options.eq(t).click(), 
            isFalse(e.answer) && isFalse(removeHtml(D(n).html())) && e.ques.$options.eq(t).click();
        })), !1),
        finish: e => {
            D("li.paginationjs-next.J-paginationjs-next").click();
        }
    }, {
        type: "save",
        name: "\u6536\u5f55",
        match: () => "zice.cnzx.info" === location.host && location.href.includes("ZaiXianLianXi.aspx"),
        question: {
            html: ".ShiTi>.ShiTiMiaoShu",
            question: ".ShiTiMiaoShu",
            options: ".el-radio-group label .label,.el-checkbox-group label .label",
            type: ".question-box .tag",
            workType: "cnzx",
            pageType: "cnzx"
        },
        init: async () => {},
        answerHook: e => {
            D(e.html).text(), e.question = removeHtml(titleClean(removeHtml(D(e.html).html())));
            let t = D("ul.TiXing>li.DangQianTiXing:eq(0)>a").text(), n = [], a = D(e.html).next();
            switch (e.options = removeStartChar(a.find("ul li").map(((e, t) => (D(t).hasClass("DaAn1") && n.push(e), 
            titleClean(removeHtml(D(t).html()))))).get()), e.answer = n.map((t => e.options[t])), 
            t) {
              case "\u5355\u9009\u9898":
              case "\u8bcd\u6c47\u4e0e\u7ed3\u6784":
              case "\u4ea4\u9645\u7528\u8bed":
                e.type = "0";
                break;
 
              case "\u591a\u9009\u9898":
                e.type = "1";
                break;
 
              case "\u5224\u65ad\u9898":
                e.type = "3", e.options = [], e.answer = isTrue(e.answer[0]) ? [ "\u6b63\u786e" ] : isFalse(e.answer[0]) ? [ "\u9519\u8bef" ] : [];
            }
            return e;
        }
    } ], yktDecode = (e, t, n) => {
        let a = /<span class="xuetangx-com-encrypted-font">(.+?)<\/span>/g, s = n.match(a);
        return s && s.forEach((s => {
            a = /<span class="xuetangx-com-encrypted-font">(.+?)<\/span>/;
            let o = a.exec(s);
            if (o && o.length > 1) {
                let a = o[1].split("").map((n => e[t[n]])).join("");
                n = n.replace(o[0], a);
            }
        })), n;
    }, ttfDownload = async e => new Promise((t => {
        ae({
            method: "GET",
            url: e,
            responseType: "arraybuffer",
            onload: function(e) {
                let n = {};
                const a = qe.parse(e.response);
                for (let t = 19968; t <= 40960; t++) {
                    let e = String.fromCharCode(t), s = qe.U.codeToGlyph(a, t);
                    const o = qe.U.glyphToPath(a, s);
                    let i = somd5(JSON.stringify(o));
                    n[e] = i;
                }
                t(n);
            },
            onerror: function(e) {
                t({});
            }
        });
    })), getTTF = async () => {
        const e = [ "https://cdn.jsdelivr.net/gh/chengbianruan/staticfile/1.json", "https://jsd.vxo.im/gh/chengbianruan/staticfile/1.json", "https://cdn.jsdmirror.com/gh/chengbianruan/staticfile/1.json" ];
        for (let t = 0; t < e.length; t++) {
            const n = e[t], a = await ttfDownload1(n);
            if (a) return a;
        }
    }, Le = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("yuketang.cn") || location.host.includes("gdufemooc.cn"),
        main: e => {
            se.mainClass = D("#app")[0].__vue__.$route.name, se.mainClass;
            let t = new MutationObserver((async e => {
                se.mainClass !== D("#app")[0].__vue__.$route.name && (se.mainClass = D("#app")[0].__vue__.$route.name, 
                vuePageChange$1(), t.disconnect());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u96e8\u8bfe\u5802\u8003\u8bd5",
        tips: "\u96e8\u8bfe\u5802\u6682\u65f6\u672a\u5f00\u53d1\u5b8c\uff0c\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad",
        match: () => location.host.includes("yuketang.cn") && location.href.includes("/exam/"),
        question: {
            html: ".exercise-item",
            question: ".content",
            options: ".el-checkbox__label,.el-radio__label",
            type: ".question-box .tag",
            workType: "yuketang",
            pageType: "yuketang"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".exercise-item").length;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().hasClass("is-checked"),
        questionHook: e => {
            const t = e.html.__vue__.item;
            e.type = typeConvert(t.TypeText), e.question = titleClean(removeHtml(t.Body)).trim();
            const n = {};
            switch (t.Options && t.Options.forEach((e => {
                n[e.key] = removeHtml(e.value);
            })), e.options = t.Options.sort(((e, t) => e.key.charCodeAt(0) - t.key.charCodeAt(0))).map((e => removeHtml(e.value))), 
            e.type) {
              case "0":
              case "1":
                break;
 
              case "2":
              case "3":
                e.options = [];
            }
            return e;
        },
        setAnswer: e => "3" !== e.type || (e.ques.$options.get().forEach((t => {
            isFalse(e.answer) && D(t).find(".el-icon-close").length > 0 && t.click(), isTrue(e.answer) && D(t).find(".el-icon-check").length > 0 && t.click();
        })), !1),
        finish: e => {}
    }, {
        type: "ask",
        name: "\u96e8\u8bfe\u5802\u4f5c\u4e1a",
        tips: "\u96e8\u8bfe\u5802\u4ec5\u517c\u5bb9\u9009\u62e9\u5224\u65ad\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005\u3002\u96e8\u8bfe\u5802\u4f5c\u4e1a\u8bf7\u52a1\u5fc5\u5f00\u542f\u81ea\u52a8\u5207\u6362\uff0c\u5426\u5219\u65e0\u6cd5\u81ea\u52a8\u7b54\u9898\u6216\u5bfc\u81f4\u7b54\u9898\u9519\u4e71",
        match: () => location.host.includes("yuketang.cn") && location.href.includes("cloud/student/exercise"),
        question: {
            html: ".subject-item.J_order",
            question: ".content",
            options: ".el-radio__label",
            type: ".question-box .tag",
            workType: "yuketang",
            pageType: "yuketang"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 == D(".el-icon-loading").length && D(".container-problem").length > 0 && D(".container-problem")[0].__vue__ && D(".container-problem")[0].__vue__.exerciseList;
            }));
            const e = D(".container-problem")[0].__vue__.exerciseList;
            e ? (msg("\u6b63\u5728\u4e0b\u8f7d\u5b57\u4f53\u5305\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85"), 
            se.ttfTable = await ttfDownload(e.font), se.ttf2Table = await getTTF(), se.ttf2Table ? se.problems = e.problems : msg("\u89e3\u5bc6\u5b57\u4f53\u5305\u4e0b\u8f7d\u5931\u8d25")) : msg("\u672a\u627e\u5230\u9898\u76ee");
        },
        toquestion: e => {
            D(`.aside-body ul>li:eq(${e}) .subject-item`).click();
        },
        next: () => {
            D('.el-button.el-button--text:contains("\u4e0b\u4e00\u9898")').click();
        },
        ischecked: e => e.hasClass("is-checked"),
        questionHook: (e, t) => {
            if (D(".el-button.el-button--info.is-disabled.is-plain").length > 0) return;
            const n = se.problems[t], a = se.ttfTable, s = se.ttf2Table, o = n.content;
            n.user, e.question = titleClean(removeHtml(yktDecode(s, a, o.Body))).trim(), e.type = typeConvert(o.TypeText), 
            e.$options = () => D(".item-body ul>li>label");
            const i = {};
            switch (o.Options && (o.Options.map((e => {
                i[e.key] = removeHtml(yktDecode(s, a, e.value));
            })), e.options = o.Options.sort(((e, t) => e.key.charCodeAt(0) - t.key.charCodeAt(0))).map((e => removeHtml(yktDecode(s, a, e.value))))), 
            e.type) {
              case "0":
              case "1":
                break;
 
              case "2":
                e.question = removeHtml(e.question.replace(/\[\u586b\u7a7a\d\]/g, ""));
                break;
 
              case "3":
                e.options = [];
                break;
 
              default:
                e.type;
            }
            return e;
        },
        setAnswerHook: e => {},
        setAnswer: e => "3" !== e.type || (D(".item-body ul>li").get().forEach((t => {
            isFalse(e.answer) && D(t).find('use[*|href="#icon--tiankongticuowu"]').length > 0 && D(t).find("label").click(), 
            isTrue(e.answer) && D(t).find('use[*|href="#icon--tiankongtizhengque"]').length > 0 && D(t).find("label").click();
        })), !1),
        finish: e => {}
    }, {
        type: "save",
        name: "\u8003\u8bd5\u6536\u5f55",
        match: () => location.host.includes("yuketang.cn") && location.href.includes("/result/"),
        question: {
            html: ".subject-item > .result_item",
            question: "h4.clearfix.exam-font",
            options: "ul.list-unstyled li",
            type: ".item-type",
            workType: "yuketang",
            pageType: "yuketang"
        },
        init: async () => {
            await waitUntil((function() {
                return D(".subject-item").length > 0;
            }));
        },
        answerHook: (e, t) => {
            const n = e.html.__vue__.item;
            e.type = typeConvert(n.TypeText);
            const a = {};
            switch (n.Options && (n.Options.forEach((e => {
                a[e.key] = removeHtml(e.value);
            })), e.options = n.Options.sort(((e, t) => e.key.charCodeAt(0) - t.key.charCodeAt(0))).map((e => removeHtml(e.value)))), 
            e.question = titleClean(removeHtml(n.Body)).trim(), e.type) {
              case "0":
              case "1":
                "string" == typeof n.Answer ? e.answer = n.Answer.split("").map((e => a[e])) : "object" == typeof n.Answer && (e.answer = n.Answer.map((e => a[e])));
                break;
 
              case "2":
                n.Blanks, e.answer = n.Blanks.map((e => removeHtml(e.Answers[0])));
                break;
 
              case "3":
                e.options = [], isTrue(n.Answer[0]) ? e.answer = [ "\u6b63\u786e" ] : isFalse(n.Answer[0]) ? e.answer = [ "\u9519\u8bef" ] : e.answer = [];
            }
            return e;
        }
    }, {
        type: "save",
        name: "\u96e8\u8bfe\u5802\u4f5c\u4e1a\u6536\u5f55",
        match: () => location.host.includes("yuketang.cn") && location.href.includes("cloud/student/exercise"),
        question: {
            html: ".subject-item.J_order",
            question: "h4.clearfix.exam-font",
            options: "ul.list-unstyled li",
            type: ".item-type",
            workType: "yuketang",
            pageType: "yuketang"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 == D(".el-icon-loading").length && D(".container-problem").length > 0 && D(".container-problem")[0].__vue__ && D(".container-problem")[0].__vue__.exerciseList;
            })), await waitUntil((function() {
                return 0 != D(".el-button.el-button--info.is-disabled.is-plain").length;
            }));
            const e = D(".container-problem")[0].__vue__.exerciseList;
            e ? (msg("\u6b63\u5728\u4e0b\u8f7d\u5b57\u4f53\u5305\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85"), 
            se.ttfTable = await ttfDownload(e.font), se.ttf2Table = await getTTF(), se.ttf2Table ? (se.problems = e.problems, 
            D(".container-problem")[0].__vue__.exerciseList) : msg("\u89e3\u5bc6\u5b57\u4f53\u5305\u4e0b\u8f7d\u5931\u8d25")) : msg("\u672a\u627e\u5230\u9898\u76ee");
        },
        answerHook: (e, t) => {
            const n = se.problems[t], a = se.ttfTable, s = se.ttf2Table, o = n.content, i = n.user;
            e.question = titleClean(removeHtml(yktDecode(s, a, o.Body))).trim(), e.type = typeConvert(o.TypeText);
            const r = {};
            switch (o.Options && (o.Options.map((e => {
                r[e.key] = removeHtml(yktDecode(s, a, e.value));
            })), e.options = o.Options.sort(((e, t) => e.key.charCodeAt(0) - t.key.charCodeAt(0))).map((e => removeHtml(yktDecode(s, a, e.value))))), 
            e.type) {
              case "0":
              case "1":
                "string" == typeof i.answer ? e.answer = i.answer.split("").map((e => r[e])) : "object" == typeof i.answer && (e.answer = i.answer.map((e => r[e])));
                break;
 
              case "2":
                e.question = removeHtml(e.question.replace(/\[\u586b\u7a7a\d\]/g, "")), e.answer = o.Blanks.map((e => removeHtml(e[0]))), 
                e.answer = e.answer.filter((e => "undefined" !== e)), e.answer.length != o.blank_count && (e.answer, 
                e.answer = [], i.answers, e.answer = Object.values(i.answers).map((e => removeHtml(e[0]))));
                break;
 
              case "3":
                e.options = [], isTrue(i.answer[0]) ? e.answer = [ "\u6b63\u786e" ] : isFalse(i.answer[0]) ? e.answer = [ "\u9519\u8bef" ] : e.answer = [];
            }
            return e;
        }
    }, {
        type: "ask",
        name: "\u5e7f\u8d22\u6155\u8bfe\u4f5c\u4e1a",
        tips: "\u5e7f\u8d22\u6155\u8bfe\u4f5c\u4e1a\u4ec5\u517c\u5bb9\u9009\u62e9\u5224\u65ad\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005\u3002\u5e7f\u8d22\u6155\u8bfe\u4f5c\u4e1a\u4f5c\u4e1a\u8bf7\u52a1\u5fc5\u5f00\u542f\u81ea\u52a8\u5207\u6362\uff0c\u5426\u5219\u65e0\u6cd5\u81ea\u52a8\u7b54\u9898\u6216\u5bfc\u81f4\u7b54\u9898\u9519\u4e71",
        match: () => location.host.includes("gdufemooc.cn") && location.href.includes("/homework/"),
        question: {
            html: ".subject-item[examasideclosesubjectitem]",
            question: ".content",
            options: ".el-radio__label",
            type: ".question-box .tag",
            workType: "yuketang",
            pageType: "yuketang"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 == D(".el-icon-loading").length && D(".container-problem").length > 0 && D(".container-problem")[0].__vue__ && D(".container-problem")[0].__vue__.exerciseList;
            }));
            const e = D(".container-problem")[0].__vue__.exerciseList;
            e ? (msg("\u6b63\u5728\u4e0b\u8f7d\u5b57\u4f53\u5305\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85"), 
            se.ttfTable = await ttfDownload(e.font), se.ttf2Table = await getTTF(), se.ttf2Table ? se.problems = e.problems : msg("\u89e3\u5bc6\u5b57\u4f53\u5305\u4e0b\u8f7d\u5931\u8d25")) : msg("\u672a\u627e\u5230\u9898\u76ee");
        },
        toquestion: e => {
            D(`.aside-body ul>li:eq(${e}) .subject-item`).click(), D(".submitProblemsDialog>.el-dialog__footer button:contains('\u5148\u4e0d\u7528\u4e86')").length, 
            D(".submitProblemsDialog>.el-dialog__footer button:contains('\u5148\u4e0d\u7528\u4e86')").last().click();
        },
        next: () => {
            D('.el-button.el-button--text:contains("\u4e0b\u4e00\u9898")').click(), D(".submitProblemsDialog>.el-dialog__footer button:contains('\u5148\u4e0d\u7528\u4e86')").last().click();
        },
        ischecked: e => e.hasClass("is-checked"),
        questionHook: (e, t) => {
            const n = se.problems[t], a = se.ttfTable, s = se.ttf2Table, o = n.content;
            n.user, e.question = titleClean(removeHtml(yktDecode(s, a, o.Body))).trim(), e.type = typeConvert(o.TypeText), 
            e.$options = () => D(".item-body ul>li>label");
            const i = {};
            switch (o.Options && (o.Options.map((e => {
                i[e.key] = removeHtml(yktDecode(s, a, e.value));
            })), e.options = o.Options.sort(((e, t) => e.key.charCodeAt(0) - t.key.charCodeAt(0))).map((e => removeHtml(yktDecode(s, a, e.value))))), 
            e.type) {
              case "0":
              case "1":
                break;
 
              case "2":
                e.question = removeHtml(e.question.replace(/\[\u586b\u7a7a\d\]/g, ""));
                break;
 
              case "3":
                e.options = [];
                break;
 
              default:
                e.type;
            }
            return e;
        },
        setAnswerHook: e => {},
        setAnswer: e => "3" !== e.type || (D(".item-body ul>li").get().forEach((t => {
            isFalse(e.answer) && D(t).find('use[*|href="#icon--tiankongticuowu"]').length > 0 && D(t).find("label").click(), 
            isTrue(e.answer) && D(t).find('use[*|href="#icon--tiankongtizhengque"]').length > 0 && D(t).find("label").click();
        })), !1),
        finish: e => {}
    }, {
        type: "save",
        name: "\u96e8\u8bfe\u5802\u4f5c\u4e1a\u6536\u5f55",
        match: () => location.host.includes("gdufemooc.cn") && location.href.includes("/homework/"),
        question: {
            html: ".subject-item[examasideclosesubjectitem]",
            question: "h4.clearfix.exam-font",
            options: "ul.list-unstyled li",
            type: ".item-type",
            workType: "yuketang",
            pageType: "yuketang"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 == D(".el-icon-loading").length && D(".container-problem").length > 0 && D(".container-problem")[0].__vue__ && D(".container-problem")[0].__vue__.exerciseList;
            })), await waitUntil((function() {
                return 0 != D(".el-button.el-button--info.is-disabled.is-plain").length;
            }));
            const e = D(".container-problem")[0].__vue__.exerciseList;
            e ? (msg("\u6b63\u5728\u4e0b\u8f7d\u5b57\u4f53\u5305\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85"), 
            se.ttfTable = await ttfDownload(e.font), se.ttf2Table = await getTTF(), se.ttf2Table ? (se.problems = e.problems, 
            D(".container-problem")[0].__vue__.exerciseList) : msg("\u89e3\u5bc6\u5b57\u4f53\u5305\u4e0b\u8f7d\u5931\u8d25")) : msg("\u672a\u627e\u5230\u9898\u76ee");
        },
        answerHook: (e, t) => {
            const n = se.problems[t], a = se.ttfTable, s = se.ttf2Table, o = n.content, i = n.user;
            e.question = titleClean(removeHtml(yktDecode(s, a, o.Body))).trim(), e.type = typeConvert(o.TypeText);
            const r = {};
            switch (o.Options && (o.Options.map((e => {
                r[e.key] = removeHtml(yktDecode(s, a, e.value));
            })), e.options = o.Options.sort(((e, t) => e.key.charCodeAt(0) - t.key.charCodeAt(0))).map((e => removeHtml(yktDecode(s, a, e.value))))), 
            e.type) {
              case "0":
              case "1":
                "string" == typeof i.answer ? e.answer = i.answer.split("").map((e => r[e])) : "object" == typeof i.answer && (e.answer = i.answer.map((e => r[e])));
                break;
 
              case "2":
                e.question = removeHtml(e.question.replace(/\[\u586b\u7a7a\d\]/g, "")), e.answer = o.Blanks.map((e => removeHtml(e[0]))), 
                e.answer = e.answer.filter((e => "undefined" !== e)), e.answer.length != o.blank_count && (e.answer, 
                e.answer = [], i.answers, e.answer = Object.values(i.answers).map((e => removeHtml(e[0]))));
                break;
 
              case "3":
                e.options = [], isTrue(i.answer[0]) ? e.answer = [ "\u6b63\u786e" ] : isFalse(i.answer[0]) ? e.answer = [ "\u9519\u8bef" ] : e.answer = [];
            }
            return e;
        }
    } ], Ie = [ {
        type: "ask",
        name: "\u5b89\u5fbd\u7ee7\u7eed\u6559\u80b2\u7b54\u9898",
        tips: "\u8be5\u5e73\u53f0\u4ec5\u652f\u6301\u5355\u9009\u3001\u591a\u9009\u3001\u5224\u65ad\u9898\u578b\uff0c\u5176\u4ed6\u9898\u578b\u6682\u4e0d\u652f\u6301",
        match: () => location.href.includes("study/html/content/studying/?courseOpenId=") || location.href.includes("study/html/content/sxsk/?courseOpenId=") || location.href.includes("study/html/content/tkOnline/?courseOpenId="),
        question: {
            html: ".e-q-body>.e-q",
            question: ".ErichText",
            options: "ul>li>.ErichText",
            type: ".question-box .tag",
            workType: "ahjxjy",
            pageType: "ahjxjy"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".e-q-body>.e-q") && isExist(".e-item");
            })), !isExist(".photo-time") && !isExist(".btn_save")) return !1;
        },
        ischecked: e => e.parent().hasClass("checked"),
        questionHook: e => {
            var t;
            const n = D(e.html).parent().parent();
            switch (e.type = n ? null == (t = n.attr("id")) ? void 0 : t.trim() : "", e.type) {
              case "2":
                e.type = "1";
                break;
 
              case "1":
                e.type = "0";
                break;
 
              case "3":
                e.type = "3", e.$options = D(e.html).find("ul>li");
                break;
 
              case "4":
                e.type = "2";
                break;
 
              case "5":
                e.type = "4";
                break;
 
              default:
                e.type, e.type = "8";
            }
            return e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "4":
              case "2":
                return D(e.html).find("textarea.answer-input").focus(), D(e.html).find(" textarea.answer-input"), 
                D(e.html).find(".answer-input.edui-default").each(((t, n) => {
                    let a = D(n).attr("id"), s = se.UE.getEditor(a);
                    s.ready((function() {
                        s.setContent(`<p>${e.answer[t]}</p>`);
                    }));
                })), D(e.html).find(".answer-input").blur(), !1;
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u5b89\u5fbd\u7ee7\u7eed\u6559\u80b2\u6536\u5f55",
        tips: "\u8be5\u5e73\u53f0\u4ec5\u652f\u6301\u5355\u9009\u3001\u591a\u9009\u3001\u5224\u65ad\u9898\u578b\uff0c\u5176\u4ed6\u9898\u578b\u6682\u4e0d\u652f\u6301",
        match: () => location.href.includes("study/html/content/studying/?courseOpenId=") || location.href.includes("study/html/content/sxsk/?courseOpenId=") || location.href.includes("study/html/content/tkOnline/?courseOpenId="),
        question: {
            html: ".e-q-body>.e-q",
            question: ".ErichText",
            options: "ul>li>.ErichText",
            type: ".question-box .tag",
            workType: "ahjxjy",
            pageType: "ahjxjy"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".e-save"), isExist(".e-q-body>.e-q") && isExist(".w_e-q-panel");
            })), !isExist(".e-quest-review")) return !1;
        },
        answerHook: e => {
            var t;
            const n = D(e.html).parent().parent();
            e.type = n ? null == (t = n.attr("id")) ? void 0 : t.trim() : "", e.$options = D(e.html).find("ul>li");
            let a = D(e.html).find("ul>li.checked").map(((e, t) => removeHtml(D(t).find(".ErichText").html()))).get();
            const s = D(e.html).find(".e-q-right").length > 0;
            e.answer = a.filter((e => "" !== e));
            let o = D(e.html).find(".e-ans-ref .e-ans-r").map(((e, t) => removeHtml(D(t).html()))).get();
            1 === o.length && o[0].length > 1 && (o = o[0].split("\u3001"));
            let i = o.map((t => {
                let n = t.charCodeAt() - 65;
                return e.options[n];
            })).filter((e => "" !== e && void 0 !== e));
            switch (e.type) {
              case "2":
                e.type = "1";
                break;
 
              case "1":
                e.type = "0";
                break;
 
              case "3":
                e.type = "3", e.answer = D(e.html).find("ul>li.checked").map(((e, t) => removeHtml(D(t).html()))).get(), 
                e.options = [], isTrue(e.answer[0]) ? e.answer = [ "\u6b63\u786e" ] : isFalse(e.answer[0]) ? e.answer = [ "\u9519\u8bef" ] : e.answer = [];
                break;
 
              case "4":
                e.type = "2", e.options = [];
                break;
 
              case "5":
                e.type = "4", i = [ removeHtml(D(e.html).find(".e-ans-ref>.e-ans-r").html()) ], 
                e.options = [];
                break;
 
              case "11":
                e.type = "19";
                const t = D(e.html).find("form").map(((e, t) => ({
                    type: "0",
                    question: removeHtml(D(t).find(".e-q-q .ErichText").html()),
                    options: D(t).find("ul li .ErichText").map(((e, t) => removeHtml(D(t).html()))).get()
                }))).get();
                i = i.length > 0 ? judgeAnswer(i[0]) : [], e.options = t;
 
              default:
                return void e.type;
            }
            if (i.length > 0) return e.answer = i, e;
            if (!s && "3" === e.type && e.answer.length > 0) e.answer = isTrue(e.answer[0]) ? [ "\u9519\u8bef" ] : isFalse(e.answer[0]) ? [ "\u6b63\u786e" ] : []; else if (!s) return;
            return e;
        },
        paper: e => {
            const t = se.online, n = {
                platform: "ahjxjy"
            };
            n.hash = t.courseOpenId, n.name = se.localStorage.courseNmae, n.info = {}, n.chapter = [ {
                hash: `${t.cell.id}`,
                name: t.cell.title,
                question: e
            } ], xe.setPaper(n.hash, n);
        }
    } ], Pe = [ {
        type: "save",
        name: "\u9752\u4e66\u4f5c\u4e1a\u7b54\u9898\u6536\u5f55",
        match: () => location.host.includes("qingshuxuetang.com") && (location.href.includes("Student/ExercisePaper?courseId=") || location.href.includes("Student/ViewQuiz?quizId=") || location.href.includes("Student/SimulationExercise/Detail?id=") || location.href.includes("Student/Quiz/Detail?id=")),
        question: {
            html: ".paper-container > .question-detail-container",
            question: ".question-detail-description",
            options: ".question-detail-options .question-detail-option .option-description-preview",
            type: ".question-detail-type-desc",
            workType: "qingshu",
            pageType: "qingshu"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".question-detail-container") && se.qsques;
            }));
        },
        answerHook: (e, t) => {
            const n = se.qsques[t];
            switch (e.question = removeHtml(n.description), e.options = n.options ? n.options.map((e => removeHtml(e.description))) : [], 
            e.type = typeConvert(n.typeDesc), e.answer = n.solution.split("").map((t => e.options[t.charCodeAt(0) - 65])), 
            e.type) {
              case "3":
                e.options = [], e.answer = isTrue(e.answer[0]) ? [ "\u6b63\u786e" ] : isFalse(e.answer[0]) ? [ "\u9519\u8bef" ] : [ "" ];
                break;
 
              case "15":
                e.options = [], e.answer = [], n.subQuestions.forEach((t => {
                    let n = t.options ? t.options.map((e => removeHtml(e.description))) : [], a = t.solution.split("").map((e => n[e.charCodeAt(0) - 65]));
                    e.answer.push(a), e.options.push(n);
                }));
            }
            return e;
        }
    }, {
        type: "ask",
        name: "\u9752\u4e66\u5b66\u5802\u4f5c\u4e1a\u7b54\u9898",
        tips: "\u9752\u4e66\u5b66\u5802\u4ec5\u652f\u6301\u9009\u62e9\u3001\u5224\u65ad\u7b49\u9898\u578b\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.host.includes("qingshuxuetang.com") && (location.href.includes("/Student/ExercisePaper") || location.href.includes("Student/ExamPaper") || location.href.includes("Student/ViewQuiz") || location.href.includes("Student/SimulationExercise/Detail") || location.href.includes("Student/Quiz/Detail")),
        question: {
            html: ".paper-container > .question-detail-container",
            question: ".question-detail-description",
            options: ".question-detail-options .question-detail-option .option-description",
            type: ".question-detail-type-desc",
            workType: "qingshu",
            pageType: "qingshu"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".question-detail-container") && se.qsques;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().find("input").prop("checked"),
        toquestion: e => {
            D(`.group_item:eq(${e})`), D(`.group_item:eq(${e})`).click();
        },
        questionHook: (e, t) => {
            const n = se.qsques[t];
            if (e.question = removeHtml(n.description), e.options = n.options ? n.options.map((e => removeHtml(e.description))) : [], 
            e.type = typeConvert(n.typeDesc), "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    } ], Oe = [ {
        type: "save",
        name: "\u4f18\u8bfe\u5728\u7ebf\u6536\u5f55",
        match: () => "cce.org.uooconline.com" === location.host && (location.href.includes("/exam/paper") || location.href.includes("/exam/")),
        question: {
            html: ".queContainer",
            question: ".topic-title",
            options: ".el-radio-group label .label,.el-checkbox-group label .label",
            type: ".question-box .tag",
            workType: "uooc",
            pageType: "uooc"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".queContainer").length;
            }));
        },
        answerHook: e => {
            const t = se.angular.element(e.html).scope().question;
            if (e.type = typeConvert(t.type_text), e.question = t.question, e.options = t.options_app.map((e => e.value)), 
            e.answer = t.answer.map((e => t.options[e])), "3" === e.type) e.options = [], e.answer = judgeAnswer(e.answer[0]);
            return e;
        }
    } ], Me = [ {
        type: "ask",
        name: "\u4eac\u4eba\u5e73\u53f0\u7b54\u9898",
        tips: "\u4eac\u4eba\u5e73\u53f0\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.host.includes("cj-edu.com") && (location.href.includes("/Examination") || location.href.includes("/ExamInfo")),
        question: {
            html: ".el-main>.all_subject>div.el-row",
            question: "div.stem",
            options: "ul li > label > span.el-radio__label > div:nth-child(2),ul li > label > span.el-checkbox__label > div:nth-child(2)",
            type: ".question-box .tag",
            workType: "cjedu",
            pageType: "cjedu"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".el-main>.all_subject>div.el-row").length;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            switch (D(e.html).prevAll("h1").first().text().trim()) {
              case "\u5355\u9009\u9898":
                e.type = "0";
                break;
 
              case "\u591a\u9009\u9898":
                e.type = "1";
                break;
 
              case "\u5224\u65ad\u9898":
                e.$options = D(e.html).find("ul li>label"), e.options = [], e.type = "3";
            }
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u4eac\u4eba\u5e73\u53f0\u4f5c\u4e1a\u6536\u5f55",
        match: () => location.host.includes("cj-edu.com") && location.href.includes("/ViewAnswerSheet"),
        question: {
            html: ".el-main>.all_subject>div.el-row",
            question: "p.stem",
            options: "ul li > label > span.el-radio__label > div:nth-child(2),ul li > label > span.el-checkbox__label > div:nth-child(2)",
            type: ".question-box .tag",
            workType: "cjedu",
            pageType: "cjedu"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".el-main>.all_subject>div.el-row").length;
            }));
        },
        answerHook: e => {
            let t = D(e.html).find(".seeStudentAnswer>p.answer").text().replace("\u53c2\u8003\u7b54\u6848\uff1a", "").trim(), n = D(e.html).prevAll("h1").first().text().trim();
            switch (e.options.length > 0 && (e.answer = t.split(",").map((t => e.options[t.charCodeAt(0) - 65]))), 
            n) {
              case "\u5355\u9009\u9898":
                e.type = "0";
                break;
 
              case "\u591a\u9009\u9898":
                e.type = "1";
                break;
 
              case "\u5224\u65ad\u9898":
                e.options = [], e.answer = judgeAnswer(t), e.type = "3";
            }
            return e;
        }
    } ], De = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("ytccr.com"),
        main: e => {
            const getHash = () => getUrl();
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                se.mainClass !== getHash() && (se.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u7ece\u901a\u7ee7\u6559\u4e91\u7b54\u9898",
        tips: "\u7ece\u901a\u7ee7\u6559\u4e91\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad",
        match: () => location.host.includes("ytccr.com") && location.href.includes("learning-work") && location.href.includes("type=3"),
        question: {
            html: ".border-item",
            question: ".title.qa-title",
            options: ".opts-list .opt-title-cnt",
            type: ".question-box .tag",
            workType: "ytccr",
            pageType: "ytccr"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".border-item").length;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            if (e.type = typeConvert(D(e.html).find(".qtype").text().trim()), "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u7ece\u901a\u7ee7\u6559\u4e91\u6536\u5f55",
        match: () => location.host.includes("ytccr.com") && location.href.includes("learning-work") && location.href.includes("type=5"),
        question: {
            html: ".border-item",
            question: ".title.qa-title",
            options: ".opts-list .opt-title-cnt",
            type: ".question-box .tag",
            workType: "ytccr",
            pageType: "ytccr"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".border-item").length;
            }));
        },
        answerHook: e => {
            e.type = typeConvert(D(e.html).find(".qtype").text().trim());
            let t = D(e.html).find(".u-text-success,.u-text-danger").text().split("\uff0c")[0].trim();
            if (t = t.match(/[A-Z]+$/)[0].trim(), e.answer = t.split("").map((t => e.options[t.charCodeAt(0) - 65])), 
            0 === e.answer.length) return e;
            if ("3" === e.type) e.options = [], e.answer = judgeAnswer(e.answer[0]);
            return e;
        }
    } ], ze = [ {
        type: "ask",
        name: "\u5b66\u8d77\u8003\u8bd5",
        tips: "\u5b66\u8d77\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.host.includes("chinaedu.net") && location.href.includes("oxer/page/ots/examIndex.html"),
        question: {
            html: ".queItemClass",
            question: "dt > div.din:eq(1)",
            options: "dd > div",
            type: ".question-box .tag",
            workType: "xueqi",
            pageType: "xueqi"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".queItemClass");
            })), se.document.onkeydown = null, se.oncontextmenu = null;
        },
        next: () => {},
        ischecked: e => e.parent().hasClass("cur"),
        questionHook: e => {
            let t = D(e.html).parent().find("div .fb:eq(0)").text().split("\u3001")[1];
            if (t.includes("\u5224\u65ad") && (t = "\u5224\u65ad\u9898"), e.type = typeMatch(t), 
            "3" === e.type) e.options = [], e.$options = D(e.html).find("input");
            return e;
        },
        setAnswer: e => {
            if ("3" === e.type) {
                let t = e.answer;
                return e.ques.$options.each(((e, n) => {
                    isTrue(t) && isTrue(removeHtml(D(n).val())) && D(n).click(), isFalse(t) && isFalse(removeHtml(D(n).val())) && D(n).click();
                })), !1;
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u5b66\u671f\u8003\u8bd5\u6536\u5f55",
        match: () => location.host.includes("chinaedu.net") && location.href.includes("OTS-UniverDetail.html"),
        question: {
            html: ".dl_list",
            question: "dt > div.fl:eq(1)",
            options: "dd > var",
            type: ".question-box .tag",
            workType: "xueqi",
            pageType: "xueqi"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".dl_list");
            }));
        },
        answerHook: e => {
            var t, n, a, s, o;
            const i = D(e.html).attr("queid"), r = e.html._ms_context_.el.questions.find((e => e.id === i));
            r.questionTypeName.includes("\u5224\u65ad") && (r.questionTypeName = "\u5224\u65ad\u9898"), 
            e.type = typeMatch(r.questionTypeName), e.question = removeHtml(r.stem), console.log(r), 
            e.options = (null == (n = null == (t = r.answerArea) ? void 0 : t.optionList) ? void 0 : n.sort(((e, t) => e.sequence - t.sequence)).map((e => removeHtml(e.content)))) || [];
            let l = r.answer.ans || (null == (a = r.answer.ansL) ? void 0 : a.join("")) || null;
            if (l) e.answer = l.split("").map((t => e.options[t.charCodeAt(0) - 65])); else {
                const t = (null == (o = null == (s = r.answerArea) ? void 0 : s.optionList) ? void 0 : o.filter((e => e.isTrue)).map((e => removeHtml(e.content)))) || [];
                if (0 === r.answerScore) return;
                e.answer = t;
            }
            return "3" === e.type && (e.options = [], e.answer = judgeAnswer(l)), e;
        },
        paper: e => {
            const t = D(".dl_list:eq(0)")[0]._ms_context_.loop.category, n = D(".dl_list:eq(0)")[0]._ms_context_.oAnswerDetailInfo, a = {
                platform: "xueqi"
            };
            a.hash = t.code, a.name = t.value, a.info = {}, a.chapter = [ {
                hash: `${n.arrangementid}`,
                name: n.arrangementname,
                question: e
            } ], xe.setPaper(a.hash, a);
        }
    } ], Be = [ {
        type: "hook",
        name: "hook",
        match: "gdrtvu.exam-cloud.cn" === location.host,
        main: e => {
            unsafeWindow.mainClass = getUrl();
            let t = new MutationObserver((async e => {
                unsafeWindow.mainClass !== getUrl() && (unsafeWindow.mainClass = getUrl(), vuePageChange(), 
                t.disconnect());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u7b54\u9898",
        tips: "\u516c\u544a",
        match: () => location.host.includes("exam-cloud.cn") && location.href.includes("oe-web/online-exam/exam"),
        question: {
            html: ".question-container",
            question: ".question-body:first",
            options: ".option .question-options",
            type: ".question-header .container",
            workType: "guangkai",
            pageType: "guangkai"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".question-container");
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            let t = D(".list .current-question").parent().parent().find(".title").text();
            if (console.log(t), t = t.split("\u3001")[1], t = t.replace(/\(.*\)/, "").trim(), 
            console.log(t), e.type = typeConvert(t), "8" == e.type ? e.type = typeMatch(t) : e.type, 
            "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => !0,
        finish: e => {
            D(".next .qm-primary-button").length && D(".next .qm-primary-button")[0].click();
        }
    } ], Ge = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("open.ha.cn"),
        main: e => {
            const getHash = () => D(".stuHomeworkVersionId.active").attr("id");
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                getHash(), se.mainClass !== getHash() && (se.mainClass = getHash(), vuePageChange$1(), 
                t.disconnect());
            }));
            D(".homeworkBody").length >= 1 && t.observe(D(".homeworkBody")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u4e91\u4e0a\u6cb3\u5f00\u7b54\u9898",
        tips: "\u4e91\u4e0a\u6cb3\u5f00\u4ec5\u652f\u6301\u9009\u62e9\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.host.includes("open.ha.cn") && location.href.includes("/homework/showHomeworkByStatus") && location.href.includes("checked=false"),
        question: {
            html: ".layui-colla-content > .insert",
            question: ".window-title",
            options: ".option-title",
            type: ".question-box .tag",
            workType: "openha",
            pageType: "openha"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".layui-colla-content > .insert");
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => (e.options = e.$options.map(((t, n) => {
            let a = D(n).find(".numberCover").text().trim();
            return removeHtml(e.$options.eq(t).html()).replace(a, "").trim();
        })).get(), e.type = typeConvert(D(e.html).find(".questionDiv>.float-l:eq(1)").text().trim()), 
        e.$options = D(e.html).find(".option-title .numberCover"), e),
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u4e91\u4e0a\u6cb3\u5f00\u6536\u5f55",
        match: () => location.host.includes("open.ha.cn") && location.href.includes("/homework/showHomeworkByStatus") && location.href.includes("checked=true"),
        question: {
            html: ".layui-colla-content > .insert",
            question: ".window-title",
            options: ".option-title",
            type: ".question-box .tag",
            workType: "openha",
            pageType: "openha"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".layui-colla-content > .insert");
            }));
        },
        answerHook: e => {
            let t = [];
            const n = 0 == D(e.html).find(".option-title.error2").length;
            if (e.options = e.$options.map(((n, a) => {
                let s = D(a).find(".numberCover").text().trim(), o = removeHtml(e.$options.eq(n).html()).replace(s, "").trim();
                return D(a).hasClass("answer-title") && t.push(o), o;
            })).get(), e.type = typeConvert(D(e.html).find(".questionDiv>.float-l:eq(1)").text().trim()), 
            n) return e.answer = t, D(e.html).find(".option-title.error2"), e;
        },
        paper: e => {
            const t = se.homework, n = {
                platform: "openha"
            };
            n.hash = t.courseId, n.name = t.courseName, n.info = {}, n.chapter = [ {
                hash: `${t.homeworkId}`,
                name: t.title,
                question: e
            } ], xe.setPaper(n.hash, n);
        }
    } ], Ve = [ {
        type: "hook",
        name: "hook",
        match: "lhycjy.cloudwis.tech" === location.host || "hnlg.crjxjy.net" === location.host,
        main: e => {
            const getHash = () => (D(".item.changeless-box.active").attr("data-id"), D(".item.changeless-box.active").attr("data-id"));
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                se.mainClass !== getHash() && (se.mainClass = getHash(), "homework-detail-container" === se.mainClass && await waitUntil((function() {
                    return 0 === D(".el-loading-mask").length;
                })), vuePageChange$1(), t.disconnect());
            }));
            D(".exam-content").length >= 1 && t.observe(D(".exam-content")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u6cb3\u5357\u7ee7\u7eed\u6559\u80b2\u7b54\u9898",
        tips: "\u8be5\u5e73\u53f0\u4ec5\u652f\u6301\u9009\u62e9\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988",
        match: () => location.href.includes("uc/task/startTask"),
        question: {
            html: ".carousel-inner>.item.changeless-box.active",
            question: ".exam-tg-txt__wrap.e-tg-box",
            options: ".ic-options-list address",
            type: ".question-box .tag",
            workType: "cloudwis",
            pageType: "cloudwis"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".carousel-inner>.item.changeless-box");
            })), !isExist("#finish")) return !1;
        },
        next: () => {
            D(".next-slide").click();
        },
        ischecked: e => e.find(".checked").length > 0,
        questionHook: e => (e.type = typeConvert(D(e.html).attr("data-name") || ""), e.$options = D(e.html).find(".ic-options__wrap label"), 
        e.question = e.question.replace(/^\(\d+\)/, "").trim(), e.question = e.question.replace(/\(\d+\u5206\)$/, "").trim(), 
        e),
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "ask",
        name: "\u6cb3\u5357\u7ee7\u7eed\u6559\u80b2\u8003\u8bd5\u7b54\u9898",
        tips: "\u8be5\u5e73\u53f0\u4ec5\u652f\u6301\u9009\u62e9\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988",
        match: () => location.href.includes("uc/exam/record/startExamination"),
        question: {
            html: ".trunk-box",
            question: ".exam-tg-txt__wrap.e-tg-box",
            options: ".ic-options-list address",
            type: ".question-box .tag",
            workType: "cloudwis",
            pageType: "cloudwis"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".trunk-box") && isExist(".ic-ac-checkbox-ol");
            })), await waitUntil((function() {
                return window.scrollTo(0, document.body.scrollHeight), D(".ic-ac-checkbox-ol li").length == D(".trunk-box").length;
            })), !isExist("#submit-btn")) return !1;
        },
        next: () => {
            D(".next-slide").click();
        },
        ischecked: e => e.find(".checked").length > 0,
        questionHook: e => {
            const t = D(e.html).attr("data-type");
            switch (console.log(t), t) {
              case "1":
                e.type = "0";
                break;
 
              case "2":
                e.type = "1";
                break;
 
              case "3":
                e.type = "3", e.options = [];
            }
            return e.question = e.question.replace(/^\d+\u3001/, "").trim(), e.question = e.question.replace(/\(\d+\u5206\)$/, "").trim(), 
            e.question = e.question.replace(/\[\S+\]$/, "").trim(), e.$options = D(e.html).find(".ic-options__wrap label"), 
            e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u6cb3\u5357\u7ee7\u7eed\u6559\u80b2\u6536\u5f55",
        match: () => "lhycjy.cloudwis.tech" === location.host && location.href.includes("uc/task/startTask"),
        question: {
            html: ".carousel-inner>.item.changeless-box",
            question: ".exam-tg-txt__wrap.e-tg-box",
            options: ".ic-options-list address",
            type: ".question-box .tag",
            workType: "cloudwis",
            pageType: "cloudwis"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".carousel-inner>.item.changeless-box") && isExist(".slide-tihao");
            })), await waitUntil((function() {
                return D(".slide-tihao").length, D(".carousel-inner>.item.changeless-box").length, 
                D(".slide-tihao").eq(-1), D(".slide-tihao").length == D(".carousel-inner>.item.changeless-box").length;
            })), isExist("#finish")) return !1;
            D(".slide-tihao").eq(-1)[0].click();
        },
        next: () => {},
        answerHook: e => {
            const t = D(e.html).find(".analysis-box .fs20.c-primary.vam").text().trim().split("");
            return e.type = typeConvert(D(e.html).attr("data-name") || ""), e.answer = t.map((t => e.options[t.charCodeAt(0) - 65])), 
            e.question = e.question.replace(/^\(\d+\)/, "").trim(), e.question = e.question.replace(/\(\d+\u5206\)$/, "").trim(), 
            e;
        }
    }, {
        type: "save",
        name: "\u6cb3\u5357\u7ee7\u7eed\u6559\u80b2\u8003\u8bd5\u6536\u5f55",
        match: () => location.href.includes("uc/exam/record/startExamination"),
        question: {
            html: ".trunk-box.answer-question",
            question: ".exam-tg-txt__wrap.e-tg-box",
            options: ".ic-options-list address",
            type: ".question-box .tag",
            workType: "cloudwis",
            pageType: "cloudwis"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".trunk-box") && isExist(".ic-ac-correct");
            })), await waitUntil((function() {
                return window.scrollTo(0, document.body.scrollHeight), D(".ic-ac-correct,.ic-ac-error").length == D(".trunk-box").length;
            })), isExist("#submit-btn")) return !1;
        },
        next: () => {
            D(".next-slide").click();
        },
        answerHook: e => {
            const t = D(e.html).attr("data-type");
            console.log(t);
            const n = D(e.html).find(".ic-options__wrap label").filter(((e, t) => D(t).find(".checked").length > 0)).map(((e, t) => removeHtml(D(t).html()))).get();
            switch (e.answer = n.map((t => e.options[t.charCodeAt(0) - 65])), e.question = e.question.replace(/^\d+\u3001/, "").trim(), 
            e.question = e.question.replace(/\(\d+\u5206\)$/, "").trim(), e.question = e.question.replace(/\[\S+\]$/, "").trim(), 
            t) {
              case "1":
                e.type = "0";
                break;
 
              case "2":
                e.type = "1";
                break;
 
              case "3":
                e.type = "3", e.options = [], e.answer = judgeAnswer(e.answer[0]);
            }
            return e;
        }
    } ], Ne = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("sclecb.cn"),
        main: e => {
            const getHash = () => getUrl();
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                se.mainClass !== getHash() && (se.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u56db\u5ddd\u5f00\u653e\u5927\u5b66\u7b54\u9898",
        tips: "\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => "study.sclecb.cn" === location.host && /\/[0-9]+\/show/i.test(location.href),
        question: {
            html: ".testpaper-question.js-testpaper-question",
            question: ".testpaper-question-stem",
            options: ".testpaper-question-choices li",
            type: ".question-box .tag",
            workType: "sclecb",
            pageType: "sclecb"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".testpaper-question.js-testpaper-question");
            }));
        },
        next: () => {},
        ischecked: e => e.hasClass("checked"),
        questionHook: e => {
            switch (e.options = removeStartChar(e.options), e.$options = D(e.html).find(".testpaper-question-choice-inputs > label > input"), 
            e.type = typeConvert(D(e.html).parent().parent().find(".panel-heading>strong").text().trim()), 
            e.type, e.type) {
              case "0":
              case "1":
                break;
 
              case "3":
                e.$options = D(e.html).find(".radio-inline");
            }
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "ask",
        name: "\u56db\u5ddd\u5f00\u653e\u5927\u5b66\u7b54\u9898\u65e7",
        tips: "\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.host.includes("sclecb.cn") && /student\/course\/study\/[0-9a-zA-Z]+\/test\/redo/i.test(location.href),
        question: {
            html: ".questiono-item",
            question: ".clearfix.questiono-header h6",
            options: ".common_test_option .processing_img",
            type: ".question-box .tag",
            workType: "sclecb",
            pageType: "sclecb"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".questiono-item");
            }));
        },
        next: () => {},
        ischecked: e => e.hasClass("checked"),
        questionHook: e => {
            const t = D(e.html).parent().parent().find("div:eq(0)").text().trim();
            switch (!0) {
              case t.includes("\u5355\u9009\u9898"):
                e.type = "0";
                break;
 
              case t.includes("\u591a\u9009\u9898"):
                e.type = "1";
                break;
 
              case t.includes("\u5224\u65ad\u9898"):
                e.type = "3", e.options = [], e.$options = D(e.html).find(".common_test_option > label");
                break;
 
              default:
                return;
            }
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u56db\u5ddd\u5f00\u653e\u5927\u5b66\u6536\u5f55",
        match: () => "study.sclecb.cn" === location.host && (/task\/[0-9]+\/activity_show/i.test(location.href) || /result\/[0-9]+\/show/i.test(location.href)),
        question: {
            html: ".testpaper-question.js-testpaper-question",
            question: ".testpaper-question-stem",
            options: ".testpaper-question-choices li",
            type: ".question-box .tag",
            workType: "sclecb",
            pageType: "sclecb"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".testpaper-question.js-testpaper-question");
            }));
        },
        answerHook: (e, t) => {
            let n = [];
            e.options = e.$options.map(((e, t) => {
                const a = removeHtml(D(t).clone().find(".testpaper-question-choice-index").remove().end().html());
                return D(t).hasClass("testpaper-question-choice-right") && n.push(a), a;
            })).get(), e.answer = n, e.type = typeConvert(D(".js-panel-card>span").eq(t).prevAll("p").first().text().trim());
            const a = D(".js-panel-card>span").eq(t).hasClass("bg-success");
            switch (e.type) {
              case "0":
              case "1":
                break;
 
              case "3":
                let t = "";
                t = D(e.html).find(".testpaper-question-result").text().replace("\u4f60\u7684\u7b54\u6848\u662f", "").trim(), 
                e.answer = judgeAnswer(t);
            }
            if (!a && e.answer.length > 0 && "3" == e.type) e.answer = "\u6b63\u786e" == e.answer[0] ? [ "\u9519\u8bef" ] : "\u9519\u8bef" == e.answer[0] ? [ "\u6b63\u786e" ] : []; else if (!a) return;
            return e;
        }
    } ], Re = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("superchutou.com"),
        main: e => {
            const getHash = () => getUrl();
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                se.mainClass !== getHash() && (se.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            D("#root").length >= 1 && t.observe(D("#root")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u51fa\u5934\u7cfb\u7edf\u7b54\u9898",
        tips: "\u672c\u8003\u8bd5\u4ec5\u9002\u914d\u9009\u62e9\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.host.includes("superchutou.com") && location.href.includes("onlineclass/exam/"),
        question: {
            html: "[class^='single_excer_item']",
            question: "[class^='title_content'] > [class^='title_content_text']:eq(1)",
            options: "[class^='options_content'] label",
            type: ".question-box .tag",
            workType: "chutou",
            pageType: "chutou"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist("[class^='single_excer_item']");
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            let t = D(e.html).find("[class^='title_content'] > span:eq(1)").text();
            if (t = t.replace(/\u3010|\u3011/g, "").trim(), e.type = typeConvert(t), e.options = removeStartChar(e.options), 
            "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u6536\u5f55",
        match: () => location.host.includes("superchutou.com") && location.href.includes("/onlineclass/analysis/"),
        question: {
            html: "[class^='single_excer_item']",
            question: "[class^='title_content'] > [class^='title_content_text']:eq(1)",
            options: "[class^='options_content'] label",
            type: ".question-box .tag",
            workType: "chutou",
            pageType: "chutou"
        },
        init: async () => {},
        answerHook: e => {
            let t = D(e.html).find("[class^='title_content'] > span:eq(1)").text();
            t = t.replace(/\u3010|\u3011/g, "").trim(), e.type = typeConvert(t), e.options = removeStartChar(e.options);
            const n = D(e.html).find(".ant-collapse-header>div.ant-row>div.ant-col.ant-col-18>div:eq(1)").text().replace("\u53c2\u8003\u7b54\u6848\uff1a", "").trim();
            switch (e.type) {
              case "0":
              case "1":
                e.answer = n.split("").map((t => e.options[t.charCodeAt(0) - 65]));
                break;
 
              case "3":
                e.options = [], e.answer = judgeAnswer(n);
            }
            return e;
        }
    } ], We = [ {
        type: "ask",
        name: "\u826f\u5e08\u5728\u7ebf\u7b54\u9898",
        tips: "\u8be5\u5e73\u53f0\u4ec5\u9002\u914d\u9009\u62e9\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.host.includes("ls365.net") && (location.href.includes("student/examing.aspx") || location.href.includes("Student/myhomework.aspx")),
        question: {
            html: ".exam_question",
            question: ".exam_question_title",
            options: ".question_select .select_detail",
            type: ".exam_question_title strong",
            workType: "ls365",
            pageType: "ls365"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".exam_question");
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            let t = D(e.html).find(".exam_question_title").clone();
            t.find(".question_number").remove(), t.find("strong").remove(), t.find(".exam_feed_back").remove(), 
            e.question = removeHtml(t.html());
            let n = D(e.html).find(".exam_question_title strong").text();
            return n = n.replace(/\[|\]/g, "").trim(), e.type = typeConvert(n), e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u826f\u5e08\u5728\u7ebf\u8003\u8bd5\u6536\u5f55",
        match: () => location.host.includes("ls365.net") && location.href.includes("User/Student/ViewPaper.aspx"),
        question: {
            html: "[name^='anchor_']",
            question: ".title-img-ctr",
            options: ".pold .phtml",
            type: ".QuestionsType",
            workType: "ls365",
            pageType: "ls365"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist("[name^='anchor_']");
            }));
        },
        answerHook: e => {
            let t = D(e.html).find(".QuestionsType").text();
            t = t.replace(/\[|\]/g, "").trim(), e.type = typeConvert(t);
            let n = D(e.html).find(".my-work-answer>p").filter(((e, t) => t.innerText.includes("\u53c2\u8003\u7b54\u6848"))).map(((e, t) => D(t).find(".two").text())).get();
            if (0 !== n.length) return e.answer = n[0].split("").map((t => e.options[t.charCodeAt(0) - 65])), 
            e;
        }
    }, {
        type: "save",
        name: "\u826f\u5e08\u5728\u7ebf\u4f5c\u4e1a\u6536\u5f55",
        match: () => location.host.includes("ls365.net") && location.href.includes("Student/myhomework_after.aspx"),
        question: {
            html: "[name^='anchor_']",
            question: ".my-work-nav>.col-md-10",
            options: ".pold .phtml",
            type: ".QuestionsType",
            workType: "ls365",
            pageType: "ls365"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist("[name^='anchor_']");
            }));
        },
        answerHook: e => {
            let t = D(e.html).find(".my-work-nav>div:eq(0)>span:eq(0)").text();
            t = t.replace(/\[|\]/g, "").trim(), e.type = typeConvert(t);
            let n = D(e.html).find(".my-work-answer>p").filter(((e, t) => t.innerText.includes("\u53c2\u8003\u7b54\u6848"))).map(((e, t) => D(t).find(".two").text())).get();
            if (0 !== n.length) return e.answer = n[0].split("").map((t => e.options[t.charCodeAt(0) - 65])), 
            e;
        }
    } ], Qe = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("jijiaox.com"),
        main: e => {
            se.mainClass = D("#app")[0].__vue__.$route.path;
            let t = new MutationObserver((async e => {
                se.mainClass !== D("#app")[0].__vue__.$route.path && (se.mainClass = D("#app")[0].__vue__.$route.path, 
                vuePageChange(), t.disconnect());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u7ee7\u6559\u4e91\u8003\u8bd5\u7b54\u9898",
        tips: "\u4ec5\u652f\u6301\u9009\u62e9\u3001\u5224\u65ad\u3001\u7b80\u7b54\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.host.includes("jijiaox.com") && (location.href.includes("/mg/studentindexexam/") || !location.href.includes("examrec")),
        question: {
            html: ".question>div",
            question: ".topic-title",
            options: ".ml_2 label",
            type: ".question-box .tag",
            workType: "jijiaox",
            pageType: "jijiaox"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".question>div");
            }));
        },
        next: () => {},
        ischecked: e => e.hasClass("is-checked"),
        questionHook: (e, t) => {
            const n = D(".page")[0].__vue__.$data.testInfo.studentPraxisList[t];
            switch (e.options = n.options ? n.options : [], "string" == typeof e.options && (e.options = []), 
            e.question = removeHtml(n.title), n.type) {
              case "single":
                e.type = "0";
                break;
 
              case "muti":
                e.type = "1";
                break;
 
              case "charge":
                e.type = "3";
                break;
 
              case "text":
                e.type = "4";
                break;
 
              default:
                console.log(n.type, "\u672a\u77e5\u7c7b\u578b");
            }
            return e;
        },
        setAnswer: e => "4" !== e.type || (D(e.html).find(".editor")[0].__vue__.editor.txt.html(e.answer[0]), 
        !1),
        finish: e => {}
    }, {
        type: "save",
        name: "\u7ee7\u6559\u4e91\u8003\u8bd5\u6536\u5f55",
        match: () => location.host.includes("jijiaox.com") && location.href.includes("/mg/studentindexexam/examrec/"),
        question: {
            html: ".question>div",
            question: ".topic-title",
            options: ".el-radio-group label .label,.el-checkbox-group label .label",
            type: ".question-box .tag",
            workType: "jijiaox",
            pageType: "jijiaox"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".question>div");
            }));
        },
        answerHook: (e, t) => {
            const n = D(".page")[0].__vue__.$data.testInfo.studentPraxisList[t], a = n.answer;
            switch (e.options = n.options ? n.options : [], "string" == typeof e.options && (e.options = []), 
            e.question = removeHtml(n.title), n.type) {
              case "single":
                e.type = "0";
                break;
 
              case "muti":
                e.type = "1";
                break;
 
              case "charge":
                e.type = "3", e.answer = "1" == a ? [ "\u6b63\u786e" ] : "-1" == a ? [ "\u9519\u8bef" ] : [];
                break;
 
              case "text":
                e.type = "4", e.answer = [ removeHtml(a) ];
                break;
 
              default:
                console.log(n.type, "\u672a\u77e5\u7c7b\u578b");
            }
            switch (e.type) {
              case "0":
              case "1":
                console.log("________", a), e.answer = "string" == typeof a ? a.split("").map((t => e.options[t.charCodeAt(0) - 65])) : a.map((t => (console.log(t), 
                e.options[t.charCodeAt(0) - 65])));
            }
            return console.log(e), e;
        }
    } ], Je = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("wencaischool.net") && D("#app").length,
        main: e => {
            se.mainClass = D("#app")[0].__vue__.$route.path;
            let t = new MutationObserver((async e => {
                se.mainClass !== D("#app")[0].__vue__.$route.path && (se.mainClass = D("#app")[0].__vue__.$route.path, 
                vuePageChange(), t.disconnect());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
            const n = document.createElement("style");
            n.type = "text/css", n.innerHTML = "* {\n              font-size: 13px !important;\n            }", 
            document.head.appendChild(n);
        }
    }, {
        type: "ask",
        name: "\u67e0\u6aac\u6587\u624d\u8003\u8bd5\u7b54\u9898",
        tips: "\u6b64\u5e73\u53f0\u7b54\u9898\u95f4\u9694\u5c3d\u91cf3s\u5de6\u53f3\uff0c\u5426\u5219\u53ef\u80fd\u9009\u4e0d\u4e0a\u7b54\u6848\uff0c\u4e0d\u652f\u6301\u7684\u9898\u578b\u8bf7\u8054\u7cfb\u4f5c\u8005\u9002\u914d",
        match: () => location.host.includes("wencaischool.net") && location.href.includes("/separation/exam/index.html"),
        question: {
            html: ".tmList",
            question: ".tmTitleTxt",
            options: ".perRad .opCont",
            type: ".question-box .tag",
            workType: "wencai",
            pageType: "wencai"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".tmList") && D("#onlineExamArea")[0].__vue__._data.itemsList.length > 0;
            }));
        },
        next: () => {},
        ischecked: e => e[0].checked,
        questionHook: e => {
            let t = D(e.html).find(".tmc.tm").attr("ttype");
            return e.type = typeConvert({
                1: "\u586b\u7a7a\u9898",
                2: "\u7b80\u7b54\u9898",
                3: "\u5355\u9009\u9898",
                4: "\u591a\u9009\u9898",
                5: "\u9605\u8bfb\u7406\u89e3",
                12: "\u5b8c\u5f62\u586b\u7a7a"
            }[t]), e.$options = D(e.html).find(".perRad input"), e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "4":
                return D(e.html).find("textarea").focus(), document.execCommand("selectAll"), document.execCommand("insertText", !1, e.answer[0]), 
                !1;
 
              case "2":
                D(e.html).find(".ansbox.inputAnswer input").each((async (t, n) => {
                    n.focus(), document.execCommand("selectAll");
                    let a = e.answer[t];
                    document.execCommand("insertText", !1, a), await sleep(1e3);
                }));
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u67e0\u6aac\u6587\u624d\u8003\u8bd5\u6536\u5f55",
        match: () => location.host.includes("wencaischool.net") && location.href.includes("/separation/exam/index.html"),
        question: {
            html: ".tmList",
            question: ".tmTitleTxt",
            options: ".perRad .opCont",
            type: ".question-box .tag",
            workType: "wencai",
            pageType: "wencai"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".tmList") && D("#onlineExamArea")[0].__vue__._data.itemsList.length > 0;
            }));
        },
        answerHook: (e, t) => {
            const n = D("#onlineExamArea")[0].__vue__._data.itemsList[t];
            e.question = removeHtml(n.itemName), e.options = n.optionNodes.map((e => removeHtml(e.optionContent)));
            e.type = typeConvert({
                1: "\u586b\u7a7a\u9898",
                2: "\u7b80\u7b54\u9898",
                3: "\u5355\u9009\u9898",
                4: "\u591a\u9009\u9898",
                5: "\u9605\u8bfb\u7406\u89e3",
                12: "\u5b8c\u5f62\u586b\u7a7a"
            }[n.itemType]);
            let a = n.itemAnswer[0].optionContent;
            switch (e.type) {
              case "0":
              case "1":
                e.answer = a.split("").map((t => e.options[t.charCodeAt(0) - 65]));
                break;
 
              case "4":
                e.answer = removeHtml(a);
                break;
 
              case "2":
                e.answer = n.itemAnswer.map((e => removeHtml(e.optionContent)));
            }
            return e;
        }
    }, {
        type: "ask",
        name: "\u67e0\u6aac\u6587\u624d\u4f5c\u4e1a\u7b54\u9898",
        tips: "\u67e0\u6aac\u6587\u624d\u4f5c\u4e1a\u4ec5\u652f\u6301\u9009\u62e9\u3001\u5224\u65ad\u3001\u586b\u7a7a\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u8054\u7cfb\u4f5c\u8005\u9002\u914d",
        match: () => location.host.includes("wencaischool.net") && location.href.includes("/exam/portal/exam.jsp"),
        question: {
            html: "table[id^='tblItem_'][islabel='0']",
            question: "table>tbody>tr:eq(0)>td:eq(0)",
            options: "table>tbody>tr:eq(1)>td:eq(0) table>tbody>tr>td>label",
            type: ".question-box .tag",
            workType: "wencai",
            pageType: "wencai"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist("table[id^='tblItem_'][islabel=0]");
            })), D(".aah_wrapper>div").css("z-index", 9999);
        },
        next: () => {},
        ischecked: e => e[0].checked,
        questionHook: e => {
            let t = removeHtml(D(e.html).parent().parent().prevAll("tr").filter((function() {
                return D(this).find("table[islabel='1']").length > 0;
            })).first().html());
            if (e.type = typeMatch(t), "8" == e.type && t.includes("\u9009\u62e9\u9898") && (e.type = "0"), 
            "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => {
            if ("2" === e.type) {
                const t = D(e.html).find("table>tbody>tr:eq(0)>td:eq(0)>input");
                t.length == e.answer.length && t.each((async (t, n) => {
                    n.value = "", n.focus(), document.execCommand("selectAll");
                    let a = e.answer[t];
                    document.execCommand("insertText", !1, a), await sleep(1e3);
                }));
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u67e0\u6aac\u6587\u624d\u4f5c\u4e1a\u6536\u5f55",
        match: () => location.host.includes("wencaischool.net") && location.href.includes("/openlearning/exam/portal/view_answer.jsp"),
        question: {
            html: "tr[id^='trScore_']",
            question: "table>tbody>tr:eq(0)>td:eq(0)",
            options: "table>tbody>tr:eq(1)>td:eq(0) table>tbody>tr>td>label",
            type: ".question-box .tag",
            workType: "wencai",
            pageType: "wencai"
        },
        init: async () => {},
        answerHook: (e, t) => {
            const n = removeHtml(D(e.html).prevAll("tr:not([id])").first().html());
            switch (e.type = typeMatch(n), "8" == e.type && n.includes("\u9009\u62e9\u9898") && (e.type = "0"), 
            e.type) {
              case "0":
              case "1":
              case "3":
                const t = D(e.html).find("table>tbody>tr:eq(1)>td:eq(0)>div[style='color:darkred;font-size:10pt']").text().split("\u7b54\u6848\uff1a")[1].split("]")[0];
                e.answer = t.split("").map((t => e.options[t.charCodeAt(0) - 65])), "3" == e.type && (e.options = [], 
                e.answer = judgeAnswer(e.answer[0]));
                break;
 
              case "2":
                const n = D(e.html).find("table>tbody>tr:eq(0)>td:eq(0)").clone();
                n.find("input").remove(), e.answer = n.find("nobr").map(((e, t) => {
                    const n = removeHtml(D(t).html());
                    return /\[\u53c2\u8003\u7b54\u6848\uff1a(.+?)\]/.exec(n)[1];
                })).get(), n.find("nobr").remove(), n.find("font").remove(), e.question = removeHtml(n.html());
            }
            return e;
        }
    } ], Xe = [ {
        type: "hook",
        name: "hook",
        match: "www.xxxx.com" === location.host,
        main: e => {
            const getHash = () => D(".el-main > div:eq(0)").attr("class");
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                se.mainClass !== getHash() && (se.mainClass = getHash(), "homework-detail-container" === se.mainClass && await waitUntil((function() {
                    return 0 === D(".el-loading-mask").length;
                })), vuePageChange$1(), t.disconnect());
                for (let n of e) "attributes" === n.type && "class" === n.attributeName && n.target.textContent && (n.target.textContent.includes("\u4e0b\u4e00\u9898") || n.target.textContent.includes("\u4e0a\u4e00\u9898")) && (t.disconnect(), 
                vuePageChange$1());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "save",
        name: "\u6536\u5f55",
        match: () => location.host.includes("yxlearning.com") && location.href.includes("exam/start?myExamRecordId"),
        question: {
            html: ".subject>.mb20.sub",
            question: ".ls1.lh30.text-f666",
            options: "ul.options>li.cursor-p",
            type: ".question-box .tag",
            workType: "yxlearning",
            pageType: "yxlearning"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".mb20.sub");
            })), !se.yxques) return !1;
        },
        answerHook: (e, t) => {
            const n = [];
            se.yxques.questionStemRPS.forEach(((e, t) => {
                e.listPaperQuestionRP.forEach(((e, t) => {
                    n.push(e);
                }));
            }));
            const a = n[t];
            e.question = titleClean(removeHtml(a.questionName));
            const s = a.type, o = [];
            switch (e.options = removeStartChar(a.paperOptionRPS.map((e => removeHtml(e.context)))), 
            a.paperOptionRPS.forEach(((t, n) => {
                1 == t.standardAnswer && o.push(e.options[n]);
            })), e.answer = o, s) {
              case 1:
                e.type = "3", e.options = [], e.answer = judgeAnswer(e.answer[0]);
                break;
 
              case 2:
                e.type = "0";
                break;
 
              case 3:
                e.type = "1";
            }
            return e;
        }
    }, {
        type: "ask",
        name: "\u65e5\u7167\u4e13\u4e1a\u6280\u672f\u4eba\u5458\u7b54\u9898",
        tips: "\u672c\u5e73\u53f0\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988",
        match: () => location.host.includes("yxlearning.com") && location.href.includes("exam/start?myExamRecordId"),
        question: {
            html: ".mb20.sub",
            question: ".ls1.lh30.text-f666",
            options: ".cursor-p",
            type: ".question-box .tag",
            workType: "yxlearning",
            pageType: "yxlearning"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".mb20.sub");
            }));
        },
        next: () => {},
        ischecked: e => e.hasClass("active"),
        questionHook: e => {
            if (e.options = removeStartChar(D(e.html).find("ul>li").map(((e, t) => removeHtml(D(t).html()))).get()), 
            e.$options = D(e.html).find("ul>li"), e.type = typeConvert(D(e.html).parent().prevAll(".title").first().find("[du-html='questionStemName']").text().trim()), 
            "3" === e.type) e.options = [], e.$options = D(e.html).find("ul>li");
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    } ], Ze = [ {
        type: "ask",
        name: "\u9ea6\u80fd\u7f51\u7b54\u9898",
        tips: "\u8be5\u5e73\u53f0\u4ec5\u517c\u5bb9\u9009\u62e9\u5224\u65ad\uff0c\u5176\u4ed6\u9898\u578b\u53ef\u80fd\u5b58\u5728bug\uff0c\u8bf7\u81ea\u884c\u68c0\u67e5",
        match: () => location.href.includes("lms/web/onlineexam/exambegin"),
        question: {
            html: ".ptypediv>.sdiv",
            question: ".namediv",
            options: ".itemdiv > .optiondiv",
            type: ".question-box .tag",
            workType: "cjnep",
            pageType: "cjnep"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".sdiv");
            }));
        },
        next: () => {
            D('.btndiv > span:contains("\u4e0b\u4e00\u9898")').click();
        },
        toquestion: e => {
            D(`.controldiv > a:eq(${e})`), D(".controldiv > a:eq(61)").click(), D(`.controldiv > a:eq(${e})`)[0].click();
        },
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            e.question = e.question.replace(/^\u7b2c\d+\s\u9898[\uff1a:]?/, "").trim(), e.options = removeStartChar(e.options);
            let t = D(e.html).parent().find(".pnamediv").text();
            if (e.type = typeMatch(t), e.$options = D(e.html).find(".ansdiv input"), "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "3":
                let t = e.answer;
                return D(e.html).find(".ansdiv input").each(((e, n) => {
                    isTrue(t) && "1" == D(n).val() && D(n).click(), isFalse(t) && "0" == D(n).val() && D(n).click();
                })), !1;
 
              case "2":
              case "4":
              case "5":
              case "6":
                return D(e.html).find(".ansdiv textarea").val(e.answer.join(";")), D(e.html).find(".ansdiv textarea").trigger("input"), 
                D(e.html).find(".ansdiv textarea").trigger("keydown"), !1;
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u9ea6\u80fd\u7f51\u7b54\u9898\u6536\u5f55",
        match: () => location.href.includes("lms/web/exam/examshow"),
        question: {
            html: ".ptypediv>.sdiv",
            question: ".namediv",
            options: ".itemdiv > .optiondiv",
            type: ".question-box .tag",
            workType: "cjnep",
            pageType: "cjnep"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".sdiv");
            }));
        },
        answerHook: e => {
            e.question = e.question.replace(/^\u7b2c\d+\s\u9898[\uff1a:]?/, "").trim(), e.options = removeStartChar(e.options);
            let t = D(e.html).find(".ansdiv input[name^='aquestion']:checked").closest(".item-span").text();
            t = t.replace(/\s|\./g, "").trim(), e.answer = t.split("").map((t => e.options[t.charCodeAt() - 65]));
            let n = D(e.html).parent().find(".pnamediv").text();
            e.type = typeMatch(n);
            let a = "";
            try {
                a = D(e.html).find(".ansdiv").contents().filter((function() {
                    return 3 === this.nodeType && this.nodeValue.trim().startsWith("\u7b54\u6848\uff1a");
                })).get(0).nodeValue.trim().substring(3).trim(), a = removeHtml(a);
            } catch (s) {}
            switch (e.type) {
              case "2":
                e.answer = a.split(";");
                break;
 
              case "3":
                a = D(D(e.html).find(".ansdiv").html().split("\u6b63\u786e\u7b54\u6848\uff1a")[1]).find("input[name^='aquestion']:checked").closest("span").text(), 
                e.answer = judgeAnswer(a);
                break;
 
              case "4":
                a.length > 0 && (e.answer = [ a ]), e.options = [];
            }
            return e;
        }
    } ], Ye = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("91huayi.com"),
        main: e => {
            const getHash = () => D(".dd_01").attr("questionid");
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                se.mainClass !== getHash() && (se.mainClass = getHash(), "homework-detail-container" === se.mainClass && await waitUntil((function() {
                    return 0 === D(".el-loading-mask").length;
                })), vuePageChange$1(), t.disconnect());
            }));
            D(".box").length >= 1 && t.observe(D(".box")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u534e\u533b\u7f51\u7b54\u9898",
        tips: "\u76ee\u524d\u4ec5\u652f\u6301\u9009\u9879\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.host.includes("91huayi.com") && location.href.includes("/ExamInterface/ComputerExamIndex"),
        question: {
            html: "#exampage",
            question: ".dd_01",
            options: ".dd_02",
            type: ".big_type",
            workType: "huayi",
            pageType: "huayi"
        },
        init: async () => {},
        next: () => {
            var e;
            null == (e = D("#btnNext")) || e.click();
        },
        ischecked: e => e.prop("checked"),
        questionHook: e => {
            const t = D(e.html).find(".dd_01").clone();
            return t.find(".dd_01_red").remove(), e.question = removeHtml(t.html()), e.options = removeStartChar(e.options), 
            e.type = typeMatch(D(e.html).find(".big_type").text()), e.$options = D(e.html).find("dd.q-content input"), 
            e;
        },
        setAnswer: e => {
            switch (console.log(e), e.type) {
              case "0":
              case "1":
                return e.ques.$options.each(((t, n) => {
                    if (e.answer.includes(t)) {
                        if (e.rule.ischecked && e.rule.ischecked(D(n))) return;
                        n.click();
                    } else e.rule.ischecked && e.rule.ischecked(D(n)) && n.click();
                })), !1;
            }
            return !0;
        },
        finish: e => {}
    } ], Ke = [ {
        type: "ask",
        name: "\u4e91\u5357\u5f00\u653e\u5927\u5b66\u7b54\u9898",
        tips: "\u4e91\u5f00\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.href.includes("hw/student/studentStartHomework.action") && location.host.includes("teach.ynou.edu.cn"),
        question: {
            html: ".e_juan02biaoti",
            question: ".qcontent > p:first",
            options: ".signDefault>.label",
            type: ".question-box .tag",
            workType: "ynou",
            pageType: "ynou"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".e_juan02biaoti").length;
            })), D("body").css("text-align", "left");
        },
        next: () => {},
        ischecked: e => (e.find("input").is(":checked"), e.find("input").is(":checked")),
        questionHook: e => {
            e.options = [];
            const t = D(e.html).find(".e_juan02daan").clone();
            t.find(".clear").nextAll().remove();
            const n = removeHtml(t.html()), a = n.split(/[A][\u3001\.\uff0e]/)[0].trim();
            null !== a && (e.question = a), e.question = a, e.question = a;
            const s = n.match(/(?:[A-G](?:[\u3001.]|\s)?\s?.*?)(?=\s*[A-G](?:[\u3001.]|\s)?|\s*$)/gs);
            if (null !== s) {
                const t = removeOptionsStartChar(s.map((e => e.trim())));
                !1 !== t && (e.options = t);
            }
            const o = D(e.html).find(".signDefault").attr("answer_control");
            return "radio" === o && e.options.length > 1 && (e.type = "0"), "checkbox" === o && e.options.length > 1 && (e.type = "1"), 
            "radio" === o && 0 === e.options.length && (e.type = "3"), e;
        },
        setAnswer: e => {
            if (console.log(e), "3" === e.type) {
                let t = e.answer;
                return e.ques.$options.each(((e, n) => {
                    isTrue(t) && isTrue(removeHtml(D(n).html())) && D(n).click(), isFalse(t) && isFalse(removeHtml(D(n).html())) && D(n).click();
                })), !1;
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u6536\u5f55",
        match: () => location.href.includes("/hw/student/studentViewHomework.action") && location.host.includes("teach.ynou.edu.cn"),
        question: {
            html: ".e_juan02biaoti",
            question: ".qcontent > p:first",
            options: ".signDefault>.label",
            type: ".question-box .tag",
            workType: "ynou",
            pageType: "ynou"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".e_juan02biaoti").length;
            })), D("body").css("text-align", "left");
        },
        answerHook: e => {
            e.options = [];
            const t = D(e.html).find(".e_juan02daan").clone();
            t.find(".clear").nextAll().remove();
            const n = removeHtml(t.html()), a = n.split(/[A][\u3001\.\uff0e]/)[0].trim();
            if (null === a) return null;
            e.question = a;
            const s = n.match(/(?:[A-G](?:[\u3001.]|\s)?\s?.*?)(?=\s*[A-G](?:[\u3001.]|\s)?|\s*$)/gs);
            if (null !== s) {
                const t = removeOptionsStartChar(s.map((e => e.trim())));
                if (0 == t) return null;
                e.options = t;
            }
            const o = D(e.html).find(".signDefault").attr("answer_control");
            "radio" === o && e.options.length > 1 && (e.type = "0"), "checkbox" === o && e.options.length > 1 && (e.type = "1"), 
            "radio" === o && 0 === e.options.length && (e.type = "3");
            const i = D(e.html).find(".right_answer>font").text();
            switch (e.type) {
              case "0":
              case "1":
                e.answer = i.split("").map((t => e.options[t.charCodeAt(0) - 65]));
                break;
 
              case "3":
                e.answer = isTrue(i) ? "\u6b63\u786e" : isFalse(i) ? "\u9519\u8bef" : "";
            }
            return e;
        }
    } ], et = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("21tb.com"),
        main: e => {
            const getHash = () => D("#examIngEmsRightPanel").attr("class");
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                se.mainClass !== getHash() && (se.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            D("#examIngEmsRightPanel").length >= 1 && t.observe(D("#examIngEmsRightPanel")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "21tb\u7b54\u9898",
        tips: "21tb\u5e73\u53f0\u7b54\u9898\uff0c\u76ee\u524d\u4ec5\u652f\u6301\u9009\u62e9\u3001\u5224\u65ad\u9898",
        match: () => location.host.includes("21tb.com") && location.href.includes("exercise/newExercise.fullExerciseTemp.do"),
        question: {
            html: ".paper-content > .question-panel-middle",
            question: ".question-stem>.name",
            options: "ul.question-options>li>label",
            type: ".question-box .tag",
            workType: "21tb",
            pageType: "21tb"
        },
        init: async () => {
            if (D(".view-paper-content").length > 0) return !1;
        },
        next: () => {},
        ischecked: e => e.parent().find("input").prop("checked"),
        questionHook: e => {
            e.question = titleClean(e.question), e.question = e.question.replace(/\uff08\d+\u5206\uff09$/, "").trim(), 
            e.options = e.options.map((e => e.replace(/^[A-Z]\s*\.\s*/, ""))), e.options = removeStartChar(e.options);
            const t = D(e.html).attr("class") || "";
            switch (console.log(t), !0) {
              case t.includes("SINGLE"):
                e.type = "0";
                break;
 
              case t.includes("MULTIPLE"):
                e.type = "1";
                break;
 
              case t.includes("JUDGMENT"):
                e.type = "3", e.options = [];
            }
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "21tb\u6536\u5f55",
        match: () => location.host.includes("21tb.com") && location.href.includes("exercise/newExercise.fullExerciseTemp.do"),
        question: {
            html: "form > .question-panel-middle",
            question: ".question-stem>.name",
            options: "ul.question-options>li>label",
            type: ".question-box .tag",
            workType: "21tb",
            pageType: "21tb"
        },
        init: async () => {
            if (console.log(D(".view-paper-content").length), 0 == D(".view-paper-content").length) return !1;
        },
        answerHook: e => {
            e.question = titleClean(e.question), e.question = e.question.replace(/\uff08\d+\u5206\uff09$/, "").trim(), 
            e.options = e.options.map((e => e.replace(/^[A-Z]\s*\.\s*/, ""))), e.options = removeStartChar(e.options);
            const t = D(e.html).attr("questtype") || "", n = D(e.html).find(".true-answer").text().split("\uff1a")[1].trim();
            switch (!0) {
              case t.includes("SINGLE"):
                e.type = "0", e.answer = n.split(", ").map((t => e.options[t.charCodeAt(0) - 65]));
                break;
 
              case t.includes("MULTIPLE"):
                e.type = "1", e.answer = n.split(", ").map((t => e.options[t.charCodeAt(0) - 65]));
                break;
 
              case t.includes("JUDGMENT"):
                e.type = "3", e.options = [], e.answer = judgeAnswer(n);
            }
            return console.log(e), e;
        }
    }, {
        type: "ask",
        name: "21tb\u8003\u8bd5\u7b54\u9898",
        tips: "21tb\u5e73\u53f0\u7b54\u9898\uff0c\u76ee\u524d\u4ec5\u652f\u6301\u9009\u62e9\u3001\u5224\u65ad\u9898",
        match: () => location.host.includes("21tb.com") && location.href.includes("ems/html/examCenter/fullExamTemp.do"),
        question: {
            html: ".paper-content > .question-panel-middle",
            question: ".question-stem",
            options: "ul.question-options>li>label",
            type: ".question-box .tag",
            workType: "21tb",
            pageType: "21tb"
        },
        init: async () => {
            if (D(".view-paper-content").length > 0) return !1;
        },
        next: () => {},
        ischecked: e => e.parent().find("input").prop("checked"),
        questionHook: e => {
            const t = D(e.html).find(".question-stem").clone();
            t.find(".num").remove(), e.question = titleClean(removeHtml(t.html())).replace(/^\./, ""), 
            e.question = e.question.replace(/\uff08\d+\u5206\uff09$/, "").trim(), e.options = e.options.map((e => e.replace(/^[A-Z]\s*\.\s*/, ""))), 
            e.options = removeStartChar(e.options);
            const n = D(e.html).attr("class") || "";
            switch (console.log(n), !0) {
              case n.includes("SINGLE"):
                e.type = "0";
                break;
 
              case n.includes("MULTIPLE"):
                e.type = "1";
                break;
 
              case n.includes("JUDGMENT"):
                e.type = "3", e.options = [];
            }
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    } ], tt = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("168wangxiao.com"),
        main: e => {
            const getHash = () => (D(".question-submit-btn").text(), D(".question-submit-btn").text() || D(".listTit>span").text());
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                se.mainClass !== getHash() && (se.mainClass = getHash(), "homework-detail-container" === se.mainClass && await waitUntil((function() {
                    return 0 === D(".el-loading-mask").length;
                })), vuePageChange$1(), t.disconnect());
            }));
            D("#app").length >= 1 && (D("#app")[0], t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            }));
        }
    }, {
        type: "ask",
        name: "168\u7f51\u6821\u7b54\u9898",
        tips: "168\u7f51\u6821\u76ee\u524d\u652f\u6301\u9009\u62e9\u3001\u5224\u65ad\u3001\u586b\u7a7a\u3001\u7b80\u7b54\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.host.includes("168wangxiao.com") && location.href.includes("/web/learningCenter/details/"),
        question: {
            html: ".question-item-container",
            question: ".title-content",
            options: ".options .opt-content",
            type: ".type",
            workType: "168wx",
            pageType: "168wx"
        },
        init: async () => (await waitUntil((function() {
            return 0 !== D(".question-item-container").length;
        })), !D(".question-submit-btn").text().includes("\u91cd\u65b0\u7b54\u9898")),
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            const t = D(e.html).find(".type").text();
            return e.type = typeMatch(t), e;
        },
        setAnswer: e => "4" !== e.type || (D(e.html).find(".ql-editor"), D(e.html).find(".ql-editor")[0].innerHTML = e.answer[0], 
        !1),
        finish: e => {}
    }, {
        type: "save",
        name: "168\u7f51\u6821\u7b54\u9898",
        match: () => location.host.includes("168wangxiao.com") && location.href.includes("/web/learningCenter/details/"),
        question: {
            html: ".question-item-container",
            question: ".title-content",
            options: ".options .opt-content",
            type: ".type",
            workType: "168wx",
            pageType: "168wx"
        },
        init: async () => (await waitUntil((function() {
            return 0 !== D(".question-item-container").length;
        })), D(".question-submit-btn").text().includes("\u91cd\u65b0\u7b54\u9898")),
        answerHook: e => {
            const t = D(e.html).find(".type").text();
            switch (e.type = typeMatch(t), e.answer = D(e.html).find(".options .opt-content.is-correct-answer").map(((e, t) => removeHtml(D(t).html()))).get(), 
            e.type) {
              case "2":
                e.options = [], e.answer = D(e.html).find(".analyze-container>.answer>.text-container>p").map(((e, t) => removeHtml(D(t).html()))).get();
                break;
 
              case "3":
                e.options = [], e.answer = [ judgeAnswer(e.answer[0]) ];
                break;
 
              case "4":
                e.options = [], e.answer = D(e.html).find(".analyze-container>.answer>.text-container").map(((e, t) => removeHtml(D(t).html()))).get();
            }
            return e;
        }
    }, {
        type: "ask",
        name: "168\u7f51\u6821\u8003\u8bd5",
        tips: "168\u7f51\u6821\u76ee\u524d\u652f\u6301\u9009\u62e9\u3001\u5224\u65ad\u3001\u586b\u7a7a\u3001\u7b80\u7b54\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.host.includes("168wangxiao.com") && location.href.includes("/web/examination/answer"),
        question: {
            html: ".Answer-area",
            question: ".listTit>span",
            options: ".el-checkbox-group>label",
            type: ".type",
            workType: "168wx",
            pageType: "168wx"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== D(".Answer-area").length;
            }));
        },
        next: () => {
            D('button:contains("\u4e0b\u4e00\u9898")').click();
        },
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => (e.options = removeOptionsStartChar(e.options), e.type = typeMatch(D(".tit-type").text()), 
        e),
        setAnswer: e => "4" !== e.type || (D(e.html).find(".ql-editor"), D(e.html).find(".ql-editor")[0].innerHTML = e.answer[0], 
        !1),
        finish: e => {}
    } ], nt = [ {
        type: "ask",
        name: "\u9ea6\u80fd\u7f51\u7b54\u9898",
        tips: "\u9ea6\u80fd\u7f51\u7b54\u9898\u4ec5\u652f\u6301\u9009\u62e9\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.host.includes("mynep.com") && location.href.includes("my-exam/exambegin"),
        question: {
            html: ".et_test",
            question: ".et_title",
            options: "ul>.et_answer>label",
            type: ".question-box .tag",
            workType: "mynep",
            pageType: "mynep"
        },
        init: async () => {},
        toquestion: e => {
            se.select_num(e + 1);
        },
        next: () => {},
        ischecked: e => e.parent().find("input").prop("checked"),
        questionHook: e => {
            e.question = e.question.replace(/\u7b2c\d+\u9898\uff1a/, ""), e.options = removeStartChar(e.options);
            switch (D(e.html).find('input[id^="question-num-isdone"]').attr("question_num_type_id")) {
              case "1":
                e.type = "0";
                break;
 
              case "2":
                e.type = "1";
            }
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u6536\u5f55",
        match: () => location.host.includes("mynep.com") && location.href.includes("web/my-exam/examshow"),
        question: {
            html: ".et_test",
            question: ".et_title",
            options: "ul>.et_answer>label",
            type: ".question-box .tag",
            workType: "mynep",
            pageType: "mynep"
        },
        init: async () => {},
        answerHook: e => {
            const t = D(e.html).find(".et_title").clone();
            t.find(".exam-btn").remove(), t.find("div").remove(), e.question = removeHtml(t.html()).replace(/\u7b2c\d+\u9898\uff1a/, "").trim(), 
            e.options = [];
            const n = [];
            D(e.html).find(".et_answer>.et_answer>.et_answer>label").map(((t, a) => {
                e.options.push(removeHtml(D(a).html()).trim()), D(a).parent().find("input").prop("checked") && n.push(t);
            })).get(), e.options = removeStartChar(e.options), e.answer = n.map((t => e.options[t]));
            switch (D(e.html).find('input[id^="question-num-isdone"]').attr("question_num_type_id")) {
              case "1":
                e.type = "0";
                break;
 
              case "2":
                e.type = "1";
                break;
 
              default:
                return !1;
            }
            return e;
        }
    } ], at = [ {
        type: "ask",
        name: "\u4e91\u73ed\u8bfe\u7b54\u9898",
        tips: "\u4e91\u73ed\u8bfe\u4ec5\u652f\u6301\u9009\u62e9\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => "www.mosoteach.cn" === location.host && location.href.includes("/web/index.php?c=interaction_quiz&m=reply"),
        question: {
            html: ".topic-item",
            question: ".t-subject",
            options: ".t-option.t-item label",
            type: ".t-type",
            workType: "mosoteach",
            pageType: "mosoteach"
        },
        init: async () => {
            await waitUntil((function() {
                var e;
                return 0 !== (null == (e = D("#app")[0]) ? void 0 : e.__vue__.$data.topics.length);
            }));
        },
        next: () => {},
        ischecked: e => e.hasClass("is-checked"),
        questionHook: (e, t) => {
            const n = D("#app")[0].__vue__.$data.topics[t];
            e.question = titleClean(removeHtml(n.subject));
            const a = n.options;
            switch (a.sort(((e, t) => e.item_no - t.item_no)), e.options = a.map((e => removeHtml(e.content))), 
            n.type) {
              case "SINGLE":
                e.type = "0";
                break;
 
              case "MULTI":
                e.type = "1";
            }
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u6536\u5f55",
        match: () => "www.mosoteach.cn" === location.host && location.href.includes("/web/index.php?c=interaction_quiz&m=person_quiz_result"),
        question: {
            html: ".topic-list > .topic-item",
            question: ".topic-title",
            options: ".el-radio-group label .label,.el-checkbox-group label .label",
            type: ".question-box .tag",
            workType: "mosoteach",
            pageType: "mosoteach"
        },
        init: async () => {
            await waitUntil((function() {
                var e;
                return 0 !== (null == (e = D("#app")[0]) ? void 0 : e.__vue__.$data.topics.length);
            }));
        },
        answerHook: (e, t) => {
            const n = D("#app")[0].__vue__.$data.topics[t];
            e.question = titleClean(removeHtml(n.subject));
            const a = n.options;
            switch (a.sort(((e, t) => e.item_no - t.item_no)), e.options = a.map((e => removeHtml(e.content))), 
            e.answer = n.answers.map((t => e.options[t])), n.type) {
              case "SINGLE":
                e.type = "0";
                break;
 
              case "MULTI":
                e.type = "1";
                break;
 
              default:
                return null;
            }
            return e;
        }
    } ], st = [ {
        type: "hook",
        name: "hook",
        match: "www.learnin.com.cn" === location.host,
        main: e => {
            const getHash = () => {
                try {
                    return D(".page-student-course-topic-do-container")[0].__vue__.$data.topic.studentTopic.id;
                } catch (e) {
                    return "";
                }
            };
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                se.mainClass !== getHash() && (se.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "save",
        name: "learnin\u6536\u5f55",
        match: () => "www.learnin.com.cn" === location.host && location.href.includes("/user/#/user/student/course/") && 0 == D("button:contains('\u63d0\u4ea4\u4f5c\u4e1a')").length,
        question: {
            html: ".store-question-item-container",
            question: ".question-title",
            options: ".question-info>.question-option-list>.option-item",
            type: ".item-question-header>.header-left",
            workType: "learnin",
            pageType: "learnin"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".store-question-item-container");
            }));
        },
        answerHook: (e, t) => {
            const n = D(".page-student-course-topic-do-container")[0].__vue__.$data.topic.topicItems[0].childList, a = n[t];
            switch (n[t], a.questionTypeCode) {
              case "judgment":
                e.type = "3";
                break;
 
              case "single":
                e.type = "0";
                break;
 
              case "multiple":
                e.type = "1";
                break;
 
              default:
                return e;
            }
            e.question = titleClean(removeHtml(a.questionTitle));
            let s = [], o = [];
            return a.optionList.forEach((e => {
                const t = removeHtml(e.content);
                e.isAnswer && o.push(t), s.push(t);
            })), e.options = s, e.answer = o, "3" == e.type && (e.options = [], e.answer = judgeAnswer(o[0])), 
            e;
        }
    }, {
        type: "ask",
        name: "learnin\u7b54\u9898",
        tips: "learnin\u4ec5\u652f\u6301\u9009\u62e9\u5224\u65ad\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => "www.learnin.com.cn" === location.host && location.href.includes("/user/#/user/student/course/") && 1 == D("button:contains('\u63d0\u4ea4\u4f5c\u4e1a')").length,
        question: {
            html: ".store-question-item-container",
            question: ".question-title",
            options: ".question-info>.question-option-list>.option-item>.option-index",
            type: ".item-question-header>.header-left",
            workType: "learnin",
            pageType: "learnin"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".store-question-item-container");
            }));
        },
        next: () => {},
        ischecked: e => e.hasClass("active"),
        questionHook: (e, t) => {
            const n = D(".page-student-course-topic-do-container")[0].__vue__.$data.topic.topicItems[0].childList, a = n[t];
            switch (n[t], a.questionTypeCode) {
              case "judgment":
                e.type = "3";
                break;
 
              case "single":
                e.type = "0";
                break;
 
              case "multiple":
                e.type = "1";
                break;
 
              default:
                return e;
            }
            e.question = titleClean(removeHtml(a.questionTitle));
            let s = [];
            return a.optionList.forEach((e => {
                const t = removeHtml(e.content);
                s.push(t);
            })), e.options = s, "3" == e.type && (e.options = []), e;
        },
        setAnswer: e => !0,
        finish: e => {}
    } ], ot = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("ouchn.edu.cn"),
        main: e => {
            const getHash = () => getUrl();
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                se.mainClass !== getHash() && (se.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u7535\u5927\u7b54\u9898",
        tips: "\u7535\u5927\u76ee\u524d\u4ec5\u652f\u6301\u5355\u9009\u9898\uff0c\u5176\u4ed6\u9898\u578b\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.host.includes("ouchn.edu.cn") && location.href.includes("learningPlatform/#/myExamDetails/examQuestion"),
        question: {
            html: ".everyQuest",
            question: ".topicTitle",
            options: ".optionList .topicTitle",
            type: ".question-box .tag",
            workType: "ouchn",
            pageType: "ouchn"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".everyQuest");
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => (e.type = "0", e),
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u7535\u5927\u6536\u5f55",
        match: () => location.host.includes("ouchn.edu.cn") && location.href.includes("learningPlatform/#/myExamDetails/testPaper"),
        question: {
            html: ".everyQuest",
            question: ".topicTitle",
            options: ".optionList .topicTitle",
            type: ".question-box .tag",
            workType: "ouchn",
            pageType: "ouchn"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".everyQuest");
            }));
        },
        answerHook: e => {
            const t = D(e.html).find('.rightAndWrong>span:contains("\u6b63\u786e\u7b54\u6848")').text().replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim(), n = e.options;
            let a = [];
            return t.split("").forEach((e => {
                a.push(n[e.charCodeAt(0) - 65]);
            })), 1 == a.length ? e.type = "0" : e.type = "1", e.answer = a, e;
        }
    } ], it = [ {
        type: "hook",
        name: "mooc",
        match: "www.icourse163.org" === location.host,
        main: e => {
            se.mainClass = D("#courseLearn-inner-box > div:eq(0)").attr("class");
            let t = new MutationObserver((async e => {
                se.mainClass !== D("#courseLearn-inner-box > div:eq(0)").attr("class") && (se.mainClass = D("#courseLearn-inner-box > div:eq(0)").attr("class"), 
                "homework-detail-container" === se.mainClass && await waitUntil((function() {
                    return 0 === D(".el-loading-mask").length;
                })), vuePageChange$1(), t.disconnect());
            }));
            D("#courseLearn-inner-box").length >= 1 && t.observe(D("#courseLearn-inner-box")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "mooc\u7b54\u9898",
        tips: "\u4e2d\u56fd\u5927\u5b66MOOC\u9650\u5236\u7b54\u9898\u901f\u5ea6\uff0c\u8bf7\u4e0d\u8981\u8fc7\u5feb",
        match: () => "www.icourse163.org" === location.host && location.href.includes("#/learn/quiz?id="),
        question: {
            html: ".u-questionItem",
            question: ".f-richEditorText",
            options: "ul.choices>li>input",
            type: ".qaCate.j-qacate.f-fl",
            workType: "mooc",
            pageType: "mooc"
        },
        init: async () => {
            await waitUntil((function() {
                return D(".u-questionItem").length, 0 !== D(".u-questionItem").length;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: (e, t) => {
            D(e.html).find(".qaCate.j-qacate.f-fl > span:eq(0)").attr("class");
            const n = se.learnUtilQuestionList[t];
            switch (e.question = removeHtml(n.title), e.options = n.options.map((e => removeHtml(e.content))), 
            n.type) {
              case 1:
                e.type = "0";
                break;
 
              case 2:
                e.type = "1";
                break;
 
              case 3:
                e.type = "2";
                break;
 
              case 4:
                e.type = "3", e.options = [];
                break;
 
              default:
                n.type, e.type = "8";
            }
            return e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "2":
                return D(e.html).find(".u-baseinputui>textarea").each(((t, n) => {
                    D(n).val(e.answer[t]), D(n).focus(), D(n).blur();
                })), !1;
 
              case "3":
                let t = e.answer;
                D(e.html).find("ul.choices>li").each(((e, n) => {
                    isTrue(t) && D(n).find(".u-icon-correct").length > 0 && D(n).find("input").click(), 
                    isFalse(t) && D(n).find(".u-icon-wrong").length > 0 && D(n).find("input").click();
                }));
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u4e2d\u56fd\u5927\u5b66mooc\u6536\u5f55",
        match: () => "www.icourse163.org" === location.host && location.href.includes("#/learn/quizscore?id="),
        question: {
            html: ".u-questionItem",
            question: ".f-richEditorText",
            options: "ul.choices li>input",
            type: ".qaCate.j-qacate.f-fl",
            workType: "mooc",
            pageType: "mooc"
        },
        init: async () => {
            await waitUntil((function() {
                return D(".u-questionItem").length, 0 !== D(".u-questionItem").length;
            }));
        },
        answerHook: (e, t) => {
            const n = se.learnUtilQuestionList[t];
            e.question = removeHtml(n.title);
            let a = [], s = [];
            switch (n.options.forEach((e => {
                a.push(removeHtml(e.content)), e.answer && s.push(removeHtml(e.content));
            })), e.options = a, e.answer = s, n.type) {
              case 1:
                e.type = "0";
                break;
 
              case 2:
                e.type = "1";
                break;
 
              case 3:
                e.type = "2", e.answer = [ n.stdAnswer ];
                break;
 
              case 4:
                e.type = "3", e.options = [];
                break;
 
              default:
                n.type;
            }
            return e;
        }
    } ], rt = [ {
        type: "ask",
        name: "\u7b54\u9898",
        tips: "\u516c\u544a",
        match: () => (location.host.includes("swufe-online.com") || location.host.includes("webtrn.cn")) && (location.href.includes("learnspace/course/test/coursewareTest_intoRedoTestPage.action") || location.href.includes("learnspace/learn/learn/templateeight/index.action")),
        question: {
            html: ".bank_test > .test_item",
            question: ".test_item_tit",
            options: ".test_item_theme>ul>li>label, .test_item_theme>label",
            type: ".question-box .tag",
            workType: "swufe",
            pageType: "swufe"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".bank_test > .test_item");
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            const t = D(e.html).find(".test_item_tit").clone();
            if (t.find(".tipNodo").remove(), e.question = removeHtml(t.html()), e.question = titleClean(e.question), 
            e.type = typeMatch(D(e.html).prevAll(".test_item_type").first().text()), e.question = e.question.replace(/^[.*?]\s*/, "").replace(/^\u3010.*?\u3011\s*/, "").replace(/\s*\uff08\d+\.\d+\u5206\uff09$/, "").replace(/^\d+\./, "").trim().replace(/^\d+\uff0e/, "").trim().replace(/^\d+ ./, "").trim(), 
            e.options = removeStartChar(e.options), "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u897f\u8d22\u5728\u7ebf\u9636\u6bb5\u6d4b\u9a8c\u6536\u5f55",
        match: () => (location.host.includes("swufe-online.com") || location.host.includes("webtrn.cn")) && (location.href.includes("learnspace/course/test/coursewareTest_intoTestAnswerPage.action") || location.href.includes("learnspace/learn/learn/templateeight/index.action")),
        question: {
            html: ".bank_test > .test_item",
            question: ".test_item_tit",
            options: ".test_item_theme>ul>li>.zdh_op_con",
            type: ".question-box .tag",
            workType: "swufe",
            pageType: "swufe"
        },
        init: async () => {},
        answerHook: e => {
            e.type = typeMatch(D(e.html).prevAll(".test_item_type").first().text()), e.question = e.question.replace(/^[.*?]\s*/, "").replace(/^\u3010.*?\u3011\s*/, "").replace(/\s*\uff08\d+\.\d+\u5206\uff09$/, "").replace(/^\d+\./, "").trim().replace(/^\d+\uff0e/, "").trim().replace(/^\d+ ./, "").trim(), 
            e.options = removeStartChar(e.options);
            const t = D(e.html).find(".test_item_key_tit").text().replace("\u53c2\u8003\u7b54\u6848\uff1a", "").trim();
            switch (e.type) {
              case "0":
              case "1":
                e.answer = t.split("").map((t => {
                    let n = t.charCodeAt() - 65;
                    return e.options[n];
                }));
                break;
 
              case "3":
                e.answer = judgeAnswer(t), e.options = [];
            }
            return e;
        }
    }, {
        type: "ask",
        name: "\u897f\u8d22\u5728\u7ebf\u7efc\u5408\u7ec3\u4e60\u7b54\u9898",
        tips: "\u897f\u8d22\u5728\u7ebf\u6536\u5f55\u8bf7\u91cd\u65b0\u70b9\u51fb\u9898\u578b\u5207\u6362\u89e6\u53d1",
        match: () => location.host.includes("swufe-online.com") && location.href.includes("/learnspace/userDefine/t_test.jsp?courseId="),
        question: {
            html: ".timu_title",
            question: ".timu_title",
            options: ".test_item_theme>ul>li",
            type: ".question-box .tag",
            workType: "swufe",
            pageType: "swufe"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".timu_title");
            })), !document.body.innerHTML.includes("\u63d0\u4ea4\u7b54\u9898\u540e\u663e\u793a")) return !1;
            D(".layui-tab-title>li").on("click", (function() {
                vuePageChange$1();
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: (e, t) => {
            const n = D(e.html).attr("id");
            return e.type = typeMatch(D(".layui-this").text()), e.question = removeHtml(D(e.html).html()), 
            e.options = D(`#${n}`).map((function() {
                let t = [], n = D(this).next(), a = [];
                for (;n.length && n.hasClass("question-item-opt"); ) a.push(removeHtml(n[0].outerHTML)), 
                t.push(n), n = n.next();
                return e.$options = D(t.map((e => e[0]))).find("label"), a;
            })).get(), e.options = removeStartChar(e.options), e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u897f\u8d22\u5728\u7ebf\u7efc\u5408\u4f5c\u4e1a\u6536\u5f55",
        match: () => location.host.includes("swufe-online.com") && location.href.includes("/learnspace/userDefine/t_test.jsp?courseId="),
        question: {
            html: ".timu_title",
            question: ".timu_title",
            options: ".test_item_theme>ul>li",
            type: ".question-box .tag",
            workType: "swufe",
            pageType: "swufe"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".timu_title");
            })), document.body.innerHTML.includes("\u63d0\u4ea4\u7b54\u9898\u540e\u663e\u793a")) return !1;
            D(".layui-tab-title>li").on("click", (function() {
                vuePageChange$1();
            }));
        },
        answerHook: e => {
            const t = D(e.html).attr("id");
            switch (e.type = typeMatch(D(".layui-this").text()), e.question = removeHtml(D(e.html).html()), 
            e.options = D(`#${t}`).map((function() {
                let t = [], n = D(this).next(), a = [];
                for (;n.length && n.hasClass("question-item-opt"); ) a.push(removeHtml(n[0].outerHTML)), 
                t.push(n), n = n.next();
                return e.$options = D(t.map((e => e[0]))).find("label"), a;
            })).get(), e.options = removeStartChar(e.options), e.type) {
              case "0":
              case "1":
                const n = D(`#${t}`).nextAll(".ans").first().find("span:eq(0)").text();
                e.answer = n.trim().split("").map((t => {
                    let n = t.charCodeAt() - 65;
                    return e.options[n];
                }));
                break;
 
              case "3":
                e.answer = judgeAnswer(D(`#${t}`).nextAll(".ans").first().find("span:eq(0)").text().trim()), 
                e.options = [];
                break;
 
              case "7":
              case "4":
                e.answer = removeHtml(D(`#${t}`).nextAll(".ans").first().html()).replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim(), 
                e.options = [];
                break;
 
              default:
                e.type;
            }
            return e;
        }
    } ], lt = [ {
        type: "ask",
        name: "\u91cd\u5e86\u6cd5\u6cbb\u8003\u8bd5\u7b54\u9898",
        tips: "\u672c\u5e73\u53f0\u65e0\u7b54\u6848\u6536\u5f55\uff0c\u9700\u8981\u81ea\u884c\u8865\u5145\u9898\u5e93\uff0c\u5efa\u8bae\u4f7f\u7528\u9898\u5e93\u5bfc\u5165\u529f\u80fd",
        match: () => "ks.cqsdx.cn" === location.host && location.pathname.includes("/exam/user/bind"),
        question: {
            html: ".qlist",
            question: "span:eq(1)",
            options: "label",
            type: ".badge.badge-danger",
            workType: "cqsdx",
            pageType: "cqsdx"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".qlist");
            }));
        },
        toquestion: e => {
            D(`#question_card button:eq(${e})`).click();
        },
        next: () => {},
        ischecked: e => e.find("div").hasClass("checked"),
        questionHook: e => {
            const t = D(e.html).find(".badge.badge-danger").text();
            if (e.type = typeMatch(t), e.question = e.question.replace(/\u206B/g, "").trim(), 
            e.options = e.options.map((e => e.replace(/\u206B/g, "").trim())), "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    } ], ct = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("telfri-edu.com"),
        main: e => {
            const getHash = () => getUrl();
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                se.mainClass !== getHash() && (se.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u7b54\u9898",
        tips: "\u516c\u544a",
        match: () => location.host.includes("telfri-edu.com") && location.href.includes("/learn/homework/do/"),
        question: {
            html: ".topic-group>.topic-container",
            question: ".topic-title",
            options: ".topic-answer .radio-wrap .radio-text",
            type: ".question-box .tag",
            workType: "olearn",
            pageType: "olearn"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".topic-group>.topic-container");
            }));
        },
        next: () => {},
        ischecked: e => e.hasClass("is-active"),
        questionHook: e => {
            let t = D(e.html).prevAll(".topic-title").first().find(".title-bold").text().trim();
            return e.$options = D(e.html).find(".topic-answer .radio-wrap .el-radio-button"), 
            e.type = typeMatch(t), e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u6536\u5f55",
        match: () => location.host.includes("telfri-edu.com") && location.href.includes("/learn/homework/show/"),
        question: {
            html: ".topic-group>.topic-container",
            question: ".topic-title",
            options: ".topic-answer .radio-wrap .radio-text",
            type: ".question-box .tag",
            workType: "olearn",
            pageType: "olearn"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".topic-group>.topic-container");
            }));
        },
        answerHook: e => {
            let t = D(e.html).prevAll(".topic-title").first().find(".title-bold").text().trim();
            e.type = typeMatch(t);
            const n = D(e.html).find(".standard-answer>.analysis-text").text().trim();
            switch (e.type) {
              case "0":
              case "1":
                e.answer = n.split("").map((t => e.options[t.charCodeAt(0) - 65]));
            }
            return e;
        }
    } ], ut = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("yxbyun.com"),
        main: e => {
            const getHash = () => D("#app")[0].__vue__.$route.path;
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                se.mainClass !== getHash() && (se.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "save",
        name: "\u4ebf\u5b66\u5b9d\u6536\u5f55",
        match: () => location.host.includes("yxbyun.com") && (location.href.includes("yxbstudent/#/testPaper") || location.href.includes("yxbstudent/#/finalExam")),
        question: {
            html: ".test_wrap",
            question: ".content",
            options: ".el-radio-group input",
            type: ".question-box .tag",
            workType: "yxbyun",
            pageType: "yxbyun"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".test_wrap");
            }));
        },
        answerHook: e => {
            var t;
            const n = D(e.html).find("div:eq(0)")[0].__vue__, a = (null == (t = n.pagerData) ? void 0 : t.question) || n.smallPaper.questionTopic;
            return e.type = typeMatch(n.queTypeName), e.question = titleClean(removeHtml(a.questionTitle)), 
            e.options = (a.optionList || a.questionOptionList).map((e => removeHtml(e.questionContent))), 
            [ "0", "1", "3" ].includes(e.type) && (e.answer = a.questionAnswer.split(",").map((t => e.options[t.charCodeAt(0) - 65]))), 
            "3" === e.type && (e.options = [], e.answer = judgeAnswer(e.answer)), e;
        }
    }, {
        type: "ask",
        name: "\u7b54\u9898",
        match: () => location.host.includes("yxbyun.com") && (location.href.includes("yxbstudent/#/testPaper") || location.href.includes("yxbstudent/#/finalExam")),
        question: {
            html: ".test_wrap",
            question: ".content",
            options: ".answer>.daan,.el-radio-group>label",
            type: ".question-box .tag",
            workType: "yxbyun",
            pageType: "yxbyun"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".test_wrap");
            }));
        },
        next: () => {},
        ischecked: e => e.hasClass("active"),
        questionHook: e => {
            var t;
            const n = D(e.html).find("div:eq(0)")[0].__vue__, a = (null == (t = n.pagerData) ? void 0 : t.question) || n.smallPaper.questionTopic;
            if (e.type = typeMatch(n.queTypeName), e.question = titleClean(removeHtml(a.questionTitle)), 
            e.options = (a.optionList || a.questionOptionList).map((e => removeHtml(e.questionContent))), 
            "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => {
            if ("3" === e.type) {
                let t = e.answer;
                return e.ques.$options.each(((e, n) => {
                    isTrue(t) && isTrue(removeHtml(D(n).parent().html())) && D(n).click(), isFalse(t) && isFalse(removeHtml(D(n).parent().html())) && D(n).click(), 
                    removeHtml(D(n).parent().html());
                })), !1;
            }
            return !0;
        },
        finish: e => {}
    } ], pt = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("wdjycj.com"),
        main: e => {
            const getHash = () => getUrl();
            se.mainClass = getHash();
            let t = new MutationObserver((async e => {
                se.mainClass !== getHash() && (se.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            D("#app").length >= 1 && t.observe(D("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u7b54\u9898",
        tips: "\u516c\u544a",
        match: () => location.host.includes("wdjycj.com") && (location.href.includes("/testpaper-test?id=") || location.href.includes("/final-exam")),
        question: {
            html: ".st-item",
            question: ".st-title",
            options: ".st-main>p",
            type: ".question-box .tag",
            workType: "wdjycj",
            pageType: "wdjycj"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".st-item");
            }));
        },
        next: () => {},
        toquestion: e => {
            D(`.card-box .bj:eq(${e})`).click();
        },
        ischecked: e => D(e).find("input").prop("checked"),
        questionHook: e => {
            e.options = removeOptionsStartChar(e.options);
            const t = D(e.html).find(".st-title").clone();
            D(t).find("strong").remove(), e.question = removeHtml(D(t).html());
            let n = D(e.html).prevAll(".title").first().text().trim();
            return e.type = typeMatch(n), e.$options = D(e.html).find(".answer-box>.answer>label"), 
            e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "4":
              case "5":
              case "6":
              case "7":
                return D(e.html).find(".quill-editor").map(((t, n) => {
                    n.__vue__.value = e.answer[t];
                })), !1;
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u6536\u5f55",
        match: () => location.host.includes("wdjycj.com") && location.href.includes("/testpaper-test-result?resultId="),
        question: {
            html: ".st-item",
            question: ".st-title",
            options: ".st-main>p",
            type: ".question-box .tag",
            workType: "wdjycj",
            pageType: "wdjycj"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".st-item");
            }));
        },
        answerHook: e => {
            e.options = removeOptionsStartChar(e.options);
            const t = D(e.html).find(".st-title").clone();
            D(t).find("strong").remove(), e.question = removeHtml(D(t).html());
            let n = D(e.html).prevAll(".title").first().text().trim();
            e.type = typeMatch(n);
            let a = removeHtml(D(e.html).find(".answer").html()).match(/\u3010\u53c2\u8003\u7b54\u6848\u3011\uff1a([\s\S]*)\u3010\u662f\u5426\u6b63\u786e\u3011\uff1a/);
            if (a) switch (e.type) {
              case "0":
              case "1":
                e.answer = a[1].trim().split("").map((t => e.options[t.charCodeAt(0) - 65]));
                break;
 
              case "4":
              case "5":
              case "6":
              case "7":
                e.answer = [ a[1].trim() ];
            }
            return e;
        }
    } ], ht = Object.freeze(Object.defineProperty({
        __proto__: null,
        a21tb: et,
        ahjxjy: Ie,
        chaoxing: Ce,
        chatglm: Se,
        chengjiaoyun: Ee,
        chutou: Re,
        cjedu: Me,
        cjnep: Ze,
        cloudwis: Ve,
        cnzx: $e,
        cqsdx: lt,
        gkks: Be,
        guokai: He,
        huayi: Ye,
        jijiaox: Qe,
        jsou: Fe,
        learnin: st,
        ls365: We,
        mooc: it,
        mosoteach: at,
        mynep: nt,
        olearn: ct,
        openha: Ge,
        ouchn: ot,
        qingshu: Pe,
        sclecb: Ne,
        swufe: rt,
        uooc: Oe,
        wdjycj: pt,
        wencai: Je,
        wx168: tt,
        xinwei: Ae,
        xueqi: ze,
        ykt: Le,
        ynou: Ke,
        ytccr: De,
        yunmuxueyuan: ve,
        yxbyun: ut,
        yxlearning: Xe,
        zhihuishu: Te,
        zhijiaoyun: je
    }, Symbol.toStringTag, {
        value: "Module"
    })), dt = [];
 
    for (const Xn in ht) dt.push(...ht[Xn]);
 
    const parseRule = async e => {
        await waitUntil((() => void 0 !== se[yt + "app"]));
        const t = e.filter((e => "function" == typeof e.match ? e.match() : e.match)), n = getAppStore(), a = {
            app: n,
            ask: getAskStore()
        };
        if (!t.length) return n.app.alert = "\u5f53\u524d\u6ca1\u6709\u4efb\u52a1", console.log("\u6ca1\u6709\u5339\u914d\u5230\u89c4\u5219", "error"), 
        void addLog("\u6ca1\u6709\u5339\u914d\u5230\u89c4\u5219", "error");
        for (const s of t) {
            if (console.log(`\u5339\u914d\u5230\u89c4\u5219\uff1a${s.name}`, "success"), addLog(`\u5339\u914d\u5230\u89c4\u5219\uff1a${s.name}`, "success"), 
            s.init) {
                let e = await s.init();
                if ("boolean" == typeof e && !1 === e) continue;
            }
            n.alert = `\u5f53\u524d\u4efb\u52a1:${s.name}`, "hook" === s.type && s.main(a), 
            "ask" === s.type && askParser(s, a), "save" === s.type && saveParser(s, a);
        }
    }, saveParser = (e, t) => {
        const n = t.app, a = t.ask;
        a.rule = e, e.tips && (a.tips = e.tips);
        const s = questionSaveParser(e.question, e.answerHook || null).filter((e => null != e && 0 !== e.answer.length && "" !== e.answer && "8" != e.type)).map((e => (e.question = titleClean(e.question), 
        e)));
        if (a.saveQuestionData = s, s.forEach((e => {
            0 !== e.answer.length && Answer.cacheAnswer(e);
        })), e.paper && "function" == typeof e.paper) try {
            e.paper(s);
        } catch (i) {
            addLog("\u6574\u5377\u7f13\u5b58\u5f02\u5e38", "error");
        }
        const o = {
            questionList: s,
            pageType: e.question.pageType
        };
        n.setPage("question"), s.length && Answer.syncQuestionList(o), n.app.alert = `\u9898\u5e93\u6536\u5f55\u5b8c\u6210\uff0c\u5171\u7f13\u5b58${s.length}\u9053\u9898\u76ee`, 
        msg(`\u9898\u5e93\u6536\u5f55\u5b8c\u6210\uff0c\u5171\u7f13\u5b58${s.length}\u9053\u9898\u76ee`, "success"), 
        e.next && e.next();
    }, askParser = (e, t) => {
        const n = t.app, a = t.ask;
        a.rule = e, e.tips && (a.tips = e.tips), n.app.showFloat = !n.app.hideFloat, n.setPage("ask"), 
        a.clearQuestion();
        questionParser(e.question, e.questionHook || null).map((e => (e.question = titleClean(e.question), 
        "3" == e.type && (e.options = []), e))).forEach((e => {
            a.addQuestion(e);
        })), a.autoAnswer && a.toggleStart();
    }, questionSaveParser = (e, t) => {
        "function" == typeof e.html && (e.html = e.html());
        return D(e.html).map(((n, a) => {
            const s = removeHtml(D(a).find(e.question).html()), o = D(a).find(e.options).map(((e, t) => removeHtml(D(t).html()))).get(), i = D(a).find(e.type).val(), r = D(a)[0];
            let l = {
                question: titleClean(s ?? ""),
                options: o,
                $options: D(a).find(e.options),
                $answer: D(a).find(e.answer),
                answer: [],
                type: i,
                html: r
            };
            try {
                t && (l = t(l, n));
            } catch (c) {
                console.log("\u6536\u5f55hook\u62a5\u9519", c);
            }
            return null == l || null == l ? null : {
                question: l.question,
                options: l.options,
                answer: l.answer,
                type: l.type,
                hash: questionHash(l.type, l.question, l.options)
            };
        })).get();
    }, questionParser = (e, t) => {
        "function" == typeof e.html && (e.html = e.html());
        return D(e.html).map(((n, a) => {
            const s = removeHtml(D(a).find(e.question).html()), o = D(a).find(e.options).map(((e, t) => removeHtml(D(t).html()))).get(), i = D(a).find(e.type).val(), r = e.workType, l = D(a)[0];
            let c = {
                question: titleClean(s ?? ""),
                options: o,
                $options: D(a).find(e.options),
                type: i,
                html: l,
                workType: r,
                pageType: e.pageType
            };
            return t && (c = t(c, n)), c;
        })).get();
    };
 
    function getAppStore() {
        return se[yt + "app"];
    }
 
    function getAskStore() {
        return se[yt + "ask"];
    }
 
    function request(e, t, n = void 0, a = void 0, s = 5e3) {
        "GET" === t && n && (e += `?${new URLSearchParams(n).toString()}`), "POST" === t && (a = {
            ...a
        });
        const o = {
            "User-Agent": se.navigator.userAgent,
            "Content-Type": "application/json",
            referer: location.href,
            ...a
        };
        return new Promise(((a, i) => {
            const r = Date.now();
            ae({
                method: t,
                url: e,
                headers: o,
                data: "GET" !== t ? JSON.stringify(n) : void 0,
                timeout: s,
                onload: function(e) {
                    const t = Date.now();
                    a([ e, t - r ]);
                },
                ontimeout: () => i(new Error("\u63a5\u53e3\u8bf7\u6c42\u8d85\u65f6")),
                onerror: e => {
                    i(e);
                }
            });
        }));
    }
 
    function requestApi(e, t, n = void 0, a = void 0, s = 5e3) {
        return new Promise((async (o, i) => {
            let r;
            {
                const e = function(e) {
                    const t = Object.keys(e).sort();
                    delete e.html;
                    const n = t.indexOf("html");
                    -1 !== n && t.splice(n, 1);
                    const a = t.map((t => {
                        let n = e[t];
                        return Array.isArray(n) && 0 === n.length || "object" == typeof n && 0 === Object.keys(n).length ? null : ((Array.isArray(n) || "object" == typeof n) && (n = JSON.stringify(n)), 
                        `${t}=${n}`);
                    })), s = a.filter((e => null !== e));
                    return we(s.join("&"));
                }(n);
                a = {
                    ...a,
                    aka: e
                }, r = await encrypt(JSON.stringify(n), e);
            }
            const l = {
                "User-Agent": se.navigator.userAgent,
                "Content-Type": "application/json",
                referer: location.href,
                v: gt.script.version,
                ...a
            }, c = Date.now();
            ae({
                method: t,
                url: e,
                headers: l,
                data: JSON.stringify({
                    data: r
                }),
                timeout: s,
                onload: function(e) {
                    const t = Date.now();
                    o([ e, t - c ]);
                },
                ontimeout: () => i(new Error("\u63a5\u53e3\u8bf7\u6c42\u8d85\u65f6")),
                onerror: e => {
                    i(e);
                }
            });
        }));
    }
 
    const vuePageChange$1 = async () => {
        if (se.vuePageChangeLock) return;
        se.vuePageChangeLock = !0;
        const e = getAppStore(), t = getAskStore();
        t.questionInx = 0, e.app.showFloat = !1, e.setPage("home"), t.clearQuestion(), await parseRule(dt), 
        se.vuePageChangeLock = !1;
    }, addLog = (e, t = "info") => {
        const n = getAppStore(), a = (new Date).toLocaleString();
        try {
            n.addLog({
                time: a,
                type: t,
                content: e
            });
        } catch (s) {
            console.log(e);
        }
    }, updateCheck1 = () => {
        const e = getAppStore();
        let t;
        try {
            t = e.script.updateURL.match(/scripts\/(\d+)/)[1];
        } catch {
            t = wt;
        }
        let n = `https://greasyfork.org/zh-CN/scripts/${t}.json`;
        return new Promise(((e, a) => {
            request(n, "GET", {}, {}).then((e => {
                (e = JSON.parse(e[0].responseText)).version > gt.script.version ? msg(`\u68c0\u6d4b\u5230\u65b0\u7248\u672c<span style="color:red">${e.version}</span>,\u8bf7\u53ca\u65f6\u66f4\u65b0<br>\u66f4\u65b0\u65f6\u95f4:${formatDate(e.code_updated_at)}<br><a target="_blank" href="https://greasyfork.org/zh-CN/scripts/${t}">>>\u70b9\u6211\u5feb\u6377\u8df3\u8f6c\u66f4\u65b0<<</a>`, "warning") : msg("\u5f53\u524d\u7248\u672c\u4e3a\u6700\u65b0\u7248\u672c", "success"), 
                Cache.set("lastCheckTime", (new Date).getTime());
            })).catch((t => {
                console.error("\u66f4\u65b0\u68c0\u6d4b\u5931\u8d25", t), e(null);
            }));
        }));
    }, ttfDownload1 = async e => new Promise((t => {
        ae({
            method: "GET",
            url: e,
            onload: function(e) {
                try {
                    const n = e.responseText, a = JSON.parse(n);
                    t(a);
                } catch (n) {
                    msg("\u5b57\u4f53\u6587\u4ef6\u4e0b\u8f7d\u5931\u8d25", "error"), t(null);
                }
            },
            onerror: function(e) {
                msg("\u5b57\u4f53\u6587\u4ef6\u4e0b\u8f7d\u5931\u8d25", "error"), t(null);
            }
        });
    })), mt = ee;
 
    function somd5(e) {
        return we(e);
    }
 
    function removeHtml(e, t = !0) {
        const n = document.createElement("textarea");
        n.innerHTML = e, e = (e = (e = (e = n.value).replace(/[\t\r\xa0]/g, " ")).replace(/[\u2000-\u200a]/g, " ")).replace(/<br\s*\/?>/g, "\n"), 
        t && (e = e.replace(/<(\/)?(p|div).*?>/g, "\n")), e = (e = (e = (e = e.replace(/ {2,}/g, " ")).replace(/\n{2,}/g, "\n")).replace(/<xmp.*?>/g, "<pre>")).replace(/<\/xmp>/g, "</pre>");
        let a = (e = I.sanitize(e, {
            ALLOWED_TAGS: [ "img", "br", "sub", "sup" ],
            ALLOWED_ATTR: [ "src", "href" ],
            ALLOW_DATA_ATTR: !1,
            KEEP_CONTENT: !0
        })).match(/<img.*?src="(.*?)".*?>/g);
        return a && a.forEach((t => {
            let n = t.match(/src="(.*?)"/);
            if (n && -1 == n[1].indexOf("http") && !n[1].includes("data:image")) if (n[1].startsWith("/")) e = e.replace(n[1], location.origin + n[1]); else {
                const t = new URL(n[1], document.baseURI).href;
                e = e.replace(n[1], t);
            }
        })), e.trim();
    }
 
    function titleClean(e) {
        return e.replace(/^[.*?]\s*/, "").replace(/^\u3010.*?\u3011\s*/, "").replace(/\s*\uff08\d+\.\d+\u5206\uff09$/, "").replace(/^\d+\./, "").trim().replace(/^\d+\uff0e/, "").trim();
    }
 
    function sleep(e) {
        return new Promise((t => setTimeout(t, e)));
    }
 
    function typeConvert(e, t = !0) {
        return t ? ft[e] || "8" : Object.keys(ft).find((t => ft[t] === e)) || "\u5176\u5b83";
    }
 
    function typeMatch(e) {
        const t = {
            0: [ "\u5355\u9009", "\u5355\u9879\u9009\u62e9" ],
            1: [ "\u591a\u9009", "\u591a\u9879\u9009\u62e9" ],
            2: [ "\u586b\u7a7a" ],
            3: [ "\u5224\u65ad" ],
            4: [ "\u7b80\u7b54", "\u95ee\u7b54", "\u7efc\u5408\u9898" ],
            5: [ "\u540d\u8bcd\u89e3\u91ca" ],
            6: [ "\u8bba\u8ff0", "\u4e3b\u89c2" ],
            7: [ "\u8ba1\u7b97" ],
            9: [ "\u5206\u5f55" ],
            14: [ "\u5b8c\u5f62\u586b\u7a7a" ],
            24: [ "\u9009\u8bcd\u586b\u7a7a" ]
        };
        return Object.keys(t).find((n => t[n].some((t => e.includes(t))))) || "8";
    }
 
    function matchAnswer(e, t) {
        const preprocess = e => e.map((e => function(e) {
            if (/^[+-]?\d+(\.\d+)?$/.test(e)) return e;
            const t = e.replace(/\s+/g, "");
            return t.replace(new RegExp("\\p{P}", "gu"), "") || t;
        }(removeHtml(e))));
        e = preprocess(e), t = preprocess(t);
        const n = e.map((e => {
            const n = t.findIndex((t => t === e));
            return -1 !== n ? n : t.findIndex((t => t.includes(e)));
        }));
        return n.includes(-1) ? [] : n;
    }
 
    function msg(e, t = "info") {
        try {
            P.ElNotification({
                title: `${mt.script.name} v${mt.script.version}`,
                message: e,
                type: t,
                dangerouslyUseHTMLString: !0,
                appendTo: document.getElementById("AiAskApp")
            }), addLog(e, "success");
        } catch (n) {
            addLog(`\u6d88\u606f\u901a\u77e5\u5931\u8d25\u3010${e}\u3011`, "error");
        }
    }
 
    function isTrue(e) {
        return !isFalse(e) && /(\u6b63\u786e|\u662f|\u5bf9|\u221a|T|ri|true)/i.test(e);
    }
 
    function isFalse(e) {
        return /(\u4e0d\u6b63\u786e|\u9519\u8bef|\u5426|\u9519|\xd7|F|wr|false)/i.test(e);
    }
 
    const questionHash = (e, t, n, a = !0) => {
        let s = Array.from(n);
        a && s.sort();
        let o = `${e}${t}${s.join("")}`;
        o = o.replace(/\s/g, "");
        return we(o);
    };
 
    function encrypt(e = "", t = "asdgdfghfghfghfg", n = "1234567890123456") {
        try {
            t = t.substring(0, 16), n = n.substring(0, 16);
            return z.AES.encrypt(e, z.enc.Utf8.parse(t), {
                iv: z.enc.Utf8.parse(n),
                mode: z.mode.CBC,
                padding: z.pad.Pkcs7
            }).toString();
        } catch (a) {
            return addLog("coyptoJs\u5f02\u5e38", "error"), "";
        }
    }
 
    function judgeAnswer(e) {
        return isTrue(e) ? [ "\u6b63\u786e" ] : isFalse(e) ? [ "\u9519\u8bef" ] : [];
    }
 
    function removeStartChar(e) {
        return e.map(((e, t) => {
            let n = String.fromCharCode(65 + t) + " .", a = String.fromCharCode(65 + t) + ".", s = String.fromCharCode(65 + t) + "\u3001", o = String.fromCharCode(65 + t) + "\uff0e", i = String.fromCharCode(65 + t);
            return e.replace(new RegExp(`^${n}|^${a}|^${s}|^${o}|^${i}`), "").trim();
        }));
    }
 
    function qc(e) {
        D(e).find(".answerBg, .textDIV, .eidtDiv").each((function() {
            (D(this).find(".check_answer").length || D(this).find(".check_answer_dx").length) && D(this).click();
        })), D(e).find(".answerBg, .textDIV, .eidtDiv").find("textarea").each((function() {
            unsafeWindow.UE.getEditor(D(this).attr("name")).ready((function() {
                this.setContent("");
            }));
        })), D(e).find(":radio, :checkbox").prop("checked", !1), D(e).find("textarea").each((function() {
            unsafeWindow.UE.getEditor(D(this).attr("name")).ready((function() {
                this.setContent("");
            }));
        }));
    }
 
    function qc1(e) {
        D(e).find(".before-after,.before-after-checkbox, .textDIV, .eidtDiv").each((function() {
            (D(this).find(".check_answer").length || D(this).find(".check_answer_dx").length) && D(this).click();
        })), D(e).find(".before-after, .textDIV, .eidtDiv").find("textarea").each((function() {
            unsafeWindow.UE.getEditor(D(this).attr("name")).ready((function() {
                this.setContent("");
            }));
        })), D(e).find(":radio, :checkbox").prop("checked", !1), D(e).find("textarea").each((function() {
            unsafeWindow.UE.getEditor(D(this).attr("name")).ready((function() {
                this.setContent("");
            }));
        }));
    }
 
    const waitUntil = (e, t = 100) => new Promise((n => {
        const a = setInterval((() => {
            e() && (clearInterval(a), n());
        }), t);
    }));
 
    function isExist(e) {
        return D(e).length > 0;
    }
 
    function getUrl() {
        return location.href;
    }
 
    function removeOptionsStartChar(e) {
        for (let t = 0; t < e.length; t++) {
            let n = String.fromCharCode(65 + t) + ".", a = String.fromCharCode(65 + t) + "\u3001", s = String.fromCharCode(65 + t) + "\uff0e", o = String.fromCharCode(65 + t);
            const i = new RegExp(`^${n}|^${a}|^${s}|^${o}`);
            if (!e[t].match(i)) return !1;
            e[t] = e[t].replace(i, "").trim();
        }
        return e;
    }
 
    const formatDate = e => new Date(e).toISOString().replace("T", " ").substring(0, 19), ft = {
        "\u5355\u9009\u9898": "0",
        "\u591a\u9009\u9898": "1",
        "\u586b\u7a7a\u9898": "2",
        "\u5224\u65ad\u9898": "3",
        "\u7b80\u7b54\u9898": "4",
        "\u95ee\u7b54\u9898": "4",
        "\u540d\u8bcd\u89e3\u91ca": "5",
        "\u8bba\u8ff0\u9898": "6",
        "\u8ba1\u7b97\u9898": "7",
        "\u5206\u5f55\u9898": "9",
        "\u8d44\u6599\u9898": "10",
        "\u8fde\u7ebf\u9898": "11",
        "\u5339\u914d\u9898": "11",
        "\u6392\u5e8f\u9898": "13",
        "\u5b8c\u578b\u586b\u7a7a": "14",
        "\u5b8c\u5f62\u586b\u7a7a\u9898": "14",
        "\u9605\u8bfb\u7406\u89e3": "15",
        "\u7a0b\u5e8f\u9898": "17",
        "\u53e3\u8bed\u9898": "18",
        "\u542c\u529b\u9898": "19",
        "\u5171\u7528\u9009\u9879\u9898": "20",
        "\u6d4b\u8bc4\u9898": "21",
        "\u949f\u8868\u9898": "23",
        "\u9009\u8bcd\u586b\u7a7a": "24",
        "\u9009\u505a\u9898": "25",
        "\u5176\u5b83": "8"
    }, yt = function(e) {
        let t = "";
        for (;t.length < e; t += Math.random().toString(36).substr(2)) ;
        return t.substr(0, e);
    }(9) + "_", gt = ee, wt = "492563";
 
    se.ksv = we(gt.script.author + gt.script.name.replace(/server:/, "").trim());
 
    const vt = {
        debug: !0,
        searchApi: [],
        defaultShowFloat: !1,
        showFloat: !1,
        showBoard: !0,
        checkUpdate: !0,
        hideFloat: !1,
        alert: "\u70b9\u6211\u6709\u60ca\u559c",
        alertBubble: !0,
        key: "",
        gpt: [ {
            name: "GLM",
            desc: "\u667a\u666e\u6e05\u8a004.0",
            api: "http://82.157.105.20:8002/v1/chat/completions",
            key: "",
            msg: "AI\u54cd\u5e94\u5f02\u5e38\uff0c\u53ef\u80fd\u662f\u6ca1\u6709\u83b7\u53d6cookie,\u8bf7\u6309\u4e0b\u65b9\u6b65\u9aa4\u64cd\u4f5c\n1. \u6253\u5f00[\u667a\u666e\u6e05\u8a00](https://chatglm.cn/main/alltoolsdetail)\n2. \u767b\u5f55\u540e\u968f\u4fbf\u53d1\u4e00\u6761\u6d88\u606f\u5373\u53ef\n3. \u8fd4\u56de\u7b54\u9898\u9875\u5237\u65b0\u9875\u9762",
            home: "https://chatglm.cn/main/alltoolsdetail",
            recommend: 3
        }, {
            name: "spark",
            desc: "\u8baf\u98de\u661f\u706b",
            api: "http://82.157.105.20:8000/v1/chat/completions",
            key: "",
            msg: "AI\u54cd\u5e94\u5f02\u5e38\uff0c\u53ef\u80fd\u662f\u6ca1\u6709\u83b7\u53d6cookie,\u8bf7\u6309\u4e0b\u65b9\u6b65\u9aa4\u64cd\u4f5c\n1. \u6253\u5f00[\u8baf\u98de\u661f\u706b](https://xinghuo.xfyun.cn/desk)\n2. \u767b\u5f55\u540e\u968f\u4fbf\u53d1\u4e00\u6761\u6d88\u606f\u5373\u53ef\n3. \u8fd4\u56de\u7b54\u9898\u9875\u5237\u65b0\u9875\u9762",
            home: "https://xinghuo.xfyun.cn/desk",
            recommend: 5
        } ],
        gptIndex: 1,
        askGpt: !1
    }, bt = Cache.get("app") || vt;
 
    function getApp() {
        return Cache.get("app") || vt;
    }
 
    function setApp(e) {
        Cache.set("app", e);
    }
 
    Object.keys(vt).forEach((e => {
        if (void 0 === bt[e] && (bt[e] = vt[e]), "gpt" === e) {
            const e = new Map;
            bt.gpt.forEach((t => {
                e.set(t.name, t.key);
            })), bt.gpt = vt.gpt.map((t => ({
                ...t,
                key: e.get(t.name) || ""
            })));
        }
    })), setApp(bt), bt.gptIndex >= bt.gpt.length && (bt.gptIndex = 0, setApp(bt));
 
    const kt = {
        base: [ {
            type: "switch",
            label: "\u9ed8\u8ba4\u663e\u793a\u60ac\u6d6e",
            name: "defaultShowFloat",
            value: bt.defaultShowFloat,
            desc: "\u6253\u5f00\u9875\u9762\u65f6\u662f\u5426\u663e\u793a\u60ac\u6d6e\u7a97",
            options: []
        }, {
            type: "switch",
            label: "\u68c0\u6d4b\u66f4\u65b0",
            name: "checkUpdate",
            value: bt.checkUpdate,
            desc: "\u6253\u5f00\u9875\u9762\u65f6\u662f\u5426\u68c0\u6d4b\u66f4\u65b0",
            options: []
        }, {
            type: "switch",
            label: "\u5f3a\u5236\u9690\u85cf",
            name: "hideFloat",
            value: bt.hideFloat,
            desc: "\u4ec5\u70ed\u952e\u6216\u70b9\u51fb\u53f3\u4e0b\u89d2\u56fe\u7247\u624d\u663e\u793a\u60ac\u6d6e\u7a97",
            options: []
        }, {
            type: "switch",
            label: "\u6c14\u6ce1\u63d0\u793a",
            name: "alertBubble",
            value: bt.alertBubble,
            desc: "\u53f3\u4e0b\u89d2\u6c14\u6ce1\u63d0\u793a\u662f\u5426\u5f00\u542f",
            options: []
        }, {
            type: "select",
            label: "AI\u6a21\u578b\u9009\u62e9",
            name: "gptIndex",
            value: bt.gptIndex,
            desc: "\u9009\u62e9AI\u6a21\u578b",
            options: bt.gpt.map(((e, t) => ({
                label: e.desc,
                value: t
            })))
        }, {
            type: "switch",
            label: "AI\u8f85\u52a9\u7b54\u9898",
            name: "askGpt",
            value: bt.askGpt,
            desc: "\u5f53\u6240\u6709\u9898\u5e93\u5747\u65e0\u7b54\u6848\u65f6\uff0c\u5c06\u4f7f\u7528AI\u8f85\u52a9\u81ea\u52a8\u7b54\u9898\uff0c\u6b63\u786e\u7387\u65e0\u6cd5\u4fdd\u8bc1\uff0c\u8c28\u614e\u4f7f\u7528",
            options: []
        } ]
    }, xt = defineStore("app", {
        state: () => ({
            app: bt,
            script: gt.script,
            page: "home",
            ConfigInput: kt,
            logs: [ {
                time: (new Date).toLocaleString(),
                type: "success",
                content: "\u521d\u59cb\u5316\u65e5\u5fd7\u6210\u529f"
            } ]
        }),
        actions: {
            setConfig(e) {
                this.app = e, Cache.set("app", e);
            },
            setPage(e) {
                this.page = e;
            },
            addLog(e) {
                this.logs.length > 100 && this.logs.shift(), this.logs.push(e);
            }
        }
    }), _t = vue.createElementVNode("div", null, [ vue.createTextVNode(" \u672c\u811a\u672c\u4ec5\u4f9b\u5b66\u4e60\u4ea4\u6d41\uff0c\u8bf7\u52ff\u7528\u4f5c\u4efb\u4f55\u975e\u6cd5\u7528\u9014\u3002"), vue.createElementVNode("br"), vue.createTextVNode(" \u5982\u679c\u6709\u5176\u4ed6\u5e73\u53f0\u9700\u8981\u7b54\u9898\u529f\u80fd\uff0c\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005\uff0c\u4f1a\u6839\u636e\u9700\u6c42\u91cf\u914c\u60c5\u589e\u52a0\u3002 ") ], -1), qt = {
        key: 0,
        style: {
            "margin-top": "25px"
        }
    }, Ct = vue.defineComponent({
        __name: "Home",
        setup(e) {
            const t = xt();
            gt.script.downloadURL;
            const a = vue.ref(!0), msg1 = e => {
                P.ElMessage({
                    message: e,
                    type: "success",
                    duration: 2e3
                });
            }, s = [ "\u591a\u5e73\u53f0\u7b54\u6848\u68c0\u7d22", "AI\u8f85\u52a9\u7b54\u9898", "\u89e3\u9664\u590d\u5236\u9650\u5236", "Ctrl+Shift+P \u663e\u9690\u60ac\u6d6e\u7a97", "\u66f4\u591a\u529f\u80fd\u5f85\u6dfb\u52a0.." ], o = [ {
                name: "\u57fa\u7840\u914d\u7f6e",
                page: "Base"
            }, {
                name: "\u7b54\u9898\u754c\u9762",
                page: "ask"
            }, {
                name: "\u672c\u5730\u9898\u5e93",
                page: "preview"
            }, {
                name: "\u9898\u5e93\u7f13\u5b58",
                page: "question"
            }, {
                name: "\u9898\u5e93\u5bfc\u5165",
                page: "questionTool"
            }, {
                name: "\u65e5\u5fd7\u8bb0\u5f55",
                page: "log"
            }, {
                name: "AI\u641c\u9898",
                page: "ai"
            } ];
            return (e, n) => {
                const i = vue.resolveComponent("el-alert"), r = vue.resolveComponent("el-divider"), l = vue.resolveComponent("el-tag"), c = vue.resolveComponent("el-space"), u = vue.resolveComponent("el-button"), p = vue.resolveComponent("el-text"), h = vue.resolveComponent("el-col"), d = vue.resolveComponent("el-row");
                return vue.openBlock(), vue.createBlock(d, null, {
                    default: vue.withCtx((() => [ vue.createVNode(h, {
                        span: 24
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(i, {
                            type: "info",
                            closable: !1
                        }, {
                            title: vue.withCtx((() => [ _t ])),
                            _: 1
                        }), vue.createVNode(r, null, {
                            default: vue.withCtx((() => [ vue.createTextVNode("\u529f\u80fd\u5217\u8868") ])),
                            _: 1
                        }), vue.createElementVNode("div", null, [ vue.createVNode(c, {
                            wrap: "",
                            alignment: "center",
                            style: {
                                "justify-content": "space-around"
                            }
                        }, {
                            default: vue.withCtx((() => [ (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(s, ((e, t) => vue.createVNode(l, {
                                key: t
                            }, {
                                default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(e), 1) ])),
                                _: 2
                            }, 1024))), 64)) ])),
                            _: 1
                        }) ]), a.value ? (vue.openBlock(), vue.createElementBlock("div", qt, [ vue.createVNode(c, {
                            alignment: "center",
                            wrap: "",
                            style: {
                                "justify-content": "space-around"
                            }
                        }, {
                            default: vue.withCtx((() => [ (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(o, ((e, n) => vue.createVNode(u, {
                                key: n,
                                type: "primary",
                                plain: "",
                                onClick: n => vue.unref(t).setPage(e.page),
                                style: {
                                    "margin-bottom": "10px"
                                }
                            }, {
                                default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(e.name), 1) ])),
                                _: 2
                            }, 1032, [ "onClick" ]))), 64)) ])),
                            _: 1
                        }) ])) : vue.createCommentVNode("", !0), vue.createVNode(r, {
                            onClick: msg1
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode("\u7248\u672c\u4fe1\u606f") ])),
                            _: 1
                        }), vue.createElementVNode("div", null, [ vue.createElementVNode("p", null, [ vue.createTextVNode("\u5f53\u524d\u7248\u672c\u53f7: "), vue.createVNode(l, {
                            type: "primary"
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(vue.unref(gt).script.version), 1) ])),
                            _: 1
                        }), vue.createVNode(u, {
                            size: "small",
                            type: "primary",
                            onClick: vue.unref(updateCheck1)
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode("\u68c0\u6d4b\u66f4\u65b0") ])),
                            _: 1
                        }, 8, [ "onClick" ]) ]), vue.createElementVNode("p", null, [ vue.createVNode(p, {
                            class: "mx-1",
                            type: "info"
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode("PS\uff1a\u4fdd\u6301\u6700\u65b0\u7248\u672c\u53ef\u4ee5\u51cf\u5c11BUG\u7684\u51fa\u73b0\u54e6~") ])),
                            _: 1
                        }) ]) ]) ])),
                        _: 1
                    }) ])),
                    _: 1
                });
            };
        }
    }), Tt = {
        style: {
            margin: "10px"
        }
    }, At = vue.defineComponent({
        __name: "Base",
        setup(e) {
            const t = xt();
            vue.watch(t.app, (e => {
                t.setConfig(e);
            })), vue.watch(t.ConfigInput, (e => {
                for (let n in e) for (let a in e[n]) {
                    let s = e[n][a];
                    t.app[s.name] = s.value;
                }
                msg("\u914d\u7f6e\u4fee\u6539\u6210\u529f", "success"), t.app, t.setConfig(t.app);
            }));
            const n = t.ConfigInput;
            return (e, t) => {
                const a = vue.resolveComponent("el-alert"), s = vue.resolveComponent("el-col"), o = vue.resolveComponent("el-switch"), i = vue.resolveComponent("el-input"), r = vue.resolveComponent("el-input-number"), l = vue.resolveComponent("el-option"), c = vue.resolveComponent("el-select"), u = vue.resolveComponent("el-checkbox"), p = vue.resolveComponent("el-checkbox-group"), h = vue.resolveComponent("el-tooltip"), d = vue.resolveComponent("el-row");
                return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [ vue.createVNode(a, {
                    title: "\u914d\u7f6e\u4fee\u6539\u540e\u4f1a\u81ea\u52a8\u4fdd\u5b58\uff0c\u76f4\u63a5\u5237\u65b0\u9875\u9762\u5373\u53ef",
                    type: "info",
                    closable: !1,
                    "show-icon": ""
                }), (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(n).base, (e => (vue.openBlock(), vue.createElementBlock("div", Tt, [ vue.createVNode(d, {
                    class: "row-bg",
                    justify: "space-between",
                    align: "middle"
                }, {
                    default: vue.withCtx((() => [ vue.createVNode(s, {
                        span: 6
                    }, {
                        default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(e.label), 1) ])),
                        _: 2
                    }, 1024), vue.createVNode(s, {
                        span: 18,
                        style: {
                            "text-align": "right"
                        }
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(h, {
                            class: "grid-content ep-bg-purple-light",
                            effect: "dark",
                            content: e.desc || "",
                            placement: "top"
                        }, {
                            default: vue.withCtx((() => [ "switch" === e.type ? (vue.openBlock(), vue.createBlock(o, {
                                key: 0,
                                modelValue: e.value,
                                "onUpdate:modelValue": t => e.value = t
                            }, null, 8, [ "modelValue", "onUpdate:modelValue" ])) : "input" === e.type ? (vue.openBlock(), 
                            vue.createBlock(i, {
                                key: 1,
                                modelValue: e.value,
                                "onUpdate:modelValue": t => e.value = t
                            }, null, 8, [ "modelValue", "onUpdate:modelValue" ])) : "number" === e.type ? (vue.openBlock(), 
                            vue.createBlock(r, {
                                key: 2,
                                modelValue: e.value,
                                "onUpdate:modelValue": t => e.value = t
                            }, null, 8, [ "modelValue", "onUpdate:modelValue" ])) : "select" === e.type ? (vue.openBlock(), 
                            vue.createBlock(c, {
                                key: 3,
                                modelValue: e.value,
                                "onUpdate:modelValue": t => e.value = t,
                                placeholder: "\u8bf7\u9009\u62e9"
                            }, {
                                default: vue.withCtx((() => [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, (e => (vue.openBlock(), vue.createBlock(l, {
                                    key: e.value,
                                    label: e.label,
                                    value: e.value
                                }, null, 8, [ "label", "value" ])))), 128)) ])),
                                _: 2
                            }, 1032, [ "modelValue", "onUpdate:modelValue" ])) : "checkbox" === e.type ? (vue.openBlock(), 
                            vue.createBlock(p, {
                                key: 4,
                                modelValue: e.value,
                                "onUpdate:modelValue": t => e.value = t
                            }, {
                                default: vue.withCtx((() => [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, (e => (vue.openBlock(), vue.createBlock(u, {
                                    key: e.value,
                                    label: e.value,
                                    name: e.value
                                }, {
                                    default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(e.label), 1) ])),
                                    _: 2
                                }, 1032, [ "label", "name" ])))), 128)) ])),
                                _: 2
                            }, 1032, [ "modelValue", "onUpdate:modelValue" ])) : vue.createCommentVNode("", !0) ])),
                            _: 2
                        }, 1032, [ "content" ]) ])),
                        _: 2
                    }, 1024) ])),
                    _: 2
                }, 1024) ])))), 256)) ], 64);
            };
        }
    }), parsePack = e => {
        const t = /data:\s*({.*?})\s*\n/g, n = [];
        let a;
        for (;null !== (a = t.exec(e)); ) {
            const e = a[1];
            try {
                const t = JSON.parse(e);
                n.push(t);
            } catch (s) {}
        }
        return n;
    }, markToHtml = e => {
        const t = B({
            highlight: (e, n) => `<pre><code class="hljs">${t.utils.escapeHtml(e)}</code></pre>`,
            html: !0,
            breaks: !0,
            linkify: !0
        }), n = t.renderer.rules.link_open || ((e, t, n, a, s) => s.renderToken(e, t, n));
        return t.renderer.rules.link_open = (e, t, a, s, o) => {
            const i = e[t].attrIndex("target");
            return i < 0 ? (e[t].attrPush([ "target", "_blank" ]), e[t].attrPush([ "rel", "noopener noreferrer" ])) : e[t].attrs[i][1] = "_blank", 
            n(e, t, a, s, o);
        }, t.render(e);
    }, aiAsk = async (e, t, n, a = "1\u3001\u8bf7\u6839\u636e\u4ee5\u4e0b\u9898\u76ee\u63d0\u4f9b\u6b63\u786e\u7684\u7b54\u6848\u3002\n2\u3001\u4e0d\u8981\u8bf4\u65e0\u5173\u7684\u8bdd\uff0c\u53ea\u9700\u8981\u56de\u7b54\u95ee\u9898\u3002\n3\u3001\u5982\u679c\u4f60\u4e0d\u77e5\u9053\u8bf7\u8fd4\u56de\u3010\u6211\u4e0d\u4f1a\u3011") => {
        let s = getApp(), o = s.gpt[s.gptIndex], i = o.api, r = JSON.stringify({
            model: "gpt-4o",
            messages: [ {
                role: "system",
                content: a
            }, {
                role: "user",
                content: e
            } ],
            stream: !0
        }), l = {
            Accept: "application/json",
            Authorization: `Bearer ${o.key}`,
            "Content-Type": "application/json"
        };
        return new Promise(((e, a) => {
            if (!o.key) return t(`${o.msg}`), e("\u6682\u65e0KEY");
            ae({
                method: "POST",
                url: i,
                data: r,
                headers: l,
                responseType: "stream",
                onloadstart: async s => {
                    let o = "", i = !1;
                    const r = s.response.getReader(), l = new TextDecoder;
                    try {
                        for (;!i; ) {
                            const {done: a, value: s} = await r.read();
                            if (await sleep(50), a) return i = !0, n(), e(o);
                            0;
                            parsePack(l.decode(s)).forEach((e => {
                                if (!e.choices || 0 === e.choices.length) return;
                                const n = e.choices[0].delta.content;
                                void 0 !== n && "" !== n && (o += n, t(n));
                            }));
                        }
                    } catch (c) {
                        return console.error("Error reading stream:", c), a(c);
                    }
                }
            });
        }));
    }, St = defineStore("ask", {
        state: () => ({
            questionList: [],
            questionInx: 0,
            inx: 0,
            Interval: 0,
            start: !1,
            skipFinish: Cache.get("skipFinish", !1),
            autoNext: Cache.get("autoNext", !1),
            autoAnswer: Cache.get("autoAnswer", !0),
            freeFirst: !0,
            randomAnswer: Cache.get("randomAnswer", !1),
            lock: !1,
            formMap: {},
            type: "cx",
            loading: !1,
            loadingText: "\u52a0\u8f7d\u4e2d....",
            tips: "\u672c\u811a\u672c\u4ec5\u4f9b\u5b66\u4e60\u7814\u7a76\uff0c\u8bf7\u52ff\u7528\u4e8e\u975e\u6cd5\u7528\u9014",
            delay: Cache.get("delay", 1e3),
            saveQuestionData: []
        }),
        actions: {
            addQuestion(e) {
                this.questionList.push({
                    ...e,
                    answer: [],
                    status: 0,
                    aiMsg: ""
                });
            },
            clearQuestion() {
                this.questionList = [];
            },
            getQuestion() {
                return this.questionList[this.questionInx];
            },
            nextQuestion() {
                if (this.questionInx === this.questionList.length - 1) return clearInterval(this.Interval), 
                void (this.start = !1);
                this.questionInx++;
            },
            prevQuestion() {
                0 !== this.questionInx && this.questionInx--;
            },
            toQuestion(e) {
                this.questionInx = e;
                let t = this.questionList[e];
                if (this.rule.toquestion && this.rule.toquestion(e), t.html.scrollIntoView({
                    block: "center"
                }), se.self !== se.top) {
                    let n = document.querySelector(".el-dialog");
                    if (n) {
                        n.style.transform = "none";
                        let a = t.html.getBoundingClientRect();
                        n.style.top = a.top - 700 + "px", 0 === e && (n.style.top = "0px"), e === this.questionList.length - 1 && document.documentElement.scrollHeight > 2e3 && (n.style.top = a.top - 900 + "px");
                    }
                }
                t.html.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.15)", setTimeout((() => {
                    t.html.style.boxShadow = "";
                }), 500);
            },
            setQuestionStatus(e, t) {
                this.questionList[e] && null != this.questionList[e].status && (this.questionList[e].status = t);
            },
            async toggleStart() {
                const e = getAppStore();
                if (!this.lock && (this.start = !this.start, this.start)) {
                    this.lock = !0;
                    for (let t = this.questionInx; t < this.questionList.length && this.start; t++) {
                        if (this.skipFinish && 1 === this.questionList[t].status) continue;
                        this.questionInx = t, "8" !== this.questionList[t].type ? (await this.reAnswer(t), 
                        e.app.alert = `\u5f53\u524d\u8fdb\u5ea6:${t + 1}/${this.questionList.length}`, await sleep(this.delay + 1e3 * Math.random()), 
                        this.rule.toquestion && this.rule.toquestion(this.questionInx + 1), this.autoNext && this.rule.next && this.rule.next()) : this.setQuestionStatus(t, 2);
                    }
                    this.autoNext && this.rule.finish && this.rule.finish({
                        question: this.questionList
                    }), this.start = !1, this.lock = !1, this.formMap = {}, this.questionList.forEach((t => {
                        var n;
                        if (null == (n = t.form) ? void 0 : n.form) {
                            let e = t.form.form;
                            e && (this.formMap[e] = this.formMap[e] ? this.formMap[e] + 1 : 1);
                        } else this.formMap["\u65e0\u7b54\u6848"] = this.formMap["\u65e0\u7b54\u6848"] ? this.formMap["\u65e0\u7b54\u6848"] + 1 : 1;
                        e.app.alert = "\u7b54\u9898\u5b8c\u6210~";
                    }));
                }
            },
            async reAnswer(e) {
                const t = getAppStore();
                let n = this.questionList[e], a = [];
                this.loading = !0, this.loadingText = "\u52a0\u8f7d\u4e2d....";
                let s = await Answer.getCacheAnswer(n), o = ApiAnswerMatch([ s ], n);
                if (!o.haveAnswer && (this.loadingText = "\u6b63\u5728\u4ece\u63a5\u53e3\u4e2d\u83b7\u53d6\u7b54\u6848", 
                s = await Answer.getAnswersFree(n), o = ApiAnswerMatch(s, n), a = s, !o.haveAnswer && t.app.askGpt)) {
                    this.loadingText = "\u6b63\u5728\u4eceAI\u4e2d\u83b7\u53d6\u7b54\u6848";
                    let e = this.buildAIQuestionText(n);
                    if (!e.includes("<img")) {
                        const i = await this.fetchAIAnswer(e, n.type, t);
                        s = i.res, o = i.matchResult, a.push(s);
                    }
                }
                n.answer = a, n.form = o.form, o.haveAnswer ? this.setQuestionStatus(e, 1) : (this.randomAnswer && ((e, t) => {
                    const n = getAskStore();
                    let a = !0, s = t.type, o = t.html, i = [ "", [], t, n.rule ];
                    switch (s) {
                      case "0":
                      case "1":
                        let e = [ Math.floor(Math.random() * t.options.length) ];
                        i[0] = "xx", i[1] = e;
                        break;
 
                      case "3":
                        let n = Math.random() > .5 ? "\u6b63\u786e" : "\u9519\u8bef";
                        i[0] = "pd", i[1] = n;
                        break;
 
                      default:
                        return;
                    }
                    n.rule.setAnswerHook && "function" == typeof n.rule.setAnswerHook && n.rule.setAnswerHook({
                        type: s,
                        answer: i[1],
                        html: t.html,
                        ques: t
                    }), n.rule.setAnswer && "function" == typeof n.rule.setAnswer && (a = n.rule.setAnswer({
                        type: s,
                        answer: i[1],
                        html: o,
                        ques: t,
                        rule: n.rule
                    })), a && defaultSetAnswer(i[0], i[1], t, n.rule);
                })(0, n), this.setQuestionStatus(e, 2)), this.loading = !1;
            },
            buildAIQuestionText(e) {
                var t;
                let n = `[${typeConvert(e.type, !1)}]${e.question}\n`;
                return e.options && e.options.forEach(((e, t) => {
                    n += `${String.fromCharCode(65 + t)}\u3001${e}\n`;
                })), "24" === e.type && (e.match.forEach((e => {
                    n += `\u7b2c\u4e00\u5217${e}\n`;
                })), null == (t = e.selects[0]) || t.forEach((e => {
                    n += `\u7b2c\u4e8c\u5217${e.text}\n`;
                }))), n;
            },
            async fetchAIAnswer(e, t, n) {
                let a = Date.now(), s = {}, o = {};
                try {
                    let i = await aiAsk(e, (() => {}), (() => {}), (e => {
                        switch (e) {
                          case "0":
                          case "1":
                            return '1\u3001\u8bf7\u6839\u636e\u4ee5\u4e0b\u9898\u76ee\u63d0\u4f9b\u7b80\u6d01\u7684\u56de\u7b54\n                  2\u3001\u8981\u6c42\uff1a\u6839\u636e\u9898\u610f\uff0c\u5c3d\u91cf\u7cbe\u7b80\u5730\u56de\u7b54\u95ee\u9898\u3002\n                  3\u3001\u8bf7\u8fd4\u56dejson\u683c\u5f0f\u7684\u56de\u7b54\uff0c\u5982\uff1a{"answer":"ABC"}\n                  4\u3001\u5982\u679c\u4f60\u4e0d\u77e5\u9053\u8bf7\u8fd4\u56de\uff1a{"answer":""}\n                  5\u3001\u53ea\u9700\u8981json\u5b57\u7b26\u4e32\u4e0d\u9700\u8981\u591a\u4f59\u5176\u4ed6\u8f93\u51fa';
 
                          case "2":
                            return '1\u3001\u8bf7\u6839\u636e\u4ee5\u4e0b\u9898\u76ee\u63d0\u4f9b\u7b80\u6d01\u7684\u56de\u7b54\n                  2\u3001\u8981\u6c42\uff1a\u6839\u636e\u9898\u610f\uff0c\u5c3d\u91cf\u7cbe\u7b80\u5730\u56de\u7b54\u95ee\u9898\u3002\n                  3\u3001\u8bf7\u8fd4\u56dejson\u683c\u5f0f\u7684\u56de\u7b54\uff0c\u5982\uff1a{"answer":["\u7b2c\u4e00\u7a7a","\u7b2c\u4e8c\u7a7a"]}\n                  4\u3001\u5982\u679c\u4f60\u4e0d\u77e5\u9053\u8bf7\u8fd4\u56de\uff1a{"answer":""}\n                  5\u3001\u53ea\u9700\u8981json\u5b57\u7b26\u4e32\u4e0d\u9700\u8981\u591a\u4f59\u5176\u4ed6\u8f93\u51fa';
 
                          case "3":
                            return '1\u3001\u8bf7\u6839\u636e\u4ee5\u4e0b\u9898\u76ee\u63d0\u4f9b\u7b80\u6d01\u7684\u56de\u7b54\n                  2\u3001\u8981\u6c42\uff1a\u6839\u636e\u9898\u610f\u56de\u7b54\u6b63\u786e\u6216\u9519\u8bef\n                  3\u3001\u8bf7\u8fd4\u56dejson\u683c\u5f0f\u7684\u56de\u7b54\uff0c\u5982\uff1a{"answer":"\u6b63\u786e"}\n                  4\u3001\u5982\u679c\u4f60\u4e0d\u77e5\u9053\u8bf7\u8fd4\u56de\uff1a{"answer":""}\n                  5\u3001\u53ea\u9700\u8981json\u5b57\u7b26\u4e32\u4e0d\u9700\u8981\u591a\u4f59\u5176\u4ed6\u8f93\u51fa';
 
                          default:
                            return '1\u3001\u8bf7\u6839\u636e\u4ee5\u4e0b\u9898\u76ee\u63d0\u4f9b\u7b80\u6d01\u7684\u56de\u7b54\n                  2\u3001\u8981\u6c42\uff1a\u6839\u636e\u9898\u610f\uff0c\u5c3d\u91cf\u7cbe\u7b80\u5730\u56de\u7b54\u95ee\u9898\u3002\n                  3\u3001\u8bf7\u8fd4\u56dejson\u683c\u5f0f\u7684\u56de\u7b54\uff0c\u5982\uff1a{"answer":"\u7b54\u6848"}\n                  4\u3001\u5982\u679c\u4f60\u4e0d\u77e5\u9053\u8bf7\u8fd4\u56de\uff1a{"answer":""}\n                  5\u3001\u53ea\u9700\u8981json\u5b57\u7b26\u4e32\u4e0d\u9700\u8981\u591a\u4f59\u5176\u4ed6\u8f93\u51fa';
                        }
                    })(t));
                    i = i.replace("```json", "").replace("```", "").trim(), s = JSON.parse(i), s.form = n.app.gpt[n.app.gptIndex].desc, 
                    s.duration = Date.now() - a, s.answer || (s.msg = "AI\u8bf4\u4ed6\u4e0d\u4f1a"), 
                    o = ApiAnswerMatch([ s ], this.questionList[this.questionInx], !0);
                } catch (i) {
                    s = {
                        answer: "",
                        msg: markToHtml(n.app.gpt[n.app.gptIndex].msg),
                        form: n.app.gpt[n.app.gptIndex].desc,
                        duration: 5e3
                    };
                }
                return {
                    res: s,
                    matchResult: o
                };
            },
            aiAnswer(e) {
                let t = this.questionList[e];
                this.loadingText = "AI\u601d\u8003\u4e2d.....", this.loading = !0;
                let n = `[${typeConvert(t.type, !1)}]${t.question}\n`;
                t.aiMsg = "", t.options.forEach((e => {
                    n += `${e}\n`;
                })), "24" === t.type && (t.match.forEach(((e, t) => {
                    n += `\u7b2c\u4e00\u5217${e}\n`;
                })), t.selects[0].forEach(((e, t) => {
                    n += `\u7b2c\u4e8c\u5217${e.text}\n`;
                }))), aiAsk(n, (e => {
                    t.aiMsg += e, this.loading = !1;
                }), (() => {
                    this.loading = !1, t.aiMsg.length <= 0 && (t.aiMsg = "AI\u54cd\u5e94\u5f02\u5e38\uff0c\u53ef\u80fd\u662f\u6ca1\u6709\u83b7\u53d6KEY,\u8bf7\u6309\u4e0b\u65b9\u6b65\u9aa4\u64cd\u4f5c  \n            1. \u6253\u5f00[\u667a\u666e\u6e05\u8a00](https://chatglm.cn/main/alltoolsdetail)  \n            2. \u767b\u5f55\u540e\u968f\u4fbf\u53d1\u4e00\u6761\u6d88\u606f\u5373\u53ef  \n            3. \u8fd4\u56de\u7b54\u9898\u9875\u5237\u65b0\u9875\u9762  ");
                }));
            },
            pause() {
                this.start = !1;
            },
            restart() {
                this.questionInx = 0, this.start = !0, this.toggleStart();
            }
        },
        getters: {
            current() {
                return this.questionList[this.questionInx];
            },
            currentAiMd() {
                return markToHtml(this.questionList[this.questionInx].aiMsg);
            }
        }
    }), Ut = vue.createElementVNode("div", {
        class: "aah_bomHet50"
    }, [ vue.createElementVNode("span", {
        class: "dq"
    }, [ vue.createElementVNode("i"), vue.createTextVNode("\u5f53\u524d\u9898\u76ee") ]), vue.createElementVNode("span", {
        class: "yp"
    }, [ vue.createElementVNode("i"), vue.createTextVNode("\u5df2\u4f5c\u7b54") ]), vue.createElementVNode("span", {
        class: "wp"
    }, [ vue.createElementVNode("i"), vue.createTextVNode("\u65e0\u7b54\u6848") ]), vue.createElementVNode("span", {
        class: "zp"
    }, [ vue.createElementVNode("i"), vue.createTextVNode("\u672a\u4f5c\u7b54") ]) ], -1), Ht = [ "innerHTML" ], Et = [ "innerHTML" ], Ft = {
        key: 0
    }, jt = {
        style: {
            width: "100%"
        }
    }, $t = [ "innerHTML" ], Lt = [ "value" ], It = {
        key: 1,
        style: {
            color: "green"
        }
    }, Pt = {
        key: 2,
        style: {
            color: "red"
        }
    }, Ot = {
        key: 0
    }, Mt = {
        key: 1
    }, Dt = [ "innerHTML" ], zt = {
        key: 0
    }, Bt = [ "innerHTML" ], Gt = vue.defineComponent({
        __name: "Ask",
        setup(e) {
            const t = St(), n = xt(), getOptionIndex = e => String.fromCharCode(65 + e), formatTooltip = e => `\u7b54\u9898\u95f4\u9694\uff1a${e}ms`;
            vue.watch(n.app, (e => {
                n.setConfig(e);
            }));
            const watchAutoNext = () => {
                Cache.set("autoNext", t.autoNext);
            }, watchSkipFinish = () => {
                Cache.set("skipFinish", t.skipFinish);
            }, watchAutoAnswer = () => {
                Cache.set("autoAnswer", t.autoAnswer);
            }, watchRandomAnswer = () => {
                Cache.set("randomAnswer", t.randomAnswer);
            }, watchAskGpt = () => {
                msg("\u8bf7\u5148\u53bbAI\u641c\u9898\u9875\u9762\u6d4b\u8bd5AI\u662f\u5426\u53ef\u7528\uff0c\u518d\u542f\u7528\u7b54\u9898\uff0c\u7b54\u9898\u6b63\u786e\u7387\u65e0\u6cd5\u4fdd\u8bc1"), 
                Cache.set("askGpt", n.app.askGpt);
            }, watchDelay = () => {
                Cache.set("delay", t.delay);
            };
            return (e, a) => {
                const s = vue.resolveComponent("el-alert"), o = vue.resolveComponent("el-button"), i = vue.resolveComponent("el-col"), r = vue.resolveComponent("el-checkbox"), l = vue.resolveComponent("el-tooltip"), c = vue.resolveComponent("el-slider"), u = vue.resolveComponent("el-form-item"), p = vue.resolveComponent("el-form"), h = vue.resolveComponent("el-tag"), d = vue.resolveComponent("el-divider"), m = vue.resolveComponent("el-input"), f = vue.resolveComponent("el-row"), y = vue.resolveComponent("el-empty"), $ = vue.resolveDirective("loading");
                return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [ vue.createVNode(s, {
                    style: {
                        "margin-bottom": "10px"
                    },
                    title: vue.unref(t).tips,
                    type: "info",
                    closable: !1
                }, null, 8, [ "title" ]), vue.createVNode(f, null, {
                    default: vue.withCtx((() => [ vue.unref(t).current ? (vue.openBlock(), vue.createBlock(i, {
                        key: 0,
                        span: 12
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(o, {
                            onClick: a[0] || (a[0] = e => vue.unref(t).start ? vue.unref(t).pause() : vue.unref(t).toggleStart()),
                            size: "small",
                            class: "aah_btn",
                            type: "primary",
                            plain: ""
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(vue.unref(t).start ? "\u6682\u505c\u7b54\u9898" : "\u5f00\u59cb\u7b54\u9898"), 1) ])),
                            _: 1
                        }) ])),
                        _: 1
                    })) : vue.createCommentVNode("", !0), vue.unref(t).current ? (vue.openBlock(), vue.createBlock(i, {
                        key: 1,
                        span: 12
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(o, {
                            onClick: a[1] || (a[1] = e => vue.unref(t).restart()),
                            size: "small",
                            class: "aah_btn",
                            type: "primary",
                            plain: ""
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode("\u91cd\u65b0\u7b54\u9898") ])),
                            _: 1
                        }) ])),
                        _: 1
                    })) : vue.createCommentVNode("", !0), vue.unref(t).current ? (vue.openBlock(), vue.createBlock(i, {
                        key: 2,
                        span: 24
                    }, {
                        default: vue.withCtx((() => [ Ut ])),
                        _: 1
                    })) : vue.createCommentVNode("", !0), vue.unref(t).current ? (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, {
                        key: 3
                    }, vue.renderList(vue.unref(t).questionList, ((e, n) => (vue.openBlock(), vue.createBlock(i, {
                        span: 3
                    }, {
                        default: vue.withCtx((() => [ (vue.openBlock(), vue.createBlock(o, {
                            class: vue.normalizeClass(n == vue.unref(t).questionInx ? "aah_active" : ""),
                            style: {
                                width: "30px",
                                "margin-bottom": "4px"
                            },
                            key: n,
                            onClick: e => vue.unref(t).toQuestion(n),
                            size: "small",
                            type: 1 == e.status ? "primary" : 2 == e.status ? "danger" : "",
                            plain: ""
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(n + 1), 1) ])),
                            _: 2
                        }, 1032, [ "class", "onClick", "type" ])) ])),
                        _: 2
                    }, 1024)))), 256)) : vue.createCommentVNode("", !0), vue.createVNode(i, {
                        span: 24
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(p, {
                            "label-width": "auto"
                        }, {
                            default: vue.withCtx((() => [ vue.createVNode(r, {
                                onChange: watchSkipFinish,
                                modelValue: vue.unref(t).skipFinish,
                                "onUpdate:modelValue": a[2] || (a[2] = e => vue.unref(t).skipFinish = e),
                                label: "\u8df3\u8fc7\u5df2\u4f5c\u7b54"
                            }, null, 8, [ "modelValue" ]), vue.createVNode(r, {
                                onChange: watchAutoAnswer,
                                modelValue: vue.unref(t).autoAnswer,
                                "onUpdate:modelValue": a[3] || (a[3] = e => vue.unref(t).autoAnswer = e),
                                label: "\u81ea\u52a8\u7b54\u9898"
                            }, null, 8, [ "modelValue" ]), vue.createVNode(r, {
                                onChange: watchAutoNext,
                                modelValue: vue.unref(t).autoNext,
                                "onUpdate:modelValue": a[4] || (a[4] = e => vue.unref(t).autoNext = e),
                                label: "\u81ea\u52a8\u8df3\u8f6c"
                            }, null, 8, [ "modelValue" ]), vue.createVNode(r, {
                                onChange: watchRandomAnswer,
                                modelValue: vue.unref(t).randomAnswer,
                                "onUpdate:modelValue": a[5] || (a[5] = e => vue.unref(t).randomAnswer = e),
                                label: "\u65e0\u7b54\u6848\u968f\u673a\u7b54\u9898"
                            }, null, 8, [ "modelValue" ]), vue.createVNode(l, {
                                class: "box-item",
                                effect: "dark",
                                content: "AI\u65e0\u6cd5\u4fdd\u8bc1\u6b63\u786e\u7387\uff0c\u4e14\u4e0d\u540c\u6a21\u578b\u6548\u679c\u4e5f\u5404\u4e0d\u76f8\u540c\uff0c\u8bf7\u81ea\u884c\u5224\u65ad\u662f\u5426\u542f\u7528",
                                placement: "top-start"
                            }, {
                                default: vue.withCtx((() => [ vue.createVNode(r, {
                                    onChange: watchAskGpt,
                                    modelValue: vue.unref(n).app.askGpt,
                                    "onUpdate:modelValue": a[6] || (a[6] = e => vue.unref(n).app.askGpt = e),
                                    label: "\u4f7f\u7528AI\u8f85\u52a9\u7b54\u9898"
                                }, null, 8, [ "modelValue" ]) ])),
                                _: 1
                            }), vue.createVNode(u, {
                                label: "\u95f4\u9694"
                            }, {
                                default: vue.withCtx((() => [ vue.createVNode(c, {
                                    onChange: watchDelay,
                                    modelValue: vue.unref(t).delay,
                                    "onUpdate:modelValue": a[7] || (a[7] = e => vue.unref(t).delay = e),
                                    max: 5e3,
                                    min: 100,
                                    "format-tooltip": formatTooltip
                                }, null, 8, [ "modelValue" ]) ])),
                                _: 1
                            }) ])),
                            _: 1
                        }) ])),
                        _: 1
                    }), vue.unref(t).formMap ? (vue.openBlock(), vue.createBlock(i, {
                        key: 4,
                        span: 24
                    }, {
                        default: vue.withCtx((() => [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(t).formMap, ((e, t) => (vue.openBlock(), vue.createBlock(h, {
                            key: t,
                            style: {
                                "margin-right": "10px"
                            }
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(t) + ":" + vue.toDisplayString(e) + " \u6b21", 1) ])),
                            _: 2
                        }, 1024)))), 128)) ])),
                        _: 1
                    })) : vue.createCommentVNode("", !0), vue.unref(t).current ? (vue.openBlock(), vue.createBlock(d, {
                        key: 5
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(o, {
                            onClick: a[8] || (a[8] = e => vue.unref(t).reAnswer(vue.unref(t).questionInx)),
                            style: {
                                color: "red",
                                "font-size": "10px"
                            },
                            link: ""
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode("\u91cd\u7b54") ])),
                            _: 1
                        }), vue.createVNode(d, {
                            direction: "vertical"
                        }), vue.createVNode(o, {
                            onClick: a[9] || (a[9] = e => vue.unref(t).aiAnswer(vue.unref(t).questionInx)),
                            style: {
                                color: "red",
                                "font-size": "10px"
                            },
                            link: ""
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode("AI\u7b54\u9898") ])),
                            _: 1
                        }) ])),
                        _: 1
                    })) : vue.createCommentVNode("", !0), vue.unref(t).current ? (vue.openBlock(), vue.createBlock(i, {
                        key: 6,
                        span: 24
                    }, {
                        default: vue.withCtx((() => [ vue.createElementVNode("div", {
                            class: "aah_title",
                            innerHTML: "[" + vue.unref(typeConvert)(vue.unref(t).current.type ?? "", !1) + "]" + vue.unref(t).current.question
                        }, null, 8, Ht), (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(t).current.options, ((e, n) => (vue.openBlock(), vue.createElementBlock("p", {
                            style: vue.normalizeStyle(vue.unref(t).current.form && vue.unref(t).current.form.match && vue.unref(t).current.form.match.includes(n) ? "color:green;" : ""),
                            class: "aah_options",
                            innerHTML: getOptionIndex(n) + ". " + e
                        }, null, 12, Et)))), 256)), "24" == vue.unref(t).current.type ? (vue.openBlock(), vue.createElementBlock("p", Ft, [ vue.createElementVNode("table", jt, [ (vue.openBlock(!0), 
                        vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(t).current.match, ((e, n) => (vue.openBlock(), vue.createElementBlock("tr", null, [ vue.createElementVNode("td", {
                            innerHTML: e
                        }, null, 8, $t), vue.createElementVNode("td", null, [ vue.createElementVNode("select", null, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(t).current.selects[n], (e => (vue.openBlock(), 
                        vue.createElementBlock("option", {
                            value: e.value
                        }, vue.toDisplayString(e.text), 9, Lt)))), 256)) ]) ]) ])))), 256)) ]) ])) : vue.createCommentVNode("", !0), vue.unref(t).current.form ? (vue.openBlock(), 
                        vue.createElementBlock("p", It, " \u91c7\u7528\u3010" + vue.toDisplayString(vue.unref(t).current.form.form) + "\u3011\u7684\u7b54\u6848 ", 1)) : vue.createCommentVNode("", !0), "8" == vue.unref(t).current.type || null == vue.unref(t).current.type || "" == vue.unref(t).current.type ? (vue.openBlock(), 
                        vue.createElementBlock("p", Pt, " \u5f53\u524d\u9898\u578b\u6682\u4e0d\u652f\u6301\uff0c\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005\u5427 ")) : vue.createCommentVNode("", !0) ])),
                        _: 1
                    })) : vue.createCommentVNode("", !0), vue.unref(t).current ? vue.withDirectives((vue.openBlock(), vue.createBlock(i, {
                        key: 7,
                        span: 24,
                        "element-loading-text": vue.unref(t).loadingText
                    }, {
                        default: vue.withCtx((() => [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(t).current.answer, (e => (vue.openBlock(), vue.createElementBlock("div", null, [ vue.createVNode(d, null, {
                            default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(`${e.form}(${e.duration}ms)`), 1) ])),
                            _: 2
                        }, 1024), "object" == typeof e.answer ? (vue.openBlock(), vue.createElementBlock("div", Ot, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.answer, (e => (vue.openBlock(), 
                        vue.createElementBlock("p", null, [ vue.createVNode(m, {
                            value: e,
                            readonly: "",
                            style: {
                                width: "100%"
                            }
                        }, null, 8, [ "value" ]) ])))), 256)) ])) : (vue.openBlock(), vue.createElementBlock("div", Mt, [ vue.createElementVNode("div", {
                            innerHTML: e.answer ? e.answer : e.msg ?? "\u6682\u65e0\u7b54\u6848"
                        }, null, 8, Dt) ])) ])))), 256)), vue.unref(t).current.aiMsg ? (vue.openBlock(), vue.createElementBlock("div", zt, [ vue.createVNode(d, null, {
                            default: vue.withCtx((() => [ vue.createTextVNode("AI\u56de\u7b54(\u4ec5\u4f9b\u53c2\u8003)") ])),
                            _: 1
                        }), vue.createElementVNode("div", {
                            innerHTML: vue.unref(t).currentAiMd
                        }, null, 8, Bt) ])) : vue.createCommentVNode("", !0) ])),
                        _: 1
                    }, 8, [ "element-loading-text" ])), [ [ $, vue.unref(t).loading ] ]) : vue.createCommentVNode("", !0) ])),
                    _: 1
                }), vue.unref(t).current ? vue.createCommentVNode("", !0) : (vue.openBlock(), vue.createBlock(y, {
                    key: 0,
                    description: "\u6682\u65e0\u9898\u76ee\u6570\u636e"
                })) ], 64);
            };
        }
    }), Vt = vue.createElementVNode("br", null, null, -1), Nt = vue.createElementVNode("br", null, null, -1), Rt = vue.createElementVNode("p", {
        style: {
            color: "red"
        }
    }, "\u4e14\u5e76\u975e\u6240\u6709\u7f51\u7ad9\u90fd\u652f\u6301\uff0c\u9700\u8981\u4f5c\u8005\u9002\u914d\uff0c\u82e5\u60a8\u7684\u5e73\u53f0\u4e0d\u652f\u6301\u53ef\u4ee5\u53cd\u9988\u7ed9\u4f5c\u8005", -1), Wt = vue.createElementVNode("div", {
        class: "el-upload__text"
    }, [ vue.createTextVNode(" \u62d6\u62fd\u5907\u4efd\u6587\u4ef6\u6216 "), vue.createElementVNode("em", null, "\u70b9\u51fb\u4e0a\u4f20"), vue.createTextVNode("\u6062\u590d\u5907\u4efd ") ], -1), Qt = {
        style: {
            "margin-top": "20px",
            "margin-bottom": "20px"
        }
    }, Jt = [ "innerHTML" ], Xt = [ "innerHTML" ], Zt = [ "innerHTML" ], Yt = vue.defineComponent({
        __name: "Question",
        setup(e) {
            const t = vue.ref(0);
            let a;
            window.addEventListener("keydown", (e => {
                "`" === e.key && t.value++;
            }));
            try {
                a = gt.script.updateURL.match(/scripts\/(\d+)/)[1];
            } catch (r) {
                a = wt;
            }
            const s = `https://greasyfork.org/zh-CN/scripts/${a}`, o = St(), i = Cache.match("ques1_"), clearCache = () => {
                Cache.matchRemove("ques1_"), msg("\u6e05\u9664\u6210\u529f", "success");
            }, exportHtml = async e => {
                const t = e.map(((e, t) => {
                    return `\n        <p><a href="${s}">\u7231\u95ee\u7b54\u52a9\u624b</a></p>\n        <p>${t + 1}\u3001[${typeConvert(e.type, !1)}]${e.question}</p>\n        <p>${n = e.options, 
                "object" != typeof n ? "" : n.map(((e, t) => String.fromCharCode(65 + t) + "." + e)).join("<br>")}</p>\n        <p style="color:green;">\u7b54\u6848\uff1a${answerFormat(e.answer)}</p>\n        \n        `;
                    var n;
                })).join("<br/>"), n = new Blob([ `<HtML> <head> <meta charset="utf-8"> <title>\u7231\u95ee\u7b54\u52a9\u624b\u7b54\u6848\u5bfc\u51fa</title> </head> <body> ${t} </body> </HtML>` ], {
                    type: "text/html"
                }), a = document.createElement("a");
                a.href = URL.createObjectURL(n), a.download = "\u7231\u95ee\u7b54\u52a9\u624b.html", 
                a.click();
            }, exportData = async () => {
                const e = Cache.matchGet("ques1_") || [];
                msg("\u6b63\u5728\u6253\u5305\u9898\u76ee\u4e2d\uff0c\u8bf7\u7a0d\u540e", "info");
                const t = await encrypt(JSON.stringify(e)), n = new Blob([ t ], {
                    type: "application/text"
                });
                msg(`\u6253\u5305\u5b8c\u6210\uff0c\u5171\u8ba1${e.length}\u9898,\u51c6\u5907\u4e0b\u8f7d`, "success");
                const a = document.createElement("a");
                a.href = URL.createObjectURL(n);
                const s = (new Date).toLocaleDateString().replace(/\//g, "-");
                a.download = `\u7231\u95ee\u7b54\u52a9\u624b\u5907\u4efd-${s}.bak`, a.click();
            }, exportDocx = async () => {
                exportHtml(o.saveQuestionData);
            }, exportDocx1 = async () => {
                const e = Cache.matchGet("ques1_") || [];
                exportHtml(e);
            }, changeT = e => typeConvert(e.type, !1), answerFormat = e => Array.isArray(e) ? e.join("<br/>") : "string" == typeof e ? e : "object" == typeof e ? JSON.stringify(e) : e, beforeUpload = e => {
                const t = new FileReader;
                return t.onload = async e => {
                    var t;
                    const n = null == (t = e.target) ? void 0 : t.result;
                    try {
                        const t = JSON.parse(await function(t = "", n = "asdgdfghfghfghfg", a = "1234567890123456") {
                            try {
                                return n = n.substring(0, 16), a = a.substring(0, 16), z.AES.decrypt(t, z.enc.Utf8.parse(n), {
                                    iv: z.enc.Utf8.parse(a),
                                    mode: z.mode.CBC,
                                    padding: z.pad.Pkcs7
                                }).toString(z.enc.Utf8);
                            } catch (e) {
                                return addLog("coyptoJs\u5f02\u5e38", "error"), "";
                            }
                        }(n));
                        t.forEach((e => {
                            Answer.cacheAnswer(e);
                        })), msg(`\u9898\u5e93\u5bfc\u5165\u6210\u529f\uff0c\u5171\u8ba1${t.length}\u9898\n            \u8fc7\u591a\u9898\u76ee\u5bfc\u5165\u540e\u9875\u9762\u4f1a\u5361\u4e3b\u8bf7\u76f4\u63a5\u5173\u95ed\u9875\u9762\u91cd\u65b0\u6253\u5f00`, "success");
                    } catch (a) {
                        msg("\u6587\u4ef6\u683c\u5f0f\u9519\u8bef", "error");
                    }
                }, t.readAsText(e), !1;
            };
            return (e, n) => {
                const a = vue.resolveComponent("el-alert"), s = vue.resolveComponent("el-statistic"), r = vue.resolveComponent("el-col"), l = vue.resolveComponent("el-row"), c = vue.resolveComponent("el-upload"), u = vue.resolveComponent("el-button"), p = vue.resolveComponent("el-popconfirm"), h = vue.resolveComponent("el-table-column"), d = vue.resolveComponent("el-table"), m = vue.resolveComponent("el-watermark");
                return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [ vue.createVNode(a, {
                    type: "info",
                    closable: !1
                }, {
                    default: vue.withCtx((() => [ vue.createTextVNode(" \u672c\u811a\u672c\u652f\u6301\u5c06\u5b58\u5728\u7b54\u6848\u7684\u9898\u76ee\u6536\u5f55\u5230\u672c\u5730\uff0c\u4ee5\u4f9b\u540e\u7eed\u7b54\u9898\u68c0\u7d22\uff0c\u53ef\u51cf\u5c11\u63a5\u53e3\u8bf7\u6c42\u6b21\u6570\uff0c\u4ee5\u53ca\u63d0\u9ad8\u7b54\u6848\u6b63\u786e\u7387"), Vt, vue.createTextVNode(" \u5728\u652f\u6301\u91cd\u590d\u7b54\u9898\u4e14\u7b54\u5b8c\u9898\u663e\u793a\u7b54\u6848\u7684\u60c5\u51b5\u4e0b\u53ef\u4ee5\u65e0\u9700\u4f7f\u7528\u63a5\u53e3\u641c\u7d22\u7b54\u6848"), Nt, Rt ])),
                    _: 1
                }), vue.createVNode(m, {
                    content: [ "\u7231\u95ee\u7b54\u52a9\u624b", "AiAskHelper" ]
                }, {
                    default: vue.withCtx((() => [ vue.createVNode(l, {
                        style: {
                            "margin-top": "20px",
                            "margin-bottom": "20px"
                        }
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(r, {
                            span: 24
                        }, {
                            default: vue.withCtx((() => [ vue.createVNode(s, {
                                title: "\u7f13\u5b58\u9898\u76ee\u6570\u91cf",
                                value: vue.unref(i).length
                            }, null, 8, [ "value" ]) ])),
                            _: 1
                        }) ])),
                        _: 1
                    }), vue.createVNode(c, {
                        drag: "",
                        accept: ".bak",
                        "show-file-list": !1,
                        "before-upload": beforeUpload,
                        class: "mb-4"
                    }, {
                        tip: vue.withCtx((() => [])),
                        default: vue.withCtx((() => [ Wt ])),
                        _: 1
                    }), vue.createElementVNode("div", Qt, [ vue.createVNode(p, {
                        title: "\u786e\u5b9a\u8981\u6e05\u7a7a\u672c\u5730\u7f13\u5b58\u5417\uff1f",
                        "confirm-button-text": "\u786e\u5b9a",
                        "cancel-button-text": "\u53d6\u6d88",
                        onConfirm: clearCache,
                        "hide-after": 0
                    }, {
                        reference: vue.withCtx((() => [ vue.createVNode(u, {
                            type: "danger"
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode("\u6e05\u9664\u7f13\u5b58") ])),
                            _: 1
                        }) ])),
                        _: 1
                    }), vue.createVNode(u, {
                        type: "primary",
                        onClick: exportData
                    }, {
                        default: vue.withCtx((() => [ vue.createTextVNode("\u5bfc\u51fa\u5907\u4efd") ])),
                        _: 1
                    }) ]), t.value > 10 ? (vue.openBlock(), vue.createBlock(u, {
                        key: 0,
                        type: "primary",
                        onClick: exportDocx
                    }, {
                        default: vue.withCtx((() => [ vue.createTextVNode("\u5bfc\u51fa\u5f53\u524d") ])),
                        _: 1
                    })) : vue.createCommentVNode("", !0), t.value > 10 ? (vue.openBlock(), vue.createBlock(u, {
                        key: 1,
                        type: "primary",
                        onClick: exportDocx1
                    }, {
                        default: vue.withCtx((() => [ vue.createTextVNode("\u5bfc\u51fa\u6240\u6709") ])),
                        _: 1
                    })) : vue.createCommentVNode("", !0), vue.createVNode(d, {
                        data: vue.unref(o).saveQuestionData,
                        style: {
                            width: "100%"
                        },
                        "empty-text": "\u5f53\u524d\u9875\u6682\u65e0\u6570\u636e"
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(h, {
                            prop: "type",
                            label: "\u9898\u578b",
                            formatter: changeT
                        }), vue.createVNode(h, {
                            prop: "question",
                            label: "\u9898\u76ee"
                        }, {
                            default: vue.withCtx((e => [ vue.createElementVNode("div", {
                                innerHTML: e.row.question
                            }, null, 8, Jt) ])),
                            _: 1
                        }), vue.createVNode(h, {
                            prop: "options",
                            label: "\u9009\u9879"
                        }, {
                            default: vue.withCtx((e => [ vue.createElementVNode("div", {
                                innerHTML: e.row.options.join("<br/>")
                            }, null, 8, Xt) ])),
                            _: 1
                        }), vue.createVNode(h, {
                            prop: "answer",
                            label: "\u7b54\u6848"
                        }, {
                            default: vue.withCtx((e => [ vue.createElementVNode("div", {
                                innerHTML: answerFormat(e.row.answer)
                            }, null, 8, Zt) ])),
                            _: 1
                        }) ])),
                        _: 1
                    }, 8, [ "data" ]) ])),
                    _: 1
                }) ], 64);
            };
        }
    });
 
    var Kt = vue.defineComponent({
        name: "Edit",
        __name: "edit",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M832 512a32 32 0 1 1 64 0v352a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H192v640h640z"
        }), vue.createElementVNode("path", {
            fill: "currentColor",
            d: "m469.952 554.24 52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.44 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.904-331.84a96 96 0 0 1 135.744 0z"
        }) ]))
    }), en = vue.defineComponent({
        name: "Minus",
        __name: "minus",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64"
        }) ]))
    }), tn = vue.defineComponent({
        name: "Plus",
        __name: "plus",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"
        }) ]))
    }), nn = vue.defineComponent({
        name: "Search",
        __name: "search",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704"
        }) ]))
    });
 
    const an = {
        class: "flex justify-right mt-4 mr-10"
    }, sn = vue.defineComponent({
        __name: "QuestionEdit",
        props: {
            ques: {},
            visible: {
                type: Boolean
            }
        },
        emits: [ "handleClose" ],
        setup(e, {emit: t}) {
            const a = e, s = vue.ref(a.visible);
            vue.watch((() => a.visible), (e => {
                s.value = e;
            }));
            const o = t, handleClose = e => {
                o("handleClose"), e();
            }, handleCancel = () => {
                handleClose((() => {
                    s.value = !1;
                }));
            }, handleSave = () => {
                Answer.cacheAnswer(a.ques), Cache.matchRemove(a.ques.key), msg("\u9898\u76ee\u4fee\u6539\u6210\u529f", "success"), 
                handleClose((() => {
                    s.value = !1;
                }));
            }, handleDelete = e => {
                a.ques.options.splice(e, 1), a.ques.answer.includes(a.ques.options[e]) && (a.ques.answer = a.ques.answer.filter((t => t !== a.ques.options[e])));
            }, handleAdd = () => {
                a.ques.options.push("");
            };
            return (e, t) => {
                var n;
                const o = vue.resolveComponent("el-option"), i = vue.resolveComponent("el-select"), r = vue.resolveComponent("el-form-item"), l = vue.resolveComponent("el-input"), c = vue.resolveComponent("el-button"), u = vue.resolveComponent("el-form"), p = vue.resolveComponent("el-dialog");
                return vue.openBlock(), vue.createBlock(p, {
                    modelValue: s.value,
                    "onUpdate:modelValue": t[2] || (t[2] = e => s.value = e),
                    title: `\u9898\u76ee\u7f16\u8f91:[${null == (n = e.ques) ? void 0 : n.type}]`,
                    width: "500",
                    "before-close": handleClose
                }, {
                    default: vue.withCtx((() => [ vue.createVNode(u, null, {
                        default: vue.withCtx((() => [ vue.createVNode(r, {
                            label: "\u9898\u578b"
                        }, {
                            default: vue.withCtx((() => [ vue.createVNode(i, {
                                modelValue: e.ques.type,
                                "onUpdate:modelValue": t[0] || (t[0] = t => e.ques.type = t),
                                placeholder: "\u8bf7\u9009\u62e9"
                            }, {
                                default: vue.withCtx((() => [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(ft), ((e, t) => (vue.openBlock(), vue.createBlock(o, {
                                    key: e,
                                    label: t,
                                    value: e
                                }, {
                                    default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(t), 1) ])),
                                    _: 2
                                }, 1032, [ "label", "value" ])))), 128)) ])),
                                _: 1
                            }, 8, [ "modelValue" ]) ])),
                            _: 1
                        }), vue.createVNode(r, {
                            label: "\u9898\u5e72"
                        }, {
                            default: vue.withCtx((() => [ vue.createVNode(l, {
                                modelValue: e.ques.question,
                                "onUpdate:modelValue": t[1] || (t[1] = t => e.ques.question = t),
                                type: "textarea",
                                autosize: {
                                    minRows: 3,
                                    maxRows: 8
                                }
                            }, null, 8, [ "modelValue" ]) ])),
                            _: 1
                        }), e.ques.options && Array.isArray(e.ques.options) && e.ques.options.length > 0 ? (vue.openBlock(), 
                        vue.createBlock(r, {
                            key: 0,
                            label: "\u9009\u9879"
                        }, {
                            default: vue.withCtx((() => [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.ques.options, ((t, n) => (vue.openBlock(), vue.createElementBlock("div", {
                                key: n,
                                class: "flex mb-4 w-[90%] items-center space-x-2"
                            }, [ vue.createVNode(c, {
                                type: "primary",
                                circle: "",
                                style: {
                                    "flex-shrink": "0"
                                },
                                plain: !e.ques.answer.includes(t),
                                onClick: e => (e => {
                                    a.ques.answer = a.ques.answer.includes(e) ? a.ques.answer.filter((t => t !== e)) : [ ...a.ques.answer, e ], 
                                    a.ques.answer.sort(((e, t) => a.ques.options.indexOf(e) - a.ques.options.indexOf(t)));
                                })(t)
                            }, {
                                default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(String.fromCharCode(65 + n)), 1) ])),
                                _: 2
                            }, 1032, [ "plain", "onClick" ]), vue.createVNode(l, {
                                modelValue: e.ques.options[n],
                                "onUpdate:modelValue": t => e.ques.options[n] = t,
                                class: "option-input flex-grow"
                            }, null, 8, [ "modelValue", "onUpdate:modelValue" ]), vue.createVNode(c, {
                                size: "small",
                                type: 0 == n ? "success" : "danger",
                                icon: vue.unref(0 != n ? en : tn),
                                circle: "",
                                plain: "",
                                onClick: e => 0 != n ? handleDelete(n) : handleAdd()
                            }, null, 8, [ "type", "icon", "onClick" ]) ])))), 128)) ])),
                            _: 1
                        })) : Array.isArray(e.ques.answer) && 0 == e.ques.options.length ? (vue.openBlock(), vue.createBlock(r, {
                            key: 1,
                            label: "\u7b54\u6848"
                        }, {
                            default: vue.withCtx((() => [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.ques.answer, ((t, n) => (vue.openBlock(), vue.createElementBlock("div", {
                                key: n,
                                class: "flex mb-4 w-[90%] items-center space-x-2"
                            }, [ vue.createVNode(l, {
                                modelValue: e.ques.answer[n],
                                "onUpdate:modelValue": t => e.ques.answer[n] = t,
                                class: "option-input flex-grow"
                            }, null, 8, [ "modelValue", "onUpdate:modelValue" ]), vue.createVNode(c, {
                                size: "small",
                                type: 0 == n ? "success" : "danger",
                                icon: vue.unref(0 != n ? en : tn),
                                circle: "",
                                plain: "",
                                onClick: e => 0 != n ? handleDelete(n) : handleAdd()
                            }, null, 8, [ "type", "icon", "onClick" ]) ])))), 128)) ])),
                            _: 1
                        })) : vue.createCommentVNode("", !0), vue.createElementVNode("div", an, [ vue.createVNode(c, {
                            type: "danger",
                            onClick: handleCancel
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode("\u53d6\u6d88") ])),
                            _: 1
                        }), vue.createVNode(c, {
                            type: "primary",
                            onClick: handleSave
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode("\u4fdd\u5b58") ])),
                            _: 1
                        }) ]) ])),
                        _: 1
                    }) ])),
                    _: 1
                }, 8, [ "modelValue", "title" ]);
            };
        }
    }), on = vue.createElementVNode("br", null, null, -1), rn = vue.createElementVNode("p", {
        style: {
            color: "red"
        }
    }, "\u5f53\u7f13\u5b58\u9898\u76ee\u8fc7\u591a\u65f6\u53ef\u80fd\u4f1a\u51fa\u73b0\u5361\u987f\u5d29\u6e83\u7b49\u60c5\u51b5", -1), ln = vue.createElementVNode("br", null, null, -1), cn = vue.createElementVNode("br", null, null, -1), un = [ "innerHTML" ], pn = {
        key: 0
    }, hn = [ vue.createElementVNode("p", null, "\u5f53\u524d\u9898\u578b\u6682\u65f6\u65e0\u6cd5\u663e\u793a", -1) ], dn = {
        key: 1
    }, mn = [ "innerHTML" ], fn = {
        key: 2
    }, yn = {
        key: 3
    }, gn = [ "innerHTML" ], wn = {
        key: 4
    }, vn = [ "innerHTML" ], bn = {
        key: 5
    }, kn = {
        style: {
            "text-align": "right"
        }
    }, xn = {
        class: "el-dropdown-link"
    }, _n = vue.defineComponent({
        __name: "Preview",
        setup(e) {
            const t = vue.ref(Cache.matchGet("ques1_") || []), a = vue.ref(!1), s = vue.ref(""), o = vue.ref(1), i = vue.ref(10), r = function(e) {
                const t = new Blob([ `(${e.toString()})()` ], {
                    type: "application/javascript"
                }), n = URL.createObjectURL(t);
                return new Worker(n);
            }((() => {
                self.importScripts("https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/fuse.js/6.5.3/fuse.min.js"), 
                self.onmessage = function(e) {
                    const {data: t, options: n} = e.data, a = new Fuse(t, n).search(e.data.keyword).map((e => e.item));
                    a.forEach((t => {
                        t.question1 = t.question, e.data.keyword.split("").forEach((e => {
                            /[\u4e00-\u9fa5a-zA-Z0-9]/.test(e) && (t.question1 = t.question1.replace(new RegExp(e, "g"), `<span style="color:red">${e}</span>`));
                        }));
                    })), self.postMessage(a);
                };
            })), l = vue.computed((() => {
                const e = (o.value - 1) * i.value, n = e + i.value;
                return t.value.slice(e, n);
            })), cl_img_format = e => {
                if (!e.trim()) return e;
                return e.replace(/<img\b(?!.*?\breferrerPolicy\b)[^>]*>/gi, (e => e.replace(/\/?>$/, ' referrerPolicy="no-referrer">')));
            }, c = vue.computed((() => t.value.length)), getOptionIndex = e => String.fromCharCode(65 + e), handlePageChange = e => {
                o.value = e;
            }, search = () => {
                const e = {
                    keys: [ "question" ],
                    threshold: .3
                }, n = s.value.trim();
                a.value = !0, n ? (r.onmessage = e => {
                    const n = e.data;
                    t.value = n, a.value = !1, o.value = 1;
                }, r.postMessage({
                    data: Cache.matchGet("ques1_"),
                    options: e,
                    keyword: n
                })) : (t.value = Cache.matchGet("ques1_") || [], a.value = !1, o.value = 1);
            }, u = vue.ref(null), p = vue.ref(!1), handleClose = () => {
                p.value = !1;
            };
            return (e, n) => {
                const r = vue.resolveComponent("el-alert"), h = vue.resolveComponent("el-button"), d = vue.resolveComponent("el-input"), m = vue.resolveComponent("el-row"), f = vue.resolveComponent("el-tag"), y = vue.resolveComponent("el-icon"), U = vue.resolveComponent("el-dropdown-item"), E = vue.resolveComponent("el-dropdown-menu"), $ = vue.resolveComponent("el-dropdown"), L = vue.resolveComponent("el-col"), I = vue.resolveComponent("el-card"), P = vue.resolveComponent("el-watermark"), O = vue.resolveComponent("el-pagination"), M = vue.resolveDirective("loading");
                return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [ vue.createVNode(sn, {
                    visible: p.value,
                    ques: u.value,
                    onHandleClose: handleClose
                }, null, 8, [ "visible", "ques" ]), vue.createVNode(r, {
                    type: "info",
                    closable: !1
                }, {
                    default: vue.withCtx((() => [ vue.createTextVNode(" \u672c\u5730\u9898\u5e93\u652f\u6301\u9884\u89c8\u3001\u5bfc\u51fa\u3001\u641c\u7d22\u7b49\u529f\u80fd\u3002\u641c\u7d22\u4ec5\u652f\u6301\u9898\u76ee\u5173\u952e\u8bcd\uff0c\u540e\u7eed\u4f1a\u589e\u52a0\u9009\u9879\u641c\u7d22\u7b49\u529f\u80fd"), on, rn ])),
                    _: 1
                }), ln, vue.createVNode(m, null, {
                    default: vue.withCtx((() => [ vue.createVNode(d, {
                        modelValue: s.value,
                        "onUpdate:modelValue": n[0] || (n[0] = e => s.value = e),
                        style: {
                            "max-width": "600px"
                        },
                        placeholder: "\u8f93\u5165\u5173\u952e\u8bcd\u5339\u914d\u641c\u7d22",
                        class: "input-with-select",
                        onInput: search
                    }, {
                        append: vue.withCtx((() => [ vue.createVNode(h, {
                            icon: vue.unref(nn)
                        }, null, 8, [ "icon" ]) ])),
                        _: 1
                    }, 8, [ "modelValue" ]) ])),
                    _: 1
                }), cn, vue.withDirectives((vue.openBlock(), vue.createBlock(P, {
                    content: [ "\u7231\u95ee\u7b54\u52a9\u624b", "AiAskHelper" ]
                }, {
                    default: vue.withCtx((() => [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(l.value, ((e, n) => (vue.openBlock(), vue.createBlock(I, {
                        key: n,
                        class: "question-card"
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(L, {
                            span: 24
                        }, {
                            default: vue.withCtx((() => [ vue.createElementVNode("div", {
                                class: "aah_title",
                                innerHTML: "[" + vue.unref(typeConvert)(e.type ?? "", !1) + "]" + cl_img_format(e.question1 || e.question)
                            }, null, 8, un), e.options.length > 0 && "object" == typeof e.options[0] ? (vue.openBlock(), 
                            vue.createElementBlock("div", pn, hn)) : (vue.openBlock(), vue.createElementBlock("div", dn, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, ((t, n) => (vue.openBlock(), 
                            vue.createElementBlock("p", {
                                key: n,
                                style: vue.normalizeStyle(e.answer.includes(t) ? "color:green;" : ""),
                                class: "aah_options",
                                innerHTML: getOptionIndex(n) + ". " + cl_img_format(t)
                            }, null, 12, mn)))), 128)) ])), Array.isArray(e.answer) && 0 == e.options.length ? (vue.openBlock(), 
                            vue.createElementBlock("div", fn, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.answer, ((e, t) => (vue.openBlock(), vue.createElementBlock("p", {
                                key: t,
                                class: "m-2"
                            }, [ vue.createVNode(f, {
                                type: "info",
                                effect: "dark"
                            }, {
                                default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(e), 1) ])),
                                _: 2
                            }, 1024) ])))), 128)) ])) : e.options ? "string" == typeof e.answer ? (vue.openBlock(), vue.createElementBlock("div", wn, [ vue.createElementVNode("div", {
                                innerHTML: cl_img_format(e.answer)
                            }, null, 8, vn) ])) : (vue.openBlock(), vue.createElementBlock("div", bn)) : (vue.openBlock(), vue.createElementBlock("div", yn, [ vue.createElementVNode("div", {
                                innerHTML: e.answer ? cl_img_format(e.answer) : "\u6682\u65e0\u7b54\u6848"
                            }, null, 8, gn) ])), vue.createElementVNode("div", kn, [ vue.createVNode($, null, {
                                dropdown: vue.withCtx((() => [ vue.createVNode(E, null, {
                                    default: vue.withCtx((() => [ vue.createVNode(U, {
                                        onClick: t => (e => {
                                            u.value = e, p.value = !0;
                                        })(e)
                                    }, {
                                        default: vue.withCtx((() => [ vue.createTextVNode("\u7f16\u8f91") ])),
                                        _: 2
                                    }, 1032, [ "onClick" ]), vue.createVNode(U, {
                                        onClick: n => (e => {
                                            t.value = t.value.filter((t => t.key !== e.key)), Cache.matchRemove(e.key);
                                        })(e)
                                    }, {
                                        default: vue.withCtx((() => [ vue.createTextVNode("\u5220\u9664") ])),
                                        _: 2
                                    }, 1032, [ "onClick" ]) ])),
                                    _: 2
                                }, 1024) ])),
                                default: vue.withCtx((() => [ vue.createElementVNode("span", xn, [ vue.createVNode(y, null, {
                                    default: vue.withCtx((() => [ vue.createVNode(vue.unref(Kt)) ])),
                                    _: 1
                                }) ]) ])),
                                _: 2
                            }, 1024) ]) ])),
                            _: 2
                        }, 1024) ])),
                        _: 2
                    }, 1024)))), 128)) ])),
                    _: 1
                })), [ [ M, a.value ] ]), vue.createVNode(O, {
                    size: "small",
                    background: "",
                    layout: "prev, pager, next",
                    total: c.value,
                    "page-size": i.value,
                    "current-page": o.value,
                    "onUpdate:currentPage": n[1] || (n[1] = e => o.value = e),
                    onCurrentChange: handlePageChange,
                    class: "mt-4"
                }, null, 8, [ "total", "page-size", "current-page" ]) ], 64);
            };
        }
    }), qn = vue.defineComponent({
        __name: "Log",
        setup(e) {
            const t = xt(), getColor = e => {
                switch (e) {
                  case "warn":
                    return "orange";
 
                  case "error":
                    return "red";
 
                  case "success":
                    return "green";
 
                  default:
                    return "blue";
                }
            };
            return (e, n) => {
                const a = vue.resolveComponent("el-table-column"), s = vue.resolveComponent("el-table");
                return vue.openBlock(), vue.createBlock(s, {
                    data: vue.unref(t).logs,
                    style: {
                        width: "100%"
                    }
                }, {
                    default: vue.withCtx((() => [ vue.createVNode(a, {
                        prop: "time",
                        label: "\u65f6\u95f4",
                        width: "180"
                    }, {
                        default: vue.withCtx((({row: e}) => [ vue.createElementVNode("span", null, vue.toDisplayString(e.time), 1) ])),
                        _: 1
                    }), vue.createVNode(a, {
                        prop: "content",
                        label: "\u5185\u5bb9"
                    }, {
                        default: vue.withCtx((({row: e}) => [ vue.createElementVNode("span", {
                            style: vue.normalizeStyle({
                                color: getColor(e.type)
                            })
                        }, vue.toDisplayString(e.content), 5) ])),
                        _: 1
                    }) ])),
                    _: 1
                }, 8, [ "data" ]);
            };
        }
    }), Cn = defineStore("ai", {
        state: () => ({
            aiMsg: "",
            aiLoading: !1
        }),
        actions: {
            currentAiMd() {
                const e = B({
                    highlight: (t, n) => `<pre><code class="hljs">${e.utils.escapeHtml(t)}</code></pre>`,
                    html: !0,
                    breaks: !0,
                    linkify: !0
                }), t = e.renderer.rules.link_open || ((e, t, n, a, s) => s.renderToken(e, t, n));
                return e.renderer.rules.link_open = (e, n, a, s, o) => {
                    const i = e[n].attrIndex("target");
                    return i < 0 ? (e[n].attrPush([ "target", "_blank" ]), e[n].attrPush([ "rel", "noopener noreferrer" ])) : e[n].attrs[i][1] = "_blank", 
                    t(e, n, a, s, o);
                }, e.render(this.aiMsg);
            },
            resetAi() {
                this.aiMsg = "", this.aiLoading = !1;
            }
        }
    }), Tn = [ "innerHTML" ], An = vue.createElementVNode("h2", null, "\u7231\u95ee\u7b54\u5b98\u65b9\u9898\u5e93\u5f00\u53d1\u4e2d...", -1), Sn = [ "innerHTML" ], Un = vue.defineComponent({
        __name: "Ai",
        setup(e) {
            let t = getApp(), a = t.gpt[t.gptIndex];
            const s = Cn(), o = vue.ref(""), search = async () => {
                if (o.value) {
                    if (s.resetAi(), "2" === r.value) return s.aiMsg = "\u7231\u95ee\u7b54\u5b98\u65b9\u9898\u5e93\u5f00\u53d1\u4e2d...", 
                    void msg("\u7231\u95ee\u7b54\u5b98\u65b9\u9898\u5e93\u5f00\u53d1\u4e2d...");
                    s.aiLoading = !0;
                    try {
                        await aiAsk(o.value, (e => {
                            s.aiLoading = !1, s.aiMsg += e, console.log(s.aiMsg);
                        }), (() => {
                            s.aiMsg.length <= 0 && (s.aiMsg = a.msg);
                        }));
                    } catch (e) {
                        console.error("AI\u68c0\u7d22\u8d85\u65f6\uff0c\u53ef\u80fd\u662f\u7f51\u7edc\u95ee\u9898\u6216\u8005\u5bf9\u5e94GPT\u7684cookie\u5931\u6548", e), 
                        s.aiMsg = a.msg;
                    } finally {
                        s.aiLoading = !1;
                    }
                }
            }, i = [ {
                label: "AI\u68c0\u7d22",
                value: "1",
                key: "ai"
            }, {
                label: "\u7231\u95ee\u7b54\u9898\u5e93",
                value: "2",
                key: "ask"
            } ], r = vue.ref("1");
            return (e, t) => {
                const n = vue.resolveComponent("el-input"), l = vue.resolveComponent("el-col"), c = vue.resolveComponent("el-row"), u = vue.resolveComponent("el-radio"), p = vue.resolveComponent("el-radio-group"), h = vue.resolveComponent("el-button"), d = vue.resolveComponent("el-card"), m = vue.resolveDirective("loading");
                return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [ vue.createVNode(c, null, {
                    default: vue.withCtx((() => [ vue.createVNode(l, {
                        span: 24
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(n, {
                            modelValue: o.value,
                            "onUpdate:modelValue": t[0] || (t[0] = e => o.value = e),
                            type: "textarea",
                            placeholder: "\u8bf7\u8f93\u5165\u9898\u76ee\u6216\u95ee\u9898",
                            rows: 4
                        }, null, 8, [ "modelValue" ]) ])),
                        _: 1
                    }) ])),
                    _: 1
                }), vue.createVNode(c, null, {
                    default: vue.withCtx((() => [ vue.createVNode(l, {
                        span: 24
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(p, {
                            modelValue: r.value,
                            "onUpdate:modelValue": t[1] || (t[1] = e => r.value = e),
                            size: "small"
                        }, {
                            default: vue.withCtx((() => [ (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(i, (e => vue.createVNode(u, {
                                value: e.value,
                                key: e.value
                            }, {
                                default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(e.label), 1) ])),
                                _: 2
                            }, 1032, [ "value" ]))), 64)) ])),
                            _: 1
                        }, 8, [ "modelValue" ]) ])),
                        _: 1
                    }) ])),
                    _: 1
                }), vue.createVNode(c, {
                    style: {
                        "margin-bottom": "15px"
                    }
                }, {
                    default: vue.withCtx((() => [ vue.createVNode(l, {
                        span: 24
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(h, {
                            type: "primary",
                            size: "large",
                            icon: "el-icon-search",
                            style: {
                                width: "100%"
                            },
                            onClick: search
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode(" \u641c\u7d22 ") ])),
                            _: 1
                        }) ])),
                        _: 1
                    }) ])),
                    _: 1
                }), "1" === r.value ? (vue.openBlock(), vue.createBlock(d, {
                    key: 0,
                    shadow: "hover",
                    style: {
                        "margin-bottom": "15px"
                    }
                }, {
                    default: vue.withCtx((() => [ vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", null, [ vue.createElementVNode("div", {
                        innerHTML: vue.unref(s).currentAiMd() || "AI\u7b54\u9898\u4ec5\u4f9b\u53c2\u8003\uff0c\u4e0d\u4fdd\u8bc1\u51c6\u786e\u6027"
                    }, null, 8, Tn) ])), [ [ m, vue.unref(s).aiLoading ] ]) ])),
                    _: 1
                })) : vue.createCommentVNode("", !0), "2" === r.value ? (vue.openBlock(), vue.createBlock(d, {
                    key: 1,
                    shadow: "hover",
                    style: {
                        "margin-bottom": "15px"
                    }
                }, {
                    default: vue.withCtx((() => [ An ])),
                    _: 1
                })) : vue.createCommentVNode("", !0), "1" === r.value ? (vue.openBlock(), vue.createBlock(d, {
                    key: 2,
                    shadow: "hover",
                    style: {
                        "margin-bottom": "15px"
                    }
                }, {
                    default: vue.withCtx((() => [ vue.createElementVNode("div", {
                        innerHTML: vue.unref(markToHtml)(`\u5f53\u524d\u91c7\u7528\u7684\u662f ${vue.unref(a).name} \u670d\u52a1\uff0c\u4ec5\u4f9b\u6d4b\u8bd5\u4f7f\u7528\uff0c\u4e0d\u4fdd\u8bc1\u51c6\u786e\u6027\u3002\n    \u5982\u6709\u4fb5\u6743\uff0c\u8bf7\u8054\u7cfb\u6211\u4eec\u5220\u9664\u3002\n    \u8bf7\u5927\u5bb6\u591a\u591a\u652f\u6301\u5b98\u65b9\uff1a${vue.unref(a).home}`)
                    }, null, 8, Sn) ])),
                    _: 1
                })) : vue.createCommentVNode("", !0) ], 64);
            };
        }
    }), mk_block = (e, t = "\n\n", n) => {
        var a = new String(e);
        return a.trailing = t, a.lineNumber = n, (a = a.substr(0, 1).toUpperCase() + a.substr(1)).replace(/^([A-H]|\d+|\s+\d)[\u3001|\uff0e|\s\.|\s\uff0e|:|\uff1a]/, "$1.");
    }, getlineDetail = e => {
        for (var t = [], n = [ {
            key: "default",
            reg: /\*/
        }, {
            key: "title",
            reg: /^\s*(([0-9]+\.))\s*(.*?)\s*(?:\n|$)/
        }, {
            key: "answer",
            reg: /^\s*((\[|\u3010?)(\u6b63\u786e|\u53c2\u8003|\u6807\u51c6|)\u7b54\u6848(\]|\u3011|\s+|)[:\uff1a\s])\s*(.*?)\s*(?:\n|$)/
        }, {
            key: "analysis",
            reg: /^\s*(((\[|\u3010?)(\u8bd5\u9898|\u7b54\u6848?|)\u89e3\u6790(\]|\u3011|\s+|))[:\uff1a\s])\s*(.*?)\s*(?:\n|$)/
        }, {
            key: "options_A",
            reg: /^\s*([A])(\.)\s*(.*?)\s*(?:\n|$)/
        }, {
            key: "options_B",
            reg: /^\s*([B])(\.)\s*(.*?)\s*(?:\n|$)/
        }, {
            key: "options_C",
            reg: /^\s*([C])(\.)\s*(.*?)\s*(?:\n|$)/
        }, {
            key: "options_D",
            reg: /^\s*([D])(\.)\s*(.*?)\s*(?:\n|$)/
        }, {
            key: "options_E",
            reg: /^\s*([E])(\.)\s*(.*?)\s*(?:\n|$)/
        }, {
            key: "options_F",
            reg: /^\s*([F])(\.)\s*(.*?)\s*(?:\n|$)/
        }, {
            key: "options_G",
            reg: /^\s*([G])(\.)\s*(.*?)\s*(?:\n|$)/
        }, {
            key: "options_H",
            reg: /^\s*([H])(\.)\s*(.*?)\s*(?:\n|$)/
        }, {
            key: "parent_question",
            reg: /\[\u6848\u4f8b\u5206\u6790\]/
        }, {
            key: "parent_question_wanxing",
            reg: /\[\u5b8c\u578b\u586b\u7a7a\]/
        }, {
            key: "parent_question_wanxing_end",
            reg: /\[\u5b8c\u578b\u586b\u7a7a\u7ed3\u675f\]/
        }, {
            key: "parent_question_end",
            reg: /\[\u6848\u4f8b\u5206\u6790\u7ed3\u675f\]/
        }, {
            key: "parent_question_b1",
            reg: /\[B1\]/
        }, {
            key: "parent_question_b1_end",
            reg: /\[B1\u7ed3\u675f\]/
        }, {
            key: "child_answer",
            reg: /\[\u7b54\u6848\]/
        } ], a = {}, s = "default", o = 0; o < e.length; o++) {
            var i = e[o], r = !1;
            (i.match(n[1].reg) || i.match(/\[\u6848\u4f8b\u5206\u6790\]/) || i.match(/\[\u5b8c\u578b\u586b\u7a7a\]/) || i.match(/\[B1\]/)) && a.title && (t.push(a), 
            a = {});
            for (var l = 0; l < n.length; l++) {
                var c = n[l];
                if (i.match(c.reg)) {
                    a[s = c.key] && (a.data_err = i), a[s] = i, r = !0;
                    break;
                }
                r = !1;
            }
            r || (a[s] = (a[s] || "") + "\n" + i);
        }
        return a.title && t.push(a), (e => {
            var t = !1, n = "", a = !1, s = "", o = [], i = "", r = !1;
            return e.forEach((function(e) {
                if (e.parent_question && (i = e.parent_question, r = !0, e.is_first_child = "1"), 
                r && (a = !1, t = !1, e.is_anli = "1", e.is_anli_child = "1", e.is_wanxing_child = "", 
                e.is_b1_child = "", e.parent_question = i), e.parent_question_end && (r = !1, i = ""), 
                e.parent_question_wanxing && (n = e.parent_question_wanxing, t = !0, e.is_first_child = "1"), 
                t && (r = !1, a = !1, e.is_anli_child = "", e.is_b1_child = "", e.is_wanxing_child = "1", 
                e.title += "\u586b\u7a7a\uff08" + e.title.substr(0, e.title.length - 1) + "\uff09", 
                e.parent_question_wanxing = n), e.parent_question_wanxing_end && (t = !1, n = ""), 
                e.parent_question_b1) {
                    for (var l in o = [], e) if (Object.hasOwnProperty.call(e, l)) {
                        var c = e[l];
                        if (l.indexOf("options_") > -1) {
                            var u = {};
                            u[l] = c, o.push(u);
                        }
                    }
                    a = !0, t = !1, r = !1, e.is_first_child = "1";
                }
                a && (r = !1, t = !1, e.is_b1_child = "1", e.is_wanxing_child = "", e.is_anli_child = "", 
                e.parent_question_b1 = s, o.forEach((function(t) {
                    Object.assign(e, t);
                }))), e.parent_question_b1_end && (a = !1, s = "");
            })), e;
        })(t);
    }, Hn = {
        title: /^\s*([0-9]+\.)/,
        answer: /(&nbsp;)*\s*(\[|\u3010?)(\u7b54\u6848|\u6b63\u786e\u7b54\u6848|\u53c2\u8003\u7b54\u6848|\u6807\u51c6\u7b54\u6848)(\]|\u3011|\s+|)[:\uff1a\s]/,
        analysis: /(&nbsp;)*\s*(\[|\u3010?)(\u8bd5\u9898|\u7b54\u6848?|)\u89e3\u6790(\]|\u3011|\s+|)[:\uff1a\s]/,
        options_A: /A./,
        options_B: /B./,
        options_C: /C./,
        options_D: /D./,
        options_E: /E./,
        options_F: /F./,
        options_G: /G./,
        options_H: /H./
    }, En = /^\s*(\u6b63\u786e|\u9519\u8bef|\u5bf9|\u9519|\u221a|\xd7|\u2713|X|x|T|F|true|TRUE|FALSE|false|YES|yes|NO|no|N|Y|n|y)\s*(?:\n|$)/i, Fn = [ "A", "B", "C", "D", "E", "F", "G", "H" ], calcStatus = e => {
        if (e.title_value && (e.title_value = e.title_value.trim()), !e.title || e.title_value || e.parent_question) if (e.data_err) e.err_text = "\u8bf7\u68c0\u67e5\u8bd5\u9898\u5185\u5bb9"; else {
            var t = e.title_value, n = [ "A", "B", "C", "D", "E", "F", "G", "H" ];
            if (t) {
                if (e.qtype = "5", !e.answer_value && e.options_A && (e.title, e.title_value = e.title_value.replace(/[\(\uff08](\s*.*?)[\uff09\)]/gm, (function(t, n, a, s, o, i, r, l) {
                    return (n = n.replace(/\s/g, "")) ? /[\u4e00-\u9fa5]|\d/.test(n.trim()) ? t : (e.answer = "\u7b54\u6848\uff1a" + n.trim().replace(/(\s|\u3001|\uff0c|,)/g, ""), 
                    e.answer_value = n.trim().replace(/(\s|\u3001|\uff0c|,)/g, ""), "(    )") : t;
                }))), e.answer_value || (e.title, e.title_value = e.title_value.replace(e.options_A ? /^(\s*.*?)([A-Ha-h\u5bf9\u9519\u2713\u221a\xd7XxvVTFtrueTRUEFALSEfalseYESyesNOnoNYny\u6b63\u786e\u9519\u8bef,\uff0c\u3001]{1,8})$/gm : /^(\s*.*?)(\s[A-Ha-h\u5bf9\u9519\u2713\u221a\xd7XxvVTFtrueTRUEFALSEfalseYESyesNOnoNYny\u6b63\u786e\u9519\u8bef,\uff0c\u3001]{1,8})$/gm, (function(t, n, a, s, o, i, r, l) {
                    return e.answer = "\u7b54\u6848\uff1a" + a.trim().replace(/(\u3001|\uff0c|,)/g, ""), 
                    e.answer_value = a.trim().replace(/(\u3001|\uff0c|,)/g, ""), n;
                }))), !e.answer_value) {
                    for (var a = [], s = 0; s < n.length; s++) {
                        var o = n[s];
                        e["options_" + o] && e["options_" + o].match(/[\(\uff08](\s*[\(\u5bf9\)\(\u6b63\u786e\)\(\u7b54\u6848\)\(\u6b63\u786e\u7b54\u6848\)]+\s*)[\uff09\)]/) && (a.push(o), 
                        e["options_" + o + "_value"] = e["options_" + o + "_value"].replace(/[\(\uff08](\s*[\(\u5bf9\)\(\u6b63\u786e\)\(\u7b54\u6848\)\(\u6b63\u786e\u7b54\u6848\)]+\s*)[\uff09\)]/, (function(e, t, n, a, s) {
                            return "";
                        })));
                    }
                    a.length > 0 && (e.answer_value = a.join(""));
                }
                if (!e.answer_value && !e.options_A && t.match(/[\(\uff08](.+?)[\uff09\)]/gm)) {
                    var i = "", r = e.title_value.match(/[\(\uff08](.+?)[\uff09\)]/gm);
                    r && r.forEach((function(e, t) {
                        var n = e.match(/[\(\uff08](.+?)[\uff09\)]/);
                        "" != n[1].trim() && (n[1] = n[1].trim(), i += n[1] + (t == r.length - 1 ? "" : "|"));
                    })), e.answer_value = i, e.answer = "\u7b54\u6848\uff1a" + i, e.qtype = "4", e.title_value = e.title_value.replace(/[\(\uff08](.+?)[\uff09\)]/gm, (function() {
                        return "\uff08\u3000\u3000\u3000\uff09";
                    }));
                }
                e.answer_value && (e.answer_value = e.answer_value.trim()), e.title_no = e.title.match(Hn.title)[1], 
                t.match(/([\(|\uff08]\s*[\)|\uff09])/g) && (e.qtype = "4"), t.match(/(___)/g) && (e.qtype = "4");
                for (var l = !1, c = [], u = 0; u < n.length; u++) {
                    var p = n[u];
                    e["options_" + p] && (l = !0, c.push(e["options_" + p]));
                }
                if (l && e.answer_value && (e.answer_value = e.answer_value.replace(/\uff0c|\.|,|\u3002|\uff1b|\s+|\u3001|\//g, "")), 
                !l && En.test(e.answer_value) && (e.qtype = "3"), l || En.test(e.answer_value) || e.qtype || (e.qtype = "5"), 
                l && e.answer_value && "1" == e.answer_value.length && (e.qtype = "1"), l && e.answer_value && e.answer_value.length > 1 && (e.qtype = "2"), 
                l && !e.answer_value && (e.qtype = "1"), l && e.answer_value) {
                    if (e.answer_value = e.answer_value.replace(/\uff0c|\.|,|\u3002|\uff1b|\s+|\u3001|\//g, ""), 
                    !/^[A-Ha-h]{1,8}$/g.test(e.answer_value)) return void (e.err_text = "\u7b54\u6848\u4e0d\u6b63\u786e");
                    if (new Set(e.answer_value).size != e.answer_value.length) return void (e.err_text = "\u7b54\u6848\u5305\u542b\u91cd\u590d\u9879");
                    var h = e.answer_value.split("").sort(), d = Fn.indexOf(h[h.length - 1].toUpperCase());
                    if (-1 == d) return void (e.err_text = "\u7b54\u6848\u4e0d\u6b63\u786e");
                    for (var m = 0; m < d + 1; m++) if (!e["options_" + n[m]]) return void (e.err_text = "\u7b54\u6848\u4e0d\u5728\u9009\u9879\u4e2d");
                }
                if (e.title_value) if (e.title_value.length < 2) e.err_text = "\u9898\u5e72\u81f3\u5c11\u4e24\u4e2a\u5b57"; else if (e.answer_value) {
                    if ([ "1", "2", "14", "15" ].indexOf(e.qtype) > -1) {
                        var f = [];
                        if (Fn.forEach((function(t) {
                            e["options_" + t + "_value"] && f.push(t);
                        })), f.length < 2) return void (e.err_text = "\u9009\u9879\u81f3\u5c11\u6709\u4e24\u4e2a");
                        f.sort();
                        var y = Fn[f.length - 1], g = f.indexOf(y);
                        if (f.length != g + 1) return void (e.err_text = "\u8bf7\u68c0\u67e5\u9009\u9879\u5185\u5bb9");
                    }
                    if ("4" == e.qtype && e.answer_value) {
                        var w = e.title_value.match(/([\(|\uff08]\s*[\)|\uff09])/g), v = e.answer_value.replace(/\s/g, "").split("|").length;
                        if (w && w.length != v) return void (e.err_text = "\u7b54\u6848\u548c\u7a7a\u6570\u91cf\u4e0d\u5339\u914d");
                    }
                    "3" == e.qtype && e.answer_value && /\n/.test(e.answer_value) ? e.err_text = "\u5224\u65ad\u9898\u7b54\u6848\u4e0d\u6b63\u786e" : (e.title_value.indexOf("[\u8ba1\u7b97\u9898]") > -1 && (e.qtype = 12), 
                    e.title_value.indexOf("[\u8bba\u8ff0\u9898]") > -1 && (e.qtype = 11), e.title_value.indexOf("[\u4e0d\u5b9a\u9879\u9009\u62e9\u9898]") > -1 && (e.qtype = 14), 
                    e.title_value.indexOf("[\u5224\u65ad\u9898]") > -1 && (e.qtype = 3), e.title_value.indexOf("[\u586b\u7a7a\u9898]") > -1 && (e.qtype = 4));
                } else e.err_text = "\u8bd5\u9898\u6ca1\u6709\u7b54\u6848"; else e.err_text = "\u8bd5\u9898\u6ca1\u6709\u9898\u5e72";
            }
        } else e.err_text = e.title + "\u9898\u5e72\u4e0d\u6b63\u786e";
    }, jn = {
        1: "\u5355\u9009\u9898",
        2: "\u591a\u9009\u9898",
        3: "\u5224\u65ad\u9898",
        4: "\u586b\u7a7a\u9898",
        5: "\u7b80\u7b54\u9898",
        9: "\u6848\u4f8b\u9898",
        11: "\u8bba\u8ff0\u9898",
        12: "\u8ba1\u7b97\u9898",
        14: "\u4e0d\u5b9a\u9879\u9009\u62e9\u9898",
        15: "\u6392\u5e8f\u9898"
    }, questionParse = e => {
        const t = (e => {
            e = (e = e.replace(/(\r\n|\n|\r)/g, "\n").replace(/\*/g, "&#8727;").replace(/<span style="letter-spacing: -0.35px;">/g, "").replace(/<\/span>/g, "").replace(/(\u0020)|(\u0009)|(\u200B)|(\u00A0)|(\u200E)|(\u200F)|(\u2029)/g, " ")).replace(/(\s)+([A-H])([\u3001\uff0c,\uff0e]|\.)/gi, "\n$2$3");
            var t, n = /([\s\S]+?)($|\n#|\n(?:\s*\n|$)*)/g, a = [];
            for (null != (t = /^(\s*\n)/.exec(e)) && (n.lastIndex = t[0].length); null !== (t = n.exec(e)); ) "\n#" == t[2] && (t[2] = "\n", 
            n.lastIndex--), a.push(mk_block(t[1], t[2], 1));
            return a;
        })(e), n = (e => {
            e.length;
            for (var t = {}, n = 0; n < e.length; n++) {
                var a = e[n];
                for (var s in a) if (Object.hasOwnProperty.call(a, s)) {
                    var o = a[s];
                    o = o.replace(Hn[s], ""), a[s + "_value"] = o.replace("[\u6848\u4f8b\u5206\u6790]", "");
                }
                calcStatus(a), t["".concat(a.qtype)] ? t["".concat(a.qtype)]++ : t["".concat(a.qtype)] = 1, 
                a.err_text;
            }
            return e;
        })(getlineDetail(t));
        return n.forEach((e => {
            e.qtype = jn[e.qtype] || "\u5176\u4ed6";
        })), JSON.parse(JSON.stringify(n));
    }, $n = {
        class: "mt-4"
    }, Ln = {
        class: "mb-4"
    }, In = {
        class: "import_question"
    }, Pn = {
        class: "m-3"
    }, On = {
        class: "mb-2"
    }, Mn = {
        key: 0,
        class: "mt-2 mb-2"
    }, Dn = vue.defineComponent({
        __name: "QuestionTool",
        setup(e) {
            vue.ref(Cache.matchGet("ques1_") || []);
            const t = vue.ref([]), a = vue.ref(""), handleKeydown = () => {
                t.value = questionParse(a.value);
            }, extractOptions = e => {
                const t = [];
                for (let n = 0; n < 10; n++) {
                    const a = `options_${String.fromCharCode(65 + n)}_value`;
                    e[a] && t.push({
                        label: e[a],
                        value: String.fromCharCode(65 + n),
                        isTrue: e.answer_value && e.answer_value.includes(String.fromCharCode(65 + n))
                    });
                }
                return t;
            }, importQuestion = () => {
                const e = t.value.filter((e => !e.err_text)).map((e => {
                    const t = typeConvert(e.qtype), n = extractOptions(e), a = {
                        type: t,
                        question: titleClean(removeHtml(e.title_value)),
                        options: n.map((e => removeHtml(e.label))),
                        answer: e.answer_value
                    };
                    switch (t) {
                      case "0":
                      case "1":
                        a.answer = n.filter((e => e.isTrue)).map((e => removeHtml(e.label))), 2 === a.options.length && 0 !== judgeAnswer(a.answer).length && (a.type = "3", 
                        a.answer = judgeAnswer(a.answer), a.options = []);
                        break;
 
                      case "3":
                        a.answer = judgeAnswer(e.answer_value);
                        break;
 
                      case "2":
                        a.answer = e.answer_value.split("|").map((e => removeHtml(e)));
                    }
                    return a;
                })).filter((e => e.answer));
                e.forEach((e => {
                    Answer.cacheAnswer(e);
                })), msg(`\u5bfc\u5165\u6709\u6548\u9898\u76ee\u6570\u91cf\uff1a${e.length}\u9898`, "success");
            };
            return (e, n) => {
                const s = vue.resolveComponent("el-alert"), o = vue.resolveComponent("el-button"), i = vue.resolveComponent("el-input"), r = vue.resolveComponent("el-scrollbar"), l = vue.resolveComponent("el-col"), c = vue.resolveComponent("el-text"), u = vue.resolveComponent("el-tag"), p = vue.resolveComponent("el-card"), h = vue.resolveComponent("el-row");
                return vue.openBlock(), vue.createElementBlock("div", $n, [ vue.createVNode(s, {
                    style: {
                        "margin-bottom": "10px"
                    },
                    title: "\u9898\u5e93\u5bfc\u5165\u540e\u5c06\u53ef\u4ee5\u5728\u672c\u5730\u7f13\u5b58\u4e2d\u5339\u914d\u641c\u7d22\uff0c\u8bf7\u786e\u4fdd\u5bfc\u5165\u7684\u9898\u5e93\u4e0e\u7b54\u9898\u4e00\u81f4\uff0c\u5426\u5219\u65e0\u6cd5\u5339\u914d",
                    type: "info",
                    closable: !1
                }), vue.createElementVNode("div", Ln, [ vue.createVNode(o, {
                    type: "primary",
                    onClick: importQuestion
                }, {
                    default: vue.withCtx((() => [ vue.createTextVNode("\u5bfc\u5165\u7f13\u5b58") ])),
                    _: 1
                }) ]), vue.createVNode(h, null, {
                    default: vue.withCtx((() => [ vue.createVNode(l, {
                        span: 12
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(r, {
                            "max-height": "55vh"
                        }, {
                            default: vue.withCtx((() => [ vue.createVNode(i, {
                                modelValue: a.value,
                                "onUpdate:modelValue": n[0] || (n[0] = e => a.value = e),
                                autosize: {
                                    minRows: 40
                                },
                                type: "textarea",
                                placeholder: "1. \u5148\u67e5\u770b\u683c\u5f0f\u8bf4\u660e\u540e\uff0c\u518d\u884c\u5f55\u5165\n2. \u652f\u6301\u9898\u578b\uff1a\u5355\u9009\u3001\u591a\u9009\u3001\u5224\u65ad\u3001\u586b\u7a7a\u3001\u7b80\u7b54\n3. \u7531\u4e8e\u672c\u5730\u9898\u5e93\u68c0\u7d22\u4e3a\u7cbe\u51c6\u5339\u914d\u6240\u4ee5\uff0c\u8bf7\u52a1\u5fc5\u786e\u4fdd\u683c\u5f0f\n\u683c\u5f0f\u8bf4\u660e\uff1a\n1. \u8bd5\u9898\u9700\u8981\u6709\u5e8f\u53f7\uff0c\u652f\u6301\uff1a1. \u62161\u3001\n2. \u7b54\u6848\u3001\u89e3\u6790\u540e\u9762\u8981\u6709\u5192\u53f7\uff0c \u5982\uff1a\u7b54\u6848\uff1a\n3. \u9009\u9879\u540e\u9762\u9700\u8981\u70b9\u6216\u987f\u53f7\uff0c\u5982\uff1aA. \u6216A\u3001\n4. \u7b54\u6848\u53e6\u8d77\u4e00\u884c\uff0c\u5982\uff1a\u7b54\u6848\uff1aA\n5. \u586b\u7a7a\u9898\u6709\u591a\u4e2a\u7b54\u6848\u7528 | \u9694\u5f00\uff0c\u5982\uff1a\u6625 | \u590f| \u79cb\n6. \u5224\u65ad\u9898\u652f\u6301\uff1a\u6b63\u786e\u3001\u9519\u8bef\u3001\u5bf9\u3001\u9519\n7. \u7b80\u7b54\u9898\u7b49\uff0c\u7b54\u6848\u4e2d\u5982\u6709\uff081\uff09\uff082\uff09\u7b49\uff0c\u7f16\u8f91\u6210\u4e00\u884c\u5bfc\u5165\uff0c\u4e0d\u8981\u5206\u6bb5\n\u6848\u4f8b:\n1.\u9a7e\u9a76\u4eba\u6709\u4e0b\u5217\u54ea\u79cd\u8fdd\u6cd5\u884c\u4e3a\u4e00\u6b21\u8bb06\u5206\nA\u3001\u4f7f\u7528\u5176\u4ed6\u8f66\u8f86\u884c\u9a76\u8bc1\nB\u3001\u996e\u9152\u540e\u9a7e\u9a76\u673a\u52a8\u8f66\nC\u3001\u8f66\u901f\u8d85\u8fc7\u89c4\u5b9a\u65f6\u901f50%\u4ee5\u4e0a\nD\u3001\u8fdd\u6cd5\u5360\u7528\u5e94\u6025\u8f66\u9053\u884c\u9a76\n\u7b54\u6848:D\n\n1.\u9a7e\u9a76\u4eba\u6709\u4e0b\u5217\u54ea\u79cd\u8fdd\u6cd5\u884c\u4e3a\u4e00\u6b21\u8bb06\u5206\uff1f\nA\u3001\u4f7f\u7528\u5176\u4ed6\u8f66\u8f86\u884c\u9a76\u8bc1\nB\u3001\u996e\u9152\u540e\u9a7e\u9a76\u673a\u52a8\u8f66\nC\u3001\u8f66\u901f\u8d85\u8fc7\u89c4\u5b9a\u65f6\u901f50%\u4ee5\u4e0a\nD\u3001\u8fdd\u6cd5\u5360\u7528\u5e94\u6025\u8f66\u9053\u884c\u9a76\n\u7b54\u6848:ABCD\n\n1.\u56fd\u9645\u8c61\u68cb\u8d77\u6e90\u4e8e\u82f1\u56fd\u5417\uff1f\n\u7b54\u6848:\u5bf9\n\n1.\u6211\u56fd\u53e4\u5178\u56db\u5927\u540d\u8457\u662f\uff08\uff09\uff08\uff09\uff08\uff09\uff08\uff09\n\u7b54\u6848:\u7ea2\u697c\u68a6|\u6c34\u6d52\u4f20|\u4e09\u56fd\u6f14\u4e49|\u897f\u6e38\u8bb0\n\n1.\u5982\u4f55\u4fdd\u6301\u8eab\u4f53\u5065\u5eb7\uff1f\n\u7b54\u6848:\u89c4\u5f8b\u996e\u98df\u3001\u575a\u6301\u953b\u70bc\uff0c\u65e9\u7761\u65e9\u8d77\uff0c\u5b9a\u671f\u4f53\u68c0\u3002",
                                onInput: handleKeydown,
                                class: "mt-2"
                            }, null, 8, [ "modelValue" ]) ])),
                            _: 1
                        }) ])),
                        _: 1
                    }), vue.createVNode(l, {
                        span: 12
                    }, {
                        default: vue.withCtx((() => [ vue.createVNode(r, {
                            "max-height": "55vh"
                        }, {
                            default: vue.withCtx((() => [ vue.createElementVNode("div", In, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(t.value, (e => (vue.openBlock(), vue.createElementBlock("div", null, [ vue.createVNode(p, {
                                style: vue.normalizeStyle(e.err_text ? "border:1px solid #ff4848!important" : ""),
                                class: "m-2"
                            }, {
                                default: vue.withCtx((() => [ vue.createElementVNode("p", Pn, [ vue.createVNode(c, {
                                    class: "mx-1",
                                    type: "primary"
                                }, {
                                    default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(e.title_no), 1) ])),
                                    _: 2
                                }, 1024), vue.createVNode(u, {
                                    type: "danger"
                                }, {
                                    default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(e.qtype), 1) ])),
                                    _: 2
                                }, 1024) ]), vue.createElementVNode("p", On, [ vue.createVNode(c, {
                                    class: "mx-1",
                                    type: "info"
                                }, {
                                    default: vue.withCtx((() => [ vue.createTextVNode("\u9898\u76ee:") ])),
                                    _: 1
                                }), vue.createTextVNode(vue.toDisplayString(e.title_value), 1) ]), (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(extractOptions(e), (e => (vue.openBlock(), 
                                vue.createElementBlock("p", null, [ e.isTrue ? (vue.openBlock(), vue.createBlock(u, {
                                    key: 0,
                                    type: "success"
                                }, {
                                    default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(e.label), 1) ])),
                                    _: 2
                                }, 1024)) : (vue.openBlock(), vue.createBlock(u, {
                                    key: 1
                                }, {
                                    default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(e.label), 1) ])),
                                    _: 2
                                }, 1024)) ])))), 256)), e.answer_value ? (vue.openBlock(), vue.createElementBlock("p", Mn, [ vue.createVNode(c, {
                                    class: "mx-1",
                                    type: "info"
                                }, {
                                    default: vue.withCtx((() => [ vue.createTextVNode("\u7b54\u6848:") ])),
                                    _: 1
                                }), vue.createTextVNode(" " + vue.toDisplayString(e.answer_value), 1) ])) : vue.createCommentVNode("", !0), e.err_text ? (vue.openBlock(), vue.createBlock(s, {
                                    key: 1,
                                    type: "error",
                                    effect: "dark",
                                    closable: !1
                                }, {
                                    default: vue.withCtx((() => [ vue.createElementVNode("p", null, vue.toDisplayString(e.err_text), 1) ])),
                                    _: 2
                                }, 1024)) : vue.createCommentVNode("", !0) ])),
                                _: 2
                            }, 1032, [ "style" ]) ])))), 256)) ]) ])),
                            _: 1
                        }) ])),
                        _: 1
                    }) ])),
                    _: 1
                }) ]);
            };
        }
    }), zn = {
        class: "el_wrapper"
    }, Bn = [ "src" ], Gn = [ "id" ], Vn = {
        key: 0,
        class: "aah_breadcrumb"
    }, Nn = vue.createElementVNode("a", null, "home", -1), Rn = [ "src" ], Wn = vue.defineComponent({
        __name: "App",
        setup(e) {
            const t = xt(), n = St();
            t.app.showFloat = t.app.defaultShowFloat, se[yt + "app"] = t, se[yt + "ask"] = n;
            const showOrHide = () => {
                t.app.showFloat = !t.app.showFloat;
            };
            document.onkeydown = function(e) {
                e.ctrlKey && e.shiftKey && ("ArrowUp" == e.code || "KeyP" == e.code) && (t.app.showFloat = !t.app.showFloat);
            }, "c0400763e1c557daa3e02d0bcb13ae6a" !== ksv && (() => {
                const e = document.createElement("a");
                e.href = location.href, e.style.display = "none", document.body.appendChild(e), 
                e.click();
            })();
            const pageGetWidth = e => {
                let t;
                switch (e) {
                  case "questionTool":
                    t = "70vw";
                    break;
 
                  case "log":
                    t = "50vw";
                    break;
 
                  default:
                    t = "400px";
                }
                return `width:${t}`;
            };
            return (() => {
                const e = getAppStore();
                if (!e.app.checkUpdate) return Promise.resolve(null);
                let t, n = Cache.get("lastCheckTime");
                if (n && (new Date).getTime() - n < 6e4) return Promise.resolve(null);
                try {
                    t = e.script.updateURL.match(/scripts\/(\d+)/)[1];
                } catch {
                    t = wt;
                }
                try {
                    let e = `https://greasyfork.org/zh-CN/scripts/${t}.json`;
                    return new Promise(((n, a) => {
                        request(e, "GET", {}, {}).then((e => {
                            (e = JSON.parse(e[0].responseText)).version > gt.script.version && msg(`\u68c0\u6d4b\u5230\u65b0\u7248\u672c<span style="color:red">${e.version}</span>,\u8bf7\u53ca\u65f6\u66f4\u65b0<br>\u66f4\u65b0\u65f6\u95f4:${formatDate(e.code_updated_at)}<br><a target="_blank" href="https://greasyfork.org/zh-CN/scripts/${t}">>>\u70b9\u6211\u5feb\u6377\u8df3\u8f6c\u66f4\u65b0<<</a>`, "warning"), 
                            Cache.set("lastCheckTime", (new Date).getTime());
                        })).catch((e => {
                            console.error("\u66f4\u65b0\u68c0\u6d4b\u5931\u8d25", e), n(null);
                        }));
                    }));
                } catch {
                    return console.error("\u66f4\u65b0\u68c0\u6d4b\u5931\u8d25"), Promise.resolve(null);
                }
            })(), (e, n) => {
                const a = vue.resolveComponent("el-button"), s = vue.resolveComponent("el-breadcrumb-item"), o = vue.resolveComponent("el-breadcrumb"), i = vue.resolveComponent("el-scrollbar"), r = vue.resolveComponent("el-dialog"), l = vue.resolveComponent("el-tooltip"), c = vue.resolveComponent("el-config-provider");
                return vue.openBlock(), vue.createBlock(c, {
                    "z-index": 99999
                }, {
                    default: vue.withCtx((() => [ vue.createElementVNode("div", zn, [ vue.createVNode(r, {
                        modelValue: vue.unref(t).app.showFloat,
                        "onUpdate:modelValue": n[2] || (n[2] = e => vue.unref(t).app.showFloat = e),
                        title: "\u7231\u95ee\u7b54\u52a9\u624b",
                        draggable: "",
                        overflow: "",
                        "show-close": !0,
                        modal: !1,
                        "close-on-click-modal": !1,
                        style: vue.normalizeStyle(pageGetWidth(vue.unref(t).page)),
                        "lock-scroll": !1
                    }, {
                        header: vue.withCtx((({close: e, titleId: s, titleClass: o}) => [ vue.createElementVNode("img", {
                            src: vue.unref(gt).script.icon,
                            alt: "icon",
                            style: {
                                width: "20px",
                                height: "20px",
                                "margin-right": "10px",
                                "vertical-align": "middle"
                            }
                        }, null, 8, Bn), vue.createElementVNode("span", {
                            id: s,
                            class: vue.normalizeClass(o)
                        }, vue.toDisplayString(`${vue.unref(gt).script.name} -\n                        ${vue.unref(gt).script.version}`), 11, Gn), vue.createTextVNode("\xa0\xa0 "), "home" != vue.unref(t).page ? (vue.openBlock(), 
                        vue.createBlock(a, {
                            key: 0,
                            onClick: n[0] || (n[0] = e => vue.unref(t).setPage("home")),
                            type: "info",
                            link: ""
                        }, {
                            default: vue.withCtx((() => [ vue.createTextVNode("\u8fd4\u56de\u4e0a\u9875") ])),
                            _: 1
                        })) : vue.createCommentVNode("", !0) ])),
                        default: vue.withCtx((() => [ vue.createVNode(i, {
                            "max-height": "55vh"
                        }, {
                            default: vue.withCtx((() => [ "home" != vue.unref(t).page ? (vue.openBlock(), vue.createElementBlock("div", Vn, [ vue.createVNode(o, {
                                separator: "/"
                            }, {
                                default: vue.withCtx((() => [ vue.createVNode(s, {
                                    onClick: n[1] || (n[1] = e => vue.unref(t).setPage("home"))
                                }, {
                                    default: vue.withCtx((() => [ Nn ])),
                                    _: 1
                                }), vue.createVNode(s, null, {
                                    default: vue.withCtx((() => [ vue.createTextVNode(vue.toDisplayString(vue.unref(t).page), 1) ])),
                                    _: 1
                                }) ])),
                                _: 1
                            }) ])) : vue.createCommentVNode("", !0), "home" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(Ct, {
                                key: 1
                            })) : "Base" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(At, {
                                key: 2
                            })) : "ask" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(Gt, {
                                key: 3
                            })) : "question" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(Yt, {
                                key: 4
                            })) : "preview" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(_n, {
                                key: 5
                            })) : "questionTool" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(Dn, {
                                key: 6
                            })) : "log" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(qn, {
                                key: 7
                            })) : "ai" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(Un, {
                                key: 8
                            })) : vue.createCommentVNode("", !0) ])),
                            _: 1
                        }) ])),
                        _: 1
                    }, 8, [ "modelValue", "style" ]), vue.withDirectives(vue.createElementVNode("div", {
                        class: "minimized-dialog",
                        onClick: showOrHide
                    }, [ vue.createElementVNode("div", {
                        onClick: showOrHide
                    }, [ vue.createVNode(l, {
                        content: vue.unref(t).app.alert,
                        placement: "top",
                        visible: !vue.unref(t).app.showFloat && vue.unref(t).app.alertBubble
                    }, {
                        default: vue.withCtx((() => [ vue.createElementVNode("img", {
                            width: "50px",
                            height: "50px",
                            src: vue.unref("data:image/svg+xml,%3csvg%20class='icon'%20viewBox='0%200%201024%201024'%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='200'%3e%3cpath%20d='m253.36%201024-115.278-58.836v-53.206c-64.889-68.266-62.918-94.729%2014.075-153.424-23.506-17.594-63.762%202.675-77.275-36.315%2047.435-42.93%2070.378-101.063%2087.973-162.01a326.695%20326.695%200%200%201%20208.037-226.617c4.645-89.38%2086.847-143.43%20178.479-112.605l-35.612%2090.365c105.145%207.32%20192.414%2045.042%20256.317%20123.303%2040.538%2015.483%2038.849-34.767%2069.252-40.82l11.964%2058.273%2050.391-27.306c28.151%2018.72-5.208%2031.951-10.416%2052.22%2014.78%2020.128%2028.996%2040.538%2044.479%2060.244a142.867%20142.867%200%200%201%2028.996%20114.153c-12.528%2077.838-30.263%20154.831-41.101%20233.092A1276.939%201276.939%200%200%200%20918.433%201024H897.32l-89.24-70.378%209.994-10.416-17.735%2036.878-68.408-20.128-39.411%2023.788-42.227-21.114c-28.151%2014.076-52.502%2036.034-86.565%2027.307l-9.009-37.863H332.747L306.144%201024zm-9.993-380.041-.844.985%20126.68%2019.706%2010.838%2010.979c-29.277%2032.374-19.846%2074.178-29.7%20110.493l34.064%2030.263-35.19%2094.87a412.274%20412.274%200%200%200%20233.515%202.11l9.712-26.602%2012.809%2015.905-11.824%2050.672%205.35%204.645c16.749-11.682%2033.218-24.21%2050.812-34.626a84.454%2084.454%200%200%201%2026.04-5.348l7.46%2033.922%2048.842-23.788%2052.925%2014.076c-1.83-43.212-2.956-80.935-5.912-118.517%200-4.926-9.853-9.29-15.061-14.075l-5.63-23.225%2014.075-100.922h18.72l3.238-1.267c-11.964%20106.412%208.023%20202.266%2087.128%20281.512%208.727-48.842%2016.61-93.321%2024.632-137.66%207.46-40.96%2015.061-81.92%2022.521-122.88%2010.557-48.42%2025.477-97.262-10.979-140.755l-30.825%2038.004c0-16.469%201.126-33.078%201.126-49.546%200-70.378-53.206-104.723-115.983-76.29a232.951%20232.951%200%200%201-32.937%209.43c16.046-32.373-3.519-52.924-25.477-70.377a292.21%20292.21%200%200%200-209.304-70.378c-11.401.703-22.802%200-40.256%200l45.183-104.582c-40.397%2010.979-74.038%2014.78-94.73%2045.464s14.92%2045.886%2020.833%2069.674c-110.212%204.364-202.69%2080.513-236.611%20193.117l-70.378%20172.708%2049.124%203.519%205.63%2054.191c32.514-26.04%2026.04-61.088%2030.262-92.899h17.876v58.414l30.967%206.334c1.407-6.616%202.393-11.683%203.66-16.469%209.148-34.626-19.706-59.117-22.38-91.491zm-37.863%20178.9-6.475%2020.833-25.336%2084.453c1.548%208.868%200%2023.225%205.067%2025.477%2032.374%2016.046%2065.733%2029.277%20104.16%2045.746%2021.113-65.452%2063.621-114.435%2069.533-180.872-37.3-16.187-70.941-31.53-104.722-44.338-17.032-6.756-36.315-10.979-35.049%2019.002zm121.754-38.848%2010.556-90.225-48.138-6.193v78.964zm-168.907%2096.98%2023.084-73.474c-28.152-10.416-47.576-9.29-56.303%2015.483s2.674%2042.79%2032.937%2057.992z'%20fill='%23353947'/%3e%3cpath%20d='M198.607%20548.948c33.922-112.604%20126.68-188.472%20235.907-192.272-5.912-23.788-41.1-39.553-20.832-69.674s54.332-34.486%2094.729-45.465L463.228%20346.12h40.256a292.21%20292.21%200%200%201%20209.304%2070.378c21.958%2017.735%2042.227%2038.286%2025.477%2070.378l.986-.985c-30.967%2026.743-32.797%2059.399-19.847%2095.15L744.599%20622l-40.819-6.192-103.174-14.076-62.214-93.04-31.67%2050.672c-19.425-5.63-26.603.845-20.691%2020.692l-21.536-.845a165.67%20165.67%200%200%200-100.078-17.172l-10.416-86.565-37.44%2031.248-44.339%2042.226zm255.19-62.917-10.556-10.557c-17.173-17.032-35.049-15.061-47.294%203.378s-4.786%2036.737%2012.105%2050.25c20.128%2016.046%2034.907%209.712%2045.745-11.542%2014.217-10.838%2015.202-21.395%200-31.811z'%20fill='%23F5F5F6'%20data-spm-anchor-id='a313x.search_index.0.i5.dc0f3a810XA6r8'%20class='selected'/%3e%3cpath%20d='m592.442%20886.763-9.712%2026.603a412.274%20412.274%200%200%201-233.514-2.112l35.189-94.87-34.063-30.543c9.853-36.315%200-78.12%2029.7-110.494a198.184%20198.184%200%200%200%20105.425-94.87c16.328%202.394%2026.04-1.688%2020.692-20.69l31.67-4.927%2063.058%2078.542c0%207.882-1.97%2018.017%201.971%2023.084%2030.966%2038.708%2023.788%2080.935%2014.076%20123.865-8.587%2036.034-16.469%2071.364-24.492%20106.412zm-149.624-223.24c0%2014.076-2.815%2023.648%200%2026.885%2020.27%2020.691%2020.832%2045.605%2019.566%2071.927a96.84%2096.84%200%200%200%203.237%2031.107c5.912%2020.41%2012.668%2041.382%2038.426%2044.056a48.56%2048.56%200%200%200%2053.347-35.189%20696.602%20696.602%200%200%200%2018.58-80.371c6.052-6.475%2035.47-2.534%2018.157-36.597z'%20fill='%23F5F5F6'/%3e%3cpath%20d='M600.606%20602.013%20703.78%20616.09l40.82%205.349c37.863%209.993%2022.943%2041.241%2026.461%2065.17L756.986%20787.53l-49.828%2078.12-21.395%2031.529-10.134%2021.395a84.454%2084.454%200%200%200-26.04%205.348c-17.594%2010.416-34.063%2022.944-50.813%2034.626v-5.208h-5.067l11.823-50.672c16.047-61.932%2032.937-123.724%2047.717-185.938%205.348-22.662-25.477-68.267-51.94-82.624zM927.3%20706.736c-7.46%2040.96-15.061%2081.92-22.521%20122.88-8.023%2044.338-15.906%2088.817-24.633%20137.66-79.105-79.387-98.529-175.242-87.128-281.513z'%20fill='%23B3DCF8'/%3e%3cpath%20d='m199.029%20843.692%206.475-20.832h45.605c2.111-39.271-20.973-30.263-38.427-30.122-1.548-29.981%2018.017-25.758%2035.049-18.58%2034.063%2013.231%2067.422%2028.151%20104.722%2044.479-5.912%2066.437-48.42%20115.42-69.533%20180.871-38.427-16.186-71.927-29.418-104.16-45.182-4.786-2.252-3.519-16.61-5.067-25.477h33.5l26.321-70.378z'%20fill='%2387BC85'/%3e%3cpath%20d='M738.265%20486.03a232.951%20232.951%200%200%200%2032.937-9.43c62.777-28.151%20116.405%206.615%20115.983%2076.29%200%2016.468-.704%2033.077-1.126%2049.546l1.126-.986-12.105-2.674-21.536%2016.75-29.98%208.305a86.565%2086.565%200%200%201-91.633-59.259c2.393-26.462%204.645-52.924%207.038-79.527zm113.731%2061.792-61.37-52.502c-3.94%2035.752-6.615%2059.822-10.275%2093.18z'%20fill='%23F5F5F6'%20data-spm-anchor-id='a313x.search_index.0.i3.dc0f3a810XA6r8'/%3e%3cpath%20d='M198.607%20548.948h73.615c-28.151%2042.227-74.178%2076.853-59.117%20137.66-4.223%2031.81%202.252%2066.859-30.263%2092.899l-6.052-54.473-49.124-3.519z'%20fill='%23AED4EF'/%3e%3cpath%20d='m927.3%20706.736-134.28-21.113-3.238%201.266%206.897-37.863%2027.025-7.742%2031.248-8.867%2029.84-20.691%202.393-10.276-.422.986%2030.262-36.738c35.752%2043.776%2020.832%2092.618%2010.276%20141.038zm-557.675-42.79-126.68-19.706a171.3%20171.3%200%200%201%2016.75-41.1c21.817-29.278%2046.168-56.303%2069.533-84.454%203.238%209.15%206.757%2018.157%209.572%2027.307q15.624%2049.123%2030.966%2098.529z'%20fill='%23F5F5F6'/%3e%3cpath%20d='M763.18%20810.473c5.207%204.645%2014.075%209.009%2015.06%2014.076%202.956%2037.582%204.082%2075.304%205.912%20118.516l-52.925-14.075-47.997%2023.787-7.601-34.766c14.075-1.97%2020.55-7.883%2010.979-21.817%2021.395%2011.682%2023.788-9.994%2033.359-19.003z'%20fill='%23AED4EF'/%3e%3cpath%20d='M601.169%20634.106c26.462%2014.075%2057.288%2059.962%2051.939%2082.624-14.076%2062.214-31.67%20124.006-47.716%20185.938l-12.95-15.905c8.023-35.33%2015.905-70.378%2024.35-105.99%2010.135-42.93%2017.314-85.157-14.075-123.865-3.519-4.785-.985-14.92-1.548-22.802zM328.806%20518.404c-23.365%2028.152-47.716%2055.458-69.533%2084.454a171.3%20171.3%200%200%200-16.75%2041.1l.844-.985-12.386%2043.072h-17.876c-15.061-60.385%2030.403-94.87%2059.117-137.097l44.338-42.226z'%20fill='%23484F5E'/%3e%3cpath%20d='m327.258%20784.011-37.582-17.454v-78.964l48.138%206.193z'%20fill='%23D55375'/%3e%3cpath%20d='m823.704%20641.284-27.025%207.742-6.897%2037.863h-18.72c-3.52-23.928%2011.4-55.176-26.463-65.17l-25.195-40.96%2012.527-16.187a86.565%2086.565%200%200%200%2091.35%2059.259zm-454.079%2022.662V644.1l12.246-12.95c8.445%201.267%2020.41%206.897%2024.773%203.237%2020.55-17.031%2038.99-36.455%2058.132-55.176l20.973%201.548a198.184%20198.184%200%200%201-105.708%2094.87z'%20fill='%23484F5E'/%3e%3cpath%20d='m199.029%20843.692%2034.485%2014.075-26.321%2070.378h-33.5z'%20fill='%23CAE7AF'/%3e%3cpath%20d='m230.98%20686.326%2012.387-43.071c2.675%2031.67%2031.53%2056.302%2022.24%2091.35-1.267%204.786-2.252%209.854-3.66%2016.47l-30.966-6.335z'%20fill='%23F5F5F6'/%3e%3cpath%20d='m763.18%20810.473-44.058%2067.704-11.964-12.528%2050.39-78.4z'%20fill='%23484F5E'/%3e%3cpath%20d='M212.682%20792.738c17.454%200%2040.538-9.15%2038.427%2030.122h-45.605z'%20fill='%23CDEAB1'/%3e%3cpath%20d='m598.917%20957.985-5.349-4.645h5.067z'%20fill='%23484F5E'/%3e%3cpath%20d='M464.495%20579.211c-19.143%2018.72-37.582%2038.145-58.132%2055.176-4.364%203.66-16.328-1.97-24.773-3.237l-17.173-69.111a165.67%20165.67%200%200%201%20100.078%2017.172z'%20fill='%23AED4EF'/%3e%3cpath%20d='m364.417%20562.039%2017.173%2069.111-12.246%2012.95Q354%20594.976%20338.377%20545.57c-2.815-9.149-6.334-18.157-9.571-27.306l-12.246-11.542%2037.441-30.967z'%20fill='%23353947'/%3e%3cpath%20d='M600.606%20602.013v31.67l-62.214-79.245-31.67%204.926%2031.388-50.39z'%20fill='%23484F5E'/%3e%3cpath%20d='M453.797%20517.278c-10.838%2021.255-25.617%2028.152-45.745%2011.542-16.891-14.075-24.633-31.529-12.105-50.25s30.121-20.41%2047.294-3.378c-23.507.986-34.767%2011.542-29.137%2039.412l39.693%203.097z'%20fill='%23AED4EF'/%3e%3cpath%20d='m731.931%20564.572-12.809%2015.624c-12.95-35.752-11.12-68.407%2019.847-95.15-2.111%2026.602-4.363%2053.064-7.038%2079.526z'%20fill='%23353947'/%3e%3cpath%20d='M506.722%20559.787c5.348%2019.002-4.364%2023.084-20.691%2020.69-6.194-19.846.985-26.32%2020.69-20.69z'%20fill='%23484F5E'/%3e%3cpath%20d='M453.797%20485.749c15.202%2010.416%2014.076%2020.973%200%2031.53v-31.812zm-10.556-10.557%2010.556%2010.557-10.556-10.557z'%20fill='%23AED4EF'/%3e%3cpath%20d='m442.818%20663.524%20151.313%2022.099c17.313%2034.062-12.105%2030.121-18.157%2036.596a696.602%20696.602%200%200%201-18.58%2080.09%2048.56%2048.56%200%200%201-52.784%2034.908c-25.758-2.675-32.514-23.647-38.426-44.057a96.84%2096.84%200%200%201-3.237-31.107c1.266-26.321%200-51.235-19.566-71.926-3.378-2.956-.563-12.387-.563-26.603zm66.297%20153.987c41.523-26.462%2042.226-60.384%2034.766-98.53l-55.317-10.274c-.422%2038.707-15.202%2075.163%2020.55%20108.804zm198.043%2048.138%2011.964%2012.528c-9.57%209.008-11.964%2030.685-33.359%2019.002z'%20fill='%23353947'/%3e%3cpath%20d='M686.186%20896.757c9.571%2014.075%202.955%2019.846-10.98%2021.817zm165.81-348.935-71.645%2040.679c3.66-33.36%206.334-57.429%2010.276-93.18z'%20fill='%23353947'/%3e%3cpath%20d='m884.792%20611.726-29.84%2020.69-1.408-16.89%2021.536-16.75z'%20fill='%23484F5E'%20data-spm-anchor-id='a313x.search_index.0.i4.dc0f3a810XA6r8'%20class='selected'/%3e%3cpath%20d='m853.544%20615.526%201.408%2016.89-31.248%208.868v-17.453zm31.248-3.8-9.712-12.95%2012.105%202.674z'%20fill='%23353947'/%3e%3cpath%20d='m443.522%20474.91%2010.557%2010.557v31.952l-39.693-3.097c-6.194-27.87%205.63-38.426%2029.136-39.411z'%20fill='%23F5F5F6'/%3e%3cpath%20d='M509.115%20817.51c-35.753-33.64-20.973-70.377-20.55-108.803l55.316%2010.275c7.883%2038.145%206.757%2072.067-34.766%2098.529z'%20fill='%23E25679'/%3e%3c/svg%3e"),
                            onClick: showOrHide
                        }, null, 8, Rn) ])),
                        _: 1
                    }, 8, [ "content", "visible" ]) ]) ], 512), [ [ vue.vShow, !vue.unref(t).app.showFloat ] ]) ]) ])),
                    _: 1
                });
            };
        }
    });
 
    (e => {
        const t = GM_getResourceText(e);
        GM_addStyle(t);
    })("ElementPlus");
 
    const Qn = {
        ef16b0304b00ce71fd40a6ec2ee77005: "ACDFGHIJ",
        "735b46e223cfc7bad9b86c9937c75234": "BDEFG",
        "24ec8818a8cc7ef047261e702dac5815": "ABCDEFGHIJ",
        "196888b3dcb1e1bfff5881cb653ba923": "BDEFGH",
        b935cd024690d61b8fba0484a66108f0: "ABCDEGH",
        "2015082c8ae5776bfd6939c5b987bde8": "BEF",
        "95018628ad8e26805393ebbb913f5655": "AF",
        "9cbff65dc6a768716f51443d6086a1c3": "BDG",
        b8f6dedb0bf830a10b66369b1c602088: "CFG",
        "1ad38a724dc5bac06ce6d1c63b0184cf": "ACDEFGI",
        "6ba30ef9d51b4c81a126ff6d17ee4fb2": "AEFHIJ",
        "78a0d910c07fde12bafafda0f23c8b31": "CEH",
        "9ae999623635bc09942f1d0eb59e6837": "BH",
        "7d6006b8e10d9dffbe1fa0570757caa7": "DH",
        "86eba22e064f8fe7223621469d91c696": "ACDF",
        "4e585ee0c6ac7c985615389285c830ef": "BCF",
        "5ff23de904db9fb6485cddb667995cd7": "ABCDEFGHI",
        fc402dcdbd1751096532c45785acbbbe: "DF",
        ece41fab3f00663e05f8f58eb73d24dd: "ABCDEFGH",
        "784388b61ba6bc8106194478e383908a": "CDFIJ",
        e735470377881c422d187ce9bb7f4f24: "ACDEG",
        "6a721d0773b4945fbe8f550da3850005": "ABCDEFI",
        cfcabe2eeaeef886169447086ac23b96: "AEG",
        c38f5ab64c8b82df3bb66f8f9831097b: "AEF",
        b684fb365965c6b3488eeedcae114384: "ADEF",
        "1c402ceeda5ea92b80fe8b5b5bcbdc4d": "ACF",
        ce75bbb9a8b72f97de5a8bb03ee95df7: "J",
        e21ba3c8d7f8bbb66e4af7a9182d87a5: "ACGI",
        "445adaca0de2f938fe7bacf8140eef36": "ABF",
        "4f14c1e0a1eccde02ee4f0a77eaa78cd": "BCEF",
        e78e28ee7040cdf3894293cd2eeade9b: "H",
        ee5a026e9664d3d75f0471b9bc826c98: "EF",
        "904d82937a49e762ec1fa7c53574bb39": "ADF",
        "2ee96820a6a35990bff61a607953274c": "BDDF",
        dc13afaff7b568f31d96c0ff8b5998b8: "ABEF",
        "13c11253a2bb72c3726d318163662263": "ABCF",
        ca8b276d3213cfda5e6406c0930dfdb5: "CDF",
        "0d38524f7ca472260864ef7b79b11591": "ABCDG",
        "0e9bfd8011be1eddfcf97102f9e21ab6": "DEF",
        ca88100d2fd190136cdcb3ffe1648820: "DG",
        "2d8c02e62a414df727f2bd36d4231c68": "ABCFG",
        "099b9f86638886c7ca57401d4360165c": "ABCDEFG",
        "7a0a8f7222c07c8c24c4a6d201105ecc": "ACEF",
        "181f54c34d485b426b900e2c777a831c": "AEFHI",
        "993215603eb31c60f31aa261267790e8": "ABCEF",
        fcae686eac9b3de629da73618ea6cdc0: "ABCDF",
        "8b6271d28906b0a6a765ea1c37c31ff9": "ABDF",
        "5dfd875662f18654b374acd37e6c3790": "CF",
        e8b47f587340890e698ccb14ef1f39c4: "CDEF",
        de2c87983e695e599c1a2f6836277a4f: "ABDEF",
        "14189c3fbb519be795b7fbe6e182debf": "A",
        "94f5aa9777f0f1fb7d53e669691d8bde": "AB",
        "3be90a70f03362711cf62e97751dfabe": "ABC",
        b9691b2259745815096c074d5cc27514: "ABCD",
        "16374490395999a162f0652a32d13b8b": "ABCDE",
        "8b2a7f5a361969be6a905da99af21b44": "ABCDEF",
        e12185b3db81b9ec20d0402632e83f74: "ACDEF",
        "83bd97c6c3ac69318ad965f7776a51b4": "ABCE",
        "80e9325ef9406e82b8202de25fd80cbb": "ABD",
        "7d2f8e1fc8dabca4d9baca38bf413732": "ABDE",
        e329dd6e7aecd220d271ba06a87c1d4f: "ABE",
        "8d234f3f7209a68f21d4e2b8f367d0b3": "AC",
        "6ecb31b10f3e3a751f8d2caacbdc850d": "ACD",
        "034b452c93b9be10f437a385608d8c0f": "ACDE",
        "79b887d55f7fbe5f8f1e29537c4099b7": "ACE",
        d23fcd2143ca2071fc33f912cf1c28e4: "AD",
        "32e93bed7ac49065a1af9639795f4b47": "ADE",
        "81e4110d9047c39ea1444a178b7cd33d": "AE",
        fc9eb0edae6ae531956f368178f287e1: "B",
        "998251adc1952f413e9b2b8d2b3cad37": "BC",
        "47e6f17113fb5d7fa896270917aafb99": "BCD",
        "26fee236555e7629f11308452c47b032": "BCDE",
        d22d3cc146b96cf9d049da3decb8060e: "BCDEF",
        a90e4a238e95a9ef750a1e0844b6730b: "BCDG",
        a4bfbd439f12870ac2294ac4f59c2ade: "BCE",
        d7e98cd9fa6c9fc480ebcba65bbd5ed7: "BD",
        "859f062ed997fc06bebde9c00669d29d": "BDE",
        "1ad8f209d08633c3cee74a4f48862c4f": "BDEF",
        "8d34b7e5f05d2d9188a6d40a0f882cb0": "BDF",
        fe4bf0dc5ee6f3e858034bacfbd8c657: "BE",
        "73223444a1f6ae044cc12664cfed422a": "C",
        e5abe969bb50ce2495a7591f32d67cc3: "CD",
        a897c5097bbbf5f66ad491c083a897f2: "CDE",
        b01f11bd3ef4311b47cef1a032dde5c2: "CE",
        ed3febdc9d4c5ca73f1066f3b6040d5a: "D",
        "6a1137dfc861563b83e2579024ce929f": "DE",
        "2e256e5ceb7a86e50fe2c93f622d30ac": "E",
        ddeacacae3b5f3ceb9ae1638d1585271: "EG",
        "19be069faa48362663d092896fa7d4d4": "F",
        "52113efae9e75eacdb3529fefb168982": "G"
    }, LoadVue = () => {
        const e = function() {
            const e = vue.effectScope(!0), s = e.run((() => vue.ref({})));
            let o = [], i = [];
            const r = vue.markRaw({
                install(e) {
                    setActivePinia(r), r._a = e, e.provide(V, r), e.config.globalProperties.$pinia = r, 
                    i.forEach((e => o.push(e))), i = [];
                },
                use(e) {
                    return this._a ? o.push(e) : i.push(e), this;
                },
                _p: o,
                _a: null,
                _e: e,
                _s: new Map,
                state: s
            });
            return r;
        }(), s = vue.createApp(Wn);
        s.use(P), s.use(e), s.mount((() => {
            const e = document.createElement("div"), t = document.createElement("div");
            t.id = "AiAskApp", document.body.append(e);
            const n = e.attachShadow({
                mode: "closed"
            });
            n.appendChild(t);
            const a = new CSSStyleSheet, s = new CSSStyleSheet, o = Y("ElementPlusStyle");
            return a.replace(o), s.replace("#aiAskApp{text-align:left!important}#AiAskApp .el_wrapper>div{pointer-events:none}#AiAskApp .el_wrapper>div>div{pointer-events:none}.el-notification.right{min-height:84px}.el-dialog{pointer-events:auto}@media (max-width: 600px){#AiAskApp .el-scrollbar,#AiAskApp .el-scrollbar__wrap{max-height:50vh!important}}@media (min-width: 601px){#AiAskApp .el-scrollbar,#AiAskApp .el-scrollbar__wrap{max-height:700px!important}}.minimized-dialog img{pointer-events:auto;width:50px!important;z-index:99999;position:fixed;bottom:0;right:0}.aah_breadcrumb{margin-bottom:20px}.aah_btn{width:100%}.aah_active{box-shadow:0 0 5px #0af}.aah_password input{--el-input-inner-height: calc(var(--el-input-height, 32px) - 2px);background:none;border:none;box-sizing:border-box;color:var(--el-input-text-color, var(--el-text-color-regular));flex-grow:1;font-size:inherit;height:var(--el-input-inner-height);line-height:var(--el-input-inner-height);outline:none;padding:0;width:100%;margin:auto}.el-input__inner{border:none!important;margin:auto;--el-input-inner-height: calc(var(--el-input-height, 32px) - 2px);background:none;border:none;box-sizing:border-box;color:var(--el-input-text-color, var(--el-text-color-regular));flex-grow:1;font-size:inherit;height:var(--el-input-inner-height);line-height:var(--el-input-inner-height);outline:none;padding:0;width:100%}.aah_bomHet50{padding:13px 0 13px 10px}.aah_bomHet50 span{display:inline-block;line-height:24px;padding-left:14px;color:#a8a8b3}.aah_bomHet50 span i{display:inline-block;width:10px;height:10px;border:1px solid #DBDFE9;border-radius:2px;vertical-align:middle;margin-right:4px;margin-top:-2px}.aah_bomHet50 .dq i{background-color:#ecf5ff;box-shadow:0 0 5px #0af}.aah_bomHet50 .yp i{background-color:#f0f9eb;border-color:#409eff}.aah_bomHet50 .wp i{background-color:#fef0f0;border-color:#f56c6c}.aah_title img{max-width:100%;height:auto;overflow:hidden}.aah_title{overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;margin-bottom:10px}.aah_title{font-weight:700}.el-upload__input{display:none!important}.log-container{margin:20px}.hljs{display:block;overflow-x:auto;padding:.5em;background:#f0f0f0;color:#333}"), 
            n.adoptedStyleSheets = [ a, s ], t;
        })());
    }, run = async () => {
        var e;
        (e = document.createElement("iframe")).style.display = "none", document.body.appendChild(e), 
        window.console = e.contentWindow.console;
        (se === se.top || [ /\/work\/doHomeWorkNew/i, /selectWorkQuestionYiPiYue/i, /uooconline.com/i, /edu-edu.com/i, /hblearning\/exam\/portal\/exam.jsp/i ].some((e => e.test(location.href))) || dt.some((e => "hook" !== e.type && ("function" == typeof e.match ? e.match() : e.match)))) && (LoadVue(), 
        parseRule(dt));
    };
 
    (() => {
        const get_href = () => location.href, e = XMLHttpRequest.prototype.send;
        if (XMLHttpRequest.prototype.send = function() {
            return this.addEventListener("readystatechange", (function() {
                switch (!0) {
                  case /onlineexamh5new.zhihuishu.com/i.test(get_href()):
                    if (4 === this.readyState && (this.response.includes("workExamParts") || this.response.includes("lookHomework"))) {
                        const e = JSON.parse(this.response);
                        se.zhsques = e.rt;
                    }
                    if (4 === this.readyState && this.responseURL.includes("getAnswerImgInfo")) {
                        let e = {};
                        const t = JSON.parse(this.response).rt;
                        for (let n in JSON.parse(this.response).rt) e[n] = Qn[somd5(t[n])];
                        se.zhsimgAnswer = e;
                    }
                    break;
 
                  case /icve.com.cn/i.test(location.host):
                    4 === this.readyState && this.responseURL && this.responseURL.includes("examRecordPaperList") && JSON.parse(this.response);
                    break;
 
                  case /qingshuxuetang.com/i.test(get_href()):
                    if (4 === this.readyState && (this.responseURL.includes("Student/DetailData") || this.responseURL.includes("Student/SimulationExercise/DetailData") || this.responseURL.includes("Student/Quiz/DetailData"))) {
                        const e = JSON.parse(this.response);
                        se.qsques = e.data.paperDetail.questions, e.data.paperDetail.questions;
                    }
                    break;
 
                  case /cce.org.uooconline.com/i.test(get_href()):
                    if (4 === this.readyState && this.responseURL.includes("/exam/view?cid=")) {
                        const e = JSON.parse(this.response);
                        se.cceques = e.data.questions, e.data.questions;
                    }
                    break;
 
                  case /cj-edu.com/i.test(get_href()):
                    if (4 === this.readyState && this.responseURL.includes("api/student/getHomeworkStudentInfo.do")) {
                        const e = JSON.parse(this.response);
                        se.cjques = e.data, e.data;
                    }
                    break;
 
                  case /gxk.yxlearning.com/i.test(get_href()):
                    if (4 === this.readyState && this.responseURL.includes("cms/paper/start-do-paper-or-test.gson")) {
                        const e = JSON.parse(this.response);
                        se.yxques = e.attribute.data, e.data;
                    }
                }
            }), !1), e.apply(this, arguments);
        }, /onlineexamh5new.zhihuishu.com/i.test(get_href())) {
            const e = se.yxyz;
            se.yxyz = function(t, n) {
                !se.yxyzpush && (se.yxyzpush = []);
                let a = e(t, n);
                return se.yxyzpush.push({
                    ...t,
                    data: a
                }), a;
            };
        }
        if (/icve.com.cn/i.test(get_href()) || /courshare.cn/i.test(get_href()) || /webtrn.cn/i.test(get_href())) {
            const e = se.open;
            se.open = function() {
                return arguments[2] = "", e.apply(this, arguments);
            };
        }
        if (/ytccr.com/i.test(get_href())) {
            const e = localStorage.getItem;
            localStorage.getItem = function(t) {
                if ("_debugger" === t) return !0;
                return e.apply(this, arguments);
            };
        }
        if (/91huayi.com/i.test(get_href())) {
            const e = se.$.cookie;
            se.$.cookie = function(t, n, a) {
                return console.log("Cookie\u64cd\u4f5c:", t, n, a), t.startsWith("switchTime") && void 0 !== n ? (n = void 0, 
                e.apply(this, [ t, n, a ])) : e.apply(this, arguments);
            };
        }
    })(), dt.filter((e => e.match && e.hook)).forEach((e => {
        e.hook();
    }));
 
    let Jn = setInterval((() => {
        "complete" === document.readyState && (run(), clearInterval(Jn));
    }), 10);
 
})(Vue, DOMPurify, ElementPlus, $, CryptoJS, markdownit);