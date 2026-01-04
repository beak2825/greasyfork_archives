// ==UserScript==
// @name         wowutils exporter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  that retarded thing can't export shit
// @author       standing_in_fire
// @match        https://wowutils.com/viserio-cooldowns/raid
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531045/wowutils%20exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/531045/wowutils%20exporter.meta.js
// ==/UserScript==

//TODO: add visual indication for clipboard action

(function() {
    'use strict';

    console.log("tampermonkey running");

    const style = document.createElement('style');
        document.head.appendChild(style);
        style.sheet.insertRule(`
            @keyframes fadeout {
                0% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
            }
        `);


    async function exportClick() {
        const name_classes = getSetups();
        console.log(name_classes);
        let canvas = createLayout(name_classes);
        await copyImage(canvas);

        showTick();
    }

    function getSetups() {
        let result = new Map();
        let bosses = document.getElementsByClassName("backdrop-blur-3xl box-border w-full");
        for(let boss of bosses) {
            let boss_struct = {};
            let boss_name = boss.getElementsByClassName("uppercase font-cal hidden text-xs lg:flex 2xl:text-sm w-max truncate")[0].innerText;
            let boss_collection = boss.getElementsByClassName("flex border w-full cursor-pointer transition-colors duration-75 overflow-hidden rounded-sm border-muted/50");
            let boss_people = [].slice.call(boss_collection);
            boss_struct = boss_people.map(ppl => {
                return {
                    name : ppl.innerText,
                    present : ppl.innerHTML.includes('brightness(100%)')
                }
            });
            result[boss_name] = boss_struct;
        }
        return result;
    }

    const GRID_ROWS = 10;
    const GRID_COLS = 2;

    const CELL_HEIGHT = 25;
    const CELL_WIDTH = 120;

    const HEADING_HEIGHT = 45;
    const HEADING_WIDTH = 2 * CELL_WIDTH;

    const SEGMENT_OFFSET = 250;

    function createLayout(setup_obj) {

        let setup = Object.entries(setup_obj)
        .map((boss) => {return {
            name:boss[0],
            setup: boss[1]
            .filter((x) => x.present)
            .map((x) => x.name)}})
        .filter(boss => boss.setup.length != 0);
        const layout = document.createElement("canvas");
        layout.width = SEGMENT_OFFSET * setup.length;
        layout.height = HEADING_HEIGHT + 10 * CELL_HEIGHT;
        const layout_ctx = layout.getContext("2d");
        layout_ctx.fillStyle = "white";
        layout_ctx.fillRect(0, 0, layout.width, layout.height);

        for (let i = 0; i < setup.length; ++i) {
            const boss_name = setup[i].name;
            const names = setup[i].setup;
            const heading = createHeading(boss_name);
            const grid = createGrid(names);

            layout_ctx.drawImage(heading, i * SEGMENT_OFFSET, 0);
            layout_ctx.drawImage(grid, i * SEGMENT_OFFSET, HEADING_HEIGHT);
        }
        return layout;
    }

    function createHeading(boss_name) {
        const canvas = document.createElement("canvas");
        canvas.width = HEADING_WIDTH;
        canvas.height = HEADING_HEIGHT;

        const ctx = canvas.getContext("2d");
        //ctx.fillStyle = "white";
        //ctx.fillRect(0, 0, HEADING_WIDTH, HEADING_HEIGHT);
        ctx.fillStyle = "black";
        ctx.font = "24px Arial";
        ctx.fillText(boss_name, 3 , HEADING_HEIGHT - 5);

        return canvas
    }

    function createGrid(names) {
        const rows = GRID_ROWS;
        const cols = GRID_COLS;
        const cellHeight = CELL_HEIGHT;
        const cellWidth = CELL_WIDTH;
        const canvas = document.createElement("canvas");
        canvas.width = cols * CELL_WIDTH;
        canvas.height = rows * CELL_HEIGHT;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                //ctx.fillStyle = "white"
                //ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
                ctx.fillStyle = "black";
                const text = `${names[i + j * 10] || ''}`;
                ctx.fillText(text, j * cellWidth + 3 , i * cellHeight + cellHeight - 5);
            }
        }

        // draw table grid on top
        ctx.strokeStyle = "black";
        for (let i = 0; i <= rows; i++) {
            ctx.beginPath();
            ctx.lineWidth = [0, rows, Math.floor(rows/2)].includes(i) ? 2 : 1; // Make top and bottom borders thicker
            ctx.moveTo(0, i * cellHeight);
            ctx.lineTo(canvas.width, i * cellHeight);
            ctx.stroke();
        }

        for (let i = 0; i <= cols; i++) {
            ctx.beginPath();
            ctx.lineWidth = [0, cols, Math.floor(cols/2)].includes(i) ? 2 : 1; // Make left and right borders thicker
            ctx.moveTo(i * cellWidth, 0);
            ctx.lineTo(i * cellWidth, canvas.height);
            ctx.stroke();
        }
        return canvas;
    }

    async function copyImage(canvas) {
        try {
            // Convert to Blob and copy to clipboard
            const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        } catch (err) {
            console.error("Failed to copy image: ", err);
        }
    }

    let timeout_handle = undefined;
    function showTick() {
        return;
        if(timeout_handle) {
            clearTimeout(timeout_handle);
        }
        const svg = document.getElementById("export_tick");
        svg.style.display = "block";
        svg.style.animation = "fadeOut 2s forwards";

        timeout_handle = setTimeout(() => {
            svg.style.display = "none";
            svg.style.animation = "";
        }, 2000);
    }

    setTimeout(() => {
        const nodes = document.querySelectorAll('button');
        const button = Array.from(nodes).filter((x) => x.textContent.trim().toLowerCase() === 'add reset')[0];
        const clone_button = button.cloneNode();
        clone_button.textContent = "EXPORT bYb"
        clone_button.onclick = exportClick;
        button.parentElement.prepend(clone_button);
    }, 1 * 1000);
})();
