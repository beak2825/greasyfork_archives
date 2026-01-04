// ==UserScript==
// @name         Roblox Search Filters Enhancer
// @namespace    https://greasyfork.org/users/yourusername
// @version      1.0
// @description  Add filters to Roblox Discover page: Made by Username, Genre
// @author       You
// @license      MIT
// @match        https://www.roblox.com/discover*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535637/Roblox%20Search%20Filters%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/535637/Roblox%20Search%20Filters%20Enhancer.meta.js
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

    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.top = "70px";
    panel.style.right = "20px";
    panel.style.zIndex = "10000";
    panel.style.padding = "10px";
    panel.style.background = "white";
    panel.style.border = "1px solid #ccc";
    panel.style.borderRadius = "8px";
    panel.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    panel.style.fontSize = "14px";
    panel.innerHTML = `
        <strong>Roblox Filters</strong><br/>
        <label>Creator: <input id="rbx_creator" type="text" placeholder="Username" /></label><br/>
        <label>Genre:
            <select id="rbx_genre">
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
        </label><br/>
        <button id="rbx_apply">Apply</button>
    `;
    document.body.appendChild(panel);

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
})();
