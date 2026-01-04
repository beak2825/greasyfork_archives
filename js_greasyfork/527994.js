// ==UserScript==
// @name         Twitch Pokemon Community Game Helper - NO TIMER
// @namespace    http://tampermonkey.net/
// @version      19
// @description  Twitch PokéBall Drag and Drop to chat! !pokecatch <balltype> Pokemoncommunitygame Timer and Spawn Helper. Pokemon stats and more!
// @match        https://www.twitch.tv/*
// @icon         https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527994/Twitch%20Pokemon%20Community%20Game%20Helper%20-%20NO%20TIMER.user.js
// @updateURL https://update.greasyfork.org/scripts/527994/Twitch%20Pokemon%20Community%20Game%20Helper%20-%20NO%20TIMER.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class PokeballHelper {
        constructor() {
            this.catchBalls = {
                dollars: { command: '$', tooltip: 'Poke Dollars', image: 'https://i.postimg.cc/T20dR1qH/f547e065261b657c49d5702826b0deca.png', quantity: 0 },
                check: { command: '!pokecheck', tooltip: 'Poke Check', image: 'https://i.postimg.cc/0N7vhyyn/ea9752334aa08543e2f148c0a903719e.png', quantity: 0 },
                poke: { command: '!pokecatch', tooltip: 'Poke Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/poke_ball.png', quantity: 0 },
                great: { command: '!pokecatch greatball', tooltip: 'Great Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/great_ball.png', quantity: 0 },
                ultra: { command: '!pokecatch ultraball', tooltip: 'Ultra Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/ultra_ball.png', quantity: 0 },
                premier: { command: '!pokecatch premierball', tooltip: 'Premier Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/premier_ball.png', quantity: 0 },
                basic: { command: '!pokecatch basicball', tooltip: 'Basic Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/basic_ball.png', quantity: 0 },
                heavy: { command: '!pokecatch heavyball', tooltip: 'Heavy Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/heavy_ball.png', quantity: 0 },
                feather: { command: '!pokecatch featherball', tooltip: 'Feather Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/feather_ball.png', quantity: 0 },
                timer: { command: '!pokecatch timerball', tooltip: 'Timer Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/timer_ball.png', quantity: 0 },
                quick: { command: '!pokecatch quickball', tooltip: 'Quick Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/quick_ball.png', quantity: 0 },
                nest: { command: '!pokecatch nestball', tooltip: 'Nest Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/nest_ball.png', quantity: 0 },
                fast: { command: '!pokecatch fastball', tooltip: 'Fast Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/fast_ball.png', quantity: 0 },
                heal: { command: '!pokecatch healball', tooltip: 'Heal Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/heal_ball.png', quantity: 0 },
                repeat: { command: '!pokecatch repeatball', tooltip: 'Repeat Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/repeat_ball.png', quantity: 0 },
                friend: { command: '!pokecatch friendball', tooltip: 'Friend Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/friend_ball.png', quantity: 0 },
                frozen: { command: '!pokecatch frozenball', tooltip: 'Frozen Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/frozen_ball.png', quantity: 0 },
                night: { command: '!pokecatch nightball', tooltip: 'Night Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/night_ball.png', quantity: 0 },
                phantom: { command: '!pokecatch phantomball', tooltip: 'Phantom Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/phantom_ball.png', quantity: 0 },
                cipher: { command: '!pokecatch cipherball', tooltip: 'Cipher Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/cipher_ball.png', quantity: 0 },
                magnet: { command: '!pokecatch magnetball', tooltip: 'Magnet Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/magnet_ball.png', quantity: 0 },
                net: { command: '!pokecatch netball', tooltip: 'Net Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/net_ball.png', quantity: 0 },
                luxury: { command: '!pokecatch luxuryball', tooltip: 'Luxury Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/luxury_ball.png', quantity: 0 },
                stone: { command: '!pokecatch stoneball', tooltip: 'Stone Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/stone_ball.png', quantity: 0 },
                level: { command: '!pokecatch levelball', tooltip: 'Level Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/level_ball.png', quantity: 0 },
                clone: { command: '!pokecatch cloneball', tooltip: 'Clone Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/clone_ball.png', quantity: 0 },
                sun: { command: '!pokecatch sunball', tooltip: 'Sun Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/sun_ball.png', quantity: 0 },
                fantasy: { command: '!pokecatch fantasyball', tooltip: 'Fantasy Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/fantasy_ball.png', quantity: 0 },
                mach: { command: '!pokecatch machball', tooltip: 'Mach Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/mach_ball.png', quantity: 0 },
                geo: { command: '!pokecatch geoball', tooltip: 'Geo Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/geo_ball.png', quantity: 0 },
                dive: { command: '!pokecatch diveball', tooltip: 'Dive Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/dive_ball.png', quantity: 0 },
                master: { command: '!pokecatch masterball', tooltip: 'Master Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/master_ball.png', quantity: 0 },
                cherish: { command: '!pokecatch cherishball', tooltip: 'Cherish Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/cherish_ball.png', quantity: 0 },
                greatCherish: { command: '!pokecatch greatcherishball', tooltip: 'Great Cherish', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/great_cherish_ball.png', quantity: 0 },
                ultraCherish: { command: '!pokecatch ultracherishball', tooltip: 'Ultra Cherish', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/ultra_cherish_ball.png', quantity: 0 }
            };

            this.shopBalls = {
                pokeball: { command: '!pokeshop pokeball', tooltip: 'Poke Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/poke_ball.png' },
                great: { command: '!pokeshop greatball', tooltip: 'Great Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/great_ball.png' },
                ultra: { command: '!pokeshop ultraball', tooltip: 'Ultra Ball', image: 'https://poketwitch.bframework.de/static/twitchextension/items/ball/ultra_ball.png' },
                gift: { command: '!pokegift', tooltip: 'Poke Gift', image: 'https://i.postimg.cc/CxNNP2Zz/Pngtree-gift-box-3d-illustration-6508903.png' },
                v5: { command: ' 5', tooltip: '5', image: 'https://i.postimg.cc/wM8LT5tC/pngaaa-com-3588470.png' },
                v10: { command: ' 10', tooltip: '10', image: 'https://i.postimg.cc/NjJXrv97/pngaaa-com-2133853.png' },
                v25: { command: ' 25', tooltip: '25', image: 'https://i.postimg.cc/wTFySYV8/pngaaa-com-1433934.png' },
                v50: { command: ' 50', tooltip: '50', image: 'https://i.postimg.cc/bNqSCw19/pngaaa-com-973335.png' }
            };
this.currentTab = 'catch';
this.allPokemonList = null;
this.isDragging = false;
this.startX = 0;
this.startY = 0;
this.containerStartLeft = 0;
this.containerStartTop = 0;
this.wasDragging = false;

// Bind drag methods.
this.dragStart = this.dragStart.bind(this);
this.drag = this.drag.bind(this);
this.dragEnd = this.dragEnd.bind(this);

// Initialize UI and observers.
this.init();
this.gridContainer = document.getElementById('grid-container');
this.tooltip = null;
this.initIntersectionObserver();
this.initInventoryObserver();
}

initIntersectionObserver() {
    const lazyImages = document.querySelectorAll('img.lazy');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.addEventListener('load', () => {
                    img.classList.add('fade-in', 'visible');
                });
                obs.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => observer.observe(img));
}

init() {
    this.setupStyles();
    this.waitForChat().then(() => {
        this.createInterface();
        // Removed timer element creation.
        this.addEventListeners();
        this.renderGrid();
        this.initSearchButtons();
        this.imageUpdateStarted = false;
        // Removed spawn timer update.
        this.updateInventoryFromDOM();
    });
}

handleSearch(query) {
    switch (this.currentTab) {
        case 'advanced':
            this.searchAdvancedPokemon(query);
            break;
        case 'browse':
            this.renderBrowseGrid();
            break;
        default:
            this.filterGrid();
    }
}

initSearchButtons() {
    document.querySelectorAll('.pball-search-container').forEach(container => {
        const input = container.querySelector('.pball-search');
        if (!input || container.dataset.initialized) return;

        const btnContainer = document.createElement('div');
        btnContainer.className = 'search-buttons';

        const enterButton = Object.assign(document.createElement('button'), {
            className: 'search-enter-button',
            innerHTML: '✔',
            title: 'Search (Enter)',
            onclick: () => this.handleSearch(input.value.trim())
        });

        const clearButton = Object.assign(document.createElement('button'), {
            className: 'pball-clear-btn',
            innerHTML: '×',
            title: 'Clear search',
            style: 'display: none;',
            onclick: () => {
                input.value = '';
                input.focus();
                this.handleSearch('');
                clearButton.style.display = 'none';
            }
        });

        input.addEventListener('input', () => {
            clearButton.style.display = input.value ? 'flex' : 'none';
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') enterButton.click();
        });

        btnContainer.append(enterButton, clearButton);
        container.append(btnContainer);
        container.dataset.initialized = true;
    });
}

createInterface() {
    let inventoryDisplay = document.getElementById('inventory-display');
    if (!inventoryDisplay) {
        inventoryDisplay = document.createElement('div');
        inventoryDisplay.id = 'inventory-display';
        Object.assign(inventoryDisplay.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            padding: '10px',
            zIndex: '9999'
        });
        document.body.appendChild(inventoryDisplay);
    }
    inventoryDisplay.innerHTML = `
        <h3>Inventory</h3>
        <div id="dollars-display">Poke Dollars: 0</div>
        <ul id="balls-list"></ul>
    `;
}

loadPosition() {
    const savedPos = localStorage.getItem('pballPosition');
    if (savedPos) {
        const { x, y } = JSON.parse(savedPos);
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;
    }
}

dragStart(e) {
    e.preventDefault();
    this.wasDragging = false;
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = this.container.getBoundingClientRect();
    const origLeft = rect.left;
    const origTop = rect.top;

    const onMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            this.wasDragging = true;
        }
        this.container.style.left = `${origLeft + deltaX}px`;
        this.container.style.top = `${origTop + deltaY}px`;
    };

    const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        const ballImg = e.target.closest('.pball-item img');
        if (ballImg) {
            ballImg.style.cursor = 'grab';
        }
    };

    const ballImg = e.target.closest('.pball-item img');
    if (ballImg) {
        ballImg.style.cursor = 'grabbing';
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
}

drag(e) {
    this.container.classList.remove('dragging');
    e.preventDefault();
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    if (!this.isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        this.isDragging = true;
    }
    if (this.isDragging) {
        let newX = this.containerStartLeft + dx;
        let newY = this.containerStartTop + dy;
        const chatWindow = document.querySelector('.chat-window');
        if (chatWindow) {
            const chatRect = chatWindow.getBoundingClientRect();
            const ballRect = this.container.getBoundingClientRect();
            newX = Math.max(chatRect.left, Math.min(newX, chatRect.right - ballRect.width));
            newY = Math.max(chatRect.top, Math.min(newY, chatRect.bottom - ballRect.height));
        }
        requestAnimationFrame(() => {
            this.container.style.left = `${newX}px`;
            this.container.style.top = `${newY}px`;
        });
    }
}

dragEnd(e) {
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('mouseup', this.dragEnd);
    if (this.isDragging) {
        this.wasDragging = true;
        const left = this.container.offsetLeft;
        const top = this.container.offsetTop;
        localStorage.setItem('pballPosition', JSON.stringify({ x: left, y: top }));
    }
    this.container.style.transition = '';
}

