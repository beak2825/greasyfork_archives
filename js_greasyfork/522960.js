// ==UserScript==
// @name         Infinite Craft More Pins & Colored Tabs
// @version      20.1.1
// @namespace    https://github.com/ChessScholar
// @description  Create tabs to group items, color them, with import/export, session restore, and full theme control. Hotkey is Shift+Click.
// @author       ChessScholar (updated by AI)
// @match        https://neal.fun/infinite-craft/
// @icon         https://neal.fun/favicons/infinite-craft.png
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @compatible   chrome
// @license      MIT
// @credits      adrianmgg for original "tweaks" script, Natasquare for the helper script.
// @downloadURL https://update.greasyfork.org/scripts/522960/Infinite%20Craft%20More%20Pins%20%20Colored%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/522960/Infinite%20Craft%20More%20Pins%20%20Colored%20Tabs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class GMValue {
        constructor(key, defaultValue) { this.key = key; this.defaultValue = defaultValue; }
        async set(value) { await GM_setValue(this.key, value); }
        async get() { return await GM_getValue(this.key, this.defaultValue); }
    }

    const VAL_PINNED_SETS = new GMValue('infinitecraft_pinned_sets_v2', {});
    const VAL_PINNED_SETS_ORDER = new GMValue('infinitecraft_pinned_sets_order_v1', []);
    const VAL_SETTINGS = new GMValue('infinitecraft_pinned_sets_settings_v1', {
        expandContainer: false,
        combineColors: true,
        itemSize: 'normal',
        sortBy: 'time',
        sortDir: 'asc'
    });
    const VAL_LAST_VIEW = new GMValue('infinitecraft_pinned_sets_last_view_v1', { selected: [], active: null });
    const VAL_THEME = new GMValue('infinitecraft_theme_v1', 'less-dark');
    const VAL_CONTAINER_HEIGHT = new GMValue('infinitecraft_container_height_v1', '30%');

    function updateAllTabTitleStyles(theme) {
        const titles = document.querySelectorAll('.pinned-set-title');
        const isLight = theme === 'light';
        const color = isLight ? '#111' : '#FFF';
        const shadow = isLight
            ? '-1px -1px 0 rgba(255,255,255,0.7), 1px -1px 0 rgba(255,255,255,0.7), -1px 1px 0 rgba(255,255,255,0.7), 1px 1px 0 rgba(255,255,255,0.7)'
            : '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';

        titles.forEach(title => {
            title.style.color = color;
            title.style.textShadow = shadow;
        });
    }

    async function applyTheme(theme, particlesCanvas) {
        const body = document.body;
        const container = document.querySelector('.container');

        body.classList.remove('dark-mode', 'original-dark-mode', 'less-dark-mode');
        if (container) container.classList.remove('dark-mode', 'original-dark-mode', 'less-dark-mode');

        if (theme === 'helper-dark') {
            body.classList.add('dark-mode');
            if (container) container.classList.add('dark-mode');
        } else if (theme === 'original-dark') {
            body.classList.add('dark-mode', 'original-dark-mode');
            if (container) container.classList.add('dark-mode', 'original-dark-mode');
        } else if (theme === 'less-dark') {
            body.classList.add('less-dark-mode');
            if (container) container.classList.add('less-dark-mode');
        }

        if (particlesCanvas) {
            particlesCanvas.style.display = (theme === 'original-dark') ? '' : 'none';
        }

        updateAllTabTitleStyles(theme);
    }


    async function initialize(ICHelper, v_container, v_sidebar) {
        let settings = await VAL_SETTINGS.get();
        const particlesCanvas = v_container.$refs.particles;
        settings.theme = await VAL_THEME.get();
        await applyTheme(settings.theme, particlesCanvas);

        const el = {
            setup(elem, options) {
                const { style, attrs, dataset, events, classList, children, parent, insertBefore, ...props } = options;
                Object.assign(elem.style, style);
                Object.entries(style?.vars || {}).forEach(([k, v]) => elem.style.setProperty(k, v));
                Object.entries(attrs || {}).forEach(([k, v]) => elem.setAttribute(k, v));
                Object.entries(dataset || {}).forEach(([k, v]) => elem.dataset[k] = v);
                Object.entries(events || {}).forEach(([k, v]) => elem.addEventListener(k, v));
                elem.classList.add(...(classList || []));
                Object.assign(elem, props);
                (children || []).forEach(c => elem.appendChild(c));
                if (parent) { if (insertBefore) parent.insertBefore(elem, insertBefore); else parent.appendChild(elem); }
                return elem;
            },
            create(tagName, options = {}) { return this.setup(document.createElement(tagName), options); },
        };

        const css = `
            .container.less-dark-mode { --border-color: #525252 !important; --item-bg: #18181b !important; --instance-bg: linear-gradient(180deg, #22252b, #18181b 80%) !important; --instance-bg-hover: linear-gradient(180deg, #3d4249, #18181b 80%) !important; --instance-border: #525252 !important; --instance-border-hover: #a3a3a3 !important; --sidebar-bg: #18181b !important; --background-color: #18181b !important; --discoveries-bg-active: #423a24 !important; --text-color: #fff !important; }
            body.less-dark-mode { scrollbar-color: #525252 #262626 !important; }
            .less-dark-mode .save, .less-dark-mode .modal { border: 1px solid var(--border-color) !important; }
            .less-dark-mode .menu { background: var(--sidebar-bg) !important; }
            .less-dark-mode .save:hover { background: var(--instance-bg) !important; }
            .less-dark-mode .save-selected, .less-dark-mode .save-selected:hover { background: var(--instance-bg-hover) !important; border: 1px solid var(--instance-border-hover) !important; }
            .less-dark-mode .save-selected, .less-dark-mode .save-selected .save-name-input { color: var(--text-color) !important; }
            .less-dark-mode .save .save-action-icon, .less-dark-mode .save .save-icon { filter: invert(1) !important; }
            .pinned-set { margin-left: -30px; transition: transform 0.1s ease-in-out, box-shadow 0.2s ease-in-out; }
            .pinned-set:hover { transform: translateY(-2px); }
            .pinned-set.dragging { opacity: 0.4; }
            .drop-placeholder { background: rgba(128, 128, 128, 0.2); border: 2px dashed #888; border-radius: 5px; transform: scale(1.05); }
            .color-picker-sv-plane { cursor: crosshair; position: relative; }
            .picker-cursor { position: absolute; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 1.5px black, inset 0 0 0 1.5px black; transform: translate(-50%, -50%); pointer-events: none; }
            .hue-slider { -webkit-appearance: none; appearance: none; width: 150px; height: 15px; cursor: pointer; background: linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%)); border-radius: 5px; border: 1px solid #555; }
            .hue-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #fff; border: 2px solid #ccc; border-radius: 50%; margin-top: -3.5px; }
            .hue-slider::-moz-range-thumb { width: 15px; height: 15px; background: #fff; border: 2px solid #ccc; border-radius: 50%; }
            .item-container-label-x:hover { color: #ff5555; font-weight: bolder; }
            .container.dark-mode.original-dark-mode { --border-color: #333 !important; --item-bg: #111 !important; --instance-bg: linear-gradient(180deg, #272727, #111 80%) !important; --instance-bg-hover: linear-gradient(180deg, #3b3b3b, #111 80%) !important; --instance-border: #333 !important; --instance-border-hover: #777 !important; --sidebar-bg: #0a0a0a !important; --background-color: #000 !important; --discoveries-bg-active: #2b2413 !important; }
            body.dark-mode.original-dark-mode .sidebar-controls::after { background: linear-gradient(0deg, hsla(0, 0%, 0%, 0), #000 60%) !important; }
            body.dark-mode.original-dark-mode { scrollbar-color: #333 #111 !important; }
            .set-items .item-wrapper { margin: 2px; }
            .item-size-normal .set-items .item { font-size: 13px; padding: 4px 6px 3px; line-height: 1.2em; }
            .item-size-normal .set-items .item-emoji { font-size: 13px; }
            .item-size-small .set-items .item { font-size: 11px; padding: 3px 5px 2px; line-height: 1.1em; }
            .item-size-small .set-items .item-emoji { font-size: 11px; }
            .item-size-tiny .set-items .item { font-size: 9px; padding: 2px 4px 1px; line-height: 1.1em; }
            .item-size-tiny .set-items .item-emoji { font-size: 9px; }
        `;
        el.create('style', { parent: document.head, textContent: css });

        const pinnedTabsContainer = el.create('div', {
            style: { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', position: 'relative', background: 'var(--sidebar-bg)', width: '100%', borderBottom: '1px solid var(--border-color)', zIndex: '1', padding: '5px', gap: '10px' },
        });

        const pinnedItemsContainer = el.create('div', {
            style: { zIndex: '1', padding: '5px', background: 'var(--sidebar-bg)', overflowY: 'auto', position: 'relative', transition: 'background 0.3s' },
        });

        const combinedItemsContainer = el.create('div', {
            parent: pinnedItemsContainer,
            style: { display: 'none', flexWrap: 'wrap' }
        });

        const sidebarInner = v_sidebar.$el.querySelector('.sidebar-inner');
        sidebarInner.insertBefore(pinnedItemsContainer, sidebarInner.firstChild);
        sidebarInner.insertBefore(pinnedTabsContainer, sidebarInner.firstChild);

        const resizer = el.create('div', { style: { width: '100%', height: '5px', cursor: 'row-resize', background: 'var(--border-color)', transition: 'background 0.2s ease' }});
        resizer.addEventListener('mouseover', () => resizer.style.background = '#aaa');
        resizer.addEventListener('mouseout', () => resizer.style.background = 'var(--border-color)');
        sidebarInner.insertBefore(resizer, pinnedItemsContainer.nextSibling);

        function initDrag(e) {
            e.preventDefault();
            const startY = e.clientY;
            const startHeight = pinnedItemsContainer.offsetHeight;

            const doDrag = (e) => {
                const newHeight = startHeight + e.clientY - startY;
                if (newHeight > 50) {
                    pinnedItemsContainer.style.height = `${newHeight}px`;
                    pinnedItemsContainer.style.maxHeight = 'none';
                }
            };
            const stopDrag = async () => {
                document.documentElement.removeEventListener('mousemove', doDrag, false);
                document.documentElement.removeEventListener('mouseup', stopDrag, false);
                await VAL_CONTAINER_HEIGHT.set(pinnedItemsContainer.style.height);
            };
            document.documentElement.addEventListener('mousemove', doDrag, false);
            document.documentElement.addEventListener('mouseup', stopDrag, false);
        }
        resizer.addEventListener('mousedown', initDrag);

        const savedHeight = await VAL_CONTAINER_HEIGHT.get();
        if (savedHeight) pinnedItemsContainer.style.height = savedHeight;


        const defaultColors = ['hsl(240, 70%, 55%)', 'hsl(0, 70%, 55%)', 'hsl(30, 70%, 55%)', 'hsl(120, 70%, 55%)'];

        async function saveLastView() {
            const selected = Array.from(pinnedTabsContainer.querySelectorAll('.selected-set')).map(t => t.dataset.pinnedSet);
            const active = pinnedTabsContainer.querySelector('.active-set')?.dataset.pinnedSet || null;
            await VAL_LAST_VIEW.set({ selected, active });
        }

        function getDialogBaseStyle() {
            const isDark = document.body.classList.contains('dark-mode') || document.body.classList.contains('less-dark-mode');
            return {
                background: isDark ? '#2d2d2d' : '#f0f0f0', color: 'var(--text-color)',
                padding: '20px', border: '1px solid var(--border-color)',
                borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                margin: 'auto',
            };
        }

        function generateRandomColor() {
            const hue = Math.floor(Math.random() * 360);
            return `hsl(${hue}, 70%, 55%)`;
        }

        function darkenColor(colorString, factor = 0.7) {
            if (!colorString) return 'var(--border-color)';
            try {
                const isRgb = colorString.startsWith('rgb');
                const isHsl = colorString.startsWith('hsl');
                if (!isRgb && !isHsl) return 'var(--border-color)';

                const values = colorString.match(/\d+/g).map(Number);
                if (isRgb) {
                    const [r, g, b] = values;
                    return `rgb(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)})`;
                } else { // isHsl
                    const [h, s, l] = values;
                    return `hsl(${h}, ${s}%, ${Math.floor(l * factor)}%)`;
                }
            } catch (e) {
                console.warn("Could not darken color:", colorString, e);
                return '#555'; // Generic dark fallback
            }
        }

        function sortElements(elements, sortBy, sortDir) {
            const dir = sortDir === 'asc' ? 1 : -1;
            return [...elements].sort((a, b) => {
                let valA, valB;
                switch (sortBy) {
                    case 'name':
                        valA = a.text.toLowerCase();
                        valB = b.text.toLowerCase();
                        break;
                    case 'emoji':
                        valA = a.emoji || '';
                        valB = b.emoji || '';
                        break;
                    case 'length':
                        valA = a.text.length;
                        valB = b.text.length;
                        break;
                    case 'time':
                    default:
                        valA = a.time;
                        valB = b.time;
                        break;
                }

                if (valA < valB) return -1 * dir;
                if (valA > valB) return 1 * dir;
                return a.text.toLowerCase().localeCompare(b.text.toLowerCase()); // Secondary sort by name
            });
        }

        async function rerenderSetContainer(setname) {
            const setItemContainer = pinnedItemsContainer.querySelector(`[data-set-items="${CSS.escape(setname)}"]`);
            if (!setItemContainer) return;

            setItemContainer.querySelectorAll('.item-wrapper').forEach(w => w.remove());

            const sets = await VAL_PINNED_SETS.get();
            const elements = sets[setname]?.elements || [];
            const sortedElements = sortElements(elements, settings.sortBy, settings.sortDir);

            for (const element of sortedElements) {
                const elementWrapper = el.create('div', { parent: setItemContainer, classList: ['item-wrapper'], style: { display: 'inline-block' }, dataset: { originSet: setname } });
                const elementElement = ICHelper.createItemElement(element);
                elementWrapper.appendChild(elementElement);
                el.setup(elementElement, {
                    events: {
                        mousedown: async (e) => {
                            if (e.shiftKey && e.button === 0) {
                                e.preventDefault(); e.stopPropagation();
                                const currentSets = await VAL_PINNED_SETS.get();
                                currentSets[setname].elements = currentSets[setname].elements.filter(eObj => eObj.id !== element.id);
                                await VAL_PINNED_SETS.set(currentSets);
                                elementWrapper.remove();
                            }
                        },
                    },
                });
            }
        }

        async function rerenderAllSetContainers() {
            const sets = await VAL_PINNED_SETS.get();
            for (const setname in sets) {
                await rerenderSetContainer(setname);
            }
        }

        async function addElementToSelectedTabs(element) {
            if (!element.id) {
                console.warn("Attempted to add an element without an ID:", element);
                return;
            }
            const activeTab = pinnedTabsContainer.querySelector('.active-set');
            if (!activeTab) {
                alert("No active tab selected for pinning. Click a tab to make it active.");
                return;
            }
            const setname = activeTab.dataset.pinnedSet;
            const sets = await VAL_PINNED_SETS.get();
            const newElement = { id: element.id, text: element.text, emoji: element.emoji, discovery: element.discovery, time: Date.now() };

            if (sets[setname] && !sets[setname].elements.some(e => e.id === newElement.id)) {
                sets[setname].elements.push(newElement);
                await VAL_PINNED_SETS.set(sets);
                await rerenderSetContainer(setname);
            }
        }

        v_sidebar.$el.addEventListener("mousedown", e => { if (e.shiftKey && !e.altKey && e.button === 0) { const item = e.target.closest(".item"); if (!item || e.target.closest('.items-pinned-inner') || e.target.closest('.set-items')) return; e.preventDefault(); e.stopPropagation(); const element = { id: item.getAttribute("data-item-id"), text: item.getAttribute("data-item-text"), emoji: item.getAttribute("data-item-emoji"), discovery: item.hasAttribute("data-item-discovery") }; addElementToSelectedTabs(element); } }, true);
        window.addEventListener("mousedown", e => { if (e.button === 1) { const instance = e.target.closest(".instance"); if (!instance) return; e.preventDefault(); e.stopPropagation(); const elementText = instance.textContent.trim().split(" ").slice(1).join(" "); const elementEmoji = instance.querySelector(".instance-emoji")?.textContent; const gameElement = v_container.items.find(i => i.text === elementText && i.emoji === elementEmoji); if (gameElement) { addElementToSelectedTabs(gameElement); } } }, true);

        function updateHighlights() {
            const allTabs = pinnedTabsContainer.querySelectorAll('.pinned-set');
            const allContainers = pinnedItemsContainer.querySelectorAll('.set-items');

            allTabs.forEach(tab => { tab.style.boxShadow = 'none'; tab.style.outline = 'none'; });
            allContainers.forEach(container => container.style.boxShadow = 'none');

            const activeTab = pinnedTabsContainer.querySelector('.active-set');
            if (activeTab) {
                activeTab.style.boxShadow = `0 0 12px 2px ${activeTab.style.backgroundColor}`;
                const activeContainer = pinnedItemsContainer.querySelector(`[data-set-items="${CSS.escape(activeTab.dataset.pinnedSet)}"]`);
                if (activeContainer) activeContainer.style.boxShadow = 'inset 0 0 0 3px gold';
            }

            pinnedTabsContainer.querySelectorAll('.selected-set:not(.active-set)').forEach(tab => {
                tab.style.boxShadow = `0 0 8px ${tab.style.backgroundColor}`;
            });
        }

        async function updatePinDisplay() {
            const existingCombinedLabel = pinnedItemsContainer.querySelector('.combined-view-label');
            if (existingCombinedLabel) existingCombinedLabel.remove();

            pinnedItemsContainer.style.border = '';
            pinnedItemsContainer.querySelectorAll('.set-items').forEach(c => { c.style.border = ''; c.style.borderRadius = ''; c.style.margin = ''; });

            Array.from(combinedItemsContainer.children).forEach(itemWrapper => {
                const originSet = itemWrapper.dataset.originSet;
                if (originSet) {
                    const originalContainer = pinnedItemsContainer.querySelector(`[data-set-items="${CSS.escape(originSet)}"]`);
                    if (originalContainer) originalContainer.appendChild(itemWrapper);
                }
            });

            const selectedTabs = Array.from(pinnedTabsContainer.querySelectorAll('.selected-set'));
            const useCombinedView = settings.combineColors && selectedTabs.length > 1;

            if (settings.expandContainer && selectedTabs.length > 0) {
                pinnedItemsContainer.style.height = 'auto';
                pinnedItemsContainer.style.maxHeight = 'none';
                pinnedItemsContainer.style.overflowY = 'visible';
            } else {
                const savedHeight = await VAL_CONTAINER_HEIGHT.get();
                pinnedItemsContainer.style.height = savedHeight;
                pinnedItemsContainer.style.maxHeight = 'none';
                pinnedItemsContainer.style.overflowY = 'auto';
            }

            combinedItemsContainer.style.display = 'none';
            pinnedItemsContainer.querySelectorAll('.set-items').forEach(c => c.style.display = 'none');
            combinedItemsContainer.style.paddingTop = '0';

            if (selectedTabs.length === 0) {
                pinnedItemsContainer.style.background = 'var(--sidebar-bg)';
                return;
            }

            if (useCombinedView) {
                const tabNames = selectedTabs.map(tab => tab.dataset.pinnedSet).join(' + ');
                el.create('div', { parent: pinnedItemsContainer, textContent: tabNames, classList: ['combined-view-label'], style: { position: 'absolute', top: '0px', left: '0px', padding: '2px 8px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', fontSize: '11px', fontWeight: 'bold', borderBottomRightRadius: '8px', lineHeight: '1.5', userSelect: 'none', maxWidth: 'calc(100% - 10px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', zIndex: 10 } });
                combinedItemsContainer.style.paddingTop = '24px';

                const displayedItems = new Set();
                combinedItemsContainer.replaceChildren();
                selectedTabs.forEach(tab => {
                    const setname = tab.dataset.pinnedSet;
                    const individualContainer = pinnedItemsContainer.querySelector(`[data-set-items="${CSS.escape(setname)}"]`);
                    if (individualContainer) {
                        Array.from(individualContainer.children).forEach(itemWrapper => {
                            const itemText = itemWrapper.querySelector('.item')?.textContent.trim();
                            if (itemText && !displayedItems.has(itemText)) {
                                displayedItems.add(itemText);
                                combinedItemsContainer.appendChild(itemWrapper);
                            }
                        });
                    }
                });

                const colors = selectedTabs.map(tab => tab.style.backgroundColor);
                if (colors.length > 1) {
                    const step = 100 / colors.length;
                    const gradientStops = colors.map((color, i) => `${color} ${i * step}%, ${color} ${(i + 1) * step}%`).join(', ');
                    pinnedItemsContainer.style.background = `linear-gradient(135deg, ${gradientStops})`;
                } else {
                    pinnedItemsContainer.style.background = colors[0] || 'var(--sidebar-bg)';
                }
                const activeTab = pinnedTabsContainer.querySelector('.active-set');
                pinnedItemsContainer.style.border = `8px solid ${activeTab ? darkenColor(activeTab.style.backgroundColor) : 'var(--border-color)'}`;
                combinedItemsContainer.style.display = 'block';

            } else {
                pinnedItemsContainer.style.background = 'var(--sidebar-bg)';
                selectedTabs.forEach(tab => {
                    const setname = tab.dataset.pinnedSet;
                    const container = pinnedItemsContainer.querySelector(`[data-set-items="${CSS.escape(setname)}"]`);
                    if (container) {
                        const tabColor = tab.style.backgroundColor;
                        container.style.background = tabColor;
                        container.style.border = `4px solid ${darkenColor(tabColor)}`;
                        container.style.borderRadius = '5px';
                        container.style.margin = '2px';
                        container.style.display = 'block';
                    }
                });
            }
        }

        function createColorPicker(setname, setContainer) {
            const hsvToRgb = (h, s, v) => { let r, g, b; const i = Math.floor(h / 60); const f = h / 60 - i; const p = v * (1 - s); const q = v * (1 - f * s); const t = v * (1 - (1 - f) * s); switch (i % 6) { case 0: r = v, g = t, b = p; break; case 1: r = q, g = v, b = p; break; case 2: r = p, g = v, b = t; break; case 3: r = p, g = q, b = v; break; case 4: r = t, g = p, b = v; break; case 5: r = v, g = p, b = q; break; } return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]; };
            const dialog = el.create('dialog', { style: getDialogBaseStyle(), parent: document.body, events: { close: (e) => e.target.remove() } });
            const pickerState = { h: 0, s: 1, v: 1 };

            const svCanvas = el.create('canvas', { attrs: { width: 200, height: 150 }});
            const svCtx = svCanvas.getContext('2d');
            const pickerCursor = el.create('div', { classList: ['picker-cursor'] });
            const svPlane = el.create('div', { classList: ['color-picker-sv-plane'], children: [svCanvas, pickerCursor] });

            function updateSVPlane() {
                svCtx.clearRect(0, 0, svCanvas.width, svCanvas.height);
                const satGrad = svCtx.createLinearGradient(0, 0, svCanvas.width, 0);
                satGrad.addColorStop(0, 'hsl(0, 0%, 100%)');
                satGrad.addColorStop(1, `hsl(${pickerState.h}, 100%, 50%)`);
                svCtx.fillStyle = satGrad;
                svCtx.fillRect(0, 0, svCanvas.width, svCanvas.height);
                const valGrad = svCtx.createLinearGradient(0, 0, 0, svCanvas.height);
                valGrad.addColorStop(0, 'rgba(0,0,0,0)');
                valGrad.addColorStop(1, 'rgba(0,0,0,1)');
                svCtx.fillStyle = valGrad;
                svCtx.fillRect(0, 0, svCanvas.width, svCanvas.height);
            }

            function updateColor() {
                const [r, g, b] = hsvToRgb(pickerState.h, pickerState.s, pickerState.v);
                const color = `rgb(${r}, ${g}, ${b})`;
                previewBox.style.background = color;
                pickerCursor.style.left = `${pickerState.s * svCanvas.width}px`;
                pickerCursor.style.top = `${(1 - pickerState.v) * svCanvas.height}px`;
            }

            const hueSlider = el.create('input', { attrs: { type: 'range', min: 0, max: 360, value: pickerState.h }, classList: ['hue-slider'], events: { input: () => { pickerState.h = hueSlider.value; updateSVPlane(); updateColor(); } } });
            function selectSV(e) { const rect = svCanvas.getBoundingClientRect(); pickerState.s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)); pickerState.v = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height)); updateColor(); }
            svPlane.addEventListener('mousedown', (e) => { e.preventDefault(); selectSV(e); const mouseMove = (ev) => selectSV(ev); const mouseUp = () => { document.removeEventListener('mousemove', mouseMove); document.removeEventListener('mouseup', mouseUp); }; document.addEventListener('mousemove', mouseMove); document.addEventListener('mouseup', mouseUp); });
            const previewBox = el.create('div', { style: { width: '50px', height: '50px', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '10px' } });
            const confirmButton = el.create('button', { textContent: 'Select', style: { marginTop: '10px' }, events: { click: async () => { const [r, g, b] = hsvToRgb(pickerState.h, pickerState.s, pickerState.v); const newColor = `rgb(${r}, ${g}, ${b})`; const sets = await VAL_PINNED_SETS.get(); sets[setname].color = newColor; setContainer.style.backgroundColor = newColor; await VAL_PINNED_SETS.set(sets); updateHighlights(); await updatePinDisplay(); dialog.close(); } } });
            const pickerLayout = el.create('div', { style: { display: 'flex', gap: '15px' }, children: [ svPlane, el.create('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [hueSlider, previewBox, confirmButton] }) ] });
            dialog.appendChild(pickerLayout);
            dialog.showModal();
            updateSVPlane(); updateColor();
        }

        function showNameDialog(title, currentName = '', onConfirm) {
            const dialog = el.create('dialog', { parent: document.body, style: getDialogBaseStyle(), events: { close: e => e.target.remove() }, children: [ el.create('h3', { textContent: title, style: { marginTop: '0', textAlign: 'center' } }), el.create('input', { attrs: { type: 'text', value: currentName, placeholder: 'Set name...' }, dataset: { nameInput: '' }, style: { width: '200px' } }), el.create('div', { style: { display: 'flex', justifyContent: 'space-around', marginTop: '15px' }, children: [ el.create('button', { textContent: 'Cancel', events: { click: () => dialog.close() } }), el.create('button', { textContent: 'Confirm', events: { click: () => { const newName = dialog.querySelector('[data-name-input]').value.trim(); onConfirm(newName); dialog.close(); } } }) ] }) ] });
            dialog.showModal();
            dialog.querySelector('input').focus();
        }

        async function loadPinnedSets(isInitialLoad = false) {
            let selectedToRestore = [];
            let activeToRestore = null;

            if (isInitialLoad) {
                const lastView = await VAL_LAST_VIEW.get();
                selectedToRestore = lastView.selected || [];
                activeToRestore = lastView.active || null;
            } else {
                selectedToRestore = Array.from(pinnedTabsContainer.querySelectorAll('.selected-set')).map(t => t.dataset.pinnedSet);
                activeToRestore = pinnedTabsContainer.querySelector('.active-set')?.dataset.pinnedSet;
            }

            let sets = await VAL_PINNED_SETS.get();
            let setsOrder = await VAL_PINNED_SETS_ORDER.get();

            pinnedTabsContainer.replaceChildren();
            pinnedItemsContainer.querySelectorAll('.set-items, .combined-view-label').forEach(c => c.remove());

            if (setsOrder.length !== Object.keys(sets).length) {
                const existingOrder = setsOrder.filter(name => sets[name]);
                const newKeys = Object.keys(sets).filter(name => !existingOrder.includes(name));
                setsOrder = [...existingOrder, ...newKeys];
                await VAL_PINNED_SETS_ORDER.set(setsOrder);
            }

            let needsSaveAfterMigration = false;
            for (const setname of setsOrder) {
                if (!sets[setname] || !sets[setname].elements || sets[setname].elements.length === 0) continue;
                if (typeof sets[setname].elements[0] === 'string' || typeof sets[setname].elements[0].id === 'undefined') {
                    needsSaveAfterMigration = true;
                    sets[setname].elements = sets[setname].elements.map((elem, index) => {
                        const name = typeof elem === 'string' ? elem : elem.text;
                        const fullElement = v_container.items.find(e => e.text.toLowerCase() === name.toLowerCase());
                        return { id: fullElement?.id, text: fullElement?.text ?? name, emoji: fullElement?.emoji ?? '⬜', discovery: fullElement?.discovery ?? false, time: elem.time ?? (Date.now() + index) };
                    }).filter(e => e.id != null); // Remove elements that couldn't be found
                }
            }
            if(needsSaveAfterMigration) await VAL_PINNED_SETS.set(sets);


            const leftPanel = el.create('div', { parent: pinnedTabsContainer, style: { display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', flexShrink: 0, marginRight: '10px' }});
            const btnStyle = { fontWeight: 'bold', cursor: 'pointer', userSelect: 'none', padding: '5px', borderRadius: '5px', border: '1px solid var(--border-color)', zIndex: '100', flexShrink: '0', height: '25px', display: 'grid', placeContent: 'center' };
            const controlsContainer = el.create('div', { parent: leftPanel, style: { display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' } });

            // ROW 1
            const row1 = el.create('div', { parent: controlsContainer, style: { display: 'flex', gap: '4px' }});
            el.create('button', { parent: row1, textContent: 'All', style: { ...btnStyle, width: 'auto'}, events: { click: () => { pinnedTabsContainer.querySelectorAll('.pinned-set:not(.selected-set)').forEach(sc => sc.classList.add('selected-set')); updateHighlights(); updatePinDisplay(); saveLastView(); } } });
            el.create('button', { parent: row1, textContent: 'None', style: { ...btnStyle, width: 'auto'}, events: { click: () => { pinnedTabsContainer.querySelectorAll('.pinned-set.selected-set').forEach(sc => sc.classList.remove('selected-set', 'active-set')); updateHighlights(); updatePinDisplay(); saveLastView(); } } });

            // ROW 2
            const row2 = el.create('div', { parent: controlsContainer, style: { display: 'flex', gap: '4px' }});
            const sortOptions = { 'time': 'Time', 'name': 'Name', 'emoji': 'Emoji', 'length': 'Length' };
            const sortKeys = Object.keys(sortOptions);
            const sortButton = el.create('button', { parent: row2, textContent: `Sort: ${sortOptions[settings.sortBy]}`, title: `Sort by ${sortOptions[settings.sortBy]}`, style: { ...btnStyle, width: '100%' },
                events: {
                    click: async () => {
                        const currentIndex = sortKeys.indexOf(settings.sortBy);
                        settings.sortBy = sortKeys[(currentIndex + 1) % sortKeys.length];
                        sortButton.textContent = `Sort: ${sortOptions[settings.sortBy]}`;
                        sortButton.title = `Sort by ${sortOptions[settings.sortBy]}`;
                        await VAL_SETTINGS.set(settings);
                        await rerenderAllSetContainers();
                    }
                }
            });

            // ROW 3
            const row3 = el.create('div', { parent: controlsContainer, style: { display: 'flex', gap: '4px', justifyContent: 'center' }});
            el.create('div', { parent: row3, textContent: '➕', title: 'New Tab', style: { ...btnStyle, width: '25px' }, events: { click: () => showNameDialog("Create New Set", '', async (newName) => { if (newName) { const s = await VAL_PINNED_SETS.get(); if (s[newName]) { alert("A set with this name already exists."); return; } const tabCount = Object.keys(s).length; const newColor = tabCount < defaultColors.length ? defaultColors[tabCount] : generateRandomColor(); s[newName] = { elements: [], color: newColor }; await VAL_PINNED_SETS.set(s); let order = await VAL_PINNED_SETS_ORDER.get(); order.push(newName); await VAL_PINNED_SETS_ORDER.set(order); await loadPinnedSets(); } }) } });
            el.create('div', { parent: row3, textContent: '⚙️', title: 'Settings', style: { ...btnStyle, width: '25px' }, events: { click: () => createSettingsDialog().showModal() } });
            const sortDirButton = el.create('button', { parent: row3, textContent: settings.sortDir === 'asc' ? '⬆️' : '⬇️', title: `Sort ${settings.sortDir === 'asc' ? 'Ascending' : 'Descending'}`, style: { ...btnStyle, width: '25px' },
                events: {
                    click: async () => {
                        settings.sortDir = settings.sortDir === 'asc' ? 'desc' : 'asc';
                        sortDirButton.textContent = settings.sortDir === 'asc' ? '⬆️' : '⬇️';
                        sortDirButton.title = `Sort ${settings.sortDir === 'asc' ? 'Ascending' : 'Descending'}`;
                        await VAL_SETTINGS.set(settings);
                        await rerenderAllSetContainers();
                    }
                }
            });

            el.create('div', { parent: leftPanel, textContent: 'Shift+Click to Pin', style: { fontSize: '8px', color: 'grey', fontStyle: 'italic', userSelect: 'none', paddingLeft: '0px', textAlign: 'center', whiteSpace: 'nowrap' }});

            const tabsWrapper = el.create('div', { parent: pinnedTabsContainer, style: { display: 'flex', flexWrap: 'wrap', flex: '1', alignItems: 'flex-start', paddingLeft: '30px' } });

            for (const [index, setname] of setsOrder.entries()) {
                if(!sets[setname]) continue;

                const tabOptionsStyle = { cursor: 'pointer', zIndex: '12', fontSize: '11px' };
                const renameButton = el.create('span', { textContent: '✏️', style: tabOptionsStyle, events: { click: (e) => { e.stopPropagation(); showNameDialog("Rename Set", setname, async (newName) => { if (newName && newName !== setname) { const s = await VAL_PINNED_SETS.get(); if (s[newName]) { alert("A set with this name already exists."); return; } s[newName] = s[setname]; delete s[setname]; await VAL_PINNED_SETS.set(s); let order = await VAL_PINNED_SETS_ORDER.get(); const orderIndex = order.indexOf(setname); if(orderIndex > -1) order[orderIndex] = newName; await VAL_PINNED_SETS_ORDER.set(order); await loadPinnedSets(); } }); } }});
                const deleteButton = el.create('span', { textContent: '❌', style: tabOptionsStyle, events: { click: async (e) => { e.stopPropagation(); if (confirm(`Delete set "${setname}"?`)) { const s = await VAL_PINNED_SETS.get(); delete s[setname]; await VAL_PINNED_SETS.set(s); let order = await VAL_PINNED_SETS_ORDER.get(); await VAL_PINNED_SETS_ORDER.set(order.filter(name => name !== setname)); await loadPinnedSets(); } } } });
                const colorButton = el.create('span', { textContent: '🎨', style: tabOptionsStyle, events: { click: (e) => { e.stopPropagation(); createColorPicker(setname, setContainer); } } });
                const optionsContainer = el.create('div', { style: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '3px', gap: '8px' }, children: [deleteButton, renameButton, colorButton] });
                const tabTitleStyle = { fontWeight: 'bold', userSelect: 'none', zIndex: '11', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' };
                const titleDiv = el.create('div', { textContent: setname, style: tabTitleStyle, classList: ['pinned-set-title'] });

                const setContainer = el.create('div', { parent: tabsWrapper, draggable: true, dataset: { pinnedSet: setname, baseZ: index }, classList: ['pinned-set'], style: { backgroundColor: sets[setname].color || 'var(--sidebar-bg)', padding: '4px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flexShrink: '0', width: '90px', cursor: 'pointer', zIndex: index }, children: [ titleDiv, optionsContainer ] });

                setContainer.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const wasActive = setContainer.classList.contains('active-set');
                    if (e.ctrlKey || e.metaKey) {
                        setContainer.classList.toggle('selected-set');
                        if (wasActive && !setContainer.classList.contains('selected-set')) setContainer.classList.remove('active-set');
                    } else {
                        document.querySelectorAll('.active-set').forEach(t => t.classList.remove('active-set'));
                        if (wasActive) setContainer.classList.remove('selected-set', 'active-set');
                        else setContainer.classList.add('selected-set', 'active-set');
                    }
                    const selectedTabs = pinnedTabsContainer.querySelectorAll('.selected-set');
                    if (selectedTabs.length > 0 && !pinnedTabsContainer.querySelector('.active-set')) {
                        selectedTabs[selectedTabs.length - 1].classList.add('active-set');
                    }
                    document.querySelectorAll('.pinned-set').forEach(tab => tab.style.zIndex = tab.dataset.baseZ);
                    const activeTab = pinnedTabsContainer.querySelector('.active-set');
                    if(activeTab) activeTab.style.zIndex = setsOrder.length + 5;
                    updateHighlights(); updatePinDisplay(); saveLastView();
                });

                setContainer.addEventListener('mouseenter', e => { e.currentTarget.style.zIndex = 999; if (e.currentTarget.classList.contains('selected-set') && !settings.combineColors) { const itemsContainer = pinnedItemsContainer.querySelector(`[data-set-items="${CSS.escape(setname)}"]`); if (itemsContainer) itemsContainer.style.boxShadow = 'inset 0 0 0 3px gold'; } });
                setContainer.addEventListener('mouseleave', e => { const isActive = e.currentTarget.classList.contains('active-set'); e.currentTarget.style.zIndex = isActive ? setsOrder.length + 5 : e.currentTarget.dataset.baseZ; if (!isActive) { const itemsContainer = pinnedItemsContainer.querySelector(`[data-set-items="${CSS.escape(setname)}"]`); if (itemsContainer) itemsContainer.style.boxShadow = 'none'; } });
                setContainer.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', setname); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => e.target.classList.add('dragging'), 0); });
                setContainer.addEventListener('dragend', (e) => e.target.classList.remove('dragging'));
                setContainer.addEventListener('dragover', (e) => e.preventDefault());
                let placeholder = null;
                setContainer.addEventListener('dragenter', (e) => { e.preventDefault(); const targetTab = e.target.closest('.pinned-set'); if (targetTab && targetTab !== placeholder) { placeholder = targetTab; placeholder.classList.add('drop-placeholder'); } });
                setContainer.addEventListener('dragleave', (e) => { e.preventDefault(); if(placeholder && !placeholder.contains(e.relatedTarget)) { placeholder.classList.remove('drop-placeholder'); placeholder = null; } });
                setContainer.addEventListener('drop', async (e) => {
                    e.preventDefault();
                    if(placeholder) placeholder.classList.remove('drop-placeholder');
                    const draggedSetName = e.dataTransfer.getData('text/plain');
                    const targetTab = e.target.closest('.pinned-set');
                    if (targetTab && draggedSetName !== targetTab.dataset.pinnedSet) {
                        let order = await VAL_PINNED_SETS_ORDER.get();
                        const draggedIndex = order.indexOf(draggedSetName);
                        order.splice(draggedIndex, 1);
                        const targetIndex = order.indexOf(targetTab.dataset.pinnedSet);
                        order.splice(targetIndex, 0, draggedSetName);
                        await VAL_PINNED_SETS_ORDER.set(order);
                        await loadPinnedSets();
                    }
                });

                const setItemContainer = el.create('div', { parent: pinnedItemsContainer, dataset: { setItems: setname }, classList: ['set-items'], style: { display: 'none', flexWrap: 'wrap', position: 'relative', paddingTop: '24px', cursor: 'pointer', transition: 'box-shadow 0.2s' },
                    events: {
                        click: (e) => {
                            if (e.target.closest('.item-wrapper') || e.target.closest('.item-container-label')) return;
                            const tabToActivate = pinnedTabsContainer.querySelector(`[data-pinned-set="${CSS.escape(setname)}"]`);
                            if(tabToActivate && !tabToActivate.classList.contains('active-set')) {
                                document.querySelectorAll('.active-set').forEach(t => t.classList.remove('active-set'));
                                tabToActivate.classList.add('selected-set', 'active-set');
                                updateHighlights(); updatePinDisplay(); saveLastView();
                            }
                        }
                    }
                });

                const labelX = el.create('span', { textContent: 'x', classList: ['item-container-label-x'], style: { cursor: 'pointer', paddingRight: '5px' },
                    events: {
                        click: (e) => {
                            e.stopPropagation();
                            const tabToToggle = pinnedTabsContainer.querySelector(`[data-pinned-set="${CSS.escape(setname)}"]`);
                            if (tabToToggle) {
                                tabToToggle.classList.remove('selected-set', 'active-set');
                                const selectedTabs = pinnedTabsContainer.querySelectorAll('.selected-set');
                                if (selectedTabs.length > 0 && !pinnedTabsContainer.querySelector('.active-set')) {
                                    selectedTabs[selectedTabs.length - 1].classList.add('active-set');
                                }
                                updateHighlights(); updatePinDisplay(); saveLastView();
                            }
                        }
                    }
                });

                const labelText = el.create('span', { textContent: setname });
                el.create('div', { parent: setItemContainer, classList: ['item-container-label'], style: { position: 'absolute', top: '0px', left: '0px', padding: '2px 4px 2px 8px', backgroundColor: 'rgba(0, 0, 0, 0.4)', color: 'white', fontSize: '11px', fontWeight: 'bold', borderBottomRightRadius: '8px', lineHeight: '1.5', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '6px' }, children: [labelX, labelText]});

                rerenderSetContainer(setname);
            }

            selectedToRestore.forEach(setName => { const tab = pinnedTabsContainer.querySelector(`[data-pinned-set="${CSS.escape(setName)}"]`); if (tab) tab.classList.add('selected-set'); });
            if (activeToRestore) { const activeTab = pinnedTabsContainer.querySelector(`[data-pinned-set="${CSS.escape(activeToRestore)}"]`); if (activeTab) activeTab.classList.add('selected-set', 'active-set'); }
            updateHighlights(); updatePinDisplay(); updateAllTabTitleStyles(settings.theme); saveLastView();
        }

        function applyItemSize(size) {
            pinnedItemsContainer.classList.remove('item-size-normal', 'item-size-small', 'item-size-tiny');
            pinnedItemsContainer.classList.add(`item-size-${size || 'normal'}`);
        }
        applyItemSize(settings.itemSize);

        function createSettingsDialog() {
            const dialog = el.create('dialog', { parent: document.body, style: { ...getDialogBaseStyle(), minWidth: '320px' }, events: { close: e => e.target.remove() } });
            const createCheckbox = (id, labelText, settingKey) => {
                const checkbox = el.create('input', { attrs: { type: 'checkbox', id }, checked: settings[settingKey] });
                checkbox.addEventListener('change', async () => { settings[settingKey] = checkbox.checked; await VAL_SETTINGS.set(settings); await updatePinDisplay(); });
                const label = el.create('label', { attrs: { for: id }, children: [checkbox, document.createTextNode(` ${labelText}`)] });
                return el.create('div', { children: [label], style: { textAlign: 'left', margin: '8px 0', cursor: 'pointer', display: 'flex', alignItems: 'center' } });
            };

            const itemSizeLabel = el.create('label', { textContent: 'Item Size: ', style: { marginRight: '10px' } });
            const itemSizeSelector = el.create('select', { events: { change: async (e) => { const newSize = e.target.value; settings.itemSize = newSize; await VAL_SETTINGS.set(settings); applyItemSize(newSize); } } });
            const sizes = { 'normal': 'Normal', 'small': 'Small', 'tiny': 'Tiny' };
            for (const [value, text] of Object.entries(sizes)) el.create('option', { parent: itemSizeSelector, attrs: { value }, textContent: text });
            itemSizeSelector.value = settings.itemSize || 'normal';
            const itemSizeContainer = el.create('div', { style: { display: 'flex', alignItems: 'center', margin: '8px 0' }, children: [itemSizeLabel, itemSizeSelector] });

            const themeLabel = el.create('label', { textContent: 'Theme: ', style: { marginRight: '10px' } });
            const themeSelector = el.create('select', { events: { change: async (e) => { const newTheme = e.target.value; await VAL_THEME.set(newTheme); settings.theme = newTheme; await applyTheme(newTheme, particlesCanvas); Object.assign(dialog.style, getDialogBaseStyle()); } } });
            const themes = { 'light': 'Light', 'helper-dark': 'Dark (Helper)', 'less-dark': 'Less Dark', 'original-dark': 'Dark (Original)' };
            for (const [value, text] of Object.entries(themes)) el.create('option', { parent: themeSelector, attrs: { value }, textContent: text });
            themeSelector.value = settings.theme;
            const themeContainer = el.create('div', { style: { display: 'flex', alignItems: 'center', margin: '8px 0' }, children: [themeLabel, themeSelector] });

            const exportButton = el.create('button', { textContent: 'Export Tabs', style: { marginTop: '15px' }, events: { click: async () => { const sets = await VAL_PINNED_SETS.get(); const order = await VAL_PINNED_SETS_ORDER.get(); const dataStr = JSON.stringify({ sets, order }, null, 2); const blob = new Blob([dataStr], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = el.create('a', { attrs: { href: url, download: 'infinite-craft-tabs-backup.json' }, style: { display: 'none' }, parent: document.body }); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); } } });
            const importButton = el.create('button', { textContent: 'Import Tabs', style: { marginTop: '10px' }, events: { click: () => { const input = el.create('input', { attrs: { type: 'file', accept: '.json' }}); input.addEventListener('change', (event) => { const file = event.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = async (e) => { try { const data = JSON.parse(e.target.result); if (data && data.sets && data.order) { if (confirm("Importing will overwrite your current tabs. Are you sure?")) { await VAL_PINNED_SETS.set(data.sets); await VAL_PINNED_SETS_ORDER.set(data.order); await loadPinnedSets(true); dialog.close(); } } else { alert("Invalid file format."); } } catch (err) { alert("Error reading or parsing file."); } }; reader.readAsText(file); } }); input.click(); } } });
            const resetButton = el.create('button', { textContent: 'Reset All Tabs', style: { color: '#fff', backgroundColor: '#d9534f', border: '1px solid #d43f3a', borderRadius: '4px', padding: '5px 10px' } });
            resetButton.addEventListener('click', async () => { if(confirm("Are you sure you want to delete ALL tabs and their contents? This action cannot be undone.")){ await VAL_PINNED_SETS.set({}); await VAL_PINNED_SETS_ORDER.set([]); await loadPinnedSets(); dialog.close(); } });
            const dataContainer = el.create('div', { style: { display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }, children: [importButton, exportButton, resetButton] });

            dialog.append(
                el.create('h3', { textContent: 'Settings', style: { marginTop: '0', textAlign: 'center' } }),
                createCheckbox('setting-expand-container', 'Expand container to show all items', 'expandContainer'),
                createCheckbox('setting-combine-colors', 'Combine selected tabs into one box', 'combineColors'),
                itemSizeContainer,
                el.create('hr', {style: {width: '100%', border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0'}}),
                themeContainer,
                dataContainer,
                el.create('button', { textContent: 'Close', style: { marginTop: '20px', display: 'block', margin: '0 auto' }, events: { click: () => dialog.close() } })
            );

            return dialog;
        }

        loadPinnedSets(true);
    }

    function waitForReady() {
        let attempts = 0;
        const interval = setInterval(() => {
            const v_container = document.querySelector(".container")?.__vue__;
            const v_sidebar = document.querySelector("#sidebar")?.__vue__;
            const ICHelper = unsafeWindow.ICHelper;

            if (v_container && v_sidebar && ICHelper) {
                clearInterval(interval);
                initialize(ICHelper, v_container, v_sidebar);
            } else if (++attempts > 50) {
                clearInterval(interval);
                if (typeof ICHelper === 'undefined') {
                    const installConfirm = confirm( "Grouped Pins and Colored Tabs\n" + "This script requires 'Helper: Not-so-budget Edition' to work.\n\n" + "Would you like to go to the installation page now?");
                    if (installConfirm) window.location.href = 'https://raw.githubusercontent.com/InfiniteCraftCommunity/userscripts/master/userscripts/natasquare/helper/index.user.js';
                } else {
                     console.warn('More Pins & Colored Tabs failed to load: Vue instances not found.');
                }
            }
        }, 100);
    }

    waitForReady();
})();