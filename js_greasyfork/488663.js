// ==UserScript==
// @name         linux.do只看楼主
// @namespace    
// @version      2024-02-29
// @description  只看楼主
// @author       
// @match        https://linux.do/*
// @icon         https://linux.do/uploads/default/optimized/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b_2_180x180.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488663/linuxdo%E5%8F%AA%E7%9C%8B%E6%A5%BC%E4%B8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/488663/linuxdo%E5%8F%AA%E7%9C%8B%E6%A5%BC%E4%B8%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Simplify localStorage access
    const storage = {
        set: (key, value) => window.localStorage.setItem(key, value),
        get: (key, defaultValue) => window.localStorage.getItem(key) || defaultValue,
    };

    // Function to toggle visibility based on user ID
    function toggleVisibility() {
        const displayMode = storage.get("on_off", "当前查看全部");
        const userId = document.getElementById("post_1").getAttribute('data-user-id');
        document.querySelectorAll('article').forEach(article => {
            article.style.display = (displayMode === "当前只看楼主" && article.dataset.userId !== userId) ? 'none' : '';
        });
    }

    // Create and configure the button
    function createToggleButton() {
        if (document.getElementById("toggleVisibilityBtn")) {
            // Button already exists, no need to recreate it
            return;
        }

        const btn = document.createElement("button");
        btn.id = "toggleVisibilityBtn"; // Set a unique ID for the button
        btn.textContent = storage.get("on_off", "当前查看全部");
        btn.onclick = function() {
            const newText = btn.textContent === '当前查看全部' ? '当前只看楼主' : '当前查看全部';
            document.getElementsByClassName("start-date")[0].click();
            btn.textContent = newText;
            storage.set("on_off", newText);
            toggleVisibility(); // Apply visibility settings immediately
        };

        // Button styles
        btn.style.backgroundColor = "#333";
        btn.style.color = "#FFF";
        btn.style.border = "none";
        btn.style.padding = "10px 20px";
        btn.style.margin = "10px";
        btn.style.borderRadius = "5px";
        btn.style.cursor = "pointer";

        // Append the button to a specific location
        const controlsContainer = document.querySelector(".timeline-footer-controls");
        if (controlsContainer) {
            controlsContainer.appendChild(btn);
        }
    }

    // Observe page changes to reapply visibility settings
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            // Check if the specific location for the button exists and if the button does not
            if (document.querySelector(".timeline-footer-controls") && !document.getElementById("toggleVisibilityBtn")) {
                createToggleButton();
            }
            toggleVisibility(); // Reapply visibility settings
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize the script
    function init() {
        if (document.readyState === 'complete') {
            createToggleButton();
            observePageChanges();
            toggleVisibility(); // Initial application of visibility settings
        } else {
            window.addEventListener('load', () => {
                createToggleButton();
                observePageChanges();
                toggleVisibility();
            });
        }
    }

    init();
})();
