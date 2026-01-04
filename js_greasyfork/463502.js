// ==UserScript==
// @name         Better ChatGPT chat width
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Lets you change how wide the chat content can get before wrapping.
// @author       Ardyon
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463502/Better%20ChatGPT%20chat%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/463502/Better%20ChatGPT%20chat%20width.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const save = (value) => value && localStorage.setItem("bcw-width", value);

    const load = () => localStorage.getItem("bcw-width");

    const changeChatWidth = (value) => {
        if(!value) {
            return;
        }

        let css = document.querySelector("#bcw-css");

        if(!css) {
            css = document.createElement("style");
            css.id = "bcw-css";
            css.className = "bcw";
            document.body.appendChild(css);
        }

        css.innerText = `.xl\\:max-w-3xl { max-width: ${value}; } ` +
                        "div.flex.h-full.max-w-full.flex-1.flex-col { width: 100px; }";
    };

    const createChangeOption = (value) => {
        const navSection = document.querySelector("nav.flex .border-t");

        if (navSection.querySelector("#bcw-wrapper")) {
            return navSection.querySelector("#bcw-wrapper");
        }

        const wrapper = document.createElement("div");
        const icon = document.createElement("img");
        const container = document.createElement("div");
        const label = document.createElement("p");
        const input = document.createElement("input");

        // Option wrapper
        wrapper.id = "bcw-wrapper";
        wrapper.className = "bcw flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-800 rounded-md";

        // Option icon
        icon.id = "bcw-icon";
        icon.className = "bcw";
        icon.style = "width: 1rem; height: 1rem;";
        icon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAAHUAAAB1AePCB2UAAADKSURBVDhPzdC/DgFBEMfxCQWJRCLxDJqrFHgCJCj86byjhIIQb0ChuWu8gkZEQcH5ztxechHNcYVf8sntbG4muythGPqYQtdpaI+fExEPNaSN9ng64Kf854A+dqhYFaUK3etYlcj7AG2eRUu5uq/mgjwW6OpGnOSABrS5YJXICltniSeKmKMOS6ZvsMcEd6tEemg7A+i/N4xwgOX9BHrUMUKUdMOljAeGWOtGnE9X0Lu3cLYqyglNbKxKJNM3+CqZDAhwtCpd6JHgBdwRT0vqkqpKAAAAAElFTkSuQmCC";

        // Input container
        container.id = "bcw-container";
        container.className = "bcw";
        container.style = "display: flex; width: fit-content;";

        // Input label
        label.id = "bcw-label";
        label.className = "bcw";
        label.style = "margin-right: 10px;";
        label.innerText = "Chat width: ";

        // Input tag
        input.id = "bcw-input";
        input.className = "bcw";
        input.type = "text";
        input.style = "width: 100px; height: 20px; margin: 0; padding: 5px; font-size: 10pt; border-radius: 3px; line-height: 1; background-color: rgba(0, 0, 0, 0);";
        input.value = value;
        input.addEventListener("keyup", (e) => e.key === "Enter" && changeChatWidth(e.target.value));
        input.addEventListener("focusout", () => save(input.value));

        // Append nodes
        wrapper.append(icon, container);
        container.append(label, input);
        navSection.insertBefore(wrapper, navSection.childNodes[0]);

        return wrapper;
    };

    const observer = new MutationObserver((mutations) => createChangeOption(load()));

    if (document.readyState === "complete" || document.readyState === "interactive") {
        const elem = document.querySelector("#__next");

        // To get rid of the weird double script execution/eval error??
        if(!elem) {
            return;
        }

        changeChatWidth(load());
        createChangeOption(load());
        observer.observe(elem, { childList: true });
    }
})();