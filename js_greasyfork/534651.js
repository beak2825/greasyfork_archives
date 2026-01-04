// ==UserScript==
// @name         YouTube Grid Row Controller
// @namespace    https://github.com/HageFX-78
// @version      1.0
// @description  Adds simple buttons to control items per row on Youtube's home feed, works for shorts and news sections too. Buttons can be hidden if needed.
// @author       HageFX78
// @license      MIT
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/534651/YouTube%20Grid%20Row%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/534651/YouTube%20Grid%20Row%20Controller.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configurable options
    const hideControls = GM_getValue('hideControls', false); // set true to hide UI controls, it will use the default values instead

    const transparentButtons = GM_getValue('transparentButtons', false); // set true to make the buttons transparent and less intrusive, only applies if hideControls is false

    const defaultSettingValue = {
        // Default values mainly used when if you want to hide the buttons, change the values to your liking
        content: 4,
        news: 5,
        shorts: 6,
    };

    let currentSettingValues = {
        content: GM_getValue('itemPerRow', defaultSettingValue.content),
        news: GM_getValue('newsPerRow', defaultSettingValue.news),
        shorts: GM_getValue('shortsPerRow', defaultSettingValue.shorts),
    };

    // Styles
    const style = (css) => {
        const el = document.createElement('style');
        el.textContent = css;
        document.head.appendChild(el);
        return el;
    };

    // Some of it maybe irrelevant after so long, will cleanup someday...
    style(`
		${hideControls ? '' : '#chips-content{width: 92% !important;}'}

		.justify-left-custom { justify-content: left !important; }
        .justify-center-custom { justify-content: center !important; }

        ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column] { margin-left: calc(var(--ytd-rich-grid-item-margin) / 2) !important; }
		
		ytd-rich-item-renderer[hidden][is-responsive-grid], [is-slim-media]{ display: block !important; }

		ytd-rich-item-renderer{ margin-bottom: var(--ytd-rich-grid-row-margin) !important; }

		.button-container.ytd-rich-shelf-renderer { display: none !important;  }
		
		#dismissible.ytd-rich-shelf-renderer {
			padding-bottom: 0 !important;
			border-bottom: none !important;
		}
            
        #selected-chip-content{
            width: 0% !important;
        }

        #spacer.ytd-shelf-renderer {
            flex: 9 !important; /* Spacing gets weird in subscription feed page */
        }

        ytd-feed-filter-chip-bar-renderer[frosted-glass-mode=with-chipbar] #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
            flex-direction: row;
        }
		.itemPerRowControl {
            display: flex;
            justify-content: right;
            align-items: center;

            z-index: 2025;
            flex: 1;         
            gap: 10px;
            box-sizing: border-box;
            user-select: none;
			width: 8%;
        }

        .itemPerRowControl button {

            border: none;
            color: var(--yt-spec-text-primary);
            background-color:${transparentButtons ? 'transparent' : 'var(--yt-spec-badge-chip-background)'};
            font-size: 24px;
            
            text-align: center;
            display: inline-block;

            height: 30px;
            aspect-ratio: 1/1;
            border-radius: 50%;
        }

        .itemPerRowControl button:hover {
            background-color: var(--yt-spec-button-chip-background-hover);
            cursor: pointer;
        }
	`);

    const dynamicStyle = style('');

    function updatePageLayout() {
        dynamicStyle.textContent = `
			ytd-rich-grid-renderer {
				--ytd-rich-grid-items-per-row: ${hideControls ? defaultSettingValue.content : currentSettingValues.content} !important;
			}
			ytd-rich-shelf-renderer:not([is-shorts]) {
				--ytd-rich-grid-items-per-row: ${hideControls ? defaultSettingValue.news : currentSettingValues.news} !important;
			}
			ytd-rich-shelf-renderer[is-shorts] {
				--ytd-rich-grid-slim-items-per-row: ${hideControls ? defaultSettingValue.shorts : currentSettingValues.shorts} !important;
                --ytd-rich-grid-items-per-row: ${hideControls ? defaultSettingValue.shorts : currentSettingValues.shorts} !important;
			}
		`;
    }

    function saveValues() {
        GM_setValue('itemPerRow', currentSettingValues.content);
        GM_setValue('newsPerRow', currentSettingValues.news);
        GM_setValue('shortsPerRow', currentSettingValues.shorts);
    }

    function updateAndSave() {
        updatePageLayout();
        saveValues();
    }

    function isCreatorPage() {
        return location.pathname.startsWith('/@');
    }

    function initGlobalWatcher() {
        const targets = [
            {
                selector: '#chips-wrapper',
                type: 'content',
                place: (anchor, control) => anchor.appendChild(control),
            },
            {
                selector: 'ytd-rich-section-renderer #menu-container',
                type: (node) => (node.closest('ytd-rich-section-renderer')?.querySelector('[is-shorts]') ? 'shorts' : 'news'),
                place: (anchor, control) => anchor.parentNode.insertBefore(control, anchor),
            },
            {
                selector: 'ytd-shelf-renderer #title-container.style-scope.ytd-shelf-renderer',
                type: 'content',
                place: (anchor, control) => anchor.appendChild(control),
            },
        ];

        scanExistingAnchors(targets); // Some elements load before observer can be hooked, like the #chips

        const observer = new MutationObserver((muts) => {
            for (const m of muts) {
                for (const node of m.addedNodes) {
                    if (node.nodeType !== 1) continue;

                    for (const t of targets) {
                        const anchor = node.matches(t.selector) ? node : node.querySelector?.(t.selector);

                        if (anchor) tryAttachControl(anchor, t);
                    }
                }
            }
        });

        observer.observe(document.documentElement, { subtree: true, childList: true });
    }

    function tryAttachControl(anchor, t) {
        if (!anchor) return;
        if (isCreatorPage()) return;

        // Prevent duplicates
        if (anchor.parentNode?.querySelector?.('.itemPerRowControl')) return;

        const type = typeof t.type === 'function' ? t.type(anchor) : t.type;
        const control = createControlDivRaw(type);

        // CENTER for #chips-wrapper and the shelf title container
        if (t.selector === '#chips-wrapper') {
            control.classList.add('justify-left-custom');
        } else if (t.selector.startsWith('ytd-shelf-renderer')) {
            control.classList.add('justify-center-custom');
        }

        t.place(anchor, control);
    }

    function createControlDivRaw(type) {
        const controlDiv = document.createElement('div');
        controlDiv.classList.add('style-scope', 'ytd-rich-grid-renderer', 'itemPerRowControl');

        ['-', '+'].forEach((symbol) => {
            const btn = document.createElement('button');
            btn.textContent = symbol;

            btn.addEventListener('click', () => {
                if (symbol === '+') currentSettingValues[type]++;
                else if (currentSettingValues[type] > 1) currentSettingValues[type]--;

                updateAndSave();
            });

            controlDiv.appendChild(btn);
        });

        return controlDiv;
    }

    function scanExistingAnchors(targets) {
        for (const t of targets) {
            document.querySelectorAll(t.selector).forEach((anchor) => {
                tryAttachControl(anchor, t);
            });
        }
    }

    function setupGMMenu() {
        function rebuildButtonStyles(newVal) {
            document.querySelectorAll('.itemPerRowControl button').forEach((btn) => {
                btn.style.backgroundColor = newVal ? 'transparent' : 'var(--yt-spec-badge-chip-background)';
            });
        }

        function applyHideControls(newVal) {
            const controls = document.querySelectorAll('.itemPerRowControl');
            controls.forEach((c) => {
                c.style.display = newVal ? 'none' : 'flex';
            });

            // force layout update
            updatePageLayout();
        }

        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand(`Reset Values`, () => {
                GM_setValue('itemPerRow', defaultSettingValue.content);
                GM_setValue('newsPerRow', defaultSettingValue.news);
                GM_setValue('shortsPerRow', defaultSettingValue.shorts);

                currentSettingValues = { ...defaultSettingValue };
                updatePageLayout();
            });

            GM_registerMenuCommand(`Toggle hideControls [ ${hideControls} ]`, () => {
                let newVal = !GM_getValue('hideControls', false);
                GM_setValue('hideControls', newVal);
                applyHideControls(newVal);
            });

            GM_registerMenuCommand(`Toggle transparentButtons [ ${transparentButtons} ]`, () => {
                let newVal = !GM_getValue('transparentButtons', false);
                GM_setValue('transparentButtons', newVal);
                rebuildButtonStyles(newVal);
            });
        }
    }

    // ----------------------------------- Main Execution -----------------------------------
    setupGMMenu();
    updatePageLayout();

    if (!hideControls) initGlobalWatcher();
})();
