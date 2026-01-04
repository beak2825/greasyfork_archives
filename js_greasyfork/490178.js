// ==UserScript==
// @name        Figma Image Upload
// @namespace   https://github.com/gideonsenku
// @version     0.3.3
// @description Figma Image Upload图片上传工具
// @encoding    utf-8
// @author      gideonsenku
// @homepage    https://github.com/gideonsenku/figma-image-upload
// @supportURL  https://github.com/gideonsenku/figma-image-upload/issues
// @match       *://www.figma.com/file/*
// @match       http://blog.sodion.net/figma-image-upload/setting.html
// @run-at      document-end
// @icon        https://www.google.com/s2/favicons?domain=figma.com
// @license     MIT; https://github.com/gideonsenku/figma-image-upload/blob/main/LICENSE
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/490178/Figma%20Image%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/490178/Figma%20Image%20Upload.meta.js
// ==/UserScript==
!function() {
    "use strict";
    function noop() {}
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return "function" == typeof thing;
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || a && "object" == typeof a || "function" == typeof a;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(" ");
    }
    function listen(node, event, handler, options) {
        return node.addEventListener(event, handler, options), () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        null == value ? node.removeAttribute(attribute) : node.getAttribute(attribute) !== value && node.setAttribute(attribute, value);
    }
    function set_data(text, data) {
        data = "" + data, text.wholeText !== data && (text.data = data);
    }
    function set_input_value(input, value) {
        input.value = null == value ? "" : value;
    }
    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    const dirty_components = [], binding_callbacks = [], render_callbacks = [], flush_callbacks = [], resolved_promise = Promise.resolve();
    let update_scheduled = !1;
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    const seen_callbacks = new Set;
    let flushidx = 0;
    function flush() {
        const saved_component = current_component;
        do {
            for (;flushidx < dirty_components.length; ) {
                const component = dirty_components[flushidx];
                flushidx++, set_current_component(component), update(component.$$);
            }
            for (set_current_component(null), dirty_components.length = 0, flushidx = 0; binding_callbacks.length; ) binding_callbacks.pop()();
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                seen_callbacks.has(callback) || (seen_callbacks.add(callback), callback());
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        for (;flush_callbacks.length; ) flush_callbacks.pop()();
        update_scheduled = !1, seen_callbacks.clear(), set_current_component(saved_component);
    }
    function update($$) {
        if (null !== $$.fragment) {
            $$.update(), run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [ -1 ], $$.fragment && $$.fragment.p($$.ctx, dirty), $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set;
    function make_dirty(component, i) {
        -1 === component.$$.dirty[0] && (dirty_components.push(component), function schedule_update() {
            update_scheduled || (update_scheduled = !0, resolved_promise.then(flush));
        }(), component.$$.dirty.fill(0)), component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [ -1 ]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            props: props,
            update: noop,
            not_equal: not_equal,
            bound: blank_object(),
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            callbacks: blank_object(),
            dirty: dirty,
            skip_bound: !1,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = !1;
        if ($$.ctx = instance ? instance(component, options.props || {}, ((i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            return $$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value) && (!$$.skip_bound && $$.bound[i] && $$.bound[i](value), 
            ready && make_dirty(component, i)), ret;
        })) : [], $$.update(), ready = !0, run_all($$.before_update), $$.fragment = !!create_fragment && create_fragment($$.ctx), 
        options.target) {
            if (options.hydrate) {
                const nodes = function children(element) {
                    return Array.from(element.childNodes);
                }(options.target);
                $$.fragment && $$.fragment.l(nodes), nodes.forEach(detach);
            } else $$.fragment && $$.fragment.c();
            options.intro && function transition_in(block, local) {
                block && block.i && (outroing.delete(block), block.i(local));
            }(component.$$.fragment), function mount_component(component, target, anchor, customElement) {
                const {fragment: fragment, on_mount: on_mount, on_destroy: on_destroy, after_update: after_update} = component.$$;
                fragment && fragment.m(target, anchor), customElement || add_render_callback((() => {
                    const new_on_destroy = on_mount.map(run).filter(is_function);
                    on_destroy ? on_destroy.push(...new_on_destroy) : run_all(new_on_destroy), component.$$.on_mount = [];
                })), after_update.forEach(add_render_callback);
            }(component, options.target, options.anchor, options.customElement), flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            !function destroy_component(component, detaching) {
                const $$ = component.$$;
                null !== $$.fragment && (run_all($$.on_destroy), $$.fragment && $$.fragment.d(detaching), 
                $$.on_destroy = $$.fragment = null, $$.ctx = []);
            }(this, 1), this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
            return callbacks.push(callback), () => {
                const index = callbacks.indexOf(callback);
                -1 !== index && callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            this.$$set && !function is_empty(obj) {
                return 0 === Object.keys(obj).length;
            }($$props) && (this.$$.skip_bound = !0, this.$$set($$props), this.$$.skip_bound = !1);
        }
    }
    var UseSingleton = function(createInstance, {withKey: withKey = !1, immediate: immediate = !1} = {}) {
        const UNDEFINED_INSTANCE = {};
        let _key, _instance = UNDEFINED_INSTANCE;
        function getSingleton(key) {
            return _instance !== UNDEFINED_INSTANCE && function checkSameKey(key) {
                return !withKey || void 0 === key || key === _key;
            }(key) || (_key = key, _instance = createInstance(_key)), _instance;
        }
        return immediate && getSingleton(), getSingleton;
    };
    function styleInject(css, ref) {
        void 0 === ref && (ref = {});
        var insertAt = ref.insertAt;
        if (css && "undefined" != typeof document) {
            var head = document.head || document.getElementsByTagName("head")[0], style = document.createElement("style");
            style.type = "text/css", "top" === insertAt && head.firstChild ? head.insertBefore(style, head.firstChild) : head.appendChild(style), 
            style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));
        }
    }
    function create_fragment$2(ctx) {
        let div, t, div_class_value;
        return {
            c() {
                div = element("div"), t = text(ctx[2]), attr(div, "class", div_class_value = "toast " + (ctx[1] ? "" : "toast--hide") + " svelte-1hd7ahf");
            },
            m(target, anchor) {
                insert(target, div, anchor), append(div, t), ctx[4](div);
            },
            p(ctx, [dirty]) {
                4 & dirty && set_data(t, ctx[2]), 2 & dirty && div_class_value !== (div_class_value = "toast " + (ctx[1] ? "" : "toast--hide") + " svelte-1hd7ahf") && attr(div, "class", div_class_value);
            },
            i: noop,
            o: noop,
            d(detaching) {
                detaching && detach(div), ctx[4](null);
            }
        };
    }
    function instance$2($$self, $$props, $$invalidate) {
        let toast, content, visiable = !1, closeTimer = null;
        return [ toast, visiable, content, function show({title: title, duration: duration = 1500}) {
            $$invalidate(2, content = title), closeTimer && clearTimeout(closeTimer), $$invalidate(1, visiable = !0), 
            closeTimer = setTimeout((() => {
                $$invalidate(1, visiable = !1), closeTimer = null;
            }), duration);
        }, function div_binding($$value) {
            binding_callbacks[$$value ? "unshift" : "push"]((() => {
                toast = $$value, $$invalidate(0, toast);
            }));
        } ];
    }
    styleInject(".toast.svelte-1hd7ahf{background-color:rgba(0,0,0,.8);border-radius:4px;color:#eee;font-size:16px;left:50%;max-width:200px;padding:12px 24px;position:fixed;top:50%;transform:translate(-50%,-50%);z-index:9999999}.toast--hide.svelte-1hd7ahf{visibility:hidden;z-index:-1}");
    class Toast extends SvelteComponent {
        constructor(options) {
            super(), init(this, options, instance$2, create_fragment$2, safe_not_equal, {
                show: 3
            });
        }
        get show() {
            return this.$$.ctx[3];
        }
    }
    const toast = UseSingleton((() => {
        const toastEl = new Toast({
            target: document.body,
            props: {
                content: ""
            }
        });
        return ({title: title, duration: duration = 1500}) => {
            toastEl.show({
                title: title,
                duration: duration
            });
        };
    }))();
    function create_fragment$1(ctx) {
        let div3, div2, div0, t1, div1, input, t2, button, mounted, dispose;
        return {
            c() {
                div3 = element("div"), div2 = element("div"), div0 = element("div"), div0.textContent = "配置url地址", 
                t1 = space(), div1 = element("div"), input = element("input"), t2 = space(), button = element("button"), 
                button.textContent = "保存", attr(div0, "class", "text-blue-800 font-medium mb-3"), 
                attr(input, "type", "text"), attr(input, "placeholder", "url"), attr(input, "class", "px-3 py-4 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-base border-0 shadow outline-none focus:outline-none w-full"), 
                attr(div1, "class", "mb-3 pt-0"), attr(button, "class", "bg-blue-600 text-white active:bg-blue-600 font-bold uppercase text-base px-8 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"), 
                attr(button, "type", "button");
            },
            m(target, anchor) {
                insert(target, div3, anchor), append(div3, div2), append(div2, div0), append(div2, t1), 
                append(div2, div1), append(div1, input), set_input_value(input, ctx[0]), append(div3, t2), 
                append(div3, button), mounted || (dispose = [ listen(input, "input", ctx[2]), listen(button, "click", ctx[1]) ], 
                mounted = !0);
            },
            p(ctx, [dirty]) {
                1 & dirty && input.value !== ctx[0] && set_input_value(input, ctx[0]);
            },
            i: noop,
            o: noop,
            d(detaching) {
                detaching && detach(div3), mounted = !1, run_all(dispose);
            }
        };
    }
    function instance$1($$self, $$props, $$invalidate) {
        let uploadUrl = GM_getValue("UPLOAD_URL", "");
        return [ uploadUrl, function save() {
            try {
                GM_setValue("UPLOAD_URL", uploadUrl), toast({
                    title: "保存成功"
                });
            } catch (e) {
                toast({
                    title: e.message
                });
            }
        }, function input_input_handler() {
            uploadUrl = this.value, $$invalidate(0, uploadUrl);
        } ];
    }
    class SettingPanel extends SvelteComponent {
        constructor(options) {
            super(), init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
        }
    }
    function create_if_block(ctx) {
        let div7, div6, t5, if_block = ctx[2] && create_if_block_1(ctx);
        return {
            c() {
                div7 = element("div"), div6 = element("div"), div6.innerHTML = '<div class="sk-chase-dot svelte-8l84q3"></div> \n      <div class="sk-chase-dot svelte-8l84q3"></div> \n      <div class="sk-chase-dot svelte-8l84q3"></div> \n      <div class="sk-chase-dot svelte-8l84q3"></div> \n      <div class="sk-chase-dot svelte-8l84q3"></div> \n      <div class="sk-chase-dot svelte-8l84q3"></div>', 
                t5 = space(), if_block && if_block.c(), attr(div6, "class", "sk-chase svelte-8l84q3"), 
                attr(div7, "class", "loading-bg svelte-8l84q3");
            },
            m(target, anchor) {
                insert(target, div7, anchor), append(div7, div6), append(div7, t5), if_block && if_block.m(div7, null), 
                ctx[5](div7);
            },
            p(ctx, dirty) {
                ctx[2] ? if_block ? if_block.p(ctx, dirty) : (if_block = create_if_block_1(ctx), 
                if_block.c(), if_block.m(div7, null)) : if_block && (if_block.d(1), if_block = null);
            },
            d(detaching) {
                detaching && detach(div7), if_block && if_block.d(), ctx[5](null);
            }
        };
    }
    function create_if_block_1(ctx) {
        let div, t;
        return {
            c() {
                div = element("div"), t = text(ctx[2]), attr(div, "class", "loading-content svelte-8l84q3");
            },
            m(target, anchor) {
                insert(target, div, anchor), append(div, t);
            },
            p(ctx, dirty) {
                4 & dirty && set_data(t, ctx[2]);
            },
            d(detaching) {
                detaching && detach(div);
            }
        };
    }
    function create_fragment(ctx) {
        let if_block_anchor, if_block = ctx[1] && create_if_block(ctx);
        return {
            c() {
                if_block && if_block.c(), if_block_anchor = function empty() {
                    return text("");
                }();
            },
            m(target, anchor) {
                if_block && if_block.m(target, anchor), insert(target, if_block_anchor, anchor);
            },
            p(ctx, [dirty]) {
                ctx[1] ? if_block ? if_block.p(ctx, dirty) : (if_block = create_if_block(ctx), if_block.c(), 
                if_block.m(if_block_anchor.parentNode, if_block_anchor)) : if_block && (if_block.d(1), 
                if_block = null);
            },
            i: noop,
            o: noop,
            d(detaching) {
                if_block && if_block.d(detaching), detaching && detach(if_block_anchor);
            }
        };
    }
    function instance($$self, $$props, $$invalidate) {
        let loading, content, visiable = !1, closeTimer = null;
        return [ loading, visiable, content, function show({title: title, duration: duration = 0}) {
            $$invalidate(2, content = title), closeTimer && clearTimeout(closeTimer), $$invalidate(1, visiable = !0), 
            0 != duration && (closeTimer = setTimeout((() => {
                $$invalidate(1, visiable = !1), closeTimer = null;
            }), duration));
        }, function close() {
            closeTimer && clearTimeout(closeTimer), $$invalidate(1, visiable = !1);
        }, function div7_binding($$value) {
            binding_callbacks[$$value ? "unshift" : "push"]((() => {
                loading = $$value, $$invalidate(0, loading);
            }));
        } ];
    }
    styleInject('.loading-bg.svelte-8l84q3{align-items:center;background:rgba(0,0,0,.6);bottom:0;display:flex;flex-direction:column;justify-content:center;left:0;position:fixed;right:0;top:0;z-index:99999}.loading-content.svelte-8l84q3{color:#fff;font-size:16px;margin-top:20px}.sk-chase.svelte-8l84q3{animation:svelte-8l84q3-sk-chase 2.5s linear infinite both;height:40px;width:40px}.sk-chase-dot.svelte-8l84q3{animation:svelte-8l84q3-sk-chase-dot 2s ease-in-out infinite both;height:100%;left:0;position:absolute;top:0;width:100%}.sk-chase-dot.svelte-8l84q3:before{animation:svelte-8l84q3-sk-chase-dot-before 2s ease-in-out infinite both;background-color:#fff;border-radius:100%;content:"";display:block;height:25%;width:25%}.sk-chase-dot.svelte-8l84q3:first-child{animation-delay:-1.1s}.sk-chase-dot.svelte-8l84q3:nth-child(2){animation-delay:-1s}.sk-chase-dot.svelte-8l84q3:nth-child(3){animation-delay:-.9s}.sk-chase-dot.svelte-8l84q3:nth-child(4){animation-delay:-.8s}.sk-chase-dot.svelte-8l84q3:nth-child(5){animation-delay:-.7s}.sk-chase-dot.svelte-8l84q3:nth-child(6){animation-delay:-.6s}.sk-chase-dot.svelte-8l84q3:first-child:before{animation-delay:-1.1s}.sk-chase-dot.svelte-8l84q3:nth-child(2):before{animation-delay:-1s}.sk-chase-dot.svelte-8l84q3:nth-child(3):before{animation-delay:-.9s}.sk-chase-dot.svelte-8l84q3:nth-child(4):before{animation-delay:-.8s}.sk-chase-dot.svelte-8l84q3:nth-child(5):before{animation-delay:-.7s}.sk-chase-dot.svelte-8l84q3:nth-child(6):before{animation-delay:-.6s}@keyframes svelte-8l84q3-sk-chase{to{transform:rotate(1turn)}}@keyframes svelte-8l84q3-sk-chase-dot{80%,to{transform:rotate(1turn)}}@keyframes svelte-8l84q3-sk-chase-dot-before{50%{transform:scale(.4)}0%,to{transform:scale(1)}}');
    class Loading extends SvelteComponent {
        constructor(options) {
            super(), init(this, options, instance, create_fragment, safe_not_equal, {
                show: 3,
                close: 4
            });
        }
        get show() {
            return this.$$.ctx[3];
        }
        get close() {
            return this.$$.ctx[4];
        }
    }
    const loading = UseSingleton((() => {
        const loadingEl = new Loading({
            target: document.body,
            props: {
                content: ""
            }
        });
        return {
            show({title: title, duration: duration = 0}) {
                loadingEl.show({
                    title: title,
                    duration: duration
                });
            },
            close() {
                loadingEl.close();
            }
        };
    }))();
    const figmaImageUpload = () => {
        if (!/^https:\/\/www\.figma.com/.test(window.location.href)) return;
        const divElement = document.createElement("div");
        divElement.className = "button_row--fplButtonRow--nFW30";
        const buttonElement = document.createElement("button");
        buttonElement.className = "button-reset-module--buttonReset--AdW9- button-module--button--f8I-H utilities--bodyMedium--AOpj3 button-module--secondary--deyxA button-module--outlineStyle--eRuj0 button-module--wideSize--JMqnr", 
        buttonElement.setAttribute("data-fpl-component", ""), buttonElement.addEventListener("click", exportAndupload);
        const spanElement = document.createElement("span");
        function insertBase64Btn() {
            const targetNode = document.querySelector("div[data-trackable-name=export_panel] div");
            targetNode ? targetNode.appendChild(divElement) : console.error("Target node not found!");
        }
        spanElement.className = "button-module--buttonText--Q9pu6", spanElement.innerHTML = '<span class="end_truncated_text--truncatedText--ycps2">OSS Upload</span>', 
        buttonElement.appendChild(spanElement), divElement.appendChild(buttonElement), function addExportTabEventListener() {
            const node = document.querySelector("[data-label=export i]") || document.querySelector("[class*=draggable_list--panelTitle]");
            node ? node.addEventListener("click", (function() {
                setTimeout((() => {
                    insertBase64Btn(), function addAddBtnEventListener() {
                        document.querySelectorAll("button[aria-label=Add]")[0]?.addEventListener("click", (function() {
                            setTimeout((() => {
                                insertBase64Btn();
                            }), 100);
                        }));
                    }();
                }), 100);
            })) : setTimeout((() => {
                addExportTabEventListener();
            }), 500);
        }();
    };
    function getConstraintByScale(scale) {
        return "0.5x" === scale ? {
            type: "SCALE",
            value: .5
        } : "0.75x" === scale ? {
            type: "SCALE",
            value: .75
        } : "1x" === scale ? {
            type: "SCALE",
            value: 1
        } : "1.5x" === scale ? {
            type: "SCALE",
            value: 1.5
        } : "2x" === scale ? {
            type: "SCALE",
            value: 2
        } : "3x" === scale ? {
            type: "SCALE",
            value: 3
        } : "4x" === scale ? {
            type: "SCALE",
            value: 4
        } : "512w" === scale ? {
            type: "WIDTH",
            value: 512
        } : "512h" === scale ? {
            type: "HEIGHT",
            value: 512
        } : void 0;
    }
    async function exportAndupload() {
        console.log("exportAndupload clicked");
        const scaleInputs = Array.apply(null, document.querySelectorAll('input[spellcheck="false"][autocomplete="new-password"][class^=raw_components--textInput]'));
        let scales = Array.from(new Set(scaleInputs.map((ele => ele.value))));
        if (scales.length || (figma.notify("未选择导出尺寸, 默认导出3x"), scales = [ "3x" ], await function wait(seconds) {
            return new Promise((resolve => {
                setTimeout(resolve, 100 * seconds);
            }));
        }(3)), scales.length) {
            const {selection: selection} = figma.currentPage;
            if (!selection[0]) return void figma.notify("请选择要处理的节点");
            try {
                loading.show({
                    title: "图片上传中"
                });
                const scale = scales[0], u8Array = await selection[0].exportAsync({
                    format: "PNG",
                    constraint: getConstraintByScale(scale)
                }), blob = new Blob([ u8Array ], {
                    type: "image/png"
                }), data = new FormData;
                data.append("file", blob, (new Date).getTime() + ".png");
                const uploadUrl = GM_getValue("UPLOAD_URL", "");
                if (!uploadUrl) return void window.open("http://blog.sodion.net/figma-image-upload/setting.html");
                !function copyContent(text) {
                    if (void 0 !== navigator.clipboard) navigator.clipboard.writeText(text).then((function() {
                        parent.postMessage({
                            pluginMessage: {
                                type: "success"
                            }
                        }, "*");
                    }), (function(_err) {
                        parent.postMessage({
                            pluginMessage: {
                                type: "fail"
                            }
                        }, "*");
                    })); else {
                        const textarea = window.document.querySelector("#copy-area");
                        textarea.value = text, textarea.focus(), textarea.select(), window.document.execCommand("copy") ? parent.postMessage({
                            pluginMessage: {
                                type: "success"
                            }
                        }, "*") : parent.postMessage({
                            pluginMessage: {
                                type: "fail"
                            }
                        }, "*");
                    }
                }(await new Promise(((resolve, reject) => {
                    GM_xmlhttpRequest({
                        url: uploadUrl,
                        method: "POST",
                        data: data,
                        onload(xhr) {
                            if (200 == +xhr.status) try {
                                const url = JSON.parse(xhr.responseText).url;
                                if (!url) return void reject("服务端没有返回url");
                                resolve(url);
                            } catch (e) {
                                reject(e);
                            } else reject(`请求stauts ${xhr.status}`);
                        },
                        onerror(e) {
                            reject(e);
                        }
                    });
                }))), loading.close(), figma.notify("【图片上传成功】已复制到剪切板");
            } catch (e) {
                console.error(e), loading.close(), figma.notify("【图片上传失败】" + ("string" == typeof e ? e : JSON.stringify(e)));
            }
        }
    }
    /^http:\/\/blog\.sodion\.net\/figma-image-upload\/setting/.test(window.location.href) && (window.onload = () => {
        const mainEl = document.querySelector("main");
        new SettingPanel({
            target: mainEl
        });
    }), figmaImageUpload();
}();
