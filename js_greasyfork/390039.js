// ==UserScript==
// @name       微博超话自动签到
// @description  用户登录后进入微博主页，获取超级话题并自动签到
// @homepageURL  https://github.com/Deuscx/WB_SIGN_EXT
// @supportURL   https://github.com/Deuscx/WB_SIGN_EXT/issues
// @grant       none
// @version     2.0.4
// @author       deus
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.4
// @require    https://cdn.jsdelivr.net/npm/axios@0.21.0/dist/axios.min.js
// @namespace https://deuscx.github.io/
// @downloadURL https://update.greasyfork.org/scripts/390039/%E5%BE%AE%E5%8D%9A%E8%B6%85%E8%AF%9D%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/390039/%E5%BE%AE%E5%8D%9A%E8%B6%85%E8%AF%9D%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function() {
    "use strict";
    var e = ".configContainer{display:flex;flex-direction:column;position:fixed;--bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--bg-opacity));z-index:10;border-radius:.25rem;border-width:1px;--border-opacity:1;border-color:#cbd5e0;border-color:rgba(203,213,224,var(--border-opacity));padding:.75rem .5rem;max-width:190px;bottom:80px;right:0;transform:translateX(100%);transition-duration:.5s;transition-timing-function:cubic-bezier(.22,1,.36,1);transition-property:transform}.configContainer .cItem{font-size:.875rem;display:flex;justify-content:space-between;cursor:pointer}.configContainer .cItem .des{--text-opacity:1;color:#718096;color:rgba(113,128,150,var(--text-opacity))}#TIMEOUT{-webkit-appearance:none;-moz-appearance:none;appearance:none;display:inline-block;width:60px}.configContainer .action{padding-top:.5rem;padding-bottom:.5rem;border-radius:.25rem;background-color:#fff;cursor:pointer;position:absolute;top:50%;left:0;transform:translate3d(-100%,-50%,0)}.configContainer .action:hover{color:#ccc}.active{transform:translateX(0)}";
    const t = (new Date).getTimezoneOffset() + 480;
    const n = Date.now;
    const isNewDay = e => {
        if (!e) return true;
        const n = new Date(e);
        n.setMinutes(n.getMinutes() + t);
        n.setHours(0, 0, 0, 0);
        const o = new Date;
        o.setMinutes(n.getMinutes() + t);
        return o - n > 864e5;
    };
    const o = function() {
        const set = function(e, t) {
            localStorage.setItem(e, JSON.stringify(t));
        };
        const get = function(e) {
            const t = localStorage.getItem(e);
            try {
                return JSON.parse(t);
            } catch (e) {
                return t;
            }
        };
        const remove = function(e) {
            localStorage.removeItem(e);
        };
        const has = function(e) {
            return Reflect.has(localStorage, e);
        };
        return {
            set: set,
            get: get,
            remove: remove,
            has: has
        };
    }();
    const r = (e => () => e++)(0);
    const a = "WB";
    const c = `${a}_SIGNED_ARR`;
    const s = "WB_CONFIG";
    const i = {
        SUCCESS: "success",
        ERROR: "error",
        INFO: "info",
        WARNING: "warning"
    };
    let u = o.get(s);
    function ConfigPanel() {
        const handleAutoSign = e => {
            const t = e.target.checked;
            const n = Object.assign({}, u, {
                AUTO_SIGN: t
            });
            u = n;
            o.set(s, u);
        };
        const handleShowToast = e => {
            const t = e.target.checked;
            const n = Object.assign({}, u, {
                SHOW_TOAST: t
            });
            u = n;
            o.set(s, u);
        };
        const handleTimeout = e => {
            const t = e.target.value;
            const n = Object.assign({}, u, {
                TIMEOUT: t
            });
            u = n;
            o.set(s, u);
        };
        const toggleClassList = () => {
            document.querySelector(".configContainer").classList.toggle("active");
        };
        return VM.createElement(VM.Fragment, null, VM.createElement("div", {
            className: "configContainer"
        }, VM.createElement("label", {
            htmlFor: "AUTO_SIGN",
            className: "cItem"
        }, VM.createElement("span", {
            className: "des"
        }, "自动签到"), VM.createElement("input", {
            id: "AUTO_SIGN",
            type: "checkbox",
            onInput: handleAutoSign,
            checked: u.AUTO_SIGN
        })), VM.createElement("label", {
            htmlFor: "SHOW_TOAST",
            className: "cItem"
        }, VM.createElement("span", {
            className: "des"
        }, "是否展示气泡"), VM.createElement("input", {
            id: "SHOW_TOAST",
            type: "checkbox",
            onInput: handleShowToast,
            checked: u.SHOW_TOAST
        })), VM.createElement("label", {
            htmlFor: "TIMEOUT",
            className: "cItem"
        }, VM.createElement("span", {
            className: "des"
        }, "气泡展示时间"), VM.createElement("input", {
            id: "TIMEOUT",
            type: "number",
            onInput: handleTimeout,
            min: "0",
            value: parseInt(u.TIMEOUT, 10),
            placeholder: "单位为毫秒"
        })), VM.createElement("div", {
            className: "action",
            onClick: toggleClassList
        }, "收放")), VM.createElement("style", null, e));
    }
    var l = ".msgContainer{position:fixed;background-color:initial;top:4rem;right:40px}@keyframes slide-in-right{0%{transform:translateX(1000px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slide-out-right{0%{transform:translateX(0);opacity:1}to{transform:translateX(1000px);opacity:0}}.removing{animation:slide-out-right .5s cubic-bezier(.55,.085,.68,.53) both}.toastItem{background-color:#fff;background-color:rgba(255,255,255,var(--bg-opacity));border-width:1px;--border-opacity:1;border-color:#cbd5e0;border-color:rgba(203,213,224,var(--border-opacity));border-radius:.375rem;max-width:20rem;--text-opacity:1;color:#fff;color:rgba(255,255,255,var(--text-opacity));z-index:10;padding:1rem 1.5rem;cursor:pointer;--bg-opacity:1;background-color:#3182ce;background-color:rgba(49,130,206,var(--bg-opacity));opacity:.8;margin-bottom:.5rem;animation:slide-in-right .5s cubic-bezier(.25,.46,.45,.94) both}.toast-info{--bg-opacity:1;background-color:#63b3ed;background-color:rgba(99,179,237,var(--bg-opacity))}.toast-default{--bg-opacity:1;background-color:#3182ce;background-color:rgba(49,130,206,var(--bg-opacity))}.toast-success{--bg-opacity:1;background-color:#48bb78;background-color:rgba(72,187,120,var(--bg-opacity))}.toast-error{background-color:#ff5252}.toast-warning{--bg-opacity:1;background-color:#f6e05e;background-color:rgba(246,224,94,var(--bg-opacity))}";
    const m = 8;
    let d = 0;
    const innerToast = e => {
        const {content: t, type: n, timeout: o} = e;
        function remove() {
            const t = document.querySelector(`[data-tid='${e.id}']`);
            t.classList.add("removing");
            requestAnimationFrame((() => {
                t.parentNode.removeChild(t);
                d--;
            }));
        }
        o && setTimeout((() => {
            remove();
        }), o);
        return VM.createElement(VM.Fragment, null, VM.createElement("div", {
            "data-tid": e.id,
            className: `toastItem toast-${n}`,
            onClick: remove
        }, t));
    };
    const ToastContainer = () => VM.createElement("div", {
        className: "msgContainer"
    }, VM.createElement("style", null, l));
    const g = {
        type: i.INFO,
        timeout: 5e3
    };
    const toastFactory = () => {
        const e = ToastContainer();
        const t = document.body.appendChild(e);
        const toast = (e, n) => {
            if (!o.get(s).SHOW_TOAST) return;
            const a = Object.assign({}, g, {
                id: r()
            }, n, {
                content: e
            });
            if (d < m) {
                d++;
                t.appendChild(innerToast(a));
            }
        };
        toast.success = (e, t) => toast(e, Object.assign({}, t, {
            type: i.SUCCESS
        }));
        toast.error = (e, t) => toast(e, Object.assign({}, t, {
            type: i.ERROR
        }));
        toast.info = (e, t) => toast(e, Object.assign({}, t, {
            type: i.INFO
        }));
        toast.warn = (e, t) => toast(e, Object.assign({}, t, {
            type: i.WARNING
        }));
        return toast;
    };
    const p = toastFactory();
    const f = {
        AUTO_SIGN: true,
        SHOW_TOAST: true,
        TIMEOUT: 1e3
    };
    const b = axios.create({
        baseURL: "https://weibo.com/",
        timeout: 1e3 * 5
    });
    b.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    b.interceptors.request.use((e => e), (e => Promise.error(e)));
    b.interceptors.response.use((e => e.status === 200 ? Promise.resolve(e) : Promise.reject(e)), (e => {
        const {response: t} = e;
        if (t) {
            console.log("发送请求失败", t);
            return Promise.reject(t);
        }
        if (!window.navigator.onLine) console.error("断网"); else return Promise.reject(e);
    }));
    class BaseFeature {
        constructor({name: e}) {
            this.launch = () => {};
            this.name = e;
        }
        get store() {
            const e = o.get(this.name);
            if (e) return e;
            o.set(this.name, void 0);
            return;
        }
        set store(e) {
            o.set(this.name, e);
        }
        init() {
            return new Promise(((e, t) => {
                try {
                    this.launch();
                    e(this);
                } catch (e) {
                    console.log(`run ${this.name} error`);
                    t(e);
                }
            }));
        }
    }
    function isCheck() {
        return o.get("isCheck") || false;
    }
    const h = o.get("lastCheck");
    const signInterestAPI = e => b({
        url: "p/aj/general/button",
        params: {
            ajwvr: 6,
            api: "http://i.huati.weibo.com/aj/super/checkin",
            texta: encodeURI("签到"),
            textb: encodeURI("已签到"),
            status: 0,
            id: e,
            __rnd: (new Date).getTime()
        }
    });
    let y = o.get(c) || [];
    const signInterest = ({id: e, name: t}) => new Promise(((r, a) => {
        signInterestAPI(e).then((e => {
            const {data: s} = e;
            if (s.code === "100000") {
                window.toast.success(`[${t}签到成功]${s.msg} ---${s.data.alert_title}`);
                o.set("lastCheck", n());
                y.push(t);
                y = Array.from(new Set(y));
                o.set(c, y);
            } else {
                window.toast.warn(`[${t}超话签到]${s.msg}`);
                if (s.code !== 382004) a("error"); else {
                    o.set("lastCheck", n());
                    y.push(t);
                    y = Array.from(new Set(y));
                    o.set(c, y);
                }
            }
            r();
        }), (e => {
            a(e);
            window.toast.error(`[${t}超话签到]签到失败，请检查网络`);
        }));
    }));
    function delay(e) {
        return new Promise((t => setTimeout(t, e)));
    }
    function getInterestNameAId(e = 1) {
        return new Promise(((t, n) => {
            b({
                url: `ajax/profile/topicContent?tabid=231093_-_chaohua&page=${e}`
            }).then((o => {
                const {data: {data: r, ok: a}} = o;
                if (a !== 1) n({
                    err: "获取关注超话失败",
                    data: r
                });
                const c = r.list;
                const s = r.max_page;
                function extractId(e) {
                    return e.slice(5);
                }
                const i = c.map((({oid: e, topic_name: t}) => ({
                    id: extractId(e),
                    name: t
                })));
                if (e < s) getInterestNameAId(e + 1).then((e => {
                    t(i.concat(e));
                })); else t(i);
            }), (e => {
                console.error(`[${a}]`, e);
                n("获取hash失败");
            }));
        }));
    }
    class PromiseQueue {
        constructor({concurrency: e = 1, timeout: t = 0} = {}) {
            this.queue = [];
            this.running = 0;
            this.concurrency = e;
            this.timeout = t;
        }
        add(e) {
            return new Promise(((t, n) => {
                const wrappedFn = async () => {
                    try {
                        const n = e();
                        await delay(this.timeout);
                        const o = await n;
                        t(o);
                    } catch (e) {
                        n(e);
                    } finally {
                        this.running--;
                        this.processQueue();
                    }
                };
                this.queue.push(wrappedFn);
                this.processQueue();
            }));
        }
        processQueue() {
            while (this.running < this.concurrency && this.queue.length > 0) {
                this.running++;
                const e = this.queue.shift();
                e();
            }
        }
    }
    class Interest extends BaseFeature {
        constructor() {
            super({
                name: s
            });
            this.launch = async () => {
                const e = super.store;
                if (!e.AUTO_SIGN) return;
                if (isCheck() && !isNewDay(h)) {
                    window.toast.info("今日已签到");
                    return;
                }
                if (isNewDay(h)) {
                    o.remove(c);
                    o.set("isCheck", false);
                }
                let t = await getInterestNameAId();
                const n = o.get(c);
                if (n && n.length) t = t.filter((e => !n.includes(e.name)));
                const r = new PromiseQueue({
                    concurrency: 1,
                    timeout: 500
                });
                for (const {name: e, id: n} of t) await r.add((() => signInterest({
                    id: n,
                    name: e
                })));
                o.set("isCheck", true);
            };
        }
        run() {
            this.init().then((e => {}));
        }
    }
    var w = new Interest;
    function initConfig() {
        if (!o.get(s)) o.set(s, f);
    }
    function initDOM() {
        return new Promise(((e, t) => {
            try {
                const e = ConfigPanel();
                document.body.appendChild(e);
            } catch (e) {
                throw new Error("初始化DOM失败");
            }
        }));
    }
    function BaseInit() {
        initConfig();
        window.toast = p;
    }
    function OtherInit() {
        initDOM();
    }
    function main() {
        BaseInit();
        OtherInit();
        w.run();
    }
    main();
})();