setupStyles() {
  const style = document.createElement('style');
  style.textContent = `
  /* ============================================
     Ultra Stunning UI & Theme – Dark Transparent with Soft White Illuminations
     ============================================ */

  /*--------------------------------------------------
    Import Fonts
  --------------------------------------------------*/
  @import url('https://fonts.googleapis.com/css2?family=Segment7Standard&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

  /*--------------------------------------------------
    Global Variables & Base Styles
  --------------------------------------------------*/
  :root {
    --color-primary: rgba(255, 255, 255, 0.8);
    --color-secondary: rgba(255, 255, 255, 0.8);
    --color-accent: rgba(255, 255, 255, 0.6);
    --color-dark: #1c1c1e;
    --color-darker: #141414;
    --color-card: rgba(20, 20, 20, 0.8);
    --color-border: rgba(255, 255, 255, 0.1);
    --color-glass: rgba(255, 255, 255, 0.05);
    --gradient-accent: linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2));
    --gradient-bg: radial-gradient(circle at top left, rgba(10,10,10,1), rgba(0,0,0,1));
    --color-text: #fefefe;
    --font-base: 'Roboto', sans-serif;
    --font-led: 'Segment7Standard', monospace;
    --font-label: 'Press Start 2P', cursive;
    --font-size-base: clamp(0.9rem, 1vw + 0.8rem, 1.1rem);
    --border-radius-small: 4px;
    --border-radius-medium: 12px;
    --border-radius-large: 16px;
    --spacing-small: 8px;
    --spacing-medium: 16px;
    --spacing-large: 24px;
    --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-medium: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --box-shadow-light: 0 2px 12px rgba(0, 0, 0, 0.4);
    --box-shadow-heavy: 0 4px 20px rgba(0, 0, 0, 0.6);
    --backdrop-blur: blur(10px);
    --neon-glow: drop-shadow(0 0 8px rgba(255,255,255,0.7)) drop-shadow(0 0 8px rgba(255,255,255,0.7));
    --soft-glow: drop-shadow(0 0 10px rgba(255,255,255,0.8));
    --breakpoint-md: 768px;
    --breakpoint-sm: 600px;
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: var(--font-base);
    transition: background var(--transition-fast), color var(--transition-fast);
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: var(--gradient-bg);
    color: var(--color-text);
    font-size: var(--font-size-base);
    line-height: 1.5;
  }

  /*--------------------------------------------------
    Scrollbar Styles
  --------------------------------------------------*/
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--color-darker);
    border-radius: var(--border-radius-medium);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--color-dark);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.3);
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--color-border) var(--color-darker);
  }

  /*--------------------------------------------------
    Main UI Components
  --------------------------------------------------*/
  .pball-container {
    position: fixed;
    bottom: calc(var(--spacing-large) + 50px);
    right: var(--spacing-medium);
    z-index: 10000;
    pointer-events: none;
    transform: scale(1);
    transform-origin: top right;
    width: fit-content;
    height: fit-content;
  }
  .pball-container > * {
    pointer-events: auto;
  }
  .pball-button {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform var(--transition-fast), filter var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pball-button img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    transition: transform var(--transition-fast), filter var(--transition-fast);
  }
  .pball-button:hover,
  .pball-button:focus-visible {
    transform: scale(1.25) rotate(3deg);
    filter: var(--soft-glow);
    outline: none;
  }
  .pball-button:hover img,
  .pball-button:focus-visible img {
    transform: scale(1.1);
  }

  /*--------------------------------------------------
    Panel & Tab System
  --------------------------------------------------*/
  .pball-panel {
    position: absolute;
    bottom: calc(100% + var(--spacing-small));
    right: 0;
    width: 340px;
    height: 500px;
    min-width: 300px;
    min-height: 300px;
    overflow: auto;
    background: var(--color-card);
    backdrop-filter: var(--backdrop-blur);
    border-radius: var(--border-radius-large);
    border: 1px solid var(--color-border);
    box-shadow: var(--box-shadow-heavy);
    opacity: 0;
    visibility: hidden;
    transform: translateY(var(--spacing-small));
    transition: opacity var(--transition-medium), transform var(--transition-medium), visibility var(--transition-medium);
  }
  .pball-panel.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  .pball-tabs {
    display: flex;
    background: var(--color-darker);
    border-bottom: 1px solid var(--color-border);
    border-top-left-radius: var(--border-radius-large);
    border-top-right-radius: var(--border-radius-large);
    overflow: hidden;
  }
  .pball-tab {
    position: relative;
    flex: 1;
    padding: var(--spacing-small);
    text-align: center;
    font-size: 15px;
    cursor: pointer;
    color: var(--color-text);
    transition: background var(--transition-fast), color var(--transition-fast);
  }
  .pball-tab.active::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 60%;
    height: 3px;
    background: var(--color-primary);
    box-shadow: 0 0 12px var(--color-primary);
    border-radius: 2px;
    transform: translateX(-50%);
  }

  /*--------------------------------------------------
    Search & Input Components
  --------------------------------------------------*/
  .pball-search-container {
    position: relative;
    margin: var(--spacing-medium);
    background: var(--color-card);
    backdrop-filter: var(--backdrop-blur);
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--color-border);
    overflow: hidden;
  }
  .pball-search {
    width: 100%;
    padding: calc(var(--spacing-small) + 2px) var(--spacing-medium);
    padding-right: 70px;
    border: none;
    background: transparent;
    color: var(--color-text);
    font-size: 15px;
    outline: none;
  }
  .search-buttons {
    position: absolute;
    right: var(--spacing-small);
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    gap: var(--spacing-small);
  }

  /*--------------------------------------------------
    Grid Layouts & Item Cards
  --------------------------------------------------*/
  .pball-grid {
    padding: var(--spacing-medium);
    display: grid;
    gap: var(--spacing-medium);
    max-height: 320px;
    overflow-y: auto;
  }
  .pball-panel.shop .pball-grid,
  .pball-panel.catch-shop .pball-grid {
    grid-template-columns: repeat(3, minmax(80px, 1fr));
    justify-content: center;
  }
  .pball-grid.ball-items {
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    justify-items: center;
  }

  /*--------------------------------------------------
    Item Cards & Catch Tab Overrides
  --------------------------------------------------*/
  .pball-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 50%;
    padding: var(--spacing-small);
    transition: transform var(--transition-fast);
  }
  .pball-item img {
    width: 40px;
    height: 40px;
    transition: transform var(--transition-fast);
    cursor: grab;
  }
  .pball-item img:hover,
  .pball-item img:focus-visible {
    transform: scale(1.2);
    outline: none;
  }
  .pball-item img:active,
  .pball-item img.grabbing {
    filter: var(--neon-glow);
    animation: neonPulse 0.26s infinite alternate;
  }
  @keyframes neonPulse {
    0% {
      filter: drop-shadow(0 0 8px rgba(255,255,255,0.7)) drop-shadow(0 0 8px rgba(255,255,255,0.7));
    }
    100% {
      filter: drop-shadow(0 0 12px rgba(255,255,255,0.7)) drop-shadow(0 0 12px rgba(255,255,255,0.7));
    }
  }
  .pball-item .pball-label {
    margin-top: var(--spacing-small);
    font-size: 14px;
    color: var(--color-text);
    text-align: center;
  }
  .catch-shop .pball-item {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .catch-shop .pball-item img {
    margin-right: var(--spacing-small);
  }
  .catch-shop .pball-item .pball-label {
    margin-top: 0;
    text-align: left;
  }

  /*--------------------------------------------------
    Pokémon Card Styles - Transparent Version
  --------------------------------------------------*/
  .pokemon-card {
    background: transparent !important;
    border-radius: 12px;
    padding: 10px;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .pokemon-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(255,255,255,0.5);
  }
  .dex-number {
    position: absolute;
    top: 6px;
    left: 8px;
    font-weight: bold;
    background: rgba(0, 0, 0, 0.4);
    padding: 4px 8px;
    border-radius: 8px;
    color: #fff;
  }
  .pokemon-image {
    max-width: 100px;
    max-height: 100px;
    object-fit: contain;
    transition: transform var(--transition-fast);
    background: transparent !important;
  }
  .pokemon-card:hover .pokemon-image,
  .pokemon-card:hover .pball-label,
  .pball-item:hover img {
    filter: drop-shadow(0px 0px 10px rgba(255,255,255,0.8));
    transition: filter var(--transition-fast);
  }

  /*--------------------------------------------------
    Utility Classes
  --------------------------------------------------*/
  .spinner {
    margin: 1.5rem auto;
    border: 4px solid var(--color-border);
    border-top: 4px solid var(--color-primary);
    border-radius: 50%;
    width: 2.8rem;
    height: 2.8rem;
    animation: spin 1s linear infinite;
  }
  .animate-fadeIn {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.5s forwards;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /*--------------------------------------------------
    Responsive Adjustments for Auto-Alignment
  --------------------------------------------------*/
  @media (max-width: var(--breakpoint-md)) {
    .pball-panel {
      width: 90%;
      height: auto;
      bottom: var(--spacing-medium);
      right: var(--spacing-medium);
    }
  }
  `;
  document.head.appendChild(style);
}

