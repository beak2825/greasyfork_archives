// ==UserScript==
// @name         Drawaria Advanced Drawing Studio
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Advanced drawing tools with stickers, filters, layers, and collaborative features for drawaria.online!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/543930/Drawaria%20Advanced%20Drawing%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/543930/Drawaria%20Advanced%20Drawing%20Studio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Advanced drawing state management
    const drawingState = {
        currentTool: 'brush',
        currentLayer: 0,
        layers: [],
        history: [],
        stickers: [],
        filters: {
            blur: 0,
            brightness: 100,
            contrast: 100,
            saturation: 100,
            hue: 0
        },
        brushSettings: {
            size: 5,
            opacity: 1,
            texture: 'smooth'
        }
    };

    // Sticker library
    const stickerLibrary = {
        emojis: ['😀', '😂', '❤️', '🔥', '⭐', '🌈', '🦄', '🎨', '🎭', '🎪', '🎯', '🎲'],
        shapes: ['●', '■', '▲', '♦', '★', '♥', '♠', '♣', '♪', '☀', '☁', '⚡'],
        arrows: ['→', '←', '↑', '↓', '↗', '↘', '↙', '↖', '⟲', '⟳', '↔', '↕']
    };

    // Create advanced toolbar
    function createAdvancedToolbar() {
        const toolbar = document.createElement('div');
        toolbar.innerHTML = `
            <div id="advanced-toolbar" style="
                position: fixed;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                background: linear-gradient(145deg, #2d3748, #4a5568);
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.3);
                color: white;
                font-family: 'Segoe UI', sans-serif;
                z-index: 10000;
                max-height: 80vh;
                overflow-y: auto;
                width: 280px;
                backdrop-filter: blur(10px);
            ">
                <h2 style="margin: 0 0 20px 0; text-align: center; color: #63b3ed;">🎨 Studio Pro</h2>
                
                <!-- Drawing Tools -->
                <div class="tool-section">
                    <h3 style="color: #90cdf4; margin: 15px 0 10px 0; font-size: 14px;">✏️ DRAWING TOOLS</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button class="tool-btn" data-tool="brush">🖌️ Brush</button>
                        <button class="tool-btn" data-tool="pencil">✏️ Pencil</button>
                        <button class="tool-btn" data-tool="spray">💨 Spray</button>
                        <button class="tool-btn" data-tool="marker">🖍️ Marker</button>
                    </div>
                </div>

                <!-- Brush Settings -->
                <div class="tool-section">
                    <h3 style="color: #90cdf4; margin: 15px 0 10px 0; font-size: 14px;">⚙️ BRUSH SETTINGS</h3>
                    <div style="margin: 10px 0;">
                        <label>Size: <span id="brush-size-display">5</span></label>
                        <input type="range" id="brush-size" min="1" max="50" value="5" style="width: 100%;">
                    </div>
                    <div style="margin: 10px 0;">
                        <label>Opacity: <span id="opacity-display">100</span>%</label>
                        <input type="range" id="brush-opacity" min="10" max="100" value="100" style="width: 100%;">
                    </div>
                </div>

                <!-- Stickers -->
                <div class="tool-section">
                    <h3 style="color: #90cdf4; margin: 15px 0 10px 0; font-size: 14px;">🎪 STICKERS</h3>
                    <div id="sticker-tabs" style="display: flex; margin-bottom: 10px;">
                        <button class="sticker-tab active" data-category="emojis">😀</button>
                        <button class="sticker-tab" data-category="shapes">●</button>
                        <button class="sticker-tab" data-category="arrows">→</button>
                    </div>
                    <div id="sticker-grid" style="
                        display: grid; 
                        grid-template-columns: repeat(4, 1fr); 
                        gap: 5px; 
                        max-height: 120px; 
                        overflow-y: auto;
                    "></div>
                </div>

                <!-- Layers -->
                <div class="tool-section">
                    <h3 style="color: #90cdf4; margin: 15px 0 10px 0; font-size: 14px;">📚 LAYERS</h3>
                    <button id="add-layer" style="width: 100%; margin-bottom: 10px;">➕ New Layer</button>
                    <div id="layer-list" style="max-height: 100px; overflow-y: auto;"></div>
                </div>

                <!-- Filters -->
                <div class="tool-section">
                    <h3 style="color: #90cdf4; margin: 15px 0 10px 0; font-size: 14px;">🎭 FILTERS</h3>
                    <div style="margin: 8px 0;">
                        <label>Blur: <span id="blur-display">0</span></label>
                        <input type="range" id="filter-blur" min="0" max="10" value="0" style="width: 100%;">
                    </div>
                    <div style="margin: 8px 0;">
                        <label>Brightness: <span id="brightness-display">100</span>%</label>
                        <input type="range" id="filter-brightness" min="50" max="200" value="100" style="width: 100%;">
                    </div>
                    <div style="margin: 8px 0;">
                        <label>Contrast: <span id="contrast-display">100</span>%</label>
                        <input type="range" id="filter-contrast" min="50" max="200" value="100" style="width: 100%;">
                    </div>
                </div>

                <!-- Special Effects -->
                <div class="tool-section">
                    <h3 style="color: #90cdf4; margin: 15px 0 10px 0; font-size: 14px;">✨ SPECIAL EFFECTS</h3>
                    <button id="mirror-mode">🪞 Mirror Draw</button>
                    <button id="kaleidoscope-mode">🔮 Kaleidoscope</button>
                    <button id="neon-mode">💡 Neon Glow</button>
                    <button id="pixel-mode">🎮 Pixel Art</button>
                </div>

                <!-- Quick Actions -->
                <div class="tool-section">
                    <h3 style="color: #90cdf4; margin: 15px 0 10px 0; font-size: 14px;">⚡ QUICK ACTIONS</h3>
                    <button id="save-artwork">💾 Save Art</button>
                    <button id="clear-canvas">🗑️ Clear All</button>
                    <button id="undo-action">↶ Undo</button>
                    <button id="redo-action">↷ Redo</button>
                </div>
            </div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .tool-btn, .sticker-tab, #advanced-toolbar button {
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 12px;
                margin: 2px 0;
            }
            
            .tool-btn:hover, .sticker-tab:hover, #advanced-toolbar button:hover {
                background: rgba(99, 179, 237, 0.3);
                border-color: #63b3ed;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(99, 179, 237, 0.3);
            }
            
            .tool-btn.active, .sticker-tab.active {
                background: #63b3ed;
                border-color: #3182ce;
            }
            
            .sticker-item {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 8px;
                border-radius: 6px;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s ease;
                font-size: 16px;
            }
            
            .sticker-item:hover {
                background: rgba(99, 179, 237, 0.3);
                transform: scale(1.1);
            }
            
            .layer-item {
                background: rgba(255, 255, 255, 0.1);
                padding: 8px;
                margin: 4px 0;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .layer-item.active {
                background: #63b3ed;
            }
            
            #advanced-toolbar input[type="range"] {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                height: 6px;
                margin: 5px 0;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(toolbar);
        
        return toolbar;
    }

    // Advanced drawing engine
    class AdvancedDrawingEngine {
        constructor() {
            this.canvas = null;
            this.ctx = null;
            this.isDrawing = false;
            this.mirrorMode = false;
            this.kaleidoscopeMode = false;
            this.neonMode = false;
            this.pixelMode = false;
            this.setupCanvas();
            this.setupEventListeners();
        }

        setupCanvas() {
            // Create overlay canvas for advanced features
            this.canvas = document.createElement('canvas');
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: 9998;
            `;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.ctx = this.canvas.getContext('2d');
            document.body.appendChild(this.canvas);
        }

        setupEventListeners() {
            // Enable drawing on our overlay when in special modes
            document.addEventListener('mousedown', (e) => {
                if (this.mirrorMode || this.kaleidoscopeMode || this.neonMode) {
                    this.canvas.style.pointerEvents = 'auto';
                    this.isDrawing = true;
                    this.draw(e);
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (this.isDrawing) this.draw(e);
            });

            document.addEventListener('mouseup', () => {
                this.isDrawing = false;
            });
        }

        draw(e) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.ctx.globalAlpha = drawingState.brushSettings.opacity / 100;
            this.ctx.lineWidth = drawingState.brushSettings.size;
            this.ctx.lineCap = 'round';

            if (this.neonMode) {
                this.ctx.shadowColor = '#00ffff';
                this.ctx.shadowBlur = 20;
                this.ctx.strokeStyle = '#00ffff';
            } else {
                this.ctx.shadowBlur = 0;
                this.ctx.strokeStyle = '#ffffff';
            }

            this.ctx.beginPath();
            
            if (this.mirrorMode) {
                // Draw on both sides
                this.ctx.arc(x, y, drawingState.brushSettings.size/2, 0, Math.PI * 2);
                this.ctx.arc(window.innerWidth - x, y, drawingState.brushSettings.size/2, 0, Math.PI * 2);
            } else if (this.kaleidoscopeMode) {
                // Draw kaleidoscope pattern
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI * 2) / 8;
                    const newX = centerX + (x - centerX) * Math.cos(angle) - (y - centerY) * Math.sin(angle);
                    const newY = centerY + (x - centerX) * Math.sin(angle) + (y - centerY) * Math.cos(angle);
                    this.ctx.arc(newX, newY, drawingState.brushSettings.size/2, 0, Math.PI * 2);
                }
            } else {
                this.ctx.arc(x, y, drawingState.brushSettings.size/2, 0, Math.PI * 2);
            }
            
            this.ctx.fill();
        }

        applyFilters() {
            const filters = drawingState.filters;
            const filterString = `
                blur(${filters.blur}px)
                brightness(${filters.brightness}%)
                contrast(${filters.contrast}%)
                saturate(${filters.saturation}%)
                hue-rotate(${filters.hue}deg)
            `;
            this.canvas.style.filter = filterString;
        }

        addSticker(sticker, x, y) {
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(sticker, x, y);
        }
    }

    // Initialize the advanced drawing system
    function init() {
        const toolbar = createAdvancedToolbar();
        const engine = new AdvancedDrawingEngine();

        // Load stickers
        function loadStickers(category) {
            const grid = document.getElementById('sticker-grid');
            grid.innerHTML = '';
            stickerLibrary[category].forEach(sticker => {
                const item = document.createElement('div');
                item.className = 'sticker-item';
                item.textContent = sticker;
                item.onclick = () => {
                    // Enable sticker placement mode
                    document.body.style.cursor = 'crosshair';
                    const handler = (e) => {
                        engine.addSticker(sticker, e.clientX, e.clientY);
                        document.body.style.cursor = 'default';
                        document.removeEventListener('click', handler);
                    };
                    document.addEventListener('click', handler);
                };
                grid.appendChild(item);
            });
        }

        // Initialize sticker grid
        loadStickers('emojis');

        // Event listeners for toolbar
        document.querySelectorAll('.sticker-tab').forEach(tab => {
            tab.onclick = (e) => {
                document.querySelectorAll('.sticker-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                loadStickers(e.target.dataset.category);
            };
        });

        // Brush settings
        document.getElementById('brush-size').oninput = (e) => {
            drawingState.brushSettings.size = parseInt(e.target.value);
            document.getElementById('brush-size-display').textContent = e.target.value;
        };

        document.getElementById('brush-opacity').oninput = (e) => {
            drawingState.brushSettings.opacity = parseInt(e.target.value);
            document.getElementById('opacity-display').textContent = e.target.value;
        };

        // Filter controls
        document.getElementById('filter-blur').oninput = (e) => {
            drawingState.filters.blur = parseInt(e.target.value);
            document.getElementById('blur-display').textContent = e.target.value;
            engine.applyFilters();
        };

        document.getElementById('filter-brightness').oninput = (e) => {
            drawingState.filters.brightness = parseInt(e.target.value);
            document.getElementById('brightness-display').textContent = e.target.value;
            engine.applyFilters();
        };

        document.getElementById('filter-contrast').oninput = (e) => {
            drawingState.filters.contrast = parseInt(e.target.value);
            document.getElementById('contrast-display').textContent = e.target.value;
            engine.applyFilters();
        };

        // Special effects
        document.getElementById('mirror-mode').onclick = () => {
            engine.mirrorMode = !engine.mirrorMode;
            document.getElementById('mirror-mode').style.background = 
                engine.mirrorMode ? '#63b3ed' : 'rgba(255, 255, 255, 0.1)';
        };

        document.getElementById('kaleidoscope-mode').onclick = () => {
            engine.kaleidoscopeMode = !engine.kaleidoscopeMode;
            document.getElementById('kaleidoscope-mode').style.background = 
                engine.kaleidoscopeMode ? '#63b3ed' : 'rgba(255, 255, 255, 0.1)';
        };

        document.getElementById('neon-mode').onclick = () => {
            engine.neonMode = !engine.neonMode;
            document.getElementById('neon-mode').style.background = 
                engine.neonMode ? '#63b3ed' : 'rgba(255, 255, 255, 0.1)';
        };

        // Quick actions
        document.getElementById('save-artwork').onclick = () => {
            const link = document.createElement('a');
            link.download = `drawaria-art-${Date.now()}.png`;
            link.href = engine.canvas.toDataURL();
            link.click();
        };

        document.getElementById('clear-canvas').onclick = () => {
            if (confirm('Clear all your artwork?')) {
                engine.ctx.clearRect(0, 0, engine.canvas.width, engine.canvas.height);
            }
        };

        // Welcome animation
        setTimeout(() => {
            const welcome = document.createElement('div');
            welcome.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    left: 320px;
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    color: white;
                    padding: 20px;
                    border-radius: 15px;
                    z-index: 10001;
                    animation: slideIn 0.5s ease-out;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                ">
                    <h3>🎨 Advanced Studio Activated!</h3>
                    <p>• Try Mirror Drawing mode! 🪞</p>
                    <p>• Add stickers to your art! 🎪</p>
                    <p>• Apply real-time filters! 🎭</p>
                    <p>• Create with special effects! ✨</p>
                </div>
            `;

            const welcomeStyle = document.createElement('style');
            welcomeStyle.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(welcomeStyle);
            document.body.appendChild(welcome);

            setTimeout(() => welcome.remove(), 6000);
        }, 1000);

        console.log('🎨 Advanced Drawing Studio loaded!');
    }

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
