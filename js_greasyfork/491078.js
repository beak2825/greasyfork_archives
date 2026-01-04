// ==UserScript==
// @name         Bitrix24 Convert Input To Select
// @namespace    https://crm.globaldrive.ru/
// @version      1.0.3
// @description  Tasks doesn't have dropdown lists in our version of B24, this scripts solves this problem.
// @author       Dzorogh 
// @match        https://crm.globaldrive.ru/*
// @require      https://cdn.jsdelivr.net/npm/public-google-sheets-parser@1.5.3
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491078/Bitrix24%20Convert%20Input%20To%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/491078/Bitrix24%20Convert%20Input%20To%20Select.meta.js
// ==/UserScript==

(async function() {
    
    const getSheetId = (lsKey) => {
        let sheetId = localStorage.getItem(lsKey);

        if (!sheetId || sheetId === 'null') {
            sheetId = prompt('Please enter Google Sheet Id');

            if (sheetId) {
                localStorage.setItem(lsKey, sheetId);
            }
        }

        return sheetId;
    }

    const parseExcel = async (sheetId, sheetName) => {
        const parser = new PublicGoogleSheetsParser(sheetId, { sheetName })
        const parserData = await parser.parse();

        console.log('convertInputToSelect: parserData', parserData)

        if (!parserData.length) {
            //localStorage.removeItem(lsKey);
        }

        return parserData
    }
    
    const convertInputToSelect = async (sheetId, sheetName, fieldId) => {
        const parserData = await parseExcel(sheetId, sheetName);

        const options = parserData.map((item) => {
            return item.value;
        })

        console.log('convertInputToSelect: options', options)

        const defaultOption = parserData.find((item) => {
            return item.is_default == 1;
        })

        console.log('convertInputToSelect: defaultOption', defaultOption)

        const inputElement = document.querySelector(`input[name*='${fieldId}']`);

        if (!inputElement) {
            console.error(inputElement)
            throw new Error('Element not found')
        }

        const copyAttsTo = (from, to) => {
            const attrs = from.attributes;

            for (const attr of attrs) {
                if (attr.name !== 'size') {
                    to.setAttribute(attr.name, attr.value);
                }
            }
        }
        
        const newSelectElement = document.createElement("select");

        copyAttsTo(inputElement, newSelectElement);

        inputElement.replaceWith(newSelectElement);

        newSelectElement.style.width = '100%';

        options.unshift('')

        options.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;

            if (inputElement.value === option) {
                optionElement.selected = true;
            } else if (!inputElement.value && defaultOption && defaultOption.value === option) {
                optionElement.selected = true;
            }

            newSelectElement.append(optionElement);
        })
    }

    const parseConfig = async (sheetId, sheetName) => {
        return await parseExcel(sheetId, sheetName);
    }

    const lsKey = 'convertInputToSelectSheetId';
    const configListName = '[Config]';

    const sheetId = getSheetId(lsKey);

    if (!sheetId) {
        console.error('No sheet ID provided');
        return false;
    }

    const config = await parseConfig(sheetId, configListName);

    console.log(config)

    config.forEach((field) => {
        convertInputToSelect(sheetId, field.list_name, field.field_id); 
    });
})();
