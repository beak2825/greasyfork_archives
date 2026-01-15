// ==UserScript==
// @name         bustimes.org - Theme Builder
// @namespace    https://bustimes.org/
// @version      1.4
// @description  Create custom themes for bustimes.org
// @author       petabyte
// @match        https://bustimes.org/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/546270/bustimesorg%20-%20Theme%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/546270/bustimesorg%20-%20Theme%20Builder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////////////////////////////////
    // Capture site defaults
    ////////////////////////////////
    const linkColour = getComputedStyle(document.querySelector("a"))?.color || "#0077cc";
    const siteDefaults = {
        background: getComputedStyle(document.body).backgroundColor || "#ffffff",
        text: getComputedStyle(document.body).color || "#000000",
        header: getComputedStyle(document.querySelector("header, .site-header"))?.backgroundColor || "#f4f4f4",
        link: linkColour,
        button: getComputedStyle(document.querySelector("button, input[type=submit], .button"))?.backgroundColor || "#0077cc",
        buttonText: linkColour, // <- default button text is same as link colour
        backgroundImage: null
    };

    ////////////////////////////////
    // Load & Save
    ////////////////////////////////
    const loadTheme = () => {
        const saved = localStorage.getItem("bustimes-theme");
        return saved ? JSON.parse(saved) : siteDefaults;
    };

    const saveTheme = (theme) => {
        localStorage.setItem("bustimes-theme", JSON.stringify(theme));
    };

    ////////////////////////////////
    // Apply theme
    ////////////////////////////////
    const applyTheme = (theme) => {
        if (theme.backgroundImage) {
            document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${theme.backgroundImage})`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundAttachment = "fixed";
            document.body.style.backgroundPosition = "center";
        } else {
            document.body.style.backgroundImage = "none";
            document.body.style.backgroundColor = theme.background;
        }

        document.body.style.color = theme.text;

        document.querySelectorAll("header, .site-header").forEach(el => {
            el.style.backgroundColor = theme.header;
        });

        document.querySelectorAll("a").forEach(el => {
            el.style.color = theme.link;
        });

        document.querySelectorAll("button, input[type=submit], .button").forEach(el => {
            el.style.backgroundColor = theme.button;
            el.style.color = theme.buttonText;
            el.style.border = "none";
            el.style.padding = "0.5em 1em";
            el.style.borderRadius = "5px";
        });
    };

    ////////////////////////////////
    // Build UI panel
    ////////////////////////////////
    const buildPanel = (theme) => {
        const panel = document.createElement("div");
        panel.innerHTML = `
            <h3 style="margin:0 0 8px 0;">Theme Builder</h3>
            <label>Background <input type="color" id="bg" value="${rgbToHex(theme.background)}"></label><br>
            <label>Text <input type="color" id="text" value="${rgbToHex(theme.text)}"></label><br>
            <label>Header <input type="color" id="header" value="${rgbToHex(theme.header)}"></label><br>
            <label>Links <input type="color" id="link" value="${rgbToHex(theme.link)}"></label><br>
            <label>Buttons <input type="color" id="button" value="${rgbToHex(theme.button)}"></label><br>
            <label>Button Text <input type="color" id="buttonText" value="${rgbToHex(theme.buttonText)}"></label><br>
            <label>Upload Background Image <input type="file" id="bgImage" accept="image/*"></label><br>
            <button id="reset-theme">Reset to Defaults</button>
        `;
        panel.id = "theme-panel";
        panel.style.display = "none"; // hidden by default
        document.body.appendChild(panel);

        // Event listeners
        ["bg","text","header","link","button","buttonText"].forEach(key => {
            panel.querySelector(`#${key}`).addEventListener("input", (e) => {
                theme[key === "bg" ? "background" : key] = e.target.value;
                applyTheme(theme);
                saveTheme(theme);
            });
        });

        // Background image upload
        panel.querySelector("#bgImage").addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    theme.backgroundImage = ev.target.result;
                    applyTheme(theme);
                    saveTheme(theme);
                };
                reader.readAsDataURL(file);
            }
        });

        // Reset button
        panel.querySelector("#reset-theme").addEventListener("click", () => {
            Object.assign(theme, siteDefaults); // restore defaults
            saveTheme(theme);
            applyTheme(theme);
            document.querySelectorAll("#theme-panel input[type=color]").forEach(input => {
                const name = input.id === "bg" ? "background" : input.id;
                input.value = rgbToHex(theme[name]);
            });
            panel.querySelector("#bgImage").value = "";
        });

        return panel;
    };

    ////////////////////////////////
    // Utility: RGB -> HEX
    ////////////////////////////////
    function rgbToHex(rgb) {
        if (!rgb) return "#000000";
        const result = rgb.match(/\d+/g);
        if (!result) return "#000000";
        return "#" + result.slice(0,3).map(x => {
            const hex = parseInt(x, 10).toString(16).padStart(2, "0");
            return hex;
        }).join("");
    }

    ////////////////////////////////
    // Style the panel
    ////////////////////////////////
    GM_addStyle(`
        #theme-panel {
            position: fixed;
            bottom: 60px;
            right: 20px;
            background: white;
            color: black;
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 10px;
            z-index: 999999;
            font-family: sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        #theme-panel label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
        }
        #theme-panel input[type=color],
        #theme-panel input[type=file] {
            margin-left: 10px;
        }
        #theme-panel button {
            margin-top: 8px;
            padding: 4px 8px;
            border: none;
            background: #d9534f;
            color: white;
            border-radius: 5px;
            cursor: pointer;
        }
    `);

    ////////////////////////////////
    // Init
    ////////////////////////////////
    const theme = loadTheme();
    applyTheme(theme);
    const panel = buildPanel(theme);

    // Add footer link
    const footer = document.querySelector("footer ul.user");
    if (footer) {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = "Theme Builder";
        link.addEventListener("click", (e) => {
            e.preventDefault();
            panel.style.display = (panel.style.display === "none") ? "block" : "none";
        });
        li.appendChild(link);
        footer.appendChild(li);
    }
})();
