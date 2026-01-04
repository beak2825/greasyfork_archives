// ==UserScript==
// @name         显示新标签页打开图标
// @name:zh-cn   显示新标签页打开图标
// @name:en      Show new tab open icon
// @namespace    http://tampermonkey.net/
// @version      3.2
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWV4dGVybmFsLWxpbmsiPjxwYXRoIGQ9Ik0xNSAzaDZ2NiIvPjxwYXRoIGQ9Ik0xMCAxNCAyMSAzIi8+PHBhdGggZD0iTTE4IDEzdjZhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWOGEyIDIgMCAwIDEgMi0yaDYiLz48L3N2Zz4=
// @description:zh-cn  鼠标悬停在链接上时，如果会在新标签页打开，则显示箭头图标，支持中英双语设置菜单及实时预览
// @description:en  Show arrow icon when hovering over a link if it will be opened in a new tab, support bilingual setup menus and live previews
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0
// @description 鼠标悬停在链接上时，如果会在新标签页打开，则显示箭头图标，支持中英双语设置菜单及实时预览
// @downloadURL https://update.greasyfork.org/scripts/517166/%E6%98%BE%E7%A4%BA%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/517166/%E6%98%BE%E7%A4%BA%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==

//icon you may like 备用图标
//data:image/png;base64,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
(function() {
    'use strict';

    const defaultIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWV4dGVybmFsLWxpbmsiPjxwYXRoIGQ9Ik0xNSAzaDZ2NiIvPjxwYXRoIGQ9Ik0xMCAxNCAyMSAzIi8+PHBhdGggZD0iTTE4IDEzdjZhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWOGEyIDIgMCAwIDEgMi0yaDYiLz48L3N2Zz4=";

    // 获取设置或默认值
    const settings = {
        iconUrl: GM_getValue("iconUrl", defaultIcon),
        size: GM_getValue("size", 24),
        offsetX: GM_getValue("offsetX", 10),
        offsetY: GM_getValue("offsetY", 10),
        iconOpacity: GM_getValue("iconOpacity", 0.5),
        invertForDarkMode: GM_getValue("invertForDarkMode", true),
        language: GM_getValue("language", "zh") // 默认中文
    };

    // 本地化文本
    const translations = {
        zh: {
            settingsTitle: "图标设置",
            iconUrl: "图标 URL",
            size: "图标大小",
            offsetX: "横向偏移",
            offsetY: "纵向偏移",
            iconOpacity: "图标透明度",
            invertForDarkMode: "夜间模式反色",
            language: "语言",
            apply: "应用",
            cancel: "取消"
        },
        en: {
            settingsTitle: "Icon Settings",
            iconUrl: "Icon URL",
            size: "Icon Size",
            offsetX: "Horizontal Offset",
            offsetY: "Vertical Offset",
            iconOpacity: "Icon Opacity",
            invertForDarkMode: "Invert for Dark Mode",
            language: "Language",
            apply: "Apply",
            cancel: "Cancel"
        }
    };

    const currentLang = settings.language;
    const text = translations[currentLang];

    // 创建图标元素
    const icon = document.createElement("div");
    icon.style.position = "absolute";
    icon.style.width = `${settings.size}px`;
    icon.style.height = `${settings.size}px`;
    icon.style.backgroundImage = `url(${settings.iconUrl})`;
    icon.style.backgroundSize = "contain";
    icon.style.pointerEvents = "none";
    icon.style.zIndex = "10000";
    icon.style.opacity = settings.iconOpacity;
    icon.style.display = "none";
    updateIconFilter();
    document.body.appendChild(icon);

    document.addEventListener("mouseover", (event) => {
        const link = event.target.closest("a");
        if (link && link.target === "_blank") {
            icon.style.display = "block";
        } else {
            icon.style.display = "none";
        }
    });

    document.addEventListener("mousemove", (event) => {
        icon.style.left = `${event.pageX + settings.offsetX}px`;
        icon.style.top = `${event.pageY + settings.offsetY}px`;
    });

    document.addEventListener("mouseout", (event) => {
        if (event.target.closest("a")) {
            icon.style.display = "none";
        }
    });

    GM_registerMenuCommand(text.settingsTitle, openSettingsDialog);

    // 打开设置弹窗
    function openSettingsDialog() {
        const dialog = document.createElement("div");
        dialog.style.position = "fixed";
        dialog.style.top = "50%";
        dialog.style.left = "50%";
        dialog.style.transform = "translate(-50%, -50%)";
        dialog.style.backgroundColor = "white";
        dialog.style.border = "1px solid #ccc";
        dialog.style.padding = "20px";
        dialog.style.zIndex = "10001";
        dialog.style.width = "300px";
        dialog.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";

        dialog.innerHTML = `
            <h2>${text.settingsTitle}</h2>
            <label>${text.iconUrl}: <input id="iconUrl" type="text" value="${settings.iconUrl}" /></label><br>
            <label>${text.size}: <input id="size" type="number" value="${settings.size}" /></label><br>
            <label>${text.offsetX}: <input id="offsetX" type="number" value="${settings.offsetX}" /></label><br>
            <label>${text.offsetY}: <input id="offsetY" type="number" value="${settings.offsetY}" /></label><br>
            <label>${text.iconOpacity}: <input id="iconOpacity" type="number" step="0.1" min="0" max="1" value="${settings.iconOpacity}" /></label><br>
            <label><input id="invertForDarkMode" type="checkbox" ${settings.invertForDarkMode ? 'checked' : ''} /> ${text.invertForDarkMode}</label><br>
            <label>${text.language}: <select id="language">
                <option value="zh" ${settings.language === "zh" ? "selected" : ""}>中文</option>
                <option value="en" ${settings.language === "en" ? "selected" : ""}>English</option>
            </select></label><br><br>
            <button id="apply">${text.apply}</button>
            <button id="cancel">${text.cancel}</button>
            <div>
                <h3>预览</h3>
                <div id="iconPreview" style="width: ${settings.size}px; height: ${settings.size}px; background-image: url(${settings.iconUrl}); background-size: contain; opacity: ${settings.iconOpacity};"></div>
            </div>
        `;

        document.body.appendChild(dialog);

        // 预览更新
        const inputs = dialog.querySelectorAll("input, select");
        inputs.forEach(input => {
            input.addEventListener("input", updatePreview);
        });

        document.getElementById("apply").addEventListener("click", () => {
            settings.iconUrl = document.getElementById("iconUrl").value;
            settings.size = parseInt(document.getElementById("size").value);
            settings.offsetX = parseInt(document.getElementById("offsetX").value);
            settings.offsetY = parseInt(document.getElementById("offsetY").value);
            settings.iconOpacity = parseFloat(document.getElementById("iconOpacity").value);
            settings.invertForDarkMode = document.getElementById("invertForDarkMode").checked;
            settings.language = document.getElementById("language").value;
            saveSettings();
            document.body.removeChild(dialog);
        });

        document.getElementById("cancel").addEventListener("click", () => {
            document.body.removeChild(dialog);
        });
    }

    function updatePreview() {
        const url = document.getElementById("iconUrl").value;
        const size = parseInt(document.getElementById("size").value);
        const opacity = parseFloat(document.getElementById("iconOpacity").value);

        const preview = document.getElementById("iconPreview");
        preview.style.width = `${size}px`;
        preview.style.height = `${size}px`;
        preview.style.backgroundImage = `url(${url})`;
        preview.style.backgroundSize = "contain";
        preview.style.opacity = opacity;
    }

    function updateIconFilter() {
        if (settings.invertForDarkMode && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            icon.style.filter = "invert(1)";
        } else {
            icon.style.filter = "none";
        }
    }

    function saveSettings() {
        Object.keys(settings).forEach(key => {
            GM_setValue(key, settings[key]);
        });
        updateIconFilter(); // 应用反色设置
    }
})();