// -----------------------------
// Helper: Debounce Function
// -----------------------------
debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// -----------------------------
// Wait for Chat Input to be Available
// -----------------------------
async waitForChat() {
  return new Promise((resolve) => {
    const chatSelector = '[data-test-selector="chat-input"]';
    if (document.querySelector(chatSelector)) {
      return resolve();
    }
    const observer = new MutationObserver((mutations, obs) => {
      if (document.querySelector(chatSelector)) {
        obs.disconnect();
        resolve();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

// -----------------------------
// Create Interface Elements
// -----------------------------
createInterface() {
  this.container = document.createElement('div');
  this.container.className = 'pball-container';
  this.button = this.createMainButton();
  this.panel = this.createPanel();
  this.container.append(this.button, this.panel);
  document.body.appendChild(this.container);
}

// -----------------------------
// Create Main Button (Static)
// -----------------------------
createMainButton() {
  const button = document.createElement('div');
  button.className = 'pball-button';

  const icon = document.createElement('img');
  // Use the static pokeball image
  icon.src = this.catchBalls.poke.image;
  icon.style.width = '46px';
  icon.style.height = '46px';
  icon.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';

  button.appendChild(icon);
  this.buttonIcon = icon;
  return button;
}

// -----------------------------
// Create Panel with Tabs, Search, and Grid
// -----------------------------
createPanel() {
  const panel = document.createElement('div');
  panel.className = 'pball-panel';
  panel.draggable = false;

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'pball-tabs';

  const createTab = (name, isActive = false) => {
    const tab = document.createElement('div');
    tab.className = `pball-tab${isActive ? ' active' : ''}`;
    tab.textContent = name;
    tab.dataset.tab = name.toLowerCase();
    tab.addEventListener('click', () => {
      this.switchTab(name.toLowerCase());
    });
    return tab;
  };

  tabsContainer.appendChild(createTab('Catch', true));
  tabsContainer.appendChild(createTab('Shop'));
  tabsContainer.appendChild(createTab('Pokemon'));
  tabsContainer.appendChild(createTab('Moves'));
  tabsContainer.appendChild(createTab('Advanced'));

  const searchContainer = document.createElement('div');
  searchContainer.className = 'pball-search-container';

  this.searchInput = document.createElement('input');
  this.searchInput.type = 'text';
  this.searchInput.className = 'pball-search';
  this.searchInput.placeholder = 'Search...';
  this.searchInput.setAttribute('aria-label', 'Search Pokémon');

  this.clearBtn = document.createElement('button');
  this.clearBtn.setAttribute('aria-label', 'Clear Search');

  searchContainer.append(this.searchInput, this.clearBtn);

  this.gridContainer = document.createElement('div');
  this.gridContainer.className = 'pball-grid';

  this.tabContainers = {};
  ['catch', 'shop', 'pokemon', 'moves', 'advanced'].forEach(tabName => {
    const container = document.createElement('div');
    container.className = 'tab-content';
    container.dataset.tab = tabName;
    container.style.display = tabName === 'catch' ? 'block' : 'none';
    this.tabContainers[tabName] = container;
    this.gridContainer.appendChild(container);
  });

  const footer = document.createElement('div');
  Object.assign(footer.style, {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    padding: '4px 12px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontSize: '15px',
    color: '#666',
    textAlign: 'center'
  });

  const message = document.createTextNode('Like the extension? ');
  const cashTag = document.createElement('span');
  cashTag.textContent = '$yeetsquadcuz';
  Object.assign(cashTag.style, {
    color: '#888',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center'
  });
  cashTag.onmouseenter = () => cashTag.style.color = '#aaa';
  cashTag.onmouseleave = () => cashTag.style.color = '#888';

  const cashLogo = document.createElement('img');
  cashLogo.src = 'https://i.postimg.cc/qq9LWcjm/pngegg.png';
  Object.assign(cashLogo.style, {
    width: '14px',
    height: '14px',
    marginLeft: '4px'
  });
  cashTag.appendChild(cashLogo);

  cashTag.addEventListener('click', () => {
    const audio = new Audio('https://www.myinstants.com/media/sounds/yeet.mp3');
    audio.volume = 0.1;
    audio.play();
  });

  footer.appendChild(message);
  footer.appendChild(cashTag);

  panel.append(tabsContainer, searchContainer, this.gridContainer, footer);
  return panel;
}

renderGrid() {
  // Cache control elements if they exist
  const movesControls = document.getElementById('moves-controls');
  const pokemonControls = document.getElementById('pokemon-controls');

  // Only remove controls if needed
  if (movesControls && this.currentTab !== 'moves') {
    movesControls.remove();
  }
  if (pokemonControls && this.currentTab !== 'pokemon') {
    pokemonControls.remove();
  }

  // Clear existing classes to avoid duplication
  this.gridContainer.classList.remove('ball-items', 'search-results');

  if (this.currentTab === 'advanced') {
    this.gridContainer.classList.add('search-results');
    this.renderAdvancedInstruction();
  } else if (this.currentTab === 'pokemon') {
    this.gridContainer.classList.add('search-results');
    this.renderPokemon();
  } else if (this.currentTab === 'moves') {
    this.gridContainer.classList.add('search-results');
    this.renderMoves();
  } else {
    // For "catch" and "shop" tabs
    this.gridContainer.classList.add('ball-items');
    // Clear out the container
    this.gridContainer.innerHTML = '';

    const balls = this.currentTab === 'catch' ? this.catchBalls : this.shopBalls;
    const fragment = document.createDocumentFragment();

    Object.entries(balls).forEach(([key, ball]) => {
      const item = document.createElement('div');
      item.className = 'pball-item';
      item.dataset.label = ball.tooltip.toLowerCase();

      const img = document.createElement('img');
      img.src = ball.image;
      img.dataset.ballType = ball.command;
      img.draggable = true;

      const label = document.createElement('div');
      label.className = 'pball-label';
      label.textContent = ball.tooltip;

      item.append(img, label);
      fragment.appendChild(item);
    });

    this.gridContainer.appendChild(fragment);
    this.filterGrid();
  }
}

renderMoves() {
  // Clear the grid container.
  this.gridContainer.innerHTML = '';
  // Render the custom controls panel above the grid.
  this.renderMovesControls();

  // Try to load from localStorage first.
  const cachedMoves = localStorage.getItem('movesList');
  if (cachedMoves) {
    this.movesList = JSON.parse(cachedMoves);
    this.renderMovesGrid();
  } else if (!this.movesList) {
    this.gridContainer.innerHTML += '<div class="spinner"></div>';
    fetch('https://pokeapi.co/api/v2/move?limit=1000')
      .then(response => response.json())
      .then(data => {
        this.movesList = data.results;
        // Cache the moves list in localStorage.
        localStorage.setItem('movesList', JSON.stringify(data.results));
        this.renderMovesGrid();
      })
      .catch(err => {
        this.gridContainer.innerHTML = `<div style="padding:12px; color: var(--text-light);">Error loading moves list</div>`;
      });
  } else {
    // Use the already fetched moves list.
    this.renderMovesGrid();
  }
}


renderMovesControls() {
  let controlsContainer = document.getElementById('moves-controls');
  if (!controlsContainer) {
    controlsContainer = document.createElement('div');
    controlsContainer.id = 'moves-controls';
    Object.assign(controlsContainer.style, {
      display: 'flex',
      flexWrap: 'nowrap',
      justifyContent: 'center', // Changed to center
      alignItems: 'center',
      marginBottom: '10px',
      backgroundColor: '#202020',
      color: '#fff',
      padding: '3px',
      borderRadius: '5px',
      gap: '4px',
      overflowX: 'auto',
      width: '100%' // Ensure full width for proper centering
    });
    this.gridContainer.parentNode.insertBefore(controlsContainer, this.gridContainer);
  }
  controlsContainer.innerHTML = '';

  // --- Filter Buttons ---
  const filterOptions = ['All', 'Physical', 'Special', 'Status'];
  const filterGroup = document.createElement('div');
  filterGroup.style.display = 'flex';
  filterGroup.style.gap = '4px';
  filterGroup.style.margin = '0';
  filterOptions.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.dataset.filter = option.toLowerCase();
    Object.assign(btn.style, {
      backgroundColor: '#202020',
      color: '#fff',
      border: '1px solid #666',
      borderRadius: '3px',
      padding: '2px 4px',
      cursor: 'pointer',
      fontSize: '10px',
      height: '24px',
      transition: 'background-color 0.2s ease',
      whiteSpace: 'nowrap'
    });
    btn.addEventListener('click', () => {
      Array.from(filterGroup.children).forEach(child => {
        child.style.backgroundColor = '#202020';
      });
      btn.style.backgroundColor = '#444';
      this.selectedDamageFilter = btn.dataset.filter;
      this.renderMovesGrid();
    });
    filterGroup.appendChild(btn);
  });
  controlsContainer.appendChild(filterGroup);

  // --- Sort Dropdown ---
  const sortContainer = document.createElement('div');
  sortContainer.style.display = 'flex';
  sortContainer.style.alignItems= 'center';
  sortContainer.style.gap = '3px';
  const sortLabel = document.createElement('label');
  sortLabel.textContent = 'Sort:';
  Object.assign(sortLabel.style, {
    fontSize: '10px',
    color: '#fff',
    whiteSpace: 'nowrap',
    marginLeft: '8px' // Added spacing between filter buttons and sort
  });
  const sortSelect = document.createElement('select');
  sortSelect.id = 'moves-sort';
  Object.assign(sortSelect.style, {
    backgroundColor: '#202020',
    color: '#fff',
    border: '1px solid #666',
    borderRadius: '3px',
    padding: '2px',
    fontSize: '10px',
    height: '24px',
    cursor: 'pointer',
    minWidth: '72px'
  });
  sortSelect.innerHTML = `
    <option value="name-asc">A–Z</option>
    <option value="name-desc">Z–A</option>
  `;
  sortSelect.addEventListener('change', () => {
    this.renderMovesGrid();
  });
  sortContainer.appendChild(sortLabel);
  sortContainer.appendChild(sortSelect);
  controlsContainer.appendChild(sortContainer);
}

// Render the moves grid using the custom controls (all moves displayed, with search highlighting)
renderMovesGrid() {
  this.gridContainer.innerHTML = '';
  this.gridContainer.classList.add('browse-container');
  const query = this.searchInput.value.trim().toLowerCase();

  // Get the selected damage filter from the buttons (default to 'all' if not set)
  const damageFilter = this.selectedDamageFilter || 'all';
  const sortOption = document.getElementById('moves-sort')?.value || 'name-asc';

  // Filter moves by search query.
  let filtered = this.movesList.filter(move => move.name.includes(query));

  // Further filter by damage class if not set to 'all'
  if (damageFilter !== 'all') {
    filtered = filtered.filter(move => {
      if (this.moveDetailCache && this.moveDetailCache.has(move.url)) {
        const moveData = this.moveDetailCache.get(move.url);
        return moveData.damage_class.name === damageFilter;
      }
      // Include moves without loaded details by default.
      return true;
    });
  }

  // Sort moves alphabetically.
  if (sortOption === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'name-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  // Build the grid using a document fragment.
  const fragment = document.createDocumentFragment();
  filtered.forEach(move => {
    const tile = document.createElement('div');
    tile.className = 'browse-tile';
    tile.dataset.label = move.name.toLowerCase();

    // Card container for move info.
    const content = document.createElement('div');
    content.className = 'move-card';
    Object.assign(content.style, {
      padding: '12px',
      borderRadius: '12px',
      background: 'var(--background-darker)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out'
    });

    // Hover glow effect.
    content.addEventListener('mouseenter', () => {
      content.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.6)';
      content.style.transform = 'scale(1.05)';
    });
    content.addEventListener('mouseleave', () => {
      content.style.boxShadow = '0 0 0px rgba(255, 255, 255)';
      content.style.transform = 'scale(1)';
    });

    // Highlight matching search text in move title.
    let titleText = move.name;
    if (query) {
      const regex = new RegExp(`(${query})`, 'gi');
      titleText = move.name.replace(regex, '<mark>$1</mark>');
    }
    const title = document.createElement('div');
    title.className = 'move-title';
    Object.assign(title.style, {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: 'var(--text-glow)',
      textShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
      textAlign: 'center'
    });
    title.innerHTML = titleText;

    // Container for badges.
    const badgeContainer = document.createElement('div');
    badgeContainer.className = 'badge-container';
    Object.assign(badgeContainer.style, {
      display: 'flex',
      gap: '8px'
    });

    content.append(title, badgeContainer);
    tile.appendChild(content);

    // Click event to switch to advanced view.
    tile.addEventListener('click', (e) => {
      e.stopPropagation();
      this.panel.classList.add('active');
      this.changeTab('advanced');
      this.searchInput.value = move.name;
      this.searchAdvancedMove(move.name);
    });

    // Fetch move details for badges using caching.
    if (this.moveDetailCache && this.moveDetailCache.has(move.url)) {
      const moveData = this.moveDetailCache.get(move.url);
      const typeBadge = this.createBadge(moveData.type.name, this.getTypeColor(moveData.type.name));
      const damageColor = moveData.damage_class.name === 'physical' ? '#F08030' :
                          moveData.damage_class.name === 'special' ? '#6890F0' : '#A8A878';
      const damageBadge = this.createBadge(moveData.damage_class.name, damageColor);
      badgeContainer.append(typeBadge, damageBadge);
    } else {
      fetch(move.url)
        .then(response => response.json())
        .then(moveData => {
          if (!this.moveDetailCache) this.moveDetailCache = new Map();
          this.moveDetailCache.set(move.url, moveData);
          const typeBadge = this.createBadge(moveData.type.name, this.getTypeColor(moveData.type.name));
          const damageColor = moveData.damage_class.name === 'physical' ? '#F08030' :
                              moveData.damage_class.name === 'special' ? '#6890F0' : '#A8A878';
          const damageBadge = this.createBadge(moveData.damage_class.name, damageColor);
          badgeContainer.append(typeBadge, damageBadge);
        })
        .catch(err => {
          console.error('Error fetching move details for grid tile:', err);
        });
    }
    fragment.appendChild(tile);
  });
  this.gridContainer.appendChild(fragment);

  if (filtered.length === 0) {
    this.gridContainer.innerHTML = '<div style="padding:12px; color: var(--text-light); text-align: center;">No moves match your search.</div>';
  }
}

// -----------------------------
// Advanced Move Details Section
// -----------------------------
async searchAdvancedMove(moveName) {
  try {
    const normalizedMove = moveName.trim().toLowerCase();
    const response = await fetch(`https://pokeapi.co/api/v2/move/${normalizedMove}`);
    if (!response.ok) throw new Error('Move not found');
    const moveData = await response.json();
    this.displayAdvancedMoveData(moveData);
  } catch (error) {
    console.error("Error fetching move details:", error);
    this.gridContainer.innerHTML = `<div style="padding:12px; color: var(--text-light);">Error loading move details</div>`;
  }
}

displayAdvancedPokemonData(data, speciesData, evoData) {
  this.gridContainer.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'poke-card animate-fadeIn';
  card.style.maxWidth = '100%';
  card.style.overflowX = 'hidden';
  card.style.display = 'flex';
  card.style.flexDirection = 'column';
  card.style.gap = '16px';

  // Assemble the card sections with animations
  card.append(
    this.createCardHeader(data),
    this.createBasicInfoSection(data),
    this.createStatsRadarChart(data),
    this.createAbilitiesSection(data),
    // Remove old type relations grid
    // Instead, add our new advanced analysis section:
    this.createAdvancedBattleAnalysisTab(data),
    this.createPokedexEntrySection(speciesData),
    this.createEvolutionVisualization(evoData.chain),
    this.createMovesSection(data)
  );

  // Append optional sections
  if (data.held_items && data.held_items.length > 0) {
    card.appendChild(this.createHeldItemsSection(data));
  }
  if (data.forms && data.forms.length > 0) {
    card.appendChild(this.createFormsSection(data));
  }

  this.gridContainer.appendChild(card);
  this.initIntersectionObserver(); // Reinitialize for new lazy images

  // Trigger an animation frame for smoother entrance
  requestAnimationFrame(() => {
    card.classList.add('visible');
  });
}

displayAdvancedMoveData(moveData) {
  this.gridContainer.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'poke-card animate-fadeIn';
  card.style.maxWidth = '100%';
  card.style.overflowX = 'hidden';
  card.style.display = 'flex';
  card.style.flexDirection = 'column';
  card.style.gap = '16px';

  card.append(
    this.createMoveCardHeader(moveData),
    this.createMoveBasicInfoSection(moveData),
    this.createMoveStatsChart(moveData),
    this.createMoveDescriptionSection(moveData)
  );

  this.gridContainer.appendChild(card);
  requestAnimationFrame(() => card.classList.add('visible'));
}

// -----------------------------
// Helper: Create a Badge Element
// -----------------------------
createBadge(text, backgroundColor) {
  const badge = document.createElement('span');
  badge.className = 'type-badge';
  badge.textContent = text.toUpperCase();
  badge.style.background = backgroundColor;
  badge.style.padding = '3px 3px';
  badge.style.borderRadius = '5px';
  badge.style.fontSize = '10px';
  badge.style.fontWeight = '700';
  badge.style.color = '#fff';
  badge.style.textShadow = '0 1px 2px rgba(0,0,0,0.3)';
  return badge;
}

// -----------------------------
// Header: Move Title, Badges, and Numeric Details
// -----------------------------
createMoveCardHeader(moveData) {
  const header = document.createElement('header');
  header.className = 'poke-card-header animate-slideDown';
  header.setAttribute('role', 'banner');

  const title = document.createElement('h1');
  title.className = 'poke-title';
  title.style.fontSize = '32px';
  title.style.margin = '0 0 8px';
  title.textContent = moveData.name.charAt(0).toUpperCase() + moveData.name.slice(1);

  const badgeContainer = document.createElement('div');
  badgeContainer.style.display = 'flex';
  badgeContainer.style.gap = '8px';
  badgeContainer.style.marginBottom = '16px';

  const typeBadge = this.createBadge(moveData.type.name, this.getTypeColor(moveData.type.name));
  const damageColor = moveData.damage_class.name === 'physical'
    ? '#F08030'
    : moveData.damage_class.name === 'special'
      ? '#6890F0'
      : '#A8A878';
  const damageBadge = this.createBadge(moveData.damage_class.name, damageColor);

  badgeContainer.append(typeBadge, damageBadge);

  const details = document.createElement('div');
  details.style.display = 'grid';
  details.style.gridTemplateColumns = 'repeat(4, auto)';
  details.style.gap = '16px';
  details.innerHTML = `
    <div class="detail-item">
      <span class="detail-label">POWER</span>
      <span class="detail-value">${moveData.power !== null ? moveData.power : '—'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">ACC</span>
      <span class="detail-value">${moveData.accuracy !== null ? moveData.accuracy : '—'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">PP</span>
      <span class="detail-value">${moveData.pp}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">PRI</span>
      <span class="detail-value">${moveData.priority}</span>
    </div>
  `;

  header.append(title, badgeContainer, details);
  return header;
}

// -----------------------------
// Basic Info Section: Additional Move Details
// -----------------------------
createMoveBasicInfoSection(moveData) {
  const section = document.createElement('section');
  section.className = 'info-grid animate-fadeInUp';
  section.innerHTML = `
    <h3 class="section-title">BASIC INFO</h3>
    <div class="metric">
      <span class="label">CATEGORY</span>
      <span class="value">${moveData.damage_class.name.toUpperCase()}</span>
    </div>
    <div class="metric">
      <span class="label">TARGET</span>
      <span class="value">${moveData.target.name.replace(/-/g, ' ').toUpperCase()}</span>
    </div>
    <div class="metric">
      <span class="label">EFFECT CHANCE</span>
      <span class="value">${moveData.effect_chance !== null ? moveData.effect_chance + '%' : '—'}</span>
    </div>
  `;
  return section;
}

// -----------------------------
// Statistics Chart Section: Visualize Move Data with Chart.js
// -----------------------------
createMoveStatsChart(moveData) {
  const section = document.createElement('section');
  section.className = 'stats-chart-card animate-fadeInUp';
  section.innerHTML = `<h3 class="section-title">STATISTICS</h3>`;

  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container';
  chartContainer.style.position = 'relative';
  chartContainer.style.height = '220px';
  chartContainer.style.width = '100%';
  chartContainer.style.margin = '16px 0';

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-label', 'Move statistics chart');
  canvas.style.touchAction = 'none';
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  const renderChart = () => {
    const ctx = canvas.getContext('2d');
    const labels = [];
    const dataValues = [];

    if (moveData.power !== null) {
      labels.push('Power');
      dataValues.push(moveData.power);
    }
    if (moveData.accuracy !== null) {
      labels.push('Accuracy');
      dataValues.push(moveData.accuracy);
    }
    labels.push('PP');
    dataValues.push(moveData.pp);
    labels.push('Priority');
    dataValues.push(moveData.priority);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: moveData.name.toUpperCase(),
          data: dataValues,
          backgroundColor: [
            'rgba(145,70,255,0.6)',
            'rgba(245,25,255,0.6)',
            'rgba(255,159,64,0.6)',
            'rgba(255,64,64,0.6)'
          ],
          borderColor: [
            'rgba(145,70,255,1)',
            'rgba(245,25,255,1)',
            'rgba(255,159,64,1)',
            'rgba(255,64,64,1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  };

  if (typeof Chart === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = renderChart;
    script.onerror = () => {
      console.error("Failed to load Chart.js");
      section.innerHTML += `<div style="padding:12px; color: var(--text-light);">Failed to load chart library.</div>`;
    };
    document.head.appendChild(script);
  } else {
    renderChart();
  }

  chartContainer.appendChild(canvas);
  section.appendChild(chartContainer);
  return section;
}

// -----------------------------
// Move Description Section: Display Move Effect Text
// -----------------------------
createMoveDescriptionSection(moveData) {
  const section = document.createElement('section');
  section.className = 'move-description-section animate-fadeInUp';
  section.innerHTML = `<h3 class="section-title">MOVE DESCRIPTION</h3>`;

  const effectEntry = moveData.effect_entries.find(e => e.language.name === 'en');
  const effectText = effectEntry
    ? effectEntry.effect.replace(/\n|\f/g, ' ')
    : 'No description available.';

  const descContainer = document.createElement('div');
  descContainer.className = 'move-description';
  descContainer.style.background = 'var(--background-darker)';
  descContainer.style.padding = '16px';
  descContainer.style.borderRadius = '8px';
  descContainer.style.fontSize = '14px';
  descContainer.style.lineHeight = '1.5';
  descContainer.style.color = 'var(--text-muted)';
  descContainer.textContent = effectText;

  section.appendChild(descContainer);
  return section;
}

// -----------------------------
// Instruction & Browse Sections
// -----------------------------
renderAdvancedInstruction() {
  this.gridContainer.innerHTML = '';
  const info = document.createElement('div');
  info.style.padding = '12px';
  info.style.textAlign = 'center';
  info.style.color = 'var(--text-light)';
  info.textContent = 'Enter a Pokémon name and press Enter for detailed info.';
  this.gridContainer.appendChild(info);
}

renderBrowse() {
  this.gridContainer.innerHTML = '';
  if (!this.pokemonList) {
    this.gridContainer.innerHTML = '<div class="spinner"></div>';
    fetch('https://pokeapi.co/api/v2/pokemon?limit=20000')
      .then(response => response.json())
      .then(data => {
        this.pokemonList = data.results;
        this.renderBrowseGrid();
      })
      .catch(err => {
        this.gridContainer.innerHTML = `<div style="padding:12px; color: var(--text-light);">Error loading Pokémon list</div>`;
      });
  } else {
    this.renderBrowseGrid();
  }
}

renderBrowseGrid() {
  this.gridContainer.innerHTML = '';
  this.gridContainer.classList.add('browse-container');
  const query = this.searchInput.value.trim().toLowerCase();
  const filtered = this.pokemonList.filter(poke => poke.name.includes(query));
  const fragment = document.createDocumentFragment();

  filtered.forEach(poke => {
    const tile = document.createElement('div');
    tile.className = 'browse-tile';
    tile.dataset.label = poke.name.toLowerCase();

    const idMatch = poke.url.match(/\/pokemon\/(\d+)\//);
    const id = idMatch ? idMatch[1] : '';

    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    const label = document.createElement('div');
    label.className = 'tile-label';
    label.textContent = poke.name;

    tile.append(img, label);
    tile.addEventListener('click', (e) => {
      e.stopPropagation();
      this.panel.classList.add('active');
      this.changeTab('advanced');
      this.searchInput.value = poke.name;
      this.searchAdvancedPokemon(poke.name);
    });

    fragment.appendChild(tile);
  });

  this.gridContainer.appendChild(fragment);
  if (filtered.length === 0) {
    this.gridContainer.innerHTML = `<div style="padding:12px; color: var(--text-light);">No Pokémon match your search.</div>`;
  }
}

// -----------------------------
// Render Pokémon with Sorting & Filtering via Dropdowns (with BST)
// -----------------------------
renderPokemon() {
  this.gridContainer.innerHTML = '';
  // Render the custom controls panel for Pokémon filters and sort.
  this.renderPokemonControls();
  if (!this.pokemonList) {
    this.gridContainer.innerHTML = '<div class="spinner"></div>';
    fetch('https://pokeapi.co/api/v2/pokemon?limit=20000')
      .then(response => response.json())
      .then(data => {
        this.pokemonList = data.results;
        this.renderPokemonGrid();
      })
      .catch(err => {
        this.gridContainer.innerHTML = `<div style="padding:12px; color: var(--text-light);">Error loading Pokémon list</div>`;
      });
  } else {
    this.renderPokemonGrid();
  }
}

renderPokemonControls() {
  let controlsContainer = document.getElementById('pokemon-controls');
  if (!controlsContainer) {
    controlsContainer = document.createElement('div');
    controlsContainer.id = 'pokemon-controls';
    Object.assign(controlsContainer.style, {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: '2px', // Slightly increased from 3px
      marginBottom: '5px',
      backgroundColor: '#202020',
      color: '#fff',
      padding: '1.8px', // Slightly increased from 2px
      borderRadius: '5px',
      overflowX: 'auto'
    });
    this.gridContainer.parentNode.insertBefore(controlsContainer, this.gridContainer);
  }

  controlsContainer.innerHTML = '';

  // Updated helper function with slight size increases
  const createControl = (labelText, id, optionsHTML, onChange) => {
    const container = document.createElement('div');
    Object.assign(container.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.2px', // Slightly increased from 1px
      flexShrink: '0',
      minWidth: '50px', // Increased from 48px
      maxWidth: '76px' // Increased from 72px
    });

    const label = document.createElement('div');
    label.textContent = labelText;
    Object.assign(label.style, {
      fontSize: '11px', // Increased from 10px
      textAlign: 'center',
      whiteSpace: 'nowrap',
      padding: '0 2px'
    });

    const select = document.createElement('select');
    select.id = id;
    Object.assign(select.style, {
      backgroundColor: '#202020',
      color: '#fff',
      border: '1px solid #666',
      borderRadius: '3px',
      padding: '2px', // Increased from 1px
      fontSize: '10px', // Increased from 9px
      width: '92%',
      height: '22px', // Increased from 22px
      cursor: 'pointer'
    });
    select.innerHTML = optionsHTML;
    select.addEventListener('change', onChange);
    container.appendChild(label);
    container.appendChild(select);
    return container;
  };

  // Create all controls
  const typeControl = createControl('Type', 'pokemon-type-filter', `
    <option value="all">All</option>
    <option value="normal">Normal</option>
    <option value="fire">Fire</option>
    <option value="water">Water</option>
    <option value="grass">Grass</option>
    <option value="electric">Electric</option>
    <option value="ice">Ice</option>
    <option value="fighting">Fighting</option>
    <option value="poison">Poison</option>
    <option value="ground">Ground</option>
    <option value="flying">Flying</option>
    <option value="psychic">Psychic</option>
    <option value="bug">Bug</option>
    <option value="rock">Rock</option>
    <option value="ghost">Ghost</option>
    <option value="dragon">Dragon</option>
    <option value="dark">Dark</option>
    <option value="steel">Steel</option>
    <option value="fairy">Fairy</option>
  `, () => {
    this.selectedTypeFilter = document.getElementById('pokemon-type-filter').value;
    this.renderPokemonGrid();
  });

  const weightControl = createControl('Weight', 'pokemon-weight-filter', `
    <option value="all">All</option>
    <option value="light">&lt;30kg</option>
    <option value="medium">30-70kg</option>
    <option value="heavy">&gt;70kg</option>
  `, () => {
    this.selectedWeightFilter = document.getElementById('pokemon-weight-filter').value;
    this.renderPokemonGrid();
  });

  const heightControl = createControl('Height', 'pokemon-height-filter', `
    <option value="all">All</option>
    <option value="short">&lt;1m</option>
    <option value="medium">1-2m</option>
    <option value="tall">&gt;2m</option>
  `, () => {
    this.selectedHeightFilter = document.getElementById('pokemon-height-filter').value;
    this.renderPokemonGrid();
  });

  const bstControl = createControl('BST', 'pokemon-bst-filter', `
    <option value="all">All</option>
    <option value="low">&lt;400</option>
    <option value="medium">400-600</option>
    <option value="high">&gt;600</option>
  `, () => {
    this.selectedBSTFilter = document.getElementById('pokemon-bst-filter').value;
    this.renderPokemonGrid();
  });

  const sortControl = createControl('Sort', 'pokemon-sort', `
    <option value="name-asc">Name A-Z</option>
    <option value="name-desc">Name Z-A</option>
    <option value="dex-asc">Dex Ascending</option>
    <option value="dex-desc">Dex Descending</option>
    <option value="bst-asc">BST Ascending</option>
    <option value="bst-desc">BST Descending</option>
  `, () => {
    this.renderPokemonGrid();
  });

  // Append controls together
  controlsContainer.appendChild(typeControl);
  controlsContainer.appendChild(weightControl);
  controlsContainer.appendChild(heightControl);
  controlsContainer.appendChild(bstControl);
  controlsContainer.appendChild(sortControl);
}

/**
 * This function should be called when switching tabs to ensure
 * the sorting controls are removed and re-rendered correctly.
 */
switchTab(tabName) {
  console.log(`Switching to tab: ${tabName}`);

  // Clear and rebuild controls
  this.renderPokemonControls();
  this.renderPokemonGrid(); // Re-render grid to reflect any new filters
}


// Render the Pokémon grid with search, filtering (Type, Weight, Height, BST), and sorting.
renderPokemonGrid() {
  this.gridContainer.innerHTML = '';
  this.gridContainer.classList.add('browse-container');
  const query = this.searchInput.value.trim().toLowerCase();
  let filtered = this.pokemonList.filter(poke => poke.name.includes(query));

  // Filter by Type if selected.
  if (this.selectedTypeFilter && this.selectedTypeFilter !== 'all') {
    filtered = filtered.filter(poke => {
      if (this.pokemonDetailCache && this.pokemonDetailCache.has(poke.url)) {
        const pokeData = this.pokemonDetailCache.get(poke.url);
        return pokeData.types.some(typeInfo => typeInfo.type.name === this.selectedTypeFilter);
      }
      return true;
    });
  }

  // Filter by Weight if selected.
  if (this.selectedWeightFilter && this.selectedWeightFilter !== 'all') {
    filtered = filtered.filter(poke => {
      if (this.pokemonDetailCache && this.pokemonDetailCache.has(poke.url)) {
        const pokeData = this.pokemonDetailCache.get(poke.url);
        const weightKg = pokeData.weight / 10;
        if (this.selectedWeightFilter === 'light') {
          return weightKg < 30;
        } else if (this.selectedWeightFilter === 'medium') {
          return weightKg >= 30 && weightKg <= 70;
        } else if (this.selectedWeightFilter === 'heavy') {
          return weightKg > 70;
        }
      }
      return true;
    });
  }

  // Filter by Height if selected.
  if (this.selectedHeightFilter && this.selectedHeightFilter !== 'all') {
    filtered = filtered.filter(poke => {
      if (this.pokemonDetailCache && this.pokemonDetailCache.has(poke.url)) {
        const pokeData = this.pokemonDetailCache.get(poke.url);
        const heightM = pokeData.height / 10;
        if (this.selectedHeightFilter === 'short') {
          return heightM < 1;
        } else if (this.selectedHeightFilter === 'medium') {
          return heightM >= 1 && heightM <= 2;
        } else if (this.selectedHeightFilter === 'tall') {
          return heightM > 2;
        }
      }
      return true;
    });
  }

  // Filter by BST if selected.
  if (this.selectedBSTFilter && this.selectedBSTFilter !== 'all') {
    filtered = filtered.filter(poke => {
      if (this.pokemonDetailCache && this.pokemonDetailCache.has(poke.url)) {
        const pokeData = this.pokemonDetailCache.get(poke.url);
        const totalStats = pokeData.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
        if (this.selectedBSTFilter === 'low') {
          return totalStats < 400;
        } else if (this.selectedBSTFilter === 'medium') {
          return totalStats >= 400 && totalStats <= 600;
        } else if (this.selectedBSTFilter === 'high') {
          return totalStats > 600;
        }
      }
      return true;
    });
  }

  // Sort the filtered Pokémon.
  const sortOption = document.getElementById('pokemon-sort')?.value || 'name-asc';
  if (sortOption === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'name-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortOption === 'dex-asc') {
    filtered.sort((a, b) => {
      const idA = parseInt(a.url.match(/\/pokemon\/(\d+)\//)[1]);
      const idB = parseInt(b.url.match(/\/pokemon\/(\d+)\//)[1]);
      return idA - idB;
    });
  } else if (sortOption === 'dex-desc') {
    filtered.sort((a, b) => {
      const idA = parseInt(a.url.match(/\/pokemon\/(\d+)\//)[1]);
      const idB = parseInt(b.url.match(/\/pokemon\/(\d+)\//)[1]);
      return idB - idA;
    });
  } else if (sortOption === 'bst-asc') {
    filtered.sort((a, b) => {
      const bstA = (this.pokemonDetailCache && this.pokemonDetailCache.has(a.url))
        ? this.pokemonDetailCache.get(a.url).stats.reduce((sum, stat) => sum + stat.base_stat, 0)
        : 0;
      const bstB = (this.pokemonDetailCache && this.pokemonDetailCache.has(b.url))
        ? this.pokemonDetailCache.get(b.url).stats.reduce((sum, stat) => sum + stat.base_stat, 0)
        : 0;
      return bstA - bstB;
    });
  } else if (sortOption === 'bst-desc') {
    filtered.sort((a, b) => {
      const bstA = (this.pokemonDetailCache && this.pokemonDetailCache.has(a.url))
        ? this.pokemonDetailCache.get(a.url).stats.reduce((sum, stat) => sum + stat.base_stat, 0)
        : 0;
      const bstB = (this.pokemonDetailCache && this.pokemonDetailCache.has(b.url))
        ? this.pokemonDetailCache.get(b.url).stats.reduce((sum, stat) => sum + stat.base_stat, 0)
        : 0;
      return bstB - bstA;
    });
  }

  // Build the grid as before.
  const fragment = document.createDocumentFragment();
  filtered.forEach(poke => {
    const tile = document.createElement('div');
    tile.className = 'pokemon-card';

    // Hover effects.
    tile.addEventListener('mouseenter', () => {
      tile.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.6)';
      tile.style.transform = 'scale(1.05)';
    });
    tile.addEventListener('mouseleave', () => {
      tile.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
      tile.style.transform = 'scale(1)';
    });

    // Dex Number (Top Left)
    const dexNumber = document.createElement('div');
    dexNumber.className = 'dex-number';
    tile.appendChild(dexNumber);

    // Image Container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'pokemon-image-container';
    tile.appendChild(imageContainer);

    // Pokémon Image with lazy loading.
    const img = document.createElement('img');
    img.className = 'pokemon-image';
    img.loading = 'lazy';
    imageContainer.appendChild(img);

    // Extract Pokémon ID from URL.
    const idMatch = poke.url.match(/\/pokemon\/(\d+)\//);
    const id = idMatch ? idMatch[1] : '';

    // Try several image sources with fallbacks.
    const imageSources = [
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      `https://via.placeholder.com/150x150?text=No+Image`
    ];
    let imgIndex = 0;
    function loadNextImage() {
      if (imgIndex >= imageSources.length) return;
      img.src = imageSources[imgIndex];
      img.onerror = () => {
        imgIndex++;
        loadNextImage();
      };
    }
    loadNextImage();

    // Pokémon Name
    const nameLabel = document.createElement('div');
    nameLabel.className = 'pokemon-name';
    nameLabel.textContent = poke.name;
    tile.appendChild(nameLabel);

    // Type Badges (Centered)
    const typesContainer = document.createElement('div');
    typesContainer.className = 'pokemon-types';
    tile.appendChild(typesContainer);

    // Basic Info container (for height, weight, BST, etc.)
    const basicInfoContainer = document.createElement('div');
    basicInfoContainer.className = 'pokemon-info';
    basicInfoContainer.textContent = 'Loading info...';
    tile.appendChild(basicInfoContainer);

    // Function to update the tile with fetched Pokémon details.
    const updatePokemonDetails = (detail) => {
      dexNumber.textContent = `#${detail.id}`;
      typesContainer.innerHTML = '';
      detail.types.forEach(typeInfo => {
        const badge = this.createBadge(
          typeInfo.type.name,
          this.getTypeColor(typeInfo.type.name)
        );
        typesContainer.appendChild(badge);
      });
      const height = (detail.height / 10).toFixed(1);
      const weight = (detail.weight / 10).toFixed(1);
      const baseExp = detail.base_experience;
      const totalStats = detail.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
      basicInfoContainer.innerHTML = `
        <span> ${height}m | ${weight}kg </span>
        <span> Exp: ${baseExp} | BST: ${totalStats} </span>
      `;
    };

    // Fetch details if not already cached.
    if (this.pokemonDetailCache && this.pokemonDetailCache.has(poke.url)) {
      const cachedDetail = this.pokemonDetailCache.get(poke.url);
      updatePokemonDetails(cachedDetail);
    } else {
      fetch(poke.url)
        .then(response => response.json())
        .then(detail => {
          if (!this.pokemonDetailCache) this.pokemonDetailCache = new Map();
          this.pokemonDetailCache.set(poke.url, detail);
          updatePokemonDetails(detail);
        })
        .catch(err => {
          console.error("Error fetching Pokémon detail:", err);
          basicInfoContainer.textContent = 'Info not available';
        });
    }

    // Click event for showing detailed view.
    tile.addEventListener('click', (e) => {
      e.stopPropagation();
      this.panel.classList.add('active');
      this.changeTab('advanced');
      this.searchInput.value = poke.name;
      this.searchAdvancedPokemon(poke.name);
    });

    fragment.appendChild(tile);
  });

  this.gridContainer.appendChild(fragment);
  if (filtered.length === 0) {
    this.gridContainer.innerHTML = `<div style="padding:12px; color: var(--text-light);">No Pokémon match your search.</div>`;
  }
}


// -----------------------------
// Add Global Event Listeners
// -----------------------------
addEventListeners() {
  this.button.addEventListener('mousedown', this.dragStart);

  this.button.addEventListener('click', (e) => {
    if (this.wasDragging) {
      this.wasDragging = false;
      return;
    }
    e.stopPropagation();
    this.panel.classList.toggle('active');
    if (this.panel.classList.contains('active')) {
      this.searchInput.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (!this.container.contains(e.target)) {
      this.panel.classList.remove('active');
    }
  });

  this.panel.addEventListener('dragstart', (e) => {
    const ballImg = e.target.closest('.pball-item img');
    if (ballImg) {
      e.dataTransfer.setData('text/plain', ballImg.dataset.ballType);

      const dragImg = new Image();
      dragImg.src = ballImg.src;
      dragImg.style.width = '36px';
      dragImg.style.height = '36px';
      dragImg.style.position = 'absolute';
      dragImg.style.left = '-9999px';
      document.body.appendChild(dragImg);

      e.dataTransfer.setDragImage(dragImg, 18, 18);
      setTimeout(() => document.body.removeChild(dragImg), 0);

      ballImg.classList.add('dragging');
      const onDragEnd = () => {
        ballImg.classList.remove('dragging');
        document.removeEventListener('dragend', onDragEnd);
      };
      document.addEventListener('dragend', onDragEnd);
    }
  });

  const chatInput = document.querySelector('#chatInput');
  if (chatInput) {
    chatInput.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    chatInput.addEventListener('drop', (e) => {
      e.preventDefault();
      const ballType = e.dataTransfer.getData('text/plain');
      if (ballType) {
        chatInput.value += ` ${ballType}`;
      }
    });
  }

  const tabs = this.panel.querySelectorAll('.pball-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      this.changeTab(tab.dataset.tab);
    });
  });

  // Use debounced handler for the search input
  const debouncedSearch = this.debounce(() => {
    if (this.currentTab !== 'advanced') {
      this.filterGrid();
      if (this.currentTab === 'pokemon') {
        this.renderPokemonGrid();
      }
    }
    this.clearBtn.style.display = this.searchInput.value.trim() ? 'block' : 'none';
  }, 300);
  this.searchInput.addEventListener('input', debouncedSearch);

  this.clearBtn.addEventListener('click', () => {
    this.searchInput.value = '';
    this.clearBtn.style.display = 'none';
    if (this.currentTab !== 'advanced') {
      this.filterGrid();
      if (this.currentTab === 'browse') {
        this.renderBrowseGrid();
      }
    }
  });

  this.searchInput.addEventListener('keydown', (e) => {
    if (this.currentTab === 'advanced' && e.key === 'Enter') {
      this.searchAdvancedPokemon(this.searchInput.value.trim());
    }
  });
}

// 2. Update changeTab() to handle the new "moves" tab
changeTab(tabName) {
  this.currentTab = tabName;
  const tabs = this.panel.querySelectorAll('.pball-tab');
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });
  if (tabName === 'advanced') {
    this.searchInput.placeholder = 'Enter Pokémon name for detailed info...';
  } else if (tabName === 'pokemon') {
    this.searchInput.placeholder = 'Filter Pokémon...';
  } else if (tabName === 'moves') {
    this.searchInput.placeholder = 'Filter moves...';
  } else {
    this.searchInput.placeholder = 'Search...';
  }
  this.searchInput.value = '';
  this.clearBtn.style.display = 'none';
  this.renderGrid();
}

      filterGrid() {
        const query = this.searchInput.value.trim().toLowerCase();
        const items = this.gridContainer.querySelectorAll('.pball-item, .browse-tile');
        items.forEach(item => {
          if (!query || item.dataset.label.includes(query)) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      }

      getChatInput() {
        return document.querySelector('[data-a-target="chat-input"]');
      }

      insertCommand(ballType) {
        const chatInput = this.getChatInput();
        if (!chatInput) return;
        chatInput.focus();
        this.clearChatInput();
        this.insertText(ballType);
        this.triggerInputEvent(chatInput);
      }

      clearChatInput() {
        const chatInput = this.getChatInput();
        if (chatInput) {
          chatInput.value = '';
          this.triggerInputEvent(chatInput);
        }
      }

      insertText(text) {
        document.execCommand('insertText', false, text);
      }

      triggerInputEvent(element) {
        element.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      }

      searchAdvancedPokemon(name) {
        if (!name) return;
        this.gridContainer.innerHTML = '<div class="spinner"></div>';
        fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
          .then(response => {
            if (!response.ok) { throw new Error("Pokémon not found"); }
            return response.json();
          })
          .then(data => {
            return fetch(data.species.url)
              .then(res => {
                if (!res.ok) { throw new Error("Species data not found"); }
                return res.json().then(speciesData => ({ data, speciesData }));
              });
          })
          .then(({ data, speciesData }) => {
            return fetch(speciesData.evolution_chain.url)
              .then(res => {
                if (!res.ok) { throw new Error("Evolution chain not found"); }
                return res.json().then(evoData => ({ data, speciesData, evoData }));
              });
          })
          .then(({ data, speciesData, evoData }) => {
            this.displayAdvancedPokemonData(data, speciesData, evoData);
          })
          .catch(err => {
            this.gridContainer.innerHTML = `<div style="padding:12px; color: var(--text-light);">${err.message}</div>`;
          });
      }

createAdvancedBattleAnalysisTab(data) {
  const container = document.createElement('section');
  container.className = 'advanced-battle-analysis animate-fadeInUp';
  container.style.padding = '1rem';
  container.style.borderTop = '1px solid var(--color-border)';

  // Section title
  const title = document.createElement('h3');
  title.className = 'section-title';
  title.textContent = 'Comprehensive Type Interactions';
  container.appendChild(title);

  // Grid container for type cards
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
  grid.style.gap = '16px';

  // Create an interactive card for each type
  data.types.forEach(typeObj => {
    const typeCard = document.createElement('div');
    typeCard.className = 'advanced-type-card';
    typeCard.style.border = '1px solid var(--color-border)';
    typeCard.style.borderRadius = '8px';
    typeCard.style.background = 'var(--color-card)';
    typeCard.style.boxShadow = 'var(--box-shadow-light)';
    typeCard.style.overflow = 'hidden';
    typeCard.style.display = 'flex';
    typeCard.style.flexDirection = 'column';

    // Card header with type name and color
    const header = document.createElement('div');
    header.textContent = typeObj.type.name.toUpperCase();
    header.style.background = this.getTypeColor(typeObj.type.name);
    header.style.color = '#fff';
    header.style.padding = '8px';
    header.style.fontWeight = 'bold';
    header.style.textAlign = 'center';
    typeCard.appendChild(header);

    // Tab header container for "Offense" and "Defense"
    const tabHeaderContainer = document.createElement('div');
    tabHeaderContainer.style.display = 'flex';

    // Both buttons now use the card's background
    const offenseTab = document.createElement('button');
    offenseTab.textContent = 'Offense';
    offenseTab.style.flex = '1';
    offenseTab.style.padding = '8px';
    offenseTab.style.border = 'none';
    offenseTab.style.cursor = 'pointer';
    offenseTab.style.background = 'var(--color-card)';
    offenseTab.style.fontWeight = 'bold';
    offenseTab.style.transition = 'border-bottom 0.2s ease';

    const defenseTab = document.createElement('button');
    defenseTab.textContent = 'Defense';
    defenseTab.style.flex = '1';
    defenseTab.style.padding = '8px';
    defenseTab.style.border = 'none';
    defenseTab.style.cursor = 'pointer';
    defenseTab.style.background = 'var(--color-card)';
    defenseTab.style.fontWeight = 'bold';
    defenseTab.style.transition = 'border-bottom 0.2s ease';

    tabHeaderContainer.append(offenseTab, defenseTab);
    typeCard.appendChild(tabHeaderContainer);

    // Create content containers for each tab
    const offenseContent = document.createElement('div');
    offenseContent.style.padding = '8px';
    offenseContent.style.display = 'block';

    const defenseContent = document.createElement('div');
    defenseContent.style.padding = '8px';
    defenseContent.style.display = 'none';

    typeCard.appendChild(offenseContent);
    typeCard.appendChild(defenseContent);

    // Fetch the type data and build the interactive details
    fetch(typeObj.type.url)
      .then(res => res.json())
      .then(typeData => {
        // --- Offense details ---
        const offenseSections = [
          { label: 'Double Damage To', data: typeData.damage_relations.double_damage_to },
          { label: 'Half Damage To', data: typeData.damage_relations.half_damage_to },
          { label: 'No Damage To', data: typeData.damage_relations.no_damage_to }
        ];
        offenseSections.forEach(section => {
          const sectionTitle = document.createElement('h4');
          sectionTitle.textContent = section.label;
          sectionTitle.style.marginBottom = '4px';
          sectionTitle.style.fontSize = '0.9rem';
          offenseContent.appendChild(sectionTitle);

          const sectionContent = document.createElement('div');
          sectionContent.style.display = 'flex';
          sectionContent.style.flexWrap = 'wrap';
          sectionContent.style.gap = '4px';
          if (section.data.length > 0) {
            section.data.forEach(item => {
              const badge = document.createElement('span');
              badge.textContent = item.name.toUpperCase();
              badge.style.background = this.getTypeColor(item.name);
              badge.style.color = '#fff';
              badge.style.padding = '2px 6px';
              badge.style.borderRadius = '4px';
              badge.style.fontSize = '0.8rem';
              sectionContent.appendChild(badge);
            });
          } else {
            const noData = document.createElement('span');
            noData.textContent = 'None';
            noData.style.fontSize = '0.8rem';
            sectionContent.appendChild(noData);
          }
          offenseContent.appendChild(sectionContent);
        });

        // --- Defense details ---
        const defenseSections = [
          { label: 'Double Damage From', data: typeData.damage_relations.double_damage_from },
          { label: 'Half Damage From', data: typeData.damage_relations.half_damage_from },
          { label: 'No Damage From', data: typeData.damage_relations.no_damage_from }
        ];
        defenseSections.forEach(section => {
          const sectionTitle = document.createElement('h4');
          sectionTitle.textContent = section.label;
          sectionTitle.style.marginBottom = '4px';
          sectionTitle.style.fontSize = '0.9rem';
          defenseContent.appendChild(sectionTitle);

          const sectionContent = document.createElement('div');
          sectionContent.style.display = 'flex';
          sectionContent.style.flexWrap = 'wrap';
          sectionContent.style.gap = '4px';
          if (section.data.length > 0) {
            section.data.forEach(item => {
              const badge = document.createElement('span');
              badge.textContent = item.name.toUpperCase();
              badge.style.background = this.getTypeColor(item.name);
              badge.style.color = '#fff';
              badge.style.padding = '2px 6px';
              badge.style.borderRadius = '4px';
              badge.style.fontSize = '0.8rem';
              sectionContent.appendChild(badge);
            });
          } else {
            const noData = document.createElement('span');
            noData.textContent = 'None';
            noData.style.fontSize = '0.8rem';
            sectionContent.appendChild(noData);
          }
          defenseContent.appendChild(sectionContent);
        });
      })
      .catch(err => {
        console.error('Error fetching type interactions:', err);
        offenseContent.textContent = 'Unable to load data.';
        defenseContent.textContent = 'Unable to load data.';
      });

    // --- Tab switching functionality ---
    // Instead of changing the background, we use a bottom border to indicate the active tab.
    offenseTab.addEventListener('click', () => {
      offenseTab.style.borderBottom = '2px solid var(--color-primary)';
      defenseTab.style.borderBottom = 'none';
      offenseContent.style.display = 'block';
      defenseContent.style.display = 'none';
    });
    defenseTab.addEventListener('click', () => {
      defenseTab.style.borderBottom = '2px solid var(--color-primary)';
      offenseTab.style.borderBottom = 'none';
      offenseContent.style.display = 'none';
      defenseContent.style.display = 'block';
    });

    // Set initial active state for offense tab
    offenseTab.style.borderBottom = '2px solid var(--color-primary)';

    grid.appendChild(typeCard);
  });

  container.appendChild(grid);
  return container;
}


  /**
   * Helper function to get a color based on the Pokémon type.
   * @param {string} typeName
   * @returns {string} The color string.
   */
  getTypeColor(typeName) {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return typeColors[typeName] || '#68A090';
  }

  // CARD HEADER WITH IMAGE, NAME, AND DETAILS
  createCardHeader(data) {
    const header = document.createElement('header');
    header.className = 'poke-card-header animate-slideDown';
    header.setAttribute('role', 'banner');

    // Image container with lazy loading and type badges
    const imgContainer = document.createElement('div');
    imgContainer.style.position = 'relative';

    const img = document.createElement('img');
    img.className = 'poke-image lazy';
    img.style.width = '90px';
    img.style.height = '90px';
    img.style.borderRadius = '16px';
    img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    img.dataset.src =
      data.sprites.other?.['official-artwork']?.front_default ||
      data.sprites.front_default;
    img.src = ''; // initially empty—loaded via IntersectionObserver

    // Type badges positioned over the image
    const typeBadges = document.createElement('div');
    typeBadges.style.display = 'flex';
    typeBadges.style.gap = '4px';
    typeBadges.style.position = 'absolute';
    typeBadges.style.bottom = '60px';
    typeBadges.style.left = '80%';
    typeBadges.style.transform = 'translateX(-50%)';
    data.types.forEach(type => {
      const badge = document.createElement('span');
      badge.className = 'type-badge';
      badge.textContent = type.type.name.toUpperCase();
      badge.style.background = this.getTypeColor(type.type.name);
      badge.style.padding = '3px 3px';
      badge.style.borderRadius = '5px';
      badge.style.fontSize = '12px';
      badge.style.fontWeight = '700';
      badge.style.color = '#fff';
      badge.style.textShadow = '0 1px 2px rgba(0,0,0,0.3)';
      typeBadges.appendChild(badge);
    });
    imgContainer.append(img, typeBadges);

    // Title and details section
    const titleSection = document.createElement('div');
    const title = document.createElement('h1');
    title.className = 'poke-title';
    title.style.fontSize = '32px';
    title.style.margin = '0 0 8px';
    title.textContent =
      data.name.charAt(0).toUpperCase() + data.name.slice(1);

    const details = document.createElement('div');
    details.style.display = 'grid';
    details.style.gridTemplateColumns = 'repeat(3, auto)';
    details.style.gap = '16px';
    details.innerHTML = `
      <div class="detail-item">
        <span class="detail-label">ID</span>
        <span class="detail-value">#${data.id
          .toString()
          .padStart(3, '0')}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">EXP</span>
        <span class="detail-value">${data.base_experience}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">SPECIES</span>
        <span class="detail-value">${data.species.name}</span>
      </div>
    `;
    titleSection.append(title, details);
    header.append(imgContainer, titleSection);
    return header;
  }

  // POKÉDEX ENTRY SECTION
  createPokedexEntrySection(speciesData) {
    const section = document.createElement('section');
    section.className = 'pokedex-entry-section animate-fadeInUp';
    section.innerHTML = `<h3 class="section-title">POKÉDEX ENTRY</h3>`;
    const entry = speciesData.flavor_text_entries.find(
      e => e.language.name === 'en'
    );
    const flavorText = entry
      ? entry.flavor_text.replace(/\f|\n/g, ' ')
      : 'No entry available.';
    const entryContainer = document.createElement('div');
    entryContainer.className = 'pokedex-entry';
    entryContainer.style.background = 'var(--background-darker)';
    entryContainer.style.padding = '16px';
    entryContainer.style.borderRadius = '8px';
    entryContainer.style.fontSize = '14px';
    entryContainer.style.lineHeight = '1.5';
    entryContainer.style.color = 'var(--text-muted)';
    entryContainer.textContent = flavorText;
    section.appendChild(entryContainer);
    return section;
  }

  // BASIC PHYSICAL INFORMATION SECTION
  createBasicInfoSection(data) {
    const section = document.createElement('section');
    section.className = 'info-grid animate-fadeInUp';
    section.innerHTML = `
      <h3 class="section-title">PHYSICAL TRAITS</h3>
      <div class="metric">
        <i class="icon-height"></i>
        <span class="label">Height</span>
        <span class="value">${data.height / 10}m</span>
      </div>
      <div class="metric">
        <i class="icon-weight"></i>
        <span class="label">Weight</span>
        <span class="value">${data.weight / 10}kg</span>
      </div>
      <div class="metric">
        <i class="icon-stats"></i>
        <span class="label">Total Stats</span>
        <span class="value">${data.stats.reduce(
          (sum, s) => sum + s.base_stat,
          0
        )}</span>
      </div>
    `;
    return section;
  }
// ABILITIES SECTION WITH TOOLTIP (using async/await)
createAbilitiesSection(data) {
  const section = document.createElement('section');
  section.className = 'abilities-section animate-fadeInUp';
  section.innerHTML = `<h3 class="section-title">ABILITIES</h3>`;
  const abilitiesGrid = document.createElement('div');
  abilitiesGrid.className = 'abilities-grid';
  abilitiesGrid.style.display = 'grid';
  abilitiesGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(140px, 1fr))';
  abilitiesGrid.style.gap = '12px';

  data.abilities.forEach(ability => {
    const abilityCard = document.createElement('div');
    abilityCard.className = 'ability-card';
    abilityCard.style.background = 'var(--background-darker)';
    abilityCard.style.padding = '12px';
    abilityCard.style.borderRadius = '8px';
    abilityCard.style.textAlign = 'center';
    abilityCard.style.position = 'relative';
    abilityCard.style.cursor = 'pointer';

    const abilityName = document.createElement('div');
    abilityName.textContent = ability.ability.name.replace(/-/g, ' ');
    abilityName.style.fontWeight = '500';
    abilityName.style.textTransform = 'capitalize';

    if (ability.is_hidden) {
      const hiddenBadge = document.createElement('div');
      hiddenBadge.textContent = 'Hidden';
      hiddenBadge.style.position = 'absolute';
      hiddenBadge.style.top = '4px';
      hiddenBadge.style.right = '4px';
      hiddenBadge.style.background = '#FF6B6B';
      hiddenBadge.style.color = '#FFF';
      hiddenBadge.style.fontSize = '10px';
      hiddenBadge.style.padding = '2px 6px';
      hiddenBadge.style.borderRadius = '12px';
      abilityCard.appendChild(hiddenBadge);
    }
    abilityCard.appendChild(abilityName);
    abilitiesGrid.appendChild(abilityCard);

    // Use async/await for fetching ability descriptions
    abilityCard.addEventListener('mouseenter', async () => {
      try {
        const res = await fetch(ability.ability.url);
        const abilityData = await res.json();
        const description =
          abilityData.effect_entries.find(e => e.language.name === 'en')?.effect ||
          'No description available.';
        this.showTooltip(abilityCard, description);
      } catch (err) {
        console.error('Error fetching ability data:', err);
      }
    });
    abilityCard.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });
  });
  section.appendChild(abilitiesGrid);
  return section;
}

// Show tooltip with smooth fade-in/out transitions using a solid background color
showTooltip(element, text) {
  if (this.tooltip) this.tooltip.remove();
  this.tooltip = document.createElement('div');
  this.tooltip.className = 'tooltip animate-fadeIn';
  this.tooltip.textContent = text;
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const tooltipHeight = 100; // estimated height
  let topPosition = rect.bottom + 8;
  if (topPosition + tooltipHeight > viewportHeight) {
    topPosition = rect.top - tooltipHeight - 8;
  }
  Object.assign(this.tooltip.style, {
    background: 'var(--color-card)', // Updated to a solid color
    color: 'var(--text-light)',
    borderRadius: '6px',
    padding: '8px 12px',
    position: 'fixed',
    top: `${topPosition}px`,
    left: `${rect.left}px`,
    maxWidth: '240px',
    zIndex: '10000',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    pointerEvents: 'none',
    opacity: '0',
    transition: 'opacity 0.3s ease'
  });
  document.body.appendChild(this.tooltip);
  requestAnimationFrame(() => {
    this.tooltip.style.opacity = '1';
  });
}

hideTooltip() {
  if (this.tooltip) {
    this.tooltip.style.opacity = '0';
    setTimeout(() => {
      if (this.tooltip) {
        this.tooltip.remove();
        this.tooltip = null;
      }
    }, 300);
  }
}

// MOVES SECTION WITH SEARCH AND DETAILED TOOLTIP
createMovesSection(data) {
  const section = document.createElement('section');
  section.className = 'moves-section animate-fadeInUp';
  section.innerHTML = `<h3 class="section-title">MOVES</h3>`;

  // Search container (same as before)
  const searchContainer = document.createElement('div');
  searchContainer.className = 'pball-search-container';
  const searchInput = document.createElement('input');
  searchInput.className = 'pball-search';
  searchInput.placeholder = 'Search moves...';
  searchInput.setAttribute('aria-label', 'Search moves');
  const searchButtons = document.createElement('div');
  searchButtons.className = 'search-buttons';
  const enterButton = document.createElement('button');
  enterButton.className = 'search-enter-button';
  enterButton.textContent = '✔';
  const clearButton = document.createElement('button');
  clearButton.className = 'pball-clear-btn';
  clearButton.textContent = 'X';

  let searchTimeout;
  const handleSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = searchInput.value.trim().toLowerCase();
      Array.from(movesList.children).forEach(move => {
        move.style.display = move.textContent.toLowerCase().includes(query)
          ? 'block'
          : 'none';
      });
    }, 300);
  };

  searchInput.addEventListener('input', handleSearch);
  enterButton.addEventListener('click', handleSearch);
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    handleSearch();
  });
  searchButtons.append(enterButton, clearButton);
  searchContainer.append(searchInput, searchButtons);
  section.append(searchContainer);

  // Moves list container with virtual scroll behavior
  const movesList = document.createElement('div');
  movesList.className = 'moves-list';
  movesList.style.maxHeight = '200px';
  movesList.style.overflowY = 'auto';
  movesList.style.display = 'grid';
  movesList.style.gap = '8px';

  data.moves.forEach(move => {
    const moveItem = document.createElement('div');
    moveItem.className = 'move-item';
    moveItem.textContent = move.move.name.replace(/-/g, ' ');
    moveItem.style.padding = '8px 12px';
    moveItem.style.background = 'var(--background-darker)';
    moveItem.style.borderRadius = '6px';
    moveItem.style.textTransform = 'capitalize';
moveItem.style.cursor = 'pointer';

    // Fetch and show move details on hover
    moveItem.addEventListener('mouseenter', async () => {
      try {
        const res = await fetch(move.move.url);
        const moveData = await res.json();
        const effectEntry = moveData.effect_entries.find(
          e => e.language.name === 'en'
        );
        const effectText = effectEntry
          ? effectEntry.short_effect.replace(/\n|\f/g, ' ')
          : 'No description available.';
        // Format move details
        const details = `
Name: ${moveData.name.replace(/-/g, ' ')}
Type: ${moveData.type.name.toUpperCase()}
Category: ${moveData.damage_class.name.toUpperCase()}
Power: ${moveData.power || '—'}
Accuracy: ${moveData.accuracy || '—'}
PP: ${moveData.pp}
Priority: ${moveData.priority}
Effect: ${effectText}
        `;
        this.showTooltip(moveItem, details);
      } catch (error) {
        console.error('Error fetching move data:', error);
      }
    });

    moveItem.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });

    movesList.appendChild(moveItem);
  });
  section.appendChild(movesList);
  return section;
}


  // HELD ITEMS SECTION
  createHeldItemsSection(data) {
    const section = document.createElement('section');
    section.className = 'held-items-section animate-fadeInUp';
    section.innerHTML = `<h3 class="section-title">HELD ITEMS</h3>`;
    const itemsGrid = document.createElement('div');
    itemsGrid.className = 'items-grid';
    itemsGrid.style.display = 'grid';
    itemsGrid.style.gridTemplateColumns =
      'repeat(auto-fit, minmax(120px, 1fr))';
    itemsGrid.style.gap = '12px';

    data.held_items.forEach(item => {
      const itemCard = document.createElement('div');
      itemCard.className = 'item-card';
      itemCard.textContent = item.item.name.replace(/-/g, ' ');
      itemCard.style.padding = '12px';
      itemCard.style.background = 'var(--background-darker)';
      itemCard.style.borderRadius = '8px';
      itemCard.style.textAlign = 'center';
      itemCard.style.textTransform = 'capitalize';
      itemsGrid.appendChild(itemCard);
    });
    section.appendChild(itemsGrid);
    return section;
  }

  // FORMS SECTION
  createFormsSection(data) {
    const section = document.createElement('section');
    section.className = 'forms-section animate-fadeInUp';
    section.innerHTML = `<h3 class="section-title">FORMS</h3>`;
    const formsGrid = document.createElement('div');
    formsGrid.className = 'forms-grid';
    formsGrid.style.display = 'grid';
    formsGrid.style.gridTemplateColumns =
      'repeat(auto-fit, minmax(120px, 1fr))';
    formsGrid.style.gap = '12px';

    data.forms.forEach(form => {
      const formCard = document.createElement('div');
      formCard.className = 'form-card';
      formCard.textContent = form.name.replace(/-/g, ' ');
      formCard.style.padding = '12px';
      formCard.style.background = 'var(--background-darker)';
      formCard.style.borderRadius = '8px';
      formCard.style.textAlign = 'center';
      formCard.style.textTransform = 'capitalize';
      formsGrid.appendChild(formCard);
    });
    section.appendChild(formsGrid);
    return section;
  }

  // STATS RADAR CHART SECTION (with Chart.js and animated rendering)
  createStatsRadarChart(data) {
    const section = document.createElement('section');
    section.className = 'stats-radar-card animate-fadeInUp';
    section.innerHTML = `
      <div class="stats-header">
        <h3 class="section-title">Stat Distribution</h3>
          </span>
          </div>
        </div>
      </div>
    `;
    const chartContainer = document.createElement('div');
    chartContainer.className = 'radar-container';
    chartContainer.style.position = 'relative';
    chartContainer.style.height = 'clamp(280px, 35vh, 400px)';
    chartContainer.style.margin = '16px 0';

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-label', 'Pokémon stat radar chart');
    canvas.style.touchAction = 'none';

    const typeColor = this.getTypeColor(data.types[0].type.name);
    const gradient = {
      light: this.hexToRgba(typeColor, 0.3),
      dark: this.hexToRgba(typeColor, 0.1)
    };

    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => this.drawEnhancedRadar(canvas, data, gradient);
      script.onerror = () => this.showChartError(chartContainer);
      document.head.appendChild(script);
    } else {
      this.drawEnhancedRadar(canvas, data, gradient);
    }
    chartContainer.appendChild(canvas);
    section.appendChild(chartContainer);
    return section;
  }

  drawEnhancedRadar(canvas, data, gradient) {
    try {
      const ctx = canvas.getContext('2d');
      const stats = data.stats.map(s => s.base_stat);
      const labels = data.stats.map(s => ({
        full: s.stat.name.replace(/-/g, ' '),
        short: this.getStatAbbreviation(s.stat.name)
      }));
      const chartGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      chartGradient.addColorStop(0, gradient.light);
      chartGradient.addColorStop(1, gradient.dark);

      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels.map(l => l.short),
          datasets: [
            {
              data: stats,
              backgroundColor: chartGradient,
              borderColor: this.hexToRgba(gradient.light, 0.8),
              borderWidth: 1.8,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: gradient.light,
              pointHoverRadius: 8,
              pointRadius: 4,
              pointHitRadius: 12,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 800,
            easing: 'easeOutQuint'
          },
          scales: {
            r: {
              beginAtZero: true,
              max: Math.ceil(Math.max(...stats) / 10) * 10 + 10,
              ticks: {
                display: false,
                count: 5,
                z: 1
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.12)',
                circular: true,
                lineWidth: 0.8
              },
              pointLabels: {
                color: '#ffffff',
                font: {
                  size: 13,
                  weight: '500'
                },
                callback: (value, index) => [`${value}`, stats[index]],
                padding: 18
              },
              angleLines: {
                color: 'rgba(255, 255, 255, 0.08)',
                lineWidth: 0.8
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              intersect: false,
              callbacks: {
                title: items => labels[items[0].dataIndex].full,
                label: context => `Base Stat: ${context.raw}`
              },
              bodyFont: { size: 13 },
              titleFont: { size: 12 },
              padding: 14,
              backgroundColor: 'rgba(28, 28, 34, 0.96)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              borderWidth: 1,
              cornerRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.24)'
            },
            annotation: {
              annotations: {
                avgLine: {
                  type: 'line',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: 1,
                  borderDash: [4, 4],
                  scaleID: 'r',
                  value: stats.reduce((a, b) => a + b, 0) / stats.length
                }
              }
            }
          },
          onHover: (event, elements) => {
            canvas.style.cursor = elements.length ? 'pointer' : 'default';
          }
        }
      });
    } catch (error) {
      this.showChartError(canvas.parentElement);
    }
  }

  // Utility to convert HEX to RGBA
  hexToRgba(hex, alpha = 1) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // Abbreviate stat names
  getStatAbbreviation(statName) {
    const abbreviations = {
      hp: 'HP',
      attack: 'ATK',
      defense: 'DEF',
      'special-attack': 'SP.ATK',
      'special-defense': 'SP.DEF',
      speed: 'SPD'
    };
    return abbreviations[statName] || statName.slice(0, 3).toUpperCase();
  }

  // Display error if Chart.js fails
  showChartError(container) {
    container.innerHTML = `
      <div class="chart-error">
        <svg class="error-icon" viewBox="0 0 24 24" width="48" height="48">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <div class="error-message">
          <h4>Chart Unavailable</h4>
          <p>Failed to load stat visualization</p>
        </div>
      </div>
    `;
  }

  // TYPE INTERACTIONS SECTION
  createTypeRelationsGrid(data) {
    const section = document.createElement('section');
    section.className = 'type-relations-grid animate-fadeInUp';
    section.innerHTML = `<h3 class="section-title">TYPE INTERACTIONS</h3>`;
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns =
      'repeat(auto-fit, minmax(160px, 1fr))';
    grid.style.gap = '12px';

    data.types.forEach(type => {
      const typeCard = document.createElement('div');
      typeCard.className = 'type-card';
      typeCard.innerHTML = `
        <div class="type-header">${type.type.name.toUpperCase()}</div>
        <div class="damage-relations">
          <div class="strengths">
            <h4>STRONG VS</h4>
            <div class="types-list"></div>
          </div>
          <div class="weaknesses">
            <h4>WEAK TO</h4>
            <div class="types-list"></div>
          </div>
        </div>
      `;
      const typeHeader = typeCard.querySelector('.type-header');
      typeHeader.style.background = this.getTypeColor(type.type.name);
      fetch(type.type.url)
        .then(res => res.json())
        .then(typeData => {
          const strengths = typeData.damage_relations.double_damage_to;
          const weaknesses = typeData.damage_relations.double_damage_from;
          strengths.forEach(t => {
            const badge = this.createTypeBadge(t.name);
            typeCard.querySelector('.strengths .types-list').appendChild(badge);
          });
          weaknesses.forEach(t => {
            const badge = this.createTypeBadge(t.name);
            typeCard.querySelector('.weaknesses .types-list').appendChild(badge);
          });
        });
      grid.appendChild(typeCard);
    });
    section.appendChild(grid);
    return section;
  }

  // Create a small type badge element
  createTypeBadge(typeName) {
    const badge = document.createElement('span');
    badge.className = 'type-badge small';
    badge.textContent = typeName.toUpperCase();
    badge.style.background = this.getTypeColor(typeName);
    badge.style.padding = '2px 8px';
    badge.style.borderRadius = '12px';
    badge.style.fontSize = '10px';
    return badge;
  }

  // Get a color based on the Pokémon type
  getTypeColor(typeName) {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return typeColors[typeName] || '#68A090';
  }
