// ==UserScript==
// @name:zh-tw   健保快易通荷爾蒙標準更正器 - 跨女版
// @name         HealthBank Hormone Corrector - for MtF
// @namespace    com.sherryyue.healthbankmtfhormonebeautifier
// @version      0.3
// @description:zh-tw 此腳本更正健保快易通應用程式中荷爾蒙檢驗結果（如雄性激素和雌激素）的顏色顯示，無論證件上的性別為何，一律使用女性標準。這確保尚未更改證件性別的跨性別女性能看到準確且公平的荷爾蒙數值顯示。
// @description  This script corrects the display of hormone test results (such as androgens and estrogens) in the HealthBank app to use female standards for color coding, regardless of the gender on the ID. This ensures that transgender women who have not updated their ID gender see accurate and fair representation of their hormone levels.
// @author          SherryYue
// @copyright       SherryYue
// @match        *://myhealthbank.nhi.gov.tw/*
// @license         MIT
// @supportURL   sherryyue.c@protonmail.com
// @icon         https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL   "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage     "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503085/HealthBank%20Hormone%20Corrector%20-%20for%20MtF.user.js
// @updateURL https://update.greasyfork.org/scripts/503085/HealthBank%20Hormone%20Corrector%20-%20for%20MtF.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let PER_DATA_DIR;
    (function (PER_DATA_DIR) {
        PER_DATA_DIR[PER_DATA_DIR["ROWS_MODE"] = 0] = "ROWS_MODE";
        PER_DATA_DIR[PER_DATA_DIR["COLUMNS_MODE"] = 1] = "COLUMNS_MODE";
    })(PER_DATA_DIR || (PER_DATA_DIR = {}));
    ;
    function extractNumbers(input) {
        const matches = input.match(/-?\d+(\.\d+)?/g);
        return matches ? matches.map(Number)[0] : 0;
    }
    function rejudgeItemColor(labelCell, valueCell) {
        if (!labelCell || !valueCell)
            return;
        const labelText = labelCell.textContent.trim();
        const valueText = valueCell.textContent.trim();
        const value = extractNumbers(valueText);
        if (!labelText || !valueText)
            return;
        switch (labelText) {
            case 'Testosterone':
                const femaleMin = 0.14, femaleMax = 0.53;
                if (value < femaleMin || value > femaleMax) {
                    console.warn('Testosterone value %f out of range.', value);
                    valueCell.classList.add('sign-red');
                }
                else {
                    console.log('Testosterone value %f in range.', value);
                    valueCell.classList.remove('sign-red');
                }
                break;
            case 'Estradiol(E2)':
                const e2Min = 21, e2Max = 649;
                if (value < e2Min || value > e2Max) {
                    console.warn('Estradiol value %f out of range.', value);
                    valueCell.classList.add('sign-red');
                }
                else {
                    console.log('Estradiol value %f in range.', value);
                    valueCell.classList.remove('sign-red');
                }
                break;
        }
    }
    function extractItems(tableName, meta) {
        const table = document.querySelector(meta.tableQuery);
        if (!table)
            return;
        console.groupCollapsed(`=====${tableName}=====`);
        if (meta.dataAlignMode === PER_DATA_DIR.ROWS_MODE) {
            const labelCell = table.querySelectorAll('tr')?.[meta.labelIndex].querySelectorAll('td')?.[1];
            const valueCell = table.querySelectorAll('tr')?.[meta.valueIndex].querySelectorAll('td')?.[1];
            rejudgeItemColor(labelCell, valueCell);
        }
        else {
            const dataLines = Array.from(table.querySelectorAll('tr'));
            dataLines.forEach((dataLine) => {
                const labelCell = dataLine.querySelectorAll('td')?.[meta.labelIndex];
                const valueCell = dataLine.querySelectorAll('td')?.[meta.valueIndex];
                rejudgeItemColor(labelCell, valueCell);
            });
        }
        console.groupEnd();
    }
    function main() {
        const table4mobile = ".tab-content.d-lg-long-none table";
        const table4Desktop = ".d-none.d-lg-long-block.custom-table table";
        const mobilePopup = "#teachingModal table";
        extractItems('Table for Moblie', { tableQuery: table4mobile, labelIndex: 1, valueIndex: 2, dataAlignMode: PER_DATA_DIR.COLUMNS_MODE });
        extractItems('Table for Desktop', { tableQuery: table4Desktop, labelIndex: 3, valueIndex: 4, dataAlignMode: PER_DATA_DIR.COLUMNS_MODE });
        extractItems('Popup for Moblie', { tableQuery: mobilePopup, labelIndex: 4, valueIndex: 5, dataAlignMode: PER_DATA_DIR.ROWS_MODE });
    }
    let observer = new MutationObserver((mutations, obs) => {
        main();
    });
    observer.observe(document.querySelector("body"), {
        childList: true,
        subtree: true,
        characterData: true,
    });
})();
