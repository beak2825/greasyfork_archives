// ==UserScript==
// @name        노벨피아 애드온 테스트 버전
// @description 있으면 좋은 각종 기능 추가
// @namespace   https://greasyfork.org/users/815641
// @version     3.0.0
// @homepage    https://github.com/lpshanley/tampermonkey-svelte#readme
// @author      Soochaehwa
// @match       https://novelpia.com/*
// @connect     github.com
// @run-at      document-start
// @require     https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @require     https://greasyfork.org/scripts/21234-gm-download-polyfill-not-working/code/GM_download%20Polyfill%20!Not%20Working!.js?version=135573
// @grant       GM_addStyle
// @grant       GM_download
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/432611/%EB%85%B8%EB%B2%A8%ED%94%BC%EC%95%84%20%EC%95%A0%EB%93%9C%EC%98%A8%20%ED%85%8C%EC%8A%A4%ED%8A%B8%20%EB%B2%84%EC%A0%84.user.js
// @updateURL https://update.greasyfork.org/scripts/432611/%EB%85%B8%EB%B2%A8%ED%94%BC%EC%95%84%20%EC%95%A0%EB%93%9C%EC%98%A8%20%ED%85%8C%EC%8A%A4%ED%8A%B8%20%EB%B2%84%EC%A0%84.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
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
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const addonVersion = '2.0.0';
    const settingsKey = 'AddonSettings';

    const addonSettings = {
      version: addonVersion,
      viewer: {
        fontsAdd: false,
        indentRemove: false,
        navigationImprove: false,
        themeChange: false,
        voteEffectRemove: false,
        autoBookmark: false,
        emoticonCommentRemove: false,
        IllustDownload: false,
      },
      ui: {
        imageRemove: false,
        navigationBarAdd: false,
        headerMenuRemove: false,
      },
      novel: {
        userTag: false,
        shareButtonRemove: false,
      },
    };

    const defaultSettings = addonSettings;

    const Settings = writable(
      JSON.parse(localStorage.getItem(settingsKey)) ?? defaultSettings,
    );
    Settings.subscribe(val => {
      if (val?.version === addonVersion) {
        localStorage.setItem(settingsKey, JSON.stringify(val));
      }
    });

    const viewerFont = writable(localStorage.viewer_font);
    viewerFont.subscribe(val => {
      localStorage.viewer_font = val;
    });

    var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

    var css$6 = "div.svelte-izredd{width:35px;height:35px;line-height:16px;user-select:none;border-radius:5px;text-align:center;padding:0px;cursor:pointer;margin-right:5px}";
    n(css$6,{});

    /* src\components\FontButton.svelte generated by Svelte v3.38.2 */
    const file$4 = "src\\components\\FontButton.svelte";

    // (38:0) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*fontName*/ ctx[0]);
    			set_style(div, "font-size", /*fontSize*/ ctx[1] + "px");
    			set_style(div, "font-family", /*fontName*/ ctx[0]);
    			set_style(div, "border", "1px solid #ddd");
    			attr_dev(div, "class", "svelte-izredd");
    			add_location(div, file$4, 38, 2, 917);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*handleClick*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*fontName*/ 1) set_data_dev(t, /*fontName*/ ctx[0]);

    			if (dirty & /*fontSize*/ 2) {
    				set_style(div, "font-size", /*fontSize*/ ctx[1] + "px");
    			}

    			if (dirty & /*fontName*/ 1) {
    				set_style(div, "font-family", /*fontName*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(38:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:42) 
    function create_if_block_1(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*fontName*/ ctx[0]);
    			set_style(div, "font-size", /*fontSize*/ ctx[1] + "px");
    			set_style(div, "font-family", /*fontName*/ ctx[0]);
    			set_style(div, "border", "1px solid #333");
    			attr_dev(div, "class", "svelte-izredd");
    			add_location(div, file$4, 31, 2, 759);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*handleClick*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*fontName*/ 1) set_data_dev(t, /*fontName*/ ctx[0]);

    			if (dirty & /*fontSize*/ 2) {
    				set_style(div, "font-size", /*fontSize*/ ctx[1] + "px");
    			}

    			if (dirty & /*fontName*/ 1) {
    				set_style(div, "font-family", /*fontName*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(31:42) ",
    		ctx
    	});

    	return block;
    }

    // (24:0) {#if $viewerFont == fontName}
    function create_if_block$1(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*fontName*/ ctx[0]);
    			set_style(div, "font-size", /*fontSize*/ ctx[1] + "px");
    			set_style(div, "font-family", /*fontName*/ ctx[0]);
    			set_style(div, "border", "1px solid #999");
    			attr_dev(div, "class", "svelte-izredd");
    			add_location(div, file$4, 24, 2, 566);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*handleClick*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*fontName*/ 1) set_data_dev(t, /*fontName*/ ctx[0]);

    			if (dirty & /*fontSize*/ 2) {
    				set_style(div, "font-size", /*fontSize*/ ctx[1] + "px");
    			}

    			if (dirty & /*fontName*/ 1) {
    				set_style(div, "font-family", /*fontName*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(24:0) {#if $viewerFont == fontName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let show_if;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$viewerFont*/ ctx[2] == /*fontName*/ ctx[0]) return create_if_block$1;
    		if (show_if == null) show_if = !!(Cookies.get("DARKMODE") === "1");
    		if (show_if) return create_if_block_1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $viewerFont;
    	validate_store(viewerFont, "viewerFont");
    	component_subscribe($$self, viewerFont, $$value => $$invalidate(2, $viewerFont = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FontButton", slots, []);
    	let { fontName } = $$props;
    	let { fontSize } = $$props;

    	function handleClick() {
    		set_store_value(viewerFont, $viewerFont = fontName, $viewerFont);
    		const fontBtn = document.getElementsByClassName("font_btn");

    		if (Cookies.get("DARKMODE") === "1") {
    			fontBtn.forEach(el => {
    				el.style.border = "1px solid #333";
    			});
    		} else {
    			fontBtn.forEach(el => {
    				el.style.border = "1px solid #ddd";
    			});
    		}
    	}

    	const writable_props = ["fontName", "fontSize"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FontButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("fontName" in $$props) $$invalidate(0, fontName = $$props.fontName);
    		if ("fontSize" in $$props) $$invalidate(1, fontSize = $$props.fontSize);
    	};

    	$$self.$capture_state = () => ({
    		fontName,
    		fontSize,
    		viewerFont,
    		handleClick,
    		$viewerFont
    	});

    	$$self.$inject_state = $$props => {
    		if ("fontName" in $$props) $$invalidate(0, fontName = $$props.fontName);
    		if ("fontSize" in $$props) $$invalidate(1, fontSize = $$props.fontSize);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [fontName, fontSize, $viewerFont, handleClick];
    }

    class FontButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { fontName: 0, fontSize: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FontButton",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*fontName*/ ctx[0] === undefined && !("fontName" in props)) {
    			console.warn("<FontButton> was created without expected prop 'fontName'");
    		}

    		if (/*fontSize*/ ctx[1] === undefined && !("fontSize" in props)) {
    			console.warn("<FontButton> was created without expected prop 'fontSize'");
    		}
    	}

    	get fontName() {
    		throw new Error("<FontButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontName(value) {
    		throw new Error("<FontButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontSize() {
    		throw new Error("<FontButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontSize(value) {
    		throw new Error("<FontButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css$5 = "td.svelte-17e8y4i{text-align:center;font-size:14px;width:70%;display:-webkit-box;padding:5px}@font-face{font-family:'고운바탕';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunBatang-Regular.woff')\r\n      format('woff');font-weight:normal;font-style:normal}@font-face{font-family:'경기천년';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/GyeonggiBatang.woff')\r\n      format('woff');font-weight:normal;font-style:normal}@font-face{font-family:'강원교육';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/GangwonEdu_OTFLightA.woff')\r\n      format('woff');font-weight:normal;font-style:normal}@font-face{font-family:'서울남산';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/SeoulNamsanM.woff')\r\n      format('woff');font-weight:normal;font-style:normal}@font-face{font-family:'서울한강';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/SeoulHangangM.woff')\r\n      format('woff');font-weight:normal;font-style:normal}@font-face{font-family:'리디바탕';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.0/RIDIBatang.woff');font-weight:normal;font-style:normal}@font-face{font-family:'조선명조';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Chosunilbo_myungjo.woff')\r\n      format('woff');font-weight:normal;font-style:normal}@font-face{font-family:'마루부리';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10-21@1.0/MaruBuri-Regular.woff')\r\n      format('woff');font-weight:normal;font-style:normal}@font-face{font-family:'조선굴림';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGu.woff')\r\n      format('woff');font-weight:normal;font-style:normal}@font-face{font-family:'한둥근돋음';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/WONDotum.woff')\r\n      format('woff');font-weight:normal;font-style:normal}";
    n(css$5,{});

    /* src\components\AddFont.svelte generated by Svelte v3.38.2 */
    const file$3 = "src\\components\\AddFont.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].fontName;
    	child_ctx[2] = list[i].fontSize;
    	return child_ctx;
    }

    // (31:2) {#each fonts as { fontName, fontSize }}
    function create_each_block$1(ctx) {
    	let fontbtn;
    	let current;

    	fontbtn = new FontButton({
    			props: {
    				fontName: /*fontName*/ ctx[1],
    				fontSize: /*fontSize*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fontbtn.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fontbtn, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fontbtn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fontbtn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fontbtn, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(31:2) {#each fonts as { fontName, fontSize }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let td;
    	let current;
    	let each_value = /*fonts*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			td = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td, "class", "svelte-17e8y4i");
    			add_location(td, file$3, 29, 0, 456);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*fonts*/ 1) {
    				each_value = /*fonts*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(td, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AddFont", slots, []);

    	let fonts = [
    		{ fontName: "리디바탕", fontSize: "13" },
    		{ fontName: "조선명조", fontSize: "13" },
    		{ fontName: "강원교육", fontSize: "13" },
    		{ fontName: "경기천년", fontSize: "13" },
    		{ fontName: "고운바탕", fontSize: "13" }
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AddFont> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ FontBtn: FontButton, fonts });

    	$$self.$inject_state = $$props => {
    		if ("fonts" in $$props) $$invalidate(0, fonts = $$props.fonts);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [fonts];
    }

    class AddFont extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddFont",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const request = {};

    async function waitForElement(selector, ignoreLoadEvent) {
      if (request[selector]) {
        if (request[selector].load) return request[selector].exist;
        return request[selector].promise;
      }

      const exist = !!document.querySelector(selector);
      if (exist) {
        request[selector] = {
          load: true,
          exist,
          promise: Promise.resolve(exist),
        };
        return exist;
      }

      request[selector] = {
        load: false,
        exist: false,
        promise: new Promise(resolve => {
          const onload = () => {
            observer.disconnect();
            request[selector].load = true;
            request[selector].exist = false;
            resolve(false);
          };
          const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
              observer.disconnect();
              request[selector].load = true;
              request[selector].exist = true;
              if (!ignoreLoadEvent) {
                window.removeEventListener('load', onload);
              }
              resolve(true);
            }
          });
          if (!ignoreLoadEvent) {
            window.addEventListener('load', onload);
          }
          observer.observe(document, {
            childList: true,
            subtree: true,
          });
        }),
      };
      return request[selector].promise;
    }

    // export async function waitForElement(selector) {
    //   return new Promise(function (resolve, reject) {
    //     const element = document.querySelector(selector);

    //     if (element) {
    //       resolve(element);
    //       return;
    //     }

    //     const observer = new MutationObserver(function (mutations) {
    //       mutations.forEach(function (mutation) {
    //         const nodes = Array.from(mutation.addedNodes);
    //         for (const node of nodes) {
    //           if (node.matches && node.matches(selector)) {
    //             observer.disconnect();
    //             resolve(node);
    //             return;
    //           }
    //         }
    //       });
    //     });

    //     observer.observe(document.documentElement, {childList: true, subtree: true});
    //   });
    // }

    var require_context_module_0_0 = {
      name: '뷰어 폰트 종류 추가',
      enable: true,
      url: /(novelpia.com)(\/)(viewer)(\/)[0-9]*/,
      async load() {
        if (await waitForElement('#option_panel_1 > table > tbody > tr:nth-child(1)')) {
          const fontPosition = document.querySelector(
            '#option_panel_1 > table > tbody > tr:nth-child(1)',
          );
          viewerFont.subscribe(val => {
            if (!Number.isInteger(val)) {
              let fontStyle = document.querySelector('#AddonFont');

              if (fontStyle) {
                fontStyle.remove();
              }
              fontStyle = document.createElement('style');
              fontStyle.id = 'AddonFont';
              document.head.appendChild(fontStyle);

              fontStyle.innerHTML = `#novel_box{font-family:${val}!important}`;
            }
          });

          new AddFont({
            target: fontPosition,
          });
        }
        document.addEventListener('DOMContentLoaded', () => {
          const fontBtn = document.getElementsByClassName('font_btn');
          fontBtn.forEach((el, i) => {
            el.addEventListener('click', () => {
              let fontStyle = document.querySelector('#AddonFont');
              viewerFont.set(i);
              if (fontStyle) {
                fontStyle.remove();
              }
            });
          });

          const numRegex = /[0 - 9]/;
          if (!numRegex.test(get_store_value(viewerFont))) {
            const fontBtn = document.getElementsByClassName('font_btn');

            if (Cookies.get('DARKMODE') === '1') {
              fontBtn.forEach(el => {
                el.style.border = '1px solid #333';
              });
            } else {
              fontBtn.forEach(el => {
                el.style.border = '1px solid #ddd';
              });
            }
          }
        });
      },
    };

    var log = inputs => {
      console.log(...constructLogArguments(inputs));
    };

    function formatNum(n) {
      return n > 9 ? n : `0${n}`;
    }

    function formatDate(date) {
      return (
        `${date.getFullYear()}-${formatNum(date.getMonth())}-${formatNum(date.getDate())} ` +
        `${formatNum(date.getHours())}:${formatNum(date.getMinutes())}:${formatNum(
      date.getSeconds(),
    )}`
      );
    }

    function constructLogArguments(args) {
      return ['%c%s:', 'color: coral; font-weight: bold;', formatDate(new Date()), args];
    }

    var require_context_module_0_1 = {
      name: '자동 추천',
      enable: true,
      url: /(novelpia.com)(\/)(viewer)(\/)[0-9]*/,
      async load() {
        try {
          if (await waitForElement('#btn_episode_vote')) {
            const voteBtn = document.getElementById('btn_episode_vote');
            if (voteBtn.src !== 'https://novelpia.com/img/new/viewer/btn_vote_on2.png') {
              voteBtn.click();
            }
          }
        } catch (error) {
          log(error);
        }
      },
    };

    var require_context_module_0_2 = {
      name: '개발자 도구 차단 비활성화',
      enable: false,
      loaded: true,
      url: /(novelpia.com)*/,
      async load() {
        try {
          document.body.innerHTML = document.body.innerHTML.replaceAll(`isOpen`, '');
        } catch (error) {
          log(error);
        }
      },
    };

    // import {waitForElement} from '../core/load';

    var require_context_module_0_3 = {
      name: '더블클릭으로 일러스트 다운',
      enable: true,
      loaded: true,
      url: /(novelpia.com)(\/)(viewer)(\/)[0-9]*/,
      async load() {
        try {
          const img = document.getElementsByClassName('venobox');
          const novelName = document.title.replace('노벨피아 - 웹소설로 꿈꾸는 세상! - ', '');

          img.forEach(el => {
            el.addEventListener('dblclick', () => {
              const imgSrc = el.src;
              let imgName = el.dataset.filename;
              if (imgName === '') {
                imgName = `${novelName}.jpg`;
              }
              GM_download(imgSrc, imgName);
            });
          });
        } catch (error) {
          log(error);
        }
      },
    };

    var css$4 = "@font-face{font-family:'Material Icons';font-style:normal;font-weight:400;src:url(https://fonts.gstatic.com/s/materialicons/v126/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2)\r\n      format('woff2')}.material-icons.svelte-1bgejjo{font-family:'Material Icons';font-weight:normal;font-style:normal;font-size:24px;line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased}.addon-nav-item.svelte-1bgejjo{cursor:pointer;flex-grow:1;text-align:center;font-size:12px;display:flex;flex-direction:column;justify-content:center;flex-basis:25%}.addon-nav-active.svelte-1bgejjo{color:#7632ff}.addon-nav-content.svelte-1bgejjo{display:flex;flex-direction:column}";
    n(css$4,{});

    /* src\components\BottomNavItem.svelte generated by Svelte v3.38.2 */

    const file$2 = "src\\components\\BottomNavItem.svelte";

    // (24:2) {:else}
    function create_else_block(ctx) {
    	let div;
    	let i;
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t0 = text(/*icon*/ ctx[1]);
    			t1 = space();
    			t2 = text(/*name*/ ctx[0]);
    			attr_dev(i, "class", "material-icons svelte-1bgejjo");
    			add_location(i, file$2, 25, 6, 677);
    			attr_dev(div, "class", "addon-nav-content svelte-1bgejjo");
    			add_location(div, file$2, 24, 4, 638);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(i, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icon*/ 2) set_data_dev(t0, /*icon*/ ctx[1]);
    			if (dirty & /*name*/ 1) set_data_dev(t2, /*name*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(24:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:2) {#if urlTest}
    function create_if_block(ctx) {
    	let div;
    	let i;
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t0 = text(/*icon*/ ctx[1]);
    			t1 = space();
    			t2 = text(/*name*/ ctx[0]);
    			attr_dev(i, "class", "material-icons svelte-1bgejjo");
    			add_location(i, file$2, 20, 6, 559);
    			attr_dev(div, "class", "addon-nav-content addon-nav-active svelte-1bgejjo");
    			add_location(div, file$2, 19, 4, 503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(i, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icon*/ 2) set_data_dev(t0, /*icon*/ ctx[1]);
    			if (dirty & /*name*/ 1) set_data_dev(t2, /*name*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(19:2) {#if urlTest}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*urlTest*/ ctx[2]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "addon-nav-item svelte-1bgejjo");
    			add_location(div, file$2, 17, 0, 435);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BottomNavItem", slots, []);
    	let { name } = $$props;
    	let { icon } = $$props;
    	let { href } = $$props;
    	let { urlTest } = $$props;

    	function click() {
    		const navItems = document.querySelectorAll(".addon-nav-content");

    		navItems.forEach(el => {
    			el.classList.remove("addon-nav-active");
    		});

    		this.classList.add("addon-nav-active");
    		document.querySelector(".loads").style.display = "block";
    		window.location.href = href;
    	}

    	const writable_props = ["name", "icon", "href", "urlTest"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BottomNavItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("icon" in $$props) $$invalidate(1, icon = $$props.icon);
    		if ("href" in $$props) $$invalidate(4, href = $$props.href);
    		if ("urlTest" in $$props) $$invalidate(2, urlTest = $$props.urlTest);
    	};

    	$$self.$capture_state = () => ({ name, icon, href, urlTest, click });

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("icon" in $$props) $$invalidate(1, icon = $$props.icon);
    		if ("href" in $$props) $$invalidate(4, href = $$props.href);
    		if ("urlTest" in $$props) $$invalidate(2, urlTest = $$props.urlTest);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, icon, urlTest, click, href];
    }

    class BottomNavItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { name: 0, icon: 1, href: 4, urlTest: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BottomNavItem",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<BottomNavItem> was created without expected prop 'name'");
    		}

    		if (/*icon*/ ctx[1] === undefined && !("icon" in props)) {
    			console.warn("<BottomNavItem> was created without expected prop 'icon'");
    		}

    		if (/*href*/ ctx[4] === undefined && !("href" in props)) {
    			console.warn("<BottomNavItem> was created without expected prop 'href'");
    		}

    		if (/*urlTest*/ ctx[2] === undefined && !("urlTest" in props)) {
    			console.warn("<BottomNavItem> was created without expected prop 'urlTest'");
    		}
    	}

    	get name() {
    		throw new Error("<BottomNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<BottomNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<BottomNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<BottomNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<BottomNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<BottomNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get urlTest() {
    		throw new Error("<BottomNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set urlTest(value) {
    		throw new Error("<BottomNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css$3 = "@media(min-width: 1210px){nav.svelte-1nmq8xg{display:none}}@media screen and (max-width: 1209px){nav.svelte-1nmq8xg{position:fixed;bottom:0;left:0;right:0;z-index:1000;will-change:transform;transform:translateZ(0);display:flex;height:55px;box-shadow:0px 0px 5px #33333333;background-color:#fff}}";
    n(css$3,{});

    /* src\components\BottomNav.svelte generated by Svelte v3.38.2 */
    const file$1 = "src\\components\\BottomNav.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i].name;
    	child_ctx[3] = list[i].icon;
    	child_ctx[4] = list[i].href;
    	child_ctx[5] = list[i].urlTest;
    	return child_ctx;
    }

    // (46:2) {#each tabs as { name, icon, href, urlTest }}
    function create_each_block(ctx) {
    	let navitem;
    	let current;

    	navitem = new BottomNavItem({
    			props: {
    				name: /*name*/ ctx[2],
    				icon: /*icon*/ ctx[3],
    				href: /*href*/ ctx[4],
    				urlTest: /*urlTest*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(46:2) {#each tabs as { name, icon, href, urlTest }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let nav;
    	let current;
    	let each_value = /*tabs*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			nav = element("nav");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(nav, "class", "svelte-1nmq8xg");
    			add_location(nav, file$1, 44, 0, 988);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(nav, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tabs*/ 1) {
    				each_value = /*tabs*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(nav, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const home = "https://novelpia.com/";
    const freestory = "https://novelpia.com/freestory";
    const plus = "https://novelpia.com/plus";
    const top100 = "https://novelpia.com/top100";
    const mybook = "https://novelpia.com/mybook";

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BottomNav", slots, []);
    	const url = window.location.href;

    	let tabs = [
    		{
    			name: "홈",
    			icon: "home",
    			href: "/",
    			urlTest: url === home
    		},
    		{
    			name: "자유연재",
    			icon: "create",
    			href: "/freestory",
    			urlTest: !url.indexOf(freestory)
    		},
    		{
    			name: "플러스",
    			icon: "menu_book",
    			href: "/plus",
    			urlTest: !url.indexOf(plus)
    		},
    		{
    			name: "랭킹",
    			icon: "trending_up",
    			href: "/top100/all/today/view/all/plus/",
    			urlTest: !url.indexOf(top100)
    		},
    		{
    			name: "서재",
    			icon: "book",
    			href: "/mybook",
    			urlTest: !url.indexOf(mybook)
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BottomNav> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		NavItem: BottomNavItem,
    		url,
    		home,
    		freestory,
    		plus,
    		top100,
    		mybook,
    		tabs
    	});

    	$$self.$inject_state = $$props => {
    		if ("tabs" in $$props) $$invalidate(0, tabs = $$props.tabs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tabs];
    }

    class BottomNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BottomNav",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var css$2 = "@media screen and (max-width: 1209px) {\r\n  div.top-menu-margin {\r\n    margin: 50px auto 0px auto !important;\r\n  }\r\n  div.am-header {\r\n    height: 50px !important;\r\n    box-shadow: 0px 0px 5px #33333333;\r\n  }\r\n  div.top-tab-menu{\r\n    display: none;\r\n  }\r\n\r\n  div.contest_menu{\r\n    position: static !important;\r\n    margin-top: 0px !important;\r\n  }\r\n}\r\n\r\n.menu_alarm_m {\r\n  position: static !important;\r\n}\r\n\r\nbody > div > div.am-header.mobile_show > div.d_inv,\r\nbody > div > div.d_inv {\r\n  display: none !important;\r\n}\r\n\r\nbody > div > div.am-header > div:nth-child(1),\r\nbody > div.am-header.mobile_show > div:nth-child(1) {\r\n  top: 10px !important;\r\n}\r\n\r\ndiv.dropdown.dropdown-profile {\r\n  top: 5px !important;\r\n}\r\n\r\ndiv[style^='margin-top:15px;'],\r\ndiv[onclick^=\"location='/event/writer_sum';\"],\r\n.swiper-container,\r\n.comic_bnr,\r\n.story_bnr,\r\n.plus_bg,\r\n.main-slide-wrapper,\r\n.am-pagetitle {\r\n  display: none !important;\r\n}\r\n.s_dark {\r\n  margin-top: 0px !important;\r\n}";
    n(css$2,{});

    var require_context_module_0_4 = {
      name: '레이아웃 수정',
      enable: true,
      url: /(novelpia.com)(\/)(?!viewer)/,
      async load() {
        GM_addStyle(css$2);
        if (await waitForElement('body')) {
          new BottomNav({
            target: document.body,
          });
        }
      },
    };

    //export default app;

    var require_context_module_0_5 = {
      name: '들여쓰기 제거',
      enable: true,
      url: /(novelpia.com)(\/)(viewer)(\/)[0-9]*/,
      async load() {
        try {
          if (await waitForElement('#is_indent')) {
            document.getElementById('is_indent').value = '1';
          }
        } catch (error) {
          log(error);
        }
      },
    };

    var css$1 = ".sns-go {\r\n  display: none !important;\r\n}\r\n";
    n(css$1,{});

    var require_context_module_0_6 = {
      name: '공유 버튼 제거',
      enable: true,
      url: /(novelpia.com)(\/)(novel)(\/)[0-9]*/,
      load() {
        GM_addStyle(css$1);
      },
    };

    var require_context_module_0_7 = {
      name: '추천 효과 제거',
      enable: true,
      url: /(novelpia.com)(\/)(viewer)(\/)[0-9]*/,
      async load() {
        try {
          if (await waitForElement('.like_btn')) {
            const effect = document.querySelector('.like_btn');
            effect.style.display = 'none';
          }
        } catch (error) {
          log(error);
        }
      },
    };

    var css = ".settings.svelte-qtbd3w{margin-right:10px;width:36px;height:36px;background-color:inherit;border:none}.settings.svelte-qtbd3w:hover{cursor:pointer;transform:scale(1.1)}";
    n(css,{});

    /* src\components\SettingButton.svelte generated by Svelte v3.38.2 */

    const file = "src\\components\\SettingButton.svelte";

    function create_fragment(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "테스트";
    			attr_dev(button, "class", "settings svelte-qtbd3w");
    			add_location(button, file, 1, 0, 47);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SettingButton", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SettingButton> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SettingButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SettingButton",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var require_context_module_0_8 = {
      name: '세팅',
      enable: false,
      url: /(novelpia.com)(\/)(?!viewer)/,
      async load() {
        if (await waitForElement('div.card-body > br:last-of-type')) {
          const buttonPosition = document.querySelector('div.card-body > br:last-of-type');
          new SettingButton({
            target: buttonPosition,
          });
        }
      },
    };

    //export default app;

    var require_context_module_0_9 = {
      name: '유저 태그 추가',
      enable: true,
      url: /(novelpia.com)(\/)(novel)(\/)[0-9]*/,
      async load() {
        try {
          const userTag = '#user_tag_add > div > div > div.modal-body.pd-25 > div';
          if (await waitForElement(userTag)) {
            const userTag = document.querySelector(
              '#user_tag_add > div > div > div.modal-body.pd-25 > div',
            );
            if (userTag != null) {
              const userTagClone = userTag.cloneNode(true);
              const userTagAdd = document.querySelector(
                "span[style='color:#2091ab;border: 2px solid #2091ab; border-radius: 20px; padding: 3px 10px; line-height: 20px; user-select: none;cursor:pointer;']",
              );
              userTagAdd.before(userTagClone);

              const mobileUserTagAdd = document.querySelector(
                "span[style='color:#2091ab;user-select: none;cursor:pointer;']",
              );
              const userTagSpan = document.createElement('span');
              userTagSpan.innerHTML = userTagClone.textContent;
              userTagSpan.style.color = '#5032df';
              mobileUserTagAdd.before(userTagSpan);

              const wrapper = document.querySelector("div[style='margin:10px 0px;']");
              wrapper.outerHTML = wrapper.innerHTML;
            }
          }
        } catch (error) {
          log(error);
        }
      },
    };

    /* eslint no-bitwise: ["error", { "allow": ["^"] }] */

    function invertHex(hex) {
      return (Number(`0x1${hex}`) ^ 0xffffff).toString(16).substr(1).toUpperCase();
    }

    var require_context_module_0_10 = {
      name: '뷰어 테마 설정',
      enable: true,
      url: /(novelpia.com)(\/)(viewer)(\/)[0-9]*/,
      async load() {
        try {
          if (await waitForElement('head')) {
            themeChange();
          }
          if (await waitForElement('.pcr-app')) {
            document.querySelector('.pcr-app').addEventListener('click', () => {
              themeChange();
            });
          }
        } catch (error) {
          log(error);
        }

        document.addEventListener('DOMContentLoaded', () => {
          const bgBtn = document.getElementsByClassName('bg_btn');
          bgBtn.forEach((el, i) => {
            el.addEventListener('click', () => {
              themeChange();
            });
          });
        });
      },
    };

    function themeChange() {
      let color = localStorage.viewer_bg;
      if (Cookies.get('DARKMODE') === '1') {
        switch (color) {
          case '1':
            color = '#000';
            break;
          case '2':
            color = '#4e4e4e';
            break;
          case '3':
            color = '#565314';
            break;
          case '4':
            color = '#225816';
            break;
        }
      } else {
        switch (color) {
          case '1':
            color = '#fff';
            break;
          case '2':
            color = '#e3e3e3';
            break;
          case '3':
            color = '#fffddb';
            break;
          case '4':
            color = '#c4ecbb';
            break;
        }
      }

      let commentColor = color;
      if (Cookies.get('DARKMODE') === '1') {
        commentColor = `#${invertHex(color.replace('#', ''))}`;
      }
      let themeStyle = document.querySelector('#AddonTheme');

      if (themeStyle) {
        themeStyle.remove();
      }
      themeStyle = document.createElement('style');
      themeStyle.id = 'AddonTheme';
      document.head.appendChild(themeStyle);

      themeStyle.innerHTML = `#comment_box{background-color:${commentColor}!important}#footer_bar,#header_bar,#theme_box,#viewer_no_drag,.loads{background-color:${color}!important}.loads{filter:opacity(0.9)}`;
    }

    /* eslint-disable camelcase */

    // const module_store = {};
    const runModule = mod => {
      if (mod.load) {
        mod.load();
      }
    };

    const loadedRunModule = mod => {
      if (mod.load) {
        document.addEventListener('DOMContentLoaded', () => {
          mod.load();
        });
      }
    };

    const modules = {
      // lists: () => {
      //   return module_store;
      // },
      load: (...mods) =>
        new Promise(resolve => {
          return Promise.all(
            mods.map(v => {
              return modules.register(v);
            }),
          ).then(() => {
            resolve();
          });
        }),
      register: async mod => {
        const start = performance.now();
        // if (typeof module_store[mod.name] !== 'undefined') {
        //   throw new Error(`${mod.name} is already registered.`);
        // }
        // const enable = await store.get(`${mod.name}.enable`);
        // mod.enable = enable;
        // if (typeof enable === 'undefined' || enable === null) {
        //   store.set(`${mod.name}.enable`, mod.default_enable);
        //   mod.enable = mod.default_enable;
        // }
        // module_store[mod.name] = mod;

        if (!mod.enable) {
          log(`${mod.name} 건너뛰기. 모듈 비활성화.`);
          return;
        }

        if (mod.url && !mod.url.test(window.location.href)) {
          log(`${mod.name} 건너뛰기. URL 일치하지 않음.`);
          return;
        }

        if (mod.loaded) {
          loadedRunModule(mod);
          log(`${mod.name} 지연 로드. ${(performance.now() - start).toFixed(2)}ms.`);
          return;
        }

        runModule(mod);
        log(`${mod.name} 로드 완료. ${(performance.now() - start).toFixed(2)}ms.`);
      },
    };

    (() => {
      const context = 
      (function() {
        var map = {
          './AddFont.js': require_context_module_0_0,
    './AutoVote.js': require_context_module_0_1,
    './disableDevtool.js': require_context_module_0_2,
    './IllustDown.js': require_context_module_0_3,
    './Layout.js': require_context_module_0_4,
    './RemoveIndent.js': require_context_module_0_5,
    './RemoveShare.js': require_context_module_0_6,
    './RemoveVoteEffect.js': require_context_module_0_7,
    './Setting.js': require_context_module_0_8,
    './UserTag.js': require_context_module_0_9,
    './ViwerTheme.js': require_context_module_0_10,

        };
        var req = function req(key) {
          return map[key] || (function() { throw new Error("Cannot find module '" + key + "'.") }());
        };
        req.keys = function() {
          return Object.keys(map);
        };
        return req;
      })()
    ;

      Promise.all(context.keys().map(key => context(key))).then(key => modules.load(...key));
      // .then(async () => {
      //   log('테스트');
      // });

      // RemoveShare.load();
      // UserTag.load();
      // BottomNav.load();
    })();

})();
