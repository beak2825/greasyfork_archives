// ==UserScript==
// @name         爱问答助手
// @namespace    aiask/askHelper
// @version      2.4.6
// @author       aiask
// @description  全平台问答助手，一键获取整个页面的试题答案，目前支持【超星学习通、知到智慧树、国家开放大学、广东开放大学、江苏开放大学、上海开放大学、云南开放大学、芯位教育、云慕学苑、职教云、川农在线、安徽继续教育平台、青书学堂、睿学在线、成教云、京人平台、绎通继教云、学起Plus、云上河开、河南继续教育、四川开放大学、良师在线、继教云、日照专业技术人员继续教育、麦能网、21tb、168网校、云班课、电大中专、learnin、西财在线、春风雨】，更多平台开发中...
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAHVQTFRFR3BMgICBQD8/QUVHQ0ZIRUhKX2FiQD8/Tk1NP0VJPzs7Pz8/QD4+UE9QQD8/PVlnQD8/M6vj////n5+fN5C60NDQSl9qOXWSZL/qTFNXzOr4QWl8yMjItLS02traOIOnNZzN6OfnlJeZ9/f3PYGgpdrzmdXxgSBJqQAAABB0Uk5TAP5E6vys+7/Q0RhsfPFV/OwFarYAAAEESURBVHjapdHrboMgGIBhUHBaD/sAlTE8VOt2/5c4GlBMRZOl7w8j+kQQ0FaVwbG48IDq+piMPcgkO1bD/8DXvhD4/fb9ePDuGiqa2krV7pO1AxSLYIl2ABoeTLSvYMBi4N0sphOAlVaqg1aTPggmZYYaFvNMBYGQz6G6m2vbhEBvF81MxALFTDpbQQd3ZhvBgxqiFfBEO/CJ7ZxkNPcUbWBwn5DJw4KSsJHcHPCTLLDuQxpLkiMLbAIWJs1wBRVkyAFXT7Sa+AYQjTywNfOD74DNA18I9Ifjpg7Es/3Jj5eKyIEcBgNwhk5L8XMPonMQQcfNhBfRpIfbFbiRskCX5enFyz/07TSN9vGxKwAAAABJRU5ErkJggg==
// @match        *://*.chaoxing.com/*
// @match        *://*.hlju.edu.cn/*
// @match        *://*.ecust.edu.cn/*
// @match        *://lms.ouchn.cn/*
// @match        *://*.ouchn.cn/*
// @match        *://xczxzdbf.moodle.qwbx.ouchn.cn/*
// @match        *://study.ouchn.cn/*
// @match        *://moodle.syxy.ouchn.cn/*
// @match        *://moodle.qwbx.ouchn.cn/*
// @match        *://*.tongyi.com/*
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
// @match        *://*.icve.com.cn/*
// @match        *://zice.cnzx.info/*
// @match        *://any.cnzx.info:81/*
// @match        *://www.icourse163.org/*
// @match        *://*.shou.org.cn/*
// @match        *://*.ahjxjy.cn/*
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
// @match        *://*.csmu.edu.cn/*
// @match        *://*.ketangx.net/*
// @match        *://*.cnzx.info/*
// @match        *://www.asklib.com/*
// @match        *://*.xust.edu.cn/*
// @match        *://*.whut.edu.cn/*
// @match        *://*.lut.edu.cn/*
// @match        *://*.wwwwsoft.com/*
// @match        *://*.dufe.edu.cn/*
// @match        *://*.lygtc.edu.cn/*
// @match        *://*.iwdjy.com/*
// @match        *://*.jijiaool.com/*
// @match        *://lms.cjzx.hblll.com/*
// @match        *://*.ouc-online.com.cn/*
// @match        *://*.lsedu.vip/*
// @require      https://lib.baomitu.com/vue/3.4.27/vue.global.min.js
// @require      https://lib.baomitu.com/vue-demi/0.14.6/index.iife.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://lib.baomitu.com/dompurify/3.1.6/purify.min.js
// @require      https://lib.baomitu.com/crypto-js/4.2.0/crypto-js.min.js
// @connect      127.0.0.1
// @connect      icodef.com
// @connect      muketool.com
// @connect      wk66.top
// @connect      82.157.105.20
// @connect      zhihuishu.com
// @connect      greasyfork.org
// @connect      chaoxing.com
// @connect      shou.org.cn
// @connect      jsdelivr.net
// @connect      jsdmirror.cn
// @connect      gitee.com
// @connect      vxo.im
// @connect      zeroai.chat
// @connect      forestpolice.org
// @connect      scriptcat.org
// @connect      aiask.site
// @connect      *
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/492563/%E7%88%B1%E9%97%AE%E7%AD%94%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492563/%E7%88%B1%E9%97%AE%E7%AD%94%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// hello

(function (vue, V, G, R) {
    'use strict';

    var e = Object.defineProperty, __publicField = (t, n, a) => ((t, n, a) => n in t ? e(t, n, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: a
    }) : t[n] = a)(t, "symbol" != typeof n ? n + "" : n, a);

    var J = vue.defineComponent({
        name: "ArrowLeft",
        __name: "arrow-left",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.59 30.59 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.59 30.59 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0"
        }) ]))
    }), Q = vue.defineComponent({
        name: "ChatDotRound",
        __name: "chat-dot-round",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "m174.72 855.68 135.296-45.12 23.68 11.84C388.096 849.536 448.576 864 512 864c211.84 0 384-166.784 384-352S723.84 160 512 160 128 326.784 128 512c0 69.12 24.96 139.264 70.848 199.232l22.08 28.8-46.272 115.584zm-45.248 82.56A32 32 0 0 1 89.6 896l58.368-145.92C94.72 680.32 64 596.864 64 512 64 299.904 256 96 512 96s448 203.904 448 416-192 416-448 416a461.06 461.06 0 0 1-206.912-48.384l-175.616 58.56z"
        }), vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M512 563.2a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4m192 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4m-384 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4"
        }) ]))
    }), W = vue.defineComponent({
        name: "Document",
        __name: "document",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M832 384H576V128H192v768h640zm-26.496-64L640 154.496V320zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32m160 448h384v64H320zm0-192h160v64H320zm0 384h384v64H320z"
        }) ]))
    }), K = vue.defineComponent({
        name: "EditPen",
        __name: "edit-pen",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "m199.04 672.64 193.984 112 224-387.968-193.92-112-224 388.032zm-23.872 60.16 32.896 148.288 144.896-45.696zM455.04 229.248l193.92 112 56.704-98.112-193.984-112zM104.32 708.8l384-665.024 304.768 175.936L409.152 884.8h.064l-248.448 78.336zm384 254.272v-64h448v64z"
        }) ]))
    }), Y = vue.defineComponent({
        name: "FolderOpened",
        __name: "folder-opened",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M878.08 448H241.92l-96 384h636.16zM832 384v-64H485.76L357.504 192H128v448l57.92-231.744A32 32 0 0 1 216.96 384zm-24.96 512H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h287.872l128.384 128H864a32 32 0 0 1 32 32v96h23.04a32 32 0 0 1 31.04 39.744l-112 448A32 32 0 0 1 807.04 896"
        }) ]))
    }), X = vue.defineComponent({
        name: "House",
        __name: "house",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M192 413.952V896h640V413.952L512 147.328zM139.52 374.4l352-293.312a32 32 0 0 1 40.96 0l352 293.312A32 32 0 0 1 896 398.976V928a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V398.976a32 32 0 0 1 11.52-24.576"
        }) ]))
    }), Z = vue.defineComponent({
        name: "Notebook",
        __name: "notebook",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M192 128v768h640V128zm-32-64h704a32 32 0 0 1 32 32v832a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32"
        }), vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M672 128h64v768h-64zM96 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32"
        }) ]))
    }), ee = vue.defineComponent({
        name: "QuestionFilled",
        __name: "question-filled",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m23.744 191.488c-52.096 0-92.928 14.784-123.2 44.352-30.976 29.568-45.76 70.4-45.76 122.496h80.256c0-29.568 5.632-52.8 17.6-68.992 13.376-19.712 35.2-28.864 66.176-28.864 23.936 0 42.944 6.336 56.32 19.712 12.672 13.376 19.712 31.68 19.712 54.912 0 17.6-6.336 34.496-19.008 49.984l-8.448 9.856c-45.76 40.832-73.216 70.4-82.368 89.408-9.856 19.008-14.08 42.24-14.08 68.992v9.856h80.96v-9.856c0-16.896 3.52-31.68 10.56-45.76 6.336-12.672 15.488-24.64 28.16-35.2 33.792-29.568 54.208-48.576 60.544-55.616 16.896-22.528 26.048-51.392 26.048-86.592q0-64.416-42.24-101.376c-28.16-25.344-65.472-37.312-111.232-37.312m-12.672 406.208a54.27 54.27 0 0 0-38.72 14.784 49.4 49.4 0 0 0-15.488 38.016c0 15.488 4.928 28.16 15.488 38.016A54.85 54.85 0 0 0 523.072 768c15.488 0 28.16-4.928 38.72-14.784a51.52 51.52 0 0 0 16.192-38.72 51.97 51.97 0 0 0-15.488-38.016 55.94 55.94 0 0 0-39.424-14.784"
        }) ]))
    }), te = vue.defineComponent({
        name: "Setting",
        __name: "setting",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357 357 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a352 352 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357 357 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294 294 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293 293 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294 294 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288 288 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293 293 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a288 288 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256"
        }) ]))
    }), ne = vue.defineComponent({
        name: "Upload",
        __name: "upload",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64m384-578.304V704h-64V247.296L237.248 490.048 192 444.8 508.8 128l316.8 316.8-45.312 45.248z"
        }) ]))
    }), ae = vue.defineComponent({
        name: "User",
        __name: "user",
        setup: e => (e, t) => (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 1024 1024"
        }, [ vue.createElementVNode("path", {
            fill: "currentColor",
            d: "M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384m0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512m320 320v-96a96 96 0 0 0-96-96H288a96 96 0 0 0-96 96v96a32 32 0 1 1-64 0v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 1 1-64 0"
        }) ]))
    });

    let oe;

    const setActivePinia = e => oe = e, se = Symbol();

    function isPlainObject(e) {
        return e && "object" == typeof e && "[object Object]" === Object.prototype.toString.call(e) && "function" != typeof e.toJSON;
    }

    var ie, re;

    (re = ie || (ie = {})).direct = "direct", re.patchObject = "patch object", re.patchFunction = "patch function";

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

    const fallbackRunWithContext = e => e(), le = Symbol(), pe = Symbol();

    function mergeReactiveObjects(e, t) {
        e instanceof Map && t instanceof Map ? t.forEach(((t, n) => e.set(n, t))) : e instanceof Set && t instanceof Set && t.forEach(e.add, e);
        for (const n in t) {
            if (!t.hasOwnProperty(n)) continue;
            const a = t[n], o = e[n];
            isPlainObject(o) && isPlainObject(a) && e.hasOwnProperty(n) && !vue.isRef(a) && !vue.isReactive(a) ? e[n] = mergeReactiveObjects(o, a) : e[n] = a;
        }
        return e;
    }

    const ce = Symbol();

    const {assign: ue} = Object;

    function createSetupStore(e, t, n = {}, a, o, r) {
        let l;
        const p = ue({
            actions: {}
        }, n), f = {
            deep: !0
        };
        let g, x, b, v = [], w = [];
        const k = a.state.value[e];
        let _;
        function $patch(t) {
            let n;
            g = x = !1, "function" == typeof t ? (t(a.state.value[e]), n = {
                type: ie.patchFunction,
                storeId: e,
                events: b
            }) : (mergeReactiveObjects(a.state.value[e], t), n = {
                type: ie.patchObject,
                payload: t,
                storeId: e,
                events: b
            });
            const o = _ = Symbol();
            vue.nextTick().then((() => {
                _ === o && (g = !0);
            })), x = !0, triggerSubscriptions(v, n, a.state.value[e]);
        }
        r || k || (a.state.value[e] = {}), vue.ref({});
        const q = r ? function() {
            const {state: e} = n, t = e ? e() : {};
            this.$patch((e => {
                ue(e, t);
            }));
        } : noop;
        const action = (t, n = "") => {
            if (le in t) return t[pe] = n, t;
            const wrappedAction = function() {
                setActivePinia(a);
                const n = Array.from(arguments), o = [], s = [];
                let i;
                triggerSubscriptions(w, {
                    args: n,
                    name: wrappedAction[pe],
                    store: T,
                    after: function(e) {
                        o.push(e);
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
                return i instanceof Promise ? i.then((e => (triggerSubscriptions(o, e), e))).catch((e => (triggerSubscriptions(s, e), 
                Promise.reject(e)))) : (triggerSubscriptions(o, i), i);
            };
            return wrappedAction[le] = !0, wrappedAction[pe] = n, wrappedAction;
        }, C = {
            _p: a,
            $id: e,
            $onAction: addSubscription.bind(null, w),
            $patch: $patch,
            $reset: q,
            $subscribe(t, n = {}) {
                const o = addSubscription(v, t, n.detached, (() => s())), s = l.run((() => vue.watch((() => a.state.value[e]), (a => {
                    ("sync" === n.flush ? x : g) && t({
                        storeId: e,
                        type: ie.direct,
                        events: b
                    }, a);
                }), ue({}, f, n))));
                return o;
            },
            $dispose: function() {
                l.stop(), v = [], w = [], a._s.delete(e);
            }
        }, T = vue.reactive(C);
        a._s.set(e, T);
        const A = (a._a && a._a.runWithContext || fallbackRunWithContext)((() => a._e.run((() => (l = vue.effectScope()).run((() => t({
            action: action
        })))))));
        for (const s in A) {
            const t = A[s];
            if (vue.isRef(t) && (!vue.isRef(U = t) || !U.effect) || vue.isReactive(t)) r || (!k || isPlainObject(S = t) && S.hasOwnProperty(ce) || (vue.isRef(t) ? t.value = k[s] : mergeReactiveObjects(t, k[s])), 
            a.state.value[e][s] = t); else if ("function" == typeof t) {
                const e = action(t, s);
                A[s] = e, p.actions[s] = t;
            }
        }
        var S, U;
        return ue(T, A), ue(vue.toRaw(T), A), Object.defineProperty(T, "$state", {
            get: () => a.state.value[e],
            set: e => {
                $patch((t => {
                    ue(t, e);
                }));
            }
        }), a._p.forEach((e => {
            ue(T, l.run((() => e({
                store: T,
                app: a._a,
                pinia: a,
                options: p
            }))));
        })), k && r && n.hydrate && n.hydrate(T.$state, k), g = !0, x = !0, T;
    }

    function defineStore(e, t, n) {
        let a, o;
        const s = "function" == typeof t;
        function useStore(e, n) {
            const i = vue.hasInjectionContext();
            (e = e || (i ? vue.inject(se, null) : null)) && setActivePinia(e), (e = oe)._s.has(a) || (s ? createSetupStore(a, t, o, e) : function(e, t, n) {
                const {state: a, actions: o, getters: s} = t, i = n.state.value[e];
                createSetupStore(e, (function() {
                    i || (n.state.value[e] = a ? a() : {});
                    const t = vue.toRefs(n.state.value[e]);
                    return ue(t, o, Object.keys(s || {}).reduce(((t, a) => (t[a] = vue.markRaw(vue.computed((() => {
                        setActivePinia(n);
                        const t = n._s.get(e);
                        return s[a].call(t, t);
                    }))), t)), {}));
                }), t, n, 0, !0);
            }(a, o, e));
            return e._s.get(a);
        }
        return "string" == typeof e ? (a = e, o = s ? n : t) : (o = e, a = e.id), useStore.$id = a, 
        useStore;
    }

    var de = (() => "undefined" != typeof GM_deleteValue ? GM_deleteValue : void 0)(), he = (() => "undefined" != typeof GM_getValue ? GM_getValue : void 0)(), me = (() => "undefined" != typeof GM_info ? GM_info : void 0)(), fe = (() => "undefined" != typeof GM_listValues ? GM_listValues : void 0)(), ge = (() => "undefined" != typeof GM_setValue ? GM_setValue : void 0)(), ye = (() => "undefined" != typeof GM_xmlhttpRequest ? GM_xmlhttpRequest : void 0)(), xe = (() => "undefined" != typeof unsafeWindow ? unsafeWindow : void 0)();

    const be = "AiAsk_";

    class Cache {
        static set(e, t, n = 0) {
            e = be + e;
            const a = {
                value: t,
                expire: n > 0 ? Date.now() + 1e3 * n : 0
            };
            return ge(e, a), he(e);
        }
        static get(e, t = null) {
            const n = he(e = be + e);
            return n && n.expire && n.expire < Date.now() ? (de(e), t) : n ? n.value : t;
        }
        static match(e) {
            return e = be + e, fe().filter((t => t.startsWith(e)));
        }
        static matchGet(e) {
            const t = be + e;
            let n = fe().filter((e => e.startsWith(t))).map((e => {
                const t = he(e, {
                    value: null,
                    expire: 0
                }).value;
                return t && (t.key = e.replace(be, "")), t;
            })).filter((e => null !== e));
            return n.sort(((e, t) => (t.createTime || 0) - (e.createTime || 0))), n;
        }
        static remove(e) {
            de(be + e);
        }
        static clear() {
            fe().filter((e => e.startsWith(be))).forEach(de);
        }
        static matchRemove(e) {
            e = be + e, fe().filter((t => t.startsWith(e))).forEach(de);
        }
    }

    function getDefaultExportFromCjs(e) {
        return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
    }

    var ve, we, ke = {
        exports: {}
    }, _e = {
        exports: {}
    };

    ve = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", we = {
        rotl: function(e, t) {
            return e << t | e >>> 32 - t;
        },
        rotr: function(e, t) {
            return e << 32 - t | e >>> t;
        },
        endian: function(e) {
            if (e.constructor == Number) return 16711935 & we.rotl(e, 8) | 4278255360 & we.rotl(e, 24);
            for (var t = 0; t < e.length; t++) e[t] = we.endian(e[t]);
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
            for (var t = [], n = 0; n < e.length; n += 3) for (var a = e[n] << 16 | e[n + 1] << 8 | e[n + 2], o = 0; o < 4; o++) 8 * n + 6 * o <= 8 * e.length ? t.push(ve.charAt(a >>> 6 * (3 - o) & 63)) : t.push("=");
            return t.join("");
        },
        base64ToBytes: function(e) {
            e = e.replace(/[^A-Z0-9+\/]/gi, "");
            for (var t = [], n = 0, a = 0; n < e.length; a = ++n % 4) 0 != a && t.push((ve.indexOf(e.charAt(n - 1)) & Math.pow(2, -2 * a + 8) - 1) << 2 * a | ve.indexOf(e.charAt(n)) >>> 6 - 2 * a);
            return t;
        }
    }, _e.exports = we;

    var qe, Ce, Te, Ae, Se, Ue = _e.exports, He = {
        utf8: {
            stringToBytes: function(e) {
                return He.bin.stringToBytes(unescape(encodeURIComponent(e)));
            },
            bytesToString: function(e) {
                return decodeURIComponent(escape(He.bin.bytesToString(e)));
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
    }, Ee = He, isBuffer_1 = function(e) {
        return null != e && (isBuffer(e) || function(e) {
            return "function" == typeof e.readFloatLE && "function" == typeof e.slice && isBuffer(e.slice(0, 0));
        }(e) || !!e._isBuffer);
    };

    function isBuffer(e) {
        return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);
    }

    qe = Ue, Ce = Ee.utf8, Te = isBuffer_1, Ae = Ee.bin, (Se = function(e, t) {
        e.constructor == String ? e = t && "binary" === t.encoding ? Ae.stringToBytes(e) : Ce.stringToBytes(e) : Te(e) ? e = Array.prototype.slice.call(e, 0) : Array.isArray(e) || e.constructor === Uint8Array || (e = e.toString());
        for (var n = qe.bytesToWords(e), a = 8 * e.length, o = 1732584193, s = -271733879, i = -1732584194, r = 271733878, l = 0; l < n.length; l++) n[l] = 16711935 & (n[l] << 8 | n[l] >>> 24) | 4278255360 & (n[l] << 24 | n[l] >>> 8);
        n[a >>> 5] |= 128 << a % 32, n[14 + (a + 64 >>> 9 << 4)] = a;
        var p = Se._ff, c = Se._gg, u = Se._hh, d = Se._ii;
        for (l = 0; l < n.length; l += 16) {
            var h = o, m = s, f = i, g = r;
            o = p(o, s, i, r, n[l + 0], 7, -680876936), r = p(r, o, s, i, n[l + 1], 12, -389564586), 
            i = p(i, r, o, s, n[l + 2], 17, 606105819), s = p(s, i, r, o, n[l + 3], 22, -1044525330), 
            o = p(o, s, i, r, n[l + 4], 7, -176418897), r = p(r, o, s, i, n[l + 5], 12, 1200080426), 
            i = p(i, r, o, s, n[l + 6], 17, -1473231341), s = p(s, i, r, o, n[l + 7], 22, -45705983), 
            o = p(o, s, i, r, n[l + 8], 7, 1770035416), r = p(r, o, s, i, n[l + 9], 12, -1958414417), 
            i = p(i, r, o, s, n[l + 10], 17, -42063), s = p(s, i, r, o, n[l + 11], 22, -1990404162), 
            o = p(o, s, i, r, n[l + 12], 7, 1804603682), r = p(r, o, s, i, n[l + 13], 12, -40341101), 
            i = p(i, r, o, s, n[l + 14], 17, -1502002290), o = c(o, s = p(s, i, r, o, n[l + 15], 22, 1236535329), i, r, n[l + 1], 5, -165796510), 
            r = c(r, o, s, i, n[l + 6], 9, -1069501632), i = c(i, r, o, s, n[l + 11], 14, 643717713), 
            s = c(s, i, r, o, n[l + 0], 20, -373897302), o = c(o, s, i, r, n[l + 5], 5, -701558691), 
            r = c(r, o, s, i, n[l + 10], 9, 38016083), i = c(i, r, o, s, n[l + 15], 14, -660478335), 
            s = c(s, i, r, o, n[l + 4], 20, -405537848), o = c(o, s, i, r, n[l + 9], 5, 568446438), 
            r = c(r, o, s, i, n[l + 14], 9, -1019803690), i = c(i, r, o, s, n[l + 3], 14, -187363961), 
            s = c(s, i, r, o, n[l + 8], 20, 1163531501), o = c(o, s, i, r, n[l + 13], 5, -1444681467), 
            r = c(r, o, s, i, n[l + 2], 9, -51403784), i = c(i, r, o, s, n[l + 7], 14, 1735328473), 
            o = u(o, s = c(s, i, r, o, n[l + 12], 20, -1926607734), i, r, n[l + 5], 4, -378558), 
            r = u(r, o, s, i, n[l + 8], 11, -2022574463), i = u(i, r, o, s, n[l + 11], 16, 1839030562), 
            s = u(s, i, r, o, n[l + 14], 23, -35309556), o = u(o, s, i, r, n[l + 1], 4, -1530992060), 
            r = u(r, o, s, i, n[l + 4], 11, 1272893353), i = u(i, r, o, s, n[l + 7], 16, -155497632), 
            s = u(s, i, r, o, n[l + 10], 23, -1094730640), o = u(o, s, i, r, n[l + 13], 4, 681279174), 
            r = u(r, o, s, i, n[l + 0], 11, -358537222), i = u(i, r, o, s, n[l + 3], 16, -722521979), 
            s = u(s, i, r, o, n[l + 6], 23, 76029189), o = u(o, s, i, r, n[l + 9], 4, -640364487), 
            r = u(r, o, s, i, n[l + 12], 11, -421815835), i = u(i, r, o, s, n[l + 15], 16, 530742520), 
            o = d(o, s = u(s, i, r, o, n[l + 2], 23, -995338651), i, r, n[l + 0], 6, -198630844), 
            r = d(r, o, s, i, n[l + 7], 10, 1126891415), i = d(i, r, o, s, n[l + 14], 15, -1416354905), 
            s = d(s, i, r, o, n[l + 5], 21, -57434055), o = d(o, s, i, r, n[l + 12], 6, 1700485571), 
            r = d(r, o, s, i, n[l + 3], 10, -1894986606), i = d(i, r, o, s, n[l + 10], 15, -1051523), 
            s = d(s, i, r, o, n[l + 1], 21, -2054922799), o = d(o, s, i, r, n[l + 8], 6, 1873313359), 
            r = d(r, o, s, i, n[l + 15], 10, -30611744), i = d(i, r, o, s, n[l + 6], 15, -1560198380), 
            s = d(s, i, r, o, n[l + 13], 21, 1309151649), o = d(o, s, i, r, n[l + 4], 6, -145523070), 
            r = d(r, o, s, i, n[l + 11], 10, -1120210379), i = d(i, r, o, s, n[l + 2], 15, 718787259), 
            s = d(s, i, r, o, n[l + 9], 21, -343485551), o = o + h >>> 0, s = s + m >>> 0, i = i + f >>> 0, 
            r = r + g >>> 0;
        }
        return qe.endian([ o, s, i, r ]);
    })._ff = function(e, t, n, a, o, s, i) {
        var r = e + (t & n | ~t & a) + (o >>> 0) + i;
        return (r << s | r >>> 32 - s) + t;
    }, Se._gg = function(e, t, n, a, o, s, i) {
        var r = e + (t & a | n & ~a) + (o >>> 0) + i;
        return (r << s | r >>> 32 - s) + t;
    }, Se._hh = function(e, t, n, a, o, s, i) {
        var r = e + (t ^ n ^ a) + (o >>> 0) + i;
        return (r << s | r >>> 32 - s) + t;
    }, Se._ii = function(e, t, n, a, o, s, i) {
        var r = e + (n ^ (t | ~a)) + (o >>> 0) + i;
        return (r << s | r >>> 32 - s) + t;
    }, Se._blocksize = 16, Se._digestsize = 16, ke.exports = function(e, t) {
        if (null == e) throw new Error("Illegal argument " + e);
        var n = qe.wordsToBytes(Se(e, t));
        return t && t.asBytes ? n : t && t.asString ? Ae.bytesToString(n) : qe.bytesToHex(n);
    };

    const Ie = getDefaultExportFromCjs(ke.exports), je = [ {
        type: "hook",
        name: "\u4e91\u5e55\u5b66\u82d1hook",
        match: location.host.includes("w-ling.cn"),
        main: e => {
            xe.mainClass = G("#app")[0].__vue__.$route.path;
            let t = new MutationObserver((async e => {
                xe.mainClass !== G("#app")[0].__vue__.$route.path && (xe.mainClass = G("#app")[0].__vue__.$route.path, 
                "homework-detail-container" === xe.mainClass && await waitUntil((function() {
                    return 0 !== G(".selectDan").length;
                })), vuePageChange$1(), t.disconnect());
            }));
            G("#app").length >= 1 && t.observe(G("#app")[0], {
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
            const t = G(e.html).parent().find("h3").text().split("\u3001")[1];
            e.question = e.question.replace(/^\d+\u3001/, ""), e.question = e.question.replace(/\(\d+\u5206\)$/, "");
            let n = G(e.html).find(".anaylize > span:eq(0)").text().replace("\u4f5c\u7b54\u6b63\u786e\uff1a", "");
            switch ("" === n && (n = G(e.html).find(".falsanaly > span:eq(1)").text().replace("\u6b63\u786e\u7b54\u6848\uff1a", "")), 
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
                e.answer = G(e.html).find(".riganswer > span").first().nextAll("span").map(((e, t) => removeHtml(G(t).text()))).get(), 
                e.type = "2";
            }
            return e;
        }
    }, {
        type: "ask",
        name: "\u4e91\u5e55\u5b66\u82d1",
        tips: "",
        match: () => location.host.includes("w-ling.cn") && (location.href.includes("practicePaper") || location.href.includes("examIndex")),
        types: [ "0", "1", "3" ],
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
                return 0 !== G(".selectDan >div >div").length;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            e.question = e.question.replace(/^\d+\u3001/, ""), e.question = e.question.replace(/\(\d+\u5206\)$/, "");
            switch (G(e.html).parent().find("h4").text().split("\u3001")[1]) {
              case "\u5355\u9009\u9898":
                e.type = "0";
                break;

              case "\u591a\u9009\u9898":
                e.type = "1";
                break;

              case "\u5224\u65ad\u9898":
                e.type = "3", e.$options = G(e.html).find(".selectItem label"), e.options = e.$options.map(((e, t) => removeHtml(G(t).text()))).get(), 
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
                return G(e.html).find(".tiankong input").each(((t, n) => {
                    let a = G(n).parent()[0].__vue__;
                    G(n).val(e.answer[t]);
                    const o = new Event("input");
                    n.dispatchEvent(o), a.$emit("change", e.answer[t]);
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
                    } catch (o) {
                        n({
                            form: "\u4e00\u4e4b\u9898\u5e93",
                            answer: null,
                            error: o,
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
            e.type, e.question, e.options;
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
                workType: e.workType,
                pageType: e.pageType
            };
            return new Promise((e => {
                requestApi("https://www.aiask.site/v1/question/search", "POST", t, {}).then((t => {
                    let n = t[1];
                    200 === (t = JSON.parse(t[0].responseText)).code && t.data.answer ? e({
                        form: "\u7231\u95ee\u7b54\u9898\u5e93",
                        answer: t.data.answer,
                        duration: n,
                        msg: t.message
                    }) : 401 === t.code ? e({
                        form: "\u7231\u95ee\u7b54\u9898\u5e93",
                        answer: "",
                        duration: n,
                        msg: t.message,
                        needLogin: !0
                    }) : e({
                        form: "\u7231\u95ee\u7b54\u9898\u5e93",
                        answer: "",
                        duration: n,
                        msg: t.message
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
                requestApi("https://www.aiask.site/v1/question/sync", "POST", e, {}).then((e => {
                    e[0].responseText, t(e[0].responseText);
                })).catch((e => {
                    t(e);
                }));
            }));
        }
        static async syncPaper(e) {
            return new Promise(((t, n) => {
                requestApi("https://www.aiask.site/v1/question/courseSync", "POST", e, {}).then((e => {
                    try {
                        const n = e[0].responseText, a = JSON.parse(n);
                        a && (200 === a.code || 0 === a.code || a.success), t(a);
                    } catch (n) {
                        t({
                            code: -1,
                            error: n,
                            msg: "\u54cd\u5e94\u89e3\u6790\u5931\u8d25"
                        });
                    }
                })).catch((e => {
                    t({
                        code: -1,
                        error: e,
                        msg: "\u7f51\u7edc\u8bf7\u6c42\u5931\u8d25"
                    });
                }));
            }));
        }
    }

    const defaultSetAnswer = async (e, t, n, a) => {
        var o;
        switch (e) {
          case "xx":
            for (let o = 0; o < n.$options.length; o++) if (t.includes(o)) {
                if (a.ischecked && a.ischecked(n.$options.eq(o))) continue;
                n.$options.eq(o).click(), await sleep(Math.floor(300 * Math.random() + 200));
            } else a.ischecked && a.ischecked(n.$options.eq(o)) && (n.$options.eq(o).click(), 
            await sleep(Math.floor(300 * Math.random() + 200)));
            break;

          case "pd":
            let e = t;
            0 == n.options.length ? n.$options.each(((t, n) => {
                isTrue(e) && isTrue(removeHtml(G(n).html())) && G(n).click(), isFalse(e) && isFalse(removeHtml(G(n).html())) && G(n).click();
            })) : n.$options.each(((t, a) => {
                isTrue(e) && isTrue(n.options[t]) && G(a).click(), isFalse(e) && isFalse(n.options[t]) && G(a).click();
            }));
            break;

          case "jd":
            G(n.html).find("textarea").each((function(e) {
                xe.UE.getEditor(G(this).attr("name")).ready((function() {
                    this.setContent(t[e].replace(/\u7b2c.\u7a7a:/g, ""));
                }));
            })), null == (o = G(n.html).find(".savebtndiv>a")) || o.click();
        }
    }, ApiAnswerMatch = (e, t, n = !1) => {
        const a = getAskStore();
        let o, s = 0, i = !0, r = t.type, l = t.html, p = [], c = [ "", p, t, a.rule ];
        switch (t.$options && "function" == typeof t.$options && (t.$options = t.$options()), 
        r) {
          case "0":
          case "1":
            for (let o = 0; o < e.length; o++) {
                let a = e[o].answer;
                "" == a && (a = []), n && (Array.isArray(a) ? a = a.map((e => {
                    let n = e.charCodeAt() - 65;
                    return t.options[n];
                })) : (a = a.replace(/[^a-zA-Z]/g, ""), a = a.split("").map((e => {
                    let n = e.charCodeAt() - 65;
                    return t.options[n];
                }))));
                let s = matchAnswer(a, t.options);
                e[o].match = s;
            }
            if (p = e.filter((e => e.match.length > 0)), 0 === p.length) return {
                res: e,
                haveAnswer: !1
            };
            if (p.length > 1) {
                if (!p.every((e => e.match.length === p[0].match.length))) {
                    let e = p[0];
                    for (let t = 1; t < p.length; t++) p[t].match.length > e.match.length && (e = p[t]);
                    p = [ e ];
                }
            }
            let a = p[0].match;
            c[0] = "xx", c[1] = a;
            break;

          case "3":
            if (p = e.map((e => {
                let t = e.answer;
                return "object" == typeof t && (t = t[0]), isTrue(t) ? e.answer = "\u6b63\u786e" : isFalse(t) ? e.answer = "\u9519\u8bef" : e.answer = "", 
                e;
            })), p = e.filter((e => "" !== e.answer)), 0 === p.length) return {
                res: e,
                haveAnswer: !1
            };
            c[0] = "pd", c[1] = p[0].answer;
            break;

          case "2":
          case "9":
          case "4":
          case "5":
          case "6":
          case "7":
            if (s = G(l).find("textarea").length, 0 === s && (s = t.$options.length), p = e.filter((e => e.answer.length > 0)), 
            0 === p.length) return {
                res: e,
                haveAnswer: !1
            };
            if (o = p[0].answer, "string" == typeof o && (o = [ o ]), 0 !== s && (p = p.filter((e => ("string" == typeof e.answer ? 1 : e.answer.length) === s)), 
            0 === p.length)) return {
                res: e,
                haveAnswer: !1
            };
            c[0] = "jd", c[1] = o;
            break;

          case "14":
            if (s = t.$options.length, p = e.filter((e => e.answer.length > 0 && e.answer.length === s)), 
            0 === p.length) return {
                res: e,
                haveAnswer: !1
            };
            if (o = p[0].answer, p = p.filter((e => ("string" == typeof e.answer ? 1 : e.answer.length) === s)), 
            0 === p.length) return {
                res: e,
                haveAnswer: !1
            };
            c[0] = "wxtk", c[1] = o;
            break;

          case "11":
            if (p = e.filter((e => "object" == typeof e.answer)), 0 === p.length) return {
                res: e,
                haveAnswer: !1
            };
            o = p[0].answer, c[0] = "lx", c[1] = o;
            break;

          default:
            return {
                res: e,
                haveAnswer: !1
            };
        }
        return a.rule.setAnswerHook && "function" == typeof a.rule.setAnswerHook && a.rule.setAnswerHook({
            type: r,
            answer: c[1],
            html: t.html,
            ques: t
        }), a.rule.setAnswer && "function" == typeof a.rule.setAnswer && (i = a.rule.setAnswer({
            type: r,
            answer: c[1],
            html: l,
            ques: t,
            rule: a.rule
        })), i && defaultSetAnswer(c[0], c[1], t, a.rule), {
            res: e,
            form: p ? p[0] : [],
            haveAnswer: !0
        };
    }, ze = class _Paper {
        static getPaper(e) {
            return Cache.get(`${_Paper.prefix}_${e}`);
        }
        static getLastSyncedHashes(e) {
            const t = Cache.get(`${_Paper.lastSyncedPrefix}_${e}`, {
                questions: [],
                chapters: []
            });
            return {
                questions: new Set(t.questions || []),
                chapters: new Set(t.chapters || [])
            };
        }
        static setLastSyncedHashes(e, t, n) {
            Cache.set(`${_Paper.lastSyncedPrefix}_${e}`, {
                questions: t,
                chapters: n
            });
        }
        static compareAndGetNewData(e, t) {
            const n = _Paper.getLastSyncedHashes(t), a = new Set, o = new Set, s = new Map, i = new Map;
            e.chapter && Array.isArray(e.chapter) && e.chapter.forEach((e => {
                const t = e.hash;
                o.add(t);
                const n = new Map;
                e.question && Array.isArray(e.question) && e.question.forEach((e => {
                    const t = e.hash;
                    a.add(t), s.set(t, e), n.set(t, e);
                })), i.set(t, {
                    chapter: e,
                    questions: n
                });
            }));
            const r = [], l = [];
            a.forEach((e => {
                n.questions.has(e) || r.push(e);
            })), o.forEach((e => {
                n.chapters.has(e) || l.push(e);
            }));
            const p = {
                hash: e.hash,
                name: e.name,
                platform: e.platform,
                info: e.info,
                chapter: []
            };
            return i.forEach(((e, t) => {
                if (l.includes(t)) p.chapter.push({
                    hash: e.chapter.hash,
                    name: e.chapter.name,
                    question: Array.from(e.questions.values())
                }); else {
                    const t = [];
                    e.questions.forEach(((e, n) => {
                        r.includes(n) && t.push(e);
                    })), t.length > 0 && p.chapter.push({
                        hash: e.chapter.hash,
                        name: e.chapter.name,
                        question: t
                    });
                }
            })), {
                newData: p,
                newQuestionHashes: r,
                newChapterHashes: l
            };
        }
        static async setPaper(e, t) {
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
            })), Cache.set(`${_Paper.prefix}_${e}`, n);
            const {newData: a, newQuestionHashes: o, newChapterHashes: s} = _Paper.compareAndGetNewData(n, e);
            if (o.length > 0 || s.length > 0) {
                if (0 === a.chapter.length) return;
                o.length, s.length;
                try {
                    const t = await Answer.syncPaper(a);
                    let n;
                    if ("string" == typeof t) try {
                        n = JSON.parse(t);
                    } catch (i) {
                        return;
                    } else n = t;
                    if (!n || 200 !== n.code && 0 !== n.code && !0 !== n.success) JSON.stringify(n); else {
                        const t = _Paper.getLastSyncedHashes(e), n = Array.from(new Set([ ...t.questions, ...o ])), a = Array.from(new Set([ ...t.chapters, ...s ]));
                        _Paper.setLastSyncedHashes(e, n, a), o.length, s.length;
                    }
                } catch (r) {}
            }
        }
        static hasChapter(e, t) {
            const n = _Paper.getPaper(e);
            return !(!n || !n.chapter) && n.chapter.some((e => e.hash === t));
        }
        static getAllPapers() {
            return Cache.matchGet(`${_Paper.prefix}_`);
        }
    };

    __publicField(ze, "prefix", "paper_"), __publicField(ze, "lastSyncedPrefix", "paper_last_synced_");

    let Oe = ze;

    var $e = {
        parse: function(e) {
            var t = $e._bin, n = new Uint8Array(e), a = 0;
            t.readFixed(n, a), a += 4;
            var o = t.readUshort(n, a);
            a += 2, t.readUshort(n, a), a += 2, t.readUshort(n, a), a += 2, t.readUshort(n, a), 
            a += 2;
            for (var s = [ "cmap", "head", "hhea", "maxp", "hmtx", "name", "OS/2", "post", "loca", "glyf", "kern", "CFF ", "GPOS", "GSUB", "SVG " ], i = {
                _data: n
            }, r = {}, l = 0; l < o; l++) {
                var p = t.readASCII(n, a, 4);
                a += 4, t.readUint(n, a), a += 4;
                var c = t.readUint(n, a);
                a += 4;
                var u = t.readUint(n, a);
                a += 4, r[p] = {
                    offset: c,
                    length: u
                };
            }
            for (l = 0; l < s.length; l++) {
                var d = s[l];
                r[d] && (i[d.trim()] = $e[d.trim()].parse(n, r[d].offset, r[d].length, i));
            }
            return i;
        },
        _tabOffset: function(e, t) {
            for (var n = $e._bin, a = n.readUshort(e, 4), o = 12, s = 0; s < a; s++) {
                var i = n.readASCII(e, o, 4);
                o += 4, n.readUint(e, o), o += 4;
                var r = n.readUint(e, o);
                if (o += 4, n.readUint(e, o), o += 4, i == t) return r;
            }
            return 0;
        }
    };

    $e._bin = {
        readFixed: function(e, t) {
            return (e[t] << 8 | e[t + 1]) + (e[t + 2] << 8 | e[t + 3]) / 65540;
        },
        readF2dot14: function(e, t) {
            return $e._bin.readShort(e, t) / 16384;
        },
        readInt: function(e, t) {
            var n = $e._bin.t.uint8;
            return n[0] = e[t + 3], n[1] = e[t + 2], n[2] = e[t + 1], n[3] = e[t], $e._bin.t.int32[0];
        },
        readInt8: function(e, t) {
            return $e._bin.t.uint8[0] = e[t], $e._bin.t.int8[0];
        },
        readShort: function(e, t) {
            var n = $e._bin.t.uint8;
            return n[1] = e[t], n[0] = e[t + 1], $e._bin.t.int16[0];
        },
        readUshort: function(e, t) {
            return e[t] << 8 | e[t + 1];
        },
        readUshorts: function(e, t, n) {
            for (var a = [], o = 0; o < n; o++) a.push($e._bin.readUshort(e, t + 2 * o));
            return a;
        },
        readUint: function(e, t) {
            var n = $e._bin.t.uint8;
            return n[3] = e[t], n[2] = e[t + 1], n[1] = e[t + 2], n[0] = e[t + 3], $e._bin.t.uint32[0];
        },
        readUint64: function(e, t) {
            return 4294967296 * $e._bin.readUint(e, t) + $e._bin.readUint(e, t + 4);
        },
        readASCII: function(e, t, n) {
            for (var a = "", o = 0; o < n; o++) a += String.fromCharCode(e[t + o]);
            return a;
        },
        readUnicode: function(e, t, n) {
            for (var a = "", o = 0; o < n; o++) {
                var s = e[t++] << 8 | e[t++];
                a += String.fromCharCode(s);
            }
            return a;
        },
        _tdec: window.TextDecoder ? new window.TextDecoder : null,
        readUTF8: function(e, t, n) {
            var a = $e._bin._tdec;
            return a && 0 == t && n == e.length ? a.decode(e) : $e._bin.readASCII(e, t, n);
        },
        readBytes: function(e, t, n) {
            for (var a = [], o = 0; o < n; o++) a.push(e[t + o]);
            return a;
        },
        readASCIIArray: function(e, t, n) {
            for (var a = [], o = 0; o < n; o++) a.push(String.fromCharCode(e[t + o]));
            return a;
        }
    }, $e._bin.t = {
        buff: new ArrayBuffer(8)
    }, $e._bin.t.int8 = new Int8Array($e._bin.t.buff), $e._bin.t.uint8 = new Uint8Array($e._bin.t.buff), 
    $e._bin.t.int16 = new Int16Array($e._bin.t.buff), $e._bin.t.uint16 = new Uint16Array($e._bin.t.buff), 
    $e._bin.t.int32 = new Int32Array($e._bin.t.buff), $e._bin.t.uint32 = new Uint32Array($e._bin.t.buff), 
    $e._lctf = {}, $e._lctf.parse = function(e, t, n, a, o) {
        var s = $e._bin, i = {}, r = t;
        s.readFixed(e, t), t += 4;
        var l = s.readUshort(e, t);
        t += 2;
        var p = s.readUshort(e, t);
        t += 2;
        var c = s.readUshort(e, t);
        return t += 2, i.scriptList = $e._lctf.readScriptList(e, r + l), i.featureList = $e._lctf.readFeatureList(e, r + p), 
        i.lookupList = $e._lctf.readLookupList(e, r + c, o), i;
    }, $e._lctf.readLookupList = function(e, t, n) {
        var a = $e._bin, o = t, s = [], i = a.readUshort(e, t);
        t += 2;
        for (var r = 0; r < i; r++) {
            var l = a.readUshort(e, t);
            t += 2;
            var p = $e._lctf.readLookupTable(e, o + l, n);
            s.push(p);
        }
        return s;
    }, $e._lctf.readLookupTable = function(e, t, n) {
        var a = $e._bin, o = t, s = {
            tabs: []
        };
        s.ltype = a.readUshort(e, t), t += 2, s.flag = a.readUshort(e, t), t += 2;
        var i = a.readUshort(e, t);
        t += 2;
        for (var r = 0; r < i; r++) {
            var l = a.readUshort(e, t);
            t += 2;
            var p = n(e, s.ltype, o + l);
            s.tabs.push(p);
        }
        return s;
    }, $e._lctf.numOfOnes = function(e) {
        for (var t = 0, n = 0; n < 32; n++) e >>> n & 1 && t++;
        return t;
    }, $e._lctf.readClassDef = function(e, t) {
        var n = $e._bin, a = [], o = n.readUshort(e, t);
        if (t += 2, 1 == o) {
            var s = n.readUshort(e, t);
            t += 2;
            var i = n.readUshort(e, t);
            t += 2;
            for (var r = 0; r < i; r++) a.push(s + r), a.push(s + r), a.push(n.readUshort(e, t)), 
            t += 2;
        }
        if (2 == o) {
            var l = n.readUshort(e, t);
            t += 2;
            for (r = 0; r < l; r++) a.push(n.readUshort(e, t)), t += 2, a.push(n.readUshort(e, t)), 
            t += 2, a.push(n.readUshort(e, t)), t += 2;
        }
        return a;
    }, $e._lctf.getInterval = function(e, t) {
        for (var n = 0; n < e.length; n += 3) {
            var a = e[n], o = e[n + 1];
            if (e[n + 2], a <= t && t <= o) return n;
        }
        return -1;
    }, $e._lctf.readValueRecord = function(e, t, n) {
        var a = $e._bin, o = [];
        return o.push(1 & n ? a.readShort(e, t) : 0), t += 1 & n ? 2 : 0, o.push(2 & n ? a.readShort(e, t) : 0), 
        t += 2 & n ? 2 : 0, o.push(4 & n ? a.readShort(e, t) : 0), t += 4 & n ? 2 : 0, o.push(8 & n ? a.readShort(e, t) : 0), 
        t += 8 & n ? 2 : 0, o;
    }, $e._lctf.readCoverage = function(e, t) {
        var n = $e._bin, a = {};
        a.fmt = n.readUshort(e, t), t += 2;
        var o = n.readUshort(e, t);
        return t += 2, 1 == a.fmt && (a.tab = n.readUshorts(e, t, o)), 2 == a.fmt && (a.tab = n.readUshorts(e, t, 3 * o)), 
        a;
    }, $e._lctf.coverageIndex = function(e, t) {
        var n = e.tab;
        if (1 == e.fmt) return n.indexOf(t);
        if (2 == e.fmt) {
            var a = $e._lctf.getInterval(n, t);
            if (-1 != a) return n[a + 2] + (t - n[a]);
        }
        return -1;
    }, $e._lctf.readFeatureList = function(e, t) {
        var n = $e._bin, a = t, o = [], s = n.readUshort(e, t);
        t += 2;
        for (var i = 0; i < s; i++) {
            var r = n.readASCII(e, t, 4);
            t += 4;
            var l = n.readUshort(e, t);
            t += 2, o.push({
                tag: r.trim(),
                tab: $e._lctf.readFeatureTable(e, a + l)
            });
        }
        return o;
    }, $e._lctf.readFeatureTable = function(e, t) {
        var n = $e._bin;
        n.readUshort(e, t), t += 2;
        var a = n.readUshort(e, t);
        t += 2;
        for (var o = [], s = 0; s < a; s++) o.push(n.readUshort(e, t + 2 * s));
        return o;
    }, $e._lctf.readScriptList = function(e, t) {
        var n = $e._bin, a = t, o = {}, s = n.readUshort(e, t);
        t += 2;
        for (var i = 0; i < s; i++) {
            var r = n.readASCII(e, t, 4);
            t += 4;
            var l = n.readUshort(e, t);
            t += 2, o[r.trim()] = $e._lctf.readScriptTable(e, a + l);
        }
        return o;
    }, $e._lctf.readScriptTable = function(e, t) {
        var n = $e._bin, a = t, o = {}, s = n.readUshort(e, t);
        t += 2, o.default = $e._lctf.readLangSysTable(e, a + s);
        var i = n.readUshort(e, t);
        t += 2;
        for (var r = 0; r < i; r++) {
            var l = n.readASCII(e, t, 4);
            t += 4;
            var p = n.readUshort(e, t);
            t += 2, o[l.trim()] = $e._lctf.readLangSysTable(e, a + p);
        }
        return o;
    }, $e._lctf.readLangSysTable = function(e, t) {
        var n = $e._bin, a = {};
        n.readUshort(e, t), t += 2, a.reqFeature = n.readUshort(e, t), t += 2;
        var o = n.readUshort(e, t);
        return t += 2, a.features = n.readUshorts(e, t, o), a;
    }, $e.CFF = {}, $e.CFF.parse = function(e, t, n) {
        var a = $e._bin;
        (e = new Uint8Array(e.buffer, t, n))[t = 0], e[++t], e[++t], e[++t], t++;
        var o = [];
        t = $e.CFF.readIndex(e, t, o);
        for (var s = [], i = 0; i < o.length - 1; i++) s.push(a.readASCII(e, t + o[i], o[i + 1] - o[i]));
        t += o[o.length - 1];
        var r = [];
        t = $e.CFF.readIndex(e, t, r);
        var l = [];
        for (i = 0; i < r.length - 1; i++) l.push($e.CFF.readDict(e, t + r[i], t + r[i + 1]));
        t += r[r.length - 1];
        var p = l[0], c = [];
        t = $e.CFF.readIndex(e, t, c);
        var u = [];
        for (i = 0; i < c.length - 1; i++) u.push(a.readASCII(e, t + c[i], c[i + 1] - c[i]));
        if (t += c[c.length - 1], $e.CFF.readSubrs(e, t, p), p.CharStrings) {
            t = p.CharStrings;
            c = [];
            t = $e.CFF.readIndex(e, t, c);
            var d = [];
            for (i = 0; i < c.length - 1; i++) d.push(a.readBytes(e, t + c[i], c[i + 1] - c[i]));
            p.CharStrings = d;
        }
        p.Encoding && (p.Encoding = $e.CFF.readEncoding(e, p.Encoding, p.CharStrings.length)), 
        p.charset && (p.charset = $e.CFF.readCharset(e, p.charset, p.CharStrings.length)), 
        p.Private && (t = p.Private[1], p.Private = $e.CFF.readDict(e, t, t + p.Private[0]), 
        p.Private.Subrs && $e.CFF.readSubrs(e, t + p.Private.Subrs, p.Private));
        var h = {};
        for (var m in p) -1 != [ "FamilyName", "FullName", "Notice", "version", "Copyright" ].indexOf(m) ? h[m] = u[p[m] - 426 + 35] : h[m] = p[m];
        return h;
    }, $e.CFF.readSubrs = function(e, t, n) {
        var a = $e._bin, o = [];
        t = $e.CFF.readIndex(e, t, o);
        var s, i = o.length;
        s = i < 1240 ? 107 : i < 33900 ? 1131 : 32768, n.Bias = s, n.Subrs = [];
        for (var r = 0; r < o.length - 1; r++) n.Subrs.push(a.readBytes(e, t + o[r], o[r + 1] - o[r]));
    }, $e.CFF.tableSE = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117, 118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131, 0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0, 0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0 ], 
    $e.CFF.glyphByUnicode = function(e, t) {
        for (var n = 0; n < e.charset.length; n++) if (e.charset[n] == t) return n;
        return -1;
    }, $e.CFF.glyphBySE = function(e, t) {
        return t < 0 || t > 255 ? -1 : $e.CFF.glyphByUnicode(e, $e.CFF.tableSE[t]);
    }, $e.CFF.readEncoding = function(e, t, n) {
        $e._bin;
        var a = [ ".notdef" ], o = e[t];
        if (t++, 0 != o) throw "error: unknown encoding format: " + o;
        var s = e[t];
        t++;
        for (var i = 0; i < s; i++) a.push(e[t + i]);
        return a;
    }, $e.CFF.readCharset = function(e, t, n) {
        var a = $e._bin, o = [ ".notdef" ], s = e[t];
        if (t++, 0 == s) for (var i = 0; i < n; i++) {
            var r = a.readUshort(e, t);
            t += 2, o.push(r);
        } else {
            if (1 != s && 2 != s) throw "error: format: " + s;
            for (;o.length < n; ) {
                r = a.readUshort(e, t);
                t += 2;
                var l = 0;
                1 == s ? (l = e[t], t++) : (l = a.readUshort(e, t), t += 2);
                for (i = 0; i <= l; i++) o.push(r), r++;
            }
        }
        return o;
    }, $e.CFF.readIndex = function(e, t, n) {
        var a = $e._bin, o = a.readUshort(e, t), s = e[t += 2];
        if (t++, 1 == s) for (var i = 0; i < o + 1; i++) n.push(e[t + i]); else if (2 == s) for (i = 0; i < o + 1; i++) n.push(a.readUshort(e, t + 2 * i)); else if (3 == s) for (i = 0; i < o + 1; i++) n.push(16777215 & a.readUint(e, t + 3 * i - 1)); else if (0 != o) throw "unsupported offset size: " + s + ", count: " + o;
        return (t += (o + 1) * s) - 1;
    }, $e.CFF.getCharString = function(e, t, n) {
        var a = $e._bin, o = e[t], s = e[t + 1];
        e[t + 2], e[t + 3], e[t + 4];
        var i = 1, r = null, l = null;
        o <= 20 && (r = o, i = 1), 12 == o && (r = 100 * o + s, i = 2), 21 <= o && o <= 27 && (r = o, 
        i = 1), 28 == o && (l = a.readShort(e, t + 1), i = 3), 29 <= o && o <= 31 && (r = o, 
        i = 1), 32 <= o && o <= 246 && (l = o - 139, i = 1), 247 <= o && o <= 250 && (l = 256 * (o - 247) + s + 108, 
        i = 2), 251 <= o && o <= 254 && (l = 256 * -(o - 251) - s - 108, i = 2), 255 == o && (l = a.readInt(e, t + 1) / 65535, 
        i = 5), n.val = null != l ? l : "o" + r, n.size = i;
    }, $e.CFF.readCharString = function(e, t, n) {
        for (var a = t + n, o = $e._bin, s = []; t < a; ) {
            var i = e[t], r = e[t + 1];
            e[t + 2], e[t + 3], e[t + 4];
            var l = 1, p = null, c = null;
            i <= 20 && (p = i, l = 1), 12 == i && (p = 100 * i + r, l = 2), 19 != i && 20 != i || (p = i, 
            l = 2), 21 <= i && i <= 27 && (p = i, l = 1), 28 == i && (c = o.readShort(e, t + 1), 
            l = 3), 29 <= i && i <= 31 && (p = i, l = 1), 32 <= i && i <= 246 && (c = i - 139, 
            l = 1), 247 <= i && i <= 250 && (c = 256 * (i - 247) + r + 108, l = 2), 251 <= i && i <= 254 && (c = 256 * -(i - 251) - r - 108, 
            l = 2), 255 == i && (c = o.readInt(e, t + 1) / 65535, l = 5), s.push(null != c ? c : "o" + p), 
            t += l;
        }
        return s;
    }, $e.CFF.readDict = function(e, t, n) {
        for (var a = $e._bin, o = {}, s = []; t < n; ) {
            var i = e[t], r = e[t + 1];
            e[t + 2], e[t + 3], e[t + 4];
            var l = 1, p = null, c = null;
            if (28 == i && (c = a.readShort(e, t + 1), l = 3), 29 == i && (c = a.readInt(e, t + 1), 
            l = 5), 32 <= i && i <= 246 && (c = i - 139, l = 1), 247 <= i && i <= 250 && (c = 256 * (i - 247) + r + 108, 
            l = 2), 251 <= i && i <= 254 && (c = 256 * -(i - 251) - r - 108, l = 2), 255 == i) throw c = a.readInt(e, t + 1) / 65535, 
            l = 5, "unknown number";
            if (30 == i) {
                var u = [];
                for (l = 1; ;) {
                    var d = e[t + l];
                    l++;
                    var h = d >> 4, m = 15 & d;
                    if (15 != h && u.push(h), 15 != m && u.push(m), 15 == m) break;
                }
                for (var f = "", g = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber" ], y = 0; y < u.length; y++) f += g[u[y]];
                c = parseFloat(f);
            }
            if (i <= 21) if (p = [ "version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues", "FamilyOtherBlues", "StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", "defaultWidthX", "nominalWidthX" ][i], 
            l = 1, 12 == i) p = [ "Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale", "BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", 0, 0, "LanguageGroup", "ExpansionFactor", "initialRandomSeed", "SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", 0, 0, 0, 0, 0, 0, "ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName" ][r], 
            l = 2;
            null != p ? (o[p] = 1 == s.length ? s[0] : s, s = []) : s.push(c), t += l;
        }
        return o;
    }, $e.cmap = {}, $e.cmap.parse = function(e, t, n) {
        e = new Uint8Array(e.buffer, t, n), t = 0;
        var a = $e._bin, o = {};
        a.readUshort(e, t), t += 2;
        var s = a.readUshort(e, t);
        t += 2;
        var i = [];
        o.tables = [];
        for (var r = 0; r < s; r++) {
            var l = a.readUshort(e, t);
            t += 2;
            var p = a.readUshort(e, t);
            t += 2;
            var c = a.readUint(e, t);
            t += 4;
            var u = "p" + l + "e" + p, d = i.indexOf(c);
            if (-1 == d) {
                var h;
                d = o.tables.length, i.push(c);
                var m = a.readUshort(e, c);
                0 == m ? h = $e.cmap.parse0(e, c) : 4 == m ? h = $e.cmap.parse4(e, c) : 6 == m ? h = $e.cmap.parse6(e, c) : 12 == m ? h = $e.cmap.parse12(e, c) : console.log("unknown format: " + m, l, p, c), 
                o.tables.push(h);
            }
            if (null != o[u]) throw "multiple tables for one platform+encoding";
            o[u] = d;
        }
        return o;
    }, $e.cmap.parse0 = function(e, t) {
        var n = $e._bin, a = {};
        a.format = n.readUshort(e, t), t += 2;
        var o = n.readUshort(e, t);
        t += 2, n.readUshort(e, t), t += 2, a.map = [];
        for (var s = 0; s < o - 6; s++) a.map.push(e[t + s]);
        return a;
    }, $e.cmap.parse4 = function(e, t) {
        var n = $e._bin, a = t, o = {};
        o.format = n.readUshort(e, t), t += 2;
        var s = n.readUshort(e, t);
        t += 2, n.readUshort(e, t), t += 2;
        var i = n.readUshort(e, t);
        t += 2;
        var r = i / 2;
        o.searchRange = n.readUshort(e, t), t += 2, o.entrySelector = n.readUshort(e, t), 
        t += 2, o.rangeShift = n.readUshort(e, t), t += 2, o.endCount = n.readUshorts(e, t, r), 
        t += 2 * r, t += 2, o.startCount = n.readUshorts(e, t, r), t += 2 * r, o.idDelta = [];
        for (var l = 0; l < r; l++) o.idDelta.push(n.readShort(e, t)), t += 2;
        for (o.idRangeOffset = n.readUshorts(e, t, r), t += 2 * r, o.glyphIdArray = []; t < a + s; ) o.glyphIdArray.push(n.readUshort(e, t)), 
        t += 2;
        return o;
    }, $e.cmap.parse6 = function(e, t) {
        var n = $e._bin, a = {};
        a.format = n.readUshort(e, t), t += 2, n.readUshort(e, t), t += 2, n.readUshort(e, t), 
        t += 2, a.firstCode = n.readUshort(e, t), t += 2;
        var o = n.readUshort(e, t);
        t += 2, a.glyphIdArray = [];
        for (var s = 0; s < o; s++) a.glyphIdArray.push(n.readUshort(e, t)), t += 2;
        return a;
    }, $e.cmap.parse12 = function(e, t) {
        var n = $e._bin, a = {};
        a.format = n.readUshort(e, t), t += 2, t += 2, n.readUint(e, t), t += 4, n.readUint(e, t), 
        t += 4;
        var o = n.readUint(e, t);
        t += 4, a.groups = [];
        for (var s = 0; s < o; s++) {
            var i = t + 12 * s, r = n.readUint(e, i + 0), l = n.readUint(e, i + 4), p = n.readUint(e, i + 8);
            a.groups.push([ r, l, p ]);
        }
        return a;
    }, $e.glyf = {}, $e.glyf.parse = function(e, t, n, a) {
        for (var o = [], s = 0; s < a.maxp.numGlyphs; s++) o.push(null);
        return o;
    }, $e.glyf._parseGlyf = function(e, t) {
        var n = $e._bin, a = e._data, o = $e._tabOffset(a, "glyf") + e.loca[t];
        if (e.loca[t] == e.loca[t + 1]) return null;
        var s = {};
        if (s.noc = n.readShort(a, o), o += 2, s.xMin = n.readShort(a, o), o += 2, s.yMin = n.readShort(a, o), 
        o += 2, s.xMax = n.readShort(a, o), o += 2, s.yMax = n.readShort(a, o), o += 2, 
        s.xMin >= s.xMax || s.yMin >= s.yMax) return null;
        if (s.noc > 0) {
            s.endPts = [];
            for (var i = 0; i < s.noc; i++) s.endPts.push(n.readUshort(a, o)), o += 2;
            var r = n.readUshort(a, o);
            if (o += 2, a.length - o < r) return null;
            s.instructions = n.readBytes(a, o, r), o += r;
            var l = s.endPts[s.noc - 1] + 1;
            s.flags = [];
            for (i = 0; i < l; i++) {
                var p = a[o];
                if (o++, s.flags.push(p), 8 & p) {
                    var c = a[o];
                    o++;
                    for (var u = 0; u < c; u++) s.flags.push(p), i++;
                }
            }
            s.xs = [];
            for (i = 0; i < l; i++) {
                var d = !!(2 & s.flags[i]), h = !!(16 & s.flags[i]);
                d ? (s.xs.push(h ? a[o] : -a[o]), o++) : h ? s.xs.push(0) : (s.xs.push(n.readShort(a, o)), 
                o += 2);
            }
            s.ys = [];
            for (i = 0; i < l; i++) {
                d = !!(4 & s.flags[i]), h = !!(32 & s.flags[i]);
                d ? (s.ys.push(h ? a[o] : -a[o]), o++) : h ? s.ys.push(0) : (s.ys.push(n.readShort(a, o)), 
                o += 2);
            }
            var m = 0, f = 0;
            for (i = 0; i < l; i++) m += s.xs[i], f += s.ys[i], s.xs[i] = m, s.ys[i] = f;
        } else {
            var g;
            s.parts = [];
            do {
                g = n.readUshort(a, o), o += 2;
                var y = {
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
                if (s.parts.push(y), y.glyphIndex = n.readUshort(a, o), o += 2, 1 & g) {
                    var x = n.readShort(a, o);
                    o += 2;
                    var b = n.readShort(a, o);
                    o += 2;
                } else {
                    x = n.readInt8(a, o);
                    o++;
                    b = n.readInt8(a, o);
                    o++;
                }
                2 & g ? (y.m.tx = x, y.m.ty = b) : (y.p1 = x, y.p2 = b), 8 & g ? (y.m.a = y.m.d = n.readF2dot14(a, o), 
                o += 2) : 64 & g ? (y.m.a = n.readF2dot14(a, o), o += 2, y.m.d = n.readF2dot14(a, o), 
                o += 2) : 128 & g && (y.m.a = n.readF2dot14(a, o), o += 2, y.m.b = n.readF2dot14(a, o), 
                o += 2, y.m.c = n.readF2dot14(a, o), o += 2, y.m.d = n.readF2dot14(a, o), o += 2);
            } while (32 & g);
            if (256 & g) {
                var v = n.readUshort(a, o);
                o += 2, s.instr = [];
                for (i = 0; i < v; i++) s.instr.push(a[o]), o++;
            }
        }
        return s;
    }, $e.GPOS = {}, $e.GPOS.parse = function(e, t, n, a) {
        return $e._lctf.parse(e, t, n, a, $e.GPOS.subt);
    }, $e.GPOS.subt = function(e, t, n) {
        if (2 != t) return null;
        var a = $e._bin, o = n, s = {};
        s.format = a.readUshort(e, n), n += 2;
        var i = a.readUshort(e, n);
        n += 2, s.coverage = $e._lctf.readCoverage(e, i + o), s.valFmt1 = a.readUshort(e, n), 
        n += 2, s.valFmt2 = a.readUshort(e, n), n += 2;
        var r = $e._lctf.numOfOnes(s.valFmt1), l = $e._lctf.numOfOnes(s.valFmt2);
        if (1 == s.format) {
            s.pairsets = [];
            var p = a.readUshort(e, n);
            n += 2;
            for (var c = 0; c < p; c++) {
                var u = a.readUshort(e, n);
                n += 2, u += o;
                var d = a.readUshort(e, u);
                u += 2;
                for (var h = [], m = 0; m < d; m++) {
                    var f = a.readUshort(e, u);
                    u += 2, 0 != s.valFmt1 && (w = $e._lctf.readValueRecord(e, u, s.valFmt1), u += 2 * r), 
                    0 != s.valFmt2 && (k = $e._lctf.readValueRecord(e, u, s.valFmt2), u += 2 * l), h.push({
                        gid2: f,
                        val1: w,
                        val2: k
                    });
                }
                s.pairsets.push(h);
            }
        }
        if (2 == s.format) {
            var g = a.readUshort(e, n);
            n += 2;
            var y = a.readUshort(e, n);
            n += 2;
            var x = a.readUshort(e, n);
            n += 2;
            var b = a.readUshort(e, n);
            n += 2, s.classDef1 = $e._lctf.readClassDef(e, o + g), s.classDef2 = $e._lctf.readClassDef(e, o + y), 
            s.matrix = [];
            for (c = 0; c < x; c++) {
                var v = [];
                for (m = 0; m < b; m++) {
                    var w = null, k = null;
                    0 != s.valFmt1 && (w = $e._lctf.readValueRecord(e, n, s.valFmt1), n += 2 * r), 0 != s.valFmt2 && (k = $e._lctf.readValueRecord(e, n, s.valFmt2), 
                    n += 2 * l), v.push({
                        val1: w,
                        val2: k
                    });
                }
                s.matrix.push(v);
            }
        }
        return s;
    }, $e.GSUB = {}, $e.GSUB.parse = function(e, t, n, a) {
        return $e._lctf.parse(e, t, n, a, $e.GSUB.subt);
    }, $e.GSUB.subt = function(e, t, n) {
        var a = $e._bin, o = n, s = {};
        if (1 != t && 4 != t && 5 != t) return null;
        s.fmt = a.readUshort(e, n), n += 2;
        var i = a.readUshort(e, n);
        if (n += 2, s.coverage = $e._lctf.readCoverage(e, i + o), 1 == t) {
            if (1 == s.fmt) s.delta = a.readShort(e, n), n += 2; else if (2 == s.fmt) {
                var r = a.readUshort(e, n);
                n += 2, s.newg = a.readUshorts(e, n, r), n += 2 * s.newg.length;
            }
        } else if (4 == t) {
            s.vals = [];
            r = a.readUshort(e, n);
            n += 2;
            for (var l = 0; l < r; l++) {
                var p = a.readUshort(e, n);
                n += 2, s.vals.push($e.GSUB.readLigatureSet(e, o + p));
            }
        } else if (5 == t) if (2 == s.fmt) {
            var c = a.readUshort(e, n);
            n += 2, s.cDef = $e._lctf.readClassDef(e, o + c), s.scset = [];
            var u = a.readUshort(e, n);
            n += 2;
            for (l = 0; l < u; l++) {
                var d = a.readUshort(e, n);
                n += 2, s.scset.push(0 == d ? null : $e.GSUB.readSubClassSet(e, o + d));
            }
        } else console.log("unknown table format", s.fmt);
        return s;
    }, $e.GSUB.readSubClassSet = function(e, t) {
        var n = $e._bin.readUshort, a = t, o = [], s = n(e, t);
        t += 2;
        for (var i = 0; i < s; i++) {
            var r = n(e, t);
            t += 2, o.push($e.GSUB.readSubClassRule(e, a + r));
        }
        return o;
    }, $e.GSUB.readSubClassRule = function(e, t) {
        var n = $e._bin.readUshort, a = {}, o = n(e, t), s = n(e, t += 2);
        t += 2, a.input = [];
        for (var i = 0; i < o - 1; i++) a.input.push(n(e, t)), t += 2;
        return a.substLookupRecords = $e.GSUB.readSubstLookupRecords(e, t, s), a;
    }, $e.GSUB.readSubstLookupRecords = function(e, t, n) {
        for (var a = $e._bin.readUshort, o = [], s = 0; s < n; s++) o.push(a(e, t), a(e, t + 2)), 
        t += 4;
        return o;
    }, $e.GSUB.readChainSubClassSet = function(e, t) {
        var n = $e._bin, a = t, o = [], s = n.readUshort(e, t);
        t += 2;
        for (var i = 0; i < s; i++) {
            var r = n.readUshort(e, t);
            t += 2, o.push($e.GSUB.readChainSubClassRule(e, a + r));
        }
        return o;
    }, $e.GSUB.readChainSubClassRule = function(e, t) {
        for (var n = $e._bin, a = {}, o = [ "backtrack", "input", "lookahead" ], s = 0; s < o.length; s++) {
            var i = n.readUshort(e, t);
            t += 2, 1 == s && i--, a[o[s]] = n.readUshorts(e, t, i), t += 2 * a[o[s]].length;
        }
        i = n.readUshort(e, t);
        return t += 2, a.subst = n.readUshorts(e, t, 2 * i), t += 2 * a.subst.length, a;
    }, $e.GSUB.readLigatureSet = function(e, t) {
        var n = $e._bin, a = t, o = [], s = n.readUshort(e, t);
        t += 2;
        for (var i = 0; i < s; i++) {
            var r = n.readUshort(e, t);
            t += 2, o.push($e.GSUB.readLigature(e, a + r));
        }
        return o;
    }, $e.GSUB.readLigature = function(e, t) {
        var n = $e._bin, a = {
            chain: []
        };
        a.nglyph = n.readUshort(e, t), t += 2;
        var o = n.readUshort(e, t);
        t += 2;
        for (var s = 0; s < o - 1; s++) a.chain.push(n.readUshort(e, t)), t += 2;
        return a;
    }, $e.head = {}, $e.head.parse = function(e, t, n) {
        var a = $e._bin, o = {};
        return a.readFixed(e, t), t += 4, o.fontRevision = a.readFixed(e, t), t += 4, a.readUint(e, t), 
        t += 4, a.readUint(e, t), t += 4, o.flags = a.readUshort(e, t), t += 2, o.unitsPerEm = a.readUshort(e, t), 
        t += 2, o.created = a.readUint64(e, t), t += 8, o.modified = a.readUint64(e, t), 
        t += 8, o.xMin = a.readShort(e, t), t += 2, o.yMin = a.readShort(e, t), t += 2, 
        o.xMax = a.readShort(e, t), t += 2, o.yMax = a.readShort(e, t), t += 2, o.macStyle = a.readUshort(e, t), 
        t += 2, o.lowestRecPPEM = a.readUshort(e, t), t += 2, o.fontDirectionHint = a.readShort(e, t), 
        t += 2, o.indexToLocFormat = a.readShort(e, t), t += 2, o.glyphDataFormat = a.readShort(e, t), 
        t += 2, o;
    }, $e.hhea = {}, $e.hhea.parse = function(e, t, n) {
        var a = $e._bin, o = {};
        return a.readFixed(e, t), t += 4, o.ascender = a.readShort(e, t), t += 2, o.descender = a.readShort(e, t), 
        t += 2, o.lineGap = a.readShort(e, t), t += 2, o.advanceWidthMax = a.readUshort(e, t), 
        t += 2, o.minLeftSideBearing = a.readShort(e, t), t += 2, o.minRightSideBearing = a.readShort(e, t), 
        t += 2, o.xMaxExtent = a.readShort(e, t), t += 2, o.caretSlopeRise = a.readShort(e, t), 
        t += 2, o.caretSlopeRun = a.readShort(e, t), t += 2, o.caretOffset = a.readShort(e, t), 
        t += 2, t += 8, o.metricDataFormat = a.readShort(e, t), t += 2, o.numberOfHMetrics = a.readUshort(e, t), 
        t += 2, o;
    }, $e.hmtx = {}, $e.hmtx.parse = function(e, t, n, a) {
        for (var o = $e._bin, s = {
            aWidth: [],
            lsBearing: []
        }, i = 0, r = 0, l = 0; l < a.maxp.numGlyphs; l++) l < a.hhea.numberOfHMetrics && (i = o.readUshort(e, t), 
        t += 2, r = o.readShort(e, t), t += 2), s.aWidth.push(i), s.lsBearing.push(r);
        return s;
    }, $e.kern = {}, $e.kern.parse = function(e, t, n, a) {
        var o = $e._bin, s = o.readUshort(e, t);
        if (t += 2, 1 == s) return $e.kern.parseV1(e, t - 2, n, a);
        var i = o.readUshort(e, t);
        t += 2;
        for (var r = {
            glyph1: [],
            rval: []
        }, l = 0; l < i; l++) {
            t += 2;
            n = o.readUshort(e, t);
            t += 2;
            var p = o.readUshort(e, t);
            t += 2;
            var c = p >>> 8;
            if (0 != (c &= 15)) throw "unknown kern table format: " + c;
            t = $e.kern.readFormat0(e, t, r);
        }
        return r;
    }, $e.kern.parseV1 = function(e, t, n, a) {
        var o = $e._bin;
        o.readFixed(e, t), t += 4;
        var s = o.readUint(e, t);
        t += 4;
        for (var i = {
            glyph1: [],
            rval: []
        }, r = 0; r < s; r++) {
            o.readUint(e, t), t += 4;
            var l = o.readUshort(e, t);
            t += 2, o.readUshort(e, t), t += 2;
            var p = l >>> 8;
            if (0 != (p &= 15)) throw "unknown kern table format: " + p;
            t = $e.kern.readFormat0(e, t, i);
        }
        return i;
    }, $e.kern.readFormat0 = function(e, t, n) {
        var a = $e._bin, o = -1, s = a.readUshort(e, t);
        t += 2, a.readUshort(e, t), t += 2, a.readUshort(e, t), t += 2, a.readUshort(e, t), 
        t += 2;
        for (var i = 0; i < s; i++) {
            var r = a.readUshort(e, t);
            t += 2;
            var l = a.readUshort(e, t);
            t += 2;
            var p = a.readShort(e, t);
            t += 2, r != o && (n.glyph1.push(r), n.rval.push({
                glyph2: [],
                vals: []
            }));
            var c = n.rval[n.rval.length - 1];
            c.glyph2.push(l), c.vals.push(p), o = r;
        }
        return t;
    }, $e.loca = {}, $e.loca.parse = function(e, t, n, a) {
        var o = $e._bin, s = [], i = a.head.indexToLocFormat, r = a.maxp.numGlyphs + 1;
        if (0 == i) for (var l = 0; l < r; l++) s.push(o.readUshort(e, t + (l << 1)) << 1);
        if (1 == i) for (l = 0; l < r; l++) s.push(o.readUint(e, t + (l << 2)));
        return s;
    }, $e.maxp = {}, $e.maxp.parse = function(e, t, n) {
        var a = $e._bin, o = {}, s = a.readUint(e, t);
        return t += 4, o.numGlyphs = a.readUshort(e, t), t += 2, 65536 == s && (o.maxPoints = a.readUshort(e, t), 
        t += 2, o.maxContours = a.readUshort(e, t), t += 2, o.maxCompositePoints = a.readUshort(e, t), 
        t += 2, o.maxCompositeContours = a.readUshort(e, t), t += 2, o.maxZones = a.readUshort(e, t), 
        t += 2, o.maxTwilightPoints = a.readUshort(e, t), t += 2, o.maxStorage = a.readUshort(e, t), 
        t += 2, o.maxFunctionDefs = a.readUshort(e, t), t += 2, o.maxInstructionDefs = a.readUshort(e, t), 
        t += 2, o.maxStackElements = a.readUshort(e, t), t += 2, o.maxSizeOfInstructions = a.readUshort(e, t), 
        t += 2, o.maxComponentElements = a.readUshort(e, t), t += 2, o.maxComponentDepth = a.readUshort(e, t), 
        t += 2), o;
    }, $e.name = {}, $e.name.parse = function(e, t, n) {
        var a = $e._bin, o = {};
        a.readUshort(e, t), t += 2;
        var s = a.readUshort(e, t);
        t += 2, a.readUshort(e, t);
        for (var i, r = t += 2, l = 0; l < s; l++) {
            var p = a.readUshort(e, t);
            t += 2;
            var c = a.readUshort(e, t);
            t += 2;
            var u = a.readUshort(e, t);
            t += 2;
            var d = a.readUshort(e, t);
            t += 2;
            n = a.readUshort(e, t);
            t += 2;
            var h = a.readUshort(e, t);
            t += 2;
            var m = "p" + p;
            null == o[m] && (o[m] = {});
            var f, g = [ "copyright", "fontFamily", "fontSubfamily", "ID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "urlVendor", "urlDesigner", "licence", "licenceURL", "---", "typoFamilyName", "typoSubfamilyName", "compatibleFull", "sampleText", "postScriptCID", "wwsFamilyName", "wwsSubfamilyName", "lightPalette", "darkPalette" ][d], y = r + 12 * s + h;
            if (0 == p) f = a.readUnicode(e, y, n / 2); else if (3 == p && 0 == c) f = a.readUnicode(e, y, n / 2); else if (0 == c) f = a.readASCII(e, y, n); else if (1 == c) f = a.readUnicode(e, y, n / 2); else if (3 == c) f = a.readUnicode(e, y, n / 2); else {
                if (1 != p) throw "unknown encoding " + c + ", platformID: " + p;
                f = a.readASCII(e, y, n), console.log("reading unknown MAC encoding " + c + " as ASCII");
            }
            o[m][g] = f, o[m]._lang = u;
        }
        for (var x in o) if (null != o[x].postScriptName && 1033 == o[x]._lang) return o[x];
        for (var x in o) if (null != o[x].postScriptName && 3084 == o[x]._lang) return o[x];
        for (var x in o) if (null != o[x].postScriptName) return o[x];
        for (var x in o) {
            i = x;
            break;
        }
        return console.log("returning name table with languageID " + o[i]._lang), o[i];
    }, $e["OS/2"] = {}, $e["OS/2"].parse = function(e, t, n) {
        var a = $e._bin.readUshort(e, t);
        t += 2;
        var o = {};
        if (0 == a) $e["OS/2"].version0(e, t, o); else if (1 == a) $e["OS/2"].version1(e, t, o); else if (2 == a || 3 == a || 4 == a) $e["OS/2"].version2(e, t, o); else {
            if (5 != a) throw "unknown OS/2 table version: " + a;
            $e["OS/2"].version5(e, t, o);
        }
        return o;
    }, $e["OS/2"].version0 = function(e, t, n) {
        var a = $e._bin;
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
    }, $e["OS/2"].version1 = function(e, t, n) {
        var a = $e._bin;
        return t = $e["OS/2"].version0(e, t, n), n.ulCodePageRange1 = a.readUint(e, t), 
        t += 4, n.ulCodePageRange2 = a.readUint(e, t), t += 4;
    }, $e["OS/2"].version2 = function(e, t, n) {
        var a = $e._bin;
        return t = $e["OS/2"].version1(e, t, n), n.sxHeight = a.readShort(e, t), t += 2, 
        n.sCapHeight = a.readShort(e, t), t += 2, n.usDefault = a.readUshort(e, t), t += 2, 
        n.usBreak = a.readUshort(e, t), t += 2, n.usMaxContext = a.readUshort(e, t), t += 2;
    }, $e["OS/2"].version5 = function(e, t, n) {
        var a = $e._bin;
        return t = $e["OS/2"].version2(e, t, n), n.usLowerOpticalPointSize = a.readUshort(e, t), 
        t += 2, n.usUpperOpticalPointSize = a.readUshort(e, t), t += 2;
    }, $e.post = {}, $e.post.parse = function(e, t, n) {
        var a = $e._bin, o = {};
        return o.version = a.readFixed(e, t), t += 4, o.italicAngle = a.readFixed(e, t), 
        t += 4, o.underlinePosition = a.readShort(e, t), t += 2, o.underlineThickness = a.readShort(e, t), 
        t += 2, o;
    }, $e.SVG = {}, $e.SVG.parse = function(e, t, n) {
        var a = $e._bin, o = {
            entries: []
        }, s = t;
        a.readUshort(e, t), t += 2;
        var i = a.readUint(e, t);
        t += 4, a.readUint(e, t), t += 4, t = i + s;
        var r = a.readUshort(e, t);
        t += 2;
        for (var l = 0; l < r; l++) {
            var p = a.readUshort(e, t);
            t += 2;
            var c = a.readUshort(e, t);
            t += 2;
            var u = a.readUint(e, t);
            t += 4;
            var d = a.readUint(e, t);
            t += 4;
            for (var h = new Uint8Array(e.buffer, s + u + i, d), m = a.readUTF8(h, 0, h.length), f = p; f <= c; f++) o.entries[f] = m;
        }
        return o;
    }, $e.SVG.toPath = function(e) {
        var t = {
            cmds: [],
            crds: []
        };
        if (null == e) return t;
        for (var n = (new DOMParser).parseFromString(e, "image/svg+xml").firstChild; "svg" != n.tagName; ) n = n.nextSibling;
        var a = n.getAttribute("viewBox");
        a = a ? a.trim().split(" ").map(parseFloat) : [ 0, 0, 1e3, 1e3 ], $e.SVG._toPath(n.children, t);
        for (var o = 0; o < t.crds.length; o += 2) {
            var s = t.crds[o], i = t.crds[o + 1];
            s -= a[0], i = -(i -= a[1]), t.crds[o] = s, t.crds[o + 1] = i;
        }
        return t;
    }, $e.SVG._toPath = function(e, t, n) {
        for (var a = 0; a < e.length; a++) {
            var o = e[a], s = o.tagName, i = o.getAttribute("fill");
            if (null == i && (i = n), "g" == s) $e.SVG._toPath(o.children, t, i); else if ("path" == s) {
                t.cmds.push(i || "#000000");
                var r = o.getAttribute("d"), l = $e.SVG._tokens(r);
                $e.SVG._toksToPath(l, t), t.cmds.push("X");
            } else "defs" == s || console.log(s, o);
        }
    }, $e.SVG._tokens = function(e) {
        for (var t = [], n = 0, a = !1, o = ""; n < e.length; ) {
            var s = e.charCodeAt(n), i = e.charAt(n);
            n++;
            var r = 48 <= s && s <= 57 || "." == i || "-" == i;
            a ? "-" == i ? (t.push(parseFloat(o)), o = i) : r ? o += i : (t.push(parseFloat(o)), 
            "," != i && " " != i && t.push(i), a = !1) : r ? (o = i, a = !0) : "," != i && " " != i && t.push(i);
        }
        return a && t.push(parseFloat(o)), t;
    }, $e.SVG._toksToPath = function(e, t) {
        for (var n = 0, a = 0, o = 0, s = 0, i = 0, r = {
            M: 2,
            L: 2,
            H: 1,
            V: 1,
            S: 4,
            C: 6
        }, l = t.cmds, p = t.crds; n < e.length; ) {
            var c = e[n];
            if (n++, "z" == c) l.push("Z"), a = s, o = i; else for (var u = c.toUpperCase(), d = r[u], h = $e.SVG._reps(e, n, d), m = 0; m < h; m++) {
                var f = 0, g = 0;
                if (c != u && (f = a, g = o), "M" == u) a = f + e[n++], o = g + e[n++], l.push("M"), 
                p.push(a, o), s = a, i = o; else if ("L" == u) a = f + e[n++], o = g + e[n++], l.push("L"), 
                p.push(a, o); else if ("H" == u) a = f + e[n++], l.push("L"), p.push(a, o); else if ("V" == u) o = g + e[n++], 
                l.push("L"), p.push(a, o); else if ("C" == u) {
                    var y = f + e[n++], x = g + e[n++], b = f + e[n++], v = g + e[n++], w = f + e[n++], k = g + e[n++];
                    l.push("C"), p.push(y, x, b, v, w, k), a = w, o = k;
                } else if ("S" == u) {
                    var _ = Math.max(p.length - 4, 0);
                    y = a + a - p[_], x = o + o - p[_ + 1], b = f + e[n++], v = g + e[n++], w = f + e[n++], 
                    k = g + e[n++];
                    l.push("C"), p.push(y, x, b, v, w, k), a = w, o = k;
                } else console.log("Unknown SVG command " + c);
            }
        }
    }, $e.SVG._reps = function(e, t, n) {
        for (var a = t; a < e.length && "string" != typeof e[a]; ) a += n;
        return (a - t) / n;
    }, null == $e && ($e = {}), null == $e.U && ($e.U = {}), $e.U.codeToGlyph = function(e, t) {
        var n = e.cmap, a = -1;
        if (null != n.p0e4 ? a = n.p0e4 : null != n.p3e1 ? a = n.p3e1 : null != n.p1e0 && (a = n.p1e0), 
        -1 == a) throw "no familiar platform and encoding!";
        var o = n.tables[a];
        if (0 == o.format) return t >= o.map.length ? 0 : o.map[t];
        if (4 == o.format) {
            for (var s = -1, i = 0; i < o.endCount.length; i++) if (t <= o.endCount[i]) {
                s = i;
                break;
            }
            if (-1 == s) return 0;
            if (o.startCount[s] > t) return 0;
            return 65535 & (0 != o.idRangeOffset[s] ? o.glyphIdArray[t - o.startCount[s] + (o.idRangeOffset[s] >> 1) - (o.idRangeOffset.length - s)] : t + o.idDelta[s]);
        }
        if (12 == o.format) {
            if (t > o.groups[o.groups.length - 1][1]) return 0;
            for (i = 0; i < o.groups.length; i++) {
                var r = o.groups[i];
                if (r[0] <= t && t <= r[1]) return r[2] + (t - r[0]);
            }
            return 0;
        }
        throw "unknown cmap table format " + o.format;
    }, $e.U.glyphToPath = function(e, t) {
        var n = {
            cmds: [],
            crds: []
        };
        if (e.SVG && e.SVG.entries[t]) {
            var a = e.SVG.entries[t];
            return null == a ? n : ("string" == typeof a && (a = $e.SVG.toPath(a), e.SVG.entries[t] = a), 
            a);
        }
        if (e.CFF) {
            var o = {
                x: 0,
                y: 0,
                stack: [],
                nStems: 0,
                haveWidth: !1,
                width: e.CFF.Private ? e.CFF.Private.defaultWidthX : 0,
                open: !1
            };
            $e.U._drawCFF(e.CFF.CharStrings[t], o, e.CFF, n);
        } else e.glyf && $e.U._drawGlyf(t, e, n);
        return n;
    }, $e.U._drawGlyf = function(e, t, n) {
        var a = t.glyf[e];
        null == a && (a = t.glyf[e] = $e.glyf._parseGlyf(t, e)), null != a && (a.noc > -1 ? $e.U._simpleGlyph(a, n) : $e.U._compoGlyph(a, t, n));
    }, $e.U._simpleGlyph = function(e, t) {
        for (var n = 0; n < e.noc; n++) {
            for (var a = 0 == n ? 0 : e.endPts[n - 1] + 1, o = e.endPts[n], s = a; s <= o; s++) {
                var i = s == a ? o : s - 1, r = s == o ? a : s + 1, l = 1 & e.flags[s], p = 1 & e.flags[i], c = 1 & e.flags[r], u = e.xs[s], d = e.ys[s];
                if (s == a) if (l) {
                    if (!p) {
                        $e.U.P.moveTo(t, u, d);
                        continue;
                    }
                    $e.U.P.moveTo(t, e.xs[i], e.ys[i]);
                } else p ? $e.U.P.moveTo(t, e.xs[i], e.ys[i]) : $e.U.P.moveTo(t, (e.xs[i] + u) / 2, (e.ys[i] + d) / 2);
                l ? p && $e.U.P.lineTo(t, u, d) : c ? $e.U.P.qcurveTo(t, u, d, e.xs[r], e.ys[r]) : $e.U.P.qcurveTo(t, u, d, (u + e.xs[r]) / 2, (d + e.ys[r]) / 2);
            }
            $e.U.P.closePath(t);
        }
    }, $e.U._compoGlyph = function(e, t, n) {
        for (var a = 0; a < e.parts.length; a++) {
            var o = {
                cmds: [],
                crds: []
            }, s = e.parts[a];
            $e.U._drawGlyf(s.glyphIndex, t, o);
            for (var i = s.m, r = 0; r < o.crds.length; r += 2) {
                var l = o.crds[r], p = o.crds[r + 1];
                n.crds.push(l * i.a + p * i.b + i.tx), n.crds.push(l * i.c + p * i.d + i.ty);
            }
            for (r = 0; r < o.cmds.length; r++) n.cmds.push(o.cmds[r]);
        }
    }, $e.U._getGlyphClass = function(e, t) {
        var n = $e._lctf.getInterval(t, e);
        return -1 == n ? 0 : t[n + 2];
    }, $e.U.getPairAdjustment = function(e, t, n) {
        if (e.GPOS) {
            for (var a = null, o = 0; o < e.GPOS.featureList.length; o++) {
                var s = e.GPOS.featureList[o];
                if ("kern" == s.tag) for (var i = 0; i < s.tab.length; i++) 2 == e.GPOS.lookupList[s.tab[i]].ltype && (a = e.GPOS.lookupList[s.tab[i]]);
            }
            if (a) for (o = 0; o < a.tabs.length; o++) {
                var r = a.tabs[o], l = $e._lctf.coverageIndex(r.coverage, t);
                if (-1 != l) {
                    if (1 == r.format) {
                        var p = r.pairsets[l];
                        for (i = 0; i < p.length; i++) p[i].gid2 == n && (d = p[i]);
                        if (null == d) continue;
                    } else if (2 == r.format) var c = $e.U._getGlyphClass(t, r.classDef1), u = $e.U._getGlyphClass(n, r.classDef2), d = r.matrix[c][u];
                    return d.val1[2];
                }
            }
        }
        if (e.kern) {
            var h = e.kern.glyph1.indexOf(t);
            if (-1 != h) {
                var m = e.kern.rval[h].glyph2.indexOf(n);
                if (-1 != m) return e.kern.rval[h].vals[m];
            }
        }
        return 0;
    }, $e.U.stringToGlyphs = function(e, t) {
        for (var n = [], a = 0; a < t.length; a++) {
            var o = t.codePointAt(a);
            o > 65535 && a++, n.push($e.U.codeToGlyph(e, o));
        }
        var s = e.GSUB;
        if (null == s) return n;
        for (var i = s.lookupList, r = s.featureList, l = '\n\t" ,.:;!?()  \u060c', p = "\u0622\u0623\u0624\u0625\u0627\u0629\u062f\u0630\u0631\u0632\u0648\u0671\u0672\u0673\u0675\u0676\u0677\u0688\u0689\u068a\u068b\u068c\u068d\u068e\u068f\u0690\u0691\u0692\u0693\u0694\u0695\u0696\u0697\u0698\u0699\u06c0\u06c3\u06c4\u06c5\u06c6\u06c7\u06c8\u06c9\u06ca\u06cb\u06cd\u06cf\u06d2\u06d3\u06d5\u06ee\u06ef\u0710\u0715\u0716\u0717\u0718\u0719\u071e\u0728\u072a\u072c\u072f\u074d\u0759\u075a\u075b\u076b\u076c\u0771\u0773\u0774\u0778\u0779\u0840\u0846\u0847\u0849\u0854\u0867\u0869\u086a\u08aa\u08ab\u08ac\u08ae\u08b1\u08b2\u08b9\u0ac5\u0ac7\u0ac9\u0aca\u0ace\u0acf\u0ad0\u0ad1\u0ad2\u0add\u0ae1\u0ae4\u0aef\u0b81\u0b83\u0b84\u0b85\u0b89\u0b8c\u0b8e\u0b8f\u0b91\u0ba9\u0baa\u0bab\u0bac", c = 0; c < n.length; c++) {
            var u = n[c], d = 0 == c || -1 != l.indexOf(t[c - 1]), h = c == n.length - 1 || -1 != l.indexOf(t[c + 1]);
            d || -1 == p.indexOf(t[c - 1]) || (d = !0), h || -1 == p.indexOf(t[c]) || (h = !0), 
            h || -1 == "\ua872\u0acd\u0ad7".indexOf(t[c + 1]) || (h = !0), d || -1 == "\ua872\u0acd\u0ad7".indexOf(t[c]) || (d = !0);
            var m = null;
            m = d ? h ? "isol" : "init" : h ? "fina" : "medi";
            for (var f = 0; f < r.length; f++) if (r[f].tag == m) for (var g = 0; g < r[f].tab.length; g++) {
                1 == (v = i[r[f].tab[g]]).ltype && $e.U._applyType1(n, c, v);
            }
        }
        var y = [ "rlig", "liga", "mset" ];
        for (c = 0; c < n.length; c++) {
            u = n[c];
            var x = Math.min(3, n.length - c - 1);
            for (f = 0; f < r.length; f++) {
                var b = r[f];
                if (-1 != y.indexOf(b.tag)) for (g = 0; g < b.tab.length; g++) for (var v = i[b.tab[g]], w = 0; w < v.tabs.length; w++) if (null != v.tabs[w]) {
                    var k = $e._lctf.coverageIndex(v.tabs[w].coverage, u);
                    if (-1 != k) if (4 == v.ltype) for (var _ = v.tabs[w].vals[k], q = 0; q < _.length; q++) {
                        var C = _[q], T = C.chain.length;
                        if (!(T > x)) {
                            for (var A = !0, S = 0; S < T; S++) C.chain[S] != n[c + (1 + S)] && (A = !1);
                            if (A) {
                                n[c] = C.nglyph;
                                for (S = 0; S < T; S++) n[c + S + 1] = -1;
                            }
                        }
                    } else if (5 == v.ltype) {
                        var U = v.tabs[w];
                        if (2 != U.fmt) continue;
                        var H = $e._lctf.getInterval(U.cDef, u), E = U.cDef[H + 2], I = U.scset[E];
                        for (a = 0; a < I.length; a++) {
                            var j = I[a], z = j.input;
                            if (!(z.length > x)) {
                                for (A = !0, S = 0; S < z.length; S++) {
                                    var O = $e._lctf.getInterval(U.cDef, n[c + 1 + S]);
                                    if (-1 == H && U.cDef[O + 2] != z[S]) {
                                        A = !1;
                                        break;
                                    }
                                }
                                if (A) {
                                    var $ = j.substLookupRecords;
                                    for (q = 0; q < $.length; q += 2) $[q], $[q + 1];
                                }
                            }
                        }
                    }
                }
            }
        }
        return n;
    }, $e.U._applyType1 = function(e, t, n) {
        for (var a = e[t], o = 0; o < n.tabs.length; o++) {
            var s = n.tabs[o], i = $e._lctf.coverageIndex(s.coverage, a);
            -1 != i && (1 == s.fmt ? e[t] = e[t] + s.delta : e[t] = s.newg[i]);
        }
    }, $e.U.glyphsToPath = function(e, t, n) {
        for (var a = {
            cmds: [],
            crds: []
        }, o = 0, s = 0; s < t.length; s++) {
            var i = t[s];
            if (-1 != i) {
                for (var r = s < t.length - 1 && -1 != t[s + 1] ? t[s + 1] : 0, l = $e.U.glyphToPath(e, i), p = 0; p < l.crds.length; p += 2) a.crds.push(l.crds[p] + o), 
                a.crds.push(l.crds[p + 1]);
                n && a.cmds.push(n);
                for (p = 0; p < l.cmds.length; p++) a.cmds.push(l.cmds[p]);
                n && a.cmds.push("X"), o += e.hmtx.aWidth[i], s < t.length - 1 && (o += $e.U.getPairAdjustment(e, i, r));
            }
        }
        return a;
    }, $e.U.pathToSVG = function(e, t) {
        null == t && (t = 5);
        for (var n = [], a = 0, o = {
            M: 2,
            L: 2,
            Q: 4,
            C: 6
        }, s = 0; s < e.cmds.length; s++) {
            var i = e.cmds[s], r = a + (o[i] ? o[i] : 0);
            for (n.push(i); a < r; ) {
                var l = e.crds[a++];
                n.push(parseFloat(l.toFixed(t)) + (a == r ? "" : " "));
            }
        }
        return n.join("");
    }, $e.U.pathToContext = function(e, t) {
        for (var n = 0, a = e.crds, o = 0; o < e.cmds.length; o++) {
            var s = e.cmds[o];
            "M" == s ? (t.moveTo(a[n], a[n + 1]), n += 2) : "L" == s ? (t.lineTo(a[n], a[n + 1]), 
            n += 2) : "C" == s ? (t.bezierCurveTo(a[n], a[n + 1], a[n + 2], a[n + 3], a[n + 4], a[n + 5]), 
            n += 6) : "Q" == s ? (t.quadraticCurveTo(a[n], a[n + 1], a[n + 2], a[n + 3]), n += 4) : "#" == s.charAt(0) ? (t.beginPath(), 
            t.fillStyle = s) : "Z" == s ? t.closePath() : "X" == s && t.fill();
        }
    }, $e.U.P = {}, $e.U.P.moveTo = function(e, t, n) {
        e.cmds.push("M"), e.crds.push(t, n);
    }, $e.U.P.lineTo = function(e, t, n) {
        e.cmds.push("L"), e.crds.push(t, n);
    }, $e.U.P.curveTo = function(e, t, n, a, o, s, i) {
        e.cmds.push("C"), e.crds.push(t, n, a, o, s, i);
    }, $e.U.P.qcurveTo = function(e, t, n, a, o) {
        e.cmds.push("Q"), e.crds.push(t, n, a, o);
    }, $e.U.P.closePath = function(e) {
        e.cmds.push("Z");
    }, $e.U._drawCFF = function(e, t, n, a) {
        for (var o = t.stack, s = t.nStems, i = t.haveWidth, r = t.width, l = t.open, p = 0, c = t.x, u = t.y, d = 0, h = 0, m = 0, f = 0, g = 0, y = 0, x = 0, b = 0, v = 0, w = 0, k = {
            val: 0,
            size: 0
        }; p < e.length; ) {
            $e.CFF.getCharString(e, p, k);
            var _ = k.val;
            if (p += k.size, "o1" == _ || "o18" == _) o.length % 2 != 0 && !i && (r = o.shift() + n.Private.nominalWidthX), 
            s += o.length >> 1, o.length = 0, i = !0; else if ("o3" == _ || "o23" == _) {
                o.length % 2 != 0 && !i && (r = o.shift() + n.Private.nominalWidthX), s += o.length >> 1, 
                o.length = 0, i = !0;
            } else if ("o4" == _) o.length > 1 && !i && (r = o.shift() + n.Private.nominalWidthX, 
            i = !0), l && $e.U.P.closePath(a), u += o.pop(), $e.U.P.moveTo(a, c, u), l = !0; else if ("o5" == _) for (;o.length > 0; ) c += o.shift(), 
            u += o.shift(), $e.U.P.lineTo(a, c, u); else if ("o6" == _ || "o7" == _) for (var q = o.length, C = "o6" == _, T = 0; T < q; T++) {
                var A = o.shift();
                C ? c += A : u += A, C = !C, $e.U.P.lineTo(a, c, u);
            } else if ("o8" == _ || "o24" == _) {
                q = o.length;
                for (var S = 0; S + 6 <= q; ) d = c + o.shift(), h = u + o.shift(), m = d + o.shift(), 
                f = h + o.shift(), c = m + o.shift(), u = f + o.shift(), $e.U.P.curveTo(a, d, h, m, f, c, u), 
                S += 6;
                "o24" == _ && (c += o.shift(), u += o.shift(), $e.U.P.lineTo(a, c, u));
            } else {
                if ("o11" == _) break;
                if ("o1234" == _ || "o1235" == _ || "o1236" == _ || "o1237" == _) "o1234" == _ && (h = u, 
                m = (d = c + o.shift()) + o.shift(), w = f = h + o.shift(), y = f, b = u, c = (x = (g = (v = m + o.shift()) + o.shift()) + o.shift()) + o.shift(), 
                $e.U.P.curveTo(a, d, h, m, f, v, w), $e.U.P.curveTo(a, g, y, x, b, c, u)), "o1235" == _ && (d = c + o.shift(), 
                h = u + o.shift(), m = d + o.shift(), f = h + o.shift(), v = m + o.shift(), w = f + o.shift(), 
                g = v + o.shift(), y = w + o.shift(), x = g + o.shift(), b = y + o.shift(), c = x + o.shift(), 
                u = b + o.shift(), o.shift(), $e.U.P.curveTo(a, d, h, m, f, v, w), $e.U.P.curveTo(a, g, y, x, b, c, u)), 
                "o1236" == _ && (d = c + o.shift(), h = u + o.shift(), m = d + o.shift(), w = f = h + o.shift(), 
                y = f, x = (g = (v = m + o.shift()) + o.shift()) + o.shift(), b = y + o.shift(), 
                c = x + o.shift(), $e.U.P.curveTo(a, d, h, m, f, v, w), $e.U.P.curveTo(a, g, y, x, b, c, u)), 
                "o1237" == _ && (d = c + o.shift(), h = u + o.shift(), m = d + o.shift(), f = h + o.shift(), 
                v = m + o.shift(), w = f + o.shift(), g = v + o.shift(), y = w + o.shift(), x = g + o.shift(), 
                b = y + o.shift(), Math.abs(x - c) > Math.abs(b - u) ? c = x + o.shift() : u = b + o.shift(), 
                $e.U.P.curveTo(a, d, h, m, f, v, w), $e.U.P.curveTo(a, g, y, x, b, c, u)); else if ("o14" == _) {
                    if (o.length > 0 && !i && (r = o.shift() + n.nominalWidthX, i = !0), 4 == o.length) {
                        var U = o.shift(), H = o.shift(), E = o.shift(), I = o.shift(), j = $e.CFF.glyphBySE(n, E), z = $e.CFF.glyphBySE(n, I);
                        $e.U._drawCFF(n.CharStrings[j], t, n, a), t.x = U, t.y = H, $e.U._drawCFF(n.CharStrings[z], t, n, a);
                    }
                    l && ($e.U.P.closePath(a), l = !1);
                } else if ("o19" == _ || "o20" == _) {
                    o.length % 2 != 0 && !i && (r = o.shift() + n.Private.nominalWidthX), s += o.length >> 1, 
                    o.length = 0, i = !0, p += s + 7 >> 3;
                } else if ("o21" == _) o.length > 2 && !i && (r = o.shift() + n.Private.nominalWidthX, 
                i = !0), u += o.pop(), c += o.pop(), l && $e.U.P.closePath(a), $e.U.P.moveTo(a, c, u), 
                l = !0; else if ("o22" == _) o.length > 1 && !i && (r = o.shift() + n.Private.nominalWidthX, 
                i = !0), c += o.pop(), l && $e.U.P.closePath(a), $e.U.P.moveTo(a, c, u), l = !0; else if ("o25" == _) {
                    for (;o.length > 6; ) c += o.shift(), u += o.shift(), $e.U.P.lineTo(a, c, u);
                    d = c + o.shift(), h = u + o.shift(), m = d + o.shift(), f = h + o.shift(), c = m + o.shift(), 
                    u = f + o.shift(), $e.U.P.curveTo(a, d, h, m, f, c, u);
                } else if ("o26" == _) for (o.length % 2 && (c += o.shift()); o.length > 0; ) d = c, 
                h = u + o.shift(), c = m = d + o.shift(), u = (f = h + o.shift()) + o.shift(), $e.U.P.curveTo(a, d, h, m, f, c, u); else if ("o27" == _) for (o.length % 2 && (u += o.shift()); o.length > 0; ) h = u, 
                m = (d = c + o.shift()) + o.shift(), f = h + o.shift(), c = m + o.shift(), u = f, 
                $e.U.P.curveTo(a, d, h, m, f, c, u); else if ("o10" == _ || "o29" == _) {
                    var O = "o10" == _ ? n.Private : n;
                    if (0 == o.length) console.log("error: empty stack"); else {
                        var $ = o.pop(), L = O.Subrs[$ + O.Bias];
                        t.x = c, t.y = u, t.nStems = s, t.haveWidth = i, t.width = r, t.open = l, $e.U._drawCFF(L, t, n, a), 
                        c = t.x, u = t.y, s = t.nStems, i = t.haveWidth, r = t.width, l = t.open;
                    }
                } else if ("o30" == _ || "o31" == _) {
                    var P = o.length, F = (S = 0, "o31" == _);
                    for (S += P - (q = -3 & P); S < q; ) F ? (h = u, m = (d = c + o.shift()) + o.shift(), 
                    u = (f = h + o.shift()) + o.shift(), q - S == 5 ? (c = m + o.shift(), S++) : c = m, 
                    F = !1) : (d = c, h = u + o.shift(), m = d + o.shift(), f = h + o.shift(), c = m + o.shift(), 
                    q - S == 5 ? (u = f + o.shift(), S++) : u = f, F = !0), $e.U.P.curveTo(a, d, h, m, f, c, u), 
                    S += 4;
                } else {
                    if ("o" == (_ + "").charAt(0)) throw console.log("Unknown operation: " + _, e), 
                    _;
                    o.push(_);
                }
            }
        }
        t.x = c, t.y = u, t.nStems = s, t.haveWidth = i, t.width = r, t.open = l;
    };

    const Le = getDefaultExportFromCjs($e), decode = async () => {
        var e;
        const t = xe.document.querySelectorAll("style");
        let n = null;
        if (t.forEach((e => {
            var t;
            -1 !== (null == (t = e.textContent) ? void 0 : t.indexOf("font-cxsecret")) && (n = e);
        })), !n) return !0;
        const a = null == (e = n.textContent) ? void 0 : e.match(/base64,([\w\W]+?)'/);
        if (!a) return;
        const o = base64ToUint8Array(a[1]), s = Le.parse(o);
        let i = await ttfDownload1("https://www.forestpolice.org/ttf/2.0/table.json") || await ttfDownload1("https://jsd.vxo.im/gh/chengbianruan/staticfile/c.json") || await ttfDownload1("https://cdn.jsdelivr.net/gh/chengbianruan/staticfile/c.json");
        if (!i) return !1;
        let r = {};
        for (let l = 19968; l < 40870; l++) {
            let e = Le.U.codeToGlyph(s, l);
            e && (e = Le.U.glyphToPath(s, e), e = somd5(JSON.stringify(e)).slice(24), r[l] = i[e]);
        }
        return xe.document.querySelectorAll(".font-cxsecret").forEach((e => {
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
    }, Pe = [ {
        type: "ask",
        name: "\u5b66\u4e60\u901a\u968f\u5802\u7ec3\u4e60",
        match: () => location.href.includes("/page/quiz/stu/answerQuestion2"),
        types: [ "0", "1", "2", "3", "4", "5", "6", "7", "9" ],
        minDelay: 100,
        answerDelay: 1e3,
        question: {
            html: ".left-question-list>.question-item",
            question: ".html-content-box",
            options: "ul.option-list>li",
            type: ".grey-text",
            workType: "stlx",
            pageType: "cx"
        },
        init: async () => {},
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => (e.options = removeStartChar(e.options), e.type = typeMatch(G(e.html).find(".grey-text").text()), 
        e),
        setAnswer: e => !0,
        finish: e => {}
    }, {
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
            let t = removeHtml(G(e.html).find('span[class="colorShallow"]').html());
            if ("" === t) return null;
            let n = t.match(/^\((.+?)\)/);
            if (null === n) return null;
            e.type = n[1].split(",")[0], e.question = titleClean(e.question.split(t)[1].trim()).trim(), 
            e.options = removeStartChar(e.options);
            const a = G(e.html).find(".mark_score>.totalScore>i").text(), o = t.match(/(\d+(\.\d+)?)/);
            let s, i = G(e.html).find(".marking_dui").length > 0 || Number(a) == ((null == o ? void 0 : o[0]) || 0) && 0 != Number(a), r = typeMatch(t);
            if (!i) switch (r) {
              case "0":
              case "1":
              case "3":
                0 != Number(a) && (i = !0);
            }
            switch (r) {
              case "0":
              case "1":
                e.type = r, e.answer = G(e.html).find(".mark_answer>div>span.colorGreen:eq(0)").text().replace("\u6b63\u786e\u7b54\u6848:", "").trim().split("").map((t => e.options[t.charCodeAt(0) - 65])), 
                e.answer = e.answer.filter((e => "" !== e)), 0 === e.answer.length && i && (e.answer = G(e.html).find(".mark_answer>div>span.colorDeep:eq(0)").text().replace("\u6211\u7684\u7b54\u6848:", "").trim().split("").map((t => e.options[t.charCodeAt(0) - 65])), 
                e.answer = e.answer.filter((e => "" !== e)));
                break;

              case "3":
                if (e.type = "3", e.options = [], e.answer = judgeAnswer(G(e.html).find(".mark_answer>div>span.colorGreen:eq(0)").text().replace("\u6b63\u786e\u7b54\u6848", "")), 
                e.answer, 0 === e.answer.length) {
                    if (s = removeHtml(G(e.html).find(".mark_answer>div>span.colorDeep:eq(0)").html()), 
                    e.answer = judgeAnswer(s), 0 === e.answer.length) return null;
                    if (0 == Number(a) && !i && "3" == r) return null;
                    i || (e.answer = "\u6b63\u786e" === e.answer[0] ? [ "\u9519\u8bef" ] : [ "\u6b63\u786e" ]);
                }
                break;

              case "4":
                if (e.type = "4", e.answer = removeHtml(G(e.html).find(".mark_answer>div>.colorGreen:eq(0)").html()).replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim(), 
                e.answer.length < 10) return null;
                e.answer = [ e.answer ];
                break;

              case "5":
                if (e.type = "5", e.answer = removeHtml(G(e.html).find(".mark_answer>div>.colorGreen:eq(0)").html()).replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim(), 
                e.answer.length < 10) return null;
                e.answer = [ e.answer ];
                break;

              case "7":
                if (e.type = "7", e.answer = removeHtml(G(e.html).find(".mark_answer>div>.colorGreen:eq(0)").html()).replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim(), 
                e.answer.length < 10) return null;
                e.answer = [ e.answer ];
                break;

              case "6":
                if (e.type = "6", e.answer = removeHtml(G(e.html).find(".mark_answer>div>.colorGreen:eq(0)").html()).replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim(), 
                e.answer.length < 10) return null;
                e.answer = [ e.answer ];
                break;

              case "2":
                if (e.type = "2", e.answer = G(e.html).find(".mark_answer>div>.colorGreen:eq(0)>dd").map(((e, t) => removeHtml(G(t).html()).replace(`(${e + 1})`, "").trim())).get(), 
                0 == e.answer.length) {
                    const t = G(e.html).find(".mark_answer>div>.colorDeep:eq(0)>dd").map(((e, t) => removeHtml(G(t).html()).replace(`(${e + 1})`, "").trim())).get();
                    G(e.html).find(".mark_answer>div>.colorDeep:eq(0)>dd>.marking_dui").length == t.length && (e.answer = t);
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
            }, n = G("#courseId").val(), a = (xe.document.body.innerHTML.match(/(?:examId|relationId)=(\d+)/) || [])[1] || "", o = `https://mobilelearn.chaoxing.com/v2/apis/class/getClassDetail?courseId=${n}&classId=${G("#classId").val()}`;
            await request(o, "GET").then((e => {
                const n = JSON.parse(e[0].responseText).data.course.data[0];
                t.name = n.name, t.info = {}, t.info.imageurl = n.imageurl;
            })), t.hash = n, t.info = {}, t.chapter = [ {
                hash: `${a}`,
                name: G(".mark_title").text().trim(),
                question: e
            } ], Oe.setPaper(t.hash, t);
        }
    }, {
        type: "hook",
        name: "hook",
        match: location.href.includes("work/selectWorkQuestionYiPiYue") && location.href.includes("mooc2=0"),
        main: e => {
            location.href.includes("mooc2=0") ? xe.location.href = location.href.replace("mooc2=0", "mooc2=1") : xe.location.href = location.href + "&mooc2=1";
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
            e.type = G(e.html).find(".newZy_TItle").text().replace(/\u3010|\u3011/g, "").trim();
            let t, n = G(e.html).find(".marking_dui").length > 0;
            switch (removeHtml(G(e.html).find(".Py_addpy:eq(0)").html()), e.question = titleClean(e.question).trim(), 
            e.type) {
              case "\u5355\u9009\u9898":
              case "\u591a\u9009\u9898":
                e.type = "\u5355\u9009\u9898" === e.type ? "0" : "1", e.options = G(e.html).find("ul.Zy_ulTop li").map(((e, t) => {
                    let n = G(t).find("i.fl").text().trim(), a = removeHtml(G(t).html());
                    return "" === n ? a.trim() : a.split(n)[1].trim();
                })).get(), e.answer = G(e.html).find(".correctAnswer >.fl.answerCon").text().trim().split("").map((t => e.options[t.charCodeAt(0) - 65])), 
                0 === e.answer.length && n && (e.answer = G(e.html).find(".myAnswer > .fl.answerCon").text().trim().split("").map((t => e.options[t.charCodeAt(0) - 65])));
                break;

              case "\u5224\u65ad\u9898":
                if (e.type = "3", e.answer = G(e.html).find(".correctAnswer > .fl.answerCon").text().trim().split("").map((e => e.includes("\u6b63\u786e") || e.includes("\u5bf9") || e.includes("\u221a") ? "\u6b63\u786e" : e.includes("\u9519\u8bef") || e.includes("\u9519") || e.includes("\xd7") ? "\u9519\u8bef" : null)).filter((e => null !== e)), 
                0 === e.answer.length) {
                    t = removeHtml(G(e.html).find(".fl.answerCon").html());
                    let [n, a] = [ ".marking_dui", ".marking_cuo" ].map((t => G(e.html).find(t).length));
                    if (n + a === 0) return null;
                    if (t.includes("\u6b63\u786e") || t.includes("\u5bf9") || t.includes("\u221a")) e.answer = [ "\u6b63\u786e" ]; else {
                        if (!(t.includes("\u9519\u8bef") || t.includes("\u9519") || t.includes("\xd7"))) return null;
                        e.answer = [ "\u9519\u8bef" ];
                    }
                    0 === n && 0 !== a && (e.answer = "\u6b63\u786e" === e.answer[0] ? "\u9519\u8bef" : "\u6b63\u786e");
                }
                break;

              case "\u586b\u7a7a\u9898":
                e.type = "2", e.answer = G(e.html).find(".correctAnswerBx>.correctAnswer>p:not(.clear)").map(((e, t) => removeHtml(G(t).html()).replace(`(${e + 1})`, "").trim())).get().filter((e => "" !== e)), 
                0 == e.answer.length && (e.answer = G(e.html).find(".myAllAnswerBx>.myAnswerBx>.myAnswer").map(((e, t) => removeHtml(G(t).html()).replace(/\u7b2c[\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d]+\u7a7a\uff1a/, "").trim())).get(), 
                e.answer.length !== G(e.html).find(".marking_dui").length && (e.answer = []));
                break;

              case "\u5206\u5f55\u9898":
                if (e.type = "9", e.answer = G(e.html).find(".correctAnswerBx>.correctAnswer>p:not(.clear)").map(((e, t) => removeHtml(G(t).html()))).get().filter((e => "" !== e)), 
                e.answer.length != G(e.html).find(".CorrectOrNot").length) {
                    if (G(e.html).find(".marking_cuo").length > 0) return null;
                    if (e.answer = G(e.html).find(".myAnswerBx>.myAnswer>p:not(.clear)").map(((e, t) => removeHtml(G(t).html()))).get().filter((e => "" !== e)), 
                    e.answer.length != G(e.html).find(".CorrectOrNot").length) return null;
                }
                e.answer;
                break;

              case "\u8fde\u7ebf\u9898":
                e.type = "11";
                let a = G(e.html).find("ul.firstUlList>li:not(.groupTitile)").map(((e, t) => {
                    let n = G(t).clone();
                    return n.find(".fl").remove(), removeHtml(n.html());
                })).get(), o = G(e.html).find("ul.secondUlList>li:not(.groupTitile)").map(((e, t) => {
                    let n = G(t).clone();
                    return n.find(".fl").remove(), removeHtml(n.html());
                })).get();
                t = G(e.html).find(".correctAnswer >.fl.answerCon >.collectAnswer").map(((e, t) => removeHtml(G(t).text()))).get(), 
                e.options = [ a, o ];
                let s = {};
                t.forEach((e => {
                    let [t, n] = e.split("-");
                    t.charCodeAt(0) >= 65 ? t = (t.charCodeAt(0) - 65).toString() : /^\d+$/.test(t) && (t = (parseInt(t) - 1).toString()), 
                    n.charCodeAt(0) >= 65 ? n = (n.charCodeAt(0) - 65).toString() : /^\d+$/.test(n) && (n = (parseInt(n) - 1).toString()), 
                    s[a[t]] = o[n];
                })), e.answer = s, e.answer;
                break;

              default:
                return e.type, null;
            }
            return e;
        },
        paper: async e => {
            const t = {
                platform: "cx"
            }, n = xe.courseId, a = xe.jobid, o = `https://mobilelearn.chaoxing.com/v2/apis/class/getClassDetail?courseId=${n}&classId=${xe.classId}`;
            await request(o, "GET").then((e => {
                const n = JSON.parse(e[0].responseText).data.course.data[0];
                t.name = n.name, t.info = {}, t.info.imageurl = n.imageurl;
            })), t.hash = n, t.info = {}, t.chapter = [ {
                hash: `${a}`,
                name: G(".ceyan_name>h3").text().trim(),
                question: e
            } ], Oe.setPaper(t.hash, t);
        }
    }, {
        type: "ask",
        name: "\u5b66\u4e60\u901a\u65b0\u7248\u4f5c\u4e1a",
        match: /\/mooc2\/work\/dowork/i.test(location.pathname),
        types: [ "0", "1", "2", "3", "4", "5", "6", "7", "9" ],
        question: {
            html: ".questionLi",
            question: "h3",
            options: "ul:eq(0) li .after, .answer_p",
            type: "input[name^=answertype]:eq(0)",
            workType: "zy",
            pageType: "cx"
        },
        questionHook: e => {
            const t = removeHtml(G(e.html).find(".colorShallow").html());
            return e.question = titleClean(e.question.split(t)[1].trim()).trim(), e.$options = G(e.html).find(".answerBg"), 
            e;
        },
        setAnswerHook: e => {
            qc(e.html), qc1(e.html);
        }
    }, {
        type: "ask",
        name: "\u5b66\u4e60\u901a\u65b0\u7248\u8003\u8bd5",
        match: /exam\/preview/i.test(location.pathname) || /exam\/test\/reVersionTestStartNew/i.test(location.pathname),
        types: [ "0", "1", "2", "3", "4", "5", "6", "7", "9" ],
        question: {
            html: ".questionLi",
            question: "h3",
            options: "ul:eq(0) li .after, .answer_p",
            type: "input[name^=type]:not([name=type])",
            workType: "ks",
            pageType: "cx"
        },
        questionHook: e => {
            const t = removeHtml(G(e.html).find(".colorShallow").html());
            if (e.question = titleClean(e.question.split(t)[1].trim()).trim(), e.$options = G(e.html).find(".answerBg"), 
            "3" === e.type) e.options = [];
            return e;
        },
        setAnswerHook: e => {
            qc(e.html), qc1(e.html);
        },
        next: () => {
            G('.nextDiv .jb_btn:contains("\u4e0b\u4e00\u9898")').click();
        }
    }, {
        type: "ask",
        name: "\u5b66\u4e60\u901a\u65e7\u7248\u4f5c\u4e1a",
        match: /work\/doHomeWorkNew/i.test(location.pathname) && 0 == location.href.includes("mooc2=1"),
        types: [ "0", "1", "2", "3", "4", "5", "6", "7", "9" ],
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
            switch (e.question = titleClean(e.question).trim(), e.$options = G(e.html).find(".fl.before"), 
            e.type) {
              case "3":
                e.options = G(e.html).find("ul:eq(0) li").map(((e, t) => G(t).find(".ri").length > 0 ? "\u6b63\u786e" : G(t).find(".wr").length > 0 ? "\u9519\u8bef" : isTrue(G(t).attr("aria-label") || "") ? "\u6b63\u786e" : isFalse(G(t).attr("aria-label") || "") ? "\u9519\u8bef" : void 0)).get(), 
                e.$options = G(e.html).find("ul>li");
                break;

              case "11":
                let t = G(e.html).find("ul.firstUlList>li:not(.groupTitile)").map(((e, t) => {
                    let n = G(t).clone();
                    return n.find(".fl").remove(), removeHtml(n.html());
                })).get(), n = G(e.html).find("ul.secondUlList>li:not(.groupTitile)").map(((e, t) => {
                    let n = G(t).clone();
                    return n.find(".fl").remove(), removeHtml(n.html());
                })).get();
                e.options = [ t, n ], e.$options = G(e.html).find("ul.thirdUlList>li:not(.groupTitile)");
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
                    let a = e.ques.options[0], o = e.ques.options[1], s = e.answer[a[t]], i = o.indexOf(s);
                    s = String.fromCharCode(i + 65), G(n).find("select>option").each(((e, t) => {
                        G(t).val(), G(t).val() == s && G(t).prop("selected", !0);
                    }));
                })), e.answer, !1;

              case "3":
                let t = e.answer;
                return e.ques.$options.each(((e, n) => {
                    isTrue(t) && (isTrue(removeHtml(G(n).html())) || G(n).find(".ri").length > 0) && G(n).find("input").click(), 
                    isFalse(t) && (isFalse(removeHtml(G(n).html())) || G(n).find(".wr").length > 0) && G(n).find("input").click();
                })), !1;

              default:
                return !0;
            }
        }
    }, {
        type: "ask",
        name: "\u5b66\u4e60\u901a\u65b0\u7248\u7ae0\u8282",
        match: /work\/doHomeWorkNew/i.test(location.pathname) && location.href.includes("mooc2=1"),
        types: [ "0", "1", "2", "3", "4", "5", "6", "7", "9" ],
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
                e.options = G(e.html).find("ul:eq(0) li").map(((e, t) => "true" === G(t).find(".num_option").attr("data") ? "\u6b63\u786e" : "false" === G(t).find(".num_option").attr("data") ? "\u9519\u8bef" : void 0)).get(), 
                e.options = [];
                break;

              case "11":
                let t = G(e.html).find("ul.firstUlList>li:not(.groupTitile)").map(((e, t) => {
                    let n = G(t).clone();
                    return n.find(".fl").remove(), removeHtml(n.html());
                })).get(), n = G(e.html).find("ul.secondUlList>li:not(.groupTitile)").map(((e, t) => {
                    let n = G(t).clone();
                    return n.find(".fl").remove(), removeHtml(n.html());
                })).get();
                e.options = [ t, n ], e.$options = G(e.html).find("ul.thirdUlList>li:not(.groupTitile)");
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
            let a = e.ques.options[0], o = e.ques.options[1], s = e.answer[a[t]], i = o.indexOf(s);
            s = String.fromCharCode(i + 65), xe.$(n).find(".dept_select").chosen().val(s).trigger("chosen:updated");
        })), e.answer, !1))
    } ], Fe = [ {
        type: "ask",
        name: "\u667a\u6167\u6811\u7ae0\u8282",
        tips: "\u667a\u6167\u6811\u5fc5\u987b\u5f00\u81ea\u52a8\u8df3\u8f6c\uff0c\u5426\u5219\u7b54\u6848\u53ef\u80fd\u65e0\u6cd5\u4fdd\u5b58\u5bfc\u81f4\u4f4e\u5206\uff01",
        match: location.href.includes("zhihuishu.com") && !location.href.includes("checkHomework") && location.host.includes("zhihuishu") && ("/stuExamWeb.html" === location.pathname || location.href.includes("/webExamList/dohomework/") || location.href.includes("/webExamList/doexamination/")),
        types: [ "0", "1", "2", "3" ],
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
                return !G(".yidun_popup").hasClass("yidun_popup--light") && xe.zhsques;
            }));
        },
        next: () => {
            G(".switch-btn-box button:eq(1)").click();
        },
        questionHook: (e, t) => {
            const n = xe.zhsques.examBase.workExamParts.map((e => e.questionDtos)).flat()[t];
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
                return G(".questionType").length > 0 && G(".questionType:eq(0)")[0].__vue__.answerImgMap;
            }));
        },
        answerHook: e => {
            const t = G(e.html)[0].__vue__, n = t.answerData[t.data.id], a = "1" === n.isCurrent ? n.answer.split(",") : [], o = t.data, s = t.answerImgMap[t.data.id] || "";
            t.answerImgMap, t.data.id, somd5(s), e.type = typeMatch(o.questionType.name);
            const i = [];
            if (e.options = o.questionOptions.map((e => (a.includes(String(e.id)) && i.push(removeHtml(e.content)), 
            removeHtml(e.content)))), e.answer = i, "3" === e.type) {
                e.options = [];
                const t = e.answer[0];
                e.answer = isTrue(t) ? [ "\u6b63\u786e" ] : isFalse(t) ? [ "\u9519\u8bef" ] : [];
            }
            return e;
        }
    }, {
        type: "save",
        name: "\u667a\u6167\u6811\u8003\u8bd5\u6536\u5f55",
        match: location.href.includes("zhihuishu.com") && location.href.includes("/atHomeworkExam/stu/examQ/doExamnew"),
        question: {
            html: ".subjecttype-div.clearfloat",
            question: ".subjectTitle-p",
            options: ".TitleOptions-div label",
            type: ".subjecttopic-div",
            workType: "zhs",
            pageType: "zhs"
        },
        init: async () => {
            await waitUntil((function() {
                return G(".subjecttype-div.clearfloat").length > 0;
            }));
        },
        answerHook: e => {
            const t = G(e.html).find(".Referenceanswer-div.clearFloat>.Referenceanswer-r.fl").text();
            return e.question = removeHtml(e.question), e.options = removeStartChar(e.options), 
            e.type = typeMatch(G(e.html).find(".subjecttopic-div").text()), e.answer = t.split("").map((t => e.options[t.charCodeAt(0) - 65])), 
            "3" == e.type && (e.options = [], e.answer = isTrue(e.answer[0]) ? [ "\u6b63\u786e" ] : isFalse(e.answer[0]) ? [ "\u9519\u8bef" ] : []), 
            e;
        }
    } ], Me = [ {
        type: "hook",
        name: "\u82af\u4f4d\u6559\u80b2hook",
        match: "www.beeline-ai.com" === location.host,
        main: async e => {
            const getPageIdentifier = () => G(".el-main > div:eq(0)").attr("class");
            xe.mainClass = getPageIdentifier();
            const t = new MutationObserver((async e => {
                const n = getPageIdentifier();
                xe.mainClass !== n && (xe.mainClass = n, "homework-detail-container" === n && await waitUntil((() => 0 === G(".el-loading-mask").length)), 
                vuePageChange$1(), t.disconnect());
                for (const a of e) if ("attributes" === a.type && "class" === a.attributeName) {
                    const e = a.target.textContent;
                    if (e && (e.includes("\u4e0b\u4e00\u9898") || e.includes("\u4e0a\u4e00\u9898"))) {
                        vuePageChange$1(), t.disconnect();
                        break;
                    }
                }
            }));
            G("body").length >= 1 && t.observe(G("body")[0], {
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
        types: [ "0", "1", "3" ],
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
                return 0 !== G(".question-box").length;
            }));
        },
        next: () => {
            G('.toggle-box > button:contains("\u4e0b\u4e00\u9898")').click();
        },
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => (e.type = typeMatch(G(e.html).find(".question-box>.tag").text()), 
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
                return 0 !== G(".question-content-body").length;
            }));
        },
        answerHook: e => {
            e.type = typeMatch(G(e.html).find(".question-box>.tag").text());
            let t = G(e.html).find(".answer-area > span:eq(1)").text();
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
    } ], Ne = [ {
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
    } ], De = {
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
    }, Be = [ {
        type: "hook",
        name: "\u56fd\u5f00hook",
        match: location.host.includes("ouchn.cn"),
        main: e => {
            xe.mainClass = getUrl();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getUrl() && (xe.mainClass = getUrl(), "homework-detail-container" === xe.mainClass && await waitUntil((function() {
                    return 0 !== G(".selectDan").length;
                })), vuePageChange$1(), t.disconnect());
            }));
            G("body").length >= 1 && t.observe(G("body")[0], {
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
                return G(".loading-gif").hasClass("ng-hide");
            }));
        },
        answerHook: e => {
            const t = xe.angular.element(e.html).scope().subject;
            if ("text" === t.type) return;
            let n = !1;
            const a = parseFloat(t.point), o = parseFloat(t.score), s = 0 !== a && a === o;
            let i = G(`<div>${t.description}</div>`).clone();
            if (i.find("span.__blank__").remove(), e.question = removeHtml(i.html()), e.options = t.options.map((e => removeHtml(e.content))), 
            e.type = typeConvert(De[t.type]), t.correctOptions && t.correctOptions.length > 0 && (e.answer = t.correctOptions.map((e => removeHtml(e.content))), 
            n = !0), t.correct_answers && t.correct_answers.length > 0 && (e.answer = t.correct_answers.map((e => e.content)), 
            n = !0), n || s) {
                switch (t.type) {
                  case "single_selection":
                  case "multiple_selection":
                  case "true_or_false":
                    if (n) "true_or_false" === t.type && (e.answer = judgeAnswer(e.answer[0]), e.options = []); else {
                        if (t.options, e.answer = t.options.filter((e => e.isChosen)).map((e => removeHtml(e.content))), 
                        0 === e.answer.length) return;
                        "true_or_false" === t.type && (e.answer = judgeAnswer(e.answer[0]), e.options = []);
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
            const t = xe.globalData.course, n = xe.angular.element(G("body")).scope(), a = xe.angular.element(G(".hd")).scope().exam, o = n.submissionData.id;
            if (!n.examSubmissions.find((e => (e.id, String(e.id) === String(o))))) return;
            const s = {
                platform: "guokai"
            };
            s.hash = t.id, s.name = t.name, s.info = {}, s.info.school = t.orgName, s.chapter = [ {
                hash: `${a.id}`,
                name: a.title,
                question: e
            } ], Oe.setPaper(s.hash, s);
        }
    }, {
        type: "save",
        name: "\u5e7f\u5f00\u7b54\u6848\u6536\u5f55",
        match: /mod\/quiz\/review\.php/i.test(location.pathname),
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
            G(".specificfeedback").remove();
        },
        next: async () => {
            !G(".qn_buttons > a").last().hasClass("thispage") && G(".arrow_text").click();
        },
        answerHook: e => {
            const t = G(e.html).find(".info .state").text();
            if (e.type = (G(e.html).attr("class") || "").split(" ")[1], G(e.html).find(".qtext .accesshide").remove(), 
            e.question = removeHtml(G(e.html).find(".qtext").html()), e.question.includes("egg")) {
                let t = G(e.html).clone();
                t.find("img").each((function() {
                    var e;
                    (null == (e = G(this).attr("src")) ? void 0 : e.includes("egg")) && G(this).remove();
                })), e.question = removeHtml(t.find(".qtext").html());
            }
            switch (e.type, e.type) {
              case "truefalse":
                e.type = "3", e.$options = G(e.html).find("input[type=radio]"), e.options = G(e.html).find(".answer > div").map(((e, t) => removeHtml(G(t).html()).trim())).get(), 
                e.answer = [], e.answer = G(e.html).find(".answer > div").map(((t, n) => e.$options.eq(t).prop("checked") ? e.options[t] : "")).get(), 
                e.answer = e.answer.filter((e => "" !== e)), 0 === e.answer.length ? (e.temp = removeHtml(G(e.html).find(".rightanswer").html()).replace("\u6b63\u786e\u7b54\u6848\u662f", "").trim(), 
                e.answer = [ e.temp ]) : t.includes("\u6b63\u786e") || (e.answer = e.options.filter((t => !t.includes(e.answer[0])))), 
                isTrue(e.answer[0]) ? e.answer = [ "\u6b63\u786e" ] : isFalse(e.answer[0]) ? e.answer = [ "\u9519\u8bef" ] : e.answer = [], 
                e.options = [];
                break;

              case "multichoice":
              case "multichoiceset":
                if (e.type = "1", e.$options = G(e.html).find("input[type=checkbox]"), 0 === e.$options.length && (e.type = "0", 
                e.$options = G(e.html).find("input[type=radio]")), e.options = G(e.html).find(".answer > div").map(((e, t) => {
                    let n = G(t).find(".answernumber").text().trim(), a = removeHtml(G(t).html());
                    return "" === n ? a.trim() : a.split(n)[1].trim();
                })).get(), t.includes("\u6b63\u786e") && !t.includes("\u90e8\u5206\u6b63\u786e")) e.answer = [], 
                e.answer = G(e.html).find(".answer > div").map(((t, n) => {
                    let a = G(n).find(".answernumber").text().trim(), o = removeHtml(G(n).html());
                    return e.$options.eq(t).prop("checked") && G(n).find(".text-success").length > 0 ? "" === a ? o.trim() : o.split(a)[1].trim() : "";
                })).get(), e.answer = e.answer.filter((e => "" !== e)); else {
                    e.temp = removeHtml(G(e.html).find(".rightanswer").html(), !1).replace("\u6b63\u786e\u7b54\u6848\u662f\uff1a", "").trim();
                    const t = e.options.slice(0);
                    t.sort(((e, t) => t.length - e.length)), e.answer = t.map((t => e.temp.includes(t) ? (e.temp = e.temp.replace(t, ""), 
                    t) : "")), e.answer = e.answer.filter((e => "" !== e)), e.answer.length;
                }
                break;

              case "shortanswer":
                e.type = "4", e.$options = G(e.html).find("input[type=text]"), e.answer = removeHtml(G(e.html).find(".rightanswer").html()).replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim();
                break;

              case "match":
                e.type = "24", e.match = G(".answer tr td.text").map(((e, t) => removeHtml(G(t).html()))).get(), 
                e.$options = G(".answer tr td.control select"), e.selects = G(".answer tr td.control select").map(((e, t) => [ G(t).find("option").map(((e, t) => ({
                    value: G(t).val(),
                    text: G(t).text()
                }))).get() ])).get();
                break;

              case "multianswer":
                e.type = "14";
                let n = G(e.html).find(".formulation").clone();
                n.find(".subquestion").remove(), n.find(".accesshide").remove(), e.question = removeHtml(n.html());
                let a = [], o = [];
                G(e.html).find(".subquestion").map(((e, t) => {
                    let n = G(t).find("select>option").map(((e, t) => removeHtml(G(t).html()))).get();
                    n = n.filter((e => "" !== e)), a.push(n);
                    let s = G(t).find("select>option:selected").map(((e, t) => removeHtml(G(t).html()))).get();
                    o.push(s[0]);
                })), e.options = a;
                G(e.html).find(".text-success").length == e.options.length && (e.answer = o);
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
            t.hash = (xe.document.body.innerHTML.match(/(?:courseid)=(\d+)/) || [])[1] || "";
            const n = (xe.document.body.innerHTML.match(/(?:cmid)=(\d+)/) || [])[1] || "";
            "" !== t.hash && "" !== n && (t.info = {}, t.name = G("h1").text().trim(), t.chapter = [ {
                hash: `${n}`,
                name: xe.document.title.trim(),
                question: e
            } ], Oe.setPaper(t.hash, t));
        }
    }, {
        type: "ask",
        name: "\u5e7f\u5f00\u5f62\u8003",
        tips: "\u5e7f\u5f00\u4ec5\u652f\u6301\u57fa\u7840\u9898\u578b\uff0c\u7279\u6b8a\u9898\u578b\u8bf7\u624b\u52a8\u5b8c\u6210",
        match: /mod\/quiz\/attempt\.php/i.test(location.pathname),
        types: [ "0", "1", "2", "3", "4", "5", "6", "7", "9", "14", "24" ],
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
            if (e.type = (G(e.html).attr("class") || "").split(" ")[1], G(e.html).find(".qtext .accesshide").remove(), 
            e.question = removeHtml(G(e.html).find(".qtext").html()), e.question.includes("egg")) {
                let t = G(e.html).clone();
                t.find("img").each((function() {
                    var e;
                    (null == (e = G(this).attr("src")) ? void 0 : e.includes("egg")) && G(this).remove();
                })), e.question = removeHtml(t.find(".qtext").html());
            }
            switch (e.type) {
              case "truefalse":
                e.type = "3", e.$options = G(e.html).find("input[type=radio]"), e.options = [];
                break;

              case "multichoice":
              case "multichoiceset":
                e.type = "1", e.$options = G(e.html).find("input[type=checkbox]"), 0 === e.$options.length && (e.type = "0", 
                e.$options = G(e.html).find("input[type=radio]")), e.options = G(e.html).find(".answer > div").map(((e, t) => {
                    let n = G(t).find(".answernumber").text().trim(), a = removeHtml(G(t).html());
                    return "" === n ? a.trim() : a.split(n)[1].trim();
                })).get();
                break;

              case "shortanswer":
                e.type = "4", e.$options = G(e.html).find("input[type=text]");
                break;

              case "match":
                e.type = "24", e.match = G(".answer tr td.text").map(((e, t) => removeHtml(G(t).html()))).get(), 
                e.$options = G(".answer tr td.control select"), e.selects = G(".answer tr td.control select").map(((e, t) => [ G(t).find("option").map(((e, t) => ({
                    value: G(t).val(),
                    text: G(t).text()
                }))).get() ])).get();

              case "essay":
                e.type = "4", e.$options = G(e.html).find("iframe");
                break;

              case "multianswer":
                e.type = "14";
                let t = G(e.html).find(".formulation").clone();
                t.find(".subquestion").remove(), t.find(".accesshide").remove(), e.question = removeHtml(t.html());
                let n = [];
                G(e.html).find(".subquestion").map(((e, t) => {
                    let a = G(t).find("select>option").map(((e, t) => removeHtml(G(t).html()))).get();
                    a = a.filter((e => "" !== e)), n.push(a), G(t).find("select>option:selected").map(((e, t) => removeHtml(G(t).html()))).get();
                })), e.$options = G(e.html).find("select"), e.options = n;
                break;

              case "description":
                return;
            }
            return e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "4":
                return G(e.html).find("input.form-control").each((function(t, n) {
                    G(n).val(e.answer[t]);
                })), G(e.html).find("iframe:eq(0)").contents().find("body").html(e.answer[0]), !1;

              case "3":
                e.ques.$options.each(((t, n) => {
                    const a = G(n).parent().find("label").text();
                    return "object" == typeof e.answer && (e.answer = e.answer[0]), isTrue(e.answer) && isTrue(a) ? (G(n).click(), 
                    !1) : !isFalse(e.answer) || !isFalse(a) || (G(n).click(), !1);
                }));

              case "14":
                return G(e.html).find("select").each(((t, n) => {
                    const a = e.answer[t];
                    G(n).find(`option:contains("${a}")`).prop("selected", !0);
                })), !1;

              default:
                return !0;
            }
        },
        finish: e => {
            G(".submitbtns .btn-primary").click();
        }
    }, {
        type: "ask",
        name: "\u56fd\u5f00\u4e13\u9898\u6d4b\u9a8c",
        match: /\/exam\/([0-9]+)\/subjects/i.test(location.pathname) && !/\/exam\/([0-9]+)\/subjects#\/submission\/([0-9]+)/i.test(location.href),
        types: [ "0", "1", "2", "3", "4", "5", "6", "7", "9", "14", "24" ],
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
                return G(".loading-gif").hasClass("ng-hide") && "" === G(".hd .examinee .submit-label").eq(0).text();
            })), await waitUntil((function() {
                return 0 !== G("li.subject").length;
            }));
        },
        ischecked: e => Boolean(e.parent().find("input").eq(-1).prop("checked")),
        questionHook: e => {
            const t = xe.angular.element(e.html).scope(), n = t.subject;
            if ("text" === n.type) return;
            e.type = typeConvert(De[n.type]);
            let a = G(`<div>${n.description}</div>`).clone();
            switch (a.find("span.__blank__").remove(), e.question = removeHtml(a.html()), n.options = n.options.sort(((e, t) => e.sort - t.sort)), 
            e.options = n.options.map((e => removeHtml(e.content))), e.type, n.type, n.type) {
              case "cloze":
                e.options = n.sub_subjects.map((e => e.options.map((e => removeHtml(e.content))))), 
                e.$options = G(e.html).find("select");

              case "true_or_false":
                e.options = [];
            }
            return e.subject = n, e.scope = t, e;
        },
        setAnswer: e => {
            switch (e.ques, e.type) {
              case "2":
                return G(e.html).find(".___answer"), G(e.html).find(".___answer").each(((t, n) => {
                    G(n).html(e.answer[t]), e.ques.scope.subject.answers[t].content = e.answer[t], e.ques.scope.onChangeSubmission(e.ques.subject);
                })), !1;

              case "4":
                return G(e.html).find(".simditor-body.needsclick>p").each((function(t, n) {
                    G(n).html(e.answer[t]), e.ques.subject.answered_content = e.answer[t];
                })), e.ques.scope.onChangeSubmission(e.ques.subject), !1;

              case "14":
                return e.ques.subject.sub_subjects.forEach(((t, n) => {
                    let a = e.answer[n];
                    t.options.forEach(((o, s) => {
                        o.content === a && (t.answeredOption = String(o.id), e.ques.scope.onChangeSubmission(t), 
                        G(e.html).find(`input[value="${o.id}"]`).click(), G(e.html).find(`button:eq(${n})>span:eq(1)`).text(a));
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
            e.$options = G(e.html).find("ul>li");
            let t = G(e.html).find("ul>li.checked").map(((e, t) => removeHtml(G(t).find(".ErichText").html() || G(t).html()))).get();
            const n = G(e.html).find(".e-q-right").length > 0;
            e.answer = t.filter((e => "" !== e));
            let a = G(e.html).find(".e-ans-ref .e-ans-r").map(((e, t) => removeHtml(G(t).html()))).get().map((t => {
                let n = t.charCodeAt() - 65;
                return e.options[n];
            })).filter((e => "" !== e && void 0 !== e));
            switch (e.options = removeStartChar(e.options), G(e.html).attr("data-questiontype")) {
              case "2":
                e.type = "1";
                break;

              case "1":
                e.type = "0";
                break;

              case "3":
                e.type = "3", e.answer = G(e.html).find("ul>li.checked").map(((e, t) => removeHtml(G(t).html()))).get(), 
                e.options = [], isTrue(e.answer[0]) ? e.answer = [ "\u6b63\u786e" ] : isFalse(e.answer[0]) ? e.answer = [ "\u9519\u8bef" ] : e.answer = [];
                break;

              case "8":
                e.type = "15";
                const t = G(e.html).find(".e-q-quest form").map(((e, t) => {
                    let n = removeHtml(G(t).find(".e-q-q .ErichText").html()), a = G(t).find("ul>li").map(((e, t) => removeHtml(G(t).find(".ErichText").html() || G(t).html()))).get(), o = "0";
                    a = removeStartChar(a);
                    const s = G(t).find(".e-a-right").length > 0, i = G(t).find(".e-ans-ref .e-ans-r").map(((e, t) => removeHtml(G(t).html()))).get();
                    let r = i.map((e => {
                        let t = e.charCodeAt() - 65;
                        return a[t];
                    })).filter((e => "" !== e && void 0 !== e));
                    if (2 === a.length && 1 === i.length) {
                        let e = judgeAnswer(i[0]);
                        e.length > 0 && (r = e, a = [], o = "3");
                    }
                    return r.length > 1 && (o = "1"), {
                        question: n,
                        options: a,
                        answer: r,
                        isT: s,
                        type: o
                    };
                })).get();
                if (t.some((e => !e.isT))) return;
                a = t.map((e => e.answer)).flat(), e.options = t.map((e => ({
                    question: e.question,
                    options: e.options,
                    type: e.type
                })));
                break;

              case "11":
                e.type = "19";
                const n = G(e.html).find("form").map(((e, t) => ({
                    type: "0",
                    question: removeHtml(G(t).find(".e-q-q .ErichText").html()),
                    options: G(t).find("ul li .ErichText").map(((e, t) => removeHtml(G(t).html()))).get()
                }))).get();
                a = a.length > 0 ? judgeAnswer(a[0]) : [], e.options = n;
                break;

              default:
                return void G(e.html).attr("data-questiontype");
            }
            return a.length > 0 ? (e.answer = a, e) : !n && "3" === e.type && e.answer.length > 0 || !n ? void 0 : e;
        },
        paper: async e => {
            const t = {
                platform: "shou"
            }, n = G("input[name=CourseOpenId]").val(), a = G("input[name=WorkId]").val();
            await request("https://l.shou.org.cn/student/CourseScoreNew-inside.aspx", "GET").then((e => {
                const a = G(e[0].responseText);
                t.name = a.find(`#courseSelect>option[data-xid="${n}"]`).text().trim(), t.info = {};
            })), t.hash = n, t.info = {}, t.chapter = [ {
                hash: `${a}`,
                name: G(".mark_title").text().trim(),
                question: e
            } ], Oe.setPaper(t.hash, t);
        }
    }, {
        type: "ask",
        name: "\u4e0a\u6d77\u5f00\u653e\u4f5c\u4e1a",
        tips: "",
        match: () => "l.shou.org.cn" === location.host && (location.href.includes("assignment/preview.aspx?homeWorkId") || location.href.includes("study/assignment/continuation.aspx")),
        types: [ "0", "1", "3" ],
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
                return 0 !== G(".e-q-body").length;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            switch (G(e.html).attr("data-questiontype")) {
              case "2":
                e.type = "1";
                break;

              case "1":
                e.type = "0";
                break;

              case "3":
                e.type = "3", e.$options = G(e.html).find("ul>li");
                break;

              case "8":
                e.type = "15", e.quesList = G(e.html).find("form").map(((e, t) => ({
                    type: "0",
                    question: removeHtml(G(t).find(".e-q-q .ErichText").html()),
                    options: G(t).find("ul li .ErichText").map(((e, t) => removeHtml(G(t).html()))).get()
                }))).get();
                break;

              default:
                return void G(e.html).attr("data-questiontype");
            }
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    } ], Ve = [ {
        type: "ask",
        name: "\u6210\u6559\u4e91\u8003\u8bd5",
        tips: "",
        match: () => location.href.includes("student/exam/resource/paper_card"),
        types: [ "0", "1", "3" ],
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
            })), !xe.top.location.href.includes("student/exam2/doexam")) return !1;
        },
        toquestion: async e => {
            G(xe.top.document).find(".ui-card-questions ul li:eq(" + e + ")").click();
        },
        next: async () => {
            G("#next-btn").click();
        },
        ischecked: e => e.hasClass("ui-option-selected"),
        questionHook: e => {
            if (e.type = typeMatch(G(e.html).parent().find(".ui-question-group-title").text()), 
            e.$options = G(e.html).find(".ui-question-options li>span"), "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => {
            if ("3" === e.type) {
                let t = e.answer;
                return e.ques.$options.each(((e, n) => {
                    isTrue(t) && isTrue(removeHtml(G(n).parent().html())) && G(n).click(), isFalse(t) && isFalse(removeHtml(G(n).parent().html())) && G(n).click();
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
            })), xe.top.location.href.includes("student/exam2/doexam")) return !1;
        },
        answerHook: e => {
            if (e.type = typeMatch(G(e.html).parent().find(".ui-question-group-title").text()), 
            e.$options = G(e.html).find(".ui-question-options li>span"), e.answer = G(e.html).find(".ui-question-options li.ui-correct-answer .ui-question-content-wrapper").map(((e, t) => removeHtml(G(t).html()))).get(), 
            "3" === e.type) e.options = [], e.answer = isTrue(e.answer[0]) ? [ "\u6b63\u786e" ] : isFalse(e.answer[0]) ? [ "\u9519\u8bef" ] : [];
            return e;
        }
    } ], Ge = [ {
        type: "hook",
        name: "hook",
        match: () => "xuexi.jsou.cn" === location.host && location.href.includes("newHomework/showHomeworkByStatus") && location.href.includes("checked=true"),
        main: e => {
            xe.mainClass = G("#homeworkHistory").find(".active").attr("id");
            let t = new MutationObserver((async e => {
                xe.mainClass !== G("#homeworkHistory").find(".active").attr("id") && (xe.mainClass = G("#homeworkHistory").find(".active").attr("id"), 
                await waitUntil((function() {
                    return 0 === G(".layui-layer-shade").length;
                })), vuePageChange$1(), t.disconnect());
                for (let n of e) "attributes" === n.type && "class" === n.attributeName && n.target.textContent && (n.target.textContent.includes("\u4e0b\u4e00\u9898") || n.target.textContent.includes("\u4e0a\u4e00\u9898")) && (t.disconnect(), 
                vuePageChange$1());
            }));
            G("body").length >= 1 && t.observe(G("body")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u6c5f\u82cf\u5f00\u653e\u5927\u5b66\u7b54\u9898",
        tips: "",
        match: () => "xuexi.jsou.cn" === location.host && location.href.includes("/showHomeworkByStatus") && location.href.includes("checked=false"),
        types: [ "0", "1", "2", "3" ],
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
        questionHook: e => (e.type = G(e.html).find(".questionDiv >div:eq(1)").text().trim(), 
        e.type = typeConvert(e.type), e.$options = G(e.html).find(".questionId-option li .numberCover"), 
        "3" == e.type && (e.options = []), e),
        setAnswer: e => {
            switch (e.type) {
              case "2":
                if (e.$options = G(e.html).find(".questionTitle input"), e.$options.length == e.answer.length) return e.$options.each(((t, n) => {
                    G(n).val(e.answer[t]);
                })), !1;
                break;

              case "3":
                let t = e.answer;
                return G(e.html).find(".questionId-option>.default-option").each(((e, n) => {
                    isTrue(t) && isTrue(removeHtml(G(n).find(".option-title>div:eq(1)").html())) && G(n).find("div.numberCover").click(), 
                    isFalse(t) && isFalse(removeHtml(G(n).find(".option-title>div:eq(1)").html())) && G(n).find("div.numberCover").click();
                })), !1;

              case "4":
                const n = G(e.html).find(".jianda-answer>div").attr("id");
                return xe.UE.getEditor(`${n}`).setContent(e.answer), !1;
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
            const t = G(e.html).find(".questionDiv >div").text(), n = t.match(/\u5206\u503c(\d+)\u5206/), a = t.match(/\u5f97\u5206\uff1a(\d+)/);
            if (!n || !a) return null;
            e.type = typeConvert(G(e.html).find(".questionDiv >div:eq(1)").text());
            if (!(n[1] === a[1] && "0" !== a[1]) && "3" !== e.type) return null;
            switch (e.type) {
              case "0":
              case "1":
              case "3":
                if (e.answer = G(e.html).find(".answer .correctAnswer").text().trim().split("\uff1b").map((t => e.options[t.charCodeAt(0) - 65])), 
                e.answer = e.answer.filter((e => e)), 0 == e.answer.length && (e.answer = G(e.html).find(".answer .studentAnswer").text().trim().split("\uff1b").map((t => e.options[t.charCodeAt(0) - 65]))), 
                e.answer = e.answer.filter((e => e)), 3 == e.type) {
                    e.options = [];
                    let t = e.answer[0];
                    if (isFalse(t)) e.answer = "\u9519\u8bef"; else {
                        if (!isTrue(t)) return;
                        e.answer = "\u6b63\u786e";
                    }
                }
                break;

              case "2":
                e.options = [], e.answer = G(e.html).find(".answer .correctAnswer").text().trim().split("\uff1b"), 
                e.answer = e.answer.filter((e => e)), 0 == e.answer.length && (e.answer = G(e.html).find(".answer .studentAnswer").text().trim().split("\uff1b")), 
                e.answer = e.answer.filter((e => e));
                break;

              default:
                return;
            }
            return e;
        },
        paper: e => {
            const t = xe.homework, n = {
                platform: "jsou"
            };
            n.hash = t.courseId, n.name = t.courseName, n.info = {}, n.chapter = [ {
                hash: `${t.homeworkId}`,
                name: t.title,
                question: e
            } ], Oe.setPaper(n.hash, n);
        }
    } ], Re = [ {
        type: "hook",
        name: "hook",
        match: "spoc-exam.icve.com.cn" === location.host || location.host.includes("exam.courshare.cn") || location.host.includes("webtrn.cn"),
        main: e => {
            xe.mainClass = G(".q_content").first().attr("id");
            let t = new MutationObserver((async e => {
                xe.mainClass !== G(".q_content").first().attr("id") && (xe.mainClass = G(".q_content").first().attr("id"), 
                "homework-detail-container" === xe.mainClass && await waitUntil((function() {
                    return 0 !== G(".q_content").length;
                })), vuePageChange$1(), t.disconnect());
                for (let n of e) "attributes" === n.type && "class" === n.attributeName && n.target.textContent && (n.target.textContent.includes("\u4e0b\u4e00\u9898") || n.target.textContent.includes("\u4e0a\u4e00\u9898")) && (t.disconnect(), 
                vuePageChange$1());
            }));
            G("#examPage").length >= 1 && t.observe(G("#examPage")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "hook",
        name: "hook",
        match: "zjy2.icve.com.cn" === location.host || "zyk.icve.com.cn" === location.host || "ai.icve.com.cn" === location.host,
        main: e => {
            G(".minimized-dialog img").css({
                "z-index": "999999"
            }), xe.mainClass = G("#app")[0].__vue__.$route.name;
            let t = new MutationObserver((async e => {
                xe.mainClass !== G("#app")[0].__vue__.$route.name && (xe.mainClass = G("#app")[0].__vue__.$route.name, 
                "homework-detail-container" === xe.mainClass && await waitUntil((function() {
                    return 0 !== G(".q_content").length;
                })), vuePageChange$1(), t.disconnect());
            }));
            G("#app").length >= 1 && t.observe(G("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u804c\u6559\u4e91\u4f5c\u4e1a",
        tips: "",
        match: () => location.href.includes("examflow_index.action"),
        types: [ "0", "2", "1", "3", "4" ],
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
                return 0 !== G(".q_content").length;
            }));
        },
        next: () => {},
        finish: e => {
            G('.paging_next:contains("\u4e0b\u4e00\u9875")').click();
        },
        ischecked: e => 0 !== e.parent().find(".checkbox_on").length,
        questionHook: e => {
            var t, n;
            e.question = removeHtml(G(e.html).find(".divQuestionTitle").html());
            let a = G(e.html).find("[name='quesId']").attr("id"), o = null == (n = null == (t = document.getElementById(`questionId[${a}]`)) ? void 0 : t.getAttribute("answertype")) ? void 0 : n.trim(), s = G(e.html).find("span[name^='questionIndex']").text().trim() + "\u3001", i = G(e.html).find(".q_score").text().trim();
            switch (e.question = e.question.replace(s, "").replace(i, "").trim(), e.options = G(e.html).find(".questionOptions>div").map(((e, t) => {
                let n = G(t).find(".option_index").text().trim();
                return removeHtml(G(t).html()).replace(n, "").trim();
            })).get(), e.$options = G(e.html).find(".questionOptions>div input"), o) {
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
                e.type = "2", e.question = removeHtml(G(e.html).find("[name='fillblankTitle']").html());
                break;

              case "cloze":
                e.type = "14", e.options = G(e.html).find(".questionOptions>.exam_cloze_choice").map(((e, t) => [ G(t).find(".optionContent").map(((e, t) => removeHtml(G(t).html()))).get() ])).get();
                break;

              case "textarea":
                e.type = "4", e.options = [];
            }
            return e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "2":
                return G(e.html).find(".fillblank_input > input").each(((t, n) => {
                    G(n).val(e.answer[t]);
                })), !1;

              case "3":
                let t = e.answer;
                return e.ques.$options.each(((e, n) => {
                    isTrue(t) && isTrue(removeHtml(G(n).parent().html())) && G(n).click(), isFalse(t) && isFalse(removeHtml(G(n).parent().html())) && G(n).click();
                })), !1;

              case "4":
                let n = G(e.html).find("[name='quesId']").attr("id");
                return xe.UE.getEditor(`_baidu_editor_${n}`).setContent(`<p>${e.answer}</p>`), !1;
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
                return 0 !== G(".q_content").length;
            }));
        },
        answerHook: e => {
            const t = G(e.html).find(".exam.icon_examright").length, n = G(e.html).find("input[name='quesId']:not([id='']").attr("id"), a = G(`input#qId${n}`).attr("qtype"), o = G(e.html).find("span[name^='questionIndex']").text().trim() + "\u3001", s = G(e.html).find(".q_score").text().trim();
            switch (e.question = e.question.replace(o, "").replace(s, "").trim(), e.options = G(e.html).find(".questionOptions>div.q_option_readonly").map(((e, t) => {
                let n = G(t).find("span[name='optionIndexName']").text().trim();
                return removeHtml(G(t).html()).replace(n, "").trim();
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
                const t = G(e.html).find(".answerOption>span:eq(0)").clone();
                t.find(".exam_answers").remove(), e.question = titleClean(removeHtml(t.html())).replace(/\uff08.*?\u5206\uff09/g, "").trim();
                break;

              case "cloze":
              case "\u5b8c\u5f62\u586b\u7a7a":
                e.type = "14", e.options = G(e.html).find(".questionOptions>.exam_cloze_choice").map(((e, t) => [ G(t).find(".optionContent").map(((e, t) => removeHtml(G(t).html()))).get() ])).get(), 
                e.answer = G(e.html).find(".exam_rightAnswer .answer_table .one_answer>span").map(((t, n) => {
                    const a = G(n).text().trim();
                    return e.options[t][a.charCodeAt(0) - 65];
                })).get();
                break;

              case "textarea":
                e.type = "4", e.options = [], e.answer = removeHtml(G(e.html).find(".exam_rightAnswer .has_standard_answer").html());
            }
            switch (e.type) {
              case "0":
              case "1":
                if (e.answer = G(e.html).find('.exam_rightAnswer .exam_answers_tit>span[name="rightAnswer"]').text().trim().split("").map((t => e.options[t.charCodeAt(0) - 65])), 
                e.answer, 0 == e.answer.length) {
                    if (0 == t) return;
                    e.answer = G(e.html).find('.exam_stu_answer span[name="stuAnswer"]').text().trim().split("").map((t => e.options[t.charCodeAt(0) - 65]));
                }
                break;

              case "2":
                e.answer = 0 == t ? G(e.html).find(".exam_rightAnswer span.fillblank_answer").map(((e, t) => removeHtml(G(t).html()))).get() : G(e.html).find(".exam_stu_answer span.fillblank_answer").map(((e, t) => removeHtml(G(t).html()))).get(), 
                e.answer;
                break;

              case "3":
                e.options = [];
                let n = G(e.html).find('.exam_stu_answer span[name="stuAnswer"]').text().trim();
                [ "\u6b63\u786e", "\u9519\u8bef" ].includes(n) && t && (e.answer = [ n ]);
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
                return 0 !== G(".subjectDet").length;
            }));
        },
        answerHook: e => {
            const t = G(e.html).find(".xvhao").text().trim();
            e.type = typeConvert(t.match(/\u3010(.*)\u3011/)[1].trim().replace("\u586b\u7a7a\u9898(\u5ba2\u89c2)", "\u586b\u7a7a\u9898"));
            let n = G(e.html).find(".answer").text().trim();
            switch (e.answer = n.split(",").map((t => e.options[t.charCodeAt(0) - 65])), e.type) {
              case "2":
                e.options = [], e.answer = G(e.html).find(".answer>span").map(((e, t) => removeHtml(G(t).html()))).get();
                break;

              case "3":
                e.options = G(e.html).find(".optionList>div").map(((e, t) => removeHtml(G(t).html()))).get(), 
                e.answer = n.split(",").map((t => e.options[t.charCodeAt(0) - 65])), e.answer = judgeAnswer(e.answer[0]), 
                e.options = [];
                break;

              case "11":
                const t = G(e.html).find(".optionList .matching>.htmlP.ql-editor").map(((e, t) => removeHtml(G(t).html()))).get(), a = G(e.html).find(".optionList>.text .htmlP.ql-editor").map(((e, t) => removeHtml(G(t).html()))).get();
                e.options = [ t, a ];
                let o = {};
                n = G(e.html).find(".answer>span").map(((e, n) => {
                    let [s, i] = G(n).text().trim().split(".");
                    s.charCodeAt(0) >= 65 ? s = (s.charCodeAt(0) - 65).toString() : /^\d+$/.test(s) && (s = (parseInt(s) - 1).toString()), 
                    i.charCodeAt(0) >= 65 ? i = (i.charCodeAt(0) - 65).toString() : /^\d+$/.test(i) && (i = (parseInt(i) - 1).toString()), 
                    o[t[s]] = a[i];
                })), e.answer = o;
            }
            return e;
        }
    }, {
        type: "ask",
        name: "\u667a\u6167\u804c\u6559+\u7b54\u9898",
        tips: "\u8be5\u5e73\u53f0\u95ee\u9898\u8f83\u591a\uff0c\u9047\u5230\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.href.includes("coursePreview/jobTest") || location.href.includes("spockeepTest") || location.href.includes("spocjobTest"),
        types: [ "0", "1", "3" ],
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
                return 0 !== G(".subjectDet").length;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().parent().hasClass("is-checked"),
        questionHook: e => {
            const t = G(e.html).find(".title.titleTwo").text().trim();
            if (e.type = typeConvert(t.match(/\u3010(.*)\u3011/)[1].trim().replace("\u586b\u7a7a\u9898(\u5ba2\u89c2)", "\u586b\u7a7a\u9898")), 
            "3" === e.type) e.options = [], e.$options = G(e.html).find(".optionList>div label");
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
                return 0 !== G(".subjectDet").length;
            }));
        },
        answerHook: e => {
            e.options = removeStartChar(e.options);
            const t = G(e.html).find(".xvhao").text().trim();
            e.type = typeConvert(t.match(/\u3010(.*)\u3011/)[1].trim().replace("\u586b\u7a7a\u9898(\u5ba2\u89c2)", "\u586b\u7a7a\u9898"));
            let n = G(e.html).find(".answer").text().trim();
            switch (e.answer = n.split(",").map((t => e.options[t.charCodeAt(0) - 65])), e.type) {
              case "2":
                e.options = [], e.answer = G(e.html).find(".answer>span").map(((e, t) => removeHtml(G(t).html()))).get();
                break;

              case "3":
                e.options = G(e.html).find(".optionList>div").map(((e, t) => removeHtml(G(t).html()))).get(), 
                e.answer = n.split(",").map((t => e.options[t.charCodeAt(0) - 65])), e.answer = judgeAnswer(e.answer[0]), 
                e.options = [];
            }
            return e;
        }
    }, {
        type: "save",
        name: "ai\u4f18\u8bfe\u6536\u5f55\u65b0",
        match: () => "ai.icve.com.cn" === location.host && location.href.includes("/review-exam/"),
        question: {
            html: () => {
                let e = G(".examination-paper")[0].__vue__.sjAllInfo.questions, t = [];
                return e.sort(((e, t) => e.txdm - t.txdm)), e.forEach((e => {
                    t.push(e);
                })), t;
            },
            question: ".seeTitle>span:eq(1)",
            options: ".optionList>div",
            type: ".question-box .tag",
            workType: "zhijiaoyun",
            pageType: "zhijiaoyun"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== G(".examination-paper")[0].__vue__.sjAllInfo.questions.length;
            }));
            let e = G(".examination-paper")[0].__vue__.sjAllInfo.questions, t = [];
            e.sort(((e, t) => e.txdm - t.txdm)), e.forEach((e => {
                t.push(e);
            })), xe.quesList = t;
        },
        answerHook: (e, t) => {
            const n = e.html;
            e.type = typeMatch(n.type), e.question = titleClean(n.tmmc);
            let a = [];
            switch (e.type) {
              case "3":
                "1" == n.answer && (e.answer = [ "\u6b63\u786e" ]), "0" == n.answer && (e.answer = [ "\u9519\u8bef" ]);
                break;

              case "2":
                e.answer = n.answer.split(",");
                break;

              case "4":
                e.answer = n.answer;
                break;

              case "0":
              case "1":
                e.options = n.sjtmxxlist.map((e => ("1" == e.sfzqda && a.push(removeHtml(e.xxnr)), 
                removeHtml(e.xxnr)))), e.answer = a;
            }
            return e;
        },
        paper: async e => {}
    }, {
        type: "ask",
        name: "ai\u4f18\u8bfe\u7b54\u9898",
        tips: "",
        match: () => "ai.icve.com.cn" === location.host && location.href.includes("/preview-exam/"),
        types: [ "0", "1" ],
        question: {
            html: () => {
                let e = G(".examination-paper")[0].__vue__.tmActivelist, t = [];
                return e.sort(((e, t) => e.px - t.px)), e.forEach((e => {
                    t.push(e);
                })), t;
            },
            question: ".seeTitle>span:eq(1)",
            options: "label",
            type: ".question-box .tag",
            workType: "zhijiaoyun",
            pageType: "zhijiaoyun"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== G(".examination-paper")[0].__vue__.tmActivelist.length;
            }));
        },
        toquestion: e => {
            G(".topic-zpx-list .topic-zpx-main span:eq(" + e + ")").click();
        },
        next: () => {},
        ischecked: e => e.hasClass("wrongXz"),
        questionHook: e => {
            var t;
            const n = e.html, a = G(".examination-paper")[0].__vue__.topList, o = [];
            Object.keys(a).forEach((e => {
                a[e].forEach((t => {
                    o.push({
                        id: t.id,
                        type: t.txdmmc || e
                    });
                }));
            }));
            const s = (null == (t = o.find((e => e.id === n.id))) ? void 0 : t.type) || "\u5176\u4ed6";
            e.type = typeMatch(s), e.question = titleClean(n.title);
            const i = n.dataArr.map((e => removeHtml(e.Content)));
            return e.options = i, e.answer = [], e.html = G(".content-center"), e.$options = () => G("label"), 
            e;
        },
        setAnswer: e => !0,
        finish: e => {}
    } ], Je = [ {
        type: "ask",
        name: "\u5ddd\u519c\u5728\u7ebf\u7b54\u9898",
        tips: "",
        match: () => location.host.includes("cnzx.info") && location.href.includes("KaoShi/ShiTiYe.aspx"),
        types: [ "0", "1", "3" ],
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
        questionHook: e => (e.$options = G(e.html).find(".wenti > ol > li input"), 0 !== e.options.length && (e.type = "radio" === e.$options.eq(0).attr("type") ? "0" : "1", 
        2 === e.options.length && e.options.includes("\u6b63\u786e") && e.options.includes("\u9519\u8bef") && (e.type = "3", 
        e.options = [])), e),
        setAnswer: e => "3" !== e.type || (G(e.html).find(".wenti > ol > li").each(((t, n) => {
            isTrue(e.answer) && isTrue(removeHtml(G(n).html())) && e.ques.$options.eq(t).click(), 
            isFalse(e.answer) && isFalse(removeHtml(G(n).html())) && e.ques.$options.eq(t).click();
        })), !1),
        finish: e => {
            G("li.paginationjs-next.J-paginationjs-next").click();
        }
    }, {
        type: "save",
        name: "\u5ddd\u519c\u5728\u7ebf\u6536\u5f55",
        match: () => location.host.includes("cnzx.info") && location.href.includes("ZaiXianLianXi.aspx"),
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
            G(e.html).text(), e.question = removeHtml(titleClean(removeHtml(G(e.html).html())));
            let t = G("ul.TiXing>li.DangQianTiXing:eq(0)>a").text(), n = [], a = G(e.html).next();
            switch (e.options = removeStartChar(a.find("ul li").map(((e, t) => (G(t).hasClass("DaAn1") && n.push(e), 
            titleClean(removeHtml(G(t).html()))))).get()), e.answer = n.map((t => e.options[t])), 
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
    } ], Qe = [ {
        type: "ask",
        name: "\u5b89\u5fbd\u7ee7\u7eed\u6559\u80b2\u7b54\u9898(\u65e7\u7248)",
        tips: "",
        match: () => location.href.includes("study/html/content/studying/?courseOpenId=") || location.href.includes("study/html/content/sxsk/?courseOpenId=") || location.href.includes("study/html/content/tkOnline/?courseOpenId=") || location.href.includes("study/html/content/bkExam/?courseOpenId="),
        types: [ "0", "1", "3" ],
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
            const n = G(e.html).parent().parent();
            switch (e.type = n ? null == (t = n.attr("id")) ? void 0 : t.trim() : "", e.type) {
              case "2":
                e.type = "1";
                break;

              case "1":
                e.type = "0";
                break;

              case "3":
                e.type = "3", e.$options = G(e.html).find("ul>li");
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
                return G(e.html).find("textarea.answer-input").focus(), G(e.html).find(" textarea.answer-input"), 
                G(e.html).find(".answer-input.edui-default").each(((t, n) => {
                    let a = G(n).attr("id"), o = xe.UE.getEditor(a);
                    o.ready((function() {
                        o.setContent(`<p>${e.answer[t]}</p>`);
                    }));
                })), G(e.html).find(".answer-input").blur(), !1;
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u5b89\u5fbd\u7ee7\u7eed\u6559\u80b2\u6536\u5f55(\u65e7\u7248)",
        tips: "\u8be5\u5e73\u53f0\u4ec5\u652f\u6301\u5355\u9009\u3001\u591a\u9009\u3001\u5224\u65ad\u9898\u578b\uff0c\u5176\u4ed6\u9898\u578b\u6682\u4e0d\u652f\u6301",
        match: () => location.href.includes("study/html/content/studying/?courseOpenId=") || location.href.includes("study/html/content/sxsk/?courseOpenId=") || location.href.includes("study/html/content/tkOnline/?courseOpenId=") || location.href.includes("study/html/content/bkExam/?courseOpenId="),
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
            const n = G(e.html).parent().parent();
            e.type = n ? null == (t = n.attr("id")) ? void 0 : t.trim() : "", e.$options = G(e.html).find("ul>li");
            let a = G(e.html).find("ul>li.checked").map(((e, t) => removeHtml(G(t).find(".ErichText").html()))).get();
            const o = G(e.html).find(".e-q-right").length > 0;
            e.answer = a.filter((e => "" !== e));
            let s = G(e.html).find(".e-ans-ref .e-ans-r").map(((e, t) => removeHtml(G(t).html()))).get();
            1 === s.length && s[0].length > 1 && (s = s[0].split("\u3001"));
            let i = s.map((t => {
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
                e.type = "3", e.answer = G(e.html).find("ul>li.checked").map(((e, t) => removeHtml(G(t).html()))).get(), 
                e.options = [], isTrue(e.answer[0]) ? e.answer = [ "\u6b63\u786e" ] : isFalse(e.answer[0]) ? e.answer = [ "\u9519\u8bef" ] : e.answer = [];
                break;

              case "4":
                e.type = "2", e.options = [];
                break;

              case "5":
                e.type = "4", i = [ removeHtml(G(e.html).find(".e-ans-ref>.e-ans-r").html()) ], 
                e.options = [];
                break;

              case "11":
                e.type = "19";
                const t = G(e.html).find("form").map(((e, t) => ({
                    type: "0",
                    question: removeHtml(G(t).find(".e-q-q .ErichText").html()),
                    options: G(t).find("ul li .ErichText").map(((e, t) => removeHtml(G(t).html()))).get()
                }))).get();
                i = i.length > 0 ? judgeAnswer(i[0]) : [], e.options = t;

              default:
                return void e.type;
            }
            if (i.length > 0) return e.answer = i, e;
            if (!o && "3" === e.type && e.answer.length > 0) {
                if (e.answer = function(e) {
                    if (!isTrue(e[0]) && !isFalse(e[0])) return e[0], [];
                    return isTrue(e[0]) ? [ "\u9519\u8bef" ] : isFalse(e[0]) ? [ "\u6b63\u786e" ] : [];
                }(e.answer), 0 === e.answer.length) return;
            } else if (!o) return;
            return e;
        },
        paper: e => {
            const t = xe.online, n = {
                platform: "ahjxjy"
            };
            n.hash = t.courseOpenId, n.name = xe.localStorage.courseNmae, n.info = {}, n.chapter = [ {
                hash: `${t.cell.id}`,
                name: t.cell.title,
                question: e
            } ], Oe.setPaper(n.hash, n);
        }
    }, {
        type: "save",
        name: "\u5b89\u5fbd\u7ee7\u7eed\u6559\u80b2\u6536\u5f55(\u65b0\u7248)",
        tips: "\u8be5\u5e73\u53f0\u4ec5\u652f\u6301\u5355\u9009\u3001\u591a\u9009\u3001\u5224\u65ad\u9898\u578b\uff0c\u5176\u4ed6\u9898\u578b\u6682\u4e0d\u652f\u6301",
        match: () => location.href.includes("/myHomework/answerRecord") || location.href.includes("/myHomework/assignment") || location.href.includes("/myExam/examDetails") || location.href.includes("/myExam/examHistory"),
        question: {
            html: ".option>div[id='answer-card-area']",
            question: ".ErichText",
            options: "ul>li>.ErichText",
            type: ".question-box .tag",
            workType: "ahjxjy",
            pageType: "ahjxjy"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".option>div[id='answer-card-area']");
            }));
        },
        answerHook: (e, t) => {
            const n = G("micro-app-body>#app>div")[0].__vue__.hierarchyList[t];
            e.type = typeMatch(n.name), e.question = titleClean(removeHtml(n.Content));
            const {options: a, answer: o} = n.CourseQuestionOptionList.reduce(((e, t) => {
                const n = removeHtml(t.Content);
                return t.IsAnswer && e.answer.push(n), e.options.push(n), e;
            }), {
                options: [],
                answer: []
            });
            return e.options = a, e.answer = "3" === e.type ? [ judgeAnswer(o[0]) ] : o, "3" === e.type && (e.options = []), 
            e;
        }
    }, {
        type: "ask",
        name: "\u5b89\u5fbd\u7ee7\u7eed\u6559\u80b2\u7b54\u9898(\u65b0\u7248)",
        tips: "\u5355\u9898\u95f4\u9694\u5fc5\u987b\u5927\u4e8e 3 \u79d2\uff01\uff01\u5426\u5219\u5bb9\u6613\u5f02\u5e38\uff01\uff01",
        match: () => location.href.includes("/myHomework/assignment") || location.href.includes("/myExam/examDetails"),
        types: [ "0", "1", "3" ],
        minDelay: 3e3,
        answerDelay: 1e3,
        question: {
            html: ".option>div[id='answer-card-area']",
            question: ".ErichText",
            options: "ul.answer-list>li",
            type: ".question-box .tag",
            workType: "ahjxjy",
            pageType: "ahjxjy"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".option>div[id='answer-card-area']");
            })), !G(".submit-area").text().includes("\u63d0\u4ea4")) return !1;
            const e = G("micro-app-body>#app>div")[0].__vue__, t = e.hierarchyList[0];
            e.goAnchor(t.Id);
        },
        toquestion: e => {
            const t = G("micro-app-body>#app>div")[0].__vue__, n = t.hierarchyList[e];
            (null == n ? void 0 : n.Id) && t.goAnchor(n.Id);
        },
        ischecked: e => e.hasClass("on"),
        questionHook: (e, t) => {
            const n = G("micro-app-body>#app>div")[0].__vue__.hierarchyList[t];
            e.type = typeMatch(n.name), e.question = titleClean(removeHtml(n.Content));
            let a = [];
            return n.CourseQuestionOptionList.forEach((e => {
                const t = removeHtml(e.Content);
                e.IsAnswer, a.push(t);
            })), e.options = a, e.html = "body", e.$options = () => G("ul.answer-list>li"), 
            e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "ask",
        name: "\u5b89\u5fbd\u7ee7\u7eed\u6559\u80b2\u7b54\u9898(\u81ea\u8003)",
        tips: "",
        match: () => location.href.includes("/userinfo/testPaper"),
        types: [ "0", "1", "3" ],
        question: {
            html: ".item-card-area",
            question: ".desc",
            options: "ul>li",
            type: ".question-box .tag",
            workType: "ahjxjy",
            pageType: "ahjxjy"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".exam-paper-wrap");
            })), isExist(".exam-process-area")) return !1;
            const e = G(".exam-paper-wrap")[0].__vue__.topicList.map((e => e.getPaperList)).flat();
            window.Zques = e;
        },
        ischecked: e => e.parent().hasClass("checked"),
        questionHook: (e, t) => {
            const n = Zques[t];
            e.type = typeMatch(n.questionTypeName), e.question = titleClean(removeHtml(n.content));
            const {options: a, answer: o} = n.courseQuestionOptionList.reduce(((e, t) => {
                const n = removeHtml(t.content);
                return t.isAnswer && e.answer.push(n), e.options.push(n), e;
            }), {
                options: [],
                answer: []
            });
            return e.options = a, e.answer = "3" === e.type ? [ judgeAnswer(o[0]) ] : o, "3" === e.type && (e.options = []), 
            e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "4":
              case "2":
                return G(e.html).find("textarea.answer-input").focus(), G(e.html).find(" textarea.answer-input"), 
                G(e.html).find(".answer-input.edui-default").each(((t, n) => {
                    let a = G(n).attr("id"), o = xe.UE.getEditor(a);
                    o.ready((function() {
                        o.setContent(`<p>${e.answer[t]}</p>`);
                    }));
                })), G(e.html).find(".answer-input").blur(), !1;
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u5b89\u5fbd\u7ee7\u7eed\u6559\u80b2\u6536\u5f55(\u81ea\u8003)",
        tips: "\u8be5\u5e73\u53f0\u4ec5\u652f\u6301\u5355\u9009\u3001\u591a\u9009\u3001\u5224\u65ad\u9898\u578b\uff0c\u5176\u4ed6\u9898\u578b\u6682\u4e0d\u652f\u6301",
        match: () => location.href.includes("/userinfo/testPaper"),
        question: {
            html: ".item-card-area",
            question: ".ErichText",
            options: "ul>li>.ErichText",
            type: ".question-box .tag",
            workType: "ahjxjy",
            pageType: "ahjxjy"
        },
        init: async () => {
            if (await waitUntil((function() {
                return isExist(".exam-paper-wrap");
            })), !isExist(".score-describe")) return !1;
            const e = G(".exam-paper-wrap")[0].__vue__.topicList.map((e => e.getPaperList)).flat();
            window.Zques = e;
        },
        answerHook: (e, t) => {
            const n = Zques[t];
            e.type = typeMatch(n.questionTypeName), e.question = titleClean(removeHtml(n.content));
            const {options: a, answer: o} = n.courseQuestionOptionList.reduce(((e, t) => {
                const n = removeHtml(t.content);
                return t.isAnswer && e.answer.push(n), e.options.push(n), e;
            }), {
                options: [],
                answer: []
            });
            return e.options = a, e.answer = "3" === e.type ? [ judgeAnswer(o[0]) ] : o, "3" === e.type && (e.options = []), 
            e;
        }
    } ], We = [ {
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
                return isExist(".question-detail-container") && xe.qsques;
            }));
        },
        answerHook: (e, t) => {
            const n = xe.qsques[t];
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
        tips: "",
        match: () => location.host.includes("qingshuxuetang.com") && (location.href.includes("/Student/ExercisePaper") || location.href.includes("Student/ExamPaper") || location.href.includes("Student/ViewQuiz") || location.href.includes("Student/SimulationExercise/Detail") || location.href.includes("Student/Quiz/Detail")),
        types: [ "0", "1", "3" ],
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
                return isExist(".question-detail-container") && xe.qsques;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().find("input").prop("checked"),
        toquestion: e => {
            G(`.group_item:eq(${e})`), G(`.group_item:eq(${e})`).click();
        },
        questionHook: (e, t) => {
            const n = xe.qsques[t];
            if (e.question = removeHtml(n.description), e.options = n.options ? n.options.map((e => removeHtml(e.description))) : [], 
            e.type = typeConvert(n.typeDesc), "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    } ], Ke = [ {
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
                return 0 !== G(".queContainer").length;
            }));
        },
        answerHook: e => {
            const t = xe.angular.element(e.html).scope().question;
            if (e.type = typeConvert(t.type_text), e.question = t.question, e.options = t.options_app.map((e => e.value)), 
            e.answer = t.answer.map((e => t.options[e])), "3" === e.type) e.options = [], e.answer = judgeAnswer(e.answer[0]);
            return e;
        }
    } ], Ye = [ {
        type: "ask",
        name: "\u4eac\u4eba\u5e73\u53f0\u7b54\u9898",
        tips: "",
        match: () => location.host.includes("cj-edu.com") && (location.href.includes("/Examination") || location.href.includes("/ExamInfo")),
        types: [ "0", "1", "3" ],
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
                return 0 !== G(".el-main>.all_subject>div.el-row").length;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            switch (G(e.html).prevAll("h1").first().text().trim()) {
              case "\u5355\u9009\u9898":
                e.type = "0";
                break;

              case "\u591a\u9009\u9898":
                e.type = "1";
                break;

              case "\u5224\u65ad\u9898":
                e.$options = G(e.html).find("ul li>label"), e.options = [], e.type = "3";
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
                return 0 !== G(".el-main>.all_subject>div.el-row").length;
            }));
        },
        answerHook: e => {
            let t = G(e.html).find(".seeStudentAnswer>p.answer").text().replace("\u53c2\u8003\u7b54\u6848\uff1a", "").trim(), n = G(e.html).prevAll("h1").first().text().trim();
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
    } ], Xe = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("ytccr.com"),
        main: e => {
            const getHash = () => getUrl();
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getHash() && (xe.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            G("#app").length >= 1 && t.observe(G("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u7ece\u901a\u7ee7\u6559\u4e91\u7b54\u9898",
        tips: "",
        match: () => location.host.includes("ytccr.com") && location.href.includes("learning-work") && location.href.includes("type=3"),
        types: [ "0", "1", "3" ],
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
                return 0 !== G(".border-item").length;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            if (e.type = typeConvert(G(e.html).find(".qtype").text().trim()), "3" === e.type) e.options = [];
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
                return 0 !== G(".border-item").length;
            }));
        },
        answerHook: e => {
            e.type = typeConvert(G(e.html).find(".qtype").text().trim());
            let t = G(e.html).find(".u-text-success,.u-text-danger").text().split("\uff0c")[0].trim();
            if (t = t.match(/[A-Z]+$/)[0].trim(), e.answer = t.split("").map((t => e.options[t.charCodeAt(0) - 65])), 
            0 === e.answer.length) return e;
            if ("3" === e.type) e.options = [], e.answer = judgeAnswer(e.answer[0]);
            return e;
        }
    } ], Ze = [ {
        type: "ask",
        name: "\u5b66\u8d77\u8003\u8bd5",
        tips: "",
        match: () => location.href.includes("oxer/page/ots/examIndex.html"),
        types: [ "0", "1", "3" ],
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
            })), xe.document.onkeydown = null, xe.oncontextmenu = null;
        },
        next: () => {},
        ischecked: e => e.parent().hasClass("cur"),
        questionHook: e => {
            let t = G(e.html).parent().find("div .fb:eq(0)").text().split("\u3001")[1];
            if (t.includes("\u5224\u65ad") && (t = "\u5224\u65ad\u9898"), e.type = typeMatch(t), 
            "3" === e.type) e.options = [], e.$options = G(e.html).find("input");
            return e;
        },
        setAnswer: e => {
            if ("3" === e.type) {
                let t = e.answer;
                return e.ques.$options.each(((e, n) => {
                    isTrue(t) && isTrue(removeHtml(G(n).val())) && G(n).click(), isFalse(t) && isFalse(removeHtml(G(n).val())) && G(n).click();
                })), !1;
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u5b66\u671f\u8003\u8bd5\u6536\u5f55",
        match: () => location.href.includes("OTS-UniverDetail.html"),
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
            var t, n, a, o, s;
            const i = G(e.html).attr("queid"), r = e.html._ms_context_.el.questions.find((e => e.id === i));
            r.questionTypeName.includes("\u5224\u65ad") && (r.questionTypeName = "\u5224\u65ad\u9898"), 
            e.type = typeMatch(r.questionTypeName), e.question = removeHtml(r.stem), console.log(r), 
            e.options = (null == (n = null == (t = r.answerArea) ? void 0 : t.optionList) ? void 0 : n.sort(((e, t) => e.sequence - t.sequence)).map((e => removeHtml(e.content)))) || [];
            let l = r.answer.ans || (null == (a = r.answer.ansL) ? void 0 : a.join("")) || null;
            if (l) e.answer = l.split("").map((t => e.options[t.charCodeAt(0) - 65])); else {
                const t = (null == (s = null == (o = r.answerArea) ? void 0 : o.optionList) ? void 0 : s.filter((e => e.isTrue)).map((e => removeHtml(e.content)))) || [];
                if (0 === r.answerScore) return;
                e.answer = t;
            }
            return "3" === e.type && (e.options = [], e.answer = judgeAnswer(l)), e;
        },
        paper: e => {
            const t = G(".dl_list:eq(0)")[0]._ms_context_.loop.category, n = G(".dl_list:eq(0)")[0]._ms_context_.oAnswerDetailInfo, a = {
                platform: "xueqi"
            };
            a.hash = t.code, a.name = t.value, a.info = {}, a.chapter = [ {
                hash: `${n.arrangementid}`,
                name: n.arrangementname,
                question: e
            } ], Oe.setPaper(a.hash, a);
        }
    } ], et = [ {
        type: "hook",
        name: "hook",
        match: "gdrtvu.exam-cloud.cn" === location.host,
        main: e => {
            unsafeWindow.mainClass = getUrl();
            let t = new MutationObserver((async e => {
                unsafeWindow.mainClass !== getUrl() && (unsafeWindow.mainClass = getUrl(), vuePageChange(), 
                t.disconnect());
            }));
            G("#app").length >= 1 && t.observe(G("#app")[0], {
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
        types: [ "0", "1", "3" ],
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
            let t = G(".list .current-question").parent().parent().find(".title").text();
            if (console.log(t), t = t.split("\u3001")[1], t = t.replace(/\(.*\)/, "").trim(), 
            console.log(t), e.type = typeConvert(t), "8" == e.type ? e.type = typeMatch(t) : e.type, 
            "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => !0,
        finish: e => {
            G(".next .qm-primary-button").length && G(".next .qm-primary-button")[0].click();
        }
    } ], tt = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("open.ha.cn"),
        main: e => {
            const getHash = () => G(".stuHomeworkVersionId.active").attr("id");
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                getHash(), xe.mainClass !== getHash() && (xe.mainClass = getHash(), vuePageChange$1(), 
                t.disconnect());
            }));
            G(".homeworkBody").length >= 1 && t.observe(G(".homeworkBody")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u4e91\u4e0a\u6cb3\u5f00\u7b54\u9898",
        tips: "",
        match: () => location.host.includes("open.ha.cn") && location.href.includes("/homework/showHomeworkByStatus") && location.href.includes("checked=false"),
        types: [ "0", "1" ],
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
            let a = G(n).find(".numberCover").text().trim();
            return removeHtml(e.$options.eq(t).html()).replace(a, "").trim();
        })).get(), e.type = typeConvert(G(e.html).find(".questionDiv>.float-l:eq(1)").text().trim()), 
        e.$options = G(e.html).find(".option-title .numberCover"), e),
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
            const n = 0 == G(e.html).find(".option-title.error2").length;
            if (e.options = e.$options.map(((n, a) => {
                let o = G(a).find(".numberCover").text().trim(), s = removeHtml(e.$options.eq(n).html()).replace(o, "").trim();
                return G(a).hasClass("answer-title") && t.push(s), s;
            })).get(), e.type = typeConvert(G(e.html).find(".questionDiv>.float-l:eq(1)").text().trim()), 
            n) return e.answer = t, G(e.html).find(".option-title.error2"), e;
        },
        paper: e => {
            const t = xe.homework, n = {
                platform: "openha"
            };
            n.hash = t.courseId, n.name = t.courseName, n.info = {}, n.chapter = [ {
                hash: `${t.homeworkId}`,
                name: t.title,
                question: e
            } ], Oe.setPaper(n.hash, n);
        }
    } ], nt = [ {
        type: "ask",
        name: "\u6cb3\u5357\u7ee7\u7eed\u6559\u80b2\u7b54\u9898",
        tips: "",
        match: () => location.href.includes("uc/task/startTask"),
        types: [ "0", "1" ],
        answerDelay: 1e3,
        minDelay: 1e3,
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
                return isExist(".carousel-inner>.item.changeless-box");
            })), !isExist("#finish")) return !1;
            await waitUntil((function() {
                let e = G(".carousel-inner>article").filter(((e, t) => G(t).hasClass("temporary-box"))).eq(0).index();
                return e > 0 ? (G(".slide-tihao:eq(" + e + ")")[0].click(), !1) : (G(".slide-tihao:eq(0)")[0].click(), 
                !0);
            }));
        },
        toquestion: e => {
            G(".slide-tihao:eq(" + e + ")")[0].click();
        },
        ischecked: e => e.find(".checked").length > 0,
        questionHook: e => (e.type = typeConvert(G(e.html).attr("data-name") || ""), e.$options = G(e.html).find(".ic-options__wrap label"), 
        e.question = e.question.replace(/^\(\d+\)/, "").trim(), e.question = e.question.replace(/\(\d+\u5206\)$/, "").trim(), 
        e),
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "ask",
        name: "\u6cb3\u5357\u7ee7\u7eed\u6559\u80b2\u8003\u8bd5\u7b54\u9898",
        tips: "",
        match: () => location.href.includes("uc/exam/record/startExamination"),
        types: [ "0", "1" ],
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
                return window.scrollTo(0, document.body.scrollHeight), G(".ic-ac-checkbox-ol li").length == G(".trunk-box").length;
            })), !isExist("#submit-btn")) return !1;
        },
        next: () => {
            G("#carousel-professional").carousel("next");
        },
        ischecked: e => e.find(".checked").length > 0,
        questionHook: e => {
            const t = G(e.html).attr("data-type");
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
            e.question = e.question.replace(/\[\S+\]$/, "").trim(), e.$options = G(e.html).find(".ic-options__wrap label"), 
            e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u6cb3\u5357\u7ee7\u7eed\u6559\u80b2\u6536\u5f55",
        match: () => location.href.includes("uc/task/startTask"),
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
            })), isExist("#finish")) return !1;
            await waitUntil((function() {
                let e = G(".carousel-inner>article").filter(((e, t) => G(t).hasClass("temporary-box"))).eq(0).index();
                return e > 0 ? (G(".slide-tihao:eq(" + e + ")")[0].click(), !1) : (G(".slide-tihao:eq(0)")[0].click(), 
                !0);
            }));
        },
        next: () => {},
        answerHook: e => {
            const t = G(e.html).find(".analysis-box .fs20.c-primary.vam").text().trim().split("");
            return e.type = typeConvert(G(e.html).attr("data-name") || ""), e.answer = t.map((t => e.options[t.charCodeAt(0) - 65])), 
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
                return window.scrollTo(0, document.body.scrollHeight), G(".ic-ac-correct,.ic-ac-error").length == G(".trunk-box").length;
            })), isExist("#submit-btn")) return !1;
        },
        next: () => {
            G(".next-slide").click();
        },
        answerHook: e => {
            const t = G(e.html).attr("data-type");
            console.log(t);
            const n = G(e.html).find(".ic-options__wrap label").filter(((e, t) => G(t).find(".checked").length > 0)).map(((e, t) => removeHtml(G(t).html()))).get();
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
    } ], at = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("sclecb.cn"),
        main: e => {
            const getHash = () => getUrl();
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getHash() && (xe.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            G("#app").length >= 1 && t.observe(G("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u56db\u5ddd\u5f00\u653e\u5927\u5b66\u7b54\u9898",
        tips: "",
        match: () => "study.sclecb.cn" === location.host && /\/[0-9]+\/show/i.test(location.href),
        types: [ "0", "1", "3" ],
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
            switch (e.options = removeStartChar(e.options), e.$options = G(e.html).find(".testpaper-question-choice-inputs > label > input"), 
            e.type = typeConvert(G(e.html).parent().parent().find(".panel-heading>strong").text().trim()), 
            e.type, e.type) {
              case "0":
              case "1":
                break;

              case "3":
                e.$options = G(e.html).find(".radio-inline");
            }
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "ask",
        name: "\u56db\u5ddd\u5f00\u653e\u5927\u5b66\u7b54\u9898\u65e7",
        tips: "",
        match: () => location.host.includes("sclecb.cn") && /student\/course\/study\/[0-9a-zA-Z]+\/test\/redo/i.test(location.href),
        types: [ "0", "1" ],
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
            const t = G(e.html).parent().parent().find("div:eq(0)").text().trim();
            switch (!0) {
              case t.includes("\u5355\u9009\u9898"):
                e.type = "0";
                break;

              case t.includes("\u591a\u9009\u9898"):
                e.type = "1";
                break;

              case t.includes("\u5224\u65ad\u9898"):
                e.type = "3", e.options = [], e.$options = G(e.html).find(".common_test_option > label");
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
                const a = removeHtml(G(t).clone().find(".testpaper-question-choice-index").remove().end().html());
                return G(t).hasClass("testpaper-question-choice-right") && n.push(a), a;
            })).get(), e.answer = n, e.type = typeConvert(G(".js-panel-card>span").eq(t).prevAll("p").first().text().trim());
            const a = G(".js-panel-card>span").eq(t).hasClass("bg-success");
            switch (e.type) {
              case "0":
              case "1":
                break;

              case "3":
                let t = "";
                t = G(e.html).find(".testpaper-question-result").text().replace("\u4f60\u7684\u7b54\u6848\u662f", "").trim(), 
                e.answer = judgeAnswer(t);
            }
            if ((a || !(e.answer.length > 0) || "3" != e.type) && a) return e;
        }
    } ], ot = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("superchutou.com"),
        main: e => {
            const getHash = () => getUrl();
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getHash() && (xe.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            G("#root").length >= 1 && t.observe(G("#root")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u51fa\u5934\u7cfb\u7edf\u7b54\u9898",
        tips: "",
        match: () => location.host.includes("superchutou.com") && location.href.includes("onlineclass/exam/"),
        types: [ "0", "1" ],
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
            let t = G(e.html).find("[class^='title_content'] > span:eq(1)").text();
            if (t = t.replace(/\u3010|\u3011/g, "").trim(), e.type = typeConvert(t), e.options = removeStartChar(e.options), 
            "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u51fa\u5934\u6536\u5f55",
        match: () => location.host.includes("superchutou.com") && location.href.includes("/onlineclass/analysis/"),
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
                return isExist("dl>dd>span");
            }));
        },
        answerHook: e => {
            let t = G(e.html).find("[class^='title_content'] > span:eq(1)").text();
            t = t.replace(/\u3010|\u3011/g, "").trim(), e.type = typeConvert(t), e.options = removeStartChar(e.options);
            const n = G(e.html).find(".ant-collapse-header>div.ant-row>div.ant-col.ant-col-18>div:eq(1)").text().replace("\u53c2\u8003\u7b54\u6848\uff1a", "").trim();
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
    } ], st = [ {
        type: "ask",
        name: "\u826f\u5e08\u5728\u7ebf\u7b54\u9898",
        tips: "",
        match: () => location.host.includes("ls365.net") && (location.href.includes("student/examing.aspx") || location.href.includes("Student/myhomework.aspx")),
        types: [ "0", "1" ],
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
            let t = G(e.html).find(".exam_question_title").clone();
            t.find(".question_number").remove(), t.find("strong").remove(), t.find(".exam_feed_back").remove(), 
            e.question = removeHtml(t.html());
            let n = G(e.html).find(".exam_question_title strong").text();
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
            let t = G(e.html).find(".QuestionsType").text();
            t = t.replace(/\[|\]/g, "").trim(), e.type = typeConvert(t);
            let n = G(e.html).find(".my-work-answer>p").filter(((e, t) => t.innerText.includes("\u53c2\u8003\u7b54\u6848"))).map(((e, t) => G(t).find(".two").text())).get();
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
            let t = G(e.html).find(".my-work-nav>div:eq(0)>span:eq(0)").text();
            t = t.replace(/\[|\]/g, "").trim(), e.type = typeConvert(t);
            let n = G(e.html).find(".my-work-answer>p").filter(((e, t) => t.innerText.includes("\u53c2\u8003\u7b54\u6848"))).map(((e, t) => G(t).find(".two").text())).get();
            if (0 !== n.length) return e.answer = n[0].split("").map((t => e.options[t.charCodeAt(0) - 65])), 
            e;
        }
    }, {
        type: "hook",
        name: "hook",
        match: "hbnun.lsedu.vip" === location.host,
        main: e => {
            const getHash = () => getUrl();
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getHash() && (xe.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            G("#app").length >= 1 && t.observe(G("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u826f\u5e08\u5728\u7ebf\u4f5c\u4e1a\u7b54\u9898",
        tips: "",
        match: () => location.href.includes("/#/homework/") && !location.href.includes("scene=history"),
        types: [ "0", "1" ],
        question: {
            html: "[id^='question-']",
            question: ".question-content",
            options: "button .flex-1.text-left",
            type: ".self-start.text-3.self-end",
            workType: "ls365",
            pageType: "ls365"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist("[id^='question-']");
            }));
        },
        next: () => {},
        ischecked: e => G(e).closest("button").hasClass("is-checked") || G(e).closest("button").hasClass("el-button--primary"),
        questionHook: e => {
            let t = G(e.html).find(".self-start.text-3.self-end").text();
            return t && (t = t.replace(/\[|\]/g, "").trim(), e.type = typeMatch(t)), e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u826f\u5e08\u5728\u7ebf\u4f5c\u4e1a\u6536\u5f55",
        match: () => location.href.includes("/#/homework/") && location.href.includes("scene=history"),
        question: {
            html: "[id^='question-']",
            question: ".question-content",
            options: ".flex.flex-col.space-y-2 .f-c-c.space-x-3 .flex-1",
            type: ".self-start.text-3.self-end",
            workType: "ls365",
            pageType: "ls365"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist("[id^='question-']");
            }));
        },
        answerHook: e => {
            let t = G(e.html).find(".self-start.text-3.self-end").text();
            t && (t = t.replace(/\[|\]/g, "").trim(), e.type = typeMatch(t));
            let n = "";
            if (G(e.html).find("div").each(((e, t) => {
                const a = G(t);
                if ((a.find("span").filter(((e, t) => G(t).text().trim().includes("\u6807\u51c6\u7b54\u6848\uff1a"))).length > 0 || a.text().trim().includes("\u6807\u51c6\u7b54\u6848\uff1a")) && (n = a.find(".question-content").text().trim(), 
                n)) return !1;
            })), n) return e.answer = n.split("").map((t => {
                const n = t.charCodeAt(0) - 65;
                return e.options && e.options[n] ? e.options[n] : null;
            })).filter((e => null !== e)), e;
        }
    } ], it = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("jijiaox.com"),
        main: e => {
            xe.mainClass = G("#app")[0].__vue__.$route.path;
            let t = new MutationObserver((async e => {
                xe.mainClass !== G("#app")[0].__vue__.$route.path && (xe.mainClass = G("#app")[0].__vue__.$route.path, 
                vuePageChange(), t.disconnect());
            }));
            G("#app").length >= 1 && t.observe(G("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u7ee7\u6559\u4e91\u8003\u8bd5\u7b54\u9898",
        tips: "",
        match: () => location.host.includes("jijiaox.com") && (location.href.includes("/mg/studentindexexam/") || !location.href.includes("examrec")),
        types: [ "0", "1", "3", "4" ],
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
            const n = G(".page")[0].__vue__.$data.testInfo.studentPraxisList[t];
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
        setAnswer: e => "4" !== e.type || (G(e.html).find(".editor")[0].__vue__.editor.txt.html(e.answer[0]), 
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
            const n = G(".page")[0].__vue__.$data.testInfo.studentPraxisList[t], a = n.answer;
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
    } ], rt = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("wencaischool.net") && G("#app").length,
        main: e => {
            xe.mainClass = G("#app")[0].__vue__.$route.path;
            let t = new MutationObserver((async e => {
                xe.mainClass !== G("#app")[0].__vue__.$route.path && (xe.mainClass = G("#app")[0].__vue__.$route.path, 
                vuePageChange(), t.disconnect());
            }));
            G("#app").length >= 1 && t.observe(G("#app")[0], {
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
        tips: "\u6b64\u5e73\u53f0\u7b54\u9898\u95f4\u9694\u5c3d\u91cf3s\u5de6\u53f3\uff0c\u5426\u5219\u53ef\u80fd\u9009\u4e0d\u4e0a\u7b54\u6848",
        match: () => location.host.includes("wencaischool.net") && location.href.includes("/separation/exam/index.html"),
        types: [ "0", "1", "2", "3", "4", "5", "6", "7", "14" ],
        minDelay: 2e3,
        answerDelay: 1e3,
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
                return isExist(".tmList") && G("#onlineExamArea")[0].__vue__._data.itemsList.length > 0;
            }));
        },
        next: () => {},
        ischecked: e => e[0].checked,
        questionHook: e => {
            let t = G(e.html).find(".tmc.tm").attr("ttype");
            return e.type = typeConvert({
                1: "\u586b\u7a7a\u9898",
                2: "\u7b80\u7b54\u9898",
                3: "\u5355\u9009\u9898",
                4: "\u591a\u9009\u9898",
                5: "\u9605\u8bfb\u7406\u89e3",
                12: "\u5b8c\u5f62\u586b\u7a7a"
            }[t]), e.$options = G(e.html).find(".perRad input"), e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "4":
                return G(e.html).find("textarea").focus(), document.execCommand("selectAll"), document.execCommand("insertText", !1, e.answer[0]), 
                !1;

              case "2":
                G(e.html).find(".ansbox.inputAnswer input").each((async (t, n) => {
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
                return isExist(".tmList") && G("#onlineExamArea")[0].__vue__._data.itemsList.length > 0;
            }));
        },
        answerHook: (e, t) => {
            const n = G("#onlineExamArea")[0].__vue__._data.itemsList[t];
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
        tips: "",
        match: () => location.host.includes("wencaischool.net") && location.href.includes("/exam/portal/exam.jsp"),
        types: [ "0", "1", "2", "3" ],
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
            })), G(".aah_wrapper>div").css("z-index", 9999);
        },
        next: () => {},
        ischecked: e => e[0].checked,
        questionHook: e => {
            let t = removeHtml(G(e.html).parent().parent().prevAll("tr").filter((function() {
                return G(this).find("table[islabel='1']").length > 0;
            })).first().html());
            if (e.type = typeMatch(t), "8" == e.type && t.includes("\u9009\u62e9\u9898") && (e.type = "0"), 
            "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => {
            if ("2" === e.type) {
                const t = G(e.html).find("table>tbody>tr:eq(0)>td:eq(0)>input");
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
            const n = removeHtml(G(e.html).prevAll("tr:not([id])").first().html());
            switch (e.type = typeMatch(n), "8" == e.type && n.includes("\u9009\u62e9\u9898") && (e.type = "0"), 
            e.type) {
              case "0":
              case "1":
              case "3":
                const t = G(e.html).find("table>tbody>tr:eq(1)>td:eq(0)>div[style='color:darkred;font-size:10pt']").text().split("\u7b54\u6848\uff1a")[1].split("]")[0];
                e.answer = t.split("").map((t => e.options[t.charCodeAt(0) - 65])), "3" == e.type && (e.options = [], 
                e.answer = judgeAnswer(e.answer[0]));
                break;

              case "2":
                const n = G(e.html).find("table>tbody>tr:eq(0)>td:eq(0)").clone();
                n.find("input").remove(), e.answer = n.find("nobr").map(((e, t) => {
                    const n = removeHtml(G(t).html());
                    return /\[\u53c2\u8003\u7b54\u6848\uff1a(.+?)\]/.exec(n)[1];
                })).get(), n.find("nobr").remove(), n.find("font").remove(), e.question = removeHtml(n.html());
            }
            return e;
        }
    } ], lt = [ {
        type: "save",
        name: "yxlearning\u6536\u5f55",
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
            })), !xe.yxques) return !1;
        },
        answerHook: (e, t) => {
            const n = [];
            xe.yxques.questionStemRPS.forEach(((e, t) => {
                e.listPaperQuestionRP.forEach(((e, t) => {
                    n.push(e);
                }));
            }));
            const a = n[t];
            e.question = titleClean(removeHtml(a.questionName));
            const o = a.type, s = [];
            switch (e.options = removeStartChar(a.paperOptionRPS.map((e => removeHtml(e.context)))), 
            a.paperOptionRPS.forEach(((t, n) => {
                1 == t.standardAnswer && s.push(e.options[n]);
            })), e.answer = s, o) {
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
        tips: "",
        match: () => location.host.includes("yxlearning.com") && location.href.includes("exam/start?myExamRecordId"),
        types: [ "0", "1", "3" ],
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
            if (e.options = removeStartChar(G(e.html).find("ul>li").map(((e, t) => removeHtml(G(t).html()))).get()), 
            e.$options = G(e.html).find("ul>li"), e.type = typeConvert(G(e.html).parent().prevAll(".title").first().find("[du-html='questionStemName']").text().trim()), 
            "3" === e.type) e.options = [], e.$options = G(e.html).find("ul>li");
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    } ], pt = [ {
        type: "ask",
        name: "\u9ea6\u80fd\u7f51\u7b54\u9898",
        tips: "",
        match: () => location.href.includes("lms/web/onlineexam/exambegin"),
        types: [ "0", "1", "3" ],
        question: {
            html: "#exam_form>.sdiv",
            question: ".eptimu_name",
            options: ".ansdiv > .optiondiv",
            type: ".eptimu_title",
            workType: "cjnep",
            pageType: "cjnep"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".sdiv");
            }));
        },
        toquestion: e => {
            G(`.controldiv > a:eq(${e})`), G(`.epcl_circle:eq(${e})`)[0].click();
        },
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            if (e.question = e.question.replace(/^[0-9]+\u3001/, "").trim(), e.question = titleClean(e.question), 
            e.options = removeStartChar(e.options), e.type = typeMatch(G(e.html).find(".eptimu_title").text().trim()), 
            e.$options = G(e.html).find(".ansdiv input"), "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "3":
                let t = e.answer;
                return G(e.html).find(".ansdiv input").each(((e, n) => {
                    isTrue(t) && "1" == G(n).val() && G(n).click(), isFalse(t) && "0" == G(n).val() && G(n).click();
                })), !1;

              case "2":
              case "4":
              case "5":
              case "6":
                const n = G(e.html).find(".ansdiv textarea"), a = e.answer.join(";");
                n.val(a), n.trigger("input"), n.trigger("keydown"), n.trigger("change"), n.trigger("blur"), 
                n.trigger("focus");
                const o = n[0];
                if (o) {
                    [ "input", "change", "blur", "focus" ].forEach((e => {
                        const t = new Event(e, {
                            bubbles: !0
                        });
                        o.dispatchEvent(t);
                    }));
                }
                return !1;
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "save",
        name: "\u9ea6\u80fd\u7f51\u7b54\u9898\u6536\u5f55",
        match: () => location.href.includes("lms/web/exam/examshow"),
        question: {
            html: "#exam_form>.sdiv",
            question: ".eptimu_name",
            options: ".ansdiv > .optiondiv",
            type: ".eptimu_title",
            workType: "cjnep",
            pageType: "cjnep"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".sdiv");
            }));
        },
        answerHook: e => {
            switch (e.type = typeMatch(G(e.html).find(".eptimu_title").text().trim()), e.question = e.question.replace(/^[0-9]+\u3001/, "").trim(), 
            e.question = titleClean(e.question), e.options = removeStartChar(e.$options.map(((e, t) => {
                let n = G(t).clone();
                return G(n).find("img").remove(), removeHtml(G(n).html()).trim();
            })).get()), e.type) {
              case "0":
              case "1":
                e.answer = e.$options.map(((t, n) => {
                    var a;
                    return (null == (a = G(n).find("img").attr("src")) ? void 0 : a.includes("exam-yes")) && e.options[t];
                })).get().filter((e => void 0 !== e));
                break;

              case "3":
                e.answer = e.$options.map(((t, n) => {
                    var a;
                    return (null == (a = G(n).find("img").attr("src")) ? void 0 : a.includes("exam-yes")) && e.options[t];
                })).get().filter((e => void 0 !== e)), e.answer = judgeAnswer(e.answer), e.options = [];
                break;

              case "4":
                e.options = [];
                let t = removeHtml(G(e.html).find(".eptimu_answer.ansdiv").html()).trim();
                t.includes("\u6b63\u786e\u7b54\u6848\uff1a") ? e.answer = t.split("\u6b63\u786e\u7b54\u6848\uff1a")[1].trim() : e.answer = [];
            }
            return e;
        }
    } ], ct = [ {
        type: "ask",
        name: "\u9ea6\u80fd\u7f51\u7b54\u9898",
        tips: "",
        match: () => location.host.includes("mynep.com") && location.href.includes("my-exam/exambegin"),
        types: [ "0", "1" ],
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
            xe.select_num(e + 1);
        },
        next: () => {},
        ischecked: e => e.parent().find("input").prop("checked"),
        questionHook: e => {
            e.question = e.question.replace(/\u7b2c\d+\u9898\uff1a/, ""), e.options = removeStartChar(e.options);
            switch (G(e.html).find('input[id^="question-num-isdone"]').attr("question_num_type_id")) {
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
        name: "\u9ea6\u80fd\u7f51\u6536\u5f55",
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
            const t = G(e.html).find(".et_title").clone();
            t.find(".exam-btn").remove(), t.find("div").remove(), e.question = removeHtml(t.html()).replace(/\u7b2c\d+\u9898\uff1a/, "").trim(), 
            e.options = [];
            const n = [];
            G(e.html).find(".et_answer>.et_answer>.et_answer>label").map(((t, a) => {
                e.options.push(removeHtml(G(a).html()).trim()), G(a).parent().find("input").prop("checked") && n.push(t);
            })).get(), e.options = removeStartChar(e.options), e.answer = n.map((t => e.options[t]));
            switch (G(e.html).find('input[id^="question-num-isdone"]').attr("question_num_type_id")) {
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
    } ], ut = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("91huayi.com"),
        main: e => {
            const getHash = () => G(".dd_01").attr("questionid");
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getHash() && (xe.mainClass = getHash(), "homework-detail-container" === xe.mainClass && await waitUntil((function() {
                    return 0 === G(".el-loading-mask").length;
                })), vuePageChange$1(), t.disconnect());
            }));
            G(".box").length >= 1 && t.observe(G(".box")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u534e\u533b\u7f51\u7b54\u9898",
        tips: "",
        match: () => location.host.includes("91huayi.com") && location.href.includes("/ExamInterface/ComputerExamIndex"),
        types: [ "0", "1" ],
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
            null == (e = G("#btnNext")) || e.click();
        },
        ischecked: e => e.prop("checked"),
        questionHook: e => {
            const t = G(e.html).find(".dd_01").clone();
            return t.find(".dd_01_red").remove(), e.question = removeHtml(t.html()), e.options = removeStartChar(e.options), 
            e.type = typeMatch(G(e.html).find(".big_type").text()), e.$options = G(e.html).find("dd.q-content input"), 
            e;
        },
        setAnswer: e => {
            switch (console.log(e), e.type) {
              case "0":
              case "1":
                return e.ques.$options.each(((t, n) => {
                    if (e.answer.includes(t)) {
                        if (e.rule.ischecked && e.rule.ischecked(G(n))) return;
                        n.click();
                    } else e.rule.ischecked && e.rule.ischecked(G(n)) && n.click();
                })), !1;
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "ask",
        name: "\u534e\u533b\u7f51\u8003\u8bd5",
        tips: "",
        match: () => location.host.includes("91huayi.com") && location.href.includes("/pages/exam.aspx?cwid="),
        types: [ "0" ],
        question: {
            html: ".test>table",
            question: "thead",
            options: "tbody>tr>td>label",
            type: ".big_type",
            workType: "huayi",
            pageType: "huayi"
        },
        init: async () => {},
        next: () => {
            var e;
            null == (e = G("#btnNext")) || e.click();
        },
        ischecked: e => e.prop("checked"),
        questionHook: e => (e.question = titleClean(e.question), e.question = e.question.replace(/^\d+\u3001/, ""), 
        e.options = removeStartChar(e.options), 0 !== e.options.length && (e.type = "0"), 
        e),
        setAnswer: e => !0,
        finish: e => {}
    } ], dt = [ {
        type: "ask",
        name: "\u4e91\u5357\u5f00\u653e\u5927\u5b66\u7b54\u9898",
        tips: "",
        match: () => location.href.includes("hw/student/studentStartHomework.action") && location.host.includes("teach.ynou.edu.cn"),
        types: [ "0", "1", "3" ],
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
                return 0 !== G(".e_juan02biaoti").length;
            })), G("body").css("text-align", "left");
        },
        next: () => {},
        ischecked: e => (e.find("input").is(":checked"), e.find("input").is(":checked")),
        questionHook: e => {
            e.options = [];
            const t = G(e.html).find(".e_juan02daan").clone();
            t.find(".clear").nextAll().remove();
            const n = removeHtml(t.html()), a = n.split(/[A][\u3001\.\uff0e]/)[0].trim();
            null !== a && (e.question = a), e.question = a, e.question = a;
            const o = n.match(/(?:[A-G](?:[\u3001.]|\s)?\s?.*?)(?=\s*[A-G](?:[\u3001.]|\s)?|\s*$)/gs);
            if (null !== o) {
                const t = removeOptionsStartChar(o.map((e => e.trim())));
                !1 !== t && (e.options = t);
            }
            const s = G(e.html).find(".signDefault").attr("answer_control");
            return "radio" === s && e.options.length > 1 && (e.type = "0"), "checkbox" === s && e.options.length > 1 && (e.type = "1"), 
            "radio" === s && 0 === e.options.length && (e.type = "3"), e;
        },
        setAnswer: e => {
            if (console.log(e), "3" === e.type) {
                let t = e.answer;
                return e.ques.$options.each(((e, n) => {
                    isTrue(t) && isTrue(removeHtml(G(n).html())) && G(n).click(), isFalse(t) && isFalse(removeHtml(G(n).html())) && G(n).click();
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
                return 0 !== G(".e_juan02biaoti").length;
            })), G("body").css("text-align", "left");
        },
        answerHook: e => {
            e.options = [];
            const t = G(e.html).find(".e_juan02daan").clone();
            t.find(".clear").nextAll().remove();
            const n = removeHtml(t.html()), a = n.split(/[A][\u3001\.\uff0e]/)[0].trim();
            if (null === a) return null;
            e.question = a;
            const o = n.match(/(?:[A-G](?:[\u3001.]|\s)?\s?.*?)(?=\s*[A-G](?:[\u3001.]|\s)?|\s*$)/gs);
            if (null !== o) {
                const t = removeOptionsStartChar(o.map((e => e.trim())));
                if (0 == t) return null;
                e.options = t;
            }
            const s = G(e.html).find(".signDefault").attr("answer_control");
            "radio" === s && e.options.length > 1 && (e.type = "0"), "checkbox" === s && e.options.length > 1 && (e.type = "1"), 
            "radio" === s && 0 === e.options.length && (e.type = "3");
            const i = G(e.html).find(".right_answer>font").text();
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
    } ], ht = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("21tb.com"),
        main: e => {
            const getHash = () => G("#examIngEmsRightPanel").attr("class");
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getHash() && (xe.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            G("#examIngEmsRightPanel").length >= 1 && t.observe(G("#examIngEmsRightPanel")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "21tb\u7b54\u9898",
        tips: "",
        match: () => location.host.includes("21tb.com") && location.href.includes("exercise/newExercise.fullExerciseTemp.do"),
        types: [ "0", "1", "3" ],
        question: {
            html: ".paper-content > .question-panel-middle",
            question: ".question-stem>.name",
            options: "ul.question-options>li>label",
            type: ".question-box .tag",
            workType: "21tb",
            pageType: "21tb"
        },
        init: async () => {
            if (G(".view-paper-content").length > 0) return !1;
        },
        next: () => {},
        ischecked: e => e.parent().find("input").prop("checked"),
        questionHook: e => {
            e.question = titleClean(e.question), e.question = e.question.replace(/\uff08\d+\u5206\uff09$/, "").trim(), 
            e.options = e.options.map((e => e.replace(/^[A-Z]\s*\.\s*/, ""))), e.options = removeStartChar(e.options);
            const t = G(e.html).attr("class") || "";
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
            if (console.log(G(".view-paper-content").length), 0 == G(".view-paper-content").length) return !1;
        },
        answerHook: e => {
            e.question = titleClean(e.question), e.question = e.question.replace(/\uff08\d+\u5206\uff09$/, "").trim(), 
            e.options = e.options.map((e => e.replace(/^[A-Z]\s*\.\s*/, ""))), e.options = removeStartChar(e.options);
            const t = G(e.html).attr("questtype") || "", n = G(e.html).find(".true-answer").text().split("\uff1a")[1].trim();
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
        tips: "",
        match: () => location.host.includes("21tb.com") && location.href.includes("ems/html/examCenter/fullExamTemp.do"),
        types: [ "0", "1", "3" ],
        question: {
            html: ".paper-content > .question-panel-middle",
            question: ".question-stem",
            options: "ul.question-options>li>label",
            type: ".question-box .tag",
            workType: "21tb",
            pageType: "21tb"
        },
        init: async () => {
            if (G(".view-paper-content").length > 0) return !1;
        },
        next: () => {},
        ischecked: e => e.parent().find("input").prop("checked"),
        questionHook: e => {
            const t = G(e.html).find(".question-stem").clone();
            t.find(".num").remove(), e.question = titleClean(removeHtml(t.html())).replace(/^\./, ""), 
            e.question = e.question.replace(/\uff08\d+\u5206\uff09$/, "").trim(), e.options = e.options.map((e => e.replace(/^[A-Z]\s*\.\s*/, ""))), 
            e.options = removeStartChar(e.options);
            const n = G(e.html).attr("class") || "";
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
    } ], mt = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("168wangxiao.com"),
        main: e => {
            const getHash = () => (G(".question-submit-btn").text(), G(".question-submit-btn").text() || G(".listTit>span").text());
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getHash() && (xe.mainClass = getHash(), "homework-detail-container" === xe.mainClass && await waitUntil((function() {
                    return 0 === G(".el-loading-mask").length;
                })), vuePageChange$1(), t.disconnect());
            }));
            G("#app").length >= 1 && (G("#app")[0], t.observe(G("#app")[0], {
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
        types: [ "0", "1", "2", "3", "4" ],
        question: {
            html: ".question-item-container",
            question: ".title-content",
            options: ".options .opt-content",
            type: ".type",
            workType: "168wx",
            pageType: "168wx"
        },
        init: async () => (await waitUntil((function() {
            return 0 !== G(".question-item-container").length;
        })), !G(".question-submit-btn").text().includes("\u91cd\u65b0\u7b54\u9898")),
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            const t = G(e.html).find(".type").text();
            return e.type = typeMatch(t), e;
        },
        setAnswer: e => "4" !== e.type || (G(e.html).find(".ql-editor"), G(e.html).find(".ql-editor")[0].innerHTML = e.answer[0], 
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
            return 0 !== G(".question-item-container").length;
        })), G(".question-submit-btn").text().includes("\u91cd\u65b0\u7b54\u9898")),
        answerHook: e => {
            const t = G(e.html).find(".type").text();
            switch (e.type = typeMatch(t), e.answer = G(e.html).find(".options .opt-content.is-correct-answer").map(((e, t) => removeHtml(G(t).html()))).get(), 
            e.type) {
              case "2":
                e.options = [], e.answer = G(e.html).find(".analyze-container>.answer>.text-container>p").map(((e, t) => removeHtml(G(t).html()))).get();
                break;

              case "3":
                e.options = [], e.answer = [ judgeAnswer(e.answer[0]) ];
                break;

              case "4":
                e.options = [], e.answer = G(e.html).find(".analyze-container>.answer>.text-container").map(((e, t) => removeHtml(G(t).html()))).get();
            }
            return e;
        }
    }, {
        type: "ask",
        name: "168\u7f51\u6821\u8003\u8bd5",
        tips: "",
        match: () => location.host.includes("168wangxiao.com") && location.href.includes("/web/examination/answer"),
        types: [ "0", "1", "2", "3", "4" ],
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
                return 0 !== G(".Answer-area").length;
            }));
        },
        next: () => {
            G('button:contains("\u4e0b\u4e00\u9898")').click();
        },
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => (e.options = removeOptionsStartChar(e.options), e.type = typeMatch(G(".tit-type").text()), 
        e),
        setAnswer: e => "4" !== e.type || (G(e.html).find(".ql-editor"), G(e.html).find(".ql-editor")[0].innerHTML = e.answer[0], 
        !1),
        finish: e => {}
    } ], ft = [ {
        type: "ask",
        name: "\u4e91\u73ed\u8bfe\u7b54\u9898",
        tips: "",
        match: () => "www.mosoteach.cn" === location.host && location.href.includes("/web/index.php?c=interaction_quiz&m=reply"),
        types: [ "0", "1" ],
        question: {
            html: ".topic-item",
            question: ".t-subject",
            options: ".t-option.t-item label,.t-judge.t-item label",
            type: ".t-type",
            workType: "mosoteach",
            pageType: "mosoteach"
        },
        init: async () => {
            await waitUntil((function() {
                var e;
                return 0 !== (null == (e = G("#app")[0]) ? void 0 : e.__vue__.$data.topics.length);
            }));
        },
        next: () => {},
        ischecked: e => e.hasClass("is-checked"),
        questionHook: (e, t) => {
            const n = G("#app")[0].__vue__.$data.topics[t];
            e.question = titleClean(removeHtml(n.subject));
            const a = n.options;
            switch (a.sort(((e, t) => e.item_no - t.item_no)), e.options = a.map((e => removeHtml(e.content))), 
            n.type) {
              case "SINGLE":
                e.type = "0";
                break;

              case "MULTI":
                e.type = "1";
                break;

              case "TF":
                e.type = "3";
            }
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u4e91\u73ed\u8bfe\u6536\u5f55",
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
                return 0 !== (null == (e = G("#app")[0]) ? void 0 : e.__vue__.$data.topics.length);
            }));
        },
        answerHook: (e, t) => {
            const n = G("#app")[0].__vue__.$data.topics[t];
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

              case "TF":
                e.type = "3", e.answer = "F" === n.tfAnswer ? "\u9519\u8bef" : "T" === n.tfAnswer ? "\u6b63\u786e" : "";
                break;

              default:
                return null;
            }
            return e;
        }
    } ], gt = [ {
        type: "hook",
        name: "hook",
        match: "www.learnin.com.cn" === location.host,
        main: e => {
            const getHash = () => {
                try {
                    return G(".page-student-course-topic-do-container")[0].__vue__.$data.topic.studentTopic.id;
                } catch (e) {
                    return "";
                }
            };
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getHash() && (xe.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            G("#app").length >= 1 && t.observe(G("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "save",
        name: "learnin\u6536\u5f55",
        match: () => "www.learnin.com.cn" === location.host && location.href.includes("/user/#/user/student/course/") && 0 == G("button:contains('\u63d0\u4ea4\u4f5c\u4e1a')").length,
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
            const n = G(".do-store-topic-detail-content-wrapper")[0].__vue__.$data.topic.topicItems[0].childList, a = n[t];
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
            let o = [], s = [];
            return a.optionList.forEach((e => {
                const t = removeHtml(e.content);
                e.isAnswer && s.push(t), o.push(t);
            })), e.options = o, e.answer = s, "3" == e.type && (e.options = [], e.answer = judgeAnswer(s[0])), 
            e;
        }
    }, {
        type: "ask",
        name: "learnin\u7b54\u9898",
        tips: "",
        match: () => "www.learnin.com.cn" === location.host && location.href.includes("/user/#/user/student/course/") && 1 == G("button:contains('\u63d0\u4ea4\u4f5c\u4e1a')").length,
        types: [ "0", "1", "3" ],
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
            const n = G(e.html)[0].__vue__.question;
            switch (n.questionTypeCode) {
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
            e.question = titleClean(removeHtml(n.questionTitle));
            let a = [];
            return n.optionList.forEach((e => {
                const t = removeHtml(e.content);
                a.push(t);
            })), e.options = a, "3" == e.type && (e.options = []), e;
        },
        setAnswer: e => !0,
        finish: e => {}
    } ], yt = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("ouchn.edu.cn"),
        main: e => {
            const getHash = () => getUrl();
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getHash() && (xe.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            G("#app").length >= 1 && t.observe(G("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u7535\u5927\u7b54\u9898",
        tips: "",
        match: () => location.host.includes("ouchn.edu.cn") && location.href.includes("learningPlatform/#/myExamDetails/examQuestion"),
        types: [ "0" ],
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
            const t = G(e.html).find('.rightAndWrong>span:contains("\u6b63\u786e\u7b54\u6848")').text().replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim(), n = e.options;
            let a = [];
            return t.split("").forEach((e => {
                a.push(n[e.charCodeAt(0) - 65]);
            })), 1 == a.length ? e.type = "0" : e.type = "1", e.answer = a, e;
        }
    } ], xt = [ {
        type: "hook",
        name: "mooc",
        match: "www.icourse163.org" === location.host,
        main: e => {
            xe.mainClass = G("#courseLearn-inner-box > div:eq(0)").attr("class");
            let t = new MutationObserver((async e => {
                xe.mainClass !== G("#courseLearn-inner-box > div:eq(0)").attr("class") && (xe.mainClass = G("#courseLearn-inner-box > div:eq(0)").attr("class"), 
                "homework-detail-container" === xe.mainClass && await waitUntil((function() {
                    return 0 === G(".el-loading-mask").length;
                })), vuePageChange$1(), t.disconnect());
            }));
            G("#courseLearn-inner-box").length >= 1 && t.observe(G("#courseLearn-inner-box")[0], {
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
        types: [ "0", "1", "2", "3" ],
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
                return G(".u-questionItem").length, 0 !== G(".u-questionItem").length;
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: (e, t) => {
            G(e.html).find(".qaCate.j-qacate.f-fl > span:eq(0)").attr("class");
            const n = xe.learnUtilQuestionList[t];
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
                return G(e.html).find(".u-baseinputui>textarea").each(((t, n) => {
                    G(n).val(e.answer[t]), G(n).focus(), G(n).blur();
                })), !1;

              case "3":
                let t = e.answer;
                G(e.html).find("ul.choices>li").each(((e, n) => {
                    isTrue(t) && G(n).find(".u-icon-correct").length > 0 && G(n).find("input").click(), 
                    isFalse(t) && G(n).find(".u-icon-wrong").length > 0 && G(n).find("input").click();
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
                return G(".u-questionItem").length, 0 !== G(".u-questionItem").length;
            }));
        },
        answerHook: (e, t) => {
            const n = xe.learnUtilQuestionList[t];
            e.question = removeHtml(n.title);
            let a = [], o = [];
            switch (n.options.forEach((e => {
                a.push(removeHtml(e.content)), e.answer && o.push(removeHtml(e.content));
            })), e.options = a, e.answer = o, n.type) {
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
    } ], bt = [ {
        type: "ask",
        name: "\u897f\u8d22\u5728\u7ebf\u7b54\u9898",
        tips: "",
        match: () => location.href.includes("learnspace/course/test/coursewareTest_intoRedoTestPage.action") || location.href.includes("learnspace/learn/learn/templateeight/index.action") || location.href.includes("learnspace/course/test/coursewareTest_intoTestPage.action"),
        types: [ "0", "1", "3" ],
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
            const t = G(e.html).find(".test_item_tit").clone();
            if (t.find(".tipNodo").remove(), e.question = removeHtml(t.html()), e.question = titleClean(e.question), 
            e.type = typeMatch(G(e.html).prevAll(".test_item_type").first().text()), e.question = e.question.replace(/^[.*?]\s*/, "").replace(/^\u3010.*?\u3011\s*/, "").replace(/\s*\uff08\d+\.\d+\u5206\uff09$/, "").replace(/^\d+\./, "").trim().replace(/^\d+\uff0e/, "").trim().replace(/^\d+ ./, "").trim(), 
            e.options = removeStartChar(e.options), "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u897f\u8d22\u5728\u7ebf\u9636\u6bb5\u6d4b\u9a8c\u6536\u5f55",
        match: () => location.href.includes("learnspace/course/test/coursewareTest_intoTestAnswerPage.action") || location.href.includes("learnspace/learn/learn/templateeight/index.action"),
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
            e.type = typeMatch(G(e.html).prevAll(".test_item_type").first().text()), e.question = e.question.replace(/^[.*?]\s*/, "").replace(/^\u3010.*?\u3011\s*/, "").replace(/\s*\uff08\d+\.\d+\u5206\uff09$/, "").replace(/^\d+\./, "").trim().replace(/^\d+\uff0e/, "").trim().replace(/^\d+ ./, "").trim(), 
            e.options = removeStartChar(e.options);
            const t = G(e.html).find(".test_item_key_tit").text().replace("\u53c2\u8003\u7b54\u6848\uff1a", "").trim();
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
        types: [ "0", "1", "3" ],
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
            G(".layui-tab-title>li").on("click", (function() {
                vuePageChange$1();
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: (e, t) => {
            const n = G(e.html).attr("id");
            return e.type = typeMatch(G(".layui-this").text()), e.question = removeHtml(G(e.html).html()), 
            e.options = G(`#${n}`).map((function() {
                let t = [], n = G(this).next(), a = [];
                for (;n.length && n.hasClass("question-item-opt"); ) a.push(removeHtml(n[0].outerHTML)), 
                t.push(n), n = n.next();
                return e.$options = G(t.map((e => e[0]))).find("label"), a;
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
            G(".layui-tab-title>li").on("click", (function() {
                vuePageChange$1();
            }));
        },
        answerHook: e => {
            const t = G(e.html).attr("id");
            switch (e.type = typeMatch(G(".layui-this").text()), e.question = removeHtml(G(e.html).html()), 
            e.options = G(`#${t}`).map((function() {
                let t = [], n = G(this).next(), a = [];
                for (;n.length && n.hasClass("question-item-opt"); ) a.push(removeHtml(n[0].outerHTML)), 
                t.push(n), n = n.next();
                return e.$options = G(t.map((e => e[0]))).find("label"), a;
            })).get(), e.options = removeStartChar(e.options), e.type) {
              case "0":
              case "1":
                const n = G(`#${t}`).nextAll(".ans").first().find("span:eq(0)").text();
                e.answer = n.trim().split("").map((t => {
                    let n = t.charCodeAt() - 65;
                    return e.options[n];
                }));
                break;

              case "3":
                e.answer = judgeAnswer(G(`#${t}`).nextAll(".ans").first().find("span:eq(0)").text().trim()), 
                e.options = [];
                break;

              case "7":
              case "4":
                e.answer = removeHtml(G(`#${t}`).nextAll(".ans").first().html()).replace("\u6b63\u786e\u7b54\u6848\uff1a", "").trim(), 
                e.options = [];
                break;

              default:
                e.type;
            }
            return e;
        }
    } ], vt = [ {
        type: "ask",
        name: "\u91cd\u5e86\u6cd5\u6cbb\u8003\u8bd5\u7b54\u9898",
        tips: "\u672c\u5e73\u53f0\u65e0\u7b54\u6848\u6536\u5f55\uff0c\u9700\u8981\u81ea\u884c\u8865\u5145\u9898\u5e93\uff0c\u5efa\u8bae\u4f7f\u7528\u9898\u5e93\u5bfc\u5165\u529f\u80fd",
        match: () => "ks.cqsdx.cn" === location.host && location.pathname.includes("/exam/user/bind"),
        types: [ "0", "1", "3" ],
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
            G(`#question_card button:eq(${e})`).click();
        },
        next: () => {},
        ischecked: e => e.find("div").hasClass("checked"),
        questionHook: e => {
            const t = G(e.html).find(".badge.badge-danger").text();
            if (e.type = typeMatch(t), e.question = e.question.replace(/\u206B/g, "").trim(), 
            e.options = e.options.map((e => e.replace(/\u206B/g, "").trim())), "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => !0,
        finish: e => {}
    } ], wt = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("telfri-edu.com"),
        main: e => {
            const getHash = () => getUrl();
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getHash() && (xe.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            G("#app").length >= 1 && t.observe(G("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "olearn\u7b54\u9898",
        tips: "",
        match: () => location.host.includes("telfri-edu.com") && location.href.includes("/learn/homework/do/"),
        types: [ "0", "1", "3" ],
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
            let t = G(e.html).prevAll(".topic-title").first().find(".title-bold").text().trim();
            return e.$options = G(e.html).find(".topic-answer .radio-wrap>label"), e.type = typeMatch(t), 
            e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "olearn\u6536\u5f55",
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
            let t = G(e.html).prevAll(".topic-title").first().find(".title-bold").text().trim();
            e.type = typeMatch(t);
            const n = G(e.html).find(".standard-answer>.analysis-text").text().trim();
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
    } ], kt = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("yxbyun.com"),
        main: e => {
            const getHash = () => G("#app")[0].__vue__.$route.path;
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getHash() && (xe.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            G("#app").length >= 1 && t.observe(G("#app")[0], {
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
            const n = G(e.html).find("div:eq(0)")[0].__vue__, a = (null == (t = n.pagerData) ? void 0 : t.question) || n.smallPaper.questionTopic;
            return e.type = typeMatch(n.queTypeName), e.question = titleClean(removeHtml(a.questionTitle)), 
            e.options = (a.optionList || a.questionOptionList).map((e => removeHtml(e.questionContent))), 
            [ "0", "1", "3" ].includes(e.type) && (e.answer = a.questionAnswer.split(",").map((t => e.options[t.charCodeAt(0) - 65]))), 
            "3" === e.type && (e.options = [], e.answer = judgeAnswer(e.answer)), e;
        }
    }, {
        type: "ask",
        name: "\u4ebf\u5b66\u5b9d\u7b54\u9898",
        match: () => location.host.includes("yxbyun.com") && (location.href.includes("yxbstudent/#/testPaper") || location.href.includes("yxbstudent/#/finalExam")),
        types: [ "0", "1", "3" ],
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
            const n = G(e.html).find("div:eq(0)")[0].__vue__, a = (null == (t = n.pagerData) ? void 0 : t.question) || n.smallPaper.questionTopic;
            if (e.type = typeMatch(n.queTypeName), e.question = titleClean(removeHtml(a.questionTitle)), 
            e.options = (a.optionList || a.questionOptionList).map((e => removeHtml(e.questionContent))), 
            "3" === e.type) e.options = [];
            return e;
        },
        setAnswer: e => {
            if ("3" === e.type) {
                let t = e.answer;
                return e.ques.$options.each(((e, n) => {
                    isTrue(t) && isTrue(removeHtml(G(n).parent().html())) && G(n).click(), isFalse(t) && isFalse(removeHtml(G(n).parent().html())) && G(n).click(), 
                    removeHtml(G(n).parent().html());
                })), !1;
            }
            return !0;
        },
        finish: e => {}
    } ], _t = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("wdjycj.com") || location.host.includes("iwdjy.com"),
        main: e => {
            const getHash = () => getUrl();
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getHash() && (xe.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            G("#app").length >= 1 && t.observe(G("#app")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "save",
        name: "\u6587\u9876\u5728\u7ebf\u6536\u5f55",
        match: () => location.href.includes("/testpaper-test-result?resultId=") || location.href.includes("/testpaper-test?id"),
        question: {
            html: ".st-item",
            question: ".st-title",
            options: ".st-main>p",
            type: ".question-box .tag",
            workType: "wdzx",
            pageType: "wdzx"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".st-item");
            }));
            let e = [];
            try {
                G(".exam-html")[0].__vue__.test.lists.forEach(((t, n) => {
                    t.question_lists.forEach(((t, n) => {
                        e.push(t);
                    }));
                }));
            } catch (t) {}
            xe.ques = e;
        },
        answerHook: (e, t) => {
            var n;
            const a = xe.ques[t], o = [];
            switch (e.question = titleClean(removeHtml(a.content)), e.options = (null == (n = a.appanswer) ? void 0 : n.map((e => {
                const t = removeHtml(e.text);
                return e.right && o.push(t), removeHtml(t);
            }))) || [], a.tm_type) {
              case 4:
                e.type = "3", e.answer = judgeAnswer("1" == a.answer ? "\u6b63\u786e" : "0" == a.answer ? "\u9519\u8bef" : "");
                break;

              case 5:
                e.type = "2", e.question = e.question.replace(/{#answer}/g, "_____"), e.answer = a.answer.split("|").map((e => e.includes("\u203b") ? e.split("\u203b")[0] : e));
                break;

              case 2:
                e.type = "0", e.answer = o;
                break;

              case 3:
                e.type = "1", e.answer = o;
                break;

              case 1:
                e.type = "4", e.answer = removeHtml(a.answer);
                break;

              default:
                a.tm_type;
            }
            return e;
        }
    }, {
        type: "ask",
        name: "\u6587\u9876\u5728\u7ebf\u7b54\u9898",
        tips: "",
        match: () => location.href.includes("/testpaper-test?id=") || location.href.includes("/final-exam"),
        types: [ "0", "1", "2", "3" ],
        question: {
            html: ".st-item",
            question: ".st-title",
            options: ".st-main>p",
            type: ".question-box .tag",
            workType: "wdzx",
            pageType: "wdzx"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".st-item");
            }));
        },
        next: () => {},
        toquestion: e => {
            G(`.card-box .bj:eq(${e})`).click();
        },
        ischecked: e => G(e).find("input").prop("checked"),
        questionHook: (e, t) => {
            e.options = removeOptionsStartChar(e.options);
            const n = G(e.html).find(".st-title").clone();
            G(n).find("strong").remove(), e.question = removeHtml(G(n).html());
            let a = G(e.html).prevAll(".title").first().text().trim();
            return e.type = typeMatch(a), e.$options = G(e.html).find(".answer-box>.answer>label"), 
            e;
        },
        setAnswer: e => {
            switch (e.type) {
              case "4":
              case "5":
              case "6":
              case "7":
                return G(e.html).find(".answer-text>div")[0].__vue__.msg.yourAnswer = e.answer[0], 
                G(e.html).find(".quill-editor").map(((t, n) => {
                    n.__vue__.value = e.answer[t];
                })), !1;

              case "2":
                let setYourAnswerById = function(e, t, n) {
                    for (let a of e) if (Array.isArray(a.itemlists)) for (let e of a.itemlists) if (e.id === t) return e.yourAnswer = n, 
                    !0;
                    return !1;
                };
                const t = G(e.html).find("span.bj input").attr("name");
                return setYourAnswerById(G(".exam-html")[0].__vue__.answerCard, Number(t), e.answer), 
                e.answer, !1;
            }
            return !0;
        },
        finish: e => {}
    } ], qt = [ {
        type: "ask",
        name: "\u6b66\u6c49\u7406\u5de5\u7ee7\u7eed\u6559\u80b2\u7b54\u9898",
        tips: "\u6b66\u6c49\u7406\u5de5\u7ee7\u7eed\u6559\u80b2\u4ec5\u652f\u6301\u9009\u62e9\u3001\u5224\u65ad\u9898\u5176\u4ed6\u9898\u578b\u6682\u4e0d\u652f\u6301\uff0c\u82e5\u6709\u9700\u8981\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005",
        match: () => location.href.includes("/web/exercise.htm"),
        question: {
            html: ".pad_top",
            question: "div:eq(0)",
            options: ".radio>label",
            type: ".question-box .tag",
            workType: "whut",
            pageType: "whut"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== G(".pad_top").length;
            }));
        },
        next: () => {},
        ischecked: e => e.find("input").is(":checked"),
        questionHook: e => {
            e.question = titleClean(e.question), e.question = e.question.replace(/^\d+\s*[\u3001.\uff09)]/, "").trim(), 
            e.options = removeOptionsStartChar(e.options);
            let t = G(e.html).prevAll(".p-title").first().clone();
            return t = t.remove("span"), e.type = typeMatch(t.text()), e.type, e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u6b66\u6c49\u7406\u5de5\u7ee7\u7eed\u6559\u80b2\u6536\u5f55",
        match: () => location.href.includes("/web/showexercise.htm"),
        question: {
            html: ".pad_top",
            question: "div:eq(0)",
            options: ".radio>label",
            type: ".question-box .tag",
            workType: "whut",
            pageType: "whut"
        },
        init: async () => {
            await waitUntil((function() {
                return 0 !== G(".pad_top").length;
            }));
        },
        answerHook: e => {
            e.question = titleClean(e.question), e.question = e.question.replace(/^\d+\s*[\u3001.\uff09)]/, "").trim(), 
            e.options = removeOptionsStartChar(e.options);
            const t = !G(e.html).children("p").first().text().includes("\u9519\u8bef:");
            let n = [], a = G(e.html).prevAll(".p-title").first().clone();
            switch (a = a.remove("span"), e.type = typeMatch(a.text()), e.type) {
              case "0":
              case "1":
                if (e.$options.each(((t, a) => {
                    G(a).find("input").is(":checked") && n.push(e.options[t]);
                })), t) e.answer = n; else {
                    let t = G(e.html).children("p").first().text().match(/\u3010(.*?)\u3011/);
                    n = [], t && t[1].split(";").forEach((t => {
                        n.push(e.options[t.charCodeAt(0) - 65]);
                    })), e.answer = n;
                }
                break;

              case "3":
                if (e.$options.each(((t, a) => {
                    G(a).find("input").is(":checked") && n.push(e.options[t]);
                })), t) e.answer = n[0]; else {
                    let t = G(e.html).children("p").first().text().match(/\u3010(.*?)\u3011/);
                    n = [], t && t[1].split(";").forEach((t => {
                        n.push(e.options[t.charCodeAt(0) - 65]);
                    })), e.answer = n[0];
                }
                e.options = [];
            }
            return e;
        }
    } ], Ct = [ {
        type: "save",
        name: "\u4e1c\u5317\u8d22\u7ecf\u5927\u5b66\u6210\u6559\u6536\u5f55",
        match: () => location.host.includes("dufe.edu.cn") && (location.href.includes("/HomeWorkPaper") || location.href.includes("/HomeWorkHistoryPaper") || location.href.includes("/ExercisesPaper")),
        question: {
            html: ".QuestTrunk,.HistoryQuestTrunk",
            question: ".CBTPaperMain-divInline",
            options: ".CBTPaperMain-options li",
            type: ".question-box .tag",
            workType: "dufe",
            pageType: "dufe"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".QuestTrunk,.HistoryQuestTrunk");
            }));
        },
        answerHook: e => {
            const t = e.html.vtree[0].vmodel._trunks[0], n = e.html.vtree[0].vmodel._type;
            let a = [], o = [];
            const getOption = () => {
                t.QUESTION_OPTIONS.forEach((e => {
                    const t = removeHtml(e.OPTION_CONTENT);
                    "1" === e.ISTRUE && a.push(t), o.push(t);
                }));
            };
            switch (n) {
              case "001":
                e.type = "0", getOption();
                break;

              case "002":
                e.type = "1", getOption();
                break;

              case "004":
                e.type = "3", e.options = [], a = "1" === t.QUESTION_OPTIONS[0].ISTRUE ? [ "\u6b63\u786e" ] : "0" === t.QUESTION_OPTIONS[0].ISTRUE ? [ "\u9519\u8bef" ] : [];
                break;

              case "005":
                e.type = "4", a = [ removeHtml(t.QUESTION_OPTIONS[0].OPTION_CONTENT) ];
            }
            return e.question = titleClean(t.QUESTION_TITLE), e.options = o, e.answer = a, e;
        }
    }, {
        type: "ask",
        name: "\u4e1c\u5317\u8d22\u7ecf\u5927\u5b66\u6210\u6559\u7b54\u9898",
        match: () => location.host.includes("dufe.edu.cn") && (location.href.includes("/HomeWorkPaper") || location.href.includes("/ExercisesPaper")),
        types: [ "0", "1", "3", "4" ],
        question: {
            html: ".QuestTrunk",
            question: ".CBTPaperMain-divInline",
            options: ".CBTPaperMain-options li>label",
            type: ".question-box .tag",
            workType: "dufe",
            pageType: "dufe"
        },
        init: async () => {},
        next: () => {},
        ischecked: e => e.parent().find("input").prop("checked"),
        questionHook: e => {
            const t = e.html.vtree[0].vmodel._trunks[0], n = e.html.vtree[0].vmodel._type;
            let a = [], o = [];
            const getOption = () => {
                t.QUESTION_OPTIONS.forEach((e => {
                    const t = removeHtml(e.OPTION_CONTENT);
                    "1" === e.ISTRUE && a.push(t), o.push(t);
                }));
            };
            switch (n) {
              case "001":
                e.type = "0", getOption();
                break;

              case "002":
                e.type = "1", getOption();
                break;

              case "004":
                e.type = "3", e.options = [], a = "1" === t.QUESTION_OPTIONS[0].ISTRUE ? [ "\u6b63\u786e" ] : "0" === t.QUESTION_OPTIONS[0].ISTRUE ? [ "\u9519\u8bef" ] : [];
                break;

              case "005":
                e.type = "4", a = [ removeHtml(t.QUESTION_OPTIONS[0].OPTION_CONTENT) ];
            }
            return e.question = titleClean(t.QUESTION_TITLE), e.options = o, e.answer = a, e;
        },
        setAnswer: e => {
            if ("4" === e.type) {
                const t = G(e.html).find("textarea")[0];
                return t._ms_context_._answer = e.answer[0], t._ms_context_._save(), !1;
            }
            return !0;
        },
        finish: e => {}
    }, {
        type: "ask",
        name: "\u4e1c\u5317\u8d22\u7ecf\u5927\u5b66\u6210\u6559\u7b54\u9898(\u7efc\u5408)",
        match: () => location.host.includes("dufe.edu.cn") && location.href.includes("/CompHomeworkPaper"),
        types: [ "0", "1", "3", "4" ],
        question: {
            html: ".Question",
            question: ".CBTPaperMain-trunkTitle",
            options: "ul.Question-options>li",
            type: ".question-box .tag",
            workType: "dufe",
            pageType: "dufe"
        },
        init: async () => {},
        next: () => {},
        ischecked: e => e.parent().find("input").prop("checked"),
        questionHook: e => {
            const t = (e => {
                var t;
                if (e) {
                    const n = Object.keys(e).find((e => e.startsWith("__reactEventHandlers")));
                    if (n) {
                        const t = e[n];
                        return console.log("React \u4e8b\u4ef6\u5904\u7406\u5bf9\u8c61:", t), t;
                    }
                    if (!n) {
                        const n = Object.keys(e).find((e => e.startsWith("__reactInternalInstance$") || e.startsWith("__reactFiber$")));
                        if (n && (null == (t = e[n]) ? void 0 : t.memoizedProps)) return console.log("React \u5185\u90e8\u6570\u636e:", e[n].memoizedProps), 
                        e[n].memoizedProps;
                    }
                } else console.error("\u672a\u627e\u5230 .Question \u5143\u7d20");
            })(e.html).children[0]._owner.memoizedProps;
            return e.type = {
                SingleChoice: "0",
                MultipleChoice: "1"
            }[t.type], e.options = removeStartChar(e.options), e;
        },
        setAnswer: e => {
            if ("4" === e.type) {
                const t = G(e.html).find("textarea")[0];
                return t._ms_context_._answer = e.answer[0], t._ms_context_._save(), !1;
            }
            return !0;
        },
        finish: e => {}
    } ], Tt = {
        single: "0",
        multiple: "1",
        judge: "3"
    }, At = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("lygtc.edu.cn"),
        main: () => {
            const getHash = () => G("#app")[0].__vue__.$route.path;
            xe.mainClass = getHash();
            const e = new MutationObserver((async () => {
                const t = getHash();
                xe.mainClass !== t && (xe.mainClass = t, vuePageChange$1(), e.disconnect());
            })), t = G("#app")[0];
            t && e.observe(t, {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "save",
        name: "\u6625\u98ce\u96e8\u6536\u5f55",
        match: () => location.host.includes("lygtc.edu.cn") && (location.href.includes("/student/#/my-study/homework/records/detail") || location.href.includes("/student/#/my-study/homework")),
        question: {
            html: ".questions>div>div[id],.question>div>div[id]",
            question: ".topic-title",
            options: ".el-radio-group label .label,.el-checkbox-group label .label",
            type: ".question-box .tag",
            workType: "cfy",
            pageType: "cfy"
        },
        init: async () => {
            await waitUntil((() => 0 !== G(".questions>div>div[id],.question>div>div[id]").length));
        },
        answerHook: e => {
            const t = G(e.html).find(">div")[0].__vue__.question;
            return e.question = titleClean(removeHtml(t.title)), e.options = JSON.parse(t.options).map((e => e.content)), 
            e.answer = t.answer.split("").map((t => e.options[t.charCodeAt(0) - 65])).filter(Boolean), 
            e.type = Tt[t.type] || "", "judge" === t.type && (e.options = [], e.answer = [ judgeAnswer(t.answer) ]), 
            t.type, e;
        }
    }, {
        type: "ask",
        name: "\u6625\u98ce\u96e8\u7b54\u9898",
        tips: "\u516c\u544a",
        match: () => location.host.includes("lygtc.edu.cn") && location.href.includes("/student/#/my-study/homework"),
        types: Object.values(Tt),
        question: {
            html: ".question>div>div[id]",
            question: ".question-title>.title",
            options: ".radio-option",
            type: ".question-box .tag",
            workType: "cfy",
            pageType: "cfy"
        },
        init: async () => {
            await waitUntil((() => 0 !== G(".question>div>div[id]").length));
        },
        next: () => {},
        ischecked: e => e.find(".el-radio__input.is-checked").length > 0,
        questionHook: e => {
            e.options = removeStartChar(e.options);
            const t = G(e.html).find(">div")[0].__vue__.question;
            return e.question = titleClean(removeHtml(t.title)), e.options = JSON.parse(t.options).map((e => e.content)), 
            e.type = Tt[t.type] || "", "judge" === t.type && (e.options = [], e.answer = [ judgeAnswer(t.answer) ]), 
            e;
        },
        setAnswer: () => !0,
        finish: () => {}
    } ], St = [ {
        type: "hook",
        name: "hook",
        match: location.host.includes("jijiaool.com"),
        main: e => {
            const getHash = () => G(".contentIframe").attr("src");
            xe.mainClass = getHash();
            let t = new MutationObserver((async e => {
                xe.mainClass !== getHash() && (xe.mainClass = getHash(), vuePageChange$1(), t.disconnect());
            }));
            G(".contentIframe").length >= 1 && t.observe(G(".contentIframe")[0], {
                subtree: !0,
                attributes: !0,
                childList: !0
            });
        }
    }, {
        type: "ask",
        name: "\u7ee7\u6559\u5728\u7ebf\u7b54\u9898",
        match: () => location.href.includes("jijiaool.com") && location.href.includes("/Learning/CourseOnlineExamination"),
        types: [ "0", "1" ],
        question: {
            html: ".bank_test>.test_item",
            question: ".test_item_tit",
            options: ".test_item_theme>ul>li>label",
            type: ".question-box .tag",
            workType: "jijiaool",
            pageType: "jijiaool"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".bank_test>.test_item");
            }));
        },
        next: () => {},
        ischecked: e => e.parent().parent().hasClass("is-checked"),
        questionHook: e => {
            e.options = removeOptionsStartChar(e.options);
            const t = G(e.html).prevAll(".test_item_type").first().text().trim();
            return e.type = typeMatch(t), e;
        },
        setAnswer: e => !0,
        finish: e => {}
    }, {
        type: "save",
        name: "\u7ee7\u6559\u5728\u7ebf\u6536\u5f55",
        match: () => location.href.includes("jijiaool.com") && location.href.includes("/Learning/CourseExamWorkPageDetail"),
        question: {
            html: ".bank_test>.test_item",
            question: ".test_item_tit",
            options: ".test_item_theme>ul>li>label",
            type: ".question-box .tag",
            workType: "jijiaool",
            pageType: "jijiaool"
        },
        init: async () => {
            await waitUntil((function() {
                return isExist(".bank_test>.test_item");
            }));
        },
        answerHook: e => {
            const t = G(e.html).find(".test_item_tit").clone();
            t.find(".tipNodo").remove(), e.question = titleClean(removeHtml(t.html())), e.options = removeOptionsStartChar(e.options);
            const n = removeHtml(G(e.html).find(".test_item_tit:eq(1)").html().replace(/ \u6b63\u786e\u7b54\u6848\uff1a/g, "").trim()), a = G(e.html).prevAll(".test_item_type").first().text().trim();
            switch (e.type = typeMatch(a), e.type) {
              case "0":
              case "1":
                e.answer = n.split("").map((t => e.options[t.charCodeAt(0) - 65]));
                break;

              case "3":
                e.answer = judgeAnswer(n), e.options = [];
            }
            return e;
        }
    } ], Ut = Object.freeze(Object.defineProperty({
        __proto__: null,
        a21tb: ht,
        ahjxjy: Qe,
        cfy: At,
        chaoxing: Pe,
        chatglm: Ne,
        chengjiaoyun: Ve,
        chutou: ot,
        cjedu: Ye,
        cjnep: pt,
        cloudwis: nt,
        cnzx: Je,
        cqsdx: vt,
        dufe: Ct,
        gkks: et,
        guokai: Be,
        huayi: ut,
        jijiaool: St,
        jijiaox: it,
        jsou: Ge,
        learnin: gt,
        ls365: st,
        mooc: xt,
        mosoteach: ft,
        mynep: ct,
        olearn: wt,
        openha: tt,
        ouchn: yt,
        qingshu: We,
        sclecb: at,
        swufe: bt,
        uooc: Ke,
        wdjycj: _t,
        wencai: rt,
        whut: qt,
        wx168: mt,
        xinwei: Me,
        xueqi: Ze,
        ynou: dt,
        ytccr: Xe,
        yunmuxueyuan: je,
        yxbyun: kt,
        yxlearning: lt,
        zhihuishu: Fe,
        zhijiaoyun: Re
    }, Symbol.toStringTag, {
        value: "Module"
    })), Ht = [];

    for (const nu in Ut) Ht.push(...Ut[nu]);

    const parseRule = async e => {
        await waitUntil((() => void 0 !== xe[$t + "app"]));
        const t = e.filter((e => "function" == typeof e.match ? e.match() : e.match)), n = getAppStore(), a = {
            app: n,
            ask: getAskStore()
        };
        if (!t.length) return n.app.alert = "\u5f53\u524d\u6ca1\u6709\u4efb\u52a1", console.log("\u6ca1\u6709\u5339\u914d\u5230\u89c4\u5219", "error"), 
        void addLog("\u6ca1\u6709\u5339\u914d\u5230\u89c4\u5219", "error");
        for (const o of t) {
            if (console.log(`\u5339\u914d\u5230\u89c4\u5219\uff1a${o.name}`, "success"), addLog(`\u5339\u914d\u5230\u89c4\u5219\uff1a${o.name}`, "success"), 
            o.init) {
                let e = await o.init();
                if ("boolean" == typeof e && !1 === e) continue;
            }
            n.alert = `\u5f53\u524d\u4efb\u52a1:${o.name}`, "hook" === o.type && o.main(a), 
            "ask" === o.type && askParser(o, a), "save" === o.type && saveParser(o, a);
        }
    }, saveParser = (e, t) => {
        const n = t.app, a = t.ask;
        a.rule = e, e.tips && (a.tips = e.tips);
        const o = questionSaveParser(e.question, e.answerHook || null).filter((e => null != e && 0 !== e.answer.length && "" !== e.answer && "8" != e.type)).map((e => (e.question = titleClean(e.question), 
        e)));
        if (a.saveQuestionData = o, o.forEach((e => {
            0 !== e.answer.length && Answer.cacheAnswer(e);
        })), e.paper && "function" == typeof e.paper) try {
            e.paper(o);
        } catch (i) {
            addLog("\u6574\u5377\u7f13\u5b58\u5f02\u5e38", "error");
        }
        const s = {
            questionList: o,
            pageType: e.question.pageType
        };
        n.setPage("question"), o.length && Answer.syncQuestionList(s), n.app.alert = `\u9898\u5e93\u6536\u5f55\u5b8c\u6210\uff0c\u5171\u7f13\u5b58${o.length}\u9053\u9898\u76ee`, 
        msg(`\u9898\u5e93\u6536\u5f55\u5b8c\u6210\uff0c\u5171\u7f13\u5b58${o.length}\u9053\u9898\u76ee`, "success"), 
        e.next && e.next();
    }, askParser = (e, t) => {
        const n = t.app, a = t.ask;
        a.rule = e, e.minDelay && (a.minDelay = e.minDelay, a.delay < a.minDelay && (a.delay = a.minDelay)), 
        e.tips && (a.tips = e.tips), n.app.showFloat = !n.app.hideFloat, n.setPage("ask"), 
        a.clearQuestion();
        questionParser(e.question, e.questionHook || null).map((e => (e.question = titleClean(e.question), 
        "3" == e.type && (e.options = []), e))).forEach((e => {
            a.addQuestion(e);
        })), a.autoAnswer && a.toggleStart();
    }, questionSaveParser = (e, t) => {
        "function" == typeof e.html && (e.html = e.html());
        return G(e.html).map(((n, a) => {
            const o = removeHtml(G(a).find(e.question).html()), s = G(a).find(e.options).map(((e, t) => removeHtml(G(t).html()))).get(), i = G(a).find(e.type).val(), r = G(a)[0];
            let l = {
                question: titleClean(o ?? ""),
                options: s,
                $options: G(a).find(e.options),
                $answer: G(a).find(e.answer),
                answer: [],
                type: i,
                html: r
            };
            try {
                t && (l = t(l, n));
            } catch (p) {
                console.log("\u6536\u5f55hook\u62a5\u9519", p);
            }
            return null == l || null == l ? null : (l.question && "" != l.question && (l.question = titleClean(l.question)), 
            l.options && l.options.length > 0 && (l.options = removeStartChar(l.options)), {
                question: l.question,
                options: l.options,
                answer: l.answer,
                type: l.type,
                hash: questionHash(l.type, l.question, l.options)
            });
        })).get();
    }, questionParser = (e, t) => {
        "function" == typeof e.html && (e.html = e.html());
        return G(e.html).map(((n, a) => {
            const o = removeHtml(G(a).find(e.question).html()), s = G(a).find(e.options).map(((e, t) => removeHtml(G(t).html()))).get(), i = G(a).find(e.type).val(), r = e.workType, l = G(a)[0];
            let p = {
                question: titleClean(o ?? ""),
                options: s,
                $options: G(a).find(e.options),
                type: i,
                html: l,
                workType: r,
                pageType: e.pageType
            };
            return t && (p = t(p, n)), p;
        })).get();
    };

    class AnonymousIdentityOptimized {
        static generateShortId() {
            return Date.now().toString(36).padStart(8, "0").slice(-8) + Array.from({
                length: 8
            }, (() => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[Math.floor(62 * Math.random())])).join("");
        }
        static validateId(e) {
            return /^[0-9A-Za-z]{16}$/.test(e);
        }
        static getAnonymousId() {
            if (this.cachedAnonymousId) return this.cachedAnonymousId;
            let e = he(this.STORAGE_KEY);
            return e && this.validateId(e) || (e = this.generateShortId(), ge(this.STORAGE_KEY, e)), 
            this.cachedAnonymousId = e, e;
        }
        static getStableCanvasFingerprint() {
            try {
                const e = document.createElement("canvas");
                e.width = 220, e.height = 30;
                const t = e.getContext("2d", {
                    willReadFrequently: !0
                });
                if (!t) return "";
                t.textBaseline = "alphabetic", t.fillStyle = "#000", t.font = "16px Arial", t.fillText("AiAsk,\ud83c\udf10.\ud83d\ude00", 2, 20);
                const n = t.getImageData(0, 0, 220, 30).data;
                let a = 0;
                for (let o = 0; o < n.length; o += 40) a = (a << 5) - a + n[o], a |= 0;
                return a.toString(36);
            } catch (e) {
                return "";
            }
        }
        static getWebGLFingerprint() {
            try {
                const e = document.createElement("canvas"), t = e.getContext("webgl") || e.getContext("experimental-webgl");
                if (!t) return "";
                const n = t.getExtension("WEBGL_debug_renderer_info");
                if (!n) return t.getParameter(t.VERSION) + "|" + t.getParameter(t.VENDOR);
                const a = t.getParameter(n.UNMASKED_VENDOR_WEBGL);
                return a + "|" + t.getParameter(n.UNMASKED_RENDERER_WEBGL);
            } catch (e) {
                return "";
            }
        }
        static getDeviceFingerprint() {
            if (this.cachedFingerprint) return this.cachedFingerprint;
            const e = he(this.FINGERPRINT_KEY);
            if (e && e.version === this.FP_VERSION && e.value) return this.cachedFingerprint = e.value, 
            e.value, e.value;
            const t = [ this.normalizeUserAgent(navigator.userAgent), navigator.language, navigator.platform, screen.colorDepth, screen.pixelDepth || screen.colorDepth, (new Date).getTimezoneOffset(), navigator.hardwareConcurrency || 0, navigator.maxTouchPoints || 0, navigator.deviceMemory || 0, this.getWebGLFingerprint(), this.getStableCanvasFingerprint() ].filter(Boolean).join("|"), n = Ie(t).substring(0, 12);
            return ge(this.FINGERPRINT_KEY, {
                value: n,
                version: this.FP_VERSION,
                createdAt: Date.now()
            }), this.cachedFingerprint = n, n;
        }
        static normalizeUserAgent(e) {
            return e.includes("Chrome") ? "Chrome" : e.includes("Firefox") ? "Firefox" : e.includes("Safari") ? "Safari" : e.includes("Edge") ? "Edge" : e.includes("Opera") ? "Opera" : "Unknown";
        }
        static getIdentity() {
            return {
                anonymous_id: this.getAnonymousId(),
                device_fingerprint: this.getDeviceFingerprint()
            };
        }
        static clear() {
            ge(this.STORAGE_KEY, null), ge(this.FINGERPRINT_KEY, null), this.cachedAnonymousId = null, 
            this.cachedFingerprint = null;
        }
        static regenerateFingerprint() {
            return ge(this.FINGERPRINT_KEY, null), this.cachedFingerprint = null, this.getDeviceFingerprint();
        }
        static getDebugInfo() {
            return {
                anonymous_id: this.getAnonymousId(),
                device_fingerprint: this.getDeviceFingerprint(),
                fingerprint_components: {
                    browser: this.normalizeUserAgent(navigator.userAgent),
                    language: navigator.language,
                    platform: navigator.platform,
                    screen_color: screen.colorDepth,
                    timezone: (new Date).getTimezoneOffset(),
                    hardware: navigator.hardwareConcurrency,
                    webgl: this.getWebGLFingerprint()
                },
                storage: {
                    fp_stored: he(this.FINGERPRINT_KEY),
                    id_stored: he(this.STORAGE_KEY)
                }
            };
        }
        static async testStability(e = 10) {
            const t = [];
            for (let a = 0; a < e; a++) {
                this.cachedFingerprint = null;
                const e = this.getDeviceFingerprint();
                t.push(e), await new Promise((e => setTimeout(e, 100)));
            }
            const n = new Set(t);
            n.size, n.size, Array.from(n), n.size, 1 === n.size || n.size;
        }
    }

    __publicField(AnonymousIdentityOptimized, "STORAGE_KEY", "anonymous_id"), __publicField(AnonymousIdentityOptimized, "FINGERPRINT_KEY", "device_fingerprint"), 
    __publicField(AnonymousIdentityOptimized, "FP_VERSION", "v2"), __publicField(AnonymousIdentityOptimized, "cachedAnonymousId", null), 
    __publicField(AnonymousIdentityOptimized, "cachedFingerprint", null);

    const Et = 864e5, It = [ {
        id: "492563",
        name: "GreasyFork",
        home: "https://greasyfork.org/zh-CN/scripts/492563-%E7%88%B1%E9%97%AE%E7%AD%94%E5%8A%A9%E6%89%8B",
        updateurl: "https://greasyfork.org/zh-CN/scripts/492563.json",
        getdata: e => {
            const t = JSON.parse(e[0].responseText);
            return {
                version: t.version,
                code_updated_at: formatDate(t.code_updated_at)
            };
        }
    }, {
        id: "2384",
        name: "\u811a\u672c\u732b",
        home: "https://scriptcat.org/zh-CN/script-show-page/2384",
        updateurl: "https://scriptcat.org/api/v2/scripts/2384",
        getdata: e => {
            const t = JSON.parse(e[0].responseText);
            return {
                version: t.data.script.version,
                code_updated_at: formatDate(new Date(1e3 * t.data.updatetime).toISOString())
            };
        }
    } ];

    function getAppStore() {
        return xe[$t + "app"];
    }

    function getAskStore() {
        return xe[$t + "ask"];
    }

    function request(e, t, n = void 0, a = void 0, o = 5e3) {
        "GET" === t && n && (e += `?${new URLSearchParams(n).toString()}`), "POST" === t && (a = {
            ...a
        });
        const s = {
            "User-Agent": xe.navigator.userAgent,
            "Content-Type": "application/json",
            referer: location.href,
            ...a
        };
        return new Promise(((a, i) => {
            const r = Date.now();
            ye({
                method: t,
                url: e,
                headers: s,
                data: "GET" !== t ? JSON.stringify(n) : void 0,
                timeout: o,
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

    function requestApi(e, t, n = void 0, a = void 0, o = 5e3) {
        return "GET" === t && n && (e += `?${new URLSearchParams(n).toString()}`), new Promise((async (s, i) => {
            const r = Cache.get("user", {}), l = r && r.user && r.api_key;
            let p;
            if ("POST" === t) {
                if (!l) {
                    const e = AnonymousIdentityOptimized.getIdentity();
                    n = {
                        ...n,
                        anonymous_id: e.anonymous_id,
                        device_fingerprint: e.device_fingerprint
                    };
                }
                const e = get_t(n);
                a = {
                    ...a,
                    aka: e
                }, p = await encrypt(JSON.stringify(n), e);
            } else a = {
                ...a,
                aka: get_t({})
            };
            const c = {
                "User-Agent": xe.navigator.userAgent,
                "Content-Type": "application/json",
                referer: location.href,
                v: Lt.script.version,
                ...a
            };
            if (l) c.Authorization = `Bearer ${r.api_key}`; else {
                const e = AnonymousIdentityOptimized.getIdentity();
                c["X-Anonymous-ID"] = e.anonymous_id, c["X-Device-FP"] = e.device_fingerprint;
            }
            const u = Date.now();
            JSON.stringify(n), ye({
                method: t,
                url: e,
                headers: c,
                data: "GET" !== t ? JSON.stringify({
                    data: p
                }) : void 0,
                timeout: o,
                onload: async function(e) {
                    const t = Date.now() - u;
                    let n = JSON.parse(e.responseText);
                    if (n.encrypted) {
                        n = await decrypt(n.data);
                        const a = {
                            ...e,
                            responseText: n
                        };
                        s([ a, t ]);
                    } else s([ e, t ]);
                },
                ontimeout: () => i(new Error("\u63a5\u53e3\u8bf7\u6c42\u8d85\u65f6")),
                onerror: e => {
                    i(e);
                }
            });
        }));
    }

    const vuePageChange$1 = async () => {
        if (xe.vuePageChangeLock) return;
        xe.vuePageChangeLock = !0;
        const e = getAppStore(), t = getAskStore();
        t.questionInx = 0, e.app.showFloat = !1, e.setPage("home"), t.clearQuestion(), await parseRule(Ht), 
        xe.vuePageChangeLock = !1;
    }, addLog = (e, t = "info") => {
        const n = getAppStore(), a = (new Date).toLocaleString();
        try {
            n.addLog({
                time: a,
                type: t,
                content: e
            });
        } catch (o) {
            console.log(e);
        }
    }, compareVersions = (e, t) => {
        const normalize = e => e.split(".").map(Number), n = normalize(e), a = normalize(t);
        for (let o = 0; o < Math.max(n.length, a.length); o++) {
            const e = n[o] || 0, t = a[o] || 0;
            if (t > e) return !0;
            if (t < e) return !1;
        }
        return !1;
    }, updateFn = async (e = !0) => {
        if (!getAppStore().app.checkUpdate) return;
        const t = Cache.get("lastCheckTime");
        if (e && t && Date.now() - t < Et) {
            new Date(t + Et).toLocaleString();
        } else try {
            const e = await Promise.allSettled(It.map((async e => {
                try {
                    e.name, e.updateurl, addLog(`[${e.name}] \u5f00\u59cb\u68c0\u6d4b\u66f4\u65b0`, "info");
                    const t = await request(e.updateurl, "GET", {}, {}), n = e.getdata(t);
                    return e.name, {
                        script: e,
                        updateInfo: n
                    };
                } catch (t) {
                    throw e.name, String(t), addLog(`[${e.name}] \u66f4\u65b0\u68c0\u6d4b\u5931\u8d25: ${String(t)}`, "error"), 
                    t;
                }
            })));
            Cache.set("lastCheckTime", Date.now());
            const t = e.filter((e => "fulfilled" === e.status));
            e.filter((e => "rejected" === e.status));
            if (0 === t.length) return void msg("\u6240\u6709\u66f4\u65b0\u6e90\u68c0\u6d4b\u5931\u8d25\uff0c\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005\u3002", "error");
            let n = !1, a = !0;
            for (const {value: o} of t) {
                const {script: e, updateInfo: t} = o;
                if (compareVersions(Lt.script.version, t.version)) {
                    msg(`\n          <div style="line-height: 1.5; font-size: 14px;">\n            <p>\u68c0\u6d4b\u5230\u65b0\u7248\u672c\uff1a<span style="color: red; font-weight: bold;">${t.version}</span></p>\n            <p>\u811a\u672c\u6e90\uff1a<strong>${e.name}</strong></p>\n            <p>\u66f4\u65b0\u65f6\u95f4\uff1a<span style="color: #555;">${t.code_updated_at}</span></p>\n            <p><a target="_blank" href="${e.home}" style="color: #007bff; text-decoration: underline;">>> \u70b9\u6211\u5feb\u6377\u8df3\u8f6c\u66f4\u65b0 <<</a></p>\n          </div>`, "warning"), 
                    addLog(`[${e.name}] \u68c0\u6d4b\u5230\u65b0\u7248\u672c\uff1a${t.version}`, "warning"), 
                    n = !0, a = !1;
                } else e.name, t.version, addLog(`[${e.name}] \u5df2\u662f\u6700\u65b0\u7248\uff1a${t.version}`, "info");
            }
            !n && a && (msg("\u5f53\u524d\u5df2\u662f\u6700\u65b0\u7248", "success"), addLog("\u5f53\u524d\u5df2\u662f\u6700\u65b0\u7248", "success"));
        } catch (n) {
            console.error("\u66f4\u65b0\u68c0\u6d4b\u6d41\u7a0b\u5f02\u5e38", n), addLog(`\u66f4\u65b0\u68c0\u6d4b\u5931\u8d25: ${String(n)}`, "error"), 
            msg("\u6240\u6709\u66f4\u65b0\u6e90\u5747\u68c0\u6d4b\u5931\u8d25\uff0c\u8bf7\u5c1d\u8bd5\u5207\u6362\u7f51\u7edc\u6216\u8005\u53cd\u9988\u7ed9\u4f5c\u8005", "error");
        }
    }, ttfDownload1 = async e => new Promise((t => {
        ye({
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
    })), jt = "aah-notice-global-style", zt = `\n#${jt} {}\n#aah-notice-container {\n  position: fixed;\n  top: 20px;\n  right: 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  z-index: 2147483647;\n  pointer-events: none;\n}\n.aah-notice {\n  min-width: 220px;\n  padding: 12px 16px;\n  border-radius: 10px;\n  background: #ffffff;\n  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);\n  color: #1f2937;\n  font-size: 13px;\n  transition: opacity 0.3s ease, transform 0.3s ease;\n}\n.aah-notice-success { border-left: 4px solid #10b981; }\n.aah-notice-error { border-left: 4px solid #ef4444; }\n.aah-notice-warning { border-left: 4px solid #f59e0b; }\n.aah-notice-info { border-left: 4px solid #3b82f6; }\n.aah-notice.hide {\n  opacity: 0;\n  transform: translateY(-6px);\n}`;

    function somd5(e) {
        return Ie(e);
    }

    function removeHtml(e, t = !0) {
        const n = document.createElement("textarea");
        n.innerHTML = e, e = (e = (e = (e = n.value).replace(/[\t\r\xa0]/g, " ")).replace(/[\u2000-\u200a]/g, " ")).replace(/<br\s*\/?>/g, "\n"), 
        t && (e = e.replace(/<(\/)?(p|div).*?>/g, "\n")), e = (e = (e = (e = e.replace(/ {2,}/g, " ")).replace(/\n{2,}/g, "\n")).replace(/<xmp.*?>/g, "<pre>")).replace(/<\/xmp>/g, "</pre>");
        let a = (e = V.sanitize(e, {
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
        return t ? Ot[e] || "8" : Object.keys(Ot).find((t => Ot[t] === e)) || "\u5176\u5b83";
    }

    function typeMatch(e) {
        const t = {
            0: [ "\u5355\u9009", "\u5355\u9879\u9009\u62e9", "A2", "A1" ],
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
            if (!document.getElementById(jt)) {
                const e = document.createElement("style");
                e.id = jt, e.textContent = zt, document.head.appendChild(e);
            }
            const n = "aah-notice-container";
            let a = document.getElementById(n);
            a || (a = document.createElement("div"), a.id = n, document.body.appendChild(a));
            const o = document.createElement("div");
            o.className = `aah-notice aah-notice-${t}`, o.innerHTML = V.sanitize(e), a.appendChild(o), 
            setTimeout((() => {
                o.classList.add("hide"), setTimeout((() => o.remove()), 300);
            }), 2800), addLog(e, t);
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
        let o = Array.from(n);
        a && o.sort();
        let s = `${e}${t}${o.join("")}`;
        s = s.replace(/\s/g, "");
        return Ie(s);
    };

    function get_t(e = {}) {
        const {html: t, ...n} = e || {}, flatten = (e, t = "") => {
            const n = [];
            return Object.keys(e).sort().forEach((a => {
                const o = t ? `${t}.${a}` : a, s = e[a];
                null != s && (Array.isArray(s) && 0 === s.length || ("object" != typeof s || Array.isArray(s) || 0 !== Object.keys(s).length) && (Array.isArray(s) ? s.every((e => "object" != typeof e)) ? n.push(`${o}=${s.sort().join(",")}`) : n.push(`${o}=${JSON.stringify(s)}`) : "object" == typeof s ? n.push(...flatten(s, o)) : n.push(`${o}=${s}`)));
            })), n;
        }, a = flatten(n).join("&");
        return Ie(a);
    }

    async function encrypt(e = "", t = "asdgdfghfghfghfg", n = "1234567890123456") {
        try {
            if (!e) return "";
            if (t = t.substring(0, 16), n = n.substring(0, 16), !window.crypto || !window.crypto.subtle) {
                const a = R.enc.Utf8.parse(t), o = R.enc.Utf8.parse(n);
                return R.AES.encrypt(e, a, {
                    iv: o,
                    mode: R.mode.CBC,
                    padding: R.pad.Pkcs7
                }).toString();
            }
            const o = new TextEncoder, s = o.encode(e), i = o.encode(t), r = o.encode(n), l = await crypto.subtle.importKey("raw", i, {
                name: "AES-CBC"
            }, !1, [ "encrypt" ]), p = await crypto.subtle.encrypt({
                name: "AES-CBC",
                iv: r
            }, l, s), c = new Uint8Array(p), u = 1024;
            let d, h = "";
            for (let e = 0; e < c.length; e += u) {
                const t = c.slice(e, Math.min(e + u, c.length));
                h += String.fromCharCode.apply(null, Array.from(t));
            }
            try {
                d = btoa(h);
            } catch (a) {
                d = h.split("").map((e => ("0" + e.charCodeAt(0).toString(16)).slice(-2))).join("");
            }
            return d;
        } catch (o) {
            return addLog(`\u52a0\u5bc6\u5f02\u5e38: ${o instanceof Error ? o.message : "\u672a\u77e5\u9519\u8bef"}`, "error"), 
            "";
        }
    }

    async function decrypt(e = "", t = "asdgdfghfghfghfg", n = "1234567890123456") {
        try {
            if (!e) return "";
            if (t = t.substring(0, 16), n = n.substring(0, 16), !window.crypto || !window.crypto.subtle) {
                const a = R.enc.Utf8.parse(t), o = R.enc.Utf8.parse(n);
                return R.AES.decrypt(e, a, {
                    iv: o,
                    mode: R.mode.CBC,
                    padding: R.pad.Pkcs7
                }).toString(R.enc.Utf8);
            }
            /^[A-Za-z0-9+/]*={0,2}$/.test(e);
            const o = new TextEncoder, s = o.encode(t), i = o.encode(n);
            let r;
            try {
                r = atob(e);
            } catch (a) {
                throw new Error("Base64 \u89e3\u7801\u5931\u8d25\uff0c\u6570\u636e\u683c\u5f0f\u4e0d\u6b63\u786e");
            }
            const l = new Uint8Array(r.length);
            for (let e = 0; e < r.length; e++) l[e] = r.charCodeAt(e);
            if (l.length % 16 != 0) throw new Error("\u52a0\u5bc6\u6570\u636e\u957f\u5ea6\u4e0d\u6b63\u786e\uff0c\u4e0d\u662f16\u7684\u500d\u6570");
            const p = await crypto.subtle.importKey("raw", s, {
                name: "AES-CBC"
            }, !1, [ "decrypt" ]), c = await crypto.subtle.decrypt({
                name: "AES-CBC",
                iv: i
            }, p, l);
            return new TextDecoder("utf-8", {
                fatal: !0
            }).decode(c);
        } catch (o) {
            return addLog(`\u89e3\u5bc6\u5f02\u5e38: ${o instanceof Error ? o.message : "\u672a\u77e5\u9519\u8bef"}`, "error"), 
            "";
        }
    }

    function simpleMarkdownToHtml(e) {
        if (!e) return "";
        let t = e;
        const n = [], protect = e => {
            const t = `{{{{PLACEHOLDER${n.length}}}}}`;
            return n.push(e), t;
        }, escapeHtml = e => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        return t = t.replace(/```(\w*)\n([\s\S]*?)```/g, ((e, t, n) => protect(`<pre><code class="hljs">${escapeHtml(n.trim())}</code></pre>`))), 
        t = t.replace(/`([^`]+)`/g, ((e, t) => protect(`<code>${escapeHtml(t)}</code>`))), 
        t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, ((e, t, n) => protect(`<a href="${n}" target="_blank" rel="noopener noreferrer">${t}</a>`))), 
        t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"), t = t.replace(/__(.+?)__/g, "<strong>$1</strong>"), 
        t = t.replace(/\*(.+?)\*/g, "<em>$1</em>"), t = t.replace(/_(.+?)_/g, "<em>$1</em>"), 
        t = t.replace(/^### (.+)$/gm, "<h3>$1</h3>"), t = t.replace(/^## (.+)$/gm, "<h2>$1</h2>"), 
        t = t.replace(/^# (.+)$/gm, "<h1>$1</h1>"), t = t.replace(/^\- (.+)$/gm, "<li>$1</li>"), 
        t = t.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>"), t = t.replace(/^\d+\. (.+)$/gm, "<li>$1</li>"), 
        t = t.replace(/\n/g, "<br>"), t = t.replace(/<br><(pre|h1|h2|h3|ul|ol)/g, "<$1"), 
        t = t.replace(/<\/(pre|h1|h2|h3|ul|ol)><br>/g, "</$1>"), t = t.replace(/\{\{\{\{PLACEHOLDER(\d+)\}\}\}\}/g, ((e, t) => n[parseInt(t)])), 
        t;
    }

    function judgeAnswer(e) {
        return isTrue(e) ? [ "\u6b63\u786e" ] : isFalse(e) ? [ "\u9519\u8bef" ] : [];
    }

    function removeStartChar(e) {
        return e.map(((e, t) => {
            let n = String.fromCharCode(65 + t) + " .", a = String.fromCharCode(65 + t) + ".", o = String.fromCharCode(65 + t) + "\u3001", s = String.fromCharCode(65 + t) + "\uff0e", i = String.fromCharCode(65 + t);
            return e.replace(new RegExp(`^${n}|^${a}|^${o}|^${s}|^${i}`), "").trim();
        }));
    }

    function qc(e) {
        G(e).find(".answerBg, .textDIV, .eidtDiv").each((function() {
            (G(this).find(".check_answer").length || G(this).find(".check_answer_dx").length) && G(this).click();
        })), G(e).find(".answerBg, .textDIV, .eidtDiv").find("textarea").each((function() {
            xe.UE.getEditor(G(this).attr("name")).ready((function() {
                this.setContent("");
            }));
        })), G(e).find(":radio, :checkbox").prop("checked", !1), G(e).find("textarea").each((function() {
            xe.UE.getEditor(G(this).attr("name")).ready((function() {
                this.setContent("");
            }));
        }));
    }

    function qc1(e) {
        G(e).find(".before-after,.before-after-checkbox, .textDIV, .eidtDiv").each((function() {
            (G(this).find(".check_answer").length || G(this).find(".check_answer_dx").length) && G(this).click();
        })), G(e).find(".before-after, .textDIV, .eidtDiv").find("textarea").each((function() {
            xe.UE.getEditor(G(this).attr("name")).ready((function() {
                this.setContent("");
            }));
        })), G(e).find(":radio, :checkbox").prop("checked", !1), G(e).find("textarea").each((function() {
            xe.UE.getEditor(G(this).attr("name")).ready((function() {
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
        return G(e).length > 0;
    }

    function getUrl() {
        return location.href;
    }

    function removeOptionsStartChar(e) {
        for (let t = 0; t < e.length; t++) {
            let n = String.fromCharCode(65 + t) + ".", a = String.fromCharCode(65 + t) + "\u3001", o = String.fromCharCode(65 + t) + "\uff0e", s = String.fromCharCode(65 + t);
            const i = new RegExp(`^${n}|^${a}|^${o}|^${s}`);
            if (!e[t].match(i)) return !1;
            e[t] = e[t].replace(i, "").trim();
        }
        return e;
    }

    const formatDate = e => new Date(e).toISOString().replace("T", " ").substring(0, 19);

    const Ot = {
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
    }, $t = function(e) {
        let t = "";
        for (;t.length < e; t += Math.random().toString(36).substr(2)) ;
        return t.substr(0, e);
    }(9) + "_", Lt = me;

    xe.ksv = Ie(Lt.script.author + Lt.script.name.replace(/server:/, "").trim());

    const Pt = {
        debug: !0,
        searchApi: [],
        defaultShowFloat: !1,
        showFloat: !1,
        showBoard: !0,
        checkUpdate: !0,
        hideFloat: !1,
        alert: "\u70b9\u6211\u6709\u60ca\u559c",
        alertBubble: !0,
        iframe: !1,
        key: "",
        gpt: [ {
            name: "GLM",
            desc: "\u667a\u666e\u6e05\u8a004.0",
            api: "http://82.157.105.20:8002/v1/chat/completions",
            key: "",
            msg: "AI\u54cd\u5e94\u5f02\u5e38\uff0c\u53ef\u80fd\u662f\u6ca1\u6709\u83b7\u53d6cookie,\u8bf7\u6309\u4e0b\u65b9\u6b65\u9aa4\u64cd\u4f5c\n1. \u6253\u5f00[\u667a\u666e\u6e05\u8a00](https://chatglm.cn/main/alltoolsdetail)\n2. \u767b\u5f55\u540e\u968f\u4fbf\u53d1\u4e00\u6761\u6d88\u606f\u5373\u53ef\n3. \u8fd4\u56de\u7b54\u9898\u9875\u5237\u65b0\u9875\u9762",
            home: "https://chatglm.cn/main/alltoolsdetail",
            recommend: 3,
            model: "gpt-4o"
        }, {
            name: "spark",
            desc: "\u8baf\u98de\u661f\u706b",
            api: "http://82.157.105.20:8000/v1/chat/completions",
            key: "",
            msg: "AI\u54cd\u5e94\u5f02\u5e38\uff0c\u53ef\u80fd\u662f\u6ca1\u6709\u83b7\u53d6cookie,\u8bf7\u6309\u4e0b\u65b9\u6b65\u9aa4\u64cd\u4f5c\n1. \u6253\u5f00[\u8baf\u98de\u661f\u706b](https://xinghuo.xfyun.cn/desk)\n2. \u767b\u5f55\u540e\u968f\u4fbf\u53d1\u4e00\u6761\u6d88\u606f\u5373\u53ef\n3. \u8fd4\u56de\u7b54\u9898\u9875\u5237\u65b0\u9875\u9762",
            home: "https://xinghuo.xfyun.cn/desk",
            recommend: 5,
            model: "gpt-4o"
        } ],
        gptIndex: 1,
        askGpt: !1,
        hotkey: "Ctrl+Shift+H",
        hotkeyEnabled: !0
    };

    const Ft = function() {
        const e = Cache.get("app") || {}, t = {
            ...Pt
        };
        for (const [n, a] of Object.entries(e)) "gpt" !== n && "alert" !== n && void 0 !== a && (t[n] = a);
        if (e.gpt) {
            const n = new Map;
            e.gpt.forEach((e => {
                n.set(e.name, e.key);
            })), t.gpt = Pt.gpt.map((e => ({
                ...e,
                key: n.get(e.name) || ""
            })));
        }
        return t.alert = Pt.alert, t.gptIndex >= t.gpt.length && (t.gptIndex = 0), t;
    }();

    function getApp() {
        return Cache.get("app") || Pt;
    }

    !function(e) {
        const t = {
            ...Cache.get("app"),
            ...e
        };
        Cache.set("app", t);
    }(Ft);

    const Mt = {
        display: [ {
            type: "switch",
            label: "\u9ed8\u8ba4\u663e\u793a\u60ac\u6d6e",
            name: "defaultShowFloat",
            value: Ft.defaultShowFloat,
            desc: "\u6253\u5f00\u9875\u9762\u65f6\u662f\u5426\u663e\u793a\u60ac\u6d6e\u7a97",
            options: []
        }, {
            type: "switch",
            label: "\u5f3a\u5236\u9690\u85cf",
            name: "hideFloat",
            value: Ft.hideFloat,
            desc: "\u4ec5\u70ed\u952e\u6216\u70b9\u51fb\u53f3\u4e0b\u89d2\u56fe\u7247\u624d\u663e\u793a\u60ac\u6d6e\u7a97",
            options: []
        }, {
            type: "switch",
            label: "\u6c14\u6ce1\u63d0\u793a",
            name: "alertBubble",
            value: Ft.alertBubble,
            desc: "\u53f3\u4e0b\u89d2\u6c14\u6ce1\u63d0\u793a\u662f\u5426\u5f00\u542f",
            options: []
        } ],
        system: [ {
            type: "switch",
            label: "\u68c0\u6d4b\u66f4\u65b0",
            name: "checkUpdate",
            value: Ft.checkUpdate,
            desc: "\u6253\u5f00\u9875\u9762\u65f6\u662f\u5426\u68c0\u6d4b\u66f4\u65b0",
            options: []
        }, {
            type: "switch",
            label: "iframe\u4f18\u5316(\u6d4b\u8bd5)",
            name: "iframe",
            value: Ft.iframe,
            desc: "\u9488\u5bf9\u6df1\u5ea6\u5d4c\u5957\u7f51\u9875\u7684\u4f18\u5316\uff0c\u9002\u5408\u5355\u4efb\u52a1\u9875\u4f7f\u7528\uff0c\u591a\u4efb\u52a1\u53ef\u80fd\u4f1a\u5bfc\u81f4\u5f39\u7a97\u8fc7\u591a\u3002\n \u6ce8\u610f\uff1a\u8be5\u529f\u80fd\u4e3a\u6d4b\u8bd5\u529f\u80fd\uff0c\u53ef\u80fd\u5b58\u5728\u672a\u77e5\u95ee\u9898\uff0c\u8bf7\u8c28\u614e\u4f7f\u7528",
            options: []
        } ],
        ai: [ {
            type: "select",
            label: "AI\u6a21\u578b\u9009\u62e9",
            name: "gptIndex",
            value: Ft.gptIndex,
            desc: "\u9009\u62e9AI\u6a21\u578b",
            options: Ft.gpt.map(((e, t) => ({
                label: e.desc,
                value: t
            })))
        }, {
            type: "switch",
            label: "AI\u8f85\u52a9\u7b54\u9898",
            name: "askGpt",
            value: Ft.askGpt,
            desc: "\u5f53\u6240\u6709\u9898\u5e93\u5747\u65e0\u7b54\u6848\u65f6\uff0c\u5c06\u4f7f\u7528AI\u8f85\u52a9\u81ea\u52a8\u7b54\u9898\uff0c\u6b63\u786e\u7387\u65e0\u6cd5\u4fdd\u8bc1\uff0c\u8c28\u614e\u4f7f\u7528",
            options: []
        } ],
        hotkey: [ {
            type: "switch",
            label: "\u542f\u7528\u5feb\u6377\u952e",
            name: "hotkeyEnabled",
            value: Ft.hotkeyEnabled,
            desc: "\u662f\u5426\u542f\u7528\u5feb\u6377\u952e\u663e\u9690\u60ac\u6d6e\u7a97",
            options: []
        }, {
            type: "hotkey",
            label: "\u5feb\u6377\u952e\u8bbe\u7f6e",
            name: "hotkey",
            value: Ft.hotkey,
            desc: "\u70b9\u51fb\u8f93\u5165\u6846\u540e\u6309\u4e0b\u60f3\u8981\u8bbe\u7f6e\u7684\u5feb\u6377\u952e\u7ec4\u5408\uff08\u652f\u6301Ctrl\u3001Shift\u3001Alt\u7ec4\u5408\u952e\uff09",
            options: []
        } ]
    }, Nt = defineStore("app", {
        state: () => ({
            app: Ft,
            script: Lt.script,
            page: "home",
            ConfigInput: Mt,
            logs: [ {
                time: (new Date).toLocaleString(),
                type: "success",
                content: "\u521d\u59cb\u5316\u65e5\u5fd7\u6210\u529f"
            } ]
        }),
        actions: {
            setConfig(e) {
                this.app = {
                    ...this.app,
                    ...e
                }, Cache.set("app", this.app);
            },
            setPage(e) {
                this.page = e;
            },
            addLog(e) {
                this.logs.length > 100 && this.logs.shift(), this.logs.push(e);
            }
        }
    }), Dt = Cache.get("apiList", []), Bt = [ {
        name: "\u4e00\u4e4b\u9898\u5e93",
        url: "http://cx.icodef.com/wyn-nb?v=4",
        method: "POST",
        type: "json",
        headers: {},
        params: [],
        data: {
            question: "$question",
            options: "$options",
            type: "$type"
        },
        response: {
            type: "field",
            value: "data"
        },
        weight: 0
    } ], Vt = defineStore("api", {
        state: () => ({
            apiList: Dt,
            defApiList: Bt
        }),
        actions: {},
        getters: {
            getApiList() {
                return this.apiList.forEach(((e, t) => {
                    e.name === this.defApiList[t].name && (this.defApiList[t] = e);
                })), this.apiList.concat(this.defApiList);
            }
        }
    }), markToHtml = e => simpleMarkdownToHtml(e), Gt = {
        0: '\u4f60\u53ea\u4f5c\u4e3a\u201cJSON \u8f93\u51fa\u673a\u5668\u201d\u5de5\u4f5c\uff0c\u56de\u7b54\u65f6\u4ec5\u8f93\u51fa\u4e00\u884c JSON\uff0c\u7981\u6b62\u51fa\u73b0\u9664 JSON \u4ee5\u5916\u7684\u4efb\u4f55\u7b26\u53f7\u3001\u8bf4\u660e\u6216\u7a7a\u884c\u3002\n\n\u3010\u9898\u578b\u3011\u5355\u9009\u9898\n\n\u3010\u552f\u4e00\u5141\u8bb8\u7684\u8f93\u51fa\u683c\u5f0f\u3011\n{"answer":["\u9009\u9879\u5b57\u6bcd"]}\n\n\u3010\u5f3a\u5236\u89c4\u5219\u3011\n1. \u4ec5\u5141\u8bb8\u4e0a\u8ff0 JSON \u7ed3\u6784\uff0c\u4e0d\u80fd\u6dfb\u52a0\u952e\u3001\u6ce8\u91ca\u6216\u4efb\u4f55\u989d\u5916\u5b57\u6bb5\u3002\n2. \u9009\u9879\u5b57\u6bcd\u5fc5\u987b\u5927\u5199\uff08A\u3001B\u3001C\u3001D\u2026\uff09\uff0c\u6570\u7ec4\u4e2d\u53ea\u80fd\u6709 1 \u4e2a\u5143\u7d20\u3002\n3. \u4e0d\u591f\u786e\u5b9a\uff08\u7f6e\u4fe1\u5ea6 <60%\uff09\u65f6\u8fd4\u56de\u7a7a\u6570\u7ec4\uff1a{"answer":[]}\n4. \u7981\u6b62\u51fa\u73b0\u53cd\u5f15\u53f7\u3001\u4ee3\u7801\u5757\u3001\u8bf4\u660e\u6587\u5b57\u3001\u7a7a\u683c\u6216\u6362\u884c\u3002\n\n\u3010\u8f93\u51fa\u793a\u4f8b\u3011\n\u6b63\u786e\u793a\u4f8b1\uff1a{"answer":["B"]}\n\u6b63\u786e\u793a\u4f8b2\uff1a{"answer":[]}\n\u9519\u8bef\u793a\u4f8b\uff1a```json{"answer":["B"]}```\uff08\u542b\u4ee3\u7801\u5757\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a\u7b54\u6848\u662fB\u6240\u4ee5{"answer":["B"]}\uff08\u542b\u89e3\u91ca\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a{"answer":["b"]}\uff08\u5c0f\u5199\u5b57\u6bcd\uff09\n\n\u3010\u6700\u540e\u8b66\u544a\u3011\u8f93\u51fa\u4f1a\u88ab JSON.parse \u76f4\u63a5\u89e3\u6790\uff0c\u51fa\u73b0\u4efb\u4f55\u975e JSON \u5185\u5bb9\u89c6\u4e3a\u5931\u8d25\u3002',
        1: '\u4f60\u53ea\u4f5c\u4e3a\u201cJSON \u8f93\u51fa\u673a\u5668\u201d\u5de5\u4f5c\uff0c\u56de\u7b54\u65f6\u4ec5\u8f93\u51fa\u4e00\u884c JSON\uff0c\u7981\u6b62\u51fa\u73b0\u9664 JSON \u4ee5\u5916\u7684\u4efb\u4f55\u7b26\u53f7\u3001\u8bf4\u660e\u6216\u7a7a\u884c\u3002\n\n\u3010\u9898\u578b\u3011\u591a\u9009\u9898\n\n\u3010\u552f\u4e00\u5141\u8bb8\u7684\u8f93\u51fa\u683c\u5f0f\u3011\n{"answer":["\u9009\u9879\u5b57\u6bcd"]}\n\n\u3010\u5f3a\u5236\u89c4\u5219\u3011\n1. \u4ec5\u5141\u8bb8\u4e0a\u8ff0 JSON \u7ed3\u6784\uff0c\u4e0d\u80fd\u6dfb\u52a0\u5176\u4ed6\u952e\u6216\u8bf4\u660e\u3002\n2. \u9009\u9879\u5b57\u6bcd\u5fc5\u987b\u5927\u5199\uff0c\u5e76\u6309\u5b57\u6bcd\u5347\u5e8f\u6392\u5e8f\u3002\n3. \u81f3\u5c11\u4e24\u4e2a\u9009\u9879\u624d\u7b97\u6709\u6548\uff0c\u5426\u5219\u8f93\u51fa\u7a7a\u6570\u7ec4\u3002\n4. \u4e0d\u591f\u786e\u5b9a\uff08\u7f6e\u4fe1\u5ea6 <60%\uff09\u65f6\u8fd4\u56de\u7a7a\u6570\u7ec4\uff1a{"answer":[]}\n5. \u7981\u6b62\u53cd\u5f15\u53f7\u3001\u4ee3\u7801\u5757\u3001\u524d\u540e\u6ce8\u91ca\u6216\u89e3\u91ca\u3002\n\n\u3010\u8f93\u51fa\u793a\u4f8b\u3011\n\u6b63\u786e\u793a\u4f8b1\uff1a{"answer":["A","C","D"]}\n\u6b63\u786e\u793a\u4f8b2\uff1a{"answer":["B","D"]}\n\u6b63\u786e\u793a\u4f8b3\uff1a{"answer":[]}\n\u9519\u8bef\u793a\u4f8b\uff1a```json{"answer":["A","C"]}```\uff08\u542b\u4ee3\u7801\u5757\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a\u7b54\u6848\u662fACD\uff0c{"answer":["A","C","D"]}\uff08\u542b\u89e3\u91ca\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a{"answer":["C","A"]}\uff08\u672a\u6392\u5e8f\uff09\n\n\u3010\u6700\u540e\u8b66\u544a\u3011\u8f93\u51fa\u4f1a\u88ab JSON.parse \u76f4\u63a5\u89e3\u6790\uff0c\u51fa\u73b0\u4efb\u4f55\u975e JSON \u5185\u5bb9\u89c6\u4e3a\u5931\u8d25\u3002',
        2: '\u4f60\u53ea\u4f5c\u4e3a\u201cJSON \u8f93\u51fa\u673a\u5668\u201d\u5de5\u4f5c\uff0c\u56de\u7b54\u65f6\u4ec5\u8f93\u51fa\u4e00\u884c JSON\uff0c\u7981\u6b62\u51fa\u73b0\u9664 JSON \u4ee5\u5916\u7684\u4efb\u4f55\u7b26\u53f7\u3001\u8bf4\u660e\u6216\u7a7a\u884c\u3002\n\n\u3010\u9898\u578b\u3011\u586b\u7a7a\u9898\n\n\u3010\u552f\u4e00\u5141\u8bb8\u7684\u8f93\u51fa\u683c\u5f0f\u3011\n{"answer":["\u7b54\u68481","\u7b54\u68482"]}\n\n\u3010\u5f3a\u5236\u89c4\u5219\u3011\n1. \u6570\u7ec4\u957f\u5ea6\u5fc5\u987b\u7b49\u4e8e\u9898\u76ee\u7a7a\u683c\u6570\uff0c\u4e0d\u5f97\u7f3a\u5931\u6216\u591a\u586b\u3002\n2. \u6bcf\u4e2a\u7b54\u6848\u4e0d\u8d85\u8fc7 15 \u5b57\uff0c\u4fdd\u6301\u6570\u5b57/\u5355\u4f4d/\u4e13\u4e1a\u8bcd\u7684\u539f\u6837\u3002\n3. \u4e0d\u591f\u786e\u5b9a\u65f6\u8fd4\u56de\u7a7a\u6570\u7ec4\uff1a{"answer":[]}\n4. \u7981\u6b62\u53cd\u5f15\u53f7\u3001\u4ee3\u7801\u5757\u3001\u89e3\u91ca\u3001\u7a7a\u767d\u884c\u6216\u989d\u5916\u5b57\u6bb5\u3002\n\n\u3010\u8f93\u51fa\u793a\u4f8b\u3011\n\u9898\u76ee\u67092\u4e2a\u7a7a\uff0c\u6b63\u786e\u793a\u4f8b1\uff1a{"answer":["\u5149\u5408\u4f5c\u7528","\u53f6\u7eff\u4f53"]}\n\u9898\u76ee\u67091\u4e2a\u7a7a\uff0c\u6b63\u786e\u793a\u4f8b2\uff1a{"answer":["DNA"]}\n\u4e0d\u786e\u5b9a\u65f6\uff0c\u6b63\u786e\u793a\u4f8b3\uff1a{"answer":[]}\n\u9519\u8bef\u793a\u4f8b\uff1a```json{"answer":["\u5149\u5408\u4f5c\u7528"]}```\uff08\u542b\u4ee3\u7801\u5757\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a\u7b2c\u4e00\u4e2a\u7a7a\u662f"\u5149\u5408\u4f5c\u7528"\uff0c\u7b2c\u4e8c\u4e2a\u7a7a\u662f"\u53f6\u7eff\u4f53"\uff08\u542b\u89e3\u91ca\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a{"answer":["\u5149\u5408\u4f5c\u7528"]}\uff08\u7a7a\u683c\u6570\u4e0d\u5339\u914d\uff09\n\n\u3010\u6700\u540e\u8b66\u544a\u3011\u8f93\u51fa\u4f1a\u88ab JSON.parse \u76f4\u63a5\u89e3\u6790\uff0c\u51fa\u73b0\u4efb\u4f55\u975e JSON \u5185\u5bb9\u89c6\u4e3a\u5931\u8d25\u3002',
        3: '\u4f60\u53ea\u4f5c\u4e3a\u201cJSON \u8f93\u51fa\u673a\u5668\u201d\u5de5\u4f5c\uff0c\u56de\u7b54\u65f6\u4ec5\u8f93\u51fa\u4e00\u884c JSON\uff0c\u7981\u6b62\u51fa\u73b0\u9664 JSON \u4ee5\u5916\u7684\u4efb\u4f55\u7b26\u53f7\u3001\u8bf4\u660e\u6216\u7a7a\u884c\u3002\n\n\u3010\u9898\u578b\u3011\u5224\u65ad\u9898\n\n\u3010\u552f\u4e00\u5141\u8bb8\u7684\u8f93\u51fa\u683c\u5f0f\u3011\n{"answer":"\u6b63\u786e"}\n\u6216\n{"answer":"\u9519\u8bef"}\n\n\u3010\u5f3a\u5236\u89c4\u5219\u3011\n1. answer \u53ea\u80fd\u662f\u201c\u6b63\u786e\u201d\u6216\u201c\u9519\u8bef\u201d\uff0c\u4e0d\u5f97\u4f7f\u7528\u201c\u5bf9/\u9519/\u221a/true\u201d\u7b49\u5176\u4ed6\u8868\u8ff0\u3002\n2. \u4e0d\u786e\u5b9a\u65f6\u8f93\u51fa\u7a7a\u5b57\u7b26\u4e32\uff1a{"answer":""}\n3. \u7981\u6b62\u53cd\u5f15\u53f7\u3001\u4ee3\u7801\u5757\u3001\u4f9d\u636e\u8bf4\u660e\u6216\u7a7a\u767d\u884c\u3002\n\n\u3010\u8f93\u51fa\u793a\u4f8b\u3011\n\u6b63\u786e\u793a\u4f8b1\uff1a{"answer":"\u6b63\u786e"}\n\u6b63\u786e\u793a\u4f8b2\uff1a{"answer":"\u9519\u8bef"}\n\u6b63\u786e\u793a\u4f8b3\uff1a{"answer":""}\n\u9519\u8bef\u793a\u4f8b\uff1a```json{"answer":"\u6b63\u786e"}```\uff08\u542b\u4ee3\u7801\u5757\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a\u8fd9\u9053\u9898\u662f\u6b63\u786e\u7684\uff0c{"answer":"\u6b63\u786e"}\uff08\u542b\u89e3\u91ca\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a{"answer":"\u5bf9"}\uff08\u8868\u8ff0\u9519\u8bef\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a{"answer":"true"}\uff08\u8868\u8ff0\u9519\u8bef\uff09\n\n\u3010\u6700\u540e\u8b66\u544a\u3011\u8f93\u51fa\u4f1a\u88ab JSON.parse \u76f4\u63a5\u89e3\u6790\uff0c\u51fa\u73b0\u4efb\u4f55\u975e JSON \u5185\u5bb9\u89c6\u4e3a\u5931\u8d25\u3002',
        4: '\u4f60\u53ea\u4f5c\u4e3a\u201cJSON \u8f93\u51fa\u673a\u5668\u201d\u5de5\u4f5c\uff0c\u56de\u7b54\u65f6\u4ec5\u8f93\u51fa\u4e00\u884c JSON\uff0c\u7981\u6b62\u51fa\u73b0\u9664 JSON \u4ee5\u5916\u7684\u4efb\u4f55\u7b26\u53f7\u3001\u8bf4\u660e\u6216\u7a7a\u884c\u3002\n\n\u3010\u9898\u578b\u3011\u7b80\u7b54\u9898\n\n\u3010\u552f\u4e00\u5141\u8bb8\u7684\u8f93\u51fa\u683c\u5f0f\u3011\n{"answer":"\u7cbe\u7b80\u7684\u7b54\u6848"}\n\n\u3010\u5f3a\u5236\u89c4\u5219\u3011\n1. \u7b54\u6848\u957f\u5ea6\u4e0d\u8d85\u8fc7 30 \u4e2a\u5b57\u7b26\uff0c\u76f4\u63a5\u7ed9\u51fa\u7ed3\u8bba\uff0c\u4e0d\u8981\u8d58\u8ff0\u3002\n2. \u4f18\u5148\u6cbf\u7528\u9898\u5e72\u4e2d\u7684\u4e13\u4e1a\u672f\u8bed\uff0c\u907f\u514d\u6bd4\u55bb\u6216\u4fee\u8f9e\u3002\n3. \u4e0d\u786e\u5b9a\u65f6\u8f93\u51fa\u7a7a\u5b57\u7b26\u4e32\uff1a{"answer":""}\n4. \u7981\u6b62\u6807\u70b9\uff08\u53e5\u53f7\u3001\u9017\u53f7\u7b49\uff09\uff0c\u7981\u6b62\u53cd\u5f15\u53f7\u3001\u4ee3\u7801\u5757\u6216\u89e3\u91ca\u6027\u6587\u5b57\u3002\n\n\u3010\u8f93\u51fa\u793a\u4f8b\u3011\n\u6b63\u786e\u793a\u4f8b1\uff1a{"answer":"\u5149\u5408\u4f5c\u7528\u5c06\u5149\u80fd\u8f6c\u5316\u4e3a\u5316\u5b66\u80fd"}\n\u6b63\u786e\u793a\u4f8b2\uff1a{"answer":"\u91cf\u5b50\u7ea0\u7f20"}\n\u6b63\u786e\u793a\u4f8b3\uff1a{"answer":""}\n\u9519\u8bef\u793a\u4f8b\uff1a```json{"answer":"\u5149\u5408\u4f5c\u7528"}```\uff08\u542b\u4ee3\u7801\u5757\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a\u7b54\u6848\u662f\u5149\u5408\u4f5c\u7528\uff0c\u89e3\u6790\uff1a...\uff08\u542b\u89e3\u91ca\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a{"answer":"\u5149\u5408\u4f5c\u7528\u3002"}\uff08\u5e26\u6807\u70b9\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a{"answer":"\u8fd9\u4e2a\u95ee\u9898\u6d89\u53ca\u7684\u662f\u5149\u5408\u4f5c\u7528\u7684\u76f8\u5173\u77e5\u8bc6\u70b9"}\uff08\u8fc7\u957f\uff09\n\n\u3010\u6700\u540e\u8b66\u544a\u3011\u8f93\u51fa\u4f1a\u88ab JSON.parse \u76f4\u63a5\u89e3\u6790\uff0c\u51fa\u73b0\u4efb\u4f55\u975e JSON \u5185\u5bb9\u89c6\u4e3a\u5931\u8d25\u3002'
    }, aiAsk = async (e, t, n, a = '\u4f60\u53ea\u4f5c\u4e3a\u201cJSON \u8f93\u51fa\u673a\u5668\u201d\u5de5\u4f5c\uff0c\u56de\u7b54\u65f6\u4ec5\u8f93\u51fa\u4e00\u884c JSON\uff0c\u7981\u6b62\u51fa\u73b0\u9664 JSON \u4ee5\u5916\u7684\u4efb\u4f55\u7b26\u53f7\u3001\u8bf4\u660e\u6216\u7a7a\u884c\u3002\n\n\u3010\u552f\u4e00\u5141\u8bb8\u7684\u8f93\u51fa\u683c\u5f0f\u3011\n{"answer":"\u7cbe\u7b80\u7684\u7b54\u6848"}\n\n\u3010\u5f3a\u5236\u89c4\u5219\u3011\n1. \u4ec5\u5141\u8bb8\u4e0a\u8ff0 JSON \u7ed3\u6784\uff0c\u4e0d\u5f97\u6dfb\u52a0\u952e\u6216\u4efb\u4f55\u9644\u52a0\u4fe1\u606f\u3002\n2. \u7b54\u6848\u957f\u5ea6\u4e0d\u8d85\u8fc7 50 \u4e2a\u5b57\u7b26\uff0c\u76f4\u63a5\u7ed9\u6838\u5fc3\u7ed3\u8bba\uff0c\u4e0d\u8981\u94fa\u57ab\u3002\n3. \u4f18\u5148\u4f7f\u7528\u9898\u5e72\u4e2d\u7684\u4e13\u4e1a\u672f\u8bed\uff0c\u7981\u6b62\u6bd4\u55bb\u3001\u4fee\u8f9e\u6216\u53e3\u8bed\u5316\u8868\u8fbe\u3002\n4. \u4e0d\u786e\u5b9a\u65f6\u8f93\u51fa\u7a7a\u5b57\u7b26\u4e32\uff1a{"answer":""}\n5. \u7981\u6b62\u53cd\u5f15\u53f7\u3001\u4ee3\u7801\u5757\u3001\u8bf4\u660e\u6587\u5b57\u3001\u7a7a\u767d\u884c\u6216\u5176\u4ed6\u7b26\u53f7\u3002\n\n\u3010\u8f93\u51fa\u793a\u4f8b\u3011\n\u6b63\u786e\u793a\u4f8b1\uff1a{"answer":"\u901a\u8fc7\u589e\u52a0\u9176\u6d53\u5ea6\u548c\u63d0\u9ad8\u53cd\u5e94\u6e29\u5ea6\u6765\u52a0\u901f\u5316\u5b66\u53cd\u5e94"}\n\u6b63\u786e\u793a\u4f8b2\uff1a{"answer":"\u91cf\u5b50\u7ea0\u7f20\u73b0\u8c61\u7684\u975e\u5c40\u57df\u6027\u7279\u5f81"}\n\u6b63\u786e\u793a\u4f8b3\uff1a{"answer":""}\n\u9519\u8bef\u793a\u4f8b\uff1a```json{"answer":"\u7b54\u6848\u5185\u5bb9"}```\uff08\u542b\u4ee3\u7801\u5757\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a\u8fd9\u4e2a\u95ee\u9898\u7684\u7b54\u6848\u662f...\u6240\u4ee5{"answer":"..."}\uff08\u542b\u89e3\u91ca\uff09\n\u9519\u8bef\u793a\u4f8b\uff1a{"answer":"\u8fd9\u5c31\u50cf...\uff08\u4f7f\u7528\u6bd4\u55bb\uff09"}\uff08\u542b\u6bd4\u55bb\uff09\n\n\u3010\u6700\u540e\u8b66\u544a\u3011\u8f93\u51fa\u4f1a\u88ab JSON.parse \u76f4\u63a5\u89e3\u6790\uff0c\u51fa\u73b0\u4efb\u4f55\u975e JSON \u5185\u5bb9\u89c6\u4e3a\u5931\u8d25\u3002') => {
        const o = getApp(), s = o.gpt[o.gptIndex];
        if (!s.key) return t(`${s.msg}`), Promise.resolve("\u6682\u65e0KEY");
        const i = JSON.stringify({
            model: s.model,
            messages: [ {
                role: "system",
                content: a
            }, {
                role: "user",
                content: e
            } ],
            stream: !0
        });
        return new Promise(((e, a) => {
            ye({
                method: "POST",
                url: s.api,
                data: i,
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${s.key}`,
                    "Content-Type": "application/json"
                },
                responseType: "stream",
                onloadstart: async o => {
                    try {
                        const a = o.response.getReader(), s = new TextDecoder;
                        let i = "";
                        const processStream = async () => {
                            for (;;) {
                                const {done: o, value: r} = await a.read(), l = [ ...s.decode(r).matchAll(/data:\s*({.*?})\s*\n/g) ].map((e => {
                                    try {
                                        return JSON.parse(e[1]);
                                    } catch {
                                        return null;
                                    }
                                })).filter(Boolean) || [];
                                if (l.some((e => {
                                    var t;
                                    return null == (t = e.choices) ? void 0 : t.some((e => "stop" === e.finish_reason));
                                })) || o) return n(), e(i);
                                l.flatMap((e => {
                                    var t;
                                    return (null == (t = e.choices) ? void 0 : t.map((e => e.delta.content)).filter(Boolean)) || [];
                                })).forEach((e => {
                                    i += e, t(e);
                                }));
                            }
                        };
                        await processStream();
                    } catch (s) {
                        console.error("Error reading stream:", s), n(), a(s);
                    }
                }
            });
        }));
    }, Rt = defineStore("ask", {
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
            aiLoadingIndex: -1,
            tips: "\u672c\u811a\u672c\u4ec5\u4f9b\u5b66\u4e60\u7814\u7a76\uff0c\u8bf7\u52ff\u7528\u4e8e\u975e\u6cd5\u7528\u9014",
            delay: Cache.get("delay", 1e3),
            minDelay: Cache.get("minDelay", 0),
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
                this.rule.toquestion && this.rule.toquestion(e);
                try {
                    if (t.html.scrollIntoView({
                        block: "center"
                    }), xe.self !== xe.top) {
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
                } catch (n) {}
            },
            setQuestionStatus(e, t) {
                this.questionList[e] && null != this.questionList[e].status && (this.questionList[e].status = t);
            },
            async toggleStart() {
                var e;
                const t = getAppStore();
                if (!this.lock && (this.start = !this.start, this.start)) {
                    this.lock = !0;
                    for (let n = this.questionInx; n < this.questionList.length && this.start; n++) {
                        if (this.skipFinish && 1 === this.questionList[n].status) continue;
                        this.questionInx = n, "8" !== this.questionList[n].type ? ((null == (e = this.rule) ? void 0 : e.answerDelay) && await sleep(this.rule.answerDelay), 
                        await this.reAnswer(n), t.app.alert = `\u5f53\u524d\u8fdb\u5ea6:${n + 1}/${this.questionList.length}`, 
                        await sleep(this.delay + 1e3 * Math.random()), this.rule.toquestion && this.rule.toquestion(this.questionInx + 1), 
                        this.autoNext && this.rule.next && this.rule.next()) : this.setQuestionStatus(n, 2);
                    }
                    this.autoNext && this.rule.finish && this.rule.finish({
                        question: this.questionList
                    }), this.start = !1, this.lock = !1, this.formMap = {}, this.questionList.forEach((e => {
                        var n;
                        if (null == (n = e.form) ? void 0 : n.form) {
                            let t = e.form.form;
                            t && (this.formMap[t] = this.formMap[t] ? this.formMap[t] + 1 : 1);
                        } else this.formMap["\u65e0\u7b54\u6848"] = this.formMap["\u65e0\u7b54\u6848"] ? this.formMap["\u65e0\u7b54\u6848"] + 1 : 1;
                        t.app.alert = "\u7b54\u9898\u5b8c\u6210~";
                    }));
                }
            },
            async reAnswer(e) {
                const t = getAppStore();
                let n = this.questionList[e], a = [];
                this.loading = !0, this.loadingText = "\u52a0\u8f7d\u4e2d....";
                let o = await Answer.getCacheAnswer(n), s = ApiAnswerMatch([ o ], n);
                if (!s.haveAnswer && (this.loadingText = "\u6b63\u5728\u4ece\u63a5\u53e3\u4e2d\u83b7\u53d6\u7b54\u6848", 
                o = await Answer.getAnswersFree(n), s = ApiAnswerMatch(o, n), a = o, !s.haveAnswer && t.app.askGpt)) {
                    this.loadingText = "\u6b63\u5728\u4eceAI\u4e2d\u83b7\u53d6\u7b54\u6848";
                    let e = this.buildAIQuestionText(n);
                    if (!e.includes("<img")) {
                        const i = await this.fetchAIAnswer(e, n.type, t);
                        o = i.res, s = i.matchResult, a.push(o);
                    }
                }
                n.answer = a, n.form = s.form, s.haveAnswer ? this.setQuestionStatus(e, 1) : (this.randomAnswer && ((e, t) => {
                    const n = getAskStore();
                    let a = !0, o = t.type, s = t.html, i = [ "", [], t, n.rule ];
                    switch (o) {
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
                        type: o,
                        answer: i[1],
                        html: t.html,
                        ques: t
                    }), n.rule.setAnswer && "function" == typeof n.rule.setAnswer && (a = n.rule.setAnswer({
                        type: o,
                        answer: i[1],
                        html: s,
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
                let a = Date.now(), o = {}, s = {};
                try {
                    let r = await aiAsk(e, (e => {}), (() => {}), (e => Gt[e] || Gt[4])(t));
                    r = r.replace("```json", "").replace("```", "").trim();
                    try {
                        o = JSON.parse(r);
                    } catch (i) {
                        o = {
                            answer: r,
                            msg: "",
                            form: "",
                            duration: 5e3
                        };
                    }
                    o.form = n.app.gpt[n.app.gptIndex].desc, o.duration = Date.now() - a, o.answer || (o.msg = "AI\u8bf4\u4ed6\u4e0d\u4f1a"), 
                    s = ApiAnswerMatch([ o ], this.questionList[this.questionInx], !0);
                } catch (r) {
                    o = {
                        answer: "",
                        msg: markToHtml(n.app.gpt[n.app.gptIndex].msg),
                        form: n.app.gpt[n.app.gptIndex].desc,
                        duration: 5e3
                    };
                }
                return {
                    res: o,
                    matchResult: s
                };
            },
            aiAnswer(e) {
                let t = this.questionList[e];
                this.loadingText = "AI\u601d\u8003\u4e2d.....", this.loading = !0, this.aiLoadingIndex = e;
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
                    this.loading = !1, this.aiLoadingIndex = -1, t.aiMsg.length <= 0 && (t.aiMsg = "AI\u54cd\u5e94\u5f02\u5e38\uff0c\u53ef\u80fd\u662f\u6ca1\u6709\u83b7\u53d6KEY,\u8bf7\u6309\u4e0b\u65b9\u6b65\u9aa4\u64cd\u4f5c  \n            1. \u6253\u5f00[\u667a\u666e\u6e05\u8a00](https://chatglm.cn/main/alltoolsdetail)  \n            2. \u767b\u5f55\u540e\u968f\u4fbf\u53d1\u4e00\u6761\u6d88\u606f\u5373\u53ef  \n            3. \u8fd4\u56de\u7b54\u9898\u9875\u5237\u65b0\u9875\u9762  ");
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
            },
            tipsMd() {
                const e = this.rule;
                if (!e) return '<span style="color:red">\u8be5\u9875\u9762\u6682\u65e0\u89c4\u5219</span>';
                const t = [];
                return t.push(`<span style="color:blue">${e.name}</span><span style="color:red">${e.tips || "\u6709\u95ee\u9898\u53ef\u4ee5\u53cd\u9988\u7ed9\u4f5c\u8005"}</span>`), 
                t.join("<br />");
            },
            typesMd() {
                const e = this.rule;
                if (!e || !e.types) return '<span style="color:red">\u8be5\u9875\u9762\u6682\u65e0\u89c4\u5219</span>';
                const t = e.types, n = [];
                for (const a in t) {
                    const e = t[a];
                    n.push(`<span style="color:blue">${typeConvert(e, !1)}&nbsp;\u2705</span>`);
                }
                return n.push('<span style="color:red">\u4e0d\u652f\u6301\u7684\u9898\u578b\u53ef\u4ee5\u53cd\u9988\u7ed9\u4f5c\u8005\u517c\u5bb9</span>'), 
                n.join("<br />");
            }
        }
    }), Jt = Cache.get("user", {}), Qt = defineStore("user", {
        state: () => ({
            user: Jt.user || null,
            notice: "",
            apiKey: Jt.api_key || "",
            stats: {
                course_count: 0,
                chapter_count: 0,
                question_count: 0
            },
            afdianUrl: Jt.afdian_url || "",
            isLoggedIn: !!Jt.user,
            loginTime: Jt.login_time || 0
        }),
        getters: {
            username: e => {
                var t;
                return (null == (t = e.user) ? void 0 : t.username) || "\u672a\u767b\u5f55";
            },
            nickname: e => {
                var t;
                return (null == (t = e.user) ? void 0 : t.nickname) || "\u6e38\u5ba2";
            },
            avatar: () => "",
            score: e => {
                var t;
                return (null == (t = e.user) ? void 0 : t.score) || 0;
            },
            level: e => {
                var t;
                return (null == (t = e.user) ? void 0 : t.level) || 0;
            },
            isVip: e => {
                var t;
                return ((null == (t = e.user) ? void 0 : t.level) || 0) > 0;
            }
        },
        actions: {
            async loginByPassword(e, t) {
                try {
                    const n = "https://www.aiask.site/v1/user/login", [a] = await requestApi(n, "POST", {
                        username: e,
                        password: t,
                        login_type: "password"
                    }), o = JSON.parse(a.responseText);
                    return 200 === o.code ? (this.user = o.data.user, this.apiKey = o.data.api_key, 
                    this.afdianUrl = o.data.afdian_url || "", this.isLoggedIn = !0, this.loginTime = Date.now(), 
                    this.saveToCache(), await this.fetchUserInfo(), o.data, {
                        success: !0,
                        message: "\u767b\u5f55\u6210\u529f"
                    }) : {
                        success: !1,
                        message: o.message || "\u767b\u5f55\u5931\u8d25"
                    };
                } catch (n) {
                    return {
                        success: !1,
                        message: n.message || "\u767b\u5f55\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u8fde\u63a5"
                    };
                }
            },
            async loginByApiKey(e) {
                try {
                    const t = "https://www.aiask.site/v1/user/login", [n] = await requestApi(t, "POST", {
                        api_key: e,
                        login_type: "apikey"
                    }), a = JSON.parse(n.responseText);
                    return 200 === a.code ? (this.user = a.data.user, this.apiKey = a.data.api_key, 
                    this.afdianUrl = a.data.afdian_url || "", this.isLoggedIn = !0, this.loginTime = Date.now(), 
                    this.saveToCache(), await this.fetchUserInfo(), a.data, {
                        success: !0,
                        message: "\u767b\u5f55\u6210\u529f"
                    }) : {
                        success: !1,
                        message: a.message || "API Key \u767b\u5f55\u5931\u8d25"
                    };
                } catch (t) {
                    return {
                        success: !1,
                        message: t.message || "API Key \u767b\u5f55\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u8fde\u63a5"
                    };
                }
            },
            async register(e) {
                try {
                    const t = "https://www.aiask.site/v1/user/register", [n] = await requestApi(t, "POST", e), a = JSON.parse(n.responseText);
                    return 200 === a.code ? (this.user = a.data.user, this.apiKey = a.data.api_key, 
                    this.afdianUrl = a.data.afdian_url || "", this.isLoggedIn = !0, this.loginTime = Date.now(), 
                    this.saveToCache(), a.data, {
                        success: !0,
                        message: "\u6ce8\u518c\u6210\u529f"
                    }) : {
                        success: !1,
                        message: a.message || "\u6ce8\u518c\u5931\u8d25"
                    };
                } catch (t) {
                    return {
                        success: !1,
                        message: t.message || "\u6ce8\u518c\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u8fde\u63a5"
                    };
                }
            },
            async fetchUserInfo() {
                if (this.isLoggedIn) try {
                    const e = "https://www.aiask.site/v1/user/info", [t] = await requestApi(e, "GET", void 0, {
                        Authorization: `Bearer ${this.apiKey}`
                    }), n = JSON.parse(t.responseText);
                    200 === n.code && (this.user = n.data.user, this.stats = n.data.stats, this.afdianUrl = n.data.afdian_url || "", 
                    this.saveToCache(), n.data);
                } catch (e) {}
            },
            async logout() {
                try {
                    if (this.apiKey) {
                        const e = "https://www.aiask.site/v1/user/logout";
                        await requestApi(e, "POST", void 0, {
                            Authorization: `Bearer ${this.apiKey}`
                        });
                    }
                } catch (e) {} finally {
                    this.user = null, this.apiKey = "", this.stats = {
                        course_count: 0,
                        chapter_count: 0,
                        question_count: 0
                    }, this.afdianUrl = "", this.isLoggedIn = !1, this.loginTime = 0, Cache.remove("user");
                }
            },
            async refreshApiKey() {
                try {
                    const e = "https://www.aiask.site/v1/user/refresh-apikey", [t] = await requestApi(e, "POST", void 0, {
                        Authorization: `Bearer ${this.apiKey}`
                    }), n = JSON.parse(t.responseText);
                    return 200 === n.code ? (this.apiKey = n.data.api_key, this.saveToCache(), n.data.api_key, 
                    {
                        success: !0,
                        message: "API Key \u5237\u65b0\u6210\u529f",
                        api_key: n.data.api_key
                    }) : {
                        success: !1,
                        message: n.message || "API Key \u5237\u65b0\u5931\u8d25"
                    };
                } catch (e) {
                    return {
                        success: !1,
                        message: e.message || "API Key \u5237\u65b0\u5931\u8d25"
                    };
                }
            },
            async updateUserInfo(e) {
                try {
                    const t = "https://www.aiask.site/v1/user/update", [n] = await requestApi(t, "POST", e, {
                        Authorization: `Bearer ${this.apiKey}`
                    }), a = JSON.parse(n.responseText);
                    return 200 === a.code ? (this.user && (this.user = {
                        ...this.user,
                        ...a.data.user
                    }), this.saveToCache(), a.data, {
                        success: !0,
                        message: "\u66f4\u65b0\u6210\u529f"
                    }) : {
                        success: !1,
                        message: a.message || "\u66f4\u65b0\u5931\u8d25"
                    };
                } catch (t) {
                    return {
                        success: !1,
                        message: t.message || "\u66f4\u65b0\u5931\u8d25"
                    };
                }
            },
            async changePassword(e, t) {
                try {
                    const n = "https://www.aiask.site/v1/user/change-password", [a] = await requestApi(n, "POST", {
                        old_password: e,
                        new_password: t
                    }, {
                        Authorization: `Bearer ${this.apiKey}`
                    }), o = JSON.parse(a.responseText);
                    return 200 === o.code ? {
                        success: !0,
                        message: "\u5bc6\u7801\u4fee\u6539\u6210\u529f"
                    } : {
                        success: !1,
                        message: o.message || "\u5bc6\u7801\u4fee\u6539\u5931\u8d25"
                    };
                } catch (n) {
                    return {
                        success: !1,
                        message: n.message || "\u5bc6\u7801\u4fee\u6539\u5931\u8d25"
                    };
                }
            },
            async fuzzySearchQuestion(e) {
                var t;
                try {
                    const t = "https://www.aiask.site/v1/question/fuzzy", n = {
                        question: e.question,
                        type: e.type ?? 8,
                        options: e.options ?? []
                    }, [a] = await requestApi(t, "POST", n), o = JSON.parse(a.responseText), s = 401 === o.code || 401 === a.status;
                    return 200 === o.code ? {
                        success: !0,
                        message: o.message || "success",
                        data: o.data || []
                    } : s ? {
                        success: !1,
                        message: o.message || "\u767b\u5f55\u540e\u624d\u53ef\u4ee5\u4f7f\u7528\u5b98\u65b9\u9898\u5e93\uff0c\u8bf7\u5148\u767b\u5f55",
                        data: [],
                        needLogin: !0
                    } : {
                        success: !1,
                        message: o.message || "\u5b98\u65b9\u9898\u5e93\u641c\u7d22\u5931\u8d25",
                        data: []
                    };
                } catch (n) {
                    const e = 401 === (null == n ? void 0 : n.status) || 401 === (null == (t = null == n ? void 0 : n.response) ? void 0 : t.status);
                    return {
                        success: !1,
                        message: e ? "\u767b\u5f55\u540e\u624d\u53ef\u4ee5\u4f7f\u7528\u5b98\u65b9\u9898\u5e93\uff0c\u8bf7\u5148\u767b\u5f55" : (null == n ? void 0 : n.message) || "\u5b98\u65b9\u9898\u5e93\u641c\u7d22\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5",
                        data: [],
                        needLogin: e
                    };
                }
            },
            async fetchNotice() {
                var e;
                try {
                    const t = "https://www.aiask.site", [n] = await requestApi(`${t}/v1/aiAskNotice`, "GET"), a = JSON.parse(n.responseText), o = (null == (e = null == a ? void 0 : a.data) ? void 0 : e.notice) ?? (null == a ? void 0 : a.data);
                    return 200 === a.code && o ? (this.notice = o, {
                        success: !0,
                        notice: o,
                        message: a.message
                    }) : {
                        success: !1,
                        message: a.message || "\u516c\u544a\u83b7\u53d6\u5931\u8d25"
                    };
                } catch (t) {
                    return {
                        success: !1,
                        message: (null == t ? void 0 : t.message) || "\u516c\u544a\u83b7\u53d6\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5"
                    };
                }
            },
            saveToCache() {
                const e = {
                    user: this.user || void 0,
                    api_key: this.apiKey || void 0,
                    login_time: this.loginTime || void 0,
                    afdian_url: this.afdianUrl || void 0
                };
                Cache.set("user", e);
            },
            loadFromCache() {
                const e = Cache.get("user", {});
                e.user && (this.user = e.user, this.apiKey = e.api_key || "", this.loginTime = e.login_time || 0, 
                this.afdianUrl = e.afdian_url || "", this.isLoggedIn = !0);
            }
        }
    }), Wt = {
        class: "home-container"
    }, Kt = {
        class: "home-card user-status-card"
    }, Yt = {
        class: "user-status"
    }, Xt = {
        class: "user-info"
    }, Zt = {
        class: "home-avatar"
    }, en = [ "src" ], tn = {
        class: "user-details"
    }, nn = {
        key: 0
    }, an = {
        class: "home-tag home-tag-success"
    }, on = {
        key: 0,
        class: "home-tag home-tag-warning tag-gap"
    }, sn = {
        key: 1,
        class: "home-muted small"
    }, rn = {
        class: "user-actions"
    }, ln = {
        key: 0,
        class: "home-card notice-card"
    }, pn = [ "innerHTML" ], cn = {
        key: 1,
        class: "home-divider"
    }, un = vue.createElementVNode("span", null, "\u529f\u80fd\u5217\u8868", -1), dn = [ un ], hn = {
        key: 2,
        class: "home-pages-grid"
    }, mn = [ "onClick" ], fn = vue.createElementVNode("div", {
        class: "home-divider"
    }, [ vue.createElementVNode("span", null, "\u7248\u672c\u4fe1\u606f") ], -1), gn = {
        class: "version-section"
    }, yn = {
        class: "version-row"
    }, xn = vue.createElementVNode("span", {
        class: "home-muted"
    }, "\u5f53\u524d\u7248\u672c:", -1), bn = {
        class: "home-tag home-tag-primary"
    }, vn = vue.createElementVNode("p", {
        class: "home-muted small tip-text"
    }, " \ud83d\udca1 \u4fdd\u6301\u6700\u65b0\u7248\u672c\u53ef\u4ee5\u51cf\u5c11BUG\u7684\u51fa\u73b0\u54e6~ ", -1), wn = vue.defineComponent({
        __name: "Home",
        setup(e) {
            const t = vue.ref("\u672c\u811a\u672c\u4ec5\u4f9b\u5b66\u4e60\u4ea4\u6d41\uff0c\u8bf7\u52ff\u7528\u4f5c\u4efb\u4f55\u975e\u6cd5\u7528\u9014\u3002\u5982\u9700\u6dfb\u52a0\u5176\u4ed6\u5e73\u53f0\u7b54\u9898\u529f\u80fd\uff0c\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005\u3002"), s = Nt(), r = Qt(), l = vue.ref(!0);
            vue.onMounted((async () => {
                const e = await r.fetchNotice();
                e.success && e.notice ? t.value = V.sanitize(e.notice) : e.message && msg(e.message, "warning");
            }));
            const p = [ {
                name: "\u57fa\u7840\u914d\u7f6e",
                page: "Base",
                icon: te,
                desc: "\u7cfb\u7edf\u57fa\u7840\u8bbe\u7f6e\u4e0e\u53c2\u6570\u914d\u7f6e",
                color: "#667eea"
            }, {
                name: "\u7b54\u9898\u754c\u9762",
                page: "ask",
                icon: K,
                desc: "\u5f00\u59cb\u7b54\u9898\uff0c\u652f\u6301\u81ea\u52a8\u7b54\u9898",
                color: "#f093fb"
            }, {
                name: "\u672c\u5730\u9898\u5e93",
                page: "preview",
                icon: W,
                desc: "\u9884\u89c8\u548c\u7ba1\u7406\u672c\u5730\u9898\u5e93",
                color: "#4facfe"
            }, {
                name: "\u9898\u5e93\u7f13\u5b58",
                page: "question",
                icon: Y,
                desc: "\u67e5\u770b\u548c\u6e05\u7406\u9898\u5e93\u7f13\u5b58",
                color: "#fa709a"
            }, {
                name: "\u9898\u5e93\u5bfc\u5165",
                page: "questionTool",
                icon: ne,
                desc: "\u5bfc\u5165\u5916\u90e8\u9898\u5e93\u6570\u636e",
                color: "#fee140"
            }, {
                name: "\u65e5\u5fd7\u8bb0\u5f55",
                page: "log",
                icon: Z,
                desc: "\u67e5\u770b\u7cfb\u7edf\u8fd0\u884c\u65e5\u5fd7",
                color: "#30cfd0"
            }, {
                name: "AI\u641c\u9898",
                page: "ai",
                icon: Q,
                desc: "AI\u667a\u80fd\u641c\u9898\u4e0e\u89e3\u7b54",
                color: "#a8edea"
            } ];
            return (e, i) => (vue.openBlock(), vue.createElementBlock("div", Wt, [ vue.createElementVNode("div", Kt, [ vue.createElementVNode("div", Yt, [ vue.createElementVNode("div", Xt, [ vue.createElementVNode("div", Zt, [ vue.unref(r).avatar ? (vue.openBlock(), 
            vue.createElementBlock("img", {
                key: 0,
                src: vue.unref(r).avatar,
                alt: "avatar"
            }, null, 8, en)) : (vue.openBlock(), vue.createBlock(vue.unref(ae), {
                key: 1,
                class: "home-avatar-icon"
            })) ]), vue.createElementVNode("div", tn, [ vue.createElementVNode("h3", null, vue.toDisplayString(vue.unref(r).nickname || "\u6e38\u5ba2"), 1), vue.unref(r).isLoggedIn ? (vue.openBlock(), 
            vue.createElementBlock("p", nn, [ vue.createElementVNode("span", an, "\u79ef\u5206: " + vue.toDisplayString(vue.unref(r).score), 1), vue.unref(r).isVip ? (vue.openBlock(), 
            vue.createElementBlock("span", on, " VIP Lv." + vue.toDisplayString(vue.unref(r).level), 1)) : vue.createCommentVNode("", !0) ])) : (vue.openBlock(), vue.createElementBlock("p", sn, "\u672a\u767b\u5f55\uff0c\u767b\u5f55\u540e\u53ef\u4eab\u53d7\u66f4\u591a\u529f\u80fd")) ]) ]), vue.createElementVNode("div", rn, [ vue.unref(r).isLoggedIn ? (vue.openBlock(), 
            vue.createElementBlock("button", {
                key: 1,
                class: "home-btn home-btn-plain",
                onClick: i[1] || (i[1] = e => vue.unref(s).setPage("user"))
            }, " \u4e2a\u4eba\u4e2d\u5fc3 ")) : (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                class: "home-btn home-btn-primary",
                onClick: i[0] || (i[0] = e => vue.unref(s).setPage("user"))
            }, " \u767b\u5f55 / \u6ce8\u518c ")) ]) ]) ]), t.value ? (vue.openBlock(), vue.createElementBlock("div", ln, [ vue.createElementVNode("div", {
                class: "notice-content",
                innerHTML: t.value
            }, null, 8, pn) ])) : vue.createCommentVNode("", !0), l.value ? (vue.openBlock(), vue.createElementBlock("div", cn, dn)) : vue.createCommentVNode("", !0), l.value ? (vue.openBlock(), 
            vue.createElementBlock("div", hn, [ (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(p, ((e, t) => vue.createElementVNode("button", {
                key: t,
                class: "home-btn home-page-btn",
                onClick: t => vue.unref(s).setPage(e.page),
                style: vue.normalizeStyle({
                    "--page-color": e.color
                })
            }, [ (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(e.icon), {
                class: "home-page-icon"
            })), vue.createElementVNode("span", null, vue.toDisplayString(e.name), 1) ], 12, mn))), 64)) ])) : vue.createCommentVNode("", !0), fn, vue.createElementVNode("div", gn, [ vue.createElementVNode("p", yn, [ xn, vue.createElementVNode("span", bn, vue.toDisplayString(vue.unref(Lt).script.version), 1), vue.createElementVNode("button", {
                class: "home-btn home-btn-primary home-btn-small",
                onClick: i[2] || (i[2] = e => vue.unref(updateFn)(!1))
            }, " \u68c0\u6d4b\u66f4\u65b0 ") ]), vn ]) ]));
        }
    }), kn = {
        class: "base-container"
    }, _n = vue.createElementVNode("div", {
        class: "config-card tips-card"
    }, [ vue.createElementVNode("div", {
        class: "base-alert base-alert-info"
    }, [ vue.createElementVNode("span", {
        class: "alert-icon"
    }, "\u2139\ufe0f"), vue.createElementVNode("span", null, "\u914d\u7f6e\u4fee\u6539\u540e\u4f1a\u81ea\u52a8\u4fdd\u5b58\uff0c\u76f4\u63a5\u5237\u65b0\u9875\u9762\u5373\u53ef\u751f\u6548") ]) ], -1), qn = {
        class: "config-card"
    }, Cn = vue.createElementVNode("div", {
        class: "card-header"
    }, [ vue.createElementVNode("span", {
        class: "card-title"
    }, "\ud83c\udfa8 \u663e\u793a\u8bbe\u7f6e"), vue.createElementVNode("span", {
        class: "base-tag base-tag-success"
    }, "\u81ea\u52a8\u4fdd\u5b58") ], -1), Tn = {
        class: "config-list"
    }, An = {
        class: "config-item-content"
    }, Sn = {
        class: "config-label"
    }, Un = {
        class: "label-text"
    }, Hn = [ "title" ], En = {
        class: "config-control"
    }, In = {
        key: 0,
        class: "toggle"
    }, jn = [ "onUpdate:modelValue" ], zn = vue.createElementVNode("span", {
        class: "toggle-slider"
    }, null, -1), On = [ "onUpdate:modelValue" ], $n = [ "onUpdate:modelValue" ], Ln = [ "onUpdate:modelValue" ], Pn = [ "value" ], Fn = {
        key: 4,
        class: "hotkey-input-wrapper"
    }, Mn = [ "value", "placeholder", "onFocus", "onKeydown" ], Nn = {
        key: 0,
        class: "hotkey-hint danger"
    }, Dn = {
        key: 1,
        class: "hotkey-hint"
    }, Bn = {
        key: 5,
        class: "checkbox-group"
    }, Vn = [ "value", "onUpdate:modelValue" ], Gn = {
        class: "config-card"
    }, Rn = vue.createElementVNode("div", {
        class: "card-header"
    }, [ vue.createElementVNode("span", {
        class: "card-title"
    }, "\u2699\ufe0f \u7cfb\u7edf\u8bbe\u7f6e"), vue.createElementVNode("span", {
        class: "base-tag base-tag-success"
    }, "\u81ea\u52a8\u4fdd\u5b58") ], -1), Jn = {
        class: "config-list"
    }, Qn = {
        class: "config-item-content"
    }, Wn = {
        class: "config-label"
    }, Kn = {
        class: "label-text"
    }, Yn = [ "title" ], Xn = {
        class: "config-control"
    }, Zn = {
        key: 0,
        class: "toggle"
    }, ea = [ "onUpdate:modelValue" ], ta = vue.createElementVNode("span", {
        class: "toggle-slider"
    }, null, -1), na = [ "onUpdate:modelValue" ], aa = [ "onUpdate:modelValue" ], oa = [ "onUpdate:modelValue" ], sa = [ "value" ], ia = {
        key: 4,
        class: "hotkey-input-wrapper"
    }, ra = [ "value", "placeholder", "onFocus", "onKeydown" ], la = {
        key: 0,
        class: "hotkey-hint danger"
    }, pa = {
        key: 1,
        class: "hotkey-hint"
    }, ca = {
        key: 5,
        class: "checkbox-group"
    }, ua = [ "value", "onUpdate:modelValue" ], da = {
        class: "config-card"
    }, ha = vue.createElementVNode("div", {
        class: "card-header"
    }, [ vue.createElementVNode("span", {
        class: "card-title"
    }, "\ud83e\udd16 AI\u8bbe\u7f6e"), vue.createElementVNode("span", {
        class: "base-tag base-tag-success"
    }, "\u81ea\u52a8\u4fdd\u5b58") ], -1), ma = {
        class: "config-list"
    }, fa = {
        class: "config-item-content"
    }, ga = {
        class: "config-label"
    }, ya = {
        class: "label-text"
    }, xa = [ "title" ], ba = {
        class: "config-control"
    }, va = {
        key: 0,
        class: "toggle"
    }, wa = [ "onUpdate:modelValue" ], ka = vue.createElementVNode("span", {
        class: "toggle-slider"
    }, null, -1), _a = [ "onUpdate:modelValue" ], qa = [ "onUpdate:modelValue" ], Ca = [ "onUpdate:modelValue" ], Ta = [ "value" ], Aa = {
        key: 4,
        class: "hotkey-input-wrapper"
    }, Sa = [ "value", "placeholder", "onFocus", "onKeydown" ], Ua = {
        key: 0,
        class: "hotkey-hint danger"
    }, Ha = {
        key: 1,
        class: "hotkey-hint"
    }, Ea = {
        key: 5,
        class: "checkbox-group"
    }, Ia = [ "value", "onUpdate:modelValue" ], ja = {
        class: "config-card"
    }, za = vue.createElementVNode("div", {
        class: "card-header"
    }, [ vue.createElementVNode("span", {
        class: "card-title"
    }, "\u2328\ufe0f \u5feb\u6377\u952e\u8bbe\u7f6e"), vue.createElementVNode("span", {
        class: "base-tag base-tag-success"
    }, "\u81ea\u52a8\u4fdd\u5b58") ], -1), Oa = {
        class: "config-list"
    }, $a = {
        class: "config-item-content"
    }, La = {
        class: "config-label"
    }, Pa = {
        class: "label-text"
    }, Fa = [ "title" ], Ma = {
        class: "config-control"
    }, Na = {
        key: 0,
        class: "toggle"
    }, Da = [ "onUpdate:modelValue" ], Ba = vue.createElementVNode("span", {
        class: "toggle-slider"
    }, null, -1), Va = [ "onUpdate:modelValue" ], Ga = [ "onUpdate:modelValue" ], Ra = [ "onUpdate:modelValue" ], Ja = [ "value" ], Qa = {
        key: 4,
        class: "hotkey-input-wrapper"
    }, Wa = [ "value", "placeholder", "onFocus", "onKeydown" ], Ka = {
        key: 0,
        class: "hotkey-hint danger"
    }, Ya = {
        key: 1,
        class: "hotkey-hint"
    }, Xa = {
        key: 5,
        class: "checkbox-group"
    }, Za = [ "value", "onUpdate:modelValue" ], eo = vue.defineComponent({
        __name: "Base",
        setup(e) {
            const t = Nt(), s = vue.ref(null), handleHotkeyKeydown = (e, t) => {
                if (e.preventDefault(), e.stopPropagation(), [ "Control", "Shift", "Alt", "Meta" ].includes(e.key)) return;
                const n = [];
                e.ctrlKey && n.push("Ctrl"), e.shiftKey && n.push("Shift"), e.altKey && n.push("Alt");
                let a = e.key;
                a = " " === a ? "Space" : e.code.startsWith("Key") ? e.code.replace("Key", "") : e.code.startsWith("Digit") ? e.code.replace("Digit", "") : e.code.startsWith("Arrow") ? e.code : e.key.toUpperCase(), 
                n.push(a);
                const o = n.join("+");
                t.value = o, s.value = null, msg(`\u5feb\u6377\u952e\u5df2\u8bbe\u7f6e\u4e3a: ${o}`, "success");
            }, startRecording = e => {
                s.value = e;
            };
            vue.watch(t.app, (e => {
                t.setConfig(e);
            })), vue.watch(t.ConfigInput, (e => {
                for (let n in e) for (let a in e[n]) {
                    let o = e[n][a];
                    t.app[o.name] = o.value;
                }
                msg("\u914d\u7f6e\u4fee\u6539\u6210\u529f", "success"), t.app, t.setConfig(t.app);
            }));
            const r = t.ConfigInput;
            return (e, t) => (vue.openBlock(), vue.createElementBlock("div", kn, [ _n, vue.createElementVNode("div", qn, [ Cn, vue.createElementVNode("div", Tn, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(r).display, ((e, t) => (vue.openBlock(), vue.createElementBlock("div", {
                key: t,
                class: "config-item"
            }, [ vue.createElementVNode("div", An, [ vue.createElementVNode("div", Sn, [ vue.createElementVNode("span", Un, vue.toDisplayString(e.label), 1), e.desc ? (vue.openBlock(), 
            vue.createElementBlock("span", {
                key: 0,
                class: "info-icon",
                title: e.desc
            }, [ vue.createVNode(vue.unref(ee)) ], 8, Hn)) : vue.createCommentVNode("", !0) ]), vue.createElementVNode("div", En, [ "switch" === e.type ? (vue.openBlock(), 
            vue.createElementBlock("label", In, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": t => e.value = t
            }, null, 8, jn), [ [ vue.vModelCheckbox, e.value ] ]), zn ])) : "input" === e.type ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 1,
                "onUpdate:modelValue": t => e.value = t,
                class: "base-input",
                type: "text"
            }, null, 8, On)), [ [ vue.vModelText, e.value ] ]) : "number" === e.type ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 2,
                "onUpdate:modelValue": t => e.value = t,
                class: "base-input",
                type: "number"
            }, null, 8, $n)), [ [ vue.vModelText, e.value, void 0, {
                number: !0
            } ] ]) : "select" === e.type ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("select", {
                key: 3,
                "onUpdate:modelValue": t => e.value = t,
                class: "base-select"
            }, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, (e => (vue.openBlock(), vue.createElementBlock("option", {
                key: e.value,
                value: e.value
            }, vue.toDisplayString(e.label), 9, Pn)))), 128)) ], 8, Ln)), [ [ vue.vModelSelect, e.value ] ]) : "hotkey" === e.type ? (vue.openBlock(), 
            vue.createElementBlock("div", Fn, [ vue.createElementVNode("input", {
                class: vue.normalizeClass([ "base-input", {
                    recording: s.value === e.name
                } ]),
                value: e.value,
                placeholder: s.value === e.name ? "\u8bf7\u6309\u4e0b\u5feb\u6377\u952e..." : "\u70b9\u51fb\u540e\u6309\u4e0b\u5feb\u6377\u952e\u7ec4\u5408",
                readonly: "",
                onFocus: t => startRecording(e.name),
                onKeydown: t => handleHotkeyKeydown(t, e)
            }, null, 42, Mn), s.value === e.name ? (vue.openBlock(), vue.createElementBlock("span", Nn, "\u5f55\u5236\u4e2d...")) : (vue.openBlock(), 
            vue.createElementBlock("span", Dn, "\u70b9\u51fb\u5f55\u5236")) ])) : "checkbox" === e.type ? (vue.openBlock(), vue.createElementBlock("div", Bn, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, (t => (vue.openBlock(), vue.createElementBlock("label", {
                key: t.value,
                class: "checkbox-item"
            }, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                value: t.value,
                "onUpdate:modelValue": t => e.value = t
            }, null, 8, Vn), [ [ vue.vModelCheckbox, e.value ] ]), vue.createElementVNode("span", null, vue.toDisplayString(t.label), 1) ])))), 128)) ])) : vue.createCommentVNode("", !0) ]) ]) ])))), 128)) ]) ]), vue.createElementVNode("div", Gn, [ Rn, vue.createElementVNode("div", Jn, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(r).system, ((e, t) => (vue.openBlock(), vue.createElementBlock("div", {
                key: t,
                class: "config-item"
            }, [ vue.createElementVNode("div", Qn, [ vue.createElementVNode("div", Wn, [ vue.createElementVNode("span", Kn, vue.toDisplayString(e.label), 1), e.desc ? (vue.openBlock(), 
            vue.createElementBlock("span", {
                key: 0,
                class: "info-icon",
                title: e.desc
            }, [ vue.createVNode(vue.unref(ee)) ], 8, Yn)) : vue.createCommentVNode("", !0) ]), vue.createElementVNode("div", Xn, [ "switch" === e.type ? (vue.openBlock(), 
            vue.createElementBlock("label", Zn, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": t => e.value = t
            }, null, 8, ea), [ [ vue.vModelCheckbox, e.value ] ]), ta ])) : "input" === e.type ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 1,
                "onUpdate:modelValue": t => e.value = t,
                class: "base-input",
                type: "text"
            }, null, 8, na)), [ [ vue.vModelText, e.value ] ]) : "number" === e.type ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 2,
                "onUpdate:modelValue": t => e.value = t,
                class: "base-input",
                type: "number"
            }, null, 8, aa)), [ [ vue.vModelText, e.value, void 0, {
                number: !0
            } ] ]) : "select" === e.type ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("select", {
                key: 3,
                "onUpdate:modelValue": t => e.value = t,
                class: "base-select"
            }, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, (e => (vue.openBlock(), vue.createElementBlock("option", {
                key: e.value,
                value: e.value
            }, vue.toDisplayString(e.label), 9, sa)))), 128)) ], 8, oa)), [ [ vue.vModelSelect, e.value ] ]) : "hotkey" === e.type ? (vue.openBlock(), 
            vue.createElementBlock("div", ia, [ vue.createElementVNode("input", {
                class: vue.normalizeClass([ "base-input", {
                    recording: s.value === e.name
                } ]),
                value: e.value,
                placeholder: s.value === e.name ? "\u8bf7\u6309\u4e0b\u5feb\u6377\u952e..." : "\u70b9\u51fb\u540e\u6309\u4e0b\u5feb\u6377\u952e\u7ec4\u5408",
                readonly: "",
                onFocus: t => startRecording(e.name),
                onKeydown: t => handleHotkeyKeydown(t, e)
            }, null, 42, ra), s.value === e.name ? (vue.openBlock(), vue.createElementBlock("span", la, "\u5f55\u5236\u4e2d...")) : (vue.openBlock(), 
            vue.createElementBlock("span", pa, "\u70b9\u51fb\u5f55\u5236")) ])) : "checkbox" === e.type ? (vue.openBlock(), vue.createElementBlock("div", ca, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, (t => (vue.openBlock(), vue.createElementBlock("label", {
                key: t.value,
                class: "checkbox-item"
            }, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                value: t.value,
                "onUpdate:modelValue": t => e.value = t
            }, null, 8, ua), [ [ vue.vModelCheckbox, e.value ] ]), vue.createElementVNode("span", null, vue.toDisplayString(t.label), 1) ])))), 128)) ])) : vue.createCommentVNode("", !0) ]) ]) ])))), 128)) ]) ]), vue.createElementVNode("div", da, [ ha, vue.createElementVNode("div", ma, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(r).ai, ((e, t) => (vue.openBlock(), vue.createElementBlock("div", {
                key: t,
                class: "config-item"
            }, [ vue.createElementVNode("div", fa, [ vue.createElementVNode("div", ga, [ vue.createElementVNode("span", ya, vue.toDisplayString(e.label), 1), e.desc ? (vue.openBlock(), 
            vue.createElementBlock("span", {
                key: 0,
                class: "info-icon",
                title: e.desc
            }, [ vue.createVNode(vue.unref(ee)) ], 8, xa)) : vue.createCommentVNode("", !0) ]), vue.createElementVNode("div", ba, [ "switch" === e.type ? (vue.openBlock(), 
            vue.createElementBlock("label", va, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": t => e.value = t
            }, null, 8, wa), [ [ vue.vModelCheckbox, e.value ] ]), ka ])) : "input" === e.type ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 1,
                "onUpdate:modelValue": t => e.value = t,
                class: "base-input",
                type: "text"
            }, null, 8, _a)), [ [ vue.vModelText, e.value ] ]) : "number" === e.type ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 2,
                "onUpdate:modelValue": t => e.value = t,
                class: "base-input",
                type: "number"
            }, null, 8, qa)), [ [ vue.vModelText, e.value, void 0, {
                number: !0
            } ] ]) : "select" === e.type ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("select", {
                key: 3,
                "onUpdate:modelValue": t => e.value = t,
                class: "base-select"
            }, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, (e => (vue.openBlock(), vue.createElementBlock("option", {
                key: e.value,
                value: e.value
            }, vue.toDisplayString(e.label), 9, Ta)))), 128)) ], 8, Ca)), [ [ vue.vModelSelect, e.value ] ]) : "hotkey" === e.type ? (vue.openBlock(), 
            vue.createElementBlock("div", Aa, [ vue.createElementVNode("input", {
                class: vue.normalizeClass([ "base-input", {
                    recording: s.value === e.name
                } ]),
                value: e.value,
                placeholder: s.value === e.name ? "\u8bf7\u6309\u4e0b\u5feb\u6377\u952e..." : "\u70b9\u51fb\u540e\u6309\u4e0b\u5feb\u6377\u952e\u7ec4\u5408",
                readonly: "",
                onFocus: t => startRecording(e.name),
                onKeydown: t => handleHotkeyKeydown(t, e)
            }, null, 42, Sa), s.value === e.name ? (vue.openBlock(), vue.createElementBlock("span", Ua, "\u5f55\u5236\u4e2d...")) : (vue.openBlock(), 
            vue.createElementBlock("span", Ha, "\u70b9\u51fb\u5f55\u5236")) ])) : "checkbox" === e.type ? (vue.openBlock(), vue.createElementBlock("div", Ea, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, (t => (vue.openBlock(), vue.createElementBlock("label", {
                key: t.value,
                class: "checkbox-item"
            }, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                value: t.value,
                "onUpdate:modelValue": t => e.value = t
            }, null, 8, Ia), [ [ vue.vModelCheckbox, e.value ] ]), vue.createElementVNode("span", null, vue.toDisplayString(t.label), 1) ])))), 128)) ])) : vue.createCommentVNode("", !0) ]) ]) ])))), 128)) ]) ]), vue.createElementVNode("div", ja, [ za, vue.createElementVNode("div", Oa, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(r).hotkey, ((e, t) => (vue.openBlock(), vue.createElementBlock("div", {
                key: t,
                class: "config-item"
            }, [ vue.createElementVNode("div", $a, [ vue.createElementVNode("div", La, [ vue.createElementVNode("span", Pa, vue.toDisplayString(e.label), 1), e.desc ? (vue.openBlock(), 
            vue.createElementBlock("span", {
                key: 0,
                class: "info-icon",
                title: e.desc
            }, [ vue.createVNode(vue.unref(ee)) ], 8, Fa)) : vue.createCommentVNode("", !0) ]), vue.createElementVNode("div", Ma, [ "switch" === e.type ? (vue.openBlock(), 
            vue.createElementBlock("label", Na, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": t => e.value = t
            }, null, 8, Da), [ [ vue.vModelCheckbox, e.value ] ]), Ba ])) : "input" === e.type ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 1,
                "onUpdate:modelValue": t => e.value = t,
                class: "base-input",
                type: "text"
            }, null, 8, Va)), [ [ vue.vModelText, e.value ] ]) : "number" === e.type ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 2,
                "onUpdate:modelValue": t => e.value = t,
                class: "base-input",
                type: "number"
            }, null, 8, Ga)), [ [ vue.vModelText, e.value, void 0, {
                number: !0
            } ] ]) : "select" === e.type ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("select", {
                key: 3,
                "onUpdate:modelValue": t => e.value = t,
                class: "base-select"
            }, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, (e => (vue.openBlock(), vue.createElementBlock("option", {
                key: e.value,
                value: e.value
            }, vue.toDisplayString(e.label), 9, Ja)))), 128)) ], 8, Ra)), [ [ vue.vModelSelect, e.value ] ]) : "hotkey" === e.type ? (vue.openBlock(), 
            vue.createElementBlock("div", Qa, [ vue.createElementVNode("input", {
                class: vue.normalizeClass([ "base-input", {
                    recording: s.value === e.name
                } ]),
                value: e.value,
                placeholder: s.value === e.name ? "\u8bf7\u6309\u4e0b\u5feb\u6377\u952e..." : "\u70b9\u51fb\u540e\u6309\u4e0b\u5feb\u6377\u952e\u7ec4\u5408",
                readonly: "",
                onFocus: t => startRecording(e.name),
                onKeydown: t => handleHotkeyKeydown(t, e)
            }, null, 42, Wa), s.value === e.name ? (vue.openBlock(), vue.createElementBlock("span", Ka, "\u5f55\u5236\u4e2d...")) : (vue.openBlock(), 
            vue.createElementBlock("span", Ya, "\u70b9\u51fb\u5f55\u5236")) ])) : "checkbox" === e.type ? (vue.openBlock(), vue.createElementBlock("div", Xa, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, (t => (vue.openBlock(), vue.createElementBlock("label", {
                key: t.value,
                class: "checkbox-item"
            }, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                value: t.value,
                "onUpdate:modelValue": t => e.value = t
            }, null, 8, Za), [ [ vue.vModelCheckbox, e.value ] ]), vue.createElementVNode("span", null, vue.toDisplayString(t.label), 1) ])))), 128)) ])) : vue.createCommentVNode("", !0) ]) ]) ])))), 128)) ]) ]) ]));
        }
    }), to = {
        class: "ask-container"
    }, no = {
        class: "ask-shell"
    }, ao = {
        class: "ask-toolbar"
    }, oo = {
        key: 0,
        class: "ask-toolbar__main"
    }, so = {
        class: "ask-shell__body"
    }, io = {
        class: "ask-grid"
    }, ro = {
        class: "ask-col ask-col--left"
    }, lo = {
        class: "ask-section"
    }, po = vue.createElementVNode("div", {
        class: "ask-section__header"
    }, [ vue.createElementVNode("div", {
        class: "ask-section__title"
    }, "\u4f7f\u7528\u63d0\u793a") ], -1), co = {
        class: "info-banner ask-info"
    }, uo = [ "innerHTML" ], ho = {
        class: "ask-types"
    }, mo = vue.createElementVNode("summary", null, "\u67e5\u770b\u652f\u6301\u9898\u578b", -1), fo = [ "innerHTML" ], go = {
        key: 0,
        class: "ask-section"
    }, yo = vue.createElementVNode("div", {
        class: "ask-section__header"
    }, [ vue.createElementVNode("div", {
        class: "ask-section__title"
    }, "\u9898\u76ee\u5bfc\u822a") ], -1), xo = vue.createStaticVNode('<div class="ask-legend"><span class="dq"><i></i>\u5f53\u524d\u9898</span><span class="yp"><i></i>\u5df2\u4f5c\u7b54</span><span class="wp"><i></i>\u65e0\u7b54\u6848</span><span class="zp"><i></i>\u672a\u4f5c\u7b54</span></div>', 1), bo = {
        class: "ask-question-grid"
    }, vo = [ "onClick" ], wo = {
        class: "ask-section"
    }, ko = {
        class: "ask-section__header"
    }, _o = vue.createElementVNode("div", {
        class: "ask-section__title"
    }, "\u7b54\u9898\u8bbe\u7f6e", -1), qo = {
        key: 0,
        class: "ask-section__hint"
    }, Co = {
        class: "ask-settings"
    }, To = {
        class: "native-checkbox"
    }, Ao = vue.createElementVNode("span", null, "\u8df3\u8fc7\u5df2\u4f5c\u7b54", -1), So = {
        class: "native-checkbox"
    }, Uo = vue.createElementVNode("span", null, "\u81ea\u52a8\u7b54\u9898", -1), Ho = {
        class: "native-checkbox"
    }, Eo = vue.createElementVNode("span", null, "\u81ea\u52a8\u8df3\u8f6c", -1), Io = {
        class: "native-checkbox"
    }, jo = vue.createElementVNode("span", null, "\u65e0\u7b54\u6848\u968f\u673a\u7b54\u9898", -1), zo = {
        class: "native-checkbox"
    }, Oo = vue.createElementVNode("span", null, [ vue.createTextVNode("\u4f7f\u7528AI\u8f85\u52a9\u7b54\u9898 "), vue.createElementVNode("small", null, "(AI\u6b63\u786e\u7387\u4e0d\u4fdd\u8bc1)") ], -1), $o = {
        key: 0,
        class: "soft-alert warning"
    }, Lo = {
        class: "range-row"
    }, Po = [ "min" ], Fo = {
        key: 0,
        class: "ask-tags"
    }, Mo = {
        class: "ask-col ask-col--right"
    }, No = {
        key: 0,
        class: "ask-section"
    }, Do = {
        class: "ask-section__header"
    }, Bo = vue.createElementVNode("div", {
        class: "ask-section__title"
    }, "\u5f53\u524d\u9898\u76ee", -1), Vo = {
        class: "ask-section__actions ask-section__actions--links"
    }, Go = vue.createElementVNode("span", {
        class: "divider"
    }, null, -1), Ro = {
        class: "ask-question-content"
    }, Jo = [ "innerHTML" ], Qo = [ "innerHTML" ], Wo = {
        key: 0
    }, Ko = {
        class: "ask-match-table"
    }, Yo = [ "innerHTML" ], Xo = [ "value" ], Zo = {
        key: 1,
        class: "green"
    }, es = {
        key: 2,
        class: "red"
    }, ts = {
        key: 1,
        class: "ask-section"
    }, ns = {
        class: "ask-loading"
    }, as = {
        class: "loading-box"
    }, os = {
        key: 2,
        class: "ask-section"
    }, ss = vue.createElementVNode("div", {
        class: "ask-section__header"
    }, [ vue.createElementVNode("div", {
        class: "ask-section__title"
    }, "\u7b54\u6848 / AI") ], -1), is = {
        class: "ask-answer-content"
    }, rs = {
        class: "answer-divider"
    }, ls = {
        key: 0
    }, ps = [ "innerHTML" ], cs = {
        key: 1
    }, us = {
        key: 0
    }, ds = [ "innerHTML" ], hs = [ "innerHTML" ], ms = {
        key: 1,
        class: "answer-block ai-answer-block"
    }, fs = {
        class: "answer-divider ai-divider"
    }, gs = vue.createElementVNode("span", null, "AI\u56de\u7b54(\u4ec5\u4f9b\u53c2\u8003)", -1), ys = {
        key: 0,
        class: "ai-streaming-tag"
    }, xs = vue.createElementVNode("span", {
        class: "ai-dot"
    }, null, -1), bs = vue.createElementVNode("span", {
        class: "ai-dot"
    }, null, -1), vs = vue.createElementVNode("span", {
        class: "ai-dot"
    }, null, -1), ws = [ "innerHTML" ], ks = {
        key: 1,
        class: "ai-stream-placeholder"
    }, _s = {
        key: 0,
        class: "empty-block"
    }, qs = vue.createElementVNode("div", {
        class: "empty-emoji"
    }, "\ud83d\udcdd", -1), Cs = vue.createElementVNode("p", {
        class: "empty-text"
    }, "\u6682\u65e0\u9898\u76ee\u6570\u636e", -1), Ts = [ qs, Cs ], As = vue.defineComponent({
        __name: "Ask",
        setup(e) {
            const t = Rt(), s = Nt(), i = vue.computed((() => t.aiLoadingIndex === t.questionInx)), r = vue.computed((() => Boolean(t.current && (t.current.aiMsg || i.value)))), getOptionIndex = e => String.fromCharCode(65 + e);
            vue.watch(s.app, (e => {
                s.setConfig(e);
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
                Cache.set("askGpt", s.app.askGpt);
            }, watchDelay = () => {
                Cache.set("delay", t.delay);
            };
            return (e, l) => (vue.openBlock(), vue.createElementBlock("div", to, [ vue.createElementVNode("div", no, [ vue.createElementVNode("div", ao, [ vue.unref(t).current ? (vue.openBlock(), 
            vue.createElementBlock("div", oo, [ vue.createElementVNode("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: l[0] || (l[0] = e => vue.unref(t).start ? vue.unref(t).pause() : vue.unref(t).toggleStart())
            }, vue.toDisplayString(vue.unref(t).start ? "\u6682\u505c\u7b54\u9898" : "\u5f00\u59cb\u7b54\u9898"), 1), vue.createElementVNode("button", {
                class: "btn btn-outline",
                type: "button",
                onClick: l[1] || (l[1] = e => vue.unref(t).restart())
            }, "\u91cd\u65b0\u7b54\u9898") ])) : vue.createCommentVNode("", !0) ]), vue.createElementVNode("div", so, [ vue.createElementVNode("div", io, [ vue.createElementVNode("div", ro, [ vue.createElementVNode("div", lo, [ po, vue.createElementVNode("div", co, [ vue.createElementVNode("div", {
                class: "info-body",
                innerHTML: vue.unref(t).tipsMd
            }, null, 8, uo), vue.createElementVNode("details", ho, [ mo, vue.createElementVNode("div", {
                innerHTML: vue.unref(t).typesMd
            }, null, 8, fo) ]) ]) ]), vue.unref(t).current ? (vue.openBlock(), vue.createElementBlock("div", go, [ yo, vue.createElementVNode("div", null, [ xo, vue.createElementVNode("div", bo, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(t).questionList, ((e, o) => (vue.openBlock(), vue.createElementBlock("button", {
                key: o,
                class: vue.normalizeClass([ "ask-question-btn", [ o === vue.unref(t).questionInx ? "aah_active" : "", 1 === e.status ? "status-success" : 2 === e.status ? "status-danger" : "" ] ]),
                type: "button",
                onClick: e => vue.unref(t).toQuestion(o)
            }, vue.toDisplayString(o + 1), 11, vo)))), 128)) ]) ]) ])) : vue.createCommentVNode("", !0), vue.createElementVNode("div", wo, [ vue.createElementVNode("div", ko, [ _o, vue.unref(t).minDelay > 0 ? (vue.openBlock(), 
            vue.createElementBlock("span", qo, "\u6700\u5c0f " + vue.toDisplayString(vue.unref(t).minDelay) + "ms", 1)) : vue.createCommentVNode("", !0) ]), vue.createElementVNode("div", Co, [ vue.createElementVNode("label", To, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": l[2] || (l[2] = e => vue.unref(t).skipFinish = e),
                onChange: watchSkipFinish
            }, null, 544), [ [ vue.vModelCheckbox, vue.unref(t).skipFinish ] ]), Ao ]), vue.createElementVNode("label", So, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": l[3] || (l[3] = e => vue.unref(t).autoAnswer = e),
                onChange: watchAutoAnswer
            }, null, 544), [ [ vue.vModelCheckbox, vue.unref(t).autoAnswer ] ]), Uo ]), vue.createElementVNode("label", Ho, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": l[4] || (l[4] = e => vue.unref(t).autoNext = e),
                onChange: watchAutoNext
            }, null, 544), [ [ vue.vModelCheckbox, vue.unref(t).autoNext ] ]), Eo ]), vue.createElementVNode("label", Io, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": l[5] || (l[5] = e => vue.unref(t).randomAnswer = e),
                onChange: watchRandomAnswer
            }, null, 544), [ [ vue.vModelCheckbox, vue.unref(t).randomAnswer ] ]), jo ]), vue.createElementVNode("label", zo, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": l[6] || (l[6] = e => vue.unref(s).app.askGpt = e),
                onChange: watchAskGpt
            }, null, 544), [ [ vue.vModelCheckbox, vue.unref(s).app.askGpt ] ]), Oo ]), vue.unref(t).minDelay > 0 ? (vue.openBlock(), vue.createElementBlock("div", $o, " \u7531\u4e8e\u89c4\u5219\u9650\u5236\uff0c\u5f53\u524d\u5e73\u53f0\u7b54\u9898\u95f4\u9694\u6700\u5c0f\u4e3a " + vue.toDisplayString(vue.unref(t).minDelay) + "ms ", 1)) : vue.createCommentVNode("", !0), vue.createElementVNode("div", Lo, [ vue.createElementVNode("label", null, "\u95f4\u9694\uff08" + vue.toDisplayString(vue.unref(t).delay) + "ms\uff09", 1), vue.withDirectives(vue.createElementVNode("input", {
                type: "range",
                min: vue.unref(t).minDelay,
                max: 5e3,
                step: "100",
                "onUpdate:modelValue": l[7] || (l[7] = e => vue.unref(t).delay = e),
                onInput: watchDelay
            }, null, 40, Po), [ [ vue.vModelText, vue.unref(t).delay, void 0, {
                number: !0
            } ] ]) ]) ]), vue.unref(t).formMap ? (vue.openBlock(), vue.createElementBlock("div", Fo, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(t).formMap, ((e, t) => (vue.openBlock(), 
            vue.createElementBlock("span", {
                class: "pill",
                key: t
            }, vue.toDisplayString(t) + ":" + vue.toDisplayString(e) + " \u6b21", 1)))), 128)) ])) : vue.createCommentVNode("", !0) ]) ]), vue.createElementVNode("div", Mo, [ vue.unref(t).current ? (vue.openBlock(), 
            vue.createElementBlock("div", No, [ vue.createElementVNode("div", Do, [ Bo, vue.createElementVNode("div", Vo, [ vue.createElementVNode("button", {
                class: "link-btn",
                type: "button",
                onClick: l[8] || (l[8] = e => vue.unref(t).reAnswer(vue.unref(t).questionInx))
            }, "\u91cd\u7b54"), Go, vue.createElementVNode("button", {
                class: "link-btn",
                type: "button",
                onClick: l[9] || (l[9] = e => vue.unref(t).aiAnswer(vue.unref(t).questionInx))
            }, "AI\u7b54\u9898") ]) ]), vue.createElementVNode("div", Ro, [ vue.createElementVNode("div", {
                class: "aah_title",
                innerHTML: "[" + vue.unref(typeConvert)(vue.unref(t).current.type ?? "", !1) + "]" + vue.unref(t).current.question
            }, null, 8, Jo), (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(t).current.options, ((e, o) => (vue.openBlock(), vue.createElementBlock("p", {
                class: vue.normalizeClass([ "aah_options", {
                    active: vue.unref(t).current.form && vue.unref(t).current.form.match && vue.unref(t).current.form.match.includes(o)
                } ]),
                key: o,
                innerHTML: getOptionIndex(o) + ". " + e
            }, null, 10, Qo)))), 128)), "24" == vue.unref(t).current.type ? (vue.openBlock(), vue.createElementBlock("div", Wo, [ vue.createElementVNode("table", Ko, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(t).current.match, ((e, s) => (vue.openBlock(), vue.createElementBlock("tr", {
                key: s
            }, [ vue.createElementVNode("td", {
                innerHTML: e
            }, null, 8, Yo), vue.createElementVNode("td", null, [ vue.createElementVNode("select", null, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(t).current.selects[s], (e => (vue.openBlock(), 
            vue.createElementBlock("option", {
                key: e.value,
                value: e.value
            }, vue.toDisplayString(e.text), 9, Xo)))), 128)) ]) ]) ])))), 128)) ]) ])) : vue.createCommentVNode("", !0), vue.unref(t).current.form ? (vue.openBlock(), 
            vue.createElementBlock("p", Zo, " \u91c7\u7528\u3010" + vue.toDisplayString(vue.unref(t).current.form.form) + "\u3011\u7684\u7b54\u6848 ", 1)) : vue.createCommentVNode("", !0), "8" != vue.unref(t).current.type && vue.unref(t).current.type ? vue.createCommentVNode("", !0) : (vue.openBlock(), 
            vue.createElementBlock("p", es, " \u5f53\u524d\u9898\u578b\u6682\u4e0d\u652f\u6301\uff0c\u8bf7\u53cd\u9988\u7ed9\u4f5c\u8005\u5427 ")) ]) ])) : vue.createCommentVNode("", !0), vue.unref(t).loading ? (vue.openBlock(), 
            vue.createElementBlock("div", ts, [ vue.createElementVNode("div", ns, [ vue.createElementVNode("div", as, vue.toDisplayString(vue.unref(t).loadingText), 1) ]) ])) : vue.createCommentVNode("", !0), vue.unref(t).current ? (vue.openBlock(), 
            vue.createElementBlock("div", os, [ ss, vue.createElementVNode("div", is, [ vue.unref(t).current.answer ? (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, {
                key: 0
            }, vue.renderList(vue.unref(t).current.answer, ((e, t) => (vue.openBlock(), vue.createElementBlock("div", {
                key: t,
                class: "answer-block"
            }, [ vue.createElementVNode("div", rs, vue.toDisplayString(`${e.form}(${e.duration}ms)`), 1), "object" == typeof e.answer && e.answer ? (vue.openBlock(), 
            vue.createElementBlock("div", ls, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.answer, ((e, t) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                    key: t,
                    class: "answer-field-html",
                    innerHTML: (o = e, markToHtml(o ?? ""))
                }, null, 8, ps);
                var o;
            })), 128)) ])) : (vue.openBlock(), vue.createElementBlock("div", cs, [ e.needLogin ? (vue.openBlock(), vue.createElementBlock("div", us, [ vue.createElementVNode("span", {
                innerHTML: e.msg
            }, null, 8, ds), vue.createElementVNode("button", {
                class: "link-btn",
                type: "button",
                onClick: l[10] || (l[10] = e => vue.unref(s).setPage("user"))
            }, "\u70b9\u51fb\u767b\u5f55") ])) : (vue.openBlock(), vue.createElementBlock("div", {
                key: 1,
                innerHTML: e.answer ? e.answer : e.msg ?? "\u6682\u65e0\u7b54\u6848"
            }, null, 8, hs)) ])) ])))), 128)) : vue.createCommentVNode("", !0), r.value ? (vue.openBlock(), vue.createElementBlock("div", ms, [ vue.createElementVNode("div", fs, [ gs, i.value ? (vue.openBlock(), 
            vue.createElementBlock("span", ys, [ xs, bs, vs, vue.createTextVNode(" \u6b63\u5728\u751f\u6210... ") ])) : vue.createCommentVNode("", !0) ]), vue.unref(t).current.aiMsg ? (vue.openBlock(), 
            vue.createElementBlock("div", {
                key: 0,
                innerHTML: vue.unref(t).currentAiMd,
                class: "ai-answer-markdown"
            }, null, 8, ws)) : (vue.openBlock(), vue.createElementBlock("div", ks, " AI \u6b63\u5728\u601d\u8003\uff0c\u6d41\u5f0f\u5185\u5bb9\u4f1a\u5b9e\u65f6\u586b\u5145\uff0c\u8bf7\u7a0d\u5019... ")) ])) : vue.createCommentVNode("", !0) ]) ])) : vue.createCommentVNode("", !0) ]) ]), vue.unref(t).current ? vue.createCommentVNode("", !0) : (vue.openBlock(), 
            vue.createElementBlock("div", _s, Ts)) ]) ]) ]));
        }
    }), Ss = {
        class: "question-page"
    }, Us = vue.createStaticVNode('<div class="watermark-bg"><span>AiAskHelper</span><span>\u7231\u95ee\u7b54\u52a9\u624b</span></div><div class="info-banner"><div class="info-title">\u9898\u5e93\u7f13\u5b58\u8bf4\u660e</div><div class="info-body"> \u672c\u811a\u672c\u652f\u6301\u5c06\u5b58\u5728\u7b54\u6848\u7684\u9898\u76ee\u6536\u5f55\u5230\u672c\u5730\uff0c\u4ee5\u4f9b\u540e\u7eed\u7b54\u9898\u68c0\u7d22\uff0c\u53ef\u51cf\u5c11\u63a5\u53e3\u8bf7\u6c42\u6b21\u6570\uff0c\u63d0\u9ad8\u7b54\u6848\u6b63\u786e\u7387\u3002<br> \u5728\u652f\u6301\u91cd\u590d\u7b54\u9898\u4e14\u7b54\u5b8c\u9898\u663e\u793a\u7b54\u6848\u7684\u60c5\u51b5\u4e0b\u53ef\u4ee5\u65e0\u9700\u4f7f\u7528\u63a5\u53e3\u641c\u7d22\u7b54\u6848\u3002<br><span class="warn-text">\u5e76\u975e\u6240\u6709\u7f51\u7ad9\u90fd\u652f\u6301\uff0c\u9700\u8981\u4f5c\u8005\u9002\u914d\uff0c\u5982\u9047\u4e0d\u652f\u6301\u7684\u5e73\u53f0\u8bf7\u53cd\u9988\u3002</span></div></div>', 2), Hs = {
        class: "stats-row"
    }, Es = {
        class: "stat-card"
    }, Is = vue.createElementVNode("div", {
        class: "stat-label"
    }, "\u7f13\u5b58\u9898\u76ee\u6570\u91cf", -1), js = {
        class: "stat-value"
    }, zs = {
        class: "upload-text"
    }, Os = vue.createElementVNode("span", {
        class: "upload-icon"
    }, "\u2601\ufe0f", -1), $s = vue.createElementVNode("div", {
        class: "upload-desc"
    }, [ vue.createElementVNode("strong", null, "\u62d6\u62fd\u5907\u4efd\u6587\u4ef6"), vue.createTextVNode(" \u6216 "), vue.createElementVNode("em", null, "\u70b9\u51fb\u4e0a\u4f20"), vue.createTextVNode(" \u6062\u590d\u5907\u4efd ") ], -1), Ls = {
        key: 0,
        class: "upload-hint"
    }, Ps = {
        class: "actions-row"
    }, Fs = {
        class: "question-table"
    }, Ms = vue.createStaticVNode('<div class="table-head"><div class="cell cell-type">\u9898\u578b</div><div class="cell cell-question">\u9898\u76ee</div><div class="cell cell-options">\u9009\u9879</div><div class="cell cell-answer">\u7b54\u6848</div></div>', 1), Ns = {
        key: 0,
        class: "table-empty"
    }, Ds = {
        class: "cell cell-type"
    }, Bs = [ "innerHTML" ], Vs = [ "innerHTML" ], Gs = [ "innerHTML" ], Rs = vue.defineComponent({
        __name: "Question",
        setup(e) {
            const t = vue.ref(0), s = vue.ref(null), r = vue.ref(!1);
            let l;
            window.addEventListener("keydown", (e => {
                "`" === e.key && t.value++;
            }));
            try {
                Lt.script, l = Lt.script.updateURL.match(/scripts\/(\d+)/)[1];
            } catch (d) {
                l = "492563";
            }
            const p = `https://greasyfork.org/zh-CN/scripts/${l}`, c = Rt(), u = Cache.match("ques1_"), exportHtml = async e => {
                const t = e.map(((e, t) => {
                    return `\n        <p><a href="${p}">\u7231\u95ee\u7b54\u52a9\u624b</a></p>\n        <p>${t + 1}\u3001[${typeConvert(e.type, !1)}]${e.question}</p>\n        <p>${n = e.options, 
                "object" != typeof n ? "" : n.map(((e, t) => String.fromCharCode(65 + t) + "." + e)).join("<br>")}</p>\n        <p style="color:green;">\u7b54\u6848\uff1a${answerFormat(e.answer)}</p>\n        \n        `;
                    var n;
                })).join("<br/>"), n = new Blob([ `<HtML> <head> <meta charset="utf-8"> <title>\u7231\u95ee\u7b54\u52a9\u624b\u7b54\u6848\u5bfc\u51fa</title> </head> <body> ${t} </body> </HtML>` ], {
                    type: "text/html"
                }), a = document.createElement("a");
                a.href = URL.createObjectURL(n), a.download = "\u7231\u95ee\u7b54\u52a9\u624b.html", 
                a.click();
            }, exportData = async () => {
                try {
                    const e = Cache.matchGet("ques1_") || [];
                    if (0 === e.length) return void msg("\u6682\u65e0\u9898\u76ee\u53ef\u5bfc\u51fa", "warning");
                    msg(`\u6b63\u5728\u6253\u5305${e.length}\u9898\uff0c\u8bf7\u7a0d\u540e...`, "info");
                    const t = await encrypt(JSON.stringify(e));
                    if (!t) return void msg("\u52a0\u5bc6\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\u6216\u8054\u7cfb\u5f00\u53d1\u8005", "error");
                    const n = new Blob([ t ], {
                        type: "application/text"
                    });
                    msg(`\u6253\u5305\u5b8c\u6210\uff0c\u5171\u8ba1${e.length}\u9898\uff0c\u51c6\u5907\u4e0b\u8f7d`, "success");
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(n);
                    const o = (new Date).toLocaleDateString().replace(/\//g, "-");
                    a.download = `\u7231\u95ee\u7b54\u52a9\u624b\u5907\u4efd-${o}.bak`, a.click(), setTimeout((() => URL.revokeObjectURL(a.href)), 100);
                } catch (e) {
                    msg(`\u5bfc\u51fa\u5931\u8d25\uff1a${e}`, "error");
                }
            }, exportDocx = async () => {
                exportHtml(c.saveQuestionData);
            }, exportDocx1 = async () => {
                const e = Cache.matchGet("ques1_") || [];
                exportHtml(e);
            }, answerFormat = e => Array.isArray(e) ? e.join("<br/>") : "string" == typeof e ? e : "object" == typeof e ? JSON.stringify(e) : e, beforeUpload = e => {
                if (!e) return !1;
                r.value = !0;
                const t = new FileReader;
                return t.onload = async e => {
                    var t;
                    const n = null == (t = e.target) ? void 0 : t.result;
                    try {
                        const e = JSON.parse(await decrypt(n));
                        e.forEach((e => {
                            Answer.cacheAnswer(e);
                        })), msg(`\u9898\u5e93\u5bfc\u5165\u6210\u529f\uff0c\u5171\u8ba1${e.length}\u9898\n            \u8fc7\u591a\u9898\u76ee\u5bfc\u5165\u540e\u9875\u9762\u4f1a\u5361\u4e3b\u8bf7\u76f4\u63a5\u5173\u95ed\u9875\u9762\u91cd\u65b0\u6253\u5f00`, "success");
                    } catch (a) {
                        msg("\u6587\u4ef6\u683c\u5f0f\u9519\u8bef", "error");
                    }
                    r.value = !1;
                }, t.onerror = () => {
                    msg("\u8bfb\u53d6\u6587\u4ef6\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5", "error"), r.value = !1;
                }, t.readAsText(e), !1;
            }, handleFileChange = e => {
                var t;
                const n = null == (t = e.target.files) ? void 0 : t[0];
                n && beforeUpload(n), s.value && (s.value.value = "");
            }, handleDrop = e => {
                var t, n;
                e.preventDefault();
                const a = null == (n = null == (t = e.dataTransfer) ? void 0 : t.files) ? void 0 : n[0];
                a && beforeUpload(a);
            }, handleDragOver = e => {
                e.preventDefault();
            };
            return (e, i) => (vue.openBlock(), vue.createElementBlock("div", Ss, [ Us, vue.createElementVNode("div", Hs, [ vue.createElementVNode("div", Es, [ Is, vue.createElementVNode("div", js, vue.toDisplayString(vue.unref(u).length), 1) ]) ]), vue.createElementVNode("div", {
                class: "upload-box",
                onDrop: handleDrop,
                onDragover: handleDragOver,
                onClick: i[0] || (i[0] = e => {
                    var t;
                    return null == (t = s.value) ? void 0 : t.click();
                })
            }, [ vue.createElementVNode("input", {
                ref_key: "uploadInput",
                ref: s,
                type: "file",
                accept: ".bak",
                class: "upload-input",
                onChange: handleFileChange
            }, null, 544), vue.createElementVNode("div", zs, [ Os, $s, r.value ? (vue.openBlock(), vue.createElementBlock("div", Ls, "\u6b63\u5728\u5bfc\u5165\uff0c\u8bf7\u7a0d\u5019\u2026")) : vue.createCommentVNode("", !0) ]) ], 32), vue.createElementVNode("div", Ps, [ vue.createElementVNode("button", {
                class: "btn btn-danger",
                type: "button",
                onClick: i[1] || (i[1] = e => window.confirm("\u786e\u5b9a\u8981\u6e05\u7a7a\u672c\u5730\u7f13\u5b58\u5417\uff1f") && (Cache.matchRemove("ques1_"), 
                void msg("\u6e05\u9664\u6210\u529f", "success")))
            }, "\u6e05\u9664\u7f13\u5b58"), vue.createElementVNode("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: exportData
            }, "\u5bfc\u51fa\u5907\u4efd"), t.value > 10 ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                class: "btn btn-primary",
                type: "button",
                onClick: exportDocx
            }, "\u5bfc\u51fa\u5f53\u524d")) : vue.createCommentVNode("", !0), t.value > 10 ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 1,
                class: "btn btn-primary",
                type: "button",
                onClick: exportDocx1
            }, "\u5bfc\u51fa\u6240\u6709")) : vue.createCommentVNode("", !0) ]), vue.createElementVNode("div", Fs, [ Ms, 0 === vue.unref(c).saveQuestionData.length ? (vue.openBlock(), 
            vue.createElementBlock("div", Ns, "\u5f53\u524d\u9875\u6682\u65e0\u6570\u636e")) : (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, {
                key: 1
            }, vue.renderList(vue.unref(c).saveQuestionData, ((e, t) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                    key: t,
                    class: "table-row"
                }, [ vue.createElementVNode("div", Ds, vue.toDisplayString((s = e, typeConvert(s.type, !1))), 1), vue.createElementVNode("div", {
                    class: "cell cell-question",
                    innerHTML: e.question
                }, null, 8, Bs), vue.createElementVNode("div", {
                    class: "cell cell-options",
                    innerHTML: e.options.join("<br/>")
                }, null, 8, Vs), vue.createElementVNode("div", {
                    class: "cell cell-answer",
                    innerHTML: answerFormat(e.answer)
                }, null, 8, Gs) ]);
                var s;
            })), 128)) ]) ]));
        }
    }), Js = {
        class: "modal-panel"
    }, Qs = {
        class: "modal-header"
    }, Ws = {
        class: "modal-body"
    }, Ks = {
        class: "form-row"
    }, Ys = vue.createElementVNode("label", null, "\u9898\u578b", -1), Xs = [ "value" ], Zs = {
        class: "form-row"
    }, ei = vue.createElementVNode("label", null, "\u9898\u5e72", -1), ti = {
        key: 0,
        class: "form-row"
    }, ni = vue.createElementVNode("label", null, "\u9009\u9879", -1), ai = {
        class: "option-list"
    }, oi = [ "onClick" ], si = [ "onUpdate:modelValue" ], ii = [ "onClick" ], ri = {
        key: 1,
        class: "form-row"
    }, li = vue.createElementVNode("label", null, "\u7b54\u6848", -1), pi = {
        class: "option-list"
    }, ci = [ "onUpdate:modelValue" ], ui = [ "onClick" ], di = vue.defineComponent({
        __name: "QuestionEdit",
        props: {
            ques: {},
            visible: {
                type: Boolean
            }
        },
        emits: [ "handleClose" ],
        setup(e, {emit: t}) {
            const s = e, r = vue.ref(s.visible);
            vue.watch((() => s.visible), (e => {
                r.value = e;
            }));
            const l = t, closeDialog = () => {
                r.value = !1, l("handleClose");
            }, handleCancel = () => {
                closeDialog();
            }, handleSave = () => {
                Answer.cacheAnswer(s.ques), Cache.matchRemove(s.ques.key), msg("\u9898\u76ee\u4fee\u6539\u6210\u529f", "success"), 
                closeDialog();
            }, handleDelete = e => {
                s.ques.options.splice(e, 1), s.ques.answer.includes(s.ques.options[e]) && (s.ques.answer = s.ques.answer.filter((t => t !== s.ques.options[e])));
            }, handleAdd = () => {
                s.ques.options.push("");
            };
            return (e, t) => {
                var i;
                return r.value ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 0,
                    class: "modal-mask",
                    onClick: vue.withModifiers(handleCancel, [ "self" ])
                }, [ vue.createElementVNode("div", Js, [ vue.createElementVNode("div", Qs, [ vue.createElementVNode("h3", null, "\u9898\u76ee\u7f16\u8f91 [" + vue.toDisplayString(null == (i = e.ques) ? void 0 : i.type) + "]", 1), vue.createElementVNode("button", {
                    class: "modal-close",
                    type: "button",
                    onClick: handleCancel
                }, "\xd7") ]), vue.createElementVNode("div", Ws, [ vue.createElementVNode("div", Ks, [ Ys, vue.withDirectives(vue.createElementVNode("select", {
                    "onUpdate:modelValue": t[0] || (t[0] = t => e.ques.type = t),
                    class: "base-select"
                }, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(Ot), ((e, t) => (vue.openBlock(), vue.createElementBlock("option", {
                    key: e,
                    value: e
                }, vue.toDisplayString(t), 9, Xs)))), 128)) ], 512), [ [ vue.vModelSelect, e.ques.type ] ]) ]), vue.createElementVNode("div", Zs, [ ei, vue.withDirectives(vue.createElementVNode("textarea", {
                    "onUpdate:modelValue": t[1] || (t[1] = t => e.ques.question = t),
                    class: "base-input",
                    rows: "5"
                }, null, 512), [ [ vue.vModelText, e.ques.question ] ]) ]), e.ques.options && Array.isArray(e.ques.options) && e.ques.options.length > 0 ? (vue.openBlock(), 
                vue.createElementBlock("div", ti, [ ni, vue.createElementVNode("div", ai, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.ques.options, ((t, i) => (vue.openBlock(), 
                vue.createElementBlock("div", {
                    key: i,
                    class: "option-row"
                }, [ vue.createElementVNode("button", {
                    type: "button",
                    class: vue.normalizeClass([ "option-selector", {
                        active: e.ques.answer.includes(t)
                    } ]),
                    onClick: e => (e => {
                        s.ques.answer = s.ques.answer.includes(e) ? s.ques.answer.filter((t => t !== e)) : [ ...s.ques.answer, e ], 
                        s.ques.answer.sort(((e, t) => s.ques.options.indexOf(e) - s.ques.options.indexOf(t)));
                    })(t)
                }, vue.toDisplayString(String.fromCharCode(65 + i)), 11, oi), vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": t => e.ques.options[i] = t,
                    class: "base-input flex-grow"
                }, null, 8, si), [ [ vue.vModelText, e.ques.options[i] ] ]), vue.createElementVNode("button", {
                    class: "btn btn-outline btn-small",
                    type: "button",
                    onClick: e => 0 !== i ? handleDelete(i) : handleAdd()
                }, vue.toDisplayString(0 !== i ? "\uff0d" : "\uff0b"), 9, ii) ])))), 128)) ]) ])) : Array.isArray(e.ques.answer) && 0 === e.ques.options.length ? (vue.openBlock(), 
                vue.createElementBlock("div", ri, [ li, vue.createElementVNode("div", pi, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.ques.answer, ((t, s) => (vue.openBlock(), 
                vue.createElementBlock("div", {
                    key: s,
                    class: "option-row"
                }, [ vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": t => e.ques.answer[s] = t,
                    class: "base-input flex-grow"
                }, null, 8, ci), [ [ vue.vModelText, e.ques.answer[s] ] ]), vue.createElementVNode("button", {
                    class: "btn btn-outline btn-small",
                    type: "button",
                    onClick: e => 0 !== s ? handleDelete(s) : handleAdd()
                }, vue.toDisplayString(0 !== s ? "\uff0d" : "\uff0b"), 9, ui) ])))), 128)) ]) ])) : vue.createCommentVNode("", !0) ]), vue.createElementVNode("div", {
                    class: "modal-footer"
                }, [ vue.createElementVNode("button", {
                    class: "btn btn-outline",
                    type: "button",
                    onClick: handleCancel
                }, "\u53d6\u6d88"), vue.createElementVNode("button", {
                    class: "btn btn-primary",
                    type: "button",
                    onClick: handleSave
                }, "\u4fdd\u5b58") ]) ]) ])) : vue.createCommentVNode("", !0);
            };
        }
    }), hi = {
        class: "preview-container"
    }, mi = vue.createElementVNode("div", {
        class: "preview-info"
    }, [ vue.createElementVNode("div", {
        class: "info-icon"
    }, "\ud83d\udca1"), vue.createElementVNode("div", {
        class: "info-text"
    }, [ vue.createElementVNode("strong", null, "\u5c0f\u63d0\u793a\uff1a"), vue.createTextVNode(" \u672c\u5730\u9898\u5e93\u652f\u6301\u9884\u89c8\u3001\u641c\u7d22\u3001\u7f16\u8f91\u7b49\u529f\u80fd\uff0c\u641c\u7d22\u4e3a\u5173\u952e\u8bcd\u6a21\u7cca\u5339\u914d\u3002 "), vue.createElementVNode("span", {
        class: "info-highlight"
    }, "\u70b9\u51fb\u9898\u76ee\u5361\u7247\u53ef\u67e5\u770b\u8be6\u60c5") ]) ], -1), fi = {
        class: "search-section"
    }, gi = vue.createElementVNode("div", {
        class: "search-label"
    }, "\u667a\u80fd\u68c0\u7d22", -1), yi = {
        class: "search-bar"
    }, xi = vue.createElementVNode("span", {
        class: "search-icon"
    }, "\ud83d\udd0d", -1), bi = {
        key: 0,
        class: "search-result-info"
    }, vi = {
        class: "pill pill-primary"
    }, wi = vue.createElementVNode("div", {
        class: "watermark-bg"
    }, [ vue.createElementVNode("span", null, "AiAskHelper"), vue.createElementVNode("span", null, "\u7231\u95ee\u7b54\u52a9\u624b") ], -1), ki = {
        key: 0,
        class: "empty-state"
    }, _i = vue.createElementVNode("div", {
        class: "empty-icon"
    }, "\ud83d\udcdd", -1), qi = vue.createElementVNode("p", {
        class: "empty-text"
    }, "\u6682\u65e0\u9898\u76ee\u6570\u636e\uff0c\u5148\u53bb\u6293\u53d6\u6216\u5bfc\u5165\u5427\uff5e", -1), Ci = [ _i, qi ], Ti = {
        key: 1,
        class: "questions-list"
    }, Ai = {
        class: "question-item-card"
    }, Si = {
        class: "question-badge"
    }, Ui = {
        class: "badge-number"
    }, Hi = {
        class: "question-actions-top"
    }, Ei = [ "onClick" ], Ii = [ "onClick" ], ji = {
        class: "question-main"
    }, zi = {
        class: "question-header-section"
    }, Oi = {
        class: "question-type-tag"
    }, $i = [ "innerHTML" ], Li = {
        key: 0,
        class: "options-section"
    }, Pi = {
        key: 0,
        class: "complex-question-tip"
    }, Fi = vue.createElementVNode("div", {
        class: "soft-alert soft-alert-warning"
    }, "\u8be5\u9898\u578b\u6682\u4e0d\u652f\u6301\u5b8c\u6574\u663e\u793a", -1), Mi = [ Fi ], Ni = {
        key: 1,
        class: "options-list"
    }, Di = {
        class: "option-letter"
    }, Bi = [ "innerHTML" ], Vi = {
        key: 0,
        class: "correct-badge"
    }, Gi = {
        class: "answer-section"
    }, Ri = vue.createElementVNode("div", {
        class: "answer-header"
    }, [ vue.createElementVNode("span", {
        class: "answer-icon"
    }, "\u2714\ufe0e"), vue.createElementVNode("span", null, "\u6b63\u786e\u7b54\u6848") ], -1), Ji = {
        class: "answer-content-wrapper"
    }, Qi = {
        key: 0,
        class: "answer-tags"
    }, Wi = {
        key: 1,
        class: "answer-tags"
    }, Ki = [ "innerHTML" ], Yi = {
        key: 3,
        class: "no-answer"
    }, Xi = vue.createElementVNode("span", {
        class: "answer-icon muted"
    }, "\u2014", -1), Zi = vue.createElementVNode("span", null, "\u6682\u65e0\u7b54\u6848", -1), er = [ Xi, Zi ], tr = {
        key: 0,
        class: "pagination-wrapper"
    }, nr = {
        class: "pager"
    }, ar = [ "disabled" ], or = {
        class: "pager-info"
    }, sr = [ "max" ], ir = [ "disabled" ], rr = {
        class: "pager-total"
    }, lr = vue.defineComponent({
        __name: "Preview",
        setup(e) {
            const t = vue.ref(Cache.matchGet("ques1_") || []), s = vue.ref(!1), r = vue.ref(""), l = vue.ref(1), p = vue.ref(10), c = function(e) {
                const t = new Blob([ `(${e.toString()})()` ], {
                    type: "application/javascript"
                }), n = URL.createObjectURL(t);
                return new Worker(n);
            }((() => {
                self.importScripts("https://cdn.bootcdn.net/ajax/libs/fuse.js/7.1.0/fuse.min.js"), 
                self.onmessage = function(e) {
                    const {data: t, options: n} = e.data, a = new Fuse(t, n).search(e.data.keyword).map((e => e.item));
                    a.forEach((t => {
                        t.question1 = t.question, e.data.keyword.split("").forEach((e => {
                            /[\u4e00-\u9fa5a-zA-Z0-9]/.test(e) && (t.question1 = t.question1.replace(new RegExp(e, "g"), `<span class="highlight">${e}</span>`));
                        }));
                    })), self.postMessage(a);
                };
            })), u = vue.computed((() => t.value.length)), d = vue.computed((() => 0 === u.value ? 0 : Math.ceil(u.value / p.value))), h = vue.computed((() => {
                const e = (l.value - 1) * p.value, n = e + p.value;
                return t.value.slice(e, n);
            })), cl_img_format = e => {
                if (!e.trim()) return e;
                return e.replace(/<img\b(?!.*?\breferrerPolicy\b)[^>]*>/gi, (e => e.replace(/\/?>$/, ' referrerPolicy="no-referrer">')));
            }, getOptionIndex = e => String.fromCharCode(65 + e), handlePageChange = e => {
                if (0 === d.value) return;
                const t = Math.min(Math.max(1, e), d.value);
                l.value = t;
            }, goPrev = () => handlePageChange(l.value - 1), goNext = () => handlePageChange(l.value + 1), search = () => {
                const e = {
                    keys: [ "question" ],
                    threshold: .3
                }, n = r.value.trim();
                s.value = !0, n ? (c.onmessage = e => {
                    const n = e.data;
                    t.value = n, s.value = !1, l.value = 1;
                }, c.postMessage({
                    data: Cache.matchGet("ques1_"),
                    options: e,
                    keyword: n
                })) : (t.value = Cache.matchGet("ques1_") || [], s.value = !1, l.value = 1);
            }, m = vue.ref(null), f = vue.ref(!1), handleClose = () => {
                f.value = !1;
            };
            return (e, i) => (vue.openBlock(), vue.createElementBlock("div", hi, [ vue.createVNode(di, {
                visible: f.value,
                ques: m.value,
                onHandleClose: handleClose
            }, null, 8, [ "visible", "ques" ]), mi, vue.createElementVNode("div", fi, [ gi, vue.createElementVNode("div", yi, [ xi, vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": i[0] || (i[0] = e => r.value = e),
                class: "search-input",
                type: "text",
                placeholder: "\u8f93\u5165\u5173\u952e\u8bcd\uff0c\u5b9e\u65f6\u7b5b\u9009\u672c\u5730\u9898\u76ee...",
                onInput: search
            }, null, 544), [ [ vue.vModelText, r.value ] ]), r.value ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                class: "search-clear",
                type: "button",
                onClick: i[1] || (i[1] = e => {
                    r.value = "", search();
                })
            }, " \u6e05\u7a7a ")) : vue.createCommentVNode("", !0) ]), r.value ? (vue.openBlock(), vue.createElementBlock("div", bi, [ vue.createElementVNode("span", vi, "\u627e\u5230 " + vue.toDisplayString(t.value.length) + " \u9053\u76f8\u5173\u9898\u76ee", 1) ])) : vue.createCommentVNode("", !0) ]), vue.createElementVNode("div", {
                class: vue.normalizeClass([ "watermark-shell", {
                    "is-loading": s.value
                } ])
            }, [ wi, s.value || 0 !== h.value.length ? (vue.openBlock(), vue.createElementBlock("div", Ti, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(h.value, ((e, s) => (vue.openBlock(), 
            vue.createElementBlock("div", {
                key: s,
                class: "question-item-wrapper"
            }, [ vue.createElementVNode("div", Ai, [ vue.createElementVNode("div", Si, [ vue.createElementVNode("span", Ui, vue.toDisplayString((l.value - 1) * p.value + s + 1), 1) ]), vue.createElementVNode("div", Hi, [ vue.createElementVNode("button", {
                class: "icon-btn icon-btn-primary",
                type: "button",
                onClick: t => (e => {
                    m.value = e, f.value = !0;
                })(e)
            }, " \u270f\ufe0f ", 8, Ei), vue.createElementVNode("button", {
                class: "icon-btn icon-btn-danger",
                type: "button",
                onClick: n => (e => {
                    t.value = t.value.filter((t => t.key !== e.key)), Cache.matchRemove(e.key);
                })(e)
            }, " \ud83d\uddd1\ufe0f ", 8, Ii) ]), vue.createElementVNode("div", ji, [ vue.createElementVNode("div", zi, [ vue.createElementVNode("span", Oi, vue.toDisplayString(vue.unref(typeConvert)(e.type ?? "", !1)), 1) ]), vue.createElementVNode("div", {
                class: "question-text",
                innerHTML: cl_img_format(e.question1 || e.question)
            }, null, 8, $i), e.options && e.options.length > 0 ? (vue.openBlock(), vue.createElementBlock("div", Li, [ "object" == typeof e.options[0] ? (vue.openBlock(), 
            vue.createElementBlock("div", Pi, Mi)) : (vue.openBlock(), vue.createElementBlock("div", Ni, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, ((t, s) => (vue.openBlock(), 
            vue.createElementBlock("div", {
                key: s,
                class: vue.normalizeClass([ "option-item", {
                    "option-correct": e.answer && e.answer.includes(t)
                } ])
            }, [ vue.createElementVNode("div", Di, vue.toDisplayString(getOptionIndex(s)), 1), vue.createElementVNode("div", {
                class: "option-text",
                innerHTML: cl_img_format(t)
            }, null, 8, Bi), e.answer && e.answer.includes(t) ? (vue.openBlock(), vue.createElementBlock("div", Vi, " \u2713 ")) : vue.createCommentVNode("", !0) ], 2)))), 128)) ])) ])) : vue.createCommentVNode("", !0), vue.createElementVNode("div", Gi, [ Ri, vue.createElementVNode("div", Ji, [ Array.isArray(e.answer) && 0 === e.options.length ? (vue.openBlock(), 
            vue.createElementBlock("div", Qi, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.answer, ((e, t) => (vue.openBlock(), vue.createElementBlock("span", {
                key: t,
                class: "pill pill-success"
            }, vue.toDisplayString(e), 1)))), 128)) ])) : Array.isArray(e.answer) ? (vue.openBlock(), vue.createElementBlock("div", Wi, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(e.answer, ((e, t) => (vue.openBlock(), vue.createElementBlock("span", {
                key: t,
                class: "pill pill-success"
            }, vue.toDisplayString(e), 1)))), 128)) ])) : e.answer ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 2,
                class: "answer-text",
                innerHTML: cl_img_format(e.answer)
            }, null, 8, Ki)) : (vue.openBlock(), vue.createElementBlock("div", Yi, er)) ]) ]) ]) ]) ])))), 128)) ])) : (vue.openBlock(), 
            vue.createElementBlock("div", ki, Ci)) ], 2), u.value > 0 ? (vue.openBlock(), vue.createElementBlock("div", tr, [ vue.createElementVNode("div", nr, [ vue.createElementVNode("button", {
                type: "button",
                class: "pager-btn",
                disabled: l.value <= 1,
                onClick: goPrev
            }, "\u4e0a\u4e00\u9875", 8, ar), vue.createElementVNode("div", or, [ vue.createTextVNode(" \u7b2c "), vue.withDirectives(vue.createElementVNode("input", {
                type: "number",
                class: "pager-input",
                min: 1,
                max: d.value || 1,
                "onUpdate:modelValue": i[2] || (i[2] = e => l.value = e),
                onChange: i[3] || (i[3] = e => handlePageChange(l.value))
            }, null, 40, sr), [ [ vue.vModelText, l.value, void 0, {
                number: !0
            } ] ]), vue.createTextVNode(" / " + vue.toDisplayString(d.value || 1) + " \u9875 ", 1) ]), vue.createElementVNode("button", {
                type: "button",
                class: "pager-btn",
                disabled: l.value >= (d.value || 1),
                onClick: goNext
            }, "\u4e0b\u4e00\u9875", 8, ir), vue.createElementVNode("div", rr, "\u5171 " + vue.toDisplayString(u.value) + " \u6761", 1) ]) ])) : vue.createCommentVNode("", !0) ]));
        }
    }), pr = {
        class: "log-container"
    }, cr = vue.createElementVNode("div", {
        class: "log-head"
    }, [ vue.createElementVNode("div", {
        class: "log-cell cell-time"
    }, "\u65f6\u95f4"), vue.createElementVNode("div", {
        class: "log-cell cell-content"
    }, "\u5185\u5bb9") ], -1), ur = {
        key: 0,
        class: "log-empty"
    }, dr = {
        class: "log-cell cell-time"
    }, hr = vue.defineComponent({
        __name: "Log",
        setup(e) {
            const t = Nt(), getColor = e => {
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
            return (e, s) => (vue.openBlock(), vue.createElementBlock("div", pr, [ cr, vue.unref(t).logs.length ? (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, {
                key: 1
            }, vue.renderList(vue.unref(t).logs, ((e, t) => (vue.openBlock(), vue.createElementBlock("div", {
                key: t,
                class: "log-row"
            }, [ vue.createElementVNode("div", dr, vue.toDisplayString(e.time), 1), vue.createElementVNode("div", {
                class: "log-cell cell-content",
                style: vue.normalizeStyle({
                    color: getColor(e.type)
                })
            }, vue.toDisplayString(e.content), 5) ])))), 128)) : (vue.openBlock(), vue.createElementBlock("div", ur, "\u6682\u65e0\u65e5\u5fd7")) ]));
        }
    }), mr = defineStore("ai", {
        state: () => ({
            aiMsg: "",
            aiLoading: !1
        }),
        actions: {
            currentAiMd() {
                return simpleMarkdownToHtml(this.aiMsg);
            },
            resetAi() {
                this.aiMsg = "", this.aiLoading = !1;
            }
        }
    }), fr = {
        class: "ai-container"
    }, gr = {
        class: "basic-card search-card"
    }, yr = vue.createElementVNode("div", {
        class: "card-header"
    }, [ vue.createElementVNode("span", {
        class: "card-title"
    }, "\ud83e\udd16 AI\u667a\u80fd\u641c\u9898") ], -1), xr = {
        class: "mode-switch"
    }, br = [ "onClick" ], vr = {
        key: 0,
        class: "question-type-select native-select"
    }, wr = vue.createElementVNode("label", null, "\u9898\u578b\u9009\u62e9", -1), kr = [ "value" ], _r = vue.createElementVNode("p", {
        class: "helper-text"
    }, "\u7c98\u8d34\u9898\u5e72\u53ca\u9009\u9879\uff0c\u7cfb\u7edf\u4f1a\u81ea\u52a8\u89e3\u6790\u5e76\u641c\u7d22\u5b98\u65b9\u9898\u5e93", -1), qr = [ "disabled" ], Cr = {
        key: 0
    }, Tr = {
        key: 1
    }, Ar = {
        key: 0,
        class: "basic-card result-card"
    }, Sr = {
        class: "card-header"
    }, Ur = vue.createElementVNode("span", {
        class: "card-title"
    }, "\ud83d\udca1 AI\u89e3\u7b54", -1), Hr = {
        key: 0,
        class: "pill pill-success"
    }, Er = {
        class: "result-content"
    }, Ir = {
        key: 0,
        class: "soft-loading"
    }, jr = [ "innerHTML" ], zr = {
        key: 2,
        class: "empty-block"
    }, Or = vue.createElementVNode("div", {
        class: "empty-emoji"
    }, "\ud83e\udd16", -1), $r = vue.createElementVNode("p", {
        class: "empty-text"
    }, "AI\u7b54\u9898\u4ec5\u4f9b\u53c2\u8003\uff0c\u4e0d\u4fdd\u8bc1\u51c6\u786e\u6027", -1), Lr = [ Or, $r ], Pr = {
        key: 1,
        class: "basic-card result-card"
    }, Fr = {
        class: "card-header"
    }, Mr = vue.createElementVNode("span", {
        class: "card-title"
    }, "\ud83d\udcda \u7231\u95ee\u7b54\u9898\u5e93", -1), Nr = {
        class: "result-content"
    }, Dr = {
        key: 0,
        class: "soft-loading"
    }, Br = {
        key: 1,
        class: "soft-alert warning"
    }, Vr = [ "innerHTML" ], Gr = {
        key: 2,
        class: "official-meta"
    }, Rr = {
        class: "meta-row"
    }, Jr = vue.createElementVNode("div", {
        class: "meta-label"
    }, "\u89e3\u6790\u9898\u5e72", -1), Qr = [ "innerHTML" ], Wr = {
        key: 0,
        class: "meta-row"
    }, Kr = vue.createElementVNode("div", {
        class: "meta-label"
    }, "\u89e3\u6790\u9009\u9879", -1), Yr = {
        class: "meta-options"
    }, Xr = {
        class: "option-label"
    }, Zr = [ "innerHTML" ], el = {
        key: 3,
        class: "official-result-list"
    }, tl = {
        class: "official-result-header"
    }, nl = {
        class: "official-result-title"
    }, al = vue.createElementVNode("span", {
        class: "official-result-subtitle"
    }, "\u6839\u636e\u9898\u5e72\u76f8\u4f3c\u5ea6\u6392\u5e8f", -1), ol = {
        class: "pill pill-primary"
    }, sl = {
        class: "official-section"
    }, il = vue.createElementVNode("div", {
        class: "section-label"
    }, "\u9898\u5e72", -1), rl = [ "innerHTML" ], ll = {
        key: 0,
        class: "official-section"
    }, pl = vue.createElementVNode("div", {
        class: "section-label"
    }, "\u9009\u9879", -1), cl = {
        class: "official-options"
    }, ul = {
        class: "option-label"
    }, dl = [ "innerHTML" ], hl = {
        class: "official-section"
    }, ml = vue.createElementVNode("div", {
        class: "section-label"
    }, "\u53c2\u8003\u7b54\u6848", -1), fl = {
        class: "answer-chips"
    }, gl = {
        key: 0,
        class: "answer-empty"
    }, yl = {
        key: 4,
        class: "empty-block"
    }, xl = [ vue.createElementVNode("div", {
        class: "empty-emoji"
    }, "\ud83d\udd0d", -1), vue.createElementVNode("p", {
        class: "empty-text"
    }, "\u672a\u5339\u914d\u5230\u7ed3\u679c\uff0c\u8bd5\u8bd5\u4f18\u5316\u9898\u5e72\u6216\u8c03\u6574\u9898\u578b", -1) ], bl = {
        key: 5,
        class: "empty-block"
    }, vl = [ vue.createElementVNode("div", {
        class: "empty-emoji"
    }, "\ud83d\udcc4", -1), vue.createElementVNode("p", {
        class: "empty-text"
    }, "\u8f93\u5165\u9898\u5e72\u5e76\u70b9\u51fb\u641c\u7d22\uff0c\u5373\u53ef\u5339\u914d\u5b98\u65b9\u9898\u5e93", -1) ], wl = {
        key: 2,
        class: "basic-card copyright-card"
    }, kl = vue.createElementVNode("div", {
        class: "card-header"
    }, [ vue.createElementVNode("span", {
        class: "card-title"
    }, "\u2139\ufe0f \u670d\u52a1\u8bf4\u660e") ], -1), _l = [ "innerHTML" ], ql = vue.defineComponent({
        __name: "Ai",
        setup(e) {
            const t = getApp(), s = t.gpt[t.gptIndex], r = mr(), l = Nt(), p = Qt(), u = vue.ref(""), d = vue.ref("1"), h = [ {
                label: "\u5355\u9009\u9898",
                value: "0"
            }, {
                label: "\u591a\u9009\u9898",
                value: "1"
            }, {
                label: "\u586b\u7a7a\u9898",
                value: "2"
            }, {
                label: "\u5224\u65ad\u9898",
                value: "3"
            }, {
                label: "\u7b80\u7b54\u9898",
                value: "4"
            }, {
                label: "\u5176\u5b83/\u81ea\u52a8",
                value: "8"
            } ], m = vue.ref(h[0].value), f = vue.ref(!1), g = vue.ref([]), y = vue.ref(!1), x = vue.ref(""), v = vue.ref(!1), k = vue.ref({
                question: "",
                options: []
            }), A = vue.ref(!1), S = vue.computed((() => "1" === d.value)), U = vue.computed((() => S.value ? r.aiLoading : y.value));
            vue.computed((() => U.value ? "\u641c\u7d22\u4e2d..." : "\u5f00\u59cb\u641c\u7d22"));
            const E = h.reduce(((e, t) => (e[t.value] = t.label.replace("/\u81ea\u52a8", ""), 
            e)), {}), formatAnswer = e => {
                if (Array.isArray(e)) return e.map((e => "string" == typeof e ? e.trim() : String(e).trim())).filter(Boolean);
                if ("object" == typeof e && null !== e) return Object.values(e).map((e => "string" == typeof e ? e.trim() : String(e).trim())).filter(Boolean);
                if ("string" == typeof e) {
                    const t = e.replace(/[\r\n]+/g, " ").trim();
                    return t ? /[,\uff0c\u3001/;\uff1b\s]/.test(t) ? t.split(/[,\uff0c\u3001/;\uff1b\s]+/).map((e => e.trim())).filter(Boolean) : [ t ] : [];
                }
                return [];
            };
            vue.watch(d, (e => {
                "1" === e ? (g.value = [], x.value = "", v.value = !1, k.value = {
                    question: "",
                    options: []
                }, y.value = !1, f.value = !1, m.value = h[0].value, A.value = !1) : r.resetAi();
            }));
            const handleOfficialSearch = async e => {
                const t = (e => {
                    const t = e.replace(/\r/g, "\n").split("\n").map((e => e.trim())).filter(Boolean), n = /^[A-Ha-h][\.\u3001\)\uff0e\u3002]?\s*/, a = [], o = [];
                    let s = !1;
                    return t.forEach((e => {
                        n.test(e) ? (s = !0, o.push(e.replace(n, "").trim())) : s && o.length ? o[o.length - 1] = `${o[o.length - 1]} ${e}`.trim() : a.push(e);
                    })), {
                        question: a.join(" ").replace(/^\d+[\.\u3001\uff0e\s]+/, "").trim(),
                        options: o.filter(Boolean)
                    };
                })(e);
                if (t.question) {
                    var n, a;
                    n = t.question, a = t.options, f.value || (m.value = ((e, t) => {
                        const n = e.replace(/\s/g, "");
                        return /\u591a\u9009|\u591a\u9879|\u9009\u62e9[\u4e24\u4e8c\u4e8c]?/.test(n) ? "1" : /\u5224\u65ad|\u6b63\u8bef|\u5bf9\u9519|\u662f\u975e/.test(n) ? "3" : /\u586b\u7a7a|\u7a7a\u683c|\u586b\u8865|\uff08\s*\uff09/.test(e) || /\(\s*\)/.test(e) ? "2" : /\u7b80\u7b54|\u7b80\u8ff0|\u8bba\u8ff0|\u8bf4\u660e|\u5206\u6790|\u4e3a\u4f55|\u4e3a\u4ec0\u4e48/.test(n) ? "4" : t.length >= 1 ? 2 === t.length && t.every((e => /(\u6b63\u786e|\u9519\u8bef|\u5bf9|\u9519)/.test(e))) ? "3" : t.length > 1 && /\u591a\u9009/.test(e) ? "1" : "0" : "8";
                    })(n, a)), k.value = t, v.value = !0, y.value = !0, x.value = "", A.value = !1, 
                    g.value = [];
                    try {
                        const {success: e, message: n, data: a, needLogin: o} = await p.fuzzySearchQuestion({
                            question: t.question,
                            type: Number(m.value),
                            options: t.options
                        });
                        e ? (g.value = a, a.length || (x.value = "\u5b98\u65b9\u9898\u5e93\u6682\u672a\u6536\u5f55\u8be5\u9898\uff0c\u53ef\u5c1d\u8bd5\u8865\u5145\u9898\u5e72\u6216\u8c03\u6574\u9898\u578b"), 
                        A.value = !1) : (x.value = n, A.value = !!o || /\u767b\u5f55/.test(n), msg(n, "warning"));
                    } catch (o) {
                        const e = (null == o ? void 0 : o.message) || "\u5b98\u65b9\u9898\u5e93\u641c\u7d22\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5";
                        x.value = e, A.value = /\u767b\u5f55/.test(e), msg(e, "error");
                    } finally {
                        y.value = !1;
                    }
                } else msg("\u8bf7\u5148\u8f93\u5165\u5b8c\u6574\u7684\u9898\u5e72\u5185\u5bb9", "warning");
            }, search = async () => {
                const e = u.value.trim();
                e ? S.value ? await (async e => {
                    r.resetAi(), r.aiLoading = !0;
                    try {
                        await aiAsk(e, (e => {
                            r.aiLoading = !1, r.aiMsg += e, console.log(r.aiMsg);
                        }), (() => {
                            r.aiMsg.length <= 0 && (r.aiMsg = s.msg);
                        }), "\u4f60\u662f\u4e00\u4e2a\u4e13\u4e1a\u7684\u7b54\u9898\u52a9\u624b\uff0c\u8bf7\u6839\u636e\u7528\u6237\u63d0\u4f9b\u7684\u9898\u76ee\u8fdb\u884c\u89e3\u7b54\u3002\n\n\u8981\u6c42\uff1a\n1. \u4ed4\u7ec6\u5206\u6790\u9898\u76ee\u5185\u5bb9\uff0c\u7406\u89e3\u9898\u76ee\u8981\u6c42\n2. \u63d0\u4f9b\u51c6\u786e\u3001\u7b80\u6d01\u7684\u7b54\u6848\n3. \u5982\u679c\u662f\u9009\u62e9\u9898\uff0c\u8bf7\u76f4\u63a5\u7ed9\u51fa\u6b63\u786e\u9009\u9879\uff08\u5982\uff1aA\u3001B\u3001C\u3001D\u6216\u591a\u9009\u7ec4\u5408\uff09\n4. \u5982\u679c\u662f\u586b\u7a7a\u9898\u6216\u7b80\u7b54\u9898\uff0c\u8bf7\u7ed9\u51fa\u7b80\u660e\u627c\u8981\u7684\u7b54\u6848\n5. \u5982\u679c\u9898\u76ee\u4e0d\u6e05\u6670\u6216\u65e0\u6cd5\u786e\u5b9a\u7b54\u6848\uff0c\u8bf7\u8bf4\u660e\u539f\u56e0\n6. \u56de\u7b54\u8981\u6709\u6761\u7406\uff0c\u5fc5\u8981\u65f6\u53ef\u4ee5\u7b80\u8981\u8bf4\u660e\u7406\u7531\n\n\u8bf7\u5f00\u59cb\u89e3\u7b54\uff1a");
                    } catch (t) {
                        console.error("AI\u68c0\u7d22\u8d85\u65f6\uff0c\u53ef\u80fd\u662f\u7f51\u7edc\u95ee\u9898\u6216\u8005\u5bf9\u5e94GPT\u7684cookie\u5931\u6548", t), 
                        r.aiMsg = s.msg;
                    } finally {
                        r.aiLoading = !1;
                    }
                })(e) : await handleOfficialSearch(e) : msg("\u8bf7\u8f93\u5165\u9898\u76ee\u6216\u95ee\u9898\u5185\u5bb9", "warning");
            }, onQuestionTypeChange = () => {
                f.value = !0;
            }, O = [ {
                label: "AI\u68c0\u7d22",
                value: "1",
                key: "ai"
            }, {
                label: "\u7231\u95ee\u7b54\u9898\u5e93",
                value: "2",
                key: "ask"
            } ];
            return (e, t) => (vue.openBlock(), vue.createElementBlock("div", fr, [ vue.createElementVNode("div", gr, [ yr, vue.withDirectives(vue.createElementVNode("textarea", {
                "onUpdate:modelValue": t[0] || (t[0] = e => u.value = e),
                class: "ai-textarea",
                placeholder: "\u8bf7\u8f93\u5165\u9898\u76ee\u6216\u95ee\u9898\uff0cAI\u5c06\u4e3a\u60a8\u63d0\u4f9b\u8be6\u7ec6\u89e3\u7b54...",
                rows: "6"
            }, null, 512), [ [ vue.vModelText, u.value ] ]), vue.createElementVNode("div", xr, [ (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(O, (e => vue.createElementVNode("button", {
                key: e.value,
                type: "button",
                class: vue.normalizeClass([ "pill-btn", {
                    active: d.value === e.value
                } ]),
                onClick: t => d.value = e.value
            }, vue.toDisplayString(e.label), 11, br))), 64)) ]), "2" === d.value ? (vue.openBlock(), vue.createElementBlock("div", vr, [ wr, vue.withDirectives(vue.createElementVNode("select", {
                "onUpdate:modelValue": t[1] || (t[1] = e => m.value = e),
                onChange: onQuestionTypeChange
            }, [ (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(h, (e => vue.createElementVNode("option", {
                key: e.value,
                value: e.value
            }, vue.toDisplayString(e.label), 9, kr))), 64)) ], 544), [ [ vue.vModelSelect, m.value ] ]), _r ])) : vue.createCommentVNode("", !0), vue.createElementVNode("button", {
                class: "btn btn-primary full",
                type: "button",
                onClick: search,
                disabled: U.value
            }, [ U.value ? (vue.openBlock(), vue.createElementBlock("span", Cr, "\u641c\u7d22\u4e2d...")) : (vue.openBlock(), vue.createElementBlock("span", Tr, "\u5f00\u59cb\u641c\u7d22")) ], 8, qr) ]), "1" === d.value && (vue.unref(r).aiMsg || vue.unref(r).aiLoading) ? (vue.openBlock(), 
            vue.createElementBlock("div", Ar, [ vue.createElementVNode("div", Sr, [ Ur, vue.unref(r).aiLoading ? vue.createCommentVNode("", !0) : (vue.openBlock(), vue.createElementBlock("span", Hr, "\u89e3\u7b54\u5b8c\u6210")) ]), vue.createElementVNode("div", Er, [ vue.unref(r).aiLoading ? (vue.openBlock(), 
            vue.createElementBlock("div", Ir, "AI \u6b63\u5728\u751f\u6210...")) : vue.unref(r).aiMsg ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 1,
                innerHTML: vue.unref(r).currentAiMd(),
                class: "markdown-body"
            }, null, 8, jr)) : (vue.openBlock(), vue.createElementBlock("div", zr, Lr)) ]) ])) : vue.createCommentVNode("", !0), "2" === d.value ? (vue.openBlock(), 
            vue.createElementBlock("div", Pr, [ vue.createElementVNode("div", Fr, [ Mr, vue.createElementVNode("span", {
                class: vue.normalizeClass([ "pill", g.value.length ? "pill-success" : "pill-primary" ])
            }, vue.toDisplayString(g.value.length ? "\u5339\u914d\u5b8c\u6210" : "\u7b49\u5f85\u641c\u7d22"), 3) ]), vue.createElementVNode("div", Nr, [ y.value ? (vue.openBlock(), 
            vue.createElementBlock("div", Dr, "\u641c\u7d22\u4e2d...")) : vue.createCommentVNode("", !0), x.value ? (vue.openBlock(), vue.createElementBlock("div", Br, [ vue.createElementVNode("span", {
                innerHTML: x.value
            }, null, 8, Vr), A.value ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                class: "link-btn",
                type: "button",
                onClick: t[2] || (t[2] = e => vue.unref(l).setPage("user"))
            }, " \u70b9\u51fb\u767b\u5f55 ")) : vue.createCommentVNode("", !0) ])) : vue.createCommentVNode("", !0), k.value.question ? (vue.openBlock(), 
            vue.createElementBlock("div", Gr, [ vue.createElementVNode("div", Rr, [ Jr, vue.createElementVNode("div", {
                class: "meta-value",
                innerHTML: k.value.question
            }, null, 8, Qr) ]), k.value.options.length ? (vue.openBlock(), vue.createElementBlock("div", Wr, [ Kr, vue.createElementVNode("div", Yr, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(k.value.options, ((e, t) => (vue.openBlock(), vue.createElementBlock("div", {
                key: `parsed-${t}`,
                class: "meta-option"
            }, [ vue.createElementVNode("span", Xr, vue.toDisplayString(String.fromCharCode(65 + t)) + ".", 1), vue.createElementVNode("span", {
                class: "option-text",
                innerHTML: e
            }, null, 8, Zr) ])))), 128)) ]) ])) : vue.createCommentVNode("", !0) ])) : vue.createCommentVNode("", !0), g.value.length ? (vue.openBlock(), 
            vue.createElementBlock("div", el, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(g.value, ((e, t) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                    key: `official-${t}`,
                    class: "official-result-item"
                }, [ vue.createElementVNode("div", tl, [ vue.createElementVNode("div", null, [ vue.createElementVNode("span", nl, "\u5339\u914d\u9898\u76ee " + vue.toDisplayString(t + 1), 1), al ]), vue.createElementVNode("span", ol, vue.toDisplayString((s = e.type, 
                E[String(s)] || "\u5176\u5b83\u9898\u578b")), 1) ]), vue.createElementVNode("div", sl, [ il, vue.createElementVNode("div", {
                    class: "official-question",
                    innerHTML: e.question
                }, null, 8, rl) ]), e.options && e.options.length ? (vue.openBlock(), vue.createElementBlock("div", ll, [ pl, vue.createElementVNode("ul", cl, [ (vue.openBlock(!0), 
                vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, ((e, s) => (vue.openBlock(), vue.createElementBlock("li", {
                    key: `opt-${t}-${s}`
                }, [ vue.createElementVNode("span", ul, vue.toDisplayString(String.fromCharCode(65 + s)) + ".", 1), vue.createElementVNode("span", {
                    class: "option-text",
                    innerHTML: e
                }, null, 8, dl) ])))), 128)) ]) ])) : vue.createCommentVNode("", !0), vue.createElementVNode("div", hl, [ ml, vue.createElementVNode("div", fl, [ (vue.openBlock(!0), 
                vue.createElementBlock(vue.Fragment, null, vue.renderList(formatAnswer(e.answer), ((e, o) => (vue.openBlock(), vue.createElementBlock("span", {
                    key: `answer-${t}-${o}`,
                    class: "pill pill-success"
                }, vue.toDisplayString(e), 1)))), 128)), formatAnswer(e.answer).length ? vue.createCommentVNode("", !0) : (vue.openBlock(), vue.createElementBlock("span", gl, "\u6682\u65e0\u7b54\u6848\u4fe1\u606f")) ]) ]) ]);
                var s;
            })), 128)) ])) : !v.value || x.value || y.value ? x.value || y.value ? vue.createCommentVNode("", !0) : (vue.openBlock(), 
            vue.createElementBlock("div", bl, vl)) : (vue.openBlock(), vue.createElementBlock("div", yl, xl)) ]) ])) : vue.createCommentVNode("", !0), "1" === d.value ? (vue.openBlock(), 
            vue.createElementBlock("div", wl, [ kl, vue.createElementVNode("div", {
                class: "copyright-content",
                innerHTML: vue.unref(markToHtml)(`\u5f53\u524d\u91c7\u7528\u7684\u662f **${vue.unref(s).name}** \u670d\u52a1\uff0c\u4ec5\u4f9b\u6d4b\u8bd5\u4f7f\u7528\uff0c\u4e0d\u4fdd\u8bc1\u51c6\u786e\u6027\u3002\n    \n\u5982\u6709\u4fb5\u6743\uff0c\u8bf7\u8054\u7cfb\u6211\u4eec\u5220\u9664\u3002\n    \n\u8bf7\u5927\u5bb6\u591a\u591a\u652f\u6301\u5b98\u65b9\uff1a[${vue.unref(s).home}](${vue.unref(s).home})`)
            }, null, 8, _l) ])) : vue.createCommentVNode("", !0) ]));
        }
    }), Cl = {
        class: "param-table-card"
    }, Tl = vue.createElementVNode("div", {
        class: "param-table-header"
    }, [ vue.createElementVNode("span", null, "Key"), vue.createElementVNode("span", null, "Value \u8bbe\u7f6e"), vue.createElementVNode("span", null, "\u64cd\u4f5c") ], -1), Al = [ "onUpdate:modelValue" ], Sl = {
        class: "param-value-group"
    }, Ul = [ "onUpdate:modelValue" ], Hl = [ vue.createElementVNode("option", {
        value: "preset"
    }, "\u5185\u7f6e\u503c", -1), vue.createElementVNode("option", {
        value: "custom"
    }, "\u81ea\u5b9a\u4e49", -1), vue.createElementVNode("option", {
        value: "code"
    }, "\u4ee3\u7801", -1) ], El = [ "onUpdate:modelValue" ], Il = [ "onUpdate:modelValue" ], jl = [ "value" ], zl = {
        key: 2,
        class: "param-code-wrapper"
    }, Ol = [ "onUpdate:modelValue" ], $l = [ "onClick" ], Ll = {
        key: 0,
        class: "param-error"
    }, Pl = [ "onClick" ], Fl = vue.defineComponent({
        __name: "ParamTable",
        props: {
            data: {},
            presetValues: {}
        },
        setup(e) {
            const t = e, s = t.presetValues || [];
            vue.watchEffect((() => {
                t.data.forEach((e => {
                    e.valueType || (e.valueType = "custom");
                }));
            }));
            return (e, t) => (vue.openBlock(), vue.createElementBlock("div", Cl, [ Tl, (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.data, ((t, i) => (vue.openBlock(), 
            vue.createElementBlock("div", {
                class: "param-table-row",
                key: i
            }, [ vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": e => t.key = e,
                class: "base-input param-key",
                type: "text",
                placeholder: "Key"
            }, null, 8, Al), [ [ vue.vModelText, t.key ] ]), vue.createElementVNode("div", Sl, [ vue.withDirectives(vue.createElementVNode("select", {
                "onUpdate:modelValue": e => t.valueType = e,
                class: "base-select param-type"
            }, Hl, 8, Ul), [ [ vue.vModelSelect, t.valueType ] ]), "custom" === t.valueType ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 0,
                "onUpdate:modelValue": e => t.value = e,
                class: "base-input param-value",
                type: "text",
                placeholder: "Value"
            }, null, 8, El)), [ [ vue.vModelText, t.value ] ]) : "preset" === t.valueType ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("select", {
                key: 1,
                "onUpdate:modelValue": e => t.value = e,
                class: "base-select param-value"
            }, [ (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(s), (e => (vue.openBlock(), vue.createElementBlock("option", {
                key: e.key,
                value: e.value
            }, vue.toDisplayString(e.label), 9, jl)))), 128)) ], 8, Il)), [ [ vue.vModelSelect, t.value ] ]) : (vue.openBlock(), vue.createElementBlock("div", zl, [ vue.withDirectives(vue.createElementVNode("textarea", {
                "onUpdate:modelValue": e => t.value = e,
                class: "base-input param-code",
                placeholder: "\u8bf7\u8f93\u5165\u4ee3\u7801"
            }, null, 8, Ol), [ [ vue.vModelText, t.value ] ]), vue.createElementVNode("button", {
                class: "btn btn-primary btn-small",
                type: "button",
                onClick: e => (e => {
                    if ("code" === e.valueType) try {
                        e.error = "";
                        const t = new Function(`return ${e.value}`)();
                        console.log("\u4ee3\u7801\u8fd0\u884c\u7ed3\u679c\uff1a", t), e.error = "";
                    } catch (t) {
                        console.error("\u4ee3\u7801\u8fd0\u884c\u9519\u8bef\uff1a", t), e.error = `\u4ee3\u7801\u8fd0\u884c\u9519\u8bef: ${t.message}`;
                    }
                })(t)
            }, " \u8fd0\u884c\u4ee3\u7801 ", 8, $l), t.error ? (vue.openBlock(), vue.createElementBlock("div", Ll, vue.toDisplayString(t.error), 1)) : vue.createCommentVNode("", !0) ])) ]), vue.createElementVNode("button", {
                class: "btn btn-outline btn-small",
                type: "button",
                onClick: t => e.$emit("remove", i)
            }, " \u5220\u9664 ", 8, Pl) ])))), 128)), vue.createElementVNode("button", {
                class: "btn btn-primary btn-small",
                type: "button",
                onClick: t[0] || (t[0] = t => e.$emit("add"))
            }, "\u6dfb\u52a0") ]));
        }
    }), Ml = {
        class: "api-component"
    }, Nl = vue.createElementVNode("div", {
        class: "soft-alert error mb-10"
    }, "\u5f00\u53d1\u4e2d.....\u6682\u4e0d\u53ef\u7528", -1), Dl = {
        class: "request-builder"
    }, Bl = {
        class: "api-row"
    }, Vl = [ "value" ], Gl = [ "disabled" ], Rl = {
        class: "tab-switch"
    }, Jl = [ "onClick" ], Ql = {
        key: 0,
        class: "tab-panel"
    }, Wl = {
        key: 1,
        class: "tab-panel"
    }, Kl = {
        key: 2,
        class: "tab-panel"
    }, Yl = [ "disabled" ], Xl = [ "value" ], Zl = {
        key: 0,
        class: "muted-text"
    }, ep = {
        key: 1,
        class: "body-json"
    }, tp = {
        class: "json-actions"
    }, np = {
        key: 0,
        class: "error-message"
    }, ap = {
        key: 2
    }, op = {
        class: "tab-switch mt-20"
    }, sp = [ "onClick" ], ip = {
        class: "tab-panel"
    }, rp = {
        key: 0
    }, lp = {
        key: 0,
        class: "json-preview"
    }, pp = [ "innerHTML" ], cp = {
        key: 2,
        class: "json-preview"
    }, up = {
        key: 1,
        class: "json-preview"
    }, dp = {
        key: 2,
        class: "json-preview"
    }, hp = {
        key: 3,
        class: "json-preview"
    }, mp = vue.createElementVNode("div", {
        class: "section-divider"
    }, null, -1), fp = {
        class: "answer-extract"
    }, gp = vue.createElementVNode("div", {
        class: "soft-alert info"
    }, "\u8bf7\u9009\u62e9\u63d0\u53d6\u7b54\u6848\u7684\u65b9\u5f0f\uff08\u5b57\u6bb5\u8def\u5f84\u6216\u81ea\u5b9a\u4e49\u51fd\u6570\uff09", -1), yp = {
        class: "radio-group"
    }, xp = {
        class: "answer-actions"
    }, bp = {
        key: 2,
        class: "mt-10"
    }, vp = vue.createElementVNode("strong", null, "\u63d0\u53d6\u7684\u7b54\u6848\uff1a", -1), wp = vue.defineComponent({
        __name: "ApiComponent",
        setup(e) {
            const t = [ "GET", "POST" ], s = vue.ref("POST"), r = vue.ref("http://cx.icodef.com/wyn-nb?v=4"), l = vue.ref([]), p = vue.ref([]), c = vue.ref('{\n    "question": "$question",\n    "options": "$options",\n    "type": "$type"\n}'), u = vue.ref([ {
                key: "question",
                value: "$question",
                valueType: "preset"
            }, {
                key: "options",
                value: "$options",
                valueType: "preset"
            }, {
                key: "type",
                value: "$type",
                valueType: "preset"
            } ]), d = vue.ref("json"), h = [ {
                label: "None",
                value: "none"
            }, {
                label: "JSON",
                value: "json"
            }, {
                label: "x-www-form-urlencoded",
                value: "urlencoded"
            } ], m = [ {
                key: "timestamp",
                label: "\u5f53\u524d\u65f6\u95f4\u6233",
                value: "$timestamp"
            }, {
                key: "random",
                label: "\u968f\u673a\u6570",
                value: "$random"
            }, {
                key: "question",
                label: "\u9898\u5e72",
                value: "$question"
            }, {
                key: "options",
                label: "\u9009\u9879",
                value: "$options"
            }, {
                key: "type",
                label: "\u9898\u578b",
                value: "$type"
            }, {
                key: "typename",
                label: "\u9898\u578b\u540d",
                value: "$typename"
            } ], f = {
                timestamp: Date.now(),
                random: Math.random(),
                question: "\u6025\u6027\u5417\u5561\u4e2d\u6bd2\u7684\u62ee\u6297\u5242\u662f:",
                options: [ "\u7eb3\u916a\u916e", "\u66f2\u9a6c\u6735", "\u5c3c\u83ab\u5730\u5e73", "\u963f\u6258\u54c1", "\u80be\u4e0a\u817a\u7d20" ],
                type: "0",
                typename: "\u5355\u9009\u9898"
            }, g = [ {
                label: "Query",
                name: "query"
            }, {
                label: "Headers",
                name: "headers"
            }, {
                label: "Body",
                name: "body"
            } ], y = [ {
                label: "Body",
                name: "body"
            }, {
                label: "\u8bf7\u6c42\u53c2\u6570",
                name: "request-headers"
            }, {
                label: "\u54cd\u5e94\u5934",
                name: "response-headers"
            }, {
                label: "\u539f\u59cb\u54cd\u5e94",
                name: "raw"
            } ], x = vue.ref({
                data: "",
                headers: "",
                raw: "",
                contentType: ""
            }), v = vue.ref(""), w = vue.ref("body"), k = vue.ref("body"), A = vue.ref(!0), S = vue.ref(!1), E = vue.computed((() => [ "GET", "DELETE" ].includes(s.value)));
            function replacePresetValues(e, t) {
                if ("string" == typeof e) return e.replace(/\$(\w+)/g, ((e, n) => void 0 !== t[n] ? t[n] : `$${n}`));
                if (Array.isArray(e)) return e.map((e => replacePresetValues(e, t)));
                if ("object" == typeof e && null !== e) {
                    const n = {};
                    for (const a in e) n[a] = replacePresetValues(e[a], t);
                    return n;
                }
                return e;
            }
            function generateGMConfig() {
                const e = p.value.filter((e => e.key)).map((e => {
                    const t = replacePresetValues(e.value, f);
                    return `${encodeURIComponent(e.key)}=${encodeURIComponent(t)}`;
                })).join("&"), t = e ? `${r.value}?${e}` : r.value, n = {};
                l.value.forEach((({key: e, value: t}) => {
                    e && (n[e] = t);
                })), n["Content-Type"] = "json" === d.value ? "application/json" : "application/x-www-form-urlencoded";
                let a = null;
                if ("json" === d.value) try {
                    const e = replacePresetValues(JSON.parse(c.value || "{}"), f);
                    a = JSON.stringify(e);
                } catch (o) {
                    console.error("JSON \u89e3\u6790\u5931\u8d25\uff1a", o);
                } else if ("urlencoded" === d.value) {
                    a = u.value.map((e => ({
                        key: e.key,
                        value: replacePresetValues(e.value, f)
                    }))).filter((e => e.key)).map((e => `${encodeURIComponent(e.key)}=${encodeURIComponent(e.value)}`)).join("&");
                }
                return {
                    method: s.value,
                    url: t,
                    headers: n,
                    data: a
                };
            }
            function validateJson() {
                try {
                    JSON.parse(c.value), A.value = !0;
                } catch {
                    A.value = !1;
                }
            }
            function formatJson() {
                if (!A.value) return msg("JSON \u683c\u5f0f\u65e0\u6548\uff0c\u8bf7\u68c0\u67e5\uff01");
                c.value = JSON.stringify(JSON.parse(c.value), null, 2);
            }
            function addRow(e) {
                e.push({
                    key: "",
                    value: "",
                    valueType: "custom"
                });
            }
            function removeRow(e, t) {
                e.splice(t, 1);
            }
            function sendRequest() {
                if ("json" === d.value && !A.value) return msg("JSON \u683c\u5f0f\u65e0\u6548\uff0c\u8bf7\u68c0\u67e5\uff01");
                S.value = !0;
                const e = generateGMConfig();
                ye({
                    method: e.method,
                    url: e.url,
                    headers: e.headers,
                    data: e.data || void 0,
                    onload: e => {
                        !function(e) {
                            var t;
                            const n = (null == (t = e.responseHeaders.match(/content-type:\s?([\w/+-]+)/i)) ? void 0 : t[1]) || "", a = function(e, t) {
                                if (t.includes("application/json")) try {
                                    return JSON.stringify(JSON.parse(e), null, 2);
                                } catch {
                                    return "\u65e0\u6cd5\u89e3\u6790\u7684 JSON \u6570\u636e";
                                }
                                return t.includes("text/html") || t.includes("text/plain") ? e : `\u65e0\u6cd5\u89e3\u6790\u7684\u54cd\u5e94\u7c7b\u578b\uff1a${t}`;
                            }(e.responseText, n);
                            v.value = JSON.stringify(generateGMConfig(), null, 2), x.value = {
                                data: a,
                                headers: e.responseHeaders,
                                raw: e.responseText,
                                contentType: n
                            };
                        }(e), S.value = !1;
                    },
                    onerror: e => {
                        !function(e) {
                            x.value = {
                                data: e.message || "\u8bf7\u6c42\u5931\u8d25",
                                headers: "",
                                raw: "",
                                contentType: ""
                            }, msg(`\u8bf7\u6c42\u9519\u8bef: ${e.message || "\u672a\u77e5\u9519\u8bef"}`);
                        }(e), S.value = !1;
                    }
                });
            }
            const $ = vue.ref("data"), L = vue.ref('(res) => res.code === 1 ? /\u53db\u9006|\u516c\u4f17\u53f7|\u674e\u6052\u96c5|\u4e00\u4e4b/.test(res.data) ? null : res.data.replace(/javascript:void\\(0\\);/g, "").trim().replace(/\\n/g, "").split("#") : null'), P = vue.ref("field"), M = vue.ref("");
            function extractAnswer() {
                if ($.value || L.value) try {
                    const e = JSON.parse(x.value.data);
                    if ("function" === P.value) {
                        const t = new Function("res", `return (${L.value})(res);`);
                        M.value = t(e);
                    } else if ($.value) {
                        const t = function(e, t) {
                            const n = t.split(/\.|\[|\]/).filter((e => e));
                            let a = e;
                            for (const o of n) {
                                if (null == a) return;
                                a = isNaN(Number(o)) ? a[o] : a[Number(o)];
                            }
                            return a;
                        }(e, $.value);
                        M.value = void 0 !== t ? JSON.stringify(t, null, 2) : "\u63d0\u53d6\u7b54\u6848\u5931\u8d25\uff0c\u65e0\u6cd5\u627e\u5230\u5bf9\u5e94\u5b57\u6bb5\u7684\u7b54\u6848";
                    }
                } catch (e) {
                    M.value = "\u63d0\u53d6\u7b54\u6848\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5 JSON \u6570\u636e\u6216\u63d0\u53d6\u903b\u8f91" + e;
                } else msg("\u8bf7\u586b\u5199\u7b54\u6848\u5b57\u6bb5\u8def\u5f84\u6216\u81ea\u5b9a\u4e49\u63d0\u53d6\u51fd\u6570\uff01");
            }
            function saveApi() {
                if (M.value.includes("\u63d0\u53d6\u7b54\u6848\u5931\u8d25")) return void msg("\u63d0\u53d6\u7b54\u6848\u5931\u8d25\uff0c\u65e0\u6cd5\u4fdd\u5b58\u63a5\u53e3\uff01");
                let e = {
                    method: s.value,
                    url: r.value
                };
                const t = {};
                if (l.value.forEach((({key: e, value: n}) => {
                    e && (t[e] = n);
                })), e.headers = t, "GET" === e.method) {
                    e.params = p.value, e.type = "get";
                    const t = p.value.filter((e => e.key)).map((e => {
                        const t = replacePresetValues(e.value, f);
                        return `${encodeURIComponent(e.key)}=${encodeURIComponent(t)}`;
                    })).join("&");
                    e.url = t ? `${r.value}?${t}` : r.value;
                } else if ("json" === d.value) e.data = JSON.parse(c.value), e.type = "json"; else if ("urlencoded" === d.value) {
                    const t = {};
                    for (const e of u.value) t[e.key] = e.value;
                    e.data = t, e.type = "urlencoded";
                }
                "field" === P.value ? e.response = {
                    type: "field",
                    value: $.value
                } : L.value && (e.response = {
                    type: "function",
                    value: L.value
                });
            }
            return (e, i) => (vue.openBlock(), vue.createElementBlock("div", Ml, [ Nl, vue.createElementVNode("div", Dl, [ vue.createElementVNode("div", Bl, [ vue.withDirectives(vue.createElementVNode("select", {
                "onUpdate:modelValue": i[0] || (i[0] = e => s.value = e),
                class: "base-select method-select"
            }, [ (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(t, (e => vue.createElementVNode("option", {
                key: e,
                value: e
            }, vue.toDisplayString(e), 9, Vl))), 64)) ], 512), [ [ vue.vModelSelect, s.value ] ]), vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": i[1] || (i[1] = e => r.value = e),
                class: "base-input url-input",
                type: "text",
                placeholder: "URL"
            }, null, 512), [ [ vue.vModelText, r.value ] ]), vue.createElementVNode("button", {
                class: "btn btn-primary",
                type: "button",
                disabled: S.value,
                onClick: sendRequest
            }, vue.toDisplayString(S.value ? "\u53d1\u9001\u4e2d..." : "\u53d1\u9001\u8bf7\u6c42"), 9, Gl) ]), vue.createElementVNode("div", Rl, [ (vue.openBlock(), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(g, (e => vue.createElementVNode("button", {
                key: e.name,
                class: vue.normalizeClass([ "tab-btn", {
                    active: w.value === e.name
                } ]),
                type: "button",
                onClick: t => w.value = e.name
            }, vue.toDisplayString(e.label), 11, Jl))), 64)) ]), "query" === w.value ? (vue.openBlock(), vue.createElementBlock("div", Ql, [ vue.createVNode(Fl, {
                data: p.value,
                "preset-values": m,
                onAdd: i[2] || (i[2] = e => addRow(p.value)),
                onRemove: i[3] || (i[3] = e => removeRow(p.value, e))
            }, null, 8, [ "data" ]) ])) : "headers" === w.value ? (vue.openBlock(), vue.createElementBlock("div", Wl, [ vue.createVNode(Fl, {
                data: l.value,
                "preset-values": m,
                onAdd: i[4] || (i[4] = e => addRow(l.value)),
                onRemove: i[5] || (i[5] = e => removeRow(l.value, e))
            }, null, 8, [ "data" ]) ])) : (vue.openBlock(), vue.createElementBlock("div", Kl, [ vue.withDirectives(vue.createElementVNode("select", {
                "onUpdate:modelValue": i[6] || (i[6] = e => d.value = e),
                class: "base-select body-type-select",
                disabled: E.value
            }, [ (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(h, (e => vue.createElementVNode("option", {
                key: e.value,
                value: e.value
            }, vue.toDisplayString(e.label), 9, Xl))), 64)) ], 8, Yl), [ [ vue.vModelSelect, d.value ] ]), "none" === d.value ? (vue.openBlock(), 
            vue.createElementBlock("div", Zl, "\u65e0\u8bf7\u6c42\u4f53")) : "json" === d.value ? (vue.openBlock(), vue.createElementBlock("div", ep, [ vue.withDirectives(vue.createElementVNode("textarea", {
                "onUpdate:modelValue": i[7] || (i[7] = e => c.value = e),
                class: vue.normalizeClass([ "base-input json-input", {
                    "is-error": !A.value
                } ]),
                rows: "8",
                placeholder: "JSON \u683c\u5f0f\u7684\u8bf7\u6c42\u4f53",
                onInput: validateJson
            }, null, 34), [ [ vue.vModelText, c.value ] ]), vue.createElementVNode("div", tp, [ vue.createElementVNode("button", {
                class: "btn btn-outline btn-small",
                type: "button",
                onClick: formatJson
            }, "\u683c\u5f0f\u5316 JSON"), A.value ? vue.createCommentVNode("", !0) : (vue.openBlock(), vue.createElementBlock("span", np, "JSON \u683c\u5f0f\u65e0\u6548\uff0c\u8bf7\u68c0\u67e5\uff01")) ]) ])) : (vue.openBlock(), 
            vue.createElementBlock("div", ap, [ vue.createVNode(Fl, {
                data: u.value,
                "preset-values": m,
                onAdd: i[8] || (i[8] = e => addRow(u.value)),
                onRemove: i[9] || (i[9] = e => removeRow(u.value, e))
            }, null, 8, [ "data" ]) ])) ])), vue.createElementVNode("div", op, [ (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(y, (e => vue.createElementVNode("button", {
                key: e.name,
                class: vue.normalizeClass([ "tab-btn", {
                    active: k.value === e.name
                } ]),
                type: "button",
                onClick: t => k.value = e.name
            }, vue.toDisplayString(e.label), 11, sp))), 64)) ]), vue.createElementVNode("div", ip, [ "body" === k.value ? (vue.openBlock(), vue.createElementBlock("div", rp, [ x.value.contentType.includes("application/json") ? (vue.openBlock(), 
            vue.createElementBlock("pre", lp, vue.toDisplayString(x.value.data), 1)) : x.value.contentType.includes("text/html") ? (vue.openBlock(), 
            vue.createElementBlock("div", {
                key: 1,
                class: "html-preview",
                innerHTML: x.value.data
            }, null, 8, pp)) : (vue.openBlock(), vue.createElementBlock("pre", cp, vue.toDisplayString(x.value.data), 1)) ])) : "request-headers" === k.value ? (vue.openBlock(), 
            vue.createElementBlock("pre", up, vue.toDisplayString(v.value), 1)) : "response-headers" === k.value ? (vue.openBlock(), vue.createElementBlock("pre", dp, vue.toDisplayString(x.value.headers), 1)) : (vue.openBlock(), 
            vue.createElementBlock("pre", hp, vue.toDisplayString(x.value.raw), 1)) ]), mp, vue.createElementVNode("div", fp, [ gp, vue.createElementVNode("div", yp, [ vue.createElementVNode("label", null, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "radio",
                value: "field",
                "onUpdate:modelValue": i[10] || (i[10] = e => P.value = e)
            }, null, 512), [ [ vue.vModelRadio, P.value ] ]), vue.createTextVNode(" \u5b57\u6bb5\u8def\u5f84 ") ]), vue.createElementVNode("label", null, [ vue.withDirectives(vue.createElementVNode("input", {
                type: "radio",
                value: "function",
                "onUpdate:modelValue": i[11] || (i[11] = e => P.value = e)
            }, null, 512), [ [ vue.vModelRadio, P.value ] ]), vue.createTextVNode(" \u81ea\u5b9a\u4e49\u51fd\u6570 ") ]) ]), "field" === P.value ? vue.withDirectives((vue.openBlock(), 
            vue.createElementBlock("input", {
                key: 0,
                "onUpdate:modelValue": i[12] || (i[12] = e => $.value = e),
                class: "base-input",
                type: "text",
                placeholder: "\u5b57\u6bb5\u8def\u5f84\uff08\u5982\uff1adata.answer \u6216 data[0].answer\uff09"
            }, null, 512)), [ [ vue.vModelText, $.value ] ]) : vue.createCommentVNode("", !0), "function" === P.value ? vue.withDirectives((vue.openBlock(), 
            vue.createElementBlock("textarea", {
                key: 1,
                "onUpdate:modelValue": i[13] || (i[13] = e => L.value = e),
                class: "base-input",
                rows: "4",
                placeholder: "\u81ea\u5b9a\u4e49\u63d0\u53d6\u51fd\u6570\uff08\u5982\uff1a(data) => data?.data?.answer || '\u672a\u627e\u5230\u7b54\u6848'\uff09"
            }, null, 512)), [ [ vue.vModelText, L.value ] ]) : vue.createCommentVNode("", !0), vue.createElementVNode("div", xp, [ vue.createElementVNode("button", {
                class: "btn btn-primary btn-small",
                type: "button",
                onClick: extractAnswer
            }, "\u63d0\u53d6\u7b54\u6848"), M.value ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                class: "btn btn-primary btn-small",
                type: "button",
                onClick: saveApi
            }, " \u4fdd\u5b58\u63a5\u53e3 ")) : vue.createCommentVNode("", !0) ]), M.value ? (vue.openBlock(), vue.createElementBlock("p", bp, [ vp, vue.createTextVNode(" " + vue.toDisplayString(M.value), 1) ])) : vue.createCommentVNode("", !0) ]) ]) ]));
        }
    }), kp = vue.createElementVNode("h1", {
        class: "text-4xl font-bold"
    }, "\u63a5\u53e3\u5217\u8868", -1), _p = {
        key: 1,
        class: "text-center"
    }, qp = [ vue.createElementVNode("h1", {
        class: "text-4xl font-bold"
    }, "\u5f00\u53d1\u4e2d...", -1), vue.createElementVNode("p", {
        class: "text-lg text-gray-500"
    }, "\u656c\u8bf7\u671f\u5f85", -1) ], Cp = vue.defineComponent({
        __name: "Api",
        setup(e) {
            const t = xe[$t + "api"];
            return vue.ref([ {
                id: 1,
                name: "\u5f20\u4e09",
                age: 25,
                address: "\u4e0a\u6d77"
            }, {
                id: 2,
                name: "\u674e\u56db",
                age: 30,
                address: "\u5317\u4eac"
            }, {
                id: 3,
                name: "\u738b\u4e94",
                age: 28,
                address: "\u5e7f\u5dde"
            } ]), (e, s) => (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [ vue.createElementVNode("div", null, [ kp, vue.createElementVNode("ul", null, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(t).getApiList, (e => (vue.openBlock(), vue.createElementBlock("li", {
                key: e.id
            }, vue.toDisplayString(e.name), 1)))), 128)) ]) ]), vue.unref(false) ? (vue.openBlock(), vue.createBlock(wp, {
                key: 0
            })) : (vue.openBlock(), vue.createElementBlock("div", _p, qp)) ], 64));
        }
    }), Tp = {
        class: "user-page"
    }, Ap = {
        key: 0,
        class: "user-page__login-section"
    }, Sp = {
        class: "user-page__login-box"
    }, Up = {
        class: "user-page__login-header"
    }, Hp = vue.createElementVNode("h2", null, "\u7528\u6237\u767b\u5f55", -1), Ep = vue.createElementVNode("p", null, "\u767b\u5f55\u540e\u5373\u53ef\u4eab\u53d7\u4e91\u540c\u6b65\u4e0e\u4f1a\u5458\u7279\u6743", -1), Ip = {
        class: "user-page__login-switch"
    }, jp = {
        key: 0
    }, zp = {
        class: "form-item"
    }, Op = {
        class: "form-item"
    }, $p = {
        key: 1
    }, Lp = {
        class: "form-item"
    }, Pp = vue.createElementVNode("p", {
        class: "user-page__helper"
    }, "\u53ef\u5728\u5b98\u7f51\u300c\u4e2a\u4eba\u4e2d\u5fc3\u300d\u5237\u65b0 API Key \u540e\u7c98\u8d34\u4f7f\u7528", -1), Fp = [ "disabled" ], Mp = vue.createElementVNode("p", {
        class: "user-page__helper"
    }, "\u82e5\u5fd8\u8bb0\u5bc6\u7801\uff0c\u53ef\u5728\u5b98\u7f51\u627e\u56de\uff1b\u4e5f\u53ef\u4f7f\u7528 API Key \u5feb\u901f\u767b\u5f55", -1), Np = {
        key: 1,
        class: "user-page__dashboard"
    }, Dp = {
        class: "user-page__header-card"
    }, Bp = {
        class: "user-page__avatar"
    }, Vp = [ "src" ], Gp = {
        key: 1
    }, Rp = {
        class: "user-page__info-text"
    }, Jp = {
        class: "user-page__username"
    }, Qp = {
        key: 0,
        class: "pill pill-warn"
    }, Wp = {
        key: 1,
        class: "pill"
    }, Kp = {
        class: "user-page__stats-grid"
    }, Yp = {
        class: "user-page__stat-card"
    }, Xp = vue.createElementVNode("div", {
        class: "user-page__stat-icon user-page__stat-icon--coin"
    }, "\u2b50", -1), Zp = {
        class: "user-page__stat-content"
    }, ec = vue.createElementVNode("p", {
        class: "user-page__stat-label"
    }, "\u79ef\u5206", -1), tc = {
        class: "user-page__stat-value"
    }, nc = {
        class: "user-page__stat-card"
    }, ac = vue.createElementVNode("div", {
        class: "user-page__stat-icon user-page__stat-icon--course"
    }, "\ud83d\udcda", -1), oc = {
        class: "user-page__stat-content"
    }, sc = vue.createElementVNode("p", {
        class: "user-page__stat-label"
    }, "\u8d21\u732e\u8bfe\u7a0b", -1), ic = {
        class: "user-page__stat-value"
    }, rc = {
        class: "user-page__stat-card"
    }, lc = vue.createElementVNode("div", {
        class: "user-page__stat-icon user-page__stat-icon--question"
    }, "\ud83d\udcdd", -1), pc = {
        class: "user-page__stat-content"
    }, cc = vue.createElementVNode("p", {
        class: "user-page__stat-label"
    }, "\u8d21\u732e\u9898\u76ee", -1), uc = {
        class: "user-page__stat-value"
    }, dc = {
        key: 0,
        class: "user-page__support-card"
    }, hc = vue.createElementVNode("div", {
        class: "user-page__support-icon"
    }, "\ud83c\udf81", -1), mc = vue.createElementVNode("div", {
        class: "user-page__support-content"
    }, [ vue.createElementVNode("p", {
        class: "user-page__support-title"
    }, "\u7231\u53d1\u7535\u8ba2\u9605"), vue.createElementVNode("p", {
        class: "user-page__support-desc"
    }, "\u652f\u6301\u9879\u76ee\u6301\u7eed\u8fed\u4ee3\uff0c\u89e3\u9501\u66f4\u591a\u4f1a\u5458\u6743\u76ca") ], -1), fc = [ "href" ], gc = vue.createElementVNode("div", {
        class: "user-page__tips"
    }, [ vue.createElementVNode("p", null, "\u5f53\u524d\u7528\u6237\u4f53\u7cfb\u4ec5\u7528\u4e8e\u9898\u5e93\u7f13\u5b58\u4e91\u540c\u6b65\uff0c\u66f4\u591a\u529f\u80fd\u5f00\u53d1\u4e2d") ], -1), yc = vue.defineComponent({
        __name: "User",
        setup(e) {
            const t = Qt(), s = vue.ref("password"), r = vue.ref({
                username: "",
                password: ""
            }), l = vue.ref(""), p = vue.ref(!1), c = vue.computed((() => t.isLoggedIn)), handleLogin = async () => {
                p.value = !0;
                try {
                    if ("password" === s.value) {
                        if (!r.value.username || !r.value.password) return void msg("\u8bf7\u8f93\u5165\u7528\u6237\u540d\u548c\u5bc6\u7801", "warning");
                        const e = await t.loginByPassword(r.value.username, r.value.password);
                        e.success ? (msg(e.message, "success"), r.value = {
                            username: "",
                            password: ""
                        }) : msg(e.message, "error");
                    } else {
                        if (!l.value) return void msg("\u8bf7\u8f93\u5165 API Key", "warning");
                        const e = await t.loginByApiKey(l.value.trim());
                        e.success ? (msg(e.message, "success"), l.value = "") : msg(e.message, "error");
                    }
                } finally {
                    p.value = !1;
                }
            }, handleLogout = async () => {
                window.confirm("\u786e\u5b9a\u8981\u9000\u51fa\u767b\u5f55\u5417\uff1f") && (await t.logout(), 
                msg("\u5df2\u9000\u51fa\u767b\u5f55", "success"));
            }, goToRegister = () => {
                window.open("https://www.aiask.site/user/register", "_blank");
            }, goToScoreLog = () => {
                window.open("https://www.aiask.site/user/score-log", "_blank");
            }, switchMethod = e => {
                s.value = e;
            };
            return vue.onMounted((() => {
                c.value && t.fetchUserInfo();
            })), (e, i) => (vue.openBlock(), vue.createElementBlock("div", Tp, [ c.value ? (vue.openBlock(), vue.createElementBlock("div", Np, [ vue.createElementVNode("div", Dp, [ vue.createElementVNode("div", Bp, [ vue.unref(t).avatar ? (vue.openBlock(), 
            vue.createElementBlock("img", {
                key: 0,
                src: vue.unref(t).avatar,
                alt: "avatar"
            }, null, 8, Vp)) : (vue.openBlock(), vue.createElementBlock("span", Gp, "\ud83d\udc64")) ]), vue.createElementVNode("div", Rp, [ vue.createElementVNode("h2", null, vue.toDisplayString(vue.unref(t).nickname), 1), vue.createElementVNode("p", Jp, "@" + vue.toDisplayString(vue.unref(t).username), 1), vue.unref(t).isVip ? (vue.openBlock(), 
            vue.createElementBlock("span", Qp, " VIP Lv." + vue.toDisplayString(vue.unref(t).level), 1)) : (vue.openBlock(), vue.createElementBlock("span", Wp, "\u666e\u901a\u7528\u6237")) ]) ]), vue.createElementVNode("div", Kp, [ vue.createElementVNode("div", Yp, [ Xp, vue.createElementVNode("div", Zp, [ ec, vue.createElementVNode("p", tc, vue.toDisplayString(vue.unref(t).score), 1) ]) ]), vue.createElementVNode("div", nc, [ ac, vue.createElementVNode("div", oc, [ sc, vue.createElementVNode("p", ic, vue.toDisplayString(vue.unref(t).stats.course_count), 1) ]) ]), vue.createElementVNode("div", rc, [ lc, vue.createElementVNode("div", pc, [ cc, vue.createElementVNode("p", uc, vue.toDisplayString(vue.unref(t).stats.question_count), 1) ]) ]) ]), vue.unref(t).afdianUrl ? (vue.openBlock(), 
            vue.createElementBlock("div", dc, [ hc, mc, vue.createElementVNode("a", {
                class: "btn btn-primary btn-small user-page__support-btn",
                href: vue.unref(t).afdianUrl,
                target: "_blank",
                rel: "noopener noreferrer"
            }, " \u524d\u5f80\u67e5\u770b ", 8, fc) ])) : vue.createCommentVNode("", !0), vue.createElementVNode("div", {
                class: "user-page__actions"
            }, [ vue.createElementVNode("button", {
                class: "btn btn-outline btn-small",
                type: "button",
                onClick: goToScoreLog
            }, "\u67e5\u770b\u79ef\u5206\u660e\u7ec6"), vue.createElementVNode("button", {
                class: "btn btn-danger btn-small",
                type: "button",
                onClick: handleLogout
            }, "\u9000\u51fa\u767b\u5f55") ]) ])) : (vue.openBlock(), vue.createElementBlock("div", Ap, [ vue.createElementVNode("div", Sp, [ vue.createElementVNode("div", Up, [ Hp, Ep, vue.createElementVNode("div", Ip, [ vue.createElementVNode("button", {
                type: "button",
                class: vue.normalizeClass([ "btn btn-ghost btn-small", {
                    "is-active": "password" === s.value
                } ]),
                onClick: i[0] || (i[0] = e => switchMethod("password"))
            }, " \u8d26\u53f7\u767b\u5f55 ", 2), vue.createElementVNode("button", {
                type: "button",
                class: vue.normalizeClass([ "btn btn-ghost btn-small", {
                    "is-active": "apikey" === s.value
                } ]),
                onClick: i[1] || (i[1] = e => switchMethod("apikey"))
            }, " API Key \u767b\u5f55 ", 2) ]) ]), vue.createElementVNode("form", {
                class: "user-page__login-form",
                onSubmit: vue.withModifiers(handleLogin, [ "prevent" ])
            }, [ "password" === s.value ? (vue.openBlock(), vue.createElementBlock("div", jp, [ vue.createElementVNode("div", zp, [ vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": i[2] || (i[2] = e => r.value.username = e),
                class: "base-input",
                type: "text",
                placeholder: "\u8bf7\u8f93\u5165\u7528\u6237\u540d"
            }, null, 512), [ [ vue.vModelText, r.value.username ] ]) ]), vue.createElementVNode("div", Op, [ vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": i[3] || (i[3] = e => r.value.password = e),
                class: "base-input",
                type: "password",
                placeholder: "\u8bf7\u8f93\u5165\u5bc6\u7801",
                onKeyup: vue.withKeys(handleLogin, [ "enter" ])
            }, null, 544), [ [ vue.vModelText, r.value.password ] ]) ]) ])) : (vue.openBlock(), vue.createElementBlock("div", $p, [ vue.createElementVNode("div", Lp, [ vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": i[4] || (i[4] = e => l.value = e),
                class: "base-input",
                type: "text",
                placeholder: "\u8bf7\u8f93\u5165 API Key"
            }, null, 512), [ [ vue.vModelText, l.value ] ]), Pp ]) ])), vue.createElementVNode("button", {
                class: "btn btn-primary user-page__login-btn",
                type: "submit",
                disabled: p.value
            }, vue.toDisplayString(p.value ? "\u767b\u5f55\u4e2d..." : "\u7acb\u5373\u767b\u5f55"), 9, Fp) ], 32), vue.createElementVNode("div", {
                class: "user-page__register-tip"
            }, [ vue.createTextVNode(" \u8fd8\u6ca1\u6709\u8d26\u53f7\uff1f "), vue.createElementVNode("button", {
                class: "link-btn",
                type: "button",
                onClick: goToRegister
            }, "\u524d\u5f80\u5b98\u7f51\u6ce8\u518c"), Mp ]) ]) ])), gc ]));
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
        } ], a = {}, o = "default", s = 0; s < e.length; s++) {
            var i = e[s], r = !1;
            (i.match(n[1].reg) || i.match(/\[\u6848\u4f8b\u5206\u6790\]/) || i.match(/\[\u5b8c\u578b\u586b\u7a7a\]/) || i.match(/\[B1\]/)) && a.title && (t.push(a), 
            a = {});
            for (var l = 0; l < n.length; l++) {
                var p = n[l];
                if (i.match(p.reg)) {
                    a[o = p.key] && (a.data_err = i), a[o] = i, r = !0;
                    break;
                }
                r = !1;
            }
            r || (a[o] = (a[o] || "") + "\n" + i);
        }
        return a.title && t.push(a), (e => {
            var t = !1, n = "", a = !1, o = "", s = [], i = "", r = !1;
            return e.forEach((function(e) {
                if (e.parent_question && (i = e.parent_question, r = !0, e.is_first_child = "1"), 
                r && (a = !1, t = !1, e.is_anli = "1", e.is_anli_child = "1", e.is_wanxing_child = "", 
                e.is_b1_child = "", e.parent_question = i), e.parent_question_end && (r = !1, i = ""), 
                e.parent_question_wanxing && (n = e.parent_question_wanxing, t = !0, e.is_first_child = "1"), 
                t && (r = !1, a = !1, e.is_anli_child = "", e.is_b1_child = "", e.is_wanxing_child = "1", 
                e.title += "\u586b\u7a7a\uff08" + e.title.substr(0, e.title.length - 1) + "\uff09", 
                e.parent_question_wanxing = n), e.parent_question_wanxing_end && (t = !1, n = ""), 
                e.parent_question_b1) {
                    for (var l in s = [], e) if (Object.hasOwnProperty.call(e, l)) {
                        var p = e[l];
                        if (l.indexOf("options_") > -1) {
                            var c = {};
                            c[l] = p, s.push(c);
                        }
                    }
                    a = !0, t = !1, r = !1, e.is_first_child = "1";
                }
                a && (r = !1, t = !1, e.is_b1_child = "1", e.is_wanxing_child = "", e.is_anli_child = "", 
                e.parent_question_b1 = o, s.forEach((function(t) {
                    Object.assign(e, t);
                }))), e.parent_question_b1_end && (a = !1, o = "");
            })), e;
        })(t);
    }, xc = {
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
    }, bc = /^\s*(\u6b63\u786e|\u9519\u8bef|\u5bf9|\u9519|\u221a|\xd7|\u2713|X|x|T|F|true|TRUE|FALSE|false|YES|yes|NO|no|N|Y|n|y)\s*(?:\n|$)/i, vc = [ "A", "B", "C", "D", "E", "F", "G", "H" ], calcStatus = e => {
        if (e.title_value && (e.title_value = e.title_value.trim()), !e.title || e.title_value || e.parent_question) if (e.data_err) e.err_text = "\u8bf7\u68c0\u67e5\u8bd5\u9898\u5185\u5bb9"; else {
            var t = e.title_value, n = [ "A", "B", "C", "D", "E", "F", "G", "H" ];
            if (t) {
                if (e.qtype = "5", !e.answer_value && e.options_A && (e.title, e.title_value = e.title_value.replace(/[\(\uff08](\s*.*?)[\uff09\)]/gm, (function(t, n, a, o, s, i, r, l) {
                    return (n = n.replace(/\s/g, "")) ? /[\u4e00-\u9fa5]|\d/.test(n.trim()) ? t : (e.answer = "\u7b54\u6848\uff1a" + n.trim().replace(/(\s|\u3001|\uff0c|,)/g, ""), 
                    e.answer_value = n.trim().replace(/(\s|\u3001|\uff0c|,)/g, ""), "(    )") : t;
                }))), e.answer_value || (e.title, e.title_value = e.title_value.replace(e.options_A ? /^(\s*.*?)([A-Ha-h\u5bf9\u9519\u2713\u221a\xd7XxvVTFtrueTRUEFALSEfalseYESyesNOnoNYny\u6b63\u786e\u9519\u8bef,\uff0c\u3001]{1,8})$/gm : /^(\s*.*?)(\s[A-Ha-h\u5bf9\u9519\u2713\u221a\xd7XxvVTFtrueTRUEFALSEfalseYESyesNOnoNYny\u6b63\u786e\u9519\u8bef,\uff0c\u3001]{1,8})$/gm, (function(t, n, a, o, s, i, r, l) {
                    return e.answer = "\u7b54\u6848\uff1a" + a.trim().replace(/(\u3001|\uff0c|,)/g, ""), 
                    e.answer_value = a.trim().replace(/(\u3001|\uff0c|,)/g, ""), n;
                }))), !e.answer_value) {
                    for (var a = [], o = 0; o < n.length; o++) {
                        var s = n[o];
                        e["options_" + s] && e["options_" + s].match(/[\(\uff08](\s*[\(\u5bf9\)\(\u6b63\u786e\)\(\u7b54\u6848\)\(\u6b63\u786e\u7b54\u6848\)]+\s*)[\uff09\)]/) && (a.push(s), 
                        e["options_" + s + "_value"] = e["options_" + s + "_value"].replace(/[\(\uff08](\s*[\(\u5bf9\)\(\u6b63\u786e\)\(\u7b54\u6848\)\(\u6b63\u786e\u7b54\u6848\)]+\s*)[\uff09\)]/, (function(e, t, n, a, o) {
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
                e.answer_value && (e.answer_value = e.answer_value.trim()), e.title_no = e.title.match(xc.title)[1], 
                t.match(/([\(|\uff08]\s*[\)|\uff09])/g) && (e.qtype = "4"), t.match(/(___)/g) && (e.qtype = "4");
                for (var l = !1, p = [], c = 0; c < n.length; c++) {
                    var u = n[c];
                    e["options_" + u] && (l = !0, p.push(e["options_" + u]));
                }
                if (l && e.answer_value && (e.answer_value = e.answer_value.replace(/\uff0c|\.|,|\u3002|\uff1b|\s+|\u3001|\//g, "")), 
                !l && bc.test(e.answer_value) && (e.qtype = "3"), l || bc.test(e.answer_value) || e.qtype || (e.qtype = "5"), 
                l && e.answer_value && "1" == e.answer_value.length && (e.qtype = "1"), l && e.answer_value && e.answer_value.length > 1 && (e.qtype = "2"), 
                l && !e.answer_value && (e.qtype = "1"), l && e.answer_value) {
                    if (e.answer_value = e.answer_value.replace(/\uff0c|\.|,|\u3002|\uff1b|\s+|\u3001|\//g, ""), 
                    !/^[A-Ha-h]{1,8}$/g.test(e.answer_value)) return void (e.err_text = "\u7b54\u6848\u4e0d\u6b63\u786e");
                    if (new Set(e.answer_value).size != e.answer_value.length) return void (e.err_text = "\u7b54\u6848\u5305\u542b\u91cd\u590d\u9879");
                    var d = e.answer_value.split("").sort(), h = vc.indexOf(d[d.length - 1].toUpperCase());
                    if (-1 == h) return void (e.err_text = "\u7b54\u6848\u4e0d\u6b63\u786e");
                    for (var m = 0; m < h + 1; m++) if (!e["options_" + n[m]]) return void (e.err_text = "\u7b54\u6848\u4e0d\u5728\u9009\u9879\u4e2d");
                }
                if (e.title_value) if (e.title_value.length < 2) e.err_text = "\u9898\u5e72\u81f3\u5c11\u4e24\u4e2a\u5b57"; else if (e.answer_value) {
                    if ([ "1", "2", "14", "15" ].indexOf(e.qtype) > -1) {
                        var f = [];
                        if (vc.forEach((function(t) {
                            e["options_" + t + "_value"] && f.push(t);
                        })), f.length < 2) return void (e.err_text = "\u9009\u9879\u81f3\u5c11\u6709\u4e24\u4e2a");
                        f.sort();
                        var g = vc[f.length - 1], y = f.indexOf(g);
                        if (f.length != y + 1) return void (e.err_text = "\u8bf7\u68c0\u67e5\u9009\u9879\u5185\u5bb9");
                    }
                    if ("4" == e.qtype && e.answer_value) {
                        var x = e.title_value.match(/([\(|\uff08]\s*[\)|\uff09])/g), b = e.answer_value.replace(/\s/g, "").split("|").length;
                        if (x && x.length != b) return void (e.err_text = "\u7b54\u6848\u548c\u7a7a\u6570\u91cf\u4e0d\u5339\u914d");
                    }
                    "3" == e.qtype && e.answer_value && /\n/.test(e.answer_value) ? e.err_text = "\u5224\u65ad\u9898\u7b54\u6848\u4e0d\u6b63\u786e" : (e.title_value.indexOf("[\u8ba1\u7b97\u9898]") > -1 && (e.qtype = 12), 
                    e.title_value.indexOf("[\u8bba\u8ff0\u9898]") > -1 && (e.qtype = 11), e.title_value.indexOf("[\u4e0d\u5b9a\u9879\u9009\u62e9\u9898]") > -1 && (e.qtype = 14), 
                    e.title_value.indexOf("[\u5224\u65ad\u9898]") > -1 && (e.qtype = 3), e.title_value.indexOf("[\u586b\u7a7a\u9898]") > -1 && (e.qtype = 4));
                } else e.err_text = "\u8bd5\u9898\u6ca1\u6709\u7b54\u6848"; else e.err_text = "\u8bd5\u9898\u6ca1\u6709\u9898\u5e72";
            }
        } else e.err_text = e.title + "\u9898\u5e72\u4e0d\u6b63\u786e";
    }, wc = {
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
                for (var o in a) if (Object.hasOwnProperty.call(a, o)) {
                    var s = a[o];
                    s = s.replace(xc[o], ""), a[o + "_value"] = s.replace("[\u6848\u4f8b\u5206\u6790]", "");
                }
                calcStatus(a), t["".concat(a.qtype)] ? t["".concat(a.qtype)]++ : t["".concat(a.qtype)] = 1, 
                a.err_text;
            }
            return e;
        })(getlineDetail(t));
        return n.forEach((e => {
            e.qtype = wc[e.qtype] || "\u5176\u4ed6";
        })), JSON.parse(JSON.stringify(n));
    }, kc = {
        class: "question-tool"
    }, _c = vue.createElementVNode("div", {
        class: "info-banner"
    }, [ vue.createElementVNode("div", {
        class: "info-title"
    }, "\u9898\u5e93\u5bfc\u5165\u8bf4\u660e"), vue.createElementVNode("div", {
        class: "info-body"
    }, " \u9898\u5e93\u5bfc\u5165\u540e\u53ef\u5728\u672c\u5730\u7f13\u5b58\u4e2d\u5339\u914d\u641c\u7d22\uff0c\u8bf7\u786e\u4fdd\u9898\u5e93\u4e0e\u7b54\u9898\u4e00\u81f4\uff0c\u5426\u5219\u65e0\u6cd5\u5339\u914d\u3002 ") ], -1), Cc = {
        class: "qt-grid"
    }, Tc = {
        class: "qt-editor"
    }, Ac = {
        class: "qt-preview"
    }, Sc = {
        class: "import_question"
    }, Uc = {
        key: 0,
        class: "qt-empty"
    }, Hc = {
        class: "qt-card-head"
    }, Ec = {
        class: "qt-title-no"
    }, Ic = {
        class: "qt-tag danger"
    }, jc = {
        class: "qt-question"
    }, zc = vue.createElementVNode("span", {
        class: "label"
    }, "\u9898\u76ee:", -1), Oc = {
        class: "qt-options"
    }, $c = {
        key: 0,
        class: "qt-answer"
    }, Lc = vue.createElementVNode("span", {
        class: "label"
    }, "\u7b54\u6848:", -1), Pc = {
        key: 1,
        class: "qt-error"
    }, Fc = vue.defineComponent({
        __name: "QuestionTool",
        setup(e) {
            vue.ref(Cache.matchGet("ques1_") || []);
            const t = vue.ref([]), s = vue.ref(""), handleKeydown = () => {
                t.value = questionParse(s.value);
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
            return (e, i) => (vue.openBlock(), vue.createElementBlock("div", kc, [ _c, vue.createElementVNode("div", {
                class: "qt-actions"
            }, [ vue.createElementVNode("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: importQuestion
            }, "\u5bfc\u5165\u7f13\u5b58") ]), vue.createElementVNode("div", Cc, [ vue.createElementVNode("div", Tc, [ vue.withDirectives(vue.createElementVNode("textarea", {
                "onUpdate:modelValue": i[0] || (i[0] = e => s.value = e),
                class: "qt-textarea",
                placeholder: "1. \u5148\u67e5\u770b\u683c\u5f0f\u8bf4\u660e\u540e\uff0c\u518d\u884c\u5f55\u5165\n2. \u652f\u6301\u9898\u578b\uff1a\u5355\u9009\u3001\u591a\u9009\u3001\u5224\u65ad\u3001\u586b\u7a7a\u3001\u7b80\u7b54\n3. \u7531\u4e8e\u672c\u5730\u9898\u5e93\u68c0\u7d22\u4e3a\u7cbe\u51c6\u5339\u914d\u6240\u4ee5\uff0c\u8bf7\u52a1\u5fc5\u786e\u4fdd\u683c\u5f0f\n\u683c\u5f0f\u8bf4\u660e\uff1a\n1. \u8bd5\u9898\u9700\u8981\u6709\u5e8f\u53f7\uff0c\u652f\u6301\uff1a1. \u62161\u3001\n2. \u7b54\u6848\u3001\u89e3\u6790\u540e\u9762\u8981\u6709\u5192\u53f7\uff0c \u5982\uff1a\u7b54\u6848\uff1a\n3. \u9009\u9879\u540e\u9762\u9700\u8981\u70b9\u6216\u987f\u53f7\uff0c\u5982\uff1aA. \u6216A\u3001\n4. \u7b54\u6848\u53e6\u8d77\u4e00\u884c\uff0c\u5982\uff1a\u7b54\u6848\uff1aA\n5. \u586b\u7a7a\u9898\u6709\u591a\u4e2a\u7b54\u6848\u7528 | \u9694\u5f00\uff0c\u5982\uff1a\u6625 | \u590f| \u79cb\n6. \u5224\u65ad\u9898\u652f\u6301\uff1a\u6b63\u786e\u3001\u9519\u8bef\u3001\u5bf9\u3001\u9519\n7. \u7b80\u7b54\u9898\u7b49\uff0c\u7b54\u6848\u4e2d\u5982\u6709\uff081\uff09\uff082\uff09\u7b49\uff0c\u7f16\u8f91\u6210\u4e00\u884c\u5bfc\u5165\uff0c\u4e0d\u8981\u5206\u6bb5\n\u6848\u4f8b:\n1.\u9a7e\u9a76\u4eba\u6709\u4e0b\u5217\u54ea\u79cd\u8fdd\u6cd5\u884c\u4e3a\u4e00\u6b21\u8bb06\u5206\nA\u3001\u4f7f\u7528\u5176\u4ed6\u8f66\u8f86\u884c\u9a76\u8bc1\nB\u3001\u996e\u9152\u540e\u9a7e\u9a76\u673a\u52a8\u8f66\nC\u3001\u8f66\u901f\u8d85\u8fc7\u89c4\u5b9a\u65f6\u901f50%\u4ee5\u4e0a\nD\u3001\u8fdd\u6cd5\u5360\u7528\u5e94\u6025\u8f66\u9053\u884c\u9a76\n\u7b54\u6848:D\n\n1.\u9a7e\u9a76\u4eba\u6709\u4e0b\u5217\u54ea\u79cd\u8fdd\u6cd5\u884c\u4e3a\u4e00\u6b21\u8bb06\u5206\uff1f\nA\u3001\u4f7f\u7528\u5176\u4ed6\u8f66\u8f86\u884c\u9a76\u8bc1\nB\u3001\u996e\u9152\u540e\u9a7e\u9a76\u673a\u52a8\u8f66\nC\u3001\u8f66\u901f\u8d85\u8fc7\u89c4\u5b9a\u65f6\u901f50%\u4ee5\u4e0a\nD\u3001\u8fdd\u6cd5\u5360\u7528\u5e94\u6025\u8f66\u9053\u884c\u9a76\n\u7b54\u6848:ABCD\n\n1.\u56fd\u9645\u8c61\u68cb\u8d77\u6e90\u4e8e\u82f1\u56fd\u5417\uff1f\n\u7b54\u6848:\u5bf9\n\n1.\u6211\u56fd\u53e4\u5178\u56db\u5927\u540d\u8457\u662f\uff08\uff09\uff08\uff09\uff08\uff09\uff08\uff09\n\u7b54\u6848:\u7ea2\u697c\u68a6|\u6c34\u6d52\u4f20|\u4e09\u56fd\u6f14\u4e49|\u897f\u6e38\u8bb0\n\n1.\u5982\u4f55\u4fdd\u6301\u8eab\u4f53\u5065\u5eb7\uff1f\n\u7b54\u6848:\u89c4\u5f8b\u996e\u98df\u3001\u575a\u6301\u953b\u70bc\uff0c\u65e9\u7761\u65e9\u8d77\uff0c\u5b9a\u671f\u4f53\u68c0\u3002",
                onInput: handleKeydown,
                rows: "24"
            }, null, 544), [ [ vue.vModelText, s.value ] ]) ]), vue.createElementVNode("div", Ac, [ vue.createElementVNode("div", Sc, [ 0 === t.value.length ? (vue.openBlock(), 
            vue.createElementBlock("div", Uc, "\u8f93\u5165\u9898\u76ee\u540e\u5c06\u81ea\u52a8\u89e3\u6790\u5e76\u9884\u89c8")) : vue.createCommentVNode("", !0), (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(t.value, (e => (vue.openBlock(), vue.createElementBlock("div", {
                key: e.title_no,
                class: vue.normalizeClass([ "qt-card", {
                    "qt-card-error": e.err_text
                } ])
            }, [ vue.createElementVNode("div", Hc, [ vue.createElementVNode("span", Ec, vue.toDisplayString(e.title_no), 1), vue.createElementVNode("span", Ic, vue.toDisplayString(e.qtype), 1) ]), vue.createElementVNode("p", jc, [ zc, vue.createTextVNode(vue.toDisplayString(e.title_value), 1) ]), vue.createElementVNode("div", Oc, [ (vue.openBlock(!0), 
            vue.createElementBlock(vue.Fragment, null, vue.renderList(extractOptions(e), (e => (vue.openBlock(), vue.createElementBlock("span", {
                key: e.label,
                class: vue.normalizeClass([ "qt-tag", {
                    success: e.isTrue
                } ])
            }, vue.toDisplayString(e.label), 3)))), 128)) ]), e.answer_value ? (vue.openBlock(), vue.createElementBlock("p", $c, [ Lc, vue.createTextVNode(vue.toDisplayString(e.answer_value), 1) ])) : vue.createCommentVNode("", !0), e.err_text ? (vue.openBlock(), 
            vue.createElementBlock("div", Pc, [ vue.createElementVNode("p", null, vue.toDisplayString(e.err_text), 1) ])) : vue.createCommentVNode("", !0) ], 2)))), 128)) ]) ]) ]) ]));
        }
    }), Mc = {
        class: "el_wrapper",
        style: {
            "z-index": "9999999 !important"
        }
    }, Nc = {
        class: "floating-wrapper"
    }, Dc = {
        class: "floating-title"
    }, Bc = [ "src" ], Vc = {
        class: "floating-version"
    }, Gc = {
        class: "floating-actions"
    }, Rc = {
        class: "floating-body"
    }, Jc = {
        class: "floating-scroll custom-scroll"
    }, Qc = {
        key: 0,
        class: "aah_breadcrumb"
    }, Wc = {
        class: "breadcrumb"
    }, Kc = vue.createElementVNode("span", {
        class: "breadcrumb-sep"
    }, "/", -1), Yc = {
        class: "breadcrumb-text"
    }, Xc = {
        class: "mini-tooltip-wrapper"
    }, Zc = [ "src" ], eu = {
        key: 0,
        class: "mini-tooltip"
    }, tu = vue.defineComponent({
        __name: "App",
        setup(e) {
            const t = Nt(), s = Rt(), r = Vt(), l = Qt();
            t.app.showFloat = t.app.defaultShowFloat;
            const p = vue.ref(null), d = vue.reactive({
                dragging: !1,
                offsetX: 0,
                offsetY: 0
            }), h = vue.reactive({
                top: "15vh",
                left: "50%",
                useTransform: !0
            });
            xe[$t + "app"] = t, xe[$t + "ask"] = s, xe[$t + "api"] = r, xe[$t + "user"] = l;
            const showOrHide = () => {
                t.app.showFloat = !t.app.showFloat;
            };
            document.onkeydown = function(e) {
                if (!t.app.hotkeyEnabled) return;
                const n = (e => {
                    const t = e.split("+");
                    return {
                        ctrl: t.includes("Ctrl"),
                        shift: t.includes("Shift"),
                        alt: t.includes("Alt"),
                        key: t[t.length - 1]
                    };
                })(t.app.hotkey), a = "ArrowUp" === (o = n.key) ? "ArrowUp" : 1 === o.length ? "Key" + o.toUpperCase() : o;
                var o;
                e.ctrlKey === n.ctrl && e.shiftKey === n.shift && e.altKey === n.alt && e.code === a && (e.preventDefault(), 
                t.app.showFloat = !t.app.showFloat);
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
                  case "api":
                    t = "50vw";
                    break;

                  case "ai":
                    t = "30vw";
                    break;

                  case "ask":
                    t = "820px";
                    break;

                  default:
                    t = "400px";
                }
                return t;
            }, m = vue.computed((() => ({
                width: pageGetWidth(t.page),
                top: h.top,
                left: h.left,
                transform: h.useTransform ? "translateX(-50%)" : "none"
            }))), handleDragMove = e => {
                if (!d.dragging || !p.value) return;
                const t = p.value, {clientX: n, clientY: a} = e, o = t.offsetWidth, s = t.offsetHeight, i = window.innerWidth - o, r = window.innerHeight - s;
                let l = n - d.offsetX, c = a - d.offsetY;
                l = Math.min(Math.max(0, l), Math.max(0, i)), c = Math.min(Math.max(0, c), Math.max(0, r)), 
                h.left = `${l}px`, h.top = `${c}px`, h.useTransform = !1;
            }, stopDrag = () => {
                d.dragging && (d.dragging = !1, window.removeEventListener("pointermove", handleDragMove), 
                window.removeEventListener("pointerup", stopDrag));
            }, startDrag = e => {
                if ((e => {
                    if (!(e instanceof HTMLElement)) return !1;
                    const t = e.tagName;
                    return [ "BUTTON", "A", "INPUT", "TEXTAREA", "SELECT", "OPTION" ].includes(t) || !!e.closest(".floating-btn");
                })(e.target)) return;
                if (!p.value) return;
                e.preventDefault();
                const t = p.value.getBoundingClientRect();
                h.useTransform && (h.left = `${t.left}px`, h.top = `${t.top}px`), d.dragging = !0, 
                d.offsetX = e.clientX - t.left, d.offsetY = e.clientY - t.top, h.useTransform = !1, 
                window.addEventListener("pointermove", handleDragMove), window.addEventListener("pointerup", stopDrag);
            };
            return vue.watch((() => t.app.showFloat), (e => {
                e ? (h.top = "15vh", h.left = "50%", h.useTransform = !0) : stopDrag();
            })), vue.onBeforeUnmount((() => {
                window.removeEventListener("pointermove", handleDragMove), window.removeEventListener("pointerup", stopDrag);
            })), updateFn(), (e, s) => (vue.openBlock(), vue.createElementBlock("div", Mc, [ vue.withDirectives(vue.createElementVNode("div", Nc, [ vue.createElementVNode("div", {
                class: "floating-dialog",
                style: vue.normalizeStyle(m.value),
                ref_key: "floatRef",
                ref: p
            }, [ vue.createElementVNode("div", {
                class: "floating-header",
                onPointerdown: startDrag
            }, [ vue.createElementVNode("div", Dc, [ vue.createElementVNode("img", {
                src: vue.unref(Lt).script.icon,
                alt: "icon"
            }, null, 8, Bc), vue.createElementVNode("span", null, vue.toDisplayString(vue.unref(Lt).script.name), 1), vue.createElementVNode("span", Vc, "v" + vue.toDisplayString(vue.unref(Lt).script.version), 1) ]), vue.createElementVNode("div", Gc, [ "home" != vue.unref(t).page ? (vue.openBlock(), 
            vue.createElementBlock("button", {
                key: 0,
                class: "floating-btn floating-btn-plain floating-btn-small",
                onClick: s[0] || (s[0] = e => vue.unref(t).setPage("home")),
                type: "button"
            }, [ vue.createVNode(vue.unref(J), {
                style: {
                    "margin-right": "4px"
                }
            }), vue.createTextVNode(" \u8fd4\u56de\u9996\u9875 ") ])) : vue.createCommentVNode("", !0), vue.createElementVNode("button", {
                class: "floating-close",
                "aria-label": "\u5173\u95ed",
                onClick: s[1] || (s[1] = e => vue.unref(t).app.showFloat = !1),
                type: "button"
            }, "\xd7") ]) ], 32), vue.createElementVNode("div", Rc, [ vue.createElementVNode("div", Jc, [ "home" != vue.unref(t).page ? (vue.openBlock(), 
            vue.createElementBlock("div", Qc, [ vue.createElementVNode("div", Wc, [ vue.createElementVNode("a", {
                onClick: s[2] || (s[2] = e => vue.unref(t).setPage("home")),
                class: "breadcrumb-link"
            }, [ vue.createVNode(vue.unref(X), {
                style: {
                    "margin-right": "6px"
                }
            }), vue.createTextVNode(" \u9996\u9875 ") ]), Kc, vue.createElementVNode("span", Yc, vue.toDisplayString(vue.unref(t).page), 1) ]) ])) : vue.createCommentVNode("", !0), "home" == vue.unref(t).page ? (vue.openBlock(), 
            vue.createBlock(wn, {
                key: 1
            })) : "user" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(yc, {
                key: 2
            })) : "Base" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(eo, {
                key: 3
            })) : "ask" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(As, {
                key: 4
            })) : "question" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(Rs, {
                key: 5
            })) : "preview" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(lr, {
                key: 6
            })) : "questionTool" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(Fc, {
                key: 7
            })) : "log" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(hr, {
                key: 8
            })) : "ai" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(ql, {
                key: 9
            })) : "api" == vue.unref(t).page ? (vue.openBlock(), vue.createBlock(Cp, {
                key: 10
            })) : vue.createCommentVNode("", !0) ]) ]) ], 4) ], 512), [ [ vue.vShow, vue.unref(t).app.showFloat ] ]), vue.withDirectives(vue.createElementVNode("div", {
                class: "minimized-dialog",
                onClick: showOrHide
            }, [ vue.createElementVNode("div", {
                onClick: showOrHide
            }, [ vue.createElementVNode("div", Xc, [ vue.createElementVNode("img", {
                src: vue.unref("data:image/svg+xml,%3csvg%20class='icon'%20viewBox='0%200%201024%201024'%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='200'%3e%3cpath%20d='m253.36%201024-115.278-58.836v-53.206c-64.889-68.266-62.918-94.729%2014.075-153.424-23.506-17.594-63.762%202.675-77.275-36.315%2047.435-42.93%2070.378-101.063%2087.973-162.01a326.695%20326.695%200%200%201%20208.037-226.617c4.645-89.38%2086.847-143.43%20178.479-112.605l-35.612%2090.365c105.145%207.32%20192.414%2045.042%20256.317%20123.303%2040.538%2015.483%2038.849-34.767%2069.252-40.82l11.964%2058.273%2050.391-27.306c28.151%2018.72-5.208%2031.951-10.416%2052.22%2014.78%2020.128%2028.996%2040.538%2044.479%2060.244a142.867%20142.867%200%200%201%2028.996%20114.153c-12.528%2077.838-30.263%20154.831-41.101%20233.092A1276.939%201276.939%200%200%200%20918.433%201024H897.32l-89.24-70.378%209.994-10.416-17.735%2036.878-68.408-20.128-39.411%2023.788-42.227-21.114c-28.151%2014.076-52.502%2036.034-86.565%2027.307l-9.009-37.863H332.747L306.144%201024zm-9.993-380.041-.844.985%20126.68%2019.706%2010.838%2010.979c-29.277%2032.374-19.846%2074.178-29.7%20110.493l34.064%2030.263-35.19%2094.87a412.274%20412.274%200%200%200%20233.515%202.11l9.712-26.602%2012.809%2015.905-11.824%2050.672%205.35%204.645c16.749-11.682%2033.218-24.21%2050.812-34.626a84.454%2084.454%200%200%201%2026.04-5.348l7.46%2033.922%2048.842-23.788%2052.925%2014.076c-1.83-43.212-2.956-80.935-5.912-118.517%200-4.926-9.853-9.29-15.061-14.075l-5.63-23.225%2014.075-100.922h18.72l3.238-1.267c-11.964%20106.412%208.023%20202.266%2087.128%20281.512%208.727-48.842%2016.61-93.321%2024.632-137.66%207.46-40.96%2015.061-81.92%2022.521-122.88%2010.557-48.42%2025.477-97.262-10.979-140.755l-30.825%2038.004c0-16.469%201.126-33.078%201.126-49.546%200-70.378-53.206-104.723-115.983-76.29a232.951%20232.951%200%200%201-32.937%209.43c16.046-32.373-3.519-52.924-25.477-70.377a292.21%20292.21%200%200%200-209.304-70.378c-11.401.703-22.802%200-40.256%200l45.183-104.582c-40.397%2010.979-74.038%2014.78-94.73%2045.464s14.92%2045.886%2020.833%2069.674c-110.212%204.364-202.69%2080.513-236.611%20193.117l-70.378%20172.708%2049.124%203.519%205.63%2054.191c32.514-26.04%2026.04-61.088%2030.262-92.899h17.876v58.414l30.967%206.334c1.407-6.616%202.393-11.683%203.66-16.469%209.148-34.626-19.706-59.117-22.38-91.491zm-37.863%20178.9-6.475%2020.833-25.336%2084.453c1.548%208.868%200%2023.225%205.067%2025.477%2032.374%2016.046%2065.733%2029.277%20104.16%2045.746%2021.113-65.452%2063.621-114.435%2069.533-180.872-37.3-16.187-70.941-31.53-104.722-44.338-17.032-6.756-36.315-10.979-35.049%2019.002zm121.754-38.848%2010.556-90.225-48.138-6.193v78.964zm-168.907%2096.98%2023.084-73.474c-28.152-10.416-47.576-9.29-56.303%2015.483s2.674%2042.79%2032.937%2057.992z'%20fill='%23353947'/%3e%3cpath%20d='M198.607%20548.948c33.922-112.604%20126.68-188.472%20235.907-192.272-5.912-23.788-41.1-39.553-20.832-69.674s54.332-34.486%2094.729-45.465L463.228%20346.12h40.256a292.21%20292.21%200%200%201%20209.304%2070.378c21.958%2017.735%2042.227%2038.286%2025.477%2070.378l.986-.985c-30.967%2026.743-32.797%2059.399-19.847%2095.15L744.599%20622l-40.819-6.192-103.174-14.076-62.214-93.04-31.67%2050.672c-19.425-5.63-26.603.845-20.691%2020.692l-21.536-.845a165.67%20165.67%200%200%200-100.078-17.172l-10.416-86.565-37.44%2031.248-44.339%2042.226zm255.19-62.917-10.556-10.557c-17.173-17.032-35.049-15.061-47.294%203.378s-4.786%2036.737%2012.105%2050.25c20.128%2016.046%2034.907%209.712%2045.745-11.542%2014.217-10.838%2015.202-21.395%200-31.811z'%20fill='%23F5F5F6'%20data-spm-anchor-id='a313x.search_index.0.i5.dc0f3a810XA6r8'%20class='selected'/%3e%3cpath%20d='m592.442%20886.763-9.712%2026.603a412.274%20412.274%200%200%201-233.514-2.112l35.189-94.87-34.063-30.543c9.853-36.315%200-78.12%2029.7-110.494a198.184%20198.184%200%200%200%20105.425-94.87c16.328%202.394%2026.04-1.688%2020.692-20.69l31.67-4.927%2063.058%2078.542c0%207.882-1.97%2018.017%201.971%2023.084%2030.966%2038.708%2023.788%2080.935%2014.076%20123.865-8.587%2036.034-16.469%2071.364-24.492%20106.412zm-149.624-223.24c0%2014.076-2.815%2023.648%200%2026.885%2020.27%2020.691%2020.832%2045.605%2019.566%2071.927a96.84%2096.84%200%200%200%203.237%2031.107c5.912%2020.41%2012.668%2041.382%2038.426%2044.056a48.56%2048.56%200%200%200%2053.347-35.189%20696.602%20696.602%200%200%200%2018.58-80.371c6.052-6.475%2035.47-2.534%2018.157-36.597z'%20fill='%23F5F5F6'/%3e%3cpath%20d='M600.606%20602.013%20703.78%20616.09l40.82%205.349c37.863%209.993%2022.943%2041.241%2026.461%2065.17L756.986%20787.53l-49.828%2078.12-21.395%2031.529-10.134%2021.395a84.454%2084.454%200%200%200-26.04%205.348c-17.594%2010.416-34.063%2022.944-50.813%2034.626v-5.208h-5.067l11.823-50.672c16.047-61.932%2032.937-123.724%2047.717-185.938%205.348-22.662-25.477-68.267-51.94-82.624zM927.3%20706.736c-7.46%2040.96-15.061%2081.92-22.521%20122.88-8.023%2044.338-15.906%2088.817-24.633%20137.66-79.105-79.387-98.529-175.242-87.128-281.513z'%20fill='%23B3DCF8'/%3e%3cpath%20d='m199.029%20843.692%206.475-20.832h45.605c2.111-39.271-20.973-30.263-38.427-30.122-1.548-29.981%2018.017-25.758%2035.049-18.58%2034.063%2013.231%2067.422%2028.151%20104.722%2044.479-5.912%2066.437-48.42%20115.42-69.533%20180.871-38.427-16.186-71.927-29.418-104.16-45.182-4.786-2.252-3.519-16.61-5.067-25.477h33.5l26.321-70.378z'%20fill='%2387BC85'/%3e%3cpath%20d='M738.265%20486.03a232.951%20232.951%200%200%200%2032.937-9.43c62.777-28.151%20116.405%206.615%20115.983%2076.29%200%2016.468-.704%2033.077-1.126%2049.546l1.126-.986-12.105-2.674-21.536%2016.75-29.98%208.305a86.565%2086.565%200%200%201-91.633-59.259c2.393-26.462%204.645-52.924%207.038-79.527zm113.731%2061.792-61.37-52.502c-3.94%2035.752-6.615%2059.822-10.275%2093.18z'%20fill='%23F5F5F6'%20data-spm-anchor-id='a313x.search_index.0.i3.dc0f3a810XA6r8'/%3e%3cpath%20d='M198.607%20548.948h73.615c-28.151%2042.227-74.178%2076.853-59.117%20137.66-4.223%2031.81%202.252%2066.859-30.263%2092.899l-6.052-54.473-49.124-3.519z'%20fill='%23AED4EF'/%3e%3cpath%20d='m927.3%20706.736-134.28-21.113-3.238%201.266%206.897-37.863%2027.025-7.742%2031.248-8.867%2029.84-20.691%202.393-10.276-.422.986%2030.262-36.738c35.752%2043.776%2020.832%2092.618%2010.276%20141.038zm-557.675-42.79-126.68-19.706a171.3%20171.3%200%200%201%2016.75-41.1c21.817-29.278%2046.168-56.303%2069.533-84.454%203.238%209.15%206.757%2018.157%209.572%2027.307q15.624%2049.123%2030.966%2098.529z'%20fill='%23F5F5F6'/%3e%3cpath%20d='M763.18%20810.473c5.207%204.645%2014.075%209.009%2015.06%2014.076%202.956%2037.582%204.082%2075.304%205.912%20118.516l-52.925-14.075-47.997%2023.787-7.601-34.766c14.075-1.97%2020.55-7.883%2010.979-21.817%2021.395%2011.682%2023.788-9.994%2033.359-19.003z'%20fill='%23AED4EF'/%3e%3cpath%20d='M601.169%20634.106c26.462%2014.075%2057.288%2059.962%2051.939%2082.624-14.076%2062.214-31.67%20124.006-47.716%20185.938l-12.95-15.905c8.023-35.33%2015.905-70.378%2024.35-105.99%2010.135-42.93%2017.314-85.157-14.075-123.865-3.519-4.785-.985-14.92-1.548-22.802zM328.806%20518.404c-23.365%2028.152-47.716%2055.458-69.533%2084.454a171.3%20171.3%200%200%200-16.75%2041.1l.844-.985-12.386%2043.072h-17.876c-15.061-60.385%2030.403-94.87%2059.117-137.097l44.338-42.226z'%20fill='%23484F5E'/%3e%3cpath%20d='m327.258%20784.011-37.582-17.454v-78.964l48.138%206.193z'%20fill='%23D55375'/%3e%3cpath%20d='m823.704%20641.284-27.025%207.742-6.897%2037.863h-18.72c-3.52-23.928%2011.4-55.176-26.463-65.17l-25.195-40.96%2012.527-16.187a86.565%2086.565%200%200%200%2091.35%2059.259zm-454.079%2022.662V644.1l12.246-12.95c8.445%201.267%2020.41%206.897%2024.773%203.237%2020.55-17.031%2038.99-36.455%2058.132-55.176l20.973%201.548a198.184%20198.184%200%200%201-105.708%2094.87z'%20fill='%23484F5E'/%3e%3cpath%20d='m199.029%20843.692%2034.485%2014.075-26.321%2070.378h-33.5z'%20fill='%23CAE7AF'/%3e%3cpath%20d='m230.98%20686.326%2012.387-43.071c2.675%2031.67%2031.53%2056.302%2022.24%2091.35-1.267%204.786-2.252%209.854-3.66%2016.47l-30.966-6.335z'%20fill='%23F5F5F6'/%3e%3cpath%20d='m763.18%20810.473-44.058%2067.704-11.964-12.528%2050.39-78.4z'%20fill='%23484F5E'/%3e%3cpath%20d='M212.682%20792.738c17.454%200%2040.538-9.15%2038.427%2030.122h-45.605z'%20fill='%23CDEAB1'/%3e%3cpath%20d='m598.917%20957.985-5.349-4.645h5.067z'%20fill='%23484F5E'/%3e%3cpath%20d='M464.495%20579.211c-19.143%2018.72-37.582%2038.145-58.132%2055.176-4.364%203.66-16.328-1.97-24.773-3.237l-17.173-69.111a165.67%20165.67%200%200%201%20100.078%2017.172z'%20fill='%23AED4EF'/%3e%3cpath%20d='m364.417%20562.039%2017.173%2069.111-12.246%2012.95Q354%20594.976%20338.377%20545.57c-2.815-9.149-6.334-18.157-9.571-27.306l-12.246-11.542%2037.441-30.967z'%20fill='%23353947'/%3e%3cpath%20d='M600.606%20602.013v31.67l-62.214-79.245-31.67%204.926%2031.388-50.39z'%20fill='%23484F5E'/%3e%3cpath%20d='M453.797%20517.278c-10.838%2021.255-25.617%2028.152-45.745%2011.542-16.891-14.075-24.633-31.529-12.105-50.25s30.121-20.41%2047.294-3.378c-23.507.986-34.767%2011.542-29.137%2039.412l39.693%203.097z'%20fill='%23AED4EF'/%3e%3cpath%20d='m731.931%20564.572-12.809%2015.624c-12.95-35.752-11.12-68.407%2019.847-95.15-2.111%2026.602-4.363%2053.064-7.038%2079.526z'%20fill='%23353947'/%3e%3cpath%20d='M506.722%20559.787c5.348%2019.002-4.364%2023.084-20.691%2020.69-6.194-19.846.985-26.32%2020.69-20.69z'%20fill='%23484F5E'/%3e%3cpath%20d='M453.797%20485.749c15.202%2010.416%2014.076%2020.973%200%2031.53v-31.812zm-10.556-10.557%2010.556%2010.557-10.556-10.557z'%20fill='%23AED4EF'/%3e%3cpath%20d='m442.818%20663.524%20151.313%2022.099c17.313%2034.062-12.105%2030.121-18.157%2036.596a696.602%20696.602%200%200%201-18.58%2080.09%2048.56%2048.56%200%200%201-52.784%2034.908c-25.758-2.675-32.514-23.647-38.426-44.057a96.84%2096.84%200%200%201-3.237-31.107c1.266-26.321%200-51.235-19.566-71.926-3.378-2.956-.563-12.387-.563-26.603zm66.297%20153.987c41.523-26.462%2042.226-60.384%2034.766-98.53l-55.317-10.274c-.422%2038.707-15.202%2075.163%2020.55%20108.804zm198.043%2048.138%2011.964%2012.528c-9.57%209.008-11.964%2030.685-33.359%2019.002z'%20fill='%23353947'/%3e%3cpath%20d='M686.186%20896.757c9.571%2014.075%202.955%2019.846-10.98%2021.817zm165.81-348.935-71.645%2040.679c3.66-33.36%206.334-57.429%2010.276-93.18z'%20fill='%23353947'/%3e%3cpath%20d='m884.792%20611.726-29.84%2020.69-1.408-16.89%2021.536-16.75z'%20fill='%23484F5E'%20data-spm-anchor-id='a313x.search_index.0.i4.dc0f3a810XA6r8'%20class='selected'/%3e%3cpath%20d='m853.544%20615.526%201.408%2016.89-31.248%208.868v-17.453zm31.248-3.8-9.712-12.95%2012.105%202.674z'%20fill='%23353947'/%3e%3cpath%20d='m443.522%20474.91%2010.557%2010.557v31.952l-39.693-3.097c-6.194-27.87%205.63-38.426%2029.136-39.411z'%20fill='%23F5F5F6'/%3e%3cpath%20d='M509.115%20817.51c-35.753-33.64-20.973-70.377-20.55-108.803l55.316%2010.275c7.883%2038.145%206.757%2072.067-34.766%2098.529z'%20fill='%23E25679'/%3e%3c/svg%3e"),
                onClick: showOrHide
            }, null, 8, Zc), !vue.unref(t).app.showFloat && vue.unref(t).app.alertBubble ? (vue.openBlock(), vue.createElementBlock("div", eu, vue.toDisplayString(vue.unref(t).app.alert), 1)) : vue.createCommentVNode("", !0) ]) ]) ], 512), [ [ vue.vShow, !vue.unref(t).app.showFloat ] ]) ]));
        }
    }), get_href = () => location.href, hookXHR = () => {
        const e = {
            send: XMLHttpRequest.prototype.send
        };
        Object.defineProperty(XMLHttpRequest.prototype, "send", {
            configurable: !1,
            writable: !1,
            value: function(t) {
                return this.addEventListener("readystatechange", (function() {
                    switch (!0) {
                      case /onlineexamh5new.zhihuishu.com/i.test(get_href()):
                        break;

                      case /icve.com.cn/i.test(location.host):
                        4 === this.readyState && this.responseURL && (this.responseURL.includes("examRecordPaperList") || this.responseURL.includes("queryXsDtjgSjInfo")) && JSON.parse(this.response);
                        break;

                      case /qingshuxuetang.com/i.test(get_href()):
                        if (4 === this.readyState && (this.responseURL.includes("Student/DetailData") || this.responseURL.includes("Student/SimulationExercise/DetailData") || this.responseURL.includes("Student/Quiz/DetailData"))) {
                            const e = JSON.parse(this.response);
                            xe.qsques = e.data.paperDetail.questions, e.data.paperDetail.questions;
                        }
                        break;

                      case /cce.org.uooconline.com/i.test(get_href()):
                        if (4 === this.readyState && this.responseURL.includes("/exam/view?cid=")) {
                            const e = JSON.parse(this.response);
                            xe.cceques = e.data.questions, e.data.questions;
                        }
                        break;

                      case /cj-edu.com/i.test(get_href()):
                        if (4 === this.readyState && this.responseURL.includes("api/student/getHomeworkStudentInfo.do")) {
                            const e = JSON.parse(this.response);
                            xe.cjques = e.data, e.data;
                        }
                        break;

                      case /gxk.yxlearning.com/i.test(get_href()):
                        if (4 === this.readyState && this.responseURL.includes("cms/paper/start-do-paper-or-test.gson")) {
                            const e = JSON.parse(this.response);
                            xe.yxques = e.attribute.data, e.data;
                        }
                    }
                })), e.send.call(this, t);
            }
        });
    }, loadVue = () => {
        var e, t, n;
        const a = function() {
            const e = vue.effectScope(!0), t = e.run((() => vue.ref({})));
            let n = [], a = [];
            const o = vue.markRaw({
                install(e) {
                    setActivePinia(o), o._a = e, e.provide(se, o), e.config.globalProperties.$pinia = o, 
                    a.forEach((e => n.push(e))), a = [];
                },
                use(e) {
                    return this._a ? n.push(e) : a.push(e), this;
                },
                _p: n,
                _a: null,
                _e: e,
                _s: new Map,
                state: t
            });
            return o;
        }(), o = vue.createApp(tu);
        o.use(a);
        const l = document.createElement("div"), p = document.createElement("div");
        p.id = "AiAskApp", window.self !== window.top && (null == (t = null == (e = window.top) ? void 0 : e.location) ? void 0 : t.origin) === window.location.origin && Ft.iframe ? (p.id = "AiAskAppTop", 
        null == (n = window.top) || n.document.body.appendChild(l)) : document.body.append(l);
        const c = l.attachShadow({
            mode: "closed"
        });
        c.appendChild(p);
        try {
            const e = document.createElement("style");
            e.textContent = '*{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}#AiAskApp .el_wrapper>div{pointer-events:none;z-index:999999!important}#AiAskApp .el_wrapper>div>div{pointer-events:none;z-index:999999!important}.el-notification.right{min-height:84px}.home-container{display:flex;flex-direction:column;gap:8px;padding:0}.home-card{border-radius:12px;border:1px solid rgba(0,0,0,.06);box-shadow:0 1px 3px #0000000a;background:#fff;padding:14px 16px;transition:all .25s ease}.home-card:hover{box-shadow:0 4px 12px #00000014;border-color:#00000014}.user-status-card{margin-bottom:20px}.user-status{display:flex;align-items:center;justify-content:space-between;gap:16px}.user-info{display:flex;align-items:center;gap:14px;flex:1;min-width:0}.user-details{flex:1;min-width:0}.home-avatar{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#edf2ff,#f5f7fb);border:1px solid rgba(0,0,0,.06);display:grid;place-items:center;overflow:hidden}.home-avatar img{width:100%;height:100%;object-fit:cover}.home-avatar-icon{width:26px;height:26px;color:#5f6368}.user-details h3{margin:0;font-size:20px;font-weight:600;color:#1d1d1f;letter-spacing:-.022em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.user-details p{margin:0;font-size:13px;color:#86868b;display:flex;align-items:center;gap:6px;flex-wrap:wrap}.user-actions{flex-shrink:0}.home-tag{display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:8px;font-size:12px;font-weight:500;border:1px solid transparent}.home-tag-primary{background:#0071e31a;color:#0071e3;border-color:#0071e329}.home-tag-success{background:#34c7591f;color:#34c759;border-color:#34c75933}.home-tag-warning{background:#ff9f0a1f;color:#ff9f0a;border-color:#ff9f0a33}.tag-gap{margin-left:6px}.home-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 14px;border-radius:10px;border:1px solid rgba(0,0,0,.08);background:#f6f7fb;color:#1d1d1f;font-weight:500;cursor:pointer;transition:all .2s ease}.home-btn:hover{box-shadow:0 3px 10px #00000014;background:#fff}.home-btn-primary{background:linear-gradient(135deg,#6fb1fc,#4364f7);color:#fff;border-color:transparent}.home-btn-primary:hover{box-shadow:0 6px 16px #638bff59}.home-btn-plain{background:#fff}.home-btn-small{padding:8px 12px;font-size:13px;border-radius:8px}.home-divider{display:flex;align-items:center;gap:12px;margin:2px 0;color:#1d1d1f;font-size:15px;font-weight:500}.home-divider:before,.home-divider:after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(0,0,0,.08))}.home-divider:after{background:linear-gradient(90deg,rgba(0,0,0,.08),transparent)}.home-pages-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}.home-page-btn{width:100%;background:linear-gradient(135deg,#6fb1fc1a,#4364f70d);border:1px solid rgba(0,0,0,.06);color:#1d1d1f;font-weight:600;justify-content:flex-start;padding:10px 12px}.home-page-btn:hover{border-color:#0000001f;transform:translateY(-1px)}.home-page-btn .home-page-icon{width:20px;height:20px;color:var(--page-color, #4364f7)}.home-page-btn span{font-size:14px}@media (max-width: 480px){.user-status{flex-direction:column;align-items:flex-start;gap:12px}.user-actions,.user-actions .home-btn{width:100%}}.version-section{margin:0;padding:20px 24px;background:#fbfbfd;border-radius:12px;border:1px solid rgba(0,0,0,.06);text-align:center}.version-section p{margin:0;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:10px}.version-section p:first-child{font-size:14px;margin-bottom:8px}.version-section p:last-child{font-size:13px;color:#86868b;margin-top:12px;justify-content:center}.version-row{display:flex;align-items:center;gap:10px;margin:2px 0 0}.home-muted{color:#86868b}.small{font-size:13px}.tip-text{margin-top:2px}.notice-card{margin-top:12px;border-radius:10px;background:linear-gradient(135deg,#f7f9fc,#fff)}#AiAskApp .notice-content p{margin:0 0 6px;line-height:1.6}#AiAskApp .notice-content a{color:#409eff}#AiAskApp .notice-content{color:#606266;line-height:1.6;word-break:break-word;font-size:13px}.base-container{padding:0;display:flex;flex-direction:column;gap:12px}.tips-card{margin-bottom:0}.config-card{margin-bottom:0;padding:14px 16px;border-radius:12px;border:1px solid rgba(0,0,0,.06);box-shadow:0 1px 3px #0000000a;background:#fff}.card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.card-title{font-size:17px;font-weight:600;color:#1d1d1f;letter-spacing:-.022em}.config-list{display:flex;flex-direction:column;gap:12px}.config-item{padding:12px;background:#fff;border-radius:10px;transition:all .3s cubic-bezier(.25,.1,.25,1);border:1px solid rgba(0,0,0,.06)}.config-item:hover{background:#fbfbfd;box-shadow:0 2px 8px #0000000f;border-color:#00000014}.config-item-content{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap}.config-label{display:flex;align-items:center;gap:8px;flex:1;min-width:220px}.label-text{font-size:15px;font-weight:500;color:#1d1d1f}.info-icon{color:#86868b;cursor:help;font-size:16px;transition:color .2s ease}.info-icon:hover{color:#0071e3}.config-control{display:flex;align-items:center;flex-shrink:0;gap:10px;flex-wrap:wrap;justify-content:flex-end}.checkbox-group{display:flex;flex-wrap:wrap;gap:12px}.base-alert{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:10px;border:1px solid rgba(0,0,0,.06);background:#f5f9ff;color:#1d1d1f;font-size:14px}.base-alert-info{background:#4364f714;border-color:#4364f729}.alert-icon{font-size:16px}.base-tag{display:inline-flex;align-items:center;padding:4px 8px;border-radius:8px;font-size:12px;font-weight:600;border:1px solid transparent}.base-tag-success{background:#34c7591f;color:#34c759;border-color:#34c75933}.base-input,.base-select{min-width:200px;padding:8px 10px;border:1px solid rgba(0,0,0,.12);border-radius:8px;background:#fff;color:#1d1d1f;font-size:14px;transition:border-color .2s ease,box-shadow .2s ease}.base-input:focus,.base-select:focus{outline:none;border-color:#4364f7;box-shadow:0 0 0 3px #4364f72e}.base-select{min-width:180px}.toggle{position:relative;display:inline-flex;align-items:center;width:48px;height:26px}.toggle input{opacity:0;width:0;height:0;position:absolute}.toggle-slider{position:relative;display:block;width:100%;height:100%;background:#00000024;border-radius:26px;transition:all .2s ease}.toggle-slider:after{content:"";position:absolute;width:20px;height:20px;left:3px;top:3px;background:#fff;border-radius:50%;transition:all .2s ease;box-shadow:0 2px 6px #0000001f}.toggle input:checked+.toggle-slider{background:linear-gradient(135deg,#6fb1fc,#4364f7)}.toggle input:checked+.toggle-slider:after{transform:translate(22px)}.checkbox-group{display:flex;flex-wrap:wrap;gap:10px}.checkbox-item{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:8px;background:#f6f7fb;border:1px solid rgba(0,0,0,.06)}.hotkey-input-wrapper{position:relative;display:inline-flex;align-items:center;gap:8px}.hotkey-input-wrapper .hotkey-hint{font-size:12px;color:#86868b;background:#f6f7fb;padding:4px 8px;border-radius:8px}.hotkey-input-wrapper .hotkey-hint.danger{color:#c0392b;background:#c0392b1a}.hotkey-input-wrapper .base-input.recording{border-color:#c0392b;box-shadow:0 0 0 3px #c0392b29}.hotkey-input-wrapper :deep(.el-input.recording){border-color:#c33;animation:pulse 1.5s infinite}.hotkey-input-wrapper :deep(.el-input.recording input){background-color:#cc33330d;cursor:pointer}.hotkey-input-wrapper :deep(.el-input input){cursor:pointer}@keyframes pulse{0%,to{box-shadow:0 0 #cc33334d}50%{box-shadow:0 0 0 6px #c330}}@media (max-width: 768px){.config-item-content{flex-direction:column;align-items:flex-start}.config-control{width:100%;justify-content:flex-start}.config-control .base-input,.config-control .base-select{width:100%;min-width:0}.config-control .el-input,.config-control .el-select{width:100%;max-width:100%!important}}.question-type-select{margin-top:12px;display:flex;flex-direction:column;gap:6px}.helper-text{color:var(--el-text-color-secondary);font-size:13px;margin:0}.fade-slide-enter-active,.fade-slide-leave-active{transition:all .25s ease}.fade-slide-enter-from,.fade-slide-leave-to{opacity:0;transform:translateY(6px)}.floating-wrapper{position:fixed;top:0;right:0;bottom:0;left:0;pointer-events:none;z-index:999999}#AiAskApp .el_wrapper>.floating-wrapper{pointer-events:none!important}#AiAskApp .el_wrapper>.minimized-dialog{pointer-events:auto!important}.minimized-dialog{position:fixed;bottom:20px;right:20px;z-index:9999999}.floating-dialog{position:fixed;pointer-events:auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px #00000014,0 0 1px #0000000f;-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);background:#fff;border:1px solid rgba(0,0,0,.04);max-width:95vw;z-index:999999}#AiAskApp .el_wrapper>.floating-wrapper>.floating-dialog{pointer-events:auto!important}.floating-header{display:flex;align-items:center;justify-content:space-between;background:#fff;color:#1d1d1f;padding:24px 24px 16px;border-bottom:1px solid rgba(0,0,0,.06);cursor:move;-webkit-user-select:none;user-select:none;gap:12px}.floating-title{display:flex;align-items:center;gap:12px;font-size:17px;font-weight:600;color:#1d1d1f;letter-spacing:-.022em}.floating-title img{width:24px;height:24px;vertical-align:middle;border-radius:6px;box-shadow:0 1px 3px #00000014}.floating-version{margin-left:12px;background:#0071e31a;border:none;color:#0071e3;padding:4px 8px;border-radius:8px;font-size:12px;font-weight:600}.floating-actions{display:flex;align-items:center;gap:8px}.floating-btn{display:inline-flex;align-items:center;flex-direction:row;gap:6px;padding:8px 12px;border-radius:8px;border:1px solid rgba(0,0,0,.08);background:#f6f7fb;color:#1d1d1f;font-weight:500;cursor:pointer;transition:all .2s ease;white-space:nowrap;line-height:1.2}.floating-btn:hover{background:#fff;box-shadow:0 3px 10px #00000014}.floating-btn-plain{background:#fff}.floating-btn-small{padding:6px 10px;font-size:13px;border-radius:6px;min-height:32px}.floating-close{width:28px;height:28px;border:none;border-radius:50%;background:#0000000a;color:#333;font-size:18px;line-height:1;cursor:pointer;transition:all .2s ease}.floating-close:hover{background:#00000014}.floating-body{background:#fff}.floating-scroll{background:#fff;padding:24px;max-height:55vh;overflow:auto}.custom-scroll::-webkit-scrollbar{width:8px}.custom-scroll::-webkit-scrollbar-track{background:transparent}.custom-scroll::-webkit-scrollbar-thumb{background:#0000001f;border-radius:8px}.custom-scroll::-webkit-scrollbar-thumb:hover{background:#0003}.el-dialog{pointer-events:auto;border-radius:12px!important;overflow:hidden;box-shadow:0 4px 24px #00000014,0 0 1px #0000000f!important;-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);z-index:999999!important;background:#fff!important;padding:0!important;max-width:95vw!important;border:1px solid rgba(0,0,0,.04)}.el-dialog__header{background:#fff!important;color:#1d1d1f!important;padding:24px 24px 16px!important;margin:0!important;border-bottom:1px solid rgba(0,0,0,.06)}.el-dialog__header div[style*="display: flex"]{color:#1d1d1f!important}.el-dialog__header img{box-shadow:0 1px 3px #00000014!important}.el-dialog__header span[style*="font-size: 18px"]{color:#1d1d1f!important}.el-dialog__header .el-tag[style*="background: rgba"]{background:#0071e31a!important;border:none!important;color:#0071e3!important}.el-dialog__header .el-button[style*="background: rgba"]{background:transparent!important;border:1px solid rgba(0,0,0,.1)!important;color:#1d1d1f!important}.el-dialog__header .el-button[style*="background: rgba"]:hover{background:#0000000a!important}.el-dialog__title{color:#1d1d1f!important;font-weight:600;font-size:17px;letter-spacing:-.022em}.el-dialog__headerbtn .el-dialog__close{color:#86868b!important;font-size:18px;transition:color .2s ease}.el-dialog__headerbtn .el-dialog__close:hover{color:#1d1d1f!important}.el-dialog__body{padding:0!important;background:#fff!important}@media (max-width: 600px){#AiAskApp .el-scrollbar,#AiAskApp .el-scrollbar__wrap{max-height:50vh!important}#AiAskApp .floating-scroll{max-height:50vh}}@media (min-width: 601px){#AiAskApp .el-scrollbar,#AiAskApp .el-scrollbar__wrap{max-height:70vh!important}#AiAskApp .floating-scroll{max-height:70vh}}.el-scrollbar__view{background:#fff!important;padding:24px!important}.minimized-dialog img{pointer-events:auto;width:56px!important;height:56px!important;z-index:9999999!important;display:block;cursor:pointer}.mini-tooltip-wrapper{position:relative;display:inline-block}.mini-tooltip{position:absolute;bottom:calc(100% + 10px);right:0;background:#1f2937;color:#fff;padding:8px 10px;border-radius:10px;font-size:12px;box-shadow:0 4px 12px #0000001f;white-space:nowrap}.aah_breadcrumb{margin-bottom:24px;padding:0;background:transparent;border:none;border-radius:0}.breadcrumb{display:inline-flex;align-items:center;gap:8px;font-size:14px;white-space:nowrap;line-height:1.2}.breadcrumb-link{color:#0071e3;cursor:pointer;display:inline-flex;align-items:center;gap:4px;text-decoration:none;white-space:nowrap}.breadcrumb-link:hover{color:#0077ed;text-decoration:underline}.breadcrumb-sep,.breadcrumb-text{color:#86868b}.el-card{border-radius:12px!important;border:1px solid rgba(0,0,0,.06)!important;box-shadow:0 1px 3px #0000000a!important;transition:all .3s cubic-bezier(.25,.1,.25,1)!important;margin-bottom:16px;overflow:hidden;background:#fff!important}.el-card:hover{box-shadow:0 4px 12px #00000014!important;border-color:#00000014!important}.el-card__header{padding:20px 24px!important;border-bottom:1px solid rgba(0,0,0,.06);background:#fbfbfd}.el-card__body{padding:24px!important}.el-alert{border-radius:8px!important;border:1px solid!important;padding:14px 16px!important;margin-bottom:16px;font-size:14px}.el-alert--info{background:#f0f7ff!important;border-color:#b3d9ff!important;color:#06c}.el-alert--warning{background:#fff9e6!important;border-color:#ffe680!important;color:#c90}.el-alert--error{background:#fff0f0!important;border-color:#fcc!important;color:#c33}.el-alert--success{background:#f0fff4!important;border-color:#b3ffcc!important;color:#0c3}.el-button{border-radius:980px!important;padding:8px 20px!important;font-weight:400;font-size:14px;transition:all .2s cubic-bezier(.25,.1,.25,1)!important;border:1px solid transparent!important;letter-spacing:-.011em}.el-button--primary{background:#0071e3!important;color:#fff!important;border-color:#0071e3!important;box-shadow:0 1px 3px #0071e333}.el-button--primary:hover{background:#0077ed!important;border-color:#0077ed!important;box-shadow:0 2px 6px #0071e34d;transform:translateY(-1px)}.el-button--primary:active{background:#06c!important;transform:translateY(0)}.el-button--primary.is-plain{background:transparent!important;border:1px solid #d2d2d7!important;color:#0071e3!important;box-shadow:none}.el-button--primary.is-plain:hover{background:#0071e30d!important;border-color:#0071e3!important;transform:translateY(-1px)}.el-button--small{padding:6px 16px!important;font-size:13px}.el-button--large{padding:12px 28px!important;font-size:16px}.el-tag{border-radius:6px!important;padding:4px 12px!important;border:none!important;font-weight:400;font-size:12px;background:#f5f5f7!important;color:#1d1d1f!important}.el-tag--primary{background:#0071e31a!important;color:#0071e3!important}.el-tag--success{background:#00cc331a!important;color:#0c3!important}.el-tag--warning{background:#cc99001a!important;color:#c90!important}.el-tag--danger{background:#cc33331a!important;color:#c33!important}.el-tag--info{background:#f5f5f7!important;color:#86868b!important}.el-divider{margin:32px 0!important;border-color:#0000000f}.el-divider__text{background:#fff!important;padding:0 16px!important;color:#86868b;font-size:14px;font-weight:500}.el-input__wrapper{border-radius:8px!important;box-shadow:0 0 0 1px #0000001a inset!important;transition:all .2s ease;padding:8px 12px!important;background:#fff!important}.el-input__wrapper:hover{box-shadow:0 0 0 1px #00000026 inset!important}.el-input__wrapper.is-focus{box-shadow:0 0 0 2px #0071e3 inset!important}.el-input__inner{border:none!important;margin:auto;color:#1d1d1f;font-size:14px}.el-input__inner::placeholder{color:#86868b}.el-textarea__inner{border-radius:8px!important;box-shadow:0 0 0 1px #0000001a inset!important;padding:10px 12px!important;transition:all .2s ease;background:#fff!important;color:#1d1d1f;font-size:14px}.el-textarea__inner:focus{box-shadow:0 0 0 2px #0071e3 inset!important}.el-textarea__inner::placeholder{color:#86868b}.aah_title{font-size:15px;font-weight:500;line-height:1.6;color:#1d1d1f;margin-bottom:16px;padding:16px;background:#fbfbfd;border-radius:8px;border:1px solid rgba(0,0,0,.06);overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical}.aah_title img{max-width:100%;height:auto;overflow:hidden;border-radius:8px;margin:12px 0}.aah_options{transition:all .2s ease;cursor:pointer}.aah_options:hover{border-color:#0071e34d!important;background:#f5f5f7}.aah_options[style*="color:green"]{background:#00cc3314!important;border-color:#00cc334d!important;font-weight:500;color:#0c3!important}.aah_active{box-shadow:0 0 0 2px #0071e3}.aah_bomHet50{padding:13px 0 13px 10px}.aah_bomHet50 span{display:inline-block;line-height:24px;padding-left:14px;color:#86868b;font-size:13px}.aah_bomHet50 span i{display:inline-block;width:10px;height:10px;border:1px solid #d2d2d7;border-radius:2px;vertical-align:middle;margin-right:4px;margin-top:-2px}.aah_bomHet50 .dq i{background-color:#0071e31a;box-shadow:0 0 0 2px #0071e34d;border-color:#0071e3}.aah_bomHet50 .yp i{background-color:#00cc331a;border-color:#0c3}.aah_bomHet50 .wp i{background-color:#cc33331a;border-color:#c33}.modal-mask{position:fixed;top:0;right:0;bottom:0;left:0;background:#0006;display:grid;place-items:center;z-index:1000000;padding:20px}.modal-panel{background:#fff;border-radius:12px;width:min(600px,100%);max-height:80vh;display:flex;flex-direction:column;box-shadow:0 20px 60px #00000040}.modal-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(0,0,0,.06)}.modal-close{border:none;background:transparent;font-size:20px;cursor:pointer;color:#6b7280}.modal-body{padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:14px}.modal-footer{padding:12px 16px;border-top:1px solid rgba(0,0,0,.06);display:flex;justify-content:flex-end;gap:10px}.form-row{display:flex;flex-direction:column;gap:6px}.option-list{display:flex;flex-direction:column;gap:8px}.option-row{display:flex;gap:8px;align-items:center}.option-selector{width:36px;height:36px;border-radius:50%;border:1px solid rgba(0,0,0,.15);background:#f5f5f7;cursor:pointer}.option-selector.active{background:#10b981;color:#fff;border-color:#10b981}.flex-grow{flex:1}.el-upload__input{display:none!important}.question-card{margin-bottom:20px;animation:fadeIn .3s ease-out}.el-statistic{padding:20px;background:#fbfbfd;border-radius:12px;border:1px solid rgba(0,0,0,.06);margin-bottom:16px}.el-statistic :deep(.el-statistic__head){font-size:14px;color:#86868b;margin-bottom:8px;font-weight:400}.el-statistic :deep(.el-statistic__number){font-size:28px;font-weight:600;color:#1d1d1f;letter-spacing:-.022em}.el-upload{margin-bottom:16px}.el-upload :deep(.el-upload-dragger){border-radius:12px;border:2px dashed rgba(0,0,0,.1);background:#fff;transition:all .2s ease}.el-upload :deep(.el-upload-dragger:hover){border-color:#0071e3;background:#0071e308}.el-upload :deep(.el-upload__text){color:#1d1d1f;font-size:14px}.el-upload :deep(.el-upload__text em){color:#0071e3;font-style:normal;font-weight:500}.el-table{border-radius:12px;overflow:hidden;border:1px solid rgba(0,0,0,.06)}.el-table :deep(th){background:#fbfbfd;color:#1d1d1f;font-weight:600;font-size:14px;border-bottom:1px solid rgba(0,0,0,.06)}.el-table :deep(td){border-bottom:1px solid rgba(0,0,0,.04)}.el-table :deep(tr:hover){background:#fbfbfd}.log-container{margin:20px}.hljs{display:block;overflow-x:auto;padding:16px;background:#1d1d1f;color:#f5f5f7;border-radius:8px;box-shadow:0 2px 8px #00000014}.is-error{box-shadow:0 0 0 2px #cc33334d inset!important}.error-message{color:#c33;margin-top:8px;font-size:13px;font-weight:400}.el-form-item{margin-bottom:24px}.el-form-item__label{font-weight:500;color:#1d1d1f;font-size:14px}.el-slider__bar{background:#0071e3!important}.el-slider__button{border:2px solid #0071e3!important;box-shadow:0 1px 3px #0071e34d}.el-checkbox__input.is-checked .el-checkbox__inner,.el-radio__input.is-checked .el-radio__inner{background:#0071e3!important;border-color:#0071e3!important}.el-radio-button__inner{border-radius:8px!important;border:1px solid #d2d2d7!important;color:#1d1d1f!important;transition:all .2s ease}.el-radio-button__inner:hover{color:#0071e3!important;border-color:#0071e3!important}.el-radio-button__orig-radio:checked+.el-radio-button__inner{background:#0071e3!important;border-color:#0071e3!important;color:#fff!important;box-shadow:0 1px 3px #0071e333}.el-empty{padding:60px 0}.el-empty__description{color:#86868b;font-size:14px}.el-watermark{border-radius:12px}.el-pagination{margin-top:32px;display:flex;justify-content:center}.el-pagination.is-background .el-pager li{border-radius:6px!important;margin:0 4px;border:1px solid #d2d2d7;color:#1d1d1f;transition:all .2s ease}.el-pagination.is-background .el-pager li:hover{color:#0071e3;border-color:#0071e3}.el-pagination.is-background .el-pager li.is-active{background:#0071e3!important;border-color:#0071e3!important;color:#fff!important}.el-dropdown-menu{border-radius:8px!important;border:1px solid rgba(0,0,0,.06)!important;box-shadow:0 4px 16px #0000001a!important;padding:8px!important;background:#fff!important}.el-dropdown-menu__item{border-radius:6px!important;margin:2px 0;transition:all .2s ease;color:#1d1d1f;font-size:14px}.el-dropdown-menu__item:hover{background:#f5f5f7!important;color:#0071e3!important}.el-switch.is-checked .el-switch__core{background:#0071e3!important}.el-select__wrapper{border-radius:8px!important;box-shadow:0 0 0 1px #0000001a inset!important;transition:all .2s ease}.el-select__wrapper:hover{box-shadow:0 0 0 1px #00000026 inset!important}.el-select__wrapper.is-focused{box-shadow:0 0 0 2px #0071e3 inset!important}.el-tooltip__popper{border-radius:8px!important;padding:8px 12px!important;background:#1d1d1f!important;color:#f5f5f7!important;font-size:12px;box-shadow:0 4px 12px #00000026}.el-loading-mask{border-radius:12px!important;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);background:#fffc!important}.el-row{margin-bottom:20px}.el-scrollbar__wrap::-webkit-scrollbar{width:8px;height:8px}.el-scrollbar__wrap::-webkit-scrollbar-thumb{background:#d2d2d7;border-radius:4px}.el-scrollbar__wrap::-webkit-scrollbar-thumb:hover{background:#86868b}.el-scrollbar__wrap::-webkit-scrollbar-track{background:#f5f5f7;border-radius:4px}@keyframes fadeIn{0%{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fade-in{animation:fadeIn .3s cubic-bezier(.25,.1,.25,1)}.user-page{padding:0;max-width:100%}.user-page__login-section{position:relative;display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:24px;padding:32px;border-radius:16px;background:radial-gradient(circle at 20% 20%,rgba(0,113,227,.18),transparent 40%),radial-gradient(circle at 80% 0%,rgba(255,193,7,.2),transparent 35%),linear-gradient(135deg,#f3f7ff,#fdf7ff);overflow:hidden;border:1px solid rgba(0,0,0,.05);box-shadow:0 12px 30px #0000000f}.user-page__login-section:after{content:"";position:absolute;right:-100px;bottom:-120px;width:260px;height:260px;background:radial-gradient(circle,rgba(0,113,227,.25),transparent 70%);filter:blur(4px);opacity:.6}.user-page__hero-card{position:relative;z-index:1;padding:24px 12px}.user-page__badge{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;background:#0071e31f;color:#0f67d3;font-size:13px;font-weight:600;letter-spacing:.01em;border:1px solid rgba(0,113,227,.2)}.user-page__hero-card h1{margin:16px 0 8px;font-size:28px;line-height:1.2;color:#0f172a;letter-spacing:-.02em}.user-page__hero-desc{margin:0 0 16px;color:#4b5563;font-size:15px}.user-page__highlight{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.user-page__bullet{margin:0;padding-left:18px;color:#374151;line-height:1.8;font-size:14px}.user-page__login-box{position:relative;z-index:1;max-width:420px;margin:0 auto;padding:32px 28px;background:#ffffffc7;border-radius:16px;box-shadow:0 20px 60px #0000001f;border:1px solid rgba(0,0,0,.06);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}.user-page__login-header{text-align:center;margin-bottom:28px}.user-page__login-icon{font-size:56px;margin-bottom:12px}.user-page__login-header h2{margin:12px 0 8px;font-size:28px;font-weight:600;color:#1d1d1f;letter-spacing:-.022em}.user-page__login-header p{margin:0;color:#86868b;font-size:14px}.user-page__login-switch{display:inline-flex;gap:8px;margin-top:12px}.user-page__login-switch .btn{min-width:90px}.user-page__login-switch .btn.is-active{box-shadow:0 0 0 2px #4364f733}.user-page__login-form{margin-bottom:24px}.user-page__login-form .form-item{margin-bottom:20px}.user-page__login-btn{width:100%;height:44px;font-size:16px;font-weight:400;border-radius:980px!important}.user-page__login-hint{margin:12px 0 0;text-align:center;color:#6b7280;font-size:13px}.user-page__register-tip{text-align:center;margin-top:20px;color:#86868b;font-size:14px}.user-page__register-tip .link-btn{font-weight:400;margin-left:4px;color:#0071e3}.user-page__helper{margin:6px 0 0;color:#9ca3af;font-size:12px}.user-page__dashboard{padding:0;max-width:100%;margin:0 auto}.user-page__header-card{display:flex;align-items:center;gap:16px;padding:24px;background:#fbfbfd;border-radius:12px;margin-bottom:16px;border:1px solid rgba(0,0,0,.06)}.user-page__avatar{flex-shrink:0;width:64px;height:64px;border-radius:50%;border:3px solid rgba(255,255,255,.9);box-shadow:0 2px 8px #00000014;background:#f5f5f7;display:grid;place-items:center;overflow:hidden}.user-page__avatar img{width:100%;height:100%;object-fit:cover}.user-page__info-text h2{margin:0 0 4px;color:#1d1d1f;font-size:22px;font-weight:600;letter-spacing:-.022em}.user-page__username{margin:0;color:#86868b;font-size:14px}.user-page__stats-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px}.user-page__stat-card{display:flex;align-items:center;gap:12px;padding:16px;background:#fff;border-radius:10px;box-shadow:0 1px 3px #0000000a;border:1px solid rgba(0,0,0,.06);transition:all .2s ease}.user-page__stat-card:hover{transform:translateY(-2px);box-shadow:0 4px 12px #00000014}.user-page__stat-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}.user-page__stat-icon--coin{background:#ffc10726;color:#f39c12}.user-page__stat-icon--money{background:#0071e326;color:#0071e3}.user-page__stat-icon--course{background:#ff572226;color:#ff5722}.user-page__stat-icon--question{background:#4caf5026;color:#4caf50}.user-page__stat-content{flex:1;min-width:0}.user-page__stat-label{margin:0 0 4px;color:#86868b;font-size:12px;font-weight:400}.user-page__stat-value{margin:0;color:#1d1d1f;font-size:20px;font-weight:600;letter-spacing:-.022em}.user-page__support-card{display:flex;align-items:center;gap:12px;padding:16px;background:#fff;border-radius:12px;box-shadow:0 1px 3px #0000000a;border:1px solid rgba(0,0,0,.06);margin-bottom:16px}.user-page__support-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:#4364f71f;color:#4364f7;font-size:20px}.user-page__support-content{flex:1;min-width:0}.user-page__support-title{margin:0 0 4px;font-size:15px;font-weight:600;color:#1d1d1f}.user-page__support-desc{margin:0;color:#6b7280;font-size:13px}.user-page__support-btn{white-space:nowrap}.user-page__apikey-section{padding:20px;background:#fff;border-radius:12px;box-shadow:0 1px 3px #0000000a;border:1px solid rgba(0,0,0,.06);margin-bottom:16px}.user-page__section-header{display:flex;align-items:center;gap:8px;margin-bottom:16px}.user-page__section-header h3{margin:0;font-size:17px;font-weight:600;color:#1d1d1f;letter-spacing:-.022em}.user-page__apikey-display{margin-top:12px}.user-page__apikey-input input{font-family:SF Mono,Monaco,Menlo,Courier New,monospace;font-size:13px}.user-page__actions{display:flex;justify-content:center;gap:12px;padding:20px;background:#fff;border-radius:12px;box-shadow:0 1px 3px #0000000a;border:1px solid rgba(0,0,0,.06)}.user-page__tips{text-align:center}.user-page__tips p{margin:12px 0 0;color:#6b7280;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}@media (max-width: 768px){.user-page__login-section{grid-template-columns:1fr;padding:22px}.user-page__hero-card h1{font-size:24px}.user-page__dashboard{padding:0}.user-page__header-card{flex-direction:column;text-align:center;padding:20px}.user-page__stats-grid{grid-template-columns:repeat(2,1fr);gap:10px}.user-page__stat-card{padding:14px}.user-page__stat-icon{width:36px;height:36px;font-size:18px}.user-page__stat-value{font-size:18px}.user-page__support-card{flex-direction:column;align-items:flex-start}.user-page__apikey-section{padding:16px}.user-page__actions{flex-direction:column}.user-page__actions .el-button{width:100%}}.paper-library-container{padding:0;display:flex;flex-direction:column;gap:16px}.status-banner{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:10px;font-size:13px;border:1px solid rgba(0,0,0,.05);background:#f5f5f7}.status-dot{width:8px;height:8px;border-radius:50%;background:currentColor;display:inline-block}.status-success{color:#0f5132;background:#10b9811f;border-color:#10b9814d}.status-error{color:#b91c1c;background:#ef44441f;border-color:#ef44444d}.status-info{color:#1d4ed8;background:#3b82f61f;border-color:#3b82f647}.status-warning{color:#92400e;background:#f59e0b1f;border-color:#f59e0b47}.basic-card{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.06);box-shadow:0 1px 3px #0000000a;padding:18px 20px}.info-card{display:flex;gap:12px;align-items:flex-start}.info-text{font-size:13px;color:#1f2937;line-height:1.6}.info-highlight{color:#d97706;margin-left:4px;font-weight:600}.search-card{display:flex;flex-direction:column;gap:10px}.search-header{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.input-wrap{flex:1;display:flex;align-items:center;gap:8px;padding:10px 12px;background:#f5f5f7;border-radius:10px;border:1px solid transparent;transition:border-color .2s ease,box-shadow .2s ease}.input-wrap:focus-within{border-color:#0071e359;box-shadow:0 0 0 4px #0071e314}.input-prefix{font-size:16px}.input-field{flex:1;border:none;background:transparent;font-size:14px;outline:none;color:#111827}.search-stats{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.btn{border:1px solid rgba(0,0,0,.12);background:#f5f5f7;color:#111827;padding:8px 14px;border-radius:10px;font-size:13px;cursor:pointer;transition:all .2s ease}.btn:not(.btn-primary):hover:enabled{background:#fff;box-shadow:0 4px 10px #0000001a}.btn:disabled{opacity:.6;cursor:not-allowed}.btn-primary{background:linear-gradient(135deg,#6fb1fc,#4364f7);color:#fff;border-color:transparent}.btn-primary:hover:enabled{filter:brightness(.95)}.btn-small{padding:4px 10px;font-size:12px;border-radius:8px}.btn-danger{background:#fee2e2;color:#b91c1c;border-color:#b91c1c66}.btn-outline{background:#fff}.ghost{box-shadow:none}.btn-ghost{background:transparent;border-color:#00000014}.mb-10{margin-bottom:10px!important}.mt-10{margin-top:10px!important}.mt-20{margin-top:20px!important}.param-table-card{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:10px;padding:10px;display:flex;flex-direction:column;gap:8px}.param-table-header,.param-table-row{display:grid;grid-template-columns:180px 1fr 90px;gap:10px;align-items:center}.param-table-header{font-weight:600;color:#4b5563;font-size:13px}.param-table-row{padding:6px 0;border-bottom:1px solid rgba(0,0,0,.04)}.param-table-row:last-child{border-bottom:none}.param-value-group{display:flex;gap:8px;flex-wrap:wrap}.param-type{width:120px}.param-value{flex:1;min-width:160px}.param-code-wrapper{flex:1;min-width:200px;display:flex;flex-direction:column;gap:6px}.param-code{width:100%;min-height:80px}.param-error{color:#dc2626;font-size:12px}.papers-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-bottom:8px}.papers-grid .soft-loading{grid-column:1 / -1;padding:24px 0}.empty-block{grid-column:1 / -1;text-align:center;padding:48px 12px;background:#fff;border-radius:12px;border:1px dashed rgba(0,0,0,.08)}.empty-emoji{font-size:40px;margin-bottom:8px}.empty-text{margin:0;color:#6b7280}.paper-card{cursor:pointer;transition:all .2s cubic-bezier(.25,.1,.25,1);height:100%;display:flex;flex-direction:column}.paper-card:hover{transform:translateY(-2px);box-shadow:0 6px 16px #00000014;border-color:#0071e340}.paper-header{display:flex;align-items:flex-start;gap:14px;margin-bottom:12px}.paper-icon{flex-shrink:0;width:44px;height:44px;display:grid;place-items:center;background:#0071e31a;border-radius:10px;font-size:20px}.paper-info{flex:1;min-width:0}.paper-title{margin:0 0 8px;font-size:16px;font-weight:600;color:#1d1d1f;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;line-height:1.4}.paper-meta{display:flex;gap:6px;flex-wrap:wrap}.paper-footer{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:12px;border-top:1px solid rgba(0,0,0,.06)}.paper-actions{display:flex;align-items:center;gap:8px}.chevron{color:#9ca3af;font-size:18px;transition:transform .2s ease,color .2s ease}.paper-card:hover .chevron{transform:translate(2px);color:#4364f7}.header-card{display:flex;flex-direction:column;gap:12px}.header-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:space-between;align-items:center;padding-bottom:10px;border-bottom:1px solid rgba(0,0,0,.06)}.header-action-group{display:flex;gap:8px;flex-wrap:wrap}.course-info h2,.chapter-info-header h2{margin:0;font-size:22px;font-weight:700;color:#1d1d1f;letter-spacing:-.02em}.course-stats,.chapter-info-header{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px}.chapters-list{display:flex;flex-direction:column;gap:12px}.chapter-card{cursor:pointer;transition:all .3s cubic-bezier(.25,.1,.25,1)}.chapter-card:hover{transform:translateY(-2px);box-shadow:0 6px 16px #00000014;border-color:#0071e340}.chapter-header{display:flex;align-items:center;gap:14px}.chapter-number{width:36px;height:36px;border-radius:10px;background:#0071e3;color:#fff;display:grid;place-items:center;font-size:15px;font-weight:700;flex-shrink:0;box-shadow:0 2px 6px #0071e340}.chapter-info{flex:1;min-width:0}.chapter-title{margin:0;font-size:17px;font-weight:600;color:#1d1d1f;line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical}.chapter-meta{margin-top:6px}.chapter-actions{display:flex;align-items:center;gap:10px;margin-left:auto;flex-shrink:0}.questions-container{display:flex;flex-direction:column;gap:16px}.question-card{transition:all .2s cubic-bezier(.25,.1,.25,1)}.question-card:hover{transform:translateY(-1px);box-shadow:0 6px 16px #00000014;border-color:#0071e340}.question-number{display:inline-block;padding:4px 12px;background:#0071e3;color:#fff;border-radius:6px;font-size:12px;font-weight:700;margin-bottom:12px;box-shadow:0 1px 4px #0071e333}.question-title{font-size:15px;line-height:1.6;color:#1d1d1f;margin-bottom:14px;word-break:break-word;padding:12px;background:#f5f5f7;border-radius:10px}.question-title img{max-width:100%;height:auto;border-radius:8px;margin:12px 0}.question-options{margin-bottom:16px}.option-item{display:flex;align-items:flex-start;padding:12px 14px;margin-bottom:8px;background:#f5f5f7;border-radius:10px;transition:all .2s ease;border:1px solid transparent}.option-item:last-child{margin-bottom:0}.option-item:hover{background:#ebebed;transform:translate(2px);border-color:#0071e326}.option-item.is-answer{background:#10b9811f;border:1px solid rgba(16,185,129,.35);color:#1d1d1f;font-weight:500}.option-item .option-label{flex-shrink:0;font-weight:700;margin-right:10px;min-width:24px;color:#9ca3af}.option-item.is-answer .option-label{color:#10b981}.option-content{flex:1;line-height:1.6;word-break:break-word}.option-content img{max-width:100%;height:auto;border-radius:6px;margin:8px 0}.question-answer{margin-top:14px;padding-top:12px;border-top:1px solid rgba(0,0,0,.06)}.answer-divider{display:inline-flex;align-items:center;gap:6px;padding:4px 8px;border-radius:8px;background:#10b9811f;color:#0f5132;font-weight:700;font-size:13px}.answer-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.answer-content{padding:12px;background:#10b98114;border-radius:10px;color:#111827;line-height:1.6;word-break:break-word;border:1px solid rgba(16,185,129,.2);margin-top:10px}.answer-content img{max-width:100%;height:auto;border-radius:6px;margin:8px 0}.muted-text{color:#6b7280;font-size:13px}.pill-warn{background:#d9770626;color:#92400e}.question-page{position:relative;padding:0}.question-page .watermark-bg{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none;display:grid;place-items:center;gap:6px;font-size:18px;color:#0000000d;text-transform:uppercase;z-index:0}.question-page>*:not(.watermark-bg){position:relative;z-index:1}.info-banner{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.06);box-shadow:0 1px 3px #0000000a;padding:16px 18px;margin-bottom:14px}.info-title{font-size:15px;font-weight:700;color:#111827;margin-bottom:6px}.info-body{font-size:13px;color:#1f2937;line-height:1.6}.warn-text{color:#b91c1c;font-weight:600}.stats-row{display:flex;gap:12px;margin-bottom:14px}.stat-card{flex:1;min-width:0;background:linear-gradient(135deg,#0071e314,#638bff14);border:1px solid rgba(0,113,227,.18);border-radius:12px;padding:14px;box-shadow:0 1px 3px #0000000a}.stat-label{font-size:12px;color:#374151;margin-bottom:6px}.stat-value{font-size:26px;font-weight:800;color:#111827;letter-spacing:-.02em}.upload-box{background:#fff;border:1px dashed rgba(0,0,0,.15);border-radius:12px;padding:18px;text-align:center;cursor:pointer;margin-bottom:14px;transition:all .2s ease}.upload-box:hover{border-color:#0071e366;box-shadow:0 4px 12px #00000014}.upload-input{display:none}.upload-text{display:flex;flex-direction:column;gap:6px;align-items:center;color:#374151;font-size:14px}.upload-icon{font-size:22px}.upload-desc em{color:#4364f7;font-style:normal;font-weight:700}.upload-hint{font-size:12px;color:#6b7280}.actions-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}.question-table{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;overflow:hidden;box-shadow:0 1px 3px #0000000a}.table-head,.table-row{display:grid;grid-template-columns:120px 1.3fr 1fr 1fr}.table-head{background:#f5f5f7;font-weight:700;color:#111827;border-bottom:1px solid rgba(0,0,0,.06)}.table-row:nth-child(2n){background:#fbfbfc}.cell{padding:12px 14px;border-right:1px solid rgba(0,0,0,.04);font-size:13px;color:#1f2937;line-height:1.6;word-break:break-word}.table-head .cell{padding:12px 14px}.cell:last-child{border-right:none}.table-empty{padding:18px;text-align:center;color:#6b7280;font-size:13px}@media (max-width: 900px){.table-head,.table-row{grid-template-columns:100px 1fr}.cell-options,.cell-answer,.cell-question{grid-column:1 / -1}.cell-type{border-right:none;border-bottom:1px solid rgba(0,0,0,.04)}}.question-tool{padding:0}.qt-actions{margin:12px 0}.qt-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}.qt-editor,.qt-preview{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;box-shadow:0 1px 3px #0000000a;padding:14px}.qt-textarea{width:100%;min-height:480px;border:1px solid rgba(0,0,0,.12);border-radius:10px;padding:12px;font-size:14px;line-height:1.6;resize:vertical;outline:none}.qt-textarea:focus{border-color:#0071e380;box-shadow:0 0 0 3px #0071e326}.qt-preview{max-height:640px;overflow:auto}.qt-empty{text-align:center;color:#6b7280;padding:24px 12px}.qt-card{border:1px solid rgba(0,0,0,.06);border-radius:10px;padding:12px;margin-bottom:12px;background:#f9fafb}.qt-card-error{border-color:#f87171;background:#fef2f2}.qt-card-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}.qt-title-no{font-weight:700;color:#1f2937}.qt-tag{display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;font-size:12px;background:#f3f4f6;color:#111827}.qt-tag.danger{background:#ef444426;color:#b91c1c}.qt-tag.success{background:#10b98126;color:#065f46}.qt-question,.qt-answer{margin:6px 0;font-size:14px;color:#1f2937;line-height:1.6}.qt-options{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.qt-error{margin-top:8px;padding:10px;border-radius:8px;background:#ef44441f;color:#991b1b;font-size:13px}.label{color:#6b7280;margin-right:4px}@media (max-width: 960px){.qt-grid{grid-template-columns:1fr}.qt-textarea{min-height:360px}}.log-container{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;box-shadow:0 1px 3px #0000000a;overflow:hidden}.log-head,.log-row{display:grid;grid-template-columns:180px 1fr}.log-head{background:#f5f5f7;font-weight:700;color:#111827;border-bottom:1px solid rgba(0,0,0,.06)}.log-row{border-bottom:1px solid rgba(0,0,0,.04)}.log-row:last-child{border-bottom:none}.log-cell{padding:12px 14px;font-size:13px;line-height:1.5}.cell-time{color:#4b5563;border-right:1px solid rgba(0,0,0,.04)}.cell-content{color:#1f2937}.log-empty{padding:14px;text-align:center;color:#6b7280;font-size:13px}@media (max-width: 768px){.header-actions{flex-direction:column;align-items:flex-start}.papers-grid{grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}.paper-footer{flex-direction:column;align-items:flex-start;gap:10px}.chapter-header{align-items:flex-start}}.ai-container{padding:0;display:flex;flex-direction:column;gap:16px}.basic-card.search-card,.basic-card.result-card,.basic-card.copyright-card{margin-bottom:4px}.card-header{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.card-title{font-size:16px;font-weight:700;color:#111827}.ai-textarea{width:100%;border:1px solid rgba(0,0,0,.12);border-radius:10px;padding:12px;font-size:14px;line-height:1.6;resize:vertical;outline:none;margin-bottom:12px}.ai-textarea:focus{border-color:#0071e380;box-shadow:0 0 0 3px #0071e326}.mode-switch{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.pill-btn{border:1px solid rgba(0,0,0,.12);background:#f5f5f7;padding:8px 12px;border-radius:999px;font-size:13px;cursor:pointer;transition:all .2s ease}.pill-btn.active{background:linear-gradient(135deg,#6fb1fc,#4364f7);color:#fff;border-color:transparent;box-shadow:0 4px 10px #638bff40}.native-select{display:flex;flex-direction:column;gap:6px;margin-bottom:8px}.native-select select{width:100%;padding:10px 12px;border-radius:10px;border:1px solid rgba(0,0,0,.12);font-size:14px}.btn.full{width:100%}.result-content{min-height:100px;padding:8px 0}.soft-loading{text-align:center;padding:16px 8px;color:#6b7280}.soft-alert{padding:12px;border-radius:10px;margin-bottom:12px;font-size:13px;line-height:1.5}.soft-alert.warning{background:#f59e0b1f;color:#92400e;border:1px solid rgba(245,158,11,.28)}.link-btn{background:transparent;border:none;color:#4364f7;cursor:pointer;margin-left:8px}.official-meta{border:1px solid rgba(0,0,0,.06);border-radius:10px;overflow:hidden;margin-bottom:12px}.meta-row{display:grid;grid-template-columns:120px 1fr;border-bottom:1px solid rgba(0,0,0,.06)}.meta-row:last-child{border-bottom:none}.meta-label{background:#f5f5f7;padding:10px 12px;font-weight:700;color:#111827}.meta-value{padding:10px 12px;color:#1f2937;line-height:1.6}.meta-options{padding:10px 12px;display:flex;flex-direction:column;gap:8px}.meta-option{display:flex;gap:8px;align-items:flex-start}.meta-option .option-label{font-weight:700;color:#6b7280}.meta-option .option-text{flex:1;color:#1f2937;line-height:1.6}.official-result-list{display:flex;flex-direction:column;gap:12px}.official-result-item{border:1px solid rgba(0,0,0,.06);border-radius:10px;padding:12px;background:#f9fafb;box-shadow:0 1px 2px #0000000a}.official-result-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.official-result-title{font-weight:700;color:#111827}.official-result-subtitle{color:#6b7280;margin-left:10px;font-size:12px}.official-section{margin-top:10px}.section-label{font-weight:700;color:#374151;margin-bottom:6px}.official-question{background:#fff;border:1px solid rgba(0,0,0,.04);border-radius:6px;padding:8px;line-height:1.6;color:#111827}.official-options{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.official-options li{display:flex;gap:8px;align-items:flex-start;background:#fff;border:1px solid rgba(0,0,0,.04);border-radius:6px;padding:8px}.official-options .option-label{font-weight:700;color:#6b7280}.official-options .option-text{color:#111827;line-height:1.5}.answer-chips{display:flex;flex-wrap:wrap;gap:8px}.answer-empty{color:#6b7280}.ask-shell{max-width:820px;width:100%;display:flex;flex-direction:column;gap:8px}.ask-toolbar{display:flex;justify-content:space-between;gap:8px;align-items:center}.ask-toolbar__main{display:flex;gap:8px}.ask-toolbar__actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.ask-toolbar .btn.is-active{box-shadow:0 0 0 1px #4364f747}.ask-shell__body{display:flex;flex-direction:column;gap:8px;padding-right:2px}.ask-grid{display:grid;grid-template-columns:260px 1fr;gap:8px}.ask-col{display:flex;flex-direction:column;gap:8px}.ask-col--left{flex-shrink:0}.ask-section{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.06);padding:10px;box-shadow:0 1px 3px #0000000a}.ask-section__header{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}.ask-section__title{font-size:15px;font-weight:600;color:#1d1d1f;letter-spacing:-.01em}.ask-section__actions{display:flex;gap:6px;align-items:center}.ask-section__actions--links{gap:4px}.ask-section__hint{color:#6b7280;font-size:12px}.ask-container{padding:0;display:flex;flex-direction:column;gap:8px}.ask-info{display:flex;flex-direction:column;gap:4px}.ask-types summary{cursor:pointer;color:#4364f7;font-weight:600}.ask-actions{display:flex;gap:8px;flex-wrap:wrap}.ask-question-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(36px,1fr));gap:6px;padding:8px;max-height:200px;overflow:auto;background:#f7f8fb;border-radius:10px}.ask-question-btn{width:32px;height:32px;border-radius:6px;border:1px solid rgba(0,0,0,.12);background:#f5f5f7;cursor:pointer;font-size:12px;transition:all .2s ease}.ask-question-btn.status-success{border-color:#10b98166;background:#10b98126}.ask-question-btn.status-danger{border-color:#ef444466;background:#ef444426}.ask-legend{display:flex;align-items:center;gap:10px;flex-shrink:0;font-size:12px;color:#6b7280;margin:0 2px 6px}.ask-legend span{display:inline-flex;align-items:center;gap:4px}.ask-legend span i{display:inline-block;width:10px;height:10px;border:1px solid #d2d2d7;border-radius:2px}.ask-legend .dq i{background-color:#0071e31a;box-shadow:0 0 0 1px #0071e34d;border-color:#0071e3}.ask-legend .yp i{background-color:#00cc331a;border-color:#0c3}.ask-legend .wp i{background-color:#cc33331a;border-color:#c33}.ask-question-btn.aah_active{background:linear-gradient(135deg,#6fb1fc,#4364f7);color:#fff;border-color:transparent;box-shadow:0 4px 10px #638bff40}.ask-settings{background:#fff;padding:10px;border-radius:10px;border:1px solid rgba(0,0,0,.06);display:flex;flex-wrap:wrap;gap:8px;align-items:center}.native-checkbox{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#1d1d1f}.native-checkbox input{width:16px;height:16px}.range-row{display:flex;flex-direction:column;gap:4px;flex:1;min-width:200px}.range-row input[type=range]{width:100%}.ask-tags{display:flex;flex-wrap:wrap;gap:6px}.ask-secondary-actions{display:flex;align-items:center;gap:6px}.ask-secondary-actions .divider{width:1px;height:16px;background:#0000001a}.ask-question-content{background:#fff;padding:14px;border-radius:10px;border:1px solid rgba(0,0,0,.06)}.ask-question-content .aah_options.active{color:#10b981}.ask-match-table{width:100%;border-collapse:collapse;margin:6px 0}.ask-match-table td{border:1px solid rgba(0,0,0,.06);padding:8px}.ask-loading{position:relative}.ask-loading .loading-box{display:inline-block;padding:6px 10px;background:#3b82f61a;border-radius:8px;color:#1d4ed8;font-size:13px}.ask-answer-content{display:flex;flex-direction:column;gap:12px}.ai-answer-block{border-color:#4364f72e;box-shadow:0 6px 18px #4364f714}.ai-divider{display:flex;align-items:center;justify-content:space-between;gap:8px}.ai-streaming-tag{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:999px;background:#4364f71f;color:#1d4ed8;font-size:12px;font-weight:600}.ai-dot{width:6px;height:6px;border-radius:50%;background:#4364f7;display:inline-block;animation:ai-bounce 1.4s infinite ease-in-out}.ai-dot:nth-child(2){animation-delay:.2s}.ai-dot:nth-child(3){animation-delay:.4s}.ai-stream-placeholder{padding:10px 12px;border-radius:10px;border:1px dashed rgba(67,100,247,.3);background:linear-gradient(135deg,#6fb1fc14,#4364f70d);color:#475569;font-size:13px;line-height:1.6}.ai-answer-markdown{line-height:1.6}@keyframes ai-bounce{0%,80%,to{transform:scale(.8);opacity:.6}40%{transform:scale(1.15);opacity:1}}.answer-block{background:#fff;border-radius:10px;border:1px solid rgba(0,0,0,.06);padding:10px}.answer-divider{font-weight:700;color:#1f2937;margin-bottom:8px}.answer-field{width:100%;border-radius:8px;border:1px solid rgba(0,0,0,.12);padding:10px;font-size:13px;background:#f5f5f7}.answer-field-html{width:100%;border-radius:8px;border:1px solid rgba(0,0,0,.12);padding:10px;background:#f5f5f7;font-size:13px;color:#1f2937;line-height:1.6}.ask-container .aah_bomHet50{background:#fbfbfd;border-radius:10px;padding:12px 16px;margin-bottom:16px;border:1px solid rgba(0,0,0,.06)}.ask-section__actions .divider{background:#0000001f;height:12px;width:1px}.green{color:#059669}.red{color:#dc2626}@media (max-width: 768px){.ask-grid{grid-template-columns:1fr}.ask-col--left{order:2}.ask-col--right{order:1}.ask-settings{flex-direction:column;align-items:flex-start}.ask-question-grid{max-height:160px;overflow:auto}}.preview-container{padding:0}.preview-info{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:10px;background:linear-gradient(135deg,#0071e314,#638bff14);border:1px solid rgba(0,113,227,.12);margin-bottom:16px}.info-icon{font-size:18px}.info-text{font-size:13px;color:#1d1d1f;line-height:1.6}.info-highlight{display:inline-block;margin-left:8px;color:#d97706;font-weight:600}.search-section{margin-bottom:16px;padding:18px 20px;background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.06);box-shadow:0 1px 3px #0000000a}.search-label{font-size:13px;color:#6b7280;margin-bottom:8px}.search-bar{display:flex;align-items:center;gap:10px;background:#f5f5f7;border-radius:10px;padding:10px 12px;border:1px solid transparent;transition:border-color .2s ease,box-shadow .2s ease}.search-bar:focus-within{border-color:#0071e359;box-shadow:0 0 0 4px #0071e314}.search-icon{font-size:16px}.search-input{flex:1;border:none;background:transparent;font-size:14px;outline:none}.search-clear{border:none;background:#111827;color:#fff;padding:6px 10px;border-radius:8px;font-size:12px;cursor:pointer;transition:background .2s ease}.search-clear:hover{background:#0f172a}.search-result-info{margin-top:12px;text-align:left;animation:fadeIn .3s ease-out}.pill{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;font-size:13px;font-weight:600;letter-spacing:.1px}.pill-primary{background:#0071e31f;color:#0056b3}.pill-success{background:#10b98126;color:#0f5132}.highlight{color:#d97706;font-weight:700}.watermark-shell{position:relative;background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.05);box-shadow:0 1px 3px #0000000a;padding:16px;overflow:hidden}.watermark-shell.is-loading{opacity:.7}.watermark-bg{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none;z-index:0;background-image:repeating-linear-gradient(45deg,rgba(17,24,39,.04) 0,rgba(17,24,39,.04) 1px,transparent 1px,transparent 40px);display:grid;place-items:center;gap:8px;font-size:18px;color:#0000000f;text-transform:uppercase}.watermark-bg span{display:block}.watermark-shell>:not(.watermark-bg){position:relative;z-index:1}.empty-state{position:relative;padding:80px 20px;text-align:center}.empty-icon{font-size:68px;margin-bottom:14px}.empty-text{color:#6b7280;margin:0}.questions-list{position:relative;display:flex;flex-direction:column;gap:16px;margin-bottom:8px}.question-item-wrapper{animation:fadeIn .3s ease-out}.question-item-card{background:#fff;border-radius:12px;padding:22px;box-shadow:0 1px 2px #0000000a;border:1px solid rgba(0,0,0,.06);position:relative;transition:all .2s cubic-bezier(.25,.1,.25,1);overflow:visible}.question-item-card:hover{transform:translateY(-1px);box-shadow:0 6px 18px #00000014;border-color:#0071e333}.question-item-card:hover .question-badge .badge-number{transform:translateY(-1px)}.question-badge{position:absolute;top:-12px;left:18px;z-index:10}.badge-number{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:34px;padding:0 10px;background:#0071e3;color:#fff;font-size:15px;font-weight:700;border-radius:8px;box-shadow:0 2px 6px #0071e340;transition:transform .2s ease}.question-actions-top{position:absolute;top:16px;right:16px;display:flex;gap:8px;z-index:10}.icon-btn{width:32px;height:32px;border:none;border-radius:8px;background:#f5f5f7;cursor:pointer;display:grid;place-items:center;font-size:16px;transition:transform .2s ease,box-shadow .2s ease,background .2s ease}.icon-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px #0000001f}.icon-btn-primary{color:#0f172a}.icon-btn-danger{color:#b91c1c}.question-main{margin-top:16px}.question-header-section{margin-bottom:16px}.question-type-tag{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:6px 12px;border-radius:999px;background:#0071e31f;color:#0056b3}.question-text{font-size:15px;line-height:1.6;color:#1d1d1f;margin-bottom:18px;padding:14px;background:#f7f7fa;border-radius:10px;border:1px dashed rgba(0,0,0,.05)}.question-text img{max-width:100%;height:auto;border-radius:8px;margin:12px 0}.options-section{margin-bottom:20px}.complex-question-tip{margin-bottom:18px}.soft-alert{padding:12px 14px;border-radius:10px;font-size:13px;line-height:1.5}.soft-alert-warning{background:#f59e0b1f;color:#92400e;border:1px solid rgba(245,158,11,.3)}.options-list{display:flex;flex-direction:column;gap:10px}.option-item{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;background:#f5f5f7;border:1px solid transparent;border-radius:10px;transition:all .2s ease;position:relative;cursor:pointer}.option-item:hover{background:#ebebed;border-color:#0071e326;transform:translate(2px)}.option-item.option-correct{background:#10b9811f;border-color:#10b98159}.option-letter{display:flex;align-items:center;justify-content:center;min-width:28px;height:28px;background:#fff;border:1px solid #d2d2d7;border-radius:8px;color:#1d1d1f;font-size:13px;font-weight:700;flex-shrink:0;transition:all .2s ease}.option-item.option-correct .option-letter{background:#10b981;border-color:#10b981;color:#fff}.option-text{flex:1;line-height:1.6;color:#1d1d1f;padding-top:4px}.correct-badge{display:flex;align-items:center;justify-content:center;width:26px;height:26px;background:#10b981;color:#fff;border-radius:50%;font-size:14px;font-weight:700;flex-shrink:0;box-shadow:0 2px 8px #10b9814d}.answer-section{background:#10b98114;border-radius:10px;padding:14px;border:1px solid rgba(16,185,129,.28);margin-top:14px}.answer-header{display:flex;align-items:center;gap:6px;margin-bottom:10px;color:#0f5132;font-size:14px;font-weight:700}.answer-icon{font-size:16px}.answer-content-wrapper{margin-top:8px}.answer-tags{display:flex;flex-wrap:wrap;gap:8px}.answer-text{padding:12px;background:#fff;border-radius:8px;line-height:1.6;color:#1d1d1f;box-shadow:0 1px 3px #0000000a}.no-answer{display:flex;align-items:center;gap:8px;color:#6b7280;font-style:italic;padding:8px 4px}.no-answer .muted{color:#9ca3af}.pagination-wrapper{display:flex;justify-content:center;padding:18px 0;background:#fff;border-radius:12px;box-shadow:0 1px 2px #0000000a;border:1px solid rgba(0,0,0,.06);margin-top:12px}.pager{display:flex;align-items:center;gap:12px}.pager-btn{border:1px solid rgba(0,0,0,.12);background:#f5f5f7;color:#111827;padding:8px 12px;border-radius:10px;font-size:13px;cursor:pointer;transition:all .2s ease}.pager-btn:hover:enabled{background:#fff;box-shadow:0 4px 10px #0000001a}.pager-btn:disabled{cursor:not-allowed;opacity:.6}.pager-info{display:flex;align-items:center;gap:6px;font-size:13px;color:#111827}.pager-input{width:60px;padding:6px 8px;border-radius:8px;border:1px solid rgba(0,0,0,.12);font-size:13px;outline:none}.pager-total{font-size:12px;color:#6b7280}@media (max-width: 768px){.question-item-card{padding:18px 14px}.question-badge{left:12px}.badge-number{min-width:38px;height:38px;font-size:15px}.question-actions-top{top:12px;right:12px}.question-text{font-size:15px;padding:14px}.option-item,.answer-section{padding:12px}.pager{flex-wrap:wrap;justify-content:center}}@media print{.preview-info,.search-section,.question-actions-top,.pagination-wrapper,.watermark-bg{display:none!important}.watermark-shell{box-shadow:none;border-color:#0000001a}.question-item-card{break-inside:avoid;box-shadow:none;border:1px solid rgba(0,0,0,.1);margin-bottom:12px}}.api-component{background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.06);padding:16px;display:flex;flex-direction:column;gap:12px}.api-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.method-select{width:120px}.url-input{flex:1;min-width:200px}.tab-switch{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}.tab-btn{padding:6px 12px;border-radius:999px;border:1px solid rgba(0,0,0,.12);background:#f5f5f7;cursor:pointer;font-size:12px}.tab-btn.active{background:linear-gradient(135deg,#6fb1fc,#4364f7);color:#fff;border-color:transparent}.tab-panel{background:#fbfbfd;border:1px solid rgba(0,0,0,.05);border-radius:10px;padding:12px}.body-json{display:flex;flex-direction:column;gap:8px}.json-input{min-height:160px}.json-actions{display:flex;gap:8px;align-items:center}.error-message{font-size:12px;color:#dc2626}.json-preview,.html-preview{max-height:300px;overflow-y:auto;background:#111827;color:#f3f4f6;padding:12px;border-radius:8px;font-size:12px}.html-preview{background:#fff;color:#111827;border:1px solid rgba(0,0,0,.08)}.section-divider{height:1px;background:#0000000f;margin:12px 0}.answer-extract{display:flex;flex-direction:column;gap:10px}.radio-group{display:flex;gap:12px}.answer-actions{display:flex;gap:8px}', 
            c.appendChild(e);
        } catch (u) {
            console.error("\u5e94\u7528\u6837\u5f0f\u8868\u65f6\u51fa\u9519:", u);
        }
        o.mount(p);
    }, run = async () => {
        var e;
        (e = document.createElement("iframe")).style.display = "none", document.body.appendChild(e), 
        window.console = e.contentWindow.console;
        (xe === xe.top || [ /\/work\/doHomeWorkNew/i, /selectWorkQuestionYiPiYue/i, /page\/quiz\/stu\/answerQuestion2/i, /page\/active\/stuActiveList/i, /uooconline.com/i, /edu-edu.com/i, /hblearning\/exam\/portal\/exam.jsp/i ].some((e => e.test(location.href))) || Ht.some((e => "hook" !== e.type && ("function" == typeof e.match ? e.match() : e.match)))) && (loadVue(), 
        parseRule(Ht));
    };

    (() => {
        if (hookXHR(), /onlineexamh5new.zhihuishu.com/i.test(get_href())) {
            const e = xe.yxyz;
            xe.yxyz = function(t, n) {
                !xe.yxyzpush && (xe.yxyzpush = []);
                let a = e(t, n);
                return xe.yxyzpush.push({
                    ...t,
                    data: a
                }), a;
            };
        }
        if (/icve.com.cn/i.test(get_href()) || /courshare.cn/i.test(get_href()) || /webtrn.cn/i.test(get_href())) {
            const e = xe.open;
            xe.open = function() {
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
            const e = xe.$.cookie;
            xe.$.cookie = function(t, n, a) {
                return console.log("Cookie\u64cd\u4f5c:", t, n, a), t.startsWith("switchTime") && void 0 !== n ? (n = void 0, 
                e.apply(this, [ t, n, a ])) : e.apply(this, arguments);
            };
        }
    })(), Ht.filter((e => e.match && e.hook)).forEach((e => {
        e.hook();
    })), "complete" === document.readyState ? run() : window.addEventListener("load", run);

})(Vue, DOMPurify, $, CryptoJS);