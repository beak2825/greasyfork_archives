// ==UserScript==
// @name         低端影视ddrk-m3u8解析带UI版
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  点击视频播放按钮，解析低端影视ddrk.me/ddys.tv视频播放地址为m3u8,不影响用户正常播放，增加了悬浮UI。
// @author       Lonelam
// @match        https://ddrk.me/*
// @match        https://ddys.tv/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/426316/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86ddrk-m3u8%E8%A7%A3%E6%9E%90%E5%B8%A6UI%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/426316/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86ddrk-m3u8%E8%A7%A3%E6%9E%90%E5%B8%A6UI%E7%89%88.meta.js
// ==/UserScript==
// css
GM_addStyle('float-main.svelte-wn6wob.svelte-wn6wob{position:fixed;top:0;left:0;width:300px;z-index:100}float-main.svelte-wn6wob button.svelte-wn6wob{color:black}');
// compiled
(function () {
    'use strict';
// svelte runtime
    function noop() { }
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
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
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
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
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

    /* src/App.svelte generated by Svelte v3.38.2 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (29:2) {:else}
    function create_else_block(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			div.textContent = "暂未捕获到可用m3u8地址，请点击视频播放按钮~";
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (24:2) {#if ddrk_m3u8_list && ddrk_m3u8_list.length}
    function create_if_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*ddrk_m3u8_list*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*downloadItem, ddrk_m3u8_list*/ 1) {
    				each_value = /*ddrk_m3u8_list*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (25:4) {#each ddrk_m3u8_list as item}
    function create_each_block(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*item*/ ctx[1].id + "";
    	let t1;
    	let t2;
    	let button;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			div = element("div");
    			t0 = text("m3u8地址解析:");
    			t1 = text(t1_value);
    			t2 = space();
    			button = element("button");
    			button.textContent = "下载";
    			attr(button, "class", "svelte-wn6wob");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t0);
    			append(div, t1);
    			insert(target, t2, anchor);
    			insert(target, button, anchor);

    			if (!mounted) {
    				dispose = listen(button, "click", function () {
    					if (is_function(downloadItem(/*item*/ ctx[1]))) downloadItem(/*item*/ ctx[1]).apply(this, arguments);
    				});

    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*ddrk_m3u8_list*/ 1 && t1_value !== (t1_value = /*item*/ ctx[1].id + "")) set_data(t1, t1_value);
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (detaching) detach(t2);
    			if (detaching) detach(button);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function create_fragment(ctx) {
    	let float_main;

    	function select_block_type(ctx, dirty) {
    		if (/*ddrk_m3u8_list*/ ctx[0] && /*ddrk_m3u8_list*/ ctx[0].length) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	return {
    		c() {
    			float_main = element("float-main");
    			if_block.c();
    			set_custom_element_data(float_main, "class", "svelte-wn6wob");
    		},
    		m(target, anchor) {
    			insert(target, float_main, anchor);
    			if_block.m(float_main, null);
    		},
    		p(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(float_main, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(float_main);
    			if_block.d();
    		}
    	};
    }

    function download(filename, text) {
    	var element = document.createElement("a");
    	element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    	element.setAttribute("download", filename);
    	element.style.display = "none";
    	document.body.appendChild(element);
    	element.click();
    	document.body.removeChild(element);
    }

    function downloadItem(item) {
    	let file_name = prompt("请输入视频标题，不需要下载m3u8请点取消", item.id);

    	if (file_name) {
    		download(file_name + ".m3u8", item.data);
    	}
    }

    function instance($$self, $$props, $$invalidate) {
    	let { ddrk_m3u8_list = [] } = $$props;

    	$$self.$$set = $$props => {
    		if ("ddrk_m3u8_list" in $$props) $$invalidate(0, ddrk_m3u8_list = $$props.ddrk_m3u8_list);
    	};

    	return [ddrk_m3u8_list];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, { ddrk_m3u8_list: 0 });
    	}
    }
// user script here
    let app;

    let ddrk_m3u8_list = [];
    unsafeWindow.ddrk_m3u8_list = ddrk_m3u8_list;
    window.ddrk_m3u8_list = ddrk_m3u8_list;
    app = new App({
      target: document.body,
      props: {
        ddrk_m3u8_list: ddrk_m3u8_list,
      },
    });
    setInterval(() => {
      if (unsafeWindow._fetch) {
        return;
      }
      console.log("injecting fetch...");
      unsafeWindow._fetch = fetch;
      let _fetch = unsafeWindow._fetch;
      unsafeWindow.fetch = (src) => {
        let p = _fetch(src);
        if (src.includes && src.includes("9543/video?id=")) {
          p.then((response) => {
            const resp = response.clone();
            console.log("fetch intercepted");
            let movie_name =
              /^https?:\/\/ddrk.(me|tv)\/(.*)\//.exec(location.href)[2] ||
              "unknown-movie";
            let ep_name = new URL(location.href).searchParams.get("ep") || "0";

            resp.json().then((data) => {
              let pint = pako.ungzip(data.pin, { to: "string" });
              ddrk_m3u8_list.push({
                id: movie_name + "-" + ep_name,
                data: pint,
              });
              app.$set({
                ddrk_m3u8_list: ddrk_m3u8_list,
              });
            });
          });
        }
        return p;
      };
    }, 1000);

}());
