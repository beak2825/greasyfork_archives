// ==UserScript==
// @name         kuplaFix Wardrobe Optimizer
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Injects Wardrobe Optimizer into Nitro avatar editor and allows testing with extracted PNG/JSON assets
// @author       auto
// @match        *://kuplahotelli.com/client/dist/index.html*
// @match        *://www.kuplahotelli.com/client/dist/index.html*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545820/kuplaFix%20Wardrobe%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/545820/kuplaFix%20Wardrobe%20Optimizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Inlined Wardrobe Optimizer (trimmed/identical to workspace file) ---

(function () {
    class WardrobeOptimizer {
        constructor(config = {}) {
            this.config = Object.assign({
                itemSelectorCandidates: ['.nitro-item', '[data-nitro]', '[data-nitro-src]'],
                containerSelectors: ['.wardrobe-grid', '.wardrobe-list', '.nitro-wardrobe', '#wardrobe-items', '.items-grid'],
                intersectionRootMargin: '300px', // render slightly before entering viewport
                debug: false
            }, config);

            this.nitroCache = new Map(); // src -> { img, canvas }
            this.visibleItems = new Set();
            this.observer = null;
            this.colorDebounceTimer = null;
            this.currentColorConfig = null;
            this.offscreen = document.createElement('canvas');
            this.offscreenCtx = this.offscreen.getContext('2d');

            // Initialize
            this.init();
        }

        log(...args) {
            if (this.config.debug) console.log('[WardrobeOpt]', ...args);
        }

        waitForElement(selectorOrFn, options = {}) {
            const { timeout = 10000, interval = 100 } = options;
            const isFn = typeof selectorOrFn === 'function';
            const start = Date.now();

            return new Promise((resolve, reject) => {
                const tick = () => {
                    let el = null;
                    try { el = isFn ? selectorOrFn() : document.querySelector(selectorOrFn); } catch (_) {}
                    if (el) return resolve(el);
                    if (Date.now() - start >= timeout) return reject(new Error('waitForElement: timeout'));
                    setTimeout(tick, interval);
                };
                tick();
            });
        }

        findWardrobeContainer() {
            // Try common selectors
            for (const sel of this.config.containerSelectors) {
                const el = document.querySelector(sel);
                if (el) return el;
            }

            // Heuristic: find parent of many nitro items
            for (const candidate of this.config.itemSelectorCandidates) {
                const nodes = Array.from(document.querySelectorAll(candidate));
                if (nodes.length > 10) {
                    // return shared parent
                    return nodes[0].closest('div') || nodes[0].parentElement;
                }
            }

            return null;
        }

        findAllItems(container) {
            const selectors = this.config.itemSelectorCandidates.join(',');
            return Array.from((container || document).querySelectorAll(selectors));
        }

        init() {
            if (this._initialized) return;

            // Observe DOM for wardrobe opening
            const mo = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    for (const n of m.addedNodes) {
                        if (!(n instanceof Element)) continue;
                        if (this.config.containerSelectors.some(s => n.matches && n.matches(s)) ||
                            n.querySelector && this.findAllItems(n).length > 0) {
                            setTimeout(() => this.attachToWardrobe(), 50);
                            return;
                        }
                    }
                }
            });
            mo.observe(document.body, { childList: true, subtree: true });
            this._domObserver = mo;

            // Try attaching immediately
            this.attachToWardrobe();
            // Listen for external color-change events
            document.addEventListener('wardrobe:color-change', (e) => {
                this.log('received wardrobe:color-change', e.detail);
                this.handleColorChange(e.detail);
            });

            this._initialized = true;
            this.log('initialized');
        }

        attachToWardrobe() {
            const container = this.findWardrobeContainer();
            if (!container) {
                this.log('wardrobe container not found');
                return false;
            }

            // Setup virtualization via IntersectionObserver
            if (this.observer) this.observer.disconnect();

            const observer = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    const el = entry.target;
                    if (entry.isIntersecting) {
                        this.visibleItems.add(el);
                        this.renderItem(el).catch(err => this.log('render error', err));
                    } else {
                        this.visibleItems.delete(el);
                        // optionally unload heavy resources - keep cache but remove DOM canvas
                        this.unrenderItem(el);
                    }
                }
            }, {
                root: container,
                rootMargin: this.config.intersectionRootMargin,
                threshold: 0.01
            });

            this.observer = observer;

            const items = this.findAllItems(container);
            if (items.length === 0) {
                this.log('no wardrobe items found in container');
            }

            // Add will-change to improve composition and avoid forced reflows
            try {
                container.style.willChange = 'transform, opacity';
            } catch (_) {}

            // Observe each item
            items.forEach(item => {
                // mark items for plugin use
                item.dataset.wardrobeOptimized = '1';
                // ensure minimal style to host image/canvas
                item.style.position = item.style.position || 'relative';
                // Avoid reflow when toggling visibility
                if (!item.querySelector('.wardrobe-opt-canvas')) {
                    const holder = document.createElement('div');
                    holder.className = 'wardrobe-opt-canvas';
                    holder.style.position = 'absolute';
                    holder.style.inset = '0';
                    holder.style.pointerEvents = 'none';
                    holder.style.display = 'flex';
                    holder.style.alignItems = 'center';
                    holder.style.justifyContent = 'center';
                    item.appendChild(holder);
                }
                observer.observe(item);
            });

            this.log('attached to wardrobe, items observed:', items.length);
            return true;
        }

        async renderItem(item) {
            const src = this.getNitroSrcFromItem(item);
            if (!src) return;

            // Use cached rendered element if available
            const cache = this.nitroCache.get(src);
            if (cache && cache.rendered && !this.currentColorConfig) {
                this.applyRenderedToItem(item, cache.rendered);
                return;
            }

            // Load/parse underlying image
            let asset = cache && cache.asset ? cache.asset : null;
            if (!asset) {
                asset = await this.loadNitroAsset(src).catch(err => {
                    this.log('loadNitroAsset failed', src, err);
                    return null;
                });
                if (!asset) return;
                this.nitroCache.set(src, Object.assign(cache || {}, { asset }));
            }

            // Render with current color config (if any)
            const rendered = await this.renderAssetWithColor(asset, this.currentColorConfig);
            // store rendered in cache if no color applied
            if (!this.currentColorConfig) {
                const entry = this.nitroCache.get(src) || {};
                entry.rendered = rendered;
                this.nitroCache.set(src, entry);
            }

            this.applyRenderedToItem(item, rendered);
        }

        unrenderItem(item) {
            // remove heavy DOM children (canvas/img) but keep cache
            const holder = item.querySelector('.wardrobe-opt-canvas');
            if (!holder) return;
            holder.innerHTML = '';
        }

        getNitroSrcFromItem(item) {
            // Look for attributes commonly used
            const attrs = ['data-nitro-src', 'data-nitro', 'data-src', 'data-image', 'data-img'];
            for (const a of attrs) {
                if (item.hasAttribute && item.hasAttribute(a)) return item.getAttribute(a);
            }
            // maybe background-image style contains url(...)
            try {
                const bg = getComputedStyle(item).backgroundImage;
                if (bg && bg !== 'none') {
                    const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
                    if (m && m[1]) return m[1];
                }
            } catch (_) {}

            // fallback: look for child img
            const img = item.querySelector && item.querySelector('img');
            if (img && img.src) return img.src;

            return null;
        }

        async loadNitroAsset(src) {
            // If src is data URL or direct image url, create Image
            if (!src) throw new Error('no-src');

            // Quick heuristic: if looks like an image
            if (/\.(png|jpg|jpeg|webp|svg)(\?|$)/i.test(src) || src.startsWith('data:')) {
                const img = await this.loadImage(src);

                // try to find an accompanying JSON metadata file (same basename)
                try {
                    const jsonUrl = src.replace(/(\.[^.?#]+)([?#].*)?$/,'') + '.json';
                    const res = await fetch(jsonUrl, { method: 'GET', cache: 'force-cache' });
                    if (res && res.ok) {
                        const j = await res.json().catch(()=>null);
                        if (j && j.spritesheet) {
                            // load the image referenced in JSON if different
                            const metaImage = j.meta && j.meta.image ? new URL(j.meta.image, jsonUrl).toString() : src;
                            const sheetImg = metaImage === src ? img : await this.loadImage(metaImage);
                            return { type: 'spritesheet', img: sheetImg, json: j };
                        }
                    }
                } catch (_) {}

                return { type: 'image', img };
            }

            // Otherwise try fetching and searching for image url inside .nitro textual response
            try {
                const res = await fetch(src, { cache: 'force-cache' });
                const ct = res.headers.get('content-type') || '';
                if (ct.indexOf('image/') === 0) {
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const img = await this.loadImage(url);
                    return { type: 'image', img, blobUrl: url };
                }

                const contentTypeJson = ct.indexOf('application/json') === 0 || ct.indexOf('text/json') === 0;
                if (contentTypeJson) {
                    const j = await res.json().catch(()=>null);
                    if (j && j.spritesheet && j.meta && j.meta.image) {
                        const metaImage = new URL(j.meta.image, src).toString();
                        const img = await this.loadImage(metaImage);
                        return { type: 'spritesheet', img, json: j };
                    }
                }

                const text = await res.text();
                // attempt to find a url(...) reference inside
                const m = text.match(/url\(["']?([^"')]+)["']?\)/i);
                if (m && m[1]) {
                    const img = await this.loadImage(m[1]);
                    return { type: 'image', img };
                }

                // fallback: treat raw text as not directly renderable; create placeholder
                this.log('nitro file fetched but no image url detected, using placeholder for', src);
                const placeholder = await this.createPlaceholderCanvas(64, 64, 'N');
                return { type: 'canvas', canvas: placeholder };
            } catch (err) {
                this.log('error fetching nitro src', src, err);
                // fallback placeholder
                const placeholder = await this.createPlaceholderCanvas(64, 64, '?');
                return { type: 'canvas', canvas: placeholder };
            }
        }

        loadImage(src) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = (e) => reject(new Error('image-load-failed:' + src));
                img.src = src;
            });
        }

        createPlaceholderCanvas(w, h, text) {
            const c = document.createElement('canvas');
            c.width = w; c.height = h;
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#ddd'; ctx.fillRect(0,0,w,h);
            ctx.fillStyle = '#888'; ctx.font = Math.floor(w/2) + 'px sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(text || 'N', w/2, h/2);
            return c;
        }

        async renderAssetWithColor(asset, colorConfig) {
            // Normalize to canvas
            let srcCanvas;
            if (asset.type === 'canvas') {
                srcCanvas = asset.canvas;
            } else if (asset.type === 'image') {
                const img = asset.img;
                const c = document.createElement('canvas');
                c.width = img.naturalWidth || img.width;
                c.height = img.naturalHeight || img.height;
                const ctx = c.getContext('2d');
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img, 0, 0);
                srcCanvas = c;
            } else if (asset.type === 'spritesheet') {
                // compose frames according to JSON metadata
                const composed = await this.composeFromSpritesheet(asset);
                srcCanvas = composed;
            } else {
                // unknown asset
                srcCanvas = await this.createPlaceholderCanvas(64, 64, '?');
            }

            if (!colorConfig) {
                // no tinting requested - return cloned canvas
                const out = document.createElement('canvas');
                out.width = srcCanvas.width; out.height = srcCanvas.height;
                const outCtx = out.getContext('2d');
                outCtx.imageSmoothingEnabled = false;
                outCtx.drawImage(srcCanvas, 0, 0);
                return out;
            }

            // Apply color/tint using offscreen canvas to avoid creating many canvases
            const w = srcCanvas.width, h = srcCanvas.height;
            this.offscreen.width = w; this.offscreen.height = h;
            const ctx = this.offscreenCtx;
            ctx.clearRect(0,0,w,h);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(srcCanvas, 0, 0);

            // If colorConfig has multiple passes (e.g., primary/secondary), apply simple tint approach
            // If the asset was a spritesheet we may have per-layer tints in colorConfig.layers
            if (asset.type === 'spritesheet' && asset.json) {
                // colorConfig.layers expected to be object mapping asset keys (e.g. 'h_lay_...') to colors
                if (colorConfig && colorConfig.layers && typeof colorConfig.layers === 'object') {
                    // apply per-pixel tint per layer: easiest is to recompose with tints, using json assets
                    try {
                        const recomposed = await this.composeFromSpritesheet(asset, colorConfig.layers);
                        // draw recomposed into offscreen then copy
                        ctx.clearRect(0,0,w,h);
                        ctx.drawImage(recomposed, 0, 0);
                    } catch (e) { this.log('per-layer tint failed', e); }
                } else if (colorConfig && colorConfig.tint) {
                    try {
                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.fillStyle = colorConfig.tint;
                        ctx.fillRect(0,0,w,h);
                        ctx.globalCompositeOperation = 'source-over';
                    } catch (e) { this.log('tint failed', e); }
                }
            } else {
                if (colorConfig && colorConfig.tint) {
                    try {
                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.fillStyle = colorConfig.tint;
                        ctx.fillRect(0,0,w,h);
                        ctx.globalCompositeOperation = 'source-over';
                    } catch (e) { this.log('tint failed', e); }
                }
            }

            // Return a cloned canvas to avoid accidental sharing
            const out = document.createElement('canvas');
            out.width = w; out.height = h;
            const outCtx = out.getContext('2d');
            outCtx.imageSmoothingEnabled = false;
            outCtx.drawImage(this.offscreen, 0, 0);
            return out;
        }

        applyRenderedToItem(item, renderedCanvas) {
            const holder = item.querySelector('.wardrobe-opt-canvas');
            if (!holder) return;
            holder.innerHTML = '';
            renderedCanvas.style.maxWidth = '100%';
            renderedCanvas.style.maxHeight = '100%';
            renderedCanvas.style.imageRendering = 'pixelated';
            renderedCanvas.style.pointerEvents = 'none';
            holder.appendChild(renderedCanvas);
        }

        handleColorChange(colorConfig) {
            // Debounce rapid changes
            this.currentColorConfig = colorConfig;
            if (this.colorDebounceTimer) clearTimeout(this.colorDebounceTimer);
            this.colorDebounceTimer = setTimeout(() => {
                this.batchUpdateVisibleItems();
            }, 120);
        }

        async batchUpdateVisibleItems() {
            const items = Array.from(this.visibleItems);
            this.log('batch updating', items.length, 'items');
            // Render visible items in small batches to avoid jank
            const batchSize = 8;
            for (let i = 0; i < items.length; i += batchSize) {
                const batch = items.slice(i, i + batchSize);
                await Promise.all(batch.map(it => this.renderItem(it)));
                // yield to event loop to keep UI responsive
                await new Promise(r => requestAnimationFrame(r));
            }
        }

        async composeFromSpritesheet(asset, layerTints) {
            // asset: { img, json }
            const j = asset.json;
            const img = asset.img;
            if (!j || !j.spritesheet || !j.spritesheet.frames) {
                return await this.createPlaceholderCanvas(64,64,'?');
            }

            // determine canvas size from meta
            const meta = j.spritesheet.meta || j.meta || {};
            const size = meta.size || (meta.frameSize ? meta.frameSize : { w: img.width, h: img.height });
            const w = size.w || img.width; const h = size.h || img.height;

            const out = document.createElement('canvas');
            out.width = w; out.height = h;
            const ctx = out.getContext('2d');
            ctx.imageSmoothingEnabled = false;

            // frames keys are like hat_U_botohat_h_lay_ha_6540_2_0
            const frames = j.spritesheet.frames;
            // sort keys to ensure deterministic order when layering
            const keys = Object.keys(frames).sort();

            for (const key of keys) {
                const f = frames[key];
                if (!f || !f.frame) continue;
                const fr = f.frame;
                // draw the frame from the spritesheet
                try {
                    ctx.drawImage(img, fr.x, fr.y, fr.w, fr.h, fr.x, fr.y, fr.w, fr.h);

                    // apply tint for this layer if provided
                    if (layerTints && layerTints[key]) {
                        ctx.save();
                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.fillStyle = layerTints[key];
                        ctx.fillRect(fr.x, fr.y, fr.w, fr.h);
                        ctx.restore();
                    }
                } catch (e) {
                    this.log('compose frame failed', key, e);
                }
            }

            return out;
        }

        // Public API to force re-optimise (e.g., after wardrobe data changes)
        async refresh() {
            const container = this.findWardrobeContainer();
            if (!container) return;
            const items = this.findAllItems(container);
            // unobserve previous and reattach
            if (this.observer) this.observer.disconnect();
            items.forEach(it => {
                it.dataset.wardrobeOptimized = '0';
            });
            this.attachToWardrobe();
        }

        destroy() {
            if (this.observer) this.observer.disconnect();
            if (this._domObserver) this._domObserver.disconnect();
            this.nitroCache.clear();
            this.visibleItems.clear();
            this.log('destroyed');
            this._initialized = false;
        }
    }

    // Expose globally
    if (typeof window !== 'undefined') {
        window.WardrobeOptimizer = WardrobeOptimizer;
        // Auto-init in browser pages after DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                try { window.wardrobeOptimizer = new WardrobeOptimizer(); } catch (e) { console.warn(e); }
            });
        } else {
            try { window.wardrobeOptimizer = new WardrobeOptimizer(); } catch (e) { console.warn(e); }
        }
    }
})();

    // --- End inlined optimizer ---

    // Userscript-specific bootstrap: allow configuring a base URL for extracted assets.
    // Set ASSET_BASE_URL to your hosted folder containing extracted sprite png/jsons.
    const ASSET_BASE_URL = 'https://your-host.example.com/extracted_assets'; // CHANGE THIS for testing

    // Wait for the optimizer to exist and then monkeypatch loadNitroAsset to try the ASSET_BASE_URL
    (async function bootstrap() {
        const start = Date.now();
        while (!window.WardrobeOptimizer && Date.now() - start < 10000) {
            await new Promise(r => setTimeout(r, 100));
        }
        if (!window.WardrobeOptimizer) {
            console.warn('[kuplaFix Wardrobe] WardrobeOptimizer not available');
            return;
        }

        // monkeypatch to attempt loading json/png from ASSET_BASE_URL when original fails
        const proto = window.WardrobeOptimizer.prototype;
        if (!proto) return;
        if (!proto._orig_loadNitroAsset) proto._orig_loadNitroAsset = proto.loadNitroAsset;

        proto.loadNitroAsset = async function(src) {
            try {
                return await proto._orig_loadNitroAsset.call(this, src);
            } catch (e) {
                // continue to try ASSET_BASE_URL
            }

            try {
                const basename = (src.split('/').pop() || src).replace(/\.[^/.]+$/, '');
                const jsonUrl = ASSET_BASE_URL.replace(/\/$/, '') + '/' + basename + '.json';
                const res = await fetch(jsonUrl, { cache: 'force-cache' });
                if (res && res.ok) {
                    const j = await res.json();
                    const metaImage = j.meta && j.meta.image ? new URL(j.meta.image, jsonUrl).toString() : (ASSET_BASE_URL.replace(/\/$/, '') + '/' + basename + '.png');
                    const img = await this.loadImage(metaImage);
                    return { type: 'spritesheet', img: img, json: j };
                }
            } catch (err) {
                console.warn('[kuplaFix Wardrobe] ASSET_BASE_URL load failed', err);
            }

            // rethrow original failure if all else fails
            throw new Error('loadNitroAsset: failed for ' + src);
        };

        // Ensure single instance and enable debug for testing
        try { window.wardrobeOptimizer && window.wardrobeOptimizer.destroy(); } catch(_){}
        window.wardrobeOptimizer = new window.WardrobeOptimizer({ debug: true });
        console.log('[kuplaFix Wardrobe] Initialized with ASSET_BASE_URL=' + ASSET_BASE_URL);
    })();

})();
