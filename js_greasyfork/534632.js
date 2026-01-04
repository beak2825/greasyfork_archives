// ==UserScript==
// @name        [Wallhaven] Purity Groups
// @namespace   NooScripts
// @author      NooScripts
// @version     2.1
// @description Organizes thumbnails into collapsible SFW, Sketchy, and NSFW sections with dynamic grid resizing and a floating button to toggle seen wallpapers with persistent state.
// @match       https://wallhaven.cc/*
// @exclude     https://wallhaven.cc/w/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// @license     MIT
// @icon        https://wallhaven.cc/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/534632/%5BWallhaven%5D%20Purity%20Groups.user.js
// @updateURL https://update.greasyfork.org/scripts/534632/%5BWallhaven%5D%20Purity%20Groups.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Constants
    const MIN_THUMB_SIZE = 240; // Min thumbnail size
    const MAX_THUMB_SIZE = 340; // Max thumbnail size
    const GRID_GAP = 2;
    const LINK_OPEN_DELAY = 200; // Delay between opening links in ms

    // Purity colors
    const PURITY_COLORS = {
        'sfw': '#008000', // Green
        'sketchy': '#ffa500', // Orange
        'nsfw': '#ff0000' // Red
    };

    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => context.querySelectorAll(selector);

    // Debounce utility to limit resize event frequency
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Grid Grouper Class
    class GridGrouper {
        constructor(container) {
            this.container = container;
            this.originalOrder = Array.from($$('figure', this.container));
            // Bind resize handler
            this.handleResize = debounce(() => this.groupByPurity(), 100);
            window.addEventListener('resize', this.handleResize);
        }

        calculateColumnsAndThumbSize() {
            const availableWidth = this.container.clientWidth;
            // Estimate columns based on minimum thumb size
            const maxColumns = Math.floor(availableWidth / (MIN_THUMB_SIZE + GRID_GAP));
            // Calculate actual thumb size to fill container
            const totalGapWidth = GRID_GAP * (maxColumns - 1);
            const thumbSize = Math.min(
                MAX_THUMB_SIZE,
                Math.max(MIN_THUMB_SIZE, (availableWidth - totalGapWidth) / maxColumns)
            );
            const columns = Math.max(1, Math.floor(availableWidth / (thumbSize + GRID_GAP)));
            return { columns, thumbSize };
        }

        groupByPurity() {
            if (!this.container) return;

            this.container.innerHTML = '';

            // Define purities in desired order with styling
            const purities = [
                { id: 'sfw', title: 'SFW', className: 'purity-sfw' },
                { id: 'sketchy', title: 'Sketchy', className: 'purity-sketchy' },
                { id: 'nsfw', title: 'NSFW', className: 'purity-nsfw' }
            ];
            const sections = {};
            const labels = {};

            // Create separate labels and containers for each purity
            purities.forEach(purity => {
                // Create a flex container for the header and preview button
                const headerContainer = document.createElement('div');
                headerContainer.className = `header-container-${purity.id}`;
                headerContainer.id = `header-container-${purity.id}`;
                headerContainer.style.display = 'flex';
                headerContainer.style.alignItems = 'center';
                headerContainer.style.width = '100%';
                headerContainer.style.boxSizing = 'border-box';
                headerContainer.style.marginBottom = '5px';
                this.container.appendChild(headerContainer);

                // Create label as a button
                const label = document.createElement('button');
                label.className = `section-label ${purity.className}-label`;
                label.textContent = `${purity.title} ▶`;
                label.setAttribute('aria-expanded', 'true');
                label.setAttribute('aria-controls', `section-${purity.id}`);
                label.style.width = '100%';
                label.style.margin = '0';
                headerContainer.appendChild(label);
                labels[purity.id] = label;

                // Create preview button container
                const groupwallButtonContainer = document.createElement('div');
                groupwallButtonContainer.id = `preview-container-${purity.id}`;
                groupwallButtonContainer.style.flexGrow = '0';
                groupwallButtonContainer.style.marginLeft = '10px';

                // Create preview button
                const groupwallButton = document.createElement('button');
                groupwallButton.id = `preview-button-${purity.id}`;
                groupwallButton.textContent = `Open Unseen`;
                groupwallButton.style.width = '110px';
                groupwallButton.style.padding = '4px 8px';
                groupwallButton.style.backgroundColor = PURITY_COLORS[purity.id];
                groupwallButton.style.color = 'white';
                groupwallButton.style.border = 'none';
                groupwallButton.style.borderRadius = '4px';
                groupwallButton.style.cursor = 'pointer';
                groupwallButton.style.fontSize = '14px';
                groupwallButtonContainer.appendChild(groupwallButton);
                headerContainer.appendChild(groupwallButtonContainer);

                // Create section container
                sections[purity.id] = document.createElement('div');
                sections[purity.id].className = `purity-section ${purity.className}`;
                sections[purity.id].id = `section-${purity.id}`;
                this.container.appendChild(sections[purity.id]);

                // Add click event to toggle collapse/expand
                label.addEventListener('click', () => {
                    const isExpanded = label.getAttribute('aria-expanded') === 'true';
                    sections[purity.id].style.display = isExpanded ? 'none' : 'grid';
                    label.setAttribute('aria-expanded', !isExpanded);
                    label.textContent = `${purity.title} ${isExpanded ? '▶' : '▼'}`;
                });

                // Add click event for preview button with delay
                groupwallButton.addEventListener('click', async () => {
                    const thumbs = sections[purity.id].querySelectorAll('.thumb:not(.thumb-seen)');
                    for (const thumb of thumbs) {
                        const preview = thumb.querySelector('a.preview');
                        if (preview && preview.href) {
                            window.open(preview.href, '_blank');
                            await new Promise(resolve => setTimeout(resolve, LINK_OPEN_DELAY));
                        }
                    }
                });
            });

            // Sort wallpapers into sections
            this.originalOrder.forEach(thumb => {
                const purity = purities.find(p => thumb.classList.contains(`thumb-${p.id}`))?.id || 'sfw';
                sections[purity].appendChild(thumb);
            });

            // Calculate columns and thumb size
            const { columns, thumbSize } = this.calculateColumnsAndThumbSize();

            // Apply grid styling to non-empty sections and hide empty ones
            purities.forEach(purity => {
                if (sections[purity.id].children.length === 0) {
                    sections[purity.id].style.display = 'none';
                    labels[purity.id].style.display = 'none';
                    labels[purity.id].parentNode.style.display = 'none'; // Hide header container
                } else {
                    Object.assign(sections[purity.id].style, {
                        display: 'grid',
                        gap: `${GRID_GAP}px`,
                        gridTemplateColumns: `repeat(${columns}, minmax(${MIN_THUMB_SIZE}px, 1fr))`
                    });
                }
            });

            // Apply thumbnail styling
            $$('[data-wallpaper-id]', this.container).forEach(element => {
                Object.assign(element.style, {
                    width: `${thumbSize}px`,
                    height: `${thumbSize}px`
                });
                const image = $('[data-src]', element);
                if (image) {
                    Object.assign(image.style, {
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                    });
                }
            });

            // Ensure container supports vertical stacking
            Object.assign(this.container.style, {
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                width: '100%',
                boxSizing: 'border-box'
            });
        }

        // Cleanup event listeners
        destroy() {
            window.removeEventListener('resize', this.handleResize);
        }
    }

    // Control Panel Class
    class ControlPanel {
        constructor(grouper) {
            this.grouper = grouper;
            this.panelId = 'wallhaven-control-panel';
            this.seenButtonId = 'toggle-seen-button';
            // Initialize hideSeen from saved state
            this.hideSeen = GM_getValue('hideSeen', false);
        }

        createPanel() {
            const panel = document.createElement('div');
            panel.id = this.panelId;
            panel.innerHTML = `
                <div class="control-group">
                    <button id="${this.seenButtonId}">${this.hideSeen ? 'Show Seen' : 'Hide Seen'}</button>
                </div>
            `;
            document.body.appendChild(panel);

            // Apply initial visibility state
            this.applySeenWallpapersState();

            // Event Listener
            const seenButton = $(`#${this.seenButtonId}`);
            seenButton.addEventListener('click', () => this.toggleSeenWallpapers(seenButton));
        }

        applySeenWallpapersState() {
            // Remove existing style if present
            const existingStyle = $(`style[data-id="hide-seen-style"]`);
            if (existingStyle) existingStyle.remove();

            // Apply or remove visibility for seen wallpapers
            const seenThumbs = $$('figure.thumb.thumb-seen');
            if (this.hideSeen) {
                // Inject CSS rule
                GM_addStyle(`
                    figure.thumb.thumb-seen {
                        display: none !important;
                    }
                `).setAttribute('data-id', 'hide-seen-style');
                // Fallback: directly set style
                seenThumbs.forEach(thumb => {
                    thumb.style.display = 'none';
                });
            } else {
                // Restore default visibility
                seenThumbs.forEach(thumb => {
                    thumb.style.display = '';
                });
            }

            // Re-run grouping to update section visibility
            this.grouper.groupByPurity();
        }

        toggleSeenWallpapers(button) {
            // Toggle the state
            this.hideSeen = !this.hideSeen;

            // Save the new state
            GM_setValue('hideSeen', this.hideSeen);

            // Update button text
            button.textContent = this.hideSeen ? 'Show Seen' : 'Hide Seen';

            // Apply visibility state
            this.applySeenWallpapersState();
        }

        init() {
            this.createPanel();
            const panel = $(`#${this.panelId}`);
            if (panel) {
                Object.assign(panel.style, {
                    position: 'fixed',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: '12px',
                    border: '1px solid #666',
                    borderRadius: '10px',
                    zIndex: '9999'
                });
            }
        }
    }

    // Styles
    GM_addStyle(`
        #wallhaven-control-panel {
            display: flex;
            flex-direction: column;
            min-width: 50px;
        }
        .control-group {
            align-items: center;
        }
        #toggle-seen-button {
            padding: 4px 10px;
            background-color: #444;
            color: #fff;
            border: 1px solid #666;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
        }
        #toggle-seen-button:hover {
            background-color: #555;
        }
        .thumb-listing .thumb,
        .thumb-listing-page .thumb {
            margin: 1px;
        }
        .thumb-listing-page {
            flex-direction: column !important;
            gap: ${GRID_GAP}px;
            width: 100%;
            padding: 0 10px;
            box-sizing: border-box;
        }
        .purity-section {
            width: 100%;
            box-sizing: border-box;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 8px;
            transition: transform 0.2s;
        }
        .purity-sfw {
            border: 2px solid #008000;
        }
        .purity-sketchy {
            border: 2px solid #ffa500;
        }
        .purity-nsfw {
            border: 2px solid #ff0000;
        }
        .section-label {
            background-color: #333;
            color: #fff;
            font-size: 18px;
            padding: 8px 12px;
            margin: 10px 0 5px 0;
            border: none;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            text-align: left;
            width: 100%;
            box-sizing: border-box;
            transition: background-color 0.2s;
        }
        .section-label:hover {
            background-color: #444;
        }
        .purity-sfw-label {
            color: #00cc00;
        }
        .purity-sketchy-label {
            color: #ffcc00;
        }
        .purity-nsfw-label {
            color: #ff3333;
        }
        @media (max-width: 600px) {
            .section-label {
                font-size: 16px;
                padding: 6px 10px;
            }
            .purity-section {
                padding: 10px;
            }
        }
    `);

    // Initialize
    try {
        const container = $('.thumb-listing-page');
        if (container) {
            const grouper = new GridGrouper(container);
            new ControlPanel(grouper).init();
        }
    } catch (error) {
        // Silently handle errors
    }
})();