// ==UserScript==
// @name         Kinobot Show Timestamps Near Number
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  Display timestamps before the subtitle number.
// @author       seaque
// @license      MIT
// @match        *://*.kino.caretas.club/movie/*
// @match        *://*.kino.caretas.club/episode/*
// @icon         data:image/svg+xml,<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112.16 122.88"><defs><style>.cls-1{fill: whitesmoke;}</style></defs><title>film-camera</title><path class="cls-1" d="M14.76,47.89H71.34a9.56,9.56,0,0,1,9.54,9.53V93a9.58,9.58,0,0,1-9.54,9.54H53.86l12.7,20.37H54.73L40.89,104.27l-14,18.61h-12l12.62-20.37H14.76A9.57,9.57,0,0,1,5.22,93V57.42a9.56,9.56,0,0,1,9.54-9.53Zm.24-38a15,15,0,1,1-15,15,15,15,0,0,1,15-15ZM5.27,24.93A3.05,3.05,0,1,1,8.32,28a3,3,0,0,1-3.05-3.05Zm9.81,9.66a3.06,3.06,0,1,1,3-3.06,3.05,3.05,0,0,1-3,3.06Zm9.66-9.82a3.06,3.06,0,1,1-3-3.05,3.06,3.06,0,0,1,3,3.05Zm-9.82-9.66a3.06,3.06,0,1,1-3.05,3.06,3.06,3.06,0,0,1,3.05-3.06ZM61.06,0A19.89,19.89,0,1,1,41.17,19.89,19.88,19.88,0,0,1,61.06,0Zm-.12,5.8a4.44,4.44,0,1,1-4.44,4.44A4.44,4.44,0,0,1,60.94,5.8ZM46.88,20.08a4.45,4.45,0,1,1,4.44,4.44,4.44,4.44,0,0,1-4.44-4.44ZM61.17,34.14a4.44,4.44,0,1,1,4.44-4.44,4.44,4.44,0,0,1-4.44,4.44Zm14-14.28a4.44,4.44,0,1,1-4.44-4.45,4.44,4.44,0,0,1,4.44,4.45ZM86.3,91V60.38l25.86-15.24v61.51L86.3,91Z"/></svg>
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/447713/Kinobot%20Show%20Timestamps%20Near%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/447713/Kinobot%20Show%20Timestamps%20Near%20Number.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addFunction = () => {
        var scriptElement = document.createElement('script');
        scriptElement.innerHTML =
            `const copyTimeToClipboard = (element, index) => {
               let name = document.getElementsByTagName('h1')[0].textContent;
               let time = document.querySelectorAll(element)[index].innerText;
               navigator.clipboard.writeText('!req ' + name + '[' + time + ']');
            };`
        document.body.appendChild(scriptElement);
    };

    const getSubElements = () => {
        const sub_elements = document.querySelectorAll(`li[id^="sub"]`);
        const timestamps = [];
        let timestamp_value;
        let timestamp_trimmed;

        // This breaks if the movie is longer than 9 hours. Find some other hobby.
        sub_elements.forEach(element => {
            timestamp_value = element.getAttribute("title");
            timestamp_trimmed = timestamp_value.substr(0, 7).replace(/^0+:?0?/, '');
            timestamps.push(timestamp_trimmed);
        });

        return timestamps;
    };

    const timestampDiv = () => {
        var div = document.createElement("div");
        div.setAttribute("class","sub-ts");
        GM_addStyle(`
            .sub-ts
            {
                margin-right: 10px;
                display: inline-block;
                outline: 0;
                cursor: pointer;
                border-radius: 5px;
                border: 2px solid #770919;
                color: #FFFFFF;
                background-color: #770919;
            }

            .sub-ts:hover
            {
                background: 0 0;
            }

            @media screen and (max-width: 600px) {
              .contenedor #reqButton {
                width: 2rem;
                height: 2rem;
              }
              .contenedor input[id^='lines'] {
                width: 2rem;
                margin-left: 0;
              }
              .subtitle_list #sub_list {
                 margin-left: -15px;
                 margin-right: 0px;
              }
            }
        `)
        return div;
    };

    const appendTimestamps = (div, elements) => {

        var contenedor = document.querySelectorAll(".contenedor > li");

        for (let i = 0; i < contenedor.length; i++) {
            div.innerHTML =
                `<button class="sub-ts" title="Copy to Clipboard" onclick="copyTimeToClipboard('.sub-ts', '${i}')"> ${elements[i]} </button>`;
            contenedor[i].insertAdjacentHTML("afterbegin", div.innerHTML);
        }
    };

    addFunction();
    appendTimestamps(timestampDiv(), getSubElements());

})();