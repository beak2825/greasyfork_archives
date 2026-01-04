// ==UserScript==
// @name         Roblox Search Filters Enhancer (with Theme Toggle)
// @namespace    https://greasyfork.org/users/yourusername
// @version      1.1
// @description  Adds creator and genre filters with Roblox-style UI and dark/light toggle on the Discover page.
// @author       You
// @license      MIT
// @match        https://www.roblox.com/discover*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535638/Roblox%20Search%20Filters%20Enhancer%20%28with%20Theme%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535638/Roblox%20Search%20Filters%20Enhancer%20%28with%20Theme%20Toggle%29.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 You

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
    'use strict';

    const FONT_FAMILY = `'GothamSSm', 'Arial', sans-serif`;

    const theme = {
        light: {
            bg: "#ffffff",
            text: "#222",
            border: "#ccc",
            button: "#e5e5e5"
        },
        dark: {
            bg: "#1a1a1a",
            text: "#eee",
            border: "#333",
            button: "#333"
        }
    };

    let currentTheme = localStorage.getItem("rbx_filter_theme") || "light";

    function applyTheme(panel, themeName) {
        const t = theme[themeName];
        panel.style.background = t.bg;
        panel.style.color = t.text;
        panel.style.borderColor = t.border;
        panel.querySelectorAll("input, select, button").forEach(el => {
            el.style.background = t.button;
            el.style.color = t.text;
            el.style.border = `1px solid ${t.border}`;
        });
    }

    // Create main panel
    const panel = document.createElement("div");
    panel.id = "rbx-filter-panel";
    panel.style.position = "fixed";
    panel.style.top = "110px";
    panel.style.right = "20px";
    panel.style.zIndex = "10000";
    panel.style.padding = "10px";
    panel.style.border = "1px solid";
    panel.style.borderRadius = "8px";
    panel.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    panel.style.fontSize = "14px";
    panel.style.fontFamily = FONT_FAMILY;
    panel.style.minWidth = "200px";
    panel.innerHTML = `
        <strong style="display:block; margin-bottom: 8px;">Roblox Filters</strong>
        <label>Creator:<br/><input id="rbx_creator" type="text" placeholder="Username" style="width:100%" /></label><br/><br/>
        <label>Genre:<br/>
            <select id="rbx_genre" style="width:100%">
                <option value="">-- Any --</option>
                <option value="1">All</option>
                <option value="13">Adventure</option>
                <option value="19">Building</option>
                <option value="3">Comedy</option>
                <option value="5">Fighting</option>
                <option value="10">FPS</option>
                <option value="8">Horror</option>
                <option value="11">Medieval</option>
                <option value="9">Military</option>
                <option value="20">Naval</option>
                <option value="2">RPG</option>
                <option value="15">Sci-Fi</option>
                <option value="4">Sports</option>
                <option value="17">Town and City</option>
                <option value="6">Western</option>
            </select>
        </label><br/><br/>
        <button id="rbx_apply" style="width:100%; margin-bottom: 6px;">Apply</button>
        <button id="rbx_theme" style="width:100%;">Toggle Theme</button>
    `;
    document.body.appendChild(panel);
    applyTheme(panel, currentTheme);

    // Place toggle button near search bar
    const waitForSearchBar = setInterval(() => {
        const searchBar = document.querySelector('.search-input-container input');
        if (searchBar) {
            clearInterval(waitForSearchBar);
            const btn = document.createElement("button");
            btn.textContent = "🔍 Filters";
            btn.style.marginLeft = "10px";
            btn.style.padding = "4px 10px";
            btn.style.fontSize = "13px";
            btn.style.fontFamily = FONT_FAMILY;
            btn.style.borderRadius = "4px";
            btn.style.border = "1px solid #ccc";
            btn.style.cursor = "pointer";
            btn.style.background = "#f5f5f5";
            btn.onclick = () => {
                panel.style.display = panel.style.display === "none" ? "block" : "none";
            };
            searchBar.parentElement.appendChild(btn);
        }
    }, 500);

    // Apply button logic
    document.getElementById("rbx_apply").onclick = () => {
        const creator = document.getElementById("rbx_creator").value.trim();
        const genre = document.getElementById("rbx_genre").value;

        const params = new URLSearchParams(window.location.search);

        if (creator) {
            params.set("creatorName", creator);
            params.set("creatorType", "User");
        } else {
            params.delete("creatorName");
            params.delete("creatorType");
        }

        if (genre) {
            params.set("Genre", genre);
        } else {
            params.delete("Genre");
        }

        window.location.search = params.toString();
    };

    // Theme toggle logic
    document.getElementById("rbx_theme").onclick = () => {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        localStorage.setItem("rbx_filter_theme", currentTheme);
        applyTheme(panel, currentTheme);
    };
})();
