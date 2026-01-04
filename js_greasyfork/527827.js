// ==UserScript==
// @name         Iframe Spawner-territorial.io
// @namespace    Violentmonkey Scripts
// @version      2.0
// @description  Spawns multiple iframes when Shift + Left Click is pressed. Works in private/incognito mode and allows multi-account usage with separate iframe storage.
// @author       maanimis
// @match        https://territorial.io/*
// @grant        none
// @run-at      document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527827/Iframe%20Spawner-territorialio.user.js
// @updateURL https://update.greasyfork.org/scripts/527827/Iframe%20Spawner-territorialio.meta.js
// ==/UserScript==

(function () {
    "use strict";

    document.addEventListener("click", function (event) {
        if (event.shiftKey && event.button === 0) { // Shift + Left Click
            event.preventDefault();
            runScript();
        }
    });

    function runScript() {
        const MULTIPLIER = +prompt("MULTIPLIER", "2");
        const URL = "https://territorial.io/";

        function createIframes(count) {
            let container = document.getElementById("iframeContainer");
            if (!container) {
                container = document.createElement("div");
                container.id = "iframeContainer";
                document.body.innerHTML = "";
                document.body.appendChild(container);
                applyStyles();
            }

            const gridSize = Math.ceil(Math.sqrt(count));
            container.style.display = "grid";
            container.style.gap = "10px";
            container.style.width = "100%";
            container.style.height = "100vh";
            container.style.padding = "10px";
            container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
            container.style.gridTemplateRows = `repeat(${Math.ceil(count / gridSize)}, 1fr)`;

            for (let i = 0; i < count; i++) {
                const iframeWrapper = createIframeWrapper(i + 1);
                container.appendChild(iframeWrapper);
            }
        }

        function createIframeWrapper(index) {
            const wrapper = document.createElement("div");
            wrapper.className = "iframe-wrapper";
            wrapper.style.position = "relative";
            wrapper.style.width = "100%";
            wrapper.style.height = "100%";

            const controls = createControls(wrapper, index);
            const iframe = createIframe(index);

            wrapper.appendChild(controls);
            wrapper.appendChild(iframe);

            return wrapper;
        }

        function createIframe(index) {
            const iframe = document.createElement("iframe");
            iframe.id = `frame${index}`;
            iframe.src = URL;
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "2px solid white";
            iframe.style.borderRadius = "10px";
            iframe.style.background = "#000";
            iframe.style.transition = "transform 0.2s ease-in-out";
            iframe.onmouseover = () => (iframe.style.transform = "scale(1.02)");
            iframe.onmouseout = () => (iframe.style.transform = "scale(1)");
            iframe.onload = () => overrideStorage(iframe, index);
            return iframe;
        }

        function createControls(wrapper, index) {
            const controls = document.createElement("div");
            controls.className = "controls";
            controls.style.position = "absolute";
            controls.style.top = "5px";
            controls.style.right = "5px";
            controls.style.zIndex = "10";
            controls.style.display = "flex";
            controls.style.gap = "5px";

            function createButton(text, onClick, color) {
                const button = document.createElement("button");
                button.innerText = text;
                button.style.background = color;
                button.style.border = "none";
                button.style.padding = "5px";
                button.style.cursor = "pointer";
                button.style.color = "white";
                button.style.borderRadius = "5px";
                button.onclick = onClick;
                return button;
            }

            const closeButton = createButton("✖", () => wrapper.remove(), "red");
            const maxButton = createButton("⛶", () => toggleMaximize(wrapper, maxButton), "green");

            controls.appendChild(closeButton);
            controls.appendChild(maxButton);

            return controls;
        }

        function toggleMaximize(wrapper, button) {
            const isMaximized = wrapper.style.position === "fixed";

            if (isMaximized) {
                wrapper.style.position = "relative";
                wrapper.style.width = "100%";
                wrapper.style.height = "100%";
                wrapper.style.zIndex = "1";
                button.innerText = "⛶";
            } else {
                wrapper.style.position = "fixed";
                wrapper.style.top = "0";
                wrapper.style.left = "0";
                wrapper.style.width = "100vw";
                wrapper.style.height = "100vh";
                wrapper.style.zIndex = "999";
                button.innerText = "🗗";
            }
        }

        function overrideStorage(iframe, index) {
            iframe.contentWindow.localStorage = (() => {
                let storage = {};
                return {
                    setItem: (key, value) => (storage[key] = value),
                    getItem: (key) => storage[key] || null,
                    removeItem: (key) => delete storage[key],
                    clear: () => (storage = {}),
                };
            })();
        }

        function applyStyles() {
            document.documentElement.style.setProperty("--gap", "10px");
            document.documentElement.style.setProperty("--border-color", "#fff");
            document.documentElement.style.setProperty("--background-color", "#222");

            document.body.style.display = "flex";
            document.body.style.justifyContent = "center";
            document.body.style.alignItems = "center";
            document.body.style.height = "100vh";
            document.body.style.backgroundColor = "var(--background-color)";
            document.body.style.overflow = "hidden";
        }

        createIframes(MULTIPLIER);
    }
})();

