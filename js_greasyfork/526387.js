// ==UserScript==
// @name         Twitch Edge Light Effect with Gradient
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Эффект подсветки краёв экрана на Twitch с корректной ориентацией градиента
// @author       Kislyy404
// @match        *://www.twitch.tv/*
// @grant        none
// @icon         https://i.pinimg.com/736x/9b/ca/9b/9bca9beab731e58a8b08854f2c41c8bc.jpg
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/526387/Twitch%20Edge%20Light%20Effect%20with%20Gradient.user.js
// @updateURL https://update.greasyfork.org/scripts/526387/Twitch%20Edge%20Light%20Effect%20with%20Gradient.meta.js
// ==/UserScript==

// Creative Commons Attribution-NonCommercial 4.0 International License
//
// You are free to:
// - Share — copy and redistribute the material in any medium or format
// - Adapt — remix, transform, and build upon the material
//
// Under the following terms:
// - Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
// - NonCommercial — You may not use the material for commercial purposes.
//
// No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.

(function() {
    'use strict';

    // Настройки
    const settings = {
        edgeWidth: 70, // Ширина края для анализа (в пикселях) Width of the edge to analyze (in pixels)
        brightnessFactor: 1, // Множитель яркости // Brightness multiplier
        updateInterval: 10, // Интервал обновления эффекта (в миллисекундах) // Effect refresh interval (in milliseconds)
        blurStrength: 16, // Сила размытия (в пикселях) // Basic opacity of the effect // Blur strength (in pixels)
        baseOpacity: 0.8, // Базовая непрозрачность эффекта // Basic effect opacity
    };

    function addStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .video-player__container {
                position: relative;
                overflow: hidden;
                border: none !important;
            }
            .dynamic-light-effect {
                position: absolute;
                left: 0;
                right: 0;
                pointer-events: none;
                z-index: 1;
                filter: blur(${settings.blurStrength}px);
                opacity: ${settings.baseOpacity};
                transition: opacity 0.5s ease, background 0.5s ease;
            }
            .dynamic-light-effect.top {
                top: 0;
                height: ${settings.edgeWidth * 2}px;
                background-size: 100% ${settings.edgeWidth * 2}px;
            }
            .dynamic-light-effect.bottom {
                bottom: 0;
                height: ${settings.edgeWidth * 2}px;
                background-size: 100% ${settings.edgeWidth * 2}px;
            }
            video {
                position: relative;
                z-index: 2;
                border: none !important;
            }
            .video-player__overlay {
                position: relative;
                z-index: 3;
            }
        `;
        document.head.appendChild(style);
    }

    function createLightEffect() {
        const videoContainer = document.querySelector('.video-player__container');
        if (!videoContainer) return;

        const topEffect = document.createElement('div');
        topEffect.classList.add('dynamic-light-effect', 'top');
        videoContainer.appendChild(topEffect);

        const bottomEffect = document.createElement('div');
        bottomEffect.classList.add('dynamic-light-effect', 'bottom');
        videoContainer.appendChild(bottomEffect);

        const videoElement = document.querySelector('video');
        if (!videoElement) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        function updateLightEffect() {
            if (!videoElement || videoElement.readyState < 2) return;

            // Получаем размеры видео и контейнера
            const videoRect = videoElement.getBoundingClientRect();
            const containerRect = videoContainer.getBoundingClientRect();

            // Вычисляем соотношение размеров видео и контейнера
            const scaleX = videoRect.width / videoElement.videoWidth;
            const scaleY = videoRect.height / videoElement.videoHeight;

            // Устанавливаем размер canvas под размер видео
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            const topColors = [];
            const bottomColors = [];

            // Анализируем верхний край видео
            for (let x = 0; x < canvas.width; x += 5) {
                const topPixel = ctx.getImageData(x, 0, 1, 1).data;
                const opacity = settings.baseOpacity * (1 - (x / canvas.width)); // Прозрачность уменьшается к краю
                topColors.push(`rgba(${topPixel[0]}, ${topPixel[1]}, ${topPixel[2]}, ${opacity})`);
            }

            // Анализируем нижний край видео
            for (let x = 0; x < canvas.width; x += 5) {
                const bottomPixel = ctx.getImageData(x, canvas.height - 1, 1, 1).data;
                const opacity = settings.baseOpacity * (1 - (x / canvas.width)); // Прозрачность уменьшается к краю
                bottomColors.push(`rgba(${bottomPixel[0]}, ${bottomPixel[1]}, ${bottomPixel[2]}, ${opacity})`);
            }

            // Создаем градиент для верхнего и нижнего краев
            const topGradient = `linear-gradient(to right, ${topColors.join(', ')})`;
            const bottomGradient = `linear-gradient(to right, ${bottomColors.join(', ')})`;

            // Применяем градиент к эффекту света
            topEffect.style.background = topGradient;
            bottomEffect.style.background = bottomGradient;

            // Корректируем позицию и размеры эффекта, чтобы они соответствовали видео
            topEffect.style.left = `${(containerRect.width - videoRect.width) / 2}px`;
            topEffect.style.right = `${(containerRect.width - videoRect.width) / 2}px`;
            topEffect.style.width = `${videoRect.width}px`;

            bottomEffect.style.left = `${(containerRect.width - videoRect.width) / 2}px`;
            bottomEffect.style.right = `${(containerRect.width - videoRect.width) / 2}px`;
            bottomEffect.style.width = `${videoRect.width}px`;
        }

        setInterval(updateLightEffect, settings.updateInterval);
    }

    addStyles();
    window.addEventListener('load', createLightEffect);
})();
