// ==UserScript==
// @name         LAZER GRADIENT
// @namespace    https://github.com/GothbreachHelper/
// @version      5.1
// @description  Циклический градиент с эффектом "лазерного" перехода между цветами
// @author       лазер дмитрий прайм
// @match        *://*/*
// @license      MIT
// @grant        none
// @icon         https://i.imgur.com/7X8kK9S.png
// @downloadURL https://update.greasyfork.org/scripts/544833/LAZER%20GRADIENT.user.js
// @updateURL https://update.greasyfork.org/scripts/544833/LAZER%20GRADIENT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
    // █▄─█▀▀▀█─▄█─▄▄─█▄─▀█▀─▄█▄─▄▄▀█▄─▄█─▄▄─█─▄─▄─█▄─▄▄─█─▄▄─█▄─▄▄▀█─▄▄─█─▄▄▄▄█─▄─▄─█▄─▄▄─█▄─▀█▄─▄█─▄▄▄▄█─█─█▄─▄█─▄▄─█▄─▀█▀─▄█
    // ██─█─█─█─██─██─██─█▄█─███─▄─▄██─██─██─███─████─▄█▀█─██─██─▄─▄█─██─█▄▄▄▄─███─████─▄█▀██─█▄▀─██▄▄▄▄─█─▄─██─██─██─██─█▄█─██
    // ▀▀▄▄▄▀▄▄▄▀▄▄▄▄▀▄▄▄▀▄▄▄▀▄▄▀▄▄▀▄▄▄▀▄▄▄▄▀▀▄▄▄▀▀▄▄▄▄▄▀▄▄▄▄▀▄▄▀▄▄▀▄▄▄▄▀▄▄▄▄▄▀▀▄▄▄▀▀▄▄▄▄▄▀▄▄▄▀▀▄▄▀▄▄▄▄▄▀▄▀▄▀▄▄▄▀▄▄▄▄▀▄▄▄▀▄▄▄▀
    
    // Стили панели
    const panelStyle = `
        position: fixed;
        top: 100px;
        left: 100px;
        z-index: 99999;
        background: rgba(10,10,10,0.96);
        padding: 15px;
        border-radius: 8px;
        border: 2px solid #FF00FF;
        box-shadow: 0 0 25px rgba(255,0,255,0.7), 
                    inset 0 0 15px rgba(0,255,255,0.4);
        cursor: move;
        user-select: none;
        width: 240px;
        font-family: 'Courier New', monospace;
        backdrop-filter: blur(5px);
    `;

    const gradientStyle = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        pointer-events: none;
        opacity: 0;
        transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    // Создаем элементы
    const panel = document.createElement("div");
    panel.style.cssText = panelStyle;
    panel.setAttribute('id', 'lazer-gradient-panel');

    const gradient = document.createElement("div");
    gradient.style.cssText = gradientStyle;
    gradient.setAttribute('id', 'lazer-gradient-effect');

    // █▀▀ █▀█ █▀▀ ▄▀█ ▀█▀ █ █▀█ █▄░█ █▀▀   █▀▀ █▀█ █▄░█ █▀▀ █░█ █▀ █▀▀ █▀▄   █▀▀ █▀▀ █▄░█ █▀▀ █▀█ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █▀█
    // █▄▄ █▀▄ ██▄ █▀█ ░█░ █ █▄█ █░▀█ ██▄   █▄▄ █▄█ █░▀█ █▄▄ █▄█ ▄█ ██▄ █▄▀   █▄█ ██▄ █░▀█ ██▄ █▀▄ █▀█ █▄▄ ██▄ ░█░ █▄█ █▀▄

    // [КОНТРОЛЛЕР СКОРОСТИ]
    let speed = 5;
    const speedControlHTML = `
    <div style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; color: #00FFFF; font-size: 12px; margin-bottom: 5px;">
            <span>LAZER SPEED:</span>
            <span id="lazer-speed-value">${speed}</span>
        </div>
        <input type="range" min="1" max="10" value="${speed}" 
            style="width: 100%; accent-color: #FF00FF; cursor: pointer;"
            id="lazer-speed-slider">
    </div>`;

    // [ИНТЕРФЕЙС]
    panel.innerHTML = `
    <div style="border-bottom: 1px solid #FF00FF; margin-bottom: 15px; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
        <div style="color: #00FFFF; font-weight: bold; text-shadow: 0 0 8px #FF00FF; font-size: 16px;">
            ⚡ LAZER GRADIENT v5.0
        </div>
        <div id="lazer-close-btn" style="color: white; cursor: pointer; font-size: 20px; transition: all 0.2s;">×</div>
    </div>

    <div id="lazer-color-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px; max-height: 250px; overflow-y: auto; padding-right: 5px;">
        <!-- Colors will be added here -->
    </div>

    <button id="lazer-add-color" style="background: rgba(255,0,255,0.2); color: white; border: 1px dashed #FF00FF; padding: 8px; border-radius: 5px; margin-bottom: 15px; cursor: pointer; width: 100%; font-size: 12px; transition: all 0.2s;">
        + ADD LAZER COLOR (MAX 10)
    </button>

    ${speedControlHTML}

    <button id="lazer-toggle-btn" style="background: linear-gradient(45deg, #FF00FF, #00FFFF); color: black; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-weight: bold; width: 100%; transition: all 0.3s; font-size: 14px; text-shadow: 0 0 3px rgba(255,255,255,0.5);">
        ACTIVATE LAZER
    </button>`;

    // █▀▀ █░█ █▀▀ █▀█ █▀▀ █▀▄   █▀▀ █▀█ █▄░█ █▀▀ █░█ █▀ █▀▀ █▀▄   █▀▀ █▀▀ █▄░█ █▀▀ █▀█ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █▀█
    // █▄▄ █▀█ ██▄ █▀▄ ██▄ █▄▀   █▄▄ █▄█ █░▀█ █▄▄ █▄█ ▄█ ██▄ █▄▀   █▄█ ██▄ █░▀█ ██▄ █▀▄ █▀█ █▄▄ ██▄ ░█░ █▄█ █▀▄

    // Инициализация
    document.body.appendChild(panel);
    document.body.appendChild(gradient);
    let isActive = false;
    let animationId = null;
    const colorInputs = [];
    let colorCount = 2;

    // Стартовые цвета
    const defaultColors = [
        '#FF00FF', '#00FFFF', '#00FF00', 
        '#FFFF00', '#FF0000', '#0000FF',
        '#FF8000', '#8000FF', '#0080FF',
        '#80FF00'
    ];

    // █▀▀ █ ▀█▀ █▀▀ █▀   █▀▀ █▀█ █▄░█ █▀▀ █░█ █▀ █▀▀ █▀▄   █▀▀ █▀▀ █▄░█ █▀▀ █▀█ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █▀█
    // █▀░ █ ░█░ ██▄ ▄█   █▄▄ █▄█ █░▀█ █▄▄ █▄█ ▄█ ██▄ █▄▀   █▄█ ██▄ █░▀█ ██▄ █▀▄ █▀█ █▄▄ ██▄ ░█░ █▄█ █▀▄

    // Функция создания цветового элемента
    function createColorElement(index) {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
            align-items: center;
        `;

        const label = document.createElement("div");
        label.textContent = `LAZER ${index + 1}`;
        label.style.cssText = `
            color: #00FFFF;
            font-size: 10px;
            text-align: center;
            width: 100%;
            font-weight: bold;
        `;

        const inputWrapper = document.createElement("div");
        inputWrapper.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
            width: 100%;
            justify-content: center;
        `;

        const input = document.createElement("input");
        input.type = "color";
        input.value = defaultColors[index];
        input.style.cssText = `
            width: 30px;
            height: 30px;
            cursor: pointer;
            flex-shrink: 0;
            border: 1px solid #00FFFF;
            border-radius: 50%;
        `;

        const deleteBtn = document.createElement("div");
        deleteBtn.textContent = "×";
        deleteBtn.style.cssText = `
            color: white;
            cursor: pointer;
            font-size: 14px;
            opacity: ${index > 1 ? '0.7' : '0'};
            pointer-events: ${index > 1 ? 'auto' : 'none'};
            background: #FF00FF;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        `;

        // Добавляем обработчики
        input.addEventListener("change", updateGradient);
        deleteBtn.addEventListener("click", () => removeColor(index, wrapper));

        // Сохраняем ссылки
        colorInputs[index] = input;

        // Собираем компонент
        inputWrapper.appendChild(input);
        if (index > 1) inputWrapper.appendChild(deleteBtn);
        wrapper.appendChild(label);
        wrapper.appendChild(inputWrapper);
        
        return wrapper;
    }

    // Удаление цвета
    function removeColor(index, wrapper) {
        if (colorCount <= 2) return;
        
        colorContainer.removeChild(wrapper);
        colorInputs.splice(index, 1);
        colorCount--;
        
        // Перенумеровываем оставшиеся цвета
        const labels = colorContainer.querySelectorAll("div > div");
        labels.forEach((label, i) => {
            label.textContent = `LAZER ${i + 1}`;
        });
        
        if (isActive) updateGradient();
    }

    // █▀▀ █░█ █▀▀ █▀█ █▀▀ █▀▄   █▀▀ █▀█ █▄░█ █▀▀ █░█ █▀ █▀▀ █▀▄   █▀▀ █▀▀ █▄░█ █▀▀ █▀█ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █▀█
    // █▄▄ █▀█ ██▄ █▀▄ ██▄ █▄▀   █▄▄ █▄█ █░▀█ █▄▄ █▄█ ▄█ ██▄ █▄▀   █▄█ ██▄ █░▀█ ██▄ █▀▄ █▀█ █▄▄ ██▄ ░█░ █▄█ █▀▄

    // Обновление градиента
    function updateGradient() {
        if (colorInputs.length < 2) return;
        
        const colors = colorInputs.map(input => input.value);
        const extendedColors = [...colors, colors[0]]; // Замыкаем цикл
        
        cancelAnimationFrame(animationId);
        
        let progress = 0;
        const animate = () => {
            progress = (progress + (speed * 0.0005)) % 1;
            
            // Вычисляем текущие цвета
            const totalSegments = extendedColors.length - 1;
            const globalPos = progress * totalSegments;
            const segmentIndex = Math.floor(globalPos);
            const localProgress = globalPos - segmentIndex;
            
            const startColor = extendedColors[segmentIndex];
            const endColor = extendedColors[segmentIndex + 1];
            const currentColor = blendColors(startColor, endColor, localProgress);
            
            gradient.style.background = currentColor;
            animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Смешивание цветов
    function blendColors(color1, color2, ratio) {
        const r1 = parseInt(color1.substring(1, 3), 16);
        const g1 = parseInt(color1.substring(3, 5), 16);
        const b1 = parseInt(color1.substring(5, 7), 16);
        
        const r2 = parseInt(color2.substring(1, 3), 16);
        const g2 = parseInt(color2.substring(3, 5), 16);
        const b2 = parseInt(color2.substring(5, 7), 16);
        
        const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
        const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
        const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    // █▀▀ █░█ █▀▀ █▀█ █▀▀ █▀▄   █▀▀ █▀█ █▄░█ █▀▀ █░█ █▀ █▀▀ █▀▄   █▀▀ █▀▀ █▄░█ █▀▀ █▀█ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █▀█
    // █▄▄ █▀█ ██▄ █▀▄ ██▄ █▄▀   █▄▄ █▄█ █░▀█ █▄▄ █▄█ ▄█ ██▄ █▄▀   █▄█ ██▄ █░▀█ ██▄ █▀▄ █▀█ █▄▄ ██▄ ░█░ █▄█ █▀▄

    // Инициализация интерфейса
    const colorContainer = panel.querySelector("#lazer-color-container");
    const addColorBtn = panel.querySelector("#lazer-add-color");
    const toggleBtn = panel.querySelector("#lazer-toggle-btn");
    const closeBtn = panel.querySelector("#lazer-close-btn");
    const speedSlider = panel.querySelector("#lazer-speed-slider");
    const speedValue = panel.querySelector("#lazer-speed-value");

    // Добавляем стартовые цвета
    for (let i = 0; i < 2; i++) {
        colorContainer.appendChild(createColorElement(i));
    }

    // █▀▀ █░█ █▀▀ █▀█ █▀▀ █▀▄   █▀▀ █▀█ █▄░█ █▀▀ █░█ █▀ █▀▀ █▀▄   █▀▀ █▀▀ █▄░█ █▀▀ █▀█ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █▀█
    // █▄▄ █▀█ ██▄ █▀▄ ██▄ █▄▀   █▄▄ █▄█ █░▀█ █▄▄ █▄█ ▄█ ██▄ █▄▀   █▄█ ██▄ █░▀█ ██▄ █▀▄ █▀█ █▄▄ ██▄ ░█░ █▄█ █▀▄

    // Обработчики событий
    addColorBtn.addEventListener("click", () => {
        if (colorCount >= 10) {
            alert("Maximum 10 LAZER colors!");
            return;
        }
        
        colorContainer.appendChild(createColorElement(colorCount));
        colorCount++;
    });

    toggleBtn.addEventListener("click", () => {
        if (colorInputs.length < 2) {
            alert("Need at least 2 LAZER colors!");
            return;
        }
        
        isActive = !isActive;
        
        if (isActive) {
            gradient.style.opacity = 0.85;
            toggleBtn.textContent = "DEACTIVATE LAZER";
            toggleBtn.style.background = "linear-gradient(45deg, #FF0000, #990000)";
            updateGradient();
        } else {
            gradient.style.opacity = 0;
            toggleBtn.textContent = "ACTIVATE LAZER";
            toggleBtn.style.background = "linear-gradient(45deg, #FF00FF, #00FFFF)";
            cancelAnimationFrame(animationId);
        }
    });

    speedSlider.addEventListener("input", () => {
        speed = parseInt(speedSlider.value);
        speedValue.textContent = speed;
        
        if (isActive) {
            cancelAnimationFrame(animationId);
            updateGradient();
        }
    });

    closeBtn.addEventListener("click", () => {
        panel.remove();
        gradient.remove();
        cancelAnimationFrame(animationId);
    });

    // Перетаскивание панели
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    panel.addEventListener("mousedown", (e) => {
        if (e.target.tagName !== "INPUT" && e.target !== closeBtn) {
            isDragging = true;
            dragOffset = {
                x: e.clientX - panel.getBoundingClientRect().left,
                y: e.clientY - panel.getBoundingClientRect().top
            };
            panel.style.cursor = "grabbing";
            panel.style.boxShadow = "0 0 30px rgba(255,0,255,1)";
        }
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        
        panel.style.left = `${e.clientX - dragOffset.x}px`;
        panel.style.top = `${e.clientY - dragOffset.y}px`;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        panel.style.cursor = "move";
        panel.style.boxShadow = "0 0 25px rgba(255,0,255,0.8)";
    });

    // Стили для скроллбара
    const scrollStyle = document.createElement("style");
    scrollStyle.textContent = `
        #lazer-color-container::-webkit-scrollbar {
            width: 4px;
            height: 4px;
        }
        #lazer-color-container::-webkit-scrollbar-thumb {
            background: #FF00FF;
            border-radius: 2px;
        }
        #lazer-color-container::-webkit-scrollbar-track {
            background: rgba(255,0,255,0.1);
        }
    `;
    document.head.appendChild(scrollStyle);

    console.log("⚡ LAZER GRADIENT v5.0 activated!");
})();