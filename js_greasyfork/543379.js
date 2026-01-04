// ==UserScript==
// @name         Tribal.io Item Spawner 
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Press J to toggle - item spawner
// @author       1heo
// @match        https://*.tribals.io/*
// @grant        none
// @icon         https://tribals.io/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/543379/Tribalio%20Item%20Spawner.user.js
// @updateURL https://update.greasyfork.org/scripts/543379/Tribalio%20Item%20Spawner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // UI State
    let uiVisible = false;
    const uiContainer = document.createElement('div');
    const notification = document.createElement('div');
    let selectedItem = null;

    // Only actual Tribal.io items
    const TRIBAL_ITEMS = [
        // Resources
        { id: 'wood', name: 'Wood', type: 'resource', icon: '🪵', color: '#8B4513' },
        { id: 'stone', name: 'Stone', type: 'resource', icon: '🪨', color: '#808080' },
        { id: 'gold', name: 'Gold', type: 'resource', icon: '💰', color: '#FFD700' },
        { id: 'food', name: 'Food', type: 'resource', icon: '🍖', color: '#FF6347' },

        // Weapons
        { id: 'spear', name: 'Spear', type: 'weapon', icon: '🔱', color: '#708090' },
        { id: 'bow', name: 'Bow', type: 'weapon', icon: '🏹', color: '#964B00' },
        { id: 'rifle', name: 'Rifle', type: 'weapon', icon: '🔫', color: '#36454F' },

        // Buildings
        { id: 'wall', name: 'Wall', type: 'building', icon: '🧱', color: '#A9A9A9' },
        { id: 'gate', name: 'Gate', type: 'building', icon: '🚪', color: '#696969' },
        { id: 'tower', name: 'Tower', type: 'building', icon: '🏗️', color: '#555555' },

        // Special
        { id: 'ammo', name: 'Ammo', type: 'special', icon: '🔘', color: '#FFFF00' }
    ];

    // Create notification
    function createNotification() {
        notification.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            background: rgba(0,0,0,0.7);
            padding: 8px 15px;
            border-radius: 20px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 10000;
            pointer-events: none;
            border: 1px solid #4CAF50;
        `;
        notification.textContent = "Press J to enable the item spawner";
        document.body.appendChild(notification);

        // Hide after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 1000);
        }, 5000);
    }

    // Create main UI
    function createUI() {
        uiContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            background: rgba(30, 30, 45, 0.97);
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 9999;
            font-family: Arial, sans-serif;
            backdrop-filter: blur(8px);
            border: 1px solid #5a2d8a;
            display: none;
            overflow: hidden;
        `;

        uiContainer.innerHTML = `
            <h3 style="color:#a044ff; margin:0 0 15px 0; text-align:center;">Item Spawner (Visual Only)</h3>
            <input type="text" id="item-search" placeholder="Search items..."
                   style="width:100%; padding:8px; margin-bottom:15px;
                          background:rgba(0,0,0,0.3); border:1px solid #5a2d8a;
                          color:white; border-radius:5px;">
            <div id="item-list" style="overflow-y:auto; max-height:50vh; padding-right:5px;">
                ${generateItemList(TRIBAL_ITEMS)}
            </div>
            <div id="selection-panel" style="margin-top:15px; display:none;">
                <div style="display:flex; align-items:center; margin-bottom:10px;">
                    <span style="color:#d0b0ff; flex:1;">Amount to spawn:</span>
                    <input type="number" id="item-amount" min="1" max="99" value="1"
                           style="width:60px; padding:5px; background:rgba(0,0,0,0.3);
                                  border:1px solid #5a2d8a; color:white; border-radius:3px;">
                </div>
                <button id="confirm-spawn" style="width:100%; padding:8px;
                        background:#4CAF50; border:none; border-radius:5px;
                        color:white; cursor:pointer; font-weight:bold;">CONFIRM</button>
            </div>
            <div style="color:#b0a0ff; font-size:11px; text-align:center; margin-top:10px;">
                Visual effect only - does not affect actual inventory
            </div>
        `;

        document.body.appendChild(uiContainer);
        setupEventListeners();
    }

    function generateItemList(items) {
        return items.map(item => `
            <div class="item-card" data-id="${item.id}"
                 style="padding:8px; margin-bottom:8px; background:rgba(${hexToRgb(item.color)},0.2);
                        border:1px solid ${item.color}; border-radius:5px; cursor:pointer;
                        display:flex; align-items:center; transition:all 0.2s;">
                <span style="font-size:20px; margin-right:10px;">${item.icon}</span>
                <div style="flex:1;">
                    <div style="font-weight:bold; color:#f0e0ff;">${item.name}</div>
                    <div style="font-size:11px; color:#b0a0ff; text-transform:capitalize;">${item.type}</div>
                </div>
            </div>
        `).join('');
    }

    function setupEventListeners() {
        // Search functionality
        document.getElementById('item-search').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = TRIBAL_ITEMS.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.type.toLowerCase().includes(searchTerm)
            );
            document.getElementById('item-list').innerHTML = generateItemList(filtered);
            setupItemSelection(); // Rebind click events
        });

        // Confirm button
        document.getElementById('confirm-spawn').addEventListener('click', spawnItems);
    }

    function setupItemSelection() {
        document.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                selectedItem = TRIBAL_ITEMS.find(item => item.id === card.dataset.id);

                // Show selection panel
                document.getElementById('selection-panel').style.display = 'block';
                document.getElementById('item-amount').value = 1;

                // Highlight selected
                document.querySelectorAll('.item-card').forEach(c => {
                    c.style.background = c === card ?
                        `rgba(${hexToRgb(selectedItem.color)},0.4)` :
                        `rgba(${hexToRgb(c.dataset.color || '#5a2d8a')},0.2)`;
                });
            });
        });
    }

    function spawnItems() {
        if (!selectedItem) return;

        const amount = parseInt(document.getElementById('item-amount').value) || 1;
        console.log(`Visually spawning ${amount} ${selectedItem.name}(s)`);

        // Visual effect only - doesn't affect real inventory
        const player = document.querySelector('.player-entity, .player-character');
        if (!player) return;

        for (let i = 0; i < Math.min(amount, 15); i++) {
            setTimeout(() => {
                const item = document.createElement('div');
                item.style.cssText = `
                    position: absolute;
                    left: ${50 + (Math.random() * 20 - 10)}%;
                    top: ${50 + (Math.random() * 20 - 10)}%;
                    width: 24px;
                    height: 24px;
                    background: ${selectedItem.color};
                    color: white;
                    border-radius: ${selectedItem.type === 'building' ? '2px' : '50%'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    z-index: 9998;
                    pointer-events: none;
                    opacity: 0.9;
                    transform: translate(-50%, -50%);
                    transition: all 0.7s ease-out;
                `;
                item.textContent = selectedItem.icon;
                player.parentNode.appendChild(item);

                // Animate toward inventory
                setTimeout(() => {
                    item.style.left = '90%';
                    item.style.top = '90%';
                    item.style.opacity = '0';
                    setTimeout(() => item.remove(), 700);
                }, 100);
            }, i * 100);
        }

        // Reset selection
        document.getElementById('selection-panel').style.display = 'none';
        selectedItem = null;
    }

    function toggleUI() {
        uiVisible = !uiVisible;
        uiContainer.style.display = uiVisible ? 'block' : 'none';
        if (uiVisible) {
            document.getElementById('item-search').focus();
            document.getElementById('selection-panel').style.display = 'none';
        }
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    }

    // Initialize
    createUI();
    createNotification();
    setupItemSelection();

    // Key listener
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'j' && !e.target.matches('input, textarea')) {
            toggleUI();
            e.preventDefault();
        }
    });
})();