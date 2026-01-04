// ==UserScript==
// @name         WK Lesson Picker JLPT Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight items in the lesson picker by JLPT level using WKOF
// @author       Benjie Genchel
// @match        https://www.wanikani.com/subject-lessons/picker
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544666/WK%20Lesson%20Picker%20JLPT%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/544666/WK%20Lesson%20Picker%20JLPT%20Highlighter.meta.js
// ==/UserScript==

(async function () {
    console.log("Is this working at all");

    'use strict';

    let script_name = 'Lesson Picker JLPT Highlighter';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    console.log('made it here')

    let wkof = window.wkof;

    async function loadJLPT() {
        const urls = {
            N1: "https://raw.githubusercontent.com/stephenmk/yomitan-jlpt-vocab/main/yomitan-jlpt-vocab/term_meta_bank_1.json",
            N2: "https://raw.githubusercontent.com/stephenmk/yomitan-jlpt-vocab/main/yomitan-jlpt-vocab/term_meta_bank_2.json",
            N3: "https://raw.githubusercontent.com/stephenmk/yomitan-jlpt-vocab/main/yomitan-jlpt-vocab/term_meta_bank_3.json",
            N4: "https://raw.githubusercontent.com/stephenmk/yomitan-jlpt-vocab/main/yomitan-jlpt-vocab/term_meta_bank_4.json",
            N5: "https://raw.githubusercontent.com/stephenmk/yomitan-jlpt-vocab/main/yomitan-jlpt-vocab/term_meta_bank_5.json"
        }

        const rawJLPT = {};
        for (const [level, url] of Object.entries(urls)) {
            const text = await wkof.load_file(url);
            rawJLPT[level] = JSON.parse(text);
        }

        return rawJLPT;
    }

    const rawJLPT = await loadJLPT();
    const jLPTMap = {};

    for (const [level, entries] of Object.entries(rawJLPT)) {
        for (const [term, , meta] of entries) {
            if (!term || !meta || !meta.frequency || !meta.frequency.displayValue) continue;

            if (!(term in jLPTMap)) {
                jLPTMap[term] = level;
            }
        }
    }

    const JLPT_COLORS = {
        N1: '#e81717', // red
        N2: '#f28705', // orange
        N3: '#fcec08', // yellow
        N4: '#1f9eff', // blue
        N5: '#05f205', // green
        null: '#e8ebe8' // neutral gray
    };

    function injectLegend() {
        // 1. Create the legend container
        const legend = document.createElement('div');
        legend.style.display = 'flex';
        legend.style.flexDirection = 'column';
        legend.style.position = 'fixed';
        legend.style.right = '10px'
        legend.style.zIndex = '10';
        legend.style.gap = '20px';
        legend.style.padding = '12px';
        legend.style.marginBottom = '12px';
        legend.style.borderRadius = '6px';
        legend.style.background = '#fafafa';
        legend.style.fontSize = '16px';
        legend.style.boxShadow = '1px 1px 10px rgba(0, 0, 0, 0.5)';

        // 2. Build each color‐label pair
        const entries = [
            { level: 'N1', color: JLPT_COLORS.N1 },
            { level: 'N2', color: JLPT_COLORS.N2 },
            { level: 'N3', color: JLPT_COLORS.N3 },
            { level: 'N4', color: JLPT_COLORS.N4 },
            { level: 'N5', color: JLPT_COLORS.N5 },
            { level: 'None', color: JLPT_COLORS.null },
        ];

        const legendHeader = document.createElement('div');
        legendHeader.style.display = 'flex';
        legendHeader.style.alignItems = 'center';
        legendHeader.style.gap = '10px';
        const legendHeaderTitle = document.createElement('span');
        legendHeaderTitle.textContent = 'JLPT Legend';
        legendHeader.appendChild(legendHeaderTitle);
        legend.appendChild(legendHeader);

        entries.forEach(({ level, color }) => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.gap = '10px';

            const swatch = document.createElement('span');
            swatch.style.display = 'inline-block';
            swatch.style.width = '16px';
            swatch.style.height = '16px';
            swatch.style.background = color;
            swatch.style.borderRadius = '4px';
            item.appendChild(swatch);

            const label = document.createElement('span');
            label.textContent = level;
            item.appendChild(label);

            legend.appendChild(item);
        });

        const pickerSection = document.querySelector('.lesson-picker');
        pickerSection.parentNode.insertBefore(legend, pickerSection);
    }


    wkof.include('ItemData');
    wkof.ready('ItemData').then(start);

    function start() {

        injectLegend();

        const tiles = document.querySelectorAll('.lesson-picker__subject');
        tiles.forEach(tile => {
            const term = tile.querySelector('span > div > span');
            const slug = term ? term.textContent.trim() : null;

            const wrapper = document.createElement('div');
            wrapper.style.outline = `4px solid ${JLPT_COLORS[jLPTMap[slug]]}`
            wrapper.style.borderRadius = window.getComputedStyle(term).borderRadius;

            const parent = tile.parentNode;
            parent.replaceChild(wrapper, tile);
            wrapper.appendChild(tile);
        });

    };
})();