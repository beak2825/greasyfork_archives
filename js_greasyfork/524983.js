// ==UserScript==
// @name         [sn0tspoon] Neopets Lab Ray Pet Grid
// @description  Displays all your pet portraits in a grid. No more click to scroll!
// @namespace    snotspoon.neocities.org
// @author       nadinejun0
// @version      3.1
// @match        https://www.neopets.com/lab2.phtml
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524983/%5Bsn0tspoon%5D%20Neopets%20Lab%20Ray%20Pet%20Grid.user.js
// @updateURL https://update.greasyfork.org/scripts/524983/%5Bsn0tspoon%5D%20Neopets%20Lab%20Ray%20Pet%20Grid.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // centralized configuration
    const CONFIG = {
        selectors: {
            petList: '#bxlist',
            sliderWrapper: '.bx-wrapper',
            form: 'form[action="process_lab2.phtml"]',
            zapsInfo: 'p[style*="text-align:center"]'
        },
        grid: {
            columns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '15px',
            maxWidth: '800px',
            padding: '15px',
            margin: '20px auto'
        },
        card: {
            width: '180px',
            height: '180px',
            padding: '10px',
            borderRadius: '3px',
            borderColor: '#4169E1',
            borderWidth: '2px',
            backgroundColor: '#F0F8FF',
            selectedBorderColor: '#FFD700',
            selectedBackgroundColor: '#FFFACD',
            hoverBorderColor: '#9370DB',
            hoverBackgroundColor: '#E6E6FA'
        },
        colors: {
            neoBlue: '#4169E1',
            neoGold: '#FFD700',
            neoPurple: '#9370DB',
            neoLightBlue: '#F0F8FF',
            neoLightGold: '#FFFACD',
            neoLightPurple: '#E6E6FA',
            neoText: '#000080',
            neoTextLight: '#4B0082'
        },
        delays: {
            init: 500
        }
    };

    // utility functions
    const Utils = {
        // create element with props and children
        createElement(tag, props = {}, children = []) {
            const element = document.createElement(tag);
            
            // apply styles
            if (props.styles) {
                Object.assign(element.style, props.styles);
            }
            
            // apply attributes
            if (props.attributes) {
                Object.entries(props.attributes).forEach(([key, value]) => {
                    element.setAttribute(key, value);
                });
            }
            
            // apply classes
            if (props.className) {
                element.className = props.className;
            }
            
            // add children
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.textContent = child;
                } else if (child instanceof Node) {
                    element.appendChild(child);
                }
            });
            
            return element;
        },

        // safe query selector
        $(selector, parent = document) {
            return parent.querySelector(selector);
        },

        // safe query selector all
        $$(selector, parent = document) {
            return Array.from(parent.querySelectorAll(selector));
        }
    };

    // pet data extraction and management
    const PetData = {
        // extract unique pets from DOM
        extractUniquePets() {
            const petList = Utils.$(CONFIG.selectors.petList);
            if (!petList) {
                console.log('Lab Ray Grid: Pet list not found');
                return [];
            }

            const petItems = Utils.$$('li', petList);
            const seen = new Set();
            
            return petItems.filter(item => {
                const radio = Utils.$('input[type="radio"]', item);
                if (!radio || seen.has(radio.value)) {
                    return false;
                }
                seen.add(radio.value);
                return true;
            });
        },

        // extract pet info from DOM element
        extractPetInfo(petItem) {
            const div = Utils.$('div', petItem);
            if (!div) return null;

            const img = Utils.$('img', div);
            const radio = Utils.$('input[type="radio"]', div);
            const textElement = Utils.$('b', div);

            if (!img || !radio || !textElement) return null;

            return {
                image: img,
                radio: radio,
                name: textElement.textContent,
                value: radio.value,
                element: petItem
            };
        }
    };

    // pet selection state management
    const PetSelector = {
        selectedPet: null,
        cards: new Map(),

        // select a pet and update UI
        selectPet(petValue) {
            // update original radio
            const originalRadio = Utils.$(`input[value="${petValue}"]`);
            if (originalRadio) {
                originalRadio.checked = true;
            }

            // update visual state for all cards
            this.cards.forEach((card, value) => {
                const overlay = Utils.$('.selected-overlay', card);
                if (value === petValue) {
                    // selected card
                    if (overlay) overlay.style.display = 'block';
                } else {
                    // unselected cards - reset to default state
                    if (overlay) overlay.style.display = 'none';
                    card.style.background = `linear-gradient(135deg, ${CONFIG.card.backgroundColor} 0%, #ffffff 100%)`;
                    card.style.borderColor = CONFIG.card.borderColor;
                }
            });

            this.selectedPet = petValue;
        },

        // register a card
        registerCard(petValue, cardElement) {
            this.cards.set(petValue, cardElement);
        }
    };

    // component builders
    const Components = {
        // create pet image container
        createPetImage(petInfo) {
            const container = Utils.createElement('div', {
                styles: {
                    width: '150px',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px'
                }
            });

            const img = petInfo.image.cloneNode(true);
            Object.assign(img.style, {
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
            });

            container.appendChild(img);
            return container;
        },

        // create pet name label
        createPetLabel(petInfo) {
            return Utils.createElement('div', {
                styles: {
                    fontSize: '11px',
                    textAlign: 'center',
                    color: CONFIG.colors.neoText,
                    fontWeight: 'bold',
                    lineHeight: '1.2',
                    fontFamily: 'Arial, sans-serif',
                    textShadow: '1px 1px 0px rgba(255,255,255,0.8)',
                    wordWrap: 'break-word',
                    overflow: 'hidden'
                }
            }, [petInfo.value]); // use pet value (name) instead of textContent
        },

        // create selection overlay
        createSelectionOverlay() {
            return Utils.createElement('div', {
                className: 'selected-overlay',
                styles: {
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    border: `4px solid ${CONFIG.card.selectedBorderColor}`,
                    borderRadius: CONFIG.card.borderRadius,
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    display: 'none',
                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                }
            });
        },

        // create complete pet card
        createPetCard(petInfo) {
            const card = Utils.createElement('div', {
                styles: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: CONFIG.card.padding,
                    border: `${CONFIG.card.borderWidth} solid ${CONFIG.card.borderColor}`,
                    borderRadius: CONFIG.card.borderRadius,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: `linear-gradient(135deg, ${CONFIG.card.backgroundColor} 0%, #ffffff 100%)`,
                    position: 'relative',
                    width: CONFIG.card.width,
                    height: CONFIG.card.height,
                    fontFamily: 'Arial, sans-serif',
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    boxSizing: 'border-box'
                }
            });

            // add components
            const imageContainer = this.createPetImage(petInfo);
            const label = this.createPetLabel(petInfo);
            const overlay = this.createSelectionOverlay();

            card.appendChild(imageContainer);
            card.appendChild(label);
            card.appendChild(overlay);

            // add event handlers
            this.addCardEventHandlers(card, petInfo);

            // register with selector
            PetSelector.registerCard(petInfo.value, card);

            return card;
        },

        // add event handlers to card
        addCardEventHandlers(card, petInfo) {
            // click handler
            card.addEventListener('click', () => {
                PetSelector.selectPet(petInfo.value);
            });
        }
    };

    // main grid builder
    const GridBuilder = {
        // create the main grid container
        createGrid(petInfos) {
            const grid = Utils.createElement('div', {
                styles: {
                    display: 'grid',
                    gridTemplateColumns: CONFIG.grid.columns,
                    gap: CONFIG.grid.gap,
                    justifyContent: 'center',
                    padding: CONFIG.grid.padding,
                    margin: CONFIG.grid.margin,
                    maxWidth: CONFIG.grid.maxWidth
                }
            });

            // create cards for each pet
            petInfos.forEach(petInfo => {
                const card = Components.createPetCard(petInfo);
                if (card) {
                    grid.appendChild(card);
                }
            });

            return grid;
        },

        // insert grid into page
        insertGrid(grid) {
            const form = Utils.$(CONFIG.selectors.form);
            if (!form) {
                console.log('Lab Ray Grid: Form not found');
                return false;
            }

            const zapsInfo = Utils.$(CONFIG.selectors.zapsInfo, form);
            if (zapsInfo) {
                form.insertBefore(grid, zapsInfo);
            } else {
                form.appendChild(grid);
            }

            return true;
        }
    };

    // main application
    const LabRayGrid = {
        // initialize the grid
        init() {
            console.log('Lab Ray Grid: Initializing...');

            // hide original slider
            this.hideOriginalSlider();

            // extract pet data
            const uniquePets = PetData.extractUniquePets();
            if (uniquePets.length === 0) {
                console.log('Lab Ray Grid: No pets found');
                return;
            }

            // extract pet info
            const petInfos = uniquePets
                .map(pet => PetData.extractPetInfo(pet))
                .filter(info => info !== null);

            if (petInfos.length === 0) {
                console.log('Lab Ray Grid: No valid pet data found');
                return;
            }

            console.log(`Lab Ray Grid: Found ${petInfos.length} unique pets`);

            // create and insert grid
            const grid = GridBuilder.createGrid(petInfos);
            const success = GridBuilder.insertGrid(grid);

            if (success) {
                console.log('Lab Ray Grid: Grid created successfully');
            } else {
                console.log('Lab Ray Grid: Failed to insert grid');
            }
        },

        // hide the original bxSlider
        hideOriginalSlider() {
            const wrapper = Utils.$(CONFIG.selectors.sliderWrapper);
            if (wrapper) {
                wrapper.style.display = 'none';
            }
        }
    };

    // initialize when ready
    function initWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(LabRayGrid.init.bind(LabRayGrid), CONFIG.delays.init);
            });
        } else {
            setTimeout(LabRayGrid.init.bind(LabRayGrid), CONFIG.delays.init);
        }
    }

    // start the application
    initWhenReady();

})();
