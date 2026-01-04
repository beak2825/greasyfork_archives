// ==UserScript==
// @name         LZTQuoteBackground
// @namespace    MeloniuM/LZT
// @version      1.3
// @description  Add custom SVG background and stylish borders to quotes on lolz.live
// @author       MeloniuM
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539540/LZTQuoteBackground.user.js
// @updateURL https://update.greasyfork.org/scripts/539540/LZTQuoteBackground.meta.js
// ==/UserScript==
(function () {
    'use strict';

    $("<style/>").text(`
    .lzt-quote {
        position: relative;
        padding-left: 10px;
        overflow: inherit;
        border-radius: 6px;
        background-color: var(--bg-color, rgba(0, 0, 0, 0.03)) !important;
        background-image: var(--bg-image) !important;
        background-repeat: no-repeat;
        background-size: auto 100%;
        background-position: right center;
        border-left: var(--border-left, 5px solid #2bad72) !important;
        /*border-image: var(--border-image, none) !important;*/
        border-image-slice: 1 !important;
        box-shadow: var(--box-shadow, none) !important;
    }

    .lzt-quote::before {
        content: "";
        position: absolute;
        top: 0; left: 0; bottom: 0;
        width: 5px;
        border-radius: 6px 0 0 6px;
        background: var(--border-image) !important; /* или background: <svg data-url> */
        pointer-events: none;
    }

    `).appendTo("head");

    // Конфигурация
    const MASK_GROUPS = [{
        x: 68,
        y: 1,
        originalScale: 0.2
    }, {
        x: 70,
        y: 28,
        originalScale: 0.3
    }, {
        x: 30,
        y: 12,
        originalScale: 0.17
    }, {
        x: 6,
        y: 30,
        originalScale: 0.11
    }, {
        x: 30,
        y: 50,
        originalScale: 0.13
    }];
    const MIN_PIXEL_SIZE = 10;
    const MAX_PIXEL_SIZE = 20;
    const ORIGINAL_SCALES = MASK_GROUPS.map(g => g.originalScale);
    const MIN_ORIGINAL_SCALE = Math.min(...ORIGINAL_SCALES);
    const MAX_ORIGINAL_SCALE = Math.max(...ORIGINAL_SCALES);
    const DEFAULT_COLOR = '#2BAD72';
    const DEFAULT_WIDTH = 320;
    const DEFAULT_HEIGHT = 512;
    // Кеш для SVG-фонов
    const backgroundCache = new Map();

    function generateSvgBackground(svgContent, iconWidth, iconHeight, iconColor) {
        const cacheKey = `${svgContent}|${iconColor}`;
        if (backgroundCache.has(cacheKey)) {
            return backgroundCache.get(cacheKey);
        }
        const maskContent = MASK_GROUPS.map(group => {
            const normalizedScale = (group.originalScale - MIN_ORIGINAL_SCALE) / (MAX_ORIGINAL_SCALE - MIN_ORIGINAL_SCALE);
            const pixelSize = MIN_PIXEL_SIZE + normalizedScale * (MAX_PIXEL_SIZE - MIN_PIXEL_SIZE);
            const scale = pixelSize / iconWidth;
            const cx = iconWidth / 2;
            const cy = iconHeight / 2;
            return `
                <g transform="translate(${group.x}, ${group.y}) scale(${scale})">
                    <g fill="${iconColor}" style="transform-origin: ${cx}px ${cy}px;">
                        ${svgContent}
                    </g>
                </g>
            `;
        }).join('');
        const outputSvg = `
            <svg width="112" height="68" viewBox="0 0 112 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="fadeGradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                        <stop offset="0%" stop-color="white" stop-opacity="1"/>
                        <stop offset="100%" stop-color="white" stop-opacity="0"/>
                    </radialGradient>
                    <mask id="fadeMask" maskUnits="userSpaceOnUse" x="0" y="0" width="112" height="68">
                        <rect width="112" height="68" fill="url(#fadeGradient)" />
                    </mask>
                </defs>
                <g mask="url(#fadeMask)">
                    ${maskContent}
                </g>
            </svg>
        `;

        const base64Svg = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(outputSvg)))}`;
        backgroundCache.set(cacheKey, base64Svg);
        return base64Svg;
    }

    function getAnalogousColor(hex) {
        const {
            r,
            g,
            b
        } = hexToRgb(hex);
        let {
            h,
            s,
            l
        } = rgbToHsl(r, g, b);
        h = (h + 30) % 360;
        s = Math.min(s * 0.5, 0.5);
        l = Math.min(l * 0.7, 0.7);
        const {
            r: newR,
            g: newG,
            b: newB
        } = hslToRgb(h / 360, s, l);
        return `rgba(${newR}, ${newG}, ${newB}, 0.12)`;
    }

    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        const bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            }
            h *= 60;
        }
        return {
            h,
            s,
            l
        };
    }

    function hslToRgb(h, s, l) {
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    function extractBorderStyle(usernameElement) {
        if (!usernameElement) return {
            border: `5px solid ${DEFAULT_COLOR}`,
            shadow: 'none',
            image: null
        };

        const style = usernameElement.getAttribute('style') || '';
        const computedStyle = window.getComputedStyle(usernameElement);

        const bgMatch = style.match(/background\s*:\s*([^;]+)/i);
        const colorMatch = style.match(/color\s*:\s*([^;]+)/i) || (computedStyle.color !== 'rgba(0, 0, 0, 0)' ? [null, computedStyle.color] : null);
        const textShadowMatch = style.match(/text-shadow\s*:\s*([^;]+)/i) || (computedStyle.textShadow !== 'none' ? [null, computedStyle.textShadow] : null);
        const gradientMatches = style.match(/(linear|radial)-gradient\((?:(?:rgba?\([^)]+\)|[^)])+)\)/gi) ||
              (computedStyle.background.includes('gradient') ? [computedStyle.background] : []);

        let border = '';
        let image = null;
        let shadow = 'none';

        if (bgMatch && !gradientMatches.length) {
            border = `5px solid ${bgMatch[1]}`;
        } else if (colorMatch && colorMatch[1] !== 'transparent') {
            border = `5px solid ${colorMatch[1]}`;
        } else {
            border = `5px solid ${DEFAULT_COLOR}`;
        }

        if (textShadowMatch) {
            shadow = textShadowMatch[1];
        }

        if (gradientMatches.length > 0) {
            const cleanedGradients = gradientMatches.map(g => g.trim());
            // объединяем в строку через запятую
            const combinedGradient = cleanedGradients.join(', ');
            image = combinedGradient;
        }

        return {
            border,
            shadow,
            image
        };
    }


    function applyQuoteBackground($target) {
        const iconElement = $target.find('.quoteAuthor').first().find('.uniqUsernameIcon--custom svg').get(0);
        let backgroundSvg = '';
        let iconColor = DEFAULT_COLOR;

        if (iconElement) {
            const inputSvgContent = iconElement.innerHTML;

            // Поиск цвета из иконки
            const pathElement = iconElement.querySelector('path');
            if (pathElement) {
                iconColor = pathElement.getAttribute('fill') || (pathElement.getAttribute('style')?.match(/fill:\s*([^;]+)/)?.[1]);
            }
            if (!iconColor) {
                iconColor = iconElement.getAttribute('fill') || iconElement.getAttribute('style')?.match(/fill:\s*([^;]+)/)?.[1];
            }
            if (!iconColor) {
            iconColor = iconElement.getAttribute('style')?.match(/color:\s*([^;]+)/)?.[1];
            }

            if (!iconColor) {
                const gradient = iconElement.getAttribute('style')?.match(/fill:\s*url\(#(\w+)\)/)?.[1];
                if (gradient) {
                    const gradientElement = iconElement.querySelector(`#${gradient}`);
                    if (gradientElement) {
                        const firstStop = gradientElement.querySelector('stop');
                        if (firstStop) {
                            iconColor = firstStop.getAttribute('stop-color');
                        }
                    }
                }
        }

            iconColor = (iconColor || DEFAULT_COLOR).replace(/["']/g, '');

            let iconWidth = DEFAULT_WIDTH;
            let iconHeight = DEFAULT_HEIGHT;
            const viewBox = iconElement.getAttribute('viewBox');
            if (viewBox) {
            const [, , width, height] = viewBox.split(' ').map(Number);
                iconWidth = width || iconWidth;
                iconHeight = height || iconHeight;
            } else {
                iconWidth = parseFloat(iconElement.getAttribute('width')) || iconWidth;
                iconHeight = parseFloat(iconElement.getAttribute('height')) || iconHeight;
        }

            backgroundSvg = generateSvgBackground(inputSvgContent, iconWidth, iconHeight, iconColor);
        }

        // Извлекаем стиль границы из ника
        const usernameElement = $target.find('.quoteAuthor .username').first().children().first().get(0);

        const bgColor = getAnalogousColor(iconColor);
        const { border, shadow, image } = extractBorderStyle(usernameElement);

        $target.addClass('lzt-quote');

        const el = $target[0];
        el.style.setProperty('--bg-color', bgColor);
        el.style.setProperty('--bg-image', `url(${backgroundSvg})`);
        el.style.setProperty('--border-left', border);

        el.style.setProperty('--box-shadow', shadow || 'none');

        if (image) {
            // Есть border-image — делаем border-left прозрачным, чтобы показать border-image
            el.style.setProperty('--border-left', '0 solid transparent');
            el.style.setProperty('--border-image', image);
        } else {
            // Обычная граница
            el.style.setProperty('--border-left', border);
            el.style.removeProperty('--border-image');
        }

    }

    // Регистрация и начальная обработка
    XenForo.LZTQuoteBackground = function ($target) {
        applyQuoteBackground($target);
    };
    XenForo.register('.message .bbCodeQuote, .comment .bbCodeQuote', 'XenForo.LZTQuoteBackground');
    // Обработка существующих цитат
    $('.message .bbCodeQuote, .comment .bbCodeQuote').each(function () {
        applyQuoteBackground($(this));
    });
    // Обработка динамически загружаемых цитат
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    $(node).find('.bbCodeQuote').each(function () {
                        applyQuoteBackground($(this));
                    });
                }
            });
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();