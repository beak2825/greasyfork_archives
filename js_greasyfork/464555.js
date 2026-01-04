// ==UserScript==
// @name         Topic Highlighter
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.3
// @description  it highlights
// @author       Milan
// @match        https://*.websight.blue/threads/*
// @match        https://websight.blue/multi/*
// @match        https://*.websight.blue/

// @icon         https://lore.delivery/static/blueshi.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/464555/Topic%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/464555/Topic%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Edit these to customize text colors for light and dark background colors
    const LIGHT_COLOR = "rgb(255,255,255)";
    const DARK_COLOR = "rgb(0,0,0)";

    const swatch = document.createElement("datalist");
    swatch.id = "swatch";

    const presetColor = (hexCode) => {
        const p = document.createElement("option");
        p.value = hexCode;
        swatch.appendChild(p);
    }

    presetColor("#d6d6d6"); // white
    presetColor("#e5b567"); // yellow
    presetColor("#b4d273"); // green
    presetColor("#e87d3e"); // orange
    presetColor("#9e86c8"); // purple
    presetColor("#b05279"); // pink
    presetColor("#6c99bb"); // blue
    presetColor("#fb4934") // bright red
    presetColor("#b8bb26") // bright green
    presetColor("#fabd2f") // bright yellow
    presetColor("#83a598") // bright blue
    presetColor("#d3869b") // bright purple
    presetColor("#fe8019") // bright orange

    document.body.appendChild(swatch);

    const isLight = color => {
        let r, g, b, hsp;

        // Convert it to RGB: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;

        hsp = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
        );

        if (hsp>127.5) {

            return true;
        }
        else {

            return false;
        }
    }

    const highlightedTopics = new Map(JSON.parse(localStorage.getItem("highlighted-topics")));

    const serializeMap = m => {
        return JSON.stringify(Array.from(m.entries()));
    }

    const styleRule = (id, color) => {
        return `#${id} td { background-color: ${color} !important; } #${id} a, #${id} span { color: ${isLight(color) ? DARK_COLOR : LIGHT_COLOR};  }`
    }

    const resetStyleRule = id => {
        return `#${id} td { background-color: var(--MsgBG) !important; } #${id} a, #${id} span { color: var(--Unvisited, var(--Text)) !important; }`;
    }

    const setStyle = topics => {
        GM_addStyle(topics.map(topic => {
            return styleRule(topic.id, topic.color);
        }).join("\n"));
    }

    setStyle([...highlightedTopics.keys()].map(k => { return {id: k, color: highlightedTopics.get(k) } }));


    document.querySelectorAll("#thread-list tr[id]").forEach(threadRow=>{
        const topic = highlightedTopics.get(threadRow.id);
        const target = threadRow.querySelector("td.oh .fr");
        const colorPickerButton = document.createElement("a");
        const hiddenInput = document.createElement("input");
        colorPickerButton.href = "#";
        colorPickerButton.innerHTML = "&#127912;";
        colorPickerButton.style.textDecoration = "none";
        colorPickerButton.onclick = e => {
            e.preventDefault();
            hiddenInput.click();
        }
        colorPickerButton.onauxclick = e => {
            e.preventDefault();
            highlightedTopics.delete(threadRow.id);
            localStorage.setItem("highlighted-topics", serializeMap(highlightedTopics));
            GM_addStyle(resetStyleRule(threadRow.id));
        }
        hiddenInput.type = "color";
        hiddenInput.style.opacity = "0";
        hiddenInput.style.width = "0";
        hiddenInput.style.height = "0";
        hiddenInput.setAttribute("list", swatch.id);
        hiddenInput.onchange = () => {
            highlightedTopics.set(threadRow.id, hiddenInput.value);
            localStorage.setItem("highlighted-topics", serializeMap(highlightedTopics));
            GM_addStyle(styleRule(threadRow.id, hiddenInput.value));
        }
        target.appendChild(hiddenInput);
        target.appendChild(colorPickerButton);
    });
})();