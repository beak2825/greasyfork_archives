// ==UserScript==
// @name         Lazer GIF Control
// @namespace    https://greasyfork.org/users/your-profile
// @version      2.2
// @description  Advanced GIF controller with transparency support for Drawaria
// @author       лазер дмитрий прайм
// @match        *://drawaria.com/*
// @match        *://drawaria.online/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544933/Lazer%20GIF%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/544933/Lazer%20GIF%20Control.meta.js
// ==/UserScript==
// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===== //
let currentGif = null;
let isGifActive = false;
let gifOpacity = 0.8;

// ===== СОЗДАЁМ МОД-МЕНЮ ===== //
const modMenu = document.createElement('div');
modMenu.style.cssText = `
    position: fixed;
    top: 100px;
    left: 20px;
    width: 280px;
    background: linear-gradient(to right, #000000, #222, #000000);
    border: 2px solid #ff0000;
    border-radius: 10px;
    color: #ff0000;
    font-family: 'Arial Black', sans-serif;
    z-index: 10000;
    cursor: move;
    user-select: none;
    box-shadow: 0 0 15px #ff0000;
`;
modMenu.innerHTML = `
    <div style="
        padding: 10px;
        background: linear-gradient(to right, #000000, #500000);
        border-radius: 8px 8px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ff0000;
    ">
        <b style="
            text-shadow: 0 0 5px #ff0000; 
            font-size: 16px;
            background: linear-gradient(to right, #ff0000, #ff4500);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        ">LAZER GIF CONTROL</b>
        <div>
            <span id="toggleModMenu" style="cursor: pointer; color: #ff0000; font-weight: bold; margin-right: 10px;">[—]</span>
            <span id="closeModMenu" style="cursor: pointer; color: #ff0000; font-weight: bold;">[×]</span>
        </div>
    </div>
    <div id="modMenuContent" style="padding: 15px; background: linear-gradient(to bottom, #111, #000); border-radius: 0 0 8px 8px;">
        <input type="file" id="gifUpload" accept="image/gif" style="width: 100%; margin-bottom: 15px; background: #222; color: #ff0000; border: 1px solid #ff0000; padding: 5px;">
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between;">
                <span>Opacity:</span>
                <span id="opacityValue">${Math.round(gifOpacity * 100)}%</span>
            </div>
            <input type="range" id="opacitySlider" min="10" max="100" value="${gifOpacity * 100}" style="width: 100%;">
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button id="activateGif" style="flex: 1; padding: 8px; background: linear-gradient(to bottom, #00aa00, #006600); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">SHOW GIF</button>
            <button id="deactivateGif" style="flex: 1; padding: 8px; background: linear-gradient(to bottom, #aa0000, #660000); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; display: none;">HIDE GIF</button>
        </div>
        <button id="youtubeBtn" style="width: 100%; padding: 8px; background: linear-gradient(to bottom, #cc0000, #990000); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 5px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            YouTube
        </button>
    </div>
`;
document.body.appendChild(modMenu);

// ===== ОСНОВНЫЕ ФУНКЦИИ ===== //
// Закрытие панели
document.getElementById('closeModMenu').addEventListener('click', () => {
    modMenu.style.display = 'none';
});

// Перетаскивание
let isDragging = false;
let offsetX, offsetY;

modMenu.querySelector('div').addEventListener('mousedown', (e) => {
    if (!['toggleModMenu', 'closeModMenu'].includes(e.target.id)) {
        isDragging = true;
        offsetX = e.clientX - modMenu.getBoundingClientRect().left;
        offsetY = e.clientY - modMenu.getBoundingClientRect().top;
        modMenu.style.opacity = '0.9';
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        modMenu.style.left = (e.clientX - offsetX) + 'px';
        modMenu.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    modMenu.style.opacity = '1';
});

// Сворачивание/разворачивание
document.getElementById('toggleModMenu').addEventListener('click', () => {
    const content = document.getElementById('modMenuContent');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
    document.getElementById('toggleModMenu').textContent = content.style.display === 'none' ? '[+]' : '[—]';
});

// Управление прозрачностью
document.getElementById('opacitySlider').addEventListener('input', (e) => {
    gifOpacity = e.target.value / 100;
    document.getElementById('opacityValue').textContent = `${e.target.value}%`;
    if (currentGif) currentGif.style.opacity = gifOpacity;
});

// Кнопка YouTube
document.getElementById('youtubeBtn').addEventListener('click', () => {
    window.open('https://www.youtube.com/@YouTubeDrawaria/videos', '_blank');
});

// Анимация GIF
const showGifWithAnimation = (src) => {
    if (currentGif) currentGif.remove();
    
    currentGif = document.createElement('img');
    currentGif.src = src;
    currentGif.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 150px;
        height: 150px;
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    document.body.appendChild(currentGif);
    
    setTimeout(() => {
        currentGif.style.opacity = gifOpacity;
        currentGif.style.transform = 'scale(1)';
    }, 10);
    
    isGifActive = true;
    document.getElementById('activateGif').style.display = 'none';
    document.getElementById('deactivateGif').style.display = 'block';
};

// Активация GIF
document.getElementById('activateGif').addEventListener('click', () => {
    const file = document.getElementById('gifUpload').files[0];
    if (!file) return alert("Select GIF file first!");
    const reader = new FileReader();
    reader.onload = (e) => showGifWithAnimation(e.target.result);
    reader.readAsDataURL(file);
});

// Деактивация GIF
document.getElementById('deactivateGif').addEventListener('click', () => {
    if (!currentGif) return;
    currentGif.style.opacity = '0';
    currentGif.style.transform = 'scale(0.8)';
    setTimeout(() => {
        currentGif.remove();
        currentGif = null;
        isGifActive = false;
        document.getElementById('activateGif').style.display = 'block';
        document.getElementById('deactivateGif').style.display = 'none';
    }, 500);
});

// Горячая клавиша (Alt+G)
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'g') {
        modMenu.style.display = modMenu.style.display === 'none' ? 'block' : 'none';
    }
});