
// ==UserScript==
// @name Joblock 招聘求职
// @name:zh-CN 招聘求职助手（按条件屏蔽公司）
// @namespace 203x
// @version 0.2002.24.1582526328005
// @description:zh-CN 1. 支持 黑名单、白名单、低关注名单 2. 计算年薪，以及依据年薪过滤 3. 带GUI界面，可以即时导出，导入 4. 支持Boss直聘、拉勾网、猎聘网
// @author 203X
// @supportURL https://github.com/203x/userscript-joblock
// @license MIT
// @compatible chrome, firefox, safari
// @match *://www.zhipin.com/*
// @match *://www.lagou.com/*
// @match *://www.liepin.com/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_log
// @run-at document-end
// @description 1. 支持 黑名单、白名单、低关注名单 2. 计算年薪，以及依据年薪过滤 3. 带GUI界面，可以即时导出，导入 4. 支持Boss直聘、拉勾网、猎聘网
// @downloadURL https://update.greasyfork.org/scripts/396731/Joblock%20%E6%8B%9B%E8%81%98%E6%B1%82%E8%81%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/396731/Joblock%20%E6%8B%9B%E8%81%98%E6%B1%82%E8%81%8C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
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
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
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
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
    const seen_callbacks = new Set();
    function flush() {
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
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
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
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
        const prop_values = options.props || {};
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
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
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
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
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
        $set() {
            // overridden by instance, if it has props
        }
    }

    var btnHtml = "<a class=\"x-btn blacklist\" title=\"屏蔽该公司\" href=\"#\">\n  <svg\n    class=\"icon-svg\"\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"16\"\n    height=\"16\"\n    viewBox=\"0 0 24 24\"\n    fill=\"none\"\n    stroke=\"currentColor\"\n    stroke-width=\"2\"\n    stroke-linecap=\"round\"\n    stroke-linejoin=\"round\"\n    class=\"feather feather-slash\"\n  >\n    <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n    <line x1=\"4.93\" y1=\"4.93\" x2=\"19.07\" y2=\"19.07\"></line>\n  </svg>\n</a>\n<a class=\"x-btn\" title=\"低关注公司\" href=\"#\">\n  <svg class=\"icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-minus-circle\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line></svg>\n</a>\n";

    const levelAttr = 'data-level';
    function parseHTML(string) {
        const context = document.implementation.createHTMLDocument();
        const base = context.createElement('base');
        base.href = document.location.href;
        context.head.appendChild(base);
        context.body.innerHTML = string;
        return context.body.children;
    }
    class Job {
        constructor(el, rule, onClick) {
            this.el = el;
            this.rule = rule;
            this.onClick = onClick;
            this.company = this.el
                .querySelectorAll(this.rule.ItemCompany)[0]
                .textContent.trim();
            this.salary = this.getSalary();
            this.initBtn();
        }
        getSalary() {
            const SalaryEl = this.el.querySelectorAll(this.rule.ItemSalarySelector)[0];
            if (SalaryEl) {
                const r = new RegExp(this.rule.ItemSalaryReg);
                const g = r.exec(SalaryEl.textContent);
                if (g && g[0] && g[1] && g[2]) {
                    const salary = {
                        lower: parseInt(g[1]),
                        upper: parseInt(g[2]),
                        multiple: g[3] ? parseInt(g[3]) : 12,
                    };
                    const value = {
                        lower: (salary.lower * salary.multiple) / 10,
                        upper: (salary.upper * salary.multiple) / 10,
                    };
                    SalaryEl.textContent = `${SalaryEl.textContent} [${value.lower}-${value.upper}]`;
                    return value;
                }
            }
            return null;
        }
        set level(lv) {
            if (lv === 0) {
                this.el.removeAttribute(levelAttr);
            }
            else {
                this.el.setAttribute(levelAttr, lv.toString());
            }
        }
        get level() {
            const lv = this.el.getAttribute(levelAttr);
            if (lv) {
                return parseInt(lv);
            }
            else {
                return 0;
            }
        }
        initBtn() {
            const html = parseHTML(btnHtml);
            const btnBlacklist = html[0];
            const btnLowlist = html[1];
            btnBlacklist.setAttribute('style', this.rule.BlockBtnStyle);
            btnLowlist.setAttribute('style', this.rule.BlockBtnStyle);
            const btnWrap = this.el.querySelectorAll(this.rule.ItemAddBtn)[0];
            if (btnWrap) {
                btnWrap.append(btnBlacklist);
                btnWrap.append(btnLowlist);
                btnBlacklist.addEventListener('click', e => {
                    e.preventDefault();
                    this.onClick('black', this.company);
                });
                btnLowlist.addEventListener('click', e => {
                    e.preventDefault();
                    this.onClick('low', this.company);
                });
            }
            else {
                GM_log('Joblock找不到：' + this.rule.ItemAddBtn);
            }
        }
    }

    var data = { rules:{ "www.zhipin.com":{ pathname:"\\/(?:(\\w\\d+-?)+)|job_detail\\/",
          ItemList:".search-job-list-wrap .job-list li",
          ItemCompany:".company-text h3 a[ka]",
          ItemAddBtn:".company-text h3.name",
          BlockBtnStyle:"float: left; height: 26px; display: flex; justify-content: center; align-items: center; margin-right: .3em;\n",
          ItemSalarySelector:".job-limit .red",
          ItemSalaryReg:"(?:(\\d+)-(\\d+)K(?:·(\\d+)薪)?)|(\\d+)-(\\d+)\\/天" },
        "www.lagou.com":{ pathname:"\\/(?:zhaopin\\/chanpinjingli1)|jobs\\/",
          ItemList:".s_position_list .con_list_item",
          ItemCompany:".company_name a",
          ItemAddBtn:".company_name",
          BlockBtnStyle:"float: left; display: inline-block; height: 18px; margin-right: .3em; margin-top: 12px; position: relative;\n",
          ItemSalarySelector:".money",
          ItemSalaryReg:"(\\d+)k-(\\d+)k",
          onRefresh:".item_con_pager" },
        "www.liepin.com":{ pathname:"\\/(?:zhaopin)\\/",
          ItemList:"#sojob ul.sojob-list li",
          ItemCompany:".company-name a",
          ItemAddBtn:".field-financing",
          BlockBtnStyle:"display: inline-block; margin-right: .3em;\n",
          ItemSalarySelector:".job-info .text-warning",
          ItemSalaryReg:"(\\d+)-(\\d+)k(?:·(\\d+)薪)?" } } };

    function isFunction(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    }
    function reg(str) {
        const pathname = window.location.pathname;
        const r = new RegExp(str);
        return r.exec(pathname);
    }
    const rules = data.rules;
    class Joblock {
        constructor(onRefresh, onChange) {
            this.rule = rules[window.location.host];
            this.onRefresh = onRefresh;
            this.onChange = onChange;
            this.install();
            this.refresh();
        }
        install() {
            if (this.rule && this.rule.onRefresh) {
                const onRefreshEl = document.querySelectorAll(this.rule.onRefresh)[0];
                if (onRefreshEl) {
                    onRefreshEl.addEventListener('click', () => {
                        this.timeRefresh();
                    });
                }
                window.addEventListener('scroll', () => {
                    this.timeRefresh();
                });
            }
        }
        timeRefresh() {
            if (!this.timed) {
                this.timed = setTimeout(() => {
                    this.refresh();
                    this.timed = null;
                }, 500);
            }
        }
        getJobs() {
            try {
                return this.rule && reg(this.rule.pathname)
                    ? Array.from(document.querySelectorAll(this.rule.ItemList)).map(el => {
                        if (this.jobs) {
                            for (const iterator of this.jobs) {
                                if (iterator.el === el) {
                                    return iterator;
                                }
                            }
                        }
                        return new Job(el, this.rule, (type, company) => {
                            if (isFunction(this.onChange)) {
                                this.onChange(type, company);
                            }
                            this.refresh();
                        });
                    })
                    : [];
            }
            catch (error) {
                return [];
            }
        }
        refresh() {
            this.jobs = this.getJobs();
            if (isFunction(this.onRefresh)) {
                this.onRefresh(this.jobs);
            }
        }
    }

    /* src/components/Icon.svelte generated by Svelte v3.18.1 */

    function create_if_block(ctx) {
    	let svg;
    	let polygon;
    	let svg_class_value;

    	return {
    		c() {
    			svg = svg_element("svg");
    			polygon = svg_element("polygon");
    			attr(polygon, "points", "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7\n      14.14 2 9.27 8.91 8.26 12 2");
    			attr(svg, "class", svg_class_value = "icon-svg " + (/*$$props*/ ctx[1].class ? /*$$props*/ ctx[1].class : ""));
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "width", "16");
    			attr(svg, "height", "16");
    			attr(svg, "viewBox", "0 0 24 24");
    			attr(svg, "fill", "none");
    			attr(svg, "stroke", "#fff");
    			attr(svg, "stroke-width", "2");
    			attr(svg, "stroke-linecap", "round");
    			attr(svg, "stroke-linejoin", "round");
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, polygon);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*$$props*/ 2 && svg_class_value !== (svg_class_value = "icon-svg " + (/*$$props*/ ctx[1].class ? /*$$props*/ ctx[1].class : ""))) {
    				attr(svg, "class", svg_class_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    function create_fragment(ctx) {
    	let if_block_anchor;
    	let if_block = /*type*/ ctx[0] == "star" && create_if_block(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, [dirty]) {
    			if (/*type*/ ctx[0] == "star") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { type } = $$props;

    	$$self.$set = $$new_props => {
    		$$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("type" in $$new_props) $$invalidate(0, type = $$new_props.type);
    	};

    	$$props = exclude_internal_props($$props);
    	return [type, $$props];
    }

    class Icon extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, { type: 0 });
    	}
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

    function createStore(name, defaultState) {
      const initialState = GM_getValue(name, defaultState);
      const store = writable(initialState);
      const { subscribe, set } = store;

      return {
        subscribe,
        set: new_store => {
          GM_setValue(name, new_store);
          return set(new_store)
        },
      }
    }

    const salary = createStore('salary', {
      enable: false,
      lower: 12,
      upper: 20,
    });

    function createList(name, defaultState=[]) {
      const initialState = GM_getValue(name, defaultState);
      const store = writable(initialState);
      const { subscribe, set, update } = store;

      return {
        subscribe,
        add: item => {
          return update(list => {
            const newList = [...list, item];
            GM_setValue(name, newList);
            return newList
          })
        },
        del: item => {
          return update(list => {
            const index = list.indexOf(item);
            if (index > -1) {
              list.splice(index, 1);
              GM_setValue(name, list);
            }
            return list
          })
        },
        set: (newList = []) => {
          GM_setValue(name, newList);
          return set(newList)
        },
        in: item => {
          return get_store_value(store).indexOf(item) > -1
        },
      }
    }

    const blacklist = createList('blacklist');
    const whitelist = createList('whitelist');
    const lowlist = createList('lowlist');

    /* src/components/Panel.svelte generated by Svelte v3.18.1 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[22] = i;
    	return child_ctx;
    }

    // (71:4) {#each arr as item, i}
    function create_each_block(ctx) {
    	let li;
    	let t0_value = /*item*/ ctx[20] + "";
    	let t0;
    	let t1;
    	let li_class_value;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[13](/*i*/ ctx[22], ...args);
    	}

    	return {
    		c() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr(li, "class", li_class_value = "tab-nav-li " + (/*i*/ ctx[22] === /*index*/ ctx[1] ? "activa" : ""));
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			append(li, t0);
    			append(li, t1);
    			dispose = listen(li, "click", click_handler);
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*index*/ 2 && li_class_value !== (li_class_value = "tab-nav-li " + (/*i*/ ctx[22] === /*index*/ ctx[1] ? "activa" : ""))) {
    				attr(li, "class", li_class_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    			dispose();
    		}
    	};
    }

    // (107:26) 
    function create_if_block_4(ctx) {
    	let textarea;
    	let dispose;

    	return {
    		c() {
    			textarea = element("textarea");
    			attr(textarea, "placeholder", "");
    		},
    		m(target, anchor) {
    			insert(target, textarea, anchor);
    			set_input_value(textarea, /*list*/ ctx[2].whitelist);
    			dispose = listen(textarea, "input", /*textarea_input_handler_2*/ ctx[19]);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*list*/ 4) {
    				set_input_value(textarea, /*list*/ ctx[2].whitelist);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(textarea);
    			dispose();
    		}
    	};
    }

    // (105:26) 
    function create_if_block_3(ctx) {
    	let textarea;
    	let dispose;

    	return {
    		c() {
    			textarea = element("textarea");
    			attr(textarea, "placeholder", "");
    		},
    		m(target, anchor) {
    			insert(target, textarea, anchor);
    			set_input_value(textarea, /*list*/ ctx[2].blacklist);
    			dispose = listen(textarea, "input", /*textarea_input_handler_1*/ ctx[18]);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*list*/ 4) {
    				set_input_value(textarea, /*list*/ ctx[2].blacklist);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(textarea);
    			dispose();
    		}
    	};
    }

    // (103:26) 
    function create_if_block_2(ctx) {
    	let textarea;
    	let dispose;

    	return {
    		c() {
    			textarea = element("textarea");
    			attr(textarea, "placeholder", "");
    		},
    		m(target, anchor) {
    			insert(target, textarea, anchor);
    			set_input_value(textarea, /*list*/ ctx[2].lowlist);
    			dispose = listen(textarea, "input", /*textarea_input_handler*/ ctx[17]);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*list*/ 4) {
    				set_input_value(textarea, /*list*/ ctx[2].lowlist);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(textarea);
    			dispose();
    		}
    	};
    }

    // (90:26) 
    function create_if_block_1(ctx) {
    	let label0;
    	let input0;
    	let t0;
    	let t1;
    	let label1;
    	let t2;
    	let input1;
    	let input1_updating = false;
    	let t3;
    	let label2;
    	let t4;
    	let input2;
    	let input2_updating = false;
    	let dispose;

    	function input1_input_handler() {
    		input1_updating = true;
    		/*input1_input_handler*/ ctx[15].call(input1);
    	}

    	function input2_input_handler() {
    		input2_updating = true;
    		/*input2_input_handler*/ ctx[16].call(input2);
    	}

    	return {
    		c() {
    			label0 = element("label");
    			input0 = element("input");
    			t0 = text("\n        启用年薪过滤");
    			t1 = space();
    			label1 = element("label");
    			t2 = text("年薪阙值（上限）\n        ");
    			input1 = element("input");
    			t3 = space();
    			label2 = element("label");
    			t4 = text("年薪阙值（下限）\n        ");
    			input2 = element("input");
    			attr(input0, "type", "checkbox");
    			attr(label0, "class", "svelte-1015qvh");
    			attr(input1, "type", "number");
    			attr(input1, "min", "0");
    			attr(input1, "max", "1000");
    			attr(label1, "title", "最高年薪高于本值");
    			attr(label1, "class", "svelte-1015qvh");
    			attr(input2, "type", "number");
    			attr(input2, "min", "0");
    			attr(input2, "max", "1000");
    			attr(label2, "title", "最低年薪高于本值");
    			attr(label2, "class", "svelte-1015qvh");
    		},
    		m(target, anchor) {
    			insert(target, label0, anchor);
    			append(label0, input0);
    			input0.checked = /*new_salary*/ ctx[3].enable;
    			append(label0, t0);
    			insert(target, t1, anchor);
    			insert(target, label1, anchor);
    			append(label1, t2);
    			append(label1, input1);
    			set_input_value(input1, /*new_salary*/ ctx[3].upper);
    			insert(target, t3, anchor);
    			insert(target, label2, anchor);
    			append(label2, t4);
    			append(label2, input2);
    			set_input_value(input2, /*new_salary*/ ctx[3].lower);

    			dispose = [
    				listen(input0, "change", /*input0_change_handler*/ ctx[14]),
    				listen(input1, "input", input1_input_handler),
    				listen(input2, "input", input2_input_handler)
    			];
    		},
    		p(ctx, dirty) {
    			if (dirty & /*new_salary*/ 8) {
    				input0.checked = /*new_salary*/ ctx[3].enable;
    			}

    			if (!input1_updating && dirty & /*new_salary*/ 8) {
    				set_input_value(input1, /*new_salary*/ ctx[3].upper);
    			}

    			input1_updating = false;

    			if (!input2_updating && dirty & /*new_salary*/ 8) {
    				set_input_value(input2, /*new_salary*/ ctx[3].lower);
    			}

    			input2_updating = false;
    		},
    		d(detaching) {
    			if (detaching) detach(label0);
    			if (detaching) detach(t1);
    			if (detaching) detach(label1);
    			if (detaching) detach(t3);
    			if (detaching) detach(label2);
    			run_all(dispose);
    		}
    	};
    }

    // (82:4) {#if index === 0}
    function create_if_block$1(ctx) {
    	let ul;
    	let li0;
    	let t0;
    	let t1_value = /*statis*/ ctx[0].black + "";
    	let t1;
    	let t2;
    	let li1;
    	let t3;
    	let t4_value = /*statis*/ ctx[0].white + "";
    	let t4;
    	let t5;
    	let li2;
    	let t6;
    	let t7_value = /*statis*/ ctx[0].low + "";
    	let t7;
    	let t8;
    	let li3;
    	let t9;
    	let t10_value = /*statis*/ ctx[0].cheap + "";
    	let t10;
    	let t11;
    	let li4;
    	let t12;
    	let t13_value = /*statis*/ ctx[0].black + /*statis*/ ctx[0].white + /*statis*/ ctx[0].low + /*statis*/ ctx[0].cheap + "";
    	let t13;
    	let t14;
    	let t15_value = /*statis*/ ctx[0].total + "";
    	let t15;

    	return {
    		c() {
    			ul = element("ul");
    			li0 = element("li");
    			t0 = text("黑名单：");
    			t1 = text(t1_value);
    			t2 = space();
    			li1 = element("li");
    			t3 = text("白名单：");
    			t4 = text(t4_value);
    			t5 = space();
    			li2 = element("li");
    			t6 = text("低关注：");
    			t7 = text(t7_value);
    			t8 = space();
    			li3 = element("li");
    			t9 = text("低年薪：");
    			t10 = text(t10_value);
    			t11 = space();
    			li4 = element("li");
    			t12 = text("总计：");
    			t13 = text(t13_value);
    			t14 = text("/");
    			t15 = text(t15_value);
    		},
    		m(target, anchor) {
    			insert(target, ul, anchor);
    			append(ul, li0);
    			append(li0, t0);
    			append(li0, t1);
    			append(ul, t2);
    			append(ul, li1);
    			append(li1, t3);
    			append(li1, t4);
    			append(ul, t5);
    			append(ul, li2);
    			append(li2, t6);
    			append(li2, t7);
    			append(ul, t8);
    			append(ul, li3);
    			append(li3, t9);
    			append(li3, t10);
    			append(ul, t11);
    			append(ul, li4);
    			append(li4, t12);
    			append(li4, t13);
    			append(li4, t14);
    			append(li4, t15);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*statis*/ 1 && t1_value !== (t1_value = /*statis*/ ctx[0].black + "")) set_data(t1, t1_value);
    			if (dirty & /*statis*/ 1 && t4_value !== (t4_value = /*statis*/ ctx[0].white + "")) set_data(t4, t4_value);
    			if (dirty & /*statis*/ 1 && t7_value !== (t7_value = /*statis*/ ctx[0].low + "")) set_data(t7, t7_value);
    			if (dirty & /*statis*/ 1 && t10_value !== (t10_value = /*statis*/ ctx[0].cheap + "")) set_data(t10, t10_value);
    			if (dirty & /*statis*/ 1 && t13_value !== (t13_value = /*statis*/ ctx[0].black + /*statis*/ ctx[0].white + /*statis*/ ctx[0].low + /*statis*/ ctx[0].cheap + "")) set_data(t13, t13_value);
    			if (dirty & /*statis*/ 1 && t15_value !== (t15_value = /*statis*/ ctx[0].total + "")) set_data(t15, t15_value);
    		},
    		d(detaching) {
    			if (detaching) detach(ul);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let div2;
    	let ul;
    	let t0;
    	let div0;
    	let t1;
    	let div1;
    	let span0;
    	let t3;
    	let span1;
    	let t5;
    	let span2;
    	let t6;
    	let dispose;
    	let each_value = /*arr*/ ctx[5];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*index*/ ctx[1] === 0) return create_if_block$1;
    		if (/*index*/ ctx[1] === 1) return create_if_block_1;
    		if (/*index*/ ctx[1] === 2) return create_if_block_2;
    		if (/*index*/ ctx[1] === 3) return create_if_block_3;
    		if (/*index*/ ctx[1] === 4) return create_if_block_4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	return {
    		c() {
    			div2 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "保存并应用";
    			t3 = space();
    			span1 = element("span");
    			span1.textContent = "关闭";
    			t5 = space();
    			span2 = element("span");
    			t6 = text(/*tip*/ ctx[4]);
    			attr(ul, "class", "tab-nav");
    			attr(div0, "class", "x-body");
    			attr(span0, "class", "x-btn");
    			attr(span1, "class", "x-btn");
    			attr(span2, "class", "x-tip");
    			attr(div1, "class", "x-footer");
    			attr(div2, "class", "x-panel");
    		},
    		m(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append(div2, t0);
    			append(div2, div0);
    			if (if_block) if_block.m(div0, null);
    			append(div2, t1);
    			append(div2, div1);
    			append(div1, span0);
    			append(div1, t3);
    			append(div1, span1);
    			append(div1, t5);
    			append(div1, span2);
    			append(span2, t6);

    			dispose = [
    				listen(span0, "click", /*save*/ ctx[6]),
    				listen(span1, "click", /*close*/ ctx[7])
    			];
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*index, arr*/ 34) {
    				each_value = /*arr*/ ctx[5];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*tip*/ 16) set_data(t6, /*tip*/ ctx[4]);
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div2);
    			destroy_each(each_blocks, detaching);

    			if (if_block) {
    				if_block.d();
    			}

    			run_all(dispose);
    		}
    	};
    }

    function arr2str(arr) {
    	return arr.join("\n");
    }

    function str2arr(str) {
    	return str.trim().split("\n");
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $blacklist;
    	let $whitelist;
    	let $lowlist;
    	let $salary;
    	component_subscribe($$self, blacklist, $$value => $$invalidate(8, $blacklist = $$value));
    	component_subscribe($$self, whitelist, $$value => $$invalidate(9, $whitelist = $$value));
    	component_subscribe($$self, lowlist, $$value => $$invalidate(10, $lowlist = $$value));
    	component_subscribe($$self, salary, $$value => $$invalidate(11, $salary = $$value));
    	let { statis } = $$props;
    	let index = 0;
    	let arr = ["统计", "年薪配置", "低关注名单", "黑名单", "白名单"];

    	let list = {
    		blacklist: "",
    		whitelist: "",
    		lowlist: ""
    	};

    	let new_salary = { enable: false, lower: 0, upper: 0 };
    	let tip = "";

    	onMount(() => {
    		$$invalidate(2, list.blacklist = arr2str($blacklist), list);
    		$$invalidate(2, list.whitelist = arr2str($whitelist), list);
    		$$invalidate(2, list.lowlist = arr2str($lowlist), list);
    		$$invalidate(3, new_salary = $salary);
    	});

    	const dispatch = createEventDispatcher();

    	function save() {
    		try {
    			blacklist.set(str2arr(list.blacklist));
    			whitelist.set(str2arr(list.whitelist));
    			lowlist.set(str2arr(list.lowlist));
    			salary.set(new_salary);
    			$$invalidate(4, tip = "已保存");
    			dispatch("save", {});
    		} catch(error) {
    			$$invalidate(4, tip = error);
    		}

    		setTimeout(
    			() => {
    				$$invalidate(4, tip = "");
    			},
    			3000
    		);
    	}

    	function close() {
    		dispatch("close", {});
    	}

    	const click_handler = i => {
    		$$invalidate(1, index = i);
    	};

    	function input0_change_handler() {
    		new_salary.enable = this.checked;
    		$$invalidate(3, new_salary);
    	}

    	function input1_input_handler() {
    		new_salary.upper = to_number(this.value);
    		$$invalidate(3, new_salary);
    	}

    	function input2_input_handler() {
    		new_salary.lower = to_number(this.value);
    		$$invalidate(3, new_salary);
    	}

    	function textarea_input_handler() {
    		list.lowlist = this.value;
    		$$invalidate(2, list);
    	}

    	function textarea_input_handler_1() {
    		list.blacklist = this.value;
    		$$invalidate(2, list);
    	}

    	function textarea_input_handler_2() {
    		list.whitelist = this.value;
    		$$invalidate(2, list);
    	}

    	$$self.$set = $$props => {
    		if ("statis" in $$props) $$invalidate(0, statis = $$props.statis);
    	};

    	return [
    		statis,
    		index,
    		list,
    		new_salary,
    		tip,
    		arr,
    		save,
    		close,
    		$blacklist,
    		$whitelist,
    		$lowlist,
    		$salary,
    		dispatch,
    		click_handler,
    		input0_change_handler,
    		input1_input_handler,
    		input2_input_handler,
    		textarea_input_handler,
    		textarea_input_handler_1,
    		textarea_input_handler_2
    	];
    }

    class Panel extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { statis: 0 });
    	}
    }

    /* src/App.svelte generated by Svelte v3.18.1 */

    function create_if_block$2(ctx) {
    	let current;
    	const panel = new Panel({ props: { statis: /*statis*/ ctx[1] } });
    	panel.$on("save", /*onSave*/ ctx[2]);
    	panel.$on("close", /*close_handler*/ ctx[7]);

    	return {
    		c() {
    			create_component(panel.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(panel, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const panel_changes = {};
    			if (dirty & /*statis*/ 2) panel_changes.statis = /*statis*/ ctx[1];
    			panel.$set(panel_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(panel.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(panel.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(panel, detaching);
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	let div;
    	let span;
    	let t;
    	let if_block_anchor;
    	let current;
    	let dispose;
    	const icon = new Icon({ props: { type: "star" } });
    	let if_block = /*visible*/ ctx[0] === true && create_if_block$2(ctx);

    	return {
    		c() {
    			div = element("div");
    			span = element("span");
    			create_component(icon.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr(span, "class", "x-btn-icon");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, span);
    			mount_component(icon, span, null);
    			insert(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    			dispose = listen(span, "click", /*click_handler*/ ctx[6]);
    		},
    		p(ctx, [dirty]) {
    			if (/*visible*/ ctx[0] === true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_component(icon);
    			if (detaching) detach(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    			dispose();
    		}
    	};
    }

    function isWhite(job) {
    	return whitelist.in(job.company);
    }

    function isBlack(job) {
    	return blacklist.in(job.company);
    }

    function isLow(job) {
    	return lowlist.in(job.company);
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $salary;
    	component_subscribe($$self, salary, $$value => $$invalidate(4, $salary = $$value));
    	let visible = false;
    	let joblock = null;

    	let statis = {
    		black: 0,
    		white: 0,
    		low: 0,
    		cheap: 0,
    		total: 0
    	};

    	function isSalary(job) {
    		if ($salary.enable === false || !job.salary) {
    			return false;
    		}

    		return !(job.salary.upper > $salary.upper || job.salary.lower > $salary.lower);
    	}

    	onMount(() => {
    		joblock = new Joblock(jobs => {
    				$$invalidate(1, statis = {
    					black: 0,
    					white: 0,
    					low: 0,
    					cheap: 0,
    					total: jobs.length
    				});

    				jobs.forEach(job => {
    					let level = 0;

    					if (isSalary(job)) {
    						$$invalidate(1, statis.cheap += 1, statis);
    						level = 9;
    					} else if (isLow(job)) {
    						$$invalidate(1, statis.low += 1, statis);
    						level = 1;
    					} else if (isWhite(job)) {
    						$$invalidate(1, statis.white += 1, statis);
    					} else if (isBlack(job)) {
    						$$invalidate(1, statis.black += 1, statis);
    						level = 8;
    					}

    					job.level = level;
    				});
    			},
    		(type, company) => {
    				const list = type === "low" ? lowlist : blacklist; // GM_log(total)

    				if (list.in(company)) {
    					list.del(company);
    				} else {
    					list.add(company);
    				}
    			});

    		GM_registerMenuCommand("Config", () => {
    			$$invalidate(0, visible = !visible);
    		});
    	});

    	function onSave() {
    		joblock.refresh();
    	}

    	const click_handler = () => {
    		$$invalidate(0, visible = !visible);
    	};

    	const close_handler = () => {
    		$$invalidate(0, visible = false);
    	};

    	return [
    		visible,
    		statis,
    		onSave,
    		joblock,
    		$salary,
    		isSalary,
    		click_handler,
    		close_handler
    	];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});
    	}
    }

    const start = function () {
        const ContainerApp = document.createElement('DIV');
        ContainerApp.setAttribute('id', 'x-joblock');
        document.body.appendChild(ContainerApp);
        const app = new App({
            target: ContainerApp,
        });
    };
    if (document.readyState !== 'loading') {
        start();
    }
    else {
        document.addEventListener('DOMContentLoaded', start);
    }

}());

GM_addStyle(`.icon-svg{width:1em;height:1em;vertical-align:-.15em;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;fill:none;overflow:hidden}label.svelte-1015qvh{display:block;margin-bottom:10px}.x-btn{display:inline-block;line-height:1em;cursor:pointer;user-select:none}.blacklist{color:#000!important}#x-joblock{position:fixed;bottom:1em;left:1em;font-size:14px}#x-joblock .x-btn-icon{display:inline-block;line-height:1em;cursor:pointer;user-select:none;padding:3px;border-radius:5px;transition:all .3s;background-color:#fff;color:#555;box-shadow:0 .44216px 1.32946px rgba(0,0,0,.0383736),0 2.23281px 4.4812px rgba(0,0,0,.0479094),0 12px 22px rgba(0,0,0,.07)}#x-joblock .x-btn-icon:hover{color:#151515}#x-joblock .x-btn-icon:active{background-color:#f2f2f2;box-shadow:0 .14739px 1.28114px rgba(0,0,0,.0331141),0 .74427px 4.20501px rgba(0,0,0,.0445642),0 4px 22px rgba(0,0,0,.07)}#x-joblock ul{list-style:none}#x-joblock li,#x-joblock ol,#x-joblock ul{margin:0;padding:0}#x-joblock .x-panel .tab-nav{display:flex;min-width:300px;border-bottom:1px solid #eee}#x-joblock .x-panel .tab-nav .tab-nav-li{margin-right:.5em;padding:.5em 0;color:#666;cursor:pointer}#x-joblock .x-panel .tab-nav .tab-nav-li.activa{color:#000;font-weight:700}#x-joblock .x-panel .x-body{padding:.5em 0;height:160px;display:flex;flex-direction:column}#x-joblock .x-panel .x-body textarea{flex-grow:1}#x-joblock .x-panel .x-body input,#x-joblock .x-panel .x-body input[type=number],#x-joblock .x-panel .x-body textarea{border:1px solid #eee;padding:.2em;border-radius:3px;font-size:12px;transition:all .2s ease}#x-joblock .x-panel .x-body input:focus,#x-joblock .x-panel .x-body input:hover,#x-joblock .x-panel .x-body input[type=number]:focus,#x-joblock .x-panel .x-body input[type=number]:hover,#x-joblock .x-panel .x-body textarea:focus,#x-joblock .x-panel .x-body textarea:hover{border:1px solid #aaa}#x-joblock .x-panel .x-footer{margin-top:.5em;display:flex;flex-direction:row-reverse}#x-joblock .x-panel .x-btn{padding:.2em .8em;border-radius:3px;line-height:1.2em;font-size:.9em;margin-left:.5em;border:1px solid #eee}#x-joblock .x-panel .x-tip{color:#e63131;font-size:.8em;margin-right:.5em}.x-panel{position:absolute;bottom:2em;left:0;padding:10px;border:1px solid #eee;border-radius:5px;background-color:#fff}[data-level="1"]{opacity:.2}[data-level="8"],[data-level="9"]{display:none!important}
`);