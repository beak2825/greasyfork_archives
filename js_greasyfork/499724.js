// ==UserScript==
// @name        Paragon页面直接开出Winston case
// @version     1.3
// @description 从paragon点击获取case相应信息，然后点击winston按钮进行case创建
// @author      lulzhang@
// @grant       GM_setClipboard
// @grant       GM_openInTab
// @grant       GM_setValue
// @grant       GM_getValue
// @match       https://paragon-fe.amazon.com/hz/view-case?*
// @match       https://fe.winston.a2z.com/JP/task
// @namespace https://greasyfork.org/users/1326983
// @downloadURL https://update.greasyfork.org/scripts/499724/Paragon%E9%A1%B5%E9%9D%A2%E7%9B%B4%E6%8E%A5%E5%BC%80%E5%87%BAWinston%20case.user.js
// @updateURL https://update.greasyfork.org/scripts/499724/Paragon%E9%A1%B5%E9%9D%A2%E7%9B%B4%E6%8E%A5%E5%BC%80%E5%87%BAWinston%20case.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const prefix_paragon = "https://fe.winston.a2z.com/JP/task";
    const currentUrl = window.location.href;
    const paragoncaseid = currentUrl.substring(50);

    const FAT_text = {
        "JP006": "JP006_Virtual Product Bundles | JP006_バンドル商品の作成と更新",
        "JP011": "JP011_Browse Node Update for Media ASINs | JP011_ブラウズ更新 (Media)",
        "JP021": "JP021_Attribute Update for Retail ASINs | JP021_Retail ASINカタログAttributeの更新",
        "JP031": "JP031_ Upload or Delete a Video | JP031_ 動画アップロード・削除",
        "JP036": "JP036_Image Update & Deal Image create | JP036_画像更新&Deal画像作成",
        "JP051": "JP051_Variation Management(Create&Add&Remove) | JP051_バリエーション マネジメント(新規/追加/削除)",
        "JP059": "JP059_Create and Remove OB Widget | JP059_後継機種設定と解除",
        "JP068": "JP068_Missing Buybox | JP068_異常Buybox確認と修正",
        "JP077": "JP077_Update Aplus | JP077_Aプラスのアップロード",
        "JP107": "JP107_IDQ report Generation | JP107_IDQレポート",
        "JP108": "JP108_IPC Exclusion Reporting & Reinstatement | JP108_注文除外ASINレポートと復活",
        "JP119":"JP119_SL Auto variation broken fix | JP119_SL バリエーションばらけの修正",
        "JP184":"JP184_Add / Remove EAN | JP184_追加 / 削除 EAN",
    };

    function findUpperCaseWords(inputString) {
        const regex = /\b[A-Z]{4,5}\b/g;
        const matches = inputString.match(regex);
        console.log('Matches found:', matches);
        return matches ? matches : [];
    }

    function waitForElm(selector) {
        console.log(`Waiting for element: ${selector}`);
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations, obs) => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    obs.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
            }
        });
    }

    function parseParagonPage() {
        try {
            const titleElement = document.querySelector('h1.caseSubject_2gAaf');
            if (!titleElement) throw new Error('Title element not found');

            const infoArea = document.getElementById('flo-ccd-case-info');
            if (!infoArea) throw new Error('Info area not found');

            const title = titleElement.textContent.trim();
            console.log('Title:', title);

            const paragonId = document.querySelector('kat-table-cell.value').textContent.match(/\d+/)[0];
            if (!paragonId) throw new Error('Paragon ID element not found');
            console.log('Paragon ID:', paragonId);

            const tasklist = ["JP006","JP011","JP021","JP031","JP036", "JP051","JP059","JP068","JP077","JP107","JP108","JP119","JP184",'JP015'];
            const matches = title.match(/[A-Z0-9]{5}/g) || [];
            const taskType = matches.filter(match => tasklist.includes(match.toUpperCase()));
            const vendorCode = matches.filter(match => !tasklist.includes(match.toUpperCase()));
            if (vendorCode.length === 0) throw new Error('Vendor code not found');

            const bs_login = matches.filter(match => tasklist.includes(match.toUpperCase()));
            const FAT = FAT_text[taskType];

            console.log('Vendor Code:', vendorCode[0]);
            console.log('Task Type:', taskType);

            GM_setValue("vendorCode", vendorCode[0]);
            GM_setValue("paragonId", paragonId);
            GM_setValue("bs_login", bs_login);
            GM_setValue("title", `${title}_${paragonId}_代理/lulzhang`);
            GM_setValue("FAT", FAT);

            alert(`Title: ${title}\nParagon ID: ${paragonId}\nVendor Code: ${vendorCode[0]}\nTask Type: ${taskType.join(', ')}`);
        } catch (error) {
            console.error('Error during script execution:', error);
        }
    }

