// ==UserScript==
// @name         Modificador de Tema Kogama
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Altera a cor Tema do Kogama
// @author       eminent
// @match        https://kogama.com.br/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498569/Modificador%20de%20Tema%20Kogama.user.js
// @updateURL https://update.greasyfork.org/scripts/498569/Modificador%20de%20Tema%20Kogama.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const toggleButtonCSS = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        width: 50px;
        height: 50px;
        background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Color_circle_%28RGB%29.svg/465px-Color_circle_%28RGB%29.svg.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10000;
        transition: opacity 0.3s, transform 0.3s;
    `;

    const panelCSS = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #333;
        color: #fff;
        border: 1px solid #ccc;
        padding: 10px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        border-radius: 8px;
        max-width: 200px;
        font-family: Arial, sans-serif;
        transition: transform 0.3s ease, opacity 0.3s ease;
        opacity: 0;
        z-index: 9999;
    `;

    const buttonCSS = `
        width: 100%;
        padding: 5px 10px;
        margin-top: 5px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    `;

    let intervalId = null;
    let isRGBMode = false;

    const saveSelectedClass = (className) => {
        localStorage.setItem('selectedBodyClass', className);
    };

    const loadSavedClass = () => {
        return localStorage.getItem('selectedBodyClass') || '';
    };

    const animateButton = (button) => {
        button.style.backgroundColor = '#45a049';
        setTimeout(() => {
            button.style.backgroundColor = '#4CAF50';
        }, 300);
    };

    const updateCurrentClass = () => {
        const currentClass = loadSavedClass();
        if (currentClass) {
            document.body.className = currentClass;
            document.getElementById('currentClassText').textContent = currentClass;
        } else {
            document.getElementById('currentClassText').textContent = 'Nenhuma classe extra';
        }
    };

    const showPanel = () => {
        panel.style.display = 'block';
        setTimeout(() => {
            panel.style.opacity = '1';
        }, 50);
    };

    const hidePanel = () => {
        panel.style.opacity = '0';
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);
    };

    const toggleButton = document.createElement('button');
    toggleButton.style.cssText = toggleButtonCSS;
    toggleButton.addEventListener('click', () => {
        toggleButton.style.opacity = '0';
        showPanel();
    });
    document.body.appendChild(toggleButton);

    const panel = document.createElement('div');
    panel.style.cssText = panelCSS;
    panel.innerHTML = `
        <div style="font-size: 14px; margin-bottom: 10px;">Tema Atual: <span id="currentClassText">Desconhecida</span></div>
        <div style="font-size: 14px; margin-bottom: 10px;">Escolha o novo Tema:</div>
        <button class="classButton" data-class="spring" style="${buttonCSS}">Primavera</button>
        <button class="classButton" data-class="summer" style="${buttonCSS}">Verão</button>
        <button class="classButton" data-class="autumn" style="${buttonCSS}">Outono</button>
        <button class="classButton" data-class="winter" style="${buttonCSS}">Inverno</button>
        <button id="rgbModeButton" style="${buttonCSS}">RGB</button>
        <button id="closePanelButton" style="position: absolute; top: 5px; right: 5px; background-color: transparent; border: none; color: #fff; font-size: 16px; cursor: pointer;">&times;</button>
    `;
    document.body.appendChild(panel);

    document.querySelectorAll('.classButton').forEach(button => {
        button.addEventListener('click', function() {
            const newClass = this.getAttribute('data-class');
            saveSelectedClass(newClass);
            updateCurrentClass();
            animateButton(this);
        });
    });

    document.getElementById('rgbModeButton').addEventListener('click', () => {
        if (isRGBMode) {
            clearInterval(intervalId);
            isRGBMode = false;
            document.getElementById('rgbModeButton').textContent = 'RGB';
        } else {
            startRGBMode();
            isRGBMode = true;
            document.getElementById('rgbModeButton').textContent = 'Modo Normal';
        }
    });

    const startRGBMode = () => {
        const classes = ['spring', 'summer', 'autumn', 'winter'];
        let index = 0;
        intervalId = setInterval(() => {
            const newClass = classes[index];
            saveSelectedClass(newClass);
            document.body.className = newClass;
            index = (index + 1) % classes.length;
        }, 100); // Troca a cada 1 segundo
    };

    document.getElementById('closePanelButton').addEventListener('click', () => {
        hidePanel();
        toggleButton.style.opacity = '1';
    });

    updateCurrentClass();

})();