// EVOLUTION CHAIN VISUALIZATION WITH MULTIPLE IMAGE SOURCES & FALLBACK HANDLING
createEvolutionVisualization(chain) {
  const section = document.createElement('section');
  section.className = 'evolution-chain animate-fadeInUp';
  section.innerHTML = `<h3 class="section-title">EVOLUTION LINE</h3>`;
  const stages = this.parseEvolutionChain(chain);
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.gap = '0px';
  container.style.padding = '16px 0';

  stages.forEach((stage, index) => {
    const stageDiv = document.createElement('div');
    stageDiv.style.display = 'flex';
    stageDiv.style.flexDirection = 'column';
    stageDiv.style.alignItems = 'center';
    stageDiv.style.gap = '8px';

    if (index > 0) {
      const arrow = document.createElement('div');
      arrow.textContent = '→';
      arrow.style.fontSize = '24px';
      arrow.style.opacity = '0.6';
      container.appendChild(arrow);
    }
    const sprite = document.createElement('img');
    sprite.className = 'lazy';
    sprite.alt = stage.name;
    sprite.style.width = '64px';
    sprite.style.height = '64px';
    // Initially hidden until the image loads
    sprite.style.opacity = '0';

    // Attach onload event to reveal the image once it loads
    sprite.onload = () => {
      sprite.style.opacity = '1';
    };

    // Set multiple image sources and fallback handling
    const imageSources = [
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${stage.id}.gif`, // Animated
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${stage.id}.png`, // Official
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${stage.id}.svg`, // SVG
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`, // Default
      `https://via.placeholder.com/150x150?text=No+Image` // Placeholder
    ];

    let imgIndex = 0;
    function loadNextImage() {
      if (imgIndex >= imageSources.length) return;
      sprite.src = imageSources[imgIndex++];
      // If the current image fails to load, try the next one
      sprite.onerror = loadNextImage;
    }
    loadNextImage();

    const name = document.createElement('div');
    name.textContent = stage.name;
    name.style.fontWeight = '500';
    stageDiv.append(sprite, name);
    container.appendChild(stageDiv);
  });
  section.appendChild(container);
  // If you have a lazy loading observer, you may reinitialize it here:
  // this.initIntersectionObserver();
  return section;
}

// Recursively parse the evolution chain into an array of stages
parseEvolutionChain(chain, result = []) {
  const id = chain.species.url.split('/').slice(-2, -1)[0];
  result.push({ name: chain.species.name, id });
  if (chain.evolves_to.length > 0) {
    chain.evolves_to.forEach(e => this.parseEvolutionChain(e, result));
  }
  return result.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
}


    }

    new PokeballHelper();
  })();