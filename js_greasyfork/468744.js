// ==UserScript==
// @name        MFC Tagger+
// @description A set of tools to help MyFigureCollection contributors with tagging items
// @namespace   https://takkkane.tumblr.com/scripts/mfcTagCounter
// @version     0.2.1
// @author      Nefere
// @homepage    https://github.com/Nefere256/mfc-tagger-plus/tree/main
// @supportURL  https://github.com/Nefere256/mfc-tagger-plus/tree/main
// @match       https://myfigurecollection.net/entry/*
// @match       https://myfigurecollection.net/browse.v4.php*
// @match       https://myfigurecollection.net/browse/calendar/*
// @match       https://myfigurecollection.net/*
// @match       https://myfigurecollection.net/item/browse/figure/
// @match       https://myfigurecollection.net/item/browse/goods/
// @match       https://myfigurecollection.net/item/browse/media/
// @match       https://myfigurecollection.net/item/browse/calendar/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=myfigurecollection.net
// @license     MIT
// @connect     github.com
// @run-at      document-idle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/468744/MFC%20Tagger%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/468744/MFC%20Tagger%2B.meta.js
// ==/UserScript==
GM_addStyle(GM_getResourceText('css'));
var app = (function () {
    'use strict';
 
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
 
    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
 
    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
 
    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
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
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
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
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
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
            flush_render_callbacks($$.after_update);
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
            ctx: [],
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
            if (!is_function(callback)) {
                return noop;
            }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
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
 
    /* src\App.svelte generated by Svelte v3.59.2 */
 
    const { Object: Object_1, console: console_1 } = globals;
 
    function create_fragment(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
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
    	validate_slots('App', slots, []);
 
    	(async function () {
 
    		/**
     * Name of the class used for a tag counter container.
     * It should be not used on the page it's inserted to.
     **/
    		var TAG_CLASSNAME = "us-tag";
 
    		/**
     * Name of the class absent on the page.
     * Used to return empty collection of nodes from a function.
     **/
    		var FAKE_CLASS_PLACEHOLDER = "fake-class-placeholder";
 
    		/**
     * A time in miliseconds to wait between requests to MFC.
     * Too short time may results in "429 - Too many requests" error responses.
     * Can be increased with REQUEST_DELAY_MULTIPLIER.
     **/
    		var REQUEST_DELAY = 1000;
 
    		/**
     * A multipler that is used on REQUEST_DELAY when 429 response error is obtained.
     * Should be over 1 to work properly.
     **/
    		var REQUEST_DELAY_MULTIPLIER = 1.1;
 
    		/**
     * A time in seconds for how long the entry data saved in a cache is considered "fresh" and up to date.
     * After the entry data is "stale", it is removed from cache and may be replaced with new data.
     **/
    		var CACHE_FRESH_SECONDS = 10 * 60;
 
    		/**
     * Map entries for tagCounterCache that are yet to be persisted in the extension storage.
    	 * The contents: see tagCounterCache
     **/
    		var CACHE_SAVE_ENTRIES = [];
 
    		/**
     * How many entries have to be added to the cache so the cache can be persisted in the extension storage.
    	 * That way if the user gets into another page, some of the data gathered will not be lost.
     * It requires using GM.getValue() and GM.setValue()
     **/
    		var CACHE_SAVE_AFTER_SETTING_VALUES_ORDER = 5;
 
    		/**
     * A cache for tag count indicated in the entry page.
     * It's a Map() consisted of:
     * * keys: pathname of an entry page ("/entry/39")
     * * values: object with fields:
     * ** number: integer with number of tags on the entry page (39)
     * ** updatedTime: timestamp of when the map was updated.
     * Map entries may be deleted after time indicated in CACHE_FRESH_SECONDS.
     **/
    		var tagCounterCache;
 
    		/**
     * Util method. It let the thread sleep for ms (miliseconds) between calls to MFC website.
     **/
    		function sleep(ms) {
    			return new Promise(resolve => setTimeout(resolve, ms));
    		}
 
    		/**
     * Get tagCounterCache from a persistent storage.
     **/
    		async function getTagCounterCache() {
    			return new Map(Object.entries(JSON.parse(await GM.getValue('tagCounterCache', '{}'))));
    		}
 
    		/**
     * Save tagCounterCache with new CACHE_SAVE_ENTRIES to a persistent storage.
     * CACHE_SAVE_ENTRIES will be cleared after succesful save.
     **/
    		async function saveTagCounterCache() {
    			var newTagCounterCache = await getTagCounterCache();
 
    			for (var entry of CACHE_SAVE_ENTRIES) {
    				newTagCounterCache.set(entry.key, entry.value);
    			}
 
    			GM.setValue('tagCounterCache', JSON.stringify(Object.fromEntries(newTagCounterCache)));
    			tagCounterCache = newTagCounterCache;
    			newTagCounterCache.length = 0; /* clear new data as they are persisted */
    		}
 
    		/**
     * Save an url and count of tags to both tagCounterCache and CACHE_SAVE_ENTRIES.
     * If CACHE_SAVE_ENTRIES will have CACHE_SAVE_AFTER_SETTING_VALUES_ORDER entries, 
     * the persistent storage will be updated.
     **/
    		async function pushToTagCounterCache(url, tagCounter) {
    			if (tagCounter) {
    				var time = Date.now();
 
    				var entry = {
    					key: url,
    					value: {
    						'number': tagCounter,
    						'updatedTime': time
    					}
    				};
 
    				tagCounterCache.set(entry.key, entry.value);
    				CACHE_SAVE_ENTRIES.push(entry);
 
    				if (CACHE_SAVE_ENTRIES.length % CACHE_SAVE_AFTER_SETTING_VALUES_ORDER == 0) {
    					saveTagCounterCache();
    				}
    			}
    		}
 
    		/**
     * Get a number of tags for a specified url from cache.
     * if the info is stale after CACHE_FRESH_SECONDS since last update of entry,
     * the info would be deleted, and the functon will return 0.
     * Otherwise, return number of tags.
     **/
    		function getTagCounterFromTagCounterCache(url) {
    			var tagCounterPair = tagCounterCache.get(url);
 
    			if (tagCounterPair == null) {
    				return 0;
    			}
 
    			var stalePairDate = new Date(tagCounterPair.updatedTime);
    			stalePairDate.setSeconds(stalePairDate.getSeconds() + CACHE_FRESH_SECONDS);
 
    			if (stalePairDate < Date.now()) {
    				tagCounterCache.delete(url);
    				return 0;
    			}
 
    			return tagCounterPair.number;
    		}
 
    		/**
    * Add a style for tag counter container (with a TAG_CLASSNAME class).
    * It's done only once the page is loaded.
    **/
    		function addStyles() {
    			let style = document.createElement('style');
    			style.type = 'text/css';
 
    			style.innerHTML = "\
            .item-icon ." + TAG_CLASSNAME + " {\
            position: absolute;\
            display: block;\
            right: -4px;\
            top: -4px;\
            padding: 4px;\
            border-radius: 3px;\
            text-align: center;\
            vertical-align: middle;\
            min-width: 12px;\
            font-weight: 700;\
            font-size: 11px;\
            color: gold;\
            background-color: darkgreen\
            }";
 
    			document.getElementsByTagName('head')[0].appendChild(style);
    		}
 
    		function getEntryContainers() {
    			var pathname = window.location.pathname;
    			var search = window.location.search;
    			var searchParams = new URLSearchParams(search);
    			var tbParam = searchParams.get("_tb");
 
    			if (pathname.includes("/entry/") || pathname.includes("/browse.v4.php") || pathname.includes("/browse/calendar/") || pathname.includes("/item/browse/calendar/") || pathname.includes("/item/browse/figure/") || pathname.includes("/item/browse/goods/") || pathname.includes("/item/browse/media/") || tbParam !== null) {
    				var result = document.querySelectorAll("#wide .result:not(.hidden)"); /* encyclopedia entry */ /* search results with filters */ /* calendar page */ /* new calendar page */ /* new figures page */ /* new goods page */ /* new media page */
    				return result;
    			}
 
    			console.log("unsupported getEntryContainers");
    			return document.querySelectorAll(FAKE_CLASS_PLACEHOLDER);
    		}
 
    		/**
    * Check if the current page (intended to be one with search results)
    * is detailed list.
    * The info is taken from GET/query params instead from the page contents.
    **/
    		function isDetailedList() {
    			var search = window.location.search;
    			var searchParams = new URLSearchParams(search);
    			var outputParam = searchParams.get("output"); /* 0 - detailedList, 1,2 - grid, 3 - diaporama */
    			return outputParam == 0;
    		}
 
    		function getItemsFromContainer(entryContainer) {
    			var icons = entryContainer.querySelectorAll(".item-icons .item-icon");
 
    			if (icons.length > 0) {
    				return icons;
    			}
 
    			var pathname = window.location.pathname;
 
    			if (pathname.includes("/browse.v4.php") && isDetailedList()) {
    				return document.querySelectorAll(FAKE_CLASS_PLACEHOLDER); /* search page, detailed list view */
    			}
 
    			console.log("unsupported getItemsFromContainer");
    			return document.querySelectorAll(FAKE_CLASS_PLACEHOLDER);
    		}
 
    		function getTagCounterFromHtml(html) {
    			var parser = new DOMParser();
    			var doc = parser.parseFromString(html, 'text/html');
    			var tagCounterNode = doc.querySelector("div.tbx-target-TAGS .actions > .meta");
    			if (tagCounterNode == null) console.log("No tag counter element on downloaded html.");
    			return tagCounterNode.textContent;
    		}
 
    		function addTagCounterToSearchResult(itemLinkElement, countOfTags) {
    			var tagElement = document.createElement("span");
    			tagElement.setAttribute("class", TAG_CLASSNAME);
    			tagElement.textContent = countOfTags;
    			itemLinkElement.appendChild(tagElement);
    		}
 
    		async function fetchAndHandle(queue) {
    			var resultQueue = [];
 
    			for (var itemElement of queue) {
    				var itemLinkElement = itemElement.firstChild;
    				var entryLink = itemLinkElement.getAttribute("href");
 
    				fetch(entryLink, {
    					headers: {
    						"User-Agent": GM.info.script.name + " " + GM.info.script.version
    					}
    				}).then(function (response) {
    					if (response.ok) {
    						response.text().then(function (html) {
    							var countOfTags = getTagCounterFromHtml(html);
    							addTagCounterToSearchResult(itemLinkElement, countOfTags);
    							pushToTagCounterCache(entryLink, countOfTags);
    						});
    					}
 
    					return Promise.reject(response);
    				}).catch(function (err) {
    					if (err.status == 429) {
    						console.warn('Too many requests. Added the request to fetch later', err.url);
    						resultQueue.push(itemElement);
    						REQUEST_DELAY = REQUEST_DELAY * REQUEST_DELAY_MULTIPLIER;
    						console.info('Increased delay to ' + REQUEST_DELAY);
    					}
    				});
 
    				await sleep(REQUEST_DELAY);
    			}
 
    			return resultQueue;
    		}
 
    		async function main() {
    			var cacheQueue = [];
    			var entryContainers = getEntryContainers();
 
    			entryContainers.forEach(entryContainer => {
    				var itemsElements = getItemsFromContainer(entryContainer);
 
    				itemsElements.forEach(itemElement => {
    					cacheQueue.push(itemElement);
    				});
    			});
 
    			var queue = [];
    			tagCounterCache = await getTagCounterCache();
 
    			for (var itemElement of cacheQueue) {
    				var itemLinkElement = itemElement.firstChild;
    				var entryLink = itemLinkElement.getAttribute("href");
    				var cache = getTagCounterFromTagCounterCache(entryLink);
 
    				if (cache > 0) {
    					addTagCounterToSearchResult(itemLinkElement, cache);
    				} else {
    					queue.push(itemElement);
    				}
    			}
 
    			while (queue.length) {
    				queue = await fetchAndHandle(queue);
    			}
 
    			saveTagCounterCache();
    		}
 
    		/**
    * All variables and methods are set.
    * Enjoy the show.
    **/
    		addStyles();
 
    		main();
    	})();
 
    	const writable_props = [];
 
    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});
 
    	return [];
    }
 
    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});
 
    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }
 
    const app = new App({
        target: document.body,
        props: {
            name: "World"
        }
    });
 
    return app;
 
})();