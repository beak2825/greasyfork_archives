// ==UserScript==
// @name           Page Background Controller
// @namespace      Background Color
// @description    Advanced background protection with full gradient support
// @version        3.2
// @include        http*
// @include        ftp
// @match          *://*/*
// @license MIT
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/447138/Page%20Background%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/447138/Page%20Background%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var Rth = 230, Gth = 230, Bth = 230;
    var baseColor = "#FDF6E3";
    var textColor = "#073642";

    var processedElements = new WeakSet();

    function parseRGB(RGB) {
        if (!RGB) return [0, 0, 0, 0];
        var match = RGB.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
        if (match) {
            return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), match[4] ? parseFloat(match[4]) : 1];
        }
        return [0, 0, 0, 0];
    }

    function adjust(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, function(c) {
            return ('0' + Math.min(255, Math.max(0, parseInt(c, 16) + Math.floor(amount))).toString(16)).substr(-2);
        });
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
    }

    function realBackgroundColor(elem) {
        if (!elem) return 'rgba(0, 0, 0, 0)';
        var computed = getComputedStyle(elem);
        if (computed.backgroundImage !== "none") return undefined;
        var bg = computed.backgroundColor;
        if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
            return realBackgroundColor(elem.parentElement);
        }
        return bg;
    }

    // 解析渐变中的颜色
    function parseGradientColors(gradient) {
        var colors = [];
        // 匹配 rgb/rgba
        var rgbMatches = gradient.match(/rgba?\([^)]+\)/g) || [];
        colors = colors.concat(rgbMatches);
        // 匹配 hex
        var hexMatches = gradient.match(/#[a-f\d]{3,8}/gi) || [];
        colors = colors.concat(hexMatches);
        return colors;
    }

    // 替换渐变中的亮色
    function transformGradient(gradient) {
        var colors = parseGradientColors(gradient);
        var result = gradient;

        for (var i = 0; i < colors.length; i++) {
            var c = colors[i];
            var rgb;

            if (c.startsWith('#')) {
                rgb = hexToRgb(c);
                if (!rgb) continue;
            } else {
                rgb = parseRGB(c);
            }

            if (rgb[0] > Rth && rgb[1] > Gth && rgb[2] > Bth) {
                var newColor = adjust(baseColor, Math.max(-10, (rgb[0] + rgb[1] + rgb[2]) / 3 - 255));
                result = result.replace(c, newColor);
            }
        }

        return result;
    }

    function processElement(elem) {
        if (processedElements.has(elem)) return;

        try {
            var computed = getComputedStyle(elem);
            var bgImage = computed.backgroundImage;

            // 处理渐变
            if (bgImage && bgImage !== 'none' && bgImage.includes('gradient')) {
                var newGradient = transformGradient(bgImage);
                if (newGradient !== bgImage) {
                    elem.style.backgroundImage = newGradient;
                    processedElements.add(elem);
                }
                return;
            }

            // 有非渐变背景图，跳过
            if (bgImage && bgImage !== 'none') return;

            // 处理纯色背景
            var rbgcolor = realBackgroundColor(elem);
            if (rbgcolor === undefined) return;

            var RGB = parseRGB(rbgcolor);
            var acolor = adjust(baseColor, Math.max(-10, (RGB[0] + RGB[1] + RGB[2]) / 3 - 255));

            if (RGB[0] > Rth && RGB[1] > Gth && RGB[2] > Bth || elem.tagName === "BODY") {
                elem.style.backgroundColor = acolor;
                processedElements.add(elem);

                // 只在背景被改变时检查文字颜色
                var txtRGB = parseRGB(computed.color);
                if (txtRGB[0] > 230 && txtRGB[1] > 230 && txtRGB[2] > 230) {
                    elem.style.color = textColor;
                }
            }
        } catch (e) {}
    }

    function changeElementsColor() {
        var allTags = document.getElementsByTagName("*");
        for (var i = 0; i < allTags.length; i++) {
            processElement(allTags[i]);
        }
    }

    function handleAutoPage() {
        var observer = new MutationObserver(function(mutations) {
            var hasNew = mutations.some(function(m) { return m.addedNodes.length > 0; });
            if (hasNew) {
                setTimeout(changeElementsColor, 50);
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    changeElementsColor();
    handleAutoPage();
})();
