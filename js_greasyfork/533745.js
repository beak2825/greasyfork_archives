// ==UserScript==
// @name         XNX Config Manager
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds "Save Config" and "Load Config" buttons to the XNX platform for easy management of configuration files via API.
// @author       moodiness
// @match        https://xnx.gg/settings.html
// @icon         https://xnx.gg/img/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533745/XNX%20Config%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/533745/XNX%20Config%20Manager.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
(function () {
    'use strict';

    const getToken = () => localStorage.getItem('xnx-login-token');

    const createButton = (text, onClick, topPosition) => {
        const btn = document.createElement("button");
        btn.innerText = text;
        Object.assign(btn.style, {
            position: "fixed",
            top: topPosition,
            right: "10px",
            zIndex: 10000,
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
        });
        btn.onclick = onClick;
        document.body.appendChild(btn);
    };

    const showError = (message) => {
        alert(message);
        console.error(message);
    };

    const saveConfig = async () => {
        const token = getToken();
        if (!token) {
            return showError("Token not found in localStorage.");
        }

        try {
            const res = await fetch("https://api.xnx.gg/MenuLoadWeb", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error(`Failed to fetch data. Status: ${res.status}`);

            const data = await res.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "xnx-config.json";
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            showError("Failed to save config. See console for details.");
        }
    };

    const loadConfig = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const json = JSON.parse(e.target.result);

                    if (json.status !== "ok") {
                        return showError("Invalid config file: 'status' is not 'ok'.");
                    }

                    const { data } = json;
                    if (!data) {
                        return showError("Invalid config file: 'data' field missing.");
                    }

                    const token = getToken();
                    if (!token) {
                        return showError("Token not found in localStorage.");
                    }

                    const res = await fetch("https://api.xnx.gg/MenuSaveWeb", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(data)
                    });

                    if (!res.ok) throw new Error(`Failed to save config. Status: ${res.status}`);

                    alert("Config loaded successfully!");
                    window.location.reload();
                } catch (err) {
                    showError("Failed to load config. See console for details.");
                }
            };

            reader.onerror = () => showError("Failed to read file.");
            reader.readAsText(file);
        };

        input.click();
    };

    createButton("Save Config", saveConfig, "10px");
    createButton("Load Config", loadConfig, "50px");
})();