async function fillWinstonForm() {
    try {
        const vendorCode = GM_getValue("vendorCode");
        const title = GM_getValue("title");
        const paragonId = GM_getValue("paragonId");
        const taskType = GM_getValue("taskType");
        const FAT = GM_getValue("FAT");

        console.log('Starting to fill the form...');

        const vendorCodeArea = await waitForElement('#awsui-input-0');
        const titleArea = await waitForElement('#awsui-input-1');
        const paragon_IDArea = await waitForElement('#awsui-input-3');
        const searchButton = await waitForElement("span > awsui-button:nth-child(1) > .awsui-button-variant-normal");

        vendorCodeArea.value = vendorCode;
        vendorCodeArea.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('Vendor code set:', vendorCode);

        searchButton.click();
        console.log('Search button clicked');

        try {
            const glErrorElement = await waitForElement("#awsui-select-10-error", 1000);
            const handledGLDropdown = await handleGLDropdown();
            await waitForSeconds(2);
        } catch (error) {
            console.log('GL dropdown error not found or timeout:', error);
        }


        titleArea.value = title;
        titleArea.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('Title set:', title);

        paragon_IDArea.value = paragonId;
        paragon_IDArea.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('Paragon ID set:', paragonId);

        await handleDropdown('.awsui-dropdown-trigger.awsui-select-trigger.awsui-select-trigger-no-option.awsui-select-trigger-variant-label', '#awsui-select-2-dropdown-options', FAT, '#awsui-select-2-textbox > span', "#awsui-select-6-textbox", 'Paragon');
        await waitForSeconds(3);

        await handleDropdown('.awsui-dropdown-trigger.awsui-select-trigger.awsui-select-trigger-no-option.awsui-select-trigger-variant-label', '#awsui-select-14-dropdown-options', '0 - 49', '#awsui-select-2-textbox > span');
    } catch (error) {
        console.error('Error during script execution:', error);
    }
}

function waitForElement(selector, timeout = 2000) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                clearTimeout(timer);
                resolve(element);
            }
        }, 100);

        const timer = setTimeout(() => {
            clearInterval(interval);
            reject(new Error(`Timeout: Element ${selector} not found`));
        }, timeout);
    });
}


function waitForSeconds(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function handleGLDropdown() {
    try {
        const glErrorMessage = await waitForElement("#awsui-select-10-error");
        const glDropdown = await waitForElement('awsui-select[data-component-name="src_components_task_VendorInformation_VendorGL"] .awsui-dropdown-trigger.awsui-select-trigger.awsui-select-trigger-no-option.awsui-select-trigger-variant-label');

        if (glErrorMessage && glDropdown) {
            glDropdown.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
            glDropdown.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

            await waitForSeconds(0.5);

            const dropdownOptions = document.querySelector("#awsui-select-10-dropdown-options");
            const firstOption = dropdownOptions.querySelector('li:first-child div');
            if (firstOption) {
                firstOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                firstOption.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

                await waitForSeconds(0.5);
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error in handleGLDropdown:', error);
        return false;
    }
}

async function handleDropdown(triggerSelector, optionsSelector, optionText, targetTextSelector, sourceTypeSelector, sourceTypeText) {
    const targetDropdown = await waitForElement(triggerSelector);
    targetDropdown.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));

    await waitForSeconds(0.5);

    const dropdownOptionsContainer = document.querySelector(optionsSelector);
    if (dropdownOptionsContainer) {
        const optionToSelect = Array.from(dropdownOptionsContainer.querySelectorAll('div.awsui-select-option')).find(option => option.textContent.includes(optionText));

        if (optionToSelect) {
            optionToSelect.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            optionToSelect.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

            const targetElement = document.querySelector(targetTextSelector);
            targetElement.textContent = optionToSelect.textContent;

            if (sourceTypeSelector && sourceTypeText) {
                const sourceTypeElement = document.querySelector(sourceTypeSelector);
                sourceTypeElement.textContent = sourceTypeText;
            }

            console.log(`Inputed: ${optionText}`);
        } else {
            console.error(`Missing: ${optionText}`);
        }
    } else {
        console.error('未找到下拉菜单框');
    }
}

    // 添加按钮到页面
    if (currentUrl.includes('https://paragon-fe.amazon.com/hz/view-case?caseId=')) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        let paragonClicked = false; // 标记

        const paragonButton = document.createElement('div');
        paragonButton.innerHTML = `<div id="parseParagonPage"><span style="color:black;"></span><button style="color:black;">获取Paragon信息</button></div>`;

        const winstonButton = document.createElement('div');
        winstonButton.innerHTML = `<div id="fillWinstonForm"><span style="color:black;"></span><button style="color:black;">跳转并填写Winston</button></div>`;

        buttonContainer.appendChild(paragonButton);
        buttonContainer.appendChild(winstonButton);

        waitForElm('#compositeCaseDetailsApp > div > section > header > h1').then((targetElm) => {
            targetElm.appendChild(buttonContainer);

            document.querySelector('#parseParagonPage button').addEventListener('click', () => {
                parseParagonPage();
                paragonClicked = true;
            });

            document.querySelector('#fillWinstonForm button').addEventListener('click', () => {
                if (paragonClicked) {
                    GM_openInTab(prefix_paragon, { active: true, insert: true });
                } else {
                    alert('请先获取Paragon信息');
                }
            });
        });
    }

    if (currentUrl.includes('https://fe.winston.a2z.com/JP/task')) {
        fillWinstonForm();
        paragonClicked = false

    }

})();
