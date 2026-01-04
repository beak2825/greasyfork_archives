// ==UserScript==
// @name    多语言划词翻译
// @description    支持英、法、日、韩、泰、越、他加禄语和印尼语，部分语言的翻译结果为英语
// @version    2.6.0
// @match    *://*/*
// @allFrames    true
// @grant    GM_xmlhttpRequest
// @run-at    document-end
// @license    MIT
// @namespace KiohPun
// @downloadURL https://update.greasyfork.org/scripts/373345/%E5%A4%9A%E8%AF%AD%E8%A8%80%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/373345/%E5%A4%9A%E8%AF%AD%E8%A8%80%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function noop() { }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function append_styles(target, style_sheet_id, styles) {
        const append_styles_to = get_root_for_style(target);
        if (!append_styles_to.getElementById(style_sheet_id)) {
            const style = element('style');
            style.id = style_sheet_id;
            style.textContent = styles;
            append_stylesheet(append_styles_to, style);
        }
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
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
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
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
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
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
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
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

    const getYoudaoApi = (le, dict) => (`http://dict.youdao.com/jsonapi?le=${le}&dicts=${encodeURIComponent(`{"count": 1, dicts: [["${dict}"]]}`)}&jsonversion=2&q=`);
    const getYoudaoVoice = (audio) => `https://dict.youdao.com/dictvoice?audio=${audio}`;
    function get(url, responseType) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                responseType,
                onload: (res) => resolve(res.response),
                onerror: reject,
            });
        });
    }
    function setPosition(el, rect) {
        const { innerWidth, innerHeight } = window;
        let left = rect.right;
        let top = rect.bottom;
        const { clientWidth, clientHeight } = el;
        if (left + clientWidth > innerWidth) {
            left -= clientWidth;
        }
        if (top + clientHeight > innerHeight) {
            top -= clientHeight;
        }
        if (left < 0) {
            left = 0;
        }
        if (top < 0) {
            top = 0;
        }
        /* eslint-disable no-param-reassign */
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
    }

    /* src/components/ResultEntry.svelte generated by Svelte v3.46.4 */

    function add_css$2(target) {
    	append_styles(target, "svelte-i1rcat", ".info.svelte-i1rcat{display:flex;align-items:baseline;margin:0.5em 0}.word.svelte-i1rcat{margin:0}.phonetic.svelte-i1rcat{margin-left:0.5em;color:#a2a5a6}.sound.svelte-i1rcat{all:unset;align-self:center;width:1.5em;height:1.5em;padding:0.1em;margin-left:auto;color:var(--main-color);cursor:pointer}.sound.svelte-i1rcat:disabled{opacity:0.3}.meanings.svelte-i1rcat{all:unset;display:block}.meaning.svelte-i1rcat{list-style:none;margin:0.4em 0}.meaning-type.svelte-i1rcat{margin-right:0.5em;color:var(--main-color);font-weight:500}.meaning-content.svelte-i1rcat{all:unset;display:block}.en .meaning-type.svelte-i1rcat,.fr .meaning-type.svelte-i1rcat,.th .meaning-type.svelte-i1rcat{float:left}");
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (22:2) {#if entry.word}
    function create_if_block_1$1(ctx) {
    	let div;
    	let h2;
    	let raw_value = /*entry*/ ctx[0].word + "";
    	let t0;
    	let t1;
    	let if_block0 = /*entry*/ ctx[0].phonetic && create_if_block_3(ctx);
    	let if_block1 = /*entry*/ ctx[0].sound && create_if_block_2(ctx);

    	return {
    		c() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr(h2, "class", "word svelte-i1rcat");
    			attr(div, "class", "info svelte-i1rcat");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h2);
    			h2.innerHTML = raw_value;
    			append(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			append(div, t1);
    			if (if_block1) if_block1.m(div, null);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*entry*/ 1 && raw_value !== (raw_value = /*entry*/ ctx[0].word + "")) h2.innerHTML = raw_value;
    			if (/*entry*/ ctx[0].phonetic) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					if_block0.m(div, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*entry*/ ctx[0].sound) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};
    }

    // (25:6) {#if entry.phonetic}
    function create_if_block_3(ctx) {
    	let span;
    	let t0;
    	let html_tag;
    	let raw_value = /*entry*/ ctx[0].phonetic + "";
    	let t1;

    	return {
    		c() {
    			span = element("span");
    			t0 = text("[");
    			html_tag = new HtmlTag();
    			t1 = text("]");
    			html_tag.a = t1;
    			attr(span, "class", "phonetic svelte-i1rcat");
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    			append(span, t0);
    			html_tag.m(raw_value, span);
    			append(span, t1);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*entry*/ 1 && raw_value !== (raw_value = /*entry*/ ctx[0].phonetic + "")) html_tag.p(raw_value);
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    		}
    	};
    }

    // (28:6) {#if entry.sound}
    function create_if_block_2(ctx) {
    	let button;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr(path, "stroke-linecap", "round");
    			attr(path, "stroke-linejoin", "round");
    			attr(path, "d", "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "fill", "none");
    			attr(svg, "viewBox", "0 0 24 24");
    			attr(svg, "stroke", "currentColor");
    			attr(svg, "stroke-width", "2");
    			attr(button, "class", "sound svelte-i1rcat");
    			attr(button, "aria-label", "播放");
    			button.disabled = /*isPlaying*/ ctx[1];
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    			append(button, svg);
    			append(svg, path);

    			if (!mounted) {
    				dispose = listen(button, "click", /*play*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*isPlaying*/ 2) {
    				button.disabled = /*isPlaying*/ ctx[1];
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (46:8) {#if meaning.type}
    function create_if_block$2(ctx) {
    	let div;
    	let t_value = /*meaning*/ ctx[4].type + "";
    	let t;

    	return {
    		c() {
    			div = element("div");
    			t = text(t_value);
    			attr(div, "class", "meaning-type svelte-i1rcat");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*entry*/ 1 && t_value !== (t_value = /*meaning*/ ctx[4].type + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (50:10) {#each meaning.items as item}
    function create_each_block_1$1(ctx) {
    	let li;
    	let raw_value = /*item*/ ctx[7] + "";

    	return {
    		c() {
    			li = element("li");
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			li.innerHTML = raw_value;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*entry*/ 1 && raw_value !== (raw_value = /*item*/ ctx[7] + "")) li.innerHTML = raw_value;		},
    		d(detaching) {
    			if (detaching) detach(li);
    		}
    	};
    }

    // (44:4) {#each entry.meanings as meaning}
    function create_each_block$2(ctx) {
    	let li;
    	let t0;
    	let ol;
    	let t1;
    	let if_block = /*meaning*/ ctx[4].type && create_if_block$2(ctx);
    	let each_value_1 = /*meaning*/ ctx[4].items;
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	return {
    		c() {
    			li = element("li");
    			if (if_block) if_block.c();
    			t0 = space();
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			attr(ol, "class", "meaning-content svelte-i1rcat");
    			attr(li, "class", "meaning svelte-i1rcat");
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			if (if_block) if_block.m(li, null);
    			append(li, t0);
    			append(li, ol);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			append(li, t1);
    		},
    		p(ctx, dirty) {
    			if (/*meaning*/ ctx[4].type) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(li, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*entry*/ 1) {
    				each_value_1 = /*meaning*/ ctx[4].items;
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ol, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	let div;
    	let t;
    	let ul;
    	let if_block = /*entry*/ ctx[0].word && create_if_block_1$1(ctx);
    	let each_value = /*entry*/ ctx[0].meanings;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	return {
    		c() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr(ul, "class", "meanings svelte-i1rcat");
    			attr(div, "class", "entry");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append(div, t);
    			append(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p(ctx, [dirty]) {
    			if (/*entry*/ ctx[0].word) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*entry*/ 1) {
    				each_value = /*entry*/ ctx[0].meanings;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { entry } = $$props;
    	let isPlaying = false;
    	const audio = new Audio();

    	audio.addEventListener('ended', () => {
    		$$invalidate(1, isPlaying = false);
    	});

    	async function play() {
    		$$invalidate(1, isPlaying = true);

    		if (audio.src) {
    			audio.play();
    			return;
    		}

    		const res = await get(entry.sound, 'blob');
    		const blob = res.slice(0, res.size, 'audio/mpeg');
    		audio.src = URL.createObjectURL(blob);
    		audio.play();
    	}

    	$$self.$$set = $$props => {
    		if ('entry' in $$props) $$invalidate(0, entry = $$props.entry);
    	};

    	return [entry, isPlaying, play];
    }

    class ResultEntry extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { entry: 0 }, add_css$2);
    	}
    }

    /* src/components/LangSection.svelte generated by Svelte v3.46.4 */

    function add_css$1(target) {
    	append_styles(target, "svelte-u1xzce", ".content.svelte-u1xzce.svelte-u1xzce{flex:auto;padding:0 1em;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-gutter:stable;background:linear-gradient(#fff 33%, rgba(255,255,255, 0)),\n    linear-gradient(rgba(255,255,255, 0), #fff 66%) 0 100%,\n    radial-gradient(farthest-side at 50% 0, rgba(200,200,200, 0.5), rgba(0,0,0,0)),\n    radial-gradient(farthest-side at 50% 100%, rgba(200,200,200, 0.5), rgba(0,0,0,0)) 0 100%;background-color:#fff;background-repeat:no-repeat;background-attachment:local, local, scroll, scroll;background-size:100% 12px, 100% 12px, 100% 4px, 100% 4px}.content.svelte-u1xzce a.svelte-u1xzce{color:var(--main-color)}.content.svelte-u1xzce.svelte-u1xzce:has(> .tip, > .loading){display:flex;justify-content:center;align-items:center}.tip.svelte-u1xzce.svelte-u1xzce{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:1em;width:100%;color:#666}.tip.svelte-u1xzce p.svelte-u1xzce{margin:0}.alternatives.svelte-u1xzce.svelte-u1xzce{display:flex;gap:0.4em}.alternatives.svelte-u1xzce a.svelte-u1xzce{padding:0.5em;border-radius:3px;background-color:#eee}.alternatives.svelte-u1xzce img.svelte-u1xzce{display:block}.loading.svelte-u1xzce.svelte-u1xzce{box-sizing:border-box;display:block;margin:0 auto;height:4em;fill:var(--main-color);opacity:0.75}");
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (41:2) {:catch}
    function create_catch_block(ctx) {
    	let div;
    	let p0;
    	let t2;
    	let p1;
    	let t3;

    	let each_value_1 = /*lang*/ ctx[0].alternatives.concat([
    		{
    			name: '维基词典',
    			url: 'https://zh.wiktionary.org/wiki/',
    			icon: 'data:image/x-icon;base64,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'
    		},
    		{
    			name: 'Wiktionary',
    			url: 'https://en.wiktionary.org/wiki/',
    			icon: 'data:image/x-icon;base64,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'
    		}
    	]);

    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block = /*lang*/ ctx[0].type === 'en' && create_if_block$1();

    	return {
    		c() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = `${'查无结果'}，点击右上箭头，或试试这些词典:`;
    			t2 = space();
    			p1 = element("p");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			if (if_block) if_block.c();
    			attr(p0, "class", "svelte-u1xzce");
    			attr(p1, "class", "alternatives svelte-u1xzce");
    			attr(div, "class", "tip svelte-u1xzce");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, p0);
    			append(div, t2);
    			append(div, p1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(p1, null);
    			}

    			append(div, t3);
    			if (if_block) if_block.m(div, null);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*lang, text*/ 3) {
    				each_value_1 = /*lang*/ ctx[0].alternatives.concat([
    					{
    						name: '维基词典',
    						url: 'https://zh.wiktionary.org/wiki/',
    						icon: 'data:image/x-icon;base64,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'
    					},
    					{
    						name: 'Wiktionary',
    						url: 'https://en.wiktionary.org/wiki/',
    						icon: 'data:image/x-icon;base64,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'
    					}
    				]);

    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(p1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*lang*/ ctx[0].type === 'en') {
    				if (if_block) ; else {
    					if_block = create_if_block$1();
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};
    }

    // (45:8) {#each lang.alternatives.concat([           {             name: '维基词典',             url: 'https://zh.wiktionary.org/wiki/',             icon: 'data:image/x-icon;base64,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',           },           {             name: 'Wiktionary',             url: 'https://en.wiktionary.org/wiki/',             icon: 'data:image/x-icon;base64,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',           },         ]) as item }
    function create_each_block_1(ctx) {
    	let a;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t;
    	let a_href_value;
    	let a_title_value;

    	return {
    		c() {
    			a = element("a");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[6].icon)) attr(img, "src", img_src_value);
    			attr(img, "alt", img_alt_value = /*item*/ ctx[6].name);
    			attr(img, "width", "20");
    			attr(img, "height", "20");
    			attr(img, "class", "svelte-u1xzce");
    			attr(a, "href", a_href_value = /*item*/ ctx[6].url + /*text*/ ctx[1]);
    			attr(a, "target", "_blank");
    			attr(a, "title", a_title_value = "去" + /*item*/ ctx[6].name + "查询“" + /*text*/ ctx[1] + "”");
    			attr(a, "class", "svelte-u1xzce");
    		},
    		m(target, anchor) {
    			insert(target, a, anchor);
    			append(a, img);
    			append(a, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*lang*/ 1 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[6].icon)) {
    				attr(img, "src", img_src_value);
    			}

    			if (dirty & /*lang*/ 1 && img_alt_value !== (img_alt_value = /*item*/ ctx[6].name)) {
    				attr(img, "alt", img_alt_value);
    			}

    			if (dirty & /*lang, text*/ 3 && a_href_value !== (a_href_value = /*item*/ ctx[6].url + /*text*/ ctx[1])) {
    				attr(a, "href", a_href_value);
    			}

    			if (dirty & /*lang, text*/ 3 && a_title_value !== (a_title_value = "去" + /*item*/ ctx[6].name + "查询“" + /*text*/ ctx[1] + "”")) {
    				attr(a, "title", a_title_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(a);
    		}
    	};
    }

    // (62:6) {#if lang.type === 'en'}
    function create_if_block$1(ctx) {
    	let p;

    	return {
    		c() {
    			p = element("p");
    			p.textContent = "(所查若非英语，请手动切换语言)";
    			attr(p, "class", "svelte-u1xzce");
    		},
    		m(target, anchor) {
    			insert(target, p, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(p);
    		}
    	};
    }

    // (37:2) {:then results}
    function create_then_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*results*/ ctx[2];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

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
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*lang, text*/ 3) {
    				each_value = /*results*/ ctx[2];
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
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (38:4) {#each results as entry}
    function create_each_block$1(ctx) {
    	let resultentry;
    	let current;
    	resultentry = new ResultEntry({ props: { entry: /*entry*/ ctx[3] } });

    	return {
    		c() {
    			create_component(resultentry.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(resultentry, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const resultentry_changes = {};
    			if (dirty & /*lang, text*/ 3) resultentry_changes.entry = /*entry*/ ctx[3];
    			resultentry.$set(resultentry_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(resultentry.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(resultentry.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(resultentry, detaching);
    		}
    	};
    }

    // (7:29)      <svg aria-hidden="true" class="loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 100">       <circle cx="6" cy="50" r="6">         <animateTransform             attributeName="transform"             dur="1s"             type="translate"             values="0 15 ; 0 -15; 0 15"             repeatCount="indefinite"             begin="0.1"/>       </circle>       <circle cx="30" cy="50" r="6">         <animateTransform             attributeName="transform"             dur="1s"             type="translate"             values="0 10 ; 0 -10; 0 10"             repeatCount="indefinite"             begin="0.2"/>       </circle>       <circle cx="54" cy="50" r="6">         <animateTransform             attributeName="transform"             dur="1s"             type="translate"             values="0 5 ; 0 -5; 0 5"             repeatCount="indefinite"             begin="0.3"/>       </circle>     </svg>   {:then results}
    function create_pending_block(ctx) {
    	let svg;
    	let circle0;
    	let animateTransform0;
    	let circle1;
    	let animateTransform1;
    	let circle2;
    	let animateTransform2;

    	return {
    		c() {
    			svg = svg_element("svg");
    			circle0 = svg_element("circle");
    			animateTransform0 = svg_element("animateTransform");
    			circle1 = svg_element("circle");
    			animateTransform1 = svg_element("animateTransform");
    			circle2 = svg_element("circle");
    			animateTransform2 = svg_element("animateTransform");
    			attr(animateTransform0, "attributeName", "transform");
    			attr(animateTransform0, "dur", "1s");
    			attr(animateTransform0, "type", "translate");
    			attr(animateTransform0, "values", "0 15 ; 0 -15; 0 15");
    			attr(animateTransform0, "repeatCount", "indefinite");
    			attr(animateTransform0, "begin", "0.1");
    			attr(circle0, "cx", "6");
    			attr(circle0, "cy", "50");
    			attr(circle0, "r", "6");
    			attr(animateTransform1, "attributeName", "transform");
    			attr(animateTransform1, "dur", "1s");
    			attr(animateTransform1, "type", "translate");
    			attr(animateTransform1, "values", "0 10 ; 0 -10; 0 10");
    			attr(animateTransform1, "repeatCount", "indefinite");
    			attr(animateTransform1, "begin", "0.2");
    			attr(circle1, "cx", "30");
    			attr(circle1, "cy", "50");
    			attr(circle1, "r", "6");
    			attr(animateTransform2, "attributeName", "transform");
    			attr(animateTransform2, "dur", "1s");
    			attr(animateTransform2, "type", "translate");
    			attr(animateTransform2, "values", "0 5 ; 0 -5; 0 5");
    			attr(animateTransform2, "repeatCount", "indefinite");
    			attr(animateTransform2, "begin", "0.3");
    			attr(circle2, "cx", "54");
    			attr(circle2, "cy", "50");
    			attr(circle2, "r", "6");
    			attr(svg, "aria-hidden", "true");
    			attr(svg, "class", "loading svelte-u1xzce");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "viewBox", "0 0 60 100");
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, circle0);
    			append(circle0, animateTransform0);
    			append(svg, circle1);
    			append(circle1, animateTransform1);
    			append(svg, circle2);
    			append(circle2, animateTransform2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let div;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 2,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*lang*/ ctx[0].request(/*text*/ ctx[1]), info);

    	return {
    		c() {
    			div = element("div");
    			info.block.c();
    			attr(div, "class", "content svelte-u1xzce");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = null;
    			current = true;
    		},
    		p(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*lang, text*/ 3 && promise !== (promise = /*lang*/ ctx[0].request(/*text*/ ctx[1])) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { lang } = $$props;
    	let { text } = $$props;

    	$$self.$$set = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	return [lang, text];
    }

    class LangSection extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { lang: 0, text: 1 }, add_css$1);
    	}
    }

    const langs = [
        {
            type: 'en',
            name: '英语',
            api: getYoudaoApi('eng', 'ec'),
            url: 'https://dict.cn/',
            alternatives: [
                { name: '金山词霸', url: 'https://www.iciba.com/word?w=', icon: 'data:image/x-icon;base64,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///07tf/69ee//n9/P/8////792k/+KlAv/mqAH/46gE/+SoAv/mqQD/5qgA/+aoAP/mqAD/5aoA/+WqAP/iqgP/8qsA/02fqf8AmP//Bqnw/wLY/f8A2P//Atn//wDV/v+J6PL////6//3////8+vT/8uGs/+7XkP/x5Lj//Pv3/////////v3//v///+7cof/lqAT/5akB/+WrAv/lqgD/5aoA/+WqAP/lqgD/5aoA/+WqAP/lqgD/5KoA/+KqA//xqwD/Tp+p/wCY//8GqfD/Atj9/wLY//8A1v7/V+H7/////P/9////8uKy/+KyH//jpgD/4qQB/+KnAf/lty7/8+jE///////9////5rg9/+SmAP/lrAP/5KoA/+WqAP/lqgD/5aoA/+WqAP/lqgD/5aoA/+OrAP/jqwD/4asD//CsAP9OoKn/AJj//wap8P8C2P3/ANj//wTW/P/U9fj///////Dmuf/ipwT/5KkA/+SsA//krQX/5K0D/+OnAP/jrBP/8+/W///////w4rH/4agA/+SsAv/jqwH/46sA/+OrAP/jqwD/46sA/+OrAP/jqwD/46wB/+OsAf/grAP/764A/02hqf8AmP//Bqnw/wXZ/f8A1v//QN/7/////f/6/f7/47kz/+KpAP/krgX/46wB/+OsAf/jrAH/5K8G/+GnAP/ox17///////v68//mtCT/46oA/+OtAv/jrAH/46wB/+OsAf/jrAH/46wB/+OsAf/irQD/4q0A/9+tA//wrwD/T6Co/wCY//8GqfD/Btn9/wDV//9m5Pr///////Tz4f/jsAv/4q0A/+KuAf/irQD/4q0A/+KtAP/jrgL/4asA/+e5LP///f3//////+m+O//hqQD/464D/+KtAP/irQD/4q0A/+KtAP/irQD/4q0A/+KuAP/irgD/364D//CvAP9Poan/AJj//wap8P8G2f3/ANX//2bj+///////9fHa/+SwB//irgD/4q8B/+KuAP/irgD/4q4A/+OvAv/hrAD/5rkl///8+P//////6MFC/+GqAP/irwP/4q4A/+KuAP/irgD/4q4A/+KuAP/irgD/4a8A/+GvAP/erwP/7rEA/0yiqf8AmP//Bqnw/wXZ/f8A1v//V+H6///////2+/L/4rUc/+GuAP/hsAL/4a8A/+GvAP/hrwD/4bAE/9+sAP/mwUT///////7////lvTf/4KwA/+GwAv/hrwD/4a8A/+GvAP/hrwD/4a8A/+GvAP/isAD/4rAA/9+wA//wsQD/UqKo/wCY//8HqvD/BNj9/wDY//8V2Pv/6fj4///////r1H//4KgA/+OyBf/jsQT/47ED/+OxBP/jsQP/3qkA/+/hq///////9vLY/+KyCv/isAD/4rAB/+KwAP/isAD/4rAA/+KwAP/isAD/4rAA/+KxAf/isQH/37AD/++yAP9JoKv/AJX//wWm7/8C2P3/BNn//wDV/f+M6vn////+//n8+v/myFz/3qoA/+CsAv/frQD/4KwB/9+rAP/p0Hb//f7+///////q0HD/4KsA/+KyBP/isAH/4rEB/+KxAf/isQH/4rEB/+KxAf/isQH/4rIA/+KyAf/hsgP/6K8A/5bAhf9r6f//Xtz1/xDY+v8A1///ANj//w/X/P/K9fr///////z+/P/v4qn/5shU/+XDPP/nylj/8ui6///+/v//////8OSy/+CvAv/isgH/4rIB/+KyAf/isgD/4rIA/+KyAP/isgD/4rIA/+KyAP/isgD/4rIA/+KyAP/isgH/6rMA/73Vef+T+/3/dvH8/xrb+f8A1v3/ANn//0HTzv/56rv//f///////v///////v////7////+//7//v////Hiqf/isgv/4rEA/+KyAf/isgD/4rIA/+KyAP/isgD/4rIA/+KyAP/isgD/4rIA/+GzAf/hswH/4bMB/+GzAf/gsgP/56wA/8bESv+V8+z/gff//y7e9f8A1///Ns68/+SxAP/pz2n/9ezE//z47P/8+O//+fbo//Touf/nyVn/368A/+KyAv/hswL/4bIA/+GzAf/hswH/4bMB/+GzAf/hswH/4bMB/+GzAf/hswH/4bQA/+G0AP/htAD/4bQA/+G0Af/ftQT/57AA/9W7Jf+d6cn/ivn//yzo//8v0sb/5rQA/96vAf/gsgP/5LkS/+S7Gv/iuBD/4LEC/9+vAP/htAL/4bQB/+G0AP/htAD/4bQA/+G0AP/htAD/4bQA/+G0AP/htAD/4bQA/+G0AP/ftAH/37QB/9+0Af/ftAH/37QB/9+0Af/etQT/47EA/96zDf+x1on/peW4/5HOg//esQD/4LYF/9+0Av/fswD/37IA/9+zAP/gtAP/4LUE/9+0Af/ftAH/37QB/9+0Af/ftAH/37QB/9+0Af/ftAH/37QB/9+0Af/ftAH/37QB/9+0Af/ftAH/37QB/9+0Af/ftAH/37QB/9+0Af/etQP/4LQC/+OwAP/jsQD/6rMB/+C0Av/ftAH/37UB/9+1Av/ftQL/37UC/9+1Af/ftAH/37QB/9+0Af/ftAH/37QB/9+0Af/ftAH/37QB/9+0Af/ftAH/37QB/9+0Af/ftAH/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtgH/37YD/9+2A//etgL/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/+C1AP/gtQD/4LUA/962AP/etgD/3rYA/962AP/etgD/3rYA/962AP/etgD/3rYA/962AP/etgD/3rYA/962AP/etgD/3rYA/962AP/etgD/3rYA/962AP/etgD/3rYA/962AP/etgD/3rYA/962AP/etgD/3rYA/962AP/etgD/3rYA/962AP/etgD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' },
                { name: 'Urban Dictionary', url: 'https://www.urbandictionary.com/define.php?term=', icon: 'data:image/png;base64,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' },
            ],
            is(text) {
                return /^(\p{sc=Latin}|-|\s)+$/u.test(text);
            },
            async request(text) {
                const res = await get(this.api + text);
                const { ec } = JSON.parse(res);
                if (!ec)
                    throw new Error('查无结果');
                return ec.word.map((word) => ({
                    word: word['return-phrase'].l.i,
                    phonetic: word.ukphone,
                    sound: word.ukspeech && getYoudaoVoice(word.ukspeech),
                    meanings: word.trs.map((tr) => {
                        let [type, items] = tr.tr[0].l.i[0].split('.');
                        if (!items) {
                            items = type;
                            type = '';
                        }
                        return {
                            type: type.trim(),
                            items: [items.trim()],
                        };
                    }),
                }));
            },
        },
        {
            type: 'fr',
            name: '法语',
            api: getYoudaoApi('fr', 'fc'),
            url: 'https://www.frdic.com/dicts/fr/',
            alternatives: [],
            is(text) {
                return /^(\p{sc=Latin}|-|\s)+$/u.test(text);
            },
            async request(text) {
                const res = await get(this.api + text);
                const { fc } = JSON.parse(res);
                if (!fc)
                    throw new Error('查无结果');
                return fc.word.map((word) => ({
                    word: word['return-phrase'].l.i,
                    phonetic: word.phone.replace(/\s/g, ''),
                    sound: word.speech && getYoudaoVoice(word.speech),
                    meanings: word.trs.map((tr) => ({
                        type: tr.pos,
                        items: tr.tr[0].l.i,
                    })),
                }));
            },
        },
        {
            type: 'ja',
            name: '日语',
            api: getYoudaoApi('ja', 'newjc'),
            url: 'http://dict.asia/jc/',
            alternatives: [
                { name: '沪江小D', url: 'https://dict.hjenglish.com/jp/jc/', icon: 'data:image/png;base64,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' },
                { name: 'JapanDict', url: 'https://www.japandict.com/?s=', icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAhUExURcsiIv///wAAAOGAgM8yMvff3+2xseaVldNFRfLMzNtnZ6ZgghMAAABtSURBVDjL5dBbDsAgCERRpyCo+19wP9pUY4RZQO8vJ/goF6lc5ZTgLQLOgBGgnYBWCRggwAiYJwTg+4UAzDcEYFlwBMsNjkANOXDkQJCDbb4DdaSgGTKgUpEAlQ6EQIdXIABD3ILpA5D2H0C6ATXuA+6Kb9pZAAAAAElFTkSuQmCC' },
            ],
            is(text) {
                return /^(\p{sc=Han}|\p{sc=Hira}|\p{scx=Kana})+$/u.test(text);
            },
            async request(text) {
                const res = await get(this.api + text);
                const { newjc } = JSON.parse(res);
                if (!newjc)
                    throw new Error('查无结果');
                const { word: data } = newjc;
                const { mPhonicD, homonymD = [] } = data;
                const words = mPhonicD || [data];
                words.push(...homonymD.filter((part) => part.head.pjm));
                return words.map((word) => ({
                    word: word.head.hw,
                    phonetic: `${word.head.pjm} ${word.head.tone || ''}`,
                    sound: getYoudaoVoice(`${word.head.hw}&le=jap`),
                    meanings: word.sense.map((sensePart) => ({
                        type: sensePart.cx,
                        items: sensePart.phrList.map(({ jmsy }) => jmsy),
                    })),
                }));
            },
        },
        {
            type: 'kr',
            name: '韩语',
            api: 'https://ac-dict.naver.com/kozh/ac?st=11&r_lt=11&q=',
            url: 'https://korean.dict.naver.com/kozhdict/#/search?query=',
            alternatives: [],
            is(text) {
                return /^\p{sc=Hangul}+$/u.test(text);
            },
            async request(text) {
                const res = await get(this.api + text);
                const jsonResult = JSON.parse(res);
                const { query: [word], items } = jsonResult;
                if (!jsonResult.items[0].length)
                    throw new Error('查无结果');
                return [{
                        word,
                        meanings: [{
                                items: items.flat().map((item) => `[${item[0]}] ${item[3]}`),
                            }],
                    }];
            },
        },
        {
            type: 'th',
            name: '泰语',
            api: 'https://api.thai2english.com/translations?q=',
            url: 'https://www.thai2english.com/search?q=',
            alternatives: [],
            is(text) {
                return /^(\p{sc=Thai}|\s)+$/u.test(text);
            },
            async request(text) {
                const res = await get(this.api + text);
                const [{ wordObjects }] = JSON.parse(res);
                return wordObjects.map((item) => ({
                    word: item.word,
                    phonetic: item.phonetic,
                    meanings: [{
                            items: item.meanings.map(({ meaning }) => meaning),
                        }],
                }));
            },
        },
        {
            type: 'vt',
            name: '越南语',
            api: 'https://vtudien.com/viet-trung/dictionary/nghia-cua-tu-',
            url: 'https://vtudien.com/viet-trung/dictionary/nghia-cua-tu-',
            alternatives: [],
            is(text) {
                return /^(\p{sc=Latin}|-|\s)+$/u.test(text);
            },
            async request(text) {
                const res = await get(this.api + text);
                const doc = new DOMParser().parseFromString(res, 'text/html');
                const div = doc.getElementById('idnghia');
                const word = div?.querySelector('h2')?.textContent?.trim();
                if (!word)
                    throw new Error('查无结果');
                const tds = div?.querySelectorAll('td[colspan="2"]') || [];
                const items = Array.from(tds).map((td) => td.textContent);
                return [{
                        word,
                        sound: `https://vtudien.com/doc/viet/${word}.mp3`,
                        meanings: [{
                                items,
                            }],
                    }];
            },
        },
        {
            type: 'tl',
            name: '他加禄语（菲律宾语）',
            api: 'https://www.tagalog.com/ajax/reference_guide_search_results.php?json=1&num_results=5&keyword=',
            url: 'https://www.tagalog.com/dictionary/#',
            alternatives: [],
            is(text) {
                return /^(\p{sc=Latin}|-|\s)+$/u.test(text);
            },
            async request(text) {
                const res = await get(this.api + text);
                const entries = JSON.parse(res);
                if (!entries.length)
                    throw new Error('查无结果');
                return entries.map((entry) => {
                    const { content, english, has_conjugations: hasConjugations, conjugations, } = entry;
                    const meanings = english.split('[').slice(1)
                        .map((segment) => segment.split(']'))
                        .map(([type, meaning]) => ({
                        type,
                        items: [
                            ...(type === 'verb' && hasConjugations === 1 ? [`( ${conjugations} )`] : []),
                            meaning.trim(),
                        ],
                    }));
                    return {
                        word: content.replaceAll('***', '<u>').replaceAll('^^^', '</u>'),
                        meanings,
                    };
                });
            },
        },
        {
            type: 'in',
            name: '印尼语（马来语）',
            api: 'https://www.ekamus.info/index.php/term/%E9%A9%AC%E6%9D%A5%E6%96%87-%E5%8D%8E%E6%96%87%E5%AD%97%E5%85%B8,',
            url: 'https://www.ekamus.info/index.php/term/%E9%A9%AC%E6%9D%A5%E6%96%87-%E5%8D%8E%E6%96%87%E5%AD%97%E5%85%B8,',
            alternatives: [],
            is(text) {
                return /^(\p{sc=Latin}|-|\s)+$/u.test(text);
            },
            async request(text) {
                const res = await get(this.api + text);
                const domparser = new DOMParser();
                const dom = domparser.parseFromString(res, 'text/html');
                const card = dom.querySelector('.row > .col-xs-12 .card');
                const cardHeader = card.querySelector('.card-header');
                const cardDefn = card.querySelector('.defn');
                const cardDefnChildNodes = Array.from(cardDefn.childNodes);
                const meanings = [];
                const mainMeaning = cardDefnChildNodes
                    .filter((childNode) => childNode.nodeName === '#text')
                    .map((childNode) => childNode.textContent || '');
                meanings.push({ items: mainMeaning });
                const otherMeanings = cardDefnChildNodes
                    .filter((childNode) => childNode.nodeName === 'P')
                    .map((paragrahpNode) => {
                    const meaning = { type: '', items: [] };
                    paragrahpNode.childNodes.forEach((childNode) => {
                        if (childNode.nodeName === 'STRONG') {
                            meaning.type = childNode.textContent || '';
                        }
                        if (childNode.nodeName === '#text') {
                            meaning.items.push(childNode.textContent || '');
                        }
                    });
                    return meaning;
                });
                meanings.push(...otherMeanings);
                return [{
                        word: cardHeader.textContent || '',
                        meanings,
                    }];
            },
        },
        {
            type: 'all',
            name: 'Google 翻译',
            api: 'https://translate.google.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&sl=auto&tl=zh-CN&q=',
            url: 'https://translate.google.com/?sl=auto&tl=zh-CN&op=translate&text=',
            alternatives: [],
            is() {
                return true;
            },
            async request(text) {
                const res = await get(this.api + text);
                const result = JSON.parse(res);
                return [{
                        meanings: [{
                                items: [result.sentences.map((sentence) => sentence.trans).join('')],
                            }],
                    }];
            },
        },
    ];

    /* src/components/App.svelte generated by Svelte v3.46.4 */

    function add_css(target) {
    	append_styles(target, "svelte-13eu1t3", ".app.svelte-13eu1t3.svelte-13eu1t3{--main-color:#0C9553;font-size:16px;color:#000}.trigger.svelte-13eu1t3.svelte-13eu1t3{position:fixed;top:0;left:0;z-index:9999;display:block;width:24px;height:24px;padding:4px;border:0;border-radius:15%;background-color:var(--main-color);color:#fff;transition:visibility 0.3s, opcacity 0.3s;cursor:pointer}.trigger.svelte-13eu1t3.svelte-13eu1t3:hover{opacity:0.85}.panel.svelte-13eu1t3.svelte-13eu1t3{position:fixed;top:0;left:0;z-index:9999;display:flex;flex-direction:column;justify-content:center;height:16em;width:24em;max-width:100vw;max-height:100vh;padding-bottom:0.5em;border:1px solid #eee;background-color:#fff;box-shadow:3px 2.8px 4.2px -5px rgba(0, 0, 0, 0.07),\n    7.3px 6.7px 10px -5px rgba(0, 0, 0, 0.05),\n    13.8px 12.5px 18.8px -5px rgba(0, 0, 0, 0.042),\n    24.6px 22.3px 33.5px -5px rgba(0, 0, 0, 0.035),\n    46px 41.8px 62.7px -5px rgba(0, 0, 0, 0.028),\n    110px 100px 150px -5px rgba(0, 0, 0, 0.02)\n  ;font-family:\"Segoe UI\", \"Microsoft Yahei\", meiryo, sans-serif;font-size:13px;line-height:1.5;transition:visibility 0.2s, opacity 0.2s;transition-timing-function:ease-in}.trigger.svelte-13eu1t3.svelte-13eu1t3:not(.is-show),.panel.svelte-13eu1t3.svelte-13eu1t3:not(.is-show){visibility:hidden;opacity:0;transition:none}.tabs.svelte-13eu1t3.svelte-13eu1t3{list-style:none;display:flex;padding:0;border-bottom:1px solid #f5f5f5;margin:0;background-color:#fcfcfc;user-select:none}.tab.svelte-13eu1t3.svelte-13eu1t3{flex:none;padding:0.5em 1em;border-right:1px solid #f5f5f5;border-bottom:1px solid #f5f5f5;margin-bottom:-1px;color:#666;cursor:pointer;transition:0.2s}.tab.active.svelte-13eu1t3.svelte-13eu1t3{padding-inline:1.25em;background-color:#fff;color:var(--main-color);border-bottom-color:#fff;font-weight:bold}.more.svelte-13eu1t3.svelte-13eu1t3{box-sizing:border-box;;;height:100%;margin-left:auto;aspect-ratio:1}.more.svelte-13eu1t3 a.svelte-13eu1t3{display:block;padding:0.65em;color:#a2a5a6;line-height:0;transition:0.3s}.more.svelte-13eu1t3 a.svelte-13eu1t3:hover{color:#000}");
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (66:6) {#each matchedLangs as lang}
    function create_each_block(ctx) {
    	let li;
    	let t_value = /*lang*/ ctx[16].name.split('')[0] + "";
    	let t;
    	let li_class_value;
    	let li_title_value;
    	let li_aria_selected_value;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[13](/*lang*/ ctx[16]);
    	}

    	return {
    		c() {
    			li = element("li");
    			t = text(t_value);

    			attr(li, "class", li_class_value = "tab" + (/*lang*/ ctx[16] === /*activeLang*/ ctx[6]
    			? ' active'
    			: '') + " svelte-13eu1t3");

    			attr(li, "title", li_title_value = /*lang*/ ctx[16].name);
    			attr(li, "role", "tab");
    			attr(li, "aria-selected", li_aria_selected_value = /*lang*/ ctx[16] === /*activeLang*/ ctx[6]);
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			append(li, t);

    			if (!mounted) {
    				dispose = listen(li, "click", click_handler_1);
    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*matchedLangs*/ 32 && t_value !== (t_value = /*lang*/ ctx[16].name.split('')[0] + "")) set_data(t, t_value);

    			if (dirty & /*matchedLangs, activeLang*/ 96 && li_class_value !== (li_class_value = "tab" + (/*lang*/ ctx[16] === /*activeLang*/ ctx[6]
    			? ' active'
    			: '') + " svelte-13eu1t3")) {
    				attr(li, "class", li_class_value);
    			}

    			if (dirty & /*matchedLangs*/ 32 && li_title_value !== (li_title_value = /*lang*/ ctx[16].name)) {
    				attr(li, "title", li_title_value);
    			}

    			if (dirty & /*matchedLangs, activeLang*/ 96 && li_aria_selected_value !== (li_aria_selected_value = /*lang*/ ctx[16] === /*activeLang*/ ctx[6])) {
    				attr(li, "aria-selected", li_aria_selected_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (77:6) {#if activeLang}
    function create_if_block_1(ctx) {
    	let li;
    	let a;
    	let svg;
    	let path0;
    	let path1;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			li = element("li");
    			a = element("a");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr(path0, "d", "M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z");
    			attr(path1, "d", "M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z");
    			attr(svg, "aria-hidden", "true");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "viewBox", "0 0 20 20");
    			attr(svg, "fill", "currentColor");
    			attr(a, "target", "_blank");
    			attr(a, "rel", "noopener noreferrer");
    			attr(a, "href", a_href_value = "" + (/*activeLang*/ ctx[6].url + /*text*/ ctx[0]));
    			attr(a, "title", "详细释义");
    			attr(a, "class", "svelte-13eu1t3");
    			attr(li, "class", "more svelte-13eu1t3");
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			append(li, a);
    			append(a, svg);
    			append(svg, path0);
    			append(svg, path1);

    			if (!mounted) {
    				dispose = listen(a, "click", stop_propagation(/*click_handler*/ ctx[11]));
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*activeLang, text*/ 65 && a_href_value !== (a_href_value = "" + (/*activeLang*/ ctx[6].url + /*text*/ ctx[0]))) {
    				attr(a, "href", a_href_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (95:4) {#if activeLang}
    function create_if_block(ctx) {
    	let langsection;
    	let current;

    	langsection = new LangSection({
    			props: {
    				lang: /*activeLang*/ ctx[6],
    				text: /*text*/ ctx[0]
    			}
    		});

    	return {
    		c() {
    			create_component(langsection.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(langsection, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const langsection_changes = {};
    			if (dirty & /*activeLang*/ 64) langsection_changes.lang = /*activeLang*/ ctx[6];
    			if (dirty & /*text*/ 1) langsection_changes.text = /*text*/ ctx[0];
    			langsection.$set(langsection_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(langsection.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(langsection.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(langsection, detaching);
    		}
    	};
    }

    function create_fragment(ctx) {
    	let div1;
    	let button;
    	let t0;
    	let div0;
    	let ul;
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*matchedLangs*/ ctx[5];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block0 = /*activeLang*/ ctx[6] && create_if_block_1(ctx);
    	let if_block1 = /*activeLang*/ ctx[6] && create_if_block(ctx);

    	return {
    		c() {
    			div1 = element("div");
    			button = element("button");
    			button.innerHTML = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>`;
    			t0 = space();
    			div0 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr(button, "class", "trigger svelte-13eu1t3");
    			attr(button, "aria-label", "开始翻译");
    			toggle_class(button, "is-show", /*showTrigger*/ ctx[3]);
    			attr(ul, "class", "tabs svelte-13eu1t3");
    			attr(ul, "role", "tablist");
    			attr(div0, "class", "panel svelte-13eu1t3");
    			toggle_class(div0, "is-show", /*showPanel*/ ctx[4]);
    			attr(div1, "class", "app svelte-13eu1t3");
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, button);
    			/*button_binding*/ ctx[12](button);
    			append(div1, t0);
    			append(div1, div0);
    			append(div0, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append(ul, t1);
    			if (if_block0) if_block0.m(ul, null);
    			append(div0, t2);
    			if (if_block1) if_block1.m(div0, null);
    			/*div0_binding*/ ctx[14](div0);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(button, "click", /*onTranslate*/ ctx[7]),
    					listen(div1, "mousedown", stop_propagation(/*mousedown_handler*/ ctx[9])),
    					listen(div1, "mouseup", stop_propagation(/*mouseup_handler*/ ctx[10]))
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*showTrigger*/ 8) {
    				toggle_class(button, "is-show", /*showTrigger*/ ctx[3]);
    			}

    			if (dirty & /*matchedLangs, activeLang, onToggleLanguage*/ 352) {
    				each_value = /*matchedLangs*/ ctx[5];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*activeLang*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(ul, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*activeLang*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*activeLang*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*showPanel*/ 16) {
    				toggle_class(div0, "is-show", /*showPanel*/ ctx[4]);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div1);
    			/*button_binding*/ ctx[12](null);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			/*div0_binding*/ ctx[14](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let text = '';
    	let rect;
    	let trigger;
    	let panel;
    	let showTrigger = false;
    	let showPanel = false;
    	let matchedLangs = [];
    	let activeLang;

    	window.addEventListener('mouseup', () => {
    		const selection = window.getSelection();
    		$$invalidate(0, text = selection.toString().trim().toLowerCase());

    		if (text) {
    			const rects = selection.getRangeAt(0).getClientRects();
    			rect = rects[rects.length - 1];
    			setPosition(trigger, rect);
    			$$invalidate(3, showTrigger = true);
    		}
    	});

    	window.addEventListener('mousedown', () => {
    		$$invalidate(3, showTrigger = false);
    		$$invalidate(4, showPanel = false);
    		$$invalidate(5, matchedLangs = []);
    	});

    	function onTranslate() {
    		$$invalidate(5, matchedLangs = Object.values(langs).filter(lang => lang.is(text)));

    		if (!activeLang || !matchedLangs.find(lang => lang === activeLang)) {
    			$$invalidate(6, [activeLang] = matchedLangs, activeLang);
    		}

    		setTimeout(() => {
    			setPosition(panel, rect);
    			$$invalidate(3, showTrigger = false);
    			$$invalidate(4, showPanel = true);
    		});
    	}

    	function onToggleLanguage(targetLang) {
    		$$invalidate(6, activeLang = targetLang);
    	}

    	function mousedown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			trigger = $$value;
    			$$invalidate(1, trigger);
    		});
    	}

    	const click_handler_1 = lang => onToggleLanguage(lang);

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			panel = $$value;
    			$$invalidate(2, panel);
    		});
    	}

    	return [
    		text,
    		trigger,
    		panel,
    		showTrigger,
    		showPanel,
    		matchedLangs,
    		activeLang,
    		onTranslate,
    		onToggleLanguage,
    		mousedown_handler,
    		mouseup_handler,
    		click_handler,
    		button_binding,
    		click_handler_1,
    		div0_binding
    	];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, {}, add_css);
    	}
    }

    const wrapper = document.createElement('div');
    document.body.append(wrapper);
    wrapper.attachShadow({ mode: 'open' });
    if (wrapper.shadowRoot) {
        // eslint-disable-next-line no-new
        new App({
            target: wrapper.shadowRoot,
        });
    }

})();