// ==UserScript==
// @name         Drawaria Online - Ultimate Mod
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds YouTube player, virtual player, chat bubbles, and image upload for drawing in Drawaria Online.
// @author       Dipsan Dhimal
// @license      MIT
// @match        https://drawaria.online/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/524884/Drawaria%20Online%20-%20Ultimate%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/524884/Drawaria%20Online%20-%20Ultimate%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 💡 Custom Styling
    GM_addStyle(`
        .custom-message {
            position: fixed;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 12px;
            padding: 10px 15px;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
            animation: fadeIn 0.5s ease-in-out;
            z-index: 10000;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
        .draggable {
            cursor: grab;
        }
    `);

    // 📺 YouTube Video Player (Draggable)
    function addYouTubeVideo(videoId) {
        const container = document.createElement('div');
        container.innerHTML = `
            <iframe width="400" height="225" src="https://www.youtube.com/embed/${videoId}?autoplay=1"
            frameborder="0" allowfullscreen class="draggable"></iframe>
        `;
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.right = '10px';
        container.style.zIndex = '10001';
        document.body.appendChild(container);

        // Drag Functionality
        let isDragging = false, startX, startY;
        container.addEventListener("mousedown", function(e) {
            isDragging = true;
            startX = e.clientX - container.offsetLeft;
            startY = e.clientY - container.offsetTop;
        });
        document.addEventListener("mousemove", function(e) {
            if (isDragging) {
                container.style.left = e.clientX - startX + "px";
                container.style.top = e.clientY - startY + "px";
            }
        });
        document.addEventListener("mouseup", function() {
            isDragging = false;
        });
    }

    addYouTubeVideo('dQw4w9WgXcQ'); // Replace with actual video ID

    // 🎭 Virtual Player (Moves Smoothly)
    function createVirtualPlayer() {
        const player = document.createElement('div');
        player.style.width = '50px';
        player.style.height = '50px';
        player.style.backgroundColor = '#00f';
        player.style.position = 'absolute';
        player.style.borderRadius = '50%';
        player.style.zIndex = '9999';
        document.body.appendChild(player);

        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;

        function move() {
            x += (Math.random() - 0.5) * 100;
            y += (Math.random() - 0.5) * 100;
            x = Math.max(0, Math.min(window.innerWidth - 50, x));
            y = Math.max(0, Math.min(window.innerHeight - 50, y));
            player.style.transform = `translate(${x}px, ${y}px)`;
            setTimeout(move, 1000);
        }
        move();
    }

    createVirtualPlayer();

    // 💬 Message Bubbles (Better Design)
    function createMessageBubble(text) {
        const bubble = document.createElement('div');
        bubble.classList.add('custom-message');
        bubble.textContent = text;
        bubble.style.left = `${Math.random() * (window.innerWidth - 200) + 50}px`;
        bubble.style.top = `${Math.random() * (window.innerHeight - 100) + 50}px`;

        document.body.appendChild(bubble);
        setTimeout(() => bubble.remove(), 5000);
    }

    setInterval(() => {
        const messages = ['🔥 Cool!', '🎨 Nice Drawing!', '💯 Epic!', '👀 Watching...'];
        createMessageBubble(messages[Math.floor(Math.random() * messages.length)]);
    }, 3000);

    // 🎨 Image Upload for Drawing (Movable & Resizable)
    function addImageUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.position = 'fixed';
        input.style.top = '10px';
        input.style.right = '10px';
        input.style.zIndex = '10001';
        document.body.appendChild(input);

        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function() {
                const img = new Image();
                img.src = reader.result;
                img.style.position = 'absolute';
                img.style.left = '100px';
                img.style.top = '100px';
                img.style.width = '300px';
                img.style.height = 'auto';
                img.style.border = '2px solid red';
                img.style.cursor = 'move';
                img.style.zIndex = '10002';
                document.body.appendChild(img);

                // Drag and Resize
                let isDragging = false, offsetX, offsetY;
                img.addEventListener('mousedown', function(e) {
                    isDragging = true;
                    offsetX = e.clientX - img.offsetLeft;
                    offsetY = e.clientY - img.offsetTop;
                });
                document.addEventListener('mousemove', function(e) {
                    if (isDragging) {
                        img.style.left = e.clientX - offsetX + 'px';
                        img.style.top = e.clientY - offsetY + 'px';
                    }
                });
                document.addEventListener('mouseup', function() {
                    isDragging = false;
                });

                // Resize with scroll
                img.addEventListener('wheel', function(e) {
                    e.preventDefault();
                    let newWidth = parseInt(img.style.width) + (e.deltaY > 0 ? -10 : 10);
                    img.style.width = `${Math.max(50, newWidth)}px`;
                });

                // Add to Canvas
                img.addEventListener('dblclick', function() {
                    const canvas = document.querySelector('canvas');
                    if (!canvas) return;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    img.remove();
                });
            };
            reader.readAsDataURL(file);
        });
    }

    addImageUpload();
})();
