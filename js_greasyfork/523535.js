// ==UserScript==
// @name         Snow Effect with Adjustable Width3
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  雪エフェクトのオンオフボタン（幅調整可能、雪の量記憶機能、長押しで連続変更可能）
// @author
// @match        *://drrrkari.com/room/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523535/Snow%20Effect%20with%20Adjustable%20Width3.user.js
// @updateURL https://update.greasyfork.org/scripts/523535/Snow%20Effect%20with%20Adjustable%20Width3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CSSスタイルを追加
    const style = document.createElement('style');
    style.textContent = `
        .snow {
            position: fixed;
            background-color: white;
            border-radius: 50%;
            z-index: 9999;
            pointer-events: none;
        }
        #snow-toggle {
            position: fixed;
            z-index: 10000;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            border: none;
            border-radius: 5px;
            cursor: move;
            resize: horizontal;
            overflow: hidden;
        }
        #toggle-text {
            flex-grow: 1;
            text-align: center;
        }
        #snow-quantity-controls {
            display: flex;
            gap: 5px;
        }
        .quantity-button {
            width: 20px;
            height: 20px;
            background-color: rgba(255, 255, 255, 0.8);
            color: black;
            font-size: 14px;
            line-height: 20px;
            text-align: center;
            border-radius: 50%;
            cursor: pointer;
            user-select: none;
        }
        .quantity-button:hover {
            background-color: rgba(255, 255, 255, 1);
        }
        #resize-handle {
            width: 5px;
            height: 100%;
            background: rgba(255, 255, 255, 0.5);
            cursor: ew-resize;
        }
    `;
    document.head.appendChild(style);

    let snowEffect = null;
    let snowEnabled = false;
    let isDragging = false;
    let isResizing = false;
    let offsetX, offsetY;
    let snowQuantity = parseInt(localStorage.getItem('snowQuantity')) || 10; // 記憶された雪の量を読み込み
    const POSITION_KEY = 'snowTogglePosition';
    const WIDTH_KEY = 'snowToggleWidth';
    let holdInterval = null; // 長押し用

    class ATSnow {
        constructor() {
            this.snowflakes = [];
            this.moveInterval = null;
            this.createInterval = null;
        }

        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        getWindowWidth() {
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        }

        getWindowHeight() {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        }

        createSnow() {
            const snowflake = document.createElement('div');
            snowflake.className = 'snow';
            snowflake.style.width = `${this.getRandomInt(5, 15)}px`;
            snowflake.style.height = snowflake.style.width;
            snowflake.style.left = `${this.getRandomInt(0, this.getWindowWidth())}px`;
            snowflake.style.top = `-${this.getRandomInt(10, 50)}px`;
            snowflake.style.opacity = Math.random().toString();
            document.body.appendChild(snowflake);
            this.snowflakes.push(snowflake);
        }

        moveSnow() {
            this.snowflakes.forEach((snowflake, index) => {
                const top = parseFloat(snowflake.style.top);
                const left = parseFloat(snowflake.style.left);
                if (top > this.getWindowHeight()) {
                    snowflake.remove();
                    this.snowflakes.splice(index, 1);
                } else {
                    snowflake.style.top = `${top + this.getRandomInt(1, 3)}px`;
                    snowflake.style.left = `${left + this.getRandomInt(-2, 2)}px`;
                }
            });
        }

        start() {
            this.createInterval = setInterval(() => {
                for (let i = 0; i < snowQuantity / 5; i++) {
                    this.createSnow();
                }
            }, 200);
            this.moveInterval = setInterval(() => {
                this.moveSnow();
            }, 50);
        }

        stop() {
            clearInterval(this.createInterval);
            clearInterval(this.moveInterval);
            this.snowflakes.forEach(snowflake => snowflake.remove());
            this.snowflakes = [];
        }
    }

    function toggleSnow() {
        if (isDragging || isResizing) return;

        snowEnabled = !snowEnabled;
        const button = document.getElementById('toggle-text');
        button.textContent = snowEnabled ? "雪を止める" : "雪を降らせる";

        if (snowEnabled) {
            if (!snowEffect) {
                snowEffect = new ATSnow();
                snowEffect.start();
            }
        } else if (snowEffect) {
            snowEffect.stop();
            snowEffect = null;
        }
    }

    function updateSnowQuantity(change) {
        snowQuantity = Math.max(1, snowQuantity + change);
        localStorage.setItem('snowQuantity', snowQuantity);
        const quantityDisplay = document.getElementById('quantity-display');
        quantityDisplay.textContent = snowQuantity;
    }

    function startHold(change) {
        updateSnowQuantity(change);
        holdInterval = setInterval(() => {
            updateSnowQuantity(change);
        }, 100);
    }

    function stopHold() {
        clearInterval(holdInterval);
    }

    function saveButtonState(x, y, width) {
        localStorage.setItem(POSITION_KEY, JSON.stringify({ x, y }));
        localStorage.setItem(WIDTH_KEY, width);
    }

    function loadButtonState() {
        const position = localStorage.getItem(POSITION_KEY);
        const width = localStorage.getItem(WIDTH_KEY);
        return {
            position: position ? JSON.parse(position) : { x: window.innerWidth - 130, y: window.innerHeight - 50 },
            width: width ? parseInt(width, 10) : 120
        };
    }

    const toggleButton = document.createElement('div');
    toggleButton.id = 'snow-toggle';
    toggleButton.innerHTML = `
        <div id="toggle-text">雪を降らせる</div>
        <div id="snow-quantity-controls">
            <div class="quantity-button" id="increase-quantity">▲</div>
            <div id="quantity-display">${snowQuantity}</div>
            <div class="quantity-button" id="decrease-quantity">▼</div>
        </div>
        <div id="resize-handle"></div>
    `;

    const initialState = loadButtonState();
    toggleButton.style.left = `${initialState.position.x}px`;
    toggleButton.style.top = `${initialState.position.y}px`;
    toggleButton.style.width = `${initialState.width}px`;

    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('mousedown', (e) => {
        if (e.target.id === 'resize-handle') {
            isResizing = true;
        } else {
            isDragging = true;
            offsetX = e.clientX - toggleButton.offsetLeft;
            offsetY = e.clientY - toggleButton.offsetTop;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            toggleButton.style.left = `${newX}px`;
            toggleButton.style.top = `${newY}px`;
        } else if (isResizing) {
            const newWidth = Math.max(100, e.clientX - toggleButton.offsetLeft);
            toggleButton.style.width = `${newWidth}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging || isResizing) {
            const newX = toggleButton.offsetLeft;
            const newY = toggleButton.offsetTop;
            const newWidth = toggleButton.offsetWidth;
            saveButtonState(newX, newY, newWidth);
        }
        isDragging = false;
        isResizing = false;
    });

    document.getElementById('increase-quantity').addEventListener('mousedown', () => startHold(1));
    document.getElementById('increase-quantity').addEventListener('mouseup', stopHold);
    document.getElementById('increase-quantity').addEventListener('mouseleave', stopHold);

    document.getElementById('decrease-quantity').addEventListener('mousedown', () => startHold(-1));
    document.getElementById('decrease-quantity').addEventListener('mouseup', stopHold);
    document.getElementById('decrease-quantity').addEventListener('mouseleave', stopHold);

    toggleButton.addEventListener('click', toggleSnow);
})();
