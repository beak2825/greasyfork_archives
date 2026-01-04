// ==UserScript==
// @name        KEK UI
// @description Hordes UI Script
// @namespace   https://hordes.io/
// @match       https://hordes.io/play
// @run-at      document-start
// @icon        https://www.google.com/s2/favicons?sz=64&domain=hordes.io
// @license     KEK
// @author      Scrizz and Grigory
// @version     0.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/486797/KEK%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/486797/KEK%20UI.meta.js
// ==/UserScript==

'use strict';

const checkLayoutInterval = setInterval(() => {
    const layout = document.querySelector(".l-ui.layout");
    if (layout) {
        clearInterval(checkLayoutInterval);
        fetch("https://api.github.com/repos/hordesmod/kek-ui/releases/latest")
            .then(response => response.json())
            .then(data => {
                const newWindow = document.createElement("div");
                newWindow.classList.add("window", "panel-black");
                newWindow.style.position = "absolute";
                newWindow.style.width = "366px";
                newWindow.style.top = "50%";
                newWindow.style.left = "50%";
                newWindow.style.textAlign = "center";
                newWindow.style.padding = "12px";
                newWindow.style.transform = "translate(-50%, -50%)";

                const titleFrame = document.createElement("div");
                titleFrame.classList.add("titleframe");
                titleFrame.style.cursor = "pointer";

                const closeBtn = document.createElement("img");
                closeBtn.src = "/data/ui/icons/cross.svg";
                closeBtn.style.float = "right";
                closeBtn.classList.add("btn", "black", "svgicon");
                closeBtn.addEventListener("click", () => newWindow.remove());
                titleFrame.appendChild(closeBtn);
                newWindow.appendChild(titleFrame);

                const updateHeader = document.createElement("h3");
                updateHeader.textContent = `Update KEK UI to Version ${data.tag_name}.`;
                updateHeader.classList.add("textprimary");
                newWindow.appendChild(updateHeader);

                const description1 = document.createElement("p");
                description1.textContent = "To complete the update, make sure to press the";
                newWindow.appendChild(description1);

                const description2 = document.createElement("p");
                description2.classList.add("textparty");
                description2.textContent = "Overwrite";
                newWindow.appendChild(description2);

                const description3 = document.createElement("p");
                description3.textContent = "button in Tampermonkey.";
                newWindow.appendChild(description3);

                const updateBtn = document.createElement("div");
                updateBtn.classList.add("btn", "green", "textblack");
                updateBtn.textContent = "Update Now";
                updateBtn.addEventListener("click", () => {window.open(data.assets[0].browser_download_url);window.location.href = "/"});
                newWindow.appendChild(updateBtn);

                layout.appendChild(newWindow);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }
}, 100);