// ==UserScript==
// @name               Auto Dark Scrollbar
// @name:zh-CN         自动深色滚动条
// @namespace          http://tampermonkey.net/
// @version            0.7
// @description        Apply dark scrollbar for dark pages
// @description:zh-CN  对深色页面自动应用深色滚动条
// @author             TGSAN
// @match              *://*/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/460847/Auto%20Dark%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/460847/Auto%20Dark%20Scrollbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseColor(color) {
        var x = document.createElement('div');
        document.body.appendChild(x);
        var rgba;
        var red = 0, green = 0, blue = 0, alpha = 0;
        try {
            x.style = 'color: ' + color + '!important';
            color = window.getComputedStyle(x).color;
            rgba = color.match(/rgba?\((.*)\)/)[1].split(',').map(Number);
            red = rgba[0];
            green = rgba[1];
            blue = rgba[2];
            alpha = '3' in rgba ? rgba[3] : 1;
        }
        catch (e) { }
        x.parentNode.removeChild(x);
        return { 'red': red, 'green': green, 'blue': blue, 'alpha': alpha };
    }

    function updateStyle() {
        let bodyColor = parseColor(window.getComputedStyle(document.body, null)['background-color']);
        let globalElementColor = parseColor(window.getComputedStyle(document.documentElement, null)['background-color']);
        let bodyColorIsLight = (bodyColor.alpha == 0 || (((bodyColor.red + bodyColor.green + bodyColor.blue) / 3) >= 128));
        let globalElementColorIsLight = (globalElementColor.alpha == 0 || (((globalElementColor.red + globalElementColor.green + globalElementColor.blue) / 3) >= 128));
        let htmlTheme = window.document.querySelector("html").getAttribute("data-theme");
        let htmlThemeIsLight = (htmlTheme == null || htmlTheme == "light");
        let isLight = bodyColorIsLight && globalElementColorIsLight && htmlThemeIsLight;
        // 添加样式（通用）
        if (isLight) {
            style.innerText = ":root { color-scheme: light !important; }";
        } else {
            style.innerText = ":root { color-scheme: dark !important; }";
        }
    }

    let style = document.createElement("style");
    document.head.appendChild(style);
    style.type = "text/css";
    document.addEventListener("load", function() {
        updateStyle();
    });
    window.addEventListener("load", function() {
        updateStyle();
    });
    document.body.addEventListener("load", function() {
        updateStyle();
    });
    updateStyle();
    setInterval(updateStyle, 1000);
})();