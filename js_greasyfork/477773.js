// ==UserScript==
// @name         Edge Local File Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Enhance the experience of viewing local files on Edge.
// @author       PRO
// @match        file:///*/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABt0lEQVR42oxStZoWQRCs2cXdHTLcHZ6EjAwnQWIkJyQlRt4Cd3d3d1n5d7q7ju1zv/q+mh6taQsk8fn29kPDRo87SDMQcNAUJgIQkBjdAoRKdXjm2mOH0AqS+PlkP8sfp0h93iu/PDji9s2FzSSJVg5ykZqWgfGRr9rAAAQiDFoB1OfyESZEB7iAI0lHwLREQBcQQKqo8p+gNUCguwCNAAUQAcFOb0NNGjT+BbUC2YsHZpWLhC6/m0chqIoM1LKbQIIBwlTQE1xAo9QDGDPYf6rkTpPc92gCUYVJAZjhyZltJ95f3zuvLYRGWWCUNkDL2333McBh4kaLlxg+aTmyL7c2xTjkN4Bt7oE3DBP/3SRz65R/bkmBRPGzcRNHYuzMjaj+fdnaFoJUEdTSXfaHbe7XNnMPyqryPcmfY+zURaAB7SHk9cXSH4fQ5rojgCAVIuqCNWgRhLYLhJB4k3iZfIPtnQiCpjAzeBIRXMA6emAqoEbQSoDdGxFUrxS1AYcpaNbBgyQBGJEOnYOeENKR/iAd1npusI4C75/c3539+nbUjOgZV5CkAU27df40lH+agUdIuA/EAgDmZnwZlhDc0wAAAABJRU5ErkJggg==
// @grant        none
// @run-at       document-end
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/477773/Edge%20Local%20File%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/477773/Edge%20Local%20File%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Helper functions
    const path = location.href;
    if (!path.startsWith("file:///") || !path.endsWith("/")) return;
    const debug = false;
    const log = debug ? console.log.bind(console, "[ELFE]") : () => {};
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const getModifier = (e) => (e.ctrlKey << 2 | e.shiftKey << 1 | e.altKey);
    const hasModifier = (e, test = 0b111) => Boolean(getModifier(e) & test);
    const modifierDict = (e) => {
        return {
            "button": e.button || 0,
            "ctrlKey": e.ctrlKey,
            "shiftKey": e.shiftKey,
            "altKey": e.altKey,
            "bubble": false,
        }
    };

    // CSS
    const header = $("h1#header");
    const css = document.createElement("style");
    css.id = "elfe-css";
    css.textContent = `
        html { scroll-behavior: smooth; }
        h1#header > a { color: initial; text-decoration: none; transition: color 0.2s ease-in-out; }
        h1#header > a:hover { color: -webkit-link; }
        table { margin: 0.5rem 0; width: auto; }
        table td, table th { padding: 0.3rem 0.5rem; vertical-align: middle; }
        div#parentDirLinkBox { display: none !important; }
        #parentDir { padding: 0 0.5em 0; }
        thead th { border-left: 1px solid gray; border-right: 1px solid gray; }
        thead th, tbody tr { transition: background-color 0.2s ease-in-out; cursor: pointer; }
        thead th:hover, tbody tr:hover { background-color: #333333; }
        tbody tr.selected { background-color: #4d4d4d; }
    `;
    $("head").appendChild(css);

    // Navigation
    const delimeter = header.textContent.includes("\\") ? "\\" : "/";
    const split = header.textContent.split(delimeter);
    log(split);
    const parts = split.slice(0, -1);
    header.innerHTML = '<a href="../" id="parentDir">↑</a>'
        + parts.map((part, i) =>
            `<a href="${parts.slice(0, i + 1).join(delimeter)}${delimeter}">${part}</a>`
        ).join(delimeter) + delimeter + split.slice(-1)[0];

    // Table
    const rows = $$("tbody tr");
    rows.forEach(row => {
        row.addEventListener("click", e => {
            if (e.button != 0) return true;
            log(e);
            e.preventDefault();
            row.querySelector("a").dispatchEvent(new MouseEvent("click", modifierDict(e)));
            return true;
        });
    });
    $$("td").forEach(td => {
        td.title = td.getAttribute("data-value") || td.textContent;
    });

    // Shortcuts
    const parentDir = $("#parentDir");
    const count = rows.length;
    var selected = 0;
    function select(i) {
        rows[selected].classList.remove("selected");
        selected = i;
        rows[selected].classList.add("selected");
        rows[selected].scrollIntoView({ block: "center" });
    }
    function delta(d) {
        select((selected + d + count) % count);
    }
    document.addEventListener("keydown", e => {
        switch (e.key) {
            case "ArrowUp":
                e.preventDefault();
                if (e.altKey && parentDir) { // Go to parent directory
                    parentDir.click();
                    break;
                }
                if (e.ctrlKey) { // Scroll up
                    window.scrollBy({ top: -window.innerHeight / 2});
                    break;
                }
                if (count == 0) break;
                if (e.shiftKey) { // Select top
                    select(0);
                    break;
                }
                // Select previous
                delta(-1);
                break;
            case "ArrowDown":
                e.preventDefault();
                if (e.ctrlKey) { // Scroll down
                    window.scrollBy({ top: window.innerHeight / 2});
                    break;
                }
                if (count == 0) break;
                if (e.shiftKey) { // Select bottom
                    select(count - 1);
                    break;
                }
                // Select next
                delta(1);
                break;
            case "ArrowLeft":
                if (hasModifier(e)) break; // Try to be none-intrusive
                history.back(); break;
            case "ArrowRight":
                if (hasModifier(e)) break;
                history.forward(); break;
            case "Enter": {
                if (count == 0) break;
                e.preventDefault();
                const link = rows[selected].querySelector("a");
                link.dispatchEvent(new MouseEvent("click", modifierDict(e)));
                break;
            }
            default: break;
        }
    });
})();
