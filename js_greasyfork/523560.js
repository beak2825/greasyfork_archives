// ==UserScript==
// @name         TORN SWAGGER QOL
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  torn swagger api QOL
// @author       Skurk52, Lonerider543
// @match        https://www.torn.com/swagger*
// @icon         https://i.imgur.com/h4lwf9S.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523560/TORN%20SWAGGER%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/523560/TORN%20SWAGGER%20QOL.meta.js
// ==/UserScript==

const delay = ms => new Promise(res => setTimeout(res, ms));
let original_fetch =fetch;

(async function() {
    'use strict';
    let found_container = false;
    let container_tries = 0;
    let container;
    let api_key = localStorage.getItem("torn_api");

    while (!found_container || container_tries >= 300) {
        container = document.querySelector(".scheme-container");
        console.log(container)
        if (container) {
            if (!container.querySelector('input[title="API Key"]')) {
                const wrapper = document.createElement("section");
                wrapper.className = "schemes wrapper block col-12";

                const serverContainer = document.createElement("div");
                serverContainer.className = "schemes-server-container";
                serverContainer.style.marginTop = "10px"

                const innerDiv = document.createElement("div");

                const titleSpan = document.createElement("span");
                titleSpan.className = "servers-title";
                titleSpan.textContent = "API Key";

                const inputContainer = document.createElement("div");
                inputContainer.className = "servers";

                // you really reading my code??? :)
                const label = document.createElement("label");
                label.setAttribute("for", "apikey");
                label.style.marginRight = "10px"

                const input = document.createElement("input");
                input.id = "apikey";
                input.type = "text";
                input.placeholder = "Enter your API Key";
                input.title = "API Key";
                api_key ? input.value = api_key : null;

                input.style.cssText = "width: 100%; margin: 0 !important; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1)"
                input.addEventListener("input", () => {
                    const apiKey = input.value.trim();
                    localStorage.setItem("torn_api", apiKey);
                });

                label.appendChild(input);
                inputContainer.appendChild(label);
                innerDiv.appendChild(titleSpan);
                innerDiv.appendChild(inputContainer);
                serverContainer.appendChild(innerDiv);
                wrapper.appendChild(serverContainer);
                container.appendChild(wrapper);
            }
            found_container = true;
        }
        container_tries++
        await delay(10);
    }

    window.fetch = async (input, init) => {
        init.headers = {
            ...init.headers,
            'Authorization': 'ApiKey '+localStorage.getItem("torn_api") || '',
        };
        return original_fetch(input, init);
    }
})();