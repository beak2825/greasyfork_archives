// ==UserScript==
// @name         Woomy Custom Theme Support
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows you to create custom themes for woomy
// @author       PowfuArras // Discord: @xskt
// @match        https://woomy.app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woomy.app
// @grant        none
// @run-at       document-start
// @license      FLORRIM DEVELOPER GROUP LICENSE (https://github.com/Florrim/license/blob/main/LICENSE.md)
// @downloadURL https://update.greasyfork.org/scripts/471170/Woomy%20Custom%20Theme%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/471170/Woomy%20Custom%20Theme%20Support.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const THEME_KEY = `[CUSTOM] `;
    const STORAGE_KEY = `PowfuArras_Theme_`;
    const themes = {
        desert: {
            "teal": "#76C1BB",
            "lgreen": "#AAD35D",
            "orange": "#dd8322",
            "yellow": "#FFD993",
            "lavender": "#939FFF",
            "pink": "#a179a4",
            "vlgrey": "#d0b7ac",
            "lgrey": "#7F7F7F",
            "guiwhite": "#543c2c",
            "black": "#373834",
            "blue": "#669cb7",
            "green": "#1fbd6b",
            "red": "#d86475",
            "gold": "#ecb913",
            "purple": "#8035b6",
            "magenta": "#a76c9b",
            "grey": "#71523d",
            "dgrey": "#494954",
            "white": "#f3b48b",
            "guiblack": "#000000",
            "paletteSize": 10,
            "border": 0.5
        },
        abyss: {
            "teal": "#7a7a7a",
            "lgreen": "#aa0808",
            "orange": "#291d19",
            "yellow": "#FDF380",
            "lavender": "#4a3f5a",
            "pink": "#3a2c33",
            "vlgrey": "#1c1c1c",
            "lgrey": "#231f1f",
            "guiwhite": "#c70a0a",
            "black": "#0f0f0f",
            "blue": "#0d1011",
            "green": "#10120d",
            "red": "#1e1010",
            "gold": "#211d12",
            "purple": "#191325",
            "magenta": "#150910",
            "grey": "#141414",
            "dgrey": "#211537",
            "white": "#000000",
            "guiblack": "#000000",
            "paletteSize": 10,
            "border": 0.5
        },
        diepio: {
            "teal": "#8efffb",
            "lgreen": "#85e37d",
            "orange": "#fc7677",
            "yellow": "#ffeb8e",
            "lavender": "#b68eff",
            "pink": "#f177dd",
            "vlgrey": "#e8ebf7",
            "lgrey": "#999999",
            "guiwhite": "#ffffff",
            "black": "#555555",
            "blue": "#00b2e1",
            "green": "#00e16e",
            "red": "#f14e54",
            "gold": "#ffe869",
            "purple": "#768dfc",
            "magenta": "#bf7ff5",
            "grey": "#999999",
            "dgrey": "#726f6f",
            "white": "#cdcdcd",
            "guiblack": "#000000",
            "paletteSize": 20,
            "border": 0.5
        }
    };
    const natives = {
        keys: Object.keys
    };
    const woomy = {
        themes: null,
        builtins: null,
        mybuiltins: Object.keys(themes, false)
    };
    Object.keys = function (unknown, isNative = true) {
        const keys = natives.keys.call(this, unknown);
        if (isNative && keys.includes("bleach")) {
            woomy.themes = unknown;
            woomy.builtins = [...keys];
        }
        return keys;
    }
    window.ok = { woomy, themes };
    window.addEventListener("load", function () {
        let interval = setInterval(function () {
            try {
                const themeElement = document.getElementById("Woomy_theme").childNodes[0].parentElement;
                clearInterval(interval);
                const resultField = document.getElementById("optionsResult");
                const saveOptions = document.getElementById("saveOptions");
                const importButton = document.getElementById("importOptions");
                const importTheme = importButton.cloneNode(true);
                importTheme.childNodes[0].textContent = "Import Custom Theme";
                const clearThemes = importButton.cloneNode(true);
                clearThemes.childNodes[0].textContent = "Clear Custom Themes";
                const themeMakerLink = document.createElement("a");
                themeMakerLink.href = "https://codepen.io/road-to-100k/full/GRpvMzb";
                themeMakerLink.appendChild(document.createTextNode("Road's Theme Maker"));
                themeMakerLink.style.marginLeft = "10px";
                themeMakerLink.target = "_blank";
                resultField.parentNode.insertBefore(document.createElement("br"), resultField);
                resultField.parentNode.insertBefore(importTheme, resultField);
                resultField.parentNode.insertBefore(clearThemes, resultField);
                resultField.parentNode.insertBefore(themeMakerLink, resultField);
                function removeTheme(name) {
                    delete themes[name];
                    delete woomy.themes[name];
                    localStorage.removeItem(`${STORAGE_KEY}${name}`);
                    for (let i = 0; i < themeElement.children.length; i++) {
                        const element = themeElement.children[i];
                        if (element.value === name) element.remove();
                    }
                }
                function addTheme(name, content, doStorage = true) {
                    if (woomy.themes[name] != null) return alert("Something weird happened with theme loading. We would recommend you clear theme data and reload the page.");
                    themes[name] = content;
                    woomy.themes[name] = content;
                    if (doStorage) {
                        localStorage.setItem(`${STORAGE_KEY}${name}`, JSON.stringify({
                            name: name,
                            content: content
                        }));
                    }
                    const element = document.createElement("option");
                    element.value = name;
                    element.textContent = `${doStorage ? THEME_KEY : "[BUILT-IN] "}${name[0].toUpperCase()}${name.slice(1) || ""}`;
                    themeElement.appendChild(element);
                }
                for (const key in themes) {
                    addTheme(key, themes[key], false);
                }
                clearThemes.onclick = function () {
                    resultField.value = `{ "Theme":"classic" }`;
                    importButton.click();
                    saveOptions.click();
                    for (const key in themes) {
                        if (!woomy.mybuiltins.includes(key) && !woomy.mybuiltins.includes(key)) removeTheme(key);
                    }
                    resultField.placeholder = `Cleared all custom themes.`;
                };
                let index = 0;
                for (const key in localStorage) {
                    if (key.startsWith(`${STORAGE_KEY}`)) {
                        const data = JSON.parse(localStorage.getItem(key));
                        addTheme(data.name, data.content);
                        index++;
                    }

                }
                resultField.placeholder = `Injected ${index} custom ${index === 1 ? "theme" : "themes"}. Woomy Custom Theme Support by Jekyll`;
                importTheme.onclick = function () {
                    try {
                        const data = JSON.parse(resultField.value);
                        if (typeof data.name !== "string" || data.name.length < 2) throw new Error("Invalid theme name");
                        if (woomy.builtins.includes(data.name)) throw new Error("Name conflicts with woomy builtin");
                        if (Object.keys(themes, false).includes(data.name)) throw new Error("Name conflicts with imported theme");
                        if (typeof data.content !== "object") throw new Error("Content doesn't exist");
                        addTheme(data.name, data.content);
                        resultField.value = `{ "Theme":"${data.name}" }`;
                        importButton.click();
                        saveOptions.click();
                        resultField.value = "";
                        resultField.placeholder = `Theme Imported!`;
                    } catch (error) {
                        resultField.value = "";
                        resultField.placeholder = `Failed to import theme: ${error}`;
                    };
                }
            } catch (error) {

            }
        }, 100);
    });
})();