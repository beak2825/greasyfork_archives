// ==UserScript==
// @name         Nitro Type Auto-Purger (Friends List)
// @namespace    https://greasyfork.org/users/your-username
// @version      1.0
// @description  Purge low-race Nitro Type friends with an interactive GUI and optional Gold-tier unfriend filter.
// @author       InternetTyper
// @license      MIT
// @match        https://www.nitrotype.com/friends*
// @icon         https://i.imgur.com/A8uH5zC.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540378/Nitro%20Type%20Auto-Purger%20%28Friends%20List%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540378/Nitro%20Type%20Auto-Purger%20%28Friends%20List%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    function createGUI() {
        const container = document.createElement("div");
        Object.assign(container.style, {
            position: "fixed",
            top: "120px",
            right: "20px",
            zIndex: 9999,
            backgroundColor: "#c0392b",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 0 10px rgba(0,0,0,0.4)",
            fontFamily: "Arial, sans-serif",
            cursor: "move"
        });

        const header = document.createElement("div");
        header.textContent = "🛠️ Friend Purger";
        header.style.color = "#fff";
        header.style.fontWeight = "bold";
        header.style.fontSize = "18px";
        container.appendChild(header);

        const input = document.createElement("input");
        input.type = "number";
        input.placeholder = "Minimum Races";
        input.value = 100;
        Object.assign(input.style, {
            width: "140px",
            padding: "10px",
            backgroundColor: "#c0392b",
            color: "#fff",
            border: "2px solid #fff",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "16px",
            textAlign: "center",
            outline: "none"
        });

        const goldCheckbox = document.createElement("label");
        goldCheckbox.style.color = "#fff";
        goldCheckbox.style.fontSize = "14px";
        goldCheckbox.style.display = "flex";
        goldCheckbox.style.alignItems = "center";
        goldCheckbox.style.gap = "6px";

        const checkInput = document.createElement("input");
        checkInput.type = "checkbox";
        checkInput.checked = false;

        const labelText = document.createElement("span");
        labelText.textContent = "Unfriend Golds?";

        goldCheckbox.appendChild(checkInput);
        goldCheckbox.appendChild(labelText);

        const btn = document.createElement("button");
        btn.textContent = "Start Purge";
        Object.assign(btn.style, {
            padding: "12px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#c0392b",
            color: "#fff",
            border: "2px solid #fff",
            borderRadius: "6px",
            cursor: "pointer"
        });

        const credit = document.createElement("a");
        credit.href = "https://www.youtube.com/@InternetTyper";
        credit.target = "_blank";
        credit.textContent = "Made By @InternetTyper";
        Object.assign(credit.style, {
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "bold",
            textDecoration: "underline",
            textAlign: "center"
        });

        btn.onclick = async () => {
            const min = parseInt(input.value.trim(), 10);
            const allowGold = checkInput.checked;

            if (isNaN(min)) {
                alert("❗ Enter a valid number.");
                return;
            }

            btn.disabled = true;
            btn.textContent = "Purging...";

            const toggle = document.querySelector('label.switch-label[for="showall"]');
            if (toggle) toggle.click();
            await delay(6000);

            const rows = document.querySelectorAll('.friends-list--row');
            let removed = 0;

            for (const row of rows) {
                const raceCells = row.querySelectorAll('.table-cell--races');
                if (raceCells.length < 2) continue;

                const raceCount = parseInt(raceCells[1].textContent.replace(/,/g, '').trim(), 10);
                const removeBtn = row.querySelector('button[data-tip="Remove Friend"]');
                const isGold = row.querySelector('.type-gold') !== null;

                if (
                    !isNaN(raceCount) &&
                    raceCount < min &&
                    removeBtn &&
                    (allowGold || !isGold)
                ) {
                    removeBtn.click();
                    if (window.confirm) window.confirm = () => true;
                    await delay(800);
                    removed++;
                }
            }

            btn.textContent = `✅ Removed ${removed}`;
        };

        container.appendChild(input);
        container.appendChild(goldCheckbox);
        container.appendChild(btn);
        container.appendChild(credit);
        document.body.appendChild(container);

        // === Drag-to-move logic ===
        let isDragging = false, offsetX, offsetY;
        container.addEventListener("mousedown", e => {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
        });
        document.addEventListener("mousemove", e => {
            if (isDragging) {
                container.style.left = e.clientX - offsetX + "px";
                container.style.top = e.clientY - offsetY + "px";
                container.style.right = "auto";
            }
        });
        document.addEventListener("mouseup", () => { isDragging = false; });
    }

    window.addEventListener("load", () => {
        createGUI();
    });
})();
