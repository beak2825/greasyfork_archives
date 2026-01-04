// ==UserScript==
// @name         Change Background Colours [grass, desert, river, snow and beach] Menu on P key
// @version      1.0
// @description  Press "P" to open the colour menu
// @namespace    tampermoney
// @author       fizzixww
// @match        https://sploop.io/
// @icon         https://i.postimg.cc/qMqNSYJK/profile-pic.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492505/Change%20Background%20Colours%20%5Bgrass%2C%20desert%2C%20river%2C%20snow%20and%20beach%5D%20Menu%20on%20P%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/492505/Change%20Background%20Colours%20%5Bgrass%2C%20desert%2C%20river%2C%20snow%20and%20beach%5D%20Menu%20on%20P%20key.meta.js
// ==/UserScript==

(function() {
    let colorMappings = {
        "grass": localStorage.getItem("grass") || "#788f57",
        "desert": localStorage.getItem("desert") || "#b38354",
        "river": localStorage.getItem("river") || "#2a8b9b",
        "snow": localStorage.getItem("snow") || "#ece5db",
        "beach": localStorage.getItem("beach") || "#fcefbb"
    };

    const { fillRect } = CanvasRenderingContext2D.prototype;
    CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
        const canvas = document.getElementById("game-canvas");
        const ctx = canvas.getContext("2d");

        if (this.fillStyle === "#788f57") {
            this.fillStyle = colorMappings["grass"];
        } else if (this.fillStyle === "#b38354") {
            this.fillStyle = colorMappings["desert"];
        } else if (this.fillStyle === "#2a8b9b") {
            this.fillStyle = colorMappings["river"];
        } else if (this.fillStyle === "#ece5db") {
            this.fillStyle = colorMappings["snow"];
        } else if (this.fillStyle === "#fcefbb") {
            this.fillStyle = colorMappings["beach"];
        }

        fillRect.call(this, ...arguments);
    };

    let menuOpen = false;

    document.addEventListener("keydown", function(event) {
        if (event.key === "p" || event.key === "P") {
            if (!menuOpen) {
                const menuDiv = document.createElement("div");
                menuDiv.id = "color-menu";
                menuDiv.style.position = "fixed";
                menuDiv.style.top = "50%";
                menuDiv.style.left = "50%";
                menuDiv.style.transform = "translate(-50%, -50%)";
                menuDiv.style.backgroundColor = "white";
                menuDiv.style.padding = "20px";
                menuDiv.style.border = "2px solid black";
                menuDiv.style.zIndex = "9999";

                for (const type in colorMappings) {
                    const label = document.createElement("label");
                    label.textContent = `${type}: `;
                    const input = document.createElement("input");
                    input.type = "color";
                    input.value = colorMappings[type];
                    input.addEventListener("change", function() {
                        colorMappings[type] = input.value;
                        localStorage.setItem(type, input.value);
                    });
                    menuDiv.appendChild(label);
                    menuDiv.appendChild(input);
                    menuDiv.appendChild(document.createElement("br"));
                }

                document.body.appendChild(menuDiv);
                menuOpen = true;
            } else {
                const menuDiv = document.getElementById("color-menu");
                menuDiv.remove();
                menuOpen = false;
            }
        }
    });
})(); // 4-0 tundra muahahaaha